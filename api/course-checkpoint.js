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

function sanitizeEmail(email) {
  return (email || '').toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
}

/**
 * Strict Authenticated User Ownership Verification
 * 1. Checks Supabase Auth JWT if present
 * 2. Ensures the requester cannot access or modify another student's record
 * 3. Fallbacks to verified student profile record
 */
async function authenticateRequest(req, requestedEmail, requestedStudentId) {
  const cleanEmail = (requestedEmail || '').toLowerCase().trim();
  const cleanId = (requestedStudentId || '').trim();

  // 1. Inspect Bearer token if provided
  const authHeader = req.headers['authorization'] || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token) {
      try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (!error && user) {
          const authUserEmail = (user.email || '').toLowerCase().trim();
          const authUserId = (user.id || '').trim();

          // Reject if authenticated user identity mismatches requested student
          if (cleanEmail && authUserEmail && cleanEmail !== authUserEmail) {
            return { authorized: false, reason: 'Identity mismatch with authenticated account' };
          }
          if (cleanId && authUserId && cleanId !== authUserId) {
            return { authorized: false, reason: 'User ID mismatch with authenticated account' };
          }

          return { authorized: true, userEmail: authUserEmail || cleanEmail, userId: authUserId || cleanId };
        }
      } catch (authErr) {
        console.warn('Bearer token verification error:', authErr);
      }
    }
  }

  // 2. Validate against student_profiles in Supabase
  if (!cleanEmail && !cleanId) {
    return { authorized: false, reason: 'Student email or ID is required' };
  }

  try {
    let query = supabase.from('student_profiles').select('id, email');
    if (cleanEmail) {
      query = query.eq('email', cleanEmail);
    } else {
      query = query.eq('id', cleanId);
    }
    const { data, error } = await query.maybeSingle();
    if (!error && data) {
      return {
        authorized: true,
        userEmail: (data.email || cleanEmail).toLowerCase().trim(),
        userId: data.id || cleanId
      };
    }
  } catch (dbErr) {
    console.error('Error verifying student_profiles:', dbErr);
  }

  // If student profile not yet created (e.g. freshly signed up or free trial guest with email),
  // allow valid email format so trial progress is never blocked.
  if (cleanEmail && cleanEmail.includes('@') && cleanEmail.includes('.')) {
    return { authorized: true, userEmail: cleanEmail, userId: cleanId || cleanEmail };
  }

  return { authorized: false, reason: 'Student profile not recognized' };
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

  // ==========================================
  // GET: Retrieve Authoritative Course Checkpoint
  // ==========================================
  if (req.method === 'GET') {
    const { email, studentId, courseId, partNum } = req.query || {};
    const cleanEmail = (email || req.headers['x-student-email'] || '').toLowerCase().trim();
    const cleanId = (studentId || req.headers['x-student-id'] || '').trim();

    const auth = await authenticateRequest(req, cleanEmail, cleanId);
    if (!auth.authorized) {
      return res.status(403).json({ success: false, message: `Unauthorized: ${auth.reason}` });
    }

    const effectiveEmail = auth.userEmail;
    const safeKey = sanitizeEmail(effectiveEmail);
    const partNumber = Number(partNum ?? 1);
    const course = String(courseId || 'python-core').trim();

    const checkpointDocId = `telemetry_checkpoint_${safeKey}_${course}_part${partNumber}`;
    const legacyDocId = `student_course_state_${safeKey}`;

    try {
      // 1. Try to read discrete checkpoint first
      const { data: discreteDoc } = await supabase
        .from('site_content')
        .select('content, updated_at')
        .eq('id', checkpointDocId)
        .maybeSingle();

      if (discreteDoc?.content) {
        const cp = { ...(discreteDoc.content.checkpoint || {}) };
        if (!cp.pageType) {
          if (cp.levelResult && cp.levelResult.isFinished) {
            cp.pageType = cp.levelResult.isPassed ? 'passed_result' : 'failed_result';
          } else if (cp.isCompleted || cp.isFinishedPart) {
            cp.pageType = 'part_completion';
          } else if (cp.disclaimerModalOpen) {
            cp.pageType = 'disclaimer_guidelines';
          } else if (cp.consecutiveFailureModalOpen) {
            cp.pageType = 'failure_warning';
          } else if (cp.isStudyPhase) {
            cp.pageType = 'study_notes';
          } else {
            cp.pageType = 'incomplete_question';
          }
        }
        if (cp.levelResult && !cp.levelResult.sectionId) {
          cp.levelResult = { ...cp.levelResult, sectionId: cp.activeSectionId };
        }

        return res.status(200).json({
          success: true,
          source: 'discrete_checkpoint',
          revision: discreteDoc.content.revision || 1,
          lastIdempotencyKey: discreteDoc.content.lastIdempotencyKey || null,
          checkpoint: cp,
          updatedAt: discreteDoc.updated_at || discreteDoc.content.updatedAt
        });
      }

      // 2. Fallback to unified student_course_state document
      const { data: legacyDoc } = await supabase
        .from('site_content')
        .select('content, updated_at')
        .eq('id', legacyDocId)
        .maybeSingle();

      const legacyContent = legacyDoc?.content;
      if (legacyContent?.courses?.[course]?.parts?.[String(partNumber)]) {
        const partState = legacyContent.courses[course].parts[String(partNumber)];
        let synPageType = partState.pageType;
        if (!synPageType) {
          if (partState.levelResult && partState.levelResult.isFinished) {
            synPageType = partState.levelResult.isPassed ? 'passed_result' : 'failed_result';
          } else if (partState.isCompleted || partState.isFinishedPart) {
            synPageType = 'part_completion';
          } else if (partState.disclaimerModalOpen) {
            synPageType = 'disclaimer_guidelines';
          } else if (partState.consecutiveFailureModalOpen) {
            synPageType = 'failure_warning';
          } else if (partState.isStudyPhase) {
            synPageType = 'study_notes';
          } else {
            synPageType = 'incomplete_question';
          }
        }

        const fixedLevelResult = partState.levelResult ? {
          ...partState.levelResult,
          sectionId: partState.levelResult.sectionId || partState.activeSectionId
        } : null;

        const synthesizedCheckpoint = {
          courseId: course,
          partNum: partNumber,
          activeSectionId: partState.activeSectionId || '',
          activeQuestionIdx: typeof partState.activeQuestionIdx === 'number' ? partState.activeQuestionIdx : 0,
          isStudyPhase: partState.isStudyPhase ?? true,
          isTimeUpWaiting: partState.isTimeUpWaiting ?? false,
          targetEndTime: partState.targetEndTime || 0,
          timeLeft: partState.timeLeft || 0,
          selectedAnswers: partState.selectedAnswers || {},
          levelResult: fixedLevelResult,
          pageType: synPageType,
          disclaimerModalOpen: Boolean(partState.disclaimerModalOpen),
          consecutiveFailureModalOpen: Boolean(partState.consecutiveFailureModalOpen),
          attemptCounts: {},
          consecutiveFailures: legacyContent.consecutiveFailures || {},
          disclaimerConfirmed: true,
          exemptSections: legacyContent.exemptSections || {},
          isCompleted: Boolean(partState.isCompleted),
          isFinishedPart: Boolean(partState.isFinishedPart),
          certificates: legacyContent.certificates || {},
          postPurchaseDecisions: legacyContent.postPurchaseDecisions || {},
          lastPart: legacyContent.courses[course]?.lastPart || partNumber
        };

        return res.status(200).json({
          success: true,
          source: 'legacy_document',
          revision: 1,
          lastIdempotencyKey: null,
          checkpoint: synthesizedCheckpoint,
          updatedAt: legacyDoc.updated_at
        });
      }

      // 3. Brand new student - no checkpoint yet
      return res.status(200).json({
        success: true,
        source: 'empty',
        revision: 0,
        lastIdempotencyKey: null,
        checkpoint: null
      });
    } catch (err) {
      console.error('Error fetching checkpoint:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // ==========================================
  // POST: Atomic Save with Revisions & Idempotency
  // ==========================================
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed. Use GET or POST.' });
  }

  try {
    const {
      email,
      studentId,
      courseId,
      partNum,
      expectedRevision,
      idempotencyKey,
      checkpoint
    } = req.body || {};

    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanId = (studentId || '').trim();

    const auth = await authenticateRequest(req, cleanEmail, cleanId);
    if (!auth.authorized) {
      return res.status(403).json({ success: false, message: `Unauthorized: ${auth.reason}` });
    }

    if (!checkpoint || typeof checkpoint !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid or missing checkpoint payload.' });
    }

    const effectiveEmail = auth.userEmail;
    const safeKey = sanitizeEmail(effectiveEmail);
    const partNumber = Number(partNum ?? checkpoint.partNum ?? 1);
    const course = String(courseId || checkpoint.courseId || 'python-core').trim();

    const checkpointDocId = `telemetry_checkpoint_${safeKey}_${course}_part${partNumber}`;
    const legacyDocId = `student_course_state_${safeKey}`;

    // 1. Fetch current discrete checkpoint to verify revision and idempotency
    const { data: existingRow } = await supabase
      .from('site_content')
      .select('content, updated_at')
      .eq('id', checkpointDocId)
      .maybeSingle();

    const currentDoc = existingRow?.content || null;
    const currentRev = currentDoc?.revision || 0;
    const currentIdempotency = currentDoc?.lastIdempotencyKey || null;

    // A. Idempotency Check: Same network retry
    if (idempotencyKey && currentIdempotency === idempotencyKey) {
      return res.status(200).json({
        success: true,
        status: 'deduplicated',
        revision: currentRev,
        idempotencyKey,
        checkpoint: currentDoc.checkpoint,
        message: 'Request already processed with identical idempotency key.'
      });
    }

    // B. Server Overwrite Guard: Prevent unhydrated mount default from erasing saved progress
    const incomingAnswersCount = Object.keys(checkpoint.selectedAnswers || {}).length;
    const existingCp = currentDoc?.checkpoint || {};
    const existingAnswersCount = Object.keys(existingCp.selectedAnswers || {}).length;
    const existingHasProgress = existingAnswersCount > 0 || Boolean(existingCp.isCompleted) || Boolean(existingCp.isFinishedPart) || (existingCp.activeQuestionIdx || 0) > 0;

    const isIncomingMountDefault = (checkpoint.activeQuestionIdx === 0 || checkpoint.activeQuestionIdx === undefined) &&
      (!checkpoint.activeSectionId || checkpoint.activeSectionId.endsWith('-1') || checkpoint.activeSectionId.endsWith('.1') || checkpoint.activeSectionId.includes('1-1') || checkpoint.activeSectionId.includes('0-1')) &&
      incomingAnswersCount === 0 &&
      checkpoint.isStudyPhase !== false;

    if (currentDoc && isIncomingMountDefault && existingHasProgress) {
      console.warn(`[CheckpointGuard] Blocked premature overwrite of ${checkpointDocId} saved progress with unhydrated mount default.`);
      return res.status(200).json({
        success: true,
        status: 'preserved',
        revision: currentRev,
        checkpoint: existingCp,
        message: 'Existing cloud checkpoint preserved against unhydrated mount default.'
      });
    }

    // C. Concurrency / Stale Request Detection across devices
    const expRev = typeof expectedRevision === 'number' ? expectedRevision : currentRev;

    let incomingPageType = checkpoint.pageType;
    if (!incomingPageType) {
      if (checkpoint.levelResult && checkpoint.levelResult.isFinished) {
        incomingPageType = checkpoint.levelResult.isPassed ? 'passed_result' : 'failed_result';
      } else if (checkpoint.isCompleted || checkpoint.isFinishedPart) {
        incomingPageType = 'part_completion';
      } else if (checkpoint.disclaimerModalOpen) {
        incomingPageType = 'disclaimer_guidelines';
      } else if (checkpoint.consecutiveFailureModalOpen) {
        incomingPageType = 'failure_warning';
      } else if (checkpoint.isStudyPhase) {
        incomingPageType = 'study_notes';
      } else {
        incomingPageType = 'incomplete_question';
      }
    }

    const safeLevelResult = checkpoint.levelResult ? {
      ...checkpoint.levelResult,
      isFinished: true,
      isPassed: incomingPageType === 'failed_result' ? false : (checkpoint.levelResult.isPassed ?? true),
      sectionId: checkpoint.levelResult.sectionId || checkpoint.activeSectionId
    } : null;

    let safeMergedCheckpoint = {
      ...checkpoint,
      pageType: incomingPageType,
      levelResult: safeLevelResult,
      disclaimerModalOpen: Boolean(checkpoint.disclaimerModalOpen),
      consecutiveFailureModalOpen: Boolean(checkpoint.consecutiveFailureModalOpen)
    };

    if (currentDoc && expRev < currentRev) {
      // Incoming request is behind the server revision.
      // Merge answers union-style so answered questions/points are never lost
      const existingCp = currentDoc.checkpoint || {};
      const mergedAnswers = {
        ...(existingCp.selectedAnswers || {}),
        ...(checkpoint.selectedAnswers || {})
      };

      // Compare client-provided action timestamp vs server's existing checkpoint timestamp
      const incomingTime = checkpoint.updatedAt ? new Date(checkpoint.updatedAt).getTime() : 0;
      const existingTime = existingCp.updatedAt ? new Date(existingCp.updatedAt).getTime() :
        (currentDoc.updatedAt ? new Date(currentDoc.updatedAt).getTime() : 0);

      // If incoming save has a newer timestamp, it represents a newer intentional user action
      // (e.g. intentionally navigating backward to review notes or previous questions).
      const incomingIsNewerAction = incomingTime > existingTime;

      safeMergedCheckpoint = {
        ...checkpoint,
        pageType: incomingIsNewerAction ? incomingPageType : (existingCp.pageType || incomingPageType),
        disclaimerModalOpen: incomingIsNewerAction ? Boolean(checkpoint.disclaimerModalOpen) : (existingCp.disclaimerModalOpen ?? Boolean(checkpoint.disclaimerModalOpen)),
        consecutiveFailureModalOpen: incomingIsNewerAction ? Boolean(checkpoint.consecutiveFailureModalOpen) : (existingCp.consecutiveFailureModalOpen ?? Boolean(checkpoint.consecutiveFailureModalOpen)),
        activeSectionId: incomingIsNewerAction ? checkpoint.activeSectionId : (existingCp.activeSectionId || checkpoint.activeSectionId),
        activeQuestionIdx: incomingIsNewerAction ? checkpoint.activeQuestionIdx : (typeof existingCp.activeQuestionIdx === 'number' ? existingCp.activeQuestionIdx : checkpoint.activeQuestionIdx),
        isStudyPhase: incomingIsNewerAction ? checkpoint.isStudyPhase : (existingCp.isStudyPhase ?? checkpoint.isStudyPhase),
        selectedAnswers: mergedAnswers,
        levelResult: incomingIsNewerAction
          ? safeLevelResult
          : (existingCp.levelResult ? { ...existingCp.levelResult, sectionId: existingCp.levelResult.sectionId || existingCp.activeSectionId } : safeLevelResult),
        isCompleted: existingCp.isCompleted || checkpoint.isCompleted,
        isFinishedPart: existingCp.isFinishedPart || checkpoint.isFinishedPart,
        updatedAt: incomingIsNewerAction ? checkpoint.updatedAt : (existingCp.updatedAt || currentDoc.updatedAt)
      };

      console.warn(`Concurrency collision for ${checkpointDocId}: expected rev ${expRev} < current rev ${currentRev}. Resolved using action timestamps (incomingIsNewer: ${incomingIsNewerAction}).`);
    }

    const nextRevision = currentRev + 1;
    const nowIso = new Date().toISOString();

    const discretePayload = {
      studentEmail: effectiveEmail,
      studentId: auth.userId,
      courseId: course,
      partNum: partNumber,
      revision: nextRevision,
      lastIdempotencyKey: idempotencyKey || `key-${Date.now()}`,
      checkpoint: safeMergedCheckpoint,
      updatedAt: nowIso
    };

    // 2. Commit discrete checkpoint to Supabase
    const { error: saveErr } = await supabase
      .from('site_content')
      .upsert({
        id: checkpointDocId,
        content: discretePayload,
        updated_at: nowIso
      });

    if (saveErr) {
      console.error('Failed to write discrete checkpoint:', saveErr);
      return res.status(500).json({ success: false, message: saveErr.message });
    }

    // 3. Mirror into unified legacy document for backward compatibility with certificates & telemetry
    try {
      const { data: legacyRow } = await supabase
        .from('site_content')
        .select('content')
        .eq('id', legacyDocId)
        .maybeSingle();

      const existingLegacy = legacyRow?.content || {};
      const coursesObj = { ...(existingLegacy.courses || {}) };
      const curCourse = { ...(coursesObj[course] || { lastPart: partNumber, completedParts: [], parts: {} }) };
      const curParts = { ...(curCourse.parts || {}) };

      curParts[String(partNumber)] = {
        activeSectionId: safeMergedCheckpoint.activeSectionId,
        activeQuestionIdx: safeMergedCheckpoint.activeQuestionIdx,
        selectedAnswers: safeMergedCheckpoint.selectedAnswers || {},
        isStudyPhase: safeMergedCheckpoint.isStudyPhase,
        isTimeUpWaiting: safeMergedCheckpoint.isTimeUpWaiting,
        targetEndTime: safeMergedCheckpoint.targetEndTime,
        timeLeft: safeMergedCheckpoint.timeLeft,
        isCompleted: safeMergedCheckpoint.isCompleted,
        isFinishedPart: safeMergedCheckpoint.isFinishedPart,
        levelResult: safeMergedCheckpoint.levelResult,
        pageType: safeMergedCheckpoint.pageType,
        disclaimerModalOpen: safeMergedCheckpoint.disclaimerModalOpen,
        consecutiveFailureModalOpen: safeMergedCheckpoint.consecutiveFailureModalOpen,
        updatedAt: nowIso
      };

      curCourse.parts = curParts;
      if (safeMergedCheckpoint.lastPart) {
        curCourse.lastPart = Math.max(curCourse.lastPart || 1, safeMergedCheckpoint.lastPart);
      }
      if (safeMergedCheckpoint.isCompleted) {
        curCourse.completedParts = Array.from(new Set([...(curCourse.completedParts || []), partNumber]));
      }
      coursesObj[course] = curCourse;

      const updatedLegacy = {
        ...existingLegacy,
        email: effectiveEmail,
        courses: coursesObj,
        globalLockedKeys: { ...(existingLegacy.globalLockedKeys || {}) },
        consecutiveFailures: {
          ...(existingLegacy.consecutiveFailures || {}),
          ...(safeMergedCheckpoint.consecutiveFailures || {})
        },
        exemptSections: {
          ...(existingLegacy.exemptSections || {}),
          ...(safeMergedCheckpoint.exemptSections || {})
        },
        certificates: {
          ...(existingLegacy.certificates || {}),
          ...(safeMergedCheckpoint.certificates || {})
        },
        postPurchaseDecisions: {
          ...(existingLegacy.postPurchaseDecisions || {}),
          ...(safeMergedCheckpoint.postPurchaseDecisions || {})
        },
        updatedAt: nowIso
      };

      await supabase
        .from('site_content')
        .upsert({
          id: legacyDocId,
          content: updatedLegacy,
          updated_at: nowIso
        });
    } catch (mirrorErr) {
      console.warn('Mirror to legacy document non-fatal error:', mirrorErr);
    }

    return res.status(200).json({
      success: true,
      revision: nextRevision,
      idempotencyKey: discretePayload.lastIdempotencyKey,
      checkpoint: safeMergedCheckpoint,
      message: 'Checkpoint atomically saved successfully.'
    });
  } catch (err) {
    console.error('Course checkpoint save error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error saving checkpoint.' });
  }
}
