import React, { useState } from 'react';
import { UserSession, NotificationItem } from '../types';
import { Sparkles, Bell, Search, LogOut, Shield, Briefcase, Factory, Activity, CheckCircle2, FileText } from 'lucide-react';

interface ChainHeaderProps {
  session: UserSession;
  notifications: NotificationItem[];
  onSignOut: () => void;
  onOpenAiCopilot: () => void;
  onOpenReportModal: () => void;
  onSearchQuery?: (q: string) => void;
}

export const ChainHeader: React.FC<ChainHeaderProps> = ({
  session,
  notifications,
  onSignOut,
  onOpenAiCopilot,
  onOpenReportModal,
  onSearchQuery,
}) => {
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const [notifList, setNotifList] = useState<NotificationItem[]>(notifications);
  const [searchVal, setSearchVal] = useState('');

  const unreadCount = notifList.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifList(notifList.map((n) => ({ ...n, isRead: true })));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    if (onSearchQuery) onSearchQuery(e.target.value);
  };

  return (
    <header className="h-16 bg-zinc-900/90 border-b border-zinc-800 px-4 lg:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 backdrop-blur-xl">
      {/* Brand & Workspace Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-100 text-base sm:text-lg tracking-tight">ChainSight</span>
            <span className="px-2 py-0.5 text-xs uppercase font-bold tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-md">
              Enterprise v2.4
            </span>
          </div>
          <p className="text-xs text-zinc-300 hidden sm:block">Smart Supply Chain & POS Telemetry Platform</p>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="hidden md:flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 w-64 lg:w-80">
        <Search className="w-4 h-4 text-zinc-400 shrink-0" />
        <input
          type="text"
          value={searchVal}
          onChange={handleSearchChange}
          placeholder="Search suppliers, POS SKUs, disruptions..."
          className="bg-transparent border-none text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none w-full"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        
        {/* Official PDF Dossier Launcher */}
        <button
          onClick={onOpenReportModal}
          className="px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/10"
          title="Export Authorized PDF Dossier"
        >
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>PDF Report</span>
        </button>

        {/* Gemini AI Copilot Launcher */}
        <button
          onClick={onOpenAiCopilot}
          className="px-3.5 py-2 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 border border-cyan-500/30 text-cyan-300 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-cyan-500/10"
        >
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>

        {/* Notifications Button & Drawer */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDrawer(!showNotifDrawer)}
            className="p-2 text-zinc-400 hover:text-zinc-100 bg-zinc-950 border border-zinc-800 rounded-xl relative transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-zinc-950 text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifDrawer && (
            <div className="absolute right-0 mt-2 w-80 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 shadow-2xl space-y-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs font-bold">
                <span className="text-zinc-200">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1 text-xs">
                {notifList.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl border space-y-0.5 ${
                      !n.isRead ? 'bg-cyan-500/5 border-cyan-500/20' : 'bg-zinc-900/50 border-zinc-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-zinc-500">
                      <span className="font-bold text-zinc-300">{n.title}</span>
                      <span>{n.time}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-snug">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Chip */}
        <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
          <img
            src={session.avatar}
            alt={session.name}
            className="w-7 h-7 rounded-full border border-cyan-500/40 object-cover"
          />
          <div className="hidden md:block text-left text-xs">
            <span className="font-bold text-zinc-200 block leading-none">{session.name}</span>
            <span className="text-[10px] text-zinc-400 uppercase font-mono">{session.role}</span>
          </div>

          <button
            onClick={onSignOut}
            className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg transition-all cursor-pointer ml-1"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
