import styles from './Badge.module.css';

export const Badge = () => (
  <div className={styles.badge}>
    <span className={styles.dot} />
    <span className={styles.text}>New: WhatsApp Integration</span>
  </div>
);