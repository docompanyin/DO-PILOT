import { useEffect, useRef } from 'react';

/**
 * Advances to the next question exactly 3 seconds after a correct answer.
 *
 * The countdown state is the single source of truth: when it becomes non-null
 * a timer is scheduled, and when it is reset to null (manual Continue, reset,
 * unmount) the timer is cleaned up. This prevents duplicate timers/redirects.
 */
export function useCorrectAutoAdvance(
  countdown: number | null,
  onAdvance: () => void
): void {
  const onAdvanceRef = useRef(onAdvance);
  onAdvanceRef.current = onAdvance;

  useEffect(() => {
    if (countdown === null) return;
    const timer = setTimeout(() => {
      onAdvanceRef.current();
    }, 3000);
    return () => clearTimeout(timer);
  }, [countdown]);
}
