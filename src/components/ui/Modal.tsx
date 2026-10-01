'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  children: React.ReactNode;
}

const maxWidthMap = {
  sm: '28rem',
  md: '32rem',
  lg: '36rem',
  xl: '42rem',
  '2xl': '48rem',
  '3xl': '56rem',
};

export function Modal({ isOpen, onClose, title, subtitle, icon, maxWidth = 'md', children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full animate-scale-in overflow-hidden bg-white"
        style={{
          maxWidth: maxWidthMap[maxWidth],
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.18)',
        }}
      >
        {/* Top green accent bar */}
        <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

        {/* Header */}
        {(title || subtitle) && (
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-100">
            <div className="flex items-start gap-3.5">
              {icon && (
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 shadow-xs mt-0.5">
                  {icon}
                </div>
              )}
              <div>
                {title && (
                  <h2 className="text-xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>{title}</h2>
                )}
                {subtitle && (
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{subtitle}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer ml-4 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {!title && !subtitle && (
          <div className="flex justify-end px-4 pt-4">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto" style={{ maxHeight: '82vh' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
