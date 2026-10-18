import React, { useState, useEffect, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useUserAuth, USER_SESSION_KEY } from '../../context/UserAuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { purgeStudentLocalData } from '../../utils/studentDataPurge';

interface CourseAuthGuardProps {
  children: React.ReactNode;
}

/**
 * CourseAuthGuard
 * 
 * Strict authentication & access-control guard for all course question-answering pages:
 * 1. Blocks direct URL entry, bookmarked links, refresh, and back-button navigation for unauthenticated users.
 * 2. Immediately redirects to homepage ('/') if the user signs out.
 * 3. Immediately invalidates session and redirects to homepage ('/') if an admin permanently deletes the account.
 * 4. Actively verifies session existence and integrity against backend/Supabase database.
 */
export const CourseAuthGuard: React.FC<CourseAuthGuardProps> = ({ children }) => {
  const { user, isLoggedIn, logout } = useUserAuth();
  const navigate = useNavigate();

  // Fast synchronous check to prevent content flash for unauthenticated users
  const isLocallyAuthenticated = useCallback((): boolean => {
    try {
      const raw = localStorage.getItem(USER_SESSION_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.email || parsed.hasCompletedDetails !== true) return false;

      // Check permanent deletion blacklist
      const deletedRaw = localStorage.getItem('dopilot_permanently_deleted_students_v1');
      if (deletedRaw) {
        const deletedList = JSON.parse(deletedRaw);
        if (Array.isArray(deletedList) && deletedList.includes(parsed.email.toLowerCase().trim())) {
          return false;
        }
      }
      return true;
    } catch {
      return false;
    }
  }, []);

  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    return (isLoggedIn && Boolean(user?.email)) || isLocallyAuthenticated();
  });

  const handleUnauthorized = useCallback((email?: string, id?: string) => {
    setIsAuthorized(false);
    const targetEmail = email || user?.email;
    const targetId = id || user?.id;
    if (targetEmail) {
      purgeStudentLocalData(targetEmail, targetId);
    }
    logout();
    navigate('/', { replace: true });
  }, [logout, navigate, user?.email, user?.id]);

  // Server-side validation against Supabase backend (student_profiles table)
  const validateSessionAgainstBackend = useCallback(async () => {
    const raw = localStorage.getItem(USER_SESSION_KEY);
    if (!raw) {
      handleUnauthorized();
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      const email = (parsed?.email || '').toLowerCase().trim();
      const id = parsed?.id;

      if (!email) {
        handleUnauthorized();
        return;
      }

      // 1. Check local deletion blacklist
      const deletedRaw = localStorage.getItem('dopilot_permanently_deleted_students_v1');
      if (deletedRaw) {
        const deletedList = JSON.parse(deletedRaw);
        if (Array.isArray(deletedList) && deletedList.includes(email)) {
          handleUnauthorized(email, id);
          return;
        }
      }

      // 2. Query Supabase database to verify account still exists and is active
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('student_profiles')
          .select('id, email, has_completed_details')
          .eq('email', email)
          .maybeSingle();

        if (!error) {
          if (!data) {
            // Student was permanently deleted by admin!
            console.warn(`[CourseAuthGuard] Access revoked: Student ${email} was permanently deleted.`);
            handleUnauthorized(email, id);
            return;
          }
          if (data.has_completed_details !== true) {
            console.warn(`[CourseAuthGuard] Access revoked: Student ${email} registration is incomplete.`);
            handleUnauthorized(email, id);
            return;
          }
        }
      }
    } catch (err) {
      console.warn('[CourseAuthGuard] Backend validation warning:', err);
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    // 1. Verify local authentication immediately
    if (!isLocallyAuthenticated()) {
      handleUnauthorized();
      return;
    }

    // 2. Validate against backend
    validateSessionAgainstBackend();

    // 3. Listen for logout event (dispatched on sign out)
    const onLogout = () => {
      handleUnauthorized();
    };

    // 4. Listen for storage changes across tabs (signout in other tab or deletion)
    const onStorageChange = (e: StorageEvent) => {
      if (e.key === USER_SESSION_KEY && !e.newValue) {
        handleUnauthorized();
      } else if (e.key === 'dopilot_permanently_deleted_students_v1') {
        const raw = localStorage.getItem(USER_SESSION_KEY);
        if (raw) {
          try {
            const p = JSON.parse(raw);
            const list = e.newValue ? JSON.parse(e.newValue) : [];
            if (p?.email && Array.isArray(list) && list.includes(p.email.toLowerCase().trim())) {
              handleUnauthorized(p.email, p.id);
            }
          } catch {}
        }
      }
    };

    // 5. Handle browser back / forward navigation (bfcache restoration)
    const onPageShow = () => {
      if (!isLocallyAuthenticated()) {
        handleUnauthorized();
      } else {
        validateSessionAgainstBackend();
      }
    };

    // 6. Handle tab focus / visibility change
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (!isLocallyAuthenticated()) {
          handleUnauthorized();
        } else {
          validateSessionAgainstBackend();
        }
      }
    };

    // 7. Background heartbeat check every 10 seconds to catch admin deletions in real-time
    const heartbeatTimer = setInterval(() => {
      if (!isLocallyAuthenticated()) {
        handleUnauthorized();
      } else {
        validateSessionAgainstBackend();
      }
    }, 10000);

    window.addEventListener('dopilot_user_logged_out', onLogout);
    window.addEventListener('storage', onStorageChange);
    window.addEventListener('pageshow', onPageShow);
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('focus', onVisibilityChange);

    return () => {
      clearInterval(heartbeatTimer);
      window.removeEventListener('dopilot_user_logged_out', onLogout);
      window.removeEventListener('storage', onStorageChange);
      window.removeEventListener('pageshow', onPageShow);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('focus', onVisibilityChange);
    };
  }, [handleUnauthorized, isLocallyAuthenticated, validateSessionAgainstBackend]);

  // Synchronous guard block: if not authorized or logged out, immediately navigate to homepage
  if (!isAuthorized || (!isLoggedIn && !isLocallyAuthenticated())) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default CourseAuthGuard;
