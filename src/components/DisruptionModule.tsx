import React, { useState } from 'react';
import { DisruptionAlert } from '../types';
import {
  AlertTriangle,
  Clock,
  ShieldCheck,
  MapPin,
  Zap,
  ArrowRight,
  CheckCircle2,
  CloudRain,
  Newspaper,
  BarChart3,
  ListCheck,
  Send,
  Sparkles,
  RotateCcw,
  ShieldAlert,
  Play,
  Layers,
  Activity,
  Check,
  Bot,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DisruptionModuleProps {
  disruptions: DisruptionAlert[];
  onTriggerAction: (actionName: string, targetTitle: string) => void;
}

export interface ExecutedActionRecord {
  id: string;
  disruptionId?: string;
  actionTitle: string;
  targetTitle: string;
  location: string;
  executedAt: string;
  channel: string;
  status: 'Dispatched & Active' | 'EDI Transmitted' | 'POS Re-allocated' | 'In Progress';
  mitigatedRiskUsd: number;
}

export const DisruptionModule: React.FC<DisruptionModuleProps> = ({
  disruptions,
  onTriggerAction,
}) => {
  const [activeFilter, setActiveTab] = useState<'all' | 'weather' | 'market' | 'news' | 'pos'>('all');

  // Track executed actions persistently in state
  const [executedActions, setExecutedActions] = useState<ExecutedActionRecord[]>([
    {
      id: 'ACT-901',
      disruptionId: 'd-1',
      actionTitle: 'Reroute via Cape of Good Hope & Boost Rail',
      targetTitle: 'Red Sea Maritime Corridor Blockade',
      location: 'Suez Canal / Bab el-Mandeb',
      executedAt: '10 mins ago',
      channel: 'Logistics EDI & Carrier Re-booking',
      status: 'Dispatched & Active',
      mitigatedRiskUsd: 145000,
    },
  ]);

  // Track which disruption IDs have been executed
  const [executedDisruptionIds, setExecutedDisruptionIds] = useState<Record<string, boolean>>({
    'd-1': true,
  });

  // Expanded AI Playbook state per disruption ID
  const [expandedPlaybooks, setExpandedPlaybooks] = useState<
    Record<
      string,
      {
        playbook: { priority: string; action: string; detail: string }[];
        parallelAiAnalysis?: string;
        loading?: boolean;
      }
    >
  >({});

  const handleFetchAiPlaybook = async (d: DisruptionAlert) => {
    if (expandedPlaybooks[d.id] && !expandedPlaybooks[d.id].loading) {
      setExpandedPlaybooks((prev) => {
        const next = { ...prev };
        delete next[d.id];
        return next;
      });
      return;
    }

    setExpandedPlaybooks((prev) => ({
      ...prev,
      [d.id]: { playbook: [], loading: true },
    }));

    try {
      const res = await fetch('/api/ai/playbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: d.title,
          location: d.location,
          description: d.description,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setExpandedPlaybooks((prev) => ({
          ...prev,
          [d.id]: {
            playbook: data.playbook || [],
            parallelAiAnalysis: data.parallelAiAnalysis,
            loading: false,
          },
        }));
      } else {
        throw new Error('Failed to fetch');
      }
    } catch (err) {
      setExpandedPlaybooks((prev) => ({
        ...prev,
        [d.id]: {
          playbook: [
            { priority: 'IMMEDIATE', action: `Re-route Freight around ${d.location}`, detail: 'Divert 35% volume to backup freight corridors.' },
            { priority: 'IMMEDIATE', action: 'Trigger POS Safety Stock Replenishment', detail: 'Draw down store buffer stock to maintain sales velocity.' },
            { priority: 'URGENT', action: 'Activate Dual-Sourcing Supplier POs', detail: 'Issue spot POs to pre-qualified secondary partners.' },
            { priority: 'URGENT', action: 'Notify Key Account Managers of SLA Delay', detail: `Send automated ETA advisories (+${d.leadTimeDays}d).` },
            { priority: 'MONITOR', action: 'Continuous Telemetry Monitoring', detail: 'Stream real-time AIS & meteorological tracking feeds.' },
          ],
          parallelAiAnalysis: `### Gemini AI Mitigation Plan for ${d.title}\n\n1. **Dynamic Rerouting:** Re-route inbound cargo away from **${d.location}**.\n2. **POS Safety Buffers:** Release store-level buffer inventory.\n3. **Dual Sourcing:** Re-allocate PO volume to backup suppliers.`,
          loading: false,
        },
      }));
    }
  };

  // Modal / Form state for custom playbook execution
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customActionTitle, setCustomActionTitle] = useState('');
  const [customTargetHub, setCustomTargetHub] = useState('Shenzhen Port / Yantian Hub');
  const [customChannel, setCustomChannel] = useState('Air Freight Expedite');

  const filteredDisruptions = disruptions.filter(
    (d) => activeFilter === 'all' || d.sourceType === activeFilter
  );

  const handleExecuteAction = (d: DisruptionAlert) => {
    const recordId = `ACT-${Math.floor(100 + Math.random() * 900)}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newRecord: ExecutedActionRecord = {
      id: recordId,
      disruptionId: d.id,
      actionTitle: d.suggestedAction,
      targetTitle: d.title,
      location: d.location,
      executedAt: `${nowTime} (Just now)`,
      channel:
        d.sourceType === 'pos'
          ? 'POS Store Inventory Re-allocation'
          : d.sourceType === 'weather'
          ? 'Air Expedite & Buffer Transfer'
          : 'Logistics EDI Dispatch',
      status: 'Dispatched & Active',
      mitigatedRiskUsd: Math.floor(80000 + Math.random() * 120000),
    };

    setExecutedActions((prev) => [newRecord, ...prev]);
    setExecutedDisruptionIds((prev) => ({ ...prev, [d.id]: true }));

    // Notify parent
    onTriggerAction(d.suggestedAction, d.title);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customActionTitle.trim()) return;

    const recordId = `ACT-${Math.floor(100 + Math.random() * 900)}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newRecord: ExecutedActionRecord = {
      id: recordId,
      actionTitle: customActionTitle,
      targetTitle: `Custom Distribution Command (${customTargetHub})`,
      location: customTargetHub,
      executedAt: `${nowTime} (Just now)`,
      channel: customChannel,
      status: 'In Progress',
      mitigatedRiskUsd: 95000,
    };

    setExecutedActions((prev) => [newRecord, ...prev]);
    onTriggerAction(customActionTitle, customTargetHub);

    setCustomActionTitle('');
    setIsCustomModalOpen(false);
  };

  const handleRollback = (id: string) => {
    setExecutedActions((prev) => prev.filter((a) => a.id !== id));
    onTriggerAction('Containment Action Recalled', `Record ${id}`);
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'weather':
        return <CloudRain className="w-4 h-4 text-cyan-400" />;
      case 'news':
        return <Newspaper className="w-4 h-4 text-amber-400" />;
      case 'market':
        return <BarChart3 className="w-4 h-4 text-emerald-400" />;
      case 'pos':
        return <Zap className="w-4 h-4 text-indigo-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
    }
  };

  const totalRiskMitigatedUsd = executedActions.reduce((acc, a) => acc + a.mitigatedRiskUsd, 0);

  return (
    <div className="space-y-6">
      {/* Module Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 text-rose-400" />
            Disruption & Distribution Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1">
            Machine learning pattern recognition predicts port closures, weather shocks, and POS inventory stockouts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCustomModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-zinc-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-cyan-500/10"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Execute Custom Playbook</span>
          </button>

          {/* Source Filter Tabs */}
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl text-xs sm:text-sm font-semibold">
            {(['all', 'weather', 'market', 'news', 'pos'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-2 rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                  activeFilter === tab ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold' : 'text-zinc-300 hover:text-zinc-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Disruption Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active AI Disruption Cards */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center justify-between">
            <span>Active Predictive Warnings ({filteredDisruptions.length})</span>
            <span className="text-xs font-mono text-cyan-400 font-bold">Ensemble ML Confidence ~94%</span>
          </h3>

          <div className="space-y-4">
            {filteredDisruptions.map((d) => {
              const isExecuted = !!executedDisruptionIds[d.id];
              return (
                <div
                  key={d.id}
                  className={`p-5 rounded-2xl bg-zinc-900/90 border transition-all ${
                    isExecuted
                      ? 'border-emerald-500/50 bg-emerald-950/10 shadow-lg shadow-emerald-500/5'
                      : d.severity === 'critical'
                      ? 'border-rose-500/40 shadow-lg shadow-rose-500/5'
                      : d.severity === 'high'
                      ? 'border-amber-500/40'
                      : 'border-zinc-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                        {getSourceIcon(d.sourceType)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-zinc-100">{d.title}</h4>
                          {isExecuted && (
                            <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Action Dispatched
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-300 mt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400" /> {d.location}
                          </span>
                          <span>•</span>
                          <span>Predicted: {d.predictedAt}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-mono font-bold px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> {d.leadTimeDays}d Lead Time
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed my-3">{d.description}</p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-zinc-800/80">
                    <div className="flex items-center gap-3 text-xs sm:text-sm">
                      <span className="text-zinc-300">
                        Confidence Score: <strong className="text-emerald-400 font-mono">{(d.confidence * 100).toFixed(0)}%</strong>
                      </span>
                      <span className="text-zinc-300">
                        Severity: <strong className="text-rose-400 uppercase">{d.severity}</strong>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleFetchAiPlaybook(d)}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                      >
                        <Bot className="w-3.5 h-3.5 text-indigo-400" />
                        <span>
                          {expandedPlaybooks[d.id] ? 'Hide Gemini Playbook' : 'View Gemini Playbook'}
                        </span>
                        {expandedPlaybooks[d.id] ? (
                          <ChevronUp className="w-3 h-3 text-indigo-400" />
                        ) : (
                          <ChevronDown className="w-3 h-3 text-indigo-400" />
                        )}
                      </button>

                      <button
                        onClick={() => handleExecuteAction(d)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow ${
                          isExecuted
                            ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30'
                            : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-zinc-950'
                        }`}
                      >
                        {isExecuted ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Re-dispatch Action: {d.suggestedAction}</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 fill-current" />
                            <span>Execute Action: {d.suggestedAction}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expandable Gemini AI Mitigation Playbook Panel */}
                  {expandedPlaybooks[d.id] && (
                    <div className="mt-4 pt-4 border-t border-zinc-800 space-y-3 bg-zinc-950/80 p-4 rounded-xl border border-indigo-500/30">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 uppercase tracking-wider">
                          <Sparkles className="w-4 h-4 text-indigo-400" />
                          <span>Gemini AI Integrated Mitigation Playbook</span>
                        </h5>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          Live Gemini 3.6 Flash
                        </span>
                      </div>

                      {expandedPlaybooks[d.id].loading ? (
                        <div className="py-6 text-center text-xs text-indigo-300 flex items-center justify-center gap-2">
                          <Zap className="w-4 h-4 text-indigo-400 animate-spin" />
                          <span>Generating AI Response Mitigation Playbook with Gemini...</span>
                        </div>
                      ) : (
                        <div className="space-y-3 text-xs">
                          {/* Playbook Steps */}
                          <div className="space-y-2">
                            {expandedPlaybooks[d.id].playbook.map((step, sIdx) => (
                              <div
                                key={sIdx}
                                className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg flex items-start justify-between gap-2"
                              >
                                <div className="flex items-start gap-2">
                                  <span
                                    className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded mt-0.5 shrink-0 ${
                                      step.priority === 'IMMEDIATE'
                                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                        : step.priority === 'URGENT'
                                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                        : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                    }`}
                                  >
                                    {step.priority}
                                  </span>
                                  <div>
                                    <h6 className="font-bold text-zinc-100">{step.action}</h6>
                                    <p className="text-[11px] text-zinc-400 mt-0.5">{step.detail}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    onTriggerAction(step.action, `${d.title} (${step.priority})`)
                                  }
                                  className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold rounded cursor-pointer shrink-0"
                                >
                                  Dispatch
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* Parallel Gemini Analysis Markdown */}
                          {expandedPlaybooks[d.id].parallelAiAnalysis && (
                            <div className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-lg text-zinc-300 leading-relaxed text-[11px]">
                              <Markdown remarkPlugins={[remarkGfm]}>
                                {expandedPlaybooks[d.id].parallelAiAnalysis}
                              </Markdown>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Signal Feed Stream & Summary */}
        <div className="lg:col-span-4 space-y-4">
          {/* Executive Impact Summary */}
          <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Containment Summary</span>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl space-y-0.5">
                <span className="text-[10px] text-zinc-500">Actions Dispatched</span>
                <span className="text-lg font-bold font-mono text-emerald-400 block">{executedActions.length}</span>
              </div>
              <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl space-y-0.5">
                <span className="text-[10px] text-zinc-500">Risk Value Mitigated</span>
                <span className="text-sm font-bold font-mono text-cyan-300 block">${totalRiskMitigatedUsd.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Signal Ingestion Stream */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 pb-2 border-b border-zinc-800">
              Signal Ingestion Stream (340+ Feeds)
            </h3>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1 text-xs">
                <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                  <span>04:12 AM • POS Stream</span>
                  <span className="text-cyan-400 font-bold">Surge Detected</span>
                </div>
                <p className="text-zinc-200">Bangalore Flagship store POS sales up +42.5% for Smart POS Terminal V5.</p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1 text-xs">
                <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                  <span>03:45 AM • Weather API</span>
                  <span className="text-rose-400 font-bold">Typhoon Alert</span>
                </div>
                <p className="text-zinc-200">Category 3 typhoon path verified for South China Sea corridor.</p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1 text-xs">
                <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                  <span>02:20 AM • Commodity Spot</span>
                  <span className="text-amber-400 font-bold">Price Spike</span>
                </div>
                <p className="text-zinc-200">Aluminum spot pricing escalated +5.2% overnight in Asian markets.</p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1 text-xs">
                <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                  <span>01:10 AM • News Sentiment</span>
                  <span className="text-indigo-400 font-bold">Labor Strike</span>
                </div>
                <p className="text-zinc-200">Rotterdam port workers filing strike notice for upcoming Tuesday.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Executed Actions Display Log (Where Executed Actions are Displayed) */}
      <div id="executed-actions-log" className="bg-zinc-900/90 border border-emerald-500/30 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <ListCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-zinc-100">
              Executed Distribution & Containment Actions Log ({executedActions.length})
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            Real-Time Automated Dispatch Stream
          </span>
        </div>

        {executedActions.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-xs">
            No containment actions executed yet. Click "Execute Action" above on any incident to dispatch playbooks.
          </div>
        ) : (
          <div className="space-y-3">
            {executedActions.map((act) => (
              <div
                key={act.id}
                className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyan-400">{act.id}</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold font-sans">
                      {act.status}
                    </span>
                    <span className="text-zinc-500">• {act.executedAt}</span>
                  </div>
                  <h4 className="font-sans font-bold text-zinc-100 text-sm">{act.actionTitle}</h4>
                  <p className="text-[11px] text-zinc-400 font-sans">
                    Target: <strong className="text-zinc-200">{act.targetTitle}</strong> ({act.location})
                  </p>
                  <p className="text-[10px] text-cyan-400 font-sans">Channel: {act.channel}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="text-zinc-500 block text-[10px]">Mitigated Risk Value</span>
                    <span className="font-bold text-emerald-400 text-sm">${act.mitigatedRiskUsd.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={() => handleRollback(act.id)}
                    className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 border border-zinc-800 hover:border-rose-500/30 rounded-lg transition-colors cursor-pointer"
                    title="Rollback Action"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Action Execution Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-cyan-500/40 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <Send className="w-4 h-4 text-cyan-400" />
                Dispatch Custom Distribution Playbook
              </h3>
              <button
                onClick={() => setIsCustomModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-100 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCustomSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                  Action Command Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Expedite 2,000 units via Air Cargo to Hub B"
                  value={customActionTitle}
                  onChange={(e) => setCustomActionTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-cyan-500 font-sans"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                  Target Logistics / POS Hub
                </label>
                <select
                  value={customTargetHub}
                  onChange={(e) => setCustomTargetHub(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-cyan-500 font-sans cursor-pointer"
                >
                  <option value="Shenzhen Port / Yantian Hub">Shenzhen Port / Yantian Hub</option>
                  <option value="Rotterdam Euromax Hub">Rotterdam Euromax Hub</option>
                  <option value="Bangalore Smart POS Retail Hub">Bangalore Smart POS Retail Hub</option>
                  <option value="Long Beach Transpacific Hub">Long Beach Transpacific Hub</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                  Dispatch Channel
                </label>
                <select
                  value={customChannel}
                  onChange={(e) => setCustomChannel(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-cyan-500 font-sans cursor-pointer"
                >
                  <option value="Air Freight Expedite">Air Freight Expedite</option>
                  <option value="POS Inventory Buffer Shift">POS Inventory Buffer Shift</option>
                  <option value="Logistics EDI Carrier Dispatch">Logistics EDI Carrier Dispatch</option>
                  <option value="Emergency Supplier PO Release">Emergency Supplier PO Release</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-zinc-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Execute Action & Transmit Signal</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

