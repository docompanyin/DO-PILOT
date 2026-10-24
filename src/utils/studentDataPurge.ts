/**
 * Complete Student Local Data Purge Utility
 * 
 * Safely and thoroughly purges all cached student data from localStorage across all modules:
 * - Course purchases, locks, claims
 * - Points, quiz attempts, wrong answers, consecutive failures
 * - Rewards, certificates, and session state
 */

import { clearMemoryCourseState } from './courseProgressSyncService';

export const purgeStudentLocalData = (studentEmail?: string, studentId?: string): void => {
  if (typeof window === 'undefined' || !window.localStorage) return;

  const cleanEmail = (studentEmail || '').toLowerCase().trim();
  const cleanId = (studentId || '').trim();
  const cleanIdLower = cleanId.toLowerCase();
  const emailSafe = cleanEmail ? cleanEmail.replace(/[^a-zA-Z0-9]/g, '_') : '';

  // 1. Dynamic scan across ALL localStorage keys matching email, emailSafe, or id
  const keysToRemove: string[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      const kLower = k.toLowerCase();
      if (
        (cleanEmail && (kLower.includes(cleanEmail) || (emailSafe && kLower.includes(emailSafe)))) ||
        (cleanIdLower && kLower.includes(cleanIdLower)) ||
        (cleanEmail && kLower.startsWith('dopilot_purchased_courses_') && kLower.includes(cleanEmail)) ||
        (cleanIdLower && kLower.startsWith('dopilot_purchased_courses_') && kLower.includes(cleanIdLower)) ||
        (emailSafe && kLower.startsWith('dopilot_user_') && kLower.includes(emailSafe))
      ) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (e) {
    console.warn('Error dynamically removing localStorage keys:', e);
  }

  // 2. Explicitly remove all known user-specific purchase and access keys
  if (cleanEmail) {
    localStorage.removeItem(`dopilot_purchased_courses_${cleanEmail}`);
    localStorage.removeItem(`dopilot_user_${emailSafe}_points`);
    localStorage.removeItem(`dopilot_user_${cleanEmail}_points`);
    localStorage.removeItem(`dopilot_active_student_certificate_${emailSafe}`);
    localStorage.removeItem(`dopilot_active_student_certificate_${cleanEmail}`);
    localStorage.removeItem(`dopilot_consecutive_failures_${cleanEmail}`);
  }
  if (cleanId) {
    localStorage.removeItem(`dopilot_purchased_courses_${cleanId}`);
    localStorage.removeItem(`dopilot_purchased_courses_${cleanIdLower}`);
    localStorage.removeItem(`dopilot_user_${cleanId}_points`);
    localStorage.removeItem(`dopilot_consecutive_failures_${cleanId}`);
    localStorage.removeItem(`dopilot_failed_levels_streak_${cleanId}`);
    localStorage.removeItem(`dopilot_locked_${cleanId}`);
    localStorage.removeItem(`dopilot_locked_progression_${cleanId}`);
  }
  if (emailSafe) {
    localStorage.removeItem(`dopilot_purchased_courses_${emailSafe}`);
  }

  // 3. Filter global course purchases registry: dopilot_course_purchases_v1
  try {
    const pRaw = localStorage.getItem('dopilot_course_purchases_v1');
    if (pRaw) {
      const pList = JSON.parse(pRaw);
      if (Array.isArray(pList)) {
        const filtered = pList.filter((p: any) => {
          const pe = (p?.studentEmail || '').toLowerCase().trim();
          const pi = (p?.studentId || '').toLowerCase().trim();
          const matchesEmail = cleanEmail && (pe === cleanEmail || pe.includes(cleanEmail) || pi === cleanEmail);
          const matchesId = cleanIdLower && (pi === cleanIdLower || pi.includes(cleanIdLower) || pe === cleanIdLower);
          // If either matches, purge the purchase record
          return !(matchesEmail || matchesId);
        });
        localStorage.setItem('dopilot_course_purchases_v1', JSON.stringify(filtered));
      }
    }
  } catch (e) {}

  // 4. Filter reward requests registry: dopilot_reward_requests_v1
  try {
    const rRaw = localStorage.getItem('dopilot_reward_requests_v1');
    if (rRaw) {
      const rList = JSON.parse(rRaw);
      if (Array.isArray(rList)) {
        const filtered = rList.filter((r: any) => {
          const re = (r?.studentEmail || '').toLowerCase().trim();
          const ri = (r?.studentId || '').toLowerCase().trim();
          const matchesEmail = cleanEmail && (re === cleanEmail || ri === cleanEmail);
          const matchesId = cleanIdLower && (ri === cleanIdLower || re === cleanIdLower);
          return !(matchesEmail || matchesId);
        });
        localStorage.setItem('dopilot_reward_requests_v1', JSON.stringify(filtered));
      }
    }
  } catch (e) {}

  // 5. Filter locked courses registry: dopilot_locked_courses_registry_v1
  try {
    const lRaw = localStorage.getItem('dopilot_locked_courses_registry_v1');
    if (lRaw) {
      const lList = JSON.parse(lRaw);
      if (Array.isArray(lList)) {
        const filtered = lList.filter((l: any) => {
          const le = (l?.studentEmail || '').toLowerCase().trim();
          const li = (l?.studentId || '').toLowerCase().trim();
          const matchesEmail = cleanEmail && (le === cleanEmail || li === cleanEmail);
          const matchesId = cleanIdLower && (li === cleanIdLower || le === cleanIdLower);
          return !(matchesEmail || matchesId);
        });
        localStorage.setItem('dopilot_locked_courses_registry_v1', JSON.stringify(filtered));
      }
    }
  } catch (e) {}

  // 6. Filter student help messages registry: dopilot_student_help_messages_v1
  try {
    const hRaw = localStorage.getItem('dopilot_student_help_messages_v1');
    if (hRaw) {
      const hList = JSON.parse(hRaw);
      if (Array.isArray(hList)) {
        const filtered = hList.filter((h: any) => {
          const he = (h?.studentEmail || '').toLowerCase().trim();
          const hi = (h?.studentId || '').toLowerCase().trim();
          const matchesEmail = cleanEmail && (he === cleanEmail || hi === cleanEmail);
          const matchesId = cleanIdLower && (hi === cleanIdLower || he === cleanIdLower);
          return !(matchesEmail || matchesId);
        });
        localStorage.setItem('dopilot_student_help_messages_v1', JSON.stringify(filtered));
      }
    }
  } catch (e) {}

  // 7. Check and clear active session & pending registration
  let isCurrentSessionUser = false;
  try {
    const curRaw = localStorage.getItem('dopilot_student_session_v1');
    if (curRaw) {
      const cur = JSON.parse(curRaw);
      const ce = (cur?.email || '').toLowerCase().trim();
      const ci = (cur?.id || '').toLowerCase().trim();
      if ((cleanEmail && ce === cleanEmail) || (cleanIdLower && ci === cleanIdLower) || (!cleanEmail && !cleanId)) {
        isCurrentSessionUser = true;
        localStorage.removeItem('dopilot_student_session_v1');
      }
    }

    const pendingRaw = localStorage.getItem('dopilot_pending_registration_v1');
    if (pendingRaw) {
      const p = JSON.parse(pendingRaw);
      const pe = (p?.email || '').toLowerCase().trim();
      const pi = (p?.id || '').toLowerCase().trim();
      if ((cleanEmail && pe === cleanEmail) || (cleanIdLower && pi === cleanIdLower) || (!cleanEmail && !cleanId)) {
        localStorage.removeItem('dopilot_pending_registration_v1');
      }
    }
  } catch (e) {
    console.warn('Error clearing session objects:', e);
  }

  // 8. Wipe all course progress, quiz attempts, points, scores, and certificates
  try {
    localStorage.removeItem('dopilot_course_points_v3');
    localStorage.removeItem('dopilot_active_student_certificate_v1');
    localStorage.removeItem('dopilot_python_certificate_record');
    localStorage.removeItem('dopilot_java_certificate_record');
    localStorage.removeItem('dopilot_fullstack_certificate_record');
    localStorage.removeItem('dopilot_cyber_certificate_record');
    localStorage.removeItem('dopilot_claimed_courses_v1');
    localStorage.removeItem('dopilot_quiz_wrong_attempts_v1');
    localStorage.removeItem('dopilot_fullstack_course_fully_certified');
    localStorage.removeItem('dopilot_active_section_id');
    localStorage.removeItem('dopilot_active_q_idx');
    localStorage.removeItem('dopilot_mcq_answers');
    localStorage.removeItem('dopilot_time_up');
    localStorage.removeItem('dopilot_q_target_end_time');
    localStorage.removeItem('dopilot_study_phase');

    // Purge part completion flags across all 4 courses
    for (let i = 0; i <= 20; i++) {
      localStorage.removeItem(`dopilot_part${i}_completed`);
      localStorage.removeItem(`dopilot_part${i}_finished`);
      localStorage.removeItem(`dopilot_part${i}_level_result`);
      localStorage.removeItem(`dopilot_part${i}_active_section_id`);
      localStorage.removeItem(`dopilot_part${i}_mcq_answers`);

      localStorage.removeItem(`dopilot_java_part${i}_completed`);
      localStorage.removeItem(`dopilot_java_part${i}_finished`);
      localStorage.removeItem(`dopilot_java_part${i}_level_result`);
      localStorage.removeItem(`dopilot_java_part${i}_active_section_id`);
      localStorage.removeItem(`dopilot_java_part${i}_mcq_answers`);

      localStorage.removeItem(`dopilot_fullstack_part${i}_completed`);
      localStorage.removeItem(`dopilot_fullstack_part${i}_finished`);
      localStorage.removeItem(`dopilot_fullstack_part${i}_level_result`);
      localStorage.removeItem(`dopilot_fullstack_p${i}_completed`);
      localStorage.removeItem(`dopilot_fullstack_p${i}_finished`);
      localStorage.removeItem(`dopilot_fullstack_p${i}_level_result`);
      localStorage.removeItem(`dopilot_fullstack_part${i}_active_section_id`);
      localStorage.removeItem(`dopilot_fullstack_part${i}_mcq_answers`);

      localStorage.removeItem(`dopilot_cyber_part${i}_completed`);
      localStorage.removeItem(`dopilot_cyber_part${i}_finished`);
      localStorage.removeItem(`dopilot_cyber_part${i}_level_result`);
      localStorage.removeItem(`dopilot_cyber_part${i}_active_section_id`);
      localStorage.removeItem(`dopilot_cyber_part${i}_mcq_answers`);

      if (cleanId) {
        localStorage.removeItem(`dopilot_consecutive_failures_${cleanId}`);
        localStorage.removeItem(`dopilot_part${i}_consecutive_failures_${cleanId}`);
        localStorage.removeItem(`dopilot_java_part${i}_consecutive_failures_${cleanId}`);
        localStorage.removeItem(`dopilot_fullstack_p${i}_consecutive_failures_${cleanId}`);
        localStorage.removeItem(`dopilot_cyber_part${i}_consecutive_failures_${cleanId}`);
      }
    }

    localStorage.removeItem('dopilot_completed');
    localStorage.removeItem('dopilot_java_completed');
    localStorage.removeItem('dopilot_fullstack_completed');
    localStorage.removeItem('dopilot_cyber_completed');
    localStorage.removeItem('dopilot_python_core_last_part');
    localStorage.removeItem('dopilot_java_core_last_part');
    localStorage.removeItem('dopilot_fullstack_core_last_part');
    localStorage.removeItem('dopilot_cyber_core_last_part');

    // Clear global unlock flags if any were set
    localStorage.removeItem('dopilot_purchased_python-core_global');
    localStorage.removeItem('dopilot_purchased_java-core_global');
    localStorage.removeItem('dopilot_purchased_fullstack-open_global');
    localStorage.removeItem('dopilot_purchased_cyber-security_global');
  } catch (e) {
    console.warn('Error clearing course flags:', e);
  }

  // 9. Clear cloud in-memory cache
  try {
    clearMemoryCourseState(cleanEmail);
  } catch (e) {}

  // 10. Dispatch notification events
  try {
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('dopilot_course_purchased'));
    window.dispatchEvent(new CustomEvent('dopilot_points_updated', { detail: { points: 0 } }));
    if (isCurrentSessionUser) {
      window.dispatchEvent(new CustomEvent('dopilot_user_logged_out'));
    }
  } catch (e) {}
};

/**
 * Permanently removes all fake dummy students and their associated mock records
 */
export const purgeAllDummyDemoData = (): void => {
  if (typeof window === 'undefined' || !window.localStorage) return;

  const dummyEmails = [
    'rahul.verma@techsprint.io',
    'priya.patel@gmail.com',
    'ananya.iyer99@gmail.com',
    'karthik.raja@outlook.com',
    'suresh.k@gmail.com',
    'aditya.sharma@gmail.com',
    'sneha.k@outlook.com',
    'vikram.singh@nitw.ac.in',
    'ananya.sharma@appscale.dev'
  ];

  const dummyIds = [
    'demo-std-1',
    'demo-std-2',
    'demo-std-3',
    'demo-std-4',
    'demo-std-5',
    'demo-std-6'
  ];

  dummyEmails.forEach((email, idx) => {
    purgeStudentLocalData(email, dummyIds[idx]);
  });

  dummyIds.forEach((id) => {
    purgeStudentLocalData(undefined, id);
  });

  localStorage.removeItem('dopilot_permanently_deleted_demos_v1');
};

/**
 * Permanently mark a student as deleted: blacklists email and purges active session
 */
export const markStudentPermanentlyDeleted = (email?: string, id?: string): void => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  const cleanEmail = (email || '').toLowerCase().trim();

  if (cleanEmail) {
    try {
      const bRaw = localStorage.getItem('dopilot_permanently_deleted_students_v1');
      const bList: string[] = bRaw ? JSON.parse(bRaw) : [];
      if (Array.isArray(bList) && !bList.includes(cleanEmail)) {
        bList.push(cleanEmail);
        localStorage.setItem('dopilot_permanently_deleted_students_v1', JSON.stringify(bList));
      }
    } catch {}
  }

  purgeStudentLocalData(cleanEmail, id);
  window.dispatchEvent(new CustomEvent('dopilot_user_logged_out'));
  window.dispatchEvent(new Event('storage'));
};

