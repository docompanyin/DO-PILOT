import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { purgeStudentLocalData } from '../utils/studentDataPurge';
import { restoreAllStudentCourseProgressFromCloud } from '../utils/courseProgressSyncService';
import { syncUserPurchasesFromCloud, normalizeCourseId } from '../utils/coursePricingService';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'google';
  phone?: string;
  whereDidYouFindUs?: string;
  collegeOrCompany?: string;
  learningGoal?: string;
  hasCompletedDetails?: boolean;
  enrolledCourses?: string[];
  joinedLiveClass?: boolean;
  createdAt: string;
}

interface UserAuthContextType {
  user: UserProfile | null;
  pendingUser: UserProfile | null;
  isLoggedIn: boolean;
  isPendingRegistration: boolean;
  setPendingUser: (profile: UserProfile | null) => void;
  loginWithGoogleCredential: (credential: string) => Promise<UserProfile | null>;
  loginWithGoogleDirect: (profileData?: { name?: string; email?: string; avatar?: string; id?: string }) => Promise<UserProfile | null>;
  completeOnboardingAndLogin: (profile: UserProfile) => Promise<{ success: boolean; error?: string }>;
  updateUserProfile: (details: Partial<UserProfile>) => Promise<void>;
  logout: () => void;
  enrollInCourse: (courseName: string) => void;
  clearPendingRegistration: () => void;
  refreshUserSession: () => Promise<void>;
}

export const USER_SESSION_KEY = 'dopilot_student_session_v1';
export const USER_PENDING_KEY = 'dopilot_pending_registration_v1';
export const AUTH_COOKIE_NAME = 'dopilot_auth_session';

export const setAuthCookie = (): void => {
  if (typeof document === 'undefined') return;
  // Set persistent cookie for 30 days
  const maxAge = 60 * 60 * 24 * 30;
  document.cookie = `${AUTH_COOKIE_NAME}=active; path=/; max-age=${maxAge}; SameSite=Lax`;
};

export const clearAuthCookie = (): void => {
  if (typeof document === 'undefined') return;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
};

export const hasAuthCookie = (): boolean => {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some(item => item.trim().startsWith(`${AUTH_COOKIE_NAME}=`));
};

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

// Helper to decode standard base64 Google JWT payload without external libraries
export const parseGoogleJwt = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse Google JWT payload', e);
    return null;
  }
};

const getInitialUserSession = (): UserProfile | null => {
  try {
    const saved = localStorage.getItem(USER_SESSION_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Immediately purge any legacy demo / dummy session
      if (
        !parsed.email ||
        parsed.email === 'learner@gmail.com' ||
        parsed.email === 'student@gmail.com' ||
        parsed.email === 'bimal.kumar.test@gmail.com' ||
        parsed.name === 'DO PILOT Learner' ||
        parsed.name === 'New Student'
      ) {
        localStorage.removeItem(USER_SESSION_KEY);
        clearAuthCookie();
        return null;
      }
      if (parsed.hasCompletedDetails === true) {
        setAuthCookie();
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to restore user session:', e);
  }
  return null;
};

const getInitialPendingSession = (): UserProfile | null => {
  try {
    const saved = localStorage.getItem(USER_PENDING_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.email && !parsed.hasCompletedDetails) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to restore pending session:', e);
  }
  return null;
};

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(getInitialUserSession);
  const [pendingUser, setPendingUserState] = useState<UserProfile | null>(getInitialPendingSession);

  const setPendingUser = useCallback((profile: UserProfile | null) => {
    setPendingUserState(profile);
    if (profile) {
      localStorage.setItem(USER_PENDING_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(USER_PENDING_KEY);
    }
  }, []);

  const clearPendingRegistration = useCallback(() => {
    setPendingUserState(null);
    localStorage.removeItem(USER_PENDING_KEY);
  }, []);

  const saveUserSession = useCallback((newUser: UserProfile | null) => {
    setUser(newUser);
    if (newUser && newUser.hasCompletedDetails) {
      setAuthCookie();
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(newUser));
      localStorage.removeItem(USER_PENDING_KEY);
      setPendingUserState(null);

      // Immediately seed local purchased courses key from newUser.enrolledCourses synchronously
      if (Array.isArray(newUser.enrolledCourses) && newUser.enrolledCourses.length > 0) {
        const mapped = Array.from(new Set(newUser.enrolledCourses.map(c => normalizeCourseId(c))));
        if (newUser.id) {
          localStorage.setItem(`dopilot_purchased_courses_${newUser.id}`, JSON.stringify(mapped));
        }
        if (newUser.email) {
          localStorage.setItem(`dopilot_purchased_courses_${newUser.email.toLowerCase().trim()}`, JSON.stringify(mapped));
        }
      }
      
      if (newUser.email && isSupabaseConfigured()) {
        restoreAllStudentCourseProgressFromCloud(newUser.email);
        syncUserPurchasesFromCloud(newUser.email, newUser.id);
        Promise.resolve(
          supabase
            .from('student_profiles')
            .upsert({
              id: newUser.id,
              email: newUser.email,
              name: newUser.name,
              avatar: newUser.avatar,
              phone: newUser.phone || null,
              where_did_you_find_us: newUser.whereDidYouFindUs || null,
              college_or_company: newUser.collegeOrCompany || null,
              learning_goal: newUser.learningGoal || null,
              has_completed_details: true,
              enrolled_courses: newUser.enrolledCourses || [],
              joined_live_class: Boolean(newUser.joinedLiveClass),
              updated_at: new Date().toISOString()
            })
        ).catch((err) => {
          console.warn('Background Supabase upsert failed:', err);
        });
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('dopilot_student_roster_updated', { detail: newUser }));
        }
      }
    } else {
      clearAuthCookie();
      localStorage.removeItem(USER_SESSION_KEY);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('dopilot_student_roster_updated'));
      }
    }
  }, []);

  // Synchronize server-side registration state on mount and tab focus
  const refreshUserSession = useCallback(async () => {
    const currentEmail = user?.email || pendingUser?.email;
    if (!currentEmail || !isSupabaseConfigured()) return;

    try {
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('email', currentEmail)
        .maybeSingle();

      if (error) {
        console.warn('Failed to verify session against Supabase:', error);
        return;
      }

      if (data) {
        if (data.has_completed_details) {
          // Server confirms completed registration
          const verifiedUser: UserProfile = {
            id: data.id || user?.id || pendingUser?.id || `user-${Date.now()}`,
            name: data.name || user?.name || pendingUser?.name || 'Student',
            email: data.email,
            avatar: data.avatar || user?.avatar || pendingUser?.avatar || '',
            provider: 'google',
            phone: data.phone || user?.phone || undefined,
            whereDidYouFindUs: data.where_did_you_find_us || user?.whereDidYouFindUs || undefined,
            collegeOrCompany: data.college_or_company || user?.collegeOrCompany || undefined,
            learningGoal: data.learning_goal || user?.learningGoal || undefined,
            hasCompletedDetails: true,
            enrolledCourses: Array.isArray(data.enrolled_courses) ? data.enrolled_courses : [],
            joinedLiveClass: Boolean(data.joined_live_class),
            createdAt: data.created_at || user?.createdAt || new Date().toISOString()
          };
          saveUserSession(verifiedUser);
        } else {
          // Server marks as incomplete
          const incomplete: UserProfile = {
            id: data.id || pendingUser?.id || `user-${Date.now()}`,
            name: data.name || pendingUser?.name || 'Student',
            email: data.email,
            avatar: data.avatar || pendingUser?.avatar || '',
            provider: 'google',
            phone: data.phone || pendingUser?.phone || undefined,
            whereDidYouFindUs: data.where_did_you_find_us || pendingUser?.whereDidYouFindUs || undefined,
            collegeOrCompany: data.college_or_company || pendingUser?.collegeOrCompany || undefined,
            learningGoal: data.learning_goal || pendingUser?.learningGoal || undefined,
            hasCompletedDetails: false,
            enrolledCourses: Array.isArray(data.enrolled_courses) ? data.enrolled_courses : [],
            joinedLiveClass: Boolean(data.joined_live_class),
            createdAt: data.created_at || new Date().toISOString()
          };
          setUser(null);
          setPendingUser(incomplete);
        }
      } else if (!error && !data) {
        // User was deleted from Supabase! Purge local caches and log out immediately
        purgeStudentLocalData(currentEmail, user?.id || pendingUser?.id);
        setUser(null);
        setPendingUser(null);
        localStorage.removeItem(USER_SESSION_KEY);
        localStorage.removeItem(USER_PENDING_KEY);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('dopilot_user_logged_out'));
          window.dispatchEvent(new Event('storage'));
        }
      }
    } catch (e) {
      console.warn('Session refresh error:', e);
    }
  }, [user?.email, user?.id, user?.name, user?.avatar, user?.phone, user?.whereDidYouFindUs, user?.collegeOrCompany, user?.learningGoal, user?.createdAt, pendingUser, saveUserSession, setPendingUser]);

  useEffect(() => {
    refreshUserSession();
    if (user?.email) {
      restoreAllStudentCourseProgressFromCloud(user.email);
      syncUserPurchasesFromCloud(user.email, user.id);
    }
  }, []);

  // Google One-Tap / Identity Services token login with real credential
  const loginWithGoogleCredential = async (credential: string): Promise<UserProfile | null> => {
    const payload = parseGoogleJwt(credential);
    if (!payload || !payload.email) return null;

    const realName = payload.name || payload.given_name || payload.email.split('@')[0];
    const realAvatar = payload.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(realName)}&background=00ff9d&color=000000&bold=true`;
    
    return await loginWithGoogleDirect({
      id: payload.sub,
      name: realName,
      email: payload.email,
      avatar: realAvatar
    });
  };

  // Real Google OAuth login flow (from real userinfo response)
  const loginWithGoogleDirect = async (profileData?: { name?: string; email?: string; avatar?: string; id?: string }): Promise<UserProfile | null> => {
    if (!profileData || !profileData.email) return null;
    const realName = profileData.name || profileData.email.split('@')[0];
    const realAvatar = profileData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(realName)}&background=00ff9d&color=000000&bold=true`;
    const targetEmail = profileData.email.toLowerCase().trim();

    // 1. Query Supabase database to check existing registration status
    if (isSupabaseConfigured()) {
      try {
        const { data } = await supabase
          .from('student_profiles')
          .select('*')
          .eq('email', targetEmail)
          .maybeSingle();

        if (data && data.has_completed_details === true) {
          // Fully registered existing student!
          const fullProfile: UserProfile = {
            id: data.id || profileData.id || `google-${Date.now()}`,
            name: data.name || realName,
            email: data.email,
            avatar: data.avatar || realAvatar,
            provider: 'google',
            phone: data.phone || undefined,
            whereDidYouFindUs: data.where_did_you_find_us || undefined,
            collegeOrCompany: data.college_or_company || undefined,
            learningGoal: data.learning_goal || undefined,
            hasCompletedDetails: true,
            enrolledCourses: Array.isArray(data.enrolled_courses) ? data.enrolled_courses : [],
            joinedLiveClass: Boolean(data.joined_live_class),
            createdAt: data.created_at || new Date().toISOString()
          };
          saveUserSession(fullProfile);
          await syncUserPurchasesFromCloud(fullProfile.email, fullProfile.id);
          return fullProfile;
        }

        // If existing record has incomplete details, preserve whatever details were already filled
        if (data && !data.has_completed_details) {
          const incompleteProfile: UserProfile = {
            id: data.id || profileData.id || `google-${Date.now()}`,
            name: data.name || realName,
            email: data.email,
            avatar: data.avatar || realAvatar,
            provider: 'google',
            phone: data.phone || undefined,
            whereDidYouFindUs: data.where_did_you_find_us || undefined,
            collegeOrCompany: data.college_or_company || undefined,
            learningGoal: data.learning_goal || undefined,
            hasCompletedDetails: false,
            enrolledCourses: Array.isArray(data.enrolled_courses) ? data.enrolled_courses : [],
            joinedLiveClass: Boolean(data.joined_live_class),
            createdAt: data.created_at || new Date().toISOString()
          };
          setPendingUser(incompleteProfile);
          return incompleteProfile;
        }

        if (!data) {
          // Student was deleted from Supabase or has never registered
          purgeStudentLocalData(targetEmail, profileData.id);
        }
      } catch (err) {
        console.warn('Supabase query failed during Google login:', err);
      }
    } else {
      // 2. Check local session ONLY if Supabase is offline/unconfigured
      const existing = getInitialUserSession();
      if (existing && existing.email.toLowerCase() === targetEmail && existing.hasCompletedDetails) {
        saveUserSession(existing);
        return existing;
      }
    }

    // 3. New account requiring registration completion
    purgeStudentLocalData(targetEmail, profileData.id);
    const newPendingProfile: UserProfile = {
      id: profileData.id || `google-${Date.now()}`,
      name: realName,
      email: targetEmail,
      avatar: realAvatar,
      provider: 'google',
      hasCompletedDetails: false,
      enrolledCourses: [],
      joinedLiveClass: false,
      createdAt: new Date().toISOString()
    };

    setPendingUser(newPendingProfile);

    // Save incomplete record to Supabase
    if (isSupabaseConfigured()) {
      Promise.resolve(
        supabase.from('student_profiles').upsert({
          id: newPendingProfile.id,
          email: newPendingProfile.email,
          name: newPendingProfile.name,
          avatar: newPendingProfile.avatar,
          has_completed_details: false,
          enrolled_courses: newPendingProfile.enrolledCourses,
          joined_live_class: false,
          created_at: newPendingProfile.createdAt,
          updated_at: new Date().toISOString()
        })
      ).catch(() => {});
    }

    return newPendingProfile;
  };

  // Finalizes registration after user fills basic details form with validation
  const completeOnboardingAndLogin = async (profile: UserProfile): Promise<{ success: boolean; error?: string }> => {
    // 1. Enforce required fields
    if (!profile.name || profile.name.trim().length < 2) {
      return { success: false, error: 'Full Legal Name is required.' };
    }
    const digitsPhone = (profile.phone || '').replace(/\D/g, '');
    if (digitsPhone.length !== 10) {
      return { success: false, error: 'Phone number must be exactly 10 digits.' };
    }
    if (!profile.collegeOrCompany || profile.collegeOrCompany.trim().length < 2) {
      return { success: false, error: 'College / Organization / Degree is required.' };
    }
    if (!profile.whereDidYouFindUs) {
      return { success: false, error: 'Please let us know where you found us.' };
    }

    const finalized: UserProfile = {
      ...profile,
      name: profile.name.trim(),
      phone: digitsPhone,
      collegeOrCompany: profile.collegeOrCompany.trim(),
      whereDidYouFindUs: profile.whereDidYouFindUs,
      hasCompletedDetails: true,
      enrolledCourses: Array.isArray(profile.enrolledCourses) ? profile.enrolledCourses : []
    };

    // 2. Persist to Supabase database
    if (isSupabaseConfigured() && finalized.email) {
      try {
        const { error } = await supabase.from('student_profiles').upsert({
          id: finalized.id,
          email: finalized.email,
          name: finalized.name,
          avatar: finalized.avatar,
          phone: finalized.phone,
          where_did_you_find_us: finalized.whereDidYouFindUs,
          college_or_company: finalized.collegeOrCompany,
          learning_goal: finalized.learningGoal || null,
          has_completed_details: true,
          enrolled_courses: finalized.enrolledCourses,
          joined_live_class: Boolean(finalized.joinedLiveClass),
          updated_at: new Date().toISOString()
        });

        if (error) {
          console.error('Supabase registration completion failed:', error);
          return { success: false, error: error.message || 'Database error occurred while completing registration.' };
        }
      } catch (err: any) {
        console.error('Network or database exception saving registration:', err);
        return { success: false, error: err?.message || 'Failed to save student profile to database.' };
      }
    }

    // 3. Clear any legacy blacklist records
    try {
      const deletedRaw = localStorage.getItem('dopilot_permanently_deleted_students_v1');
      if (deletedRaw) {
        const deletedList = JSON.parse(deletedRaw);
        if (Array.isArray(deletedList)) {
          const emailLower = (finalized.email || '').toLowerCase().trim();
          const filtered = deletedList.filter((item: string) => String(item).toLowerCase().trim() !== emailLower);
          localStorage.setItem('dopilot_permanently_deleted_students_v1', JSON.stringify(filtered));
        }
      }
    } catch (e) {}

    // 4. Ensure no stale purchase keys, progress, or point caches linger from deleted accounts
    purgeStudentLocalData(finalized.email, finalized.id);

    // 5. Save completed session locally
    saveUserSession(finalized);
    return { success: true };
  };

  // Allows updating profile details (from Settings page)
  const updateUserProfile = async (details: Partial<UserProfile>) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      ...details
    };
    saveUserSession(updated);
  };

  const logout = () => {
    const currentEmail = user?.email || pendingUser?.email;
    const currentId = user?.id || pendingUser?.id;
    if (currentEmail) {
      purgeStudentLocalData(currentEmail, currentId);
    }
    clearAuthCookie();
    setUser(null);
    setPendingUserState(null);
    localStorage.removeItem(USER_SESSION_KEY);
    localStorage.removeItem(USER_PENDING_KEY);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('dopilot_user_logged_out'));
      window.dispatchEvent(new Event('storage'));
    }
  };

  const enrollInCourse = (courseName: string) => {
    if (!user) return;
    const current = user.enrolledCourses || [];
    if (!current.includes(courseName)) {
      const updated: UserProfile = {
        ...user,
        enrolledCourses: [...current, courseName]
      };
      saveUserSession(updated);
    }
  };

  const isLoggedIn = Boolean(user && user.hasCompletedDetails === true);
  const isPendingRegistration = Boolean(!isLoggedIn && (pendingUser && !pendingUser.hasCompletedDetails));

  return (
    <UserAuthContext.Provider
      value={{
        user: isLoggedIn ? user : null,
        pendingUser: isPendingRegistration ? pendingUser : null,
        isLoggedIn,
        isPendingRegistration,
        setPendingUser,
        loginWithGoogleCredential,
        loginWithGoogleDirect,
        completeOnboardingAndLogin,
        updateUserProfile,
        logout,
        enrollInCourse,
        clearPendingRegistration,
        refreshUserSession
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};
