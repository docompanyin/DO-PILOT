import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface RewardRequest {
  id: string;
  studentId?: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  collegeOrCompany?: string;
  courseTitle?: string;
  milestoneId: string;       // e.g. 'cash-200', 'cash-400', 'cash-700', 'cash-1000'
  milestonePoints: number;   // e.g. 200, 400, 700, 1000
  rewardAmount: number;      // e.g. 200, 400, 700, 1000
  pointsBalance: number;     // e.g. 52
  status: 'pending' | 'approved';
  requestedAt: string;       // ISO date string
  approvedAt?: string;       // ISO date string
  adminNotes?: string;
}

export const REWARDS_STORAGE_KEY = 'dopilot_reward_requests_v1';
export const CLOUD_REWARD_REQUESTS_ID = 'telemetry_dopilot_reward_requests_v1';

let memoryRewardsCache: RewardRequest[] | null = null;
let hasInitiatedCloudRewardsSync = false;

/**
 * Synchronize reward requests from Supabase cloud (site_content)
 * Guarantees cross-device persistence across mobile phones, laptops, and PCs
 */
export const syncRewardRequestsFromCloud = async (): Promise<RewardRequest[]> => {
  if (!isSupabaseConfigured()) {
    return getRewardRequests();
  }

  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('id', CLOUD_REWARD_REQUESTS_ID)
      .maybeSingle();

    if (!error && data && data.content && Array.isArray(data.content.requests)) {
      const cloudRequests: RewardRequest[] = data.content.requests;
      const realOnly = cloudRequests.filter(
        (r) => !r.studentId?.startsWith('demo-std') && !r.studentEmail?.includes('techsprint.io')
      );
      memoryRewardsCache = realOnly;
      try {
        localStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(realOnly));
        window.dispatchEvent(new CustomEvent('dopilot_reward_request_update', { detail: realOnly }));
      } catch {}
      return realOnly;
    }
  } catch (err) {
    console.warn('Failed to sync reward requests from Supabase cloud:', err);
  }

  return getRewardRequests();
};

/**
 * Persist reward requests to Supabase cloud (site_content)
 */
export const persistRewardRequestsToCloud = async (requests: RewardRequest[]): Promise<void> => {
  memoryRewardsCache = requests;
  try {
    localStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(requests));
  } catch {}

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('site_content').upsert({
        id: CLOUD_REWARD_REQUESTS_ID,
        content: {
          requests,
          updatedAt: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Failed to persist reward requests to site_content cloud:', e);
    }
  }
};

export const getRewardRequests = (): RewardRequest[] => {
  if (memoryRewardsCache && Array.isArray(memoryRewardsCache)) {
    if (!hasInitiatedCloudRewardsSync) {
      hasInitiatedCloudRewardsSync = true;
      syncRewardRequestsFromCloud().catch(() => {});
    }
    return memoryRewardsCache;
  }

  try {
    const raw = localStorage.getItem(REWARDS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify([]));
      if (!hasInitiatedCloudRewardsSync) {
        hasInitiatedCloudRewardsSync = true;
        syncRewardRequestsFromCloud().catch(() => {});
      }
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const realOnly = parsed.filter(
        (r: any) => !r.studentId?.startsWith('demo-std') && !r.studentEmail?.includes('techsprint.io')
      );
      if (realOnly.length !== parsed.length) {
        localStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(realOnly));
      }
      memoryRewardsCache = realOnly;
      if (!hasInitiatedCloudRewardsSync) {
        hasInitiatedCloudRewardsSync = true;
        syncRewardRequestsFromCloud().catch(() => {});
      }
      return realOnly;
    }
    if (!hasInitiatedCloudRewardsSync) {
      hasInitiatedCloudRewardsSync = true;
      syncRewardRequestsFromCloud().catch(() => {});
    }
    return [];
  } catch (err) {
    console.error('Failed to read reward requests from storage:', err);
    return [];
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
  memoryRewardsCache = updated;

  try {
    localStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('dopilot_reward_request_update', { detail: newRequest }));
  } catch (err) {
    console.error('Failed to write reward request to storage:', err);
  }

  // Authoritative persistence to central Supabase cloud database
  persistRewardRequestsToCloud(updated).catch(() => {});

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

  memoryRewardsCache = updated;

  try {
    localStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('dopilot_reward_request_update', { detail: { requestId, status: 'approved' } }));
  } catch (err) {
    console.error('Failed to update reward request in storage:', err);
    return false;
  }

  // Authoritative persistence to central Supabase cloud database
  persistRewardRequestsToCloud(updated).catch(() => {});

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
