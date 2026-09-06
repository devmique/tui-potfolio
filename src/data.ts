export const ME = {
  name: 'Johnlord Mique',
  role: 'Full-Stack Developer',
  location: 'Las Piñas, PH',
  email: 'miquejt13@gmail.com',
  phone: '0992 301 5722',
  tagline:
    'Information Technology Undergraduate — building efficient software solutions. Specializes in problem-solving, design, and crafting applications that blend performance with great user experience.',
  titles: ['MERN Stack Developer', 'Full-Stack Developer', 'React Developer'],
  links: [
    { label: 'GitHub', url: 'https://github.com/devmique' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/johnlord-mique-40b5a1342/' },
  ],
}

export const EXPERIENCE = [
  {
    role: 'Full-Stack Developer Intern',
    company: 'Endsofttech Web Solutions',
    period: 'Jun 2026 — Sep 2026',
    description: [
      'Developed CRM features including promo ads tracking, an SMS credit balance monitor (iSMS API), SMTP2GO email-open tracking, a PDF quotation generator, and in-app email/SMS messaging — reducing reliance on external tools for client communication.',
      'Implemented full SEO and Open Graph metadata (canonical URLs, environment-based robots rules, meta descriptions, og:image) across the Vet Assist marketing site, improving search visibility and social link previews.',
      'Built a referral link feature on the intake form that syncs directly with the CRM\'s lead pipeline, streamlining lead capture for the sales team.',
      'Debugged and resolved UI issues across Vet Assist, a B2B multi-tenant SaaS platform for veterinary clinics — fixing PDF layout breaks, styling inconsistencies, and misaligned elements.',
      'Rebuilt the calendar UI with Shadcn-UI, applying reusable component patterns that cut code duplication across the codebase.',
      'Authored sequential SQL migrations for the CRM to support safe, incremental schema changes.',
    ],
  },
]

export const SKILLS = [
  'HTML', 'CSS', 'JavaScript', 'Tailwind CSS', 'React', 'TypeScript', 'Next.js',
  'Node.js', 'Express', 'MySQL', 'MongoDB', 'PostgreSQL', 'Git', 'Supabase', 'Docker', 'Github Actions', 'Zod', 'Vercel', 'Render', 'Firebase', 'Neon', 'Redis', 'Prisma', 'TanStack Query',
]

export type Project = {
  name: string
  subtitle: string
  desc: string
  tech: string[]
  github: string
  live?: string
}

export const PROJECTS: Project[] = [
  {
    name: 'TranSync PH',
    subtitle: 'B2B SaaS Bus Operator Management System',
    desc: 'A B2B SaaS platform for Philippine bus operators to manage routes, schedules, and terminals — with a public commuter map for terminal locations, live trip locations, and routes with schedule info.',
    tech: ['Next.js', 'Tailwind CSS', 'Shadcn-UI', 'MongoDB', 'Leaflet', 'Zod', 'Vercel', 'Render'],
    github: 'https://github.com/devmique/b2b-saas-bus-operator-management-system',
    live: 'https://transyncph.vercel.app/',
  },
  {
    name: 'AInterview',
    subtitle: 'A Job Interview Preparation Platform',
    desc: 'A job interview preparation platform powered by Vapi AI Voice Agents and Google Gemini, for real-time AI-driven interview practice with instant feedback.',
    tech: ['Next.js', 'Firebase', 'Tailwind CSS', 'Vapi AI', 'Shadcn-UI', 'Google Gemini', 'Zod', 'Vercel'],
    github: 'https://github.com/devmique/ai-mock-interview',
    live: 'https://ai-mock-interview-chi-nine.vercel.app',
  },
  {
    name: 'Parents Portal Management System',
    subtitle: 'School ↔ parent communication platform',
    desc: 'A full-stack school management platform connecting schools and parents — attendance, grades, class schedules, events, and direct communication.',
    tech: ['React.js', 'Node.js', 'Express.js', 'Redis', 'MySQL', 'Google Gemini'],
    github: 'https://github.com/devmique/full-stack-parents-portal',
  },
  {
    name: 'WorkspaceOS',
    subtitle: 'A SaaS Workspace Dashboard',
    desc: 'A SaaS app showcasing production-ready patterns: Row Level Security, Server Actions, optimistic UI updates, and multi-tenancy with activity tracking.',
    tech: ['Next.js', 'TailwindCSS', 'Supabase', 'Shadcn-UI', 'Recharts', 'Vercel'],
    github: 'https://github.com/devmique/saas-workspace-dashboard/',
    live: 'https://saas-workspace-dashboard.vercel.app/',
  },
  {
    name: 'Student Violation Tracking System',
    subtitle: 'Violation monitoring for school administrators',
    desc: 'A full-stack app for managing and monitoring student violations, with detailed per-student profiles for administrators.',
    tech: ['React.js', 'TypeScript', 'TailwindCSS', 'Shadcn-UI', 'Node.js', 'Express.js', 'MongoDB'],
    github: 'https://github.com/devmique/student_violation_tracking_system',
  },
]

export type Certificate = { title: string; issueDate: string; image: string }
export type CertificateAlbum = { issuer: string; color: string; certificates: Certificate[] }

// images are served straight out of public/certificates/ — no imports, no alias, and
// every path below is also the shareable URL that opens the full certificate.
export const CERTIFICATE_ALBUMS: CertificateAlbum[] = [
  {
    issuer: 'Coursera',
    color: '217 91% 60%',
    certificates: [
      { title: 'Introduction to Next.js', issueDate: 'Aug 2025', image: '/certificates/cert12.png' },
      { title: 'TypeScript in React', issueDate: 'Aug 2025', image: '/certificates/cert14.png' },
      { title: 'Introduction to Software Engineering', issueDate: 'Aug 2025', image: '/certificates/cert13.png' },
    ],
  },
  {
    issuer: 'Sololearn',
    color: '152 69% 45%',
    certificates: [
      { title: 'Introduction to C++', issueDate: 'Feb 2024', image: '/certificates/cert6.jpg' },
      { title: 'Introduction to Java', issueDate: 'Apr 2024', image: '/certificates/cert7.jpg' },
      { title: 'Java Intermediate', issueDate: 'Sept 2024', image: '/certificates/cert8.jpg' },
      { title: 'Introduction to Python', issueDate: 'Aug 2024', image: '/certificates/cert9.jpg' },
      { title: 'Python Intermediate', issueDate: 'Aug 2024', image: '/certificates/cert10.jpg' },
      { title: 'Introduction to JavaScript', issueDate: 'June 2024', image: '/certificates/cert2.jpg' },
      { title: 'JavaScript Intermediate', issueDate: 'Jul 2024', image: '/certificates/cert3.jpg' },
      { title: 'Introduction to SQL', issueDate: 'Oct 2024', image: '/certificates/cert4.jpg' },
      { title: 'SQL Intermediate', issueDate: 'Nov 2024', image: '/certificates/cert5.jpg' },
      { title: 'Generative AI', issueDate: 'Mar 2026', image: '/certificates/cert16.jpg' },
      { title: 'Vibe Coding', issueDate: 'Mar 2026', image: '/certificates/cert15.jpg' },
    ],
  },
  {
    issuer: 'Mimo',
    color: '271 91% 65%',
    certificates: [
      { title: 'Full-Stack Development', issueDate: 'Apr 2025', image: '/certificates/cert1.jpg' },
      { title: 'Back-End Development', issueDate: 'Apr 2025', image: '/certificates/cert11.jpg' },
    ],
  },
  {
    issuer: 'Anthropic',
    color: '25 95% 53%',
    certificates: [
      { title: 'Building with the Claude API', issueDate: 'Aug 2026', image: '/certificates/cert17.jpg' },
      { title: 'Introduction to Model Context Protocol', issueDate: 'Aug 2026', image: '/certificates/cert18.jpg' },
    ],
  },
  {
    issuer: 'Alison',
    color: '0 90% 55%',
    certificates: [
      { title: 'Diploma in DevOps Engineering - Kubernetes, Docker and Google Cloud', issueDate: 'Sep 2026', image: 'https://alison.com/verify/632c42fdac' },
    ],
  },
]

export const RESUME_FILE = '/johnlord_mique_resume.pdf'

export const BOOT_TEXT = `Sodikin PowerShell
Copyright (C) Johnlord Mique. All rights reserved.

Try our old portfolio website https://devmiquev1.vercel.app/

`

// figlet "ANSI Shadow" block wordmark (65 cols) — regenerate with wordmark.mjs
export const WORDMARK = [
  '██████╗ ███████╗██╗   ██╗███╗   ███╗██╗ ██████╗ ██╗   ██╗███████╗',
  '██╔══██╗██╔════╝██║   ██║████╗ ████║██║██╔═══██╗██║   ██║██╔════╝',
  '██║  ██║█████╗  ██║   ██║██╔████╔██║██║██║   ██║██║   ██║█████╗',
  '██║  ██║██╔══╝  ╚██╗ ██╔╝██║╚██╔╝██║██║██║▄▄ ██║██║   ██║██╔══╝',
  '██████╔╝███████╗ ╚████╔╝ ██║ ╚═╝ ██║██║╚██████╔╝╚██████╔╝███████╗',
  '╚═════╝ ╚══════╝  ╚═══╝  ╚═╝     ╚═╝╚═╝ ╚══▀▀═╝  ╚═════╝ ╚══════╝',
].join('\n')
