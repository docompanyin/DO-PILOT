import { normalizeStudentEmail, memoryCourseState, queueCloudSync } from './courseProgressSyncService';
/**
 * Service to record and calculate overall Part 1 scores across sections 1.1–1.6
 * for Python, Java, Full Stack, and Cyber Security tracks.
 *
 * Post-purchase rule:
 * - If overall score across all questions in sections 1.1–1.6 > 50%: start directly at Part 2.
 * - If overall score <= 50%: start again at Part 1.
 */

export interface Part1ScoreSummary {
  totalCorrect: number;
  totalQuestions: number;
  percentage: number;
  isAbove50: boolean;
  allSectionsPassed: boolean;
  hasFailedTrial: boolean;
}

export const normalizeTrackId = (courseId: string): string => {
  const c = courseId.toLowerCase();
  if (c.includes('python')) return 'python-core';
  if (c.includes('java')) return 'java-core';
  if (c.includes('fullstack') || c.includes('full-stack')) return 'fullstack-open';
  if (c.includes('cyber') || c.includes('security')) return 'cyber-security';
  return courseId;
};

const getStoragePrefix = (trackId: string): string => {
  switch (trackId) {
    case 'python-core':
      return 'dopilot_python';
    case 'java-core':
      return 'dopilot_java';
    case 'fullstack-open':
      return 'dopilot_fullstack';
    case 'cyber-security':
      return 'dopilot_cyber';
    default:
      return `dopilot_${trackId}`;
  }
};

/**
 * Record that a user attempted questions in the free trial
 */
export const markTrialAttempted = (courseId: string, studentId?: string): void => {
  try {
    const track = normalizeTrackId(courseId);
    const prefix = getStoragePrefix(track);
    const key = `${prefix}_trial_attempted${studentId ? `_${studentId}` : ''}`;
    localStorage.setItem(key, 'true');
    localStorage.setItem(`${prefix}_trial_attempted`, 'true');
  } catch {}
};

/**
 * Check whether a user attempted the free trial before purchasing
 */
export const hasAttemptedTrial = (courseId: string, studentId?: string): boolean => {
  try {
    const track = normalizeTrackId(courseId);
    const prefix = getStoragePrefix(track);
    const key = `${prefix}_trial_attempted${studentId ? `_${studentId}` : ''}`;
    return localStorage.getItem(key) === 'true' || localStorage.getItem(`${prefix}_trial_attempted`) === 'true';
  } catch {
    return false;
  }
};

/**
 * Record question counts & correct counts for a completed section (1.1 through 1.6)
 */
export const recordPart1SectionScore = (
  courseId: string,
  sectionId: string,
  correct: number,
  total: number,
  studentId?: string
): void => {
  try {
    const track = normalizeTrackId(courseId);
    const prefix = getStoragePrefix(track);
    const key = `${prefix}_part1_section_scores${studentId ? `_${studentId}` : ''}`;
    const raw = localStorage.getItem(key);
    const scores: Record<string, { correct: number; total: number; updatedAt: number }> = raw ? JSON.parse(raw) : {};

    scores[sectionId] = {
      correct: Math.max(0, correct),
      total: Math.max(0, total),
      updatedAt: Date.now()
    };

    localStorage.setItem(key, JSON.stringify(scores));

    // Also update studentId-agnostic mirror for fast retrieval
    if (studentId) {
      const globalKey = `${prefix}_part1_section_scores`;
      const gRaw = localStorage.getItem(globalKey);
      const gScores = gRaw ? JSON.parse(gRaw) : {};
      gScores[sectionId] = scores[sectionId];
      localStorage.setItem(globalKey, JSON.stringify(gScores));
    }
  } catch (err) {
    console.error('Failed to record Part 1 section score:', err);
  }
};

/**
 * Get expected section count for Part 1 by track (Python & Cyber = 5, Java & Fullstack = 6)
 */
export const getExpectedPart1SectionCount = (courseId: string): number => {
  const track = normalizeTrackId(courseId);
  if (track === 'python-core' || track === 'cyber-security') {
    return 5;
  }
  return 6;
};

/**
 * Get expected total question count for Part 1 by track (Python & Cyber = 30, Java & Fullstack = 36)
 */
export const getExpectedPart1TotalQuestions = (courseId: string): number => {
  return getExpectedPart1SectionCount(courseId) * 6;
};

/**
 * Calculate the user's overall score across all questions in Part 1 sections
 * (1.1–1.5 for Python & Cyber, 1.1–1.6 for Java & Fullstack)
 * Total score = sum(correct) / sum(total questions) across Part 1 sections.
 */
export const getPart1OverallScore = (
  courseId: string,
  studentId?: string
): Part1ScoreSummary => {
  try {
    const track = normalizeTrackId(courseId);
    const prefix = getStoragePrefix(track);

    // Try student-specific key first, then generic key
    let raw = studentId ? localStorage.getItem(`${prefix}_part1_section_scores_${studentId}`) : null;
    if (!raw) {
      raw = localStorage.getItem(`${prefix}_part1_section_scores`);
    }

    if (raw) {
      const scores: Record<string, { correct: number; total: number }> = JSON.parse(raw);
      let totalCorrect = 0;
      let totalQuestions = 0;
      let allPassed = true;
      const entries = Object.values(scores);
      const expectedSections = getExpectedPart1SectionCount(track);

      entries.forEach(s => {
        if (s && typeof s.correct === 'number' && typeof s.total === 'number') {
          totalCorrect += s.correct;
          totalQuestions += s.total;
          const secPct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
          if (secPct <= 80) {
            allPassed = false;
          }
        }
      });

      if (totalQuestions > 0) {
        const percentage = Math.round((totalCorrect / totalQuestions) * 100);
        const isAbove50 = percentage >= 50;
        const allSectionsPassed = entries.length >= expectedSections && allPassed;
        const hasFailedTrial = !isAbove50;

        return {
          totalCorrect,
          totalQuestions,
          percentage,
          isAbove50: percentage >= 50,
          allSectionsPassed,
          hasFailedTrial
        };
      }
    }
  } catch (err) {
    console.error('Error computing Part 1 overall score:', err);
  }

  return {
    totalCorrect: 0,
    totalQuestions: 0,
    percentage: 0,
    isAbove50: false,
    allSectionsPassed: false,
    hasFailedTrial: true
  };
};

/**
 * Check whether Part 1 was completely finished (all sections completed during free trial or previously).
 */
export const isPart1Finished = (courseId: string, studentId?: string): boolean => {
  try {
    const track = normalizeTrackId(courseId);
    const prefix = getStoragePrefix(track);

    // 1. Direct finished flags
    if (track === 'python-core') {
      if (
        localStorage.getItem('dopilot_part1_finished') === 'true' ||
        localStorage.getItem('dopilot_python_part1_finished') === 'true' ||
        localStorage.getItem('dopilot_part1_completed') === 'true'
      ) {
        return true;
      }
    } else if (track === 'java-core') {
      if (
        localStorage.getItem('dopilot_java_part1_finished') === 'true' ||
        localStorage.getItem('dopilot_java_part1_completed') === 'true'
      ) {
        return true;
      }
    } else {
      if (
        localStorage.getItem(`${prefix}_part1_finished`) === 'true' ||
        localStorage.getItem(`${prefix}_part1_completed`) === 'true'
      ) {
        return true;
      }
    }

    // 2. Check memoryCourseState / backend student state
    const cleanEmail = normalizeStudentEmail(studentId && studentId.includes('@') ? studentId : undefined);
    if (cleanEmail && memoryCourseState[cleanEmail]) {
      const p1 = memoryCourseState[cleanEmail].courses?.[track]?.parts?.['1'];
      if (p1?.isFinishedPart || p1?.isCompleted) {
        return true;
      }
    }

    // 3. Check section scores count: if all expected sections are recorded (5 for Python, 6 for Java)
    const expectedCount = getExpectedPart1SectionCount(track);
    let raw = studentId ? localStorage.getItem(`${prefix}_part1_section_scores_${studentId}`) : null;
    if (!raw) raw = localStorage.getItem(`${prefix}_part1_section_scores`);
    if (raw) {
      const scores = JSON.parse(raw);
      if (scores && typeof scores === 'object') {
        const recordedSections = Object.keys(scores).filter(k => scores[k] && scores[k].total > 0);
        if (recordedSections.length >= expectedCount) {
          return true;
        }
      }
    }

    return false;
  } catch {
    return false;
  }
};

/**
 * Mark Part 1 as completely finished
 */
export const markPart1Finished = (courseId: string, studentId?: string): void => {
  try {
    const track = normalizeTrackId(courseId);
    const prefix = getStoragePrefix(track);
    if (track === 'python-core') {
      localStorage.setItem('dopilot_part1_finished', 'true');
      localStorage.setItem('dopilot_python_part1_finished', 'true');
    } else {
      localStorage.setItem(`${prefix}_part1_finished`, 'true');
    }

    const cleanEmail = normalizeStudentEmail(studentId && studentId.includes('@') ? studentId : undefined);
    if (cleanEmail && memoryCourseState[cleanEmail]) {
      const st = memoryCourseState[cleanEmail];
      if (st.courses?.[track]?.parts?.['1']) {
        st.courses[track].parts['1'].isFinishedPart = true;
      }
      st.updatedAt = new Date().toISOString();
      queueCloudSync(cleanEmail);
    }
  } catch {}
};

/**
 * Determine the starting part after purchase:
 * - Scenario 1: Student completely finished Part 1 during free trial.
 *   Purchasing takes them DIRECTLY to Part 2, regardless of their Part 1 result.
 *   No pass/fail check, no retest required.
 * - Scenario 2: Direct purchase without using free trial.
 *   Starts at Part 1.
 * - Scenario 3: Partial Part 1 during free trial, purchase afterwards.
 *   Stays at Part 1 and resumes at the saved in-progress section.
 */
export const getPostPurchaseStartingPart = (
  courseId: string,
  currentUncompletedPart: number = 1,
  studentId?: string
): number => {
  const track = normalizeTrackId(courseId);

  // If student already progressed beyond Part 2, keep their advance
  if (currentUncompletedPart > 2) {
    return currentUncompletedPart;
  }

  // Check if student made an explicit post-purchase choice (retry or continue)
  const savedDecision = getPostPurchaseDecision(track, studentId);
  if (savedDecision === 'continue_to_part2') {
    return 2;
  }
  if (savedDecision === 'retry_part1') {
    return 1;
  }

  // Scenario 1: Completely finished Part 1 during free trial -> directly start Part 2!
  if (isPart1Finished(track, studentId)) {
    return 2;
  }

  // Scenario 2 (direct purchase) & Scenario 3 (partial trial): start / continue Part 1
  return 1;
};

export type PostPurchaseDecision = 'retry_part1' | 'continue_to_part2';

/**
 * Check if the user has already chosen between Retry Part 1 and Continue to Part 2
 */
export const getPostPurchaseDecision = (courseId: string, studentId?: string): PostPurchaseDecision | null => {
  try {
    const track = normalizeTrackId(courseId);
    const prefix = getStoragePrefix(track);
    const studentKey = `${prefix}_post_purchase_decision${studentId ? `_${studentId}` : ''}`;
    const raw = localStorage.getItem(studentKey) || localStorage.getItem(`${prefix}_post_purchase_decision`);
    if (raw === 'retry_part1' || raw === 'continue_to_part2') {
      return raw;
    }
    return null;
  } catch {
    return null;
  }
};


/**
 * Save the user's explicit choice so the Course Unlocked page appears only once
 */
export const setPostPurchaseDecision = (
  courseId: string,
  decision: PostPurchaseDecision,
  studentId?: string
): void => {
  try {
    const track = normalizeTrackId(courseId);
    const prefix = getStoragePrefix(track);
    const studentKey = `${prefix}_post_purchase_decision${studentId ? `_${studentId}` : ''}`;
    localStorage.setItem(studentKey, decision);
    localStorage.setItem(`${prefix}_post_purchase_decision`, decision);

    // Sync to backend student state immediately
    const cleanEmail = normalizeStudentEmail(studentId && studentId.includes('@') ? studentId : undefined);
    if (cleanEmail) {
      if (!memoryCourseState[cleanEmail]) {
        memoryCourseState[cleanEmail] = {
          email: cleanEmail,
          courses: {},
          updatedAt: new Date().toISOString()
        };
      }
      const st = memoryCourseState[cleanEmail];
      if (!st.postPurchaseDecisions) st.postPurchaseDecisions = {};
      const courseShort = track.replace('-core', '').replace('-open', '');
      st.postPurchaseDecisions[courseShort] = decision;
      st.postPurchaseDecisions[track] = decision;
      st.updatedAt = new Date().toISOString();
      queueCloudSync(cleanEmail);
    }
  } catch {}
};

/**
 * Check if user has already used their one opportunity to restart Part 1
 */
export const hasUsedPart1Restart = (courseId: string, studentId?: string): boolean => {
  try {
    const track = normalizeTrackId(courseId);
    const prefix = getStoragePrefix(track);
    const key = `${prefix}_part1_restart_used${studentId ? `_${studentId}` : ''}`;
    return localStorage.getItem(key) === 'true' || localStorage.getItem(`${prefix}_part1_restart_used`) === 'true';
  } catch {
    return false;
  }
};

/**
 * Mark that the user has consumed their single opportunity to restart Part 1
 */
export const markPart1RestartUsed = (courseId: string, studentId?: string): void => {
  try {
    const track = normalizeTrackId(courseId);
    const prefix = getStoragePrefix(track);
    const key = `${prefix}_part1_restart_used${studentId ? `_${studentId}` : ''}`;
    localStorage.setItem(key, 'true');
    // Also mirror to generic key
    localStorage.setItem(`${prefix}_part1_restart_used`, 'true');

    // Sync to backend student state immediately
    const cleanEmail = normalizeStudentEmail(studentId && studentId.includes('@') ? studentId : undefined);
    if (cleanEmail) {
      if (!memoryCourseState[cleanEmail]) {
        memoryCourseState[cleanEmail] = {
          email: cleanEmail,
          courses: {},
          updatedAt: new Date().toISOString()
        };
      }
      const st = memoryCourseState[cleanEmail];
      if (!st.part1RestartUsed) st.part1RestartUsed = {};
      const courseShort = track.replace('-core', '').replace('-open', '');
      st.part1RestartUsed[courseShort] = true;
      st.part1RestartUsed[track] = true;
      st.updatedAt = new Date().toISOString();
      queueCloudSync(cleanEmail);
    }
  } catch {}
};

/**
 * Reset section scores when starting a clean restart of Part 1
 */
export const clearPart1ScoresOnRestart = (courseId: string, studentId?: string): void => {
  try {
    const track = normalizeTrackId(courseId);
    const prefix = getStoragePrefix(track);
    if (studentId) {
      localStorage.removeItem(`${prefix}_part1_section_scores_${studentId}`);
    }
    localStorage.removeItem(`${prefix}_part1_section_scores`);
    localStorage.removeItem(`${prefix}_part1_finished`);
    localStorage.removeItem('dopilot_part1_finished');
  } catch {}
};

/**
 * Mark a section as started under free trial.
 * Used to identify sections in progress when a student purchases mid-way through Part 1.
 */
export const markSectionStartedInTrial = (
  courseId: string,
  sectionId: string,
  studentId?: string
): void => {
  try {
    const track = normalizeTrackId(courseId);
    const prefix = getStoragePrefix(track);
    const key = `${prefix}_trial_section_${sectionId}${studentId ? `_${studentId}` : ''}`;
    localStorage.setItem(key, 'true');
    localStorage.setItem(`${prefix}_trial_section_${sectionId}`, 'true');
  } catch {}
};

/**
 * Record which section was in-progress at the moment the student purchased the course.
 * That section is granted full exemption from retests and consecutive-failure counting.
 */
export const setPurchaseInProgressExemptSection = (
  courseId: string,
  sectionId: string,
  studentId?: string
): void => {
  try {
    if (!sectionId) return;
    const track = normalizeTrackId(courseId);
    const prefix = getStoragePrefix(track);
    const key = `${prefix}_exempt_in_progress_section${studentId ? `_${studentId}` : ''}`;
    localStorage.setItem(key, sectionId);
    localStorage.setItem(`${prefix}_exempt_in_progress_section`, sectionId);

    // Sync to backend student state
    const cleanEmail = normalizeStudentEmail(studentId && studentId.includes('@') ? studentId : undefined);
    if (cleanEmail) {
      if (!memoryCourseState[cleanEmail]) {
        memoryCourseState[cleanEmail] = {
          email: cleanEmail,
          courses: {},
          updatedAt: new Date().toISOString()
        };
      }
      const st = memoryCourseState[cleanEmail];
      if (!st.exemptSections) st.exemptSections = {};
      st.exemptSections[track] = sectionId;
      st.exemptSections[track.replace('-core', '')] = sectionId;
      st.updatedAt = new Date().toISOString();
      queueCloudSync(cleanEmail);
    }
  } catch {}
};

/**
 * Check whether a section is exempt from retests and consecutive-failure counting.
 * A section is exempt if:
 * 1. It was explicitly recorded as in-progress at the moment of purchase.
 * 2. OR it was started under free trial and has not yet been passed/finished under purchased rules.
 */
export const isSectionExemptFromRetest = (
  courseId: string,
  sectionId: string,
  studentId?: string
): boolean => {
  try {
    if (!sectionId) return false;
    const track = normalizeTrackId(courseId);
    const prefix = getStoragePrefix(track);

    // 1. Direct explicit in-progress exempt section key
    const studentKey = `${prefix}_exempt_in_progress_section${studentId ? `_${studentId}` : ''}`;
    const exemptSec = localStorage.getItem(studentKey) || localStorage.getItem(`${prefix}_exempt_in_progress_section`);
    if (exemptSec && exemptSec === sectionId) {
      return true;
    }

    // 2. Direct cloud memory state check
    const cleanEmail = normalizeStudentEmail(studentId && studentId.includes('@') ? studentId : undefined);
    if (cleanEmail) {
      const memEx = memoryCourseState[cleanEmail]?.exemptSections?.[track] ||
                    memoryCourseState[cleanEmail]?.exemptSections?.[track.replace('-core', '')];
      if (memEx && memEx === sectionId) {
        return true;
      }
    }

    // 3. Check if section was started during free trial and not yet completed
    const trialSecKey = `${prefix}_trial_section_${sectionId}${studentId ? `_${studentId}` : ''}`;
    const startedInTrial = localStorage.getItem(trialSecKey) === 'true' || localStorage.getItem(`${prefix}_trial_section_${sectionId}`) === 'true';
    if (startedInTrial) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
};

/**
 * Clear the exempt section once the student proceeds past it into the next section.
 */
export const clearPurchaseInProgressExemptSection = (
  courseId: string,
  sectionId: string,
  studentId?: string
): void => {
  try {
    const track = normalizeTrackId(courseId);
    const prefix = getStoragePrefix(track);
    const studentKey = `${prefix}_exempt_in_progress_section${studentId ? `_${studentId}` : ''}`;
    localStorage.removeItem(studentKey);
    localStorage.removeItem(`${prefix}_exempt_in_progress_section`);

    // Remove trial section marker for this completed section
    const trialSecKey = `${prefix}_trial_section_${sectionId}${studentId ? `_${studentId}` : ''}`;
    localStorage.removeItem(trialSecKey);
    localStorage.removeItem(`${prefix}_trial_section_${sectionId}`);

    const cleanEmail = normalizeStudentEmail(studentId && studentId.includes('@') ? studentId : undefined);
    if (cleanEmail && memoryCourseState[cleanEmail]?.exemptSections) {
      delete memoryCourseState[cleanEmail].exemptSections[track];
      delete memoryCourseState[cleanEmail].exemptSections[track.replace('-core', '')];
      memoryCourseState[cleanEmail].updatedAt = new Date().toISOString();
      queueCloudSync(cleanEmail);
    }
  } catch {}
};
