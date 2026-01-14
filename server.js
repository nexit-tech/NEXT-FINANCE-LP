// server.js (Versão Ultra-Segura: Criação via Webhook)
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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

app.use(cors());

// --- 1. WEBHOOK (O CORAÇÃO DO SISTEMA AGORA) ---
// Precisa vir ANTES do app.use(express.json())
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`⚠️ Erro no Webhook: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    const objeto = event.data.object;

    // EVENTO CHAVE: Quando a primeira fatura da assinatura é paga com sucesso
    if (event.type === 'invoice.payment_succeeded') {
      const customerId = objeto.customer;
      const customer = await stripe.customers.retrieve(customerId);
      
      console.log(`💰 Pagamento aprovado para: ${customer.email}`);

      const validade = new Date();
      validade.setDate(validade.getDate() + 32);

      // SÓ AGORA CRIAMOS OU ATIVAMOS O USUÁRIO NO BANCO
      const { error } = await supabaseAdmin.from('usuarios').upsert({
        telefone: customer.phone,
        nome: customer.name,
        stripe_customer_id: customerId,
        ativo: true,
        assinatura_expira_em: validade.toISOString()
      }, { onConflict: 'telefone' });

      if (error) console.error("❌ Erro ao criar usuário no Supabase:", error);
      else console.log("✅ Usuário criado/ativado com sucesso pós-pagamento!");
    }

    // Se a assinatura for cancelada ou o pagamento de renovação falhar
    if (event.type === 'customer.subscription.deleted' || event.type === 'invoice.payment_failed') {
      const customerId = objeto.customer;
      console.log(`🚫 Bloqueando acesso: ${customerId}`);
      await supabaseAdmin.from('usuarios').update({ ativo: false }).eq('stripe_customer_id', customerId);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("❌ Erro interno no processamento do webhook:", error);
    res.status(500).send("Erro interno");
  }
});

// Middleware para JSON (Apenas para as outras rotas)
app.use(express.json());

// --- 2. ROTA DE SUBSCRIBE (APENAS PREPARA O CHECKOUT) ---
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email, name, phone, priceId } = req.body;
    console.log("🔃 Iniciando intenção de compra para:", email);

    // Formatação do telefone para padrão internacional (55...)
    const onlyNumbers = phone.replace(/\D/g, '');
    const finalPhone = onlyNumbers.startsWith('55') && onlyNumbers.length > 11 
        ? onlyNumbers 
        : `55${onlyNumbers}`;

    // Criamos o cliente na Stripe primeiro para guardar o telefone e nome
    const customer = await stripe.customers.create({
      email,
      name,
      phone: finalPhone
    });

    // Criamos a assinatura mas ela começa como 'incomplete'
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    // IMPORTANTE: Aqui não damos UPSERT no banco! 
    // O banco só saberá dele quando o Webhook disparar.

    res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar assinatura:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// --- 3. ROTA DE ATUALIZAÇÃO (PERFIL) ---
app.post('/api/update-profile', async (req, res) => {
  try {
    const { phone, objetivo, renda, dia } = req.body;
    const onlyNumbers = phone.replace(/\D/g, '');
    const finalPhone = onlyNumbers.startsWith('55') && onlyNumbers.length > 11 
        ? onlyNumbers 
        : `55${onlyNumbers}`;

    const { error } = await supabaseAdmin
      .from('usuarios')
      .update({
        objetivo,
        renda_mensal: parseFloat(renda.replace(/[^\d,]/g, '').replace(',', '.')),
        dia_fechamento: parseInt(dia),
        setup_concluido: true
      })
      .eq('telefone', finalPhone);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve o Front-end
app.use(express.static(path.join(__dirname, 'dist')));
app.get(/.*/, (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));

app.listen(port, () => console.log(`🚀 Servidor voando na porta ${port}`));