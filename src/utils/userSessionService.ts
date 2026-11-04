import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { normalizeStudentEmail, flushCloudSync } from './courseProgressSyncService';

export const ACTIVE_DEVICE_SESSION_KEY = 'dopilot_active_device_session_id';

let isLocallyInvalidated = false;

export const isDeviceSessionInvalidated = (): boolean => {
  if (typeof window !== 'undefined') {
    return (window as any).__dopilot_session_invalidated === true;
  }
  return isLocallyInvalidated;
};

export const setDeviceSessionInvalidated = (val: boolean): void => {
  isLocallyInvalidated = val;
  if (typeof window !== 'undefined') {
    (window as any).__dopilot_session_invalidated = val;
  }
};

/**
 * Generates a unique, high-entropy session identifier for this device login
 */
export const generateDeviceSessionId = (): string => {
  const ts = Date.now();
  const rand1 = Math.random().toString(36).substring(2, 10);
  const rand2 = Math.random().toString(36).substring(2, 10);
  return `sess_${ts}_${rand1}_${rand2}`;
};

/**
 * Gets the current device session ID from localStorage, or null if none
 */
export const getLocalDeviceSessionId = (): string | null => {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  return localStorage.getItem(ACTIVE_DEVICE_SESSION_KEY);
};

/**
 * Sets the active session ID for this device in localStorage
 */
export const setLocalDeviceSessionId = (sessionId: string): void => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  localStorage.setItem(ACTIVE_DEVICE_SESSION_KEY, sessionId);
  isLocallyInvalidated = false;
};

/**
 * Clears the local device session ID
 */
export const clearLocalDeviceSessionId = (): void => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  localStorage.removeItem(ACTIVE_DEVICE_SESSION_KEY);
};

/**
 * Generates the document ID in Supabase site_content for single active session
 */
export const getSessionDocId = (email: string): string => {
  const clean = normalizeStudentEmail(email).replace(/[^a-z0-9_]/g, '_');
  return `telemetry_session_${clean}`;
};

/**
 * Registers this device session on the Supabase server as the single active session,
 * and immediately broadcasts real-time invalidation to all other devices.
 */
export const registerActiveDeviceSessionOnServer = async (
  email: string,
  sessionId: string
): Promise<boolean> => {
  const cleanEmail = normalizeStudentEmail(email);
  if (!cleanEmail || !isSupabaseConfigured()) return false;

  const docId = getSessionDocId(cleanEmail);
  const now = new Date().toISOString();

  try {
    // 1. Authoritative write to Supabase site_content table
    const { error } = await supabase.from('site_content').upsert({
      id: docId,
      content: {
        email: cleanEmail,
        sessionId,
        updatedAt: now,
        loginTimestamp: Date.now(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
      },
      updated_at: now
    });

    if (error) {
      console.warn('[userSessionService] Failed to upsert session to site_content:', error);
    }

    // 2. Broadcast instant invalidation over Supabase Realtime channel
    try {
      const channelName = `session_broadcast_${cleanEmail.replace(/[^a-z0-9_]/g, '_')}`;
      const channel = supabase.channel(channelName);
      channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.send({
            type: 'broadcast',
            event: 'new_active_login',
            payload: {
              sessionId,
              email: cleanEmail,
              timestamp: Date.now()
            }
          });
          // Unsubscribe broadcast channel after dispatch
          setTimeout(() => {
            try {
              supabase.removeChannel(channel);
            } catch {}
          }, 1500);
        }
      });
    } catch (broadcastErr) {
      console.warn('[userSessionService] Realtime broadcast error:', broadcastErr);
    }

    return true;
  } catch (e) {
    console.warn('[userSessionService] Unexpected error registering active session:', e);
    return false;
  }
};

/**
 * Checks server for the currently active session ID for this email.
 * Returns isValid: true if session matches or if no record exists yet.
 */
export const checkServerActiveSession = async (
  email: string,
  localSessionId: string
): Promise<{ isValid: boolean; serverSessionId?: string }> => {
  const cleanEmail = normalizeStudentEmail(email);
  if (!cleanEmail || !isSupabaseConfigured() || !localSessionId) {
    return { isValid: true };
  }

  try {
    const docId = getSessionDocId(cleanEmail);
    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('id', docId)
      .maybeSingle();

    if (error) {
      // Network hiccup — do not falsely invalidate
      return { isValid: true };
    }

    if (!data || !data.content) {
      // No server record yet — valid
      return { isValid: true };
    }

    const serverSessionId = data.content.sessionId;
    if (!serverSessionId) {
      return { isValid: true };
    }

    const isValid = serverSessionId === localSessionId;
    return { isValid, serverSessionId };
  } catch {
    return { isValid: true };
  }
};

/**
 * Subscribes to real-time session invalidation events for this student email.
 * When another device logs in, calls onSessionInvalidated immediately.
 */
export const subscribeToActiveSessionChanges = (
  email: string,
  localSessionId: string,
  onSessionInvalidated: () => void
): (() => void) => {
  const cleanEmail = normalizeStudentEmail(email);
  if (!cleanEmail || !isSupabaseConfigured() || !localSessionId) {
    return () => {};
  }

  const channelName = `session_broadcast_${cleanEmail.replace(/[^a-z0-9_]/g, '_')}`;
  const docId = getSessionDocId(cleanEmail);

  const channel = supabase.channel(channelName);

  // 1. Listen for instant broadcast event from newly logged-in device
  channel.on('broadcast', { event: 'new_active_login' }, (message: any) => {
    const incomingSessionId = message?.payload?.sessionId;
    if (incomingSessionId && incomingSessionId !== localSessionId) {
      onSessionInvalidated();
    }
  });

  // 2. Listen for Postgres changes on site_content table for this session doc
  channel.on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'site_content',
      filter: `id=eq.${docId}`
    },
    (payload: any) => {
      const incomingSessionId = payload?.new?.content?.sessionId;
      if (incomingSessionId && incomingSessionId !== localSessionId) {
        onSessionInvalidated();
      }
    }
  );

  channel.subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      // Once subscribed, perform an immediate server check in case login occurred right before subscription
      checkServerActiveSession(cleanEmail, localSessionId).then(({ isValid }) => {
        if (!isValid) {
          onSessionInvalidated();
        }
      });
    }
  });

  return () => {
    try {
      supabase.removeChannel(channel);
    } catch {}
  };
};

/**
 * Gracefully terminates the session on this device:
 * 1. Flushes pending progress & telemetry to central database first
 * 2. Invalidates local session state and marks device as invalidated
 * 3. Cleans up auth cookies and localStorage
 */
export const terminateReplacedSession = async (email: string): Promise<void> => {
  if (isLocallyInvalidated) return;

  const cleanEmail = normalizeStudentEmail(email);

  // Step 1: Save any pending changes using the existing data-saving and persistence implementation
  if (cleanEmail) {
    try {
      await flushCloudSync(cleanEmail);
    } catch (err) {
      console.warn('[userSessionService] Final progress flush before logout error:', err);
    }
  }

  // Step 2: Mark device as locally invalidated so subsequent writes are blocked
  setDeviceSessionInvalidated(true);

  // Step 3: Clear device session ID
  clearLocalDeviceSessionId();
};
