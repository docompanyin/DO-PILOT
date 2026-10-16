import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, User, CheckCircle2, 
  Edit3, LogOut, Download, Printer, 
  AlertCircle, ChevronRight, X, Play,
  BookOpen, Trophy, IndianRupee, Check, GraduationCap
} from 'lucide-react';
import { useUserAuth } from '../../context/UserAuthContext';
import { useCoursePoints } from '../../context/CoursePointsContext';
import { COURSES_DATA } from '../../data/coursesData';
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

type SettingsTab = 'profile' | 'progress' | 'rewards' | 'certificates';

interface CashRewardTier {
  id: string;
  pointsRequired: number;
  cashAmount: number;
}

interface ClaimedCashRecord {
  rewardId: string;
  cashAmount: number;
  pointsRequired: number;
  upiId: string;
  claimedAt: string;
}

const CASH_TIERS: CashRewardTier[] = [
  { id: 'cash-50', pointsRequired: 50, cashAmount: 50 },
  { id: 'cash-100', pointsRequired: 100, cashAmount: 100 },
  { id: 'cash-250', pointsRequired: 250, cashAmount: 250 },
  { id: 'cash-500', pointsRequired: 500, cashAmount: 500 },
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

  // Cash Reward Redeem Modal State
  const [redeemModalTier, setRedeemModalTier] = useState<CashRewardTier | null>(null);
  const [upiIdInput, setUpiIdInput] = useState('');
  const [upiError, setUpiError] = useState<string | null>(null);

  // Claimed Cash Rewards State
  const cashStorageKey = `dopilot_claimed_cash_${user?.email || 'guest'}`;
  const [claimedCash, setClaimedCash] = useState<Record<string, ClaimedCashRecord>>(() => {
    try {
      const raw = localStorage.getItem(cashStorageKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

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
  // COURSE PROGRESS DATA
  // =========================================================================
  const getPythonProgress = () => {
    const pythonCourse = COURSES_DATA.find(c => c.id === 'python-core') || COURSES_DATA[0];
    let completedCount = 0;
    let highestStarted = 1;
    for (let i = 1; i <= 14; i++) {
      const isComp = (i === 1)
        ? (localStorage.getItem('dopilot_part1_completed') === 'true' || localStorage.getItem('dopilot_completed') === 'true')
        : (localStorage.getItem(`dopilot_part${i}_completed`) === 'true');
      if (isComp) completedCount++;

      const isStarted = isComp || Boolean(localStorage.getItem(i === 1 ? 'dopilot_active_section_id' : `dopilot_part${i}_active_section_id`));
      if (isStarted && i > highestStarted) highestStarted = i;
    }
    const lastVisited = Number(localStorage.getItem('dopilot_python_core_last_part')) || highestStarted;
    const resumePart = completedCount === 14 ? 14 : lastVisited;
    const activeModuleTitle = pythonCourse.modules[resumePart - 1]?.title || `Part ${resumePart}`;

    return {
      completedCount,
      percentage: Math.round((completedCount / 14) * 100),
      resumePart,
      activeModuleTitle,
      isCompleted: completedCount === 14 || isCourseComplete('python-core'),
      routePath: `/course/python-core/part-${resumePart}`
    };
  };

  const getJavaProgress = () => {
    const javaCourse = COURSES_DATA.find(c => c.id === 'java-core') || COURSES_DATA[1];
    let completedCount = 0;
    let highestStarted = 1;
    for (let i = 1; i <= 14; i++) {
      const isComp = localStorage.getItem(`dopilot_java_part${i}_completed`) === 'true';
      if (isComp) completedCount++;

      const isStarted = isComp || Boolean(localStorage.getItem(`dopilot_java_part${i}_active_section_id`));
      if (isStarted && i > highestStarted) highestStarted = i;
    }
    const lastVisited = Number(localStorage.getItem('dopilot_java_core_last_part')) || highestStarted;
    const resumePart = completedCount === 14 ? 14 : lastVisited;
    const activeModuleTitle = javaCourse.modules[resumePart - 1]?.title || `Part ${resumePart}`;

    return {
      completedCount,
      percentage: Math.round((completedCount / 14) * 100),
      resumePart,
      activeModuleTitle,
      isCompleted: completedCount === 14 || isCourseComplete('java-core'),
      routePath: `/course/complete-java-programming/part-${resumePart}`
    };
  };

  const getFullstackProgress = () => {
    const fsCourse = COURSES_DATA.find(c => c.id === 'fullstack-open') || COURSES_DATA[2];
    let completedCount = 0;
    let highestStarted = 0;
    for (let i = 0; i <= 13; i++) {
      const isComp = localStorage.getItem(`dopilot_fullstack_part${i}_completed`) === 'true';
      if (isComp) completedCount++;

      const isStarted = isComp || Boolean(localStorage.getItem(`dopilot_fullstack_part${i}_active_section_id`));
      if (isStarted && i > highestStarted) highestStarted = i;
    }
    const lastVisited = Number(localStorage.getItem('dopilot_fullstack_core_last_part')) || highestStarted;
    const resumePart = completedCount === 14 ? 13 : lastVisited;
    const activeModuleTitle = fsCourse.modules[resumePart]?.title || `Part ${resumePart}`;

    return {
      completedCount,
      percentage: Math.round((completedCount / 14) * 100),
      resumePart,
      activeModuleTitle,
      isCompleted: completedCount === 14 || isCourseComplete('fullstack-open'),
      routePath: `/course/fullstack-open/part-${resumePart}`
    };
  };

  const getCyberProgress = () => {
    const cyberCourse = COURSES_DATA.find(c => c.id === 'cyber-security') || COURSES_DATA[3];
    let completedCount = 0;
    let highestStarted = 1;
    for (let i = 1; i <= 14; i++) {
      const isComp = localStorage.getItem(`dopilot_cyber_part${i}_completed`) === 'true';
      if (isComp) completedCount++;

      const isStarted = isComp || Boolean(localStorage.getItem(`dopilot_cyber_part${i}_active_section_id`));
      if (isStarted && i > highestStarted) highestStarted = i;
    }
    const lastVisited = Number(localStorage.getItem('dopilot_cyber_core_last_part')) || highestStarted;
    const resumePart = completedCount === 14 ? 14 : lastVisited;
    const activeModuleTitle = cyberCourse?.modules[resumePart - 1]?.title || `Part ${resumePart}`;

    return {
      completedCount,
      percentage: Math.round((completedCount / 14) * 100),
      resumePart,
      activeModuleTitle,
      isCompleted: completedCount === 14 || isCourseComplete('cyber-security'),
      routePath: `/course/cyber-security/part-${resumePart}`
    };
  };

  const pythonProg = getPythonProgress();
  const javaProg = getJavaProgress();
  const fullstackProg = getFullstackProgress();
  const cyberProg = getCyberProgress();

  // =========================================================================
  // COMPLETED CERTIFICATES ONLY
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

  // ONLY show completed courses in Certificate Hub
  const completedCertificates = allCoursesForCerts.filter(c => c.isCompleted || Boolean(c.savedCert));

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

  // Handle Cash Reward Claim
  const handleClaimCash = (e: React.FormEvent) => {
    e.preventDefault();
    if (!redeemModalTier) return;
    const cleanUpi = upiIdInput.trim();

    if (!cleanUpi || !cleanUpi.includes('@') || cleanUpi.length < 5) {
      setUpiError('Please enter a valid UPI ID (e.g. mobile@upi or username@okhdfcbank).');
      return;
    }

    const record: ClaimedCashRecord = {
      rewardId: redeemModalTier.id,
      cashAmount: redeemModalTier.cashAmount,
      pointsRequired: redeemModalTier.pointsRequired,
      upiId: cleanUpi,
      claimedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    };

    const updated = { ...claimedCash, [redeemModalTier.id]: record };
    setClaimedCash(updated);
    try {
      localStorage.setItem(cashStorageKey, JSON.stringify(updated));
    } catch {}

    playTwinkleSound();
    setRedeemModalTier(null);
    setUpiIdInput('');
    setUpiError(null);
    setSaveSuccessMsg(`₹${redeemModalTier.cashAmount} cash reward claimed! Transfer initiated to ${cleanUpi}.`);
    setTimeout(() => setSaveSuccessMsg(null), 4500);
  };

  // Certificate Actions
  const handleDownloadSavedPdf = async (courseId: string) => {
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
    <div className="min-h-screen bg-black text-paper relative flex flex-col justify-between selection:bg-primary selection:text-ink pb-20">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[280px] bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-[120px] pointer-events-none" />

      {/* Top Navbar Header (Pinned to the LEFT like other pages) */}
      <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="w-full flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-xs font-mono text-slate hover:text-primary transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-8 pt-6 sm:pt-8 space-y-6 flex-1">

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

        {/* 4 Clean Navigation Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-panel border border-white/10 overflow-x-auto no-scrollbar">
          
          <button
            type="button"
            onClick={() => handleTabChange('profile')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl font-jakarta font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-primary text-ink shadow-md shadow-primary/20'
                : 'text-slate hover:text-paper hover:bg-white/[0.04]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('progress')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl font-jakarta font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'progress'
                ? 'bg-primary text-ink shadow-md shadow-primary/20'
                : 'text-slate hover:text-paper hover:bg-white/[0.04]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Course Progress</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('rewards')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl font-jakarta font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'rewards'
                ? 'bg-primary text-ink shadow-md shadow-primary/20'
                : 'text-slate hover:text-paper hover:bg-white/[0.04]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Points &amp; Rewards</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('certificates')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl font-jakarta font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'certificates'
                ? 'bg-primary text-ink shadow-md shadow-primary/20'
                : 'text-slate hover:text-paper hover:bg-white/[0.04]'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Certificates</span>
            {completedCertificates.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">
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
            <div className="rounded-3xl bg-panel border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
                <div className="flex items-center gap-4 sm:gap-5">
                  {/* User Profile shows user name letters */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border border-primary/40 text-primary flex items-center justify-center font-jakarta font-black text-2xl sm:text-3xl tracking-wider shadow-lg shadow-primary/10 shrink-0">
                    {getUserInitials(user.name)}
                  </div>
                  <div className="space-y-1">
                    {/* User Name without verified badge */}
                    <h2 className="font-jakarta font-black text-xl sm:text-2xl text-paper">
                      {user.name}
                    </h2>
                    <p className="text-slate text-xs font-mono">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Edit Profile Button (Opens Modal) */}
                <button
                  type="button"
                  onClick={handleOpenEditModal}
                  className="py-2.5 px-5 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary/20 shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              </div>

              {/* Clean 3-Metric Overview Bar (Removed Completed Parts 0 / 42) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-0.5">
                  <span className="font-mono text-[10px] text-slate/60 uppercase block">Total Points</span>
                  <div className="font-jakarta text-xl font-black text-amber-400">
                    {points} <span className="text-xs font-mono font-normal text-slate/60">pts</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-0.5">
                  <span className="font-mono text-[10px] text-slate/60 uppercase block">Active Tracks</span>
                  <div className="font-jakarta text-xl font-black text-primary">
                    4 Tracks
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-slate/60 text-[10px] uppercase block">Mobile Phone Number</span>
                    <span className="text-paper font-semibold">
                      {user.phone || 'Not provided'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-slate/60 text-[10px] uppercase block">College / University or Company</span>
                    <span className="text-paper font-semibold">
                      {user.collegeOrCompany || 'Not provided'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-slate/60 text-[10px] uppercase block">Discovery Source</span>
                    <span className="text-paper font-semibold">
                      {user.whereDidYouFindUs || 'Direct / Web'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Enrolled Courses Quick Access */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <h4 className="font-jakarta font-bold text-xs uppercase tracking-wider text-slate/70">
                  Enrolled Tracks
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { id: 'python-core', title: 'Complete Python Course', prog: pythonProg, color: 'text-primary' },
                    { id: 'java-core', title: 'Complete Java Course', prog: javaProg, color: 'text-amber-400' },
                    { id: 'fullstack-open', title: 'Full Stack Open Course', prog: fullstackProg, color: 'text-emerald-400' },
                    { id: 'cyber-security', title: 'Cyber Security Course', prog: cyberProg, color: 'text-cyan-400' },
                  ].map((track) => (
                    <div
                      key={track.id}
                      onClick={() => navigate(track.prog.routePath)}
                      className="p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/20 transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div className="space-y-0.5">
                        <span className="font-jakarta font-bold text-xs text-paper group-hover:text-primary transition-colors">
                          {track.title}
                        </span>
                        <div className="text-[10px] font-mono text-slate/60">
                          {track.prog.completedCount}/14 parts ({track.prog.percentage}%)
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate/60 group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Sign Out Action at Bottom of Profile */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate/60">
                  Account Provider: Google Identity
                </span>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="py-2 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 font-jakarta font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
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
                Overview of your progress across all 4 engineering tracks.
              </p>
            </div>

            {/* 4 Detailed Course Progress Cards */}
            {[
              {
                id: 'python-core',
                title: 'Complete Python Course',
                tag: '14 Modules',
                prog: pythonProg,
                category: 'Programming & Pygame',
                color: 'text-primary'
              },
              {
                id: 'java-core',
                title: 'Complete Java Course',
                tag: '14 Modules',
                prog: javaProg,
                category: 'OOP & Architecture',
                color: 'text-amber-400'
              },
              {
                id: 'fullstack-open',
                title: 'Full Stack Open Course',
                tag: '14 Modules',
                prog: fullstackProg,
                category: 'Modern Web & Cloud',
                color: 'text-emerald-400'
              },
              {
                id: 'cyber-security',
                title: 'Cyber Security Course',
                tag: '14 Modules',
                prog: cyberProg,
                category: 'Network Defense & Ethical Hacking',
                color: 'text-cyan-400'
              }
            ].map((course) => (
              <div
                key={course.id}
                className="rounded-2xl bg-panel border border-white/10 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-lg hover:border-white/20 transition-all"
              >
                <div className="space-y-2.5 flex-1 max-w-lg">
                  <div className="flex items-center gap-2">
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
                  <div className="text-xs font-mono text-slate/80">
                    Active Module: <strong className="text-paper">Part {course.prog.resumePart}</strong>
                    <span className="text-slate/60"> ({course.prog.activeModuleTitle})</span>
                  </div>

                  {/* Progress Bar & Stat */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate">
                        {course.prog.completedCount} of 14 parts completed
                      </span>
                      <span className="text-primary font-bold">
                        {course.prog.percentage}%
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${course.prog.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Continue Button */}
                <button
                  type="button"
                  onClick={() => navigate(course.prog.routePath)}
                  className="py-2.5 px-5 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary/20 shrink-0"
                >
                  <span>{course.prog.isCompleted ? 'Review Course' : `Continue Part ${course.prog.resumePart}`}</span>
                  <Play className="w-3 h-3 fill-ink" />
                </button>
              </div>
            ))}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: POINTS & CASH REWARDS                                              */}
        {/* ========================================================================= */}
        {activeTab === 'rewards' && (
          <div className="space-y-6">
            
            {/* Points Balance Banner */}
            <div className="rounded-3xl bg-panel border border-white/10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-xl">
              <div className="space-y-1">
                <span className="font-mono text-xs text-slate uppercase block">Your Available Balance</span>
                <div className="font-jakarta font-black text-3xl text-amber-400 flex items-baseline gap-2">
                  <span>{points}</span>
                  <span className="text-sm font-mono text-slate/60 font-normal">Points Earned</span>
                </div>
                <p className="text-slate text-xs mt-1">
                  Earn 1 point for each question solved. Points can be redeemed for cash rewards via UPI.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-xs font-mono space-y-1 text-slate/80">
                <div className="flex items-center gap-1.5 text-paper font-bold">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                  <span>1 Point = ₹1 Cash Value</span>
                </div>
                <p className="text-[11px] text-slate/60">
                  Instant UPI transfers upon reaching milestones.
                </p>
              </div>
            </div>

            {/* Cash Reward Tiers Grid */}
            <div className="space-y-4">
              <div className="pb-1">
                <h3 className="font-jakarta font-black text-lg text-paper">
                  Cash Rewards
                </h3>
                <p className="text-slate text-xs mt-0.5">
                  Redeem your points balance directly to your UPI ID.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CASH_TIERS.map((tier) => {
                  const isClaimed = Boolean(claimedCash[tier.id]);
                  const canRedeem = points >= tier.pointsRequired;

                  return (
                    <div
                      key={tier.id}
                      className={`rounded-2xl border p-5 flex items-center justify-between gap-4 transition-all ${
                        isClaimed
                          ? 'bg-emerald-500/[0.04] border-emerald-500/30'
                          : canRedeem
                          ? 'bg-panel border-amber-400/30 hover:border-amber-400/60 shadow-lg'
                          : 'bg-panel/40 border-white/10 opacity-70'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-jakarta font-black text-xl text-paper">
                            ₹{tier.cashAmount}
                          </span>
                          <span className="text-xs font-mono text-slate">Cash</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate/60 block">
                          Requires {tier.pointsRequired} points
                        </span>
                      </div>

                      <div>
                        {isClaimed ? (
                          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Claimed</span>
                          </span>
                        ) : canRedeem ? (
                          <button
                            type="button"
                            onClick={() => {
                              setRedeemModalTier(tier);
                              setUpiIdInput('');
                              setUpiError(null);
                            }}
                            className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:opacity-95 text-black font-jakarta font-extrabold text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer"
                          >
                            Redeem Cash
                          </button>
                        ) : (
                          <span className="text-xs font-mono text-slate/50">
                            Need {tier.pointsRequired - points} more pts
                          </span>
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
              <div className="rounded-3xl bg-panel border border-white/10 p-8 sm:p-12 text-center space-y-4 shadow-xl">
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
                  className="py-2.5 px-5 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs transition-all cursor-pointer inline-flex items-center gap-2 shadow-md shadow-primary/20"
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
                    <div className="flex items-center gap-4">
                      {/* Left Graduation Cap Emblem */}
                      <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 shadow-md">
                        <GraduationCap className="w-6 h-6" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Course Completed</span>
                          </span>
                          <span className="font-mono text-xs text-slate/70">
                            14 Modules Verified
                          </span>
                        </div>

                        <h4 className="font-jakarta font-black text-lg text-paper">
                          {certItem.certTitle}
                        </h4>

                        {certItem.savedCert && (
                          <p className="font-mono text-xs text-slate/70">
                            Credential ID: <span className="text-amber-400 font-bold">{certItem.savedCert.certificateId}</span> • Issued to {certItem.savedCert.studentName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Download & Print Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {certItem.savedCert ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleDownloadSavedPdf(certItem.id)}
                            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:opacity-95 text-black font-jakarta font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download 16:9 PDF</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePrintSavedPdf(certItem.id)}
                            className="py-2.5 px-3 rounded-xl bg-white/[0.08] hover:bg-white/15 border border-white/15 text-paper font-jakarta font-bold text-xs transition-colors flex items-center justify-center cursor-pointer"
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
                          className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:opacity-95 text-black font-jakarta font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/25"
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
      {/* EDIT PROFILE MODAL (4 FIELDS: NAME, PHONE, COLLEGE/COMPANY, DISCOVERY)     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-panel border border-white/15 rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-4 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-jakarta font-black text-base text-paper">
                  Edit Profile
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/15 text-slate hover:text-paper flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-jakarta font-bold text-paper">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-paper font-jakarta text-sm focus:outline-none focus:border-primary"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-paper font-jakarta text-sm focus:outline-none focus:border-primary tracking-wide"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-paper font-jakarta text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-jakarta font-bold text-paper">
                    Where did you discover DO PILOT?
                  </label>
                  <select
                    value={editWhereDidYouFindUs}
                    onChange={(e) => setEditWhereDidYouFindUs(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-paper font-jakarta text-sm focus:outline-none focus:border-primary cursor-pointer"
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
                  <p className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{editError}</span>
                  </p>
                )}

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-slate hover:text-paper cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-primary text-ink font-jakarta font-extrabold text-xs hover:bg-white transition-colors cursor-pointer"
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
      {/* CASH REDEEM MODAL (INPUT UPI ID)                                          */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {redeemModalTier && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-panel border border-amber-500/30 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-400">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-jakarta font-bold text-base text-paper">
                      Redeem ₹{redeemModalTier.cashAmount} Cash
                    </h3>
                    <span className="text-[10px] font-mono text-slate/60">
                      Cost: {redeemModalTier.pointsRequired} points
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setRedeemModalTier(null)}
                  className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/15 text-slate hover:text-paper flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleClaimCash} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-jakarta font-bold text-paper">
                    Enter your UPI ID
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={upiIdInput}
                    onChange={(e) => setUpiIdInput(e.target.value)}
                    placeholder="e.g. yourname@okhdfcbank or 9876543210@paytm"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-paper font-jakarta text-sm focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <p className="text-[11px] text-slate/60 font-mono">
                    Reward amount will be transferred directly to this UPI address.
                  </p>
                </div>

                {upiError && (
                  <p className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{upiError}</span>
                  </p>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setRedeemModalTier(null)}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-slate hover:text-paper cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-jakarta font-black text-xs hover:opacity-95 transition-opacity cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    Confirm &amp; Redeem
                  </button>
                </div>
              </form>
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
