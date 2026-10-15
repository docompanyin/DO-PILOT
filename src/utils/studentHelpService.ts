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

const INITIAL_DEMO_HELP_MESSAGES: StudentHelpMessage[] = [
  {
    id: 'HELP-1001',
    studentId: 'demo-std-1',
    studentName: 'Rahul Verma',
    studentEmail: 'rahul.verma@techsprint.io',
    studentPhone: '+91 98450 12345',
    courseTitle: 'Complete Python Course',
    courseId: 'python-core',
    message: 'Hello, I have a doubt regarding the Part 6 recursive function task. My test case times out on large list inputs. Could a mentor review my approach?',
    submittedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    status: 'pending',
    adminNotes: ''
  },
  {
    id: 'HELP-1002',
    studentId: 'demo-std-2',
    studentName: 'Priya Patel',
    studentEmail: 'priya.patel@gmail.com',
    studentPhone: '+91 98765 43210',
    courseTitle: 'Cyber Security Course',
    courseId: 'cyber-security',
    message: 'Need assistance setting up the Wireshark packet capture lab on Windows 11. The npcap driver fails during installation.',
    submittedAt: new Date(Date.now() - 14 * 3600000).toISOString(),
    status: 'in_progress',
    adminNotes: 'Assigned to mentor for Windows driver troubleshooting.'
  },
  {
    id: 'HELP-1003',
    studentId: 'demo-std-3',
    studentName: 'Ananya Sharma',
    studentEmail: 'ananya.sharma@appscale.dev',
    studentPhone: '+91 98112 34567',
    courseTitle: 'Complete Java Course',
    courseId: 'java-core',
    message: 'I completed all 14 parts and the final test, but my certificate download button is showing a loading spinner. Please check my completion record.',
    submittedAt: new Date(Date.now() - 36 * 3600000).toISOString(),
    status: 'resolved',
    adminNotes: 'Verified completion score (24/24 pts). Certificate re-issued and confirmed with student.'
  }
];

export const getStudentHelpMessages = (): StudentHelpMessage[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_HELP_MESSAGES));
      return INITIAL_DEMO_HELP_MESSAGES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_DEMO_HELP_MESSAGES;
  } catch (err) {
    console.error('Failed to read student help messages from storage', err);
    return INITIAL_DEMO_HELP_MESSAGES;
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
