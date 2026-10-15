import React, { useState, useEffect } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
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
import { UserAuthProvider } from './context/UserAuthContext';
import { CoursePointsProvider } from './context/CoursePointsContext';
import { PointTwinkleEffect } from './components/effects/PointTwinkleEffect';
import { PythonProvider } from 'react-py';
import { CyberSecurityPartPage } from './components/CyberSecurityPartPage';
import { CyberSecurityPart1Page } from './components/CyberSecurityPart1Page';
import './App.css';

const MainHome: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('Python Programming & Automation');

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
      {/* Branded Preloader */}
      <Preloader onComplete={() => {}} />

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
  if (courseId && (courseId.includes('fullstack') || courseId === 'fullstack-open')) {
    return <FullstackPart2Page />;
  }
  if (courseId && (courseId.includes('java') || courseId === 'complete-java-programming' || courseId === 'java-core')) {
    return <JavaPart2Page />;
  }
  if (courseId && (courseId.includes('cyber') || courseId === 'cyber-security' || courseId === 'cyber-security-core')) {
    return <CyberSecurityPartPage partNumber={2} />;
  }
  return <PythonPart2Page />;
};

const Part3RouteWrapper: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  if (courseId && (courseId.includes('fullstack') || courseId === 'fullstack-open')) {
    return <FullstackPart3Page />;
  }
  if (courseId && (courseId.includes('java') || courseId === 'complete-java-programming' || courseId === 'java-core')) {
    return <JavaPart3Page />;
  }
  if (courseId && (courseId.includes('cyber') || courseId === 'cyber-security' || courseId === 'cyber-security-core')) {
    return <CyberSecurityPartPage partNumber={3} />;
  }
  return <PythonPart3Page />;
};

const Part4RouteWrapper: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  if (courseId && (courseId.includes('fullstack') || courseId === 'fullstack-open')) {
    return <FullstackPart4Page />;
  }
  if (courseId && (courseId.includes('java') || courseId === 'complete-java-programming' || courseId === 'java-core')) {
    return <JavaPart4Page />;
  }
  if (courseId && (courseId.includes('cyber') || courseId === 'cyber-security' || courseId === 'cyber-security-core')) {
    return <CyberSecurityPartPage partNumber={4} />;
  }
  return <PythonPart4Page />;
};

const Part5RouteWrapper: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  if (courseId && (courseId.includes('fullstack') || courseId === 'fullstack-open')) {
    return <FullstackPart5Page />;
  }
  if (courseId && (courseId.includes('java') || courseId === 'complete-java-programming' || courseId === 'java-core')) {
    return <JavaPart5Page />;
  }
  if (courseId && (courseId.includes('cyber') || courseId === 'cyber-security' || courseId === 'cyber-security-core')) {
    return <CyberSecurityPartPage partNumber={5} />;
  }
  return <PythonPart5Page />;
};

const Part6RouteWrapper: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  if (courseId && (courseId.includes('fullstack') || courseId === 'fullstack-open')) {
    return <FullstackPart6Page />;
  }
  if (courseId && (courseId.includes('java') || courseId === 'complete-java-programming' || courseId === 'java-core')) {
    return <JavaPart6Page />;
  }
  if (courseId && (courseId.includes('cyber') || courseId === 'cyber-security' || courseId === 'cyber-security-core')) {
    return <CyberSecurityPartPage partNumber={6} />;
  }
  return <PythonPart6Page />;
};

const Part7RouteWrapper: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  if (courseId && (courseId.includes('fullstack') || courseId === 'fullstack-open')) {
    return <FullstackPart7Page />;
  }
  if (courseId && (courseId.includes('java') || courseId === 'complete-java-programming' || courseId === 'java-core')) {
    return <JavaPart7Page />;
  }
  if (courseId && (courseId.includes('cyber') || courseId === 'cyber-security' || courseId === 'cyber-security-core')) {
    return <CyberSecurityPartPage partNumber={7} />;
  }
  return <PythonPart7Page />;
};

const Part8RouteWrapper: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  if (courseId && (courseId.includes('fullstack') || courseId === 'fullstack-open')) {
    return <FullstackPart8Page />;
  }
  if (courseId && (courseId.includes('java') || courseId === 'complete-java-programming' || courseId === 'java-core')) {
    return <JavaPart8Page />;
  }
  if (courseId && (courseId.includes('cyber') || courseId === 'cyber-security' || courseId === 'cyber-security-core')) {
    return <CyberSecurityPartPage partNumber={8} />;
  }
  return <PythonPart8Page />;
};

const Part9RouteWrapper: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  if (courseId && (courseId.includes('fullstack') || courseId === 'fullstack-open')) {
    return <FullstackPart9Page />;
  }
  if (courseId && (courseId.includes('java') || courseId === 'complete-java-programming' || courseId === 'java-core')) {
    return <JavaPart9Page />;
  }
  if (courseId && (courseId.includes('cyber') || courseId === 'cyber-security' || courseId === 'cyber-security-core')) {
    return <CyberSecurityPartPage partNumber={9} />;
  }
  return <PythonPart9Page />;
};

const Part10RouteWrapper: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  if (courseId && (courseId.includes('fullstack') || courseId === 'fullstack-open')) {
    return <FullstackPart10Page />;
  }
  if (courseId && (courseId.includes('java') || courseId === 'complete-java-programming' || courseId === 'java-core')) {
    return <JavaPart10Page />;
  }
  if (courseId && (courseId.includes('cyber') || courseId === 'cyber-security' || courseId === 'cyber-security-core')) {
    return <CyberSecurityPartPage partNumber={10} />;
  }
  return <PythonPart10Page />;
};

const Part11RouteWrapper: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  if (courseId && (courseId.includes('fullstack') || courseId === 'fullstack-open')) {
    return <FullstackPart11Page />;
  }
  if (courseId && (courseId.includes('java') || courseId === 'complete-java-programming' || courseId === 'java-core')) {
    return <JavaPart11Page />;
  }
  if (courseId && (courseId.includes('cyber') || courseId === 'cyber-security' || courseId === 'cyber-security-core')) {
    return <CyberSecurityPartPage partNumber={11} />;
  }
  return <PythonPart11Page />;
};

const Part12RouteWrapper: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  if (courseId && (courseId.includes('fullstack') || courseId === 'fullstack-open')) {
    return <FullstackPart12Page />;
  }
  if (courseId && (courseId.includes('java') || courseId === 'complete-java-programming' || courseId === 'java-core')) {
    return <JavaPart12Page />;
  }
  if (courseId && (courseId.includes('cyber') || courseId === 'cyber-security' || courseId === 'cyber-security-core')) {
    return <CyberSecurityPartPage partNumber={12} />;
  }
  return <PythonPart12Page />;
};

const Part13RouteWrapper: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  if (courseId && (courseId.includes('fullstack') || courseId === 'fullstack-open')) {
    return <FullstackPart13Page />;
  }
  if (courseId && (courseId.includes('java') || courseId === 'complete-java-programming' || courseId === 'java-core')) {
    return <JavaPart13Page />;
  }
  if (courseId && (courseId.includes('cyber') || courseId === 'cyber-security' || courseId === 'cyber-security-core')) {
    return <CyberSecurityPartPage partNumber={13} />;
  }
  return <PythonPart13Page />;
};

const Part14RouteWrapper: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  if (courseId && (courseId.includes('java') || courseId === 'complete-java-programming' || courseId === 'java-core')) {
    return <JavaPart14Page />;
  }
  if (courseId && (courseId.includes('cyber') || courseId === 'cyber-security' || courseId === 'cyber-security-core')) {
    return <CyberSecurityPartPage partNumber={14} />;
  }
  return <PythonPart14Page />;
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
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<SettingsPage />} />
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminPanel />} />
            <Route path="/admin/emergency-recovery" element={<EmergencyRecoveryPage />} />
            <Route path="/course/complete-java-programming/part-1" element={<JavaPart1Page />} />
            <Route path="/course/java-core/part-1" element={<JavaPart1Page />} />
            <Route path="/course/complete-java-programming/part-2" element={<JavaPart2Page />} />
            <Route path="/course/java-core/part-2" element={<JavaPart2Page />} />
            <Route path="/course/complete-java-programming/part-3" element={<JavaPart3Page />} />
            <Route path="/course/java-core/part-3" element={<JavaPart3Page />} />
            <Route path="/course/complete-java-programming/part-4" element={<JavaPart4Page />} />
            <Route path="/course/java-core/part-4" element={<JavaPart4Page />} />
            <Route path="/course/complete-java-programming/part-5" element={<JavaPart5Page />} />
            <Route path="/course/java-core/part-5" element={<JavaPart5Page />} />
            <Route path="/course/complete-java-programming/part-6" element={<JavaPart6Page />} />
            <Route path="/course/java-core/part-6" element={<JavaPart6Page />} />
            <Route path="/course/complete-java-programming/part-7" element={<JavaPart7Page />} />
            <Route path="/course/java-core/part-7" element={<JavaPart7Page />} />
            <Route path="/course/complete-java-programming/part-8" element={<JavaPart8Page />} />
            <Route path="/course/java-core/part-8" element={<JavaPart8Page />} />
            <Route path="/course/complete-java-programming/part-9" element={<JavaPart9Page />} />
            <Route path="/course/java-core/part-9" element={<JavaPart9Page />} />
            <Route path="/course/complete-java-programming/part-10" element={<JavaPart10Page />} />
            <Route path="/course/java-core/part-10" element={<JavaPart10Page />} />
            <Route path="/course/complete-java-programming/part-11" element={<JavaPart11Page />} />
            <Route path="/course/java-core/part-11" element={<JavaPart11Page />} />
            <Route path="/course/complete-java-programming/part-12" element={<JavaPart12Page />} />
            <Route path="/course/java-core/part-12" element={<JavaPart12Page />} />
            <Route path="/course/complete-java-programming/part-13" element={<JavaPart13Page />} />
            <Route path="/course/java-core/part-13" element={<JavaPart13Page />} />
            <Route path="/course/complete-java-programming/part-14" element={<JavaPart14Page />} />
            <Route path="/course/java-core/part-14" element={<JavaPart14Page />} />
            <Route path="/course/fullstack-open/part-0" element={<FullstackPart0Page />} />
            <Route path="/course/fullstack-open/part-1" element={<FullstackPart1Page />} />
            <Route path="/course/fullstack-open/part-2" element={<FullstackPart2Page />} />
            <Route path="/course/fullstack-open/part-3" element={<FullstackPart3Page />} />
            <Route path="/course/fullstack-open/part-4" element={<FullstackPart4Page />} />
            <Route path="/course/fullstack-open/part-5" element={<FullstackPart5Page />} />
            <Route path="/course/fullstack-open/part-6" element={<FullstackPart6Page />} />
            <Route path="/course/fullstack-open/part-7" element={<FullstackPart7Page />} />
            <Route path="/course/fullstack-open/part-8" element={<FullstackPart8Page />} />
            <Route path="/course/fullstack-open/part-9" element={<FullstackPart9Page />} />
            <Route path="/course/fullstack-open/part-10" element={<FullstackPart10Page />} />
            <Route path="/course/fullstack-open/part-11" element={<FullstackPart11Page />} />
            <Route path="/course/fullstack-open/part-12" element={<FullstackPart12Page />} />
            <Route path="/course/fullstack-open/part-13" element={<FullstackPart13Page />} />
            <Route path="/course/cyber-security/part-1" element={<CyberSecurityPart1Page />} />
            <Route path="/course/cyber-security-core/part-1" element={<CyberSecurityPart1Page />} />
            <Route path="/course/cyber-security/part-:partNum" element={<CyberSecurityPartPage />} />
            <Route path="/course/cyber-security-core/part-:partNum" element={<CyberSecurityPartPage />} />
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
