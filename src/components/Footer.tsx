import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowUp, Mail, Phone, MapPin } from 'lucide-react';
import { GithubIcon, TwitterIcon, LinkedinIcon, WhatsappIcon } from './SocialIcons';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useSiteData } from '../context/DataContext';

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { triggerSecretAccess, triggerEmergencyRecovery } = useAdminAuth();
  const { data } = useSiteData();
  const footerData = data.footer;

  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const pendingLoginTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyrightClick = () => {
    const now = Date.now();

    // If more than 2 seconds (2000ms) pass between clicks, reset counter and pending timer
    if (now - lastClickTime > 2000) {
      if (pendingLoginTimer.current) {
        clearTimeout(pendingLoginTimer.current);
        pendingLoginTimer.current = null;
      }
      setClickCount(1);
    } else {
      const newCount = clickCount + 1;
      setClickCount(newCount);

      if (newCount > 5 && pendingLoginTimer.current) {
        clearTimeout(pendingLoginTimer.current);
        pendingLoginTimer.current = null;
      }

      if (newCount === 5) {
        pendingLoginTimer.current = setTimeout(() => {
          triggerSecretAccess();
          setClickCount(0);
          navigate('/admin');
        }, 3000);
      } else if (newCount === 20) {
        if (pendingLoginTimer.current) {
          clearTimeout(pendingLoginTimer.current);
          pendingLoginTimer.current = null;
        }
        triggerEmergencyRecovery();
        setClickCount(0);
        navigate('/admin/emergency-recovery');
      }
    }
    setLastClickTime(now);
  };

  const handleFooterNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.replace('#', '');
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
    }
  };

  const companyName = footerData?.companyName || data.navbar?.companyName || "DO PILOT";
  const companyLogo = footerData?.companyLogo || data.navbar?.companyLogo || "https://res.cloudinary.com/ufo0zltq/image/upload/v1786197046/Do_PNG_ssyhu1.png";
  const description = footerData?.description || "DO PILOT is an educational platform dedicated to project-first coding. We teach practical Python, Java programming, and real-world software engineering with live mentorship.";
  const email = footerData?.email || "support@dopilot.com";
  const phone = footerData?.phone || "+91 97787 07336";
  const address = footerData?.address || "Online & Global Campus";
  const copyrightText = footerData?.copyrightText || "All rights reserved.";

  const githubUrl = footerData?.socialLinks?.github?.url || footerData?.github || "https://github.com";
  const twitterUrl = footerData?.socialLinks?.twitter?.url || footerData?.twitter || "https://twitter.com";
  const linkedinUrl = footerData?.socialLinks?.linkedin?.url || footerData?.linkedin || "https://linkedin.com";
  const whatsappUrl = footerData?.socialLinks?.whatsapp?.url || "https://wa.me/919778707336";

  const exploreTitle = footerData?.exploreTitle || 'Explore';
  const coursesTitle = footerData?.coursesTitle || 'Popular Courses';
  const legalTitle = footerData?.legalTitle || 'Legal & Policies';
  const contactTitle = footerData?.contactTitle || 'Contact & Support';

  const exploreLinks = footerData?.exploreLinks && footerData.exploreLinks.length > 0 ? footerData.exploreLinks : [
    { name: 'Why Us', href: '#why-us' },
    { name: 'Courses', href: '#courses' },
    { name: 'Code Lab', href: '#code-lab' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Live Class', href: '#live-class' },
  ];

  const popularCoursesLinks = footerData?.popularCoursesLinks && footerData.popularCoursesLinks.length > 0 ? footerData.popularCoursesLinks : [
    { name: 'Complete Python Course', href: '/course/complete-python-programming' },
    { name: 'Complete Java Course', href: '/course/complete-java-programming' },
    { name: 'Python for AI & Data', href: '/course/python-ai-data-science' },
  ];

  const legalLinks = footerData?.legalLinks && footerData.legalLinks.length > 0 ? footerData.legalLinks : [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Refund Policy', href: '/refund' },
  ];

  return (
    <footer className="relative bg-black text-slate border-t border-white/10 pt-16 pb-12 select-none overflow-hidden">
      {/* Background Glowing Particles Video Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40 mix-blend-screen"
        >
          <source src="/video/footer-particles.mp4" type="video/mp4" />
        </video>
        {/* Soft edge blend for smooth integration */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Columns: Mathematically Aligned 12-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-8 pb-12 border-b border-white/10">
          
          {/* 1. Brand Column (3/12 cols) */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-3 space-y-4">
            <a
              href="#"
              onClick={(e) => handleFooterNavClick(e, '#')}
              className="h-6 flex items-center gap-2.5 group max-w-full"
            >
              <img
                src={companyLogo}
                alt={companyName}
                className="h-6 w-auto object-contain shrink-0 rounded"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              <span className="font-jakarta text-base font-black tracking-wider text-paper uppercase truncate">
                {companyName}
              </span>
            </a>

            <p className="font-sans text-sm text-slate leading-relaxed max-w-sm">
              {description}
            </p>

            {/* Social Icons Aligned */}
            <div className="pt-1 flex items-center gap-2.5">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-panel border border-white/10 flex items-center justify-center text-slate hover:text-primary hover:border-primary/50 transition-colors"
                  aria-label="GitHub"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              )}
              {twitterUrl && (
                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-panel border border-white/10 flex items-center justify-center text-slate hover:text-primary hover:border-primary/50 transition-colors"
                  aria-label="Twitter"
                >
                  <TwitterIcon className="w-4 h-4" />
                </a>
              )}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-panel border border-white/10 flex items-center justify-center text-slate hover:text-primary hover:border-primary/50 transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              )}
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-panel border border-white/10 flex items-center justify-center text-slate hover:text-primary hover:border-primary/50 transition-colors"
                  aria-label="WhatsApp"
                >
                  <WhatsappIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* 2. Explore Column (2/12 cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-mono text-xs font-bold text-paper uppercase tracking-wider h-6 flex items-center mb-4">
              {exploreTitle}
            </h4>
            <ul className="space-y-3 font-sans text-sm">
              {exploreLinks.map((link, lIdx) => {
                const href = link.href || link.path || '#';
                const name = link.name || link.label || '';
                return (
                  <li key={link.id || lIdx}>
                    <a
                      href={href}
                      onClick={(e) => handleFooterNavClick(e, href)}
                      className="text-slate hover:text-primary transition-colors cursor-pointer no-underline block"
                    >
                      {name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 3. Popular Courses Column (3/12 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-mono text-xs font-bold text-paper uppercase tracking-wider h-6 flex items-center mb-4">
              {coursesTitle}
            </h4>
            <ul className="space-y-3 font-sans text-sm">
              {popularCoursesLinks.map((link, lIdx) => {
                const href = link.href || link.path || '#';
                const name = link.name || link.label || '';
                return (
                  <li key={link.id || lIdx}>
                    <a
                      href={href}
                      onClick={(e) => handleFooterNavClick(e, href)}
                      className="text-slate hover:text-primary transition-colors cursor-pointer no-underline block"
                    >
                      {name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 4. Legal & Policies Column (2/12 cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-mono text-xs font-bold text-paper uppercase tracking-wider h-6 flex items-center mb-4">
              {legalTitle}
            </h4>
            <ul className="space-y-3 font-sans text-sm">
              {legalLinks.map((link, lIdx) => {
                const href = link.href || link.path || '#';
                const name = link.name || link.label || '';
                return (
                  <li key={link.id || lIdx}>
                    {href.startsWith('/') ? (
                      <Link
                        to={href}
                        className="text-slate hover:text-primary transition-colors cursor-pointer no-underline block"
                      >
                        {name}
                      </Link>
                    ) : (
                      <a
                        href={href}
                        onClick={(e) => handleFooterNavClick(e, href)}
                        className="text-slate hover:text-primary transition-colors cursor-pointer no-underline block"
                      >
                        {name}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 5. Contact & Support Column (2/12 cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-mono text-xs font-bold text-paper uppercase tracking-wider h-6 flex items-center mb-4">
              {contactTitle}
            </h4>
            <address className="not-italic font-sans text-sm space-y-3 text-slate">
              {email && (
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  <a href={`mailto:${email}`} className="text-slate hover:text-primary transition-colors truncate">
                    {email}
                  </a>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-slate hover:text-primary transition-colors">
                    {phone}
                  </a>
                </div>
              )}
              {address && (
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span>{address}</span>
                </div>
              )}
            </address>
          </div>

        </div>

        {/* Bottom Bar: Pure Symmetrical Alignment */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-slate">
          {/* Secret Trigger for Admin Login preserved */}
          <div
            onClick={handleCopyrightClick}
            className="cursor-default select-none hover:text-slate/80 text-center sm:text-left"
          >
            <span>© {new Date().getFullYear()} {companyName}. {copyrightText}</span>
          </div>

          {/* Symmetrical Back to top button */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-paper hover:text-primary transition-colors focus:outline-none cursor-pointer shrink-0"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
export default Footer;
