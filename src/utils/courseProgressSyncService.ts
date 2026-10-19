import { useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface LevelResultRecord {
  isFinished: boolean;
  isPassed: boolean;
  correctCount: number;
  totalCount: number;
  percentage: number;
  streak?: number;
  attemptCount?: number;
  isSecondFailureInLevel?: boolean;
  isLocked?: boolean;
}

export interface PartQuestionState {
  activeSectionId: string;
  activeQuestionIdx: number;
  selectedAnswers: Record<string, string>;
  isStudyPhase: boolean;
  isTimeUpWaiting: boolean;
  targetEndTime: number;
  timeLeft: number;
  isCompleted?: boolean;
  isFinishedPart?: boolean;
  levelResult?: LevelResultRecord | null;
  updatedAt: string;
}

export interface CourseProgressRecord {
  lastPart: number;
  completedParts: number[];
  parts: Record<string, PartQuestionState>;
}

export interface StudentAllCoursesState {
  email: string;
  courses: Record<string, CourseProgressRecord>;
  part1SectionScores?: Record<string, any>;
  trialAttempted?: Record<string, boolean>;
  updatedAt: string;
}

export const normalizeStudentEmail = (email?: string): string => {
  return (email || '').toLowerCase().trim();
};

export const getStudentDocId = (email: string): string => {
  const clean = normalizeStudentEmail(email).replace(/[^a-z0-9_]/g, '_');
  return `student_course_state_${clean}`;
};

/**
 * Returns exact localStorage key mappings for any course and part
 */
export const getCourseStorageKeys = (courseId: string, partNum: number) => {
  const isPython = courseId.includes('python');
  const isJava = courseId.includes('java');
  const isFullstack = courseId.includes('fullstack');

  if (isPython) {
    return {
      sectionIdKey: partNum === 1 ? 'dopilot_active_section_id' : `dopilot_part${partNum}_active_section_id`,
      questionIdxKey: partNum === 1 ? 'dopilot_active_q_idx' : `dopilot_part${partNum}_active_q_idx`,
      answersKey: partNum === 1 ? 'dopilot_mcq_answers_v2' : `dopilot_part${partNum}_mcq_answers_v2`,
      studyPhaseKey: partNum === 1 ? 'dopilot_study_phase' : `dopilot_part${partNum}_study_phase`,
      targetEndTimeKey: partNum === 1 ? 'dopilot_q_target_end_time' : `dopilot_part${partNum}_q_target_end_time`,
      timeUpKey: partNum === 1 ? 'dopilot_time_up' : `dopilot_part${partNum}_time_up`,
      completedKey: `dopilot_part${partNum}_completed`,
      finishedKey: partNum === 1 ? 'dopilot_part1_finished' : `dopilot_part${partNum}_finished`,
      levelResultKey: partNum === 1 ? 'dopilot_level_result' : `dopilot_part${partNum}_level_result`,
      lastPartKey: 'dopilot_python_core_last_part'
    };
  } else if (isJava) {
    return {
      sectionIdKey: partNum === 1 ? 'dopilot_java_active_section_id' : `dopilot_java_part${partNum}_active_section_id`,
      questionIdxKey: partNum === 1 ? 'dopilot_java_active_q_idx' : `dopilot_java_part${partNum}_active_q_idx`,
      answersKey: partNum === 1 ? 'dopilot_java_mcq_answers' : `dopilot_java_part${partNum}_mcq_answers`,
      studyPhaseKey: partNum === 1 ? 'dopilot_java_study_phase' : `dopilot_java_part${partNum}_study_phase`,
      targetEndTimeKey: partNum === 1 ? 'dopilot_java_q_target_end_time' : `dopilot_java_part${partNum}_q_target_end_time`,
      timeUpKey: partNum === 1 ? 'dopilot_java_time_up' : `dopilot_java_part${partNum}_time_up`,
      completedKey: `dopilot_java_part${partNum}_completed`,
      finishedKey: partNum === 1 ? 'dopilot_java_part1_finished' : `dopilot_java_part${partNum}_finished`,
      levelResultKey: partNum === 1 ? 'dopilot_java_level_result' : `dopilot_java_part${partNum}_level_result`,
      lastPartKey: 'dopilot_java_core_last_part'
    };
  } else if (isFullstack) {
    return {
      sectionIdKey: `dopilot_fullstack_part${partNum}_active_section_id`,
      questionIdxKey: `dopilot_fullstack_part${partNum}_active_q_idx`,
      answersKey: `dopilot_fullstack_part${partNum}_mcq_answers`,
      studyPhaseKey: `dopilot_fullstack_part${partNum}_study_phase`,
      targetEndTimeKey: `dopilot_fullstack_part${partNum}_q_target_end_time`,
      timeUpKey: `dopilot_fullstack_part${partNum}_time_up`,
      completedKey: `dopilot_fullstack_part${partNum}_completed`,
      finishedKey: `dopilot_fullstack_part${partNum}_finished`,
      levelResultKey: `dopilot_fullstack_part${partNum}_level_result`,
      lastPartKey: 'dopilot_fullstack_core_last_part'
    };
  } else {
    // Cyber Security
    return {
      sectionIdKey: `dopilot_cyber_part${partNum}_active_section_id`,
      questionIdxKey: `dopilot_cyber_part${partNum}_active_q_idx`,
      answersKey: `dopilot_cyber_part${partNum}_mcq_answers`,
      studyPhaseKey: `dopilot_cyber_part${partNum}_study_phase`,
      targetEndTimeKey: `dopilot_cyber_part${partNum}_q_target_end_time`,
      timeUpKey: `dopilot_cyber_part${partNum}_time_up`,
      completedKey: `dopilot_cyber_part${partNum}_completed`,
      finishedKey: `dopilot_cyber_part${partNum}_finished`,
      levelResultKey: `dopilot_cyber_part${partNum}_level_result`,
      lastPartKey: 'dopilot_cyber_core_last_part'
    };
  }
};

// In-memory cache to merge updates synchronously before pushing to cloud
export const memoryCourseState: Record<string, StudentAllCoursesState> = {};
let syncTimeout: any = null;

export const queueCloudSync = (email: string) => {
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }
  syncTimeout = setTimeout(async () => {
    const cleanEmail = normalizeStudentEmail(email);
    if (!cleanEmail || !isSupabaseConfigured()) return;
    const state = memoryCourseState[cleanEmail];
    if (!state) return;

    try {
      const docId = getStudentDocId(cleanEmail);
      await supabase.from('site_content').upsert({
        id: docId,
        content: state,
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Background course progress cloud sync error:', e);
    }
  }, 250);
};

export const clearMemoryCourseState = (email?: string) => {
  if (syncTimeout) {
    clearTimeout(syncTimeout);
    syncTimeout = null;
  }
  if (!email) {
    Object.keys(memoryCourseState).forEach((k) => delete memoryCourseState[k]);
    return;
  }
  const cleanEmail = normalizeStudentEmail(email);
  if (cleanEmail && memoryCourseState[cleanEmail]) {
    delete memoryCourseState[cleanEmail];
  }
};

export function parseCourseStorageKey(key: string): { courseId: string; partNum: number; field: string } | null {
  if (key.startsWith('dopilot_java_')) {
    const sub = key.replace('dopilot_java_', '');
    if (sub === 'core_last_part') return { courseId: 'java-core', partNum: 1, field: 'lastPart' };
    if (sub === 'part1_completed') return { courseId: 'java-core', partNum: 1, field: 'completed' };
    if (sub === 'part1_finished') return { courseId: 'java-core', partNum: 1, field: 'finished' };
    if (sub === 'level_result' || sub === 'part1_level_result') return { courseId: 'java-core', partNum: 1, field: 'level_result' };
    if (['active_section_id', 'active_q_idx', 'study_phase', 'time_up', 'q_target_end_time', 'mcq_answers'].includes(sub)) {
      return { courseId: 'java-core', partNum: 1, field: sub };
    }
    const m = sub.match(/^part(\d+)_(.+)$/);
    if (m) {
      return { courseId: 'java-core', partNum: parseInt(m[1], 10), field: m[2] };
    }
  } else if (key.startsWith('dopilot_fullstack_')) {
    const sub = key.replace('dopilot_fullstack_', '');
    if (sub === 'core_last_part') return { courseId: 'fullstack-open', partNum: 1, field: 'lastPart' };
    const m = sub.match(/^part(\d+)_(.+)$/);
    if (m) {
      return { courseId: 'fullstack-open', partNum: parseInt(m[1], 10), field: m[2] };
    }
  } else if (key.startsWith('dopilot_cyber_')) {
    const sub = key.replace('dopilot_cyber_', '');
    if (sub === 'core_last_part') return { courseId: 'cyber-security', partNum: 1, field: 'lastPart' };
    const m = sub.match(/^part(\d+)_(.+)$/);
    if (m) {
      return { courseId: 'cyber-security', partNum: parseInt(m[1], 10), field: m[2] };
    }
  } else if (key.startsWith('dopilot_')) {
    const sub = key.replace('dopilot_', '');
    if (sub === 'python_core_last_part') return { courseId: 'python-core', partNum: 1, field: 'lastPart' };
    if (sub === 'level_result' || sub === 'part1_level_result') return { courseId: 'python-core', partNum: 1, field: 'level_result' };
    if (sub === 'part1_finished') return { courseId: 'python-core', partNum: 1, field: 'finished' };
    if (sub.startsWith('part1_')) {
      const field = sub.replace('part1_', '');
      return { courseId: 'python-core', partNum: 1, field };
    }
    const m = sub.match(/^part(\d+)_(.+)$/);
    if (m) {
      return { courseId: 'python-core', partNum: parseInt(m[1], 10), field: m[2] };
    }
    if (['active_section_id', 'active_q_idx', 'study_phase', 'time_up', 'q_target_end_time'].includes(sub)) {
      return { courseId: 'python-core', partNum: 1, field: sub };
    }
    if (sub.startsWith('mcq_answers')) {
      return { courseId: 'python-core', partNum: 1, field: 'mcq_answers' };
    }
  }
  return null;
}

/**
 * Initializes automatic transparent localStorage synchronization to cloud for logged in students.
 */
let isInterceptorInitialized = false;
export const initCourseProgressSyncInterceptor = () => {
  if (typeof window === 'undefined' || !window.localStorage || isInterceptorInitialized) return;
  isInterceptorInitialized = true;

  const originalSetItem = window.localStorage.setItem.bind(window.localStorage);
  const originalRemoveItem = window.localStorage.removeItem.bind(window.localStorage);

  window.localStorage.setItem = (key: string, value: string) => {
    originalSetItem(key, value);

    try {
      const sessionRaw = window.localStorage.getItem('dopilot_student_session_v1');
      if (!sessionRaw) return;
      const session = JSON.parse(sessionRaw);
      const email = normalizeStudentEmail(session?.email);
      if (!email) return;

      if (!memoryCourseState[email]) {
        memoryCourseState[email] = {
          email,
          courses: {},
          updatedAt: new Date().toISOString()
        };
      }

      const st = memoryCourseState[email];

      if (key.includes('_part1_section_scores')) {
        if (!st.part1SectionScores) st.part1SectionScores = {};
        try {
          st.part1SectionScores[key] = JSON.parse(value);
        } catch {
          st.part1SectionScores[key] = value;
        }
        st.updatedAt = new Date().toISOString();
        queueCloudSync(email);
        return;
      }

      if (key.includes('_trial_attempted')) {
        if (!st.trialAttempted) st.trialAttempted = {};
        st.trialAttempted[key] = value === 'true';
        st.updatedAt = new Date().toISOString();
        queueCloudSync(email);
        return;
      }

      const parsed = parseCourseStorageKey(key);
      if (!parsed) return;
      if (!st.courses[parsed.courseId]) {
        st.courses[parsed.courseId] = {
          lastPart: parsed.partNum,
          completedParts: [],
          parts: {}
        };
      }

      const cRec = st.courses[parsed.courseId];
      if (parsed.field === 'lastPart') {
        cRec.lastPart = parseInt(value, 10) || parsed.partNum;
      } else if (parsed.field === 'completed') {
        if (!cRec.completedParts.includes(parsed.partNum)) {
          cRec.completedParts.push(parsed.partNum);
        }
      } else {
        const pKey = String(parsed.partNum);
        if (!cRec.parts[pKey]) {
          cRec.parts[pKey] = {
            activeSectionId: '',
            activeQuestionIdx: 0,
            selectedAnswers: {},
            isStudyPhase: true,
            isTimeUpWaiting: false,
            targetEndTime: 0,
            timeLeft: 30,
            updatedAt: new Date().toISOString()
          };
        }
        const partState = cRec.parts[pKey];
        if (parsed.field === 'active_section_id') partState.activeSectionId = value;
        else if (parsed.field === 'active_q_idx') partState.activeQuestionIdx = parseInt(value, 10) || 0;
        else if (parsed.field.includes('mcq_answers')) {
          try {
            partState.selectedAnswers = JSON.parse(value);
          } catch {}
        } else if (parsed.field === 'study_phase') partState.isStudyPhase = value === 'true';
        else if (parsed.field === 'time_up') partState.isTimeUpWaiting = value === 'true';
        else if (parsed.field === 'q_target_end_time') partState.targetEndTime = Number(value) || 0;
        else if (parsed.field === 'level_result') {
          try {
            partState.levelResult = JSON.parse(value);
          } catch {}
        } else if (parsed.field === 'finished') {
          partState.isFinishedPart = value === 'true';
        }
        partState.updatedAt = new Date().toISOString();
      }

      st.updatedAt = new Date().toISOString();
      queueCloudSync(email);
    } catch (e) {
      console.warn('Progress interceptor error:', e);
    }
  };

  window.localStorage.removeItem = (key: string) => {
    originalRemoveItem(key);

    try {
      const parsed = parseCourseStorageKey(key);
      if (!parsed) return;

      const sessionRaw = window.localStorage.getItem('dopilot_student_session_v1');
      if (!sessionRaw) return;
      const session = JSON.parse(sessionRaw);
      const email = normalizeStudentEmail(session?.email);
      if (!email || !memoryCourseState[email]) return;

      const st = memoryCourseState[email];
      const cRec = st.courses[parsed.courseId];
      if (!cRec) return;

      const pKey = String(parsed.partNum);
      const partState = cRec.parts?.[pKey];
      if (!partState) return;

      if (parsed.field === 'time_up') {
        partState.isTimeUpWaiting = false;
        st.updatedAt = new Date().toISOString();
        queueCloudSync(email);
      } else if (parsed.field === 'level_result') {
        partState.levelResult = null;
        st.updatedAt = new Date().toISOString();
        queueCloudSync(email);
      } else if (parsed.field === 'finished') {
        partState.isFinishedPart = false;
        st.updatedAt = new Date().toISOString();
        queueCloudSync(email);
      }
    } catch {}
  };
};

// Automatically activate interceptor
initCourseProgressSyncInterceptor();

/**
 * Saves active question state locally and queues persistent sync to Supabase database.
 */
export const saveQuestionProgressState = (params: {
  courseId: string;
  partNum: number;
  activeSectionId: string;
  activeQuestionIdx: number;
  selectedAnswers: Record<string, string>;
  isStudyPhase: boolean;
  isTimeUpWaiting: boolean;
  targetEndTime: number;
  timeLeft: number;
  studentEmail?: string;
  isCompleted?: boolean;
  isFinishedPart?: boolean;
  levelResult?: LevelResultRecord | null;
}) => {
  const {
    courseId,
    partNum,
    activeSectionId,
    activeQuestionIdx,
    selectedAnswers,
    isStudyPhase,
    isTimeUpWaiting,
    targetEndTime,
    timeLeft,
    studentEmail,
    isCompleted = false,
    isFinishedPart = false,
    levelResult = null
  } = params;

  // 1. Immediately persist to localStorage
  const keys = getCourseStorageKeys(courseId, partNum);
  try {
    localStorage.setItem(keys.sectionIdKey, activeSectionId);
    localStorage.setItem(keys.questionIdxKey, String(activeQuestionIdx));
    localStorage.setItem(keys.answersKey, JSON.stringify(selectedAnswers));
    localStorage.setItem(keys.studyPhaseKey, String(isStudyPhase));
    localStorage.setItem(keys.targetEndTimeKey, String(targetEndTime));
    localStorage.setItem(keys.lastPartKey, String(partNum));
    if (isTimeUpWaiting) {
      localStorage.setItem(keys.timeUpKey, 'true');
    } else {
      localStorage.removeItem(keys.timeUpKey);
    }
    if (isCompleted) {
      localStorage.setItem(keys.completedKey, 'true');
    }
    if (isFinishedPart) {
      localStorage.setItem(keys.finishedKey, 'true');
    }
    if (levelResult) {
      localStorage.setItem(keys.levelResultKey, JSON.stringify(levelResult));
    } else {
      localStorage.removeItem(keys.levelResultKey);
    }
  } catch (e) {
    console.error('Failed writing course progress to localStorage:', e);
  }

  // 2. Queue persistent sync to database if student has valid email
  const cleanEmail = normalizeStudentEmail(studentEmail);
  if (!cleanEmail) return;

  if (!memoryCourseState[cleanEmail]) {
    memoryCourseState[cleanEmail] = {
      email: cleanEmail,
      courses: {},
      updatedAt: new Date().toISOString()
    };
  }

  const studentState = memoryCourseState[cleanEmail];
  if (!studentState.courses[courseId]) {
    studentState.courses[courseId] = {
      lastPart: partNum,
      completedParts: [],
      parts: {}
    };
  }

  const courseRec = studentState.courses[courseId];
  courseRec.lastPart = partNum;
  if (isCompleted && !courseRec.completedParts.includes(partNum)) {
    courseRec.completedParts.push(partNum);
  }

  courseRec.parts[String(partNum)] = {
    activeSectionId,
    activeQuestionIdx,
    selectedAnswers: { ...selectedAnswers },
    isStudyPhase,
    isTimeUpWaiting,
    targetEndTime,
    timeLeft,
    isCompleted,
    isFinishedPart,
    levelResult: levelResult || null,
    updatedAt: new Date().toISOString()
  };

  studentState.updatedAt = new Date().toISOString();
  queueCloudSync(cleanEmail);
};

/**
 * Saves part completion and updates progression
 */
export const saveCoursePartCompletion = (
  courseId: string,
  partNum: number,
  nextPart: number,
  studentEmail?: string
) => {
  const keys = getCourseStorageKeys(courseId, partNum);
  try {
    localStorage.setItem(keys.completedKey, 'true');
    localStorage.setItem(keys.lastPartKey, String(nextPart));
  } catch {}

  const cleanEmail = normalizeStudentEmail(studentEmail);
  if (!cleanEmail) return;

  if (!memoryCourseState[cleanEmail]) {
    memoryCourseState[cleanEmail] = {
      email: cleanEmail,
      courses: {},
      updatedAt: new Date().toISOString()
    };
  }

  const studentState = memoryCourseState[cleanEmail];
  if (!studentState.courses[courseId]) {
    studentState.courses[courseId] = {
      lastPart: nextPart,
      completedParts: [partNum],
      parts: {}
    };
  } else {
    const courseRec = studentState.courses[courseId];
    courseRec.lastPart = nextPart;
    if (!courseRec.completedParts.includes(partNum)) {
      courseRec.completedParts.push(partNum);
    }
  }

  studentState.updatedAt = new Date().toISOString();
  queueCloudSync(cleanEmail);
};

/**
 * Restores ALL student course progress from Supabase Cloud into localStorage and memory.
 */
export const restoreAllStudentCourseProgressFromCloud = async (
  studentEmail?: string
): Promise<StudentAllCoursesState | null> => {
  const cleanEmail = normalizeStudentEmail(studentEmail);
  if (!cleanEmail || !isSupabaseConfigured()) return null;

  try {
    const docId = getStudentDocId(cleanEmail);
    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('id', docId)
      .maybeSingle();

    if (error || !data || !data.content) {
      return null;
    }

    const cloudState = data.content as StudentAllCoursesState;
    if (!cloudState || !cloudState.courses) return null;

    memoryCourseState[cleanEmail] = cloudState;

    // Apply cloud state directly into localStorage
    Object.entries(cloudState.courses).forEach(([courseId, courseRec]) => {
      // 1. Last visited part
      const sampleKeys = getCourseStorageKeys(courseId, 1);
      if (courseRec.lastPart) {
        localStorage.setItem(sampleKeys.lastPartKey, String(courseRec.lastPart));
      }

      // 2. Completed parts
      if (Array.isArray(courseRec.completedParts)) {
        courseRec.completedParts.forEach((pNum) => {
          const partKeys = getCourseStorageKeys(courseId, pNum);
          localStorage.setItem(partKeys.completedKey, 'true');
        });
      }

      // 3. Exact active question & timer state per part
      if (courseRec.parts) {
        Object.entries(courseRec.parts).forEach(([pNumStr, partState]) => {
          const pNum = parseInt(pNumStr, 10);
          if (isNaN(pNum)) return;
          const partKeys = getCourseStorageKeys(courseId, pNum);

          if (partState.activeSectionId) {
            localStorage.setItem(partKeys.sectionIdKey, partState.activeSectionId);
            if (courseId === 'java-core' && pNum === 1) localStorage.setItem('dopilot_java_part1_active_section_id', partState.activeSectionId);
            if (courseId === 'python-core' && pNum === 1) localStorage.setItem('dopilot_part1_active_section_id', partState.activeSectionId);
          }
          if (typeof partState.activeQuestionIdx === 'number') {
            localStorage.setItem(partKeys.questionIdxKey, String(partState.activeQuestionIdx));
            if (courseId === 'java-core' && pNum === 1) localStorage.setItem('dopilot_java_part1_active_q_idx', String(partState.activeQuestionIdx));
            if (courseId === 'python-core' && pNum === 1) localStorage.setItem('dopilot_part1_active_q_idx', String(partState.activeQuestionIdx));
          }
          if (partState.selectedAnswers) {
            localStorage.setItem(partKeys.answersKey, JSON.stringify(partState.selectedAnswers));
            if (courseId === 'java-core' && pNum === 1) localStorage.setItem('dopilot_java_part1_mcq_answers', JSON.stringify(partState.selectedAnswers));
            if (courseId === 'python-core' && pNum === 1) localStorage.setItem('dopilot_part1_mcq_answers_v2', JSON.stringify(partState.selectedAnswers));
          }
          if (typeof partState.isStudyPhase === 'boolean') {
            localStorage.setItem(partKeys.studyPhaseKey, String(partState.isStudyPhase));
            if (courseId === 'java-core' && pNum === 1) localStorage.setItem('dopilot_java_part1_study_phase', String(partState.isStudyPhase));
            if (courseId === 'python-core' && pNum === 1) localStorage.setItem('dopilot_part1_study_phase', String(partState.isStudyPhase));
          }
          if (partState.targetEndTime) {
            localStorage.setItem(partKeys.targetEndTimeKey, String(partState.targetEndTime));
            if (courseId === 'java-core' && pNum === 1) localStorage.setItem('dopilot_java_part1_q_target_end_time', String(partState.targetEndTime));
            if (courseId === 'python-core' && pNum === 1) localStorage.setItem('dopilot_part1_q_target_end_time', String(partState.targetEndTime));
          }
          if (partState.isTimeUpWaiting) {
            localStorage.setItem(partKeys.timeUpKey, 'true');
            if (courseId === 'java-core' && pNum === 1) localStorage.setItem('dopilot_java_part1_time_up', 'true');
            if (courseId === 'python-core' && pNum === 1) localStorage.setItem('dopilot_part1_time_up', 'true');
          } else {
            localStorage.removeItem(partKeys.timeUpKey);
            if (courseId === 'java-core' && pNum === 1) localStorage.removeItem('dopilot_java_part1_time_up');
            if (courseId === 'python-core' && pNum === 1) localStorage.removeItem('dopilot_part1_time_up');
          }
          if (partState.isCompleted) {
            localStorage.setItem(partKeys.completedKey, 'true');
          }
          if (partState.levelResult && partState.levelResult.isFinished) {
            localStorage.setItem(partKeys.levelResultKey, JSON.stringify(partState.levelResult));
            if (courseId === 'java-core' && pNum === 1) localStorage.setItem('dopilot_java_level_result', JSON.stringify(partState.levelResult));
            if (courseId === 'python-core' && pNum === 1) localStorage.setItem('dopilot_level_result', JSON.stringify(partState.levelResult));
          } else {
            localStorage.removeItem(partKeys.levelResultKey);
            if (courseId === 'java-core' && pNum === 1) localStorage.removeItem('dopilot_java_level_result');
            if (courseId === 'python-core' && pNum === 1) localStorage.removeItem('dopilot_level_result');
          }
          if (partState.isFinishedPart) {
            localStorage.setItem(partKeys.finishedKey, 'true');
            if (courseId === 'java-core' && pNum === 1) localStorage.setItem('dopilot_java_part1_finished', 'true');
            if (courseId === 'python-core' && pNum === 1) localStorage.setItem('dopilot_part1_finished', 'true');
          }
        });
      }
    });

    // 4. Restore Part 1 score service records if saved
    if (cloudState.part1SectionScores) {
      Object.entries(cloudState.part1SectionScores).forEach(([k, v]) => {
        localStorage.setItem(k, JSON.stringify(v));
      });
    }
    if (cloudState.trialAttempted) {
      Object.entries(cloudState.trialAttempted).forEach(([k, v]) => {
        localStorage.setItem(k, String(v));
      });
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('dopilot_progress_restored'));
    }

    return cloudState;
  } catch (err) {
    console.error('Failed to restore student course progress from cloud:', err);
    return null;
  }
};

/**
 * Fetches saved cloud state for a specific course part
 */
export const getCloudPartQuestionState = async (
  courseId: string,
  partNum: number,
  studentEmail?: string
): Promise<PartQuestionState | null> => {
  const cleanEmail = normalizeStudentEmail(studentEmail);
  if (!cleanEmail) return null;

  // Check memory cache first
  const cached = memoryCourseState[cleanEmail]?.courses?.[courseId]?.parts?.[String(partNum)];
  if (cached) return cached;

  // Fetch full state from cloud
  const full = await restoreAllStudentCourseProgressFromCloud(cleanEmail);
  return full?.courses?.[courseId]?.parts?.[String(partNum)] || null;
};

/**
 * React hook to synchronize question state with cloud for any course page.
 * Hydrates state if localStorage was cleared, and synchronizes questions on resume.
 */
export function useCourseQuestionResume(params: {
  courseId: string;
  partNum: number;
  studentEmail?: string;
  activeSectionId: string;
  setActiveSectionId: (id: string) => void;
  activeQuestionIdx: number;
  setActiveQuestionIdx: (idx: number) => void;
  setSelectedAnswers: (updater: (prev: Record<string, string>) => Record<string, string>) => void;
  setIsStudyPhase: (phase: boolean) => void;
  setIsTimeUpWaiting: (waiting: boolean) => void;
  setTimeLeft: (time: number) => void;
  setTargetEndTime: (time: number) => void;
  validSectionIds: string[];
  levelResult?: any;
  setLevelResult?: (res: any) => void;
  setIsCourseComplete?: (complete: boolean) => void;
}) {
  const {
    courseId,
    partNum,
    studentEmail,
    setActiveSectionId,
    setActiveQuestionIdx,
    setSelectedAnswers,
    setIsStudyPhase,
    setIsTimeUpWaiting,
    setTimeLeft,
    setTargetEndTime,
    validSectionIds,
    setLevelResult,
    setIsCourseComplete
  } = params;

  const hasHydratedRef = useRef(false);

  useEffect(() => {
    const cleanEmail = normalizeStudentEmail(studentEmail);
    if (!cleanEmail) return;

    const applyState = (saved: PartQuestionState) => {
      if (saved.activeSectionId && validSectionIds.includes(saved.activeSectionId)) {
        setActiveSectionId(saved.activeSectionId);
      }
      if (typeof saved.activeQuestionIdx === 'number') {
        setActiveQuestionIdx(saved.activeQuestionIdx);
      }
      if (saved.selectedAnswers) {
        setSelectedAnswers(() => saved.selectedAnswers);
      }

      if (saved.isFinishedPart || saved.isCompleted) {
        setIsCourseComplete?.(true);
      }

      // 1. Result page state: If section exam was completed, restore result page immediately
      if (saved.levelResult && saved.levelResult.isFinished) {
        setLevelResult?.(saved.levelResult);
        setIsStudyPhase(false);
        setIsTimeUpWaiting(false);
        setTimeLeft(30);
        return;
      } else {
        setLevelResult?.(null);
      }

      // 2. Study Phase: If user is reading notes and has not unlocked the question
      if (saved.isStudyPhase) {
        setIsStudyPhase(true);
        setIsTimeUpWaiting(false);
        setTimeLeft(30);
        setTargetEndTime(0);
      } else {
        // 3. Question Phase (question was unlocked)
        setIsStudyPhase(false);

        // Check if current question has already been answered
        const qIdxStr = String(saved.activeQuestionIdx);
        const hasAnswer = Object.keys(saved.selectedAnswers || {}).some(k => 
          k.includes(saved.activeSectionId) && (
            k.includes(`-${qIdxStr}-`) || 
            k.endsWith(`-${qIdxStr}`)
          )
        );

        if (hasAnswer) {
          // Question already answered: user is reviewing or on explanation screen. Do not show Time's Up!
          setIsTimeUpWaiting(false);
        } else if (saved.isTimeUpWaiting) {
          setIsTimeUpWaiting(true);
          setTimeLeft(0);
        } else if (saved.targetEndTime) {
          const diff = Math.ceil((saved.targetEndTime - Date.now()) / 1000);
          if (diff <= 0) {
            // Unlocked question whose 30s timer genuinely expired
            setIsTimeUpWaiting(true);
            setTimeLeft(0);
          } else {
            setIsTimeUpWaiting(false);
            setTimeLeft(Math.min(30, diff));
            setTargetEndTime(saved.targetEndTime);
          }
        } else {
          setIsTimeUpWaiting(false);
          setTimeLeft(30);
        }
      }
    };

    getCloudPartQuestionState(courseId, partNum, cleanEmail).then((saved) => {
      if (saved && !hasHydratedRef.current) {
        hasHydratedRef.current = true;
        applyState(saved);
      }
    });

    const handleRestored = () => {
      getCloudPartQuestionState(courseId, partNum, cleanEmail).then((saved) => {
        if (saved) {
          applyState(saved);
        }
      });
    };

    window.addEventListener('dopilot_progress_restored', handleRestored);
    return () => {
      window.removeEventListener('dopilot_progress_restored', handleRestored);
    };
  }, [
    courseId,
    partNum,
    studentEmail,
    setActiveSectionId,
    setActiveQuestionIdx,
    setSelectedAnswers,
    setIsStudyPhase,
    setIsTimeUpWaiting,
    setTimeLeft,
    setTargetEndTime,
    validSectionIds,
    setLevelResult,
    setIsCourseComplete
  ]);
}
