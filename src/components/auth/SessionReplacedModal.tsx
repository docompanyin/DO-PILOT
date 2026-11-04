import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Laptop, LogIn, ArrowRight } from 'lucide-react';
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
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
          onClick={handleDismiss}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-[#0e1015] border border-amber-500/25 rounded-2xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-center overflow-hidden z-10"
        >
          {/* Subtle glow highlight */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/10 blur-[60px] rounded-full pointer-events-none" />

          {/* Device Icon */}
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center mx-auto mb-4 text-amber-400 shadow-inner">
            <Laptop className="w-7 h-7" />
          </div>

          {/* Heading */}
          <h3 className="text-xl font-bold font-jakarta text-white mb-2">
            Logged In On Another Device
          </h3>

          {/* Explanation */}
          <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed mb-6">
            Your account was logged in on another device or browser. For security and to preserve your exact progress, an account can only be active on one device at a time.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleRelogin}
              className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-black font-jakarta font-bold text-sm transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In On This Device</span>
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-jakarta font-medium text-xs transition border border-white/10 flex items-center justify-center gap-1.5 cursor-pointer"
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
