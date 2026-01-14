// src/components/Hero/PhoneMockup.tsx
import { CheckCheck, Mic, Plus, Camera, Phone, Video, ChevronLeft } from "lucide-react";
import { motion, MotionValue } from 'framer-motion';
import styles from './PhoneMockup.module.css';

interface PhoneMockupProps {
  uiOpacity: MotionValue<number>;
}

export const PhoneMockup = ({ uiOpacity }: PhoneMockupProps) => {
  return (
    <div className={styles.phoneFrame}>
      <div className={styles.buttonLeftTop} />
      <div className={styles.buttonLeftBottom} />
      <div className={styles.buttonRight} />

      <div className={styles.screen}>
        
        <motion.div className={styles.statusBar} style={{ opacity: uiOpacity }}>
          <span className={styles.time}>9:41</span>
          <div className={styles.dynamicIsland}>
            <div className={styles.cameraDot} />
          </div>
          <div className={styles.statusIcons}>
            <div className={styles.signalIcon} />
            <div className={styles.wifiIcon} />
            <div className={styles.batteryIcon} />
          </div>
        </motion.div>

        <motion.div className={styles.waHeader} style={{ opacity: uiOpacity }}>
          <div className={styles.headerTopRow}>
            <div className={styles.backButton}>
              <ChevronLeft size={28} color="#007AFF" strokeWidth={2.5} />
              <span>Voltar</span>
            </div>
            
            <div className={styles.headerProfile}>
              <div className={styles.contactInfo}>
                <h4>Next Finance AI <span className={styles.verifiedBadge}></span></h4>
                <p>Business Account</p>
              </div>
            </div>

            <div className={styles.headerIcons}>
              <Video size={24} color="#007AFF" strokeWidth={1.5} />
              <Phone size={24} color="#007AFF" strokeWidth={1.5} style={{marginLeft: 18}} />
            </div>
          </div>
        </motion.div>

        <motion.div className={styles.chatArea} style={{ opacity: uiOpacity }}>
          <div className={styles.dateDivider}>
            <span>Hoje</span>
          </div>

          <div className={`${styles.messageRow} ${styles.received}`}>
            <div className={styles.bubble}>
              <p>Bom dia, Rafa! ☀️ Analisei seus gastos de ontem.</p>
              <span className={styles.msgTime}>09:41</span>
            </div>
          </div>

          <div className={`${styles.messageRow} ${styles.sent}`}>
            <div className={styles.bubble}>
              <p>E aí? Como foi? 😬</p>
              <span className={styles.msgTime}>
                09:42 <CheckCheck size={14} className={styles.readReceipt} />
              </span>
            </div>
          </div>

          <div className={`${styles.messageRow} ${styles.received}`}>
            <div className={styles.bubble}>
              <p>Fica tranquilo! Você economizou <strong>R$ 150,00</strong> evitando aquele jantar fora. 🥗</p>
              <div className={styles.financeCard}>
                <div className={styles.cardIcon}>💰</div>
                <div>
                  <span>Economia Semanal</span>
                  <strong>R$ 840,00</strong>
                </div>
              </div>
              <span className={styles.msgTime}>09:42</span>
            </div>
          </div>
        </motion.div>

        <motion.div className={styles.inputArea} style={{ opacity: uiOpacity }}>
          <Plus size={24} color="#007AFF" />
          <div className={styles.inputWrapper}>
            <input type="text" placeholder="" disabled />
          </div>
          <Camera size={24} color="#007AFF" />
          <Mic size={24} color="#007AFF" />
        </motion.div>
        
        <div className={styles.homeIndicator} />
      </div>
    </div>
  );
};