import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award } from 'lucide-react';
import { congratsAnimationData } from '../data/congratsAnimation';

interface CourseCompletionCardProps {
  onClaimCertificate: () => void;
}

export const CourseCompletionCard: React.FC<CourseCompletionCardProps> = ({
  onClaimCertificate
}) => {
  const animContainerRef = useRef<HTMLDivElement>(null);
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    let anim: any = null;
    let fallbackTimer: any = null;

    const startAnimation = () => {
      if (typeof window !== 'undefined' && (window as any).lottie && animContainerRef.current) {
        try {
          animContainerRef.current.innerHTML = '';
          anim = (window as any).lottie.loadAnimation({
            container: animContainerRef.current,
            renderer: 'svg',
            loop: false,
            autoplay: true,
            animationData: congratsAnimationData,
            rendererSettings: {
              preserveAspectRatio: 'xMidYMid meet',
              progressiveLoad: false,
              hideOnTransparent: true
            }
          });

          anim.addEventListener('complete', () => {
            if (anim && typeof anim.destroy === 'function') {
              anim.destroy();
            }
            setAnimationFinished(true);
          });
        } catch (e) {
          console.error('Failed to run congrats animation:', e);
          setAnimationFinished(true);
        }
      }
    };

    if (typeof window !== 'undefined' && (window as any).lottie) {
      startAnimation();
    } else {
      const interval = setInterval(() => {
        if (typeof window !== 'undefined' && (window as any).lottie) {
          clearInterval(interval);
          startAnimation();
        }
      }, 50);
      setTimeout(() => clearInterval(interval), 2000);
    }

    // Fallback: 4.0s animation duration + 0.2s margin = 4.2s
    fallbackTimer = setTimeout(() => {
      setAnimationFinished(true);
    }, 4200);

    return () => {
      if (fallbackTimer) clearTimeout(fallbackTimer);
      if (anim && typeof anim.destroy === 'function') {
        anim.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center my-auto transition-all animate-fade-in">
      <AnimatePresence mode="wait">
        {!animationFinished ? (
          /* STEP 1: Animation First — Clean screen, only the animation, no card/borders */
          <motion.div
            key="animation-phase"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="flex items-center justify-center w-full py-8"
          >
            <div
              ref={animContainerRef}
              onClick={() => setAnimationFinished(true)}
              className="w-72 h-44 sm:w-96 sm:h-56 max-w-full cursor-pointer flex items-center justify-center"
              title="Click to skip animation"
            />
          </motion.div>
        ) : (
          /* STEP 2: After Animation — Small, clean, compact container with minimal text */
          <motion.div
            key="congrats-card"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#0f1117]/95 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-7 max-w-sm w-full mx-auto text-center shadow-2xl backdrop-blur-xl relative overflow-hidden space-y-5"
          >
            {/* Subtle Top Ambient Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500" />

            {/* Typography */}
            <div className="space-y-1.5 pt-1">
              <h2 className="font-jakarta text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Congratulations, You Did It!
              </h2>
              <p className="font-sans text-xs sm:text-sm font-semibold text-amber-300 tracking-wide">
                Certificate Achievement Unlocked
              </p>
            </div>

            {/* Exactly ONE Button: Claim Official Certificate */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onClaimCertificate}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-105 text-black font-jakarta font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <Award className="w-4 h-4 text-black shrink-0" />
                <span>Claim Official Certificate</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseCompletionCard;
