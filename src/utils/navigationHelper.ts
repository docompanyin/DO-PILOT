import { NavigateFunction } from 'react-router-dom';

const NAV_STACK_KEY = 'dopilot_nav_history_stack_v1';
const MAX_STACK_SIZE = 40;

/**
 * Returns the intended fallback parent route when no history exists
 */
export const getIntendedFallbackRoute = (pathname: string): string => {
  // 1. Question Answering page -> Course Details page
  if (pathname.startsWith('/course/') && pathname.includes('/part-')) {
    if (pathname.includes('python-core')) return '/course/python-core';
    if (pathname.includes('complete-java-programming') || pathname.includes('java-core')) return '/course/complete-java-programming';
    if (pathname.includes('fullstack-open')) return '/course/fullstack-open';
    if (pathname.includes('cyber-security')) return '/course/cyber-security';
    
    // Dynamic :courseId/part-:partNum
    const parts = pathname.split('/');
    if (parts.length >= 3 && parts[1] === 'course') {
      return `/course/${parts[2]}`;
    }
    return '/#courses';
  }

  // 2. Course Details page -> Home Page (#courses)
  if (pathname.startsWith('/course/')) {
    return '/#courses';
  }

  // 3. Settings / Profile -> Home Page
  if (pathname === '/settings' || pathname === '/profile') {
    return '/';
  }

  // 4. Auth pages (login / signup) -> Home Page
  if (pathname === '/login' || pathname === '/signup') {
    return '/';
  }

  // 5. Legal pages -> Home Page
  if (pathname.startsWith('/legal') || pathname === '/privacy' || pathname === '/terms' || pathname === '/refund') {
    return '/';
  }

  // 6. Admin pages -> Admin Dashboard or Login or Home
  if (pathname === '/admin/emergency-recovery') {
    return '/admin';
  }
  if (pathname === '/admin/dashboard') {
    return '/';
  }
  if (pathname === '/admin') {
    return '/';
  }

  return '/';
};

/**
 * Reads the recorded navigation history stack from sessionStorage
 */
export const getNavStack = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(NAV_STACK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Pushes or synchronizes the current route into the navigation stack
 */
export const recordNavRoute = (pathname: string, search: string = '') => {
  if (typeof window === 'undefined') return;
  const fullPath = search ? `${pathname}${search}` : pathname;
  try {
    const stack = getNavStack();
    const lastItem = stack[stack.length - 1];

    if (lastItem === fullPath) return; // avoid duplicate consecutive entries

    stack.push(fullPath);
    if (stack.length > MAX_STACK_SIZE) {
      stack.shift();
    }
    sessionStorage.setItem(NAV_STACK_KEY, JSON.stringify(stack));
  } catch {
    // ignore
  }
};

/**
 * Handles back navigation consistently across website buttons and browser actions
 */
export const navigateBackOrFallback = (navigate: NavigateFunction, currentPathname: string) => {
  const fallback = getIntendedFallbackRoute(currentPathname);

  // 1. Any course page (Question Answering, Passed, Failed, Consecutive Failure, Locked, etc.):
  // Must go DIRECTLY to Course Details page without visiting any intermediate course steps.
  if (currentPathname.startsWith('/course/') && currentPathname.includes('/part-')) {
    navigate(fallback, { replace: true });
    return;
  }

  // 2. Course Details page:
  // Must go DIRECTLY to Home Page, allowing Home Page scroll position to be restored.
  if (currentPathname.startsWith('/course/')) {
    navigate('/', { replace: true });
    return;
  }

  // 3. For all other pages, use history stack or intended parent fallback
  const stack = getNavStack();
  if (stack.length > 1) {
    stack.pop(); // remove current page
    const previousTarget = stack[stack.length - 1];
    sessionStorage.setItem(NAV_STACK_KEY, JSON.stringify(stack));

    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(previousTarget || fallback);
    }
  } else {
    navigate(fallback);
  }
};
