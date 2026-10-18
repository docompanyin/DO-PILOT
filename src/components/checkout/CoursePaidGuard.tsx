import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Lock, ShoppingBag, ArrowLeft, Play, ShieldAlert, Sparkles } from 'lucide-react';
import { useUserAuth } from '../../context/UserAuthContext';
import { hasCourseAccess, getCoursePricing, CoursePricing } from '../../utils/coursePricingService';
import { CoursePurchaseModal } from './CoursePurchaseModal';
import { COURSES_DATA, getCourseById } from '../../data/coursesData';

interface CoursePaidGuardProps {
  courseId?: string;
  partNum: number;
  children: React.ReactNode;
}

export const CoursePaidGuard: React.FC<CoursePaidGuardProps> = ({
  courseId: propCourseId,
  partNum,
  children
}) => {
  const navigate = useNavigate();
  const { user, enrollInCourse } = useUserAuth();
  const params = useParams<{ courseId?: string }>();

  // Resolve normalized course ID
  const rawId = propCourseId || params.courseId || 'python-core';
  let normalizedCourseId = 'python-core';
  if (rawId.includes('java')) normalizedCourseId = 'java-core';
  else if (rawId.includes('fullstack')) normalizedCourseId = 'fullstack-open';
  else if (rawId.includes('cyber')) normalizedCourseId = 'cyber-security';
  else if (rawId.includes('python')) normalizedCourseId = 'python-core';

  /* [DEV_TEST_CERTIFICATE_WORKFLOW] Temporary testing bypass for certificate verification - safe to remove */
  const isDevTestCert = typeof window !== 'undefined' && sessionStorage.getItem('dopilot_dev_test_cert_mode') === 'true';

  const [hasAccess, setHasAccess] = useState<boolean>(() => {
    if (isDevTestCert) return true;
    return hasCourseAccess(normalizedCourseId, user?.id || user?.email);
  });
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [pricing, setPricing] = useState<CoursePricing | undefined>(() => getCoursePricing(normalizedCourseId));

  const courseMeta = getCourseById(normalizedCourseId) || COURSES_DATA[0];

  useEffect(() => {
    const check = () => {
      const isDevTestCertNow = typeof window !== 'undefined' && sessionStorage.getItem('dopilot_dev_test_cert_mode') === 'true';
      const accessGranted = isDevTestCertNow || hasCourseAccess(normalizedCourseId, user?.id || user?.email);
      setHasAccess(accessGranted);
      setPricing(getCoursePricing(normalizedCourseId));
      if (accessGranted) {
        const studentId = user?.id || user?.email || 'default_student';
        try {
          localStorage.removeItem(`dopilot_locked_${studentId}`);
          localStorage.removeItem(`dopilot_locked_progression_${studentId}`);
          localStorage.removeItem(`dopilot_fullstack_p1_locked_${studentId}`);
        } catch {}
      }
    };
    check();
    window.addEventListener('dopilot_course_purchased', check);
    window.addEventListener('dopilot_pricing_updated', check);
    window.addEventListener('storage', check);
    return () => {
      window.removeEventListener('dopilot_course_purchased', check);
      window.removeEventListener('dopilot_pricing_updated', check);
      window.removeEventListener('storage', check);
    };
  }, [normalizedCourseId, user?.id, user?.email]);

  // Immediate redirect to homepage if user is unauthenticated or logs out
  useEffect(() => {
    if (!user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleLogout = () => {
      navigate('/', { replace: true });
    };
    window.addEventListener('dopilot_user_logged_out', handleLogout);
    return () => window.removeEventListener('dopilot_user_logged_out', handleLogout);
  }, [navigate]);

  // If student has full access, render the protected part immediately
  if (hasAccess) {
    return <>{children}</>;
  }

  // Otherwise, render full-access locked screen with instant coupon/purchase modal
  const handleBackToFreePart = () => {
    if (normalizedCourseId === 'fullstack-open') {
      navigate('/course/fullstack-open/part-0');
    } else if (normalizedCourseId === 'java-core') {
      navigate('/course/complete-java-programming/part-1');
    } else if (normalizedCourseId === 'cyber-security') {
      navigate('/course/cyber-security/part-1');
    } else {
      navigate('/course/python-core/part-1');
    }
  };

  return (
    <div className="min-h-screen bg-black text-paper flex flex-col items-center justify-center p-4 sm:p-6 relative select-none">
      {/* Background Glow */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 blur-[150px] pointer-events-none" />

      <div className="max-w-md w-full rounded-3xl bg-[#0c0d0e] border border-white/15 p-6 sm:p-8 space-y-6 text-center relative z-10 shadow-2xl">
        {/* Lock Icon Badge */}
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-xl shadow-amber-500/10">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 inline-block mb-3">
            Part {partNum} • Paid Access Required
          </span>
          <h2 className="font-jakarta font-black text-2xl sm:text-3xl text-paper">
            Unlock Full Course Access
          </h2>
          <p className="text-slate text-xs sm:text-sm mt-2 leading-relaxed">
            Part 1 of <strong>{courseMeta?.title || 'this track'}</strong> is 100% free to try. To access Part {partNum} and all 14 curriculum stages, please purchase the course or redeem a coupon code.
          </p>
        </div>

        {/* Pricing Summary Box */}
        {pricing && (
          <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between">
            <div className="text-left">
              <div className="text-[10px] font-mono text-slate uppercase">Full Track Price</div>
              <div className="font-jakarta font-bold text-sm text-paper">{pricing.courseName}</div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate line-through mr-1.5 font-mono">₹{pricing.regularPrice}</span>
              <span className="text-lg font-black text-primary font-mono">₹{pricing.salePrice}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={() => setPurchaseModalOpen(true)}
            className="w-full py-3.5 px-6 rounded-2xl bg-primary text-ink font-jakarta font-black text-sm hover:brightness-110 shadow-xl shadow-primary/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>{pricing?.isFreeCourse ? 'Enroll Free' : 'Buy Now'}</span>
          </button>

          <button
            type="button"
            onClick={handleBackToFreePart}
            className="w-full py-3 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-paper font-jakarta font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-primary fill-primary shrink-0" />
            <span>Try Part 1 (Free Trial)</span>
          </button>

          <button
            type="button"
            onClick={() => navigate(`/course/${normalizedCourseId}`)}
            className="w-full py-2.5 text-slate hover:text-paper font-mono text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Course Details</span>
          </button>
        </div>
      </div>

      {/* Checkout & Coupon Modal */}
      {pricing && (
        <CoursePurchaseModal
          isOpen={purchaseModalOpen}
          onClose={() => setPurchaseModalOpen(false)}
          courseId={normalizedCourseId}
          courseTitle={courseMeta.title}
          pricing={pricing}
          onSuccess={() => {
            setHasAccess(true);
            enrollInCourse(courseMeta.title);
            const studentId = user?.id || user?.email || 'default_student';
            try {
              localStorage.removeItem(`dopilot_locked_${studentId}`);
              localStorage.removeItem(`dopilot_locked_progression_${studentId}`);
              localStorage.removeItem(`dopilot_fullstack_p1_locked_${studentId}`);
            } catch {}
          }}
        />
      )}
    </div>
  );
};
