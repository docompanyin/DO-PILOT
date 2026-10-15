import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, CheckCircle2, ShieldCheck, LogOut, ArrowRight, 
  BookOpen, User, Phone, Compass, AlertCircle, Settings,
  GraduationCap
} from 'lucide-react';
import { useUserAuth, UserProfile } from '../../context/UserAuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { getUserInitials } from '../../utils/userInitials';

interface AuthPageProps {
  mode?: 'login' | 'signup';
}

declare global {
  interface Window {
    google?: any;
  }
}

export const AuthPage: React.FC<AuthPageProps> = ({ mode = 'login' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    user, 
    isLoggedIn, 
    loginWithGoogleCredential, 
    loginWithGoogleDirect, 
    loginWithTestGoogleAccount,
    completeOnboardingAndLogin,
    logout 
  } = useUserAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(mode);
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Pending Google profile waiting for minimal details
  const [pendingProfile, setPendingProfile] = useState<UserProfile | null>(null);

  // User details form fields
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formWhereDidYouFindUs, setFormWhereDidYouFindUs] = useState('');
  const [formCollege, setFormCollege] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fast Test Account toggle for quick testing
  const [useTestGoogleAccount, setUseTestGoogleAccount] = useState(true);

  const searchParams = new URLSearchParams(location.search);
  const redirectTarget = searchParams.get('redirect') || '/settings';

  // Sync tab with url or props
  useEffect(() => {
    if (location.pathname.includes('signup')) {
      setActiveTab('signup');
    } else {
      setActiveTab('login');
    }
  }, [location.pathname]);

  // Load Google Identity Services and setup One-Tap
  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!googleClientId) return;

    const initGsi = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (res: any) => {
            if (res.credential) {
              const profile = loginWithGoogleCredential(res.credential);
              if (profile) {
                handleProfileAcquired(profile);
              } else {
                setLoading(false);
                setErrorMsg('Failed to process Google credentials.');
              }
            }
          }
        });
      }
    };

    if (window.google?.accounts?.id) {
      initGsi();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          initGsi();
        }
      }, 150);
      return () => clearInterval(interval);
    }
  }, [loginWithGoogleCredential]);

  // Processes Google Profile: If already has details, log in directly. Otherwise, show details form.
  const handleProfileAcquired = (profile: UserProfile) => {
    setLoading(false);
    if (profile.hasCompletedDetails) {
      completeOnboardingAndLogin(profile);
      setLoginSuccess(true);
      setTimeout(() => navigate(redirectTarget), 1000);
    } else {
      // Prompt user for details
      setPendingProfile(profile);
      setFormName(profile.name || '');
      setFormPhone(profile.phone || '');
      setFormWhereDidYouFindUs(profile.whereDidYouFindUs || '');
      setFormCollege(profile.collegeOrCompany || '');
      setFormErrors({});

      // Record newly registered student immediately in Supabase so Admin Panel tracks them
      if (isSupabaseConfigured() && profile.email) {
        Promise.resolve(
          supabase.from('student_profiles').upsert({
            id: profile.id,
            email: profile.email,
            name: profile.name,
            avatar: profile.avatar,
            has_completed_details: false,
            enrolled_courses: profile.enrolledCourses || ['Complete Python Course'],
            joined_live_class: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        ).catch(() => {});
      }
    }
  };

  // Real Google OAuth Flow
  const handleRealGoogleAuth = () => {
    setLoading(true);
    setErrorMsg(null);

    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      setLoading(false);
      setErrorMsg('Google Client ID is not configured. Please set VITE_GOOGLE_CLIENT_ID in .env.');
      return;
    }

    if (!window.google?.accounts?.oauth2) {
      let attempts = 0;
      const checkInterval = setInterval(() => {
        attempts++;
        if (window.google?.accounts?.oauth2) {
          clearInterval(checkInterval);
          launchOAuthFlow(googleClientId);
        } else if (attempts > 20) {
          clearInterval(checkInterval);
          setLoading(false);
          setErrorMsg('Google services are still loading. Please check your internet connection or ad-blocker.');
        }
      }, 150);
      return;
    }

    launchOAuthFlow(googleClientId);
  };

  const launchOAuthFlow = (clientId: string) => {
    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'email profile openid',
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            setLoading(false);
            if (tokenResponse.error === 'access_denied') return;
            setErrorMsg(`Google Authentication Error: ${tokenResponse.error_description || tokenResponse.error}`);
            return;
          }

          if (tokenResponse && tokenResponse.access_token) {
            try {
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
              });

              if (!res.ok) {
                throw new Error(`Google UserInfo API responded with status ${res.status}`);
              }

              const info = await res.json();
              if (!info || !info.email) {
                throw new Error('No verified email returned from Google.');
              }

              const profile = loginWithGoogleDirect({
                id: info.sub,
                name: info.name || info.given_name || info.email.split('@')[0],
                email: info.email,
                avatar: info.picture
              });

              if (profile) {
                handleProfileAcquired(profile);
              }
              return;
            } catch (err: any) {
              console.error('Error fetching Google userinfo:', err);
              setLoading(false);
              setErrorMsg('Could not fetch your profile from Google. Please try again.');
              return;
            }
          }

          setLoading(false);
          setErrorMsg('No access token received from Google.');
        },
        error_callback: (err: any) => {
          setLoading(false);
          if (err.type === 'popup_closed') return;
          if (err.type === 'popup_failed_to_open') {
            setErrorMsg('Google Sign-In popup was blocked by your browser. Please allow popups for this site.');
            return;
          }
          setErrorMsg(`Google popup error: ${err.message || err.type || 'Please check Authorized JavaScript Origins in Google Console.'}`);
        }
      });

      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } catch (e: any) {
      console.error('Failed to initialize Google Token Client:', e);
      setLoading(false);
      setErrorMsg(`Could not connect to Google: ${e?.message || 'Unknown error'}`);
    }
  };

  // --- Fast Test Google Login Handler ---
  const handleTestGoogleLogin = () => {
    setLoading(true);
    setErrorMsg(null);
    setTimeout(() => {
      const profile = loginWithTestGoogleAccount('Bimal Kumar', 'bimal.kumar.test@gmail.com');
      handleProfileAcquired(profile);
    }, 300);
  };

  // Main Google button click handler
  const handleGoogleAuth = () => {
    if (useTestGoogleAccount) {
      handleTestGoogleLogin();
    } else {
      handleRealGoogleAuth();
    }
  };

  // Validate and submit minimal details form
  const handleSaveMinimalDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingProfile) return;

    const errors: Record<string, string> = {};
    const trimmedName = formName.trim();
    const digitsOnly = formPhone.replace(/\D/g, '');

    // Name validation: required, min 2 chars
    if (!trimmedName || trimmedName.length < 2) {
      errors.name = 'Please enter your full name (at least 2 characters).';
    } else if (!/^[a-zA-Z\s.'-]+$/.test(trimmedName)) {
      errors.name = 'Please enter a valid name using letters.';
    }

    // Phone validation: EXACTLY 10 digits only
    if (!formPhone) {
      errors.phone = 'Phone number is required.';
    } else if (digitsOnly.length !== 10) {
      errors.phone = 'Phone number must be exactly 10 digits.';
    }

    // College / Organization validation: COMPULSORY
    const trimmedCollege = formCollege.trim();
    if (!trimmedCollege || trimmedCollege.length < 2) {
      errors.college = 'College/University or Company name is required.';
    }

    // Where did you find us: COMPULSORY
    const trimmedSource = formWhereDidYouFindUs.trim();
    if (!trimmedSource) {
      errors.whereDidYouFindUs = 'Please select where you found us.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Validation passed: Complete registration and log in
    const finalizedUser: UserProfile = {
      ...pendingProfile,
      name: trimmedName,
      phone: digitsOnly,
      whereDidYouFindUs: trimmedSource,
      collegeOrCompany: trimmedCollege,
      hasCompletedDetails: true,
      enrolledCourses: pendingProfile.enrolledCourses?.length ? pendingProfile.enrolledCourses : ['Complete Python Course']
    };

    completeOnboardingAndLogin(finalizedUser);
    setPendingProfile(null);
    setLoginSuccess(true);
    setTimeout(() => {
      navigate(redirectTarget);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-paper relative flex flex-col justify-between selection:bg-primary selection:text-ink overflow-hidden select-none">
      
      {/* Background Radial Glow Spotlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[450px] pointer-events-none z-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-tr from-primary/30 via-secondary/20 to-transparent blur-[140px] rounded-full" />
      </div>

      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Top Bar Navigation */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 sm:py-8 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate hover:text-primary transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to DO PILOT</span>
        </button>

        <a
          href="/"
          onClick={(e) => { e.preventDefault(); navigate('/'); }}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <img
            src="https://res.cloudinary.com/ufo0zltq/image/upload/v1786197046/Do_PNG_ssyhu1.png"
            alt="DO PILOT"
            className="h-7 w-auto object-contain shrink-0 rounded-md"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
          <span className="font-jakarta text-sm font-black tracking-wider text-paper uppercase">
            DO PILOT
          </span>
        </a>
      </header>

      {/* Center Auth / Profile Card */}
      <main className={`relative z-10 w-full mx-auto px-4 my-auto transition-all duration-300 ${pendingProfile && !loginSuccess ? 'max-w-2xl sm:max-w-3xl' : 'max-w-md'}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`rounded-3xl bg-panel border border-white/15 shadow-2xl backdrop-blur-xl relative overflow-hidden ${
            pendingProfile && !loginSuccess ? 'p-5 sm:p-7' : 'p-6 sm:p-8'
          }`}
        >
          {/* Top Corner Glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

          {/* STEP 1: Minimal Details Form after Google Auth */}
          {pendingProfile && !loginSuccess ? (
            <div className="space-y-4">
              {/* Form Header */}
              <div className="pb-3 border-b border-white/10">
                <h3 className="font-jakarta text-xl sm:text-2xl font-black text-paper">
                  Complete Student Profile
                </h3>
                <p className="text-slate text-xs font-sans mt-0.5">
                  Please enter your contact details below to activate your student workspace.
                </p>
              </div>

              {/* Minimal Form: 2-column wide grid, decreased height, all compulsory */}
              <form onSubmit={handleSaveMinimalDetails} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name - Compulsory */}
                  <div className="space-y-1">
                    <label className="block font-jakarta font-bold text-xs text-paper">
                      Full Legal Name <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate/50" />
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => {
                          setFormName(e.target.value);
                          if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                        }}
                        placeholder="e.g. Rahul Sharma"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border text-paper font-jakarta text-sm placeholder:text-slate/40 focus:outline-none transition-colors ${
                          formErrors.name ? 'border-rose-500 focus:border-rose-400' : 'border-white/15 focus:border-primary'
                        }`}
                      />
                    </div>
                    {formErrors.name && (
                      <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{formErrors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone Number: 10 Digits Only - Compulsory */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block font-jakarta font-bold text-xs text-paper">
                        Phone Number <span className="text-rose-400">*</span>
                      </label>
                      <span className="text-[10px] font-mono text-slate/50">10 digits only</span>
                    </div>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate/50" />
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={formPhone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setFormPhone(val);
                          if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                        }}
                        placeholder="10-digit mobile number"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border text-paper font-jakarta text-sm placeholder:text-slate/40 focus:outline-none transition-colors tracking-wide ${
                          formErrors.phone ? 'border-rose-500 focus:border-rose-400' : 'border-white/15 focus:border-primary'
                        }`}
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{formErrors.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* College / Organization - Compulsory */}
                  <div className="space-y-1">
                    <label className="block font-jakarta font-bold text-xs text-paper">
                      College / University or Company <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate/50" />
                      <input
                        type="text"
                        value={formCollege}
                        onChange={(e) => {
                          setFormCollege(e.target.value);
                          if (formErrors.college) setFormErrors({ ...formErrors, college: '' });
                        }}
                        placeholder="e.g. IIT Madras, Anna University, TCS"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border text-paper font-jakarta text-sm placeholder:text-slate/40 focus:outline-none transition-colors ${
                          formErrors.college ? 'border-rose-500 focus:border-rose-400' : 'border-white/15 focus:border-primary'
                        }`}
                      />
                    </div>
                    {formErrors.college && (
                      <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{formErrors.college}</span>
                      </p>
                    )}
                  </div>

                  {/* Where did you find us? - Compulsory */}
                  <div className="space-y-1">
                    <label className="block font-jakarta font-bold text-xs text-paper">
                      Where did you find us? <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Compass className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate/50 pointer-events-none" />
                      <select
                        value={formWhereDidYouFindUs}
                        onChange={(e) => {
                          setFormWhereDidYouFindUs(e.target.value);
                          if (formErrors.whereDidYouFindUs) setFormErrors({ ...formErrors, whereDidYouFindUs: '' });
                        }}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border text-paper font-jakarta text-sm focus:outline-none transition-colors cursor-pointer appearance-none ${
                          formErrors.whereDidYouFindUs ? 'border-rose-500 focus:border-rose-400' : 'border-white/15 focus:border-primary'
                        }`}
                      >
                        <option value="">Select an option</option>
                        <option value="Instagram">Instagram</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="YouTube">YouTube</option>
                        <option value="Google Search">Google Search</option>
                        <option value="Friend / Colleague Recommendation">Friend / Colleague Recommendation</option>
                        <option value="Campus / College Event">Campus / College Event</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    {formErrors.whereDidYouFindUs && (
                      <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{formErrors.whereDidYouFindUs}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Complete &amp; Enter Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          ) : isLoggedIn && user && !loginSuccess ? (
            /* STEP 2: Already Logged In View with Link to Settings */
            <div className="text-center py-2 space-y-6">
              <div className="relative inline-block mx-auto">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/25 via-primary/15 to-primary/5 border-2 border-primary text-primary flex items-center justify-center font-jakarta font-black text-2xl tracking-wider mx-auto shadow-lg shadow-primary/20">
                  {getUserInitials(user.name)}
                </div>
                <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-primary border-2 border-black flex items-center justify-center text-[10px] text-ink font-bold">
                  ✓
                </span>
              </div>

              <div>
                <span className="font-mono text-[10px] text-primary font-bold uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  ACTIVE STUDENT SESSION
                </span>
                <h3 className="font-jakarta text-2xl font-black text-paper mt-2.5">
                  {user.name}
                </h3>
                <p className="font-mono text-xs text-slate mt-0.5">{user.email}</p>
                {user.phone && (
                  <p className="font-mono text-xs text-slate/70 mt-1">
                    Phone: {user.phone}
                  </p>
                )}
              </div>

              {/* Action Buttons to Settings */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/settings')}
                  className="w-full py-3.5 px-4 rounded-xl bg-primary text-ink font-jakarta font-extrabold text-xs tracking-wide hover:bg-white hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                  <span>Open User Settings &amp; Course Progress</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/course/python-core')}
                  className="w-full py-3 px-4 rounded-xl bg-panel-light border border-white/10 text-paper font-jakarta font-bold text-xs hover:border-primary/40 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span>Continue Python Course</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="w-full py-2.5 px-4 text-xs font-mono text-slate hover:text-red-400 transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : loginSuccess ? (
            /* Instant Login Success Animation */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-10 text-center flex flex-col items-center justify-center gap-3"
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-primary shadow-xl shadow-primary/30 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-jakarta text-2xl font-black text-paper mt-2">
                Welcome to DO PILOT!
              </h3>
              <p className="font-mono text-xs text-slate">
                Redirecting to your student dashboard...
              </p>
            </motion.div>
          ) : (
            /* Standard Login / Signup Initial View */
            <div className="space-y-6">
              <div className="text-center space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs font-bold mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Official DO PILOT Student Portal</span>
                </div>
                <h2 className="font-jakarta text-2xl sm:text-3xl font-black text-paper tracking-tight">
                  {activeTab === 'login' ? 'Sign In to Your Account' : 'Create Your Student Account'}
                </h2>
                <p className="text-slate text-xs sm:text-sm font-sans">
                  Sign in with Google to access your courses, track MCQ scores, and claim verified certificates.
                </p>
              </div>

              {/* Fast Test Account Mode Pill */}
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-slate">Login Mode:</span>
                  <span className="text-paper font-bold">
                    {useTestGoogleAccount ? '⚡ 1-Click Fast Google' : '🌐 Real Google OAuth'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setUseTestGoogleAccount(!useTestGoogleAccount)}
                  className="text-[11px] text-primary hover:underline cursor-pointer"
                >
                  Switch
                </button>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-slate-100 text-black font-jakarta font-extrabold text-sm tracking-wide transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-50"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{loading ? 'Authenticating...' : 'Continue with Google'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <p className="text-center text-[11px] font-mono text-slate/50">
                By continuing, you agree to DO PILOT Academic Guidelines and Honor Code.
              </p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default AuthPage;
