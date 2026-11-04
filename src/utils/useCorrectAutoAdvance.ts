import { useEffect, useRef } from 'react';

/**
 * Advances to the next question exactly 3 seconds after a correct answer.
 *
 * The countdown state is the single source of truth: when it becomes non-null
 * a timer is scheduled, and when it is reset to null (manual Continue, reset,
 * unmount) the timer is cleaned up. This prevents duplicate timers/redirects.
 *
 * The navigation timer depends on the boolean "active" state rather than the
 * numeric value so the visible 3 -> 2 -> 1 countdown can tick without resetting
 * the 3-second navigation timer.
 */
export function useCorrectAutoAdvance(
  countdown: number | null,
  onAdvance: () => void,
  setCountdown?: (value: number | null) => void,
  isCorrectAnswerPendingAdvance?: boolean
): void {
  const onAdvanceRef = useRef(onAdvance);
  onAdvanceRef.current = onAdvance;

  // Auto-initiate the 3-second countdown if resuming a correctly answered question that has not advanced yet
  useEffect(() => {
    if (isCorrectAnswerPendingAdvance && countdown === null && setCountdown) {
      setCountdown(3);
    }
  }, [isCorrectAnswerPendingAdvance, countdown, setCountdown]);

  const isActive = countdown !== null;

  useEffect(() => {
    if (!isActive) return;
    const timer = setTimeout(() => {
      onAdvanceRef.current();
    }, 3000);
    return () => clearTimeout(timer);
  }, [isActive]);

  // Tick the visible countdown once per second, stopping at 1.
  useEffect(() => {
    if (!setCountdown || countdown === null || countdown <= 1) return;
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown, setCountdown]);
}
