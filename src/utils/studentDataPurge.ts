/**
 * Complete Student Local Data Purge Utility
 * 
 * Safely and thoroughly purges all cached student data from localStorage across all modules:
 * - Course purchases, locks, claims
 * - Points, quiz attempts, wrong answers, consecutive failures
 * - Rewards, certificates, and session state
 */

export const purgeStudentLocalData = (studentEmail?: string, studentId?: string): void => {
  if (typeof window === 'undefined' || !window.localStorage) return;

  const cleanEmail = (studentEmail || '').toLowerCase().trim();
  const cleanId = (studentId || '').toLowerCase().trim();
  const emailSafe = cleanEmail.replace(/[^a-zA-Z0-9]/g, '_');

  // 1. Dynamic scan across ALL localStorage keys matching email, emailSafe, or id
  const keysToRemove: string[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      const kLower = k.toLowerCase();
      if (
        (cleanEmail && kLower.includes(cleanEmail)) ||
        (emailSafe && kLower.includes(emailSafe)) ||
        (cleanId && kLower.includes(cleanId))
      ) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (e) {
    console.warn('Error dynamically removing localStorage keys:', e);
  }

  // 2. Filter global course purchases registry: dopilot_course_purchases_v1
  try {
    const pRaw = localStorage.getItem('dopilot_course_purchases_v1');
    if (pRaw) {
      const pList = JSON.parse(pRaw);
      if (Array.isArray(pList)) {
        const filtered = pList.filter((p: any) => {
          const pe = (p.studentEmail || '').toLowerCase().trim();
          const pi = (p.studentId || '').toLowerCase().trim();
          return (!cleanEmail || pe !== cleanEmail) && (!cleanId || pi !== cleanId);
        });
        localStorage.setItem('dopilot_course_purchases_v1', JSON.stringify(filtered));
      }
    }
  } catch (e) {}

  // 3. Filter reward requests registry: dopilot_reward_requests_v1
  try {
    const rRaw = localStorage.getItem('dopilot_reward_requests_v1');
    if (rRaw) {
      const rList = JSON.parse(rRaw);
      if (Array.isArray(rList)) {
        const filtered = rList.filter((r: any) => {
          const re = (r.studentEmail || '').toLowerCase().trim();
          const ri = (r.studentId || '').toLowerCase().trim();
          return (!cleanEmail || re !== cleanEmail) && (!cleanId || ri !== cleanId);
        });
        localStorage.setItem('dopilot_reward_requests_v1', JSON.stringify(filtered));
      }
    }
  } catch (e) {}

  // 4. Filter locked courses registry: dopilot_locked_courses_registry_v1
  try {
    const lRaw = localStorage.getItem('dopilot_locked_courses_registry_v1');
    if (lRaw) {
      const lList = JSON.parse(lRaw);
      if (Array.isArray(lList)) {
        const filtered = lList.filter((l: any) => {
          const le = (l.studentEmail || '').toLowerCase().trim();
          const li = (l.studentId || '').toLowerCase().trim();
          return (!cleanEmail || le !== cleanEmail) && (!cleanId || li !== cleanId);
        });
        localStorage.setItem('dopilot_locked_courses_registry_v1', JSON.stringify(filtered));
      }
    }
  } catch (e) {}

  // 5. Filter student help messages registry: dopilot_student_help_messages_v1
  try {
    const hRaw = localStorage.getItem('dopilot_student_help_messages_v1');
    if (hRaw) {
      const hList = JSON.parse(hRaw);
      if (Array.isArray(hList)) {
        const filtered = hList.filter((h: any) => {
          const he = (h.studentEmail || '').toLowerCase().trim();
          const hi = (h.studentId || '').toLowerCase().trim();
          return (!cleanEmail || he !== cleanEmail) && (!cleanId || hi !== cleanId);
        });
        localStorage.setItem('dopilot_student_help_messages_v1', JSON.stringify(filtered));
      }
    }
  } catch (e) {}

  // 6. Check active student session and purge if matching
  try {
    const curRaw = localStorage.getItem('dopilot_student_session_v1');
    let isActive = false;
    if (curRaw) {
      const cur = JSON.parse(curRaw);
      const ce = (cur?.email || '').toLowerCase().trim();
      const ci = (cur?.id || '').toLowerCase().trim();
      if ((cleanEmail && ce === cleanEmail) || (cleanId && ci === cleanId)) {
        isActive = true;
      }
    }

    const pendingRaw = localStorage.getItem('dopilot_pending_registration_v1');
    if (pendingRaw) {
      const p = JSON.parse(pendingRaw);
      const pe = (p?.email || '').toLowerCase().trim();
      const pi = (p?.id || '').toLowerCase().trim();
      if ((cleanEmail && pe === cleanEmail) || (cleanId && pi === cleanId)) {
        isActive = true;
      }
    }

    if (isActive) {
      localStorage.removeItem('dopilot_student_session_v1');
      localStorage.removeItem('dopilot_pending_registration_v1');
      localStorage.removeItem('dopilot_course_points_v3');
      localStorage.removeItem('dopilot_active_student_certificate_v1');
      localStorage.removeItem('dopilot_quiz_wrong_attempts_v1');
      localStorage.removeItem('dopilot_fullstack_course_fully_certified');
      localStorage.removeItem('dopilot_active_section_id');

      // Purge part completion flags
      for (let i = 0; i <= 20; i++) {
        localStorage.removeItem(`dopilot_part${i}_completed`);
        localStorage.removeItem(`dopilot_java_part${i}_completed`);
        localStorage.removeItem(`dopilot_fullstack_part${i}_completed`);
        localStorage.removeItem(`dopilot_cyber_part${i}_completed`);
        localStorage.removeItem(`dopilot_consecutive_failures_${cleanId}`);
        localStorage.removeItem(`dopilot_part${i}_consecutive_failures_${cleanId}`);
        localStorage.removeItem(`dopilot_java_part${i}_consecutive_failures_${cleanId}`);
        localStorage.removeItem(`dopilot_fullstack_p${i}_consecutive_failures_${cleanId}`);
        localStorage.removeItem(`dopilot_cyber_part${i}_consecutive_failures_${cleanId}`);
      }
      localStorage.removeItem('dopilot_completed');
      localStorage.removeItem('dopilot_java_completed');
      localStorage.removeItem('dopilot_fullstack_completed');
      localStorage.removeItem('dopilot_cyber_completed');
      localStorage.removeItem('dopilot_python_core_last_part');
      localStorage.removeItem('dopilot_java_core_last_part');
      localStorage.removeItem('dopilot_fullstack_core_last_part');
      localStorage.removeItem('dopilot_cyber_core_last_part');

      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('dopilot_user_logged_out'));
      window.dispatchEvent(new CustomEvent('dopilot_points_updated', { detail: { points: 0 } }));
      window.dispatchEvent(new CustomEvent('dopilot_course_purchased'));
    }
  } catch (e) {
    console.warn('Error purging student session data:', e);
  }
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

