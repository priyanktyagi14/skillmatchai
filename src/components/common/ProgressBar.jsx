import React from 'react';

export const ProgressBar = ({
  value = 0,
  max = 100,
  size = 'md',
  color = 'indigo',
  showLabel = false,
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeStyles = {
    xs: 'h-1.5',
    sm: 'h-2',
    md: 'h-2.5',
    lg: 'h-3.5'
  };

  const colorStyles = {
    indigo: 'bg-indigo-600',
    violet: 'bg-violet-600',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    auto: percentage >= 75 ? 'bg-emerald-500' : percentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'
  };

  const activeColor = color === 'auto' ? colorStyles.auto : (colorStyles[color] || colorStyles.indigo);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-600 mb-1.5">
          <span>Progress</span>
          <span className="font-semibold text-slate-800">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${sizeStyles[size] || sizeStyles.md}`}>
        <div
          className={`${activeColor} h-full rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

