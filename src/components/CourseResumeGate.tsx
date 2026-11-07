import React, { useEffect, useState } from 'react';
import { fetchAuthoritativeCheckpoint } from '../utils/courseCheckpointService';
import { normalizeStudentEmail } from '../utils/courseProgressSyncService';
import { supabase } from '../lib/supabase';

interface CourseResumeGateProps {
  courseId: string;
  partNum: number;
  children: React.ReactNode;
}

const GATED_HYDRATIONS: Record<string, boolean> = {};

export const CourseResumeGate: React.FC<CourseResumeGateProps> = ({
  courseId,
  partNum,
  children
}) => {
  const [isHydrated, setIsHydrated] = useState<boolean>(() => {
    // If already marked as hydrated for this course & part in memory, skip gate
    let email = '';
    try {
      const stored = localStorage.getItem('dopilot_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        email = normalizeStudentEmail(parsed.email || parsed.user_email);
      }
    } catch {}

    const gateKey = `${email}::${courseId}::${partNum}`;
    return Boolean(GATED_HYDRATIONS[gateKey]);
  });

  useEffect(() => {
    let isMounted = true;

    async function hydrateCheckpoint() {
      let email = '';
      try {
        const stored = localStorage.getItem('dopilot_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          email = normalizeStudentEmail(parsed.email || parsed.user_email);
        }
      } catch {}

      if (!email) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user?.email) {
            email = normalizeStudentEmail(session.user.email);
          }
        } catch {}
      }

      const gateKey = `${email}::${courseId}::${partNum}`;

      if (GATED_HYDRATIONS[gateKey]) {
        if (isMounted) setIsHydrated(true);
        return;
      }

      if (!email) {
        // Guest / unauthenticated - proceed with default
        GATED_HYDRATIONS[gateKey] = true;
        if (isMounted) setIsHydrated(true);
        return;
      }

      // Fetch cloud checkpoint with timeout safeguard
      const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 2500));
      try {
        await Promise.race([
          fetchAuthoritativeCheckpoint(email, courseId, partNum),
          timeoutPromise
        ]);
      } catch (err) {
        console.warn('Resume gate fetch non-fatal error:', err);
      } finally {
        GATED_HYDRATIONS[gateKey] = true;
        if (isMounted) {
          setIsHydrated(true);
        }
      }
    }

    if (!isHydrated) {
      hydrateCheckpoint();
    }

    return () => {
      isMounted = false;
    };
  }, [courseId, partNum, isHydrated]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 relative flex items-center justify-center mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping"></div>
          <div className="w-12 h-12 rounded-full border-4 border-t-indigo-500 border-r-indigo-500 border-b-transparent border-l-transparent animate-spin"></div>
        </div>
        <h2 className="text-xl font-bold text-white mb-2 tracking-wide">
          Resuming Course
        </h2>
        <p className="text-sm text-slate-400 max-w-sm mb-4 leading-relaxed">
          Retrieving your exact study position, questions, and progress from the cloud...
        </p>
        <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full animate-pulse w-3/4"></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
