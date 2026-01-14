// src/components/Legal/Terms.tsx
import styles from './Legal.module.css';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Terms = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentBox}>
        
        <Link to="/" className={styles.backButton}>
          <ArrowLeft size={20} />
          Voltar para Home
        </Link>

        <h1 className={styles.title}>Termos de Uso</h1>
        <span className={styles.lastUpdate}>Última atualização: Janeiro de 2026</span>

        <div className={styles.textBody}>
          <p>
            Bem-vindo ao Next Finance. Ao acessar ou usar nosso serviço automatizado via WhatsApp, você concorda em cumprir estes termos.
          </p>

          <h2>1. O Serviço</h2>
          <p>
            O Next Finance é um assistente financeiro baseado em Inteligência Artificial que opera através do WhatsApp. O serviço coleta mensagens de texto enviadas pelo usuário para categorizar despesas e gerar relatórios financeiros.
          </p>

          <h2>2. Assinatura e Pagamentos</h2>
          <p>
            O serviço é oferecido mediante uma assinatura mensal recorrente de R$ 9,99.
          </p>
          <ul>
            <li>O pagamento é processado de forma segura pela Stripe.</li>
            <li>A renovação é automática a cada 30 dias.</li>
            <li>Caso o pagamento falhe, o acesso ao bot será temporariamente suspenso até a regularização.</li>
          </ul>

          <h2>3. Cancelamento</h2>
          <p>
            Você pode cancelar sua assinatura a qualquer momento. O cancelamento interrompe a cobrança futura, mas o serviço permanecerá ativo até o fim do período já pago. Não oferecemos reembolso por períodos parciais não utilizados.
          </p>

          <h2>4. Limitação de Responsabilidade</h2>
          <p>
            Embora utilizemos IA avançada para categorizar seus gastos, o Next Finance não substitui um contador profissional ou consultor financeiro. Não nos responsabilizamos por decisões financeiras tomadas com base nos relatórios gerados. Erros de interpretação da IA podem ocorrer.
          </p>

          <h2>5. Uso Aceitável</h2>
          <p>
            Você concorda em não usar o bot para enviar conteúdo ilícito, ofensivo ou malicioso. Reservamo-nos o direito de banir usuários que violem esta política sem aviso prévio.
          </p>

        </div>
      </div>
    </div>
  );
};