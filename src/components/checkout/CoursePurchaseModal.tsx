import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Check, Sparkles, Tag, ArrowRight, AlertCircle, Award, CheckCircle2,
  QrCode, Clock, Copy, RefreshCw, Smartphone, ShieldCheck
} from 'lucide-react';
import { useUserAuth } from '../../context/UserAuthContext';
import {
  getCoursePricing,
  validateCoupon,
  recordCoursePurchase,
  getPaymentQRConfig,
  submitManualQRPurchase,
  PaymentQRConfig,
  CourseCoupon,
  CoursePricing
} from '../../utils/coursePricingService';
import {
  processPaymentWithGateway,
  getPaymentGatewayConfig
} from '../../utils/paymentGateway';

export interface CoursePurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseName?: string;
  courseTitle?: string;
  pricing?: CoursePricing;
  onSuccess?: () => void;
}

export const CoursePurchaseModal: React.FC<CoursePurchaseModalProps> = ({
  isOpen,
  onClose,
  courseId,
  courseName,
  courseTitle,
  pricing: propPricing,
  onSuccess
}) => {
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

  // Payment Mode ('upi_pay' | 'upi_qr')
  const [paymentMode, setPaymentMode] = useState<'upi_pay' | 'upi_qr'>('upi_pay');

  // QR Code Configuration & Session Timer State
  const [qrConfig, setQrConfig] = useState<PaymentQRConfig>(() => getPaymentQRConfig());
  const [timeLeft, setTimeLeft] = useState<number>(() => (getPaymentQRConfig().timeoutMinutes || 10) * 60);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Manual UTR Verification State
  const [utrInput, setUtrInput] = useState('');
  const [utrError, setUtrError] = useState<string | null>(null);
  const [verificationSubmitted, setVerificationSubmitted] = useState(false);
  const [submittedUtr, setSubmittedUtr] = useState('');

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
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
      setTimeLeft((cfg.timeoutMinutes || 10) * 60);
      setSessionExpired(false);
      setPaymentMode('upi_pay');
      setUtrInput('');
      setUtrError(null);
      setVerificationSubmitted(false);
      setSubmittedUtr('');
    }
  }, [isOpen, courseId, propPricing]);

  // QR Code Timer Countdown
  useEffect(() => {
    if (!isOpen || verificationSubmitted || sessionExpired || finalAmount === 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setSessionExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, verificationSubmitted, sessionExpired, finalAmount]);

  if (!isOpen) return null;

  const resolvedCourseName = pricing.courseName || courseTitle || courseName || 'Full Course Track';

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleResetSession = () => {
    setTimeLeft((qrConfig.timeoutMinutes || 10) * 60);
    setSessionExpired(false);
    setUtrError(null);
    setUtrInput('');
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

  // Immediate unlock for free course or 100% off coupon
  const handleFreeUnlock = async () => {
    setIsProcessing(true);
    try {
      const studentId = user?.id || user?.email || 'guest_student';
      const studentName = user?.name || user?.email?.split('@')[0] || 'Enrolled Student';
      const studentEmail = user?.email || `${studentId}@student.dopilot.io`;
      const studentPhone = user?.phone || '';

      const result = recordCoursePurchase({
        studentId,
        studentName,
        studentEmail,
        studentPhone,
        courseId,
        courseName: resolvedCourseName,
        originalPrice: pricing.salePrice,
        discountAmount: pricing.salePrice,
        finalAmount: 0,
        couponCodeApplied: appliedCoupon?.code || (pricing.isFreeCourse ? 'ADMIN_FREE_COURSE' : '100_PERCENT_OFF'),
        paymentMethod: 'coupon_free_unlock',
        status: 'completed'
      });

      if (result.success) {
        if (isLoggedIn) {
          enrollInCourse(resolvedCourseName);
        }
        setPurchaseCompleted(true);
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 1600);
      } else {
        setCouponError(result.error || 'Could not complete unlock.');
      }
    } catch (err: any) {
      setCouponError(err?.message || 'Error granting course access.');
    } finally {
      setIsProcessing(false);
    }
  };

  // UPI payment intent / gateway checkout
  const handleUpiPaymentAction = async () => {
    const studentId = user?.id || user?.email || 'guest_student';
    const studentName = user?.name || user?.email?.split('@')[0] || 'Enrolled Student';
    const studentEmail = user?.email || `${studentId}@student.dopilot.io`;
    const studentPhone = user?.phone || '';

    const gwConfig = getPaymentGatewayConfig();

    // If online gateway is configured with credentials, launch standard checkout
    if (gwConfig.isConfigured && gwConfig.keyId) {
      setIsProcessing(true);
      await processPaymentWithGateway({
        amountInRupees: finalAmount,
        courseId,
        courseName: resolvedCourseName,
        studentId,
        studentName,
        studentEmail,
        studentPhone,
        onSuccess: (paymentDetails) => {
          const result = recordCoursePurchase({
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
            paymentMethod: 'razorpay',
            paymentId: paymentDetails.paymentId,
            orderId: paymentDetails.orderId,
            status: 'completed'
          });

          if (result.success) {
            if (isLoggedIn) {
              enrollInCourse(resolvedCourseName);
            }
            setPurchaseCompleted(true);
            setTimeout(() => {
              if (onSuccess) onSuccess();
              onClose();
            }, 1600);
          }
          setIsProcessing(false);
        },
        onError: () => {
          setIsProcessing(false);
          // Seamlessly switch to UPI QR mode if gateway fails
          setPaymentMode('upi_qr');
        },
        onDismiss: () => {
          setIsProcessing(false);
        }
      });
      return;
    }

    // Direct UPI Deep Link for mobile or UPI apps
    const upiLink = `upi://pay?pa=${encodeURIComponent(qrConfig.upiId)}&pn=${encodeURIComponent(qrConfig.merchantName)}&am=${finalAmount}&cu=INR&tn=${encodeURIComponent(resolvedCourseName)}`;
    
    // Attempt opening UPI app directly
    try {
      window.location.href = upiLink;
    } catch (e) {
      // Fallback
    }

    // Switch to QR view so student can see QR code or enter UTR
    setPaymentMode('upi_qr');
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

  // Dynamic QR Code URL (custom uploaded URL or dynamic UPI link)
  const qrImageSrc =
    qrConfig.qrImageUrl && qrConfig.qrImageUrl.trim().length > 0
      ? qrConfig.qrImageUrl
      : `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(
          `upi://pay?pa=${qrConfig.upiId}&pn=${encodeURIComponent(qrConfig.merchantName)}&am=${finalAmount}&cu=INR`
        )}`;

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
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10 relative z-10">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-[10px] font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>Full Lifetime Access</span>
              </div>
              <h3 className="font-jakarta text-xl sm:text-2xl font-black text-paper leading-tight">
                Unlock {resolvedCourseName}
              </h3>
              <p className="text-xs text-slate font-sans">
                Full 14-module curriculum, interactive coding labs, and official certificate.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate hover:text-paper transition-all cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* VIEW 1: Instant Unlock Success */}
          {purchaseCompleted ? (
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
          ) : (
            /* VIEW 3: Standard Purchase Flow */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-5 relative z-10">
              {/* Left Column: What You Get */}
              <div className="md:col-span-5 space-y-5">
                <div className="space-y-3">
                  <h4 className="font-mono text-[11px] uppercase tracking-wider text-slate font-bold">
                    What You Get
                  </h4>
                  <div className="space-y-2.5 font-sans text-xs text-paper">
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

                {/* Trust badge */}
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
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
                  /* Case A: Free / 100% Discounted Course */
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleFreeUnlock}
                      disabled={isProcessing}
                      className="w-full py-3.5 px-4 rounded-full font-jakarta font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg bg-gradient-to-r from-emerald-400 via-primary to-emerald-400 text-ink hover:opacity-95 shadow-primary/25 disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isProcessing ? 'Processing Unlock...' : 'Claim Free Full Course Access (₹0)'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  /* Case B: Paid Course with UPI Payment & Scan QR Flow */
                  <div className="space-y-3 pt-2 border-t border-white/10">
                    {/* Method Selector Tabs */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMode('upi_pay')}
                        className={`p-2.5 rounded-xl border text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          paymentMode === 'upi_pay'
                            ? 'bg-primary/15 border-primary text-primary shadow-md shadow-primary/10'
                            : 'bg-black/40 border-white/10 text-slate hover:text-paper hover:bg-white/5'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Pay with UPI</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMode('upi_qr');
                          if (sessionExpired) handleResetSession();
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          paymentMode === 'upi_qr'
                            ? 'bg-primary/15 border-primary text-primary shadow-md shadow-primary/10'
                            : 'bg-black/40 border-white/10 text-slate hover:text-paper hover:bg-white/5'
                        }`}
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Scan UPI QR</span>
                      </button>
                    </div>

                    {/* Mode 1: Pay with UPI Direct Action */}
                    {paymentMode === 'upi_pay' ? (
                      <div className="space-y-3 pt-1">
                        <button
                          type="button"
                          onClick={handleUpiPaymentAction}
                          disabled={isProcessing}
                          className="w-full py-3.5 px-4 rounded-full font-jakarta font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg bg-primary text-ink hover:bg-white shadow-primary/25 disabled:opacity-50"
                        >
                          <Smartphone className="w-4 h-4" />
                          <span>{isProcessing ? 'Launching Payment...' : `Pay ₹${finalAmount.toLocaleString()} with UPI`}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>

                        <p className="font-mono text-[10px] text-slate/60 text-center">
                          Supports Google Pay, Paytm, PhonePe &amp; all UPI apps
                        </p>
                      </div>
                    ) : (
                      /* Mode 2: Scan QR Code & Enter UTR */
                      <div className="space-y-3 pt-1">
                        {/* Countdown Timer */}
                        <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10 font-mono text-xs">
                          <div className="flex items-center gap-1.5 text-slate">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            <span>Session Time:</span>
                          </div>
                          <span className={`font-bold ${sessionExpired ? 'text-rose-400 animate-pulse' : 'text-primary'}`}>
                            {sessionExpired ? 'EXPIRED' : `${formatTimer(timeLeft)} remaining`}
                          </span>
                        </div>

                        {sessionExpired ? (
                          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center space-y-2">
                            <h5 className="font-jakarta font-bold text-sm text-paper">Payment Session Expired</h5>
                            <p className="text-slate font-mono text-[11px]">
                              The session has timed out. Click below to refresh the timer.
                            </p>
                            <button
                              type="button"
                              onClick={handleResetSession}
                              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-paper font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Retry Payment</span>
                            </button>
                          </div>
                        ) : (
                          <>
                            {/* QR Code */}
                            <div className="p-3 rounded-2xl bg-white flex flex-col items-center justify-center">
                              <img
                                src={qrImageSrc}
                                alt="Scan UPI QR Code to Pay"
                                className="w-44 h-44 object-contain rounded-lg"
                              />
                              <p className="font-mono text-[10px] text-black/70 font-bold mt-1">
                                Scan with Google Pay, Paytm, or any UPI App
                              </p>
                            </div>

                            {/* Merchant UPI ID */}
                            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs">
                              <div className="min-w-0 pr-2">
                                <span className="text-[10px] text-slate block">Merchant UPI ID:</span>
                                <span className="font-bold text-paper truncate block">{qrConfig.upiId}</span>
                              </div>
                              <button
                                type="button"
                                onClick={handleCopyUpiId}
                                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-paper text-[11px] transition-all cursor-pointer shrink-0 flex items-center gap-1"
                              >
                                <Copy className="w-3 h-3" />
                                <span>{copiedUpi ? 'Copied!' : 'Copy'}</span>
                              </button>
                            </div>

                            {/* 12-Digit UTR Input */}
                            <div className="space-y-1.5">
                              <label className="font-mono text-[11px] text-slate font-bold uppercase tracking-wider block">
                                Enter 12-Digit UPI Reference / UTR
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. 423589102345"
                                value={utrInput}
                                onChange={(e) => {
                                  setUtrInput(e.target.value.trim());
                                  setUtrError(null);
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-paper font-mono text-xs focus:outline-none focus:border-primary"
                              />
                              {utrError && (
                                <p className="font-mono text-[11px] text-rose-400 flex items-center gap-1 pt-0.5">
                                  <AlertCircle className="w-3 h-3 shrink-0" />
                                  <span>{utrError}</span>
                                </p>
                              )}
                            </div>

                            {/* Submit for Verification Button */}
                            <button
                              type="button"
                              onClick={handleSubmitManualQRPayment}
                              disabled={isProcessing}
                              className="w-full py-3.5 px-4 rounded-full font-jakarta font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg bg-primary text-ink hover:bg-white shadow-primary/25 disabled:opacity-50"
                            >
                              <Check className="w-4 h-4" />
                              <span>{isProcessing ? 'Submitting...' : 'Submit Payment for Verification'}</span>
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
