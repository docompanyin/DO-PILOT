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
 * Determine the starting part after purchase based on overall Part 1 score:
 * - Apply this 50% rule ONLY to users who attempted the free trial and then purchased the course.
 * - Do not apply it to users who purchased before starting or to later parts.
 */
export const getPostPurchaseStartingPart = (
  courseId: string,
  currentUncompletedPart: number = 1,
  studentId?: string
): number => {
  const track = normalizeTrackId(courseId);

  // If student already progressed beyond Part 2 (e.g. Part 3, 4, etc.), keep their advance
  if (currentUncompletedPart > 2) {
    return currentUncompletedPart;
  }

  // Check if student attempted the free trial before purchase
  const trialAttempted = hasAttemptedTrial(track, studentId);
  if (!trialAttempted) {
    // Purchased before starting: start normally at Part 1 without 50% trial rule
    return currentUncompletedPart;
  }

  const { isAbove50 } = getPart1OverallScore(track, studentId);

  // For users who attempted the free trial and then purchased:
  // Total score >= 50% -> start directly from Part 2
  // Total score < 50% -> start again from Part 1
  return isAbove50 ? 2 : 1;
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
