import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  CheckCircle2,
  Clock,
  ExternalLink,
  BookOpen,
  Code2,
  Sparkles,
  AlertCircle,
  ArrowRight,
  Search,
  RotateCcw,
  Briefcase,
  Target,
  TrendingUp,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { resolveSkillRoadmapDetails } from '../../data/skillResources';
import { calculateSkillMatch } from '../../utils/matcherEngine';

export const RoadmapPage = () => {
  const navigate = useNavigate();
  const {
    scans,
    activeScan,
    setActiveScan,
    profile,
    roadmapSkillStatus,
    updateSkillRoadmapStatus,
    getSkillRoadmapStatus,
    roadmaps,
    completedTasks,
    toggleTaskCompletion
  } = useApp();

  // Active view tab: 'JOB_ROADMAP' (dynamic based on missing skills) vs 'CURATED_TRACKS' (preset deep-dives)
  const [activeTab, setActiveTab] = useState('JOB_ROADMAP');

  // Job scan selection (default to activeScan or latest scan in scans list)
  const [selectedScanId, setSelectedScanId] = useState(() => activeScan?.id || scans[0]?.id || '');

  // Filters & search
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL'); // 'ALL' | 'HIGH' | 'MEDIUM'
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'not_started' | 'in_progress' | 'completed'

  // Toast / feedback notification
  const [feedbackNotice, setFeedbackNotice] = useState(null);

  // Sync selectedScanId with activeScan changes
  useEffect(() => {
    if (activeScan?.id && activeScan.id !== selectedScanId) {
      setSelectedScanId(activeScan.id);
    }
  }, [activeScan?.id, selectedScanId]);

  // Current active job analysis record
  const currentScan = useMemo(() => {
    if (!scans || scans.length === 0) return null;
    const found = scans.find((s) => s.id === selectedScanId);
    return found || activeScan || scans[0] || null;
  }, [scans, selectedScanId, activeScan]);

  const handleScanChange = (scanId) => {
    setSelectedScanId(scanId);
    const target = scans.find((s) => s.id === scanId);
    if (target) {
      setActiveScan(target);
    }
  };

  // Derive target skills from the job analysis
  // We identify all missing skills from the job scan (both mandatory and preferred)
  const missingSkillsList = useMemo(() => {
    if (!currentScan) return [];

    // Combine mandatory and preferred missing skills from the scan
    const mandatory = currentScan.missingMandatorySkills || [];
    const preferred = currentScan.missingPreferredSkills || [];
    const generalMissing = currentScan.missingSkills || [];

    // Map to preserve requirementType and priority
    const map = new Map();

    mandatory.forEach((s) => {
      const name = s.name.trim();
      map.set(name.toLowerCase(), {
        ...s,
        requirementType: 'Mandatory',
        priority: 'High'
      });
    });

    preferred.forEach((s) => {
      const name = s.name.trim();
      if (!map.has(name.toLowerCase())) {
        map.set(name.toLowerCase(), {
          ...s,
          requirementType: 'Preferred',
          priority: 'Medium'
        });
      }
    });

    generalMissing.forEach((s) => {
      const name = s.name.trim();
      if (!map.has(name.toLowerCase())) {
        map.set(name.toLowerCase(), {
          ...s,
          requirementType: s.requirementType || 'Mandatory',
          priority: s.requirementType === 'Preferred' ? 'Medium' : 'High'
        });
      }
    });

    // Resolve roadmap metadata, verified resources, and why-it-matters explanations
    return Array.from(map.values()).map((skillItem) => {
      const details = resolveSkillRoadmapDetails(skillItem, currentScan.jobTitle);
      const currentStatus = getSkillRoadmapStatus(skillItem.name);

      return {
        ...skillItem,
        ...details,
        status: currentStatus
      };
    });
  }, [currentScan, getSkillRoadmapStatus, roadmapSkillStatus, profile.skills]);

  // Dynamic live match percentage calculation
  const liveMatchData = useMemo(() => {
    if (!currentScan) return null;
    return calculateSkillMatch(profile?.skills || [], currentScan);
  }, [currentScan, profile?.skills]);

  // Overall Roadmap Progress calculation
  const totalSkills = missingSkillsList.length;
  const completedCount = missingSkillsList.filter((s) => s.status === 'completed').length;
  const inProgressCount = missingSkillsList.filter((s) => s.status === 'in_progress').length;
  const notStartedCount = missingSkillsList.filter((s) => s.status === 'not_started').length;

  const mandatorySkills = missingSkillsList.filter((s) => s.priority === 'High');
  const mandatoryCompleted = mandatorySkills.filter((s) => s.status === 'completed').length;

  const overallProgressPercent = totalSkills > 0
    ? Math.round((completedCount / totalSkills) * 100)
    : 100;

  // Filtered skills based on user controls
  const filteredSkills = useMemo(() => {
    return missingSkillsList.filter((item) => {
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.skillName.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesWhy = item.whyMatters.toLowerCase().includes(query);
        if (!matchesName && !matchesCategory && !matchesWhy) return false;
      }

      // Priority filter
      if (priorityFilter === 'HIGH' && item.priority !== 'High') return false;
      if (priorityFilter === 'MEDIUM' && item.priority !== 'Medium') return false;

      // Status filter
      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;

      return true;
    });
  }, [missingSkillsList, searchQuery, priorityFilter, statusFilter]);

  // Handlers for learning status updates
  const handleSetStatus = (skill, newStatus) => {
    updateSkillRoadmapStatus(skill, newStatus, {
      fromJob: currentScan?.jobTitle || 'Target Job'
    });

    if (newStatus === 'completed') {
      setFeedbackNotice({
        type: 'success',
        message: `Marked "${skill.skillName || skill.name}" as completed! Added to your profile and refreshed your job match readiness.`
      });
    } else if (newStatus === 'in_progress') {
      setFeedbackNotice({
        type: 'info',
        message: `Marked "${skill.skillName || skill.name}" as in progress. Keep up the great momentum!`
      });
    } else {
      setFeedbackNotice({
        type: 'default',
        message: `Reset status for "${skill.skillName || skill.name}" to Not Started.`
      });
    }

    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  // State for Curated Track selector (Deep-dive mode)
  const [selectedCuratedId, setSelectedCuratedId] = useState(roadmaps[0]?.id || '');
  const activeCuratedRoadmap = roadmaps.find((r) => r.id === selectedCuratedId) || roadmaps[0];
  const allCuratedChecklist = activeCuratedRoadmap?.modules?.flatMap((m) => m.checklist) || [];
  const completedCuratedCount = allCuratedChecklist.filter((item) => completedTasks[item.id]).length;
  const curatedProgressPercent = allCuratedChecklist.length > 0
    ? Math.round((completedCuratedCount / allCuratedChecklist.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* View Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-2xs">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              Learning Roadmap
            </h1>
            <p className="text-xs text-slate-500">
              Personalized upskilling curriculum generated from your latest job analysis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('JOB_ROADMAP')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'JOB_ROADMAP'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Job Analysis Roadmap
          </button>
          <button
            onClick={() => setActiveTab('CURATED_TRACKS')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'CURATED_TRACKS'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Curated Deep-Dive Tracks
          </button>
        </div>
      </div>

      {/* Temporary Toast Notice */}
      {feedbackNotice && (
        <div
          className={`p-3 rounded-lg border flex items-center justify-between gap-2 text-xs animate-in fade-in transition-all ${
            feedbackNotice.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : feedbackNotice.type === 'info'
              ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <Clock className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            )}
            <span>{feedbackNotice.message}</span>
          </div>
          <button
            onClick={() => setFeedbackNotice(null)}
            className="text-slate-400 hover:text-slate-600 text-xs px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODE 1: DYNAMIC JOB ANALYSIS ROADMAP (PRIMARY VIEW) */}
      {/* ============================================================ */}
      {activeTab === 'JOB_ROADMAP' && !currentScan && (
        <Card className="p-8 text-center bg-white border-slate-200/80 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600">
            <Compass className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">No Job Match Results Available</h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              The Learning Roadmap derives customized study paths from the missing skills detected in your analyzed job descriptions. Run your first job description scan to view tailored learning roadmaps.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
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
              onClick={() => setActiveTab('CURATED_TRACKS')}
            >
              Explore Curated Engineering Tracks
            </Button>
          </div>
        </Card>
      )}

      {activeTab === 'JOB_ROADMAP' && currentScan && (
        <>
          {/* Target Job Header & Scan Selector */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    Active Job Analysis
                  </span>
                  {currentScan && (
                    <Badge variant={liveMatchData?.matchPercentage >= 70 ? 'success' : 'warning'} size="xs">
                      Live Match: {liveMatchData?.matchPercentage ?? currentScan.matchPercentage}%
                    </Badge>
                  )}
                  {mandatorySkills.length > 0 && (
                    <Badge variant="danger" size="xs">
                      {mandatorySkills.length} High-Priority Gaps
                    </Badge>
                  )}
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-600" />
                  {currentScan?.jobTitle || 'Software Engineer'}
                  {currentScan?.company && (
                    <span className="text-slate-400 font-normal text-base">
                      at {currentScan.company}
                    </span>
                  )}
                </h2>

                <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                  Tailored curriculum targeting the exact missing skills identified in this job description. Bridge these gaps using verified official documentation and hands-on practice.
                </p>
              </div>

              {/* Scan Switcher & Action */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                {scans.length > 1 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                      Switch Scan:
                    </span>
                    <select
                      value={selectedScanId}
                      onChange={(e) => handleScanChange(e.target.value)}
                      className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {scans.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.jobTitle} {s.company ? `(${s.company})` : ''} - {s.matchPercentage}%
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  icon={ArrowRight}
                  onClick={() => navigate('/job-matcher')}
                >
                  Analyze New Job
                </Button>
              </div>
            </div>

            {/* Overall Roadmap Progress Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Roadmap Progress
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-xl font-bold text-slate-900 font-mono">
                      {overallProgressPercent}%
                    </span>
                    <span className="text-[11px] text-slate-500">
                      ({completedCount}/{totalSkills} done)
                    </span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                    In Progress
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xl font-bold text-amber-600 font-mono">
                      {inProgressCount}
                    </span>
                    <span className="text-[11px] text-slate-500">skills active</span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Completed
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xl font-bold text-emerald-600 font-mono">
                      {completedCount}
                    </span>
                    <span className="text-[11px] text-slate-500">skills mastered</span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Mandatory Gaps
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xl font-bold text-rose-600 font-mono">
                      {mandatoryCompleted}/{mandatorySkills.length}
                    </span>
                    <span className="text-[11px] text-slate-500">cleared</span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Visual Overall Progress Bar */}
            <div className="pt-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span>Overall Curriculum Completion</span>
                  {overallProgressPercent === 100 && (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> All Missing Skills Completed!
                    </span>
                  )}
                </span>
                <span className="font-mono text-indigo-600">{overallProgressPercent}%</span>
              </div>
              <ProgressBar
                value={overallProgressPercent}
                color={overallProgressPercent >= 80 ? 'emerald' : overallProgressPercent >= 40 ? 'indigo' : 'amber'}
                size="md"
              />
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search missing skills, categories, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Priority filter */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-400 font-medium">Priority:</span>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="HIGH">High Priority (Mandatory)</option>
                  <option value="MEDIUM">Medium Priority (Preferred)</option>
                </select>
              </div>

              {/* Status filter */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-400 font-medium">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {(searchQuery || priorityFilter !== 'ALL' || statusFilter !== 'ALL') && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => {
                    setSearchQuery('');
                    setPriorityFilter('ALL');
                    setStatusFilter('ALL');
                  }}
                >
                  Reset Filters
                </Button>
              )}
            </div>
          </div>

          {/* Missing Skills Roadmap List */}
          {filteredSkills.length > 0 ? (
            <div className="space-y-4">
              {filteredSkills.map((item, idx) => {
                const isHighPriority = item.priority === 'High';
                const isCompleted = item.status === 'completed';
                const isInProgress = item.status === 'in_progress';

                return (
                  <Card
                    key={`${item.skillName}-${idx}`}
                    className={`overflow-hidden transition-all duration-200 ${
                      isCompleted
                        ? 'border-emerald-200/80 bg-emerald-50/10'
                        : isInProgress
                        ? 'border-indigo-200 shadow-2xs'
                        : 'border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    {/* Top Row: Skill Name, Priority, Category, and Status Badge */}
                    <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                            {item.skillName}
                          </span>

                          <Badge variant="outline" size="xs">
                            {item.category}
                          </Badge>

                          {/* Priority Level Badge */}
                          {isHighPriority ? (
                            <Badge variant="danger" size="xs" icon={AlertCircle}>
                              High Priority • Mandatory
                            </Badge>
                          ) : (
                            <Badge variant="warning" size="xs" icon={Target}>
                              Medium Priority • Preferred
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Learning Status Indicator */}
                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Completed
                          </span>
                        ) : isInProgress ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                            In Progress
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            Not Started
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Middle: Why it matters for target job + Learning Resources */}
                    <div className="p-5 sm:p-6 space-y-4">
                      {/* Why the skill matters for the target job */}
                      <div className="bg-slate-50/90 rounded-xl p-4 border border-slate-200/70 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Why this skill matters for {currentScan?.jobTitle || 'this target role'}:</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {item.whyMatters}
                        </p>
                      </div>

                      {/* Suggested Learning Resources */}
                      <div className="space-y-2.5 pt-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                            Suggested Learning Resources
                          </h4>
                          {item.hasPredefinedResources && (
                            <span className="text-[11px] text-slate-400">
                              Verified Official Documentation
                            </span>
                          )}
                        </div>

                        {/* CASE A: Predefined Verified Resources Available */}
                        {item.hasPredefinedResources && item.resources && item.resources.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {item.resources.map((res, rIdx) => (
                              <div
                                key={rIdx}
                                className="p-3.5 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors shadow-2xs flex flex-col justify-between gap-2.5"
                              >
                                <div>
                                  <div className="flex items-center justify-between gap-2 mb-1">
                                    <span className="text-xs font-bold text-slate-900 line-clamp-1">
                                      {res.name}
                                    </span>
                                    <Badge variant="purple" size="xs">
                                      {res.type}
                                    </Badge>
                                  </div>
                                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                                    {res.description}
                                  </p>
                                </div>

                                <div>
                                  <a
                                    href={res.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline pt-1"
                                  >
                                    <span>Open Recommended Resource</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          /* CASE B: Sensible Generic Learning Recommendation (NO invented URLs!) */
                          <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-200/70 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Info className="w-4 h-4 text-amber-600" />
                                <span className="text-xs font-bold text-amber-900">
                                  Sensible Learning Recommendation
                                </span>
                              </div>
                              <span className="text-[10px] text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded font-medium">
                                Niche/Specialized Skill
                              </span>
                            </div>

                            <p className="text-xs text-amber-900/80 leading-relaxed">
                              No predefined vendor link mapped for this specialized requirement. Follow this structured self-directed learning approach:
                            </p>

                            <div className="space-y-2">
                              {item.genericRecommendation?.steps?.map((step, sIdx) => (
                                <div key={sIdx} className="flex items-start gap-2 text-xs text-slate-700">
                                  <span className="w-4 h-4 rounded-full bg-amber-200/70 text-amber-900 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                                    {sIdx + 1}
                                  </span>
                                  <div>
                                    <strong className="text-slate-800">{step.title}:</strong>{' '}
                                    <span className="text-slate-600">{step.guidance}</span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {item.genericRecommendation?.suggestedTopics && (
                              <div className="pt-2 border-t border-amber-200/50 flex flex-wrap items-center gap-1.5">
                                <span className="text-[11px] font-semibold text-amber-900">
                                  Recommended Search Topics:
                                </span>
                                {item.genericRecommendation.suggestedTopics.map((topic, tIdx) => (
                                  <span
                                    key={tIdx}
                                    className="text-[11px] bg-white border border-amber-200 text-slate-700 px-2 py-0.5 rounded font-mono shadow-2xs"
                                  >
                                    "{topic}"
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Bottom Controls: User Action Buttons for Learning Status */}
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        <div className="text-xs text-slate-500">
                          {isCompleted ? (
                            <span className="text-emerald-700 font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Added to your profile skills • Live match updated
                            </span>
                          ) : isInProgress ? (
                            <span className="text-amber-700 font-medium flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              Currently studying • Review resources and practice projects
                            </span>
                          ) : (
                            <span>Set your progress as you complete study material.</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Not Started: Show Mark In Progress & Mark Completed */}
                          {!isInProgress && !isCompleted && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                icon={Clock}
                                onClick={() => handleSetStatus(item, 'in_progress')}
                              >
                                Mark In Progress
                              </Button>
                              <Button
                                variant="primary"
                                size="sm"
                                icon={CheckCircle2}
                                onClick={() => handleSetStatus(item, 'completed')}
                              >
                                Mark as Completed
                              </Button>
                            </>
                          )}

                          {/* In Progress: Show Mark Completed and Revert */}
                          {isInProgress && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSetStatus(item, 'not_started')}
                              >
                                Reset to Not Started
                              </Button>
                              <Button
                                variant="primary"
                                size="sm"
                                icon={CheckCircle2}
                                onClick={() => handleSetStatus(item, 'completed')}
                              >
                                Mark as Completed
                              </Button>
                            </>
                          )}

                          {/* Completed: Option to Revert or Review */}
                          {isCompleted && (
                            <Button
                              variant="ghost"
                              size="xs"
                              icon={RotateCcw}
                              onClick={() => handleSetStatus(item, 'in_progress')}
                            >
                              Reopen / Mark In Progress
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-8 text-center bg-white space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {totalSkills === 0
                  ? 'All Skills Covered for this Role!'
                  : 'No skills match the selected filter'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                {totalSkills === 0
                  ? `Your profile already satisfies all technical requirements detected in ${currentScan?.jobTitle || 'the job description'}.`
                  : 'Try resetting your search query or priority filters to see all roadmap recommendations.'}
              </p>
              {totalSkills > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setPriorityFilter('ALL');
                    setStatusFilter('ALL');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </Card>
          )}
        </>
      )}

      {/* ============================================================ */}
      {/* MODE 2: CURATED TECH TRACK DEEP DIVES (PRESET TRACKS) */}
      {/* ============================================================ */}
      {activeTab === 'CURATED_TRACKS' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                Comprehensive Curricula
              </span>
              <Badge variant="outline" size="xs">
                SDE-1 & Fresher Tracks
              </Badge>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Curated Multi-Week Engineering Deep Dives
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Full step-by-step tracks with modular phases, core concept syllabi, and resume mini-projects.
            </p>
          </div>

          {/* Curated Track Selector Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {roadmaps.map((track) => {
              const isSelected = selectedCuratedId === track.id;
              const trackTasks = track.modules.flatMap((m) => m.checklist);
              const trackCompleted = trackTasks.filter((t) => completedTasks[t.id]).length;
              const trackPercent = trackTasks.length > 0 ? Math.round((trackCompleted / trackTasks.length) * 100) : 0;

              return (
                <button
                  key={track.id}
                  onClick={() => setSelectedCuratedId(track.id)}
                  className={`p-3.5 rounded-xl border text-left min-w-[240px] max-w-[280px] transition-all flex-shrink-0 ${
                    isSelected
                      ? 'bg-white border-indigo-500 shadow-xs ring-1 ring-indigo-500'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase font-semibold text-slate-400">
                      {track.duration}
                    </span>
                    <span className="text-xs font-semibold text-indigo-600 font-mono">
                      {trackPercent}%
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {track.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {track.targetSkill}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Curated Roadmap Detail */}
          {activeCuratedRoadmap && (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="primary" size="xs">
                        {activeCuratedRoadmap.category}
                      </Badge>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">{activeCuratedRoadmap.duration}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <Badge variant="outline" size="xs">{activeCuratedRoadmap.difficulty}</Badge>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {activeCuratedRoadmap.title}
                    </h3>
                    <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                      <strong className="text-slate-800">Why Essential:</strong> {activeCuratedRoadmap.whyEssential}
                    </p>
                  </div>

                  <div className="min-w-[140px] text-right">
                    <span className="text-2xl font-bold text-slate-900 block font-mono">
                      {completedCuratedCount}/{allCuratedChecklist.length}
                    </span>
                    <span className="text-[11px] text-slate-500 block mb-1">Checklist Items Done</span>
                    <ProgressBar value={curatedProgressPercent} color="indigo" size="sm" />
                  </div>
                </div>
              </Card>

              {/* Modules List */}
              <div className="space-y-6">
                {activeCuratedRoadmap.modules.map((module, mIdx) => (
                  <Card key={module.id} className="overflow-hidden">
                    <div className="p-5 sm:p-6 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center flex-shrink-0 border border-indigo-100">
                          {mIdx + 1}
                        </span>
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                            {module.phase}
                          </span>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900">
                            {module.title}
                          </h4>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 space-y-5">
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {module.summary}
                      </p>

                      {/* Core Topics */}
                      <div>
                        <h5 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
                          Core Concept Syllabus
                        </h5>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {module.topics.map((t, i) => (
                            <li key={i} className="text-xs text-slate-600 flex items-start gap-2 bg-slate-50/70 p-2 rounded-md border border-slate-100">
                              <span className="text-indigo-500 font-bold">•</span>
                              <span>{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Free Verified Resources */}
                      <div>
                        <h5 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                          Free Verified Study Links
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {module.resources.map((res, rIdx) => (
                            <a
                              key={rIdx}
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-indigo-300 hover:text-indigo-700 text-xs font-medium text-slate-700 transition-colors shadow-2xs"
                            >
                              <span>{res.name}</span>
                              <span className="text-[10px] text-slate-400 font-normal">({res.type})</span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* Mini Resume Practice Project */}
                      {module.practiceProject && (
                        <div className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-100/80 space-y-1.5">
                          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900">
                            <Code2 className="w-4 h-4 text-indigo-600" />
                            <span>Resume Mini-Project Exercise</span>
                          </div>
                          <p className="text-xs text-indigo-800 leading-relaxed">
                            {module.practiceProject}
                          </p>
                        </div>
                      )}

                      {/* Interactive Checklist */}
                      <div className="pt-2 border-t border-slate-100">
                        <h5 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2.5">
                          Progress Checklist
                        </h5>
                        <div className="space-y-2">
                          {module.checklist.map((item) => {
                            const isDone = !!completedTasks[item.id];
                            return (
                              <label
                                key={item.id}
                                className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                                  isDone
                                    ? 'bg-emerald-50/40 border-emerald-200/80 text-emerald-900'
                                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isDone}
                                  onChange={() => toggleTaskCompletion(item.id)}
                                  className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className={isDone ? 'line-through text-slate-500' : 'font-medium'}>
                                  {item.text}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
