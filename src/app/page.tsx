'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { Property } from '@/types';
import { LoginModal } from '@/components/ui/LoginModal';
import { ContactModal } from '@/components/ui/ContactModal';
import { PropertyDetailModal } from '@/components/properties/PropertyDetailModal';
import {
  Building2, MapPin, Bed, Bath, Layers, ArrowRight,
  ShieldCheck, Wifi, CreditCard, MessageSquare,
  TrendingUp, Home, Menu, X, User, LogOut,
  LayoutDashboard, Phone, SlidersHorizontal, ArrowUpRight,
  ChevronDown, Check
} from 'lucide-react';

export default function HomePage() {
  const { properties, metrics } = useData();
  const { user, role, logout } = useAuth();

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [contactUnit, setContactUnit] = useState<number | undefined>();
  
  // Filtering state
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'occupied'>('all');
  const [pricePreset, setPricePreset] = useState<string>('all');
  const [customMinPrice, setCustomMinPrice] = useState<string>('');
  const [customMaxPrice, setCustomMaxPrice] = useState<string>('');
  const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(false);

  // Hero featured spotlight residence state
  const [spotlightUnitId, setSpotlightUnitId] = useState<string>('');

  const availableProperties = useMemo(() => {
    const avail = properties.filter(p => p.status === 'available');
    return avail.length > 0 ? avail : properties;
  }, [properties]);

  const spotlightUnit = useMemo(() => {
    if (spotlightUnitId) {
      const found = properties.find(p => p.id === spotlightUnitId);
      if (found) return found;
    }
    return availableProperties[0] || properties[0] || null;
  }, [properties, spotlightUnitId, availableProperties]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const browseSectionRef = useRef<HTMLElement>(null);
  const priceFilterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close price popover on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (priceFilterRef.current && !priceFilterRef.current.contains(e.target as Node)) {
        setIsPriceFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered properties based on Status and Price Range
  const filtered = useMemo(() => {
    return properties.filter(p => {
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;

      let matchPrice = true;
      if (pricePreset === 'under-15k') {
        matchPrice = p.rent < 15000;
      } else if (pricePreset === '15k-20k') {
        matchPrice = p.rent >= 15000 && p.rent <= 20000;
      } else if (pricePreset === '20k-25k') {
        matchPrice = p.rent >= 20000 && p.rent <= 25000;
      } else if (pricePreset === '25k-plus') {
        matchPrice = p.rent > 25000;
      } else if (pricePreset === 'custom') {
        const min = customMinPrice ? Number(customMinPrice) : 0;
        const max = customMaxPrice ? Number(customMaxPrice) : Infinity;
        matchPrice = p.rent >= min && p.rent <= max;
      }

      return matchStatus && matchPrice;
    });
  }, [properties, statusFilter, pricePreset, customMinPrice, customMaxPrice]);

  const getDashboardPath = () => {
    if (role === 'super_admin') return '/dashboard';
    if (role === 'admin') return '/dashboard/tenants';
    return '/tenant-portal';
  };

  const features = [
    { icon: <CreditCard className="w-5 h-5 text-emerald-600" />, title: 'Digital Rent Payments', desc: 'GCash, Maya, and Bank Transfer with instant verifiable digital receipts.', color: '#ecfdf5' },
    { icon: <MessageSquare className="w-5 h-5 text-blue-600" />, title: 'Direct Owner Messaging', desc: 'Message building management and submit maintenance inquiries instantly.', color: '#eff6ff' },
    { icon: <ShieldCheck className="w-5 h-5 text-purple-600" />, title: '24/7 Monitored Security', desc: 'CCTV surveillance and secure keycard entry for peace of mind.', color: '#f5f3ff' },
    { icon: <Wifi className="w-5 h-5 text-amber-600" />, title: 'Fiber Internet Ready', desc: 'Dedicated high-speed connectivity pre-installed in each apartment unit.', color: '#fffbeb' },
  ];

  const pricePresetLabels: Record<string, string> = {
    'all': 'All Prices',
    'under-15k': 'Under ₱15k',
    '15k-20k': '₱15k – ₱20k',
    '20k-25k': '₱20k – ₱25k',
    '25k-plus': '₱25k+',
    'custom': customMinPrice || customMaxPrice ? `₱${Number(customMinPrice || 0)/1000}k – ₱${Number(customMaxPrice || 50000)/1000}k` : 'Custom Range'
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#f8fafc', color: '#0f172a' }}>

      {/* ===== NAVBAR (Transparent at very top, White on scroll) ===== */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200/80 py-3'
          : 'bg-transparent border-b border-transparent shadow-none py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 select-none group">
            <img src="/img/homehub-icon.png" alt="HomeHub" className="w-8 h-8 object-contain shrink-0" />
            <span className="text-xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Home<span className="text-emerald-600">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            <button onClick={() => browseSectionRef.current?.scrollIntoView({ behavior: 'smooth' })} className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-emerald-700 hover:bg-white/60 transition-colors cursor-pointer">
              Browse Units
            </button>
            <button onClick={() => setIsContactOpen(true)} className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-emerald-700 hover:bg-white/60 transition-colors cursor-pointer">
              Contact
            </button>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2.5">
            {user ? (
              <div className="flex items-center gap-2">
                <Link href={getDashboardPath()}>
                  <button className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    {role === 'super_admin' ? 'Owner Portal' : role === 'admin' ? 'Staff Portal' : 'Resident Portal'}
                  </button>
                </Link>
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center bg-emerald-50 text-emerald-700 font-bold text-xs">
                    {user.fullname?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-none">{user.fullname}</p>
                    <p className="text-[10px] font-semibold text-emerald-600 leading-none mt-0.5">{role === 'super_admin' ? 'Owner' : role === 'admin' ? 'Staff' : `Unit ${user.assignedHouseNo || 101}`}</p>
                  </div>
                  <button onClick={logout} title="Sign Out" className="ml-1 p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer">
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button onClick={() => setIsContactOpen(true)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-white/80 transition-colors flex items-center gap-1.5 cursor-pointer">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />Inquire
                </button>
                <button onClick={() => setIsLoginOpen(true)} className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer">
                  Sign In
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-white/80 transition-colors cursor-pointer">
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-2 shadow-xl">
            <button onClick={() => { browseSectionRef.current?.scrollIntoView({ behavior: 'smooth' }); setIsMobileMenuOpen(false); }} className="w-full text-left flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer">
              <Home className="w-4 h-4 text-emerald-600" />Browse Units
            </button>
            <button onClick={() => { setIsContactOpen(true); setIsMobileMenuOpen(false); }} className="w-full text-left flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer">
              <MessageSquare className="w-4 h-4 text-emerald-600" />Contact Us
            </button>
            {!user ? (
              <button onClick={() => { setIsLoginOpen(true); setIsMobileMenuOpen(false); }} className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white cursor-pointer mt-2 shadow-sm">
                Sign In / Demo Access
              </button>
            ) : (
              <Link href={getDashboardPath()} className="block">
                <button className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white cursor-pointer mt-2 shadow-sm">
                  Go to Dashboard
                </button>
              </Link>
            )}
          </div>
        )}
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="pt-28 sm:pt-36 pb-20 px-4 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #f0fdf9 0%, #ecfdf5 30%, #f8fafc 60%, #eff6ff 100%)' }}>
        
        {/* Subtle animated floating radial background glow */}
        <motion.div 
          animate={{ 
            x: [0, 25, -15, 0],
            y: [0, -20, 15, 0],
            scale: [1, 1.05, 0.95, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 right-10 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" 
        />
        <motion.div 
          animate={{ 
            x: [0, -20, 20, 0],
            y: [0, 20, -15, 0],
            scale: [1, 0.95, 1.05, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-0 left-10 w-96 h-96 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" 
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left copy */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-800 border border-emerald-200 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Premier Apartment Living · Cavite
                </span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-slate-900" 
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Find Your<br />
                <span className="text-emerald-600">Perfect Home,</span><br />
                Live Better.
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg"
              >
                Premium residences with digital rent payments, real-time owner messaging, and transparent lease management — all in one modern platform.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-3 pt-2"
              >
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => browseSectionRef.current?.scrollIntoView({ behavior: 'smooth' })} 
                  className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-colors shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  View {metrics.availableUnits} Available Units
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsLoginOpen(true)} 
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  Resident Login
                </motion.button>
              </motion.div>

              {/* Resident-Friendly Highlights */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center gap-6 sm:gap-8 pt-4 border-t border-slate-200/80"
              >
                <div>
                  <p className="text-2xl font-black text-emerald-600 font-mono">{metrics.availableUnits || 3}</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">Available Homes</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900 font-mono">₱0</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">Broker Fees</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-teal-600 font-mono">100%</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">Verified Units</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Modern Featured Residence Spotlight Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {spotlightUnit && (
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xl relative z-10 transition-all hover:shadow-emerald-950/10">
                  
                  {/* Card top banner: Category & Live Availability */}
                  <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2.5 w-2.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                        Featured Available Residence
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100/80 border border-slate-200 px-2.5 py-0.5 rounded-full font-mono">
                      Unit {spotlightUnit.house_no}
                    </span>
                  </div>

                  {/* Animated Spotlight Residence Body (Smooth Transition when switching units) */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={spotlightUnit.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                      {/* High quality visual image banner with click to view */}
                      <div 
                        className="relative h-52 sm:h-64 rounded-2xl overflow-hidden bg-slate-100 group cursor-pointer border border-slate-200/60 shadow-inner"
                        onClick={() => { setSelectedProperty(spotlightUnit); setIsDetailOpen(true); }}
                        title="Click to view full residence gallery & details"
                      >
                        <img 
                          src={spotlightUnit.featuredImage || (spotlightUnit.images && spotlightUnit.images[0]) || '/img/uploads/6669ab9d41e18-428388204_7526491760743274_298134187706128058_n.jpg'} 
                          alt={spotlightUnit.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />

                        {/* Top overlay badges */}
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            Move-in Ready
                          </span>
                          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            Verified
                          </span>
                        </div>

                        {/* Bottom overlay: Unit Name & Address & Rent */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                          <div className="max-w-[65%]">
                            <p className="text-base sm:text-lg font-bold leading-tight drop-shadow-md text-white group-hover:text-emerald-300 transition-colors">
                              {spotlightUnit.title}
                            </p>
                            <p className="text-xs text-slate-200 flex items-center gap-1 mt-0.5 drop-shadow truncate">
                              <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                              {spotlightUnit.fulladdress?.replace(/^Unit\s*\d+,?\s*/i, '') || 'Acacia Ave., Cavite'}
                            </p>
                          </div>

                          {/* Floating Rent Tag */}
                          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/80 shadow-lg text-right shrink-0">
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Rent</p>
                            <p className="text-sm sm:text-base font-black text-slate-900 font-mono leading-none">
                              ₱{(spotlightUnit.rent || 0).toLocaleString()}
                              <span className="text-[11px] font-normal text-slate-500">/mo</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Spec pills row with micro-hover interactions */}
                      <div className="grid grid-cols-4 gap-2 mt-4">
                        <motion.div whileHover={{ y: -2, scale: 1.03 }} className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all text-center">
                          <div className="flex items-center gap-1 text-slate-800 font-bold text-xs">
                            <Bed className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{spotlightUnit.noRoom}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">Beds</span>
                        </motion.div>

                        <motion.div whileHover={{ y: -2, scale: 1.03 }} className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all text-center">
                          <div className="flex items-center gap-1 text-slate-800 font-bold text-xs">
                            <Bath className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{spotlightUnit.noBathroom}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">Baths</span>
                        </motion.div>

                        <motion.div whileHover={{ y: -2, scale: 1.03 }} className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all text-center">
                          <div className="flex items-center gap-1 text-slate-800 font-bold text-xs">
                            <Layers className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{spotlightUnit.squareMeters || 50}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">sqm Area</span>
                        </motion.div>

                        <motion.div whileHover={{ y: -2, scale: 1.03 }} className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all text-center">
                          <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                            <Wifi className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Ready</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">High Fiber</span>
                        </motion.div>
                      </div>

                      {/* Renter benefits trust row */}
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 py-3 my-3 border-y border-slate-100 px-1">
                        <span className="flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          Zero Broker Fee
                        </span>
                        <span className="flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          Direct Owner Chat
                        </span>
                        <span className="flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          Digital Lease
                        </span>
                      </div>

                      {/* Dual CTA buttons */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => { setSelectedProperty(spotlightUnit); setIsDetailOpen(true); }}
                          className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20 cursor-pointer"
                        >
                          <span>Explore Unit Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => { setContactUnit(spotlightUnit.house_no); setIsContactOpen(true); }}
                          className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
                          <span>Inquire / Schedule</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Interactive Quick Unit Switcher */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        Switch Featured Residence:
                      </p>
                      <button 
                        onClick={() => browseSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                        className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer flex items-center gap-0.5"
                      >
                        All Units ({metrics.availableUnits || properties.length}) <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {availableProperties.slice(0, 3).map((p) => {
                        const isSelected = spotlightUnit.id === p.id;
                        return (
                          <motion.button
                            key={p.id}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setSpotlightUnitId(p.id)}
                            className={`flex items-center gap-2 p-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                                : 'bg-white hover:bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                              <img src={p.featuredImage || (p.images && p.images[0])} alt={p.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`text-[11px] font-bold truncate ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>
                                Unit {p.house_no}
                              </p>
                              <p className="text-[10px] text-slate-500 font-mono">
                                ₱{(p.rent / 1000).toFixed(1)}k/m
                              </p>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}
            </motion.div>

          </div>
        </div>
      </section>

      {/* ===== BROWSE UNITS SECTION (With Price Range Filter, Animated Grid) ===== */}
      <section ref={browseSectionRef} id="units" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">

          {/* Section header with entrance animation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
          >
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Unit Directory</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Browse Available <span className="text-emerald-600">Residences</span>
              </h2>
            </div>

            {/* Filter Toolbar: Price Range Filter + Status Tabs */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Price Range Filter Button & Popover */}
              <div className="relative" ref={priceFilterRef}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 cursor-pointer transition-all ${
                    pricePreset !== 'all'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{pricePresetLabels[pricePreset] || 'Price Range'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isPriceFilterOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* Popover with smooth scale/fade animation */}
                <AnimatePresence>
                  {isPriceFilterOpen && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-11 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-30 text-xs space-y-3"
                    >
                      <p className="font-bold text-slate-800">Filter by Monthly Budget</p>
                      
                      {/* Quick Presets */}
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { id: 'all', label: 'All Prices' },
                          { id: 'under-15k', label: 'Under ₱15,000' },
                          { id: '15k-20k', label: '₱15k – ₱20k' },
                          { id: '20k-25k', label: '₱20k – ₱25k' },
                          { id: '25k-plus', label: '₱25,000+' },
                        ].map(preset => (
                          <button
                            key={preset.id}
                            onClick={() => {
                              setPricePreset(preset.id);
                              setIsPriceFilterOpen(false);
                            }}
                            className={`px-2.5 py-1.5 rounded-lg text-left font-semibold transition-colors cursor-pointer ${
                              pricePreset === preset.id
                                ? 'bg-emerald-600 text-white font-bold'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>

                      {/* Custom Min / Max inputs */}
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <p className="text-[11px] font-semibold text-slate-500">Custom Budget Range (₱)</p>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            placeholder="Min ₱"
                            value={customMinPrice}
                            onChange={e => {
                              setCustomMinPrice(e.target.value);
                              setPricePreset('custom');
                            }}
                            className="w-1/2 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                          <span className="text-slate-400">–</span>
                          <input
                            type="number"
                            placeholder="Max ₱"
                            value={customMaxPrice}
                            onChange={e => {
                              setCustomMaxPrice(e.target.value);
                              setPricePreset('custom');
                            }}
                            className="w-1/2 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => setIsPriceFilterOpen(false)}
                            className="flex-1 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs cursor-pointer hover:bg-emerald-700 transition-colors"
                          >
                            Apply Filter
                          </button>
                          <button
                            onClick={() => {
                              setPricePreset('all');
                              setCustomMinPrice('');
                              setCustomMaxPrice('');
                              setIsPriceFilterOpen(false);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 font-semibold text-xs hover:bg-slate-200 cursor-pointer transition-colors"
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Status filter tabs with animated slider indicator */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100">
                {(['all', 'available', 'occupied'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab)}
                    className={`relative px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer capitalize ${
                      statusFilter === tab
                        ? 'text-emerald-800'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {statusFilter === tab && (
                      <motion.div
                        layoutId="browseStatusPill"
                        className="absolute inset-0 bg-white rounded-lg shadow-xs"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10">{tab === 'all' ? 'All Units' : tab === 'available' ? 'Available' : 'Occupied'}</span>
                  </button>
                ))}
              </div>

            </div>
          </motion.div>

          {/* Property Grid with animated layout and card hover effects */}
          {filtered.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filtered.map(p => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.15 } }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.25 }}
                    key={p.id}
                    className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden hover:border-emerald-300 hover:shadow-xl transition-all flex flex-col cursor-pointer group"
                    onClick={() => { setSelectedProperty(p); setIsDetailOpen(true); }}
                  >
                    {/* Image with zoom effect */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={p.featuredImage || p.images[0]}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize shadow-xs backdrop-blur-md ${
                          p.status === 'available'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-500 text-white'
                        }`}>
                          {p.status}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-white/95 backdrop-blur-md text-slate-800 shadow-xs border border-slate-200/50">
                          Unit {p.house_no}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col gap-3 flex-1">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-1 group-hover:text-emerald-700 transition-colors">{p.title}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 line-clamp-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          {p.fulladdress}
                        </p>
                      </div>

                      {/* Specs */}
                      <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-slate-100 text-xs text-slate-600 font-medium">
                        <span className="flex items-center gap-1.5"><Bed className="w-3.5 h-3.5 text-emerald-600" />{p.noRoom} Bed</span>
                        <span className="flex items-center gap-1.5"><Bath className="w-3.5 h-3.5 text-emerald-600" />{p.noBathroom} Bath</span>
                        <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-emerald-600" />{p.squareMeters || 45}m²</span>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-1.5">
                        {p.amenities.slice(0, 3).map((a, i) => (
                          <span key={i} className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-100">{a}</span>
                        ))}
                        {p.amenities.length > 3 && (
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-slate-50 text-slate-400">+{p.amenities.length - 3}</span>
                        )}
                      </div>

                      {/* Price + Action */}
                      <div className="flex items-center justify-between pt-2 mt-auto border-t border-slate-100">
                        <div>
                          <p className="text-xl font-black text-slate-900 font-mono">₱{p.rent.toLocaleString()}</p>
                          <p className="text-[10px] text-slate-400">per month</p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={e => { e.stopPropagation(); setContactUnit(p.house_no); setIsContactOpen(true); }}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1 cursor-pointer shadow-xs shadow-emerald-600/20"
                        >
                          Inquire <ArrowUpRight className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200"
            >
              <Building2 className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="font-bold text-slate-700 text-sm">No residences match your budget range</p>
              <p className="text-xs text-slate-400 mt-1">Try expanding your price filter or selecting "All Prices"</p>
              <button
                onClick={() => { setPricePreset('all'); setStatusFilter('all'); }}
                className="mt-3 px-4 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-xs"
              >
                Reset Filter
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ===== WHY CHOOSE HOMEHUB (Animated Feature Cards) ===== */}
      <section className="py-20 px-4 bg-slate-50/70 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 mb-3 shadow-xs">
              Why Choose HomeHub
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mt-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Everything you need for<br /><span className="text-emerald-600">comfortable living</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-200 transition-all group"
              >
                <motion.div 
                  whileHover={{ scale: 1.15, rotate: 6 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform shadow-xs" 
                  style={{ background: f.color }}
                >
                  {f.icon}
                </motion.div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5 group-hover:text-emerald-700 transition-colors">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER (Clean copyright, No "Built with Next.js & Firebase") ===== */}
      <footer className="py-8 px-4 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/img/homehub-icon.png" alt="HomeHub" className="w-6 h-6 object-contain shrink-0" />
            <span className="text-sm font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Home<span className="text-emerald-600">Hub</span> Residences
            </span>
          </div>
          <p className="text-xs text-slate-500">
            © HomeHub Residences · Premier Property Management Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <button onClick={() => setIsContactOpen(true)} className="hover:text-emerald-600 transition-colors cursor-pointer">Contact</button>
            <button onClick={() => setIsLoginOpen(true)} className="hover:text-emerald-600 transition-colors cursor-pointer">Resident Sign In</button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PropertyDetailModal
        property={selectedProperty}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onInquire={(p) => { setContactUnit(p.house_no); setIsContactOpen(true); }}
      />
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        defaultUnit={contactUnit}
      />
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </div>
  );
}
