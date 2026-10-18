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
  status: 'pending' | 'in_progress' | 'resolved';
  adminNotes?: string;
}

const STORAGE_KEY = 'dopilot_student_help_messages_v1';

const INITIAL_DEMO_HELP_MESSAGES: StudentHelpMessage[] = [];

export const getStudentHelpMessages = (): StudentHelpMessage[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const realOnly = parsed.filter(
        (h: any) => !h.studentId?.startsWith('demo-std') && !h.studentEmail?.includes('techsprint.io')
      );
      if (realOnly.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(realOnly));
      }
      return realOnly;
    }
    return [];
  } catch (err) {
    console.error('Failed to read student help messages from storage', err);
    return [];
  }
};

export const submitStudentHelpMessage = (
  data: Omit<StudentHelpMessage, 'id' | 'submittedAt' | 'status'>
): StudentHelpMessage => {
  const current = getStudentHelpMessages();
  const newMessage: StudentHelpMessage = {
    ...data,
    id: `HELP-${Date.now().toString().slice(-6)}`,
    submittedAt: new Date().toISOString(),
    status: 'pending',
    adminNotes: ''
  };

  const updated = [newMessage, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Dispatch event so active admin tabs or contexts update in real time
    window.dispatchEvent(new CustomEvent('dopilot_student_help_update', { detail: newMessage }));
  } catch (err) {
    console.error('Failed to save student help message to storage', err);
  }

  return newMessage;
};

export const updateStudentHelpMessageStatus = (
  id: string,
  status: 'pending' | 'in_progress' | 'resolved'
): StudentHelpMessage[] => {
  const current = getStudentHelpMessages();
  const updated = current.map((msg) => (msg.id === id ? { ...msg, status } : msg));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('dopilot_student_help_update'));
  } catch (err) {
    console.error('Failed to update student help message status', err);
  }
  return updated;
};

export const updateStudentHelpMessageNotes = (id: string, adminNotes: string): StudentHelpMessage[] => {
  const current = getStudentHelpMessages();
  const updated = current.map((msg) => (msg.id === id ? { ...msg, adminNotes } : msg));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('dopilot_student_help_update'));
  } catch (err) {
    console.error('Failed to update admin notes', err);
  }
  return updated;
};

export const deleteStudentHelpMessage = (id: string): StudentHelpMessage[] => {
  const current = getStudentHelpMessages();
  const updated = current.filter((msg) => msg.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('dopilot_student_help_update'));
  } catch (err) {
    console.error('Failed to delete student help message', err);
  }
  return updated;
};

export const clearResolvedStudentHelpMessages = (): StudentHelpMessage[] => {
  const current = getStudentHelpMessages();
  const updated = current.filter((msg) => msg.status !== 'resolved');
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('dopilot_student_help_update'));
  } catch (err) {
    console.error('Failed to clear resolved messages', err);
  }
  return updated;
};
