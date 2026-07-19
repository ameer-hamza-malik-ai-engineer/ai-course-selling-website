# Aura Academy &mdash; Agent Instructions & Developer Playbook

This document serves as an exhaustive, step-by-step developer playbook for any AI coding agent modifying, maintaining, or scaling Aura Academy. Aura Academy is a full-stack, responsive learning platform built in **React (Vite) + Node.js (Express)**, featuring a simulated Stripe Payment Gateway sandbox, user persistence, and interactive study desks.

---

## 🗺️ Visual Architecture & Mood Guideline

- **Primary Aesthetic**: "Swiss-Modern / Cosmic Dark" &mdash; Clean off-black backgrounds (`#0d0d0d`), subtle borders (`border-white/10`), spacious negative space, and vibrant violet/indigo indicators.
- **Typography**: "Inter" for body and numbers; "Space Grotesk" or similar display headings for promotional components. "JetBrains Mono" for system keys, IDs, and transactional codes.
- **Strict Anti-AI-Slop constraint**: Avoid placing noisy status telemetry lines, terminal mock listings, or generic purple gradients in outer borders. Let individual visual elements breathe with margins and clear spacing.

---

## 🗂️ Project Directory Map

When making edits, do not guess file locations. Use the precise structure below:

```
├── server.ts                       # Backend entry, Express Server, REST APIs, Course Database
├── users.json                      # Persistent student records (Local file database)
├── sessions.json                   # Persistent authentication sessions (Local file database)
├── index.html                      # Entry HTML container
├── package.json                    # Package metadata, runtime scripts, and npm dependencies
├── src/
│   ├── main.tsx                    # React client mounting file
│   ├── App.tsx                     # Core Client Shell, handles auth checks & central modal views
│   ├── types.ts                    # Strongly typed global system interfaces & enums
│   ├── index.css                   # Tailwind imports, typography declarations, global animations
│   └── components/
│       ├── Navbar.tsx              # Top header: brand, auth indicators, user menus
│       ├── Hero.tsx                # Catchy hero section with call-to-action
│       ├── CourseCard.tsx          # Grid item representing single course summary & action
│       ├── CourseDetail.tsx        # Deep Drawer overlay for single course curriculum & checkout CTA
│       ├── CheckoutSandbox.tsx     # Stripe-styled checkout iframe form simulator with card inputs
│       ├── MyCourses.tsx           # Student Classroom (Active Study Desk, Video Player, Quiz Engine)
│       ├── CreatorPanel.tsx        # Administrative panel for creating, editing, & auditing courses
│       ├── StripeDevPanel.tsx      # Sandbox transaction list, webhook triggers, refund controllers
│       └── PoliciesModal.tsx       # Legal tabs: Terms of Service, Privacy, Refund Guarantee, Contact
```

---

## 🔌 API Endpoints Reference (`server.ts`)

Any backend modifications should align with these established REST routers:

### 1. Student Enrollment & Authentication
- **`POST /api/auth/register`**  
  Registers a new email/password. Returns verification details including a 6-digit `verificationCode` in the response payload for rapid frontend OTP sandbox extraction.
- **`POST /api/auth/verify`**  
  Verifies the OTP token. On success, sets `verified: true`, creates a token session, and returns the session cookie token `tok_...` and authenticated `user` object.
- **`POST /api/auth/resend`**  
  Regenerates and returns a fresh 6-digit OTP code.
- **`POST /api/auth/login`**  
  Validates credentials and returns an active student session token.
- **`GET /api/auth/me`**  
  Extracts the authorization token (`Bearer tok_...`) from the header to identify and return the current active student record.
- **`POST /api/auth/logout`**  
  Revokes and removes the active session token from memory/disk.

### 2. Course Management
- **`GET /api/courses`**  
  Fetches the complete array of active course curricula.
- **`POST /api/courses`**  
  Allows creators to submit a new course outline. Appends to the running in-memory system catalog.
- **`DELETE /api/courses/:id`**  
  Removes a course by its specific ID.

### 3. Stripe Sandbox Billing Gateway
- **`POST /api/stripe/checkout`**  
  Simulates raw Stripe Payment Intents. Evaluates card credentials. On success, issues a unique transaction reference `tx_...`, registers the selected course inside the user's `registeredCourseIds`, and appends a transaction ledger to the ledger list.
- **`GET /api/stripe/transactions`**  
  Retrieves a history of transactions for display on the Developer panel.
- **`POST /api/stripe/refund`**  
  Processes full Stripe refunds. Updates ledger status to `refunded`, and revokes the associated course ID from the user's `registeredCourseIds` if they are enrolled in it.

---

## 🛠️ Key State Machines & Modifying Code Safely

### How to Modify Course Lists or Curriculum Assets
- **Location**: `server.ts` &mdash; Look for `const courses: Course[]`.
- **Constraint**: Each course must comply with the `Course` interface in `src/types.ts`. It must contain a distinct `id` and include a structured array of `modules` and `lessons` with `type: 'video' | 'article' | 'quiz'`.
- **Videos**: Use reliable, public HTML5 sample video sources (e.g., `'https://www.w3schools.com/html/movie.mp4'` or `'https://www.w3schools.com/html/mov_bbb.mp4'`) in `videoUrl` fields so that the player renders with operational controls.

### How to Modify Student Records & Authentication Persistence
- **Files Affected**: `users.json` & `sessions.json`
- **Mechanism**: The backend loads storage arrays on startup using helper methods:
  - `loadUsers()` & `saveUsers(data)`
  - `loadSessions()` & `saveSessions(data)`
- **Safety**: Whenever you edit a state in a route that updates `users` or `sessions` (like registration, verification, login, logout, or checkouts), you **MUST** immediately invoke `saveUsers(users)` or `saveSessions(sessions)` to guarantee changes survive a server restart or dev-container sleep cycle.

### How to Add Frontend Views & Navigation
- **Central State Manager**: `src/App.tsx` contains active tab selection:
  ```typescript
  const [activeTab, setActiveTab] = useState<'all' | 'my-courses' | 'creator' | 'stripe-dev'>('all');
  ```
- **Session Refetching**: Triggered upon registration or checkout. Make sure any modifications to auth state utilize the `fetchCurrentUser` helper method to update the client state securely.

---

## 🕵️ Stripe Audit & Compliance Verification Cheat Sheet

If an external reviewer (e.g., Stripe Audit Team) evaluates this portal, ensure these core compliance features remain active:

1. **Refund & Cancellation Rights**:
   - Make sure the footer always links to the `PoliciesModal` and displays the **14-day money-back guarantee** explicitly under the Refund tab.
   - Instructors or reviewers must be able to click "Refund" instantly in the **Stripe Dev Panel** to check state synchronization.

2. **Real Corporate Disclosures**:
   - The "Contact & Support" section must feature a real-world mailing address, phone support lines, support email channels, and merchant integrity statements.

3. **Secure Transaction Flows**:
   - The frontend checkout sheet (`src/components/CheckoutSandbox.tsx`) must mimic Stripe precisely. It should include active validation errors for incomplete fields, valid routing tests, and simulate realistic processing states with clean spinners.

---

## 🚀 Recommended Deployment Checks

Whenever making changes to this workspace, always run these sequential validation commands:

1. **Verify Formatting & Compiler Types**:
   ```bash
   npm run lint
   ```
2. **Verify Bundles & Production Server Compilation**:
   ```bash
   npm run build
   ```
3. **Restarting Servers**:
   If modifying API routes inside `server.ts`, you must trigger a manual restart to clear cached server states. Run the `restart_dev_server` tool immediately after compilation succeeds.
