import React from 'react';
import { AppTab } from '../types';
import { Kanban, BarChart3, FileText, Terminal, Sparkles, Search, Layers, RefreshCw } from 'lucide-react';

interface NavbarProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAiAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  onOpenAiAssistant,
}) => {
  const tabs: { id: AppTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'kanban', label: 'Tasks & Kanban', icon: <Kanban className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics & Revenue', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'notes', label: 'Smart AI Notes', icon: <FileText className="w-4 h-4" /> },
    { id: 'api', label: 'API Playground', icon: <Terminal className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800/80">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand & Suite Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-zinc-100 tracking-tight">OmniSuite</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v2.4 Live
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">Integrated Operations & Developer Workspace</p>
          </div>
        </div>

        {/* Global Search Input */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search across tasks, notes, metrics, or APIs..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-zinc-950/80 text-xs text-zinc-200 placeholder-zinc-500 pl-9 pr-4 py-2 rounded-lg border border-zinc-800 focus:outline-none focus:border-indigo-500/80 transition-all"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Copilot</span>
          </button>

          <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs text-emerald-400 font-medium hidden sm:inline">System Active</span>
          </div>
        </div>
      </div>

      {/* App Navigation Switcher Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-zinc-800/40">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
