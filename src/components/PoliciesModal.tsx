import React, { useState } from 'react';
import { X, ShieldCheck, Scale, Receipt, Mail, MapPin, Phone, Building2, HelpCircle } from 'lucide-react';

interface PoliciesModalProps {
  initialTab?: 'terms' | 'privacy' | 'refund' | 'contact';
  onClose: () => void;
}

export default function PoliciesModal({ initialTab = 'terms', onClose }: PoliciesModalProps) {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'refund' | 'contact'>(initialTab);

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="w-full max-w-4xl bg-[#0d0d0d] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto max-h-[90vh] my-auto animate-fade-in"
        id="policies-modal-container"
      >
        {/* Left column sidebar layout */}
        <div className="md:w-1/3 bg-[#141414] border-r border-white/5 p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-sm tracking-tight text-white uppercase">Aura Academy</span>
                <span className="rounded bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-bold text-indigo-400 px-1.5 py-0.5 uppercase">Legal Info</span>
              </div>
              <p className="text-[11px] text-white/40 mt-1">Platform rules, learner terms, customer satisfaction guarantees & corporate disclosures.</p>
            </div>

            <nav className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('terms')}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-left text-xs font-bold transition-all ${
                  activeTab === 'terms'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Scale className="h-4 w-4" />
                Terms of Service
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('privacy')}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-left text-xs font-bold transition-all ${
                  activeTab === 'privacy'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('refund')}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-left text-xs font-bold transition-all ${
                  activeTab === 'refund'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Receipt className="h-4 w-4" />
                Refund Policy
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('contact')}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-left text-xs font-bold transition-all ${
                  activeTab === 'contact'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Building2 className="h-4 w-4" />
                Contact & Support
              </button>
            </nav>
          </div>

          <div className="pt-6 border-t border-white/5 hidden md:block">
            <p className="text-[10px] text-white/30 font-medium">Verified Merchant ID: merchant_aura_live_2026</p>
            <p className="text-[10px] text-white/30 font-medium mt-1">PCI-DSS Compliant Gateway Integration</p>
          </div>
        </div>

        {/* Right column detailed content (scrollable) */}
        <div className="md:w-2/3 p-6 sm:p-8 flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
            <h3 className="font-display text-base font-bold text-white uppercase tracking-wide">
              {activeTab === 'terms' && 'Terms of Service & Conditions'}
              {activeTab === 'privacy' && 'Student Privacy Policy'}
              {activeTab === 'refund' && 'Refund & Cancellation Policy'}
              {activeTab === 'contact' && 'Corporate Contact Details'}
            </h3>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-white/40 hover:bg-white/5 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Policy Text Blocks */}
          <div className="flex-1 overflow-y-auto text-xs text-white/70 leading-relaxed pr-2 max-h-[50vh] space-y-4">
            {activeTab === 'terms' && (
              <>
                <p className="font-semibold text-white">Last Updated: July 19, 2026</p>
                <p>Welcome to Aura Academy ("we," "our," or "us"). These Terms of Service ("Terms") govern your use of our website, course materials, lectures, and sandbox environments (collectively, the "Services"). By registering for a student record or purchasing any of our curriculum modules, you explicitly agree to follow these Terms.</p>
                
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] pt-2">1. Student Accounts & Lifetime Access</h4>
                <p>To access our restricted course modules, you must create a validated student account. You are solely responsible for maintaining the confidentiality of your credentials. "Lifetime Access" indicates that you will possess ongoing access to the purchased curriculum materials for as long as Aura Academy continues to host and maintain the specific course title.</p>
                
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] pt-2">2. Fees, Subscriptions, and Billing</h4>
                <p>All program tuition fees are clearly specified on the course landing pages. Tuition is a one-time charge for permanent access to that specific curriculum. Payments are handled securely using Stripe payment gateways. You authorize our payment processors to debit your provided transaction method for the fully indicated amount upon clicking the Checkout button.</p>
                
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] pt-2">3. Acceptable Conduct & Academic Honesty</h4>
                <p>Learners must utilize all system sandbox environments, terminal simulators, and API integrations in a lawful, non-destructive manner. Reverse engineering, malicious scripting, or unauthorized crawling of sandbox endpoints is strictly prohibited.</p>
                
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] pt-2">4. Disclaimer of Academic Credit</h4>
                <p>Aura Academy is an independent professional development studio. We offer skills-based curriculum pathways. Our programs do not grant collegiate degrees, university credits, or state-recognized certifications unless explicitly indicated.</p>
              </>
            )}

            {activeTab === 'privacy' && (
              <>
                <p className="font-semibold text-white">Last Updated: July 19, 2026</p>
                <p>Aura Academy respects the data security of our international community of learners. This Privacy Policy details how we aggregate, store, and process your student details.</p>
                
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] pt-2">1. Information We Collect</h4>
                <p>When creating a student record, we collect basic details such as your full name, email address, password, and registered courses. We also track lesson completion logs, quiz scores, and platform transaction histories to deliver your study dashboard.</p>
                
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] pt-2">2. Stripe Gateway Integration & Credit Cards</h4>
                <p>All checkout transactions are handled securely by Stripe. We **never** store or receive your raw credit card numbers, CVVs, or bank routing digits on our own application servers. Stripe processes all sensitive credentials securely under PCI-DSS Level 1 compliance.</p>
                
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] pt-2">3. Cookies & Analytics</h4>
                <p>We use minor browser storage mechanisms (e.g., localStorage) to keep your student session token cached. We do not engage in third-party marketing tracking or sell student details to data brokers.</p>
                
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] pt-2">4. Contacting our Privacy Officer</h4>
                <p>For any questions regarding your account data, or to request a permanent erasure of your student record, contact our data protection team at <strong>privacy@auraclassroom.com</strong>.</p>
              </>
            )}

            {activeTab === 'refund' && (
              <>
                <p className="font-semibold text-white text-sm text-indigo-400">14-Day 100% Satisfaction Money-Back Guarantee</p>
                <p>Aura Academy is dedicated to delivering the highest quality professional course material. We stand firmly behind our curriculum and offer a transparent, stress-free refund policy.</p>
                
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] pt-2">1. Refund Eligibility Period</h4>
                <p>If you are not completely satisfied with a course, you are eligible to request a **100% full refund** within **14 calendar days** from your original purchase date. No complex forms are required.</p>
                
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] pt-2">2. Refund Conditions</h4>
                <p>To qualify for a refund, you must have completed less than 50% of the course's syllabus lessons (articles, videos, quizzes) prior to making the refund request. This ensures fair use of our instructors' intensive intellectual properties.</p>
                
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] pt-2">3. How to Request a Refund</h4>
                <p>To request a refund, simply send an email to <strong>support@auraclassroom.com</strong> with:</p>
                <ul className="list-disc pl-5 space-y-1 mt-1.5 text-white/60">
                  <li>Your full student name</li>
                  <li>Your registered account email address</li>
                  <li>The specific course title you wish to return</li>
                  <li>The Stripe invoice or receipt code (if available)</li>
                </ul>
                <p className="mt-2">Our student support agents typically review and approve refund requests in under **24 business hours**.</p>
                
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] pt-2">4. Processing Time</h4>
                <p>Once approved, the refund is immediately submitted to Stripe. The funds will return to your original payment card or bank account in approximately **5 to 10 business days**, depending on your financial institution's processing speeds.</p>
              </>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-6">
                <p>We are a fully registered professional education provider. If you have questions about our curriculum offerings, payment options, enterprise volume licensing, or platform features, please reach out to our team using the verified channels below:</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-4 flex gap-3">
                    <Mail className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                    <div className="space-y-1">
                      <h5 className="font-bold text-white text-xs">Customer Support</h5>
                      <p className="text-[11px] text-white/50">For general questions, billing, and refunds:</p>
                      <p className="text-xs font-bold text-indigo-300 font-mono mt-1">support@auraclassroom.com</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-white/5 p-4 flex gap-3">
                    <Phone className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                    <div className="space-y-1">
                      <h5 className="font-bold text-white text-xs">Call Our Office</h5>
                      <p className="text-[11px] text-white/50">Mon-Fri 9:00 AM - 5:00 PM PST:</p>
                      <p className="text-xs font-bold text-indigo-300 font-mono mt-1">+1 (800) 555-0199</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-white/5 p-4 flex gap-3 sm:col-span-2">
                    <MapPin className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                    <div className="space-y-1">
                      <h5 className="font-bold text-white text-xs">Aura Academy HQ Location</h5>
                      <p className="text-[11px] text-white/50">Official corporate address and mailing address:</p>
                      <p className="text-xs font-bold text-white mt-1">
                        Aura Academy Inc.<br />
                        300 Mission Street, Suite 400<br />
                        San Francisco, CA 94105<br />
                        United States of America
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">Secure Merchant Integrity</p>
                    <p className="text-[10px] text-white/50">Aura Academy Inc. is a registered merchant with active compliance validation on Stripe. All educational service delivery is guaranteed.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer of details */}
          <div className="border-t border-white/5 pt-4 mt-5 flex justify-between items-center text-[10px] text-white/40">
            <span>AURA ACADEMY INC. &bull; ALL RIGHTS RESERVED</span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all cursor-pointer text-xs"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
