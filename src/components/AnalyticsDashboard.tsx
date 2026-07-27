import React, { useState } from 'react';
import { MetricCard, ChartDataPoint, Transaction } from '../types';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, Activity, Download, Plus, Search, Filter, CheckCircle2, Clock } from 'lucide-react';

interface AnalyticsDashboardProps {
  metrics: MetricCard[];
  chartData: ChartDataPoint[];
  transactions: Transaction[];
  onAddTransaction: (txn: Transaction) => void;
  searchQuery: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  metrics,
  chartData,
  transactions,
  onAddTransaction,
  searchQuery,
}) => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '1y'>('7d');
  const [txnCategory, setTxnCategory] = useState<string>('ALL');
  const [isAddingTxn, setIsAddingTxn] = useState(false);

  // New Txn Form State
  const [clientName, setClientName] = useState('');
  const [category, setCategory] = useState('Enterprise Subscription');
  const [amount, setAmount] = useState('2500');

  const filteredTxns = transactions.filter((t) => {
    const matchesSearch =
      t.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = txnCategory === 'ALL' || t.category === txnCategory;

    return matchesSearch && matchesCat;
  });

  const handleCreateTxn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    const newTxn: Transaction = {
      id: `TXN-${Math.floor(9000 + Math.random() * 999)}`,
      client: clientName.trim(),
      category,
      amount: parseFloat(amount) || 0,
      status: 'Completed',
      date: new Date().toISOString().split('T')[0],
    };

    onAddTransaction(newTxn);
    setClientName('');
    setIsAddingTxn(false);
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'Client', 'Category', 'Amount', 'Status', 'Date'];
    const rows = filteredTxns.map((t) => [t.id, `"${t.client}"`, `"${t.category}"`, t.amount, t.status, t.date]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `financial_report_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Timeframe & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/80">
        <div>
          <h2 className="text-sm font-bold text-zinc-100">Executive Performance & Revenue Analytics</h2>
          <p className="text-xs text-zinc-400">Real-time telemetric activity, recurring billing, and user acquisition metrics.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs font-medium">
            <button
              onClick={() => setTimeframe('7d')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                timeframe === '7d' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeframe('30d')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                timeframe === '30d' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeframe('1y')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                timeframe === '1y' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              1 Year
            </button>
          </div>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-semibold border border-zinc-700 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div
            key={m.id}
            className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 space-y-3 hover:border-zinc-700/80 transition-all shadow-sm"
          >
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-medium">{m.title}</span>
              {m.trend === 'up' ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <TrendingUp className="w-3 h-3" /> {m.change}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  <TrendingDown className="w-3 h-3" /> {m.change}
                </span>
              )}
            </div>

            <div className="text-2xl font-bold tracking-tight text-zinc-100">{m.value}</div>

            <p className="text-[11px] text-zinc-500">{m.subtext}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue vs Expenses Area Chart */}
        <div className="lg:col-span-2 bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wide">Revenue & Operating Expenses</h3>
              <p className="text-[11px] text-zinc-400">Daily financial breakdown ($ USD)</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-indigo-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Revenue
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Expenses
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Acquisition Bar Chart */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wide">User Conversions</h3>
            <p className="text-[11px] text-zinc-400">Active signups and paid upgrade events</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="conversions" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transactions & Ledger Section */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-100">Financial Ledger & Billing Transactions</h3>
            <p className="text-xs text-zinc-400">Detailed line items and enterprise licensing records.</p>
          </div>

          <button
            onClick={() => setIsAddingTxn(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Log Transaction
          </button>
        </div>

        {/* Modal Log Txn */}
        {isAddingTxn && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 max-w-md space-y-3">
            <h4 className="text-xs font-bold text-zinc-200">Log New Financial Record</h4>
            <form onSubmit={handleCreateTxn} className="space-y-3 text-xs">
              <input
                type="text"
                placeholder="Client / Service Name"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 p-2 rounded-lg"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-200 p-2 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Amount ($)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-200 p-2 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingTxn(false)}
                  className="px-3 py-1.5 bg-zinc-800 text-zinc-400 rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-semibold">
                  Save Record
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="text-[11px] font-bold uppercase bg-zinc-950 text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="p-3">Reference ID</th>
                <th className="p-3">Client / Counterparty</th>
                <th className="p-3">Category</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredTxns.map((t) => (
                <tr key={t.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="p-3 font-mono text-zinc-400 text-[11px]">{t.id}</td>
                  <td className="p-3 font-semibold text-zinc-200">{t.client}</td>
                  <td className="p-3 text-zinc-400">{t.category}</td>
                  <td className="p-3 text-zinc-400">{t.date}</td>
                  <td className="p-3">
                    {t.status === 'Completed' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </td>
                  <td className={`p-3 text-right font-bold font-mono ${t.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {t.amount >= 0 ? `+$${t.amount.toLocaleString()}` : `-$${Math.abs(t.amount).toLocaleString()}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
