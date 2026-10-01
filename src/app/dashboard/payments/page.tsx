'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '@/context/DataContext';
import { PaymentTransaction, PaymentMethod } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { 
  Plus, Search, Receipt, CreditCard, Printer, Trash2, 
  Filter, CheckCircle2, Building2, Calendar, User,
  Sparkles, Download, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PaymentsManagementPage() {
  const { payments, properties, tenants, addPayment, deletePayment } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMop, setSelectedMop] = useState<string>('all');
  
  // Modals
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<PaymentTransaction | null>(null);

  // Form states
  const activeTenants = tenants.filter(t => t.status === 'active');
  const [formHouseNo, setFormHouseNo] = useState<number>(activeTenants[0]?.house_no || 101);
  const [formTenantName, setFormTenantName] = useState(activeTenants[0]?.fullname || '');
  const [formMop, setFormMop] = useState<PaymentMethod>('GCash');
  const [formAmount, setFormAmount] = useState<number>(28500);
  const [formBillingMonth, setFormBillingMonth] = useState('October 2026');
  const [formNotes, setFormNotes] = useState('Monthly rental payment');

  const filtered = payments.filter(p => {
    const matchesSearch = 
      p.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.house_no.toString().includes(searchQuery);
    const matchesMop = selectedMop === 'all' || p.MOP === selectedMop;
    return matchesSearch && matchesMop;
  });

  const handleOpenRecord = () => {
    if (activeTenants.length > 0) {
      const first = activeTenants[0];
      setFormHouseNo(first.house_no);
      setFormTenantName(first.fullname);
      const prop = properties.find(p => p.house_no === first.house_no);
      if (prop) setFormAmount(prop.rent);
    }
    setFormMop('GCash');
    setFormBillingMonth('October 2026');
    setFormNotes('Regular monthly rent payment');
    setIsRecordModalOpen(true);
  };

  const handleUnitSelectChange = (hNo: number) => {
    setFormHouseNo(hNo);
    const targetTenant = tenants.find(t => t.house_no === hNo && t.status === 'active');
    if (targetTenant) {
      setFormTenantName(targetTenant.fullname);
    }
    const targetProp = properties.find(p => p.house_no === hNo);
    if (targetProp) {
      setFormAmount(targetProp.rent);
    }
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    addPayment({
      house_no: Number(formHouseNo),
      fullname: formTenantName,
      MOP: formMop,
      amount: Number(formAmount),
      datePaid: new Date().toISOString(),
      billingMonth: formBillingMonth,
      notes: formNotes,
      recordedBy: 'Super Admin'
    });
    setIsRecordModalOpen(false);

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleOpenReceipt = (payment: PaymentTransaction) => {
    setActiveReceipt(payment);
    setIsReceiptModalOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Transactions &amp; Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete records of all rent collections, modes of payment, and digital receipts.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenRecord}
          leftIcon={<Plus className="w-4 h-4" />}
          className="shadow-sm"
        >
          Record Payment
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
            placeholder="Search by receipt #, tenant, or unit #..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* MOP Filter tabs with animated pill */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          {(['all', 'GCash', 'Maya', 'Bank Transfer', 'Cash'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedMop(tab)}
              className={`relative px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap capitalize transition-colors cursor-pointer ${
                selectedMop === tab
                  ? 'text-emerald-800'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {selectedMop === tab && (
                <motion.div
                  layoutId="paymentMopPill"
                  className="absolute inset-0 bg-white rounded-lg shadow-xs"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10">{tab === 'all' ? 'All Methods' : tab}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200 bg-slate-50/80">
              <tr>
                <th className="py-3.5 px-6">Receipt #</th>
                <th className="py-3.5 px-6">Unit #</th>
                <th className="py-3.5 px-6">Tenant Name</th>
                <th className="py-3.5 px-6">Payment Mode</th>
                <th className="py-3.5 px-6">Billing Period</th>
                <th className="py-3.5 px-6">Amount</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6 font-mono text-xs font-bold text-emerald-700">{p.receiptNumber}</td>
                  <td className="py-4 px-6 font-bold text-slate-900">
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-black text-xs border border-emerald-200/60">
                      Unit {p.house_no}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200/80 p-0.5 flex items-center justify-center shrink-0">
                        <img src="/icons/tenant.png" alt="" className="w-full h-full object-contain" />
                      </div>
                      <span>{p.fullname}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700">
                      {p.MOP}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-500">
                    {p.billingMonth || new Date(p.datePaid).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-4 px-6 font-black text-slate-900">
                    ₱{p.amount.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleOpenReceipt(p)}
                        leftIcon={<Receipt className="w-3.5 h-3.5" />}
                        className="text-xs font-semibold"
                      >
                        Receipt
                      </Button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete transaction ${p.receiptNumber}?`)) {
                            deletePayment(p.id);
                          }
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-slate-200 cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD PAYMENT MODAL */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="Record New Rent Payment"
        subtitle="Log transaction into HomeHub ledger and issue digital receipt"
        maxWidth="md"
      >
        <form onSubmit={handleSavePayment} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Unit Number</label>
              <select
                value={formHouseNo}
                onChange={e => handleUnitSelectChange(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {activeTenants.map(t => (
                  <option key={t.id} value={t.house_no}>
                    Unit {t.house_no} ({t.fullname})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tenant Name</label>
              <input
                type="text"
                required
                value={formTenantName}
                onChange={e => setFormTenantName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mode of Payment (MOP)</label>
              <select
                value={formMop}
                onChange={e => setFormMop(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="GCash">GCash</option>
                <option value="Maya">Maya</option>
                <option value="Bank Transfer">Bank Transfer (BDO/BPI)</option>
                <option value="Cash">Cash on Hand</option>
                <option value="*deposit">Security Deposit Deduction</option>
                <option value="*adjust">Credit Adjustment</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Amount (₱)</label>
              <input
                type="number"
                required
                value={formAmount}
                onChange={e => setFormAmount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Billing Month / Coverage</label>
            <input
              type="text"
              required
              value={formBillingMonth}
              onChange={e => setFormBillingMonth(e.target.value)}
              placeholder="e.g. October 2026"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Notes / Reference ID</label>
            <input
              type="text"
              value={formNotes}
              onChange={e => setFormNotes(e.target.value)}
              placeholder="e.g. GCash Ref #981240182"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-3 flex gap-3">
            <Button type="submit" variant="primary" className="flex-1 py-2.5">
              Confirm &amp; Issue Receipt
            </Button>
            <Button type="button" variant="ghost" onClick={() => setIsRecordModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* OFFICIAL RECEIPT MODAL */}
      <Modal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        maxWidth="md"
      >
        {activeReceipt && (
          <div className="space-y-6 text-slate-900 p-2">
            {/* Printable Receipt Container */}
            <div id="printable-receipt" className="border-2 border-dashed border-emerald-500/40 p-6 rounded-2xl bg-white space-y-6 shadow-sm">
              
              {/* Header */}
              <div className="text-center pb-4 border-b border-slate-200">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    H
                  </div>
                  <span className="text-xl font-black tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Home<span className="text-emerald-600">Hub</span> Residences
                  </span>
                </div>
                <p className="text-xs text-slate-500">Official Electronic Rental Receipt</p>
                <p className="text-xs font-mono text-emerald-700 font-bold mt-1">
                  {activeReceipt.receiptNumber}
                </p>
              </div>

              {/* Receipt Details */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Date Issued:</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(activeReceipt.datePaid).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Unit Number:</span>
                  <span className="font-bold text-slate-900">Unit {activeReceipt.house_no}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Received From:</span>
                  <span className="font-bold text-slate-900">{activeReceipt.fullname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Mode:</span>
                  <span className="font-semibold text-slate-800">{activeReceipt.MOP}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Billing Coverage:</span>
                  <span className="font-semibold text-slate-800">{activeReceipt.billingMonth || 'Standard Rental'}</span>
                </div>
                {activeReceipt.notes && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Notes / Ref:</span>
                    <span className="font-mono text-slate-700">{activeReceipt.notes}</span>
                  </div>
                )}
              </div>

              {/* Amount Total */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase text-emerald-800">Total Amount Paid</p>
                  <p className="text-2xl font-black text-emerald-700">
                    ₱{activeReceipt.amount.toLocaleString()}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              {/* Verification watermark */}
              <div className="text-center pt-2 text-[10px] text-slate-400">
                Authorized Electronic Receipt • Verified by HomeHub Property Management
              </div>

            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={handlePrint}
                leftIcon={<Printer className="w-4 h-4" />}
                className="flex-1 py-3"
              >
                Print / Save PDF Receipt
              </Button>
              <Button variant="ghost" onClick={() => setIsReceiptModalOpen(false)}>
                Close
              </Button>
            </div>

          </div>
        )}
      </Modal>

    </div>
  );
}
