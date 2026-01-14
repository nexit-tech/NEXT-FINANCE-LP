// src/components/LoadingScreen/index.tsx
import styles from './LoadingScreen.module.css';
import { useEffect, useState } from 'react';

export const LoadingScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Força o loader a ficar pelo menos 1.5 segundos para dar tempo de carregar os ícones
    // E também para o usuário ver a animação da marca (efeito premium)
    const timer = setTimeout(() => {
      setFadeOut(true);
      // Aguarda a animação de fade out terminar antes de desmontar
      setTimeout(onFinish, 500); 
    }, 1500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div 
      className={styles.container} 
      style={{ 
        opacity: fadeOut ? 0 : 1, 
        transition: 'opacity 0.5s ease-out',
        pointerEvents: fadeOut ? 'none' : 'all'
      }}
    >
      <div className={styles.spinner} />
      <div className={styles.logoText}>Next Finance</div>
    </div>
  );
};