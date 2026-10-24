import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, CheckCircle2, FileText, Check, AlertCircle, BookOpen } from 'lucide-react';
import { congratsAnimationData } from '../data/congratsAnimation';
import { getCourseOverallSummary, CourseOverallSummary } from '../utils/coursePerformanceSummary';
import { getSavedCertificate } from '../utils/certificateGenerator';

interface CourseCompletionCardProps {
  courseId?: string;
  onClaimCertificate: () => void;
}

export const CourseCompletionCard: React.FC<CourseCompletionCardProps> = ({
  courseId = 'python-core',
  onClaimCertificate
}) => {
  const navigate = useNavigate();
  const animContainerRef = useRef<HTMLDivElement>(null);
  const [animationFinished, setAnimationFinished] = useState(false);
  const [summary, setSummary] = useState<CourseOverallSummary>(() => getCourseOverallSummary(courseId));
  const [hasClaimedCert, setHasClaimedCert] = useState<boolean>(() => {
    return Boolean(getSavedCertificate(courseId));
  });

  useEffect(() => {
    setSummary(getCourseOverallSummary(courseId));
    setHasClaimedCert(Boolean(getSavedCertificate(courseId)));
  }, [courseId]);

  useEffect(() => {
    const handleStorage = () => {
      setHasClaimedCert(Boolean(getSavedCertificate(courseId)));
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('dopilot_certificate_claimed', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('dopilot_certificate_claimed', handleStorage);
    };
  }, [courseId]);

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
          /* STEP 1: Animation First — Smooth celebration animation */
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
          /* STEP 2: After Animation — Congratulations Screen with Minimal Performance Summary */
          <motion.div
            key="congrats-card"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#0f1117]/95 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-lg w-full mx-auto text-center shadow-2xl backdrop-blur-xl relative overflow-hidden space-y-5"
          >
            {/* Subtle Top Ambient Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500" />

            {/* Typography */}
            <div className="space-y-1.5 pt-1">
              <h2 className="font-jakarta text-2xl sm:text-3xl font-black text-white tracking-tight">
                Congratulations, You Did It!
              </h2>
              <p className="font-sans text-xs sm:text-sm font-semibold text-amber-300 tracking-wide">
                Certificate Achievement Unlocked
              </p>
            </div>

            {/* Performance Summary Card */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3.5 text-left">
              {/* Header with Performance Rating Pill */}
              <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate">
                  Overall Course Performance
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold bg-amber-400/15 border border-amber-400/35 text-amber-300">
                  <CheckCircle2 className="w-3 h-3 text-amber-400" />
                  <span>{summary.performanceLabel}</span>
                </span>
              </div>

              {/* Total Marks Banner */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-amber-300/80">Total Marks Earned</div>
                  <div className="font-mono text-xl sm:text-2xl font-black text-white">
                    {summary.marksEarned} <span className="text-xs font-normal text-slate">/ {summary.maxMarks}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-amber-300/80">Percentage</div>
                  <div className="font-mono text-xl sm:text-2xl font-black text-amber-400">
                    {summary.percentage}%
                  </div>
                </div>
              </div>

              {/* 4-Stat Grid: Total Questions, Answered, Correct, Failed */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-center">
                  <div className="text-[10px] font-mono text-slate uppercase">Total Questions</div>
                  <div className="font-mono text-lg font-bold text-white mt-0.5">{summary.totalQuestions}</div>
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-center">
                  <div className="text-[10px] font-mono text-slate uppercase">Questions Answered</div>
                  <div className="font-mono text-lg font-bold text-white mt-0.5">{summary.answeredCount}</div>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center">
                  <div className="text-[10px] font-mono text-emerald-400 uppercase">Correct Answers</div>
                  <div className="font-mono text-lg font-bold text-emerald-400 mt-0.5">{summary.correctCount}</div>
                </div>

                <div className="p-2.5 rounded-xl bg-rose-500/5 border border-rose-500/20 text-center">
                  <div className="text-[10px] font-mono text-rose-400 uppercase">Failed Answers</div>
                  <div className="font-mono text-lg font-bold text-rose-400 mt-0.5">{summary.failedCount}</div>
                </div>
              </div>
            </div>

            {/* Action buttons: Claim Official Certificate (PDF) & Compact Review Answers if claimed */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={onClaimCertificate}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-105 text-black font-jakarta font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <Award className="w-4 h-4 text-black shrink-0" />
                <span>{hasClaimedCert ? 'View / Download Certificate (PDF)' : 'Claim Official Certificate (PDF)'}</span>
              </button>

              {hasClaimedCert && (
                <button
                  type="button"
                  onClick={() => {
                    const firstPart = courseId === 'fullstack-open' ? 'part-0' : 'part-1';
                    const targetCourse = (courseId === 'java-core' || courseId === 'complete-java-programming')
                      ? 'complete-java-programming'
                      : courseId;
                    navigate(`/course/${targetCourse}/${firstPart}?review=true`);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/10 border border-white/15 text-paper font-jakarta font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                >
                  <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>Review Answers</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseCompletionCard;
