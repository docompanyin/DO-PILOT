import React, { useState } from 'react';
import { Send, Mail, Phone, MapPin } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { useSiteData } from '../context/DataContext';
import { MatrixTitle } from './MatrixTitle';

export const CTABanner: React.FC = () => {
  const { data } = useSiteData();
  const { cta, footer } = data;

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;
    if (formData.phone && formData.phone.length !== 10) return;

    // Redirect to WhatsApp using CTA phone number
    const whatsappNumber = (cta.phone || '').replace(/[^0-9]/g, '') || '918787878787';
    const waText = encodeURIComponent(`Hello DO Company! 👋

I'd like to discuss a project with you.

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'N/A'}
Project Type: ${formData.service || 'N/A'}

Details: ${formData.message}`);
    window.open(`https://wa.me/${whatsappNumber}?text=${waText}`, '_blank');
    setFormData({ name: '', email: '', phone: '', service: '', message: '' });
  };

  return (
    <section id="contact" className="py-24 sm:py-32 bg-black relative select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl p-1 bg-gradient-to-r from-primary/40 via-secondary/40 to-primary/40 shadow-2xl overflow-hidden animate-conic-glow">
          <div className="rounded-[22px] bg-panel p-8 sm:p-14 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 flex flex-col items-start gap-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs font-bold uppercase">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span>{cta.eyebrow || "// WHAT'S NEXT"}</span>
              </div>

              <MatrixTitle title={cta.title || "WHAT'S NEXT?"} />

              <p className="text-slate text-base sm:text-lg leading-relaxed">
                {cta.subtitle}
              </p>

              <div className="space-y-4 pt-4 border-t border-white/10 w-full">
                <div className="flex items-center gap-3 text-slate text-sm font-mono">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>{cta.email || footer.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate text-sm font-mono">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{cta.phone || (footer as any).phone || "+1 (800) 450-BUILD"}</span>
                </div>
                <div className="flex items-center gap-3 text-slate text-sm font-mono">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{footer.addressLine1}, {footer.addressLine2}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <form onSubmit={handleSubmit} className="space-y-4 bg-black/60 p-6 sm:p-8 rounded-2xl border border-white/10">
                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">YOUR NAME</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Mercer"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-panel border border-white/10 text-paper placeholder-slate/50 font-sans text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">WORK EMAIL</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-panel border border-white/10 text-paper placeholder-slate/50 font-sans text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">PHONE NUMBER</label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setFormData({ ...formData, phone: val });
                      }}
                      maxLength={10}
                      pattern="[0-9]{10}"
                      className="w-full px-4 py-3 rounded-xl bg-panel border border-white/10 text-paper placeholder-slate/50 font-sans text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                    {formData.phone.length > 0 && formData.phone.length < 10 && (
                      <p className="font-mono text-[10px] text-red-400 mt-1">Must be exactly 10 digits</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">PROJECT TYPE</label>
                    <input
                      type="text"
                      placeholder="e.g. Website Development, Web App..."
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-panel border border-white/10 text-paper placeholder-slate/50 font-sans text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-slate mb-1">PROJECT DETAILS</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Briefly describe your goals, budget, or timelines..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-panel border border-white/10 text-paper placeholder-slate/50 font-sans text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <MagneticButton strength={15} className="w-full">
                      <button
                        type="submit"
                        className="w-full py-4 rounded-xl bg-primary text-ink font-jakarta font-extrabold text-sm tracking-wide hover:bg-white hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <span>{cta.buttonText || "Send Project Request"}</span>
                        <Send className="w-4 h-4" />
                      </button>
                    </MagneticButton>
                  </div>
                </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
