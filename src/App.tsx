import React, { useState, useEffect } from 'react';
import { UserSession, ModuleTab, ESGReportItem, PosStoreFeed, DisruptionAlert, LiveDataFeed, SkuDemandForecast } from './types';
import {
  initialDataFeeds,
  initialDisruptions,
  initialSuppliers,
  initialRoutes,
  initialPosFeeds,
  initialSkuForecasts,
  initialESGReports,
  initialShipments,
  initialAuditLogs,
  initialNotifications,
} from './data/chainsightData';

import { LoginPage } from './components/LoginPage';
import { ChainHeader } from './components/ChainHeader';
import { OverviewModule } from './components/OverviewModule';
import { DisruptionModule } from './components/DisruptionModule';
import { RouteModule } from './components/RouteModule';
import { SupplierModule } from './components/SupplierModule';
import { PosDemandModule } from './components/PosDemandModule';
import { EsgModule } from './components/EsgModule';
import { ScenarioModule } from './components/ScenarioModule';
import { AdminConsole } from './components/AdminConsole';
import { SupplierPortal } from './components/SupplierPortal';
import { AiCopilotModal } from './components/AiCopilotModal';
import { OfficialReportModal } from './components/OfficialReportModal';

import {
  Globe,
  AlertTriangle,
  Route as RouteIcon,
  Building2,
  ShoppingBag,
  Leaf,
  Play,
  Shield,
  Factory,
  CheckCircle2,
} from 'lucide-react';

export function App() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState<ModuleTab | 'admin' | 'supplier_portal'>('overview');
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [esgReports, setEsgReports] = useState<ESGReportItem[]>(initialESGReports);

  // Live telemetry state
  const [posStores, setPosStores] = useState<PosStoreFeed[]>(initialPosFeeds);
  const [dataFeeds, setDataFeeds] = useState<LiveDataFeed[]>(initialDataFeeds);
  const [disruptions, setDisruptions] = useState<DisruptionAlert[]>(initialDisruptions);
  const [skuForecasts, setSkuForecasts] = useState<SkuDemandForecast[]>(initialSkuForecasts);

  // Real-time telemetry simulation timer for POS and Disruption modules
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Update POS store velocities, trends, and sync freshness
      setPosStores((prevStores) =>
        prevStores.map((store) => {
          const delta = (Math.random() - 0.48) * 350;
          const newVelocity = Math.max(1000, Math.round(store.salesVelocityUsd + delta));
          const trendDelta = parseFloat(((Math.random() - 0.48) * 0.6).toFixed(1));
          return {
            ...store,
            salesVelocityUsd: newVelocity,
            salesTrendPct: parseFloat((store.salesTrendPct + trendDelta).toFixed(1)),
            lastSyncSecAgo: Math.floor(Math.random() * 4) + 1,
          };
        })
      );

      // 2. Update Live Data Feeds latency & sync status
      setDataFeeds((prevFeeds) =>
        prevFeeds.map((feed) => {
          const latencyDelta = Math.floor((Math.random() - 0.5) * 6);
          const newLatency = Math.max(12, Math.min(280, feed.latencyMs + latencyDelta));
          return {
            ...feed,
            latencyMs: newLatency,
            lastUpdated: `${Math.floor(Math.random() * 4) + 1}s ago`,
          };
        })
      );

      // 3. Update POS SKU demand consumption
      setSkuForecasts((prevSkus) =>
        prevSkus.map((sku) => {
          if (sku.trendType === 'surge') {
            const stockDelta = Math.floor(Math.random() * 4);
            return {
              ...sku,
              currentPosStock: Math.max(0, sku.currentPosStock - stockDelta),
              dailyPosSales: sku.dailyPosSales + Math.floor(Math.random() * 2),
            };
          }
          return sku;
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleLoginSuccess = (userSession: UserSession) => {
    setSession(userSession);
    if (userSession.role === 'admin') {
      setActiveTab('admin');
    } else if (userSession.role === 'supplier') {
      setActiveTab('supplier_portal');
    } else {
      setActiveTab('overview');
    }
  };

  const handleSignOut = () => {
    setSession(null);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleTriggerAction = (actionName: string, targetTitle: string) => {
    showToast(`Action Dispatched: "${actionName}" for ${targetTitle}`);
  };

  const handleAddEsgReport = (newReport: ESGReportItem) => {
    setEsgReports((prev) => [newReport, ...prev]);
    showToast(`ESG Audit report submitted for ${newReport.supplierName}`);
  };

  // If user is not authenticated, show Login Page
  if (!session) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans relative">
      
      {/* Fixed Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-zinc-950 px-4 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-2xl shadow-emerald-500/30 border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <ChainHeader
        session={session}
        notifications={initialNotifications}
        onSignOut={handleSignOut}
        onOpenAiCopilot={() => setIsAiOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Main Container Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        
        {/* Module Tab Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-zinc-800">
          
          {session.role === 'procurement' && (
            <>
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 shadow'
                    : 'text-zinc-300 hover:text-zinc-100 bg-zinc-900/50 hover:bg-zinc-900'
                }`}
              >
                <Globe className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-cyan-400" />
                <span>Overview & Risk Map</span>
              </button>

              <button
                onClick={() => setActiveTab('disruption')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'disruption'
                    ? 'bg-rose-500/10 border border-rose-500/40 text-rose-300 shadow'
                    : 'text-zinc-300 hover:text-zinc-100 bg-zinc-900/50 hover:bg-zinc-900'
                }`}
              >
                <AlertTriangle className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-rose-400" />
                <span>Disruption Intel</span>
              </button>

              <button
                onClick={() => setActiveTab('route')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'route'
                    ? 'bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 shadow'
                    : 'text-zinc-300 hover:text-zinc-100 bg-zinc-900/50 hover:bg-zinc-900'
                }`}
              >
                <RouteIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-cyan-400" />
                <span>Route Optimizer</span>
              </button>

              <button
                onClick={() => setActiveTab('supplier')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'supplier'
                    ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 shadow'
                    : 'text-zinc-300 hover:text-zinc-100 bg-zinc-900/50 hover:bg-zinc-900'
                }`}
              >
                <Building2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-400" />
                <span>Supplier Health</span>
              </button>

              <button
                onClick={() => setActiveTab('pos_demand')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'pos_demand'
                    ? 'bg-indigo-500/10 border border-indigo-500/40 text-indigo-300 shadow'
                    : 'text-zinc-300 hover:text-zinc-100 bg-zinc-900/50 hover:bg-zinc-900'
                }`}
              >
                <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-indigo-400" />
                <span>POS & Demand AI</span>
              </button>

              <button
                onClick={() => setActiveTab('esg')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'esg'
                    ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 shadow'
                    : 'text-zinc-300 hover:text-zinc-100 bg-zinc-900/50 hover:bg-zinc-900'
                }`}
              >
                <Leaf className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-400" />
                <span>ESG Tracker</span>
              </button>

              <button
                onClick={() => setActiveTab('scenario')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'scenario'
                    ? 'bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 shadow'
                    : 'text-zinc-300 hover:text-zinc-100 bg-zinc-900/50 hover:bg-zinc-900'
                }`}
              >
                <Play className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-cyan-400 fill-current" />
                <span>Scenario Simulator</span>
              </button>
            </>
          )}

          {session.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'admin'
                  ? 'bg-rose-500/10 border border-rose-500/40 text-rose-300 shadow'
                  : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/50'
              }`}
            >
              <Shield className="w-4 h-4 text-rose-400" />
              <span>Admin Console</span>
            </button>
          )}

          {session.role === 'supplier' && (
            <button
              onClick={() => setActiveTab('supplier_portal')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'supplier_portal'
                  ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 shadow'
                  : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/50'
              }`}
            >
              <Factory className="w-4 h-4 text-emerald-400" />
              <span>Supplier Portal</span>
            </button>
          )}

        </div>

        {/* Dynamic Tab Body Render */}
        <div className="flex-1">
          {activeTab === 'overview' && (
            <OverviewModule
              dataFeeds={dataFeeds}
              disruptions={disruptions}
              onNavigateTab={(tab) => setActiveTab(tab as ModuleTab)}
              onOpenReportModal={() => setIsReportModalOpen(true)}
            />
          )}

          {activeTab === 'disruption' && (
            <DisruptionModule
              disruptions={disruptions}
              onTriggerAction={handleTriggerAction}
            />
          )}

          {activeTab === 'route' && (
            <RouteModule
              routes={initialRoutes}
              onTriggerAction={handleTriggerAction}
            />
          )}

          {activeTab === 'supplier' && <SupplierModule suppliers={initialSuppliers} />}

          {activeTab === 'pos_demand' && (
            <PosDemandModule
              posStores={posStores}
              skuForecasts={skuForecasts}
              onTriggerAction={handleTriggerAction}
            />
          )}

          {activeTab === 'esg' && <EsgModule esgReports={esgReports} />}

          {activeTab === 'scenario' && <ScenarioModule />}

          {activeTab === 'admin' && (
            <AdminConsole
              session={session}
              dataFeeds={dataFeeds}
              auditLogs={initialAuditLogs}
            />
          )}

          {activeTab === 'supplier_portal' && (
            <SupplierPortal
              session={session}
              shipments={initialShipments}
              onAddEsgReport={handleAddEsgReport}
            />
          )}
        </div>

      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-4 px-6 bg-zinc-950 text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        <span>ChainSight • Enterprise Supply Chain & POS Telemetry Platform</span>
        <span>Environment Port 3000 • Production Ready</span>
      </footer>

      {/* Gemini AI Copilot Drawer */}
      <AiCopilotModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

      {/* Official Authorized PDF Report Modal */}
      <OfficialReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        session={session}
      />

    </div>
  );
}

export default App;
