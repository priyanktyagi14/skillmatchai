import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookmarkPlus,
  ArrowRight,
  Compass,
  FileText,
  Building,
  MapPin,
  Briefcase,
  History,
  Check,
  Layers,
  HelpCircle,
  Clock,
  ShieldAlert,
  Percent,
  ListFilter,
  ExternalLink,
  Target
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Textarea } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';

const JOB_TYPE_OPTIONS = [
  { value: 'Internship', label: 'Internship' },
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' }
];

export const JobMatcherPage = () => {
  const navigate = useNavigate();
  const {
    jobTemplates,
    performJobScan,
    scans,
    activeScan,
    setActiveScan,
    addSavedJob,
    savedJobs,
    profile
  } = useApp();

  // Job Input Form State (starts empty unless activeScan is set)
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [jobTitle, setJobTitle] = useState(activeScan?.jobTitle || '');
  const [company, setCompany] = useState(activeScan?.company || '');
  const [jobType, setJobType] = useState(activeScan?.jobType || 'Full-time');
  const [jdText, setJdText] = useState(activeScan?.jobDescription || '');
  const [location, setLocation] = useState(activeScan?.location || '');
  const [salary, setSalary] = useState(activeScan?.salary || '');

  // UI & Validation State
  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync form inputs with activeScan when reopened from Saved Jobs or Dashboard
  React.useEffect(() => {
    if (activeScan) {
      if (activeScan.jobTitle) setJobTitle(activeScan.jobTitle);
      if (activeScan.company !== undefined) setCompany(activeScan.company);
      if (activeScan.jobType) setJobType(activeScan.jobType);
      if (activeScan.location !== undefined) setLocation(activeScan.location);
      if (activeScan.salary !== undefined) setSalary(activeScan.salary);
      if (activeScan.jobDescription) setJdText(activeScan.jobDescription);
    }
  }, [activeScan?.id]);

  // Template select change
  const handleSelectTemplate = (templateId) => {
    setSelectedTemplateId(templateId);
    setErrorMessage('');
    const template = jobTemplates.find((t) => t.id === templateId);
    if (template) {
      setJobTitle(template.title);
      setCompany(template.company || '');
      setJobType(template.jobType || template.type || 'Full-time');
      setLocation(template.location || '');
      setSalary(template.salary || '');
      setJdText(template.description);
    }
  };

  // Run match scan with validation
  const handleRunScan = (e) => {
    e?.preventDefault();
    setErrorMessage('');

    if (!jobTitle.trim()) {
      setErrorMessage('Please enter a job title (e.g. SDE-1, Frontend Intern).');
      return;
    }

    if (!jdText.trim()) {
      setErrorMessage('Please enter or paste a job description text to analyze.');
      return;
    }

    setIsScanning(true);

    setTimeout(() => {
      const record = performJobScan(jobTitle.trim(), company.trim(), jdText, {
        jobType,
        location,
        salary
      });
      setIsScanning(false);
    }, 250);
  };

  // Current display scan
  const currentResult = activeScan || scans[0] || null;

  // Check if current job is already saved to tracker
  const isAlreadySaved = savedJobs.some(
    (j) => j.title === currentResult?.jobTitle && j.company === currentResult?.company
  );

  const handleSaveToTracker = () => {
    if (!currentResult) return;
    const newJob = {
      id: `saved-${Date.now()}`,
      title: currentResult.jobTitle,
      company: currentResult.company || 'Direct Hiring',
      jobType: currentResult.jobType || 'Full-time',
      location: currentResult.location || 'India',
      salary: currentResult.salary || 'Competitive',
      status: 'Ready to Apply',
      matchPercentage: currentResult.matchPercentage,
      appliedDate: null,
      notes: `Scanned on ${new Date().toLocaleDateString()}. Missing mandatory: ${
        currentResult.missingMandatorySkills?.map((s) => s.name).slice(0, 3).join(', ') || 'None'
      }`,
      jdSnippet: currentResult.jobDescription?.slice(0, 200) + '...'
    };
    addSavedJob(newJob);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Profile skills count check
  const profileSkillsCount = profile?.skills?.length || 0;

  return (
    <div className="space-y-6">
      {/* Top Banner & Sample Template Picker */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  Deterministic Skill Matching
                </span>
                <span className="text-xs text-slate-400 font-mono">80% Mandatory / 20% Preferred</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Job Description Analyzer & Skill Matcher
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Paste any live campus placement JD or off-campus posting. Our engine extracts technical requirements, distinguishes mandatory vs. preferred skills, and calculates a transparent score.
              </p>
            </div>
            {scans.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg shrink-0">
                <History className="w-3.5 h-3.5 text-slate-400" />
                <span>{scans.length} {scans.length === 1 ? 'analysis saved' : 'analyses saved'}</span>
              </div>
            )}
          </div>

          {/* Realistic Sample Templates */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Load Sample Realistic Role (Internship / Fresher):
            </span>
            <div className="flex flex-wrap gap-2">
              {jobTemplates.map((template) => {
                const isSelected = selectedTemplateId === template.id;
                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => handleSelectTemplate(template.id)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{template.title.split('(')[0].trim()}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      [{template.jobType || template.type || 'Full-time'}]
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Skills Alert if Profile is Empty */}
      {profileSkillsCount === 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-amber-900">
            <p className="font-semibold">Your Profile currently has 0 skills saved</p>
            <p className="text-amber-700">
              The matching engine compares extracted requirements directly against your profile. Without saved skills, compatibility will score 0%.
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="font-medium underline hover:text-amber-950 inline-flex items-center gap-1 pt-1"
            >
              Add skills to your Profile <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Main Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: JOB INPUT FORM (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Job Posting Details</CardTitle>
              <CardDescription>
                Enter the job details and paste the full requirements text
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRunScan} className="space-y-3.5">
                {/* Job Title */}
                <Input
                  label="Job Title"
                  value={jobTitle}
                  onChange={(e) => {
                    setJobTitle(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="e.g. SDE-1 / Software Engineering Intern"
                  required
                />

                {/* Company Name (optional) and Job Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Company Name (Optional)"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Google, Microsoft, Startup"
                  />
                  <Select
                    label="Job Type"
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    options={JOB_TYPE_OPTIONS}
                  />
                </div>

                {/* Large Job Description Text Area */}
                <Textarea
                  label="Job Description"
                  rows={11}
                  value={jdText}
                  onChange={(e) => {
                    setJdText(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Paste the full job description here... (Include Required Qualifications, Preferred Skills, tech stack, etc.)"
                  helperText="Recognizes mandatory phrases ('Required', 'Must Have', 'Essential') and preferred phrases ('Good to Have', 'Nice to Have', 'Bonus')."
                  required
                />

                {/* Validation Error Message */}
                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Analyze Job Match Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full font-semibold shadow-xs"
                  disabled={isScanning || !jdText.trim()}
                  icon={Sparkles}
                >
                  {isScanning ? 'Analyzing Technical Requirements...' : 'Analyze Job Match'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Previous Scans History Drawer */}
          {scans.length > 1 && (
            <Card className="p-4">
              <p className="text-xs font-semibold text-slate-800 mb-2.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-slate-400" />
                  Saved Analyses History
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Stored in LocalStorage</span>
              </p>
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {scans.map((scan) => {
                  const isActive = activeScan?.id === scan.id;
                  return (
                    <div
                      key={scan.id}
                      onClick={() => setActiveScan(scan)}
                      className={`p-2.5 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-all ${
                        isActive
                          ? 'bg-indigo-50/90 text-indigo-900 font-semibold border border-indigo-200 shadow-2xs'
                          : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                      }`}
                    >
                      <div className="truncate max-w-[210px]">
                        <p className="truncate font-medium">{scan.jobTitle}</p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {scan.company || 'Direct'} • {scan.jobType || 'Full-time'}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`font-mono font-bold text-xs ${
                            scan.matchPercentage >= 70
                              ? 'text-emerald-600'
                              : scan.matchPercentage >= 40
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }`}
                        >
                          {scan.matchPercentage}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: RESULTS PAGE (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {currentResult ? (
            <div className="space-y-6">
              {/* 1. OVERALL COMPATIBILITY SCORE CARD */}
              <Card className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded">
                        Analysis Results
                      </span>
                      <Badge variant="outline" size="xs">
                        {currentResult.jobType || 'Full-time'}
                      </Badge>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {currentResult.jobTitle}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      {currentResult.company && (
                        <span className="flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          {currentResult.company}
                        </span>
                      )}
                      {currentResult.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {currentResult.location}
                        </span>
                      )}
                      <span className="text-slate-400">
                        Scanned: {new Date(currentResult.date || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Circular Score Visualizer */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
                    <div className="text-left sm:text-right">
                      <div className="flex items-baseline gap-1">
                        <span
                          className={`text-4xl font-extrabold tracking-tight ${
                            currentResult.matchPercentage >= 70
                              ? 'text-emerald-600'
                              : currentResult.matchPercentage >= 40
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }`}
                        >
                          {currentResult.matchPercentage}%
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium block">
                        Compatibility Score
                      </span>
                    </div>

                    <Badge
                      variant={
                        currentResult.matchPercentage >= 70
                          ? 'success'
                          : currentResult.matchPercentage >= 40
                          ? 'warning'
                          : 'danger'
                      }
                      size="sm"
                    >
                      {currentResult.readiness?.badge || 'Analyzed'}
                    </Badge>
                  </div>
                </div>

                {/* Professional Progress Indicator */}
                <div className="pt-4 space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-700 font-medium">
                      Matched {currentResult.matchedSkills?.length || 0} of {currentResult.totalRequired || 0} extracted technical skills
                    </span>
                    <span className="text-slate-500 font-mono">
                      ATS Density: <strong className="text-indigo-600">{currentResult.atsDensity || 0}%</strong>
                    </span>
                  </div>
                  <ProgressBar
                    value={currentResult.matchPercentage}
                    color="auto"
                    size="lg"
                  />
                  <p className="text-xs text-slate-500 leading-relaxed pt-1">
                    {currentResult.readiness?.description}
                  </p>
                </div>
              </Card>

              {/* 2. SHORT EXPLANATION OF THE SCORE */}
              <Card className="p-5 bg-indigo-50/30 border-indigo-100">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg shrink-0 mt-0.5">
                    <Percent className="w-4 h-4" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                        Score Calculation Breakdown
                      </h4>
                      <Badge variant="outline" size="xs" className="border-indigo-200 text-indigo-800">
                        {currentResult.scoringMethod === 'fallback_equal_weight'
                          ? 'Fallback Mode (Equal Weight)'
                          : 'Weighted Mode (80/20)'}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-mono bg-white p-2.5 rounded-lg border border-indigo-100 shadow-2xs">
                      {currentResult.scoreExplanation ||
                        `Mandatory skills carry 80% weight, and preferred skills carry 20% weight. Only skills present in your profile are awarded points.`}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                      <div className="bg-white p-2 rounded border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Mandatory Weight</span>
                        <strong className="text-slate-800">80%</strong>
                      </div>
                      <div className="bg-white p-2 rounded border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Preferred Weight</span>
                        <strong className="text-slate-800">20%</strong>
                      </div>
                      <div className="bg-white p-2 rounded border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Mandatory Matched</span>
                        <strong className="text-indigo-700">
                          {currentResult.matchedMandatorySkills?.length || 0} / {currentResult.mandatorySkills?.length || 0}
                        </strong>
                      </div>
                      <div className="bg-white p-2 rounded border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Preferred Matched</span>
                        <strong className="text-indigo-700">
                          {currentResult.matchedPreferredSkills?.length || 0} / {currentResult.preferredSkills?.length || 0}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* 3. JOB REQUIREMENTS SUMMARY */}
              <Card className="p-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <ListFilter className="w-4 h-4 text-slate-500" />
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Job Requirements Summary
                    </h4>
                  </div>
                  <span className="text-xs text-slate-500">
                    {currentResult.totalRequired || 0} skills detected
                  </span>
                </div>

                <div className="pt-3 space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 block uppercase">Total Skills</span>
                      <span className="text-base font-bold text-slate-900">
                        {currentResult.totalRequired || 0}
                      </span>
                    </div>
                    <div className="p-2.5 bg-rose-50/50 rounded-lg border border-rose-200/60">
                      <span className="text-[10px] text-rose-700 block uppercase font-medium">Mandatory</span>
                      <span className="text-base font-bold text-rose-800">
                        {currentResult.mandatorySkills?.length || 0}
                      </span>
                    </div>
                    <div className="p-2.5 bg-sky-50/50 rounded-lg border border-sky-200/60">
                      <span className="text-[10px] text-sky-700 block uppercase font-medium">Preferred</span>
                      <span className="text-base font-bold text-sky-800">
                        {currentResult.preferredSkills?.length || 0}
                      </span>
                    </div>
                  </div>

                  {/* Category Breakdown Chips */}
                  {currentResult.summary?.byCategory && Object.keys(currentResult.summary.byCategory).length > 0 && (
                    <div className="pt-1">
                      <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
                        Requirements by Domain:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(currentResult.summary.byCategory).map(([cat, count]) => (
                          <span
                            key={cat}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px]"
                          >
                            <span className="font-medium">{cat}:</span>
                            <span className="font-mono text-slate-500">{count}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* 4. MATCHED SKILLS */}
              <Card className="p-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Matched Skills ({currentResult.matchedSkills?.length || 0})
                    </h4>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    Verified in Profile
                  </span>
                </div>

                <div className="pt-3">
                  {currentResult.matchedSkills?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {currentResult.matchedSkills.map((skill) => (
                        <div
                          key={skill.id || skill.name}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200/90 rounded-lg text-xs font-medium shadow-2xs"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{skill.name}</span>
                          {skill.requirementType && (
                            <span
                              className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                                skill.requirementType === 'Mandatory'
                                  ? 'bg-rose-100/70 text-rose-800'
                                  : 'bg-sky-100/70 text-sky-800'
                              }`}
                            >
                              {skill.requirementType}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 py-3 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                      No matching skills found between this job description and your profile.
                    </p>
                  )}
                </div>
              </Card>

              {/* 5. MISSING MANDATORY & MISSING PREFERRED BREAKDOWN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Missing Mandatory Skills (Dealbreakers) */}
                <Card className="p-5 border-rose-200/80 bg-rose-50/20">
                  <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 uppercase tracking-wider">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <span>Missing Mandatory ({currentResult.missingMandatorySkills?.length || 0})</span>
                    </div>
                    <Badge variant="danger" size="xs">
                      Essential
                    </Badge>
                  </div>

                  <div className="pt-3 space-y-2">
                    {currentResult.missingMandatorySkills?.length > 0 ? (
                      currentResult.missingMandatorySkills.map((skill) => (
                        <div
                          key={skill.id || skill.name}
                          className="p-2.5 bg-white rounded-lg border border-rose-200 flex items-center justify-between shadow-2xs"
                        >
                          <div>
                            <p className="text-xs font-bold text-rose-950">{skill.name}</p>
                            <p className="text-[10px] text-slate-500">{skill.category}</p>
                          </div>
                          <Badge variant="outline" size="xs" className="border-rose-200 text-rose-700 bg-rose-50/50">
                            Must-Have
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-emerald-800 py-2.5 px-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Zero mandatory gaps! You meet all core requirements.</span>
                      </p>
                    )}
                  </div>
                </Card>

                {/* Missing Preferred Skills (Good to Have / Bonus) */}
                <Card className="p-5 border-sky-200/80 bg-sky-50/20">
                  <div className="flex items-center justify-between pb-3 border-b border-sky-100">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900 uppercase tracking-wider">
                      <Compass className="w-4 h-4 text-sky-600" />
                      <span>Missing Preferred ({currentResult.missingPreferredSkills?.length || 0})</span>
                    </div>
                    <Badge variant="outline" size="xs" className="text-sky-700 border-sky-300">
                      Good-To-Have
                    </Badge>
                  </div>

                  <div className="pt-3 space-y-2">
                    {currentResult.missingPreferredSkills?.length > 0 ? (
                      currentResult.missingPreferredSkills.map((skill) => (
                        <div
                          key={skill.id || skill.name}
                          className="p-2.5 bg-white rounded-lg border border-sky-200 flex items-center justify-between shadow-2xs"
                        >
                          <div>
                            <p className="text-xs font-semibold text-slate-800">{skill.name}</p>
                            <p className="text-[10px] text-slate-500">{skill.category}</p>
                          </div>
                          <Badge variant="outline" size="xs" className="text-slate-600">
                            Bonus
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-600 py-2.5 px-3 bg-slate-50 rounded-lg border border-slate-200">
                        {currentResult.preferredSkills?.length === 0
                          ? 'No separate preferred skills were specified in this description.'
                          : 'All preferred skills are covered in your profile!'}
                      </p>
                    )}
                  </div>
                </Card>
              </div>

              {/* Action Buttons: Unified Workflow across Skill Gap, Resume, and Tracker */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  icon={BookmarkPlus}
                  disabled={isAlreadySaved}
                  onClick={handleSaveToTracker}
                  className="w-full sm:w-auto"
                >
                  {isAlreadySaved ? 'Job Saved in Pipeline' : savedSuccess ? 'Saved to Tracker!' : 'Save Job to Tracker'}
                </Button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Compass}
                    onClick={() => navigate('/skill-gap')}
                    className="w-full sm:w-auto text-indigo-700"
                  >
                    View Skill Gap Matrix
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={FileText}
                    onClick={() => navigate('/resume')}
                    className="w-full sm:w-auto"
                  >
                    Tailor ATS Resume
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Card className="p-12 text-center text-slate-400">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p>Paste a job description on the left and click "Analyze Job Match".</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
