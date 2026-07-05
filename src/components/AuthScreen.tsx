import React, { useState, useEffect } from 'react';
import { Lock, Mail, User as UserIcon, BookOpen, GraduationCap, ArrowRight, ShieldCheck, AlertCircle, Sparkles, RefreshCw, Check } from 'lucide-react';
import { Course } from '../types';

interface AuthScreenProps {
  view: 'login' | 'signup' | 'verify';
  setView: (view: 'login' | 'signup' | 'verify') => void;
  courses: Course[];
  onSuccess: (token: string, user: any) => void;
  onCancel: () => void;
  preselectedCourseId: string | null;
}

export default function AuthScreen({
  view,
  setView,
  courses,
  onSuccess,
  onCancel,
  preselectedCourseId
}: AuthScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Simulated email dispatch notification variables for developers & testers
  const [simulatedCode, setSimulatedCode] = useState<string | null>(null);

  // Initialize selected course if preselected is provided
  useEffect(() => {
    if (preselectedCourseId) {
      setSelectedCourseIds([preselectedCourseId]);
    } else if (courses.length > 0 && selectedCourseIds.length === 0) {
      // Default to first course if none preselected for safety
      setSelectedCourseIds([courses[0].id]);
    }
  }, [preselectedCourseId, courses]);

  const handleCourseToggle = (courseId: string) => {
    setErrorMsg(null);
    if (selectedCourseIds.includes(courseId)) {
      // Prevent unselecting if it's the only one selected
      if (selectedCourseIds.length === 1) {
        setErrorMsg('At least one course must be selected to complete your registration.');
        return;
      }
      setSelectedCourseIds(selectedCourseIds.filter(id => id !== courseId));
    } else {
      setSelectedCourseIds([...selectedCourseIds, courseId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (view === 'signup') {
        if (selectedCourseIds.length === 0) {
          throw new Error('Please select at least one course to register in.');
        }

        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            password,
            registeredCourseIds: selectedCourseIds
          })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Registration failed.');
        }

        // Redirect user to the verification view and display simulated verification code
        setSimulatedCode(data.verificationCode);
        setSuccessMsg(`Account created! A simulated verification email was dispatched to ${email}.`);
        setView('verify');
      } else if (view === 'login') {
        // Log in flow
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (!res.ok) {
          // Check if unverified redirection is required
          if (res.status === 403 && data.requiresVerification) {
            setSimulatedCode(data.verificationCode);
            setErrorMsg('Email verification required before accessing your account.');
            setView('verify');
            return;
          }
          throw new Error(data.error || 'Authentication failed.');
        }

        onSuccess(data.token, data.user);
      } else if (view === 'verify') {
        // Verification code check
        const res = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            code: verificationCode.trim()
          })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Verification failed.');
        }

        // Successfully verified and automatically logged in
        onSuccess(data.token, data.user);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to resend code.');
      }

      setSimulatedCode(data.verificationCode);
      setSuccessMsg('A fresh verification code was sent to your email.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not resend code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-black/40 animate-fade-in">
      <div className="w-full max-w-2xl bg-[#0d0d0d] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
        
        {/* Title Block */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 animate-pulse">
            {view === 'verify' ? <ShieldCheck className="h-6 w-6" /> : <GraduationCap className="h-6 w-6" />}
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-white uppercase">
            {view === 'signup' && 'Create Your Student Record'}
            {view === 'login' && 'Sign In to Aura Classroom'}
            {view === 'verify' && 'Verify Your Email Address'}
          </h2>
          <p className="text-xs text-white/50 max-w-md mx-auto">
            {view === 'signup' && 'Establish your learner credentials and register for your first curriculum programs.'}
            {view === 'login' && 'Enter your student credentials to access your course study dashboard.'}
            {view === 'verify' && `Please enter the 6-digit confirmation code dispatched to ${email || 'your registered email'}.`}
          </p>
        </div>

        {/* Development Helper Card to reveal Simulated Email Codes */}
        {simulatedCode && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                Simulated Email Server [Active Sandbox]
              </span>
              <span className="text-[9px] text-white/35 font-mono">localhost:smtp_delivery</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 border-t border-white/5">
              <p className="text-xs text-white/60">
                Inbox dispatch sent code: <strong className="font-mono text-emerald-300 font-extrabold text-sm ml-1 select-all">{simulatedCode}</strong>
              </p>
              <button
                type="button"
                onClick={() => {
                  setVerificationCode(simulatedCode);
                  setSuccessMsg('Code auto-filled into verification box!');
                }}
                className="rounded-lg bg-emerald-400/10 border border-emerald-400/20 hover:bg-emerald-400/20 text-emerald-400 font-bold text-[10px] uppercase tracking-wide px-2.5 py-1.5 transition-all cursor-pointer"
              >
                Auto-fill Code
              </button>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 flex items-start gap-2.5 text-xs font-semibold text-rose-400 animate-fade-in">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 flex items-start gap-2.5 text-xs font-semibold text-emerald-400 animate-fade-in">
            <Check className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {view !== 'verify' ? (
            <div className="space-y-4">
              {view === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/60">Full Name *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => { setErrorMsg(null); setName(e.target.value); }}
                      placeholder="Elena Rivera"
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none placeholder-white/20 transition-all focus:ring-1 focus:ring-indigo-500"
                    />
                    <UserIcon className="absolute left-3.5 top-3 h-4 w-4 text-white/30" />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/60">Email Address *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => { setErrorMsg(null); setEmail(e.target.value); }}
                    placeholder="student@example.com"
                    className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none placeholder-white/20 transition-all focus:ring-1 focus:ring-indigo-500"
                  />
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-white/30" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/60">Secure Password *</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => { setErrorMsg(null); setPassword(e.target.value); }}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none placeholder-white/20 transition-all focus:ring-1 focus:ring-indigo-500"
                  />
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-white/30" />
                </div>
              </div>
            </div>
          ) : (
            /* Verification Code Entry Form */
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider block text-center">6-Digit Verification Code</label>
                <div className="flex justify-center">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    pattern="[0-9]*"
                    value={verificationCode}
                    onChange={(e) => {
                      setErrorMsg(null);
                      setVerificationCode(e.target.value.replace(/\D/g, ''));
                    }}
                    placeholder="123456"
                    className="w-48 text-center rounded-2xl border border-white/15 bg-white/5 py-3 text-lg font-mono tracking-[0.35em] text-white font-extrabold focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder-white/10"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Core Registration Module Section (Signup Only) */}
          {view === 'signup' && (
            <div className="space-y-3.5 pt-4 border-t border-white/5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-indigo-400" /> Start-Up Course Registration
                </h3>
                <p className="text-[10px] text-white/40 leading-normal mt-0.5">
                  🔒 Curriculum select: Handpick the course(s) to automatically bind and register for upon email verification.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1">
                {courses.map((course) => {
                  const isSelected = selectedCourseIds.includes(course.id);
                  return (
                    <div
                      key={course.id}
                      onClick={() => handleCourseToggle(course.id)}
                      className={`group cursor-pointer rounded-2xl border p-4 transition-all text-left flex flex-col justify-between space-y-4 ${
                        isSelected 
                          ? 'bg-indigo-600/10 border-indigo-500 text-white' 
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">{course.category}</span>
                          <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-all ${
                            isSelected ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-white/25 group-hover:border-white/40'
                          }`}>
                            {isSelected && <span className="text-[10px] font-bold">✓</span>}
                          </div>
                        </div>
                        <h4 className="text-xs font-bold leading-snug mt-1.5 line-clamp-2">{course.title}</h4>
                      </div>
                      <div className="flex items-center justify-between pt-2.5 border-t border-white/5">
                        <span className="text-[10px] text-white/40">Included Tuition</span>
                        <span className="text-xs font-mono font-bold text-indigo-300">${course.price}.00</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Form Trigger Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3.5 transition-all cursor-pointer shadow-lg active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Verifying Handshake Credentials...
              </span>
            ) : (
              <>
                {view === 'signup' && 'Create Account & Dispatch Code'}
                {view === 'login' && 'Enter Classroom Dashboard'}
                {view === 'verify' && 'Complete Verification & Enter Classroom'}
                {view !== 'verify' && <ArrowRight className="h-4 w-4" />}
              </>
            )}
          </button>
        </form>

        {/* Resend option (Only verify view) */}
        {view === 'verify' && (
          <div className="flex items-center justify-center gap-2 text-xs">
            <span className="text-white/40">Didn't receive code?</span>
            <button
              type="button"
              disabled={loading}
              onClick={handleResendCode}
              className="font-bold text-indigo-400 hover:text-indigo-300 hover:underline transition-all cursor-pointer disabled:opacity-50"
            >
              Resend Verification Code
            </button>
          </div>
        )}

        {/* Footer toggling links */}
        <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <button
            type="button"
            onClick={onCancel}
            className="hover:text-white transition-colors cursor-pointer"
          >
            ← Back to Public Course Catalog
          </button>

          <p>
            {view === 'signup' && (
              <>
                Already possess a student record?
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setSuccessMsg(null);
                    setView('login');
                  }}
                  className="ml-1.5 font-bold text-indigo-400 hover:text-indigo-300 hover:underline transition-all cursor-pointer"
                >
                  Sign In
                </button>
              </>
            )}
            {view === 'login' && (
              <>
                New learner on this platform?
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setSuccessMsg(null);
                    setView('signup');
                  }}
                  className="ml-1.5 font-bold text-indigo-400 hover:text-indigo-300 hover:underline transition-all cursor-pointer"
                >
                  Sign Up & Register
                </button>
              </>
            )}
            {view === 'verify' && (
              <>
                Entered wrong email address?
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setSuccessMsg(null);
                    setView('signup');
                  }}
                  className="ml-1.5 font-bold text-indigo-400 hover:text-indigo-300 hover:underline transition-all cursor-pointer"
                >
                  Restart Sign Up
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
