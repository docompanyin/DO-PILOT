/**
 * lockNotificationService.ts
 * Dispatches secure, deduplicated lock notifications to Telegram via backend API
 * when a student reaches 3 consecutive failed levels.
 */

import { recordCourseLock } from './courseResetService';

export interface CourseLockPayload {
  courseId: string;
  courseName?: string;
  partNum: number;
  sectionId: string;
  sectionTitle?: string;
  activeQuestionIdx?: number;
  totalQuestions?: number;
  score?: number;
  percentage?: number;
  streak: number;
  attemptCount?: number;
  studentId: string;
  studentEmail?: string;
  studentName?: string;
  studentPhone?: string;
  collegeOrCompany?: string;
  earnedPoints?: number;
}

export const notifyCourseLocked = async (
  payload: CourseLockPayload
): Promise<{ success: boolean; duplicate?: boolean; notConfigured?: boolean }> => {
  // Only trigger when course is locked (streak >= 3)
  if (Number(payload.streak) < 3) {
    return { success: false };
  }

  // Authoritatively record lock in Course Reset directory
  try {
    recordCourseLock({
      studentId: payload.studentId,
      studentName: payload.studentName,
      studentEmail: payload.studentEmail,
      studentPhone: payload.studentPhone,
      collegeOrCompany: payload.collegeOrCompany,
      courseId: payload.courseId.includes('python') ? 'python' : payload.courseId,
      courseName: payload.courseName || 'Complete Python Course',
      partNum: payload.partNum,
      failedPart: `Part ${payload.partNum}`,
      failedSection: payload.sectionTitle || payload.sectionId,
      failedSectionId: payload.sectionId,
      consecutiveFailures: Number(payload.streak) || 3,
      progressSummary: `Part ${payload.partNum}: ${payload.sectionTitle || payload.sectionId} • Lock Active`,
      earnedPoints: payload.earnedPoints || 0
    });
  } catch (err) {
    console.warn('Failed to record course lock locally:', err);
  }

  const cleanEmail = (payload.studentEmail || '').toLowerCase().trim();
  const cleanId = (payload.studentId || '').trim();
  const dedupeKey = `dopilot_lock_notified_${cleanEmail || cleanId}_${payload.courseId}_part${payload.partNum}_streak${payload.streak}`;

  // 1. Client-side deduplication check: avoid duplicate requests on re-renders
  try {
    const existing = localStorage.getItem(dedupeKey);
    if (existing) {
      return { success: true, duplicate: true };
    }
  } catch {}

  // Mark locally immediately before network flight
  try {
    localStorage.setItem(dedupeKey, new Date().toISOString());
  } catch {}

  // 2. Dispatch to backend API route (api/notify-locked.js)
  try {
    const resp = await fetch('/api/notify-locked', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Student-Email': cleanEmail,
        'X-Student-Id': cleanId
      },
      body: JSON.stringify({
        ...payload,
        courseName: payload.courseName || 'Complete Python Programming'
      })
    });

    const data = await resp.json().catch(() => null);
    return {
      success: Boolean(resp.ok && (data?.success || data?.delivered)),
      duplicate: Boolean(data?.duplicate),
      notConfigured: Boolean(data?.notConfigured)
    };
  } catch (err) {
    console.warn('Network error dispatching course lock notification:', err);
    return { success: false };
  }
};
