'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/context/AuthContext';
import { Lock, User, ShieldCheck, KeyRound, ArrowRight, Home, Sparkles, Zap, Crown, Building } from 'lucide-react';
import { UserRole } from '@/types';
import { useRouter } from 'next/navigation';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const quickAccessRoles = [
  {
    id: 'super_admin' as UserRole,
    label: 'Owner',
    sublabel: 'Full property control',
    icon: <Crown className="w-4 h-4" />,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    houseNo: undefined,
  },
  {
    id: 'admin' as UserRole,
    label: 'Staff Admin',
    sublabel: 'Manage tenants & units',
    icon: <Building className="w-4 h-4" />,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    houseNo: undefined,
  },
  {
    id: 'tenant' as UserRole,
    label: 'Tenant',
    sublabel: 'Unit 101 resident portal',
    icon: <Home className="w-4 h-4" />,
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    houseNo: 101,
  },
];

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { loginAs } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('super_admin');
  const [isLoading, setIsLoading] = useState(false);

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      loginAs(role);
      setIsLoading(false);
      onClose();
      if (role === 'super_admin') router.push('/dashboard');
      else if (role === 'admin') router.push('/dashboard/tenants');
      else router.push('/tenant-portal');
    }, 400);
  };

  const handleQuickLogin = (targetRole: UserRole, houseNo?: number) => {
    loginAs(targetRole, houseNo);
    onClose();
    if (targetRole === 'super_admin') router.push('/dashboard');
    else if (targetRole === 'admin') router.push('/dashboard/tenants');
    else router.push('/tenant-portal');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Welcome to HomeHub"
      subtitle="Sign in to access your property management portal"
      maxWidth="md"
    >
      <div className="pt-2 space-y-5 text-slate-800">
        
        {/* 1-Click Demo */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-emerald-600" />
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              1-Click Demo Quick Access
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {quickAccessRoles.map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => handleQuickLogin(r.id, r.houseNo)}
                className="p-3 rounded-xl text-left bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 border ${r.color}`}>
                  {r.icon}
                </div>
                <p className="text-xs font-bold text-slate-900 leading-tight">{r.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{r.sublabel}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs font-semibold text-slate-400">Or sign in with credentials</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleCustomLogin} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Username / Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="e.g. owner@homehub.com"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Account Role
            </label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="super_admin">Super Admin (Owner)</option>
              <option value="admin">Admin (Property Staff)</option>
              <option value="tenant">Tenant (Resident)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold text-white cursor-pointer transition-all hover:brightness-105 disabled:opacity-50 mt-2 shadow-sm"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            }}
          >
            {isLoading ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <>
                Sign In to HomeHub
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </Modal>
  );
}
