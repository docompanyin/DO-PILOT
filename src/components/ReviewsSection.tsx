import React from 'react';
import { Star, MessageSquare, Quote } from 'lucide-react';
import { useSiteData } from '../context/DataContext';

export const ReviewsSection: React.FC = () => {
  const { data } = useSiteData();
  const reviewsData = data.reviewsSection;

  const badgeText = reviewsData?.badgeText || 'STUDENT STORIES';
  const title = reviewsData?.title || 'Student Reviews';
  const description = reviewsData?.description || 'Real feedback from learners who gained practical skills and built their careers with DO PILOT.';

  const reviews = reviewsData?.reviews && reviewsData.reviews.length > 0
    ? reviewsData.reviews
    : [
        {
          id: '1',
          name: 'Ashwin Menon',
          role: 'GEC Thrissur',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=faces',
          course: 'Complete Python Course',
          rating: 5,
          comment: 'The Python course made programming so simple to understand. The hands-on tasks and mentor code reviews helped me clear every doubt.'
        },
        {
          id: '2',
          name: 'Anjali Kurian',
          role: 'RSET',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces',
          course: 'Complete Java Course',
          rating: 5,
          comment: 'Loved the Java course. The OOP concepts and practical exercises were structured really well and easy to follow.'
        },
        {
          id: '3',
          name: 'Karthik Nair',
          role: 'CET',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
          course: 'Full Stack Open Course',
          rating: 5,
          comment: 'The Full Stack Open course is incredible. Building actual React and Node apps gave me solid confidence for placement interviews.'
        },
        {
          id: '4',
          name: 'Fathima Nizar',
          role: 'Farook College',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
          course: 'Complete Python Course',
          rating: 5,
          comment: 'Great Python course for beginners. The step-by-step problem sets helped me learn coding logic with zero confusion.'
        },
        {
          id: '5',
          name: 'Rohit Varma',
          role: 'TKM Engineering College',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces',
          course: 'Complete Java Course',
          rating: 5,
          comment: 'The Java course completely cleared all my OOP and clean code doubts. The problem sets are top quality.'
        },
        {
          id: '6',
          name: 'Meera Krishnan',
          role: 'CUSAT',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=faces',
          course: 'Cyber Security Course',
          rating: 5,
          comment: 'Very practical Cyber Security course. Hands-on network defense labs and mentor guidance made difficult topics simple.'
        }
      ];

  // Duplicate for seamless infinite sliding loop
  const slidingReviews = [...reviews, ...reviews];

  return (
    <section id="reviews" className="py-16 sm:py-24 lg:py-32 bg-black relative select-none overflow-hidden">
      {/* Background ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[700px] h-[250px] sm:h-[350px] bg-primary/10 blur-[100px] sm:blur-[150px] rounded-full pointer-events-none"
        style={{ transform: 'translate3d(-50%, -50%, 0)', willChange: 'transform' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-8 sm:mb-14">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-panel border border-white/15 mb-3.5 sm:mb-4 shadow-sm">
            <MessageSquare className="w-3.5 h-3.5 text-primary" />
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

      </div>

      {/* Infinite Auto-Sliding Full Reviews Carousel */}
      <div className="relative w-full overflow-hidden group">
        
        {/* Left & Right Edge Fade Overlays */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-20 md:w-36 bg-gradient-to-r from-black via-black/80 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-20 md:w-36 bg-gradient-to-l from-black via-black/80 to-transparent z-20" />

        {/* Sliding Marquee Track */}
        <div 
          className="flex gap-4 sm:gap-6 w-max animate-marquee group-hover:[animation-play-state:paused] py-2 sm:py-4 px-2 sm:px-4"
          style={{ animationDuration: '75s', transform: 'translateZ(0)', willChange: 'transform' }}
        >
          {slidingReviews.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="w-[280px] min-[360px]:w-[310px] sm:w-[400px] flex-shrink-0 rounded-2xl sm:rounded-3xl bg-panel/90 border border-white/10 p-5 sm:p-7 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 flex flex-col justify-between backdrop-blur-sm relative"
            >
              <Quote className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 sm:w-12 sm:h-12 text-white/[0.03] pointer-events-none" />

              <div>
                {/* Top Row: Stars (Highlighting 4 or 5 Stars) */}
                <div className="flex items-center gap-0.5 sm:gap-1 mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                        i < (item.rating || 5)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-white/10 text-white/20'
                      }`}
                    />
                  ))}
                </div>

                {/* Full Review Text */}
                <p className="font-sans text-xs sm:text-sm text-paper/90 leading-relaxed font-normal mb-4 sm:mb-6">
                  "{item.comment}"
                </p>
              </div>

              {/* Bottom Student Profile */}
              <div className="pt-3 sm:pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="font-jakarta font-bold text-xs sm:text-sm text-paper truncate">
                    {item.name}
                  </h4>
                  <p className="font-mono text-[10px] sm:text-[11px] text-primary/90 font-medium truncate max-w-[260px] sm:max-w-[340px]" title={item.role}>
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
};
