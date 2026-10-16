import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface LockedCourseRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  collegeOrCompany?: string;
  courseId: 'python' | 'java' | 'fullstack' | 'cyber' | string;
  courseName: string;
  partNum?: number;
  partTitle?: string;
  failedPart?: string;
  failedSection?: string;
  consecutiveFailures: number;
  lockStatus: 'locked' | 'unlocked';
  lockedAt: string;       // ISO date string
  unlockedAt?: string;     // ISO date string
  unlockedBy?: string;     // Admin username or email
  adminNotes?: string;
  progressSummary: string; // e.g. "Part 10: OOP Hierarchies • 24 Points"
  earnedPoints: number;
}

export interface CourseResetAuditEntry {
  id: string;
  recordId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseName: string;
  adminIdentifier: string;
  resetTimestamp: string;  // ISO date string
  previousFailures: number;
  adminNotes?: string;
  status: 'SUCCESS' | 'FAILED';
}

export const LOCKED_COURSES_STORAGE_KEY = 'dopilot_locked_courses_registry_v1';
export const COURSE_RESETS_AUDIT_KEY = 'dopilot_course_resets_audit_v1';

const INITIAL_DEMO_LOCKED_COURSES: LockedCourseRecord[] = [
  {
    id: 'LC-101',
    studentId: 'demo-std-1',
    studentName: 'Rahul Verma',
    studentEmail: 'rahul.verma@techsprint.io',
    studentPhone: '+91 98450 12345',
    collegeOrCompany: 'IIT Bombay',
    courseId: 'python',
    courseName: 'Complete Python Course',
    partNum: 10,
    partTitle: 'Part 10: OOP Hierarchies & Inheritance',
    failedPart: 'Part 10',
    failedSection: 'OOP Hierarchies & Inheritance',
    consecutiveFailures: 3,
    lockStatus: 'locked',
    lockedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    progressSummary: '9 / 14 Parts Completed • 24 Points',
    earnedPoints: 24
  },
  {
    id: 'LC-102',
    studentId: 'demo-std-3',
    studentName: 'Ananya Iyer',
    studentEmail: 'ananya.iyer99@gmail.com',
    studentPhone: '+91 98123 45678',
    collegeOrCompany: 'Anna University',
    courseId: 'python',
    courseName: 'Complete Python Course',
    partNum: 2,
    partTitle: 'Part 2: Variables & Data Types',
    failedPart: 'Part 2',
    failedSection: 'Variables & Data Types',
    consecutiveFailures: 3,
    lockStatus: 'locked',
    lockedAt: new Date(Date.now() - 18 * 3600000).toISOString(),
    progressSummary: '1 / 14 Parts Completed • 2 Points',
    earnedPoints: 2
  },
  {
    id: 'LC-103',
    studentId: 'demo-std-6',
    studentName: 'Vikramaditya Singh',
    studentEmail: 'vikram.singh@nitw.ac.in',
    studentPhone: '+91 97654 32109',
    collegeOrCompany: 'NIT Warangal',
    courseId: 'java',
    courseName: 'Complete Java Course',
    partNum: 4,
    partTitle: 'Part 4: Methods, Signatures & Return Types',
    failedPart: 'Part 4',
    failedSection: 'Methods, Signatures & Return Types',
    consecutiveFailures: 3,
    lockStatus: 'locked',
    lockedAt: new Date(Date.now() - 26 * 3600000).toISOString(),
    progressSummary: '3 / 14 Parts Completed • 9 Points',
    earnedPoints: 9
  },
  {
    id: 'LC-104',
    studentId: 'demo-std-2',
    studentName: 'Priya Patel',
    studentEmail: 'priya.patel@gmail.com',
    studentPhone: '+91 98765 43210',
    collegeOrCompany: 'SRM Institute of Science & Technology',
    courseId: 'cyber',
    courseName: 'Cyber Security & Ethical Hacking',
    partNum: 1,
    partTitle: 'Part 1: Networking & Threat Modeling',
    failedPart: 'Part 1',
    failedSection: 'Networking & Threat Modeling',
    consecutiveFailures: 3,
    lockStatus: 'unlocked',
    lockedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    unlockedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    unlockedBy: 'admin',
    adminNotes: 'Student contacted support and completed mentor concept review.',
    progressSummary: '0 / 14 Parts Completed • 12 Points',
    earnedPoints: 12
  }
];

const INITIAL_DEMO_AUDIT_LOGS: CourseResetAuditEntry[] = [
  {
    id: 'RST-9001',
    recordId: 'LC-104',
    studentId: 'demo-std-2',
    studentName: 'Priya Patel',
    studentEmail: 'priya.patel@gmail.com',
    courseId: 'cyber',
    courseName: 'Cyber Security & Ethical Hacking',
    adminIdentifier: 'admin',
    resetTimestamp: new Date(Date.now() - 12 * 3600000).toISOString(),
    previousFailures: 3,
    adminNotes: 'Student contacted support and completed mentor concept review.',
    status: 'SUCCESS'
  }
];

/**
 * Scan browser localStorage for live locked keys to discover any newly locked student sessions
 */
export const scanAndSyncLiveLocks = (): LockedCourseRecord[] => {
  let records: LockedCourseRecord[] = [];
  try {
    const raw = localStorage.getItem(LOCKED_COURSES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        records = parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse locked courses registry:', e);
  }

  if (records.length === 0) {
    records = [...INITIAL_DEMO_LOCKED_COURSES];
    try {
      localStorage.setItem(LOCKED_COURSES_STORAGE_KEY, JSON.stringify(records));
    } catch {}
  }

  // Scan localStorage for live course lock keys
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      const val = localStorage.getItem(key);
      if (val !== 'true') continue;

      // Python locks
      if (key.startsWith('dopilot_locked_') || key.includes('_locked_')) {
        let courseId = 'python';
        let courseName = 'Complete Python Course';
        let partNum = 1;

        if (key.includes('java')) {
          courseId = 'java';
          courseName = 'Complete Java Course';
        } else if (key.includes('fullstack')) {
          courseId = 'fullstack';
          courseName = 'Full Stack Web Development';
        } else if (key.includes('cyber')) {
          courseId = 'cyber';
          courseName = 'Cyber Security & Ethical Hacking';
        }

        // Extract student ID
        const matchStudent = key.match(/_([a-zA-Z0-9_-]+)$/);
        const studentId = matchStudent ? matchStudent[1] : 'current-student';

        // Extract part number if present
        const matchPart = key.match(/part(\d+)/i) || key.match(/p(\d+)/i);
        if (matchPart) {
          partNum = parseInt(matchPart[1], 10);
        }

        const existingIdx = records.findIndex(
          (r) => r.studentId === studentId && r.courseId === courseId && (r.partNum === partNum || !r.partNum)
        );

        if (existingIdx === -1) {
          // Add new live locked record
          const newRecord: LockedCourseRecord = {
            id: `LC-LIVE-${Date.now().toString().slice(-4)}`,
            studentId,
            studentName: studentId === 'current-student' ? 'Active Learner' : studentId,
            studentEmail: `${studentId}@student.dopilot.io`,
            courseId,
            courseName,
            partNum,
            partTitle: `Part ${partNum}`,
            failedPart: `Part ${partNum}`,
            failedSection: 'Compulsory Level Assessment',
            consecutiveFailures: 3,
            lockStatus: 'locked',
            lockedAt: new Date().toISOString(),
            progressSummary: `Part ${partNum} Assessment • Lock Active`,
            earnedPoints: 0
          };
          records.unshift(newRecord);
        } else if (records[existingIdx].lockStatus === 'unlocked') {
          // Re-locked if key is explicitly true again
          records[existingIdx].lockStatus = 'locked';
          records[existingIdx].consecutiveFailures = 3;
        }
      }
    }
  } catch (e) {
    console.error('Error scanning live locks:', e);
  }

  try {
    localStorage.setItem(LOCKED_COURSES_STORAGE_KEY, JSON.stringify(records));
  } catch {}

  return records;
};

/**
 * Helper to get clean failed part display
 */
export const getRecordFailedPart = (r: LockedCourseRecord): string => {
  if (r.failedPart) return r.failedPart;
  if (r.partNum) return `Part ${r.partNum}`;
  if (r.partTitle && r.partTitle.includes(':')) return r.partTitle.split(':')[0].trim();
  return r.partTitle || 'Part 1';
};

/**
 * Helper to get clean failed section display
 */
export const getRecordFailedSection = (r: LockedCourseRecord): string => {
  if (r.failedSection) return r.failedSection;
  if (r.partTitle && r.partTitle.includes(':')) return r.partTitle.split(':')[1].trim();
  return r.partTitle || 'Compulsory Level Assessment';
};

/**
 * Get all locked course records
 */
export const getLockedCourseRecords = (): LockedCourseRecord[] => {
  return scanAndSyncLiveLocks();
};

/**
 * Get all audit log entries of course resets
 */
export const getCourseResetAuditEntries = (): CourseResetAuditEntry[] => {
  try {
    const raw = localStorage.getItem(COURSE_RESETS_AUDIT_KEY);
    if (!raw) {
      localStorage.setItem(COURSE_RESETS_AUDIT_KEY, JSON.stringify(INITIAL_DEMO_AUDIT_LOGS));
      return INITIAL_DEMO_AUDIT_LOGS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_DEMO_AUDIT_LOGS;
  } catch (e) {
    console.error('Failed to get course reset audit entries:', e);
    return INITIAL_DEMO_AUDIT_LOGS;
  }
};

/**
 * Programmatically register a course lock when 3 consecutive failures occur
 */
export const recordCourseLock = (params: {
  studentId: string;
  studentName?: string;
  studentEmail?: string;
  studentPhone?: string;
  collegeOrCompany?: string;
  courseId: 'python' | 'java' | 'fullstack' | 'cyber' | string;
  courseName: string;
  partNum?: number;
  partTitle?: string;
  failedPart?: string;
  failedSection?: string;
  consecutiveFailures?: number;
  progressSummary?: string;
  earnedPoints?: number;
}): LockedCourseRecord => {
  const current = getLockedCourseRecords();
  const existingIdx = current.findIndex(
    (r) => r.studentId === params.studentId && r.courseId === params.courseId
  );

  let record: LockedCourseRecord;

  if (existingIdx !== -1) {
    current[existingIdx] = {
      ...current[existingIdx],
      lockStatus: 'locked',
      consecutiveFailures: params.consecutiveFailures || 3,
      lockedAt: new Date().toISOString(),
      partNum: params.partNum ?? current[existingIdx].partNum,
      partTitle: params.partTitle ?? current[existingIdx].partTitle,
      failedPart: params.failedPart ?? current[existingIdx].failedPart,
      failedSection: params.failedSection ?? current[existingIdx].failedSection,
      progressSummary: params.progressSummary ?? current[existingIdx].progressSummary,
      earnedPoints: params.earnedPoints ?? current[existingIdx].earnedPoints,
      unlockedAt: undefined,
      unlockedBy: undefined
    };
    record = current[existingIdx];
  } else {
    record = {
      id: `LC-${Date.now().toString().slice(-6)}`,
      studentId: params.studentId,
      studentName: params.studentName || 'Enrolled Student',
      studentEmail: params.studentEmail || `${params.studentId}@dopilot.io`,
      studentPhone: params.studentPhone,
      collegeOrCompany: params.collegeOrCompany,
      courseId: params.courseId,
      courseName: params.courseName,
      partNum: params.partNum,
      partTitle: params.partTitle,
      failedPart: params.failedPart || (params.partNum ? `Part ${params.partNum}` : undefined),
      failedSection: params.failedSection || (params.partTitle && params.partTitle.includes(':') ? params.partTitle.split(':')[1]?.trim() : 'Compulsory Level Assessment'),
      consecutiveFailures: params.consecutiveFailures || 3,
      lockStatus: 'locked',
      lockedAt: new Date().toISOString(),
      progressSummary: params.progressSummary || 'Course Assessment Locked',
      earnedPoints: params.earnedPoints || 0
    };
    current.unshift(record);
  }

  try {
    localStorage.setItem(LOCKED_COURSES_STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent('dopilot_locked_courses_updated', { detail: record }));
  } catch (e) {
    console.error('Failed to write locked course to storage:', e);
  }

  // Sync to Supabase if configured
  if (isSupabaseConfigured()) {
    Promise.resolve(
      supabase.from('locked_courses').upsert({
        id: record.id,
        student_id: record.studentId,
        student_name: record.studentName,
        student_email: record.studentEmail,
        course_id: record.courseId,
        course_name: record.courseName,
        part_num: record.partNum || null,
        consecutive_failures: record.consecutiveFailures,
        lock_status: record.lockStatus,
        locked_at: record.lockedAt,
        updated_at: new Date().toISOString()
      })
    ).catch(() => {});
  }

  return record;
};

/**
 * Target reset for specific student and course
 * Removes lock keys, clears failure streak to 0, resets attempt counters to 1.
 * DOES NOT touch points, certificates, or other enrolled courses.
 */
export const clearStudentCourseLockKeys = (studentId: string, courseId: string) => {
  const normCourse = courseId.toLowerCase();

  try {
    if (normCourse.includes('python')) {
      localStorage.removeItem(`dopilot_locked_${studentId}`);
      localStorage.removeItem(`dopilot_locked_progression_${studentId}`);
      localStorage.setItem(`dopilot_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_failed_levels_streak_${studentId}`, '0');

      for (let p = 1; p <= 14; p++) {
        localStorage.removeItem(`dopilot_part${p}_locked_${studentId}`);
        localStorage.removeItem(`dopilot_part${p}_locked_progression_${studentId}`);
        localStorage.setItem(`dopilot_part${p}_consecutive_failures_${studentId}`, '0');
        localStorage.setItem(`dopilot_part${p}_failed_levels_streak_${studentId}`, '0');
      }

      // Reset level attempts for python to 1
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('dopilot_part') || key.startsWith('dopilot_attempt_')) && key.includes(studentId) && key.includes('attempt')) {
          localStorage.setItem(key, '1');
        }
      }
    } else if (normCourse.includes('java')) {
      localStorage.removeItem(`dopilot_java_locked_${studentId}`);
      localStorage.removeItem(`dopilot_java_locked_progression_${studentId}`);
      localStorage.setItem(`dopilot_java_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_java_failed_levels_streak_${studentId}`, '0');

      for (let p = 1; p <= 14; p++) {
        localStorage.removeItem(`dopilot_java_part${p}_locked_${studentId}`);
        localStorage.removeItem(`dopilot_java_part${p}_locked_progression_${studentId}`);
        localStorage.setItem(`dopilot_java_part${p}_consecutive_failures_${studentId}`, '0');
        localStorage.setItem(`dopilot_java_part${p}_failed_levels_streak_${studentId}`, '0');
      }

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('dopilot_java') && key.includes(studentId) && key.includes('attempt')) {
          localStorage.setItem(key, '1');
        }
      }
    } else if (normCourse.includes('fullstack')) {
      localStorage.removeItem(`dopilot_fullstack_locked_${studentId}`);
      localStorage.removeItem(`dopilot_fullstack_locked_progression_${studentId}`);
      localStorage.setItem(`dopilot_fullstack_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_fullstack_failed_levels_streak_${studentId}`, '0');

      for (let p = 0; p <= 13; p++) {
        localStorage.removeItem(`dopilot_fullstack_p${p}_locked_${studentId}`);
        localStorage.removeItem(`dopilot_fullstack_part${p}_locked_${studentId}`);
        localStorage.removeItem(`dopilot_fullstack_p${p}_locked_progression_${studentId}`);
        localStorage.setItem(`dopilot_fullstack_p${p}_consecutive_failures_${studentId}`, '0');
        localStorage.setItem(`dopilot_fullstack_p${p}_failed_levels_streak_${studentId}`, '0');
      }

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('dopilot_fullstack') && key.includes(studentId) && key.includes('attempt')) {
          localStorage.setItem(key, '1');
        }
      }
    } else if (normCourse.includes('cyber')) {
      localStorage.removeItem(`dopilot_cyber_locked_${studentId}`);
      localStorage.removeItem(`dopilot_cyber_locked_progression_${studentId}`);
      localStorage.setItem(`dopilot_cyber_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_cyber_failed_levels_streak_${studentId}`, '0');

      for (let p = 1; p <= 14; p++) {
        localStorage.removeItem(`dopilot_cyber_part${p}_locked_${studentId}`);
        localStorage.removeItem(`dopilot_cyber_part${p}_locked_progression_${studentId}`);
        localStorage.setItem(`dopilot_cyber_part${p}_consecutive_failures_${studentId}`, '0');
        localStorage.setItem(`dopilot_cyber_part${p}_failed_levels_streak_${studentId}`, '0');
      }

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('dopilot_cyber') && key.includes(studentId) && key.includes('attempt')) {
          localStorage.setItem(key, '1');
        }
      }
    }
  } catch (e) {
    console.error('Error clearing student course lock keys:', e);
  }
};

/**
 * Execute course reset by Admin
 * - Unlocks the course
 * - Resets failure counts and attempts
 * - Creates an audit log
 * - Saves to localStorage and Supabase
 * - Emits custom event for real-time reactivity
 */
export const resetStudentCourse = (
  recordId: string,
  adminIdentifier: string = 'admin',
  adminNotes?: string
): { success: boolean; record?: LockedCourseRecord; auditEntry?: CourseResetAuditEntry; error?: string } => {
  const records = getLockedCourseRecords();
  const targetRecord = records.find((r) => r.id === recordId);

  if (!targetRecord) {
    return { success: false, error: 'Locked course record not found.' };
  }

  // 1. Clear targeted keys for this course and student
  clearStudentCourseLockKeys(targetRecord.studentId, targetRecord.courseId);

  // 2. Update record in registry
  const nowIso = new Date().toISOString();
  targetRecord.lockStatus = 'unlocked';
  targetRecord.unlockedAt = nowIso;
  targetRecord.unlockedBy = adminIdentifier;
  targetRecord.consecutiveFailures = 0;
  if (adminNotes) {
    targetRecord.adminNotes = adminNotes;
  }

  try {
    localStorage.setItem(LOCKED_COURSES_STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to update locked courses registry:', e);
  }

  // 3. Record audit trail entry
  const auditEntry: CourseResetAuditEntry = {
    id: `RST-${Date.now().toString().slice(-6)}`,
    recordId: targetRecord.id,
    studentId: targetRecord.studentId,
    studentName: targetRecord.studentName,
    studentEmail: targetRecord.studentEmail,
    courseId: targetRecord.courseId,
    courseName: targetRecord.courseName,
    adminIdentifier,
    resetTimestamp: nowIso,
    previousFailures: 3,
    adminNotes: adminNotes || 'Admin unlocked course progression after review.',
    status: 'SUCCESS'
  };

  const auditLogs = getCourseResetAuditEntries();
  const updatedAuditLogs = [auditEntry, ...auditLogs];
  try {
    localStorage.setItem(COURSE_RESETS_AUDIT_KEY, JSON.stringify(updatedAuditLogs));
  } catch (e) {
    console.error('Failed to save reset audit entry:', e);
  }

  // 4. Dispatch browser custom event for instant reactivity in student tabs
  window.dispatchEvent(
    new CustomEvent('dopilot_course_unlocked', {
      detail: {
        recordId: targetRecord.id,
        studentId: targetRecord.studentId,
        courseId: targetRecord.courseId,
        unlockedBy: adminIdentifier,
        timestamp: nowIso
      }
    })
  );

  window.dispatchEvent(
    new CustomEvent('dopilot_locked_courses_updated', {
      detail: targetRecord
    })
  );

  // 5. Database background sync with Supabase
  if (isSupabaseConfigured()) {
    Promise.resolve(
      supabase.from('course_resets').insert({
        id: auditEntry.id,
        record_id: auditEntry.recordId,
        student_id: auditEntry.studentId,
        student_name: auditEntry.studentName,
        student_email: auditEntry.studentEmail,
        course_id: auditEntry.courseId,
        course_name: auditEntry.courseName,
        admin_identifier: auditEntry.adminIdentifier,
        reset_timestamp: auditEntry.resetTimestamp,
        previous_failures: auditEntry.previousFailures,
        admin_notes: auditEntry.adminNotes || null,
        status: auditEntry.status
      })
    ).catch(() => {});

    Promise.resolve(
      supabase.from('locked_courses').upsert({
        id: targetRecord.id,
        student_id: targetRecord.studentId,
        student_name: targetRecord.studentName,
        student_email: targetRecord.studentEmail,
        course_id: targetRecord.courseId,
        course_name: targetRecord.courseName,
        consecutive_failures: 0,
        lock_status: 'unlocked',
        unlocked_at: nowIso,
        unlocked_by: adminIdentifier,
        admin_notes: adminNotes || null,
        updated_at: nowIso
      })
    ).catch(() => {});
  }

  return { success: true, record: targetRecord, auditEntry };
};
