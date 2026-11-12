import React from 'react';
import { Card } from './Card';

export const StatCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  badge,
  badgeVariant = 'primary',
  className = ''
}) => {
  return (
    <Card className={`p-5 relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {value}
            </span>
            {badge && (
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                badgeVariant === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' :
                badgeVariant === 'warning' ? 'bg-amber-50 text-amber-700 border border-amber-200/60' :
                badgeVariant === 'danger' ? 'bg-rose-50 text-rose-700 border border-rose-200/60' :
                'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
              }`}>
                {badge}
              </span>
            )}
          </div>
          {subtext && (
            <p className="text-xs text-slate-500 pt-0.5 font-normal">
              {subtext}
            </p>
          )}
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-indigo-50/70 border border-indigo-100/60 flex items-center justify-center text-indigo-600 flex-shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </Card>
  );
};

