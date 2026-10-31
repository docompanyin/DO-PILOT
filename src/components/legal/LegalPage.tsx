import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { navigateBackOrFallback } from '../../utils/navigationHelper';
import { useSiteData } from '../../context/DataContext';
import { DEFAULT_LEGAL_POLICIES } from '../../data/legalData';

export type LegalSectionKey = 'privacy' | 'terms' | 'refund';

interface LegalPageProps {
  defaultSection?: LegalSectionKey;
}

const SECTIONS: { id: LegalSectionKey; label: string; path: string }[] = [
  { id: 'privacy', label: 'Privacy Policy', path: '/privacy' },
  { id: 'terms', label: 'Terms of Service', path: '/terms' },
  { id: 'refund', label: 'Refund & Cancellation Policy', path: '/refund' },
];

export const LegalPage: React.FC<LegalPageProps> = ({ defaultSection }) => {
  const { section: routeSection } = useParams<{ section?: string }>();
  const navigate = useNavigate();
  const { data } = useSiteData();

  // Resolve policies from central site data or fallback to defaults
  const legalPolicies = data.legalPolicies || DEFAULT_LEGAL_POLICIES;

  // Determine current active section
  const getInitialSection = (): LegalSectionKey => {
    if (routeSection && ['privacy', 'terms', 'refund'].includes(routeSection)) {
      return routeSection as LegalSectionKey;
    }
    if (defaultSection && ['privacy', 'terms', 'refund'].includes(defaultSection)) {
      return defaultSection;
    }
    return 'privacy';
  };

  const [activeSection, setActiveSection] = useState<LegalSectionKey>(getInitialSection);

  useEffect(() => {
    if (routeSection && ['privacy', 'terms', 'refund'].includes(routeSection)) {
      setActiveSection(routeSection as LegalSectionKey);
    } else if (defaultSection && ['privacy', 'terms', 'refund'].includes(defaultSection)) {
      setActiveSection(defaultSection);
    }
  }, [routeSection, defaultSection]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const titles: Record<LegalSectionKey, string> = {
      privacy: 'Do Pilot - Privacy Policy',
      terms: 'Do Pilot - Terms of Service',
      refund: 'Do Pilot - Refund & Cancellation Policy',
    };
    document.title = titles[activeSection] || 'Do Pilot - Legal';
  }, [activeSection]);

  const handleTabChange = (key: LegalSectionKey) => {
    setActiveSection(key);
    const target = SECTIONS.find((s) => s.id === key);
    if (target) {
      navigate(target.path, { replace: true });
    }
  };

  const currentPolicy = legalPolicies[activeSection] || DEFAULT_LEGAL_POLICIES[activeSection];
  const contactEmail = currentPolicy.contactEmail || 'support@dopilot.com';

  return (
    <div className="min-h-screen bg-black text-slate font-sans antialiased text-sm selection:bg-primary selection:text-black">
      {/* Top Header - Separator line removed as per requirement */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md">
        <div className="w-full px-4 sm:px-8 lg:px-12 h-14 flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={() => navigateBackOrFallback(navigate, window.location.pathname)}
            className="flex items-center gap-2 text-paper hover:text-primary transition-colors text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono text-sm font-medium">Back</span>
          </button>
        </div>
      </header>

      {/* Main Content Area: Full Page Width */}
      <main className="w-full px-4 sm:px-8 lg:px-12 py-8 sm:py-10 text-sm">
        
        {/* Page Heading: Uniform text-sm */}
        <div className="mb-6">
          <h1 className="font-jakarta text-sm font-bold text-paper uppercase tracking-wider">
            {currentPolicy.title || SECTIONS.find((s) => s.id === activeSection)?.label}
          </h1>
        </div>

        {/* Minimal Navigation Switcher: Uniform text-sm */}
        <div className="flex items-center gap-2 pb-6 mb-8 border-b border-white/10 overflow-x-auto no-scrollbar text-sm">
          {SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => handleTabChange(sec.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-primary text-black font-semibold'
                    : 'bg-white/5 text-slate hover:text-paper hover:bg-white/10'
                }`}
              >
                {sec.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Legal Text Content rendered from Central Database */}
        <div className="space-y-8 text-sm leading-relaxed text-slate text-justify">
          {currentPolicy.sections && currentPolicy.sections.length > 0 ? (
            <div className="space-y-6 text-sm">
              {currentPolicy.sections.map((section, sIdx) => (
                <section key={sIdx} className="space-y-2">
                  <h2 className="text-sm font-bold text-paper font-jakarta text-left">
                    {section.title}
                  </h2>
                  {section.content && (
                    <div className="text-sm space-y-2 whitespace-pre-line text-justify">
                      {section.content.split('\n\n').map((paragraph, pIdx) => {
                        const colonIdx = paragraph.indexOf(':');
                        if (colonIdx > 0 && colonIdx < 45 && !paragraph.startsWith('http')) {
                          const boldPrefix = paragraph.slice(0, colonIdx + 1);
                          const restText = paragraph.slice(colonIdx + 1);
                          return (
                            <p key={pIdx} className="text-sm text-justify">
                              <strong className="text-paper font-semibold">{boldPrefix}</strong>
                              {restText}
                            </p>
                          );
                        }
                        return (
                          <p key={pIdx} className="text-sm text-justify">
                            {paragraph}
                          </p>
                        );
                      })}
                    </div>
                  )}
                  {section.bullets && section.bullets.length > 0 && (
                    <div className="space-y-1.5 text-sm text-slate text-justify">
                      {section.bullets.map((bullet, bIdx) => {
                        const colonIdx = bullet.indexOf(':');
                        if (colonIdx > 0 && colonIdx < 45) {
                          const boldPrefix = bullet.slice(0, colonIdx + 1);
                          const restText = bullet.slice(colonIdx + 1);
                          return (
                            <p key={bIdx} className="text-sm text-justify">
                              <strong className="text-paper font-semibold">{boldPrefix}</strong>
                              {restText}
                            </p>
                          );
                        }
                        return (
                          <p key={bIdx} className="text-sm text-justify">
                            {bullet}
                          </p>
                        );
                      })}
                    </div>
                  )}
                </section>
              ))}
            </div>
          ) : null}
        </div>

        {/* Minimal Support Contact Box: Uniform text-sm */}
        <div className="mt-12 pt-6 border-t border-white/10 flex items-center gap-2 text-slate text-sm">
          <Mail className="w-4 h-4 text-primary shrink-0" />
          <span>Legal or compliance questions:</span>
          <a
            href={`mailto:${contactEmail}`}
            className="text-paper hover:text-primary underline font-medium"
          >
            {contactEmail}
          </a>
        </div>

      </main>
    </div>
  );
};

export default LegalPage;
