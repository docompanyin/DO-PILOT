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

  // Track each route entry
  useEffect(() => {
    recordNavRoute(location.pathname, location.search);
  }, [location.pathname, location.search]);

  // Intercept phone / browser hardware Back button for Course pages and Course Details
  useEffect(() => {
    const currentPath = location.pathname;
    const isCoursePartPage = currentPath.startsWith('/course/') && currentPath.includes('/part-');
    const isCourseDetailsPage = currentPath.startsWith('/course/') && !currentPath.includes('/part-');

    if (isCoursePartPage) {
      // Determine intended Course Details destination
      const courseOverviewPath = getIntendedFallbackRoute(currentPath);

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
