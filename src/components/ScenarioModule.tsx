import React, { useState } from 'react';
import { ScenarioResult } from '../types';
import {
  Play,
  Download,
  Zap,
  CheckCircle2,
  ShieldAlert,
  DollarSign,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
  Sparkles,
  Bot,
  Layers,
  Send,
  RotateCcw,
  Check,
} from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const ScenarioModule: React.FC = () => {
  const [eventType, setEventType] = useState('Port Closure');
  const [targetNode, setTargetNode] = useState('Shanghai Port (CNSHA)');
  const [revenueExposed, setRevenueExposed] = useState(850);
  const [durationDays, setDurationDays] = useState(30);
  const [severityPct, setSeverityPct] = useState(80);
  const [loading, setLoading] = useState(false);
  const [simResult, setSimResult] = useState<ScenarioResult | null>(null);

  // Tab state for Parallel AI View
  const [activeTab, setActiveTab] = useState<'playbook' | 'parallel_ai'>('playbook');

  // Track executed steps
  const [executedStepIndices, setExecutedStepIndices] = useState<Record<number, boolean>>({});

  // Custom AI prompt state for re-generating playbook
  const [customPrompt, setCustomPrompt] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRunSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setExecutedStepIndices({});

    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          targetNode,
          revenueExposedM: revenueExposed,
          durationDays,
          severityPct,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSimResult(data);
      } else {
        fallbackCalculation();
      }
    } catch (err) {
      fallbackCalculation();
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateAiPlaybook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simResult) return;
    setIsRegenerating(true);

    try {
      const res = await fetch('/api/ai/playbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${eventType} at ${targetNode}`,
          location: targetNode,
          description: `Exposed revenue $${revenueExposed}M over ${durationDays} days at ${severityPct}% severity.`,
          customPrompt: customPrompt || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSimResult((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            playbook: data.playbook || prev.playbook,
            parallelAiAnalysis: data.parallelAiAnalysis || prev.parallelAiAnalysis,
          };
        });
        setCustomPrompt('');
      }
    } catch (err) {
      console.error('Failed to regenerate AI playbook:', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleToggleStepExecution = (idx: number) => {
    setExecutedStepIndices((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const fallbackCalculation = () => {
    const sevFactor = severityPct / 100;
    const durFactor = durationDays / 365;
    const revenueAtRiskM = +(revenueExposed * sevFactor * durFactor * 1.4).toFixed(1);
    const totalExposureM = +(revenueAtRiskM * 1.8).toFixed(1);
    const savingsM = +(totalExposureM * 0.65).toFixed(1);

    setSimResult({
      revenueAtRiskM,
      avgDelayDays: Math.round(durationDays * sevFactor * 0.55),
      recoveryDays: Math.round(durationDays * 1.4 + 5),
      totalExposureM,
      savingsProactiveM: savingsM,
      affectedSkus: Math.round(40 + sevFactor * 60),
      impactLevel: totalExposureM > 50 ? 'critical' : 'high',
      playbook: [
        { priority: 'IMMEDIATE', action: 'Reroute via Alternate Port / Hub', detail: `Divert ${Math.round(sevFactor * 40)}% of volume through backup freight lanes within 24h.` },
        { priority: 'IMMEDIATE', action: 'Trigger POS Store Auto-Replenishment', detail: 'Draw down 30-day buffer stock for Tier-1 retail outlets; re-balance regional POS stores.' },
        { priority: 'URGENT', action: 'Activate Secondary Supplier Contracts', detail: 'Issue emergency purchase orders to pre-qualified dual-source vendors.' },
        { priority: 'URGENT', action: 'Issue Customer & Retail SLA Advisory', detail: 'Notify accounts of expected delay and issue SLA credits.' },
        { priority: 'MONITOR', action: 'Continuous AIS & Weather Telemetry Tracking', detail: 'Subscribe to real-time satellite updates to adjust ETA calculations.' },
      ],
      parallelAiAnalysis: `### Gemini AI Risk Assessment Memo\n\n**Event:** ${eventType} at **${targetNode}**\n- Revenue at Risk: **$${revenueAtRiskM}M**\n- Expected Delay: **+${Math.round(durationDays * sevFactor * 0.55)} Days**\n\n#### Recommended Containment Strategy\n1. **Shift Maritime Volume:** Re-route container traffic to alternate deepwater ports.\n2. **POS Safety Stock:** Re-balance store inventory to protect customer sales velocity.\n3. **Supplier Dual-Sourcing:** Issue emergency POs to backup suppliers.`,
    });
  };

  const handleDownloadExecutiveReport = () => {
    if (!simResult) return;
    const reportText = `CHAINSIGHT EXECUTIVE SCENARIO REPORT
=================================================
Simulated Event: ${eventType}
Target Node: ${targetNode}
Duration: ${durationDays} Days | Severity: ${severityPct}%
Exposed Annual Revenue: $${revenueExposed}M

1. FINANCIAL EXPOSURE BREAKDOWN
--------------------------------
- Revenue at Risk:        $${simResult.revenueAtRiskM}M
- Total Financial Impact: $${simResult.totalExposureM}M
- Proactive Savings:      $${simResult.savingsProactiveM}M
- Delivery Delay Cascade: +${simResult.avgDelayDays} Days avg
- Recovery Timeline:      ${simResult.recoveryDays} Days
- Affected Product SKUs:  ${simResult.affectedSkus}

2. AI RESPONSE PLAYBOOK
-----------------------
${simResult.playbook.map((step, idx) => `${idx + 1}. [${step.priority}] ${step.action} - ${step.detail}`).join('\n')}

3. PARALLEL GEMINI AI ANALYSIS
------------------------------
${simResult.parallelAiAnalysis || 'N/A'}

Generated by ChainSight SimEngine v2.1 • Gemini 3.6 Flash Copilot
`;
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ChainSight_Scenario_Report_${eventType.replace(/\s+/g, '_')}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Module Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <Play className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 fill-current shrink-0" />
            <span>Scenario Simulator ("What-If" Risk Engine)</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-zinc-400 mt-1">
            Model supply chain shocks, compute total financial exposure, and generate dynamic parallel AI mitigation playbooks with Gemini 3.6 Flash.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Interactive Input Form */}
        <div className="lg:col-span-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 pb-2 border-b border-zinc-800">
            Define Simulation Scenario
          </h3>

          <form onSubmit={handleRunSimulation} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Disruption Event Type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-cyan-500 font-medium cursor-pointer"
              >
                <option value="Port Closure">Port Closure & Congestion</option>
                <option value="Supplier Bankruptcy">Supplier Bankruptcy / Insolvency</option>
                <option value="Extreme Weather">Extreme Meteorological Event</option>
                <option value="Geopolitical Conflict">Geopolitical Border Escalation</option>
                <option value="POS Demand Surge">POS Retail Demand Surge (+40%)</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1">Target Supply Node / Region</label>
              <input
                type="text"
                value={targetNode}
                onChange={(e) => setTargetNode(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-zinc-400">Exposed Annual Revenue ($M)</span>
                <span className="font-mono text-cyan-400">${revenueExposed}M</span>
              </div>
              <input
                type="number"
                value={revenueExposed}
                onChange={(e) => setRevenueExposed(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-zinc-400">Disruption Duration (Days)</span>
                <span className="font-mono text-cyan-400">{durationDays} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="90"
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1">
                <span className="text-zinc-400">Severity Factor (%)</span>
                <span className="font-mono text-rose-400 font-bold">{severityPct}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={severityPct}
                onChange={(e) => setSeverityPct(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-zinc-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{loading ? 'Computing AI Simulation...' : 'Run Scenario Simulation'}</span>
            </button>
          </form>
        </div>

        {/* Right Output Stage: Financial Cards + Parallel AI Response Playbook */}
        <div className="lg:col-span-7 space-y-4">
          {simResult ? (
            <div className="bg-zinc-900/90 border border-cyan-500/40 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl shadow-cyan-500/5">
              
              {/* Header with Impact and Download Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    Impact: {simResult.impactLevel.toUpperCase()}
                  </span>
                  <h3 className="text-sm font-bold text-zinc-100">Simulation Financial & AI Analysis</h3>
                </div>

                <button
                  onClick={handleDownloadExecutiveReport}
                  className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Executive Report</span>
                </button>
              </div>

              {/* Financial Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1">
                  <span className="text-[10px] text-zinc-500 block uppercase">Revenue At Risk</span>
                  <span className="text-base font-bold font-mono text-rose-400">${simResult.revenueAtRiskM}M</span>
                </div>

                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1">
                  <span className="text-[10px] text-zinc-500 block uppercase">Avg Delivery Delay</span>
                  <span className="text-base font-bold font-mono text-amber-400">+{simResult.avgDelayDays}d</span>
                </div>

                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1">
                  <span className="text-[10px] text-zinc-500 block uppercase">Recovery Time</span>
                  <span className="text-base font-bold font-mono text-cyan-400">{simResult.recoveryDays}d</span>
                </div>

                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1">
                  <span className="text-[10px] text-zinc-500 block uppercase">Proactive Savings</span>
                  <span className="text-base font-bold font-mono text-emerald-400">${simResult.savingsProactiveM}M</span>
                </div>
              </div>

              {/* View Selector Tabs: Action Playbook vs Parallel AI Response */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('playbook')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === 'playbook'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-zinc-400 hover:text-zinc-200 bg-zinc-950 border border-zinc-800'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Actionable AI Playbook ({simResult.playbook.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('parallel_ai')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeTab === 'parallel_ai'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                        : 'text-zinc-400 hover:text-zinc-200 bg-zinc-950 border border-zinc-800'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Parallel Gemini AI Response</span>
                  </button>
                </div>

                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 hidden sm:inline-block">
                  Live Gemini 3.6 Flash Ingest
                </span>
              </div>

              {/* TAB 1: Actionable AI Playbook Steps */}
              {activeTab === 'playbook' && (
                <div className="space-y-4">
                  <div className="space-y-2.5">
                    {simResult.playbook.map((step, idx) => {
                      const isExecuted = !!executedStepIndices[idx];
                      return (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                            isExecuted
                              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-200'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded mt-0.5 shrink-0 ${
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
                              <h5 className="font-bold text-zinc-100 flex items-center gap-2">
                                <span>{step.action}</span>
                                {isExecuted && (
                                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono">
                                    Dispatched
                                  </span>
                                )}
                              </h5>
                              <p className="text-[11px] text-zinc-400 mt-0.5">{step.detail}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleToggleStepExecution(idx)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 self-start sm:self-auto ${
                              isExecuted
                                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                                : 'bg-zinc-900 hover:bg-zinc-800 text-cyan-400 border border-zinc-700'
                            }`}
                          >
                            {isExecuted ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Executed</span>
                              </>
                            ) : (
                              <>
                                <Zap className="w-3.5 h-3.5 text-cyan-400 fill-current" />
                                <span>Execute Action</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* On-The-Fly AI Playbook Custom Re-Generation Form */}
                  <form onSubmit={handleRegenerateAiPlaybook} className="pt-3 border-t border-zinc-800 space-y-2">
                    <label className="block text-[11px] font-medium text-zinc-400">
                      Refine Playbook with Custom Gemini Directive
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Prioritize air freight expedite and protect Bangalore POS inventory..."
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-cyan-500 font-sans"
                      />
                      <button
                        type="submit"
                        disabled={isRegenerating}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>{isRegenerating ? 'Generating...' : 'Re-Generate with Gemini'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: Parallel Gemini AI Integrated Response Analysis */}
              {activeTab === 'parallel_ai' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-zinc-950 border border-indigo-500/30 text-xs text-zinc-300 leading-relaxed space-y-3 max-h-[400px] overflow-y-auto">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs pb-2 border-b border-zinc-800">
                      <Sparkles className="w-4 h-4" />
                      <span>Gemini 3.6 Flash Parallel Executive Copilot Analysis</span>
                    </div>

                    <div className="prose prose-invert prose-xs max-w-none space-y-2">
                      <Markdown remarkPlugins={[remarkGfm]}>
                        {simResult.parallelAiAnalysis || 'Generating parallel AI analysis...'}
                      </Markdown>
                    </div>
                  </div>

                  <form onSubmit={handleRegenerateAiPlaybook} className="pt-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask Gemini follow-up question or instruct strategy shift..."
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500 font-sans"
                    />
                    <button
                      type="submit"
                      disabled={isRegenerating}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isRegenerating ? 'Analyzing...' : 'Ask Gemini'}</span>
                    </button>
                  </form>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-zinc-900/40 border border-dashed border-zinc-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-3 min-h-[420px]">
              <FileSpreadsheet className="w-10 h-10 text-zinc-600" />
              <h3 className="text-sm font-bold text-zinc-300">Ready to Compute Simulation</h3>
              <p className="text-xs text-zinc-500 max-w-sm">
                Adjust event parameters on the left and click "Run Scenario Simulation" to generate financial exposure metrics and parallel AI mitigation playbooks.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

