'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { 
  Home, CreditCard, MessageSquare, FileText, Receipt, 
  Send, CheckCircle2, AlertCircle, Building2, 
  MapPin, Bed, Bath, Layers, Clock, Printer, Sparkles,
  Phone, User, ArrowLeft, CheckCheck, Menu, X, LogOut,
  Calendar, Check, Search, Download, ShieldCheck
} from 'lucide-react';
import { PaymentTransaction, PaymentMethod } from '@/types';
import confetti from 'canvas-confetti';

export default function TenantPortalPage() {
  const { user, logout } = useAuth();
  const { properties, tenants, payments, getMessagesForChat, sendMessage, markChatAsRead, addPayment } = useData();

  // Find active tenant & property (defaulting to Unit 101 Alexander Cruz)
  const tenantHouseNo = user?.assignedHouseNo || 101;
  const currentTenant = tenants.find(t => t.house_no === tenantHouseNo && t.status === 'active') || tenants[0];
  const currentProperty = properties.find(p => p.house_no === tenantHouseNo) || properties[0];

  const tenantPayments = payments.filter(p => p.house_no === tenantHouseNo);
  const chatId = `chat-${tenantHouseNo}`;
  const messages = getMessagesForChat(chatId);

  // Authenticate HomeHub 3-section flow: 'dashboard' (tenant.php), 'info' (info.php), 'chat' (chat.php)
  const [activeSection, setActiveSection] = useState<'dashboard' | 'info' | 'chat'>('dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Chat message state
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Modals
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<PaymentTransaction | null>(null);

  // Payment form states
  const [payMop, setPayMop] = useState<PaymentMethod>('GCash');
  const [payAmount, setPayAmount] = useState(currentProperty?.rent || 28500);
  const [payNotes, setPayNotes] = useState('');
  const [historyFilter, setHistoryFilter] = useState('');

  // Calculate dynamic months of staying (exact logic from old HomeHub's tenant.php: $dateNow->diff($datePass))
  const calculateMonthsStaying = (startDateStr: string) => {
    if (!startDateStr) return 1;
    const start = new Date(startDateStr);
    const now = new Date();
    const diffMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    return Math.max(diffMonths, 1);
  };

  const monthsOfStaying = currentTenant ? calculateMonthsStaying(currentTenant.startDate) : 1;
  const isPaid = (currentTenant?.balance || 0) === 0;

  useEffect(() => {
    markChatAsRead(chatId, 'tenant');
  }, [chatId]);

  useEffect(() => {
    if (activeSection === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, activeSection]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(
      chatId,
      tenantHouseNo,
      user?.uid || 'tenant-1',
      currentTenant?.fullname || 'Resident',
      'tenant',
      inputText.trim()
    );

    setInputText('');
  };

  const handleConfirmPay = (e: React.FormEvent) => {
    e.preventDefault();
    addPayment({
      house_no: tenantHouseNo,
      fullname: currentTenant?.fullname || 'Resident',
      MOP: payMop,
      amount: Number(payAmount),
      datePaid: new Date().toISOString(),
      billingMonth: 'Current Rent',
      notes: `Online payment via ${payMop} • ${payNotes}`,
      recordedBy: 'Tenant Portal (Online)'
    });
    setIsPayModalOpen(false);

    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const filteredPayments = tenantPayments.filter(p => 
    p.receiptNumber.toLowerCase().includes(historyFilter.toLowerCase()) ||
    p.MOP.toLowerCase().includes(historyFilter.toLowerCase()) ||
    new Date(p.datePaid).toLocaleDateString().includes(historyFilter)
  );

  return (
    <div className="flex min-h-screen relative" style={{ background: '#f8fafc', color: '#0f172a' }}>

      {/* ===== TOP GLOWING TAB-LOAD PROGRESS BAR ===== */}
      <div className="h-0.5 w-full bg-transparent overflow-hidden fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <motion.div
          key={activeSection}
          initial={{ x: '-100%', opacity: 1 }}
          animate={{ x: '0%', opacity: [1, 1, 0] }}
          transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1], times: [0, 0.8, 1] }}
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.9)]"
        />
      </div>

      {/* ===== AUTHENTIC HOMEHUB TENANT SIDEBAR ===== */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen z-40" style={{
        width: '260px',
        background: '#ffffff',
        borderRight: '1px solid #e8edf3',
        boxShadow: '1px 0 10px rgba(0,0,0,0.02)'
      }}>
        {/* Title Left / Brand Header */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-100">
          <img src="/img/homehub-icon.png" alt="HomeHub" className="w-8 h-8 object-contain shrink-0" />
          <div>
            <span className="text-base font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Home<span className="text-emerald-600">Hub</span>
            </span>
            <p className="text-[10px] font-semibold text-slate-400 -mt-0.5">Tenant Portal</p>
          </div>
        </div>

        {/* Resident Unit Badge */}
        <div className="px-4 py-3 bg-emerald-50/70 border-b border-emerald-100/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-900">Unit {tenantHouseNo} Resident</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-emerald-700 border border-emerald-200">
            Active
          </span>
        </div>

        {/* 3 Authentic Navigation Links (tenant.php, info.php, chat.php) with animated gliding pill */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Resident Menu</p>
          
          {[
            { id: 'dashboard' as const, label: 'Tenant Dashboard', icon: <Home className="w-4 h-4 shrink-0" /> },
            { id: 'info' as const, label: 'Tenant Information', icon: <User className="w-4 h-4 shrink-0" /> },
            { id: 'chat' as const, label: 'Message Inbox', icon: <MessageSquare className="w-4 h-4 shrink-0" /> },
          ].map(tab => {
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  isActive ? 'text-white font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="tenantActiveNavPill"
                    className="absolute inset-0 bg-emerald-600 rounded-xl shadow-sm"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{tab.icon}</span>
                <span className="relative z-10 flex-1 text-left">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Sidebar: Resident Profile & Switch Option */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center p-1 border border-emerald-200 shrink-0">
              <img src="/icons/tenant.png" alt="Tenant" className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{currentTenant?.fullname || 'Alexander Cruz'}</p>
              <p className="text-[10px] text-slate-400">Unit {tenantHouseNo}</p>
            </div>
            <button 
              onClick={() => logout()}
              title="Sign Out" 
              className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          <Link 
            href="/dashboard" 
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Switch to Owner Portal</span>
          </Link>
        </div>
      </aside>

      {/* ===== MOBILE TOP BAR ===== */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white flex items-center justify-between px-4 h-14 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <img src="/img/homehub-icon.png" alt="HomeHub" className="w-7 h-7 object-contain shrink-0" />
          <span className="font-black text-slate-900 text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>HomeHub</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Resident</span>
        </div>
        <button onClick={() => setIsMobileNavOpen(!isMobileNavOpen)} className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer">
          {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 pt-14 bg-slate-900/40 backdrop-blur-xs" 
            onClick={() => setIsMobileNavOpen(false)}
          >
            <motion.div 
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="w-64 h-full bg-white shadow-2xl p-4 space-y-3" 
              onClick={e => e.stopPropagation()}
            >
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Resident Menu</p>
              <button
                onClick={() => { setActiveSection('dashboard'); setIsMobileNavOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${activeSection === 'dashboard' ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <Home className="w-4 h-4" />
                <span>Tenant Dashboard</span>
              </button>
              <button
                onClick={() => { setActiveSection('info'); setIsMobileNavOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${activeSection === 'info' ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <User className="w-4 h-4" />
                <span>Tenant Information</span>
              </button>
              <button
                onClick={() => { setActiveSection('chat'); setIsMobileNavOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${activeSection === 'chat' ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message Inbox</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== MAIN CONTENT CONTAINER ===== */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[260px] pt-14 lg:pt-0">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md h-16 px-6 sm:px-8 flex items-center justify-between border-b border-slate-200/80">
          <div className="flex items-center gap-2 text-sm overflow-hidden h-6">
            <span className="text-slate-400 font-medium text-xs">Resident</span>
            <span className="text-slate-300">/</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={activeSection}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.18 }}
                className="font-bold text-slate-800 text-sm"
              >
                {activeSection === 'dashboard' ? 'Tenant Dashboard' : activeSection === 'info' ? 'Tenant Information' : 'Message Inbox'}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsPayModalOpen(true)}
              leftIcon={<CreditCard className="w-4 h-4" />}
              className="shadow-xs font-bold text-xs"
            >
              Pay Rent Online
            </Button>
            
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-xs">
                {currentTenant?.fullname?.charAt(0) || 'A'}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">{currentTenant?.fullname?.split(' ')[0] || 'Alexander'}</p>
                <p className="text-[10px] text-slate-400 font-medium">House {tenantHouseNo}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-6 sm:p-8 w-full overflow-hidden">
          <AnimatePresence mode="wait">
            
            {/* ========================================================= */}
            {/* 1. TENANT DASHBOARD (Authentic flow from tenant.php)      */}
            {/* ========================================================= */}
            {activeSection === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 12, filter: 'blur(3px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -8, filter: 'blur(2px)' }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-8 max-w-6xl w-full"
              >
                
                {/* Header Title */}
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    House {tenantHouseNo}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Resident overview for {currentTenant?.fullname} • {currentProperty?.fulladdress}
                  </p>
                </div>

                {/* The 3 Iconic Cards (Exact structure of tenant.php: Months of Staying, Monthly Rent, Status) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Card 1: Months of Staying */}
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.05 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all"
                  >
                    <div className="p-6 relative">
                      <h2 className="text-5xl font-black text-slate-900 tracking-tight">
                        {monthsOfStaying}
                      </h2>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-2">
                        Months of Staying
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Since {new Date(currentTenant?.startDate || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <div className="absolute top-6 right-6 w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Clock className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="h-2 bg-emerald-600 w-full" />
                  </motion.div>

                  {/* Card 2: Monthly Rent */}
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all"
                  >
                    <div className="p-6 relative">
                      <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                        ₱{currentProperty?.rent.toLocaleString()}
                      </h2>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-2">
                        Monthly Rent
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Standard monthly residential rate
                      </p>
                      <div className="absolute top-6 right-6 w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                        <CreditCard className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="h-2 bg-teal-600 w-full" />
                  </motion.div>

                  {/* Card 3: Status */}
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.15 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all"
                  >
                    <div className="p-6 relative">
                      {isPaid ? (
                        <h2 className="text-5xl font-black text-emerald-600 tracking-tight">
                          PAID
                        </h2>
                      ) : (
                        <h2 className="text-5xl font-black text-rose-600 tracking-tight">
                          UNPAID
                        </h2>
                      )}
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-2">
                        Billing Status
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {isPaid ? 'Account is fully paid and in good standing' : `Balance due: ₱${(currentTenant?.balance || 0).toLocaleString()}`}
                      </p>
                      <div className={`absolute top-6 right-6 w-12 h-12 rounded-xl flex items-center justify-center ${
                        isPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {isPaid ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                      </div>
                    </div>
                    <div className={`h-2 w-full ${isPaid ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                  </motion.div>

                </div>

                {/* Quick Actions & Property Mini-Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-bold">Need to submit rent or message owner?</h3>
                    <p className="text-xs text-emerald-100 mt-1 max-w-xl">
                      Submit digital payments through GCash, Maya, or Bank Transfer, view your signed contract, or send inquiries directly to management.
                    </p>
                  </div>
                  <div className="flex gap-2.5 shrink-0">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsPayModalOpen(true)}
                      className="bg-white text-emerald-800 hover:bg-emerald-50 font-bold"
                    >
                      Pay Rent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveSection('chat')}
                      className="border-white/40 text-white hover:bg-white/10"
                    >
                      Open Inbox
                    </Button>
                  </div>
                </div>

              </motion.div>
            )}

          {/* ========================================================= */}
          {/* 2. TENANT INFORMATION (Authentic flow from info.php)       */}
          {/* ========================================================= */}
          {activeSection === 'info' && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 12, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(2px)' }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6 max-w-6xl w-full"
            >
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    House {tenantHouseNo} Information
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tenant details, lease agreement parameters, and apartment property specifications.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsContractModalOpen(true)}
                    leftIcon={<FileText className="w-4 h-4 text-emerald-600" />}
                    className="bg-white hover:bg-slate-50 font-bold"
                  >
                    View Contract
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsHistoryModalOpen(true)}
                    leftIcon={<Receipt className="w-4 h-4" />}
                    className="shadow-xs font-bold"
                  >
                    Payment History
                  </Button>
                </div>
              </div>

              {/* Layout: Resident Information Card & House Specs */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left: Resident Profile & Balance Details (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Detailed Tenant Parameters (matching info.php fields) */}
                  <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                      <User className="w-4 h-4 text-emerald-600" />
                      <span>Resident Profile &amp; Lease Terms</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 font-medium">Tenant Name:</span>
                        <p className="text-base font-bold text-slate-900 mt-0.5">{currentTenant?.fullname}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 font-medium">Balance Due:</span>
                        <p className={`text-base font-bold mt-0.5 ${currentTenant?.balance ? 'text-rose-600' : 'text-slate-900'}`}>
                          ₱{(currentTenant?.balance || 0).toLocaleString()}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 font-medium">Lease Start Date:</span>
                        <p className="text-sm font-bold text-slate-800 mt-0.5">
                          {new Date(currentTenant?.startDate || '').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 font-medium">Advance Credits:</span>
                        <p className="text-sm font-bold text-emerald-700 mt-0.5">₱{(currentTenant?.credits || 0).toLocaleString()}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 font-medium">Monthly Rent:</span>
                        <p className="text-base font-black text-slate-900 mt-0.5">₱{currentProperty?.rent.toLocaleString()}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 font-medium">Payment Status:</span>
                        <div className="mt-0.5">
                          {isPaid ? (
                            <span className="text-base font-black text-emerald-600">PAID</span>
                          ) : (
                            <span className="text-base font-black text-rose-600">UNPAID</span>
                          )}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 font-medium">Contact Number:</span>
                        <p className="text-sm font-bold text-slate-800 mt-0.5">{currentTenant?.contact}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 font-medium">Registered Occupants:</span>
                        <p className="text-sm font-bold text-slate-800 mt-0.5">{currentTenant?.occupants} people/s</p>
                      </div>
                    </div>
                  </div>

                  {/* House Specs */}
                  <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      <span>Property Specifications</span>
                    </h3>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <Bed className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">Rooms</span>
                        <p className="text-sm font-black text-slate-800">{currentProperty?.noRoom} Room(s)</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <Bath className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">Bathrooms</span>
                        <p className="text-sm font-black text-slate-800">{currentProperty?.noBathroom} Bath(s)</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <Layers className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">Floors</span>
                        <p className="text-sm font-black text-slate-800">{currentProperty?.noFloor} Storey</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                      <p className="font-bold text-slate-700 mb-0.5">Address:</p>
                      <p>{currentProperty?.fulladdress}</p>
                    </div>
                  </div>

                </div>

                {/* Right: Photo Gallery of the House (5 cols) */}
                <div className="lg:col-span-5 space-y-5">
                  <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                      Unit Photo Gallery
                    </h3>

                    <div className="grid grid-cols-2 gap-2.5">
                      {currentProperty?.images.map((img, idx) => (
                        <div key={idx} className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xs">
                          <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment CTA Card */}
                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200/80 space-y-3">
                    <h4 className="text-sm font-bold text-emerald-900">Make a Payment</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Settle your monthly rent easily. Official digital receipts are recorded automatically in your account ledger.
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setIsPayModalOpen(true)}
                      leftIcon={<CreditCard className="w-4 h-4" />}
                      className="w-full shadow-xs font-bold"
                    >
                      Pay Rent Online
                    </Button>
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {/* ========================================================= */}
          {/* 3. MESSAGE INBOX (Authentic flow from chat.php)           */}
          {/* ========================================================= */}
          {activeSection === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 12, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(2px)' }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4 max-w-4xl w-full"
            >
              
              <div className="pb-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Inbox
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct real-time communication channel with Property Owner &amp; Management.
                </p>
              </div>

              {/* Chat Container Box (Authentic chat.php design) */}
              <div className="h-[620px] flex flex-col rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
                
                {/* Chat Top Header: Owner */}
                <div className="px-6 py-4 bg-emerald-600 text-white flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center p-1.5 shadow-xs">
                      <img src="/icons/owner.png" alt="Owner" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base leading-tight">Property Owner</h3>
                      <p className="text-xs text-emerald-100 flex items-center gap-1.5 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        <span>Online · Unit {tenantHouseNo} Direct Support</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/60">
                  {messages.map(msg => {
                    const isMe = msg.senderRole === 'tenant';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-2 mb-1 px-1">
                          <span className="text-[10px] font-semibold text-slate-400">
                            {isMe ? 'You' : 'Property Owner'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div
                          className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            isMe
                              ? 'bg-emerald-600 text-white rounded-tr-xs shadow-xs'
                              : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200/80 shadow-xs'
                          }`}
                        >
                          {msg.text}
                        </div>

                        {isMe && (
                          <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-600 font-semibold px-1">
                            <CheckCheck className="w-3 h-3" />
                            <span>Delivered</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Typing Area (chat.php input form) */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white flex items-center gap-3">
                  <input
                    type="text"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder="Enter Message..."
                    className="flex-1 px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                  <button
                    type="submit"
                    className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs shrink-0"
                    title="Send Message"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </form>

              </div>

            </motion.div>
          )}

          </AnimatePresence>
        </main>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: PAY RENT ONLINE (GCash, Maya, Bank Transfer)     */}
      {/* ========================================================= */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Pay Rent Online"
        subtitle={`House ${tenantHouseNo} • Monthly Rent: ₱${currentProperty?.rent.toLocaleString()}`}
        maxWidth="md"
      >
        <form onSubmit={handleConfirmPay} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Mode of Payment (MOP)</label>
            <select
              value={payMop}
              onChange={e => setPayMop(e.target.value as PaymentMethod)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="GCash">GCash</option>
              <option value="Maya">Maya</option>
              <option value="Bank Transfer">Bank Transfer (BDO / BPI / UnionBank)</option>
              <option value="Cash">Cash (Over the counter)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Amount to Pay (₱)</label>
            <input
              type="number"
              required
              value={payAmount}
              onChange={e => setPayAmount(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Reference Number / Payment Notes</label>
            <input
              type="text"
              value={payNotes}
              onChange={e => setPayNotes(e.target.value)}
              placeholder="e.g. GCash Ref # 1009283749"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-800">
            A digital official receipt will be generated and credited to your account ledger immediately upon submission.
          </div>

          <div className="pt-2 flex gap-3">
            <Button type="submit" variant="primary" className="flex-1 py-3 font-bold">
              Submit Payment
            </Button>
            <Button type="button" variant="ghost" onClick={() => setIsPayModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================= */}
      {/* MODAL 2: PAYMENT HISTORY (Matching info.php payment history)*/}
      {/* ========================================================= */}
      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        title="Payment History"
        subtitle={`House ${tenantHouseNo} • Resident: ${currentTenant?.fullname}`}
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={historyFilter}
              onChange={e => setHistoryFilter(e.target.value)}
              placeholder="Filter by date, mode of payment, or receipt #..."
              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="py-2.5 px-3">Receipt ID</th>
                  <th className="py-2.5 px-3">Date Paid</th>
                  <th className="py-2.5 px-3">Mode of Payment</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredPayments.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono text-emerald-700 font-bold">{p.receiptNumber}</td>
                    <td className="py-2.5 px-3 text-slate-500">{new Date(p.datePaid).toLocaleDateString()}</td>
                    <td className="py-2.5 px-3">{p.MOP}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">₱{p.amount.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => {
                          setActiveReceipt(p);
                          setIsReceiptModalOpen(true);
                        }}
                        className="p-1 px-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      {/* ========================================================= */}
      {/* MODAL 3: VIEW CONTRACT (Matching contractPDF.php)         */}
      {/* ========================================================= */}
      <Modal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
        title={`Residential Lease Contract • House ${tenantHouseNo}`}
        subtitle="HomeHub Residences & Property Management"
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs text-slate-700 p-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 leading-relaxed">
            <p className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2">
              Contract of Lease
            </p>
            <p>
              This contract is entered between <strong>HomeHub Residences (Lessor)</strong> and <strong>{currentTenant?.fullname} (Lessee)</strong> for the occupancy of <strong>House {tenantHouseNo}</strong>, situated at {currentProperty?.fulladdress}.
            </p>
            <div className="space-y-1.5 py-1">
              <p>• <strong>Monthly Rental:</strong> ₱{currentProperty?.rent.toLocaleString()} per calendar month.</p>
              <p>• <strong>Security Deposit:</strong> ₱{(currentTenant?.deposit || 0).toLocaleString()} held against damages.</p>
              <p>• <strong>Lease Term:</strong> 1 Year commencing on {new Date(currentTenant?.startDate || '').toLocaleDateString('en-US', { dateStyle: 'long' })}.</p>
              <p>• <strong>Permitted Occupants:</strong> {currentTenant?.occupants} authorized individuals.</p>
            </div>
            <p className="text-[11px] text-slate-500 italic">
              Digital copy certified by HomeHub Property Management.
            </p>
          </div>

          <Button
            variant="primary"
            onClick={() => window.print()}
            leftIcon={<Printer className="w-4 h-4" />}
            className="w-full font-bold"
          >
            Print Contract Copy
          </Button>
        </div>
      </Modal>

      {/* ========================================================= */}
      {/* MODAL 4: OFFICIAL RECEIPT                                 */}
      {/* ========================================================= */}
      <Modal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        maxWidth="md"
      >
        {activeReceipt && (
          <div className="space-y-5 text-slate-900 p-2">
            <div className="border-2 border-dashed border-emerald-500/40 p-6 rounded-2xl bg-white space-y-4 shadow-xs">
              <div className="text-center pb-3 border-b border-slate-100">
                <span className="text-xl font-black tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Home<span className="text-emerald-600">Hub</span> Residences
                </span>
                <p className="text-xs text-slate-500">Official Electronic Receipt</p>
                <p className="text-xs font-mono text-emerald-700 font-bold mt-1">{activeReceipt.receiptNumber}</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Date:</span>
                  <span className="font-semibold">{new Date(activeReceipt.datePaid).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">House / Unit #:</span>
                  <span className="font-bold">House {activeReceipt.house_no}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Received From:</span>
                  <span className="font-bold">{activeReceipt.fullname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mode of Payment:</span>
                  <span className="font-semibold">{activeReceipt.MOP}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100">
                  <span className="text-slate-400 font-bold">Amount Paid:</span>
                  <span className="font-black text-emerald-600 text-base">₱{activeReceipt.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={() => window.print()}
              leftIcon={<Printer className="w-4 h-4" />}
              className="w-full py-2.5 font-bold"
            >
              Print Official Receipt
            </Button>
          </div>
        )}
      </Modal>

    </div>
  );
}
