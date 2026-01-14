// src/components/Hero/index.tsx
import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useTransform, useMotionValue, useMotionValueEvent } from 'framer-motion';
import styles from './Hero.module.css';
import { PhoneMockup } from "./PhoneMockup";
import { Banner } from "../Banner";

const WORDS = [
  "Planejamento", "Economia", "Futuro", "Liberdade", 
  "Contas", "Investimento", "Segurança", "Crescimento", 
  "Pagar", "Receber", "Agora", "Aqui", "Meta", "Sonho",
  "Controle", "Pix", "Grana", "Sucesso"
];

const random = (min: number, max: number) => Math.random() * (max - min) + min;

export const Hero = () => {
  const marqueeText = "CONTROLE TOTAL • NO SEU WHATSAPP • SEM PLANILHAS • ";
  const [floatingWords, setFloatingWords] = useState<any[]>([]);
  
  const scrollProgress = useMotionValue(0);
  const smoothProgress = useSpring(scrollProgress, {
    stiffness: 70, 
    damping: 20,    
    restDelta: 0.001
  });

  const [showBanner, setShowBanner] = useState(false);

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    if (latest > 0.65) { 
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
  });

  const accumulatedScrollRef = useRef(0);
  const touchStartRef = useRef(0);
  const SCROLL_THRESHOLD = 900; 

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const isAtTop = window.scrollY === 0;
      if (e.deltaY > 0 && isAtTop) {
        if (accumulatedScrollRef.current < SCROLL_THRESHOLD) {
          e.preventDefault();
          accumulatedScrollRef.current += e.deltaY;
        }
      } else if (e.deltaY < 0 && isAtTop) {
        if (accumulatedScrollRef.current > 0) {
          e.preventDefault();
          accumulatedScrollRef.current += e.deltaY;
        }
      }
      updateScroll();
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const diff = touchStartRef.current - currentY;
      touchStartRef.current = currentY; 
      const isAtTop = window.scrollY === 0;

      if (isAtTop && diff !== 0) {
        const sensitivity = 2.5; 
        const delta = diff * sensitivity;
        if (delta > 0) { 
          if (accumulatedScrollRef.current < SCROLL_THRESHOLD) {
            if (e.cancelable) e.preventDefault();
            accumulatedScrollRef.current += delta;
          }
        } else { 
          if (accumulatedScrollRef.current > 0) {
            if (e.cancelable) e.preventDefault();
            accumulatedScrollRef.current += delta;
          }
        }
        updateScroll();
      }
    };

    const updateScroll = () => {
      accumulatedScrollRef.current = Math.max(0, Math.min(SCROLL_THRESHOLD, accumulatedScrollRef.current));
      const progress = accumulatedScrollRef.current / SCROLL_THRESHOLD;
      scrollProgress.set(progress);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [scrollProgress]);

  const phoneRotation = useTransform(smoothProgress, [0, 0.3], [-15, 0]);
  const phoneScale = useTransform(smoothProgress, [0, 0.4, 0.6], [0.85, 2, 3]);
  const greenScale = useTransform(smoothProgress, [0.5, 0.75], [1, 100]); 
  const phoneUiOpacity = useTransform(smoothProgress, [0.3, 0.5], [1, 0]);
  const bgOpacity = useTransform(smoothProgress, [0, 0.25], [1, 0]);
  const greenOverlayOpacity = useTransform(smoothProgress, [0.4, 0.5], [0, 1]);
  
  const bannerOpacity = useTransform(smoothProgress, [0.75, 0.9], [0, 1]);
  const bannerPointerEvents = useTransform(smoothProgress, (v) => v > 0.8 ? 'auto' : 'none');

  const shadowFilter = useTransform(
    smoothProgress,
    (v) => v < 0.6 ? 'drop-shadow(0 40px 60px rgba(0,0,0,0.2))' : 'none'
  );

  useEffect(() => {
    const newWords = WORDS.map((text, i) => {
      const isTopZone = Math.random() > 0.5;
      return {
        id: i,
        text,
        style: {
          top: `${isTopZone ? random(5, 30) : random(70, 90)}%`,
          left: `${random(2, 90)}%`,
          fontSize: `${random(1.5, 3)}rem`,
          animationDelay: `${random(0, 5)}s`,
          animationDuration: `${random(4, 7)}s`
        }
      };
    });
    setFloatingWords(newWords);
  }, []);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.stickyContent}>
        
        <motion.div 
          style={{ 
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            zIndex: 200, opacity: bannerOpacity, pointerEvents: bannerPointerEvents
          }}
        >
          {showBanner && <Banner />}
        </motion.div>

        {/* --- CORREÇÃO AQUI: O gradiente agora está nesta div que sofre Fade Out --- */}
        <motion.div style={{ 
          opacity: bgOpacity, 
          width: '100%', 
          height: '100%', 
          position: 'absolute', 
          zIndex: 1,
          background: 'radial-gradient(circle at 50% 40%, #ffffff 60%, #f0fdf4 100%)' // Gradiente veio pra cá
        }}>
          {floatingWords.map((word) => (
            <span key={word.id} className={styles.floatingWord} style={word.style}>
              {word.text}
            </span>
          ))}

          <div className={styles.marqueeContainer}>
            <div className={styles.marqueeTrack}>
              <span className={styles.bigText}>{marqueeText}</span>
              <span className={styles.bigText}>{marqueeText}</span>
            </div>
            <div className={styles.marqueeTrackReverse}>
              <span className={styles.bigText}>INTELIGÊNCIA ARTIFICIAL • FINANCEIRA • </span>
              <span className={styles.bigText}>INTELIGÊNCIA ARTIFICIAL • FINANCEIRA • </span>
            </div>
          </div>

          <div className={styles.floatingTitle}>
            <h1>Sua Liberdade Financeira<br/>Começa <span>Aqui.</span></h1>
          </div>
        </motion.div>

        <motion.div 
          className={styles.phoneWrapper}
          style={{ scale: phoneScale, rotate: phoneRotation, filter: shadowFilter, zIndex: 10 }}
        >
          <div className={styles.phonePhysicalBody}>
            <PhoneMockup uiOpacity={phoneUiOpacity} />
            <motion.div 
              className={styles.greenScreenOverlay}
              style={{ opacity: greenOverlayOpacity, scale: greenScale }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};