import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Clock, ArrowRight, Trophy, RotateCcw,
  CheckCircle2, AlertCircle, Shuffle, Sparkles, AlertTriangle, ShieldAlert
} from 'lucide-react';
import { FullstackCompilerLauncherButton, FullstackWebModal, FullstackTaskContext } from './compiler/FullstackWebModal';
import { useCoursePoints } from '../context/CoursePointsContext';
import { useUserAuth } from '../context/UserAuthContext';
import { ContactModal } from './ContactModal';
import { NeedHelpModal } from './NeedHelpModal';
import { 
  FULLSTACK_PART_6_SECTIONS, TheoryBlock, McqQuestion,
  getActiveQuestionsForLevelFullstackPart6, getConsecutiveFailedLevelsFullstackPart6,
  recordLevelAttemptResultFullstackPart6, resetConsecutiveFailuresFullstackPart6,
  setLevelAttemptCountFullstackPart6
} from '../data/fullstackPart6Data';
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

export const FullstackPart6Page: React.FC = () => {
  const navigate = useNavigate();
  const { points, isTaskSolved, awardPoint, recordWrongAttempt, resetProgress } = useCoursePoints();
  const { user } = useUserAuth();

  const studentId = user?.id || user?.email || 'default_student';

  // Persistent Active Section ID (Defaults to Section 6.1)
  const [activeSectionId, setActiveSectionId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('dopilot_fullstack_part6_active_section_id');
      return saved || '6-1-flux-architecture-redux-core';
    } catch {
      return '6-1-flux-architecture-redux-core';
    }
  });

  // Persistent Question Index
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('dopilot_fullstack_part6_active_q_idx');
      return saved !== null ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  const activeSection = FULLSTACK_PART_6_SECTIONS.find(s => s.id === activeSectionId) || FULLSTACK_PART_6_SECTIONS[0];
  const activeIdx = FULLSTACK_PART_6_SECTIONS.findIndex(s => s.id === activeSection.id);

  // Active question set for current level with question duplicate prevention
  const [levelQuestions, setLevelQuestions] = useState<McqQuestion[]>(() => {
    return getActiveQuestionsForLevelFullstackPart6(activeSection, studentId, false);
  });

  // Track level failure / pass outcome state
  const [levelResult, setLevelResult] = useState<LevelResultState | null>(() => {
    try {
      const saved = localStorage.getItem('dopilot_fullstack_part6_level_result');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Consecutive failure counter (loaded dynamically from student record)
  const [consecutiveFailures, setConsecutiveFailures] = useState<number>(() => {
    return getConsecutiveFailedLevelsFullstackPart6(studentId);
  });

  // Disclaimer popup state when choosing "Continue to Next Set" on 2nd consecutive failure
  const [disclaimerModalOpen, setDisclaimerModalOpen] = useState(false);
  const [disclaimerConfirmed, setDisclaimerConfirmed] = useState(false);

  // Persistent MCQ selected answers
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('dopilot_fullstack_part6_mcq_answers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Update questions whenever active level changes
  const prevSectionIdRef = useRef(activeSectionId);
  useEffect(() => {
    const qList = getActiveQuestionsForLevelFullstackPart6(activeSection, studentId, false);
    setLevelQuestions(qList);
    if (prevSectionIdRef.current !== activeSectionId) {
      prevSectionIdRef.current = activeSectionId;
      setLevelResult(null);
      try {
        localStorage.removeItem('dopilot_fullstack_part6_level_result');
      } catch {}
    }
  }, [activeSectionId, studentId]);

  const currentBlock: TheoryBlock = activeSection.theoryBlocks[activeQuestionIdx] || activeSection.theoryBlocks[0];
  const currentMcq: McqQuestion = levelQuestions[activeQuestionIdx] || currentBlock.mcq!;
  const taskId = `fullstack-6-${activeSection.id}-${currentMcq.id || activeQuestionIdx}`;

  // Whether user is currently in Study Phase (reading note with no timer pressure) or Question Phase (30s timer)
  const [isStudyPhase, setIsStudyPhase] = useState<boolean>(() => {
    try {
      const answers = JSON.parse(localStorage.getItem('dopilot_fullstack_part6_mcq_answers') || '{}');
      if (answers[taskId]) return false; // Already answered
      const savedPhase = localStorage.getItem('dopilot_fullstack_part6_study_phase');
      if (savedPhase !== null) return savedPhase === 'true';
    } catch {}
    return true; // Read note first by default
  });

  // Target End Timestamp for the 30-second question timer
  const [targetEndTime, setTargetEndTime] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('dopilot_fullstack_part6_q_target_end_time');
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
      if (localStorage.getItem('dopilot_fullstack_part6_time_up') === 'true') return true;
      const savedPhase = localStorage.getItem('dopilot_fullstack_part6_study_phase');
      if (savedPhase === 'true') return false;
      const savedEnd = Number(localStorage.getItem('dopilot_fullstack_part6_q_target_end_time'));
      const answers = JSON.parse(localStorage.getItem('dopilot_fullstack_part6_mcq_answers') || '{}');
      if (savedEnd && savedEnd <= Date.now() && !answers[taskId]) {
        return true;
      }
    } catch {}
    return false;
  });

  const [isCourseComplete, setIsCourseComplete] = useState<boolean>(() => {
    try {
      return localStorage.getItem('dopilot_fullstack_part6_completed') === 'true';
    } catch {
      return false;
    }
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [part7ModalOpen, setPart7ModalOpen] = useState(false);
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
      localStorage.setItem('dopilot_fullstack_core_last_part', '6');
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
      localStorage.setItem('dopilot_fullstack_part6_study_phase', 'false');
      localStorage.setItem('dopilot_fullstack_part6_q_target_end_time', String(freshEnd));
      localStorage.removeItem('dopilot_fullstack_part6_time_up');
      localStorage.removeItem('dopilot_fullstack_part6_level_result');
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
      const qTaskId = `fullstack-6-${secId}-${q.id || idx}`;
      const chosen = currentAnswers[qTaskId];
      if (chosen === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const percentage = Math.round((correctCount / totalCount) * 100);
    const isPassed = percentage > 80;

    const outcome = recordLevelAttemptResultFullstackPart6(secId, studentId, isPassed);

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
      localStorage.setItem('dopilot_fullstack_part6_level_result', JSON.stringify(resultState));
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
      localStorage.setItem('dopilot_fullstack_part6_study_phase', 'true');
    } catch {}

    const { activeQuestionIdx: qIdx, levelQuestions: qList } = stateRef.current;
    const nextQ = qIdx + 1;

    if (nextQ < qList.length) {
      setActiveQuestionIdx(nextQ);
      setTimeLeft(TIMER_DURATION);
      try {
        localStorage.setItem('dopilot_fullstack_part6_active_q_idx', String(nextQ));
      } catch (e) {
        console.error(e);
      }
    } else {
      evaluateLevelScore();
    }
  };

  // Reset Questions for Current Level (loads alternative distinct questions for same concepts)
  const handleResetQuestions = () => {
    const newQuestions = getActiveQuestionsForLevelFullstackPart6(activeSection, studentId, true);
    setLevelQuestions(newQuestions);

    const updatedAnswers = { ...selectedAnswers };
    newQuestions.forEach((q, idx) => {
      const oldTaskId = `fullstack-6-${activeSection.id}-${q.id || idx}`;
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
      localStorage.setItem('dopilot_fullstack_part6_mcq_answers', JSON.stringify(updatedAnswers));
      localStorage.setItem('dopilot_fullstack_part6_active_q_idx', '0');
      localStorage.setItem('dopilot_fullstack_part6_study_phase', 'true');
      localStorage.setItem('dopilot_fullstack_part6_q_target_end_time', String(fresh));
      localStorage.removeItem('dopilot_fullstack_part6_time_up');
      localStorage.removeItem('dopilot_fullstack_part6_level_result');
    } catch (e) {
      console.error(e);
    }
  };

  // Progress to the next level
  const handleProceedToNextLevel = () => {
    if (localStorage.getItem(`dopilot_fullstack_p6_locked_${studentId}`) === 'true') {
      setModalOpen(true);
      return;
    }

    const nextSecIdx = activeIdx + 1;
    if (nextSecIdx < FULLSTACK_PART_6_SECTIONS.length) {
      const nextSec = FULLSTACK_PART_6_SECTIONS[nextSecIdx];
      setActiveSectionId(nextSec.id);
      setActiveQuestionIdx(0);
      setLevelResult(null);
      setIsStudyPhase(true);
      setIsTimeUpWaiting(false);
      setTimeLeft(TIMER_DURATION);
      const fresh = Date.now() + TIMER_DURATION * 1000;
      setTargetEndTime(fresh);

      setLevelAttemptCountFullstackPart6(nextSec.id, studentId, 1);

      const nextQuestions = getActiveQuestionsForLevelFullstackPart6(nextSec, studentId, false);
      setLevelQuestions(nextQuestions);

      try {
        localStorage.setItem('dopilot_fullstack_part6_active_section_id', nextSec.id);
        localStorage.setItem('dopilot_fullstack_part6_active_q_idx', '0');
        localStorage.setItem('dopilot_fullstack_part6_study_phase', 'true');
        localStorage.setItem('dopilot_fullstack_part6_q_target_end_time', String(fresh));
        localStorage.removeItem('dopilot_fullstack_part6_time_up');
      localStorage.removeItem('dopilot_fullstack_part6_level_result');
      } catch (e) {
        console.error(e);
      }
    } else {
      setIsCourseComplete(true);
      playTwinkleSound();
      try {
        localStorage.setItem('dopilot_fullstack_part6_completed', 'true');
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
            localStorage.setItem('dopilot_fullstack_part6_time_up', 'true');
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
      localStorage.setItem('dopilot_fullstack_part6_mcq_answers', JSON.stringify(updated));
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

  // Reset entire Part 6 progress completely
  const handleResetAll = () => {
    if (!window.confirm("Reset all your Part 6 Full Stack Open progress and begin from Level 6.1?")) {
      return;
    }
    resetProgress();
    resetConsecutiveFailuresFullstackPart6(studentId);
    setConsecutiveFailures(0);
    setActiveSectionId(FULLSTACK_PART_6_SECTIONS[0].id);
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
      localStorage.removeItem('dopilot_fullstack_part6_mcq_answers');
      localStorage.removeItem('dopilot_fullstack_part6_active_section_id');
      localStorage.removeItem('dopilot_fullstack_part6_active_q_idx');
      localStorage.removeItem('dopilot_fullstack_part6_completed');
      localStorage.removeItem('dopilot_fullstack_part6_q_target_end_time');
      localStorage.removeItem(`dopilot_fullstack_p6_consecutive_failures_${studentId}`);
      localStorage.removeItem(`dopilot_fullstack_p6_locked_${studentId}`);
      localStorage.setItem('dopilot_fullstack_part6_study_phase', 'true');
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

              <span className="text-slate/60 text-[10px]">pts</span>
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

      {/* Main Focus Arena (Centered, Identical Layout to Python & Java) */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 relative z-10 my-auto">
        
        {/* SCENARIO 1: Entire Part 6 Course Completed */}
        {isCourseComplete ? (
          <div className="bg-panel/95 border border-white/10 rounded-3xl p-6 sm:p-10 max-w-2xl w-full text-center space-y-6 shadow-2xl my-6 backdrop-blur-xl animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-primary to-emerald-400" />

            <div className="flex items-center justify-center pt-2">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider border bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Part 6 Fully Certified</span>
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="font-jakarta text-2xl sm:text-3xl font-black text-paper tracking-tight">
                Part 6 Complete! 🎉
              </h2>
              <p className="text-slate text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                You have mastered all 6 foundational levels of University of Helsinki Full Stack Open Part 6: Advanced State Management with Redux, Redux Toolkit &amp; React Query. You scored &gt; 80% across all sections and earned {points} course points!
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => navigate('/course/fullstack-open/part-7')}
                className="py-2.5 px-6 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all flex items-center gap-2 shadow-lg shadow-primary/25 cursor-pointer"
              >
                <span>Continue to Part 7: React Router &amp; UI</span>
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
          <div className="bg-panel/95 border border-white/10 rounded-3xl p-6 sm:p-10 max-w-2xl w-full text-center space-y-6 shadow-2xl my-6 backdrop-blur-xl animate-fade-in relative overflow-hidden">
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
                    <span>Level {activeSection.number} Did Not Pass ({levelResult.percentage}%)</span>
                  </>
                )}
              </span>
            </div>

            {/* Headings & Descriptive Feedback */}
            <div className="space-y-2">
              <h2 className="font-jakarta text-2xl sm:text-3xl font-black text-paper tracking-tight">
                {levelResult.isPassed
                  ? 'Great Job! Level Mastered'
                  : levelResult.isLocked
                  ? 'Three Consecutive Failures Detected'
                  : levelResult.isSecondFailureInLevel
                  ? 'Second Attempt Unsuccessful'
                  : 'Score Below 80% Requirement'}
              </h2>

              <p className="text-slate text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                {levelResult.isPassed ? (
                  <>You correctly answered {levelResult.correctCount} of {levelResult.totalCount} questions ({levelResult.percentage}%). You demonstrated strong comprehension of {activeSection.title}.</>
                ) : levelResult.isLocked ? (
                  <>You have accumulated 3 consecutive failed levels. In accordance with course progression standards, self-directed advancement is temporarily paused until you connect with a senior technical advisor.</>
                ) : levelResult.isSecondFailureInLevel ? (
                  <>You scored {levelResult.percentage}% on Attempt {levelResult.attemptCount}. You may retest this level with new questions now, or proceed to the next set with consecutive failure risk.</>
                ) : (
                  <>You answered {levelResult.correctCount} of {levelResult.totalCount} questions correctly ({levelResult.percentage}%). A score of at least 80% is needed to pass without increasing your failure streak.</>
                )}
              </p>
            </div>

            {/* Streak & Score Grid Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto pt-2">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                <span className="font-mono text-[10px] text-slate uppercase block">Score</span>
                <span className={`font-mono text-xl font-black ${levelResult.isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {levelResult.percentage}%
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
                <span className="font-mono text-[10px] text-slate uppercase block">Correct</span>
                <span className="font-mono text-xl font-black text-paper">
                  {levelResult.correctCount}/{levelResult.totalCount}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-center col-span-2 sm:col-span-1">
                <span className="font-mono text-[10px] text-slate uppercase block">Consecutive Failures</span>
                <span className={`font-mono text-xl font-black ${levelResult.streak >= 3 ? 'text-rose-400' : levelResult.streak > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {levelResult.streak}/3
                </span>
              </div>
            </div>

            {/* Action Buttons depending on outcome */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              {levelResult.isPassed ? (
                <button
                  type="button"
                  onClick={handleProceedToNextLevel}
                  className="py-2.5 px-6 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all flex items-center gap-2 shadow-lg shadow-primary/25 cursor-pointer"
                >
                  <span>
                    {activeIdx + 1 < FULLSTACK_PART_6_SECTIONS.length 
                      ? `Proceed to Level ${FULLSTACK_PART_6_SECTIONS[activeIdx + 1].number}` 
                      : 'Complete Part 6'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : levelResult.isLocked ? (
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="py-2.5 px-6 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-jakarta font-extrabold text-xs transition-all flex items-center gap-2 shadow-lg shadow-rose-500/25 cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Consult Course Advisor to Unlock</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleResetQuestions}
                    className="py-2.5 px-6 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all flex items-center gap-2 shadow-lg shadow-primary/25 cursor-pointer"
                  >
                    <Shuffle className="w-4 h-4" />
                    <span>Reset with New Questions</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (levelResult.isSecondFailureInLevel) {
                        setDisclaimerConfirmed(false);
                        setDisclaimerModalOpen(true);
                      } else {
                        handleProceedToNextLevel();
                      }
                    }}
                    className="py-2.5 px-5 rounded-xl bg-white/[0.06] hover:bg-white/15 border border-white/15 text-paper font-jakarta font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Continue to Next Level</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          /* SCENARIO 3: Active Question Focused Workspace (Identical Python 10/10 Layout) */
          <div className="bg-panel/90 border border-white/10 rounded-2xl p-4 sm:p-6 space-y-4 shadow-2xl relative w-full">
            
            {/* Top Bar inside card: Level pills + Question tracker */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-primary/20 text-primary border border-primary/30">
                  Level {activeSection.number}
                </span>
                <span className="font-jakarta text-xs sm:text-sm font-bold text-paper">
                  {activeSection.title}
                </span>
              </div>

              {/* Progress counter pill */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-slate/70">
                  Question <strong className="text-paper">{currentLevelQuestionNumber}</strong> of {totalLevelQuestions}
                </span>
                {remainingLevelQuestions > 0 && (
                  <span className="hidden sm:inline font-mono text-[10px] text-slate/50">
                    ({remainingLevelQuestions} remaining)
                  </span>
                )}
              </div>
            </div>

            {/* Split Screen Grid: 5 Cols Minimal Notes / 7 Cols Question & Options */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* Left Column (5 Cols): Minimal & Simple Notes + Code Snippet */}
              <div className="lg:col-span-5 space-y-3">
                <div className="bg-black/40 border border-white/5 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      <span>{currentBlock.heading}</span>
                    </span>
                    <span className="font-mono text-[10px] text-slate/50">
                      Step {activeQuestionIdx + 1}/{totalLevelQuestions}
                    </span>
                  </div>

                  {/* Concise 1-2 sentence core note */}
                  <p className="text-slate text-xs leading-relaxed font-sans">
                    {currentBlock.text}
                  </p>

                  {/* Compact code syntax snippet */}
                  {currentBlock.codeSnippet && (
                    <div className="relative group rounded-lg overflow-hidden border border-white/10 bg-[#07090e]">
                      <div className="flex items-center justify-between px-2.5 py-1 bg-white/[0.03] border-b border-white/5">
                        <span className="font-mono text-[10px] text-slate/60">Redux / State</span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(currentBlock.codeSnippet!, `code-${activeQuestionIdx}`)}
                          className="font-mono text-[10px] text-slate hover:text-paper transition-colors cursor-pointer"
                        >
                          {copiedId === `code-${activeQuestionIdx}` ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <pre className="p-2.5 font-mono text-[11px] text-emerald-300/90 overflow-x-auto leading-relaxed max-h-28">
                        <code>{currentBlock.codeSnippet}</code>
                      </pre>
                    </div>
                  )}

                  {/* Optional Terminal or Server Output */}
                  {currentBlock.terminalOutput && (
                    <div className="rounded-lg overflow-hidden border border-white/5 bg-black/60 p-2 font-mono text-[10px] text-slate/80">
                      <span className="text-primary font-bold">Terminal: </span>
                      {currentBlock.terminalOutput}
                    </div>
                  )}

                  {/* Study Phase Action Button (Unlocks 30s timer & Question) */}
                  {isStudyPhase && !isLocked && !isTimeUpWaiting && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={handleStartQuestion}
                        className="w-full py-2 px-3 rounded-lg bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-primary/20 cursor-pointer"
                      >
                        <span>Continue to Question</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column (7 Cols): Question Prompt, 30s Timer, and 4 Options */}
              <div className="lg:col-span-7 space-y-3">
                
                {/* Question Card Box */}
                <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-3 relative overflow-hidden">
                  
                  {/* Top line of question: Header + Timer */}
                  <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2">
                    <span className="font-mono text-[11px] font-bold text-slate/70 uppercase tracking-wider">
                      Assessment Prompt
                    </span>

                    {/* 30-Second Countdown Timer Badge */}
                    <div className="flex items-center gap-1">
                      <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-xs font-bold border transition-colors ${
                        isStudyPhase
                          ? 'bg-white/[0.04] border-white/10 text-slate/60'
                          : timeLeft <= 5
                          ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 animate-pulse'
                          : timeLeft <= 10
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                          : 'bg-primary/10 border-primary/30 text-primary'
                      }`}>
                        <Clock className="w-3 h-3" />
                        <span>{isStudyPhase ? '30s' : `${timeLeft}s`}</span>
                      </div>
                    </div>
                  </div>

                  {/* Question Text */}
                  <h3 className="font-jakarta font-bold text-sm sm:text-base text-paper leading-snug">
                    {currentMcq.question}
                  </h3>

                  {/* Options List or Locked Blur during Study Phase */}
                  <div className="relative pt-1">
                    
                    {isStudyPhase && !isLocked && !isTimeUpWaiting && (
                      <div className="absolute inset-0 z-20 backdrop-blur-[3px] bg-black/40 rounded-xl flex flex-col items-center justify-center p-4 text-center space-y-2 border border-white/10">
                        <span className="font-mono text-xs text-primary font-bold uppercase tracking-wider">
                          Question is Locked
                        </span>
                        <p className="text-slate text-xs max-w-xs">
                          Read and understand the concept note on the left first. Click below when you are ready to answer.
                        </p>
                        <button
                          type="button"
                          onClick={handleStartQuestion}
                          className="py-1.5 px-4 rounded-lg bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all shadow-md shadow-primary/25 cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Unlock Question (30s)</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* 4 Interactive Option Buttons */}
                    <div className="space-y-2">
                      {currentMcq.options.map((opt) => {
                        const isChosen = currentChoice === opt.id;
                        const isCorrect = opt.id === currentMcq.correctAnswer;
                        const showCorrectness = isLocked || isTimeUpWaiting;

                        let btnStyle = 'bg-white/[0.03] hover:bg-white/[0.07] border-white/10 text-paper';
                        if (showCorrectness) {
                          if (isCorrect) {
                            btnStyle = 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200 font-semibold';
                          } else if (isChosen && !isCorrect) {
                            btnStyle = 'bg-rose-500/20 border-rose-500/60 text-rose-200 line-through';
                          } else {
                            btnStyle = 'bg-white/[0.02] border-white/5 text-slate/40 opacity-50';
                          }
                        }

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            disabled={isLocked || isTimeUpWaiting || isStudyPhase}
                            onClick={() => handleSelectOption(taskId, currentBlock.heading, opt.id, opt.id === currentMcq.correctAnswer)}
                            className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all duration-150 flex items-start gap-2.5 cursor-pointer disabled:cursor-default ${btnStyle}`}
                          >
                            <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[11px] font-black shrink-0 border ${
                              showCorrectness && isCorrect
                                ? 'bg-emerald-500 text-ink border-emerald-400'
                                : showCorrectness && isChosen && !isCorrect
                                ? 'bg-rose-500 text-white border-rose-400'
                                : 'bg-white/[0.05] border-white/10 text-slate'
                            }`}>
                              {showCorrectness && isCorrect ? '✓' : showCorrectness && isChosen && !isCorrect ? '✕' : opt.id}
                            </span>
                            <span className="flex-1 leading-snug">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Time-Up Notification (When 30s expired without answer) */}
                    {isTimeUpWaiting && !currentChoice && (
                      <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs space-y-2">
                        <div className="flex items-center gap-1.5 font-bold text-rose-300">
                          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>Time Expired! (30s limit reached)</span>
                        </div>
                        <p className="font-sans text-xs text-rose-200/90 leading-relaxed">
                          The correct answer was <strong className="text-emerald-400 font-mono">Option {currentMcq.correctAnswer}</strong>. Review the explanation note below and click continue:
                        </p>
                        <div className="pt-1 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => {
                              setIsTimeUpWaiting(false);
                              advanceToNextQuestion();
                            }}
                            className="py-1.5 px-4 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all cursor-pointer flex items-center gap-1.5 ml-auto"
                          >
                            <span>Continue to Next</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-200 text-xs leading-relaxed font-sans">
                          <strong className="text-emerald-400 font-bold">✓ Explanation: </strong>
                          {currentMcq.explanationNote}
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

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed space-y-2">
                <p>
                  You are choosing to proceed to the next level after failing your second attempt at <strong>Level {activeSection.number}</strong>.
                </p>
                <p>
                  Current failure streak: <strong>{consecutiveFailures}</strong>. If your streak reaches <strong>3 consecutive failed levels</strong>, further progression will be locked until consultation with a course mentor.
                </p>
              </div>

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

      {/* Part 7 Teaser Modal */}
      <AnimatePresence>
        {part7ModalOpen && (
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
                Part 7: React Router, Custom Hooks &amp; Styling
              </h3>

              <p className="text-slate text-xs sm:text-sm leading-relaxed">
                Congratulations on mastering Part 6: Advanced State Management with Redux &amp; React Query! Part 7: React Router navigation, custom hooks, and styling with UI frameworks will be unlocked next in your curriculum.
              </p>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPart7ModalOpen(false);
                    navigate('/course/fullstack-open/part-7');
                  }}
                  className="px-6 py-2.5 rounded-full bg-primary text-ink font-jakarta font-black text-xs hover:bg-white transition-all cursor-pointer shadow-lg shadow-primary/25"
                >
                  Start Part 7 Now
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPart7ModalOpen(false);
                    navigate('/course/fullstack-open');
                  }}
                  className="px-5 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/15 text-paper font-jakarta font-bold text-xs transition-all cursor-pointer"
                >
                  Curriculum
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
