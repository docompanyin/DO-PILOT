import React, { useState, useEffect } from 'react';
import { Video, Calendar, Clock, Users, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useSiteData } from '../context/DataContext';

interface LiveClassSectionProps {
  onJoin: (className: string) => void;
}

export const LiveClassSection: React.FC<LiveClassSectionProps> = ({ onJoin }) => {
  const { data } = useSiteData();
  const liveClass = data.liveClass;

  // Real-time Live Class countdown timer calculated from admin configured target date & time
  const calculateTimeLeft = () => {
    let targetMs = 0;
    if (liveClass?.targetDateTime) {
      const parsed = new Date(liveClass.targetDateTime).getTime();
      if (!isNaN(parsed) && parsed > 0) {
        targetMs = parsed;
      }
    }

    // Fallback: try parsing human-readable date string
    if (!targetMs && liveClass?.date) {
      const parsedDate = Date.parse(liveClass.date);
      if (!isNaN(parsedDate) && parsedDate > 0) {
        targetMs = parsedDate;
      }
    }

    // Default fallback if no target is specified
    if (!targetMs) {
      return { days: 3, hours: 8, minutes: 59, seconds: 20 };
    }

    const now = Date.now();
    const diff = Math.max(0, targetMs - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [liveClass?.targetDateTime, liveClass?.date, liveClass?.time]);

  const badgeText = liveClass?.badgeText || 'LIVE CLASS';
  const title = liveClass?.title || 'Upcoming Live Class';
  const description = liveClass?.description || 'Join our interactive live masterclass. Code alongside experienced engineers and ask your questions live.';
  const spotlightBadge = liveClass?.spotlightBadge || 'Live Workshop • Limited Seats';
  const liveClassName = liveClass?.className || 'Python & AI Assistant: Live Masterclass';
  const classDescription = liveClass?.classDescription || 'Build a functional AI assistant with Python and live API integration in a 2-hour interactive code-along.';
  const benefits = liveClass?.benefits && liveClass.benefits.length > 0 ? liveClass.benefits : [
    'Hands-on coding with live mentor guidance',
    'Python & AI API integration',
    'Live Q&A and complete project source code'
  ];
  const seatsLeft = liveClass?.seatsLeft || '14 Spots Left';
  const date = liveClass?.date || 'Upcoming Saturday';
  const time = liveClass?.time || '6:00 PM – 8:00 PM IST (2 Hours)';
  const platform = liveClass?.platform || 'Live on Google Meet / Zoom';
  const mentorName = liveClass?.mentorName || 'Lead Mentor';
  const mentorRole = liveClass?.mentorRole || 'Senior Software Engineer at DO PILOT';
  const mentorAvatar = liveClass?.mentorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces';
  const buttonText = liveClass?.buttonText || 'Reserve Your Free Spot';

  return (
    <section id="live-class" className="py-16 sm:py-24 lg:py-32 bg-black relative border-t border-white/10 select-none">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[800px] h-[250px] sm:h-[450px] bg-emerald-500/10 blur-[100px] sm:blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-panel border border-white/15 mb-3.5 sm:mb-4 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
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

        {/* Live Class Spotlight Card */}
        <div className="max-w-5xl mx-auto rounded-2xl sm:rounded-3xl bg-panel border border-white/15 p-5 sm:p-8 lg:p-12 shadow-2xl relative overflow-hidden group hover:border-primary/40 transition-colors">
          
          {/* Subtle Corner Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pb-5 sm:pb-6 border-b border-white/10">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 animate-pulse" />
              {spotlightBadge}
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 font-mono text-[11px] sm:text-xs text-paper">
              <span className="text-slate hidden sm:inline">Starts in:</span>
              <div className="px-2 sm:px-2.5 py-1 rounded-md bg-black/60 border border-white/15 text-center min-w-[34px] sm:min-w-[40px]">
                <span className="font-bold text-primary">{String(timeLeft.days).padStart(2, '0')}</span>d
              </div>
              <span className="text-slate/60">:</span>
              <div className="px-2 sm:px-2.5 py-1 rounded-md bg-black/60 border border-white/15 text-center min-w-[34px] sm:min-w-[40px]">
                <span className="font-bold text-primary">{String(timeLeft.hours).padStart(2, '0')}</span>h
              </div>
              <span className="text-slate/60">:</span>
              <div className="px-2 sm:px-2.5 py-1 rounded-md bg-black/60 border border-white/15 text-center min-w-[34px] sm:min-w-[40px]">
                <span className="font-bold text-primary">{String(timeLeft.minutes).padStart(2, '0')}</span>m
              </div>
              <span className="text-slate/60">:</span>
              <div className="px-2 sm:px-2.5 py-1 rounded-md bg-black/60 border border-white/15 text-center min-w-[34px] sm:min-w-[40px]">
                <span className="font-bold text-primary">{String(timeLeft.seconds).padStart(2, '0')}</span>s
              </div>
            </div>
          </div>

          {/* Main Content Info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 pt-6 sm:pt-8 items-center">
            
            <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
              <h3 className="font-jakarta text-xl sm:text-2xl lg:text-3xl font-black text-paper leading-tight">
                {liveClassName}
              </h3>

              <p className="text-slate text-xs sm:text-sm leading-relaxed font-normal">
                {classDescription}
              </p>

              {/* What is covered */}
              <div className="space-y-2 pt-1 text-xs sm:text-sm text-slate">
                {benefits.map((benefit, bIdx) => (
                  <div key={bIdx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Seat Capacity */}
              <div className="pt-2 max-w-md">
                <div className="flex items-center justify-between text-xs font-mono text-slate">
                  <span className="flex items-center gap-1.5 text-paper">
                    <Users className="w-3.5 h-3.5 text-primary" />
                    Seats Status
                  </span>
                  <span className="text-primary font-bold">{seatsLeft}</span>
                </div>
              </div>
            </div>

            {/* Right Card: Class Details & Action Box */}
            <div className="lg:col-span-5 bg-black/60 border border-white/15 rounded-2xl p-5 sm:p-7 space-y-5 sm:space-y-6">
              
              <div className="space-y-3 border-b border-white/10 pb-5 sm:pb-6 text-xs sm:text-sm">
                <div className="flex items-center gap-3 text-slate">
                  <Calendar className="w-4 h-4 text-primary shrink-0" />
                  <span>{date}</span>
                </div>
                <div className="flex items-center gap-3 text-slate">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span>{time}</span>
                </div>
                <div className="flex items-center gap-3 text-slate">
                  <Video className="w-4 h-4 text-primary shrink-0" />
                  <span>{platform}</span>
                </div>
              </div>

              {/* Instructor info */}
              <div className="flex items-center gap-3">
                <img
                  src={mentorAvatar}
                  alt={mentorName}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-primary shrink-0"
                />
                <div>
                  <h4 className="font-jakarta font-bold text-xs sm:text-sm text-paper">
                    {mentorName}
                  </h4>
                  <p className="font-mono text-[10px] sm:text-[11px] text-slate">{mentorRole}</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-1 sm:pt-2">
                <button
                  onClick={() => onJoin(liveClassName)}
                  className="w-full py-3 sm:py-3.5 rounded-full bg-primary text-ink font-jakarta font-extrabold text-xs sm:text-sm tracking-wide hover:bg-white hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <span>{buttonText}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
