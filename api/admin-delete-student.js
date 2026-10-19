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

// Use service role key if available, otherwise anon key
const keyToUse = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, keyToUse);

// List of protected admin emails to never delete under any circumstance
const PROTECTED_ADMIN_EMAILS = [
  'admin@dopilot.online',
  'security@dopilot.online',
  'support@dopilot.online',
  'admin@dopilot.io',
  'dopilotadmin@gmail.com'
];

export default async function handler(req, res) {
  // Polyfill response helpers if needed
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

  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed. Use POST.' });
  }

  try {
    const { studentId, email } = req.body || {};

    if (!email && !studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student email or studentId is required for deletion.'
      });
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanId = (studentId || '').trim();
    const emailSafe = cleanEmail ? cleanEmail.replace(/[^a-z0-9_]/g, '_') : '';

    // Safety guard: NEVER delete protected admin accounts
    if (cleanEmail && PROTECTED_ADMIN_EMAILS.some(a => cleanEmail === a.toLowerCase())) {
      return res.status(403).json({
        success: false,
        message: 'Permission denied: Cannot delete an administrator account.'
      });
    }

    const results = {
      student_profiles: false,
      student_progress: false,
      site_content: false,
      student_leads: false,
      course_purchases: false,
      reward_requests: false,
      locked_courses: false,
      course_resets: false,
      auth_user: false
    };

    // 1. Delete from student_progress (by user_email)
    if (cleanEmail) {
      try {
        const { error: progErr } = await supabase
          .from('student_progress')
          .delete()
          .ilike('user_email', cleanEmail);
        if (!progErr) results.student_progress = true;
      } catch (e) {
        console.warn('Error deleting student_progress:', e);
      }
    }

    // 2. Delete from site_content (student_course_state_*)
    try {
      if (emailSafe) {
        const { error: siteErr } = await supabase
          .from('site_content')
          .delete()
          .eq('id', `student_course_state_${emailSafe}`);
        if (!siteErr) results.site_content = true;
      }
      if (cleanEmail && cleanEmail !== emailSafe) {
        await supabase
          .from('site_content')
          .delete()
          .eq('id', `student_course_state_${cleanEmail}`);
      }
      // Also catch any row matching email pattern
      if (cleanEmail) {
        const { data: matchedRows } = await supabase
          .from('site_content')
          .select('id')
          .ilike('id', `%${cleanEmail}%`);
        if (Array.isArray(matchedRows) && matchedRows.length > 0) {
          for (const row of matchedRows) {
            await supabase.from('site_content').delete().eq('id', row.id);
          }
        }
      }
    } catch (e) {
      console.warn('Error deleting site_content:', e);
    }

    // 3. Delete from student_profiles (by email AND id explicitly)
    try {
      let deletedProfiles = false;
      if (cleanEmail) {
        const { error: profEmailErr } = await supabase
          .from('student_profiles')
          .delete()
          .ilike('email', cleanEmail);
        if (!profEmailErr) deletedProfiles = true;
      }
      if (cleanId) {
        const { error: profIdErr } = await supabase
          .from('student_profiles')
          .delete()
          .eq('id', cleanId);
        if (!profIdErr) deletedProfiles = true;
      }
      results.student_profiles = deletedProfiles;
    } catch (e) {
      console.warn('Error deleting student_profiles:', e);
    }

    // 4. Delete from student_leads (by email and id)
    try {
      if (cleanEmail) {
        const { error: leadErr } = await supabase
          .from('student_leads')
          .delete()
          .ilike('email', cleanEmail);
        if (!leadErr) results.student_leads = true;
      }
      if (cleanId) {
        await supabase.from('student_leads').delete().eq('id', cleanId);
      }
    } catch (e) {
      console.warn('Error deleting student_leads:', e);
    }

    // 5. Delete from course_purchases, reward_requests, locked_courses, course_resets
    try {
      if (cleanEmail) {
        await supabase.from('course_purchases').delete().ilike('student_email', cleanEmail);
        results.course_purchases = true;
      }
      if (cleanId) {
        await supabase.from('course_purchases').delete().eq('student_id', cleanId);
        results.course_purchases = true;
      }
    } catch (e) {
      // Table may not exist or optional
    }

    try {
      if (cleanEmail) {
        await supabase.from('reward_requests').delete().ilike('student_email', cleanEmail);
        results.reward_requests = true;
      }
      if (cleanId) {
        await supabase.from('reward_requests').delete().eq('student_id', cleanId);
        results.reward_requests = true;
      }
    } catch (e) {}

    try {
      if (cleanEmail) {
        await supabase.from('locked_courses').delete().ilike('student_email', cleanEmail);
        results.locked_courses = true;
      }
      if (cleanId) {
        await supabase.from('locked_courses').delete().eq('student_id', cleanId);
        results.locked_courses = true;
      }
    } catch (e) {}

    try {
      if (cleanEmail) {
        await supabase.from('course_resets').delete().ilike('student_email', cleanEmail);
        results.course_resets = true;
      }
      if (cleanId) {
        await supabase.from('course_resets').delete().eq('student_id', cleanId);
        results.course_resets = true;
      }
    } catch (e) {}

    // 6. If SUPABASE_SERVICE_ROLE_KEY is available, attempt Supabase Auth deletion
    if (SUPABASE_SERVICE_ROLE_KEY) {
      try {
        if (cleanId) {
          const { error: authErr } = await supabase.auth.admin.deleteUser(cleanId);
          if (!authErr) results.auth_user = true;
        }
        if (!results.auth_user && cleanEmail && supabase.auth?.admin?.listUsers) {
          const { data: userList } = await supabase.auth.admin.listUsers();
          const targetUser = userList?.users?.find((u) => (u.email || '').toLowerCase() === cleanEmail);
          if (targetUser) {
            const { error: deleteErr } = await supabase.auth.admin.deleteUser(targetUser.id);
            if (!deleteErr) results.auth_user = true;
          }
        }
      } catch (e) {
        console.warn('Supabase Auth user delete notice:', e);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Student account ${cleanEmail || cleanId} and all associated records permanently deleted.`,
      details: results
    });
  } catch (error) {
    console.error('Delete student error:', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Internal server error deleting student.'
    });
  }
}
