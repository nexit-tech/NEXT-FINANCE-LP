// src/components/Success/index.tsx
import { useState, useEffect } from 'react';
import styles from './Success.module.css';
import { ArrowRight, Check, DollarSign, Calendar, Target, Bot, Sparkles } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export const Success = () => {
  const [searchParams] = useSearchParams();
  
  // --- LÓGICA DE RECUPERAÇÃO BLINDADA ---
  const getInitialPhone = () => {
    // 1. Tenta pegar da URL (Prioridade)
    const fromUrl = searchParams.get('phone');
    if (fromUrl) return fromUrl;
    
    // 2. Se falhar, tenta pegar do navegador (Backup)
    const fromStorage = localStorage.getItem('nextfinance_user_phone');
    if (fromStorage) return fromStorage;
    
    return '';
  };

  const [phone, setPhone] = useState(getInitialPhone());
  
  const [step, setStep] = useState(0); 
  const [loading, setLoading] = useState(false);

  // Estados do Formulário
  const [objetivo, setObjetivo] = useState('');
  const [renda, setRenda] = useState('');
  const [dia, setDia] = useState('');

  const WHATSAPP_NUMBER = "5522998545203";
  const skipLink = `https://wa.me/${WHATSAPP_NUMBER}?text=Oi%20IA,%20quero%20come%C3%A7ar!`;
  const finalLink = `https://wa.me/${WHATSAPP_NUMBER}?text=Oi%20IA,%20acabei%20de%20configurar%20meu%20perfil!`;

  // Garante atualização caso a URL carregue depois do componente montar
  useEffect(() => {
    const urlP = searchParams.get('phone');
    if (urlP && urlP !== phone) setPhone(urlP);
  }, [searchParams]);

  const handleRendaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (!rawValue) { setRenda(''); return; }
    const numberValue = parseFloat(rawValue) / 100;
    const formatted = numberValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    setRenda(formatted);
  };

  const finishSetup = async () => {
    let finalPhone = phone;
    
    // Se a blindagem falhar (muito raro), pede manual
    if (!finalPhone) {
        const manualPhone = prompt("Por favor, confirme seu WhatsApp (com DDD):");
        if (manualPhone) {
             finalPhone = manualPhone;
             setPhone(manualPhone);
        } else {
             return; 
        }
    }

    setLoading(true);
    try {
        const API_URL = import.meta.env.DEV 
            ? "http://localhost:3000/api/update-profile" 
            : "/api/update-profile";

        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phone: finalPhone,
                objetivo,
                renda: renda.replace(/[^\d,]/g, '').replace(',', '.') || '0', 
                dia: dia || '1'
            })
        });
        
        // Limpa o storage para não ficar lixo, mas só depois de salvar com sucesso
        localStorage.removeItem('nextfinance_user_phone');
        
        setStep(4); 
    } catch (error) {
        console.error("Erro setup:", error);
        setStep(4);
    } finally {
        setLoading(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 0: // Intro
        return (
          <div className={styles.fadeIn}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <div style={{ 
                    width: 80, height: 80, background: '#ccf300', borderRadius: '50%', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 30px rgba(204, 243, 0, 0.3)'
                }}>
                    <Check size={40} color="#022c22" strokeWidth={4} />
                </div>
            </div>
            
            <h1 className={styles.stepTitle}>Pagamento Confirmado!</h1>
            <p className={styles.stepDesc}>
              Seu acesso ao Next Finance Pro já está liberado. <br/>
              Vamos calibrar sua IA em 30 segundos?
            </p>
            
            {/* Aviso visual caso o telefone não tenha sido capturado */}
            {!phone && (
                <p style={{color: '#f87171', fontSize: '0.85rem', marginTop: -10, marginBottom: 20, background: 'rgba(255,0,0,0.1)', padding: '8px', borderRadius: '8px'}}>
                   ⚠️ Aviso: Número não identificado automaticamente.
                </p>
            )}

            <button className={styles.actionButton} onClick={() => setStep(1)}>
              Configurar Agora <ArrowRight size={20} />
            </button>
            
            <a href={skipLink} target="_blank" className={styles.skipButton}>
              Pular para o WhatsApp
            </a>
          </div>
        );

      case 1: // Objetivo
        return (
          <div className={styles.fadeIn}>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Target size={50} color="#ccf300" style={{marginBottom: 20}} />
            </div>
            <h2 className={styles.stepTitle}>Qual seu foco principal?</h2>
            <p className={styles.stepDesc}>Isso ajuda a IA a te dar conselhos melhores.</p>
            
            <div className={styles.optionsGrid}>
              {['Sair das Dívidas', 'Juntar Dinheiro', 'Apenas Organizar', 'Investir Melhor'].map(opt => (
                <div 
                    key={opt}
                    className={`${styles.optionCard} ${objetivo === opt ? styles.selected : ''}`}
                    onClick={() => setObjetivo(opt)}
                >
                    {opt}
                </div>
              ))}
            </div>
            
            <button 
                className={styles.actionButton} 
                onClick={() => setStep(2)}
                disabled={!objetivo}
            >
              Próximo
            </button>
          </div>
        );

      case 2: // Renda
        return (
          <div className={styles.fadeIn}>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <DollarSign size={50} color="#ccf300" style={{marginBottom: 20}} />
            </div>
            <h2 className={styles.stepTitle}>Qual sua renda mensal?</h2>
            <p className={styles.stepDesc}>Valor aproximado (pode mudar depois).</p>
            
            <input 
                type="text"
                inputMode="numeric" 
                className={styles.inputBig} 
                placeholder="R$ 0,00"
                value={renda}
                onChange={handleRendaChange}
                autoFocus
            />
            
            <button 
                className={styles.actionButton} 
                onClick={() => setStep(3)}
                disabled={!renda || renda === 'R$ 0,00'}
            >
              Próximo
            </button>
          </div>
        );

      case 3: // Dia Fechamento
        return (
          <div className={styles.fadeIn}>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Calendar size={50} color="#ccf300" style={{marginBottom: 20}} />
            </div>
            <h2 className={styles.stepTitle}>Dia de fechamento?</h2>
            <p className={styles.stepDesc}>Quando vira o mês financeiro pra você?</p>
            
            <input 
                type="number" 
                className={styles.inputBig} 
                placeholder="Ex: 5"
                max={31}
                min={1}
                value={dia}
                onChange={(e) => setDia(e.target.value)}
                autoFocus
            />
            
            <button 
                className={styles.actionButton} 
                onClick={finishSetup}
                disabled={loading || !dia}
            >
              {loading ? "Salvando..." : "Finalizar Setup"}
            </button>
          </div>
        );

      case 4: // Final
        return (
          <div className={styles.fadeIn}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                <div style={{ position: 'relative' }}>
                    <Bot size={80} color="#ccf300" strokeWidth={1.5} />
                    <Sparkles size={30} color="#fff" style={{ position: 'absolute', top: -10, right: -10 }} fill="#fff" />
                </div>
            </div>
            
            <h1 className={styles.stepTitle}>Tudo Pronto!</h1>
            
            <p className={styles.stepDesc}>
              Sua IA já foi treinada com seu perfil. <br/>
              Agora é só mandar um "Oi" no WhatsApp.
            </p>
            
            <a 
                href={finalLink}
                target="_blank"
                className={styles.actionButton}
                style={{ textDecoration: 'none', backgroundColor: '#25D366', color: 'white' }}
            >
               Chamar no WhatsApp
            </a>
          </div>
        );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        
        {step > 0 && step < 4 && (
            <div className={styles.progressContainer}>
                <div className={styles.progressBar} style={{ width: `${(step / 3) * 100}%` }} />
            </div>
        )}

        {renderStep()}

      </div>
    </div>
  );
};