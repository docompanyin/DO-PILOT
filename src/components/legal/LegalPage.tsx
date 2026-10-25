import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { navigateBackOrFallback } from '../../utils/navigationHelper';

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
      privacy: 'Privacy Policy — DO PILOT',
      terms: 'Terms of Service — DO PILOT',
      refund: 'Refund & Cancellation Policy — DO PILOT',
    };
    document.title = titles[activeSection] || 'Legal — DO PILOT';
  }, [activeSection]);

  const handleTabChange = (key: LegalSectionKey) => {
    setActiveSection(key);
    const target = SECTIONS.find((s) => s.id === key);
    if (target) {
      navigate(target.path, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate font-sans antialiased text-sm selection:bg-primary selection:text-black">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="w-full px-4 sm:px-8 lg:px-12 h-14 flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={() => navigateBackOrFallback(navigate, window.location.pathname)}
            className="flex items-center gap-2 text-paper hover:text-primary transition-colors text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono text-sm font-medium">Back</span>
          </button>

          <Link to="/" className="flex items-center gap-2 text-sm">
            <img
              src="https://res.cloudinary.com/ufo0zltq/image/upload/v1786197046/Do_PNG_ssyhu1.png"
              alt="DO PILOT"
              className="h-6 w-auto object-contain"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
            <span className="font-jakarta text-sm font-black tracking-wider text-paper uppercase">
              DO PILOT
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content Area: Full Page Width */}
      <main className="w-full px-4 sm:px-8 lg:px-12 py-8 sm:py-10 text-sm">
        
        {/* Page Heading: Uniform text-sm */}
        <div className="mb-6">
          <h1 className="font-jakarta text-sm font-bold text-paper uppercase tracking-wider">
            {SECTIONS.find((s) => s.id === activeSection)?.label}
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

        {/* Legal Text Content: Uniform text-sm throughout */}
        <div className="space-y-8 text-sm leading-relaxed text-slate">

          {/* ========================================================================= */}
          {/* PRIVACY POLICY */}
          {/* ========================================================================= */}
          {activeSection === 'privacy' && (
            <div className="space-y-6 text-sm">
              <section className="space-y-2">
                <h2 className="text-sm font-bold text-paper font-jakarta">
                  1. Scope &amp; Commitment
                </h2>
                <p className="text-sm">
                  DO PILOT operates an educational technology platform offering practical coding courses, live interactive masterclasses, mentorship sessions, and browser-based coding environments. We are committed to safeguarding student data under applicable privacy laws, including the Indian Information Technology Act (2000), the Digital Personal Data Protection Act (DPDP), and international GDPR data protection standards.
                </p>
                <p className="text-sm">
                  <strong className="text-paper font-semibold">Zero-Sale Guarantee:</strong> DO PILOT does not sell, rent, monetize, or trade any student personal information or telemetry to third-party advertisers, data aggregators, or commercial marketing brokers.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm font-bold text-paper font-jakarta">
                  2. Information We Collect
                </h2>
                <p className="text-sm">We collect information directly from you when you register, attend sessions, or use our platform tools:</p>
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate">
                  <li className="text-sm">
                    <strong className="text-paper font-semibold">Account Identifiers:</strong> Name, email address, WhatsApp/phone number, and account login identifiers (via Google OAuth or email sign-in).
                  </li>
                  <li className="text-sm">
                    <strong className="text-paper font-semibold">Learning &amp; Execution Telemetry:</strong> Code execution runs inside the Code Lab compiler, exercise submissions, attendance records during live workshops, and project completions for certificate validation.
                  </li>
                  <li className="text-sm">
                    <strong className="text-paper font-semibold">Payment Data:</strong> Transaction reference IDs, invoice records, and billing details. Payments are processed through RBI-authorized, PCI-DSS compliant gateways (such as Razorpay or Stripe). DO PILOT never captures or stores credit/debit card numbers or bank account credentials.
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm font-bold text-paper font-jakarta">
                  3. Use of Information
                </h2>
                <p className="text-sm">All collected data is utilized exclusively for legitimate educational and platform operations:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate">
                  <li className="text-sm">Granting curriculum access, delivering live session links, and conducting instructor evaluations.</li>
                  <li className="text-sm">Generating tamper-proof, verified digital credentials and certificates of completion.</li>
                  <li className="text-sm">Sending critical operational messages, class reminders, batch schedule adjustments, and support responses.</li>
                  <li className="text-sm">Monitoring platform security, preventing unauthorized multi-user account sharing, and diagnosing compiler runtime exceptions.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm font-bold text-paper font-jakarta">
                  4. Third-Party Infrastructure &amp; Security
                </h2>
                <p className="text-sm">
                  We utilize reputable cloud providers (such as Cloudinary for media assets, Supabase for authenticated session storage, and email/WhatsApp notification gateways) to securely run the platform. All data transmissions are encrypted using standard TLS/HTTPS protocols.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm font-bold text-paper font-jakarta">
                  5. Data Retention &amp; Student Rights
                </h2>
                <p className="text-sm">
                  You retain the right to review, rectify, or request permanent deletion of your profile and records from our databases at any time. For data deletion requests, contact our compliance desk at{' '}
                  <a href="mailto:support@dopilot.com" className="text-primary hover:underline">
                    support@dopilot.com
                  </a>
                  . Verified requests are fulfilled within 30 days.
                </p>
              </section>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TERMS OF SERVICE */}
          {/* ========================================================================= */}
          {activeSection === 'terms' && (
            <div className="space-y-6 text-sm">
              <section className="space-y-2">
                <h2 className="text-sm font-bold text-paper font-jakarta">
                  1. Acceptance of Terms
                </h2>
                <p className="text-sm">
                  By creating an account, enrolling in a course, attending a live masterclass, or utilizing the interactive coding sandbox on DO PILOT, you agree to comply with and be legally bound by these Terms of Service. If you disagree with any part of these terms, you must discontinue using the platform.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm font-bold text-paper font-jakarta">
                  2. Account Fair Use &amp; Single-User License
                </h2>
                <p className="text-sm">
                  Course access and live workshop links are granted strictly on an individual basis. You may not distribute, share, lease, or transfer your login credentials or live classroom links to third parties. Simultaneous access or credential sharing will result in immediate account revocation without refund.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm font-bold text-paper font-jakarta">
                  3. Intellectual Property Rights &amp; Anti-Piracy Protection
                </h2>
                <p className="text-sm">
                  All educational content provided by DO PILOT—including recorded lectures, curriculum syllabi, slide decks, project architecture diagrams, live code walkthroughs, challenges, and proprietary source repositories—is the sole intellectual property of DO PILOT and protected under the Indian Copyright Act (1957) and international copyright treaties.
                </p>
                <p className="text-sm">
                  Students receive a non-exclusive, non-transferable, revocable license strictly for personal learning. Unauthorized screen recording, downloading for public distribution, re-uploading to torrent sites, cloud drives, social channels, or commercial resale is strictly illegal and subject to immediate civil and criminal prosecution.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm font-bold text-paper font-jakarta">
                  4. Live Session Code of Conduct
                </h2>
                <p className="text-sm">
                  DO PILOT maintains a professional, harassment-free environment. Disruptive behavior, inappropriate comments, hate speech, or spamming during live lectures or mentor Q&amp;A sessions will result in instant expulsion from the cohort without right to fee compensation.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm font-bold text-paper font-jakarta">
                  5. Educational Disclaimer &amp; Placement Outcomes
                </h2>
                <p className="text-sm">
                  DO PILOT provides high-impact technical skills training, hands-on project reviews, and career guidance. DO PILOT does not guarantee employment, job placements, specific starting salaries, or selections by third-party recruiters. Career outcomes are determined by individual effort, independent problem-solving skills, and current tech market requirements.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm font-bold text-paper font-jakarta">
                  6. Limitation of Liability &amp; Governing Law
                </h2>
                <p className="text-sm">
                  To the maximum extent permitted by law, DO PILOT's aggregate legal liability for any dispute or claim arising from course enrollment or website use is strictly capped at the total fee actually paid by the student for that specific course.
                </p>
                <p className="text-sm">
                  These Terms are governed by and construed in accordance with the laws of India. Any legal dispute or proceeding shall be subject to the exclusive jurisdiction of the competent courts in Kerala, India.
                </p>
              </section>
            </div>
          )}

          {/* ========================================================================= */}
          {/* REFUND & CANCELLATION POLICY */}
          {/* ========================================================================= */}
          {activeSection === 'refund' && (
            <div className="space-y-6 text-sm">
              <section className="space-y-2">
                <h2 className="text-sm font-bold text-paper font-jakarta">
                  1. Purpose &amp; Overview
                </h2>
                <p className="text-sm">
                  DO PILOT provides digital curriculum, live instructor time, and proprietary coding materials. We provide clear, fair refund guidelines so that learners can register with confidence while protecting mentor scheduling and classroom resource allocations.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm font-bold text-paper font-jakarta">
                  2. Live Masterclasses &amp; Single Workshops
                </h2>
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate">
                  <li className="text-sm">
                    <strong className="text-paper font-semibold">Eligible Cancellation:</strong> You are entitled to a 100% refund if your cancellation request is received in writing at least 24 hours prior to the scheduled live session start time.
                  </li>
                  <li className="text-sm">
                    <strong className="text-paper font-semibold">Ineligible Period:</strong> Requests submitted within 24 hours of the session, during the live class, or after recording links and starter files have been shared, are strictly non-refundable.
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm font-bold text-paper font-jakarta">
                  3. Multi-Week Cohorts &amp; Comprehensive Programs
                </h2>
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate">
                  <li className="text-sm">
                    Refund requests may be submitted within <strong className="text-paper font-semibold">3 calendar days (72 hours)</strong> of the official batch kickoff date, provided the student has attended no more than one live class session and completed under 15% of course lessons.
                  </li>
                  <li className="text-sm">
                    A payment gateway handling charge (typically 2% to 3% charged by payment processors) may be deducted from the final refunded sum.
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm font-bold text-paper font-jakarta">
                  4. Cancellations Initiated by DO PILOT
                </h2>
                <p className="text-sm">
                  In the event that DO PILOT cancels a scheduled cohort or masterclass due to instructor illness or technical emergencies, enrolled learners will receive an immediate 100% full refund or the choice to transfer to any future batch at no extra charge.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm font-bold text-paper font-jakarta">
                  5. Refund Request Process
                </h2>
                <p className="text-sm">
                  To request a refund, email{' '}
                  <a href="mailto:support@dopilot.com" className="text-primary hover:underline">
                    support@dopilot.com
                  </a>{' '}
                  from your registered account email, providing your enrollment name and transaction reference ID. Approved refunds are credited directly back to the original payment source within 5 to 7 business banking days.
                </p>
              </section>
            </div>
          )}

        </div>

        {/* Minimal Support Contact Box: Uniform text-sm */}
        <div className="mt-12 pt-6 border-t border-white/10 flex items-center gap-2 text-slate text-sm">
          <Mail className="w-4 h-4 text-primary shrink-0" />
          <span>Legal or compliance questions:</span>
          <a
            href="mailto:support@dopilot.com"
            className="text-paper hover:text-primary underline font-medium"
          >
            support@dopilot.com
          </a>
        </div>

      </main>
    </div>
  );
};

export default LegalPage;
