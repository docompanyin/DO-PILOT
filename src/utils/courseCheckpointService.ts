/**
 * Centralized Cloud-First Course Checkpoint Service
 * Single source of truth for course resume state across Python Core, Complete Java,
 * Full Stack Open (Part 0 Free, Parts 1-13 Paid), and Cyber Security.
 */

import { supabase } from '../lib/supabase';
import { normalizeStudentEmail } from './courseProgressSyncService';

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
  sectionId?: string;
}

export type CoursePageType =
  | 'part_intro'
  | 'section_intro'
  | 'study_notes'
  | 'locked_question'
  | 'unlocked_question'
  | 'incomplete_question'
  | 'answered_question'
  | 'passed_result'
  | 'failed_result'
  | 'retest_page'
  | 'failure_warning'
  | 'disclaimer_guidelines'
  | 'part_completion'
  | 'certificate_claim';

export interface CourseCheckpoint {
  courseId: string;
  partNum: number;
  activeSectionId: string;
  activeQuestionIdx: number;
  isStudyPhase: boolean;
  isTimeUpWaiting: boolean;
  targetEndTime: number;
  timeLeft: number;
  selectedAnswers: Record<string, string>;
  levelResult: LevelResultRecord | null;
  pageType?: CoursePageType;
  disclaimerModalOpen?: boolean;
  consecutiveFailureModalOpen?: boolean;
  attemptCounts?: Record<string, number>;
  consecutiveFailures?: Record<string, number>;
  disclaimerConfirmed?: boolean;
  exemptSections?: Record<string, string>;
  isCompleted?: boolean;
  isFinishedPart?: boolean;
  certificates?: Record<string, any>;
  postPurchaseDecisions?: Record<string, string>;
  lastPart?: number;
  updatedAt?: string;
}

export interface CheckpointResponse {
  success: boolean;
  revision: number;
  idempotencyKey?: string;
  checkpoint: CourseCheckpoint | null;
  message?: string;
}

interface OutboxItem {
  id: string;
  email: string;
  courseId: string;
  partNum: number;
  expectedRevision: number;
  idempotencyKey: string;
  checkpoint: CourseCheckpoint;
  timestamp: number;
  retries: number;
}

const OUTBOX_STORAGE_KEY = 'dopilot_checkpoint_outbox';
const IN_MEMORY_CHECKPOINTS: Record<string, CourseCheckpoint> = {};
const CONFIRMED_REVISIONS: Record<string, number> = {};
let isOutboxFlushing = false;

function getCacheKey(email: string, courseId: string, partNum: number): string {
  const clean = normalizeStudentEmail(email);
  return `${clean}::${courseId}::${partNum}`;
}

/**
 * Load pending saves from persistent browser outbox
 */
function getOutbox(): OutboxItem[] {
  try {
    const raw = localStorage.getItem(OUTBOX_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save pending saves to persistent browser outbox
 */
function setOutbox(items: OutboxItem[]): void {
  try {
    localStorage.setItem(OUTBOX_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn('Failed saving checkpoint outbox to localStorage:', err);
  }
}

/**
 * Get current authenticated user's access token if available
 */
async function getAuthToken(): Promise<string | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  } catch {
    return null;
  }
}

/**
 * Retrieve Authoritative Checkpoint from Cloud Backend
 */
export async function fetchAuthoritativeCheckpoint(
  studentEmail: string,
  courseId: string,
  partNum: number
): Promise<CourseCheckpoint | null> {
  const cleanEmail = normalizeStudentEmail(studentEmail);
  if (!cleanEmail) return null;

  const cacheKey = getCacheKey(cleanEmail, courseId, partNum);

  try {
    const token = await getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Student-Email': cleanEmail
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const endpoint = `/api/course-checkpoint?email=${encodeURIComponent(cleanEmail)}&courseId=${encodeURIComponent(courseId)}&partNum=${partNum}`;
    const resp = await fetch(endpoint, {
      method: 'GET',
      headers
    });

    if (resp.ok) {
      const data: CheckpointResponse = await resp.json();
      if (data && data.success && data.checkpoint) {
        IN_MEMORY_CHECKPOINTS[cacheKey] = data.checkpoint;
        CONFIRMED_REVISIONS[cacheKey] = data.revision || 1;
        // Also populate local storage for immediate offline/refresh availability
        populateLocalStorageFromCheckpoint(data.checkpoint);
        return data.checkpoint;
      }
    }
  } catch (err) {
    console.warn(`Failed to fetch cloud checkpoint for ${courseId} Part ${partNum}:`, err);
  }

  // Fallback to in-memory cache if available
  if (IN_MEMORY_CHECKPOINTS[cacheKey]) {
    return IN_MEMORY_CHECKPOINTS[cacheKey];
  }

  return null;
}

/**
 * Active Awaited Save with Server Confirmation
 * Dispatches active HTTP request and returns server response.
 * Queues into persistent outbox to guarantee retry resilience.
 */
export async function saveCheckpointActive(
  studentEmail: string,
  checkpoint: CourseCheckpoint,
  options?: { isEmergencyUnload?: boolean }
): Promise<boolean> {
  const cleanEmail = normalizeStudentEmail(studentEmail);
  if (!cleanEmail) return false;

  const { courseId, partNum } = checkpoint;
  const cacheKey = getCacheKey(cleanEmail, courseId, partNum);

  // 1. Update in-memory cache and localStorage fallback cache immediately
  IN_MEMORY_CHECKPOINTS[cacheKey] = { ...checkpoint, updatedAt: new Date().toISOString() };
  populateLocalStorageFromCheckpoint(checkpoint);

  // 2. Generate unique idempotency key and calculate expected revision
  const idempotencyKey = `chk_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const expectedRevision = CONFIRMED_REVISIONS[cacheKey] || 0;

  const outboxItem: OutboxItem = {
    id: idempotencyKey,
    email: cleanEmail,
    courseId,
    partNum,
    expectedRevision,
    idempotencyKey,
    checkpoint: { ...checkpoint, updatedAt: new Date().toISOString() },
    timestamp: Date.now(),
    retries: 0
  };

  // 3. Add to persistent outbox
  const outbox = getOutbox();
  // Filter out older pending item for the same course + part to avoid redundant requests
  const updatedOutbox = outbox.filter(item => !(item.courseId === courseId && item.partNum === partNum && item.email === cleanEmail));
  updatedOutbox.push(outboxItem);
  setOutbox(updatedOutbox);

  // If this is an emergency unload (pagehide/beforeunload), dispatch with keepalive: true
  if (options?.isEmergencyUnload) {
    try {
      const token = await getAuthToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Student-Email': cleanEmail
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      fetch('/api/course-checkpoint', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email: cleanEmail,
          courseId,
          partNum,
          expectedRevision,
          idempotencyKey,
          checkpoint: outboxItem.checkpoint
        }),
        keepalive: true
      }).catch(() => {});
    } catch {}
    return true;
  }

  // 4. Standard Active Awaited Save
  try {
    const token = await getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Student-Email': cleanEmail
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const resp = await fetch('/api/course-checkpoint', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email: cleanEmail,
        courseId,
        partNum,
        expectedRevision,
        idempotencyKey,
        checkpoint: outboxItem.checkpoint
      })
    });

    if (resp.ok) {
      const data: CheckpointResponse = await resp.json();
      if (data && data.success) {
        CONFIRMED_REVISIONS[cacheKey] = data.revision;
        // Remove item from outbox on confirmed save
        const curOutbox = getOutbox().filter(i => i.id !== idempotencyKey);
        setOutbox(curOutbox);
        return true;
      }
    }
  } catch (err) {
    console.warn(`Awaited checkpoint save network error for ${courseId} Part ${partNum}:`, err);
  }

  return false;
}

/**
 * Flush persistent outbox queue with exponential backoff
 */
export async function flushCheckpointOutbox(): Promise<void> {
  if (isOutboxFlushing) return;
  const outbox = getOutbox();
  if (outbox.length === 0) return;

  isOutboxFlushing = true;
  const remaining: OutboxItem[] = [];

  for (const item of outbox) {
    try {
      const token = await getAuthToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Student-Email': item.email
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const resp = await fetch('/api/course-checkpoint', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email: item.email,
          courseId: item.courseId,
          partNum: item.partNum,
          expectedRevision: item.expectedRevision,
          idempotencyKey: item.idempotencyKey,
          checkpoint: item.checkpoint
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.success) {
          const cacheKey = getCacheKey(item.email, item.courseId, item.partNum);
          CONFIRMED_REVISIONS[cacheKey] = data.revision;
          continue; // Successfully saved, do not keep in remaining
        }
      }
      item.retries += 1;
      remaining.push(item);
    } catch {
      item.retries += 1;
      remaining.push(item);
    }
  }

  setOutbox(remaining);
  isOutboxFlushing = false;
}

// Background auto-flush listeners on network recovery
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    flushCheckpointOutbox();
  });
  window.addEventListener('focus', () => {
    flushCheckpointOutbox();
  });

  // Emergency flush on mobile back or tab close
  const handleEmergencyFlush = () => {
    const outbox = getOutbox();
    for (const item of outbox) {
      try {
        fetch('/api/course-checkpoint', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Student-Email': item.email
          },
          body: JSON.stringify({
            email: item.email,
            courseId: item.courseId,
            partNum: item.partNum,
            expectedRevision: item.expectedRevision,
            idempotencyKey: item.idempotencyKey,
            checkpoint: item.checkpoint
          }),
          keepalive: true
        }).catch(() => {});
      } catch {}
    }
  };

  window.addEventListener('pagehide', handleEmergencyFlush);
  window.addEventListener('beforeunload', handleEmergencyFlush);
}

/**
 * Synchronize local storage keys from authoritative checkpoint
 * Ensures existing component state initializers get exact restored values
 */
export function populateLocalStorageFromCheckpoint(cp: CourseCheckpoint): void {
  if (typeof localStorage === 'undefined' || !cp) return;

  const { courseId, partNum } = cp;
  const isPython = courseId.includes('python');
  const isJava = courseId.includes('java');
  const isFullstack = courseId.includes('fullstack');

  let prefix = 'dopilot_';
  if (isJava) prefix = 'dopilot_java_';
  else if (isFullstack) prefix = 'dopilot_fullstack_';
  else if (courseId.includes('cyber')) prefix = 'dopilot_cyber_';

  const partPrefix = (isPython && partNum === 1) || (isJava && partNum === 1) || (courseId.includes('cyber') && partNum === 1)
    ? prefix
    : `${prefix}part${partNum}_`;

  try {
    if (cp.activeSectionId) {
      localStorage.setItem(`${partPrefix}active_section_id`, cp.activeSectionId);
    }
    localStorage.setItem(`${partPrefix}active_q_idx`, String(cp.activeQuestionIdx || 0));
    localStorage.setItem(`${partPrefix}study_phase`, String(cp.isStudyPhase ?? true));
    localStorage.setItem(`${partPrefix}mcq_answers`, JSON.stringify(cp.selectedAnswers || {}));
    if (isPython && partNum === 1) {
      localStorage.setItem('dopilot_mcq_answers_v2', JSON.stringify(cp.selectedAnswers || {}));
    }

    if (cp.targetEndTime) {
      localStorage.setItem(`${partPrefix}q_target_end_time`, String(cp.targetEndTime));
    }
    if (cp.isTimeUpWaiting) {
      localStorage.setItem(`${partPrefix}time_up`, 'true');
    } else {
      localStorage.removeItem(`${partPrefix}time_up`);
    }

    const isResultPage = cp.pageType === 'passed_result' || cp.pageType === 'failed_result' || Boolean(cp.levelResult && cp.levelResult.isFinished);

    if (isResultPage && cp.levelResult) {
      const fixedResult: LevelResultRecord = {
        ...cp.levelResult,
        isFinished: true,
        isPassed: cp.pageType === 'failed_result' ? false : (cp.levelResult.isPassed ?? true),
        sectionId: cp.levelResult.sectionId || cp.activeSectionId
      };
      localStorage.setItem(`${partPrefix}level_result`, JSON.stringify(fixedResult));
      if (isPython && partNum === 1) localStorage.setItem('dopilot_level_result', JSON.stringify(fixedResult));
      if (isJava && partNum === 1) localStorage.setItem('dopilot_java_level_result', JSON.stringify(fixedResult));
      if (courseId.includes('cyber') && partNum === 1) {
        localStorage.setItem('dopilot_cyber_level_result', JSON.stringify(fixedResult));
        localStorage.setItem('dopilot_cyber_part1_level_result', JSON.stringify(fixedResult));
      }
    } else if (cp.levelResult) {
      localStorage.setItem(`${partPrefix}level_result`, JSON.stringify(cp.levelResult));
    } else if (!isResultPage) {
      localStorage.removeItem(`${partPrefix}level_result`);
      if (isPython && partNum === 1) localStorage.removeItem('dopilot_level_result');
      if (isJava && partNum === 1) localStorage.removeItem('dopilot_java_level_result');
      if (courseId.includes('cyber') && partNum === 1) {
        localStorage.removeItem('dopilot_cyber_level_result');
        localStorage.removeItem('dopilot_cyber_part1_level_result');
      }
    }

    if (cp.pageType) {
      localStorage.setItem(`${partPrefix}page_type`, cp.pageType);
      if (isPython && partNum === 1) localStorage.setItem('dopilot_page_type', cp.pageType);
      if (isJava && partNum === 1) localStorage.setItem('dopilot_java_page_type', cp.pageType);
      if (courseId.includes('cyber') && partNum === 1) {
        localStorage.setItem('dopilot_cyber_page_type', cp.pageType);
        localStorage.setItem('dopilot_cyber_part1_page_type', cp.pageType);
      }
    }

    if (cp.disclaimerModalOpen !== undefined) {
      if (cp.disclaimerModalOpen) {
        localStorage.setItem(`${partPrefix}disclaimer_open`, 'true');
        localStorage.setItem(`${partPrefix}disclaimer_modal_open`, 'true');
        if (isPython && partNum === 1) localStorage.setItem('dopilot_disclaimer_open', 'true');
        if (isJava && partNum === 1) localStorage.setItem('dopilot_java_disclaimer_open', 'true');
        if (courseId.includes('cyber') && partNum === 1) {
          localStorage.setItem('dopilot_cyber_disclaimer_open', 'true');
          localStorage.setItem('dopilot_cyber_part1_disclaimer_open', 'true');
        }
      } else {
        localStorage.removeItem(`${partPrefix}disclaimer_open`);
        localStorage.removeItem(`${partPrefix}disclaimer_modal_open`);
        if (isPython && partNum === 1) localStorage.removeItem('dopilot_disclaimer_open');
        if (isJava && partNum === 1) localStorage.removeItem('dopilot_java_disclaimer_open');
        if (courseId.includes('cyber') && partNum === 1) {
          localStorage.removeItem('dopilot_cyber_disclaimer_open');
          localStorage.removeItem('dopilot_cyber_part1_disclaimer_open');
        }
      }
    }

    if (cp.consecutiveFailureModalOpen !== undefined) {
      if (cp.consecutiveFailureModalOpen) {
        localStorage.setItem(`${partPrefix}consecutive_failure_modal_open`, 'true');
      } else {
        localStorage.removeItem(`${partPrefix}consecutive_failure_modal_open`);
      }
    }

    if (cp.isCompleted || cp.pageType === 'part_completion') {
      localStorage.setItem(`${prefix}part${partNum}_completed`, 'true');
    }
    if (cp.isFinishedPart || cp.pageType === 'part_completion') {
      const finKey = (isPython && partNum === 1) || (isJava && partNum === 1) || (courseId.includes('cyber') && partNum === 1)
        ? `${prefix}part1_finished`
        : `${prefix}part${partNum}_finished`;
      localStorage.setItem(finKey, 'true');
    }

    if (cp.consecutiveFailures) {
      Object.entries(cp.consecutiveFailures).forEach(([k, v]) => {
        localStorage.setItem(k, String(v));
      });
    }

    if (cp.exemptSections) {
      Object.entries(cp.exemptSections).forEach(([k, v]) => {
        localStorage.setItem(`dopilot_${k}_exempt_in_progress_section`, v);
      });
    }

    if (cp.postPurchaseDecisions) {
      Object.entries(cp.postPurchaseDecisions).forEach(([k, v]) => {
        localStorage.setItem(`dopilot_${k}_post_purchase_decision`, v);
      });
    }
  } catch (err) {
    console.warn('Failed populating localStorage from checkpoint:', err);
  }
}
