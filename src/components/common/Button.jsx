import React from 'react';

const variants = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600 shadow-sm focus:ring-indigo-500',
  secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200 focus:ring-slate-400',
  outline: 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-sm focus:ring-slate-400',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-transparent focus:ring-slate-300',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 border-rose-600 shadow-sm focus:ring-rose-500',
  subtle: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100 focus:ring-indigo-300'
};

const sizes = {
  xs: 'text-xs px-3 py-1 rounded-md gap-1.5 font-medium',
  sm: 'text-sm px-3 py-1.5 rounded-md gap-1.5 font-semibold',
  md: 'text-base px-3 py-2 rounded-lg gap-2 font-semibold',
  lg: 'text-base px-4 py-2.5 rounded-lg gap-2 font-semibold'
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  icon: Icon,
  iconRight: IconRight,
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] border select-none focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
      {children}
      {IconRight && <IconRight className="w-4 h-4 flex-shrink-0" />}
    </button>
  );
};

