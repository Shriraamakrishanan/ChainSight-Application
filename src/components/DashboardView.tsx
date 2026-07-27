import React from 'react';
import { Task, DocumentItem, ActivityLog, ProjectSummary, ActiveTab } from '../types';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  FolderGit2,
  ListTodo
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

interface DashboardViewProps {
  tasks: Task[];
  docs: DocumentItem[];
  activities: ActivityLog[];
  projects: ProjectSummary[];
  setActiveTab: (tab: ActiveTab) => void;
  onOpenTask: (task: Task) => void;
}

const velocityData = [
  { day: 'Mon', completed: 4, created: 3, velocity: 85 },
  { day: 'Tue', completed: 6, created: 5, velocity: 92 },
  { day: 'Wed', completed: 8, created: 4, velocity: 110 },
  { day: 'Thu', completed: 5, created: 6, velocity: 98 },
  { day: 'Fri', completed: 9, created: 2, velocity: 125 },
  { day: 'Sat', completed: 3, created: 1, velocity: 130 },
  { day: 'Sun', completed: 2, created: 1, velocity: 135 },
];

const categoryData = [
  { name: 'DevOps & Infra', value: 35, color: '#6366f1' },
  { name: 'AI Features', value: 30, color: '#10b981' },
  { name: 'Security & Audit', value: 20, color: '#f59e0b' },
  { name: 'UI / UX', value: 15, color: '#ec4899' },
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  docs,
  activities,
  projects,
  setActiveTab,
  onOpenTask,
}) => {
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const urgentTasks = tasks.filter((t) => t.priority === 'urgent' && t.status !== 'done');

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Metrics */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-zinc-900 to-zinc-900 border border-indigo-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Active Sprint 24 Overview
          </div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
            Nexus Workspace Operations Engine
          </h2>
          <p className="text-xs text-zinc-400 max-w-xl">
            Real-time telemetry on deployment progress, task velocity, team bandwidth, and AI document production across your active Cloud Run services.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('kanban')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
          >
            <ListTodo className="w-4 h-4" />
            <span>Open Kanban Board</span>
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/80 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>AI Docs Studio</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-400">Total Tasks</p>
            <h3 className="text-2xl font-bold text-zinc-100 mt-1">{tasks.length}</h3>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12% from last week
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <ListTodo className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-400">Completed Items</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">{completedTasks}</h3>
            <p className="text-[11px] text-zinc-400 mt-1">
              {Math.round((completedTasks / (tasks.length || 1)) * 100)}% sprint velocity
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-400">In Active Progress</p>
            <h3 className="text-2xl font-bold text-amber-400 mt-1">{inProgressTasks}</h3>
            <p className="text-[11px] text-zinc-400 mt-1">4 team members assigned</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-400">Urgent Priority</p>
            <h3 className="text-2xl font-bold text-rose-400 mt-1">{urgentTasks.length}</h3>
            <p className="text-[11px] text-rose-400 mt-1">Requires active attention</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Sprint Velocity Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Sprint Task Velocity & Throughput</h3>
              <p className="text-xs text-zinc-400">Completed vs created work items over the last 7 days</p>
            </div>
            <span className="text-xs text-indigo-400 font-medium bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
              Avg 8.2 tasks/day
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityData}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="day" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px', color: '#f4f4f5' }}
                />
                <Area type="monotone" dataKey="completed" name="Completed" stroke="#10b981" fillOpacity={1} fill="url(#colorCompleted)" strokeWidth={2} />
                <Area type="monotone" dataKey="created" name="New Created" stroke="#6366f1" fillOpacity={1} fill="url(#colorCreated)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Work Category Breakdown */}
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">Work Allocation</h3>
            <p className="text-xs text-zinc-400">Task distribution by engineering domain</p>
          </div>

          <div className="h-48 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                  <span className="text-zinc-300">{cat.name}</span>
                </div>
                <span className="font-semibold text-zinc-200">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Projects Grid & Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Projects Summary */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-indigo-400" />
              Active Project Streams
            </h3>
            <button
              onClick={() => setActiveTab('kanban')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
            >
              View All Tasks <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.map((proj) => {
              const progressPct = Math.round((proj.completedCount / (proj.taskCount || 1)) * 100);
              return (
                <div
                  key={proj.id}
                  onClick={() => setActiveTab('kanban')}
                  className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer group space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider text-zinc-300 bg-zinc-800 border border-zinc-700">
                      {proj.key}
                    </span>
                    <span className="text-xs text-emerald-400 font-semibold">{progressPct}%</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-zinc-200 group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {proj.name}
                    </h4>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">{proj.description}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-500">
                      <span>{proj.completedCount} done</span>
                      <span>{proj.taskCount} total</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Action Queue */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Urgent Action Items
          </h3>

          <div className="space-y-2">
            {tasks
              .filter((t) => t.priority === 'urgent' || t.priority === 'high')
              .slice(0, 3)
              .map((task) => (
                <div
                  key={task.id}
                  onClick={() => onOpenTask(task)}
                  className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-500/40 transition-all cursor-pointer flex items-start gap-3 group"
                >
                  <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1.5 animate-pulse"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono text-zinc-400">{task.id}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                        {task.priority}
                      </span>
                    </div>
                    <h4 className="text-xs font-medium text-zinc-200 group-hover:text-indigo-300 transition-colors line-clamp-1 mt-0.5">
                      {task.title}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-2">
                      <span>{task.assignee.name}</span>
                      <span>Due {task.dueDate}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

      </div>

    </div>
  );
};
