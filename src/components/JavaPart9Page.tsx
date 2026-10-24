import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Terminal, Clock, ArrowRight, Trophy, RotateCcw,
  CheckCircle2, AlertCircle, Shuffle, Check, AlertTriangle, ShieldAlert, Sparkles } from 'lucide-react';
import { JavaCompilerLauncherButton, JavaCompilerModal, JavaTaskContext } from './compiler/JavaCompilerModal';
import { useCoursePoints } from '../context/CoursePointsContext';
import { useUserAuth } from '../context/UserAuthContext';
import { ContactModal } from './ContactModal';
import { NeedHelpModal } from './NeedHelpModal';
import { 
  PART_9_SECTIONS, TheoryBlock, McqQuestion,
  getActiveQuestionsForLevelPart9, getConsecutiveFailedLevelsPart9,
  recordLevelAttemptResultPart9, resetConsecutiveFailuresPart9,
  setLevelAttemptCountPart9
} from '../data/javaPart9Data';

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

export const JavaPart9Page: React.FC = () => {
  const navigate = useNavigate();
  const { points, isTaskSolved, awardPoint, recordWrongAttempt, resetProgress } = useCoursePoints();
  const { user } = useUserAuth();

  const studentId = user?.id || user?.email || 'default_student';

  const [activeSectionId, setActiveSectionId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('dopilot_java_part9_active_section_id');
      return saved || '9-1-class-inheritance';
    } catch {
      return '9-1-class-inheritance';
    }
  });

  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('dopilot_java_part9_active_q_idx');
      return saved !== null ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  const activeSection = PART_9_SECTIONS.find(s => s.id === activeSectionId) || PART_9_SECTIONS[0];
  const activeIdx = PART_9_SECTIONS.findIndex(s => s.id === activeSection.id);

  const [levelQuestions, setLevelQuestions] = useState<McqQuestion[]>(() => {
    return getActiveQuestionsForLevelPart9(activeSection, studentId, false);
  });

  const [levelResult, setLevelResult] = useState<LevelResultState | null>(() => {
    try {
      const saved = localStorage.getItem('dopilot_java_part9_level_result');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [consecutiveFailures, setConsecutiveFailures] = useState<number>(() => {
    return getConsecutiveFailedLevelsPart9(studentId);
  });

  const [disclaimerModalOpen, setDisclaimerModalOpen] = useState(false);
  const [disclaimerConfirmed, setDisclaimerConfirmed] = useState(false);

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('dopilot_java_part9_mcq_answers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const prevSectionIdRef = useRef(activeSectionId);
  useEffect(() => {
    const qList = getActiveQuestionsForLevelPart9(activeSection, studentId, false);
    setLevelQuestions(qList);
    if (prevSectionIdRef.current !== activeSectionId) {
      prevSectionIdRef.current = activeSectionId;
      setLevelResult(null);
      try {
        localStorage.removeItem('dopilot_java_part9_level_result');
      } catch {}
    }
  }, [activeSectionId, studentId]);

  const currentBlock: TheoryBlock = activeSection.theoryBlocks[activeQuestionIdx] || activeSection.theoryBlocks[0];
  const currentMcq: McqQuestion = levelQuestions[activeQuestionIdx] || currentBlock.mcq!;
  const taskId = `java-part9-${activeSection.id}-${currentMcq.id || activeQuestionIdx}`;

  const [isStudyPhase, setIsStudyPhase] = useState<boolean>(() => {
    try {
      const answers = JSON.parse(localStorage.getItem('dopilot_java_part9_mcq_answers') || '{}');
      if (answers[taskId]) return false;
      const savedPhase = localStorage.getItem('dopilot_java_part9_study_phase');
      if (savedPhase !== null) return savedPhase === 'true';
    } catch {}
    return true;
  });

  const [targetEndTime, setTargetEndTime] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('dopilot_java_part9_q_target_end_time');
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

  const [isTimeUpWaiting, setIsTimeUpWaiting] = useState<boolean>(() => {
    try {
      if (levelResult?.isFinished) return false;
      if (localStorage.getItem('dopilot_java_part9_time_up') === 'true') return true;
      const savedPhase = localStorage.getItem('dopilot_java_part9_study_phase');
      if (savedPhase === 'true') return false;
      const savedEnd = Number(localStorage.getItem('dopilot_java_part9_q_target_end_time'));
      const answers = JSON.parse(localStorage.getItem('dopilot_java_part9_mcq_answers') || '{}');
      if (savedEnd && savedEnd <= Date.now() && !answers[taskId]) {
        return true;
      }
    } catch {}
    return false;
  });

  const [isCourseComplete, setIsCourseComplete] = useState<boolean>(() => {
    try {
      return localStorage.getItem('dopilot_java_part9_completed') === 'true';
    } catch {
      return false;
    }
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [part10ModalOpen, setPart10ModalOpen] = useState(false);
  const [compilerModalOpen, setCompilerModalOpen] = useState(false);
  const [, setActiveTask] = useState<JavaTaskContext | null>(null);

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

  const totalLevelQuestions = activeSection.theoryBlocks.length;
  const currentLevelQuestionNumber = activeQuestionIdx + 1;
  const remainingLevelQuestions = Math.max(0, totalLevelQuestions - currentLevelQuestionNumber);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = `Part 9 • Level ${activeSection.number}: ${activeSection.title} — DO PILOT Java`;
    try {
      localStorage.setItem('dopilot_java_core_last_part', '6');
    } catch {}
  }, [activeSectionId, activeQuestionIdx]);

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

  const handleStartQuestion = () => {
    setIsStudyPhase(false);
    setIsTimeUpWaiting(false);
    const freshEnd = Date.now() + TIMER_DURATION * 1000;
    setTargetEndTime(freshEnd);
    setTimeLeft(TIMER_DURATION);
    try {
      localStorage.setItem('dopilot_java_part9_study_phase', 'false');
      localStorage.setItem('dopilot_java_part9_q_target_end_time', String(freshEnd));
      localStorage.removeItem('dopilot_java_part9_time_up');
      localStorage.removeItem('dopilot_java_part9_level_result');
    } catch (e) {
      console.error(e);
    }
  };

  const evaluateLevelScore = () => {
    const qList = stateRef.current.levelQuestions;
    const secId = stateRef.current.activeSectionId;
    const currentAnswers = stateRef.current.selectedAnswers;

    let correctCount = 0;
    const totalCount = qList.length;

    qList.forEach((q, idx) => {
      const qTaskId = `java-part9-${secId}-${q.id || idx}`;
      const chosen = currentAnswers[qTaskId];
      if (chosen === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const percentage = Math.round((correctCount / totalCount) * 100);
    const isPassed = percentage > 80;

    const result = recordLevelAttemptResultPart9(activeSection.id, studentId, isPassed);
    setConsecutiveFailures(result.consecutiveFailedLevels);

    const resultState = {
      isFinished: true,
      isPassed,
      correctCount,
      totalCount,
      percentage,
      streak: result.consecutiveFailedLevels,
      attemptCount: result.attemptCount,
      isSecondFailureInLevel: result.isSecondFailureInLevel,
      isLocked: result.isLocked
    };
    setLevelResult(resultState);
    try {
      localStorage.setItem('dopilot_java_part9_level_result', JSON.stringify(resultState));
    } catch {}
  };

  const advanceToNextQuestion = () => {
    setCorrectCountdown(null);
    setIsTimeUpWaiting(false);
    setIsStudyPhase(true);
    try {
      localStorage.setItem('dopilot_java_part9_study_phase', 'true');
    } catch {}

    const { activeQuestionIdx: qIdx, levelQuestions: qList } = stateRef.current;
    const nextQ = qIdx + 1;

    if (nextQ < qList.length) {
      setActiveQuestionIdx(nextQ);
      setTimeLeft(TIMER_DURATION);
      try {
        localStorage.setItem('dopilot_java_part9_active_q_idx', String(nextQ));
      } catch (e) {
        console.error(e);
      }
    } else {
      evaluateLevelScore();
    }
  };

  const handleResetQuestions = () => {
    const newQuestions = getActiveQuestionsForLevelPart9(activeSection, studentId, true);
    setLevelQuestions(newQuestions);

    const updatedAnswers = { ...selectedAnswers };
    newQuestions.forEach((q, idx) => {
      const oldTaskId = `java-part9-${activeSection.id}-${q.id || idx}`;
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
      localStorage.setItem('dopilot_java_part9_mcq_answers', JSON.stringify(updatedAnswers));
      localStorage.setItem('dopilot_java_part9_active_q_idx', '0');
      localStorage.setItem('dopilot_java_part9_study_phase', 'true');
      localStorage.setItem('dopilot_java_part9_q_target_end_time', String(fresh));
      localStorage.removeItem('dopilot_java_part9_time_up');
      localStorage.removeItem('dopilot_java_part9_level_result');
    } catch (e) {
      console.error(e);
    }
  };

  const handleProceedToNextLevel = () => {
    if (localStorage.getItem(`dopilot_java_part9_locked_${studentId}`) === 'true') {
      setModalOpen(true);
      return;
    }

    const nextSecIdx = activeIdx + 1;
    if (nextSecIdx < PART_9_SECTIONS.length) {
      const nextSec = PART_9_SECTIONS[nextSecIdx];
      setActiveSectionId(nextSec.id);
      setActiveQuestionIdx(0);
      setLevelResult(null);
      setIsStudyPhase(true);
      setIsTimeUpWaiting(false);
      setTimeLeft(TIMER_DURATION);
      const fresh = Date.now() + TIMER_DURATION * 1000;
      setTargetEndTime(fresh);

      setLevelAttemptCountPart9(nextSec.id, studentId, 1);

      const nextQuestions = getActiveQuestionsForLevelPart9(nextSec, studentId, false);
      setLevelQuestions(nextQuestions);

      try {
        localStorage.setItem('dopilot_java_part9_active_section_id', nextSec.id);
        localStorage.setItem('dopilot_java_part9_active_q_idx', '0');
        localStorage.setItem('dopilot_java_part9_study_phase', 'true');
        localStorage.setItem('dopilot_java_part9_q_target_end_time', String(fresh));
        localStorage.removeItem('dopilot_java_part9_time_up');
      localStorage.removeItem('dopilot_java_part9_level_result');
      } catch (e) {
        console.error(e);
      }
    } else {
      setIsCourseComplete(true);
      try {
        localStorage.setItem('dopilot_java_part9_completed', 'true');
      } catch {}
    }
  };

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
            localStorage.setItem('dopilot_java_part9_time_up', 'true');
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
      localStorage.setItem('dopilot_java_part9_mcq_answers', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    if (isCorrect) {
      const isRetestAttempt = (() => {
        try {
          const raw = localStorage.getItem(`dopilot_java_part9_attempt_${studentId}_${activeSection.id}`);
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
        `Part 9 • ${activeSection.title}`,
        `Selected Option ${optId}: "${chosenOpt?.text || ''}". Correct was Option ${currentMcq.correctAnswer}.`
      );
    }
  };

  const handleResetAll = () => {
    if (!window.confirm("Reset your Java Part 9 progress and begin from Level 6.1?")) {
      return;
    }
    resetProgress();
    resetConsecutiveFailuresPart9(studentId);
    setConsecutiveFailures(0);
    setActiveSectionId(PART_9_SECTIONS[0].id);
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
      localStorage.removeItem('dopilot_java_part9_mcq_answers');
      localStorage.removeItem('dopilot_java_part9_active_section_id');
      localStorage.removeItem('dopilot_java_part9_active_q_idx');
      localStorage.removeItem('dopilot_java_part9_completed');
      localStorage.removeItem('dopilot_java_part9_time_up');
      localStorage.removeItem('dopilot_java_part9_level_result');
      localStorage.removeItem('dopilot_java_part9_study_phase');
      localStorage.removeItem('dopilot_java_part9_q_target_end_time');
      localStorage.removeItem(`dopilot_java_part9_locked_${studentId}`);
    } catch (e) {
      console.error(e);
    }
  };

  const isSolved = isTaskSolved(taskId);
  const currentChoice = selectedAnswers[taskId];
  const isLocked = Boolean(isSolved);
  const isUserWrongAnswer = Boolean(currentChoice && currentChoice !== currentMcq.correctAnswer);

  return (
    <div className="min-h-screen bg-black text-paper selection:bg-primary selection:text-ink relative overflow-x-hidden font-sans flex flex-col">
      
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[250px] bg-emerald-500/10 blur-[160px] pointer-events-none rounded-full" />

      {/* Floating Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/course/complete-java-programming')}
            className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/10 text-white hover:text-white font-mono text-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Overview</span>
          </button>

          
        </div>

        {/* Level Selector Pills */}
        <div className="hidden lg:flex items-center gap-1.5 bg-white/[0.02] border border-white/5 p-1 rounded-full">
          {PART_9_SECTIONS.map((sec) => {
            const isCur = sec.id === activeSection.id;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  if (sec.id === activeSection.id) return;
                  setActiveSectionId(sec.id);
                  setActiveQuestionIdx(0);
                  setIsStudyPhase(true);
                  setIsTimeUpWaiting(false);
                  setLevelResult(null);
                  setCorrectCountdown(null);
                  const fresh = Date.now() + TIMER_DURATION * 1000;
                  setTargetEndTime(fresh);
                  setTimeLeft(TIMER_DURATION);
                  try {
                    localStorage.setItem('dopilot_java_part9_active_section_id', sec.id);
                    localStorage.setItem('dopilot_java_part9_active_q_idx', '0');
                    localStorage.setItem('dopilot_java_part9_study_phase', 'true');
                    localStorage.setItem('dopilot_java_part9_q_target_end_time', String(fresh));
                    localStorage.removeItem('dopilot_java_part9_time_up');
      localStorage.removeItem('dopilot_java_part9_level_result');
                  } catch {}
                }}
                className={`px-3 py-1 rounded-full font-mono text-xs transition-all cursor-pointer ${
                  isCur
                    ? 'bg-primary text-ink font-bold shadow-md shadow-primary/20'
                    : 'text-slate hover:text-paper hover:bg-white/5'
                }`}
              >
                {sec.number}
              </button>
            );
          })}
        </div>

        {/* Header Right Stats & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {consecutiveFailures > 0 && (
            <span className={`px-2.5 py-0.5 rounded-full font-mono text-xs font-bold border flex items-center gap-1.5 ${
              consecutiveFailures >= 2
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
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
        
        {/* SCENARIO 1: Entire Part 9 Course Completed */}
        {isCourseComplete ? (
          <div className="bg-panel/95 border border-white/10 rounded-3xl p-6 sm:p-10 max-w-2xl w-full text-center space-y-6 shadow-2xl my-6 backdrop-blur-xl animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-primary to-emerald-400" />

            <div className="flex items-center justify-center pt-2">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider border bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Part 9 Fully Certified</span>
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="font-jakarta text-2xl sm:text-3xl font-black text-paper tracking-tight">
                Part 9 Complete! 🎉
              </h2>
              <p className="text-slate text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                You have passed all 3 modules of Helsinki MOOC Java Part 9! You've mastered containing collections on objects, architecting separated User Interfaces, command loops, and automated unit testing with assertions.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setPart10ModalOpen(true)}
                className="py-2.5 px-6 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all flex items-center gap-2 shadow-lg shadow-primary/25 cursor-pointer"
              >
                <span>Continue to Part 10</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/course/complete-java-programming')}
                className="py-2.5 px-5 rounded-xl bg-white/[0.06] hover:bg-white/15 border border-white/15 text-paper font-jakarta font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Back to Dashboard</span>
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
                  ? 'You have reached 3 consecutive failed levels. Progression is locked. Please reach out to our team to review your concepts and unlock further levels.'
                  : levelResult.isSecondFailureInLevel
                  ? levelResult.streak === 1
                    ? 'You have failed Level 6.1 twice. You have 2 more warnings remaining before course progression is locked.'
                    : 'Warning: You failed Level 6.2 twice. Only 1 more warning remaining! If you fail the next level twice, your course progression will be completely locked.'
                  : 'Your score was 80% or below. The passing requirement is more than 80%. Click "Reset Questions" to receive a completely new set of questions testing the same concepts with no duplicates.'}
              </p>
            </div>

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
              ) : !levelResult.isSecondFailureInLevel ? (
                <button
                  type="button"
                  onClick={handleResetQuestions}
                  className="py-2.5 px-6 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all flex items-center gap-2 shadow-lg shadow-primary/25 cursor-pointer"
                >
                  <Shuffle className="w-4 h-4" />
                  <span>Reset Questions</span>
                </button>
              ) : !levelResult.isLocked ? (
                <>
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
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
                    className="py-2.5 px-4 rounded-xl bg-white/[0.02] hover:bg-white/10 text-white hover:text-white font-mono text-xs transition-all cursor-pointer"
                  >
                    <span>Reset &amp; Retry Level</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
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
            <div className="bg-panel/90 border border-white/10 rounded-2xl p-5 sm:p-7 space-y-5 shadow-2xl relative w-full">
              
              <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-white/10">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="font-mono text-xs font-bold text-primary uppercase tracking-wide">
                    Level {activeSection.number} • Question {currentLevelQuestionNumber} of {totalLevelQuestions}
                  </span>
                </div>

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
                        : 'bg-white/[0.04] border-white/10 text-white'
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

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Column: Concept Reference Note & Code */}
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
                          <span>Main.java</span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(currentBlock.codeSnippet!, `code-part9-${activeQuestionIdx}`)}
                            className="text-white hover:text-white cursor-pointer"
                          >
                            {copiedId === `code-part9-${activeQuestionIdx}` ? 'Copied' : 'Copy'}
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

                    {currentBlock.tip && (
                      <div className="p-2.5 rounded-lg bg-amber-400/[0.06] border border-amber-400/20 text-xs text-amber-300 leading-snug">
                        <strong>Tip: </strong>{currentBlock.tip}
                      </div>
                    )}
                    {currentBlock.warning && (
                      <div className="p-2 rounded-lg bg-rose-500/[0.06] border border-rose-500/20 text-[11px] text-rose-300 leading-snug">
                        <strong>Note: </strong>{currentBlock.warning}
                      </div>
                    )}
                  </div>

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
                                  localStorage.removeItem('dopilot_java_part9_time_up');
      localStorage.removeItem('dopilot_java_part9_level_result');
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

      <JavaCompilerModal
        isOpen={compilerModalOpen}
        onClose={() => setCompilerModalOpen(false)}
        activeTask={null}
      />

      <NeedHelpModal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
        courseTitle="Complete Java Course"
        courseId="complete-java-programming"
      />

      {disclaimerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-panel border border-amber-400/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center gap-2.5 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>
                {levelResult?.streak === 1
                  ? 'Progression Notice — Disclaimer 1 of 2'
                  : 'Final Warning Notice — Disclaimer 2 of 2'}
              </span>
            </div>

            <div className="space-y-2 text-left">
              <h3 className="font-jakarta text-xl sm:text-2xl font-black text-paper">
                {levelResult?.streak === 1
                  ? `Warning: Level ${activeSection.number} Failed Twice`
                  : `Critical Warning: Level ${activeSection.number} Failed Twice`}
              </h3>
              <p className="text-amber-300 font-medium text-xs sm:text-sm leading-relaxed">
                {levelResult?.streak === 1
                  ? 'Warning: You failed Level 6.1 twice. You have 2 more warnings remaining before course progression is locked.'
                  : 'Warning: You failed Level 6.2 twice. Only 1 more warning remaining! If you fail the next level twice, your course progression will be completely locked.'}
              </p>
              <p className="text-slate text-xs leading-relaxed pt-1">
                {levelResult?.streak === 1
                  ? 'You are allowed to continue to the next level. However, if you continue to fail consecutive levels, you will receive only 1 more warning before your course progression is locked until support intervention.'
                  : 'This is your final warning before course lockdown. You are permitted to advance to the next level, but failing again will require mandatory contact with our support team to unlock progression.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/25 flex items-start gap-2.5 text-left">
              <input
                type="checkbox"
                id="disclaimer-check-java-part9"
                checked={disclaimerConfirmed}
                onChange={(e) => setDisclaimerConfirmed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-white/20 text-primary accent-primary cursor-pointer"
              />
              <label htmlFor="disclaimer-check-java-part9" className="text-xs text-amber-200 cursor-pointer select-none">
                {levelResult?.streak === 1
                  ? 'I understand that after 2 more level failures my course will be locked, and I confirm to continue.'
                  : 'I understand that after 1 more level failure my course will be locked, and I confirm to continue.'}
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                disabled={!disclaimerConfirmed}
                onClick={() => {
                  setDisclaimerModalOpen(false);
                  setDisclaimerConfirmed(false);
                  handleProceedToNextLevel();
                }}
                className={`flex-1 py-2.5 px-4 rounded-xl font-jakarta font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 ${
                  disclaimerConfirmed
                    ? 'bg-primary hover:bg-white text-ink cursor-pointer shadow-md shadow-primary/20'
                    : 'bg-white/10 text-slate/40 cursor-not-allowed'
                }`}
              >
                <span>Confirm &amp; Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setDisclaimerModalOpen(false);
                  setDisclaimerConfirmed(false);
                }}
                className="py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/10 text-white hover:text-white font-mono text-xs transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Part 10 Modal when student completes all Part 9 levels */}
      {part10ModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-panel border border-emerald-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 text-center shadow-2xl relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 font-mono text-xs font-bold">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Part 9 Certified (&gt; 80% Scored)</span>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-jakarta text-xl sm:text-2xl font-black text-paper">
                Part 9 Mastered 🎉
              </h3>
              <p className="text-slate text-xs sm:text-sm leading-relaxed">
                You have passed all levels of Helsinki MOOC Java Part 9! You have mastered class inheritance, abstract classes, interfaces, polymorphism, and dynamic method dispatch.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setPart10ModalOpen(false);
                  navigate('/course/complete-java-programming/part-10');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all cursor-pointer shadow-md shadow-primary/20 flex items-center justify-center gap-1.5"
              >
                <span>Continue to Part 10 (Interactive)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setPart10ModalOpen(false);
                  navigate('/course/complete-java-programming');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/10 text-paper font-jakarta font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Return to Course Dashboard</span>
              </button>


            </div>
          </div>
        </div>
      )}

    </div>
  );
};
