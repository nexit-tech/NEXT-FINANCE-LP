// src/components/Banner/index.tsx
import styles from './Banner.module.css';
import { ArrowRight } from 'lucide-react';
import { motion, type Variants } from 'framer-motion'; 
import { useNavigate } from 'react-router-dom'; // <--- 1. Importação necessária

import bombIcon from '../Icons/bomb.svg';
import cutIcon from '../Icons/cut.svg';
import graphIcon from '../Icons/graph.svg';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
  exit: { 
    opacity: 0, 
    y: -50, 
    transition: { duration: 0.5 } 
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 }, 
  visible: { 
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", stiffness: 50, damping: 15 } 
  },
  exit: { opacity: 0, y: 20 }
};

export const Banner = () => {
  const navigate = useNavigate(); // <--- 2. Inicializa o hook de navegação

  return (
    <section className={styles.container}>
      <motion.div 
        className={styles.content}
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: false, amount: 0.3 }} 
      >
        
        <motion.div variants={itemVariants}>
          <h2>
            CANSADO DE TRABALHAR <br/>
            E O DINHEIRO <span className={styles.highlight}>SUMIR?</span>
          </h2>
          <p>
            A conta não fecha? Pare de adivinhar.
            <br/>Assuma o controle total agora.
          </p>
          
          {/* 3. Adicionado o evento onClick para navegar */}
          <button className={styles.ctaButton} onClick={() => navigate('/checkout')}>
            Quero Assumir o Controle
            <ArrowRight size={22} strokeWidth={2.5} />
          </button>
        </motion.div>
        
        <motion.div className={styles.cards} variants={containerVariants}>
           <motion.div className={styles.card} variants={itemVariants}>
              <div className={styles.iconWrapper}><img src={bombIcon} alt="Dinheiro Explosivo" /></div>
              <div><h3>Dinheiro Explosivo?</h3><span>Gastos fantasmas que destroem seu planejamento.</span></div>
           </motion.div>

           <motion.div className={styles.card} variants={itemVariants}>
              <div className={styles.iconWrapper}><img src={cutIcon} alt="Raio-X Financeiro" /></div>
              <div><h3>Raio-X dos Gastos</h3><span>Categorização automática para você cortar o mal pela raiz.</span></div>
           </motion.div>

           <motion.div className={styles.card} variants={itemVariants}>
              <div className={styles.iconWrapper}><img src={graphIcon} alt="Fim das Planilhas" /></div>
              <div><h3>Fim das Planilhas</h3><span>Relatórios prontos e gráficos bonitos direto no WhatsApp.</span></div>
           </motion.div>
        </motion.div>

      </motion.div>
    </section>
  );
};