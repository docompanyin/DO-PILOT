import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, BookOpen, Clock, ArrowRight, Trophy, RotateCcw,
  CheckCircle2, AlertCircle, Shuffle, Sparkles, AlertTriangle, ShieldAlert
} from 'lucide-react';
import { FullstackCompilerLauncherButton, FullstackWebModal, FullstackTaskContext } from './compiler/FullstackWebModal';
import { useCoursePoints } from '../context/CoursePointsContext';
import { getSavedCertificate } from '../utils/certificateGenerator';
import { useUserAuth } from '../context/UserAuthContext';
import { ContactModal } from './ContactModal';
import { NeedHelpModal } from './NeedHelpModal';
import { 
  FULLSTACK_PART_12_SECTIONS, TheoryBlock, McqQuestion,
  getActiveQuestionsForLevelFullstackPart12, getConsecutiveFailedLevelsFullstackPart12,
  recordLevelAttemptResultFullstackPart12, resetConsecutiveFailuresFullstackPart12,
  setLevelAttemptCountFullstackPart12
} from '../data/fullstackPart12Data';
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

export const FullstackPart12Page: React.FC = () => {
  const navigate = useNavigate();
  const { points, isTaskSolved, awardPoint, recordWrongAttempt, resetProgress } = useCoursePoints();
  const { user } = useUserAuth();

  const studentId = user?.id || user?.email || 'default_student';
  const [searchParams] = useSearchParams();
  const isReviewMode = searchParams.get('review') === 'true' && Boolean(getSavedCertificate('fullstack-open'));

  // Persistent Active Section ID (Defaults to Section 12.1)
  const [activeSectionId, setActiveSectionId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('dopilot_fullstack_part12_active_section_id');
      return saved || '12-1-containers-and-docker-basics';
    } catch {
      return '12-1-containers-and-docker-basics';
    }
  });

  // Persistent Question Index
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('dopilot_fullstack_part12_active_q_idx');
      return saved !== null ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  const activeSection = FULLSTACK_PART_12_SECTIONS.find(s => s.id === activeSectionId) || FULLSTACK_PART_12_SECTIONS[0];
  const activeIdx = FULLSTACK_PART_12_SECTIONS.findIndex(s => s.id === activeSection.id);

  // Active question set for current level with question duplicate prevention
  const [levelQuestions, setLevelQuestions] = useState<McqQuestion[]>(() => {
    return getActiveQuestionsForLevelFullstackPart12(activeSection, studentId, false);
  });

  // Track level failure / pass outcome state
  const [levelResult, setLevelResult] = useState<LevelResultState | null>(() => {
    try {
      const saved = localStorage.getItem('dopilot_fullstack_part12_level_result');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Consecutive failure counter (loaded dynamically from student record)
  const [consecutiveFailures, setConsecutiveFailures] = useState<number>(() => {
    return getConsecutiveFailedLevelsFullstackPart12(studentId);
  });

  // Disclaimer popup state when choosing "Continue to Next Set" on 2nd consecutive failure
  const [disclaimerModalOpen, setDisclaimerModalOpen] = useState(false);
  const [disclaimerConfirmed, setDisclaimerConfirmed] = useState(false);

  // Persistent MCQ selected answers
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('dopilot_fullstack_part12_mcq_answers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Update questions whenever active level changes
  const prevSectionIdRef = useRef(activeSectionId);
  useEffect(() => {
    const qList = getActiveQuestionsForLevelFullstackPart12(activeSection, studentId, false);
    setLevelQuestions(qList);
    if (prevSectionIdRef.current !== activeSectionId) {
      prevSectionIdRef.current = activeSectionId;
      setLevelResult(null);
      try {
        localStorage.removeItem('dopilot_fullstack_part12_level_result');
      } catch {}
    }
  }, [activeSectionId, studentId]);

  const currentBlock: TheoryBlock = activeSection.theoryBlocks[activeQuestionIdx] || activeSection.theoryBlocks[0];
  const currentMcq: McqQuestion = levelQuestions[activeQuestionIdx] || currentBlock.mcq!;
  const taskId = `fullstack-12-${activeSection.id}-${currentMcq.id || activeQuestionIdx}`;

  // Whether user is currently in Study Phase (reading note with no timer pressure) or Question Phase (30s timer)
  const [isStudyPhase, setIsStudyPhase] = useState<boolean>(() => {
    if (isReviewMode) return false;
    try {
      const answers = JSON.parse(localStorage.getItem('dopilot_fullstack_part12_mcq_answers') || '{}');
      if (answers[taskId]) return false; // Already answered
      const savedPhase = localStorage.getItem('dopilot_fullstack_part12_study_phase');
      if (savedPhase !== null) return savedPhase === 'true';
    } catch {}
    return true; // Read note first by default
  });

  // Target End Timestamp for the 30-second question timer
  const [targetEndTime, setTargetEndTime] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('dopilot_fullstack_part12_q_target_end_time');
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
      if (levelResult?.isFinished) return false;
      if (localStorage.getItem('dopilot_fullstack_part12_time_up') === 'true') return true;
      const savedPhase = localStorage.getItem('dopilot_fullstack_part12_study_phase');
      if (savedPhase === 'true') return false;
      const savedEnd = Number(localStorage.getItem('dopilot_fullstack_part12_q_target_end_time'));
      const answers = JSON.parse(localStorage.getItem('dopilot_fullstack_part12_mcq_answers') || '{}');
      if (savedEnd && savedEnd <= Date.now() && !answers[taskId]) {
        return true;
      }
    } catch {}
    return false;
  });

  const [isCourseComplete, setIsCourseComplete] = useState<boolean>(() => {
    try {
      return localStorage.getItem('dopilot_fullstack_part12_completed') === 'true';
    } catch {
      return false;
    }
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [part13ModalOpen, setPart13ModalOpen] = useState(false);
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
      localStorage.setItem('dopilot_fullstack_core_last_part', '12');
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

  // Action to start the 30s question countdown timer
  const handleStartQuestion = () => {
    setIsStudyPhase(false);
    setIsTimeUpWaiting(false);
    const freshEnd = Date.now() + TIMER_DURATION * 1000;
    setTargetEndTime(freshEnd);
    setTimeLeft(TIMER_DURATION);
    try {
      localStorage.setItem('dopilot_fullstack_part12_study_phase', 'false');
      localStorage.setItem('dopilot_fullstack_part12_q_target_end_time', String(freshEnd));
      localStorage.removeItem('dopilot_fullstack_part12_time_up');
      localStorage.removeItem('dopilot_fullstack_part12_level_result');
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
      const qTaskId = `fullstack-12-${secId}-${q.id || idx}`;
      const chosen = currentAnswers[qTaskId];
      if (chosen === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const percentage = Math.round((correctCount / totalCount) * 100);
    const isPassed = percentage > 80;

    const outcome = recordLevelAttemptResultFullstackPart12(secId, studentId, isPassed);

    const resultState = {
      isFinished: true,
      isPassed,
      correctCount,
      totalCount,
      percentage,
      streak: outcome.consecutiveFailedLevels,
      attemptCount: outcome.attemptCount,
      isSecondFailureInLevel: outcome.isSecondFailureInLevel,
      isLocked: outcome.isLocked
    };
    setLevelResult(resultState);
    try {
      localStorage.setItem('dopilot_fullstack_part12_level_result', JSON.stringify(resultState));
    } catch {}

    setConsecutiveFailures(outcome.consecutiveFailedLevels);

    if (outcome.isLocked) {
      setModalOpen(true);
    }
  };

  // Advance function to go to next question or complete level
  const advanceToNextQuestion = () => {
    setCorrectCountdown(null);
    setIsTimeUpWaiting(false);
    setIsStudyPhase(true);
    try {
      localStorage.setItem('dopilot_fullstack_part12_study_phase', 'true');
    } catch {}

    const { activeQuestionIdx: qIdx, levelQuestions: qList } = stateRef.current;
    const nextQ = qIdx + 1;

    if (isReviewMode) {
      if (nextQ < qList.length) {
        setActiveQuestionIdx(nextQ);
        setIsStudyPhase(false);
        return;
      } else {
        const nextSecIdx = activeIdx + 1;
        if (nextSecIdx < FULLSTACK_PART_12_SECTIONS.length) {
          const nextSec = FULLSTACK_PART_12_SECTIONS[nextSecIdx];
          setActiveSectionId(nextSec.id);
          setActiveQuestionIdx(0);
          setIsStudyPhase(false);
          setLevelResult(null);
          return;
        } else {
          navigate('/course/fullstack-open/part-13?review=true');
          return;
        }
      }
    }


    if (nextQ < qList.length) {
      setActiveQuestionIdx(nextQ);
      setTimeLeft(TIMER_DURATION);
      try {
        localStorage.setItem('dopilot_fullstack_part12_active_q_idx', String(nextQ));
      } catch (e) {
        console.error(e);
      }
    } else {
      evaluateLevelScore();
    }
  };

  // Reset Questions for Current Level (loads alternative distinct questions for same concepts)
  const handleResetQuestions = () => {
    const newQuestions = getActiveQuestionsForLevelFullstackPart12(activeSection, studentId, true);
    setLevelQuestions(newQuestions);

    const updatedAnswers = { ...selectedAnswers };
    newQuestions.forEach((q, idx) => {
      const oldTaskId = `fullstack-12-${activeSection.id}-${q.id || idx}`;
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
      localStorage.setItem('dopilot_fullstack_part12_mcq_answers', JSON.stringify(updatedAnswers));
      localStorage.setItem('dopilot_fullstack_part12_active_q_idx', '0');
      localStorage.setItem('dopilot_fullstack_part12_study_phase', 'true');
      localStorage.setItem('dopilot_fullstack_part12_q_target_end_time', String(fresh));
      localStorage.removeItem('dopilot_fullstack_part12_time_up');
      localStorage.removeItem('dopilot_fullstack_part12_level_result');
    } catch (e) {
      console.error(e);
    }
  };

  // Proceed to Next Level
  const handleProceedToNextLevel = () => {
    const nextIdx = activeIdx + 1;
    if (nextIdx < FULLSTACK_PART_12_SECTIONS.length) {
      const nextSec = FULLSTACK_PART_12_SECTIONS[nextIdx];
      setActiveSectionId(nextSec.id);
      setActiveQuestionIdx(0);
      setLevelResult(null);
      setIsStudyPhase(true);
      setIsTimeUpWaiting(false);
      setTimeLeft(TIMER_DURATION);
      const fresh = Date.now() + TIMER_DURATION * 1000;
      setTargetEndTime(fresh);

      try {
        localStorage.setItem('dopilot_fullstack_part12_active_section_id', nextSec.id);
        localStorage.setItem('dopilot_fullstack_part12_active_q_idx', '0');
        localStorage.setItem('dopilot_fullstack_part12_study_phase', 'true');
        localStorage.setItem('dopilot_fullstack_part12_q_target_end_time', String(fresh));
        localStorage.removeItem('dopilot_fullstack_part12_time_up');
      localStorage.removeItem('dopilot_fullstack_part12_level_result');
      } catch (e) {
        console.error(e);
      }
    } else {
      setIsCourseComplete(true);
      playTwinkleSound();
      try {
        localStorage.setItem('dopilot_fullstack_part12_completed', 'true');
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
    if (isReviewMode || isCourseComplete || isStudyPhase || levelResult?.isFinished) return;

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
            localStorage.setItem('dopilot_fullstack_part12_time_up', 'true');
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
    if (isReviewMode || selectedAnswers[tId] || isTaskSolved(tId) || isTimeUpWaiting || isStudyPhase || levelResult?.isFinished) {
      return;
    }
    const updated = { ...selectedAnswers, [tId]: optId };
    setSelectedAnswers(updated);
    try {
      localStorage.setItem('dopilot_fullstack_part12_mcq_answers', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    if (isCorrect) {
      const isRetestAttempt = (() => {
        try {
          const raw = localStorage.getItem(`dopilot_fullstack_p12_attempt_${studentId}_${activeSection.id}`);
          return raw ? Number(raw) > 1 : false;
        } catch {
          return false;
        }
      })();
      if (!isRetestAttempt) {
        awardPoint(tId, heading, optId);
      }
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

  // Reset entire Part 12 progress completely
  const handleResetAll = () => {
    if (!window.confirm("Reset all your Part 12 Full Stack Open progress and begin from Level 12.1?")) {
      return;
    }
    resetProgress();
    resetConsecutiveFailuresFullstackPart12(studentId);
    setConsecutiveFailures(0);
    setActiveSectionId(FULLSTACK_PART_12_SECTIONS[0].id);
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
      localStorage.removeItem('dopilot_fullstack_part12_mcq_answers');
      localStorage.removeItem('dopilot_fullstack_part12_active_section_id');
      localStorage.removeItem('dopilot_fullstack_part12_active_q_idx');
      localStorage.removeItem('dopilot_fullstack_part12_study_phase');
      localStorage.removeItem('dopilot_fullstack_part12_q_target_end_time');
      localStorage.removeItem('dopilot_fullstack_part12_time_up');
      localStorage.removeItem('dopilot_fullstack_part12_level_result');
      localStorage.removeItem('dopilot_fullstack_part12_completed');
    } catch {}

    for (const sec of FULLSTACK_PART_12_SECTIONS) {
      setLevelAttemptCountFullstackPart12(sec.id, studentId, 0);
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

      {/* Top Navigation Bar - Slim & Clean */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/course/fullstack-open')}
            className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/10 text-white hover:text-white font-mono text-xs transition-all cursor-pointer"
            title="Leave Course (Progress saved)"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Overview</span>
          </button>
          {isReviewMode && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 font-mono text-xs font-bold shadow-sm shadow-emerald-500/20">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Review Mode (Read Only)</span>
            </span>
          )}

          
        </div>

        <div className="flex items-center gap-2">
          {/* Consecutive failure indicator */}
          {consecutiveFailures > 0 && (
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

              <span className="text-white text-[10px]">pts</span>
            </Link>

            
          </div>

          

          

          <button
            type="button"
            onClick={() => setHelpModalOpen(true)}
            className="py-1 px-3.5 rounded-full bg-primary text-ink font-jakarta text-xs font-extrabold hover:bg-white transition-all cursor-pointer shadow-sm shadow-primary/20 flex items-center gap-1.5"
          >
            <span>Need Help</span>
          </button>
        </div>
      </header>

      {/* Main Focus Arena */}
      <main className={`flex-1 flex flex-col items-center justify-center ${!isCourseComplete && !levelResult?.isFinished ? 'max-w-7xl' : 'max-w-5xl'} w-full mx-auto px-4 sm:px-6 py-6 relative z-10 my-auto transition-all`}>
        
        {/* SCENARIO 1: Course Complete */}
        {isCourseComplete ? (
          <div className="bg-panel/95 border border-white/10 rounded-3xl p-6 sm:p-10 max-w-2xl w-full mx-auto text-center space-y-6 shadow-2xl my-auto backdrop-blur-xl animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-primary to-emerald-400" />

            <div className="flex items-center justify-center pt-2">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider border bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Part 12 Fully Certified</span>
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="font-jakarta text-2xl sm:text-3xl font-black text-paper tracking-tight">
                Part 12 Complete! 🎉
              </h2>
              <p className="text-slate text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                You have mastered all 6 foundational levels of University of Helsinki Full Stack Open Part 12: Containers, Dockerfiles, Multi-Stage Builds, Volumes &amp; Persistence, Docker Compose, and Nginx Reverse Proxying. You scored &gt; 80% across all sections and earned {points} course points!
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setPart13ModalOpen(true)}
                className="py-2.5 px-6 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all flex items-center gap-2 shadow-lg shadow-primary/25 cursor-pointer"
              >
                <span>Continue to Part 13: Relational Databases</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/course/fullstack-open')}
                className="py-2.5 px-5 rounded-xl bg-white/[0.06] hover:bg-white/15 border border-white/15 text-paper font-jakarta font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Back to Curriculum</span>
              </button>
            </div>
          </div>
        ) : levelResult?.isFinished ? (
          /* SCENARIO 2: Level Evaluation Result */
          <div className="bg-panel/95 border border-white/10 rounded-3xl p-6 sm:p-10 max-w-2xl w-full mx-auto text-center space-y-6 shadow-2xl my-6 backdrop-blur-xl animate-fade-in relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${
              levelResult.isPassed
                ? 'bg-gradient-to-r from-emerald-500 via-primary to-emerald-400'
                : levelResult.isLocked
                ? 'bg-gradient-to-r from-rose-600 via-red-500 to-rose-600'
                : levelResult.isSecondFailureInLevel
                ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-amber-400'
                : 'bg-gradient-to-r from-rose-500 via-amber-500 to-rose-400'
            }`} />

            {/* Status Pill Badge */}
            <div className="flex items-center justify-center pt-2">
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider border ${
                levelResult.isPassed
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : levelResult.isLocked
                  ? 'bg-rose-500/20 border-rose-500/60 text-rose-300'
                  : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
              }`}>
                {levelResult.isPassed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Level {activeSection.number} Passed ({levelResult.percentage}%)</span>
                  </>
                ) : levelResult.isLocked ? (
                  <>
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>Progression Temporarily Locked</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>Level {activeSection.number} Needs Retest ({levelResult.percentage}%)</span>
                  </>
                )}
              </span>
            </div>

            {/* Score & Evaluation Narrative */}
            <div className="space-y-2">
              <h2 className="font-jakarta text-2xl sm:text-3xl font-black text-paper tracking-tight">
                {levelResult.isPassed
                  ? "Great Job! You've Mastered This Level"
                  : levelResult.isLocked
                  ? "3 Consecutive Level Failures Reached"
                  : levelResult.isSecondFailureInLevel
                  ? "Second Attempt Did Not Meet 80% Benchmark"
                  : "First Attempt Did Not Meet 80% Benchmark"}
              </h2>

              <p className="text-slate text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                {levelResult.isPassed ? (
                  `You answered ${levelResult.correctCount} out of ${levelResult.totalCount} questions correctly (${levelResult.percentage}%). You are ready to advance to the next level!`
                ) : levelResult.isLocked ? (
                  `You have reached 3 consecutive failed levels. To ensure thorough mastery, curriculum progression is locked. Please consult our course advisors or reset your practice.`
                ) : levelResult.isSecondFailureInLevel ? (
                  `You scored ${levelResult.percentage}% (${levelResult.correctCount}/${levelResult.totalCount}). Proceeding to the next level will count as 1 consecutive level failure (3 will lock progression). Or you can Retest Now with alternate questions.`
                ) : (
                  `You scored ${levelResult.percentage}% (${levelResult.correctCount}/${levelResult.totalCount}). A minimum of 80% (5/6 correct) is required. Take the retest now with alternative questions!`
                )}
              </p>
            </div>

            {/* Action Buttons depending on pass/fail */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
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
                    onClick={() => setModalOpen(true)}
                    className="py-2.5 px-6 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-jakarta font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-500/25"
                  >
                    <span>Consult Advisor to Unlock</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetQuestions}
                    className="py-2.5 px-5 rounded-xl bg-white/[0.06] hover:bg-white/15 border border-white/15 text-paper font-jakarta font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Practice Level Again</span>
                  </button>
                </>
              ) : (
                <>
                  {/* RETEST BUTTON */}
                  <button
                    type="button"
                    onClick={handleResetQuestions}
                    className="py-2.5 px-6 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all flex items-center gap-2 shadow-lg shadow-primary/25 cursor-pointer"
                  >
                    <Shuffle className="w-4 h-4" />
                    <span>Retest Questions (Fresh Set)</span>
                  </button>

                  {/* PROCEED ON 2ND ATTEMPT WITH DISCLAIMER */}
                  {levelResult.isSecondFailureInLevel && (
                    <button
                      type="button"
                      onClick={() => {
                        setDisclaimerConfirmed(false);
                        setDisclaimerModalOpen(true);
                      }}
                      className="py-2.5 px-5 rounded-xl bg-white/[0.06] hover:bg-white/15 border border-amber-400/40 text-amber-300 font-jakarta font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Continue to Next Level (Risk Streak)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          /* SCENARIO 3: Active Question View (Exact Python Part 1 Layout) */
          <div className="w-full my-auto space-y-3">
            <div className="bg-panel/90 border border-white/10 rounded-2xl p-5 sm:p-7 space-y-5 shadow-2xl relative w-full">
              
              {/* Card Header: Level progress, remaining items & compact timer */}
              <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-white/10">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="font-mono text-xs font-bold text-primary uppercase tracking-wide">
                    Level {activeSection.number} • Question {currentLevelQuestionNumber} of {totalLevelQuestions}
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
                  ) : isReviewMode ? (
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-400">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Reviewing Answer</span>
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
                        : 'bg-white/[0.04] border-white/10 text-white'
                    }`}
                  >
                    <span>{isReviewMode ? 'Review' : '1 Pt'}</span>
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
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Column: Concept Reference Note & Code (Minimal & Simple) */}
                <div className="lg:col-span-6 space-y-3.5 p-4 sm:p-5 bg-black/40 border border-white/5 rounded-xl flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase font-bold text-primary tracking-wider block">
                        Concept Reference
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        {currentBlock.heading}
                      </h4>
                      <p className="text-white text-xs leading-relaxed">
                        {currentBlock.text}
                      </p>
                    </div>

                    {currentBlock.codeSnippet && (
                      <div className="rounded-lg border border-white/10 bg-black/80 overflow-hidden text-xs font-mono">
                        <div className="px-2.5 py-1 bg-white/[0.02] border-b border-white/5 flex items-center justify-between text-[10px] text-white">
                          <span>Dockerfile</span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(currentBlock.codeSnippet!, `code-${activeQuestionIdx}`)}
                            className="text-white hover:text-white cursor-pointer"
                          >
                            {copiedId === `code-${activeQuestionIdx}` ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <pre className="p-2.5 text-xs text-white overflow-x-auto leading-relaxed max-h-48">
                          {currentBlock.codeSnippet}
                        </pre>
                        {currentBlock.terminalOutput && (
                          <div className="px-2.5 py-1 border-t border-white/5 bg-black text-[11px] text-primary flex items-center gap-1.5">
                            <span className="text-white text-[10px] uppercase font-bold">Output:</span>
                            <span className="truncate">{currentBlock.terminalOutput.replace(/\n/g, ' | ')}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Continue button below note to reveal question */}
                  {isStudyPhase && !isLocked && (
                    <div className="pt-3 border-t border-white/5">
                      <button
                        type="button"
                        onClick={handleStartQuestion}
                        className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all cursor-pointer shadow-md shadow-primary/20 flex items-center justify-center gap-2 group"
                      >
                        <span>Continue to Question</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Column: Question & Choices */}
                <div className="lg:col-span-6 space-y-3.5 relative overflow-hidden rounded-xl min-h-[300px]">
                  
                  {/* Study Phase Blur Overlay */}
                  {isStudyPhase && !isLocked && (
                    <div 
                      onClick={handleStartQuestion}
                      className="absolute inset-0 z-20 backdrop-blur-md bg-black/70 rounded-xl border border-white/10 flex flex-col items-center justify-center p-6 text-center animate-fade-in cursor-pointer select-none"
                    >
                      <h4 className="text-sm font-bold text-white mb-1">
                        Question is Locked
                      </h4>
                      <p className="text-xs text-white max-w-xs leading-relaxed">
                        Read and understand the concept note on the left first. Click "Continue to Question" to unlock.
                      </p>
                    </div>
                  )}

                  {/* Question Content */}
                  <div className={`space-y-3 transition-all duration-300 ${
                    isStudyPhase && !isLocked ? 'filter blur-sm select-none pointer-events-none opacity-20' : ''
                  }`}>
                    <div className="space-y-1 pl-1">
                      <span className="text-[10px] font-mono uppercase font-bold text-primary tracking-wider block">
                        Multiple Choice Question
                      </span>
                      <h3 className="font-jakarta text-base sm:text-lg font-bold text-white leading-snug">
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
                            disabled={isReviewMode || isLocked || isTimeUpWaiting}
                            onClick={() => handleSelectOption(taskId, currentBlock.heading, opt.id, isCorrect)}
                            className={`w-full text-left py-2 px-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center gap-2.5 ${
                              showAsCorrect
                                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 ring-1 ring-emerald-500/30 shadow-md'
                                : isChosenWrong
                                ? 'bg-rose-500/15 border-rose-500/40 text-rose-200 ring-1 ring-rose-500/30 shadow-md'
                                : isLocked || isTimeUpWaiting
                                ? 'bg-black/30 border-white/5 text-slate/40 cursor-default opacity-50'
                                : 'bg-black/50 border-white/10 hover:border-primary/50 hover:bg-white/[0.03] text-white cursor-pointer'
                            }`}
                          >
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                              showAsCorrect
                                ? 'bg-emerald-500 text-ink font-bold'
                                : isChosenWrong
                                ? 'bg-rose-500 text-white'
                                : 'bg-white/10 text-white'
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

                    {isReviewMode && !currentChoice && !isTimeUpWaiting && (
                      <div className="space-y-2 pt-1 animate-fade-in">
                        <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 space-y-2.5">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-xs text-slate font-sans">
                              (Unanswered question in this attempt)
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                advanceToNextQuestion();
                              }}
                              className="py-1.5 px-4 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all cursor-pointer shadow-md shadow-primary/20 shrink-0 flex items-center gap-1.5"
                            >
                              <span>Continue</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-200 text-xs leading-relaxed font-sans">
                            <strong className="text-emerald-400 font-bold">✓ Correct Answer Explanation: </strong>
                            {currentMcq.explanationNote}
                          </div>
                        </div>
                      </div>
                    )}
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
                                  localStorage.removeItem('dopilot_fullstack_part12_time_up');
      localStorage.removeItem('dopilot_fullstack_part12_level_result');
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
                          <span className="text-[11px] font-mono text-white">
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

      {/* 2nd Attempt Failure Disclaimer Modal */}
      <AnimatePresence>
        {disclaimerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0e121a] border border-amber-400/40 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-2.5 text-amber-400 font-jakarta font-bold text-base">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Progression Risk Notice</span>
              </div>

              <p className="text-white text-xs leading-relaxed">
                You scored below 80% on your second attempt. If you choose to continue rather than retesting with alternative questions, this will count as <strong>1 consecutive level failure</strong>. If you reach <strong>3 consecutive failures</strong>, progression will be locked until advisor unlock.
              </p>

              <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
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

      {/* Part 13 Teaser Modal */}
      <AnimatePresence>
        {part13ModalOpen && (
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
                Part 13: Relational Databases - PostgreSQL &amp; Sequelize
              </h3>

              <p className="text-slate text-xs sm:text-sm leading-relaxed">
                Congratulations on mastering Part 12: Containers! Part 13: Relational databases with PostgreSQL, Sequelize ORM, database migrations, and advanced SQL querying is the final frontier in your curriculum.
              </p>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPart13ModalOpen(false);
                    navigate('/course/fullstack-open/part-13');
                  }}
                  className="px-6 py-2.5 rounded-full bg-primary text-ink font-jakarta font-black text-xs hover:bg-white transition-all cursor-pointer shadow-lg shadow-primary/25"
                >
                  Start Part 13 Now
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPart13ModalOpen(false);
                    navigate('/course/fullstack-open');
                  }}
                  className="px-5 py-2.5 rounded-full bg-white/10 text-white font-jakarta font-bold text-xs hover:bg-white/20 transition-all cursor-pointer"
                >
                  View Course Overview
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
    </div>
  );
};
