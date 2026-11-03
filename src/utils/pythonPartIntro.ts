import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourseStorageKeys, memoryCourseState } from './courseProgressSyncService';

/**
 * Part introduction persistence helpers.
 *
 * The introduction for Part N is rendered by the Part N-1 page. Until the
 * student explicitly clicks "Start Part N", we keep a durable marker so the
 * introduction is restored after refresh, cache clearing, logout/login,
 * Back/Forward navigation, and cross-device login.
 *
 * The key intentionally does not contain "pending_" so the existing cloud
 * rawStorage interceptor stores it with the rest of the dopilot_ state.
 */
const introRequiredKey = (partNum: number): string =>
  `dopilot_python_intro_required_${partNum}`;

/**
 * Local-only hint that the student already clicked "Start Part N" on this
 * device. It deliberately does not start with "dopilot_" so the cloud
 * rawStorage interceptor does not sync it; it only exists to keep a refresh
 * from re-applying a stale cloud "required" snapshot.
 */
const introStartedKey = (partNum: number): string =>
  `python_course_intro_started_${partNum}`;

/**
 * Parts the student has explicitly started during this app session.
 *
 * A cloud restore can land after the student clicks "Start Part N" and write
 * back an older "required" marker (the snapshot was taken before the click).
 * That made the route guard bounce the first question back to the
 * introduction several times. Once the student has explicitly started a part,
 * a late restore must not send them back for the rest of the session.
 */
const startedParts = new Set<number>();

export const isPythonPartIntroRequired = (partNum: number): boolean => {
  if (startedParts.has(partNum)) return false;
  try {
    if (localStorage.getItem(introStartedKey(partNum)) === 'true') return false;
    return localStorage.getItem(introRequiredKey(partNum)) === 'true';
  } catch {
    return false;
  }
};

export const markPythonPartIntroRequired = (partNum: number): void => {
  startedParts.delete(partNum);
  try {
    // An explicit new requirement always wins over the local started hint.
    localStorage.removeItem(introStartedKey(partNum));
    localStorage.setItem(introRequiredKey(partNum), 'true');
  } catch {
    /* storage unavailable */
  }
};

export const clearPythonPartIntroRequired = (partNum: number): void => {
  startedParts.add(partNum);
  try {
    // Remember the explicit start locally so a refresh (and a late stale
    // cloud restore) cannot bounce the first question back to the intro.
    localStorage.setItem(introStartedKey(partNum), 'true');
    // Write an explicit "not required" marker instead of removing the key.
    // Keeping the key in cloud rawStorage lets a second device overwrite a
    // stale "true" marker after the student has already started this part.
    localStorage.setItem(introRequiredKey(partNum), 'false');
  } catch {
    /* storage unavailable */
  }
};

/**
 * True when Part N already contains real student progress, regardless of what
 * an old `dopilot_python_intro_required_N` marker says.
 *
 * A stale "required" marker used to send a student who was halfway through a
 * part (for example Part 9, question 9.3.5) back to that part's introduction
 * after refresh / cache clearing / logout-login. The introduction must only be
 * enforced when the part has no progress at all.
 */
const hasPartProgress = (partNum: number): boolean => {
  const isProgressedPartState = (part: any): boolean => {
    if (!part) return false;
    if (part.isFinishedPart || part.isCompleted) return true;
    if (part.levelResult?.isFinished) return true;
    if (typeof part.activeQuestionIdx === 'number' && part.activeQuestionIdx > 0) return true;
    if (
      part.activeSectionId &&
      !String(part.activeSectionId).startsWith(`${partNum}-1-`)
    ) {
      return true;
    }
    if (part.selectedAnswers && Object.keys(part.selectedAnswers).length > 0) {
      return true;
    }
    return false;
  };

  try {
    // 1. Check the in-memory cloud snapshot (covers a part whose state was
    //    restored in this app session but not yet re-written to localStorage).
    for (const state of Object.values(memoryCourseState)) {
      const part = state?.courses?.['python-core']?.parts?.[String(partNum)];
      if (isProgressedPartState(part)) return true;
    }

    // 2. Check the persisted keys used by the part page.
    const keys = getCourseStorageKeys('python-core', partNum);

    const sectionId = localStorage.getItem(keys.sectionIdKey) || '';
    if (sectionId && !sectionId.startsWith(`${partNum}-1-`)) return true;

    const qIdx = Number(localStorage.getItem(keys.questionIdxKey) || '0');
    if (qIdx > 0) return true;

    if (localStorage.getItem(keys.completedKey) === 'true') return true;
    if (localStorage.getItem(keys.finishedKey) === 'true') return true;

    const answersRaw = localStorage.getItem(keys.answersKey);
    if (answersRaw) {
      const answers = JSON.parse(answersRaw);
      if (answers && Object.keys(answers).length > 0) return true;
    }

    const resultRaw = localStorage.getItem(keys.levelResultKey);
    if (resultRaw) {
      const result = JSON.parse(resultRaw);
      if (result?.isFinished) return true;
    }
  } catch {
    /* storage unavailable or malformed state */
  }

  return false;
};

/**
 * Re-opens the introduction modal if the durable marker arrives after mount
 * (for example when cloud progress is restored on a new device).
 */
export function usePythonPartIntroModal(
  partNum: number,
  setOpen: (open: boolean) => void
): void {
  useEffect(() => {
    const sync = () => {
      if (isPythonPartIntroRequired(partNum) && !hasPartProgress(partNum)) setOpen(true);
    };

    sync();
    window.addEventListener('dopilot_progress_restored', sync);
    window.addEventListener('storage', sync);

    return () => {
      window.removeEventListener('dopilot_progress_restored', sync);
      window.removeEventListener('storage', sync);
    };
  }, [partNum, setOpen]);
}

/**
 * Prevents direct navigation to Part N from skipping its introduction.
 * When the introduction is still required, send the student back to the
 * Part N-1 page that renders it. Review mode is never redirected.
 */
export function usePythonPartIntroGuard(partNum: number): void {
  const navigate = useNavigate();

  useEffect(() => {
    const check = () => {
      try {
        if (new URLSearchParams(window.location.search).get('review') === 'true') {
          return;
        }
        if (isPythonPartIntroRequired(partNum) && !hasPartProgress(partNum)) {
          navigate(`/course/python-core/part-${partNum - 1}`, { replace: true });
        }
      } catch {
        /* ignore unavailable storage / navigation */
      }
    };

    check();
    window.addEventListener('dopilot_progress_restored', check);
    window.addEventListener('storage', check);

    return () => {
      window.removeEventListener('dopilot_progress_restored', check);
      window.removeEventListener('storage', check);
    };
  }, [partNum, navigate]);
}
