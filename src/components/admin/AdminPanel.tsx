import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout, ShieldCheck, BookOpen, Star, Terminal, Video, ExternalLink,
  Cloud, Shield, Rocket, Save, Plus, Trash2, CheckCircle2,
  RefreshCw, Download, Upload, Eye, EyeOff, LogOut,
  Mail, Users, FileSpreadsheet, FileText, Search,
  Trophy, Award, AlertCircle, ArrowUpDown, Phone, GraduationCap,
  X, AlertTriangle, Grid, List, Copy, Check, Calendar,
  MessageSquare, MessageCircle, Clock, Gift,
  RotateCcw, Unlock, KeyRound, ShieldAlert,
  Tag, ShoppingBag, CreditCard, Percent, Edit3,
  QrCode, CheckCheck, XCircle, Image as ImageIcon,
  Menu, ChevronRight
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useSiteData } from '../../context/DataContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import {
  StudentHelpMessage,
  getStudentHelpMessages,
  updateStudentHelpMessageStatus,
  updateStudentHelpMessageNotes,
  deleteStudentHelpMessage,
  clearResolvedStudentHelpMessages
} from '../../utils/studentHelpService';
import {
  RewardRequest,
  getRewardRequests,
  approveRewardRequest
} from '../../utils/rewardApprovalService';
import {
  LockedCourseRecord,
  CourseResetAuditEntry,
  getLockedCourseRecords,
  scanAndSyncLiveLocks,
  resetStudentCourse,
  getCourseResetAuditEntries,
  getRecordFailedPart,
  getRecordFailedSection
} from '../../utils/courseResetService';
import {
  CoursePricing,
  CourseCoupon,
  CoursePurchaseRecord,
  PaymentQRConfig,
  DEFAULT_PAYMENT_QR_CONFIG,
  verifyImageUrl,
  getCoursePricingList,
  getCourseCoupons,
  getCoursePurchases,
  getPaymentQRConfig,
  updatePaymentQRConfig,
  verifyManualQRPurchase,
  updateCoursePricing,
  createCourseCoupon,
  updateCourseCoupon,
  deleteCourseCoupon,
  toggleCourseCouponActive,
  hasCourseAccess
} from '../../utils/coursePricingService';
import { getUserInitials } from '../../utils/userInitials';

export const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const {
    data,
    updateSection,
    resetToDefaults,
    setAsPermanentDefaults,
    resetToFactoryDefaults,
    importDataJSON
  } = useSiteData();

  const {
    isLoggedIn,
    logoutAdmin,
    auditLogs,
    updateCredentialsWithOldPassword,
    updateRecoveryEmails,
    getAdminUsername,
    getAdminEmails,
    requestEmailChangeOTP,
    verifyEmailChangeOTP,
    addAuditLog
  } = useAdminAuth();

  const adminEmails = getAdminEmails();

  type AdminWorkspace = 'website' | 'students' | 'studentHelp' | 'courseReset' | 'pricingCoupons' | 'paymentSettings';

  const [adminWorkspace, setAdminWorkspace] = useState<AdminWorkspace>(() => {
    try {
      const savedWs = sessionStorage.getItem('dopilot_admin_workspace');
      if (savedWs === 'students' || savedWs === 'website' || savedWs === 'studentHelp' || savedWs === 'courseReset' || savedWs === 'pricingCoupons' || savedWs === 'paymentSettings') return savedWs as AdminWorkspace;
      const savedSec = sessionStorage.getItem('dopilot_admin_active_section');
      if (savedSec === 'students') return 'students';
      if (savedSec === 'studentHelp') return 'studentHelp';
      if (savedSec === 'courseReset') return 'courseReset';
      if (savedSec === 'pricingCoupons') return 'pricingCoupons';
      if (savedSec === 'paymentSettings') return 'paymentSettings';
    } catch (e) {}
    return 'website';
  });

  const switchWorkspace = (ws: AdminWorkspace) => {
    setAdminWorkspace(ws);
    try {
      sessionStorage.setItem('dopilot_admin_workspace', ws);
    } catch (e) {}
  };

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Student Help & Direct Contact Tickets State
  const [helpMessages, setHelpMessages] = useState<StudentHelpMessage[]>(() => getStudentHelpMessages());
  const [helpSearch, setHelpSearch] = useState('');
  const [helpStatusFilter, setHelpStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all');
  const [helpCourseFilter, setHelpCourseFilter] = useState<string>('all');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [editingNotesText, setEditingNotesText] = useState('');

  useEffect(() => {
    const handleHelpUpdate = () => {
      setHelpMessages(getStudentHelpMessages());
    };
    window.addEventListener('dopilot_student_help_update', handleHelpUpdate);
    window.addEventListener('storage', handleHelpUpdate);
    return () => {
      window.removeEventListener('dopilot_student_help_update', handleHelpUpdate);
      window.removeEventListener('storage', handleHelpUpdate);
    };
  }, []);

  const pendingHelpCount = helpMessages.filter(m => m.status === 'pending').length;

  // Course Assessment Reset & Lockout State
  const [lockedRecords, setLockedRecords] = useState<LockedCourseRecord[]>(() => getLockedCourseRecords());
  const [courseResetAuditLogs, setCourseResetAuditLogs] = useState<CourseResetAuditEntry[]>(() => getCourseResetAuditEntries());
  const [courseResetSearch, setCourseResetSearch] = useState('');
  const [courseResetStatusFilter, setCourseResetStatusFilter] = useState<'all' | 'locked' | 'unlocked'>('all');
  const [courseResetCourseFilter, setCourseResetCourseFilter] = useState<string>('all');
  const [courseResetActiveTab, setCourseResetActiveTab] = useState<'directory' | 'audit'>('directory');
  const [confirmResetTarget, setConfirmResetTarget] = useState<LockedCourseRecord | null>(null);
  const [adminResetNotes, setAdminResetNotes] = useState('');
  const [isResettingCourse, setIsResettingCourse] = useState(false);

  useEffect(() => {
    const handleCourseResetUpdate = () => {
      setLockedRecords(getLockedCourseRecords());
      setCourseResetAuditLogs(getCourseResetAuditEntries());
    };
    window.addEventListener('dopilot_locked_courses_updated', handleCourseResetUpdate);
    window.addEventListener('dopilot_course_unlocked', handleCourseResetUpdate);
    window.addEventListener('storage', handleCourseResetUpdate);
    return () => {
      window.removeEventListener('dopilot_locked_courses_updated', handleCourseResetUpdate);
      window.removeEventListener('dopilot_course_unlocked', handleCourseResetUpdate);
      window.removeEventListener('storage', handleCourseResetUpdate);
    };
  }, []);

  const activeLockedCount = lockedRecords.filter(r => r.lockStatus === 'locked').length;

  // Course Pricing & Coupons Management State
  const [coursePricingList, setCoursePricingList] = useState<CoursePricing[]>(() => getCoursePricingList());
  const [selectedPricingCourseId, setSelectedPricingCourseId] = useState<string>('python-core');
  const [courseCoupons, setCourseCoupons] = useState<CourseCoupon[]>(() => getCourseCoupons());
  const [coursePurchases, setCoursePurchases] = useState<CoursePurchaseRecord[]>(() => getCoursePurchases());
  const [couponSearch, setCouponSearch] = useState('');
  const [couponCourseFilter, setCouponCourseFilter] = useState('all');
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CourseCoupon | null>(null);

  // Form state for creating / editing coupon
  const [couponFormCode, setCouponFormCode] = useState('');
  const [couponFormCourseId, setCouponFormCourseId] = useState('all');
  const [couponFormType, setCouponFormType] = useState<'percentage' | 'flat'>('percentage');
  const [couponFormValue, setCouponFormValue] = useState<number>(100);
  const [couponFormMaxUses, setCouponFormMaxUses] = useState<number>(-1);
  const [couponFormExpiry, setCouponFormExpiry] = useState<string>('');
  const [couponFormDesc, setCouponFormDesc] = useState<string>('');
  const [couponFormIsActive, setCouponFormIsActive] = useState<boolean>(true);

  // Form state for editing course pricing
  const activeCoursePricing = coursePricingList.find(p => p.courseId === selectedPricingCourseId) || coursePricingList[0];
  const [pricingRegularInput, setPricingRegularInput] = useState<number>(activeCoursePricing?.regularPrice || 2999);
  const [pricingSaleInput, setPricingSaleInput] = useState<number>(activeCoursePricing?.salePrice || 999);
  const [pricingIsActive, setPricingIsActive] = useState<boolean>(activeCoursePricing?.isActive ?? true);
  const [pricingIsFreeCourse, setPricingIsFreeCourse] = useState<boolean>(activeCoursePricing?.isFreeCourse ?? false);

  useEffect(() => {
    const active = coursePricingList.find(p => p.courseId === selectedPricingCourseId);
    if (active) {
      setPricingRegularInput(active.regularPrice);
      setPricingSaleInput(active.salePrice);
      setPricingIsActive(active.isActive);
      setPricingIsFreeCourse(active.isFreeCourse ?? false);
    }
  }, [selectedPricingCourseId, coursePricingList]);

  // Payment Settings (Google Pay UPI Only) State
  const [paymentQRConfig, setPaymentQRConfig] = useState<PaymentQRConfig>(() => getPaymentQRConfig());
  const [recipientNameInput, setRecipientNameInput] = useState<string>(paymentQRConfig.recipientName || 'Jayadev Nair');
  const [bankingNameInput, setBankingNameInput] = useState<string>(paymentQRConfig.bankingName || paymentQRConfig.merchantName || 'JAYADEV NAIR');
  const [phoneNumberInput, setPhoneNumberInput] = useState<string>(paymentQRConfig.phoneNumber || '+91 97459 49326');
  const [qrUpiIdInput, setQrUpiIdInput] = useState<string>(paymentQRConfig.upiId || 'jayadevnair200518@oksbi');
  const [qrImageUrlInput, setQrImageUrlInput] = useState<string>(paymentQRConfig.qrImageUrl || '');
  const [qrInstructionsInput, setQrInstructionsInput] = useState<string>(
    paymentQRConfig.paymentInstructions || 'Scan using Google Pay or any UPI app. Complete the payment and enter your 12-digit UPI Reference / UTR Number below to verify your enrollment.'
  );
  const [qrTimeoutMinutesInput, setQrTimeoutMinutesInput] = useState<number>(paymentQRConfig.timeoutMinutes || 10);
  const [qrManualEnabledInput, setQrManualEnabledInput] = useState<boolean>(paymentQRConfig.isEnabled !== false);
  const [isSavingQrConfig, setIsSavingQrConfig] = useState(false);
  const [verifyingPurchaseId, setVerifyingPurchaseId] = useState<string | null>(null);

  // Purchase & Enrollment Tracking State
  const [purchaseSearch, setPurchaseSearch] = useState('');
  const [purchaseStatusFilter, setPurchaseStatusFilter] = useState<'all' | 'pending' | 'completed' | 'expired' | 'rejected'>('all');
  const [confirmVerifyPurchaseTarget, setConfirmVerifyPurchaseTarget] = useState<CoursePurchaseRecord | null>(null);
  const [adminVerifyNotes, setAdminVerifyNotes] = useState('');

  // Live Cloudflare QR Image Verification State
  const [isVerifyingQrUrl, setIsVerifyingQrUrl] = useState(false);
  const [qrUrlVerificationStatus, setQrUrlVerificationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [qrUrlVerificationMsg, setQrUrlVerificationMsg] = useState<string | null>(null);

  const pendingManualPayments = coursePurchases.filter(p => p.paymentMethod === 'manual_upi_qr' && p.status === 'pending_verification');

  useEffect(() => {
    const handlePricingCouponsUpdate = () => {
      setCoursePricingList(getCoursePricingList());
      setCourseCoupons(getCourseCoupons());
      setCoursePurchases(getCoursePurchases());
      const updatedQr = getPaymentQRConfig();
      setPaymentQRConfig(updatedQr);
      setRecipientNameInput(updatedQr.recipientName || 'Jayadev Nair');
      setBankingNameInput(updatedQr.bankingName || updatedQr.merchantName || 'JAYADEV NAIR');
      setPhoneNumberInput(updatedQr.phoneNumber || '+91 97459 49326');
      setQrUpiIdInput(updatedQr.upiId || 'jayadevnair200518@oksbi');
      setQrImageUrlInput(updatedQr.qrImageUrl || '');
      setQrTimeoutMinutesInput(updatedQr.timeoutMinutes || 10);
      setQrManualEnabledInput(updatedQr.isEnabled !== false);
    };
    window.addEventListener('dopilot_pricing_updated', handlePricingCouponsUpdate);
    window.addEventListener('dopilot_coupons_updated', handlePricingCouponsUpdate);
    window.addEventListener('dopilot_course_purchased', handlePricingCouponsUpdate);
    window.addEventListener('dopilot_payment_qr_config_updated', handlePricingCouponsUpdate);
    window.addEventListener('dopilot_payment_qr_updated', handlePricingCouponsUpdate);
    window.addEventListener('dopilot_access_granted', handlePricingCouponsUpdate);
    window.addEventListener('storage', handlePricingCouponsUpdate);
    return () => {
      window.removeEventListener('dopilot_pricing_updated', handlePricingCouponsUpdate);
      window.removeEventListener('dopilot_coupons_updated', handlePricingCouponsUpdate);
      window.removeEventListener('dopilot_course_purchased', handlePricingCouponsUpdate);
      window.removeEventListener('dopilot_payment_qr_config_updated', handlePricingCouponsUpdate);
      window.removeEventListener('dopilot_payment_qr_updated', handlePricingCouponsUpdate);
      window.removeEventListener('dopilot_access_granted', handlePricingCouponsUpdate);
      window.removeEventListener('storage', handlePricingCouponsUpdate);
    };
  }, []);

  // Support Contact Numbers (Call & WhatsApp) Configuration State
  const initialSupportChannels = (() => {
    try {
      const raw = localStorage.getItem('dopilot_support_channels_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed) return parsed;
      }
    } catch (e) {}
    return null;
  })();

  const [supportPhoneInput, setSupportPhoneInput] = useState<string>(
    initialSupportChannels?.phone || data.cta?.phone || data.footer?.phone || '+91 97787 07336'
  );
  const [supportWhatsAppInput, setSupportWhatsAppInput] = useState<string>(
    initialSupportChannels?.whatsapp || data.footer?.whatsapp || initialSupportChannels?.phone || data.cta?.phone || data.footer?.phone || '+91 97787 07336'
  );
  const [isSavingSupportNumbers, setIsSavingSupportNumbers] = useState(false);

  useEffect(() => {
    if (!initialSupportChannels) {
      if (data.footer?.phone && !supportPhoneInput) setSupportPhoneInput(data.footer.phone);
      if (data.footer?.whatsapp && !supportWhatsAppInput) setSupportWhatsAppInput(data.footer.whatsapp);
    }
  }, [data.footer]);

  const handleSaveSupportChannels = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSupportNumbers(true);

    const updatedChannels = {
      phone: supportPhoneInput.trim(),
      whatsapp: supportWhatsAppInput.trim()
    };

    try {
      localStorage.setItem('dopilot_support_channels_v1', JSON.stringify(updatedChannels));
      window.dispatchEvent(new CustomEvent('dopilot_support_channels_updated'));
    } catch (e) {}

    if (data.footer) {
      updateSection('footer', {
        ...data.footer,
        phone: supportPhoneInput.trim(),
        whatsapp: supportWhatsAppInput.trim(),
        socialLinks: {
          ...(data.footer?.socialLinks || {}),
          whatsapp: {
            url: `https://wa.me/${supportWhatsAppInput.trim().replace(/[^0-9]/g, '')}`,
            enabled: true
          }
        }
      });
    }

    if (data.cta) {
      updateSection('cta', {
        ...data.cta,
        phone: supportPhoneInput.trim()
      });
    }

    addAuditLog('UPDATE_SUPPORT_CHANNELS', `Support channels updated to Phone: ${supportPhoneInput}, WhatsApp: ${supportWhatsAppInput}`);

    setTimeout(() => {
      setIsSavingSupportNumbers(false);
      showToast('Support Phone & WhatsApp numbers saved successfully!');
    }, 250);
  };

  const [studentViewFormat, setStudentViewFormat] = useState<'cards' | 'table'>('table');
  const [studentExportSearch, setStudentExportSearch] = useState('');
  const [copiedCellId, setCopiedCellId] = useState<string | null>(null);

  type SectionId =
    | 'hero'
    | 'whyUs'
    | 'courses'
    | 'reviews'
    | 'codeLab'
    | 'liveClass'
    | 'footer'
    | 'cloudinary'
    | 'security'
    | 'studentExport';

  const [activeSection, setActiveSectionState] = useState<SectionId>(() => {
    try {
      const saved = sessionStorage.getItem('dopilot_admin_active_section');
      if (saved && saved !== 'students') return saved as SectionId;
    } catch (e) {}
    return 'hero';
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [jsonInput, setJsonInput] = useState('');

  // Cloudinary State
  const [cloudinaryCloudName, setCloudinaryCloudName] = useState(data.cloudinary?.cloudName || '');
  const [cloudinaryUploadPreset, setCloudinaryUploadPreset] = useState(data.cloudinary?.uploadPreset || '');

  useEffect(() => {
    if (data.cloudinary?.cloudName !== undefined) setCloudinaryCloudName(data.cloudinary.cloudName);
    if (data.cloudinary?.uploadPreset !== undefined) setCloudinaryUploadPreset(data.cloudinary.uploadPreset);
  }, [data.cloudinary]);

  // Security Credentials State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState(getAdminUsername());
  const [primaryEmail, setPrimaryEmail] = useState(adminEmails.primaryEmail);
  const [secondaryEmail, setSecondaryEmail] = useState(adminEmails.secondaryEmail);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCredPassword, setShowCredPassword] = useState(false);

  // Email Change OTP Guard State
  const [showEmailOtpModal, setShowEmailOtpModal] = useState(false);
  const [emailOtpCode, setEmailOtpCode] = useState('');
  const [emailOtpNotice, setEmailOtpNotice] = useState<string | null>(null);
  const [emailOtpError, setEmailOtpError] = useState<string | null>(null);

  // --- Student Management & Learning Analytics State ---
  interface StudentSectionProgress {
    partNum: number;
    title: string;
    totalTasks: number;
    solvedTasks: number;
    status: 'passed' | 'failed' | 'in_progress' | 'not_started';
  }

  interface StudentWrongAttempt {
    taskTitle: string;
    section: string;
    failedAt: string;
    detail: string;
  }

  interface StudentAdminRecord {
    id: string;
    name: string;
    email: string;
    avatar: string;
    phone?: string;
    whereDidYouFindUs?: string;
    collegeOrCompany?: string;
    learningGoal?: string;
    hasCompletedDetails: boolean;
    enrolledCourses: string[];
    joinedLiveClass?: boolean;
    createdAt: string;
    points: number;
    solvedTasksCount: number;
    testsAttemptedCount: number;
    testsPassedCount: number;
    testsFailedCount: number;
    hasCertificate: boolean;
    certificateId?: string;
    certificateIssuedDate?: string;
    wrongAttempts: StudentWrongAttempt[];
    sectionProgress: StudentSectionProgress[];
    courseProgressStatus: 'completed' | 'in_progress' | 'enrolled_not_started' | 'registered_only';
  }

  const DEFAULT_STUDENT_ROSTER: StudentAdminRecord[] = [
    {
      id: 'demo-std-1',
      name: 'Rahul Verma',
      email: 'rahul.verma@techsprint.io',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
      phone: '9845012345',
      whereDidYouFindUs: 'LinkedIn',
      collegeOrCompany: 'TechSprint Solutions',
      learningGoal: 'Land a Software Engineer / Dev Job',
      hasCompletedDetails: true,
      enrolledCourses: ['Complete Python Course', 'Complete Java Course'],
      joinedLiveClass: true,
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      points: 24,
      solvedTasksCount: 24,
      testsAttemptedCount: 24,
      testsPassedCount: 24,
      testsFailedCount: 0,
      hasCertificate: true,
      certificateId: 'CERT-DO-PY-9281',
      certificateIssuedDate: new Date(Date.now() - 2 * 86400000).toLocaleDateString(),
      wrongAttempts: [],
      sectionProgress: [
        { partNum: 1, title: 'Part 1: Setup & Python Syntax', totalTasks: 3, solvedTasks: 3, status: 'passed' },
        { partNum: 2, title: 'Part 2: Variables & Data Types', totalTasks: 3, solvedTasks: 3, status: 'passed' },
        { partNum: 3, title: 'Part 3: Operators & Booleans', totalTasks: 3, solvedTasks: 3, status: 'passed' },
        { partNum: 4, title: 'Part 4: Conditionals & Branching', totalTasks: 3, solvedTasks: 3, status: 'passed' },
        { partNum: 5, title: 'Part 5: Loops & While / For', totalTasks: 3, solvedTasks: 3, status: 'passed' },
        { partNum: 6, title: 'Part 6: Functions & Arguments', totalTasks: 3, solvedTasks: 3, status: 'passed' },
        { partNum: 7, title: 'Part 7: Lists & Dictionaries', totalTasks: 3, solvedTasks: 3, status: 'passed' },
        { partNum: 8, title: 'Part 8: Object-Oriented Classes', totalTasks: 3, solvedTasks: 3, status: 'passed' }
      ],
      courseProgressStatus: 'completed'
    },
    {
      id: 'demo-std-2',
      name: 'Priya Patel',
      email: 'priya.patel@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=faces',
      phone: '9876543210',
      whereDidYouFindUs: 'Instagram',
      collegeOrCompany: 'SRM Institute of Science & Technology',
      learningGoal: 'Master Python & Build AI Projects',
      hasCompletedDetails: true,
      enrolledCourses: ['Complete Python Course'],
      joinedLiveClass: true,
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      points: 12,
      solvedTasksCount: 12,
      testsAttemptedCount: 15,
      testsPassedCount: 12,
      testsFailedCount: 3,
      hasCertificate: false,
      wrongAttempts: [
        { taskTitle: 'Equality Operator Test', section: 'Part 3: Operators', failedAt: '2 days ago', detail: 'Selected single "=" assignment instead of comparison "=="' },
        { taskTitle: 'Nested If-Else Indentation', section: 'Part 4: Conditionals', failedAt: 'Yesterday', detail: 'IndentationError: unexpected indent in nested elif block' },
        { taskTitle: 'While Loop Termination', section: 'Part 5: Loops', failedAt: '4 hours ago', detail: 'Omitted counter variable update, resulting in infinite loop' }
      ],
      sectionProgress: [
        { partNum: 1, title: 'Part 1: Setup & Python Syntax', totalTasks: 3, solvedTasks: 3, status: 'passed' },
        { partNum: 2, title: 'Part 2: Variables & Data Types', totalTasks: 3, solvedTasks: 3, status: 'passed' },
        { partNum: 3, title: 'Part 3: Operators & Booleans', totalTasks: 3, solvedTasks: 2, status: 'in_progress' },
        { partNum: 4, title: 'Part 4: Conditionals & Branching', totalTasks: 3, solvedTasks: 2, status: 'in_progress' },
        { partNum: 5, title: 'Part 5: Loops & While / For', totalTasks: 3, solvedTasks: 2, status: 'in_progress' }
      ],
      courseProgressStatus: 'in_progress'
    },
    {
      id: 'demo-std-3',
      name: 'Ananya Iyer',
      email: 'ananya.iyer99@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&h=120&fit=crop&crop=faces',
      phone: '9812345678',
      whereDidYouFindUs: 'YouTube',
      collegeOrCompany: 'Anna University',
      learningGoal: 'College Curriculum & Academic Edge',
      hasCompletedDetails: true,
      enrolledCourses: ['Complete Python Course'],
      joinedLiveClass: false,
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      points: 2,
      solvedTasksCount: 2,
      testsAttemptedCount: 6,
      testsPassedCount: 2,
      testsFailedCount: 4,
      hasCertificate: false,
      wrongAttempts: [
        { taskTitle: 'Quotes in Print Function', section: 'Part 1: Setup', failedAt: '3 days ago', detail: 'SyntaxError: String literal missing closing quote' },
        { taskTitle: 'Variable Naming Conventions', section: 'Part 1: Variables', failedAt: '3 days ago', detail: 'Variable names cannot begin with numerals (e.g. 2name)' },
        { taskTitle: 'String and Integer Concatenation', section: 'Part 2: Data Types', failedAt: '2 days ago', detail: 'TypeError: Must convert integer to string with str() before concatenation' },
        { taskTitle: 'Floor Division vs Float', section: 'Part 2: Data Types', failedAt: 'Yesterday', detail: 'Selected "/" (float output) instead of "//" (integer floor)' }
      ],
      sectionProgress: [
        { partNum: 1, title: 'Part 1: Setup & Python Syntax', totalTasks: 3, solvedTasks: 2, status: 'failed' },
        { partNum: 2, title: 'Part 2: Variables & Data Types', totalTasks: 3, solvedTasks: 0, status: 'failed' }
      ],
      courseProgressStatus: 'in_progress'
    },
    {
      id: 'demo-std-4',
      name: 'Karthik Raja',
      email: 'karthik.raja@outlook.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
      phone: '9940123987',
      whereDidYouFindUs: 'Campus / College Event',
      collegeOrCompany: 'PSG College of Technology',
      learningGoal: 'Career Switch into Tech',
      hasCompletedDetails: true,
      enrolledCourses: ['Complete Python Course'],
      joinedLiveClass: false,
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      points: 0,
      solvedTasksCount: 0,
      testsAttemptedCount: 0,
      testsPassedCount: 0,
      testsFailedCount: 0,
      hasCertificate: false,
      wrongAttempts: [],
      sectionProgress: [],
      courseProgressStatus: 'enrolled_not_started'
    },
    {
      id: 'demo-std-5',
      name: 'Suresh Kumar',
      email: 'suresh.k@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces',
      whereDidYouFindUs: 'Google Search',
      hasCompletedDetails: false,
      enrolledCourses: [],
      joinedLiveClass: false,
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      points: 0,
      solvedTasksCount: 0,
      testsAttemptedCount: 0,
      testsPassedCount: 0,
      testsFailedCount: 0,
      hasCertificate: false,
      wrongAttempts: [],
      sectionProgress: [],
      courseProgressStatus: 'registered_only'
    }
  ];

  const [students, setStudents] = useState<StudentAdminRecord[]>(DEFAULT_STUDENT_ROSTER);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilter, setStudentFilter] = useState<'all' | 'started' | 'completed' | 'top_points' | 'low_marks' | 'registered_only' | 'rewards'>('all');
  const [rewardRequests, setRewardRequests] = useState<RewardRequest[]>(() => getRewardRequests());
  const [rewardStatusFilter, setRewardStatusFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  type StudentDateFilterPreset = 'all' | 'today' | '7days' | '30days' | '90days' | '1year' | 'custom';
  const [studentDatePreset, setStudentDatePreset] = useState<StudentDateFilterPreset>('all');
  const [studentStartDate, setStudentStartDate] = useState<string>('');
  const [studentEndDate, setStudentEndDate] = useState<string>('');
  const [studentSort, setStudentSort] = useState<'points_desc' | 'points_asc' | 'date_desc' | 'name_asc'>('points_desc');
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<StudentAdminRecord | null>(null);

  const fetchStudents = async () => {
    setIsLoadingStudents(true);
    try {
      let cloudStudents: StudentAdminRecord[] = [];
      if (isSupabaseConfigured()) {
        const { data: profiles } = await supabase
          .from('student_profiles')
          .select('*')
          .order('created_at', { ascending: false });

        const { data: progressList } = await supabase
          .from('student_progress')
          .select('*');

        const progressMap = (progressList || []).reduce((acc: any, row: any) => {
          if (row.user_email) acc[row.user_email.toLowerCase()] = row;
          return acc;
        }, {});

        if (profiles && profiles.length > 0) {
          cloudStudents = profiles.map((p: any) => {
            const prog = progressMap[p.email?.toLowerCase()] || {};
            const points = Number(prog.points) || 0;
            const solvedTasks = prog.solved_tasks || {};
            const solvedCount = Object.keys(solvedTasks).length;
            const wrongAttempts = Array.isArray(prog.wrong_attempts) ? prog.wrong_attempts : [];
            const testsFailedCount = wrongAttempts.length;
            const testsPassedCount = solvedCount;
            const testsAttemptedCount = testsPassedCount + testsFailedCount;
            const hasCertificate = Boolean(prog.certificate_issued || points >= 20);
            const certificateId = prog.certificate_id || (hasCertificate ? `CERT-DO-PY-${p.id.slice(-4).toUpperCase()}` : undefined);

            let status: 'completed' | 'in_progress' | 'enrolled_not_started' | 'registered_only';
            if (points >= 20) {
              status = 'completed';
            } else if (points > 0 || solvedCount > 0) {
              status = 'in_progress';
            } else if (p.has_completed_details) {
              status = 'enrolled_not_started';
            } else {
              status = 'registered_only';
            }

            // Calculate section progress
            const sectionProgress: StudentSectionProgress[] = [];
            for (let part = 1; part <= 8; part++) {
              const solvedInPart = Object.keys(solvedTasks).filter(k => k.includes(`part${part}`) || (part === 1 && !k.includes('part'))).length;
              const wrongInPart = wrongAttempts.filter((w: any) => w.section?.includes(`Part ${part}`) || w.section?.includes(`part${part}`)).length;
              let partStatus: 'passed' | 'failed' | 'in_progress' | 'not_started' = 'not_started';
              if (solvedInPart >= 3) {
                partStatus = 'passed';
              } else if (solvedInPart > 0) {
                partStatus = 'in_progress';
              } else if (wrongInPart > 0) {
                partStatus = 'failed';
              }
              sectionProgress.push({
                partNum: part,
                title: `Part ${part}: Python Module`,
                totalTasks: 3,
                solvedTasks: Math.min(3, solvedInPart),
                status: partStatus
              });
            }

            return {
              id: p.id,
              name: p.name || 'Student',
              email: p.email,
              avatar: p.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name || 'Student')}&background=00ff9d&color=000000&bold=true`,
              phone: p.phone,
              whereDidYouFindUs: p.where_did_you_find_us,
              collegeOrCompany: p.college_or_company,
              learningGoal: p.learning_goal,
              hasCompletedDetails: Boolean(p.has_completed_details),
              enrolledCourses: (Array.isArray(p.enrolled_courses) ? p.enrolled_courses : ['Complete Python Course']).map((c: string) => c.replace(/Programming/gi, 'Course')),
              joinedLiveClass: Boolean(p.joined_live_class),
              createdAt: p.created_at || new Date().toISOString(),
              points,
              solvedTasksCount: solvedCount,
              testsAttemptedCount,
              testsPassedCount,
              testsFailedCount,
              hasCertificate,
              certificateId,
              certificateIssuedDate: hasCertificate ? new Date(p.created_at || Date.now()).toLocaleDateString() : undefined,
              wrongAttempts,
              sectionProgress,
              courseProgressStatus: status
            };
          });
        }
      }

      // Check active local user session
      try {
        const localUserRaw = localStorage.getItem('dopilot_student_session_v1');
        if (localUserRaw) {
          const lu = JSON.parse(localUserRaw);
          if (lu && lu.email && !cloudStudents.some((c) => c.email.toLowerCase() === lu.email.toLowerCase())) {
            let localPoints = 0;
            let localSolvedCount = 0;
            try {
              const localPtsRaw = localStorage.getItem(`dopilot_user_${lu.email.replace(/[^a-zA-Z0-9]/g, '_')}_points`) || localStorage.getItem('dopilot_course_points_v3');
              if (localPtsRaw) {
                const parsedPts = JSON.parse(localPtsRaw);
                localPoints = Number(parsedPts.points) || 0;
                localSolvedCount = Object.keys(parsedPts.solvedTasks || {}).length;
              }
            } catch (e) {}

            let localStatus: 'completed' | 'in_progress' | 'enrolled_not_started' | 'registered_only' = 'registered_only';
            if (localPoints >= 20) localStatus = 'completed';
            else if (localPoints > 0) localStatus = 'in_progress';
            else if (lu.hasCompletedDetails) localStatus = 'enrolled_not_started';

            cloudStudents.unshift({
              id: lu.id || 'local-std',
              name: lu.name || 'Active Student',
              email: lu.email,
              avatar: lu.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(lu.name || 'Student')}&background=00ff9d&color=000000&bold=true`,
              phone: lu.phone,
              whereDidYouFindUs: lu.whereDidYouFindUs,
              collegeOrCompany: lu.collegeOrCompany,
              learningGoal: lu.learningGoal,
              hasCompletedDetails: Boolean(lu.hasCompletedDetails),
              enrolledCourses: (lu.enrolledCourses || ['Complete Python Course']).map((c: string) => c.replace(/Programming/gi, 'Course')),
              joinedLiveClass: Boolean(lu.joinedLiveClass),
              createdAt: lu.createdAt || new Date().toISOString(),
              points: localPoints,
              solvedTasksCount: localSolvedCount,
              testsAttemptedCount: localSolvedCount,
              testsPassedCount: localSolvedCount,
              testsFailedCount: 0,
              hasCertificate: localPoints >= 20,
              certificateId: localPoints >= 20 ? 'CERT-DO-PY-USER' : undefined,
              wrongAttempts: [],
              sectionProgress: [
                { partNum: 1, title: 'Part 1: Setup & Python Syntax', totalTasks: 3, solvedTasks: Math.min(3, localPoints), status: localPoints >= 3 ? 'passed' : 'in_progress' }
              ],
              courseProgressStatus: localStatus
            });
          }
        }
      } catch (e) {}

      const cloudEmails = new Set(cloudStudents.map((s) => s.email.toLowerCase()));
      const fallbackDemos = DEFAULT_STUDENT_ROSTER.filter((d) => !cloudEmails.has(d.email.toLowerCase()));
      setStudents([...cloudStudents, ...fallbackDemos]);
    } catch (err) {
      console.warn("Failed to fetch students:", err);
      setStudents(DEFAULT_STUDENT_ROSTER);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const handleRewardUpdate = () => {
      setRewardRequests(getRewardRequests());
    };
    window.addEventListener('dopilot_reward_request_update', handleRewardUpdate);
    window.addEventListener('storage', handleRewardUpdate);
    return () => {
      window.removeEventListener('dopilot_reward_request_update', handleRewardUpdate);
      window.removeEventListener('storage', handleRewardUpdate);
    };
  }, []);

  const handleApproveReward = (requestId: string, studentName: string, milestoneAmount: number) => {
    const success = approveRewardRequest(requestId);
    if (success) {
      setRewardRequests(getRewardRequests());
      showToast(`Approved ₹${milestoneAmount} milestone reward for ${studentName}!`);
    } else {
      showToast('Failed to approve request. Please try again.');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedStudentForReport(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (selectedStudentForReport) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [selectedStudentForReport]);

  // Protect Dashboard
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  const setActiveSection = (id: SectionId) => {
    setActiveSectionState(id);
    try {
      sessionStorage.setItem('dopilot_admin_active_section', id);
    } catch (e) {}
  };

  const showToast = (msg: string, autoReload = false) => {
    setToastMsg(msg);
    if (autoReload) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      setTimeout(() => setToastMsg(null), 3500);
    }
  };

  const navigateToWorkspace = (ws: AdminWorkspace) => {
    switchWorkspace(ws);
    setMobileSidebarOpen(false);
  };

  const navigateToSection = (id: SectionId) => {
    switchWorkspace('website');
    setActiveSection(id);
    setMobileSidebarOpen(false);
  };

  // Save Handlers
  const handleSaveHero = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const headlinePrefix = (formData.get('headlinePrefix') as string) || 'Master Real Tech Skills with';
    const highlightWord = (formData.get('highlightWord') as string) || 'DO PILOT';

    await updateSection('hero', {
      ...data.hero,
      headlinePrefix,
      highlightWord,
      title: `${headlinePrefix} ${highlightWord}`,
      eyebrow: (formData.get('eyebrow') as string) || '',
      headlineWord1: headlinePrefix,
      headlineWord2: highlightWord,
      videoUrl: '',
      videoOpacity: 0,
      description: (formData.get('description') as string) || 'Practical, project-based courses and live classes taught by industry engineers. Learn Python, Java courses, and real-world skills to launch your tech career.',
      pillars: [
        (formData.get('pillar1') as string) || '100% Practical Projects',
        (formData.get('pillar2') as string) || 'Live Interactive Classes',
        (formData.get('pillar3') as string) || '1-on-1 Mentor Support',
      ],
      primaryCtaText: (formData.get('primaryCtaText') as string) || 'Explore Courses',
      primaryCtaLink: (formData.get('primaryCtaLink') as string) || '#courses',
      secondaryCtaText: (formData.get('secondaryCtaText') as string) || 'Join Next Live Class',
      secondaryCtaLink: (formData.get('secondaryCtaLink') as string) || '#live-class',
      scrollCueText: (formData.get('scrollCueText') as string) || 'Explore DO PILOT',
      note: '',
    });
    addAuditLog('UPDATE_HERO', 'Hero section updated.');
    showToast('Hero section saved successfully!');
  };

  const handleSaveWhyUs = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const currentFeatures = data.whyUs?.features || [];
    const features = currentFeatures.map((feat, idx) => ({
      ...feat,
      iconName: (formData.get(`featIcon_${idx}`) as string) || feat.iconName || 'Code',
      title: (formData.get(`featTitle_${idx}`) as string) || feat.title,
      description: (formData.get(`featDesc_${idx}`) as string) || feat.description,
      highlight: (formData.get(`featHighlight_${idx}`) as string) || feat.highlight,
    }));

    const currentComparisons = data.whyUs?.comparisons || [];
    const comparisons = currentComparisons.map((comp, idx) => ({
      feature: (formData.get(`compFeature_${idx}`) as string) || comp.feature,
      traditional: (formData.get(`compTrad_${idx}`) as string) || comp.traditional,
      doPilot: (formData.get(`compDo_${idx}`) as string) || comp.doPilot,
    }));

    updateSection('whyUs', {
      badgeText: (formData.get('whyUsBadge') as string) || 'WHY CHOOSE US',
      title: (formData.get('whyUsTitle') as string) || 'Why DO PILOT?',
      description: (formData.get('whyUsDesc') as string) || '',
      comparisonsTitle: (formData.get('compTitle') as string) || 'How DO PILOT Compares',
      comparisonsSubtitle: (formData.get('compSubtitle') as string) || '',
      tableHeaderFeature: (formData.get('tableHeaderFeature') as string) || 'Feature',
      tableHeaderTraditional: (formData.get('tableHeaderTraditional') as string) || 'Regular Online Courses',
      tableHeaderDoPilot: (formData.get('tableHeaderDoPilot') as string) || 'DO PILOT Platform',
      features,
      comparisons,
    });
    addAuditLog('UPDATE_WHY_US', 'Why Choose Us section updated.');
    showToast('Why Choose Us section saved successfully!');
  };

  const handleSaveCoursesSection = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const currentCourses = data.coursesSection?.courses || [];
    const courses = currentCourses.map((c, idx) => ({
      ...c,
      title: ((formData.get(`courseTitle_${idx}`) as string) || c.title).replace(/Programming/gi, 'Course'),
      category: (formData.get(`courseCategory_${idx}`) as string) || c.category,
      badge: (formData.get(`courseBadge_${idx}`) as string) || c.badge,
      duration: (formData.get(`courseDuration_${idx}`) as string) || c.duration,
      level: (formData.get(`courseLevel_${idx}`) as string) || c.level,
      image: (formData.get(`courseImage_${idx}`) as string) || c.image,
      description: (formData.get(`courseDesc_${idx}`) as string) || c.description,
      tags: ((formData.get(`courseTags_${idx}`) as string) || '')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
    }));

    updateSection('coursesSection', {
      badgeText: (formData.get('coursesBadge') as string) || 'SKILL PATHS',
      title: (formData.get('coursesTitle') as string) || 'Our Courses',
      description: (formData.get('coursesDesc') as string) || '',
      courses,
    });
    addAuditLog('UPDATE_COURSES', 'Courses updated.');
    showToast('Courses section saved successfully!');
  };

  const handleAddCourse = () => {
    const current = [...(data.coursesSection?.courses || [])];
    const newCourse = {
      id: `course-${Date.now()}`,
      category: 'python',
      badge: 'New Course',
      badgeColor: 'bg-primary/20 text-primary border-primary/30',
      image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80',
      title: 'New DO PILOT Course',
      description: 'Hands-on, project-based curriculum designed for engineers.',
      duration: '8 Weeks',
      level: 'All Levels',
      tags: ['Python', 'Project'],
    };
    updateSection('coursesSection', {
      ...data.coursesSection,
      courses: [...current, newCourse],
    });
    showToast('New course added.');
  };

  const handleDeleteCourse = (idx: number) => {
    const current = (data.coursesSection?.courses || []).filter((_, i) => i !== idx);
    updateSection('coursesSection', {
      ...data.coursesSection,
      courses: current,
    });
    showToast('Course removed.');
  };

  const handleSaveReviewsSection = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const currentReviews = data.reviewsSection?.reviews || [];
    const reviews = currentReviews.map((r, idx) => ({
      ...r,
      name: (formData.get(`revName_${idx}`) as string) || r.name,
      role: (formData.get(`revRole_${idx}`) as string) || r.role,
      avatar: (formData.get(`revAvatar_${idx}`) as string) || r.avatar,
      course: (formData.get(`revCourse_${idx}`) as string) || r.course,
      rating: parseInt((formData.get(`revRating_${idx}`) as string) || '5', 10),
      comment: (formData.get(`revComment_${idx}`) as string) || r.comment,
    }));

    updateSection('reviewsSection', {
      badgeText: (formData.get('reviewsBadge') as string) || 'STUDENT STORIES',
      title: (formData.get('reviewsTitle') as string) || 'Student Reviews',
      description: (formData.get('reviewsDesc') as string) || '',
      reviews,
    });
    addAuditLog('UPDATE_REVIEWS', 'Student reviews updated.');
    showToast('Student reviews saved successfully!');
  };

  const handleAddReview = () => {
    const current = [...(data.reviewsSection?.reviews || [])];
    const newRev = {
      id: Date.now(),
      name: 'New Student',
      role: 'Software Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
      course: 'Complete Python Course',
      rating: 5,
      comment: 'Excellent real-world learning experience with DO PILOT mentorship.',
    };
    updateSection('reviewsSection', {
      ...data.reviewsSection,
      reviews: [...current, newRev],
    });
    showToast('New review card added.');
  };

  const handleDeleteReview = (idx: number) => {
    const current = (data.reviewsSection?.reviews || []).filter((_, i) => i !== idx);
    updateSection('reviewsSection', {
      ...data.reviewsSection,
      reviews: current,
    });
    showToast('Review card removed.');
  };

  const handleSaveCodeLab = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateSection('codeLab', {
      badgeText: (formData.get('codeLabBadge') as string) || 'CODE LAB',
      title: (formData.get('codeLabTitle') as string) || 'Run Python Programs Instantly',
      description: (formData.get('codeLabDesc') as string) || '',
      defaultCode: (formData.get('defaultCode') as string) || 'print("Hello, World!")\n',
    });
    addAuditLog('UPDATE_CODE_LAB', 'Code Lab updated.');
    showToast('Code Lab saved successfully!');
  };

  const handleSaveLiveClass = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const benefitsStr = (formData.get('benefits') as string) || '';
    const benefits = benefitsStr
      .split('\n')
      .map(b => b.trim())
      .filter(Boolean);

    updateSection('liveClass', {
      badgeText: (formData.get('liveClassBadge') as string) || 'LIVE CLASS',
      title: (formData.get('liveClassTitle') as string) || 'Upcoming Live Class',
      description: (formData.get('liveClassDesc') as string) || '',
      spotlightBadge: (formData.get('spotlightBadge') as string) || 'Live Workshop • Limited Seats',
      className: (formData.get('className') as string) || 'Building AI-Powered Apps with Python',
      classDescription: (formData.get('classDescription') as string) || '',
      benefits: benefits.length > 0 ? benefits : [
        'Hands-on coding with live mentor guidance',
        'Python & AI API integration',
        'Live Q&A and complete project source code'
      ],
      seatsLeft: (formData.get('seatsLeft') as string) || '14 Spots Left',
      targetDateTime: (formData.get('targetDateTime') as string) || '2026-10-18T18:00',
      date: (formData.get('date') as string) || 'Saturday, Oct 18, 2026',
      time: (formData.get('time') as string) || '6:00 PM – 8:00 PM IST',
      duration: (formData.get('duration') as string) || '2 Hours Hands-on',
      platform: (formData.get('platform') as string) || 'Interactive IDE & Live Stream',
      pricing: (formData.get('pricing') as string) || 'Free',
      mentorName: (formData.get('mentorName') as string) || 'Arunav Sharma',
      mentorRole: (formData.get('mentorRole') as string) || 'Lead Python Engineer & Architect',
      mentorAvatar: (formData.get('mentorAvatar') as string) || '',
      buttonText: (formData.get('buttonText') as string) || 'Join Live Masterclass',
    });
    addAuditLog('UPDATE_LIVE_CLASS', 'Live Class updated.');
    showToast('Live Class saved successfully!');
  };

  const handleSaveFooter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const githubUrl = formData.get('social_github_url') as string;
    const twitterUrl = formData.get('social_twitter_url') as string;
    const linkedinUrl = formData.get('social_linkedin_url') as string;
    const whatsappUrl = formData.get('social_whatsapp_url') as string;

    updateSection('footer', {
      ...data.footer,
      companyName: (formData.get('companyName') as string) || 'DO PILOT',
      companyLogo: (formData.get('companyLogo') as string) || '',
      description: (formData.get('footerDesc') as string) || '',
      email: (formData.get('footerEmail') as string) || 'support@dopilot.com',
      phone: (formData.get('footerPhone') as string) || '+91 97787 07336',
      address: (formData.get('footerAddress') as string) || 'Online & Global Campus',
      copyrightText: (formData.get('copyrightText') as string) || '© 2026 DO PILOT. All rights reserved.',
      exploreTitle: (formData.get('exploreTitle') as string) || 'Explore',
      coursesTitle: (formData.get('coursesTitle') as string) || 'Popular Courses',
      legalTitle: (formData.get('legalTitle') as string) || 'Legal & Policies',
      contactTitle: (formData.get('contactTitle') as string) || 'Contact & Support',
      socialLinks: {
        github: { url: githubUrl || '', enabled: !!githubUrl },
        twitter: { url: twitterUrl || '', enabled: !!twitterUrl },
        linkedin: { url: linkedinUrl || '', enabled: !!linkedinUrl },
        whatsapp: { url: whatsappUrl || '', enabled: !!whatsappUrl },
      },
    });
    addAuditLog('UPDATE_FOOTER', 'Footer details updated.');
    showToast('Footer saved successfully!');
  };

  const handleUpdateCreds = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      showToast('New Password and Confirm Password do not match!', false);
      return;
    }

    const res = updateCredentialsWithOldPassword(currentPassword, newUsername, newPassword);
    if (res.success) {
      showToast(res.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } else {
      showToast(res.message, false);
    }
  };

  const handleUpdateEmails = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await requestEmailChangeOTP();
    if (res.success) {
      setEmailOtpNotice('[SECURITY]: 6-digit OTP code sent to your registered inbox.');
      setShowEmailOtpModal(true);
    }
  };

  const handleConfirmEmailOtpUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailOtpError(null);

    if (verifyEmailChangeOTP(emailOtpCode)) {
      if (updateRecoveryEmails(primaryEmail, secondaryEmail)) {
        setShowEmailOtpModal(false);
        showToast('Dual recovery emails updated successfully!');
        setEmailOtpCode('');
      } else {
        setEmailOtpError('Failed to save updated recovery emails.');
      }
    } else {
      setEmailOtpError('Invalid 6-digit OTP code.');
    }
  };

  const handleExportData = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dopilot_backup_${Date.now()}.json`;
    a.click();
    showToast('Site data backup downloaded.');
  };

  const handleImportData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await importDataJSON(jsonInput)) {
      showToast('Data imported successfully!');
      setJsonInput('');
    } else {
      showToast('Import failed. Invalid JSON.');
    }
  };

  // Section List Navigation Definition
  const sectionsList = [
    { id: 'hero' as SectionId, label: 'Hero Section', icon: Layout, tag: 'Intro & Badges' },
    { id: 'whyUs' as SectionId, label: 'Why Choose Us', icon: ShieldCheck, tag: '4 Cards & Table' },
    { id: 'courses' as SectionId, label: 'Popular Courses', icon: BookOpen, tag: `${data.coursesSection?.courses?.length || 0} Courses` },
    { id: 'reviews' as SectionId, label: 'Student Reviews', icon: Star, tag: `${data.reviewsSection?.reviews?.length || 0} Reviews` },
    { id: 'codeLab' as SectionId, label: 'Python Code Lab', icon: Terminal, tag: 'Interactive IDE' },
    { id: 'liveClass' as SectionId, label: 'Live Masterclass', icon: Video, tag: 'Schedule & Host' },
    { id: 'footer' as SectionId, label: 'Footer & Links', icon: ExternalLink, tag: 'Brand & Social' },
  ];

  const systemList = [
    { id: 'cloudinary' as SectionId, label: 'Cloudinary CDN', icon: Cloud, tag: 'Media Hosting' },
    { id: 'security' as SectionId, label: 'Security & Backup', icon: Shield, tag: 'Credentials' },
    { id: 'studentExport' as SectionId, label: 'Extract Student Data', icon: FileSpreadsheet, tag: `${students.length} Contacts` },
    { id: 'studentHelpNav' as any, label: 'Student Help Desk', icon: MessageSquare, tag: `${pendingHelpCount} Tickets` },
  ];

  // Render Subcomponents
  const renderHeroSection = () => (
    <section id="section-hero" className="rounded-3xl bg-[#0c0d0e] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl relative">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-jakarta text-lg font-black text-paper">Hero Section</h2>
            <span className="font-mono text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold">01</span>
          </div>
          <p className="text-xs text-slate mt-0.5">Top headline, 3 value pillars, and CTA action buttons.</p>
        </div>
      </div>

      <form onSubmit={handleSaveHero} className="space-y-6 text-sm">
        {/* Headline Group */}
        <div className="p-5 rounded-2xl bg-black/50 border border-white/5 space-y-4">
          <span className="font-mono text-xs text-primary font-bold uppercase tracking-wider block">// HEADLINE &amp; SUBTITLE</span>
          <div>
            <label className="block font-mono text-[11px] text-slate mb-1">Eyebrow Badge (Optional)</label>
            <input
              type="text"
              name="eyebrow"
              defaultValue={data.hero.eyebrow || ''}
              placeholder="e.g. // MASTER SOFTWARE ENGINEERING"
              className="w-full bg-black border border-white/15 rounded-xl px-4 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[11px] text-slate mb-1">Headline Prefix</label>
              <input
                type="text"
                name="headlinePrefix"
                defaultValue={data.hero.headlinePrefix ?? "Master Real Tech Skills with"}
                className="w-full bg-black border border-white/15 rounded-xl px-4 py-2.5 text-paper focus:border-primary focus:outline-none font-bold"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-slate mb-1">Glowing Highlight Word</label>
              <input
                type="text"
                name="highlightWord"
                defaultValue={data.hero.highlightWord ?? "DO PILOT"}
                className="w-full bg-black border border-white/15 rounded-xl px-4 py-2.5 text-primary focus:border-primary focus:outline-none font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[11px] text-slate mb-1">Subtitle / Description</label>
            <textarea
              name="description"
              rows={2}
              defaultValue={data.hero.description}
              className="w-full bg-black border border-white/15 rounded-xl px-4 py-2.5 text-paper focus:border-primary focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* 3 Pillars Group */}
        <div className="p-5 rounded-2xl bg-black/50 border border-white/5 space-y-4">
          <span className="font-mono text-xs text-primary font-bold uppercase tracking-wider block">// 3 VALUE PILLARS</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-mono text-[10px] text-slate mb-1">Pillar 1</label>
              <input
                type="text"
                name="pillar1"
                defaultValue={data.hero.pillars[0] || '100% Practical Projects'}
                className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-paper text-xs focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-slate mb-1">Pillar 2</label>
              <input
                type="text"
                name="pillar2"
                defaultValue={data.hero.pillars[1] || 'Live Interactive Classes'}
                className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-paper text-xs focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-slate mb-1">Pillar 3</label>
              <input
                type="text"
                name="pillar3"
                defaultValue={data.hero.pillars[2] || '1-on-1 Mentor Support'}
                className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-paper text-xs focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Buttons & Video Group */}
        <div className="p-5 rounded-2xl bg-black/50 border border-white/5 space-y-4">
          <span className="font-mono text-xs text-primary font-bold uppercase tracking-wider block">// CTA BUTTONS &amp; VIDEO</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[11px] text-slate mb-1">Primary CTA Button</label>
              <input
                type="text"
                name="primaryCtaText"
                defaultValue={data.hero.primaryCtaText}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-slate mb-1">Primary CTA Destination Link</label>
              <input
                type="text"
                name="primaryCtaLink"
                defaultValue={data.hero.primaryCtaLink}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-slate mb-1">Secondary CTA Button</label>
              <input
                type="text"
                name="secondaryCtaText"
                defaultValue={data.hero.secondaryCtaText}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-slate mb-1">Secondary CTA Destination Link</label>
              <input
                type="text"
                name="secondaryCtaLink"
                defaultValue={data.hero.secondaryCtaLink}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block font-mono text-[11px] text-slate mb-1">Scroll Cue Text</label>
            <input
              type="text"
              name="scrollCueText"
              defaultValue={data.hero.scrollCueText ?? "Explore DO PILOT"}
              className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary text-ink font-jakarta font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-white hover:shadow-lg hover:shadow-primary/30 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Hero Changes</span>
          </button>
        </div>
      </form>
    </section>
  );

  const renderWhyUsSection = () => (
    <section id="section-whyUs" className="rounded-3xl bg-[#0c0d0e] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl relative">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-jakarta text-lg font-black text-paper">Why Choose Us</h2>
            <span className="font-mono text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold">02</span>
          </div>
          <p className="text-xs text-slate mt-0.5">Key advantages and side-by-side comparison matrix with legacy courses.</p>
        </div>
      </div>

      <form onSubmit={handleSaveWhyUs} className="space-y-6 text-sm">
        <div className="p-5 rounded-2xl bg-black/50 border border-white/5 space-y-4">
          <span className="font-mono text-xs text-primary font-bold uppercase tracking-wider block">// SECTION HEADER</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[11px] text-slate mb-1">Badge Text</label>
              <input
                type="text"
                name="whyUsBadge"
                defaultValue={data.whyUs?.badgeText || 'WHY CHOOSE US'}
                className="w-full bg-black border border-white/15 rounded-xl px-4 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-slate mb-1">Title</label>
              <input
                type="text"
                name="whyUsTitle"
                defaultValue={data.whyUs?.title || 'Why DO PILOT?'}
                className="w-full bg-black border border-white/15 rounded-xl px-4 py-2 text-paper text-xs font-bold focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block font-mono text-[11px] text-slate mb-1">Description</label>
            <textarea
              name="whyUsDesc"
              rows={2}
              defaultValue={data.whyUs?.description || ''}
              className="w-full bg-black border border-white/15 rounded-xl px-4 py-2 text-paper text-xs focus:border-primary focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="p-5 rounded-2xl bg-black/50 border border-white/5 space-y-4">
          <span className="font-mono text-xs text-primary font-bold uppercase tracking-wider block">// 4 FEATURE PILLARS</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(data.whyUs?.features || []).map((feat, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-black border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-primary font-bold">Feature #{idx + 1}</span>
                  <input
                    type="text"
                    name={`featHighlight_${idx}`}
                    defaultValue={feat.highlight}
                    placeholder="Badge Text"
                    className="bg-black/60 border border-white/15 rounded-md px-2 py-0.5 text-[10px] text-paper font-mono focus:border-primary focus:outline-none"
                  />
                </div>
                <input
                  type="text"
                  name={`featTitle_${idx}`}
                  defaultValue={feat.title}
                  placeholder="Card Title"
                  className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-paper font-bold focus:border-primary focus:outline-none"
                />
                <textarea
                  name={`featDesc_${idx}`}
                  rows={2}
                  defaultValue={feat.description}
                  placeholder="Card Description"
                  className="w-full bg-black/60 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-slate focus:border-primary focus:outline-none resize-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="p-5 rounded-2xl bg-black/50 border border-white/5 space-y-4">
          <span className="font-mono text-xs text-primary font-bold uppercase tracking-wider block">// COMPARISON SHOWCASE MATRIX</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[11px] text-slate mb-1">Matrix Title</label>
              <input
                type="text"
                name="compTitle"
                defaultValue={data.whyUs?.comparisonsTitle || 'How DO PILOT Compares'}
                className="w-full bg-black border border-white/15 rounded-xl px-4 py-2 text-paper text-xs font-bold focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-slate mb-1">Matrix Subtitle</label>
              <input
                type="text"
                name="compSubtitle"
                defaultValue={data.whyUs?.comparisonsSubtitle || 'See the direct difference between regular courses and our engineering mentorship.'}
                className="w-full bg-black border border-white/15 rounded-xl px-4 py-2 text-paper text-xs focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block font-mono text-[10px] text-slate mb-1">Col 1 Header</label>
              <input
                type="text"
                name="tableHeaderFeature"
                defaultValue={data.whyUs?.tableHeaderFeature || 'Feature'}
                className="w-full bg-black border border-white/15 rounded-lg px-3 py-1.5 text-xs text-paper font-mono focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-slate mb-1">Col 2 Header (Competitors)</label>
              <input
                type="text"
                name="tableHeaderTraditional"
                defaultValue={data.whyUs?.tableHeaderTraditional || 'Regular Online Courses'}
                className="w-full bg-black border border-white/15 rounded-lg px-3 py-1.5 text-xs text-rose-300 font-mono focus:border-rose-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-slate mb-1">Col 3 Header (DO PILOT)</label>
              <input
                type="text"
                name="tableHeaderDoPilot"
                defaultValue={data.whyUs?.tableHeaderDoPilot || 'DO PILOT Platform'}
                className="w-full bg-black border border-white/15 rounded-lg px-3 py-1.5 text-xs text-primary font-mono font-bold focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <span className="font-mono text-xs text-slate font-bold uppercase tracking-wider block pt-3">// COMPARISON ROWS</span>
          <div className="space-y-2.5">
            {(data.whyUs?.comparisons || []).map((comp, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-black border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  name={`compFeature_${idx}`}
                  defaultValue={comp.feature}
                  placeholder="Feature name"
                  className="bg-black/60 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-paper font-bold focus:border-primary focus:outline-none"
                />
                <input
                  type="text"
                  name={`compTrad_${idx}`}
                  defaultValue={comp.traditional}
                  placeholder="Traditional"
                  className="bg-black/60 border border-rose-500/20 rounded-lg px-3 py-1.5 text-xs text-slate focus:border-rose-400 focus:outline-none"
                />
                <input
                  type="text"
                  name={`compDo_${idx}`}
                  defaultValue={comp.doPilot}
                  placeholder="DO PILOT"
                  className="bg-black/60 border border-emerald-500/30 rounded-lg px-3 py-1.5 text-xs text-paper font-semibold focus:border-primary focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary text-ink font-jakarta font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-white hover:shadow-lg hover:shadow-primary/30 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Why Us Changes</span>
          </button>
        </div>
      </form>
    </section>
  );

  const renderCoursesSection = () => (
    <section id="section-courses" className="rounded-3xl bg-[#0c0d0e] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl relative">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-jakarta text-lg font-black text-paper">Popular Courses</h2>
            <span className="font-mono text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold">03</span>
          </div>
          <p className="text-xs text-slate mt-0.5">Manage curriculum course cards, duration, difficulty, tags, and syllabus previews.</p>
        </div>
        <button
          type="button"
          onClick={handleAddCourse}
          className="px-3.5 py-1.5 rounded-xl bg-primary/20 hover:bg-primary text-primary hover:text-ink font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Course</span>
        </button>
      </div>

      <form onSubmit={handleSaveCoursesSection} className="space-y-6 text-sm">
        <div className="p-5 rounded-2xl bg-black/50 border border-white/5 space-y-4">
          <span className="font-mono text-xs text-primary font-bold uppercase tracking-wider block">// SECTION HEADER</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[11px] text-slate mb-1">Badge</label>
              <input
                type="text"
                name="coursesBadge"
                defaultValue={data.coursesSection?.badgeText || 'SKILL PATHS'}
                className="w-full bg-black border border-white/15 rounded-xl px-4 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-slate mb-1">Title</label>
              <input
                type="text"
                name="coursesTitle"
                defaultValue={data.coursesSection?.title || 'Our Courses'}
                className="w-full bg-black border border-white/15 rounded-xl px-4 py-2 text-paper text-xs font-bold focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block font-mono text-[11px] text-slate mb-1">Description / Subtitle</label>
            <textarea
              name="coursesDesc"
              rows={2}
              defaultValue={data.coursesSection?.description || 'Practical courses designed to take you from fundamentals to job-ready projects.'}
              className="w-full bg-black border border-white/15 rounded-xl px-4 py-2 text-paper text-xs focus:border-primary focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Course Cards List */}
        <div className="space-y-4">
          {(data.coursesSection?.courses || []).map((c, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="font-mono text-xs text-primary font-bold">Course #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteCourse(idx)}
                  className="p-1.5 rounded-lg text-slate hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Remove Course"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-mono text-[10px] text-slate mb-1">Title</label>
                  <input
                    type="text"
                    name={`courseTitle_${idx}`}
                    defaultValue={c.title?.replace(/Programming/gi, 'Course')}
                    className="w-full bg-black border border-white/15 rounded-lg px-3 py-1.5 text-xs text-paper font-bold focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-slate mb-1">Badge (e.g. Bestseller)</label>
                  <input
                    type="text"
                    name={`courseBadge_${idx}`}
                    defaultValue={c.badge}
                    className="w-full bg-black border border-white/15 rounded-lg px-3 py-1.5 text-xs text-paper focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-mono text-[10px] text-slate mb-1">Duration</label>
                    <input
                      type="text"
                      name={`courseDuration_${idx}`}
                      defaultValue={c.duration}
                      className="w-full bg-black border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-paper focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-slate mb-1">Level</label>
                    <input
                      type="text"
                      name={`courseLevel_${idx}`}
                      defaultValue={c.level}
                      className="w-full bg-black border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-paper focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] text-slate mb-1">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    name={`courseTags_${idx}`}
                    defaultValue={(c.tags || []).join(', ')}
                    className="w-full bg-black border border-white/15 rounded-lg px-3 py-1.5 text-xs text-paper font-mono focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-slate mb-1">Thumbnail Image URL</label>
                  <input
                    type="text"
                    name={`courseImage_${idx}`}
                    defaultValue={c.image}
                    className="w-full bg-black border border-white/15 rounded-lg px-3 py-1.5 text-xs text-paper font-mono focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-slate mb-1">Description</label>
                <textarea
                  name={`courseDesc_${idx}`}
                  rows={2}
                  defaultValue={c.description}
                  className="w-full bg-black border border-white/15 rounded-lg px-3 py-1.5 text-xs text-slate focus:border-primary focus:outline-none resize-none"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary text-ink font-jakarta font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-white hover:shadow-lg hover:shadow-primary/30 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Courses Changes</span>
          </button>
        </div>
      </form>
    </section>
  );

  const renderReviewsSection = () => (
    <section id="section-reviews" className="rounded-3xl bg-[#0c0d0e] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl relative">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-jakarta text-lg font-black text-paper">Student Reviews</h2>
            <span className="font-mono text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold">04</span>
          </div>
          <p className="text-xs text-slate mt-0.5">Student feedback and testimonials.</p>
        </div>
        <button
          type="button"
          onClick={handleAddReview}
          className="px-3.5 py-1.5 rounded-xl bg-primary/20 hover:bg-primary text-primary hover:text-ink font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Review</span>
        </button>
      </div>

      <form onSubmit={handleSaveReviewsSection} className="space-y-6 text-sm">
        <div className="p-5 rounded-2xl bg-black/50 border border-white/5 space-y-4">
          <span className="font-mono text-xs text-primary font-bold uppercase tracking-wider block">// SECTION HEADER</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[11px] text-slate mb-1">Badge</label>
              <input
                type="text"
                name="reviewsBadge"
                defaultValue={data.reviewsSection?.badgeText || 'STUDENT STORIES'}
                className="w-full bg-black border border-white/15 rounded-xl px-4 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-slate mb-1">Title</label>
              <input
                type="text"
                name="reviewsTitle"
                defaultValue={data.reviewsSection?.title || 'Student Reviews'}
                className="w-full bg-black border border-white/15 rounded-xl px-4 py-2 text-paper text-xs font-bold focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[11px] text-slate mb-1">Description / Subtitle</label>
            <textarea
              name="reviewsDesc"
              rows={2}
              defaultValue={data.reviewsSection?.description || 'Real feedback from learners who gained practical skills and built their careers with DO PILOT.'}
              className="w-full bg-black border border-white/15 rounded-xl px-4 py-2 text-paper text-xs focus:border-primary focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {(data.reviewsSection?.reviews || []).map((r, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="font-mono text-xs text-primary font-bold">Review #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteReview(idx)}
                  className="p-1.5 rounded-lg text-slate hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Remove Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  name={`revName_${idx}`}
                  defaultValue={r.name}
                  placeholder="Student name"
                  className="bg-black border border-white/15 rounded-lg px-3 py-1.5 text-xs text-paper font-bold focus:border-primary focus:outline-none"
                />
                <input
                  type="text"
                  name={`revRole_${idx}`}
                  defaultValue={r.role}
                  placeholder="Job title / company"
                  className="bg-black border border-white/15 rounded-lg px-3 py-1.5 text-xs text-paper focus:border-primary focus:outline-none"
                />
                <input
                  type="text"
                  name={`revCourse_${idx}`}
                  defaultValue={r.course}
                  placeholder="Course name"
                  className="bg-black border border-white/15 rounded-lg px-3 py-1.5 text-xs text-paper focus:border-primary focus:outline-none"
                />
              </div>

              <textarea
                name={`revComment_${idx}`}
                rows={2}
                defaultValue={r.comment}
                placeholder="Student testimonial"
                className="w-full bg-black border border-white/15 rounded-lg px-3 py-1.5 text-xs text-slate focus:border-primary focus:outline-none resize-none"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary text-ink font-jakarta font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-white hover:shadow-lg hover:shadow-primary/30 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Reviews Changes</span>
          </button>
        </div>
      </form>
    </section>
  );

  const renderCodeLabSection = () => (
    <section id="section-codeLab" className="rounded-3xl bg-[#0c0d0e] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl relative">
      <div className="flex items-center justify-between pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-jakarta text-lg font-black text-paper">Python Code Lab</h2>
            <span className="font-mono text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold">05</span>
          </div>
          <p className="text-xs text-slate mt-0.5">In-browser live Python playground title, description, and initial code.</p>
        </div>
      </div>

      <form onSubmit={handleSaveCodeLab} className="space-y-6 text-sm">
        <div className="p-5 rounded-2xl bg-black/50 border border-white/5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[11px] text-slate mb-1">Badge</label>
              <input
                type="text"
                name="codeLabBadge"
                defaultValue={data.codeLab?.badgeText || 'CODE LAB'}
                className="w-full bg-black border border-white/15 rounded-xl px-4 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-slate mb-1">Title</label>
              <input
                type="text"
                name="codeLabTitle"
                defaultValue={data.codeLab?.title || 'Run Python Programs Instantly'}
                className="w-full bg-black border border-white/15 rounded-xl px-4 py-2 text-paper text-xs font-bold focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block font-mono text-[11px] text-slate mb-1">Description</label>
            <textarea
              name="codeLabDesc"
              rows={2}
              defaultValue={data.codeLab?.description || 'Write, test, and execute Python 3.12 code directly in your browser.'}
              className="w-full bg-black border border-white/15 rounded-xl px-4 py-2 text-paper text-xs focus:border-primary focus:outline-none resize-none"
            />
          </div>
          <div>
            <label className="block font-mono text-[11px] text-slate mb-1">Default Starter Python Code</label>
            <textarea
              name="defaultCode"
              rows={5}
              defaultValue={data.codeLab?.defaultCode || 'print("Hello, World!")\n'}
              className="w-full bg-black border border-white/15 rounded-xl px-4 py-3 text-primary font-mono text-xs focus:border-primary focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary text-ink font-jakarta font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-white hover:shadow-lg hover:shadow-primary/30 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Code Lab</span>
          </button>
        </div>
      </form>
    </section>
  );

  const renderLiveClassSection = () => (
    <section id="section-liveClass" className="rounded-3xl bg-[#0c0d0e] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl relative">
      <div className="flex items-center justify-between pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-jakarta text-lg font-black text-paper">Live Masterclass</h2>
            <span className="font-mono text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold">06</span>
          </div>
          <p className="text-xs text-slate mt-0.5">Upcoming live interactive workshop schedule, mentor name, and seat counter.</p>
        </div>
      </div>

      <form onSubmit={handleSaveLiveClass} className="space-y-6 text-sm">
        <div className="p-5 rounded-2xl bg-black/50 border border-white/5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-[11px] text-slate mb-1">Badge</label>
              <input
                type="text"
                name="liveClassBadge"
                defaultValue={data.liveClass?.badgeText || 'LIVE CLASS'}
                className="w-full bg-black border border-white/15 rounded-xl px-4 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-slate mb-1">Section Title</label>
              <input
                type="text"
                name="liveClassTitle"
                defaultValue={data.liveClass?.title || 'Upcoming Live Class'}
                className="w-full bg-black border border-white/15 rounded-xl px-4 py-2 text-paper text-xs font-bold focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-slate mb-1">Spotlight Badge</label>
              <input
                type="text"
                name="spotlightBadge"
                defaultValue={data.liveClass?.spotlightBadge || 'Live Workshop • Limited Seats'}
                className="w-full bg-black border border-white/15 rounded-xl px-4 py-2 text-rose-400 font-mono text-xs focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[11px] text-slate mb-1">Section Description / Subtitle</label>
            <textarea
              name="liveClassDesc"
              rows={2}
              defaultValue={data.liveClass?.description || 'Join our interactive live masterclass. Code alongside experienced engineers and ask your questions live.'}
              className="w-full bg-black border border-white/15 rounded-xl px-4 py-2 text-paper text-xs focus:border-primary focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[11px] text-slate mb-1">Class / Masterclass Name</label>
              <input
                type="text"
                name="className"
                defaultValue={data.liveClass?.className || 'Python & AI Assistant: Live Masterclass'}
                className="w-full bg-black border border-white/15 rounded-xl px-4 py-2 text-paper text-xs font-bold focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-slate mb-1">Class Description</label>
              <input
                type="text"
                name="classDescription"
                defaultValue={data.liveClass?.classDescription || 'Build a functional AI assistant with Python and live API integration in a 2-hour interactive code-along.'}
                className="w-full bg-black border border-white/15 rounded-xl px-4 py-2 text-paper text-xs focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Schedule & Live Countdown Timer Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-[11px] text-slate mb-1">
                Target Date &amp; Time (Countdown Timer)
              </label>
              <input
                type="datetime-local"
                name="targetDateTime"
                defaultValue={data.liveClass?.targetDateTime || '2026-10-18T18:00'}
                className="w-full bg-black border border-white/15 rounded-xl px-4 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
              />
              <span className="block font-mono text-[10px] text-slate/70 mt-1">
                Timer automatically counts down to this exact date &amp; time.
              </span>
            </div>
            <div>
              <label className="block font-mono text-[11px] text-slate mb-1">Display Date (Card)</label>
              <input
                type="text"
                name="date"
                defaultValue={data.liveClass?.date || 'Saturday, Oct 18, 2026'}
                className="w-full bg-black border border-white/15 rounded-xl px-4 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
              />
              <span className="block font-mono text-[10px] text-slate/70 mt-1">e.g. Saturday, Oct 18, 2026</span>
            </div>
            <div>
              <label className="block font-mono text-[11px] text-slate mb-1">Display Time (Card)</label>
              <input
                type="text"
                name="time"
                defaultValue={data.liveClass?.time || '6:00 PM – 8:00 PM IST'}
                className="w-full bg-black border border-white/15 rounded-xl px-4 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
              />
              <span className="block font-mono text-[10px] text-slate/70 mt-1">e.g. 6:00 PM – 8:00 PM IST</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[10px] text-slate mb-1">Platform</label>
              <input
                type="text"
                name="platform"
                defaultValue={data.liveClass?.platform || 'Live on Google Meet / Zoom'}
                className="w-full bg-black border border-white/15 rounded-lg px-3 py-1.5 text-xs text-paper focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-slate mb-1">Seats Remaining</label>
              <input
                type="text"
                name="seatsLeft"
                defaultValue={data.liveClass?.seatsLeft || '14 Spots Left'}
                className="w-full bg-black border border-white/15 rounded-lg px-3 py-1.5 text-xs text-primary font-mono font-bold focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-mono text-[10px] text-slate mb-1">Mentor Name</label>
              <input
                type="text"
                name="mentorName"
                defaultValue={data.liveClass?.mentorName || 'Lead Mentor'}
                className="w-full bg-black border border-white/15 rounded-lg px-3 py-1.5 text-xs text-paper font-bold focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-slate mb-1">Mentor Role</label>
              <input
                type="text"
                name="mentorRole"
                defaultValue={data.liveClass?.mentorRole || 'Senior Software Engineer at DO PILOT'}
                className="w-full bg-black border border-white/15 rounded-lg px-3 py-1.5 text-xs text-paper focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-slate mb-1">Mentor Avatar URL</label>
              <input
                type="text"
                name="mentorAvatar"
                defaultValue={data.liveClass?.mentorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'}
                className="w-full bg-black border border-white/15 rounded-lg px-3 py-1.5 text-xs text-paper font-mono focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] text-slate mb-1">CTA Button Text</label>
              <input
                type="text"
                name="buttonText"
                defaultValue={data.liveClass?.buttonText || 'Reserve Your Free Spot'}
                className="w-full bg-black border border-white/15 rounded-lg px-3 py-1.5 text-xs text-primary font-bold focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] text-slate mb-1">Takeaway Benefits (One per line)</label>
            <textarea
              name="benefits"
              rows={3}
              defaultValue={(data.liveClass?.benefits || []).join('\n')}
              className="w-full bg-black border border-white/15 rounded-lg px-3 py-2 text-xs text-paper font-mono focus:border-primary focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary text-ink font-jakarta font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-white hover:shadow-lg hover:shadow-primary/30 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Live Class</span>
          </button>
        </div>
      </form>
    </section>
  );

  const renderFooterSection = () => (
    <section id="section-footer" className="rounded-3xl bg-[#0c0d0e] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl relative">
      <div className="flex items-center justify-between pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-jakarta text-lg font-black text-paper">Footer &amp; Links</h2>
            <span className="font-mono text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold">07</span>
          </div>
          <p className="text-xs text-slate mt-0.5">Brand name, campus location, official email, phone, and social media channels.</p>
        </div>
      </div>

      <form onSubmit={handleSaveFooter} className="space-y-6 text-sm">
        <div className="p-5 rounded-2xl bg-black/50 border border-white/5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block font-mono text-[11px] text-slate mb-1">Company / Brand Name</label>
              <input
                type="text"
                name="companyName"
                defaultValue={data.footer?.companyName || 'DO PILOT'}
                className="w-full bg-black border border-white/15 rounded-xl px-4 py-2 text-paper text-xs font-bold focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-slate mb-1">Company Logo URL</label>
              <input
                type="text"
                name="companyLogo"
                defaultValue={data.footer?.companyLogo || data.navbar?.companyLogo || 'https://res.cloudinary.com/ufo0zltq/image/upload/v1786197046/Do_PNG_ssyhu1.png'}
                className="w-full bg-black border border-white/15 rounded-xl px-4 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-slate mb-1">Support Email</label>
              <input
                type="email"
                name="footerEmail"
                defaultValue={data.footer?.email || 'support@dopilot.com'}
                className="w-full bg-black border border-white/15 rounded-xl px-4 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-slate mb-1">Phone Number</label>
              <input
                type="text"
                name="footerPhone"
                defaultValue={data.footer?.phone || '+91 97787 07336'}
                className="w-full bg-black border border-white/15 rounded-xl px-4 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[11px] text-slate mb-1">Campus / Location</label>
              <input
                type="text"
                name="footerAddress"
                defaultValue={data.footer?.address || 'Online & Global Campus'}
                className="w-full bg-black border border-white/15 rounded-xl px-4 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-slate mb-1">Copyright Line</label>
              <input
                type="text"
                name="copyrightText"
                defaultValue={data.footer?.copyrightText || '© 2026 DO PILOT. All rights reserved.'}
                className="w-full bg-black border border-white/15 rounded-xl px-4 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-black border border-white/10 space-y-3">
            <span className="font-mono text-xs text-primary font-bold uppercase tracking-wider block">// 4 COLUMN HEADINGS</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block font-mono text-[10px] text-slate mb-1">Col 1 Title</label>
                <input
                  type="text"
                  name="exploreTitle"
                  defaultValue={data.footer?.exploreTitle || 'Explore'}
                  className="w-full bg-black border border-white/15 rounded-lg px-3 py-1.5 text-xs text-paper font-bold focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] text-slate mb-1">Col 2 Title</label>
                <input
                  type="text"
                  name="coursesTitle"
                  defaultValue={data.footer?.coursesTitle || 'Popular Courses'}
                  className="w-full bg-black border border-white/15 rounded-lg px-3 py-1.5 text-xs text-paper font-bold focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] text-slate mb-1">Col 3 Title</label>
                <input
                  type="text"
                  name="legalTitle"
                  defaultValue={data.footer?.legalTitle || 'Legal & Policies'}
                  className="w-full bg-black border border-white/15 rounded-lg px-3 py-1.5 text-xs text-paper font-bold focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] text-slate mb-1">Col 4 Title</label>
                <input
                  type="text"
                  name="contactTitle"
                  defaultValue={data.footer?.contactTitle || 'Contact & Support'}
                  className="w-full bg-black border border-white/15 rounded-lg px-3 py-1.5 text-xs text-paper font-bold focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-mono text-[11px] text-slate mb-1">Footer Tagline / Summary</label>
            <textarea
              name="footerDesc"
              rows={2}
              defaultValue={data.footer?.description || ''}
              className="w-full bg-black border border-white/15 rounded-xl px-4 py-2 text-paper text-xs focus:border-primary focus:outline-none resize-none"
            />
          </div>

          {/* Social Links */}
          <div className="pt-2">
            <span className="font-mono text-xs text-primary font-bold uppercase tracking-wider block mb-2">// SOCIAL MEDIA LINKS</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <input
                type="text"
                name="social_whatsapp_url"
                defaultValue={data.footer?.socialLinks?.whatsapp?.url || 'https://wa.me/919778707336'}
                placeholder="WhatsApp URL"
                className="bg-black border border-white/15 rounded-lg px-3 py-1.5 text-xs text-paper font-mono focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                name="social_github_url"
                defaultValue={data.footer?.socialLinks?.github?.url || ''}
                placeholder="GitHub URL"
                className="bg-black border border-white/15 rounded-lg px-3 py-1.5 text-xs text-paper font-mono focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                name="social_linkedin_url"
                defaultValue={data.footer?.socialLinks?.linkedin?.url || ''}
                placeholder="LinkedIn URL"
                className="bg-black border border-white/15 rounded-lg px-3 py-1.5 text-xs text-paper font-mono focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                name="social_twitter_url"
                defaultValue={data.footer?.socialLinks?.twitter?.url || ''}
                placeholder="Twitter / X URL"
                className="bg-black border border-white/15 rounded-lg px-3 py-1.5 text-xs text-paper font-mono focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary text-ink font-jakarta font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-white hover:shadow-lg hover:shadow-primary/30 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Footer Changes</span>
          </button>
        </div>
      </form>
    </section>
  );

  const renderCloudinarySection = () => (
    <section id="section-cloudinary" className="rounded-3xl bg-[#0c0d0e] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl relative">
      <div className="flex items-center justify-between pb-5 border-b border-white/10">
        <div>
          <h2 className="font-jakarta text-lg font-black text-paper">Cloudinary CDN Media Hosting</h2>
          <p className="text-xs text-slate mt-0.5">Stream high-resolution course assets and background videos without slowing down your app.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-mono text-[11px] text-slate mb-1">Cloud Name</label>
          <input
            type="text"
            value={cloudinaryCloudName}
            onChange={(e) => setCloudinaryCloudName(e.target.value)}
            placeholder="e.g. ufo0zltq"
            className="w-full bg-black border border-white/15 rounded-xl px-4 py-2.5 text-paper focus:border-primary focus:outline-none font-mono text-xs"
          />
        </div>
        <div>
          <label className="block font-mono text-[11px] text-slate mb-1">Unsigned Upload Preset</label>
          <input
            type="text"
            value={cloudinaryUploadPreset}
            onChange={(e) => setCloudinaryUploadPreset(e.target.value)}
            placeholder="e.g. dopilot_preset"
            className="w-full bg-black border border-white/15 rounded-xl px-4 py-2.5 text-paper focus:border-primary focus:outline-none font-mono text-xs"
          />
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={() => {
            updateSection('cloudinary', {
              cloudName: cloudinaryCloudName.trim(),
              uploadPreset: cloudinaryUploadPreset.trim()
            });
            showToast('Cloudinary CDN settings saved!');
          }}
          className="px-6 py-2.5 rounded-xl bg-primary text-ink font-jakarta font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-white hover:shadow-lg hover:shadow-primary/30 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Cloudinary Settings</span>
        </button>
      </div>
    </section>
  );

  const renderSecuritySection = () => (
    <section id="section-security" className="space-y-6">
      {/* Change Credentials Card */}
      <form onSubmit={handleUpdateCreds} className="rounded-3xl bg-[#0c0d0e] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div>
            <h2 className="font-jakarta text-lg font-black text-paper">Admin Credentials</h2>
            <p className="text-xs text-slate mt-0.5">Authorize credential updates using your current password.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[11px] text-amber-400 font-bold mb-1">Current Admin Password *</label>
            <div className="relative">
              <input
                type={showCredPassword ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                className="w-full bg-black border border-amber-500/40 rounded-xl px-4 py-2.5 text-paper focus:border-amber-400 focus:outline-none font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => setShowCredPassword(!showCredPassword)}
                className="absolute right-3 top-2.5 text-slate hover:text-paper"
              >
                {showCredPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block font-mono text-[11px] text-slate mb-1">Admin Username / Email</label>
            <input
              type="text"
              required
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full bg-black border border-white/15 rounded-xl px-4 py-2.5 text-paper focus:border-primary focus:outline-none font-mono text-xs"
            />
          </div>
          <div>
            <label className="block font-mono text-[11px] text-slate mb-1">New Password</label>
            <input
              type={showCredPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 6 characters"
              className="w-full bg-black border border-white/15 rounded-xl px-4 py-2.5 text-paper focus:border-primary focus:outline-none font-mono text-xs"
            />
          </div>
          <div>
            <label className="block font-mono text-[11px] text-slate mb-1">Confirm New Password</label>
            <input
              type={showCredPassword ? 'text' : 'password'}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Repeat new password"
              className="w-full bg-black border border-white/15 rounded-xl px-4 py-2.5 text-paper focus:border-primary focus:outline-none font-mono text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary text-ink font-jakarta font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-white hover:shadow-lg hover:shadow-primary/30 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Update Password</span>
          </button>
        </div>
      </form>

      {/* Recovery Emails Card */}
      <form onSubmit={handleUpdateEmails} className="rounded-3xl bg-[#0c0d0e] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div>
            <h2 className="font-jakarta text-lg font-black text-paper">Emergency Dual Recovery Emails</h2>
            <p className="text-xs text-slate mt-0.5">Registered backup emails used to receive 6-digit OTP verification codes if you forget credentials.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[11px] text-slate mb-1">Primary Recovery Email</label>
            <input
              type="email"
              required
              value={primaryEmail}
              onChange={(e) => setPrimaryEmail(e.target.value)}
              placeholder="primary@gmail.com"
              className="w-full bg-black border border-white/15 rounded-xl px-4 py-2.5 text-paper focus:border-primary focus:outline-none font-mono text-xs"
            />
          </div>
          <div>
            <label className="block font-mono text-[11px] text-slate mb-1">Secondary Backup Email</label>
            <input
              type="email"
              required
              value={secondaryEmail}
              onChange={(e) => setSecondaryEmail(e.target.value)}
              placeholder="backup@gmail.com"
              className="w-full bg-black border border-white/15 rounded-xl px-4 py-2.5 text-paper focus:border-primary focus:outline-none font-mono text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary text-ink font-jakarta font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-white hover:shadow-lg hover:shadow-primary/30 transition-all cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>Update Recovery Emails (Send OTP)</span>
          </button>
        </div>
      </form>

      {/* Backup & Factory Preset Card */}
      <div className="rounded-3xl bg-[#0c0d0e] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div>
            <h2 className="font-jakarta text-lg font-black text-paper">Presets &amp; Data Backup</h2>
            <p className="text-xs text-slate mt-0.5">Download full site JSON backups or lock in your modifications as the permanent default preset.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm("Save all current modifications as the permanent default preset?")) {
                setAsPermanentDefaults();
                showToast("Saved as permanent baseline defaults!");
              }
            }}
            className="px-5 py-2.5 rounded-xl bg-primary text-ink font-mono text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-white transition-all shadow-md shadow-primary/20"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Lock As Permanent Defaults</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm("Reset all site data back to your saved Permanent Defaults?")) {
                resetToDefaults();
                showToast("Reset to Permanent Defaults.");
              }
            }}
            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-paper hover:border-primary font-mono text-xs flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-primary" />
            <span>Reset to Permanent Defaults</span>
          </button>

          <button
            onClick={handleExportData}
            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-paper hover:border-primary font-mono text-xs flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-primary" />
            <span>Download Backup JSON</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm("Revert to factory original baseline?")) {
                resetToFactoryDefaults();
                showToast("Reverted to factory original template.");
              }
            }}
            className="px-5 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 font-mono text-xs flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Restore Factory Baseline</span>
          </button>
        </div>

        {/* Import JSON */}
        <form onSubmit={handleImportData} className="pt-4 border-t border-white/10 space-y-3">
          <label className="block font-mono text-xs text-slate">Import Backup JSON Data</label>
          <textarea
            rows={3}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste JSON backup string here..."
            className="w-full bg-black border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none font-mono text-xs resize-none"
          />
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-white/5 border border-white/15 text-paper hover:border-primary font-mono text-xs flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-primary" />
            <span>Import JSON</span>
          </button>
        </form>
      </div>

      {/* Security Logs */}
      <div className="rounded-3xl bg-[#0c0d0e] border border-white/10 p-6 sm:p-8 space-y-4 shadow-2xl">
        <h3 className="font-mono text-xs font-bold text-primary uppercase tracking-wider">// RECENT AUDIT LOGS</h3>
        <div className="max-h-48 overflow-y-auto space-y-2 font-mono text-xs pr-2">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3 rounded-xl bg-black border border-white/5 flex items-center justify-between text-[11px]">
              <div>
                <span className="text-primary font-bold">{log.action}: </span>
                <span className="text-paper">{log.details}</span>
              </div>
              <span className="text-slate/60 text-[10px] shrink-0 ml-2">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const copyContactToClipboard = (text: string, id: string, label: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedCellId(id);
      showToast(`Copied ${label} to clipboard!`);
      setTimeout(() => {
        setCopiedCellId((prev) => (prev === id ? null : prev));
      }, 2000);
    } catch (e) {
      showToast('Could not copy to clipboard.');
    }
  };

  const handleExportAllStudentCSV = () => {
    const headers = [
      '#',
      'Student Name',
      'Email Address',
      'Phone Number',
      'College / Organization',
      'Enrolled Courses',
      'Where Did You Find Us',
      'Total Points',
      'Learning Status',
      'Registered Date'
    ];

    const rows = students.map((s, idx) => [
      idx + 1,
      `"${(s.name || '').replace(/"/g, '""')}"`,
      `"${(s.email || '').replace(/"/g, '""')}"`,
      `"${(s.phone && s.phone !== 'Phone not added' ? s.phone : 'N/A').replace(/"/g, '""')}"`,
      `"${(s.collegeOrCompany || 'N/A').replace(/"/g, '""')}"`,
      `"${(s.enrolledCourses?.join(', ') || 'None').replace(/"/g, '""')}"`,
      `"${(s.whereDidYouFindUs || 'N/A').replace(/"/g, '""')}"`,
      s.points || 0,
      `"${(s.courseProgressStatus || 'registered').replace(/"/g, '""')}"`,
      `"${new Date(s.createdAt).toLocaleDateString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DO_PILOT_Students_Contact_Data_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Extracted and downloaded ${students.length} student records as CSV!`);
  };

  const handleCopyAllEmails = () => {
    const emails = students.map((s) => s.email).filter(Boolean);
    if (!emails.length) {
      showToast('No student emails available to copy.');
      return;
    }
    navigator.clipboard.writeText(emails.join(', '));
    showToast(`Copied ${emails.length} student emails to clipboard!`);
  };

  const handleCopyAllPhones = () => {
    const phones = students.map((s) => s.phone).filter((p): p is string => Boolean(p && p !== 'Phone not added' && p.trim().length >= 10));
    if (!phones.length) {
      showToast('No student phone numbers available to copy.');
      return;
    }
    navigator.clipboard.writeText(phones.join(', '));
    showToast(`Copied ${phones.length} valid phone numbers to clipboard!`);
  };

  const renderStudentExportSection = () => {
    const filteredStudents = students.filter((s) => {
      if (!studentExportSearch.trim()) return true;
      const q = studentExportSearch.toLowerCase();
      return (
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.phone?.toLowerCase().includes(q)
      );
    });

    const validPhonesCount = students.filter(
      (s) => s.phone && s.phone !== 'Phone not added' && s.phone.trim().length >= 10
    ).length;

    return (
      <section id="section-student-export" className="rounded-3xl bg-[#0c0d0e] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* Header & Cleanly Organized Action Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-jakarta text-lg font-black text-paper">Extract Student Data</h2>
              <span className="font-mono text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold">
                Contacts Only
              </span>
            </div>
            <p className="text-xs text-slate mt-0.5">
              Minimal contact directory. Full student data is exported in the CSV file.
            </p>
          </div>

          {/* Cleanly Organized Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleExportAllStudentCSV}
              className="px-4 py-2.5 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20 active:scale-95"
              title="Download CSV spreadsheet with all complete student details"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>EXPORT CSV</span>
            </button>

            <button
              type="button"
              onClick={handleCopyAllPhones}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-jakarta text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              title="Copy all 10-digit mobile numbers for WhatsApp or SMS"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Copy All Phones</span>
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-[10px] font-mono font-bold">
                ({validPhonesCount})
              </span>
            </button>

            <button
              type="button"
              onClick={handleCopyAllEmails}
              className="px-3.5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-jakarta text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              title="Copy all verified email addresses for campaigns"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Copy All Emails</span>
              <span className="px-1.5 py-0.5 rounded-md bg-cyan-500/20 text-[10px] font-mono font-bold">
                ({students.length})
              </span>
            </button>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-2 bg-black/60 border border-white/10 rounded-2xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={studentExportSearch}
              onChange={(e) => setStudentExportSearch(e.target.value)}
              placeholder="Search by student name, email, or phone number..."
              className="w-full bg-transparent pl-10 pr-4 py-2 text-paper text-xs placeholder:text-slate/40 focus:outline-none font-jakarta"
            />
          </div>
          {studentExportSearch && (
            <button
              type="button"
              onClick={() => setStudentExportSearch('')}
              className="text-xs text-slate hover:text-paper font-mono px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer"
            >
              Clear
            </button>
          )}
          <span className="font-mono text-[11px] text-slate/70 pr-3 whitespace-nowrap">
            Showing <strong className="text-primary">{filteredStudents.length}</strong> of {students.length}
          </span>
        </div>

        {/* Minimal Clean Contact Data Table */}
        <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-slate/70 font-mono text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-5">Student Name</th>
                  <th className="py-3 px-5">Verified Email</th>
                  <th className="py-3 px-5">Phone Number</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-jakarta text-xs">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate font-mono text-xs">
                      No student records matched "{studentExportSearch}".
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((std, idx) => {
                    const hasValidPhone = std.phone && std.phone !== 'Phone not added' && std.phone.trim().length >= 10;
                    const emailCopied = copiedCellId === `email-${std.id}`;
                    const phoneCopied = copiedCellId === `phone-${std.id}`;

                    return (
                      <tr key={std.id || idx} className="hover:bg-white/[0.02] transition-colors">
                        {/* 1. Row Index */}
                        <td className="py-3.5 px-4 text-center font-mono text-[11px] text-slate/50">
                          {idx + 1}
                        </td>

                        {/* 2. Student Name */}
                        <td className="py-3.5 px-5">
                          <span className="font-bold text-sm text-paper">
                            {std.name}
                          </span>
                        </td>

                        {/* 3. Email Address */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2 group">
                            <span className="font-mono text-xs text-slate/90 select-all">
                              {std.email}
                            </span>
                            <button
                              type="button"
                              onClick={() => copyContactToClipboard(std.email, `email-${std.id}`, 'Email')}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate hover:text-cyan-400 transition-colors cursor-pointer"
                              title="Copy email to clipboard"
                            >
                              {emailCopied ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* 4. Phone Number */}
                        <td className="py-3.5 px-5">
                          {hasValidPhone ? (
                            <div className="flex items-center gap-2 group">
                              <a
                                href={`tel:${std.phone}`}
                                className="font-mono text-xs text-paper hover:text-emerald-400 transition-colors font-bold select-all tracking-wide"
                                title="Click to call"
                              >
                                {std.phone}
                              </a>
                              <button
                                type="button"
                                onClick={() => copyContactToClipboard(std.phone!, `phone-${std.id}`, 'Phone')}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-slate hover:text-emerald-400 transition-colors cursor-pointer"
                                title="Copy phone number to clipboard"
                              >
                                {phoneCopied ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                                )}
                              </button>
                            </div>
                          ) : (
                            <span className="font-mono text-[11px] text-slate/40 italic">
                              Not added
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  };

  const exportIndividualStudentPDF = (s: StudentAdminRecord) => {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();

      // Dark header banner
      doc.setFillColor(12, 13, 14);
      doc.rect(0, 0, pageWidth, 75, 'F');

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(0, 255, 157);
      doc.text("DO PILOT", 40, 36);

      doc.setFontSize(11);
      doc.setTextColor(240, 240, 240);
      doc.text("Student Performance & Assessment Report Card", 40, 56);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(150, 150, 150);
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 180, 56);

      // Student Profile Box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.rect(40, 95, pageWidth - 80, 75, 'FD');

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.text(s.name, 55, 118);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text(`Email: ${s.email}`, 55, 134);
      doc.text(`Phone: ${s.phone || 'N/A'}`, 55, 148);
      doc.text(`College / Organization: ${s.collegeOrCompany || 'N/A'}`, 240, 134);
      doc.text(`Enrolled: ${s.enrolledCourses.join(', ') || 'Python Core'}`, 240, 148);
      doc.text(`Goal: ${s.learningGoal || 'General Tech Mastery'}`, 240, 162);
      doc.text(`Joined: ${new Date(s.createdAt).toLocaleDateString()}`, 55, 162);

      // KPI Metric Tiles
      let y = 185;
      const boxWidth = (pageWidth - 80 - 30) / 4;

      // Total Score
      doc.setFillColor(240, 253, 244);
      doc.rect(40, y, boxWidth, 48, 'F');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(22, 101, 52);
      doc.text(`${s.points} pts`, 50, y + 24);
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("TOTAL SCORE", 50, y + 38);

      // Tests Attempted
      doc.setFillColor(241, 245, 249);
      doc.rect(40 + boxWidth + 10, y, boxWidth, 48, 'F');
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text(`${s.testsAttemptedCount}`, 50 + boxWidth + 10, y + 24);
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("TESTS ATTEMPTED", 50 + boxWidth + 10, y + 38);

      // Tests Passed
      doc.setFillColor(236, 253, 245);
      doc.rect(40 + (boxWidth + 10) * 2, y, boxWidth, 48, 'F');
      doc.setFontSize(14);
      doc.setTextColor(5, 150, 105);
      doc.text(`${s.testsPassedCount} Passed`, 50 + (boxWidth + 10) * 2, y + 24);
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("SUCCESSFUL TASKS", 50 + (boxWidth + 10) * 2, y + 38);

      // Tests Failed / Wrong Answers
      doc.setFillColor(254, 242, 242);
      doc.rect(40 + (boxWidth + 10) * 3, y, boxWidth, 48, 'F');
      doc.setFontSize(14);
      doc.setTextColor(225, 29, 72);
      doc.text(`${s.testsFailedCount} Failed`, 50 + (boxWidth + 10) * 3, y + 24);
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("MISTAKES / WRONG", 50 + (boxWidth + 10) * 3, y + 38);

      // Certificate Banner
      y = 250;
      if (s.hasCertificate) {
        doc.setFillColor(254, 249, 195);
        doc.rect(40, y, pageWidth - 80, 28, 'F');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(133, 77, 14);
        doc.text(`[VERIFIED CERTIFIED] Certificate Issued: ${s.certificateId || 'CERT-DO-PILOT'} on ${s.certificateIssuedDate || 'Completed'}`, 50, y + 18);
      } else {
        doc.setFillColor(241, 245, 249);
        doc.rect(40, y, pageWidth - 80, 28, 'F');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(`Certificate Status: In Progress (Requires 20+ points or Part 14 completion to unlock)`, 50, y + 18);
      }

      // Section 1: Mistake & Failure Details
      y = 295;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text("Assessment Mistakes & Test Failure Log (Where Answer Was Wrong)", 40, y);

      y += 14;
      if (s.wrongAttempts.length === 0) {
        doc.setFillColor(240, 253, 244);
        doc.rect(40, y, pageWidth - 80, 26, 'F');
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(22, 101, 52);
        doc.text("Clean record! No wrong answers or failed questions on record for this student.", 50, y + 17);
        y += 38;
      } else {
        s.wrongAttempts.forEach((w) => {
          doc.setFillColor(255, 241, 242);
          doc.rect(40, y, pageWidth - 80, 28, 'F');
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8.5);
          doc.setTextColor(190, 18, 60);
          doc.text(`[${w.section}] ${w.taskTitle}`, 50, y + 12);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(71, 85, 105);
          doc.text(`${w.detail} (${w.failedAt})`, 50, y + 22);
          y += 33;
        });
        y += 10;
      }

      // Section 2: Section-by-Section Progress
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text("Course Section Breakdown & Mastery", 40, y);

      y += 15;
      doc.setFillColor(241, 245, 249);
      doc.rect(40, y, pageWidth - 80, 20, 'F');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text("Module / Section", 50, y + 13);
      doc.text("Challenges Solved", 340, y + 13);
      doc.text("Module Status", 460, y + 13);

      y += 24;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);

      s.sectionProgress.forEach((sec, idx) => {
        if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(40, y - 10, pageWidth - 80, 16, 'F');
        }
        doc.text(sec.title, 50, y + 2);
        doc.text(`${sec.solvedTasks} / ${sec.totalTasks} tasks`, 340, y + 2);
        doc.text(sec.status.toUpperCase(), 460, y + 2);
        y += 18;
      });

      doc.save(`DO_PILOT_${s.name.replace(/\s+/g, '_')}_Progress_Report.pdf`);
      showToast(`Downloaded performance report for ${s.name}!`);
    } catch (e) {
      console.error("Failed to generate student report:", e);
      showToast("Error generating report PDF.");
    }
  };

  // Render Full-Screen Fixed Modal for Student Inspection (Root Level)
  const renderStudentInspectModal = () => {
    if (!selectedStudentForReport) return null;
    return (
      <div className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-200">
        <div className="w-full max-w-[1550px] h-[92vh] rounded-3xl bg-[#0a0b0d] border border-white/15 shadow-2xl flex flex-col relative overflow-hidden">
          
          {/* Modal Top Header (Fixed) */}
          <div className="px-6 py-4 border-b border-white/10 bg-[#0f1013]/95 backdrop-blur-md flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border-2 border-primary text-primary flex items-center justify-center font-jakarta font-black text-lg tracking-wider shrink-0 shadow-lg shadow-primary/20">
                {getUserInitials(selectedStudentForReport.name)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-jakarta font-black text-lg text-paper truncate">
                    {selectedStudentForReport.name}
                  </h3>
                  {selectedStudentForReport.hasCertificate && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-mono text-[10px] font-bold flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-400" />
                      <span>Verified Certified</span>
                    </span>
                  )}
                  <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase ${
                    selectedStudentForReport.courseProgressStatus === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : selectedStudentForReport.courseProgressStatus === 'in_progress'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-white/10 text-slate border border-white/10'
                  }`}>
                    {selectedStudentForReport.courseProgressStatus.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate mt-0.5">
                  <span className="font-mono text-slate/80">{selectedStudentForReport.email}</span>
                  {selectedStudentForReport.phone && (
                    <>
                      <span className="text-white/20">•</span>
                      <span className="font-mono text-paper flex items-center gap-1">
                        <Phone className="w-3 h-3 text-primary" />
                        {selectedStudentForReport.phone}
                      </span>
                    </>
                  )}
                  {selectedStudentForReport.collegeOrCompany && (
                    <>
                      <span className="text-white/20">•</span>
                      <span className="text-slate flex items-center gap-1 truncate">
                        <GraduationCap className="w-3 h-3 text-slate/60" />
                        {selectedStudentForReport.collegeOrCompany}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => exportIndividualStudentPDF(selectedStudentForReport)}
                className="px-3.5 py-2 rounded-xl bg-primary text-ink font-jakarta font-bold text-xs hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-primary/20"
                title="Export Student Report Card to PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export PDF Report</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStudentForReport(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate hover:text-paper transition-all cursor-pointer border border-white/10"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Modal Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
            
            {/* 12-Column Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column (4 Cols on lg): Profile, Contact & Key Metrics */}
              <div className="lg:col-span-4 space-y-5">
                
                {/* Key Metrics Strip (4 Tiles) */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-[#121316] border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono text-slate/70 uppercase tracking-wider block">Total Points</span>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-primary" />
                      <span className="font-jakarta font-black text-2xl text-paper">{selectedStudentForReport.points} pts</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#121316] border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono text-slate/70 uppercase tracking-wider block">Tests Attempted</span>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-cyan-400" />
                      <span className="font-jakarta font-black text-2xl text-paper">{selectedStudentForReport.testsAttemptedCount}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#121316] border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono text-slate/70 uppercase tracking-wider block">Tasks Passed</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="font-jakarta font-black text-2xl text-emerald-400">{selectedStudentForReport.testsPassedCount}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#121316] border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono text-slate/70 uppercase tracking-wider block">Mistakes Recorded</span>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-rose-400" />
                      <span className="font-jakarta font-black text-2xl text-rose-400">{selectedStudentForReport.testsFailedCount}</span>
                    </div>
                  </div>
                </div>

                {/* Student Onboarding & Contact Details */}
                <div className="p-5 rounded-3xl bg-[#121316] border border-white/10 space-y-3.5">
                  <span className="font-mono text-xs text-primary font-bold uppercase tracking-wider block">
                    // Student Profile &amp; Contact
                  </span>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-start justify-between gap-2 pb-2 border-b border-white/5">
                      <span className="text-slate font-mono">Full Name</span>
                      <span className="font-bold text-paper text-right">{selectedStudentForReport.name}</span>
                    </div>

                    <div className="flex items-start justify-between gap-2 pb-2 border-b border-white/5">
                      <span className="text-slate font-mono">Verified Email</span>
                      <span className="font-mono text-slate/90 text-right truncate max-w-[200px]">{selectedStudentForReport.email}</span>
                    </div>

                    <div className="flex items-start justify-between gap-2 pb-2 border-b border-white/5">
                      <span className="text-slate font-mono">Contact Phone</span>
                      <span className="font-mono font-semibold text-paper text-right">{selectedStudentForReport.phone || 'Not added'}</span>
                    </div>

                    {selectedStudentForReport.collegeOrCompany && (
                      <div className="flex items-start justify-between gap-2 pb-2 border-b border-white/5">
                        <span className="text-slate font-mono">College / Org</span>
                        <span className="text-paper text-right font-medium">{selectedStudentForReport.collegeOrCompany}</span>
                      </div>
                    )}

                    {selectedStudentForReport.learningGoal && (
                      <div className="flex items-start justify-between gap-2 pb-2 border-b border-white/5">
                        <span className="text-slate font-mono">Career Goal</span>
                        <span className="text-primary text-right font-semibold">{selectedStudentForReport.learningGoal}</span>
                      </div>
                    )}

                    {selectedStudentForReport.whereDidYouFindUs && (
                      <div className="flex items-start justify-between gap-2 pb-2 border-b border-white/5">
                        <span className="text-slate font-mono">Source</span>
                        <span className="text-slate text-right">{selectedStudentForReport.whereDidYouFindUs}</span>
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate font-mono">Account Created</span>
                      <span className="text-slate/70 font-mono text-right">{new Date(selectedStudentForReport.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Enrolled Courses & Live Training */}
                <div className="p-5 rounded-3xl bg-[#121316] border border-white/10 space-y-3">
                  <span className="font-mono text-xs text-slate/70 font-bold uppercase tracking-wider block">
                    Enrolled Courses &amp; Live Class
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudentForReport.enrolledCourses && selectedStudentForReport.enrolledCourses.length > 0 ? (
                      selectedStudentForReport.enrolledCourses.map((c, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-paper font-jakarta text-xs font-semibold"
                        >
                          {c}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate/60 font-mono">No specific course selected yet</span>
                    )}

                    {selectedStudentForReport.joinedLiveClass && (
                      <span className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary font-jakarta text-xs font-bold flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5" />
                        <span>Live Masterclass Registered</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Verified Certificate Showcase Banner */}
                <div className={`p-5 rounded-3xl border space-y-2.5 ${
                  selectedStudentForReport.hasCertificate
                    ? 'bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-amber-400/30'
                    : 'bg-[#121316] border-white/10'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className={`w-5 h-5 ${selectedStudentForReport.hasCertificate ? 'text-amber-400' : 'text-slate/60'}`} />
                      <h4 className="font-jakarta font-bold text-sm text-paper">
                        {selectedStudentForReport.hasCertificate ? 'Course Certificate Issued' : 'Certificate Progress'}
                      </h4>
                    </div>
                    {selectedStudentForReport.hasCertificate && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-black font-jakarta font-extrabold text-[10px] uppercase">
                        VERIFIED
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate leading-relaxed">
                    {selectedStudentForReport.hasCertificate
                      ? `This student has passed core requirements with ${selectedStudentForReport.points} points. Certificate ID: ${selectedStudentForReport.certificateId || 'CERT-DO-PILOT'} issued on ${selectedStudentForReport.certificateIssuedDate || 'Completed'}.`
                      : `Requires scoring 20+ points or finishing Part 14 to unlock verifiable certificate. Currently at ${selectedStudentForReport.points} / 20 points.`}
                  </p>

                  {/* Mini Progress Bar for Certificate */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] font-mono text-slate">
                      <span>Progress to Certificate</span>
                      <span className="font-bold text-paper">{Math.min(100, Math.round((selectedStudentForReport.points / 20) * 100))}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          selectedStudentForReport.hasCertificate ? 'bg-amber-400' : 'bg-primary'
                        }`}
                        style={{ width: `${Math.min(100, Math.round((selectedStudentForReport.points / 20) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column (8 Cols on lg): Mistakes Log + Course Mastery */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Section 1: Where Did They Make Answers Wrong? (Mistake Log) */}
                <div className="p-6 rounded-3xl bg-[#121316] border border-white/10 space-y-4 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                    <div>
                      <h4 className="font-jakarta font-black text-sm text-paper uppercase tracking-wider flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        <span>Where Did They Make Answers Wrong? (Mistake Log)</span>
                      </h4>
                      <p className="text-xs text-slate mt-0.5">
                        Exact tests and Python challenges where the student entered incorrect code or failed test assertions.
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full font-mono text-[11px] font-bold ${
                      selectedStudentForReport.wrongAttempts.length > 0
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {selectedStudentForReport.wrongAttempts.length} Mistakes Recorded
                    </span>
                  </div>

                  {selectedStudentForReport.wrongAttempts.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />
                      <div className="space-y-0.5">
                        <span className="font-jakarta font-bold text-sm text-emerald-300 block">
                          Clean Record — 100% Accuracy!
                        </span>
                        <p className="text-xs text-emerald-400/80">
                          This student has completed all attempted challenges without a single failed test or incorrect answer on record.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedStudentForReport.wrongAttempts.map((mistake, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-rose-500/[0.08] border border-rose-500/25 space-y-2 hover:border-rose-500/40 transition-colors"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-jakarta font-bold text-sm text-rose-300 flex items-center gap-1.5">
                              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                              <span>{mistake.taskTitle}</span>
                            </span>
                            <span className="px-2.5 py-0.5 rounded-lg bg-black/60 font-mono text-[10px] text-slate/90 border border-white/10">
                              {mistake.section}
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-black/60 border border-white/5 font-mono text-xs text-rose-200/90 leading-relaxed">
                            {mistake.detail}
                          </div>

                          <div className="flex items-center justify-between text-[10px] font-mono text-slate/60 pt-0.5">
                            <span>Failed Attempt Timestamp: {mistake.failedAt}</span>
                            <span className="text-rose-400/80">Requires Code Correction</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section 2: Complete Course Modules & Section Mastery */}
                <div className="p-6 rounded-3xl bg-[#121316] border border-white/10 space-y-4 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                    <div>
                      <h4 className="font-jakarta font-black text-sm text-paper uppercase tracking-wider flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <span>Section-by-Section Course Mastery</span>
                      </h4>
                      <p className="text-xs text-slate mt-0.5">
                        Progress tracking across all curriculum parts and interactive coding exercises.
                      </p>
                    </div>
                    <span className="font-mono text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                      {selectedStudentForReport.sectionProgress.filter((s) => s.status === 'passed').length} / {selectedStudentForReport.sectionProgress.length || 8} Modules Passed
                    </span>
                  </div>

                  {selectedStudentForReport.sectionProgress.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate/60 bg-black/40 rounded-2xl border border-white/5">
                      Student has not started course challenges yet. Once they open Python Code Lab and run challenges, real-time section mastery will appear here.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {selectedStudentForReport.sectionProgress.map((sec, idx) => {
                        const isPassed = sec.status === 'passed';
                        const isInProgress = sec.status === 'in_progress';
                        const isFailed = sec.status === 'failed';

                        return (
                          <div
                            key={idx}
                            className={`p-4 rounded-2xl border space-y-2.5 transition-all ${
                              isPassed
                                ? 'bg-emerald-500/[0.04] border-emerald-500/20 hover:border-emerald-500/40'
                                : isFailed
                                ? 'bg-rose-500/[0.04] border-rose-500/20 hover:border-rose-500/40'
                                : isInProgress
                                ? 'bg-cyan-500/[0.04] border-cyan-500/20 hover:border-cyan-500/40'
                                : 'bg-black/40 border-white/5 opacity-70'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <span className="font-jakarta font-bold text-xs text-paper block truncate">
                                  {sec.title}
                                </span>
                                <span className="font-mono text-[11px] text-slate/70 block mt-0.5">
                                  {sec.solvedTasks} of {sec.totalTasks} challenges solved
                                </span>
                              </div>

                              <span className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase shrink-0 ${
                                isPassed
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : isFailed
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                  : isInProgress
                                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                  : 'bg-white/5 text-slate border border-white/10'
                              }`}>
                                {sec.status.replace(/_/g, ' ')}
                              </span>
                            </div>

                            {/* Mini Progress Bar */}
                            <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  isPassed
                                    ? 'bg-emerald-400'
                                    : isFailed
                                    ? 'bg-rose-400'
                                    : isInProgress
                                    ? 'bg-cyan-400'
                                    : 'bg-white/10'
                                }`}
                                style={{ width: `${Math.round((sec.solvedTasks / sec.totalTasks) * 100)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>

          {/* Modal Bottom Footer (Fixed) */}
          <div className="px-6 py-4 border-t border-white/10 bg-[#0f1013]/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-2 font-mono text-[11px] text-slate/70">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Viewing record for <strong className="text-paper">{selectedStudentForReport.name}</strong> • Registered {new Date(selectedStudentForReport.createdAt).toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => exportIndividualStudentPDF(selectedStudentForReport)}
                className="px-4 py-2 rounded-xl bg-primary text-ink font-jakarta font-bold text-xs hover:bg-white transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/20"
              >
                <Download className="w-4 h-4" />
                <span>Download Full Student Report Card (PDF)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStudentForReport(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-paper font-jakarta text-xs font-bold transition-all cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  };

  // Render Students & Learning Analytics Section
  const renderStudentsSection = () => {
    // Unique list of all courses across platform and student roster
    const uniqueCourses = Array.from(
      new Set([
        ...(data.coursesSection?.courses || []).map((c: any) => c.title),
        ...students.flatMap((s) => s.enrolledCourses || [])
      ])
    ).filter(Boolean);

    // 1. Scoped pool by Course Filter
    const studentsInSelectedCourse = selectedCourseFilter === 'all'
      ? students
      : students.filter((s) => s.enrolledCourses?.some((c) => c.toLowerCase() === selectedCourseFilter.toLowerCase()));

    // 2. Date / Time Period Filter Predicate
    const matchesDateFilter = (createdAt: string) => {
      if (studentDatePreset === 'all' && !studentStartDate && !studentEndDate) {
        return true;
      }
      const recordTime = new Date(createdAt).getTime();
      if (isNaN(recordTime)) return true;
      const now = Date.now();

      if (studentDatePreset === 'today') {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        return recordTime >= startOfToday.getTime();
      }
      if (studentDatePreset === '7days') {
        return recordTime >= now - 7 * 86400000;
      }
      if (studentDatePreset === '30days') {
        return recordTime >= now - 30 * 86400000;
      }
      if (studentDatePreset === '90days') {
        return recordTime >= now - 90 * 86400000;
      }
      if (studentDatePreset === '1year') {
        return recordTime >= now - 365 * 86400000;
      }
      if (studentDatePreset === 'custom') {
        let matchesStart = true;
        let matchesEnd = true;
        if (studentStartDate) {
          const sTime = new Date(`${studentStartDate}T00:00:00`).getTime();
          if (!isNaN(sTime)) matchesStart = recordTime >= sTime;
        }
        if (studentEndDate) {
          const eTime = new Date(`${studentEndDate}T23:59:59.999`).getTime();
          if (!isNaN(eTime)) matchesEnd = recordTime <= eTime;
        }
        return matchesStart && matchesEnd;
      }
      return true;
    };

    // Scoped pool by Course Filter + Date Period
    const studentsInDateAndCourse = studentsInSelectedCourse.filter((s) => matchesDateFilter(s.createdAt));

    // Counts for filter pills (scoped to selected course & active date range)
    const totalCount = studentsInDateAndCourse.length;
    const startedCount = studentsInDateAndCourse.filter((s) => s.courseProgressStatus === 'in_progress' || s.courseProgressStatus === 'completed').length;
    const completedCount = studentsInDateAndCourse.filter((s) => s.courseProgressStatus === 'completed').length;
    const maxPointsInCourse = studentsInDateAndCourse.length > 0
      ? Math.max(...studentsInDateAndCourse.map((s) => s.points), 0)
      : 0;
    const topPointsCount = selectedCourseFilter === 'all'
      ? studentsInDateAndCourse.filter((s) => s.points >= 10).length
      : (maxPointsInCourse > 0
          ? studentsInDateAndCourse.filter((s) => s.points === maxPointsInCourse).length
          : 0);
    const lowMarksCount = studentsInDateAndCourse.filter((s) => (s.points <= 3 && s.courseProgressStatus !== 'registered_only') || s.testsFailedCount > 0).length;
    const registeredOnlyCount = studentsInDateAndCourse.filter((s) => s.courseProgressStatus === 'registered_only' || s.courseProgressStatus === 'enrolled_not_started' || s.points === 0).length;
    const pendingRewardCount = rewardRequests.filter((r) => r.status === 'pending').length;

    // 3. Multi-Criteria Filter (Course + Date + Search Query + Performance Tab)
    const filteredStudents = studentsInDateAndCourse.filter((s) => {
      const q = studentSearch.toLowerCase().trim();
      if (q) {
        const matchName = s.name.toLowerCase().includes(q);
        const matchEmail = s.email.toLowerCase().includes(q);
        const matchPhone = (s.phone || '').toLowerCase().includes(q);
        const matchCollege = (s.collegeOrCompany || '').toLowerCase().includes(q);
        const matchGoal = (s.learningGoal || '').toLowerCase().includes(q);
        const matchWhere = (s.whereDidYouFindUs || '').toLowerCase().includes(q);
        const matchCourse = s.enrolledCourses?.some((c) => c.toLowerCase().includes(q));
        const matchStatus = s.courseProgressStatus.toLowerCase().replace(/_/g, ' ').includes(q);
        const matchCert = (s.hasCertificate ? 'certified' : 'in progress').includes(q);
        const matchCertId = (s.certificateId || '').toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchPhone && !matchCollege && !matchGoal && !matchWhere && !matchCourse && !matchStatus && !matchCert && !matchCertId) {
          return false;
        }
      }

      if (studentFilter === 'started') {
        return s.courseProgressStatus === 'in_progress' || s.courseProgressStatus === 'completed';
      }
      if (studentFilter === 'completed') {
        return s.courseProgressStatus === 'completed';
      }
      if (studentFilter === 'top_points') {
        if (selectedCourseFilter !== 'all') {
          return s.points === maxPointsInCourse && maxPointsInCourse > 0;
        }
        return s.points >= 10;
      }
      if (studentFilter === 'low_marks') {
        return (s.points <= 3 && s.courseProgressStatus !== 'registered_only') || s.testsFailedCount > 0;
      }
      if (studentFilter === 'registered_only') {
        return s.courseProgressStatus === 'registered_only' || s.courseProgressStatus === 'enrolled_not_started' || s.points === 0;
      }
      return true;
    }).sort((a, b) => {
      if (studentSort === 'points_desc') return b.points - a.points;
      if (studentSort === 'points_asc') return a.points - b.points;
      if (studentSort === 'date_desc') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (studentSort === 'name_asc') return a.name.localeCompare(b.name);
      return 0;
    });

    const exportToExcel = () => {
      const headers = [
        "Student Name",
        "Email",
        "Phone",
        "College / Organization",
        "Where Found Us",
        "Learning Goal",
        "Enrolled Courses",
        "Live Class Joined",
        "Total Score / Points",
        "Tests Attempted",
        "Tests Passed",
        "Tests Failed / Wrong",
        "Certificate Status",
        "Certificate ID",
        "Where Made Answers Wrong / Mistake Log",
        "Section Mastery Summary",
        "Learning Status",
        "Registration Date"
      ];

      const rows = filteredStudents.map((s) => {
        const mistakeDetails = s.wrongAttempts.length > 0
          ? s.wrongAttempts.map((w) => `[${w.section}] ${w.taskTitle}: ${w.detail}`).join(" | ")
          : "Clean Sheet (0 Mistakes)";
        const sectionSummary = s.sectionProgress.length > 0
          ? s.sectionProgress.map((sec) => `Part ${sec.partNum} (${sec.solvedTasks}/${sec.totalTasks} ${sec.status.toUpperCase()})`).join("; ")
          : "Not Started";

        return [
          `"${(s.name || '').replace(/"/g, '""')}"`,
          `"${(s.email || '').replace(/"/g, '""')}"`,
          `"${(s.phone || 'N/A').replace(/"/g, '""')}"`,
          `"${(s.collegeOrCompany || 'N/A').replace(/"/g, '""')}"`,
          `"${(s.whereDidYouFindUs || 'N/A').replace(/"/g, '""')}"`,
          `"${(s.learningGoal || 'N/A').replace(/"/g, '""')}"`,
          `"${(s.enrolledCourses?.join('; ') || 'None').replace(/"/g, '""')}"`,
          `"${s.joinedLiveClass ? 'Yes' : 'No'}"`,
          s.points,
          s.testsAttemptedCount,
          s.testsPassedCount,
          s.testsFailedCount,
          `"${s.hasCertificate ? 'Issued' : 'In Progress'}"`,
          `"${s.certificateId || 'N/A'}"`,
          `"${mistakeDetails.replace(/"/g, '""')}"`,
          `"${sectionSummary.replace(/"/g, '""')}"`,
          `"${s.courseProgressStatus.toUpperCase().replace(/_/g, ' ')}"`,
          `"${new Date(s.createdAt).toLocaleDateString()}"`
        ];
      });

      const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `DO_PILOT_Students_${studentFilter.toUpperCase()}_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Exported ${filteredStudents.length} students to Excel CSV successfully!`);
    };

    const exportToPDF = () => {
      try {
        const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
        const pageWidth = doc.internal.pageSize.getWidth();

        // Brand Banner
        doc.setFillColor(12, 13, 14);
        doc.rect(0, 0, pageWidth, 55, 'F');

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(0, 255, 157);
        doc.text("DO PILOT — Student Learning & Progress Report", 40, 32);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(160, 160, 160);
        doc.text(`Generated: ${new Date().toLocaleString()}  |  Filter: ${studentFilter.toUpperCase().replace(/_/g, ' ')}  |  Total Count: ${filteredStudents.length}`, 40, 47);

        // Header Row
        let currentY = 80;
        doc.setFillColor(242, 244, 247);
        doc.rect(40, currentY, pageWidth - 80, 22, 'F');

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(20, 20, 20);
        doc.text("#", 45, currentY + 15);
        doc.text("Student Name", 70, currentY + 15);
        doc.text("Email", 210, currentY + 15);
        doc.text("Phone", 350, currentY + 15);
        doc.text("Score / Tests", 440, currentY + 15);
        doc.text("Passed / Failed", 530, currentY + 15);
        doc.text("Certificate", 640, currentY + 15);
        doc.text("Status", 730, currentY + 15);

        currentY += 28;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(40, 40, 40);

        filteredStudents.forEach((s, idx) => {
          if (currentY > 530) {
            doc.addPage();
            currentY = 45;
          }

          if (idx % 2 === 1) {
            doc.setFillColor(248, 250, 252);
            doc.rect(40, currentY - 11, pageWidth - 80, 18, 'F');
          }

          doc.text(String(idx + 1), 45, currentY + 2);
          doc.text(s.name.slice(0, 24), 70, currentY + 2);
          doc.text(s.email.slice(0, 28), 210, currentY + 2);
          doc.text(s.phone || 'N/A', 350, currentY + 2);
          doc.text(`${s.points} pts (${s.testsAttemptedCount} att)`, 440, currentY + 2);
          doc.text(`${s.testsPassedCount} pass / ${s.testsFailedCount} fail`, 530, currentY + 2);
          doc.text(s.hasCertificate ? '✓ Issued' : 'In Progress', 640, currentY + 2);
          doc.text(s.courseProgressStatus.toUpperCase().replace(/_/g, ' '), 730, currentY + 2);

          currentY += 19;
        });

        doc.save(`DO_PILOT_Students_${studentFilter.toUpperCase()}_${new Date().toISOString().slice(0, 10)}.pdf`);
        showToast(`Exported ${filteredStudents.length} students to PDF Report!`);
      } catch (err) {
        console.error("PDF export failed:", err);
        showToast("PDF generation error. Please try again.");
      }
    };

    const renderRewardRequestsSection = () => {
      const totalRewards = rewardRequests.length;
      const pendingRewards = rewardRequests.filter((r) => r.status === 'pending');
      const approvedRewards = rewardRequests.filter((r) => r.status === 'approved');

      const filteredRewards = rewardRequests.filter((r) => {
        if (rewardStatusFilter !== 'all' && r.status !== rewardStatusFilter) {
          return false;
        }
        const q = studentSearch.toLowerCase().trim();
        if (q) {
          const matchName = r.studentName.toLowerCase().includes(q);
          const matchEmail = r.studentEmail.toLowerCase().includes(q);
          const matchPhone = (r.studentPhone || '').toLowerCase().includes(q);
          const matchCollege = (r.collegeOrCompany || '').toLowerCase().includes(q);
          const matchMilestone = `milestone ${r.milestonePoints}`.includes(q) || `₹${r.rewardAmount}`.includes(q);
          const matchStatus = r.status.toLowerCase().includes(q);
          if (!matchName && !matchEmail && !matchPhone && !matchCollege && !matchMilestone && !matchStatus) {
            return false;
          }
        }
        return true;
      });

      return (
        <div className="space-y-6">
          {/* Rewards Summary KPIs & Subfilters */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-jakarta font-bold text-sm text-paper flex items-center gap-2">
                  Milestone Reward Approval Queue
                  {pendingRewards.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold">
                      {pendingRewards.length} PENDING VERIFICATION
                    </span>
                  )}
                </h4>
                <p className="text-xs text-slate/80">
                  Review and verify genuine student milestone achievement requests. Approvals immediately update both admin and student records.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {[
                { id: 'all', label: 'All Requests', count: totalRewards },
                { id: 'pending', label: 'Pending', count: pendingRewards.length },
                { id: 'approved', label: 'Approved', count: approvedRewards.length },
              ].map((subTab) => {
                const active = rewardStatusFilter === subTab.id;
                return (
                  <button
                    key={subTab.id}
                    type="button"
                    onClick={() => setRewardStatusFilter(subTab.id as any)}
                    className={`px-3.5 py-1.5 rounded-xl font-jakarta text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      active
                        ? 'bg-primary text-ink shadow-md shadow-primary/20 scale-[1.02]'
                        : 'bg-white/5 text-slate hover:text-paper hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    <span>{subTab.label}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      active ? 'bg-black/20 text-ink font-bold' : 'bg-white/10 text-slate/80'
                    }`}>
                      {subTab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Requests Grid */}
          {filteredRewards.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-white/[0.02] border border-white/10 space-y-3">
              <Trophy className="w-10 h-10 text-slate/40 mx-auto" />
              <h4 className="font-jakarta font-bold text-base text-paper">No reward requests match your filter</h4>
              <p className="text-xs text-slate max-w-sm mx-auto">
                {rewardStatusFilter === 'pending'
                  ? 'All pending requests have been reviewed and approved.'
                  : 'Try adjusting your search query or switching to All Requests.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setRewardStatusFilter('all');
                  setStudentSearch('');
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-paper font-jakarta text-xs font-bold transition-all cursor-pointer"
              >
                Reset Rewards Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredRewards.map((req) => {
                const isApproved = req.status === 'approved';
                return (
                  <div
                    key={req.id}
                    className={`rounded-3xl bg-[#0e0f12] border p-5 space-y-4 transition-all shadow-xl flex flex-col justify-between group ${
                      isApproved
                        ? 'border-emerald-500/20 hover:border-emerald-500/40'
                        : 'border-amber-500/30 hover:border-amber-500/50 bg-gradient-to-b from-amber-500/[0.02] to-transparent'
                    }`}
                  >
                    {/* Top: Student Header & Status Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-2xl bg-primary/20 border border-primary/40 text-primary flex items-center justify-center font-jakarta font-black text-sm shrink-0">
                          {getUserInitials(req.studentName)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-jakarta font-bold text-sm text-paper group-hover:text-primary transition-colors truncate">
                            {req.studentName}
                          </h3>
                          <span className="font-mono text-xs text-slate/70 block truncate">
                            {req.studentEmail}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isApproved ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            APPROVED
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            PENDING
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Student Details: Phone, College, Dates */}
                    <div className="space-y-1.5 text-xs text-slate/70 font-mono bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                      {req.studentPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate/40 shrink-0" />
                          <span className="text-paper truncate">{req.studentPhone}</span>
                        </div>
                      )}
                      {req.collegeOrCompany && (
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-3.5 h-3.5 text-slate/40 shrink-0" />
                          <span className="text-paper truncate">{req.collegeOrCompany}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-[11px] text-slate/50 pt-1 border-t border-white/5">
                        <Calendar className="w-3 h-3 shrink-0" />
                        <span>Requested: {new Date(req.requestedAt).toLocaleString()}</span>
                      </div>
                      {isApproved && req.approvedAt && (
                        <div className="flex items-center gap-2 text-[11px] text-emerald-400/90">
                          <CheckCircle2 className="w-3 h-3 shrink-0 text-emerald-400" />
                          <span>Approved: {new Date(req.approvedAt).toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Milestone & Points Balance Details */}
                    <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono text-slate/60 uppercase tracking-wider block">Milestone Reward</span>
                        <span className="font-jakarta font-bold text-sm text-paper flex items-center gap-1.5 mt-0.5">
                          <Trophy className="w-4 h-4 text-amber-400" />
                          {req.milestonePoints} Points
                        </span>
                        <span className="text-[11px] font-mono text-primary font-bold block mt-0.5">
                          Reward: ₹{req.rewardAmount}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono text-slate/60 uppercase tracking-wider block">Points Balance</span>
                        <span className="font-mono font-bold text-base text-paper block mt-0.5">
                          {req.pointsBalance} <span className="text-xs text-slate/60 font-normal">pts</span>
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md inline-block mt-0.5 ${
                          req.pointsBalance >= req.milestonePoints
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {req.pointsBalance >= req.milestonePoints ? '✓ Eligible' : 'Under Points'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div>
                      {isApproved ? (
                        <div className="w-full py-2.5 px-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center font-jakarta font-bold text-xs text-emerald-400 flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          Request Approved
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleApproveReward(req.id, req.studentName, req.rewardAmount)}
                          className="w-full py-2.5 px-4 rounded-2xl bg-primary hover:bg-primary/90 text-ink font-jakarta font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4 text-ink" />
                          <span>Approve</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    };

    return (
      <section id="section-students" className="rounded-3xl bg-[#0c0d0e] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-jakarta text-lg font-black text-paper">Students &amp; Learning Analytics</h2>
              <span className="font-mono text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold">
                {totalCount} Total
              </span>
            </div>
            <p className="text-xs text-slate mt-0.5">
              Live Google-authenticated student profiles, completed onboarding details, test mistakes, section mastery, and certificates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={fetchStudents}
              disabled={isLoadingStudents}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-paper font-jakarta text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Refresh student data from cloud"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStudents ? 'animate-spin text-primary' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              type="button"
              onClick={exportToExcel}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-jakarta text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/10"
              title="Export filtered student list with test breakdown to Excel (.csv)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export Excel</span>
            </button>

            <button
              type="button"
              onClick={exportToPDF}
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-jakarta text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-500/10"
              title="Export filtered student list to Printable PDF"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Filter Controls: Course Selector & Filter Pills */}
        <div className="space-y-3 pt-2">
          {/* Smart Filter Pills with Integrated Course Selector */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Inline Course Selector */}
            <div className="flex items-center gap-1.5 bg-[#121316] border border-white/15 px-3 py-1.5 rounded-xl shadow-sm">
              <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="text-[11px] font-mono text-slate/80 font-bold uppercase">Course:</span>
              <select
                value={selectedCourseFilter}
                onChange={(e) => {
                  setSelectedCourseFilter(e.target.value);
                  setStudentFilter('all');
                }}
                className="bg-transparent text-paper font-jakarta text-xs font-bold focus:outline-none cursor-pointer pr-1"
              >
                <option value="all" className="bg-[#111215] text-paper">
                  All Courses ({students.length})
                </option>
                {uniqueCourses.map((c, i) => {
                  const countInCourse = students.filter((s) => s.enrolledCourses?.some((ec) => ec.toLowerCase() === c.toLowerCase())).length;
                  return (
                    <option key={i} value={c} className="bg-[#111215] text-paper">
                      {c} ({countInCourse})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Smart Filter Pills (Scoped to Selected Course) */}
            {[
              { id: 'all', label: selectedCourseFilter === 'all' ? 'All Students' : 'All in Course', count: totalCount },
              { id: 'top_points', label: selectedCourseFilter === 'all' ? 'Top Points (≥10)' : 'Course Topper', count: topPointsCount },
              { id: 'low_marks', label: 'Failed / Struggling', count: lowMarksCount },
              { id: 'completed', label: 'Completed', count: completedCount },
              { id: 'started', label: 'Course Started', count: startedCount },
              { id: 'registered_only', label: 'Registered Only', count: registeredOnlyCount },
              { id: 'rewards', label: 'Milestone Rewards', count: pendingRewardCount, isReward: true },
            ].map((tab) => {
              const active = studentFilter === tab.id;
              const hasPending = (tab as any).isReward && pendingRewardCount > 0;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStudentFilter(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl font-jakarta text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    active
                      ? 'bg-primary text-ink shadow-md shadow-primary/20 scale-[1.02]'
                      : hasPending
                      ? 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30'
                      : 'bg-white/5 text-slate hover:text-paper hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {(tab as any).isReward && <Trophy className="w-3.5 h-3.5 shrink-0 text-amber-400" />}
                  <span>{tab.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    active
                      ? 'bg-black/20 text-ink font-bold'
                      : hasPending
                      ? 'bg-amber-500/20 text-amber-300 font-bold'
                      : 'bg-white/10 text-slate/80'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar & Controls Toolbar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate/50" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search anything: student name, course, email, phone, college, status (e.g. 'completed', 'certified')..."
                className="w-full pl-10 pr-12 py-2.5 rounded-2xl bg-black/60 border border-white/10 text-paper font-jakarta text-xs placeholder:text-slate/40 focus:outline-none focus:border-primary transition-colors"
              />
              {studentSearch && (
                <button
                  type="button"
                  onClick={() => setStudentSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-slate hover:text-paper font-mono text-[10px] transition-all"
                >
                  Clear
                </button>
              )}
            </div>

            {/* View Controls Toolbar */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {/* Date & Time Period Filter */}
              <div className="flex items-center gap-1.5 bg-black/60 border border-white/10 px-3 py-1.5 rounded-2xl">
                <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-[11px] font-mono text-slate/60">Period:</span>
                <select
                  value={studentDatePreset}
                  onChange={(e) => {
                    const val = e.target.value as StudentDateFilterPreset;
                    setStudentDatePreset(val);
                    if (val !== 'custom') {
                      setStudentStartDate('');
                      setStudentEndDate('');
                    }
                  }}
                  className="bg-transparent text-paper font-jakarta text-xs font-bold focus:outline-none cursor-pointer pr-1"
                >
                  <option value="all" className="bg-[#111215] text-paper">All Time</option>
                  <option value="today" className="bg-[#111215] text-paper">Today (Last 24h)</option>
                  <option value="7days" className="bg-[#111215] text-paper">Last 7 Days (Week)</option>
                  <option value="30days" className="bg-[#111215] text-paper">Last 30 Days (Month)</option>
                  <option value="90days" className="bg-[#111215] text-paper">Last 3 Months (Quarter)</option>
                  <option value="1year" className="bg-[#111215] text-paper">Last 1 Year</option>
                  <option value="custom" className="bg-[#111215] text-paper">Custom Date Range 📅</option>
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 bg-black/60 border border-white/10 px-3 py-1.5 rounded-2xl">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate/60" />
                <span className="text-[11px] font-mono text-slate/60">Sort:</span>
                <select
                  value={studentSort}
                  onChange={(e) => setStudentSort(e.target.value as any)}
                  className="bg-transparent text-paper font-jakarta text-xs focus:outline-none cursor-pointer pr-1"
                >
                  <option value="points_desc" className="bg-[#111215] text-paper">Highest Points</option>
                  <option value="points_asc" className="bg-[#111215] text-paper">Lowest Points</option>
                  <option value="date_desc" className="bg-[#111215] text-paper">Newest Registered</option>
                  <option value="name_asc" className="bg-[#111215] text-paper">Alphabetical (A-Z)</option>
                </select>
              </div>

              <div className="flex items-center bg-black/60 border border-white/10 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setStudentViewFormat('cards')}
                  className={`px-3 py-1.5 rounded-xl font-jakarta text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    studentViewFormat === 'cards'
                      ? 'bg-primary text-ink shadow-md shadow-primary/20'
                      : 'text-slate hover:text-paper'
                  }`}
                  title="Spacious Cards Grid View"
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>Cards</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStudentViewFormat('table')}
                  className={`px-3 py-1.5 rounded-xl font-jakarta text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    studentViewFormat === 'table'
                      ? 'bg-primary text-ink shadow-md shadow-primary/20'
                      : 'text-slate hover:text-paper'
                  }`}
                  title="Structured List / Table View"
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Table View</span>
                </button>
              </div>
            </div>
          </div>

          {/* Custom Date Range Picker Strip (Shown when 'custom' is selected) */}
          {studentDatePreset === 'custom' && (
            <div className="flex flex-wrap items-center gap-3 p-3 rounded-2xl bg-[#121316] border border-primary/30">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="font-mono text-xs font-bold text-paper">Custom Range:</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-slate">From:</span>
                <input
                  type="date"
                  value={studentStartDate}
                  onChange={(e) => setStudentStartDate(e.target.value)}
                  className="bg-black border border-white/15 rounded-xl px-3 py-1.5 text-paper text-xs font-mono focus:border-primary focus:outline-none cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-slate">To:</span>
                <input
                  type="date"
                  value={studentEndDate}
                  onChange={(e) => setStudentEndDate(e.target.value)}
                  className="bg-black border border-white/15 rounded-xl px-3 py-1.5 text-paper text-xs font-mono focus:border-primary focus:outline-none cursor-pointer"
                />
              </div>

              {(studentStartDate || studentEndDate) && (
                <button
                  type="button"
                  onClick={() => {
                    setStudentStartDate('');
                    setStudentEndDate('');
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 font-mono px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 cursor-pointer"
                >
                  Reset Dates
                </button>
              )}

              <span className="font-mono text-[11px] text-slate/70 ml-auto">
                {studentStartDate && studentEndDate
                  ? `Active window: ${studentStartDate} to ${studentEndDate}`
                  : studentStartDate
                  ? `Active: from ${studentStartDate}`
                  : studentEndDate
                  ? `Active: up to ${studentEndDate}`
                  : 'Select exact start & end dates above'}
              </span>
            </div>
          )}

          {/* Active Date Filter Chip (If any date filter is active) */}
          {studentDatePreset !== 'all' && (
            <div className="flex items-center gap-2 text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl w-fit">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>
                Period:{' '}
                <strong className="text-paper">
                  {studentDatePreset === 'today' && 'Today (Last 24 Hours)'}
                  {studentDatePreset === '7days' && 'Last 7 Days (Week)'}
                  {studentDatePreset === '30days' && 'Last 30 Days (Month)'}
                  {studentDatePreset === '90days' && 'Last 3 Months (Quarter)'}
                  {studentDatePreset === '1year' && 'Last 1 Year'}
                  {studentDatePreset === 'custom' && (studentStartDate || studentEndDate ? `${studentStartDate || 'Start'} to ${studentEndDate || 'Present'}` : 'Custom Date Range')}
                </strong>
                {' '}({filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'})
              </span>
              <button
                type="button"
                onClick={() => {
                  setStudentDatePreset('all');
                  setStudentStartDate('');
                  setStudentEndDate('');
                }}
                className="text-primary hover:text-white font-bold ml-1.5 underline cursor-pointer text-[11px]"
                title="Reset back to all time"
              >
                Clear Date Filter
              </button>
            </div>
          )}
        </div>

        {/* Milestone Rewards Approval Queue OR Student Roster */}
        {studentFilter === 'rewards' ? (
          renderRewardRequestsSection()
        ) : filteredStudents.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-white/[0.02] border border-white/10 space-y-3">
            <Users className="w-10 h-10 text-slate/40 mx-auto" />
            <h4 className="font-jakarta font-bold text-base text-paper">No students match your filter</h4>
            <p className="text-xs text-slate max-w-sm mx-auto">
              Try adjusting your date range, search query, or resetting filters to view all students.
            </p>
            <button
              type="button"
              onClick={() => {
                setStudentFilter('all');
                setStudentSearch('');
                setSelectedCourseFilter('all');
                setStudentDatePreset('all');
                setStudentStartDate('');
                setStudentEndDate('');
              }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-paper font-jakarta text-xs font-bold transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : studentViewFormat === 'cards' ? (
          /* Cards View: Clean & Minimal */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredStudents.map((student) => {
              const isTop = student.points >= 10;

              return (
                <div
                  key={student.id}
                  className="rounded-3xl bg-[#0e0f12] border border-white/10 p-5 space-y-4 hover:border-primary/40 transition-all shadow-xl flex flex-col justify-between group"
                >
                  {/* Top: Avatar, Name, Email, Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <div className="w-11 h-11 rounded-2xl bg-primary/20 border border-primary/40 text-primary flex items-center justify-center font-jakarta font-black text-sm shrink-0">
                          {getUserInitials(student.name)}
                        </div>
                        {student.hasCertificate && (
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-ink flex items-center justify-center text-[9px] font-bold shadow" title="Certified Student">
                            ★
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-jakarta font-bold text-sm text-paper group-hover:text-primary transition-colors truncate">
                          {student.name}
                        </h3>
                        <span className="font-mono text-xs text-slate/70 block truncate">
                          {student.email}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {student.courseProgressStatus === 'completed' && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold whitespace-nowrap">
                          ✓ COMPLETED
                        </span>
                      )}
                      {student.courseProgressStatus === 'in_progress' && (
                        <span className="px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] font-bold whitespace-nowrap">
                          ● IN PROGRESS
                        </span>
                      )}
                      {student.courseProgressStatus === 'enrolled_not_started' && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold whitespace-nowrap">
                          ○ ENROLLED
                        </span>
                      )}
                      {student.courseProgressStatus === 'registered_only' && (
                        <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate font-mono text-[10px] whitespace-nowrap">
                          REGISTERED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Middle: Enrolled Courses & Key Stats Pill */}
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2.5">
                    <div>
                      <span className="text-[10px] font-mono text-slate/50 uppercase tracking-wider block mb-1">
                        Enrolled Course
                      </span>
                      <div className="space-y-1.5">
                        {student.enrolledCourses && student.enrolledCourses.length > 0 ? (
                          student.enrolledCourses.map((c, i) => (
                            <div
                              key={i}
                              className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-paper font-jakarta text-xs font-semibold w-fit"
                            >
                              {c}
                            </div>
                          ))
                        ) : (
                          <div className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/5 text-slate/40 text-xs w-fit">
                            None
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-slate/50 uppercase">Points:</span>
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10">
                          {isTop ? (
                            <Trophy className="w-3 h-3 text-amber-400" />
                          ) : (
                            <Star className="w-3 h-3 text-primary" />
                          )}
                          <span className="font-mono font-bold text-xs text-paper">{student.points} pts</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-slate/50 uppercase">Cert:</span>
                        {student.hasCertificate ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-mono text-[10px] font-bold">
                            ✓ CERTIFIED
                          </span>
                        ) : (
                          <span className="text-slate/50 font-mono text-[10px]">
                            In Progress
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Inspect & Download */}
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedStudentForReport(student)}
                      className="flex-1 py-2 px-3 rounded-xl bg-primary text-ink hover:bg-white font-jakarta text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-primary/20"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => exportIndividualStudentPDF(student)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate hover:text-rose-400 border border-white/10 hover:border-rose-500/30 transition-all cursor-pointer"
                      title="Download single student PDF report card"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Clean & Minimal Table View (User Name, Enrolled Course, Points, Certificate, Status, Inspect & Download) */
          <div className="rounded-3xl border border-white/10 bg-[#0c0d10] shadow-2xl overflow-hidden">
            {/* Table Meta Bar */}
            <div className="px-6 py-3.5 bg-white/[0.02] border-b border-white/10 flex items-center justify-between text-xs text-slate">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="font-mono text-paper font-bold">{filteredStudents.length}</span>
                <span>{filteredStudents.length === 1 ? 'student record' : 'student records'}</span>
              </div>
              <span className="text-[11px] font-mono text-slate/50 hidden sm:inline">
                Click "Inspect" to view full quiz history, mistakes &amp; onboarding details
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[850px] border-collapse">
                <thead>
                  <tr className="bg-white/[0.03] border-b border-white/10 text-slate font-mono uppercase text-[11px] tracking-wider">
                    <th className="py-4 px-6">User / Student</th>
                    <th className="py-4 px-6">Enrolled Course</th>
                    <th className="py-4 px-6 text-center">Points</th>
                    <th className="py-4 px-6 text-center">Certificate</th>
                    <th className="py-4 px-6 text-center">Status</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-jakarta">
                  {filteredStudents.map((student) => {
                    const isTop = student.points >= 10;

                    return (
                      <tr key={student.id} className="hover:bg-white/[0.03] transition-colors group">
                        {/* 1. User Name & Profile */}
                        <td className="py-4 px-6 align-middle">
                          <div className="flex items-center gap-3.5">
                            <div className="relative shrink-0">
                              <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/40 text-primary flex items-center justify-center font-jakarta font-black text-xs shrink-0">
                                {getUserInitials(student.name)}
                              </div>
                              {student.hasCertificate && (
                                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-ink flex items-center justify-center text-[9px] font-bold shadow" title="Certified Student">
                                  ★
                                </span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-sm text-paper group-hover:text-primary transition-colors block truncate">
                                {student.name}
                              </span>
                              <span className="font-mono text-xs text-slate/70 truncate block mt-0.5">
                                {student.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 2. Enrolled Course */}
                        <td className="py-4 px-6 align-middle">
                          <div className="space-y-1.5">
                            {student.enrolledCourses && student.enrolledCourses.length > 0 ? (
                              student.enrolledCourses.map((c, i) => (
                                <div
                                  key={i}
                                  className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-paper font-jakarta text-xs font-semibold w-fit"
                                >
                                  {c}
                                </div>
                              ))
                            ) : (
                              <div className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/5 text-slate/40 font-jakarta text-xs w-fit">
                                None
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 3. Points */}
                        <td className="py-4 px-6 text-center align-middle whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 font-mono font-bold text-xs text-paper">
                            {isTop ? (
                              <Trophy className="w-3.5 h-3.5 text-amber-400" />
                            ) : (
                              <Star className="w-3.5 h-3.5 text-primary" />
                            )}
                            <span>{student.points} pts</span>
                          </div>
                        </td>

                        {/* 4. Certificate */}
                        <td className="py-4 px-6 text-center align-middle whitespace-nowrap">
                          {student.hasCertificate ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-mono text-[10px] font-bold">
                              <Award className="w-3 h-3 text-amber-400" />
                              <span>CERTIFIED</span>
                            </span>
                          ) : (
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5 text-slate/60 font-mono text-[10px]">
                              In Progress
                            </span>
                          )}
                        </td>

                        {/* 5. Status */}
                        <td className="py-4 px-6 text-center align-middle whitespace-nowrap">
                          {student.courseProgressStatus === 'completed' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                              ✓ COMPLETED
                            </span>
                          )}
                          {student.courseProgressStatus === 'in_progress' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] font-bold">
                              ● IN PROGRESS
                            </span>
                          )}
                          {student.courseProgressStatus === 'enrolled_not_started' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold">
                              ○ ENROLLED
                            </span>
                          )}
                          {student.courseProgressStatus === 'registered_only' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate font-mono text-[10px]">
                              REGISTERED
                            </span>
                          )}
                        </td>

                        {/* 6. Actions: Inspect & Download */}
                        <td className="py-4 px-6 text-center align-middle whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedStudentForReport(student)}
                              className="px-3.5 py-1.5 rounded-xl bg-primary text-ink hover:bg-white font-jakarta text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-primary/20 group"
                              title="Inspect student quiz mistakes and section breakdown"
                            >
                              <Eye className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                              <span>Inspect</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => exportIndividualStudentPDF(student)}
                              className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate hover:text-rose-400 border border-white/10 hover:border-rose-500/30 transition-all cursor-pointer"
                              title="Download student PDF report card"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </section>
    );
  };

  const renderStudentHelpSection = () => {
    const filteredHelp = helpMessages.filter(msg => {
      const matchSearch =
        helpSearch.trim() === '' ||
        msg.studentName.toLowerCase().includes(helpSearch.toLowerCase()) ||
        msg.studentEmail.toLowerCase().includes(helpSearch.toLowerCase()) ||
        msg.studentPhone.toLowerCase().includes(helpSearch.toLowerCase()) ||
        msg.courseTitle.toLowerCase().includes(helpSearch.toLowerCase()) ||
        msg.message.toLowerCase().includes(helpSearch.toLowerCase());

      const matchStatus = helpStatusFilter === 'all' || msg.status === helpStatusFilter;
      const matchCourse = helpCourseFilter === 'all' || msg.courseTitle.toLowerCase().includes(helpCourseFilter.toLowerCase()) || msg.courseId === helpCourseFilter;

      return matchSearch && matchStatus && matchCourse;
    });

    const pendingCount = helpMessages.filter(m => m.status === 'pending').length;
    const inProgressCount = helpMessages.filter(m => m.status === 'in_progress').length;
    const resolvedCount = helpMessages.filter(m => m.status === 'resolved').length;

    const handleStatusChange = (id: string, newStatus: 'pending' | 'in_progress' | 'resolved') => {
      const updated = updateStudentHelpMessageStatus(id, newStatus);
      setHelpMessages(updated);
      showToast(`Ticket status updated to "${newStatus.replace('_', ' ')}"`);
    };

    const handleSaveNotes = (id: string) => {
      const updated = updateStudentHelpMessageNotes(id, editingNotesText);
      setHelpMessages(updated);
      setEditingNotesId(null);
      setEditingNotesText('');
      showToast('Admin notes saved successfully');
    };

    const handleDelete = (id: string) => {
      if (window.confirm('Are you sure you want to delete this help ticket?')) {
        const updated = deleteStudentHelpMessage(id);
        setHelpMessages(updated);
        showToast('Ticket deleted');
      }
    };

    const handleClearResolved = () => {
      if (window.confirm('Are you sure you want to clear all resolved help tickets?')) {
        const updated = clearResolvedStudentHelpMessages();
        setHelpMessages(updated);
        showToast('All resolved tickets cleared');
      }
    };

    return (
      <section className="space-y-6">
        {/* Top Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0d0e] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[130px] rounded-full pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 mb-3">
                <MessageSquare className="w-3.5 h-3.5 text-primary" />
                <span className="font-mono text-[10px] text-primary font-bold uppercase tracking-wider">
                  Direct Student Assistance Desk
                </span>
                {pendingCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                    {pendingCount} Needs Attention
                  </span>
                )}
              </div>
              <h2 className="font-jakarta text-lg font-black text-paper">
                Student Help Requests
              </h2>
              <p className="font-mono text-xs text-slate mt-1.5 max-w-2xl leading-relaxed">
                Review and resolve questions, code doubts, and assistance requests submitted directly by students across Python, Java, Full Stack, and Cyber Security tracks.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setHelpMessages(getStudentHelpMessages());
                  showToast('Help tickets refreshed');
                }}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-paper font-jakarta text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
                title="Refresh list"
              >
                <RefreshCw className="w-3.5 h-3.5 text-primary" />
                <span>Refresh</span>
              </button>

              {resolvedCount > 0 && (
                <button
                  type="button"
                  onClick={handleClearResolved}
                  className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 font-jakarta text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Clear all resolved tickets"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Resolved</span>
                </button>
              )}
            </div>
          </div>

          {/* Metric Badges Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/10 relative z-10">
            <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5">
              <span className="font-mono text-[10px] text-slate uppercase block">Total Tickets</span>
              <span className="font-jakarta text-2xl font-black text-paper mt-1 block">
                {helpMessages.length}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <span className="font-mono text-[10px] text-amber-300 uppercase block flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span>Pending Action</span>
              </span>
              <span className="font-jakarta text-2xl font-black text-amber-300 mt-1 block">
                {pendingCount}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20">
              <span className="font-mono text-[10px] text-sky-300 uppercase block">In Progress</span>
              <span className="font-jakarta text-2xl font-black text-sky-300 mt-1 block">
                {inProgressCount}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="font-mono text-[10px] text-emerald-300 uppercase block">Resolved</span>
              <span className="font-jakarta text-2xl font-black text-emerald-300 mt-1 block">
                {resolvedCount}
              </span>
            </div>
          </div>
        </div>

        {/* Support Channels (Call & WhatsApp) Configuration Card */}
        <div className="p-6 rounded-3xl bg-[#0c0d0e] border border-white/10 shadow-2xl relative overflow-hidden space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0">
                <Phone className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-jakarta text-sm sm:text-base font-bold text-paper">
                  Support Contact Numbers (Call &amp; WhatsApp)
                </h3>
                <p className="font-mono text-xs text-slate">
                  Configure the official phone and WhatsApp routing for student &quot;Need Help&quot; buttons across all course pages.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active Live Routing</span>
              </span>
            </div>
          </div>

          <form onSubmit={handleSaveSupportChannels} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end pt-1">
            <div className="md:col-span-5 space-y-1.5">
              <label className="block font-mono text-[11px] text-slate font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-paper">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call Us Phone Number *</span>
                </span>
                {supportPhoneInput && (
                  <a
                    href={`tel:${supportPhoneInput.replace(/[^0-9+]/g, '')}`}
                    className="text-[10px] text-primary hover:underline font-mono"
                    title="Test Call"
                  >
                    Test Call ↗
                  </a>
                )}
              </label>
              <input
                type="text"
                required
                value={supportPhoneInput}
                onChange={(e) => setSupportPhoneInput(e.target.value)}
                placeholder="+91 97787 07336"
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-paper font-mono text-xs focus:outline-none focus:border-primary transition-colors"
              />
              <span className="font-mono text-[10px] text-slate/60 block">
                Triggered immediately when student taps &quot;Call Us&quot; on any course page.
              </span>
            </div>

            <div className="md:col-span-5 space-y-1.5">
              <label className="block font-mono text-[11px] text-slate font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-paper">
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp Mentor Number *</span>
                </span>
                {supportWhatsAppInput && (
                  <a
                    href={`https://wa.me/${supportWhatsAppInput.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-[#25D366] hover:underline font-mono"
                    title="Test WhatsApp"
                  >
                    Test WhatsApp ↗
                  </a>
                )}
              </label>
              <input
                type="text"
                required
                value={supportWhatsAppInput}
                onChange={(e) => setSupportWhatsAppInput(e.target.value)}
                placeholder="+91 97787 07336 or 919778707336"
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-paper font-mono text-xs focus:outline-none focus:border-primary transition-colors"
              />
              <span className="font-mono text-[10px] text-slate/60 block">
                Opens mentor chat directly when student taps &quot;WhatsApp&quot; on any course page.
              </span>
            </div>

            <div className="md:col-span-2 flex items-end">
              <button
                type="submit"
                disabled={isSavingSupportNumbers}
                className="w-full py-2.5 rounded-xl bg-primary text-ink font-jakarta font-black text-xs uppercase tracking-wider hover:bg-white transition-all cursor-pointer shadow-lg shadow-primary/20 flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingSupportNumbers ? 'Saving...' : 'Save Numbers'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-[#0c0d0e] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={helpSearch}
              onChange={(e) => setHelpSearch(e.target.value)}
              placeholder="Search student name, phone, email, course..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-paper font-jakarta text-xs focus:outline-none focus:border-primary transition-colors"
            />
            {helpSearch && (
              <button
                type="button"
                onClick={() => setHelpSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-paper"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Tabs & Course Filter */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {(['all', 'pending', 'in_progress', 'resolved'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setHelpStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl font-jakarta text-xs font-bold transition-all cursor-pointer ${
                  helpStatusFilter === st
                    ? 'bg-primary text-ink shadow-md shadow-primary/20'
                    : 'bg-white/5 text-slate hover:text-paper hover:bg-white/10'
                }`}
              >
                {st === 'all' && `All (${helpMessages.length})`}
                {st === 'pending' && `Pending (${pendingCount})`}
                {st === 'in_progress' && `In Progress (${inProgressCount})`}
                {st === 'resolved' && `Resolved (${resolvedCount})`}
              </button>
            ))}

            <select
              value={helpCourseFilter}
              onChange={(e) => setHelpCourseFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-black/70 border border-white/10 text-paper font-mono text-xs focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="all">All Courses</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="fullstack">Full Stack</option>
              <option value="cyber">Cyber Security</option>
            </select>
          </div>
        </div>

        {/* Tickets List */}
        {filteredHelp.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#0c0d0e] border border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-full bg-white/5 text-slate flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h4 className="font-jakarta text-base font-bold text-paper">No Help Requests Found</h4>
            <p className="font-mono text-xs text-slate max-w-sm mx-auto">
              {helpSearch || helpStatusFilter !== 'all' || helpCourseFilter !== 'all'
                ? 'Try adjusting your search query or status filter.'
                : 'Direct student help inquiries submitted through course pages will appear here in real time.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHelp.map((item) => {
              const dateStr = new Date(item.submittedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });
              const timeStr = new Date(item.submittedAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              });

              const cleanPhone = item.studentPhone.replace(/[^0-9+]/g, '');
              const cleanPhoneWa = item.studentPhone.replace(/[^0-9]/g, '');

              return (
                <div
                  key={item.id}
                  className={`p-5 sm:p-6 rounded-3xl bg-[#0c0d0e] border transition-all space-y-4 shadow-xl ${
                    item.status === 'pending'
                      ? 'border-amber-500/40 bg-gradient-to-r from-amber-500/[0.03] to-transparent'
                      : item.status === 'in_progress'
                      ? 'border-sky-500/40 bg-gradient-to-r from-sky-500/[0.03] to-transparent'
                      : 'border-white/10 opacity-90'
                  }`}
                >
                  {/* Top Bar: Status, Ticket ID, Timestamp & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider ${
                          item.status === 'pending'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : item.status === 'in_progress'
                            ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                            : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.status === 'pending'
                              ? 'bg-amber-400 animate-pulse'
                              : item.status === 'in_progress'
                              ? 'bg-sky-400'
                              : 'bg-emerald-400'
                          }`}
                        />
                        <span>{item.status.replace('_', ' ')}</span>
                      </span>

                      <span className="font-mono text-xs text-slate/80 font-bold">
                        #{item.id}
                      </span>

                      <span className="font-mono text-xs text-slate/50">
                        • {dateStr} at {timeStr}
                      </span>
                    </div>

                    {/* Quick Status Control Buttons & Delete */}
                    <div className="flex items-center gap-2">
                      {item.status !== 'resolved' ? (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(item.id, 'resolved')}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-jakarta text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                          title="Mark this request as resolved"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Mark as Resolved</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-jakarta text-xs font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Resolved</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(item.id, 'pending')}
                            className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate hover:text-paper font-mono text-[10px] transition-colors cursor-pointer"
                            title="Reopen help request"
                          >
                            Reopen
                          </button>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate hover:text-rose-400 border border-white/10 hover:border-rose-500/30 transition-all cursor-pointer ml-1"
                        title="Delete Ticket"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Student & Course Details Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                    {/* Student Name & Avatar */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center font-jakarta font-black text-primary text-sm shrink-0">
                        {getUserInitials(item.studentName)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-jakarta text-sm font-bold text-paper truncate">
                          {item.studentName}
                        </h4>
                        <div className="flex items-center gap-1 font-mono text-[11px] text-slate truncate">
                          <Mail className="w-3 h-3 shrink-0 text-slate/70" />
                          <a
                            href={`mailto:${item.studentEmail}`}
                            className="hover:text-primary transition-colors truncate"
                          >
                            {item.studentEmail}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Phone Number with One-Click Call & WhatsApp */}
                    <div className="flex items-center gap-2 bg-black/40 px-3.5 py-2 rounded-2xl border border-white/5">
                      <div className="min-w-0 flex-1">
                        <span className="font-mono text-[10px] text-slate/70 block uppercase">
                          Contact Phone
                        </span>
                        <span className="font-mono text-xs font-bold text-paper truncate block">
                          {item.studentPhone}
                        </span>
                      </div>

                      <a
                        href={`tel:${cleanPhone}`}
                        className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 transition-all shrink-0 cursor-pointer"
                        title={`Call ${item.studentPhone}`}
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>

                      <a
                        href={`https://wa.me/${cleanPhoneWa}?text=${encodeURIComponent(
                          `Hi ${item.studentName}, regarding your help request for "${item.courseTitle}" on DO PILOT:`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/30 transition-all shrink-0 cursor-pointer"
                        title={`WhatsApp ${item.studentPhone}`}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {/* Course Track Tag */}
                    <div className="flex items-center gap-2 bg-black/40 px-3.5 py-2 rounded-2xl border border-white/5">
                      <BookOpen className="w-4 h-4 text-primary shrink-0" />
                      <div className="min-w-0">
                        <span className="font-mono text-[10px] text-slate/70 block uppercase">
                          Enrolled Course
                        </span>
                        <span className="font-jakarta text-xs font-bold text-paper truncate block">
                          {item.courseTitle}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Student Message Body */}
                  <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1.5">
                    <span className="font-mono text-[10px] text-primary font-bold uppercase tracking-wider block">
                      Student Help Message:
                    </span>
                    <p className="font-jakarta text-xs sm:text-sm text-paper leading-relaxed whitespace-pre-wrap">
                      {item.message}
                    </p>
                  </div>

                  {/* Admin Resolution Notes Box */}
                  <div className="pt-1">
                    {editingNotesId === item.id ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                            <span>Internal Note (Admin Only — Not visible to students)</span>
                          </span>
                        </div>
                        <textarea
                          rows={2}
                          value={editingNotesText}
                          onChange={(e) => setEditingNotesText(e.target.value)}
                          placeholder="Type internal resolution note, e.g. Called student, explained topic, resolved error..."
                          className="w-full px-3 py-2 rounded-xl bg-black border border-primary/50 text-paper font-jakarta text-xs focus:outline-none resize-none"
                        />
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingNotesId(null);
                              setEditingNotesText('');
                            }}
                            className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveNotes(item.id)}
                            className="px-3.5 py-1 rounded-lg bg-primary text-ink font-bold text-xs hover:bg-white transition-all cursor-pointer"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3 text-xs font-mono">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-slate/70 uppercase text-[10px] shrink-0 flex items-center gap-1.5">
                            <span>Admin Notes:</span>
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-[9px] text-amber-300 font-mono font-bold uppercase border border-amber-500/20">Admin Only</span>
                          </span>
                          <span className="text-paper truncate italic">
                            {item.adminNotes ? item.adminNotes : 'No notes added yet.'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingNotesId(item.id);
                            setEditingNotesText(item.adminNotes || '');
                          }}
                          className="text-[11px] text-primary hover:underline shrink-0 cursor-pointer font-sans font-semibold"
                        >
                          {item.adminNotes ? 'Edit Note' : '+ Add Note'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    );
  };

  // Course Assessment Reset Confirmation Modal
  const renderCourseResetConfirmModal = () => {
    if (!confirmResetTarget) return null;

    const handleConfirmReset = async () => {
      setIsResettingCourse(true);
      try {
        const adminName = getAdminUsername() || 'admin';
        const res = resetStudentCourse(confirmResetTarget.id, adminName, adminResetNotes);
        if (res.success) {
          addAuditLog(
            'COURSE_UNLOCKED',
            `Admin ${adminName} unlocked ${confirmResetTarget.courseName} for student ${confirmResetTarget.studentName} (${confirmResetTarget.studentEmail}). Failure streak reset to 0.`,
            'SUCCESS'
          );
          setLockedRecords(getLockedCourseRecords());
          setCourseResetAuditLogs(getCourseResetAuditEntries());
          showToast(`Course successfully unlocked for ${confirmResetTarget.studentName}!`);
          setConfirmResetTarget(null);
          setAdminResetNotes('');
        } else {
          showToast(res.error || 'Failed to unlock course');
        }
      } catch (e) {
        showToast('Error executing course reset');
      } finally {
        setIsResettingCourse(false);
      }
    };

    const targetFailedPart = getRecordFailedPart(confirmResetTarget);
    const targetFailedSection = getRecordFailedSection(confirmResetTarget);

    return (
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
        <div className="max-w-xl w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0c0d0e] border border-white/15 p-5 sm:p-6 space-y-4 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none" />

          {/* Modal Header */}
          <div className="flex items-start justify-between gap-4 relative z-10 pb-2 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-jakarta text-base font-bold text-paper">
                  Reset / Unlock Course
                </h3>
                <p className="font-mono text-xs text-slate mt-0.5">
                  Confirm reset of failure state and unlock course progression
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setConfirmResetTarget(null);
                setAdminResetNotes('');
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate hover:text-paper transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Target Student & Course Details */}
          <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-white/10 space-y-3 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="font-mono text-[10px] text-slate/70 uppercase block">Student Name</span>
                <span className="font-jakarta font-bold text-paper text-sm">{confirmResetTarget.studentName}</span>
              </div>
              <div>
                <span className="font-mono text-[10px] text-slate/70 uppercase block">Student Email</span>
                <span className="font-mono text-paper truncate block">{confirmResetTarget.studentEmail}</span>
              </div>
              {confirmResetTarget.studentPhone && (
                <div>
                  <span className="font-mono text-[10px] text-slate/70 uppercase block">Phone</span>
                  <span className="font-mono text-paper block">{confirmResetTarget.studentPhone}</span>
                </div>
              )}
              <div>
                <span className="font-mono text-[10px] text-slate/70 uppercase block">Course</span>
                <span className="font-jakarta font-bold text-cyan-300 block">{confirmResetTarget.courseName}</span>
              </div>
              <div>
                <span className="font-mono text-[10px] text-slate/70 uppercase block">Failed Part</span>
                <span className="font-mono text-paper font-bold block">{targetFailedPart}</span>
              </div>
              <div>
                <span className="font-mono text-[10px] text-slate/70 uppercase block">Failed Section</span>
                <span className="font-mono text-rose-300 font-bold block">{targetFailedSection}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 font-mono text-[11px] text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Resets 3 consecutive failures to 0 and unlocks {confirmResetTarget.courseName}</span>
            </div>
          </div>

          {/* Admin Notes Field */}
          <div className="space-y-2 relative z-10">
            <label className="font-mono text-[11px] text-slate/80 font-bold uppercase tracking-wider block">
              Admin Notes (Optional)
            </label>
            <input
              type="text"
              value={adminResetNotes}
              onChange={(e) => setAdminResetNotes(e.target.value)}
              placeholder="e.g. Concept reviewed with mentor, approved for retake"
              className="w-full px-4 py-2.5 rounded-xl bg-black/70 border border-white/10 text-paper font-jakarta text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-all placeholder:text-slate/40"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 relative z-10">
            <button
              type="button"
              onClick={() => {
                setConfirmResetTarget(null);
                setAdminResetNotes('');
              }}
              disabled={isResettingCourse}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate hover:text-paper font-jakarta text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmReset}
              disabled={isResettingCourse}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-white text-black font-jakarta font-black text-xs uppercase tracking-wider shadow-lg shadow-primary/30 border border-primary/50 flex items-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50 opacity-100"
            >
              <RotateCcw className={`w-4 h-4 text-black ${isResettingCourse ? 'animate-spin' : ''}`} />
              <span>{isResettingCourse ? 'Unlocking...' : 'Reset / Unlock Course'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Course Assessment Reset & Lockout Management Section
  const renderCourseResetSection = () => {
    const unlockedCount = lockedRecords.filter(r => r.lockStatus === 'unlocked').length;

    const filteredRecords = lockedRecords.filter(r => {
      // Show only students whose courses are locked after 3 consecutive failures (or show unlocked if filter matches)
      const matchSearch =
        courseResetSearch.trim() === '' ||
        r.studentName.toLowerCase().includes(courseResetSearch.toLowerCase()) ||
        r.studentEmail.toLowerCase().includes(courseResetSearch.toLowerCase()) ||
        (r.studentPhone && r.studentPhone.toLowerCase().includes(courseResetSearch.toLowerCase())) ||
        r.courseName.toLowerCase().includes(courseResetSearch.toLowerCase()) ||
        (r.partTitle && r.partTitle.toLowerCase().includes(courseResetSearch.toLowerCase()));

      const matchStatus =
        courseResetStatusFilter === 'all' || r.lockStatus === courseResetStatusFilter;

      const matchCourse =
        courseResetCourseFilter === 'all' ||
        r.courseId.toLowerCase().includes(courseResetCourseFilter.toLowerCase()) ||
        r.courseName.toLowerCase().includes(courseResetCourseFilter.toLowerCase());

      return matchSearch && matchStatus && matchCourse;
    });

    const handleRefresh = () => {
      const live = scanAndSyncLiveLocks();
      setLockedRecords(live);
      setCourseResetAuditLogs(getCourseResetAuditEntries());
      showToast('Course lock records refreshed');
    };

    return (
      <section id="section-course-reset" className="rounded-3xl bg-[#0c0d0e] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-jakarta text-lg font-black text-paper">Course Reset</h2>
              <span className="font-mono text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full font-bold">
                Course Reset &amp; Unlock
              </span>
              {activeLockedCount > 0 && (
                <span className="font-mono text-[10px] text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-full font-bold border border-rose-500/30">
                  {activeLockedCount} Locked
                </span>
              )}
            </div>
            <p className="text-xs text-slate mt-0.5">
              Unlock students whose progression is locked after 3 consecutive assessment failures.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-paper font-jakarta text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Refresh locked student records"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Refresh Status</span>
            </button>
          </div>
        </div>

        {/* Essential Metrics: Locked Courses and Unlocked Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-black/40 border border-rose-500/20 flex items-center justify-between gap-3">
            <div>
              <span className="font-mono text-[10px] text-rose-400 font-bold uppercase tracking-wider block">
                Locked Courses
              </span>
              <div className="text-lg font-jakarta font-black text-rose-300 leading-none mt-1">
                {activeLockedCount}
              </div>
              <p className="font-mono text-[10px] text-slate/70 mt-0.5">
                Locked after 3 consecutive failures
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-500/20 flex items-center justify-between gap-3">
            <div>
              <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                Unlocked
              </span>
              <div className="text-lg font-jakarta font-black text-emerald-300 leading-none mt-1">
                {unlockedCount}
              </div>
              <p className="font-mono text-[10px] text-slate/70 mt-0.5">
                Reset by admin &amp; active
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-slate absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student, email, course..."
              value={courseResetSearch}
              onChange={(e) => setCourseResetSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/50 border border-white/10 text-paper font-jakarta text-xs focus:outline-none focus:border-cyan-400 placeholder:text-slate/50"
            />
          </div>

          <div className="flex items-center p-1 bg-black/50 border border-white/10 rounded-xl w-full sm:w-auto justify-center">
            {(['all', 'locked', 'unlocked'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setCourseResetStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-jakarta text-xs font-bold transition-all cursor-pointer capitalize ${
                  courseResetStatusFilter === st
                    ? 'bg-cyan-500 text-ink shadow-md shadow-cyan-500/20'
                    : 'text-slate hover:text-paper'
                }`}
              >
                {st === 'all' && `All (${lockedRecords.length})`}
                {st === 'locked' && `Locked (${activeLockedCount})`}
                {st === 'unlocked' && `Unlocked (${unlockedCount})`}
              </button>
            ))}
          </div>
        </div>

        {/* Locked Courses List */}
        {filteredRecords.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-black/30 border border-white/10 space-y-2">
            <div className="w-10 h-10 rounded-full bg-white/5 text-slate flex items-center justify-center mx-auto">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <h4 className="font-jakarta text-sm font-bold text-paper">No Locked Students Found</h4>
            <p className="font-mono text-xs text-slate max-w-md mx-auto">
              {courseResetSearch || courseResetStatusFilter !== 'all'
                ? 'No records match your active search or filter.'
                : 'All students are currently progressing without lockouts.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRecords.map((item) => {
              const isLocked = item.lockStatus === 'locked';
              const failedPart = getRecordFailedPart(item);
              const failedSection = getRecordFailedSection(item);

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl bg-black/40 border transition-all space-y-3 shadow-lg ${
                    isLocked
                      ? 'border-rose-500/30 hover:border-rose-500/50'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    {/* Student Info & Details */}
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                        isLocked
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {getUserInitials(item.studentName)}
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-jakarta font-bold text-xs text-paper truncate">
                            {item.studentName}
                          </h4>

                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate/70 border border-white/5">
                            ID: {item.studentId}
                          </span>

                          {isLocked ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 font-mono text-[10px] font-bold">
                              <ShieldAlert className="w-3 h-3" />
                              <span>Locked (3 Failures)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Unlocked</span>
                            </span>
                          )}
                        </div>

                        {/* Relevant Details: Email, Phone, College */}
                        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-slate">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate/60 shrink-0" />
                            <a href={`mailto:${item.studentEmail}`} className="hover:text-cyan-300 transition-colors">
                              {item.studentEmail}
                            </a>
                          </span>
                          {item.studentPhone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate/60 shrink-0" />
                              <span>{item.studentPhone}</span>
                            </span>
                          )}
                          {item.collegeOrCompany && (
                            <span className="flex items-center gap-1">
                              <GraduationCap className="w-3 h-3 text-slate/60 shrink-0" />
                              <span>{item.collegeOrCompany}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Single Reset / Unlock Course Button */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {isLocked ? (
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmResetTarget(item);
                            setAdminResetNotes('');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-primary/20 transition-all active:scale-95"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-ink" />
                          <span>Reset / Unlock Course</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs text-emerald-400 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Unlocked</span>
                            {item.unlockedAt && (
                              <span className="text-slate/60 text-[10px]">
                                ({new Date(item.unlockedAt).toLocaleDateString()})
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Course Details: Course Name, Failed Part, Failed Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2.5 border-t border-white/5">
                    <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 min-w-0">
                      <span className="font-mono text-[10px] text-slate/50 uppercase block">Course Name</span>
                      <span className="font-jakarta font-bold text-xs text-paper block truncate">
                        {item.courseName}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 min-w-0">
                      <span className="font-mono text-[10px] text-slate/50 uppercase block">Failed Part</span>
                      <span className="font-mono text-xs font-bold text-cyan-300 block truncate">
                        {failedPart}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 min-w-0">
                      <span className="font-mono text-[10px] text-slate/50 uppercase block">Failed Section</span>
                      <span className="font-mono text-xs text-rose-300 block truncate">
                        {failedSection}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    );
  };

  // ----------------------------------------------------
  // Course Pricing & Coupons Handlers & Section
  // ----------------------------------------------------
  const handleSaveCoursePricing = (e: React.FormEvent) => {
    e.preventDefault();
    const activePricing = coursePricingList.find(p => p.courseId === selectedPricingCourseId) || coursePricingList[0];
    if (activePricing) {
      updateCoursePricing({
        ...activePricing,
        regularPrice: Number(pricingRegularInput) || 0,
        salePrice: Number(pricingSaleInput) || 0,
        isActive: pricingIsActive,
        isFreeCourse: pricingIsFreeCourse,
        updatedAt: new Date().toISOString()
      });
      setCoursePricingList(getCoursePricingList());
      showToast(
        pricingIsFreeCourse
          ? `Saved ${activePricing.courseName} as 100% Free Course!`
          : `Saved pricing for ${activePricing.courseName} (₹${pricingSaleInput})!`
      );
    }
  };

  const handleOpenCouponModal = (coupon?: CourseCoupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setCouponFormCode(coupon.code);
      setCouponFormCourseId(coupon.courseId);
      setCouponFormType(coupon.discountType);
      setCouponFormValue(coupon.discountValue);
      setCouponFormMaxUses(coupon.maxUses ?? -1);
      setCouponFormExpiry(coupon.validUntil ? coupon.validUntil.slice(0, 10) : '');
      setCouponFormDesc(coupon.description || '');
      setCouponFormIsActive(coupon.isActive);
    } else {
      setEditingCoupon(null);
      setCouponFormCode('');
      setCouponFormCourseId(selectedPricingCourseId);
      setCouponFormType('percentage');
      setCouponFormValue(100);
      setCouponFormMaxUses(-1);
      setCouponFormExpiry('');
      setCouponFormDesc('');
      setCouponFormIsActive(true);
    }
    setCouponModalOpen(true);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponFormCode.trim().toUpperCase();
    if (!cleanCode) {
      alert('Please enter a valid coupon code.');
      return;
    }
    const val = Number(couponFormValue) || 0;
    const maxU = Number(couponFormMaxUses);
    const newCouponPayload = {
      code: cleanCode,
      courseId: couponFormCourseId,
      discountType: couponFormType,
      discountValue: val,
      maxUses: maxU > 0 ? maxU : -1,
      isActive: couponFormIsActive,
      validUntil: couponFormExpiry ? new Date(couponFormExpiry).toISOString() : undefined,
      description: couponFormDesc.trim() || undefined
    };

    if (editingCoupon) {
      updateCourseCoupon({
        ...editingCoupon,
        ...newCouponPayload
      });
      showToast(`Coupon ${cleanCode} updated!`);
    } else {
      createCourseCoupon(newCouponPayload);
      showToast(`Coupon ${cleanCode} created!`);
    }
    setCourseCoupons(getCourseCoupons());
    setCouponModalOpen(false);
  };

  const handleToggleCoupon = (code: string) => {
    toggleCourseCouponActive(code);
    setCourseCoupons(getCourseCoupons());
    showToast(`Updated coupon status`);
  };

  const handleDeleteCoupon = (code: string) => {
    if (window.confirm(`Are you sure you want to delete coupon ${code}?`)) {
      deleteCourseCoupon(code);
      setCourseCoupons(getCourseCoupons());
      showToast(`Coupon ${code} removed`);
    }
  };

  const handleTestQrUrl = async (urlToTest?: string): Promise<boolean> => {
    const targetUrl = (urlToTest !== undefined ? urlToTest : qrImageUrlInput).trim();
    if (!targetUrl) {
      setQrUrlVerificationStatus('valid');
      setQrUrlVerificationMsg('No custom image URL provided (dynamic Google Pay QR code will be generated automatically).');
      return true;
    }

    setIsVerifyingQrUrl(true);
    setQrUrlVerificationStatus('idle');
    setQrUrlVerificationMsg(null);

    const testResult = await verifyImageUrl(targetUrl);
    setIsVerifyingQrUrl(false);

    if (testResult.valid) {
      setQrUrlVerificationStatus('valid');
      setQrUrlVerificationMsg('Cloudflare QR Image URL is valid, accessible, and ready for use!');
      return true;
    } else {
      setQrUrlVerificationStatus('invalid');
      setQrUrlVerificationMsg(testResult.error || 'Failed to load image from this URL. Please verify that the Cloudflare URL is public.');
      return false;
    }
  };

  const handleSavePaymentSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!qrUpiIdInput.trim()) {
      showToast('Please enter a valid Google Pay UPI ID.');
      return;
    }

    if (!bankingNameInput.trim()) {
      showToast('Please enter the Banking / Account Display Name.');
      return;
    }

    if (qrImageUrlInput.trim()) {
      setIsSavingQrConfig(true);
      const isOk = await handleTestQrUrl(qrImageUrlInput);
      if (!isOk) {
        setIsSavingQrConfig(false);
        showToast('Image URL verification failed. Please check the URL before saving.');
        return;
      }
    }

    setIsSavingQrConfig(true);
    const updated = updatePaymentQRConfig({
      recipientName: recipientNameInput.trim() || 'Jayadev Nair',
      bankingName: bankingNameInput.trim() || 'JAYADEV NAIR',
      merchantName: bankingNameInput.trim() || 'JAYADEV NAIR',
      phoneNumber: phoneNumberInput.trim() || '+91 97459 49326',
      upiId: qrUpiIdInput.trim() || 'jayadevnair200518@oksbi',
      qrImageUrl: qrImageUrlInput.trim(),
      paymentInstructions: qrInstructionsInput.trim() || 'Scan using Google Pay or any UPI app. Complete the payment and enter your 12-digit UPI Reference / UTR Number below to verify your enrollment.',
      timeoutMinutes: Math.max(1, Math.min(60, Number(qrTimeoutMinutesInput) || 10)),
      isEnabled: qrManualEnabledInput,
      paymentMethod: 'google_pay_upi'
    });

    setPaymentQRConfig(updated);
    setIsSavingQrConfig(false);
    showToast('Payment settings saved and updated across student website!');
  };

  const handleResetPaymentSettingsToDefaults = () => {
    if (window.confirm('Reset all Google Pay payment credentials to default settings?')) {
      const resetConfig = updatePaymentQRConfig({
        ...DEFAULT_PAYMENT_QR_CONFIG,
        updatedAt: new Date().toISOString()
      });
      setPaymentQRConfig(resetConfig);
      setRecipientNameInput(resetConfig.recipientName);
      setBankingNameInput(resetConfig.bankingName);
      setPhoneNumberInput(resetConfig.phoneNumber);
      setQrUpiIdInput(resetConfig.upiId);
      setQrImageUrlInput(resetConfig.qrImageUrl || '');
      setQrInstructionsInput(resetConfig.paymentInstructions || '');
      setQrTimeoutMinutesInput(resetConfig.timeoutMinutes);
      setQrManualEnabledInput(resetConfig.isEnabled);
      setQrUrlVerificationStatus('idle');
      setQrUrlVerificationMsg(null);
      showToast('Google Pay payment settings reset to defaults.');
    }
  };

  const handleVerifyManualPayment = (purchaseId: string, approve: boolean, notes?: string) => {
    const rec = coursePurchases.find(p => p.id === purchaseId);
    if (!rec) return;

    setVerifyingPurchaseId(purchaseId);
    const result = verifyManualQRPurchase(
      purchaseId,
      approve,
      notes || adminVerifyNotes || adminEmails.primaryEmail || 'Admin UPI Verification'
    );
    setCoursePurchases(getCoursePurchases());
    setVerifyingPurchaseId(null);
    setConfirmVerifyPurchaseTarget(null);
    setAdminVerifyNotes('');
    showToast(result.message);
  };

  const renderPaymentVerifyModal = () => {
    if (!confirmVerifyPurchaseTarget) return null;
    const rec = confirmVerifyPurchaseTarget;
    const alreadyOwns = hasCourseAccess(rec.studentId, rec.courseId);

    return (
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
        <div className="max-w-xl w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0c0d0e] border border-white/15 p-5 sm:p-6 space-y-4 shadow-2xl relative">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <CheckCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-jakarta font-bold text-base text-paper">
                  Verify Payment &amp; Unlock Course
                </h3>
                <p className="text-xs text-slate font-mono">
                  Order Reference: {rec.id}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setConfirmVerifyPurchaseTarget(null);
                setAdminVerifyNotes('');
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate hover:text-paper transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Payment Limitation Notice */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-cyan-500/20 text-xs text-slate space-y-1">
              <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Google Pay Verification Step</span>
              </div>
              <p className="leading-relaxed">
                Match the 12-digit UPI reference ID below against your Google Pay transaction statement. Confirming will record the purchase and unlock full course access for this student.
              </p>
            </div>

            {/* Student & Course Evidence */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs">
              <div>
                <span className="text-slate/70 text-[10px] uppercase block">Student Name</span>
                <span className="text-paper font-bold">{rec.studentName}</span>
              </div>
              <div>
                <span className="text-slate/70 text-[10px] uppercase block">Student Email</span>
                <span className="text-paper truncate block">{rec.studentEmail}</span>
              </div>
              <div>
                <span className="text-slate/70 text-[10px] uppercase block">Phone / Mobile</span>
                <span className="text-paper">{rec.studentPhone || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-slate/70 text-[10px] uppercase block">Student ID</span>
                <span className="text-paper">{rec.studentId}</span>
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-white/5">
                <span className="text-slate/70 text-[10px] uppercase block">Course Name</span>
                <span className="text-cyan-300 font-bold text-sm">{rec.courseName}</span>
              </div>
            </div>

            {/* Payment Details & Submitted UTR */}
            <div className="p-4 rounded-2xl bg-black/80 border border-white/10 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center text-slate">
                <span>Expected Payable Amount:</span>
                <span className="text-emerald-400 font-bold text-base">₹{rec.finalAmount.toLocaleString()}</span>
              </div>
              {rec.couponCodeApplied && (
                <div className="flex justify-between items-center text-slate">
                  <span>Coupon Applied:</span>
                  <span className="text-primary font-bold">{rec.couponCodeApplied}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-slate">
                <span>Session Started:</span>
                <span className="text-paper">{new Date(rec.purchasedAt).toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-bold text-paper text-xs uppercase tracking-wider">
                  Submitted UPI Reference (UTR):
                </span>
                {rec.utrNumber ? (
                  <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-sm tracking-wider inline-block">
                    {rec.utrNumber}
                  </span>
                ) : (
                  <span className="text-rose-400 italic">No UTR submitted</span>
                )}
              </div>
            </div>

            {/* Warning if already has access */}
            {alreadyOwns && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Notice: This student already has unlocked access to this course. Duplicate access will be prevented.</span>
              </div>
            )}

            {/* Admin Notes Input */}
            <div className="space-y-1">
              <label className="block text-xs font-mono font-bold text-slate uppercase">
                Verification Notes / Statement Ref (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Matched in SBI GPay statement, Jayadev Nair account"
                value={adminVerifyNotes}
                onChange={(e) => setAdminVerifyNotes(e.target.value)}
                className="w-full bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-paper font-mono text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                setConfirmVerifyPurchaseTarget(null);
                setAdminVerifyNotes('');
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate hover:text-paper font-mono text-xs cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={verifyingPurchaseId === rec.id}
              onClick={() => handleVerifyManualPayment(rec.id, false, adminVerifyNotes)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-xs cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject Payment</span>
            </button>
            <button
              type="button"
              disabled={verifyingPurchaseId === rec.id}
              onClick={() => handleVerifyManualPayment(rec.id, true, adminVerifyNotes)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-95 text-black font-jakarta font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Confirm &amp; Unlock Course</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCouponModal = () => (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-2xl sm:max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0c0d0e] border border-white/15 p-5 sm:p-6 space-y-4 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-jakarta font-bold text-base text-paper">
                {editingCoupon ? 'Edit Coupon Code' : 'Create New Coupon'}
              </h3>
              <p className="text-xs text-slate">Configure discount rules, course eligibility &amp; limits</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCouponModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate hover:text-paper"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSaveCoupon} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Coupon Code (Uppercase)</label>
              <input
                type="text"
                required
                disabled={!!editingCoupon}
                value={couponFormCode}
                onChange={(e) => setCouponFormCode(e.target.value.toUpperCase())}
                placeholder="e.g. DOPILOT100 or FLAT500"
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper focus:border-primary focus:outline-none font-mono text-sm tracking-wider uppercase font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate mb-1">Applies To Course</label>
              <select
                value={couponFormCourseId}
                onChange={(e) => setCouponFormCourseId(e.target.value)}
                className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-paper focus:border-primary focus:outline-none text-xs"
              >
                <option value="all">All Courses</option>
                {coursePricingList.map(c => (
                  <option key={c.courseId} value={c.courseId}>{c.courseName}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Discount Type</label>
              <select
                value={couponFormType}
                onChange={(e) => setCouponFormType(e.target.value as 'percentage' | 'flat')}
                className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-paper focus:border-primary focus:outline-none text-xs"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate mb-1">
                Discount Value {couponFormType === 'percentage' ? '(100 = 100% Free ₹0)' : '(₹)'}
              </label>
              <input
                type="number"
                min="1"
                max={couponFormType === 'percentage' ? 100 : 100000}
                required
                value={couponFormValue}
                onChange={(e) => setCouponFormValue(Number(e.target.value))}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper focus:border-primary focus:outline-none font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate mb-1">Max Uses (-1 for Unlimited)</label>
              <input
                type="number"
                value={couponFormMaxUses}
                onChange={(e) => setCouponFormMaxUses(Number(e.target.value))}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper focus:border-primary focus:outline-none font-mono text-sm"
              />
            </div>
          </div>

          {couponFormType === 'percentage' && couponFormValue === 100 && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>100% Free Coupon:</strong> This coupon will instantly unlock full course access for ₹0 without requiring payment gateway checkout.
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Expiry Date (Optional)</label>
              <input
                type="date"
                value={couponFormExpiry}
                onChange={(e) => setCouponFormExpiry(e.target.value)}
                className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-paper focus:border-primary focus:outline-none text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate mb-1">Description / Campaign Note</label>
              <input
                type="text"
                value={couponFormDesc}
                onChange={(e) => setCouponFormDesc(e.target.value)}
                placeholder="e.g. Early Bird Launch discount for students"
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper focus:border-primary focus:outline-none text-xs"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="couponActiveCheckbox"
                checked={couponFormIsActive}
                onChange={(e) => setCouponFormIsActive(e.target.checked)}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
              <label htmlFor="couponActiveCheckbox" className="text-xs font-bold text-paper cursor-pointer select-none">
                Coupon is Active and usable by students
              </label>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setCouponModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-paper font-jakarta font-bold text-xs hover:bg-white/15 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-primary text-black font-jakarta font-black text-xs uppercase tracking-wider hover:bg-white transition-all shadow-lg shadow-primary/20 cursor-pointer"
              >
                {editingCoupon ? 'Save Changes' : 'Create Coupon'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  const renderCoursePricingAndCouponsSection = () => {
    const totalPurchases = coursePurchases.length;
    const activeCouponsCount = courseCoupons.filter(c => c.isActive).length;
    const freeCouponsCount = courseCoupons.filter(c => c.isActive && c.discountType === 'percentage' && c.discountValue === 100).length;

    // Filter counts for Purchase & Enrollment Tracking
    const pendingPurchasesCount = coursePurchases.filter(p => p.status === 'pending' || p.status === 'pending_verification').length;
    const enrolledPurchasesCount = coursePurchases.filter(p => p.status === 'completed').length;
    const expiredPurchasesCount = coursePurchases.filter(p => p.status === 'expired').length;
    const rejectedPurchasesCount = coursePurchases.filter(p => p.status === 'rejected').length;

    const filteredPurchases = coursePurchases.filter(p => {
      if (purchaseStatusFilter === 'pending' && p.status !== 'pending' && p.status !== 'pending_verification') return false;
      if (purchaseStatusFilter === 'completed' && p.status !== 'completed') return false;
      if (purchaseStatusFilter === 'expired' && p.status !== 'expired') return false;
      if (purchaseStatusFilter === 'rejected' && p.status !== 'rejected') return false;

      if (purchaseSearch.trim()) {
        const q = purchaseSearch.toLowerCase().trim();
        const matchName = p.studentName?.toLowerCase().includes(q);
        const matchEmail = p.studentEmail?.toLowerCase().includes(q);
        const matchPhone = p.studentPhone?.toLowerCase().includes(q);
        const matchId = p.studentId?.toLowerCase().includes(q);
        const matchCourse = p.courseName?.toLowerCase().includes(q);
        const matchUtr = p.utrNumber?.toLowerCase().includes(q);
        const matchOrderId = p.id?.toLowerCase().includes(q);
        return matchName || matchEmail || matchPhone || matchId || matchCourse || matchUtr || matchOrderId;
      }
      return true;
    });

    return (
      <section className="space-y-8 animate-fadeIn">
        {/* Top Header Card */}
        <div className="p-6 rounded-3xl bg-[#0c0d0e] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary font-mono text-[10px] uppercase font-bold tracking-wider border border-primary/30 flex items-center gap-1.5">
                  <Tag className="w-3 h-3" />
                  E-Commerce &amp; Access Control
                </span>
                <span className="text-slate text-xs">•</span>
                <span className="text-slate text-xs font-medium">Pricing, Coupons &amp; Enrollments</span>
              </div>
              <h2 className="font-jakarta text-lg font-black text-paper">
                Course Pricing
              </h2>
              <p className="text-slate text-xs mt-1 max-w-2xl leading-relaxed">
                Set individual course pricing, toggle free course access, create coupon codes, and verify student Google Pay UPI enrollments.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 min-w-[110px]">
                <div className="text-[10px] font-mono text-slate uppercase">Active Tracks</div>
                <div className="text-xl font-black text-paper mt-0.5">4 Courses</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 min-w-[110px]">
                <div className="text-[10px] font-mono text-slate uppercase">Active Coupons</div>
                <div className="text-xl font-black text-primary mt-0.5">{activeCouponsCount} Codes</div>
              </div>
              {pendingPurchasesCount > 0 && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 min-w-[110px] animate-pulse">
                  <div className="text-[10px] font-mono text-amber-400 uppercase">Pending UTRs</div>
                  <div className="text-xl font-black text-amber-300 mt-0.5">{pendingPurchasesCount} To Verify</div>
                </div>
              )}
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 min-w-[110px]">
                <div className="text-[10px] font-mono text-slate uppercase">Enrolled</div>
                <div className="text-xl font-black text-emerald-400 mt-0.5">{enrolledPurchasesCount} Students</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Course Pricing */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0d0e] border border-white/10 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h3 className="font-jakarta font-bold text-base text-paper flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-primary" />
                Course Pricing
              </h3>
              <p className="text-xs text-slate mt-0.5">
                Select a course from the dropdown to modify its regular price, sale price, or toggle 100% Free Course access.
              </p>
            </div>
          </div>

          {/* Course Selection Dropdown */}
          <div className="max-w-md space-y-1.5">
            <label className="block text-xs font-mono font-bold text-slate uppercase tracking-wider">
              Select Course
            </label>
            <div className="relative">
              <select
                value={selectedPricingCourseId}
                onChange={(e) => setSelectedPricingCourseId(e.target.value)}
                className="w-full bg-black/90 border border-white/20 rounded-xl px-4 py-3 text-paper font-jakarta font-bold text-sm focus:border-primary focus:outline-none cursor-pointer pr-10 shadow-inner"
              >
                {coursePricingList.map(course => (
                  <option key={course.courseId} value={course.courseId}>
                    {course.courseName} {course.isFreeCourse ? '— (Currently 100% Free)' : `— (₹${course.salePrice})`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing Form for Selected Course */}
          {activeCoursePricing && (
            <form onSubmit={handleSaveCoursePricing} className="p-6 rounded-2xl bg-black/60 border border-white/10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
                <div>
                  <h4 className="font-jakarta font-bold text-base text-paper">
                    Editing Pricing: <span className="text-primary">{activeCoursePricing.courseName}</span>
                  </h4>
                  <p className="text-xs text-slate font-mono">Course ID: {activeCoursePricing.courseId}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate">Status:</span>
                  <button
                    type="button"
                    onClick={() => setPricingIsActive(!pricingIsActive)}
                    className={`px-3 py-1 rounded-full text-xs font-bold font-mono transition-all ${
                      pricingIsActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {pricingIsActive ? 'Active for Enrollment' : 'Enrollments Paused'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold text-slate mb-1">Regular Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-slate text-sm">₹</span>
                    <input
                      type="number"
                      min="0"
                      required
                      value={pricingRegularInput}
                      onChange={(e) => setPricingRegularInput(Number(e.target.value))}
                      className="w-full h-[42px] bg-black border border-white/15 rounded-xl pl-8 pr-4 py-2 text-paper font-mono text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate mb-1">Sale Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-primary text-sm font-bold">₹</span>
                    <input
                      type="number"
                      min="0"
                      required
                      value={pricingSaleInput}
                      onChange={(e) => setPricingSaleInput(Number(e.target.value))}
                      className="w-full h-[42px] bg-black border border-white/15 rounded-xl pl-8 pr-4 py-2 text-paper font-mono text-sm font-bold focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate mb-1">Access Type</label>
                  <label className="h-[42px] px-4 rounded-xl bg-white/5 border border-white/15 flex items-center gap-2.5 cursor-pointer hover:bg-white/10 transition-colors">
                    <input
                      type="checkbox"
                      checked={pricingIsFreeCourse}
                      onChange={(e) => setPricingIsFreeCourse(e.target.checked)}
                      className="w-4 h-4 accent-primary rounded cursor-pointer"
                    />
                    <span className={`text-xs font-bold ${pricingIsFreeCourse ? 'text-primary' : 'text-paper'}`}>
                      Free Course
                    </span>
                  </label>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full h-[42px] px-6 rounded-xl bg-primary text-black font-jakarta font-black text-xs uppercase tracking-wider hover:bg-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-slate">
                {pricingIsFreeCourse ? (
                  <span className="text-emerald-400 font-semibold">
                    ✓ Free Course mode active: Unlocks full course access for 100% free. (Configured ₹{pricingSaleInput} price is saved)
                  </span>
                ) : pricingRegularInput > pricingSaleInput ? (
                  <span className="text-primary font-semibold">
                    {Math.round(((pricingRegularInput - pricingSaleInput) / pricingRegularInput) * 100)}% Discount automatically applied to students (Payable: ₹{pricingSaleInput})
                  </span>
                ) : (
                  <span>Crossed-out regular price: ₹{pricingRegularInput} • Current student checkout price: ₹{pricingSaleInput}</span>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 text-xs text-slate">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {pricingIsFreeCourse ? (
                    <>
                      <strong className="text-emerald-300">Free Course Active:</strong> {activeCoursePricing.courseName} is 100% free for all students. Modules, assessments, and certificates are unlocked without requiring payment.
                    </>
                  ) : (
                    <>
                      <strong>Paid Course Rule:</strong> Part 1 is free to try. Parts 2 to 14 require purchasing at ₹{pricingSaleInput} or redeeming a valid coupon code.
                    </>
                  )}
                </span>
              </div>
            </form>
          )}
        </div>

        {/* Section 2: Coupon Codes Management */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0d0e] border border-white/10 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h3 className="font-jakarta font-bold text-base text-paper flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" />
                Course Coupon Codes
              </h3>
              <p className="text-xs text-slate mt-0.5">Manage promo codes, percentage discounts, and 100% free ₹0 instant unlock codes.</p>
            </div>
            <button
              type="button"
              onClick={() => handleOpenCouponModal()}
              className="py-2 px-4 rounded-xl bg-primary text-black font-jakarta font-black text-xs uppercase tracking-wider hover:bg-white transition-all flex items-center gap-2 shadow-lg shadow-primary/20 self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Coupon</span>
            </button>
          </div>

          {/* Coupon Codes Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[650px] text-left text-xs text-paper">
              <thead className="bg-white/5 text-slate font-mono uppercase text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Coupon Code</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Applies To</th>
                  <th className="py-3 px-4">Usage Limit</th>
                  <th className="py-3 px-4">Expiry</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {courseCoupons.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate">
                      No coupon codes created yet. Click "Create New Coupon" to add one.
                    </td>
                  </tr>
                ) : (
                  courseCoupons.map(coupon => {
                    const is100Free = coupon.discountType === 'percentage' && coupon.discountValue === 100;
                    return (
                      <tr key={coupon.code} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-sm text-primary tracking-wider px-2 py-0.5 bg-primary/10 rounded-md border border-primary/20">
                              {coupon.code}
                            </span>
                            {coupon.description && (
                              <span className="text-[10px] text-slate truncate max-w-[150px]" title={coupon.description}>
                                {coupon.description}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold">
                          {is100Free ? (
                            <span className="text-emerald-400">
                              100% FREE (₹0)
                            </span>
                          ) : coupon.discountType === 'percentage' ? (
                            <span className="text-amber-300">
                              {coupon.discountValue}% OFF
                            </span>
                          ) : (
                            <span className="text-amber-300">
                              ₹{coupon.discountValue} OFF
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate">
                          {coupon.courseId === 'all' ? (
                            <span className="text-paper font-semibold">All Courses</span>
                          ) : (
                            <span>{coursePricingList.find(c => c.courseId === coupon.courseId)?.courseName || coupon.courseId}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono">
                          <span className="text-paper">{coupon.usedCount}</span>
                          <span className="text-slate"> / {coupon.maxUses && coupon.maxUses > 0 ? coupon.maxUses : 'Unlimited'}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate">
                          {coupon.validUntil ? new Date(coupon.validUntil).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleCoupon(coupon.code)}
                            className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold transition-all cursor-pointer ${
                              coupon.isActive
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            }`}
                          >
                            {coupon.isActive ? 'Active' : 'Disabled'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleOpenCouponModal(coupon)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate hover:text-paper cursor-pointer"
                            title="Edit Coupon"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCoupon(coupon.code)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                            title="Delete Coupon"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Purchase & Enrollment Tracking */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0d0e] border border-white/10 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h3 className="font-jakarta font-bold text-base text-paper flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                <span>Purchase &amp; Enrollment Tracking</span>
              </h3>
              <p className="text-xs text-slate mt-0.5">
                Monitor Google Pay QR payment sessions, match student UPI references (UTR), verify payments, and approve course enrollments.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-xs text-paper">
                Total: <strong>{totalPurchases}</strong>
              </span>
            </div>
          </div>

          {/* Payment Limitation Security Notice */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-cyan-500/20 flex items-start gap-3 text-xs text-slate">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1 leading-relaxed">
              <span className="font-bold text-cyan-300 block">Verification Protocol:</span>
              <p>
                A Google Pay QR scan alone does not reliably transmit customer identity without banking webhook integration. Students submit their bank-issued 12-digit UPI Reference / UTR Number. Match the student's UTR and payment amount in your Google Pay statement, then click <strong>Verify &amp; Unlock Course</strong> to confirm enrollment and unlock access.
              </p>
            </div>
          </div>

          {/* Search Bar & Status Filter Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono">
              <button
                type="button"
                onClick={() => setPurchaseStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  purchaseStatusFilter === 'all'
                    ? 'bg-primary text-ink font-bold shadow'
                    : 'text-slate hover:text-paper'
                }`}
              >
                All ({totalPurchases})
              </button>
              <button
                type="button"
                onClick={() => setPurchaseStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  purchaseStatusFilter === 'pending'
                    ? 'bg-amber-400 text-ink font-bold shadow'
                    : 'text-slate hover:text-paper'
                }`}
              >
                <span>Pending Verification</span>
                {pendingPurchasesCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10px]">
                    {pendingPurchasesCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setPurchaseStatusFilter('completed')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  purchaseStatusFilter === 'completed'
                    ? 'bg-emerald-400 text-ink font-bold shadow'
                    : 'text-slate hover:text-paper'
                }`}
              >
                Verified / Enrolled ({enrolledPurchasesCount})
              </button>
              <button
                type="button"
                onClick={() => setPurchaseStatusFilter('expired')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  purchaseStatusFilter === 'expired'
                    ? 'bg-rose-400 text-ink font-bold shadow'
                    : 'text-slate hover:text-paper'
                }`}
              >
                Expired ({expiredPurchasesCount})
              </button>
              <button
                type="button"
                onClick={() => setPurchaseStatusFilter('rejected')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  purchaseStatusFilter === 'rejected'
                    ? 'bg-rose-500 text-ink font-bold shadow'
                    : 'text-slate hover:text-paper'
                }`}
              >
                Rejected ({rejectedPurchasesCount})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-slate absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student, course, UTR..."
                value={purchaseSearch}
                onChange={(e) => setPurchaseSearch(e.target.value)}
                className="w-full bg-black/80 border border-white/15 rounded-xl pl-9 pr-3 py-1.5 text-xs text-paper font-mono focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Transactions List */}
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[680px] text-left text-xs text-paper">
              <thead className="bg-white/5 text-slate font-mono uppercase text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3 px-3">Student</th>
                  <th className="py-3 px-3">Course</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">UPI Ref / UTR</th>
                  <th className="py-3 px-3">Payment Status</th>
                  <th className="py-3 px-3">Session Date</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {filteredPurchases.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate font-mono text-xs">
                      No transaction records match the current filter.
                    </td>
                  </tr>
                ) : (
                  filteredPurchases.map(rec => {
                    const isPending = rec.status === 'pending' || rec.status === 'pending_verification';
                    const isCompleted = rec.status === 'completed';
                    const isExpired = rec.status === 'expired';
                    const isRejected = rec.status === 'rejected';

                    return (
                      <tr key={rec.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-paper font-jakarta text-xs">{rec.studentName}</div>
                          <div className="font-mono text-[10px] text-slate truncate max-w-[170px]">{rec.studentEmail}</div>
                          {rec.studentPhone && (
                            <div className="font-mono text-[10px] text-slate/70">{rec.studentPhone}</div>
                          )}
                          <div className="font-mono text-[9px] text-slate/50">ID: {rec.studentId}</div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="font-medium text-paper font-jakarta">{rec.courseName}</div>
                          {rec.couponCodeApplied && (
                            <span className="font-mono text-[9px] text-primary font-bold">
                              Coupon: {rec.couponCodeApplied}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 font-mono">
                          <span className="text-emerald-400 font-bold text-sm">₹{rec.finalAmount.toLocaleString()}</span>
                          {rec.originalPrice !== rec.finalAmount && (
                            <span className="text-slate line-through ml-1.5 text-[10px]">
                              ₹{rec.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 font-mono text-[11px]">
                          {rec.utrNumber ? (
                            <span className="px-2 py-1 rounded-md bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20 inline-block tracking-wider">
                              {rec.utrNumber}
                            </span>
                          ) : isExpired ? (
                            <span className="text-rose-400/80 text-[10px] italic">Timed out (No UTR)</span>
                          ) : (
                            <span className="text-slate/60 text-[10px] italic">Awaiting student UTR</span>
                          )}
                        </td>

                        <td className="py-3 px-3">
                          {rec.status === 'pending_verification' ? (
                            <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 w-fit animate-pulse">
                              <Clock className="w-3 h-3" />
                              <span>Pending Verification</span>
                            </span>
                          ) : rec.status === 'pending' ? (
                            <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 w-fit">
                              <Clock className="w-3 h-3" />
                              <span>Session Active (2m)</span>
                            </span>
                          ) : isCompleted ? (
                            <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Verified &amp; Enrolled</span>
                            </span>
                          ) : isExpired ? (
                            <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-white/10 text-slate border border-white/10 flex items-center gap-1 w-fit">
                              <Clock className="w-3 h-3" />
                              <span>Session Expired</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 w-fit">
                              <XCircle className="w-3 h-3" />
                              <span>Rejected</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-slate font-mono text-[10px]">
                          <div>{new Date(rec.purchasedAt).toLocaleDateString()}</div>
                          <div className="text-slate/60">{new Date(rec.purchasedAt).toLocaleTimeString()}</div>
                        </td>

                        <td className="py-3 px-3 text-right">
                          {isPending ? (
                            <button
                              type="button"
                              onClick={() => {
                                setConfirmVerifyPurchaseTarget(rec);
                                setAdminVerifyNotes('');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-95 text-black font-jakarta font-black text-[11px] uppercase tracking-wider cursor-pointer shadow-md shadow-emerald-500/20 inline-flex items-center gap-1.5 transition-all"
                            >
                              <CheckCheck className="w-3.5 h-3.5" />
                              <span>Verify &amp; Unlock Course</span>
                            </button>
                          ) : isCompleted ? (
                            <div className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[11px] font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Enrolled (Access Unlocked)</span>
                            </div>
                          ) : isExpired ? (
                            <button
                              type="button"
                              onClick={() => {
                                setConfirmVerifyPurchaseTarget(rec);
                                setAdminVerifyNotes('Manual verification after session expiration');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate hover:text-paper font-mono text-[10px] cursor-pointer inline-flex items-center gap-1"
                              title="Manually verify if student paid offline"
                            >
                              <CheckCheck className="w-3 h-3" />
                              <span>Manual Verify</span>
                            </button>
                          ) : (
                            <span className="text-rose-400/80 font-mono text-[10px]">Rejected</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  };

  const renderPaymentSettingsSection = () => {
    // Dynamic preview image URL
    const previewQrSrc =
      qrImageUrlInput && qrImageUrlInput.trim().length > 0
        ? qrImageUrlInput.trim()
        : `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(
            `upi://pay?pa=${qrUpiIdInput.trim() || 'jayadevnair200518@oksbi'}&pn=${encodeURIComponent(
              bankingNameInput.trim() || recipientNameInput.trim() || 'JAYADEV NAIR'
            )}&cu=INR`
          )}`;

    return (
      <section className="space-y-8 animate-fadeIn">
        {/* Workspace Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#0c0d0e] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="space-y-1 relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-[10px] text-primary font-bold uppercase tracking-wider">
                Google Pay / UPI Gateway
              </span>
            </div>
            <h2 className="font-jakarta text-lg font-black text-paper">
              Payment Settings
            </h2>
            <p className="text-xs text-slate max-w-2xl">
              Configure recipient details, bank account name, Google Pay UPI ID, and official Cloudflare QR code image. Changes are updated dynamically on the student checkout page.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 relative z-10">
            <span className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary font-mono text-xs font-bold flex items-center gap-2">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Google Pay (UPI Only)</span>
            </span>
            <span className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border flex items-center gap-1.5 ${
              qrManualEnabledInput
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-white/5 text-slate border-white/10'
            }`}>
              <span className={`w-2 h-2 rounded-full ${qrManualEnabledInput ? 'bg-emerald-400' : 'bg-slate-500'}`} />
              <span>{qrManualEnabledInput ? 'Checkout Active' : 'Checkout Disabled'}</span>
            </span>
          </div>
        </div>

        {/* Main Settings Card: Form & Live Preview */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0d0e] border border-white/10 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h3 className="font-jakarta font-bold text-base text-paper flex items-center gap-2">
                <QrCode className="w-4 h-4 text-primary" />
                Google Pay Credentials &amp; Cloudflare QR Code
              </h3>
              <p className="text-xs text-slate mt-0.5">
                Set recipient credentials and Cloudflare QR image URL. Verified in real-time before saving.
              </p>
            </div>
          </div>

          <form onSubmit={handleSavePaymentSettings} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Form Fields (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Row 1: Recipient Name & Banking Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate uppercase tracking-wider block">
                      Recipient's Full Name
                    </label>
                    <input
                      type="text"
                      value={recipientNameInput}
                      onChange={e => setRecipientNameInput(e.target.value)}
                      placeholder="e.g. Jayadev Nair"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-paper text-sm focus:border-primary focus:outline-none"
                      required
                    />
                    <p className="text-[10px] text-slate">Personal recipient display name.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate uppercase tracking-wider block">
                      Bank Account Display Name
                    </label>
                    <input
                      type="text"
                      value={bankingNameInput}
                      onChange={e => setBankingNameInput(e.target.value)}
                      placeholder="e.g. JAYADEV NAIR"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-paper text-sm focus:border-primary focus:outline-none uppercase"
                      required
                    />
                    <p className="text-[10px] text-slate">Exact name registered with bank / UPI handle.</p>
                  </div>
                </div>

                {/* Row 2: Phone Number & UPI ID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate uppercase tracking-wider block">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={phoneNumberInput}
                      onChange={e => setPhoneNumberInput(e.target.value)}
                      placeholder="e.g. +91 97459 49326"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-paper text-sm font-mono focus:border-primary focus:outline-none"
                      required
                    />
                    <p className="text-[10px] text-slate">Linked phone number for Google Pay.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate uppercase tracking-wider block">
                      Google Pay UPI ID (VPA)
                    </label>
                    <input
                      type="text"
                      value={qrUpiIdInput}
                      onChange={e => setQrUpiIdInput(e.target.value)}
                      placeholder="e.g. jayadevnair200518@oksbi"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-paper text-sm font-mono focus:border-primary focus:outline-none"
                      required
                    />
                    <p className="text-[10px] text-slate">Students send payment to this UPI ID.</p>
                  </div>
                </div>

                {/* Row 3: Publicly Accessible Cloudflare-hosted QR Image URL */}
                <div className="space-y-2 p-4 rounded-2xl bg-black/40 border border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono text-slate uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-primary" />
                      <span>Cloudflare QR Image URL (Publicly Hosted)</span>
                    </label>
                    {qrImageUrlInput && (
                      <button
                        type="button"
                        onClick={() => {
                          setQrImageUrlInput('');
                          setQrUrlVerificationStatus('idle');
                          setQrUrlVerificationMsg(null);
                        }}
                        className="text-[10px] font-mono text-rose-400 hover:underline cursor-pointer"
                      >
                        Clear URL (Use Dynamic QR)
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="url"
                      value={qrImageUrlInput}
                      onChange={e => {
                        setQrImageUrlInput(e.target.value);
                        setQrUrlVerificationStatus('idle');
                        setQrUrlVerificationMsg(null);
                      }}
                      placeholder="https://pub-...r2.dev/official-gpay-qr.png"
                      className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-paper text-xs font-mono focus:border-primary focus:outline-none"
                    />
                    <button
                      type="button"
                      disabled={isVerifyingQrUrl || !qrImageUrlInput.trim()}
                      onClick={() => handleTestQrUrl()}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-paper text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isVerifyingQrUrl ? 'animate-spin' : ''}`} />
                      <span>{isVerifyingQrUrl ? 'Verifying...' : 'Verify URL'}</span>
                    </button>
                  </div>

                  {/* Verification Status Feedback */}
                  {qrUrlVerificationStatus === 'valid' && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span>{qrUrlVerificationMsg || 'Image URL verified successfully!'}</span>
                    </div>
                  )}

                  {qrUrlVerificationStatus === 'invalid' && (
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-xs flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{qrUrlVerificationMsg || 'Image failed to load. Please verify the URL.'}</span>
                    </div>
                  )}

                  <p className="text-[10px] text-slate leading-relaxed">
                    Paste a publicly accessible Cloudflare R2 / CDN image URL. We dynamically test that the image loads before saving without requiring separate cloud storage. If left empty, a crisp dynamic Google Pay QR is generated.
                  </p>
                </div>

                {/* Row 4: Timeout & Instructions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate uppercase tracking-wider block">
                      Session Timer (Minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={qrTimeoutMinutesInput}
                      onChange={e => setQrTimeoutMinutesInput(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-paper text-sm font-mono focus:border-primary focus:outline-none"
                      required
                    />
                    <p className="text-[10px] text-slate">Payment expiry countdown (1 - 60 min).</p>
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-[11px] font-mono text-slate uppercase tracking-wider block">
                      Student Instructions
                    </label>
                    <textarea
                      rows={2}
                      value={qrInstructionsInput}
                      onChange={e => setQrInstructionsInput(e.target.value)}
                      placeholder="Instructions shown on student checkout modal..."
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-paper text-xs focus:border-primary focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Checkbox: Enable Checkout */}
                <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={qrManualEnabledInput}
                    onChange={e => setQrManualEnabledInput(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary bg-black/40 border-white/20 accent-primary cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-paper block">
                      Enable Google Pay UPI &amp; QR Checkout on Website
                    </span>
                    <span className="text-[10px] text-slate">
                      When enabled, students can pay via Google Pay or scan the QR code and submit their 12-digit UTR reference for instant verification.
                    </span>
                  </div>
                </label>

              </div>

              {/* Right Column: Live Student Checkout Preview (5 cols) */}
              <div className="lg:col-span-5 flex flex-col items-center justify-between p-6 rounded-3xl bg-black/80 border border-white/15 shadow-inner space-y-4">
                <div className="w-full text-center pb-2 border-b border-white/10">
                  <span className="font-mono text-[10px] text-primary uppercase font-bold tracking-wider">
                    Student Checkout Preview
                  </span>
                  <h4 className="text-xs font-bold text-paper mt-0.5">
                    Live Google Pay QR Card
                  </h4>
                </div>

                {/* QR Code Container */}
                <div className="p-3.5 rounded-2xl bg-white flex flex-col items-center justify-center shadow-2xl">
                  <img
                    src={previewQrSrc}
                    alt="Official Google Pay QR Code"
                    className="w-44 h-44 object-contain rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(`upi://pay?pa=${qrUpiIdInput || 'jayadevnair200518@oksbi'}&pn=${encodeURIComponent(bankingNameInput || recipientNameInput || 'JAYADEV NAIR')}&cu=INR`)}`;
                    }}
                  />
                  <p className="font-mono text-[10px] text-black/80 font-bold mt-2 tracking-wide text-center">
                    Scan &amp; Pay using Google Pay
                  </p>
                </div>

                {/* Recipient Details Preview Box */}
                <div className="w-full p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-white/10">
                    <span className="text-slate">Banking Name:</span>
                    <span className="font-bold text-paper text-right">{bankingNameInput || 'JAYADEV NAIR'}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-white/10">
                    <span className="text-slate">Recipient Name:</span>
                    <span className="font-bold text-paper text-right">{recipientNameInput || 'Jayadev Nair'}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-white/10">
                    <span className="text-slate">Phone Number:</span>
                    <span className="font-bold text-paper text-right">{phoneNumberInput || '+91 97459 49326'}</span>
                  </div>
                  <div className="flex items-center justify-between pt-0.5">
                    <div className="min-w-0 pr-2">
                      <span className="text-[10px] text-slate block">Google Pay UPI ID:</span>
                      <span className="font-bold text-primary truncate block text-xs">{qrUpiIdInput || 'jayadevnair200518@oksbi'}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-white/10 text-slate text-[10px]">
                      Copyable
                    </span>
                  </div>
                </div>

                <p className="font-mono text-[10px] text-slate/60 text-center">
                  Preview dynamically updates as you type
                </p>
              </div>

            </div>

            {/* Bottom Form Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={handleResetPaymentSettingsToDefaults}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate hover:text-paper font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Defaults</span>
              </button>

              <button
                type="submit"
                disabled={isSavingQrConfig}
                className="w-full sm:w-auto py-3 px-8 rounded-xl bg-primary text-ink font-jakarta font-black text-xs sm:text-sm uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingQrConfig ? 'Saving Settings...' : 'Save Payment Settings'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Section 2: Manual UPI Payment Verifications Queue */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0d0e] border border-white/10 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-jakarta font-extrabold text-lg text-paper flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  Manual UPI Payment Verifications Queue
                </h3>
                {pendingManualPayments.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
                    {pendingManualPayments.length} Pending
                  </span>
                )}
              </div>
              <p className="text-xs text-slate mt-0.5">
                Verify student-submitted 12-digit UPI UTR transaction reference numbers. Approving immediately unlocks full lifetime course access.
              </p>
            </div>
          </div>

          {pendingManualPayments.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto opacity-80" />
              <div className="text-sm font-bold text-paper">No Pending UPI Verifications</div>
              <p className="text-xs text-slate max-w-md mx-auto">
                All manual UPI payments have been verified or no new requests have been submitted. When a student submits their 12-digit UTR, it will appear here for one-click approval.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingManualPayments.map(payment => (
                <div
                  key={payment.id}
                  className="p-5 rounded-2xl bg-black/60 border border-amber-500/30 hover:border-amber-500/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg shadow-amber-500/5"
                >
                  <div className="space-y-1.5 min-w-[220px]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-paper text-sm">{payment.studentName}</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                        Pending
                      </span>
                    </div>
                    <div className="text-xs text-slate font-mono">{payment.studentEmail}</div>
                    {payment.studentPhone && (
                      <div className="text-xs text-slate font-mono">Phone: {payment.studentPhone}</div>
                    )}
                  </div>

                  <div className="space-y-1 min-w-[160px]">
                    <div className="text-[10px] font-mono text-slate uppercase">Enrolling Course</div>
                    <div className="text-xs font-bold text-paper">{payment.courseName}</div>
                    <div className="text-xs font-mono font-bold text-emerald-400">
                      Amount: ₹{payment.finalAmount}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-slate uppercase">12-Digit UPI UTR Reference</div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 tracking-wider select-all">
                        {payment.utrNumber || 'No UTR provided'}
                      </span>
                      {payment.utrNumber && (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(payment.utrNumber || '');
                            showToast('Copied UTR to clipboard!');
                          }}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-paper cursor-pointer"
                          title="Copy UTR Reference"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={verifyingPurchaseId === payment.id}
                      onClick={() => handleVerifyManualPayment(payment.id, true)}
                      className="flex-1 md:flex-initial py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50 transition-all"
                    >
                      <CheckCheck className="w-4 h-4" />
                      Verify & Unlock Course
                    </button>
                    <button
                      type="button"
                      disabled={verifyingPurchaseId === payment.id}
                      onClick={() => handleVerifyManualPayment(payment.id, false)}
                      className="py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-bold text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50 transition-all"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  };

  const getActiveSectionInfo = () => {
    if (adminWorkspace === 'students') {
      return { group: 'Student Hub', title: 'Student Data & Analytics' };
    }
    if (adminWorkspace === 'studentHelp') {
      return { group: 'Student Hub', title: 'Student Help' };
    }
    if (adminWorkspace === 'courseReset') {
      return { group: 'Student Hub', title: 'Course Reset' };
    }
    if (adminWorkspace === 'pricingCoupons') {
      return { group: 'Sales & Payments', title: 'Pricing & Coupons' };
    }
    if (adminWorkspace === 'paymentSettings') {
      return { group: 'Sales & Payments', title: 'Payment Settings' };
    }
    const sys = systemList.find(s => s.id === activeSection);
    if (sys) return { group: 'System Settings', title: sys.label };
    const sec = sectionsList.find(s => s.id === activeSection);
    if (sec) return { group: 'Website Content', title: sec.label };
    return { group: 'Website Content', title: 'Website Content Editor' };
  };

  const renderSidebarContent = (isMobile = false) => {
    return (
      <div className="flex flex-col h-full bg-[#0a0b0c] text-paper">
        {/* Brand / Logo Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={data.navbar?.companyLogo || 'https://res.cloudinary.com/ufo0zltq/image/upload/v1786197046/Do_PNG_ssyhu1.png'}
              alt="DO"
              className="h-7 w-auto object-contain shrink-0"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="min-w-0">
              <h1 className="font-jakarta font-black text-sm text-paper leading-none truncate">
                DO PILOT
              </h1>
              <span className="font-mono text-[10px] text-slate/70 block mt-1 truncate">
                Admin Dashboard
              </span>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate hover:text-paper cursor-pointer"
              title="Close Menu"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Scrollable Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-thin">
          
          {/* GROUP 1: STUDENT HUB */}
          <div className="space-y-1">
            <span className="font-mono text-[10px] text-slate/50 font-bold uppercase tracking-wider px-3 py-1 block">
              Student Hub
            </span>

            {/* 1. Student Data & Analytics */}
            <button
              type="button"
              onClick={() => navigateToWorkspace('students')}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                adminWorkspace === 'students'
                  ? 'bg-primary text-ink font-bold shadow-md shadow-primary/20'
                  : 'text-slate hover:text-paper hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <GraduationCap className="w-4 h-4 shrink-0" />
                <span className="font-jakarta text-xs font-semibold truncate">Student Data &amp; Analytics</span>
              </div>
              <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                adminWorkspace === 'students' ? 'bg-black/20 text-ink' : 'bg-primary/20 text-primary'
              }`}>
                {students.length} Learners
              </span>
            </button>

            {/* 2. Student Help */}
            <button
              type="button"
              onClick={() => navigateToWorkspace('studentHelp')}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                adminWorkspace === 'studentHelp'
                  ? 'bg-primary text-ink font-bold shadow-md shadow-primary/20'
                  : 'text-slate hover:text-paper hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="font-jakarta text-xs font-semibold truncate">Student Help</span>
              </div>
              <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                adminWorkspace === 'studentHelp'
                  ? 'bg-black/20 text-ink'
                  : pendingHelpCount > 0
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-white/10 text-slate'
              }`}>
                {helpMessages.length} Requests{pendingHelpCount > 0 ? ` (${pendingHelpCount} New)` : ''}
              </span>
            </button>

            {/* 3. Course Reset */}
            <button
              type="button"
              onClick={() => navigateToWorkspace('courseReset')}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                adminWorkspace === 'courseReset'
                  ? 'bg-primary text-ink font-bold shadow-md shadow-primary/20'
                  : 'text-slate hover:text-paper hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <RotateCcw className="w-4 h-4 shrink-0" />
                <span className="font-jakarta text-xs font-semibold truncate">Course Reset</span>
              </div>
              <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                adminWorkspace === 'courseReset'
                  ? 'bg-black/20 text-ink'
                  : activeLockedCount > 0
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                  : 'bg-white/10 text-slate'
              }`}>
                {activeLockedCount > 0 ? `${activeLockedCount} Locked` : '0 Locked'}
              </span>
            </button>
          </div>

          {/* GROUP 2: SALES & PAYMENTS */}
          <div className="space-y-1">
            <span className="font-mono text-[10px] text-slate/50 font-bold uppercase tracking-wider px-3 py-1 block">
              Sales &amp; Payments
            </span>

            {/* 1. Pricing & Coupons */}
            <button
              type="button"
              onClick={() => navigateToWorkspace('pricingCoupons')}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                adminWorkspace === 'pricingCoupons'
                  ? 'bg-primary text-ink font-bold shadow-md shadow-primary/20'
                  : 'text-slate hover:text-paper hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Tag className="w-4 h-4 shrink-0" />
                <span className="font-jakarta text-xs font-semibold truncate">Pricing &amp; Coupons</span>
              </div>
              <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                adminWorkspace === 'pricingCoupons' ? 'bg-black/20 text-ink' : 'bg-white/10 text-slate'
              }`}>
                {courseCoupons.filter(c => c.isActive).length} Active Codes
              </span>
            </button>

            {/* 2. Payment Settings */}
            <button
              type="button"
              onClick={() => navigateToWorkspace('paymentSettings')}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                adminWorkspace === 'paymentSettings'
                  ? 'bg-primary text-ink font-bold shadow-md shadow-primary/20'
                  : 'text-slate hover:text-paper hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <CreditCard className="w-4 h-4 shrink-0" />
                <span className="font-jakarta text-xs font-semibold truncate">Payment Settings</span>
              </div>
              {pendingManualPayments.length > 0 && (
                <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                  adminWorkspace === 'paymentSettings'
                    ? 'bg-black/20 text-ink'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {pendingManualPayments.length} Pending
                </span>
              )}
            </button>
          </div>

          {/* GROUP 3: WEBSITE CONTENT */}
          <div className="space-y-1">
            <span className="font-mono text-[10px] text-slate/50 font-bold uppercase tracking-wider px-3 py-1 block">
              Website Content Editor
            </span>

            {sectionsList.map((item) => {
              const Icon = item.icon;
              const isActive = adminWorkspace === 'website' && activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateToSection(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary text-ink font-bold shadow-md shadow-primary/20 scale-[1.01]'
                      : 'text-slate hover:text-paper hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="font-jakarta text-xs font-semibold truncate">{item.label}</span>
                  </div>
                  <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded shrink-0 ${
                    isActive ? 'bg-black/20 text-ink font-bold' : 'text-slate/60 bg-white/5'
                  }`}>
                    {item.tag}
                  </span>
                </button>
              );
            })}
          </div>

          {/* GROUP 4: SYSTEM SETTINGS */}
          <div className="space-y-1">
            <span className="font-mono text-[10px] text-slate/50 font-bold uppercase tracking-wider px-3 py-1 block">
              System Settings
            </span>

            {systemList.filter(item => (item.id as string) !== 'studentHelpNav').map((item) => {
              const Icon = item.icon;
              const isActive = adminWorkspace === 'website' && activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateToSection(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary text-ink font-bold shadow-md shadow-primary/20'
                      : 'text-slate hover:text-paper hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="font-jakarta text-xs font-semibold truncate">{item.label}</span>
                  </div>
                  <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded shrink-0 ${
                    isActive ? 'bg-black/20 text-ink font-bold' : 'text-slate/60 bg-white/5'
                  }`}>
                    {item.tag}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* User Footer in Sidebar */}
        <div className="p-3.5 border-t border-white/10 bg-black/40 shrink-0 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="font-mono text-[10px] text-slate/70 block truncate">
              Logged in as <strong className="text-paper">{getAdminUsername() || 'admin'}</strong>
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="font-mono text-[9px] text-emerald-400 font-bold uppercase">Online</span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => navigate('/')}
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate hover:text-paper hover:border-primary transition-all cursor-pointer"
              title="Preview Live Site"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                logoutAdmin();
                navigate('/');
              }}
              className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#070809] text-paper flex flex-col font-sans selection:bg-primary selection:text-ink relative">
      
      {/* Background Ambient Radial Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-primary/10 via-teal-500/5 to-transparent blur-[140px] pointer-events-none z-0" />

      {/* Subtle Grid Accent */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-ink font-jakarta font-extrabold text-xs py-3 px-5 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Mobile Slide-out Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#0a0b0c] border-r border-white/10 flex flex-col z-50 shadow-2xl overflow-hidden">
            {renderSidebarContent(true)}
          </aside>
        </div>
      )}

      {/* Main Layout Container: Desktop Sidebar + Content Area */}
      <div className="flex-1 flex min-h-screen relative z-10">
        
        {/* Desktop Fixed Left Sidebar */}
        <aside className="hidden lg:flex w-72 shrink-0 flex-col bg-[#0a0b0c] border-r border-white/10 sticky top-0 h-screen overflow-hidden">
          {renderSidebarContent(false)}
        </aside>

        {/* Content Area with Top Header */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top Header Bar */}
          <header className="sticky top-0 z-30 bg-[#08090a]/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
            {/* Left: Mobile Drawer Trigger + Breadcrumb */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate hover:text-paper cursor-pointer shrink-0"
                title="Open Menu"
              >
                <Menu className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1.5 min-w-0 font-jakarta text-xs">
                <span className="text-slate/60 hidden sm:inline">Admin</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate/40 hidden sm:inline shrink-0" />
                <span className="text-slate/80 font-medium truncate">{getActiveSectionInfo().group}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate/40 shrink-0" />
                <span className="text-paper font-black truncate">{getActiveSectionInfo().title}</span>
              </div>
            </div>

            {/* Right Header Actions */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => navigate('/')}
                className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate hover:text-paper hover:border-primary transition-all flex items-center gap-1.5 cursor-pointer text-xs font-semibold"
                title="Preview Live Site"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Preview Site</span>
              </button>

              <button
                onClick={() => {
                  logoutAdmin();
                  navigate('/');
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all flex items-center gap-1.5 cursor-pointer text-xs font-semibold"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </header>

          {/* Main Dynamic Canvas */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1650px] w-full mx-auto space-y-6">
            {adminWorkspace === 'website' ? (
              <>
                {activeSection === 'hero' && renderHeroSection()}
                {activeSection === 'whyUs' && renderWhyUsSection()}
                {activeSection === 'courses' && renderCoursesSection()}
                {activeSection === 'reviews' && renderReviewsSection()}
                {activeSection === 'codeLab' && renderCodeLabSection()}
                {activeSection === 'liveClass' && renderLiveClassSection()}
                {activeSection === 'footer' && renderFooterSection()}
                {activeSection === 'cloudinary' && renderCloudinarySection()}
                {activeSection === 'security' && renderSecuritySection()}
                {activeSection === 'studentExport' && renderStudentExportSection()}
              </>
            ) : adminWorkspace === 'students' ? (
              renderStudentsSection()
            ) : adminWorkspace === 'studentHelp' ? (
              renderStudentHelpSection()
            ) : adminWorkspace === 'courseReset' ? (
              renderCourseResetSection()
            ) : adminWorkspace === 'pricingCoupons' ? (
              renderCoursePricingAndCouponsSection()
            ) : adminWorkspace === 'paymentSettings' ? (
              renderPaymentSettingsSection()
            ) : null}
          </main>

        </div>
      </div>

      {/* Root-Level Full-Screen Student Inspect Modal (Guaranteed Above all Headers & Navbars) */}
      {selectedStudentForReport && renderStudentInspectModal()}

      {/* Root-Level Course Reset Confirmation Modal */}
      {confirmResetTarget && renderCourseResetConfirmModal()}

      {/* Root-Level Payment & Enrollment Verification Modal */}
      {confirmVerifyPurchaseTarget && renderPaymentVerifyModal()}

      {/* Root-Level Course Coupon Creation/Edit Modal */}
      {couponModalOpen && renderCouponModal()}

      {/* Dual Email OTP Modal */}
      {showEmailOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="max-w-md w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0c0d0e] border border-white/15 p-5 sm:p-6 space-y-4 shadow-2xl">
            <h3 className="font-jakarta font-bold text-base text-paper">Security Verification OTP</h3>
            <p className="text-xs text-slate">{emailOtpNotice}</p>
            {emailOtpError && <p className="text-xs text-rose-400 font-bold">{emailOtpError}</p>}
            <input
              type="text"
              value={emailOtpCode}
              onChange={(e) => setEmailOtpCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="w-full bg-black border border-white/15 rounded-xl px-4 py-3 text-paper focus:border-primary focus:outline-none font-mono text-sm tracking-widest text-center"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleConfirmEmailOtpUpdate}
                className="flex-1 py-2.5 rounded-xl bg-primary text-ink font-bold text-xs"
              >
                Confirm Code
              </button>
              <button
                type="button"
                onClick={() => setShowEmailOtpModal(false)}
                className="py-2.5 px-4 rounded-xl bg-white/10 text-paper font-bold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
