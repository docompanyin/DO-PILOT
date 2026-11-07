import { useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { restoreStudentTelemetryFromCloud } from './studentTelemetryService';
import { CoursePageType, saveCheckpointActive } from './courseCheckpointService';

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
  /** Section this result belongs to, so a restored result page is not cleared. */
  sectionId?: string;
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
  pageType?: CoursePageType;
  disclaimerModalOpen?: boolean;
  consecutiveFailureModalOpen?: boolean;
  partIntroModalOpen?: boolean;
  certificateModalOpen?: boolean;
  isCertificateConfirmed?: boolean;
  decisionModalOpen?: boolean;
  helpModalOpen?: boolean;
  updatedAt: string;
}

export interface CourseProgressRecord {
  lastPart: number;
  completedParts: number[];
  parts: Record<string, PartQuestionState>;
  lockedKeys?: Record<string, boolean>;
  consecutiveFailures?: Record<string, number>;
}

export interface StudentAllCoursesState {
  email: string;
  courses: Record<string, CourseProgressRecord>;
  globalLockedKeys?: Record<string, boolean>;
  consecutiveFailures?: Record<string, number>;
  part1SectionScores?: Record<string, any>;
  trialAttempted?: Record<string, boolean>;
  postPurchaseDecisions?: Record<string, string>;
  part1RestartUsed?: Record<string, boolean>;
  exemptSections?: Record<string, string>;
  certificates?: Record<string, any>;
  rawStorage?: Record<string, string>;
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

// Guard the very first upload so a freshly loaded page cannot overwrite cloud
// failure/lock data before the initial restore has merged it into memory.
const initialRestorePromises: Record<string, Promise<StudentAllCoursesState | null>> = {};
const initialRestoreCompleted: Record<string, boolean> = {};
// Tracks which (email, courseId, partNum) has completed hydration from cloud/memory
export const partHydratedMap: Record<string, boolean> = {};

export const markPartHydrated = (email?: string, courseId?: string, partNum?: number) => {
  const clean = normalizeStudentEmail(email);
  if (clean && courseId && typeof partNum === 'number') {
    partHydratedMap[`${clean}_${courseId}_${partNum}`] = true;
  }
};

export const isPartHydrated = (email?: string, courseId?: string, partNum?: number): boolean => {
  const clean = normalizeStudentEmail(email);
  if (!clean || !courseId || typeof partNum !== 'number') return true;
  return Boolean(partHydratedMap[`${clean}_${courseId}_${partNum}`]);
};

// Number of restores currently running for an email. A page mounts before its
// cloud snapshot arrives, so any checkpoint it tries to write during that
// window must be ignored. Otherwise the default/empty page state would erase
// the restored question, result page, failure count or lock.
const restoreInFlightCount: Record<string, number> = {};

async function ensureInitialRestore(email: string): Promise<StudentAllCoursesState | null> {
  if (initialRestoreCompleted[email]) return null;
  if (!initialRestorePromises[email]) {
    initialRestorePromises[email] = restoreAllStudentCourseProgressFromCloud(email)
      .then((res) => {
        initialRestoreCompleted[email] = true;
        return res;
      })
      .catch(() => {
        initialRestoreCompleted[email] = true;
        return null;
      })
      .finally(() => {
        delete initialRestorePromises[email];
      });
  }
  return initialRestorePromises[email];
}

/**
 * Copies every consecutive-failure counter and lock flag currently present in
 * localStorage into the in-memory cloud snapshot. This keeps the counters in
 * every upload even when a page has just loaded and memory was re-created.
 */
const hydrateFailureAndLockState = (st: StudentAllCoursesState): void => {
  try {
    if (typeof localStorage === 'undefined') return;
    if (!st.consecutiveFailures) st.consecutiveFailures = {};
    if (!st.globalLockedKeys) st.globalLockedKeys = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      if (key.includes('consecutive_failures') || key.includes('failed_levels_streak')) {
        const raw = localStorage.getItem(key);
        if (raw !== null) st.consecutiveFailures[key] = Number(raw) || 0;
      }

      if (key.startsWith('dopilot_locked_') || key.includes('_locked_')) {
        // The locked-courses registry is a JSON list, not a student lock flag.
        if (key.includes('locked_courses_registry')) continue;
        st.globalLockedKeys[key] = localStorage.getItem(key) === 'true';
      }
    }
  } catch {
    /* storage unavailable */
  }
};

/**
 * Authoritative deep merger to ensure incoming partial snapshots NEVER
 * overwrite valid questions, answers, or part progressions in cloud.
 */
export function mergeStudentProgressDocs(
  existing: StudentAllCoursesState | null | undefined,
  incoming: StudentAllCoursesState
): StudentAllCoursesState {
  if (!existing || !existing.courses) return incoming;

  const merged: StudentAllCoursesState = {
    ...existing,
    ...incoming,
    courses: { ...(existing.courses || {}) },
    rawStorage: { ...(existing.rawStorage || {}), ...(incoming.rawStorage || {}) },
    globalLockedKeys: { ...(existing.globalLockedKeys || {}), ...(incoming.globalLockedKeys || {}) },
    consecutiveFailures: { ...(existing.consecutiveFailures || {}), ...(incoming.consecutiveFailures || {}) },
    part1SectionScores: { ...(existing.part1SectionScores || {}), ...(incoming.part1SectionScores || {}) },
    trialAttempted: { ...(existing.trialAttempted || {}), ...(incoming.trialAttempted || {}) },
    postPurchaseDecisions: { ...(existing.postPurchaseDecisions || {}), ...(incoming.postPurchaseDecisions || {}) },
    part1RestartUsed: { ...(existing.part1RestartUsed || {}), ...(incoming.part1RestartUsed || {}) },
    exemptSections: { ...(existing.exemptSections || {}), ...(incoming.exemptSections || {}) },
    certificates: { ...(existing.certificates || {}), ...(incoming.certificates || {}) },
    updatedAt: incoming.updatedAt || new Date().toISOString()
  };

  if (incoming.courses) {
    Object.entries(incoming.courses).forEach(([courseId, inCourse]) => {
      const exCourse = merged.courses[courseId];
      if (!exCourse) {
        merged.courses[courseId] = inCourse;
        return;
      }

      const mergedLastPart = Math.max(exCourse.lastPart || 1, inCourse.lastPart || 1);
      const mergedCompletedParts = Array.from(new Set([
        ...(exCourse.completedParts || []),
        ...(inCourse.completedParts || [])
      ]));

      const mergedParts: Record<string, PartQuestionState> = { ...(exCourse.parts || {}) };
      if (inCourse.parts && Object.keys(inCourse.parts).length > 0) {
        Object.entries(inCourse.parts).forEach(([pStr, inPart]) => {
          if (!inPart) return;
          const exPart = mergedParts[pStr];
          if (!exPart) {
            mergedParts[pStr] = inPart;
            return;
          }

          const mergedAnswers = {
            ...(exPart.selectedAnswers || {}),
            ...(inPart.selectedAnswers || {})
          };

          const inAnswersCount = Object.keys(inPart.selectedAnswers || {}).length;
          const exAnswersCount = Object.keys(exPart.selectedAnswers || {}).length;

          const exHasAnswersOrExam = exAnswersCount > 0 || exPart.isCompleted || exPart.isFinishedPart;

          const inIsDefaultMount = (inPart.activeQuestionIdx === 0 || inPart.activeQuestionIdx === undefined) &&
            (!inPart.activeSectionId || inPart.activeSectionId.endsWith('-1') || inPart.activeSectionId.endsWith('.1') || inPart.activeSectionId.includes('1-1') || inPart.activeSectionId.includes('0-1')) &&
            inAnswersCount === 0 &&
            inPart.isStudyPhase !== false;

          // Never overwrite real saved questions/answers with an unhydrated mount default
          if (inIsDefaultMount && exHasAnswersOrExam) {
            mergedParts[pStr] = {
              ...exPart,
              selectedAnswers: mergedAnswers
            };
            return;
          }

          mergedParts[pStr] = {
            ...exPart,
            ...inPart,
            selectedAnswers: mergedAnswers,
            isCompleted: exPart.isCompleted || inPart.isCompleted,
            isFinishedPart: exPart.isFinishedPart || inPart.isFinishedPart
          };
        });
      }

      merged.courses[courseId] = {
        ...exCourse,
        ...inCourse,
        lastPart: mergedLastPart,
        completedParts: mergedCompletedParts,
        parts: mergedParts
      };
    });
  }

  return merged;
}

export const flushCloudSync = async (email: string) => {
  if (typeof window !== 'undefined' && (window as any).__dopilot_session_invalidated === true) {
    return null;
  }
  if (syncTimeout) {
    clearTimeout(syncTimeout);
    syncTimeout = null;
  }
  const cleanEmail = normalizeStudentEmail(email);
  if (!cleanEmail || !isSupabaseConfigured()) return;

  // Never upload before the first cloud restore has completed. Otherwise a
  // fresh device (empty localStorage) could erase the saved failure streak.
  if (!initialRestoreCompleted[cleanEmail]) {
    await ensureInitialRestore(cleanEmail);
  }

  const state = memoryCourseState[cleanEmail];
  if (!state) return;

  // Final safety net: every upload carries the current failure counters and
  // lock flags, even if this flush was triggered by an unrelated storage key.
  hydrateFailureAndLockState(state);

  try {
    // 1. Primary: Save directly to Supabase with authoritative merge to guarantee zero loss
    const docId = getStudentDocId(cleanEmail);
    let finalPayload = state;
    try {
      const { data: exDoc } = await supabase
        .from('site_content')
        .select('content')
        .eq('id', docId)
        .maybeSingle();
      if (exDoc?.content) {
        finalPayload = mergeStudentProgressDocs(exDoc.content as StudentAllCoursesState, state);
      }
    } catch {}

    // Broadcast to server endpoint with keepalive: true immediately so mobile unmount/navigation cannot kill it
    const syncEndpoint = typeof window !== 'undefined' ? `${window.location.origin}/api/student-sync` : '/api/student-sync';
    const keepaliveSyncPromise = fetch(syncEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: cleanEmail,
        type: 'progress',
        content: finalPayload
      }),
      keepalive: true
    }).catch(() => {});

    await supabase.from('site_content').upsert({
      id: docId,
      content: finalPayload,
      updated_at: new Date().toISOString()
    });

    await keepaliveSyncPromise;
  } catch (e) {
    console.warn('Background course progress cloud sync error:', e);
  }
};

export const queueCloudSync = (email: string, immediate = false) => {
  if (immediate) {
    flushCloudSync(email);
    return;
  }
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }
  syncTimeout = setTimeout(() => {
    flushCloudSync(email);
  }, 100);
};

export const clearMemoryCourseState = (email?: string) => {
  if (syncTimeout) {
    clearTimeout(syncTimeout);
    syncTimeout = null;
  }
  if (!email) {
    Object.keys(memoryCourseState).forEach((k) => delete memoryCourseState[k]);
    Object.keys(initialRestoreCompleted).forEach((k) => delete initialRestoreCompleted[k]);
    return;
  }
  const cleanEmail = normalizeStudentEmail(email);
  if (cleanEmail) {
    delete memoryCourseState[cleanEmail];
    delete initialRestoreCompleted[cleanEmail];
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
    const mPart = sub.match(/^part(\d+)_(.+)$/);
    if (mPart) {
      return { courseId: 'fullstack-open', partNum: parseInt(mPart[1], 10), field: mPart[2] };
    }
    const mP = sub.match(/^p(\d+)_(.+)$/);
    if (mP) {
      return { courseId: 'fullstack-open', partNum: parseInt(mP[1], 10), field: mP[2] };
    }
  } else if (key.startsWith('dopilot_cyber_')) {
    const sub = key.replace('dopilot_cyber_', '');
    if (sub === 'core_last_part') return { courseId: 'cyber-security', partNum: 1, field: 'lastPart' };
    if (sub === 'part1_completed') return { courseId: 'cyber-security', partNum: 1, field: 'completed' };
    if (sub === 'part1_finished') return { courseId: 'cyber-security', partNum: 1, field: 'finished' };
    if (sub === 'part1_level_result' || sub === 'level_result') return { courseId: 'cyber-security', partNum: 1, field: 'level_result' };
    if (['active_section_id', 'active_q_idx', 'study_phase', 'time_up', 'q_target_end_time', 'mcq_answers'].includes(sub)) {
      return { courseId: 'cyber-security', partNum: 1, field: sub };
    }
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
let isRestoringFromCloud = false;
let restoringFromCloudCount = 0;
let isPurgingData = false;
export const setPurgeInProgress = (val: boolean) => {
  isPurgingData = val;
};
export const initCourseProgressSyncInterceptor = () => {
  if (typeof window === 'undefined' || !window.localStorage || isInterceptorInitialized) return;
  isInterceptorInitialized = true;

  const originalSetItem = window.localStorage.setItem.bind(window.localStorage);
  const originalRemoveItem = window.localStorage.removeItem.bind(window.localStorage);

  window.localStorage.setItem = (key: string, value: string) => {
    originalSetItem(key, value);

    if (isRestoringFromCloud || isPurgingData) return;

    try {
      const sessionRaw = window.localStorage.getItem('dopilot_student_session_v1');
      if (!sessionRaw) return;
      const session = JSON.parse(sessionRaw);
      const email = normalizeStudentEmail(session?.email);
      if (!email) return;

      if ((restoreInFlightCount[email] || 0) > 0) return;

      if (!memoryCourseState[email]) {
        memoryCourseState[email] = {
          email,
          courses: {},
          updatedAt: new Date().toISOString()
        };
      }

      const st = memoryCourseState[email];

      if (!st.rawStorage) st.rawStorage = {};
      if (key.startsWith('dopilot_') && !key.includes('session') && !key.includes('pending_')) {
        st.rawStorage[key] = value;
      }

      // Part-introduction markers live only in rawStorage, so they need an
      // explicit sync trigger to reach the cloud for cross-device resume.
      if (key.includes('python_intro_required')) {
        st.updatedAt = new Date().toISOString();
        queueCloudSync(email);
        return;
      }

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

      if (key.includes('_post_purchase_decision')) {
        if (!st.postPurchaseDecisions) st.postPurchaseDecisions = {};
        const matchedCourse = ['python', 'java', 'fullstack', 'cyber'].find(c => key.includes(c)) || 'python';
        st.postPurchaseDecisions[matchedCourse] = value;
        st.updatedAt = new Date().toISOString();
        queueCloudSync(email);
        return;
      }

      if (key.includes('_exempt_in_progress_section')) {
        if (!st.exemptSections) st.exemptSections = {};
        const matchedCourse = ['python', 'java', 'fullstack', 'cyber'].find(c => key.includes(c)) || 'python';
        if (value) {
          st.exemptSections[matchedCourse] = value;
          st.exemptSections[`${matchedCourse}-core`] = value;
        } else {
          delete st.exemptSections[matchedCourse];
          delete st.exemptSections[`${matchedCourse}-core`];
        }
        st.updatedAt = new Date().toISOString();
        queueCloudSync(email);
        return;
      }

      if (key.includes('_part1_restart_used')) {
        if (!st.part1RestartUsed) st.part1RestartUsed = {};
        const matchedCourse = ['python', 'java', 'fullstack', 'cyber'].find(c => key.includes(c)) || 'python';
        st.part1RestartUsed[matchedCourse] = value === 'true';
        st.updatedAt = new Date().toISOString();
        queueCloudSync(email);
        return;
      }

      // Intercept and persist lock keys to cloud
      if (key.startsWith('dopilot_locked_') || key.includes('_locked_')) {
        if (!st.globalLockedKeys) st.globalLockedKeys = {};
        st.globalLockedKeys[key] = value === 'true';
        st.updatedAt = new Date().toISOString();
        queueCloudSync(email);
      }

      // Intercept and persist consecutive failure / streak counters to cloud
      if (key.includes('consecutive_failures') || key.includes('failed_levels_streak')) {
        if (!st.consecutiveFailures) st.consecutiveFailures = {};
        st.consecutiveFailures[key] = Number(value) || 0;
        st.updatedAt = new Date().toISOString();
        queueCloudSync(email);
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
        // Setting lastPart alone (e.g. entering course overview) should not overwrite course parts in cloud
        return;
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

    if (isRestoringFromCloud || isPurgingData) return;

    try {
      const sessionRaw = window.localStorage.getItem('dopilot_student_session_v1');
      if (!sessionRaw) return;
      const session = JSON.parse(sessionRaw);
      const email = normalizeStudentEmail(session?.email);
      if (!email || !memoryCourseState[email]) return;

      if ((restoreInFlightCount[email] || 0) > 0) return;

      const st = memoryCourseState[email];

      if (st.rawStorage && key.startsWith('dopilot_')) {
        delete st.rawStorage[key];
        st.updatedAt = new Date().toISOString();
        queueCloudSync(email);
      }

      if (key.startsWith('dopilot_locked_') || key.includes('_locked_')) {
        if (st.globalLockedKeys) {
          delete st.globalLockedKeys[key];
          st.updatedAt = new Date().toISOString();
          queueCloudSync(email);
        }
      }

      if (key.includes('consecutive_failures') || key.includes('failed_levels_streak')) {
        if (st.consecutiveFailures) {
          delete st.consecutiveFailures[key];
          st.updatedAt = new Date().toISOString();
          queueCloudSync(email);
        }
      }

      if (key.includes('level_result')) {
        if (st.rawStorage) delete st.rawStorage[key];
        Object.values(st.courses || {}).forEach(c => {
          Object.values(c.parts || {}).forEach(p => {
            p.levelResult = null;
          });
        });
        st.updatedAt = new Date().toISOString();
        queueCloudSync(email);
      }

      const parsed = parseCourseStorageKey(key);
      if (!parsed) return;

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
  pageType?: CoursePageType;
  disclaimerModalOpen?: boolean;
  consecutiveFailureModalOpen?: boolean;
  partIntroModalOpen?: boolean;
  certificateModalOpen?: boolean;
  isCertificateConfirmed?: boolean;
  decisionModalOpen?: boolean;
  helpModalOpen?: boolean;
  forceImmediate?: boolean;
  isExplicitReset?: boolean;
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
    levelResult = null,
    pageType,
    disclaimerModalOpen = false,
    consecutiveFailureModalOpen = false,
    partIntroModalOpen = false,
    certificateModalOpen = false,
    isCertificateConfirmed = false,
    decisionModalOpen = false,
    helpModalOpen = false,
    forceImmediate = true,
    isExplicitReset = false
  } = params;

  let effectivePageType = pageType;
  if (!effectivePageType) {
    if (helpModalOpen) {
      effectivePageType = 'help_modal';
    } else if (certificateModalOpen) {
      effectivePageType = isCertificateConfirmed ? 'certificate_display' : 'certificate_claim';
    } else if (decisionModalOpen) {
      effectivePageType = 'purchase_decision';
    } else if (disclaimerModalOpen) {
      effectivePageType = 'disclaimer_guidelines';
    } else if (consecutiveFailureModalOpen) {
      effectivePageType = 'failure_warning';
    } else if (partIntroModalOpen) {
      effectivePageType = 'part_intro';
    } else if (isCompleted || isFinishedPart) {
      effectivePageType = 'part_completion';
    } else if (levelResult?.isFinished) {
      const isRetest = (levelResult.attemptCount || 1) >= 2;
      effectivePageType = isRetest ? 'retest_result' : (levelResult.isPassed ? 'passed_result' : 'failed_result');
    } else if (isTimeUpWaiting || levelResult?.isLocked) {
      effectivePageType = 'locked_question';
    } else if (isStudyPhase) {
      effectivePageType = (activeQuestionIdx === 0) ? 'section_intro' : 'study_notes';
    } else {
      const qIdxStr = String(activeQuestionIdx);
      const answersMap = selectedAnswers || {};
      const hasAnswer = Boolean(
        answersMap[`${activeSectionId}-${qIdxStr}`] ||
        answersMap[`${activeSectionId}-${activeQuestionIdx}`] ||
        Object.keys(answersMap).some(k => k.includes(activeSectionId) && k.endsWith(`-${qIdxStr}`))
      );
      effectivePageType = hasAnswer ? 'answered_question' : 'incomplete_question';
    }
  }

  const fixedLevelResult: LevelResultRecord | null = levelResult ? {
    ...levelResult,
    isFinished: true,
    isPassed: effectivePageType === 'failed_result' ? false : (levelResult.isPassed ?? true),
    sectionId: levelResult.sectionId || activeSectionId
  } : null;

  const cleanEmail = normalizeStudentEmail(studentEmail);

  if (typeof window !== 'undefined' && (window as any).__dopilot_session_invalidated === true) {
    return null;
  }

  const hydKey = cleanEmail ? `${cleanEmail}_${courseId}_${partNum}` : '';
  const isHydrated = !cleanEmail || Boolean(partHydratedMap[hydKey]);

  // A page's mount-time checkpoint runs before the cloud snapshot has been applied.
  // Only drop if not hydrated and not an immediate explicit save.
  if (cleanEmail && (restoreInFlightCount[cleanEmail] || 0) > 0 && !isHydrated && !forceImmediate) {
    return;
  }

  // OVERWRITE PROTECTION:
  // If the component is passing default 0 and empty selectedAnswers on Section 1.1,
  // BUT existing in-memory / cloud state already has answered questions or exam completion:
  // DO NOT overwrite real progress with unhydrated mount default!
  const pKey = String(partNum);
  const memCourse = cleanEmail ? memoryCourseState[cleanEmail]?.courses?.[courseId] : null;
  const existingPart = memCourse?.parts?.[pKey];
  const exAnswersCount = Object.keys(existingPart?.selectedAnswers || {}).length;
  const inAnswersCount = Object.keys(selectedAnswers || {}).length;
  const exHasAnswersOrExam = exAnswersCount > 0 || Boolean(existingPart?.isCompleted) || Boolean(existingPart?.isFinishedPart);

  const isDefaultMount = (activeQuestionIdx === 0) &&
    (!activeSectionId || activeSectionId.endsWith('-1') || activeSectionId.endsWith('.1') || activeSectionId.includes('1-1') || activeSectionId.includes('0-1')) &&
    inAnswersCount === 0 &&
    isStudyPhase !== false;

  if (!isExplicitReset && isDefaultMount && exHasAnswersOrExam) {
    console.warn(`[SyncGuard] Blocked premature overwrite of ${courseId} Part ${partNum} saved progress (${existingPart?.activeSectionId} Q${(existingPart?.activeQuestionIdx ?? 0) + 1}) with initial default`);
    return;
  }
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
    if (fixedLevelResult) {
      localStorage.setItem(keys.levelResultKey, JSON.stringify(fixedLevelResult));
    } else if (effectivePageType !== 'passed_result' && effectivePageType !== 'failed_result') {
      localStorage.removeItem(keys.levelResultKey);
    }

    const isPython = courseId.includes('python');
    const isJava = courseId.includes('java');
    const isFullstack = courseId.includes('fullstack');
    let prefix = 'dopilot_';
    if (isJava) prefix = 'dopilot_java_';
    else if (isFullstack) prefix = 'dopilot_fullstack_';
    else if (courseId.includes('cyber')) prefix = 'dopilot_cyber_';
    const partPrefix = (isPython && partNum === 1) || (isJava && partNum === 1) || (courseId.includes('cyber') && partNum === 1) ? prefix : `${prefix}part${partNum}_`;
    localStorage.setItem(`${partPrefix}page_type`, effectivePageType);
    if (disclaimerModalOpen) {
      localStorage.setItem(`${partPrefix}disclaimer_open`, 'true');
      localStorage.setItem(`${partPrefix}disclaimer_modal_open`, 'true');
    }
    if (consecutiveFailureModalOpen) {
      localStorage.setItem(`${partPrefix}consecutive_failure_modal_open`, 'true');
    }
  } catch (e) {
    console.error('Failed writing course progress to localStorage:', e);
  }

  // 2. Queue persistent sync to database if student has valid email
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

  // Ensure the upload always carries the current failure counters and locks,
  // even when the in-memory snapshot was re-created on this page load.
  hydrateFailureAndLockState(studentState);

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
    levelResult: fixedLevelResult,
    pageType: effectivePageType,
    disclaimerModalOpen,
    consecutiveFailureModalOpen,
    partIntroModalOpen,
    certificateModalOpen,
    isCertificateConfirmed,
    decisionModalOpen,
    helpModalOpen,
    updatedAt: new Date().toISOString()
  };

  // Keep post-purchase decisions & restart flags synchronized in student state
  try {
    const courses = ['python', 'java', 'fullstack', 'cyber'];
    if (!studentState.postPurchaseDecisions) studentState.postPurchaseDecisions = {};
    if (!studentState.part1RestartUsed) studentState.part1RestartUsed = {};
    courses.forEach(c => {
      const dec = localStorage.getItem(`dopilot_${c}_post_purchase_decision`) || 
                  localStorage.getItem(`dopilot_${c}_core_post_purchase_decision`);
      if (dec) studentState.postPurchaseDecisions![c] = dec;

      const rst = localStorage.getItem(`dopilot_${c}_part1_restart_used`) ||
                  localStorage.getItem(`dopilot_${c}_core_part1_restart_used`);
      if (rst === 'true') studentState.part1RestartUsed![c] = true;

      const ex = localStorage.getItem(`dopilot_${c}_exempt_in_progress_section`) ||
                 localStorage.getItem(`dopilot_${c}_core_exempt_in_progress_section`);
      if (ex) {
        if (!studentState.exemptSections) studentState.exemptSections = {};
        studentState.exemptSections[c] = ex;
        studentState.exemptSections[`${c}-core`] = ex;
      }
    });
  } catch {}

  studentState.updatedAt = new Date().toISOString();
  queueCloudSync(cleanEmail, forceImmediate);

  // Centralized Cloud Checkpoint: Active awaited save with atomic revision & idempotency
  saveCheckpointActive(cleanEmail, {
    courseId,
    partNum,
    activeSectionId,
    activeQuestionIdx,
    isStudyPhase,
    isTimeUpWaiting,
    targetEndTime,
    timeLeft,
    selectedAnswers: { ...selectedAnswers },
    levelResult: fixedLevelResult,
    pageType: effectivePageType,
    disclaimerModalOpen,
    consecutiveFailureModalOpen,
    partIntroModalOpen,
    certificateModalOpen,
    isCertificateConfirmed,
    decisionModalOpen,
    helpModalOpen,
    attemptCounts: {},
    consecutiveFailures: studentState.consecutiveFailures || {},
    disclaimerConfirmed: true,
    exemptSections: studentState.exemptSections || {},
    isCompleted: Boolean(isCompleted),
    isFinishedPart: Boolean(isFinishedPart),
    certificates: studentState.certificates || {},
    postPurchaseDecisions: studentState.postPurchaseDecisions || {},
    lastPart: courseRec.lastPart || partNum
  });
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
    localStorage.setItem(keys.finishedKey, 'true');
    localStorage.setItem(keys.lastPartKey, String(nextPart));
  } catch {}

  const cleanEmail = normalizeStudentEmail(studentEmail);

  if (typeof window !== 'undefined' && (window as any).__dopilot_session_invalidated === true) {
    return null;
  }
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
    courseRec.lastPart = Math.max(courseRec.lastPart || 1, nextPart);
    if (!courseRec.completedParts.includes(partNum)) {
      courseRec.completedParts.push(partNum);
    }
  }

  const pKey = String(partNum);
  if (!studentState.courses[courseId].parts) {
    studentState.courses[courseId].parts = {};
  }
  if (!studentState.courses[courseId].parts[pKey]) {
    studentState.courses[courseId].parts[pKey] = {
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
  studentState.courses[courseId].parts[pKey].isCompleted = true;
  studentState.courses[courseId].parts[pKey].isFinishedPart = true;

  if (!studentState.rawStorage) studentState.rawStorage = {};
  studentState.rawStorage[keys.completedKey] = 'true';
  studentState.rawStorage[keys.finishedKey] = 'true';
  studentState.rawStorage[keys.lastPartKey] = String(nextPart);

  hydrateFailureAndLockState(studentState);

  studentState.updatedAt = new Date().toISOString();
  queueCloudSync(cleanEmail, true);

  // Centralized Cloud Checkpoint: Active awaited save with atomic revision
  saveCheckpointActive(cleanEmail, {
    courseId,
    partNum,
    activeSectionId: studentState.courses[courseId]?.parts?.[pKey]?.activeSectionId || '',
    activeQuestionIdx: studentState.courses[courseId]?.parts?.[pKey]?.activeQuestionIdx || 0,
    isStudyPhase: studentState.courses[courseId]?.parts?.[pKey]?.isStudyPhase ?? true,
    isTimeUpWaiting: false,
    targetEndTime: 0,
    timeLeft: 30,
    selectedAnswers: studentState.courses[courseId]?.parts?.[pKey]?.selectedAnswers || {},
    levelResult: studentState.courses[courseId]?.parts?.[pKey]?.levelResult || null,
    attemptCounts: {},
    consecutiveFailures: studentState.consecutiveFailures || {},
    disclaimerConfirmed: true,
    exemptSections: studentState.exemptSections || {},
    isCompleted: true,
    isFinishedPart: true,
    certificates: studentState.certificates || {},
    postPurchaseDecisions: studentState.postPurchaseDecisions || {},
    lastPart: nextPart
  });
};

/**
 * Restores ALL student course progress from Supabase Cloud into localStorage and memory.
 */
export const restoreAllStudentCourseProgressFromCloud = async (
  studentEmail?: string
): Promise<StudentAllCoursesState | null> => {
  const cleanEmail = normalizeStudentEmail(studentEmail);

  if (typeof window !== 'undefined' && (window as any).__dopilot_session_invalidated === true) {
    return null;
  }
  if (!cleanEmail || !isSupabaseConfigured()) return null;

  restoreInFlightCount[cleanEmail] = (restoreInFlightCount[cleanEmail] || 0) + 1;

  try {
    const docId = getStudentDocId(cleanEmail);

    // Issue 1: Check and flush any pending logout save snapshot if present
    const pendingKey = `dopilot_pending_logout_save_${cleanEmail}`;
    try {
      const pendingRaw = localStorage.getItem(pendingKey);
      if (pendingRaw) {
        const pendingState = JSON.parse(pendingRaw);
        if (pendingState && pendingState.courses) {
          let reUploaded = false;
          try {
            const resp = await fetch('/api/student-sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: cleanEmail, type: 'progress', content: pendingState })
            });
            if (resp.ok) reUploaded = true;
          } catch {}
          if (!reUploaded) {
            const { error: upsertErr } = await supabase.from('site_content').upsert({
              id: docId,
              content: pendingState,
              updated_at: new Date().toISOString()
            });
            if (!upsertErr) reUploaded = true;
          }
          if (reUploaded) {
            localStorage.removeItem(pendingKey);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to re-upload pending logout state:', e);
    }

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

    restoringFromCloudCount += 1;
    isRestoringFromCloud = true;

    // 0. Instant rawStorage hydration for all course keys, attempts, streaks & modals
    if (cloudState.rawStorage && typeof cloudState.rawStorage === 'object') {
      Object.entries(cloudState.rawStorage).forEach(([k, v]) => {
        if (typeof v === 'string' && k.startsWith('dopilot_') && !k.includes('session') && !k.includes('pending_')) {
          // Never blindly hydrate level_result from rawStorage; level results are verified per-section in step 3
          if (k.includes('level_result')) return;
          localStorage.setItem(k, v);
        }
      });
    }

    // Merge cloud state into memory cache instead of blindly replacing it
    if (!memoryCourseState[cleanEmail]) {
      memoryCourseState[cleanEmail] = cloudState;
    } else {
      const curMem = memoryCourseState[cleanEmail];

      // Failure counters and lock flags: respect authoritative unlock from cloud!
      if (!cloudState.globalLockedKeys || Object.keys(cloudState.globalLockedKeys).length === 0 || Object.values(cloudState.globalLockedKeys).every(v => !v)) {
        curMem.globalLockedKeys = {};
      } else {
        curMem.globalLockedKeys = {
          ...(curMem.globalLockedKeys || {}),
          ...cloudState.globalLockedKeys
        };
      }

      if (!cloudState.consecutiveFailures || Object.keys(cloudState.consecutiveFailures).length === 0 || Object.values(cloudState.consecutiveFailures).every(v => Number(v) === 0)) {
        curMem.consecutiveFailures = {};
      } else {
        curMem.consecutiveFailures = {
          ...(curMem.consecutiveFailures || {}),
          ...cloudState.consecutiveFailures
        };
      }

      curMem.rawStorage = {
        ...(curMem.rawStorage || {}),
        ...(cloudState.rawStorage || {})
      };

      Object.entries(cloudState.courses).forEach(([cId, cRec]) => {
        if (!curMem.courses[cId]) {
          curMem.courses[cId] = cRec;
        } else {
          const memCourse = curMem.courses[cId];
          memCourse.lastPart = Math.max(memCourse.lastPart || 1, cRec.lastPart || 1);
          memCourse.completedParts = Array.from(new Set([...(memCourse.completedParts || []), ...(cRec.completedParts || [])]));
          if (cRec.parts) {
            Object.entries(cRec.parts).forEach(([pStr, cPart]) => {
              if (!memCourse.parts[pStr]) {
                memCourse.parts[pStr] = cPart;
              } else {
                const memPart = memCourse.parts[pStr];
                // Check if in-memory part is newer than cloud snapshot
                const memTime = memPart.updatedAt ? new Date(memPart.updatedAt).getTime() : 0;
                const cloudTime = cPart.updatedAt ? new Date(cPart.updatedAt).getTime() : 0;
                const memIsInit = !memPart.activeSectionId || memPart.activeSectionId === '1-1-getting-started' || memPart.activeSectionId === '0-1-http-protocol' || memPart.activeSectionId === '1-1-overview' || memPart.activeSectionId.endsWith('-1') || memPart.activeSectionId.endsWith('.1');
                const cloudIsInit = !cPart.activeSectionId || cPart.activeSectionId === '1-1-getting-started' || cPart.activeSectionId === '0-1-http-protocol' || cPart.activeSectionId === '1-1-overview' || cPart.activeSectionId.endsWith('-1') || cPart.activeSectionId.endsWith('.1');
                const hasMemRealProgress = !memIsInit || (memPart.activeQuestionIdx || 0) > 0 || Object.keys(memPart.selectedAnswers || {}).length > 0;
                const hasCloudRealProgress = !cloudIsInit || (cPart.activeQuestionIdx || 0) > 0 || Object.keys(cPart.selectedAnswers || {}).length > 0;
                const isMemoryNewer = memTime > cloudTime && (hasMemRealProgress || !hasCloudRealProgress);

                memPart.selectedAnswers = { ...(cPart.selectedAnswers || {}), ...(memPart.selectedAnswers || {}) };
                if (!isMemoryNewer) {
                  if (cPart.activeSectionId) {
                    memPart.activeSectionId = cPart.activeSectionId;
                  }
                  if (typeof cPart.activeQuestionIdx === 'number') {
                    memPart.activeQuestionIdx = cPart.activeQuestionIdx;
                  }
                  if (typeof cPart.isStudyPhase === 'boolean') {
                    memPart.isStudyPhase = cPart.isStudyPhase;
                  }
                  // Only restore levelResult if section matches active section
                  if (!memPart.levelResult && cPart.levelResult) {
                    const cSec = cPart.levelResult.sectionId || cPart.activeSectionId;
                    if (!cSec || cSec === (memPart.activeSectionId || cPart.activeSectionId)) {
                      memPart.levelResult = cPart.levelResult;
                    }
                  }
                }
                if (cPart.isFinishedPart) memPart.isFinishedPart = true;
                if (cPart.isCompleted) memPart.isCompleted = true;
                if (typeof memPart.isTimeUpWaiting !== 'boolean') {
                  memPart.isTimeUpWaiting = cPart.isTimeUpWaiting;
                }
                if (!memPart.targetEndTime) memPart.targetEndTime = cPart.targetEndTime;
                if (!memPart.timeLeft) memPart.timeLeft = cPart.timeLeft;
                if (memPart.isStudyPhase === false) {
                  // Keep unlocked!
                } else if (!isMemoryNewer) {
                  memPart.isStudyPhase = cPart.isStudyPhase;
                }
              }
            });
          }
        }
      });
    }

    // Apply cloud state directly into localStorage safely
    Object.entries(cloudState.courses).forEach(([courseId, courseRec]) => {
      // 1. Last visited part
      const sampleKeys = getCourseStorageKeys(courseId, 1);
      if (courseRec.lastPart) {
        const curLast = parseInt(localStorage.getItem(sampleKeys.lastPartKey) || '1', 10);
        localStorage.setItem(sampleKeys.lastPartKey, String(Math.max(curLast, courseRec.lastPart)));
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

          const curMemPart = memoryCourseState[cleanEmail]?.courses?.[courseId]?.parts?.[pNumStr];
          const memTime = curMemPart?.updatedAt ? new Date(curMemPart.updatedAt).getTime() : 0;
          const cloudTime = partState.updatedAt ? new Date(partState.updatedAt).getTime() : 0;
          const hasMemRealProgress = Boolean(curMemPart?.activeSectionId) || ((curMemPart?.activeQuestionIdx ?? 0) > 0) || Object.keys(curMemPart?.selectedAnswers || {}).length > 0;
          const hasCloudRealProgress = Boolean(partState?.activeSectionId) || ((partState?.activeQuestionIdx ?? 0) > 0) || Object.keys(partState?.selectedAnswers || {}).length > 0;
          const isMemoryNewer = memTime > cloudTime && (hasMemRealProgress || !hasCloudRealProgress);

          if (!isMemoryNewer && partState.activeSectionId) {
            const cleanSecId = partState.activeSectionId.replace(/^(java|cyber)-/, '');
            localStorage.setItem(partKeys.sectionIdKey, cleanSecId);
            if (courseId === 'java-core' && pNum === 1) {
              localStorage.setItem('dopilot_java_active_section_id', cleanSecId);
              localStorage.setItem('dopilot_java_part1_active_section_id', cleanSecId);
            }
            if (courseId === 'python-core' && pNum === 1) {
              localStorage.setItem('dopilot_active_section_id', cleanSecId);
              localStorage.setItem('dopilot_part1_active_section_id', cleanSecId);
            }
            if (courseId === 'fullstack-open') {
              localStorage.setItem(`dopilot_fullstack_part${pNum}_active_section_id`, cleanSecId);
            }
            if (courseId === 'cyber-security') {
              localStorage.setItem(`dopilot_cyber_part${pNum}_active_section_id`, cleanSecId);
            }
          }

          // Merge answers: NEVER overwrite newer local answers with older cloud answers!
          let localAnswers: Record<string, string> = {};
          try {
            const curAns = localStorage.getItem(partKeys.answersKey);
            if (curAns) localAnswers = JSON.parse(curAns);
          } catch {}
          const mergedAnswers = { ...(partState.selectedAnswers || {}), ...localAnswers };
          localStorage.setItem(partKeys.answersKey, JSON.stringify(mergedAnswers));
          if (courseId === 'java-core' && pNum === 1) {
            localStorage.setItem('dopilot_java_mcq_answers', JSON.stringify(mergedAnswers));
            localStorage.setItem('dopilot_java_part1_mcq_answers', JSON.stringify(mergedAnswers));
          }
          if (courseId === 'python-core' && pNum === 1) {
            localStorage.setItem('dopilot_mcq_answers_v2', JSON.stringify(mergedAnswers));
            localStorage.setItem('dopilot_part1_mcq_answers_v2', JSON.stringify(mergedAnswers));
          }
          if (courseId === 'fullstack-open') {
            localStorage.setItem(`dopilot_fullstack_part${pNum}_mcq_answers`, JSON.stringify(mergedAnswers));
          }
          if (courseId === 'cyber-security') {
            localStorage.setItem(`dopilot_cyber_part${pNum}_mcq_answers`, JSON.stringify(mergedAnswers));
          }

          // Question Index: Always use the cloud value on login restore, unless memory is newer
          const targetIdx = isMemoryNewer
            ? (curMemPart?.activeQuestionIdx ?? partState.activeQuestionIdx ?? 0)
            : (partState.activeQuestionIdx || 0);
          localStorage.setItem(partKeys.questionIdxKey, String(targetIdx));
          if (courseId === 'java-core' && pNum === 1) {
            localStorage.setItem('dopilot_java_active_q_idx', String(targetIdx));
            localStorage.setItem('dopilot_java_part1_active_q_idx', String(targetIdx));
          }
          if (courseId === 'python-core' && pNum === 1) {
            localStorage.setItem('dopilot_active_q_idx', String(targetIdx));
            localStorage.setItem('dopilot_part1_active_q_idx', String(targetIdx));
          }
          if (courseId === 'fullstack-open') {
            localStorage.setItem(`dopilot_fullstack_part${pNum}_active_q_idx`, String(targetIdx));
          }
          if (courseId === 'cyber-security') {
            localStorage.setItem(`dopilot_cyber_part${pNum}_active_q_idx`, String(targetIdx));
          }

          // Study Phase: NEVER relock if already unlocked locally or if target question is answered!
          const curPhase = localStorage.getItem(partKeys.studyPhaseKey);
          const sec = (isMemoryNewer ? curMemPart?.activeSectionId : partState.activeSectionId) || localStorage.getItem(partKeys.sectionIdKey) || '';
          // Only check if the specific active question has an answer (exact key match)
          const isAnswered = Object.keys(mergedAnswers).some(k => {
            if (!sec) return false;
            // Exact taskId format matches: e.g. "sectionId-idx" or "sectionId-qId"
            return k === `${sec}-${targetIdx}` || k.startsWith(`${sec}-`);
          }) && Boolean(
            mergedAnswers[`${sec}-${targetIdx}`] ||
            Object.entries(mergedAnswers).find(([k, v]) => k.startsWith(`${sec}-`) && Boolean(v))
          );
          // Only consider the target question answered if exact taskId key or index matches
          const exactActiveKeyAnswered = Boolean(
            mergedAnswers[`${sec}-${targetIdx}`] ||
            (targetIdx === 0 && mergedAnswers[sec])
          );
          let targetStudyPhase = isMemoryNewer && typeof curMemPart?.isStudyPhase === 'boolean'
            ? curMemPart.isStudyPhase
            : partState.isStudyPhase;
          if (curPhase === 'false' || exactActiveKeyAnswered) {
            targetStudyPhase = false;
          }
          localStorage.setItem(partKeys.studyPhaseKey, String(targetStudyPhase));
          if (courseId === 'java-core' && pNum === 1) {
            localStorage.setItem('dopilot_java_study_phase', String(targetStudyPhase));
            localStorage.setItem('dopilot_java_part1_study_phase', String(targetStudyPhase));
          }
          if (courseId === 'python-core' && pNum === 1) {
            localStorage.setItem('dopilot_study_phase', String(targetStudyPhase));
            localStorage.setItem('dopilot_part1_study_phase', String(targetStudyPhase));
          }
          if (courseId === 'fullstack-open') {
            localStorage.setItem(`dopilot_fullstack_part${pNum}_study_phase`, String(targetStudyPhase));
          }
          if (courseId === 'cyber-security') {
            localStorage.setItem(`dopilot_cyber_part${pNum}_study_phase`, String(targetStudyPhase));
          }

          if (partState.targetEndTime && !targetStudyPhase) {
            const curEnd = Number(localStorage.getItem(partKeys.targetEndTimeKey) || '0');
            if (!curEnd || curEnd < Date.now()) {
              localStorage.setItem(partKeys.targetEndTimeKey, String(partState.targetEndTime));
              if (courseId === 'java-core' && pNum === 1) localStorage.setItem('dopilot_java_part1_q_target_end_time', String(partState.targetEndTime));
              if (courseId === 'python-core' && pNum === 1) localStorage.setItem('dopilot_part1_q_target_end_time', String(partState.targetEndTime));
            }
          }

          // NEVER trigger false Time's Up on notes page or on answered questions!
          if (targetStudyPhase || isAnswered) {
            localStorage.removeItem(partKeys.timeUpKey);
            if (courseId === 'java-core') {
              localStorage.removeItem('dopilot_java_time_up');
              localStorage.removeItem('dopilot_java_part1_time_up');
            }
            if (courseId === 'python-core') {
              localStorage.removeItem('dopilot_time_up');
              localStorage.removeItem('dopilot_part1_time_up');
            }
          } else if (partState.isTimeUpWaiting) {
            localStorage.setItem(partKeys.timeUpKey, 'true');
            if (courseId === 'java-core' && pNum === 1) localStorage.setItem('dopilot_java_time_up', 'true');
            if (courseId === 'python-core' && pNum === 1) localStorage.setItem('dopilot_time_up', 'true');
          } else {
            localStorage.removeItem(partKeys.timeUpKey);
            if (courseId === 'java-core' && pNum === 1) localStorage.removeItem('dopilot_java_time_up');
            if (courseId === 'python-core' && pNum === 1) localStorage.removeItem('dopilot_time_up');
          }
          if (partState.isCompleted) {
            localStorage.setItem(partKeys.completedKey, 'true');
          }
          if (!isMemoryNewer && partState.levelResult && partState.levelResult.isFinished) {
            const lrSec = partState.levelResult.sectionId || partState.activeSectionId;
            const curSec = localStorage.getItem(partKeys.sectionIdKey);
            if (!lrSec || !curSec || lrSec === curSec) {
              localStorage.setItem(partKeys.levelResultKey, JSON.stringify(partState.levelResult));
              if (courseId === 'java-core' && pNum === 1) localStorage.setItem('dopilot_java_level_result', JSON.stringify(partState.levelResult));
              if (courseId === 'python-core' && pNum === 1) localStorage.setItem('dopilot_level_result', JSON.stringify(partState.levelResult));
              if (courseId === 'fullstack-open' && pNum === 0) localStorage.setItem('dopilot_fullstack_part0_level_result', JSON.stringify(partState.levelResult));
              if (courseId === 'fullstack-open' && pNum === 1) localStorage.setItem('dopilot_fullstack_part1_level_result', JSON.stringify(partState.levelResult));
              if (courseId === 'cyber-security' && pNum === 1) localStorage.setItem('dopilot_cyber_part1_level_result', JSON.stringify(partState.levelResult));
            } else {
              localStorage.removeItem(partKeys.levelResultKey);
            }
          } else if (!isMemoryNewer) {
            localStorage.removeItem(partKeys.levelResultKey);
            if (courseId === 'java-core' && pNum === 1) localStorage.removeItem('dopilot_java_level_result');
            if (courseId === 'python-core' && pNum === 1) localStorage.removeItem('dopilot_level_result');
            if (courseId === 'fullstack-open' && pNum === 0) localStorage.removeItem('dopilot_fullstack_part0_level_result');
            if (courseId === 'fullstack-open' && pNum === 1) localStorage.removeItem('dopilot_fullstack_part1_level_result');
            if (courseId === 'cyber-security' && pNum === 1) localStorage.removeItem('dopilot_cyber_part1_level_result');
          }
          if (partState.isFinishedPart) {
            localStorage.setItem(partKeys.finishedKey, 'true');
            if (courseId === 'java-core' && pNum === 1) localStorage.setItem('dopilot_java_part1_finished', 'true');
            if (courseId === 'python-core' && pNum === 1) localStorage.setItem('dopilot_part1_finished', 'true');
            if (courseId === 'fullstack-open' && pNum === 0) localStorage.setItem('dopilot_fullstack_part0_finished', 'true');
            if (courseId === 'fullstack-open' && pNum === 1) localStorage.setItem('dopilot_fullstack_part1_finished', 'true');
            if (courseId === 'cyber-security' && pNum === 1) localStorage.setItem('dopilot_cyber_part1_finished', 'true');
          }
        });
      }
    });

    // 4. Restore Part 1 score service records if saved
    if (cloudState.part1SectionScores) {
      Object.entries(cloudState.part1SectionScores).forEach(([k, v]) => {
        let existingScores: any = {};
        try {
          const raw = localStorage.getItem(k);
          if (raw) existingScores = JSON.parse(raw);
        } catch {}
        const merged = { ...v, ...existingScores };
        localStorage.setItem(k, JSON.stringify(merged));
      });
    }
    if (cloudState.trialAttempted) {
      Object.entries(cloudState.trialAttempted).forEach(([k, v]) => {
        if (v || localStorage.getItem(k) === 'true') {
          localStorage.setItem(k, 'true');
        }
      });
    }

    // 5. Restore Post-Purchase decisions and Part 1 restart flags across all courses
    if (cloudState.postPurchaseDecisions) {
      Object.entries(cloudState.postPurchaseDecisions).forEach(([c, dec]) => {
        if (dec) {
          localStorage.setItem(`dopilot_${c}_post_purchase_decision`, dec);
          localStorage.setItem(`dopilot_${c}_core_post_purchase_decision`, dec);
          localStorage.setItem(`dopilot_${c}_post_purchase_decision_${cleanEmail}`, dec);
          localStorage.setItem(`dopilot_${c}_core_post_purchase_decision_${cleanEmail}`, dec);
        }
      });
    }
    if (cloudState.part1RestartUsed) {
      Object.entries(cloudState.part1RestartUsed).forEach(([c, used]) => {
        if (used) {
          localStorage.setItem(`dopilot_${c}_part1_restart_used`, 'true');
          localStorage.setItem(`dopilot_${c}_core_part1_restart_used`, 'true');
          localStorage.setItem(`dopilot_${c}_part1_restart_used_${cleanEmail}`, 'true');
          localStorage.setItem(`dopilot_${c}_core_part1_restart_used_${cleanEmail}`, 'true');
        }
      });
    }

    if (cloudState.exemptSections) {
      Object.entries(cloudState.exemptSections).forEach(([c, secId]) => {
        if (secId) {
          localStorage.setItem(`dopilot_${c}_exempt_in_progress_section`, secId);
          localStorage.setItem(`dopilot_${c}_exempt_in_progress_section_${cleanEmail}`, secId);
        }
      });
    }

    // 6. Restore student certificates across courses if stored in cloud state
    if (cloudState.certificates) {
      Object.entries(cloudState.certificates).forEach(([storageKey, certRec]) => {
        if (certRec) {
          try {
            const raw = typeof certRec === 'string' ? certRec : JSON.stringify(certRec);
            localStorage.setItem(storageKey, raw);
          } catch {}
        }
      });
    }

    // 7. Restore student locked status keys & consecutive failure counters
    const hasAnyLock = cloudState.globalLockedKeys && Object.values(cloudState.globalLockedKeys).some(v => v === true);
    if (cloudState.globalLockedKeys && hasAnyLock) {
      Object.entries(cloudState.globalLockedKeys).forEach(([k, isLocked]) => {
        if (isLocked) {
          localStorage.setItem(k, 'true');
        } else {
          localStorage.removeItem(k);
        }
      });
    } else {
      // Actively purge all local lock keys if cloud indicates student is unlocked
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.includes('_locked_') || key.startsWith('dopilot_locked_'))) {
          if (cleanEmail && (key.includes(cleanEmail) || key.includes('108467813526729545413'))) {
            localStorage.removeItem(key);
          }
        }
      }
    }

    const hasAnyFailures = cloudState.consecutiveFailures && Object.values(cloudState.consecutiveFailures).some(v => Number(v) > 0);
    if (cloudState.consecutiveFailures && hasAnyFailures) {
      Object.entries(cloudState.consecutiveFailures).forEach(([k, count]) => {
        localStorage.setItem(k, String(count));
      });
    } else {
      // Actively reset failure streak counters to 0 if unlocked in cloud
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.includes('consecutive_failures') || key.includes('failed_levels_streak'))) {
          if (cleanEmail && (key.includes(cleanEmail) || key.includes('108467813526729545413'))) {
            localStorage.setItem(key, '0');
          }
        }
      }
    }

    // 8. Restore student question answering telemetry from cloud
    try {
      await restoreStudentTelemetryFromCloud(cleanEmail);
    } catch (e) {
      console.warn('Telemetry cloud hydration error:', e);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('dopilot_progress_restored'));
    }

    return cloudState;
  } catch (err) {
    console.error('Failed to restore student course progress from cloud:', err);
    return null;
  } finally {
    restoringFromCloudCount = Math.max(0, restoringFromCloudCount - 1);
    isRestoringFromCloud = restoringFromCloudCount > 0;
    restoreInFlightCount[cleanEmail] = Math.max(0, (restoreInFlightCount[cleanEmail] || 1) - 1);
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

  if (typeof window !== 'undefined' && (window as any).__dopilot_session_invalidated === true) {
    return null;
  }
  if (!cleanEmail) return null;

  // Check memory cache first
  const cached = memoryCourseState[cleanEmail]?.courses?.[courseId]?.parts?.[String(partNum)];
  if (cached && (cached.activeSectionId || typeof cached.activeQuestionIdx === 'number')) {
    return cached;
  }

  // Fetch full state from cloud
  const full = await restoreAllStudentCourseProgressFromCloud(cleanEmail);
  return full?.courses?.[courseId]?.parts?.[String(partNum)] || cached || null;
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
  setDisclaimerModalOpen?: (open: boolean) => void;
  setConsecutiveFailureModalOpen?: (open: boolean) => void;
  setHelpModalOpen?: (open: boolean) => void;
  setPartModalOpen?: (open: boolean) => void;
  onHydrated?: () => void;
}) {
  const paramsRef = useRef(params);
  paramsRef.current = params;
  const hasHydratedRef = useRef(false);

  const cleanEmail = normalizeStudentEmail(params.studentEmail);

  useEffect(() => {
    if (!cleanEmail) return;

    const applyState = (saved: PartQuestionState) => {
      const p = paramsRef.current;
      const validIds = p.validSectionIds || [];

      let resolvedSecId = saved.activeSectionId;
      if (resolvedSecId && !validIds.includes(resolvedSecId)) {
        const clean = resolvedSecId.replace(/^(java|cyber)-/, '');
        if (validIds.includes(clean)) {
          resolvedSecId = clean;
        } else {
          const matched = validIds.find(id => resolvedSecId === id || resolvedSecId.endsWith(`-${id}`) || id.endsWith(resolvedSecId));
          if (matched) resolvedSecId = matched;
        }
      }

      if (resolvedSecId && validIds.includes(resolvedSecId)) {
        if (p.activeSectionId !== resolvedSecId) {
          p.setActiveSectionId(resolvedSecId);
        }
      }
      if (typeof saved.activeQuestionIdx === 'number') {
        p.setActiveQuestionIdx(saved.activeQuestionIdx);
      }
      if (saved.selectedAnswers) {
        p.setSelectedAnswers((prev) => {
          const prevKeys = Object.keys(prev || {});
          const savedKeys = Object.keys(saved.selectedAnswers || {});
          if (
            prevKeys.length === savedKeys.length &&
            prevKeys.every((k) => prev[k] === saved.selectedAnswers[k])
          ) {
            return prev;
          }
          return { ...saved.selectedAnswers };
        });
      }

      if (saved.isFinishedPart || saved.isCompleted) {
        p.setIsCourseComplete?.(true);
      }

      // 1. Result page state: ONLY restore levelResult if it matches the current/saved section!
      // Stale levelResult from a previous level must NEVER be restored to a new section!
      const targetSec = saved.activeSectionId || p.activeSectionId;
      const resultSec = saved.levelResult?.sectionId || targetSec;
      const isResultPage = saved.pageType === 'passed_result' ||
                           saved.pageType === 'failed_result' ||
                           saved.pageType === 'retest_result' ||
                           Boolean(saved.levelResult && saved.levelResult.isFinished);

      if (isResultPage && (saved.levelResult || saved.pageType)) {
        const resultIsPassed = saved.pageType === 'failed_result'
          ? false
          : (saved.levelResult?.isPassed ?? true);

        const restoredResult = {
          ...(saved.levelResult || {}),
          isFinished: true,
          isPassed: resultIsPassed,
          sectionId: resultSec
        };

        p.setLevelResult?.(restoredResult);
        p.setIsStudyPhase(false);
        p.setIsTimeUpWaiting(false);
        p.setTimeLeft(30);

        if (saved.pageType === 'disclaimer_guidelines' || saved.disclaimerModalOpen) {
          p.setDisclaimerModalOpen?.(true);
        }
        if (saved.pageType === 'failure_warning' || saved.consecutiveFailureModalOpen) {
          p.setConsecutiveFailureModalOpen?.(true);
        }
        return;
      } else if (!isResultPage) {
        p.setLevelResult?.(null);
      }

      if (saved.pageType === 'disclaimer_guidelines' || saved.disclaimerModalOpen) {
        p.setDisclaimerModalOpen?.(true);
      }
      if (saved.pageType === 'failure_warning' || saved.consecutiveFailureModalOpen) {
        p.setConsecutiveFailureModalOpen?.(true);
      }
      if (saved.pageType === 'part_intro' || saved.partIntroModalOpen) {
        p.setPartModalOpen?.(true);
      }
      if (saved.pageType === 'help_modal' || saved.helpModalOpen) {
        p.setHelpModalOpen?.(true);
      }

      // 2. Study Phase: Check if user already unlocked locally or already answered this specific question
      const partKeys = getCourseStorageKeys(p.courseId, p.partNum);
      const curLocalStudy = localStorage.getItem(partKeys.studyPhaseKey);
      const qIdxStr = String(saved.activeQuestionIdx);
      const secId = saved.activeSectionId || p.activeSectionId;
      const exactKey = `${secId}-${qIdxStr}`;
      const answersMap = saved.selectedAnswers || {};
      const hasAnswer = Boolean(
        answersMap[exactKey] ||
        answersMap[`java-${secId}-${qIdxStr}`] ||
        answersMap[`cyber-p${p.partNum}-${secId}-${qIdxStr}`] ||
        answersMap[`fullstack-${p.partNum}-${secId}-${qIdxStr}`] ||
        Object.keys(answersMap).some(k =>
          (k === exactKey) ||
          (k.startsWith(`${secId}-`) && k.endsWith(`-${qIdxStr}`)) ||
          (k.includes(secId) && (k.endsWith(`-${qIdxStr}`) || k.includes(`-${qIdxStr}-v`)))
        )
      );

      if (hasAnswer) {
        p.setIsStudyPhase(false);
        p.setIsTimeUpWaiting(false);
      } else if (saved.isStudyPhase !== false) {
        p.setIsStudyPhase(true);
        p.setIsTimeUpWaiting(false);
        p.setTimeLeft(30);
        p.setTargetEndTime(0);
      } else {
        // 3. Question Phase (question was unlocked)
        p.setIsStudyPhase(false);

        if (hasAnswer) {
          // Question already answered: user is reviewing or on explanation screen. Do not show Time's Up!
          p.setIsTimeUpWaiting(false);
        } else if (saved.isTimeUpWaiting) {
          p.setIsTimeUpWaiting(true);
          p.setTimeLeft(0);
        } else if (saved.targetEndTime) {
          const diff = Math.ceil((saved.targetEndTime - Date.now()) / 1000);
          if (diff <= 0) {
            // Unlocked question whose 30s timer genuinely expired
            p.setIsTimeUpWaiting(true);
            p.setTimeLeft(0);
          } else {
            p.setIsTimeUpWaiting(false);
            p.setTimeLeft(Math.min(30, diff));
            p.setTargetEndTime(saved.targetEndTime);
          }
        } else {
          p.setIsTimeUpWaiting(false);
          p.setTimeLeft(30);
        }
      }
    };

    getCloudPartQuestionState(params.courseId, params.partNum, cleanEmail).then((saved) => {
      if (saved) {
        hasHydratedRef.current = true;
        applyState(saved);
      }
      if (cleanEmail) {
        partHydratedMap[`${cleanEmail}_${params.courseId}_${params.partNum}`] = true;
      }
      paramsRef.current.onHydrated?.();
    });

    const handleRestored = () => {
      getCloudPartQuestionState(params.courseId, params.partNum, cleanEmail).then((saved) => {
        if (saved) {
          applyState(saved);
        }
        if (cleanEmail) {
          partHydratedMap[`${cleanEmail}_${params.courseId}_${params.partNum}`] = true;
        }
        paramsRef.current.onHydrated?.();
      });
    };

    window.addEventListener('dopilot_progress_restored', handleRestored);
    return () => {
      window.removeEventListener('dopilot_progress_restored', handleRestored);
    };
  }, [params.courseId, params.partNum, cleanEmail]);
}


if (typeof window !== 'undefined') {
  const flushOnExit = () => {
    try {
      const sessionRaw = window.localStorage.getItem('dopilot_student_session_v1');
      if (!sessionRaw) return;
      const session = JSON.parse(sessionRaw);
      const email = normalizeStudentEmail(session?.email);
      if (email) {
        flushCloudSync(email);
      }
    } catch {}
  };

  window.addEventListener('pagehide', flushOnExit);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushOnExit();
    }
  });
}
