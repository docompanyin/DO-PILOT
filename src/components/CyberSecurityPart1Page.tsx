import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Clock, ArrowRight, Trophy, RotateCcw,
  CheckCircle2, AlertCircle, Shuffle, Check, Sparkles, AlertTriangle, ShieldAlert
} from 'lucide-react';
import { CyberTerminalLauncherButton } from './compiler/CyberTerminalModal';
import { useCoursePoints } from '../context/CoursePointsContext';
import { useUserAuth } from '../context/UserAuthContext';
import { ContactModal } from './ContactModal';
import { NeedHelpModal } from './NeedHelpModal';
import { 
  PART_1_SECTIONS, TheoryBlock, McqQuestion,
  getActiveQuestionsForLevel, getConsecutiveFailedLevels,
  recordLevelAttemptResult, resetConsecutiveFailures,
  setLevelAttemptCount
} from '../data/cyberPart1Data';

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

export const CyberSecurityPart1Page: React.FC = () => {
  const navigate = useNavigate();
  const { points, isTaskSolved, awardPoint, resetProgress } = useCoursePoints();
  const { user } = useUserAuth();

  // Consistent student identifier
  const studentId = user?.id || user?.email || 'default_student';

  // Persistent Active Section ID (Defaults to Section 1.1)
  const [activeSectionId, setActiveSectionId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('dopilot_cyber_part1_active_section_id');
      if (saved && PART_1_SECTIONS.some(s => s.id === saved)) return saved;
      return PART_1_SECTIONS[0].id;
    } catch {
      return PART_1_SECTIONS[0].id;
    }
  });

  // Persistent Question Index
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('dopilot_cyber_part1_active_q_idx');
      return saved !== null ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  const activeSection = PART_1_SECTIONS.find(s => s.id === activeSectionId) || PART_1_SECTIONS[0];
  const activeIdx = PART_1_SECTIONS.findIndex(s => s.id === activeSection.id);

  // Active question set for current level with question duplicate prevention
  const [levelQuestions, setLevelQuestions] = useState<McqQuestion[]>(() => {
    return getActiveQuestionsForLevel(activeSection, studentId, false);
  });

  // Track level failure / pass outcome state
  const [levelResult, setLevelResult] = useState<LevelResultState | null>(null);

  // Consecutive failure counter
  const [consecutiveFailures, setConsecutiveFailures] = useState<number>(() => {
    return getConsecutiveFailedLevels(studentId);
  });

  // Disclaimer popup state when choosing "Continue to Next Set" on 2nd consecutive failure
  const [disclaimerModalOpen, setDisclaimerModalOpen] = useState(false);

  // Persistent MCQ selected answers
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('dopilot_cyber_part1_mcq_answers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Update questions whenever active level changes
  useEffect(() => {
    const qList = getActiveQuestionsForLevel(activeSection, studentId, false);
    setLevelQuestions(qList);
    setLevelResult(null);
  }, [activeSectionId, studentId]);

  const currentBlock: TheoryBlock = activeSection.theoryBlocks[activeQuestionIdx] || activeSection.theoryBlocks[0];
  const currentMcq: McqQuestion = levelQuestions[activeQuestionIdx] || currentBlock.mcq!;
  const taskId = `cyber-p1-${activeSection.id}-${currentMcq.id || activeQuestionIdx}`;

  // Study Phase vs Question Phase (Study phase by default, no timer pressure until user clicks continue)
  const [isStudyPhase, setIsStudyPhase] = useState<boolean>(() => {
    try {
      const answers = JSON.parse(localStorage.getItem('dopilot_cyber_part1_mcq_answers') || '{}');
      if (answers[taskId]) return false; // Already answered, show unblurred
      const savedPhase = localStorage.getItem('dopilot_cyber_part1_study_phase');
      if (savedPhase !== null) return savedPhase === 'true';
    } catch {}
    return true; // Read note first by default
  });

  // Target End Timestamp for the 30-second question timer
  const [targetEndTime, setTargetEndTime] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('dopilot_cyber_part1_q_target_end_time');
      const num = saved ? Number(saved) : 0;
      if (num) return num;
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
      if (localStorage.getItem('dopilot_cyber_part1_time_up') === 'true') return true;
      const savedPhase = localStorage.getItem('dopilot_cyber_part1_study_phase');
      if (savedPhase === 'true') return false;
      const savedEnd = Number(localStorage.getItem('dopilot_cyber_part1_q_target_end_time'));
      const answers = JSON.parse(localStorage.getItem('dopilot_cyber_part1_mcq_answers') || '{}');
      if (savedEnd && savedEnd <= Date.now() && !answers[taskId]) {
        return true;
      }
    } catch {}
    return false;
  });

  const [isCourseComplete, setIsCourseComplete] = useState<boolean>(() => {
    try {
      return localStorage.getItem('dopilot_cyber_part1_completed') === 'true';
    } catch {
      return false;
    }
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [part2ModalOpen, setPart2ModalOpen] = useState(false);

  // Animated points celebration state
  const [pointAwardAnim, setPointAwardAnim] = useState<{ id: number; diff: number } | null>(null);
  const prevPointsRef = useRef<number>(points);
  const [correctCountdown, setCorrectCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (points > prevPointsRef.current) {
      const diff = points - prevPointsRef.current;
      setPointAwardAnim({ id: Date.now(), diff });
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
    document.title = `Level ${activeSection.number}: ${activeSection.title} — DO PILOT Cyber Security`;
    try {
      localStorage.setItem('dopilot_cyber_core_last_part', '1');
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
      localStorage.setItem('dopilot_cyber_part1_study_phase', 'false');
      localStorage.setItem('dopilot_cyber_part1_q_target_end_time', String(freshEnd));
      localStorage.removeItem('dopilot_cyber_part1_time_up');
    } catch (e) {
      console.error(e);
    }
  };

  // Evaluate Level Score after the 6 questions in current level are completed
  const evaluateLevelScore = () => {
    const qList = stateRef.current.levelQuestions;
    const secId = stateRef.current.activeSectionId;
    const answers = stateRef.current.selectedAnswers;

    let correctCount = 0;
    const totalCount = qList.length;

    qList.forEach((q, idx) => {
      const qTaskId = `cyber-p1-${secId}-${q.id || idx}`;
      if (answers[qTaskId] === q.correctAnswer) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / totalCount) * 100);
    // Passing requirement is STRICTLY MORE THAN 80% (> 80%, so 5 or 6 out of 6 correct)
    const isPassed = percentage > 80;

    const result = recordLevelAttemptResult(activeSection.id, studentId, isPassed);
    setConsecutiveFailures(result.consecutiveFailedLevels);

    if (isPassed) {
      try {
        localStorage.setItem(`dopilot_cyber_part1_sec_${secId}_passed`, 'true');
        const allPassed = PART_1_SECTIONS.every(s => 
          s.id === secId || localStorage.getItem(`dopilot_cyber_part1_sec_${s.id}_passed`) === 'true'
        );
        if (allPassed) {
          localStorage.setItem('dopilot_cyber_part1_completed', 'true');
          setIsCourseComplete(true);
        }
      } catch {}
    }

    setLevelResult({
      isFinished: true,
      isPassed,
      correctCount,
      totalCount,
      percentage,
      streak: result.consecutiveFailedLevels,
      attemptCount: result.attemptCount,
      isSecondFailureInLevel: result.isSecondFailureInLevel,
      isLocked: result.isLocked
    });
  };

  // Advance function to go to next question or complete level
  const advanceToNextQuestion = () => {
    setCorrectCountdown(null);
    setIsTimeUpWaiting(false);
    setIsStudyPhase(true);
    try {
      localStorage.setItem('dopilot_cyber_part1_study_phase', 'true');
    } catch {}

    const { activeQuestionIdx: qIdx, levelQuestions: qList } = stateRef.current;
    const nextQ = qIdx + 1;

    if (nextQ < qList.length) {
      setActiveQuestionIdx(nextQ);
      setTimeLeft(TIMER_DURATION);
      try {
        localStorage.setItem('dopilot_cyber_part1_active_q_idx', String(nextQ));
      } catch (e) {
        console.error(e);
      }
    } else {
      evaluateLevelScore();
    }
  };

  // Reset Questions for Current Level (loads fresh retest questions)
  const handleResetQuestions = () => {
    const newQuestions = getActiveQuestionsForLevel(activeSection, studentId, true);
    setLevelQuestions(newQuestions);

    const updatedAnswers = { ...selectedAnswers };
    newQuestions.forEach((q, idx) => {
      const oldTaskId = `cyber-p1-${activeSection.id}-${q.id || idx}`;
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
      localStorage.setItem('dopilot_cyber_part1_mcq_answers', JSON.stringify(updatedAnswers));
      localStorage.setItem('dopilot_cyber_part1_active_q_idx', '0');
      localStorage.setItem('dopilot_cyber_part1_study_phase', 'true');
      localStorage.setItem('dopilot_cyber_part1_q_target_end_time', String(fresh));
      localStorage.removeItem('dopilot_cyber_part1_time_up');
    } catch (e) {
      console.error(e);
    }
  };

  // Progress to next level
  const handleProceedToNextLevel = () => {
    if (localStorage.getItem(`dopilot_cyber_locked_${studentId}`) === 'true') {
      setContactModalOpen(true);
      return;
    }

    const nextSecIdx = activeIdx + 1;
    if (nextSecIdx < PART_1_SECTIONS.length) {
      const nextSec = PART_1_SECTIONS[nextSecIdx];
      setActiveSectionId(nextSec.id);
      setActiveQuestionIdx(0);
      setLevelResult(null);
      setIsStudyPhase(true);
      setIsTimeUpWaiting(false);
      setTimeLeft(TIMER_DURATION);
      const fresh = Date.now() + TIMER_DURATION * 1000;
      setTargetEndTime(fresh);

      setLevelAttemptCount(nextSec.id, studentId, 1);
      const nextQuestions = getActiveQuestionsForLevel(nextSec, studentId, false);
      setLevelQuestions(nextQuestions);

      try {
        localStorage.setItem('dopilot_cyber_part1_active_section_id', nextSec.id);
        localStorage.setItem('dopilot_cyber_part1_active_q_idx', '0');
        localStorage.setItem('dopilot_cyber_part1_study_phase', 'true');
        localStorage.setItem('dopilot_cyber_part1_q_target_end_time', String(fresh));
        localStorage.removeItem('dopilot_cyber_part1_time_up');
      } catch (e) {
        console.error(e);
      }
    } else {
      setIsCourseComplete(true);
      try {
        localStorage.setItem('dopilot_cyber_part1_completed', 'true');
      } catch {}
    }
  };

  // Auto-skip after exactly 3 seconds when answered correctly
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

  // Main 30-Second Countdown Timer Loop
  useEffect(() => {
    if (isCourseComplete || isStudyPhase || levelResult?.isFinished) return;

    const interval = setInterval(() => {
      if (stateRef.current.isTimeUpWaiting || stateRef.current.isStudyPhase) return;

      const userChoice = stateRef.current.selectedAnswers[stateRef.current.taskId];
      const correctAns = stateRef.current.currentMcq?.correctAnswer;

      const isWrongAnswer = Boolean(userChoice && userChoice !== correctAns);
      const isCorrectAnswer = Boolean(userChoice && userChoice === correctAns);

      // IF USER ENTERED A WRONG ANSWER: STOP TIMER & NEVER AUTO-SKIP! Wait for manual continue click!
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
            localStorage.setItem('dopilot_cyber_part1_time_up', 'true');
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

  // Locked answer selection: once chosen, cannot be changed
  const handleSelectOption = (tId: string, heading: string, optId: string, isCorrect: boolean) => {
    if (selectedAnswers[tId] || isTaskSolved(tId) || isTimeUpWaiting || isStudyPhase || levelResult?.isFinished) {
      return;
    }
    const updated = { ...selectedAnswers, [tId]: optId };
    setSelectedAnswers(updated);
    try {
      localStorage.setItem('dopilot_cyber_part1_mcq_answers', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    if (isCorrect) {
      awardPoint(tId, heading, optId);
      setCorrectCountdown(3);
    }
  };

  // One-click reset progress, timers & points
  const handleResetAll = () => {
    resetProgress();
    resetConsecutiveFailures(studentId);
    PART_1_SECTIONS.forEach(s => setLevelAttemptCount(s.id, studentId, 1));
    setConsecutiveFailures(0);
    setCorrectCountdown(null);
    setSelectedAnswers({});
    setActiveSectionId(PART_1_SECTIONS[0].id);
    setActiveQuestionIdx(0);
    setLevelResult(null);
    setIsCourseComplete(false);
    setIsTimeUpWaiting(false);
    setIsStudyPhase(true);

    const fresh = Date.now() + TIMER_DURATION * 1000;
    setTargetEndTime(fresh);
    setTimeLeft(TIMER_DURATION);

    try {
      localStorage.removeItem('dopilot_cyber_part1_mcq_answers');
      localStorage.removeItem('dopilot_cyber_part1_active_section_id');
      localStorage.removeItem('dopilot_cyber_part1_active_q_idx');
      localStorage.removeItem('dopilot_cyber_part1_completed');
      localStorage.removeItem('dopilot_cyber_part1_q_target_end_time');
      localStorage.removeItem(`dopilot_cyber_consecutive_failures_${studentId}`);
      localStorage.removeItem(`dopilot_cyber_locked_${studentId}`);
      localStorage.setItem('dopilot_cyber_part1_study_phase', 'true');
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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[250px] bg-primary/10 blur-[160px] pointer-events-none rounded-full" />

      {/* Top Navigation Bar - Slim & Clean */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/course/cyber-security')}
            className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/10 text-slate hover:text-paper font-mono text-xs transition-all cursor-pointer"
            title="Leave Course (Progress and remaining balance saved)"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Overview</span>
          </button>

          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://res.cloudinary.com/ufo0zltq/image/upload/v1786197046/Do_PNG_ssyhu1.png"
              alt="DO PILOT"
              className="h-6 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,255,157,0.3)]"
            />
            <span className="font-jakarta font-black text-xs tracking-wider text-paper">
              DO PILOT
            </span>
          </Link>

          
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

      {/* Main Focus Arena */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 relative z-10 my-auto">
        
        {/* SCENARIO 1: Entire Part 1 Course Completed */}
        {isCourseComplete ? (
          <div className="bg-panel/95 border border-white/10 rounded-3xl p-6 sm:p-10 max-w-2xl w-full text-center space-y-6 shadow-2xl my-6 backdrop-blur-xl animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-primary to-emerald-400" />

            <div className="flex items-center justify-center pt-2">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider border bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Part 1 Fully Certified</span>
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="font-jakarta text-2xl sm:text-3xl font-black text-paper tracking-tight">
                Part 1 Complete! 🎉
              </h2>
              <p className="text-slate text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                You have passed all levels from 1.1 through 1.5. You scored &gt; 80% across all sections and earned {points} course points!
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setPart2ModalOpen(true)}
                className="py-2.5 px-6 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all flex items-center gap-2 shadow-lg shadow-primary/25 cursor-pointer"
              >
                <span>Continue to Part 2</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/course/cyber-security')}
                className="py-2.5 px-5 rounded-xl bg-white/[0.06] hover:bg-white/15 border border-white/15 text-paper font-jakarta font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Back to Dashboard</span>
              </button>
            </div>
          </div>
        ) : levelResult?.isFinished ? (
          /* SCENARIO 2: Level Evaluation Result (Pass, First Failure, Second Failure, or Locked) */
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
              {levelResult.isPassed ? (
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider border bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Level {activeSection.number} Passed • &gt; 80% Scored</span>
                </span>
              ) : levelResult.isLocked ? (
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider border bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-rose-500/25">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Contact Team Required • Level Progression Locked</span>
                </span>
              ) : levelResult.isSecondFailureInLevel ? (
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider border bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-amber-500/20">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>
                    Level {activeSection.number} Failed Twice • {levelResult.streak === 1 ? 'Warning 1 of 2' : 'Final Warning'}
                  </span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider border bg-rose-500/15 border-rose-500/40 text-rose-300 shadow-rose-500/20">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>Exam Failed • Score ≤ 80% (Attempt 1 of 2)</span>
                </span>
              )}
            </div>

            {/* Headline and Narrative */}
            <div className="space-y-2">
              <h2 className="font-jakarta text-2xl sm:text-3xl font-black text-paper tracking-tight">
                {levelResult.isPassed
                  ? `Level ${activeSection.number} Passed!`
                  : levelResult.isLocked
                  ? 'Contact Team Required'
                  : levelResult.isSecondFailureInLevel
                  ? `Exam Failed (2nd Failure in Level ${activeSection.number})`
                  : 'Exam Failed'}
              </h2>
              <p className="text-slate text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                {levelResult.isPassed
                  ? `Congratulations! You scored ${levelResult.percentage}%, successfully meeting the requirement of more than 80%. Your consecutive-failure streak has reset to 0.`
                  : levelResult.isLocked
                  ? 'You have reached 3 consecutive failed levels (1.1, 1.2, and 1.3). Progression is locked. Please reach out to our team to review your concepts and unlock further levels.'
                  : levelResult.isSecondFailureInLevel
                  ? levelResult.streak === 1
                    ? 'You have failed Level 1.1 twice. You have 2 more warnings remaining before course progression is locked.'
                    : 'Warning: You failed Level 1.2 twice. Only 1 more warning remaining! If you fail the next level twice, your course progression will be completely locked.'
                  : 'Your score was 80% or below. The passing requirement is more than 80%. Click "Reset Questions" to receive a completely new set of questions testing the same concepts with no duplicates.'}
              </p>
            </div>

            {/* Scorecard Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-1 ${
                levelResult.isPassed ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'
              }`}>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate">Score</span>
                <span className={`font-mono text-3xl sm:text-4xl font-black ${
                  levelResult.isPassed ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {levelResult.percentage}%
                </span>
                <span className="text-[10px] font-mono text-slate/70">Requirement: &gt; 80%</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center gap-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate">Correct Answers</span>
                <span className="font-mono text-3xl sm:text-4xl font-black text-paper">
                  {levelResult.correctCount} <span className="text-slate/60 text-lg font-normal">/ {levelResult.totalCount}</span>
                </span>
                <span className="text-[10px] font-mono text-slate/70">
                  {levelResult.isPassed ? 'Benchmark achieved' : 'More than 80% needed'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center gap-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate">Failed Level Streak</span>
                <span className={`font-mono text-3xl sm:text-4xl font-black ${
                  levelResult.isPassed ? 'text-emerald-400' : levelResult.isLocked ? 'text-rose-400' : 'text-amber-300'
                }`}>
                  {levelResult.isPassed ? '0' : levelResult.streak}
                </span>
                <span className="text-[10px] font-mono text-slate/70">
                  {levelResult.isPassed ? 'Streak reset to 0' : `${levelResult.streak} of 3 before locked`}
                </span>
              </div>
            </div>

            {/* Action Buttons Configured per exact prompt rules */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              {levelResult.isPassed ? (
                /* PASSED: Continue to next level normally */
                <button
                  type="button"
                  onClick={handleProceedToNextLevel}
                  className="py-2.5 px-6 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all flex items-center gap-2 shadow-lg shadow-primary/25 cursor-pointer"
                >
                  <span>Continue to Next Level</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : !levelResult.isSecondFailureInLevel ? (
                /* FIRST FAILURE: ONLY "Reset Questions" option */
                <button
                  type="button"
                  onClick={handleResetQuestions}
                  className="py-2.5 px-6 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all flex items-center gap-2 shadow-lg shadow-primary/25 cursor-pointer"
                >
                  <Shuffle className="w-4 h-4" />
                  <span>Reset Questions</span>
                </button>
              ) : !levelResult.isLocked ? (
                /* SECOND CONSECUTIVE FAILURE: Show "Contact Team Now", "Continue to Next Set", and "Reset & Retry Level" */
                <>
                  <button
                    type="button"
                    onClick={() => setContactModalOpen(true)}
                    className="py-2.5 px-5 rounded-xl bg-white/[0.06] hover:bg-white/15 border border-white/20 text-paper font-jakarta font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Contact Team Now</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDisclaimerModalOpen(true)}
                    className="py-2.5 px-5 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-primary/20 cursor-pointer"
                  >
                    <span>Continue to Next Set</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleResetQuestions}
                    className="py-2.5 px-4 rounded-xl bg-white/[0.02] hover:bg-white/10 text-slate hover:text-paper font-mono text-xs transition-all cursor-pointer"
                  >
                    <span>Reset &amp; Retry Level</span>
                  </button>
                </>
              ) : (
                /* 3+ CONSECUTIVE FAILURES: Locked! Only Contact Team Available */
                <button
                  type="button"
                  onClick={() => setContactModalOpen(true)}
                  className="py-2.5 px-6 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-jakarta font-extrabold text-xs transition-all flex items-center gap-2 shadow-lg shadow-rose-500/25 cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Contact Team Now (Required)</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* SCENARIO 3: Active Question View */
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
                
                {/* Left Column: Concept Reference Note & Code (No timer) */}
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
                          <span>terminal.sh</span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(currentBlock.codeSnippet!, `code-${activeQuestionIdx}`)}
                            className="hover:text-paper cursor-pointer"
                          >
                            {copiedId === `code-${activeQuestionIdx}` ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                        <pre className="p-2 text-xs text-paper overflow-x-auto leading-relaxed max-h-24">
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
                            className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs sm:text-sm font-medium ${
                              showAsCorrect
                                ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-200'
                                : isChosenWrong
                                ? 'bg-rose-500/20 border-rose-500/60 text-rose-200'
                                : isLocked || isTimeUpWaiting
                                ? 'bg-white/[0.02] border-white/5 text-slate/40 cursor-not-allowed'
                                : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/10 text-paper cursor-pointer'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[11px] font-bold border shrink-0 ${
                                showAsCorrect
                                  ? 'bg-emerald-500/30 border-emerald-500 text-emerald-300'
                                  : isChosenWrong
                                  ? 'bg-rose-500/30 border-rose-500 text-rose-300'
                                  : 'bg-white/[0.05] border-white/15 text-slate'
                              }`}>
                                {showAsCorrect ? '✓' : isChosenWrong ? '✗' : opt.id}
                              </span>
                              <span>{opt.text}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Time's Up Banner */}
                    {isTimeUpWaiting && !currentChoice && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-300 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Time's Up!
                          </span>
                          <button
                            type="button"
                            onClick={advanceToNextQuestion}
                            className="py-1 px-3 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-bold cursor-pointer transition-all"
                          >
                            Continue
                          </button>
                        </div>
                        <p className="text-slate text-[11px] leading-relaxed">
                          {currentMcq.explanationNote}
                        </p>
                      </motion.div>
                    )}

                    {/* Answer Feedback Banner */}
                    {isLocked && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-xl border space-y-2 text-xs ${
                          isUserWrongAnswer
                            ? 'bg-rose-500/15 border-rose-500/40 text-rose-200'
                            : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold flex items-center gap-1.5">
                            {isUserWrongAnswer ? (
                              <>
                                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                                <span>Incorrect Answer</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Correct! Well done.</span>
                              </>
                            )}
                          </span>

                          {/* Action Button */}
                          {isUserWrongAnswer ? (
                            <button
                              type="button"
                              onClick={advanceToNextQuestion}
                              className="py-1 px-3 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-bold cursor-pointer transition-all"
                            >
                              Continue
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={advanceToNextQuestion}
                              className="py-1 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-ink font-bold cursor-pointer transition-all flex items-center gap-1"
                            >
                              <span>Next Question</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        <p className="text-slate text-[11px] leading-relaxed">
                          {currentMcq.explanationNote}
                        </p>
                      </motion.div>
                    )}

                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </main>

      {/* Contact Modal */}
      <NeedHelpModal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
        courseTitle="Cyber Security Course"
        courseId="cyber-security"
      />

      {/* 2nd Consecutive Failure Disclaimer Modal */}
      {disclaimerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-panel border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 text-center shadow-2xl relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300 font-mono text-xs font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Warning: Consecutive Failure</span>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-jakarta text-xl font-black text-paper">
                Proceeding to Next Set
              </h3>
              <p className="text-slate text-xs leading-relaxed">
                You have failed this level twice. You have 1 warning remaining. If you fail the next level twice, your course progression will be locked.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setDisclaimerModalOpen(false);
                  handleProceedToNextLevel();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-ink font-jakarta font-extrabold text-xs transition-all cursor-pointer shadow-md shadow-amber-400/20"
              >
                I Understand, Continue to Next Level
              </button>

              <button
                type="button"
                onClick={() => setDisclaimerModalOpen(false)}
                className="w-full py-2 px-4 rounded-xl bg-white/[0.04] hover:bg-white/10 text-slate hover:text-paper font-mono text-xs transition-all cursor-pointer"
              >
                Cancel &amp; Retry Level
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Part 2 Modal when student completes all Part 1 levels */}
      {part2ModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-panel border border-emerald-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 text-center shadow-2xl relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 font-mono text-xs font-bold">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Part 1 Certified (&gt; 80% Scored)</span>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-jakarta text-xl sm:text-2xl font-black text-paper">
                Part 2: Enterprise Architecture, Governance &amp; Policies
              </h3>
              <p className="text-slate text-xs sm:text-sm leading-relaxed">
                You have passed all levels from 1.1 through 1.5! The interactive lab exercises and assessments for Part 2 are now unlocked.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setPart2ModalOpen(false);
                  navigate('/course/cyber-security/part-2');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all cursor-pointer shadow-md shadow-primary/20 flex items-center justify-center gap-1.5"
              >
                <span>Start Part 2: Enterprise Architecture &amp; Defense</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setPart2ModalOpen(false)}
                className="w-full py-2 px-4 rounded-xl bg-white/[0.04] hover:bg-white/10 text-slate hover:text-paper font-mono text-xs transition-all cursor-pointer"
              >
                Review Part 1 Notes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
