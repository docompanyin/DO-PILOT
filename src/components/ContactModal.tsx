import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, CheckCircle2, User, Mail, Phone, BookOpen, MessageSquare, ChevronDown } from 'lucide-react';
import { useSiteData } from '../context/DataContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse?: string;
}

const COURSE_OPTIONS: string[] = [
  'General Enrollment',
  'Complete Python Course',
  'Complete Java Course',
  'Full Stack Development',
  'Cyber Security Course',
  'Other Courses'
];

// Helper to validate standard email format
const isValidEmail = (val: string): boolean => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val.trim());
};

// Helper to clean Indian phone number
const cleanIndianPhone = (raw: string): string => {
  let digits = raw.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  return digits;
};

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, selectedCourse }) => {
  const { addMessage } = useSiteData();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState('General Enrollment');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form Validation States
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);

  // Sync selectedCourse prop with dropdown
  useEffect(() => {
    if (selectedCourse) {
      const match = COURSE_OPTIONS.find(c => 
        c.toLowerCase().includes(selectedCourse.toLowerCase()) || 
        selectedCourse.toLowerCase().includes(c.toLowerCase())
      );
      if (match) {
        setCourse(match);
      } else {
        setCourse(selectedCourse);
      }
    } else {
      setCourse('General Enrollment');
    }
  }, [selectedCourse, isOpen]);

  // Live Phone Validation Handler
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    const digits = cleanIndianPhone(inputVal).slice(0, 10);
    setPhone(digits);

    if (phoneTouched) {
      if (!digits) {
        setPhoneError('10-digit mobile number is required');
      } else if (digits.length < 10) {
        setPhoneError(`10 digits required (${digits.length}/10)`);
      } else if (!/^[6-9]/.test(digits)) {
        setPhoneError('Indian numbers start with 6, 7, 8 or 9');
      } else {
        setPhoneError(null);
      }
    }
  };

  const handlePhoneBlur = () => {
    setPhoneTouched(true);
    const digits = cleanIndianPhone(phone);
    if (!digits) {
      setPhoneError('10-digit mobile number is required');
    } else if (digits.length !== 10) {
      setPhoneError(`Must be exactly 10 digits (${digits.length}/10)`);
    } else if (!/^[6-9]/.test(digits)) {
      setPhoneError('Indian numbers start with 6, 7, 8 or 9');
    } else {
      setPhoneError(null);
    }
  };

  // Live Email Validation Handler
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (emailTouched) {
      if (!val.trim()) {
        setEmailError('Email address is required');
      } else if (!isValidEmail(val)) {
        setEmailError('Enter a valid email (e.g. name@gmail.com)');
      } else {
        setEmailError(null);
      }
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    if (!email.trim()) {
      setEmailError('Email address is required');
    } else if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError(null);
    }
  };

  // Live Name Validation Handler
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (nameTouched) {
      if (!val.trim()) {
        setNameError('Full name is required');
      } else if (val.trim().length < 2) {
        setNameError('Name must be at least 2 characters');
      } else {
        setNameError(null);
      }
    }
  };

  const handleNameBlur = () => {
    setNameTouched(true);
    if (!name.trim()) {
      setNameError('Full name is required');
    } else if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
    } else {
      setNameError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setNameTouched(true);
    setEmailTouched(true);
    setPhoneTouched(true);

    let hasError = false;

    if (!name.trim() || name.trim().length < 2) {
      setNameError('Please enter your full name');
      hasError = true;
    } else {
      setNameError(null);
    }

    if (!email.trim() || !isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    } else {
      setEmailError(null);
    }

    const cleanPhone = cleanIndianPhone(phone);
    if (!cleanPhone || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      setPhoneError('Please enter a valid 10-digit Indian number (starts with 6-9)');
      hasError = true;
    } else {
      setPhoneError(null);
    }

    if (hasError) return;

    setIsSubmitting(true);

    // Save locally to site messages
    addMessage({
      name,
      email,
      subject: `Enrollment: ${course}`,
      message: `Phone: +91 ${cleanPhone}\nTrack: ${course}\nNotes: ${message || 'No additional notes'}`
    });

    // Send Instant Telegram Notification
    const tgToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '8745385129:AAGzGQtV2eYTN12dV5cXEXHccN49X4WkonU';
    const tgChatId = import.meta.env.VITE_TELEGRAM_CHAT_ID || '8306622931';

    if (tgToken && tgChatId) {
      try {
        const escapeHtml = (str: string) =>
          str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        const textHtml = 
          `🎓 <b>NEW DO PILOT ENROLLMENT!</b> 🚀\n\n` +
          `👤 <b>Student Name:</b> ${escapeHtml(name.trim())}\n` +
          `📞 <b>Phone:</b> <a href="tel:+91${cleanPhone}">+91 ${cleanPhone}</a>\n` +
          `📧 <b>Email:</b> ${escapeHtml(email.trim())}\n` +
          `📚 <b>Selected Track:</b> ${escapeHtml(course)}\n` +
          `💬 <b>Message:</b> ${escapeHtml(message.trim() || 'No additional notes')}\n\n` +
          `🕒 <b>Time:</b> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;

        const tgRes = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: tgChatId,
            text: textHtml,
            parse_mode: 'HTML'
          })
        });

        const tgData = await tgRes.json();
        console.log('Telegram Bot Alert dispatched:', tgData);
      } catch (err) {
        console.warn('Telegram notification failed:', err);
      }
    }

    // Optional Web3Forms dispatch if access key is present
    const web3Key = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    if (web3Key) {
      try {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: web3Key,
            from_name: 'DO PILOT Enrollment Bot',
            subject: `New Enrollment Application: ${name} (${course})`,
            name,
            email,
            phone: `+91 ${cleanPhone}`,
            course,
            message: message || 'N/A'
          })
        });
      } catch (err) {
        console.warn('Web3Forms notification skipped:', err);
      }
    }

    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setNameTouched(false);
      setEmailTouched(false);
      setPhoneTouched(false);
      setNameError(null);
      setEmailError(null);
      setPhoneError(null);
      onClose();
    }, 2200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
          {/* Backdrop Click Dismiss */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full max-w-[460px] max-h-[92vh] overflow-y-auto bg-[#0c0d0f] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative z-10 my-auto"
          >
            {/* Subtle Neon Corner Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.04] hover:bg-white/10 text-slate hover:text-paper border border-white/5 transition-all cursor-pointer z-10"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="mb-5">
              <h3 className="font-jakarta text-2xl font-black text-paper tracking-tight">
                Join DO PILOT
              </h3>
              <p className="font-sans text-xs text-slate mt-1 leading-relaxed">
                Fill in your details below. Our academic mentor will get in touch with you shortly.
              </p>
            </div>

            {submitted ? (
              /* Success Confirmation */
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 flex flex-col items-center justify-center text-center gap-3"
              >
                <div className="w-14 h-14 rounded-full bg-primary/15 border-2 border-primary text-primary flex items-center justify-center shadow-lg shadow-primary/20">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-jakarta font-black text-xl text-paper mt-1">
                  Application Received!
                </h4>
                <p className="font-sans text-xs text-slate max-w-xs leading-relaxed">
                  Thank you, <span className="text-paper font-semibold">{name}</span>. An academic advisor will reach out to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              /* Clean Minimal Form */
              <form onSubmit={handleSubmit} className="space-y-3 font-sans text-xs">
                {/* Full Name */}
                <div>
                  <label className="block font-mono text-[11px] text-slate mb-1 font-medium">
                    Your Full Name <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={name}
                      onChange={handleNameChange}
                      onBlur={handleNameBlur}
                      placeholder="e.g. Alex Rivera"
                      className={`w-full bg-white/[0.03] border ${
                        nameError
                          ? 'border-red-500/60 focus:border-red-500 bg-red-500/[0.02]'
                          : 'border-white/10 focus:border-primary/60 focus:bg-white/[0.05]'
                      } rounded-xl pl-9 pr-3.5 py-2.5 text-paper placeholder:text-slate/30 text-xs sm:text-sm focus:outline-none transition-all`}
                    />
                  </div>
                  {nameError && (
                    <p className="text-[10px] text-red-400 font-mono mt-1 flex items-center gap-1">
                      <span>•</span> {nameError}
                    </p>
                  )}
                </div>

                {/* Email & Phone Split */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-mono text-[11px] text-slate mb-1 font-medium">
                      Email Address <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        onBlur={handleEmailBlur}
                        placeholder="alex@example.com"
                        className={`w-full bg-white/[0.03] border ${
                          emailError
                            ? 'border-red-500/60 focus:border-red-500 bg-red-500/[0.02]'
                            : 'border-white/10 focus:border-primary/60 focus:bg-white/[0.05]'
                        } rounded-xl pl-9 pr-3 py-2.5 text-paper placeholder:text-slate/30 text-xs sm:text-sm focus:outline-none transition-all`}
                      />
                    </div>
                    {emailError && (
                      <p className="text-[10px] text-red-400 font-mono mt-1 flex items-center gap-1">
                        <span>•</span> {emailError}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] text-slate mb-1 font-medium">
                      Phone / WhatsApp <span className="text-primary">*</span>
                    </label>
                    <div className="relative flex">
                      <div className="flex items-center gap-1.5 px-2.5 py-2.5 bg-white/[0.04] border border-r-0 border-white/10 rounded-l-xl text-slate text-xs font-mono select-none shrink-0">
                        <Phone className="w-3 h-3 text-slate/50" />
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={handlePhoneChange}
                        onBlur={handlePhoneBlur}
                        placeholder="98765 43210"
                        className={`w-full bg-white/[0.03] border ${
                          phoneError
                            ? 'border-red-500/60 focus:border-red-500 bg-red-500/[0.02]'
                            : 'border-white/10 focus:border-primary/60 focus:bg-white/[0.05]'
                        } rounded-r-xl px-3 py-2.5 text-paper placeholder:text-slate/30 text-xs sm:text-sm focus:outline-none transition-all font-mono`}
                      />
                    </div>
                    {phoneError && (
                      <p className="text-[10px] text-red-400 font-mono mt-1 flex items-center gap-1">
                        <span>•</span> {phoneError}
                      </p>
                    )}
                  </div>
                </div>

                {/* Select Skill Track (Responsive Native Select) */}
                <div>
                  <label className="block font-mono text-[11px] text-slate mb-1 font-medium">
                    Select Skill Track / Class
                  </label>
                  <div className="relative">
                    <BookOpen className="w-3.5 h-3.5 text-primary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                    <select
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      className="w-full bg-[#12141a] border border-white/10 hover:border-white/25 focus:border-primary/60 focus:bg-[#161822] rounded-xl pl-9 pr-9 py-2.5 text-paper text-xs sm:text-sm font-jakarta font-semibold focus:outline-none transition-all cursor-pointer appearance-none"
                    >
                      {COURSE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#12141a] text-paper py-2">
                          {opt}
                        </option>
                      ))}
                      {!COURSE_OPTIONS.includes(course) && (
                        <option value={course} className="bg-[#12141a] text-paper py-2">
                          {course}
                        </option>
                      )}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                  </div>
                </div>

                {/* Message / Questions */}
                <div>
                  <label className="block font-mono text-[11px] text-slate mb-1 font-medium">
                    Message / Questions (Optional)
                  </label>
                  <div className="relative">
                    <MessageSquare className="w-3.5 h-3.5 text-slate/40 absolute left-3.5 top-3 pointer-events-none" />
                    <textarea
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us your current background or goals..."
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-paper placeholder:text-slate/30 text-xs sm:text-sm focus:outline-none focus:border-primary/60 focus:bg-white/[0.05] transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Submit Application Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3.5 px-6 rounded-xl bg-primary text-black font-jakarta font-extrabold text-xs sm:text-sm hover:bg-white hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Application'}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

