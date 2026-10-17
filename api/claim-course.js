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

// Standard Zero-Amount Approved Coupons
const KNOWN_ZERO_COUPONS = [
  { code: 'DOPILOT100', courseId: 'all', discountType: 'percentage', discountValue: 100, isActive: true },
  { code: 'FREE100', courseId: 'all', discountType: 'percentage', discountValue: 100, isActive: true },
  { code: 'PYTHONFREE', courseId: 'python-core', discountType: 'percentage', discountValue: 100, isActive: true }
];

const CANONICAL_COURSES = {
  'python-core': {
    id: 'python-core',
    title: 'Complete Python Course',
    regularPrice: 2999,
    salePrice: 999
  },
  'java-core': {
    id: 'java-core',
    title: 'Complete Java Course',
    regularPrice: 2999,
    salePrice: 999
  },
  'fullstack-open': {
    id: 'fullstack-open',
    title: 'Full Stack Open Course',
    regularPrice: 3999,
    salePrice: 1499
  },
  'cyber-security': {
    id: 'cyber-security',
    title: 'Cyber Security Course',
    regularPrice: 3999,
    salePrice: 1499
  }
};

function normalizeCourseId(rawId) {
  if (!rawId) return 'python-core';
  const norm = String(rawId).toLowerCase().trim();
  if (norm.includes('python')) return 'python-core';
  if (norm.includes('java')) return 'java-core';
  if (norm.includes('fullstack')) return 'fullstack-open';
  if (norm.includes('cyber')) return 'cyber-security';
  return norm;
}

export default async function handler(req, res) {
  // Polyfill response helpers for Vite Connect dev server / Vercel
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
    const {
      courseId,
      couponCode,
      studentId,
      studentEmail,
      studentName,
      studentPhone
    } = req.body || {};

    const cleanCourseId = normalizeCourseId(courseId);
    const courseMeta = CANONICAL_COURSES[cleanCourseId];

    if (!courseMeta) {
      return res.status(400).json({
        success: false,
        message: `Invalid course identifier: ${courseId}`
      });
    }

    const cleanCoupon = (couponCode || '').trim().toUpperCase();

    // Validate coupon eligibility
    let isValidZeroCoupon = false;
    const foundCoupon = KNOWN_ZERO_COUPONS.find(c => c.code === cleanCoupon);

    if (foundCoupon && foundCoupon.isActive) {
      if (foundCoupon.courseId === 'all' || normalizeCourseId(foundCoupon.courseId) === cleanCourseId) {
        if (foundCoupon.discountType === 'percentage' && foundCoupon.discountValue >= 100) {
          isValidZeroCoupon = true;
        }
      }
    }

    if (!isValidZeroCoupon) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or ineligible coupon code. Coupon must provide a 100% discount to claim this course.'
      });
    }

    const cleanEmail = (studentEmail || '').trim().toLowerCase();
    const cleanId = (studentId || '').trim();

    // Persist full-course entitlement in Supabase
    let enrolledCourses = [courseMeta.title];

    if (cleanEmail) {
      try {
        const { data: profile, error: fetchErr } = await supabase
          .from('student_profiles')
          .select('*')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (!fetchErr && profile) {
          const current = Array.isArray(profile.enrolled_courses) ? profile.enrolled_courses : [];
          if (!current.includes(courseMeta.title)) {
            enrolledCourses = [...current, courseMeta.title];
          } else {
            enrolledCourses = current;
          }

          const { error: updateErr } = await supabase
            .from('student_profiles')
            .update({
              enrolled_courses: enrolledCourses,
              updated_at: new Date().toISOString()
            })
            .eq('email', cleanEmail);

          if (updateErr) {
            console.error('Supabase update student_profiles error:', updateErr);
          }
        } else {
          // If profile does not exist yet, upsert it
          const { error: insertErr } = await supabase
            .from('student_profiles')
            .upsert({
              id: cleanId || `student-${Date.now()}`,
              email: cleanEmail,
              name: studentName || cleanEmail.split('@')[0] || 'Enrolled Student',
              phone: studentPhone || null,
              enrolled_courses: [courseMeta.title],
              has_completed_details: false,
              updated_at: new Date().toISOString()
            });

          if (insertErr) {
            console.error('Supabase upsert student_profiles error:', insertErr);
          }
        }
      } catch (dbErr) {
        console.error('Database claim persistence exception:', dbErr);
      }
    }

    return res.status(200).json({
      success: true,
      courseId: cleanCourseId,
      courseName: courseMeta.title,
      enrolledCourses,
      message: `${courseMeta.title} claimed successfully with 100% scholarship!`
    });
  } catch (err) {
    console.error('Claim course handler error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Server error processing course claim.'
    });
  }
}
