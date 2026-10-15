import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { useUserAuth } from '../context/UserAuthContext';
import { useSiteData } from '../context/DataContext';
import { getUserInitials } from '../utils/userInitials';

const DEFAULT_NAV_LINKS = [
  { id: 'nav-1', name: 'WHY US', href: '#why-us' },
  { id: 'nav-2', name: 'COURSES', href: '#courses' },
  { id: 'nav-3', name: 'REVIEWS', href: '#reviews' },
  { id: 'nav-code-lab', name: 'CODE LAB', href: '#code-lab' },
  { id: 'nav-4', name: 'LIVE CLASS', href: '#live-class' },
];

interface NavbarProps {
  onOpenEnroll?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEnroll }) => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useUserAuth();
  const { data } = useSiteData();

  const navLinks = data.navbar?.navLinks && data.navbar.navLinks.length > 0 && !data.navbar.navLinks.some(l => l.name === 'SERVICES') ? data.navbar.navLinks : DEFAULT_NAV_LINKS;
  const ctaText = data.navbar?.ctaText || 'Get in Touch';
  const companyName = data.navbar?.companyName || 'DO PILOT';
  const companyLogo = data.navbar?.companyLogo || 'https://res.cloudinary.com/ufo0zltq/image/upload/v1786197046/Do_PNG_ssyhu1.png';

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTarget = (targetId: string) => {
    if (!targetId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const targetElem = document.getElementById(targetId);
    if (targetElem) {
      const header = targetElem.querySelector('h2');
      if (header) {
        const headerTop = header.getBoundingClientRect().top + window.pageYOffset;
        const y = headerTop - 145;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      } else {
        const y = targetElem.getBoundingClientRect().top + window.pageYOffset + 20;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.replace('#', '');
      scrollToTarget(targetId);
    }
  };

  return (
    <>
      {/* Fixed Wrapper centered at top */}
      <div className="fixed top-4 sm:top-6 left-0 right-0 z-50 px-4 pointer-events-none">
        <header
          className={`max-w-6xl mx-auto pointer-events-auto rounded-full transition-all duration-500 border ${
            isScrolled
              ? 'bg-panel/85 backdrop-blur-2xl border-white/15 py-2.5 px-4 sm:px-6 shadow-[0_16px_50px_rgba(0,0,0,0.9)] shadow-black'
              : 'bg-panel/60 backdrop-blur-xl border-white/10 py-3 px-5 sm:px-7 shadow-2xl'
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            
            {/* Left: Brand Logo */}
            <a
              href="#"
              onClick={(e) => handleNavClick(e, '#')}
              className="flex items-center gap-2 sm:gap-2.5 group focus:outline-none shrink-0"
            >
              <img
                src={companyLogo}
                alt={companyName}
                className="h-6 sm:h-7 w-auto object-contain shrink-0 rounded-md"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              <span className="font-jakarta text-xs sm:text-sm font-black tracking-wider text-paper uppercase whitespace-nowrap">
                {companyName}
              </span>
            </a>

            {/* Center: Desktop Nav Links inside the single glass bar */}
            <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
              {navLinks.map((link) => (
                <a
                  key={link.id || link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  onMouseEnter={() => setHoveredLink(link.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="relative font-jakarta text-[11px] font-bold tracking-widest text-slate hover:text-paper transition-colors py-1 focus:outline-none cursor-pointer"
                >
                  {link.name}
                  {hoveredLink === link.name && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full shadow-[0_0_8px_#00ff9d]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              ))}
            </nav>

            {/* Right: Auth & CTA Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {isLoggedIn && user ? (
                <button
                  onClick={() => navigate('/settings')}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-panel border border-white/15 text-paper hover:border-primary/50 transition-colors cursor-pointer"
                  title="User Settings & Learning Progress"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/50 text-primary flex items-center justify-center font-jakarta font-black text-[9px] tracking-tight shrink-0">
                    {getUserInitials(user.name)}
                  </div>
                  <span className="font-jakarta text-xs font-bold hidden sm:inline max-w-[80px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="hidden sm:flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-white/[0.06] border border-white/10 text-paper font-jakarta text-xs font-bold hover:bg-white/[0.12] hover:border-white/20 transition-all cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Sign In</span>
                </button>
              )}

              {!isLoggedIn && (
                <div
                  onClick={() => {
                    if (onOpenEnroll) {
                      onOpenEnroll();
                    } else {
                      scrollToTarget('courses');
                    }
                  }}
                >
                  <MagneticButton strength={15}>
                    <div className="px-4 sm:px-5 py-2 rounded-full bg-primary text-ink font-jakarta text-xs font-extrabold tracking-wide hover:bg-white hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 flex items-center gap-1.5 cursor-pointer">
                      <span>{ctaText}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </MagneticButton>
                </div>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-full bg-black/80 border border-white/15 text-paper hover:text-primary transition-colors focus:outline-none cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/98 backdrop-blur-3xl flex flex-col justify-center px-8 lg:hidden"
          >
            <div className="flex flex-col gap-6 max-w-md mx-auto w-full">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.id || link.name}
                  href={link.href}
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleNavClick(e, link.href);
                  }}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.07, duration: 0.3 }}
                  className="font-jakarta text-2xl font-extrabold text-paper hover:text-primary transition-colors flex items-center justify-between border-b border-white/10 pb-4 cursor-pointer"
                >
                  <span>{link.name}</span>
                  <ArrowUpRight className="w-5 h-5 text-slate" />
                </motion.a>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.07 }}
                className="mt-4 space-y-3"
              >
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(isLoggedIn ? '/settings' : '/login');
                  }}
                  className="w-full py-3.5 rounded-full bg-panel border border-white/15 text-paper text-center font-jakarta font-bold text-sm flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  {isLoggedIn && user ? (
                    <>
                      <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/50 text-primary flex items-center justify-center font-jakarta font-black text-xs tracking-tight shrink-0">
                        {getUserInitials(user.name)}
                      </div>
                      <span>{user.name} (Settings &amp; Progress)</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span>Sign In with Google</span>
                    </>
                  )}
                </button>

                {!isLoggedIn && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenEnroll) {
                        onOpenEnroll();
                      } else {
                        scrollToTarget('courses');
                      }
                    }}
                    className="w-full py-4 rounded-full bg-primary text-ink text-center font-jakarta font-extrabold text-sm block shadow-lg shadow-primary/20 cursor-pointer"
                  >
                    {ctaText}
                  </button>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
