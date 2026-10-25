import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, ArrowUpRight } from 'lucide-react';
import { useUserAuth } from '../context/UserAuthContext';
import { useSiteData } from '../context/DataContext';
import { getCoursePricing, hasCourseAccess } from '../utils/coursePricingService';

interface CourseItem {
  id: string;
  category: string;
  badge: string;
  badgeColor?: string;
  image: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  tags: string[];
}

interface CoursesSectionProps {
  onEnroll?: (courseName: string) => void;
}

// Interactive Spotlight Card with Cursor Follower (Option 2)
const SpotlightCard: React.FC<{ course: CourseItem; onEnrollCourse: (course: CourseItem) => void }> = React.memo(({ course, onEnrollCourse }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const borderGlowRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const { user } = useUserAuth();
  const [pricing, setPricing] = useState(() => getCoursePricing(course.id));
  const [isPurchased, setIsPurchased] = useState(() => hasCourseAccess(course.id, user?.id || user?.email));

  React.useEffect(() => {
    const handleUpdate = () => {
      setPricing(getCoursePricing(course.id));
      setIsPurchased(hasCourseAccess(course.id, user?.id || user?.email));
    };
    window.addEventListener('dopilot_pricing_updated', handleUpdate);
    window.addEventListener('dopilot_course_purchased', handleUpdate);
    window.addEventListener('dopilot_access_granted', handleUpdate);
    window.addEventListener('dopilot_student_roster_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('dopilot_pricing_updated', handleUpdate);
      window.removeEventListener('dopilot_course_purchased', handleUpdate);
      window.removeEventListener('dopilot_access_granted', handleUpdate);
      window.removeEventListener('dopilot_student_roster_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [course.id, user?.id, user?.email]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only update on devices with fine pointer
    if (window.matchMedia('(hover: none)').matches) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(400px circle at ${x}px ${y}px, rgba(0, 255, 157, 0.12), transparent 75%)`;
      }
      if (borderGlowRef.current) {
        borderGlowRef.current.style.background = `radial-gradient(220px circle at ${x}px ${y}px, rgba(0, 255, 157, 0.35), transparent 70%)`;
      }
    });
  };

  const handleMouseEnter = () => {
    if (glowRef.current) glowRef.current.style.opacity = '1';
    if (borderGlowRef.current) borderGlowRef.current.style.opacity = '1';
  };

  const handleMouseLeave = () => {
    if (glowRef.current) glowRef.current.style.opacity = '0';
    if (borderGlowRef.current) borderGlowRef.current.style.opacity = '0';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onEnrollCourse(course)}
      style={{ transform: 'translateZ(0)', willChange: 'transform' }}
      className="group relative rounded-2xl bg-panel border border-white/10 overflow-hidden hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-colors duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* Dynamic Cursor Spotlight Glow (Option 2) */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300 z-10 opacity-0"
        style={{
          background: `radial-gradient(400px circle at 50% 50%, rgba(0, 255, 157, 0.12), transparent 75%)`,
          transform: 'translateZ(0)',
        }}
      />

      {/* Border Spotlight Glow */}
      <div
        ref={borderGlowRef}
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300 z-20 opacity-0"
        style={{
          background: `radial-gradient(220px circle at 50% 50%, rgba(0, 255, 157, 0.35), transparent 70%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          padding: '1px',
          transform: 'translateZ(0)',
        }}
      />

      <div className="relative z-10">
        {/* Course Image Header with Aspect Ratio Lock */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/60 shrink-0" style={{ aspectRatio: '16/10', transform: 'translateZ(0)' }}>
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
            decoding="async"
            style={{ aspectRatio: '16/10', willChange: 'transform' }}
          />
          {/* Subtle Image Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/20 to-transparent" />

          {/* Badge & Duration on image */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className={`font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border backdrop-blur-md ${course.badgeColor}`}>
              {course.badge}
            </span>
            <span className="font-mono text-[11px] text-paper/90 bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
              <Clock className="w-3 h-3 text-primary" />
              {course.duration}
            </span>
          </div>
        </div>

        {/* Details Section Below Image */}
        <div className="p-4 sm:p-5">
          <h3 className="font-jakarta text-[15px] sm:text-base font-extrabold text-paper group-hover:text-primary transition-colors line-clamp-2 leading-snug">
            {course.title}
          </h3>

          <p className="mt-2 text-slate text-xs leading-relaxed line-clamp-2">
            {course.description}
          </p>

          {/* Small Tag Pills */}
          <div className="mt-2.5 sm:mt-3 flex flex-wrap gap-1 sm:gap-1.5">
            {course.tags.map((tag, tIdx) => (
              <span
                key={tIdx}
                className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 font-mono text-[10px] text-slate/90"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Card Footer */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 flex items-center justify-between border-t border-white/5 relative z-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-slate/70">
            {course.level}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onEnrollCourse(course);
          }}
          className="px-4 py-2 rounded-full bg-primary text-ink font-jakarta font-extrabold text-xs hover:bg-white hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-1 cursor-pointer min-h-[36px]"
        >
          <span>{isPurchased ? 'Start' : (pricing?.isFreeCourse ? 'Start Free' : 'Enroll')}</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
});

export const CoursesSection: React.FC<CoursesSectionProps> = ({ onEnroll }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useUserAuth();
  const { data } = useSiteData();
  const [activeFilter, setActiveFilter] = useState<'all' | 'python' | 'java' | 'web' | 'security'>('all');

  const coursesSectionData = data.coursesSection;
  const badgeText = coursesSectionData?.badgeText || 'SKILL PATHS';
  const title = coursesSectionData?.title || 'Our Courses';
  const description = coursesSectionData?.description || 'Practical courses designed to take you from fundamentals to job-ready projects.';

  const handleEnrollCourse = (courseItem: CourseItem) => {
    if (!isLoggedIn) {
      navigate(`/login?redirect=/course/${courseItem.id}`);
    } else {
      navigate(`/course/${courseItem.id}`);
    }
    if (onEnroll) {
      onEnroll(courseItem.title);
    }
  };

  const rawList: CourseItem[] = (coursesSectionData?.courses && coursesSectionData.courses.length > 0)
    ? coursesSectionData.courses
    : (coursesSectionData?.items && coursesSectionData.items.length > 0)
      ? coursesSectionData.items
      : [
          {
            id: 'python-core',
            category: 'python',
            badge: 'Bestseller',
            badgeColor: 'bg-primary/20 text-primary border-primary/30',
            image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80',
            title: 'Complete Python Course',
            description: 'Master Python from core logic and data structures to advanced OOP, recursion, and 2D games with Pygame.',
            duration: '14 Parts',
            level: 'Beginner to Advanced',
            tags: ['Python 3', 'OOP & Logic', 'Pygame']
          },
          {
            id: 'complete-java-programming',
            category: 'java',
            badge: 'Popular',
            badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
            image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
            title: 'Complete Java Course',
            description: 'Master Java 21 fundamentals, Scanner input, OOP class hierarchies, Collections, and Streams based on Helsinki MOOC.',
            duration: '14 Parts',
            level: 'Beginner to Advanced',
            tags: ['Java 21', 'OOP & Classes', 'Collections']
          },
          {
            id: 'fullstack-open',
            category: 'web',
            badge: 'Career Track',
            badgeColor: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
            title: 'Full Stack Open Course',
            description: 'Deep dive into modern web development by University of Helsinki. Master React, Node.js, Express, TypeScript, GraphQL, and Docker.',
            duration: '14 Parts',
            level: 'Intermediate',
            tags: ['React & TS', 'Node & Express', 'GraphQL & Docker']
          }
        ];

  // Guarantee that Python, Java, Full Stack Open, and Cyber Security are rendered in order, merging dynamic admin edits
  const pythonFromRaw = rawList.find((c: any) => c.id === 'python-core' || c.category === 'python' || c.title?.toLowerCase().includes('python'));
  const javaFromRaw = rawList.find((c: any) => c.id === 'complete-java-programming' || c.category === 'java' || c.title?.toLowerCase().includes('java'));
  const fullstackFromRaw = rawList.find((c: any) => c.id === 'fullstack-open' || c.id === 'full-stack-web' || c.title?.toLowerCase().includes('full stack'));
  const cyberSecurityFromRaw = rawList.find((c: any) => c.id === 'cyber-security' || c.category === 'security' || c.title?.toLowerCase().includes('cyber'));

  const pythonCourse: CourseItem = {
    id: pythonFromRaw?.id || 'python-core',
    category: pythonFromRaw?.category || 'python',
    badge: pythonFromRaw?.badge || 'Bestseller',
    badgeColor: pythonFromRaw?.badgeColor || 'bg-primary/20 text-primary border-primary/30',
    image: pythonFromRaw?.image || 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80',
    title: (pythonFromRaw?.title || 'Complete Python Course').replace(/Programming/gi, 'Course'),
    description: pythonFromRaw?.description || 'Master Python from core logic and data structures to advanced OOP, recursion, and 2D games with Pygame.',
    duration: pythonFromRaw?.duration || '14 Parts',
    level: pythonFromRaw?.level || 'Beginner to Advanced',
    tags: (Array.isArray(pythonFromRaw?.tags) && pythonFromRaw.tags.length > 0) ? pythonFromRaw.tags : ['Python 3', 'OOP & Logic', 'Pygame']
  };

  const javaCourse: CourseItem = {
    id: javaFromRaw?.id || 'complete-java-programming',
    category: javaFromRaw?.category || 'java',
    badge: javaFromRaw?.badge || 'Popular',
    badgeColor: javaFromRaw?.badgeColor || 'bg-amber-400/20 text-amber-300 border-amber-400/30',
    image: javaFromRaw?.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    title: (javaFromRaw?.title || 'Complete Java Course').replace(/Programming/gi, 'Course'),
    description: javaFromRaw?.description || 'Master Java 21 fundamentals, Scanner input, OOP class hierarchies, Collections, and Streams based on Helsinki MOOC.',
    duration: javaFromRaw?.duration || '14 Parts',
    level: javaFromRaw?.level || 'Beginner to Advanced',
    tags: (Array.isArray(javaFromRaw?.tags) && javaFromRaw.tags.length > 0) ? javaFromRaw.tags : ['Java 21', 'OOP & Classes', 'Collections']
  };

  const fullstackCourse: CourseItem = {
    id: fullstackFromRaw?.id || 'fullstack-open',
    category: fullstackFromRaw?.category || 'web',
    badge: fullstackFromRaw?.badge || 'Career Track',
    badgeColor: fullstackFromRaw?.badgeColor || 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30',
    image: fullstackFromRaw?.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    title: (fullstackFromRaw?.title || 'Full Stack Open Course').replace(/Programming/gi, 'Course'),
    description: fullstackFromRaw?.description || 'Deep dive into modern web development by University of Helsinki. Master React, Node.js, Express, TypeScript, GraphQL, and Docker.',
    duration: fullstackFromRaw?.duration || '14 Parts',
    level: fullstackFromRaw?.level || 'Intermediate',
    tags: (Array.isArray(fullstackFromRaw?.tags) && fullstackFromRaw.tags.length > 0) ? fullstackFromRaw.tags : ['React & TS', 'Node & Express', 'GraphQL & Docker']
  };

  const cyberSecurityCourse: CourseItem = {
    id: cyberSecurityFromRaw?.id || 'cyber-security',
    category: cyberSecurityFromRaw?.category || 'security',
    badge: cyberSecurityFromRaw?.badge || 'High Demand',
    badgeColor: cyberSecurityFromRaw?.badgeColor || 'bg-cyan-400/20 text-cyan-300 border-cyan-400/30',
    image: cyberSecurityFromRaw?.image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    title: (cyberSecurityFromRaw?.title || 'Cyber Security Course').replace(/Programming/gi, 'Course'),
    description: cyberSecurityFromRaw?.description || 'Master network defense, penetration testing, malware analysis, and CISSP enterprise governance based on STL Academy.',
    duration: cyberSecurityFromRaw?.duration || '14 Parts',
    level: cyberSecurityFromRaw?.level || 'Beginner to Advanced',
    tags: (Array.isArray(cyberSecurityFromRaw?.tags) && cyberSecurityFromRaw.tags.length > 0) ? cyberSecurityFromRaw.tags : ['Network Defense', 'Ethical Hacking', 'CISSP & Cryptography']
  };

  const otherCourses = rawList
    .filter((c: any) => 
      c.id !== pythonCourse.id && 
      c.id !== javaCourse.id && 
      c.id !== fullstackCourse.id && 
      c.id !== cyberSecurityCourse.id &&
      c.id !== 'python-core' && 
      c.id !== 'complete-java-programming' && 
      c.id !== 'fullstack-open' && 
      c.id !== 'full-stack-web' && 
      c.id !== 'cyber-security' && 
      c.id !== 'mobile-dev' &&
      c.id !== 'ai-data-science' &&
      c.category !== 'ai' &&
      !c.title?.toLowerCase().includes('python') && 
      !c.title?.toLowerCase().includes('java') &&
      !c.title?.toLowerCase().includes('cyber') &&
      !c.title?.toLowerCase().includes('ai')
    )
    .map((c: any) => ({
      ...c,
      title: (c.title || '').replace(/Programming/gi, 'Course')
    }));

  const courses: CourseItem[] = [pythonCourse, javaCourse, fullstackCourse, cyberSecurityCourse, ...otherCourses];

  const filterTabs = [
    { key: 'all', label: 'All Courses' },
    { key: 'python', label: 'Python' },
    { key: 'java', label: 'Java' },
    { key: 'web', label: 'Full Stack' },
    { key: 'security', label: 'Cyber Security' },
  ] as const;

  const filteredCourses = activeFilter === 'all'
    ? courses
    : courses.filter(c => c.category === activeFilter);

  return (
    <section id="courses" className="py-16 sm:py-24 lg:py-32 bg-black relative border-t border-white/10 select-none">
      {/* Background ambient glow */}
      <div
        className="absolute top-1/3 right-10 w-[280px] sm:w-[500px] h-[280px] sm:h-[500px] bg-primary/10 blur-[100px] sm:blur-[150px] rounded-full pointer-events-none"
        style={{ transform: 'translate3d(0,0,0)', willChange: 'transform' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-panel border border-white/15 mb-3.5 sm:mb-4 shadow-sm">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            <span className="font-mono text-[10px] sm:text-xs text-primary font-bold tracking-widest uppercase">
              {badgeText}
            </span>
          </div>

          <h2 className="font-jakarta text-2xl sm:text-4xl lg:text-5xl font-black text-paper tracking-tight">
            {title}
          </h2>

          <p className="mt-3 sm:mt-4 text-slate text-sm sm:text-base md:text-lg leading-relaxed font-normal">
            {description}
          </p>

          {/* Fluid Filter Tab Pills with sliding background */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 mt-6 sm:mt-8 p-1.5 rounded-2xl sm:rounded-full bg-panel border border-white/10 max-w-full">
            {filterTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`relative px-3.5 sm:px-5 py-2 rounded-full font-jakarta text-[11px] sm:text-xs font-bold transition-colors cursor-pointer min-h-[36px] sm:min-h-[38px] flex items-center justify-center ${
                  activeFilter === tab.key ? 'text-ink' : 'text-slate hover:text-paper'
                }`}
              >
                {activeFilter === tab.key && (
                  <motion.div
                    layoutId="activeFilterPill"
                    className="absolute inset-0 rounded-full bg-primary shadow-md shadow-primary/20"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid with Stable Dimensions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 500px' }}>
          <AnimatePresence>
            {filteredCourses.map((course) => (
              <SpotlightCard
                key={course.id}
                course={course}
                onEnrollCourse={handleEnrollCourse}
              />
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
