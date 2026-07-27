import { TaskItem, MetricCard, ChartDataPoint, Transaction, NoteItem, SavedApiEndpoint } from '../types';

export const initialTasks: TaskItem[] = [
  {
    id: 'TSK-101',
    title: 'Deploy Cloud Run Container',
    description: 'Finalize Docker setup, environment variables injection, and SSL domain mapping for primary regional cluster.',
    status: 'done',
    priority: 'High',
    assignee: 'Alex Rivera',
    dueDate: '2026-07-20',
    tags: ['DevOps', 'Cloud'],
    createdAt: '2026-07-15',
  },
  {
    id: 'TSK-102',
    title: 'Implement OAuth 2.0 Auth Flow',
    description: 'Add Google Workspace OAuth login handler and session refresh cookie rotation.',
    status: 'in_progress',
    priority: 'Urgent',
    assignee: 'Sarah Chen',
    dueDate: '2026-07-23',
    tags: ['Security', 'Auth'],
    createdAt: '2026-07-18',
  },
  {
    id: 'TSK-103',
    title: 'Optimize Database Query Indexes',
    description: 'Analyze slow query logs in Cloud SQL PostgreSQL database and add composite index on user_id + created_at.',
    status: 'in_progress',
    priority: 'Medium',
    assignee: 'Marcus Vance',
    dueDate: '2026-07-25',
    tags: ['Database', 'Backend'],
    createdAt: '2026-07-19',
  },
  {
    id: 'TSK-104',
    title: 'Design Dark Mode UI System',
    description: 'Create high-contrast Tailwind color tokens and responsive grid components for dark theme dashboards.',
    status: 'review',
    priority: 'Medium',
    assignee: 'Elena Rostova',
    dueDate: '2026-07-22',
    tags: ['UI/UX', 'Design'],
    createdAt: '2026-07-16',
  },
  {
    id: 'TSK-105',
    title: 'Integrate Gemini 3.6 Flash Endpoint',
    description: 'Set up server-side proxy route for AI summarization, code generation, and document polishing.',
    status: 'todo',
    priority: 'High',
    assignee: 'Alex Rivera',
    dueDate: '2026-07-28',
    tags: ['AI', 'API'],
    createdAt: '2026-07-21',
  },
  {
    id: 'TSK-106',
    title: 'Automate E2E Playwright Suite',
    description: 'Write regression test scenarios for user checkout and API webhook ping listeners.',
    status: 'todo',
    priority: 'Low',
    assignee: 'David K.',
    dueDate: '2026-07-30',
    tags: ['Testing', 'QA'],
    createdAt: '2026-07-21',
  },
];

export const metricsData: MetricCard[] = [
  {
    id: 'm1',
    title: 'Monthly Recurring Revenue',
    value: '$48,250',
    change: '+14.2%',
    trend: 'up',
    subtext: 'vs. previous month ($42,250)',
  },
  {
    id: 'm2',
    title: 'Active Platform Users',
    value: '12,480',
    change: '+8.7%',
    trend: 'up',
    subtext: '9,820 daily active users',
  },
  {
    id: 'm3',
    title: 'Server Latency (p99)',
    value: '42ms',
    change: '-18.5%',
    trend: 'up',
    subtext: 'Improved via edge caching',
  },
  {
    id: 'm4',
    title: 'API Request Volume',
    value: '1.24M',
    change: '+22.1%',
    trend: 'up',
    subtext: '24k requests per hour peak',
  },
];

export const chartPerformanceData: ChartDataPoint[] = [
  { date: 'Jul 15', revenue: 4200, expenses: 1800, users: 1100, conversions: 120 },
  { date: 'Jul 16', revenue: 5100, expenses: 1900, users: 1250, conversions: 145 },
  { date: 'Jul 17', revenue: 4800, expenses: 1750, users: 1180, conversions: 130 },
  { date: 'Jul 18', revenue: 6300, expenses: 2100, users: 1420, conversions: 180 },
  { date: 'Jul 19', revenue: 7200, expenses: 2300, users: 1680, conversions: 210 },
  { date: 'Jul 20', revenue: 6900, expenses: 2050, users: 1590, conversions: 195 },
  { date: 'Jul 21', revenue: 8400, expenses: 2400, users: 1890, conversions: 240 },
];

export const recentTransactions: Transaction[] = [
  {
    id: 'TXN-9081',
    client: 'Acme Enterprise',
    category: 'Enterprise Subscription',
    amount: 12500,
    status: 'Completed',
    date: '2026-07-21',
  },
  {
    id: 'TXN-9082',
    client: 'Starlight Media',
    category: 'API Usage Pack',
    amount: 3200,
    status: 'Completed',
    date: '2026-07-21',
  },
  {
    id: 'TXN-9083',
    client: 'Nexus Cloud Infrastructure',
    category: 'Hosting Expense',
    amount: -1850,
    status: 'Completed',
    date: '2026-07-20',
  },
  {
    id: 'TXN-9084',
    client: 'FinTech Dynamics',
    category: 'Custom SLA License',
    amount: 8900,
    status: 'Pending',
    date: '2026-07-20',
  },
  {
    id: 'TXN-9085',
    client: 'Global Logistics Inc',
    category: 'Pro Tier Renewal',
    amount: 2400,
    status: 'Completed',
    date: '2026-07-19',
  },
];

export const initialNotes: NoteItem[] = [
  {
    id: 'NOTE-1',
    title: 'Q3 Product Roadmap & Architecture',
    category: 'Product',
    updatedAt: '2026-07-21 14:30',
    pinned: true,
    tags: ['Roadmap', 'Q3', 'Architecture'],
    content: `# Q3 Product Strategy & Execution Plan

## Key Milestones
1. **Gemini 3.6 Flash Integration**: Enable real-time document summary and intelligent code assistant proxy in server.ts.
2. **Multi-Tenant Database Scaling**: Migration of PostgreSQL user schemas using Drizzle ORM and Cloud SQL.
3. **Latency Benchmarking**: Maintain p99 server response time under 50ms globally.

## Deliverables
- Deploy Cloud Run container with zero cold-start latency.
- Provide responsive Dark/Light UI for desktop and mobile viewport range.
- Implement API request sandbox for developer experimentation.`,
  },
  {
    id: 'NOTE-2',
    title: 'API Rate Limiting & Proxy Specs',
    category: 'Engineering',
    updatedAt: '2026-07-20 09:15',
    pinned: true,
    tags: ['API', 'Security', 'Express'],
    content: `# Express Server Proxy Guidelines

- All external API keys must be retained server-side in process.env.
- Return structured JSON errors on 400 and 500 status codes.
- Implement token bucket algorithm for API clients (100 req/min).`,
  },
  {
    id: 'NOTE-3',
    title: 'Brand Palette & Design Tokens',
    category: 'Design',
    updatedAt: '2026-07-18 16:45',
    pinned: false,
    tags: ['Tailwind', 'UI', 'Theme'],
    content: `# Modern Dark Theme Guidelines

- Base canvas: zinc-950 (#09090b)
- Card background: zinc-900/60 with zinc-800/80 borders
- Accent primary: Indigo 500/600 (#6366f1)
- Typography: High contrast, clean, geometric sans-serif fonts.`,
  },
];

export const savedEndpoints: SavedApiEndpoint[] = [
  {
    id: 'ep-1',
    name: 'Server Health Check',
    method: 'GET',
    url: '/api/health',
    headers: { 'Accept': 'application/json' },
    category: 'System',
  },
  {
    id: 'ep-2',
    name: 'Generate AI Text (Gemini)',
    method: 'POST',
    url: '/api/ai/generate',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: 'Summarize the core benefits of containerized microservices in 3 bullet points.' }, null, 2),
    category: 'AI Assistant',
  },
  {
    id: 'ep-3',
    name: 'External HTTP Echo Service',
    method: 'GET',
    url: 'https://httpbin.org/get',
    headers: { 'User-Agent': 'OmniSuite-Client/1.0' },
    category: 'External Testing',
  },
];
