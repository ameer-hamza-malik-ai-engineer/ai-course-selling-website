import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onStripeClick: () => void;
}

export default function Hero({ onExploreClick, onStripeClick }: HeroProps) {
  return (
    <div className="relative overflow-hidden py-16 md:py-24 border-b border-white/5">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-purple-500/5 rounded-full blur-[100px] -z-10"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full w-fit mb-6 mx-auto">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-400">New Masterclass Released</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-light leading-[1.1] tracking-tight text-white mb-6 max-w-4xl mx-auto">
            Master the Art of <br/>
            <span className="font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent italic">Strategic Systems.</span>
          </h1>

          {/* Description */}
          <p className="mx-auto max-w-2xl text-sm md:text-base text-white/50 leading-relaxed mb-8">
            Learn how to architect high-performance digital products from global industry leaders. No fluff, just practical engineering and secure, one-click checkout verified by Stripe.
          </p>

          {/* Call to Actions & Student Enrolled */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
            <button
              id="hero-explore-btn"
              onClick={onExploreClick}
              className="px-8 py-4 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-xl hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xl shadow-white/5"
            >
              Enroll Now & Start learning
            </button>
            
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-[#050505] bg-zinc-600"></div>
                <div className="w-8 h-8 rounded-full border-2 border-[#050505] bg-zinc-400"></div>
                <div className="w-8 h-8 rounded-full border-2 border-[#050505] bg-indigo-500"></div>
              </div>
              <div className="text-left">
                <span className="block text-[10px] text-white/40 uppercase font-bold tracking-wider">+12k students enrolled</span>
              </div>
            </div>
          </div>

          {/* Stripe Teaser */}
          <div className="flex items-center justify-center gap-3 mt-4 text-white/30 mb-14">
            <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.911 8.01c-1.03 0-1.748.455-1.748 1.411 0 1.258 1.706 1.637 2.836 2.053 1.294.476 1.84 1.11 1.84 2.164 0 1.488-1.282 2.316-3.003 2.316-1.63 0-2.883-.564-3.565-1.085l.488-1.85c.61.42 1.54.912 2.617.912.83 0 1.417-.376 1.417-1.04 0-1.13-1.616-1.558-2.738-1.996-1.127-.442-1.864-1.107-1.864-2.13 0-1.472 1.255-2.28 2.87-2.28 1.272 0 2.457.41 3.037.82l-.46 1.85c-.604-.423-1.464-.845-2.29-.845zM22 13.06h-5.46v1.944h5.46v-1.944zM3.484 10.37V8.12H1v1.94h2.484v.31c0 1.076.712 1.655 1.802 1.655.397 0 .8-.06 1.144-.19l-.116-1.63a1.99 1.99 0 0 1-.582.072c-.41 0-.616-.215-.616-.62v-1.287h1.49V8.12h-1.49v2.25z"/>
            </svg>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Secure One-Click Checkout with Stripe</span>
          </div>

          {/* Bento stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-white/5 max-w-5xl mx-auto">
            <div className="flex flex-col items-center p-4 rounded-2xl bg-[#111111]/40 border border-white/5 backdrop-blur-md">
              <span className="font-display text-2xl font-black text-white">140+</span>
              <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider mt-1">LMS Syllabus Units</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-2xl bg-[#111111]/40 border border-white/5 backdrop-blur-md">
              <span className="font-display text-2xl font-black text-white">4.9/5</span>
              <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider mt-1">Satisfaction Rating</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-2xl bg-[#111111]/40 border border-white/5 backdrop-blur-md">
              <span className="flex items-center gap-1 font-display text-2xl font-black text-emerald-400">
                <ShieldCheck className="h-5 w-5 text-emerald-400" /> Secure
              </span>
              <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider mt-1">Instant Activation</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-2xl bg-[#111111]/40 border border-white/5 backdrop-blur-md">
              <span className="font-display text-2xl font-black text-indigo-400">Express</span>
              <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider mt-1">Local Webhook Relays</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
