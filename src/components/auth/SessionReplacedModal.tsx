import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Laptop, ShieldAlert, LogIn, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SessionReplacedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SessionReplacedModal: React.FC<SessionReplacedModalProps> = ({
  isOpen,
  onClose
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!isOpen) return null;

  const handleRelogin = () => {
    onClose();
    const currentPath = location.pathname + location.search;
    const isAuthPage = location.pathname.startsWith('/login') || location.pathname.startsWith('/signup');
    if (!isAuthPage) {
      navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
    } else {
      navigate('/login');
    }
  };

  const handleDismiss = () => {
    onClose();
    // If the user was on an authenticated protected course or settings route, redirect to home
    const isProtected =
      location.pathname.includes('/course/') ||
      location.pathname.startsWith('/settings') ||
      location.pathname.startsWith('/profile');
    if (isProtected) {
      navigate('/', { replace: true });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop with rich blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          onClick={handleDismiss}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 14 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[420px] bg-gradient-to-b from-[#13161f] to-[#0b0d13] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] text-center overflow-hidden z-10"
        >
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-56 h-56 bg-amber-500/10 blur-[70px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/5 blur-[60px] rounded-full pointer-events-none" />

          {/* Icon Badge */}
          <div className="relative mx-auto mb-5 w-16 h-16 sm:w-[70px] sm:h-[70px] flex items-center justify-center">
            {/* Pulsing Outer Glow */}
            <div className="absolute inset-0 rounded-2xl bg-amber-500/15 border border-amber-500/30 animate-pulse" />
            <div className="relative w-full h-full rounded-2xl bg-[#171a24] border border-amber-400/20 flex items-center justify-center text-amber-400 shadow-inner">
              <Laptop className="w-8 h-8 sm:w-9 sm:h-9 text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.25)]" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#0d0f15] border border-amber-500/40 flex items-center justify-center">
                <ShieldAlert className="w-3 h-3 text-amber-400" />
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl sm:text-2xl font-bold font-jakarta text-white tracking-tight mb-3">
            Logged In On Another Device
          </h3>

          {/* Exact Message */}
          <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed mb-7 px-1">
            For security reasons, your account can only be used on one device at a time. Please log in again on this device to continue.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleRelogin}
              className="w-full h-12 px-5 rounded-2xl bg-primary hover:bg-[#00f090] text-black font-jakarta font-bold text-sm tracking-wide transition-all shadow-[0_4px_20px_rgba(0,255,157,0.25)] hover:shadow-[0_6px_25px_rgba(0,255,157,0.35)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In On This Device</span>
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              className="w-full h-11 px-5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-400 hover:text-white font-jakarta font-medium text-xs sm:text-sm transition-all border border-white/10 flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
            >
              <span>Continue Browsing</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
