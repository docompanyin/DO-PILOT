import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteData } from '../context/DataContext';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const { data } = useSiteData();
  const companyLogo = data?.footer?.companyLogo;
  const companyName = data?.footer?.companyName || 'DO PILOT';

  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [imageError, setImageError] = useState(false);
  const onCompleteCalledRef = useRef(false);

  useEffect(() => {
    // Ultra-smooth 0% -> 100% progress animation strictly under 1.5 seconds maximum total:
    // 0% -> 100% counter & bar: 1050ms
    // Brief hold at 100%: 60ms
    // Wipe exit transition: 300ms
    // Total lifetime: ~1.41s
    const startTime = performance.now();
    const TARGET_DURATION = 1050; // ms to reach 100%

    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const rawPct = Math.min(1, elapsed / TARGET_DURATION);
      
      // Smooth sinusoidal cubic easing curve for stutter-free fluid motion
      const easedPct = rawPct < 0.5 
        ? 4 * rawPct * rawPct * rawPct 
        : 1 - Math.pow(-2 * rawPct + 2, 3) / 2;
      const currentVal = Math.min(100, Math.floor(easedPct * 100));

      setProgress(currentVal);

      if (rawPct < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        // Brief pause at 100% so user perceives completion
        setTimeout(() => {
          setIsDone(true);
          // Complete wipe transition and reveal home page
          setTimeout(() => {
            if (!onCompleteCalledRef.current) {
              onCompleteCalledRef.current = true;
              onComplete();
            }
          }, 320);
        }, 60);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [onComplete]);

  if (isDone) return null;

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
          exit={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
          transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-ink select-none"
        >
          {/* Logo & Counter Container */}
          <div className="flex flex-col items-center gap-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center"
            >
              {companyLogo && !imageError ? (
                <div className="h-12 flex items-center justify-center px-2">
                  <img
                    src={companyLogo}
                    alt={companyName}
                    onError={() => setImageError(true)}
                    className="h-10 sm:h-12 w-auto object-contain rounded-md"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-panel border border-white/10 flex items-center justify-center shadow-lg shadow-primary/10">
                  <span className="font-jakarta font-extrabold text-2xl tracking-tighter text-paper">
                    DO
                  </span>
                  <span className="w-2 h-2 rounded-full bg-primary mb-3 ml-0.5 animate-pulse" />
                </div>
              )}
            </motion.div>

            {/* Percentage count in mono font */}
            <div className="font-mono text-sm tracking-widest text-slate flex items-center gap-2">
              <span className="text-primary">{String(progress).padStart(3, '0')}</span>
              <span>%</span>
            </div>

            {/* Subtle Progress Bar */}
            <div className="w-48 h-1 bg-panel rounded-full overflow-hidden border border-white/5">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-secondary"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.05, ease: 'linear' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
