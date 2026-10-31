import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, User, CheckCircle2, 
  Edit3, LogOut, Download, Printer, 
  AlertCircle, ChevronRight, X, Play,
  BookOpen, Trophy, IndianRupee, Check, GraduationCap, Clock, Lock,
  Sparkles, ArrowRight, XCircle
} from 'lucide-react';
import { useUserAuth } from '../../context/UserAuthContext';
import { useCoursePoints } from '../../context/CoursePointsContext';
import { COURSES_DATA } from '../../data/coursesData';
import { 
  getCoursePurchases, 
  CoursePurchaseRecord, 
  normalizeCourseId 
} from '../../utils/coursePricingService';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { 
  getSavedCertificate, 
  downloadCertificatePdf, 
  printCertificate, 
  isCourseComplete,
  COURSE_CERT_CONFIGS
} from '../../utils/certificateGenerator';
import { CertificateModal } from '../CertificateModal';
import { playTwinkleSound } from '../../utils/audioEffects';
import { getUserInitials } from '../../utils/userInitials';
import {
  RewardRequest,
  submitRewardRequest,
  getStudentRewardRequests,
  syncRewardRequestsFromCloud
} from '../../utils/rewardApprovalService';
import { navigateBackOrFallback } from '../../utils/navigationHelper';

type SettingsTab = 'profile' | 'progress' | 'rewards' | 'certificates';

export interface ClaimedCourseItem {
  id: string;
  courseId: string;
  courseName: string;
  couponCodeApplied?: string;
  purchasedAt: string;
  detailsPath: string;
}

interface CashRewardTier {
  id: string;
  pointsRequired: number;
  cashAmount: number;
}

const CASH_TIERS: CashRewardTier[] = [
  { id: 'cash-200', pointsRequired: 200, cashAmount: 200 },
  { id: 'cash-400', pointsRequired: 400, cashAmount: 400 },
  { id: 'cash-700', pointsRequired: 700, cashAmount: 700 },
  { id: 'cash-1000', pointsRequired: 1000, cashAmount: 1000 },
];

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, pendingUser, isLoggedIn, isPendingRegistration, logout, updateUserProfile } = useUserAuth();
  const { points } = useCoursePoints();

  // Active Tab from query param (defaults to 'profile')
  const initialTab = (searchParams.get('tab') as SettingsTab) || 'profile';
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);

  // Edit Profile Modal State (Only opens when user clicks "Edit Profile")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editCollegeOrCompany, setEditCollegeOrCompany] = useState(user?.collegeOrCompany || '');
  const [editWhereDidYouFindUs, setEditWhereDidYouFindUs] = useState(user?.whereDidYouFindUs || '');
  const [editError, setEditError] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Milestone Approval Request State
  const [requestModalTier, setRequestModalTier] = useState<CashRewardTier | null>(null);
  const [claimSuccessModalTier, setClaimSuccessModalTier] = useState<CashRewardTier | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [rewardRequests, setRewardRequests] = useState<RewardRequest[]>(() =>
    user ? getStudentRewardRequests(user.email) : []
  );

  // Lock background scroll when any modal is open to prevent touch/zoom jumping on mobile
  useEffect(() => {
    if (isEditModalOpen || requestModalTier || claimSuccessModalTier) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
      };
    }
  }, [isEditModalOpen, requestModalTier, claimSuccessModalTier]);

  useEffect(() => {
    if (user) {
      setRewardRequests(getStudentRewardRequests(user.email));
      syncRewardRequestsFromCloud().then((cloudRequests) => {
        const studentRequests = cloudRequests.filter(
          (r) => r.studentEmail.toLowerCase() === user.email.toLowerCase()
        );
        setRewardRequests(studentRequests);
      }).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    const handleRewardUpdate = () => {
      if (user) {
        setRewardRequests(getStudentRewardRequests(user.email));
      }
    };
    window.addEventListener('dopilot_reward_request_update', handleRewardUpdate);
    window.addEventListener('storage', handleRewardUpdate);
    return () => {
      window.removeEventListener('dopilot_reward_request_update', handleRewardUpdate);
      window.removeEventListener('storage', handleRewardUpdate);
    };
  }, [user]);

  // Claimed Courses State (Courses claimed via zero-amount coupon)
  const [claimedCourses, setClaimedCourses] = useState<ClaimedCourseItem[]>([]);

  const getCanonicalCourseRoute = (norm: string): string => {
    if (norm === 'python-core') return '/course/python-core';
    if (norm === 'java-core') return '/course/complete-java-programming';
    if (norm === 'fullstack-open') return '/course/fullstack-open';
    if (norm === 'cyber-security') return '/course/cyber-security';
    return `/course/${norm}`;
  };

  const loadClaimedCourses = useCallback(() => {
    if (!user) {
      setClaimedCourses([]);
      return;
    }

    const purchases = getCoursePurchases();
    const userEmail = (user.email || '').toLowerCase().trim();
    const userId = user.id;

    const claimedMap = new Map<string, ClaimedCourseItem>();

    // 1. Add from user.enrolledCourses (loaded directly from Supabase student_profiles)
    if (Array.isArray(user.enrolledCourses)) {
      user.enrolledCourses.forEach((cName) => {
        const meta = COURSES_DATA.find(
          (c) => c.title.toLowerCase() === cName.toLowerCase() || normalizeCourseId(c.id) === normalizeCourseId(cName)
        );
        const norm = meta ? normalizeCourseId(meta.id) : normalizeCourseId(cName);
        if (!claimedMap.has(norm)) {
          claimedMap.set(norm, {
            id: `ENROLLED-${norm}`,
            courseId: norm,
            courseName: meta?.title || cName,
            couponCodeApplied: '100% Scholarship',
            purchasedAt: new Date().toISOString(),
            detailsPath: getCanonicalCourseRoute(norm)
          });
        }
      });
    }

    // 2. Filter purchases belonging to this student claimed via coupon / zero amount
    const userPurchases = purchases.filter((p) => {
      const matchEmail = Boolean(userEmail && p.studentEmail && p.studentEmail.toLowerCase().trim() === userEmail);
      const matchId = Boolean(userId && p.studentId === userId);
      const isCompleted = p.status === 'completed' && p.accessGranted;
      const isZeroClaim = p.finalAmount === 0 || p.paymentMethod === 'coupon_free_unlock';
      return (matchEmail || matchId) && isCompleted && isZeroClaim;
    });

    userPurchases.forEach((p) => {
      const norm = normalizeCourseId(p.courseId);
      if (!claimedMap.has(norm)) {
        const meta = COURSES_DATA.find((c) => normalizeCourseId(c.id) === norm);
        claimedMap.set(norm, {
          id: p.id,
          courseId: norm,
          courseName: meta?.title || p.courseName,
          couponCodeApplied: p.couponCodeApplied || '100% Scholarship',
          purchasedAt: p.purchasedAt,
          detailsPath: getCanonicalCourseRoute(norm)
        });
      }
    });

    // 3. Also verify against active access keys in localStorage
    const keysToCheck = [userId, userEmail].filter(Boolean) as string[];
    keysToCheck.forEach((key) => {
      try {
        const raw = localStorage.getItem(`dopilot_purchased_courses_${key}`);
        if (raw) {
          const list: string[] = JSON.parse(raw);
          if (Array.isArray(list)) {
            list.forEach((cId) => {
              const norm = normalizeCourseId(cId);
              if (!claimedMap.has(norm)) {
                const meta = COURSES_DATA.find((c) => normalizeCourseId(c.id) === norm);
                claimedMap.set(norm, {
                  id: `CLAIM-${norm}`,
                  courseId: norm,
                  courseName: meta?.title || 'Claimed Course',
                  couponCodeApplied: '100% Scholarship',
                  purchasedAt: new Date().toISOString(),
                  detailsPath: getCanonicalCourseRoute(norm)
                });
              }
            });
          }
        }
      } catch {}
    });

    setClaimedCourses(Array.from(claimedMap.values()));
  }, [user]);

  useEffect(() => {
    loadClaimedCourses();

    // Supabase background sync for persistence across logout & login via student_profiles
    if (isSupabaseConfigured() && user?.email) {
      const studentEmail = user.email.toLowerCase().trim();
      const studentId = user.id;

      Promise.resolve(
        supabase
          .from('student_profiles')
          .select('enrolled_courses')
          .eq('email', studentEmail)
          .maybeSingle()
      )
        .then(({ data, error }: any) => {
          if (!error && data && Array.isArray(data.enrolled_courses)) {
            const userKey = `dopilot_purchased_courses_${studentId}`;
            const raw = localStorage.getItem(userKey) || '[]';
            let list: string[] = [];
            try { list = JSON.parse(raw); } catch { list = []; }

            let hasNew = false;
            data.enrolled_courses.forEach((cTitle: string) => {
              const meta = COURSES_DATA.find(
                (c) => c.title.toLowerCase() === cTitle.toLowerCase() || normalizeCourseId(c.id) === normalizeCourseId(cTitle)
              );
              const norm = meta ? normalizeCourseId(meta.id) : normalizeCourseId(cTitle);
              if (!list.includes(norm)) {
                list.push(norm);
                hasNew = true;
              }
            });

            if (hasNew) {
              localStorage.setItem(userKey, JSON.stringify(list));
              loadClaimedCourses();
            }
          }
        })
        .catch(() => {});
    }

    const handleUpdate = () => loadClaimedCourses();
    window.addEventListener('dopilot_course_purchased', handleUpdate);
    window.addEventListener('dopilot_access_granted', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('dopilot_course_purchased', handleUpdate);
      window.removeEventListener('dopilot_access_granted', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [user, loadClaimedCourses]);

  // Certificate Modal State
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [modalCourseId, setModalCourseId] = useState<string>('python-core');

  // Sync tab with URL
  const handleTabChange = (tab: SettingsTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  useEffect(() => {
    const tabParam = searchParams.get('tab') as SettingsTab;
    if (tabParam && ['profile', 'progress', 'rewards', 'certificates'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Keep edit fields accurately populated with current user data
  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditPhone(user.phone || '');
      setEditCollegeOrCompany(user.collegeOrCompany || '');
      setEditWhereDidYouFindUs(user.whereDidYouFindUs || '');
    }
  }, [user, isEditModalOpen]);

  const handleOpenEditModal = () => {
    if (user) {
      setEditName(user.name || '');
      setEditPhone(user.phone || '');
      setEditCollegeOrCompany(user.collegeOrCompany || '');
      setEditWhereDidYouFindUs(user.whereDidYouFindUs || '');
    }
    setEditError(null);
    setIsEditModalOpen(true);
  };

  // If registration is pending, require completion before accessing settings
  if (isPendingRegistration && pendingUser) {
    return (
      <div className="min-h-screen bg-black text-paper flex flex-col justify-center items-center px-4 select-none relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-md w-full p-8 rounded-3xl bg-panel border border-white/10 text-center space-y-5 shadow-2xl relative z-10 backdrop-blur-xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h2 className="font-jakarta font-black text-2xl text-paper">
              Complete Registration Required
            </h2>
            <p className="text-slate text-xs sm:text-sm mt-1">
              Welcome, <span className="text-paper font-semibold">{pendingUser.name}</span>! Please complete your registration form to activate your student workspace and access settings.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/signup?redirect=/settings')}
            className="w-full py-3.5 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Finish Registration Now</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <div>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-slate hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cancel &amp; Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If not logged in, prompt sign-in
  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-black text-paper flex flex-col justify-center items-center px-4 select-none relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-md w-full p-8 rounded-3xl bg-panel border border-white/10 text-center space-y-5 shadow-2xl relative z-10 backdrop-blur-xl">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h2 className="font-jakarta font-black text-2xl text-paper">
              Sign In to View Settings
            </h2>
            <p className="text-slate text-xs sm:text-sm mt-1">
              Please sign in to access your profile, course progress, points, and certificates.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/login?redirect=/settings')}
            className="w-full py-3.5 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Sign In with Google</span>
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate hover:text-paper transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    );
  }

  // =========================================================================
  // Helper to check if a student has saved non-empty MCQ answers
  const hasNonEmptyAnswers = (key: string): boolean => {
    try {
      const raw = localStorage.getItem(key);
      if (raw && raw !== '{}') {
        const parsed = JSON.parse(raw);
        return Object.keys(parsed).length > 0;
      }
    } catch {}
    return false;
  };

  // =========================================================================
  // COURSE PROGRESS DATA (Accurate detection of courses actually started)
  // =========================================================================
  const getPythonProgress = () => {
    const pythonCourse = COURSES_DATA.find(c => c.id === 'python-core') || COURSES_DATA[0];
    let completedCount = 0;
    let highestStarted = 0;
    let hasExplicitActivity = false;

    for (let i = 1; i <= 14; i++) {
      const isComp = (i === 1)
        ? (localStorage.getItem('dopilot_part1_completed') === 'true' || localStorage.getItem('dopilot_completed') === 'true')
        : (localStorage.getItem(`dopilot_part${i}_completed`) === 'true');
      if (isComp) {
        completedCount++;
        hasExplicitActivity = true;
      }

      const secKey = i === 1 ? 'dopilot_active_section_id' : `dopilot_part${i}_active_section_id`;
      const ansKey = i === 1 ? 'dopilot_mcq_answers_v2' : `dopilot_part${i}_mcq_answers_v2`;
      const isPartStarted = isComp || Boolean(localStorage.getItem(secKey)) || hasNonEmptyAnswers(ansKey);
      if (isPartStarted) {
        hasExplicitActivity = true;
        if (i > highestStarted) highestStarted = i;
      }
    }

    const rawLastVisited = localStorage.getItem('dopilot_python_core_last_part');
    const lastVisited = rawLastVisited ? Number(rawLastVisited) : null;
    if (lastVisited && !isNaN(lastVisited) && lastVisited > 0) {
      hasExplicitActivity = true;
      if (lastVisited > highestStarted) highestStarted = lastVisited;
    }

    const isCompleted = completedCount >= 14 || isCourseComplete('python-core');
    const finalCompletedCount = isCompleted ? 14 : completedCount;
    const percentage = isCompleted ? 100 : Math.round((finalCompletedCount / 14) * 100);
    const isStarted = hasExplicitActivity || completedCount > 0 || isCompleted;
    const resumePart = isCompleted ? 14 : (highestStarted > 0 ? highestStarted : 1);
    const activeModuleTitle = pythonCourse.modules[resumePart - 1]?.title || `Part ${resumePart}`;

    return {
      id: 'python-core',
      title: 'Complete Python Course',
      tag: '14 Modules',
      category: 'Programming & Pygame',
      color: 'text-primary',
      isStarted,
      completedCount: finalCompletedCount,
      percentage,
      resumePart,
      activeModuleTitle,
      isCompleted,
      routePath: `/course/python-core/part-${resumePart}`
    };
  };

  const getJavaProgress = () => {
    const javaCourse = COURSES_DATA.find(c => c.id === 'java-core') || COURSES_DATA[1];
    let completedCount = 0;
    let highestStarted = 0;
    let hasExplicitActivity = false;

    for (let i = 1; i <= 14; i++) {
      const isComp = localStorage.getItem(`dopilot_java_part${i}_completed`) === 'true';
      if (isComp) {
        completedCount++;
        hasExplicitActivity = true;
      }

      const secKey = i === 1 ? 'dopilot_java_active_section_id' : `dopilot_java_part${i}_active_section_id`;
      const ansKey = i === 1 ? 'dopilot_java_mcq_answers' : `dopilot_java_part${i}_mcq_answers`;
      const isPartStarted = isComp || Boolean(localStorage.getItem(secKey)) || hasNonEmptyAnswers(ansKey);
      if (isPartStarted) {
        hasExplicitActivity = true;
        if (i > highestStarted) highestStarted = i;
      }
    }

    const rawLastVisited = localStorage.getItem('dopilot_java_core_last_part');
    const lastVisited = rawLastVisited ? Number(rawLastVisited) : null;
    if (lastVisited && !isNaN(lastVisited) && lastVisited > 0) {
      hasExplicitActivity = true;
      if (lastVisited > highestStarted) highestStarted = lastVisited;
    }

    const isCompleted = completedCount >= 14 || isCourseComplete('java-core');
    const finalCompletedCount = isCompleted ? 14 : completedCount;
    const percentage = isCompleted ? 100 : Math.round((finalCompletedCount / 14) * 100);
    const isStarted = hasExplicitActivity || completedCount > 0 || isCompleted;
    const resumePart = isCompleted ? 14 : (highestStarted > 0 ? highestStarted : 1);
    const activeModuleTitle = javaCourse.modules[resumePart - 1]?.title || `Part ${resumePart}`;

    return {
      id: 'java-core',
      title: 'Complete Java Course',
      tag: '14 Modules',
      category: 'OOP & Architecture',
      color: 'text-amber-400',
      isStarted,
      completedCount: finalCompletedCount,
      percentage,
      resumePart,
      activeModuleTitle,
      isCompleted,
      routePath: `/course/complete-java-programming/part-${resumePart}`
    };
  };

  const getFullstackProgress = () => {
    const fsCourse = COURSES_DATA.find(c => c.id === 'fullstack-open') || COURSES_DATA[2];
    let completedCount = 0;
    let highestStarted = -1;
    let hasExplicitActivity = false;

    for (let i = 0; i <= 13; i++) {
      const isComp = localStorage.getItem(`dopilot_fullstack_part${i}_completed`) === 'true';
      if (isComp) {
        completedCount++;
        hasExplicitActivity = true;
      }

      const secKey = `dopilot_fullstack_part${i}_active_section_id`;
      const ansKey = `dopilot_fullstack_part${i}_mcq_answers`;
      const isPartStarted = isComp || Boolean(localStorage.getItem(secKey)) || hasNonEmptyAnswers(ansKey);
      if (isPartStarted) {
        hasExplicitActivity = true;
        if (i > highestStarted) highestStarted = i;
      }
    }

    const rawLastVisited = localStorage.getItem('dopilot_fullstack_core_last_part');
    const lastVisited = (rawLastVisited !== null && !isNaN(Number(rawLastVisited))) ? Number(rawLastVisited) : null;
    if (lastVisited !== null && lastVisited >= 0) {
      hasExplicitActivity = true;
      if (lastVisited > highestStarted) highestStarted = lastVisited;
    }

    const isCompleted = completedCount >= 14 || isCourseComplete('fullstack-open');
    const finalCompletedCount = isCompleted ? 14 : completedCount;
    const percentage = isCompleted ? 100 : Math.round((finalCompletedCount / 14) * 100);
    const isStarted = hasExplicitActivity || completedCount > 0 || isCompleted;
    const resumePart = isCompleted ? 13 : (highestStarted >= 0 ? highestStarted : 0);
    const activeModuleTitle = fsCourse.modules[resumePart]?.title || `Part ${resumePart}`;

    return {
      id: 'fullstack-open',
      title: 'Full Stack Open Course',
      tag: '14 Modules',
      category: 'Modern Web & Cloud',
      color: 'text-emerald-400',
      isStarted,
      completedCount: finalCompletedCount,
      percentage,
      resumePart,
      activeModuleTitle,
      isCompleted,
      routePath: `/course/fullstack-open/part-${resumePart}`
    };
  };

  const getCyberProgress = () => {
    const cyberCourse = COURSES_DATA.find(c => c.id === 'cyber-security') || COURSES_DATA[3];
    let completedCount = 0;
    let highestStarted = 0;
    let hasExplicitActivity = false;

    for (let i = 1; i <= 14; i++) {
      const isComp = localStorage.getItem(`dopilot_cyber_part${i}_completed`) === 'true';
      if (isComp) {
        completedCount++;
        hasExplicitActivity = true;
      }

      const secKey = `dopilot_cyber_part${i}_active_section_id`;
      const ansKey = `dopilot_cyber_part${i}_mcq_answers`;
      const isPartStarted = isComp || Boolean(localStorage.getItem(secKey)) || hasNonEmptyAnswers(ansKey);
      if (isPartStarted) {
        hasExplicitActivity = true;
        if (i > highestStarted) highestStarted = i;
      }
    }

    const rawLastVisited = localStorage.getItem('dopilot_cyber_core_last_part');
    const lastVisited = rawLastVisited ? Number(rawLastVisited) : null;
    if (lastVisited && !isNaN(lastVisited) && lastVisited > 0) {
      hasExplicitActivity = true;
      if (lastVisited > highestStarted) highestStarted = lastVisited;
    }

    const isCompleted = completedCount >= 14 || isCourseComplete('cyber-security');
    const finalCompletedCount = isCompleted ? 14 : completedCount;
    const percentage = isCompleted ? 100 : Math.round((finalCompletedCount / 14) * 100);
    const isStarted = hasExplicitActivity || completedCount > 0 || isCompleted;
    const resumePart = isCompleted ? 14 : (highestStarted > 0 ? highestStarted : 1);
    const activeModuleTitle = cyberCourse?.modules[resumePart - 1]?.title || `Part ${resumePart}`;

    return {
      id: 'cyber-security',
      title: 'Cyber Security Course',
      tag: '14 Modules',
      category: 'Network Defense & Ethical Hacking',
      color: 'text-cyan-400',
      isStarted,
      completedCount: finalCompletedCount,
      percentage,
      resumePart,
      activeModuleTitle,
      isCompleted,
      routePath: `/course/cyber-security/part-${resumePart}`
    };
  };

  const pythonProg = getPythonProgress();
  const javaProg = getJavaProgress();
  const fullstackProg = getFullstackProgress();
  const cyberProg = getCyberProgress();

  const allCoursesList = [pythonProg, javaProg, fullstackProg, cyberProg];
  const startedCourses = allCoursesList.filter(c => c.isStarted);
  const activeTracksCount = startedCourses.length;

  // =========================================================================
  // COMPLETED CERTIFICATES ONLY (GENUINELY EARNED BY FINISHING THE COURSE)
  // =========================================================================
  const allCoursesForCerts = [
    {
      id: 'python-core',
      courseName: 'Complete Python Course',
      certTitle: 'Python Core & Software Architecture',
      isCompleted: pythonProg.isCompleted,
      savedCert: getSavedCertificate('python-core'),
    },
    {
      id: 'java-core',
      courseName: 'Complete Java Course',
      certTitle: 'Complete Java & Enterprise Architecture',
      isCompleted: javaProg.isCompleted,
      savedCert: getSavedCertificate('java-core'),
    },
    {
      id: 'fullstack-open',
      courseName: 'Full Stack Open Course',
      certTitle: 'Full Stack Web Engineering & Architecture',
      isCompleted: fullstackProg.isCompleted,
      savedCert: getSavedCertificate('fullstack-open'),
    },
    {
      id: 'cyber-security',
      courseName: 'Cyber Security Course',
      certTitle: 'Cyber Security Professional Certification',
      isCompleted: cyberProg.isCompleted,
      savedCert: getSavedCertificate('cyber-security'),
    },
  ];

  // ONLY show completed courses in Certificate Hub - must be genuinely completed
  const completedCertificates = allCoursesForCerts.filter(c => c.isCompleted);

  // Handle Save Profile from Modal
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = editName.trim();
    const digits = editPhone.replace(/\D/g, '');

    if (!trimmedName || trimmedName.length < 2) {
      setEditError('Full legal name must be at least 2 characters.');
      return;
    }
    if (!editPhone) {
      setEditError('Phone number is required.');
      return;
    }
    if (digits.length !== 10) {
      setEditError('Phone number must be exactly 10 digits.');
      return;
    }

    updateUserProfile({
      name: trimmedName,
      phone: digits,
      collegeOrCompany: editCollegeOrCompany.trim() || undefined,
      whereDidYouFindUs: editWhereDidYouFindUs.trim() || undefined
    });

    setIsEditModalOpen(false);
    setEditError(null);
    setSaveSuccessMsg('Profile updated successfully!');
    playTwinkleSound();
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  // Handle Milestone Approval Request
  const handleSubmitApprovalRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestModalTier || !user) return;

    setRequestSubmitting(true);
    setRequestError(null);

    const enrolledCourse = (user.enrolledCourses && user.enrolledCourses.length > 0)
      ? user.enrolledCourses[0]
      : 'Complete Python Course';

    const result = submitRewardRequest({
      studentId: user.id,
      studentName: user.name,
      studentEmail: user.email,
      studentPhone: user.phone,
      collegeOrCompany: user.collegeOrCompany,
      courseTitle: enrolledCourse,
      milestoneId: requestModalTier.id,
      milestonePoints: requestModalTier.pointsRequired,
      rewardAmount: requestModalTier.cashAmount,
      pointsBalance: points
    });

    setRequestSubmitting(false);

    if (!result.success) {
      setRequestError(result.error || 'Failed to submit claim request.');
      return;
    }

    const claimedTier = requestModalTier;
    setRewardRequests(getStudentRewardRequests(user.email));
    playTwinkleSound();
    setRequestModalTier(null);
    setClaimSuccessModalTier(claimedTier);
  };

  // Certificate Actions - Download only if course is genuinely complete
  const handleDownloadSavedPdf = async (courseId: string) => {
    if (!isCourseComplete(courseId)) return;
    const cert = getSavedCertificate(courseId);
    if (!cert) return;
    const config = COURSE_CERT_CONFIGS[courseId] || COURSE_CERT_CONFIGS['python-core'];
    try {
      await downloadCertificatePdf(
        cert.studentName,
        cert.certificateId,
        cert.issueDate,
        cert.verificationHash,
        config.title,
        config.subtitle,
        config.competencies
      );
    } catch (err) {
      console.error('Failed to download certificate:', err);
    }
  };

  const handlePrintSavedPdf = async (courseId: string) => {
    if (!isCourseComplete(courseId)) return;
    const cert = getSavedCertificate(courseId);
    if (!cert) return;
    const config = COURSE_CERT_CONFIGS[courseId] || COURSE_CERT_CONFIGS['python-core'];
    await printCertificate(
      cert.studentName,
      cert.certificateId,
      cert.issueDate,
      cert.verificationHash,
      config.title,
      config.subtitle,
      config.competencies,
      courseId
    );
  };

  return (
    <div className="min-h-screen bg-black text-paper relative flex flex-col justify-between selection:bg-primary selection:text-ink pb-20 w-full overflow-x-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] max-w-full h-[280px] bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-[120px] pointer-events-none" />

      {/* Top Navbar Header (Pinned to the LEFT like other pages) */}
      <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 w-full">
        <div className="w-full flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigateBackOrFallback(navigate, window.location.pathname)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-slate hover:text-primary transition-colors cursor-pointer group"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-8 pt-6 sm:pt-8 space-y-6 flex-1 overflow-x-hidden">

        {/* Global Save / Feedback Toast */}
        <AnimatePresence>
          {saveSuccessMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{saveSuccessMsg}</span>
              </div>
              <button onClick={() => setSaveSuccessMsg(null)} className="text-emerald-300 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4 Clean Navigation Tabs - Responsive 2x2 grid on mobile, horizontal row on tablet/laptop/desktop */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-panel border border-white/10 sm:overflow-x-auto no-scrollbar">
          
          <button
            type="button"
            onClick={() => handleTabChange('profile')}
            className={`w-full sm:w-auto sm:flex-1 sm:min-w-[120px] py-2.5 px-2.5 sm:px-3 rounded-xl font-jakarta font-bold text-xs transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-primary text-ink shadow-md shadow-primary/20'
                : 'text-slate hover:text-paper hover:bg-white/[0.04]'
            }`}
          >
            <User className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Profile</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('progress')}
            className={`w-full sm:w-auto sm:flex-1 sm:min-w-[120px] py-2.5 px-2.5 sm:px-3 rounded-xl font-jakarta font-bold text-xs transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
              activeTab === 'progress'
                ? 'bg-primary text-ink shadow-md shadow-primary/20'
                : 'text-slate hover:text-paper hover:bg-white/[0.04]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Course Progress</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('rewards')}
            className={`w-full sm:w-auto sm:flex-1 sm:min-w-[120px] py-2.5 px-2.5 sm:px-3 rounded-xl font-jakarta font-bold text-xs transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
              activeTab === 'rewards'
                ? 'bg-primary text-ink shadow-md shadow-primary/20'
                : 'text-slate hover:text-paper hover:bg-white/[0.04]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Points &amp; Rewards</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('certificates')}
            className={`w-full sm:w-auto sm:flex-1 sm:min-w-[120px] py-2.5 px-2.5 sm:px-3 rounded-xl font-jakarta font-bold text-xs transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
              activeTab === 'certificates'
                ? 'bg-primary text-ink shadow-md shadow-primary/20'
                : 'text-slate hover:text-paper hover:bg-white/[0.04]'
            }`}
          >
            <GraduationCap className="w-4 h-4 shrink-0" />
            <span className="truncate">Certificates</span>
            {completedCertificates.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono shrink-0">
                {completedCertificates.length}
              </span>
            )}
          </button>

        </div>

        {/* ========================================================================= */}
        {/* TAB 1: PROFILE VIEW (CLEAN & DETAILED, NO GREEN RING, NO VERIFIED)        */}
        {/* ========================================================================= */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            
            {/* Profile Overview Card */}
            <div className="rounded-3xl bg-panel border border-white/10 p-5 sm:p-8 space-y-5 sm:space-y-6 shadow-xl relative overflow-hidden">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 pb-5 sm:pb-6 border-b border-white/10">
                <div className="flex items-center gap-3.5 sm:gap-5 min-w-0">
                  {/* User Profile shows user name letters */}
                  <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border border-primary/40 text-primary flex items-center justify-center font-jakarta font-black text-xl sm:text-3xl tracking-wider shadow-lg shadow-primary/10 shrink-0">
                    {getUserInitials(user.name)}
                  </div>
                  <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
                    {/* User Name without verified badge */}
                    <h2 className="font-jakarta font-black text-lg sm:text-2xl text-paper truncate">
                      {user.name}
                    </h2>
                    <p className="text-slate text-xs font-mono truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Edit Profile Button (Opens Modal) */}
                <button
                  type="button"
                  onClick={handleOpenEditModal}
                  className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary/20 shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              </div>

              {/* Clean 3-Metric Overview Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-0.5">
                  <span className="font-mono text-[10px] text-slate/60 uppercase block">Total Points</span>
                  <div className="font-jakarta text-xl font-black text-amber-400">
                    {points} <span className="text-xs font-mono font-normal text-slate/60">pts</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-0.5">
                  <span className="font-mono text-[10px] text-slate/60 uppercase block">Active Tracks</span>
                  <div className="font-jakarta text-xl font-black text-primary">
                    {activeTracksCount} {activeTracksCount === 1 ? 'Track' : 'Tracks'}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-0.5">
                  <span className="font-mono text-[10px] text-slate/60 uppercase block">Certificates</span>
                  <div className="font-jakarta text-xl font-black text-purple-400">
                    {completedCertificates.length} Issued
                  </div>
                </div>
              </div>

              {/* Student Information Grid (Clean 3 tiles: Phone, College, Discovery Source) */}
              <div className="space-y-3 pt-2">
                <h4 className="font-jakarta font-bold text-xs uppercase tracking-wider text-slate/70">
                  Student Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs font-mono">
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1 min-w-0 overflow-hidden">
                    <span className="text-slate/60 text-[10px] uppercase block">Mobile Phone Number</span>
                    <span className="text-paper font-semibold break-all block">
                      {user.phone || 'Not provided'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1 min-w-0 overflow-hidden">
                    <span className="text-slate/60 text-[10px] uppercase block">College / University or Company</span>
                    <span className="text-paper font-semibold break-words block">
                      {user.collegeOrCompany || 'Not provided'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1 min-w-0 overflow-hidden">
                    <span className="text-slate/60 text-[10px] uppercase block">Discovery Source</span>
                    <span className="text-paper font-semibold break-words block">
                      {user.whereDidYouFindUs || 'Direct / Web'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Claimed Course Access Section (Courses claimed via zero-amount coupon) */}
              {claimedCourses.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                      <h4 className="font-jakarta font-bold text-xs uppercase tracking-wider text-slate/70">
                        Claimed Course Access
                      </h4>
                    </div>
                    <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
                      {claimedCourses.length} {claimedCourses.length === 1 ? 'Track Unlocked' : 'Tracks Unlocked'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {claimedCourses.map((claimed) => (
                      <div
                        key={claimed.courseId}
                        className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between gap-3 shadow-md"
                      >
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                              Claimed via Coupon (₹0)
                            </span>
                            {claimed.couponCodeApplied && (
                              <span className="text-[10px] font-mono text-slate/60">
                                • {claimed.couponCodeApplied}
                              </span>
                            )}
                          </div>
                          <h5 className="font-jakarta font-black text-sm text-paper truncate">
                            {claimed.courseName}
                          </h5>
                          <p className="text-[11px] font-mono text-slate/70">
                            Full 14-module curriculum and certificate access unlocked.
                          </p>
                        </div>

                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => navigate(claimed.detailsPath)}
                            className="w-full py-2 px-3.5 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary/20"
                          >
                            <span>Open Course Details</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Enrolled Courses Quick Access */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <h4 className="font-jakarta font-bold text-xs uppercase tracking-wider text-slate/70">
                  Enrolled Tracks
                </h4>

                {startedCourses.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center text-xs font-mono text-slate/60">
                    No active tracks started yet.
                  </div>
                ) : (
                  <div className={`grid grid-cols-1 sm:grid-cols-2 ${startedCourses.length > 2 ? 'lg:grid-cols-4' : ''} gap-2.5 sm:gap-3`}>
                    {startedCourses.map((track) => (
                      <div
                        key={track.id}
                        onClick={() => navigate(track.routePath)}
                        className="p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/20 transition-all flex items-center justify-between cursor-pointer group"
                      >
                        <div className="space-y-0.5 min-w-0 flex-1 pr-2">
                          <span className="font-jakarta font-bold text-xs text-paper group-hover:text-primary transition-colors block truncate">
                            {track.title}
                          </span>
                          {track.isCompleted || track.percentage === 100 ? (
                            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>Completed</span>
                            </div>
                          ) : (
                            <div className="text-[10px] font-mono text-slate/60">
                              {track.completedCount}/14 parts ({track.percentage}%)
                            </div>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate/60 group-hover:text-primary transition-transform group-hover:translate-x-0.5 shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sign Out Action at Bottom of Profile */}
              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-[11px] font-mono text-slate/60 text-center sm:text-left">
                  Account Provider: Google Identity
                </span>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="w-full sm:w-auto py-2.5 sm:py-2 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 font-jakarta font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: COURSE PROGRESS (CLEAN & DETAILED)                                 */}
        {/* ========================================================================= */}
        {activeTab === 'progress' && (
          <div className="space-y-4">
            
            <div className="pb-1">
              <h3 className="font-jakarta font-black text-lg text-paper">
                Course Progress
              </h3>
              <p className="text-slate text-xs mt-0.5">
                Overview of your progress across your active engineering tracks.
              </p>
            </div>

            {startedCourses.length === 0 ? (
              <div className="rounded-3xl bg-panel border border-white/10 p-8 sm:p-12 text-center space-y-4 shadow-xl">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <BookOpen className="w-7 h-7" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h4 className="font-jakarta font-bold text-base text-paper">
                    No Courses Started Yet
                  </h4>
                  <p className="text-slate text-xs leading-relaxed">
                    You haven't started any engineering courses yet. Explore our curriculum to begin your learning journey.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/#courses')}
                  className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all cursor-pointer inline-flex items-center justify-center gap-2 shadow-md shadow-primary/20"
                >
                  <span>Explore Courses</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              startedCourses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-2xl bg-panel border border-white/10 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-lg hover:border-white/20 transition-all"
                >
                  <div className="space-y-2.5 flex-1 max-w-lg">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-jakarta font-bold text-base text-paper">
                        {course.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate/70 font-mono text-[10px]">
                        {course.tag}
                      </span>
                      <span className="text-[11px] font-mono text-slate/60 hidden sm:inline">
                        • {course.category}
                      </span>
                    </div>

                    {/* Active Module Indicator */}
                    <div className="text-xs font-mono text-slate/80 break-words">
                      Active Module: <strong className="text-paper">Part {course.resumePart}</strong>
                      <span className="text-slate/60"> ({course.activeModuleTitle})</span>
                    </div>

                    {/* Progress Bar & Stat */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate">
                          {course.completedCount} of 14 parts completed
                        </span>
                        <span className={course.isCompleted ? "text-emerald-400 font-bold" : "text-primary font-bold"}>
                          {course.percentage}%
                        </span>
                      </div>

                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${course.isCompleted ? 'bg-emerald-400' : 'bg-primary'}`}
                          style={{ width: `${course.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Status / Continue Button */}
                  {course.isCompleted ? (
                    <div className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-jakarta font-bold text-xs flex items-center justify-center gap-2 shadow-sm shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Completed</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate(course.routePath)}
                      className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary/20 shrink-0"
                    >
                      <span>{`Continue Part ${course.resumePart}`}</span>
                      <Play className="w-3 h-3 fill-ink" />
                    </button>
                  )}
                </div>
              ))
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: POINTS & REWARDS (MILESTONE APPROVAL WORKFLOW)                      */}
        {/* ========================================================================= */}
        {activeTab === 'rewards' && (
          <div className="space-y-6">
            
            {/* Points Balance Banner */}
            <div className="rounded-3xl bg-panel border border-white/10 p-5 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-xl">
              <div className="space-y-1">
                <span className="font-mono text-xs text-slate uppercase block">Your Available Balance</span>
                <div className="font-jakarta font-black text-3xl text-amber-400 flex items-baseline gap-2">
                  <span>{points}</span>
                  <span className="text-sm font-mono text-slate/60 font-normal">Points Earned</span>
                </div>
                <p className="text-slate text-xs mt-1">
                  Earn 1 point for each question solved. Points can be redeemed for rewards upon reaching milestones.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-xs font-mono space-y-1 text-slate/80">
                <div className="flex items-center gap-1.5 text-paper font-bold">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                  <span>1 Point = ₹1 Cash Value</span>
                </div>
              </div>
            </div>

            {/* Milestone Reward Tiers Grid */}
            <div className="space-y-4">
              <div className="pb-1">
                <h3 className="font-jakarta font-black text-lg text-paper">
                  Milestone Rewards
                </h3>
                <p className="text-slate text-xs mt-0.5">
                  Request admin approval when you reach an eligible points milestone.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CASH_TIERS.map((tier) => {
                  const req = rewardRequests.find(r => r.milestoneId === tier.id);
                  const isApproved = req?.status === 'approved';
                  const isRejected = req?.status === 'rejected';
                  const isPending = req?.status === 'pending';
                  const canRequest = points >= tier.pointsRequired && !req;

                  return (
                    <div
                      key={tier.id}
                      className={`rounded-2xl border p-5 flex items-center justify-between gap-3 sm:gap-4 transition-all ${
                        isApproved
                          ? 'bg-emerald-500/[0.04] border-emerald-500/30 shadow-md'
                          : isRejected
                          ? 'bg-rose-500/[0.04] border-rose-500/30 shadow-md'
                          : isPending
                          ? 'bg-amber-500/[0.04] border-amber-500/30 shadow-md'
                          : canRequest
                          ? 'bg-panel border-amber-400/30 hover:border-amber-400/60 shadow-lg'
                          : 'bg-panel/40 border-white/10 opacity-70'
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-jakarta font-black text-lg sm:text-xl text-paper">
                            ₹{tier.cashAmount.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs font-mono text-slate">Reward</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate/60 block truncate">
                          Milestone: {tier.pointsRequired.toLocaleString('en-IN')} points
                        </span>
                      </div>

                      <div className="shrink-0">
                        {isApproved ? (
                          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Approved</span>
                          </span>
                        ) : isRejected ? (
                          <span className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm">
                            <XCircle className="w-3.5 h-3.5 text-rose-400" />
                            <span>Rejected</span>
                          </span>
                        ) : isPending ? (
                          <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm">
                            <Clock className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                            <span>Claimed (Pending)</span>
                          </span>
                        ) : canRequest ? (
                          <button
                            type="button"
                            onClick={() => {
                              setRequestModalTier(tier);
                              setRequestError(null);
                            }}
                            className="py-2 px-5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-black font-jakarta font-extrabold text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer flex items-center gap-1.5"
                          >
                            <Trophy className="w-3.5 h-3.5 text-black" />
                            <span>Claim</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="py-2 px-4 rounded-xl bg-white/5 border border-white/10 text-slate/40 font-jakarta font-bold text-xs cursor-not-allowed opacity-60 flex items-center gap-1.5"
                            title={`Reach ${tier.pointsRequired.toLocaleString('en-IN')} points to unlock (need ${(tier.pointsRequired - points).toLocaleString('en-IN')} more)`}
                          >
                            <Lock className="w-3.5 h-3.5 text-slate/40" />
                            <span>Claim ({tier.pointsRequired.toLocaleString('en-IN')} pts)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: CERTIFICATES HUB (SHOWS ONLY COMPLETED COURSES)                     */}
        {/* ========================================================================= */}
        {activeTab === 'certificates' && (
          <div className="space-y-4">
            
            <div className="pb-1">
              <h3 className="font-jakarta font-black text-lg text-paper">
                Completed Course Certificates
              </h3>
              <p className="text-slate text-xs mt-0.5">
                Download your official 16:9 PDF certificates for courses you have finished.
              </p>
            </div>

            {completedCertificates.length === 0 ? (
              /* Clean Empty State when no course completed yet */
              <div className="rounded-3xl bg-panel border border-white/10 p-6 sm:p-12 text-center space-y-4 shadow-xl">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h4 className="font-jakarta font-bold text-base text-paper">
                    No Certificates Unlocked Yet
                  </h4>
                  <p className="text-slate text-xs leading-relaxed">
                    Complete all 14 parts of Complete Python, Complete Java, or Full Stack Open to unlock and download your verified Certificate of Completion.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleTabChange('progress')}
                  className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all cursor-pointer inline-flex items-center justify-center gap-2 shadow-md shadow-primary/20"
                >
                  <span>Go to Course Progress</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              /* Display ONLY Completed Course Certificates */
              <div className="space-y-4">
                {completedCertificates.map((certItem) => (
                  <div
                    key={certItem.id}
                    className="rounded-2xl bg-panel border border-amber-500/30 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-xl"
                  >
                    <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0">
                      {/* Left Graduation Cap Emblem */}
                      <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 shadow-md">
                        <GraduationCap className="w-6 h-6" />
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Course Completed</span>
                          </span>
                          <span className="font-mono text-xs text-slate/70">
                            14 Modules Verified
                          </span>
                        </div>

                        <h4 className="font-jakarta font-black text-base sm:text-lg text-paper break-words">
                          {certItem.certTitle}
                        </h4>

                        {certItem.savedCert && (
                          <p className="font-mono text-xs text-slate/70 break-all sm:break-normal">
                            Credential ID: <span className="text-amber-400 font-bold">{certItem.savedCert.certificateId}</span> • Issued to {certItem.savedCert.studentName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Download & Print Buttons */}
                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                      {certItem.savedCert ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleDownloadSavedPdf(certItem.id)}
                            className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:opacity-95 text-black font-jakarta font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download 16:9 PDF</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePrintSavedPdf(certItem.id)}
                            className="py-2.5 px-3 rounded-xl bg-white/[0.08] hover:bg-white/15 border border-white/15 text-paper font-jakarta font-bold text-xs transition-colors flex items-center justify-center cursor-pointer shrink-0"
                            title="Print"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setModalCourseId(certItem.id);
                            setCertModalOpen(true);
                          }}
                          className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:opacity-95 text-black font-jakarta font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/25"
                        >
                          <Trophy className="w-4 h-4" />
                          <span>Claim Certificate</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* EDIT PROFILE MODAL (MOBILE RESPONSIVE & ZOOM PROOF)                       */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto overscroll-contain">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              className="bg-panel border border-white/15 rounded-3xl w-full max-w-md p-4 sm:p-7 space-y-4 shadow-2xl relative max-h-[92vh] sm:max-h-[90vh] overflow-y-auto overscroll-contain my-auto box-border"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-jakarta font-black text-base sm:text-lg text-paper">
                  Edit Profile
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/15 text-slate hover:text-paper flex items-center justify-center cursor-pointer transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-3.5 sm:space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-jakarta font-bold text-paper">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-paper font-jakarta text-base sm:text-sm focus:outline-none focus:border-primary transition-colors box-border"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-jakarta font-bold text-paper">
                    Mobile Phone Number * (10 digits)
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={editPhone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setEditPhone(val);
                    }}
                    required
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-paper font-jakarta text-base sm:text-sm focus:outline-none focus:border-primary tracking-wide transition-colors box-border"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-jakarta font-bold text-paper">
                    College / University or Company
                  </label>
                  <input
                    type="text"
                    value={editCollegeOrCompany}
                    onChange={(e) => setEditCollegeOrCompany(e.target.value)}
                    placeholder="e.g. IIT Madras, BITS, or Company Name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-paper font-jakarta text-base sm:text-sm focus:outline-none focus:border-primary transition-colors box-border"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-jakarta font-bold text-paper">
                    Where did you discover DO PILOT?
                  </label>
                  <select
                    value={editWhereDidYouFindUs}
                    onChange={(e) => setEditWhereDidYouFindUs(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-paper font-jakarta text-base sm:text-sm focus:outline-none focus:border-primary cursor-pointer transition-colors box-border"
                  >
                    <option value="">Select option</option>
                    <option value="Instagram">Instagram</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Google Search">Google Search</option>
                    <option value="Friend Recommendation">Friend Recommendation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {editError && (
                  <p className="text-xs text-rose-400 flex items-center gap-1 font-mono">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{editError}</span>
                  </p>
                )}

                <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl text-xs font-mono text-slate hover:text-paper hover:bg-white/[0.04] transition-colors cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary text-ink font-jakarta font-extrabold text-xs hover:bg-white transition-colors cursor-pointer shadow-md shadow-primary/20 text-center"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MILESTONE CLAIM MODAL                                                     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {requestModalTier && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-panel border border-amber-500/30 rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-400">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-jakarta font-bold text-base text-paper">
                      Claim Milestone Reward
                    </h3>
                    <span className="text-[10px] font-mono text-slate/60">
                      ₹{requestModalTier.cashAmount.toLocaleString('en-IN')} Reward
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setRequestModalTier(null)}
                  className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/15 text-slate hover:text-paper flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmitApprovalRequest} className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center text-slate/80">
                    <span>Student Name:</span>
                    <strong className="text-paper">{user.name}</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate/80">
                    <span>Email:</span>
                    <span className="text-paper truncate max-w-[200px]">{user.email}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate/80">
                    <span>Your Points:</span>
                    <strong className="text-amber-400 font-bold">{points} pts</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate/80">
                    <span>Milestone Required:</span>
                    <strong className="text-primary font-bold">{requestModalTier.pointsRequired.toLocaleString('en-IN')} pts</strong>
                  </div>
                </div>

                <p className="text-xs text-slate/80 leading-relaxed font-sans">
                  Your milestone claim will be submitted to the admin for verification. Once approved, your status will be updated to <strong className="text-emerald-400 font-semibold">Approved</strong> and your reward will be processed.
                </p>

                {requestError && (
                  <p className="text-xs text-rose-400 flex items-center gap-1 font-mono">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{requestError}</span>
                  </p>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setRequestModalTier(null)}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-slate hover:text-paper cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={requestSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-jakarta font-black text-xs hover:opacity-95 transition-opacity cursor-pointer shadow-md shadow-amber-500/20 disabled:opacity-50"
                  >
                    {requestSubmitting ? 'Submitting...' : 'Confirm & Claim'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* CLAIM SUBMITTED PROFESSIONAL SUCCESS POPUP                                */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {claimSuccessModalTier && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-panel border border-emerald-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-center"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="font-jakarta font-black text-lg text-paper">
                  Reward Claim Submitted
                </h3>
                <p className="text-xs font-mono text-primary font-bold">
                  ₹{claimSuccessModalTier.cashAmount.toLocaleString('en-IN')} Reward
                </p>
              </div>

              <p className="text-xs text-slate/90 leading-relaxed font-sans px-2">
                Your reward claim has been submitted for admin review. The reward will be processed after verification and approval.
              </p>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs font-mono text-left">
                <div className="flex justify-between items-center text-slate/80">
                  <span>Student:</span>
                  <strong className="text-paper">{user.name}</strong>
                </div>
                <div className="flex justify-between items-center text-slate/80">
                  <span>Course:</span>
                  <span className="text-paper truncate max-w-[200px]">{(user.enrolledCourses && user.enrolledCourses.length > 0) ? user.enrolledCourses[0] : 'Complete Python Course'}</span>
                </div>
                <div className="flex justify-between items-center text-slate/80">
                  <span>Points Achieved:</span>
                  <strong className="text-amber-400 font-bold">{points} pts</strong>
                </div>
                <div className="flex justify-between items-center text-slate/80">
                  <span>Status:</span>
                  <span className="text-amber-300 font-bold">Pending Review</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setClaimSuccessModalTier(null)}
                className="w-full py-2.5 px-4 rounded-xl bg-primary text-ink font-jakarta font-extrabold text-xs hover:brightness-110 transition-all cursor-pointer shadow-md shadow-primary/20"
              >
                Understood
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Multi-Course Certificate Modal */}
      <CertificateModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        courseId={modalCourseId}
      />

    </div>
  );
};

export default SettingsPage;
