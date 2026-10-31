import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout, ShieldCheck, BookOpen, Star, Terminal, Video, ExternalLink,
  Shield, Rocket, Save, Plus, Trash2, CheckCircle2,
  RefreshCw, Download, Upload, Eye, EyeOff, LogOut,
  Mail, Users, FileSpreadsheet, FileText, Search,
  Trophy, Award, AlertCircle, ArrowUpDown, Phone, GraduationCap,
  X, AlertTriangle, Grid, List, Copy, Check, Calendar,
  MessageSquare, MessageCircle, Clock, Gift,
  RotateCcw, Unlock, KeyRound, ShieldAlert,
  Tag, ShoppingBag, CreditCard, Percent, Edit3,
  QrCode, CheckCheck, XCircle, Image as ImageIcon,
  Menu, ChevronRight, Zap, Filter, UserX
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { PART_1_SECTIONS } from '../../data/pythonPart1Data';
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
  approveRewardRequest,
  rejectRewardRequest,
  syncRewardRequestsFromCloud,
  persistRewardRequestsToCloud
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
  syncCouponsFromCloud,
  syncPaymentQRConfigFromCloud,
  syncCoursePurchasesFromCloud,
  syncCoursePricingFromCloud,
  hasCourseAccess,
  normalizeCourseId
} from '../../utils/coursePricingService';
import { getUserInitials } from '../../utils/userInitials';
import { purgeStudentLocalData, purgeAllDummyDemoData, markStudentPermanentlyDeleted } from '../../utils/studentDataPurge';
import {
  buildStudentActivitySequence,
  QuestionTelemetryRecord,
  restoreStudentTelemetryFromCloud,
  setStudentTelemetryInMemory,
  getCourseCurriculumQuestions
} from '../../utils/studentTelemetryService';
import { COURSE_CERT_CONFIGS } from '../../utils/certificateGenerator';
import { memoryCourseState } from '../../utils/courseProgressSyncService';

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
    refreshAuditLogs,
    getAdminUsername,
    getAdminEmails,
    changePasswordMethodA,
    requestMethodBOTP,
    verifyMethodBOTPAndChangePassword,
    setupInitialRecoveryEmail,
    verifyAndSaveInitialRecoveryEmail,
    requestChangeEmailStep1,
    verifyChangeEmailStep1,
    requestChangeEmailStep2,
    confirmNewRecoveryEmail,
    updateCredentialsWithOldPassword,
    updateRecoveryEmails,
    addAuditLog
  } = useAdminAuth();

  const adminEmails = getAdminEmails();

  type AdminWorkspace = 'website' | 'students' | 'rewards' | 'studentHelp' | 'courseReset' | 'pricingCoupons' | 'paymentSettings' | 'permanentDelete';

  const [adminWorkspace, setAdminWorkspace] = useState<AdminWorkspace>(() => {
    try {
      const savedWs = sessionStorage.getItem('dopilot_admin_workspace');
      if (savedWs === 'students' || savedWs === 'rewards' || savedWs === 'website' || savedWs === 'studentHelp' || savedWs === 'courseReset' || savedWs === 'pricingCoupons' || savedWs === 'paymentSettings' || savedWs === 'permanentDelete') return savedWs as AdminWorkspace;
      const savedSec = sessionStorage.getItem('dopilot_admin_active_section');
      if (savedSec === 'students') return 'students';
      if (savedSec === 'rewards') return 'rewards';
      if (savedSec === 'studentHelp') return 'studentHelp';
      if (savedSec === 'courseReset') return 'courseReset';
      if (savedSec === 'pricingCoupons') return 'pricingCoupons';
      if (savedSec === 'paymentSettings') return 'paymentSettings';
      if (savedSec === 'permanentDelete') return 'permanentDelete';
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
  const [couponFormTimerMode, setCouponFormTimerMode] = useState<'none' | '30m' | '1h' | '2h' | '6h' | '24h' | 'custom'>('none');
  const [couponFormTimerMinutes, setCouponFormTimerMinutes] = useState<number>(30);
  const [, setCouponTicker] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCouponTicker(t => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  // Purchase & Enrollment Tracking State (Coupon-based & Verified enrollments)
  const [purchaseSearch, setPurchaseSearch] = useState('');
  const [purchaseCourseFilter, setPurchaseCourseFilter] = useState('all');
  const [purchaseDateFilter, setPurchaseDateFilter] = useState<'all' | 'today' | '7days' | '30days' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [confirmVerifyPurchaseTarget, setConfirmVerifyPurchaseTarget] = useState<CoursePurchaseRecord | null>(null);
  const [adminVerifyNotes, setAdminVerifyNotes] = useState('');

  // Live Cloudflare QR Image Verification State
  const [isVerifyingQrUrl, setIsVerifyingQrUrl] = useState(false);
  const [qrUrlVerificationStatus, setQrUrlVerificationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [qrUrlVerificationMsg, setQrUrlVerificationMsg] = useState<string | null>(null);

  const pendingManualPayments = coursePurchases.filter(p => p.paymentMethod === 'manual_upi_qr' && p.status === 'pending_verification');

  useEffect(() => {
    // Initial fetch from persistent cloud storage
    syncCouponsFromCloud().then((cloudCoupons) => {
      setCourseCoupons(cloudCoupons);
    }).catch(() => {});

    syncPaymentQRConfigFromCloud().then((cloudQr) => {
      setPaymentQRConfig(cloudQr);
      setRecipientNameInput(cloudQr.recipientName || 'Jayadev Nair');
      setBankingNameInput(cloudQr.bankingName || cloudQr.merchantName || 'JAYADEV NAIR');
      setPhoneNumberInput(cloudQr.phoneNumber || '+91 97459 49326');
      setQrUpiIdInput(cloudQr.upiId || 'jayadevnair200518@oksbi');
      setQrImageUrlInput(cloudQr.qrImageUrl || '');
      setQrTimeoutMinutesInput(cloudQr.timeoutMinutes || 10);
      setQrManualEnabledInput(cloudQr.isEnabled !== false);
    }).catch(() => {});

    syncCoursePurchasesFromCloud().then((cloudPurchases) => {
      setCoursePurchases(cloudPurchases);
    }).catch(() => {});

    syncCoursePricingFromCloud().then((cloudPricing) => {
      setCoursePricingList(cloudPricing);
    }).catch(() => {});

    syncRewardRequestsFromCloud().then((cloudRewards) => {
      setRewardRequests(cloudRewards);
    }).catch(() => {});

    // Polling backup every 2.5s when Admin Panel is open to guarantee instant multi-device visibility
    const syncInterval = setInterval(() => {
      syncCouponsFromCloud().then((cloudCoupons) => {
        setCourseCoupons(cloudCoupons);
      }).catch(() => {});
      syncPaymentQRConfigFromCloud().then((cloudQr) => {
        setPaymentQRConfig(cloudQr);
      }).catch(() => {});
      syncCoursePurchasesFromCloud().then((cloudPurchases) => {
        setCoursePurchases(cloudPurchases);
      }).catch(() => {});
      syncCoursePricingFromCloud().then((cloudPricing) => {
        setCoursePricingList(cloudPricing);
      }).catch(() => {});
      syncRewardRequestsFromCloud().then((cloudRewards) => {
        setRewardRequests(cloudRewards);
      }).catch(() => {});
    }, 2500);

    // Subscribe to Supabase Realtime changes across all devices
    let realtimeChannel: any = null;
    if (isSupabaseConfigured()) {
      try {
        realtimeChannel = supabase
          .channel('public:site_content:admin_payments')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'site_content'
            },
            (payload: any) => {
              if (payload?.new?.id === 'course_coupons_v1' && payload?.new?.content?.coupons && Array.isArray(payload.new.content.coupons)) {
                setCourseCoupons(payload.new.content.coupons);
              } else if (payload?.new?.id === 'telemetry_dopilot_payment_qr_config_v1' && payload?.new?.content) {
                const cloudQr = payload.new.content;
                setPaymentQRConfig(cloudQr);
                setRecipientNameInput(cloudQr.recipientName || 'Jayadev Nair');
                setBankingNameInput(cloudQr.bankingName || cloudQr.merchantName || 'JAYADEV NAIR');
                setPhoneNumberInput(cloudQr.phoneNumber || '+91 97459 49326');
                setQrUpiIdInput(cloudQr.upiId || 'jayadevnair200518@oksbi');
                setQrImageUrlInput(cloudQr.qrImageUrl || '');
                setQrTimeoutMinutesInput(cloudQr.timeoutMinutes || 10);
                setQrManualEnabledInput(cloudQr.isEnabled !== false);
              } else if (payload?.new?.id === 'telemetry_dopilot_course_purchases_v1' && payload?.new?.content?.purchases) {
                setCoursePurchases(payload.new.content.purchases);
              } else if (payload?.new?.id === 'telemetry_dopilot_course_pricing_v1' && payload?.new?.content?.pricing) {
                setCoursePricingList(payload.new.content.pricing);
              } else if (payload?.new?.id === 'telemetry_dopilot_reward_requests_v1' && payload?.new?.content?.requests) {
                setRewardRequests(payload.new.content.requests);
              }
            }
          )
          .subscribe();
      } catch (err) {
        console.warn('Could not establish realtime channel for admin payment data:', err);
      }
    }

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
      clearInterval(syncInterval);
      if (realtimeChannel) {
        try { supabase.removeChannel(realtimeChannel); } catch {}
      }
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

  // Security & Authentication State
  const [passwordChangeMethod, setPasswordChangeMethod] = useState<'methodA' | 'methodB'>('methodA');

  // Method A State (Leave blank by default - never expose or prefill credentials)
  const [methodACurrentUser, setMethodACurrentUser] = useState('');
  const [methodACurrentPass, setMethodACurrentPass] = useState('');
  const [methodANewPass, setMethodANewPass] = useState('');
  const [methodAConfirmPass, setMethodAConfirmPass] = useState('');
  const [methodAShowPass, setMethodAShowPass] = useState(false);
  const [methodALoading, setMethodALoading] = useState(false);
  const [methodAStatus, setMethodAStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' });

  // Method B State
  const [methodBDeliveryMode, setMethodBDeliveryMode] = useState<'primary' | 'secondary'>('primary');
  const [methodBOtpSent, setMethodBOtpSent] = useState(false);
  const [methodBOtpPrimary, setMethodBOtpPrimary] = useState('');
  const [methodBOtpSecondary, setMethodBOtpSecondary] = useState('');
  const [methodBNewPass, setMethodBNewPass] = useState('');
  const [methodBConfirmPass, setMethodBConfirmPass] = useState('');
  const [methodBShowPass, setMethodBShowPass] = useState(false);
  const [methodBLoading, setMethodBLoading] = useState(false);
  const [methodBCooldown, setMethodBCooldown] = useState(0);
  const [methodBStatus, setMethodBStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' });

  // Recovery Email Modal State (Supports Initial Fresh Setup and 2-Step Protected Change)
  const [emailModalMode, setEmailModalMode] = useState<'initialSetup' | 'twoStepChange'>('twoStepChange');
  const [emailChangeModalTarget, setEmailChangeModalTarget] = useState<'primary' | 'secondary' | null>(null);
  const [emailChangeStep, setEmailChangeStep] = useState<1 | 2>(1);
  const [emailChangeStep1Otp, setEmailChangeStep1Otp] = useState('');
  const [emailChangeNewAddress, setEmailChangeNewAddress] = useState('');
  const [emailChangeStep2Otp, setEmailChangeStep2Otp] = useState('');
  const [emailChangeLoading, setEmailChangeLoading] = useState(false);
  const [emailChangeCooldown, setEmailChangeCooldown] = useState(0);
  const [emailChangeStatus, setEmailChangeStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' });

  // Audit Logs Filtering State
  const [auditFilterCategory, setAuditFilterCategory] = useState<'all' | 'resets' | 'credentials' | 'access'>('all');
  const [auditFilterStatus, setAuditFilterStatus] = useState<'all' | 'SUCCESS' | 'WARNING' | 'FAILED'>('all');
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [isRefreshingAudit, setIsRefreshingAudit] = useState(false);

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

  interface StudentQuestionAttempt {
    id: string;
    courseId?: string;
    courseName?: string;
    questionNumber: number;
    subQuestionLabel?: string;
    partNum: number;
    section: string;
    levelTitle: string;
    questionTitle: string;
    questionPrompt: string;
    codeSnippet?: string;
    studentOptionId: string;
    studentAnswer: string;
    correctOptionId: string;
    correctAnswer: string;
    isCorrect: boolean;
    timeTakenSeconds: number;
    timeLimitSeconds: number;
    attemptsCount: number;
    attemptNumber?: number;
    isRetest?: boolean;
    attemptedAt: string;
    speedCategory: 'fast' | 'normal' | 'slow' | 'timeout';
    status: 'passed' | 'failed' | 'timeout';
    explanation?: string;
    options?: { id: string; text: string }[];
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
    avgAnswerTimeSeconds?: number;
    fastestAnswerSeconds?: number;
    slowestAnswerSeconds?: number;
    totalStudyTimeMinutes?: number;
    codeExecutionsCount?: number;
    questionAttempts?: StudentQuestionAttempt[];
    lastCompletedQuestion?: {
      partNum: number;
      subQuestionLabel: string;
      sectionTitle: string;
      questionTitle: string;
      completedAt: string;
    };
  }

  const PYTHON_CURRICULUM_QUESTIONS = (() => {
    const list: Array<{
      partNum: number;
      subQuestionLabel: string;
      section: string;
      levelTitle: string;
      questionTitle: string;
      questionPrompt: string;
      codeSnippet?: string;
      correctOptionId: string;
      correctAnswer: string;
      explanation: string;
    }> = [];

    const moduleTitles = [
      'Part 1: Setup & Python Syntax',
      'Part 2: Reading User Input & Variables',
      'Part 3: Data Types & Type Conversion',
      'Part 4: Arithmetic Operations & Precedence'
    ];

    PART_1_SECTIONS.slice(0, 4).forEach((sec, sIdx) => {
      const partNum = sIdx + 1;
      const sectionName = moduleTitles[sIdx] || `Part ${partNum}: ${sec.title}`;

      sec.theoryBlocks.slice(0, 6).forEach((block, bIdx) => {
        const subIndex = bIdx + 1;
        const subQuestionLabel = `${partNum}.${subIndex}`;
        const mcq = block.mcq;
        const correctOpt = mcq?.options?.find(o => o.id === mcq?.correctAnswer);

        list.push({
          partNum,
          subQuestionLabel,
          section: sectionName,
          levelTitle: `Level ${subQuestionLabel}: ${block.heading}`,
          questionTitle: block.heading,
          questionPrompt: mcq?.question || `Assessment evaluation for ${block.heading}`,
          codeSnippet: block.codeSnippet,
          correctOptionId: mcq?.correctAnswer || 'A',
          correctAnswer: correctOpt?.text || 'Correct solution',
          explanation: mcq?.explanationNote || ''
        });
      });
    });

    return list;
  })();

  const ALL_INSPECT_COURSES = [
    { id: 'python-core', name: 'Complete Python Course' },
    { id: 'java-core', name: 'Complete Java Course' },
    { id: 'fullstack-open', name: 'Full Stack Open Course' },
    { id: 'cyber-security', name: 'Cyber Security Course' }
  ];

  const getStudentQuestionTelemetry = (student: StudentAdminRecord, courseScope: string = 'all'): StudentQuestionAttempt[] => {
    // If a specific course is selected, only process that course. Otherwise process all supported courses.
    const targetCourses = courseScope !== 'all'
      ? ALL_INSPECT_COURSES.filter((c) => c.id === courseScope)
      : ALL_INSPECT_COURSES;

    const allAttempts: StudentQuestionAttempt[] = [];

    targetCourses.forEach((course) => {
      const sequence = buildStudentActivitySequence(student, course.id);
      const curriculum = getCourseCurriculumQuestions(course.id);

      if (sequence && sequence.length > 0) {
        const mapped = sequence.map((item, idx) => {
          const curMatch = curriculum.find(
            (c) =>
              c.partNum === item.partNum &&
              (c.questionIndex === item.questionIndex ||
               c.questionTitle.toLowerCase().trim() === (item.questionTitle || '').toLowerCase().trim())
          );

          return {
            id: item.id || `att-${student.id}-${course.id}-${idx + 1}`,
            courseId: course.id,
            courseName: course.name,
            questionNumber: item.questionIndex || (idx + 1),
            subQuestionLabel: item.subQuestionLabel || `Part ${item.partNum} → Sec ${item.sectionId} → Q${item.questionIndex}`,
            partNum: item.partNum,
            section: item.sectionTitle || curMatch?.sectionTitle || `Part ${item.partNum}`,
            levelTitle: item.subQuestionLabel ? `Level ${item.subQuestionLabel}` : `Question ${idx + 1}`,
            questionTitle: item.questionTitle || curMatch?.questionTitle || `Question ${item.questionIndex || idx + 1}`,
            questionPrompt: item.questionPrompt || curMatch?.questionPrompt || '',
            codeSnippet: item.codeSnippet || curMatch?.codeSnippet,
            studentOptionId: item.studentOptionId,
            studentAnswer: item.studentAnswer,
            correctOptionId: item.correctOptionId || curMatch?.correctOptionId || 'A',
            correctAnswer: item.correctAnswer || curMatch?.correctAnswer || '',
            isCorrect: item.isCorrect,
            timeTakenSeconds: item.timeTakenSeconds,
            timeLimitSeconds: item.timeLimitSeconds || 30,
            attemptsCount: item.attemptNumber || (item.isRetest ? 2 : 1),
            attemptNumber: item.attemptNumber || 1,
            isRetest: Boolean(item.isRetest || (item.attemptNumber && item.attemptNumber > 1)),
            attemptedAt: item.attemptedAt ? new Date(item.attemptedAt).toLocaleString() : new Date().toLocaleString(),
            speedCategory: item.speedCategory,
            status: item.status,
            explanation: item.explanation || curMatch?.explanation,
            options: curMatch?.options || []
          };
        });
        allAttempts.push(...mapped);
      }
    });

    if (allAttempts.length > 0) {
      return allAttempts;
    }

    if (student.questionAttempts && student.questionAttempts.length > 0) {
      return student.questionAttempts.map((att) => ({
        ...att,
        courseId: att.courseId || 'python-core',
        courseName: att.courseName || 'Complete Python Course'
      }));
    }

    return [];
  };

  const computeTelemetryMetrics = (attempts: StudentQuestionAttempt[]) => {
    if (attempts.length === 0) {
      return {
        total: 0,
        passed: 0,
        failed: 0,
        timeouts: 0,
        avgTime: 0,
        fastestTime: 0,
        slowestTime: 0,
        fastCount: 0,
        normalCount: 0,
        slowCount: 0,
        accuracyPct: 0
      };
    }

    const total = attempts.length;
    const passed = attempts.filter(a => a.isCorrect).length;
    const failed = attempts.filter(a => !a.isCorrect && a.status !== 'timeout').length;
    const timeouts = attempts.filter(a => a.status === 'timeout').length;

    // Only compute times for attempts where actual duration was recorded (> 0)
    const timedAttempts = attempts.filter(a => a.timeTakenSeconds > 0);
    const times = timedAttempts.map(a => a.timeTakenSeconds);
    const sumTime = times.reduce((acc, t) => acc + t, 0);
    const avgTime = timedAttempts.length > 0 ? Number((sumTime / timedAttempts.length).toFixed(1)) : 0;
    const fastestTime = times.length > 0 ? Math.min(...times) : 0;
    const slowestTime = times.length > 0 ? Math.max(...times) : 0;
    const fastCount = attempts.filter(a => a.speedCategory === 'fast' && a.timeTakenSeconds > 0).length;
    const normalCount = attempts.filter(a => a.speedCategory === 'normal' && a.timeTakenSeconds > 0).length;
    const slowCount = attempts.filter(a => (a.speedCategory === 'slow' || a.speedCategory === 'timeout') && a.timeTakenSeconds > 0).length;
    const accuracyPct = Math.round((passed / total) * 100);

    return {
      total,
      passed,
      failed,
      timeouts,
      avgTime,
      fastestTime,
      slowestTime,
      fastCount,
      normalCount,
      slowCount,
      accuracyPct
    };
  };

  const [students, setStudents] = useState<StudentAdminRecord[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilter, setStudentFilter] = useState<'all' | 'started' | 'completed' | 'top_points' | 'low_marks' | 'coupon_purchases' | 'registered_only' | 'rewards'>('all');
  const [rewardRequests, setRewardRequests] = useState<RewardRequest[]>(() => getRewardRequests());
  const [rewardStatusFilter, setRewardStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [rewardSearch, setRewardSearch] = useState('');
  const pendingRewardCount = rewardRequests.filter((r) => r.status === 'pending').length;
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  type StudentDateFilterPreset = 'all' | 'today' | '7days' | '30days' | '90days' | '1year' | 'custom';
  const [studentDatePreset, setStudentDatePreset] = useState<StudentDateFilterPreset>('all');
  const [studentStartDate, setStudentStartDate] = useState<string>('');
  const [studentEndDate, setStudentEndDate] = useState<string>('');
  const [studentSort, setStudentSort] = useState<'points_desc' | 'points_asc' | 'date_desc' | 'name_asc'>('points_desc');
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<StudentAdminRecord | null>(null);
  const [inspectTab, setInspectTab] = useState<'telemetry' | 'mistakes' | 'mastery' | 'profile'>('telemetry');
  const [inspectCourseFilter, setInspectCourseFilter] = useState<string>('all');
  const [telemetryFilter, setTelemetryFilter] = useState<'all' | 'correct' | 'wrong' | 'fast' | 'normal' | 'slow'>('all');
  const [telemetryActivityType, setTelemetryActivityType] = useState<'all' | 'purchased' | 'trial'>('all');
  const [mistakeFilter, setMistakeFilter] = useState<'all' | 'wrong' | 'fast' | 'normal' | 'slow'>('all');
  const [mistakeActivityType, setMistakeActivityType] = useState<'all' | 'purchased' | 'trial'>('all');
  const [telemetrySearch, setTelemetrySearch] = useState('');
  const [mistakeSearch, setMistakeSearch] = useState('');
  const [inspectTelemetryVersion, setInspectTelemetryVersion] = useState<number>(0);

  // Automatically hydrate student telemetry from cloud when inspect modal opens
  useEffect(() => {
    if (!selectedStudentForReport?.email) return;
    const email = selectedStudentForReport.email;
    restoreStudentTelemetryFromCloud(email).then((records) => {
      if (records && records.length > 0) {
        setInspectTelemetryVersion((v) => v + 1);
      }
    }).catch(() => {});
  }, [selectedStudentForReport]);

  // Permanent Delete State
  const [deleteModalTarget, setDeleteModalTarget] = useState<StudentAdminRecord | null>(null);
  const [isDeletingStudent, setIsDeletingStudent] = useState<boolean>(false);
  const [deleteFeedback, setDeleteFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [permanentDeleteSearch, setPermanentDeleteSearch] = useState<string>('');
  const [permanentDeleteCourseFilter, setPermanentDeleteCourseFilter] = useState<string>('all');

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

        // Fetch authoritative telemetry for all students from Supabase site_content
        const { data: telemetryDocs } = await supabase
          .from('site_content')
          .select('id, content')
          .ilike('id', 'telemetry_%');

        const telemetryMap: Record<string, QuestionTelemetryRecord[]> = {};
        if (Array.isArray(telemetryDocs)) {
          telemetryDocs.forEach((doc) => {
            if (Array.isArray(doc.content)) {
              const safeKey = doc.id.replace(/^telemetry_/, '').toLowerCase().trim();
              telemetryMap[safeKey] = doc.content;
            }
          });
        }

        if (profiles && profiles.length > 0) {
          cloudStudents = profiles.map((p: any) => {
            const cleanEmail = (p.email || '').toLowerCase().trim();
            const emailSafe = cleanEmail.replace(/[^a-z0-9_]/g, '_');
            const attemptsFromCloud = telemetryMap[emailSafe] || telemetryMap[cleanEmail] || [];

            // Hydrate in-memory telemetry cache so every tab and PDF export has instant access
            if (attemptsFromCloud.length > 0) {
              setStudentTelemetryInMemory(cleanEmail, attemptsFromCloud);
            }

            const prog = progressMap[cleanEmail] || {};
            const points = Number(prog.points) || 0;
            const solvedTasks = prog.solved_tasks || {};
            const solvedCount = Object.keys(solvedTasks).length;

            const wrongFromAttempts = attemptsFromCloud
              .filter((a) => !a.isCorrect)
              .map((a) => ({
                taskTitle: a.questionTitle,
                section: a.sectionTitle || `Part ${a.partNum}`,
                failedAt: a.attemptedAt ? new Date(a.attemptedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Logged',
                detail: `Option ${a.studentOptionId || '?'}: ${a.studentAnswer || 'Incorrect Answer'}`
              }));

            const wrongAttempts = attemptsFromCloud.length > 0
              ? wrongFromAttempts
              : (Array.isArray(prog.wrong_attempts) ? prog.wrong_attempts : []);

            const testsFailedCount = attemptsFromCloud.length > 0
              ? attemptsFromCloud.filter((a) => !a.isCorrect).length
              : wrongAttempts.length;

            const testsPassedCount = attemptsFromCloud.length > 0
              ? attemptsFromCloud.filter((a) => a.isCorrect).length
              : solvedCount;

            const testsAttemptedCount = attemptsFromCloud.length > 0
              ? attemptsFromCloud.length
              : (testsPassedCount + testsFailedCount);

            // Calculate average answer time from actual telemetry
            const timedAttempts = attemptsFromCloud.filter((a) => a.timeTakenSeconds > 0);
            const sumTimes = timedAttempts.reduce((acc, a) => acc + a.timeTakenSeconds, 0);
            const avgAnswerTimeSeconds = timedAttempts.length > 0
              ? Number((sumTimes / timedAttempts.length).toFixed(1))
              : undefined;

            const hasCertificate = Boolean(prog.certificate_issued || points >= 20);
            const certificateId = prog.certificate_id || (hasCertificate ? `CERT-DO-PY-${p.id.slice(-4).toUpperCase()}` : undefined);

            let status: 'completed' | 'in_progress' | 'enrolled_not_started' | 'registered_only';
            if (points >= 20) {
              status = 'completed';
            } else if (points > 0 || solvedCount > 0 || testsAttemptedCount > 0) {
              status = 'in_progress';
            } else if (p.has_completed_details) {
              status = 'enrolled_not_started';
            } else {
              status = 'registered_only';
            }

            // Calculate dynamic section progress based on student's actual course curriculum
            const primaryCourse = p.course || (p.enrolled_courses && p.enrolled_courses[0]) || 'python-core';
            const studentCurriculum = getCourseCurriculumQuestions(primaryCourse);
            const partCurriculumMap = new Map<number, { partNum: number; totalTasks: number }>();
            studentCurriculum.forEach((q) => {
              const current = partCurriculumMap.get(q.partNum) || { partNum: q.partNum, totalTasks: 0 };
              current.totalTasks += 1;
              partCurriculumMap.set(q.partNum, current);
            });

            const sectionProgress: StudentSectionProgress[] = [];
            const solvedKeys = Object.keys(solvedTasks);

            // Group parts up to 14 or according to curriculum
            const maxPart = Math.max(1, ...Array.from(partCurriculumMap.keys()));
            for (let partNum = 1; partNum <= maxPart; partNum++) {
              const partTotal = partCurriculumMap.get(partNum)?.totalTasks || 6;
              const solvedInPart = solvedKeys.filter((k) => {
                const kLower = k.toLowerCase();
                return kLower.includes(`part${partNum}`) ||
                       kLower.includes(`part-${partNum}`) ||
                       kLower.includes(`${partNum}-`) ||
                       kLower.startsWith(`${partNum}.`);
              }).length;

              const wrongInPart = wrongAttempts.filter((w: any) => {
                const sLower = (w.section || '').toLowerCase();
                return sLower.includes(`part ${partNum}`) ||
                       sLower.includes(`part${partNum}`) ||
                       sLower.includes(`part-${partNum}`) ||
                       sLower.includes(`${partNum}.`);
              }).length;

              let partStatus: 'passed' | 'failed' | 'in_progress' | 'not_started' = 'not_started';
              if (solvedInPart >= partTotal && partTotal > 0) {
                partStatus = 'passed';
              } else if (solvedInPart > 0) {
                partStatus = wrongInPart > 0 ? 'failed' : 'in_progress';
              } else if (wrongInPart > 0) {
                partStatus = 'failed';
              }

              sectionProgress.push({
                partNum,
                title: `Part ${partNum}`,
                totalTasks: partTotal,
                solvedTasks: Math.min(partTotal, solvedInPart),
                status: partStatus
              });
            }

            // Determine exact last completed question & learning position
            let lastCompletedQuestion: {
              partNum: number;
              subQuestionLabel: string;
              sectionTitle: string;
              questionTitle: string;
              completedAt: string;
            } | undefined = undefined;

            const correctAttempts = attemptsFromCloud.filter((a) => a.isCorrect);
            if (correctAttempts.length > 0) {
              const sortedCorrect = [...correctAttempts].sort(
                (a, b) => new Date(a.attemptedAt).getTime() - new Date(b.attemptedAt).getTime()
              );
              const lastOne = sortedCorrect[sortedCorrect.length - 1];
              lastCompletedQuestion = {
                partNum: lastOne.partNum || 1,
                subQuestionLabel: lastOne.subQuestionLabel || `Part ${lastOne.partNum || 1} -> Q${lastOne.questionIndex}`,
                sectionTitle: lastOne.sectionTitle || `Part ${lastOne.partNum || 1}`,
                questionTitle: lastOne.questionTitle || 'Question Completed',
                completedAt: lastOne.attemptedAt || new Date().toISOString()
              };
            } else if (solvedCount > 0) {
              const solvedEntries = Object.values(solvedTasks) as any[];
              const sortedSolved = solvedEntries.sort(
                (a, b) => new Date(a.solvedAt || 0).getTime() - new Date(b.solvedAt || 0).getTime()
              );
              const lastSolved = sortedSolved[sortedSolved.length - 1];
              if (lastSolved) {
                lastCompletedQuestion = {
                  partNum: 1,
                  subQuestionLabel: lastSolved.id || 'Challenge Completed',
                  sectionTitle: 'Course Curriculum',
                  questionTitle: lastSolved.title || 'Challenge Solved',
                  completedAt: lastSolved.solvedAt || new Date().toISOString()
                };
              }
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
              enrolledCourses: (Array.isArray(p.enrolled_courses) ? p.enrolled_courses : []).map((c: string) => c.replace(/Programming/gi, 'Course')),
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
              courseProgressStatus: status,
              avgAnswerTimeSeconds,
              questionAttempts: attemptsFromCloud.length > 0 ? attemptsFromCloud.map((item, idx) => ({
                id: item.id || `att-${p.id}-${idx + 1}`,
                questionNumber: item.questionIndex || (idx + 1),
                subQuestionLabel: item.subQuestionLabel || `Part ${item.partNum} -> Q${item.questionIndex}`,
                partNum: item.partNum,
                section: item.sectionTitle || `Part ${item.partNum}`,
                levelTitle: item.subQuestionLabel ? `Level ${item.subQuestionLabel}` : `Question ${idx + 1}`,
                questionTitle: item.questionTitle || `Question ${item.questionIndex || idx + 1}`,
                questionPrompt: item.questionPrompt || '',
                codeSnippet: item.codeSnippet,
                studentOptionId: item.studentOptionId,
                studentAnswer: item.studentAnswer,
                correctOptionId: item.correctOptionId || 'A',
                correctAnswer: item.correctAnswer || '',
                isCorrect: item.isCorrect,
                timeTakenSeconds: item.timeTakenSeconds,
                timeLimitSeconds: item.timeLimitSeconds || 30,
                attemptsCount: item.attemptNumber || (item.isRetest ? 2 : 1),
                attemptNumber: item.attemptNumber || 1,
                isRetest: Boolean(item.isRetest || (item.attemptNumber && item.attemptNumber > 1)),
                attemptedAt: item.attemptedAt ? new Date(item.attemptedAt).toLocaleString() : new Date().toLocaleString(),
                speedCategory: item.speedCategory,
                status: item.status,
                explanation: item.explanation,
                options: []
              })) : undefined,
              lastCompletedQuestion
            };
          });
        }
      }

      // Check active local user session and enrich/prepend
      try {
        const localUserRaw = localStorage.getItem('dopilot_student_session_v1');
        if (localUserRaw) {
          const lu = JSON.parse(localUserRaw);
          const luEmail = (lu?.email || '').toLowerCase().trim();
          const luId = (lu?.id || '').toLowerCase().trim();
          if (lu && lu.email) {
            let localPoints = 0;
            let localSolvedCount = 0;
            try {
              const localPtsRaw =
                localStorage.getItem(`dopilot_user_${lu.email.replace(/[^a-zA-Z0-9]/g, '_')}_points`) ||
                localStorage.getItem('dopilot_course_points_v3');
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

            const existingIdx = cloudStudents.findIndex(
              (c) => (c.email || '').toLowerCase().trim() === luEmail || (luId && c.id === luId)
            );

            if (existingIdx !== -1) {
              const existing = cloudStudents[existingIdx];
              cloudStudents[existingIdx] = {
                ...existing,
                name: existing.name && existing.name !== 'Student' ? existing.name : (lu.name || existing.name),
                phone: lu.phone || existing.phone,
                collegeOrCompany: lu.collegeOrCompany || existing.collegeOrCompany,
                whereDidYouFindUs: lu.whereDidYouFindUs || existing.whereDidYouFindUs,
                learningGoal: lu.learningGoal || existing.learningGoal,
                hasCompletedDetails: Boolean(existing.hasCompletedDetails || lu.hasCompletedDetails),
                enrolledCourses: (lu.enrolledCourses && lu.enrolledCourses.length > 0)
                  ? lu.enrolledCourses.map((c: string) => c.replace(/Programming/gi, 'Course'))
                  : existing.enrolledCourses,
                points: Math.max(existing.points, localPoints)
              };
            } else if (!isSupabaseConfigured()) {
              // ONLY unshift local session when Supabase is NOT active (offline mode).
              // In production/connected mode, Supabase student_profiles IS the source of truth!
              cloudStudents.unshift({
                id: lu.id || `std-${Date.now().toString().slice(-4)}`,
                name: lu.name || 'Active Student',
                email: lu.email,
                avatar: lu.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(lu.name || 'Student')}&background=00ff9d&color=000000&bold=true`,
                phone: lu.phone,
                whereDidYouFindUs: lu.whereDidYouFindUs,
                collegeOrCompany: lu.collegeOrCompany,
                learningGoal: lu.learningGoal,
                hasCompletedDetails: Boolean(lu.hasCompletedDetails),
                enrolledCourses: (lu.enrolledCourses && lu.enrolledCourses.length > 0 ? lu.enrolledCourses : []).map((c: string) => c.replace(/Programming/gi, 'Course')),
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
                  { partNum: 1, title: 'Part 1: Setup & Python Syntax', totalTasks: 6, solvedTasks: Math.min(6, localPoints), status: localPoints >= 6 ? 'passed' : localPoints > 0 ? 'in_progress' : 'not_started' },
                  { partNum: 2, title: 'Part 2: Reading User Input & Variables', totalTasks: 6, solvedTasks: Math.max(0, Math.min(6, localPoints - 6)), status: localPoints >= 12 ? 'passed' : localPoints > 6 ? 'in_progress' : 'not_started' },
                  { partNum: 3, title: 'Part 3: Data Types & Type Conversion', totalTasks: 6, solvedTasks: Math.max(0, Math.min(6, localPoints - 12)), status: localPoints >= 18 ? 'passed' : localPoints > 12 ? 'in_progress' : 'not_started' },
                  { partNum: 4, title: 'Part 4: Arithmetic Operations & Precedence', totalTasks: 6, solvedTasks: Math.max(0, Math.min(6, localPoints - 18)), status: localPoints >= 24 ? 'passed' : localPoints > 18 ? 'in_progress' : 'not_started' }
                ],
                courseProgressStatus: localStatus
              });
            }
          }
        }
      } catch (e) {}

      // Check pending local registration ONLY if Supabase is NOT active
      if (!isSupabaseConfigured()) {
        try {
          const pendingUserRaw = localStorage.getItem('dopilot_pending_registration_v1');
          if (pendingUserRaw) {
            const pu = JSON.parse(pendingUserRaw);
            const puEmail = (pu?.email || '').toLowerCase().trim();
            if (pu && pu.email && !cloudStudents.some((c) => (c.email || '').toLowerCase().trim() === puEmail)) {
              cloudStudents.unshift({
                id: pu.id || 'pending-std',
                name: pu.name || 'Pending Registration',
                email: pu.email,
                avatar: pu.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(pu.name || 'Student')}&background=00ff9d&color=000000&bold=true`,
                phone: pu.phone || undefined,
                whereDidYouFindUs: pu.whereDidYouFindUs,
                collegeOrCompany: pu.collegeOrCompany,
                learningGoal: pu.learningGoal,
                hasCompletedDetails: false,
                enrolledCourses: (pu.enrolledCourses && pu.enrolledCourses.length > 0 ? pu.enrolledCourses : []).map((c: string) => c.replace(/Programming/gi, 'Course')),
                joinedLiveClass: false,
                createdAt: pu.createdAt || new Date().toISOString(),
                points: 0,
                solvedTasksCount: 0,
                testsAttemptedCount: 0,
                testsPassedCount: 0,
                testsFailedCount: 0,
                hasCertificate: false,
                wrongAttempts: [],
                sectionProgress: [],
                courseProgressStatus: 'registered_only'
              });
            }
          }
        } catch (e) {}
      }

      setStudents(cloudStudents);
    } catch (err) {
      console.warn("Failed to fetch students:", err);
      setStudents([]);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const handleConfirmPermanentDelete = async () => {
    if (!deleteModalTarget) return;
    setIsDeletingStudent(true);
    setDeleteFeedback(null);
    const targetEmail = (deleteModalTarget.email || '').toLowerCase().trim();
    const targetId = (deleteModalTarget.id || '').trim();
    const targetName = deleteModalTarget.name || 'Student';

    // Safety guard against deleting admin accounts
    if (
      targetEmail.includes('admin') ||
      targetEmail === 'security@dopilot.online' ||
      targetEmail === 'support@dopilot.online'
    ) {
      setIsDeletingStudent(false);
      setDeleteFeedback({
        type: 'error',
        message: 'Security Violation: Cannot delete an administrator account.'
      });
      return;
    }

    try {
      // 1. Immediately update state so student vanishes from UI without latency

      // 2. Immediately update state so student vanishes from UI without latency
      setStudents((prev) =>
        prev.filter(
          (s) =>
            s.id !== targetId &&
            (!targetEmail || (s.email || '').toLowerCase().trim() !== targetEmail)
        )
      );

      // Reset selected student for inspection if currently selected
      setSelectedStudentForReport((prev) => {
        if (!prev) return null;
        if (prev.id === targetId || (targetEmail && (prev.email || '').toLowerCase().trim() === targetEmail)) {
          return null;
        }
        return prev;
      });
      // 1. Call secure server-side deletion endpoint
      try {
        const response = await fetch('/api/admin-delete-student', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: targetId,
            email: targetEmail
          })
        });
        if (response.ok) {
          const resData = await response.json();
          console.log('Server deletion response:', resData);
        }
      } catch (apiErr) {
        console.warn('Server endpoint notice, proceeding with Supabase cascade:', apiErr);
      }

      // 2. Cascade delete on Supabase directly (guarantees deletion across all environments)
      if (isSupabaseConfigured()) {
        try {
          // A. student_progress has NO 'id' column, delete by user_email
          if (targetEmail) {
            try {
              const { error: progErr } = await supabase.from('student_progress').delete().ilike('user_email', targetEmail);
              if (progErr) console.warn('Supabase student_progress delete notice:', progErr);
            } catch (progErr) {
              console.warn('Supabase student_progress delete exception:', progErr);
            }

            try {
              const emailSafe = targetEmail.replace(/[^a-z0-9_]/g, '_');
              await supabase.from('site_content').delete().eq('id', `student_course_state_${emailSafe}`);
              await supabase.from('site_content').delete().eq('id', `telemetry_${emailSafe}`);
              if (targetEmail !== emailSafe) {
                await supabase.from('site_content').delete().eq('id', `student_course_state_${targetEmail}`);
                await supabase.from('site_content').delete().eq('id', `telemetry_${targetEmail}`);
              }
              if (targetId) {
                const targetIdSafe = targetId.replace(/[^a-z0-9_]/g, '_');
                await supabase.from('site_content').delete().eq('id', `student_course_state_${targetId}`);
                await supabase.from('site_content').delete().eq('id', `telemetry_${targetId}`);
                await supabase.from('site_content').delete().eq('id', `telemetry_${targetIdSafe}`);
              }
              const { data: matchedRows } = await supabase.from('site_content').select('id').ilike('id', `%${targetEmail}%`);
              if (Array.isArray(matchedRows) && matchedRows.length > 0) {
                for (const row of matchedRows) {
                  await supabase.from('site_content').delete().eq('id', row.id);
                }
              }

              // Purge student records from global telemetry_dopilot_course_purchases_v1
              try {
                const { data: purchaseDoc } = await supabase
                  .from('site_content')
                  .select('content')
                  .eq('id', 'telemetry_dopilot_course_purchases_v1')
                  .maybeSingle();

                if (purchaseDoc && purchaseDoc.content && Array.isArray(purchaseDoc.content.purchases)) {
                  const filteredPurchases = purchaseDoc.content.purchases.filter((p: any) => {
                    const pe = (p?.studentEmail || '').toLowerCase().trim();
                    const pi = (p?.studentId || '').toLowerCase().trim();
                    const sEmail = targetEmail.toLowerCase();
                    const sId = (targetId || '').toLowerCase();
                    const matchesEmail = sEmail && (pe === sEmail || pi === sEmail);
                    const matchesId = sId && (pi === sId || pe === sId);
                    return !(matchesEmail || matchesId);
                  });

                  if (filteredPurchases.length !== purchaseDoc.content.purchases.length) {
                    await supabase
                      .from('site_content')
                      .upsert({
                        id: 'telemetry_dopilot_course_purchases_v1',
                        content: {
                          purchases: filteredPurchases,
                          updatedAt: new Date().toISOString()
                        },
                        updated_at: new Date().toISOString()
                      });
                  }
                }
              } catch (purErr) {
                console.warn('Error purging from telemetry_dopilot_course_purchases_v1 in AdminPanel:', purErr);
              }
            } catch (courseStateErr) {
              console.warn('Supabase course state delete notice:', courseStateErr);
            }
          }

          // B. student_leads (has email and id)
          try {
            if (targetEmail) {
              await supabase.from('student_leads').delete().ilike('email', targetEmail);
            }
            if (targetId) {
              await supabase.from('student_leads').delete().eq('id', targetId);
            }
          } catch (leadErr) {
            console.warn('Supabase student_leads delete notice:', leadErr);
          }

          // C. course_purchases, reward_requests, locked_courses, course_resets
          try {
            if (targetEmail) {
              await supabase.from('course_purchases').delete().ilike('student_email', targetEmail);
              await supabase.from('course_purchases').delete().ilike('student_id', targetEmail);
            }
            if (targetId) {
              await supabase.from('course_purchases').delete().eq('student_id', targetId);
              await supabase.from('course_purchases').delete().eq('student_email', targetId);
            }
          } catch (e) {}

          try {
            if (targetEmail) {
              await supabase.from('reward_requests').delete().ilike('student_email', targetEmail);
              await supabase.from('reward_requests').delete().ilike('student_id', targetEmail);
            }
            if (targetId) {
              await supabase.from('reward_requests').delete().eq('student_id', targetId);
              await supabase.from('reward_requests').delete().eq('student_email', targetId);
            }
          } catch (e) {}

          try {
            if (targetEmail) {
              await supabase.from('locked_courses').delete().ilike('student_email', targetEmail);
              await supabase.from('locked_courses').delete().ilike('student_id', targetEmail);
            }
            if (targetId) {
              await supabase.from('locked_courses').delete().eq('student_id', targetId);
              await supabase.from('locked_courses').delete().eq('student_email', targetId);
            }
          } catch (e) {}

          try {
            if (targetEmail) {
              await supabase.from('course_resets').delete().ilike('student_email', targetEmail);
              await supabase.from('course_resets').delete().ilike('student_id', targetEmail);
            }
            if (targetId) {
              await supabase.from('course_resets').delete().eq('student_id', targetId);
              await supabase.from('course_resets').delete().eq('student_email', targetId);
            }
          } catch (e) {}

          // D. CRITICAL: Delete from student_profiles (by email AND id explicitly)
          try {
            if (targetEmail) {
              const { error: profEmailErr } = await supabase.from('student_profiles').delete().ilike('email', targetEmail);
              if (profEmailErr) console.error('Supabase student_profiles deletion error (email):', profEmailErr);
            }
            if (targetId) {
              const { error: profIdErr } = await supabase.from('student_profiles').delete().eq('id', targetId);
              if (profIdErr) console.error('Supabase student_profiles deletion error (id):', profIdErr);
            }
          } catch (profEx) {
            console.error('Supabase student_profiles deletion exception:', profEx);
          }
        } catch (supaErr) {
          console.warn('Supabase cascade delete overall notice:', supaErr);
        }
      }

      // 3. Purge from local storage records and in-memory state
      try {
        markStudentPermanentlyDeleted(targetEmail, targetId);
        purgeStudentLocalData(targetEmail, targetId);

        // Update in-memory state for admin tabs
        const sTarget = targetEmail.toLowerCase();
        const sId = targetId.toLowerCase();

        setRewardRequests((prev) => {
          const remaining = prev.filter((r) => {
            const re = (r.studentEmail || '').toLowerCase().trim();
            const ri = (r.studentId || '').toLowerCase().trim();
            return (!sTarget || re !== sTarget) && (!sId || ri !== sId);
          });
          persistRewardRequestsToCloud(remaining).catch(() => {});
          return remaining;
        });

        setHelpMessages((prev) =>
          prev.filter((h) => {
            const he = (h.studentEmail || '').toLowerCase().trim();
            const hi = (h.studentId || '').toLowerCase().trim();
            return (!sTarget || he !== sTarget) && (!sId || hi !== sId);
          })
        );

        setLockedRecords((prev) =>
          prev.filter((l) => {
            const le = (l.studentEmail || '').toLowerCase().trim();
            const li = (l.studentId || '').toLowerCase().trim();
            return (!sTarget || le !== sTarget) && (!sId || li !== sId);
          })
        );

        setCoursePurchases((prev) =>
          prev.filter((p) => {
            const pe = (p.studentEmail || '').toLowerCase().trim();
            const pi = (p.studentId || '').toLowerCase().trim();
            return (!sTarget || pe !== sTarget) && (!sId || pi !== sId);
          })
        );
      } catch (cleanErr) {
        console.warn('Local student data purge warning:', cleanErr);
      }

      // 4. Refresh student roster
      await fetchStudents();

      // 5. Close modal & display success feedback
      setDeleteModalTarget(null);
      setDeleteFeedback({
        type: 'success',
        message: `Student "${targetName}" (${targetEmail}) and all associated records have been permanently deleted.`
      });
      showToast(`Student "${targetName}" permanently deleted.`);

      try {
        addAuditLog('PERMANENT_DELETE_STUDENT', `Permanently deleted student account ${targetName} (${targetEmail}).`);
      } catch (e) {}

      setTimeout(() => {
        setDeleteFeedback((prev) => (prev?.type === 'success' ? null : prev));
      }, 6000);
    } catch (err: any) {
      console.error('Failed to permanently delete student:', err);
      setDeleteFeedback({
        type: 'error',
        message: err?.message || 'Failed to delete student. Please try again.'
      });
    } finally {
      setIsDeletingStudent(false);
    }
  };

  useEffect(() => {
    purgeAllDummyDemoData();
    fetchStudents();

    const handleStudentRosterUpdate = () => {
      fetchStudents();
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (
        !e.key ||
        e.key.includes('student') ||
        e.key.includes('session') ||
        e.key.includes('dopilot_user')
      ) {
        fetchStudents();
      }
    };

    window.addEventListener('dopilot_student_roster_updated', handleStudentRosterUpdate);
    window.addEventListener('dopilot_student_registered', handleStudentRosterUpdate);
    window.addEventListener('dopilot_user_logged_in', handleStudentRosterUpdate);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('dopilot_student_roster_updated', handleStudentRosterUpdate);
      window.removeEventListener('dopilot_student_registered', handleStudentRosterUpdate);
      window.removeEventListener('dopilot_user_logged_in', handleStudentRosterUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
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

  const handleApproveReward = async (requestId: string, studentName: string, milestoneAmount: number) => {
    const res = await approveRewardRequest(requestId);
    if (res.success) {
      setRewardRequests(getRewardRequests());
      showToast(`Approved ₹${milestoneAmount} milestone reward for ${studentName}! Deducted milestone points.`);
    } else {
      showToast('Failed to approve request. Please try again.');
    }
  };

  const handleRejectReward = async (requestId: string, studentName: string, milestoneAmount: number) => {
    const res = await rejectRewardRequest(requestId);
    if (res.success) {
      setRewardRequests(getRewardRequests());
      showToast(`Rejected ₹${milestoneAmount} reward claim for ${studentName}. Deducted milestone points.`);
    } else {
      showToast('Failed to reject request. Please try again.');
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

  // Synchronize browser/phone back button when Inspect Student Report modal is open
  useEffect(() => {
    if (selectedStudentForReport) {
      // Push state dummy entry to history so back button closes modal rather than leaving admin dashboard
      window.history.pushState({ adminInspectModal: true }, '');

      const handlePopState = () => {
        setSelectedStudentForReport(null);
      };

      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [selectedStudentForReport]);

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
      description: (formData.get('description') as string) || 'Practical, project-based courses and live classes taught by industry engineers. Learn Python, Full Stack development, and real-world skills to launch your tech career.',
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
      description: (formData.get('whyUsDesc') as string) || 'Most online tutorials leave you stranded when you face real code errors. Here is how DO PILOT transforms your learning into real capability.',
      comparisonsTitle: (formData.get('compTitle') as string) || 'How DO PILOT Compares',
      comparisonsSubtitle: (formData.get('compSubtitle') as string) || 'See the direct difference between regular courses and our engineering mentorship.',
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
      description: (formData.get('coursesDesc') as string) || 'Choose a specialized curriculum built around tangible project outcomes. Taught by senior developers with live code reviews.',
      courses,
      items: courses,
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
      items: [...current, newCourse],
    });
    showToast('New course added.');
  };

  const handleDeleteCourse = (idx: number) => {
    const current = (data.coursesSection?.courses || []).filter((_, i) => i !== idx);
    updateSection('coursesSection', {
      ...data.coursesSection,
      courses: current,
      items: current,
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
      description: (formData.get('reviewsDesc') as string) || 'Real feedback from learners who gained practical skills and built their careers with DO PILOT.',
      reviews,
      items: reviews,
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
      items: [...current, newRev],
    });
    showToast('New review card added.');
  };

  const handleDeleteReview = (idx: number) => {
    const current = (data.reviewsSection?.reviews || []).filter((_, i) => i !== idx);
    updateSection('reviewsSection', {
      ...data.reviewsSection,
      reviews: current,
      items: current,
    });
    showToast('Review card removed.');
  };

  const handleSaveCodeLab = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateSection('codeLab', {
      badgeText: (formData.get('codeLabBadge') as string) || 'CODE LAB',
      title: (formData.get('codeLabTitle') as string) || 'Run Python Programs Instantly',
      description: (formData.get('codeLabDesc') as string) || 'Write, test, and execute Python 3.12 code directly in your browser.',
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
      description: (formData.get('liveClassDesc') as string) || 'Join our interactive live masterclass. Code alongside experienced engineers and ask your questions live.',
      spotlightBadge: (formData.get('spotlightBadge') as string) || 'Live Workshop • Limited Seats',
      className: (formData.get('className') as string) || 'Python & AI Assistant: Live Masterclass',
      classDescription: (formData.get('classDescription') as string) || 'Build a functional AI assistant with Python and live API integration in a 2-hour interactive code-along.',
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
      mentorAvatar: (formData.get('mentorAvatar') as string) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
      buttonText: (formData.get('buttonText') as string) || 'Join Live Masterclass',
    });
    addAuditLog('UPDATE_LIVE_CLASS', 'Live Class updated.');
    showToast('Live Class saved successfully!');
  };

  const handleSaveFooter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const whatsappUrl = (formData.get('social_whatsapp_url') as string)?.trim();
    const githubUrl = (formData.get('social_github_url') as string)?.trim();
    const linkedinUrl = (formData.get('social_linkedin_url') as string)?.trim();
    const youtubeUrl = (formData.get('social_youtube_url') as string)?.trim();
    const instagramUrl = (formData.get('social_instagram_url') as string)?.trim();
    const facebookUrl = (formData.get('social_facebook_url') as string)?.trim();

    const whatsappEnabled = formData.get('social_whatsapp_enabled') === 'on';
    const githubEnabled = formData.get('social_github_enabled') === 'on';
    const linkedinEnabled = formData.get('social_linkedin_enabled') === 'on';
    const youtubeEnabled = formData.get('social_youtube_enabled') === 'on';
    const instagramEnabled = formData.get('social_instagram_enabled') === 'on';
    const facebookEnabled = formData.get('social_facebook_enabled') === 'on';

    updateSection('footer', {
      ...data.footer,
      companyName: (formData.get('companyName') as string) || 'DO PILOT',
      companyLogo: (formData.get('companyLogo') as string) || 'https://res.cloudinary.com/ufo0zltq/image/upload/v1786197046/Do_PNG_ssyhu1.png',
      description: (formData.get('footerDesc') as string) || 'DO PILOT is an educational platform dedicated to project-first coding. We teach practical Python, Java programming, and real-world software engineering with live mentorship.',
      email: (formData.get('footerEmail') as string) || 'support@dopilot.com',
      phone: (formData.get('footerPhone') as string) || '+91 97787 07336',
      address: (formData.get('footerAddress') as string) || 'Online & Global Campus',
      copyrightText: (formData.get('copyrightText') as string) || '© 2026 DO PILOT. All rights reserved.',
      exploreTitle: (formData.get('exploreTitle') as string) || 'Explore',
      coursesTitle: (formData.get('coursesTitle') as string) || 'Popular Courses',
      legalTitle: (formData.get('legalTitle') as string) || 'Legal & Policies',
      contactTitle: (formData.get('contactTitle') as string) || 'Contact & Support',
      socialLinks: {
        whatsapp: { url: whatsappUrl || 'https://wa.me/919778707336', enabled: whatsappEnabled },
        github: { url: githubUrl || 'https://github.com', enabled: githubEnabled },
        linkedin: { url: linkedinUrl || 'https://linkedin.com', enabled: linkedinEnabled },
        youtube: { url: youtubeUrl || '', enabled: youtubeEnabled },
        instagram: { url: instagramUrl || '', enabled: instagramEnabled },
        facebook: { url: facebookUrl || '', enabled: facebookEnabled },
      },
    });
    addAuditLog('UPDATE_FOOTER', 'Footer details updated.');
    showToast('Footer saved successfully!');
  };

  // Method B Resend Cooldown Countdown Timer
  useEffect(() => {
    if (methodBCooldown <= 0) return;
    const interval = setInterval(() => {
      setMethodBCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [methodBCooldown]);

  // Email Change Resend Cooldown Countdown Timer
  useEffect(() => {
    if (emailChangeCooldown <= 0) return;
    const interval = setInterval(() => {
      setEmailChangeCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [emailChangeCooldown]);

  // Method A Handler: Change Password via Current Password
  const handleMethodASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMethodAStatus({ type: 'idle', message: '' });

    if (methodANewPass !== methodAConfirmPass) {
      setMethodAStatus({ type: 'error', message: 'New password and confirm password do not match.' });
      return;
    }
    if (methodANewPass.length < 6) {
      setMethodAStatus({ type: 'error', message: 'New password must be at least 6 characters long.' });
      return;
    }

    setMethodALoading(true);
    try {
      const res = await changePasswordMethodA(methodACurrentUser, methodACurrentPass, methodANewPass);
      if (res.success) {
        setMethodAStatus({ type: 'success', message: res.message });
        setMethodACurrentUser('');
        setMethodACurrentPass('');
        setMethodANewPass('');
        setMethodAConfirmPass('');
        showToast(res.message);
      } else {
        setMethodAStatus({ type: 'error', message: res.message });
        showToast(res.message, false);
      }
    } catch (err: any) {
      setMethodAStatus({ type: 'error', message: err?.message || 'Error updating password.' });
    } finally {
      setMethodALoading(false);
    }
  };

  // Method B Handlers: Change Password via Email Recovery
  const handleMethodBSendOTP = async () => {
    if (methodBCooldown > 0) return;
    setMethodBLoading(true);
    setMethodBStatus({ type: 'idle', message: '' });

    try {
      const res = await requestMethodBOTP(methodBDeliveryMode);
      if (res.success) {
        setMethodBOtpSent(true);
        setMethodBCooldown(60);
        setMethodBStatus({ type: 'success', message: res.message });
        showToast(res.message);
      } else {
        if (res.cooldownRemaining) setMethodBCooldown(res.cooldownRemaining);
        setMethodBStatus({ type: 'error', message: res.message });
        showToast(res.message, false);
      }
    } catch (err: any) {
      setMethodBStatus({ type: 'error', message: err?.message || 'Error dispatching recovery OTP.' });
    } finally {
      setMethodBLoading(false);
    }
  };

  const handleMethodBSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMethodBStatus({ type: 'idle', message: '' });

    if (methodBNewPass !== methodBConfirmPass) {
      setMethodBStatus({ type: 'error', message: 'New password and confirm password do not match.' });
      return;
    }
    if (methodBNewPass.length < 6) {
      setMethodBStatus({ type: 'error', message: 'New password must be at least 6 characters long.' });
      return;
    }

    setMethodBLoading(true);
    try {
      const res = await verifyMethodBOTPAndChangePassword(
        methodBDeliveryMode,
        methodBOtpPrimary,
        methodBOtpSecondary,
        methodBNewPass
      );
      if (res.success) {
        setMethodBStatus({ type: 'success', message: res.message });
        setMethodBOtpSent(false);
        setMethodBOtpPrimary('');
        setMethodBOtpSecondary('');
        setMethodBNewPass('');
        setMethodBConfirmPass('');
        showToast(res.message);
      } else {
        setMethodBStatus({ type: 'error', message: res.message });
        showToast(res.message, false);
      }
    } catch (err: any) {
      setMethodBStatus({ type: 'error', message: err?.message || 'Error verifying recovery OTP.' });
    } finally {
      setMethodBLoading(false);
    }
  };

  // Recovery Email Initial Fresh Setup Handlers
  const handleOpenEmailSetupModal = (target: 'primary' | 'secondary') => {
    setEmailModalMode('initialSetup');
    setEmailChangeModalTarget(target);
    setEmailChangeStep(1);
    setEmailChangeStep1Otp('');
    setEmailChangeNewAddress('');
    setEmailChangeStep2Otp('');
    setEmailChangeStatus({ type: 'idle', message: '' });
  };

  const handleInitialSetupSendOtp = async () => {
    if (!emailChangeModalTarget || !emailChangeNewAddress.trim() || emailChangeCooldown > 0) return;
    setEmailChangeLoading(true);
    setEmailChangeStatus({ type: 'idle', message: '' });

    try {
      const res = await setupInitialRecoveryEmail(emailChangeModalTarget, emailChangeNewAddress);
      if (res.success) {
        setEmailChangeCooldown(60);
        setEmailChangeStatus({ type: 'success', message: res.message });
        showToast(res.message);
      } else {
        if (res.cooldownRemaining) setEmailChangeCooldown(res.cooldownRemaining);
        setEmailChangeStatus({ type: 'error', message: res.message });
      }
    } catch (err: any) {
      setEmailChangeStatus({ type: 'error', message: err?.message || 'Failed to dispatch verification OTP.' });
    } finally {
      setEmailChangeLoading(false);
    }
  };

  const handleInitialSetupVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailChangeModalTarget || !emailChangeNewAddress.trim() || !emailChangeStep2Otp.trim()) return;
    setEmailChangeLoading(true);
    setEmailChangeStatus({ type: 'idle', message: '' });

    try {
      const res = await verifyAndSaveInitialRecoveryEmail(
        emailChangeModalTarget,
        emailChangeNewAddress,
        emailChangeStep2Otp
      );
      if (res.success) {
        showToast(res.message);
        setEmailChangeModalTarget(null);
      } else {
        setEmailChangeStatus({ type: 'error', message: res.message });
      }
    } catch (err: any) {
      setEmailChangeStatus({ type: 'error', message: err?.message || 'Verification failed.' });
    } finally {
      setEmailChangeLoading(false);
    }
  };

  // Recovery Email 2-Step Verification Handlers
  const handleOpenEmailChangeModal = (target: 'primary' | 'secondary') => {
    setEmailModalMode('twoStepChange');
    setEmailChangeModalTarget(target);
    setEmailChangeStep(1);
    setEmailChangeStep1Otp('');
    setEmailChangeNewAddress('');
    setEmailChangeStep2Otp('');
    setEmailChangeStatus({ type: 'idle', message: '' });
  };

  const handleEmailChangeStep1SendOtp = async () => {
    if (!emailChangeModalTarget || emailChangeCooldown > 0) return;
    setEmailChangeLoading(true);
    setEmailChangeStatus({ type: 'idle', message: '' });

    try {
      const res = await requestChangeEmailStep1(emailChangeModalTarget);
      if (res.success) {
        setEmailChangeCooldown(60);
        setEmailChangeStatus({ type: 'success', message: res.message });
        showToast(res.message);
      } else {
        setEmailChangeStatus({ type: 'error', message: res.message });
      }
    } catch (err: any) {
      setEmailChangeStatus({ type: 'error', message: err?.message || 'Failed to send authorization OTP.' });
    } finally {
      setEmailChangeLoading(false);
    }
  };

  const handleEmailChangeStep1Verify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailChangeModalTarget) return;
    setEmailChangeStatus({ type: 'idle', message: '' });
    setEmailChangeLoading(true);

    try {
      const res = await verifyChangeEmailStep1(emailChangeModalTarget, emailChangeStep1Otp);
      if (res.success) {
        setEmailChangeStep(2);
        setEmailChangeStatus({ type: 'success', message: res.message });
        showToast(res.message);
      } else {
        setEmailChangeStatus({ type: 'error', message: res.message });
      }
    } catch (err: any) {
      setEmailChangeStatus({ type: 'error', message: err?.message || 'Verification failed.' });
    } finally {
      setEmailChangeLoading(false);
    }
  };

  const handleEmailChangeStep2SendOtp = async () => {
    if (!emailChangeModalTarget || !emailChangeNewAddress || emailChangeCooldown > 0) return;
    setEmailChangeLoading(true);
    setEmailChangeStatus({ type: 'idle', message: '' });

    try {
      const res = await requestChangeEmailStep2(emailChangeModalTarget, emailChangeNewAddress);
      if (res.success) {
        setEmailChangeCooldown(60);
        setEmailChangeStatus({ type: 'success', message: res.message });
        showToast(res.message);
      } else {
        setEmailChangeStatus({ type: 'error', message: res.message });
      }
    } catch (err: any) {
      setEmailChangeStatus({ type: 'error', message: err?.message || 'Failed to send verification code.' });
    } finally {
      setEmailChangeLoading(false);
    }
  };

  const handleEmailChangeStep2Confirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailChangeModalTarget || !emailChangeNewAddress || !emailChangeStep2Otp) return;
    setEmailChangeLoading(true);
    setEmailChangeStatus({ type: 'idle', message: '' });

    try {
      const res = await confirmNewRecoveryEmail(emailChangeModalTarget, emailChangeNewAddress, emailChangeStep2Otp);
      if (res.success) {
        showToast(res.message);
        setEmailChangeModalTarget(null);
      } else {
        setEmailChangeStatus({ type: 'error', message: res.message });
      }
    } catch (err: any) {
      setEmailChangeStatus({ type: 'error', message: err?.message || 'Failed to update recovery email.' });
    } finally {
      setEmailChangeLoading(false);
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
    { id: 'codeLab' as SectionId, label: 'Python Code Lab', icon: Terminal, tag: 'IDE' },
    { id: 'liveClass' as SectionId, label: 'Live Masterclass', icon: Video, tag: 'Schedule & Host' },
    { id: 'footer' as SectionId, label: 'Footer & Links', icon: ExternalLink, tag: 'Brand & Social' },
  ];

  const systemList = [
    { id: 'security' as SectionId, label: 'Security & Backup', icon: Shield, tag: 'Credentials' },
    { id: 'studentExport' as SectionId, label: 'Extract Student Data', icon: FileSpreadsheet, tag: `${students.length} Contacts` },
    { id: 'studentHelpNav' as any, label: 'Student Help Desk', icon: MessageSquare, tag: `${pendingHelpCount} Tickets` },
  ];

  // Render Subcomponents
  const renderHeroSection = () => (
    <section id="section-hero" className="rounded-2xl bg-[#0c0d0e] border border-white/10 p-5 sm:p-6 space-y-5 shadow-2xl relative">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-jakarta text-base sm:text-lg font-black text-paper">Hero Section</h2>
            <span className="font-mono text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold border border-primary/20">01</span>
          </div>
          <p className="text-xs text-slate mt-0.5">Top headline, 3 value pillars, and CTA action buttons.</p>
        </div>
      </div>

      <form onSubmit={handleSaveHero} className="space-y-4 text-xs">
        {/* Headline Group */}
        <div className="p-4 sm:p-5 rounded-xl bg-black/40 border border-white/10 space-y-3">
          <span className="font-mono text-[11px] text-primary font-bold uppercase tracking-wider block">// Headline &amp; Subtitle</span>
          <div>
            <label className="block text-xs font-bold text-slate mb-1">Eyebrow Badge (Optional)</label>
            <input
              type="text"
              name="eyebrow"
              defaultValue={data.hero.eyebrow || ''}
              placeholder="e.g. // MASTER SOFTWARE ENGINEERING"
              className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Headline Prefix</label>
              <input
                type="text"
                name="headlinePrefix"
                defaultValue={data.hero.headlinePrefix ?? "Master Real Tech Skills with"}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs focus:border-primary focus:outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Glowing Highlight Word</label>
              <input
                type="text"
                name="highlightWord"
                defaultValue={data.hero.highlightWord ?? "DO PILOT"}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-primary text-xs focus:border-primary focus:outline-none font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate mb-1">Subtitle / Description</label>
            <textarea
              name="description"
              rows={2}
              defaultValue={data.hero.description || 'Practical, project-based courses and live classes taught by industry engineers. Learn Python, Full Stack development, and real-world skills to launch your tech career.'}
              className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs focus:border-primary focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* 3 Pillars Group */}
        <div className="p-4 sm:p-5 rounded-xl bg-black/40 border border-white/10 space-y-3">
          <span className="font-mono text-[11px] text-primary font-bold uppercase tracking-wider block">// 3 Value Pillars</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate mb-1">Pillar 1</label>
              <input
                type="text"
                name="pillar1"
                defaultValue={data.hero.pillars[0] || '100% Practical Projects'}
                className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-paper text-xs focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate mb-1">Pillar 2</label>
              <input
                type="text"
                name="pillar2"
                defaultValue={data.hero.pillars[1] || 'Live Interactive Classes'}
                className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-paper text-xs focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate mb-1">Pillar 3</label>
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
        <div className="p-4 sm:p-5 rounded-xl bg-black/40 border border-white/10 space-y-3">
          <span className="font-mono text-[11px] text-primary font-bold uppercase tracking-wider block">// CTA Buttons &amp; Navigation</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Primary CTA Button</label>
              <input
                type="text"
                name="primaryCtaText"
                defaultValue={data.hero.primaryCtaText}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Primary CTA Destination Link</label>
              <input
                type="text"
                name="primaryCtaLink"
                defaultValue={data.hero.primaryCtaLink}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Secondary CTA Button</label>
              <input
                type="text"
                name="secondaryCtaText"
                defaultValue={data.hero.secondaryCtaText}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Secondary CTA Destination Link</label>
              <input
                type="text"
                name="secondaryCtaLink"
                defaultValue={data.hero.secondaryCtaLink}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-1">
            <label className="block text-xs font-bold text-slate mb-1">Scroll Cue Text</label>
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
            className="px-5 py-2 rounded-xl bg-primary text-ink font-jakarta font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:brightness-110 shadow-md shadow-primary/20 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Hero Changes</span>
          </button>
        </div>
      </form>
    </section>
  );

  const renderWhyUsSection = () => (
    <section id="section-whyUs" className="rounded-2xl bg-[#0c0d0e] border border-white/10 p-5 sm:p-6 space-y-5 shadow-2xl relative">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-jakarta text-base sm:text-lg font-black text-paper">Why Choose Us</h2>
            <span className="font-mono text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold border border-primary/20">02</span>
          </div>
          <p className="text-xs text-slate mt-0.5">Key advantages and side-by-side comparison matrix with legacy courses.</p>
        </div>
      </div>

      <form onSubmit={handleSaveWhyUs} className="space-y-4 text-xs">
        <div className="p-4 sm:p-5 rounded-xl bg-black/40 border border-white/10 space-y-3">
          <span className="font-mono text-[11px] text-primary font-bold uppercase tracking-wider block">// Section Header</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Badge Text</label>
              <input
                type="text"
                name="whyUsBadge"
                defaultValue={data.whyUs?.badgeText || 'WHY CHOOSE US'}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Title</label>
              <input
                type="text"
                name="whyUsTitle"
                defaultValue={data.whyUs?.title || 'Why DO PILOT?'}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs font-bold focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate mb-1">Description</label>
            <textarea
              name="whyUsDesc"
              rows={2}
              defaultValue={data.whyUs?.description || 'Most online tutorials leave you stranded when you face real code errors. Here is how DO PILOT transforms your learning into real capability.'}
              className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs focus:border-primary focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="p-4 sm:p-5 rounded-xl bg-black/40 border border-white/10 space-y-3">
          <span className="font-mono text-[11px] text-primary font-bold uppercase tracking-wider block">// 4 Feature Pillars</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {(data.whyUs?.features || []).map((feat, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-black/60 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-primary font-bold">Feature #{idx + 1}</span>
                  <input
                    type="text"
                    name={`featHighlight_${idx}`}
                    defaultValue={feat.highlight}
                    placeholder="Badge Text"
                    className="bg-black border border-white/15 rounded-lg px-2.5 py-1 text-[10px] text-paper font-mono focus:border-primary focus:outline-none"
                  />
                </div>
                <input
                  type="text"
                  name={`featTitle_${idx}`}
                  defaultValue={feat.title}
                  placeholder="Card Title"
                  className="w-full bg-black border border-white/15 rounded-xl px-3 py-1.5 text-xs text-paper font-bold focus:border-primary focus:outline-none"
                />
                <textarea
                  name={`featDesc_${idx}`}
                  rows={2}
                  defaultValue={feat.description}
                  placeholder="Card Description"
                  className="w-full bg-black border border-white/15 rounded-xl px-3 py-1.5 text-xs text-slate focus:border-primary focus:outline-none resize-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="p-4 sm:p-5 rounded-xl bg-black/40 border border-white/10 space-y-3">
          <span className="font-mono text-[11px] text-primary font-bold uppercase tracking-wider block">// Comparison Showcase Matrix</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Matrix Title</label>
              <input
                type="text"
                name="compTitle"
                defaultValue={data.whyUs?.comparisonsTitle || 'How DO PILOT Compares'}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs font-bold focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Matrix Subtitle</label>
              <input
                type="text"
                name="compSubtitle"
                defaultValue={data.whyUs?.comparisonsSubtitle || 'See the direct difference between regular courses and our engineering mentorship.'}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-slate mb-1">Col 1 Header</label>
              <input
                type="text"
                name="tableHeaderFeature"
                defaultValue={data.whyUs?.tableHeaderFeature || 'Feature'}
                className="w-full bg-black border border-white/15 rounded-xl px-3 py-1.5 text-xs text-paper font-mono focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate mb-1">Col 2 Header (Competitors)</label>
              <input
                type="text"
                name="tableHeaderTraditional"
                defaultValue={data.whyUs?.tableHeaderTraditional || 'Regular Online Courses'}
                className="w-full bg-black border border-white/15 rounded-xl px-3 py-1.5 text-xs text-rose-300 font-mono focus:border-rose-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate mb-1">Col 3 Header (DO PILOT)</label>
              <input
                type="text"
                name="tableHeaderDoPilot"
                defaultValue={data.whyUs?.tableHeaderDoPilot || 'DO PILOT Platform'}
                className="w-full bg-black border border-white/15 rounded-xl px-3 py-1.5 text-xs text-primary font-mono font-bold focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <span className="font-mono text-[11px] text-slate font-bold uppercase tracking-wider block pt-2">// Comparison Rows</span>
          <div className="space-y-2">
            {(data.whyUs?.comparisons || []).map((comp, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-black/60 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  name={`compFeature_${idx}`}
                  defaultValue={comp.feature}
                  placeholder="Feature name"
                  className="bg-black border border-white/15 rounded-lg px-3 py-1.5 text-xs text-paper font-bold focus:border-primary focus:outline-none"
                />
                <input
                  type="text"
                  name={`compTrad_${idx}`}
                  defaultValue={comp.traditional}
                  placeholder="Traditional"
                  className="bg-black border border-rose-500/20 rounded-lg px-3 py-1.5 text-xs text-slate focus:border-rose-400 focus:outline-none"
                />
                <input
                  type="text"
                  name={`compDo_${idx}`}
                  defaultValue={comp.doPilot}
                  placeholder="DO PILOT"
                  className="bg-black border border-emerald-500/30 rounded-lg px-3 py-1.5 text-xs text-paper font-semibold focus:border-primary focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-primary text-ink font-jakarta font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:brightness-110 shadow-md shadow-primary/20 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Why Us Changes</span>
          </button>
        </div>
      </form>
    </section>
  );

  const renderCoursesSection = () => (
    <section id="section-courses" className="rounded-2xl bg-[#0c0d0e] border border-white/10 p-5 sm:p-6 space-y-5 shadow-2xl relative">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-jakarta text-base sm:text-lg font-black text-paper">Popular Courses</h2>
            <span className="font-mono text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold border border-primary/20">03</span>
          </div>
          <p className="text-xs text-slate mt-0.5">Manage curriculum course cards, duration, difficulty, tags, and syllabus previews.</p>
        </div>
        <button
          type="button"
          onClick={handleAddCourse}
          className="py-1.5 px-3 rounded-xl bg-primary/20 hover:bg-primary text-primary hover:text-ink font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Course</span>
        </button>
      </div>

      <form onSubmit={handleSaveCoursesSection} className="space-y-4 text-xs">
        <div className="p-4 sm:p-5 rounded-xl bg-black/40 border border-white/10 space-y-3">
          <span className="font-mono text-[11px] text-primary font-bold uppercase tracking-wider block">// Section Header</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Badge</label>
              <input
                type="text"
                name="coursesBadge"
                defaultValue={data.coursesSection?.badgeText || 'SKILL PATHS'}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Title</label>
              <input
                type="text"
                name="coursesTitle"
                defaultValue={data.coursesSection?.title || 'Our Courses'}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs font-bold focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate mb-1">Description / Subtitle</label>
            <textarea
              name="coursesDesc"
              rows={2}
              defaultValue={data.coursesSection?.description || 'Choose a specialized curriculum built around tangible project outcomes. Taught by senior developers with live code reviews.'}
              className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs focus:border-primary focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Course Cards List */}
        <div className="space-y-3">
          {(data.coursesSection?.courses || []).map((c, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <span className="font-mono text-[11px] text-primary font-bold">Course #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteCourse(idx)}
                  className="p-1.5 rounded-lg text-slate hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Remove Course"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate mb-1">Title</label>
                  <input
                    type="text"
                    name={`courseTitle_${idx}`}
                    defaultValue={c.title?.replace(/Programming/gi, 'Course')}
                    className="w-full bg-black border border-white/15 rounded-xl px-3 py-1.5 text-xs text-paper font-bold focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate mb-1">Badge (e.g. Bestseller)</label>
                  <input
                    type="text"
                    name={`courseBadge_${idx}`}
                    defaultValue={c.badge}
                    className="w-full bg-black border border-white/15 rounded-xl px-3 py-1.5 text-xs text-paper focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate mb-1">Duration</label>
                    <input
                      type="text"
                      name={`courseDuration_${idx}`}
                      defaultValue={c.duration}
                      className="w-full bg-black border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-paper focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate mb-1">Level</label>
                    <input
                      type="text"
                      name={`courseLevel_${idx}`}
                      defaultValue={c.level}
                      className="w-full bg-black border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-paper focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate mb-1">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    name={`courseTags_${idx}`}
                    defaultValue={(c.tags || []).join(', ')}
                    className="w-full bg-black border border-white/15 rounded-xl px-3 py-1.5 text-xs text-paper font-mono focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate mb-1">Thumbnail Image URL</label>
                  <input
                    type="text"
                    name={`courseImage_${idx}`}
                    defaultValue={c.image}
                    className="w-full bg-black border border-white/15 rounded-xl px-3 py-1.5 text-xs text-paper font-mono focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate mb-1">Description</label>
                <textarea
                  name={`courseDesc_${idx}`}
                  rows={2}
                  defaultValue={c.description}
                  className="w-full bg-black border border-white/15 rounded-xl px-3 py-1.5 text-xs text-slate focus:border-primary focus:outline-none resize-none"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-primary text-ink font-jakarta font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:brightness-110 shadow-md shadow-primary/20 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Courses Changes</span>
          </button>
        </div>
      </form>
    </section>
  );

  const renderReviewsSection = () => (
    <section id="section-reviews" className="rounded-2xl bg-[#0c0d0e] border border-white/10 p-5 sm:p-6 space-y-5 shadow-2xl relative">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-jakarta text-base sm:text-lg font-black text-paper">Student Reviews</h2>
            <span className="font-mono text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold border border-primary/20">04</span>
          </div>
          <p className="text-xs text-slate mt-0.5">Student feedback and testimonials.</p>
        </div>
        <button
          type="button"
          onClick={handleAddReview}
          className="py-1.5 px-3 rounded-xl bg-primary/20 hover:bg-primary text-primary hover:text-ink font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Review</span>
        </button>
      </div>

      <form onSubmit={handleSaveReviewsSection} className="space-y-4 text-xs">
        <div className="p-4 sm:p-5 rounded-xl bg-black/40 border border-white/10 space-y-3">
          <span className="font-mono text-[11px] text-primary font-bold uppercase tracking-wider block">// Section Header</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Badge</label>
              <input
                type="text"
                name="reviewsBadge"
                defaultValue={data.reviewsSection?.badgeText || 'STUDENT STORIES'}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Title</label>
              <input
                type="text"
                name="reviewsTitle"
                defaultValue={data.reviewsSection?.title || 'Student Reviews'}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs font-bold focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate mb-1">Description / Subtitle</label>
            <textarea
              name="reviewsDesc"
              rows={2}
              defaultValue={data.reviewsSection?.description || 'Real feedback from learners who gained practical skills and built their careers with DO PILOT.'}
              className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs focus:border-primary focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-3">
          {(data.reviewsSection?.reviews || []).map((r, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[11px] text-primary font-bold">Review #{idx + 1}</span>
                  <span className="text-[11px] text-slate">• {r.name || 'Student'} ({r.role || 'College'})</span>
                  <span className="inline-flex items-center gap-0.5 ml-2">
                    {[...Array(5)].map((_, starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-3 h-3 ${starIdx < (r.rating || 5) ? 'fill-amber-400 text-amber-400' : 'fill-white/10 text-white/20'}`}
                      />
                    ))}
                    <span className="text-[10px] text-amber-400/90 font-mono font-bold ml-1">{r.rating || 5}★</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteReview(idx)}
                  className="p-1.5 rounded-lg text-slate hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Remove Review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <input type="hidden" name={`revAvatar_${idx}`} defaultValue={r.avatar} />

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate mb-1">Student Name</label>
                  <input
                    type="text"
                    name={`revName_${idx}`}
                    defaultValue={r.name}
                    placeholder="Student name"
                    className="w-full bg-black border border-white/15 rounded-xl px-3 py-1.5 text-xs text-paper font-bold focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate mb-1">Role / College</label>
                  <input
                    type="text"
                    name={`revRole_${idx}`}
                    defaultValue={r.role}
                    placeholder="e.g. GEC Thrissur"
                    className="w-full bg-black border border-white/15 rounded-xl px-3 py-1.5 text-xs text-paper focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate mb-1">Course Enrolled</label>
                  <input
                    type="text"
                    name={`revCourse_${idx}`}
                    defaultValue={r.course}
                    placeholder="e.g. Complete Python Course"
                    className="w-full bg-black border border-white/15 rounded-xl px-3 py-1.5 text-xs text-paper focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate mb-1">Rating / Stars</label>
                  <select
                    name={`revRating_${idx}`}
                    defaultValue={String(r.rating || 5)}
                    className="w-full bg-black border border-white/15 rounded-xl px-3 py-1.5 text-xs text-amber-400 font-bold focus:border-primary focus:outline-none cursor-pointer"
                  >
                    <option value="5" className="bg-neutral-900 text-amber-400">★★★★★ 5 Stars</option>
                    <option value="4" className="bg-neutral-900 text-amber-400">★★★★☆ 4 Stars</option>
                    <option value="3" className="bg-neutral-900 text-amber-400">★★★☆☆ 3 Stars</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate mb-1">Student Testimonial</label>
                <textarea
                  name={`revComment_${idx}`}
                  rows={2}
                  defaultValue={r.comment}
                  placeholder="Student testimonial"
                  className="w-full bg-black border border-white/15 rounded-xl px-3 py-1.5 text-xs text-slate focus:border-primary focus:outline-none resize-none"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-primary text-ink font-jakarta font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:brightness-110 shadow-md shadow-primary/20 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Reviews Changes</span>
          </button>
        </div>
      </form>
    </section>
  );

  const renderCodeLabSection = () => (
    <section id="section-codeLab" className="rounded-2xl bg-[#0c0d0e] border border-white/10 p-5 sm:p-6 space-y-5 shadow-2xl relative">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-jakarta text-base sm:text-lg font-black text-paper">Python Code Lab</h2>
            <span className="font-mono text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold border border-primary/20">05</span>
          </div>
          <p className="text-xs text-slate mt-0.5">In-browser live Python playground title, description, and initial code.</p>
        </div>
      </div>

      <form onSubmit={handleSaveCodeLab} className="space-y-4 text-xs">
        <div className="p-4 sm:p-5 rounded-xl bg-black/40 border border-white/10 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Badge</label>
              <input
                type="text"
                name="codeLabBadge"
                defaultValue={data.codeLab?.badgeText || 'CODE LAB'}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Title</label>
              <input
                type="text"
                name="codeLabTitle"
                defaultValue={data.codeLab?.title || 'Run Python Programs Instantly'}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs font-bold focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate mb-1">Description</label>
            <textarea
              name="codeLabDesc"
              rows={2}
              defaultValue={data.codeLab?.description || 'Write, test, and execute Python 3.12 code directly in your browser.'}
              className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs focus:border-primary focus:outline-none resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate mb-1">Default Starter Python Code</label>
            <textarea
              name="defaultCode"
              rows={5}
              defaultValue={data.codeLab?.defaultCode || 'print("Hello, World!")\n'}
              className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-primary font-mono text-xs focus:border-primary focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-primary text-ink font-jakarta font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:brightness-110 shadow-md shadow-primary/20 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Code Lab</span>
          </button>
        </div>
      </form>
    </section>
  );

  const renderLiveClassSection = () => (
    <section id="section-liveClass" className="rounded-2xl bg-[#0c0d0e] border border-white/10 p-5 sm:p-6 space-y-5 shadow-2xl relative">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-jakarta text-base sm:text-lg font-black text-paper">Live Masterclass</h2>
            <span className="font-mono text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold border border-primary/20">06</span>
          </div>
          <p className="text-xs text-slate mt-0.5">Upcoming live interactive workshop schedule, mentor name, and seat counter.</p>
        </div>
      </div>

      <form onSubmit={handleSaveLiveClass} className="space-y-4 text-xs">
        <div className="p-4 sm:p-5 rounded-xl bg-black/40 border border-white/10 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Badge</label>
              <input
                type="text"
                name="liveClassBadge"
                defaultValue={data.liveClass?.badgeText || 'LIVE CLASS'}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Section Title</label>
              <input
                type="text"
                name="liveClassTitle"
                defaultValue={data.liveClass?.title || 'Upcoming Live Class'}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs font-bold focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Spotlight Badge</label>
              <input
                type="text"
                name="spotlightBadge"
                defaultValue={data.liveClass?.spotlightBadge || 'Live Workshop • Limited Seats'}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-rose-400 font-mono text-xs focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate mb-1">Section Description / Subtitle</label>
            <textarea
              name="liveClassDesc"
              rows={2}
              defaultValue={data.liveClass?.description || 'Join our interactive live masterclass. Code alongside experienced engineers and ask your questions live.'}
              className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs focus:border-primary focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Class / Masterclass Name</label>
              <input
                type="text"
                name="className"
                defaultValue={data.liveClass?.className || 'Python & AI Assistant: Live Masterclass'}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs font-bold focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Class Description</label>
              <input
                type="text"
                name="classDescription"
                defaultValue={data.liveClass?.classDescription || 'Build a functional AI assistant with Python and live API integration in a 2-hour interactive code-along.'}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Schedule & Live Countdown Timer Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate mb-1">
                Target Date &amp; Time (Countdown Timer)
              </label>
              <input
                type="datetime-local"
                name="targetDateTime"
                defaultValue={data.liveClass?.targetDateTime || '2026-10-18T18:00'}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
              />
              <span className="block font-mono text-[10px] text-slate/70 mt-1">
                Timer automatically counts down to this exact date &amp; time.
              </span>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Display Date (Card)</label>
              <input
                type="text"
                name="date"
                defaultValue={data.liveClass?.date || 'Saturday, Oct 18, 2026'}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
              />
              <span className="block font-mono text-[10px] text-slate/70 mt-1">e.g. Saturday, Oct 18, 2026</span>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Display Time (Card)</label>
              <input
                type="text"
                name="time"
                defaultValue={data.liveClass?.time || '6:00 PM – 8:00 PM IST'}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
              />
              <span className="block font-mono text-[10px] text-slate/70 mt-1">e.g. 6:00 PM – 8:00 PM IST</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate mb-1">Platform</label>
              <input
                type="text"
                name="platform"
                defaultValue={data.liveClass?.platform || 'Live on Google Meet / Zoom'}
                className="w-full bg-black border border-white/15 rounded-xl px-3 py-1.5 text-xs text-paper focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate mb-1">Seats Remaining</label>
              <input
                type="text"
                name="seatsLeft"
                defaultValue={data.liveClass?.seatsLeft || '14 Spots Left'}
                className="w-full bg-black border border-white/15 rounded-xl px-3 py-1.5 text-xs text-primary font-mono font-bold focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate mb-1">Mentor Name</label>
              <input
                type="text"
                name="mentorName"
                defaultValue={data.liveClass?.mentorName || 'Lead Mentor'}
                className="w-full bg-black border border-white/15 rounded-xl px-3 py-1.5 text-xs text-paper font-bold focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate mb-1">Mentor Role</label>
              <input
                type="text"
                name="mentorRole"
                defaultValue={data.liveClass?.mentorRole || 'Senior Software Engineer at DO PILOT'}
                className="w-full bg-black border border-white/15 rounded-xl px-3 py-1.5 text-xs text-paper focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate mb-1">Mentor Avatar URL</label>
              <input
                type="text"
                name="mentorAvatar"
                defaultValue={data.liveClass?.mentorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'}
                className="w-full bg-black border border-white/15 rounded-xl px-3 py-1.5 text-xs text-paper font-mono focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate mb-1">CTA Button Text</label>
              <input
                type="text"
                name="buttonText"
                defaultValue={data.liveClass?.buttonText || 'Reserve Your Free Spot'}
                className="w-full bg-black border border-white/15 rounded-xl px-3 py-1.5 text-xs text-primary font-bold focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate mb-1">Takeaway Benefits (One per line)</label>
            <textarea
              name="benefits"
              rows={3}
              defaultValue={(data.liveClass?.benefits || []).join('\n')}
              className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-xs text-paper font-mono focus:border-primary focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-primary text-ink font-jakarta font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:brightness-110 shadow-md shadow-primary/20 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Live Class</span>
          </button>
        </div>
      </form>
    </section>
  );

  const renderFooterSection = () => (
    <section id="section-footer" className="rounded-2xl bg-[#0c0d0e] border border-white/10 p-5 sm:p-6 space-y-5 shadow-2xl relative">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-jakarta text-base sm:text-lg font-black text-paper">Footer &amp; Links</h2>
            <span className="font-mono text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold border border-primary/20">07</span>
          </div>
          <p className="text-xs text-slate mt-0.5">Brand name, campus location, official email, phone, and social media channels.</p>
        </div>
      </div>

      <form onSubmit={handleSaveFooter} className="space-y-4 text-xs">
        <div className="p-4 sm:p-5 rounded-xl bg-black/40 border border-white/10 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Company / Brand Name</label>
              <input
                type="text"
                name="companyName"
                defaultValue={data.footer?.companyName || 'DO PILOT'}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs font-bold focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Company Logo URL</label>
              <input
                type="text"
                name="companyLogo"
                defaultValue={data.footer?.companyLogo || data.navbar?.companyLogo || 'https://res.cloudinary.com/ufo0zltq/image/upload/v1786197046/Do_PNG_ssyhu1.png'}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Support Email</label>
              <input
                type="email"
                name="footerEmail"
                defaultValue={data.footer?.email || 'support@dopilot.com'}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Phone Number</label>
              <input
                type="text"
                name="footerPhone"
                defaultValue={data.footer?.phone || '+91 97787 07336'}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Campus / Location</label>
              <input
                type="text"
                name="footerAddress"
                defaultValue={data.footer?.address || 'Online & Global Campus'}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate mb-1">Copyright Line</label>
              <input
                type="text"
                name="copyrightText"
                defaultValue={data.footer?.copyrightText || '© 2026 DO PILOT. All rights reserved.'}
                className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs font-mono focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 space-y-2.5">
            <span className="font-mono text-[11px] text-primary font-bold uppercase tracking-wider block">// 4 Column Headings</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold text-slate mb-1">Col 1 Title</label>
                <input
                  type="text"
                  name="exploreTitle"
                  defaultValue={data.footer?.exploreTitle || 'Explore'}
                  className="w-full bg-black border border-white/15 rounded-xl px-3 py-1.5 text-xs text-paper font-bold focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate mb-1">Col 2 Title</label>
                <input
                  type="text"
                  name="coursesTitle"
                  defaultValue={data.footer?.coursesTitle || 'Popular Courses'}
                  className="w-full bg-black border border-white/15 rounded-xl px-3 py-1.5 text-xs text-paper font-bold focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate mb-1">Col 3 Title</label>
                <input
                  type="text"
                  name="legalTitle"
                  defaultValue={data.footer?.legalTitle || 'Legal & Policies'}
                  className="w-full bg-black border border-white/15 rounded-xl px-3 py-1.5 text-xs text-paper font-bold focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate mb-1">Col 4 Title</label>
                <input
                  type="text"
                  name="contactTitle"
                  defaultValue={data.footer?.contactTitle || 'Contact & Support'}
                  className="w-full bg-black border border-white/15 rounded-xl px-3 py-1.5 text-xs text-paper font-bold focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate mb-1">Footer Tagline / Summary</label>
            <textarea
              name="footerDesc"
              rows={2}
              defaultValue={data.footer?.description || 'DO PILOT is an educational platform dedicated to project-first coding. We teach practical Python, Java programming, and real-world software engineering with live mentorship.'}
              className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs focus:border-primary focus:outline-none resize-none"
            />
          </div>

          {/* Social Media Channels & Visibility */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-black/60 border border-white/10 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-white/5">
              <span className="font-mono text-[11px] text-primary font-bold uppercase tracking-wider block">
                // Social Media Links &amp; Footer Visibility
              </span>
              <span className="text-[10px] text-slate font-mono">
                Check box to display icon in footer
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              {/* 1. WhatsApp */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-paper flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    WhatsApp
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="social_whatsapp_enabled"
                      defaultChecked={data.footer?.socialLinks?.whatsapp?.enabled ?? true}
                      className="accent-primary rounded cursor-pointer w-3.5 h-3.5"
                    />
                    <span className="text-[11px] text-slate font-medium">Show Icon</span>
                  </label>
                </div>
                <input
                  type="text"
                  name="social_whatsapp_url"
                  defaultValue={data.footer?.socialLinks?.whatsapp?.url || 'https://wa.me/919778707336'}
                  placeholder="https://wa.me/919778707336"
                  className="w-full bg-black border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-paper font-mono focus:border-primary focus:outline-none"
                />
              </div>

              {/* 2. GitHub */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-paper flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                    GitHub
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="social_github_enabled"
                      defaultChecked={data.footer?.socialLinks?.github?.enabled ?? true}
                      className="accent-primary rounded cursor-pointer w-3.5 h-3.5"
                    />
                    <span className="text-[11px] text-slate font-medium">Show Icon</span>
                  </label>
                </div>
                <input
                  type="text"
                  name="social_github_url"
                  defaultValue={data.footer?.socialLinks?.github?.url || 'https://github.com'}
                  placeholder="https://github.com/..."
                  className="w-full bg-black border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-paper font-mono focus:border-primary focus:outline-none"
                />
              </div>

              {/* 3. LinkedIn */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-paper flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    LinkedIn
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="social_linkedin_enabled"
                      defaultChecked={data.footer?.socialLinks?.linkedin?.enabled ?? true}
                      className="accent-primary rounded cursor-pointer w-3.5 h-3.5"
                    />
                    <span className="text-[11px] text-slate font-medium">Show Icon</span>
                  </label>
                </div>
                <input
                  type="text"
                  name="social_linkedin_url"
                  defaultValue={data.footer?.socialLinks?.linkedin?.url || 'https://linkedin.com'}
                  placeholder="https://linkedin.com/..."
                  className="w-full bg-black border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-paper font-mono focus:border-primary focus:outline-none"
                />
              </div>

              {/* 4. YouTube */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-paper flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    YouTube
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="social_youtube_enabled"
                      defaultChecked={data.footer?.socialLinks?.youtube?.enabled ?? Boolean(data.footer?.socialLinks?.youtube?.url)}
                      className="accent-primary rounded cursor-pointer w-3.5 h-3.5"
                    />
                    <span className="text-[11px] text-slate font-medium">Show Icon</span>
                  </label>
                </div>
                <input
                  type="text"
                  name="social_youtube_url"
                  defaultValue={data.footer?.socialLinks?.youtube?.url || ''}
                  placeholder="https://youtube.com/@..."
                  className="w-full bg-black border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-paper font-mono focus:border-primary focus:outline-none"
                />
              </div>

              {/* 5. Instagram */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-paper flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                    Instagram
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="social_instagram_enabled"
                      defaultChecked={data.footer?.socialLinks?.instagram?.enabled ?? Boolean(data.footer?.socialLinks?.instagram?.url)}
                      className="accent-primary rounded cursor-pointer w-3.5 h-3.5"
                    />
                    <span className="text-[11px] text-slate font-medium">Show Icon</span>
                  </label>
                </div>
                <input
                  type="text"
                  name="social_instagram_url"
                  defaultValue={data.footer?.socialLinks?.instagram?.url || ''}
                  placeholder="https://instagram.com/..."
                  className="w-full bg-black border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-paper font-mono focus:border-primary focus:outline-none"
                />
              </div>

              {/* 6. Facebook */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-paper flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    Facebook
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="social_facebook_enabled"
                      defaultChecked={data.footer?.socialLinks?.facebook?.enabled ?? Boolean(data.footer?.socialLinks?.facebook?.url)}
                      className="accent-primary rounded cursor-pointer w-3.5 h-3.5"
                    />
                    <span className="text-[11px] text-slate font-medium">Show Icon</span>
                  </label>
                </div>
                <input
                  type="text"
                  name="social_facebook_url"
                  defaultValue={data.footer?.socialLinks?.facebook?.url || ''}
                  placeholder="https://facebook.com/..."
                  className="w-full bg-black border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-paper font-mono focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-primary text-ink font-jakarta font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:brightness-110 shadow-md shadow-primary/20 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Footer Changes</span>
          </button>
        </div>
      </form>
    </section>
  );


  const renderSecuritySection = () => {
    const normalizedAuditQuery = auditSearchQuery.trim().toLowerCase();
    const currentEmails = getAdminEmails();

    const filteredAuditLogs = auditLogs.filter((log) => {
      // 1. Category filter
      if (auditFilterCategory === 'resets') {
        const isReset = log.action.includes('COURSE') || log.action.includes('RESET') || log.action.includes('UNLOCK');
        if (!isReset) return false;
      } else if (auditFilterCategory === 'credentials') {
        const isCred = log.action.includes('PASSWORD') || log.action.includes('CREDENTIAL') || log.action.includes('EMAIL');
        if (!isCred) return false;
      } else if (auditFilterCategory === 'access') {
        const isAccess = log.action.includes('LOGIN') || log.action.includes('LOCKOUT') || log.action.includes('GATEWAY') || log.action.includes('SESSION') || log.action.includes('BOT');
        if (!isAccess) return false;
      }

      // 2. Status filter
      if (auditFilterStatus !== 'all' && log.status !== auditFilterStatus) {
        return false;
      }

      // 3. Search query
      if (normalizedAuditQuery) {
        const matchAction = log.action.toLowerCase().includes(normalizedAuditQuery);
        const matchDetails = log.details.toLowerCase().includes(normalizedAuditQuery);
        const matchUser = (log.affectedUser || '').toLowerCase().includes(normalizedAuditQuery);
        const matchCourse = (log.affectedCourse || '').toLowerCase().includes(normalizedAuditQuery);
        const matchAdmin = (log.adminUser || '').toLowerCase().includes(normalizedAuditQuery);
        if (!matchAction && !matchDetails && !matchUser && !matchCourse && !matchAdmin) {
          return false;
        }
      }

      return true;
    });

    return (
      <section id="section-security" className="space-y-6">
        {/* =========================================================================
            CARD 1: ADMIN CREDENTIALS & CHANGE PASSWORD
        ========================================================================= */}
        <div className="rounded-2xl bg-[#0c0d0e] border border-white/10 p-5 sm:p-6 space-y-5 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-jakarta text-base sm:text-lg font-black text-paper">Admin Credentials &amp; Password</h2>
              </div>
              <p className="text-xs text-slate mt-0.5">
                Update admin login credentials or reset password via email recovery.
              </p>
            </div>

            {/* Method Tabs Switcher */}
            <div className="flex items-center bg-black/50 p-1 rounded-xl border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => {
                  setPasswordChangeMethod('methodA');
                  setMethodAStatus({ type: 'idle', message: '' });
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  passwordChangeMethod === 'methodA'
                    ? 'bg-primary text-ink shadow-sm'
                    : 'text-slate hover:text-paper'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Current Password</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPasswordChangeMethod('methodB');
                  setMethodBStatus({ type: 'idle', message: '' });
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  passwordChangeMethod === 'methodB'
                    ? 'bg-primary text-ink shadow-sm'
                    : 'text-slate hover:text-paper'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Recovery</span>
              </button>
            </div>
          </div>

          {/* METHOD A FORM */}
          {passwordChangeMethod === 'methodA' && (
            <form onSubmit={handleMethodASubmit} className="space-y-4">
              {methodAStatus.type !== 'idle' && (
                <div
                  className={`p-3 rounded-xl font-mono text-xs text-center border ${
                    methodAStatus.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}
                >
                  {methodAStatus.message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate mb-1">Current Admin Username *</label>
                  <input
                    type="text"
                    required
                    value={methodACurrentUser}
                    onChange={(e) => setMethodACurrentUser(e.target.value)}
                    placeholder="Enter current username"
                    className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs focus:border-primary focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate mb-1">Current Admin Password *</label>
                  <div className="relative">
                    <input
                      type={methodAShowPass ? 'text' : 'password'}
                      required
                      value={methodACurrentPass}
                      onChange={(e) => setMethodACurrentPass(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs focus:border-primary focus:outline-none font-mono pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setMethodAShowPass(!methodAShowPass)}
                      className="absolute right-3 top-2.5 text-slate hover:text-paper"
                    >
                      {methodAShowPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate mb-1">New Password (Min 6 chars) *</label>
                  <input
                    type={methodAShowPass ? 'text' : 'password'}
                    required
                    value={methodANewPass}
                    onChange={(e) => setMethodANewPass(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs focus:border-primary focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate mb-1">Confirm New Password *</label>
                  <input
                    type={methodAShowPass ? 'text' : 'password'}
                    required
                    value={methodAConfirmPass}
                    onChange={(e) => setMethodAConfirmPass(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper text-xs focus:border-primary focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={methodALoading}
                  className="px-5 py-2 rounded-xl bg-primary text-ink font-jakarta font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:brightness-110 shadow-md shadow-primary/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{methodALoading ? 'Saving...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          )}

          {/* METHOD B FORM */}
          {passwordChangeMethod === 'methodB' && (
            <div className="space-y-4">
              {!currentEmails.primaryEmail && !currentEmails.secondaryEmail && (
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-slate text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>No recovery emails configured yet. Please configure an email below in Emergency Dual Recovery Emails.</span>
                </div>
              )}

              {methodBStatus.type !== 'idle' && (
                <div
                  className={`p-3 rounded-xl font-mono text-xs text-center border ${
                    methodBStatus.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}
                >
                  {methodBStatus.message}
                </div>
              )}

              {/* Step 1: Select Delivery Target */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate">Select Recovery Destination</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={!currentEmails.primaryEmail}
                    onClick={() => {
                      if (!currentEmails.primaryEmail) return;
                      setMethodBDeliveryMode('primary');
                      setMethodBOtpSent(false);
                      setMethodBStatus({ type: 'idle', message: '' });
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      !currentEmails.primaryEmail
                        ? 'opacity-40 cursor-not-allowed bg-black/20 border-white/5'
                        : methodBDeliveryMode === 'primary'
                        ? 'bg-white/10 border-white/20 text-paper cursor-pointer'
                        : 'bg-black/40 border-white/10 text-slate hover:border-white/20 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] uppercase font-bold text-slate">Primary Email</span>
                      {methodBDeliveryMode === 'primary' && currentEmails.primaryEmail && <Check className="w-3.5 h-3.5 text-paper" />}
                    </div>
                    <div className="font-jakarta font-bold text-xs truncate text-paper">
                      {currentEmails.primaryEmail || 'Not Configured'}
                    </div>
                  </button>

                  <button
                    type="button"
                    disabled={!currentEmails.secondaryEmail}
                    onClick={() => {
                      if (!currentEmails.secondaryEmail) return;
                      setMethodBDeliveryMode('secondary');
                      setMethodBOtpSent(false);
                      setMethodBStatus({ type: 'idle', message: '' });
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      !currentEmails.secondaryEmail
                        ? 'opacity-40 cursor-not-allowed bg-black/20 border-white/5'
                        : methodBDeliveryMode === 'secondary'
                        ? 'bg-white/10 border-white/20 text-paper cursor-pointer'
                        : 'bg-black/40 border-white/10 text-slate hover:border-white/20 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] uppercase font-bold text-slate">Secondary Email</span>
                      {methodBDeliveryMode === 'secondary' && currentEmails.secondaryEmail && <Check className="w-3.5 h-3.5 text-paper" />}
                    </div>
                    <div className="font-jakarta font-bold text-xs truncate text-paper">
                      {currentEmails.secondaryEmail || 'Not Configured'}
                    </div>
                  </button>
                </div>
              </div>

              {/* Action to Request OTP */}
              {!methodBOtpSent ? (
                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={handleMethodBSendOTP}
                    disabled={
                      methodBLoading ||
                      methodBCooldown > 0 ||
                      (methodBDeliveryMode === 'primary' && !currentEmails.primaryEmail) ||
                      (methodBDeliveryMode === 'secondary' && !currentEmails.secondaryEmail)
                    }
                    className="px-5 py-2 rounded-xl bg-primary text-ink font-jakarta font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:brightness-110 shadow-md shadow-primary/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>
                      {methodBLoading
                        ? 'Sending OTP...'
                        : methodBCooldown > 0
                        ? `Resend in ${methodBCooldown}s`
                        : 'Send Recovery OTP'}
                    </span>
                  </button>
                </div>
              ) : (
                /* Step 2: Verification and Set New Password */
                <form onSubmit={handleMethodBSubmit} className="space-y-4 pt-3 border-t border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {methodBDeliveryMode === 'primary' && (
                      <div>
                        <label className="block text-xs font-bold text-slate mb-1">
                          OTP sent to Primary ({currentEmails.primaryEmail}) *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={methodBOtpPrimary}
                          onChange={(e) => setMethodBOtpPrimary(e.target.value.replace(/\D/g, ''))}
                          placeholder="6-digit code"
                          className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper focus:border-primary focus:outline-none font-mono text-xs tracking-widest text-center"
                        />
                      </div>
                    )}

                    {methodBDeliveryMode === 'secondary' && (
                      <div>
                        <label className="block text-xs font-bold text-slate mb-1">
                          OTP sent to Secondary ({currentEmails.secondaryEmail}) *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={methodBOtpSecondary}
                          onChange={(e) => setMethodBOtpSecondary(e.target.value.replace(/\D/g, ''))}
                          placeholder="6-digit code"
                          className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper focus:border-primary focus:outline-none font-mono text-xs tracking-widest text-center"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate mb-1">New Password (Min 6 chars) *</label>
                      <div className="relative">
                        <input
                          type={methodBShowPass ? 'text' : 'password'}
                          required
                          value={methodBNewPass}
                          onChange={(e) => setMethodBNewPass(e.target.value)}
                          placeholder="Enter new password"
                          className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper focus:border-primary focus:outline-none font-mono text-xs pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setMethodBShowPass(!methodBShowPass)}
                          className="absolute right-3 top-2.5 text-slate hover:text-paper"
                        >
                          {methodBShowPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate mb-1">Confirm New Password *</label>
                      <input
                        type={methodBShowPass ? 'text' : 'password'}
                        required
                        value={methodBConfirmPass}
                        onChange={(e) => setMethodBConfirmPass(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleMethodBSendOTP}
                      disabled={methodBLoading || methodBCooldown > 0}
                      className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate hover:text-paper font-jakarta text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                    >
                      {methodBCooldown > 0 ? `Resend in ${methodBCooldown}s` : 'Resend Code'}
                    </button>

                    <button
                      type="submit"
                      disabled={methodBLoading}
                      className="px-5 py-2 rounded-xl bg-primary text-ink font-jakarta font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:brightness-110 shadow-md shadow-primary/20 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{methodBLoading ? 'Verifying...' : 'Set New Password'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* =========================================================================
            CARD 2: EMERGENCY DUAL RECOVERY EMAILS
        ========================================================================= */}
        <div className="rounded-2xl bg-[#0c0d0e] border border-white/10 p-5 sm:p-6 space-y-5 shadow-2xl">
          <div className="pb-3 border-b border-white/10">
            <h2 className="font-jakarta text-base sm:text-lg font-black text-paper">Emergency Recovery Emails</h2>
            <p className="text-xs text-slate mt-0.5">
              Two verified administrator addresses used for OTP password recovery and security verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Primary Recovery Email Card */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase font-bold text-slate">Primary Recovery Email</span>
                {currentEmails.primaryEmail ? (
                  <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Active</span>
                  </span>
                ) : (
                  <span className="font-mono text-[10px] text-slate/60 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full font-bold">
                    Not Configured
                  </span>
                )}
              </div>
              <div className="font-mono text-xs text-paper font-semibold break-all bg-black/60 px-3.5 py-2.5 rounded-xl border border-white/5">
                {currentEmails.primaryEmail || 'No email configured'}
              </div>
              {currentEmails.primaryEmail ? (
                <button
                  type="button"
                  onClick={() => handleOpenEmailChangeModal('primary')}
                  className="w-full py-2 px-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-slate hover:text-paper font-jakarta text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Change Email</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleOpenEmailSetupModal('primary')}
                  className="w-full py-2 px-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate hover:text-paper font-jakarta text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Setup Email</span>
                </button>
              )}
            </div>

            {/* Secondary Backup Email Card */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase font-bold text-slate">Secondary Recovery Email</span>
                {currentEmails.secondaryEmail ? (
                  <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Active</span>
                  </span>
                ) : (
                  <span className="font-mono text-[10px] text-slate/60 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full font-bold">
                    Not Configured
                  </span>
                )}
              </div>
              <div className="font-mono text-xs text-paper font-semibold break-all bg-black/60 px-3.5 py-2.5 rounded-xl border border-white/5">
                {currentEmails.secondaryEmail || 'No email configured'}
              </div>
              {currentEmails.secondaryEmail ? (
                <button
                  type="button"
                  onClick={() => handleOpenEmailChangeModal('secondary')}
                  className="w-full py-2 px-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-slate hover:text-paper font-jakarta text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Change Email</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleOpenEmailSetupModal('secondary')}
                  className="w-full py-2 px-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate hover:text-paper font-jakarta text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Setup Email</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================================
            CARD 3: SECURITY AUDIT LOGS
        ========================================================================= */}
        <div className="rounded-2xl bg-[#0c0d0e] border border-white/10 p-5 sm:p-6 space-y-4 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <h3 className="font-jakarta text-base sm:text-lg font-black text-paper">Security Audit Logs</h3>
              <p className="text-xs text-slate mt-0.5">
                Activity records for administrative actions, credential updates, and resets.
              </p>
            </div>

            <button
              type="button"
              onClick={async () => {
                setIsRefreshingAudit(true);
                await refreshAuditLogs();
                setTimeout(() => setIsRefreshingAudit(false), 500);
                showToast('Audit logs refreshed!');
              }}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-paper font-jakarta text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-primary ${isRefreshingAudit ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search audit records..."
                value={auditSearchQuery}
                onChange={(e) => setAuditSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-paper font-jakarta text-xs focus:outline-none focus:border-primary placeholder:text-slate/40"
              />
            </div>

            {/* Clean category pills */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 overflow-x-auto">
              {[
                { id: 'all', label: 'All' },
                { id: 'resets', label: 'Resets' },
                { id: 'credentials', label: 'Credentials' },
                { id: 'access', label: 'Access' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setAuditFilterCategory(tab.id as any)}
                  className={`px-3 py-1 rounded-lg font-jakarta text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    auditFilterCategory === tab.id
                      ? 'bg-primary text-ink shadow-sm'
                      : 'text-slate hover:text-paper'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Audit Logs List */}
          {filteredAuditLogs.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-white/[0.01] border border-white/5 space-y-1.5">
              <ShieldCheck className="w-6 h-6 text-slate/40 mx-auto" />
              <div className="font-jakarta text-xs font-bold text-paper">No Audit Logs Found</div>
              <p className="text-[11px] text-slate max-w-md mx-auto">
                No records match your search filter.
              </p>
            </div>
          ) : (
            <div className="max-h-[420px] overflow-y-auto space-y-2 pr-1">
              {filteredAuditLogs.map((log) => {
                const formattedTime = (() => {
                  try {
                    const d = new Date(log.timestamp);
                    if (isNaN(d.getTime())) return log.timestamp;
                    return d.toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    });
                  } catch {
                    return log.timestamp;
                  }
                })();

                return (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-black/40 border border-white/10 hover:border-white/15 transition-all space-y-1.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-paper">
                          {log.action}
                        </span>

                        <span
                          className={`font-mono text-[9px] px-1.5 py-0.5 rounded uppercase font-bold ${
                            log.status === 'SUCCESS'
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : log.status === 'FAILED'
                              ? 'text-rose-400 bg-rose-500/10'
                              : 'text-amber-400 bg-amber-500/10'
                          }`}
                        >
                          {log.status}
                        </span>

                        {log.affectedUser && (
                          <span className="font-mono text-[10px] text-slate">
                            User: {log.affectedUser}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate/50">
                        <span>Admin: <strong className="text-slate/80 font-normal">{log.adminUser || 'admin'}</strong></span>
                        <span>•</span>
                        <span>{formattedTime}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate leading-relaxed">
                      {log.details}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    );
  };

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
    try {
      if (!students || !students.length) {
        showToast('No student records available to export.');
        return;
      }

      const headers = [
        '#',
        'Student ID',
        'Student Name',
        'Verified Email Address',
        'Phone Number',
        'College / Organization',
        'Enrolled Courses',
        'Enrolled Courses Count',
        'Where Did You Find Us',
        'Total Points / Score',
        'Solved Tasks Count',
        'Tests Attempted',
        'Tests Passed',
        'Tests Failed',
        'Has Certificate',
        'Certificate ID',
        'Learning Progress Status',
        'Profile Completed',
        'Registration Date & Time'
      ];

      const rows = students.map((s, idx) => [
        idx + 1,
        `"${(s.id || '').replace(/"/g, '""')}"`,
        `"${(s.name || '').replace(/"/g, '""')}"`,
        `"${(s.email || '').replace(/"/g, '""')}"`,
        `"${(s.phone && s.phone !== 'Phone not added' ? s.phone : 'Not added').replace(/"/g, '""')}"`,
        `"${(s.collegeOrCompany || 'N/A').replace(/"/g, '""')}"`,
        `"${(Array.isArray(s.enrolledCourses) && s.enrolledCourses.length > 0 ? s.enrolledCourses.join('; ') : 'None').replace(/"/g, '""')}"`,
        Array.isArray(s.enrolledCourses) ? s.enrolledCourses.length : 0,
        `"${(s.whereDidYouFindUs || 'N/A').replace(/"/g, '""')}"`,
        s.points || 0,
        s.solvedTasksCount || 0,
        s.testsAttemptedCount || 0,
        s.testsPassedCount || 0,
        s.testsFailedCount || 0,
        s.hasCertificate ? 'YES' : 'NO',
        `"${(s.certificateId || 'N/A').replace(/"/g, '""')}"`,
        `"${(s.courseProgressStatus || 'registered').replace(/"/g, '""')}"`,
        s.hasCompletedDetails ? 'YES' : 'NO',
        `"${s.createdAt ? new Date(s.createdAt).toLocaleString() : 'N/A'}"`
      ]);

      const csvString = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
      const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
      const filename = `DO_PILOT_Students_Master_Data_${new Date().toISOString().slice(0, 10)}.csv`;

      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 300);

      showToast(`Exported ${students.length} complete student records to CSV!`);
    } catch (err: any) {
      console.error('Failed to export CSV:', err);
      showToast('Error exporting CSV spreadsheet.');
    }
  };

  const handleExportAllStudentPDF = () => {
    try {
      if (!students || !students.length) {
        showToast('No student records available to export.');
        return;
      }

      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Table Geometry (Total width: 786 pt, Left margin: 28 pt, Right margin: 28 pt)
      const tableLeft = 28;
      const tableWidth = pageWidth - (tableLeft * 2);

      const colDefs = [
        { label: '#', x: 28, width: 22, align: 'center' as const },
        { label: 'STUDENT NAME', x: 50, width: 118, align: 'left' as const },
        { label: 'VERIFIED EMAIL', x: 168, width: 145, align: 'left' as const },
        { label: 'PHONE NUMBER', x: 313, width: 80, align: 'left' as const },
        { label: 'COLLEGE / INSTITUTION', x: 393, width: 145, align: 'left' as const },
        { label: 'ENROLLED COURSES', x: 538, width: 180, align: 'left' as const },
        { label: 'FOUND US', x: 718, width: 54, align: 'left' as const },
        { label: 'SCORE', x: 772, width: 42, align: 'right' as const }
      ];

      const drawHeader = () => {
        // Deep Dark Executive Banner
        doc.setFillColor(15, 23, 42); // slate-900
        doc.rect(0, 0, pageWidth, 54, 'F');

        // Mint Green Accent Stripe
        doc.setFillColor(0, 255, 157);
        doc.rect(0, 52, pageWidth, 2, 'F');

        // Brand Logo
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(15);
        doc.setTextColor(0, 255, 157);
        doc.text('DO PILOT', tableLeft, 24);

        // Document Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(248, 250, 252);
        doc.text('STUDENT MASTER DIRECTORY & ENROLLMENT REPORT', tableLeft, 41);

        // Metadata on Right Side
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        const dateStr = new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
        const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        doc.text(`Total Records: ${students.length} Students  |  Generated: ${dateStr} ${timeStr}`, pageWidth - tableLeft, 25, { align: 'right' });
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text('CONFIDENTIAL • OFFICIAL ACADEMIC DATABASE', pageWidth - tableLeft, 40, { align: 'right' });

        // Table Column Header Bar
        const tableHeaderY = 64;
        const tableHeaderHeight = 22;
        doc.setFillColor(30, 41, 59); // slate-800
        doc.rect(tableLeft, tableHeaderY, tableWidth, tableHeaderHeight, 'F');

        doc.setFillColor(51, 65, 85); // slate-700 separator
        doc.rect(tableLeft, tableHeaderY + tableHeaderHeight - 1, tableWidth, 1, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);

        colDefs.forEach((col) => {
          doc.setTextColor(0, 255, 157);
          if (col.align === 'center') {
            doc.text(col.label, col.x + col.width / 2, tableHeaderY + 14, { align: 'center' });
          } else if (col.align === 'right') {
            doc.text(col.label, col.x + col.width - 4, tableHeaderY + 14, { align: 'right' });
          } else {
            doc.text(col.label, col.x + 4, tableHeaderY + 14);
          }
        });
      };

      drawHeader();

      let currentY = 94;
      const lineHeight = 9.5;
      const verticalPadding = 12;

      students.forEach((s, idx) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        const nameLines: string[] = doc.splitTextToSize(s.name || 'Unnamed Student', colDefs[1].width - 8);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.2);
        const emailLines: string[] = doc.splitTextToSize(s.email || '—', colDefs[2].width - 8);

        const hasPhone = Boolean(s.phone && s.phone !== 'Phone not added' && s.phone.trim().length >= 10);
        const phoneText = hasPhone && s.phone ? s.phone.trim() : 'Not added';
        const phoneLines: string[] = [phoneText];

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.2);
        const collegeText = s.collegeOrCompany && s.collegeOrCompany.trim() ? s.collegeOrCompany.trim() : 'Not provided';
        const collegeLines: string[] = doc.splitTextToSize(collegeText, colDefs[4].width - 8);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.2);
        const coursesText = Array.isArray(s.enrolledCourses) && s.enrolledCourses.length > 0
          ? s.enrolledCourses.join(', ')
          : 'None';
        const coursesLines: string[] = doc.splitTextToSize(coursesText, colDefs[5].width - 8);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        const sourceText = s.whereDidYouFindUs && s.whereDidYouFindUs.trim() ? s.whereDidYouFindUs.trim() : 'N/A';
        const sourceLines: string[] = doc.splitTextToSize(sourceText, colDefs[6].width - 8);

        // Dynamically compute row height so full multi-line text is completely visible without truncation
        const maxLines = Math.max(
          nameLines.length,
          emailLines.length,
          phoneLines.length,
          collegeLines.length,
          coursesLines.length,
          sourceLines.length,
          1
        );
        const rowHeight = Math.max(22, maxLines * lineHeight + verticalPadding);

        // Page break check (leaving 36pt for running footer)
        if (currentY + rowHeight > pageHeight - 34) {
          doc.addPage();
          drawHeader();
          currentY = 94;
        }

        const isEven = idx % 2 === 0;
        doc.setFillColor(isEven ? 248 : 255, isEven ? 250 : 255, isEven ? 252 : 255);
        doc.rect(tableLeft, currentY, tableWidth, rowHeight, 'F');

        // Row bottom divider line
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.5);
        doc.line(tableLeft, currentY + rowHeight, tableLeft + tableWidth, currentY + rowHeight);

        const textStartY = currentY + 11;

        // # (Index)
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.text(String(idx + 1), colDefs[0].x + colDefs[0].width / 2, textStartY, { align: 'center' });

        // Student Name
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(15, 23, 42);
        doc.text(nameLines, colDefs[1].x + 4, textStartY);

        // Verified Email
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.2);
        doc.setTextColor(51, 65, 85);
        doc.text(emailLines, colDefs[2].x + 4, textStartY);

        // Phone Number
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.2);
        if (hasPhone) {
          doc.setTextColor(15, 23, 42);
          doc.text(phoneLines, colDefs[3].x + 4, textStartY);
        } else {
          doc.setTextColor(148, 163, 184);
          doc.text('Not added', colDefs[3].x + 4, textStartY);
        }

        // College / Institution
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.2);
        doc.setTextColor(71, 85, 105);
        doc.text(collegeLines, colDefs[4].x + 4, textStartY);

        // Enrolled Courses
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.2);
        doc.setTextColor(4, 120, 87);
        doc.text(coursesLines, colDefs[5].x + 4, textStartY);

        // Referral Source
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text(sourceLines, colDefs[6].x + 4, textStartY);

        // Score
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(5, 150, 105);
        doc.text(`${s.points || 0} pts`, colDefs[7].x + colDefs[7].width - 4, textStartY, { align: 'right' });

        currentY += rowHeight;
      });

      // Running page footer on every page
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        const footerY = pageHeight - 16;
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.5);
        doc.line(tableLeft, footerY - 8, tableLeft + tableWidth, footerY - 8);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(148, 163, 184);
        doc.text('DO PILOT • Student Learning Master Directory & Academic Enrollment Tracking Database', tableLeft, footerY);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(`Page ${i} of ${totalPages}`, tableLeft + tableWidth, footerY, { align: 'right' });
      }

      doc.save(`DO_PILOT_Students_Master_Directory_${new Date().toISOString().slice(0, 10)}.pdf`);
      showToast(`Exported ${students.length} student records as formatted PDF report with complete details!`);
    } catch (err: any) {
      console.error('Failed to export PDF report:', err);
      showToast('Error generating PDF directory.');
    }
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
      <section id="section-student-export" className="rounded-2xl bg-[#0c0d0e] border border-white/10 p-5 sm:p-6 space-y-4 shadow-xl relative">
        {/* Header & Cleanly Organized Action Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-jakarta text-base font-bold text-paper">Extract Student Data</h2>
            </div>
            <p className="text-[11px] text-slate mt-0.5">
              Full student directory with complete course names, institution details, and contacts in the PDF export.
            </p>
          </div>

          {/* Cleanly Organized Action Toolbar (PDF Only) */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportAllStudentPDF}
              className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-white text-ink font-jakarta font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
              title="Download complete student master directory with full course names and complete details as printable PDF"
            >
              <FileText className="w-3.5 h-3.5 text-ink" />
              <span>EXPORT PDF</span>
            </button>

            <button
              type="button"
              onClick={handleCopyAllPhones}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-paper border border-white/10 font-jakarta text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              title="Copy all 10-digit mobile numbers for WhatsApp or SMS"
            >
              <Phone className="w-3.5 h-3.5 text-slate" />
              <span>Copy All Phones</span>
              <span className="px-1.5 py-0.2 rounded bg-white/10 text-[10px] font-mono text-slate">
                ({validPhonesCount})
              </span>
            </button>

            <button
              type="button"
              onClick={handleCopyAllEmails}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-paper border border-white/10 font-jakarta text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              title="Copy all verified email addresses for campaigns"
            >
              <Mail className="w-3.5 h-3.5 text-slate" />
              <span>Copy All Emails</span>
              <span className="px-1.5 py-0.2 rounded bg-white/10 text-[10px] font-mono text-slate">
                ({students.length})
              </span>
            </button>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="flex items-center gap-2 p-1.5 bg-black/40 border border-white/10 rounded-xl">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate/50 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={studentExportSearch}
              onChange={(e) => setStudentExportSearch(e.target.value)}
              placeholder="Search by student name, email, or phone number..."
              className="w-full bg-transparent pl-8 pr-3 py-1 text-paper text-xs placeholder:text-slate/40 focus:outline-none font-jakarta"
            />
          </div>
          {studentExportSearch && (
            <button
              type="button"
              onClick={() => setStudentExportSearch('')}
              className="text-[10px] text-slate hover:text-paper font-mono px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 cursor-pointer"
            >
              Clear
            </button>
          )}
          <span className="font-mono text-[10px] text-slate/60 pr-2.5 whitespace-nowrap">
            Showing <strong className="text-primary font-bold">{filteredStudents.length}</strong> of {students.length}
          </span>
        </div>

        {/* Minimal Clean Contact Data Table */}
        <div className="rounded-xl border border-white/10 bg-black/40 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-slate/60 font-mono text-[10px] uppercase tracking-wider font-semibold">
                  <th className="py-2 px-3 w-10 text-center">#</th>
                  <th className="py-2 px-3.5">Student Name</th>
                  <th className="py-2 px-3.5">Verified Email</th>
                  <th className="py-2 px-3.5">Phone Number</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-jakarta text-xs">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate font-mono text-[11px]">
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
                        <td className="py-2.5 px-3 text-center font-mono text-[10px] text-slate/40">
                          {idx + 1}
                        </td>

                        {/* 2. Student Name */}
                        <td className="py-2.5 px-3.5">
                          <span className="font-semibold text-xs text-paper">
                            {std.name}
                          </span>
                        </td>

                        {/* 3. Email Address */}
                        <td className="py-2.5 px-3.5">
                          <div className="flex items-center gap-1.5 group">
                            <span className="font-mono text-[11px] text-slate/80 select-all">
                              {std.email}
                            </span>
                            <button
                              type="button"
                              onClick={() => copyContactToClipboard(std.email, `email-${std.id}`, 'Email')}
                              className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-slate hover:text-paper transition-colors cursor-pointer"
                              title="Copy email to clipboard"
                            >
                              {emailCopied ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* 4. Phone Number */}
                        <td className="py-2.5 px-3.5">
                          {hasValidPhone ? (
                            <div className="flex items-center gap-1.5 group">
                              <a
                                href={`tel:${std.phone}`}
                                className="font-mono text-[11px] text-paper hover:text-primary transition-colors select-all"
                                title="Click to call"
                              >
                                {std.phone}
                              </a>
                              <button
                                type="button"
                                onClick={() => copyContactToClipboard(std.phone!, `phone-${std.id}`, 'Phone')}
                                className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-slate hover:text-paper transition-colors cursor-pointer"
                                title="Copy phone number to clipboard"
                              >
                                {phoneCopied ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                                )}
                              </button>
                            </div>
                          ) : (
                            <span className="font-mono text-[10px] text-slate/40 italic">
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

  const exportIndividualStudentPDF = async (s: StudentAdminRecord) => {
    try {
      // Ensure student telemetry is hydrated from cloud if not yet loaded locally
      let allAttempts = getStudentQuestionTelemetry(s, 'all');
      if (allAttempts.length === 0 && s.email) {
        const cloudAttempts = await restoreStudentTelemetryFromCloud(s.email);
        if (cloudAttempts && cloudAttempts.length > 0) {
          allAttempts = getStudentQuestionTelemetry(s, 'all');
        }
      }

      const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const sEmail = (s.email || '').toLowerCase().trim();
      const sId = (s.id || '').trim();

      // Purchases for this student
      const studentPurchases = coursePurchases
        .filter((p) => {
          const pe = (p.studentEmail || '').toLowerCase().trim();
          const pi = (p.studentId || '').trim();
          const match = (sEmail && pe === sEmail) || (sId && pi === sId);
          return match && (p.status === 'completed' || p.accessGranted);
        })
        .sort((a, b) => new Date(a.purchasedAt).getTime() - new Date(b.purchasedAt).getTime());

      // Authentic claimed certificates for this student
      const studentCertificates: {
        courseId: string;
        courseTitle: string;
        certificateId: string;
        issueDate: string;
      }[] = [];

      if (sEmail && memoryCourseState[sEmail]?.certificates) {
        Object.entries(memoryCourseState[sEmail].certificates).forEach(([storageKey, record]: [string, any]) => {
          if (record && record.certificateId && (record.isConfirmed || record.isLocked)) {
            const matchCfg = Object.values(COURSE_CERT_CONFIGS).find((cfg) => cfg.storageKey === storageKey);
            const title = matchCfg?.title || record.courseTitle || 'Complete Python Course';
            const courseId = matchCfg?.courseId || 'python-core';
            studentCertificates.push({
              courseId,
              courseTitle: title,
              certificateId: record.certificateId,
              issueDate: record.issueDate || 'Completed'
            });
          }
        });
      }

      if (typeof window !== 'undefined' && window.localStorage) {
        Object.values(COURSE_CERT_CONFIGS).forEach((cfg) => {
          try {
            const raw = localStorage.getItem(cfg.storageKey);
            if (raw) {
              const parsed = JSON.parse(raw);
              if (parsed && parsed.certificateId && (parsed.isConfirmed || parsed.isLocked)) {
                if (!studentCertificates.some((sc) => sc.certificateId === parsed.certificateId)) {
                  studentCertificates.push({
                    courseId: cfg.courseId,
                    courseTitle: cfg.title,
                    certificateId: parsed.certificateId,
                    issueDate: parsed.issueDate || 'Completed'
                  });
                }
              }
            }
          } catch {}
        });
      }

      if (studentCertificates.length === 0 && s.hasCertificate && s.certificateId) {
        const courseName = s.enrolledCourses && s.enrolledCourses[0]
          ? s.enrolledCourses[0]
          : 'Complete Python Course';
        studentCertificates.push({
          courseId: 'python-core',
          courseTitle: courseName,
          certificateId: s.certificateId,
          issueDate: s.certificateIssuedDate || 'Completed'
        });
      }

      // Group student activity by course (Strictly one entry per course without duplicate sections)
      interface PDFCourseGroup {
        courseId: string;
        courseName: string;
        attempts: StudentQuestionAttempt[];
      }

      const courseGroups: PDFCourseGroup[] = [];
      allAttempts.forEach((att) => {
        const cId = att.courseId || 'python-core';
        const cName = att.courseName || ALL_INSPECT_COURSES.find((c) => c.id === cId)?.name || 'Complete Python Course';
        let grp = courseGroups.find((g) => g.courseId === cId);
        if (!grp) {
          grp = { courseId: cId, courseName: cName, attempts: [] };
          courseGroups.push(grp);
        }
        grp.attempts.push(att);
      });

      // If student has no attempts in any course, fallback to primary enrolled course
      if (courseGroups.length === 0) {
        const primaryCourse = (s.enrolledCourses && s.enrolledCourses.length > 0)
          ? s.enrolledCourses[0]
          : 'python-core';
        const crsMeta = ALL_INSPECT_COURSES.find(
          (c) => c.id === primaryCourse || c.name.toLowerCase().includes(primaryCourse.toLowerCase())
        );
        courseGroups.push({
          courseId: crsMeta?.id || 'python-core',
          courseName: crsMeta?.name || 'Complete Python Course',
          attempts: []
        });
      }

      // Helper function: Render standard page header (only when starting a new course or page 1)
      const drawReportHeader = (titleSuffix: string = '') => {
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, pageWidth, 68, 'F');

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(0, 255, 157);
        doc.text("DO PILOT", 40, 32);

        doc.setFontSize(9.5);
        doc.setTextColor(240, 240, 240);
        doc.text(`Student Performance & Learning Report Card${titleSuffix ? ` - ${titleSuffix}` : ''}`, 40, 50);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 180, 50);
      };

      // Header on first page
      drawReportHeader();

      // Top Student Profile Card
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.rect(40, 80, pageWidth - 80, 68, 'FD');

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(s.name, 55, 100);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(`Email: ${s.email}`, 55, 116);
      doc.text(`Phone: ${s.phone || 'N/A'}`, 55, 130);
      doc.text(`Registered: ${new Date(s.createdAt).toLocaleDateString()}`, 55, 142);

      doc.text(`College / Org: ${s.collegeOrCompany || 'N/A'}`, 240, 116);
      doc.text(`Source: ${s.whereDidYouFindUs || 'Direct / Search'}`, 240, 130);
      const enrolledNames = courseGroups.map((g) => g.courseName).join(', ');
      doc.text(`Active Courses: ${enrolledNames}`, 240, 142);

      let y = 160;

      // Render Each Course in its own dedicated, separated report block
      courseGroups.forEach((cGrp, courseIndex) => {
        // If not the very first course, start on a fresh page for clean professional separation
        if (courseIndex > 0) {
          doc.addPage();
          drawReportHeader(cGrp.courseName);
          y = 80;
        }

        const crsAttempts = cGrp.attempts;
        const crsMetrics = computeTelemetryMetrics(crsAttempts);
        const crsMistakes = crsAttempts.filter((a) => !a.isCorrect);

        // Course Purchase / Unlock details
        const crsPurchase = studentPurchases.find((p) => {
          const pNorm = (p.courseId || p.courseName || '').toLowerCase().replace(/[\s_-]+/g, '');
          const cNorm = cGrp.courseId.toLowerCase().replace(/[\s_-]+/g, '');
          return pNorm.includes(cNorm) || cNorm.includes(pNorm);
        });
        const purchaseTime = crsPurchase ? new Date(crsPurchase.purchasedAt).getTime() : Infinity;

        // Course Certificate
        const crsCert = studentCertificates.find((cert) => {
          const certNorm = (cert.courseId || cert.courseTitle || '').toLowerCase().replace(/[\s_-]+/g, '');
          const cNorm = cGrp.courseId.toLowerCase().replace(/[\s_-]+/g, '');
          return certNorm.includes(cNorm) || cNorm.includes(certNorm);
        });

        // 1. Course Heading Banner (Clean, Professional Indigo Header)
        if (y > pageHeight - 120) {
          doc.addPage();
          drawReportHeader(cGrp.courseName);
          y = 80;
        }

        doc.setFillColor(30, 41, 59);
        doc.rect(40, y, pageWidth - 80, 26, 'F');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.5);
        doc.setTextColor(0, 255, 157);
        doc.text(cGrp.courseName.toUpperCase(), 50, y + 17);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(226, 232, 240);
        const enrolledTag = crsPurchase ? `Purchased & Unlocked` : `Free Trial`;
        doc.text(`Status: ${enrolledTag}  •  ${crsAttempts.length} Recorded Attempts`, pageWidth - 50, y + 17, { align: 'right' });
        y += 34;

        // 2. Course-wise Statistics (6 Metric Tiles)
        const tileWidth = (pageWidth - 80 - 25) / 6;
        const drawCrsTile = (xPos: number, val: string, label: string, bg: [number, number, number], txtColor: [number, number, number]) => {
          doc.setFillColor(bg[0], bg[1], bg[2]);
          doc.rect(xPos, y, tileWidth, 42, 'F');
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10.5);
          doc.setTextColor(txtColor[0], txtColor[1], txtColor[2]);
          doc.text(val, xPos + 6, y + 19);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(6.2);
          doc.setTextColor(100, 116, 139);
          doc.text(label, xPos + 6, y + 33);
        };

        const crsPassCount = crsAttempts.filter((a) => a.isCorrect).length;
        const crsPoints = crsAttempts.length > 0 ? crsPassCount : s.points;

        drawCrsTile(40, `${crsPoints} pts`, "COURSE POINTS", [240, 253, 244], [22, 101, 52]);
        drawCrsTile(40 + (tileWidth + 5), `${crsAttempts.length}`, "TESTS ATTEMPTED", [241, 245, 249], [30, 41, 59]);
        drawCrsTile(40 + (tileWidth + 5) * 2, `${crsPassCount}`, "TASKS PASSED", [236, 253, 245], [5, 150, 105]);
        drawCrsTile(40 + (tileWidth + 5) * 3, `${crsMistakes.length}`, "MISTAKES", [254, 242, 242], [225, 29, 72]);
        drawCrsTile(40 + (tileWidth + 5) * 4, `${crsMetrics.avgTime > 0 ? Number(crsMetrics.avgTime.toFixed(1)) : 0}s`, "AVG RESPONSE", [238, 242, 255], [79, 70, 229]);
        drawCrsTile(40 + (tileWidth + 5) * 5, `${crsMetrics.fastCount} / ${crsMetrics.slowCount}`, "FAST / SLOW", [248, 250, 252], [15, 23, 42]);
        y += 48;

        // 3. Certificate Status Box (Only display if student has genuinely claimed the certificate)
        if (crsCert) {
          doc.setFillColor(240, 253, 244);
          doc.setDrawColor(187, 247, 208);
          doc.rect(40, y, pageWidth - 80, 22, 'FD');
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(22, 101, 52);
          doc.text(`[VERIFIED CERTIFIED] ${crsCert.courseTitle} Certificate (ID: ${crsCert.certificateId}) claimed on ${crsCert.issueDate}`, 50, y + 14);
          y += 28;
        }

        // 4. Learning History: Question, Time & Answers (Free Trial & Purchased Stages)
        const trialAttempts = crsAttempts.filter((a) => new Date(a.attemptedAt).getTime() < purchaseTime);
        const purchasedAttempts = crsAttempts.filter((a) => new Date(a.attemptedAt).getTime() >= purchaseTime);

        interface PDFStageSegment {
          stage: 'free_trial' | 'purchased_course';
          label: string;
          purchaseInfo?: typeof crsPurchase;
          attempts: StudentQuestionAttempt[];
        }

        const stages: PDFStageSegment[] = [];
        if (trialAttempts.length > 0) {
          stages.push({
            stage: 'free_trial',
            label: 'Free Trial Activity',
            attempts: trialAttempts
          });
        }
        if (crsPurchase && purchasedAttempts.length > 0) {
          stages.push({
            stage: 'purchased_course',
            label: `Purchased Course: ${crsPurchase.courseName || cGrp.courseName}`,
            purchaseInfo: crsPurchase,
            attempts: purchasedAttempts
          });
        }
        if (stages.length === 0) {
          stages.push({
            stage: 'free_trial',
            label: 'Course Learning Activity',
            attempts: crsAttempts
          });
        }

        // Section Title: Question, Time & Answers
        if (y > pageHeight - 80) {
          doc.addPage();
          y = 40;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(15, 23, 42);
        doc.text("Question, Time & Answers (Chronological Journey)", 40, y);
        y += 14;

        const drawAttemptTableHeader = (yPos: number) => {
          doc.setFillColor(241, 245, 249);
          doc.rect(40, yPos, pageWidth - 80, 18, 'F');
          doc.setDrawColor(203, 213, 225);
          doc.line(40, yPos + 18, pageWidth - 40, yPos + 18);

          doc.setFont("helvetica", "bold");
          doc.setFontSize(7);
          doc.setTextColor(30, 41, 59);

          doc.text("QUESTION / PART HIERARCHY", 46, yPos + 12);
          doc.text("CONCEPT TITLE", 185, yPos + 12);
          doc.text("ATTEMPT", 325, yPos + 12);
          doc.text("TIME TAKEN", 375, yPos + 12);
          doc.text("ANSWER", 445, yPos + 12);
          doc.text("RESULT", 500, yPos + 12);
          return yPos + 18;
        };

        if (crsAttempts.length === 0) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(100, 116, 139);
          doc.text("No question attempts recorded yet for this course.", 48, y + 14);
          y += 24;
        } else {
          stages.forEach((stg) => {
            // Stage heading (Free trial vs Course Purchase banner)
            if (y > pageHeight - 60) {
              doc.addPage();
              y = 40;
            }

            if (stg.stage === 'purchased_course') {
              doc.setFillColor(236, 253, 245);
              doc.setDrawColor(167, 243, 208);
              doc.rect(40, y, pageWidth - 80, 18, 'FD');
              doc.setFont("helvetica", "bold");
              doc.setFontSize(7.5);
              doc.setTextColor(6, 95, 70);
              const pDate = stg.purchaseInfo ? new Date(stg.purchaseInfo.purchasedAt).toLocaleDateString() : '';
              doc.text(`COURSE PURCHASED & UNLOCKED - ${stg.label} ${pDate ? `(Enrolled: ${pDate})` : ''}`, 48, y + 12);
            } else {
              doc.setFillColor(248, 250, 252);
              doc.setDrawColor(226, 232, 240);
              doc.rect(40, y, pageWidth - 80, 18, 'FD');
              doc.setFont("helvetica", "bold");
              doc.setFontSize(7.5);
              doc.setTextColor(30, 41, 59);
              doc.text(`FREE TRIAL ACTIVITY (${stg.attempts.length} attempts)`, 48, y + 12);
            }
            y += 22;

            y = drawAttemptTableHeader(y);

            stg.attempts.forEach((att, aIdx) => {
              if (y > pageHeight - 45) {
                doc.addPage();
                y = 40;
                y = drawAttemptTableHeader(y);
              }

              if (aIdx % 2 === 1) {
                doc.setFillColor(248, 250, 252);
                doc.rect(40, y, pageWidth - 80, 20, 'F');
              }
              doc.setDrawColor(226, 232, 240);
              doc.line(40, y + 20, pageWidth - 40, y + 20);

              // Hierarchy
              doc.setFont("helvetica", "bold");
              doc.setFontSize(6.5);
              doc.setTextColor(14, 116, 144);
              const rawLabel = att.subQuestionLabel || `Part ${att.partNum} -> Q${att.questionNumber}`;
              const labelText = rawLabel.replace(/\s*(?:->|–|—|>)\s*/g, ' - ');
              doc.text(String(labelText).slice(0, 32), 46, y + 13);

              // Title
              doc.setFont("helvetica", "normal");
              doc.setFontSize(7);
              doc.setTextColor(15, 23, 42);
              doc.text(att.questionTitle.slice(0, 28), 185, y + 13);

              // Attempt (Clearly marks Retests)
              doc.setFont("helvetica", "normal");
              doc.setFontSize(6.5);
              const isRetest = Boolean(att.isRetest || (att.attemptNumber && att.attemptNumber > 1));
              if (isRetest) {
                doc.setTextColor(180, 83, 9);
                doc.text(`Retest (${att.attemptNumber || 2})`, 325, y + 13);
              } else {
                doc.setTextColor(100, 116, 139);
                doc.text("Attempt 1", 325, y + 13);
              }

              // Exact Sub-Second Time Taken
              doc.setFont("helvetica", "normal");
              doc.setFontSize(7);
              if (att.timeTakenSeconds <= 0) {
                doc.setTextColor(148, 163, 184);
                doc.text("—", 375, y + 13);
              } else {
                const timeStr = `${Number(att.timeTakenSeconds.toFixed(1))}s`;
                if (att.timeTakenSeconds < 12) {
                  doc.setTextColor(5, 150, 105);
                  doc.text(`${timeStr} (Fast)`, 375, y + 13);
                } else if (att.timeTakenSeconds <= 20) {
                  doc.setTextColor(30, 41, 59);
                  doc.text(`${timeStr} (Normal)`, 375, y + 13);
                } else {
                  doc.setTextColor(190, 18, 60);
                  doc.text(`${timeStr} (Slow)`, 375, y + 13);
                }
              }

              // Student Answer
              doc.setFont("helvetica", "bold");
              doc.setFontSize(7);
              doc.setTextColor(att.isCorrect ? 5 : 190, att.isCorrect ? 150 : 18, att.isCorrect ? 105 : 60);
              doc.text(`Opt ${att.studentOptionId || 'A'}`, 445, y + 13);

              // Result
              doc.setFont("helvetica", "bold");
              doc.setFontSize(7);
              if (att.isCorrect) {
                doc.setTextColor(5, 150, 105);
                doc.text("PASSED", 500, y + 13);
              } else if (att.status === 'timeout') {
                doc.setTextColor(180, 83, 9);
                doc.text("TIMEOUT", 500, y + 13);
              } else {
                doc.setTextColor(190, 18, 60);
                doc.text("FAILED", 500, y + 13);
              }

              y += 20;
            });
            y += 8;
          });
        }

        // 5. Course Mistake Log (Directly follows course questions)
        y += 14;
        if (y > pageHeight - 70) {
          doc.addPage();
          y = 40;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(15, 23, 42);
        doc.text(`${cGrp.courseName} - Mistake Log (${crsMistakes.length} Recorded)`, 40, y);
        y += 16;

        if (crsMistakes.length === 0) {
          doc.setFillColor(240, 253, 244);
          doc.setDrawColor(187, 247, 208);
          doc.rect(40, y, pageWidth - 80, 22, 'FD');
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(22, 101, 52);
          doc.text("Clean record! No wrong answers or mistakes recorded in this course.", 48, y + 14);
          y += 30;
        } else {
          // Group mistakes by Part and Section
          interface CourseMistakeSection {
            sectionLabel: string;
            mistakes: StudentQuestionAttempt[];
          }
          interface CourseMistakePart {
            partNum: number;
            sections: CourseMistakeSection[];
          }

          const mistakePartGroups: CourseMistakePart[] = [];
          crsMistakes.forEach((m) => {
            const pNum = m.partNum || 1;
            const secLbl = (m.section || 'General').replace(/^Part\s*\d+\s*[–—\-:]*\s*/i, '').trim() || 'General';

            let pGrp = mistakePartGroups.find((p) => p.partNum === pNum);
            if (!pGrp) {
              pGrp = { partNum: pNum, sections: [] };
              mistakePartGroups.push(pGrp);
            }

            let sGrp = pGrp.sections.find((s) => s.sectionLabel === secLbl);
            if (!sGrp) {
              sGrp = { sectionLabel: secLbl, mistakes: [] };
              pGrp.sections.push(sGrp);
            }
            sGrp.mistakes.push(m);
          });

          mistakePartGroups.sort((a, b) => a.partNum - b.partNum);

          mistakePartGroups.forEach((pGrp) => {
            if (y > pageHeight - 65) {
              doc.addPage();
              y = 40;
            }

            doc.setFillColor(241, 245, 249);
            doc.rect(40, y, pageWidth - 80, 18, 'F');
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(15, 23, 42);
            doc.text(`PART ${pGrp.partNum} MISTAKES`, 48, y + 12);
            y += 24;

            pGrp.sections.forEach((sGrp) => {
              if (y > pageHeight - 55) {
                doc.addPage();
                y = 40;
              }

              doc.setFont("helvetica", "bold");
              doc.setFontSize(7.5);
              doc.setTextColor(14, 116, 144);
              doc.text(`Section: ${sGrp.sectionLabel} (${sGrp.mistakes.length} ${sGrp.mistakes.length === 1 ? 'mistake' : 'mistakes'})`, 44, y);
              y += 12;

              sGrp.mistakes.forEach((w) => {
                doc.setFont("helvetica", "normal");
                doc.setFontSize(7.5);

                const promptText = w.questionPrompt || w.questionTitle || `Question ${w.questionNumber}`;
                const promptLines = doc.splitTextToSize(promptText, pageWidth - 105);

                const wrongLines = doc.splitTextToSize(
                  `Student's Answer: Option ${w.studentOptionId || '?'}: ${w.studentAnswer || 'Incorrect Answer'}`,
                  pageWidth - 105
                );
                const correctLine = `Correct Option: Option ${w.correctOptionId || 'A'}`;

                const promptBlockHeight = promptLines.length * 9;
                const wrongBlockHeight = wrongLines.length * 9;
                const cardHeight = 22 + promptBlockHeight + 6 + wrongBlockHeight + 14 + 6;

                if (y + cardHeight > pageHeight - 40) {
                  doc.addPage();
                  y = 40;
                }

                // Card Background (Clean soft rose/slate)
                doc.setFillColor(255, 241, 242);
                doc.setDrawColor(254, 205, 211);
                doc.rect(40, y, pageWidth - 80, cardHeight, 'FD');

                // Header line: Question number + timing + retest
                doc.setFont("helvetica", "bold");
                doc.setFontSize(7.5);
                doc.setTextColor(190, 18, 60);
                const retestTag = w.isRetest ? ` [Retest Attempt ${w.attemptsCount || 2}]` : '';
                const timeTag = w.timeTakenSeconds > 0 ? ` • Answering Time: ${Number(w.timeTakenSeconds.toFixed(1))}s` : '';
                doc.text(`Question ${w.questionNumber}: ${w.questionTitle}${retestTag}${timeTag}`, 48, y + 12);

                let curY = y + 22;

                // Prompt Text
                doc.setFont("helvetica", "normal");
                doc.setFontSize(7);
                doc.setTextColor(30, 41, 59);
                doc.text(promptLines, 48, curY);
                curY += promptBlockHeight + 6;

                // Wrong Answer Text
                doc.setFont("helvetica", "bold");
                doc.setFontSize(7);
                doc.setTextColor(225, 29, 72);
                doc.text(wrongLines, 48, curY);
                curY += wrongBlockHeight + 6;

                // Correct Option
                doc.setFont("helvetica", "bold");
                doc.setFontSize(7);
                doc.setTextColor(5, 150, 105);
                doc.text(correctLine, 48, curY);

                y += cardHeight + 8;
              });
              y += 6;
            });
          });
        }

        // 6. Section Mastery for this Course
        const fullCurriculum = getCourseCurriculumQuestions(cGrp.courseId);
        const partQuestionMap = new Map<number, {
          partNum: number;
          partTitle: string;
          totalQuestions: number;
          answeredCount: number;
          passedCount: number;
          failedCount: number;
          sections: Map<string, {
            sectionId: string;
            sectionTitle: string;
            totalQuestions: number;
            answeredCount: number;
            passedCount: number;
          }>;
        }>();

        fullCurriculum.forEach((q) => {
          if (!partQuestionMap.has(q.partNum)) {
            partQuestionMap.set(q.partNum, {
              partNum: q.partNum,
              partTitle: `Part ${q.partNum}`,
              totalQuestions: 0,
              answeredCount: 0,
              passedCount: 0,
              failedCount: 0,
              sections: new Map()
            });
          }
          const partObj = partQuestionMap.get(q.partNum)!;
          partObj.totalQuestions += 1;

          if (!partObj.sections.has(q.sectionId)) {
            partObj.sections.set(q.sectionId, {
              sectionId: q.sectionId,
              sectionTitle: q.sectionTitle || `Section ${q.partNum}.${partObj.sections.size + 1}`,
              totalQuestions: 0,
              answeredCount: 0,
              passedCount: 0
            });
          }
          const secObj = partObj.sections.get(q.sectionId)!;
          secObj.totalQuestions += 1;
        });

        const answeredQuestionKeys = new Set<string>();
        crsAttempts.forEach((att) => {
          const qKey = `${att.partNum}-${att.questionNumber}`;
          if (!answeredQuestionKeys.has(qKey)) {
            answeredQuestionKeys.add(qKey);
            const partObj = partQuestionMap.get(att.partNum);
            if (partObj) {
              partObj.answeredCount += 1;
              if (att.isCorrect) partObj.passedCount += 1;
              else partObj.failedCount += 1;

              for (const secObj of partObj.sections.values()) {
                if (
                  att.section.toLowerCase().includes(secObj.sectionTitle.toLowerCase()) ||
                  att.section.toLowerCase().includes(secObj.sectionId.toLowerCase()) ||
                  (att.subQuestionLabel && att.subQuestionLabel.toLowerCase().includes(secObj.sectionTitle.toLowerCase()))
                ) {
                  secObj.answeredCount += 1;
                  if (att.isCorrect) secObj.passedCount += 1;
                  break;
                }
              }
            }
          }
        });

        const dynamicPartProgress = Array.from(partQuestionMap.values())
          .filter((p) => p.totalQuestions > 0)
          .sort((a, b) => a.partNum - b.partNum)
          .filter((p, idx, arr) => {
            if (p.answeredCount > 0 || p.partNum === 1) return true;
            const prevPart = arr[idx - 1];
            return prevPart && prevPart.answeredCount > 0;
          })
          .map((p) => {
            let status: 'passed' | 'failed' | 'in_progress' | 'not_started' = 'not_started';
            if (p.answeredCount >= p.totalQuestions && p.failedCount === 0) {
              status = 'passed';
            } else if (p.answeredCount > 0) {
              status = p.failedCount > 0 ? 'failed' : 'in_progress';
            }
            return {
              ...p,
              status,
              sectionList: Array.from(p.sections.values())
            };
          });

        y += 14;
        if (y > pageHeight - 75) {
          doc.addPage();
          y = 40;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(15, 23, 42);
        doc.text(`${cGrp.courseName} - Section Mastery Breakdown`, 40, y);
        y += 14;

        doc.setFillColor(241, 245, 249);
        doc.rect(40, y, pageWidth - 80, 16, 'F');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(30, 41, 59);
        doc.text("CURRICULUM PART & SECTION", 48, y + 11);
        doc.text("QUESTIONS ANSWERED", 340, y + 11);
        doc.text("COMPLETION STATUS", 460, y + 11);
        y += 18;

        if (dynamicPartProgress.length === 0) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(100, 116, 139);
          doc.text("No curriculum mastery data recorded yet for this course.", 48, y + 12);
          y += 20;
        } else {
          dynamicPartProgress.forEach((part, pIdx) => {
            if (y > pageHeight - 45) {
              doc.addPage();
              y = 40;
            }
            if (pIdx % 2 === 1) {
              doc.setFillColor(248, 250, 252);
              doc.rect(40, y - 8, pageWidth - 80, 16, 'F');
            }
            doc.setFont("helvetica", "bold");
            doc.setFontSize(7.5);
            doc.setTextColor(15, 23, 42);
            const partPct = part.totalQuestions > 0 ? Math.round((part.answeredCount / part.totalQuestions) * 100) : 0;
            doc.text(`Part ${part.partNum}`, 48, y + 3);

            doc.setFont("helvetica", "normal");
            doc.setTextColor(51, 65, 85);
            doc.text(`${part.answeredCount} / ${part.totalQuestions} questions (${partPct}%)`, 340, y + 3);

            doc.setFont("helvetica", "bold");
            if (part.status === 'passed') {
              doc.setTextColor(5, 150, 105);
              doc.text("COMPLETED", 460, y + 3);
            } else if (part.status === 'in_progress') {
              doc.setTextColor(14, 116, 144);
              doc.text("IN PROGRESS", 460, y + 3);
            } else {
              doc.setTextColor(225, 29, 72);
              doc.text("FAILED", 460, y + 3);
            }
            y += 16;

            if (part.sectionList && part.sectionList.length > 0) {
              part.sectionList.forEach((sec) => {
                if (y > pageHeight - 40) {
                  doc.addPage();
                  y = 40;
                }
                const secPct = sec.totalQuestions > 0 ? Math.round((sec.answeredCount / sec.totalQuestions) * 100) : 0;
                doc.setFont("helvetica", "normal");
                doc.setFontSize(7);
                doc.setTextColor(100, 116, 139);
                doc.text(`  • ${sec.sectionTitle}`, 56, y + 2);
                doc.text(`${sec.answeredCount} / ${sec.totalQuestions} (${secPct}%)`, 340, y + 2);
                const secDone = sec.answeredCount >= sec.totalQuestions && sec.totalQuestions > 0;
                doc.text(secDone ? "Completed" : sec.answeredCount > 0 ? "In Progress" : "Pending", 460, y + 2);
                y += 13;
              });
              y += 4;
            }
          });
        }
        y += 16;
      });

      // Page numbering footer across all pages
      const totalPages = doc.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setDrawColor(226, 232, 240);
        doc.line(40, pageHeight - 32, pageWidth - 40, pageHeight - 32);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.text("DO PILOT - Student Performance & Question Telemetry Report - Confidential", 40, pageHeight - 19);
        doc.text(`Page ${p} of ${totalPages}`, pageWidth - 40, pageHeight - 19, { align: 'right' });
      }

      doc.save(`DO_PILOT_${s.name.replace(/\s+/g, '_')}_Progress_Report.pdf`);
      showToast(`Downloaded detailed performance report for ${s.name}!`);
    } catch (e) {
      console.error("Failed to generate student report:", e);
      showToast("Error generating report PDF.");
    }
  };

  // Render Full-Screen Fixed Modal for Student Inspection (Root Level)
  const renderStudentInspectModal = () => {
    if (!selectedStudentForReport) return null;

    const student = selectedStudentForReport;
    const allAttempts = getStudentQuestionTelemetry(student, 'all');
    const attempts = inspectCourseFilter === 'all'
      ? allAttempts
      : allAttempts.filter((a) => a.courseId === inspectCourseFilter);
    const metrics = computeTelemetryMetrics(attempts);

    // Compute actual mistake records from student attempts
    const actualMistakes = attempts.filter((att) => !att.isCorrect);

    // Compute dynamic Section Mastery across curriculum parts & sections
    // Group mastery by course for multi-course support
    const targetCoursesForMastery = inspectCourseFilter !== 'all'
      ? ALL_INSPECT_COURSES.filter((c) => c.id === inspectCourseFilter)
      : ALL_INSPECT_COURSES;

    interface CoursePartMastery {
      courseId: string;
      courseName: string;
      parts: {
        partNum: number;
        partTitle: string;
        totalQuestions: number;
        answeredCount: number;
        passedCount: number;
        failedCount: number;
        status: 'passed' | 'failed' | 'in_progress' | 'not_started';
        sectionList: {
          sectionId: string;
          sectionTitle: string;
          totalQuestions: number;
          answeredCount: number;
          passedCount: number;
        }[];
      }[];
    }

    const courseMasteryList: CoursePartMastery[] = [];

    targetCoursesForMastery.forEach((crs) => {
      const fullCurriculum = getCourseCurriculumQuestions(crs.id);
      const courseAttempts = allAttempts.filter((a) => a.courseId === crs.id);

      const partQuestionMap = new Map<number, {
        partNum: number;
        partTitle: string;
        totalQuestions: number;
        answeredCount: number;
        passedCount: number;
        failedCount: number;
        sections: Map<string, {
          sectionId: string;
          sectionTitle: string;
          totalQuestions: number;
          answeredCount: number;
          passedCount: number;
        }>;
      }>();

      fullCurriculum.forEach((q) => {
        if (!partQuestionMap.has(q.partNum)) {
          partQuestionMap.set(q.partNum, {
            partNum: q.partNum,
            partTitle: `Part ${q.partNum}`,
            totalQuestions: 0,
            answeredCount: 0,
            passedCount: 0,
            failedCount: 0,
            sections: new Map()
          });
        }
        const partObj = partQuestionMap.get(q.partNum)!;
        partObj.totalQuestions += 1;

        if (!partObj.sections.has(q.sectionId)) {
          partObj.sections.set(q.sectionId, {
            sectionId: q.sectionId,
            sectionTitle: q.sectionTitle || `Section ${q.partNum}.${partObj.sections.size + 1}`,
            totalQuestions: 0,
            answeredCount: 0,
            passedCount: 0
          });
        }
        const secObj = partObj.sections.get(q.sectionId)!;
        secObj.totalQuestions += 1;
      });

      const answeredQuestionKeys = new Set<string>();
      courseAttempts.forEach((att) => {
        const qKey = `${att.partNum}-${att.questionNumber}`;
        if (!answeredQuestionKeys.has(qKey)) {
          answeredQuestionKeys.add(qKey);
          const partObj = partQuestionMap.get(att.partNum);
          if (partObj) {
            partObj.answeredCount += 1;
            if (att.isCorrect) {
              partObj.passedCount += 1;
            } else {
              partObj.failedCount += 1;
            }

            for (const secObj of partObj.sections.values()) {
              if (
                att.section.toLowerCase().includes(secObj.sectionTitle.toLowerCase()) ||
                att.section.toLowerCase().includes(secObj.sectionId.toLowerCase()) ||
                (att.subQuestionLabel && att.subQuestionLabel.toLowerCase().includes(secObj.sectionTitle.toLowerCase()))
              ) {
                secObj.answeredCount += 1;
                if (att.isCorrect) secObj.passedCount += 1;
                break;
              }
            }
          }
        }
      });

      const parts = Array.from(partQuestionMap.values())
        .filter((p) => p.totalQuestions > 0)
        .sort((a, b) => a.partNum - b.partNum)
        .filter((p, idx, arr) => {
          if (p.answeredCount > 0 || p.partNum === 1) return true;
          const prevPart = arr[idx - 1];
          return prevPart && prevPart.answeredCount > 0;
        })
        .map((p) => {
          let status: 'passed' | 'failed' | 'in_progress' | 'not_started' = 'not_started';
          if (p.answeredCount >= p.totalQuestions && p.failedCount === 0) {
            status = 'passed';
          } else if (p.answeredCount > 0) {
            status = p.failedCount > 0 ? 'failed' : 'in_progress';
          }
          return {
            ...p,
            status,
            sectionList: Array.from(p.sections.values())
          };
        });

      // Include this course ONLY if it has genuine student activity (answered questions or attempts)
      const hasCourseActivity = courseAttempts.length > 0;

      if (hasCourseActivity || (inspectCourseFilter === crs.id && inspectCourseFilter !== 'all')) {
        courseMasteryList.push({
          courseId: crs.id,
          courseName: crs.name,
          parts
        });
      }
    });

    // Fallback combined dynamicPartProgress for top summary KPI pill
    const dynamicPartProgress = courseMasteryList.flatMap((cm) => cm.parts);

    // Match student purchases for chronological workflow segmentation and purchase filtering
    const sEmail = (student.email || '').toLowerCase().trim();
    const sId = (student.id || '').trim();
    const studentPurchases = coursePurchases
      .filter((p) => {
        const pe = (p.studentEmail || '').toLowerCase().trim();
        const pi = (p.studentId || '').trim();
        const match = (sEmail && pe === sEmail) || (sId && pi === sId);
        return match && (p.status === 'completed' || p.accessGranted);
      })
      .sort((a, b) => new Date(a.purchasedAt).getTime() - new Date(b.purchasedAt).getTime());

    const firstPurchase = studentPurchases.length > 0 ? studentPurchases[0] : null;
    const purchaseTime = firstPurchase ? new Date(firstPurchase.purchasedAt).getTime() : Infinity;

    // Filter attempts for Question, Time & Answers
    const filteredAttempts = attempts.filter((att) => {
      // Find course-specific purchase time if available, otherwise fallback to first purchase
      const cId = att.courseId || 'python-core';
      const cPurchase = studentPurchases.find((p) => {
        const pNorm = (p.courseId || p.courseName || '').toLowerCase().replace(/[\s_-]+/g, '');
        const cNorm = cId.toLowerCase().replace(/[\s_-]+/g, '');
        return pNorm.includes(cNorm) || cNorm.includes(pNorm);
      }) || firstPurchase;
      const attPurchaseTime = cPurchase ? new Date(cPurchase.purchasedAt).getTime() : Infinity;

      // Activity Type filter: All | Purchased Course Only | Free Trial Only
      if (telemetryActivityType === 'purchased') {
        if (new Date(att.attemptedAt).getTime() < attPurchaseTime) return false;
      } else if (telemetryActivityType === 'trial') {
        if (new Date(att.attemptedAt).getTime() >= attPurchaseTime) return false;
      }

      // Performance / Pacing filters
      if (telemetryFilter === 'correct' && !att.isCorrect) return false;
      if (telemetryFilter === 'wrong' && att.isCorrect) return false;
      if (telemetryFilter === 'fast' && (att.speedCategory !== 'fast' || att.timeTakenSeconds <= 0)) return false;
      if (telemetryFilter === 'normal' && (att.speedCategory !== 'normal' || att.timeTakenSeconds <= 0)) return false;
      if (telemetryFilter === 'slow' && ((att.speedCategory !== 'slow' && att.speedCategory !== 'timeout') || att.timeTakenSeconds <= 0)) return false;
      if (telemetrySearch.trim()) {
        const q = telemetrySearch.toLowerCase();
        return (
          att.questionTitle.toLowerCase().includes(q) ||
          att.questionPrompt.toLowerCase().includes(q) ||
          att.section.toLowerCase().includes(q) ||
          att.studentAnswer.toLowerCase().includes(q) ||
          (att.subQuestionLabel && att.subQuestionLabel.toLowerCase().includes(q))
        );
      }
      return true;
    });

    // Filter actual mistakes for Mistake Log
    const filteredMistakes = actualMistakes.filter((m) => {
      // Find course-specific purchase time if available, otherwise fallback to first purchase
      const cId = m.courseId || 'python-core';
      const cPurchase = studentPurchases.find((p) => {
        const pNorm = (p.courseId || p.courseName || '').toLowerCase().replace(/[\s_-]+/g, '');
        const cNorm = cId.toLowerCase().replace(/[\s_-]+/g, '');
        return pNorm.includes(cNorm) || cNorm.includes(pNorm);
      }) || firstPurchase;
      const mPurchaseTime = cPurchase ? new Date(cPurchase.purchasedAt).getTime() : Infinity;

      // Activity Type filter: All | Purchased Course Only | Free Trial Only
      if (mistakeActivityType === 'purchased') {
        if (new Date(m.attemptedAt).getTime() < mPurchaseTime) return false;
      } else if (mistakeActivityType === 'trial') {
        if (new Date(m.attemptedAt).getTime() >= mPurchaseTime) return false;
      }

      // Performance / Pacing filters
      if (mistakeFilter === 'wrong' && m.isCorrect) return false;
      if (mistakeFilter === 'fast' && (m.speedCategory !== 'fast' || m.timeTakenSeconds <= 0)) return false;
      if (mistakeFilter === 'normal' && (m.speedCategory !== 'normal' || m.timeTakenSeconds <= 0)) return false;
      if (mistakeFilter === 'slow' && ((m.speedCategory !== 'slow' && m.speedCategory !== 'timeout') || m.timeTakenSeconds <= 0)) return false;
      if (mistakeSearch.trim()) {
        const q = mistakeSearch.toLowerCase();
        return (
          m.questionTitle.toLowerCase().includes(q) ||
          m.questionPrompt.toLowerCase().includes(q) ||
          m.section.toLowerCase().includes(q) ||
          m.studentAnswer.toLowerCase().includes(q) ||
          (m.subQuestionLabel && m.subQuestionLabel.toLowerCase().includes(q))
        );
      }
      return true;
    });

    return (
      <div 
        data-no-reveal="true" 
        className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden"
      >
        <div className="w-full max-w-[1550px] h-[92vh] rounded-3xl bg-[#0a0b0d] border border-white/15 shadow-2xl flex flex-col relative overflow-hidden transform-none">
          
          {/* Modal Top Header (Fixed) */}
          <div className="px-6 py-4 border-b border-white/10 bg-[#0f1013]/95 backdrop-blur-md flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border-2 border-primary text-primary flex items-center justify-center font-jakarta font-black text-lg tracking-wider shrink-0 shadow-lg shadow-primary/20">
                {getUserInitials(student.name)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-jakarta font-black text-lg text-paper truncate">
                    {student.name}
                  </h3>
                  {student.hasCertificate && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-mono text-[10px] font-bold flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-400" />
                      <span>Verified Certified</span>
                    </span>
                  )}
                  <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase ${
                    student.courseProgressStatus === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : student.courseProgressStatus === 'in_progress'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-white/10 text-slate border border-white/10'
                  }`}>
                    {student.courseProgressStatus.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate mt-0.5">
                  <span className="font-mono text-slate/80">{student.email}</span>
                  {student.phone && (
                    <>
                      <span className="text-white/20">•</span>
                      <span className="font-mono text-paper flex items-center gap-1">
                        <Phone className="w-3 h-3 text-primary" />
                        {student.phone}
                      </span>
                    </>
                  )}
                  {student.collegeOrCompany && (
                    <>
                      <span className="text-white/20">•</span>
                      <span className="text-slate flex items-center gap-1 truncate">
                        <GraduationCap className="w-3 h-3 text-slate/60" />
                        {student.collegeOrCompany}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => exportIndividualStudentPDF(student)}
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

          {/* Modal Navigation Tabs */}
          <div className="px-6 py-2.5 border-b border-white/10 bg-[#0d0e11] flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setInspectTab('telemetry')}
                className={`px-3 py-1.5 rounded-xl font-jakarta text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  inspectTab === 'telemetry'
                    ? 'bg-primary text-ink shadow-md shadow-primary/20'
                    : 'bg-white/5 text-slate hover:text-paper hover:bg-white/10'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Question Time &amp; Answers</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                  inspectTab === 'telemetry' ? 'bg-black/20 text-ink' : 'bg-white/10 text-slate/80'
                }`}>
                  {attempts.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setInspectTab('mistakes')}
                className={`px-3 py-1.5 rounded-xl font-jakarta text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  inspectTab === 'mistakes'
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                    : 'bg-white/5 text-slate hover:text-paper hover:bg-white/10'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Mistake Log</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                  inspectTab === 'mistakes' ? 'bg-black/20 text-white' : 'bg-white/10 text-slate/80'
                }`}>
                  {actualMistakes.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setInspectTab('mastery')}
                className={`px-3 py-1.5 rounded-xl font-jakarta text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  inspectTab === 'mastery'
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                    : 'bg-white/5 text-slate hover:text-paper hover:bg-white/10'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Section Mastery</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                  inspectTab === 'mastery' ? 'bg-black/20 text-black' : 'bg-white/10 text-slate/80'
                }`}>
                  {dynamicPartProgress.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setInspectTab('profile')}
                className={`px-3 py-1.5 rounded-xl font-jakarta text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  inspectTab === 'profile'
                    ? 'bg-white text-ink shadow-md shadow-white/20'
                    : 'bg-white/5 text-slate hover:text-paper hover:bg-white/10'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Student Profile</span>
              </button>
            </div>

            {/* Quick Speed Summary Pill - Clean, without green border line */}
            <div className="flex items-center gap-3 font-mono text-xs text-slate shrink-0">
              <span className="flex items-center gap-1.5 text-slate/90">
                <Clock className="w-3.5 h-3.5 text-slate/50" />
                <span>Avg Answering Speed: <strong className="text-paper">{metrics.avgTime}s</strong></span>
              </span>
              <span className="text-slate/40">•</span>
              <span className="text-slate/90 font-medium">
                {metrics.accuracyPct}% Accuracy
              </span>
            </div>
          </div>

          {/* Scrollable Modal Content Body */}
          <div 
            data-lenis-prevent 
            className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 overscroll-contain transform-none [contain:paint]"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            
            {/* Top 5 KPI Metric Cards Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <div className="p-4 rounded-2xl bg-[#121316] border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-slate/70 uppercase tracking-wider block">Total Points</span>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="font-jakarta font-black text-xl text-paper">{student.points} pts</span>
                </div>
                <span className="text-[10px] font-mono text-slate/50 block">Earned score</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#121316] border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-slate/70 uppercase tracking-wider block">Tests Attempted</span>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span className="font-jakarta font-black text-xl text-paper">
                    {attempts.length > 0 ? attempts.length : student.testsAttemptedCount}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate/50 block">Total questions</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#121316] border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-slate/70 uppercase tracking-wider block">Tasks Passed</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-jakarta font-black text-xl text-emerald-400">
                    {attempts.length > 0 ? metrics.passed : student.testsPassedCount}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400/80 block">{metrics.accuracyPct}% accuracy</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#121316] border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-slate/70 uppercase tracking-wider block">Mistakes Recorded</span>
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className={`w-4 h-4 ${actualMistakes.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`} />
                  <span className={`font-jakarta font-black text-xl ${actualMistakes.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {actualMistakes.length}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate/50 block">
                  {actualMistakes.length === 0 ? '0 Mistakes (100%)' : 'Wrong answers'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#121316] border border-white/10 space-y-1">
                <span className="text-[10px] font-mono text-slate/70 uppercase tracking-wider block">Avg Time to Answer</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-jakarta font-black text-xl text-primary">{metrics.avgTime}s</span>
                </div>
                <span className="text-[10px] font-mono text-slate/50 block">Per question (30s limit)</span>
              </div>
            </div>

            {/* TAB 1: QUESTION-BY-QUESTION TELEMETRY & EXACT ANSWER TIMES */}
            {inspectTab === 'telemetry' && (
              <div className="space-y-4">
                {/* Search & Filter Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#121316] border border-white/10">
                  <div className="flex items-center gap-2 flex-1 min-w-[220px]">
                    <Search className="w-4 h-4 text-slate/60 shrink-0" />
                    <input
                      type="text"
                      value={telemetrySearch}
                      onChange={(e) => setTelemetrySearch(e.target.value)}
                      placeholder="Search question, concept, or student answer..."
                      className="bg-transparent text-paper placeholder-slate/50 text-xs focus:outline-none w-full font-jakarta"
                    />
                    {telemetrySearch && (
                      <button
                        type="button"
                        onClick={() => setTelemetrySearch('')}
                        className="text-slate hover:text-paper text-xs"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Course Filter Dropdown */}
                    <div className="flex items-center gap-1.5 bg-[#0a0b0d] border border-white/15 px-2.5 py-1 rounded-lg">
                      <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="text-[10px] font-mono text-slate/80 font-bold uppercase">Course:</span>
                      <select
                        value={inspectCourseFilter}
                        onChange={(e) => setInspectCourseFilter(e.target.value)}
                        className="bg-transparent text-paper font-jakarta text-xs font-bold focus:outline-none cursor-pointer pr-1"
                      >
                        <option value="all" className="bg-[#111215] text-paper">
                          All Courses ({allAttempts.length})
                        </option>
                        {ALL_INSPECT_COURSES.map((crs) => {
                          const count = allAttempts.filter((a) => a.courseId === crs.id).length;
                          return (
                            <option key={crs.id} value={crs.id} className="bg-[#111215] text-paper">
                              {crs.name} ({count})
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {/* Activity Type Dropdown: All | Purchased Course Only | Free Trial Only */}
                    <div className="flex items-center gap-1.5 bg-[#0a0b0d] border border-white/15 px-2.5 py-1 rounded-lg">
                      <ShoppingBag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-[10px] font-mono text-slate/80 font-bold uppercase">Activity Type:</span>
                      <select
                        value={telemetryActivityType}
                        onChange={(e) => setTelemetryActivityType(e.target.value as 'all' | 'purchased' | 'trial')}
                        className="bg-transparent text-paper font-jakarta text-xs font-bold focus:outline-none cursor-pointer pr-1"
                      >
                        <option value="all" className="bg-[#111215] text-paper">
                          All
                        </option>
                        <option value="purchased" className="bg-[#111215] text-paper">
                          Purchased Course Only
                        </option>
                        <option value="trial" className="bg-[#111215] text-paper">
                          Free Trial Only
                        </option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => setTelemetryFilter('all')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                        telemetryFilter === 'all'
                          ? 'bg-primary text-ink'
                          : 'bg-white/5 text-slate hover:text-paper'
                      }`}
                    >
                      All ({attempts.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setTelemetryFilter('correct')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                        telemetryFilter === 'correct'
                          ? 'bg-emerald-500 text-black'
                          : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      }`}
                    >
                      ✓ Correct ({metrics.passed})
                    </button>
                    <button
                      type="button"
                      onClick={() => setTelemetryFilter('wrong')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                        telemetryFilter === 'wrong'
                          ? 'bg-rose-500 text-white'
                          : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                      }`}
                    >
                      ✗ Wrong ({metrics.failed + metrics.timeouts})
                    </button>
                    <button
                      type="button"
                      onClick={() => setTelemetryFilter('fast')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                        telemetryFilter === 'fast'
                          ? 'bg-emerald-400 text-black'
                          : 'bg-white/5 text-slate hover:text-paper'
                      }`}
                    >
                      ⚡ &lt;12s ({metrics.fastCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setTelemetryFilter('normal')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                        telemetryFilter === 'normal'
                          ? 'bg-sky-400 text-black'
                          : 'bg-white/5 text-slate hover:text-paper'
                      }`}
                    >
                      ⏱️ 12-20s ({metrics.normalCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setTelemetryFilter('slow')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                        telemetryFilter === 'slow'
                          ? 'bg-amber-400 text-black'
                          : 'bg-white/5 text-slate hover:text-paper'
                      }`}
                    >
                      ⏳ &gt;20s ({metrics.slowCount + metrics.timeouts})
                    </button>
                  </div>
                </div>

                {filteredAttempts.length === 0 ? (
                  <div className="p-12 text-center rounded-3xl bg-[#121316] border border-white/10 space-y-2">
                    <Clock className="w-8 h-8 text-slate/40 mx-auto" />
                    <span className="font-jakarta font-bold text-sm text-paper block">
                      No Questions Found
                    </span>
                    <p className="text-xs text-slate/70 max-w-md mx-auto">
                      {attempts.length === 0
                        ? "This student has not started answering challenges in this course yet. Questions and exact response times will appear here as soon as they start."
                        : "Try clearing your search query or pacing filter above."}
                    </p>
                  </div>
                ) : (
                  (() => {
                    // Match student purchases for chronological workflow segmentation
                    const sEmail = (student.email || '').toLowerCase().trim();
                    const sId = (student.id || '').trim();
                    const studentPurchases = coursePurchases
                      .filter((p) => {
                        const pe = (p.studentEmail || '').toLowerCase().trim();
                        const pi = (p.studentId || '').trim();
                        const match = (sEmail && pe === sEmail) || (sId && pi === sId);
                        return match && (p.status === 'completed' || p.accessGranted);
                      })
                      .sort((a, b) => new Date(a.purchasedAt).getTime() - new Date(b.purchasedAt).getTime());

                    // Group attempts by Course first (Course Headings)
                    const courseGroups: {
                      courseId: string;
                      courseName: string;
                      courseAttempts: StudentQuestionAttempt[];
                    }[] = [];

                    filteredAttempts.forEach((att) => {
                      const cId = att.courseId || 'python-core';
                      const cName = att.courseName || ALL_INSPECT_COURSES.find((c) => c.id === cId)?.name || 'Complete Python Course';
                      let cGrp = courseGroups.find((g) => g.courseId === cId);
                      if (!cGrp) {
                        cGrp = { courseId: cId, courseName: cName, courseAttempts: [] };
                        courseGroups.push(cGrp);
                      }
                      cGrp.courseAttempts.push(att);
                    });

                    return (
                      <div className="space-y-10">
                        {courseGroups.map((cGrp) => {
                          // Find course purchase if any
                          const coursePurchase = studentPurchases.find((p) => {
                            const pNorm = (p.courseId || p.courseName || '').toLowerCase().replace(/[\s_-]+/g, '');
                            const cNorm = cGrp.courseId.toLowerCase().replace(/[\s_-]+/g, '');
                            return pNorm.includes(cNorm) || cNorm.includes(pNorm);
                          }) || studentPurchases[0];

                          const purchaseTime = coursePurchase ? new Date(coursePurchase.purchasedAt).getTime() : Infinity;

                          // Workflow segments: Free Trial vs Purchased Course
                          interface WorkflowSegment {
                            stage: 'free_trial' | 'purchased_course';
                            stageLabel: string;
                            badgeColor: string;
                            purchaseDetails?: typeof coursePurchase;
                            attempts: StudentQuestionAttempt[];
                          }

                          const trialAttempts = cGrp.courseAttempts.filter(
                            (a) => new Date(a.attemptedAt).getTime() < purchaseTime
                          );
                          const purchasedCourseAttempts = cGrp.courseAttempts.filter(
                            (a) => new Date(a.attemptedAt).getTime() >= purchaseTime
                          );

                          const segments: WorkflowSegment[] = [];
                          if (trialAttempts.length > 0) {
                            segments.push({
                              stage: 'free_trial',
                              stageLabel: 'Free Trial Activity',
                              badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
                              attempts: trialAttempts
                            });
                          }
                          if (coursePurchase && purchasedCourseAttempts.length > 0) {
                            segments.push({
                              stage: 'purchased_course',
                              stageLabel: `Purchased Course: ${coursePurchase.courseName || cGrp.courseName}`,
                              badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
                              purchaseDetails: coursePurchase,
                              attempts: purchasedCourseAttempts
                            });
                          }

                          if (segments.length === 0) {
                            segments.push({
                              stage: 'free_trial',
                              stageLabel: 'Course Learning Activity',
                              badgeColor: 'bg-primary/15 text-primary border-primary/30',
                              attempts: cGrp.courseAttempts
                            });
                          }

                          return (
                            <div key={cGrp.courseId} className="space-y-6 p-5 sm:p-6 rounded-3xl bg-[#0d0e11] border border-white/10 shadow-lg">
                              {/* Distinct Course Heading Banner */}
                              <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10 flex-wrap">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-black text-sm">
                                    <BookOpen className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <h3 className="font-jakarta font-black text-base sm:text-lg text-paper tracking-wide">
                                      {cGrp.courseName}
                                    </h3>
                                    <span className="text-[11px] font-mono text-slate/70">
                                      {cGrp.courseAttempts.length} {cGrp.courseAttempts.length === 1 ? 'total question record' : 'total question records'} in this course
                                    </span>
                                  </div>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-bold text-paper">
                                  {cGrp.courseAttempts.filter((a) => a.isCorrect).length} Correct • {cGrp.courseAttempts.filter((a) => !a.isCorrect).length} Wrong
                                </span>
                              </div>

                              <div className="space-y-8">
                                {segments.map((seg, sIdx) => {
                                  // Group segment attempts by Part, then by Section in actual activity sequence
                                  interface SectionGroup {
                                    sectionKey: string;
                                    sectionLabel: string;
                                    attempts: StudentQuestionAttempt[];
                                  }
                                  interface PartGroup {
                                    partNum: number;
                                    partLabel: string;
                                    sections: SectionGroup[];
                                  }

                                  const partGroups: PartGroup[] = [];

                                  seg.attempts.forEach((att) => {
                                    const partNum = att.partNum || 1;
                                    const partLabel = `Part ${partNum}`;

                                    let sectionLabel = `Section ${partNum}.1`;
                                    if (att.subQuestionLabel) {
                                      const secMatch = att.subQuestionLabel.match(/Sec\s+([0-9.]+)/i);
                                      if (secMatch) {
                                        sectionLabel = `Section ${secMatch[1]}`;
                                      } else {
                                        const dotMatch = att.subQuestionLabel.match(/^(\d+\.\d+)/);
                                        if (dotMatch) {
                                          sectionLabel = `Section ${dotMatch[1]}`;
                                        }
                                      }
                                    } else if (att.section) {
                                      const sMatch = att.section.match(/Section\s*([0-9.]+)/i);
                                      if (sMatch) {
                                        sectionLabel = `Section ${sMatch[1]}`;
                                      }
                                    }

                                    let pGroup = partGroups.find((p) => p.partNum === partNum);
                                    if (!pGroup) {
                                      pGroup = {
                                        partNum,
                                        partLabel,
                                        sections: []
                                      };
                                      partGroups.push(pGroup);
                                    }

                                    let sGroup = pGroup.sections.find((s) => s.sectionLabel === sectionLabel);
                                    if (!sGroup) {
                                      sGroup = {
                                        sectionKey: `${partNum}-${sectionLabel}`,
                                        sectionLabel,
                                        attempts: []
                                      };
                                      pGroup.sections.push(sGroup);
                                    }

                                    sGroup.attempts.push(att);
                                  });

                                  return (
                                    <div key={seg.stage + sIdx} className="space-y-5">
                                      {/* Workflow Separator & Heading Banner */}
                                      <div className={`relative transform-none p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
                                        seg.stage === 'purchased_course'
                                          ? 'bg-gradient-to-r from-emerald-500/15 via-[#0e1713] to-transparent border-emerald-500/40 shadow-emerald-500/5'
                                          : 'bg-gradient-to-r from-amber-500/10 via-[#15120c] to-transparent border-amber-500/30'
                                      }`}>
                                        <div className="flex items-center gap-3 min-w-0">
                                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                                            seg.stage === 'purchased_course'
                                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                              : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                          }`}>
                                            {seg.stage === 'purchased_course' ? (
                                              <CheckCircle2 className="w-5 h-5" />
                                            ) : (
                                              <Clock className="w-5 h-5" />
                                            )}
                                          </div>
                                          <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${seg.badgeColor}`}>
                                                {seg.stage === 'purchased_course' ? 'COURSE PURCHASED & UNLOCKED' : 'FREE TRIAL LEARNING'}
                                              </span>
                                              <span className="font-jakarta font-bold text-sm text-paper">
                                                {seg.stageLabel}
                                              </span>
                                            </div>
                                            <span className="text-xs font-mono text-slate/70 block mt-0.5">
                                              {seg.attempts.length} {seg.attempts.length === 1 ? 'question attempt' : 'question attempts'} recorded in this stage
                                            </span>
                                          </div>
                                        </div>

                                        {seg.purchaseDetails && (
                                          <div className="flex items-center gap-2 text-right shrink-0">
                                            <div className="px-3 py-1 rounded-xl bg-black/50 border border-white/10 text-right">
                                              <span className="text-[10px] font-mono text-slate/60 block uppercase">Purchased On</span>
                                              <span className="text-xs font-mono text-emerald-300 font-bold">
                                                {new Date(seg.purchaseDetails.purchasedAt).toLocaleDateString()} at {new Date(seg.purchaseDetails.purchasedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                              </span>
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      {/* Part and Section Hierarchy */}
                                      {partGroups.length === 0 ? (
                                        <div className="p-6 text-center text-xs font-mono text-slate/50 bg-[#121316] rounded-2xl border border-white/5">
                                          No question attempts recorded in this stage yet.
                                        </div>
                                      ) : (
                                        <div className="space-y-6">
                                          {partGroups.map((pGroup) => (
                                            <div key={pGroup.partNum} className="space-y-4">
                                              {/* Main Part Heading */}
                                              <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                                                <span className="font-jakarta text-base sm:text-lg font-black text-paper tracking-wide">
                                                  {pGroup.partLabel}
                                                </span>
                                              </div>

                                              {/* Section Headings & Balanced Full-Width Grid of Question Records */}
                                              <div className="space-y-4 pl-1 sm:pl-2">
                                                {pGroup.sections.map((sGroup) => (
                                                  <div key={sGroup.sectionKey} className="space-y-2.5">
                                                    {/* Section Heading */}
                                                    <div className="flex items-center gap-2">
                                                      <h4 className="font-jakarta text-xs sm:text-sm font-bold text-slate">
                                                        {sGroup.sectionLabel}
                                                      </h4>
                                                      <span className="text-[10px] font-mono text-slate/50">
                                                        ({sGroup.attempts.length} {sGroup.attempts.length === 1 ? 'record' : 'records'})
                                                      </span>
                                                    </div>

                                                    {/* Balanced Professional Multi-Column Grid across full available width */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                                                      {sGroup.attempts.map((att) => {
                                                        let qNum = att.questionNumber || 1;
                                                        if (att.subQuestionLabel) {
                                                          const qMatch = att.subQuestionLabel.match(/Q(\d+)/i);
                                                          if (qMatch) {
                                                            qNum = parseInt(qMatch[1], 10);
                                                          } else {
                                                            const dotMatch = att.subQuestionLabel.match(/\d+\.\d+\.(\d+)/);
                                                            if (dotMatch) {
                                                              qNum = parseInt(dotMatch[1], 10);
                                                            }
                                                          }
                                                        }

                                                        const opt = att.studentOptionId || '—';
                                                        const timeStr = att.timeTakenSeconds > 0 ? `${Number(att.timeTakenSeconds.toFixed(1))}s` : '—';
                                                        const isCorrect = Boolean(att.isCorrect);
                                                        const isRetest = Boolean(att.isRetest || (att.attemptNumber && att.attemptNumber > 1));

                                                        return (
                                                          <div
                                                            key={att.id}
                                                            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#121316] border border-white/10 hover:border-white/20 transition-colors font-mono text-xs text-slate shadow-sm"
                                                          >
                                                            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap min-w-0">
                                                              <span className="font-bold text-paper text-xs sm:text-sm min-w-[20px]">
                                                                {qNum}
                                                              </span>
                                                              <span className="text-white/20">|</span>
                                                              <span>
                                                                Answer: <strong className={isCorrect ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>{opt}</strong>
                                                              </span>
                                                              <span className="text-white/20">|</span>
                                                              <span>
                                                                Time: <span className="text-paper">{timeStr}</span>
                                                              </span>
                                                              <span className="text-white/20">|</span>
                                                              <span className={isCorrect ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                                                                {isCorrect ? 'Correct' : 'Wrong'}
                                                              </span>
                                                            </div>

                                                            {isRetest && (
                                                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 shrink-0 ml-1.5">
                                                                Retest {att.attemptNumber ? `(Att ${att.attemptNumber})` : ''}
                                                              </span>
                                                            )}
                                                          </div>
                                                        );
                                                      })}
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()
                )}
              </div>
            )}

            {/* TAB 2: MISTAKE LOG */}
            {inspectTab === 'mistakes' && (
              <div className="p-6 rounded-3xl bg-[#121316] border border-white/10 space-y-4 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                  <div>
                    <h4 className="font-jakarta font-black text-sm text-paper uppercase tracking-wider flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>Mistake Log</span>
                    </h4>
                    <p className="text-xs text-slate mt-0.5">
                      All actual incorrectly answered questions, original attempts and retests from saved backend records.
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full font-mono text-[11px] font-bold ${
                    actualMistakes.length > 0
                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {actualMistakes.length} Mistakes Recorded
                  </span>
                </div>

                {/* Search & Filter Toolbar for Mistake Log */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#0c0d10] border border-white/10">
                  <div className="flex items-center gap-2 flex-1 min-w-[220px]">
                    <Search className="w-4 h-4 text-slate/60 shrink-0" />
                    <input
                      type="text"
                      value={mistakeSearch}
                      onChange={(e) => setMistakeSearch(e.target.value)}
                      placeholder="Search mistake question, topic, or wrong answer..."
                      className="bg-transparent text-paper placeholder-slate/50 text-xs focus:outline-none w-full font-jakarta"
                    />
                    {mistakeSearch && (
                      <button
                        type="button"
                        onClick={() => setMistakeSearch('')}
                        className="text-slate hover:text-paper text-xs"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Course Filter Dropdown in Mistake Log */}
                    <div className="flex items-center gap-1.5 bg-[#121316] border border-white/15 px-2.5 py-1 rounded-lg">
                      <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="text-[10px] font-mono text-slate/80 font-bold uppercase">Course:</span>
                      <select
                        value={inspectCourseFilter}
                        onChange={(e) => setInspectCourseFilter(e.target.value)}
                        className="bg-transparent text-paper font-jakarta text-xs font-bold focus:outline-none cursor-pointer pr-1"
                      >
                        <option value="all" className="bg-[#111215] text-paper">
                          All Courses ({allAttempts.filter((a) => !a.isCorrect).length})
                        </option>
                        {ALL_INSPECT_COURSES.map((crs) => {
                          const count = allAttempts.filter((a) => a.courseId === crs.id && !a.isCorrect).length;
                          return (
                            <option key={crs.id} value={crs.id} className="bg-[#111215] text-paper">
                              {crs.name} ({count})
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {/* Activity Type Dropdown: All | Purchased Course Only | Free Trial Only */}
                    <div className="flex items-center gap-1.5 bg-[#121316] border border-white/15 px-2.5 py-1 rounded-lg">
                      <ShoppingBag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-[10px] font-mono text-slate/80 font-bold uppercase">Activity Type:</span>
                      <select
                        value={mistakeActivityType}
                        onChange={(e) => setMistakeActivityType(e.target.value as 'all' | 'purchased' | 'trial')}
                        className="bg-transparent text-paper font-jakarta text-xs font-bold focus:outline-none cursor-pointer pr-1"
                      >
                        <option value="all" className="bg-[#111215] text-paper">
                          All
                        </option>
                        <option value="purchased" className="bg-[#111215] text-paper">
                          Purchased Course Only
                        </option>
                        <option value="trial" className="bg-[#111215] text-paper">
                          Free Trial Only
                        </option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => setMistakeFilter('all')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                        mistakeFilter === 'all'
                          ? 'bg-primary text-ink'
                          : 'bg-white/5 text-slate hover:text-paper'
                      }`}
                    >
                      All ({actualMistakes.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setMistakeFilter('wrong')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                        mistakeFilter === 'wrong'
                          ? 'bg-rose-500 text-white'
                          : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                      }`}
                    >
                      ✗ Wrong ({actualMistakes.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setMistakeFilter('fast')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                        mistakeFilter === 'fast'
                          ? 'bg-emerald-400 text-black'
                          : 'bg-white/5 text-slate hover:text-paper'
                      }`}
                    >
                      ⚡ &lt;12s ({actualMistakes.filter((m) => m.speedCategory === 'fast' && m.timeTakenSeconds > 0).length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setMistakeFilter('normal')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                        mistakeFilter === 'normal'
                          ? 'bg-sky-400 text-black'
                          : 'bg-white/5 text-slate hover:text-paper'
                      }`}
                    >
                      ⏱️ 12-20s ({actualMistakes.filter((m) => m.speedCategory === 'normal' && m.timeTakenSeconds > 0).length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setMistakeFilter('slow')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                        mistakeFilter === 'slow'
                          ? 'bg-amber-400 text-black'
                          : 'bg-white/5 text-slate hover:text-paper'
                      }`}
                    >
                      ⏳ &gt;20s ({actualMistakes.filter((m) => (m.speedCategory === 'slow' || m.speedCategory === 'timeout') && m.timeTakenSeconds > 0).length})
                    </button>
                  </div>
                </div>

                {filteredMistakes.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-black/40 border border-white/5 text-center text-xs text-slate font-mono space-y-1">
                    <span className="font-bold text-paper block">No Mistakes Found</span>
                    <p className="text-slate/60 text-[11px]">
                      {actualMistakes.length === 0
                        ? "This student has completed all attempted questions without an incorrect answer on record."
                        : mistakeActivityType === 'purchased'
                        ? "No mistakes recorded after course purchase. Clean post-purchase record!"
                        : "No mistakes matched your search or selected filter."}
                    </p>
                  </div>
                ) : (
                  (() => {
                    // Match student purchases
                    const sEmail = (student.email || '').toLowerCase().trim();
                    const sId = (student.id || '').trim();
                    const studentPurchases = coursePurchases
                      .filter((p) => {
                        const pe = (p.studentEmail || '').toLowerCase().trim();
                        const pi = (p.studentId || '').trim();
                        const match = (sEmail && pe === sEmail) || (sId && pi === sId);
                        return match && (p.status === 'completed' || p.accessGranted);
                      })
                      .sort((a, b) => new Date(a.purchasedAt).getTime() - new Date(b.purchasedAt).getTime());

                    // Group mistakes by Course first
                    const courseMistakeGroups: {
                      courseId: string;
                      courseName: string;
                      courseMistakes: typeof actualMistakes;
                    }[] = [];

                    filteredMistakes.forEach((m) => {
                      const cId = m.courseId || 'python-core';
                      const cName = m.courseName || ALL_INSPECT_COURSES.find((c) => c.id === cId)?.name || 'Complete Python Course';
                      let cGrp = courseMistakeGroups.find((g) => g.courseId === cId);
                      if (!cGrp) {
                        cGrp = { courseId: cId, courseName: cName, courseMistakes: [] };
                        courseMistakeGroups.push(cGrp);
                      }
                      cGrp.courseMistakes.push(m);
                    });

                    return (
                      <div className="space-y-10">
                        {courseMistakeGroups.map((cGrp) => {
                          const coursePurchase = studentPurchases.find((p) => {
                            const pNorm = (p.courseId || p.courseName || '').toLowerCase().replace(/[\s_-]+/g, '');
                            const cNorm = cGrp.courseId.toLowerCase().replace(/[\s_-]+/g, '');
                            return pNorm.includes(cNorm) || cNorm.includes(pNorm);
                          }) || studentPurchases[0];

                          const purchaseTime = coursePurchase ? new Date(coursePurchase.purchasedAt).getTime() : Infinity;

                          // Workflow segmentation: Free Trial vs Purchased Course
                          const trialMistakes = cGrp.courseMistakes.filter(
                            (m) => new Date(m.attemptedAt).getTime() < purchaseTime
                          );
                          const purchasedCourseMistakes = cGrp.courseMistakes.filter(
                            (m) => new Date(m.attemptedAt).getTime() >= purchaseTime
                          );

                          interface MistakeWorkflowSegment {
                            stage: 'free_trial' | 'purchased_course';
                            stageLabel: string;
                            badgeColor: string;
                            purchaseDetails?: typeof coursePurchase;
                            mistakes: typeof actualMistakes;
                          }

                          const segments: MistakeWorkflowSegment[] = [];
                          if (trialMistakes.length > 0) {
                            segments.push({
                              stage: 'free_trial',
                              stageLabel: 'Free Trial Activity',
                              badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
                              mistakes: trialMistakes
                            });
                          }
                          if (coursePurchase && purchasedCourseMistakes.length > 0) {
                            segments.push({
                              stage: 'purchased_course',
                              stageLabel: `Purchased Course: ${coursePurchase.courseName || cGrp.courseName}`,
                              badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
                              purchaseDetails: coursePurchase,
                              mistakes: purchasedCourseMistakes
                            });
                          }

                          if (segments.length === 0) {
                            segments.push({
                              stage: 'free_trial',
                              stageLabel: 'Course Learning Activity',
                              badgeColor: 'bg-primary/15 text-primary border-primary/30',
                              mistakes: cGrp.courseMistakes
                            });
                          }

                          return (
                            <div key={cGrp.courseId} className="space-y-6 p-5 sm:p-6 rounded-3xl bg-[#0d0e11] border border-white/10 shadow-lg">
                              {/* Distinct Course Mistake Header */}
                              <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10 flex-wrap">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-black text-sm">
                                    <AlertTriangle className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <h3 className="font-jakarta font-black text-base sm:text-lg text-paper tracking-wide">
                                      {cGrp.courseName} — Mistake Log
                                    </h3>
                                    <span className="text-[11px] font-mono text-slate/70">
                                      {cGrp.courseMistakes.length} {cGrp.courseMistakes.length === 1 ? 'mistake recorded' : 'mistakes recorded'} in this course
                                    </span>
                                  </div>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-xs font-mono font-bold text-rose-400">
                                  {cGrp.courseMistakes.length} Course Mistakes
                                </span>
                              </div>

                              <div className="space-y-8">
                                {segments.map((seg, sIdx) => {
                                  // Group mistakes by Part, then by Section without unnecessary arrows or nested headings
                                  interface MistakeSectionGroup {
                                    sectionKey: string;
                                    sectionLabel: string;
                                    mistakes: typeof actualMistakes;
                                  }
                                  interface MistakePartGroup {
                                    partNum: number;
                                    partLabel: string;
                                    sections: MistakeSectionGroup[];
                                  }

                                  const partGroups: MistakePartGroup[] = [];

                                  seg.mistakes.forEach((m) => {
                                    const partNum = m.partNum || 1;
                                    const partLabel = `Part ${partNum}`;

                                    let sectionLabel = `${partNum}.1`;
                                    if (m.subQuestionLabel) {
                                      const secMatch = m.subQuestionLabel.match(/Sec\s+([0-9.]+)/i);
                                      if (secMatch) {
                                        sectionLabel = secMatch[1];
                                      } else {
                                        const dotMatch = m.subQuestionLabel.match(/^(\d+\.\d+)/);
                                        if (dotMatch) {
                                          sectionLabel = dotMatch[1];
                                        }
                                      }
                                    } else if (m.section) {
                                      const sMatch = m.section.match(/Section\s*([0-9.]+)/i);
                                      if (sMatch) {
                                        sectionLabel = sMatch[1];
                                      } else {
                                        const numMatch = m.section.match(/(\d+\.\d+)/);
                                        if (numMatch) {
                                          sectionLabel = numMatch[1];
                                        }
                                      }
                                    }

                                    let pGroup = partGroups.find((p) => p.partNum === partNum);
                                    if (!pGroup) {
                                      pGroup = {
                                        partNum,
                                        partLabel,
                                        sections: []
                                      };
                                      partGroups.push(pGroup);
                                    }

                                    let sGroup = pGroup.sections.find((s) => s.sectionLabel === sectionLabel);
                                    if (!sGroup) {
                                      sGroup = {
                                        sectionKey: `${partNum}-${sectionLabel}`,
                                        sectionLabel,
                                        mistakes: []
                                      };
                                      pGroup.sections.push(sGroup);
                                    }

                                    sGroup.mistakes.push(m);
                                  });

                                  // Sort parts numerically
                                  partGroups.sort((a, b) => a.partNum - b.partNum);

                                  return (
                                    <div key={seg.stage + sIdx} className="space-y-6">
                                      {/* Workflow Phase Header / Separator */}
                                      {seg.stage === 'free_trial' ? (
                                        <div className="relative transform-none p-4 rounded-2xl bg-amber-500/[0.08] border border-amber-500/25 flex flex-wrap items-center justify-between gap-3">
                                          <div className="flex items-center gap-2.5">
                                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                                            <h5 className="font-jakarta font-black text-xs sm:text-sm text-amber-300 uppercase tracking-wider">
                                              Free Trial Learning — Mistake Log
                                            </h5>
                                            <span className="text-[11px] font-mono text-slate/70">
                                              ({seg.mistakes.length} mistakes during trial)
                                            </span>
                                          </div>
                                          <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-bold">
                                            Pre-Purchase
                                          </span>
                                        </div>
                                      ) : (
                                        <div className="relative transform-none p-4 rounded-2xl bg-emerald-500/[0.08] border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3">
                                          <div className="flex items-center gap-2.5">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                                            <div>
                                              <h5 className="font-jakarta font-black text-xs sm:text-sm text-emerald-300 uppercase tracking-wider">
                                                Course Purchased &amp; Unlocked — Mistake Log
                                              </h5>
                                              {seg.purchaseDetails && (
                                                <p className="text-[11px] text-slate/80 font-mono mt-0.5">
                                                  Enrolled: <strong className="text-paper">{seg.purchaseDetails.courseName}</strong> •{' '}
                                                  {new Date(seg.purchaseDetails.purchasedAt).toLocaleString()}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                                            {seg.mistakes.length} Post-Purchase Mistakes
                                          </span>
                                        </div>
                                      )}

                                      {seg.mistakes.length === 0 ? (
                                        <div className="p-5 rounded-xl bg-black/40 border border-white/5 text-center text-xs text-slate font-mono">
                                          {seg.stage === 'purchased_course'
                                            ? 'No mistakes recorded yet after course purchase. Clean record!'
                                            : 'No mistakes recorded during free trial.'}
                                        </div>
                                      ) : (
                                        <div className="space-y-6">
                                          {partGroups.map((pGroup) => (
                                            <div key={pGroup.partNum} className="space-y-4">
                                              {/* Part Heading */}
                                              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                                                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                                                <h5 className="font-jakarta font-bold text-xs sm:text-sm text-paper uppercase tracking-wider">
                                                  {pGroup.partLabel}
                                                </h5>
                                                <span className="text-[11px] font-mono text-slate/70">
                                                  ({pGroup.sections.reduce((acc, s) => acc + s.mistakes.length, 0)} mistakes)
                                                </span>
                                              </div>

                                              {/* Section Sub-headings and Questions */}
                                              <div className="space-y-4 pl-1 sm:pl-2">
                                                {pGroup.sections.map((sGroup) => (
                                                  <div key={sGroup.sectionKey} className="space-y-2.5">
                                                    {/* Section heading */}
                                                    <div className="flex items-center gap-2">
                                                      <h6 className="font-jakarta font-bold text-xs text-cyan-400 uppercase tracking-wide">
                                                        Section {sGroup.sectionLabel}
                                                      </h6>
                                                      <span className="text-[10px] font-mono text-slate/60">
                                                        ({sGroup.mistakes.length} {sGroup.mistakes.length === 1 ? 'mistake' : 'mistakes'})
                                                      </span>
                                                    </div>

                                                    {/* Question Mistake Cards */}
                                                    <div className="space-y-3">
                                                      {sGroup.mistakes.map((mistake, idx) => (
                                                        <div
                                                          key={mistake.id || idx}
                                                          className="p-4 sm:p-5 rounded-2xl bg-rose-500/[0.05] border border-rose-500/20 space-y-3 hover:border-rose-500/35 transition-colors"
                                                        >
                                                          {/* Top header row: Question Number + Timing + Attempt tag */}
                                                          <div className="flex flex-wrap items-center justify-between gap-2">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                              <span className="px-2.5 py-0.5 rounded-lg bg-rose-500/15 border border-rose-500/30 font-mono font-bold text-xs text-rose-300">
                                                                Question {mistake.questionNumber}
                                                              </span>
                                                              <span className="font-jakarta font-bold text-sm text-paper">
                                                                {mistake.questionTitle}
                                                              </span>
                                                              {mistake.isRetest && (
                                                                <span className="px-2 py-0.5 rounded-md bg-amber-400/15 border border-amber-400/30 text-amber-300 font-mono text-[10px] font-bold">
                                                                  Retest (Attempt {mistake.attemptsCount || 2})
                                                                </span>
                                                              )}
                                                            </div>

                                                            <div className="flex items-center gap-3 text-xs font-mono text-slate">
                                                              <span className="flex items-center gap-1 text-slate/90">
                                                                <Clock className="w-3.5 h-3.5 text-primary" />
                                                                <span>Time: <strong className="text-paper">{mistake.timeTakenSeconds > 0 ? `${Number(mistake.timeTakenSeconds.toFixed(1))}s` : '—'}</strong></span>
                                                              </span>
                                                              <span className="text-slate/40">•</span>
                                                              <span className="text-slate/70 text-[11px]">{mistake.attemptedAt}</span>
                                                            </div>
                                                          </div>

                                                          {/* Full Question Text */}
                                                          {mistake.questionPrompt && (
                                                            <div className="p-3.5 rounded-xl bg-black/50 border border-white/5">
                                                              <span className="text-[10px] font-mono uppercase tracking-wider text-slate/70 block mb-1">Question</span>
                                                              <p className="font-sans text-xs sm:text-sm text-paper/95 leading-relaxed whitespace-pre-line">
                                                                {mistake.questionPrompt}
                                                              </p>
                                                            </div>
                                                          )}

                                                          {/* Answer Comparison: Student Selected Wrong Answer vs Correct Option */}
                                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            {/* Student's Wrong Answer */}
                                                            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1.5">
                                                              <div className="flex items-center justify-between">
                                                                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-300 font-bold flex items-center gap-1">
                                                                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                                                                  <span>Student's Wrong Answer</span>
                                                                </span>
                                                                <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white font-mono font-bold text-[11px]">
                                                                  Option {mistake.studentOptionId || '?'}
                                                                </span>
                                                              </div>
                                                              <p className="font-sans text-xs text-rose-100 font-medium leading-relaxed">
                                                                {mistake.studentAnswer || 'Incorrect Answer'}
                                                              </p>
                                                            </div>

                                                            {/* Correct Option */}
                                                            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col justify-between">
                                                              <div className="flex items-center justify-between">
                                                                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold flex items-center gap-1">
                                                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                                                  <span>Correct Option</span>
                                                                </span>
                                                                <span className="px-2.5 py-1 rounded-md bg-emerald-500 text-black font-mono font-bold text-xs">
                                                                  Option {mistake.correctOptionId || 'A'}
                                                                </span>
                                                              </div>
                                                              <div className="pt-2 text-[11px] font-mono text-emerald-300/80">
                                                                Selected: Option {mistake.studentOptionId || '?'} • Correct: Option {mistake.correctOptionId || 'A'}
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      ))}
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()
                )}
              </div>
            )}

            {/* TAB 3: SECTION MASTERY */}
            {inspectTab === 'mastery' && (
              <div className="space-y-6">
                {courseMasteryList.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate/60 bg-black/40 rounded-2xl border border-white/5">
                    No curriculum progress records available yet for this student.
                  </div>
                ) : (
                  courseMasteryList.map((crsMastery) => {
                    const passedCount = crsMastery.parts.filter((p) => p.status === 'passed').length;
                    const totalParts = crsMastery.parts.length;

                    return (
                      <div key={crsMastery.courseId} className="p-6 rounded-3xl bg-[#121316] border border-white/10 space-y-5 shadow-xl">
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                              <BookOpen className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-jakarta font-black text-sm sm:text-base text-paper uppercase tracking-wider">
                                {crsMastery.courseName}
                              </h4>
                              <p className="text-xs text-slate mt-0.5">
                                Actual curriculum breakdown and answered progress calculated dynamically from central database.
                              </p>
                            </div>
                          </div>
                          <span className="font-mono text-xs font-bold text-paper bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                            {passedCount} / {totalParts} Parts Passed
                          </span>
                        </div>

                        {crsMastery.parts.length === 0 ? (
                          <div className="p-6 text-center text-xs text-slate/60 bg-black/40 rounded-2xl border border-white/5">
                            No curriculum progress records available yet for this course.
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {crsMastery.parts.map((part) => {
                              const isPassed = part.status === 'passed';
                              const isInProgress = part.status === 'in_progress';
                              const isFailed = part.status === 'failed';
                              const pct = part.totalQuestions > 0 ? Math.round((part.answeredCount / part.totalQuestions) * 100) : 0;

                              return (
                                <div
                                  key={part.partNum}
                                  className="p-5 rounded-2xl border border-white/10 bg-[#0f1013] space-y-4"
                                >
                                  {/* Part Level Header Row */}
                                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5">
                                    <div>
                                      <div className="flex items-center gap-2.5">
                                        <span className="font-jakarta font-black text-base text-paper">
                                          Part {part.partNum}
                                        </span>
                                        <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase ${
                                          isPassed
                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                            : isFailed
                                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                            : isInProgress
                                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                            : 'bg-white/5 text-slate border border-white/10'
                                        }`}>
                                          {part.status.replace(/_/g, ' ')}
                                        </span>
                                      </div>
                                      <span className="font-mono text-xs text-slate/90 block mt-1">
                                        Part {part.partNum} — <strong className="text-paper">{part.totalQuestions} questions</strong> | <strong className="text-primary">{part.answeredCount} answered</strong> ({pct}%)
                                      </span>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="w-full sm:w-48 space-y-1">
                                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                                        <div
                                          className={`h-full rounded-full transition-all duration-500 ${
                                            isPassed ? 'bg-emerald-400' : isFailed ? 'bg-rose-400' : 'bg-primary'
                                          }`}
                                          style={{ width: `${Math.min(100, pct)}%` }}
                                        />
                                      </div>
                                      <div className="flex justify-between text-[10px] font-mono text-slate/60">
                                        <span>{part.answeredCount} / {part.totalQuestions}</span>
                                        <span>{pct}%</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Section-Level Breakdown if available */}
                                  {part.sectionList && part.sectionList.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                                      {part.sectionList.map((sec) => {
                                        const secPct = sec.totalQuestions > 0 ? Math.round((sec.answeredCount / sec.totalQuestions) * 100) : 0;
                                        const secDone = sec.answeredCount >= sec.totalQuestions && sec.totalQuestions > 0;
                                        return (
                                          <div
                                            key={sec.sectionId}
                                            className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-2"
                                          >
                                            <div className="min-w-0">
                                              <span className="font-jakarta font-bold text-xs text-paper block truncate">
                                                {sec.sectionTitle}
                                              </span>
                                              <span className="font-mono text-[11px] text-slate/80 block mt-0.5">
                                                {sec.answeredCount} / {sec.totalQuestions} answered ({secPct}%)
                                              </span>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold shrink-0 ${
                                              secDone
                                                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                                : sec.answeredCount > 0
                                                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                                                : 'bg-white/5 text-slate/50 border border-white/5'
                                            }`}>
                                              {secDone ? 'Completed' : sec.answeredCount > 0 ? 'In Progress' : 'Pending'}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 4: STUDENT PROFILE */}
            {inspectTab === 'profile' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact & Demographics */}
                <div className="p-6 rounded-3xl bg-[#121316] border border-white/10 space-y-4 shadow-xl">
                  <h4 className="font-jakarta font-bold text-sm text-paper uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-white/10">
                    <Users className="w-4 h-4 text-primary" />
                    <span>Student Profile &amp; Contact Details</span>
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-start justify-between gap-2 pb-2 border-b border-white/5">
                      <span className="text-slate font-mono">Full Name</span>
                      <span className="font-bold text-paper text-right">{student.name}</span>
                    </div>

                    <div className="flex items-start justify-between gap-2 pb-2 border-b border-white/5">
                      <span className="text-slate font-mono">Verified Email</span>
                      <span className="font-mono text-slate/90 text-right">{student.email}</span>
                    </div>

                    <div className="flex items-start justify-between gap-2 pb-2 border-b border-white/5">
                      <span className="text-slate font-mono">Contact Phone</span>
                      <span className="font-mono font-semibold text-paper text-right">{student.phone || 'Not added'}</span>
                    </div>

                    <div className="flex items-start justify-between gap-2 pb-2 border-b border-white/5">
                      <span className="text-slate font-mono">College / Organization</span>
                      <span className="text-paper text-right font-medium">{student.collegeOrCompany || 'Not specified'}</span>
                    </div>

                    <div className="flex items-start justify-between gap-2 pb-2 border-b border-white/5">
                      <span className="text-slate font-mono">Acquisition Source</span>
                      <span className="text-slate text-right">{student.whereDidYouFindUs || 'Direct / Search'}</span>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate font-mono">Account Created</span>
                      <span className="text-slate/70 font-mono text-right">{new Date(student.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Courses & Certification */}
                <div className="space-y-5">
                  <div className="p-6 rounded-3xl bg-[#121316] border border-white/10 space-y-4 shadow-xl">
                    <h4 className="font-jakarta font-bold text-sm text-paper uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-white/10">
                      <BookOpen className="w-4 h-4 text-cyan-400" />
                      <span>Enrolled Courses</span>
                    </h4>

                    <div className="flex flex-wrap gap-2">
                      {student.enrolledCourses && student.enrolledCourses.length > 0 ? (
                        student.enrolledCourses.map((c, i) => (
                          <span
                            key={i}
                            className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-paper font-jakarta text-xs font-semibold"
                          >
                            {c}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate/60 font-mono">No courses enrolled yet</span>
                      )}
                    </div>
                  </div>

                  {(() => {
                    // Check actual authentic claimed certificates for this student across all courses
                    const cleanEmail = (student.email || '').toLowerCase().trim();
                    const studentCertificates: {
                      courseId: string;
                      courseTitle: string;
                      certificateId: string;
                      issueDate: string;
                    }[] = [];

                    // Check memoryCourseState for certificates
                    if (cleanEmail && memoryCourseState[cleanEmail]?.certificates) {
                      Object.entries(memoryCourseState[cleanEmail].certificates).forEach(([storageKey, record]: [string, any]) => {
                        if (record && record.certificateId && (record.isConfirmed || record.isLocked)) {
                          // Match course
                          const matchCfg = Object.values(COURSE_CERT_CONFIGS).find((cfg) => cfg.storageKey === storageKey);
                          const title = matchCfg?.title || record.courseTitle || 'Complete Python Course';
                          const courseId = matchCfg?.courseId || 'python-core';
                          studentCertificates.push({
                            courseId,
                            courseTitle: title,
                            certificateId: record.certificateId,
                            issueDate: record.issueDate || 'Completed'
                          });
                        }
                      });
                    }

                    // Check localStorage as well
                    if (typeof window !== 'undefined' && window.localStorage) {
                      Object.values(COURSE_CERT_CONFIGS).forEach((cfg) => {
                        try {
                          const raw = localStorage.getItem(cfg.storageKey);
                          if (raw) {
                            const parsed = JSON.parse(raw);
                            if (parsed && parsed.certificateId && (parsed.isConfirmed || parsed.isLocked)) {
                              if (!studentCertificates.some((sc) => sc.certificateId === parsed.certificateId)) {
                                studentCertificates.push({
                                  courseId: cfg.courseId,
                                  courseTitle: cfg.title,
                                  certificateId: parsed.certificateId,
                                  issueDate: parsed.issueDate || 'Completed'
                                });
                              }
                            }
                          }
                        } catch {}
                      });
                    }

                    // Fallback to student record if certificateId exists
                    if (studentCertificates.length === 0 && student.hasCertificate && student.certificateId) {
                      const courseName = student.enrolledCourses && student.enrolledCourses[0]
                        ? student.enrolledCourses[0]
                        : 'Complete Python Course';
                      studentCertificates.push({
                        courseId: 'python-core',
                        courseTitle: courseName,
                        certificateId: student.certificateId,
                        issueDate: student.certificateIssuedDate || 'Completed'
                      });
                    }

                    if (studentCertificates.length > 0) {
                      return (
                        <div className="space-y-3">
                          {studentCertificates.map((cert, cIdx) => (
                            <div
                              key={cert.certificateId + cIdx}
                              className="p-6 rounded-3xl border space-y-3 shadow-xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-amber-400/30"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Award className="w-5 h-5 text-amber-400" />
                                  <h4 className="font-jakarta font-bold text-sm text-paper">
                                    {cert.courseTitle} Certificate Issued
                                  </h4>
                                </div>
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-black font-jakarta font-extrabold text-[10px] uppercase">
                                  CLAIMED &amp; VERIFIED
                                </span>
                              </div>
                              <p className="text-xs text-slate leading-relaxed">
                                This student has genuinely passed and claimed their official verified certificate for <strong className="text-paper">{cert.courseTitle}</strong>. Certificate ID: <strong className="text-amber-300 font-mono">{cert.certificateId}</strong> issued on {cert.issueDate}.
                              </p>
                            </div>
                          ))}
                        </div>
                      );
                    }

                    return (
                      <div className="p-6 rounded-3xl border space-y-3 shadow-xl bg-[#121316] border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-slate/60" />
                            <h4 className="font-jakarta font-bold text-sm text-paper">
                              Certificate Progress
                            </h4>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate font-mono text-[10px] font-bold uppercase">
                            NOT YET CLAIMED
                          </span>
                        </div>
                        <p className="text-xs text-slate leading-relaxed">
                          Requires completing the course modules and claiming the certificate through the official verification process. Currently at {student.points} points.
                        </p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

          </div>

          {/* Modal Bottom Footer (Fixed) */}
          <div className="px-6 py-4 border-t border-white/10 bg-[#0f1013]/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-2 font-mono text-[11px] text-slate/70">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Viewing record for <strong className="text-paper">{student.name}</strong> • Registered {new Date(student.createdAt).toLocaleString()} • Avg Speed: <strong className="text-primary">{metrics.avgTime}s</strong></span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => exportIndividualStudentPDF(student)}
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

  const renderRewardRequestsSection = () => {
    const totalRewards = rewardRequests.length;
    const pendingRewards = rewardRequests.filter((r) => r.status === 'pending');
    const approvedRewards = rewardRequests.filter((r) => r.status === 'approved');
    const rejectedRewards = rewardRequests.filter((r) => r.status === 'rejected');

    const filteredRewards = rewardRequests.filter((r) => {
      if (rewardStatusFilter !== 'all' && r.status !== rewardStatusFilter) {
        return false;
      }
      const q = (rewardSearch || studentSearch).toLowerCase().trim();
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
      <section id="section-rewards" className="rounded-3xl bg-[#0c0d0e] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* Rewards Summary KPIs & Subfilters */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-jakarta font-bold text-sm text-paper flex items-center gap-2">
                Milestone Reward Claims
                {pendingRewards.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold">
                    {pendingRewards.length} PENDING VERIFICATION
                  </span>
                )}
              </h4>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search bar */}
            <div className="relative min-w-[200px] flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate/50" />
              <input
                type="text"
                placeholder="Search student, course..."
                value={rewardSearch}
                onChange={(e) => setRewardSearch(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-paper placeholder:text-slate/40 focus:outline-none focus:border-primary/50 transition-colors"
              />
              {rewardSearch && (
                <button
                  type="button"
                  onClick={() => setRewardSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate hover:text-paper"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Sub-tabs */}
            <div className="flex items-center gap-1.5 shrink-0">
              {[
                { id: 'all', label: 'All Requests', count: totalRewards },
                { id: 'pending', label: 'Pending', count: pendingRewards.length },
                { id: 'approved', label: 'Approved', count: approvedRewards.length },
                { id: 'rejected', label: 'Rejected', count: rejectedRewards.length },
              ].map((subTab) => {
                const active = rewardStatusFilter === subTab.id;
                return (
                  <button
                    key={subTab.id}
                    type="button"
                    onClick={() => setRewardStatusFilter(subTab.id as any)}
                    className={`px-3 py-1.5 rounded-xl font-jakarta text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
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
                setRewardSearch('');
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
              const isRejected = req.status === 'rejected';
              return (
                <div
                  key={req.id}
                  className={`rounded-3xl bg-[#0e0f12] border p-5 space-y-4 transition-all shadow-xl flex flex-col justify-between group ${
                    isApproved
                      ? 'border-emerald-500/20 hover:border-emerald-500/40'
                      : isRejected
                      ? 'border-rose-500/20 hover:border-rose-500/40 bg-gradient-to-b from-rose-500/[0.02] to-transparent'
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
                      ) : isRejected ? (
                        <span className="px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 font-mono text-[10px] font-bold flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          REJECTED
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          PENDING
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Student Details: Phone, College, Dates (Course completely removed) */}
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
                    {isRejected && req.rejectedAt && (
                      <div className="flex items-center gap-2 text-[11px] text-rose-400/90">
                        <XCircle className="w-3 h-3 shrink-0 text-rose-400" />
                        <span>Rejected: {new Date(req.rejectedAt).toLocaleString()}</span>
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

                  {/* Actions: Approve & Reject */}
                  <div>
                    {isApproved ? (
                      <div className="w-full py-2.5 px-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center font-jakarta font-bold text-xs text-emerald-400 flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Request Approved
                      </div>
                    ) : isRejected ? (
                      <div className="w-full py-2.5 px-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center font-jakarta font-bold text-xs text-rose-400 flex items-center justify-center gap-1.5">
                        <XCircle className="w-4 h-4" />
                        Request Rejected
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleApproveReward(req.id, req.studentName, req.rewardAmount)}
                          className="flex-1 py-2.5 px-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-jakarta font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4 text-black" />
                          <span>Approve</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectReward(req.id, req.studentName, req.rewardAmount)}
                          className="flex-1 py-2.5 px-3 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-jakarta font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                        >
                          <XCircle className="w-4 h-4 text-rose-400" />
                          <span>Reject</span>
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

  // Render Permanent Student Deletion Section
  const renderPermanentDeleteSection = () => {
    // Unique list of all courses for filtering
    const uniqueCourses = Array.from(
      new Set([
        'Complete Python Course',
        'Complete Java Course',
        'Full Stack Open Course',
        'Cyber Security Course',
        ...(data.coursesSection?.courses || []).map((c: any) => c.title),
        ...students.flatMap((s) => s.enrolledCourses || [])
      ])
    ).filter(Boolean);

    // Filter students by search query and course
    const filteredStudents = students.filter((s) => {
      if (permanentDeleteCourseFilter !== 'all') {
        const matchesCourse = (s.enrolledCourses || []).some(
          (c) => c.toLowerCase() === permanentDeleteCourseFilter.toLowerCase()
        );
        if (!matchesCourse) return false;
      }
      const q = permanentDeleteSearch.toLowerCase().trim();
      if (q) {
        const matchName = (s.name || '').toLowerCase().includes(q);
        const matchEmail = (s.email || '').toLowerCase().includes(q);
        const matchPhone = (s.phone || '').toLowerCase().includes(q);
        const matchCourse = (s.enrolledCourses || []).some((c) => c.toLowerCase().includes(q));
        const matchId = (s.id || '').toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchPhone && !matchCourse && !matchId) {
          return false;
        }
      }
      return true;
    });

    return (
      <section id="section-permanent-delete" className="rounded-3xl bg-[#0c0d0e] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-jakarta text-lg font-black text-paper">Permanent Delete</h2>
              <span className="font-mono text-[10px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full font-bold border border-rose-500/20">
                {filteredStudents.length} Students
              </span>
            </div>
            <p className="text-xs text-slate mt-0.5">
              Permanently delete student accounts and cascade remove all associated data, enrollments, test progress, and certificates from the database.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchStudents}
              disabled={isLoadingStudents}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-paper font-jakarta text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Refresh student roster"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStudents ? 'animate-spin text-primary' : 'text-slate'}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert Toast */}
        {deleteFeedback && (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs sm:text-sm ${
              deleteFeedback.type === 'success'
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-3">
              {deleteFeedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
              <span className="font-medium">{deleteFeedback.message}</span>
            </div>
            <button
              onClick={() => setDeleteFeedback(null)}
              className="p-1 rounded-lg text-slate hover:text-paper hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-slate absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, email, phone, or enrolled course..."
              value={permanentDeleteSearch}
              onChange={(e) => setPermanentDeleteSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-paper text-xs placeholder:text-slate/60 focus:outline-none focus:border-rose-500/50 transition-colors"
            />
            {permanentDeleteSearch && (
              <button
                type="button"
                onClick={() => setPermanentDeleteSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-paper"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate ml-1" />
            <select
              value={permanentDeleteCourseFilter}
              onChange={(e) => setPermanentDeleteCourseFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-paper text-xs focus:outline-none focus:border-rose-500/50 transition-colors cursor-pointer"
            >
              <option value="all">All Courses</option>
              {uniqueCourses.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Student Table / Cards */}
        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <UserX className="w-10 h-10 text-slate/40 mx-auto" />
            <h3 className="font-jakarta font-bold text-base text-paper">No students found</h3>
            <p className="text-xs text-slate max-w-sm mx-auto">
              {permanentDeleteSearch || permanentDeleteCourseFilter !== 'all'
                ? 'No students matched the current search or course filter.'
                : 'There are currently no registered students in the database.'}
            </p>
            {(permanentDeleteSearch || permanentDeleteCourseFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setPermanentDeleteSearch('');
                  setPermanentDeleteCourseFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-paper inline-flex items-center gap-2 cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-black/40 font-mono text-[11px] text-slate/70 uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-semibold">Student Name</th>
                    <th className="py-3.5 px-4 font-semibold">Email</th>
                    <th className="py-3.5 px-4 font-semibold">Phone Number</th>
                    <th className="py-3.5 px-4 font-semibold">Enrolled Course</th>
                    <th className="py-3.5 px-4 font-semibold">Points</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {filteredStudents.map((student) => {
                    const courses = student.enrolledCourses && student.enrolledCourses.length > 0
                      ? student.enrolledCourses
                      : ['Complete Python Course'];

                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        {/* 1. Name & Avatar */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            {student.avatar ? (
                              <img
                                src={student.avatar}
                                alt={student.name}
                                className="w-9 h-9 rounded-full object-cover shrink-0 border border-white/15"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-xs shrink-0 border border-primary/30">
                                {getUserInitials(student.name)}
                              </div>
                            )}
                            <div className="min-w-0">
                              <span className="font-jakarta font-bold text-paper block truncate">
                                {student.name}
                              </span>
                              <span className="font-mono text-[10px] text-slate/60 block truncate">
                                ID: {student.id.length > 18 ? `${student.id.slice(0, 16)}...` : student.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 2. Email */}
                        <td className="py-3.5 px-4">
                          <a
                            href={`mailto:${student.email}`}
                            className="font-mono text-paper hover:text-primary transition-colors flex items-center gap-1.5 truncate max-w-[220px]"
                            title={student.email}
                          >
                            <Mail className="w-3.5 h-3.5 text-slate/60 shrink-0" />
                            <span className="truncate">{student.email}</span>
                          </a>
                        </td>

                        {/* 3. Phone */}
                        <td className="py-3.5 px-4">
                          {student.phone ? (
                            <span className="font-mono text-paper flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-slate/60 shrink-0" />
                              <span>{student.phone}</span>
                            </span>
                          ) : (
                            <span className="font-mono text-slate/40 italic">Not Provided</span>
                          )}
                        </td>

                        {/* 4. Enrolled Course */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1.5 max-w-[260px]">
                            {courses.map((course, idx) => {
                              const isPy = course.toLowerCase().includes('python');
                              const isJava = course.toLowerCase().includes('java');
                              const isCyber = course.toLowerCase().includes('cyber');
                              const isFs = course.toLowerCase().includes('full stack') || course.toLowerCase().includes('fullstack');

                              const badgeColor = isPy
                                ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                                : isJava
                                ? 'bg-orange-500/10 text-orange-300 border-orange-500/20'
                                : isCyber
                                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                                : isFs
                                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                                : 'bg-white/10 text-slate border-white/10';

                              return (
                                <span
                                  key={idx}
                                  className={`font-jakarta text-[11px] px-2 py-0.5 rounded-lg border font-medium truncate ${badgeColor}`}
                                >
                                  {course}
                                </span>
                              );
                            })}
                          </div>
                        </td>

                        {/* 5. Points */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-mono text-[11px] font-bold text-amber-400 inline-flex items-center gap-1">
                            ⭐ {student.points} pts
                          </span>
                        </td>

                        {/* 6. Action: Delete Button */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setDeleteModalTarget(student)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/30 font-jakarta font-bold text-xs transition-all shadow-sm hover:shadow-rose-500/25 active:scale-95 cursor-pointer"
                            title={`Permanently delete ${student.name}'s account and records`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
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

  // Render Root-Level Permanent Delete Confirmation Modal
  const renderPermanentDeleteConfirmModal = () => {
    if (!deleteModalTarget) return null;

    const courses = deleteModalTarget.enrolledCourses && deleteModalTarget.enrolledCourses.length > 0
      ? deleteModalTarget.enrolledCourses
      : ['Complete Python Course'];

    return (
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
        <div className="max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0c0d0e] border border-rose-500/30 p-5 sm:p-6 space-y-5 shadow-2xl relative">
          {/* Modal Header */}
          <div className="flex items-start justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-jakarta font-bold text-base sm:text-lg text-paper">
                  Confirm Permanent Deletion
                </h3>
                <p className="text-xs text-rose-400/90 font-mono mt-0.5">
                  Irreversible Account &amp; Data Removal
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => !isDeletingStudent && setDeleteModalTarget(null)}
              disabled={isDeletingStudent}
              className="p-1 rounded-lg text-slate hover:text-paper hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Student Summary Card */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
            <div className="flex items-center gap-3">
              {deleteModalTarget.avatar ? (
                <img
                  src={deleteModalTarget.avatar}
                  alt={deleteModalTarget.name}
                  className="w-11 h-11 rounded-full object-cover shrink-0 border border-white/20"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm shrink-0 border border-primary/30">
                  {getUserInitials(deleteModalTarget.name)}
                </div>
              )}
              <div className="min-w-0">
                <h4 className="font-jakarta font-bold text-sm text-paper truncate">
                  {deleteModalTarget.name}
                </h4>
                <p className="font-mono text-xs text-slate truncate">
                  {deleteModalTarget.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-white/10 text-xs font-mono">
              <div>
                <span className="text-slate/60 block text-[10px] uppercase">Phone:</span>
                <span className="text-paper">{deleteModalTarget.phone || 'Not Provided'}</span>
              </div>
              <div>
                <span className="text-slate/60 block text-[10px] uppercase">Enrolled Course:</span>
                <span className="text-paper truncate block">{courses.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Explanation of cascade deletion */}
          <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-3.5 space-y-2 text-xs text-rose-200">
            <strong className="text-rose-300 font-semibold block">The following data will be permanently wiped:</strong>
            <ul className="list-disc list-inside space-y-1 text-rose-200/80">
              <li>Authentication profile and user credentials from database</li>
              <li>Enrolled course progress and all test/quiz attempts</li>
              <li>Accumulated points ({deleteModalTarget.points} points) &amp; streak history</li>
              <li>Reward claims, milestone records, and support tickets</li>
              <li>Course purchases, coupon claims, and issued certificates</li>
            </ul>
          </div>

          <p className="text-xs text-slate/80 text-center font-mono">
            Do you really want to permanently delete this student&apos;s account?
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setDeleteModalTarget(null)}
              disabled={isDeletingStudent}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-slate hover:text-paper hover:bg-white/5 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmPermanentDelete}
              disabled={isDeletingStudent}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isDeletingStudent ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Deleting from Database...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Yes, Permanently Delete</span>
                </>
              )}
            </button>
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

    // Coupon Purchases matching helper: checks if a student purchased or claimed a course with a coupon code
    const studentHasCouponPurchase = (s: StudentAdminRecord): boolean => {
      const email = (s.email || '').toLowerCase().trim();
      const id = (s.id || '').trim();
      return coursePurchases.some((p) => {
        const matchesStudent =
          (email && p.studentEmail && p.studentEmail.toLowerCase().trim() === email) ||
          (id && p.studentId === id);
        if (!matchesStudent) return false;

        // Must be in a completed or verified status with course access
        const isAccessGranted = p.accessGranted || p.status === 'completed';
        if (!isAccessGranted) return false;

        // If scoped to a specific course filter, match the course
        if (selectedCourseFilter !== 'all') {
          const matchCourse =
            p.courseName?.toLowerCase() === selectedCourseFilter.toLowerCase() ||
            p.courseId?.toLowerCase() === selectedCourseFilter.toLowerCase() ||
            normalizeCourseId(p.courseId) === normalizeCourseId(selectedCourseFilter);
          if (!matchCourse) return false;
        }

        // Must have used a coupon code or coupon free unlock
        const hasCouponCode = Boolean(p.couponCodeApplied && p.couponCodeApplied.trim() !== '');
        const isCouponUnlock = p.paymentMethod === 'coupon_free_unlock';
        return hasCouponCode || isCouponUnlock;
      });
    };

    // Counts for filter pills (scoped to selected course & active date range)
    const totalCount = studentsInDateAndCourse.length;
    const startedCount = studentsInDateAndCourse.filter((s) => s.courseProgressStatus === 'in_progress' || s.courseProgressStatus === 'completed').length;
    const completedCount = studentsInDateAndCourse.filter((s) => s.courseProgressStatus === 'completed').length;
    const couponPurchasesCount = studentsInDateAndCourse.filter((s) => studentHasCouponPurchase(s)).length;
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
      if (studentFilter === 'coupon_purchases') {
        return studentHasCouponPurchase(s);
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

    const exportToPDF = () => {
      try {
        const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
        const pageWidth = doc.internal.pageSize.getWidth();

        // Exact font-synchronized text measurement and splitting
        const splitText = (text: string, fontStyle: 'bold' | 'normal' | 'italic', fontSize: number, maxWidth: number): string[] => {
          doc.setFont("helvetica", fontStyle);
          doc.setFontSize(fontSize);
          return doc.splitTextToSize(text || '', maxWidth);
        };

        const drawTableHeader = (yPos: number) => {
          doc.setFillColor(241, 245, 249);
          doc.rect(36, yPos, 770, 24, 'F');
          doc.setDrawColor(203, 213, 225);
          doc.line(36, yPos, 806, yPos);
          doc.line(36, yPos + 24, 806, yPos + 24);

          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(30, 41, 59);

          doc.text("#", 45, yPos + 15);
          doc.text("STUDENT & CONTACT", 68, yPos + 15);
          doc.text("COLLEGE & SOURCE", 224, yPos + 15);
          doc.text("ENROLLED COURSES", 389, yPos + 15);
          doc.text("TESTS & SCORE", 524, yPos + 15);
          doc.text("CERTIFICATE", 629, yPos + 15);
          doc.text("STATUS & JOINED", 714, yPos + 15);
          return yPos + 24;
        };

        const drawPageHeader = () => {
          // Premium executive dark header
          doc.setFillColor(15, 23, 42);
          doc.rect(0, 0, pageWidth, 58, 'F');

          // Green accent line at header bottom
          doc.setFillColor(0, 255, 157);
          doc.rect(0, 56, pageWidth, 2, 'F');

          doc.setFont("helvetica", "bold");
          doc.setFontSize(15);
          doc.setTextColor(0, 255, 157);
          doc.text("DO PILOT", 36, 26);

          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.setTextColor(255, 255, 255);
          doc.text("— Student Learning Analytics & Performance Report", 114, 26);

          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          const courseLabel = selectedCourseFilter === 'all' ? 'All Courses' : selectedCourseFilter;
          const filterLabel = studentFilter.toUpperCase().replace(/_/g, ' ');
          doc.text(
            `Generated: ${new Date().toLocaleString()}   |   Course: ${courseLabel}   |   Filter: ${filterLabel}   |   Total Students: ${filteredStudents.length}`,
            36,
            44
          );

          return drawTableHeader(68);
        };

        const drawContinuationHeader = () => {
          doc.setFillColor(15, 23, 42);
          doc.rect(0, 0, pageWidth, 32, 'F');
          doc.setFillColor(0, 255, 157);
          doc.rect(0, 30, pageWidth, 2, 'F');

          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(0, 255, 157);
          doc.text("DO PILOT — Student Learning Analytics (Continued)", 36, 20);

          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          const courseLabel = selectedCourseFilter === 'all' ? 'All Courses' : selectedCourseFilter;
          doc.text(`Course: ${courseLabel}  |  Filter: ${studentFilter.toUpperCase().replace(/_/g, ' ')}`, pageWidth - 36, 20, { align: 'right' });

          return drawTableHeader(40);
        };

        let currentY = drawPageHeader();

        if (filteredStudents.length === 0) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(100, 116, 139);
          doc.text("No student records found matching the selected filter criteria.", 36, currentY + 30);
        } else {
          filteredStudents.forEach((s, idx) => {
            // Col 2: Student Contact Lines (width 146)
            const nameLines = splitText(s.name || 'Unnamed Student', 'bold', 8.5, 146);
            const emailLines = splitText(s.email || 'N/A', 'normal', 7.5, 146);
            const phoneLines = splitText(s.phone ? `Tel: ${s.phone}` : 'Tel: Not provided', 'normal', 7, 146);
            const col2Height = (nameLines.length * 10.5) + (emailLines.length * 9.5) + (phoneLines.length * 9);

            // Col 3: College & Source Lines (width 155, no goal)
            const collegeLines = splitText(s.collegeOrCompany || 'N/A', 'bold', 8, 155);
            const sourceLines = s.whereDidYouFindUs ? splitText(`Via: ${s.whereDidYouFindUs}`, 'normal', 6.5, 155) : [];
            const col3Height = (collegeLines.length * 10) + (sourceLines.length * 8.5);

            // Col 4: Enrolled Courses (width 125, cleanly listed, NO Masterclass joined text)
            const courseLines: string[] = [];
            if (s.enrolledCourses && s.enrolledCourses.length > 0) {
              s.enrolledCourses.forEach((c) => {
                courseLines.push(...splitText(c, 'normal', 7.5, 125));
              });
            } else {
              courseLines.push(...splitText('No course enrolled', 'italic', 7.5, 125));
            }
            const col4Height = courseLines.length * 10;

            // Col 5: Scores & Tests Lines (~29.5 pt)
            const col5Height = 10.5 + 9.5 + 9.5;

            // Col 6: Certificate Lines (~19 pt)
            const col6Height = 10 + 9;

            // Col 7: Status Lines (wrapped cleanly to 86pt, never overflowing right margin)
            const rawStatus = s.courseProgressStatus.toUpperCase().replace(/_/g, ' ');
            const statusLines = splitText(rawStatus, 'bold', 7.5, 86);
            const regDate = s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'N/A';
            const regDateLines = splitText(`Reg: ${regDate}`, 'normal', 6.5, 86);
            const col7Height = (statusLines.length * 9.5) + (regDateLines.length * 8.5);

            // Calculate precise row height: tallest column content + 18 pt padding (top 9pt + bottom 9pt)
            const maxContentHeight = Math.max(col2Height, col3Height, col4Height, col5Height, col6Height, col7Height, 28);
            const rowHeight = maxContentHeight + 18;

            // Page break safety check: if row extends beyond 530pt, move to new page
            if (currentY + rowHeight > 530) {
              doc.addPage();
              currentY = drawContinuationHeader();
            }

            // Alternating zebra row background
            if (idx % 2 === 1) {
              doc.setFillColor(248, 250, 252);
              doc.rect(36, currentY, 770, rowHeight, 'F');
            }

            // Bottom border for row
            doc.setDrawColor(226, 232, 240);
            doc.line(36, currentY + rowHeight, 806, currentY + rowHeight);

            const startY = currentY + 11;

            // Col 1: Index #
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.text(String(idx + 1), 45, startY + 2);

            // Col 2: Student / Contact
            let yCol2 = startY;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8.5);
            doc.setTextColor(15, 23, 42);
            nameLines.forEach((line) => {
              doc.text(line, 68, yCol2);
              yCol2 += 10.5;
            });
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7.5);
            doc.setTextColor(71, 85, 105);
            emailLines.forEach((line) => {
              doc.text(line, 68, yCol2);
              yCol2 += 9.5;
            });
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7);
            doc.setTextColor(100, 116, 139);
            phoneLines.forEach((line) => {
              doc.text(line, 68, yCol2);
              yCol2 += 9;
            });

            // Col 3: College & Source
            let yCol3 = startY;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(30, 41, 59);
            collegeLines.forEach((line) => {
              doc.text(line, 224, yCol3);
              yCol3 += 10;
            });
            doc.setFont("helvetica", "normal");
            doc.setFontSize(6.5);
            doc.setTextColor(100, 116, 139);
            sourceLines.forEach((line) => {
              doc.text(line, 224, yCol3);
              yCol3 += 8.5;
            });

            // Col 4: Enrolled Courses
            let yCol4 = startY;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7.5);
            doc.setTextColor(30, 41, 59);
            courseLines.forEach((line) => {
              doc.text(line, 389, yCol4);
              yCol4 += 10;
            });

            // Col 5: Scores & Tests
            let yCol5 = startY;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8.5);
            if (s.points >= 10) {
              doc.setTextColor(5, 150, 105);
            } else {
              doc.setTextColor(30, 41, 59);
            }
            doc.text(`${s.points} pts`, 524, yCol5);
            yCol5 += 10.5;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(7);
            doc.setTextColor(71, 85, 105);
            doc.text(`${s.testsAttemptedCount} tests attempted`, 524, yCol5);
            yCol5 += 9.5;

            if (s.testsFailedCount > 0) {
              doc.setTextColor(190, 18, 60);
            } else {
              doc.setTextColor(5, 150, 105);
            }
            doc.setFontSize(7);
            doc.text(`${s.testsPassedCount} passed / ${s.testsFailedCount} failed`, 524, yCol5);

            // Col 6: Certificate
            let yCol6 = startY;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(7.5);
            if (s.hasCertificate) {
              doc.setTextColor(180, 83, 9);
              doc.text("CERTIFIED", 629, yCol6);
            } else {
              doc.setTextColor(100, 116, 139);
              doc.text("In Progress", 629, yCol6);
            }
            yCol6 += 10;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(6.5);
            doc.setTextColor(100, 116, 139);
            doc.text(s.certificateId ? `ID: ${s.certificateId}` : 'ID: Not Issued', 629, yCol6);

            // Col 7: Status & Registration
            let yCol7 = startY;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(7.5);
            if (s.courseProgressStatus === 'completed') {
              doc.setTextColor(5, 150, 105);
            } else if (s.courseProgressStatus === 'in_progress') {
              doc.setTextColor(2, 132, 199);
            } else {
              doc.setTextColor(100, 116, 139);
            }
            statusLines.forEach((line) => {
              doc.text(line, 714, yCol7);
              yCol7 += 9.5;
            });

            doc.setFont("helvetica", "normal");
            doc.setFontSize(6.5);
            doc.setTextColor(100, 116, 139);
            regDateLines.forEach((line) => {
              doc.text(line, 714, yCol7);
              yCol7 += 8.5;
            });

            currentY += rowHeight;
          });
        }

        // Add page numbering & footer across all pages
        const totalPages = doc.getNumberOfPages();
        for (let p = 1; p <= totalPages; p++) {
          doc.setPage(p);
          doc.setDrawColor(226, 232, 240);
          doc.line(36, 565, 806, 565);

          doc.setFont("helvetica", "normal");
          doc.setFontSize(7.5);
          doc.setTextColor(148, 163, 184);
          doc.text("DO PILOT — Official Student Analytics & Academic Roster Report  •  Confidential", 36, 578);
          doc.text(`Page ${p} of ${totalPages}`, pageWidth - 36, 578, { align: 'right' });
        }

        doc.save(`DO_PILOT_Students_${studentFilter.toUpperCase()}_${new Date().toISOString().slice(0, 10)}.pdf`);
        showToast(`Exported ${filteredStudents.length} students to detailed PDF Report!`);
      } catch (err) {
        console.error("PDF export failed:", err);
        showToast("PDF generation error. Please try again.");
      }
    };

    return (
      <section 
        id="section-students" 
        data-no-reveal="true" 
        className="rounded-3xl bg-[#0c0d0e] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl relative"
      >
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
              { id: 'coupon_purchases', label: 'Coupon Purchases', count: couponPurchasesCount, isCoupon: true },
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
                  {(tab as any).isCoupon && <Tag className="w-3.5 h-3.5 shrink-0 text-primary" />}
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
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-paper font-bold">{filteredStudents.length}</span>
                <span>{filteredStudents.length === 1 ? 'student record' : 'student records'}</span>
              </div>
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

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-black/60 p-1 rounded-xl border border-white/10 font-mono text-xs">
              <button
                type="button"
                onClick={() => setCourseResetActiveTab('directory')}
                className={`px-3 py-1.5 rounded-lg font-jakarta text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  courseResetActiveTab === 'directory'
                    ? 'bg-cyan-500 text-ink shadow-md shadow-cyan-500/20'
                    : 'text-slate hover:text-paper'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Locked Students ({activeLockedCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setCourseResetActiveTab('audit')}
                className={`px-3 py-1.5 rounded-lg font-jakarta text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  courseResetActiveTab === 'audit'
                    ? 'bg-cyan-500 text-ink shadow-md shadow-cyan-500/20'
                    : 'text-slate hover:text-paper'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Reset Audit Logs ({courseResetAuditLogs.length})</span>
              </button>
            </div>

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

        {courseResetActiveTab === 'directory' ? (
          <>
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
          </>
        ) : (
          /* Reset Audit History Tab */
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="font-mono text-xs text-slate">
                Showing all official course unlocking and reset transactions.
              </span>
              <span className="font-mono text-xs text-cyan-400 font-bold">
                {courseResetAuditLogs.length} Reset Records
              </span>
            </div>

            {courseResetAuditLogs.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-black/30 border border-white/10 space-y-2">
                <FileText className="w-8 h-8 text-slate/50 mx-auto" />
                <h4 className="font-jakarta text-sm font-bold text-paper">No Reset Audit Records</h4>
                <p className="font-mono text-xs text-slate max-w-md mx-auto">
                  When administrators unlock courses or reset student failure counters, the transactions will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {courseResetAuditLogs.map((entry) => {
                  const formattedTime = (() => {
                    try {
                      const d = new Date(entry.resetTimestamp);
                      return d.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      });
                    } catch {
                      return entry.resetTimestamp;
                    }
                  })();

                  return (
                    <div
                      key={entry.id}
                      className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2.5 hover:border-cyan-500/30 transition-all"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            {entry.id}
                          </span>
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {entry.status}
                          </span>
                          <span className="font-jakarta font-bold text-xs text-paper">
                            {entry.studentName}
                          </span>
                          <span className="font-mono text-[10px] text-slate/70">
                            ({entry.studentEmail})
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-slate/70 font-mono text-[10px]">
                          <span>Admin: <strong className="text-paper">{entry.adminIdentifier}</strong></span>
                          <span>{formattedTime}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                        <div className="p-2 rounded-xl bg-black/60 border border-white/5">
                          <span className="text-slate/60 text-[10px] block">AFFECTED COURSE</span>
                          <span className="text-cyan-300 font-bold">{entry.courseName}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-black/60 border border-white/5">
                          <span className="text-slate/60 text-[10px] block">ADMIN NOTES / REASON</span>
                          <span className="text-paper">{entry.adminNotes || 'Progression unlocked.'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
      setCouponFormDesc(coupon.description || '');
      setCouponFormIsActive(coupon.isActive);

      if (coupon.validUntil) {
        const diffMs = new Date(coupon.validUntil).getTime() - Date.now();
        if (diffMs > 0 && diffMs <= 48 * 3600 * 1000) {
          const mins = Math.max(1, Math.round(diffMs / 60000));
          if (mins === 30) setCouponFormTimerMode('30m');
          else if (mins === 60) setCouponFormTimerMode('1h');
          else if (mins === 120) setCouponFormTimerMode('2h');
          else if (mins === 360) setCouponFormTimerMode('6h');
          else if (mins === 1440) setCouponFormTimerMode('24h');
          else setCouponFormTimerMode('custom');
          setCouponFormTimerMinutes(mins);
          setCouponFormExpiry('');
        } else {
          setCouponFormTimerMode('none');
          setCouponFormTimerMinutes(30);
          setCouponFormExpiry(coupon.validUntil ? coupon.validUntil.slice(0, 10) : '');
        }
      } else {
        setCouponFormTimerMode('none');
        setCouponFormTimerMinutes(30);
        setCouponFormExpiry('');
      }
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
      setCouponFormTimerMode('none');
      setCouponFormTimerMinutes(30);
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

    let calculatedValidUntil: string | undefined = undefined;
    if (couponFormTimerMode !== 'none' && couponFormTimerMinutes > 0) {
      calculatedValidUntil = new Date(Date.now() + couponFormTimerMinutes * 60 * 1000).toISOString();
    } else if (couponFormExpiry) {
      calculatedValidUntil = new Date(`${couponFormExpiry}T23:59:59.999Z`).toISOString();
    }

    const newCouponPayload = {
      code: cleanCode,
      courseId: couponFormCourseId,
      discountType: couponFormType,
      discountValue: val,
      maxUses: maxU > 0 ? maxU : -1,
      isActive: couponFormIsActive,
      validUntil: calculatedValidUntil,
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

  const getCouponExpiryDisplay = (coupon: CourseCoupon) => {
    if (!coupon.validUntil) {
      return <span className="text-slate">Never</span>;
    }

    const expiryTime = new Date(coupon.validUntil).getTime();
    const diffMs = expiryTime - Date.now();

    if (diffMs <= 0) {
      return (
        <span className="inline-flex items-center gap-1 text-rose-400 font-bold px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-[10px]">
          <Clock className="w-3 h-3" />
          <span>Expired</span>
        </span>
      );
    }

    // If expiring within 48 hours, show live countdown
    if (diffMs <= 48 * 3600 * 1000) {
      const hours = Math.floor(diffMs / (3600 * 1000));
      const mins = Math.floor((diffMs % (3600 * 1000)) / (60 * 1000));
      const secs = Math.floor((diffMs % (60 * 1000)) / 1000);

      let timeText = '';
      if (hours > 0) {
        timeText = `${hours}h ${mins}m`;
      } else if (mins > 0) {
        timeText = `${mins}m ${secs}s`;
      } else {
        timeText = `${secs}s`;
      }

      return (
        <div className="space-y-0.5">
          <span className="inline-flex items-center gap-1 text-amber-300 font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px]">
            <Clock className="w-3 h-3 animate-pulse text-amber-400" />
            <span>{timeText} left</span>
          </span>
          <span className="block text-[9px] text-slate/60 font-mono">
            Ends {new Date(coupon.validUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      );
    }

    return (
      <span className="text-paper">
        {new Date(coupon.validUntil).toLocaleDateString()}
      </span>
    );
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

          {/* Description / Campaign Note */}
          <div>
            <label className="block text-xs font-bold text-slate mb-1">Description / Campaign Note</label>
            <input
              type="text"
              value={couponFormDesc}
              onChange={(e) => setCouponFormDesc(e.target.value)}
              placeholder="e.g. 30-minute flash sale, Early bird special"
              className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper focus:border-primary focus:outline-none text-xs"
            />
          </div>

          {/* Limited-Time Offer Timer (Admin Only) */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <label className="text-xs font-bold text-paper">Limited-Time Offer Timer <span className="text-[10px] font-normal text-slate">(Optional • Admin Only)</span></label>
              </div>
              <span className="text-[10px] text-slate/80">Timer is hidden from students; coupon strictly expires upon timeout</span>
            </div>

            {/* Timer Presets */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'none', label: 'No Timer' },
                { id: '30m', label: '30 Mins', mins: 30 },
                { id: '1h', label: '1 Hour', mins: 60 },
                { id: '2h', label: '2 Hours', mins: 120 },
                { id: '6h', label: '6 Hours', mins: 360 },
                { id: '24h', label: '24 Hours', mins: 1440 },
                { id: 'custom', label: 'Custom' }
              ].map(preset => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setCouponFormTimerMode(preset.id as any);
                    if (preset.mins) {
                      setCouponFormTimerMinutes(preset.mins);
                      setCouponFormExpiry('');
                    } else if (preset.id === 'none') {
                      // reset
                    } else if (preset.id === 'custom') {
                      setCouponFormExpiry('');
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-jakarta font-bold transition-all cursor-pointer ${
                    couponFormTimerMode === preset.id
                      ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                      : 'bg-white/5 text-slate hover:bg-white/10 hover:text-paper border border-white/10'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom Minutes Input */}
            {couponFormTimerMode === 'custom' && (
              <div className="flex items-center gap-3 pt-1">
                <label className="text-xs font-mono text-slate whitespace-nowrap">Duration in Minutes:</label>
                <input
                  type="number"
                  min="1"
                  max="10080"
                  value={couponFormTimerMinutes}
                  onChange={(e) => setCouponFormTimerMinutes(Math.max(1, Number(e.target.value)))}
                  className="w-32 bg-black border border-white/15 rounded-xl px-3 py-1.5 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                  placeholder="e.g. 45"
                />
                <span className="text-xs text-slate">({Math.floor(couponFormTimerMinutes / 60)}h {couponFormTimerMinutes % 60}m)</span>
              </div>
            )}

            {/* Active Timer Preview Banner */}
            {couponFormTimerMode !== 'none' ? (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 animate-pulse text-amber-400 shrink-0" />
                  <span>
                    Expires in <strong>{couponFormTimerMinutes} minutes</strong> from saving (around {new Date(Date.now() + couponFormTimerMinutes * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                  </span>
                </div>
                <span className="text-[10px] text-amber-200/70 font-mono hidden sm:inline">Admin-only countdown</span>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate mb-1">Standard Expiry Date (Optional Calendar Date)</label>
                <input
                  type="date"
                  value={couponFormExpiry}
                  onChange={(e) => setCouponFormExpiry(e.target.value)}
                  className="w-full sm:w-64 bg-black border border-white/15 rounded-xl px-3 py-2 text-paper focus:border-primary focus:outline-none text-xs"
                />
              </div>
            )}
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
    // Focus strictly on successful coupon-based purchases as requested
    const couponPurchasesList = coursePurchases.filter(
      p => Boolean(p.couponCodeApplied) && (p.status === 'completed' || p.accessGranted)
    );
    const totalCouponPurchases = couponPurchasesList.length;
    const activeCouponsCount = courseCoupons.filter(c => c.isActive).length;

    const filteredPurchases = couponPurchasesList.filter(p => {
      // 1. Course Filter
      if (purchaseCourseFilter !== 'all') {
        const normalizedTarget = normalizeCourseId(purchaseCourseFilter);
        const normalizedItem = normalizeCourseId(p.courseId || p.courseName || '');
        if (normalizedTarget !== normalizedItem) return false;
      }

      // 2. Date Filter
      if (purchaseDateFilter !== 'all') {
        const pDate = new Date(p.purchasedAt);
        const now = new Date();
        if (purchaseDateFilter === 'today') {
          const isSameDay = pDate.getFullYear() === now.getFullYear() &&
                            pDate.getMonth() === now.getMonth() &&
                            pDate.getDate() === now.getDate();
          if (!isSameDay) return false;
        } else if (purchaseDateFilter === '7days') {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (pDate < sevenDaysAgo) return false;
        } else if (purchaseDateFilter === '30days') {
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (pDate < thirtyDaysAgo) return false;
        } else if (purchaseDateFilter === 'custom') {
          if (customStartDate) {
            const start = new Date(customStartDate);
            start.setHours(0, 0, 0, 0);
            if (pDate < start) return false;
          }
          if (customEndDate) {
            const end = new Date(customEndDate);
            end.setHours(23, 59, 59, 999);
            if (pDate > end) return false;
          }
        }
      }

      // 3. Search query: student name, email, course name, coupon code
      if (purchaseSearch.trim()) {
        const q = purchaseSearch.toLowerCase().trim();
        const matchName = p.studentName?.toLowerCase().includes(q);
        const matchEmail = p.studentEmail?.toLowerCase().includes(q);
        const matchCourse = p.courseName?.toLowerCase().includes(q);
        const matchCoupon = p.couponCodeApplied?.toLowerCase().includes(q);
        return Boolean(matchName || matchEmail || matchCourse || matchCoupon);
      }

      return true;
    });

    return (
      <section id="section-course-pricing" className="rounded-3xl bg-[#0c0d0e] border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-1.5 mb-1 text-primary font-mono text-[10px] uppercase font-bold tracking-wider">
              <Tag className="w-3 h-3" />
              <span>E-Commerce &amp; Access Control</span>
            </div>
            <h2 className="font-jakarta text-lg font-black text-paper">
              Course Pricing
            </h2>
            <p className="text-xs text-slate mt-0.5">
              Set individual course pricing, toggle free course access, create coupon codes, and verify student Google Pay UPI enrollments.
            </p>
          </div>

          {/* Quick Metrics Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate uppercase">Active Tracks:</span>
              <span className="text-xs font-jakarta font-bold text-paper">4 Courses</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate uppercase">Active Coupons:</span>
              <span className="text-xs font-jakarta font-bold text-primary">{activeCouponsCount} Codes</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate uppercase">Coupon Enrollments:</span>
              <span className="text-xs font-jakarta font-bold text-emerald-400">{totalCouponPurchases} Students</span>
            </div>
          </div>
        </div>

        {/* Section 1: Course Pricing */}
        <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
            <div>
              <h3 className="font-jakarta font-bold text-sm text-paper flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-primary" />
                Course Pricing
              </h3>
              <p className="text-xs text-slate mt-0.5">
                Select a course from the dropdown to modify its regular price, sale price, or toggle 100% Free Course access.
              </p>
            </div>
          </div>

          {/* Course Selection Dropdown */}
          <div className="max-w-md space-y-1">
            <label className="block text-[11px] font-mono font-bold text-slate uppercase tracking-wider">
              Select Course
            </label>
            <div className="relative">
              <select
                value={selectedPricingCourseId}
                onChange={(e) => setSelectedPricingCourseId(e.target.value)}
                className="w-full bg-black/80 border border-white/15 rounded-xl px-3.5 py-2 text-paper font-jakarta font-bold text-xs focus:border-primary focus:outline-none cursor-pointer pr-8"
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
            <form onSubmit={handleSaveCoursePricing} className="p-4 sm:p-5 rounded-xl bg-black/60 border border-white/5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                <div>
                  <h4 className="font-jakarta font-bold text-sm text-paper">
                    Editing Pricing: <span className="text-primary">{activeCoursePricing.courseName}</span>
                  </h4>
                  <p className="text-xs text-slate font-mono">Course ID: {activeCoursePricing.courseId}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate">Status:</span>
                  <button
                    type="button"
                    onClick={() => setPricingIsActive(!pricingIsActive)}
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono transition-all cursor-pointer ${
                      pricingIsActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {pricingIsActive ? 'Active for Enrollment' : 'Enrollments Paused'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                <div>
                  <label className="block text-[11px] font-bold text-slate mb-1">Regular Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-slate text-xs">₹</span>
                    <input
                      type="number"
                      min="0"
                      required
                      value={pricingRegularInput}
                      onChange={(e) => setPricingRegularInput(Number(e.target.value))}
                      className="w-full h-[38px] bg-black border border-white/15 rounded-xl pl-7 pr-3 py-1.5 text-paper font-mono text-xs focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate mb-1">Sale Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-primary text-xs font-bold">₹</span>
                    <input
                      type="number"
                      min="0"
                      required
                      value={pricingSaleInput}
                      onChange={(e) => setPricingSaleInput(Number(e.target.value))}
                      className="w-full h-[38px] bg-black border border-white/15 rounded-xl pl-7 pr-3 py-1.5 text-paper font-mono text-xs font-bold focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate mb-1">Access Type</label>
                  <label className="h-[38px] px-3.5 rounded-xl bg-white/5 border border-white/15 flex items-center gap-2 cursor-pointer hover:bg-white/10 transition-colors">
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
                    className="w-full h-[38px] px-4 rounded-xl bg-primary text-black font-jakarta font-bold text-xs hover:bg-white transition-all flex items-center justify-center gap-1.5 shadow-md shadow-primary/20 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
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

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5 text-xs text-slate">
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
        <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
            <div>
              <h3 className="font-jakarta font-bold text-sm text-paper flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" />
                Course Coupon Codes
              </h3>
              <p className="text-xs text-slate mt-0.5">Manage promo codes, percentage discounts, and 100% free ₹0 instant unlock codes.</p>
            </div>
            <button
              type="button"
              onClick={() => handleOpenCouponModal()}
              className="py-1.5 px-3 rounded-xl bg-primary text-black font-jakarta font-bold text-xs hover:bg-white transition-all flex items-center gap-1.5 shadow-md shadow-primary/20 self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Coupon</span>
            </button>
          </div>

          {/* Coupon Codes Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[650px] text-left text-xs text-paper">
              <thead className="bg-white/5 text-slate font-mono uppercase text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-2.5 px-3">Coupon Code</th>
                  <th className="py-2.5 px-3">Discount</th>
                  <th className="py-2.5 px-3">Applies To</th>
                  <th className="py-2.5 px-3">Usage Limit</th>
                  <th className="py-2.5 px-3">Expiry</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {courseCoupons.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate">
                      No coupon codes created yet. Click "Create New Coupon" to add one.
                    </td>
                  </tr>
                ) : (
                  courseCoupons.map(coupon => {
                    const is100Free = coupon.discountType === 'percentage' && coupon.discountValue === 100;
                    return (
                      <tr key={coupon.code} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-primary tracking-wider px-2 py-0.5 bg-primary/10 rounded-md border border-primary/20">
                              {coupon.code}
                            </span>
                            {coupon.description && (
                              <span className="text-[10px] text-slate truncate max-w-[150px]" title={coupon.description}>
                                {coupon.description}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold">
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
                        <td className="py-2.5 px-3 font-mono text-slate">
                          {coupon.courseId === 'all' ? (
                            <span className="text-paper font-semibold">All Courses</span>
                          ) : (
                            <span>{coursePricingList.find(c => c.courseId === coupon.courseId)?.courseName || coupon.courseId}</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          <span className="text-paper">{coupon.usedCount}</span>
                          <span className="text-slate"> / {coupon.maxUses && coupon.maxUses > 0 ? coupon.maxUses : 'Unlimited'}</span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate">
                          {getCouponExpiryDisplay(coupon)}
                        </td>
                        <td className="py-2.5 px-3">
                          <button
                            type="button"
                            onClick={() => handleToggleCoupon(coupon.code)}
                            className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold transition-all cursor-pointer ${
                              coupon.isActive
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            }`}
                          >
                            {coupon.isActive ? 'Active' : 'Disabled'}
                          </button>
                        </td>
                        <td className="py-2.5 px-3 text-right space-x-1.5">
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
        <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/5">
            <div>
              <h3 className="font-jakarta font-bold text-sm text-paper flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                <span>Purchase &amp; Enrollment Tracking</span>
              </h3>
              <p className="text-xs text-slate mt-0.5">
                Displaying verified coupon-based purchases with live student enrollment records.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 font-mono text-[11px] text-paper">
                Successful Coupon Purchases: <strong>{totalCouponPurchases}</strong>
              </span>
            </div>
          </div>

          {/* Clean Controls: Search, Date Filter, and Course Filter */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-slate absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by student, email, course, or coupon code..."
                value={purchaseSearch}
                onChange={(e) => setPurchaseSearch(e.target.value)}
                className="w-full bg-black/80 border border-white/15 rounded-xl pl-8 pr-3 py-2 text-xs text-paper font-mono focus:border-primary focus:outline-none"
              />
            </div>

            {/* Filter Bar: Course and Date Filter */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Course Selector Filter */}
              <select
                value={purchaseCourseFilter}
                onChange={(e) => setPurchaseCourseFilter(e.target.value)}
                className="bg-black/80 border border-white/15 rounded-xl px-3 py-2 text-xs text-paper font-mono focus:border-primary focus:outline-none cursor-pointer"
              >
                <option value="all">All Courses</option>
                {coursePricingList.map(c => (
                  <option key={c.courseId} value={c.courseId}>{c.courseName}</option>
                ))}
              </select>

              {/* Date Filter Buttons */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-black/60 border border-white/10 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setPurchaseDateFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    purchaseDateFilter === 'all'
                      ? 'bg-primary text-ink font-bold shadow'
                      : 'text-slate hover:text-paper'
                  }`}
                >
                  All Dates
                </button>
                <button
                  type="button"
                  onClick={() => setPurchaseDateFilter('today')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    purchaseDateFilter === 'today'
                      ? 'bg-primary text-ink font-bold shadow'
                      : 'text-slate hover:text-paper'
                  }`}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setPurchaseDateFilter('7days')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    purchaseDateFilter === '7days'
                      ? 'bg-primary text-ink font-bold shadow'
                      : 'text-slate hover:text-paper'
                  }`}
                >
                  Last 7 Days
                </button>
                <button
                  type="button"
                  onClick={() => setPurchaseDateFilter('30days')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    purchaseDateFilter === '30days'
                      ? 'bg-primary text-ink font-bold shadow'
                      : 'text-slate hover:text-paper'
                  }`}
                >
                  Last 30 Days
                </button>
                <button
                  type="button"
                  onClick={() => setPurchaseDateFilter('custom')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    purchaseDateFilter === 'custom'
                      ? 'bg-primary text-ink font-bold shadow'
                      : 'text-slate hover:text-paper'
                  }`}
                >
                  Custom Range
                </button>
              </div>
            </div>
          </div>

          {/* Custom Date Range Pickers (shown only when Custom Range selected) */}
          {purchaseDateFilter === 'custom' && (
            <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/10 text-xs font-mono">
              <span className="text-slate">From:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="bg-black border border-white/15 rounded-lg px-2.5 py-1 text-paper text-xs focus:border-primary focus:outline-none"
              />
              <span className="text-slate">To:</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="bg-black border border-white/15 rounded-lg px-2.5 py-1 text-paper text-xs focus:border-primary focus:outline-none"
              />
              {(customStartDate || customEndDate) && (
                <button
                  type="button"
                  onClick={() => { setCustomStartDate(''); setCustomEndDate(''); }}
                  className="text-rose-400 hover:underline text-[11px] cursor-pointer"
                >
                  Clear Range
                </button>
              )}
            </div>
          )}

          {/* Transactions List */}
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[720px] text-left text-xs text-paper">
              <thead className="bg-white/5 text-slate font-mono uppercase text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-2.5 px-3">Student Name &amp; Email</th>
                  <th className="py-2.5 px-3">Course Name</th>
                  <th className="py-2.5 px-3">Final Amount Paid</th>
                  <th className="py-2.5 px-3">Coupon Code Used</th>
                  <th className="py-2.5 px-3">Purchase Status</th>
                  <th className="py-2.5 px-3">Actual Purchase Date &amp; Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {filteredPurchases.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate font-mono text-xs">
                      No coupon-based purchase records found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredPurchases.map(rec => {
                    const purchaseDate = new Date(rec.purchasedAt);
                    const formattedDate = !isNaN(purchaseDate.getTime())
                      ? purchaseDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                      : rec.purchasedAt;
                    const formattedTime = !isNaN(purchaseDate.getTime())
                      ? purchaseDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                      : '';

                    return (
                      <tr key={rec.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-paper font-jakarta text-xs">{rec.studentName || 'Student'}</div>
                          <div className="font-mono text-[11px] text-slate truncate max-w-[220px]">{rec.studentEmail}</div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="font-medium text-paper font-jakarta text-xs">{rec.courseName}</div>
                          <span className="font-mono text-[9px] text-slate/60">ID: {rec.courseId}</span>
                        </td>

                        <td className="py-3 px-3 font-mono">
                          <div className="text-emerald-400 font-bold text-xs">
                            {rec.finalAmount === 0 ? '₹0 (100% Free)' : `₹${rec.finalAmount.toLocaleString()}`}
                          </div>
                          {rec.originalPrice > rec.finalAmount && (
                            <div className="text-slate line-through text-[10px]">
                              ₹{rec.originalPrice.toLocaleString()}
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-3">
                          <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 font-mono font-bold text-xs inline-block tracking-wider">
                            {rec.couponCodeApplied || 'N/A'}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{rec.status === 'completed' || rec.accessGranted ? 'Enrolled & Verified' : rec.status}</span>
                          </span>
                        </td>

                        <td className="py-3 px-3 text-slate font-mono text-[11px]">
                          <div className="text-paper/90 font-medium">{formattedDate}</div>
                          <div className="text-slate/60 text-[10px]">{formattedTime}</div>
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
    return (
      <section className="space-y-6 animate-fadeIn">
        {/* Main Settings Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0c0d0e] border border-white/10 shadow-2xl space-y-5">
          <div className="pb-3 border-b border-white/10">
            <h3 className="font-jakarta font-bold text-sm text-paper flex items-center gap-2">
              <QrCode className="w-4 h-4 text-primary" />
              Google Pay Credentials &amp; Cloudflare QR Code
            </h3>
            <p className="text-xs text-slate mt-0.5">
              Set recipient credentials and Cloudflare QR image URL. Verified in real-time before saving.
            </p>
          </div>

          <form onSubmit={handleSavePaymentSettings} className="space-y-4">
            {/* Row 1: Recipient Full Name & Banking Display Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate mb-1">
                  Recipient's Full Name
                </label>
                <input
                  type="text"
                  value={recipientNameInput}
                  onChange={e => setRecipientNameInput(e.target.value)}
                  placeholder="e.g. Jayadev Nair"
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-paper text-xs focus:border-primary focus:outline-none"
                  required
                />
                <p className="text-[10px] text-slate mt-1">Personal recipient display name.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate mb-1">
                  Bank Account Display Name
                </label>
                <input
                  type="text"
                  value={bankingNameInput}
                  onChange={e => setBankingNameInput(e.target.value)}
                  placeholder="e.g. JAYADEV NAIR"
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-paper text-xs focus:border-primary focus:outline-none uppercase"
                  required
                />
                <p className="text-[10px] text-slate mt-1">Exact name registered with bank / UPI handle.</p>
              </div>
            </div>

            {/* Row 2: Phone Number & UPI ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phoneNumberInput}
                  onChange={e => setPhoneNumberInput(e.target.value)}
                  placeholder="e.g. +91 97459 49326"
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-paper text-xs font-mono focus:border-primary focus:outline-none"
                  required
                />
                <p className="text-[10px] text-slate mt-1">Linked phone number for Google Pay.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate mb-1">
                  Google Pay UPI ID (VPA)
                </label>
                <input
                  type="text"
                  value={qrUpiIdInput}
                  onChange={e => setQrUpiIdInput(e.target.value)}
                  placeholder="e.g. jayadevnair200518@oksbi"
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-paper text-xs font-mono focus:border-primary focus:outline-none"
                  required
                />
                <p className="text-[10px] text-slate mt-1">Students send payment to this UPI ID.</p>
              </div>
            </div>

            {/* Row 3: Cloudflare QR Image URL */}
            <div className="space-y-2 p-3.5 rounded-xl bg-black/40 border border-white/10">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate flex items-center gap-1.5">
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
                  className="flex-1 px-3 py-2 rounded-xl bg-black border border-white/15 text-paper text-xs font-mono focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  disabled={isVerifyingQrUrl || !qrImageUrlInput.trim()}
                  onClick={() => handleTestQrUrl()}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-paper text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isVerifyingQrUrl ? 'animate-spin' : ''}`} />
                  <span>{isVerifyingQrUrl ? 'Verifying...' : 'Verify URL'}</span>
                </button>
              </div>

              {/* Verification Status Feedback */}
              {qrUrlVerificationStatus === 'valid' && (
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>{qrUrlVerificationMsg || 'Image URL verified successfully!'}</span>
                </div>
              )}

              {qrUrlVerificationStatus === 'invalid' && (
                <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-xs flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{qrUrlVerificationMsg || 'Image failed to load. Please verify the URL.'}</span>
                </div>
              )}

              <p className="text-[10px] text-slate leading-relaxed">
                Paste a publicly accessible Cloudflare R2 / CDN image URL. We dynamically test that the image loads before saving without requiring separate cloud storage. If left empty, a crisp dynamic Google Pay QR is generated.
              </p>
            </div>

            {/* Row 4: Session Timer & Instructions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate mb-1">
                  Session Timer (Minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={qrTimeoutMinutesInput}
                  onChange={e => setQrTimeoutMinutesInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-paper text-xs font-mono focus:border-primary focus:outline-none"
                  required
                />
                <p className="text-[10px] text-slate mt-1">Payment expiry countdown (1 - 60 min).</p>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate mb-1">
                  Student Instructions
                </label>
                <textarea
                  rows={2}
                  value={qrInstructionsInput}
                  onChange={e => setQrInstructionsInput(e.target.value)}
                  placeholder="Instructions shown on student checkout modal..."
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-paper text-xs focus:border-primary focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Checkbox: Enable Checkout */}
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/10 cursor-pointer select-none">
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

            {/* Bottom Form Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={handleResetPaymentSettingsToDefaults}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate hover:text-paper font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Defaults</span>
              </button>

              <button
                type="submit"
                disabled={isSavingQrConfig}
                className="w-full sm:w-auto py-2 px-6 rounded-xl bg-primary text-ink font-jakarta font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-primary/20 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingQrConfig ? 'Saving Settings...' : 'Save Payment Settings'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Section 2: Manual UPI Payment Verifications Queue */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0c0d0e] border border-white/10 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-jakarta font-bold text-sm text-paper flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Manual UPI Payment Verifications Queue
                </h3>
                {pendingManualPayments.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
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
            <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 text-center space-y-1.5">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto opacity-80" />
              <div className="text-xs font-bold text-paper">No Pending UPI Verifications</div>
              <p className="text-[11px] text-slate max-w-md mx-auto">
                All manual UPI payments have been verified or no new requests have been submitted. When a student submits their 12-digit UTR, it will appear here for one-click approval.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {pendingManualPayments.map(payment => (
                <div
                  key={payment.id}
                  className="p-3.5 rounded-xl bg-black/60 border border-amber-500/30 hover:border-amber-500/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md shadow-amber-500/5"
                >
                  <div className="space-y-1 min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-paper text-xs">{payment.studentName}</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                        Pending
                      </span>
                    </div>
                    <div className="text-[11px] text-slate font-mono">{payment.studentEmail}</div>
                    {payment.studentPhone && (
                      <div className="text-[11px] text-slate font-mono">Phone: {payment.studentPhone}</div>
                    )}
                  </div>

                  <div className="space-y-0.5 min-w-[150px]">
                    <div className="text-[10px] font-mono text-slate uppercase">Enrolling Course</div>
                    <div className="text-xs font-bold text-paper">{payment.courseName}</div>
                    <div className="text-xs font-mono font-bold text-emerald-400">
                      Amount: ₹{payment.finalAmount}
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-[10px] font-mono text-slate uppercase">12-Digit UPI UTR Reference</div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-xs text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30 tracking-wider select-all">
                        {payment.utrNumber || 'No UTR provided'}
                      </span>
                      {payment.utrNumber && (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(payment.utrNumber || '');
                            showToast('Copied UTR to clipboard!');
                          }}
                          className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-paper cursor-pointer"
                          title="Copy UTR Reference"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={verifyingPurchaseId === payment.id}
                      onClick={() => handleVerifyManualPayment(payment.id, true)}
                      className="py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50 transition-all"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Verify & Unlock</span>
                    </button>
                    <button
                      type="button"
                      disabled={verifyingPurchaseId === payment.id}
                      onClick={() => handleVerifyManualPayment(payment.id, false)}
                      className="py-1.5 px-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-bold text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50 transition-all"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
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
    if (adminWorkspace === 'rewards') {
      return { group: 'Student Hub', title: 'Milestone Rewards' };
    }
    if (adminWorkspace === 'studentHelp') {
      return { group: 'Student Hub', title: 'Student Help' };
    }
    if (adminWorkspace === 'courseReset') {
      return { group: 'Student Hub', title: 'Course Reset' };
    }
    if (adminWorkspace === 'permanentDelete') {
      return { group: 'Student Hub', title: 'Permanent Student Deletion' };
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
                <span className="font-jakarta text-xs font-semibold truncate">Student Data</span>
              </div>
              <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                adminWorkspace === 'students' ? 'bg-black/20 text-ink' : 'bg-primary/20 text-primary'
              }`}>
                {students.length} Learners
              </span>
            </button>

            {/* 2. Rewards */}
            <button
              type="button"
              onClick={() => navigateToWorkspace('rewards')}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                adminWorkspace === 'rewards'
                  ? 'bg-primary text-ink font-bold shadow-md shadow-primary/20'
                  : 'text-slate hover:text-paper hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Trophy className="w-4 h-4 shrink-0 text-amber-400" />
                <span className="font-jakarta text-xs font-semibold truncate">Rewards</span>
              </div>
              <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                adminWorkspace === 'rewards'
                  ? 'bg-black/20 text-ink'
                  : pendingRewardCount > 0
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-white/10 text-slate'
              }`}>
                {rewardRequests.length} Claims{pendingRewardCount > 0 ? ` (${pendingRewardCount} New)` : ''}
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

            {/* 4. Permanent Delete */}
            <button
              type="button"
              onClick={() => navigateToWorkspace('permanentDelete')}
              className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                adminWorkspace === 'permanentDelete'
                  ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/25'
                  : 'text-slate hover:text-paper hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Trash2 className="w-4 h-4 shrink-0 text-rose-400" />
                <span className="font-jakarta text-xs font-semibold truncate">Permanent Delete</span>
              </div>
              <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                adminWorkspace === 'permanentDelete'
                  ? 'bg-black/30 text-white'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {students.length} Learners
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
                {courseCoupons.filter(c => c.isActive).length} Active
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
                {activeSection === 'security' && renderSecuritySection()}
                {activeSection === 'studentExport' && renderStudentExportSection()}
              </>
            ) : adminWorkspace === 'students' ? (
              renderStudentsSection()
            ) : adminWorkspace === 'permanentDelete' ? (
              renderPermanentDeleteSection()
            ) : adminWorkspace === 'rewards' ? (
              renderRewardRequestsSection()
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

      {/* Root-Level Permanent Delete Confirmation Modal */}
      {deleteModalTarget && renderPermanentDeleteConfirmModal()}

      {/* Recovery Email Setup & Protected 2-Step Change Modal */}
      {emailChangeModalTarget && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="max-w-md w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0c0d0e] border border-white/15 p-5 sm:p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-jakarta font-bold text-base text-paper">
                  {emailModalMode === 'initialSetup'
                    ? `Setup ${emailChangeModalTarget === 'primary' ? 'Primary' : 'Secondary'} Email`
                    : `Change ${emailChangeModalTarget === 'primary' ? 'Primary' : 'Secondary'} Email`}
                </h3>
                <p className="text-xs text-slate mt-0.5">
                  {emailModalMode === 'initialSetup'
                    ? 'Verify ownership with a 6-digit OTP to activate this slot.'
                    : 'Two-step verification to securely replace this address.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEmailChangeModalTarget(null)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-slate hover:text-paper flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Status notification */}
            {emailChangeStatus.type !== 'idle' && (
              <div
                className={`p-2.5 rounded-xl font-mono text-xs text-center border ${
                  emailChangeStatus.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}
              >
                {emailChangeStatus.message}
              </div>
            )}

            {/* INITIAL SETUP MODE */}
            {emailModalMode === 'initialSetup' ? (
              <form onSubmit={handleInitialSetupVerify} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-xs font-bold text-slate mb-1">
                    {emailChangeModalTarget === 'primary' ? 'Primary' : 'Secondary'} Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={emailChangeNewAddress}
                    onChange={(e) => setEmailChangeNewAddress(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleInitialSetupSendOtp}
                  disabled={emailChangeLoading || !emailChangeNewAddress.trim() || emailChangeCooldown > 0}
                  className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-slate hover:text-paper font-jakarta text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>
                    {emailChangeLoading
                      ? 'Sending OTP...'
                      : emailChangeCooldown > 0
                      ? `Resend in ${emailChangeCooldown}s`
                      : 'Send Verification OTP'}
                  </span>
                </button>

                <div>
                  <label className="block text-xs font-bold text-slate mb-1">
                    Enter 6-Digit OTP *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={emailChangeStep2Otp}
                    onChange={(e) => setEmailChangeStep2Otp(e.target.value.replace(/\D/g, ''))}
                    placeholder="6-digit code"
                    className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper focus:border-primary focus:outline-none font-mono text-xs tracking-widest text-center"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setEmailChangeModalTarget(null)}
                    className="py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate hover:text-paper font-jakarta font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={emailChangeLoading || emailChangeStep2Otp.length !== 6 || !emailChangeNewAddress.trim()}
                    className="flex-1 py-2 px-4 rounded-xl bg-primary text-ink font-jakarta font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-md shadow-primary/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {emailChangeLoading ? 'Verifying...' : 'Verify & Activate'}
                  </button>
                </div>
              </form>
            ) : (
              /* 2-STEP PROTECTED CHANGE MODE */
              (() => {
                const otherEmail = emailChangeModalTarget === 'primary' ? getAdminEmails().secondaryEmail : getAdminEmails().primaryEmail;
                if (!otherEmail) {
                  return (
                    <div className="space-y-3 text-xs">
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-slate space-y-1">
                        <div className="font-bold text-paper">Other Slot Required</div>
                        <p className="text-[11px] text-slate leading-relaxed">
                          Changing this address requires authorization through the other slot ({emailChangeModalTarget === 'primary' ? 'Secondary' : 'Primary'}). Please set up the second slot first.
                        </p>
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEmailChangeModalTarget(null)}
                          className="py-2 px-3.5 rounded-xl bg-white/5 text-slate hover:text-paper font-jakarta font-bold text-xs cursor-pointer"
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEmailSetupModal(emailChangeModalTarget === 'primary' ? 'secondary' : 'primary')}
                          className="py-2 px-3.5 rounded-xl bg-primary text-ink font-jakarta font-bold text-xs uppercase tracking-wider cursor-pointer"
                        >
                          Setup Other Slot First
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="space-y-3.5 text-xs">

                    {/* STEP 1: Verify Other Email */}
                    {emailChangeStep === 1 && (
                      <form onSubmit={handleEmailChangeStep1Verify} className="space-y-3">
                        <p className="text-slate text-[11px]">
                          We will send an authorization code to your other registered address: <strong className="text-paper">{otherEmail}</strong>
                        </p>

                        <button
                          type="button"
                          onClick={handleEmailChangeStep1SendOtp}
                          disabled={emailChangeLoading || emailChangeCooldown > 0}
                          className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-slate hover:text-paper font-jakarta text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>
                            {emailChangeLoading
                              ? 'Sending OTP...'
                              : emailChangeCooldown > 0
                              ? `Resend in ${emailChangeCooldown}s`
                              : 'Send Authorization Code'}
                          </span>
                        </button>

                        <div>
                          <label className="block text-xs font-bold text-slate mb-1">Enter 6-Digit Code *</label>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={emailChangeStep1Otp}
                            onChange={(e) => setEmailChangeStep1Otp(e.target.value.replace(/\D/g, ''))}
                            placeholder="6-digit code"
                            className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper focus:border-primary focus:outline-none font-mono text-xs tracking-widest text-center"
                          />
                        </div>

                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setEmailChangeModalTarget(null)}
                            className="py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate hover:text-paper font-jakarta font-bold text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={emailChangeLoading || emailChangeStep1Otp.length !== 6}
                            className="flex-1 py-2 px-4 rounded-xl bg-primary text-ink font-jakarta font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-md shadow-primary/20 transition-all cursor-pointer disabled:opacity-50"
                          >
                            Verify &amp; Continue
                          </button>
                        </div>
                      </form>
                    )}

                    {/* STEP 2: Verify New Email */}
                    {emailChangeStep === 2 && (
                      <form onSubmit={handleEmailChangeStep2Confirm} className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate mb-1">New Email Address *</label>
                          <input
                            type="email"
                            required
                            value={emailChangeNewAddress}
                            onChange={(e) => setEmailChangeNewAddress(e.target.value)}
                            placeholder="new.email@example.com"
                            className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper focus:border-primary focus:outline-none font-mono text-xs"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleEmailChangeStep2SendOtp}
                          disabled={emailChangeLoading || !emailChangeNewAddress || emailChangeCooldown > 0}
                          className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-slate hover:text-paper font-jakarta text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>
                            {emailChangeLoading
                              ? 'Sending Code...'
                              : emailChangeCooldown > 0
                              ? `Resend in ${emailChangeCooldown}s`
                              : 'Send Code to New Email'}
                          </span>
                        </button>

                        <div>
                          <label className="block text-xs font-bold text-slate mb-1">Enter Code Received at New Email *</label>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={emailChangeStep2Otp}
                            onChange={(e) => setEmailChangeStep2Otp(e.target.value.replace(/\D/g, ''))}
                            placeholder="6-digit code"
                            className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-paper focus:border-primary focus:outline-none font-mono text-xs tracking-widest text-center"
                          />
                        </div>

                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setEmailChangeModalTarget(null)}
                            className="py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate hover:text-paper font-jakarta font-bold text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={emailChangeLoading || emailChangeStep2Otp.length !== 6 || !emailChangeNewAddress}
                            className="flex-1 py-2 px-4 rounded-xl bg-primary text-ink font-jakarta font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-md shadow-primary/20 transition-all cursor-pointer disabled:opacity-50"
                          >
                            Confirm &amp; Save
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                );
              })()
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
