import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookmarkCheck,
  Sparkles,
  Building,
  MapPin,
  Trash2,
  FileText,
  Calendar,
  Search,
  CheckCircle2,
  AlertCircle,
  GitCompare,
  TrendingUp,
  Briefcase,
  ShieldAlert,
  Percent,
  Copy,
  Check,
  Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Tabs } from '../../components/common/Tabs';
import { ProgressBar } from '../../components/common/ProgressBar';
import { EmptyState } from '../../components/common/EmptyState';

export const SavedJobsPage = () => {
  const navigate = useNavigate();
  const { scans, deleteScan, clearAllScans, setActiveScan } = useApp();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'HIGH' | 'MODERATE' | 'LOW'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'highest_score' | 'lowest_score' | 'title'

  // Selection & Comparison State
  const [selectedScanIds, setSelectedScanIds] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Modals State
  const [selectedReportScan, setSelectedReportScan] = useState(null);
  const [selectedJdScan, setSelectedJdScan] = useState(null);
  const [copiedJd, setCopiedJd] = useState(false);

  // Filter scans based on search query and fit level
  const filteredScans = useMemo(() => {
    return scans.filter((scan) => {
      // Search matching
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        scan.jobTitle?.toLowerCase().includes(query) ||
        scan.company?.toLowerCase().includes(query) ||
        scan.location?.toLowerCase().includes(query) ||
        (scan.matchedSkills || []).some((s) => s.name?.toLowerCase().includes(query)) ||
        (scan.missingSkills || []).some((s) => s.name?.toLowerCase().includes(query));

      // Category filter matching
      let matchesCategory = true;
      if (activeFilter === 'HIGH') {
        matchesCategory = (scan.matchPercentage || 0) >= 70;
      } else if (activeFilter === 'MODERATE') {
        matchesCategory = (scan.matchPercentage || 0) >= 40 && (scan.matchPercentage || 0) < 70;
      } else if (activeFilter === 'LOW') {
        matchesCategory = (scan.matchPercentage || 0) < 40;
      }

      return matchesQuery && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'highest_score') return (b.matchPercentage || 0) - (a.matchPercentage || 0);
      if (sortBy === 'lowest_score') return (a.matchPercentage || 0) - (b.matchPercentage || 0);
      if (sortBy === 'title') return (a.jobTitle || '').localeCompare(b.jobTitle || '');
      // default 'newest'
      return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
    });
  }, [scans, searchQuery, activeFilter, sortBy]);

  // Compatibility score statistics
  const avgScore = useMemo(() => {
    if (scans.length === 0) return 0;
    return Math.round(scans.reduce((sum, s) => sum + (s.matchPercentage || 0), 0) / scans.length);
  }, [scans]);

  const bestMatch = useMemo(() => {
    if (scans.length === 0) return null;
    return [...scans].sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0))[0];
  }, [scans]);

  // Multi-select for comparison
  const handleToggleSelect = (scanId) => {
    setSelectedScanIds((prev) => {
      if (prev.includes(scanId)) {
        return prev.filter((id) => id !== scanId);
      }
      if (prev.length >= 3) {
        // limit to 3 roles max for side-by-side comparison
        return [...prev.slice(1), scanId];
      }
      return [...prev, scanId];
    });
  };

  // Reopen analysis in Job Matcher
  const handleReopenAnalysis = (scan) => {
    setActiveScan(scan);
    navigate('/job-matcher');
  };

  // Open Resume Builder for this specific job
  const handleOpenResumeBuilder = (scan) => {
    setActiveScan(scan);
    navigate('/resume');
  };

  // Delete single scan
  const handleDeleteScan = (scan) => {
    if (window.confirm(`Delete saved analysis for "${scan.jobTitle}${scan.company ? ' at ' + scan.company : ''}"? This action cannot be undone.`)) {
      deleteScan(scan.id);
      setSelectedScanIds((prev) => prev.filter((id) => id !== scan.id));
      if (selectedReportScan?.id === scan.id) setSelectedReportScan(null);
      if (selectedJdScan?.id === scan.id) setSelectedJdScan(null);
    }
  };

  // Clear all scans
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete ALL saved job analyses? This will clear your saved history.')) {
      clearAllScans();
      setSelectedScanIds([]);
      setSelectedReportScan(null);
      setSelectedJdScan(null);
    }
  };

  // Copy full JD text
  const handleCopyJd = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedJd(true);
    setTimeout(() => setCopiedJd(false), 2000);
  };

  // Comparison candidates
  const comparisonScans = useMemo(() => {
    return scans.filter((s) => selectedScanIds.includes(s.id));
  }, [scans, selectedScanIds]);

  // Tab definitions
  const filterTabs = [
    { id: 'ALL', label: 'All Analyses', count: scans.length },
    { id: 'HIGH', label: 'High Fit (≥70%)', count: scans.filter((s) => (s.matchPercentage || 0) >= 70).length },
    { id: 'MODERATE', label: 'Moderate Fit (40-69%)', count: scans.filter((s) => (s.matchPercentage || 0) >= 40 && (s.matchPercentage || 0) < 70).length },
    { id: 'LOW', label: 'Needs Prep (<40%)', count: scans.filter((s) => (s.matchPercentage || 0) < 40).length }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                Job Applications & Scans
              </span>
              <span className="text-xs text-slate-400 font-mono">Persisted in LocalStorage</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Saved Job Analyses & Match Reports
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Review previously analyzed job descriptions, inspect full match breakdowns, compare compatibility scores across target companies, and reopen any analysis to tailor your ATS resume.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {scans.length >= 2 && (
              <Button
                variant={selectedScanIds.length >= 2 ? 'primary' : 'outline'}
                size="sm"
                icon={GitCompare}
                onClick={() => {
                  if (selectedScanIds.length < 2) {
                    // Preselect top 2 if none selected
                    setSelectedScanIds(scans.slice(0, 2).map((s) => s.id));
                  }
                  setIsCompareModalOpen(true);
                }}
              >
                {selectedScanIds.length >= 2 ? `Compare Selected (${selectedScanIds.length})` : 'Compare Roles'}
              </Button>
            )}

            <Button
              variant="primary"
              size="sm"
              icon={Sparkles}
              onClick={() => navigate('/job-matcher')}
            >
              Analyze New Job
            </Button>
          </div>
        </div>

        {/* Quick Highlights Summary Bar if scans exist */}
        {scans.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-slate-100">
            <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200/60">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                Total Saved Scans
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-bold text-slate-900">{scans.length}</span>
                <span className="text-xs text-slate-500">analyzed</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200/60">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                Average Compatibility
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className={`text-xl font-bold ${
                  avgScore >= 70 ? 'text-emerald-600' : avgScore >= 40 ? 'text-amber-600' : 'text-rose-600'
                }`}>
                  {avgScore}%
                </span>
                <span className="text-xs text-slate-500">overall fit</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200/60">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                Top Compatible Role
              </span>
              <div className="truncate mt-0.5">
                <span className="text-xs font-bold text-slate-800 truncate block">
                  {bestMatch?.jobTitle || 'None'}
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold">
                  {bestMatch?.matchPercentage || 0}% Match
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">
                  Comparison Tool
                </span>
                <span className="text-xs text-slate-600 font-medium">
                  {selectedScanIds.length} of 3 selected
                </span>
              </div>
              {selectedScanIds.length > 0 && (
                <button
                  onClick={() => setSelectedScanIds([])}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Visual Compatibility Score Comparison Bar across All Saved Jobs */}
      {scans.length >= 2 && (
        <Card className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                Previous Compatibility Scores Comparison
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Side-by-side ranking of all saved job descriptions by technical alignment.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Select checkboxes below to compare side-by-side</span>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            {scans.map((scan) => {
              const isSelected = selectedScanIds.includes(scan.id);
              const score = scan.matchPercentage || 0;
              const barColor = score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-500' : 'bg-rose-500';

              return (
                <div
                  key={scan.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-indigo-50/60 border-indigo-200'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(scan.id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                        title="Select for comparison"
                      />
                      <div className="truncate">
                        <span className="text-xs font-bold text-slate-900 truncate block">
                          {scan.jobTitle}
                        </span>
                        <span className="text-[11px] text-slate-500 truncate block">
                          {scan.company || 'Direct Hiring'} • {scan.jobType || 'Full-time'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 sm:w-64">
                      <div className="w-full">
                        <div className="flex justify-between text-[11px] font-mono mb-1">
                          <span className="text-slate-500">
                            {scan.matchedSkills?.length || 0} / {scan.totalRequired || 0} skills
                          </span>
                          <span className={`font-bold ${
                            score >= 70 ? 'text-emerald-600' : score >= 40 ? 'text-amber-600' : 'text-rose-600'
                          }`}>
                            {score}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>

                      <Badge
                        variant={score >= 70 ? 'success' : score >= 40 ? 'warning' : 'danger'}
                        size="xs"
                        className="whitespace-nowrap"
                      >
                        {scan.readiness?.badge || `${score}%`}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Main Scans Listing & Empty State */}
      {scans.length > 0 ? (
        <div className="space-y-4">
          {/* Controls Bar: Filters, Search, Sort & Clear */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <Tabs
              tabs={filterTabs}
              activeTab={activeFilter}
              onChange={setActiveFilter}
              variant="pills"
            />

            <div className="flex items-center gap-2.5">
              <div className="w-full sm:w-64">
                <Input
                  icon={Search}
                  placeholder="Search role, company, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs rounded-lg border border-slate-200 bg-white px-3 py-2 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 shrink-0"
                title="Sort order"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="highest_score">Sort: Highest Match</option>
                <option value="lowest_score">Sort: Lowest Match</option>
                <option value="title">Sort: Job Title (A-Z)</option>
              </select>

              <Button
                variant="ghost"
                size="sm"
                icon={Trash2}
                onClick={handleClearAll}
                className="text-slate-400 hover:text-rose-600 shrink-0"
                title="Delete all saved analyses"
              >
                Clear All
              </Button>
            </div>
          </div>

          {/* Selection Banner if multiple checked */}
          {selectedScanIds.length > 0 && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-indigo-900">
                {selectedScanIds.length} role{selectedScanIds.length === 1 ? '' : 's'} selected for comparison
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setSelectedScanIds([])}
                >
                  Deselect All
                </Button>
                <Button
                  variant="primary"
                  size="xs"
                  icon={GitCompare}
                  disabled={selectedScanIds.length < 2}
                  onClick={() => setIsCompareModalOpen(true)}
                >
                  Compare ({selectedScanIds.length})
                </Button>
              </div>
            </div>
          )}

          {/* Cards Grid */}
          {filteredScans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredScans.map((scan) => {
                const isSelected = selectedScanIds.includes(scan.id);
                const score = scan.matchPercentage || 0;
                const scoreBadgeVariant = score >= 70 ? 'success' : score >= 40 ? 'warning' : 'danger';

                return (
                  <Card
                    key={scan.id}
                    className={`flex flex-col justify-between transition-all duration-150 ${
                      isSelected ? 'ring-2 ring-indigo-500/80 shadow-md' : 'hover:border-slate-300'
                    }`}
                  >
                    <div>
                      {/* Card Header with Checkbox and Score */}
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelect(scan.id)}
                              className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                              title="Select for comparison"
                            />
                            <div className="min-w-0">
                              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 truncate">
                                <Building className="w-3 h-3 shrink-0" />
                                {scan.company || 'Direct Hiring'}
                              </span>
                              <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mt-0.5">
                                {scan.jobTitle}
                              </h3>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <Badge variant={scoreBadgeVariant} size="sm">
                              {score}% Fit
                            </Badge>
                          </div>
                        </div>

                        {/* Location, Type & Date */}
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 pt-2">
                          {scan.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {scan.location}
                            </span>
                          )}
                          <span className="text-slate-300">•</span>
                          <span>{scan.jobType || 'Full-time'}</span>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {scan.date ? new Date(scan.date).toLocaleDateString() : 'Recently'}
                          </span>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3 pt-1">
                        {/* Match Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-600 font-medium">Skills Alignment</span>
                            <span className="font-semibold text-slate-800">
                              {scan.matchedSkills?.length || 0} of {scan.totalRequired || 0} Required
                            </span>
                          </div>
                          <ProgressBar value={score} color="auto" size="sm" />
                        </div>

                        {/* Matched Skills Chips */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-semibold uppercase text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Matched Skills ({scan.matchedSkills?.length || 0})
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {(scan.matchedSkills || []).slice(0, 4).map((skill) => (
                              <span
                                key={skill.id || skill.name}
                                className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200/70 rounded font-medium"
                              >
                                {skill.name}
                              </span>
                            ))}
                            {(scan.matchedSkills || []).length > 4 && (
                              <span className="text-[10px] px-1.5 py-0.5 text-emerald-700 font-medium">
                                +{scan.matchedSkills.length - 4} more
                              </span>
                            )}
                            {(scan.matchedSkills || []).length === 0 && (
                              <span className="text-[11px] text-slate-400 italic">No skills matched</span>
                            )}
                          </div>
                        </div>

                        {/* Missing Skills Gaps */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-semibold uppercase text-rose-800 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-rose-600" />
                            Missing Gaps ({scan.missingSkills?.length || 0})
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {(scan.missingSkills || []).slice(0, 3).map((skill) => (
                              <span
                                key={skill.id || skill.name}
                                className="text-[10px] px-2 py-0.5 bg-rose-50 text-rose-800 border border-rose-200/70 rounded font-medium"
                              >
                                {skill.name}
                              </span>
                            ))}
                            {(scan.missingSkills || []).length > 3 && (
                              <span className="text-[10px] px-1.5 py-0.5 text-rose-700 font-medium">
                                +{scan.missingSkills.length - 3} more
                              </span>
                            )}
                            {(scan.missingSkills || []).length === 0 && (
                              <span className="text-[11px] text-emerald-700 font-medium">None! Full coverage</span>
                            )}
                          </div>
                        </div>

                        {/* Job Description Snippet Preview */}
                        {scan.jobDescription && (
                          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600 space-y-1">
                            <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-semibold">
                              <span>Job Description Preview</span>
                              <button
                                onClick={() => setSelectedJdScan(scan)}
                                className="text-indigo-600 hover:text-indigo-800 normal-case font-medium flex items-center gap-0.5"
                              >
                                <Eye className="w-3 h-3" />
                                View Full JD
                              </button>
                            </div>
                            <p className="line-clamp-2 leading-relaxed">
                              {scan.jobDescription}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </div>

                    {/* Card Actions Footer */}
                    <CardFooter className="flex flex-col gap-2 pt-3 border-t border-slate-100">
                      <div className="grid grid-cols-2 gap-1.5 w-full">
                        <Button
                          variant="outline"
                          size="xs"
                          icon={FileText}
                          onClick={() => setSelectedReportScan(scan)}
                          className="w-full justify-center"
                        >
                          Match Report
                        </Button>
                        <Button
                          variant="secondary"
                          size="xs"
                          icon={Sparkles}
                          onClick={() => handleReopenAnalysis(scan)}
                          className="w-full justify-center"
                        >
                          Reopen Analysis
                        </Button>
                      </div>

                      <div className="flex items-center justify-between w-full pt-1">
                        <Button
                          variant="ghost"
                          size="xs"
                          icon={Briefcase}
                          onClick={() => handleOpenResumeBuilder(scan)}
                          className="text-indigo-600 hover:text-indigo-700 pl-0"
                        >
                          Tailor ATS Resume
                        </Button>

                        <button
                          onClick={() => handleDeleteScan(scan)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                          title="Delete saved analysis"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-10 text-center">
              <EmptyState
                icon={Search}
                title="No Matching Saved Jobs Found"
                description={`No analyzed jobs match your current search "${searchQuery}" or filter level.`}
                actionLabel="Reset Search & Filters"
                onAction={() => {
                  setSearchQuery('');
                  setActiveFilter('ALL');
                }}
              />
            </Card>
          )}
        </div>
      ) : (
        /* Empty State when no jobs analyzed yet */
        <Card className="p-12 text-center">
          <EmptyState
            icon={BookmarkCheck}
            title="No Saved Job Analyses Yet"
            description="You haven't analyzed any job descriptions yet. Paste a live campus or off-campus job posting in the Job Matcher to calculate your compatibility score, identify missing skills, and build your application pipeline."
            actionLabel="Analyze Your First Job Description"
            onAction={() => navigate('/job-matcher')}
          />
        </Card>
      )}

      {/* 1. MATCH REPORT MODAL */}
      <Modal
        isOpen={Boolean(selectedReportScan)}
        onClose={() => setSelectedReportScan(null)}
        title={selectedReportScan?.jobTitle || 'Job Match Report'}
        description={`${selectedReportScan?.company || 'Direct Hiring'} • Scanned on ${
          selectedReportScan?.date ? new Date(selectedReportScan.date).toLocaleDateString() : 'Recently'
        }`}
        maxWidth="max-w-3xl"
      >
        {selectedReportScan && (
          <div className="space-y-5">
            {/* Score & Readiness Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Deterministic Match Score
                </span>
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-3xl font-extrabold ${
                      selectedReportScan.matchPercentage >= 70
                        ? 'text-emerald-600'
                        : selectedReportScan.matchPercentage >= 40
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}
                  >
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
                <p className="text-xs text-slate-600 max-w-md pt-0.5">
                  {selectedReportScan.readiness?.description}
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0 space-y-1">
                <span className="text-[11px] text-slate-500 block">ATS Keyword Density</span>
                <span className="text-lg font-bold text-indigo-600">
                  {selectedReportScan.atsDensity || selectedReportScan.matchPercentage}%
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {selectedReportScan.matchedSkills?.length || 0} / {selectedReportScan.totalRequired || 0} skills matched
                </span>
              </div>
            </div>

            {/* Score Calculation Breakdown Explanation */}
            <div className="p-3.5 bg-indigo-50/40 rounded-xl border border-indigo-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-950 flex items-center gap-1.5 uppercase tracking-wider">
                  <Percent className="w-3.5 h-3.5 text-indigo-600" />
                  Score Calculation Method
                </span>
                <Badge variant="outline" size="xs" className="border-indigo-200 text-indigo-800">
                  {selectedReportScan.scoringMethod === 'fallback_equal_weight'
                    ? 'Fallback (Equal Weight)'
                    : 'Weighted (80% Mandatory / 20% Preferred)'}
                </Badge>
              </div>
              <p className="text-xs text-slate-700 font-mono bg-white p-2.5 rounded-lg border border-indigo-100">
                {selectedReportScan.scoreExplanation ||
                  'Score computed deterministically against technical skills present in your profile.'}
              </p>
            </div>

            {/* Matched Skills List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 pb-1 border-b border-emerald-100">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Matched Technical Skills ({selectedReportScan.matchedSkills?.length || 0})
                </span>
                <span className="text-[11px] text-emerald-700">Verified in Profile</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(selectedReportScan.matchedSkills || []).map((skill) => (
                  <span
                    key={skill.id || skill.name}
                    className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg font-medium flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{skill.name}</span>
                    {skill.requirementType && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-white text-emerald-800 font-mono">
                        {skill.requirementType}
                      </span>
                    )}
                  </span>
                ))}
                {(selectedReportScan.matchedSkills || []).length === 0 && (
                  <p className="text-xs text-slate-400 italic">No matching skills detected.</p>
                )}
              </div>
            </div>

            {/* Missing Mandatory Skills (Must Haves) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-rose-800 pb-1 border-b border-rose-100">
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  Missing Mandatory Requirements ({selectedReportScan.missingMandatorySkills?.length || 0})
                </span>
                <Badge variant="danger" size="xs">Essential Dealbreakers</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {(selectedReportScan.missingMandatorySkills || []).map((skill) => (
                  <div
                    key={skill.id || skill.name}
                    className="p-2.5 bg-rose-50/50 rounded-lg border border-rose-200/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-rose-950 block">{skill.name}</span>
                      <span className="text-[10px] text-slate-500">{skill.category}</span>
                    </div>
                    <Badge variant="outline" size="xs" className="border-rose-300 text-rose-700 bg-white">
                      Must Have
                    </Badge>
                  </div>
                ))}
                {(selectedReportScan.missingMandatorySkills || []).length === 0 && (
                  <p className="text-xs text-emerald-800 p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 col-span-2">
                    Zero missing mandatory skills! You cover all required qualifications.
                  </p>
                )}
              </div>
            </div>

            {/* Missing Preferred Skills (Good to Haves) */}
            {(selectedReportScan.missingPreferredSkills || []).length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-sky-900 pb-1 border-b border-sky-100">
                  <span>Missing Preferred Skills ({selectedReportScan.missingPreferredSkills.length})</span>
                  <Badge variant="outline" size="xs" className="border-sky-300 text-sky-700">Good To Have</Badge>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedReportScan.missingPreferredSkills.map((skill) => (
                    <span
                      key={skill.id || skill.name}
                      className="text-xs px-2.5 py-1 bg-sky-50 text-sky-900 border border-sky-200 rounded-lg font-medium"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                size="sm"
                icon={Eye}
                onClick={() => {
                  setSelectedJdScan(selectedReportScan);
                }}
              >
                View Full Job Description Text
              </Button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Sparkles}
                  onClick={() => {
                    handleReopenAnalysis(selectedReportScan);
                  }}
                  className="w-full sm:w-auto"
                >
                  Reopen in Matcher
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Briefcase}
                  onClick={() => {
                    handleOpenResumeBuilder(selectedReportScan);
                  }}
                  className="w-full sm:w-auto"
                >
                  Tailor ATS Resume
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 2. FULL JOB DESCRIPTION MODAL */}
      <Modal
        isOpen={Boolean(selectedJdScan)}
        onClose={() => setSelectedJdScan(null)}
        title={selectedJdScan ? `${selectedJdScan.jobTitle} - Job Description` : 'Job Description'}
        description={selectedJdScan?.company ? `Posted by ${selectedJdScan.company}` : 'Original job description text'}
        maxWidth="max-w-2xl"
      >
        {selectedJdScan && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
              <span>{selectedJdScan.jobDescription?.length || 0} characters</span>
              <Button
                variant="outline"
                size="xs"
                icon={copiedJd ? Check : Copy}
                onClick={() => handleCopyJd(selectedJdScan.jobDescription)}
              >
                {copiedJd ? 'Copied to Clipboard' : 'Copy Description'}
              </Button>
            </div>

            <div className="max-h-96 overflow-y-auto p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed">
              {selectedJdScan.jobDescription || 'No job description text recorded.'}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedJdScan(null)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* 3. SIDE-BY-SIDE COMPATIBILITY COMPARISON MODAL */}
      <Modal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        title="Side-by-Side Compatibility Comparison"
        description={`Comparing ${comparisonScans.length} target job analyses to evaluate where you have the highest fit and fewest gaps.`}
        maxWidth="max-w-4xl"
      >
        <div className="space-y-6">
          {comparisonScans.length >= 2 ? (
            <div className="space-y-6">
              {/* Columns Grid */}
              <div className={`grid grid-cols-1 ${comparisonScans.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
                {comparisonScans.map((scan) => {
                  const score = scan.matchPercentage || 0;
                  const scoreColor = score >= 70 ? 'text-emerald-600' : score >= 40 ? 'text-amber-600' : 'text-rose-600';

                  return (
                    <div
                      key={scan.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between space-y-4 shadow-xs"
                    >
                      <div className="space-y-3">
                        {/* Title & Company */}
                        <div className="pb-3 border-b border-slate-100">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block truncate">
                            {scan.company || 'Direct Hiring'}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 mt-0.5 line-clamp-1">
                            {scan.jobTitle}
                          </h4>
                          <span className="text-xs text-slate-500 block mt-0.5">
                            {scan.jobType || 'Full-time'} • {scan.location || 'India'}
                          </span>
                        </div>

                        {/* Compatibility Score */}
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                            Match Score
                          </span>
                          <div className={`text-3xl font-extrabold ${scoreColor}`}>
                            {score}%
                          </div>
                          <Badge
                            variant={score >= 70 ? 'success' : score >= 40 ? 'warning' : 'danger'}
                            size="xs"
                            className="mt-1"
                          >
                            {scan.readiness?.badge || `${score}%`}
                          </Badge>
                        </div>

                        {/* Matched Skills Count */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-600 font-medium">Matched Skills:</span>
                            <span className="font-bold text-emerald-700">
                              {scan.matchedSkills?.length || 0} / {scan.totalRequired || 0}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {(scan.matchedSkills || []).slice(0, 5).map((s) => (
                              <span
                                key={s.id || s.name}
                                className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-medium"
                              >
                                {s.name}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Missing Mandatory Skills */}
                        <div className="space-y-1 pt-1 border-t border-slate-100">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-600 font-medium">Mandatory Gaps:</span>
                            <span className="font-bold text-rose-700">
                              {scan.missingMandatorySkills?.length || 0}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {(scan.missingMandatorySkills || []).length > 0 ? (
                              scan.missingMandatorySkills.slice(0, 4).map((s) => (
                                <span
                                  key={s.id || s.name}
                                  className="text-[10px] px-2 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 rounded font-medium"
                                >
                                  {s.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-[11px] text-emerald-700 font-medium">Zero dealbreakers!</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Column CTA */}
                      <div className="pt-3 border-t border-slate-100 space-y-1.5">
                        <Button
                          variant="primary"
                          size="xs"
                          icon={Briefcase}
                          onClick={() => {
                            setIsCompareModalOpen(false);
                            handleOpenResumeBuilder(scan);
                          }}
                          className="w-full justify-center"
                        >
                          Tailor ATS Resume
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => {
                            setIsCompareModalOpen(false);
                            handleReopenAnalysis(scan);
                          }}
                          className="w-full justify-center text-slate-600"
                        >
                          Reopen Analysis
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recommendation Summary */}
              <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-1 text-xs">
                <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Comparative Takeaway
                </span>
                <p className="text-slate-700 leading-relaxed">
                  You have the strongest match for{' '}
                  <strong className="text-indigo-900">
                    {[...comparisonScans].sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0))[0]?.jobTitle}
                  </strong>{' '}
                  ({Math.max(...comparisonScans.map((s) => s.matchPercentage || 0))}% fit). We recommend tailoring your resume and applying to this role first while working through learning roadmaps for the other positions.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 space-y-3">
              <GitCompare className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">Select at least 2 roles to compare</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Check the checkboxes on any 2 or 3 saved jobs to compare their compatibility scores, mandatory skill gaps, and requirements side-by-side.
              </p>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCompareModalOpen(false)}
            >
              Close Comparison
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
