import { useState } from 'react';
import { CreditCard, Terminal, Settings, RefreshCw, ShieldCheck, HelpCircle, Check, Trash2 } from 'lucide-react';
import { StripeTransaction } from '../types';

interface StripeDevPanelProps {
  transactions: StripeTransaction[];
  stripeConfig: {
    activeMode: string;
    hasStripeSecretKey: boolean;
    webhookUrl: string;
  } | null;
  onRefundAll: () => void;
  onRefresh: () => void;
}

export default function StripeDevPanel({ transactions, stripeConfig, onRefundAll, onRefresh }: StripeDevPanelProps) {
  const [activeTab, setActiveTab] = useState<'transactions' | 'webhooks' | 'guide'>('transactions');
  const [copiedText, setCopiedText] = useState(false);

  const copyEnvText = () => {
    navigator.clipboard.writeText('STRIPE_SECRET_KEY="sk_test_..."');
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const currentPayloadSample = {
    id: "evt_1PxyGz2dJvdvPi3f12345",
    object: "event",
    api_version: "2023-10-16",
    created: 1720123456,
    data: {
      object: {
        id: "cs_test_b1pDmx9...",
        object: "checkout.session",
        amount_total: 9900,
        currency: "usd",
        customer_email: "student@example.com",
        payment_status: "paid",
        metadata: {
          courseId: "course-gemini-ai"
        }
      }
    },
    type: "checkout.session.completed"
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-3xl bg-[#111111] text-white p-6 md:p-8 relative overflow-hidden border border-white/10 shadow-xl">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] -z-10" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Full-Stack Stripe Telemetry Console</span>
            </div>
            <h2 className="font-display text-xl font-bold uppercase tracking-wider">Stripe Integration & Webhooks</h2>
            <p className="text-xs text-white/50 max-w-2xl">
              Inspect transaction histories, see real-time payment state updates, and explore the backend architecture that proxies checkout sessions securely.
            </p>
          </div>

          <button
            onClick={onRefresh}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-white text-black hover:scale-105 active:scale-95 transition-transform text-xs font-bold px-4 py-2.5 cursor-pointer shadow-md"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Telemetry
          </button>
        </div>
      </div>

      {/* Connection status grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status card */}
        <div className="rounded-3xl border border-white/10 bg-[#111111] p-6 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-mono">Environment Status</span>
            <div className="flex items-center gap-2 mt-2 mb-3">
              {stripeConfig?.hasStripeSecretKey ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-sm font-bold text-emerald-400">Production/Test API (Real)</span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
                  <span className="text-sm font-bold text-amber-400">Local Sandbox Simulator</span>
                </>
              )}
            </div>
            <p className="text-xs text-white/50 leading-relaxed">
              {stripeConfig?.hasStripeSecretKey 
                ? "Your custom STRIPE_SECRET_KEY is loaded! Payments are routed through actual Stripe Checkout pages." 
                : "No secret key found in .env. We fall back to a responsive Checkout Sandbox to allow smooth UI evaluations."}
            </p>
          </div>
          
          <div className="border-t border-white/5 pt-4 mt-4 flex items-center justify-between text-[11px] font-mono font-semibold text-white/40">
            <span>KEY SOURCE</span>
            <span className="text-white">{stripeConfig?.hasStripeSecretKey ? "System Environment" : "Dynamic Fallback"}</span>
          </div>
        </div>

        {/* Secret Key card */}
        <div className="rounded-3xl border border-white/10 bg-[#111111] p-6 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-mono">Stripe Config API</span>
            <p className="text-xs font-semibold text-white mt-2 mb-1">STRIPE_SECRET_KEY</p>
            <code className="block bg-white/5 border border-white/5 rounded px-2.5 py-1 text-[10px] text-indigo-300 font-mono truncate">
              {stripeConfig?.hasStripeSecretKey ? "sk_test_••••••••••••••••••••" : "Not configured yet"}
            </code>
            <p className="text-xs text-white/50 mt-2.5 leading-relaxed">
              Add your test keys in <code>.env.example</code> to instantly shift from Sandbox to standard Stripe payment forms!
            </p>
          </div>

          <button
            onClick={copyEnvText}
            className="mt-4 w-full flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-[11px] font-bold text-white py-2 cursor-pointer transition-colors"
          >
            {copiedText ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                Copied key template!
              </>
            ) : (
              <>
                <Settings className="h-3.5 w-3.5 text-white/60" />
                Copy key variable name
              </>
            )}
          </button>
        </div>

        {/* Webhook Endpoint card */}
        <div className="rounded-3xl border border-white/10 bg-[#111111] p-6 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-mono">Webhook Endpoint URL</span>
            <p className="text-xs font-bold text-white mt-2 mb-1">Status webhook ingestion</p>
            <code className="block bg-white/5 border border-white/5 rounded px-2.5 py-1 text-[10px] text-indigo-400 font-mono truncate">
              {stripeConfig?.webhookUrl}
            </code>
            <p className="text-xs text-white/50 mt-2.5 leading-relaxed">
              The Express server hosts endpoint listeners to securely unlock purchased course modules on successful purchase notifications.
            </p>
          </div>

          <div className="border-t border-white/5 pt-4 mt-4 flex items-center justify-between text-[11px] font-mono font-semibold text-white/40">
            <span>WEBHOOK STATUS</span>
            <span className="text-emerald-400">Active</span>
          </div>
        </div>
      </div>

      {/* Tabs list & content board */}
      <div className="rounded-3xl border border-white/10 bg-[#111111] overflow-hidden shadow-sm">
        {/* Navigation tabs */}
        <div className="flex border-b border-white/5 bg-black/20">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex items-center gap-2 border-b-2 px-6 py-4 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'transactions'
                ? 'border-indigo-500 text-indigo-400 bg-white/5'
                : 'border-transparent text-white/40 hover:text-white'
            }`}
          >
            <CreditCard className="h-4 w-4" />
            Active Payments Ledger ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab('webhooks')}
            className={`flex items-center gap-2 border-b-2 px-6 py-4 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'webhooks'
                ? 'border-indigo-500 text-indigo-400 bg-white/5'
                : 'border-transparent text-white/40 hover:text-white'
            }`}
          >
            <Terminal className="h-4 w-4" />
            Simulated Webhook Payloads
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 border-b-2 px-6 py-4 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'guide'
                ? 'border-indigo-500 text-indigo-400 bg-white/5'
                : 'border-transparent text-white/40 hover:text-white'
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            Integration Code Guide
          </button>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Active Transaction Logs</h4>
                  <p className="text-xs text-white/40">Recorded payments and active access rosters inside our application.</p>
                </div>
                {transactions.length > 0 && (
                  <button
                    onClick={onRefundAll}
                    className="flex items-center gap-1 text-rose-400 hover:text-rose-300 font-bold text-xs cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" /> Refund and Lock All
                  </button>
                )}
              </div>

              {transactions.length === 0 ? (
                <div className="py-12 text-center text-white/30 text-xs">
                  No active transactions registered in this session. Go purchase a course using the catalog!
                </div>
              ) : (
                <div className="overflow-x-auto border border-white/5 rounded-2xl divide-y divide-white/5">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-white/5 text-white/40 font-bold">
                      <tr>
                        <th className="p-3.5">Transaction ID</th>
                        <th className="p-3.5">Course Title</th>
                        <th className="p-3.5">Amount</th>
                        <th className="p-3.5">Card</th>
                        <th className="p-3.5">Gate Mode</th>
                        <th className="p-3.5">Created At</th>
                        <th className="p-3.5 text-right">Receipt status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/70">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-white/5">
                          <td className="p-3.5 font-mono text-[10px] font-semibold text-indigo-400">{tx.id}</td>
                          <td className="p-3.5 font-bold text-white">{tx.courseTitle}</td>
                          <td className="p-3.5 font-bold text-white">${tx.amount}.00</td>
                          <td className="p-3.5 uppercase font-mono text-[10px] text-white/60">{tx.cardBrand || 'visa'} (•••• {tx.last4 || '4242'})</td>
                          <td className="p-3.5">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold border ${
                              tx.mode === 'real' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>
                              {tx.mode === 'real' ? 'real stripe' : 'sandbox'}
                            </span>
                          </td>
                          <td className="p-3.5 text-white/40 text-[10px] font-mono">{new Date(tx.createdAt).toLocaleTimeString()}</td>
                          <td className="p-3.5 text-right">
                            <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
                              <ShieldCheck className="h-3 w-3" /> Paid
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'webhooks' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Stripe JSON Webhook payload</h4>
                <p className="text-xs text-white/40">This JSON payload is securely POSTed to your webhook endpoint upon payment success.</p>
              </div>
              <pre className="bg-[#050505] text-indigo-300 rounded-2xl p-5 font-mono text-xs overflow-x-auto border border-white/5 leading-normal">
                {JSON.stringify(currentPayloadSample, null, 2)}
              </pre>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-6 text-white/70 text-xs leading-relaxed font-sans">
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">How Your Full-Stack Checkout API operates:</h4>
                <p>
                  To handle API keys securely and satisfy full-stack standards, your platform implements a dual-mode execution logic.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="rounded-2xl border border-white/10 p-5 space-y-3 bg-white/5">
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                    Real Stripe Mode
                  </p>
                  <p>
                    When <code>STRIPE_SECRET_KEY</code> is present in your server environment variables:
                  </p>
                  <ol className="list-decimal pl-4 space-y-1.5 font-medium text-white/60">
                    <li>The client calls <code>/api/create-checkout-session</code>.</li>
                    <li>The Express server initializes the Stripe Node client and requests an official Stripe Checkout.</li>
                    <li>Stripe returns a secure redirect URL (e.g., <code>https://checkout.stripe.com/...</code>).</li>
                    <li>The client is redirected, inputs credit card details, completes the payment.</li>
                    <li>Stripe redirects the customer back to Aura Academy, and issues webhook alerts to unlock course items.</li>
                  </ol>
                </div>

                <div className="rounded-2xl border border-white/10 p-5 space-y-3 bg-white/5">
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                    Secure Sandbox Fallback
                  </p>
                  <p>
                    When no Stripe secret key exists (during early staging or on the AI Studio iframe workspace preview):
                  </p>
                  <ol className="list-decimal pl-4 space-y-1.5 font-medium text-white/60">
                    <li>The client calls <code>/api/create-checkout-session</code>.</li>
                    <li>The Express server discovers no secret keys, and returns a session flag marked <code>mode: "sandbox"</code>.</li>
                    <li>The client interface captures this flag and immediately renders our high-fidelity Stripe Checkout modal.</li>
                    <li>The user enters mock information (using the 4242 quick filler) and clicks Pay.</li>
                    <li>The client POSTs back to <code>/api/record-sandbox-payment</code> to append the transaction ledger, and unlocks the curriculum course immediately!</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
