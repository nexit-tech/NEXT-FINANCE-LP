// src/components/Legal/Privacy.tsx
import styles from './Legal.module.css';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Privacy = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentBox}>
        
        <Link to="/" className={styles.backButton}>
          <ArrowLeft size={20} />
          Voltar para Home
        </Link>

        <h1 className={styles.title}>Política de Privacidade</h1>
        <span className={styles.lastUpdate}>Última atualização: Janeiro de 2026</span>

        <div className={styles.textBody}>
          <p>
            Sua privacidade é nossa prioridade. Esta política descreve como o Next Finance coleta, usa e protege suas informações.
          </p>

          <h2>1. Dados Coletados</h2>
          <p>
            Para o funcionamento do serviço, coletamos:
          </p>
          <ul>
            <li><strong>Informações de Cadastro:</strong> Nome, e-mail e número de telefone (WhatsApp).</li>
            <li><strong>Dados Financeiros:</strong> Mensagens que você envia voluntariamente para o bot contendo informações sobre seus gastos.</li>
            <li><strong>Pagamento:</strong> Dados de pagamento são processados exclusivamente pela Stripe; não armazenamos números completos de cartão de crédito.</li>
          </ul>

          <h2>2. Uso das Informações</h2>
          <p>
            Utilizamos seus dados estritamente para:
          </p>
          <ul>
            <li>Processar e categorizar suas despesas via Inteligência Artificial.</li>
            <li>Gerar relatórios e gráficos personalizados.</li>
            <li>Gerenciar sua assinatura e acesso ao serviço.</li>
          </ul>

          <h2>3. Compartilhamento de Dados</h2>
          <p>
            Não vendemos seus dados. Compartilhamos informações apenas com provedores essenciais para a operação:
          </p>
          <ul>
            <li><strong>Stripe:</strong> Para processamento de pagamentos.</li>
            <li><strong>Supabase:</strong> Para armazenamento seguro do banco de dados.</li>
            <li><strong>OpenAI/LLMs:</strong> Para processamento de texto e categorização (os dados são enviados de forma anonimizada quando possível).</li>
          </ul>

          <h2>4. Segurança</h2>
          <p>
            Adotamos medidas rigorosas de segurança para proteger seus dados contra acesso não autorizado. Todas as comunicações são criptografadas.
          </p>

          <h2>5. Seus Direitos</h2>
          <p>
            Você tem o direito de solicitar a exclusão de todos os seus dados financeiros de nossos servidores a qualquer momento, bastando entrar em contato com nosso suporte.
          </p>

        </div>
      </div>
    </div>
  );
};