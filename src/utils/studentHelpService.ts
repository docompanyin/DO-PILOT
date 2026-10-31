import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface StudentHelpMessage {
  id: string;
  studentId?: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  courseTitle: string;
  courseId: string;
  message: string;
  submittedAt: string; // ISO date string
  status: 'pending' | 'resolved';
  adminNotes?: string;
}

export interface SupportChannelsConfig {
  phone: string;
  whatsapp: string;
  updatedAt?: string;
}

const STORAGE_KEY = 'dopilot_student_help_messages_v1';
const CHANNELS_STORAGE_KEY = 'dopilot_support_channels_v1';
const CLOUD_HELP_MESSAGES_DOC_ID = 'student_help_messages_v1';
const CLOUD_SUPPORT_CHANNELS_DOC_ID = 'support_channels_v1';

let memoryHelpCache: StudentHelpMessage[] | null = null;
let memoryChannelsCache: SupportChannelsConfig | null = null;
let hasInitiatedCloudSync = false;

export const getStudentHelpMessages = (): StudentHelpMessage[] => {
  if (memoryHelpCache !== null) {
    return memoryHelpCache;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      memoryHelpCache = [];
      if (!hasInitiatedCloudSync) {
        hasInitiatedCloudSync = true;
        syncStudentHelpFromCloud().catch(() => {});
      }
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const realOnly: StudentHelpMessage[] = parsed
        .filter((h: any) => !h.studentId?.startsWith('demo-std') && !h.studentEmail?.includes('techsprint.io'))
        .map((h: any) => ({
          ...h,
          status: h.status === 'resolved' ? 'resolved' : 'pending'
        }));
      memoryHelpCache = realOnly;
      if (!hasInitiatedCloudSync) {
        hasInitiatedCloudSync = true;
        syncStudentHelpFromCloud().catch(() => {});
      }
      return realOnly;
    }
  } catch (err) {
    console.error('Failed to read student help messages from storage', err);
  }

  memoryHelpCache = [];
  if (!hasInitiatedCloudSync) {
    hasInitiatedCloudSync = true;
    syncStudentHelpFromCloud().catch(() => {});
  }
  return [];
};

/**
 * Synchronize student help messages from Supabase central database
 */
export const syncStudentHelpFromCloud = async (): Promise<StudentHelpMessage[]> => {
  if (!isSupabaseConfigured()) {
    return getStudentHelpMessages();
  }

  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('id', CLOUD_HELP_MESSAGES_DOC_ID)
      .maybeSingle();

    if (!error && data?.content && Array.isArray(data.content.messages)) {
      const cloudMessages: StudentHelpMessage[] = data.content.messages.map((m: any) => ({
        ...m,
        status: m.status === 'resolved' ? 'resolved' : 'pending'
      }));

      // Merge local with cloud if any unsynced
      const local = memoryHelpCache || [];
      const mergedMap = new Map<string, StudentHelpMessage>();
      cloudMessages.forEach(m => mergedMap.set(m.id, m));
      local.forEach(m => {
        if (!mergedMap.has(m.id)) {
          mergedMap.set(m.id, m);
        }
      });

      const merged = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );

      memoryHelpCache = merged;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        window.dispatchEvent(new CustomEvent('dopilot_student_help_update', { detail: merged }));
      } catch {}
      return merged;
    }
  } catch (err) {
    console.warn('Failed to sync student help messages from Supabase:', err);
  }

  return getStudentHelpMessages();
};

/**
 * Persist help messages to central database
 */
export const persistStudentHelpToCloud = async (messages: StudentHelpMessage[]): Promise<void> => {
  memoryHelpCache = messages;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    window.dispatchEvent(new CustomEvent('dopilot_student_help_update', { detail: messages }));
  } catch {}

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('site_content').upsert({
        id: CLOUD_HELP_MESSAGES_DOC_ID,
        content: {
          messages,
          updatedAt: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Failed to persist student help messages to Supabase:', e);
    }
  }
};

/**
 * Submit a help message from user side
 */
export const submitStudentHelpMessage = async (
  data: Omit<StudentHelpMessage, 'id' | 'submittedAt' | 'status'>
): Promise<StudentHelpMessage> => {
  // Fresh sync first
  await syncStudentHelpFromCloud().catch(() => {});

  const current = getStudentHelpMessages();
  const newMessage: StudentHelpMessage = {
    ...data,
    id: "HELP-" + Date.now().toString().slice(-6),
    submittedAt: new Date().toISOString(),
    status: 'pending',
    adminNotes: ''
  };

  const updated = [newMessage, ...current];
  await persistStudentHelpToCloud(updated);
  return newMessage;
};

/**
 * Update help message status (Only pending or resolved)
 */
export const updateStudentHelpMessageStatus = async (
  id: string,
  status: 'pending' | 'resolved'
): Promise<StudentHelpMessage[]> => {
  const current = getStudentHelpMessages();
  const updated = current.map((msg) => (msg.id === id ? { ...msg, status } : msg));
  await persistStudentHelpToCloud(updated);
  return updated;
};

export const updateStudentHelpMessageNotes = async (
  id: string,
  adminNotes: string
): Promise<StudentHelpMessage[]> => {
  const current = getStudentHelpMessages();
  const updated = current.map((msg) => (msg.id === id ? { ...msg, adminNotes } : msg));
  await persistStudentHelpToCloud(updated);
  return updated;
};

export const deleteStudentHelpMessage = async (id: string): Promise<StudentHelpMessage[]> => {
  const current = getStudentHelpMessages();
  const updated = current.filter((msg) => msg.id !== id);
  await persistStudentHelpToCloud(updated);
  return updated;
};

export const clearResolvedStudentHelpMessages = async (): Promise<StudentHelpMessage[]> => {
  const current = getStudentHelpMessages();
  const updated = current.filter((msg) => msg.status !== 'resolved');
  await persistStudentHelpToCloud(updated);
  return updated;
};

/**
 * Support Channels (Phone & WhatsApp) Central Persistence
 */
export const getSupportChannels = (): SupportChannelsConfig | null => {
  if (memoryChannelsCache) return memoryChannelsCache;
  try {
    const raw = localStorage.getItem(CHANNELS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && (parsed.phone || parsed.whatsapp)) {
        memoryChannelsCache = parsed;
        return parsed;
      }
    }
  } catch (e) {}
  return null;
};

export const syncSupportChannelsFromCloud = async (): Promise<SupportChannelsConfig | null> => {
  if (!isSupabaseConfigured()) return getSupportChannels();

  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('id', CLOUD_SUPPORT_CHANNELS_DOC_ID)
      .maybeSingle();

    if (!error && data?.content && (data.content.phone || data.content.whatsapp)) {
      const config: SupportChannelsConfig = {
        phone: data.content.phone || '+91 97787 07336',
        whatsapp: data.content.whatsapp || data.content.phone || '+91 97787 07336',
        updatedAt: data.content.updatedAt || new Date().toISOString()
      };
      memoryChannelsCache = config;
      try {
        localStorage.setItem(CHANNELS_STORAGE_KEY, JSON.stringify(config));
        window.dispatchEvent(new CustomEvent('dopilot_support_channels_updated', { detail: config }));
      } catch {}
      return config;
    }
  } catch (e) {
    console.warn('Failed to sync support channels from cloud:', e);
  }
  return getSupportChannels();
};

export const persistSupportChannelsToCloud = async (config: SupportChannelsConfig): Promise<void> => {
  memoryChannelsCache = config;
  try {
    localStorage.setItem(CHANNELS_STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('dopilot_support_channels_updated', { detail: config }));
  } catch {}

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('site_content').upsert({
        id: CLOUD_SUPPORT_CHANNELS_DOC_ID,
        content: {
          ...config,
          updatedAt: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Failed to persist support channels to cloud:', e);
    }
  }
};
