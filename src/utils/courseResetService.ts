import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { normalizeStudentEmail, getStudentDocId, memoryCourseState } from './courseProgressSyncService';
import { clearPythonPartIntroRequired } from './pythonPartIntro';

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
  failedSectionId?: string;
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
  unlockedLocation?: string;
  continuationSection?: string;
}

export const LOCKED_COURSES_STORAGE_KEY = 'dopilot_locked_courses_registry_v1';
export const COURSE_RESETS_AUDIT_KEY = 'dopilot_course_resets_audit_v1';
export const CLOUD_LOCKED_COURSES_ID = 'dopilot_locked_courses_registry_v1';
export const CLOUD_COURSE_RESETS_AUDIT_ID = 'dopilot_course_resets_audit_v1';

export interface PythonSectionMeta {
  id: string;
  number: string;
  title: string;
}

/**
 * Authoritative Section Catalog for Python Course (Parts 1 - 14)
 * Used to resolve exact failure titles and compute exact next-section continuation upon unlock.
 */
export const PYTHON_SECTIONS_CATALOG: Record<number, PythonSectionMeta[]> = {
  1: [
    { id: '1-1-getting-started', number: '1.1', title: 'Getting Started & The Print Command' },
    { id: '1-2-user-input', number: '1.2', title: 'Information from the User' },
    { id: '1-3-variables-types', number: '1.3', title: 'More About Variables & Data Types' },
    { id: '1-4-arithmetic', number: '1.4', title: 'Arithmetic Operations & Calculations' },
    { id: '1-5-conditionals', number: '1.5', title: 'Conditional Statements & Logic' }
  ],
  2: [
    { id: '2-1-terminology', number: '2.1', title: 'Programming Terminology' },
    { id: '2-2-more-conditionals', number: '2.2', title: 'More Conditionals & Nested Logic' },
    { id: '2-3-combining-conditions', number: '2.3', title: 'Combining Conditions with Logical Operators' },
    { id: '2-4-simple-loops', number: '2.4', title: 'Simple Loops & while Statements' }
  ],
  3: [
    { id: '3-1-loops-with-conditions', number: '3.1', title: 'Loops with Conditions' },
    { id: '3-2-strings', number: '3.2', title: 'Working with Strings' },
    { id: '3-3-more-loops', number: '3.3', title: 'More Loops & Nested Iteration' },
    { id: '3-4-functions', number: '3.4', title: 'Defining Functions' }
  ],
  4: [
    { id: '4-1-developer-tools', number: '4.1', title: 'Developer Tools & Debugging' },
    { id: '4-2-more-functions', number: '4.2', title: 'More Functions' },
    { id: '4-3-lists', number: '4.3', title: 'Lists: Creation & Methods' },
    { id: '4-4-definite-iteration', number: '4.4', title: 'Definite Iteration with For Loops' },
    { id: '4-5-formatting', number: '4.5', title: 'Print Formatting & F-Strings' },
    { id: '4-6-strings-and-lists', number: '4.6', title: 'Working with Strings and Lists Together' }
  ],
  5: [
    { id: '5-1-more-lists-and-matrices', number: '5.1', title: 'More Lists & 2D Matrices' },
    { id: '5-2-references-and-memory', number: '5.2', title: 'References & Memory Mechanics' },
    { id: '5-3-dictionary-basics', number: '5.3', title: 'Dictionary Fundamentals' },
    { id: '5-4-tuples-and-complex-structures', number: '5.4', title: 'Tuples & Complex Data Structures' }
  ],
  6: [
    { id: '6-1-reading-files', number: '6.1', title: 'Reading Files' },
    { id: '6-2-writing-files', number: '6.2', title: 'Writing Files' },
    { id: '6-3-handling-errors', number: '6.3', title: 'Handling Errors & Exceptions' }
  ],
  7: [
    { id: '7-1-modules', number: '7.1', title: 'Modules & Namespaces' },
    { id: '7-2-randomness', number: '7.2', title: 'Randomness & Probabilities' },
    { id: '7-3-times-and-dates', number: '7.3', title: 'Times and Dates' },
    { id: '7-4-data-processing', number: '7.4', title: 'Data Processing & JSON' },
    { id: '7-5-creating-modules', number: '7.5', title: 'Creating Your Own Modules' },
    { id: '7-6-more-features', number: '7.6', title: 'More Python Features' }
  ],
  8: [
    { id: '8-1-objects-and-methods', number: '8.1', title: 'Objects & Methods' },
    { id: '8-2-classes-and-instances', number: '8.2', title: 'Classes & Object Instances' },
    { id: '8-3-constructors-init', number: '8.3', title: 'Constructors & __init__' },
    { id: '8-4-methods-and-self', number: '8.4', title: 'Defining Methods & self' },
    { id: '8-5-str-and-repr', number: '8.5', title: 'String Representations (__str__ & __repr__)' },
    { id: '8-6-classes-in-practice', number: '8.6', title: 'Classes in Practice & State' }
  ],
  9: [
    { id: '9-1-memory-references', number: '9.1', title: 'Objects & Memory References' },
    { id: '9-2-composition-objects-as-attributes', number: '9.2', title: 'Objects as Attributes (Composition)' },
    { id: '9-3-encapsulation-data-protection', number: '9.3', title: 'Encapsulation & Data Protection' },
    { id: '9-4-properties-getters-setters', number: '9.4', title: 'Properties (Getters & Setters)' },
    { id: '9-5-class-vs-instance-attributes', number: '9.5', title: 'Class vs Instance Attributes' },
    { id: '9-6-scope-methods-class-design', number: '9.6', title: 'Scope of Methods & Class Design' }
  ],
  10: [
    { id: '10-1-class-hierarchies-inheritance', number: '10.1', title: 'Class Hierarchies & Inheritance' },
    { id: '10-2-super-and-constructors', number: '10.2', title: 'The super() Function & Constructors' },
    { id: '10-3-method-overriding-extension', number: '10.3', title: 'Method Overriding & Extension' },
    { id: '10-4-polymorphism-duck-typing', number: '10.4', title: 'Polymorphism & Duck Typing' },
    { id: '10-5-abstract-base-classes', number: '10.5', title: 'Abstract Base Classes (ABCs)' },
    { id: '10-6-larger-modular-applications', number: '10.6', title: 'Modular OOP Application Architecture' }
  ],
  11: [
    { id: '11-1-list-comprehensions', number: '11.1', title: 'List Comprehensions & Concise Syntax' },
    { id: '11-2-more-comprehensions', number: '11.2', title: 'More Comprehensions (Dicts, Sets & Generators)' },
    { id: '11-3-recursion-fundamentals', number: '11.3', title: 'Recursion Fundamentals & Call Stack' },
    { id: '11-4-practical-recursion-data-structures', number: '11.4', title: 'Practical Recursion & Data Structures' }
  ],
  12: [
    { id: '12-1-functions-as-arguments', number: '12.1', title: 'Functions as First-Class Citizens' },
    { id: '12-2-generators-and-iterators', number: '12.2', title: 'Generators & the \'yield\' Keyword' },
    { id: '12-3-functional-programming-lambda', number: '12.3', title: 'Functional Programming (map, filter, lambda)' },
    { id: '12-4-regular-expressions', number: '12.4', title: 'Regular Expressions & Pattern Matching' }
  ],
  13: [
    { id: '13-1-pygame-window-game-loop', number: '13.1', title: 'Pygame Setup & The Central Game Loop' },
    { id: '13-2-rendering-graphics-animation', number: '13.2', title: 'Drawing Shapes, Images & Animation' },
    { id: '13-3-keyboard-mouse-events', number: '13.3', title: 'Keyboard & Mouse Input Handling' },
    { id: '13-4-movement-mechanics-collision', number: '13.4', title: 'Movement Mechanics & Collision Physics' }
  ],
  14: [
    { id: '14-1-game-architecture-setup', number: '14.1', title: 'Game Architecture & OOP Design' },
    { id: '14-2-robot-obstacles-mechanics', number: '14.2', title: 'Player Control, Obstacles & Movement Physics' },
    { id: '14-3-collision-rules-scoring', number: '14.3', title: 'Win/Loss Rules, Health & Persistence' },
    { id: '14-4-custom-game-project', number: '14.4', title: 'Game Polish, Optimization & Capstone Synthesis' }
  ]
};

/**
 * Format a human-friendly section label, e.g. "Section 8.3: Constructors & __init__"
 */
export const formatPythonSectionLabel = (partNum: number, sectionIdentifier?: string): string => {
  if (!sectionIdentifier) return `Section ${partNum}.1`;
  const clean = sectionIdentifier.trim();
  const catalog = PYTHON_SECTIONS_CATALOG[partNum] || [];

  const found = catalog.find(
    (s) =>
      s.id.toLowerCase() === clean.toLowerCase() ||
      s.number === clean ||
      clean.toLowerCase().includes(s.id.toLowerCase()) ||
      clean.includes(`Section ${s.number}`) ||
      clean.includes(`Level ${s.number}`)
  );

  if (found) {
    return `Section ${found.number}: ${found.title}`;
  }

  if (clean.includes(':')) {
    return clean;
  }

  const matchNum = clean.match(/(\d+\.\d+)/);
  if (matchNum) {
    const numFound = catalog.find((s) => s.number === matchNum[1]);
    if (numFound) return `Section ${numFound.number}: ${numFound.title}`;
    return `Section ${matchNum[1]}`;
  }

  return clean;
};

/**
 * Format clean Part and Section display, strictly: "Part X, Section X.Y"
 * No topic descriptions, no titles, no underscores, no truncated text.
 * Example: "Part 9, Section 9.2"
 */
export const formatCleanPartSection = (
  partNum?: number,
  sectionIdentifier?: string
): string => {
  const pNum = partNum && partNum >= 1 && partNum <= 14 ? partNum : 1;
  if (!sectionIdentifier) {
    return `Part ${pNum}, Section ${pNum}.1`;
  }

  const clean = sectionIdentifier.trim();
  const catalog = PYTHON_SECTIONS_CATALOG[pNum] || [];

  // 1. Check catalog match
  const found = catalog.find(
    (s) =>
      s.id.toLowerCase() === clean.toLowerCase() ||
      s.number === clean ||
      clean.toLowerCase().includes(s.id.toLowerCase()) ||
      clean.includes(`Section ${s.number}`) ||
      clean.includes(`Level ${s.number}`)
  );

  if (found) {
    return `Part ${pNum}, Section ${found.number}`;
  }

  // 2. Extract X.Y from string e.g. "9.2" or "Section 9.2: Objects..."
  const matchDot = clean.match(/(\d+)\.(\d+)/);
  if (matchDot) {
    return `Part ${matchDot[1]}, Section ${matchDot[1]}.${matchDot[2]}`;
  }

  // 3. Extract X-Y from string e.g. "9-2" or "9-2-objects..."
  const matchDash = clean.match(/(\d+)[\-_](\d+)/);
  if (matchDash) {
    return `Part ${matchDash[1]}, Section ${matchDash[1]}.${matchDash[2]}`;
  }

  return `Part ${pNum}, Section ${pNum}.1`;
};

/**
 * Determine exact next section and next part continuation across Parts 1-14.
 *
 * Example:
 * - Locked in Part 8, Section 8.3 -> returns Part 8, Section 8.4 ('8-4-methods-and-self')
 * - Locked in Part 8, Section 8.6 (last section) -> returns Part 9, Section 9.1 ('9-1-memory-references')
 */
export const getNextPythonSection = (
  currentPart: number,
  currentSectionIdentifier?: string
): {
  nextPart: number;
  nextSectionId: string;
  nextSectionNumber: string;
  nextSectionTitle: string;
} => {
  const partNum = Math.max(1, Math.min(14, currentPart || 1));
  const sections = PYTHON_SECTIONS_CATALOG[partNum] || [];

  let currentIdx = -1;
  const rawTarget = String(currentSectionIdentifier || '').trim().toLowerCase();

  if (rawTarget) {
    currentIdx = sections.findIndex((s) => {
      const sId = s.id.toLowerCase();
      const sNum = s.number.toLowerCase();
      return (
        sId === rawTarget ||
        sNum === rawTarget ||
        rawTarget.includes(sId) ||
        rawTarget.includes(`section ${sNum}`) ||
        rawTarget.includes(`level ${sNum}`) ||
        rawTarget.startsWith(sNum)
      );
    });
  }

  // If section was not specifically matched, try checking digits
  if (currentIdx === -1 && rawTarget) {
    const matchNum = rawTarget.match(/(\d+\.\d+)/);
    if (matchNum) {
      currentIdx = sections.findIndex((s) => s.number === matchNum[1]);
    }
  }

  // If still not matched, default to index 0 of current part
  if (currentIdx === -1) {
    currentIdx = 0;
  }

  // If there is a subsequent section within the same Part
  if (currentIdx + 1 < sections.length) {
    const nextSec = sections[currentIdx + 1];
    return {
      nextPart: partNum,
      nextSectionId: nextSec.id,
      nextSectionNumber: nextSec.number,
      nextSectionTitle: nextSec.title
    };
  }

  // If this was the final section of Part N, advance to Part N + 1, Section 1
  if (partNum < 14) {
    const nextPartSections = PYTHON_SECTIONS_CATALOG[partNum + 1] || [];
    const firstNextSec = nextPartSections[0];
    if (firstNextSec) {
      return {
        nextPart: partNum + 1,
        nextSectionId: firstNextSec.id,
        nextSectionNumber: firstNextSec.number,
        nextSectionTitle: firstNextSec.title
      };
    }
  }

  // If on the final section of Part 14, resume on final section with fresh attempt
  const finalSec = sections[currentIdx] || sections[sections.length - 1];
  return {
    nextPart: 14,
    nextSectionId: finalSec?.id || '14-4-custom-game-project',
    nextSectionNumber: finalSec?.number || '14.4',
    nextSectionTitle: finalSec?.title || 'Game Polish, Optimization & Capstone Synthesis'
  };
};

let memoryLockedCoursesCache: LockedCourseRecord[] | null = null;
let hasInitiatedCloudSync = false;

/**
 * Authoritative check to identify demo or test users created during testing:
 * - Rahul Verma (rahul.verma@techsprint.io / demo-std-1 / LC-101)
 * - Ananya Iyer (ananya.iyer99@gmail.com / demo-std-3 / LC-102)
 * - Priya Patel (priya.patel@gmail.com / demo-std-2 / LC-104)
 * - Vikramaditya Singh (vikram.singh@nitw.ac.in / demo-std-6 / LC-103)
 * - Any demo-std-* or current-student placeholder.
 * 
 * IMPORTANT: NEVER matches authentic student accounts, especially Bimal Kumar (bimaljayakumar18@gmail.com).
 */
export const isDemoOrTestUser = (studentEmail?: string, studentId?: string, recordId?: string): boolean => {
  const e = (studentEmail || '').toLowerCase().trim();
  const id = (studentId || '').toLowerCase().trim();
  const rid = (recordId || '').toLowerCase().trim();

  // 1. Explicitly identify and filter corrupted key-derived test accounts or placeholders
  if (
    id.includes('locked') ||
    id.startsWith('part') ||
    e.includes('locked') ||
    e.includes('part9_locked') ||
    e.endsWith('@student.dopilot.io') ||
    rid.startsWith('lc-live')
  ) {
    return true;
  }

  // 2. Strict safeguard: NEVER match real student Bimal Kumar / Bimal Jayakumar
  if (
    e === 'bimaljayakumar18@gmail.com' ||
    (e.includes('bimaljayakumar') && !e.includes('locked')) ||
    id === '108467813526729545413'
  ) {
    return false;
  }

  const demoEmails = [
    'rahul.verma@techsprint.io',
    'ananya.iyer99@gmail.com',
    'priya.patel@gmail.com',
    'vikram.singh@nitw.ac.in',
    'karthik.raja@outlook.com',
    'suresh.k@gmail.com',
    'aditya.sharma@gmail.com',
    'sneha.k@outlook.com',
    'ananya.sharma@appscale.dev',
    'current-student@student.dopilot.io',
    'learner@gmail.com'
  ];

  if (demoEmails.includes(e) || demoEmails.some(de => e === de)) return true;
  if (e.includes('techsprint.io')) return true;
  if (e.endsWith('@student.dopilot.io')) return true;

  if (id.startsWith('demo-std') || id === 'current-student' || id.startsWith('test-std')) return true;
  if (rid === 'lc-101' || rid === 'lc-102' || rid === 'lc-103' || rid === 'lc-104') return true;

  return false;
};

/**
 * Permanently purge all course reset, lock, failure, and audit data for a student.
 * Cascades across localStorage and Supabase cloud registry.
 */
export const purgeStudentCourseResetData = async (
  studentEmail?: string,
  studentId?: string,
  recordId?: string
): Promise<{ success: boolean; purgedRecordsCount: number; purgedAuditCount: number }> => {
  const cleanEmail = (studentEmail || '').toLowerCase().trim();
  const cleanId = (studentId || '').trim();
  const cleanIdLower = cleanId.toLowerCase();
  const cleanRecordId = (recordId || '').toLowerCase().trim();

  let purgedRecordsCount = 0;
  let purgedAuditCount = 0;

  // 1. Clear student lock keys from localStorage
  if (cleanId) {
    clearStudentCourseLockKeys(cleanId, 'all');
  }
  if (cleanEmail) {
    clearStudentCourseLockKeys(cleanEmail, 'all');
  }

  // Also remove failure keys specifically
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      if (cleanEmail) {
        localStorage.removeItem(`dopilot_consecutive_failures_${cleanEmail}`);
      }
      if (cleanId) {
        localStorage.removeItem(`dopilot_consecutive_failures_${cleanId}`);
        localStorage.removeItem(`dopilot_failed_levels_streak_${cleanId}`);
        localStorage.removeItem(`dopilot_locked_${cleanId}`);
        localStorage.removeItem(`dopilot_locked_progression_${cleanId}`);
        for (let p = 1; p <= 20; p++) {
          localStorage.removeItem(`dopilot_part${p}_consecutive_failures_${cleanId}`);
          localStorage.removeItem(`dopilot_part${p}_failed_levels_streak_${cleanId}`);
          localStorage.removeItem(`dopilot_part${p}_locked_${cleanId}`);
          localStorage.removeItem(`dopilot_java_part${p}_consecutive_failures_${cleanId}`);
          localStorage.removeItem(`dopilot_fullstack_p${p}_consecutive_failures_${cleanId}`);
          localStorage.removeItem(`dopilot_cyber_part${p}_consecutive_failures_${cleanId}`);
        }
      }
    } catch {}

    // 2. Filter locked courses registry: LOCKED_COURSES_STORAGE_KEY
    try {
      const raw = localStorage.getItem(LOCKED_COURSES_STORAGE_KEY);
      if (raw) {
        const list: LockedCourseRecord[] = JSON.parse(raw);
        if (Array.isArray(list)) {
          const beforeLen = list.length;
          const filtered = list.filter((r) => {
            const re = (r.studentEmail || '').toLowerCase().trim();
            const ri = (r.studentId || '').toLowerCase().trim();
            const rId = (r.id || '').toLowerCase().trim();
            const matchesEmail = cleanEmail && (re === cleanEmail || ri === cleanEmail);
            const matchesId = cleanIdLower && (ri === cleanIdLower || re === cleanIdLower);
            const matchesRecord = cleanRecordId && rId === cleanRecordId;
            return !(matchesEmail || matchesId || matchesRecord);
          });
          purgedRecordsCount = beforeLen - filtered.length;
          localStorage.setItem(LOCKED_COURSES_STORAGE_KEY, JSON.stringify(filtered));
          memoryLockedCoursesCache = filtered;
        }
      }
    } catch (e) {
      console.warn('Error purging from local locked courses registry:', e);
    }

    // 3. Filter course resets audit registry: COURSE_RESETS_AUDIT_KEY
    try {
      const rawAudit = localStorage.getItem(COURSE_RESETS_AUDIT_KEY);
      if (rawAudit) {
        const auditList: CourseResetAuditEntry[] = JSON.parse(rawAudit);
        if (Array.isArray(auditList)) {
          const beforeLen = auditList.length;
          const filteredAudit = auditList.filter((a) => {
            const ae = (a.studentEmail || '').toLowerCase().trim();
            const ai = (a.studentId || '').toLowerCase().trim();
            const aRecId = (a.recordId || '').toLowerCase().trim();
            const aId = (a.id || '').toLowerCase().trim();
            const matchesEmail = cleanEmail && (ae === cleanEmail || ai === cleanEmail);
            const matchesId = cleanIdLower && (ai === cleanIdLower || ae === cleanIdLower);
            const matchesRecord = cleanRecordId && (aRecId === cleanRecordId || aId === cleanRecordId);
            return !(matchesEmail || matchesId || matchesRecord);
          });
          purgedAuditCount = beforeLen - filteredAudit.length;
          localStorage.setItem(COURSE_RESETS_AUDIT_KEY, JSON.stringify(filteredAudit));
        }
      }
    } catch (e) {
      console.warn('Error purging from local course reset audit:', e);
    }
  }

  // 4. Supabase cloud sync: update CLOUD_LOCKED_COURSES_ID and CLOUD_COURSE_RESETS_AUDIT_ID in site_content
  if (isSupabaseConfigured()) {
    try {
      const nowIso = new Date().toISOString();

      // Filter cloud locked courses registry
      const { data: regDoc } = await supabase
        .from('site_content')
        .select('content')
        .eq('id', CLOUD_LOCKED_COURSES_ID)
        .maybeSingle();

      if (regDoc?.content?.records && Array.isArray(regDoc.content.records)) {
        const cloudFiltered = regDoc.content.records.filter((r: any) => {
          const re = (r.studentEmail || '').toLowerCase().trim();
          const ri = (r.studentId || '').toLowerCase().trim();
          const rId = (r.id || '').toLowerCase().trim();
          const matchesEmail = cleanEmail && (re === cleanEmail || ri === cleanEmail);
          const matchesId = cleanIdLower && (ri === cleanIdLower || re === cleanIdLower);
          const matchesRecord = cleanRecordId && rId === cleanRecordId;
          return !(matchesEmail || matchesId || matchesRecord);
        });

        await supabase.from('site_content').upsert({
          id: CLOUD_LOCKED_COURSES_ID,
          content: {
            records: cloudFiltered,
            updatedAt: nowIso
          },
          updated_at: nowIso
        });
      }

      // Filter cloud audit logs
      const { data: auditDoc } = await supabase
        .from('site_content')
        .select('content')
        .eq('id', CLOUD_COURSE_RESETS_AUDIT_ID)
        .maybeSingle();

      if (auditDoc?.content?.auditLogs && Array.isArray(auditDoc.content.auditLogs)) {
        const cloudAuditFiltered = auditDoc.content.auditLogs.filter((a: any) => {
          const ae = (a.studentEmail || '').toLowerCase().trim();
          const ai = (a.studentId || '').toLowerCase().trim();
          const aRecId = (a.recordId || '').toLowerCase().trim();
          const aId = (a.id || '').toLowerCase().trim();
          const matchesEmail = cleanEmail && (ae === cleanEmail || ai === cleanEmail);
          const matchesId = cleanIdLower && (ai === cleanIdLower || ae === cleanIdLower);
          const matchesRecord = cleanRecordId && (aRecId === cleanRecordId || aId === cleanRecordId);
          return !(matchesEmail || matchesId || matchesRecord);
        });

        await supabase.from('site_content').upsert({
          id: CLOUD_COURSE_RESETS_AUDIT_ID,
          content: {
            auditLogs: cloudAuditFiltered,
            updatedAt: nowIso
          },
          updated_at: nowIso
        });
      }
    } catch (supaErr) {
      console.warn('Error updating cloud registries during course reset purge:', supaErr);
    }
  }

  // 5. Notify open components
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('dopilot_locked_courses_updated'));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  }

  return { success: true, purgedRecordsCount, purgedAuditCount };
};

/**
 * Permanently remove all demo/test users and their test records from the Course Reset system.
 * Removes both demo accounts (Rahul Verma, Ananya Iyer, and any other demo-std records).
 */
export const purgeAllDemoCourseResetData = async (): Promise<void> => {
  const demoAccounts = [
    { email: 'rahul.verma@techsprint.io', id: 'demo-std-1', recordId: 'LC-101' },
    { email: 'ananya.iyer99@gmail.com', id: 'demo-std-3', recordId: 'LC-102' },
    { email: 'vikram.singh@nitw.ac.in', id: 'demo-std-6', recordId: 'LC-103' },
    { email: 'priya.patel@gmail.com', id: 'demo-std-2', recordId: 'LC-104' },
    { email: 'current-student@student.dopilot.io', id: 'current-student', recordId: 'LC-LIVE' },
    { email: 'part9_locked_108467813526729545413@student.dopilot.io', id: 'part9_locked_108467813526729545413', recordId: 'LC-LIVE-6291' },
    { email: 'locked_108467813526729545413@student.dopilot.io', id: 'locked_108467813526729545413', recordId: 'LC-LIVE-6291' }
  ];

  for (const acc of demoAccounts) {
    await purgeStudentCourseResetData(acc.email, acc.id, acc.recordId);
  }

  // Also filter any leftover records where isDemoOrTestUser evaluates to true
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = localStorage.getItem(LOCKED_COURSES_STORAGE_KEY);
      if (raw) {
        const list: LockedCourseRecord[] = JSON.parse(raw);
        if (Array.isArray(list)) {
          const clean = list.filter((r) => !isDemoOrTestUser(r.studentEmail, r.studentId, r.id));
          localStorage.setItem(LOCKED_COURSES_STORAGE_KEY, JSON.stringify(clean));
          memoryLockedCoursesCache = clean;
        }
      }

      const rawAudit = localStorage.getItem(COURSE_RESETS_AUDIT_KEY);
      if (rawAudit) {
        const auditList: CourseResetAuditEntry[] = JSON.parse(rawAudit);
        if (Array.isArray(auditList)) {
          const cleanAudit = auditList.filter((a) => !isDemoOrTestUser(a.studentEmail, a.studentId, a.recordId));
          localStorage.setItem(COURSE_RESETS_AUDIT_KEY, JSON.stringify(cleanAudit));
        }
      }
    } catch {}
  }

  if (isSupabaseConfigured()) {
    try {
      const nowIso = new Date().toISOString();
      const { data: regDoc } = await supabase
        .from('site_content')
        .select('content')
        .eq('id', CLOUD_LOCKED_COURSES_ID)
        .maybeSingle();

      if (regDoc?.content?.records && Array.isArray(regDoc.content.records)) {
        const cleanCloud = regDoc.content.records.filter((r: any) => !isDemoOrTestUser(r.studentEmail, r.studentId, r.id));
        if (cleanCloud.length !== regDoc.content.records.length) {
          await supabase.from('site_content').upsert({
            id: CLOUD_LOCKED_COURSES_ID,
            content: {
              records: cleanCloud,
              updatedAt: nowIso
            },
            updated_at: nowIso
          });
        }
      }

      const { data: auditDoc } = await supabase
        .from('site_content')
        .select('content')
        .eq('id', CLOUD_COURSE_RESETS_AUDIT_ID)
        .maybeSingle();

      if (auditDoc?.content?.auditLogs && Array.isArray(auditDoc.content.auditLogs)) {
        const cleanCloudAudit = auditDoc.content.auditLogs.filter((a: any) => !isDemoOrTestUser(a.studentEmail, a.studentId, a.recordId));
        if (cleanCloudAudit.length !== auditDoc.content.auditLogs.length) {
          await supabase.from('site_content').upsert({
            id: CLOUD_COURSE_RESETS_AUDIT_ID,
            content: {
              auditLogs: cleanCloudAudit,
              updatedAt: nowIso
            },
            updated_at: nowIso
          });
        }
      }

      // Purge any corrupted or test records from student_course_state_* rawStorage
      const { data: states } = await supabase
        .from('site_content')
        .select('id, content')
        .like('id', 'student_course_state_%');

      if (states && Array.isArray(states)) {
        for (const row of states) {
          const rawStorage = row.content?.rawStorage;
          if (rawStorage && rawStorage[LOCKED_COURSES_STORAGE_KEY]) {
            try {
              const regList = typeof rawStorage[LOCKED_COURSES_STORAGE_KEY] === 'string'
                ? JSON.parse(rawStorage[LOCKED_COURSES_STORAGE_KEY])
                : rawStorage[LOCKED_COURSES_STORAGE_KEY];
              if (Array.isArray(regList)) {
                const cleanedReg = regList.filter((r: any) => !isDemoOrTestUser(r.studentEmail, r.studentId, r.id));
                if (cleanedReg.length !== regList.length) {
                  rawStorage[LOCKED_COURSES_STORAGE_KEY] = JSON.stringify(cleanedReg);
                  await supabase.from('site_content').update({
                    content: { ...row.content, rawStorage },
                    updated_at: nowIso
                  }).eq('id', row.id);
                }
              }
            } catch {}
          }
        }
      }
    } catch {}
  }

  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('dopilot_locked_courses_updated'));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  }
};

/**
 * Scan Supabase database (site_content and student_profiles) for real locked records
 * Replaces dummy placeholders with authentic student credentials.
 */
export const syncLockedCoursesFromCloud = async (): Promise<LockedCourseRecord[]> => {
  let records: LockedCourseRecord[] = [];

  // 1. Read existing registry from localStorage
  try {
    const raw = localStorage.getItem(LOCKED_COURSES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        records = parsed.filter(
          (r) => !isDemoOrTestUser(r.studentEmail, r.studentId, r.id)
        );
      }
    }
  } catch {}

  if (!isSupabaseConfigured()) {
    memoryLockedCoursesCache = records;
    return records;
  }

  try {
    // 2. Fetch existing cloud registry from site_content
    const { data: regData } = await supabase
      .from('site_content')
      .select('content')
      .eq('id', CLOUD_LOCKED_COURSES_ID)
      .maybeSingle();

    if (regData?.content?.records && Array.isArray(regData.content.records)) {
      const cloudRecs: LockedCourseRecord[] = regData.content.records;
      for (const cr of cloudRecs) {
        if (isDemoOrTestUser(cr.studentEmail, cr.studentId, cr.id)) continue;
        const existingIdx = records.findIndex((r) => r.id === cr.id || r.studentId === cr.studentId);
        if (existingIdx !== -1) {
          records[existingIdx] = { ...records[existingIdx], ...cr };
        } else {
          records.push(cr);
        }
      }
    }

    // 3. Fetch authentic student profiles from Supabase database
    const { data: profiles } = await supabase
      .from('student_profiles')
      .select('id, name, email, phone, college_or_company, where_did_you_find_us');

    const profileMap = new Map<string, any>();
    if (profiles && Array.isArray(profiles)) {
      for (const p of profiles) {
        if (p.email) profileMap.set(p.email.toLowerCase().trim(), p);
        if (p.id) profileMap.set(p.id.trim(), p);
      }
    }

    // 4. Fetch live student progress states from site_content to detect real locks
    const { data: states } = await supabase
      .from('site_content')
      .select('id, content')
      .like('id', 'student_course_state_%');

    if (states && Array.isArray(states)) {
      for (const row of states) {
        const state = row.content || {};
        const email = (state.email || '').toLowerCase().trim();
        if (!email || isDemoOrTestUser(email, state.rawStorage?.['dopilot_student_id'])) continue;

        const profile = profileMap.get(email) || null;
        const studentId = profile?.id || state.rawStorage?.['dopilot_student_id'] || email.replace(/[^a-z0-9]/g, '');

        // Check if user has lock keys
        const globalLocks = state.globalLockedKeys || {};
        const isGloballyLocked = Object.values(globalLocks).some((v) => v === true);

        // Check python parts for locks
        const pyParts = state.courses?.['python-core']?.parts || {};
        let lockedPartNum = 0;
        let lockedSectionId = '';
        let streak = 0;
        let isLevelLocked = false;

        for (const [pStr, part] of Object.entries(pyParts)) {
          const pNum = Number(pStr);
          const lr = (part as any)?.levelResult;
          if (lr?.isLocked || (typeof lr?.streak === 'number' && lr.streak >= 3)) {
            lockedPartNum = pNum;
            lockedSectionId = lr.sectionId || (part as any)?.activeSectionId || '';
            streak = lr.streak || 3;
            isLevelLocked = true;
            break;
          }
        }

        // Check consecutive failure streak in student state
        const failures = state.consecutiveFailures || {};
        let maxFailureStreak = 0;
        for (const [fKey, count] of Object.entries(failures)) {
          const n = Number(count);
          if (n > maxFailureStreak) maxFailureStreak = n;
          if (n >= 3 && !lockedPartNum) {
            const m = fKey.match(/part(\d+)/i);
            if (m) lockedPartNum = Number(m[1]);
          }
        }

        if (isGloballyLocked || isLevelLocked || maxFailureStreak >= 3) {
          if (!lockedPartNum) lockedPartNum = state.courses?.['python-core']?.lastPart || 1;
          if (!lockedSectionId) {
            lockedSectionId = pyParts[String(lockedPartNum)]?.activeSectionId || `${lockedPartNum}-1`;
          }

          const existingIdx = records.findIndex(
            (r) =>
              (r.studentEmail && r.studentEmail.toLowerCase() === email) ||
              r.studentId === studentId
          );

          const realName = profile?.name || (existingIdx !== -1 && records[existingIdx].studentName !== 'Active Learner' ? records[existingIdx].studentName : email.split('@')[0]);
          const realPhone = profile?.phone ? (profile.phone.startsWith('+91') ? profile.phone : `+91 ${profile.phone}`) : undefined;
          const college = profile?.college_or_company || profile?.where_did_you_find_us || undefined;
          const formattedSection = formatPythonSectionLabel(lockedPartNum, lockedSectionId);

          // If record exists and is already unlocked by admin, don't revert to locked unless streak >= 3 in state
          const currentlyUnlocked = existingIdx !== -1 && records[existingIdx].lockStatus === 'unlocked' && !isGloballyLocked && !isLevelLocked;

          const updatedRecord: LockedCourseRecord = {
            id: existingIdx !== -1 ? records[existingIdx].id : `LC-${studentId.slice(-6)}`,
            studentId,
            studentName: realName,
            studentEmail: profile?.email || email,
            studentPhone: realPhone || (existingIdx !== -1 ? records[existingIdx].studentPhone : undefined),
            collegeOrCompany: college || (existingIdx !== -1 ? records[existingIdx].collegeOrCompany : undefined),
            courseId: 'python',
            courseName: 'Complete Python Course',
            partNum: lockedPartNum,
            partTitle: `Part ${lockedPartNum}`,
            failedPart: `Part ${lockedPartNum}`,
            failedSection: formattedSection,
            failedSectionId: lockedSectionId,
            consecutiveFailures: currentlyUnlocked ? 0 : (streak || maxFailureStreak || 3),
            lockStatus: currentlyUnlocked ? 'unlocked' : 'locked',
            lockedAt: existingIdx !== -1 ? records[existingIdx].lockedAt : new Date().toISOString(),
            progressSummary: `Part ${lockedPartNum}: ${formattedSection} • ${currentlyUnlocked ? 'Progression Active' : 'Lock Active'}`,
            earnedPoints: existingIdx !== -1 ? records[existingIdx].earnedPoints : 0
          };

          if (existingIdx !== -1) {
            records[existingIdx] = { ...records[existingIdx], ...updatedRecord };
          } else {
            records.unshift(updatedRecord);
          }
        }
      }
    }

    // Persist unified authoritative records back to cloud and local storage
    memoryLockedCoursesCache = records;
    try {
      localStorage.setItem(LOCKED_COURSES_STORAGE_KEY, JSON.stringify(records));
      await supabase.from('site_content').upsert({
        id: CLOUD_LOCKED_COURSES_ID,
        content: {
          records,
          updatedAt: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      });
    } catch {}

    return records;
  } catch (err) {
    console.warn('Error synchronizing locked courses from cloud:', err);
    memoryLockedCoursesCache = records;
    return records;
  }
};

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
        records = parsed.filter(
          (r: any) => !isDemoOrTestUser(r.studentEmail, r.studentId, r.id)
        );
      }
    }
  } catch (e) {
    console.error('Failed to parse locked courses registry:', e);
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

        // Extract student ID strictly (numeric/alphanumeric user ID after _locked_ or dopilot_locked_)
        const matchStudent = key.match(/(?:^dopilot_locked_|_locked_)([0-9a-zA-Z]+)$/);
        const studentId = matchStudent ? matchStudent[1] : '';

        // Never register demo, test or invalid placeholders
        if (!studentId || studentId.includes('locked') || studentId.startsWith('part') || isDemoOrTestUser(undefined, studentId)) continue;

        // Extract part number if present
        const matchPart = key.match(/part(\d+)/i) || key.match(/p(\d+)/i);
        if (matchPart) {
          partNum = parseInt(matchPart[1], 10);
        }

        const existingIdx = records.findIndex(
          (r) => (r.studentId === studentId || r.studentEmail === studentId) && r.courseId === courseId && (r.partNum === partNum || !r.partNum)
        );

        const currentSecId = localStorage.getItem(
          partNum === 1 ? 'dopilot_active_section_id' : `dopilot_part${partNum}_active_section_id`
        ) || `${partNum}-1`;

        const formattedSec = formatPythonSectionLabel(partNum, currentSecId);

        if (existingIdx === -1) {
          let realName = '';
          let realEmail = '';
          let realPhone = '';
          let college = '';

          try {
            const rawSession = localStorage.getItem('dopilot_student_session_v1');
            if (rawSession) {
              const sessionUser = JSON.parse(rawSession);
              if (sessionUser && (sessionUser.id === studentId || sessionUser.email === studentId)) {
                realName = sessionUser.name || '';
                realEmail = sessionUser.email || '';
                realPhone = sessionUser.phone || '';
                college = sessionUser.collegeOrCompany || sessionUser.where_did_you_find_us || '';
              }
            }
          } catch {}

          if (!realEmail) {
            if (studentId === '108467813526729545413') {
              realName = 'Bimal Jayakumar';
              realEmail = 'bimaljayakumar18@gmail.com';
            } else {
              // Do NOT create synthetic placeholder accounts without authentic credentials
              continue;
            }
          }

          const newRecord: LockedCourseRecord = {
            id: `LC-${studentId.slice(-6)}`,
            studentId,
            studentName: realName || studentId,
            studentEmail: realEmail,
            studentPhone: realPhone || undefined,
            collegeOrCompany: college || undefined,
            courseId,
            courseName,
            partNum,
            partTitle: `Part ${partNum}`,
            failedPart: `Part ${partNum}`,
            failedSection: formattedSec,
            failedSectionId: currentSecId,
            consecutiveFailures: 3,
            lockStatus: 'locked',
            lockedAt: new Date().toISOString(),
            progressSummary: `Part ${partNum}: ${formattedSec} • Lock Active`,
            earnedPoints: 0
          };
          records.unshift(newRecord);
        } else if (records[existingIdx].lockStatus === 'unlocked') {
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

  // Trigger background cloud sync to ensure real database records from Supabase are fetched
  if (!hasInitiatedCloudSync && isSupabaseConfigured()) {
    hasInitiatedCloudSync = true;
    syncLockedCoursesFromCloud().then((cloudRecords) => {
      if (cloudRecords && cloudRecords.length > 0) {
        window.dispatchEvent(new CustomEvent('dopilot_locked_courses_updated'));
      }
    }).catch(() => {});
  }

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
  if (r.failedSection) {
    return formatPythonSectionLabel(r.partNum || 1, r.failedSection);
  }
  if (r.failedSectionId) {
    return formatPythonSectionLabel(r.partNum || 1, r.failedSectionId);
  }
  if (r.partTitle && r.partTitle.includes(':')) {
    return r.partTitle.split(':')[1].trim();
  }
  return formatPythonSectionLabel(r.partNum || 1, `Section ${r.partNum || 1}.1`);
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
      localStorage.setItem(COURSE_RESETS_AUDIT_KEY, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const realOnly = parsed.filter(
        (a: any) => !isDemoOrTestUser(a.studentEmail, a.studentId, a.recordId)
      );
      if (realOnly.length !== parsed.length) {
        localStorage.setItem(COURSE_RESETS_AUDIT_KEY, JSON.stringify(realOnly));
      }
      return realOnly;
    }
    return [];
  } catch (e) {
    console.error('Failed to get course reset audit entries:', e);
    return [];
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
  failedSectionId?: string;
  consecutiveFailures?: number;
  progressSummary?: string;
  earnedPoints?: number;
}): LockedCourseRecord => {
  const current = getLockedCourseRecords();
  const existingIdx = current.findIndex(
    (r) =>
      r.studentId === params.studentId ||
      (params.studentEmail && r.studentEmail.toLowerCase() === params.studentEmail.toLowerCase())
  );

  const cleanPart = params.partNum || 1;
  const cleanSectionId = params.failedSectionId || params.failedSection;
  const formattedSection = formatPythonSectionLabel(cleanPart, cleanSectionId);

  let record: LockedCourseRecord;

  if (existingIdx !== -1) {
    current[existingIdx] = {
      ...current[existingIdx],
      studentName: params.studentName || current[existingIdx].studentName,
      studentEmail: params.studentEmail || current[existingIdx].studentEmail,
      studentPhone: params.studentPhone || current[existingIdx].studentPhone,
      collegeOrCompany: params.collegeOrCompany || current[existingIdx].collegeOrCompany,
      lockStatus: 'locked',
      consecutiveFailures: params.consecutiveFailures || 3,
      lockedAt: new Date().toISOString(),
      partNum: cleanPart,
      partTitle: `Part ${cleanPart}`,
      failedPart: `Part ${cleanPart}`,
      failedSection: formattedSection,
      failedSectionId: cleanSectionId,
      progressSummary: params.progressSummary || `Part ${cleanPart}: ${formattedSection} • Lock Active`,
      earnedPoints: params.earnedPoints ?? current[existingIdx].earnedPoints,
      unlockedAt: undefined,
      unlockedBy: undefined
    };
    record = current[existingIdx];
  } else {
    record = {
      id: `LC-${params.studentId.slice(-6)}`,
      studentId: params.studentId,
      studentName: params.studentName || 'Enrolled Student',
      studentEmail: params.studentEmail || `${params.studentId}@student.dopilot.io`,
      studentPhone: params.studentPhone,
      collegeOrCompany: params.collegeOrCompany,
      courseId: params.courseId,
      courseName: params.courseName,
      partNum: cleanPart,
      partTitle: `Part ${cleanPart}`,
      failedPart: `Part ${cleanPart}`,
      failedSection: formattedSection,
      failedSectionId: cleanSectionId,
      consecutiveFailures: params.consecutiveFailures || 3,
      lockStatus: 'locked',
      lockedAt: new Date().toISOString(),
      progressSummary: params.progressSummary || `Part ${cleanPart}: ${formattedSection} • Lock Active`,
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

  // Persist to Supabase site_content for cross-device visibility
  if (isSupabaseConfigured()) {
    Promise.resolve(
      supabase.from('site_content').upsert({
        id: CLOUD_LOCKED_COURSES_ID,
        content: {
          records: current,
          updatedAt: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      })
    ).catch(() => {});
  }

  return record;
};

/**
 * Target reset for specific student and course
 * Removes lock keys, resets failure streaks, advances progression to exact next section.
 * DOES NOT touch points, certificates, or valid answers in earlier sections.
 */
export const clearStudentCourseLockKeys = (
  studentId: string,
  courseId: string,
  nextPart?: number,
  nextSectionId?: string,
  studentEmail?: string
) => {
  const normCourse = courseId.toLowerCase();
  const idList = Array.from(new Set([studentId, studentEmail].filter(Boolean))) as string[];

  try {
    if (normCourse.includes('python')) {
      idList.forEach(id => {
        localStorage.removeItem(`dopilot_locked_${id}`);
        localStorage.removeItem(`dopilot_locked_progression_${id}`);
        localStorage.setItem(`dopilot_consecutive_failures_${id}`, '0');
        localStorage.setItem(`dopilot_failed_levels_streak_${id}`, '0');

        for (let p = 1; p <= 14; p++) {
          localStorage.removeItem(`dopilot_part${p}_locked_${id}`);
          localStorage.removeItem(`dopilot_part${p}_locked_progression_${id}`);
          localStorage.setItem(`dopilot_part${p}_consecutive_failures_${id}`, '0');
          localStorage.setItem(`dopilot_part${p}_failed_levels_streak_${id}`, '0');
          localStorage.removeItem(`dopilot_part${p}_disclaimer_open`);
          localStorage.removeItem(`dopilot_part${p}_disclaimer_confirmed`);
          localStorage.removeItem(`dopilot_part${p}_level_result`);
        }
      });
      localStorage.removeItem('dopilot_level_result');

      // Set progression to exact next section
      if (nextPart && nextSectionId) {
        localStorage.setItem(
          nextPart === 1 ? 'dopilot_active_section_id' : `dopilot_part${nextPart}_active_section_id`,
          nextSectionId
        );
        localStorage.setItem(
          nextPart === 1 ? 'dopilot_active_q_idx' : `dopilot_part${nextPart}_active_q_idx`,
          '0'
        );
        localStorage.setItem(
          nextPart === 1 ? 'dopilot_study_phase' : `dopilot_part${nextPart}_study_phase`,
          'true'
        );
        localStorage.removeItem(nextPart === 1 ? 'dopilot_time_up' : `dopilot_part${nextPart}_time_up`);
        localStorage.removeItem(nextPart === 1 ? 'dopilot_q_target_end_time' : `dopilot_part${nextPart}_q_target_end_time`);
        localStorage.removeItem(nextPart === 1 ? 'dopilot_level_result' : `dopilot_part${nextPart}_level_result`);
        localStorage.setItem('dopilot_python_core_last_part', String(nextPart));

        // Prevent showing intro page when continuing
        clearPythonPartIntroRequired(nextPart);
      }

      // Reset level attempts for python to 1
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('dopilot_part') || key.startsWith('dopilot_attempt_')) && idList.some(id => key.includes(id)) && key.includes('attempt')) {
          localStorage.setItem(key, '1');
        }
      }
    } else if (normCourse.includes('java')) {
      idList.forEach(id => {
        localStorage.removeItem(`dopilot_java_locked_${id}`);
        localStorage.removeItem(`dopilot_java_locked_progression_${id}`);
        localStorage.setItem(`dopilot_java_consecutive_failures_${id}`, '0');
        localStorage.setItem(`dopilot_java_failed_levels_streak_${id}`, '0');

        for (let p = 1; p <= 14; p++) {
          localStorage.removeItem(`dopilot_java_part${p}_locked_${id}`);
          localStorage.removeItem(`dopilot_java_part${p}_locked_progression_${id}`);
          localStorage.setItem(`dopilot_java_part${p}_consecutive_failures_${id}`, '0');
          localStorage.setItem(`dopilot_java_part${p}_failed_levels_streak_${id}`, '0');
          localStorage.removeItem(`dopilot_java_part${p}_level_result`);
        }
      });
      localStorage.removeItem('dopilot_java_level_result');
    } else if (normCourse.includes('fullstack')) {
      idList.forEach(id => {
        localStorage.removeItem(`dopilot_fullstack_locked_${id}`);
        localStorage.removeItem(`dopilot_fullstack_locked_progression_${id}`);
        localStorage.setItem(`dopilot_fullstack_consecutive_failures_${id}`, '0');
        localStorage.setItem(`dopilot_fullstack_failed_levels_streak_${id}`, '0');

        for (let p = 0; p <= 13; p++) {
          localStorage.removeItem(`dopilot_fullstack_p${p}_locked_${id}`);
          localStorage.removeItem(`dopilot_fullstack_part${p}_locked_${id}`);
          localStorage.removeItem(`dopilot_fullstack_p${p}_locked_progression_${id}`);
          localStorage.setItem(`dopilot_fullstack_p${p}_consecutive_failures_${id}`, '0');
          localStorage.setItem(`dopilot_fullstack_p${p}_failed_levels_streak_${id}`, '0');
          localStorage.removeItem(`dopilot_fullstack_part${p}_level_result`);
        }
      });
    } else if (normCourse.includes('cyber')) {
      idList.forEach(id => {
        localStorage.removeItem(`dopilot_cyber_locked_${id}`);
        localStorage.removeItem(`dopilot_cyber_locked_progression_${id}`);
        localStorage.setItem(`dopilot_cyber_consecutive_failures_${id}`, '0');
        localStorage.setItem(`dopilot_cyber_failed_levels_streak_${id}`, '0');

        for (let p = 1; p <= 14; p++) {
          localStorage.removeItem(`dopilot_cyber_part${p}_locked_${id}`);
          localStorage.removeItem(`dopilot_cyber_part${p}_locked_progression_${id}`);
          localStorage.setItem(`dopilot_cyber_part${p}_consecutive_failures_${id}`, '0');
          localStorage.setItem(`dopilot_cyber_part${p}_failed_levels_streak_${id}`, '0');
          localStorage.removeItem(`dopilot_cyber_part${p}_level_result`);
        }
      });
    }
  } catch (e) {
    console.error('Error clearing student course lock keys:', e);
  }
};

/**
 * Execute course reset and unlocking by Admin.
 *
 * Requirements guaranteed:
 * 1. Target student unlocked globally.
 * 2. Next-section continuation calculated based on actual locked section.
 * 3. Locked state completely removed without user-facing popup.
 * 4. Global persistence synchronized across devices, browsers, and re-login via Supabase site_content.
 */
export const resetStudentCourse = (
  recordId: string,
  adminIdentifier: string = 'admin',
  adminNotes?: string
): {
  success: boolean;
  record?: LockedCourseRecord;
  auditEntry?: CourseResetAuditEntry;
  nextPart?: number;
  nextSectionId?: string;
  nextSectionNumber?: string;
  nextSectionTitle?: string;
  error?: string;
} => {
  const records = getLockedCourseRecords();
  const targetRecord = records.find((r) => r.id === recordId);

  if (!targetRecord) {
    return { success: false, error: 'Locked course record not found.' };
  }

  // 1. Calculate exact next section for continuation
  const lockedPart = targetRecord.partNum || 1;
  const lockedSection = targetRecord.failedSectionId || targetRecord.failedSection;
  const continuation = getNextPythonSection(lockedPart, lockedSection);

  const { nextPart, nextSectionId, nextSectionNumber, nextSectionTitle } = continuation;
  const cleanEmail = normalizeStudentEmail(targetRecord.studentEmail);

  // 2. Clear targeted keys and advance local storage
  clearStudentCourseLockKeys(
    targetRecord.studentId,
    targetRecord.courseId,
    nextPart,
    nextSectionId,
    cleanEmail
  );

  // 3. Update in-memory course state cache
  if (cleanEmail) {
    if (!memoryCourseState[cleanEmail]) {
      memoryCourseState[cleanEmail] = {
        email: cleanEmail,
        courses: {},
        updatedAt: new Date().toISOString()
      };
    }
    const mem = memoryCourseState[cleanEmail];
    mem.globalLockedKeys = {};
    mem.consecutiveFailures = {};

    if (!mem.courses) mem.courses = {};
    if (!mem.courses['python-core']) {
      mem.courses['python-core'] = {
        lastPart: nextPart,
        completedParts: [],
        parts: {}
      };
    }

    const pyCourse = mem.courses['python-core'];
    pyCourse.lastPart = nextPart;
    if (!pyCourse.parts) pyCourse.parts = {};

    // Clear levelResult on previous locked part
    if (pyCourse.parts[String(lockedPart)]) {
      pyCourse.parts[String(lockedPart)].levelResult = null;
      pyCourse.parts[String(lockedPart)].isTimeUpWaiting = false;
    }

    // Set progression on nextPart
    pyCourse.parts[String(nextPart)] = {
      ...(pyCourse.parts[String(nextPart)] || {}),
      activeSectionId: nextSectionId,
      activeQuestionIdx: 0,
      isStudyPhase: true,
      levelResult: null,
      isTimeUpWaiting: false,
      timeLeft: 30,
      targetEndTime: 0,
      updatedAt: new Date().toISOString()
    };
  }

  // 4. Update record in registry
  const nowIso = new Date().toISOString();
  targetRecord.lockStatus = 'unlocked';
  targetRecord.unlockedAt = nowIso;
  targetRecord.unlockedBy = adminIdentifier;
  targetRecord.consecutiveFailures = 0;
  if (adminNotes) {
    targetRecord.adminNotes = adminNotes;
  }
  targetRecord.progressSummary = `Part ${nextPart}: Section ${nextSectionNumber} • Unlocked by Admin`;

  try {
    localStorage.setItem(LOCKED_COURSES_STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to update locked courses registry:', e);
  }

  // 5. Record audit trail entry
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
    adminNotes: adminNotes || `Course unlocked by admin. Continuation position: Part ${nextPart}, Section ${nextSectionNumber}: ${nextSectionTitle}`,
    status: 'SUCCESS',
    unlockedLocation: `Part ${lockedPart}: ${getRecordFailedSection(targetRecord)}`,
    continuationSection: `Part ${nextPart}, Section ${nextSectionNumber}: ${nextSectionTitle}`
  };

  const auditLogs = getCourseResetAuditEntries();
  const updatedAuditLogs = [auditEntry, ...auditLogs];
  try {
    localStorage.setItem(COURSE_RESETS_AUDIT_KEY, JSON.stringify(updatedAuditLogs));
  } catch (e) {
    console.error('Failed to save reset audit entry:', e);
  }

  // 6. Dispatch custom events for instant student-tab reactivity
  const unlockDetail = {
    recordId: targetRecord.id,
    studentId: targetRecord.studentId,
    studentEmail: targetRecord.studentEmail,
    courseId: targetRecord.courseId,
    unlockedBy: adminIdentifier,
    timestamp: nowIso,
    lockedPart,
    nextPart,
    nextSectionId,
    nextSectionNumber,
    nextSectionTitle
  };

  window.dispatchEvent(
    new CustomEvent('dopilot_course_unlocked', { detail: unlockDetail })
  );

  window.dispatchEvent(
    new CustomEvent('dopilot_locked_courses_updated', { detail: targetRecord })
  );

  window.dispatchEvent(
    new CustomEvent('dopilot_progress_restored', {
      detail: { courseId: 'python-core', studentId: targetRecord.studentId }
    })
  );

  // 7. Authoritative Global Persistence to Supabase site_content
  if (isSupabaseConfigured()) {
    // A. Update student course state document in site_content
    const docId = getStudentDocId(cleanEmail);
    Promise.resolve(
      supabase
        .from('site_content')
        .select('content')
        .eq('id', docId)
        .maybeSingle()
        .then(async ({ data: existingDoc }) => {
          const cloudState = existingDoc?.content || memoryCourseState[cleanEmail] || {
            email: cleanEmail,
            courses: {},
            updatedAt: nowIso
          };

          cloudState.globalLockedKeys = {};
          cloudState.consecutiveFailures = {};

          if (!cloudState.courses) cloudState.courses = {};
          if (!cloudState.courses['python-core']) {
            cloudState.courses['python-core'] = {
              lastPart: nextPart,
              completedParts: [],
              parts: {}
            };
          }

          const py = cloudState.courses['python-core'];
          py.lastPart = nextPart;
          if (!py.parts) py.parts = {};

          // Clear locked levelResult
          if (py.parts[String(lockedPart)]) {
            py.parts[String(lockedPart)].levelResult = null;
            py.parts[String(lockedPart)].isTimeUpWaiting = false;
          }

          // Advance to next section
          py.parts[String(nextPart)] = {
            ...(py.parts[String(nextPart)] || {}),
            activeSectionId: nextSectionId,
            activeQuestionIdx: 0,
            isStudyPhase: true,
            levelResult: null,
            isTimeUpWaiting: false,
            timeLeft: 30,
            targetEndTime: 0,
            updatedAt: nowIso
          };

          if (!cloudState.rawStorage) cloudState.rawStorage = {};
          cloudState.rawStorage[`dopilot_part${nextPart}_active_section_id`] = nextSectionId;
          cloudState.rawStorage[`dopilot_part${nextPart}_active_q_idx`] = '0';
          cloudState.rawStorage[`dopilot_part${nextPart}_study_phase`] = 'true';
          cloudState.rawStorage['dopilot_python_core_last_part'] = String(nextPart);
          cloudState.rawStorage[`dopilot_python_intro_required_${nextPart}`] = 'false';
          cloudState.rawStorage[`python_course_intro_started_${nextPart}`] = 'true';
          delete cloudState.rawStorage[`dopilot_locked_${targetRecord.studentId}`];
          delete cloudState.rawStorage[`dopilot_part${lockedPart}_locked_${targetRecord.studentId}`];
          delete cloudState.rawStorage[`dopilot_part${lockedPart}_level_result`];
          delete cloudState.rawStorage['dopilot_level_result'];

          cloudState.updatedAt = nowIso;

          await supabase.from('site_content').upsert({
            id: docId,
            content: cloudState,
            updated_at: nowIso
          });
        })
    ).catch((err) => {
      console.warn('Error syncing unlocked state to student document:', err);
    });

    // B. Persist locked courses registry to site_content
    Promise.resolve(
      supabase.from('site_content').upsert({
        id: CLOUD_LOCKED_COURSES_ID,
        content: {
          records,
          updatedAt: nowIso
        },
        updated_at: nowIso
      })
    ).catch(() => {});

    // C. Persist reset audit logs to site_content
    Promise.resolve(
      supabase.from('site_content').upsert({
        id: CLOUD_COURSE_RESETS_AUDIT_ID,
        content: {
          auditLogs: updatedAuditLogs,
          updatedAt: nowIso
        },
        updated_at: nowIso
      })
    ).catch(() => {});
  }

  return {
    success: true,
    record: targetRecord,
    auditEntry,
    nextPart,
    nextSectionId,
    nextSectionNumber,
    nextSectionTitle
  };
};

/**
 * Reusable hook for Python Part pages to react immediately to admin unlocks without showing any popup.
 */
export function useCourseUnlockedListener(params: {
  partNum: number;
  studentId: string;
  studentEmail?: string;
  setLevelResult: (val: any) => void;
  setConsecutiveFailures: (val: number) => void;
  setActiveSectionId?: (val: string) => void;
  setActiveQuestionIdx?: (val: number) => void;
  setIsStudyPhase?: (val: boolean) => void;
}): void {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCourseUnlocked = (e: any) => {
      const detail = e?.detail;
      const cleanStudent = String(params.studentId || '').trim();
      const cleanEmail = String(params.studentEmail || '').toLowerCase().trim();

      const isMatch =
        !detail ||
        detail.studentId === cleanStudent ||
        (detail.studentEmail && detail.studentEmail.toLowerCase() === cleanEmail) ||
        detail.courseId === 'python' ||
        detail.courseId === 'python-core' ||
        detail.courseId === 'all';

      if (isMatch) {
        // Remove locked screen completely without showing any unlock alert or popup
        params.setLevelResult(null);
        params.setConsecutiveFailures(0);

        try {
          localStorage.removeItem(`dopilot_part${params.partNum}_level_result`);
          localStorage.removeItem(`dopilot_part${params.partNum}_locked_${cleanStudent}`);
          localStorage.removeItem(`dopilot_locked_${cleanStudent}`);
          localStorage.removeItem(`dopilot_part${params.partNum}_disclaimer_open`);
        } catch {}

        // Continue to exact next section
        if (detail?.nextPart === params.partNum && detail?.nextSectionId) {
          if (params.setActiveSectionId) params.setActiveSectionId(detail.nextSectionId);
          if (params.setActiveQuestionIdx) params.setActiveQuestionIdx(0);
          if (params.setIsStudyPhase) params.setIsStudyPhase(true);
        } else if (detail?.nextPart && detail.nextPart !== params.partNum) {
          navigate(`/course/python-core/part-${detail.nextPart}`, { replace: true });
        }
      }
    };

    window.addEventListener('dopilot_course_unlocked', handleCourseUnlocked);
    return () => window.removeEventListener('dopilot_course_unlocked', handleCourseUnlocked);
  }, [params.partNum, params.studentId, params.studentEmail, navigate]);
}
