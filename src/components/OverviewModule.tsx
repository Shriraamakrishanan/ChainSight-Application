import React, { useState } from 'react';
import { LiveDataFeed, DisruptionAlert } from '../types';
import {
  Globe,
  ShieldAlert,
  Activity,
  Wifi,
  Radio,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  FileText,
  BarChart2,
  LineChart as LineChartIcon,
  Truck,
  Package,
  Calendar,
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

interface OverviewModuleProps {
  dataFeeds: LiveDataFeed[];
  disruptions: DisruptionAlert[];
  onNavigateTab: (tab: string) => void;
  onOpenReportModal?: () => void;
}

const liveTelemetryTrendData = [
  { time: '00:00', healthScore: 92, riskIndex: 18, latencyMs: 14, activeFeeds: 342 },
  { time: '04:00', healthScore: 90, riskIndex: 22, latencyMs: 16, activeFeeds: 340 },
  { time: '08:00', healthScore: 84, riskIndex: 35, latencyMs: 24, activeFeeds: 338 },
  { time: '12:00', healthScore: 81, riskIndex: 42, latencyMs: 28, activeFeeds: 335 },
  { time: '16:00', healthScore: 85, riskIndex: 31, latencyMs: 19, activeFeeds: 341 },
  { time: '20:00', healthScore: 87, riskIndex: 26, latencyMs: 18, activeFeeds: 344 },
  { time: 'Now',   healthScore: 87, riskIndex: 25, latencyMs: 18, activeFeeds: 344 },
];

const shipmentVolume30DaysData = [
  { day: 'Day 1',  date: 'Jun 28', volume: 14200, onTime: 12800, delayed: 1400 },
  { day: 'Day 2',  date: 'Jun 29', volume: 14800, onTime: 13300, delayed: 1500 },
  { day: 'Day 3',  date: 'Jun 30', volume: 15100, onTime: 13600, delayed: 1500 },
  { day: 'Day 4',  date: 'Jul 01', volume: 13900, onTime: 12200, delayed: 1700 },
  { day: 'Day 5',  date: 'Jul 02', volume: 14500, onTime: 12900, delayed: 1600 },
  { day: 'Day 6',  date: 'Jul 03', volume: 15800, onTime: 14100, delayed: 1700 },
  { day: 'Day 7',  date: 'Jul 04', volume: 13200, onTime: 11900, delayed: 1300 },
  { day: 'Day 8',  date: 'Jul 05', volume: 14100, onTime: 12500, delayed: 1600 },
  { day: 'Day 9',  date: 'Jul 06', volume: 15600, onTime: 13800, delayed: 1800 },
  { day: 'Day 10', date: 'Jul 07', volume: 16200, onTime: 14200, delayed: 2000 },
  { day: 'Day 11', date: 'Jul 08', volume: 15900, onTime: 13700, delayed: 2200 },
  { day: 'Day 12', date: 'Jul 09', volume: 16800, onTime: 14400, delayed: 2400 },
  { day: 'Day 13', date: 'Jul 10', volume: 17400, onTime: 14800, delayed: 2600 },
  { day: 'Day 14', date: 'Jul 11', volume: 16900, onTime: 14500, delayed: 2400 },
  { day: 'Day 15', date: 'Jul 12', volume: 17800, onTime: 15200, delayed: 2600 },
  { day: 'Day 16', date: 'Jul 13', volume: 18200, onTime: 15400, delayed: 2800 },
  { day: 'Day 17', date: 'Jul 14', volume: 17600, onTime: 15100, delayed: 2500 },
  { day: 'Day 18', date: 'Jul 15', volume: 16400, onTime: 14200, delayed: 2200 },
  { day: 'Day 19', date: 'Jul 16', volume: 17100, onTime: 15000, delayed: 2100 },
  { day: 'Day 20', date: 'Jul 17', volume: 17900, onTime: 15800, delayed: 2100 },
  { day: 'Day 21', date: 'Jul 18', volume: 18400, onTime: 16300, delayed: 2100 },
  { day: 'Day 22', date: 'Jul 19', volume: 18100, onTime: 16100, delayed: 2000 },
  { day: 'Day 23', date: 'Jul 20', volume: 17500, onTime: 15600, delayed: 1900 },
  { day: 'Day 24', date: 'Jul 21', volume: 18200, onTime: 16400, delayed: 1800 },
  { day: 'Day 25', date: 'Jul 22', volume: 18900, onTime: 17100, delayed: 1800 },
  { day: 'Day 26', date: 'Jul 23', volume: 18600, onTime: 16900, delayed: 1700 },
  { day: 'Day 27', date: 'Jul 24', volume: 18100, onTime: 16500, delayed: 1600 },
  { day: 'Day 28', date: 'Jul 25', volume: 18500, onTime: 17000, delayed: 1500 },
  { day: 'Day 29', date: 'Jul 26', volume: 18800, onTime: 17300, delayed: 1500 },
  { day: 'Day 30', date: 'Jul 27', volume: 19200, onTime: 17800, delayed: 1400 },
];

export const OverviewModule: React.FC<OverviewModuleProps> = ({
  dataFeeds,
  disruptions,
  onNavigateTab,
  onOpenReportModal,
}) => {
  const [metricView, setMetricView] = useState<'health' | 'channels'>('health');
  const [shipmentLineFilter, setShipmentLineFilter] = useState<'all' | 'volume' | 'status'>('all');

  const feedChartData = dataFeeds.map((feed) => ({
    name: feed.name.split(' ')[0], // Short name for bar label
    fullName: feed.name,
    type: feed.type.toUpperCase(),
    channels: feed.count,
    latencyMs: feed.latencyMs,
    status: feed.status,
  }));

  return (
    <div className="space-y-6">
      {/* Module Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 flex items-center gap-2">
            <Globe className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400 shrink-0" />
            <span>Global Overview & Risk Map</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1">
            Real-time supply chain network health synthesized continuously from 340+ data feeds and POS retail terminals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {onOpenReportModal && (
            <button
              onClick={onOpenReportModal}
              className="px-3.5 sm:px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/10"
            >
              <FileText className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-400" />
              <span>Download PDF Report</span>
            </button>
          )}

          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 rounded-xl">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold text-emerald-400">Network Health: 87/100</span>
          </div>
        </div>
      </div>

      {/* Main World Map & Vulnerabilities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* World Map Interactive Stage */}
        <div className="lg:col-span-8 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[420px]">
          
          <div className="flex items-center justify-between mb-4 z-10">
            <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
              <Radio className="w-4.5 h-4.5 text-cyan-400 animate-pulse" /> Live Telemetry Hotspots
            </h3>
            <span className="text-xs sm:text-sm font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/30 font-semibold">
              340 Active Streaming Nodes
            </span>
          </div>

          {/* SVG Map Graphics & Hotspot Overlay Stage */}
          <div className="relative flex-1 flex items-center justify-center my-2 group min-h-[340px] bg-[#0e1017] rounded-2xl border border-zinc-800/80 p-3 overflow-hidden shadow-2xl">
            {/* Exact World Map SVG matching user reference image layout */}
            <svg
              className="w-full h-full max-h-[360px] select-none"
              viewBox="0 0 1000 500"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Glow Filter for Lines & Nodes */}
                <filter id="glowConnection" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Connection Gradients matching exact pin transitions */}
                <linearGradient id="gradPin1To2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3be392" />
                  <stop offset="100%" stopColor="#00d875" />
                </linearGradient>

                <linearGradient id="gradPin2To3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00d875" />
                  <stop offset="100%" stopColor="#f1a834" />
                </linearGradient>

                <linearGradient id="gradPin3To4" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f1a834" />
                  <stop offset="100%" stopColor="#f1a834" />
                </linearGradient>

                <linearGradient id="gradPin4To5" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f1a834" />
                  <stop offset="100%" stopColor="#ff528f" />
                </linearGradient>

                <linearGradient id="gradPin5To6" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ff528f" />
                  <stop offset="100%" stopColor="#e62e5c" />
                </linearGradient>

                <linearGradient id="gradPin6To1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#e62e5c" />
                  <stop offset="100%" stopColor="#3be392" />
                </linearGradient>
              </defs>

              {/* Slate-Gray Landmass Polygons matching reference image (#3f4452 fill, #1a1c24 outline) */}
              <g className="fill-[#3f4452] stroke-[#1a1c24] stroke-[1.2] stroke-linejoin-round">
                {/* North America & Arctic Islands */}
                <path d="M 15,45 L 90,30 L 170,25 L 230,35 L 290,60 L 310,120 L 280,180 L 220,195 L 190,260 L 160,275 L 150,220 L 120,210 L 100,160 L 50,150 L 15,90 Z" />
                <path d="M 320,15 L 410,20 L 390,75 L 330,70 Z" />
                <path d="M 185,255 L 225,265 L 215,290 L 180,270 Z" />

                {/* South America */}
                <path d="M 225,290 L 290,285 L 350,330 L 330,400 L 290,460 L 270,470 L 260,420 L 240,360 L 220,320 Z" />

                {/* Greenland & Arctic North */}
                <path d="M 430,80 L 460,70 L 470,105 L 440,110 Z" />
                <path d="M 490,35 L 540,30 L 560,85 L 510,95 L 490,65 Z" />

                {/* Europe */}
                <path d="M 440,115 L 520,105 L 570,125 L 550,175 L 500,185 L 460,175 L 435,145 Z" />

                {/* Africa */}
                <path d="M 420,190 L 560,185 L 610,235 L 600,315 L 550,395 L 500,415 L 470,355 L 420,275 L 410,225 Z" />
                <path d="M 605,325 L 625,330 L 615,385 L 595,375 Z" />

                {/* Middle East & Turkey */}
                <path d="M 565,170 L 635,165 L 655,220 L 595,235 L 575,195 Z" />

                {/* Russia & Northern Asia */}
                <path d="M 570,35 L 910,30 L 970,85 L 920,135 L 780,125 L 670,115 L 565,95 Z" />

                {/* Central Asia, China & East Asia */}
                <path d="M 660,120 L 820,125 L 880,175 L 860,235 L 760,225 L 670,185 Z" />

                {/* India & Subcontinent */}
                <path d="M 675,190 L 750,190 L 735,270 L 690,260 Z" />

                {/* Japan Archipelago */}
                <path d="M 870,115 L 895,110 L 885,155 L 860,145 Z" />
                <path d="M 835,140 L 850,135 L 845,165 L 830,160 Z" />

                {/* Southeast Asia */}
                <path d="M 765,220 L 820,215 L 825,270 L 785,275 L 770,245 Z" />
                <path d="M 780,285 L 860,280 L 870,305 L 800,310 Z" />

                {/* Australia & New Zealand */}
                <path d="M 790,335 L 910,325 L 930,395 L 840,425 L 780,385 Z" />
                <path d="M 940,395 L 960,390 L 950,435 L 930,425 Z" />

                {/* Antarctica Coastline */}
                <path d="M 0,480 Q 250,455 500,470 T 1000,480 L 1000,500 L 0,500 Z" />
              </g>

              {/* Country Internal Borders (Dark Thin Polygon Grid Overlay) */}
              <g className="stroke-[#1f222d] stroke-[0.8] fill-none">
                {/* US / Canada splits */}
                <line x1="100" y1="95" x2="260" y2="95" />
                <line x1="170" y1="50" x2="170" y2="170" />
                <line x1="230" y1="60" x2="230" y2="180" />
                {/* South America lines */}
                <line x1="230" y1="325" x2="330" y2="325" />
                <line x1="270" y1="285" x2="270" y2="435" />
                {/* European country borders */}
                <line x1="475" y1="115" x2="475" y2="170" />
                <line x1="445" y1="140" x2="535" y2="140" />
                {/* African country borders */}
                <line x1="425" y1="225" x2="575" y2="225" />
                <line x1="505" y1="185" x2="505" y2="405" />
                <line x1="445" y1="295" x2="565" y2="295" />
                {/* Eurasian & Asian country borders */}
                <line x1="595" y1="75" x2="895" y2="75" />
                <line x1="715" y1="35" x2="715" y2="175" />
                <line x1="795" y1="45" x2="795" y2="215" />
                <line x1="675" y1="125" x2="845" y2="125" />
                {/* India region lines */}
                <line x1="675" y1="225" x2="725" y2="225" />
                {/* Australian territories */}
                <line x1="835" y1="335" x2="835" y2="415" />
                <line x1="795" y1="375" x2="905" y2="375" />
              </g>

              {/* Glowing Interconnected Supply Chain Lines connecting exact Pin Locations */}
              <g className="fill-none stroke-[2.8] stroke-linecap-round filter-[url(#glowConnection)]">
                {/* Line 1: Pin 1 (190, 168) -> Pin 2 (348, 226) */}
                <path
                  d="M 190,168 Q 260,185 348,226"
                  stroke="url(#gradPin1To2)"
                  strokeDasharray="6 4"
                />

                {/* Line 2: Pin 2 (348, 226) -> Pin 3 (480, 282) */}
                <path
                  d="M 348,226 Q 400,265 480,282"
                  stroke="url(#gradPin2To3)"
                  strokeDasharray="6 4"
                />

                {/* Line 3: Pin 3 (480, 282) -> Pin 4 (608, 195) */}
                <path
                  d="M 480,282 Q 550,210 608,195"
                  stroke="url(#gradPin3To4)"
                  strokeDasharray="6 4"
                />

                {/* Line 4: Pin 4 (608, 195) -> Pin 5 (758, 255) */}
                <path
                  d="M 608,195 Q 680,245 758,255"
                  stroke="url(#gradPin4To5)"
                  strokeDasharray="6 4"
                />

                {/* Line 5: Pin 5 (758, 255) -> Pin 6 (832, 140) */}
                <path
                  d="M 758,255 Q 815,210 832,140"
                  stroke="url(#gradPin5To6)"
                  strokeDasharray="6 4"
                />

                {/* Line 6 (Transpacific Arc): Pin 6 (832, 140) -> Pin 1 (190, 168) */}
                <path
                  d="M 832,140 Q 980,40 190,168"
                  stroke="url(#gradPin6To1)"
                  strokeDasharray="7 5"
                />

                {/* Secondary Network Interlinks */}
                <path
                  d="M 190,168 Q 400,100 608,195"
                  stroke="#38bdf8"
                  strokeOpacity="0.5"
                  strokeDasharray="4 5"
                />
                <path
                  d="M 348,226 Q 550,290 758,255"
                  stroke="#f1a834"
                  strokeOpacity="0.45"
                  strokeDasharray="4 5"
                />
                <path
                  d="M 480,282 Q 680,180 832,140"
                  stroke="#ff528f"
                  strokeOpacity="0.45"
                  strokeDasharray="4 5"
                />
              </g>

              {/* Pin 1: North America (US Northwest / Canada border) - Mint Green */}
              <g className="cursor-pointer group/pin1" onClick={() => onNavigateTab('disruption')}>
                <circle cx="190" cy="168" r="22" fill="#3be392" fillOpacity="0.25" />
                <circle cx="190" cy="168" r="14" fill="#3be392" fillOpacity="0.4" />
                <circle cx="190" cy="168" r="7.5" fill="#3be392" stroke="#111622" strokeWidth="2" />
                <text x="190" y="136" textAnchor="middle" fill="#a7f3d0" fontSize="13" fontWeight="800" fontFamily="sans-serif">
                  North America
                </text>
              </g>

              {/* Pin 2: North Atlantic Ocean - Neon Emerald */}
              <g className="cursor-pointer group/pin2" onClick={() => onNavigateTab('route')}>
                <circle cx="348" cy="226" r="22" fill="#00d875" fillOpacity="0.25" />
                <circle cx="348" cy="226" r="14" fill="#00d875" fillOpacity="0.4" />
                <circle cx="348" cy="226" r="7.5" fill="#00d875" stroke="#111622" strokeWidth="2" />
                <text x="348" y="194" textAnchor="middle" fill="#6ee7b7" fontSize="13" fontWeight="800" fontFamily="sans-serif">
                  Atlantic Hub
                </text>
              </g>

              {/* Pin 3: West Africa (Gulf of Guinea) - Golden Amber */}
              <g className="cursor-pointer group/pin3" onClick={() => onNavigateTab('disruption')}>
                <circle cx="480" cy="282" r="22" fill="#f1a834" fillOpacity="0.25" />
                <circle cx="480" cy="282" r="14" fill="#f1a834" fillOpacity="0.4" />
                <circle cx="480" cy="282" r="7.5" fill="#f1a834" stroke="#111622" strokeWidth="2" />
                <text x="480" y="320" textAnchor="middle" fill="#fde047" fontSize="13" fontWeight="800" fontFamily="sans-serif">
                  West Africa Depot
                </text>
              </g>

              {/* Pin 4: Middle East / Anatolia - Golden Amber */}
              <g className="cursor-pointer group/pin4" onClick={() => onNavigateTab('route')}>
                <circle cx="608" cy="195" r="22" fill="#f1a834" fillOpacity="0.25" />
                <circle cx="608" cy="195" r="14" fill="#f1a834" fillOpacity="0.4" />
                <circle cx="608" cy="195" r="7.5" fill="#f1a834" stroke="#111622" strokeWidth="2" />
                <text x="608" y="163" textAnchor="middle" fill="#fde047" fontSize="13" fontWeight="800" fontFamily="sans-serif">
                  Middle East Node
                </text>
              </g>

              {/* Pin 5: Southeast Asia (Myanmar / Thailand) - Neon Pink */}
              <g className="cursor-pointer group/pin5" onClick={() => onNavigateTab('pos_demand')}>
                <circle cx="758" cy="255" r="24" fill="#ff528f" fillOpacity="0.25" />
                <circle cx="758" cy="255" r="15" fill="#ff528f" fillOpacity="0.4" />
                <circle cx="758" cy="255" r="8" fill="#ff528f" stroke="#111622" strokeWidth="2" />
                <text x="758" y="294" textAnchor="middle" fill="#f472b6" fontSize="13" fontWeight="800" fontFamily="sans-serif">
                  SE Asia POS Hub
                </text>
              </g>

              {/* Pin 6: East Asia / Sakhalin / Kamchatka - Crimson Red */}
              <g className="cursor-pointer group/pin6" onClick={() => onNavigateTab('disruption')}>
                <circle cx="832" cy="140" r="24" fill="#e62e5c" fillOpacity="0.28" />
                <circle cx="832" cy="140" r="15" fill="#e62e5c" fillOpacity="0.4" />
                <circle cx="832" cy="140" r="8" fill="#e62e5c" stroke="#111622" strokeWidth="2" />
                <text x="832" y="106" textAnchor="middle" fill="#fb7185" fontSize="13" fontWeight="800" fontFamily="sans-serif">
                  Sakhalin Hub
                </text>
              </g>
            </svg>

            {/* Interactive Tooltips on Node Hover */}
            <div className="absolute top-[20%] left-[82%] group/pin cursor-pointer" onClick={() => onNavigateTab('disruption')}>
              <div className="absolute top-6 -left-20 bg-zinc-950 border border-rose-500/60 text-rose-300 text-xs font-mono p-3 rounded-xl whitespace-nowrap hidden group-hover/pin:block shadow-2xl z-30">
                <div className="font-bold text-rose-200 text-sm">East Asia / Sakhalin Hub</div>
                <div className="text-xs text-zinc-300 mt-1">Typhoon Alert • Lead time: 4 days</div>
                <div className="text-xs text-cyan-400 mt-1 font-sans font-medium">Click to inspect disruption →</div>
              </div>
            </div>

            <div className="absolute top-[48%] left-[74%] group/pin cursor-pointer" onClick={() => onNavigateTab('pos_demand')}>
              <div className="absolute top-6 -left-20 bg-zinc-950 border border-cyan-500/60 text-cyan-300 text-xs font-mono p-3 rounded-xl whitespace-nowrap hidden group-hover/pin:block shadow-2xl z-30">
                <div className="font-bold text-cyan-200 text-sm">Southeast Asia POS Hub</div>
                <div className="text-xs text-zinc-300 mt-1">Demand Surge: +42.5% • Auto-replenish live</div>
                <div className="text-xs text-indigo-300 mt-1 font-sans font-medium">Click to view POS telemetry →</div>
              </div>
            </div>

            <div className="absolute top-[35%] left-[59%] group/pin cursor-pointer" onClick={() => onNavigateTab('route')}>
              <div className="absolute top-6 -left-16 bg-zinc-950 border border-amber-500/60 text-amber-300 text-xs font-mono p-3 rounded-xl whitespace-nowrap hidden group-hover/pin:block shadow-2xl z-30">
                <div className="font-bold text-amber-200 text-sm">Middle East Corridor Node</div>
                <div className="text-xs text-zinc-300 mt-1">Delay: +6 days • Cape Reroute active</div>
                <div className="text-xs text-cyan-400 mt-1 font-sans font-medium">Click to view routes →</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-800 text-xs sm:text-sm text-zinc-300 font-medium">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500" /> Critical Risk</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400" /> High Delay</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-cyan-400" /> POS Demand Surge</span>
            </div>
            <span>Updated 2 seconds ago</span>
          </div>
        </div>

        {/* Right Vulnerability & Key Metrics Summary */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center justify-between">
              <span>Top Vulnerabilities</span>
              <ShieldAlert className="w-4.5 h-4.5 text-rose-400" />
            </h3>

            <div className="space-y-3">
              {disruptions.slice(0, 3).map((d) => (
                <div
                  key={d.id}
                  onClick={() => onNavigateTab('disruption')}
                  className="p-3.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      {d.severity}
                    </span>
                    <span className="text-xs font-mono text-cyan-400 font-semibold">{d.leadTimeDays}d Lead Time</span>
                  </div>
                  <h4 className="text-sm font-bold text-zinc-100">{d.title}</h4>
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">{d.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Box */}
          <div className="bg-gradient-to-br from-indigo-950/40 to-zinc-900 border border-indigo-500/30 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-indigo-200 flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-indigo-400" /> POS Demand Auto-Balancing
            </h3>
            <p className="text-xs text-zinc-200 leading-relaxed">
              Retail POS telemetry in South India reports stock drawdown. Click below to view POS terminal streams.
            </p>
            <button
              onClick={() => onNavigateTab('pos_demand')}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-md shadow-indigo-600/20"
            >
              Open POS & Demand AI Module
            </button>
          </div>

        </div>

      </div>

      {/* Interactive Recharts Section: 24-Hour Telemetry Health & Data Feed Stream Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: 24-Hour Network Telemetry Health AreaChart */}
        <div className="lg:col-span-7 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-100 flex items-center gap-2">
                <LineChartIcon className="w-4.5 h-4.5 text-cyan-400" />
                24-Hour Network Health & Risk Trend Telemetry
              </h3>
              <p className="text-xs text-zinc-300 mt-0.5">
                Real-time composite health index (0-100) vs overall risk score trajectory.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 font-semibold">
              Live Stream
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={liveTelemetryTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="time" stroke="#a1a1aa" fontSize={12} tickLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={12} domain={[0, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09090b',
                    borderColor: '#3f3f46',
                    borderRadius: '12px',
                    color: '#f4f4f5',
                    fontSize: '13px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                  }}
                  formatter={(value: any, name: any) => [
                    name === 'healthScore' ? `${value} / 100` : `${value}% Exposure`,
                    name === 'healthScore' ? 'Network Health Score' : 'Risk Index',
                  ]}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
                  formatter={(value) => (value === 'healthScore' ? 'Health Score' : 'Risk Index')}
                />
                <Area
                  type="monotone"
                  dataKey="healthScore"
                  stroke="#22d3ee"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#healthGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="riskIndex"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#riskGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Data Feed Channel Volume & Latency BarChart */}
        <div className="lg:col-span-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-100 flex items-center gap-2">
                <BarChart2 className="w-4.5 h-4.5 text-indigo-400" />
                Data Feeds Channel Distribution
              </h3>
              <p className="text-xs text-zinc-300 mt-0.5">
                Active streaming channels across 340+ external sources.
              </p>
            </div>
            
            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
              <button
                onClick={() => setMetricView('channels')}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors cursor-pointer ${
                  metricView === 'channels' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Channels
              </button>
              <button
                onClick={() => setMetricView('health')}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors cursor-pointer ${
                  metricView === 'health' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Latency (ms)
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={feedChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={11} tickLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} />
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
                  formatter={(value: any) => [
                    metricView === 'channels' ? `${value} active streams` : `${value} ms sync`,
                    metricView === 'channels' ? 'Streaming Channels' : 'Sync Latency',
                  ]}
                />
                <Bar dataKey={metricView === 'channels' ? 'channels' : 'latencyMs'} radius={[6, 6, 0, 0]}>
                  {feedChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        metricView === 'channels'
                          ? index % 2 === 0 ? '#818cf8' : '#38bdf8'
                          : entry.latencyMs > 50 ? '#f43f5e' : '#34d399'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 30-Day Shipment Volume Trends Line Chart */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-base sm:text-lg font-bold uppercase tracking-wider text-zinc-100 flex items-center gap-2">
              <Truck className="w-5 h-5 text-cyan-400" />
              30-Day Global Shipment Volume Trends
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1">
              Daily cargo throughput, on-time deliveries, and transit delay distribution across active global trade lanes.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800 self-start md:self-auto">
            <button
              onClick={() => setShipmentLineFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                shipmentLineFilter === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All Metrics
            </button>
            <button
              onClick={() => setShipmentLineFilter('volume')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                shipmentLineFilter === 'volume'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Total Volume
            </button>
            <button
              onClick={() => setShipmentLineFilter('status')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                shipmentLineFilter === 'status'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              On-Time vs Delayed
            </button>
          </div>
        </div>

        {/* 30-Day Summary Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl">
            <div className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-cyan-400" /> 30-Day Total Volume
            </div>
            <div className="text-lg font-bold font-mono text-zinc-100 mt-1">504,600 TEU</div>
            <div className="text-[11px] text-emerald-400 font-medium mt-0.5">+11.4% vs last period</div>
          </div>

          <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl">
            <div className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Avg Daily Throughput
            </div>
            <div className="text-lg font-bold font-mono text-zinc-100 mt-1">16,820 TEU/day</div>
            <div className="text-[11px] text-cyan-400 font-medium mt-0.5">Peak: 19.2K TEU (Jul 27)</div>
          </div>

          <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl">
            <div className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> On-Time Delivery Rate
            </div>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-1">89.2%</div>
            <div className="text-[11px] text-emerald-400 font-medium mt-0.5">450.1K TEU On-Time</div>
          </div>

          <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl">
            <div className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Delayed Shipments
            </div>
            <div className="text-lg font-bold font-mono text-rose-400 mt-1">54,500 TEU</div>
            <div className="text-[11px] text-rose-400 font-medium mt-0.5">10.8% Transit Latency</div>
          </div>
        </div>

        {/* Recharts LineChart */}
        <div className="h-72 sm:h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={shipmentVolume30DaysData} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="date" stroke="#a1a1aa" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#a1a1aa"
                fontSize={12}
                tickLine={false}
                tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
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
                formatter={(value: any, name: any) => [
                  `${Number(value).toLocaleString()} TEU`,
                  name === 'volume' ? 'Total Volume' : name === 'onTime' ? 'On-Time Deliveries' : 'Delayed Volume',
                ]}
                labelFormatter={(label, items) => {
                  const dayObj = items?.[0]?.payload;
                  return dayObj ? `${dayObj.day} (${dayObj.date})` : label;
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                formatter={(value) =>
                  value === 'volume'
                    ? 'Total Shipment Volume'
                    : value === 'onTime'
                    ? 'On-Time Shipments'
                    : 'Delayed Shipments'
                }
              />

              {(shipmentLineFilter === 'all' || shipmentLineFilter === 'volume') && (
                <Line
                  type="monotone"
                  dataKey="volume"
                  name="volume"
                  stroke="#22d3ee"
                  strokeWidth={3}
                  dot={{ r: 3, fill: '#22d3ee' }}
                  activeDot={{ r: 6, fill: '#22d3ee', stroke: '#09090b', strokeWidth: 2 }}
                />
              )}

              {(shipmentLineFilter === 'all' || shipmentLineFilter === 'status') && (
                <Line
                  type="monotone"
                  dataKey="onTime"
                  name="onTime"
                  stroke="#34d399"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: '#34d399' }}
                />
              )}

              {(shipmentLineFilter === 'all' || shipmentLineFilter === 'status') && (
                <Line
                  type="monotone"
                  dataKey="delayed"
                  name="delayed"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: '#f43f5e' }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live 340+ Data Feeds Telemetry Ticker */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-100 flex items-center gap-2">
            <Wifi className="w-4.5 h-4.5 text-cyan-400" /> Live Data Feeds Telemetry (340+ Streaming Sources)
          </h3>
          <span className="text-xs text-emerald-400 font-mono font-bold">100% Signal Ingestion Active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {dataFeeds.map((feed) => (
            <div key={feed.id} className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400 font-bold uppercase">{feed.type}</span>
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    feed.status === 'online' ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'
                  }`}
                />
              </div>
              <h4 className="text-xs font-bold text-zinc-100 truncate">{feed.name}</h4>
              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono pt-1">
                <span>{feed.count} channels</span>
                <span className="font-semibold text-cyan-400">{feed.latencyMs}ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

