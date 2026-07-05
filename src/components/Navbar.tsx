import { BookOpen, Layout, PlusCircle, CreditCard, LogOut, User as UserIcon, GraduationCap } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  activeTab: 'catalog' | 'my-courses' | 'teacher' | 'stripe-panel';
  setActiveTab: (tab: 'catalog' | 'my-courses' | 'teacher' | 'stripe-panel') => void;
  purchasedCount: number;
  currentUser: User | null;
  onLogout: () => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  purchasedCount,
  currentUser,
  onLogout,
  onLoginClick,
  onSignupClick
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#050505]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div 
          onClick={() => setActiveTab('catalog')} 
          className="flex cursor-pointer items-center gap-2.5"
          id="nav-logo"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-lg">
            A
          </div>
          <div>
            <span className="font-display text-base font-black tracking-tight text-white">ACADEMY.</span>
          </div>
        </div>

        {/* Main Navigation (Visible only when logged in) */}
        <nav className="hidden md:flex items-center gap-1.5">
          <button
            id="tab-btn-catalog"
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all border cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-white/10 text-white border-white/10'
                : 'text-white/60 border-transparent hover:text-white hover:bg-white/5'
            }`}
          >
            <Layout className="h-4 w-4" />
            Explore Courses
          </button>

          {currentUser && (
            <>
              <button
                id="tab-btn-mycourses"
                onClick={() => setActiveTab('my-courses')}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all border relative cursor-pointer ${
                  activeTab === 'my-courses'
                    ? 'bg-white/10 text-white border-white/10'
                    : 'text-white/60 border-transparent hover:text-white hover:bg-white/5'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                My Dashboard
                {purchasedCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white ring-2 ring-[#050505] animate-pulse">
                    {purchasedCount}
                  </span>
                )}
              </button>

              <button
                id="tab-btn-teacher"
                onClick={() => setActiveTab('teacher')}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all border cursor-pointer ${
                  activeTab === 'teacher'
                    ? 'bg-white/10 text-white border-white/10'
                    : 'text-white/60 border-transparent hover:text-white hover:bg-white/5'
                }`}
              >
                <PlusCircle className="h-4 w-4" />
                Instructor Hub
              </button>

              <button
                id="tab-btn-stripe"
                onClick={() => setActiveTab('stripe-panel')}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all border cursor-pointer ${
                  activeTab === 'stripe-panel'
                    ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400'
                    : 'border-white/5 text-white/50 hover:bg-white/5 hover:text-white'
                }`}
              >
                <CreditCard className="h-4 w-4 text-indigo-400" />
                Stripe Console
              </button>
            </>
          )}
        </nav>

        {/* User profile / Auth actions */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            /* Logged In Profile UI */
            <div className="flex items-center gap-4">
              {/* Sandbox info indicator */}
              <div 
                onClick={() => setActiveTab('stripe-panel')}
                className="cursor-pointer hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all border border-emerald-500/20 animate-pulse"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                Active LMS Student
              </div>

              <div className="h-6 w-px bg-white/10 md:block hidden"></div>

              {/* User Avatar */}
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-indigo-600/25 border border-indigo-500/35 flex items-center justify-center text-indigo-400">
                  <UserIcon className="h-4 w-4" />
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-semibold text-white leading-tight">{currentUser.name}</p>
                  <p className="text-[9px] text-white/40 font-mono line-clamp-1">{currentUser.email}</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="p-2 rounded-xl border border-white/5 bg-white/5 hover:bg-rose-500/15 hover:border-rose-500/25 text-white/60 hover:text-rose-400 transition-all cursor-pointer group"
                title="Log out of student record"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            /* Logged Out Actions */
            <div className="flex items-center gap-2">
              <button
                onClick={onLoginClick}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-white/80 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={onSignupClick}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 transition-all cursor-pointer shadow-md"
              >
                Sign Up & Register
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile navigation rail (Only shown when logged in) */}
      {currentUser && (
        <div className="flex md:hidden items-center justify-around border-t border-white/5 bg-[#050505] py-2.5 px-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex flex-col items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'catalog' ? 'text-indigo-400' : 'text-white/40'
            }`}
          >
            <Layout className="h-4 w-4" />
            Explore
          </button>
          <button
            onClick={() => setActiveTab('my-courses')}
            className={`flex flex-col items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors relative cursor-pointer ${
              activeTab === 'my-courses' ? 'text-indigo-400' : 'text-white/40'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Dashboard
            {purchasedCount > 0 && (
              <span className="absolute top-0 right-3 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[9px] font-bold text-white">
                {purchasedCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('teacher')}
            className={`flex flex-col items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'teacher' ? 'text-indigo-400' : 'text-white/40'
            }`}
          >
            <PlusCircle className="h-4 w-4" />
            Add Course
          </button>
          <button
            onClick={() => setActiveTab('stripe-panel')}
            className={`flex flex-col items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'stripe-panel' ? 'text-indigo-400' : 'text-white/40'
            }`}
          >
            <CreditCard className="h-4 w-4" />
            Stripe
          </button>
        </div>
      )}
    </header>
  );
}
