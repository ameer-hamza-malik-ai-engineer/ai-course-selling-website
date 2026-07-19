import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initial in-memory course storage to allow dynamic creation
const courses = [
  {
    id: 'course-gemini-ai',
    title: 'Next-Gen AI Engineering with Gemini API',
    description: 'Master advanced AI orchestration, prompt engineering, multimodal apps, and the Google GenAI SDK using Gemini 2.5 and Gemini Pro.',
    longDescription: 'Unlock the future of software development by building intelligent agentic systems. In this comprehensive course, you will dive deep into the Google GenAI TypeScript SDK, mastering key concepts like Multimodal prompts, Function Calling, System Instructions, Structured JSON outputs, and the Live API. You’ll build 3 real-world projects: an automated code reviewer, a multimodal research assistant, and a voice-enabled real-time translator.',
    category: 'Artificial Intelligence',
    level: 'Intermediate',
    price: 99,
    originalPrice: 249,
    rating: 4.9,
    reviewsCount: 1240,
    duration: '14h 30m',
    lessonsCount: 5,
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800',
    badge: 'Best Seller',
    instructor: {
      name: 'Dr. Sarah Lin',
      role: 'Principal AI Researcher & Ex-Googler',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      bio: 'Dr. Sarah Lin is an artificial intelligence veteran with over 10 years of experience building neural models. Formerly a senior research engineer, she now teaches full-time and consults for Fortune 500 AI strategies.',
      rating: 4.95,
      studentsCount: 45200,
      coursesCount: 3
    },
    outcomes: [
      'Implement structured schema-based outputs (JSON) using Gemini models',
      'Integrate real-time function calling to connect AI models with local system APIs',
      'Deploy autonomous agent systems that reason, plan, and execute tasks',
      'Analyze multimodal inputs (video, audio, docs) to generate complex summaries',
      'Build real-time streaming audio interfaces using Gemini Live WebSockets'
    ],
    modules: [
      {
        id: 'gemini-m1',
        title: 'Module 1: SDK Fundamentals & Prompt Techniques',
        lessons: [
          {
            id: 'gemini-l1',
            title: '1.1 Welcome to Next-Gen AI Engineering',
            duration: '08:15',
            type: 'video',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            content: 'In this introductory lesson, Dr. Sarah Lin welcomes you to Next-Gen AI Engineering. We map out the entire curriculum, outlining how to transition from basic prompting to building production-grade autonomous systems using the Google GenAI SDK.'
          },
          {
            id: 'gemini-l2',
            title: '1.2 API Authentication & SDK Integration Checklist',
            duration: '12:40',
            type: 'article',
            content: '### Securing Your API Keys in Server-Side Environments\n\nWhen developing software powered by the Google GenAI SDK, protecting your credentials is of absolute priority. Never expose your `GEMINI_API_KEY` to the client-side browser bundle.\n\n#### Secure Full-Stack Architecture\nAlways construct a full-stack design where your client requests are proxied through a secure Express router. This isolates keys server-side.\n\n#### SDK Initialization Best Practice\nInstall the modern official package:\n`npm install @google/genai`\n\nIn your server, initialize the client using lazy evaluation:\n```typescript\nimport { GoogleGenAI } from "@google/genai";\n\nlet aiClient: GoogleGenAI | null = null;\n\nexport function getAI() {\n  if (!aiClient) {\n    const key = process.env.GEMINI_API_KEY;\n    if (!key) {\n      throw new Error("Missing GEMINI_API_KEY environment variable");\n    }\n    aiClient = new GoogleGenAI({ apiKey: key });\n  }\n  return aiClient;\n}\n```'
          },
          {
            id: 'gemini-l3',
            title: '1.3 Structured JSON Outputs & Multimodal Analysis',
            duration: '15:20',
            type: 'article',
            content: '### Forcing Structured Outputs via Gemini API\n\nUnstructured natural language answers can cause runtime exceptions in strict system databases. Gemini 2.5 allows developers to force structured JSON responses that strictly adhere to a specified schema.\n\n#### Defining the Target Schema\nUse standard TypeScript or JSON schemas to direct the model structure:\n\n```typescript\nimport { getAI } from "./gemini-service";\n\nasync function analyzeCodeStructure(codeSnippet: string) {\n  const ai = getAI();\n  const response = await ai.models.generateContent({\n    model: "gemini-2.5-flash",\n    contents: `Analyze this code:\\n${codeSnippet}`,\n    config: {\n      responseMimeType: "application/json",\n      responseSchema: {\n        type: "OBJECT",\n        properties: {\n          complexity: { type: "STRING" },\n          bugsFound: {\n            type: "ARRAY",\n            items: { type: "STRING" }\n          },\n          performanceRating: { type: "INTEGER" }\n        },\n        required: ["complexity", "bugsFound", "performanceRating"]\n      }\n    }\n  });\n\n  const analysis = JSON.parse(response.text);\n  return analysis;\n}\n```\n\n#### Multimodal Video & Image Processing\nYou can feed high-definition video frames, audios, and documents directly to Gemini to perform complex correlation analyses without manual pre-processing.'
          }
        ]
      },
      {
        id: 'gemini-m2',
        title: 'Module 2: Advanced Agentic Workflows',
        lessons: [
          {
            id: 'gemini-l4',
            title: '2.1 Function Calling: Connecting Models to Real Databases',
            duration: '18:45',
            type: 'video',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            content: '### Executing Real-Time Local Functions\n\nFunction calling turns generative models into active agents. Instead of hallucinating values, the model returns a structured JSON calling payload outlining which local function to execute with what arguments.\n\n#### Declaring Tools for Gemini\nProvide tool definitions during generation calls:\n\n```typescript\nconst databaseQueryTool = {\n  functionDeclarations: [{\n    name: "queryProductStock",\n    description: "Get real-time warehouse inventory count for a specific SKU ID",\n    parameters: {\n      type: "OBJECT",\n      properties: {\n        skuId: { type: "STRING", description: "The product SKU code, e.g., PROD-492" }\n      },\n      required: ["skuId"]\n    }\n  }]\n};\n\nasync function inventoryAgent(userInput: string) {\n  const ai = getAI();\n  const response = await ai.models.generateContent({\n    model: "gemini-2.5-flash",\n    contents: userInput,\n    config: {\n      tools: [databaseQueryTool]\n    }\n  });\n\n  const call = response.functionCalls?.[0];\n  if (call && call.name === "queryProductStock") {\n    const { skuId } = call.args as { skuId: string };\n    const realStockCount = await myDatabase.getStock(skuId); // Real systems database query\n    \n    // Send the query result back to the model to synthesize a final answer!\n  }\n}\n```'
          },
          {
            id: 'gemini-l5',
            title: '2.2 Knowledge Check: SDK Orchestration Quiz',
            duration: '10:00',
            type: 'quiz',
            quizQuestions: [
              {
                question: 'Which is the recommended practice for managing your GEMINI_API_KEY?',
                options: [
                  'Embed it directly in the client-side React code for ease of deployment.',
                  'Store it securely in environment variables on the backend server and proxy requests.',
                  'Put it in public code repositories so other teams can access it.',
                  'Save it in client-side cookies or localStorage.'
                ],
                correctAnswer: 1
              },
              {
                question: 'How do you force Gemini to respond strictly in verified JSON matching a template?',
                options: [
                  'Add "PLEASE RESPOND IN JSON" in all caps in the prompt.',
                  'Set config.responseMimeType to "application/json" and supply a structured responseSchema.',
                  'Run a regular expression clean-up function on the client-side.',
                  'Use a specialized external formatting library on the prompt string.'
                ],
                correctAnswer: 1
              },
              {
                question: 'When a model performs Function Calling, does it execute the database query directly on your database?',
                options: [
                  'Yes, the model has direct database drivers pre-installed in its core.',
                  'No, the model returns a structured JSON payload specifying the function name and arguments; your backend must run the function and return the output.',
                  'Yes, but only if the database is hosted directly inside Google Cloud Spanner.',
                  'No, the model writes the database update in an offline text file.'
                ],
                correctAnswer: 1
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-react-fullstack',
    title: 'Enterprise React 19 & Full-Stack Mastery',
    description: 'Learn Next.js App Router, React Server Components, server actions, advanced state machines, and performant server configurations.',
    longDescription: 'Go from intermediate developer to frontend architect. React 19 introduces game-changing primitives like Server Components, Server Actions, the new use() hook, form actions, and native support for asset loading.',
    category: 'Development',
    level: 'Advanced',
    price: 129,
    originalPrice: 299,
    rating: 4.85,
    reviewsCount: 980,
    duration: '21h 15m',
    lessonsCount: 4,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
    badge: 'Highly Rated',
    instructor: {
      name: 'Alex Rivera',
      role: 'Principal Software Architect',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      bio: 'Alex Rivera is an open-source contributor and software architect with over 15 years in full-stack JavaScript. Formerly a principal engineer at large scale scaleups, he excels at frontend rendering pipelines.',
      rating: 4.89,
      studentsCount: 32000,
      coursesCount: 5
    },
    outcomes: [
      'Understand React Server Components (RSC) vs Client Components',
      'Optimize database queries using modern ORMs (Drizzle/Prisma)',
      'Leverage new React 19 hooks including useActionState and useTransition',
      'Optimize Core Web Vitals to achieve pristine Lighthouse scores of 100'
    ],
    modules: [
      {
        id: 'react-m1',
        title: 'Module 1: React 19 Architecture & Actions',
        lessons: [
          {
            id: 'react-l1',
            title: '1.1 Welcome to React 19 Full-Stack Mastery',
            duration: '09:40',
            type: 'video',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            content: 'In this welcoming lesson, Alex Rivera outlines the course curriculum and explains the major paradigm shift introduced in React 19. Discover how React is transitioning from a client-only library into a unified, server-client full-stack framework.'
          },
          {
            id: 'react-l2',
            title: '1.2 RSC vs Client Components: Serialization & Hydration',
            duration: '16:15',
            type: 'article',
            content: '### Understanding React Server Components (RSC)\n\nIn React 19, components are Server-rendered by default unless declared with the `"use client"` directive. This represents a monumental change in how we structure state and render files.\n\n#### The Hydration Boundary\nServer Components fetch data directly on the backend, reduce browser bundle sizes, and compile HTML instantly. When passing data down from a Server Component to a Client Component, the data must be **serializable** (no functions, complex classes, or raw symbols).\n\n```jsx\n// This is a Server Component (default in Next.js App Router)\nimport { fetchCoursesFromDatabase } from "./db";\nimport ClientFilterList from "./ClientFilterList";\n\nexport default async function Page() {\n  const courses = await fetchCoursesFromDatabase(); // Runs directly on server!\n  \n  return (\n    <main className="p-8">\n      <h1 className="text-xl font-bold">Available Programs</h1>\n      {/* Pass serialized array across the boundary */}\n      <ClientFilterList initialItems={courses} />\n    </main>\n  );\n}\n```'
          },
          {
            id: 'react-l3',
            title: '1.3 Mastering Form Actions & Action State',
            duration: '18:10',
            type: 'video',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            content: '### Handling State Transitions in React 19\n\nReact 19 simplifies async operations inside forms using Native Actions. No more manual `setIsLoading(true)` and `try/catch` wrappers on form submit buttons!\n\n#### Using the useActionState Hook\nThe new `useActionState` hook (formerly `useFormState`) tracks action execution, pending status, and returning payloads automatically.\n\n```typescript\nimport { useActionState } from "react";\nimport { submitEnrollmentAction } from "./actions";\n\nexport default function SignupForm() {\n  // useActionState receives (actionFunction, initialState)\n  const [state, formAction, isPending] = useActionState(\n    async (prevState: any, formData: FormData) => {\n      const email = formData.get("email");\n      const response = await submitEnrollmentAction(email);\n      return response; // returns new state\n    },\n    { success: false, error: null }\n  );\n\n  return (\n    <form action={formAction} className="space-y-4">\n      <input name=\"email\" type=\"email\" required className=\"bg-white/5 border border-white/10 text-white rounded-xl p-3\" />\n      \n      <button \n        type=\"submit\" \n        disabled={isPending}\n        className=\"bg-indigo-600 hover:bg-indigo-500 text-white font-bold p-3 rounded-xl disabled:opacity-50\"\n      >\n        {isPending ? \"Submitting Enrollment...\" : \"Register Now\"}\n      </button>\n\n      {state.error && <p className=\"text-rose-400 text-xs\">{state.error}</p>}\n      {state.success && <p className=\"text-emerald-400 text-xs\">Successfully Enrolled!</p>}\n    </form>\n  );\n}\n```'
          },
          {
            id: 'react-l4',
            title: '1.4 Knowledge Check: React 19 Architecture Quiz',
            duration: '08:30',
            type: 'quiz',
            quizQuestions: [
              {
                question: 'What is the default rendering context for components in React 19 frameworks like Next.js App Router?',
                options: [
                  'They render exclusively as client-side single page apps (SPAs).',
                  'They render as Server Components (RSC) unless marked with the "use client" directive.',
                  'They render as static HTML files with no dynamic hydration possible.',
                  'They must be compiled using Node.js CommonJS require statements.'
                ],
                correctAnswer: 1
              },
              {
                question: 'What type of data can be safely passed from a Server Component to a Client Component?',
                options: [
                  'Any JavaScript value, including functions, class instances, and Event listeners.',
                  'Only strictly serializable values (e.g., strings, numbers, plain objects, arrays).',
                  'No data can be passed between them; they are completely isolated.',
                  'Only raw database connections or environment keys.'
                ],
                correctAnswer: 1
              },
              {
                question: 'Which new React 19 hook is specifically designed to manage async form actions, providing error states and pending statuses?',
                options: [
                  'useEffect()',
                  'useActionState()',
                  'useMemo()',
                  'useContext()'
                ],
                correctAnswer: 1
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-typescript-adv',
    title: 'Advanced TypeScript & Type-Safe Architecture',
    description: 'Master high-level type gymnastics, mapped types, advanced generics, and structural software designs for modern enterprise stacks.',
    longDescription: 'Accelerate your software engineering mastery by developing truly resilient, self-documenting applications. In this course, you will conquer advanced TypeScript concepts including conditional types, template literal types, custom decorators, and structural engineering patterns that prevent bugs at compile-time instead of runtime. Perfect for senior frontend engineers, team leads, and system designers.',
    category: 'Development',
    level: 'Advanced',
    price: 79,
    originalPrice: 199,
    rating: 4.92,
    reviewsCount: 640,
    duration: '12h 45m',
    lessonsCount: 4,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    badge: 'New',
    instructor: {
      name: 'Sarah Drasner',
      role: 'Principal Language Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      bio: 'Sarah is a renowned compiler designer and language architect who has spent 12 years building type systems. She sits on advisory boards for developer tools and teaches thousands of students.',
      rating: 4.96,
      studentsCount: 22100,
      coursesCount: 2
    },
    outcomes: [
      'Construct high-level custom generic utilities utilizing conditional and mapped types',
      'Design type-safe API routers that prevent runtime exceptions using static assertions',
      'Implement compile-time structural patterns for state management validation',
      'Conquer Template Literal Types to dynamically build types from string patterns'
    ],
    modules: [
      {
        id: 'ts-m1',
        title: 'Module 1: High-Level Type Gymnastics',
        lessons: [
          {
            id: 'ts-l1',
            title: '1.1 Deep Dive: Generics, Extends, and Constraints',
            duration: '11:20',
            type: 'video',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            content: 'In this welcoming lesson, we unpack advanced generic bounds, structural typing rules, and how constraints provide powerful safety mechanisms.'
          },
          {
            id: 'ts-l2',
            title: '1.2 Advanced Mapped & Template Literal Types',
            duration: '15:40',
            type: 'article',
            content: '### Mastering Mapped Types and String Literals\n\nTypeScript offers incredibly powerful tools to map and transform existing keys into new type structures dynamically.\n\n#### Template Literal Types\nStarting in TypeScript 4.1, you can combine template literal string signatures with type mapping:\n\n```typescript\ntype Direction = "top" | "bottom" | "left" | "right";\ntype PaddingKey = `padding-${Direction}`;\n// Resolves to: "padding-top" | "padding-bottom" | "padding-left" | "padding-right"\n```'
          }
        ]
      },
      {
        id: 'ts-m2',
        title: 'Module 2: Type-Safe Software Architecture',
        lessons: [
          {
            id: 'ts-l3',
            title: '2.1 Building a Type-Safe Server Response Proxy',
            duration: '19:15',
            type: 'video',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            content: '### Securing Routing with Brand Types\n\nBranded types allow developers to create unique types from primitive strings, ensuring values like Email, UserId, or Currency are not interchangeable.\n\n```typescript\ntype Brand<K, T> = K & { __brand: T };\ntype EmailAddress = Brand<string, "EmailAddress">;\n\nfunction validateEmail(email: string): EmailAddress {\n  if (!email.includes("@")) throw new Error("Invalid format");\n  return email as EmailAddress;\n}\n```'
          },
          {
            id: 'ts-l4',
            title: '2.2 Quiz: Advanced Compiler Options and Utility Types',
            duration: '08:00',
            type: 'quiz',
            quizQuestions: [
              {
                question: 'Which TS config flag enforces that all variables must have an explicit or inferred type, disabling the fallback "any"?',
                options: [
                  'strictNullChecks',
                  'noImplicitAny',
                  'noImplicitReturns',
                  'allowJs'
                ],
                correctAnswer: 1
              },
              {
                question: 'What is a "Branded Type" used for in advanced TypeScript?',
                options: [
                  'To add a marketing logo or copyright notice to your compiled JavaScript files.',
                  'To uniquely tag primitive values so they cannot be accidentally interchanged at compile-time.',
                  'To translate TypeScript types into Python classes.',
                  'To encrypt database keys securely in Node.js server directories.'
                ],
                correctAnswer: 1
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-nextjs-secure',
    title: 'Secure DevOps & Cloud Container Infrastructure',
    description: 'Master full-stack Docker orchestration, secure Linux headers, environment variables isolation, and automated Cloud Run workflows.',
    longDescription: 'Become an indispensable cloud developer. In this comprehensive course, you will learn the exact devops standards required to build, compile, bundle, and deploy fully secure production applications on container systems. Master secret managers, SSL handshakes, reverse proxies, and automated CI/CD pipelines.',
    category: 'Cloud Computing',
    level: 'Advanced',
    price: 149,
    originalPrice: 349,
    rating: 4.88,
    reviewsCount: 390,
    duration: '18h 20m',
    lessonsCount: 3,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    badge: 'Trending',
    instructor: {
      name: 'Marcus Vance',
      role: 'Principal Infrastructure Architect & Devops Lead',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      bio: 'Marcus has over 15 years designing high-availability cloud topologies. Formerly the Devops lead at major financial platforms, he specializes in secure ingress routing and automated pipeline compliance.',
      rating: 4.91,
      studentsCount: 15300,
      coursesCount: 4
    },
    outcomes: [
      'Construct optimized Docker multi-stage build files that reduce image sizes',
      'Implement reverse proxy ingress routing to secure server-side credentials',
      'Deploy fully scalable, zero-coldstart applications on serverless Cloud Run systems',
      'Analyze server headers to implement strict Content Security Policies (CSP)'
    ],
    modules: [
      {
        id: 'cloud-m1',
        title: 'Module 1: Production Bundles & Docker Containers',
        lessons: [
          {
            id: 'cloud-l1',
            title: '1.1 Containerizing Full-Stack Node.js Applications',
            duration: '14:10',
            type: 'video',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            content: '### Writing an Optimized Multi-Stage Dockerfile\n\nWhen deploying a containerized application, reducing image sizes is critical for fast deployment and container auto-scaling.\n\n```dockerfile\n# Stage 1: Build\nFROM node:18-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nRUN npm run build\n\n# Stage 2: Runtime\nFROM node:18-alpine AS runner\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install --only=production\nCOPY --from=builder /app/dist ./dist\nEXPOSE 3000\nCMD ["node", "dist/server.cjs"]\n```'
          },
          {
            id: 'cloud-l2',
            title: '1.2 Secure Ingress & Network Ingress Proxies',
            duration: '16:50',
            type: 'video',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            content: '### Locking Down Server Networks\n\nNever expose raw application ports to the public internet directly. Use an Nginx reverse proxy or cloud-managed load balancer to handle SSL termination, set secure headers, and filter malicious traffic.'
          },
          {
            id: 'cloud-l3',
            title: '1.3 Quiz: Production Deployment & Container Security',
            duration: '09:30',
            type: 'quiz',
            quizQuestions: [
              {
                question: 'Why should you use multi-stage Docker builds for Node.js production deployments?',
                options: [
                  'To make the application run twice as fast in local development.',
                  'To exclude compiler dependencies, reducing the final image footprint and security attack surface.',
                  'To exclude build tools and save deployment time.',
                  'To bypass container port configurations.'
                ],
                correctAnswer: 1
              },
              {
                question: 'Which header should be configured to prevent clickjacking attacks on modern browsers?',
                options: [
                  'Content-Type',
                  'X-Frame-Options: DENY or SAMEORIGIN',
                  'Cache-Control',
                  'Access-Control-Allow-Origin'
                ],
                correctAnswer: 1
              }
            ]
          }
        ]
      }
    ]
  }
];

// Disk-backed student user accounts & sessions storage (survives dev server restarts)
const USERS_FILE = path.join(process.cwd(), 'users.json');
const SESSIONS_FILE = path.join(process.cwd(), 'sessions.json');

function loadUsers(): any[] {
  try {
    if (fs.existsSync(USERS_FILE)) {
      return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error loading users:', err);
  }
  const defaultUsers = [
    {
      id: 'user-demo',
      name: 'Elena Rivera',
      email: 'student@example.com',
      password: 'password123',
      registeredCourseIds: ['course-gemini-ai'],
      verified: true
    }
  ];
  saveUsers(defaultUsers);
  return defaultUsers;
}

function saveUsers(data: any[]) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving users:', err);
  }
}

function loadSessions(): { [token: string]: string } {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      return JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error loading sessions:', err);
  }
  const defaultSessions = {
    'tok_demo_session': 'user-demo'
  };
  saveSessions(defaultSessions);
  return defaultSessions;
}

function saveSessions(data: { [token: string]: string }) {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving sessions:', err);
  }
}

const users = loadUsers();
const sessions = loadSessions();

// In-memory payment and transaction ledger (simulates Stripe webhooks / web stores database)
const transactions: any[] = [
  {
    id: 'tx_demo101',
    courseId: 'course-gemini-ai',
    courseTitle: 'Next-Gen AI Engineering with Gemini API',
    amount: 99,
    status: 'succeeded',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    cardBrand: 'visa',
    last4: '4242',
    mode: 'sandbox'
  }
];

// Lazy helper to check and retrieve Stripe instance
function getStripe(): Stripe | null {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey || stripeKey === 'MY_STRIPE_SECRET_KEY' || stripeKey.trim() === '') {
    return null;
  }
  return new Stripe(stripeKey, {
    apiVersion: '2025-01-27-preview' as any,
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ==================== AUTHENTICATION ENDPOINTS ====================
  app.post('/api/auth/signup', (req, res) => {
    const { name, email, password, registeredCourseIds } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: 'Missing name, email, or password' });
      return;
    }

    const emailLower = email.trim().toLowerCase();
    const existingUser = users.find(u => u.email === emailLower);
    if (existingUser) {
      res.status(400).json({ error: 'This email is already registered.' });
      return;
    }

    // Generate a 6-digit simulated verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = {
      id: `user-${Math.random().toString(36).substring(2, 9)}`,
      name: name.trim(),
      email: emailLower,
      password: password, // In-memory development demo plaintext password
      registeredCourseIds: registeredCourseIds || [],
      verified: false,
      verificationCode
    };

    users.push(newUser);
    saveUsers(users);

    // Return the verification details so the front-end can display/simulated-receive it
    res.status(201).json({
      success: true,
      requiresVerification: true,
      email: newUser.email,
      verificationCode,
      message: 'Simulated verification code sent to your email.'
    });
  });

  app.post('/api/auth/verify', (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) {
      res.status(400).json({ error: 'Missing email or verification code' });
      return;
    }

    const emailLower = email.trim().toLowerCase();
    const user = users.find(u => u.email === emailLower);
    if (!user) {
      res.status(404).json({ error: 'User student record not found.' });
      return;
    }

    if (user.verified) {
      res.status(400).json({ error: 'User is already verified.' });
      return;
    }

    if (user.verificationCode !== code) {
      res.status(400).json({ error: 'Invalid 6-digit verification code. Please check and try again.' });
      return;
    }

    // Mark as verified and clean up verification code
    user.verified = true;
    delete user.verificationCode;
    saveUsers(users);

    // Create a login session directly upon successful verification
    const token = `tok_${Math.random().toString(36).substring(2, 11)}`;
    sessions[token] = user.id;
    saveSessions(sessions);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        verified: user.verified,
        registeredCourseIds: user.registeredCourseIds
      }
    });
  });

  app.post('/api/auth/resend-code', (req, res) => {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Missing email address' });
      return;
    }

    const emailLower = email.trim().toLowerCase();
    const user = users.find(u => u.email === emailLower);
    if (!user) {
      res.status(404).json({ error: 'User student record not found.' });
      return;
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = verificationCode;
    saveUsers(users);

    res.json({
      success: true,
      verificationCode,
      message: 'A new simulated 6-digit verification code has been generated.'
    });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Missing email or password' });
      return;
    }

    const emailLower = email.trim().toLowerCase();
    const user = users.find(u => u.email === emailLower);
    if (!user || user.password !== password) {
      res.status(400).json({ error: 'Invalid email or password.' });
      return;
    }

    // Check if account has been verified yet
    if (!user.verified) {
      res.status(403).json({
        error: 'Email verification required.',
        requiresVerification: true,
        email: user.email,
        verificationCode: user.verificationCode
      });
      return;
    }

    const token = `tok_${Math.random().toString(36).substring(2, 11)}`;
    sessions[token] = user.id;
    saveSessions(sessions);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        verified: user.verified,
        registeredCourseIds: user.registeredCourseIds
      }
    });
  });

  app.get('/api/auth/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized. No token provided.' });
      return;
    }

    const token = authHeader.substring(7);
    const userId = sessions[token];
    const user = users.find(u => u.id === userId);

    if (!user) {
      res.status(401).json({ error: 'Session expired or invalid.' });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        verified: user.verified,
        registeredCourseIds: user.registeredCourseIds
      }
    });
  });

  app.post('/api/auth/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      delete sessions[token];
      saveSessions(sessions);
    }
    res.json({ success: true });
  });
  // ==================== END AUTHENTICATION ENDPOINTS ====================

  // 1. Get Course Catalog
  app.get('/api/courses', (req, res) => {
    res.json(courses);
  });

  // 2. Add custom course (for teacher simulation)
  app.post('/api/courses', (req, res) => {
    const { title, description, category, price, level, image, instructorName, longDescription } = req.body;
    
    if (!title || !price || !description) {
      res.status(400).json({ error: 'Missing required course fields (title, price, description)' });
      return;
    }

    const newCourse = {
      id: `course-custom-${Math.random().toString(36).substring(2, 9)}`,
      title,
      description,
      longDescription: longDescription || description,
      category: category || 'General',
      level: level || 'All Levels',
      price: Number(price),
      originalPrice: Math.round(Number(price) * 1.5),
      rating: 5.0,
      reviewsCount: 1,
      duration: '4h 0m',
      lessonsCount: 3,
      image: image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
      badge: 'New',
      instructor: {
        name: instructorName || 'Guest Instructor',
        role: 'Professional Educator',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
        bio: 'Simulated custom instructor profile created in real-time.',
        rating: 5.0,
        studentsCount: 1,
        coursesCount: 1
      },
      outcomes: [
        'Understand fundamental concepts of ' + title,
        'Apply hands-on skills through immersive mock sessions',
        'Receive certification of structural program completion'
      ],
      modules: [
        {
          id: `mod-1`,
          title: 'Module 1: Orientation & Fundamentals',
          lessons: [
            {
              id: `less-1`,
              title: 'Welcome and Core Foundations',
              duration: '06:30',
              type: 'video' as const,
              videoUrl: 'https://www.w3schools.com/html/movie.mp4',
              content: 'Let\'s unpack the curriculum of this custom course.'
            },
            {
              id: `less-2`,
              title: 'Practical Application Guide',
              duration: '10:15',
              type: 'article' as const,
              content: '### Hands-on Practice Guide\n\nStudy this guide to quickly understand the key workflows.'
            }
          ]
        }
      ]
    };

    courses.push(newCourse);
    res.status(201).json(newCourse);
  });

  // 3. Create Stripe Checkout Session (Real or Simulated fallback)
  app.post('/api/create-checkout-session', async (req, res) => {
    try {
      const { courseId, email } = req.body;
      const targetCourse = courses.find(c => c.id === courseId);
      
      if (!targetCourse) {
        res.status(404).json({ error: 'Course not found' });
        return;
      }

      const stripeClient = getStripe();
      
      if (stripeClient) {
        // Build real checkout session
        const origin = req.headers.origin || process.env.APP_URL || 'http://localhost:3000';
        const session = await stripeClient.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: targetCourse.title,
                  description: targetCourse.description,
                  images: targetCourse.image ? [targetCourse.image] : [],
                },
                unit_amount: Math.round(targetCourse.price * 100), // Stripe expects cents
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${origin}/?session_id={CHECKOUT_SESSION_ID}&course_id=${courseId}&success=true`,
          cancel_url: `${origin}/?course_id=${courseId}&canceled=true`,
          customer_email: email || undefined,
          metadata: {
            courseId: courseId,
            courseTitle: targetCourse.title,
          }
        });

        res.json({ id: session.id, url: session.url, mode: 'real' });
      } else {
        // No Stripe credentials or using default placeholder key.
        // Respond with 'sandbox' mode. The client will catch this response and display
        // the elegant, high-fidelity Sandbox Stripe checkout flow in the browser interface!
        const sandboxSessionId = `cs_sandbox_${Math.random().toString(36).substring(2, 11)}`;
        res.json({ id: sandboxSessionId, url: null, mode: 'sandbox', course: targetCourse });
      }
    } catch (err: any) {
      console.error('Stripe session creation error:', err);
      res.status(500).json({ error: err.message || 'Stripe initialization failed' });
    }
  });

  // 4. Record a Sandbox transaction success
  app.post('/api/record-sandbox-payment', (req, res) => {
    const { courseId, cardBrand, last4, amount } = req.body;
    const targetCourse = courses.find(c => c.id === courseId);
    
    if (!targetCourse) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    // Try to find if user is authenticated and bind course to student ledger
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const userId = sessions[token];
      if (userId) {
        const user = users.find(u => u.id === userId);
        if (user) {
          if (!user.registeredCourseIds.includes(courseId)) {
            user.registeredCourseIds.push(courseId);
            saveUsers(users);
          }
        }
      }
    }

    const newTx = {
      id: `tx_sandbox_${Math.random().toString(36).substring(2, 9)}`,
      courseId,
      courseTitle: targetCourse.title,
      amount: amount || targetCourse.price,
      status: 'succeeded',
      createdAt: new Date().toISOString(),
      cardBrand: cardBrand || 'visa',
      last4: last4 || '4242',
      mode: 'sandbox'
    };

    transactions.push(newTx);
    res.json({ success: true, transaction: newTx });
  });

  // 5. Retrieve Stripe Transactions list (for Stripe console developer telemetry)
  app.get('/api/transactions', (req, res) => {
    res.json(transactions);
  });

  // 6. Config endpoint to reveal active Stripe settings without leaking secrets
  app.get('/api/stripe-config', (req, res) => {
    const key = process.env.STRIPE_SECRET_KEY;
    const hasKey = !!key && key !== 'MY_STRIPE_SECRET_KEY' && key.trim() !== '';
    res.json({
      activeMode: hasKey ? 'Stripe Production/Test (Real Checkout)' : 'Interactive Sandbox (Simulated Checkout)',
      hasStripeSecretKey: hasKey,
      webhookUrl: `${process.env.APP_URL || 'http://localhost:3000'}/api/stripe-webhook`
    });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
