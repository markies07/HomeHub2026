'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LoginModal } from '@/components/ui/LoginModal';
import { ContactModal } from '@/components/ui/ContactModal';
import { 
  User, LogOut, LayoutDashboard, Menu, X, 
  Home, MessageSquare, KeyRound, Phone
} from 'lucide-react';

export function Navbar() {
  const { user, role, logout } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardPath = () => {
    if (role === 'super_admin') return '/dashboard';
    if (role === 'admin') return '/dashboard/tenants';
    if (role === 'tenant') return '/tenant-portal';
    return '/dashboard';
  };

  const getRoleBadge = () => {
    if (role === 'super_admin') return { label: 'Owner', color: 'text-emerald-400' };
    if (role === 'admin') return { label: 'Staff', color: 'text-blue-400' };
    return { label: `Unit ${user?.assignedHouseNo}`, color: 'text-amber-400' };
  };

  return (
    <>
      <header 
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled 
            ? 'glass-navbar shadow-lg shadow-black/30' 
            : 'bg-transparent border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group select-none">
            <img src="/img/homehub-icon.png" alt="HomeHub" className="w-9 h-9 object-contain shrink-0" />
            <div>
              <span className="text-xl font-black tracking-tight text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Home<span className="text-gradient-emerald">Hub</span>
              </span>
              <p className="text-[10px] font-medium -mt-0.5 tracking-wide hidden sm:block" style={{ color: '#475569' }}>
                Property Management
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
              style={{ color: '#94a3b8' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f1f5f9')}
              onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
            >
              Explore Units
            </Link>
            <button
              onClick={() => setIsContactOpen(true)}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer"
              style={{ color: '#94a3b8' }}
            >
              Contact
            </button>
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href={getDashboardPath()}>
                  <button 
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 cursor-pointer hover:scale-[1.02]"
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      boxShadow: '0 4px 15px -3px rgba(16, 185, 129, 0.4)'
                    }}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    {role === 'super_admin' ? 'Owner Portal' : role === 'admin' ? 'Staff Portal' : 'My Portal'}
                  </button>
                </Link>

                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-500/30 flex items-center justify-center p-1" style={{ background: '#1e293b' }}>
                    <img 
                      src={user.role === 'tenant' ? '/icons/tenant.png' : '/icons/owner.png'} 
                      alt={user.fullname} 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white leading-tight line-clamp-1 max-w-[100px]">
                      {user.fullname}
                    </p>
                    <p className={`text-[10px] font-semibold uppercase tracking-wider ${getRoleBadge().color}`}>
                      {getRoleBadge().label}
                    </p>
                  </div>
                  <button
                    onClick={logout}
                    title="Sign Out"
                    className="p-1 rounded-lg transition-colors ml-1 cursor-pointer"
                    style={{ color: '#475569' }}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsContactOpen(true)}
                  className="px-4 py-2 text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                  style={{ color: '#94a3b8' }}
                >
                  <Phone className="w-3.5 h-3.5" />
                  Inquire
                </button>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    boxShadow: '0 4px 20px -5px rgba(16, 185, 129, 0.5)'
                  }}
                >
                  <KeyRound className="w-4 h-4" />
                  Sign In
                </button>
              </div>
            )}
          </div>

          {/* Mobile Trigger */}
          <div className="flex md:hidden items-center gap-2">
            {user && (
              <Link href={getDashboardPath()}>
                <button 
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                >
                  Portal
                </button>
              </Link>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl transition-colors cursor-pointer"
              style={{ color: '#94a3b8' }}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden border-t p-4 space-y-2 animate-fade-up"
            style={{ 
              background: 'rgba(5, 10, 15, 0.97)', 
              backdropFilter: 'blur(32px)',
              borderColor: 'rgba(255,255,255,0.08)'
            }}
          >
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={{ color: '#94a3b8' }}
            >
              <Home className="w-4 h-4 text-emerald-400" />
              Explore Units
            </Link>
            <button
              onClick={() => { setIsMobileMenuOpen(false); setIsContactOpen(true); }}
              className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer"
              style={{ color: '#94a3b8' }}
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Contact Us
            </button>

            <div className="pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-9 h-9 rounded-full border border-emerald-500/30 overflow-hidden flex items-center justify-center p-1.5" style={{ background: '#1e293b' }}>
                      <img 
                        src={user.role === 'tenant' ? '/icons/tenant.png' : '/icons/owner.png'} 
                        alt={user.fullname} 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{user.fullname}</p>
                      <p className={`text-xs font-semibold ${getRoleBadge().color}`}>{getRoleBadge().label}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setIsMobileMenuOpen(false); setIsLoginOpen(true); }}
                  className="flex items-center gap-2 w-full justify-center px-4 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer"
                  style={{ 
                    background: 'linear-gradient(135deg, #10b981, #059669)', 
                    boxShadow: '0 4px 15px -3px rgba(16, 185, 129, 0.4)' 
                  }}
                >
                  <KeyRound className="w-4 h-4" />
                  Sign In / Demo Access
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
}
