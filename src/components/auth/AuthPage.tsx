import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, CheckCircle2, LogOut, ArrowRight, 
  BookOpen, User, Phone, Compass, AlertCircle, Settings,
  GraduationCap, ShieldCheck
} from 'lucide-react';
import { useUserAuth, UserProfile } from '../../context/UserAuthContext';
import { getUserInitials } from '../../utils/userInitials';
import successAnimationData from '../../assets/Success.json';
import { markAppLoaded } from '../../App';

interface AuthPageProps {
  mode?: 'login' | 'signup';
}

declare global {
  interface Window {
    google?: any;
    lottie?: any;
  }
}

const SuccessLottie: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<any>(null);

  useEffect(() => {
    let isCancelled = false;

    const play = (lottieInstance: any) => {
      if (!containerRef.current || isCancelled) return;
      try {
        const anim = lottieInstance.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop: false,
          autoplay: true,
          animationData: successAnimationData,
        });
        animRef.current = anim;
        anim.setSpeed(1.2);
        anim.addEventListener('complete', () => {
          if (!isCancelled) onComplete();
        });
      } catch (err) {
        console.error('Lottie play error:', err);
        setTimeout(onComplete, 2200);
      }
    };

    if (window.lottie) {
      play(window.lottie);
    } else {
      const poll = setInterval(() => {
        if (window.lottie) {
          clearInterval(poll);
          play(window.lottie);
        }
      }, 50);

      const safetyTimer = setTimeout(() => {
        clearInterval(poll);
        if (!isCancelled) onComplete();
      }, 4000);

      return () => {
        isCancelled = true;
        clearInterval(poll);
        clearTimeout(safetyTimer);
        if (animRef.current) {
          try { animRef.current.destroy(); } catch {}
        }
      };
    }

    const fallbackTimeout = setTimeout(() => {
      if (!isCancelled) onComplete();
    }, 4500);

    return () => {
      isCancelled = true;
      clearTimeout(fallbackTimeout);
      if (animRef.current) {
        try { animRef.current.destroy(); } catch {}
      }
    };
  }, [onComplete]);

  return (
    <div 
      ref={containerRef} 
      className="w-72 h-72 sm:w-96 sm:h-96 md:w-[420px] md:h-[420px] flex items-center justify-center pointer-events-none" 
    />
  );
};

export const AuthPage: React.FC<AuthPageProps> = ({ mode = 'login' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    user, 
    pendingUser,
    isLoggedIn, 
    isPendingRegistration,
    loginWithGoogleCredential, 
    loginWithGoogleDirect, 
    completeOnboardingAndLogin,
    clearPendingRegistration,
    logout 
  } = useUserAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(mode);
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const searchParams = new URLSearchParams(location.search);
  const redirectTarget = searchParams.get('redirect') || '/';

  useEffect(() => {
    markAppLoaded();
    // If the user is already authenticated with completed details, redirect them directly
    if (isLoggedIn && user && !loginSuccess) {
      navigate(redirectTarget, { replace: true });
    }
  }, [isLoggedIn, user, loginSuccess, navigate, redirectTarget]);

  const handleAnimationComplete = useCallback(() => {
    markAppLoaded();
    navigate('/', { replace: true });
  }, [navigate]);

  // Active pending user requiring registration completion
  const activePending = pendingUser || (user && !user.hasCompletedDetails ? user : null);

  // User details form fields
  const [formName, setFormName] = useState(activePending?.name || '');
  const [formPhone, setFormPhone] = useState(activePending?.phone || '');
  const [formWhereDidYouFindUs, setFormWhereDidYouFindUs] = useState(activePending?.whereDidYouFindUs || '');
  const [formCollege, setFormCollege] = useState(activePending?.collegeOrCompany || '');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Sync tab with url or props
  useEffect(() => {
    if (location.pathname.includes('signup')) {
      setActiveTab('signup');
    } else {
      setActiveTab('login');
    }
  }, [location.pathname]);

  // Keep form fields synced if activePending changes
  useEffect(() => {
    if (activePending) {
      if (!formName && activePending.name) setFormName(activePending.name);
      if (!formPhone && activePending.phone) setFormPhone(activePending.phone);
      if (!formCollege && activePending.collegeOrCompany) setFormCollege(activePending.collegeOrCompany);
      if (!formWhereDidYouFindUs && activePending.whereDidYouFindUs) setFormWhereDidYouFindUs(activePending.whereDidYouFindUs);
    }
  }, [activePending]);

  // Handler for successful profile acquisition from Google (either token or credential)
  const handleProfileAcquired = useCallback(async (profile: UserProfile | null) => {
    setLoading(false);
    if (!profile) {
      setErrorMsg('Could not process Google profile. Please try again.');
      return;
    }

    if (profile.hasCompletedDetails) {
      // Existing registered student: Show success animation, redirect happens on completion
      setLoginSuccess(true);
    } else {
      // New or incomplete student: Show registration form
      setFormName(profile.name || '');
      setFormPhone(profile.phone || '');
      setFormCollege(profile.collegeOrCompany || '');
      setFormWhereDidYouFindUs(profile.whereDidYouFindUs || '');
      setFormErrors({});
      setErrorMsg(null);
    }
  }, [navigate, redirectTarget]);

  // Handle URL redirect callback (e.g. mobile browsers returning via URL hash or query params)
  useEffect(() => {
    const handleUrlCallback = async () => {
      // Check for OAuth hash tokens: #access_token=...
      if (window.location.hash && window.location.hash.includes('access_token=')) {
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        const token = hashParams.get('access_token');
        if (token) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
          setLoading(true);
          try {
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
              const info = await res.json();
              if (info && info.email) {
                const profile = await loginWithGoogleDirect({
                  id: info.sub,
                  name: info.name || info.given_name || info.email.split('@')[0],
                  email: info.email,
                  avatar: info.picture
                });
                await handleProfileAcquired(profile);
                return;
              }
            }
          } catch (e) {
            console.error('Failed to parse URL hash access_token:', e);
            setErrorMsg('Could not verify Google authentication redirect.');
          } finally {
            setLoading(false);
          }
        }
      }

      // Check for URL query error or credential
      const params = new URLSearchParams(window.location.search);
      const urlError = params.get('error');
      if (urlError) {
        setErrorMsg(`Google Sign-In was cancelled or rejected: ${urlError}`);
        params.delete('error');
        window.history.replaceState(null, '', window.location.pathname + (params.toString() ? `?${params.toString()}` : ''));
      }
    };

    handleUrlCallback();
  }, [loginWithGoogleDirect, handleProfileAcquired]);

  // Load Google Identity Services One-Tap
  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!googleClientId) return;

    const initGsi = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (res: any) => {
            if (res.credential) {
              setLoading(true);
              const profile = await loginWithGoogleCredential(res.credential);
              await handleProfileAcquired(profile);
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
  }, [loginWithGoogleCredential, handleProfileAcquired]);

  // Real Google OAuth Flow via Token Client
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
          setErrorMsg('Google authentication services are still loading. Please check your internet connection or ad-blocker.');
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
            if (tokenResponse.error === 'access_denied') {
              setErrorMsg('Sign-in cancelled. Please allow account access to continue.');
              return;
            }
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

              const profile = await loginWithGoogleDirect({
                id: info.sub,
                name: info.name || info.given_name || info.email.split('@')[0],
                email: info.email,
                avatar: info.picture
              });

              await handleProfileAcquired(profile);
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
          if (err.type === 'popup_closed') {
            setErrorMsg('Sign-in popup was closed before completion. Tap "Continue with Google" to try again.');
            return;
          }
          if (err.type === 'popup_failed_to_open') {
            setErrorMsg('Google Sign-In popup was blocked by your browser. Please allow popups for this site.');
            return;
          }
          setErrorMsg(`Google Sign-In error: ${err.message || err.type || 'Connection failed'}`);
        }
      });

      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } catch (e: any) {
      console.error('Failed to initialize Google Token Client:', e);
      setLoading(false);
      setErrorMsg(`Could not connect to Google: ${e?.message || 'Unknown error'}`);
    }
  };

  // Validate and submit registration form
  const handleSaveRegistrationDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePending) return;

    const errors: Record<string, string> = {};
    const trimmedName = formName.trim();
    const digitsOnly = formPhone.replace(/\D/g, '');

    // Name validation
    if (!trimmedName || trimmedName.length < 2) {
      errors.name = 'Please enter your full name (at least 2 characters).';
    } else if (!/^[a-zA-Z\s.'-]+$/.test(trimmedName)) {
      errors.name = 'Please enter a valid legal name using letters.';
    }

    // Phone validation: EXACTLY 10 digits
    if (!formPhone) {
      errors.phone = 'Phone number is required.';
    } else if (digitsOnly.length !== 10) {
      errors.phone = 'Phone number must be exactly 10 digits.';
    }

    // College / Organization
    const trimmedCollege = formCollege.trim();
    if (!trimmedCollege || trimmedCollege.length < 2) {
      errors.college = 'College / University or Company name is required.';
    }

    // Where did you find us
    if (!formWhereDidYouFindUs) {
      errors.whereDidYouFindUs = 'Please select how you heard about DO PILOT.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const updatedProfile: UserProfile = {
      ...activePending,
      name: trimmedName,
      phone: digitsOnly,
      collegeOrCompany: trimmedCollege,
      whereDidYouFindUs: formWhereDidYouFindUs,
      hasCompletedDetails: true
    };

    const result = await completeOnboardingAndLogin(updatedProfile);
    setLoading(false);

    if (!result.success) {
      setErrorMsg(result.error || 'Failed to complete registration. Please try again.');
      return;
    }

    // Show success animation, redirect happens on completion
    setLoginSuccess(true);
  };

  // Switch Google account handler (cancels current pending session)
  const handleCancelPending = () => {
    clearPendingRegistration();
    setFormName('');
    setFormPhone('');
    setFormCollege('');
    setFormWhereDidYouFindUs('');
    setFormErrors({});
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-black text-paper flex flex-col justify-between selection:bg-primary selection:text-ink relative overflow-hidden">
      {/* Full-Screen Login Success Animation (Success.json) */}
      <AnimatePresence>
        {loginSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl overflow-hidden pointer-events-none select-none"
          >
            <div className="relative flex items-center justify-center">
              <SuccessLottie onComplete={handleAnimationComplete} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Ambience Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-primary/[0.07] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-500/[0.04] blur-[120px] rounded-full pointer-events-none" />

      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Top Bar Navigation - Back button on extreme left */}
      <header className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-start">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-slate hover:text-primary transition-colors cursor-pointer group"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>
      </header>

      {/* Center Auth / Profile Card */}
      <main className={`relative z-10 w-full mx-auto px-4 my-auto transition-all duration-300 ${activePending && !loginSuccess ? 'max-w-xl sm:max-w-2xl' : 'max-w-md'}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`rounded-3xl bg-panel border border-white/15 shadow-2xl backdrop-blur-xl relative overflow-hidden ${
            activePending && !loginSuccess 
              ? 'p-5 sm:p-7' 
              : 'min-h-[440px] sm:min-h-0 py-8 px-6 sm:p-8 flex flex-col justify-center sm:block'
          }`}
        >
          {/* Top Corner Glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

          {/* STEP 1: Registration Form (Shown whenever registration is pending) */}
          {activePending && !loginSuccess ? (
            <div className="space-y-4">
              {/* Form Header */}
              <div className="pb-3 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-jakarta text-xl sm:text-2xl font-black text-paper">
                    Complete Student Registration
                  </h3>
                  <p className="text-slate text-xs font-sans mt-0.5">
                    Finish your registration to activate your student workspace.
                  </p>
                </div>
                {activePending.email && (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs self-start sm:self-auto">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="font-mono text-xs text-white">{activePending.email}</span>
                  </div>
                )}
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Minimal Form: 2-column wide grid */}
              <form onSubmit={handleSaveRegistrationDetails} className="space-y-4">
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

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-primary hover:bg-white text-ink font-jakarta font-extrabold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{loading ? 'Saving Registration...' : 'Complete & Enter Workspace'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={handleCancelPending}
                      className="text-xs font-jakarta font-medium text-white hover:opacity-70 transition-opacity cursor-pointer"
                    >
                      Switch Google account
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : loginSuccess ? (
            <div className="py-16" />
          ) : (
            /* Standard Login / Signup Initial View */
            <div className="space-y-6">
              {/* Brand Emblem & Header */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 shadow-inner">
                  <img
                    src="https://res.cloudinary.com/ufo0zltq/image/upload/v1786197046/Do_PNG_ssyhu1.png"
                    alt="DO PILOT"
                    className="h-6 w-auto object-contain"
                  />
                </div>
                <div>
                  <h2 className="font-jakarta text-2xl font-bold text-paper tracking-tight">
                    {activeTab === 'login' ? 'Welcome back' : 'Create your account'}
                  </h2>
                  <p className="text-slate text-xs font-sans mt-1">
                    {activeTab === 'login'
                      ? 'Sign in to access your courses and workspace'
                      : 'Join DO PILOT to start your engineering journey'}
                  </p>
                </div>
              </div>

              {/* Segmented Tab Switch */}
              <div className="grid grid-cols-2 p-1 bg-black/40 rounded-xl border border-white/10 text-xs font-jakarta font-semibold">
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); navigate('/login', { replace: true }); setErrorMsg(null); }}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'login' 
                      ? 'bg-primary text-black font-bold shadow-sm' 
                      : 'text-slate hover:text-paper'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('signup'); navigate('/signup', { replace: true }); setErrorMsg(null); }}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'signup' 
                      ? 'bg-primary text-black font-bold shadow-sm' 
                      : 'text-slate hover:text-paper'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Genuine Google OAuth Button */}
              <button
                type="button"
                onClick={handleRealGoogleAuth}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-black font-jakarta font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-50 active:scale-[0.99]"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{loading ? 'Connecting...' : (activeTab === 'login' ? 'Continue with Google' : 'Sign up with Google')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform ml-auto" />
              </button>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Security & Trust Row - Minimalist, Professional */}
              <div className="pt-2 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-center gap-2 text-xs text-slate/70">
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                  <span>Secured by Google</span>
                </div>

                <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-slate/40">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>256-bit SSL</span>
                  </span>
                  <span>•</span>
                  <span>Zero Password Storage</span>
                </div>

                <p className="text-center text-[11px] text-slate/50 leading-relaxed pt-1">
                  By continuing, you agree to our{' '}
                  <span className="text-slate/70 hover:underline cursor-pointer">Terms of Service</span> and{' '}
                  <span className="text-slate/70 hover:underline cursor-pointer">Privacy Policy</span>.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default AuthPage;
