import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useParams, useLocation } from 'react-router-dom';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WhyUsSection } from './components/WhyUsSection';
import { CoursesSection } from './components/CoursesSection';
import { ReviewsSection } from './components/ReviewsSection';
import { CodeLabSection } from './components/CodeLabSection';
import { LiveClassSection } from './components/LiveClassSection';
import { Footer } from './components/Footer';
import { ScrollRevealWrapper } from './components/ScrollRevealWrapper';
import { ContactModal } from './components/ContactModal';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { AdminPanel } from './components/admin/AdminPanel';
import { EmergencyRecoveryPage } from './components/admin/EmergencyRecoveryPage';
import { AuthPage } from './components/auth/AuthPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { SettingsPage } from './components/settings/SettingsPage';
import { CourseDetailPage } from './components/CourseDetailPage';
import { LegalPage } from './components/legal/LegalPage';
import { PythonPart1Page } from './components/PythonPart1Page';
import { JavaPart1Page } from './components/JavaPart1Page';
import { PythonPart2Page } from './components/PythonPart2Page';
import { JavaPart2Page } from './components/JavaPart2Page';
import { PythonPart3Page } from './components/PythonPart3Page';
import { JavaPart3Page } from './components/JavaPart3Page';
import { PythonPart4Page } from './components/PythonPart4Page';
import { JavaPart4Page } from './components/JavaPart4Page';
import { PythonPart5Page } from './components/PythonPart5Page';
import { JavaPart5Page } from './components/JavaPart5Page';
import { PythonPart6Page } from './components/PythonPart6Page';
import { JavaPart6Page } from './components/JavaPart6Page';
import { PythonPart7Page } from './components/PythonPart7Page';
import { JavaPart7Page } from './components/JavaPart7Page';
import { PythonPart8Page } from './components/PythonPart8Page';
import { JavaPart8Page } from './components/JavaPart8Page';
import { PythonPart9Page } from './components/PythonPart9Page';
import { JavaPart9Page } from './components/JavaPart9Page';
import { PythonPart10Page } from './components/PythonPart10Page';
import { JavaPart10Page } from './components/JavaPart10Page';
import { PythonPart11Page } from './components/PythonPart11Page';
import { JavaPart11Page } from './components/JavaPart11Page';
import { PythonPart12Page } from './components/PythonPart12Page';
import { JavaPart12Page } from './components/JavaPart12Page';
import { PythonPart13Page } from './components/PythonPart13Page';
import { JavaPart13Page } from './components/JavaPart13Page';
import { PythonPart14Page } from './components/PythonPart14Page';
import { JavaPart14Page } from './components/JavaPart14Page';
import { FullstackPart0Page } from './components/FullstackPart0Page';
import { FullstackPart1Page } from './components/FullstackPart1Page';
import { FullstackPart2Page } from './components/FullstackPart2Page';
import { FullstackPart3Page } from './components/FullstackPart3Page';
import { FullstackPart4Page } from './components/FullstackPart4Page';
import { FullstackPart5Page } from './components/FullstackPart5Page';
import { FullstackPart6Page } from './components/FullstackPart6Page';
import { FullstackPart7Page } from './components/FullstackPart7Page';
import { FullstackPart8Page } from './components/FullstackPart8Page';
import { FullstackPart9Page } from './components/FullstackPart9Page';
import { FullstackPart10Page } from './components/FullstackPart10Page';
import { FullstackPart11Page } from './components/FullstackPart11Page';
import { FullstackPart12Page } from './components/FullstackPart12Page';
import { FullstackPart13Page } from './components/FullstackPart13Page';
import { UserAuthProvider, useUserAuth } from './context/UserAuthContext';
import { CoursePointsProvider } from './context/CoursePointsContext';
import { PointTwinkleEffect } from './components/effects/PointTwinkleEffect';
import { PythonProvider } from 'react-py';
import { CyberSecurityPartPage } from './components/CyberSecurityPartPage';
import { CyberSecurityPart1Page } from './components/CyberSecurityPart1Page';
import { CoursePaidGuard } from './components/checkout/CoursePaidGuard';
import './App.css';

// Module-scoped state: resets to false ONLY on manual page refresh (F5 / reload) or cold browser load.
// Stays true throughout all internal page navigations and redirects (e.g. from login).
let hasBrowserSessionLoaded = false;

export const markAppLoaded = () => {
  hasBrowserSessionLoaded = true;
};

const MainHome: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('Python Programming & Automation');

  // Preloader ONLY triggers on a manual browser refresh / cold start.
  // It NEVER triggers during page redirections or internal route transitions.
  const [shouldShowPreloader] = useState<boolean>(() => !hasBrowserSessionLoaded);

  const handlePreloaderComplete = useCallback(() => {
    hasBrowserSessionLoaded = true;
  }, []);

  useEffect(() => {
    document.title = "DO PILOT — Master Real-World Tech Skills";
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      'content',
      'DO PILOT is an educational platform offering project-driven coding courses in Python, Full Stack development, and real-time live masterclasses with industry mentors.'
    );
  }, []);

  const handleOpenEnroll = (courseName?: string) => {
    if (courseName) {
      setSelectedCourse(courseName);
    }
    setModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-black text-paper selection:bg-primary selection:text-ink relative overflow-x-hidden">
      {/* Branded Preloader (Runs ONLY on manual browser refresh or cold start; never on page redirections) */}
      {shouldShowPreloader && <Preloader onComplete={handlePreloaderComplete} />}

      {/* Floating Navbar */}
      <Navbar onOpenEnroll={() => handleOpenEnroll('General Enrollment')} />

      {/* Main Home Sections */}
      <ScrollRevealWrapper>
        <Hero onOpenContact={handleOpenEnroll} />
        <WhyUsSection />
        <CoursesSection onEnroll={handleOpenEnroll} />
        <ReviewsSection />
        <CodeLabSection />
        <LiveClassSection onJoin={handleOpenEnroll} />
        <Footer />
      </ScrollRevealWrapper>

      {/* Application / Enrollment Modal */}
      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedCourse={selectedCourse}
      />
    </main>
  );
};

const Part0RouteWrapper: React.FC = () => {
  return <FullstackPart0Page />;
};

const Part1RouteWrapper: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  if (courseId && (courseId.includes('fullstack') || courseId === 'fullstack-open')) {
    return <FullstackPart1Page />;
  }
  if (courseId && (courseId.includes('java') || courseId === 'complete-java-programming' || courseId === 'java-core')) {
    return <JavaPart1Page />;
  }
  if (courseId && (courseId.includes('cyber') || courseId === 'cyber-security' || courseId === 'cyber-security-core')) {
    return <CyberSecurityPart1Page />;
  }
  return <PythonPart1Page />;
};

const Part2RouteWrapper: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  let content = <PythonPart2Page />;
  if (courseId && (courseId.includes('fullstack') || courseId === 'fullstack-open')) {
    content = <FullstackPart2Page />;
  } else if (courseId && (courseId.includes('java') || courseId === 'complete-java-programming' || courseId === 'java-core')) {
    content = <JavaPart2Page />;
  } else if (courseId && (courseId.includes('cyber') || courseId === 'cyber-security' || courseId === 'cyber-security-core')) {
    content = <CyberSecurityPartPage partNumber={2} />;
  }
  return <CoursePaidGuard partNum={2} courseId={courseId}>{content}</CoursePaidGuard>;
};

const Part3RouteWrapper: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  let content = <PythonPart3Page />;
  if (courseId && (courseId.includes('fullstack') || courseId === 'fullstack-open')) {
    content = <FullstackPart3Page />;
  } else if (courseId && (courseId.includes('java') || courseId === 'complete-java-programming' || courseId === 'java-core')) {
    content = <JavaPart3Page />;
  } else if (courseId && (courseId.includes('cyber') || courseId === 'cyber-security' || courseId === 'cyber-security-core')) {
    content = <CyberSecurityPartPage partNumber={3} />;
  }
  return <CoursePaidGuard partNum={3} courseId={courseId}>{content}</CoursePaidGuard>;
};

const Part4RouteWrapper: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  let content = <PythonPart4Page />;
  if (courseId && (courseId.includes('fullstack') || courseId === 'fullstack-open')) {
    content = <FullstackPart4Page />;
  } else if (courseId && (courseId.includes('java') || courseId === 'complete-java-programming' || courseId === 'java-core')) {
    content = <JavaPart4Page />;
  } else if (courseId && (courseId.includes('cyber') || courseId === 'cyber-security' || courseId === 'cyber-security-core')) {
    content = <CyberSecurityPartPage partNumber={4} />;
  }
  return <CoursePaidGuard partNum={4} courseId={courseId}>{content}</CoursePaidGuard>;
};

const Part5RouteWrapper: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  let content = <PythonPart5Page />;
  if (courseId && (courseId.includes('fullstack') || courseId === 'fullstack-open')) {
    content = <FullstackPart5Page />;
  } else if (courseId && (courseId.includes('java') || courseId === 'complete-java-programming' || courseId === 'java-core')) {
    content = <JavaPart5Page />;
  } else if (courseId && (courseId.includes('cyber') || courseId === 'cyber-security' || courseId === 'cyber-security-core')) {
    content = <CyberSecurityPartPage partNumber={5} />;
  }
  return <CoursePaidGuard partNum={5} courseId={courseId}>{content}</CoursePaidGuard>;
};

const Part6RouteWrapper: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  let content = <PythonPart6Page />;
  if (courseId && (courseId.includes('fullstack') || courseId === 'fullstack-open')) {
    content = <FullstackPart6Page />;
  } else if (courseId && (courseId.includes('java') || courseId === 'complete-java-programming' || courseId === 'java-core')) {
    content = <JavaPart6Page />;
  } else if (courseId && (courseId.includes('cyber') || courseId === 'cyber-security' || courseId === 'cyber-security-core')) {
    content = <CyberSecurityPartPage partNumber={6} />;
  }
  return <CoursePaidGuard partNum={6} courseId={courseId}>{content}</CoursePaidGuard>;
};

const Part7RouteWrapper: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  let content = <PythonPart7Page />;
  if (courseId && (courseId.includes('fullstack') || courseId === 'fullstack-open')) {
    content = <FullstackPart7Page />;
  } else if (courseId && (courseId.includes('java') || courseId === 'complete-java-programming' || courseId === 'java-core')) {
    content = <JavaPart7Page />;
  } else if (courseId && (courseId.includes('cyber') || courseId === 'cyber-security' || courseId === 'cyber-security-core')) {
    content = <CyberSecurityPartPage partNumber={7} />;
  }
  return <CoursePaidGuard partNum={7} courseId={courseId}>{content}</CoursePaidGuard>;
};

const Part8RouteWrapper: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  let content = <PythonPart8Page />;
  if (courseId && (courseId.includes('fullstack') || courseId === 'fullstack-open')) {
    content = <FullstackPart8Page />;
  } else if (courseId && (courseId.includes('java') || courseId === 'complete-java-programming' || courseId === 'java-core')) {
    content = <JavaPart8Page />;
  } else if (courseId && (courseId.includes('cyber') || courseId === 'cyber-security' || courseId === 'cyber-security-core')) {
    content = <CyberSecurityPartPage partNumber={8} />;
  }
  return <CoursePaidGuard partNum={8} courseId={courseId}>{content}</CoursePaidGuard>;
};

const Part9RouteWrapper: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  let content = <PythonPart9Page />;
  if (courseId && (courseId.includes('fullstack') || courseId === 'fullstack-open')) {
    content = <FullstackPart9Page />;
  } else if (courseId && (courseId.includes('java') || courseId === 'complete-java-programming' || courseId === 'java-core')) {
    content = <JavaPart9Page />;
  } else if (courseId && (courseId.includes('cyber') || courseId === 'cyber-security' || courseId === 'cyber-security-core')) {
    content = <CyberSecurityPartPage partNumber={9} />;
  }
  return <CoursePaidGuard partNum={9} courseId={courseId}>{content}</CoursePaidGuard>;
};

const Part10RouteWrapper: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  let content = <PythonPart10Page />;
  if (courseId && (courseId.includes('fullstack') || courseId === 'fullstack-open')) {
    content = <FullstackPart10Page />;
  } else if (courseId && (courseId.includes('java') || courseId === 'complete-java-programming' || courseId === 'java-core')) {
    content = <JavaPart10Page />;
  } else if (courseId && (courseId.includes('cyber') || courseId === 'cyber-security' || courseId === 'cyber-security-core')) {
    content = <CyberSecurityPartPage partNumber={10} />;
  }
  return <CoursePaidGuard partNum={10} courseId={courseId}>{content}</CoursePaidGuard>;
};

const Part11RouteWrapper: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  let content = <PythonPart11Page />;
  if (courseId && (courseId.includes('fullstack') || courseId === 'fullstack-open')) {
    content = <FullstackPart11Page />;
  } else if (courseId && (courseId.includes('java') || courseId === 'complete-java-programming' || courseId === 'java-core')) {
    content = <JavaPart11Page />;
  } else if (courseId && (courseId.includes('cyber') || courseId === 'cyber-security' || courseId === 'cyber-security-core')) {
    content = <CyberSecurityPartPage partNumber={11} />;
  }
  return <CoursePaidGuard partNum={11} courseId={courseId}>{content}</CoursePaidGuard>;
};

const Part12RouteWrapper: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  let content = <PythonPart12Page />;
  if (courseId && (courseId.includes('fullstack') || courseId === 'fullstack-open')) {
    content = <FullstackPart12Page />;
  } else if (courseId && (courseId.includes('java') || courseId === 'complete-java-programming' || courseId === 'java-core')) {
    content = <JavaPart12Page />;
  } else if (courseId && (courseId.includes('cyber') || courseId === 'cyber-security' || courseId === 'cyber-security-core')) {
    content = <CyberSecurityPartPage partNumber={12} />;
  }
  return <CoursePaidGuard partNum={12} courseId={courseId}>{content}</CoursePaidGuard>;
};

const Part13RouteWrapper: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  let content = <PythonPart13Page />;
  if (courseId && (courseId.includes('fullstack') || courseId === 'fullstack-open')) {
    content = <FullstackPart13Page />;
  } else if (courseId && (courseId.includes('java') || courseId === 'complete-java-programming' || courseId === 'java-core')) {
    content = <JavaPart13Page />;
  } else if (courseId && (courseId.includes('cyber') || courseId === 'cyber-security' || courseId === 'cyber-security-core')) {
    content = <CyberSecurityPartPage partNumber={13} />;
  }
  return <CoursePaidGuard partNum={13} courseId={courseId}>{content}</CoursePaidGuard>;
};

const Part14RouteWrapper: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  let content = <PythonPart14Page />;
  if (courseId && (courseId.includes('java') || courseId === 'complete-java-programming' || courseId === 'java-core')) {
    content = <JavaPart14Page />;
  } else if (courseId && (courseId.includes('cyber') || courseId === 'cyber-security' || courseId === 'cyber-security-core')) {
    content = <CyberSecurityPartPage partNumber={14} />;
  }
  return <CoursePaidGuard partNum={14} courseId={courseId}>{content}</CoursePaidGuard>;
};

export const App: React.FC = () => {
  return (
    <UserAuthProvider>
      <CoursePointsProvider>
        <PythonProvider>
          <PointTwinkleEffect />
          <Routes>
            <Route path="/" element={<MainHome />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/signup" element={<AuthPage mode="signup" />} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminPanel />} />
            <Route path="/admin/emergency-recovery" element={<EmergencyRecoveryPage />} />
            <Route path="/course/complete-java-programming/part-1" element={<JavaPart1Page />} />
            <Route path="/course/java-core/part-1" element={<JavaPart1Page />} />
            <Route path="/course/complete-java-programming/part-2" element={<CoursePaidGuard partNum={2} courseId="java-core"><JavaPart2Page /></CoursePaidGuard>} />
            <Route path="/course/java-core/part-2" element={<CoursePaidGuard partNum={2} courseId="java-core"><JavaPart2Page /></CoursePaidGuard>} />
            <Route path="/course/complete-java-programming/part-3" element={<CoursePaidGuard partNum={3} courseId="java-core"><JavaPart3Page /></CoursePaidGuard>} />
            <Route path="/course/java-core/part-3" element={<CoursePaidGuard partNum={3} courseId="java-core"><JavaPart3Page /></CoursePaidGuard>} />
            <Route path="/course/complete-java-programming/part-4" element={<CoursePaidGuard partNum={4} courseId="java-core"><JavaPart4Page /></CoursePaidGuard>} />
            <Route path="/course/java-core/part-4" element={<CoursePaidGuard partNum={4} courseId="java-core"><JavaPart4Page /></CoursePaidGuard>} />
            <Route path="/course/complete-java-programming/part-5" element={<CoursePaidGuard partNum={5} courseId="java-core"><JavaPart5Page /></CoursePaidGuard>} />
            <Route path="/course/java-core/part-5" element={<CoursePaidGuard partNum={5} courseId="java-core"><JavaPart5Page /></CoursePaidGuard>} />
            <Route path="/course/complete-java-programming/part-6" element={<CoursePaidGuard partNum={6} courseId="java-core"><JavaPart6Page /></CoursePaidGuard>} />
            <Route path="/course/java-core/part-6" element={<CoursePaidGuard partNum={6} courseId="java-core"><JavaPart6Page /></CoursePaidGuard>} />
            <Route path="/course/complete-java-programming/part-7" element={<CoursePaidGuard partNum={7} courseId="java-core"><JavaPart7Page /></CoursePaidGuard>} />
            <Route path="/course/java-core/part-7" element={<CoursePaidGuard partNum={7} courseId="java-core"><JavaPart7Page /></CoursePaidGuard>} />
            <Route path="/course/complete-java-programming/part-8" element={<CoursePaidGuard partNum={8} courseId="java-core"><JavaPart8Page /></CoursePaidGuard>} />
            <Route path="/course/java-core/part-8" element={<CoursePaidGuard partNum={8} courseId="java-core"><JavaPart8Page /></CoursePaidGuard>} />
            <Route path="/course/complete-java-programming/part-9" element={<CoursePaidGuard partNum={9} courseId="java-core"><JavaPart9Page /></CoursePaidGuard>} />
            <Route path="/course/java-core/part-9" element={<CoursePaidGuard partNum={9} courseId="java-core"><JavaPart9Page /></CoursePaidGuard>} />
            <Route path="/course/complete-java-programming/part-10" element={<CoursePaidGuard partNum={10} courseId="java-core"><JavaPart10Page /></CoursePaidGuard>} />
            <Route path="/course/java-core/part-10" element={<CoursePaidGuard partNum={10} courseId="java-core"><JavaPart10Page /></CoursePaidGuard>} />
            <Route path="/course/complete-java-programming/part-11" element={<CoursePaidGuard partNum={11} courseId="java-core"><JavaPart11Page /></CoursePaidGuard>} />
            <Route path="/course/java-core/part-11" element={<CoursePaidGuard partNum={11} courseId="java-core"><JavaPart11Page /></CoursePaidGuard>} />
            <Route path="/course/complete-java-programming/part-12" element={<CoursePaidGuard partNum={12} courseId="java-core"><JavaPart12Page /></CoursePaidGuard>} />
            <Route path="/course/java-core/part-12" element={<CoursePaidGuard partNum={12} courseId="java-core"><JavaPart12Page /></CoursePaidGuard>} />
            <Route path="/course/complete-java-programming/part-13" element={<CoursePaidGuard partNum={13} courseId="java-core"><JavaPart13Page /></CoursePaidGuard>} />
            <Route path="/course/java-core/part-13" element={<CoursePaidGuard partNum={13} courseId="java-core"><JavaPart13Page /></CoursePaidGuard>} />
            <Route path="/course/complete-java-programming/part-14" element={<CoursePaidGuard partNum={14} courseId="java-core"><JavaPart14Page /></CoursePaidGuard>} />
            <Route path="/course/java-core/part-14" element={<CoursePaidGuard partNum={14} courseId="java-core"><JavaPart14Page /></CoursePaidGuard>} />
            <Route path="/course/fullstack-open/part-0" element={<FullstackPart0Page />} />
            <Route path="/course/fullstack-open/part-1" element={<CoursePaidGuard partNum={1} courseId="fullstack-open"><FullstackPart1Page /></CoursePaidGuard>} />
            <Route path="/course/fullstack-open/part-2" element={<CoursePaidGuard partNum={2} courseId="fullstack-open"><FullstackPart2Page /></CoursePaidGuard>} />
            <Route path="/course/fullstack-open/part-3" element={<CoursePaidGuard partNum={3} courseId="fullstack-open"><FullstackPart3Page /></CoursePaidGuard>} />
            <Route path="/course/fullstack-open/part-4" element={<CoursePaidGuard partNum={4} courseId="fullstack-open"><FullstackPart4Page /></CoursePaidGuard>} />
            <Route path="/course/fullstack-open/part-5" element={<CoursePaidGuard partNum={5} courseId="fullstack-open"><FullstackPart5Page /></CoursePaidGuard>} />
            <Route path="/course/fullstack-open/part-6" element={<CoursePaidGuard partNum={6} courseId="fullstack-open"><FullstackPart6Page /></CoursePaidGuard>} />
            <Route path="/course/fullstack-open/part-7" element={<CoursePaidGuard partNum={7} courseId="fullstack-open"><FullstackPart7Page /></CoursePaidGuard>} />
            <Route path="/course/fullstack-open/part-8" element={<CoursePaidGuard partNum={8} courseId="fullstack-open"><FullstackPart8Page /></CoursePaidGuard>} />
            <Route path="/course/fullstack-open/part-9" element={<CoursePaidGuard partNum={9} courseId="fullstack-open"><FullstackPart9Page /></CoursePaidGuard>} />
            <Route path="/course/fullstack-open/part-10" element={<CoursePaidGuard partNum={10} courseId="fullstack-open"><FullstackPart10Page /></CoursePaidGuard>} />
            <Route path="/course/fullstack-open/part-11" element={<CoursePaidGuard partNum={11} courseId="fullstack-open"><FullstackPart11Page /></CoursePaidGuard>} />
            <Route path="/course/fullstack-open/part-12" element={<CoursePaidGuard partNum={12} courseId="fullstack-open"><FullstackPart12Page /></CoursePaidGuard>} />
            <Route path="/course/fullstack-open/part-13" element={<CoursePaidGuard partNum={13} courseId="fullstack-open"><FullstackPart13Page /></CoursePaidGuard>} />
            <Route path="/course/cyber-security/part-1" element={<CyberSecurityPart1Page />} />
            <Route path="/course/cyber-security-core/part-1" element={<CyberSecurityPart1Page />} />
            <Route path="/course/cyber-security/part-:partNum" element={<CoursePaidGuard partNum={2} courseId="cyber-security"><CyberSecurityPartPage /></CoursePaidGuard>} />
            <Route path="/course/cyber-security-core/part-:partNum" element={<CoursePaidGuard partNum={2} courseId="cyber-security"><CyberSecurityPartPage /></CoursePaidGuard>} />
            <Route path="/course/:courseId" element={<CourseDetailPage />} />
            <Route path="/course/:courseId/part-0" element={<Part0RouteWrapper />} />
            <Route path="/course/:courseId/part-1" element={<Part1RouteWrapper />} />
            <Route path="/course/:courseId/part-2" element={<Part2RouteWrapper />} />
            <Route path="/course/:courseId/part-3" element={<Part3RouteWrapper />} />
            <Route path="/course/:courseId/part-4" element={<Part4RouteWrapper />} />
            <Route path="/course/:courseId/part-5" element={<Part5RouteWrapper />} />
            <Route path="/course/:courseId/part-6" element={<Part6RouteWrapper />} />
            <Route path="/course/:courseId/part-7" element={<Part7RouteWrapper />} />
            <Route path="/course/:courseId/part-8" element={<Part8RouteWrapper />} />
            <Route path="/course/:courseId/part-9" element={<Part9RouteWrapper />} />
            <Route path="/course/:courseId/part-10" element={<Part10RouteWrapper />} />
            <Route path="/course/:courseId/part-11" element={<Part11RouteWrapper />} />
            <Route path="/course/:courseId/part-12" element={<Part12RouteWrapper />} />
            <Route path="/course/:courseId/part-13" element={<Part13RouteWrapper />} />
            <Route path="/course/:courseId/part-14" element={<Part14RouteWrapper />} />
            <Route path="/privacy" element={<LegalPage defaultSection="privacy" />} />
            <Route path="/terms" element={<LegalPage defaultSection="terms" />} />
            <Route path="/refund" element={<LegalPage defaultSection="refund" />} />
            <Route path="/legal" element={<LegalPage defaultSection="privacy" />} />
            <Route path="/legal/:section" element={<LegalPage />} />
            <Route path="*" element={<MainHome />} />
          </Routes>
        </PythonProvider>
      </CoursePointsProvider>
    </UserAuthProvider>
  );
};

export default App;
