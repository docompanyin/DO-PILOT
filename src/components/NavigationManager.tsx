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

  // Intercept phone / browser hardware Back button for Question Answering pages
  useEffect(() => {
    const currentPath = location.pathname;
    const isQuestionPage = currentPath.startsWith('/course/') && currentPath.includes('/part-');

    if (isQuestionPage) {
      // Determine intended course overview destination
      const courseOverviewPath = getIntendedFallbackRoute(currentPath);

      const handlePopState = () => {
        // When user taps phone back button from a Question Answering page,
        // guarantee they land cleanly on the Course Details page rather than
        // skipping backwards through answered levels, tasks, or older sessions.
        navigate(courseOverviewPath, { replace: true });
      };

      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [location.pathname, navigate]);

  return null;
};
