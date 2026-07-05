import React, { useState } from 'react';
import { CreditCard, Lock, ArrowLeft, Loader2, CheckCircle, Info } from 'lucide-react';
import { Course } from '../types';

interface CheckoutSandboxProps {
  course: Course;
  onCancel: () => void;
  onSuccess: (cardBrand: string, last4: string) => void;
}

export default function CheckoutSandbox({ course, onCancel, onSuccess }: CheckoutSandboxProps) {
  const [email, setEmail] = useState('ameerhamzamalik19@gmail.com');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('Elena Rivera');
  
  const [loadingState, setLoadingState] = useState<'idle' | 'submitting' | 'processing' | 'verifying' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const fillDemoData = () => {
    setCardNumber('4242 4242 4242 4242');
    setExpiry('12/28');
    setCvc('422');
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !cardNumber || !expiry || !cvc || !cardName) {
      setErrorMsg('Please complete all transaction fields.');
      return;
    }

    if (cardNumber.replace(/\s/g, '') !== '4242424242424242') {
      setErrorMsg('Invalid test card number. Use 4242 4242 4242 4242.');
      return;
    }

    setErrorMsg('');
    setLoadingState('submitting');

    // Simulate Stripe payment gateway latency
    setTimeout(() => {
      setLoadingState('processing');
    }, 800);

    setTimeout(() => {
      setLoadingState('verifying');
    }, 1800);

    setTimeout(() => {
      setLoadingState('success');
    }, 2800);

    setTimeout(() => {
      const cardBrand = 'visa';
      const last4 = cardNumber.slice(-4);
      onSuccess(cardBrand, last4);
    }, 3600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md overflow-y-auto py-6 md:py-12 px-4 flex justify-center items-start md:items-center">
      <div 
        className="w-full max-w-4xl bg-[#0d0d0d] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px] border border-white/10 animate-fade-in my-auto"
        id="stripe-sandbox-modal"
      >
        {/* Left column: Order summary (Stripe aesthetic) */}
        <div className="md:col-span-5 bg-[#141414] border-r border-white/5 p-6 md:p-8 flex flex-col justify-between">
          <div>
            {/* Back button */}
            <button 
              onClick={onCancel}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/40 hover:text-white transition-colors mb-8 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Aura Academy
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-sm tracking-tight text-white/40">AURA ACADEMY</span>
                <span className="rounded bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-bold text-indigo-400 px-1.5 py-0.5 uppercase">Stripe Sandbox</span>
              </div>

              {/* Course details */}
              <div className="flex gap-3 pt-3">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="h-14 w-14 rounded-xl object-cover border border-white/10"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white leading-tight">{course.title}</h4>
                  <p className="text-[10px] text-white/40 font-medium">Instructor: {course.instructor.name}</p>
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="border-t border-white/5 pt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between text-white/50 font-medium">
                  <span>Course list price</span>
                  <span>${course.price}.00</span>
                </div>
                <div className="flex items-center justify-between text-white/50 font-medium">
                  <span>Platform processing fee</span>
                  <span>$0.00</span>
                </div>
                <div className="flex items-center justify-between text-white/50 font-medium">
                  <span>Sales tax (0%)</span>
                  <span>$0.00</span>
                </div>
                <div className="border-t border-white/5 pt-3 flex items-center justify-between text-sm font-extrabold text-white">
                  <span>Total due today</span>
                  <span className="text-indigo-400 font-mono">${course.price}.00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Secure disclaimer */}
          <div className="text-[11px] text-white/30 space-y-2 border-t border-white/5 pt-6 mt-6">
            <p className="flex items-start gap-1.5 leading-normal">
              <Lock className="h-4 w-4 text-white/30 flex-shrink-0 mt-0.5" />
              <span>Secure checkout handled by <strong>Stripe Inc</strong>. Your financial security is verified with bank-grade SSL encryption.</span>
            </p>
          </div>
        </div>

        {/* Right column: Card input and payment processing states */}
        <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-center bg-[#0d0d0d]">
          {loadingState !== 'idle' ? (
            /* Loading Processing Screen States */
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
              {loadingState === 'submitting' && (
                <>
                  <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
                  <div>
                    <h3 className="text-sm font-bold text-white">Tokenizing credit card...</h3>
                    <p className="text-xs text-white/40 mt-1">Contacting Stripe secure servers for verification</p>
                  </div>
                </>
              )}
              {loadingState === 'processing' && (
                <>
                  <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
                  <div>
                    <h3 className="text-sm font-bold text-white">Creating Stripe Checkout Session...</h3>
                    <p className="text-xs text-white/40 mt-1">Recording ledger entries inside secure cloud DB</p>
                  </div>
                </>
              )}
              {loadingState === 'verifying' && (
                <>
                  <Loader2 className="h-10 w-10 text-emerald-400 animate-spin" />
                  <div>
                    <h3 className="text-sm font-bold text-emerald-400">Authorizing payload success...</h3>
                    <p className="text-xs text-white/40 mt-1">Triggering developer webhook transactions</p>
                  </div>
                </>
              )}
              {loadingState === 'success' && (
                <>
                  <div className="rounded-full bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-400 animate-bounce">
                    <CheckCircle className="h-10 w-10" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-emerald-400">Payment Succeeded!</h3>
                    <p className="text-xs text-white/40 mt-1">Redirecting you back to Aura Academy dashboard...</p>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Stripe Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-lg text-white mb-1">Pay with card</h3>
                <p className="text-xs text-white/40">Complete checkout using Stripe test tokens.</p>
              </div>

              {/* Demo Helper Pill */}
              <div className="rounded-2xl bg-indigo-500/10 border border-indigo-500/20 p-4 flex items-start gap-3">
                <Info className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-300">
                  <p className="font-bold">Stripe Developer sandbox mode is active.</p>
                  <p className="leading-relaxed text-indigo-300/80 mt-1">
                    No actual bank charges will be incurred. Click below to instantly fill card fields.
                  </p>
                  <button
                    type="button"
                    onClick={fillDemoData}
                    className="mt-3 text-xs font-extrabold text-white bg-indigo-600 border border-indigo-500 rounded-lg px-3 py-1.5 hover:bg-indigo-500 transition-all cursor-pointer shadow-sm"
                  >
                    Quick-Fill Test Card (4242)
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="rounded-xl bg-rose-500/10 border border-rose-500/25 px-4 py-3 text-xs font-semibold text-rose-400">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-4">
                {/* Email Address */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-white/60">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none placeholder-white/20"
                    placeholder="student@example.com"
                  />
                </div>

                {/* Card Number */}
                <div className="space-y-1.5">
                  <label htmlFor="cardNumber" className="text-xs font-semibold text-white/60">Card information</label>
                  <div className="relative">
                    <input
                      id="cardNumber"
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full rounded-t-xl border border-white/10 bg-white/5 pl-10 pr-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none placeholder-white/20"
                      placeholder="1234 5678 1234 5678"
                    />
                    <CreditCard className="absolute left-3.5 top-3 h-4 w-4 text-white/30" />
                  </div>
                  
                  {/* Row Expiry & CVC */}
                  <div className="grid grid-cols-2">
                    <input
                      id="expiry"
                      type="text"
                      required
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full rounded-bl-xl border-x border-b border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none placeholder-white/20"
                      placeholder="MM / YY"
                    />
                    <input
                      id="cvc"
                      type="text"
                      required
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      className="w-full rounded-br-xl border-r border-b border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none placeholder-white/20"
                      placeholder="CVC"
                    />
                  </div>
                </div>

                {/* Name on Card */}
                <div className="space-y-1.5">
                  <label htmlFor="cardName" className="text-xs font-semibold text-white/60">Cardholder Name</label>
                  <input
                    id="cardName"
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none placeholder-white/20"
                    placeholder="First Last"
                  />
                </div>
              </div>

              {/* Secure terms checkbox disclaimer */}
              <div className="text-[10px] text-white/30 leading-normal">
                By purchasing, you authorize Stripe Sandbox to authorize temporary payment mocks. Refund options are available anytime from the Stripe Dev console tab.
              </div>

              {/* Pay & Cancel Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full sm:w-1/3 order-last sm:order-first flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 font-bold text-xs py-3.5 transition-all cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Go Back
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-2/3 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3.5 transition-all cursor-pointer shadow-lg active:scale-98"
                >
                  <Lock className="h-4 w-4" />
                  Pay ${course.price}.00
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

