import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  Sparkles,
  GitCompare,
  Compass,
  FileText,
  BookmarkCheck,
  GraduationCap,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';

export const navigationItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'My Profile', path: '/profile', icon: UserCheck },
  { name: 'Job Matcher', path: '/job-matcher', icon: Sparkles, badge: 'Match' },
  { name: 'Skill Gap Analysis', path: '/skill-gap', icon: GitCompare },
  { name: 'Learning Roadmap', path: '/roadmap', icon: Compass },
  { name: 'Resume Builder', path: '/resume', icon: FileText, badge: 'ATS' },
  { name: 'Saved Jobs', path: '/saved-jobs', icon: BookmarkCheck },
  { name: 'Product Tour', path: '/landing', icon: Sparkles }
];

export const Sidebar = ({ onCloseMobile }) => {
  const { profile, profileCompletion, scans, resetAllData } = useApp();

  return (
    <aside className="w-64 h-full bg-white border-r border-slate-200/90 flex flex-col justify-between flex-shrink-0 select-none">
      {/* Top Branding */}
      <div>
        <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4 fill-white/20" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-slate-900 block leading-tight">
                SkillMatch<span className="text-indigo-600"> AI</span>
              </span>
              <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">
                Career Suite
              </span>
            </div>
          </div>
          <Badge variant="purple" size="xs">v1.0</Badge>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-4 space-y-1">
          <p className="px-3 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Workspace
          </p>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-indigo-50/80 text-indigo-700 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive
                              ? 'text-indigo-600'
                              : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>
                      {item.path === '/saved-jobs' && (scans?.length > 0) && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-slate-200">
                          {scans.length}
                        </span>
                      )}
                      {item.badge && item.path !== '/saved-jobs' && (
                        <span
                          className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                            isActive
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Profile Summary & Quick Reset */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        {/* Student Mini Card */}
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
              {profile.personal?.fullName
                ?.split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('') || 'ME'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {profile.personal?.fullName || 'Registered Candidate'}
              </p>
              <div className="flex items-center gap-1 text-xs text-slate-500 truncate">
                <GraduationCap className="w-3 h-3 text-slate-400" />
                <span>
                  {profile.education?.degree ? profile.education.degree.split(' ')[0] : 'Student'}
                  {profile.education?.graduationYear ? ` (${profile.education.graduationYear})` : ''}
                </span>
              </div>
            </div>
          </div>
          {/* Profile Completion Indicator */}
          <div className="mt-2.5 pt-2 border-t border-slate-200/50 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Profile completeness</span>
              <span className={`font-bold ${
                (profileCompletion?.percentage || 0) >= 80 ? 'text-emerald-600' :
                (profileCompletion?.percentage || 0) >= 50 ? 'text-indigo-600' : 'text-amber-600'
              }`}>
                {profileCompletion?.percentage || 0}%
              </span>
            </div>
            <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  (profileCompletion?.percentage || 0) >= 80 ? 'bg-emerald-500' :
                  (profileCompletion?.percentage || 0) >= 50 ? 'bg-indigo-600' : 'bg-amber-500'
                }`}
                style={{ width: `${profileCompletion?.percentage || 0}%` }}
              />
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-200/50 flex items-center justify-between text-xs">
            <span className="text-slate-500">Skills added:</span>
            <span className="font-semibold text-slate-800">{profile.skills?.length || 0}</span>
          </div>
        </div>

        {/* Reset State Shortcut */}
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to reset your profile and clear all registered data? You will be returned to the registration page to start fresh.')) {
              resetAllData();
            }
          }}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50/70 rounded-md transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Profile & Start Fresh</span>
        </button>
      </div>
    </aside>
  );
};

