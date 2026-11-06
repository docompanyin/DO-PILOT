import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, BookOpen, Clock, ArrowRight, Trophy, RotateCcw,
  CheckCircle2, AlertCircle, Shuffle, Sparkles, AlertTriangle, ShieldAlert, ShoppingBag
} from 'lucide-react';
import { logQuestionAttempt } from '../utils/studentTelemetryService';
import { useCourseUnlockedListener } from '../utils/courseResetService';
import { notifyCourseLocked } from '../utils/lockNotificationService';
import { CoursePurchaseModal } from './checkout/CoursePurchaseModal';
import { 
  markSectionStartedInTrial, isSectionExemptFromRetest, 
  isPart1Finished, recordPart1SectionScore, getPart1OverallScore, setPostPurchaseDecision 
} from '../utils/part1ScoreService';
import { FullstackCompilerLauncherButton, FullstackWebModal, FullstackTaskContext } from './compiler/FullstackWebModal';
import { useCoursePoints } from '../context/CoursePointsContext';
import { getSavedCertificate } from '../utils/certificateGenerator';
import { useUserAuth } from '../context/UserAuthContext';
import { ContactModal } from './ContactModal';
import { NeedHelpModal } from './NeedHelpModal';
import { hasCourseAccess, getCoursePricing, CoursePricing } from '../utils/coursePricingService';
import { useCourseQuestionResume, getCourseStorageKeys, saveQuestionProgressState, memoryCourseState, saveCoursePartCompletion } from '../utils/courseProgressSyncService';
import { 
  FULLSTACK_PART_0_SECTIONS, TheoryBlock, McqQuestion,
  getActiveQuestionsForLevelFullstackPart0, getConsecutiveFailedLevelsFullstackPart0,
  recordLevelAttemptResultFullstackPart0, resetConsecutiveFailuresFullstackPart0,
  setLevelAttemptCountFullstackPart0
} from '../data/fullstackPart0Data';
import { playTwinkleSound } from '../utils/audioEffects';

const TIMER_DURATION = 30; // 30 seconds

interface LevelResultState {
  isFinished: boolean;
  sectionId?: string;
  isPassed: boolean;
  correctCount: number;
  totalCount: number;
  percentage: number;
  streak: number;
  attemptCount: number;
  isSecondFailureInLevel: boolean;
  isLocked: boolean;
}

export const FullstackPart0Page: React.FC = () => {
  const navigate = useNavigate();
  const { points, isTaskSolved, awardPoint, recordWrongAttempt, resetProgress } = useCoursePoints();
  const { user } = useUserAuth();

  const studentId = user?.id || user?.email || 'default_student';
  const [searchParams] = useSearchParams();
  const isReviewMode = searchParams.get('review') === 'true' && Boolean(getSavedCertificate('fullstack-open'));

  // Course access & pricing state
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

  // Persistent Active Section ID (Defaults to Section 0.1)
  const [activeSectionId, setActiveSectionId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('dopilot_fullstack_part0_active_section_id');
      return saved || '0-1-http-protocol';
    } catch {
      return '0-1-http-protocol';
    }
  });

  // Persistent Question Index
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('dopilot_fullstack_part0_active_q_idx');
      return saved !== null ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  const activeSection = FULLSTACK_PART_0_SECTIONS.find(s => s.id === activeSectionId) || FULLSTACK_PART_0_SECTIONS[0];
  const activeIdx = FULLSTACK_PART_0_SECTIONS.findIndex(s => s.id === activeSection.id);

  // Active question set for current level with question duplicate prevention
  const [levelQuestions, setLevelQuestions] = useState<McqQuestion[]>(() => {
    return getActiveQuestionsForLevelFullstackPart0(activeSection, studentId, false);
  });

  // Track level failure / pass outcome state
  const [levelResult, setLevelResult] = useState<LevelResultState | null>(() => {
    try {
      const saved = localStorage.getItem('dopilot_fullstack_part0_level_result');
      if (saved) {
        const parsed = JSON.parse(saved);
        const curSec = localStorage.getItem('dopilot_fullstack_part0_active_section_id');
        if (parsed?.isFinished && (!parsed.sectionId || !curSec || parsed.sectionId === curSec)) {
          return parsed;
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  // Consecutive failure counter (loaded dynamically from student record)
  const [consecutiveFailures, setConsecutiveFailures] = useState<number>(() => {
    return getConsecutiveFailedLevelsFullstackPart0(studentId);
  });

  // Disclaimer popup state when choosing "Continue to Next Set" on 2nd consecutive failure
  const [disclaimerModalOpen, setDisclaimerModalOpen] = useState(false);
  const [disclaimerConfirmed, setDisclaimerConfirmed] = useState(false);

  // Persistent MCQ selected answers
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('dopilot_fullstack_part0_mcq_answers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Update questions whenever active level changes
  const prevSectionIdRef = useRef(activeSectionId);
  useEffect(() => {
    const qList = getActiveQuestionsForLevelFullstackPart0(activeSection, studentId, false);
    setLevelQuestions(qList);
    if (prevSectionIdRef.current !== activeSectionId) {
      prevSectionIdRef.current = activeSectionId;
      setLevelResult(null);
      try {
        localStorage.removeItem('dopilot_fullstack_part0_level_result');
      } catch {}
    }
  }, [activeSectionId, studentId]);

  const currentBlock: TheoryBlock = activeSection.theoryBlocks[activeQuestionIdx] || activeSection.theoryBlocks[0];
  const currentMcq: McqQuestion = levelQuestions[activeQuestionIdx] || currentBlock.mcq!;
  const taskId = `fullstack-0-${activeSection.id}-${currentMcq.id || activeQuestionIdx}`;


  // Whether user is currently in Study Phase (reading note with no timer pressure) or Question Phase (30s timer)
  const [isStudyPhase, setIsStudyPhase] = useState<boolean>(() => {
    if (isReviewMode) return false;
    try {
      const answers = JSON.parse(localStorage.getItem('dopilot_fullstack_part0_mcq_answers') || '{}');
      if (answers[taskId]) return false; // Already answered
      const savedPhase = localStorage.getItem('dopilot_fullstack_part0_study_phase');
      if (savedPhase !== null) return savedPhase === 'true';
    } catch {}
    return true; // Read note first by default
  });

  // Target End Timestamp for the 30-second question timer
  const [targetEndTime, setTargetEndTime] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('dopilot_fullstack_part0_q_target_end_time');
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
      if (localStorage.getItem('dopilot_fullstack_part0_time_up') === 'true') return true;
      const savedPhase = localStorage.getItem('dopilot_fullstack_part0_study_phase');
      if (savedPhase === 'true') return false;
      const savedEnd = Number(localStorage.getItem('dopilot_fullstack_part0_q_target_end_time'));
      const answers = JSON.parse(localStorage.getItem('dopilot_fullstack_part0_mcq_answers') || '{}');
      if (savedEnd && savedEnd <= Date.now() && !answers[taskId]) {
        return true;
      }
    } catch {}
    return false;
  });

  const [isCourseComplete, setIsCourseComplete] = useState<boolean>(() => {
    try {
      return localStorage.getItem('dopilot_fullstack_part0_completed') === 'true' ||
             localStorage.getItem('dopilot_fullstack_part0_finished') === 'true';
    } catch {
      return false;
    }
  });

  // Track section started under free trial to ensure Scenario 3 exemption if purchased mid-section
  useEffect(() => {
    if (!hasPurchased && activeSection?.id) {
      markSectionStartedInTrial('fullstack-open', activeSection.id, studentId);
    }
  }, [hasPurchased, activeSection?.id, studentId]);

  // Scenario 1: Preserved Part 0 completion. Post-purchase navigates directly to Course Details.

  useCourseUnlockedListener({
    partNum: 0,
    studentId,
    studentEmail: user?.email,
    courseId: 'fullstack-open',
    setLevelResult,
    setConsecutiveFailures,
    setActiveSectionId,
    setActiveQuestionIdx,
    setIsStudyPhase
  });

  // Track whether initial mount state has been hydrated from cloud/local storage
  const hasHydratedRef = useRef<boolean>(false);
  useEffect(() => {
    try {
      const email = user?.email?.toLowerCase().trim();
      const memPart = email ? memoryCourseState[email]?.courses?.['fullstack-open']?.parts?.['0'] : null;
      if (memPart && (memPart.activeQuestionIdx > 0 || Object.keys(memPart.selectedAnswers || {}).length > 0)) {
        hasHydratedRef.current = true;
      } else if (localStorage.getItem('dopilot_fullstack_part0_active_q_idx') !== null) {
        hasHydratedRef.current = true;
      }
    } catch {}
  }, [user?.email]);

  // Auto-checkpoint active location & notes phase to Supabase once hydrated
  useEffect(() => {
    if (hasHydratedRef.current && user?.email && !levelResult?.isFinished && !isCourseComplete) {
      saveQuestionProgressState({
        courseId: 'fullstack-open',
        partNum: 0,
        activeSectionId,
        activeQuestionIdx,
        selectedAnswers,
        isStudyPhase,
        isTimeUpWaiting,
        targetEndTime,
        timeLeft,
        studentEmail: user?.email,
        levelResult: null
      });
    }
  }, [activeSectionId, activeQuestionIdx, isStudyPhase, user?.email]);

  useCourseQuestionResume({
    courseId: 'fullstack-open',
    partNum: 0,
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
    validSectionIds: FULLSTACK_PART_0_SECTIONS.map(s => s.id),
    levelResult,
    setLevelResult,
    setIsCourseComplete: (complete: boolean) => setIsCourseComplete(complete),
    onHydrated: () => {
      hasHydratedRef.current = true;
    }
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [part1ModalOpen, setPart1ModalOpen] = useState(false);
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
    document.title = `Do Pilot - ${activeSection.title}`;
    try {
      localStorage.setItem('dopilot_fullstack_core_last_part', '0');
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
  const handleStartQuestion = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsStudyPhase(false);
    setIsTimeUpWaiting(false);
    const freshEnd = Date.now() + TIMER_DURATION * 1000;
    setTargetEndTime(freshEnd);
    setTimeLeft(TIMER_DURATION);
    try {
      localStorage.setItem('dopilot_fullstack_part0_study_phase', 'false');
      localStorage.setItem('dopilot_fullstack_part0_q_target_end_time', String(freshEnd));
      localStorage.removeItem('dopilot_fullstack_part0_time_up');
      localStorage.removeItem('dopilot_fullstack_part0_level_result');
    } catch (e) {
      console.error(e);
    }

    saveQuestionProgressState({
      courseId: 'fullstack-open',
      partNum: 0,
      activeSectionId: activeSection.id,
      activeQuestionIdx,
      selectedAnswers,
      isStudyPhase: false,
      isTimeUpWaiting: false,
      targetEndTime: freshEnd,
      timeLeft: TIMER_DURATION,
      studentEmail: user?.email,
      levelResult: null
    });
  };

  // Evaluate Level Score after the 6 compulsory questions in a level
  const evaluateLevelScore = () => {
    const qList = stateRef.current.levelQuestions;
    const secId = stateRef.current.activeSectionId;
    const currentAnswers = stateRef.current.selectedAnswers;

    let correctCount = 0;
    const totalCount = qList.length;

    qList.forEach((q, idx) => {
      const qTaskId = `fullstack-0-${secId}-${q.id || idx}`;
      const chosen = currentAnswers[qTaskId];
      if (chosen === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const percentage = Math.round((correctCount / totalCount) * 100);
    // Passing score rule: MORE than 80% (i.e. > 80%, so 5 or 6 out of 6 correct)
    const isPassed = percentage > 80;

    if (isPassed) {
      playTwinkleSound();
    }

    // Record section score for overall score calculation
    recordPart1SectionScore('fullstack-open', activeSection.id, correctCount, totalCount, studentId);

    const isFinalSection = activeIdx === FULLSTACK_PART_0_SECTIONS.length - 1;
    if (isFinalSection) {
      try {
        localStorage.setItem('dopilot_fullstack_part0_finished', 'true');
        localStorage.setItem('dopilot_fullstack_part0_completed', 'true');
        localStorage.setItem('dopilot_fullstack_core_last_part', '1');
      } catch {}
    }

    // Retest & consecutive failures exemption check
    const isExempt = !hasPurchased || isSectionExemptFromRetest('fullstack-open', activeSection.id, studentId);

    let streak = 0;
    let attemptCount = 1;
    let isSecondFailureInLevel = false;
    let isLocked = false;

    if (hasPurchased && !isExempt) {
      const result = recordLevelAttemptResultFullstackPart0(activeSection.id, studentId, isPassed);
      streak = result.consecutiveFailedLevels;
      attemptCount = result.attemptCount;
      isSecondFailureInLevel = result.isSecondFailureInLevel;
      isLocked = result.isLocked;
      setConsecutiveFailures(result.consecutiveFailedLevels);
      if (result.isLocked) {
        notifyCourseLocked({
          courseId: 'fullstack-open',
          courseName: 'Full Stack Open',
          partNum: 0,
          sectionId: activeSection.id,
          sectionTitle: `Level ${activeSection.number} — ${activeSection.title}`,
          activeQuestionIdx,
          totalQuestions: totalCount,
          score: correctCount,
          percentage,
          streak: result.consecutiveFailedLevels,
          attemptCount: result.attemptCount,
          studentId,
          studentEmail: user?.email,
          studentName: user?.name,
          studentPhone: user?.phone,
          collegeOrCompany: user?.collegeOrCompany,
          earnedPoints: points
        });
      }
    } else {
      setConsecutiveFailures(0);
    }

    const resultState: LevelResultState = {
      isFinished: true,
      sectionId: activeSection.id,
      isPassed,
      correctCount,
      totalCount,
      percentage,
      streak,
      attemptCount,
      isSecondFailureInLevel,
      isLocked
    };
    setLevelResult(resultState);
    try {
      localStorage.setItem('dopilot_fullstack_part0_level_result', JSON.stringify(resultState));
      if (isFinalSection) {
        localStorage.setItem(`dopilot_fullstack_part0_final_exam_result_${studentId}`, JSON.stringify(resultState));
        localStorage.setItem('dopilot_fullstack_part0_final_exam_result', JSON.stringify(resultState));
      }
    } catch {}

    saveQuestionProgressState({
      courseId: 'fullstack-open',
      partNum: 0,
      activeSectionId: activeSection.id,
      activeQuestionIdx,
      selectedAnswers: currentAnswers,
      isStudyPhase: false,
      isTimeUpWaiting: false,
      targetEndTime,
      timeLeft,
      studentEmail: user?.email,
      levelResult: resultState
    });
  };

  // Advance function to go to next question or complete level
  const advanceToNextQuestion = () => {
    setCorrectCountdown(null);
    setIsTimeUpWaiting(false);
    setIsStudyPhase(true);
    try {
      localStorage.setItem('dopilot_fullstack_part0_study_phase', 'true');
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
        if (nextSecIdx < FULLSTACK_PART_0_SECTIONS.length) {
          const nextSec = FULLSTACK_PART_0_SECTIONS[nextSecIdx];
          setActiveSectionId(nextSec.id);
          setActiveQuestionIdx(0);
          setIsStudyPhase(false);
          setLevelResult(null);
          return;
        } else {
          navigate('/course/fullstack-open/part-1?review=true');
          return;
        }
      }
    }


    if (nextQ < qList.length) {
      setActiveQuestionIdx(nextQ);
      setTimeLeft(TIMER_DURATION);
      try {
        localStorage.setItem('dopilot_fullstack_part0_active_q_idx', String(nextQ));
      } catch (e) {
        console.error(e);
      }
      saveQuestionProgressState({
        courseId: 'fullstack-open',
        partNum: 0,
        activeSectionId: activeSection.id,
        activeQuestionIdx: nextQ,
        selectedAnswers: stateRef.current.selectedAnswers,
        isStudyPhase: true,
        isTimeUpWaiting: false,
        targetEndTime: 0,
        timeLeft: TIMER_DURATION,
        studentEmail: user?.email,
        levelResult: null
      });
    } else {
      evaluateLevelScore();
    }
  };

  // Reset Questions for Current Level (loads alternative distinct questions for same concepts)
  const handleResetQuestions = () => {
    const newQuestions = getActiveQuestionsForLevelFullstackPart0(activeSection, studentId, true);
    setLevelQuestions(newQuestions);

    const updatedAnswers = { ...selectedAnswers };
    newQuestions.forEach((q, idx) => {
      const oldTaskId = `fullstack-0-${activeSection.id}-${q.id || idx}`;
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
      localStorage.setItem('dopilot_fullstack_part0_mcq_answers', JSON.stringify(updatedAnswers));
      localStorage.setItem('dopilot_fullstack_part0_active_q_idx', '0');
      localStorage.setItem('dopilot_fullstack_part0_study_phase', 'true');
      localStorage.setItem('dopilot_fullstack_part0_q_target_end_time', String(fresh));
      localStorage.removeItem('dopilot_fullstack_part0_time_up');
      localStorage.removeItem('dopilot_fullstack_part0_level_result');
    } catch (e) {
      console.error(e);
    }

    saveQuestionProgressState({
      courseId: 'fullstack-open',
      partNum: 0,
      activeSectionId: activeSection.id,
      activeQuestionIdx: 0,
      selectedAnswers: updatedAnswers,
      isStudyPhase: true,
      isTimeUpWaiting: false,
      targetEndTime: fresh,
      timeLeft: TIMER_DURATION,
      studentEmail: user?.email,
      levelResult: null
    });
  };

  // Progress to the next level
  const handleProceedToNextLevel = () => {
    if (localStorage.getItem(`dopilot_fullstack_locked_${studentId}`) === 'true') {
      setModalOpen(true);
      return;
    }

    const nextSecIdx = activeIdx + 1;
    if (nextSecIdx < FULLSTACK_PART_0_SECTIONS.length) {
      const nextSec = FULLSTACK_PART_0_SECTIONS[nextSecIdx];
      setActiveSectionId(nextSec.id);
      setActiveQuestionIdx(0);
      setLevelResult(null);
      setIsStudyPhase(true);
      setIsTimeUpWaiting(false);
      setTimeLeft(TIMER_DURATION);
      const fresh = Date.now() + TIMER_DURATION * 1000;
      setTargetEndTime(fresh);

      setLevelAttemptCountFullstackPart0(nextSec.id, studentId, 1);

      const nextQuestions = getActiveQuestionsForLevelFullstackPart0(nextSec, studentId, false);
      setLevelQuestions(nextQuestions);

      try {
        localStorage.setItem('dopilot_fullstack_part0_active_section_id', nextSec.id);
        localStorage.setItem('dopilot_fullstack_part0_active_q_idx', '0');
        localStorage.setItem('dopilot_fullstack_part0_study_phase', 'true');
        localStorage.setItem('dopilot_fullstack_part0_q_target_end_time', String(fresh));
        localStorage.removeItem('dopilot_fullstack_part0_time_up');
      localStorage.removeItem('dopilot_fullstack_part0_level_result');
      } catch (e) {
        console.error(e);
      }

      saveQuestionProgressState({
        courseId: 'fullstack-open',
        partNum: 0,
        activeSectionId: nextSec.id,
        activeQuestionIdx: 0,
        selectedAnswers,
        isStudyPhase: true,
        isTimeUpWaiting: false,
        targetEndTime: fresh,
        timeLeft: TIMER_DURATION,
        studentEmail: user?.email,
        levelResult: null
      });
    } else {
      setIsCourseComplete(true);
      playTwinkleSound();
      try {
        localStorage.setItem('dopilot_fullstack_part0_completed', 'true');
      } catch {}

      saveQuestionProgressState({
        courseId: 'fullstack-open',
        partNum: 0,
        activeSectionId: activeSection.id,
        activeQuestionIdx,
        selectedAnswers,
        isStudyPhase: false,
        isTimeUpWaiting: false,
        targetEndTime: 0,
        timeLeft: 30,
        studentEmail: user?.email,
        isCompleted: true,
        isFinishedPart: true,
        levelResult: null
      });
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
            localStorage.setItem('dopilot_fullstack_part0_time_up', 'true');
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
      localStorage.setItem('dopilot_fullstack_part0_mcq_answers', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    saveQuestionProgressState({
      courseId: 'fullstack-open',
      partNum: 0,
      activeSectionId: activeSection.id,
      activeQuestionIdx,
      selectedAnswers: updated,
      isStudyPhase: false,
      isTimeUpWaiting: false,
      targetEndTime,
      timeLeft,
      studentEmail: user?.email,
      levelResult: null
    });
    const timeSpent = (() => {
      if (targetEndTime && targetEndTime > 0) {
        const elapsed = (TIMER_DURATION * 1000 - Math.max(0, targetEndTime - Date.now())) / 1000;
        return Math.max(0.1, Math.min(30, Number(elapsed.toFixed(1))));
      }
      return Math.max(0.1, Math.min(30, Number((TIMER_DURATION - timeLeft).toFixed(1))));
    })();
    const isRetestAttempt = (() => {
      try {
        const raw = localStorage.getItem(`dopilot_fullstack_attempt_${activeSection.id}_${studentId}`);
        return raw ? Number(raw) > 1 : false;
      } catch {
        return false;
      }
    })();
    const attemptNum = isRetestAttempt ? 2 : 1;

    // Log exact question telemetry for Admin Panel
    logQuestionAttempt(user?.email || studentId, {
      courseId: 'fullstack-open',
      partNum: 0,
      sectionId: activeSection.id,
      sectionTitle: activeSection.title,
      subQuestionLabel: `Part 0 -> Sec 0.${activeIdx + 1} -> Q${activeQuestionIdx + 1}`,
      questionIndex: activeQuestionIdx + 1,
      questionTitle: heading,
      questionPrompt: currentMcq?.question || heading,
      codeSnippet: currentBlock?.codeSnippet,
      studentOptionId: optId,
      studentAnswer: currentMcq?.options?.find(o => o.id === optId)?.text || optId,
      correctOptionId: currentMcq?.correctAnswer || 'A',
      correctAnswer: currentMcq?.options?.find(o => o.id === currentMcq?.correctAnswer)?.text || 'Correct',
      isCorrect,
      timeTakenSeconds: timeSpent,
      timeLimitSeconds: 30,
      attemptNumber: attemptNum,
      isRetest: isRetestAttempt,
      status: isCorrect ? 'passed' : 'failed',
      explanation: currentMcq?.explanationNote
    });

    if (isCorrect) {
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

  // Reset entire Part 0 progress completely
  const handleResetAll = () => {
    if (!window.confirm("Reset all your Part 0 Full Stack Open progress and begin from Level 0.1?")) {
      return;
    }
    resetProgress();
    resetConsecutiveFailuresFullstackPart0(studentId);
    setConsecutiveFailures(0);
    setActiveSectionId(FULLSTACK_PART_0_SECTIONS[0].id);
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
      localStorage.removeItem('dopilot_fullstack_part0_mcq_answers');
      localStorage.removeItem('dopilot_fullstack_part0_active_section_id');
      localStorage.removeItem('dopilot_fullstack_part0_active_q_idx');
      localStorage.removeItem('dopilot_fullstack_part0_completed');
      localStorage.removeItem('dopilot_fullstack_part0_q_target_end_time');
      localStorage.removeItem(`dopilot_fullstack_consecutive_failures_${studentId}`);
      localStorage.removeItem(`dopilot_fullstack_locked_${studentId}`);
      localStorage.setItem('dopilot_fullstack_part0_study_phase', 'true');
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

      {/* Top Navigation Bar - Slim & Clean (Identical to Python & Java) */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md px-4 sm:px-6 py-2.5 flex items-center justify-between shrink-0">
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

      {/* Main Focus Arena (Centered, Identical Layout to Python & Java) */}
      <main className={`flex-1 flex flex-col items-center justify-center ${!isCourseComplete && !levelResult?.isFinished ? 'max-w-7xl' : 'max-w-5xl'} w-full mx-auto px-4 sm:px-6 py-6 relative z-10 my-auto transition-all`}>
        
        {/* SCENARIO 1: Entire Part 0 Course Completed */}
        {isCourseComplete ? (() => {
          if (!hasPurchased) {
            // FREE TRIAL USER: Always display the preserved final Exam Result page (Screenshot 1)
            const savedFinalObj = (() => {
              try {
                const saved = localStorage.getItem(`dopilot_fullstack_part0_final_exam_result_${studentId}`) ||
                              localStorage.getItem('dopilot_fullstack_part0_final_exam_result');
                if (saved) return JSON.parse(saved);
              } catch {}
              return null;
            })();

            if (!savedFinalObj && (!levelResult || !levelResult.isFinished)) {
              setTimeout(() => {
                setIsCourseComplete(false);
                try {
                  localStorage.removeItem('dopilot_fullstack_part0_completed');
                  localStorage.removeItem('dopilot_fullstack_part0_finished');
                } catch {}
              }, 0);
              return null;
            }

            const finalResult = (() => {
              if (levelResult && levelResult.isFinished) return levelResult;
              if (savedFinalObj) return savedFinalObj;
              const finalSec = FULLSTACK_PART_0_SECTIONS[FULLSTACK_PART_0_SECTIONS.length - 1];
              const qList = getActiveQuestionsForLevelFullstackPart0(finalSec, studentId, false);
              let correctCount = 0;
              const totalCount = qList.length || 6;
              qList.forEach((q, idx) => {
                const candKeys = [
                  `fullstack-0-${finalSec.id}-${q.id || idx}`,
                  `fullstack-0-${finalSec.id}-${idx}`,
                  q.id
                ].filter((k): k is string => Boolean(k));
                const ans = candKeys.map(k => selectedAnswers[k]).find(Boolean);
                if (ans && ans === q.correctAnswer) correctCount++;
              });
              const percentage = Math.round((correctCount / totalCount) * 100);
              return {
                isFinished: true,
                sectionId: finalSec.id,
                isPassed: percentage > 80,
                correctCount,
                totalCount,
                percentage,
                attemptCount: 1,
                streak: 0,
                isSecondFailureInLevel: false,
                isLocked: false
              };
            })();

            return (
              <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-lg w-full text-center space-y-5 shadow-2xl my-6 backdrop-blur-xl animate-fade-in relative">
                <div className="flex items-center justify-center">
                  {finalResult.isPassed ? (
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
                    {finalResult.isPassed ? 'Exam Passed' : 'Exam Not Passed'}
                  </h2>
                  <p className="text-slate text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                    {finalResult.isPassed
                      ? `You scored ${finalResult.percentage}%, successfully meeting the passing benchmark of more than 80%.`
                      : `You scored ${finalResult.percentage}%. The passing benchmark is more than 80%. You can proceed directly to the next level in your free trial.`}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 max-w-xs mx-auto">
                  <div className={`p-3.5 rounded-xl border flex flex-col items-center justify-center ${
                    finalResult.isPassed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/[0.03] border-white/10'
                  }`}>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate/70">Score</span>
                    <span className={`font-mono text-2xl sm:text-3xl font-bold mt-0.5 ${
                      finalResult.isPassed ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {finalResult.percentage}%
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate/70">Correct Answers</span>
                    <span className="font-mono text-2xl sm:text-3xl font-bold text-paper mt-0.5">
                      {finalResult.correctCount} <span className="text-slate/50 text-base font-normal">/ {finalResult.totalCount}</span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
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
                    <span>Back to Dashboard</span>
                  </button>
                </div>
              </div>
            );
          } else {
            // PURCHASED USER:
            return (
              <div className="bg-panel/95 border border-white/10 rounded-3xl p-6 sm:p-10 max-w-2xl w-full text-center space-y-6 shadow-2xl my-6 backdrop-blur-xl animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-primary to-emerald-400" />

                <div className="flex items-center justify-center pt-2">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider border bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Part 0 Fully Certified</span>
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="font-jakarta text-2xl sm:text-3xl font-black text-paper tracking-tight">
                    Part 0 Complete! 🎉
                  </h2>
                  <p className="text-slate text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                    You have mastered all 6 foundational levels of Full Stack Open Part 0. You scored &gt; 80% across all sections and earned {points} course points!
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => navigate('/course/fullstack-open/part-1')}
                    className="py-2.5 px-6 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all flex items-center gap-2 shadow-lg shadow-primary/25 cursor-pointer"
                  >
                    <span>Continue to Part 1: React</span>
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
            );
          }
        })() : levelResult?.isFinished ? (
          (!hasPurchased || isSectionExemptFromRetest('fullstack-open', activeSection.id, studentId)) ? (
            /* SCENARIO 2A: Clean, Minimal Free-Trial Pass & Fail Page (Identical to Python, Java & Cyber Security) */
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
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate/70">Correct Answers</span>
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-paper mt-0.5">
                    {levelResult.correctCount} <span className="text-slate/50 text-base font-normal">/ {levelResult.totalCount}</span>
                  </span>
                </div>
              </div>

              {activeIdx === FULLSTACK_PART_0_SECTIONS.length - 1 ? (
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  {!hasPurchased ? (
                    <>
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
                        <span>Back to Dashboard</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate('/course/fullstack-open/part-1')}
                      className="py-2.5 px-8 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer"
                    >
                      <span>Continue to Part 1: React</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ) : (
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
              )}
            </div>
          ) : (
            /* SCENARIO 2B: Clean, Professional Exam Result for Purchased Students (Identical to Python, Java & Cyber Security) */
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
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate/70">Correct Answers</span>
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-paper mt-0.5">
                    {levelResult.correctCount} <span className="text-slate/50 text-base font-normal">/ {levelResult.totalCount}</span>
                  </span>
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

              {/* Action Buttons Configured per exact reference rules */}
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
                      className="py-2.5 px-4 rounded-xl bg-white/[0.02] hover:bg-white/10 text-white hover:text-white font-mono text-xs transition-all cursor-pointer"
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
          /* SCENARIO 3: Active Question View */
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
                
                {/* Left Column: Concept Reference Note & Code (No timer) */}
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
                          <span>example.js</span>
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
                        onClick={(e) => handleStartQuestion(e)}
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
                      className="absolute inset-0 z-20 backdrop-blur-md bg-black/70 rounded-xl border border-white/10 flex flex-col items-center justify-center p-6 text-center animate-fade-in select-none"
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
                            data-selected={isSelected}
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
                                  localStorage.removeItem('dopilot_fullstack_part0_time_up');
      localStorage.removeItem('dopilot_fullstack_part0_level_result');
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

      {/* Second Failure Disclaimer Modal (Exact Python & Java Reference) */}
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
                  ? `Warning: You failed Level ${activeSection.number} twice. You have 2 more warnings remaining before course progression is locked.`
                  : `Warning: You failed Level ${activeSection.number} twice. Only 1 more warning remaining! If you fail the next level twice, your course progression will be completely locked.`}
              </p>
              <p className="text-slate text-xs leading-relaxed pt-1">
                {levelResult?.streak === 1
                  ? 'You are allowed to continue to the next level. However, if you continue to fail consecutive levels, you will receive only 1 more warning before your course progression is locked until support intervention.'
                  : 'This is your final warning before course lockdown. You are permitted to advance, but failing the next level twice will require mandatory contact with our support team to unlock progression.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/25 flex items-start gap-2.5 text-left">
              <input
                type="checkbox"
                id="disclaimer-check"
                checked={disclaimerConfirmed}
                onChange={(e) => setDisclaimerConfirmed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-white/20 text-primary accent-primary cursor-pointer"
              />
              <label htmlFor="disclaimer-check" className="text-xs text-amber-200 cursor-pointer select-none">
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

      {/* Part 1 Teaser Modal */}
      <AnimatePresence>
        {part1ModalOpen && (
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
                Part 1: Introduction to React
              </h3>

              <p className="text-slate text-xs sm:text-sm leading-relaxed">
                Congratulations on mastering Part 0! Part 1: Introduction to React is unlocked in your curriculum.
              </p>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPart1ModalOpen(false);
                    navigate('/course/fullstack-open/part-1');
                  }}
                  className="px-6 py-2.5 rounded-full bg-primary text-ink font-jakarta font-black text-xs hover:bg-white transition-all cursor-pointer shadow-lg shadow-primary/25"
                >
                  Launch Part 1: React
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

      {/* Course Purchase Modal for Free Trial Completion */}
      <CoursePurchaseModal
        isOpen={purchaseModalOpen}
        onClose={() => setPurchaseModalOpen(false)}
        courseId="fullstack-open"
        courseName="Full Stack Open Course"
        onSuccess={() => {
          setHasPurchased(true);
          setPurchaseModalOpen(false);
          const isFinished = isPart1Finished('fullstack-open', studentId) || activeIdx === FULLSTACK_PART_0_SECTIONS.length - 1;
          if (isFinished) {
            try {
              localStorage.setItem('dopilot_fullstack_part0_completed', 'true');
              localStorage.setItem('dopilot_fullstack_part0_finished', 'true');
              localStorage.setItem('dopilot_fullstack_core_last_part', '1');
            } catch {}
            saveCoursePartCompletion('fullstack-open', 0, 1, user?.email);
            setPostPurchaseDecision('fullstack-open', 'continue_to_part2', studentId);
          }
        }}
      />
    </div>
  );
};
