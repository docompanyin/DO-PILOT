import React, { createContext, useContext, useState, useEffect } from 'react';
import initialSiteData from '../data/siteData.json';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface HeroData {
  eyebrow: string;
  headlineWord1: string;
  headlineWord2: string;
  headlineWord3: string;
  headlineWord4: string;
  glowingTarget?: 'NEXT' | 'BUILD' | 'WHATS' | 'ALL' | 'NONE';
  glowingWords?: {
    word1?: boolean;
    word2?: boolean;
    word3?: boolean;
    word4?: boolean;
    build?: boolean;
    whats?: boolean;
    next?: boolean;
  };
  videoUrl?: string;
  videoOpacity?: number;
  description: string;
  pillars: string[];
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  note?: string;
  metrics: { label: string; value: string }[];
  headlinePrefix?: string;
  highlightWord?: string;
  scrollCueText?: string;
  title?: string;
}

export interface AboutExperience {
  id: string;
  position: string;
  company: string;
  period: string;
  location: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
}

export interface AboutStat {
  id: string;
  tag: string;
  value: string;
  targetNum: number;
  suffix: string;
  description: string;
}

export interface AboutData {
  eyebrow: string;
  title: string;
  description: string;
  stats: AboutStat[];
  experiences: AboutExperience[];
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  details: string;
  tools: string[];
}

export interface ServicesData {
  eyebrow: string;
  title: string;
  videoUrl?: string;
  videoOpacity?: number;
  items: ServiceItem[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  technologies: string;
  image: string;
  description: string;
  year?: string;
  link?: string;
}

export interface ProjectsData {
  eyebrow: string;
  title: string;
  items: ProjectItem[];
}

export interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface ProcessData {
  eyebrow: string;
  title: string;
  steps: ProcessStep[];
}

export interface FounderData {
  eyebrow?: string;
  headline?: string;
  name?: string;
  role?: string;
  tagline?: string;
  quote?: string;
  bio?: string;
  image?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  contributionNote?: string;
  socialLinks?: SocialLinksData;
}

export interface MentorItem {
  id: string;
  name: string;
  role: string;
  specialty: string;
  image: string;
  tag: string;
  socialLinks?: SocialLinksData;
}

export interface MentorsData {
  eyebrow: string;
  title: string;
  items: MentorItem[];
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  image: string;
}

export interface TestimonialsData {
  eyebrow: string;
  title: string;
  items: TestimonialItem[];
}

export interface CtaBannerData {
  eyebrow: string;
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  buttonText: string;
}

export interface FooterNavLink {
  id: string;
  label: string;
  href: string;
}

export interface FooterCapability {
  id: string;
  label: string;
}

export interface SocialLinkItem {
  url: string;
  enabled: boolean;
}

export interface SocialLinksData {
  github?: SocialLinkItem;
  twitter?: SocialLinkItem;
  linkedin?: SocialLinkItem;
  instagram?: SocialLinkItem;
  facebook?: SocialLinkItem;
  whatsapp?: SocialLinkItem;
}

export interface FooterLinkItem {
  id?: string;
  name?: string;
  label?: string;
  href?: string;
  path?: string;
}

export interface FooterData {
  companyName?: string;
  companyLogo?: string;
  description?: string;
  addressLine1?: string;
  addressLine2?: string;
  email?: string;
  phone?: string;
  address?: string;
  copyrightText?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  whatsapp?: string;
  socialLinks?: SocialLinksData;
  navLinks?: FooterNavLink[];
  capabilities?: FooterCapability[];
  exploreTitle?: string;
  coursesTitle?: string;
  legalTitle?: string;
  contactTitle?: string;
  exploreLinks?: FooterLinkItem[];
  popularCoursesLinks?: FooterLinkItem[];
  legalLinks?: FooterLinkItem[];
}

export interface SectionItem {
  id: string;
  name: string;
  enabled: boolean;
}

export interface SectionsManagerData {
  order: SectionItem[];
}

export interface WhyUsFeatureItem {
  id?: string;
  iconName?: string;
  title: string;
  description: string;
  highlight: string;
  color?: string;
}

export interface WhyUsComparisonItem {
  id?: string;
  feature: string;
  traditional: string;
  doPilot: string;
}

export interface WhyUsData {
  badgeText: string;
  title: string;
  description: string;
  features: WhyUsFeatureItem[];
  comparisonsTitle?: string;
  comparisonsSubtitle?: string;
  tableHeaderFeature?: string;
  tableHeaderTraditional?: string;
  tableHeaderDoPilot?: string;
  comparisons: WhyUsComparisonItem[];
}

export interface CourseCardItem {
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

export interface CoursesSectionData {
  badgeText: string;
  title: string;
  description: string;
  syllabusNote?: string;
  syllabusButtonText?: string;
  courses?: CourseCardItem[];
  items?: CourseCardItem[];
}

export interface ReviewItem {
  id: string | number;
  name: string;
  role: string;
  avatar: string;
  course: string;
  rating: number;
  comment: string;
}

export interface ReviewsSectionData {
  badgeText: string;
  title: string;
  description: string;
  ratingValue?: number | string;
  ratingSubtext?: string;
  studentsMentored?: string;
  reviews?: ReviewItem[];
  items?: ReviewItem[];
}

export interface CodeLabData {
  badgeText: string;
  title: string;
  description: string;
  defaultCode: string;
  statusText?: string;
}

export interface LiveClassData {
  badgeText: string;
  title: string;
  description: string;
  spotlightBadge: string;
  className: string;
  classDescription: string;
  benefits: string[];
  seatsLeft: string;
  seatsTotal?: string;
  dateText?: string;
  timeText?: string;
  durationText?: string;
  platformText?: string;
  pricingText?: string;
  buttonText: string;
  countdownDays?: number;
  countdownHours?: number;
  date?: string;
  time?: string;
  duration?: string;
  platform?: string;
  pricing?: string;
  mentorName?: string;
  mentorRole?: string;
  mentorAvatar?: string;
  targetDateTime?: string;
}

export interface MessageItem {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  date: string;
  read: boolean;
}

export interface ToolkitData {
  eyebrow: string;
  title: string;
}

export interface CloudinaryConfigData {
  cloudName: string;
  uploadPreset: string;
}

export interface NavbarNavLink {
  id: string;
  name: string;
  href: string;
  isLive?: boolean;
}

export interface NavbarData {
  companyName?: string;
  companyLogo?: string;
  ctaText?: string;
  ctaLink?: string;
  navLinks?: NavbarNavLink[];
}

export interface SiteData {
  version?: number | string;
  sectionsManager?: SectionsManagerData;
  navbar?: NavbarData;
  hero: HeroData;
  whyUs?: WhyUsData;
  coursesSection?: CoursesSectionData;
  reviewsSection?: ReviewsSectionData;
  codeLab?: CodeLabData;
  liveClass?: LiveClassData;
  about: AboutData;
  services: ServicesData;
  projects: ProjectsData;
  process: ProcessData;
  founder: FounderData;
  mentors: MentorsData;
  testimonials: TestimonialsData;
  toolkit: ToolkitData;
  cta: CtaBannerData;
  footer: FooterData;
  messages: MessageItem[];
  cloudinary?: CloudinaryConfigData;
}

export const DEFAULT_SECTIONS_MANAGER: SectionsManagerData = {
  order: [
    { id: 'hero', name: 'Hero Section', enabled: true },
    { id: 'whyUs', name: 'Why Choose Us', enabled: true },
    { id: 'courses', name: 'Popular Courses', enabled: true },
    { id: 'reviews', name: 'Student Reviews', enabled: true },
    { id: 'codeLab', name: 'Code Lab Playground', enabled: true },
    { id: 'liveClass', name: 'Live Masterclass', enabled: true }
  ]
};

export const DEFAULT_WHY_US: WhyUsData = {
  badgeText: 'WHY CHOOSE US',
  title: 'Why DO PILOT?',
  description: 'Most online tutorials leave you stranded when you face real code errors. Here is how DO PILOT transforms your learning into real capability.',
  features: [
    {
      id: 'feat-1',
      iconName: 'Code2',
      title: 'Real Projects, Not Just Theory',
      description: 'You will not just watch videos. You write real code, build production-ready applications, and push commits to GitHub from day one.',
      highlight: '10+ Portfolio Projects'
    },
    {
      id: 'feat-2',
      iconName: 'Users',
      title: 'Mentor Support When You Are Stuck',
      description: 'Never get stuck on bugs for hours. Our experienced software engineers review your code and help you debug in real time.',
      highlight: 'Personal Code Reviews'
    },
    {
      id: 'feat-3',
      iconName: 'Laptop',
      title: 'Interactive Live Classes',
      description: 'Ask questions live and solve problems together with mentors. We keep our live batches focused and hands-on.',
      highlight: 'Live Coding & Instant Q&A'
    },
    {
      id: 'feat-4',
      iconName: 'Briefcase',
      title: 'Career & Industry Ready',
      description: 'Master real developer tools (Git, APIs, Databases, Clean Architecture) so you can crack interviews and freelance with confidence.',
      highlight: 'Interview Prep & Portfolio'
    }
  ],
  comparisonsTitle: 'How DO PILOT Compares',
  comparisonsSubtitle: 'See the direct difference between regular courses and our engineering mentorship.',
  comparisons: [
    {
      id: 'comp-1',
      feature: 'Learning Method',
      traditional: 'Passive recorded videos from years ago',
      doPilot: 'Active coding & live interactive sessions'
    },
    {
      id: 'comp-2',
      feature: 'Project Quality',
      traditional: 'Basic copy-paste toy examples (Todo list)',
      doPilot: 'Production-ready apps and real-world tools'
    },
    {
      id: 'comp-3',
      feature: 'When You Get Stuck',
      traditional: 'Unanswered forum posts or robot replies',
      doPilot: 'Direct mentor help & 1-on-1 code reviews'
    },
    {
      id: 'comp-4',
      feature: 'Outcome',
      traditional: 'Certificate with no proof of skill',
      doPilot: 'A verifiable GitHub portfolio that gets jobs'
    }
  ]
};

const DEFAULT_COURSES_ITEMS: CourseCardItem[] = [
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
  },
  {
    id: 'cyber-security',
    category: 'security',
    badge: 'High Demand',
    badgeColor: 'bg-cyan-400/20 text-cyan-300 border-cyan-400/30',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    title: 'Cyber Security Course',
    description: 'Master network defense, penetration testing, malware analysis, and CISSP enterprise governance based on STL Academy.',
    duration: '14 Parts',
    level: 'Beginner to Advanced',
    tags: ['Network Defense', 'Ethical Hacking', 'CISSP & Cryptography']
  }
];

export const sanitizeCourses = (courses?: CourseCardItem[]): CourseCardItem[] => {
  if (!courses || !Array.isArray(courses)) return DEFAULT_COURSES_ITEMS;
  const filtered = courses.filter(c => c && c.id !== 'python-ai' && c.id !== 'mobile-dev');
  if (!filtered.some(c => c.id === 'cyber-security')) {
    const cyber = DEFAULT_COURSES_ITEMS.find(c => c.id === 'cyber-security');
    if (cyber) filtered.push(cyber);
  }
  return filtered.length > 0 ? filtered : DEFAULT_COURSES_ITEMS;
};

export const sanitizeCoursesSection = (cs?: CoursesSectionData): CoursesSectionData => {
  if (!cs) return DEFAULT_COURSES_SECTION;
  const rawList = (cs.courses && cs.courses.length > 0) ? cs.courses : (cs.items || []);
  const cleaned = sanitizeCourses(rawList);
  return {
    ...cs,
    badgeText: cs.badgeText || 'SKILL PATHS',
    title: cs.title || 'Our Courses',
    description: cs.description || 'Choose a specialized curriculum built around tangible project outcomes. Taught by senior developers with live code reviews.',
    items: cleaned,
    courses: cleaned,
  };
};

export const DEFAULT_COURSES_SECTION: CoursesSectionData = {
  badgeText: 'SKILL PATHS',
  title: 'Our Courses',
  description: 'Choose a specialized curriculum built around tangible project outcomes. Taught by senior developers with live code reviews.',
  items: DEFAULT_COURSES_ITEMS,
  courses: DEFAULT_COURSES_ITEMS
};

const DEFAULT_REVIEW_ITEMS: ReviewItem[] = [
  {
    id: 1,
    name: 'Rahul Verma',
    role: 'Python Developer at TechSprint',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
    course: 'Complete Python Course',
    rating: 5,
    comment: 'DO PILOT completely changed how I learn programming. In week two, we built actual automation bots instead of reading textbook theory. The 1-on-1 mentor code reviews gave me the exact skills I needed to land my job.'
  },
  {
    id: 2,
    name: 'Ananya Sharma',
    role: 'Java Backend Engineer at AppScale',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces',
    course: 'Complete Java Course',
    rating: 5,
    comment: 'What sets DO PILOT apart is that the instructors are active software engineers. Whenever I ran into OOP design challenges, Collections complexities, or JVM bugs, they helped me debug and explained the underlying system architecture.'
  },
  {
    id: 3,
    name: 'Karthik Nair',
    role: 'Data Analyst at FinMetrics',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
    course: 'Python for AI & Data Science',
    rating: 5,
    comment: 'The data science track is gold. We cleaned raw real-world datasets and integrated OpenAI endpoints into actual tools. My GitHub portfolio from this course was the highlight of my technical interview.'
  },
  {
    id: 4,
    name: 'Sneha Patel',
    role: 'Frontend Developer & Freelancer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=faces',
    course: 'Live Python & Web Workshop',
    rating: 5,
    comment: 'I joined one of their weekend live classes and was amazed by the hands-on quality. No boring presentations—just live building and instant Q&A. I learned more in 2 hours than a month of self-study.'
  },
  {
    id: 5,
    name: 'Devendra Singh',
    role: 'Software Engineer at CloudCore',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces',
    course: 'Complete Java Course',
    rating: 5,
    comment: 'The focus on university-grade fundamentals, Helsinki MOOC principles, and clean code made all the difference. Mastering Java 21, Streams, and object-oriented design helped me clear 3 technical interviews in my first month after graduating.'
  },
  {
    id: 6,
    name: 'Meera Krishnan',
    role: 'AI Automation Specialist at NextWave',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
    course: 'Python for AI & Data Science',
    rating: 5,
    comment: 'Outstanding curriculum. Writing actual scraping scripts and chaining AI models opened so many doors. The mentors are available whenever you need help debugging complex workflows.'
  }
];

export const DEFAULT_REVIEWS_SECTION: ReviewsSectionData = {
  badgeText: 'REVIEWS',
  title: 'Real Reviews from Real Learners',
  description: 'Here is what our students have to say about learning, building projects, and transforming their careers with DO PILOT.',
  items: DEFAULT_REVIEW_ITEMS,
  reviews: DEFAULT_REVIEW_ITEMS
};

export const DEFAULT_CODE_LAB: CodeLabData = {
  badgeText: 'CODE LAB',
  title: 'Run Python Programs Instantly',
  description: 'Write, test, and execute Python 3.12 code directly in your browser.',
  defaultCode: 'print("Hello, World!")\n',
  statusText: 'Ready to run Python 3.12'
};

export const DEFAULT_LIVE_CLASS: LiveClassData = {
  badgeText: 'LIVE CLASS',
  title: 'Upcoming Live Class',
  description: 'Join our interactive live masterclass. Code alongside experienced engineers and ask your questions live.',
  spotlightBadge: 'Live Workshop • Limited Seats',
  className: 'Python & AI Assistant: Live Masterclass',
  classDescription: 'Build a functional AI assistant with Python and live API integration in a 2-hour interactive code-along.',
  benefits: [
    'Hands-on coding with live mentor guidance',
    'Python & AI API integration',
    'Live Q&A and complete project source code'
  ],
  seatsLeft: '14 Spots Left',
  seatsTotal: '50 Total',
  dateText: 'Saturday, Oct 18, 2026',
  date: 'Saturday, Oct 18, 2026',
  timeText: '6:00 PM – 8:00 PM IST',
  time: '6:00 PM – 8:00 PM IST',
  durationText: '2 Hours Hands-on',
  duration: '2 Hours Hands-on',
  platformText: 'Interactive IDE & Live Stream',
  platform: 'Interactive IDE & Live Stream',
  pricingText: 'Free',
  pricing: 'Free',
  mentorName: 'Arunav Sharma',
  mentorRole: 'Lead Python Engineer & Architect',
  mentorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
  buttonText: 'Join Live Masterclass',
  countdownDays: 3,
  countdownHours: 8,
  targetDateTime: '2026-10-18T18:00'
};

export const DEFAULT_HERO: HeroData = {
  eyebrow: '',
  headlineWord1: 'Master Real Tech Skills with',
  headlineWord2: 'DO PILOT',
  headlineWord3: '',
  headlineWord4: '',
  glowingWords: {
    word1: false,
    word2: false,
    word3: false,
    word4: true,
    build: false,
    whats: false,
    next: true
  },
  description: 'Practical, project-based courses and live classes taught by industry engineers. Learn Python, Java programming, and real-world skills to launch your tech career.',
  pillars: [
    '100% Practical Projects',
    'Live Interactive Classes',
    '1-on-1 Mentor Support'
  ],
  primaryCtaText: 'Explore Courses',
  primaryCtaLink: '#courses',
  secondaryCtaText: 'Join Next Live Class',
  secondaryCtaLink: '#live-class',
  headlinePrefix: 'Master Real Tech Skills with',
  highlightWord: 'DO PILOT',
  scrollCueText: 'Explore DO PILOT',
  metrics: []
};

export const DEFAULT_NAVBAR: NavbarData = {
  companyName: 'DO PILOT',
  companyLogo: 'https://res.cloudinary.com/ufo0zltq/image/upload/v1786197046/Do_PNG_ssyhu1.png',
  ctaText: 'Get in Touch',
  ctaLink: '#contact',
  navLinks: [
    { id: 'nav-1', name: 'WHY US', href: '#why-us' },
    { id: 'nav-2', name: 'COURSES', href: '#courses' },
    { id: 'nav-3', name: 'REVIEWS', href: '#reviews' },
    { id: 'nav-code-lab', name: 'CODE LAB', href: '#code-lab' },
    { id: 'nav-4', name: 'LIVE CLASS', href: '#live-class' }
  ]
};

const DEFAULT_SITE_DATA: SiteData = {
  ...(initialSiteData as unknown as SiteData),
  hero: (initialSiteData as any)?.hero || DEFAULT_HERO,
  sectionsManager: DEFAULT_SECTIONS_MANAGER,
  navbar: (initialSiteData as any)?.navbar || DEFAULT_NAVBAR,
  whyUs: (initialSiteData as any)?.whyUs || DEFAULT_WHY_US,
  coursesSection: sanitizeCoursesSection((initialSiteData as any)?.coursesSection || DEFAULT_COURSES_SECTION),
  reviewsSection: (initialSiteData as any)?.reviewsSection || DEFAULT_REVIEWS_SECTION,
  codeLab: (initialSiteData as any)?.codeLab || DEFAULT_CODE_LAB,
  liveClass: (initialSiteData as any)?.liveClass || DEFAULT_LIVE_CLASS,
};

const STORAGE_KEY = "docompany_portfolio_site_data_v1";
const PERMANENT_DEFAULT_KEY = "docompany_permanent_default_data_v1";
const VERSION_KEY = "docompany_site_data_version_v1";

const getBaselineDefaults = (): SiteData => {
  try {
    const savedVersion = localStorage.getItem(VERSION_KEY);
    const builtInVersion = String(DEFAULT_SITE_DATA.version || '');

    if (builtInVersion && savedVersion !== builtInVersion) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(VERSION_KEY, builtInVersion);
    }

    const customDefault = localStorage.getItem(PERMANENT_DEFAULT_KEY);
    if (customDefault) {
      const parsed = JSON.parse(customDefault);
      return {
        ...DEFAULT_SITE_DATA,
        ...parsed,
        hero: (parsed.hero && !parsed.hero.description?.includes('high-performance web applications') && !parsed.hero.eyebrow?.includes('SYSTEM ARCHITECTURE') && !parsed.hero.pillars?.includes('Transparent Pricing') && parsed.hero.primaryCtaText !== 'Get Started')
          ? { ...DEFAULT_HERO, ...parsed.hero }
          : DEFAULT_HERO,
        sectionsManager: parsed.sectionsManager || DEFAULT_SECTIONS_MANAGER,
        navbar: (parsed.navbar && !parsed.navbar.navLinks?.some((l: any) => l.name === 'SERVICES')) ? parsed.navbar : DEFAULT_NAVBAR,
        whyUs: parsed.whyUs || DEFAULT_WHY_US,
        coursesSection: sanitizeCoursesSection(parsed.coursesSection),
        reviewsSection: parsed.reviewsSection || DEFAULT_REVIEWS_SECTION,
        codeLab: parsed.codeLab || DEFAULT_CODE_LAB,
        liveClass: parsed.liveClass || DEFAULT_LIVE_CLASS,
      };
    }
  } catch (e) {
    console.error("Failed to load permanent defaults:", e);
  }
  return DEFAULT_SITE_DATA;
};

// Helper for UTF-8 Base64 encoding in browser
const utf8ToBase64 = (str: string): string => {
  return btoa(unescape(encodeURIComponent(str)));
};

// Local storage and Supabase cloud sync (triggered by individual section Save buttons)
const saveDataLocally = async (nextState: SiteData): Promise<boolean> => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    localStorage.setItem(PERMANENT_DEFAULT_KEY, JSON.stringify(nextState));

    // Sync to Supabase PostgreSQL Database (Cloud)
    try {
      if (isSupabaseConfigured()) {
        await supabase
          .from('site_content')
          .upsert({ id: 'default', content: nextState, updated_at: new Date().toISOString() });
      }
    } catch (sErr) {
      console.warn("Supabase content sync warning:", sErr);
    }

    // Vite local dev server middleware backup (if running locally via npm run dev)
    try {
      await fetch("/api/save-site-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextState)
      }).catch(() => {});
    } catch (e) {
      // Ignore on Vercel static hosting
    }
  } catch (e) {
    console.error("Failed to save site data locally:", e);
  }
  return true;
};

// Dedicated GitHub API Commit function (triggered ONLY by "Deploy to Live" button)
const commitToGitHubLive = async (nextState: SiteData): Promise<boolean> => {
  try {
    const ghToken = import.meta.env.VITE_GITHUB_TOKEN;
    const ghOwner = import.meta.env.VITE_GITHUB_OWNER || "bimaljayakumar";
    const ghRepo = import.meta.env.VITE_GITHUB_REPO || "Company-Website";
    const ghBranch = import.meta.env.VITE_GITHUB_BRANCH || "main";

    if (!ghToken) {
      console.warn("VITE_GITHUB_TOKEN not found in environment variables.");
      return false;
    }

    const filePath = "src/data/siteData.json";
    const getUrl = `https://api.github.com/repos/${ghOwner}/${ghRepo}/contents/${filePath}?ref=${ghBranch}`;

    const getRes = await fetch(getUrl, {
      headers: {
        "Authorization": `token ${ghToken}`,
        "Accept": "application/vnd.github.v3+json"
      }
    });

    let sha = "";
    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha || "";
    }

    const jsonContent = JSON.stringify(nextState, null, 2);
    const contentBase64 = utf8ToBase64(jsonContent);

    const putUrl = `https://api.github.com/repos/${ghOwner}/${ghRepo}/contents/${filePath}`;
    const putRes = await fetch(putUrl, {
      method: "PUT",
      headers: {
        "Authorization": `token ${ghToken}`,
        "Content-Type": "application/json",
        "Accept": "application/vnd.github.v3+json"
      },
      body: JSON.stringify({
        message: "chore(admin): deploy siteData.json to live site via Admin Panel",
        content: contentBase64,
        sha: sha || undefined,
        branch: ghBranch
      })
    });

    return putRes.ok;
  } catch (e) {
    console.error("GitHub live deployment failed:", e);
    return false;
  }
};

interface DataContextType {
  data: SiteData;
  updateSection: <K extends keyof SiteData>(section: K, newData: Partial<SiteData[K]>) => Promise<boolean>;
  addArrayItem: <K extends keyof SiteData>(section: K, arrayKey: string, item: any) => Promise<boolean>;
  updateArrayItem: <K extends keyof SiteData>(section: K, arrayKey: string, id: string, updatedItem: any) => Promise<boolean>;
  deleteArrayItem: <K extends keyof SiteData>(section: K, arrayKey: string, id: string) => Promise<boolean>;
  moveArrayItem: <K extends keyof SiteData>(section: K, arrayKey: string, index: number, direction: 'up' | 'down') => Promise<boolean>;
  addMessage: (msg: { name: string; email: string; subject?: string; message: string }) => Promise<boolean>;
  deleteMessage: (id: string) => Promise<boolean>;
  resetToDefaults: () => Promise<boolean>;
  setAsPermanentDefaults: () => Promise<boolean>;
  resetToFactoryDefaults: () => Promise<boolean>;
  hasPermanentDefaults: boolean;
  importDataJSON: (jsonString: string) => Promise<boolean>;
  exportDataJSON: () => string;
  deployToLive: () => Promise<boolean>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasPermanentDefaults, setHasPermanentDefaults] = useState<boolean>(() => {
    return Boolean(localStorage.getItem(PERMANENT_DEFAULT_KEY));
  });

  const [data, setData] = useState<SiteData>(() => {
    const baseline = getBaselineDefaults();
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...baseline,
          ...parsed,
          sectionsManager: parsed.sectionsManager || baseline.sectionsManager || DEFAULT_SECTIONS_MANAGER,
          navbar: (parsed.navbar && !parsed.navbar.navLinks?.some((l: any) => l.name === 'SERVICES')) ? parsed.navbar : (baseline.navbar || DEFAULT_NAVBAR),
          whyUs: parsed.whyUs || baseline.whyUs || DEFAULT_WHY_US,
          coursesSection: sanitizeCoursesSection(parsed.coursesSection || baseline.coursesSection),
          reviewsSection: parsed.reviewsSection || baseline.reviewsSection || DEFAULT_REVIEWS_SECTION,
          codeLab: parsed.codeLab || baseline.codeLab || DEFAULT_CODE_LAB,
          liveClass: parsed.liveClass || baseline.liveClass || DEFAULT_LIVE_CLASS,
        };
      }
    } catch (e) {
      console.error("Failed to load local site data:", e);
    }
    return baseline;
  });

  // Load latest site content from Supabase cloud on initial mount
  useEffect(() => {
    let isMounted = true;
    const loadFromSupabase = async () => {
      try {
        if (!isSupabaseConfigured()) return;
        const { data: row, error } = await supabase
          .from('site_content')
          .select('content')
          .eq('id', 'default')
          .maybeSingle();

        if (isMounted && row?.content && !error) {
          const content = { ...row.content };
          if (content.coursesSection) {
            content.coursesSection = sanitizeCoursesSection(content.coursesSection);
          }
          setData((prev) => ({
            ...prev,
            ...content
          }));
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...row.content, coursesSection: content.coursesSection }));
        } else if (isMounted && !error && !row) {
          // Table exists but is fresh/empty: auto-seed with current real site data so nothing is ever blank!
          await supabase
            .from('site_content')
            .upsert({ id: 'default', content: data, updated_at: new Date().toISOString() });
        }
      } catch (err) {
        console.warn("Could not load from Supabase:", err);
      }
    };
    loadFromSupabase();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateSection = async <K extends keyof SiteData>(section: K, newData: Partial<SiteData[K]>): Promise<boolean> => {
    return new Promise((resolve) => {
      setData((prev) => {
        const existingSection = prev[section];
        const mergedSection =
          typeof existingSection === 'object' && existingSection !== null && typeof newData === 'object' && newData !== null
            ? { ...existingSection, ...newData }
            : (newData as SiteData[K]);

        const nextState: SiteData = {
          ...prev,
          [section]: mergedSection
        };
        saveDataLocally(nextState).then((res) => resolve(res));
        return nextState;
      });
    });
  };

  const addArrayItem = async <K extends keyof SiteData>(section: K, arrayKey: string, item: any): Promise<boolean> => {
    return new Promise((resolve) => {
      setData((prev) => {
        const sectionObj = prev[section] as any;
        const currentArray = Array.isArray(sectionObj[arrayKey]) ? sectionObj[arrayKey] : [];
        const newItem = { id: `item-${Date.now()}`, ...item };
        const nextState: SiteData = {
          ...prev,
          [section]: {
            ...sectionObj,
            [arrayKey]: [...currentArray, newItem]
          }
        };
        saveDataLocally(nextState).then((res) => resolve(res));
        return nextState;
      });
    });
  };

  const updateArrayItem = async <K extends keyof SiteData>(section: K, arrayKey: string, id: string, updatedItem: any): Promise<boolean> => {
    return new Promise((resolve) => {
      setData((prev) => {
        const sectionObj = prev[section] as any;
        const currentArray = Array.isArray(sectionObj[arrayKey]) ? sectionObj[arrayKey] : [];
        const nextState: SiteData = {
          ...prev,
          [section]: {
            ...sectionObj,
            [arrayKey]: currentArray.map((item: any) => (item.id === id ? { ...item, ...updatedItem } : item))
          }
        };
        saveDataLocally(nextState).then((res) => resolve(res));
        return nextState;
      });
    });
  };

  const deleteArrayItem = async <K extends keyof SiteData>(section: K, arrayKey: string, id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setData((prev) => {
        const sectionObj = prev[section] as any;
        const currentArray = Array.isArray(sectionObj[arrayKey]) ? sectionObj[arrayKey] : [];
        const nextState: SiteData = {
          ...prev,
          [section]: {
            ...sectionObj,
            [arrayKey]: currentArray.filter((item: any) => item.id !== id)
          }
        };
        saveDataLocally(nextState).then((res) => resolve(res));
        return nextState;
      });
    });
  };

  const moveArrayItem = async <K extends keyof SiteData>(
    section: K,
    arrayKey: string,
    index: number,
    direction: 'up' | 'down'
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setData((prev) => {
        const sectionObj = prev[section] as any;
        const currentArray = Array.isArray(sectionObj[arrayKey]) ? [...sectionObj[arrayKey]] : [];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= currentArray.length) {
          resolve(false);
          return prev;
        }
        const temp = currentArray[index];
        currentArray[index] = currentArray[targetIndex];
        currentArray[targetIndex] = temp;

        const nextState: SiteData = {
          ...prev,
          [section]: {
            ...sectionObj,
            [arrayKey]: currentArray
          }
        };
        saveDataLocally(nextState).then((res) => resolve(res));
        return nextState;
      });
    });
  };

  const addMessage = async (msg: { name: string; email: string; subject?: string; message: string }): Promise<boolean> => {
    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      name: msg.name,
      email: msg.email,
      subject: msg.subject || "Website Form Inquiry",
      message: msg.message,
      date: new Date().toLocaleString(),
      read: false
    };
    // Also save lead to Supabase student_leads table
    try {
      if (isSupabaseConfigured()) {
        Promise.resolve(
          supabase
            .from('student_leads')
            .insert([{
              name: msg.name,
              email: msg.email,
              subject: msg.subject || "Website Form Inquiry",
              message: msg.message
            }])
        ).catch((err) => console.warn("Supabase lead insert notice:", err));
      }
    } catch (e) {
      console.warn("Supabase lead insert warning:", e);
    }

    return new Promise((resolve) => {
      setData((prev) => {
        const nextState: SiteData = {
          ...prev,
          messages: [newMsg, ...prev.messages]
        };
        saveDataLocally(nextState).then((res) => resolve(res));
        return nextState;
      });
    });
  };

  const deleteMessage = async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setData((prev) => {
        const nextState: SiteData = {
          ...prev,
          messages: prev.messages.filter((m) => m.id !== id)
        };
        saveDataLocally(nextState).then((res) => resolve(res));
        return nextState;
      });
    });
  };

  const resetToDefaults = async (): Promise<boolean> => {
    const baseline = getBaselineDefaults();
    setData(baseline);
    return await saveDataLocally(baseline);
  };

  const setAsPermanentDefaults = async (): Promise<boolean> => {
    setHasPermanentDefaults(true);
    try {
      localStorage.setItem(PERMANENT_DEFAULT_KEY, JSON.stringify(data));
    } catch (e) {}
    return await saveDataLocally(data);
  };

  const resetToFactoryDefaults = async (): Promise<boolean> => {
    setData(DEFAULT_SITE_DATA);
    localStorage.removeItem(PERMANENT_DEFAULT_KEY);
    localStorage.removeItem(STORAGE_KEY);
    setHasPermanentDefaults(false);
    return await saveDataLocally(DEFAULT_SITE_DATA);
  };

  const importDataJSON = async (jsonString: string): Promise<boolean> => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object') {
        const baseline = getBaselineDefaults();
        const nextState = { ...baseline, ...parsed };
        setData(nextState);
        return await saveDataLocally(nextState);
      }
    } catch (e) {
      console.error("Invalid JSON format", e);
    }
    return false;
  };

  const exportDataJSON = (): string => {
    return JSON.stringify(data, null, 2);
  };

  const deployToLive = async (): Promise<boolean> => {
    const nextVersion = Date.now();
    const updatedState = { ...data, version: nextVersion };
    setData(updatedState);
    try {
      localStorage.setItem(PERMANENT_DEFAULT_KEY, JSON.stringify(updatedState));
      localStorage.setItem(VERSION_KEY, String(nextVersion));
    } catch (e) {}
    await saveDataLocally(updatedState);
    return await commitToGitHubLive(updatedState);
  };

  return (
    <DataContext.Provider
      value={{
        data,
        updateSection,
        addArrayItem,
        updateArrayItem,
        deleteArrayItem,
        moveArrayItem,
        addMessage,
        deleteMessage,
        resetToDefaults,
        setAsPermanentDefaults,
        resetToFactoryDefaults,
        hasPermanentDefaults,
        importDataJSON,
        exportDataJSON,
        deployToLive
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useSiteData must be used within a DataProvider");
  }
  return context;
};
