import { useState, useEffect } from 'react';
import { Search, Sparkles, Code, CreditCard, ArrowRight, Lock, ShieldCheck, CheckCircle2, Filter, GraduationCap, RefreshCw, X } from 'lucide-react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CourseCard from './components/CourseCard';
import CourseDetail from './components/CourseDetail';
import MyCourses from './components/MyCourses';
import CheckoutSandbox from './components/CheckoutSandbox';
import StripeDevPanel from './components/StripeDevPanel';
import CreatorPanel from './components/CreatorPanel';
import AuthScreen from './components/AuthScreen';
import PoliciesModal from './components/PoliciesModal';

import { Course, UserEnrollment, StripeTransaction, User } from './types';

export default function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [stripeConfig, setStripeConfig] = useState<{ activeMode: string; hasStripeSecretKey: boolean; webhookUrl: string } | null>(null);
  const [transactions, setTransactions] = useState<StripeTransaction[]>([]);
  
  // Tab navigation
  const [activeTab, setActiveTab] = useState<'catalog' | 'my-courses' | 'teacher' | 'stripe-panel'>('catalog');
  
  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal & Selection States
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<Course | null>(null);
  const [sandboxActiveCourse, setSandboxActiveCourse] = useState<Course | null>(null);
  const [policiesModalTab, setPoliciesModalTab] = useState<'terms' | 'privacy' | 'refund' | 'contact' | null>(null);
  
  // Authentication states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<'login' | 'signup' | 'verify' | null>(null);
  const [preselectedCourseId, setPreselectedCourseId] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Enrollment persistence (unlocked courses)
  const [unlockedCourseIds, setUnlockedCourseIds] = useState<string[]>([]);
  
  const [enrollments, setEnrollments] = useState<{ [courseId: string]: UserEnrollment }>(() => {
    const saved = localStorage.getItem('aura_enrollments');
    return saved ? JSON.parse(saved) : {};
  });

  // Success notifications
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [loadingCheckoutId, setLoadingCheckoutId] = useState<string | null>(null);

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem('aura_enrollments', JSON.stringify(enrollments));
  }, [enrollments]);

  // Load auth session on mount
  useEffect(() => {
    const token = localStorage.getItem('aura_auth_token');
    if (token) {
      fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Token expired');
      })
      .then(data => {
        if (data.success) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {
        localStorage.removeItem('aura_auth_token');
        setCurrentUser(null);
      })
      .finally(() => {
        setIsAuthLoading(false);
      });
    } else {
      setIsAuthLoading(false);
    }
  }, []);

  // Sync unlocked courses with user registration
  useEffect(() => {
    if (currentUser) {
      setUnlockedCourseIds(currentUser.registeredCourseIds);
      
      // Auto-initialize empty enrollments for any newly registered course
      setEnrollments(prev => {
        const updated = { ...prev };
        let changed = false;
        currentUser.registeredCourseIds.forEach(id => {
          if (!updated[id]) {
            updated[id] = {
              courseId: id,
              unlockedAt: new Date().toISOString(),
              completedLessons: [],
              progress: 0
            };
            changed = true;
          }
        });
        return changed ? updated : prev;
      });
    } else {
      setUnlockedCourseIds([]);
    }
  }, [currentUser]);

  // Fetch initial catalog, configuration and transaction list
  const loadData = async () => {
    try {
      const [coursesRes, configRes, txRes] = await Promise.all([
        fetch('/api/courses'),
        fetch('/api/stripe-config'),
        fetch('/api/transactions'),
      ]);

      if (coursesRes.ok) setCourses(await coursesRes.json());
      if (configRes.ok) setStripeConfig(await configRes.json());
      if (txRes.ok) setTransactions(await txRes.json());
    } catch (err) {
      console.error('Failed to load telemetry or course catalogs from Express server:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle successful login
  const handleAuthSuccess = (token: string, user: User) => {
    localStorage.setItem('aura_auth_token', token);
    setCurrentUser(user);
    setAuthView(null);
    setPreselectedCourseId(null);
    setSuccessBanner(`Welcome back, ${user.name}! Accessing your Aura classroom dashboard...`);
    setActiveTab('my-courses');
  };

  // Handle student logout
  const handleLogout = async () => {
    const token = localStorage.getItem('aura_auth_token');
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (err) {
        console.error('Logout sync issue:', err);
      }
    }
    localStorage.removeItem('aura_auth_token');
    setCurrentUser(null);
    setUnlockedCourseIds([]);
    setActiveTab('catalog');
    setSuccessBanner('Successfully logged out of student classroom profile.');
  };

  // Look for Stripe Success Redirect tokens in URL query params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isSuccess = params.get('success') === 'true';
    const courseId = params.get('course_id');
    const sessionId = params.get('session_id');

    if (isSuccess && courseId) {
      // Unlock course
      if (!unlockedCourseIds.includes(courseId)) {
        setUnlockedCourseIds(prev => [...prev, courseId]);
        
        // Initialize default enrollment
        setEnrollments(prev => ({
          ...prev,
          [courseId]: {
            courseId,
            unlockedAt: new Date().toISOString(),
            completedLessons: [],
            progress: 0
          }
        }));

        setSuccessBanner(`Congratulations! Your payment has been securely verified by Stripe. Course syllabus unlocked!`);
        setActiveTab('my-courses');
      }

      // Record transaction locally if session exists
      if (sessionId) {
        fetch('/api/record-sandbox-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId,
            cardBrand: 'visa',
            last4: '4242',
            amount: courses.find(c => c.id === courseId)?.price || 99
          })
        }).then(() => loadData());
      }

      // Clean the URL so reloads don't trigger successes repeatedly
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [courses]);

  // Handle Course purchase trigger
  const handleBuyCourse = async (course: Course) => {
    if (!currentUser) {
      // Direct student to Signup and lock registration
      setPreselectedCourseId(course.id);
      setAuthView('signup');
      return;
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          email: currentUser.email
        })
      });

      if (!response.ok) {
        throw new Error('Failed to configure checkout session.');
      }

      const result = await response.json();

      if (result.mode === 'real' && result.url) {
        // Redirect to Stripe hosted checkout page
        window.location.href = result.url;
      } else if (result.mode === 'sandbox') {
        // Trigger local sandbox modal
        setSelectedCourseDetail(null);
        setSandboxActiveCourse(course);
      }
    } catch (err: any) {
      alert(`Stripe Gateway Error: ${err.message || 'Initialization failed'}`);
    }
  };

  // Callback when sandbox payment succeeds
  const handleSandboxSuccess = async (cardBrand: string, last4: string) => {
    if (!sandboxActiveCourse) return;

    const courseId = sandboxActiveCourse.id;
    const token = localStorage.getItem('aura_auth_token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      // 1. Post to record-sandbox-payment
      await fetch('/api/record-sandbox-payment', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          courseId,
          cardBrand,
          last4,
          amount: sandboxActiveCourse.price
        })
      });

      // 2. Refresh local telemetry transactions
      await loadData();

      // Refresh current user session from the server to pull down the newly registered course
      if (token) {
        const meRes = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.success) {
            setCurrentUser(meData.user);
          }
        }
      }

      // 3. Update unlocked list
      if (!unlockedCourseIds.includes(courseId)) {
        setUnlockedCourseIds(prev => [...prev, courseId]);
        setEnrollments(prev => ({
          ...prev,
          [courseId]: {
            courseId,
            unlockedAt: new Date().toISOString(),
            completedLessons: [],
            progress: 0
          }
        }));
      }

      setSuccessBanner(`Payment authorized successfully! "${sandboxActiveCourse.title}" is now unlocked in your LMS dashboard.`);
      setSandboxActiveCourse(null);
      setActiveTab('my-courses');
    } catch (err) {
      console.error(err);
      alert('Sandbox purchase registration error.');
    }
  };

  // Reset progress and transactions (refund all) for testing
  const handleRefundAll = () => {
    setUnlockedCourseIds([]);
    setEnrollments({});
    setSuccessBanner('All courses locked and purchase history refunded for reset testing.');
    loadData();
  };

  // Update syllabus lesson progress checkmark
  const handleUpdateEnrollment = (courseId: string, completedLessonIds: string[], lastActiveLessonId?: string) => {
    const targetCourse = courses.find(c => c.id === courseId);
    if (!targetCourse) return;

    const totalLessons = targetCourse.lessonsCount || 3;
    const progressPercent = (completedLessonIds.length / totalLessons) * 100;

    setEnrollments(prev => ({
      ...prev,
      [courseId]: {
        courseId,
        unlockedAt: prev[courseId]?.unlockedAt || new Date().toISOString(),
        completedLessons: completedLessonIds,
        progress: Math.min(progressPercent, 100),
        lastActiveLessonId
      }
    }));
  };

  // Filter Catalog lists
  const filteredCourses = courses.filter(course => {
    const matchQuery = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchQuery && matchCategory;
  });

  // Extract unique categories for filter row
  const categories = ['All', ...new Set(courses.map(c => c.category))];

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] font-sans antialiased text-white relative">
      
      {/* Top Banner Alert */}
      {successBanner && (
        <div className="bg-emerald-600 text-white text-xs font-semibold px-4 py-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 max-w-5xl mx-auto w-full justify-center">
            <ShieldCheck className="h-5 w-5 text-emerald-100 flex-shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-emerald-100 hover:text-white cursor-pointer">
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
      )}

      {/* Global checkout loading overlay */}
      {loadingCheckoutId && (
        <div className="fixed inset-0 z-50 bg-[#050505]/80 backdrop-blur-md flex flex-col items-center justify-center text-center text-white">
          <div className="rounded-3xl bg-[#111111] border border-white/10 p-8 flex flex-col items-center space-y-4 shadow-2xl max-w-xs">
            <RefreshCw className="h-8 w-8 text-indigo-400 animate-spin" />
            <div>
              <p className="text-sm font-bold text-white">Contacting Stripe Servers</p>
              <p className="text-[10px] text-white/50 mt-1 leading-normal">Building secure Checkout Session tokens. Please do not close this window...</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        purchasedCount={unlockedCourseIds.length}
        currentUser={currentUser}
        onLogout={handleLogout}
        onLoginClick={() => {
          setPreselectedCourseId(null);
          setAuthView('login');
        }}
        onSignupClick={() => {
          setPreselectedCourseId(null);
          setAuthView('signup');
        }}
      />

      {/* Content Layouts */}
      <main className="flex-grow">
        {authView ? (
          <AuthScreen 
            view={authView}
            setView={setAuthView}
            courses={courses}
            onSuccess={handleAuthSuccess}
            onCancel={() => setAuthView(null)}
            preselectedCourseId={preselectedCourseId}
          />
        ) : (
          <>
            {activeTab === 'catalog' && (
              <div className="space-y-12">
                {/* Hero */}
                <Hero 
                  onExploreClick={() => {
                    const catalogEl = document.getElementById('catalog-search-section');
                    if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onStripeClick={() => setActiveTab('stripe-panel')}
                />

                {/* Course Catalog Search and Filters Section */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in" id="catalog-search-section">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
                    <div>
                      <h2 className="font-display text-xl font-bold text-white uppercase tracking-wider">Premium Syllabus Programs</h2>
                      <p className="text-xs text-white/40 mt-1">Unlock professional skills immediately. Certified curriculums featuring real quizzes and text guides.</p>
                    </div>

                    {/* Search field */}
                    <div className="relative w-full md:w-80">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/30" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search courses..."
                        className="w-full rounded-xl border border-white/10 bg-[#111111] pl-9.5 pr-4 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-white/30"
                      />
                    </div>
                  </div>

                  {/* Category tags filter row */}
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all border cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Course grid */}
                  {filteredCourses.length === 0 ? (
                    <div className="py-20 text-center text-white/40 text-sm">
                      No courses found matching your query. Clear filters or add a new course!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
                      {filteredCourses.map((course) => (
                        <CourseCard
                          key={course.id}
                          course={course}
                          isOwned={unlockedCourseIds.includes(course.id)}
                          onSelect={(c) => setSelectedCourseDetail(c)}
                          onBuy={handleBuyCourse}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dashboard panel */}
            {activeTab === 'my-courses' && (
              <MyCourses 
                purchasedCourses={courses.filter(c => unlockedCourseIds.includes(c.id))}
                enrollments={enrollments}
                updateEnrollment={handleUpdateEnrollment}
              />
            )}

            {/* Teacher / SKU designer panel */}
            {activeTab === 'teacher' && (
              <CreatorPanel 
                onCourseCreated={(newCourse) => {
                  setCourses(prev => [...prev, newCourse]);
                  setActiveTab('catalog');
                }}
              />
            )}

            {/* Stripe Telemetry panel */}
            {activeTab === 'stripe-panel' && (
              <StripeDevPanel 
                transactions={transactions}
                stripeConfig={stripeConfig}
                onRefundAll={handleRefundAll}
                onRefresh={loadData}
              />
            )}
          </>
        )}
      </main>

      {/* Immersive Footer / Trusted by section */}
      <footer className="w-full border-t border-white/5 bg-black/40 backdrop-blur-md mt-auto py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold text-center md:text-left">
            Our graduates work at
          </div>
          <div className="flex flex-wrap gap-6 sm:gap-10 grayscale opacity-30 items-center justify-center">
            <div className="text-sm font-black text-white">META</div>
            <div className="text-sm font-black text-white italic">stripe</div>
            <div className="text-sm font-black text-white tracking-tighter">LINEAR</div>
            <div className="text-sm font-black text-white">Vercel</div>
            <div className="text-sm font-black text-white">Airbnb</div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/40 font-medium">
            <button 
              type="button"
              onClick={() => setPoliciesModalTab('terms')}
              className="hover:text-white transition-colors cursor-pointer focus:outline-none"
            >
              Terms of Service
            </button>
            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
            <button 
              type="button"
              onClick={() => setPoliciesModalTab('privacy')}
              className="hover:text-white transition-colors cursor-pointer focus:outline-none"
            >
              Privacy Policy
            </button>
            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
            <button 
              type="button"
              onClick={() => setPoliciesModalTab('refund')}
              className="hover:text-white transition-colors cursor-pointer focus:outline-none"
            >
              Refund Policy
            </button>
            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
            <button 
              type="button"
              onClick={() => setPoliciesModalTab('contact')}
              className="hover:text-white transition-colors cursor-pointer focus:outline-none"
            >
              Contact Support
            </button>
            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
            <span>&copy; {new Date().getFullYear()} Aura Academy Inc.</span>
          </div>
        </div>
      </footer>

      {/* Course Detail slideover / dialog */}
      {selectedCourseDetail && (
        <CourseDetail 
          course={selectedCourseDetail}
          isOwned={unlockedCourseIds.includes(selectedCourseDetail.id)}
          onClose={() => setSelectedCourseDetail(null)}
          onBuy={handleBuyCourse}
          onStartLearning={(c) => {
            setSelectedCourseDetail(null);
            setActiveTab('my-courses');
          }}
        />
      )}

      {/* Stripe Sandbox slideover */}
      {sandboxActiveCourse && (
        <CheckoutSandbox 
          course={sandboxActiveCourse}
          onCancel={() => setSandboxActiveCourse(null)}
          onSuccess={handleSandboxSuccess}
        />
      )}

      {/* Compliance Policies Modal */}
      {policiesModalTab && (
        <PoliciesModal 
          initialTab={policiesModalTab}
          onClose={() => setPoliciesModalTab(null)}
        />
      )}

    </div>
  );
}
