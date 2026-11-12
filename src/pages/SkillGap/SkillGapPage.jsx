import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  Search,
  ChevronDown,
  Briefcase,
  Layers,
  Target,
  ArrowUpRight,
  RotateCcw,
  Zap,
  Award,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Tabs } from '../../components/common/Tabs';
import { SKILL_CATEGORIES } from '../../data/skillsTaxonomy';
import { calculateSkillMatch } from '../../utils/matcherEngine';

export const SkillGapPage = () => {
  const navigate = useNavigate();
  const {
    scans,
    activeScan,
    setActiveScan,
    profile,
    learnedSkills,
    markSkillAsLearned,
    unmarkSkillAsLearned,
    isSkillLearned
  } = useApp();

  // State
  const [selectedScanId, setSelectedScanId] = useState(() => activeScan?.id || scans[0]?.id || '');
  const [activeViewTab, setActiveViewTab] = useState('ALL_SECTIONS');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackNotice, setFeedbackNotice] = useState(null);

  // Sync selectedScanId with activeScan when activeScan changes (e.g. from Job Matcher)
  React.useEffect(() => {
    if (activeScan?.id && activeScan.id !== selectedScanId) {
      setSelectedScanId(activeScan.id);
    }
  }, [activeScan?.id]);

  // Current active scan from history
  const currentScan = useMemo(() => {
    if (!scans || scans.length === 0) return null;
    const found = scans.find((s) => s.id === selectedScanId);
    return found || activeScan || scans[0] || null;
  }, [scans, selectedScanId, activeScan]);

  // Handle switching job scan
  const handleScanChange = (scanId) => {
    setSelectedScanId(scanId);
    const scan = scans.find((s) => s.id === scanId);
    if (scan) {
      setActiveScan(scan);
    }
  };

  // Re-calculate match dynamically against current profile skills using the Job Matcher engine
  // This guarantees 100% sync when skills are marked as learned or updated in profile!
  const matchData = useMemo(() => {
    if (!currentScan) return null;
    return calculateSkillMatch(profile?.skills || [], currentScan);
  }, [currentScan, profile?.skills]);

  // Extract the 3 main categories from the actual Job Matcher engine output
  const matchedSkills = useMemo(() => matchData?.matchedSkills || [], [matchData]);
  const missingMandatorySkills = useMemo(() => matchData?.missingMandatorySkills || [], [matchData]);
  const missingPreferredSkills = useMemo(() => matchData?.missingPreferredSkills || [], [matchData]);
  const allMissingSkills = useMemo(() => matchData?.missingSkills || [], [matchData]);
  const skillsToImprove = useMemo(() => matchData?.skillsToImprove || [], [matchData]);

  // Handle Mark as Learned for a Missing Skill
  const handleMarkAsLearned = (skill) => {
    markSkillAsLearned(skill, 'Intermediate', {
      fromScan: currentScan?.jobTitle || 'Job Scan'
    });
    setFeedbackNotice({
      type: 'success',
      message: `Marked "${skill.name}" as learned! Added to your profile at Intermediate level and updated match compatibility.`
    });
    setTimeout(() => setFeedbackNotice(null), 3500);
  };

  // Handle Level Upgrade for a Skill to Improve (Beginner -> Intermediate)
  const handleUpgradeProficiency = (skill) => {
    markSkillAsLearned(skill.name, 'Intermediate', {
      upgradedFrom: 'Beginner',
      fromScan: currentScan?.jobTitle || 'Job Scan'
    });
    setFeedbackNotice({
      type: 'success',
      message: `Upgraded "${skill.name}" to Intermediate proficiency! Proficiency gap resolved.`
    });
    setTimeout(() => setFeedbackNotice(null), 3500);
  };

  // Filter skills by category and search query
  const filterList = (list) => {
    return list.filter((item) => {
      const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase().trim()));
      return matchesCategory && matchesSearch;
    });
  };

  const filteredMandatoryMissing = useMemo(
    () => filterList(missingMandatorySkills),
    [missingMandatorySkills, selectedCategory, searchQuery]
  );
  const filteredPreferredMissing = useMemo(
    () => filterList(missingPreferredSkills),
    [missingPreferredSkills, selectedCategory, searchQuery]
  );
  const filteredSkillsToImprove = useMemo(
    () => filterList(skillsToImprove),
    [skillsToImprove, selectedCategory, searchQuery]
  );
  const filteredMatchedSkills = useMemo(
    () => filterList(matchedSkills),
    [matchedSkills, selectedCategory, searchQuery]
  );

  const totalGapsCount = missingMandatorySkills.length + missingPreferredSkills.length + skillsToImprove.length;
  const learnedCount = Object.keys(learnedSkills || {}).length;

  // Category Tabs definitions
  const categoryTabs = [
    { id: 'ALL', label: 'All Categories' },
    { id: SKILL_CATEGORIES.PROGRAMMING_LANGUAGES, label: 'Languages' },
    { id: SKILL_CATEGORIES.FRONTEND, label: 'Frontend' },
    { id: SKILL_CATEGORIES.BACKEND, label: 'Backend' },
    { id: SKILL_CATEGORIES.DATABASES, label: 'Databases' },
    { id: SKILL_CATEGORIES.CLOUD_DEVOPS, label: 'Cloud & DevOps' },
    { id: SKILL_CATEGORIES.CYBERSECURITY, label: 'Cybersecurity' },
    { id: SKILL_CATEGORIES.AI_ML, label: 'AI & ML' },
    { id: SKILL_CATEGORIES.TOOLS_TECH, label: 'Tools & Tech' }
  ];

  // View filter tabs
  const viewTabs = [
    { id: 'ALL_SECTIONS', label: 'All Analyses', count: totalGapsCount + matchedSkills.length },
    {
      id: 'MISSING',
      label: 'Missing Skills',
      count: allMissingSkills.length
    },
    {
      id: 'TO_IMPROVE',
      label: 'Skills to Improve',
      count: skillsToImprove.length
    },
    {
      id: 'MATCHED',
      label: 'Matched Skills',
      count: matchedSkills.length
    }
  ];

  // Helper for proficiency dots
  const renderProficiencyMeter = (level) => {
    const norm = (level || '').toLowerCase();
    const isAdvanced = norm === 'advanced';
    const isIntermediate = norm === 'intermediate';
    const isBeginner = norm === 'beginner';

    return (
      <div className="flex items-center gap-1">
        <span
          className={`w-2 h-2 rounded-full ${
            isBeginner || isIntermediate || isAdvanced ? 'bg-emerald-500' : 'bg-slate-200'
          }`}
          title="Level 1"
        />
        <span
          className={`w-2 h-2 rounded-full ${
            isIntermediate || isAdvanced ? 'bg-emerald-500' : 'bg-slate-200'
          }`}
          title="Level 2"
        />
        <span
          className={`w-2 h-2 rounded-full ${isAdvanced ? 'bg-emerald-500' : 'bg-slate-200'}`}
          title="Level 3"
        />
      </div>
    );
  };

  // If no scans exist at all
  if (!currentScan || !matchData) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center bg-white border-slate-200/80">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-4 text-indigo-600">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">No Job Match Results Available</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            The Skill Gap Analysis module evaluates your profile against actual results generated by the Job Matcher. Run your first job description scan to view detailed skill gaps.
          </p>
          <Button
            variant="primary"
            icon={Compass}
            onClick={() => navigate('/job-matcher')}
          >
            Go to Job Matcher
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header & Active Job Switcher Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/50">
                Skill Gap Analysis
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-medium text-slate-500">
                Synchronized with Job Matcher Engine
              </span>
              {learnedCount > 0 && (
                <Badge variant="success" size="xs" icon={Award}>
                  {learnedCount} Skill{learnedCount > 1 ? 's' : ''} Mastered
                </Badge>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Role Competency & Skill Gap Matrix
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Real-time analysis comparing your technical profile against the requirements for{' '}
              <strong className="text-slate-800">{currentScan.jobTitle}</strong>
              {currentScan.company ? ` at ${currentScan.company}` : ''}.
            </p>
          </div>

          {/* Job Scan Selector Dropdown & Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {scans.length > 1 && (
              <div className="relative min-w-[220px]">
                <label htmlFor="scan-selector" className="sr-only">Select Analyzed Job</label>
                <select
                  id="scan-selector"
                  value={selectedScanId}
                  onChange={(e) => handleScanChange(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                >
                  {scans.map((scan) => (
                    <option key={scan.id} value={scan.id}>
                      {scan.jobTitle} {scan.company ? `(${scan.company})` : ''} — {scan.matchPercentage}% Match
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              icon={RotateCcw}
              onClick={() => navigate('/job-matcher')}
              title="Perform a new job analysis in the Job Matcher"
            >
              Scan New Job
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={Compass}
              onClick={() => navigate('/roadmap')}
            >
              Learning Roadmaps
            </Button>
          </div>
        </div>

        {/* Dynamic Match & Priority Metrics Bar */}
        <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-50/70 rounded-lg p-3 border border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Overall Match</span>
              <span className="font-bold text-slate-900">{matchData.matchPercentage}%</span>
            </div>
            <ProgressBar
              value={matchData.matchPercentage}
              color="auto"
              size="sm"
            />
          </div>

          <div className="bg-rose-50/50 rounded-lg p-3 border border-rose-100/70">
            <div className="flex items-center justify-between text-xs text-rose-800 mb-0.5">
              <span className="font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                High Priority
              </span>
              <span className="font-bold text-rose-900">{missingMandatorySkills.length}</span>
            </div>
            <p className="text-[11px] text-rose-700/80">Mandatory missing</p>
          </div>

          <div className="bg-amber-50/50 rounded-lg p-3 border border-amber-100/70">
            <div className="flex items-center justify-between text-xs text-amber-800 mb-0.5">
              <span className="font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Medium Priority
              </span>
              <span className="font-bold text-amber-900">{missingPreferredSkills.length}</span>
            </div>
            <p className="text-[11px] text-amber-700/80">Preferred missing</p>
          </div>

          <div className="bg-indigo-50/50 rounded-lg p-3 border border-indigo-100/70">
            <div className="flex items-center justify-between text-xs text-indigo-800 mb-0.5">
              <span className="font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                Low Priority
              </span>
              <span className="font-bold text-indigo-900">{skillsToImprove.length}</span>
            </div>
            <p className="text-[11px] text-indigo-700/80">Beginner skills to improve</p>
          </div>
        </div>
      </div>

      {/* Dynamic Feedback Notice Toast */}
      {feedbackNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800 shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{feedbackNotice.message}</span>
          </div>
          <button
            onClick={() => setFeedbackNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 font-semibold text-xs ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Actionable "Your Next Steps" Focus Plan Section */}
      <Card className="p-5 sm:p-6 bg-gradient-to-br from-white to-slate-50/60 border-slate-200/80">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Your Next Steps & Focus Strategy
              </h2>
              <p className="text-xs text-slate-500">
                Actionable plan generated from your job match analysis
              </p>
            </div>
          </div>
          <Badge variant="primary" size="xs">
            Priority-Ranked
          </Badge>
        </div>

        <div className="space-y-3 mt-4">
          {/* Step 1: Mandatory Missing */}
          {missingMandatorySkills.length > 0 ? (
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-rose-200/70 shadow-2xs">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </span>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-rose-900">
                    Immediate Focus: Address {missingMandatorySkills.length} High Priority Mandatory Skill{missingMandatorySkills.length > 1 ? 's' : ''}
                  </span>
                  <Badge variant="danger" size="xs">High Priority</Badge>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Screening algorithms and technical recruiters treat these as dealbreakers:{' '}
                  <strong className="text-slate-800">
                    {missingMandatorySkills.slice(0, 3).map((s) => s.name).join(', ')}
                    {missingMandatorySkills.length > 3 ? ` and ${missingMandatorySkills.length - 3} more` : ''}
                  </strong>
                  . Focus your initial roadmap study here before submitting applications.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-emerald-200/70 shadow-2xs">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                ✓
              </span>
              <div className="space-y-0.5 text-xs">
                <span className="font-semibold text-emerald-900">
                  Mandatory Requirements Met
                </span>
                <p className="text-slate-600">
                  Great work! You possess all mandatory technical competencies required for this role.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Preferred Missing */}
          {missingPreferredSkills.length > 0 && (
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-amber-200/70 shadow-2xs">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </span>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-amber-900">
                    Secondary Focus: Bridge {missingPreferredSkills.length} Preferred Skill{missingPreferredSkills.length > 1 ? 's' : ''}
                  </span>
                  <Badge variant="warning" size="xs">Medium Priority</Badge>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Gain a competitive edge for interviews by learning:{' '}
                  <strong className="text-slate-800">
                    {missingPreferredSkills.slice(0, 3).map((s) => s.name).join(', ')}
                    {missingPreferredSkills.length > 3 ? ` and ${missingPreferredSkills.length - 3} more` : ''}
                  </strong>
                  . Adding these skills will differentiate your resume from other candidates.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Skills to Improve */}
          {skillsToImprove.length > 0 && (
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-indigo-200/70 shadow-2xs">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </span>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-indigo-900">
                    Proficiency Refinement: Strengthen {skillsToImprove.length} Skill{skillsToImprove.length > 1 ? 's' : ''} from Beginner Level
                  </span>
                  <Badge variant="primary" size="xs">Low Priority</Badge>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  You have listed{' '}
                  <strong className="text-slate-800">
                    {skillsToImprove.slice(0, 3).map((s) => s.name).join(', ')}
                  </strong>{' '}
                  at a Beginner level. Target engineering roles expect hands-on Intermediate problem-solving. Upgrade your proficiency by building targeted project features.
                </p>
              </div>
            </div>
          )}

          {/* When profile is 100% ready */}
          {missingMandatorySkills.length === 0 && missingPreferredSkills.length === 0 && skillsToImprove.length === 0 && (
            <div className="p-4 bg-emerald-50/80 rounded-lg border border-emerald-200 text-xs text-emerald-800 space-y-1">
              <p className="font-bold text-emerald-900 text-sm">You are fully prepared for this target role!</p>
              <p>All required technical competencies are verified at Intermediate or Advanced proficiency. Ready to generate your customized resume and schedule interviews.</p>
            </div>
          )}
        </div>
      </Card>

      {/* 3. Search and View Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Tabs
          tabs={viewTabs}
          activeTab={activeViewTab}
          onChange={setActiveViewTab}
          variant="pills"
        />

        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills..."
            className="w-full text-xs bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <Tabs
        tabs={categoryTabs}
        activeTab={selectedCategory}
        onChange={setSelectedCategory}
        variant="pills"
      />

      {/* ========================================================================= */}
      {/* CATEGORY 2: MISSING SKILLS (Mandatory: High Priority, Preferred: Medium Priority) */}
      {/* ========================================================================= */}
      {(activeViewTab === 'ALL_SECTIONS' || activeViewTab === 'MISSING') && (
        <div className="space-y-6">
          {/* 2A. Mandatory Missing Skills - High Priority */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  Missing Mandatory Skills — High Priority ({filteredMandatoryMissing.length})
                </h3>
                <Badge variant="danger" size="xs">
                  Required / Must-Have
                </Badge>
              </div>
              <span className="text-xs text-rose-700 font-medium">
                Dealbreakers for technical screening
              </span>
            </div>

            {filteredMandatoryMissing.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredMandatoryMissing.map((skill) => {
                  const learned = isSkillLearned(skill.name);
                  return (
                    <Card
                      key={skill.name}
                      className="p-4 border-rose-200/80 bg-white hover:border-rose-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-slate-900">
                              {skill.name}
                            </h4>
                            <Badge variant="danger" size="xs">
                              High Priority
                            </Badge>
                            <Badge variant="outline" size="xs">
                              Mandatory
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500">{skill.category}</p>
                        </div>
                        <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/60 flex-shrink-0">
                          Critical Gap
                        </span>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Est. Time: <strong>1 - 2 Weeks</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
                          <span>Hiring Impact: <strong>Crucial</strong></span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                        <Button
                          variant={learned ? 'secondary' : 'outline'}
                          size="xs"
                          icon={learned ? Check : Plus}
                          onClick={() => handleMarkAsLearned(skill)}
                          title="Mark as learned and add to your technical profile"
                        >
                          {learned ? 'Learned (Update)' : 'Mark as Learned'}
                        </Button>

                        <Button
                          variant="ghost"
                          size="xs"
                          icon={Compass}
                          onClick={() => navigate('/roadmap')}
                        >
                          View Study Roadmap
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="p-5 text-center text-slate-500 bg-white">
                <p className="text-xs">
                  {missingMandatorySkills.length === 0
                    ? 'No mandatory technical skills missing for this role! All core prerequisites met.'
                    : 'No mandatory missing skills match the selected filter category.'}
                </p>
              </Card>
            )}
          </div>

          {/* 2B. Preferred Missing Skills - Medium Priority */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  Missing Preferred Skills — Medium Priority ({filteredPreferredMissing.length})
                </h3>
                <Badge variant="warning" size="xs">
                  Preferred / Bonus
                </Badge>
              </div>
              <span className="text-xs text-amber-800 font-medium">
                Differentiators that increase interview conversion
              </span>
            </div>

            {filteredPreferredMissing.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredPreferredMissing.map((skill) => {
                  const learned = isSkillLearned(skill.name);
                  return (
                    <Card
                      key={skill.name}
                      className="p-4 border-amber-200/80 bg-white hover:border-amber-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-slate-900">
                              {skill.name}
                            </h4>
                            <Badge variant="warning" size="xs">
                              Medium Priority
                            </Badge>
                            <Badge variant="outline" size="xs">
                              Preferred
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500">{skill.category}</p>
                        </div>
                        <span className="text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 flex-shrink-0">
                          Recommended
                        </span>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Est. Time: <strong>1 Week</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>Interview Edge: <strong>+15%</strong></span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                        <Button
                          variant={learned ? 'secondary' : 'outline'}
                          size="xs"
                          icon={learned ? Check : Plus}
                          onClick={() => handleMarkAsLearned(skill)}
                          title="Mark as learned and add to your technical profile"
                        >
                          {learned ? 'Learned (Update)' : 'Mark as Learned'}
                        </Button>

                        <Button
                          variant="ghost"
                          size="xs"
                          icon={Compass}
                          onClick={() => navigate('/roadmap')}
                        >
                          View Study Roadmap
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="p-5 text-center text-slate-500 bg-white">
                <p className="text-xs">
                  {missingPreferredSkills.length === 0
                    ? 'No preferred technical skills missing for this role.'
                    : 'No preferred missing skills match the selected filter category.'}
                </p>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CATEGORY 3: SKILLS TO IMPROVE (Low Priority) */}
      {/* Skills the user already possesses but marked as Beginner */}
      {/* ========================================================================= */}
      {(activeViewTab === 'ALL_SECTIONS' || activeViewTab === 'TO_IMPROVE') && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900">
                Skills to Improve — Low Priority ({filteredSkillsToImprove.length})
              </h3>
              <Badge variant="primary" size="xs">
                Proficiency Gap
              </Badge>
            </div>
            <span className="text-xs text-indigo-700 font-medium">
              Possessed in profile, but role expects stronger proficiency
            </span>
          </div>

          {filteredSkillsToImprove.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredSkillsToImprove.map((skill) => (
                <Card
                  key={skill.name}
                  className="p-4 border-indigo-200/80 bg-white hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900">
                          {skill.name}
                        </h4>
                        <Badge variant="primary" size="xs">
                          Low Priority
                        </Badge>
                        <Badge variant="default" size="xs">
                          In Profile
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500">{skill.category}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/60 block">
                        Level Up Needed
                      </span>
                    </div>
                  </div>

                  {/* Level comparison indicator */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 bg-slate-50/80 rounded-lg p-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Current Level</span>
                      <span className="font-semibold text-slate-700">Beginner</span>
                    </div>

                    <ArrowRight className="w-4 h-4 text-indigo-400" />

                    <div className="text-right">
                      <span className="text-slate-400 text-[11px] block">Expected Level</span>
                      <span className="font-semibold text-indigo-700">Intermediate+</span>
                    </div>
                  </div>

                  <p className="mt-2 text-[11px] text-slate-500 leading-relaxed">
                    Role expects hands-on project problem solving rather than introductory syntax knowledge.
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Button
                      variant="primary"
                      size="xs"
                      icon={Award}
                      onClick={() => handleUpgradeProficiency(skill)}
                      title="Upgrade this skill to Intermediate in your profile"
                    >
                      Upgrade to Intermediate
                    </Button>

                    <Button
                      variant="ghost"
                      size="xs"
                      icon={Compass}
                      onClick={() => navigate('/roadmap')}
                    >
                      Practice Exercises
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-5 text-center text-slate-500 bg-white">
              <p className="text-xs">
                {skillsToImprove.length === 0
                  ? 'None of your matched skills are at Beginner level. All matched competencies have sufficient proficiency!'
                  : 'No skills to improve match the selected filter category.'}
              </p>
            </Card>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* CATEGORY 1: MATCHED SKILLS */}
      {/* Skills the user already possesses and their proficiency levels */}
      {/* ========================================================================= */}
      {(activeViewTab === 'ALL_SECTIONS' || activeViewTab === 'MATCHED') && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900">
                Matched Skills ({filteredMatchedSkills.length})
              </h3>
              <Badge variant="success" size="xs">
                Verified in Profile
              </Badge>
            </div>
            <span className="text-xs text-emerald-700 font-medium">
              Technical competencies you already possess
            </span>
          </div>

          {filteredMatchedSkills.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredMatchedSkills.map((skill) => {
                const level = skill.userLevel || 'Intermediate';
                const isMandatory = skill.requirementType === 'Mandatory';
                const isLearnedNow = isSkillLearned(skill.name);

                return (
                  <Card
                    key={skill.name}
                    className="p-3.5 border-emerald-200/70 bg-white hover:border-emerald-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900">
                            {skill.name}
                          </h4>
                          {isLearnedNow && (
                            <Badge variant="purple" size="xs">
                              Learned
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">{skill.category}</p>
                      </div>

                      <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px] font-semibold border border-emerald-200/50">
                        <Check className="w-3 h-3" />
                        <span>Matched</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <span className="text-[11px] text-slate-400 block">Proficiency Level</span>
                        <div className="flex items-center gap-1.5">
                          {renderProficiencyMeter(level)}
                          <span className="font-semibold text-slate-700 text-xs">{level}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block">Requirement</span>
                        <Badge
                          variant={isMandatory ? 'danger' : 'warning'}
                          size="xs"
                        >
                          {isMandatory ? 'Mandatory' : 'Preferred'}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-5 text-center text-slate-500 bg-white">
              <p className="text-xs">
                {matchedSkills.length === 0
                  ? 'No skills matched yet. Add technical skills to your profile to match against target roles.'
                  : 'No matched skills found in this filter category.'}
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
