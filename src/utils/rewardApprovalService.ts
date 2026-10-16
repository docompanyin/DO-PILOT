import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface RewardRequest {
  id: string;
  studentId?: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  collegeOrCompany?: string;
  milestoneId: string;       // e.g. 'cash-50', 'cash-100', 'cash-250', 'cash-500'
  milestonePoints: number;   // e.g. 50, 100, 250, 500
  rewardAmount: number;      // e.g. 50, 100, 250, 500
  pointsBalance: number;     // e.g. 52
  status: 'pending' | 'approved';
  requestedAt: string;       // ISO date string
  approvedAt?: string;       // ISO date string
  adminNotes?: string;
}

export const REWARDS_STORAGE_KEY = 'dopilot_reward_requests_v1';

const INITIAL_DEMO_REWARDS: RewardRequest[] = [
  {
    id: 'REW-501',
    studentId: 'demo-std-1',
    studentName: 'Rahul Verma',
    studentEmail: 'rahul.verma@techsprint.io',
    studentPhone: '+91 98450 12345',
    collegeOrCompany: 'IIT Bombay',
    milestoneId: 'cash-50',
    milestonePoints: 50,
    rewardAmount: 50,
    pointsBalance: 58,
    status: 'pending',
    requestedAt: new Date(Date.now() - 4 * 3600000).toISOString()
  },
  {
    id: 'REW-502',
    studentId: 'demo-std-2',
    studentName: 'Priya Patel',
    studentEmail: 'priya.patel@gmail.com',
    studentPhone: '+91 98765 43210',
    collegeOrCompany: 'SRM Institute',
    milestoneId: 'cash-50',
    milestonePoints: 50,
    rewardAmount: 50,
    pointsBalance: 62,
    status: 'approved',
    requestedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    approvedAt: new Date(Date.now() - 12 * 3600000).toISOString()
  }
];

export const getRewardRequests = (): RewardRequest[] => {
  try {
    const raw = localStorage.getItem(REWARDS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_REWARDS));
      return INITIAL_DEMO_REWARDS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_DEMO_REWARDS;
  } catch (err) {
    console.error('Failed to read reward requests from storage:', err);
    return INITIAL_DEMO_REWARDS;
  }
};

export const submitRewardRequest = (
  data: Omit<RewardRequest, 'id' | 'requestedAt' | 'status'>
): { success: boolean; error?: string; request?: RewardRequest } => {
  const current = getRewardRequests();

  // Prevent duplicate requests for the same milestone by the same student
  const existing = current.find(
    (r) =>
      r.studentEmail.toLowerCase() === data.studentEmail.toLowerCase() &&
      r.milestoneId === data.milestoneId
  );

  if (existing) {
    if (existing.status === 'approved') {
      return { success: false, error: 'This milestone reward has already been approved.' };
    }
    return { success: false, error: 'You already have a pending approval request for this milestone.' };
  }

  // Validate eligible points
  if (data.pointsBalance < data.milestonePoints) {
    return {
      success: false,
      error: `You need at least ${data.milestonePoints} points to request this milestone (current: ${data.pointsBalance}).`
    };
  }

  const newRequest: RewardRequest = {
    ...data,
    id: `REW-${Date.now().toString().slice(-6)}`,
    requestedAt: new Date().toISOString(),
    status: 'pending'
  };

  const updated = [newRequest, ...current];
  try {
    localStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('dopilot_reward_request_update', { detail: newRequest }));
  } catch (err) {
    console.error('Failed to write reward request to storage:', err);
  }

  // Background sync to Supabase if configured
  if (isSupabaseConfigured()) {
    Promise.resolve(
      supabase.from('reward_requests').upsert({
        id: newRequest.id,
        student_id: newRequest.studentId || null,
        student_name: newRequest.studentName,
        student_email: newRequest.studentEmail,
        student_phone: newRequest.studentPhone || null,
        college_or_company: newRequest.collegeOrCompany || null,
        milestone_id: newRequest.milestoneId,
        milestone_points: newRequest.milestonePoints,
        reward_amount: newRequest.rewardAmount,
        points_balance: newRequest.pointsBalance,
        status: newRequest.status,
        requested_at: newRequest.requestedAt,
        updated_at: new Date().toISOString()
      })
    ).catch(() => {
      // Supabase table may not exist yet, local persistence is guaranteed
    });
  }

  return { success: true, request: newRequest };
};

export const approveRewardRequest = (
  requestId: string,
  adminNotes?: string
): boolean => {
  const current = getRewardRequests();
  let found = false;

  const updated = current.map((req) => {
    if (req.id === requestId) {
      found = true;
      return {
        ...req,
        status: 'approved' as const,
        approvedAt: new Date().toISOString(),
        adminNotes: adminNotes || req.adminNotes
      };
    }
    return req;
  });

  if (!found) return false;

  try {
    localStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('dopilot_reward_request_update', { detail: { requestId, status: 'approved' } }));
  } catch (err) {
    console.error('Failed to update reward request in storage:', err);
    return false;
  }

  // Background sync to Supabase
  if (isSupabaseConfigured()) {
    Promise.resolve(
      supabase
        .from('reward_requests')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          admin_notes: adminNotes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
    ).catch(() => {});
  }

  return true;
};

export const getStudentRewardRequests = (studentEmail: string): RewardRequest[] => {
  if (!studentEmail) return [];
  const current = getRewardRequests();
  return current.filter(
    (r) => r.studentEmail.toLowerCase() === studentEmail.toLowerCase()
  );
};

export const getStudentRewardStatus = (
  studentEmail: string,
  milestoneId: string
): RewardRequest | undefined => {
  if (!studentEmail) return undefined;
  const current = getRewardRequests();
  return current.find(
    (r) =>
      r.studentEmail.toLowerCase() === studentEmail.toLowerCase() &&
      r.milestoneId === milestoneId
  );
};
