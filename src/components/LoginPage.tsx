import React, { useState } from 'react';
import { UserRole, UserSession } from '../types';
import { Shield, Briefcase, Factory, Lock, Mail, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('procurement');
  const [email, setEmail] = useState('lead@chainsight.io');
  const [password, setPassword] = useState('supply123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg(null);
    if (role === 'procurement') {
      setEmail('lead@chainsight.io');
      setPassword('supply123');
    } else if (role === 'admin') {
      setEmail('admin@chainsight.io');
      setPassword('admin123');
    } else {
      setEmail('partner@acme.io');
      setPassword('partner123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.access_token) {
        if (data.role !== selectedRole) {
          setErrorMsg(`This account belongs to role: ${data.role.toUpperCase()}. Please select the correct tab.`);
          setLoading(false);
          return;
        }

        const session: UserSession = {
          email: data.email || email,
          name: data.name,
          title: data.title,
          role: data.role,
          avatar: data.avatar,
          token: data.access_token,
        };
        onLoginSuccess(session);
      } else {
        setErrorMsg(data.error || 'Invalid credentials. Please verify email and password.');
      }
    } catch (err) {
      // Local fallback for robust demo performance
      if (email === 'lead@chainsight.io' && selectedRole === 'procurement') {
        onLoginSuccess({
          email,
          name: 'Alex M.',
          title: 'Procurement Lead',
          role: 'procurement',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
          token: 'demo_token_procurement',
        });
      } else if (email === 'admin@chainsight.io' && selectedRole === 'admin') {
        onLoginSuccess({
          email,
          name: 'Sarah K.',
          title: 'Platform Administrator',
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
          token: 'demo_token_admin',
        });
      } else if (email === 'partner@acme.io' && selectedRole === 'supplier') {
        onLoginSuccess({
          email,
          name: 'Ravi D.',
          title: 'Partner: ACME Electronics',
          role: 'supplier',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
          token: 'demo_token_supplier',
        });
      } else {
        setErrorMsg('Authentication failed. Please use demo account presets.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,240,255,0.08),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(176,38,255,0.08),transparent_40%)] pointer-events-none" />

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl relative z-10">
        
        {/* Left Branding Column */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-950/60 via-zinc-900 to-zinc-950 p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-zinc-800">
          <div>
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-zinc-100 tracking-tight">ChainSight</h1>
                <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">
                  Enterprise Edition
                </span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-zinc-100 leading-snug mb-3">
              Predictive Supply Chain & POS Intelligence
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              Synthesizing 340+ live data streams, POS store sales telemetry, and AI scenario simulation to prevent disruptions 30 days before impact.
            </p>

            <div className="space-y-3 border-t border-zinc-800/80 pt-6">
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Real-Time Point of Sale (POS) Telemetry</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>30-Day Disruption Lead-Time Advantage</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Gemini 3.6 AI Scenario Playbooks</span>
              </div>
            </div>
          </div>

          <div className="pt-8 text-[11px] text-zinc-500 border-t border-zinc-800/80 mt-6">
            Build with AI Solution Challenge • Open Innovation Platform
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-8 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-zinc-100">Welcome Back</h3>
            <p className="text-xs text-zinc-400">Select your workspace role to sign in:</p>
          </div>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-3 gap-2 mb-6 p-1 bg-zinc-950 border border-zinc-800 rounded-xl">
            <button
              type="button"
              onClick={() => handleRoleSelect('procurement')}
              className={`p-2.5 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                selectedRole === 'procurement'
                  ? 'bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Procurement</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={`p-2.5 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                selectedRole === 'admin'
                  ? 'bg-rose-500/10 border border-rose-500/40 text-rose-300 shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('supplier')}
              className={`p-2.5 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                selectedRole === 'supplier'
                  ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Factory className="w-4 h-4" />
              <span>Supplier</span>
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-400 font-medium mb-1 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-zinc-100 focus:outline-none focus:border-cyan-500 transition-all font-mono"
                  placeholder="name@chainsight.io"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-zinc-100 focus:outline-none focus:border-cyan-500 transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-zinc-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Authenticating Session...' : `Sign In as ${selectedRole.toUpperCase()}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Preset Helper Card */}
          <div className="mt-6 p-3.5 bg-zinc-950/80 border border-zinc-800/80 rounded-xl text-[11px] text-zinc-400 space-y-1">
            <span className="font-bold text-zinc-200 block mb-1">Demo Quick Preset:</span>
            <div><strong className="text-cyan-400">Procurement:</strong> lead@chainsight.io / supply123</div>
            <div><strong className="text-rose-400">Admin:</strong> admin@chainsight.io / admin123</div>
            <div><strong className="text-emerald-400">Supplier:</strong> partner@acme.io / partner123</div>
          </div>
        </div>

      </div>
    </div>
  );
};
