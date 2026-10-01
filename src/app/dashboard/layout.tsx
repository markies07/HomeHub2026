'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import {
  Building2, LayoutDashboard, Home, Users, CreditCard,
  UserCog, MessageSquare, LogOut, Menu, X, ChevronRight,
  Search, User, Sparkles, ArrowRight, ShieldCheck,
  CheckCircle2, ChevronDown
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, loginAs, logout } = useAuth();
  const { chatSessions } = useData();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const totalUnread = chatSessions.reduce((sum, c) => sum + (c.ownerUnreadCount || 0), 0);
  const activeRole = role || user?.role || 'super_admin';

  const navGroups = [
    {
      label: 'Menu',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-4.5 h-4.5" />, roles: ['super_admin'] },
        { label: 'Properties', href: '/dashboard/units', icon: <Building2 className="w-4.5 h-4.5" />, roles: ['super_admin', 'admin'] },
        { label: 'Tenants', href: '/dashboard/tenants', icon: <Users className="w-4.5 h-4.5" />, roles: ['super_admin', 'admin'] },
        { label: 'Transactions', href: '/dashboard/payments', icon: <CreditCard className="w-4.5 h-4.5" />, roles: ['super_admin', 'admin'] },
      ]
    },
    {
      label: 'Settings',
      items: [
        { label: 'Accounts', href: '/dashboard/accounts', icon: <UserCog className="w-4.5 h-4.5" />, roles: ['super_admin'] },
        { label: 'Messages', href: '/dashboard/chat', icon: <MessageSquare className="w-4.5 h-4.5" />, roles: ['super_admin', 'admin'], badge: totalUnread > 0 ? totalUnread : undefined },
      ]
    }
  ];

  const filteredGroups = navGroups.map(g => ({
    ...g,
    items: g.items.filter(item => item.roles.includes(activeRole))
  })).filter(g => g.items.length > 0);

  const handleSignOut = () => { logout(); router.push('/'); };

  // Page label
  const currentPageLabel = (() => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname === '/dashboard/units') return 'Properties & Units';
    if (pathname === '/dashboard/tenants') return 'Tenants Directory';
    if (pathname === '/dashboard/payments') return 'Transactions & Ledger';
    if (pathname === '/dashboard/accounts') return 'Staff & Access';
    if (pathname === '/dashboard/chat') return 'Messages & Support';
    const seg = pathname.split('/')[2];
    if (!seg) return 'Dashboard';
    return seg.charAt(0).toUpperCase() + seg.slice(1);
  })();

  return (
    <div className="flex min-h-screen relative" style={{ background: '#f8fafc', color: '#0f172a' }}>

      {/* ===== TOP GLOWING TAB-LOAD PROGRESS BAR ===== */}
      <div className="h-0.5 w-full bg-transparent overflow-hidden fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <motion.div
          key={pathname}
          initial={{ x: '-100%', opacity: 1 }}
          animate={{ x: '0%', opacity: [1, 1, 0] }}
          transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1], times: [0, 0.8, 1] }}
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.9)]"
        />
      </div>

      {/* ===== WHITE SIDEBAR (Desktop - Zentra Style) ===== */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen z-40" style={{
        width: '240px',
        background: '#ffffff',
        borderRight: '1px solid #e8edf3',
        boxShadow: '1px 0 10px rgba(0,0,0,0.02)'
      }}>
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-5 py-5" style={{ borderBottom: '1px solid #f1f5f9' }}>
          <img src="/img/homehub-icon.png" alt="HomeHub" className="w-8 h-8 object-contain shrink-0" />
          <div>
            <span className="text-base font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Home<span className="gradient-text-green">Hub</span>
            </span>
            <p className="text-[10px] font-semibold text-slate-400 -mt-0.5">Property Management</p>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-6">
          {filteredGroups.map(group => (
            <div key={group.label}>
              <p className="sidebar-nav-section-label">{group.label}</p>
              <div className="space-y-1">
                {group.items.map(item => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer group ${
                        isActive ? 'text-emerald-900 font-bold' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeSidebarIndicator"
                          className="absolute inset-0 bg-emerald-50 border border-emerald-200/80 rounded-xl shadow-xs"
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}
                      <span className={`relative z-10 transition-colors ${isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                        {item.icon}
                      </span>
                      <span className="relative z-10 flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="relative z-10 ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500 text-white min-w-[18px] text-center shadow-xs">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile & Role Switcher */}
        <div className="p-3 relative" style={{ borderTop: '1px solid #f1f5f9' }}>
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200/60 hover:bg-slate-100/80 transition-colors">
            <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 flex items-center justify-center p-1.5 border border-emerald-300 bg-emerald-50 shadow-xs">
              <img 
                src={activeRole === 'tenant' ? '/icons/tenant.png' : '/icons/owner.png'} 
                alt="" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{user?.fullname || 'Mark Christian'}</p>
              <button
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 hover:underline cursor-pointer"
              >
                {activeRole === 'super_admin' ? 'Owner (Super Admin)' : activeRole === 'admin' ? 'Staff Admin' : 'Resident'}
                <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
              </button>
            </div>
            <button onClick={handleSignOut} title="Sign Out" className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer shrink-0">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Role Switch Popover */}
          <AnimatePresence>
            {isRoleMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.16 }}
                className="absolute bottom-20 left-3 right-3 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 text-xs"
              >
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">Switch View Role</p>
                <button
                  onClick={() => { loginAs('super_admin'); setIsRoleMenuOpen(false); }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between font-semibold cursor-pointer ${activeRole === 'super_admin' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <span className="flex items-center gap-2">
                    <img src="/icons/owner.png" alt="" className="w-4 h-4 object-contain" />
                    <span>Owner (Super Admin)</span>
                  </span>
                  {activeRole === 'super_admin' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
                <button
                  onClick={() => { loginAs('admin'); setIsRoleMenuOpen(false); }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between font-semibold cursor-pointer ${activeRole === 'admin' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <span className="flex items-center gap-2">
                    <img src="/icons/owner.png" alt="" className="w-4 h-4 object-contain" />
                    <span>Staff Admin</span>
                  </span>
                  {activeRole === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
                <button
                  onClick={() => { loginAs('tenant', 101); setIsRoleMenuOpen(false); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <img src="/icons/tenant.png" alt="" className="w-4 h-4 object-contain" />
                    <span>Tenant (Alexander Cruz)</span>
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <Link href="/" className="mt-2 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors">
            <Home className="w-3.5 h-3.5 text-emerald-600" />
            <span>Public Listing View</span>
          </Link>
        </div>
      </aside>

      {/* ===== MOBILE TOP BAR ===== */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white flex items-center justify-between px-4 h-14" style={{ borderBottom: '1px solid #e8edf3' }}>
        <div className="flex items-center gap-2">
          <img src="/img/homehub-icon.png" alt="HomeHub" className="w-7 h-7 object-contain shrink-0" />
          <span className="font-black text-slate-900 text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>HomeHub</span>
        </div>
        <button onClick={() => setIsMobileNavOpen(!isMobileNavOpen)} className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer">
          {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 pt-14" 
            style={{ background: 'rgba(15,23,42,0.3)', backdropFilter: 'blur(4px)' }} 
            onClick={() => setIsMobileNavOpen(false)}
          >
            <motion.div 
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="w-64 h-full bg-white shadow-2xl p-4 space-y-4" 
              onClick={e => e.stopPropagation()}
            >
              <nav className="space-y-4">
                {filteredGroups.map(group => (
                  <div key={group.label}>
                    <p className="sidebar-nav-section-label">{group.label}</p>
                    <div className="space-y-1">
                      {group.items.map(item => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileNavOpen(false)}
                          className={`sidebar-nav-item ${pathname === item.href ? 'active' : ''}`}
                        >
                          <span className="nav-icon">{item.icon}</span>
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="ml-auto text-[11px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#ef4444', color: '#fff' }}>{item.badge}</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== MAIN CONTENT CONTAINER ===== */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[240px]">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md h-16 px-6 sm:px-8 flex items-center justify-between" style={{ borderBottom: '1px solid #e8edf3' }}>
          <div className="flex items-center gap-2 text-sm overflow-hidden">
            <span className="text-slate-400 font-medium text-xs">Portal</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <AnimatePresence mode="wait">
              <motion.span
                key={currentPageLabel}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.18 }}
                className="font-bold text-slate-800 text-sm"
              >
                {currentPageLabel}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Search */}
            <div className="hidden md:flex items-center relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-8 pr-10 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-44 focus:w-60 transition-all"
              />
              <span className="absolute right-2.5 text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">⌘K</span>
            </div>

            {/* Avatar Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center p-1 bg-emerald-50 border border-emerald-200 shadow-xs">
                <img 
                  src={activeRole === 'tenant' ? '/icons/tenant.png' : '/icons/owner.png'} 
                  alt="" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">{user?.fullname?.split(' ')[0] || 'Mark'}</p>
                <p className="text-[10px] font-medium text-slate-400">
                  {activeRole === 'super_admin' ? 'Owner' : activeRole === 'admin' ? 'Staff' : 'Resident'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content View with smooth tab loading transition */}
        <main className="flex-1 p-6 sm:p-8 w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(2px)' }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

    </div>
  );
}
