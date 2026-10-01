'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#ffffff',
    border: 'none',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
  },
  secondary: {
    background: '#ecfdf5',
    color: '#059669',
    border: '1px solid #a7f3d0',
  },
  outline: {
    background: '#ffffff',
    color: '#334155',
    border: '1px solid #e2e8f0',
  },
  ghost: {
    background: 'transparent',
    color: '#475569',
    border: 'none',
  },
  danger: {
    background: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
  },
  glass: {
    background: 'rgba(255, 255, 255, 0.8)',
    color: '#0f172a',
    border: '1px solid #e2e8f0',
    backdropFilter: 'blur(12px)',
  },
};

const sizeClasses = {
  sm: 'text-xs px-3.5 py-1.5 gap-1.5',
  md: 'text-xs sm:text-sm px-4 py-2.5 gap-2',
  lg: 'text-sm sm:text-base px-6 py-3.5 gap-2.5 font-semibold',
};

export function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const currentVariantStyle = variantStyles[variant] || variantStyles.primary;

  return (
    <button
      disabled={disabled || isLoading}
      style={{ ...currentVariantStyle, ...style }}
      className={`inline-flex items-center justify-center font-bold rounded-xl transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-105 active:scale-[0.98] ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
