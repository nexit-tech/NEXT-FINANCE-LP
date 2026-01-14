// src/components/Pricing/index.tsx
import styles from './Pricing.module.css';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // <--- Importe o hook
import payImage from '../../assets/pay.png';

export const Pricing = () => {
  const navigate = useNavigate(); // <--- Inicialize o hook

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        
        <motion.div 
          className={styles.content}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Título vazio mantido como no original */}
          <h2></h2>
          
          <div className={styles.priceWrapper}>
            <span className={styles.currency}>R$</span>
            <span className={styles.priceValue}>9,99</span>
            <span className={styles.period}>/mês</span>
          </div>

          <p className={styles.description}>
            Cancele quando quiser. Sem pegadinhas.<br/>
            O preço de um salgado para organizar sua vida financeira.
          </p>

          {/* Adicionado onClick para navegar */}
          <button className={styles.ctaButton} onClick={() => navigate('/checkout')}>
            Quero Assinar Agora
            <ArrowRight size={24} strokeWidth={3} />
          </button>
        </motion.div>

        <motion.div 
          className={styles.imageWrapper}
          initial={{ opacity: 0, scale: 0.8, x: 50 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className={styles.glow} />
          <img src={payImage} alt="Métodos de Pagamento Seguros" className={styles.payImage} />
        </motion.div>

      </div>
    </section>
  );
};