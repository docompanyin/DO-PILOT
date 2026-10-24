import React, { useLayoutEffect, useEffect, useRef } from 'react';
import { useLocation, useNavigationType, NavigationType } from 'react-router-dom';

const HOME_SCROLL_KEY = 'dopilot_home_scroll_pos';

/**
 * Manages window scroll positions across routes:
 * 1. Course Details page (/course/:id) always opens immediately at the top without unwanted animations.
 * 2. Home page (/) remembers scroll position when navigating to Course Details, and restores it when returning via Back (POP).
 * 3. Fresh page refresh on Home page opens at the top as expected.
 */
export const ScrollManager: React.FC = () => {
  const location = useLocation();
  const navType = useNavigationType();
  const prevPathRef = useRef(location.pathname);

  // Disable browser's automatic/arbitrary scroll restoration to prevent flicker and conflicts
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Continuously record scroll position while user is on Home page
  useEffect(() => {
    const handleScroll = () => {
      if (window.location.pathname === '/') {
        sessionStorage.setItem(HOME_SCROLL_KEY, String(window.scrollY));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useLayoutEffect(() => {
    const currentPath = location.pathname;
    const prevPath = prevPathRef.current;
    prevPathRef.current = currentPath;

    // Detect if this is an explicit page reload
    const isReload = (() => {
      try {
        const navEntries = performance.getEntriesByType('navigation');
        if (navEntries.length > 0) {
          return (navEntries[0] as PerformanceNavigationTiming).type === 'reload';
        }
        return (performance as any)?.navigation?.type === 1;
      } catch {
        return false;
      }
    })();

    if (isReload) {
      // Refresh should always start at the top
      sessionStorage.removeItem(HOME_SCROLL_KEY);
      window.scrollTo(0, 0);
      return;
    }

    // 1. Course Details Page (e.g. /course/python-core, /course/java-core, etc.)
    const isCourseDetailsPage = currentPath.startsWith('/course/') && !currentPath.includes('/part-');
    if (isCourseDetailsPage) {
      // Instantly position at the top before browser paint
      window.scrollTo(0, 0);
      return;
    }

    // 2. Returning to Home Page via Browser Back (POP)
    if (currentPath === '/') {
      if (navType === NavigationType.Pop) {
        const savedPos = sessionStorage.getItem(HOME_SCROLL_KEY);
        if (savedPos !== null) {
          const targetY = parseInt(savedPos, 10) || 0;
          // Apply instant scroll
          window.scrollTo(0, targetY);

          // If Lenis smooth-scroll is active on Home page, inform it immediately
          const lenis = (window as any).__lenisInstance;
          if (lenis && typeof lenis.scrollTo === 'function') {
            lenis.scrollTo(targetY, { immediate: true });
          }

          // Follow up on next animation frames in case components are mounting
          requestAnimationFrame(() => {
            window.scrollTo(0, targetY);
            const activeLenis = (window as any).__lenisInstance;
            if (activeLenis && typeof activeLenis.scrollTo === 'function') {
              activeLenis.scrollTo(targetY, { immediate: true });
            }
          });
          return;
        }
      } else if (navType === NavigationType.Push && prevPath !== '/') {
        // Navigating back to home via an explicit push: scroll to top if not targeting a section anchor
        if (!location.hash) {
          window.scrollTo(0, 0);
        }
      }
    }
  }, [location.pathname, location.hash, navType]);

  return null;
};
