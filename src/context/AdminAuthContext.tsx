import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  hashPassword,
  verifyPasswordHash,
  generateSalt,
  generateSecureOTP,
  safeEqual
} from '../utils/securityCrypto';

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  affectedUser?: string;
  affectedCourse?: string;
  adminUser?: string;
}

export interface AdminSecurityConfig {
  username: string;
  passwordHash: string;
  passwordSalt: string;
  primaryEmail: string;
  secondaryEmail: string;
  updatedAt: string;
}

interface DualOTPState {
  mode: 'primary' | 'secondary' | 'both';
  primaryOtp?: string;
  secondaryOtp?: string;
  expiresAt: number;
  attemptsLeft: number;
  createdAt: number;
}

interface EmailChangeSession {
  target: 'primary' | 'secondary';
  step: 1 | 2;
  step1Otp?: string;
  step1ExpiresAt?: number;
  step1Attempts?: number;
  step1Verified?: boolean;
  newEmail?: string;
  step2Otp?: string;
  step2ExpiresAt?: number;
  step2Attempts?: number;
  lastSentAt: number;
}

interface InitialSetupSession {
  target: 'primary' | 'secondary';
  email: string;
  otp: string;
  expiresAt: number;
  attemptsLeft: number;
  lastSentAt: number;
}

interface AdminAuthContextType {
  token: string | null;
  emergencyToken: string | null;
  secondsRemaining: number;
  isUnlocked: boolean;
  isLoggedIn: boolean;
  lockoutTimeLeft: number;
  failedAttempts: number;
  auditLogs: AuditLog[];
  isSecurityLoading: boolean;

  // Navigation & Gateway access
  triggerSecretAccess: () => void;
  triggerEmergencyRecovery: () => void;
  invalidateSecretAccess: () => void;
  invalidateEmergencyAccess: () => void;

  // Authentication
  loginAdmin: (user: string, pass: string) => Promise<{ success: boolean; message: string }>;
  logoutAdmin: () => void;

  // Method A: Current Password
  changePasswordMethodA: (
    currentUsername: string,
    currentPassword: string,
    newPassword: string
  ) => Promise<{ success: boolean; message: string }>;

  // Method B: Email Recovery
  requestMethodBOTP: (
    deliveryMode: 'primary' | 'secondary' | 'both'
  ) => Promise<{ success: boolean; message: string; cooldownRemaining?: number }>;
  verifyMethodBOTPAndChangePassword: (
    deliveryMode: 'primary' | 'secondary' | 'both',
    otpPrimary: string,
    otpSecondary: string,
    newPassword: string
  ) => Promise<{ success: boolean; message: string }>;

  // Initial Fresh Recovery Email Setup
  setupInitialRecoveryEmail: (
    target: 'primary' | 'secondary',
    emailAddress: string
  ) => Promise<{ success: boolean; message: string; cooldownRemaining?: number }>;
  verifyAndSaveInitialRecoveryEmail: (
    target: 'primary' | 'secondary',
    emailAddress: string,
    otp: string
  ) => Promise<{ success: boolean; message: string }>;

  // Changing an Existing Recovery Email Address (Independent 2-Step Flow)
  requestChangeEmailStep1: (
    targetToChange: 'primary' | 'secondary'
  ) => Promise<{ success: boolean; message: string; otherEmail: string }>;
  verifyChangeEmailStep1: (
    targetToChange: 'primary' | 'secondary',
    otp: string
  ) => Promise<{ success: boolean; message: string }>;
  requestChangeEmailStep2: (
    targetToChange: 'primary' | 'secondary',
    newEmailAddress: string
  ) => Promise<{ success: boolean; message: string }>;
  confirmNewRecoveryEmail: (
    targetToChange: 'primary' | 'secondary',
    newEmailAddress: string,
    otp: string
  ) => Promise<{ success: boolean; message: string }>;

  // Administrative Reset for Fresh Testing
  clearRecoveryEmailsForTesting: () => Promise<boolean>;

  // Legacy wrappers for backward compatibility
  updateCredentials: (newUsername: string, newPassword: string, primaryEmail?: string, secondaryEmail?: string) => Promise<boolean>;
  updateCredentialsWithOldPassword: (currentPassword: string, newUsername: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  updateRecoveryEmails: (primaryEmail: string, secondaryEmail: string) => Promise<boolean>;
  resetPasswordWithEmergencyKey: (emergencyKey: string, newUsername: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  sendEmailRecoveryOTP: (targetEmail: string) => Promise<{ success: boolean; otp?: string; message: string }>;
  resetPasswordWithEmailOTP: (email: string, otp: string, newUsername: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  requestEmailChangeOTP: () => Promise<{ success: boolean; otp?: string; message: string }>;
  verifyEmailChangeOTP: (otp: string) => Promise<boolean>;

  // Audit Logs & Information
  addAuditLog: (
    action: string,
    details: string,
    status?: 'SUCCESS' | 'FAILED' | 'WARNING',
    affectedUser?: string,
    affectedCourse?: string,
    adminUser?: string
  ) => void;
  refreshAuditLogs: () => Promise<void>;
  getAdminUsername: () => string;
  getAdminEmails: () => { primaryEmail: string; secondaryEmail: string };
}

const AUTH_KEY = 'docompany_admin_auth_credentials_v1';
const LOGS_KEY = 'docompany_admin_audit_logs_v1';
const TOKEN_KEY = 'docompany_secret_access_token';
const EMERGENCY_TOKEN_KEY = 'docompany_emergency_access_token';
const EXPIRY_KEY = 'docompany_secret_access_expiry';
const LOCKOUT_KEY = 'docompany_admin_lockout_until';
const FAILED_ATTEMPTS_KEY = 'docompany_admin_failed_attempts';

// Official Admin Credentials requested by User
const DEFAULT_USER = 'realadmin2026@gmail.com';
const DEFAULT_EMAIL_1 = '';
const DEFAULT_EMAIL_2 = '';
const MASTER_RECOVERY_KEY = '9371837125';

// Pre-generated secure default hash (SHA-256 with salt) for D1V2#2r987@1qavcngur23%72091+-=Cvxnd5%2701QweQm,GD#^28q!2@34
const INITIAL_SALT = '39096060b7a075930048ee4a789de39e';
const INITIAL_HASH = '9e0f3f0ecd2583402c0ec1659c1b8dab23dc2ac7474c42971ddb4ff1f48ac3c7';

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

/**
 * Direct real email delivery engine via server-side /api/admin-otp
 * Never silently substitutes the administrator's personal email or a default email.
 * Guarantees correct email headers:
 *   To: Exact entered recipient
 *   From: Configured verified sender (e.g. DO PILOT Security <security@dopilot.in>)
 *   Reply-To: Configured sender/support address
 */
const dispatchRealEmailOTP = async (
  targetEmail: string,
  _unusedOtp: string,
  purpose: string,
  targetSlot: 'primary' | 'secondary' = 'primary',
  adminUsername = 'admin'
): Promise<{ success: boolean; message: string; cooldownRemaining?: number; provider?: string }> => {
  if (!targetEmail || !targetEmail.trim()) {
    return { success: false, message: 'Valid recipient email address is required.' };
  }
  const cleanEmail = targetEmail.trim().toLowerCase();

  try {
    const res = await fetch('/api/admin-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'request_otp',
        target: targetSlot,
        email: cleanEmail,
        purpose,
        adminUsername
      })
    });

    const data = await res.json();
    return {
      success: Boolean(data.success),
      message: data.message || (data.success ? `Verification code dispatched to ${cleanEmail}.` : 'Delivery failed.'),
      cooldownRemaining: data.cooldownRemaining,
      provider: data.provider
    };
  } catch (err: any) {
    console.error('Server OTP API dispatch error:', err);
    return {
      success: false,
      message: err?.message || 'Failed to communicate with OTP email service.'
    };
  }
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(TOKEN_KEY));
  const [emergencyToken, setEmergencyToken] = useState<string | null>(() => sessionStorage.getItem(EMERGENCY_TOKEN_KEY));
  const [secondsRemaining, setSecondsRemaining] = useState<number>(60);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => sessionStorage.getItem('admin_logged_in') === 'true');
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState<number>(0);
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    return parseInt(localStorage.getItem(FAILED_ATTEMPTS_KEY) || '0', 10);
  });
  const [isSecurityLoading, setIsSecurityLoading] = useState<boolean>(true);

  // Active Security Credentials
  const [securityConfig, setSecurityConfig] = useState<AdminSecurityConfig>(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          username: parsed.username || DEFAULT_USER,
          passwordHash: parsed.passwordHash || INITIAL_HASH,
          passwordSalt: parsed.passwordSalt || INITIAL_SALT,
          primaryEmail: parsed.primaryEmail !== undefined ? parsed.primaryEmail : DEFAULT_EMAIL_1,
          secondaryEmail: parsed.secondaryEmail !== undefined ? parsed.secondaryEmail : DEFAULT_EMAIL_2,
          updatedAt: parsed.updatedAt || new Date().toISOString()
        };
      }
    } catch (e) {
      console.error(e);
    }
    return {
      username: DEFAULT_USER,
      passwordHash: INITIAL_HASH,
      passwordSalt: INITIAL_SALT,
      primaryEmail: DEFAULT_EMAIL_1,
      secondaryEmail: DEFAULT_EMAIL_2,
      updatedAt: new Date().toISOString()
    };
  });

  // Method B OTP in-memory session
  const methodBOTPSession = useRef<DualOTPState | null>(null);
  const lastMethodBRequestTime = useRef<number>(0);

  // Email Change 2-Step Session
  const emailChangeSession = useRef<EmailChangeSession | null>(null);

  // Initial Fresh Setup Session
  const initialSetupSession = useRef<InitialSetupSession | null>(null);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(LOGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load audit logs from local storage', e);
    }
    return [
      {
        id: `init-${Date.now()}`,
        action: 'SYSTEM_INITIALIZED',
        details: 'High-End Security Engine Online. Multi-method auth active.',
        timestamp: new Date().toISOString(),
        status: 'SUCCESS',
        adminUser: 'SYSTEM'
      }
    ];
  });

  // Sync audit logs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOGS_KEY, JSON.stringify(auditLogs.slice(0, 100)));
    } catch (e) {
      console.error(e);
    }
  }, [auditLogs]);

  // Load and reconcile credentials and audit logs from Supabase on start
  useEffect(() => {
    let isMounted = true;
    const loadFromSupabase = async () => {
      try {
        if (!isSupabaseConfigured()) {
          setIsSecurityLoading(false);
          return;
        }

        // 1. Fetch admin credentials row from Supabase
        const { data: secData, error: secError } = await supabase
          .from('site_content')
          .select('content, updated_at')
          .eq('id', 'admin_security_v1')
          .maybeSingle();

        if (secData && secData.content) {
          const parsed = secData.content as AdminSecurityConfig;
          if (parsed.passwordHash && isMounted) {
            localStorage.setItem(AUTH_KEY, JSON.stringify(parsed));
            setSecurityConfig(parsed);
          }
        } else if (!secError) {
          // If no row exists yet in Supabase, seed with configured default
          const currentConfig: AdminSecurityConfig = {
            username: DEFAULT_USER,
            passwordHash: INITIAL_HASH,
            passwordSalt: INITIAL_SALT,
            primaryEmail: DEFAULT_EMAIL_1,
            secondaryEmail: DEFAULT_EMAIL_2,
            updatedAt: new Date().toISOString()
          };
          await supabase.from('site_content').upsert({
            id: 'admin_security_v1',
            content: currentConfig,
            updated_at: new Date().toISOString()
          });
        }

        // 2. Fetch admin audit logs row
        const { data: logsData } = await supabase
          .from('site_content')
          .select('content')
          .eq('id', 'admin_audit_logs_v1')
          .maybeSingle();

        if (logsData && logsData.content && Array.isArray(logsData.content) && isMounted) {
          const remoteLogs = logsData.content as AuditLog[];
          setAuditLogs((prev) => {
            const map = new Map<string, AuditLog>();
            [...remoteLogs, ...prev].forEach((item) => {
              if (item && item.id) map.set(item.id, item);
            });
            const merged = Array.from(map.values()).sort(
              (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            return merged.slice(0, 100);
          });
        }
      } catch (err) {
        console.error('Failed to sync security configuration with Supabase:', err);
      } finally {
        if (isMounted) setIsSecurityLoading(false);
      }
    };

    loadFromSupabase();
    return () => {
      isMounted = false;
    };
  }, []);

  // Check Lockout Timer
  useEffect(() => {
    const checkLockout = () => {
      const lockoutUntil = parseInt(localStorage.getItem(LOCKOUT_KEY) || '0', 10);
      if (lockoutUntil > Date.now()) {
        const remainingSec = Math.ceil((lockoutUntil - Date.now()) / 1000);
        setLockoutTimeLeft(remainingSec);
      } else {
        setLockoutTimeLeft(0);
      }
    };
    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, []);

  // Live Countdown Timer for Secret Access Window
  useEffect(() => {
    if ((!token && !emergencyToken) || isLoggedIn) return;

    const expiryStr = sessionStorage.getItem(EXPIRY_KEY);
    if (!expiryStr) {
      invalidateSecretAccess();
      invalidateEmergencyAccess();
      return;
    }

    const expiryTime = parseInt(expiryStr, 10);

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((expiryTime - now) / 1000));
      setSecondsRemaining(diff);

      if (diff <= 0) {
        addAuditLog('SESSION_EXPIRED', 'Secret authorization window expired.', 'WARNING');
        invalidateSecretAccess();
        invalidateEmergencyAccess();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [token, emergencyToken, isLoggedIn]);

  const addAuditLog = useCallback(
    (
      action: string,
      details: string,
      status: 'SUCCESS' | 'FAILED' | 'WARNING' = 'SUCCESS',
      affectedUser?: string,
      affectedCourse?: string,
      adminUser?: string
    ) => {
      const newLog: AuditLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        action,
        details,
        timestamp: new Date().toISOString(),
        status,
        affectedUser,
        affectedCourse,
        adminUser: adminUser || securityConfig.username || 'admin'
      };

      setAuditLogs((prev) => {
        const updated = [newLog, ...prev].slice(0, 100);
        if (isSupabaseConfigured()) {
          Promise.resolve(
            supabase
              .from('site_content')
              .upsert({
                id: 'admin_audit_logs_v1',
                content: updated,
                updated_at: new Date().toISOString()
              })
          ).catch(() => {});
        }
        return updated;
      });
    },
    [securityConfig.username]
  );

  const refreshAuditLogs = async () => {
    if (!isSupabaseConfigured()) return;
    try {
      const { data } = await supabase
        .from('site_content')
        .select('content')
        .eq('id', 'admin_audit_logs_v1')
        .maybeSingle();

      if (data && Array.isArray(data.content)) {
        setAuditLogs(data.content as AuditLog[]);
      }
    } catch (e) {
      console.error('Error refreshing audit logs:', e);
    }
  };

  const triggerSecretAccess = () => {
    const newToken = `sec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const expiry = Date.now() + 60000; // 60 seconds
    sessionStorage.setItem(TOKEN_KEY, newToken);
    sessionStorage.setItem(EXPIRY_KEY, expiry.toString());
    setToken(newToken);
    setSecondsRemaining(60);
    addAuditLog('SECRET_GATEWAY_TRIGGERED', 'Footer secret gateway activated.');
  };

  const triggerEmergencyRecovery = () => {
    const newEmToken = `em_rec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const expiry = Date.now() + 300000; // 5 minutes window
    sessionStorage.setItem(EMERGENCY_TOKEN_KEY, newEmToken);
    sessionStorage.setItem(EXPIRY_KEY, expiry.toString());
    setEmergencyToken(newEmToken);
    setSecondsRemaining(300);
    addAuditLog('EMERGENCY_RECOVERY_TRIGGERED', 'Footer emergency recovery gateway activated.', 'WARNING');
  };

  const invalidateSecretAccess = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(EXPIRY_KEY);
    setToken(null);
  };

  const invalidateEmergencyAccess = () => {
    sessionStorage.removeItem(EMERGENCY_TOKEN_KEY);
    sessionStorage.removeItem(EXPIRY_KEY);
    methodBOTPSession.current = null;
    emailChangeSession.current = null;
    initialSetupSession.current = null;
    setEmergencyToken(null);
  };

  const getAdminUsername = useCallback(() => {
    return securityConfig.username;
  }, [securityConfig.username]);

  const getAdminEmails = useCallback(() => {
    return {
      primaryEmail: securityConfig.primaryEmail,
      secondaryEmail: securityConfig.secondaryEmail
    };
  }, [securityConfig.primaryEmail, securityConfig.secondaryEmail]);

  // Persist updated security config to both localStorage and Supabase
  const persistSecurityConfig = async (newConfig: AdminSecurityConfig): Promise<boolean> => {
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(newConfig));
      setSecurityConfig(newConfig);

      if (isSupabaseConfigured()) {
        const { error } = await supabase.from('site_content').upsert({
          id: 'admin_security_v1',
          content: newConfig,
          updated_at: newConfig.updatedAt
        });
        if (error) {
          console.error('Supabase credentials upsert failed:', error.message);
        }
      }
      return true;
    } catch (e) {
      console.error('Failed to persist security configuration:', e);
      return false;
    }
  };

  /**
   * High-End Admin Login with Salted SHA-256 Verification & Lockout Protection
   */
  const loginAdmin = async (user: string, pass: string): Promise<{ success: boolean; message: string }> => {
    const lockoutUntil = parseInt(localStorage.getItem(LOCKOUT_KEY) || '0', 10);
    if (lockoutUntil > Date.now()) {
      const secLeft = Math.ceil((lockoutUntil - Date.now()) / 1000);
      addAuditLog('LOGIN_ATTEMPT_BLOCKED', `Login attempt while locked out for ${secLeft}s.`, 'FAILED');
      return {
        success: false,
        message: `Security Lockout Active! Please wait ${secLeft} seconds before retrying.`
      };
    }

    const cleanUser = user.trim().toLowerCase();
    const cleanPass = pass.trim();

    const isUserMatch =
      cleanUser === securityConfig.username.toLowerCase() ||
      (securityConfig.primaryEmail && cleanUser === securityConfig.primaryEmail.toLowerCase()) ||
      (securityConfig.secondaryEmail && cleanUser === securityConfig.secondaryEmail.toLowerCase());

    const isPassMatch = await verifyPasswordHash(cleanPass, securityConfig.passwordHash, securityConfig.passwordSalt);

    if (isUserMatch && isPassMatch) {
      sessionStorage.setItem('admin_logged_in', 'true');
      setIsLoggedIn(true);
      setFailedAttempts(0);
      localStorage.removeItem(FAILED_ATTEMPTS_KEY);
      localStorage.removeItem(LOCKOUT_KEY);
      addAuditLog('LOGIN_SUCCESS', `Admin '${user}' authenticated successfully.`, 'SUCCESS', 'Admin Account', undefined, securityConfig.username);
      return { success: true, message: 'Authentication successful! Welcome Admin.' };
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      localStorage.setItem(FAILED_ATTEMPTS_KEY, newAttempts.toString());
      addAuditLog('LOGIN_FAILED', `Failed login attempt with username '${user}'.`, 'FAILED');

      if (newAttempts >= 5) {
        const lockoutUntilTime = Date.now() + 60 * 1000;
        localStorage.setItem(LOCKOUT_KEY, lockoutUntilTime.toString());
        addAuditLog('SECURITY_LOCKOUT_TRIGGERED', '5 failed login attempts reached. Account locked for 60 seconds.', 'WARNING');
        return {
          success: false,
          message: 'Failed login attempts detected! Security lockout enabled for 60 seconds.'
        };
      }

      return {
        success: false,
        message: 'Invalid Security Credentials.'
      };
    }
  };

  const logoutAdmin = () => {
    sessionStorage.removeItem('admin_logged_in');
    invalidateSecretAccess();
    invalidateEmergencyAccess();
    setIsLoggedIn(false);
    addAuditLog('LOGOUT', 'Admin logged out safely.');
  };

  // =========================================================================
  // METHOD A: Change Password Using Current Password
  // =========================================================================
  const changePasswordMethodA = async (
    currentUsername: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    const cleanUser = currentUsername.trim().toLowerCase();
    const cleanPass = currentPassword.trim();
    const cleanNewPass = newPassword.trim();

    if (!cleanUser || !cleanPass) {
      return { success: false, message: 'Please provide both current username and current password.' };
    }

    const isUserMatch =
      cleanUser === securityConfig.username.toLowerCase() ||
      (securityConfig.primaryEmail && cleanUser === securityConfig.primaryEmail.toLowerCase());

    const isPassMatch = await verifyPasswordHash(cleanPass, securityConfig.passwordHash, securityConfig.passwordSalt);

    if (!isUserMatch || !isPassMatch) {
      addAuditLog('PASSWORD_CHANGE_FAILED', 'Method A: Incorrect current admin username or password.', 'FAILED', 'Admin Account');
      return {
        success: false,
        message: 'Incorrect current credentials! Verification failed.'
      };
    }

    if (cleanNewPass.length < 6) {
      return {
        success: false,
        message: 'New password must be at least 6 characters long.'
      };
    }

    // Generate fresh salt and compute SHA-256 hash
    const newSalt = generateSalt(16);
    const newHash = await hashPassword(cleanNewPass, newSalt);

    const updatedConfig: AdminSecurityConfig = {
      ...securityConfig,
      passwordHash: newHash,
      passwordSalt: newSalt,
      updatedAt: new Date().toISOString()
    };

    const saved = await persistSecurityConfig(updatedConfig);
    if (saved) {
      addAuditLog(
        'PASSWORD_CHANGED_METHOD_A',
        `Admin password successfully updated via Current Password verification.`,
        'SUCCESS',
        'Admin Account',
        undefined,
        securityConfig.username
      );
      return {
        success: true,
        message: 'Admin password successfully updated!'
      };
    } else {
      return { success: false, message: 'System error: Unable to persist new password.' };
    }
  };

  // =========================================================================
  // METHOD B: Change Password Using Dual Recovery Email OTPs
  // =========================================================================
  const requestMethodBOTP = async (
    deliveryMode: 'primary' | 'secondary' | 'both'
  ): Promise<{ success: boolean; message: string; cooldownRemaining?: number }> => {
    const now = Date.now();
    const cooldownPeriod = 60 * 1000;
    const elapsed = now - lastMethodBRequestTime.current;

    if (elapsed < cooldownPeriod) {
      const remainingSec = Math.ceil((cooldownPeriod - elapsed) / 1000);
      return {
        success: false,
        message: `Please wait ${remainingSec}s before requesting a new OTP.`,
        cooldownRemaining: remainingSec
      };
    }

    const { primaryEmail, secondaryEmail } = getAdminEmails();

    if (deliveryMode === 'primary' && !primaryEmail) {
      return { success: false, message: 'Primary recovery email is not configured.' };
    }
    if (deliveryMode === 'secondary' && !secondaryEmail) {
      return { success: false, message: 'Secondary recovery email is not configured.' };
    }
    if (deliveryMode === 'both' && (!primaryEmail || !secondaryEmail)) {
      return { success: false, message: 'Both recovery emails must be configured to use this option.' };
    }

    const otpPrimary = (deliveryMode === 'primary' || deliveryMode === 'both') ? generateSecureOTP() : undefined;
    const otpSecondary = (deliveryMode === 'secondary' || deliveryMode === 'both') ? generateSecureOTP() : undefined;
    const expiresAt = now + 10 * 60 * 1000;

    methodBOTPSession.current = {
      mode: deliveryMode,
      primaryOtp: otpPrimary,
      secondaryOtp: otpSecondary,
      expiresAt,
      attemptsLeft: 5,
      createdAt: now
    };
    lastMethodBRequestTime.current = now;

    // Dispatch real emails via server-side API with proper headers
    const dispatches: Promise<{ success: boolean; message: string }>[] = [];
    if (otpPrimary && primaryEmail) {
      dispatches.push(dispatchRealEmailOTP(primaryEmail, otpPrimary, 'Admin Password Recovery (Primary Email)', 'primary', securityConfig.username));
    }
    if (otpSecondary && secondaryEmail) {
      dispatches.push(dispatchRealEmailOTP(secondaryEmail, otpSecondary, 'Admin Password Recovery (Secondary Email)', 'secondary', securityConfig.username));
    }

    const results = await Promise.all(dispatches);
    const failedDispatch = results.find((r) => !r.success);

    addAuditLog(
      'METHOD_B_OTP_DISPATCHED',
      `Method B OTP dispatched. Target: ${deliveryMode.toUpperCase()} (${[otpPrimary && primaryEmail, otpSecondary && secondaryEmail].filter(Boolean).join(', ')}). ${failedDispatch ? `Delivery Notice: ${failedDispatch.message}` : 'Accepted for delivery.'}`,
      failedDispatch ? 'WARNING' : 'SUCCESS',
      'Admin Account'
    );

    let notice = 'Verification OTP sent!';
    if (failedDispatch) {
      notice = failedDispatch.message;
    } else if (deliveryMode === 'primary') {
      notice = `6-Digit OTP sent to Primary Email (${primaryEmail}).`;
    } else if (deliveryMode === 'secondary') {
      notice = `6-Digit OTP sent to Secondary Email (${secondaryEmail}).`;
    } else {
      notice = `Separate 6-digit OTPs sent to BOTH ${primaryEmail} and ${secondaryEmail}.`;
    }

    return { success: !failedDispatch, message: notice };
  };

  const verifyMethodBOTPAndChangePassword = async (
    deliveryMode: 'primary' | 'secondary' | 'both',
    otpPrimaryInput: string,
    otpSecondaryInput: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    const session = methodBOTPSession.current;
    if (!session) {
      return { success: false, message: 'No active OTP request found. Please request a new OTP code.' };
    }

    if (Date.now() > session.expiresAt) {
      methodBOTPSession.current = null;
      addAuditLog('METHOD_B_OTP_EXPIRED', 'Method B recovery OTP expired.', 'FAILED', 'Admin Account');
      return { success: false, message: 'OTP code has expired! Please request a new code.' };
    }

    if (session.attemptsLeft <= 0) {
      methodBOTPSession.current = null;
      addAuditLog('METHOD_B_MAX_ATTEMPTS', 'Method B maximum OTP verification attempts exceeded.', 'FAILED', 'Admin Account');
      return { success: false, message: 'Maximum verification attempts exceeded. Please request a new OTP.' };
    }

    session.attemptsLeft -= 1;

    let isPrimaryValid = true;
    let isSecondaryValid = true;

    if (deliveryMode === 'primary' || deliveryMode === 'both') {
      if (!session.primaryOtp || !safeEqual(otpPrimaryInput.trim(), session.primaryOtp.trim())) {
        isPrimaryValid = false;
      }
    }

    if (deliveryMode === 'secondary' || deliveryMode === 'both') {
      if (!session.secondaryOtp || !safeEqual(otpSecondaryInput.trim(), session.secondaryOtp.trim())) {
        isSecondaryValid = false;
      }
    }

    if (!isPrimaryValid || !isSecondaryValid) {
      const err = deliveryMode === 'both' && (!isPrimaryValid && !isSecondaryValid)
        ? 'Both OTP codes are incorrect!'
        : !isPrimaryValid
        ? 'Incorrect OTP code for Primary Email!'
        : 'Incorrect OTP code for Secondary Email!';

      addAuditLog('METHOD_B_OTP_FAILED', `Failed OTP verification. ${session.attemptsLeft} attempts remaining.`, 'FAILED', 'Admin Account');
      return {
        success: false,
        message: `${err} (${session.attemptsLeft} attempt${session.attemptsLeft === 1 ? '' : 's'} remaining).`
      };
    }

    const cleanNewPass = newPassword.trim();
    if (cleanNewPass.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }

    const newSalt = generateSalt(16);
    const newHash = await hashPassword(cleanNewPass, newSalt);

    const updatedConfig: AdminSecurityConfig = {
      ...securityConfig,
      passwordHash: newHash,
      passwordSalt: newSalt,
      updatedAt: new Date().toISOString()
    };

    const saved = await persistSecurityConfig(updatedConfig);
    if (saved) {
      methodBOTPSession.current = null;
      localStorage.removeItem(LOCKOUT_KEY);
      localStorage.removeItem(FAILED_ATTEMPTS_KEY);
      setFailedAttempts(0);
      setLockoutTimeLeft(0);
      invalidateEmergencyAccess();

      addAuditLog(
        'PASSWORD_RESET_METHOD_B',
        `Admin password successfully reset via Email Recovery OTP (${deliveryMode.toUpperCase()}).`,
        'SUCCESS',
        'Admin Account'
      );

      return {
        success: true,
        message: 'Admin password successfully reset via Email Recovery!'
      };
    } else {
      return { success: false, message: 'System error: Unable to persist new password.' };
    }
  };

  // =========================================================================
  // FRESH RECOVERY EMAIL SETUP (INITIAL SETUP OF EMPTY SLOTS)
  // =========================================================================
  const setupInitialRecoveryEmail = async (
    target: 'primary' | 'secondary',
    emailAddress: string
  ): Promise<{ success: boolean; message: string; cooldownRemaining?: number }> => {
    const cleanEmail = emailAddress.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    const res = await dispatchRealEmailOTP(
      cleanEmail,
      '',
      `Initial Verification for ${target === 'primary' ? 'Primary' : 'Secondary'} Recovery Email`,
      target,
      securityConfig.username
    );

    return {
      success: res.success,
      message: res.message,
      cooldownRemaining: res.cooldownRemaining
    };
  };

  const verifyAndSaveInitialRecoveryEmail = async (
    target: 'primary' | 'secondary',
    emailAddress: string,
    otp: string
  ): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = emailAddress.trim().toLowerCase();

    // 1. Server-side OTP verification via /api/admin-otp
    try {
      const res = await fetch('/api/admin-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_otp',
          target,
          email: cleanEmail,
          otp: otp.trim(),
          adminUsername: securityConfig.username
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          message: data.message || 'OTP verification failed.'
        };
      }
    } catch (e: any) {
      return { success: false, message: e?.message || 'Server error verifying OTP.' };
    }

    // 2. Persist updated security configuration to Supabase database
    const updatedConfig: AdminSecurityConfig = {
      ...securityConfig,
      primaryEmail: target === 'primary' ? cleanEmail : securityConfig.primaryEmail,
      secondaryEmail: target === 'secondary' ? cleanEmail : securityConfig.secondaryEmail,
      updatedAt: new Date().toISOString()
    };

    const saved = await persistSecurityConfig(updatedConfig);
    if (saved) {
      initialSetupSession.current = null;
      addAuditLog(
        'RECOVERY_EMAIL_CONFIGURED',
        `Permanent ${target === 'primary' ? 'Primary' : 'Secondary'} recovery email successfully verified and configured: ${cleanEmail}.`,
        'SUCCESS',
        'Admin Account'
      );
      return {
        success: true,
        message: `${target === 'primary' ? 'Primary' : 'Secondary'} recovery email successfully verified and permanently saved!`
      };
    } else {
      return { success: false, message: 'System error: Unable to save recovery email.' };
    }
  };

  // =========================================================================
  // CHANGE RECOVERY EMAIL: Independent 2-Step Verification Flow
  // =========================================================================
  const requestChangeEmailStep1 = async (
    targetToChange: 'primary' | 'secondary'
  ): Promise<{ success: boolean; message: string; otherEmail: string }> => {
    const { primaryEmail, secondaryEmail } = getAdminEmails();
    const otherEmail = targetToChange === 'primary' ? secondaryEmail : primaryEmail;

    if (!otherEmail || !otherEmail.trim()) {
      return {
        success: false,
        message: `Cannot change ${targetToChange} email: the other recovery email is not configured. Both recovery emails must be configured for the 2-step verification protocol.`,
        otherEmail: ''
      };
    }

    const slotToVerify = targetToChange === 'primary' ? 'secondary' : 'primary';

    const res = await dispatchRealEmailOTP(
      otherEmail,
      '',
      `Authorization to change ${targetToChange === 'primary' ? 'Primary' : 'Secondary'} Recovery Email`,
      slotToVerify,
      securityConfig.username
    );

    return {
      success: res.success,
      message: res.message,
      otherEmail
    };
  };

  const verifyChangeEmailStep1 = async (
    targetToChange: 'primary' | 'secondary',
    otp: string
  ): Promise<{ success: boolean; message: string }> => {
    const { primaryEmail, secondaryEmail } = getAdminEmails();
    const otherEmail = targetToChange === 'primary' ? secondaryEmail : primaryEmail;
    const slotToVerify = targetToChange === 'primary' ? 'secondary' : 'primary';

    try {
      const res = await fetch('/api/admin-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_otp',
          target: slotToVerify,
          email: otherEmail,
          otp: otp.trim(),
          adminUsername: securityConfig.username
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          message: data.message || 'Incorrect verification code.'
        };
      }
    } catch (e: any) {
      return { success: false, message: e?.message || 'Server error verifying code.' };
    }

    if (emailChangeSession.current) {
      emailChangeSession.current.step1Verified = true;
      emailChangeSession.current.step = 2;
    } else {
      emailChangeSession.current = {
        target: targetToChange,
        step: 2,
        step1Verified: true,
        lastSentAt: Date.now()
      };
    }

    addAuditLog(
      'EMAIL_CHANGE_STEP1_VERIFIED',
      `Step 1 authorized: Identity verified via other registered recovery email for ${targetToChange} email change.`,
      'SUCCESS',
      'Admin Account'
    );

    return {
      success: true,
      message: 'Step 1 Authorized! Now enter your new recovery email address.'
    };
  };

  const requestChangeEmailStep2 = async (
    targetToChange: 'primary' | 'secondary',
    newEmailAddress: string
  ): Promise<{ success: boolean; message: string }> => {
    const session = emailChangeSession.current;
    if (!session || session.target !== targetToChange || !session.step1Verified) {
      return { success: false, message: 'Unauthorized. You must verify Step 1 first.' };
    }

    const cleanNewEmail = newEmailAddress.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanNewEmail)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    const res = await dispatchRealEmailOTP(
      cleanNewEmail,
      '',
      `Verify Your New ${targetToChange === 'primary' ? 'Primary' : 'Secondary'} Recovery Email`,
      targetToChange,
      securityConfig.username
    );

    if (res.success && session) {
      session.newEmail = cleanNewEmail;
      session.lastSentAt = Date.now();
    }

    return {
      success: res.success,
      message: res.message
    };
  };

  const confirmNewRecoveryEmail = async (
    targetToChange: 'primary' | 'secondary',
    newEmailAddress: string,
    otp: string
  ): Promise<{ success: boolean; message: string }> => {
    const session = emailChangeSession.current;
    if (!session || session.target !== targetToChange || !session.step1Verified) {
      return { success: false, message: 'Unauthorized session. Please start the change process from Step 1.' };
    }

    const cleanNewEmail = newEmailAddress.trim().toLowerCase();

    // 1. Verify on server
    try {
      const res = await fetch('/api/admin-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_otp',
          target: targetToChange,
          email: cleanNewEmail,
          otp: otp.trim(),
          adminUsername: securityConfig.username
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          message: data.message || 'Incorrect verification code.'
        };
      }
    } catch (e: any) {
      return { success: false, message: e?.message || 'Server error verifying OTP.' };
    }

    // 2. Persist new email in Supabase
    const updatedConfig: AdminSecurityConfig = {
      ...securityConfig,
      primaryEmail: targetToChange === 'primary' ? cleanNewEmail : securityConfig.primaryEmail,
      secondaryEmail: targetToChange === 'secondary' ? cleanNewEmail : securityConfig.secondaryEmail,
      updatedAt: new Date().toISOString()
    };

    const saved = await persistSecurityConfig(updatedConfig);
    if (saved) {
      emailChangeSession.current = null;

      addAuditLog(
        'RECOVERY_EMAIL_UPDATED',
        `Permanent ${targetToChange === 'primary' ? 'Primary' : 'Secondary'} recovery email successfully changed to ${cleanNewEmail}.`,
        'SUCCESS',
        'Admin Account'
      );

      return {
        success: true,
        message: `${targetToChange === 'primary' ? 'Primary' : 'Secondary'} recovery email successfully updated to ${cleanNewEmail}!`
      };
    } else {
      return { success: false, message: 'System error: Unable to save updated recovery email.' };
    }
  };

  const clearRecoveryEmailsForTesting = async (): Promise<boolean> => {
    const updatedConfig: AdminSecurityConfig = {
      ...securityConfig,
      primaryEmail: '',
      secondaryEmail: '',
      updatedAt: new Date().toISOString()
    };
    const saved = await persistSecurityConfig(updatedConfig);
    if (saved) {
      initialSetupSession.current = null;
      emailChangeSession.current = null;
      methodBOTPSession.current = null;
      addAuditLog('RECOVERY_EMAILS_CLEARED', 'Admin recovery emails cleared for fresh testing.', 'WARNING', 'Admin Account');
    }
    return saved;
  };

  // =========================================================================
  // Legacy Wrappers (Maintained for Backward Compatibility)
  // =========================================================================
  const updateCredentials = async (
    newUsername: string,
    newPassword: string,
    primaryEmail?: string,
    secondaryEmail?: string
  ): Promise<boolean> => {
    if (!newUsername.trim() || !newPassword.trim()) return false;
    try {
      const newSalt = generateSalt(16);
      const newHash = await hashPassword(newPassword.trim(), newSalt);
      const updatedConfig: AdminSecurityConfig = {
        username: newUsername.trim(),
        passwordHash: newHash,
        passwordSalt: newSalt,
        primaryEmail: primaryEmail ? primaryEmail.trim().toLowerCase() : securityConfig.primaryEmail,
        secondaryEmail: secondaryEmail ? secondaryEmail.trim().toLowerCase() : securityConfig.secondaryEmail,
        updatedAt: new Date().toISOString()
      };
      await persistSecurityConfig(updatedConfig);
      addAuditLog('CREDENTIALS_UPDATED', `Admin credentials updated for '${newUsername.trim()}'.`);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const updateCredentialsWithOldPassword = async (
    currentPassword: string,
    newUsername: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    return changePasswordMethodA(newUsername, currentPassword, newPassword);
  };

  const updateRecoveryEmails = async (primaryEmail: string, secondaryEmail: string): Promise<boolean> => {
    try {
      const updatedConfig: AdminSecurityConfig = {
        ...securityConfig,
        primaryEmail: primaryEmail.trim().toLowerCase(),
        secondaryEmail: secondaryEmail.trim().toLowerCase(),
        updatedAt: new Date().toISOString()
      };
      await persistSecurityConfig(updatedConfig);
      addAuditLog('RECOVERY_EMAILS_UPDATED', `Recovery emails updated to '${primaryEmail}' & '${secondaryEmail}'.`);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const resetPasswordWithEmergencyKey = async (
    emergencyKey: string,
    newUsername: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    if (emergencyKey.trim() !== MASTER_RECOVERY_KEY) {
      addAuditLog('EMERGENCY_RESET_FAILED', 'Invalid Emergency Recovery Master Key entered.', 'FAILED');
      return { success: false, message: 'Invalid Emergency Recovery Key! Access Denied.' };
    }

    if (newPassword.trim().length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    const newSalt = generateSalt(16);
    const newHash = await hashPassword(newPassword.trim(), newSalt);

    const updatedConfig: AdminSecurityConfig = {
      ...securityConfig,
      username: newUsername.trim() || securityConfig.username,
      passwordHash: newHash,
      passwordSalt: newSalt,
      updatedAt: new Date().toISOString()
    };

    const saved = await persistSecurityConfig(updatedConfig);
    if (saved) {
      localStorage.removeItem(LOCKOUT_KEY);
      localStorage.removeItem(FAILED_ATTEMPTS_KEY);
      setFailedAttempts(0);
      setLockoutTimeLeft(0);
      invalidateEmergencyAccess();
      addAuditLog('EMERGENCY_RESET_SUCCESS', `Admin credentials reset via Master Emergency PIN.`, 'SUCCESS');
      return { success: true, message: 'Emergency Recovery Complete! Password reset.' };
    }
    return { success: false, message: 'System error during emergency reset.' };
  };

  const sendEmailRecoveryOTP = async (targetEmail: string): Promise<{ success: boolean; otp?: string; message: string }> => {
    const { primaryEmail, secondaryEmail } = getAdminEmails();
    const clean = targetEmail.trim().toLowerCase();
    let mode: 'primary' | 'secondary' | 'both' = 'primary';
    if (clean === secondaryEmail.toLowerCase()) mode = 'secondary';
    else if (clean === primaryEmail.toLowerCase()) mode = 'primary';
    else mode = 'both';

    const res = await requestMethodBOTP(mode);
    return { success: res.success, message: res.message };
  };

  const resetPasswordWithEmailOTP = async (
    email: string,
    otp: string,
    _newUsername: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    const { primaryEmail, secondaryEmail } = getAdminEmails();
    const clean = email.trim().toLowerCase();
    const mode = clean === secondaryEmail.toLowerCase() ? 'secondary' : 'primary';
    return verifyMethodBOTPAndChangePassword(mode, otp, otp, newPassword);
  };

  const requestEmailChangeOTP = async (): Promise<{ success: boolean; otp?: string; message: string }> => {
    const res = await requestChangeEmailStep1('primary');
    return { success: res.success, message: res.message };
  };

  const verifyEmailChangeOTP = async (otp: string): Promise<boolean> => {
    const res = await verifyChangeEmailStep1('primary', otp);
    return res.success;
  };

  const isUnlocked = Boolean((token && secondsRemaining > 0) || (emergencyToken && secondsRemaining > 0) || isLoggedIn);

  return (
    <AdminAuthContext.Provider
      value={{
        token,
        emergencyToken,
        secondsRemaining,
        isUnlocked,
        isLoggedIn,
        lockoutTimeLeft,
        failedAttempts,
        auditLogs,
        isSecurityLoading,
        triggerSecretAccess,
        triggerEmergencyRecovery,
        invalidateSecretAccess,
        invalidateEmergencyAccess,
        loginAdmin,
        logoutAdmin,
        changePasswordMethodA,
        requestMethodBOTP,
        verifyMethodBOTPAndChangePassword,
        setupInitialRecoveryEmail,
        verifyAndSaveInitialRecoveryEmail,
        requestChangeEmailStep1,
        verifyChangeEmailStep1,
        requestChangeEmailStep2,
        confirmNewRecoveryEmail,
        clearRecoveryEmailsForTesting,
        updateCredentials,
        updateCredentialsWithOldPassword,
        updateRecoveryEmails,
        resetPasswordWithEmergencyKey,
        sendEmailRecoveryOTP,
        resetPasswordWithEmailOTP,
        requestEmailChangeOTP,
        verifyEmailChangeOTP,
        addAuditLog,
        refreshAuditLogs,
        getAdminUsername,
        getAdminEmails
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
