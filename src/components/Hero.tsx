import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Play, UserPlus, CheckCircle2, ChevronDown } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { useSiteData } from '../context/DataContext';
import { useUserAuth } from '../context/UserAuthContext';

interface HeroProps {
  onOpenContact?: (courseName?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenContact: _onOpenContact }) => {
  const { data } = useSiteData();
  const heroData = data?.hero || {};

  const handleLinkClick = (link?: string) => {
    if (!link) return;
    if (link.startsWith('#')) {
      const cleanId = link.replace('#', '');
      const el = document.getElementById(cleanId);
      if (el) {
        const header = el.querySelector('h2');
        if (header) {
          const headerTop = header.getBoundingClientRect().top + window.pageYOffset;
          const y = headerTop - 145;
          window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        } else {
          const y = el.getBoundingClientRect().top + window.pageYOffset + 20;
          window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        }
      }
    } else {
      window.location.href = link;
    }
  };

  const eyebrow = heroData.eyebrow;
  const headlinePrefix = heroData.headlinePrefix || 'Master Real Tech Skills with';
  const highlightWord = heroData.highlightWord || 'DO PILOT';
  const description = heroData.description || 'Practical, project-based courses and live classes taught by industry engineers. Learn Python, Full Stack development, and real-world skills to launch your tech career.';

  const pillars = (heroData.pillars && heroData.pillars.length > 0)
    ? heroData.pillars
    : [
        '100% Practical Projects',
        'Live Interactive Classes',
        '1-on-1 Mentor Support'
      ];

  const primaryCtaText = heroData.primaryCtaText || 'Explore Courses';
  const primaryCtaLink = heroData.primaryCtaLink || '#courses';
  const secondaryCtaText = heroData.secondaryCtaText || 'Join Next Live Class';
  const secondaryCtaLink = heroData.secondaryCtaLink || '#live-class';
  const scrollCueText = heroData.scrollCueText || 'Explore DO PILOT';

  const navigate = useNavigate();
  const { isLoggedIn } = useUserAuth();

  const secondaryBtnText = isLoggedIn ? secondaryCtaText : 'Sign Up';

  const handleSecondaryAction = () => {
    if (isLoggedIn) {
      handleLinkClick(secondaryCtaLink);
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="relative min-h-[100dvh] sm:min-h-[92vh] pt-24 pb-6 sm:pt-36 sm:pb-16 lg:pt-40 lg:pb-20 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#010c08] via-black to-black select-none">
      
      {/* Dark Subtle Ambient Glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[850px] h-[400px] pointer-events-none z-0 opacity-15"
        style={{ transform: 'translate3d(-50%, -50%, 0)', willChange: 'transform' }}
      >
        <div className="w-full h-full bg-gradient-to-tr from-[#00ff9d]/30 via-[#00d2ff]/20 to-transparent blur-[140px] rounded-full" />
      </div>

      {/* Grid Lines Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Centered Main Container */}
      <div className="max-w-4xl mx-auto px-3 min-[360px]:px-4 sm:px-6 lg:px-8 relative z-10 w-full my-auto text-center flex flex-col items-center">

        {/* Optional Eyebrow Badge */}
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-panel/80 border border-white/15 mb-4 sm:mb-6 backdrop-blur-md shadow-sm"
          >
            <span className="font-mono text-xs text-primary font-bold tracking-widest uppercase">
              {eyebrow}
            </span>
          </motion.div>
        )}

        {/* Main Centered Headline with Enhanced Gradient - 3 lines on mobile, flowing on tablet/desktop */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-jakarta text-[30px] min-[360px]:text-[34px] min-[390px]:text-4xl min-[430px]:text-[42px] sm:text-6xl md:text-7xl font-black tracking-tight text-paper leading-[1.2] sm:leading-[1.08] max-w-3xl"
        >
          {headlinePrefix.toLowerCase().includes('master real tech') ? (
            <>
              <span className="block sm:inline mb-1 min-[360px]:mb-1.5 sm:mb-0">Master Real Tech</span>{' '}
              <span className="block sm:inline mb-1 min-[360px]:mb-1.5 sm:mb-0">Skills With</span>{' '}
            </>
          ) : (
            <>{headlinePrefix}{' '}</>
          )}
          <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] via-[#38ef7d] to-[#00d2ff] drop-shadow-[0_0_35px_rgba(0,255,157,0.35)]">
            {highlightWord}
          </span>
        </motion.h1>

        {/* Subtitle / Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate text-sm sm:text-lg leading-relaxed sm:leading-relaxed max-w-2xl font-normal mt-6 min-[360px]:mt-7 sm:mt-5 px-1 sm:px-0"
        >
          {description}
        </motion.p>

        {/* Centered Pillars - All 3 identical in font, size, and styling in a single shared container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-md sm:max-w-none mt-6 sm:mt-7"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-7 gap-y-2.5">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className={`inline-flex items-center gap-2 ${
                  idx === 2 ? 'w-full justify-center mt-1 sm:w-auto sm:mt-0' : ''
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span className="whitespace-nowrap font-jakarta text-[13px] sm:text-sm font-medium text-slate/90 tracking-tight sm:tracking-normal">
                  {pillar}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Centered CTAs - Side-by-side with responsive padding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2.5 min-[360px]:gap-3 sm:gap-4 mt-9 min-[360px]:mt-10 sm:mt-8 w-full"
        >
          <div onClick={() => handleLinkClick(primaryCtaLink)}>
            <MagneticButton strength={22}>
              <div className="group relative overflow-hidden rounded-full bg-primary px-4 py-2.5 min-[360px]:px-5 min-[360px]:py-3 sm:px-8 sm:py-3.5 text-ink font-jakarta font-black text-xs min-[360px]:text-sm tracking-wide shadow-[0_0_24px_rgba(0,255,157,0.35)] hover:shadow-[0_0_40px_rgba(0,255,157,0.6)] hover:bg-white transition-all duration-300 flex items-center gap-2 min-[360px]:gap-3 cursor-pointer">
                {/* Shimmer Light Sweep on Hover */}
                <span className="pointer-events-none absolute -inset-full top-0 block -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shine transition-opacity duration-500" />
                
                <span className="relative z-10">{primaryCtaText}</span>
                
                {/* Dedicated Icon Badge */}
                <span className="relative z-10 w-5 h-5 min-[360px]:w-6 min-[360px]:h-6 rounded-full bg-black/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors shrink-0">
                  <ArrowUpRight className="w-3 h-3 min-[360px]:w-3.5 min-[360px]:h-3.5 text-ink group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </span>
              </div>
            </MagneticButton>
          </div>

          <div onClick={handleSecondaryAction}>
            <MagneticButton strength={15}>
              <div className="px-4 py-2.5 min-[360px]:px-5 min-[360px]:py-3 sm:px-8 sm:py-3.5 rounded-full bg-panel border border-white/15 text-paper font-jakarta font-bold text-xs min-[360px]:text-sm tracking-wide hover:border-primary/50 hover:bg-panel-light transition-all duration-300 flex items-center gap-2 cursor-pointer backdrop-blur-md">
                {isLoggedIn ? (
                  <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary fill-secondary shrink-0" />
                ) : (
                  <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary shrink-0" />
                )}
                <span>{secondaryBtnText}</span>
              </div>
            </MagneticButton>
          </div>
        </motion.div>

      </div>

      {/* Scroll Down Cue */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="relative z-10 mx-auto mt-5 sm:mt-8 pb-1 sm:pb-0 flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
        onClick={() => handleLinkClick('#why-us')}
      >
        <span className="font-mono text-[9px] min-[360px]:text-[10px] uppercase tracking-widest text-slate">{scrollCueText}</span>
        <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
      </motion.div>

    </section>
  );
};

export default Hero;
