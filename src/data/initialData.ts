import { Task, DocumentItem, TeamMember, ActivityLog, ProjectSummary } from '../types';

export const initialProjects: ProjectSummary[] = [
  {
    id: 'proj-1',
    name: 'Cloud Infrastructure Migration',
    key: 'CLOUD',
    color: 'bg-indigo-500',
    description: 'Migrating legacy monolith to Cloud Run containerized microservices.',
    taskCount: 12,
    completedCount: 8,
  },
  {
    id: 'proj-2',
    name: 'AI Studio Workspace Suite',
    key: 'AIHUB',
    color: 'bg-emerald-500',
    description: 'Building modern productivity & intelligence web platform.',
    taskCount: 8,
    completedCount: 5,
  },
  {
    id: 'proj-3',
    name: 'Security & Compliance Audit',
    key: 'SEC',
    color: 'bg-amber-500',
    description: 'Preparing SOC2 compliance & automated secret scanning pipeline.',
    taskCount: 6,
    completedCount: 4,
  },
];

export const initialTeam: TeamMember[] = [
  {
    id: 'mem-1',
    name: 'Alex Rivera',
    email: 'alex.r@nexus.io',
    role: 'Lead Full-Stack Architect',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    status: 'active',
    tasksAssigned: 5,
  },
  {
    id: 'mem-2',
    name: 'Sarah Chen',
    email: 'sarah.c@nexus.io',
    role: 'Staff Product Manager',
    department: 'Product',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    status: 'active',
    tasksAssigned: 3,
  },
  {
    id: 'mem-3',
    name: 'Marcus Vance',
    email: 'marcus.v@nexus.io',
    role: 'Senior DevOps Engineer',
    department: 'Infrastructure',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    status: 'busy',
    tasksAssigned: 4,
  },
  {
    id: 'mem-4',
    name: 'Elena Rostova',
    email: 'elena.r@nexus.io',
    role: 'Principal UX Designer',
    department: 'Design',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
    status: 'offline',
    tasksAssigned: 2,
  },
];

export const initialTasks: Task[] = [
  {
    id: 'TASK-101',
    title: 'Configure Cloud Run Container Auto-Scaling Rules',
    description: 'Set up CPU and request latency triggers with minimum replica count set to 1 for zero-cold-start stability.',
    status: 'in_progress',
    priority: 'urgent',
    assignee: initialTeam[2],
    dueDate: '2026-07-25',
    tags: ['DevOps', 'Cloud Run', 'Production'],
    project: 'Cloud Infrastructure Migration',
    createdAt: '2026-07-18',
    subtasks: [
      { id: 'sub-1', title: 'Test scale-to-zero response times', completed: true },
      { id: 'sub-2', title: 'Define environment variable overrides', completed: true },
      { id: 'sub-3', title: 'Verify custom domain SSL certificate', completed: false },
    ],
  },
  {
    id: 'TASK-102',
    title: 'Implement Server-Side Gemini API Request Proxy',
    description: 'Proxy AI generation calls through Express server `/api/ai/generate` to protect environment secrets.',
    status: 'done',
    priority: 'high',
    assignee: initialTeam[0],
    dueDate: '2026-07-20',
    tags: ['Backend', 'Security', 'Gemini'],
    project: 'AI Studio Workspace Suite',
    createdAt: '2026-07-16',
    subtasks: [
      { id: 'sub-4', title: 'Integrate @google/genai SDK', completed: true },
      { id: 'sub-5', title: 'Sanitize prompt context inputs', completed: true },
      { id: 'sub-6', title: 'Add fallback error handling', completed: true },
    ],
  },
  {
    id: 'TASK-103',
    title: 'Design Dark/Light Glassmorphism Theme Tokens',
    description: 'Refine Tailwind utility variables to meet WCAG AA contrast standards while keeping sleek modern layout.',
    status: 'in_progress',
    priority: 'medium',
    assignee: initialTeam[3],
    dueDate: '2026-07-28',
    tags: ['Design System', 'UI/UX'],
    project: 'AI Studio Workspace Suite',
    createdAt: '2026-07-19',
    subtasks: [
      { id: 'sub-7', title: 'Audit typography scale ratios', completed: true },
      { id: 'sub-8', title: 'Test responsive canvas sizing on mobile', completed: false },
    ],
  },
  {
    id: 'TASK-104',
    title: 'Conduct Automated SOC2 Compliance Audit Scan',
    description: 'Run automated static code analysis and dependency vulnerability checks before production release.',
    status: 'todo',
    priority: 'high',
    assignee: initialTeam[1],
    dueDate: '2026-07-30',
    tags: ['Security', 'Compliance'],
    project: 'Security & Compliance Audit',
    createdAt: '2026-07-21',
    subtasks: [
      { id: 'sub-9', title: 'Generate dependency audit lockfile report', completed: false },
      { id: 'sub-10', title: 'Configure secret leakage scanner', completed: false },
    ],
  },
  {
    id: 'TASK-105',
    title: 'Optimize Recharts Dashboard Rendering Performance',
    description: 'Memoize heavy dataset transformations and wrap chart components in dynamic resize containers.',
    status: 'review',
    priority: 'medium',
    assignee: initialTeam[0],
    dueDate: '2026-07-24',
    tags: ['Frontend', 'Performance'],
    project: 'AI Studio Workspace Suite',
    createdAt: '2026-07-17',
    subtasks: [
      { id: 'sub-11', title: 'Add ResizeObserver to Chart Wrapper', completed: true },
      { id: 'sub-12', title: 'Verify mobile layout reflows', completed: true },
    ],
  },
  {
    id: 'TASK-106',
    title: 'Set Up Automated Database Backup Policy',
    description: 'Configure automated snapshot schedules with point-in-time recovery enabled.',
    status: 'todo',
    priority: 'low',
    assignee: initialTeam[2],
    dueDate: '2026-08-02',
    tags: ['Database', 'Backup'],
    project: 'Cloud Infrastructure Migration',
    createdAt: '2026-07-22',
    subtasks: [
      { id: 'sub-13', title: 'Document restoration playbook', completed: false },
    ],
  },
];

export const initialDocs: DocumentItem[] = [
  {
    id: 'DOC-1',
    title: 'Production Deployment & Architecture Spec',
    category: 'Architecture',
    tags: ['Deployment', 'Cloud Run', 'Vite'],
    author: 'Alex Rivera',
    lastUpdated: '10 mins ago',
    pinned: true,
    content: `# Production Deployment & Architecture Spec

## 1. Environment Architecture
The Nexus Hub application runs in containerized Cloud Run instances using **Express + Vite**. 

- **Frontend Port**: Serves single-page application on Port 3000.
- **Backend API Routes**: Express handles \`/api/*\` proxy routes.
- **AI Integration**: Server-side proxy calls Gemini 2.5 models cleanly via \`@google/genai\`.

## 2. Key Deployment Principles
1. **Single Entry Point**: Express handles both API endpoints and static SPA delivery.
2. **Secret Management**: Environment variables like \`GEMINI_API_KEY\` are read server-side only.
3. **Resilience**: Client state is persisted locally while syncing with cloud services.
`,
  },
  {
    id: 'DOC-2',
    title: 'Sprint 24 Strategic PRD: AI Workspace Tooling',
    category: 'PRD',
    tags: ['Product', 'Sprint 24', 'AI'],
    author: 'Sarah Chen',
    lastUpdated: '2 hours ago',
    pinned: true,
    content: `# Sprint 24 Strategic PRD

## Overview
Enable engineering teams to manage sprint tasks, draft technical specifications, and track production metrics in a single unified workspace.

## Success Metrics
- 40% reduction in context switching across project management tools.
- Real-time visibility into Cloud Run service status and deployment health.
- Automated AI document summaries for fast executive review.
`,
  },
  {
    id: 'DOC-3',
    title: 'Incident Response & On-Call Playbook',
    category: 'Guide',
    tags: ['DevOps', 'SRE', 'Playbook'],
    author: 'Marcus Vance',
    lastUpdated: 'Yesterday',
    pinned: false,
    content: `# Incident Response Playbook

1. **Detection**: Alert triggered via Cloud Monitoring or automated health check failure.
2. **Triage**: Inspect logs via \`/api/health\` or Cloud Run container metrics.
3. **Mitigation**: Roll back to previous revision if error rate exceeds 1%.
`,
  },
];

export const initialActivities: ActivityLog[] = [
  {
    id: 'act-1',
    user: 'Alex Rivera',
    avatar: initialTeam[0].avatar,
    action: 'completed task',
    target: 'TASK-102: Implement Server-Side Gemini API Request Proxy',
    time: '12 mins ago',
    type: 'task',
  },
  {
    id: 'act-2',
    user: 'Sarah Chen',
    avatar: initialTeam[1].avatar,
    action: 'updated document',
    target: 'Sprint 24 Strategic PRD',
    time: '45 mins ago',
    type: 'doc',
  },
  {
    id: 'act-3',
    user: 'Marcus Vance',
    avatar: initialTeam[2].avatar,
    action: 'triggered build check',
    target: 'Cloud Run Service Revision v1.4.2',
    time: '2 hours ago',
    type: 'system',
  },
  {
    id: 'act-4',
    user: 'Elena Rostova',
    avatar: initialTeam[3].avatar,
    action: 'added design specs to',
    target: 'TASK-103: Design Dark/Light Theme Tokens',
    time: '4 hours ago',
    type: 'team',
  },
];
