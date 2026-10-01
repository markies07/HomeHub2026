'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserProfile, UserRole } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { 
  UserPlus, Search, ShieldCheck, Lock, Home, Mail, 
  Phone, KeyRound, Trash2, Edit, Check 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AccountsManagementPage() {
  const { allDemoUsers } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>(allDemoUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('admin');
  const [formHouseNo, setFormHouseNo] = useState<number | null>(null);

  const filtered = users.filter(u => {
    const matchesSearch = 
      u.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.includes(searchQuery);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      uid: `uid-${Date.now()}`,
      fullname: formName,
      email: formEmail,
      role: formRole,
      assignedHouseNo: formRole === 'tenant' ? formHouseNo : null,
      createdAt: new Date().toISOString(),
      avatarUrl: formRole === 'tenant' ? '/icons/tenant.png' : '/icons/owner.png'
    };
    setUsers(prev => [newUser, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (confirm(`Remove access for ${name}?`)) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Account Access &amp; Roles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage system administrators, property managers, and resident portal credentials.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setFormName('');
            setFormEmail('');
            setFormRole('admin');
            setFormHouseNo(null);
            setIsAddModalOpen(true);
          }}
          leftIcon={<UserPlus className="w-4 h-4" />}
          className="shadow-sm"
        >
          Create User Account
        </Button>
      </div>

      {/* Filter toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search accounts by name, email, or role..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* Role Filter Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Roles' },
            { id: 'super_admin', label: 'Owners' },
            { id: 'admin', label: 'Staff' },
            { id: 'tenant', label: 'Tenants' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`relative px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer whitespace-nowrap ${
                roleFilter === tab.id
                  ? 'text-emerald-800'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {roleFilter === tab.id && (
                <motion.div
                  layoutId="accountsRolePill"
                  className="absolute inset-0 bg-white rounded-lg shadow-xs"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200 bg-slate-50/80">
              <tr>
                <th className="py-3.5 px-6">User Profile</th>
                <th className="py-3.5 px-6">System Role</th>
                <th className="py-3.5 px-6">Assigned Unit</th>
                <th className="py-3.5 px-6">Created On</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center p-1.5 shrink-0 shadow-xs">
                        <img 
                          src={u.role === 'tenant' ? '/icons/tenant.png' : '/icons/owner.png'} 
                          alt="" 
                          className="w-full h-full object-contain" 
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{u.fullname}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize border ${
                      u.role === 'super_admin'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : u.role === 'admin'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {u.role === 'super_admin' ? <ShieldCheck className="w-3.5 h-3.5" /> : u.role === 'admin' ? <Lock className="w-3.5 h-3.5" /> : <Home className="w-3.5 h-3.5" />}
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-900">
                    {u.assignedHouseNo ? (
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                        Unit {u.assignedHouseNo}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-normal">—</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDeleteUser(u.id, u.fullname)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-slate-200 cursor-pointer"
                      title="Remove Account"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD USER MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New System Account"
        subtitle="Set user role and access permissions"
        maxWidth="md"
      >
        <form onSubmit={handleAddUser} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
            <input
              type="text"
              required
              value={formName}
              onChange={e => setFormName(e.target.value)}
              placeholder="e.g. Maria Santos"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address / Username</label>
            <input
              type="email"
              required
              value={formEmail}
              onChange={e => setFormEmail(e.target.value)}
              placeholder="user@homehub.com"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Role</label>
            <select
              value={formRole}
              onChange={e => setFormRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="super_admin">Super Admin (Full Access)</option>
              <option value="admin">Property Manager / Staff</option>
              <option value="tenant">Tenant Resident</option>
            </select>
          </div>

          {formRole === 'tenant' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Assigned Unit #</label>
              <input
                type="number"
                required
                value={formHouseNo || ''}
                onChange={e => setFormHouseNo(Number(e.target.value))}
                placeholder="e.g. 101"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          <div className="pt-3 flex gap-3">
            <Button type="submit" variant="primary" className="flex-1 py-2.5">
              Create Account
            </Button>
            <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
