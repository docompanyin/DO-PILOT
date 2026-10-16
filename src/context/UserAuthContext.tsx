import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

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
        return null;
      }
      if (parsed.hasCompletedDetails === true) {
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
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(newUser));
      localStorage.removeItem(USER_PENDING_KEY);
      setPendingUserState(null);
      
      if (newUser.email && isSupabaseConfigured()) {
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
              enrolled_courses: newUser.enrolledCourses || ['Complete Python Course'],
              joined_live_class: Boolean(newUser.joinedLiveClass),
              updated_at: new Date().toISOString()
            })
        ).catch((err) => {
          console.warn('Background Supabase upsert failed:', err);
        });
      }
    } else {
      localStorage.removeItem(USER_SESSION_KEY);
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
            enrolledCourses: data.enrolled_courses || ['Complete Python Course'],
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
            enrolledCourses: data.enrolled_courses || ['Complete Python Course'],
            joinedLiveClass: Boolean(data.joined_live_class),
            createdAt: data.created_at || new Date().toISOString()
          };
          setUser(null);
          setPendingUser(incomplete);
        }
      }
    } catch (e) {
      console.warn('Session refresh error:', e);
    }
  }, [user?.email, user?.id, user?.name, user?.avatar, user?.phone, user?.whereDidYouFindUs, user?.collegeOrCompany, user?.learningGoal, user?.createdAt, pendingUser, saveUserSession, setPendingUser]);

  useEffect(() => {
    refreshUserSession();
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
            enrolledCourses: data.enrolled_courses || ['Complete Python Course'],
            joinedLiveClass: Boolean(data.joined_live_class),
            createdAt: data.created_at || new Date().toISOString()
          };
          saveUserSession(fullProfile);
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
            enrolledCourses: data.enrolled_courses || ['Complete Python Course'],
            joinedLiveClass: Boolean(data.joined_live_class),
            createdAt: data.created_at || new Date().toISOString()
          };
          setPendingUser(incompleteProfile);
          return incompleteProfile;
        }
      } catch (err) {
        console.warn('Supabase query failed during Google login:', err);
      }
    }

    // 2. Check local session if Supabase was unavailable or new
    const existing = getInitialUserSession();
    if (existing && existing.email.toLowerCase() === targetEmail && existing.hasCompletedDetails) {
      saveUserSession(existing);
      return existing;
    }

    // 3. New account requiring registration completion
    const newPendingProfile: UserProfile = {
      id: profileData.id || `google-${Date.now()}`,
      name: realName,
      email: targetEmail,
      avatar: realAvatar,
      provider: 'google',
      hasCompletedDetails: false,
      enrolledCourses: ['Complete Python Course'],
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
      enrolledCourses: profile.enrolledCourses?.length ? profile.enrolledCourses : ['Complete Python Course']
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

    // 3. Save completed session locally
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
    setUser(null);
    setPendingUserState(null);
    localStorage.removeItem(USER_SESSION_KEY);
    localStorage.removeItem(USER_PENDING_KEY);
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
