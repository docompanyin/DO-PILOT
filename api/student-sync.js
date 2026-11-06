import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

function getEnvVar(name) {
  if (process.env[name]) return process.env[name];
  if (process.env[`VITE_${name}`]) return process.env[`VITE_${name}`];
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      for (const line of content.split(/\r?\n/)) {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match && (match[1] === name || match[1] === `VITE_${name}`)) {
          const val = (match[2] || '').trim().replace(/^['"](.*)['"]$/, '$1');
          if (val) return val;
        }
      }
    }
  } catch (e) {
    // Ignore in read-only / serverless environments
  }
  return '';
}

const SUPABASE_URL = getEnvVar('SUPABASE_URL') || getEnvVar('VITE_SUPABASE_URL') || 'https://hddvqkyisztzbwszbcoy.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = getEnvVar('SUPABASE_SERVICE_ROLE_KEY') || getEnvVar('SERVICE_ROLE_KEY');
const SUPABASE_ANON_KEY = getEnvVar('SUPABASE_ANON_KEY') || getEnvVar('VITE_SUPABASE_ANON_KEY') || 'sb_publishable_WLBBeLiTRNOPndzwB5658Q_2DjElVq4';

const keyToUse = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, keyToUse);

// Helper to sanitize student email for document keys
function sanitizeEmail(email) {
  return (email || '').toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
}

// Verify that the student exists in student_profiles
async function verifyStudentOwnership(email, studentId) {
  const cleanEmail = (email || '').toLowerCase().trim();
  const cleanId = (studentId || '').trim();

  if (!cleanEmail && !cleanId) return false;

  try {
    let query = supabase.from('student_profiles').select('id, email');
    if (cleanEmail) {
      query = query.eq('email', cleanEmail);
    } else {
      query = query.eq('id', cleanId);
    }

    const { data, error } = await query.maybeSingle();
    return !error && Boolean(data);
  } catch (err) {
    console.error('Error verifying student ownership in student_profiles:', err);
    return false;
  }
}

export default async function handler(req, res) {
  if (!res.status) {
    res.status = function(code) { res.statusCode = code; return res; };
  }
  if (!res.json) {
    res.json = function(data) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
      return res;
    };
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Student-Email, X-Student-Id');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. GET: Retrieve student progress or telemetry with ownership verification
  if (req.method === 'GET') {
    const { email, studentId, type } = req.query || {};
    const cleanEmail = (email || req.headers['x-student-email'] || '').toLowerCase().trim();
    const cleanId = (studentId || req.headers['x-student-id'] || '').trim();

    if (!cleanEmail && !cleanId) {
      return res.status(400).json({ success: false, message: 'Student email or ID is required.' });
    }

    const isVerified = await verifyStudentOwnership(cleanEmail, cleanId);
    if (!isVerified) {
      return res.status(403).json({ success: false, message: 'Unauthorized: Student account not found.' });
    }

    const safeKey = sanitizeEmail(cleanEmail || cleanId);
    const docId = type === 'telemetry' ? `telemetry_${safeKey}` : `student_course_state_${safeKey}`;

    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('id', docId)
        .maybeSingle();

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      return res.status(200).json({
        success: true,
        docId,
        content: data?.content || null
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed. Use GET or POST.' });
  }

  // 2. POST: Save / update student progress or telemetry
  try {
    const { email, studentId, type, content } = req.body || {};
    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanId = (studentId || '').trim();

    if (!cleanEmail && !cleanId) {
      return res.status(400).json({ success: false, message: 'Student email or ID is required.' });
    }

    if (content === undefined || content === null) {
      return res.status(400).json({ success: false, message: 'Content payload is required.' });
    }

    // Verify verified student identity
    const isVerified = await verifyStudentOwnership(cleanEmail, cleanId);
    if (!isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Student record does not match registered student profile.'
      });
    }

    const safeKey = sanitizeEmail(cleanEmail || cleanId);
    const docId = type === 'telemetry' ? `telemetry_${safeKey}` : `student_course_state_${safeKey}`;

    // Safeguard for progress: Merge with existing cloud document so empty/partial uploads never erase saved progress
    let finalPayload = content;
    if (type === 'progress' && content && typeof content === 'object') {
      try {
        const { data: existingDoc } = await supabase
          .from('site_content')
          .select('content')
          .eq('id', docId)
          .maybeSingle();

        if (existingDoc && existingDoc.content && typeof existingDoc.content === 'object') {
          const ex = existingDoc.content;
          finalPayload = {
            ...ex,
            ...content,
            courses: { ...(ex.courses || {}) },
            rawStorage: { ...(ex.rawStorage || {}), ...(content.rawStorage || {}) },
            globalLockedKeys: { ...(ex.globalLockedKeys || {}), ...(content.globalLockedKeys || {}) },
            consecutiveFailures: { ...(ex.consecutiveFailures || {}), ...(content.consecutiveFailures || {}) },
            part1SectionScores: { ...(ex.part1SectionScores || {}), ...(content.part1SectionScores || {}) },
            trialAttempted: { ...(ex.trialAttempted || {}), ...(content.trialAttempted || {}) },
            postPurchaseDecisions: { ...(ex.postPurchaseDecisions || {}), ...(content.postPurchaseDecisions || {}) },
            part1RestartUsed: { ...(ex.part1RestartUsed || {}), ...(content.part1RestartUsed || {}) },
            exemptSections: { ...(ex.exemptSections || {}), ...(content.exemptSections || {}) },
            certificates: { ...(ex.certificates || {}), ...(content.certificates || {}) },
            updatedAt: content.updatedAt || new Date().toISOString()
          };

          if (content.courses) {
            Object.entries(content.courses).forEach(([cId, inCourse]) => {
              const exCourse = finalPayload.courses[cId];
              if (!exCourse) {
                finalPayload.courses[cId] = inCourse;
                return;
              }

              const mergedLastPart = Math.max(exCourse.lastPart || 1, inCourse.lastPart || 1);
              const mergedCompletedParts = Array.from(new Set([
                ...(exCourse.completedParts || []),
                ...(inCourse.completedParts || [])
              ]));

              const mergedParts = { ...(exCourse.parts || {}) };
              if (inCourse.parts) {
                Object.entries(inCourse.parts).forEach(([pStr, inPart]) => {
                  const exPart = mergedParts[pStr];
                  if (!exPart) {
                    mergedParts[pStr] = inPart;
                    return;
                  }

                  const mergedAnswers = {
                    ...(exPart.selectedAnswers || {}),
                    ...(inPart.selectedAnswers || {})
                  };

                  const inHasValidLocation = Boolean(inPart.activeSectionId) || (typeof inPart.activeQuestionIdx === 'number');
                  const exHasValidLocation = Boolean(exPart.activeSectionId) || (typeof exPart.activeQuestionIdx === 'number');

                  // If incoming part lacks any valid section/question location but existing has one, retain existing location
                  if (!inHasValidLocation && exHasValidLocation) {
                    mergedParts[pStr] = {
                      ...exPart,
                      selectedAnswers: mergedAnswers
                    };
                    return;
                  }

                  mergedParts[pStr] = {
                    ...exPart,
                    ...inPart,
                    selectedAnswers: mergedAnswers,
                    isCompleted: exPart.isCompleted || inPart.isCompleted,
                    isFinishedPart: exPart.isFinishedPart || inPart.isFinishedPart
                  };
                });
              }

              finalPayload.courses[cId] = {
                ...exCourse,
                ...inCourse,
                lastPart: mergedLastPart,
                completedParts: mergedCompletedParts,
                parts: mergedParts
              };
            });
          }
        }
      } catch (mergeErr) {
        console.warn('Sync merge error (proceeding with incoming):', mergeErr);
      }
    }

    const { error } = await supabase
      .from('site_content')
      .upsert({
        id: docId,
        content: finalPayload,
        updated_at: new Date().toISOString()
      });

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({
      success: true,
      docId,
      message: 'Student record saved successfully.'
    });
  } catch (err) {
    console.error('Save student sync error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error syncing student data.' });
  }
}
