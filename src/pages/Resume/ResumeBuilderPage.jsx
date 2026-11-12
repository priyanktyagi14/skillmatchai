import React, { useState, useEffect, useMemo } from 'react';
import {
  Printer,
  Download,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Target,
  Plus,
  Trash2,
  Pencil,
  GraduationCap,
  Code2,
  FolderGit2,
  Briefcase,
  Award,
  User,
  Bookmark,
  Check,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ResumePreview } from './ResumePreview';
import { generateResumePDF } from '../../utils/pdfGenerator';
import { evaluateResumeATS } from '../../utils/atsAnalyzer';
import {
  calculateProjectRelevance,
  generateTailoredSummary,
  prioritizeSkillsForJob
} from './resumeHelpers';
import { ProjectModal, ExperienceModal, CertificationModal } from './ResumeModals';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Input, Textarea } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '../../utils/storage';
import { SKILL_CATEGORIES } from '../../data/skillsTaxonomy';

export const ResumeBuilderPage = () => {
  const {
    profile,
    updateProfile,
    activeScan,
    scans = [],
    logResumeActivity
  } = useApp();

  // 1. Target Job Analysis Context
  const [userSelectedScanId, setUserSelectedScanId] = useState(null);
  const selectedScanId = userSelectedScanId || activeScan?.id || scans[0]?.id || '';

  // Find target scan
  const targetScan = useMemo(() => {
    return scans.find((s) => s.id === selectedScanId) || activeScan || scans[0] || null;
  }, [scans, selectedScanId, activeScan]);

  // Target job matched & missing skills
  const matchedSkills = useMemo(() => {
    return targetScan?.matchedSkills || [];
  }, [targetScan]);

  const matchedKeywords = useMemo(() => {
    return matchedSkills.map((s) => (typeof s === 'string' ? s : s.name));
  }, [matchedSkills]);

  const missingKeywords = useMemo(() => {
    return (targetScan?.missingSkills || []).map((s) => (typeof s === 'string' ? s : s.name));
  }, [targetScan]);

  // 2. Resume Data State (Initialized from Profile, persisted to LocalStorage draft)
  const [resumeData, setResumeData] = useState(() => {
    const savedDraft = getStorageItem(STORAGE_KEYS.RESUME_CUSTOM, null);
    if (savedDraft) {
      return {
        ...profile,
        ...savedDraft,
        personal: { ...profile.personal, ...(savedDraft.personal || {}) },
        education: { ...profile.education, ...(savedDraft.education || {}) },
        skills: savedDraft.skills || profile.skills,
        projects: (savedDraft.projects || profile.projects || []).map((p) => ({
          ...p,
          included: p.included !== undefined ? p.included : true
        })),
        experience: (savedDraft.experience || profile.experience || []).map((e) => ({
          ...e,
          included: e.included !== undefined ? e.included : true
        })),
        certifications: (savedDraft.certifications || profile.certifications || []).map((c) => ({
          ...c,
          included: c.included !== undefined ? c.included : true
        }))
      };
    }
    return {
      ...profile,
      projects: (profile.projects || []).map((p) => ({ ...p, included: true })),
      experience: (profile.experience || []).map((e) => ({ ...e, included: true })),
      certifications: (profile.certifications || []).map((c) => ({ ...c, included: true }))
    };
  });

  // Save draft to localStorage whenever resumeData changes
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.RESUME_CUSTOM, resumeData);
  }, [resumeData]);

  // 3. UI State
  const [activeTab, setActiveTab] = useState('job_customization'); // 'job_customization' | 'contact' | 'summary' | 'education' | 'skills' | 'projects' | 'experience' | 'certifications'
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'preview_only' | 'audit_only'
  const [showHighlights, setShowHighlights] = useState(true);
  const [toastMessage, setToMessage] = useState(null);

  // Modals state
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [experienceModalOpen, setExperienceModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);

  const [certificationModalOpen, setCertificationModalOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState(null);

  // New Skill inline input
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState(SKILL_CATEGORIES.PROGRAMMING_LANGUAGES);

  // Show Toast
  const showToast = (msg) => {
    setToMessage(msg);
    setTimeout(() => setToMessage(null), 3500);
  };

  // Evaluate ATS compliance in real-time based on the current customized resume
  const atsReport = useMemo(() => {
    return evaluateResumeATS(resumeData);
  }, [resumeData]);

  // Section Handlers
  const handlePersonalChange = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      personal: { ...(prev.personal || {}), [field]: value }
    }));
  };

  const handleEducationChange = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      education: { ...(prev.education || {}), [field]: value }
    }));
  };

  // Summary Tailoring
  const handleTailorSummary = () => {
    if (!targetScan) {
      showToast('Please select a target job first to tailor the summary.');
      return;
    }
    const tailored = generateTailoredSummary({
      personal: resumeData.personal,
      education: resumeData.education,
      matchedSkills: matchedSkills,
      targetJobTitle: targetScan.jobTitle,
      targetCompany: targetScan.company
    });

    handlePersonalChange('summary', tailored);
    if (logResumeActivity) {
      logResumeActivity({
        type: 'summary_tailored',
        title: 'Tailored Professional Summary',
        description: `Optimized summary for ${targetScan.jobTitle}`,
        targetJob: targetScan.jobTitle
      });
    }
    showToast(`Summary customized for ${targetScan.jobTitle}!`);
  };

  const handleResetSummaryToProfile = () => {
    handlePersonalChange('summary', profile.personal?.summary || '');
    showToast('Summary reset to profile default.');
  };

  // Skills Management
  const handleAddSkill = (e) => {
    e?.preventDefault();
    if (!newSkillName.trim()) return;

    const trimmed = newSkillName.trim();
    const exists = (resumeData.skills || []).some(
      (s) => s.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (exists) {
      showToast('This skill is already listed.');
      return;
    }

    setResumeData((prev) => ({
      ...prev,
      skills: [
        ...(prev.skills || []),
        { name: trimmed, category: newSkillCategory, level: 'Intermediate' }
      ]
    }));
    setNewSkillName('');
    showToast(`Added ${trimmed} to technical skills.`);
  };

  const handleRemoveSkill = (skillName) => {
    setResumeData((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter(
        (s) => s.name.toLowerCase() !== skillName.toLowerCase()
      )
    }));
  };

  const handlePrioritizeTargetSkills = () => {
    if (matchedKeywords.length === 0) {
      showToast('No target skills found to prioritize. Select a target job scan.');
      return;
    }
    const prioritized = prioritizeSkillsForJob(resumeData.skills, matchedKeywords);
    setResumeData((prev) => ({
      ...prev,
      skills: prioritized
    }));
    if (logResumeActivity) {
      logResumeActivity({
        type: 'skills_prioritized',
        title: 'Prioritized Role Skills',
        description: `Reordered skills section to highlight ${matchedKeywords.length} matching skills for ${targetScan?.jobTitle || 'Target Role'}`,
        targetJob: targetScan?.jobTitle
      });
    }
    showToast('Job-matched skills prioritized to top of each category!');
  };

  // Projects Management
  const handleToggleProject = (id) => {
    setResumeData((prev) => ({
      ...prev,
      projects: (prev.projects || []).map((p) =>
        p.id === id ? { ...p, included: !p.included } : p
      )
    }));
  };

  const handleSaveProject = (savedProj) => {
    setResumeData((prev) => {
      const exists = (prev.projects || []).some((p) => p.id === savedProj.id);
      let updated;
      if (exists) {
        updated = prev.projects.map((p) => (p.id === savedProj.id ? savedProj : p));
      } else {
        updated = [savedProj, ...(prev.projects || [])];
      }
      return { ...prev, projects: updated };
    });
    if (logResumeActivity) {
      logResumeActivity({
        type: 'project_updated',
        title: editingProject ? 'Updated Technical Project' : 'Added Project to Resume',
        description: `${savedProj.name || savedProj.title || 'Project'} in resume draft`
      });
    }
    showToast(editingProject ? 'Project updated!' : 'Project added to resume!');
  };

  const handleDeleteProject = (id) => {
    setResumeData((prev) => ({
      ...prev,
      projects: (prev.projects || []).filter((p) => p.id !== id)
    }));
    showToast('Project removed.');
  };

  const handleAutoSelectTopProjects = () => {
    // Rank projects by relevance to target job and include top 2
    const ranked = (resumeData.projects || []).map((p) => ({
      ...p,
      rel: calculateProjectRelevance(p, matchedSkills)
    })).sort((a, b) => b.rel.score - a.rel.score);

    setResumeData((prev) => ({
      ...prev,
      projects: (prev.projects || []).map((p) => {
        const indexInRanked = ranked.findIndex((r) => r.id === p.id);
        return {
          ...p,
          included: indexInRanked < 2 // Top 2 included
        };
      })
    }));
    showToast('Top 2 role-relevant projects automatically selected for ATS resume!');
  };

  const handleSelectAllProjects = (selectAll) => {
    setResumeData((prev) => ({
      ...prev,
      projects: (prev.projects || []).map((p) => ({ ...p, included: selectAll }))
    }));
  };

  // Work Experience Management
  const handleToggleExperience = (id) => {
    setResumeData((prev) => ({
      ...prev,
      experience: (prev.experience || []).map((e) =>
        e.id === id ? { ...e, included: !e.included } : e
      )
    }));
  };

  const handleSaveExperience = (savedExp) => {
    setResumeData((prev) => {
      const exists = (prev.experience || []).some((e) => e.id === savedExp.id);
      let updated;
      if (exists) {
        updated = prev.experience.map((e) => (e.id === savedExp.id ? savedExp : e));
      } else {
        updated = [savedExp, ...(prev.experience || [])];
      }
      return { ...prev, experience: updated };
    });
    showToast(editingExperience ? 'Experience updated!' : 'Experience added!');
  };

  const handleDeleteExperience = (id) => {
    setResumeData((prev) => ({
      ...prev,
      experience: (prev.experience || []).filter((e) => e.id !== id)
    }));
    showToast('Experience removed.');
  };

  // Certifications Management
  const handleToggleCertification = (id) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).map((c) =>
        c.id === id ? { ...c, included: !c.included } : c
      )
    }));
  };

  const handleSaveCertification = (savedCert) => {
    setResumeData((prev) => {
      const exists = (prev.certifications || []).some((c) => c.id === savedCert.id);
      let updated;
      if (exists) {
        updated = prev.certifications.map((c) => (c.id === savedCert.id ? savedCert : c));
      } else {
        updated = [...(prev.certifications || []), savedCert];
      }
      return { ...prev, certifications: updated };
    });
    showToast(editingCertification ? 'Certification updated!' : 'Certification added!');
  };

  const handleDeleteCertification = (id) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).filter((c) => c.id !== id)
    }));
    showToast('Certification removed.');
  };

  // Sync with main User Profile
  const handleSyncToProfile = () => {
    if (window.confirm('Save all current resume modifications to your primary user profile?')) {
      updateProfile(resumeData);
      if (logResumeActivity) {
        logResumeActivity({
          type: 'profile_synced',
          title: 'Synced Resume with Profile',
          description: 'Updated primary student profile from custom resume draft'
        });
      }
      showToast('Profile updated with current resume data!');
    }
  };

  const handleResetToProfile = () => {
    if (window.confirm('Reset resume to your current main profile? Custom resume draft changes will be overwritten.')) {
      setResumeData({
        ...profile,
        projects: (profile.projects || []).map((p) => ({ ...p, included: true })),
        experience: (profile.experience || []).map((e) => ({ ...e, included: true })),
        certifications: (profile.certifications || []).map((c) => ({ ...c, included: true }))
      });
      showToast('Resume reset to profile defaults.');
    }
  };

  // Real PDF Download
  const handleDownloadPDF = () => {
    try {
      const fullName = resumeData.personal?.fullName || 'Candidate';
      const cleanFileName = `${fullName.replace(/[^a-zA-Z0-9]/g, '_')}_ATS_Resume.pdf`;
      generateResumePDF(resumeData, {
        save: true,
        fileName: cleanFileName
      });
      if (logResumeActivity) {
        logResumeActivity({
          type: 'pdf_download',
          title: 'Exported ATS Resume PDF',
          description: `Downloaded ATS-friendly PDF tailored for ${targetScan?.jobTitle || 'General Application'}`,
          targetJob: targetScan?.jobTitle || 'General Application'
        });
      }
      showToast(`Downloaded ATS-friendly PDF: ${cleanFileName}`);
    } catch (err) {
      console.error('PDF Generation failed:', err);
      showToast('Error generating PDF. Please try browser print option.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Navigation sub-tabs
  const sectionTabs = [
    { id: 'job_customization', label: 'Job Customization', icon: Target, badge: targetScan ? `${matchedKeywords.length} matched` : null },
    { id: 'contact', label: '1. Contact Info', icon: User },
    { id: 'summary', label: '2. Summary', icon: Sparkles },
    { id: 'education', label: '3. Education', icon: GraduationCap },
    { id: 'skills', label: '4. Skills', icon: Code2, count: resumeData.skills?.length || 0 },
    { id: 'projects', label: '5. Projects', icon: FolderGit2, count: (resumeData.projects || []).filter((p) => p.included !== false).length },
    { id: 'experience', label: '6. Experience', icon: Briefcase, count: (resumeData.experience || []).filter((e) => e.included !== false).length },
    { id: 'certifications', label: '7. Certifications', icon: Award, count: (resumeData.certifications || []).filter((c) => c.included !== false).length }
  ];

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="no-print bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-md">
              ATS Engineering Format
            </span>
            <Badge variant={atsReport.badgeColor} size="sm">
              ATS Score: {atsReport.score}/100 • {atsReport.grade}
            </Badge>
            {targetScan && (
              <Badge variant="outline" size="sm" className="hidden sm:inline-flex">
                Target: {targetScan.jobTitle}
              </Badge>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            ATS-Friendly Resume Builder
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Single-column technical fresher format engineered for applicant tracking parsers (Workday, Greenhouse, Lever). Vector PDF with selectable text.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Target Scan Picker */}
          {scans.length > 0 && (
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
              <Target className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
              <select
                value={selectedScanId}
                onChange={(e) => setUserSelectedScanId(e.target.value)}
                className="bg-transparent font-medium focus:outline-none max-w-[170px] truncate text-xs"
                title="Select target job description scan to customize your resume"
              >
                {scans.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.jobTitle} ({s.matchPercentage}%)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Download PDF Button */}
          <Button
            variant="primary"
            size="sm"
            icon={Download}
            onClick={handleDownloadPDF}
            className="shadow-xs font-semibold"
          >
            Download ATS PDF
          </Button>

          {/* Browser Print / Fallback */}
          <Button
            variant="outline"
            size="sm"
            icon={Printer}
            onClick={handlePrint}
            title="Print or save via browser print dialog"
          >
            Print
          </Button>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="no-print p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* View Mode & Keyword Highlight Toggles */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">View Mode:</span>
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-2xs">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'split'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Editor & Preview
            </button>
            <button
              onClick={() => setViewMode('preview_only')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'preview_only'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Full ATS Preview
            </button>
            <button
              onClick={() => setViewMode('audit_only')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'audit_only'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ATS Audit Report
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-slate-700 select-none">
            <input
              type="checkbox"
              checked={showHighlights}
              onChange={(e) => setShowHighlights(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
            />
            <span>Highlight Job-Matched Keywords</span>
          </label>

          <div className="h-4 w-px bg-slate-200" />

          <button
            onClick={handleSyncToProfile}
            className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline flex items-center gap-1"
            title="Save changes back to primary user profile"
          >
            <Bookmark className="w-3.5 h-3.5" />
            Save to Profile
          </button>

          <button
            onClick={handleResetToProfile}
            className="text-slate-500 hover:text-slate-800 font-medium hover:underline flex items-center gap-1"
            title="Discard draft changes and revert to profile"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT / EDITOR PANEL (Shown in 'split' or 'editor' mode, hidden in full preview/audit) */}
        {viewMode === 'split' && (
          <div className="no-print lg:col-span-6 space-y-4">
            {/* Section Tabs Navigation */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-2 shadow-2xs overflow-x-auto flex gap-1">
              {sectionTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                    {tab.badge && !isActive && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-bold">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT: JOB CUSTOMIZATION */}
            {activeTab === 'job_customization' && (
              <Card className="p-5 space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Target className="w-4 h-4 text-indigo-600" />
                      Job-Specific Customization Engine
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Align resume sections to <strong className="text-slate-700">{targetScan?.jobTitle || 'Target Role'}</strong> without fabricating experience or qualifications.
                    </p>
                  </div>
                  {targetScan && (
                    <Badge variant="indigo" size="md">
                      {targetScan.matchPercentage}% Match
                    </Badge>
                  )}
                </div>

                {targetScan ? (
                  <div className="space-y-4">
                    {/* Matched Keywords Grid */}
                    <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-800">
                          Matched Skills in Your Profile ({matchedKeywords.length})
                        </span>
                        <Button
                          variant="outline"
                          size="xs"
                          icon={Sparkles}
                          onClick={handlePrioritizeTargetSkills}
                        >
                          Prioritize in Skills Section
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {matchedKeywords.map((k) => (
                          <span
                            key={k}
                            className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-medium flex items-center gap-1"
                          >
                            <Check className="w-3 h-3 text-emerald-600" />
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Missing Keywords Notice */}
                    {missingKeywords.length > 0 && (
                      <div className="p-3 bg-amber-50 border border-amber-200/70 rounded-xl space-y-1.5 text-xs text-amber-900">
                        <p className="font-semibold flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          Missing Job Keywords ({missingKeywords.length})
                        </p>
                        <p className="text-[11px] text-amber-800 leading-relaxed">
                          The target job requests these skills. If you possess practical experience in any of these, add them in the Technical Skills tab:
                        </p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {missingKeywords.slice(0, 8).map((k) => (
                            <span
                              key={k}
                              className="text-[10px] px-1.5 py-0.5 bg-white/80 border border-amber-300 text-amber-900 rounded font-medium"
                            >
                              {k}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Customization Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="p-3 border border-slate-200 rounded-xl bg-white space-y-2">
                        <span className="text-xs font-bold text-slate-800 block">
                          Role-Tailored Summary
                        </span>
                        <p className="text-[11px] text-slate-500">
                          Generate an ATS hook using your actual degree and top matched skills ({matchedKeywords.slice(0, 3).join(', ')}).
                        </p>
                        <Button
                          variant="secondary"
                          size="xs"
                          icon={Sparkles}
                          onClick={handleTailorSummary}
                          className="w-full"
                        >
                          Tailor Summary
                        </Button>
                      </div>

                      <div className="p-3 border border-slate-200 rounded-xl bg-white space-y-2">
                        <span className="text-xs font-bold text-slate-800 block">
                          Project Relevance Filter
                        </span>
                        <p className="text-[11px] text-slate-500">
                          Automatically select the 2 technical projects that best match {targetScan.jobTitle}.
                        </p>
                        <Button
                          variant="secondary"
                          size="xs"
                          icon={FolderGit2}
                          onClick={handleAutoSelectTopProjects}
                          className="w-full"
                        >
                          Select Top Projects
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    No target scans found. Run a job scan in Job Matcher to unlock automated role tailoring.
                  </div>
                )}
              </Card>
            )}

            {/* TAB CONTENT: 1. CONTACT INFORMATION */}
            {activeTab === 'contact' && (
              <Card className="p-5 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">1. Contact Information</h3>
                    <p className="text-xs text-slate-500">Header info required by ATS parsers.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Full Name *"
                    value={resumeData.personal?.fullName || ''}
                    onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                  />
                  <Input
                    label="Email Address *"
                    value={resumeData.personal?.email || ''}
                    onChange={(e) => handlePersonalChange('email', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Phone Number *"
                    value={resumeData.personal?.phone || ''}
                    onChange={(e) => handlePersonalChange('phone', e.target.value)}
                  />
                  <Input
                    label="Location (City, Country) *"
                    value={resumeData.personal?.location || ''}
                    onChange={(e) => handlePersonalChange('location', e.target.value)}
                  />
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <Input
                    label="LinkedIn Profile URL"
                    placeholder="https://linkedin.com/in/username"
                    value={resumeData.personal?.linkedin || ''}
                    onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                  />
                  <Input
                    label="GitHub Profile URL"
                    placeholder="https://github.com/username"
                    value={resumeData.personal?.github || ''}
                    onChange={(e) => handlePersonalChange('github', e.target.value)}
                  />
                  <Input
                    label="Portfolio Website URL"
                    placeholder="https://yourname.dev"
                    value={resumeData.personal?.portfolio || ''}
                    onChange={(e) => handlePersonalChange('portfolio', e.target.value)}
                  />
                </div>
              </Card>
            )}

            {/* TAB CONTENT: 2. PROFESSIONAL SUMMARY */}
            {activeTab === 'summary' && (
              <Card className="p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">2. Professional Summary</h3>
                    <p className="text-xs text-slate-500">2-3 concise sentences presenting your engineering focus and core stack.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="xs"
                      icon={RotateCcw}
                      onClick={handleResetSummaryToProfile}
                    >
                      Reset Default
                    </Button>
                    <Button
                      variant="secondary"
                      size="xs"
                      icon={Sparkles}
                      onClick={handleTailorSummary}
                    >
                      Tailor for Job
                    </Button>
                  </div>
                </div>

                <Textarea
                  rows={5}
                  value={resumeData.personal?.summary || ''}
                  onChange={(e) => handlePersonalChange('summary', e.target.value)}
                  placeholder="Proactive B.Tech Computer Science graduate with strong hands-on proficiency in React.js, Node.js, and PostgreSQL..."
                  helperText="ATS Tip: Keep between 40-70 words. Explicitly mention your degree and top matched technical skills."
                />

                {targetScan && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
                    <span className="font-semibold text-slate-700">Target Role Keywords in Summary:</span>
                    <div className="flex flex-wrap gap-1">
                      {matchedKeywords.map((k) => {
                        const inSummary = (resumeData.personal?.summary || '').toLowerCase().includes(k.toLowerCase());
                        return (
                          <span
                            key={k}
                            className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                              inSummary
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold'
                                : 'bg-slate-100 text-slate-400 line-through'
                            }`}
                          >
                            {k}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* TAB CONTENT: 3. EDUCATION */}
            {activeTab === 'education' && (
              <Card className="p-5 space-y-4">
                <div className="pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">3. Education</h3>
                  <p className="text-xs text-slate-500">College, degree, academic standing and coursework.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Degree *"
                    placeholder="e.g. Bachelor of Technology (B.Tech)"
                    value={resumeData.education?.degree || ''}
                    onChange={(e) => handleEducationChange('degree', e.target.value)}
                  />
                  <Input
                    label="Branch / Specialization *"
                    placeholder="e.g. Computer Science and Engineering"
                    value={resumeData.education?.branch || ''}
                    onChange={(e) => handleEducationChange('branch', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="College / Institution *"
                    placeholder="e.g. Vellore Institute of Technology (VIT)"
                    value={resumeData.education?.college || resumeData.education?.institution || ''}
                    onChange={(e) => {
                      handleEducationChange('college', e.target.value);
                      handleEducationChange('institution', e.target.value);
                    }}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="Graduation Year *"
                      placeholder="2025"
                      value={resumeData.education?.graduationYear || ''}
                      onChange={(e) => handleEducationChange('graduationYear', e.target.value)}
                    />
                    <Input
                      label="CGPA / Score"
                      placeholder="8.72 / 10.0"
                      value={resumeData.education?.cgpa || ''}
                      onChange={(e) => handleEducationChange('cgpa', e.target.value)}
                    />
                  </div>
                </div>

                <Textarea
                  label="Relevant Coursework"
                  placeholder="Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Operating Systems, Computer Networks"
                  rows={3}
                  value={resumeData.education?.relevantCoursework || ''}
                  onChange={(e) => handleEducationChange('relevantCoursework', e.target.value)}
                  helperText="Include 4-6 foundational CS subjects that match fresher hiring evaluations."
                />
              </Card>
            )}

            {/* TAB CONTENT: 4. TECHNICAL SKILLS */}
            {activeTab === 'skills' && (
              <Card className="p-5 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">4. Technical Skills</h3>
                    <p className="text-xs text-slate-500">Categorized skills parsed by ATS filters.</p>
                  </div>
                  {targetScan && (
                    <Button
                      variant="outline"
                      size="xs"
                      icon={Sparkles}
                      onClick={handlePrioritizeTargetSkills}
                    >
                      Prioritize Target Skills
                    </Button>
                  )}
                </div>

                {/* Add new skill inline */}
                <form onSubmit={handleAddSkill} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-semibold text-slate-800">Add Skill to Resume</span>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <div className="sm:col-span-6">
                      <Input
                        placeholder="Skill name (e.g. GraphQL, Tailwind)"
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <Select
                        value={newSkillCategory}
                        onChange={(e) => setNewSkillCategory(e.target.value)}
                        options={Object.values(SKILL_CATEGORIES).map((c) => ({
                          value: c,
                          label: c
                        }))}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Button type="submit" variant="primary" size="sm" icon={Plus} className="w-full">
                        Add
                      </Button>
                    </div>
                  </div>
                </form>

                {/* Skill List by Category */}
                <div className="space-y-3">
                  {Object.values(SKILL_CATEGORIES).map((cat) => {
                    const catSkills = (resumeData.skills || []).filter((s) => s.category === cat);
                    if (catSkills.length === 0) return null;

                    return (
                      <div key={cat} className="p-3 border border-slate-200/80 rounded-lg space-y-1.5">
                        <span className="text-xs font-bold text-slate-800 block">
                          {cat} ({catSkills.length})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {catSkills.map((skill) => {
                            const isMatch = matchedKeywords.some(
                              (k) => k.toLowerCase() === skill.name.toLowerCase()
                            );
                            return (
                              <span
                                key={skill.name}
                                className={`text-xs pl-2 pr-1.5 py-0.5 rounded-md flex items-center gap-1 border transition-colors ${
                                  isMatch
                                    ? 'bg-amber-50 text-amber-950 border-amber-300 font-semibold'
                                    : 'bg-white text-slate-700 border-slate-200'
                                }`}
                              >
                                <span>{skill.name}</span>
                                {isMatch && (
                                  <span className="text-[9px] bg-amber-200/70 text-amber-900 px-1 rounded">
                                    Match
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSkill(skill.name)}
                                  className="text-slate-400 hover:text-rose-600 ml-1 p-0.5"
                                  title="Remove skill"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* TAB CONTENT: 5. PROJECTS */}
            {activeTab === 'projects' && (
              <Card className="p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">5. Technical Projects</h3>
                    <p className="text-xs text-slate-500">
                      Select which projects to include. Recommend 2-3 for a fresher ATS resume.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="xs"
                    icon={Plus}
                    onClick={() => {
                      setEditingProject(null);
                      setProjectModalOpen(true);
                    }}
                  >
                    Add Project
                  </Button>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span>
                    Included: <strong>{(resumeData.projects || []).filter((p) => p.included !== false).length}</strong> of {resumeData.projects?.length || 0}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSelectAllProjects(true)}
                      className="text-indigo-600 hover:underline font-medium"
                    >
                      Select All
                    </button>
                    <span>•</span>
                    <button
                      onClick={handleAutoSelectTopProjects}
                      className="text-indigo-600 hover:underline font-medium"
                    >
                      Top Role Matches
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => handleSelectAllProjects(false)}
                      className="text-slate-500 hover:underline"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {(resumeData.projects || []).map((proj) => {
                    const isIncluded = proj.included !== false;
                    const relevance = calculateProjectRelevance(proj, matchedSkills);

                    return (
                      <div
                        key={proj.id}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isIncluded
                            ? 'bg-white border-slate-300 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <input
                              type="checkbox"
                              checked={isIncluded}
                              onChange={() => handleToggleProject(proj.id)}
                              className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                              title="Include project in resume"
                            />
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-xs font-bold text-slate-900">
                                  {proj.name || proj.title}
                                </h4>
                                <Badge variant={relevance.badgeColor} size="xs">
                                  {relevance.label}
                                </Badge>
                              </div>
                              <p className="text-[11px] font-mono text-slate-600 mt-0.5">
                                {proj.technologies || proj.techStack}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={() => {
                                setEditingProject(proj);
                                setProjectModalOpen(true);
                              }}
                              className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                              title="Edit Project"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(proj.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded"
                              title="Delete Project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {relevance.matchedSkills.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-emerald-800">
                            <span className="font-semibold">Target Skills:</span>
                            <span className="text-emerald-700">
                              {relevance.matchedSkills.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* TAB CONTENT: 6. WORK EXPERIENCE */}
            {activeTab === 'experience' && (
              <Card className="p-5 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">6. Work Experience</h3>
                    <p className="text-xs text-slate-500">Internships, apprenticeships, or technical roles.</p>
                  </div>
                  <Button
                    variant="primary"
                    size="xs"
                    icon={Plus}
                    onClick={() => {
                      setEditingExperience(null);
                      setExperienceModalOpen(true);
                    }}
                  >
                    Add Experience
                  </Button>
                </div>

                <div className="space-y-3">
                  {(resumeData.experience || []).map((exp) => {
                    const isIncluded = exp.included !== false;

                    return (
                      <div
                        key={exp.id}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isIncluded
                            ? 'bg-white border-slate-300 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <input
                              type="checkbox"
                              checked={isIncluded}
                              onChange={() => handleToggleExperience(exp.id)}
                              className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                              title="Include in resume"
                            />
                            <div>
                              <h4 className="text-xs font-bold text-slate-900">
                                {exp.role} <span className="font-normal text-slate-600">— {exp.company}</span>
                              </h4>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {[exp.type, exp.period, exp.location].filter(Boolean).join(' • ')}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={() => {
                                setEditingExperience(exp);
                                setExperienceModalOpen(true);
                              }}
                              className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                              title="Edit"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteExperience(exp.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* TAB CONTENT: 7. CERTIFICATIONS */}
            {activeTab === 'certifications' && (
              <Card className="p-5 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">7. Certifications & Achievements</h3>
                    <p className="text-xs text-slate-500">Professional credentials and verified coursework.</p>
                  </div>
                  <Button
                    variant="primary"
                    size="xs"
                    icon={Plus}
                    onClick={() => {
                      setEditingCertification(null);
                      setCertificationModalOpen(true);
                    }}
                  >
                    Add Certification
                  </Button>
                </div>

                <div className="space-y-2.5">
                  {(resumeData.certifications || []).map((cert) => {
                    const isIncluded = cert.included !== false;

                    return (
                      <div
                        key={cert.id}
                        className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                          isIncluded
                            ? 'bg-white border-slate-300 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isIncluded}
                            onChange={() => handleToggleCertification(cert.id)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                            title="Include in resume"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">
                              {cert.name}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {cert.issuer} {cert.year ? `(${cert.year})` : ''}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingCertification(cert);
                              setCertificationModalOpen(true);
                            }}
                            className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCertification(cert.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* RIGHT / RESUME CANVAS (Takes 6 cols in split, full 12 in preview_only, hidden in audit_only) */}
        {viewMode !== 'audit_only' && (
          <div className={`${viewMode === 'preview_only' ? 'lg:col-span-12' : 'lg:col-span-6'} print-container`}>
            {/* Live Document Canvas */}
            <div className="sticky top-4 space-y-4">
              <ResumePreview
                profile={resumeData}
                highlightedKeywords={matchedKeywords}
                showHighlights={showHighlights}
              />
            </div>
          </div>
        )}

        {/* ATS AUDIT REPORT PANEL (Full 12 cols in audit_only, or available via viewMode) */}
        {viewMode === 'audit_only' && (
          <div className="lg:col-span-12 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-5">
                <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Overall ATS Score</span>
                <div className="text-3xl font-black text-slate-900 mt-1">
                  {atsReport.score}<span className="text-base font-normal text-slate-400">/100</span>
                </div>
                <Badge variant={atsReport.badgeColor} size="sm" className="mt-2">
                  {atsReport.grade}
                </Badge>
                <div className="mt-3">
                  <ProgressBar value={atsReport.score} color="auto" size="sm" />
                </div>
              </Card>

              <Card className="p-5">
                <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Action Verbs Audit</span>
                <div className="text-3xl font-black text-indigo-600 mt-1">
                  {atsReport.metrics.strongVerbCount}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Bullets starting with strong verbs (Architected, Engineered, Optimized)
                </p>
                <Badge variant={atsReport.metrics.strongVerbCount >= 3 ? 'success' : 'warning'} size="xs" className="mt-2">
                  {atsReport.metrics.strongVerbCount >= 3 ? 'Target Met (>=3)' : 'Needs Improvement'}
                </Badge>
              </Card>

              <Card className="p-5">
                <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Quantifiable Metrics</span>
                <div className="text-3xl font-black text-emerald-600 mt-1">
                  {atsReport.metrics.metricCount}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Bullets with numbers, percentages, latencies (ms), user counts
                </p>
                <Badge variant={atsReport.metrics.metricCount >= 2 ? 'success' : 'warning'} size="xs" className="mt-2">
                  {atsReport.metrics.metricCount >= 2 ? 'Target Met (>=2)' : 'Add Metrics'}
                </Badge>
              </Card>
            </div>

            {/* Improvement Recommendations */}
            <Card className="p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-indigo-600" />
                ATS Scanner Suggestions & Best Practices
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {atsReport.feedback.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-1">
                    <span className="font-semibold text-slate-800">{item.category}</span>
                    <p className="text-slate-600 leading-relaxed text-[11px]">{item.message}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Modals */}
      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() => {
          setProjectModalOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
        initialData={editingProject}
      />

      <ExperienceModal
        isOpen={experienceModalOpen}
        onClose={() => {
          setExperienceModalOpen(false);
          setEditingExperience(null);
        }}
        onSave={handleSaveExperience}
        initialData={editingExperience}
      />

      <CertificationModal
        isOpen={certificationModalOpen}
        onClose={() => {
          setCertificationModalOpen(false);
          setEditingCertification(null);
        }}
        onSave={handleSaveCertification}
        initialData={editingCertification}
      />
    </div>
  );
};
