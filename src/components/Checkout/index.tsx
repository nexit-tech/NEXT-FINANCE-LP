// src/components/Checkout/index.tsx
import { useState } from 'react';
import styles from './Checkout.module.css';
import { ArrowLeft, Check, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

// Stripe Imports
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Inicializa o Stripe com sua chave pública
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// --- FORMULÁRIO DO STRIPE ---
const CheckoutForm = ({ customerDetails }: { customerDetails: { name: string; email: string; phone: string } }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    // Salva o telefone no navegador para recuperação na tela de sucesso
    localStorage.setItem('nextfinance_user_phone', customerDetails.phone);

    const returnUrl = `${window.location.origin}/success?phone=${encodeURIComponent(customerDetails.phone)}`;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
        payment_method_data: {
            billing_details: {
                name: customerDetails.name,
                email: customerDetails.email,
                phone: customerDetails.phone
            }
        }
      },
    });

    if (error) setMessage(error.message || "Erro inesperado.");
    setIsLoading(false);
  };

  return (
    <form className={styles.formGrid} onSubmit={handleSubmit}>
      {/* O PaymentElement gerencia Cartão, Apple Pay e Google Pay automaticamente */}
      <PaymentElement 
        id="payment-element" 
        options={{ 
          layout: 'tabs', // 'tabs' faz o Apple/Google Pay aparecerem em botões de destaque no topo
          wallets: {
            applePay: 'auto',
            googlePay: 'auto'
          }
        }} 
      />
      
      {message && <div style={{color: '#ef4444', fontSize: '0.9rem', marginTop: '10px'}}>{message}</div>}

      <button disabled={isLoading || !stripe || !elements} className={styles.payButton}>
        <Lock size={18} />
        {isLoading ? "Processando..." : "Finalizar Pagamento"}
      </button>

      <div className={styles.secureBadge}>
        <Lock size={12} />
        Pagamento 100% seguro via Stripe
      </div>
    </form>
  );
};

// --- PÁGINA PRINCIPAL ---
export const Checkout = () => {
  const [step, setStep] = useState(1);
  const [loadingSecret, setLoadingSecret] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); 
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 2) value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    if (value.length > 10) value = `${value.slice(0, 10)}-${value.slice(10)}`;
    setPhone(value);
  };

  const initializePayment = async () => {
    const rawPhone = phone.replace(/\D/g, '');

    if(!name || !email || rawPhone.length < 11) {
        alert("Por favor preencha todos os campos corretamente.");
        return;
    }

    setLoadingSecret(true);
    
    const API_URL = import.meta.env.DEV 
        ? "http://localhost:3000/api/subscribe" 
        : "/api/subscribe";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                name, 
                email, 
                phone, 
                priceId: "price_1SpMOiPcTSpOuKiPBVLA1FGG" 
            }),
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        setClientSecret(data.clientSecret);
        setStep(2);

    } catch (error: any) {
        console.error("Erro:", error);
        alert("Erro no servidor: " + error.message);
    } finally {
        setLoadingSecret(false);
    }
  };

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#059669',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      fontFamily: '"Montserrat", sans-serif',
      borderRadius: '12px',
    },
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.checkoutBox}>
        
        <div className={styles.summarySide}>
          <div>
            <Link to="/" className={styles.backButton}>
              <ArrowLeft size={18} />
              Voltar
            </Link>
            
            <div className={styles.planTitle}>Next Finance Pro</div>
            <div className={styles.mainPrice}>
              R$ 9,99<span>/mês</span>
            </div>

            <ul className={styles.featureList}>
              <li><Check size={16} color="#ccf300" /> Integração WhatsApp Ilimitada</li>
              <li><Check size={16} color="#ccf300" /> Relatórios Semanais</li>
              <li><Check size={16} color="#ccf300" /> Categorização por IA</li>
              <li><Check size={16} color="#ccf300" /> Suporte Prioritário</li>
            </ul>
          </div>
          
          <div style={{ opacity: 0.6, fontSize: '0.8rem', marginTop: 'auto' }}>
            Cobrança recorrente. Cancele quando quiser.
          </div>
        </div>

        <div className={styles.paymentSide}>
          <h2>{step === 1 ? "Seus Dados" : "Pagamento"}</h2>
          
          {step === 1 && (
             <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label>Nome Completo</label>
                  <input 
                    type="text" 
                    placeholder="Seu nome" 
                    className={styles.inputField}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>E-mail</label>
                  <input 
                    type="email" 
                    placeholder="seu@email.com" 
                    className={styles.inputField}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Celular (WhatsApp)</label>
                  <input 
                    type="tel" 
                    placeholder="(11) 99999-9999" 
                    className={styles.inputField}
                    value={phone}
                    maxLength={15}
                    onChange={handlePhoneChange}
                  />
                </div>

                <button 
                    className={styles.payButton} 
                    onClick={initializePayment}
                    disabled={loadingSecret}
                >
                  {loadingSecret ? "Preparando..." : "Continuar para Pagamento"}
                </button>
             </div>
          )}

          {step === 2 && clientSecret && (
             <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
                <CheckoutForm 
                    customerDetails={{ name, email, phone }} 
                />
             </Elements>
          )}

        </div>
      </div>
    </div>
  );
};