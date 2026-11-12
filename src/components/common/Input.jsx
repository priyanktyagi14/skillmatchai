import React from 'react';

export const Input = ({
  label,
  helperText,
  error,
  icon: Icon,
  className = '',
  id,
  type = 'text',
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      <div className="relative rounded-lg shadow-xs">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={`block w-full rounded-lg border bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
            Icon ? 'pl-9' : 'pl-3'
          } pr-3 py-2 ${
            error
              ? 'border-rose-300 focus:ring-rose-400 focus:border-rose-400'
              : 'border-slate-200 hover:border-slate-300'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-600">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
};

export const Textarea = ({
  label,
  helperText,
  error,
  className = '',
  rows = 4,
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={`block w-full rounded-lg border bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-3 transition-colors ${
          error
            ? 'border-rose-300 focus:ring-rose-400 focus:border-rose-400'
            : 'border-slate-200 hover:border-slate-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-600">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
};

