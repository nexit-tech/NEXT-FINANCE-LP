// server.js (Versão Blindada - Só ativa DEPOIS de pagar)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (!process.env.STRIPE_SECRET_KEY?.startsWith('sk_')) {
    console.error("🚨 ERRO: Verifique a STRIPE_SECRET_KEY no .env");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

app.use(cors());

// --- WEBHOOK (PRECISA VIR ANTES DO EXPRESS.JSON) ---
// É aqui que a mágica acontece. O Webhook é o único que tem poder de ativar a conta.
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) { 
    console.error(`⚠️ Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`); 
  }

  // LOG PARA VOCÊ VER NO TERMINAL QUANDO O PAGAMENTO CAIR
  console.log(`🔔 Evento Webhook Recebido: ${event.type}`);

  try {
      const objeto = event.data.object;
      
      // O evento 'invoice.payment_succeeded' acontece na primeira compra E nas renovações
      if (event.type === 'invoice.payment_succeeded') {
          const customerId = objeto.customer;
          console.log(`💰 PAGAMENTO CONFIRMADO! Ativando usuário: ${customerId}`);
          
          const validade = new Date();
          validade.setDate(validade.getDate() + 32); // Dá 32 dias de acesso

          // AQUI É A ÚNICA HORA QUE O USUÁRIO FICA ATIVO
          const { error } = await supabaseAdmin.from('usuarios')
              .update({ 
                  ativo: true, 
                  assinatura_expira_em: validade.toISOString() 
              })
              .eq('stripe_customer_id', customerId);

          if(error) console.error("❌ Erro ao ativar usuário no banco:", error);
      }

      // Se falhar o pagamento ou cancelar, corta o acesso
      if (event.type === 'invoice.payment_failed' || event.type === 'customer.subscription.deleted') {
          const customerId = objeto.customer;
          console.log(`🚫 Pagamento falhou ou cancelado. Bloqueando: ${customerId}`);
          await supabaseAdmin.from('usuarios').update({ ativo: false }).eq('stripe_customer_id', customerId);
      }

      res.json({ received: true });
  } catch (error) { 
      console.error("❌ Erro interno no Webhook:", error);
      res.status(500).send("Erro interno"); 
  }
});

// Daqui pra baixo usamos JSON normal
app.use(express.json());

// --- ROTA DE ASSINATURA (CRIAÇÃO) ---
app.post('/api/subscribe', async (req, res) => {
  try {
    let { email, name, phone, priceId } = req.body;
    console.log("🔃 Checkout iniciado:", email);

    // 1. Formatação do Telefone
    const onlyNumbers = phone.replace(/\D/g, '');
    const finalPhone = onlyNumbers.startsWith('55') && onlyNumbers.length > 11 
        ? onlyNumbers 
        : `55${onlyNumbers}`;

    // 2. Cria Cliente Stripe
    const customer = await stripe.customers.create({ 
        email, 
        name, 
        phone: finalPhone 
    });

    // 3. Cria Assinatura (Status: Incomplete - Aguardando Pagamento)
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { 
        save_default_payment_method: 'on_subscription',
        payment_method_types: ['card'] 
      },
      expand: ['latest_invoice.payment_intent'],
    });

    // 4. SALVA NO BANCO COMO INATIVO (A MUDANÇA ESTÁ AQUI!)
    // O usuário entra no banco para garantirmos o registro, mas a porta está fechada (ativo: false).
    // Só o Webhook vai ter a chave para mudar isso para true.
    const validade = new Date();
    validade.setDate(validade.getDate() + 30); 

    await supabaseAdmin.from('usuarios').upsert({ 
        telefone: finalPhone, 
        nome: name, 
        stripe_customer_id: customer.id, 
        ativo: false, // <--- TRAVADO ATÉ O PAGAMENTO CAIR
        assinatura_expira_em: validade.toISOString()
    }, { onConflict: 'telefone' });

    // 5. Devolve o Segredo para o Frontend terminar o pagamento
    let invoice = subscription.latest_invoice;
    let clientSecret = invoice?.payment_intent?.client_secret;

    if (!clientSecret) {
        // Fallback caso não venha expandido
        const invoiceId = typeof invoice === 'string' ? invoice : invoice.id;
        const fullInvoice = await stripe.invoices.retrieve(invoiceId, { expand: ['payment_intent'] });
        clientSecret = fullInvoice.payment_intent?.client_secret;
    }

    if (!clientSecret) throw new Error("Stripe não retornou link de pagamento.");

    console.log("📝 Usuário registrado (Pendente de Pagamento).");
    res.json({ subscriptionId: subscription.id, clientSecret });

  } catch (error) {
    console.error('❌ Erro API:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.use(express.static(path.join(__dirname, 'dist')));
app.get(/.*/, (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));

// --- ROTA DE ATUALIZAÇÃO DE PERFIL ---
app.post('/api/update-profile', async (req, res) => {
  try {
    const { phone, objetivo, renda, dia } = req.body;

    if (!phone) throw new Error("Telefone obrigatório.");

    const onlyNumbers = phone.replace(/\D/g, '');
    const finalPhone = onlyNumbers.startsWith('55') && onlyNumbers.length > 11 
        ? onlyNumbers 
        : `55${onlyNumbers}`;

    console.log(`📝 Atualizando perfil de: ${finalPhone}`);

    const { error } = await supabaseAdmin
      .from('usuarios')
      .update({
        objetivo,
        renda_mensal: parseFloat(renda),
        dia_fechamento: parseInt(dia),
        setup_concluido: true
      })
      .eq('telefone', finalPhone);

    if (error) throw error;

    res.json({ success: true });

  } catch (error) {
    console.error('❌ Erro Update Profile:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => console.log(`🚀 Rodando na porta ${port}`));