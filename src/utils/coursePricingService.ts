import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface CoursePricing {
  courseId: string;       // 'python-core', 'java-core', 'fullstack-open', 'cyber-security'
  courseName: string;     // 'Complete Python Course', etc.
  regularPrice: number;   // e.g. 2999
  salePrice: number;      // e.g. 999
  isFreeCourse?: boolean; // When true, entire course is 100% free without payment!
  currency: string;       // 'INR'
  isActive: boolean;
  features: string[];
  updatedAt: string;
}

export interface CourseCoupon {
  id: string;
  code: string;           // Uppercase, e.g. 'FREE100'
  courseId: string;       // 'all' or specific courseId
  discountType: 'percentage' | 'flat';
  discountValue: number;  // 100 for 100%, 500 for flat 500
  maxUses: number;        // -1 for unlimited
  usedCount: number;
  minOrderAmount?: number;
  validUntil?: string;    // ISO string or undefined
  isActive: boolean;
  description?: string;
  createdAt: string;
  createdBy?: string;
}

export interface CoursePurchaseRecord {
  id: string;             // e.g. 'ORD-100234'
  studentId: string;      // User ID or student email
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  courseId: string;       // 'python-core', etc.
  courseName: string;
  originalPrice: number;
  discountAmount: number;
  finalAmount: number;
  couponCodeApplied?: string;
  paymentMethod: 'coupon_free_unlock' | 'razorpay' | 'stripe' | 'admin_grant' | 'manual_upi_qr';
  paymentId?: string;
  orderId?: string;
  utrNumber?: string;
  adminNotes?: string;
  status: 'completed' | 'pending' | 'pending_verification' | 'failed' | 'rejected' | 'expired';
  purchasedAt: string;    // ISO string
  expiresAt?: string;     // ISO string for session expiration (2 minutes)
  accessGranted: boolean;
}

export const PRICING_STORAGE_KEY = 'dopilot_course_pricing_v1';
export const COUPONS_STORAGE_KEY = 'dopilot_course_coupons_v1';
export const PURCHASES_STORAGE_KEY = 'dopilot_course_purchases_v1';

export const INITIAL_DEFAULT_PRICING: CoursePricing[] = [
  {
    courseId: 'python-core',
    courseName: 'Complete Python Course',
    regularPrice: 2999,
    salePrice: 999,
    isFreeCourse: false,
    currency: 'INR',
    isActive: true,
    features: [
      'All 14 Interactive Parts & 84 Compulsory Levels',
      'Official Python Core Verified Certificate',
      'Interactive Browser Compiler & CodeLab',
      'Lifetime Access & Free Content Updates'
    ],
    updatedAt: new Date().toISOString()
  },
  {
    courseId: 'java-core',
    courseName: 'Complete Java Course',
    regularPrice: 2999,
    salePrice: 999,
    isFreeCourse: false,
    currency: 'INR',
    isActive: true,
    features: [
      'All 14 In-Depth Parts & 84 Programming Levels',
      'Official Java Core Verified Certificate',
      'OOP Architecture & Real-world Capstone',
      'Lifetime Access & Community Mentor Access'
    ],
    updatedAt: new Date().toISOString()
  },
  {
    courseId: 'fullstack-open',
    courseName: 'Full Stack Open Course',
    regularPrice: 3999,
    salePrice: 1499,
    isFreeCourse: false,
    currency: 'INR',
    isActive: true,
    features: [
      'Parts 0 through 13 (Helsinki University Standard)',
      'React, Redux, Node, TypeScript, Docker & CI/CD',
      'Official Full Stack Verified Certificate',
      'Production-Grade Portfolio Projects'
    ],
    updatedAt: new Date().toISOString()
  },
  {
    courseId: 'cyber-security',
    courseName: 'Cyber Security Course',
    regularPrice: 3999,
    salePrice: 1499,
    isFreeCourse: false,
    currency: 'INR',
    isActive: true,
    features: [
      'All 14 Comprehensive Cyber Defense & Threat Parts',
      'CISSP Foundations & Ethical Hacking Labs',
      'Official Cyber Security Master Certificate',
      'Lifetime Access & Security Playbooks'
    ],
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_DEFAULT_COUPONS: CourseCoupon[] = [
  {
    id: 'CPN-101',
    code: 'DOPILOT100',
    courseId: 'all',
    discountType: 'percentage',
    discountValue: 100,
    maxUses: -1,
    usedCount: 14,
    isActive: true,
    description: '100% Free Full Course Access Scholarship',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 'CPN-102',
    code: 'FREE100',
    courseId: 'all',
    discountType: 'percentage',
    discountValue: 100,
    maxUses: -1,
    usedCount: 28,
    isActive: true,
    description: 'Full 100% Off Course Access Unlock',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString()
  },
  {
    id: 'CPN-103',
    code: 'EARLYBIRD50',
    courseId: 'all',
    discountType: 'percentage',
    discountValue: 50,
    maxUses: 500,
    usedCount: 42,
    isActive: true,
    description: '50% Early Bird Community Discount',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
  },
  {
    id: 'CPN-104',
    code: 'PYTHONFREE',
    courseId: 'python-core',
    discountType: 'percentage',
    discountValue: 100,
    maxUses: 200,
    usedCount: 19,
    isActive: true,
    description: '100% Off Complete Python Course',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
  }
];

// Seed demo purchase records so admin panel analytics and student records look active
const INITIAL_DEMO_PURCHASES: CoursePurchaseRecord[] = [
  {
    id: 'ORD-9801',
    studentId: 'demo-std-1',
    studentName: 'Rahul Verma',
    studentEmail: 'rahul.verma@techsprint.io',
    studentPhone: '+91 98450 12345',
    courseId: 'python-core',
    courseName: 'Complete Python Course',
    originalPrice: 999,
    discountAmount: 999,
    finalAmount: 0,
    couponCodeApplied: 'DOPILOT100',
    paymentMethod: 'coupon_free_unlock',
    status: 'completed',
    purchasedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    accessGranted: true
  },
  {
    id: 'ORD-9802',
    studentId: 'demo-std-2',
    studentName: 'Priya Patel',
    studentEmail: 'priya.patel@gmail.com',
    studentPhone: '+91 98765 43210',
    courseId: 'python-core',
    courseName: 'Complete Python Course',
    originalPrice: 999,
    discountAmount: 999,
    finalAmount: 0,
    couponCodeApplied: 'FREE100',
    paymentMethod: 'coupon_free_unlock',
    status: 'completed',
    purchasedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    accessGranted: true
  },
  {
    id: 'ORD-UPI-781290',
    studentId: 'demo-std-3',
    studentName: 'Aditya Sharma',
    studentEmail: 'aditya.sharma@gmail.com',
    studentPhone: '+91 98112 34567',
    courseId: 'java-core',
    courseName: 'Complete Java Course',
    originalPrice: 2999,
    discountAmount: 2000,
    finalAmount: 999,
    couponCodeApplied: undefined,
    paymentMethod: 'manual_upi_qr',
    utrNumber: '428901235619',
    status: 'pending_verification',
    purchasedAt: new Date(Date.now() - 45 * 60000).toISOString(),
    accessGranted: false
  },
  {
    id: 'ORD-QR-610294',
    studentId: 'demo-std-4',
    studentName: 'Sneha Kulkarni',
    studentEmail: 'sneha.k@outlook.com',
    studentPhone: '+91 98234 56789',
    courseId: 'cyber-security',
    courseName: 'Cyber Security Course',
    originalPrice: 3999,
    discountAmount: 2500,
    finalAmount: 1499,
    couponCodeApplied: undefined,
    paymentMethod: 'manual_upi_qr',
    utrNumber: '',
    status: 'expired',
    purchasedAt: new Date(Date.now() - 120 * 60000).toISOString(),
    expiresAt: new Date(Date.now() - 118 * 60000).toISOString(),
    accessGranted: false
  }
];

/**
 * Normalize course identifier for comparison
 */
export const normalizeCourseId = (rawId: string): string => {
  const norm = rawId.toLowerCase().trim();
  if (norm.includes('python')) return 'python-core';
  if (norm.includes('java')) return 'java-core';
  if (norm.includes('fullstack')) return 'fullstack-open';
  if (norm.includes('cyber')) return 'cyber-security';
  return norm;
};

/**
 * Get all course pricing
 */
export const getCoursePricingList = (): CoursePricing[] => {
  try {
    const raw = localStorage.getItem(PRICING_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PRICING_STORAGE_KEY, JSON.stringify(INITIAL_DEFAULT_PRICING));
      return INITIAL_DEFAULT_PRICING;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_DEFAULT_PRICING;
  } catch (e) {
    console.error('Failed to read course pricing from storage:', e);
    return INITIAL_DEFAULT_PRICING;
  }
};

/**
 * Get pricing for a single course
 */
export const getCoursePricing = (courseId: string): CoursePricing => {
  const list = getCoursePricingList();
  const normalized = normalizeCourseId(courseId);
  const found = list.find(p => normalizeCourseId(p.courseId) === normalized);
  if (found) return found;

  const fallback = INITIAL_DEFAULT_PRICING.find(p => normalizeCourseId(p.courseId) === normalized);
  return fallback || INITIAL_DEFAULT_PRICING[0];
};

/**
 * Update course pricing (Admin)
 */
export const updateCoursePricing = (updated: CoursePricing): boolean => {
  const list = getCoursePricingList();
  const normalized = normalizeCourseId(updated.courseId);
  const idx = list.findIndex(p => normalizeCourseId(p.courseId) === normalized);

  const newEntry: CoursePricing = {
    ...updated,
    updatedAt: new Date().toISOString()
  };

  if (idx !== -1) {
    list[idx] = newEntry;
  } else {
    list.push(newEntry);
  }

  try {
    localStorage.setItem(PRICING_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('dopilot_pricing_updated', { detail: newEntry }));
  } catch (e) {
    console.error('Failed to write pricing to storage:', e);
    return false;
  }

  // Supabase background sync
  if (isSupabaseConfigured()) {
    Promise.resolve(
      supabase.from('course_pricing').upsert({
        course_id: newEntry.courseId,
        course_name: newEntry.courseName,
        regular_price: newEntry.regularPrice,
        sale_price: newEntry.salePrice,
        is_free_course: Boolean(newEntry.isFreeCourse),
        currency: newEntry.currency,
        is_active: newEntry.isActive,
        features: newEntry.features,
        updated_at: newEntry.updatedAt
      })
    ).catch(() => {});
  }

  return true;
};

/**
 * Get all course coupons
 */
export const getCourseCoupons = (): CourseCoupon[] => {
  try {
    const raw = localStorage.getItem(COUPONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(INITIAL_DEFAULT_COUPONS));
      return INITIAL_DEFAULT_COUPONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_DEFAULT_COUPONS;
  } catch (e) {
    console.error('Failed to read coupons from storage:', e);
    return INITIAL_DEFAULT_COUPONS;
  }
};

/**
 * Create a new coupon (Admin)
 */
export const createCourseCoupon = (
  couponData: Omit<CourseCoupon, 'id' | 'createdAt' | 'usedCount'>
): CourseCoupon => {
  const current = getCourseCoupons();
  const normalizedCode = couponData.code.trim().toUpperCase();

  const newCoupon: CourseCoupon = {
    ...couponData,
    id: `CPN-${Date.now().toString().slice(-6)}`,
    code: normalizedCode,
    usedCount: 0,
    createdAt: new Date().toISOString()
  };

  const updated = [newCoupon, ...current];
  try {
    localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('dopilot_coupons_updated', { detail: newCoupon }));
  } catch (e) {
    console.error('Failed to save new coupon to storage:', e);
  }

  // Supabase background sync
  if (isSupabaseConfigured()) {
    Promise.resolve(
      supabase.from('course_coupons').insert({
        id: newCoupon.id,
        code: newCoupon.code,
        course_id: newCoupon.courseId,
        discount_type: newCoupon.discountType,
        discount_value: newCoupon.discountValue,
        max_uses: newCoupon.maxUses,
        used_count: 0,
        is_active: newCoupon.isActive,
        description: newCoupon.description || null,
        valid_until: newCoupon.validUntil || null,
        created_at: newCoupon.createdAt
      })
    ).catch(() => {});
  }

  return newCoupon;
};

/**
 * Update existing coupon (Admin)
 */
export const updateCourseCoupon = (coupon: CourseCoupon): boolean => {
  const current = getCourseCoupons();
  const idx = current.findIndex(c => c.id === coupon.id);
  if (idx === -1) return false;

  current[idx] = {
    ...coupon,
    code: coupon.code.trim().toUpperCase()
  };

  try {
    localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent('dopilot_coupons_updated', { detail: current[idx] }));
  } catch (e) {
    console.error('Failed to update coupon in storage:', e);
    return false;
  }

  if (isSupabaseConfigured()) {
    Promise.resolve(
      supabase.from('course_coupons').upsert({
        id: coupon.id,
        code: coupon.code,
        course_id: coupon.courseId,
        discount_type: coupon.discountType,
        discount_value: coupon.discountValue,
        max_uses: coupon.maxUses,
        used_count: coupon.usedCount,
        is_active: coupon.isActive,
        description: coupon.description || null,
        valid_until: coupon.validUntil || null
      })
    ).catch(() => {});
  }

  return true;
};

/**
 * Delete a coupon (Admin)
 */
export const deleteCourseCoupon = (couponIdOrCode: string): boolean => {
  const current = getCourseCoupons();
  const target = current.find(c => c.id === couponIdOrCode || c.code.toUpperCase() === couponIdOrCode.toUpperCase());
  if (!target) return false;
  const updated = current.filter(c => c.id !== target.id);

  try {
    localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('dopilot_coupons_updated'));
  } catch (e) {
    console.error('Failed to delete coupon from storage:', e);
    return false;
  }

  if (isSupabaseConfigured()) {
    Promise.resolve(
      supabase.from('course_coupons').delete().eq('id', target.id)
    ).catch(() => {});
  }

  return true;
};

/**
 * Toggle coupon active/inactive status
 */
export const toggleCourseCouponActive = (couponIdOrCode: string): boolean => {
  const current = getCourseCoupons();
  const coupon = current.find(c => c.id === couponIdOrCode || c.code.toUpperCase() === couponIdOrCode.toUpperCase());
  if (!coupon) return false;

  coupon.isActive = !coupon.isActive;
  return updateCourseCoupon(coupon);
};

/**
 * Validate a coupon code against a target course and price
 */
export const validateCoupon = (
  rawCode: string,
  courseId: string,
  currentPrice: number
): {
  valid: boolean;
  error?: string;
  coupon?: CourseCoupon;
  discountAmount: number;
  finalPrice: number;
} => {
  const code = rawCode.trim().toUpperCase();
  if (!code) {
    return { valid: false, error: 'Please enter a coupon code.', discountAmount: 0, finalPrice: currentPrice };
  }

  const coupons = getCourseCoupons();
  const coupon = coupons.find(c => c.code === code);

  if (!coupon) {
    return { valid: false, error: 'Invalid coupon code. Check spelling and try again.', discountAmount: 0, finalPrice: currentPrice };
  }

  if (!coupon.isActive) {
    return { valid: false, error: 'This coupon is currently inactive or expired.', discountAmount: 0, finalPrice: currentPrice };
  }

  // Check course applicability
  const normalizedTarget = normalizeCourseId(courseId);
  const normalizedCouponCourse = coupon.courseId === 'all' ? 'all' : normalizeCourseId(coupon.courseId);

  if (normalizedCouponCourse !== 'all' && normalizedCouponCourse !== normalizedTarget) {
    return {
      valid: false,
      error: `Coupon "${code}" applies only to ${coupon.courseId.replace('-', ' ').toUpperCase()}.`,
      discountAmount: 0,
      finalPrice: currentPrice
    };
  }

  // Check expiry date
  if (coupon.validUntil) {
    const expiry = new Date(coupon.validUntil).getTime();
    if (Date.now() > expiry) {
      return { valid: false, error: 'This coupon code has expired.', discountAmount: 0, finalPrice: currentPrice };
    }
  }

  // Check max usages
  if (coupon.maxUses !== -1 && coupon.usedCount >= coupon.maxUses) {
    return { valid: false, error: 'This coupon has reached its maximum usage limit.', discountAmount: 0, finalPrice: currentPrice };
  }

  // Calculate discount
  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    if (coupon.discountValue >= 100) {
      discountAmount = currentPrice;
    } else {
      discountAmount = Math.round((currentPrice * coupon.discountValue) / 100);
    }
  } else {
    discountAmount = Math.min(currentPrice, coupon.discountValue);
  }

  const finalPrice = Math.max(0, currentPrice - discountAmount);

  return {
    valid: true,
    coupon,
    discountAmount,
    finalPrice
  };
};

/**
 * Get all course purchases
 */
export const getCoursePurchases = (): CoursePurchaseRecord[] => {
  try {
    const raw = localStorage.getItem(PURCHASES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_PURCHASES));
      return INITIAL_DEMO_PURCHASES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_DEMO_PURCHASES;
  } catch (e) {
    console.error('Failed to read purchases from storage:', e);
    return INITIAL_DEMO_PURCHASES;
  }
};

/**
 * Check whether a user has purchased / has full access to a course
 */
export const hasCourseAccess = (
  paramA: string | undefined,
  paramB?: string
): boolean => {
  if (!paramA && !paramB) return false;

  const isEmail = (str?: string) => Boolean(str && str.includes('@'));
  const isCourseIdentifier = (str?: string) => {
    if (!str || isEmail(str)) return false;
    const lower = str.toLowerCase();
    return (
      lower.includes('core') ||
      lower.includes('open') ||
      lower.includes('python') ||
      lower.includes('java') ||
      lower.includes('cyber') ||
      lower.includes('fullstack') ||
      lower.includes('complete-')
    );
  };

  let courseId = 'python-core';
  let studentIdOrEmail: string | undefined = undefined;

  if (isEmail(paramA)) {
    studentIdOrEmail = paramA;
    courseId = paramB || 'python-core';
  } else if (isEmail(paramB)) {
    studentIdOrEmail = paramB;
    courseId = paramA || 'python-core';
  } else if (isCourseIdentifier(paramA)) {
    courseId = paramA!;
    studentIdOrEmail = paramB;
  } else if (isCourseIdentifier(paramB)) {
    courseId = paramB!;
    studentIdOrEmail = paramA;
  } else {
    studentIdOrEmail = paramA;
    courseId = paramB || 'python-core';
  }

  const normalizedCourse = normalizeCourseId(courseId);

  // Check if course is configured as Free Course in Admin Panel
  try {
    const pricing = getCoursePricing(normalizedCourse);
    if (pricing && (pricing.isFreeCourse === true || pricing.salePrice === 0)) {
      return true;
    }
  } catch {}

  // Check global unlock flag if set
  try {
    if (localStorage.getItem(`dopilot_purchased_${normalizedCourse}_global`) === 'true') {
      return true;
    }
  } catch {}

  // Helper to test if a course name/id matches normalizedCourse
  const courseMatches = (str?: string): boolean => {
    if (!str) return false;
    const norm = normalizeCourseId(str);
    if (norm === normalizedCourse) return true;
    const lower = str.toLowerCase();
    if (normalizedCourse === 'python-core' && lower.includes('python')) return true;
    if (normalizedCourse === 'java-core' && lower.includes('java')) return true;
    if (normalizedCourse === 'fullstack-open' && lower.includes('fullstack')) return true;
    if (normalizedCourse === 'cyber-security' && lower.includes('cyber')) return true;
    return false;
  };

  // 1. Check active user session in localStorage (dopilot_student_session_v1)
  try {
    const rawSession = localStorage.getItem('dopilot_student_session_v1');
    if (rawSession) {
      const session = JSON.parse(rawSession);
      if (session && Array.isArray(session.enrolledCourses)) {
        if (session.enrolledCourses.some((c: string) => courseMatches(c))) {
          return true;
        }
      }
      // If studentIdOrEmail wasn't passed, fall back to session user identity
      if (!studentIdOrEmail) {
        studentIdOrEmail = session.id || session.email;
      }
    }
  } catch {}

  if (!studentIdOrEmail) return false;

  // 2. Check direct user purchase key in localStorage
  try {
    const userPurchasesRaw = localStorage.getItem(`dopilot_purchased_courses_${studentIdOrEmail}`);
    if (userPurchasesRaw) {
      const purchasedList: string[] = JSON.parse(userPurchasesRaw);
      if (Array.isArray(purchasedList)) {
        const found = purchasedList.some(id => courseMatches(id));
        if (found) return true;
      }
    }
  } catch {}

  // 3. Check global purchases registry
  const purchases = getCoursePurchases();
  const hasCompletedPurchase = purchases.some(
    p =>
      (p.studentId === studentIdOrEmail || (p.studentEmail && p.studentEmail.toLowerCase() === studentIdOrEmail!.toLowerCase())) &&
      courseMatches(p.courseId) &&
      p.status === 'completed' &&
      p.accessGranted
  );
  if (hasCompletedPurchase) return true;

  return false;
};

/**
 * Record a new course purchase and grant permanent access
 */
export const recordCoursePurchase = (
  data: Omit<CoursePurchaseRecord, 'id' | 'purchasedAt' | 'accessGranted'>
): { success: boolean; record?: CoursePurchaseRecord; error?: string } => {
  const normalizedCourse = normalizeCourseId(data.courseId);

  // Prevent duplicate purchase if student already owns the course
  if (hasCourseAccess(data.studentId, normalizedCourse)) {
    return {
      success: true,
      error: 'You already own full access to this course!'
    };
  }

  const newRecord: CoursePurchaseRecord = {
    ...data,
    courseId: normalizedCourse,
    id: `ORD-${Date.now().toString().slice(-6)}`,
    purchasedAt: new Date().toISOString(),
    status: 'completed',
    accessGranted: true
  };

  // 1. Update purchases registry
  const purchases = getCoursePurchases();
  const updatedPurchases = [newRecord, ...purchases];
  try {
    localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(updatedPurchases));
  } catch (e) {
    console.error('Failed to save purchase record to storage:', e);
  }

  // 2. Store in student-specific purchased courses array
  try {
    const userPurchasesRaw = localStorage.getItem(`dopilot_purchased_courses_${data.studentId}`) || '[]';
    const currentList: string[] = JSON.parse(userPurchasesRaw);
    if (!currentList.includes(normalizedCourse)) {
      currentList.push(normalizedCourse);
    }
    localStorage.setItem(`dopilot_purchased_courses_${data.studentId}`, JSON.stringify(currentList));

    // Also store by email if different from studentId
    if (data.studentEmail && data.studentEmail !== data.studentId) {
      localStorage.setItem(`dopilot_purchased_courses_${data.studentEmail}`, JSON.stringify(currentList));
    }
  } catch (e) {
    console.error('Failed to store student purchased courses key:', e);
  }

  // 3. Update current user session enrolledCourses if logged in
  try {
    const rawSession = localStorage.getItem('dopilot_student_session_v1');
    if (rawSession) {
      const session = JSON.parse(rawSession);
      if (session) {
        const enrolled = session.enrolledCourses || [];
        if (!enrolled.includes(data.courseName)) {
          session.enrolledCourses = [...enrolled, data.courseName];
          localStorage.setItem('dopilot_student_session_v1', JSON.stringify(session));
        }
      }
    }
  } catch (e) {}

  // 4. Increment coupon usage count if coupon was applied
  if (data.couponCodeApplied) {
    const coupons = getCourseCoupons();
    const couponIdx = coupons.findIndex(c => c.code === data.couponCodeApplied?.trim().toUpperCase());
    if (couponIdx !== -1) {
      coupons[couponIdx].usedCount += 1;
      try {
        localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(coupons));
      } catch {}
    }
  }

  // 5. Dispatch global events for instant reactivity in all open components
  window.dispatchEvent(new CustomEvent('dopilot_course_purchased', { detail: newRecord }));
  window.dispatchEvent(new CustomEvent('dopilot_access_granted', { detail: { courseId: normalizedCourse, studentId: data.studentId } }));

  // 6. Sync with Supabase PostgreSQL database
  if (isSupabaseConfigured()) {
    Promise.resolve(
      supabase.from('course_purchases').insert({
        id: newRecord.id,
        student_id: newRecord.studentId,
        student_name: newRecord.studentName,
        student_email: newRecord.studentEmail,
        student_phone: newRecord.studentPhone || null,
        course_id: newRecord.courseId,
        course_name: newRecord.courseName,
        original_price: newRecord.originalPrice,
        discount_amount: newRecord.discountAmount,
        final_amount: newRecord.finalAmount,
        coupon_code_applied: newRecord.couponCodeApplied || null,
        payment_method: newRecord.paymentMethod,
        payment_id: newRecord.paymentId || null,
        order_id: newRecord.orderId || null,
        status: newRecord.status,
        purchased_at: newRecord.purchasedAt,
        access_granted: true
      })
    ).catch(() => {});

    // Ensure student_profiles.enrolled_courses is updated in Supabase
    if (newRecord.studentEmail) {
      const cleanEmail = newRecord.studentEmail.toLowerCase().trim();
      (async () => {
        try {
          const { data: profile } = await supabase
            .from('student_profiles')
            .select('enrolled_courses')
            .eq('email', cleanEmail)
            .maybeSingle();
          const current = (profile && Array.isArray((profile as any).enrolled_courses)) ? (profile as any).enrolled_courses : [];
          if (!current.includes(newRecord.courseName)) {
            const updated = [...current, newRecord.courseName];
            await supabase
              .from('student_profiles')
              .update({
                enrolled_courses: updated,
                updated_at: new Date().toISOString()
              })
              .eq('email', cleanEmail);
          }
        } catch {
          // ignore background sync errors
        }
      })();
    }
  }

  return { success: true, record: newRecord };
};

export interface PaymentQRConfig {
  recipientName: string;
  bankingName: string;
  merchantName: string; // compatibility alias to bankingName
  phoneNumber: string;
  upiId: string;
  qrImageUrl: string;
  paymentInstructions?: string;
  timeoutMinutes: number;
  isEnabled: boolean;
  paymentMethod?: 'google_pay_upi';
  updatedAt: string;
}

export const PAYMENT_QR_CONFIG_KEY = 'dopilot_payment_qr_config_v1';

export const DEFAULT_PAYMENT_QR_CONFIG: PaymentQRConfig = {
  recipientName: 'Jayadev Nair',
  bankingName: 'JAYADEV NAIR',
  merchantName: 'JAYADEV NAIR',
  phoneNumber: '+91 97459 49326',
  upiId: 'jayadevnair200518@oksbi',
  qrImageUrl: '',
  paymentInstructions: 'Scan with Google Pay or any UPI app. After completing the payment, enter your 12-digit UPI Reference / UTR Number to verify your enrollment.',
  timeoutMinutes: 10,
  isEnabled: true,
  paymentMethod: 'google_pay_upi',
  updatedAt: new Date().toISOString()
};

/**
 * Verify whether an image URL is valid and loads successfully via an HTML Image object
 */
export const verifyImageUrl = (url: string): Promise<{ valid: boolean; error?: string }> => {
  return new Promise((resolve) => {
    if (!url || !url.trim()) {
      resolve({ valid: true }); // Blank is permissible
      return;
    }

    const cleanUrl = url.trim();

    // Basic URL validation
    try {
      const parsed = new URL(cleanUrl);
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
        resolve({ valid: false, error: 'Image URL must use HTTPS.' });
        return;
      }
    } catch {
      resolve({ valid: false, error: 'Please enter a valid web URL.' });
      return;
    }

    if (typeof window === 'undefined') {
      resolve({ valid: true });
      return;
    }

    const img = new Image();
    let isSettled = false;

    img.onload = () => {
      if (!isSettled) {
        isSettled = true;
        resolve({ valid: true });
      }
    };

    img.onerror = () => {
      if (!isSettled) {
        isSettled = true;
        resolve({ valid: false, error: 'Failed to load image from the specified URL. Please check the link or CORS headers.' });
      }
    };

    img.src = cleanUrl;

    setTimeout(() => {
      if (!isSettled) {
        isSettled = true;
        resolve({ valid: false, error: 'Image verification timed out. Please check if the link is publicly accessible.' });
      }
    }, 6000);
  });
};

export const getPaymentQRConfig = (): PaymentQRConfig => {
  try {
    const raw = localStorage.getItem(PAYMENT_QR_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_PAYMENT_QR_CONFIG,
        ...parsed,
        recipientName: parsed.recipientName || DEFAULT_PAYMENT_QR_CONFIG.recipientName,
        bankingName: parsed.bankingName || parsed.merchantName || DEFAULT_PAYMENT_QR_CONFIG.bankingName,
        merchantName: parsed.bankingName || parsed.merchantName || DEFAULT_PAYMENT_QR_CONFIG.merchantName,
        phoneNumber: parsed.phoneNumber || DEFAULT_PAYMENT_QR_CONFIG.phoneNumber,
        upiId: parsed.upiId && parsed.upiId !== 'dopilot@upi' ? parsed.upiId : DEFAULT_PAYMENT_QR_CONFIG.upiId,
        paymentMethod: 'google_pay_upi'
      };
    }
  } catch (e) {
    console.error('Failed to read payment QR config:', e);
  }
  return DEFAULT_PAYMENT_QR_CONFIG;
};

export const updatePaymentQRConfig = (config: Partial<PaymentQRConfig>): PaymentQRConfig => {
  const current = getPaymentQRConfig();
  const bankingName = config.bankingName || config.merchantName || current.bankingName;
  const updated: PaymentQRConfig = {
    ...current,
    ...config,
    bankingName,
    merchantName: bankingName,
    updatedAt: new Date().toISOString()
  };
  try {
    localStorage.setItem(PAYMENT_QR_CONFIG_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('dopilot_payment_qr_updated', { detail: updated }));
    window.dispatchEvent(new CustomEvent('dopilot_payment_qr_config_updated', { detail: updated }));
  } catch (e) {
    console.error('Failed to save payment QR config:', e);
  }

  if (isSupabaseConfigured()) {
    Promise.resolve(
      supabase.from('app_settings').upsert({
        key: 'payment_qr_config',
        value: updated,
        updated_at: updated.updatedAt
      })
    ).catch(() => {});
  }

  return updated;
};

/**
 * Create a payment record when a student starts a QR payment session
 * Tracks student ID, name, email, phone, course, expected amount, and 2-minute expiration
 */
export const createQRPaymentSession = (data: {
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  courseId: string;
  courseName: string;
  originalPrice: number;
  discountAmount: number;
  finalAmount: number;
  couponCodeApplied?: string;
}): CoursePurchaseRecord => {
  const normalizedCourse = normalizeCourseId(data.courseId);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 120 * 1000).toISOString(); // 2 minutes

  const purchases = getCoursePurchases();
  
  // Check if an active pending session already exists for this student and course
  const existingPending = purchases.find(
    p => p.studentId === data.studentId &&
         p.courseId === normalizedCourse &&
         p.paymentMethod === 'manual_upi_qr' &&
         p.status === 'pending'
  );

  if (existingPending) {
    existingPending.originalPrice = data.originalPrice;
    existingPending.discountAmount = data.discountAmount;
    existingPending.finalAmount = data.finalAmount;
    existingPending.couponCodeApplied = data.couponCodeApplied;
    existingPending.purchasedAt = now.toISOString();
    existingPending.expiresAt = expiresAt;
    existingPending.status = 'pending';
    if (data.studentPhone) existingPending.studentPhone = data.studentPhone;

    try {
      localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(purchases));
      window.dispatchEvent(new CustomEvent('dopilot_course_purchased', { detail: existingPending }));
    } catch (e) {}

    return existingPending;
  }

  const newRecord: CoursePurchaseRecord = {
    id: `ORD-QR-${Date.now().toString().slice(-6)}`,
    studentId: data.studentId,
    studentName: data.studentName,
    studentEmail: data.studentEmail,
    studentPhone: data.studentPhone,
    courseId: normalizedCourse,
    courseName: data.courseName,
    originalPrice: data.originalPrice,
    discountAmount: data.discountAmount,
    finalAmount: data.finalAmount,
    couponCodeApplied: data.couponCodeApplied,
    paymentMethod: 'manual_upi_qr',
    utrNumber: '',
    status: 'pending',
    purchasedAt: now.toISOString(),
    expiresAt,
    accessGranted: false
  };

  const updatedPurchases = [newRecord, ...purchases];
  try {
    localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(updatedPurchases));
    window.dispatchEvent(new CustomEvent('dopilot_course_purchased', { detail: newRecord }));
  } catch (e) {
    console.error('Failed to save QR session record:', e);
  }

  if (isSupabaseConfigured()) {
    Promise.resolve(
      supabase.from('course_purchases').insert({
        id: newRecord.id,
        student_id: newRecord.studentId,
        student_name: newRecord.studentName,
        student_email: newRecord.studentEmail,
        student_phone: newRecord.studentPhone || null,
        course_id: newRecord.courseId,
        course_name: newRecord.courseName,
        original_price: newRecord.originalPrice,
        discount_amount: newRecord.discountAmount,
        final_amount: newRecord.finalAmount,
        coupon_code_applied: newRecord.couponCodeApplied || null,
        payment_method: 'manual_upi_qr',
        status: 'pending',
        purchased_at: newRecord.purchasedAt,
        access_granted: false
      })
    ).catch(() => {});
  }

  return newRecord;
};

/**
 * Close or expire the QR payment session after 2 minutes
 * IMPORTANT: Expiration must not automatically mark the payment as successful!
 */
export const expireQRPaymentSession = (sessionIdOrStudentId: string, courseId?: string): boolean => {
  const purchases = getCoursePurchases();
  const normalizedCourse = courseId ? normalizeCourseId(courseId) : undefined;

  let target = purchases.find(p => p.id === sessionIdOrStudentId);
  if (!target && normalizedCourse) {
    target = purchases.find(
      p => p.studentId === sessionIdOrStudentId &&
           p.courseId === normalizedCourse &&
           p.paymentMethod === 'manual_upi_qr' &&
           p.status === 'pending'
    );
  }

  if (!target) return false;
  // Never overwrite completed or pending_verification payments
  if (target.status !== 'pending') return false;

  target.status = 'expired';
  target.accessGranted = false;

  try {
    localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(purchases));
    window.dispatchEvent(new CustomEvent('dopilot_course_purchased', { detail: target }));
  } catch (e) {}

  if (isSupabaseConfigured()) {
    Promise.resolve(
      supabase.from('course_purchases').update({
        status: 'expired',
        access_granted: false,
        updated_at: new Date().toISOString()
      }).eq('id', target.id)
    ).catch(() => {});
  }

  return true;
};

/**
 * Submit a manual UPI QR payment with 12-digit UTR for admin verification
 */
export const submitManualQRPurchase = (data: {
  sessionId?: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  courseId: string;
  courseName: string;
  originalPrice: number;
  discountAmount: number;
  finalAmount: number;
  couponCodeApplied?: string;
  utrNumber: string;
}): { success: boolean; record?: CoursePurchaseRecord; error?: string } => {
  const normalizedCourse = normalizeCourseId(data.courseId);
  const utr = data.utrNumber.trim();
  if (!utr || utr.length < 6) {
    return { success: false, error: 'Please enter a valid UPI Reference / UTR number (at least 6 digits).' };
  }

  const purchases = getCoursePurchases();

  // Prevent duplicate enrollment if user already has access
  if (hasCourseAccess(data.studentId, normalizedCourse)) {
    return { success: false, error: 'You already have full access to this course!' };
  }

  // Prevent duplicate UTR submission if already verified on completed order
  const duplicate = purchases.find(
    p => p.utrNumber && p.utrNumber.toLowerCase() === utr.toLowerCase() && p.status === 'completed'
  );
  if (duplicate) {
    return { success: false, error: 'This UPI Reference / UTR number has already been verified for another enrollment.' };
  }

  // Match existing QR session if provided or pending
  let existing = data.sessionId ? purchases.find(p => p.id === data.sessionId) : undefined;
  if (!existing) {
    existing = purchases.find(
      p => p.studentId === data.studentId &&
           p.courseId === normalizedCourse &&
           p.paymentMethod === 'manual_upi_qr' &&
           (p.status === 'pending' || p.status === 'expired')
    );
  }

  if (existing) {
    existing.utrNumber = utr;
    existing.status = 'pending_verification';
    existing.purchasedAt = new Date().toISOString();
    existing.originalPrice = data.originalPrice;
    existing.discountAmount = data.discountAmount;
    existing.finalAmount = data.finalAmount;
    existing.couponCodeApplied = data.couponCodeApplied;
    if (data.studentPhone) existing.studentPhone = data.studentPhone;

    try {
      localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(purchases));
      window.dispatchEvent(new CustomEvent('dopilot_course_purchased', { detail: existing }));
    } catch (e) {}

    // Increment coupon usage count if coupon was applied
    if (data.couponCodeApplied) {
      const coupons = getCourseCoupons();
      const couponIdx = coupons.findIndex(c => c.code === data.couponCodeApplied?.trim().toUpperCase());
      if (couponIdx !== -1) {
        coupons[couponIdx].usedCount += 1;
        try {
          localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(coupons));
        } catch {}
      }
    }

    if (isSupabaseConfigured()) {
      Promise.resolve(
        supabase.from('course_purchases').update({
          utr_number: utr,
          status: 'pending_verification',
          purchased_at: existing.purchasedAt,
          updated_at: new Date().toISOString()
        }).eq('id', existing.id)
      ).catch(() => {});
    }

    return { success: true, record: existing };
  }

  const newRecord: CoursePurchaseRecord = {
    id: `ORD-UPI-${Date.now().toString().slice(-6)}`,
    studentId: data.studentId,
    studentName: data.studentName,
    studentEmail: data.studentEmail,
    studentPhone: data.studentPhone,
    courseId: normalizedCourse,
    courseName: data.courseName,
    originalPrice: data.originalPrice,
    discountAmount: data.discountAmount,
    finalAmount: data.finalAmount,
    couponCodeApplied: data.couponCodeApplied,
    paymentMethod: 'manual_upi_qr',
    utrNumber: utr,
    status: 'pending_verification',
    purchasedAt: new Date().toISOString(),
    accessGranted: false
  };

  const updatedPurchases = [newRecord, ...purchases];
  try {
    localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(updatedPurchases));
    window.dispatchEvent(new CustomEvent('dopilot_course_purchased', { detail: newRecord }));
  } catch (e) {
    console.error('Failed to save manual purchase:', e);
  }

  // Increment coupon usage count if coupon was applied
  if (data.couponCodeApplied) {
    const coupons = getCourseCoupons();
    const couponIdx = coupons.findIndex(c => c.code === data.couponCodeApplied?.trim().toUpperCase());
    if (couponIdx !== -1) {
      coupons[couponIdx].usedCount += 1;
      try {
        localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(coupons));
      } catch {}
    }
  }

  if (isSupabaseConfigured()) {
    Promise.resolve(
      supabase.from('course_purchases').insert({
        id: newRecord.id,
        student_id: newRecord.studentId,
        student_name: newRecord.studentName,
        student_email: newRecord.studentEmail,
        student_phone: newRecord.studentPhone || null,
        course_id: newRecord.courseId,
        course_name: newRecord.courseName,
        original_price: newRecord.originalPrice,
        discount_amount: newRecord.discountAmount,
        final_amount: newRecord.finalAmount,
        coupon_code_applied: newRecord.couponCodeApplied || null,
        payment_method: 'manual_upi_qr',
        utr_number: newRecord.utrNumber,
        status: 'pending_verification',
        purchased_at: newRecord.purchasedAt,
        access_granted: false
      })
    ).catch(() => {});
  }

  return { success: true, record: newRecord };
};

/**
 * Admin action: verify or reject a manual UPI purchase and unlock course access
 * Prevents duplicate enrollment and duplicate payment confirmation
 */
export const verifyManualQRPurchase = (
  purchaseId: string,
  approved: boolean,
  adminNotes?: string
): { success: boolean; message: string; record?: CoursePurchaseRecord } => {
  const purchases = getCoursePurchases();
  const idx = purchases.findIndex(p => p.id === purchaseId);
  if (idx === -1) {
    return { success: false, message: 'Purchase record not found.' };
  }

  const record = purchases[idx];

  if (approved) {
    // Prevent duplicate confirmation if already verified
    if (record.status === 'completed' && record.accessGranted) {
      return {
        success: false,
        message: 'This payment has already been verified and course access was already unlocked.',
        record
      };
    }

    // Prevent duplicate enrollment if student already owns access
    const alreadyOwns = hasCourseAccess(record.studentId, record.courseId);
    if (alreadyOwns && !record.accessGranted) {
      record.status = 'completed';
      record.accessGranted = true;
      record.adminNotes = (adminNotes ? adminNotes + ' | ' : '') + 'Student already had course access; verified payment record.';
      try {
        localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(purchases));
        window.dispatchEvent(new CustomEvent('dopilot_course_purchased', { detail: record }));
      } catch {}
      return {
        success: true,
        message: 'Student was already enrolled. Payment verified and record completed.',
        record
      };
    }

    record.status = 'completed';
    record.accessGranted = true;
    record.adminNotes = adminNotes || 'Verified by Admin via UPI reference match';

    // Grant student course access in local storage key
    try {
      const userPurchasesRaw = localStorage.getItem(`dopilot_purchased_courses_${record.studentId}`) || '[]';
      const currentList: string[] = JSON.parse(userPurchasesRaw);
      if (!currentList.includes(record.courseId)) {
        currentList.push(record.courseId);
      }
      localStorage.setItem(`dopilot_purchased_courses_${record.studentId}`, JSON.stringify(currentList));
      if (record.studentEmail && record.studentEmail !== record.studentId) {
        localStorage.setItem(`dopilot_purchased_courses_${record.studentEmail}`, JSON.stringify(currentList));
      }
    } catch {}

    // Update active user session if matching logged-in student
    try {
      const rawSession = localStorage.getItem('dopilot_student_session_v1');
      if (rawSession) {
        const session = JSON.parse(rawSession);
        if (session && (session.id === record.studentId || session.email?.toLowerCase() === record.studentEmail.toLowerCase())) {
          const enrolled = session.enrolledCourses || [];
          if (!enrolled.includes(record.courseName)) {
            session.enrolledCourses = [...enrolled, record.courseName];
            localStorage.setItem('dopilot_student_session_v1', JSON.stringify(session));
          }
        }
      }
    } catch {}

    window.dispatchEvent(new CustomEvent('dopilot_access_granted', {
      detail: { courseId: record.courseId, studentId: record.studentId }
    }));
  } else {
    // If rejecting
    if (record.status === 'completed' && record.accessGranted) {
      return {
        success: false,
        message: 'Cannot reject a payment that has already been verified and unlocked.',
        record
      };
    }
    record.status = 'rejected';
    record.accessGranted = false;
    record.adminNotes = adminNotes || 'Payment verification rejected by admin';
  }

  try {
    localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(purchases));
    window.dispatchEvent(new CustomEvent('dopilot_course_purchased', { detail: record }));
  } catch {}

  if (isSupabaseConfigured()) {
    Promise.resolve(
      supabase.from('course_purchases').update({
        status: record.status,
        access_granted: record.accessGranted,
        admin_notes: record.adminNotes,
        updated_at: new Date().toISOString()
      }).eq('id', purchaseId)
    ).catch(() => {});
  }

  return {
    success: true,
    message: approved
      ? `Payment verified and full access unlocked for ${record.studentName}!`
      : `Payment marked as rejected for ${record.studentName}.`,
    record
  };
};
