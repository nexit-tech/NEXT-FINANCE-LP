// src/components/Footer/index.tsx
import styles from './Footer.module.css';
import { Instagram, Mail } from 'lucide-react';
import { Link } from 'react-router-dom'; // <--- Importante

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        <div className={styles.topSection}>
          
          <div className={styles.brandColumn}>
            <h3>Next Finance</h3>
            <p>
              A revolução financeira que cabe no seu bolso e vive no seu WhatsApp. 
              Simples, automático e inteligente.
            </p>
          </div>

          <div className={styles.column}>
            <h4>Legal</h4>
            <ul className={styles.list}>
              {/* Links atualizados */}
              <li><Link to="/terms">Termos de Uso</Link></li>
              <li><Link to="/privacy">Privacidade</Link></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4>Contato</h4>
            <ul className={styles.list}>
              <li>
                <a 
                  href="https://instagram.com/nexit.tech" 
                  target="_blank" 
                  rel="noreferrer"
                  className={styles.iconLink}
                >
                  <Instagram size={18} />
                  @nexit.tech
                </a>
              </li>
              <li>
                <a href="mailto:contato@nexit.tech" className={styles.iconLink}>
                  <Mail size={18} />
                  contato@nexit.tech
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className={styles.bottomSection}>
          <span className={styles.copyText}>
            © {currentYear} Next Finance AI. Todos os direitos reservados.
          </span>
          
          <span className={styles.credits}>
            by nexit.tech
          </span>
        </div>

      </div>
    </footer>
  );
};