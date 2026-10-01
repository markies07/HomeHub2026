'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '@/context/DataContext';
import { Tenant } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { 
  UserPlus, Search, Users, Phone, Mail, Calendar, 
  ShieldAlert, Edit, UserMinus, CheckCircle2, 
  AlertCircle, MessageSquare, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function TenantsManagementPage() {
  const { tenants, properties, addTenant, updateTenant, terminateTenant } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'terminated'>('active');
  
  // Modals
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  // Form states
  const availableUnits = properties.filter(p => p.status === 'available');
  const [formHouseNo, setFormHouseNo] = useState<number>(availableUnits[0]?.house_no || 102);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formOccupants, setFormOccupants] = useState(2);
  const [formDeposit, setFormDeposit] = useState(36000);
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [formEmergencyName, setFormEmergencyName] = useState('');
  const [formEmergencyPhone, setFormEmergencyPhone] = useState('');

  const filtered = tenants.filter(t => {
    const matchesSearch = 
      t.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.house_no.toString().includes(searchQuery) ||
      t.contact.includes(searchQuery);
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenOnboard = () => {
    const firstAvailable = properties.find(p => p.status === 'available');
    if (firstAvailable) {
      setFormHouseNo(firstAvailable.house_no);
      setFormDeposit(firstAvailable.rent * 2);
    }
    setFormName('');
    setFormEmail('');
    setFormPhone('+63 9');
    setFormOccupants(2);
    setFormEmergencyName('');
    setFormEmergencyPhone('');
    setIsOnboardModalOpen(true);
  };

  const handleOpenEdit = (t: Tenant) => {
    setSelectedTenant(t);
    setFormHouseNo(t.house_no);
    setFormName(t.fullname);
    setFormEmail(t.email);
    setFormPhone(t.contact);
    setFormOccupants(t.occupants);
    setFormDeposit(t.deposit);
    setFormStartDate(t.startDate.split('T')[0]);
    setFormEmergencyName(t.emergencyContactName || '');
    setFormEmergencyPhone(t.emergencyContactPhone || '');
    setIsEditModalOpen(true);
  };

  const handleSaveOnboard = (e: React.FormEvent) => {
    e.preventDefault();
    addTenant({
      house_no: Number(formHouseNo),
      fullname: formName,
      email: formEmail,
      contact: formPhone,
      occupants: Number(formOccupants),
      deposit: Number(formDeposit),
      startDate: new Date(formStartDate).toISOString(),
      emergencyContactName: formEmergencyName,
      emergencyContactPhone: formEmergencyPhone,
      avatarUrl: '/icons/tenant.png'
    });
    setIsOnboardModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenant) return;
    updateTenant(selectedTenant.id, {
      fullname: formName,
      email: formEmail,
      contact: formPhone,
      occupants: Number(formOccupants),
      deposit: Number(formDeposit),
      emergencyContactName: formEmergencyName,
      emergencyContactPhone: formEmergencyPhone
    });
    setIsEditModalOpen(false);
  };

  const handleTerminate = (tenant: Tenant) => {
    if (confirm(`Are you sure you want to terminate lease for ${tenant.fullname} (Unit ${tenant.house_no})? This will archive their lease and mark Unit ${tenant.house_no} as available.`)) {
      terminateTenant(tenant.id);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Tenants Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage active leases, security deposits, occupants, and resident profiles.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenOnboard}
          leftIcon={<UserPlus className="w-4 h-4" />}
          className="shadow-sm"
        >
          Onboard New Tenant
        </Button>
      </div>

      {/* Filter toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by tenant name, email, phone or unit #..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* Status filter tabs with animated pill */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          {(['active', 'terminated', 'all'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`relative px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer whitespace-nowrap ${
                filterStatus === tab
                  ? 'text-emerald-800'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {filterStatus === tab && (
                <motion.div
                  layoutId="tenantStatusPill"
                  className="absolute inset-0 bg-white rounded-lg shadow-xs"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10">{tab === 'all' ? 'All Records' : tab}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tenants Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200 bg-slate-50/80">
              <tr>
                <th className="py-3.5 px-6">Tenant Profile</th>
                <th className="py-3.5 px-6">Unit #</th>
                <th className="py-3.5 px-6">Occupants</th>
                <th className="py-3.5 px-6">Deposit</th>
                <th className="py-3.5 px-6">Payment Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center p-1.5 shrink-0 shadow-xs">
                        <img src="/icons/tenant.png" alt="" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{t.fullname}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{t.email} • {t.contact}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-black text-slate-900">
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-black text-xs border border-emerald-200/60">
                      Unit {t.house_no}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-semibold">{t.occupants} persons</td>
                  <td className="py-4 px-6 font-black text-slate-900">₱{t.deposit.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    {t.status === 'terminated' ? (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        Terminated
                      </span>
                    ) : t.balance > 0 ? (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                        Due: ₱{t.balance.toLocaleString()}
                      </span>
                    ) : t.credits > 0 ? (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                        Advance: ₱{t.credits.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ● Up to Date
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link href="/dashboard/chat">
                        <button
                          title="Message Tenant"
                          className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors border border-slate-200 cursor-pointer"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleOpenEdit(t)}
                        title="Edit Details"
                        className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {t.status === 'active' && (
                        <button
                          onClick={() => handleTerminate(t)}
                          title="Terminate Lease"
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-slate-200 cursor-pointer"
                        >
                          <UserMinus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ONBOARD MODAL */}
      <Modal
        isOpen={isOnboardModalOpen}
        onClose={() => setIsOnboardModalOpen(false)}
        title="Onboard New Resident"
        subtitle="Assign an available unit and register lease terms"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveOnboard} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Assign to Unit</label>
            <select
              value={formHouseNo}
              onChange={e => {
                const hNo = Number(e.target.value);
                setFormHouseNo(hNo);
                const p = properties.find(prop => prop.house_no === hNo);
                if (p) setFormDeposit(p.rent * 2);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {availableUnits.length > 0 ? (
                availableUnits.map(p => (
                  <option key={p.id} value={p.house_no}>
                    Unit {p.house_no} - {p.title} (₱{p.rent.toLocaleString()}/mo)
                  </option>
                ))
              ) : (
                <option value={formHouseNo}>Unit {formHouseNo} (All units occupied)</option>
              )}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={formName}
                onChange={e => setFormName(e.target.value)}
                placeholder="e.g. Juan dela Cruz"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formEmail}
                onChange={e => setFormEmail(e.target.value)}
                placeholder="juan@email.com"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Number</label>
              <input
                type="tel"
                required
                value={formPhone}
                onChange={e => setFormPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Total Occupants</label>
              <input
                type="number"
                min="1"
                required
                value={formOccupants}
                onChange={e => setFormOccupants(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Security Deposit (₱)</label>
              <input
                type="number"
                required
                value={formDeposit}
                onChange={e => setFormDeposit(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Lease Start Date</label>
              <input
                type="date"
                required
                value={formStartDate}
                onChange={e => setFormStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Emergency Contact Person</label>
              <input
                type="text"
                value={formEmergencyName}
                onChange={e => setFormEmergencyName(e.target.value)}
                placeholder="Parent / Spouse"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Emergency Phone</label>
              <input
                type="tel"
                value={formEmergencyPhone}
                onChange={e => setFormEmergencyPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="pt-3 flex gap-3">
            <Button type="submit" variant="primary" className="flex-1 py-2.5">
              Confirm &amp; Onboard Tenant
            </Button>
            <Button type="button" variant="ghost" onClick={() => setIsOnboardModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Tenant Details"
        subtitle={`Editing profile for ${selectedTenant?.fullname} (Unit ${selectedTenant?.house_no})`}
        maxWidth="md"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
            <input
              type="text"
              required
              value={formName}
              onChange={e => setFormName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={formEmail}
                onChange={e => setFormEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone</label>
              <input
                type="tel"
                required
                value={formPhone}
                onChange={e => setFormPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Occupants</label>
              <input
                type="number"
                min="1"
                required
                value={formOccupants}
                onChange={e => setFormOccupants(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Deposit (₱)</label>
              <input
                type="number"
                required
                value={formDeposit}
                onChange={e => setFormDeposit(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="pt-3 flex gap-3">
            <Button type="submit" variant="primary" className="flex-1 py-2.5">
              Update Profile
            </Button>
            <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
