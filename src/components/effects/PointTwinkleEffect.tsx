import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useCoursePoints } from '../../context/CoursePointsContext';
import { playTwinkleSound } from '../../utils/audioEffects';

interface FlightCoord {
  startX: number;
  startY: number;
  destX: number;
  destY: number;
}

export const PointTwinkleEffect: React.FC = () => {
  const { twinkleEvent, dismissTwinkle } = useCoursePoints();
  const [coords, setCoords] = useState<FlightCoord | null>(null);
  const [arrived, setArrived] = useState(false);
  const timersRef = useRef<number[]>([]);
  const activeEventIdRef = useRef<number | null>(null);

  const clearAllTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => {
    if (twinkleEvent?.active && twinkleEvent.id) {
      // Strictly prevent duplicate execution of the exact same twinkle event ID
      if (activeEventIdRef.current === twinkleEvent.id) {
        return;
      }
      activeEventIdRef.current = twinkleEvent.id;

      clearAllTimers();
      setArrived(false);

      // 1. Locate the navbar reward points section on the right side of the navbar
      const targetEl =
        document.getElementById('navbar-reward-pill') ||
        document.querySelector('[title="Course Points"]') ||
        document.querySelector('header a[href*="settings"]');

      let destX = typeof window !== 'undefined' ? window.innerWidth - 130 : 900;
      let destY = 28;

      if (targetEl) {
        const rect = targetEl.getBoundingClientRect();
        destX = rect.left + rect.width / 2;
        destY = rect.top + rect.height / 2;
      }

      // 2. Locate origin (the active question, selected answer button, or focus arena)
      let startX = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
      let startY = typeof window !== 'undefined' ? window.innerHeight * 0.55 : 400;

      const activeEl =
        document.querySelector('[data-selected="true"]') ||
        document.querySelector('[class*="border-emerald"]') ||
        document.querySelector('[class*="bg-emerald"]') ||
        document.querySelector('.border-emerald-500') ||
        document.querySelector('.bg-emerald-500\\/10') ||
        (document.activeElement &&
        document.activeElement !== document.body &&
        document.activeElement.tagName === 'BUTTON'
          ? document.activeElement
          : null) ||
        document.querySelector('main');

      if (activeEl && activeEl instanceof HTMLElement) {
        const sRect = activeEl.getBoundingClientRect();
        if (sRect.top >= 0 && sRect.bottom <= window.innerHeight && sRect.width > 0) {
          startX = sRect.left + sRect.width / 2;
          startY = sRect.top + Math.min(sRect.height / 2, 45);
        } else if (sRect.top < window.innerHeight && sRect.bottom > 0) {
          startX = sRect.left + sRect.width / 2;
          startY = Math.max(120, Math.min(window.innerHeight - 100, sRect.top + 60));
        }
      }

      setCoords({ startX, startY, destX, destY });

      // Slow-motion continuous flight duration: 1.4s (1400ms)
      // At 1320ms: Twinkle chime rings right as the point reaches the navbar
      const soundTimer = window.setTimeout(() => {
        playTwinkleSound();
      }, 1320);
      timersRef.current.push(soundTimer);

      // At 1400ms: Point lands -> trigger subtle arrival sparkle at the navbar
      const arrivalTimer = window.setTimeout(() => {
        setArrived(true);
      }, 1400);
      timersRef.current.push(arrivalTimer);

      // At 1900ms: Clean up all states and dismiss twinkle event
      const closeTimer = window.setTimeout(() => {
        dismissTwinkle();
        setCoords(null);
        setArrived(false);
        activeEventIdRef.current = null;
      }, 1900);
      timersRef.current.push(closeTimer);

      return () => {
        clearAllTimers();
      };
    } else if (!twinkleEvent?.active) {
      setCoords(null);
      setArrived(false);
      activeEventIdRef.current = null;
    }
  }, [twinkleEvent?.id, twinkleEvent?.active, dismissTwinkle]);

  if (!twinkleEvent?.active || !coords) return null;

  const { startX, startY, destX, destY } = coords;

  // Continuous, gentle slow-motion arc points
  const p1X = startX + (destX - startX) * 0.25;
  const p1Y = startY - (startY - destY) * 0.35;

  const p2X = startX + (destX - startX) * 0.70;
  const p2Y = Math.max(destY + 16, destY + (startY - destY) * 0.16);

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden select-none">
      {/* Slow-Motion Fluid Flying Reward Point */}
      <motion.div
        initial={{
          x: startX,
          y: startY,
          scale: 0.7,
          opacity: 0
        }}
        animate={{
          x: [startX, p1X, p2X, destX],
          y: [startY, p1Y, p2Y, destY],
          scale: [0.7, 1.15, 1.0, 0.4],
          opacity: [0, 1, 1, 0]
        }}
        transition={{
          duration: 1.4,
          times: [0, 0.2, 0.8, 1],
          ease: [0.25, 0.1, 0.25, 1]
        }}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          willChange: 'transform, opacity'
        }}
        className="-translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none select-none z-[99999]"
      >
        {/* Subtle Ambient Golden Glow */}
        <div className="absolute w-16 h-16 rounded-full bg-amber-400/25 blur-md" />

        {/* Clean, High-Contrast Slow-Motion Token Badge */}
        <div className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/95 border-2 border-amber-400 text-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.7)] backdrop-blur-md">
          <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 shadow-[0_0_10px_rgba(251,191,36,0.8)]">
            <Star className="w-3 h-3 fill-current text-slate-950" />
          </span>
          <span className="font-mono font-black text-xs sm:text-sm text-amber-300 tracking-tight drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">
            +1 pt
          </span>
        </div>
      </motion.div>

      {/* Subtle Arrival Sparkle & Twinkle Effect at the Navbar Reward Counter */}
      {arrived && (
        <div
          style={{
            position: 'fixed',
            left: destX,
            top: destY
          }}
          className="pointer-events-none z-[99999]"
        >
          {/* Expanding subtle golden ripple ring */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0.85 }}
            animate={{ scale: 1.55, opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-amber-400/80 shadow-[0_0_15px_rgba(251,191,36,0.5)]"
          />

          {/* Gentle Shimmer Glow */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0.45 }}
            animate={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-amber-400/20 blur-sm"
          />

          {/* Delicate radiating star sparks */}
          {[0, 60, 120, 180, 240, 300].map((angle, idx) => {
            const rad = (angle * Math.PI) / 180;
            const dist = 22;
            const targetX = Math.cos(rad) * dist;
            const targetY = Math.sin(rad) * dist;
            return (
              <motion.span
                key={idx}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                animate={{
                  x: targetX,
                  y: targetY,
                  scale: [0, 1.1, 0.4],
                  opacity: [1, 1, 0]
                }}
                transition={{
                  duration: 0.42,
                  delay: idx * 0.012,
                  ease: 'easeOut'
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-amber-300 text-xs font-bold select-none drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]"
              >
                ✦
              </motion.span>
            );
          })}
        </div>
      )}
    </div>
  );
};
