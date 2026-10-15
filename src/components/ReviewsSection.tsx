import React from 'react';
import { Star, CheckCircle2, MessageSquare, Quote } from 'lucide-react';
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
          name: 'Rahul Verma',
          role: 'Python Developer at TechSprint',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
          course: 'Complete Python Course',
          rating: 5,
          comment: 'DO PILOT completely changed how I learn programming. In week two, we built actual automation bots instead of reading textbook theory. The 1-on-1 mentor code reviews gave me the exact skills I needed to land my job.'
        },
        {
          id: '2',
          name: 'Ananya Sharma',
          role: 'Java Backend Engineer at AppScale',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces',
          course: 'Complete Java Course',
          rating: 5,
          comment: 'What sets DO PILOT apart is that the instructors are active software engineers. Whenever I ran into OOP design challenges, Collections complexities, or JVM bugs, they helped me debug and explained the underlying system architecture.'
        },
        {
          id: '3',
          name: 'Karthik Nair',
          role: 'Data Analyst at FinMetrics',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
          course: 'Python for AI & Data Science',
          rating: 5,
          comment: 'The data science track is gold. We cleaned raw real-world datasets and integrated OpenAI endpoints into actual tools. My GitHub portfolio from this course was the highlight of my technical interview.'
        },
        {
          id: '4',
          name: 'Sneha Patel',
          role: 'Frontend Developer & Freelancer',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=faces',
          course: 'Live Python & Web Workshop',
          rating: 5,
          comment: 'I joined one of their weekend live classes and was amazed by the hands-on quality. No boring presentations—just live building and instant Q&A. I learned more in 2 hours than a month of self-study.'
        },
        {
          id: '5',
          name: 'Devendra Singh',
          role: 'Software Engineer at CloudCore',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces',
          course: 'Complete Java Course',
          rating: 5,
          comment: 'The focus on university-grade fundamentals, Helsinki MOOC principles, and clean code made all the difference. Mastering Java 21, Streams, and object-oriented design helped me clear 3 technical interviews in my first month after graduating.'
        },
        {
          id: '6',
          name: 'Meera Krishnan',
          role: 'AI Automation Specialist at NextWave',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
          course: 'Python for AI & Data Science',
          rating: 5,
          comment: 'Outstanding curriculum. Writing actual scraping scripts and chaining AI models opened so many doors. The mentors are available whenever you need help debugging complex workflows.'
        }
      ];

  // Duplicate for seamless infinite sliding loop
  const slidingReviews = [...reviews, ...reviews];

  return (
    <section id="reviews" className="py-16 sm:py-24 lg:py-32 bg-black relative border-t border-white/10 select-none overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[700px] h-[250px] sm:h-[350px] bg-primary/10 blur-[100px] sm:blur-[150px] rounded-full pointer-events-none" />

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
          style={{ animationDuration: '75s' }}
        >
          {slidingReviews.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="w-[280px] min-[360px]:w-[310px] sm:w-[400px] flex-shrink-0 rounded-2xl sm:rounded-3xl bg-panel/90 border border-white/10 p-5 sm:p-7 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 flex flex-col justify-between backdrop-blur-sm relative"
            >
              <Quote className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 sm:w-12 sm:h-12 text-white/[0.03] pointer-events-none" />

              <div>
                {/* Top Row: Stars & Verified Badge */}
                <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-primary text-primary" />
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 font-mono text-[9px] sm:text-[10px] text-primary">
                    <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" />
                    Verified Student
                  </span>
                </div>

                {/* Full Review Text */}
                <p className="font-sans text-xs sm:text-sm text-paper/90 leading-relaxed font-normal mb-4 sm:mb-6">
                  "{item.comment}"
                </p>
              </div>

              {/* Bottom Student Profile */}
              <div className="pt-3 sm:pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-primary/60 shrink-0"
                  />
                  <div>
                    <h4 className="font-jakarta font-bold text-xs sm:text-sm text-paper">
                      {item.name}
                    </h4>
                    <p className="font-mono text-[10px] sm:text-[11px] text-slate truncate max-w-[160px] sm:max-w-[240px]">
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
};
