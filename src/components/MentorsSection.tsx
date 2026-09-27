import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSiteData } from '../context/DataContext';
import { GithubIcon, TwitterIcon, LinkedinIcon, InstagramIcon, FacebookIcon } from './SocialIcons';

export const MentorsSection: React.FC = () => {
  const { data } = useSiteData();
  const { mentors } = data;
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  return (
    <section id="mentors" className="py-24 sm:py-32 bg-black relative select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col items-start mb-16">
          <span className="font-mono text-xs text-primary font-bold tracking-widest uppercase mb-3">
            {mentors.eyebrow}
          </span>
          <h2 className="font-jakarta text-3xl sm:text-5xl font-black text-paper tracking-tight">
            {mentors.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {mentors.items.map((mentor, idx) => {
            const hasImage = mentor.image && !failedImages[mentor.id];

            const links = mentor.socialLinks;
            const socialItems = [
              { key: 'github', label: 'GitHub', icon: GithubIcon, url: links?.github?.url, enabled: links?.github?.enabled ?? false },
              { key: 'twitter', label: 'Twitter / X', icon: TwitterIcon, url: links?.twitter?.url, enabled: links?.twitter?.enabled ?? false },
              { key: 'linkedin', label: 'LinkedIn', icon: LinkedinIcon, url: links?.linkedin?.url, enabled: links?.linkedin?.enabled ?? false },
              { key: 'instagram', label: 'Instagram', icon: InstagramIcon, url: links?.instagram?.url, enabled: links?.instagram?.enabled ?? false },
              { key: 'facebook', label: 'Facebook', icon: FacebookIcon, url: links?.facebook?.url, enabled: links?.facebook?.enabled ?? false },
            ].filter(item => item.enabled && item.url && item.url.trim() !== '');

            return (
              <motion.div
                key={mentor.id || idx}
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 rounded-3xl bg-panel border border-white/10 hover:border-primary/50 transition-all duration-300 group flex flex-col justify-between shadow-xl"
              >
                <div>
                  {hasImage ? (
                    <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden mb-5 bg-panel-light group">
                      <img
                        src={mentor.image}
                        alt={mentor.name}
                        loading="eager"
                        onError={() => setFailedImages((prev) => ({ ...prev, [mentor.id]: true }))}
                        className="w-full h-full object-cover object-center sm:object-top filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 font-mono text-[10px] text-primary">
                        {mentor.tag}
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden mb-5 bg-black/60 border border-white/10 p-6 flex flex-col items-center justify-center group-hover:border-primary/40 transition-all duration-300">
                      <div className="w-20 h-20 rounded-2xl bg-panel border-2 border-primary/40 flex items-center justify-center shadow-lg shadow-primary/10 group-hover:scale-105 transition-all duration-300">
                        <span className="font-jakarta font-black text-2xl text-primary tracking-widest">
                          {mentor.name ? mentor.name.split(' ').map((n) => n[0]).join('') : 'DO'}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 font-mono text-[10px] text-primary">
                        {mentor.tag}
                      </div>
                    </div>
                  )}

                  <h3 className="font-jakarta font-black text-xl text-paper group-hover:text-primary transition-colors">
                    {mentor.name}
                  </h3>
                  <p className="font-mono text-xs text-primary/80 mt-1 mb-3">
                    {mentor.role}
                  </p>
                  <p className="text-slate text-xs leading-relaxed mb-4">
                    Specialty: <span className="text-paper font-semibold">{mentor.specialty}</span>
                  </p>
                </div>

                {socialItems.length > 0 && (
                  <div className="pt-4 border-t border-white/10 flex items-center gap-2.5">
                    {socialItems.map(({ key, label, icon: Icon, url }) => (
                      <a
                        key={key}
                        href={url!}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-black/60 border border-white/10 text-slate hover:text-primary hover:border-primary/50 transition-colors"
                        aria-label={label}
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
