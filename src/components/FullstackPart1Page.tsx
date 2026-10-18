import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Clock, ArrowRight, Trophy, RotateCcw,
  CheckCircle2, AlertCircle, Shuffle, Sparkles, AlertTriangle, ShieldAlert, ShoppingBag
} from 'lucide-react';
import { FullstackCompilerLauncherButton, FullstackWebModal, FullstackTaskContext } from './compiler/FullstackWebModal';
import { useCoursePoints } from '../context/CoursePointsContext';
import { useUserAuth } from '../context/UserAuthContext';
import { ContactModal } from './ContactModal';
import { NeedHelpModal } from './NeedHelpModal';
import { hasCourseAccess, getCoursePricing, CoursePricing } from '../utils/coursePricingService';
import { CoursePurchaseModal } from './checkout/CoursePurchaseModal';
import { 
  FULLSTACK_PART_1_SECTIONS, TheoryBlock, McqQuestion,
  getActiveQuestionsForLevelFullstackPart1, getConsecutiveFailedLevelsFullstackPart1,
  recordLevelAttemptResultFullstackPart1, resetConsecutiveFailuresFullstackPart1,
  setLevelAttemptCountFullstackPart1
} from '../data/fullstackPart1Data';
import { 
  recordPart1SectionScore, getPart1OverallScore,
  markPart1RestartUsed, clearPart1ScoresOnRestart,
  hasUsedPart1Restart,
  markTrialAttempted, hasAttemptedTrial
} from '../utils/part1ScoreService';
import { useCourseQuestionResume } from '../utils/courseProgressSyncService';
import { playTwinkleSound } from '../utils/audioEffects';

const TIMER_DURATION = 30; // 30 seconds

interface LevelResultState {
  isFinished: boolean;
  isPassed: boolean;
  correctCount: number;
  totalCount: number;
  percentage: number;
  streak: number;
  attemptCount: number;
  isSecondFailureInLevel: boolean;
  isLocked: boolean;
}

export const FullstackPart1Page: React.FC = () => {
  const navigate = useNavigate();
  const { points, isTaskSolved, awardPoint, recordWrongAttempt, resetProgress } = useCoursePoints();
  const { user } = useUserAuth();

  const studentId = user?.id || user?.email || 'default_student';

  // Persistent Active Section ID (Defaults to Section 1.1)
  const [activeSectionId, setActiveSectionId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('dopilot_fullstack_part1_active_section_id');
      return saved || '1-1-react-components-jsx';
    } catch {
      return '1-1-react-components-jsx';
    }
  });

  // Persistent Question Index
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('dopilot_fullstack_part1_active_q_idx');
      return saved !== null ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  const activeSection = FULLSTACK_PART_1_SECTIONS.find(s => s.id === activeSectionId) || FULLSTACK_PART_1_SECTIONS[0];
  const activeIdx = FULLSTACK_PART_1_SECTIONS.findIndex(s => s.id === activeSection.id);

  // Active question set for current level with question duplicate prevention
  const [levelQuestions, setLevelQuestions] = useState<McqQuestion[]>(() => {
    return getActiveQuestionsForLevelFullstackPart1(activeSection, studentId, false);
  });

  // Track level failure / pass outcome state
  const [levelResult, setLevelResult] = useState<LevelResultState | null>(null);

  // Consecutive failure counter (loaded dynamically from student record)
  const [consecutiveFailures, setConsecutiveFailures] = useState<number>(() => {
    return getConsecutiveFailedLevelsFullstackPart1(studentId);
  });

  // Disclaimer popup state when choosing "Continue to Next Set" on 2nd consecutive failure
  const [disclaimerModalOpen, setDisclaimerModalOpen] = useState(false);
  const [disclaimerConfirmed, setDisclaimerConfirmed] = useState(false);

  // Course access & purchase modal state
  const [hasPurchased, setHasPurchased] = useState<boolean>(() => {
    return hasCourseAccess('fullstack-open', user?.id || user?.email);
  });
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [pricing, setPricing] = useState<CoursePricing | undefined>(() => getCoursePricing('fullstack-open'));

  useEffect(() => {
    const check = () => {
      setHasPurchased(hasCourseAccess('fullstack-open', user?.id || user?.email));
      setPricing(getCoursePricing('fullstack-open'));
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
  }, [user?.id, user?.email]);

  // Immediate redirect to homepage if user is not authenticated or signs out
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

  const handlePostPurchaseUnlock = () => {
    setHasPurchased(true);
    resetConsecutiveFailuresFullstackPart1(studentId);
    try {
      localStorage.removeItem(`dopilot_locked_${studentId}`);
      localStorage.removeItem(`dopilot_locked_progression_${studentId}`);
      localStorage.removeItem(`dopilot_fullstack_p1_locked_${studentId}`);
    } catch {}

    const overallScore = getPart1OverallScore('fullstack-open', studentId);
    // Users who passed the free trial (50% or higher) redirect directly to Part 2:
    if (overallScore.isAbove50) {
      try {
        localStorage.setItem('dopilot_fullstack_part0_completed', 'true');
        localStorage.setItem('dopilot_fullstack_part1_completed', 'true');
        localStorage.setItem('dopilot_fullstack_core_last_part', '2');
      } catch {}
      navigate('/course/fullstack-open/part-2');
    } else {
      // Below 50% following a failed trial:
      // Keep isCourseComplete = true and hasPurchased = true so user gets exactly one additional attempt at Part 1
      setIsCourseComplete(true);
    }
  };

  const handleRetryPart1 = () => {
    markPart1RestartUsed('fullstack-open', studentId);
    clearPart1ScoresOnRestart('fullstack-open', studentId);
    try {
      localStorage.removeItem('dopilot_fullstack_part1_completed');
      localStorage.removeItem('dopilot_fullstack_part1_finished');
      localStorage.removeItem('dopilot_fullstack_part1_mcq_answers');
      localStorage.removeItem('dopilot_fullstack_part1_time_up');
      localStorage.setItem('dopilot_fullstack_core_last_part', '1');
      localStorage.setItem('dopilot_fullstack_part1_active_section_id', FULLSTACK_PART_1_SECTIONS[0].id);
      localStorage.setItem('dopilot_fullstack_part1_active_q_idx', '0');
      localStorage.setItem('dopilot_fullstack_part1_study_phase', 'true');
    } catch {}
    setSelectedAnswers({});
    setActiveSectionId(FULLSTACK_PART_1_SECTIONS[0].id);
    setActiveQuestionIdx(0);
    setLevelResult(null);
    setIsCourseComplete(false);
    setIsStudyPhase(true);
    setIsTimeUpWaiting(false);
    setTimeLeft(TIMER_DURATION);
    const fresh = Date.now() + TIMER_DURATION * 1000;
    setTargetEndTime(fresh);
    try {
      localStorage.setItem('dopilot_fullstack_part1_q_target_end_time', String(fresh));
    } catch {}
    const freshQuestions = getActiveQuestionsForLevelFullstackPart1(FULLSTACK_PART_1_SECTIONS[0], studentId, true);
    setLevelQuestions(freshQuestions);
  };

  const handleContinueToPart2 = () => {
    try {
      localStorage.setItem('dopilot_fullstack_part0_completed', 'true');
      localStorage.setItem('dopilot_fullstack_part1_completed', 'true');
      localStorage.setItem('dopilot_fullstack_core_last_part', '2');
    } catch {}
    navigate('/course/fullstack-open/part-2');
  };

  // Persistent MCQ selected answers
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('dopilot_fullstack_part1_mcq_answers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Update questions whenever active level changes
  useEffect(() => {
    const qList = getActiveQuestionsForLevelFullstackPart1(activeSection, studentId, false);
    setLevelQuestions(qList);
    setLevelResult(null);
  }, [activeSectionId, studentId]);

  const currentBlock: TheoryBlock = activeSection.theoryBlocks[activeQuestionIdx] || activeSection.theoryBlocks[0];
  const currentMcq: McqQuestion = levelQuestions[activeQuestionIdx] || currentBlock.mcq!;
  const taskId = `fullstack-1-${activeSection.id}-${currentMcq.id || activeQuestionIdx}`;

  // Whether user is currently in Study Phase (reading note with no timer pressure) or Question Phase (30s timer)
  const [isStudyPhase, setIsStudyPhase] = useState<boolean>(() => {
    try {
      const answers = JSON.parse(localStorage.getItem('dopilot_fullstack_part1_mcq_answers') || '{}');
      if (answers[taskId]) return false; // Already answered
      const savedPhase = localStorage.getItem('dopilot_fullstack_part1_study_phase');
      if (savedPhase !== null) return savedPhase === 'true';
    } catch {}
    return true; // Read note first by default
  });

  // Target End Timestamp for the 30-second question timer
  const [targetEndTime, setTargetEndTime] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('dopilot_fullstack_part1_q_target_end_time');
      const num = saved ? Number(saved) : 0;
      if (num) {
        return num;
      }
    } catch {}
    return Date.now() + TIMER_DURATION * 1000;
  });

  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const diff = Math.ceil((targetEndTime - Date.now()) / 1000);
    return Math.max(0, Math.min(TIMER_DURATION, diff));
  });

  // Waiting for Continue click when user didn't enter an answer in time
  const [isTimeUpWaiting, setIsTimeUpWaiting] = useState<boolean>(() => {
    try {
      if (localStorage.getItem('dopilot_fullstack_part1_time_up') === 'true') return true;
      const savedPhase = localStorage.getItem('dopilot_fullstack_part1_study_phase');
      if (savedPhase === 'true') return false;
      const savedEnd = Number(localStorage.getItem('dopilot_fullstack_part1_q_target_end_time'));
      const answers = JSON.parse(localStorage.getItem('dopilot_fullstack_part1_mcq_answers') || '{}');
      if (savedEnd && savedEnd <= Date.now() && !answers[taskId]) {
        return true;
      }
    } catch {}
    return false;
  });

  useCourseQuestionResume({
    courseId: 'fullstack-open',
    partNum: 1,
    studentEmail: user?.email,
    activeSectionId,
    setActiveSectionId,
    activeQuestionIdx,
    setActiveQuestionIdx,
    setSelectedAnswers,
    setIsStudyPhase,
    setIsTimeUpWaiting,
    setTimeLeft,
    setTargetEndTime,
    validSectionIds: FULLSTACK_PART_1_SECTIONS.map(s => s.id)
  });

  const [isCourseComplete, setIsCourseComplete] = useState<boolean>(() => {
    try {
      const finished = localStorage.getItem('dopilot_fullstack_part1_finished') === 'true';
      const saved = localStorage.getItem('dopilot_fullstack_part1_completed') === 'true';
      if (saved || finished) return true;
      return false;
    } catch {
      return false;
    }
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [part2ModalOpen, setPart2ModalOpen] = useState(false);
  const [compilerModalOpen, setCompilerModalOpen] = useState(false);
  const [, setActiveTask] = useState<FullstackTaskContext | null>(null);

  // Smooth animated points celebration state
  const [pointAwardAnim, setPointAwardAnim] = useState<{ id: number; diff: number } | null>(null);
  const prevPointsRef = useRef<number>(points);

  // 3-second auto-skip countdown state after answering correctly
  const [correctCountdown, setCorrectCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (points > prevPointsRef.current) {
      const diff = points - prevPointsRef.current;
      setPointAwardAnim({ id: Date.now(), diff });
      playTwinkleSound();
      const timer = setTimeout(() => {
        setPointAwardAnim(null);
      }, 1200);
      prevPointsRef.current = points;
      return () => clearTimeout(timer);
    }
    prevPointsRef.current = points;
  }, [points]);

  // Calculate remaining count across current level
  const totalLevelQuestions = activeSection.theoryBlocks.length;
  const currentLevelQuestionNumber = activeQuestionIdx + 1;
  const remainingLevelQuestions = Math.max(0, totalLevelQuestions - currentLevelQuestionNumber);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = `Level ${activeSection.number}: ${activeSection.title} — Full Stack Open`;
    try {
      localStorage.setItem('dopilot_fullstack_core_last_part', '1');
    } catch {}
  }, [activeSectionId, activeQuestionIdx]);

  // Ref to track latest state inside setInterval
  const stateRef = useRef({
    activeSectionId,
    activeIdx,
    activeQuestionIdx,
    targetEndTime,
    selectedAnswers,
    isTimeUpWaiting,
    isStudyPhase,
    levelQuestions,
    currentMcq,
    taskId
  });

  useEffect(() => {
    stateRef.current = {
      activeSectionId,
      activeIdx,
      activeQuestionIdx,
      targetEndTime,
      selectedAnswers,
      isTimeUpWaiting,
      isStudyPhase,
      levelQuestions,
      currentMcq,
      taskId
    };
  });

  // Action: Student finishes reading note on left, unlocks question and starts 30-sec timer!
  const handleStartQuestion = () => {
    setIsStudyPhase(false);
    setIsTimeUpWaiting(false);
    const freshEnd = Date.now() + TIMER_DURATION * 1000;
    setTargetEndTime(freshEnd);
    setTimeLeft(TIMER_DURATION);
    try {
      localStorage.setItem('dopilot_fullstack_part1_study_phase', 'false');
      localStorage.setItem('dopilot_fullstack_part1_q_target_end_time', String(freshEnd));
      localStorage.removeItem('dopilot_fullstack_part1_time_up');
    } catch (e) {
      console.error(e);
    }
  };

  // Evaluate Level Score after the 6 compulsory questions in a level
  const evaluateLevelScore = () => {
    const qList = stateRef.current.levelQuestions;
    const secId = stateRef.current.activeSectionId;
    const currentAnswers = stateRef.current.selectedAnswers;

    let correctCount = 0;
    const totalCount = qList.length;

    qList.forEach((q, idx) => {
      const qTaskId = `fullstack-1-${secId}-${q.id || idx}`;
      const chosen = currentAnswers[qTaskId];
      if (chosen === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const percentage = Math.round((correctCount / totalCount) * 100);
    const isPassed = percentage > 80;

    // Record section score for post-purchase overall Part 1 calculation (> 50% overall across 1.1-1.6)
    recordPart1SectionScore('fullstack-open', secId, correctCount, totalCount, studentId);

    if (!hasPurchased) {
      markTrialAttempted('fullstack-open', studentId);
    }

    // Free-trial failure flow: Only track/increment consecutive failures if user has purchased the course!
    const outcome = hasPurchased
      ? recordLevelAttemptResultFullstackPart1(secId, studentId, isPassed)
      : {
          consecutiveFailedLevels: 0,
          attemptCount: 1,
          isSecondFailureInLevel: false,
          isLocked: false
        };

    setLevelResult({
      isFinished: true,
      isPassed,
      correctCount,
      totalCount,
      percentage,
      streak: outcome.consecutiveFailedLevels,
      attemptCount: outcome.attemptCount,
      isSecondFailureInLevel: outcome.isSecondFailureInLevel,
      isLocked: outcome.isLocked
    });

    setConsecutiveFailures(outcome.consecutiveFailedLevels);

    if (hasPurchased && outcome.isLocked) {
      setModalOpen(true);
    }
  };

  // Advance function to go to next question or complete level
  const advanceToNextQuestion = () => {
    setCorrectCountdown(null);
    setIsTimeUpWaiting(false);
    setIsStudyPhase(true);
    try {
      localStorage.setItem('dopilot_fullstack_part1_study_phase', 'true');
    } catch {}

    const { activeQuestionIdx: qIdx, levelQuestions: qList } = stateRef.current;
    const nextQ = qIdx + 1;

    if (nextQ < qList.length) {
      setActiveQuestionIdx(nextQ);
      setTimeLeft(TIMER_DURATION);
      try {
        localStorage.setItem('dopilot_fullstack_part1_active_q_idx', String(nextQ));
      } catch (e) {
        console.error(e);
      }
    } else {
      evaluateLevelScore();
    }
  };

  // Reset Questions for Current Level (loads alternative distinct questions for same concepts)
  const handleResetQuestions = () => {
    const newQuestions = getActiveQuestionsForLevelFullstackPart1(activeSection, studentId, true);
    setLevelQuestions(newQuestions);

    const updatedAnswers = { ...selectedAnswers };
    newQuestions.forEach((q, idx) => {
      const oldTaskId = `fullstack-1-${activeSection.id}-${q.id || idx}`;
      delete updatedAnswers[oldTaskId];
    });
    setSelectedAnswers(updatedAnswers);

    setActiveQuestionIdx(0);
    setCorrectCountdown(null);
    setLevelResult(null);
    setIsStudyPhase(true);
    setIsTimeUpWaiting(false);
    setTimeLeft(TIMER_DURATION);
    const fresh = Date.now() + TIMER_DURATION * 1000;
    setTargetEndTime(fresh);

    try {
      localStorage.setItem('dopilot_fullstack_part1_mcq_answers', JSON.stringify(updatedAnswers));
      localStorage.setItem('dopilot_fullstack_part1_active_q_idx', '0');
      localStorage.setItem('dopilot_fullstack_part1_study_phase', 'true');
      localStorage.setItem('dopilot_fullstack_part1_q_target_end_time', String(fresh));
      localStorage.removeItem('dopilot_fullstack_part1_time_up');
    } catch (e) {
      console.error(e);
    }
  };

  // Progress to the next level
  const handleProceedToNextLevel = () => {
    if (hasPurchased && localStorage.getItem(`dopilot_fullstack_p1_locked_${studentId}`) === 'true') {
      setModalOpen(true);
      return;
    }

    const nextSecIdx = activeIdx + 1;
    if (nextSecIdx < FULLSTACK_PART_1_SECTIONS.length) {
      const nextSec = FULLSTACK_PART_1_SECTIONS[nextSecIdx];
      setActiveSectionId(nextSec.id);
      setActiveQuestionIdx(0);
      setLevelResult(null);
      setIsStudyPhase(true);
      setIsTimeUpWaiting(false);
      setTimeLeft(TIMER_DURATION);
      const fresh = Date.now() + TIMER_DURATION * 1000;
      setTargetEndTime(fresh);

      setLevelAttemptCountFullstackPart1(nextSec.id, studentId, 1);

      const nextQuestions = getActiveQuestionsForLevelFullstackPart1(nextSec, studentId, false);
      setLevelQuestions(nextQuestions);

      try {
        localStorage.setItem('dopilot_fullstack_part1_active_section_id', nextSec.id);
        localStorage.setItem('dopilot_fullstack_part1_active_q_idx', '0');
        localStorage.setItem('dopilot_fullstack_part1_study_phase', 'true');
        localStorage.setItem('dopilot_fullstack_part1_q_target_end_time', String(fresh));
        localStorage.removeItem('dopilot_fullstack_part1_time_up');
      } catch (e) {
        console.error(e);
      }
    } else {
      const part1Summary = getPart1OverallScore('fullstack-open', studentId);
      setIsCourseComplete(true);
      playTwinkleSound();
      try {
        localStorage.setItem('dopilot_fullstack_part1_finished', 'true');
        if (hasPurchased || part1Summary.isAbove50) {
          localStorage.setItem('dopilot_fullstack_part1_completed', 'true');
        } else {
          localStorage.removeItem('dopilot_fullstack_part1_completed');
        }
      } catch {}
    }
  };

  // Auto-skip countdown after answering correctly
  useEffect(() => {
    if (correctCountdown === null) return;
    if (correctCountdown <= 0) {
      setCorrectCountdown(null);
      advanceToNextQuestion();
      return;
    }
    const t = setTimeout(() => {
      setCorrectCountdown(prev => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(t);
  }, [correctCountdown]);

  // Timer Tick: Checks every 250ms against exact target timestamp ONLY when study phase is finished
  useEffect(() => {
    if (isCourseComplete || isStudyPhase || levelResult?.isFinished) return;

    const interval = setInterval(() => {
      if (stateRef.current.isTimeUpWaiting || stateRef.current.isStudyPhase) return;

      const userChoice = stateRef.current.selectedAnswers[stateRef.current.taskId];
      const correctAns = stateRef.current.currentMcq?.correctAnswer;

      const isWrongAnswer = Boolean(userChoice && userChoice !== correctAns);
      const isCorrectAnswer = Boolean(userChoice && userChoice === correctAns);

      if (isWrongAnswer || isCorrectAnswer) {
        return;
      }

      const now = Date.now();
      const diff = Math.ceil((targetEndTime - now) / 1000);

      if (diff <= 0) {
        setTimeLeft(0);
        if (!userChoice) {
          setIsTimeUpWaiting(true);
          try {
            localStorage.setItem('dopilot_fullstack_part1_time_up', 'true');
          } catch {}
        }
      } else {
        setTimeLeft(diff);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [targetEndTime, isCourseComplete, isStudyPhase, levelResult]);

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSelectOption = (tId: string, heading: string, optId: string, isCorrect: boolean) => {
    if (selectedAnswers[tId] || isTaskSolved(tId) || isTimeUpWaiting || isStudyPhase || levelResult?.isFinished) {
      return;
    }
    const updated = { ...selectedAnswers, [tId]: optId };
    setSelectedAnswers(updated);
    try {
      localStorage.setItem('dopilot_fullstack_part1_mcq_answers', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    if (isCorrect) {
      awardPoint(tId, heading, optId);
      setCorrectCountdown(3);
    } else {
      const chosenOpt = currentMcq.options.find(o => o.id === optId);
      recordWrongAttempt(
        heading,
        activeSection.title,
        `Selected Option ${optId}: "${chosenOpt?.text || ''}". Correct was Option ${currentMcq.correctAnswer}.`
      );
    }
  };

  // Reset entire Part 1 progress completely
  const handleResetAll = () => {
    if (!window.confirm("Reset all your Part 1 Full Stack Open progress and begin from Level 1.1?")) {
      return;
    }
    resetProgress();
    resetConsecutiveFailuresFullstackPart1(studentId);
    setConsecutiveFailures(0);
    setActiveSectionId(FULLSTACK_PART_1_SECTIONS[0].id);
    setActiveQuestionIdx(0);
    setSelectedAnswers({});
    setLevelResult(null);
    setIsCourseComplete(false);
    setTimeLeft(TIMER_DURATION);
    const fresh = Date.now() + TIMER_DURATION * 1000;
    setTargetEndTime(fresh);
    setIsTimeUpWaiting(false);
    setIsStudyPhase(true);

    try {
      localStorage.removeItem('dopilot_fullstack_part1_mcq_answers');
      localStorage.removeItem('dopilot_fullstack_part1_active_section_id');
      localStorage.removeItem('dopilot_fullstack_part1_active_q_idx');
      localStorage.removeItem('dopilot_fullstack_part1_completed');
      localStorage.removeItem('dopilot_fullstack_part1_q_target_end_time');
      localStorage.removeItem(`dopilot_fullstack_p1_consecutive_failures_${studentId}`);
      localStorage.removeItem(`dopilot_fullstack_p1_locked_${studentId}`);
      localStorage.setItem('dopilot_fullstack_part1_study_phase', 'true');
    } catch (e) {
      console.error(e);
    }
  };

  const isSolved = isTaskSolved(taskId);
  const currentChoice = selectedAnswers[taskId] || (isSolved ? currentMcq.correctAnswer : undefined);
  const isLocked = Boolean(currentChoice);
  const isUserWrongAnswer = Boolean(currentChoice && currentChoice !== currentMcq.correctAnswer);

  return (
    <div className="min-h-screen bg-black text-paper selection:bg-primary selection:text-ink relative overflow-x-hidden font-sans flex flex-col">
      
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[250px] bg-emerald-500/10 blur-[160px] pointer-events-none rounded-full" />

      {/* Top Navigation Bar - Slim & Clean (Identical to Python & Java) */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/course/fullstack-open')}
            className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/10 text-slate hover:text-paper font-mono text-xs transition-all cursor-pointer"
            title="Leave Course (Progress saved)"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Overview</span>
          </button>

          
        </div>

        <div className="flex items-center gap-2">
          {/* Consecutive failure indicator */}
          {hasPurchased && consecutiveFailures > 0 && (
            <span className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[11px] border ${
              consecutiveFailures >= 3
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 font-bold'
                : 'bg-amber-400/10 border-amber-400/30 text-amber-300'
            }`}>
              <AlertTriangle className="w-3 h-3" />
              <span>Consecutive Failures: {consecutiveFailures}</span>
            </span>
          )}

                    {/* Live Points Counter Pill with smooth spring pop and floating +1 particle */}
          <div className="relative">
            <Link
              to="/settings"
              className={`relative flex items-center gap-1.5 py-1 px-2.5 rounded-full border text-paper font-mono text-xs transition-all duration-300 cursor-pointer shadow-sm ${
                pointAwardAnim
                  ? 'bg-amber-400/25 border-amber-400/60 shadow-amber-400/30 scale-105'
                  : 'bg-amber-400/10 hover:bg-amber-400/20 border-amber-400/30 shadow-amber-400/15'
              }`}
              id="navbar-reward-pill" title="Course Points"
            >
              <motion.div
                animate={pointAwardAnim ? { scale: [1, 1.35, 1], rotate: [0, -14, 14, 0] } : {}}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400 fill-amber-400/25" />
              </motion.div>

              <span className="hidden sm:inline text-amber-300/80 text-[11px] font-bold">Reward</span>

              <div className="overflow-hidden inline-flex items-center h-4 font-extrabold text-amber-300 font-mono">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={points}
                    initial={{ y: -16, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 16, opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                    className="inline-block"
                  >
                    {points}
                  </motion.span>
                </AnimatePresence>
              </div>

              <span className="text-slate/60 text-[10px]">pts</span>
            </Link>

            
          </div>

          

          

          {/* [DEV_TEST_CERTIFICATE_WORKFLOW] Temporary testing shortcut: Jump directly to Part 13 Last Question */}
          <button
            type="button"
            onClick={() => {
              sessionStorage.setItem('dopilot_dev_test_cert_mode', 'true');
              localStorage.setItem('dopilot_fullstack_part13_jump_to_last_q', 'true');
              navigate('/course/fullstack-open/part-13');
            }}
            className="py-1 px-2.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-mono text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
            title="[Dev Test] Jump to Part 13 Last Question to test certificate generation"
          >
            <span>⚡ Test Certificate</span>
          </button>

          <button
            type="button"
            onClick={() => setHelpModalOpen(true)}
            className="py-1 px-3.5 rounded-full bg-primary text-ink font-jakarta text-xs font-extrabold hover:bg-white transition-all cursor-pointer shadow-sm shadow-primary/20 flex items-center gap-1.5"
          >
            <span>Need Help</span>
          </button>
        </div>
      </header>

      {/* Main Focus Arena (Centered, Identical Layout to Python & Java) */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 relative z-10 my-auto">
        
        {/* SCENARIO 1: Entire Part 1 Course Completed */}
        {isCourseComplete ? (() => {
          const overall = getPart1OverallScore('fullstack-open', studentId);
          
          if (!hasPurchased) {
            // FREE TRIAL USER:
            return overall.isAbove50 ? (
              /* Free-trial pass: Show "Passed" and "Buy Course" option */
              <div className="bg-panel/95 border border-white/10 rounded-3xl p-6 sm:p-10 max-w-2xl w-full text-center space-y-6 shadow-2xl my-6 backdrop-blur-xl animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-primary to-emerald-400" />

                <div className="flex items-center justify-center pt-2">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider border bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Passed</span>
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="font-jakarta text-2xl sm:text-3xl font-black text-paper tracking-tight">
                    Part 1 Passed! 🎉
                  </h2>
                  <p className="text-slate text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                    Congratulations! You scored {overall.percentage}% ({overall.totalCorrect}/{overall.totalQuestions} correct) and passed all sections of Part 1. Buy the course to continue to Part 2.
                  </p>
                </div>

                {/* Scorecard */}
                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto py-2">
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-[11px] font-mono text-slate">Overall Score</div>
                    <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{overall.percentage}%</div>
                  </div>
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-[11px] font-mono text-slate">Questions</div>
                    <div className="text-xl font-bold font-mono text-paper mt-0.5">{overall.totalCorrect}/{overall.totalQuestions}</div>
                  </div>
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-[11px] font-mono text-slate">Status</div>
                    <div className="text-xs font-bold font-mono text-emerald-400 mt-1.5">Passed</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setPurchaseModalOpen(true)}
                    className="py-2.5 px-6 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all flex items-center gap-2 shadow-lg shadow-primary/25 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Buy Course</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/course/fullstack-open')}
                    className="py-2.5 px-5 rounded-xl bg-white/[0.06] hover:bg-white/15 border border-white/15 text-paper font-jakarta font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Back to Overview</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Free-trial fail: Show "Failed" and "Buy Course" option */
              <div className="bg-panel/95 border border-white/10 rounded-3xl p-6 sm:p-10 max-w-2xl w-full text-center space-y-6 shadow-2xl my-6 backdrop-blur-xl animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-400" />

                <div className="flex items-center justify-center pt-2">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider border bg-rose-500/15 border-rose-500/40 text-rose-300 shadow-rose-500/20">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>Failed</span>
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="font-jakarta text-2xl sm:text-3xl font-black text-paper tracking-tight">
                    Part 1 Failed
                  </h2>
                  <p className="text-slate text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                    You scored {overall.percentage}% ({overall.totalCorrect}/{overall.totalQuestions} correct) across sections 1.1 to 1.6. Buy the course to continue.
                  </p>
                </div>

                {/* Scorecard */}
                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto py-2">
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-[11px] font-mono text-slate">Overall Score</div>
                    <div className="text-xl font-bold font-mono text-rose-400 mt-0.5">{overall.percentage}%</div>
                  </div>
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-[11px] font-mono text-slate">Questions</div>
                    <div className="text-xl font-bold font-mono text-paper mt-0.5">{overall.totalCorrect}/{overall.totalQuestions}</div>
                  </div>
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-[11px] font-mono text-slate">Status</div>
                    <div className="text-xs font-bold font-mono text-rose-400 mt-1.5">Failed</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setPurchaseModalOpen(true)}
                    className="py-2.5 px-6 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all flex items-center gap-2 shadow-lg shadow-primary/25 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Buy Course</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/course/fullstack-open')}
                    className="py-2.5 px-5 rounded-xl bg-white/[0.06] hover:bg-white/15 border border-white/15 text-paper font-jakarta font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Back to Overview</span>
                  </button>
                </div>
              </div>
            );
          } else {
            // PURCHASED USER:
            const hasUsedRetry = hasUsedPart1Restart('fullstack-open', studentId);
            return (overall.isAbove50 || hasUsedRetry || overall.allSectionsPassed) ? (
              /* Passed free trial OR overall score >= 50%: continue directly to Part 2 */
              <div className="bg-panel/95 border border-white/10 rounded-3xl p-6 sm:p-10 max-w-2xl w-full text-center space-y-6 shadow-2xl my-6 backdrop-blur-xl animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-primary to-emerald-400" />

                <div className="flex items-center justify-center pt-2">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider border bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Passed • Part 1 Complete</span>
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="font-jakarta text-2xl sm:text-3xl font-black text-paper tracking-tight">
                    Part 1 Complete! 🎉
                  </h2>
                  <p className="text-slate text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                    You scored {overall.percentage}% ({overall.totalCorrect}/{overall.totalQuestions} correct) across sections 1.1 to 1.6 and earned {points} course points! Continue to Part 2 to proceed.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={handleContinueToPart2}
                    className="py-2.5 px-6 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all flex items-center gap-2 shadow-lg shadow-primary/25 cursor-pointer"
                  >
                    <span>Continue to Part 2: Communicating with Server</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/course/fullstack-open')}
                    className="py-2.5 px-5 rounded-xl bg-white/[0.06] hover:bg-white/15 border border-white/15 text-paper font-jakarta font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Back to Overview</span>
                  </button>
                </div>
              </div>
            ) : (
              /* After purchase following a failed trial with < 50%: provide option to retry Part 1 before continuing */
              <div className="bg-panel/95 border border-white/10 rounded-3xl p-6 sm:p-10 max-w-2xl w-full text-center space-y-6 shadow-2xl my-6 backdrop-blur-xl animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-primary to-amber-400" />

                <div className="flex items-center justify-center pt-2">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider border bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-amber-500/20">
                    <RotateCcw className="w-4 h-4 text-amber-400" />
                    <span>Option to Retry Part 1</span>
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="font-jakarta text-2xl sm:text-3xl font-black text-paper tracking-tight">
                    Course Unlocked
                  </h2>
                  <p className="text-slate text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                    Your overall score was {overall.percentage}% ({overall.totalCorrect}/{overall.totalQuestions} correct), which is below 50%. You can retry Part 1 with fresh questions under purchased course rules before continuing, or proceed directly to Part 2.
                  </p>
                </div>

                {/* Scorecard */}
                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto py-2">
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-[11px] font-mono text-slate">Overall Score</div>
                    <div className="text-xl font-bold font-mono text-rose-400 mt-0.5">{overall.percentage}%</div>
                  </div>
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-[11px] font-mono text-slate">Questions</div>
                    <div className="text-xl font-bold font-mono text-paper mt-0.5">{overall.totalCorrect}/{overall.totalQuestions}</div>
                  </div>
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-[11px] font-mono text-slate">Choice</div>
                    <div className="text-xs font-bold font-mono text-amber-400 mt-1.5">Retry or Continue</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={handleRetryPart1}
                    className="py-2.5 px-6 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all flex items-center gap-2 shadow-lg shadow-primary/25 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retry Part 1</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleContinueToPart2}
                    className="py-2.5 px-6 rounded-xl bg-white/[0.08] hover:bg-white/15 border border-white/20 text-paper font-jakarta font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Continue to Part 2</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/course/fullstack-open')}
                    className="py-2.5 px-5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-slate hover:text-paper font-jakarta font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Back to Overview</span>
                  </button>
                </div>
              </div>
            );
          }
        })() : levelResult?.isFinished ? (
          !hasPurchased ? (
            /* SCENARIO 2A: Clean, Minimal Free-Trial Pass & Fail Page */
            <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-lg w-full text-center space-y-5 shadow-2xl my-6 backdrop-blur-xl animate-fade-in relative">
              <div className="flex items-center justify-center">
                {levelResult.isPassed ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs font-semibold border bg-emerald-500/10 border-emerald-500/30 text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Exam Passed</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs font-semibold border bg-rose-500/10 border-rose-500/30 text-rose-300">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Exam Result</span>
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <h2 className="font-jakarta text-2xl font-bold text-paper tracking-tight">
                  {levelResult.isPassed ? 'Exam Passed' : 'Exam Not Passed'}
                </h2>
                <p className="text-slate text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                  {levelResult.isPassed
                    ? `You scored ${levelResult.percentage}%, successfully meeting the passing benchmark of more than 80%.`
                    : `You scored ${levelResult.percentage}%. The passing benchmark is more than 80%. You can proceed directly to the next level in your free trial.`}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 max-w-xs mx-auto">
                <div className={`p-3.5 rounded-xl border flex flex-col items-center justify-center ${
                  levelResult.isPassed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/[0.03] border-white/10'
                }`}>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate/70">Score</span>
                  <span className={`font-mono text-2xl sm:text-3xl font-bold mt-0.5 ${
                    levelResult.isPassed ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {levelResult.percentage}%
                  </span>
                  <span className="text-[10px] font-mono text-slate/50 mt-0.5">Passing: &gt; 80%</span>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate/70">Correct</span>
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-paper mt-0.5">
                    {levelResult.correctCount} <span className="text-slate/50 text-base font-normal">/ {levelResult.totalCount}</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate/50 mt-0.5">Questions</span>
                </div>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={handleProceedToNextLevel}
                  className="py-2.5 px-8 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer"
                >
                  <span>Continue to Next Level</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* SCENARIO 2B: Clean, Professional Exam Result for Purchased Students */
            <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-xl w-full text-center space-y-6 shadow-2xl my-6 backdrop-blur-xl animate-fade-in relative overflow-hidden">
              <div className={`absolute top-0 left-0 right-0 h-1 ${
                levelResult.isPassed
                  ? 'bg-emerald-500'
                  : levelResult.isLocked
                  ? 'bg-rose-500'
                  : levelResult.isSecondFailureInLevel
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`} />

              {/* Status Badge */}
              <div className="flex items-center justify-center pt-1">
                {levelResult.isPassed ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs font-semibold border bg-emerald-500/10 border-emerald-500/30 text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Level {activeSection.number} Passed</span>
                  </span>
                ) : levelResult.isLocked ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs font-semibold border bg-rose-500/15 border-rose-500/35 text-rose-300">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    <span>Progression Locked</span>
                  </span>
                ) : levelResult.isSecondFailureInLevel ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs font-semibold border bg-amber-500/15 border-amber-500/35 text-amber-300">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Second Failure Warning</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs font-semibold border bg-rose-500/10 border-rose-500/30 text-rose-300">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Exam Failed • Attempt 1 of 2</span>
                  </span>
                )}
              </div>

              {/* Headline & Narrative */}
              <div className="space-y-1.5">
                <h2 className="font-jakarta text-2xl font-bold text-paper tracking-tight">
                  {levelResult.isPassed
                    ? `Level ${activeSection.number} Passed`
                    : levelResult.isLocked
                    ? 'Course Progression Locked'
                    : levelResult.isSecondFailureInLevel
                    ? `Level ${activeSection.number} Failed Twice`
                    : 'Exam Failed'}
                </h2>
                <p className="text-slate text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                  {levelResult.isPassed
                    ? `Congratulations! You scored ${levelResult.percentage}%, successfully meeting the passing requirement of more than 80%. Your consecutive failure streak has reset to 0.`
                    : levelResult.isLocked
                    ? 'You have reached 3 consecutive failed levels. Progression is locked. Please reach out to our team to review concepts and unlock further levels.'
                    : levelResult.isSecondFailureInLevel
                    ? levelResult.streak === 1
                      ? `You have failed Level ${activeSection.number} twice. You have 2 more warnings remaining before course progression is locked.`
                      : `Warning: You failed Level ${activeSection.number} twice. Only 1 more warning remaining before course progression is locked.`
                    : 'Your score was below 80%. Click "Reset Level & Load New Questions" to retry with fresh questions.'}
                </p>
              </div>

              {/* Scorecard Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 max-w-lg mx-auto">
                <div className={`p-3.5 rounded-xl border flex flex-col items-center justify-center ${
                  levelResult.isPassed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/[0.03] border-white/10'
                }`}>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate/70">Score</span>
                  <span className={`font-mono text-2xl sm:text-3xl font-bold mt-0.5 ${
                    levelResult.isPassed ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {levelResult.percentage}%
                  </span>
                  <span className="text-[10px] font-mono text-slate/50 mt-0.5">Passing: &gt; 80%</span>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate/70">Correct</span>
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-paper mt-0.5">
                    {levelResult.correctCount} <span className="text-slate/50 text-base font-normal">/ {levelResult.totalCount}</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate/50 mt-0.5">Questions</span>
                </div>

                <div className={`p-3.5 rounded-xl border flex flex-col items-center justify-center ${
                  levelResult.isPassed
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : levelResult.isLocked
                    ? 'bg-rose-500/10 border-rose-500/25'
                    : 'bg-white/[0.03] border-white/10'
                }`}>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate/70">Failure Streak</span>
                  <span className={`font-mono text-2xl sm:text-3xl font-bold mt-0.5 ${
                    levelResult.isPassed ? 'text-emerald-400' : levelResult.isLocked ? 'text-rose-400' : 'text-amber-400'
                  }`}>
                    {levelResult.isPassed ? '0' : levelResult.streak}
                  </span>
                  <span className="text-[10px] font-mono text-slate/50 mt-0.5">
                    {levelResult.isPassed ? 'Streak reset to 0' : `${levelResult.streak} of 3 before locked`}
                  </span>
                </div>
              </div>

              {/* Action Buttons Configured per exact prompt rules */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {levelResult.isPassed ? (
                  <button
                    type="button"
                    onClick={handleProceedToNextLevel}
                    className="py-2.5 px-6 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all flex items-center gap-2 shadow-lg shadow-primary/25 cursor-pointer"
                  >
                    <span>Continue to Next Level</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : levelResult.isLocked ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setHelpModalOpen(true)}
                      className="py-2.5 px-5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-jakarta font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>Contact Advisor to Unlock</span>
                    </button>
                  </>
                ) : levelResult.isSecondFailureInLevel ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setDisclaimerModalOpen(true)}
                      className="py-2.5 px-5 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-primary/20 cursor-pointer"
                    >
                      <span>Continue to Next Level</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={handleResetQuestions}
                      className="py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/15 border border-white/10 text-paper font-jakarta font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Shuffle className="w-3.5 h-3.5" />
                      <span>Retest Level with Fresh Questions</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setHelpModalOpen(true)}
                      className="py-2.5 px-4 rounded-xl bg-white/[0.02] hover:bg-white/10 text-slate hover:text-paper font-mono text-xs transition-all cursor-pointer"
                    >
                      <span>Contact Team Now</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleResetQuestions}
                    className="py-2.5 px-6 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all flex items-center gap-2 shadow-lg shadow-primary/25 cursor-pointer"
                  >
                    <Shuffle className="w-4 h-4" />
                    <span>Reset Level &amp; Load New Questions</span>
                  </button>
                )}
              </div>
            </div>
        )
      ) : (
          /* SCENARIO 3: Active Question View (Exact Python Part 1 Layout) */
          <div className="w-full my-auto space-y-3">
            <div className="bg-panel/90 border border-white/10 rounded-2xl p-4 sm:p-6 space-y-4 shadow-2xl relative w-full">
              
              {/* Card Header: Level progress, remaining items & compact timer */}
              <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-white/10">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="font-mono text-xs font-bold text-primary uppercase tracking-wide">
                    Level {activeSection.number} • Question {currentLevelQuestionNumber} of {totalLevelQuestions}
                  </span>

                  <span className="text-[11px] font-mono text-slate/70 bg-white/[0.04] border border-white/10 px-2.5 py-0.5 rounded-full">
                    {remainingLevelQuestions === 0 ? 'Final question in level' : `${remainingLevelQuestions} remaining`}
                  </span>
                </div>

                {/* Compact Timer Pill & Points */}
                <div className="flex items-center gap-2 shrink-0">
                  {isStudyPhase && !isLocked ? (
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-primary">
                      <Clock className="w-3.5 h-3.5" />
                      <span>30s Ready</span>
                    </div>
                  ) : isUserWrongAnswer ? (
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-rose-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Review Answer</span>
                    </div>
                  ) : correctCountdown !== null ? (
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Next in {correctCountdown}s</span>
                    </div>
                  ) : (
                    <div className={`flex items-center gap-1.5 font-mono text-xs font-bold transition-all ${
                      timeLeft <= 10
                        ? 'text-rose-400 animate-pulse'
                        : 'text-amber-300'
                    }`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{timeLeft}s</span>
                    </div>
                  )}

                  <motion.span
                    animate={isSolved ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border transition-all duration-300 flex items-center gap-1.5 ${
                      isSolved
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(0,255,157,0.2)]'
                        : 'bg-white/[0.04] border-white/10 text-slate'
                    }`}
                  >
                    <span>1 Pt</span>
                    {isSolved && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        className="text-emerald-400 font-bold"
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.span>
                </div>
              </div>

              {/* 2-Column Content: Concept on Left, Question on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* Left Column: Concept Reference Note & Code (Minimal & Simple) */}
                <div className="lg:col-span-5 space-y-3 bg-black/40 border border-white/5 rounded-xl p-3.5 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase font-bold text-primary tracking-wider block">
                        Concept Reference
                      </span>
                      <h4 className="text-sm font-bold text-paper">
                        {currentBlock.heading}
                      </h4>
                      <p className="text-slate text-xs leading-relaxed">
                        {currentBlock.text}
                      </p>
                    </div>

                    {currentBlock.codeSnippet && (
                      <div className="rounded-lg border border-white/10 bg-black/80 overflow-hidden text-xs font-mono">
                        <div className="px-2.5 py-1 bg-white/[0.02] border-b border-white/5 flex items-center justify-between text-[10px] text-slate/50">
                          <span>App.jsx</span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(currentBlock.codeSnippet!, `code-${activeQuestionIdx}`)}
                            className="hover:text-paper cursor-pointer"
                          >
                            {copiedId === `code-${activeQuestionIdx}` ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <pre className="p-2 text-xs text-paper overflow-x-auto leading-relaxed max-h-28">
                          {currentBlock.codeSnippet}
                        </pre>
                        {currentBlock.terminalOutput && (
                          <div className="px-2.5 py-1 border-t border-white/5 bg-black text-[11px] text-primary flex items-center gap-1.5">
                            <span className="text-slate/60 text-[10px] uppercase font-bold">Output:</span>
                            <span className="truncate">{currentBlock.terminalOutput.replace(/\n/g, ' | ')}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Continue button below note to reveal question */}
                  {isStudyPhase && !isLocked && (
                    <div className="pt-2.5 border-t border-white/5">
                      <button
                        type="button"
                        onClick={handleStartQuestion}
                        className="w-full py-2 px-3.5 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all cursor-pointer shadow-md shadow-primary/20 flex items-center justify-center gap-2 group"
                      >
                        <span>Continue to Question</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Column: Question & Choices */}
                <div className="lg:col-span-7 space-y-3 relative overflow-hidden rounded-xl min-h-[300px]">
                  
                  {/* Study Phase Blur Overlay */}
                  {isStudyPhase && !isLocked && (
                    <div 
                      onClick={handleStartQuestion}
                      className="absolute inset-0 z-20 backdrop-blur-md bg-black/70 rounded-xl border border-white/10 flex flex-col items-center justify-center p-6 text-center animate-fade-in cursor-pointer select-none"
                    >
                      <h4 className="text-sm font-bold text-paper mb-1">
                        Question is Locked
                      </h4>
                      <p className="text-xs text-slate/80 max-w-xs leading-relaxed">
                        Read and understand the concept note on the left first. Click "Continue to Question" to unlock.
                      </p>
                    </div>
                  )}

                  {/* Question Content */}
                  <div className={`space-y-3 transition-all duration-300 ${
                    isStudyPhase && !isLocked ? 'filter blur-sm select-none pointer-events-none opacity-20' : ''
                  }`}>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase font-bold text-primary/80 tracking-wider block">
                        Multiple Choice Question
                      </span>
                      <h3 className="font-jakarta text-base sm:text-lg font-bold text-paper leading-snug">
                        {currentMcq.question}
                      </h3>
                    </div>

                    {/* 4 Choices */}
                    <div className="flex flex-col gap-2">
                      {currentMcq.options.map((opt) => {
                        const isSelected = currentChoice === opt.id;
                        const isCorrect = opt.id === currentMcq.correctAnswer;
                        const isChosenWrong = isSelected && !isCorrect;
                        const showAsCorrect = (isSelected && isCorrect) || (isLocked && isCorrect) || (isTimeUpWaiting && isCorrect) || (isUserWrongAnswer && isCorrect);

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            disabled={isLocked || isTimeUpWaiting}
                            onClick={() => handleSelectOption(taskId, currentBlock.heading, opt.id, isCorrect)}
                            className={`w-full text-left py-2 px-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center gap-2.5 ${
                              showAsCorrect
                                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 ring-1 ring-emerald-500/30 shadow-md'
                                : isChosenWrong
                                ? 'bg-rose-500/15 border-rose-500/40 text-rose-200 ring-1 ring-rose-500/30 shadow-md'
                                : isLocked || isTimeUpWaiting
                                ? 'bg-black/30 border-white/5 text-slate/40 cursor-default opacity-50'
                                : 'bg-black/50 border-white/10 hover:border-primary/50 hover:bg-white/[0.03] text-paper cursor-pointer'
                            }`}
                          >
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                              showAsCorrect
                                ? 'bg-emerald-500 text-ink font-bold'
                                : isChosenWrong
                                ? 'bg-rose-500 text-white'
                                : 'bg-white/10 text-slate'
                            }`}>
                              {showAsCorrect ? '✓' : isChosenWrong ? '✗' : opt.id}
                            </span>
                            <span className="font-sans leading-snug flex-1">
                              {opt.text}
                            </span>
                            {(isTimeUpWaiting || isUserWrongAnswer) && isCorrect && (
                              <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 rounded-full shrink-0">
                                Correct Answer
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Time is Up */}
                    {isTimeUpWaiting && (
                      <div className="space-y-2 pt-1 animate-fade-in">
                        <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/35 space-y-2.5 shadow-md">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                              <span className="text-xs text-amber-200 font-sans font-medium">
                                Time's up! You did not select an answer.
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setIsTimeUpWaiting(false);
                                try {
                                  localStorage.removeItem('dopilot_fullstack_part1_time_up');
                                } catch {}
                                advanceToNextQuestion();
                              }}
                              className="py-1.5 px-4 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all cursor-pointer shadow-md shadow-primary/20 shrink-0 flex items-center gap-1.5"
                            >
                              <span>Continue</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-200 text-xs leading-relaxed font-sans">
                            <strong className="text-emerald-400 font-bold">✓ Explanation: </strong>
                            {currentMcq.explanationNote}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Answered: Show feedback note & manual continue */}
                    {currentChoice && (
                      <div className="space-y-2 pt-1">
                        <div className={`p-2.5 rounded-xl border text-xs leading-relaxed ${
                          currentChoice === currentMcq.correctAnswer
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                        }`}>
                          <p className="font-sans text-xs">
                            {currentChoice === currentMcq.correctAnswer ? (
                              <span><strong className="text-emerald-400 font-bold">✓ Correct! </strong>{currentMcq.explanationNote}</span>
                            ) : (
                              (() => {
                                const chosen = currentMcq.options.find(o => o.id === currentChoice);
                                return (
                                  <span><strong className="text-rose-400 font-bold">✕ Not quite: </strong>{chosen?.explanationIfWrong || 'Incorrect choice.'} {currentMcq.explanationNote}</span>
                                );
                              })()
                            )}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] font-mono text-slate/50">
                            {isUserWrongAnswer
                              ? 'Review the explanation above, then click Continue:'
                              : correctCountdown !== null
                              ? `Next question in ${correctCountdown}s, or click Continue:`
                              : 'Click Continue to proceed:'}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setCorrectCountdown(null);
                              setIsTimeUpWaiting(false);
                              advanceToNextQuestion();
                            }}
                            className="py-1.5 px-4 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all cursor-pointer shadow-md shadow-primary/20 flex items-center gap-1.5"
                          >
                            <span>Continue</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

              </div>

            </div>

          </div>
        )}
      </main>

      {/* Second Failure Disclaimer Modal */}
      <AnimatePresence>
        {disclaimerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b0e14] border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-left space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-jakarta font-black text-lg text-paper">
                    Progression Policy Disclaimer
                  </h3>
                  <span className="font-mono text-xs text-amber-400">
                    Consecutive Failure Risk Warning
                  </span>
                </div>
              </div>

              <p className="text-slate text-xs sm:text-sm leading-relaxed">
                You have not met the &gt; 80% benchmark on Attempt 2 for Level {activeSection.number}. If you accumulate <strong className="text-rose-400">3 consecutive failed levels</strong>, your course progression will be paused until you consult with an advisor.
              </p>

              <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={disclaimerConfirmed}
                  onChange={(e) => setDisclaimerConfirmed(e.target.checked)}
                  className="mt-0.5 rounded border-white/20 text-primary focus:ring-primary cursor-pointer"
                />
                <span className="font-sans text-xs text-paper/90 select-none">
                  I understand that proceeding without retesting increases my consecutive failure streak, and 3 consecutive failures will lock my progress.
                </span>
              </label>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setDisclaimerModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/10 text-paper font-jakarta text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={!disclaimerConfirmed}
                  onClick={() => {
                    setDisclaimerModalOpen(false);
                    handleProceedToNextLevel();
                  }}
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-jakarta font-extrabold text-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Acknowledge &amp; Proceed
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Part 2 Teaser Modal */}
      <AnimatePresence>
        {part2ModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b0e14] border border-primary/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>

              <h3 className="font-jakarta font-black text-xl text-paper">
                Part 2: Communicating with Server
              </h3>

              <p className="text-slate text-xs sm:text-sm leading-relaxed">
                Congratulations on mastering Part 1: React Fundamentals! Part 2: Communicating with Server is coming up next in your curriculum.
              </p>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPart2ModalOpen(false);
                    if (hasPurchased) {
                      navigate('/course/fullstack-open/part-2');
                    } else {
                      setPurchaseModalOpen(true);
                    }
                  }}
                  className="px-6 py-2.5 rounded-full bg-primary text-ink font-jakarta font-black text-xs hover:bg-white transition-all cursor-pointer shadow-lg shadow-primary/25"
                >
                  {hasPurchased ? 'Launch Part 2: Server Communication' : 'Buy Course to Launch Part 2'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Web Sandbox Modal */}
      <FullstackWebModal
        isOpen={compilerModalOpen}
        onClose={() => setCompilerModalOpen(false)}
      />

      {/* Contact / Advisor Consultation Modal */}
      <NeedHelpModal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
        courseTitle="Full Stack Open Course"
        courseId="fullstack-open"
      />

      {/* Course Purchase & Coupon Modal */}
      {pricing && (
        <CoursePurchaseModal
          isOpen={purchaseModalOpen}
          onClose={() => setPurchaseModalOpen(false)}
          courseId="fullstack-open"
          courseTitle="Full Stack Open: Modern Web Development"
          pricing={pricing}
          onSuccess={handlePostPurchaseUnlock}
        />
      )}
    </div>
  );
};
