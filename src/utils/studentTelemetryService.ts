import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { normalizeStudentEmail, memoryCourseState } from './courseProgressSyncService';

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

        // Sync to cloud site_content under student telemetry document
        if (studentEmailOrId.includes('@') && isSupabaseConfigured()) {
          const cleanEmail = normalizeStudentEmail(studentEmailOrId);
          const docId = `telemetry_${cleanEmail.replace(/[^a-z0-9_]/g, '_')}`;
          Promise.resolve(
            supabase.from('site_content').upsert({
              id: docId,
              content: list,
              updated_at: new Date().toISOString()
            })
          ).catch(() => {});
        }
      }
    } catch (e) {
      console.warn('Failed to log question attempt locally:', e);
    }
  }

  return newRecord;
};

// In-memory cache of student telemetry records to ensure instant retrieval even after cookie clearing
export const memoryTelemetryCache: Record<string, QuestionTelemetryRecord[]> = {};

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
            `java-part${part}-${sec.id}-${qIdx}`,
            `${sec.id}-${qId}`,
            `${sec.id}-${qIdx}`
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
            `fs-p${part}-${sec.id}-${qIdx}`,
            `${sec.id}-${qId}`,
            `${sec.id}-${qIdx}`
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
            `cyber-p${part}-${sec.id}-${qIdx}`,
            `${sec.id}-${qId}`,
            `${sec.id}-${qIdx}`
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
 * Reconstructs accurate question-level attempts for a student without fabricating unattempted questions
 */
export const buildStudentActivitySequence = (
  student: any,
  courseId: string
): QuestionTelemetryRecord[] => {
  const email = (student.email || '').toLowerCase().trim();
  const id = (student.id || '').trim();
  const loggedAttempts = getStudentLoggedTelemetry(email || id);

  // If we have explicit logged telemetry for this course, return it sorted by attemptedAt
  if (loggedAttempts.length > 0) {
    const matching = loggedAttempts.filter(
      (a) => a.courseId === courseId || courseId === 'all'
    );
    if (matching.length > 0) {
      return matching.sort(
        (a, b) => new Date(a.attemptedAt).getTime() - new Date(b.attemptedAt).getTime()
      );
    }
  }

  // Otherwise, reconstruct from saved answers & progress dictionaries
  const curriculum = getCourseCurriculumQuestions(courseId);
  const result: QuestionTelemetryRecord[] = [];

  // Determine user answers across parts
  let answers: Record<string, string> = {};
  const norm = courseId.toLowerCase();

  // 1. Read answers from in-memory / cloud course state if available for this student
  const cleanEmail = normalizeStudentEmail(email);
  if (cleanEmail && memoryCourseState[cleanEmail]?.courses) {
    const studentCourses = memoryCourseState[cleanEmail].courses;
    // Find matching course or search all courses
    Object.entries(studentCourses).forEach(([cKey, cVal]) => {
      const cNorm = cKey.toLowerCase();
      const isMatch = norm === 'all' ||
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

  // 2. Also check localStorage for locally saved answers
  try {
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
  } catch {}

  // Check wrong attempts on file
  const wrongList: any[] = Array.isArray(student.wrongAttempts) ? student.wrongAttempts : [];

  // Iterate over curriculum questions in exact chronological order:
  // Part -> Section -> Question
  curriculum.forEach((q) => {
    let chosenOption: string | undefined = undefined;
    for (const k of q.candidateTaskKeys) {
      if (answers[k]) {
        chosenOption = answers[k];
        break;
      }
    }

    const matchingWrong = wrongList.find((w) =>
      w.taskTitle?.toLowerCase().includes(q.questionTitle.toLowerCase()) ||
      w.detail?.toLowerCase().includes(q.questionTitle.toLowerCase()) ||
      (w.section && q.sectionTitle && w.section.toLowerCase().includes(q.sectionTitle.toLowerCase()))
    );

    // If never answered and no wrong attempt recorded, do NOT fabricate!
    if (!chosenOption && !matchingWrong) {
      return;
    }

    const isCorrect = chosenOption === q.correctOptionId && !matchingWrong;
    const finalChosenOpt = chosenOption || (matchingWrong ? (matchingWrong.detail?.match(/Option ([A-D])/)?.[1] || 'B') : q.correctOptionId);
    const chosenOptObj = q.options.find((o) => o.id === finalChosenOpt);

    result.push({
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
      timeTakenSeconds: 0, // 0 signifies answer was recorded without timing log
      timeLimitSeconds: 30,
      attemptNumber: 1,
      isRetest: false,
      attemptedAt: student.createdAt || new Date().toISOString(),
      speedCategory: 'normal',
      status: isCorrect ? 'passed' : 'failed',
      explanation: q.explanation
    });
  });

  return result;
};
