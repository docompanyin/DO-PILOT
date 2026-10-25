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

      // Immediately inform Lenis if it was active to cancel any pending momentum scrolls
      const lenis = (window as any).__lenisInstance;
      if (lenis && typeof lenis.scrollTo === 'function') {
        try {
          lenis.scrollTo(0, { immediate: true });
        } catch {
          // ignore
        }
      }

      // Reinforce top position across animation frame and early ticks to prevent browser carrying over scroll
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
      const t1 = setTimeout(() => window.scrollTo(0, 0), 40);
      const t2 = setTimeout(() => window.scrollTo(0, 0), 120);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }

    // 2. Returning to Home Page (from Course Details or other pages via Back or button)
    if (currentPath === '/') {
      const isComingFromCourse = prevPath && (prevPath.startsWith('/course/') || prevPath.startsWith('/login'));
      const isPop = navType === NavigationType.Pop;

      if (isPop || isComingFromCourse) {
        const savedPos = sessionStorage.getItem(HOME_SCROLL_KEY);
        if (savedPos !== null) {
          const targetY = parseInt(savedPos, 10) || 0;

          // Helper to synchronize scroll with window and Lenis
          const applyScroll = (y: number) => {
            window.scrollTo(0, y);
            const lenis = (window as any).__lenisInstance;
            if (lenis && typeof lenis.scrollTo === 'function') {
              lenis.scrollTo(y, { immediate: true });
            }
          };

          // Apply immediately before browser paint
          applyScroll(targetY);

          // Retry across initial render and layout stabilization cycles
          const timers: number[] = [];
          requestAnimationFrame(() => applyScroll(targetY));

          // Run checks at 30ms, 80ms, 180ms, and 350ms to ensure GSAP ScrollTrigger and images don't shift position
          [30, 80, 180, 350].forEach((delay) => {
            timers.push(
              window.setTimeout(() => {
                applyScroll(targetY);
              }, delay)
            );
          });

          return () => {
            timers.forEach((id) => clearTimeout(id));
          };
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
