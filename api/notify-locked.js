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

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Student-Email, X-Student-Id');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed. Use POST.' });
  }

  try {
    const {
      courseId = 'python-core',
      courseName = 'Complete Python Programming',
      partNum = 1,
      sectionId = '',
      sectionTitle = '',
      activeQuestionIdx = 0,
      totalQuestions = 6,
      score = 0,
      percentage = 0,
      streak = 3,
      attemptCount = 2,
      studentId = '',
      studentEmail = ''
    } = req.body || {};

    const cleanEmail = (studentEmail || req.headers['x-student-email'] || '').toLowerCase().trim();
    const cleanId = (studentId || req.headers['x-student-id'] || '').trim();

    if (!cleanEmail && !cleanId) {
      return res.status(400).json({ success: false, message: 'Student email or ID is required.' });
    }

    // Only notify when consecutive failures reach lock threshold (>= 3)
    if (Number(streak) < 3) {
      return res.status(200).json({
        success: false,
        message: 'Notification skipped: course is not locked (streak < 3).'
      });
    }

    // 1. Deduplication: Check if notification was already recorded in database
    const safeKey = (cleanEmail || cleanId).replace(/[^a-z0-9_]/g, '_');
    const noticeDocId = `telemetry_lock_notice_${safeKey}_part${partNum}_streak_${streak}`;

    try {
      const { data: existingNotice } = await supabase
        .from('site_content')
        .select('content, updated_at')
        .eq('id', noticeDocId)
        .maybeSingle();

      if (existingNotice?.content?.delivered) {
        return res.status(200).json({
          success: true,
          duplicate: true,
          message: 'Notification already delivered to Telegram for this lock event.'
        });
      }
    } catch (e) {
      console.warn('Error checking existing lock notification in database:', e);
    }

    // 2. Fetch official student profile and progress state from database
    let profile = null;
    let progressState = null;
    try {
      let query = supabase.from('student_profiles').select('*');
      if (cleanEmail) {
        query = query.ilike('email', cleanEmail);
      } else {
        query = query.eq('id', cleanId);
      }
      const { data } = await query.maybeSingle();
      profile = data;
    } catch (err) {
      console.warn('Could not fetch student_profiles for locked notification:', err);
    }

    try {
      const stateDocId = `student_course_state_${safeKey}`;
      const { data: stDoc } = await supabase
        .from('site_content')
        .select('content')
        .eq('id', stateDocId)
        .maybeSingle();
      progressState = stDoc?.content || null;
    } catch (err) {
      console.warn('Could not fetch student_course_state for locked notification:', err);
    }

    const studentName = profile?.name || 'Registered Student';
    const emailText = profile?.email || cleanEmail || 'Not provided';
    const phoneDigits = (profile?.phone || '').replace(/\D/g, '');
    const phoneFormatted = phoneDigits ? `+91 ${phoneDigits}` : 'Not provided';
    const userIdText = profile?.id || cleanId || 'N/A';
    const collegeOrCompany = profile?.college_or_company || profile?.where_did_you_find_us || 'Not provided';
    const learningGoal = profile?.learning_goal || '';
    const regDate = profile?.created_at
      ? new Date(profile.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })
      : 'N/A';

    const completedPartsList = progressState?.courses?.['python-core']?.completedParts || [];
    const completedPartsText = completedPartsList.length > 0
      ? completedPartsList.map((p) => `Part ${p}`).join(', ')
      : 'None yet';

    const lastQuestionNumber = Number(activeQuestionIdx) + 1;
    const progressSummaryText = `Part ${partNum} Assessment • ${score}/${totalQuestions} answered (${percentage}%)`;
    const nowIST = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'medium' });

    // 3. Format clean, professional Telegram message
    let messageHtml =
      `🚨 <b>DO PILOT — PYTHON COURSE LOCKED</b> 🔒\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `👤 <b>STUDENT DETAILS</b>\n` +
      `• <b>Full Name:</b> ${escapeHtml(studentName)}\n` +
      `• <b>Email Address:</b> <code>${escapeHtml(emailText)}</code>\n` +
      `• <b>Phone Number:</b> ${phoneDigits ? `<a href="tel:${phoneFormatted}">${phoneFormatted}</a>` : 'Not provided'}\n` +
      `• <b>User ID:</b> <code>${escapeHtml(userIdText)}</code>\n` +
      `• <b>College / Org:</b> ${escapeHtml(collegeOrCompany)}\n`;

    if (learningGoal) {
      messageHtml += `• <b>Learning Goal:</b> ${escapeHtml(learningGoal)}\n`;
    }
    messageHtml +=
      `• <b>Registration Date:</b> ${escapeHtml(regDate)}\n\n` +
      `📚 <b>COURSE & PROGRESS DETAILS</b>\n` +
      `• <b>Course Name:</b> ${escapeHtml(courseName)}\n` +
      `• <b>Current Part:</b> Part ${partNum} of 14\n` +
      `• <b>Locked Section:</b> ${escapeHtml(sectionTitle || sectionId || `Section ${partNum}.1`)}\n` +
      `• <b>Last Attempted Question:</b> Question ${lastQuestionNumber} of ${totalQuestions}\n` +
      `• <b>Completed Parts:</b> ${escapeHtml(completedPartsText)}\n` +
      `• <b>Current Course Progress:</b> ${escapeHtml(progressSummaryText)}\n` +
      `• <b>Latest Score:</b> ${score} / ${totalQuestions} (${percentage}%) [Pass Mark: &gt; 80%]\n` +
      `• <b>Section Attempt:</b> Attempt ${attemptCount} of 2 (Failed Retest)\n\n` +
      `⚠️ <b>LOCK STATUS & REASON</b>\n` +
      `• <b>Lock Status:</b> <b>LOCKED</b> (Level Progression Suspended)\n` +
      `• <b>Consecutive Failure Count:</b> ${streak} of 3 Failed Levels\n` +
      `• <b>Total Relevant Failed Attempts:</b> 3 consecutive levels failed on 2nd attempt\n` +
      `• <b>Reason for Locking:</b> Student failed 3 consecutive levels in Python Course without meeting the passing requirement (&gt; 80% score).\n` +
      `• <b>Locked Date & Time:</b> ${escapeHtml(nowIST)}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `ℹ️ <i>Action Required: Please reach out to assist the student and unlock their course from Admin Panel → Course Reset.</i>`;

    // 4. Dedicated Telegram Bot API integration (@dopilot_lockeduser_bot)
    const BOT_TOKEN = getEnvVar('TELEGRAM_LOCKED_BOT_TOKEN') || getEnvVar('TELEGRAM_BOT_TOKEN');
    const CHAT_ID = getEnvVar('TELEGRAM_LOCKED_CHAT_ID') || getEnvVar('TELEGRAM_CHAT_ID');

    if (!BOT_TOKEN || !CHAT_ID || BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
      console.warn('[Course Lock Telegram] TELEGRAM_LOCKED_BOT_TOKEN or TELEGRAM_LOCKED_CHAT_ID is not configured.');
      // Persist audit record in site_content
      try {
        await supabase.from('site_content').upsert({
          id: noticeDocId,
          content: {
            delivered: false,
            notConfigured: true,
            studentEmail: cleanEmail,
            studentId: cleanId,
            studentName,
            phone: phoneFormatted,
            partNum,
            sectionId,
            streak,
            createdAt: new Date().toISOString()
          },
          updated_at: new Date().toISOString()
        });
      } catch {}

      return res.status(200).json({
        success: false,
        notConfigured: true,
        message: 'Telegram Bot credentials not configured in environment (TELEGRAM_LOCKED_BOT_TOKEN, TELEGRAM_LOCKED_CHAT_ID).'
      });
    }

    // 5. Send with retry handling (up to 2 attempts)
    let delivered = false;
    let tgData = null;
    let lastError = null;

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: messageHtml,
            parse_mode: 'HTML',
            disable_web_page_preview: true
          })
        });

        const data = await tgRes.json();
        if (tgRes.ok && data.ok) {
          delivered = true;
          tgData = data;
          break;
        } else {
          lastError = data?.description || `HTTP ${tgRes.status}`;
          // Don't retry on 4xx client errors (e.g. invalid chat ID or token)
          if (tgRes.status >= 400 && tgRes.status < 500) {
            break;
          }
        }
      } catch (err) {
        lastError = err.message || 'Network error';
      }

      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    // 6. Record status in site_content for database audit & deduplication
    try {
      await supabase.from('site_content').upsert({
        id: noticeDocId,
        content: {
          delivered,
          studentEmail: cleanEmail,
          studentId: cleanId,
          studentName,
          phone: phoneFormatted,
          partNum,
          sectionId,
          streak,
          messageId: tgData?.result?.message_id || null,
          error: delivered ? null : lastError,
          deliveredAt: delivered ? new Date().toISOString() : null
        },
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Error saving lock notification audit in database:', e);
    }

    // 7. Update authoritative Course Reset registry in site_content
    try {
      const { data: regDoc } = await supabase
        .from('site_content')
        .select('content')
        .eq('id', 'dopilot_locked_courses_registry_v1')
        .maybeSingle();

      const existingRecords = Array.isArray(regDoc?.content?.records) ? regDoc.content.records : [];
      const matchIdx = existingRecords.findIndex(
        (r) =>
          r.studentId === (profile?.id || cleanId) ||
          (cleanEmail && r.studentEmail && r.studentEmail.toLowerCase() === cleanEmail.toLowerCase())
      );

      const recordItem = {
        id: matchIdx >= 0 ? existingRecords[matchIdx].id : `LC-${(profile?.id || cleanId).slice(-6)}`,
        studentId: profile?.id || cleanId,
        studentName: studentName || 'Registered Student',
        studentEmail: profile?.email || cleanEmail,
        studentPhone: phoneDigits ? `+91 ${phoneDigits}` : undefined,
        collegeOrCompany: collegeOrCompany !== 'Not provided' ? collegeOrCompany : undefined,
        courseId: 'python',
        courseName: 'Complete Python Course',
        partNum: Number(partNum) || 1,
        partTitle: `Part ${partNum}`,
        failedPart: `Part ${partNum}`,
        failedSection: sectionTitle || sectionId || `Section ${partNum}.1`,
        failedSectionId: sectionId || undefined,
        consecutiveFailures: Number(streak) || 3,
        lockStatus: 'locked',
        lockedAt: new Date().toISOString(),
        progressSummary: `Part ${partNum}: ${sectionTitle || sectionId} • Lock Active`,
        earnedPoints: 0
      };

      if (matchIdx >= 0) {
        existingRecords[matchIdx] = {
          ...existingRecords[matchIdx],
          ...recordItem,
          lockStatus: 'locked'
        };
      } else {
        existingRecords.unshift(recordItem);
      }

      await supabase.from('site_content').upsert({
        id: 'dopilot_locked_courses_registry_v1',
        content: {
          records: existingRecords,
          updatedAt: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Error updating locked courses registry in site_content:', e);
    }

    if (delivered) {
      return res.status(200).json({
        success: true,
        delivered: true,
        messageId: tgData?.result?.message_id,
        message: 'Telegram notification sent successfully to support team.'
      });
    } else {
      return res.status(500).json({
        success: false,
        delivered: false,
        message: `Failed to deliver Telegram notification: ${lastError}`
      });
    }
  } catch (err) {
    console.error('Unhandled notify-locked error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Internal server error while dispatching lock notification.'
    });
  }
}
