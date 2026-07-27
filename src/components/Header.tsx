import React, { useState } from 'react';
import { ActiveTab } from '../types';
import {
  LayoutDashboard,
  Kanban,
  FileText,
  BarChart3,
  Users,
  Settings,
  Search,
  Plus,
  Bell,
  Sparkles,
  CheckCircle2,
  Server,
  Download,
  Check
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenNewTask: () => void;
  onOpenNewDoc: () => void;
  taskCount: number;
  serverStatus: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenNewTask,
  onOpenNewDoc,
  taskCount,
  serverStatus,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShareApp = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'kanban', label: 'Kanban Tasks', icon: <Kanban className="w-4 h-4" /> },
    { id: 'docs', label: 'Docs & AI Writer', icon: <FileText className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'team', label: 'Team Directory', icon: <Users className="w-4 h-4" /> },
    { id: 'settings', label: 'Deployment & Config', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-zinc-100 text-base tracking-tight">ChainSight</span>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">
                  v2.4 Production
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">Global Supply Chain Intelligence & Telemetry</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, docs, team or tags (Press '/' to focus)..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-zinc-900/80 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
            />
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* Server Status Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-300">
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span>Express API:</span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Active
              </span>
            </div>

            {/* Share / Copy URL button */}
            <button
              onClick={handleShareApp}
              title="Copy App URL to share or inspect"
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-200 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5 text-zinc-400" />}
              <span>{copied ? 'URL Copied!' : 'Export / Share'}</span>
            </button>

            {/* Quick Create Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowQuickMenu(!showQuickMenu)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Item</span>
              </button>

              {showQuickMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    onClick={() => {
                      onOpenNewTask();
                      setShowQuickMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-zinc-200 hover:bg-zinc-800 flex items-center gap-2"
                  >
                    <Kanban className="w-4 h-4 text-indigo-400" />
                    <span>Create Task Card</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenNewDoc();
                      setShowQuickMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-zinc-200 hover:bg-zinc-800 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>Draft AI Document</span>
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-lg border border-transparent hover:border-zinc-800 transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <h4 className="text-xs font-semibold text-zinc-100">Activity & Alerts</h4>
                    <span className="text-[10px] text-zinc-400">3 Unread</span>
                  </div>
                  <div className="space-y-3 pt-3">
                    <div className="flex items-start gap-2.5 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-zinc-200 font-medium">Build Check Passed</p>
                        <p className="text-zinc-400 text-[11px]">Cloud Run container built with 0 errors.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs">
                      <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-zinc-200 font-medium">Gemini Proxy Active</p>
                        <p className="text-zinc-400 text-[11px]">Server routes ready for AI text drafting.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2 border-t border-zinc-800/60">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-zinc-800 text-indigo-300 border border-zinc-700/80 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.id === 'kanban' && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {taskCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
