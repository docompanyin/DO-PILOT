import React, { useEffect, useCallback } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useUserAuth, USER_SESSION_KEY, hasAuthCookie } from '../../context/UserAuthContext';
import { purgeStudentLocalData } from '../../utils/studentDataPurge';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoggedIn, isPendingRegistration, logout } = useUserAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isLocallyAuthenticated = useCallback((): boolean => {
    try {
      if (!hasAuthCookie()) return false;
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

  const handleUnauthorized = useCallback(() => {
    const targetEmail = user?.email;
    const targetId = user?.id;
    if (targetEmail) {
      purgeStudentLocalData(targetEmail, targetId);
    }
    logout();
    navigate('/', { replace: true });
  }, [logout, navigate, user?.email, user?.id]);

  // Click interceptor & session watchdog for authenticated pages (Profile / Settings)
  useEffect(() => {
    const handleCaptureClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const clickable = target?.closest('button, a, [role="button"], input, select, textarea, label');
      if (clickable) {
        if (!isLocallyAuthenticated()) {
          e.preventDefault();
          e.stopPropagation();
          handleUnauthorized();
        }
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === USER_SESSION_KEY && !e.newValue) {
        handleUnauthorized();
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        if (!isLocallyAuthenticated()) {
          handleUnauthorized();
        }
      }
    };

    const intervalTimer = setInterval(() => {
      if (!isLocallyAuthenticated()) {
        handleUnauthorized();
      }
    }, 5000);

    window.addEventListener('click', handleCaptureClick, true);
    window.addEventListener('storage', handleStorage);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    return () => {
      clearInterval(intervalTimer);
      window.removeEventListener('click', handleCaptureClick, true);
      window.removeEventListener('storage', handleStorage);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
    };
  }, [handleUnauthorized, isLocallyAuthenticated]);

  if (isPendingRegistration) {
    return <Navigate to={`/signup?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  if (!isLoggedIn || !isLocallyAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
