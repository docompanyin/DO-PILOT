import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

export const isPythonPartIntroRequired = (partNum: number): boolean => {
  try {
    return localStorage.getItem(introRequiredKey(partNum)) === 'true';
  } catch {
    return false;
  }
};

export const markPythonPartIntroRequired = (partNum: number): void => {
  try {
    localStorage.setItem(introRequiredKey(partNum), 'true');
  } catch {
    /* storage unavailable */
  }
};

export const clearPythonPartIntroRequired = (partNum: number): void => {
  try {
    // Write an explicit "not required" marker instead of removing the key.
    // Keeping the key in cloud rawStorage lets a second device overwrite a
    // stale "true" marker after the student has already started this part.
    localStorage.setItem(introRequiredKey(partNum), 'false');
  } catch {
    /* storage unavailable */
  }
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
      if (isPythonPartIntroRequired(partNum)) setOpen(true);
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
        if (isPythonPartIntroRequired(partNum)) {
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
