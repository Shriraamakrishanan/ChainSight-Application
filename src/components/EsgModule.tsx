import React from 'react';
import { ESGReportItem } from '../types';
import { Leaf, FileText, Download, CheckCircle2, ShieldCheck, PieChart, Award } from 'lucide-react';

interface EsgModuleProps {
  esgReports: ESGReportItem[];
}

export const EsgModule: React.FC<EsgModuleProps> = ({ esgReports }) => {
  const handleDownloadPdf = (report: ESGReportItem) => {
    // Generate text/PDF summary file download
    const content = `CHAINSIGHT OPEN INNOVATION PLATFORM
ESG SUSTAINABILITY & SCOPE 3 EMISSIONS REPORT
=================================================
Report ID: ${report.id}
Supplier Name: ${report.supplierName}
Reporting Period: ${report.reportingPeriod}
Submitted Date: ${report.submittedAt}

1. SCOPE 3 TRANSPORT EMISSIONS (tCO2e)
--------------------------------------
- Ocean Freight: ${report.co2Ocean} tCO2e
- Air Freight:   ${report.co2Air} tCO2e
- Road Freight:  ${report.co2Road} tCO2e
- Rail Freight:  ${report.co2Rail} tCO2e
Total Scope 3:   ${report.co2Ocean + report.co2Air + report.co2Road + report.co2Rail} tCO2e

2. ECOSYSTEM COMPLIANCE SCORES
------------------------------
- Labor & Human Rights:      ${report.laborRightsPct}%
- Carbon Reporting Standard: ${report.carbonReportingPct}%
- Waste Reduction Program:   ${report.wasteReductionPct}%
- Water Usage Efficiency:    ${report.waterUsagePct}%

Status: ChainSight Verified Supplier • ISO 14001 Compliant
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ChainSight_ESG_Report_${report.supplierName.replace(/\s+/g, '_')}_${report.reportingPeriod}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Module Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <Leaf className="w-6 h-6 text-emerald-400" />
            ESG Tracker & Scope 3 Emissions Compliance
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Supplier self-reported Scope 3 emissions data and 6-pillar sustainability compliance metrics.
          </p>
        </div>
      </div>

      {/* Scope 3 Donut Breakdown & Pillar Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Scope 3 Donut Chart Card */}
        <div className="lg:col-span-6 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-cyan-400" /> Scope 3 Emissions by Transport Mode (24.5k tCO2e)
          </h3>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
            {/* Visual Conic Gradient Donut */}
            <div className="w-40 h-40 rounded-full bg-[conic-gradient(#2d7af1_0%_45%,#00f0ff_45%_80%,#00ff88_80%_95%,#ffaa00_95%_100%)] p-5 flex items-center justify-center shadow-lg shadow-black/50">
              <div className="w-28 h-28 rounded-full bg-zinc-950 flex flex-col items-center justify-center text-center">
                <span className="text-lg font-bold font-mono text-zinc-100">24.5k</span>
                <span className="text-[10px] text-zinc-500 uppercase font-mono">tCO2e Total</span>
              </div>
            </div>

            {/* Legend list */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-blue-500" />
                <span className="text-zinc-300 font-medium">Ocean Freight (45%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-cyan-400" />
                <span className="text-zinc-300 font-medium">Air Cargo (35%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-400" />
                <span className="text-zinc-300 font-medium">Road Freight (15%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-400" />
                <span className="text-zinc-300 font-medium">Rail Freight (5%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Pillar Compliance Standards */}
        <div className="lg:col-span-6 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" /> Supplier Ecosystem Compliance Pillars
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-zinc-300 mb-1">
                <span>Labor Rights & Human Rights</span>
                <span className="font-mono text-emerald-400 font-bold">92%</span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-zinc-300 mb-1">
                <span>Carbon Reporting Transparency</span>
                <span className="font-mono text-cyan-400 font-bold">78%</span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: '78%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-zinc-300 mb-1">
                <span>Waste & Circular Packaging</span>
                <span className="font-mono text-amber-400 font-bold">65%</span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '65%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-zinc-300 mb-1">
                <span>Water Efficiency & Conservation</span>
                <span className="font-mono text-emerald-400 font-bold">85%</span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Submitted ESG Audits Table */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
          Verified Supplier Self-Reported Audits ({esgReports.length})
        </h3>

        <div className="space-y-3">
          {esgReports.map((report) => (
            <div
              key={report.id}
              className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-zinc-100">{report.supplierName}</h4>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {report.reportingPeriod}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 font-mono">
                  Submitted: {report.submittedAt} • Labor: {report.laborRightsPct}% • Carbon: {report.carbonReportingPct}%
                </div>
              </div>

              <button
                onClick={() => handleDownloadPdf(report)}
                className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Download Report</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
