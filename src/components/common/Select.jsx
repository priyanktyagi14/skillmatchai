import React from 'react';

export const Select = ({
  label,
  options = [],
  value,
  onChange,
  className = '',
  id,
  helperText,
  error,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={onChange}
        className={`block w-full rounded-lg border bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 transition-colors ${
          error
            ? 'border-rose-300 focus:ring-rose-400'
            : 'border-slate-200 hover:border-slate-300'
        } ${className}`}
        {...props}
      >
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const labelText = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={val} value={val}>
              {labelText}
            </option>
          );
        })}
      </select>
      {error && <p className="text-xs text-rose-600">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
};

