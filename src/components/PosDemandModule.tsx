import React, { useState } from 'react';
import { PosStoreFeed, SkuDemandForecast } from '../types';
import {
  ShoppingBag,
  Zap,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Store,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  BarChart2,
  LineChart as LineChartIcon,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';

interface PosDemandModuleProps {
  posStores: PosStoreFeed[];
  skuForecasts: SkuDemandForecast[];
  onTriggerAction: (actionName: string, targetTitle: string) => void;
}

const forecast30DaysData = [
  { day: 'Day 1', 'Batteries Surge (+42%)': 120, 'Semiconductor Chips': 85, 'Retail Electronics': 40, 'Safety Stock': 50 },
  { day: 'Day 5', 'Batteries Surge (+42%)': 135, 'Semiconductor Chips': 82, 'Retail Electronics': 38, 'Safety Stock': 50 },
  { day: 'Day 10', 'Batteries Surge (+42%)': 160, 'Semiconductor Chips': 80, 'Retail Electronics': 35, 'Safety Stock': 50 },
  { day: 'Day 15', 'Batteries Surge (+42%)': 195, 'Semiconductor Chips': 78, 'Retail Electronics': 28, 'Safety Stock': 50 },
  { day: 'Day 20', 'Batteries Surge (+42%)': 230, 'Semiconductor Chips': 79, 'Retail Electronics': 22, 'Safety Stock': 50 },
  { day: 'Day 25', 'Batteries Surge (+42%)': 275, 'Semiconductor Chips': 81, 'Retail Electronics': 18, 'Safety Stock': 50 },
  { day: 'Day 30', 'Batteries Surge (+42%)': 310, 'Semiconductor Chips': 84, 'Retail Electronics': 15, 'Safety Stock': 50 },
];

export const PosDemandModule: React.FC<PosDemandModuleProps> = ({
  posStores,
  skuForecasts,
  onTriggerAction,
}) => {
  const [replenishSuccessSku, setReplenishSuccessSku] = useState<string | null>(null);
  const [activeChartMode, setActiveChartMode] = useState<'area' | 'bar'>('area');

  const handleTriggerReplenish = (sku: SkuDemandForecast) => {
    onTriggerAction('POS Auto-Replenish', `Stock allocation for ${sku.name} (${sku.skuCode})`);
    setReplenishSuccessSku(sku.id);
    setTimeout(() => setReplenishSuccessSku(null), 3000);
  };

  const storeBarData = posStores.map((s) => ({
    name: s.storeName.replace(' Terminal', '').replace(' Outlet', ''),
    fullName: s.storeName,
    velocityUsd: s.salesVelocityUsd,
    trendPct: s.salesTrendPct,
    risk: s.stockoutRisk,
  }));

  const getSparklineData = (trendType: 'surge' | 'normal' | 'collapse') => {
    if (trendType === 'surge') {
      return [
        { d: 'D1', val: 120 },
        { d: 'D5', val: 140 },
        { d: 'D10', val: 175 },
        { d: 'D15', val: 210 },
        { d: 'D20', val: 250 },
        { d: 'D25', val: 280 },
        { d: 'D30', val: 320 },
      ];
    } else if (trendType === 'collapse') {
      return [
        { d: 'D1', val: 210 },
        { d: 'D5', val: 190 },
        { d: 'D10', val: 150 },
        { d: 'D15', val: 110 },
        { d: 'D20', val: 80 },
        { d: 'D25', val: 50 },
        { d: 'D30', val: 30 },
      ];
    } else {
      return [
        { d: 'D1', val: 100 },
        { d: 'D5', val: 105 },
        { d: 'D10', val: 98 },
        { d: 'D15', val: 102 },
        { d: 'D20', val: 101 },
        { d: 'D25', val: 99 },
        { d: 'D30', val: 103 },
      ];
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-400" />
            Point of Sale (POS) & Demand AI Sensing Engine
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1">
            Real-time retail POS checkout telemetry synchronized with 30-day ensemble forecast models (94% accuracy).
          </p>
        </div>

        <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 px-3.5 py-2 rounded-xl">
          <Zap className="w-4 h-4 text-indigo-400 animate-bounce" />
          <span className="text-xs sm:text-sm font-bold text-indigo-300">Live POS Telemetry Active</span>
        </div>
      </div>

      {/* POS Real-Time Store Telemetry & Store Velocity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive Store Sales Velocity BarChart */}
        <div className="lg:col-span-7 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-100 flex items-center gap-2">
                <BarChart2 className="w-4.5 h-4.5 text-cyan-400" />
                Live POS Outlet Sales Velocity ($ USD / 24h)
              </h3>
              <p className="text-xs text-zinc-300 mt-0.5">
                Real-time store checkout velocity comparison across regional hubs.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20 font-semibold">
              4 Regional Hubs
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={storeBarData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#a1a1aa"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09090b',
                    borderColor: '#3f3f46',
                    borderRadius: '12px',
                    color: '#f4f4f5',
                    fontSize: '13px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                  }}
                  labelFormatter={(label, items) => items[0]?.payload?.fullName || label}
                  formatter={(value: any, name: any, item: any) => [
                    `$${Number(value).toLocaleString()} (Growth: ${item.payload.trendPct >= 0 ? '+' : ''}${item.payload.trendPct}%)`,
                    'Sales Velocity (24h)',
                  ]}
                />
                <Bar dataKey="velocityUsd" radius={[8, 8, 0, 0]}>
                  {storeBarData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.risk === 'Critical'
                          ? '#f43f5e'
                          : entry.risk === 'Moderate'
                          ? '#fbbf24'
                          : '#34d399'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Live Store Outlets Stream Summary Cards */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
            <Store className="w-4.5 h-4.5 text-cyan-400" /> Terminal Status Summary
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {posStores.map((store) => (
              <div key={store.storeId} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    {store.storeId}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">{store.lastSyncSecAgo}s ago</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-zinc-100 truncate">{store.storeName}</h4>
                  <p className="text-xs text-zinc-300">{store.region}</p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-zinc-900 text-xs">
                  <span className="font-mono font-bold text-zinc-200">${store.salesVelocityUsd.toLocaleString()}</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-xs ${
                      store.stockoutRisk === 'Critical'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {store.stockoutRisk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Main 30-Day POS SKU Demand Ensemble Forecast Chart */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <LineChartIcon className="w-4 h-4 text-cyan-400" />
              30-Day Ensemble SKU Demand Forecast Models
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Machine Learning projections comparing high-surge items vs demand collapse warnings against safety stock thresholds.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setActiveChartMode('area')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeChartMode === 'area'
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-zinc-950 shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Surge Projection (Area)
            </button>
            <button
              onClick={() => setActiveChartMode('bar')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeChartMode === 'bar'
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-zinc-950 shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Comparison View
            </button>
          </div>
        </div>

        {/* Major 30-Day Recharts Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {activeChartMode === 'area' ? (
              <AreaChart data={forecast30DaysData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="surgeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="collapseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="day" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09090b',
                    borderColor: '#27272a',
                    borderRadius: '12px',
                    color: '#f4f4f5',
                    fontSize: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
                  }}
                  formatter={(val: any) => [`${val} units/day`, 'Forecast Demand']}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="Batteries Surge (+42%)"
                  stroke="#34d399"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#surgeGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="Semiconductor Chips"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  fillOpacity={0.1}
                  fill="#38bdf8"
                />
                <Area
                  type="monotone"
                  dataKey="Retail Electronics"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#collapseGrad)"
                />
                <Line
                  type="monotone"
                  dataKey="Safety Stock"
                  stroke="#fbbf24"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </AreaChart>
            ) : (
              <BarChart data={forecast30DaysData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="day" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09090b',
                    borderColor: '#27272a',
                    borderRadius: '12px',
                    color: '#f4f4f5',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Batteries Surge (+42%)" fill="#34d399" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Semiconductor Chips" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Retail Electronics" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Individual SKU Cards with Recharts Mini Sparkline Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {skuForecasts.map((sku) => {
            const isDone = replenishSuccessSku === sku.id;

            return (
              <div
                key={sku.id}
                className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/90 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-zinc-400">{sku.skuCode}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        sku.trendType === 'surge'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : sku.trendType === 'collapse'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {sku.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-zinc-100">{sku.name}</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{sku.category}</p>

                  {/* Interactive Recharts Sparkline Area Chart */}
                  <div className="h-16 my-3 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={getSparklineData(sku.trendType)}>
                        <defs>
                          <linearGradient id={`sparkGrad-${sku.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop
                              offset="5%"
                              stopColor={
                                sku.trendType === 'surge'
                                  ? '#34d399'
                                  : sku.trendType === 'collapse'
                                  ? '#f43f5e'
                                  : '#38bdf8'
                              }
                              stopOpacity={0.4}
                            />
                            <stop
                              offset="95%"
                              stopColor={
                                sku.trendType === 'surge'
                                  ? '#34d399'
                                  : sku.trendType === 'collapse'
                                  ? '#f43f5e'
                                  : '#38bdf8'
                              }
                              stopOpacity={0.0}
                            />
                          </linearGradient>
                        </defs>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#09090b',
                            borderColor: '#27272a',
                            borderRadius: '8px',
                            color: '#f4f4f5',
                            fontSize: '11px',
                            padding: '4px 8px',
                          }}
                          formatter={(val: any) => [`${val} units/day`, '30d Forecast']}
                        />
                        <Area
                          type="monotone"
                          dataKey="val"
                          stroke={
                            sku.trendType === 'surge'
                              ? '#34d399'
                              : sku.trendType === 'collapse'
                              ? '#f43f5e'
                              : '#38bdf8'
                          }
                          strokeWidth={2}
                          fill={`url(#sparkGrad-${sku.id})`}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 bg-zinc-900 rounded-lg">
                      <span className="text-zinc-500 block">POS Store Stock</span>
                      <span className="font-mono font-bold text-zinc-200">
                        {sku.currentPosStock.toLocaleString()} units
                      </span>
                    </div>
                    <div className="p-2 bg-zinc-900 rounded-lg">
                      <span className="text-zinc-500 block">Daily POS Sales</span>
                      <span className="font-mono font-bold text-cyan-400">{sku.dailyPosSales} / day</span>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => handleTriggerReplenish(sku)}
                    disabled={isDone}
                    className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>POS Re-order Dispatched</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>Trigger POS Auto-Replenishment</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

