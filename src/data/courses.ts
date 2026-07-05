import { Course } from '../types';

export const INITIAL_COURSES: Course[] = [
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
    lessonsCount: 18,
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
        title: 'Module 1: Getting Started & SDK Fundamentals',
        lessons: [
          {
            id: 'gemini-l1',
            title: 'Welcome to Next-Gen AI Engineering',
            duration: '08:15',
            type: 'video',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            content: 'In this introductory video, Dr. Sarah Lin welcomes you to the course and sets expectations for what we will build. Get ready to dive deep into Gemini 2.5 and multimodal models!'
          },
          {
            id: 'gemini-l2',
            title: 'API Authentication & SDK Integration Checklist',
            duration: '12:40',
            type: 'article',
            content: `### Securing Your API Keys in Server-Side Environments

When developing applications powered by the Google GenAI SDK, keeping your API keys safe is paramount. Never expose your \`GEMINI_API_KEY\` to the client-side browser bundle, as it can be easily inspected, stolen, and abused.

#### Secure Full-Stack Architecture
Always use a full-stack design where your client requests are proxied through an Express or Next.js server. 

\`\`\`typescript
// server.ts - Safe Server-Side Execution
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/generate', async (req, res) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: req.body.prompt,
  });
  res.json(response);
});
\`\`\`

#### Check Your Config
1. Ensure your keys are defined inside \`.env\` and NEVER committed to GitHub.
2. In production, use secret manager vaults.
3. Keep CORS headers strictly restricted to your specific domains.`
          },
          {
            id: 'gemini-l3',
            title: 'Knowledge Check: API & SDK Basics',
            duration: '05:00',
            type: 'quiz',
            quizQuestions: [
              {
                question: 'Which is the recommended practice for managing your GEMINI_API_KEY?',
                options: [
                  'Embed it directly in the client-side React code to avoid server overhead.',
                  'Store it securely in environment variables on a server-side route.',
                  'Put it in public GitHub repositories as it is restricted automatically.',
                  'Save it in a client-side localStorage bucket.'
                ],
                correctAnswer: 1
              },
              {
                question: 'Which Google GenAI SDK is utilized in modern Node/TypeScript projects?',
                options: [
                  '@google/generative-ai (Legacy)',
                  '@google/genai (Modern/Unified)',
                  'google-ai-studio-sdk',
                  'gcloud-node-ai'
                ],
                correctAnswer: 1
              }
            ]
          }
        ]
      },
      {
        id: 'gemini-m2',
        title: 'Module 2: Structured Outputs & Function Calling',
        lessons: [
          {
            id: 'gemini-l4',
            title: 'Mastering Structured JSON Outputs',
            duration: '18:45',
            type: 'video',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4'
          },
          {
            id: 'gemini-l5',
            title: 'Deep Dive: Real-time Function Calling',
            duration: '22:10',
            type: 'video',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
          },
          {
            id: 'gemini-l6',
            title: 'Challenge: Building a Local Agent Scheduler',
            duration: '15:00',
            type: 'article',
            content: `### Hands-on Challenge: Autonomous Agent Scheduling

For this challenge, you will write a server-side controller that utilizes Gemini Function Calling to inspect local system states and execute actions automatically.

#### Requirements:
- Declare a \`scheduleMeeting\` and \`cancelMeeting\` tool definition.
- Supply the system instructions detailing a courteous, context-aware office assistant.
- Handle model callbacks recursively until the model decides to stop.

\`\`\`typescript
const tools = [{
  functionDeclarations: [{
    name: 'scheduleMeeting',
    description: 'Book a conference room for a specific time.',
    parameters: {
      type: 'OBJECT',
      properties: {
        room: { type: 'STRING', description: 'Room name' },
        time: { type: 'STRING', description: 'ISO time string' }
      },
      required: ['room', 'time']
    }
  }]
}];
\`\`\``
          }
        ]
      }
    ]
  },
  {
    id: 'course-react-fullstack',
    title: 'Enterprise React 19 & Full-Stack Mastery',
    description: 'Learn Next.js App Router, React Server Components, server actions, advanced state machines, and performant server configurations.',
    longDescription: 'Go from intermediate developer to frontend architect. React 19 introduces game-changing primitives like Server Components, Server Actions, the new use() hook, form actions, and native support for asset loading. In this course, we bypass the basic todo apps and build high-performance, edge-rendered full-stack apps with secure API gateways, WebSockets, and heavy database scaling.',
    category: 'Development',
    level: 'Advanced',
    price: 129,
    originalPrice: 299,
    rating: 4.85,
    reviewsCount: 980,
    duration: '21h 15m',
    lessonsCount: 24,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
    badge: 'Highly Rated',
    instructor: {
      name: 'Alex Rivera',
      role: 'Principal Software Architect',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      bio: 'Alex Rivera is an open-source contributor and software architect with over 15 years in full-stack JavaScript. He has led engineering squads at premium tech platforms and consults on micro-frontend systems.',
      rating: 4.89,
      studentsCount: 32000,
      coursesCount: 5
    },
    outcomes: [
      'Understand React Server Components (RSC) vs Client Components',
      'Optimize database queries using modern ORMs (Drizzle/Prisma)',
      'Manage global state using lightweight, highly performant custom reactive patterns',
      'Integrate production-grade security, OAuth 2.0 and JWT authorization',
      'Optimize Core Web Vitals to achieve pristine Lighthouse scores of 100'
    ],
    modules: [
      {
        id: 'react-m1',
        title: 'Module 1: The React 19 Architecture Shift',
        lessons: [
          {
            id: 'react-l1',
            title: 'Why React Server Components (RSCs) Matter',
            duration: '15:30',
            type: 'video',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4'
          },
          {
            id: 'react-l2',
            title: 'Deep Dive into React 19 Suspense & Streaming',
            duration: '20:10',
            type: 'article',
            content: `### React 19 Suspense and Streaming SSR

In standard Single-Page Applications (SPAs) or server-rendered pages without streaming, the user has to wait for the entire page to compile on the server before getting a single byte of HTML.

#### The Power of Streaming
With React 19, you can stream HTML components as they resolve on the server! By wrapping slowly-resolving database-dependent widgets in a \`<Suspense>\` boundary, the rest of the shell page is delivered immediately.

\`\`\`tsx
// CourseList.tsx
import { Suspense } from 'react';
import { CourseSkeleton, HeavyDatabaseList } from './components';

export default function Catalog() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold font-sans">Available Courses</h1>
      
      <Suspense fallback={<CourseSkeleton />}>
        <HeavyDatabaseList />
      </Suspense>
    </div>
  );
}
\`\`\`

#### Key Benefits:
- **Interactive TTFB**: Time-To-First-Byte drops to milliseconds.
- **Improved SEO**: Crawlers receive semantic markup while loaders are spinning.
- **Isolate Slow Dependencies**: If one external API is slow, it doesn\'t lock up the whole page.`
          },
          {
            id: 'react-l3',
            title: 'Concept Check: Suspense & RSC',
            duration: '06:00',
            type: 'quiz',
            quizQuestions: [
              {
                question: 'Which component type executes exclusively on the server, sending zero JavaScript to the browser?',
                options: [
                  'React Client Components (marked with "use client")',
                  'React Server Components (the default in modern routers)',
                  'Legacy class components',
                  'Hydrated Context providers'
                ],
                correctAnswer: 1
              },
              {
                question: 'What happens to the browser UI during streaming HTML when slow components resolve?',
                options: [
                  'The screen flashes white as the page reloads.',
                  'The Suspense placeholder is seamlessly replaced with the fully rendered component.',
                  'Nothing, because the browser freezes until execution ends.',
                  'The user is redirected to an error boundary.'
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
    id: 'course-uiux-design',
    title: 'Visual Craft: Modern UI & UX Design Systems',
    description: 'Learn the secrets of typography pairings, micro-interactions, responsive spatial rhythms, and scalable Figma systems to build high-end UIs.',
    longDescription: 'Design is not about defaults. It is about emotional intent. In this industry-standard course, you’ll master the art of visual hierarchy. We explore advanced typography principles (Space Grotesk, Inter, Playfair pairing), spacing theory, dark mode contrast compliance, high-frequency layouts (Bento grids, modular sidebars), and micro-animations with Framer Motion that direct attention and delight visitors.',
    category: 'Design & UX',
    level: 'All Levels',
    price: 79,
    originalPrice: 199,
    rating: 4.92,
    reviewsCount: 1510,
    duration: '9h 45m',
    lessonsCount: 12,
    image: 'https://images.unsplash.com/photo-1561070791-26c113006238?auto=format&fit=crop&q=80&w=800',
    badge: 'Premium Craft',
    instructor: {
      name: 'Elena Rostova',
      role: 'Creative Director & Lead UX Consultant',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      bio: 'Elena is a multidisciplinary award-winning designer. She has spent a decade redesigning consumer digital applications and crafting sleek design systems that combine minimalist brutalist vibes with fluid functional feedback.',
      rating: 4.96,
      studentsCount: 22800,
      coursesCount: 2
    },
    outcomes: [
      'Design comprehensive responsive layout guides using proportional spatial rhythm',
      'Select, pair, and scale typography fonts to convey premium product values',
      'Animate high-fidelity fluid micro-interactions using Framer Motion (or motion/react)',
      'Analyze and execute perfect contrast ratios to comply with global accessibility WCAG standards',
      'Build a fully reusable UI component package inside Figma and Tailwind'
    ],
    modules: [
      {
        id: 'design-m1',
        title: 'Module 1: Spatial Grid Systems & Rhythms',
        lessons: [
          {
            id: 'design-l1',
            title: 'The Golden Rule of Visual Rhythms',
            duration: '11:20',
            type: 'video',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4'
          },
          {
            id: 'design-l2',
            title: 'Typography: Designing with Purpose',
            duration: '14:50',
            type: 'article',
            content: `### Typography: The Soul of Your Digital Interface

Typography is more than selecting a legible typeface. It sets the rhythm, defines the hierarchy, and gives your application its underlying voice and emotional tone.

#### The Hierarchy Paradigm
Every digital interface benefits from strict, purposeful font scaling. Combining display fonts with balanced interface sans-serif typefaces keeps the layout elegant.

| Level | Size | Weight | Tracking | Recommended Use |
| :--- | :--- | :--- | :--- | :--- |
| **Display H1** | \`3rem\` (48px) | Bold / Black | \`-0.025em\` (Tight) | Large Hero Titles |
| **Heading H2** | \`2rem\` (32px) | Medium / Semibold | \`-0.02em\` | Section Title, Features |
| **Body text** | \`1rem\` (16px) | Regular | \`0\` | Long paragraphs, reviews |
| **UI Mono** | \`0.75rem\` (12px) | Medium | \`0.05em\` (Wide) | System metrics, tags |

#### Best Practices for High-Contrast Clean Layouts
1. **Never use generic pure black** (\`#000000\`) for long paragraphs. Prefer a deep charcoal gray (\`#111827\` or \`#1f2937\`) to reduce eye strain.
2. **Line Heights**: Always set generous line spacing for paragraph copy (\`leading-relaxed\` or \`leading-loose\` in Tailwind, which equates to \`1.6\`–\`1.8\` of the font size).
3. **Tracking (Letter-Spacing)**: Tighten headings (\`-tracking-wide\` is generally a trap for titles; use \`-tracking-tight\`), but expand uppercase mono labels for metadata (\`tracking-widest\`).`
          }
        ]
      }
    ]
  }
];
