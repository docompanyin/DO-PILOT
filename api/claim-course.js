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

const DEFAULT_COUPONS = [];

function normalizeCourseId(rawId) {
  if (!rawId) return 'python-core';
  const norm = String(rawId).toLowerCase().trim();
  if (norm.includes('python')) return 'python-core';
  if (norm.includes('java')) return 'java-core';
  if (norm.includes('fullstack')) return 'fullstack-open';
  if (norm.includes('cyber')) return 'cyber-security';
  return norm;
}

// Atomic helper to load shared coupons from site_content
async function loadSharedCoupons() {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('id', 'course_coupons_v1')
      .maybeSingle();

    if (!error && data && data.content && Array.isArray(data.content.coupons)) {
      return data.content.coupons;
    }
  } catch (err) {
    console.error('Failed to load shared coupons from Supabase:', err);
  }
  return DEFAULT_COUPONS;
}

// Atomic helper to save shared coupons to site_content
async function saveSharedCoupons(coupons) {
  try {
    const { error } = await supabase
      .from('site_content')
      .upsert({
        id: 'course_coupons_v1',
        content: {
          coupons,
          updatedAt: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      });
    if (error) {
      console.error('Failed to upsert course_coupons_v1 to site_content:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exception updating course_coupons_v1 in site_content:', err);
    return false;
  }
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
      studentPhone,
      validateOnly
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

    // 1. Load active shared coupons from persistent backend
    const allCoupons = await loadSharedCoupons();
    const coupon = allCoupons.find(c => (c.code || '').trim().toUpperCase() === cleanCoupon);

    if (!coupon) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coupon code. Check spelling and try again.'
      });
    }

    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This coupon is currently inactive or disabled.'
      });
    }

    // Check course applicability
    const normalizedCouponCourse = coupon.courseId === 'all' ? 'all' : normalizeCourseId(coupon.courseId);
    if (normalizedCouponCourse !== 'all' && normalizedCouponCourse !== cleanCourseId) {
      return res.status(400).json({
        success: false,
        message: `Coupon "${cleanCoupon}" is not applicable to ${courseMeta.title}.`
      });
    }

    // Check expiry timestamp
    if (coupon.validUntil) {
      const expiry = new Date(coupon.validUntil).getTime();
      if (Date.now() > expiry) {
        return res.status(400).json({
          success: false,
          message: 'This coupon code has expired.'
        });
      }
    }

    // Check usage limits
    const maxUses = Number(coupon.maxUses);
    const currentUsedCount = Number(coupon.usedCount || 0);
    if (maxUses > 0 && currentUsedCount >= maxUses) {
      return res.status(400).json({
        success: false,
        message: 'This coupon has reached its maximum usage limit.'
      });
    }

    // Calculate discount amount & final price
    let discountAmount = 0;
    const currentPrice = courseMeta.salePrice;
    if (coupon.discountType === 'percentage') {
      if (coupon.discountValue >= 100) {
        discountAmount = currentPrice;
      } else {
        discountAmount = Math.round((currentPrice * coupon.discountValue) / 100);
      }
    } else {
      discountAmount = Math.min(currentPrice, Number(coupon.discountValue) || 0);
    }
    const finalPrice = Math.max(0, currentPrice - discountAmount);

    // If request is validateOnly, return discount calculations without consuming a redemption slot
    if (validateOnly) {
      return res.status(200).json({
        success: true,
        valid: true,
        coupon: {
          id: coupon.id,
          code: coupon.code,
          courseId: coupon.courseId,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          maxUses: coupon.maxUses,
          usedCount: currentUsedCount,
          isActive: coupon.isActive,
          validUntil: coupon.validUntil,
          description: coupon.description
        },
        discountAmount,
        finalPrice,
        courseId: cleanCourseId,
        message: finalPrice === 0
          ? `Coupon applied: 100% discount! Course is now ₹0.`
          : `Coupon applied: ₹${discountAmount.toLocaleString()} discount!`
      });
    }

    // Must be a 100% discount for zero-claim endpoint
    if (finalPrice > 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or ineligible coupon code. Coupon must provide a 100% discount to claim this course.'
      });
    }

    // Execute atomic redemption:
    // Re-fetch latest state right before incrementing to prevent race conditions
    let updatedCoupons = await loadSharedCoupons();
    let targetIdx = updatedCoupons.findIndex(c => (c.code || '').trim().toUpperCase() === cleanCoupon);
    if (targetIdx === -1) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code not found in shared storage.'
      });
    }

    let targetCoupon = updatedCoupons[targetIdx];
    const liveMax = Number(targetCoupon.maxUses);
    const liveUsed = Number(targetCoupon.usedCount || 0);

    if (liveMax > 0 && liveUsed >= liveMax) {
      return res.status(400).json({
        success: false,
        message: 'This coupon has reached its maximum usage limit.'
      });
    }

    // Increment usage count atomically
    updatedCoupons[targetIdx] = {
      ...targetCoupon,
      usedCount: liveUsed + 1
    };

    const saved = await saveSharedCoupons(updatedCoupons);
    if (!saved) {
      console.warn('Could not persist incremented coupon count to cloud site_content');
    }

    const cleanEmail = (studentEmail || '').trim().toLowerCase();
    const cleanId = (studentId || '').trim();

    // Persist full-course entitlement in Supabase student_profiles
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

    // Persist to telemetry_dopilot_course_purchases_v1 so it displays in Purchase & Enrollment Tracking
    try {
      const { data: purchaseDoc } = await supabase
        .from('site_content')
        .select('content')
        .eq('id', 'telemetry_dopilot_course_purchases_v1')
        .maybeSingle();

      const existingPurchases = (purchaseDoc && purchaseDoc.content && Array.isArray(purchaseDoc.content.purchases))
        ? purchaseDoc.content.purchases
        : [];

      const newPurchaseRecord = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        studentId: cleanId || cleanEmail,
        studentName: studentName || cleanEmail.split('@')[0] || 'Enrolled Student',
        studentEmail: cleanEmail,
        studentPhone: studentPhone || '',
        courseId: cleanCourseId,
        courseName: courseMeta.title,
        originalPrice: courseMeta.salePrice || courseMeta.regularPrice,
        discountAmount: courseMeta.salePrice || courseMeta.regularPrice,
        finalAmount: 0,
        couponCodeApplied: cleanCoupon,
        paymentMethod: 'coupon_free_unlock',
        status: 'completed',
        accessGranted: true,
        purchasedAt: new Date().toISOString()
      };

      const updatedPurchases = [newPurchaseRecord, ...existingPurchases];

      await supabase
        .from('site_content')
        .upsert({
          id: 'telemetry_dopilot_course_purchases_v1',
          content: {
            purchases: updatedPurchases,
            updatedAt: new Date().toISOString()
          },
          updated_at: new Date().toISOString()
        });
    } catch (purchaseTrackErr) {
      console.warn('Non-fatal: could not append to telemetry_dopilot_course_purchases_v1:', purchaseTrackErr);
    }

    return res.status(200).json({
      success: true,
      courseId: cleanCourseId,
      courseName: courseMeta.title,
      enrolledCourses,
      newUsedCount: liveUsed + 1,
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
