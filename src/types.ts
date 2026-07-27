export type UserRole = 'procurement' | 'admin' | 'supplier';

export interface UserSession {
  email: string;
  name: string;
  title: string;
  role: UserRole;
  avatar: string;
  token?: string;
}

export type ModuleTab =
  | 'overview'
  | 'disruption'
  | 'route'
  | 'supplier'
  | 'pos_demand'
  | 'esg'
  | 'scenario';

export type AdminTab =
  | 'admin_overview'
  | 'admin_users'
  | 'admin_suppliers'
  | 'admin_disruptions'
  | 'admin_feeds'
  | 'admin_audit';

export type SupplierTab =
  | 'supplier_dash'
  | 'supplier_esg'
  | 'supplier_shipments'
  | 'supplier_compliance';

export interface LiveDataFeed {
  id: string;
  name: string;
  type: 'ais' | 'weather' | 'port' | 'market' | 'pos' | 'geo';
  count: number;
  status: 'online' | 'degraded' | 'syncing';
  lastUpdated: string;
  latencyMs: number;
}

export interface DisruptionAlert {
  id: string;
  title: string;
  description: string;
  sourceType: 'weather' | 'news' | 'market' | 'geo' | 'pos';
  leadTimeDays: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  location: string;
  isActive: boolean;
  predictedAt: string;
  suggestedAction: string;
}

export interface SupplierRecord {
  id: string;
  name: string;
  category: string;
  country: string;
  financialScore: number;
  operationalScore: number;
  geopoliticalScore: number;
  ethicalScore: number;
  status: 'healthy' | 'at-risk' | 'critical';
  isDualSourced: boolean;
  contactEmail: string;
}

export interface RouteOption {
  id: string;
  name: string;
  mode: string;
  costPerTeu: number;
  transitDays: number;
  reliabilityPct: number;
  co2Tons: number;
  isAiRecommended?: boolean;
}

export interface PosStoreFeed {
  storeId: string;
  storeName: string;
  region: string;
  activeTerminals: number;
  salesVelocityUsd: number;
  salesTrendPct: number;
  topSellingSku: string;
  stockoutRisk: 'Low' | 'Moderate' | 'Critical';
  lastSyncSecAgo: number;
}

export interface SkuDemandForecast {
  id: string;
  skuCode: string;
  name: string;
  category: string;
  currentPosStock: number;
  dailyPosSales: number;
  forecastAccuracy: number;
  status: 'Surge (+42%)' | 'Stable' | 'Collapse (-30%)';
  trendType: 'surge' | 'normal' | 'collapse';
  replenishmentStatus: 'Optimal' | 'Re-order Triggered' | 'Expedite Required';
}

export interface ScenarioInput {
  eventType: string;
  targetNode: string;
  revenueExposedM: number;
  durationDays: number;
  severityPct: number;
}

export interface ScenarioResult {
  revenueAtRiskM: number;
  avgDelayDays: number;
  recoveryDays: number;
  totalExposureM: number;
  savingsProactiveM: number;
  affectedSkus: number;
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  playbook: { priority: 'IMMEDIATE' | 'URGENT' | 'MONITOR'; action: string; detail: string }[];
  parallelAiAnalysis?: string;
}

export interface ESGReportItem {
  id: string;
  supplierName: string;
  reportingPeriod: string;
  co2Ocean: number;
  co2Air: number;
  co2Road: number;
  co2Rail: number;
  laborRightsPct: number;
  carbonReportingPct: number;
  wasteReductionPct: number;
  waterUsagePct: number;
  submittedAt: string;
}

export interface ShipmentItem {
  id: string;
  dest: string;
  mode: string;
  eta: string;
  status: 'transit' | 'delayed' | 'delivered';
}

export interface AuditLogItem {
  id: string;
  time: string;
  action: string;
  detail: string;
  user: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  time: string;
  type: 'alert' | 'info' | 'success';
}

// ── Legacy Types for full backwards compatibility ─────────────────────────
export type ActiveTab = 'dashboard' | 'kanban' | 'docs' | 'analytics' | 'team' | 'settings';
export type AppTab = 'kanban' | 'analytics' | 'notes' | 'api';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export interface TaskSubtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignee: { name: string; avatar: string; role: string };
  dueDate: string;
  project: string;
  tags: string[];
  subtasks: TaskSubtask[];
  createdAt: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate: string;
  tags: string[];
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'PRD' | 'Architecture' | 'Guide' | 'Meeting' | 'General';
  content: string;
  tags: string[];
  author: string;
  lastUpdated: string;
  pinned: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar: string;
  status: 'active' | 'busy' | 'offline';
  tasksAssigned: number;
}

export interface ActivityLog {
  id: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  time: string;
  type: 'task' | 'doc' | 'system' | 'team';
}

export interface ProjectSummary {
  id: string;
  name: string;
  key: string;
  color: string;
  description: string;
  taskCount: number;
  completedCount: number;
}

export interface MetricCard {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  subtext: string;
}

export interface ChartDataPoint {
  date: string;
  revenue: number;
  expenses: number;
  users: number;
  conversions: number;
}

export interface Transaction {
  id: string;
  client: string;
  category: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  date: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  category: 'Strategy' | 'Engineering' | 'Design' | 'Product';
  updatedAt: string;
  pinned: boolean;
  tags: string[];
}

export interface SavedApiEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  headers: Record<string, string>;
  body?: string;
  category: string;
}

export interface ApiResponseLog {
  timestamp: string;
  status: number;
  statusText: string;
  timeMs: number;
  headers: Record<string, string>;
  data: any;
}
