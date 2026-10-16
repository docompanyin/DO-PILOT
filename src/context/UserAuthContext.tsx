import React, { createContext, useContext, useState } from 'react';
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
  isLoggedIn: boolean;
  loginWithGoogleCredential: (credential: string) => UserProfile | null;
  loginWithGoogleDirect: (profileData?: { name?: string; email?: string; avatar?: string; id?: string }) => UserProfile | null;
  completeOnboardingAndLogin: (profile: UserProfile) => void;
  updateUserProfile: (details: Partial<UserProfile>) => void;
  logout: () => void;
  enrollInCourse: (courseName: string) => void;
}

const USER_SESSION_KEY = 'dopilot_student_session_v1';

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

// Helper to decode standard base64 Google JWT payload without external libraries
const parseGoogleJwt = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
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
      return parsed;
    }
  } catch (e) {
    console.error('Failed to restore user session:', e);
  }
  return null;
};

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(getInitialUserSession);

  const saveUserSession = (newUser: UserProfile | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(newUser));
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
              has_completed_details: Boolean(newUser.hasCompletedDetails),
              enrolled_courses: newUser.enrolledCourses || ['Complete Python Course'],
              joined_live_class: Boolean(newUser.joinedLiveClass),
              updated_at: new Date().toISOString()
            })
        ).catch(() => {});
      }
    } else {
      localStorage.removeItem(USER_SESSION_KEY);
    }
  };

  // Google One-Tap / Identity Services token login with real credential
  const loginWithGoogleCredential = (credential: string): UserProfile | null => {
    const payload = parseGoogleJwt(credential);
    if (payload && payload.email) {
      const realName = payload.name || payload.given_name || payload.email.split('@')[0];
      const realAvatar = payload.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(realName)}&background=00ff9d&color=000000&bold=true`;
      
      const existing = getInitialUserSession();
      if (existing && existing.email === payload.email && existing.hasCompletedDetails) {
        saveUserSession(existing);
        return existing;
      }

      const profile: UserProfile = {
        id: payload.sub || `google-${Date.now()}`,
        name: realName,
        email: payload.email,
        avatar: realAvatar,
        provider: 'google',
        hasCompletedDetails: false,
        enrolledCourses: ['Complete Python Course'],
        joinedLiveClass: false,
        createdAt: new Date().toISOString()
      };
      return profile;
    }
    return null;
  };

  // Real Google OAuth login flow (from real userinfo response)
  const loginWithGoogleDirect = (profileData?: { name?: string; email?: string; avatar?: string; id?: string }): UserProfile | null => {
    if (!profileData || !profileData.email) return null;
    const realName = profileData.name || profileData.email.split('@')[0];
    const realAvatar = profileData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(realName)}&background=00ff9d&color=000000&bold=true`;

    const existing = getInitialUserSession();
    if (existing && existing.email === profileData.email && existing.hasCompletedDetails) {
      saveUserSession(existing);
      return existing;
    }

    const profile: UserProfile = {
      id: profileData.id || `google-${Date.now()}`,
      name: realName,
      email: profileData.email,
      avatar: realAvatar,
      provider: 'google',
      hasCompletedDetails: false,
      enrolledCourses: ['Complete Python Course'],
      joinedLiveClass: false,
      createdAt: new Date().toISOString()
    };
    return profile;
  };

  // Finalizes registration after user fills basic details form with validation
  const completeOnboardingAndLogin = (profile: UserProfile) => {
    const finalized: UserProfile = {
      ...profile,
      hasCompletedDetails: true,
      enrolledCourses: profile.enrolledCourses?.length ? profile.enrolledCourses : ['Complete Python Course']
    };
    saveUserSession(finalized);
  };

  // Allows updating profile details (from Settings page)
  const updateUserProfile = (details: Partial<UserProfile>) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      ...details
    };
    saveUserSession(updated);
  };

  const logout = () => {
    saveUserSession(null);
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

  return (
    <UserAuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user && !!user.hasCompletedDetails,
        loginWithGoogleCredential,
        loginWithGoogleDirect,
        completeOnboardingAndLogin,
        updateUserProfile,
        logout,
        enrollInCourse
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
