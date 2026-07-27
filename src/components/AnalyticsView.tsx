import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  Cpu,
  Server,
  Activity,
  Zap,
  CheckCircle2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line
} from 'recharts';

const performanceData = [
  { time: '00:00', requests: 120, latency: 42, cpu: 18, memory: 34 },
  { time: '04:00', requests: 80, latency: 38, cpu: 14, memory: 32 },
  { time: '08:00', requests: 450, latency: 65, cpu: 45, memory: 52 },
  { time: '12:00', requests: 980, latency: 82, cpu: 72, memory: 68 },
  { time: '16:00', requests: 820, latency: 58, cpu: 60, memory: 61 },
  { time: '20:00', requests: 510, latency: 46, cpu: 38, memory: 44 },
  { time: '23:59', requests: 240, latency: 40, cpu: 22, memory: 36 },
];

const teamProductivityData = [
  { member: 'Alex R.', tasks: 14, hours: 38, prs: 12 },
  { member: 'Sarah C.', tasks: 10, hours: 35, prs: 8 },
  { member: 'Marcus V.', tasks: 12, hours: 42, prs: 15 },
  { member: 'Elena R.', tasks: 9, hours: 30, prs: 6 },
];

export const AnalyticsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadReport = () => {
    const reportContent = `CHAINSIGHT SUPPLY CHAIN OPERATIONAL REPORT
Generated: ${new Date().toLocaleString()}
Timeframe: ${timeRange}

SUMMARY METRICS:
- Total Cloud Run Requests: 1,420,000
- Average P95 Latency: 54ms
- Sprint Velocity Index: 94.2%
- Build Success Rate: 99.8%
`;
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ChainSight_Analytics_Report_${timeRange}.txt`;
    a.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Export controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            Performance & Telemetry Analytics
          </h2>
          <p className="text-xs text-zinc-400">
            Monitor infrastructure response times, team velocity, CPU load, and Cloud Run service metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  timeRange === range ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={handleDownloadReport}
            className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            {downloaded ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4 text-indigo-400" />}
            <span>{downloaded ? 'Report Downloaded' : 'Export Metrics'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Server Response Time (P95)</span>
            <Server className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-zinc-100">42 ms</h3>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> -12ms latency improvement
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Container CPU Utilization</span>
            <Cpu className="w-4 h-4 text-indigo-400" />
          </div>
          <h3 className="text-2xl font-bold text-zinc-100">28.4%</h3>
          <p className="text-[11px] text-zinc-400">Auto-scaled 1-5 instances</p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Sprint Completion Rate</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="text-2xl font-bold text-zinc-100">94.2%</h3>
          <p className="text-[11px] text-emerald-400">+4.1% over previous cycle</p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Build Health Status</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-400">99.8%</h3>
          <p className="text-[11px] text-zinc-400">0 critical failures</p>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Latency & Requests Chart */}
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Cloud Run Traffic & P95 Latency</h3>
              <p className="text-xs text-zinc-400">Traffic throughput (req/min) vs system latency</p>
            </div>
            <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Optimal
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="time" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="requests" name="Requests/min" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
                <Area type="monotone" dataKey="latency" name="Latency (ms)" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team Productivity Bar Chart */}
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Team Workload & Pull Requests</h3>
              <p className="text-xs text-zinc-400">Tasks resolved & PR code reviews per team member</p>
            </div>
            <span className="text-xs text-indigo-400 font-mono bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              Balanced
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamProductivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="member" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="tasks" name="Tasks Closed" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="prs" name="PRs Merged" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
