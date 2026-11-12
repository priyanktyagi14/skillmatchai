import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  BookmarkCheck,
  ArrowRight,
  UserCheck,
  Code2,
  Briefcase,
  ChevronRight,
  FileText,
  Building,
  Clock,
  ShieldAlert,
  Check,
  Download,
  Eye,
  Percent
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { evaluateResumeATS } from '../../utils/atsAnalyzer';
import { STORAGE_KEYS, getStorageItem } from '../../utils/storage';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    profile,
    profileCompletion,
    scans = [],
    setActiveScan,
    resumeActivities = []
  } = useApp();

  // Selected report modal for recent jobs
  const [selectedReportScan, setSelectedReportScan] = useState(null);

  // Evaluate ATS Resume based on current custom draft from LocalStorage (or profile fallback)
  const resumeDraft = useMemo(() => {
    return getStorageItem(STORAGE_KEYS.RESUME_CUSTOM, profile);
  }, [profile]);

  const atsReport = useMemo(() => {
    return evaluateResumeATS(resumeDraft || profile);
  }, [resumeDraft, profile]);

  // Total analyzed jobs count
  const totalJobsAnalyzed = scans.length;

  // Average Compatibility Score
  const avgCompatibilityScore = useMemo(() => {
    if (scans.length === 0) return 0;
    const total = scans.reduce((sum, s) => sum + (s.matchPercentage || 0), 0);
    return Math.round(total / scans.length);
  }, [scans]);

  // Aggregate most frequently missing skills across ALL analyzed jobs in LocalStorage
  const topMissingSkills = useMemo(() => {
    if (scans.length === 0) return [];

    const missingMap = new Map();
    scans.forEach((scan) => {
      (scan.missingSkills || []).forEach((skill) => {
        const key = skill.name.toLowerCase().trim();
        const existing = missingMap.get(key) || {
          name: skill.name,
          category: skill.category || 'Tools & Technologies',
          occurrences: 0,
          isMandatory: false
        };
        existing.occurrences += 1;
        if (scan.missingMandatorySkills?.some((m) => m.name.toLowerCase().trim() === key)) {
          existing.isMandatory = true;
        }
        missingMap.set(key, existing);
      });
    });

    return Array.from(missingMap.values())
      .sort((a, b) => b.occurrences - a.occurrences)
      .slice(0, 5);
  }, [scans]);

  // Recent 4 analyzed jobs from LocalStorage
  const recentJobs = useMemo(() => {
    return scans.slice(0, 4);
  }, [scans]);

  // Helper to format activity timestamps
  const formatActivityTime = (isoString) => {
    if (!isoString) return 'Recent';
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 2) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Recent';
    }
  };

  // Icon for activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'pdf_download':
        return Download;
      case 'summary_tailored':
        return Sparkles;
      case 'skills_prioritized':
        return Code2;
      case 'project_updated':
        return FileText;
      case 'profile_synced':
        return UserCheck;
      default:
        return CheckCircle2;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. WELCOME & CAREER GOAL BANNER */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                {profile.education?.degree ? profile.education.degree.split('(')[0].trim() : 'CS Student / Candidate'}
              </span>
              {profile.education?.branch && (
                <span className="text-xs text-slate-500 font-medium">
                  {profile.education.branch}
                </span>
              )}
              {profile.education?.college && (
                <span className="text-xs text-slate-400">
                  • {profile.education.college}
                </span>
              )}
              {profile.education?.graduationYear && (
                <span className="text-xs text-slate-400">
                  • Class of {profile.education.graduationYear}
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Welcome back, {profile.personal?.fullName?.split(' ')[0] || profile.personal?.fullName || 'Candidate'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Targeting <span className="font-semibold text-slate-700">{profile.personal?.primaryRole || profile.targetPreferences?.primaryRole || 'Software Development Engineer'}</span>.
              Deterministic skill match algorithms compare your profile directly with target job postings to uncover dealbreakers and optimize your ATS resume.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Button
              variant="primary"
              size="sm"
              icon={Sparkles}
              onClick={() => navigate('/job-matcher')}
            >
              Analyze Your First Job
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={Briefcase}
              onClick={() => navigate('/resume')}
            >
              Resume Builder
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={UserCheck}
              onClick={() => navigate('/profile')}
              className="text-slate-600"
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* 2. MEANINGFUL USER-SPECIFIC STATISTICS ROW (All from actual LocalStorage) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Profile completion percentage */}
        <div
          onClick={() => navigate('/profile')}
          className="cursor-pointer transition-transform hover:-translate-y-0.5"
        >
          <StatCard
            title="Profile Completion"
            value={`${profileCompletion.percentage}%`}
            badge={profileCompletion.percentage >= 80 ? 'Complete' : 'In Progress'}
            badgeVariant={profileCompletion.percentage >= 80 ? 'success' : 'warning'}
            subtext={
              profileCompletion.missingItems.length === 0
                ? 'All core sections completed'
                : `${profileCompletion.missingItems.length} section(s) need attention`
            }
            icon={UserCheck}
          />
        </div>

        {/* Total jobs analyzed */}
        <div
          onClick={() => navigate('/saved-jobs')}
          className="cursor-pointer transition-transform hover:-translate-y-0.5"
        >
          <StatCard
            title="Total Jobs Analyzed"
            value={totalJobsAnalyzed}
            badge={totalJobsAnalyzed > 0 ? `${totalJobsAnalyzed} Scans` : 'No Scans'}
            badgeVariant={totalJobsAnalyzed > 0 ? 'primary' : 'warning'}
            subtext={totalJobsAnalyzed > 0 ? 'Saved analyses in LocalStorage' : 'Paste your first JD to scan'}
            icon={FileText}
          />
        </div>

        {/* Average compatibility score */}
        <div
          onClick={() => navigate('/saved-jobs')}
          className="cursor-pointer transition-transform hover:-translate-y-0.5"
        >
          <StatCard
            title="Avg. Compatibility"
            value={totalJobsAnalyzed > 0 ? `${avgCompatibilityScore}%` : 'N/A'}
            badge={
              totalJobsAnalyzed === 0
                ? 'No Data'
                : avgCompatibilityScore >= 70
                ? 'High Fit'
                : avgCompatibilityScore >= 40
                ? 'Moderate'
                : 'Needs Prep'
            }
            badgeVariant={
              totalJobsAnalyzed === 0
                ? 'warning'
                : avgCompatibilityScore >= 70
                ? 'success'
                : avgCompatibilityScore >= 40
                ? 'warning'
                : 'danger'
            }
            subtext={
              totalJobsAnalyzed > 0
                ? `Calculated across ${totalJobsAnalyzed} analyzed roles`
                : 'Run job scans to compute score'
            }
            icon={TrendingUp}
          />
        </div>

        {/* ATS Resume Score */}
        <div
          onClick={() => navigate('/resume')}
          className="cursor-pointer transition-transform hover:-translate-y-0.5"
        >
          <StatCard
            title="ATS Resume Score"
            value={`${atsReport.score}/100`}
            badge={atsReport.grade}
            badgeVariant={atsReport.badgeColor}
            subtext={`${atsReport.metrics.strongVerbCount} action verbs • ${atsReport.metrics.metricCount} metrics`}
            icon={Briefcase}
          />
        </div>
      </div>

      {/* 3. PROFILE COMPLETION PROGRESS CARD */}
      <Card className="p-5 bg-white border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-indigo-600" />
                Profile Readiness Status
              </span>
              <span className={`text-sm font-bold ${
                profileCompletion.percentage >= 80 ? 'text-emerald-600' : 'text-indigo-600'
              }`}>
                {profileCompletion.percentage}% Complete
              </span>
            </div>

            <ProgressBar value={profileCompletion.percentage} color="auto" size="md" />

            {/* Checklist Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {profileCompletion.checklist?.map((item) => (
                <div
                  key={item.id}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${
                    item.completed
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  {item.completed ? (
                    <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  )}
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Guide to hit 100% */}
          {profileCompletion.missingItems.length > 0 && (
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl md:w-80 shrink-0 space-y-1.5 text-xs text-indigo-950">
              <span className="font-bold flex items-center gap-1 text-xs uppercase tracking-wider text-indigo-800">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Next Step to Boost Completion
              </span>
              <p className="text-xs text-slate-600">
                {profileCompletion.missingItems[0]}
              </p>
              <button
                onClick={() => navigate('/profile')}
                className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 pt-0.5"
              >
                Complete profile section <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* 3B. SELECTED TECHNICAL SKILLS SECTION */}
      {profile.skills?.length > 0 && (
        <Card className="p-5 bg-white border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Your Technical Skills ({profile.skills.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Registered competencies used for job matching and resume evaluation
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="xs"
              iconRight={ChevronRight}
              onClick={() => navigate('/profile')}
              className="text-indigo-600 self-start sm:self-auto"
            >
              Manage in Profile
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {profile.skills.map((skill) => (
              <span
                key={skill.name}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 border border-slate-200 text-slate-800"
              >
                <span>{skill.name}</span>
                <span
                  className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                    skill.level === 'Advanced'
                      ? 'bg-purple-50 text-purple-700'
                      : skill.level === 'Intermediate'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {skill.level || 'Intermediate'}
                </span>
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* 4. MAIN TWO-COLUMN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: RECENTLY ANALYZED JOBS (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookmarkCheck className="w-4 h-4 text-indigo-600" />
                  Recently Analyzed Jobs
                </CardTitle>
                <CardDescription>
                  Your latest job description scans and deterministic match scores
                </CardDescription>
              </div>

              {scans.length > 0 && (
                <Button
                  variant="ghost"
                  size="xs"
                  iconRight={ChevronRight}
                  onClick={() => navigate('/saved-jobs')}
                  className="text-indigo-600"
                >
                  View All ({scans.length})
                </Button>
              )}
            </CardHeader>

            <CardContent className="space-y-4 pt-1">
              {recentJobs.length > 0 ? (
                <div className="space-y-3">
                  {recentJobs.map((job) => {
                    const score = job.matchPercentage || 0;
                    const badgeVariant = score >= 70 ? 'success' : score >= 40 ? 'warning' : 'danger';

                    return (
                      <div
                        key={job.id}
                        className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 transition-all shadow-2xs space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-0.5">
                            <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                              {job.jobTitle}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Building className="w-3 h-3 text-slate-400" />
                                {job.company || 'Direct Hiring'}
                              </span>
                              <span>•</span>
                              <span>{job.jobType || 'Full-time'}</span>
                              <span>•</span>
                              <span>{job.date ? new Date(job.date).toLocaleDateString() : 'Recently'}</span>
                            </div>
                          </div>

                          <div className="text-left sm:text-right shrink-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-xl font-extrabold ${
                                score >= 70 ? 'text-emerald-600' : score >= 40 ? 'text-amber-600' : 'text-rose-600'
                              }`}>
                                {score}%
                              </span>
                              <Badge variant={badgeVariant} size="xs">
                                {job.readiness?.badge || 'Analyzed'}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>Requirements Covered</span>
                            <span className="font-semibold text-slate-700">
                              {job.matchedSkills?.length || 0} of {job.totalRequired || 0} skills
                            </span>
                          </div>
                          <ProgressBar value={score} color="auto" size="xs" />
                        </div>

                        {/* Skills Chips */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          {(job.matchedSkills || []).slice(0, 4).map((s) => (
                            <span
                              key={s.id || s.name}
                              className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-medium"
                            >
                              ✓ {s.name}
                            </span>
                          ))}
                          {(job.missingSkills || []).slice(0, 2).map((s) => (
                            <span
                              key={s.id || s.name}
                              className="text-xs px-2 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 rounded font-medium"
                            >
                              ✕ {s.name}
                            </span>
                          ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                          <Button
                            variant="ghost"
                            size="xs"
                            icon={Eye}
                            onClick={() => setSelectedReportScan(job)}
                            className="text-slate-600 hover:text-slate-900"
                          >
                            View Report
                          </Button>

                          <div className="flex items-center gap-1.5">
                            <Button
                              variant="ghost"
                              size="xs"
                              icon={Sparkles}
                              onClick={() => {
                                setActiveScan(job);
                                navigate('/job-matcher');
                              }}
                              className="text-indigo-600 hover:text-indigo-700"
                            >
                              Reopen
                            </Button>
                            <Button
                              variant="secondary"
                              size="xs"
                              icon={Briefcase}
                              onClick={() => {
                                setActiveScan(job);
                                navigate('/resume');
                              }}
                            >
                              Tailor Resume
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  icon={BookmarkCheck}
                  title="No Jobs Analyzed Yet"
                  description="Paste a job description in Job Matcher to calculate your compatibility score and identify missing skills."
                  actionLabel="Analyze Your First Job"
                  onAction={() => navigate('/job-matcher')}
                  className="py-8"
                />
              )}
            </CardContent>

            {scans.length > 0 && (
              <CardFooter className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                  iconRight={ArrowRight}
                  onClick={() => navigate('/saved-jobs')}
                >
                  Manage All Saved Job Analyses ({scans.length})
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>

        {/* Right Column: MOST FREQUENTLY MISSING SKILLS & RECENT RESUME ACTIVITY (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* 5. MOST FREQUENTLY MISSING SKILLS CARD */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  Most Frequently Missing Skills
                </CardTitle>
                {scans.length > 0 && (
                  <Badge variant="outline" size="xs">
                    Across {scans.length} Roles
                  </Badge>
                )}
              </div>
              <CardDescription>
                Skills appearing most frequently across target job postings
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 pt-1">
              {topMissingSkills.length > 0 ? (
                <div className="space-y-2.5">
                  {topMissingSkills.map((gap) => {
                    const frequencyPercent = Math.round((gap.occurrences / scans.length) * 100);

                    return (
                      <div
                        key={gap.name}
                        className="p-3 rounded-lg border border-slate-200/80 bg-white hover:border-slate-300 transition-colors space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">
                              {gap.name}
                            </span>
                            <span className="text-xs text-slate-400">
                              {gap.category}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {gap.isMandatory && (
                              <Badge variant="danger" size="xs">
                                Must-Have
                              </Badge>
                            )}
                            <Badge variant="outline" size="xs" className="font-mono">
                              {gap.occurrences} of {scans.length}
                            </Badge>
                          </div>
                        </div>

                        {/* Frequency progress */}
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${gap.isMandatory ? 'bg-rose-500' : 'bg-indigo-500'}`}
                            style={{ width: `${frequencyPercent}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs pt-0.5">
                          <span className="text-slate-500 font-mono">
                            Required in {frequencyPercent}% of scanned roles
                          </span>
                          <Button
                            variant="ghost"
                            size="xs"
                            iconRight={ChevronRight}
                            onClick={() => navigate('/roadmap')}
                            className="text-indigo-600 hover:text-indigo-800 py-0 h-auto"
                          >
                            Roadmap
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700">
                    {scans.length === 0
                      ? 'No job descriptions analyzed yet'
                      : 'Zero recurring skill gaps detected!'}
                  </p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    {scans.length === 0
                      ? 'Analyze job descriptions in Job Matcher to identify your recurring skill gaps across target companies.'
                      : 'Your current skill profile satisfies all extracted requirements across your analyzed roles.'}
                  </p>
                </div>
              )}
            </CardContent>

            <CardFooter className="pt-2">
              <Button
                variant="ghost"
                size="xs"
                className="w-full justify-center"
                iconRight={ArrowRight}
                onClick={() => navigate('/skill-gap')}
              >
                View Full Skill Gap Matrix
              </Button>
            </CardFooter>
          </Card>

          {/* 6. RECENT RESUME ACTIVITY CARD */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  Recent Resume Activity
                </CardTitle>
                <Badge variant={atsReport.badgeColor} size="xs">
                  ATS: {atsReport.score}/100
                </Badge>
              </div>
              <CardDescription>
                Real-time tracking of resume tailoring and exports
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 pt-1">
              {resumeActivities.length > 0 ? (
                <div className="space-y-3">
                  {resumeActivities.slice(0, 4).map((activity) => {
                    const Icon = getActivityIcon(activity.type);

                    return (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {activity.title}
                            </span>
                            <span className="text-xs text-slate-400 shrink-0 font-mono">
                              {formatActivityTime(activity.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                            {activity.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  icon={Briefcase}
                  title="No Resume Activity Yet"
                  description="Use the ATS Resume Builder to customize your profile summary, reorder skills, and export recruiter-ready PDFs."
                  actionLabel="Open Resume Builder"
                  onAction={() => navigate('/resume')}
                  className="py-6"
                />
              )}
            </CardContent>

            <CardFooter className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center"
                icon={Briefcase}
                onClick={() => navigate('/resume')}
              >
                Open ATS Resume Builder
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* MATCH REPORT MODAL (Triggered from recent jobs list) */}
      <Modal
        isOpen={Boolean(selectedReportScan)}
        onClose={() => setSelectedReportScan(null)}
        title={selectedReportScan?.jobTitle || 'Match Report'}
        description={`${selectedReportScan?.company || 'Direct Hiring'} • Analyzed on ${
          selectedReportScan?.date ? new Date(selectedReportScan.date).toLocaleDateString() : 'Recently'
        }`}
        maxWidth="max-w-3xl"
      >
        {selectedReportScan && (
          <div className="space-y-5">
            {/* Score Visualizer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Compatibility Rating
                </span>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-extrabold ${
                    selectedReportScan.matchPercentage >= 70
                      ? 'text-emerald-600'
                      : selectedReportScan.matchPercentage >= 40
                      ? 'text-amber-600'
                      : 'text-rose-600'
                  }`}>
                    {selectedReportScan.matchPercentage}%
                  </span>
                  <Badge
                    variant={
                      selectedReportScan.matchPercentage >= 70
                        ? 'success'
                        : selectedReportScan.matchPercentage >= 40
                        ? 'warning'
                        : 'danger'
                    }
                    size="sm"
                  >
                    {selectedReportScan.readiness?.badge || 'Analyzed'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600">
                  {selectedReportScan.readiness?.description}
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-xs text-slate-500 block">ATS Match Density</span>
                <span className="text-lg font-bold text-indigo-600">
                  {selectedReportScan.atsDensity || selectedReportScan.matchPercentage}%
                </span>
                <span className="text-xs text-slate-400 block font-mono">
                  {selectedReportScan.matchedSkills?.length || 0} of {selectedReportScan.totalRequired || 0} skills
                </span>
              </div>
            </div>

            {/* Score Explanation */}
            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-indigo-950 uppercase tracking-wider text-xs">
                <span>Score Breakdown</span>
                <Badge variant="outline" size="xs">
                  {selectedReportScan.scoringMethod === 'fallback_equal_weight' ? 'Fallback Mode' : 'Weighted 80/20'}
                </Badge>
              </div>
              <p className="text-slate-700 font-mono bg-white p-2.5 rounded-lg border border-indigo-100">
                {selectedReportScan.scoreExplanation}
              </p>
            </div>

            {/* Matched Skills */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Matched Skills ({selectedReportScan.matchedSkills?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(selectedReportScan.matchedSkills || []).map((s) => (
                  <span
                    key={s.id || s.name}
                    className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg font-medium"
                  >
                    {s.name}
                  </span>
                ))}
                {(selectedReportScan.matchedSkills || []).length === 0 && (
                  <p className="text-xs text-slate-400 italic">No skills matched.</p>
                )}
              </div>
            </div>

            {/* Missing Mandatory Skills */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Missing Mandatory Gaps ({selectedReportScan.missingMandatorySkills?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(selectedReportScan.missingMandatorySkills || []).map((s) => (
                  <span
                    key={s.id || s.name}
                    className="text-xs px-2.5 py-1 bg-rose-50 text-rose-900 border border-rose-200 rounded-lg font-medium"
                  >
                    {s.name}
                  </span>
                ))}
                {(selectedReportScan.missingMandatorySkills || []).length === 0 && (
                  <p className="text-xs text-emerald-700 font-medium">Zero mandatory dealbreakers!</p>
                )}
              </div>
            </div>

            {/* Modal CTAs */}
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedReportScan(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={Briefcase}
                onClick={() => {
                  setActiveScan(selectedReportScan);
                  navigate('/resume');
                }}
              >
                Tailor ATS Resume
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
