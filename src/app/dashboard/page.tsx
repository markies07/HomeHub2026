'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import {
  Building2, Home, Key, Users, CreditCard, AlertCircle,
  ArrowUpRight, Plus, Receipt, TrendingUp, RotateCcw,
  CheckCircle2, Calendar, Search, Filter, Download,
  MapPin, Eye, ChevronRight, Sparkles, Bed, Bath,
  DollarSign, ArrowDownRight, Check
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DashboardOverviewPage() {
  const { metrics, payments, properties, tenants, resetToDefaults } = useData();
  const { user } = useAuth();

  const [activeMonthIndex, setActiveMonthIndex] = useState(7); // August default
  const [propertySearch, setPropertySearch] = useState('');

  // 12-month mock cash flow data
  const monthsData = [
    { month: 'Jan', income: 85000, expense: 12000, net: 73000 },
    { month: 'Feb', income: 92000, expense: 15000, net: 77000 },
    { month: 'Mar', income: 95000, expense: 14000, net: 81000 },
    { month: 'Apr', income: 98000, expense: 19000, net: 79000 },
    { month: 'May', income: 102000, expense: 16000, net: 86000 },
    { month: 'Jun', income: 105000, expense: 18000, net: 87000 },
    { month: 'Jul', income: 110000, expense: 22000, net: 88000 },
    { month: 'Aug', income: 113000, expense: 18500, net: 94500 }, // Active
    { month: 'Sep', income: 115000, expense: 17000, net: 98000 },
    { month: 'Oct', income: 118000, expense: 20000, net: 98000 },
    { month: 'Nov', income: 122000, expense: 18000, net: 104000 },
    { month: 'Dec', income: 125000, expense: 25000, net: 100000 },
  ];

  const currentMonth = monthsData[activeMonthIndex];
  const maxIncome = Math.max(...monthsData.map(m => m.income));

  const filteredProperties = properties.filter(p =>
    p.title.toLowerCase().includes(propertySearch.toLowerCase()) ||
    p.house_no.toString().includes(propertySearch)
  ).slice(0, 4);

  return (
    <div className="space-y-7 pb-10">

      {/* ===== ZENTRA-STYLE TOP HERO BANNER ===== */}
      <div className="relative rounded-3xl overflow-hidden shadow-sm border border-emerald-100/80 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white p-6 sm:p-8">
        {/* Subtle decorative background shapes */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-40 -top-10 w-52 h-52 bg-emerald-400/20 rounded-full blur-xl pointer-events-none" />
        
        {/* Modern Vector Skyline / Property Graphic on the right */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
          <Building2 className="w-56 h-56 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-semibold mb-3 border border-white/20">
              <Building2 className="w-3.5 h-3.5 text-emerald-200" />
              <span>HomeHub Property Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Good morning, {user?.fullname?.split(' ')[0] || 'Mark'} 👋
            </h1>
            <p className="text-emerald-100/90 text-sm mt-1.5 leading-relaxed font-normal">
              You have <strong className="text-white font-semibold">10 active units</strong> occupied out of 12. Collections are up <strong className="text-white font-semibold">8%</strong> this cycle.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => alert('Exporting monthly property performance PDF...')}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-semibold text-xs transition-all border border-white/20 flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Export Report
            </button>
            <Link href="/dashboard/units">
              <button className="px-4 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer">
                <Plus className="w-4 h-4 text-emerald-600" />
                Add New Property
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ===== FOUR KEY METRIC CARDS (Zentra Exact Style) ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Highlighted Dark / Emerald Hero Card */}
        <motion.div 
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="rounded-2xl p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md relative overflow-hidden flex flex-col justify-between min-h-[140px]"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
          <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Portfolio Value</p>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
              ₱{(metrics.monthlyEarnings * 12).toLocaleString()}
            </h3>
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              +12% driven by 2 new units
            </div>
          </div>
        </motion.div>

        {/* Card 2: Total Properties */}
        <motion.div 
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="rounded-2xl p-5 bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[140px]"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">Total Properties</p>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
              {metrics.totalUnits} Units
            </h3>
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[11px] font-semibold">
              +2 New assets added
            </div>
          </div>
        </motion.div>

        {/* Card 3: Occupancy Rate */}
        <motion.div 
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="rounded-2xl p-5 bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[140px]"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">Occupancy Rate</p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
              {metrics.occupancyRate}%
            </h3>
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
              {metrics.rentedUnits} Units currently occupied
            </div>
          </div>
        </motion.div>

        {/* Card 4: Rental Income */}
        <motion.div 
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="rounded-2xl p-5 bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[140px]"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">Rental Income</p>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
              ₱{metrics.monthlyEarnings.toLocaleString()}
            </h3>
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              +8% Compared to last month
            </div>
          </div>
        </motion.div>

      </div>

      {/* ===== ROW 2: CASH FLOW BAR CHART + MONTH BREAKDOWN (Zentra Style) ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left (8 Cols): Cash Flow 12-Month Chart */}
        <div className="lg:col-span-8 rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Cash flow</h2>
              <p className="text-xs text-slate-400">Monthly revenue and expense tracking</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Income
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" /> Expense
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-200" /> Net
                </span>
              </div>

              <select className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-semibold focus:outline-none">
                <option>2026 (1 Year)</option>
                <option>2025 (Previous)</option>
              </select>
            </div>
          </div>

          {/* Interactive Bar Chart Visualization */}
          <div className="pt-6">
            <div className="h-48 flex items-end justify-between gap-2 sm:gap-3 px-2">
              {monthsData.map((item, idx) => {
                const heightPercent = Math.round((item.income / maxIncome) * 100);
                const isSelected = idx === activeMonthIndex;

                return (
                  <button
                    key={item.month}
                    onClick={() => setActiveMonthIndex(idx)}
                    className="flex-1 flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
                  >
                    {/* Tooltip on hover/active */}
                    <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-opacity ${isSelected ? 'opacity-100 bg-slate-900 text-white' : 'opacity-0 group-hover:opacity-100 bg-slate-800 text-white'}`}>
                      ₱{(item.income / 1000).toFixed(0)}k
                    </div>

                    {/* Bar Stack */}
                    <div className="w-full max-w-[28px] h-36 bg-slate-100 rounded-lg overflow-hidden flex flex-col justify-end p-0.5 transition-all group-hover:bg-slate-200">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercent}%` }}
                        transition={{ duration: 0.6, delay: idx * 0.03, ease: 'easeOut' }}
                        className={`w-full rounded-md transition-colors ${
                          isSelected
                            ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-sm'
                            : 'bg-slate-300 group-hover:bg-emerald-300'
                        }`}
                      />
                    </div>

                    <span className={`text-[11px] font-semibold transition-colors ${isSelected ? 'text-emerald-700 font-bold' : 'text-slate-400 group-hover:text-slate-700'}`}>
                      {item.month}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right (4 Cols): Selected Month Breakdown (August / Current) */}
        <div className="lg:col-span-4 rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">{currentMonth.month} 2026</h2>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                +8% Compared to last month
              </span>
            </div>

            {/* Metrics Breakdown with Progress Bars */}
            <div className="mt-5 space-y-5">
              
              {/* Income */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-500">Gross Income</span>
                  <span className="text-slate-900 font-bold">₱{currentMonth.income.toLocaleString()}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              {/* Expense */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-500">Operating Expenses</span>
                  <span className="text-slate-900 font-bold">₱{currentMonth.expense.toLocaleString()}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '25%' }} />
                </div>
              </div>

              {/* Net */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-500">Net Profit Retained</span>
                  <span className="text-emerald-700 font-bold">₱{currentMonth.net.toLocaleString()}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-300 rounded-full" style={{ width: '70%' }} />
                </div>
              </div>

            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500">Collection Target</p>
                <p className="text-xs font-bold text-slate-800">92% Met on Schedule</p>
              </div>
              <Link href="/dashboard/payments" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                View Ledger <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* ===== ROW 3: PROPERTIES BY LOCATION & RECENT PROPERTIES (Zentra Style) ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left (6 Cols): Properties by Location */}
        <div className="lg:col-span-6 rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Properties by location</h2>
            <Link href="/dashboard/units" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
              View All (12)
            </Link>
          </div>

          {/* Location Summary Card */}
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">HomeHub Residences Cavite</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  Acacia Ave., Cavite
                </p>
              </div>
              <span className="text-sm font-black text-slate-900">₱182,500/mo</span>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Status:</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                  10 Occupied · 2 Available
                </span>
              </div>
              <Link href="/dashboard/units">
                <button className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer">
                  See Details
                </button>
              </Link>
            </div>
          </div>

          {/* Interactive Cavite Map View Card */}
          <div className="relative h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
            {/* Map Background Grid graphic */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
            
            {/* Cavite stylized radar pin */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 animate-ping absolute inset-0" />
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg relative z-10">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-2 px-3 py-1 bg-white rounded-full shadow-md border border-slate-200 text-xs font-bold text-slate-800">
                HomeHub Cavite Complex
              </div>
            </div>

            <div className="absolute bottom-2 left-2 text-[10px] bg-white/80 backdrop-blur-md px-2 py-0.5 rounded border border-slate-200 text-slate-600 font-semibold">
              Cavite · 12 Units
            </div>
          </div>
        </div>

        {/* Right (6 Cols): Your Recent Properties */}
        <div className="lg:col-span-6 rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Your Recent Properties</h2>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                value={propertySearch}
                onChange={e => setPropertySearch(e.target.value)}
                placeholder="Search..."
                className="pl-7 pr-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 w-32 focus:w-44 transition-all focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Properties List Items */}
          <div className="space-y-3">
            {filteredProperties.map(prop => (
              <motion.div
                key={prop.id}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.15 }}
                className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all bg-white flex items-center justify-between gap-3 group"
              >
                {/* Thumbnail */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img
                      src={prop.featuredImage || prop.images[0]}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 truncate">{prop.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Unit {prop.house_no} • {prop.noRoom} BR • {prop.squareMeters}m²</p>
                    <p className="text-xs font-black text-slate-900 mt-1">
                      ₱{prop.rent.toLocaleString()}<span className="text-[10px] text-slate-400 font-normal">/mo</span>
                    </p>
                  </div>
                </div>

                {/* Status Badge & Action */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    prop.status === 'occupied'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                  }`}>
                    {prop.status}
                  </span>
                  <Link href="/dashboard/units">
                    <button className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-0.5">
                      Manage <ChevronRight className="w-3 h-3" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="pt-2 text-center">
            <Link href="/dashboard/units">
              <button className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl transition-colors">
                View All {properties.length} Units &amp; Manage Listings →
              </button>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
