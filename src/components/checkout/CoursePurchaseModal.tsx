import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Check, Sparkles, Tag, ArrowRight, ArrowLeft, AlertCircle, Award, CheckCircle2,
  QrCode, Clock, Copy, RefreshCw, ShieldCheck, ShieldAlert
} from 'lucide-react';
import trophyAnimationData from '../../assets/Trophy.json';
import { useUserAuth } from '../../context/UserAuthContext';
import {
  getCoursePricing,
  validateCoupon,
  recordCoursePurchase,
  getPaymentQRConfig,
  createQRPaymentSession,
  expireQRPaymentSession,
  submitManualQRPurchase,
  normalizeCourseId,
  hasCourseAccess,
  PaymentQRConfig,
  CourseCoupon,
  CoursePricing
} from '../../utils/coursePricingService';

interface TrophyCelebrationProps {
  courseName: string;
  onAnimationEnd: () => void;
}

const TrophyCelebration: React.FC<TrophyCelebrationProps> = ({ courseName, onAnimationEnd }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<any>(null);
  const onAnimationEndRef = useRef(onAnimationEnd);
  onAnimationEndRef.current = onAnimationEnd;

  const [hasLottieRendered, setHasLottieRendered] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const play = (lottieInstance: any) => {
      if (!containerRef.current || isCancelled) return;
      try {
        const anim = lottieInstance.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop: false,
          autoplay: true,
          animationData: trophyAnimationData,
        });
        animRef.current = anim;
        setHasLottieRendered(true);
        anim.setSpeed(1.0);
        anim.addEventListener('complete', () => {
          setTimeout(() => {
            if (!isCancelled) onAnimationEndRef.current();
          }, 1000);
        });
      } catch (err) {
        console.error('Lottie play error:', err);
        setTimeout(() => {
          if (!isCancelled) onAnimationEndRef.current();
        }, 3200);
      }
    };

    if (typeof window !== 'undefined' && (window as any).lottie) {
      play((window as any).lottie);
    } else {
      let attempts = 0;
      const poll = setInterval(() => {
        attempts++;
        if (typeof window !== 'undefined' && (window as any).lottie) {
          clearInterval(poll);
          play((window as any).lottie);
        } else if (attempts > 30) {
          clearInterval(poll);
        }
      }, 50);

      const safetyTimer = setTimeout(() => {
        clearInterval(poll);
        if (!isCancelled) onAnimationEndRef.current();
      }, 3800);

      return () => {
        isCancelled = true;
        clearInterval(poll);
        clearTimeout(safetyTimer);
        if (animRef.current) {
          try { animRef.current.destroy(); } catch {}
        }
      };
    }

    const fallbackTimer = setTimeout(() => {
      if (!isCancelled) onAnimationEndRef.current();
    }, 4500);

    return () => {
      isCancelled = true;
      clearTimeout(fallbackTimer);
      if (animRef.current) {
        try { animRef.current.destroy(); } catch {}
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="py-8 sm:py-10 text-center space-y-5 relative z-10 max-w-md mx-auto select-none"
    >
      {/* Trophy Container with Lottie & SVG fallback */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto flex items-center justify-center">
        <div
          ref={containerRef}
          className="w-full h-full flex items-center justify-center drop-shadow-2xl relative z-10"
        />
        {!hasLottieRendered && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-amber-400">
            <Award className="w-24 h-24 sm:w-28 sm:h-28 text-amber-400 animate-bounce drop-shadow-[0_0_25px_rgba(251,191,36,0.5)]" />
            <Sparkles className="w-6 h-6 text-primary animate-pulse mt-2" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 inline-block">
          Zero-Amount Claim • Full Access
        </span>
        <h4 className="font-jakarta text-2xl sm:text-3xl font-black text-paper leading-tight">
          Course Claimed Successfully!
        </h4>
        <p className="font-sans text-xs sm:text-sm text-slate leading-relaxed">
          You now have lifetime unlocked access to <strong className="text-paper">{courseName}</strong>.
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs font-mono text-primary pt-2 animate-pulse">
        <Sparkles className="w-4 h-4" />
        <span>Redirecting to course details page...</span>
      </div>
    </motion.div>
  );
};

interface PaymentUnavailablePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentUnavailablePopup: React.FC<PaymentUnavailablePopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 10 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md rounded-3xl bg-[#0c0d0e] border border-white/15 p-6 sm:p-7 shadow-2xl relative space-y-5 text-center"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate hover:text-paper transition-all cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 inline-block">
            Payment Notice
          </span>
          <h4 className="font-jakarta text-xl sm:text-2xl font-black text-paper leading-tight">
            Payments Temporarily Unavailable
          </h4>
          <p className="font-sans text-xs sm:text-sm text-slate leading-relaxed font-medium">
            Payments are temporarily unavailable. Please try again later.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 text-left font-mono text-[11px] text-slate/80 space-y-1.5 leading-relaxed">
          <div className="flex items-center gap-2 text-paper font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Important Information</span>
          </div>
          <p>
            • Part 1 of all courses remains 100% free to try without payment.
          </p>
          <p>
            • If you have a zero-amount scholarship or coupon code, apply it on the checkout page to claim course access.
          </p>
        </div>

        <div className="pt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-full bg-white/10 hover:bg-white/20 text-paper font-jakarta font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border border-white/10"
          >
            Understood
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export interface CoursePurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseName?: string;
  courseTitle?: string;
  pricing?: CoursePricing;
  onSuccess?: () => void;
}

const PAYMENT_COUNTDOWN_SECONDS = 120; // 2 minutes

export const CoursePurchaseModal: React.FC<CoursePurchaseModalProps> = ({
  isOpen,
  onClose,
  courseId,
  courseName,
  courseTitle,
  pricing: propPricing,
  onSuccess
}) => {
  const navigate = useNavigate();
  const { user, isLoggedIn, enrollInCourse } = useUserAuth();

  const [pricing, setPricing] = useState<CoursePricing>(() => propPricing || getCoursePricing(courseId));
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CourseCoupon | null>(null);
  const [discountAmount, setDiscountAmount] = useState(() =>
    (propPricing?.isFreeCourse || getCoursePricing(courseId).isFreeCourse)
      ? (propPricing?.salePrice || getCoursePricing(courseId).salePrice)
      : 0
  );
  const [finalAmount, setFinalAmount] = useState(() =>
    (propPricing?.isFreeCourse || getCoursePricing(courseId).isFreeCourse)
      ? 0
      : getCoursePricing(courseId).salePrice
  );
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccessMsg, setCouponSuccessMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseCompleted, setPurchaseCompleted] = useState(false);
  const [isClaimCelebration, setIsClaimCelebration] = useState(false);
  const [showPaymentUnavailableModal, setShowPaymentUnavailableModal] = useState(false);

  // Step: 'checkout' (course info & "Pay ₹999") | 'qr_page' (separate clean QR payment page)
  const [paymentStep, setPaymentStep] = useState<'checkout' | 'qr_page'>('checkout');

  // QR Code Configuration & 2-Minute Session Timer State
  const [qrConfig, setQrConfig] = useState<PaymentQRConfig>(() => getPaymentQRConfig());
  const [timeLeft, setTimeLeft] = useState<number>(PAYMENT_COUNTDOWN_SECONDS);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [qrImageLoadFailed, setQrImageLoadFailed] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Manual UTR Verification State
  const [utrInput, setUtrInput] = useState('');
  const [utrError, setUtrError] = useState<string | null>(null);
  const [verificationSubmitted, setVerificationSubmitted] = useState(false);
  const [submittedUtr, setSubmittedUtr] = useState('');
  const wasOpenRef = useRef(false);

  // Dynamically sync when admin updates payment settings
  useEffect(() => {
    const handleConfigChange = () => {
      const cfg = getPaymentQRConfig();
      setQrConfig(cfg);
    };
    window.addEventListener('dopilot_payment_qr_updated', handleConfigChange);
    window.addEventListener('dopilot_payment_qr_config_updated', handleConfigChange);
    window.addEventListener('storage', handleConfigChange);
    return () => {
      window.removeEventListener('dopilot_payment_qr_updated', handleConfigChange);
      window.removeEventListener('dopilot_payment_qr_config_updated', handleConfigChange);
      window.removeEventListener('storage', handleConfigChange);
    };
  }, []);

  // Reset state ONLY when transitioning from closed to open
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      const p = propPricing || getCoursePricing(courseId);
      setPricing(p);
      const isFree = Boolean(p.isFreeCourse);
      setFinalAmount(isFree ? 0 : p.salePrice);
      setDiscountAmount(isFree ? p.salePrice : 0);
      setAppliedCoupon(null);
      setCouponInput('');
      setCouponError(null);
      setCouponSuccessMsg(null);
      setPurchaseCompleted(false);

      const cfg = getPaymentQRConfig();
      setQrConfig(cfg);
      setTimeLeft(PAYMENT_COUNTDOWN_SECONDS);
      setSessionExpired(false);
      setPaymentStep('checkout');
      setQrImageLoadFailed(false);
      setUtrInput('');
      setUtrError(null);
      setVerificationSubmitted(false);
      setSubmittedUtr('');
      setActiveSessionId(null);
      setIsClaimCelebration(false);
      setShowPaymentUnavailableModal(false);
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, courseId]);

  // 2-Minute QR Code Timer Countdown (Active only on qr_page)
  // IMPORTANT: Expiration must not automatically mark payment as successful!
  useEffect(() => {
    if (!isOpen || paymentStep !== 'qr_page' || verificationSubmitted || sessionExpired || finalAmount === 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setSessionExpired(true);
          if (activeSessionId) {
            expireQRPaymentSession(activeSessionId);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, paymentStep, verificationSubmitted, sessionExpired, finalAmount, activeSessionId]);

  if (!isOpen) return null;

  const resolvedCourseName = pricing.courseName || courseTitle || courseName || 'Full Course Track';

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStartQRPayment = () => {
    if (finalAmount > 0) {
      setShowPaymentUnavailableModal(true);
      return;
    }
    handleClaimCourse();
  };

  const handleResetSession = () => {
    if (finalAmount > 0) {
      setShowPaymentUnavailableModal(true);
      return;
    }
    handleClaimCourse();
  };

  const handleCopyUpiId = () => {
    if (!qrConfig.upiId) return;
    navigator.clipboard.writeText(qrConfig.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim();
    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    setCouponError(null);
    setCouponSuccessMsg(null);

    const validation = validateCoupon(code, courseId, pricing.salePrice);
    if (!validation.valid || !validation.coupon) {
      setCouponError(validation.error || 'Invalid or expired coupon code.');
      setAppliedCoupon(null);
      setDiscountAmount(0);
      setFinalAmount(pricing.salePrice);
      return;
    }

    const coupon = validation.coupon;
    setAppliedCoupon(coupon);
    setDiscountAmount(validation.discountAmount);
    setFinalAmount(validation.finalPrice);

    if (validation.finalPrice === 0) {
      setCouponSuccessMsg(`Coupon applied: 100% discount! Course is now ₹0.`);
    } else {
      setCouponSuccessMsg(
        `Coupon applied: ₹${validation.discountAmount.toLocaleString()} discount!`
      );
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError(null);
    setCouponSuccessMsg(null);
    if (pricing.isFreeCourse) {
      setDiscountAmount(pricing.salePrice);
      setFinalAmount(0);
    } else {
      setDiscountAmount(0);
      setFinalAmount(pricing.salePrice);
    }
  };

  const getCanonicalCourseRoute = (cId: string): string => {
    const norm = normalizeCourseId(cId);
    if (norm === 'python-core') return '/course/python-core';
    if (norm === 'java-core') return '/course/complete-java-programming';
    if (norm === 'fullstack-open') return '/course/fullstack-open';
    if (norm === 'cyber-security') return '/course/cyber-security';
    return `/course/${norm}`;
  };

  // Zero-Amount Coupon Course Claim
  const handleClaimCourse = async () => {
    setIsProcessing(true);
    setCouponError(null);
    try {
      const normalizedCourse = normalizeCourseId(courseId);
      const studentId = user?.id || user?.email || 'guest_student';
      const studentName = user?.name || user?.email?.split('@')[0] || 'Enrolled Student';
      const studentEmail = user?.email || '';
      const studentPhone = user?.phone || '';

      if (!appliedCoupon && !pricing.isFreeCourse) {
        setCouponError('Please enter a valid zero-amount coupon code to claim this course.');
        setIsProcessing(false);
        return;
      }

      const couponCode = appliedCoupon?.code || (pricing.isFreeCourse ? 'ADMIN_FREE_COURSE' : 'DOPILOT100');

      // 1. Client-side coupon pre-validation
      if (appliedCoupon) {
        const clientVal = validateCoupon(couponCode, normalizedCourse, pricing.salePrice);
        if (!clientVal.valid || clientVal.finalPrice > 0) {
          setCouponError(clientVal.error || 'Only valid zero-amount coupons can claim free course access.');
          setIsProcessing(false);
          return;
        }
      }

      // 2. Server-side coupon & eligibility validation + Supabase enrollment
      try {
        const res = await fetch('/api/claim-course', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId: normalizedCourse,
            couponCode,
            studentId,
            studentEmail,
            studentName,
            studentPhone
          })
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          setCouponError(data?.message || 'Server coupon validation failed. Please check coupon details.');
          setIsProcessing(false);
          return;
        }
      } catch (err: any) {
        console.warn('Backend claim endpoint request issue, falling back to local persistence:', err);
      }

      // 3. Record course purchase locally and grant permanent access
      const result = recordCoursePurchase({
        studentId,
        studentName,
        studentEmail: studentEmail || `${studentId}@student.dopilot.io`,
        studentPhone,
        courseId: normalizedCourse,
        courseName: resolvedCourseName,
        originalPrice: pricing.salePrice || pricing.regularPrice,
        discountAmount: pricing.salePrice || pricing.regularPrice,
        finalAmount: 0,
        couponCodeApplied: couponCode,
        paymentMethod: 'coupon_free_unlock',
        status: 'completed'
      });

      if (result.success) {
        if (isLoggedIn) {
          enrollInCourse(resolvedCourseName);
        }
        setIsClaimCelebration(true);
      } else {
        setCouponError(result.error || 'Could not complete course claim.');
      }
    } catch (err: any) {
      setCouponError(err?.message || 'Error granting course access.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Submit manual QR payment with 12-digit UTR for Admin Verification
  const handleSubmitManualQRPayment = () => {
    const utr = utrInput.trim();
    if (!utr || utr.length < 8) {
      setUtrError('Please enter a valid 12-digit UPI Reference / UTR Number.');
      return;
    }

    setUtrError(null);
    setIsProcessing(true);

    const studentId = user?.id || user?.email || 'guest_student';
    const studentName = user?.name || user?.email?.split('@')[0] || 'Enrolled Student';
    const studentEmail = user?.email || `${studentId}@student.dopilot.io`;
    const studentPhone = user?.phone || '';

    const submission = submitManualQRPurchase({
      sessionId: activeSessionId || undefined,
      studentId,
      studentName,
      studentEmail,
      studentPhone,
      courseId,
      courseName: resolvedCourseName,
      originalPrice: pricing.regularPrice,
      discountAmount,
      finalAmount,
      couponCodeApplied: appliedCoupon?.code,
      utrNumber: utr
    });

    setIsProcessing(false);

    if (submission.success) {
      setSubmittedUtr(utr);
      setVerificationSubmitted(true);
    } else {
      setUtrError(submission.error || 'Failed to submit payment. Please verify your reference.');
    }
  };

  // Determine if valid admin-configured QR image exists
  const hasAdminQr = Boolean(
    qrConfig.qrImageUrl &&
    qrConfig.qrImageUrl.trim().length > 0 &&
    !qrImageLoadFailed
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl lg:max-w-3xl rounded-3xl bg-[#0c0d0e] border border-white/15 p-5 sm:p-7 md:p-8 shadow-2xl relative overflow-hidden my-auto"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

          {/* Modal Header */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10 relative z-10">
            {paymentStep === 'qr_page' ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentStep('checkout')}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-paper font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
                  aria-label="Back to course checkout"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <div>
                  <h3 className="font-jakarta text-base sm:text-lg font-black text-paper leading-tight">
                    Scan Google Pay QR
                  </h3>
                  <p className="text-[11px] text-slate font-sans truncate max-w-[200px] sm:max-w-md">
                    {resolvedCourseName}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-primary text-[11px] font-mono font-bold uppercase tracking-wider block">
                  Full Lifetime Access
                </span>
                <h3 className="font-jakarta text-xl sm:text-2xl font-black text-paper leading-tight">
                  Unlock {resolvedCourseName}
                </h3>
                <p className="text-xs text-slate font-sans">
                  Full 14-module curriculum, interactive coding labs, and official certificate.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate hover:text-paper transition-all cursor-pointer shrink-0"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* VIEW 0: Zero-Amount Trophy Claim Celebration */}
          {isClaimCelebration ? (
            <TrophyCelebration
              courseName={resolvedCourseName}
              onAnimationEnd={() => {
                if (onSuccess) onSuccess();
                onClose();
                const targetRoute = getCanonicalCourseRoute(courseId);
                navigate(targetRoute);
              }}
            />
          ) : purchaseCompleted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-12 text-center space-y-4 relative z-10"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
                <Check className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-jakarta text-2xl font-black text-paper">
                  Access Granted!
                </h4>
                <p className="font-mono text-xs text-emerald-300">
                  Full course unlocked successfully. Redirecting to curriculum...
                </p>
              </div>
            </motion.div>
          ) : verificationSubmitted ? (
            /* VIEW 2: Manual UPI QR Verification Pending Screen */
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-8 text-center space-y-5 relative z-10 max-w-lg mx-auto"
            >
              <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
                <Clock className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h4 className="font-jakarta text-2xl font-black text-paper">
                  Payment Submitted for Verification
                </h4>
                <p className="font-sans text-xs text-slate leading-relaxed">
                  Your payment transaction reference has been logged. Our administration team will verify the reference number and grant full access to your account.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-left space-y-2 font-mono text-xs">
                <div className="flex justify-between text-slate">
                  <span>Course Track:</span>
                  <span className="text-paper font-bold">{resolvedCourseName}</span>
                </div>
                <div className="flex justify-between text-slate">
                  <span>Amount Paid:</span>
                  <span className="text-primary font-bold">₹{finalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate">
                  <span>UPI Reference / UTR:</span>
                  <span className="text-emerald-400 font-bold">{submittedUtr}</span>
                </div>
                <div className="flex justify-between text-slate">
                  <span>Status:</span>
                  <span className="text-amber-400 font-bold uppercase">Pending Verification</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-full bg-white/10 hover:bg-white/20 text-paper font-jakarta font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Close &amp; Check Later
              </button>
            </motion.div>
          ) : paymentStep === 'qr_page' ? (
            /* VIEW 3: Separate Clean QR Payment Page */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-4 space-y-5 relative z-10 flex flex-col items-center text-center max-w-lg mx-auto"
            >
              {/* Top Bar: Back Action, Payable Amount & Countdown Timer */}
              <div className="w-full flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/10">
                <button
                  type="button"
                  onClick={() => setPaymentStep('checkout')}
                  className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-paper font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 font-mono text-xs">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span className="text-slate">Timer:</span>
                  <span className={`font-bold ${sessionExpired ? 'text-rose-400' : 'text-primary'}`}>
                    {sessionExpired ? '00:00' : formatTimer(timeLeft)}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-mono text-[10px] text-slate uppercase tracking-wider block">
                    Payable Amount
                  </span>
                  <span className="font-jakarta text-xl sm:text-2xl font-black text-primary">
                    ₹{finalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {sessionExpired ? (
                /* Expired Session State: QR disabled, clear message & action buttons */
                <div className="w-full p-6 sm:p-8 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-jakarta font-bold text-base sm:text-lg text-paper">
                      Payment Session Expired
                    </h4>
                    <p className="text-slate font-mono text-xs leading-relaxed max-w-sm mx-auto">
                      The 2-minute payment session has timed out. For security, the QR code has been disabled.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleResetSession}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-primary text-ink font-jakarta font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer hover:bg-white shadow-lg shadow-primary/20"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry Payment</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentStep('checkout')}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-paper font-jakarta font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Course</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Active Session State */
                <>
                  {/* Admin Configured QR Code OR Clear Message */}
                  {hasAdminQr ? (
                    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-white/20 flex flex-col items-center justify-center shadow-xl">
                      <img
                        src={qrConfig.qrImageUrl.trim()}
                        alt="Scan Google Pay QR to Pay"
                        onError={() => setQrImageLoadFailed(true)}
                        className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg"
                      />
                      <p className="font-mono text-[11px] text-black/80 font-bold mt-2.5 tracking-wide uppercase">
                        Scan &amp; Pay using Google Pay
                      </p>
                    </div>
                  ) : (
                    <div className="w-full p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-amber-500/30 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h5 className="font-jakarta font-bold text-base text-paper">
                          Payment QR Code Not Configured
                        </h5>
                        <p className="text-slate font-mono text-xs leading-relaxed max-w-sm mx-auto">
                          No official Google Pay QR code has been configured by the admin yet. Please contact support or try again later.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Payment Verification Form */}
                  {hasAdminQr && (
                    <div className="w-full space-y-3 text-left">
                      {qrConfig.upiId && (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 font-mono text-xs">
                          <span className="text-slate text-[11px]">Google Pay UPI ID:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-paper text-xs">{qrConfig.upiId}</span>
                            <button
                              type="button"
                              onClick={handleCopyUpiId}
                              className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] text-paper transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="font-mono text-[11px] text-slate font-bold uppercase tracking-wider block">
                          Enter 12-Digit Google Pay UPI Ref / UTR
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 423589102345"
                          value={utrInput}
                          onChange={(e) => {
                            setUtrInput(e.target.value.trim());
                            setUtrError(null);
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-paper font-mono text-xs focus:outline-none focus:border-primary"
                        />
                        {utrError && (
                          <p className="font-mono text-[11px] text-rose-400 flex items-center gap-1 pt-0.5">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>{utrError}</span>
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleSubmitManualQRPayment}
                        disabled={isProcessing}
                        className="w-full py-3.5 px-4 rounded-full font-jakarta font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg bg-primary text-ink hover:bg-white shadow-primary/25 disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        <span>{isProcessing ? 'Submitting...' : 'Submit Payment for Verification'}</span>
                      </button>
                    </div>
                  )}

                  {/* Back to Course details link */}
                  <button
                    type="button"
                    onClick={() => setPaymentStep('checkout')}
                    className="text-slate hover:text-paper font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer pt-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Course Details</span>
                  </button>
                </>
              )}
            </motion.div>
          ) : (
            /* VIEW 4: Standard Course Checkout */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-5 relative z-10">
              {/* Left Column: What You Get */}
              <div className="md:col-span-5 space-y-5 md:space-y-0 md:flex md:flex-col md:justify-between">
                <div className="space-y-3 md:space-y-4">
                  <h4 className="font-mono text-[11px] uppercase tracking-wider text-slate font-bold">
                    What You Get
                  </h4>
                  <div className="space-y-2.5 md:space-y-4 font-sans text-xs text-paper">
                    <div className="flex items-start gap-2.5 text-slate/90">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>All 14 Comprehensive Course Modules</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-slate/90">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>Hands-on Practical Coding Exercises</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-slate/90">
                      <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>Official Verified Course Certificate</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-slate/90">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>Dedicated Mentor Assistance &amp; Doubt Help</span>
                    </div>
                  </div>
                </div>

                {/* Trust badge with increased desktop spacing */}
                <div className="p-3.5 md:p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1 md:mt-8">
                  <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verified Enrollment</span>
                  </div>
                  <p className="text-[11px] text-slate font-sans leading-relaxed">
                    Lifetime access to all lectures, coding tasks, updates, and future curriculum additions.
                  </p>
                </div>
              </div>

              {/* Right Column: Pricing, Coupon & Payment Action */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-5 rounded-2xl bg-black/40 border border-white/10 p-5">
                {/* Coupon Code Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-[11px] text-slate/80 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-primary" />
                      <span>Coupon Code</span>
                    </label>
                    {appliedCoupon && (
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="font-mono text-[10px] text-rose-400 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="font-mono font-bold text-xs">{appliedCoupon.code}</span>
                        <span className="font-mono text-[10px] text-emerald-400/80">
                          ({appliedCoupon.discountValue}% OFF)
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        -₹{discountAmount.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="ENTER COUPON CODE"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value.toUpperCase());
                          setCouponError(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleApplyCoupon();
                          }
                        }}
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-paper font-mono text-xs focus:outline-none focus:border-primary uppercase placeholder:text-slate/40"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-paper font-jakarta text-xs font-bold transition-all cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                  )}

                  {couponError && (
                    <p className="font-mono text-[11px] text-rose-400 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{couponError}</span>
                    </p>
                  )}

                  {couponSuccessMsg && (
                    <p className="font-mono text-[11px] text-emerald-400 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span>{couponSuccessMsg}</span>
                    </p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 border-t border-white/10 pt-3 text-xs font-mono">
                  <div className="flex justify-between text-slate">
                    <span>Course Fee</span>
                    <span className="text-paper line-through">₹{pricing.regularPrice.toLocaleString()}</span>
                  </div>
                  {pricing.regularPrice > pricing.salePrice && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Standard Discount</span>
                      <span>-₹{(pricing.regularPrice - pricing.salePrice).toLocaleString()}</span>
                    </div>
                  )}
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Coupon Discount</span>
                      <span>-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex items-baseline justify-between border-t border-white/10 pt-2 text-paper">
                    <span className="font-bold text-xs uppercase">Total Payable</span>
                    <span className="font-jakarta text-2xl font-black text-primary">
                      ₹{finalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* PAYMENT SECTION */}
                {finalAmount === 0 ? (
                  /* Case A: Zero-Amount Coupon Claim */
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleClaimCourse}
                      disabled={isProcessing}
                      className="w-full py-3.5 px-4 rounded-full font-jakarta font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg bg-primary text-ink hover:bg-white shadow-primary/25 disabled:opacity-50"
                    >
                      <span>{isProcessing ? 'Validating Claim...' : 'Claim Course'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  /* Case B: Paid Course with Scan Google Pay QR as the only option */
                  <div className="space-y-3 pt-2 border-t border-white/10">
                    {/* Displayed normally without green oval border or decoration */}
                    <div
                      onClick={() => setShowPaymentUnavailableModal(true)}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10 text-paper font-mono text-xs cursor-pointer hover:bg-white/[0.06] transition-colors"
                      role="button"
                      tabIndex={0}
                    >
                      <div className="flex items-center gap-2.5">
                        <QrCode className="w-4 h-4 text-slate" />
                        <span className="font-semibold text-paper">Scan Google Pay QR</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate" />
                    </div>

                    {/* Simplified Payment Button */}
                    <button
                      type="button"
                      onClick={() => setShowPaymentUnavailableModal(true)}
                      className="w-full py-3.5 px-4 rounded-full font-jakarta font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg bg-primary text-ink hover:bg-white shadow-primary/25"
                    >
                      <span>Pay ₹{finalAmount.toLocaleString()}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Payment Unavailable Professional Modal */}
        <PaymentUnavailablePopup
          isOpen={showPaymentUnavailableModal}
          onClose={() => setShowPaymentUnavailableModal(false)}
        />
      </div>
    </AnimatePresence>
  );
};
