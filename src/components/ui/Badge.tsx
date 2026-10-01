'use client';

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'available' | 'occupied' | 'maintenance' | 'paid' | 'unpaid' | 'credits' | 'neutral' | 'default';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variantStyles: Record<string, string> = {
    available: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    occupied: 'bg-amber-50 text-amber-700 border-amber-200/80',
    maintenance: 'bg-rose-50 text-rose-700 border-rose-200/80',
    paid: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    unpaid: 'bg-rose-50 text-rose-700 border-rose-200/80',
    credits: 'bg-teal-50 text-teal-700 border-teal-200/80',
    neutral: 'bg-slate-100 text-slate-600 border-slate-200/80',
    default: 'bg-slate-100 text-slate-700 border-slate-200/80',
  };

  const style = variantStyles[variant] || variantStyles.default;

  return (
    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 border ${style} ${className}`}>
      {children}
    </span>
  );
}
