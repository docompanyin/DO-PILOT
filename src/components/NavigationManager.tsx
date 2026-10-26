import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { recordNavRoute, getIntendedFallbackRoute } from '../utils/navigationHelper';

/**
 * NavigationManager:
 * 1. Automatically records intended navigation route transitions in session storage.
 * 2. Synchronizes browser/phone hardware Back button and popstate events with the intended navigation flow.
 * 3. Prevents incorrect loops, jumps to unrelated older tasks/questions, and ensures:
 *    - Question Answering page -> Course Details page.
 *    - Course Details page -> Home Page.
 *    - Settings page -> Home Page (or where user entered from).
 *    - Auth & Legal pages -> Immediately preceding flow.
 */
export const NavigationManager: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Track each route entry and keep Document Title consistent
  useEffect(() => {
    recordNavRoute(location.pathname, location.search);

    const path = location.pathname;
    if (path === '/') {
      document.title = 'Do Pilot';
    } else if (path === '/login') {
      document.title = 'Do Pilot - Login';
    } else if (path === '/signup') {
      document.title = 'Do Pilot - Sign Up';
    } else if (path === '/settings' || path === '/profile') {
      document.title = 'Do Pilot - Student Profile';
    } else if (path === '/admin') {
      document.title = 'Do Pilot - Admin Login';
    } else if (path.startsWith('/admin/dashboard')) {
      document.title = 'Do Pilot - Admin Dashboard';
    } else if (path.startsWith('/admin/emergency-recovery')) {
      document.title = 'Do Pilot - Emergency Recovery';
    } else if (path === '/privacy') {
      document.title = 'Do Pilot - Privacy Policy';
    } else if (path === '/terms') {
      document.title = 'Do Pilot - Terms of Service';
    } else if (path === '/refund') {
      document.title = 'Do Pilot - Refund & Cancellation Policy';
    } else if (path.startsWith('/legal')) {
      document.title = 'Do Pilot - Legal';
    }
  }, [location.pathname, location.search]);

  // Intercept phone / browser hardware Back button for Course pages and Course Details
  useEffect(() => {
    const currentPath = location.pathname;
    const isCoursePartPage = currentPath.startsWith('/course/') && currentPath.includes('/part-');
    const isCourseDetailsPage = currentPath.startsWith('/course/') && !currentPath.includes('/part-');

    if (isCoursePartPage) {
      // Determine intended Course Details destination
      const courseOverviewPath = getIntendedFallbackRoute(currentPath);

      // Push history sentinel to trap hardware back button
      try {
        window.history.pushState({ doPilotTrap: true, page: 'coursePart' }, '', window.location.href);
      } catch {}

      const handlePopState = () => {
        // When user taps phone/browser back button from any course page (Question Answering, Passed, Failed, Consecutive Failure, Locked, etc.),
        // guarantee they land directly on the Course Details page, without visiting previous levels/questions or intermediate pages.
        navigate(courseOverviewPath, { replace: true });
      };

      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }

    if (isCourseDetailsPage) {
      // Push history sentinel to trap hardware back button
      try {
        window.history.pushState({ doPilotTrap: true, page: 'courseDetails' }, '', window.location.href);
      } catch {}

      const handlePopState = () => {
        // When user taps phone/browser back button from Course Details,
        // navigate directly to Home Page and restore the previous scroll position.
        navigate('/', { replace: true });
      };

      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [location.pathname, navigate]);

  return null;
};
