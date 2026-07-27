import React, { useState } from 'react';
import { TeamMember, ActivityLog } from '../types';
import { Users, Mail, Shield, Plus, CheckCircle2, UserPlus, Clock } from 'lucide-react';

interface TeamViewProps {
  team: TeamMember[];
  setTeam: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  activities: ActivityLog[];
}

export const TeamView: React.FC<TeamViewProps> = ({ team, setTeam, activities }) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Senior Software Engineer');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !newMemberEmail) return;

    const newMem: TeamMember = {
      id: `mem-${Date.now()}`,
      name: newMemberName,
      email: newMemberEmail,
      role: newMemberRole,
      department: 'Engineering',
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?auto=format&fit=crop&q=80&w=150`,
      status: 'active',
      tasksAssigned: 0,
    };

    setTeam((prev) => [...prev, newMem]);
    setNewMemberName('');
    setNewMemberEmail('');
    setShowInviteModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Engineering & Operations Directory
          </h2>
          <p className="text-xs text-zinc-400">
            Manage workspace roles, team member availability, and active task load assignments.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Team Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {team.map((member) => (
          <div
            key={member.id}
            className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="relative">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-11 h-11 rounded-full object-cover border border-zinc-700"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zinc-900 ${
                    member.status === 'active'
                      ? 'bg-emerald-400'
                      : member.status === 'busy'
                      ? 'bg-amber-400'
                      : 'bg-zinc-600'
                  }`}
                ></span>
              </div>

              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                {member.department}
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-zinc-100">{member.name}</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">{member.role}</p>
            </div>

            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-zinc-500" />
                <span className="truncate max-w-[120px]">{member.email}</span>
              </span>
              <span className="text-indigo-400 font-semibold">{member.tasksAssigned} tasks</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Stream */}
      <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          Real-Time Audit & Activity Log
        </h3>

        <div className="space-y-3">
          {activities.map((act) => (
            <div key={act.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
              <div className="flex items-center gap-3">
                <img src={act.avatar} alt={act.user} className="w-6 h-6 rounded-full object-cover" />
                <div>
                  <span className="font-semibold text-zinc-200">{act.user}</span>{' '}
                  <span className="text-zinc-400">{act.action}</span>{' '}
                  <span className="text-indigo-300 font-medium">{act.target}</span>
                </div>
              </div>
              <span className="text-[10px] text-zinc-500">{act.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-zinc-100">Invite New Team Member</h3>
            <form onSubmit={handleAddMember} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-zinc-400">FULL NAME</label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Jordan Miller"
                  className="w-full mt-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400">EMAIL ADDRESS</label>
                <input
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="jordan.m@nexus.io"
                  className="w-full mt-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400">ROLE</label>
                <input
                  type="text"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-500"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
