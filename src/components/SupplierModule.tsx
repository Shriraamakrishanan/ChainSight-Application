import React from 'react';
import { SupplierRecord } from '../types';
import { Building2, ShieldCheck, AlertOctagon, Mail, Globe, CheckCircle2, RefreshCw } from 'lucide-react';

interface SupplierModuleProps {
  suppliers: SupplierRecord[];
}

export const SupplierModule: React.FC<SupplierModuleProps> = ({ suppliers }) => {
  const dualSourcedCount = suppliers.filter((s) => s.isDualSourced).length;
  const resiliencyPct = Math.round((dualSourcedCount / suppliers.length) * 100);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 bg-emerald-400';
    if (score >= 70) return 'text-amber-400 bg-amber-400';
    return 'text-rose-400 bg-rose-400';
  };

  return (
    <div className="space-y-6">
      {/* Module Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 flex items-center gap-2">
            <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" />
            Supplier Health Scoring & Dual-Sourcing Engine
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1">
            Continuous automated auditing across 184 monitored global suppliers across Financial, Operational, Geopolitical, and Ethical pillars.
          </p>
        </div>
      </div>

      {/* Dual-Sourcing Progress Banner */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-zinc-100">Dual-Sourcing Network Resiliency Progress</h3>
          </div>
          <span className="text-base font-bold font-mono text-emerald-400">{resiliencyPct}% Dual-Sourced</span>
        </div>

        <div className="w-full bg-zinc-950 h-3 rounded-full overflow-hidden border border-zinc-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-1000 rounded-full"
            style={{ width: `${resiliencyPct}%` }}
          />
        </div>

        <p className="text-xs text-zinc-300">
          Target: 80% of critical component SKUs backed up with secondary tier-1 regional suppliers by Q4.
        </p>
      </div>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((s) => {
          const overallAvg = Math.round((s.financialScore + s.operationalScore + s.geopoliticalScore + s.ethicalScore) / 4);

          return (
            <div
              key={s.id}
              className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all space-y-4"
            >
              <div className="flex items-start justify-between pb-3 border-b border-zinc-800/80">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-zinc-100">{s.name}</h4>
                    {s.status === 'healthy' ? (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Healthy
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        At Risk
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">{s.category} • {s.country}</p>
                </div>

                <div className="text-right">
                  <span className="text-lg font-bold font-mono text-zinc-100">{overallAvg}</span>
                  <span className="text-[10px] text-zinc-500 block uppercase">Overall</span>
                </div>
              </div>

              {/* 4 Health Dimension Progress Bars */}
              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-zinc-400">Financial Score</span>
                    <span className="font-mono text-zinc-200">{s.financialScore}%</span>
                  </div>
                  <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${getScoreColor(s.financialScore).split(' ')[1]}`} style={{ width: `${s.financialScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-zinc-400">Operational Score</span>
                    <span className="font-mono text-zinc-200">{s.operationalScore}%</span>
                  </div>
                  <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${getScoreColor(s.operationalScore).split(' ')[1]}`} style={{ width: `${s.operationalScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-zinc-400">Geopolitical Risk</span>
                    <span className="font-mono text-zinc-200">{s.geopoliticalScore}%</span>
                  </div>
                  <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${getScoreColor(s.geopoliticalScore).split(' ')[1]}`} style={{ width: `${s.geopoliticalScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-zinc-400">Ethical / ESG</span>
                    <span className="font-mono text-zinc-200">{s.ethicalScore}%</span>
                  </div>
                  <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${getScoreColor(s.ethicalScore).split(' ')[1]}`} style={{ width: `${s.ethicalScore}%` }} />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-[11px]">
                <span className="flex items-center gap-1 text-zinc-400">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" /> {s.contactEmail}
                </span>

                {s.isDualSourced ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Backup Active
                  </span>
                ) : (
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <AlertOctagon className="w-3.5 h-3.5" /> Single Source
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
