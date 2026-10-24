import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, BookOpen, Clock, ArrowRight, Trophy, RotateCcw,
  CheckCircle2, AlertCircle, Shuffle, Check, Sparkles, AlertTriangle, ShieldAlert, ShoppingBag
} from 'lucide-react';
import { CyberTerminalLauncherButton } from './compiler/CyberTerminalModal';
import { useCoursePoints } from '../context/CoursePointsContext';
import { getSavedCertificate } from '../utils/certificateGenerator';
import { useUserAuth } from '../context/UserAuthContext';
import { ContactModal } from './ContactModal';
import { NeedHelpModal } from './NeedHelpModal';
import { hasCourseAccess, getCoursePricing, CoursePricing } from '../utils/coursePricingService';
import { CoursePurchaseModal } from './checkout/CoursePurchaseModal';
import { recordCourseLock } from '../utils/courseResetService';
import { 
  PART_1_SECTIONS, TheoryBlock, McqQuestion,
  getActiveQuestionsForLevel, getConsecutiveFailedLevels,
  recordLevelAttemptResult, resetConsecutiveFailures,
  setLevelAttemptCount
} from '../data/cyberPart1Data';
import { 
  recordPart1SectionScore, getPart1OverallScore,
  markPart1RestartUsed, clearPart1ScoresOnRestart,
  hasUsedPart1Restart, setPostPurchaseDecision, getPostPurchaseDecision,
  markTrialAttempted, hasAttemptedTrial
} from '../utils/part1ScoreService';
import { useCourseQuestionResume, getCourseStorageKeys, saveQuestionProgressState } from '../utils/courseProgressSyncService';

const TIMER_DURATION = 30; // 30 seconds

interface LevelResultState {
  isFinished: boolean;
  isPassed: boolean;
  correctCount: number;
  totalCount: number;
  attemptedCount?: number;
  incorrectCount?: number;
  skippedCount?: number;
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
  const [searchParams] = useSearchParams();
  const isReviewMode = searchParams.get('review') === 'true' && Boolean(getSavedCertificate('cyber-security') || getSavedCertificate('cyber-security-core'));

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
  const [levelResult, setLevelResult] = useState<LevelResultState | null>(() => {
    try {
      const keys = getCourseStorageKeys('cyber-security', 1);
      const saved = localStorage.getItem(keys.levelResultKey);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Consecutive failure counter
  const [consecutiveFailures, setConsecutiveFailures] = useState<number>(() => {
    return getConsecutiveFailedLevels(studentId);
  });

  // Disclaimer popup state when choosing "Continue to Next Set" on 2nd consecutive failure
  const [disclaimerModalOpen, setDisclaimerModalOpen] = useState(false);

  // Course access & purchase modal state
  const [hasPurchased, setHasPurchased] = useState<boolean>(() => {
    return hasCourseAccess('cyber-security', user?.id || user?.email);
  });
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [pricing, setPricing] = useState<CoursePricing | undefined>(() => getCoursePricing('cyber-security'));

  useEffect(() => {
    const check = () => {
      setHasPurchased(hasCourseAccess('cyber-security', user?.id || user?.email));
      setPricing(getCoursePricing('cyber-security'));
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
    resetConsecutiveFailures(studentId);
    try {
      localStorage.removeItem(`dopilot_locked_${studentId}`);
      localStorage.removeItem(`dopilot_locked_progression_${studentId}`);
      localStorage.removeItem(`dopilot_cyber_locked_${studentId}`);
    } catch {}

    const overallScore = getPart1OverallScore('cyber-security', studentId);
    const savedDecision = getPostPurchaseDecision('cyber-security', studentId);

    if (savedDecision === 'continue_to_part2') {
      try {
        localStorage.setItem('dopilot_cyber_part1_completed', 'true');
        localStorage.setItem('dopilot_cyber_core_last_part', '2');
      } catch {}
      navigate('/course/cyber-security/part-2');
      return;
    }
    if (savedDecision === 'retry_part1') {
      setIsCourseComplete(false);
      return;
    }
    // Users who passed the free trial (50% or higher) redirect directly to Part 2:
    if (overallScore.isAbove50) {
      try {
        localStorage.setItem('dopilot_cyber_part1_completed', 'true');
        localStorage.setItem('dopilot_cyber_core_last_part', '2');
      } catch {}
      navigate('/course/cyber-security/part-2');
    } else {
      // Below 50% following a failed trial:
      // Keep isCourseComplete = true and hasPurchased = true so user gets exactly one additional attempt at Part 1
      setIsCourseComplete(true);
    }
  };

  const handleRetryPart1 = () => {
    setPostPurchaseDecision('cyber-security', 'retry_part1', studentId);
    markPart1RestartUsed('cyber-security', studentId);
    clearPart1ScoresOnRestart('cyber-security', studentId);
    try {
      localStorage.removeItem('dopilot_cyber_part1_completed');
      localStorage.removeItem('dopilot_cyber_part1_finished');
      localStorage.removeItem('dopilot_cyber_part1_level_result');
      localStorage.removeItem('dopilot_cyber_part1_mcq_answers');
      localStorage.removeItem('dopilot_cyber_part1_time_up');
      localStorage.setItem('dopilot_cyber_core_last_part', '1');
      localStorage.setItem('dopilot_cyber_part1_active_section_id', PART_1_SECTIONS[0].id);
      localStorage.setItem('dopilot_cyber_part1_active_q_idx', '0');
      localStorage.setItem('dopilot_cyber_part1_study_phase', 'true');
    } catch {}
    setSelectedAnswers({});
    setActiveSectionId(PART_1_SECTIONS[0].id);
    setActiveQuestionIdx(0);
    setLevelResult(null);
    setIsCourseComplete(false);
    setIsStudyPhase(true);
    setIsTimeUpWaiting(false);
    setTimeLeft(TIMER_DURATION);
    const fresh = Date.now() + TIMER_DURATION * 1000;
    setTargetEndTime(fresh);
    try {
      localStorage.setItem('dopilot_cyber_part1_q_target_end_time', String(fresh));
    } catch {}
    const freshQuestions = getActiveQuestionsForLevel(PART_1_SECTIONS[0], studentId, true);
    setLevelQuestions(freshQuestions);
  };

  const handleContinueToPart2 = () => {
    setPostPurchaseDecision('cyber-security', 'continue_to_part2', studentId);
    try {
      localStorage.setItem('dopilot_cyber_part1_completed', 'true');
      localStorage.setItem('dopilot_cyber_core_last_part', '2');
    } catch {}
    navigate('/course/cyber-security/part-2');
  };

  // Persistent MCQ selected answers
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('dopilot_cyber_part1_mcq_answers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const prevSectionIdRef = useRef(activeSectionId);
  // Update questions whenever active level changes
  useEffect(() => {
    const qList = getActiveQuestionsForLevel(activeSection, studentId, false);
    setLevelQuestions(qList);
    if (prevSectionIdRef.current !== activeSectionId) {
      prevSectionIdRef.current = activeSectionId;
      setLevelResult(null);
      try {
        const keys = getCourseStorageKeys('cyber-security', 1);
        localStorage.removeItem(keys.levelResultKey);
      } catch {}
    }
  }, [activeSectionId, studentId]);

  const currentBlock: TheoryBlock = activeSection.theoryBlocks[activeQuestionIdx] || activeSection.theoryBlocks[0];
  const currentMcq: McqQuestion = levelQuestions[activeQuestionIdx] || currentBlock.mcq!;
  const taskId = `cyber-p1-${activeSection.id}-${currentMcq.id || activeQuestionIdx}`;

  const candidateCurrentKeys = [
    taskId,
    `cyber-p1-${activeSection.id}-${activeQuestionIdx}`,
    currentMcq.id ? `cyber-p1-${activeSection.id}-${currentMcq.id}` : '',
    `${activeSection.id}-${currentMcq.id || activeQuestionIdx}`,
    `${activeSection.id}-${activeQuestionIdx}`
  ].filter(Boolean);

  // Study Phase vs Question Phase (Study phase by default, no timer pressure until user clicks continue)
  const [isStudyPhase, setIsStudyPhase] = useState<boolean>(() => {
    if (isReviewMode) return false;
    try {
      const answers = JSON.parse(localStorage.getItem('dopilot_cyber_part1_mcq_answers') || '{}');
      if (candidateCurrentKeys.some(k => Boolean(answers[k]))) return false; // Already answered, show unblurred
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
      const keys = getCourseStorageKeys('cyber-security', 1);
      const savedResult = localStorage.getItem(keys.levelResultKey);
      if (savedResult) {
        const parsed = JSON.parse(savedResult);
        if (parsed?.isFinished) return false;
      }
      const savedPhase = localStorage.getItem(keys.studyPhaseKey);
      if (savedPhase === 'true') return false;
      if (localStorage.getItem(keys.timeUpKey) === 'true') return true;
      const savedEnd = Number(localStorage.getItem(keys.targetEndTimeKey));
      const answers = JSON.parse(localStorage.getItem(keys.answersKey) || '{}');
      if (savedEnd && savedEnd <= Date.now() && !answers[taskId]) {
        return true;
      }
    } catch {}
    return false;
  });

  useCourseQuestionResume({
    courseId: 'cyber-security',
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
    validSectionIds: PART_1_SECTIONS.map(s => s.id),
    levelResult,
    setLevelResult,
    setIsCourseComplete: (complete: boolean) => setIsCourseComplete(complete)
  });

  const [isCourseComplete, setIsCourseComplete] = useState<boolean>(() => {
    try {
      const decision = getPostPurchaseDecision('cyber-security', studentId);
      if (decision === 'retry_part1') {
        return false;
      }
      const finished = localStorage.getItem('dopilot_cyber_part1_finished') === 'true';
      const saved = localStorage.getItem('dopilot_cyber_part1_completed') === 'true';
      if (saved || finished) return true;
      return false;
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

    // Read from both localStorage and stateRef to guarantee NO answers are lost
    let localAnswers: Record<string, string> = {};
    try {
      const saved = localStorage.getItem('dopilot_cyber_part1_mcq_answers');
      if (saved) localAnswers = JSON.parse(saved);
    } catch {}
    const answers = { ...localAnswers, ...stateRef.current.selectedAnswers };

    let correctCount = 0;
    let attemptedCount = 0;
    let incorrectCount = 0;
    let skippedCount = 0;
    const totalCount = qList.length;

    qList.forEach((q, idx) => {
      const candidateKeys = [
        `cyber-p1-${secId}-${q.id}`,
        `cyber-p1-${secId}-${idx}`,
        `cyber-p1-${secId}-${q.id || idx}`,
        `${secId}-${q.id}`,
        `${secId}-${idx}`,
        q.id ? `${secId}-${q.id || idx}` : ''
      ].filter(Boolean);

      let userChoice: string | undefined = undefined;
      for (const k of candidateKeys) {
        if (answers[k]) {
          userChoice = answers[k];
          break;
        }
      }

      if (userChoice) {
        attemptedCount++;
        if (userChoice === q.correctAnswer) {
          correctCount++;
        } else {
          incorrectCount++;
        }
      } else {
        skippedCount++;
      }
    });

    const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
    // Passing requirement is STRICTLY MORE THAN 80% (> 80%, so 5 or 6 out of 6 correct)
    const isPassed = percentage > 80;

    // Record section score for post-purchase overall Part 1 calculation (> 50% overall across 1.1-1.5)
    recordPart1SectionScore('cyber-security', activeSection.id, correctCount, totalCount, studentId);

    if (!hasPurchased) {
      markTrialAttempted('cyber-security', studentId);
    }

    // Free-trial failure flow: Only track/increment consecutive failures if user has purchased the course!
    const result = hasPurchased
      ? recordLevelAttemptResult(activeSection.id, studentId, isPassed)
      : {
          consecutiveFailedLevels: 0,
          attemptCount: 1,
          isSecondFailureInLevel: false,
          isLocked: false
        };

    setConsecutiveFailures(result.consecutiveFailedLevels);

    if (hasPurchased && result.isLocked) {
      recordCourseLock({
        studentId,
        studentName: user?.name || user?.email?.split('@')[0] || 'Enrolled Student',
        studentEmail: user?.email || `${studentId}@student.dopilot.io`,
        studentPhone: user?.phone,
        collegeOrCompany: user?.collegeOrCompany,
        courseId: 'cyber',
        courseName: 'Cyber Security & Ethical Hacking',
        partNum: 1,
        partTitle: 'Part 1: Networking & Threat Modeling',
        consecutiveFailures: result.consecutiveFailedLevels,
        progressSummary: `Part 1: Failed Level ${activeSection.number} • ${points} Points`,
        earnedPoints: points
      });
    }

    const resultState: LevelResultState = {
      isFinished: true,
      isPassed,
      correctCount,
      totalCount,
      attemptedCount,
      incorrectCount,
      skippedCount,
      percentage,
      streak: result.consecutiveFailedLevels,
      attemptCount: result.attemptCount,
      isSecondFailureInLevel: result.isSecondFailureInLevel,
      isLocked: result.isLocked
    };

    setLevelResult(resultState);
    const keys = getCourseStorageKeys('cyber-security', 1);
    try {
      localStorage.setItem(keys.levelResultKey, JSON.stringify(resultState));
    } catch {}

    saveQuestionProgressState({
      courseId: 'cyber-security',
      partNum: 1,
      activeSectionId: activeSection.id,
      activeQuestionIdx,
      selectedAnswers: answers,
      isStudyPhase: false,
      isTimeUpWaiting: false,
      targetEndTime,
      timeLeft,
      studentEmail: user?.email,
      levelResult: resultState
    });
  };

  const isAdvancingRef = useRef(false);

  // Advance function to go to next question or complete level
  const advanceToNextQuestion = () => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;
    setTimeout(() => { isAdvancingRef.current = false; }, 300);

    setCorrectCountdown(null);
    setIsTimeUpWaiting(false);

    const { activeQuestionIdx: qIdx, levelQuestions: qList, selectedAnswers: currentAns } = stateRef.current;
    const nextQ = qIdx + 1;

    if (isReviewMode) {
      if (nextQ < qList.length) {
        setActiveQuestionIdx(nextQ);
        setIsStudyPhase(false);
        return;
      } else {
        const nextSecIdx = activeIdx + 1;
        if (nextSecIdx < PART_1_SECTIONS.length) {
          const nextSec = PART_1_SECTIONS[nextSecIdx];
          setActiveSectionId(nextSec.id);
          setActiveQuestionIdx(0);
          setIsStudyPhase(false);
          setLevelResult(null);
          return;
        } else {
          navigate('/course/cyber-security/part-2?review=true');
          return;
        }
      }
    }


    if (nextQ < qList.length) {
      setActiveQuestionIdx(nextQ);
      setTimeLeft(TIMER_DURATION);
      try {
        localStorage.setItem('dopilot_cyber_part1_active_q_idx', String(nextQ));
      } catch (e) {
        console.error(e);
      }

      // Check if next question has already been answered
      const nextMcq = qList[nextQ] || activeSection.theoryBlocks[nextQ]?.mcq;
      const nextKeys = [
        `cyber-p1-${activeSection.id}-${nextMcq?.id || nextQ}`,
        `cyber-p1-${activeSection.id}-${nextQ}`,
        nextMcq?.id ? `cyber-p1-${activeSection.id}-${nextMcq.id}` : '',
        `${activeSection.id}-${nextMcq?.id || nextQ}`,
        `${activeSection.id}-${nextQ}`
      ].filter(Boolean);
      const isNextAnswered = nextKeys.some(k => Boolean(currentAns[k]));

      if (isNextAnswered) {
        setIsStudyPhase(false);
        try {
          localStorage.setItem('dopilot_cyber_part1_study_phase', 'false');
        } catch {}
      } else {
        setIsStudyPhase(true);
        try {
          localStorage.setItem('dopilot_cyber_part1_study_phase', 'true');
        } catch {}
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
      localStorage.removeItem('dopilot_cyber_part1_level_result');
    } catch (e) {
      console.error(e);
    }
  };

  // Progress to next level
  const handleProceedToNextLevel = () => {
    if (hasPurchased && localStorage.getItem(`dopilot_cyber_locked_${studentId}`) === 'true') {
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
        localStorage.removeItem('dopilot_cyber_part1_level_result');
      } catch (e) {
        console.error(e);
      }
    } else {
      const part1Summary = getPart1OverallScore('cyber-security', studentId);
      setIsCourseComplete(true);
      try {
        localStorage.setItem('dopilot_cyber_part1_finished', 'true');
        localStorage.removeItem('dopilot_cyber_part1_level_result');
        if (hasPurchased || part1Summary.isAbove50) {
          localStorage.setItem('dopilot_cyber_part1_completed', 'true');
        } else {
          localStorage.removeItem('dopilot_cyber_part1_completed');
        }
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

  // Real-time listener for Admin Course Reset / Unlock
  useEffect(() => {
    const handleCourseUnlocked = (e: any) => {
      const detail = e?.detail;
      if (!detail || detail.studentId === studentId || detail.courseId === 'cyber' || detail.courseId === 'all') {
        const isLockedInStorage = localStorage.getItem(`dopilot_cyber_locked_${studentId}`) === 'true';
        if (!isLockedInStorage) {
          setLevelResult(prev => {
            if (prev && prev.isLocked) {
              return { ...prev, isLocked: false, streak: 0 };
            }
            return prev;
          });
          setConsecutiveFailures(0);
        }
      }
    };
    window.addEventListener('dopilot_course_unlocked', handleCourseUnlocked);
    window.addEventListener('storage', handleCourseUnlocked);
    return () => {
      window.removeEventListener('dopilot_course_unlocked', handleCourseUnlocked);
      window.removeEventListener('storage', handleCourseUnlocked);
    };
  }, [studentId]);

  // Main 30-Second Countdown Timer Loop
  useEffect(() => {
    if (isReviewMode || isCourseComplete || isStudyPhase || levelResult?.isFinished) return;

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
    if (isReviewMode || selectedAnswers[tId] || isTaskSolved(tId) || isTimeUpWaiting || isStudyPhase || levelResult?.isFinished) {
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
      const isRetestAttempt = (() => {
        try {
          const raw = localStorage.getItem(`dopilot_cyber_attempt_${activeSection.id}_${studentId}`);
          return raw ? Number(raw) > 1 : false;
        } catch {
          return false;
        }
      })();
      if (!isRetestAttempt) {
        awardPoint(tId, heading, optId);
      }
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
      localStorage.removeItem('dopilot_cyber_part1_level_result');
      localStorage.removeItem('dopilot_cyber_part1_q_target_end_time');
      localStorage.removeItem(`dopilot_cyber_consecutive_failures_${studentId}`);
      localStorage.removeItem(`dopilot_cyber_locked_${studentId}`);
      localStorage.setItem('dopilot_cyber_part1_study_phase', 'true');
    } catch (e) {
      console.error(e);
    }
  };

  const isSolved = isTaskSolved(taskId);
  let currentChoice: string | undefined = undefined;
  for (const k of candidateCurrentKeys) {
    if (selectedAnswers[k]) {
      currentChoice = selectedAnswers[k];
      break;
    }
  }
  if (!currentChoice && isSolved) {
    currentChoice = currentMcq.correctAnswer;
  }
  const isLocked = Boolean(currentChoice);
  const isUserWrongAnswer = Boolean(currentChoice && currentChoice !== currentMcq.correctAnswer);

  // When viewing an already answered question, ensure it remains unblurred and timer is inactive
  useEffect(() => {
    if (currentChoice) {
      setIsStudyPhase(false);
      setIsTimeUpWaiting(false);
    }
  }, [activeSectionId, activeQuestionIdx, currentChoice]);

  return (
    <div className="min-h-screen bg-black text-paper selection:bg-primary selection:text-ink relative overflow-x-hidden font-sans flex flex-col">
      
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[250px] bg-primary/10 blur-[160px] pointer-events-none rounded-full" />

      {/* Top Navigation Bar - Slim & Clean */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/course/cyber-security')}
            className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/10 text-white hover:text-white font-mono text-xs transition-all cursor-pointer"
            title="Leave Course (Progress and remaining balance saved)"
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
      <main className={`flex-1 flex flex-col items-center justify-center ${!isCourseComplete && !levelResult ? 'max-w-7xl' : 'max-w-5xl'} w-full mx-auto px-4 sm:px-6 py-6 relative z-10 my-auto transition-all`}>
        
        {/* SCENARIO 1: Entire Part 1 Course Completed */}
        {isCourseComplete ? (() => {
          const overall = getPart1OverallScore('cyber-security', studentId);
          
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
                    onClick={() => navigate('/course/cyber-security')}
                    className="py-2.5 px-5 rounded-xl bg-white/[0.06] hover:bg-white/15 border border-white/15 text-paper font-jakarta font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Back to Dashboard</span>
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
                    You scored {overall.percentage}% ({overall.totalCorrect}/{overall.totalQuestions} correct) across sections 1.1 to 1.5. Buy the course to continue.
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
                    onClick={() => navigate('/course/cyber-security')}
                    className="py-2.5 px-5 rounded-xl bg-white/[0.06] hover:bg-white/15 border border-white/15 text-paper font-jakarta font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Back to Dashboard</span>
                  </button>
                </div>
              </div>
            );
          } else {
            // PURCHASED USER:
            const hasUsedRetry = hasUsedPart1Restart('cyber-security', studentId);
            const savedDecision = getPostPurchaseDecision('cyber-security', studentId);
            return (overall.isAbove50 || hasUsedRetry || overall.allSectionsPassed || savedDecision === 'continue_to_part2') ? (
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
                    You scored {overall.percentage}% ({overall.totalCorrect}/{overall.totalQuestions} correct) across sections 1.1 to 1.5 and earned {points} course points! Continue to Part 2 to proceed.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={handleContinueToPart2}
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
                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto py-2">
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-[11px] font-mono text-slate">Overall Score</div>
                    <div className="text-xl font-bold font-mono text-rose-400 mt-0.5">{overall.percentage}%</div>
                  </div>
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-[11px] font-mono text-slate">Questions</div>
                    <div className="text-xl font-bold font-mono text-paper mt-0.5">{overall.totalCorrect}/{overall.totalQuestions}</div>
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
                    onClick={() => navigate('/course/cyber-security')}
                    className="py-2.5 px-5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-white hover:text-white font-jakarta font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Back to Dashboard</span>
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
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate/70">Attempted</span>
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-paper mt-0.5">
                    {levelResult.attemptedCount ?? levelResult.totalCount} <span className="text-slate/50 text-base font-normal">/ {levelResult.totalCount}</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate/50 mt-0.5">
                    {levelResult.correctCount} Correct • {(levelResult.attemptedCount ?? levelResult.totalCount) - levelResult.correctCount} Incorrect
                  </span>
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
                    ? 'You have reached 3 consecutive failed levels. Progression is locked. Please reach out to our team to review your concepts and unlock further levels.'
                    : levelResult.isSecondFailureInLevel
                    ? levelResult.streak === 1
                      ? `You have failed Level ${activeSection.number} twice. You have 2 more warnings remaining before course progression is locked.`
                      : `Warning: You failed Level ${activeSection.number} twice. Only 1 more warning remaining before course progression is locked.`
                    : 'Your score was below 80%. Click "Reset Questions" to receive fresh questions and retry the level.'}
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
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate/70">Attempted</span>
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-paper mt-0.5">
                    {levelResult.attemptedCount ?? levelResult.totalCount} <span className="text-slate/50 text-base font-normal">/ {levelResult.totalCount}</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate/50 mt-0.5">
                    {levelResult.correctCount} Correct • {(levelResult.attemptedCount ?? levelResult.totalCount) - levelResult.correctCount} Incorrect
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

              {/* Action Buttons Configured per exact prompt rules */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {levelResult.isPassed ? (
                  /* PASSED: Continue to next level directly */
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
                  /* SECOND CONSECUTIVE FAILURE: Retest failed */
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
                      <span>Reset &amp; Retry Level</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setContactModalOpen(true)}
                      className="py-2.5 px-4 rounded-xl bg-white/[0.02] hover:bg-white/10 text-white hover:text-white font-mono text-xs transition-all cursor-pointer"
                    >
                      <span>Contact Team Now</span>
                    </button>
                  </>
                ) : (
                  /* 3+ CONSECUTIVE FAILURES: Locked */
                  <>
                    <button
                      type="button"
                      onClick={() => setContactModalOpen(true)}
                      className="py-2.5 px-5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-jakarta font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>Contact Team Now</span>
                    </button>
                  </>
                )}
              </div>
            </div>
        )
      ) : (
          /* SCENARIO 3: Active Question View */
          <div className="w-full my-auto space-y-3">
            <div className="bg-panel/90 border border-white/10 rounded-2xl p-5 sm:p-7 space-y-5 shadow-2xl relative w-full">
              
              {/* Card Header: Level progress & compact timer */}
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
                  <div className="space-y-3">
                    <div className="space-y-1.5">
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
                          <span>terminal.sh</span>
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
                                  localStorage.removeItem('dopilot_cyber_part1_time_up');
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
                                const wrongText = chosen?.explanationIfWrong || (chosen as any)?.wrong || 'Incorrect choice.';
                                const note = currentMcq.explanationNote;
                                const showNote = note && !wrongText.toLowerCase().includes(note.trim().toLowerCase());
                                return (
                                  <span><strong className="text-rose-400 font-bold">✕ Not quite: </strong>{wrongText}{showNote ? ` ${note}` : ''}</span>
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
                className="w-full py-2 px-4 rounded-xl bg-white/[0.04] hover:bg-white/10 text-white hover:text-white font-mono text-xs transition-all cursor-pointer"
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
                  if (hasPurchased) {
                    navigate('/course/cyber-security/part-2');
                  } else {
                    setPurchaseModalOpen(true);
                  }
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all cursor-pointer shadow-md shadow-primary/20 flex items-center justify-center gap-1.5"
              >
                <span>{hasPurchased ? 'Start Part 2: Enterprise Architecture & Defense' : 'Buy Course to Start Part 2'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>


            </div>
          </div>
        </div>
      )}

      {/* Course Purchase & Coupon Modal */}
      {pricing && (
        <CoursePurchaseModal
          isOpen={purchaseModalOpen}
          onClose={() => setPurchaseModalOpen(false)}
          courseId="cyber-security"
          courseTitle="Cyber Security & Ethical Hacking"
          pricing={pricing}
          onSuccess={handlePostPurchaseUnlock}
        />
      )}

    </div>
  );
};
