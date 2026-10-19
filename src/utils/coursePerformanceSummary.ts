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

export interface CourseOverallSummary {
  courseId: string;
  courseTitle: string;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  failedCount: number;
  marksEarned: number;
  maxMarks: number;
  percentage: number;
  performanceLabel: string;
}

export const getCourseOverallSummary = (courseId: string): CourseOverallSummary => {
  const norm = (courseId || '').toLowerCase();

  let courseTitle = 'Complete Python Course';
  let totalQuestions = 0;
  let answeredCount = 0;
  let correctCount = 0;

  if (norm.includes('python')) {
    courseTitle = 'Complete Python Course';
    const pyParts = [
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

    pyParts.forEach(({ part, sections }) => {
      let answers: Record<string, string> = {};
      try {
        const raw = part === 1
          ? (localStorage.getItem('dopilot_mcq_answers_v2') || localStorage.getItem('dopilot_python_mcq_answers'))
          : (localStorage.getItem(`dopilot_part${part}_mcq_answers_v2`) || localStorage.getItem(`dopilot_part${part}_mcq_answers`));
        if (raw) answers = JSON.parse(raw);
      } catch {}

      sections.forEach(sec => {
        sec.theoryBlocks.forEach((tb, qIdx) => {
          totalQuestions += 1;
          const q = tb.mcq;
          const taskId = `${sec.id}-${q?.id || qIdx}`;
          const choice = answers[taskId];

          if (choice) {
            answeredCount += 1;
            if (q && choice === q.correctAnswer) {
              correctCount += 1;
            }
          }
        });
      });
    });

  } else if (norm.includes('java')) {
    courseTitle = 'Complete Java Course';
    const jvParts = [
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

    jvParts.forEach(({ part, sections }) => {
      let answers: Record<string, string> = {};
      try {
        const raw = part === 1
          ? (localStorage.getItem('dopilot_java_mcq_answers') || localStorage.getItem('dopilot_java_part1_mcq_answers'))
          : localStorage.getItem(`dopilot_java_part${part}_mcq_answers`);
        if (raw) answers = JSON.parse(raw);
      } catch {}

      sections.forEach(sec => {
        sec.theoryBlocks.forEach((tb, qIdx) => {
          totalQuestions += 1;
          const q = tb.mcq;
          const taskId = part === 1
            ? `java-${sec.id}-${q?.id || qIdx}`
            : `java-part${part}-${sec.id}-${q?.id || qIdx}`;
          const choice = answers[taskId];

          if (choice) {
            answeredCount += 1;
            if (q && choice === q.correctAnswer) {
              correctCount += 1;
            }
          }
        });
      });
    });

  } else if (norm.includes('fullstack')) {
    courseTitle = 'Full Stack Open Course';
    const fsParts = [
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

    fsParts.forEach(({ part, sections }) => {
      let answers: Record<string, string> = {};
      try {
        const raw = localStorage.getItem(`dopilot_fullstack_part${part}_mcq_answers`);
        if (raw) answers = JSON.parse(raw);
      } catch {}

      sections.forEach(sec => {
        sec.theoryBlocks.forEach((tb, qIdx) => {
          totalQuestions += 1;
          const q = tb.mcq;
          const taskId = part === 0
            ? `fs-p0-${sec.id}-${q?.id || qIdx}`
            : part === 1
            ? `fullstack-${sec.id}-${q?.id || qIdx}`
            : `fs-p${part}-${sec.id}-${q?.id || qIdx}`;
          const choice = answers[taskId];

          if (choice) {
            answeredCount += 1;
            if (q && choice === q.correctAnswer) {
              correctCount += 1;
            }
          }
        });
      });
    });

  } else {
    // Cyber Security
    courseTitle = 'Cyber Security Course';
    CYBER_SECURITY_PARTS.forEach((partObj, idx) => {
      const partNum = partObj.partNumber || (idx + 1);
      let answers: Record<string, string> = {};
      try {
        const raw = localStorage.getItem(`dopilot_cyber_part${partNum}_mcq_answers`);
        if (raw) answers = JSON.parse(raw);
      } catch {}

      partObj.sections.forEach(sec => {
        sec.theoryBlocks.forEach((tb, qIdx) => {
          totalQuestions += 1;
          const q = tb.mcq;
          const taskId = partNum === 1
            ? `cyber-${sec.id}-${q?.id || qIdx}`
            : `cyber-p${partNum}-${sec.id}-${q?.id || qIdx}`;
          const choice = answers[taskId];

          if (choice) {
            answeredCount += 1;
            if (q && choice === q.correctAnswer) {
              correctCount += 1;
            }
          }
        });
      });
    });
  }

  // Failed answers: questions answered incorrectly + skipped / unanswered questions
  const failedCount = Math.max(0, totalQuestions - correctCount);
  const maxMarks = totalQuestions;
  const marksEarned = correctCount;
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  let performanceLabel = 'Course Completed';
  if (percentage >= 95) {
    performanceLabel = 'Distinction with Honors';
  } else if (percentage >= 90) {
    performanceLabel = 'Outstanding Mastery';
  } else if (percentage >= 80) {
    performanceLabel = 'Mastery Certified';
  } else if (percentage >= 70) {
    performanceLabel = 'Proficient';
  }

  return {
    courseId,
    courseTitle,
    totalQuestions,
    answeredCount,
    correctCount,
    failedCount,
    marksEarned,
    maxMarks,
    percentage,
    performanceLabel
  };
};
