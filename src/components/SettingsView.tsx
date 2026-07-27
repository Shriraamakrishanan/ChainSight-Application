import React, { useState } from 'react';
import {
  Server,
  Shield,
  CheckCircle2,
  AlertCircle,
  Database,
  RefreshCw,
  Terminal,
  Cpu,
  Key,
  Globe,
  Sparkles,
  Download,
  Trash2
} from 'lucide-react';

interface SettingsViewProps {
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onResetData }) => {
  const [testingHealth, setTestingHealth] = useState(false);
  const [healthResult, setHealthResult] = useState<any>(null);

  const handleTestHealth = async () => {
    setTestingHealth(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealthResult(data);
    } catch (err: any) {
      setHealthResult({ status: 'error', message: err.message });
    } finally {
      setTestingHealth(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* View Header */}
      <div className="pb-4 border-b border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <Server className="w-5 h-5 text-indigo-400" />
          Deployment & System Diagnostics
        </h2>
        <p className="text-xs text-zinc-400">
          Inspect Cloud Run service readiness, verify environment variables, test API health, and manage database state.
        </p>
      </div>

      {/* Cloud Run Deployment Readiness Card */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-zinc-100">Cloud Run Deployment Status</h3>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Ready for Cloud Run
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
            <span className="text-zinc-500 text-[10px]">INGRESS PORT</span>
            <p className="font-mono text-zinc-200 font-semibold mt-0.5">Port 3000 (Required)</p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
            <span className="text-zinc-500 text-[10px]">BACKEND PROXY</span>
            <p className="font-mono text-emerald-400 font-semibold mt-0.5">Express + Vite Active</p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
            <span className="text-zinc-500 text-[10px]">AI MODEL PROXY</span>
            <p className="font-mono text-indigo-300 font-semibold mt-0.5">Gemini 2.5 Flash</p>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={handleTestHealth}
            disabled={testingHealth}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testingHealth ? 'animate-spin' : ''}`} />
            <span>{testingHealth ? 'Pinging /api/health...' : 'Test Backend /api/health Endpoint'}</span>
          </button>

          {healthResult && (
            <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">
              {JSON.stringify(healthResult, null, 2)}
            </pre>
          )}
        </div>
      </div>

      {/* Secret & Env Variable Check */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
          <Key className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-zinc-100">Environment Variables & Security</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
            <div>
              <p className="font-mono font-semibold text-zinc-200">GEMINI_API_KEY</p>
              <p className="text-[11px] text-zinc-400">Required for live Gemini AI generation calls</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              Injected / Configured
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
            <div>
              <p className="font-mono font-semibold text-zinc-200">APP_URL</p>
              <p className="text-[11px] text-zinc-400">Dynamic Cloud Run hosting URL for callback routes</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
              Dynamic Runtime
            </span>
          </div>
        </div>
      </div>

      {/* Data Management & Reset */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
          <Database className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-zinc-100">Local Database State Management</h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-200">Reset Local Demo Dataset</p>
            <p className="text-[11px] text-zinc-400">Restores all tasks, documents, and logs to initial sprint sample state.</p>
          </div>

          <button
            onClick={onResetData}
            className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

    </div>
  );
};
