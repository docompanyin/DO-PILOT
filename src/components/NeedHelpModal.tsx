import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Phone,
  Send,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ChevronLeft
} from 'lucide-react';
import { useUserAuth } from '../context/UserAuthContext';
import { useSiteData } from '../context/DataContext';
import { submitStudentHelpMessage } from '../utils/studentHelpService';
import { WhatsappIcon } from './SocialIcons';

interface NeedHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  courseId: string;
}

const getSupportChannels = () => {
  try {
    const raw = localStorage.getItem('dopilot_support_channels_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && (parsed.phone || parsed.whatsapp)) return parsed;
    }
  } catch (e) {}
  return null;
};

export const NeedHelpModal: React.FC<NeedHelpModalProps> = ({
  isOpen,
  onClose,
  courseTitle,
  courseId
}) => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useUserAuth();
  const { data } = useSiteData();

  const [supportChannels, setSupportChannels] = useState<{ phone?: string; whatsapp?: string } | null>(getSupportChannels);

  useEffect(() => {
    const handleSync = () => {
      setSupportChannels(getSupportChannels());
    };
    window.addEventListener('dopilot_support_channels_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('dopilot_support_channels_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Support phone & whatsapp number from admin configuration, site data, or fallback
  const rawPhone = supportChannels?.phone || data?.footer?.phone || '+91 97787 07336';
  const rawWhatsApp = supportChannels?.whatsapp || data?.footer?.whatsapp || rawPhone;
  const cleanPhone = rawPhone.replace(/[^0-9+]/g, '');
  const cleanPhoneForWhatsApp = rawWhatsApp.replace(/[^0-9]/g, '');

  const [activeView, setActiveView] = useState<'options' | 'directContact'>('options');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Reset state when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setActiveView('options');
      setIsSubmitted(false);
      setIsSubmitting(false);
      setSubmitError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCallUs = () => {
    window.location.href = `tel:${cleanPhone}`;
  };

  const handleWhatsApp = () => {
    const defaultText = encodeURIComponent(
      `Hello DO PILOT Academic Support, I am enrolled in "${courseTitle}" and need assistance.`
    );
    window.open(`https://wa.me/${cleanPhoneForWhatsApp}?text=${defaultText}`, '_blank');
  };

  const handleConfirmDirectContact = () => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      submitStudentHelpMessage({
        studentId: user?.id,
        studentName: user?.name || 'Enrolled Student',
        studentEmail: user?.email || '',
        studentPhone: user?.phone || 'Available in account',
        courseTitle,
        courseId,
        message: `Student requested direct academic and mentor assistance for ${courseTitle}.`
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err: any) {
      setIsSubmitting(false);
      setSubmitError(err?.message || 'Failed to submit help request. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-lg bg-[#0d0f11] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9)] text-paper overflow-hidden"
      >
        {/* Subtle background ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[90px] rounded-full pointer-events-none" />

        {/* Top Header Bar */}
        <div className="flex items-start justify-between gap-4 mb-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-primary" />
              <span className="font-mono text-[10px] font-bold text-primary tracking-widest uppercase">
                Student Assistance Desk
              </span>
            </div>
            <h3 className="font-jakarta text-2xl font-black text-paper tracking-tight">
              Need Help
            </h3>
            <p className="font-mono text-xs text-slate mt-1 line-clamp-1">
              Course: <span className="text-paper font-semibold">{courseTitle}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/[0.05] hover:bg-white/10 border border-white/10 text-slate hover:text-paper transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="relative z-10">
          {activeView === 'options' ? (
            <div className="space-y-3.5">
              <p className="text-xs font-mono text-slate mb-4">
                Choose how you would like to connect with our academic and technical mentors:
              </p>

              {/* Option 1: Call Us */}
              <button
                type="button"
                onClick={handleCallUs}
                className="w-full p-4 rounded-2xl bg-panel hover:bg-panel-light border border-white/10 hover:border-emerald-500/50 transition-all text-left flex items-center justify-between group cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="font-jakarta text-sm font-bold text-paper">
                    Call Us
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate group-hover:text-emerald-400 group-hover:bg-white/10 transition-colors shrink-0 ml-2">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>

              {/* Option 2: WhatsApp */}
              <button
                type="button"
                onClick={handleWhatsApp}
                className="w-full p-4 rounded-2xl bg-panel hover:bg-panel-light border border-white/10 hover:border-emerald-500/50 transition-all text-left flex items-center justify-between group cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 group-hover:scale-105 transition-transform">
                    <WhatsappIcon className="w-5 h-5" />
                  </div>
                  <span className="font-jakarta text-sm font-bold text-paper">
                    WhatsApp
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate group-hover:text-emerald-400 group-hover:bg-white/10 transition-colors shrink-0 ml-2">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>

              {/* Option 3: Direct Contact */}
              <button
                type="button"
                onClick={() => setActiveView('directContact')}
                className="w-full p-4 rounded-2xl bg-panel hover:bg-panel-light border border-white/10 hover:border-emerald-500/50 transition-all text-left flex items-center justify-between group cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 group-hover:scale-105 transition-transform">
                    <Send className="w-5 h-5" />
                  </div>
                  <span className="font-jakarta text-sm font-bold text-paper">
                    Direct Contact
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate group-hover:text-emerald-400 group-hover:bg-white/10 transition-colors shrink-0 ml-2">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            </div>
          ) : isSubmitted ? (
            /* Submission Success State */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-jakarta text-xl font-bold text-paper">
                Help Request Sent!
              </h4>
              <p className="font-mono text-xs text-slate max-w-sm mx-auto leading-relaxed">
                Your assistance request has been delivered to our academic mentors. We will review your request and reach out to you shortly.
              </p>
              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-primary text-ink font-jakarta font-bold text-xs hover:bg-white transition-all cursor-pointer shadow-lg shadow-primary/20"
                >
                  Done
                </button>
              </div>
            </div>
          ) : !isLoggedIn || !user ? (
            /* Not Logged In State */
            <div className="py-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveView('options')}
                  className="inline-flex items-center gap-1 font-mono text-xs text-slate hover:text-paper transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Options</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="font-jakarta text-sm font-bold text-paper">
                    Sign In Required for Direct Contact
                  </h5>
                  <p className="font-mono text-xs text-slate leading-relaxed">
                    Please sign in to your student account to send a direct help request so our mentors can identify your enrolled course and contact details.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveView('options')}
                  className="px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate hover:text-paper font-jakarta text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/login');
                  }}
                  className="px-6 py-2.5 rounded-full bg-primary text-ink font-jakarta font-black text-xs hover:bg-white transition-all cursor-pointer shadow-lg shadow-primary/20"
                >
                  Sign In to Continue
                </button>
              </div>
            </div>
          ) : (
            /* Simple Direct Contact Confirmation (Clean, No User Info Clutter) */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveView('options')}
                  className="inline-flex items-center gap-1 font-mono text-xs text-slate hover:text-paper transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Options</span>
                </button>
              </div>

              {submitError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-300 font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Clean Confirmation Prompt */}
              <div className="p-5 rounded-2xl bg-panel border border-white/10 flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
                  <Send className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-jakarta text-base font-bold text-paper">
                    Send Help Request?
                  </h4>
                  <p className="font-mono text-xs text-slate leading-relaxed">
                    Would you like to send a direct help request for <span className="text-paper font-semibold">{courseTitle}</span> to our academic mentors?
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveView('options')}
                  className="px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate hover:text-paper font-jakarta text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDirectContact}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-full bg-primary text-ink font-jakarta font-black text-xs hover:bg-white transition-all cursor-pointer shadow-lg shadow-primary/20 flex items-center gap-1.5 disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending Request...' : 'Send Help Request'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default NeedHelpModal;
