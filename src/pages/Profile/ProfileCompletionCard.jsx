import React from 'react';
import {
  CheckCircle2,
  CircleAlert,
  Sparkles,
  ArrowRight,
  UserCheck,
  Code2,
  FolderGit2,
  Briefcase,
  Share2
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

const SECTION_ICONS = {
  personal: UserCheck,
  skills: Code2,
  projects: FolderGit2,
  experience: Briefcase,
  links: Share2
};

export const ProfileCompletionCard = ({ profileCompletion, onNavigateSection }) => {
  if (!profileCompletion) return null;

  const { percentage = 0, checklist = [], missingItems = [] } = profileCompletion;

  const getStatusBadge = (pct) => {
    if (pct >= 90) return { label: 'ATS & Recruiter Ready', variant: 'emerald' };
    if (pct >= 70) return { label: 'Solid Profile Progress', variant: 'indigo' };
    if (pct >= 45) return { label: 'Intermediate Setup', variant: 'amber' };
    return { label: 'Action Required', variant: 'rose' };
  };

  const status = getStatusBadge(percentage);

  return (
    <Card className="p-5 sm:p-6 bg-gradient-to-br from-white via-slate-50/50 to-indigo-50/30 border-slate-200/90 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Completion Score & Header */}
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Profile Completion Indicator
            </span>
            <Badge variant={status.variant} size="sm">
              {status.label}
            </Badge>
          </div>

          <div>
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {percentage}%
              </span>
              <span className="text-xs sm:text-sm text-slate-500 font-medium">
                completed • stored locally in your browser
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              Complete your profile with education details, categorized technical skills, and featured projects to maximize ATS job matching accuracy.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                percentage >= 80 ? 'bg-emerald-500' :
                percentage >= 50 ? 'bg-indigo-600' : 'bg-amber-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Right: Section Checklist Pills */}
        <div className="flex-1 lg:max-w-md bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs space-y-2.5">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Profile Sections Overview
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {checklist.map((item) => {
              const Icon = SECTION_ICONS[item.id] || CheckCircle2;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigateSection && onNavigateSection(item.id)}
                  className={`text-left p-2 rounded-lg border text-xs transition-all flex items-start gap-2 ${
                    item.completed
                      ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-900 hover:bg-emerald-100/60'
                      : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="mt-0.5">
                    {item.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <CircleAlert className="w-3.5 h-3.5 text-amber-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold truncate">{item.label}</p>
                    <p className="text-[10px] text-slate-500 truncate">{item.detail}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Actionable Next Steps if incomplete */}
      {missingItems && missingItems.length > 0 && percentage < 100 && (
        <div className="mt-4 pt-4 border-t border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="font-semibold text-slate-900">Next Step:</span>
            <span className="text-slate-600 truncate">{missingItems[0]}</span>
          </div>
          <span className="text-[11px] text-indigo-600 font-medium flex items-center gap-1">
            Complete to reach 100%
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      )}
    </Card>
  );
};

