import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Sparkles, Target } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

const PAGE_METADATA = {
  '/': { title: 'Dashboard', subtitle: 'Overview of skill readiness, match stats, and career priority gaps' },
  '/profile': { title: 'My Profile', subtitle: 'Manage your CS background, tech skills stack, projects, and career targets' },
  '/job-matcher': { title: 'Job Matcher', subtitle: 'Compare your skills against real job descriptions to identify matches and gaps' },
  '/skill-gap': { title: 'Skill Gap Analysis', subtitle: 'Detailed breakdown of missing competencies prioritized by hiring demand' },
  '/roadmap': { title: 'Learning Roadmap', subtitle: 'Structured curricula with free verified resources and practice milestones' },
  '/resume': { title: 'Resume Builder', subtitle: 'ATS optimized resume generator with live scoring and instant PDF export' },
  '/saved-jobs': { title: 'Saved Jobs', subtitle: 'Track and organize prospective tech roles through your application funnel' },
  '/landing': { title: 'Product Tour', subtitle: 'Overview of deterministic matching, gap matrix, and ATS resume generation' }
};

export const Header = ({ onOpenMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useApp();

  const currentMeta = PAGE_METADATA[location.pathname] || {
    title: 'SkillMatch AI',
    subtitle: 'Career assistance platform for CS students & freshers'
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between flex-shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Trigger */}
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page Titles */}
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight leading-none">
              {currentMeta.title}
            </h1>
            {profile.targetPreferences?.primaryRole && (
              <Badge variant="outline" size="xs" className="hidden sm:inline-flex" icon={Target}>
                {profile.targetPreferences.primaryRole}
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 hidden md:block mt-0.5 truncate max-w-md">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Header Right Actions */}
      <div className="flex items-center gap-2.5">
        {location.pathname !== '/job-matcher' && (
          <Button
            size="sm"
            variant="primary"
            icon={Sparkles}
            onClick={() => navigate('/job-matcher')}
            className="hidden sm:inline-flex"
          >
            Scan Job Description
          </Button>
        )}

        {location.pathname !== '/resume' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/resume')}
            className="text-xs"
          >
            Build ATS Resume
          </Button>
        )}
      </div>
    </header>
  );
};

