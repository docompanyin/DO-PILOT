import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { normalizeStudentEmail, memoryCourseState } from './courseProgressSyncService';
export { normalizeStudentEmail };

export interface QuestionTelemetryRecord {
  id: string;                    // e.g. "py-1.1-q1-att1-1719283749"
  courseId: string;              // "python-core", "java-core", "fullstack-open", "cyber-security"
  partNum: number;
  sectionId: string;
  sectionTitle: string;
  subQuestionLabel: string;      // e.g. "1.1.1", "1.1.2", or "Part 1 -> Sec 1.1 -> Q1"
  questionIndex: number;         // 0-based or 1-based question number
  questionTitle: string;
  questionPrompt: string;
  codeSnippet?: string;
  studentOptionId: string;       // "A", "B", "C", "D"
  studentAnswer: string;         // Option text or detail
  correctOptionId: string;       // "A", "B", "C", "D"
  correctAnswer: string;
  isCorrect: boolean;
  timeTakenSeconds: number;      // Exact duration recorded (e.g. 8.4)
  timeLimitSeconds: number;      // 30
  attemptNumber: number;         // 1 = original attempt, 2+ = retest
  isRetest: boolean;
  attemptedAt: string;           // ISO timestamp
  speedCategory: 'fast' | 'normal' | 'slow' | 'timeout';
  status: 'passed' | 'failed' | 'timeout';
  explanation?: string;
}

export const getStudentTelemetryStorageKey = (emailOrId: string): string => {
  const clean = (emailOrId || '').toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
  return `dopilot_telemetry_${clean}`;
};

/**
 * Record an exact question attempt with actual timing and correctness
 */
export const logQuestionAttempt = (
  studentEmailOrId: string,
  record: Omit<QuestionTelemetryRecord, 'id' | 'attemptedAt' | 'speedCategory'>
): QuestionTelemetryRecord => {
  const attemptedAt = new Date().toISOString();
  const timeTakenSeconds = Math.max(0.1, Number(record.timeTakenSeconds.toFixed(1)));
  
  let speedCategory: 'fast' | 'normal' | 'slow' | 'timeout' = 'normal';
  if (record.status === 'timeout' || timeTakenSeconds >= 30.0) {
    speedCategory = 'timeout';
  } else if (timeTakenSeconds < 12.0) {
    speedCategory = 'fast';
  } else if (timeTakenSeconds <= 20.0) {
    speedCategory = 'normal';
  } else {
    speedCategory = 'slow';
  }

  const newRecord: QuestionTelemetryRecord = {
    ...record,
    id: `${record.courseId}-p${record.partNum}-${record.sectionId}-q${record.questionIndex}-att${record.attemptNumber}-${Date.now()}`,
    timeTakenSeconds,
    attemptedAt,
    speedCategory
  };

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const key = getStudentTelemetryStorageKey(studentEmailOrId);
      const raw = localStorage.getItem(key);
      const list: QuestionTelemetryRecord[] = raw ? JSON.parse(raw) : [];

      // Avoid duplicating identical exact attempt within 1 second
      const isDuplicate = list.some(
        (item) =>
          item.courseId === newRecord.courseId &&
          item.partNum === newRecord.partNum &&
          item.sectionId === newRecord.sectionId &&
          item.questionIndex === newRecord.questionIndex &&
          item.attemptNumber === newRecord.attemptNumber &&
          Math.abs(new Date(item.attemptedAt).getTime() - new Date(newRecord.attemptedAt).getTime()) < 1000
      );

      if (!isDuplicate) {
        list.push(newRecord);
        localStorage.setItem(key, JSON.stringify(list));
        const cleanEmail = normalizeStudentEmail(studentEmailOrId);
        if (cleanEmail) {
          memoryTelemetryCache[cleanEmail] = list;
        }

        // Sync to cloud site_content under student telemetry document for permanent cross-device persistence
        if (studentEmailOrId.includes('@')) {
          const cleanEmail = normalizeStudentEmail(studentEmailOrId);
          const docId = `telemetry_${cleanEmail.replace(/[^a-z0-9_]/g, '_')}`;

          // Direct client write to Supabase site_content for instant global persistence
          if (isSupabaseConfigured()) {
            Promise.resolve(
              supabase.from('site_content').upsert({
                id: docId,
                content: list,
                updated_at: new Date().toISOString()
              })
            ).catch((err) => {
              console.warn('Error saving telemetry directly to Supabase:', err);
            });
          }

          // Also trigger server-side sync endpoint if available
          try {
            fetch('/api/student-sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: cleanEmail,
                type: 'telemetry',
                content: list
              })
            }).catch(() => {});
          } catch {}
        }
      }
    } catch (e) {
      console.warn('Failed to log question attempt locally:', e);
    }
  }

  return newRecord;
};

/**
 * Standardized telemetry logger for Python Course (Parts 1 - 14)
 */
export const logPythonPartQuestionAttempt = (params: {
  studentEmailOrId: string;
  partNum: number;
  activeSection: { id: string; title: string };
  activeIdx: number;
  activeQuestionIdx: number;
  currentMcq: { id?: string; question: string; correctAnswer: string; options: { id: string; text: string }[]; explanationNote?: string };
  currentBlock?: { heading?: string; codeSnippet?: string };
  optId: string;
  isCorrect: boolean;
  timeSpent: number;
  timeLimitSeconds?: number;
  isRetestAttempt?: boolean;
  attemptNum?: number;
}): QuestionTelemetryRecord => {
  return logQuestionAttempt(params.studentEmailOrId, {
    courseId: 'python-core',
    partNum: params.partNum,
    sectionId: params.activeSection.id,
    sectionTitle: params.activeSection.title,
    subQuestionLabel: `Part ${params.partNum} -> Sec ${params.partNum}.${params.activeIdx + 1} -> Q${params.activeQuestionIdx + 1}`,
    questionIndex: params.activeQuestionIdx + 1,
    questionTitle: params.currentBlock?.heading || `Question ${params.activeQuestionIdx + 1}`,
    questionPrompt: params.currentMcq?.question || params.currentBlock?.heading || '',
    codeSnippet: params.currentBlock?.codeSnippet,
    studentOptionId: params.optId,
    studentAnswer: params.currentMcq?.options.find((o) => o.id === params.optId)?.text || params.optId,
    correctOptionId: params.currentMcq?.correctAnswer || 'A',
    correctAnswer: params.currentMcq?.options.find((o) => o.id === params.currentMcq?.correctAnswer)?.text || 'Correct',
    isCorrect: params.isCorrect,
    timeTakenSeconds: params.timeSpent,
    timeLimitSeconds: params.timeLimitSeconds || 30,
    attemptNumber: params.attemptNum || (params.isRetestAttempt ? 2 : 1),
    isRetest: Boolean(params.isRetestAttempt || (params.attemptNum && params.attemptNum > 1)),
    status: params.isCorrect ? 'passed' : 'failed',
    explanation: params.currentMcq?.explanationNote
  });
};

// In-memory cache of student telemetry records to ensure instant retrieval even after cookie clearing
export const memoryTelemetryCache: Record<string, QuestionTelemetryRecord[]> = {};

/**
 * Hydrates the in-memory cache and localStorage with student telemetry records.
 */
export const setStudentTelemetryInMemory = (studentEmailOrId: string, records: QuestionTelemetryRecord[]) => {
  const cleanEmail = normalizeStudentEmail(studentEmailOrId);
  const memKey = cleanEmail || (studentEmailOrId || '').toLowerCase().trim();
  if (memKey && Array.isArray(records)) {
    memoryTelemetryCache[memKey] = records;
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const key = getStudentTelemetryStorageKey(memKey);
        localStorage.setItem(key, JSON.stringify(records));
      } catch {}
    }
  }
};

/**
 * Completely clears in-memory and local telemetry cache for a student.
 */
export const clearStudentTelemetryInMemory = (studentEmailOrId?: string) => {
  if (!studentEmailOrId) {
    Object.keys(memoryTelemetryCache).forEach((k) => delete memoryTelemetryCache[k]);
    return;
  }
  const cleanEmail = normalizeStudentEmail(studentEmailOrId);
  const memKey = cleanEmail || (studentEmailOrId || '').toLowerCase().trim();
  const emailSafe = cleanEmail ? cleanEmail.replace(/[^a-z0-9_]/g, '_') : '';

  if (memKey && memoryTelemetryCache[memKey]) delete memoryTelemetryCache[memKey];
  if (emailSafe && memoryTelemetryCache[emailSafe]) delete memoryTelemetryCache[emailSafe];
  if (cleanEmail && memoryTelemetryCache[cleanEmail]) delete memoryTelemetryCache[cleanEmail];

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      if (memKey) localStorage.removeItem(getStudentTelemetryStorageKey(memKey));
      if (cleanEmail) localStorage.removeItem(getStudentTelemetryStorageKey(cleanEmail));
      if (emailSafe) localStorage.removeItem(`dopilot_telemetry_${emailSafe}`);
    } catch {}
  }
};

/**
 * Retrieve all logged question attempts for a student.
 * Checks memory cache first, then localStorage.
 */
export const getStudentLoggedTelemetry = (studentEmailOrId: string): QuestionTelemetryRecord[] => {
  const cleanEmail = normalizeStudentEmail(studentEmailOrId);
  const memKey = cleanEmail || (studentEmailOrId || '').toLowerCase().trim();
  if (memKey && memoryTelemetryCache[memKey] && memoryTelemetryCache[memKey].length > 0) {
    return memoryTelemetryCache[memKey];
  }

  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const key = getStudentTelemetryStorageKey(studentEmailOrId);
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        if (memKey) memoryTelemetryCache[memKey] = parsed;
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to read telemetry:', e);
  }
  return [];
};

/**
 * Restores student telemetry records directly from Supabase Cloud (site_content)
 * and hydrates both in-memory cache and localStorage.
 */
export const restoreStudentTelemetryFromCloud = async (
  studentEmailOrId: string
): Promise<QuestionTelemetryRecord[]> => {
  const cleanEmail = normalizeStudentEmail(studentEmailOrId);
  if (!cleanEmail || !isSupabaseConfigured()) {
    return getStudentLoggedTelemetry(studentEmailOrId);
  }

  const docId = `telemetry_${cleanEmail.replace(/[^a-z0-9_]/g, '_')}`;

  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('id', docId)
      .maybeSingle();

    if (error || !data || !data.content || !Array.isArray(data.content)) {
      return getStudentLoggedTelemetry(cleanEmail);
    }

    const cloudRecords = data.content as QuestionTelemetryRecord[];

    // Merge cloud records with local records without duplicating
    const local = getStudentLoggedTelemetry(cleanEmail);
    const mergedMap = new Map<string, QuestionTelemetryRecord>();

    // Cloud records
    cloudRecords.forEach(r => {
      if (r && r.id) mergedMap.set(r.id, r);
    });

    // Local records
    local.forEach(r => {
      if (r && r.id) mergedMap.set(r.id, r);
    });

    const merged = Array.from(mergedMap.values());
    memoryTelemetryCache[cleanEmail] = merged;

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const key = getStudentTelemetryStorageKey(cleanEmail);
        localStorage.setItem(key, JSON.stringify(merged));
      } catch {}
    }

    return merged;
  } catch (err) {
    console.warn('Error fetching student telemetry from cloud:', err);
    return getStudentLoggedTelemetry(cleanEmail);
  }
};

// Import course curriculum sections across all courses
import { PART_1_SECTIONS as PY_1 } from '../data/pythonPart1Data';
import { PART_2_SECTIONS as PY_2 } from '../data/pythonPart2Data';
import { PART_3_SECTIONS as PY_3 } from '../data/pythonPart3Data';
import { PART_4_SECTIONS as PY_4 } from '../data/pythonPart4Data';
import { PART_5_SECTIONS as PY_5 } from '../data/pythonPart5Data';
import { PART_6_SECTIONS as PY_6 } from '../data/pythonPart6Data';
import { PART_7_SECTIONS as PY_7 } from '../data/pythonPart7Data';
import { PART_8_SECTIONS as PY_8 } from '../data/pythonPart8Data';
import { PART_9_SECTIONS as PY_9 } from '../data/pythonPart9Data';
import { PART_10_SECTIONS as PY_10 } from '../data/pythonPart10Data';
import { PART_11_SECTIONS as PY_11 } from '../data/pythonPart11Data';
import { PART_12_SECTIONS as PY_12 } from '../data/pythonPart12Data';
import { PART_13_SECTIONS as PY_13 } from '../data/pythonPart13Data';
import { PART_14_SECTIONS as PY_14 } from '../data/pythonPart14Data';

import { PART_1_SECTIONS as JV_1 } from '../data/javaPart1Data';
import { PART_2_SECTIONS as JV_2 } from '../data/javaPart2Data';
import { PART_3_SECTIONS as JV_3 } from '../data/javaPart3Data';
import { PART_4_SECTIONS as JV_4 } from '../data/javaPart4Data';
import { PART_5_SECTIONS as JV_5 } from '../data/javaPart5Data';
import { PART_6_SECTIONS as JV_6 } from '../data/javaPart6Data';
import { PART_7_SECTIONS as JV_7 } from '../data/javaPart7Data';
import { PART_8_SECTIONS as JV_8 } from '../data/javaPart8Data';
import { PART_9_SECTIONS as JV_9 } from '../data/javaPart9Data';
import { PART_10_SECTIONS as JV_10 } from '../data/javaPart10Data';
import { PART_11_SECTIONS as JV_11 } from '../data/javaPart11Data';
import { PART_12_SECTIONS as JV_12 } from '../data/javaPart12Data';
import { PART_13_SECTIONS as JV_13 } from '../data/javaPart13Data';
import { PART_14_SECTIONS as JV_14 } from '../data/javaPart14Data';

import { FULLSTACK_PART_0_SECTIONS as FS_0 } from '../data/fullstackPart0Data';
import { FULLSTACK_PART_1_SECTIONS as FS_1 } from '../data/fullstackPart1Data';
import { FULLSTACK_PART_2_SECTIONS as FS_2 } from '../data/fullstackPart2Data';
import { FULLSTACK_PART_3_SECTIONS as FS_3 } from '../data/fullstackPart3Data';
import { FULLSTACK_PART_4_SECTIONS as FS_4 } from '../data/fullstackPart4Data';
import { FULLSTACK_PART_5_SECTIONS as FS_5 } from '../data/fullstackPart5Data';
import { FULLSTACK_PART_6_SECTIONS as FS_6 } from '../data/fullstackPart6Data';
import { FULLSTACK_PART_7_SECTIONS as FS_7 } from '../data/fullstackPart7Data';
import { FULLSTACK_PART_8_SECTIONS as FS_8 } from '../data/fullstackPart8Data';
import { FULLSTACK_PART_9_SECTIONS as FS_9 } from '../data/fullstackPart9Data';
import { FULLSTACK_PART_10_SECTIONS as FS_10 } from '../data/fullstackPart10Data';
import { FULLSTACK_PART_11_SECTIONS as FS_11 } from '../data/fullstackPart11Data';
import { FULLSTACK_PART_12_SECTIONS as FS_12 } from '../data/fullstackPart12Data';
import { FULLSTACK_PART_13_SECTIONS as FS_13 } from '../data/fullstackPart13Data';

import { CYBER_SECURITY_PARTS } from '../data/cyberSecurityData';

export interface CourseCurriculumQuestion {
  courseId: string;
  partNum: number;
  sectionId: string;
  sectionIndex: number;
  sectionTitle: string;
  questionIndex: number;
  subQuestionLabel: string; // e.g. "Part 1 -> Sec 1.1 -> Q1"
  taskId: string;
  candidateTaskKeys: string[];
  questionTitle: string;
  questionPrompt: string;
  codeSnippet?: string;
  correctOptionId: string;
  correctAnswer: string;
  options: { id: string; text: string }[];
  explanation?: string;
}

/**
 * Returns the exact curriculum questions array for any course
 */
export const getCourseCurriculumQuestions = (courseId: string): CourseCurriculumQuestion[] => {
  const norm = (courseId || '').toLowerCase();
  const result: CourseCurriculumQuestion[] = [];

  if (norm.includes('java')) {
    const parts = [
      { part: 1, sections: JV_1 },
      { part: 2, sections: JV_2 },
      { part: 3, sections: JV_3 },
      { part: 4, sections: JV_4 },
      { part: 5, sections: JV_5 },
      { part: 6, sections: JV_6 },
      { part: 7, sections: JV_7 },
      { part: 8, sections: JV_8 },
      { part: 9, sections: JV_9 },
      { part: 10, sections: JV_10 },
      { part: 11, sections: JV_11 },
      { part: 12, sections: JV_12 },
      { part: 13, sections: JV_13 },
      { part: 14, sections: JV_14 }
    ];

    parts.forEach(({ part, sections }) => {
      sections.forEach((sec, sIdx) => {
        sec.theoryBlocks.forEach((tb, qIdx) => {
          const mcq = tb.mcq;
          if (!mcq) return;
          const qId = mcq.id || `${qIdx}`;
          const qNum = qIdx + 1;
          const candidateKeys = [
            `java-${sec.id}-${qId}`,
            `java-${sec.id}-${qIdx}`,
            `java-part${part}-${sec.id}-${qId}`,
            `java-part${part}-${sec.id}-${qIdx}`
          ];
          const correctOpt = mcq.options?.find(o => o.id === mcq.correctAnswer);

          result.push({
            courseId: 'java-core',
            partNum: part,
            sectionId: sec.id,
            sectionIndex: sIdx + 1,
            sectionTitle: sec.title || `Section ${part}.${sIdx + 1}`,
            questionIndex: qNum,
            subQuestionLabel: `Part ${part} -> Sec ${part}.${sIdx + 1} -> Q${qNum}`,
            taskId: candidateKeys[0],
            candidateTaskKeys: candidateKeys,
            questionTitle: tb.heading || `Question ${qNum}`,
            questionPrompt: mcq.question,
            codeSnippet: tb.codeSnippet,
            correctOptionId: mcq.correctAnswer || 'A',
            correctAnswer: correctOpt?.text || 'Correct option',
            options: mcq.options || [],
            explanation: mcq.explanationNote || ''
          });
        });
      });
    });

  } else if (norm.includes('fullstack')) {
    const parts = [
      { part: 0, sections: FS_0 },
      { part: 1, sections: FS_1 },
      { part: 2, sections: FS_2 },
      { part: 3, sections: FS_3 },
      { part: 4, sections: FS_4 },
      { part: 5, sections: FS_5 },
      { part: 6, sections: FS_6 },
      { part: 7, sections: FS_7 },
      { part: 8, sections: FS_8 },
      { part: 9, sections: FS_9 },
      { part: 10, sections: FS_10 },
      { part: 11, sections: FS_11 },
      { part: 12, sections: FS_12 },
      { part: 13, sections: FS_13 }
    ];

    parts.forEach(({ part, sections }) => {
      sections.forEach((sec, sIdx) => {
        sec.theoryBlocks.forEach((tb, qIdx) => {
          const mcq = tb.mcq;
          if (!mcq) return;
          const qId = mcq.id || `${qIdx}`;
          const qNum = qIdx + 1;
          const candidateKeys = [
            `fullstack-${sec.id}-${qId}`,
            `fullstack-${sec.id}-${qIdx}`,
            `fs-p${part}-${sec.id}-${qId}`,
            `fs-p${part}-${sec.id}-${qIdx}`
          ];
          const correctOpt = mcq.options?.find(o => o.id === mcq.correctAnswer);

          result.push({
            courseId: 'fullstack-open',
            partNum: part,
            sectionId: sec.id,
            sectionIndex: sIdx + 1,
            sectionTitle: sec.title || `Section ${part}.${sIdx + 1}`,
            questionIndex: qNum,
            subQuestionLabel: `Part ${part} -> Sec ${part}.${sIdx + 1} -> Q${qNum}`,
            taskId: candidateKeys[0],
            candidateTaskKeys: candidateKeys,
            questionTitle: tb.heading || `Question ${qNum}`,
            questionPrompt: mcq.question,
            codeSnippet: tb.codeSnippet,
            correctOptionId: mcq.correctAnswer || 'A',
            correctAnswer: correctOpt?.text || 'Correct option',
            options: mcq.options || [],
            explanation: mcq.explanationNote || ''
          });
        });
      });
    });

  } else if (norm.includes('cyber')) {
    CYBER_SECURITY_PARTS.forEach((partObj, idx) => {
      const part = partObj.partNumber || (idx + 1);
      partObj.sections.forEach((sec, sIdx) => {
        sec.theoryBlocks.forEach((tb, qIdx) => {
          const mcq = tb.mcq;
          if (!mcq) return;
          const qId = mcq.id || `${qIdx}`;
          const qNum = qIdx + 1;
          const candidateKeys = [
            `cyber-${sec.id}-${qId}`,
            `cyber-${sec.id}-${qIdx}`,
            `cyber-p${part}-${sec.id}-${qId}`,
            `cyber-p${part}-${sec.id}-${qIdx}`
          ];
          const correctOpt = mcq.options?.find(o => o.id === mcq.correctAnswer);

          result.push({
            courseId: 'cyber-security',
            partNum: part,
            sectionId: sec.id,
            sectionIndex: sIdx + 1,
            sectionTitle: sec.title || `Section ${part}.${sIdx + 1}`,
            questionIndex: qNum,
            subQuestionLabel: `Part ${part} -> Sec ${part}.${sIdx + 1} -> Q${qNum}`,
            taskId: candidateKeys[0],
            candidateTaskKeys: candidateKeys,
            questionTitle: tb.heading || `Question ${qNum}`,
            questionPrompt: mcq.question,
            codeSnippet: tb.codeSnippet,
            correctOptionId: mcq.correctAnswer || 'A',
            correctAnswer: correctOpt?.text || 'Correct option',
            options: mcq.options || [],
            explanation: mcq.explanationNote || ''
          });
        });
      });
    });

  } else {
    // Default to Python Core
    const parts = [
      { part: 1, sections: PY_1 },
      { part: 2, sections: PY_2 },
      { part: 3, sections: PY_3 },
      { part: 4, sections: PY_4 },
      { part: 5, sections: PY_5 },
      { part: 6, sections: PY_6 },
      { part: 7, sections: PY_7 },
      { part: 8, sections: PY_8 },
      { part: 9, sections: PY_9 },
      { part: 10, sections: PY_10 },
      { part: 11, sections: PY_11 },
      { part: 12, sections: PY_12 },
      { part: 13, sections: PY_13 },
      { part: 14, sections: PY_14 }
    ];

    parts.forEach(({ part, sections }) => {
      sections.forEach((sec, sIdx) => {
        sec.theoryBlocks.forEach((tb, qIdx) => {
          const mcq = tb.mcq;
          if (!mcq) return;
          const qId = mcq.id || `${qIdx}`;
          const qNum = qIdx + 1;
          const candidateKeys = [
            `${sec.id}-${qId}`,
            `${sec.id}-${qIdx}`,
            `python-${sec.id}-${qId}`,
            `python-${sec.id}-${qIdx}`,
            `part${part}-${sec.id}-${qId}`
          ];
          const correctOpt = mcq.options?.find(o => o.id === mcq.correctAnswer);

          result.push({
            courseId: 'python-core',
            partNum: part,
            sectionId: sec.id,
            sectionIndex: sIdx + 1,
            sectionTitle: sec.title || `Section ${part}.${sIdx + 1}`,
            questionIndex: qNum,
            subQuestionLabel: `Part ${part} -> Sec ${part}.${sIdx + 1} -> Q${qNum}`,
            taskId: candidateKeys[0],
            candidateTaskKeys: candidateKeys,
            questionTitle: tb.heading || `Question ${qNum}`,
            questionPrompt: mcq.question,
            codeSnippet: tb.codeSnippet,
            correctOptionId: mcq.correctAnswer || 'A',
            correctAnswer: correctOpt?.text || 'Correct option',
            options: mcq.options || [],
            explanation: mcq.explanationNote || ''
          });
        });
      });
    });
  }

  return result;
};

/**
 * Reconstructs accurate question-level attempts for a student without fabricating unattempted questions.
 * Preserves exact student activity flow: Part-wise, Section-wise, and Question-wise.
 */
export const buildStudentActivitySequence = (
  student: any,
  courseId: string
): QuestionTelemetryRecord[] => {
  const email = (student.email || '').toLowerCase().trim();
  const id = (student.id || '').trim();
  const cleanEmail = normalizeStudentEmail(email);
  const loggedAttempts = getStudentLoggedTelemetry(email || id);

  const targetNorm = (courseId || '').toLowerCase().trim().replace(/[\s_-]+/g, '');
  const isTargetAll = !courseId || courseId === 'all';

  // 1. Get explicit logged attempts for the requested course
  const matchingLogged = loggedAttempts.filter((a) => {
    if (isTargetAll) return true;
    const aNorm = (a.courseId || '').toLowerCase().trim().replace(/[\s_-]+/g, '');
    if (targetNorm.includes('python') && aNorm.includes('python')) return true;
    if (targetNorm.includes('java') && aNorm.includes('java')) return true;
    if (targetNorm.includes('fullstack') && aNorm.includes('fullstack')) return true;
    if (targetNorm.includes('cyber') && aNorm.includes('cyber')) return true;
    return a.courseId === courseId || aNorm === targetNorm;
  });

  // Track which (partNum, sectionId, questionIndex) already have logged attempts
  const loggedKeys = new Set<string>();
  matchingLogged.forEach((att) => {
    loggedKeys.add(`${att.partNum}-${att.sectionId}-${att.questionIndex}`);
    loggedKeys.add(`${att.courseId}-${att.partNum}-${att.sectionId}-${att.questionIndex}`);
  });

  // 2. Collect authentic student answers from in-memory / cloud course state across parts
  let answers: Record<string, string> = {};
  const norm = courseId.toLowerCase();

  // A. From in-memory / cloud course state
  if (cleanEmail && memoryCourseState[cleanEmail]?.courses) {
    const studentCourses = memoryCourseState[cleanEmail].courses;
    Object.entries(studentCourses).forEach(([cKey, cVal]) => {
      const cNorm = cKey.toLowerCase();
      const isMatch = isTargetAll ||
        (norm.includes('java') && cNorm.includes('java')) ||
        (norm.includes('fullstack') && cNorm.includes('fullstack')) ||
        (norm.includes('cyber') && cNorm.includes('cyber')) ||
        (!norm.includes('java') && !norm.includes('fullstack') && !norm.includes('cyber') && !cNorm.includes('java') && !cNorm.includes('fullstack') && !cNorm.includes('cyber'));

      if (isMatch && cVal.parts) {
        Object.values(cVal.parts).forEach((partState) => {
          if (partState.selectedAnswers) {
            answers = { ...answers, ...partState.selectedAnswers };
          }
        });
      }
    });
  }

  // B. From student object if passed directly
  if (student.courses && typeof student.courses === 'object') {
    Object.entries(student.courses).forEach(([cKey, cVal]: [string, any]) => {
      const cNorm = cKey.toLowerCase();
      const isMatch = isTargetAll ||
        (norm.includes('java') && cNorm.includes('java')) ||
        (norm.includes('fullstack') && cNorm.includes('fullstack')) ||
        (norm.includes('cyber') && cNorm.includes('cyber')) ||
        (!norm.includes('java') && !norm.includes('fullstack') && !norm.includes('cyber') && !cNorm.includes('java') && !cNorm.includes('fullstack') && !cNorm.includes('cyber'));

      if (isMatch && cVal && cVal.parts) {
        Object.values(cVal.parts).forEach((partState: any) => {
          if (partState?.selectedAnswers) {
            answers = { ...answers, ...partState.selectedAnswers };
          }
        });
      }
    });
  }

  // C. Also check localStorage ONLY if the inspected student is the current active local student session
  try {
    const sessionRaw = localStorage.getItem('dopilot_student_session_v1');
    let isCurrentStudentSession = false;
    if (sessionRaw) {
      const sess = JSON.parse(sessionRaw);
      const sessEmail = (sess.email || '').toLowerCase().trim();
      const sessId = (sess.id || '').trim();
      if ((cleanEmail && sessEmail === cleanEmail) || (id && sessId === id)) {
        isCurrentStudentSession = true;
      }
    }

    if (isCurrentStudentSession) {
      for (let p = 0; p <= 14; p++) {
        let key = '';
        if (norm.includes('java')) {
          key = p <= 1 ? 'dopilot_java_mcq_answers' : `dopilot_java_part${p}_mcq_answers`;
        } else if (norm.includes('fullstack')) {
          key = `dopilot_fullstack_part${p}_mcq_answers`;
        } else if (norm.includes('cyber')) {
          key = `dopilot_cyber_part${p}_mcq_answers`;
        } else {
          key = p <= 1 ? 'dopilot_mcq_answers_v2' : `dopilot_part${p}_mcq_answers_v2`;
        }
        const raw = localStorage.getItem(key);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            answers = { ...answers, ...parsed };
          } catch {}
        }
      }
    }
  } catch {}

  // 3. For any answered question in curriculum that does not have an explicit logged attempt, reconstruct it
  const curriculum = getCourseCurriculumQuestions(courseId);
  const reconstructed: QuestionTelemetryRecord[] = [];
  const wrongList: any[] = Array.isArray(student.wrongAttempts) ? student.wrongAttempts : [];

  curriculum.forEach((q) => {
    const qKey = `${q.partNum}-${q.sectionId}-${q.questionIndex}`;
    // If already recorded in explicit logged telemetry, DO NOT duplicate!
    if (loggedKeys.has(qKey)) return;

    let chosenOption: string | undefined = undefined;
    for (const k of q.candidateTaskKeys) {
      if (answers[k]) {
        chosenOption = answers[k];
        break;
      }
    }

    // Also check generic taskId format
    if (!chosenOption) {
      const altKey = Object.keys(answers).find((k) =>
        (k.startsWith(`${q.sectionId}-`) || k.includes(q.sectionId)) &&
        (
          k.endsWith(`-${q.questionIndex - 1}`) ||
          k.includes(`-${q.questionIndex - 1}-v`) ||
          k.includes(`.${q.questionIndex - 1}-v`) ||
          k.endsWith(`-${q.questionIndex}`) ||
          k.includes(`-${q.questionIndex}-v`) ||
          k.includes(`.${q.questionIndex}-v`)
        )
      );
      if (altKey) chosenOption = answers[altKey];
    }

    const matchingWrong = wrongList.find((w) =>
      w.taskTitle?.toLowerCase().includes(q.questionTitle.toLowerCase()) ||
      w.detail?.toLowerCase().includes(q.questionTitle.toLowerCase()) ||
      (w.section && q.sectionTitle && w.section.toLowerCase().includes(q.sectionTitle.toLowerCase()))
    );

    // CRITICAL REQUIREMENT: Do NOT display future questions, sections, or progress that the student has not attempted!
    if (!chosenOption && !matchingWrong) {
      return;
    }

    const isCorrect = chosenOption === q.correctOptionId && !matchingWrong;
    const finalChosenOpt = chosenOption || (matchingWrong ? (matchingWrong.detail?.match(/Option ([A-D])/)?.[1] || 'B') : q.correctOptionId);
    const chosenOptObj = q.options.find((o) => o.id === finalChosenOpt);

    reconstructed.push({
      id: `${q.courseId}-p${q.partNum}-${q.sectionId}-q${q.questionIndex}`,
      courseId: q.courseId,
      partNum: q.partNum,
      sectionId: q.sectionId,
      sectionTitle: q.sectionTitle,
      subQuestionLabel: q.subQuestionLabel,
      questionIndex: q.questionIndex,
      questionTitle: q.questionTitle,
      questionPrompt: q.questionPrompt,
      codeSnippet: q.codeSnippet,
      studentOptionId: finalChosenOpt,
      studentAnswer: chosenOptObj?.text || (isCorrect ? q.correctAnswer : 'Incorrect Answer Submitted'),
      correctOptionId: q.correctOptionId,
      correctAnswer: q.correctAnswer,
      isCorrect,
      timeTakenSeconds: 0, // 0 signifies historical answer reconstructed from persistent state
      timeLimitSeconds: 30,
      attemptNumber: 1,
      isRetest: false,
      attemptedAt: student.createdAt || new Date().toISOString(),
      speedCategory: 'normal',
      status: isCorrect ? 'passed' : 'failed',
      explanation: q.explanation
    });
  });

  // Combine logged attempts and reconstructed answers
  const combined = [...matchingLogged, ...reconstructed];

  // Sort strictly by Part -> Section -> Attempt (Originals first, Retests second) -> Question
  return combined.sort((a, b) => {
    if (a.partNum !== b.partNum) return a.partNum - b.partNum;
    if (a.sectionId !== b.sectionId) {
      const sA = parseFloat((a.subQuestionLabel || a.sectionId).match(/([0-9.]+)/)?.[1] || '0');
      const sB = parseFloat((b.subQuestionLabel || b.sectionId).match(/([0-9.]+)/)?.[1] || '0');
      if (sA !== sB) return sA - sB;
      return a.sectionId.localeCompare(b.sectionId);
    }
    const attA = a.attemptNumber || (a.isRetest ? 2 : 1);
    const attB = b.attemptNumber || (b.isRetest ? 2 : 1);
    if (attA !== attB) return attA - attB;
    return a.questionIndex - b.questionIndex;
  });
};
