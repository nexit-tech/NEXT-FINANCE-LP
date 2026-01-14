// src/components/Features/index.tsx
import styles from './Features.module.css';
import { motion, type Variants } from 'framer-motion'; // <--- A CORREÇÃO ESTÁ AQUI (Adicionei "type")

// Ícones
import brainIcon from '../Icons/brain.svg';
import whatsappIcon from '../Icons/whatsapp.svg';
import inflationIcon from '../Icons/inflation.svg'; 

// Imagem
import womanImage from '../../assets/woman.png'; 

const allFeatures = [
  {
    icon: brainIcon,
    title: "Cérebro IA",
    desc: "O bot organiza, você aprende. Ganhe clareza sobre seus hábitos num piscar de olhos.",
    color: "#ccf300"
  },
  {
    icon: inflationIcon, 
    title: "Filtro Inteligente",
    desc: "Adeus extratos confusos. Veja exatamente para onde seu dinheiro vai.",
    color: "#4ade80"
  },
  {
    icon: whatsappIcon,
    title: "100% no WhatsApp",
    desc: "Sem baixar nada. Mandou uma mensagem: tá registrado na hora.",
    color: "#25D366"
  }
];

// Agora o TypeScript sabe que isso é um tipo
const containerListVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, 
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { type: "spring", stiffness: 50, damping: 20 }
  }
};

export const Features = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        
        {/* --- COLUNA ESQUERDA: MULHER GIGANTE --- */}
        <motion.div 
          className={styles.columnImage}
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className={styles.glowEffect} />
          <img 
            src={womanImage} 
            alt="Usuária Next Finance" 
            className={styles.womanImg} 
          />
        </motion.div>

        {/* --- COLUNA DIREITA: CONTEÚDO --- */}
        <div className={styles.columnContent}>
          
          <motion.div 
            className={styles.header}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>
              ECONOMIZE USANDO <span className={styles.highlight}>IA</span>
            </h2>
            <p>A tecnologia mais avançada do mundo agora trabalha para o seu bolso.</p>
          </motion.div>

          <motion.div 
            className={styles.featuresList}
            variants={containerListVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {allFeatures.map((item, index) => (
              <motion.div 
                key={index} 
                className={styles.featureItem}
                variants={itemVariants}
              >
                <div className={styles.iconBox}>
                  <img src={item.icon} alt={item.title} />
                </div>
                <div className={styles.textArea}>
                  <h3 style={{ color: item.color }}>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>

      </div>
    </section>
  );
};