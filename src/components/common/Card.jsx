import React from 'react';

export const Card = ({
  children,
  className = '',
  onClick,
  hoverable = false
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200 shadow-sm transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        hoverable ? 'hover:border-slate-300 hover:shadow-md cursor-pointer active:scale-[0.98]' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={`p-5 sm:p-6 border-b border-slate-100 flex flex-col space-y-1.5 ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = '' }) => {
  return (
    <h3 className={`text-base font-semibold text-slate-900 tracking-tight flex items-center justify-between ${className}`}>
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className = '' }) => {
  return (
    <p className={`text-xs sm:text-sm text-slate-500 font-normal leading-relaxed ${className}`}>
      {children}
    </p>
  );
};

export const CardContent = ({ children, className = '' }) => {
  return <div className={`p-5 sm:p-6 ${className}`}>{children}</div>;
};

export const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={`p-4 sm:p-5 bg-slate-50/50 border-t border-slate-100 rounded-b-xl flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
};

