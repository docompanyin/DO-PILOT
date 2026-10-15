import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ArrowRight, Star, Users, Clock, ShieldCheck, CheckCircle2, 
  ChevronDown, BookOpen, Sparkles, Layers, Play, RotateCcw, Award, HelpCircle, Lock
} from 'lucide-react';
import { COURSES_DATA, getCourseById } from '../data/coursesData';
import { useUserAuth } from '../context/UserAuthContext';
import { ContactModal } from './ContactModal';
import { CertificateModal } from './CertificateModal';
import { NeedHelpModal } from './NeedHelpModal';
import { getUserInitials } from '../utils/userInitials';

interface PythonResumeInfo {
  targetPart: number;
  status: 'not_started' | 'in_progress' | 'all_completed';
  completedCount: number;
  completedParts: number[];
  buttonText: string;
  heroButtonText: string;
}

const getPythonResumeInfo = (): PythonResumeInfo => {
  try {
    const completedParts: number[] = [];
    for (let i = 1; i <= 14; i++) {
      const isComp = (i === 1)
        ? (localStorage.getItem('dopilot_part1_completed') === 'true' || localStorage.getItem('dopilot_completed') === 'true')
        : (localStorage.getItem(`dopilot_part${i}_completed`) === 'true');
      if (isComp) completedParts.push(i);
    }

    const firstUncompletedPart = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].find(
      p => !completedParts.includes(p)
    );

    if (completedParts.length === 14 || !firstUncompletedPart) {
      return {
        targetPart: 14,
        status: 'all_completed',
        completedCount: 14,
        completedParts,
        buttonText: 'Review Course',
        heroButtonText: 'Review Course (Completed)'
      };
    }

    // Current eligible part is always the first incomplete part
    const targetPart = firstUncompletedPart;

    const rawLastVisited = Number(localStorage.getItem('dopilot_python_core_last_part'));
    const secKey = targetPart === 1 ? 'dopilot_active_section_id' : `dopilot_part${targetPart}_active_section_id`;
    const ansKey = targetPart === 1 ? 'dopilot_mcq_answers_v2' : `dopilot_part${targetPart}_mcq_answers_v2`;
    const rawSec = localStorage.getItem(secKey);
    const rawAns = localStorage.getItem(ansKey);
    const isProgress = (rawLastVisited === targetPart) || !!rawSec || (!!rawAns && rawAns !== '{}');

    const progressLabel = targetPart === 1 ? 'Continue Part 1' : `Continue to Part ${targetPart}`;

    return {
      targetPart,
      status: isProgress ? 'in_progress' : 'not_started',
      completedCount: completedParts.length,
      completedParts,
      buttonText: isProgress ? progressLabel : (targetPart === 1 ? 'Try Part 1 Free' : `Start Part ${targetPart}`),
      heroButtonText: isProgress ? progressLabel : (targetPart === 1 ? 'Try Now — Start Part 1 Free' : `Start Part ${targetPart}`)
    };
  } catch {
    return {
      targetPart: 1,
      status: 'not_started',
      completedCount: 0,
      completedParts: [],
      buttonText: 'Try Part 1 Free',
      heroButtonText: 'Try Now — Start Part 1 Free'
    };
  }
};

interface JavaResumeInfo {
  targetPart: number;
  status: 'all_completed' | 'in_progress' | 'not_started';
  completedCount: number;
  completedParts: number[];
  buttonText: string;
  heroButtonText: string;
}

const getJavaResumeInfo = (): JavaResumeInfo => {
  try {
    const completedParts: number[] = [];
    for (let i = 1; i <= 14; i++) {
      if (localStorage.getItem(`dopilot_java_part${i}_completed`) === 'true') {
        completedParts.push(i);
      }
    }

    const allParts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    const firstUncompletedPart = allParts.find(p => !completedParts.includes(p));

    if (completedParts.length === 14 || !firstUncompletedPart) {
      return {
        targetPart: 14,
        status: 'all_completed',
        completedCount: 14,
        completedParts,
        buttonText: 'Review Course',
        heroButtonText: 'Review Course (Parts 1–14 Completed)'
      };
    }

    const targetPart = firstUncompletedPart;

    const rawLastVisited = Number(localStorage.getItem('dopilot_java_core_last_part'));
    const secKey = targetPart === 1 ? 'dopilot_java_active_section_id' : `dopilot_java_part${targetPart}_active_section_id`;
    const ansKey = targetPart === 1 ? 'dopilot_java_mcq_answers' : `dopilot_java_part${targetPart}_mcq_answers`;
    const rawSec = localStorage.getItem(secKey);
    const rawAns = localStorage.getItem(ansKey);
    const isProgress = (rawLastVisited === targetPart) || !!rawSec || (!!rawAns && rawAns !== '{}');

    const progressLabel = targetPart === 1 ? 'Continue Part 1' : `Continue to Part ${targetPart}`;

    return {
      targetPart,
      status: isProgress ? 'in_progress' : 'not_started',
      completedCount: completedParts.length,
      completedParts,
      buttonText: isProgress ? progressLabel : (targetPart === 1 ? 'Try Part 1 Free' : `Start Part ${targetPart}`),
      heroButtonText: isProgress ? progressLabel : (targetPart === 1 ? 'Try Now — Start Part 1 Free' : `Start Part ${targetPart}`)
    };
  } catch {
    return {
      targetPart: 1,
      status: 'not_started',
      completedCount: 0,
      completedParts: [],
      buttonText: 'Try Part 1 Free',
      heroButtonText: 'Try Now — Start Part 1 Free'
    };
  }
};

interface FullStackResumeInfo {
  targetPart: number;
  status: 'all_completed' | 'in_progress' | 'not_started';
  completedCount: number;
  completedParts: number[];
  buttonText: string;
  heroButtonText: string;
}

const getFullStackResumeInfo = (): FullStackResumeInfo => {
  try {
    const completedParts: number[] = [];
    for (let i = 0; i <= 13; i++) {
      if (localStorage.getItem(`dopilot_fullstack_part${i}_completed`) === 'true') {
        completedParts.push(i);
      }
    }

    const allParts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    const firstUncompletedPart = allParts.find(p => !completedParts.includes(p));

    if (completedParts.length === 14 || firstUncompletedPart === undefined) {
      return {
        targetPart: 13,
        status: 'all_completed',
        completedCount: 14,
        completedParts,
        buttonText: 'Review Course',
        heroButtonText: 'Review Course (Parts 0–13 Completed)'
      };
    }

    const targetPart = firstUncompletedPart;

    const rawLastVisited = localStorage.getItem('dopilot_fullstack_core_last_part');
    const lastVisited = (rawLastVisited !== null && !isNaN(Number(rawLastVisited))) ? Number(rawLastVisited) : null;
    const secKey = `dopilot_fullstack_part${targetPart}_active_section_id`;
    const ansKey = `dopilot_fullstack_part${targetPart}_mcq_answers`;
    const rawSec = localStorage.getItem(secKey);
    const rawAns = localStorage.getItem(ansKey);
    const isProgress = (lastVisited === targetPart) || !!rawSec || (!!rawAns && rawAns !== '{}');

    const progressLabel = targetPart === 0 ? 'Continue Part 0' : `Continue to Part ${targetPart}`;

    return {
      targetPart,
      status: isProgress ? 'in_progress' : 'not_started',
      completedCount: completedParts.length,
      completedParts,
      buttonText: isProgress ? progressLabel : (targetPart === 0 ? 'Try Part 0 Free' : `Start Part ${targetPart}`),
      heroButtonText: isProgress ? progressLabel : (targetPart === 0 ? 'Try Now — Start Part 0 Free' : `Start Part ${targetPart}`)
    };
  } catch {
    return {
      targetPart: 0,
      status: 'not_started',
      completedCount: 0,
      completedParts: [],
      buttonText: 'Try Part 0 Free',
      heroButtonText: 'Try Now — Start Part 0 Free'
    };
  }
};

interface CyberSecurityResumeInfo {
  targetPart: number;
  status: 'all_completed' | 'in_progress' | 'not_started';
  completedCount: number;
  completedParts: number[];
  buttonText: string;
  heroButtonText: string;
}

const getCyberSecurityResumeInfo = (): CyberSecurityResumeInfo => {
  try {
    const completedParts: number[] = [];
    for (let i = 1; i <= 14; i++) {
      if (localStorage.getItem(`dopilot_cyber_part${i}_completed`) === 'true') {
        completedParts.push(i);
      }
    }

    const allParts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    const firstUncompletedPart = allParts.find(p => !completedParts.includes(p));

    if (completedParts.length === 14 || !firstUncompletedPart) {
      return {
        targetPart: 14,
        status: 'all_completed',
        completedCount: 14,
        completedParts,
        buttonText: 'Review Course',
        heroButtonText: 'Review Course (Parts 1–14 Completed)'
      };
    }

    const targetPart = firstUncompletedPart;

    const rawLastVisited = Number(localStorage.getItem('dopilot_cyber_core_last_part'));
    const secKey = `dopilot_cyber_part${targetPart}_active_section_id`;
    const ansKey = `dopilot_cyber_part${targetPart}_mcq_answers`;
    const rawSec = localStorage.getItem(secKey);
    const rawAns = localStorage.getItem(ansKey);
    const isProgress = (rawLastVisited === targetPart) || !!rawSec || (!!rawAns && rawAns !== '{}');

    const progressLabel = targetPart === 1 ? 'Continue Part 1' : `Continue to Part ${targetPart}`;

    return {
      targetPart,
      status: isProgress ? 'in_progress' : 'not_started',
      completedCount: completedParts.length,
      completedParts,
      buttonText: isProgress ? progressLabel : (targetPart === 1 ? 'Try Part 1 Free' : `Start Part ${targetPart}`),
      heroButtonText: isProgress ? progressLabel : (targetPart === 1 ? 'Try Now — Start Part 1 Free' : `Start Part ${targetPart}`)
    };
  } catch {
    return {
      targetPart: 1,
      status: 'not_started',
      completedCount: 0,
      completedParts: [],
      buttonText: 'Try Part 1 Free',
      heroButtonText: 'Try Now — Start Part 1 Free'
    };
  }
};

export const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useUserAuth();

  const [openModules, setOpenModules] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [resumeInfo, setResumeInfo] = useState<PythonResumeInfo>(() => getPythonResumeInfo());
  const [javaResumeInfo, setJavaResumeInfo] = useState<JavaResumeInfo>(() => getJavaResumeInfo());
  const [fullstackResumeInfo, setFullstackResumeInfo] = useState<FullStackResumeInfo>(() => getFullStackResumeInfo());
  const [cyberResumeInfo, setCyberResumeInfo] = useState<CyberSecurityResumeInfo>(() => getCyberSecurityResumeInfo());

  // Find course by id or slug
  const course = courseId ? getCourseById(courseId) : COURSES_DATA[0];

  useEffect(() => {
    const updateProgress = () => {
      setResumeInfo(getPythonResumeInfo());
      setJavaResumeInfo(getJavaResumeInfo());
      setFullstackResumeInfo(getFullStackResumeInfo());
      setCyberResumeInfo(getCyberSecurityResumeInfo());
    };
    updateProgress();
    window.addEventListener('focus', updateProgress);
    window.addEventListener('storage', updateProgress);
    return () => {
      window.removeEventListener('focus', updateProgress);
      window.removeEventListener('storage', updateProgress);
    };
  }, [courseId]);

  const handleStartOrResume = () => {
    if (course && course.id === 'python-core') {
      const target = resumeInfo.targetPart || 1;
      localStorage.setItem('dopilot_python_core_last_part', String(target));
      navigate(`/course/python-core/part-${target}`);
    } else if (course && (course.id === 'java-core' || course.slug === 'complete-java-programming')) {
      const target = javaResumeInfo.targetPart || 1;
      localStorage.setItem('dopilot_java_core_last_part', String(target));
      navigate(`/course/complete-java-programming/part-${target}`);
    } else if (course && (course.id === 'fullstack-open' || course.slug === 'fullstack-open')) {
      const target = fullstackResumeInfo.targetPart ?? 0;
      localStorage.setItem('dopilot_fullstack_core_last_part', String(target));
      navigate(`/course/fullstack-open/part-${target}`);
    } else if (course && (course.id === 'cyber-security' || course.slug === 'cyber-security-core')) {
      const target = cyberResumeInfo.targetPart || 1;
      localStorage.setItem('dopilot_cyber_core_last_part', String(target));
      navigate(`/course/cyber-security/part-${target}`);
    } else {
      setModalOpen(true);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (course) {
      document.title = `${course.title} — DO PILOT`;
    }
  }, [course]);

  // If course not found, provide fallback
  if (!course) {
    return (
      <div className="min-h-screen bg-black text-paper flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-jakarta text-3xl font-black mb-3">Course Not Found</h2>
        <p className="font-sans text-slate text-sm mb-6 max-w-sm">
          The course track you are looking for does not exist or has been moved.
        </p>
        <button
          onClick={() => navigate('/#courses')}
          className="px-6 py-3 rounded-full bg-primary text-ink font-jakarta font-bold text-xs hover:bg-white transition-all cursor-pointer flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Courses</span>
        </button>
      </div>
    );
  }

  // Split modules into 2 stages/columns to utilize full page width
  const isMultiStage = course.modules.length >= 8;
  const stage1Modules = isMultiStage 
    ? course.modules.slice(0, 7) 
    : course.modules.slice(0, Math.ceil(course.modules.length / 2));
  const stage2Modules = isMultiStage 
    ? course.modules.slice(7) 
    : course.modules.slice(Math.ceil(course.modules.length / 2));

  const renderModuleCard = (mod: typeof course.modules[0], globalIdx: number) => {
    const isOpen = openModules.includes(globalIdx);
    return (
      <div
        key={globalIdx}
        className={`rounded-2xl border transition-all overflow-hidden outline-none ${
          isOpen 
            ? 'bg-black/50 border-transparent shadow-lg shadow-black/40 ring-0' 
            : 'bg-white/[0.02] border-white/10 hover:border-white/20'
        }`}
      >
        <button
          type="button"
          onClick={() => {
            setOpenModules(prev =>
              prev.includes(globalIdx) ? prev.filter(i => i !== globalIdx) : [...prev, globalIdx]
            );
          }}
          className="w-full p-4 flex items-center justify-between text-left cursor-pointer outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 select-none"
        >
          <div className="flex items-center gap-3 pr-2 min-w-0">
            <span className={`w-8 h-8 rounded-xl font-mono text-xs font-bold flex items-center justify-center shrink-0 border transition-colors ${
              isOpen ? 'bg-primary text-ink border-primary' : 'bg-white/[0.04] text-slate border-white/10'
            }`}>
              {mod.number}
            </span>
            <div className="min-w-0">
              <h4 className="font-jakarta font-bold text-sm text-paper truncate">
                {mod.title}
              </h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-[11px] text-slate/70">
                  {mod.duration}
                </span>
                <span className="font-mono text-[10px] text-slate/50">
                  • {mod.topics.length} topics
                </span>
              </div>
            </div>
          </div>

          <ChevronDown
            className={`w-4 h-4 text-slate shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-primary' : ''
            }`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-4 pb-4 pt-1 border-t border-white/5 bg-black/20"
            >
              <ul className="space-y-2 mt-2">
                {mod.topics.map((topic, tIdx) => (
                  <li key={tIdx} className="flex items-start gap-2.5 text-xs text-slate">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{topic}</span>
                  </li>
                ))}
              </ul>

              {/* Unified Course Progression Action for Python, Java, Full Stack, and Cyber Security */}
              {(() => {
                const isJava = course.id === 'java-core' || course.slug === 'complete-java-programming';
                const isPython = course.id === 'python-core';
                const isFullstack = course.id === 'fullstack-open' || course.slug === 'fullstack-open';
                const isCyber = course.id === 'cyber-security' || course.slug === 'cyber-security-core';

                if (!isPython && !isJava && !isFullstack && !isCyber) return null;
                if (globalIdx < 0 || globalIdx > 13) return null;

                let partNum = globalIdx + 1;
                let prevPartNum = globalIdx;
                let isCompleted = false;
                let isCurrent = false;
                let isStarted = false;
                let partUrl = '';

                if (isPython) {
                  partNum = globalIdx + 1;
                  prevPartNum = globalIdx;
                  isCompleted = resumeInfo.completedParts.includes(partNum);
                  isCurrent = (resumeInfo.targetPart === partNum) && (resumeInfo.status !== 'all_completed');
                  isStarted = isCurrent && (resumeInfo.status === 'in_progress');
                  partUrl = `/course/python-core/part-${partNum}`;
                } else if (isJava) {
                  partNum = globalIdx + 1;
                  prevPartNum = globalIdx;
                  isCompleted = javaResumeInfo.completedParts.includes(partNum);
                  isCurrent = (javaResumeInfo.targetPart === partNum) && (javaResumeInfo.status !== 'all_completed');
                  isStarted = isCurrent && (javaResumeInfo.status === 'in_progress');
                  partUrl = `/course/complete-java-programming/part-${partNum}`;
                } else if (isFullstack) {
                  partNum = globalIdx; // 0..13
                  prevPartNum = globalIdx === 0 ? 0 : globalIdx - 1;
                  isCompleted = fullstackResumeInfo.completedParts.includes(partNum);
                  isCurrent = (fullstackResumeInfo.targetPart === partNum) && (fullstackResumeInfo.status !== 'all_completed');
                  isStarted = isCurrent && (fullstackResumeInfo.status === 'in_progress');
                  partUrl = `/course/fullstack-open/part-${partNum}`;
                } else if (isCyber) {
                  partNum = globalIdx + 1;
                  prevPartNum = globalIdx;
                  isCompleted = cyberResumeInfo.completedParts.includes(partNum);
                  isCurrent = (cyberResumeInfo.targetPart === partNum) && (cyberResumeInfo.status !== 'all_completed');
                  isStarted = isCurrent && (cyberResumeInfo.status === 'in_progress');
                  partUrl = `/course/cyber-security/part-${partNum}`;
                }

                if (isCurrent) {
                  return (
                    <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="font-mono text-[11px] text-primary font-bold">
                        Part {partNum} • Current In-Progress Part
                      </span>
                      <button
                        type="button"
                        onClick={() => navigate(partUrl)}
                        className="px-4 py-1.5 rounded-full bg-primary text-ink font-jakarta font-black text-xs hover:bg-white transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-primary/20"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>{isStarted ? `Continue Part ${partNum}` : `Start Part ${partNum}`}</span>
                      </button>
                    </div>
                  );
                }

                if (isCompleted) {
                  return (
                    <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Part {partNum} Completed</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => navigate(partUrl)}
                        className="px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/10 border border-white/10 text-paper font-jakarta font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Review Part {partNum}</span>
                      </button>
                    </div>
                  );
                }

                // Locked state — Complete previous part first
                return (
                  <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate/50">
                      <Lock className="w-3.5 h-3.5 text-slate/40" />
                      <span>Locked — Complete Part {prevPartNum} first</span>
                    </span>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-paper selection:bg-primary selection:text-ink relative overflow-x-hidden">
      
      {/* Top Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[160px] pointer-events-none rounded-full" />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/#courses')}
            className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/10 text-slate hover:text-paper font-mono text-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">All Courses</span>
          </button>

          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="https://res.cloudinary.com/ufo0zltq/image/upload/v1786197046/Do_PNG_ssyhu1.png"
              alt="DO PILOT"
              className="h-7 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,255,157,0.3)]"
            />
            <span className="font-jakarta font-black text-sm tracking-wider text-paper">
              DO PILOT
            </span>
          </Link>
        </div>

        {/* User Status / Auth */}
        <div className="flex items-center gap-3">

          {isLoggedIn && user ? (
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-panel border border-white/15 text-paper hover:border-primary/50 transition-colors cursor-pointer"
              title="Student Portal & Learning Progress"
            >
              <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/50 text-primary flex items-center justify-center font-jakarta font-black text-[9px] tracking-tight shrink-0">
                {getUserInitials(user.name)}
              </div>
              <span className="font-jakarta text-xs font-bold max-w-[90px] truncate">
                {user.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={() => navigate(`/login?redirect=/course/${course.id}`)}
              className="py-1.5 px-4 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-paper font-jakarta text-xs font-bold transition-all cursor-pointer"
            >
              Sign In
            </button>
          )}

          {isLoggedIn ? (
            <button
              type="button"
              onClick={() => setHelpModalOpen(true)}
              className="relative group inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-gradient-to-r from-emerald-500/10 via-white/[0.05] to-primary/10 hover:from-emerald-500/20 hover:via-white/[0.09] hover:to-primary/25 border border-emerald-500/30 hover:border-primary/60 text-paper font-jakarta text-xs font-bold transition-all duration-300 shadow-[0_0_15px_rgba(0,255,157,0.12)] hover:shadow-[0_0_25px_rgba(0,255,157,0.35)] cursor-pointer"
              title="Academic & Technical Mentor Support"
            >
              <HelpCircle className="w-3.5 h-3.5 text-primary group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
              <span className="tracking-wide">Need Help</span>
            </button>
          ) : (
            <button
              onClick={() => setModalOpen(true)}
              className="hidden sm:inline-flex py-1.5 px-3.5 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/10 text-slate hover:text-paper font-mono text-xs transition-all cursor-pointer"
            >
              Get in Touch
            </button>
          )}
        </div>
      </header>

      {/* Main Course Content Container: Utilizing Full Width (max-w-7xl) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        
        {/* Header Hero Section */}
        <div className="mb-10 pb-8 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className={`font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border-0 backdrop-blur-md ${course.badgeColor.replace(/border\S+/g, '')}`}>
              {course.badge}
            </span>
            <span className="font-mono text-xs text-slate/70">
              • {course.level}
            </span>
            <span className="font-mono text-xs text-slate/70 flex items-center gap-1">
              • <Clock className="w-3.5 h-3.5 text-primary inline" /> {course.duration}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-4xl">
              <h1 className="font-jakarta text-3xl sm:text-5xl font-black text-paper tracking-tight leading-tight">
                {course.title}
              </h1>
              <p className="mt-4 text-slate text-base sm:text-lg font-normal leading-relaxed">
                {course.headline}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              {course.id === 'python-core' ? (
                resumeInfo.status === 'all_completed' ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCertModalOpen(true)}
                      className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-jakarta font-black text-sm hover:opacity-95 hover:shadow-xl hover:shadow-amber-500/25 transition-all cursor-pointer flex items-center gap-2.5 shadow-lg shadow-amber-500/20 group"
                    >
                      <Award className="w-5 h-5 text-black" />
                      <span>Claim Official Certificate</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/course/python-core/part-1')}
                      className="px-5 py-3.5 rounded-full bg-white/[0.05] hover:bg-white/10 border border-white/15 text-paper font-jakarta font-bold text-xs transition-all cursor-pointer flex items-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-primary" />
                      <span>Review Course</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleStartOrResume}
                    className="px-8 py-3.5 rounded-full bg-primary text-ink font-jakarta font-black text-sm hover:bg-white hover:shadow-xl hover:shadow-primary/30 transition-all cursor-pointer flex items-center gap-2.5 shadow-lg shadow-primary/20 group"
                  >
                    {resumeInfo.status === 'in_progress' ? (
                      <RotateCcw className="w-4 h-4 transition-transform group-hover:-rotate-45" />
                    ) : (
                      <Play className="w-4 h-4 fill-current" />
                    )}
                    <span>{resumeInfo.heroButtonText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                )
              ) : course.id === 'java-core' ? (
                javaResumeInfo.status === 'all_completed' ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCertModalOpen(true)}
                      className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-jakarta font-black text-sm hover:opacity-95 hover:shadow-xl hover:shadow-amber-500/25 transition-all cursor-pointer flex items-center gap-2.5 shadow-lg shadow-amber-500/20 group"
                    >
                      <Award className="w-5 h-5 text-black" />
                      <span>Claim Official Certificate</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/course/complete-java-programming/part-1')}
                      className="px-5 py-3.5 rounded-full bg-white/[0.05] hover:bg-white/10 border border-white/15 text-paper font-jakarta font-bold text-xs transition-all cursor-pointer flex items-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-primary" />
                      <span>Review Course</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleStartOrResume}
                    className="px-8 py-3.5 rounded-full bg-primary text-ink font-jakarta font-black text-sm hover:bg-white hover:shadow-xl hover:shadow-primary/30 transition-all cursor-pointer flex items-center gap-2.5 shadow-lg shadow-primary/20 group"
                  >
                    {javaResumeInfo.status === 'in_progress' ? (
                      <RotateCcw className="w-4 h-4 transition-transform group-hover:-rotate-45" />
                    ) : (
                      <Play className="w-4 h-4 fill-current" />
                    )}
                    <span>{javaResumeInfo.heroButtonText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                )
              ) : (course.id === 'fullstack-open' || course.slug === 'fullstack-open') ? (
                fullstackResumeInfo.status === 'all_completed' ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCertModalOpen(true)}
                      className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-jakarta font-black text-sm hover:opacity-95 hover:shadow-xl hover:shadow-amber-500/25 transition-all cursor-pointer flex items-center gap-2.5 shadow-lg shadow-amber-500/20 group"
                    >
                      <Award className="w-5 h-5 text-black" />
                      <span>Claim Official Certificate</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/course/fullstack-open/part-0')}
                      className="px-5 py-3.5 rounded-full bg-white/[0.05] hover:bg-white/10 border border-white/15 text-paper font-jakarta font-bold text-xs transition-all cursor-pointer flex items-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-primary" />
                      <span>Review Course</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleStartOrResume}
                    className="px-8 py-3.5 rounded-full bg-primary text-ink font-jakarta font-black text-sm hover:bg-white hover:shadow-xl hover:shadow-primary/30 transition-all cursor-pointer flex items-center gap-2.5 shadow-lg shadow-primary/20 group"
                  >
                    {fullstackResumeInfo.status === 'in_progress' ? (
                      <RotateCcw className="w-4 h-4 transition-transform group-hover:-rotate-45" />
                    ) : (
                      <Play className="w-4 h-4 fill-current" />
                    )}
                    <span>{fullstackResumeInfo.heroButtonText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                )
              ) : (course.id === 'cyber-security' || course.slug === 'cyber-security-core') ? (
                cyberResumeInfo.status === 'all_completed' ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCertModalOpen(true)}
                      className="px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-400 via-primary to-emerald-400 text-black font-jakarta font-black text-sm hover:opacity-95 hover:shadow-xl hover:shadow-cyan-500/25 transition-all cursor-pointer flex items-center gap-2.5 shadow-lg shadow-cyan-500/20 group"
                    >
                      <Award className="w-5 h-5 text-black" />
                      <span>Claim Cyber Security Certificate</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/course/cyber-security/part-1')}
                      className="px-5 py-3.5 rounded-full bg-white/[0.05] hover:bg-white/10 border border-white/15 text-paper font-jakarta font-bold text-xs transition-all cursor-pointer flex items-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Review Course</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleStartOrResume}
                    className="px-8 py-3.5 rounded-full bg-cyan-500 text-ink font-jakarta font-black text-sm hover:bg-white hover:shadow-xl hover:shadow-cyan-500/30 transition-all cursor-pointer flex items-center gap-2.5 shadow-lg shadow-cyan-500/20 group"
                  >
                    {cyberResumeInfo.status === 'in_progress' ? (
                      <RotateCcw className="w-4 h-4 transition-transform group-hover:-rotate-45" />
                    ) : (
                      <Play className="w-4 h-4 fill-current" />
                    )}
                    <span>{cyberResumeInfo.heroButtonText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                )
              ) : (
                isLoggedIn ? (
                  <button
                    type="button"
                    onClick={() => setHelpModalOpen(true)}
                    className="group px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500/15 via-primary/20 to-teal-500/15 hover:from-emerald-500/25 hover:via-primary/30 hover:to-teal-500/25 border border-primary/40 hover:border-primary text-paper font-jakarta font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,157,0.15)]"
                  >
                    <HelpCircle className="w-4 h-4 text-primary group-hover:scale-110 group-hover:rotate-12 transition-transform" />
                    <span>Need Help</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="px-6 py-3 rounded-full bg-primary text-ink font-jakarta font-extrabold text-xs hover:bg-white hover:shadow-lg hover:shadow-primary/30 transition-all cursor-pointer"
                  >
                    Get in Touch
                  </button>
                )
              )}
            </div>
          </div>

          {/* Factual Metrics Bar */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 pt-6 border-t border-white/5 font-mono text-xs text-slate">
            <div className="flex items-center gap-1.5 text-paper font-semibold">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{course.rating}</span>
              <span className="text-slate/60 font-normal">({course.reviewsCount} reviews)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary" />
              <span>{course.studentsCount.toLocaleString()} Students Enrolled</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-secondary" />
              <span>{course.modules.length} Detailed Modules</span>
            </div>
          </div>
        </div>

        {/* 2-Column Overview & Outcomes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-10 items-stretch">
          
          {/* Left Column: About & Tech Stack */}
          <div className="lg:col-span-6 flex flex-col">
            <section className="bg-panel border border-white/10 rounded-3xl p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-jakarta text-lg font-black text-paper flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span>About This Track</span>
                </h3>
                <p className="text-slate text-xs sm:text-sm leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div>
                {/* Prerequisites Note */}
                <div className="mt-5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-paper block mb-0.5 font-jakarta">Prerequisites:</span>
                    <span className="text-slate leading-relaxed">{course.prerequisites}</span>
                  </div>
                </div>

                {/* Technologies */}
                <div className="mt-5 pt-4 border-t border-white/5">
                  <span className="font-mono text-[10px] text-slate/80 font-bold uppercase tracking-wider block mb-2">
                    Technologies &amp; Libraries Covered
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {course.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 font-mono text-[11px] text-paper/90"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: What You Will Master */}
          <div className="lg:col-span-6 flex flex-col">
            <section className="bg-panel border border-white/10 rounded-3xl p-6 sm:p-7 flex-1">
              <h3 className="font-jakarta text-lg font-black text-paper flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>What You Will Master</span>
              </h3>
              <div className="space-y-3">
                {course.outcomes.map((outcome, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3 hover:border-primary/30 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-xs text-slate/90 leading-relaxed font-sans">{outcome}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

        </div>

        {/* Full Course Completion Celebration & Certificate Banner */}
        {course.id === 'python-core' && resumeInfo.status === 'all_completed' && (
          <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-primary/10 to-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden backdrop-blur-xl animate-fade-in">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-primary to-amber-400" />
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/20">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
                    Graduation Milestone Achieved
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                    14 of 14 Completed
                  </span>
                </div>
                <h3 className="font-jakarta font-black text-xl sm:text-2xl text-paper mt-1">
                  Congratulations! You've Mastered Complete Python Course 🎉
                </h3>
                <p className="font-sans text-xs sm:text-sm text-slate/80 mt-1 max-w-2xl leading-relaxed">
                  You have conquered all 14 instructional stages and 1,180+ practical assessments with Distinction. Claim your permanent verified certificate and download your high-resolution A4 PDF credential anytime.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCertModalOpen(true)}
              className="px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-jakarta font-black text-xs uppercase tracking-wider hover:opacity-95 hover:shadow-xl hover:shadow-amber-500/25 transition-all cursor-pointer flex items-center gap-2 shrink-0 shadow-lg shadow-amber-500/20"
            >
              <Award className="w-4 h-4 text-black" />
              <span>Get Certificate (PDF)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Full Course Completion Celebration & Certificate Banner for Java */}
        {course.id === 'java-core' && javaResumeInfo.status === 'all_completed' && (
          <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-primary/10 to-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden backdrop-blur-xl animate-fade-in">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-primary to-amber-400" />
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/20">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
                    Graduation Milestone Achieved
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                    14 of 14 Completed
                  </span>
                </div>
                <h3 className="font-jakarta font-black text-xl sm:text-2xl text-paper mt-1">
                  Congratulations! You've Mastered Complete Java Course 🎉
                </h3>
                <p className="font-sans text-xs sm:text-sm text-slate/80 mt-1 max-w-2xl leading-relaxed">
                  You have conquered all 14 instructional stages and 84 rigorous levels of Helsinki Java MOOC I &amp; II with Distinction. Claim your permanent verified certificate and download your high-resolution A4 PDF credential anytime.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCertModalOpen(true)}
              className="px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-jakarta font-black text-xs uppercase tracking-wider hover:opacity-95 hover:shadow-xl hover:shadow-amber-500/25 transition-all cursor-pointer flex items-center gap-2 shrink-0 shadow-lg shadow-amber-500/20"
            >
              <Award className="w-4 h-4 text-black" />
              <span>Get Certificate (PDF)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Full Course Completion Celebration & Certificate Banner for Full Stack Open */}
        {(course.id === 'fullstack-open' || course.slug === 'fullstack-open') && fullstackResumeInfo.status === 'all_completed' && (
          <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-emerald-400/10 to-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden backdrop-blur-xl animate-fade-in">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-400" />
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/20">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
                    Graduation Milestone Achieved
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                    14 of 14 Completed
                  </span>
                </div>
                <h3 className="font-jakarta font-black text-xl sm:text-2xl text-paper mt-1">
                  Congratulations! You've Mastered Full Stack Open 🎉
                </h3>
                <p className="font-sans text-xs sm:text-sm text-slate/80 mt-1 max-w-2xl leading-relaxed">
                  You have conquered all 14 rigorous curriculum modules of University of Helsinki Full Stack Open with Distinction. Claim your permanent verified certificate and download your high-resolution A4 PDF credential anytime.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCertModalOpen(true)}
              className="px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-jakarta font-black text-xs uppercase tracking-wider hover:opacity-95 hover:shadow-xl hover:shadow-amber-500/25 transition-all cursor-pointer flex items-center gap-2 shrink-0 shadow-lg shadow-amber-500/20"
            >
              <Award className="w-4 h-4 text-black" />
              <span>Get Certificate (PDF)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 14-Part Curriculum & Modules: Full-Width 2-Column Split */}
        <section className="bg-panel border border-white/10 rounded-3xl p-6 sm:p-8 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-white/10">
            <div>
              <h3 className="font-jakarta text-xl font-black text-paper flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                <span>Curriculum Roadmap</span>
              </h3>
              <p className="text-slate text-xs font-mono mt-1">
                {course.modules.length} Comprehensive Parts • {course.duration}
                {course.id === 'python-core' && resumeInfo.completedCount > 0 && (
                  <span className="text-primary ml-2 font-semibold">
                    • {resumeInfo.completedCount}/14 Completed
                  </span>
                )}
                {course.id === 'java-core' && javaResumeInfo.completedCount > 0 && (
                  <span className="text-primary ml-2 font-semibold">
                    • {javaResumeInfo.completedCount}/14 Completed
                  </span>
                )}
                {(course.id === 'fullstack-open' || course.slug === 'fullstack-open') && fullstackResumeInfo.completedCount > 0 && (
                  <span className="text-primary ml-2 font-semibold">
                    • {fullstackResumeInfo.completedCount}/14 Completed
                  </span>
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
              {course.id === 'python-core' && (
                <button
                  type="button"
                  onClick={handleStartOrResume}
                  className="px-4 py-1.5 rounded-full bg-primary text-ink font-jakarta font-black text-xs hover:bg-white transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-primary/20"
                >
                  {resumeInfo.status === 'in_progress' ? (
                    <RotateCcw className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                  <span>{resumeInfo.buttonText}</span>
                </button>
              )}

              {course.id === 'java-core' && (
                <button
                  type="button"
                  onClick={handleStartOrResume}
                  className="px-4 py-1.5 rounded-full bg-primary text-ink font-jakarta font-black text-xs hover:bg-white transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-primary/20"
                >
                  {javaResumeInfo.status === 'in_progress' ? (
                    <RotateCcw className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                  <span>{javaResumeInfo.buttonText}</span>
                </button>
              )}

              {(course.id === 'fullstack-open' || course.slug === 'fullstack-open') && (
                <button
                  type="button"
                  onClick={handleStartOrResume}
                  className="px-4 py-1.5 rounded-full bg-primary text-ink font-jakarta font-black text-xs hover:bg-white transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-primary/20"
                >
                  {fullstackResumeInfo.status === 'in_progress' ? (
                    <RotateCcw className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                  <span>{fullstackResumeInfo.buttonText}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  if (openModules.length === course.modules.length) {
                    setOpenModules([]);
                  } else {
                    setOpenModules(course.modules.map((_, i) => i));
                  }
                }}
                className="px-4 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate hover:text-paper font-mono text-xs transition-all cursor-pointer"
              >
                {openModules.length === course.modules.length ? 'Collapse All' : 'Expand All'}
              </button>
            </div>
          </div>

          {/* 2-Column Responsive Curriculum Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* Stage 1 */}
            <div className="space-y-3">
              <div className="pb-2.5 border-b border-white/10 mb-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                  {isMultiStage ? 'Stage 1: Core Fundamentals (Parts 1 – 7)' : 'Stage 1'}
                </span>
              </div>
              {stage1Modules.map((mod, idx) => renderModuleCard(mod, idx))}
            </div>

            {/* Stage 2 */}
            <div className="space-y-3">
              <div className="pb-2.5 border-b border-white/10 mb-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-secondary">
                  {isMultiStage ? 'Stage 2: Advanced Architecture & Projects (Parts 8 – 14)' : 'Stage 2'}
                </span>
              </div>
              {stage2Modules.map((mod, sIdx) => renderModuleCard(mod, stage1Modules.length + sIdx))}
            </div>

          </div>
        </section>

        {/* Minimal Bottom Inquiries Bar */}
        <div className="p-6 sm:p-8 rounded-3xl bg-panel border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-jakarta font-bold text-base sm:text-lg text-paper">
              Have questions about this track?
            </h4>
            <p className="font-mono text-xs text-slate mt-1">
              Connect with our team to ask questions, explore topics, or get started.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setHelpModalOpen(true)}
            className="px-6 py-2.5 rounded-full bg-primary text-ink font-jakarta font-extrabold text-xs hover:bg-white hover:text-ink transition-all cursor-pointer shrink-0 flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            <HelpCircle className="w-4 h-4 text-ink shrink-0" />
            <span className="font-extrabold text-ink tracking-wide">Need Help</span>
            <ArrowRight className="w-3.5 h-3.5 text-ink shrink-0" />
          </button>
        </div>

      </main>

      {/* =========================================================================
          TEMPORARY CERTIFICATE TESTER BUTTON (REMOVE LATER)
          Allows testing the PDF certificate download without having to complete all 14 parts.
          ========================================================================= */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          type="button"
          onClick={() => setCertModalOpen(true)}
          className="px-4 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-jakarta font-black text-xs uppercase tracking-wider shadow-2xl flex items-center gap-2 border-2 border-amber-500/50 cursor-pointer shadow-amber-500/30 hover:scale-105 transition-all"
          title="Temporary Certificate Tester — Click to test certificate generation & download without completing the course"
        >
          <Award className="w-4 h-4 text-black" />
          <span>🧪 Test Certificate PDF</span>
        </button>
      </div>

      {/* Shared Enrollment / Consultation Modal */}
      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedCourse={course.title}
      />

      {/* Official Certificate Modal */}
      <CertificateModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        courseTitle={course.title}
      />

      {/* Need Help Modal */}
      <NeedHelpModal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
        courseTitle={course.title}
        courseId={course.id}
      />
    </div>
  );
};
