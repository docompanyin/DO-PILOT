export interface LegalPolicySection {
  title: string;
  content: string; // Markdown or paragraph text
  bullets?: string[];
}

export interface LegalPolicyData {
  title: string;
  lastUpdated?: string;
  contactEmail: string;
  sections: LegalPolicySection[];
}

export interface LegalPoliciesData {
  privacy: LegalPolicyData;
  terms: LegalPolicyData;
  refund: LegalPolicyData;
}

export const DEFAULT_LEGAL_POLICIES: LegalPoliciesData = {
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: '2026',
    contactEmail: 'support@dopilot.com',
    sections: [
      {
        title: '1. Scope & Commitment',
        content: 'DO PILOT operates an educational technology platform offering practical coding courses, live interactive masterclasses, mentorship sessions, and browser-based coding environments. We are committed to safeguarding student data under applicable privacy laws, including the Indian Information Technology Act (2000), the Digital Personal Data Protection Act (DPDP), and international GDPR data protection standards.\n\nZero-Sale Guarantee: DO PILOT does not sell, rent, monetize, or trade any student personal information or telemetry to third-party advertisers, data aggregators, or commercial marketing brokers.'
      },
      {
        title: '2. Information We Collect',
        content: 'We collect information directly from you when you register, attend sessions, or use our platform tools:',
        bullets: [
          'Account Identifiers: Name, email address, WhatsApp/phone number, and account login identifiers (via Google OAuth or email sign-in).',
          'Learning & Execution Telemetry: Code execution runs inside the Code Lab compiler, exercise submissions, attendance records during live workshops, and project completions for certificate validation.',
          'Payment Data: Transaction reference IDs, invoice records, and billing details. Payments are processed through RBI-authorized, PCI-DSS compliant gateways (such as Razorpay or Stripe). DO PILOT never captures or stores credit/debit card numbers or bank account credentials.'
        ]
      },
      {
        title: '3. Use of Information',
        content: 'All collected data is utilized exclusively for legitimate educational and platform operations:',
        bullets: [
          'Granting curriculum access, delivering live session links, and conducting instructor evaluations.',
          'Generating tamper-proof, verified digital credentials and certificates of completion.',
          'Sending critical operational messages, class reminders, batch schedule adjustments, and support responses.',
          'Monitoring platform security, preventing unauthorized multi-user account sharing, and diagnosing compiler runtime exceptions.'
        ]
      },
      {
        title: '4. Third-Party Infrastructure & Security',
        content: 'We utilize reputable cloud providers (such as Cloudinary for media assets, Supabase for authenticated session storage, and email/WhatsApp notification gateways) to securely run the platform. All data transmissions are encrypted using standard TLS/HTTPS protocols.'
      },
      {
        title: '5. Data Retention & Student Rights',
        content: 'You retain the right to review, rectify, or request permanent deletion of your profile and records from our databases at any time. For data deletion requests, contact our compliance desk. Verified requests are fulfilled within 30 days.'
      }
    ]
  },
  terms: {
    title: 'Terms of Service',
    lastUpdated: '2026',
    contactEmail: 'support@dopilot.com',
    sections: [
      {
        title: '1. Acceptance of Terms',
        content: 'By creating an account, enrolling in a course, attending a live masterclass, or utilizing the interactive coding sandbox on DO PILOT, you agree to comply with and be legally bound by these Terms of Service. If you disagree with any part of these terms, you must discontinue using the platform.'
      },
      {
        title: '2. Account Fair Use & Single-User License',
        content: 'Course access and live workshop links are granted strictly on an individual basis. You may not distribute, share, lease, or transfer your login credentials or live classroom links to third parties. Simultaneous access or credential sharing will result in immediate account revocation without refund.'
      },
      {
        title: '3. Intellectual Property Rights & Anti-Piracy Protection',
        content: 'All educational content provided by DO PILOT—including recorded lectures, curriculum syllabi, slide decks, project architecture diagrams, live code walkthroughs, challenges, and proprietary source repositories—is the sole intellectual property of DO PILOT and protected under the Indian Copyright Act (1957) and international copyright treaties.\n\nStudents receive a non-exclusive, non-transferable, revocable license strictly for personal learning. Unauthorized screen recording, downloading for public distribution, re-uploading to torrent sites, cloud drives, social channels, or commercial resale is strictly illegal and subject to immediate civil and criminal prosecution.'
      },
      {
        title: '4. Live Session Code of Conduct',
        content: 'DO PILOT maintains a professional, harassment-free environment. Disruptive behavior, inappropriate comments, hate speech, or spamming during live lectures or mentor Q&A sessions will result in instant expulsion from the cohort without right to fee compensation.'
      },
      {
        title: '5. Educational Disclaimer & Placement Outcomes',
        content: 'DO PILOT provides high-impact technical skills training, hands-on project reviews, and career guidance. DO PILOT does not guarantee employment, job placements, specific starting salaries, or selections by third-party recruiters. Career outcomes are determined by individual effort, independent problem-solving skills, and current tech market requirements.'
      },
      {
        title: '6. Limitation of Liability & Governing Law',
        content: 'To the maximum extent permitted by law, DO PILOT\'s aggregate legal liability for any dispute or claim arising from course enrollment or website use is strictly capped at the total fee actually paid by the student for that specific course.\n\nThese Terms are governed by and construed in accordance with the laws of India. Any legal dispute or proceeding shall be subject to the exclusive jurisdiction of the competent courts in Kerala, India.'
      }
    ]
  },
  refund: {
    title: 'Refund & Cancellation Policy',
    lastUpdated: '2026',
    contactEmail: 'support@dopilot.com',
    sections: [
      {
        title: '1. Purpose & Overview',
        content: 'DO PILOT provides digital curriculum, live instructor time, and proprietary coding materials. We provide clear, fair refund guidelines so that learners can register with confidence while protecting mentor scheduling and classroom resource allocations.'
      },
      {
        title: '2. Live Masterclasses & Single Workshops',
        content: 'Policies regarding single masterclasses and workshops:',
        bullets: [
          'Eligible Cancellation: You are entitled to a 100% refund if your cancellation request is received in writing at least 24 hours prior to the scheduled live session start time.',
          'Ineligible Period: Requests submitted within 24 hours of the session, during the live class, or after recording links and starter files have been shared, are strictly non-refundable.'
        ]
      },
      {
        title: '3. Multi-Week Cohorts & Comprehensive Programs',
        content: 'Policies regarding multi-week cohorts:',
        bullets: [
          'Refund requests may be submitted within 3 calendar days (72 hours) of the official batch kickoff date, provided the student has attended no more than one live class session and completed under 15% of course lessons.',
          'A payment gateway handling charge (typically 2% to 3% charged by payment processors) may be deducted from the final refunded sum.'
        ]
      },
      {
        title: '4. Cancellations Initiated by DO PILOT',
        content: 'In the event that DO PILOT cancels a scheduled cohort or masterclass due to instructor illness or technical emergencies, enrolled learners will receive an immediate 100% full refund or the choice to transfer to any future batch at no extra charge.'
      },
      {
        title: '5. Refund Request Process',
        content: 'To request a refund, email from your registered account email, providing your enrollment name and transaction reference ID. Approved refunds are credited directly back to the original payment source within 5 to 7 business banking days.'
      }
    ]
  }
};
