import React, { useState } from 'react';
import { RouteOption } from '../types';
import {
  Route,
  DollarSign,
  Clock,
  ShieldCheck,
  Leaf,
  Sparkles,
  Navigation,
  ArrowRight,
  ArrowLeftRight,
  Filter,
  BarChart2,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Download,
  X,
  Ship,
  Plane,
  Train,
  FileCheck,
  Anchor,
  Zap,
  Check,
  RefreshCw,
} from 'lucide-react';

interface RouteModuleProps {
  routes: RouteOption[];
  onTriggerAction?: (actionName: string, targetTitle: string) => void;
}

interface ConfirmedBooking {
  id: string;
  routeId: string;
  routeName: string;
  mode: string;
  origin: string;
  destination: string;
  volumeTeu: number;
  totalCostUsd: number;
  totalCo2Tons: number;
  carrier: string;
  containerType: string;
  departureDate: string;
  status: 'EDI Dispatched' | 'Space Allocated' | 'In Transit';
  bookedAt: string;
}

const PRESET_LANES = [
  { label: 'Shenzhen ➔ Rotterdam (Asia-EU)', origin: 'Shenzhen, CN', dest: 'Rotterdam, NL' },
  { label: 'Ningbo ➔ Long Beach (Transpacific)', origin: 'Ningbo, CN', dest: 'Long Beach, US' },
  { label: 'Hai Phong ➔ Hamburg (SE Asia Lane)', origin: 'Hai Phong, VN', dest: 'Hamburg, DE' },
  { label: 'Mumbai ➔ Antwerp (ME-EU Corridor)', origin: 'Mumbai, IN', dest: 'Antwerp, BE' },
];

const CARRIER_OPTIONS = [
  'Maersk Line (Ocean)',
  'MSC Mediterranean Shipping',
  'COSCO Shipping Lines',
  'Hapag-Lloyd Express',
  'DB Cargo Eurasian Rail',
  'DHL Global Forwarding (Air)',
];

export const RouteModule: React.FC<RouteModuleProps> = ({ routes: initialRoutes, onTriggerAction }) => {
  const [origin, setOrigin] = useState('Shenzhen, CN');
  const [destination, setDestination] = useState('Rotterdam, NL');
  const [volumeTeu, setVolumeTeu] = useState<number>(50);
  const [loading, setLoading] = useState(false);
  const [routesList, setRoutesList] = useState<RouteOption[]>(initialRoutes);

  // Sorting & Filtering
  const [sortBy, setSortBy] = useState<'ai' | 'cost' | 'time' | 'reliability' | 'co2'>('ai');
  const [strategy, setStrategy] = useState<'balanced' | 'cost' | 'speed' | 'carbon' | 'reliability'>('balanced');
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'waypoints'>('grid');

  // Disruption Simulation per Route ID
  const [disruptedRouteIds, setDisruptedRouteIds] = useState<Record<string, boolean>>({});

  // Active Freight Bookings
  const [activeBookings, setActiveBookings] = useState<ConfirmedBooking[]>([]);

  // Booking Modal State
  const [selectedRouteForBooking, setSelectedRouteForBooking] = useState<RouteOption | null>(null);
  const [bookingCarrier, setBookingCarrier] = useState(CARRIER_OPTIONS[0]);
  const [containerType, setContainerType] = useState('40ft High Cube Dry');
  const [departureDate, setDepartureDate] = useState('2026-08-01');
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);

  // Waypoints Drawer/Modal State
  const [selectedWaypointRoute, setSelectedWaypointRoute] = useState<RouteOption | null>(null);

  // Swap ports
  const handleSwapPorts = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  // Preset trade lane click
  const handlePresetLane = (orig: string, dest: string) => {
    setOrigin(orig);
    setDestination(dest);
    triggerOptimization(orig, dest, strategy);
  };

  const triggerOptimization = (orig: string, dest: string, currentStrategy: typeof strategy) => {
    setLoading(true);
    setTimeout(() => {
      let updated: RouteOption[] = [
        {
          id: 'r-opt-1',
          name: `Multimodal: Rail-to-Sea Corridor (${orig.split(',')[0]} ➔ ${dest.split(',')[0]})`,
          mode: 'Rail + Ocean',
          costPerTeu: orig.includes('VN') ? 3800 : 4200,
          transitDays: orig.includes('US') ? 18 : 22,
          reliabilityPct: 98,
          co2Tons: 1.1,
          isAiRecommended: true,
        },
        {
          id: 'r-opt-2',
          name: `Direct Deep Sea Freight Lane`,
          mode: 'Ocean Freight',
          costPerTeu: 3050,
          transitDays: orig.includes('US') ? 16 : 34,
          reliabilityPct: 84,
          co2Tons: 1.4,
          isAiRecommended: false,
        },
        {
          id: 'r-opt-3',
          name: `Air Express Logistics Bridge`,
          mode: 'Air Cargo',
          costPerTeu: 8750,
          transitDays: 4,
          reliabilityPct: 99,
          co2Tons: 4.6,
          isAiRecommended: false,
        },
      ];

      // Mark AI recommended according to strategy
      if (currentStrategy === 'cost') {
        updated = updated.map((r) => ({ ...r, isAiRecommended: r.mode === 'Ocean Freight' }));
      } else if (currentStrategy === 'speed') {
        updated = updated.map((r) => ({ ...r, isAiRecommended: r.mode === 'Air Cargo' }));
      } else if (currentStrategy === 'carbon') {
        updated = updated.map((r) => ({ ...r, isAiRecommended: r.mode.includes('Rail') }));
      }

      setRoutesList(updated);
      setLoading(false);
      if (onTriggerAction) {
        onTriggerAction('Corridor Scoring Executed', `${orig} to ${dest} (${volumeTeu} TEUs)`);
      }
    }, 800);
  };

  const handleOptimizeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerOptimization(origin, destination, strategy);
  };

  const handleToggleDisruption = (routeId: string) => {
    const isDisruptedNow = !disruptedRouteIds[routeId];
    setDisruptedRouteIds((prev) => ({ ...prev, [routeId]: isDisruptedNow }));
    if (onTriggerAction) {
      onTriggerAction(
        isDisruptedNow ? 'Disruption Impact Injected' : 'Disruption Cleared',
        `Route ${routeId}`
      );
    }
  };

  const handleConfirmBooking = () => {
    if (!selectedRouteForBooking) return;

    const bookingId = `BK-${Math.floor(10000 + Math.random() * 90000)}`;
    const isDisrupted = disruptedRouteIds[selectedRouteForBooking.id];

    const finalCostPerTeu = isDisrupted
      ? selectedRouteForBooking.costPerTeu + 750
      : selectedRouteForBooking.costPerTeu;

    const newBooking: ConfirmedBooking = {
      id: bookingId,
      routeId: selectedRouteForBooking.id,
      routeName: selectedRouteForBooking.name,
      mode: selectedRouteForBooking.mode,
      origin,
      destination,
      volumeTeu,
      totalCostUsd: finalCostPerTeu * volumeTeu,
      totalCo2Tons: parseFloat((selectedRouteForBooking.co2Tons * volumeTeu).toFixed(1)),
      carrier: bookingCarrier,
      containerType,
      departureDate,
      status: 'EDI Dispatched',
      bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setActiveBookings((prev) => [newBooking, ...prev]);
    setIsBookingSuccess(true);

    if (onTriggerAction) {
      onTriggerAction(
        'Freight Booking Confirmed',
        `${selectedRouteForBooking.name} (${volumeTeu} TEUs via ${bookingCarrier})`
      );
    }

    setTimeout(() => {
      setIsBookingSuccess(false);
      setSelectedRouteForBooking(null);
    }, 1800);
  };

  const handleCancelBooking = (bookingId: string) => {
    setActiveBookings((prev) => prev.filter((b) => b.id !== bookingId));
    if (onTriggerAction) {
      onTriggerAction('Freight Booking Cancelled', `Manifest ${bookingId}`);
    }
  };

  // Sort routes list dynamically
  const sortedRoutes = [...routesList].sort((a, b) => {
    const aDisrupted = disruptedRouteIds[a.id];
    const bDisrupted = disruptedRouteIds[b.id];

    const aCost = aDisrupted ? a.costPerTeu + 750 : a.costPerTeu;
    const bCost = bDisrupted ? b.costPerTeu + 750 : b.costPerTeu;

    const aDays = aDisrupted ? a.transitDays + 6 : a.transitDays;
    const bDays = bDisrupted ? b.transitDays + 6 : b.transitDays;

    if (sortBy === 'cost') return aCost - bCost;
    if (sortBy === 'time') return aDays - bDays;
    if (sortBy === 'reliability') return b.reliabilityPct - a.reliabilityPct;
    if (sortBy === 'co2') return a.co2Tons - b.co2Tons;
    return (b.isAiRecommended ? 1 : 0) - (a.isAiRecommended ? 1 : 0);
  });

  return (
    <div className="space-y-6">
      {/* Module Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <Route className="w-6 h-6 text-cyan-400" />
            Route Optimizer (Multimodal 5-Factor Scoring)
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Evaluates freight cost, transit speed, geopolitical risk, Scope 3 carbon footprint, and carrier reliability in real-time.
          </p>
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-zinc-300 hover:text-zinc-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Grid Cards</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'table' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-zinc-300 hover:text-zinc-100'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Comparison Matrix</span>
          </button>
          <button
            onClick={() => setViewMode('waypoints')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'waypoints' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-zinc-300 hover:text-zinc-100'
            }`}
          >
            <Anchor className="w-4 h-4" />
            <span>Corridor Map</span>
          </button>
        </div>
      </div>

      {/* Preset Trade Lane Shortcuts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-mono text-zinc-300 uppercase tracking-wider whitespace-nowrap flex items-center gap-1 shrink-0 font-bold">
          <Zap className="w-4 h-4 text-amber-400" /> Presets:
        </span>
        {PRESET_LANES.map((lane, idx) => (
          <button
            key={idx}
            onClick={() => handlePresetLane(lane.origin, lane.dest)}
            className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-cyan-500/40 text-zinc-200 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer shrink-0"
          >
            {lane.label}
          </button>
        ))}
      </div>

      {/* Origin & Destination Search Form & Parameters Panel */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 space-y-5 shadow-xl">
        <form onSubmit={handleOptimizeSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1">
              Origin Shipping Hub
            </label>
            <div className="relative">
              <Navigation className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div className="sm:col-span-1 flex items-center justify-center">
            <button
              type="button"
              onClick={handleSwapPorts}
              title="Swap Origin and Destination"
              className="p-2.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-xl transition-all cursor-pointer hover:border-cyan-500/50"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          <div className="sm:col-span-4">
            <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
              Destination Retail / POS Hub
            </label>
            <div className="relative">
              <Navigation className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-zinc-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{loading ? 'Scoring Corridor...' : 'Optimize Multimodal Routes'}</span>
            </button>
          </div>
        </form>

        {/* Volume TEUs Slider & Strategy Filter Row */}
        <div className="pt-4 border-t border-zinc-800/80 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-5 bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between items-center text-[11px] mb-1">
                <span className="text-zinc-400 font-medium">Shipment Volume (TEUs)</span>
                <span className="font-mono font-bold text-cyan-400 text-xs">{volumeTeu} TEUs</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={volumeTeu}
                onChange={(e) => setVolumeTeu(parseInt(e.target.value))}
                className="w-full accent-cyan-400 bg-zinc-800 cursor-pointer h-1.5 rounded-lg"
              />
            </div>
          </div>

          <div className="md:col-span-7 flex flex-wrap items-center justify-between md:justify-end gap-2">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">AI Goal:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { key: 'balanced', label: 'Balanced 5-Factor' },
                { key: 'cost', label: 'Lowest Cost ($)' },
                { key: 'speed', label: 'Fastest Speed' },
                { key: 'carbon', label: 'Lowest Carbon' },
              ].map((strat) => (
                <button
                  key={strat.key}
                  onClick={() => {
                    setStrategy(strat.key as any);
                    triggerOptimization(origin, destination, strat.key as any);
                  }}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    strategy === strat.key
                      ? 'bg-cyan-500 text-zinc-950 shadow-md'
                      : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  {strat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sorting Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          Ranked Corridor Options ({sortedRoutes.length})
        </h3>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-400 text-[11px]">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-500 font-mono cursor-pointer"
          >
            <option value="ai">AI Recommended Score</option>
            <option value="cost">Lowest Total Freight Cost ($)</option>
            <option value="time">Fastest Transit Time (Days)</option>
            <option value="reliability">Highest Reliability (%)</option>
            <option value="co2">Lowest Scope 3 Carbon (CO2)</option>
          </select>
        </div>
      </div>

      {/* 1. GRID CARDS VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sortedRoutes.map((r) => {
            const isDisrupted = disruptedRouteIds[r.id];
            const currentCostPerTeu = isDisrupted ? r.costPerTeu + 750 : r.costPerTeu;
            const currentDays = isDisrupted ? r.transitDays + 6 : r.transitDays;
            const currentReliability = isDisrupted ? Math.max(60, r.reliabilityPct - 14) : r.reliabilityPct;

            const totalCost = currentCostPerTeu * volumeTeu;
            const totalCo2 = (r.co2Tons * volumeTeu).toFixed(1);

            return (
              <div
                key={r.id}
                className={`p-6 rounded-2xl bg-zinc-900/90 border transition-all relative overflow-hidden flex flex-col justify-between ${
                  r.isAiRecommended
                    ? 'border-cyan-500/50 shadow-xl shadow-cyan-500/10'
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {r.isAiRecommended && (
                  <div className="absolute top-0 right-0 bg-cyan-500 text-zinc-950 text-[10px] font-bold uppercase px-3 py-1 rounded-bl-xl flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Recommended
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                      {r.mode}
                    </span>
                    {isDisrupted && (
                      <span className="text-[9px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 px-1.5 py-0.5 rounded animate-pulse">
                        Suez Delay +6d
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-zinc-100 mb-4">{r.name}</h4>

                  {/* 2x2 Metric Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-xl space-y-0.5">
                      <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                        <DollarSign className="w-3 h-3" /> Unit Freight
                      </span>
                      <span className="text-sm font-bold font-mono text-zinc-100">
                        ${currentCostPerTeu.toLocaleString()}{' '}
                        <span className="text-[10px] text-zinc-500">/TEU</span>
                      </span>
                    </div>

                    <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-xl space-y-0.5">
                      <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Transit Time
                      </span>
                      <span className={`text-sm font-bold font-mono ${isDisrupted ? 'text-rose-400' : 'text-cyan-400'}`}>
                        {currentDays} Days
                      </span>
                    </div>

                    <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-xl space-y-0.5">
                      <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" /> Reliability
                      </span>
                      <span className="text-sm font-bold font-mono text-emerald-400">{currentReliability}%</span>
                    </div>

                    <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-xl space-y-0.5">
                      <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                        <Leaf className="w-3 h-3 text-emerald-400" /> Scope 3 CO2
                      </span>
                      <span className="text-sm font-bold font-mono text-zinc-300">{totalCo2}t Total</span>
                    </div>
                  </div>

                  {/* Shipment Volume Total Callout */}
                  <div className="p-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl mb-4 flex justify-between items-center text-xs">
                    <span className="text-zinc-400">Total Shipment ({volumeTeu} TEUs):</span>
                    <span className="font-bold font-mono text-cyan-300">${totalCost.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleToggleDisruption(r.id)}
                    className={`w-full py-1.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      isDisrupted
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3" />
                    <span>{isDisrupted ? 'Disruption Active (Click to Clear)' : 'Simulate Chokepoint Disruption'}</span>
                  </button>

                  <button
                    onClick={() => setSelectedRouteForBooking(r)}
                    className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-zinc-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-cyan-500/10"
                  >
                    <span>Select Freight Booking</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. MATRIX TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto border border-zinc-800 rounded-2xl bg-zinc-900/90">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 font-mono">
                <th className="p-3.5">ROUTE & MODE</th>
                <th className="p-3.5">UNIT COST</th>
                <th className="p-3.5">TRANSIT</th>
                <th className="p-3.5">RELIABILITY</th>
                <th className="p-3.5">SCOPE 3 CO2</th>
                <th className="p-3.5">TOTAL COST ({volumeTeu} TEUs)</th>
                <th className="p-3.5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 font-mono text-zinc-200">
              {sortedRoutes.map((r) => {
                const isDisrupted = disruptedRouteIds[r.id];
                const cost = isDisrupted ? r.costPerTeu + 750 : r.costPerTeu;
                const days = isDisrupted ? r.transitDays + 6 : r.transitDays;
                const totalCost = cost * volumeTeu;

                return (
                  <tr key={r.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-zinc-100 flex items-center gap-2 font-sans">
                        {r.name}
                        {r.isAiRecommended && (
                          <span className="text-[9px] bg-cyan-500 text-zinc-950 px-1.5 py-0.5 rounded font-bold">
                            AI
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">{r.mode}</span>
                    </td>
                    <td className="p-3.5 font-bold">${cost.toLocaleString()} /TEU</td>
                    <td className={`p-3.5 font-bold ${isDisrupted ? 'text-rose-400' : 'text-cyan-400'}`}>
                      {days} Days
                    </td>
                    <td className="p-3.5 text-emerald-400 font-bold">{r.reliabilityPct}%</td>
                    <td className="p-3.5 font-bold">{(r.co2Tons * volumeTeu).toFixed(1)}t</td>
                    <td className="p-3.5 font-bold text-cyan-300">${totalCost.toLocaleString()}</td>
                    <td className="p-3.5 text-right space-x-2 font-sans">
                      <button
                        onClick={() => setSelectedRouteForBooking(r)}
                        className="px-3 py-1.5 bg-cyan-500 text-zinc-950 font-bold rounded-lg text-xs hover:bg-cyan-400 transition-colors cursor-pointer"
                      >
                        Book Freight
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. WAYPOINTS & CORRIDOR MAP VIEW */}
      {viewMode === 'waypoints' && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 space-y-6">
          <div className="pb-3 border-b border-zinc-800 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <Anchor className="w-4 h-4 text-cyan-400" />
                Intermodal Corridor Waypoint Telemetry ({origin} ➔ {destination})
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Real-time node status, maritime canal throughput, and port congestion levels.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: '1. Origin Port', name: `${origin.split(',')[0]} Yantian Hub`, type: 'Port Loading', risk: 'Low (12%)', status: 'Optimal' },
              { step: '2. Sea Transit', name: 'Malacca Strait Shipping Lane', type: 'Maritime Transit', risk: 'Low (18%)', status: 'Clear' },
              { step: '3. Chokepoint', name: 'Red Sea / Bab el-Mandeb', type: 'Canal Passage', risk: 'Elevated (58%)', status: 'Nav-Alert' },
              { step: '4. Canal Passage', name: 'Suez Canal Direct Corridor', type: 'Canal Passage', risk: 'Moderate (35%)', status: 'Queued' },
              { step: '5. Dest Port', name: `${destination.split(',')[0]} Euromax Hub`, type: 'Port Unloading', risk: 'Low (14%)', status: 'Optimal' },
            ].map((node, i) => (
              <div key={i} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 relative">
                <span className="text-[10px] font-mono text-cyan-400 block">{node.step}</span>
                <h4 className="text-xs font-bold text-zinc-100">{node.name}</h4>
                <p className="text-[10px] text-zinc-400">{node.type}</p>
                <div className="pt-2 border-t border-zinc-900 flex justify-between items-center text-[10px]">
                  <span className="text-zinc-500">Node Risk:</span>
                  <span
                    className={`font-mono font-bold ${
                      node.risk.includes('Elevated') ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {node.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmed Active Bookings & Dispatched EDI Section */}
      {activeBookings.length > 0 && (
        <div className="bg-zinc-900/90 border border-emerald-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-zinc-100">Confirmed Active Freight Bookings ({activeBookings.length})</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              EDI Messages Transmitted
            </span>
          </div>

          <div className="space-y-3">
            {activeBookings.map((b) => (
              <div key={b.id} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-400">{b.id}</span>
                    <span className="text-zinc-400">• {b.carrier}</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold font-sans">
                      {b.status}
                    </span>
                  </div>
                  <p className="font-sans font-bold text-zinc-100">{b.routeName} ({b.volumeTeu} TEUs)</p>
                  <p className="text-[11px] text-zinc-400 font-sans">
                    {b.origin} ➔ {b.destination} | Dept: {b.departureDate} | Container: {b.containerType}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-zinc-500 block text-[10px]">Total Freight</span>
                    <span className="font-bold text-emerald-400 text-sm">${b.totalCostUsd.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={() => handleCancelBooking(b.id)}
                    className="p-2 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors cursor-pointer"
                    title="Cancel Booking"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Freight Booking Interactive Modal */}
      {selectedRouteForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-zinc-900 border border-cyan-500/40 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedRouteForBooking(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 p-1 rounded-lg bg-zinc-800/50"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 uppercase">
                Freight Booking Confirmation
              </span>
              <h3 className="text-lg font-bold text-zinc-100 mt-2">{selectedRouteForBooking.name}</h3>
              <p className="text-xs text-zinc-400">{origin} ➔ {destination}</p>
            </div>

            {isBookingSuccess ? (
              <div className="p-6 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-emerald-300">Booking Confirmed & EDI Transmitted!</h4>
                <p className="text-xs text-zinc-300">Space allocated on carrier manifest. Reference EDI #BK-88421.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Form inputs */}
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                    Select Ocean / Rail Carrier
                  </label>
                  <select
                    value={bookingCarrier}
                    onChange={(e) => setBookingCarrier(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-cyan-500 font-mono cursor-pointer"
                  >
                    {CARRIER_OPTIONS.map((c, i) => (
                      <option key={i} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                      Equipment Type
                    </label>
                    <select
                      value={containerType}
                      onChange={(e) => setContainerType(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-cyan-500 font-mono cursor-pointer"
                    >
                      <option value="40ft High Cube Dry">40ft High Cube Dry</option>
                      <option value="20ft Standard Dry">20ft Standard Dry</option>
                      <option value="40ft Reefer (Chilled)">40ft Reefer (Chilled)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                      Departure Date
                    </label>
                    <input
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-zinc-100 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>

                {/* Calculation breakdown */}
                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span>Volume Allocated:</span>
                    <span className="text-zinc-200 font-bold">{volumeTeu} TEUs</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Rate per TEU:</span>
                    <span className="text-zinc-200 font-bold">
                      ${(disruptedRouteIds[selectedRouteForBooking.id]
                        ? selectedRouteForBooking.costPerTeu + 750
                        : selectedRouteForBooking.costPerTeu
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Est. Scope 3 Carbon:</span>
                    <span className="text-emerald-400 font-bold">
                      {(selectedRouteForBooking.co2Tons * volumeTeu).toFixed(1)} Tons CO2
                    </span>
                  </div>
                  <div className="pt-2 border-t border-zinc-800 flex justify-between text-sm font-bold">
                    <span className="text-zinc-100">Total Freight Investment:</span>
                    <span className="text-cyan-300">
                      $
                      {(
                        (disruptedRouteIds[selectedRouteForBooking.id]
                          ? selectedRouteForBooking.costPerTeu + 750
                          : selectedRouteForBooking.costPerTeu) * volumeTeu
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleConfirmBooking}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-zinc-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Confirm Freight Booking & Dispatch EDI</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

