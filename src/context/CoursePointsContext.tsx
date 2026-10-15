import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { playTwinkleSound } from '../utils/audioEffects';
import { useUserAuth } from './UserAuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface SolvedTaskRecord {
  id: string;
  title: string;
  points: number;
  solvedAt: string;
  code?: string;
}

export interface TwinkleEvent {
  id: number;
  active: boolean;
  points: number;
  taskTitle: string;
}

interface CoursePointsContextType {
  points: number;
  solvedTasks: Record<string, SolvedTaskRecord>;
  awardPoint: (taskId: string, title: string, code?: string) => boolean;
  isTaskSolved: (taskId: string) => boolean;
  recordWrongAttempt: (taskTitle: string, section: string, detail: string) => void;
  resetProgress: () => void;
  twinkleEvent: TwinkleEvent | null;
  triggerTwinkle: (taskTitle: string) => void;
  dismissTwinkle: () => void;
}

const GLOBAL_STORAGE_KEY = 'dopilot_course_points_v3';

const CoursePointsContext = createContext<CoursePointsContextType | undefined>(undefined);

export const CoursePointsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUserAuth();
  const studentKey = user?.email 
    ? `dopilot_user_${user.email.replace(/[^a-zA-Z0-9]/g, '_')}_points` 
    : GLOBAL_STORAGE_KEY;

  const [points, setPoints] = useState<number>(0);
  const [solvedTasks, setSolvedTasks] = useState<Record<string, SolvedTaskRecord>>({});
  const [twinkleEvent, setTwinkleEvent] = useState<TwinkleEvent | null>(null);

  // Synchronous in-memory ref & lock to strictly prevent duplicate awards across rapid async events
  const solvedTasksRef = useRef<Record<string, SolvedTaskRecord>>({});
  const pendingAwardLockRef = useRef<Set<string>>(new Set());

  // Load from localStorage on mount or whenever logged-in user changes, then sync from Supabase
  useEffect(() => {
    try {
      let saved = localStorage.getItem(studentKey);
      // Fallback: If this is an existing user without their scoped key yet, check global key
      if (!saved && user?.email) {
        saved = localStorage.getItem(GLOBAL_STORAGE_KEY);
      }
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.points === 'number') {
          setPoints(parsed.points);
        } else {
          setPoints(0);
        }
        if (parsed.solvedTasks && typeof parsed.solvedTasks === 'object') {
          setSolvedTasks(parsed.solvedTasks);
          solvedTasksRef.current = parsed.solvedTasks;
        } else {
          setSolvedTasks({});
          solvedTasksRef.current = {};
        }
      } else {
        setPoints(0);
        setSolvedTasks({});
        solvedTasksRef.current = {};
      }
    } catch (e) {
      console.error('Failed to load course points:', e);
    }

    // Sync student progress from Supabase Cloud if user is logged in
    if (user?.email && isSupabaseConfigured()) {
      Promise.resolve(
        supabase
          .from('student_progress')
          .select('points, solved_tasks')
          .eq('user_email', user.email)
          .maybeSingle()
      )
        .then((res: any) => {
          if (res?.data) {
            const cloudPoints = Number(res.data.points) || 0;
            const cloudSolved = res.data.solved_tasks || {};
            setPoints((prev) => Math.max(prev, cloudPoints));
            setSolvedTasks((prev) => {
              const merged = { ...cloudSolved, ...prev };
              solvedTasksRef.current = merged;
              return merged;
            });
          }
        })
        .catch(() => {});
    }
  }, [studentKey, user?.email]);

  // Save to localStorage & Supabase cloud whenever points or solvedTasks change
  const persistState = useCallback((newPoints: number, newSolved: Record<string, SolvedTaskRecord>) => {
    try {
      const payload = JSON.stringify({
        points: newPoints,
        solvedTasks: newSolved,
        updatedAt: new Date().toISOString()
      });
      localStorage.setItem(studentKey, payload);
      localStorage.setItem(GLOBAL_STORAGE_KEY, payload);

      if (user?.email && isSupabaseConfigured()) {
        Promise.resolve(
          supabase
            .from('student_progress')
            .upsert({
              user_email: user.email,
              points: newPoints,
              solved_tasks: newSolved,
              updated_at: new Date().toISOString()
            })
        ).catch(() => {});
      }
    } catch (e) {
      console.error('Failed to save course points:', e);
    }
  }, [studentKey, user?.email]);

  const isTaskSolved = useCallback((taskId: string): boolean => {
    return Boolean(solvedTasksRef.current[taskId] || solvedTasks[taskId]);
  }, [solvedTasks]);

  const triggerTwinkle = useCallback((taskTitle: string) => {
    setTwinkleEvent({
      id: Date.now(),
      active: true,
      points: 1,
      taskTitle
    });
  }, []);

  const dismissTwinkle = useCallback(() => {
    setTwinkleEvent(null);
  }, []);

  const awardPoint = useCallback((taskId: string, title: string, code?: string): boolean => {
    if (!taskId) return false;

    // Strict synchronous lock check: if already solved OR currently in-flight, reject immediately
    if (solvedTasksRef.current[taskId] || pendingAwardLockRef.current.has(taskId)) {
      return false;
    }

    // Immediately acquire lock synchronously
    pendingAwardLockRef.current.add(taskId);

    const newRecord: SolvedTaskRecord = {
      id: taskId,
      title,
      points: 1,
      solvedAt: new Date().toISOString(),
      code
    };

    // Store in synchronous ref immediately so any rapid duplicate call returns false
    solvedTasksRef.current[taskId] = newRecord;

    setPoints((currentPoints) => {
      const calculatedPoints = currentPoints + 1;

      setSolvedTasks((prevSolved) => {
        const newSolved = {
          ...prevSolved,
          [taskId]: newRecord
        };
        // Persist progress immediately so data is never lost
        persistState(calculatedPoints, newSolved);
        return newSolved;
      });

      // Trigger exactly one visual flying reward point effect
      triggerTwinkle(title);

      // Keep navbar counter stable during flight
      return currentPoints;
    });

    // Synchronize the display counter increment with the exact landing at the navbar (~1400ms)
    setTimeout(() => {
      setPoints((prev) => prev + 1);
      // Release lock after animation and counter update have completed
      pendingAwardLockRef.current.delete(taskId);
    }, 1400);

    return true;
  }, [persistState, triggerTwinkle]);

  const recordWrongAttempt = (taskTitle: string, section: string, detail: string) => {
    try {
      const saved = localStorage.getItem('dopilot_wrong_attempts');
      const list = saved ? JSON.parse(saved) : [];
      const newRecord = {
        taskTitle,
        section,
        failedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        detail
      };
      const updated = [newRecord, ...list].slice(0, 50);
      localStorage.setItem('dopilot_wrong_attempts', JSON.stringify(updated));

      if (user?.email && isSupabaseConfigured()) {
        Promise.resolve(
          supabase
            .from('student_progress')
            .upsert({
              user_email: user.email,
              points,
              solved_tasks: solvedTasks,
              wrong_attempts: updated,
              updated_at: new Date().toISOString()
            })
        ).catch(() => {});
      }
    } catch (e) {
      console.error('Error logging wrong attempt:', e);
    }
  };

  const resetProgress = useCallback(() => {
    solvedTasksRef.current = {};
    pendingAwardLockRef.current.clear();
    setPoints(0);
    setSolvedTasks({});
    localStorage.removeItem(studentKey);
    localStorage.removeItem(GLOBAL_STORAGE_KEY);
    localStorage.removeItem('dopilot_course_points_v2');
    localStorage.removeItem('dopilot_course_points');
    localStorage.removeItem('dopilot_mcq_answers');
    localStorage.removeItem('dopilot_mcq_answers_v2');
    localStorage.removeItem('dopilot_wrong_attempts');
  }, [studentKey]);

  return (
    <CoursePointsContext.Provider
      value={{
        points,
        solvedTasks,
        awardPoint,
        isTaskSolved,
        recordWrongAttempt,
        resetProgress,
        twinkleEvent,
        triggerTwinkle,
        dismissTwinkle
      }}
    >
      {children}
    </CoursePointsContext.Provider>
  );
};

export const useCoursePoints = () => {
  const context = useContext(CoursePointsContext);
  if (!context) {
    throw new Error('useCoursePoints must be used within a CoursePointsProvider');
  }
  return context;
};
