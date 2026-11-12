import React from 'react';

const variantStyles = {
  default: 'bg-slate-100 text-slate-700 border-slate-200',
  primary: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  warning: 'bg-amber-50 text-amber-800 border-amber-200/60',
  danger: 'bg-rose-50 text-rose-700 border-rose-200/60',
  purple: 'bg-violet-50 text-violet-700 border-violet-200/60',
  outline: 'bg-transparent text-slate-600 border-slate-300'
};

const sizeStyles = {
  xs: 'text-xs px-2 py-0.5 font-medium',
  sm: 'text-xs px-2.5 py-0.5 font-semibold',
  md: 'text-sm px-3 py-1 font-semibold'
};

export const Badge = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  icon: Icon
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border tracking-tight ${variantStyles[variant] || variantStyles.default} ${sizeStyles[size] || sizeStyles.sm} ${className}`}
    >
      {Icon && <Icon className="w-3 h-3 flex-shrink-0" />}
      {children}
    </span>
  );
};

