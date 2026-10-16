import React from 'react';
import { motion } from 'framer-motion';
import { Code, Users, Video, Briefcase, Check, X, ShieldCheck, ArrowRight } from 'lucide-react';
import { useSiteData } from '../context/DataContext';

export const WhyUsSection: React.FC = () => {
  const { data } = useSiteData();
  const whyUs = data.whyUs;

  const getFeatureIcon = (iconName?: string) => {
    switch ((iconName || '').toLowerCase()) {
      case 'code':
        return Code;
      case 'users':
        return Users;
      case 'video':
        return Video;
      case 'briefcase':
        return Briefcase;
      default:
        return ShieldCheck;
    }
  };

  const badgeText = whyUs?.badgeText || 'WHY CHOOSE US';
  const title = whyUs?.title || 'Why DO PILOT?';
  const description = whyUs?.description || 'Most online tutorials leave you stranded when you face real code errors. Here is how DO PILOT transforms your learning into real capability.';
  const comparisonsTitle = whyUs?.comparisonsTitle || 'How DO PILOT Compares';
  const comparisonsSubtitle = whyUs?.comparisonsSubtitle || 'See the direct difference between regular courses and our engineering mentorship.';
  const features = whyUs?.features && whyUs.features.length > 0 ? whyUs.features : [
    {
      iconName: 'Code',
      title: 'Real Projects, Not Just Theory',
      description: 'You will not just watch videos. You write real code, build production-ready applications, and push commits to GitHub from day one.',
      highlight: '10+ Portfolio Projects',
      color: 'from-emerald-500/20 to-primary/10'
    },
    {
      iconName: 'Users',
      title: 'Mentor Support When You Are Stuck',
      description: 'Never get stuck on bugs for hours. Our experienced software engineers review your code and help you debug in real time.',
      highlight: 'Personal Code Reviews',
      color: 'from-blue-500/20 to-secondary/10'
    },
    {
      iconName: 'Video',
      title: 'Interactive Live Classes',
      description: 'Ask questions live and solve problems together with mentors. We keep our live batches focused and hands-on.',
      highlight: 'Live Coding & Instant Q&A',
      color: 'from-purple-500/20 to-primary/10'
    },
    {
      iconName: 'Briefcase',
      title: 'Career & Industry Ready',
      description: 'Master real developer tools (Git, APIs, Databases, Clean Architecture) so you can crack interviews and freelance with confidence.',
      highlight: 'Interview Prep & Portfolio',
      color: 'from-yellow-500/20 to-emerald-500/10'
    }
  ];

  const comparisons = whyUs?.comparisons && whyUs.comparisons.length > 0 ? whyUs.comparisons : [
    {
      feature: 'Learning Method',
      traditional: 'Passive recorded videos from years ago',
      doPilot: 'Active coding & live interactive sessions'
    },
    {
      feature: 'Project Quality',
      traditional: 'Basic copy-paste toy examples (Todo list)',
      doPilot: 'Production-ready apps and real-world tools'
    },
    {
      feature: 'When You Get Stuck',
      traditional: 'Unanswered forum posts or robot replies',
      doPilot: 'Direct mentor help & 1-on-1 code reviews'
    },
    {
      feature: 'Outcome',
      traditional: 'Certificate with no proof of skill',
      doPilot: 'A verifiable GitHub portfolio that gets jobs'
    }
  ];

  return (
    <section id="why-us" className="py-16 sm:py-24 lg:py-32 bg-black relative border-t border-white/10 select-none">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[250px] sm:h-[400px] bg-primary/10 blur-[90px] sm:blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-panel border border-white/15 mb-3.5 sm:mb-4 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
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
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {features.map((item, idx) => {
            const Icon = getFeatureIcon((item as any).iconName || (item as any).icon);
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative rounded-2xl bg-panel border border-white/10 p-5 sm:p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-panel-light border border-white/15 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:border-primary/40">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>

                  <h3 className="font-jakarta text-base sm:text-lg font-bold text-paper mb-2">
                    {item.title}
                  </h3>

                  <p className="text-slate text-xs sm:text-sm leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-white/10 flex items-center justify-between">
                  <span className="font-mono text-[10px] sm:text-[11px] font-semibold text-primary">
                    {item.highlight}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Comparison Showcase: Traditional vs DO PILOT */}
        <div className="rounded-2xl sm:rounded-3xl bg-panel border border-white/15 p-5 sm:p-8 lg:p-10 shadow-2xl overflow-hidden relative">
          <div className="text-center sm:text-left mb-6 sm:mb-8">
            <h3 className="font-jakarta text-xl sm:text-2xl font-black text-paper">
              {comparisonsTitle}
            </h3>
            <p className="text-slate text-xs sm:text-sm mt-1">
              {comparisonsSubtitle}
            </p>
          </div>

          {/* Mobile View: All Wrong Things First, Then All Right Things (Clean, Neutral, Matching Desktop View) */}
          <div className="md:hidden space-y-4">
            {/* Panel 1: Regular Online Courses */}
            <div className="rounded-xl bg-black/40 border border-white/10 p-4 min-[360px]:p-5">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-white/10">
                <X className="w-4 h-4 text-red-400 shrink-0" />
                <h4 className="font-jakarta text-xs sm:text-sm font-bold text-slate/90 font-mono uppercase tracking-wide">
                  {whyUs?.tableHeaderTraditional || 'Regular Online Courses'}
                </h4>
              </div>

              <div className="space-y-3">
                {comparisons.map((row, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="font-jakarta text-[11px] font-bold text-paper">
                        {row.feature}
                      </div>
                      <div className="text-slate text-xs leading-snug mt-0.5">
                        {row.traditional}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel 2: DO PILOT Platform */}
            <div className="rounded-xl bg-black/40 border border-white/10 p-4 min-[360px]:p-5">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-white/10">
                <Check className="w-4 h-4 text-primary shrink-0" />
                <h4 className="font-jakarta text-xs sm:text-sm font-bold text-slate/90 font-mono uppercase tracking-wide">
                  {whyUs?.tableHeaderDoPilot || 'DO PILOT Platform'}
                </h4>
              </div>

              <div className="space-y-3">
                {comparisons.map((row, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="font-jakarta text-[11px] font-bold text-paper">
                        {row.feature}
                      </div>
                      <div className="text-slate text-xs leading-snug mt-0.5">
                        {row.doPilot}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop & Tablet Table (Hidden on small mobile where stacked panels fit full window) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10 text-xs font-mono uppercase text-slate">
                  <th className="py-3 px-4">{whyUs?.tableHeaderFeature || 'Feature'}</th>
                  <th className="py-3 px-4 text-red-400/90 font-bold">{whyUs?.tableHeaderTraditional || 'Regular Online Courses'}</th>
                  <th className="py-3 px-4 text-primary font-bold">{whyUs?.tableHeaderDoPilot || 'DO PILOT Platform'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {comparisons.map((row, index) => (
                  <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 font-bold text-paper font-jakarta">
                      {row.feature}
                    </td>
                    <td className="py-4 px-4 text-slate">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <span className="text-slate-300 leading-snug">{row.traditional}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-paper font-medium">
                      <div className="flex items-start gap-2 text-primary">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-paper leading-snug">{row.doPilot}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};
