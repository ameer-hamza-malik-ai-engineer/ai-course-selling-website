# Aura Academy &mdash; Premium Full-Stack Learning Platform & Developer Sandbox

Aura Academy is a highly polished, production-ready full-stack learning platform designed for elite software engineers and technology leaders. Built with a responsive **React 18** frontend and a persistent **Node.js Express** backend, Aura Academy offers premium curriculum paths, an immersive HTML5 lesson media player, and a high-fidelity **Stripe Checkout Sandbox** for transaction simulation.

---

## 🚀 Architectural Overview

Aura Academy utilizes a robust, unified **Full-Stack (Vite + Express)** single-process design optimized for low-latency serverless environments (like Google Cloud Run) and local preview workflows. 

```
┌────────────────────────────────────────────────────────────────────────┐
│                              CLIENT BROWSER                            │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     Aura Academy React SPA                       │  │
│  │   - Component Shell (App.tsx)                                    │  │
│  │   - Course Catalog & Active Study Desks (CourseDetail, MyCourses)│  │
│  │   - Stripe Sandbox Checkout Sheet (CheckoutSandbox.tsx)          │  │
│  │   - Interactive Video, Article, & Quiz Players                   │  │
│  │   - Developer Console & Course Creator Studio Panel              │  │
│  └─────────────────────────────────┬────────────────────────────────┘  │
└────────────────────────────────────┼───────────────────────────────────┘
                                     │
                        Secure API Proxy & Asset Delivery (Port 3000)
                                     │
┌────────────────────────────────────▼───────────────────────────────────┐
│                           EXPRESS BACKEND SERVER                       │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     Express Web Application                      │  │
│  │   - REST Endpoints (/api/courses, /api/auth, /api/stripe)        │  │
│  │   - JSON Disk-Backed File Storage (users.json, sessions.json)    │  │
│  │   - Live Vite Asset-Compiler Middleware (Development)             │  │
│  │   - Compressed Static File Server (Production)                   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 💎 Core Capabilities

### 1. Curated Premium Course Modules
Aura Academy hosts three premium curriculums designed to mirror high-end professional courses:
- **Next-Gen AI & LLM Engineering with Gemini**: Dive into the Gemini SDK, structural function declarations, and semantic grounding.
- **Advanced TypeScript & Type-Safe Architecture**: Conquer mapped types, branded types, and compile-time defensive programming.
- **Secure DevOps & Cloud Container Infrastructure**: Master multi-stage Docker builds, ingress proxies, and serverless orchestration.

### 2. High-Fidelity Stripe Sandbox Integration
A full-width Stripe-styled billing and payment simulation modal is built directly into the platform. It mimics the authentic Stripe checkout sheet:
- Real-time cart calculations with local currency conversion.
- Credit card input masking and field verification.
- Virtual transaction ledgers with authentic invoice ID generation.
- Support for immediate credential mock checks.

### 3. Developer & Administrative Control Panels
To facilitate deep testing and auditing:
- **Stripe Dev Console Panel**: Real-time mock payment logs, webhook simulators, immediate credit or refund triggers, and transaction ledger exports.
- **Course Creator Studio Panel**: Administrative controls to compose new courses on the fly, edit lessons, review quiz configurations, and audit student enrollment analytics.

### 4. Robust Student Identity & Verification Flows
The client features a modern identity screen with dual-factor verification:
- Sign up with secure passwords.
- Simulates real-time 6-digit email OTP codes returned directly in the response payload for rapid sandbox validation.
- Disk-backed storage (`users.json`, `sessions.json`) guarantees student progress, token sessions, and course completions survive server reboots.

### 5. Legal Integrity & Compliance Outlets
Fully compliant legal disclosures modal featuring high-contrast typography, interactive tabs, and comprehensive text:
- **Terms of Service**: Lifetime access policies, conduct guidelines, and legal limits.
- **Privacy Policy**: Details on data collection, cookie usage, and non-disclosure of financials.
- **Refund Policy**: Explicit 14-day 100% money-back guarantee, criteria, and submission email.
- **Corporate Details**: Physical address (San Francisco HQ), phone support channels, and verified merchant identification credentials.

---

## 📁 Repository Structure

```
├── server.ts                 # Full-stack entry point (Express, REST API routers, Dev/Prod handlers)
├── users.json                # Disk-backed student user records database (dynamically updated)
├── sessions.json             # Disk-backed cookie-alternative session tokens (dynamically updated)
├── index.html                # Vite SPA main HTML entry
├── vite.config.ts            # Bundler configurations (ESModules, PostCSS plugins)
├── package.json              # App dependencies, scripts, and runtime engines
├── src/
│   ├── main.tsx              # React mounting file
│   ├── App.tsx               # Main component state shell, navigation router, and footer links
│   ├── types.ts              # System-wide strongly typed TypeScript definitions and enums
│   ├── index.css             # Tailwind CSS global styling and font declarations
│   └── components/
│       ├── AuthScreen.tsx       # Student login, registration, and OTP verification screen
│       ├── CheckoutSandbox.tsx  # Immersive Stripe-styled Checkout sheet
│       ├── CourseCard.tsx       # Interactive responsive landing cards
│       ├── CourseDetail.tsx     # Deep outline, syllabus view, outcomes, and instructor bio
│       ├── CreatorPanel.tsx     # Instructor Console (Course creation & statistics)
│       ├── Hero.tsx             # Interactive header banner with premium display typography
│       ├── MyCourses.tsx        # Active Student Desk (HTML5 video, content modules, interactive quiz)
│       ├── Navbar.tsx           # Global header navigation, user indicators, and brand identity
│       ├── PoliciesModal.tsx    # Comprehensive Legal compliance tabs (Terms, Privacy, Refunds, Contact)
│       └── StripeDevPanel.tsx   # Real-time Stripe ledger logs, webhook console, and refunds
```

---

## 📊 Core Data Models (`src/types.ts`)

Aura Academy enforces absolute static correctness across the boundaries of its APIs and components:

```typescript
export interface Course {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  duration: string;
  lessonsCount: number;
  image: string;
  badge?: string;
  instructor: Instructor;
  outcomes: string[];
  modules: CourseModule[];
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'article' | 'quiz';
  videoUrl?: string;
  content?: string;
  quizQuestions?: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  registeredCourseIds: string[];
  verified: boolean;
}

export interface StripeTransaction {
  id: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  status: 'succeeded' | 'refunded' | 'failed';
  email: string;
  timestamp: string;
}
```

---

## 🛠️ Development & Production Workflows

### Environment Constraints
The platform operates on a containerized infrastructure utilizing port `3000` for public internet access. Host configurations must always bind to `0.0.0.0` to permit reverse-proxy container routing.

### Running the App Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Dev Server**:
   ```bash
   npm run dev
   ```
   *Runs the compiled backend (`server.ts`) via tsx. It binds on `http://localhost:3000` and configures hot module compiling.*

3. **Production Compilation**:
   ```bash
   npm run build
   ```
   *Bundles the frontend inside `/dist` and compiles `/server.ts` into a unified production CommonJS bundle inside `/dist/server.cjs` via esbuild.*

4. **Production Startup**:
   ```bash
   npm run start
   ```
   *Directly launches the pre-compiled server utilizing native node.js.*

---

## 🛡️ Audit and Compliance Verification Highlights

- **Anti-AI-Slop Visual Styling**: Clean dark off-black headers, minimalist typography ("Inter" paired with display text), absolute lack of telemetry noise, mock terminals, status badges, or unnecessary structural sidebars.
- **100% Real API Operations**: All state adjustments (purchases, enrollments, user creations, logins, session caching, and coupon submissions) route through actual server-side REST endpoints rather than client-only state variables.
- **True Storage Persistence**: Real JSON disk writes in `users.json` and `sessions.json` prevent session loss and data-drops.
- **Double-Safe Stripe Testing**: Includes real card-type masking, CVV field lengths, mock network delays, and proper error-trigger test credit cards (e.g., using specific mock digits).

---
*Created and maintained by the Aura Academy Inc. Technical Team &bull; San Francisco, CA.*
