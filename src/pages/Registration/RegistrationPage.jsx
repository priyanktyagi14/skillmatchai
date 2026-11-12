import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  User,
  GraduationCap,
  Code2,
  FolderGit2,
  Briefcase,
  Search,
  Plus,
  Trash2,
  Pencil,
  Check,
  ExternalLink,
  Building,
  Mail,
  Phone,
  MapPin,
  Target
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Textarea } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Badge } from '../../components/common/Badge';
import {
  SKILL_CATEGORY_LIST,
  TECH_SKILLS,
  normalizeSkillCategory
} from '../../data/skillsTaxonomy';
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '../../utils/storage';

const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const DEGREE_OPTIONS = [
  'Bachelor of Technology (B.Tech)',
  'Bachelor of Engineering (B.E.)',
  'Bachelor of Science (B.Sc Computer Science / IT)',
  'Bachelor of Computer Applications (BCA)',
  'Master of Technology (M.Tech)',
  'Master of Computer Applications (MCA)',
  'Other Degree'
];

const STEPS = [
  { id: 1, title: 'Personal', subtitle: 'Basic info' },
  { id: 2, title: 'Education', subtitle: 'Degree & college' },
  { id: 3, title: 'Skills', subtitle: 'Tech stack' },
  { id: 4, title: 'Experience', subtitle: 'Projects & internships' },
  { id: 5, title: 'Review', subtitle: 'Final check' }
];

export const RegistrationPage = () => {
  const navigate = useNavigate();
  const { completeRegistration } = useApp();

  // Load draft from LocalStorage if available
  const initialDraft = useMemo(() => {
    return getStorageItem(STORAGE_KEYS.REGISTRATION_DRAFT, null);
  }, []);

  const [currentStep, setCurrentStep] = useState(() => initialDraft?.currentStep || 1);

  // Form State
  const [formData, setFormData] = useState(() => {
    if (initialDraft?.formData) {
      return initialDraft.formData;
    }
    return {
      personal: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        primaryRole: 'Software Development Engineer - I'
      },
      education: {
        college: '',
        institution: '',
        degree: 'Bachelor of Technology (B.Tech)',
        branch: 'Computer Science and Engineering',
        graduationYear: new Date().getFullYear().toString(),
        cgpa: ''
      },
      skills: [],
      projects: [],
      experience: []
    };
  });

  const [errors, setErrors] = useState({});

  // Persist draft to LocalStorage whenever form data or step changes
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.REGISTRATION_DRAFT, {
      currentStep,
      formData
    });
  }, [currentStep, formData]);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Step 1: Personal Handlers
  const handlePersonalChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Step 2: Education Handlers
  const handleEducationChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      education: {
        ...prev.education,
        [field]: value,
        ...(field === 'college' ? { institution: value } : {})
      }
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Step 3: Skills State & Handlers
  const [skillSearch, setSkillSearch] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('ALL');
  const [customSkillName, setCustomSkillName] = useState('');
  const [customSkillCategory, setCustomSkillCategory] = useState(SKILL_CATEGORY_LIST[0]);
  const [customSkillLevel, setCustomSkillLevel] = useState('Intermediate');
  const [customSkillError, setCustomSkillError] = useState('');

  const filteredTaxonomySkills = useMemo(() => {
    const query = skillSearch.toLowerCase().trim();
    return TECH_SKILLS.filter((skill) => {
      const matchesCategory =
        selectedCategoryTab === 'ALL' ||
        normalizeSkillCategory(skill.category) === selectedCategoryTab;
      const matchesSearch =
        !query ||
        skill.name.toLowerCase().includes(query) ||
        (skill.aliases && skill.aliases.some((a) => a.toLowerCase().includes(query)));
      return matchesCategory && matchesSearch;
    });
  }, [skillSearch, selectedCategoryTab]);

  const handleToggleTaxonomySkill = (skill) => {
    const exists = formData.skills.some(
      (s) => s.name.toLowerCase() === skill.name.toLowerCase()
    );

    if (exists) {
      setFormData((prev) => ({
        ...prev,
        skills: prev.skills.filter(
          (s) => s.name.toLowerCase() !== skill.name.toLowerCase()
        )
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        skills: [
          ...prev.skills,
          {
            name: skill.name,
            category: normalizeSkillCategory(skill.category),
            level: 'Intermediate'
          }
        ]
      }));
      if (errors.skills) {
        setErrors((prev) => ({ ...prev, skills: undefined }));
      }
    }
  };

  const handleSkillLevelChange = (skillName, newLevel) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.map((s) =>
        s.name.toLowerCase() === skillName.toLowerCase() ? { ...s, level: newLevel } : s
      )
    }));
  };

  const handleRemoveSkill = (skillName) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter(
        (s) => s.name.toLowerCase() !== skillName.toLowerCase()
      )
    }));
  };

  const handleAddCustomSkill = (e) => {
    e?.preventDefault();
    setCustomSkillError('');
    const trimmed = customSkillName.trim();
    if (!trimmed) {
      setCustomSkillError('Please enter a skill name');
      return;
    }

    const alreadyExists = formData.skills.some(
      (s) => s.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (alreadyExists) {
      setCustomSkillError(`"${trimmed}" is already added to your skills`);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      skills: [
        ...prev.skills,
        {
          name: trimmed,
          category: customSkillCategory,
          level: customSkillLevel
        }
      ]
    }));

    setCustomSkillName('');
    setCustomSkillError('');
    if (errors.skills) {
      setErrors((prev) => ({ ...prev, skills: undefined }));
    }
  };

  // Step 4: Projects & Experience Handlers
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    technologies: '',
    projectUrl: ''
  });
  const [projectError, setProjectError] = useState('');

  const [showExpForm, setShowExpForm] = useState(false);
  const [expForm, setExpForm] = useState({
    role: '',
    company: '',
    type: 'Internship',
    period: '',
    description: ''
  });
  const [expError, setExpError] = useState('');

  const handleSaveProject = () => {
    setProjectError('');
    if (!projectForm.name.trim()) {
      setProjectError('Project name is required');
      return;
    }
    if (!projectForm.description.trim()) {
      setProjectError('Please provide a brief description');
      return;
    }
    if (!projectForm.technologies.trim()) {
      setProjectError('Please list technologies used (e.g. React, Node.js)');
      return;
    }

    const newProj = {
      id: `proj-${Date.now()}`,
      name: projectForm.name.trim(),
      title: projectForm.name.trim(),
      description: projectForm.description.trim(),
      technologies: projectForm.technologies.trim(),
      techStack: projectForm.technologies.trim(),
      projectUrl: projectForm.projectUrl.trim(),
      liveUrl: projectForm.projectUrl.trim(),
      contribution: projectForm.description.trim(),
      bullets: [projectForm.description.trim()]
    };

    setFormData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProj]
    }));

    setProjectForm({ name: '', description: '', technologies: '', projectUrl: '' });
    setShowProjectForm(false);
  };

  const handleDeleteProject = (id) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id)
    }));
  };

  const handleSaveExp = () => {
    setExpError('');
    if (!expForm.role.trim()) {
      setExpError('Job role / title is required');
      return;
    }
    if (!expForm.company.trim()) {
      setExpError('Company / organization name is required');
      return;
    }

    const newExp = {
      id: `exp-${Date.now()}`,
      role: expForm.role.trim(),
      company: expForm.company.trim(),
      type: expForm.type || 'Internship',
      period: expForm.period.trim() || 'Recent',
      description: expForm.description.trim(),
      contribution: expForm.description.trim(),
      bullets: expForm.description.trim() ? [expForm.description.trim()] : []
    };

    setFormData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));

    setExpForm({ role: '', company: '', type: 'Internship', period: '', description: '' });
    setShowExpForm(false);
  };

  const handleDeleteExp = (id) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id)
    }));
  };

  // Step Validation Functions
  const validateStep1 = () => {
    const errs = {};
    if (!formData.personal.fullName || formData.personal.fullName.trim().length < 2) {
      errs.fullName = 'Full name is required (at least 2 characters)';
    }
    if (
      !formData.personal.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personal.email.trim())
    ) {
      errs.email = 'A valid email address is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    const college = formData.education.college || formData.education.institution || '';
    if (!college.trim() || college.trim().length < 2) {
      errs.college = 'College or University name is required';
    }
    if (!formData.education.degree || !formData.education.degree.trim()) {
      errs.degree = 'Degree is required';
    }
    if (!formData.education.branch || !formData.education.branch.trim()) {
      errs.branch = 'Branch / Specialization is required';
    }
    if (
      !formData.education.graduationYear ||
      !/^\d{4}$/.test(String(formData.education.graduationYear).trim())
    ) {
      errs.graduationYear = 'Enter a valid 4-digit graduation year (e.g. 2025)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs = {};
    if (!formData.skills || formData.skills.length === 0) {
      errs.skills = 'Please select or add at least one technical skill to continue';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Navigation Handlers
  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!validateStep3()) return;
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setCurrentStep(5);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Final Submission Handler
  const handleCompleteRegistration = () => {
    // Re-validate core fields
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }
    if (!validateStep2()) {
      setCurrentStep(2);
      return;
    }
    if (!validateStep3()) {
      setCurrentStep(3);
      return;
    }

    // Save profile and mark registration complete in AppContext + LocalStorage
    completeRegistration(formData);

    // Redirect to Dashboard
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      {/* Top Brand Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 block leading-tight">
                SkillMatch<span className="text-indigo-600"> AI</span>
              </span>
              <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">
                Career Setup and Onboarding
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/landing')}
              className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
            >
              Product Tour
            </button>
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
              Step {currentStep} of {STEPS.length}
            </span>
            <Badge variant="purple" size="sm">
              {STEPS[currentStep - 1]?.title}
            </Badge>
          </div>
        </div>

        {/* Progress Indicator Bar */}
        <div className="w-full bg-slate-100 h-1">
          <div
            className="bg-indigo-600 h-1 transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Multi-Step Form Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Step Navigation Pills */}
        <div className="mb-8">
          <div className="grid grid-cols-5 gap-2 sm:gap-4">
            {STEPS.map((step) => {
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    if (isCompleted) setCurrentStep(step.id);
                  }}
                  disabled={!isCompleted}
                  className={`text-left p-2.5 sm:p-3 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-white border-indigo-500 shadow-sm ring-1 ring-indigo-500'
                      : isCompleted
                      ? 'bg-white border-emerald-200 hover:border-emerald-300 cursor-pointer'
                      : 'bg-slate-50/60 border-slate-200/60 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-700'
                          : isCurrent
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : step.id}
                    </span>
                    <span
                      className={`text-xs font-bold truncate ${
                        isCurrent ? 'text-indigo-900' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate hidden sm:block pl-7">
                    {step.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* STEP 1: PERSONAL INFORMATION */}
        {/* ======================================================== */}
        {currentStep === 1 && (
          <Card className="p-6 sm:p-8 space-y-6 bg-white border-slate-200/90 shadow-sm">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-indigo-600 mb-1">
                <User className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Step 1 of 5
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Personal Information
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Tell us about yourself. This information will personalize your career workspace and populate your ATS resume.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  id="reg-fullName"
                  icon={User}
                  placeholder="e.g. John Doe"
                  value={formData.personal.fullName}
                  onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                  error={errors.fullName}
                  helperText="Required: Your legal first and last name"
                />

                <Input
                  label="Email Address *"
                  id="reg-email"
                  type="email"
                  icon={Mail}
                  placeholder="e.g. john.doe@example.com"
                  value={formData.personal.email}
                  onChange={(e) => handlePersonalChange('email', e.target.value)}
                  error={errors.email}
                  helperText="Required: For communication and resume header"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone Number (Optional)"
                  id="reg-phone"
                  icon={Phone}
                  placeholder="e.g. +91 98765 43210"
                  value={formData.personal.phone}
                  onChange={(e) => handlePersonalChange('phone', e.target.value)}
                  helperText="Optional: Useful for recruiter contact on your resume"
                />

                <Input
                  label="Current Location (Optional)"
                  id="reg-location"
                  icon={MapPin}
                  placeholder="e.g. Bangalore, India"
                  value={formData.personal.location}
                  onChange={(e) => handlePersonalChange('location', e.target.value)}
                  helperText="Optional: Your city / state / country"
                />
              </div>

              <Input
                label="Primary Target Role"
                id="reg-role"
                icon={Target}
                placeholder="e.g. Software Development Engineer - I (SDE-1)"
                value={formData.personal.primaryRole}
                onChange={(e) => handlePersonalChange('primaryRole', e.target.value)}
                helperText="Target tech job profile (can be updated anytime)"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <Button
                variant="primary"
                size="md"
                iconRight={ArrowRight}
                onClick={handleNext}
              >
                Continue to Education
              </Button>
            </div>
          </Card>
        )}

        {/* ======================================================== */}
        {/* STEP 2: EDUCATION */}
        {/* ======================================================== */}
        {currentStep === 2 && (
          <Card className="p-6 sm:p-8 space-y-6 bg-white border-slate-200/90 shadow-sm">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-indigo-600 mb-1">
                <GraduationCap className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Step 2 of 5
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Education Background
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Provide your degree and university details for campus placement readiness and ATS resume formatting.
              </p>
            </div>

            <div className="space-y-4">
              <Input
                label="College / University Name *"
                id="reg-college"
                icon={Building}
                placeholder="e.g. National Institute of Technology (NIT)"
                value={formData.education.college}
                onChange={(e) => handleEducationChange('college', e.target.value)}
                error={errors.college}
                helperText="Required: Full formal name of your institution"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">
                    Degree *
                  </label>
                  <input
                    type="text"
                    list="degree-presets"
                    className="block w-full rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
                    placeholder="e.g. Bachelor of Technology (B.Tech)"
                    value={formData.education.degree}
                    onChange={(e) => handleEducationChange('degree', e.target.value)}
                  />
                  <datalist id="degree-presets">
                    {DEGREE_OPTIONS.map((deg) => (
                      <option key={deg} value={deg} />
                    ))}
                  </datalist>
                  {errors.degree && <p className="text-xs text-rose-600">{errors.degree}</p>}
                </div>

                <Input
                  label="Branch / Specialization *"
                  id="reg-branch"
                  placeholder="e.g. Computer Science and Engineering"
                  value={formData.education.branch}
                  onChange={(e) => handleEducationChange('branch', e.target.value)}
                  error={errors.branch}
                  helperText="Required: Your major / discipline"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Graduation Year *"
                  id="reg-year"
                  type="number"
                  placeholder="e.g. 2025"
                  value={formData.education.graduationYear}
                  onChange={(e) => handleEducationChange('graduationYear', e.target.value)}
                  error={errors.graduationYear}
                  helperText="Required: Expected or completed 4-digit year"
                />

                <Input
                  label="Current CGPA / Percentage (Optional)"
                  id="reg-cgpa"
                  placeholder="e.g. 8.5 / 10.0"
                  value={formData.education.cgpa}
                  onChange={(e) => handleEducationChange('cgpa', e.target.value)}
                  helperText="Optional: Academic GPA or percentage"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="outline"
                size="md"
                icon={ArrowLeft}
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                iconRight={ArrowRight}
                onClick={handleNext}
              >
                Continue to Technical Skills
              </Button>
            </div>
          </Card>
        )}

        {/* ======================================================== */}
        {/* STEP 3: TECHNICAL SKILLS */}
        {/* ======================================================== */}
        {currentStep === 3 && (
          <Card className="p-6 sm:p-8 space-y-6 bg-white border-slate-200/90 shadow-sm">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-indigo-600 mb-1">
                <Code2 className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Step 3 of 5
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Select Your Technical Skills
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Select the programming languages, frameworks, databases, and tools you know. You can set proficiency levels and add custom skills.
              </p>
            </div>

            {/* Error banner if 0 skills */}
            {errors.skills && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errors.skills}</span>
              </div>
            )}

            {/* Selected Skills Tray */}
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Selected Skills ({formData.skills.length})
                  </span>
                  {formData.skills.length > 0 && (
                    <Badge variant="purple" size="xs">
                      {formData.skills.length} added
                    </Badge>
                  )}
                </div>
                {formData.skills.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, skills: [] }))}
                    className="text-xs text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {formData.skills.length === 0 ? (
                <div className="py-6 text-center text-slate-400 space-y-1">
                  <p className="text-xs font-medium text-slate-500">
                    No skills selected yet.
                  </p>
                  <p className="text-xs text-slate-400">
                    Click on the skills below or add your own custom skills.
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1">
                  {formData.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs text-xs font-medium text-slate-800"
                    >
                      <span className="font-semibold text-slate-900">{skill.name}</span>
                      
                      {/* Proficiency Selector */}
                      <select
                        value={skill.level || 'Intermediate'}
                        onChange={(e) => handleSkillLevelChange(skill.name, e.target.value)}
                        className={`text-xs font-semibold rounded px-1.5 py-0.5 border cursor-pointer focus:outline-none ${
                          skill.level === 'Advanced'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : skill.level === 'Intermediate'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {PROFICIENCY_LEVELS.map((lvl) => (
                          <option key={lvl} value={lvl}>
                            {lvl}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill.name)}
                        className="text-slate-400 hover:text-rose-600 transition-colors ml-0.5"
                        title="Remove skill"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Search & Category Filter */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search technical skills (e.g. Python, React, Docker, SQL)..."
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {skillSearch && (
                  <button
                    type="button"
                    onClick={() => setSkillSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Category tabs */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedCategoryTab('ALL')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    selectedCategoryTab === 'ALL'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Categories
                </button>
                {SKILL_CATEGORY_LIST.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategoryTab(cat)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      selectedCategoryTab === cat
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Skills Grid */}
              <div className="p-4 bg-white rounded-xl border border-slate-200/80 max-h-60 overflow-y-auto">
                <div className="flex flex-wrap gap-1.5">
                  {filteredTaxonomySkills.map((skill) => {
                    const isSelected = formData.skills.some(
                      (s) => s.name.toLowerCase() === skill.name.toLowerCase()
                    );

                    return (
                      <button
                        key={skill.id || skill.name}
                        type="button"
                        onClick={() => handleToggleTaxonomySkill(skill)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                            : 'bg-slate-50 text-slate-700 border border-slate-200/80 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200'
                        }`}
                      >
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <span>{skill.name}</span>
                      </button>
                    );
                  })}
                  {filteredTaxonomySkills.length === 0 && (
                    <div className="py-4 text-center text-xs text-slate-400 w-full">
                      No matching taxonomy skill found for "{skillSearch}". You can add it as a custom skill below!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Custom Skill Input Form */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Add Custom Skill
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    placeholder="Skill name (e.g. Next.js, Rust, Kafka)"
                    value={customSkillName}
                    onChange={(e) => setCustomSkillName(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="sm:col-span-3">
                  <select
                    value={customSkillCategory}
                    onChange={(e) => setCustomSkillCategory(e.target.value)}
                    className="w-full text-xs sm:text-sm px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {SKILL_CATEGORY_LIST.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <select
                    value={customSkillLevel}
                    onChange={(e) => setCustomSkillLevel(e.target.value)}
                    className="w-full text-xs sm:text-sm px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {PROFICIENCY_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Button
                    variant="secondary"
                    size="md"
                    className="w-full justify-center"
                    icon={Plus}
                    onClick={handleAddCustomSkill}
                  >
                    Add
                  </Button>
                </div>
              </div>
              {customSkillError && (
                <p className="text-xs text-rose-600">{customSkillError}</p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="outline"
                size="md"
                icon={ArrowLeft}
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                iconRight={ArrowRight}
                onClick={handleNext}
              >
                Continue to Projects & Experience
              </Button>
            </div>
          </Card>
        )}

        {/* ======================================================== */}
        {/* STEP 4: PROJECTS AND EXPERIENCE (OPTIONAL) */}
        {/* ======================================================== */}
        {currentStep === 4 && (
          <Card className="p-6 sm:p-8 space-y-6 bg-white border-slate-200/90 shadow-sm">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-indigo-600 mb-1">
                <FolderGit2 className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Step 4 of 5
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Projects and Experience
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Add projects or internships you have worked on. This step is <span className="font-semibold text-indigo-600">optional</span> for freshers.
                  </p>
                </div>
                <Badge variant="subtle" size="sm">
                  Optional Step
                </Badge>
              </div>
            </div>

            {/* SECTION A: PROJECTS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    Technical Projects ({formData.projects.length})
                  </h3>
                </div>
                {!showProjectForm && (
                  <Button
                    variant="outline"
                    size="xs"
                    icon={Plus}
                    onClick={() => setShowProjectForm(true)}
                  >
                    Add Project
                  </Button>
                )}
              </div>

              {/* Inline Project Form */}
              {showProjectForm && (
                <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/30 space-y-3">
                  <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider block">
                    New Technical Project
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Project Name *"
                      placeholder="e.g. E-Commerce Microservices Platform"
                      value={projectForm.name}
                      onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                    />
                    <Input
                      label="Technologies Used *"
                      placeholder="e.g. React, Node.js, Express, PostgreSQL"
                      value={projectForm.technologies}
                      onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                    />
                  </div>

                  <Textarea
                    label="Description & Contributions *"
                    rows={2}
                    placeholder="Describe what you built, architecture decisions, and performance outcomes..."
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  />

                  <Input
                    label="Project URL (Optional)"
                    placeholder="e.g. https://github.com/yourname/project"
                    value={projectForm.projectUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, projectUrl: e.target.value })}
                  />

                  {projectError && <p className="text-xs text-rose-600">{projectError}</p>}

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => setShowProjectForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="xs"
                      icon={Check}
                      onClick={handleSaveProject}
                    >
                      Save Project
                    </Button>
                  </div>
                </div>
              )}

              {/* Projects List */}
              {formData.projects.length > 0 ? (
                <div className="space-y-2.5">
                  {formData.projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-3.5 rounded-xl border border-slate-200/80 bg-white flex items-start justify-between gap-3 shadow-2xs"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 truncate">
                            {proj.name}
                          </span>
                          {proj.projectUrl && (
                            <a
                              href={proj.projectUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {proj.description}
                        </p>
                        <p className="text-xs font-mono text-indigo-700">
                          {proj.technologies}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteProject(proj.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                !showProjectForm && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center text-xs text-slate-400">
                    No projects added yet. Freshers can skip this step or add a project anytime later.
                  </div>
                )
              )}
            </div>

            {/* SECTION B: EXPERIENCE */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    Internships & Experience ({formData.experience.length})
                  </h3>
                </div>
                {!showExpForm && (
                  <Button
                    variant="outline"
                    size="xs"
                    icon={Plus}
                    onClick={() => setShowExpForm(true)}
                  >
                    Add Experience
                  </Button>
                )}
              </div>

              {/* Inline Experience Form */}
              {showExpForm && (
                <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/30 space-y-3">
                  <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider block">
                    New Work Experience / Internship
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Job Role / Title *"
                      placeholder="e.g. Software Engineering Intern"
                      value={expForm.role}
                      onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                    />
                    <Input
                      label="Company / Organization *"
                      placeholder="e.g. Acme Tech Labs"
                      value={expForm.company}
                      onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Select
                      label="Experience Type"
                      options={['Internship', 'Full-time', 'Part-time', 'Freelance']}
                      value={expForm.type}
                      onChange={(e) => setExpForm({ ...expForm, type: e.target.value })}
                    />
                    <Input
                      label="Duration / Period"
                      placeholder="e.g. May 2024 - Jul 2024"
                      value={expForm.period}
                      onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                    />
                  </div>

                  <Textarea
                    label="Description of Contributions"
                    rows={2}
                    placeholder="Key responsibilities, features developed, and tools utilized..."
                    value={expForm.description}
                    onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                  />

                  {expError && <p className="text-xs text-rose-600">{expError}</p>}

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => setShowExpForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="xs"
                      icon={Check}
                      onClick={handleSaveExp}
                    >
                      Save Experience
                    </Button>
                  </div>
                </div>
              )}

              {/* Experience List */}
              {formData.experience.length > 0 ? (
                <div className="space-y-2.5">
                  {formData.experience.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-3.5 rounded-xl border border-slate-200/80 bg-white flex items-start justify-between gap-3 shadow-2xs"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 truncate">
                            {exp.role}
                          </span>
                          <span className="text-xs text-slate-500">at {exp.company}</span>
                          <Badge variant="outline" size="xs">
                            {exp.type}
                          </Badge>
                        </div>
                        {exp.period && (
                          <span className="text-xs text-slate-400 block font-mono">
                            {exp.period}
                          </span>
                        )}
                        {exp.description && (
                          <p className="text-xs text-slate-600 line-clamp-2">
                            {exp.description}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteExp(exp.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Delete experience"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                !showExpForm && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center text-xs text-slate-400">
                    No work experience added. Freshers can skip this step or add experience later.
                  </div>
                )
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="outline"
                size="md"
                icon={ArrowLeft}
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                iconRight={ArrowRight}
                onClick={handleNext}
              >
                {formData.projects.length === 0 && formData.experience.length === 0
                  ? 'Skip & Review'
                  : 'Continue to Final Review'}
              </Button>
            </div>
          </Card>
        )}

        {/* ======================================================== */}
        {/* STEP 5: FINAL REVIEW */}
        {/* ======================================================== */}
        {currentStep === 5 && (
          <Card className="p-6 sm:p-8 space-y-6 bg-white border-slate-200/90 shadow-sm">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-indigo-600 mb-1">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Step 5 of 5
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Review Your Profile
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Please verify your details. You can click Edit on any section to make corrections before entering the dashboard.
              </p>
            </div>

            {/* REVIEW SECTIONS */}
            <div className="space-y-4">
              {/* Card 1: Personal Details */}
              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Personal Details
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    icon={Pencil}
                    onClick={() => setCurrentStep(1)}
                  >
                    Edit
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block">Full Name:</span>
                    <span className="font-semibold text-slate-800">{formData.personal.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Email:</span>
                    <span className="font-semibold text-slate-800">{formData.personal.email}</span>
                  </div>
                  {formData.personal.phone && (
                    <div>
                      <span className="text-slate-400 block">Phone:</span>
                      <span className="font-semibold text-slate-800">{formData.personal.phone}</span>
                    </div>
                  )}
                  {formData.personal.location && (
                    <div>
                      <span className="text-slate-400 block">Location:</span>
                      <span className="font-semibold text-slate-800">{formData.personal.location}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400 block">Target Role:</span>
                    <span className="font-semibold text-indigo-700">{formData.personal.primaryRole}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Education */}
              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Education
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    icon={Pencil}
                    onClick={() => setCurrentStep(2)}
                  >
                    Edit
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block">College / University:</span>
                    <span className="font-semibold text-slate-800">{formData.education.college}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Degree:</span>
                    <span className="font-semibold text-slate-800">{formData.education.degree}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Branch / Major:</span>
                    <span className="font-semibold text-slate-800">{formData.education.branch}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Graduation Year:</span>
                    <span className="font-semibold text-slate-800">{formData.education.graduationYear}</span>
                  </div>
                  {formData.education.cgpa && (
                    <div>
                      <span className="text-slate-400 block">CGPA / Score:</span>
                      <span className="font-semibold text-slate-800">{formData.education.cgpa}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card 3: Technical Skills */}
              <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Technical Skills ({formData.skills.length})
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    icon={Pencil}
                    onClick={() => setCurrentStep(3)}
                  >
                    Edit
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.skills.map((s) => (
                    <span
                      key={s.name}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-white border border-slate-200 text-slate-800"
                    >
                      <span>{s.name}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold">
                        {s.level}
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Card 4: Projects & Experience */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Projects ({formData.projects.length}) and Experience ({formData.experience.length})
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    icon={Pencil}
                    onClick={() => setCurrentStep(4)}
                  >
                    Edit
                  </Button>
                </div>
                {formData.projects.length === 0 && formData.experience.length === 0 ? (
                  <p className="text-xs text-slate-400">
                    Fresher mode: No projects or internships added. You can add them later from My Profile or Resume Builder.
                  </p>
                ) : (
                  <div className="space-y-1.5 text-xs">
                    {formData.projects.map((p) => (
                      <div key={p.id} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span className="font-semibold text-slate-800">{p.name}</span>
                        <span className="text-slate-400 text-xs">({p.technologies})</span>
                      </div>
                    ))}
                    {formData.experience.map((e) => (
                      <div key={e.id} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="font-semibold text-slate-800">{e.role}</span>
                        <span className="text-slate-500">at {e.company}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submission CTA */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Button
                variant="outline"
                size="md"
                icon={ArrowLeft}
                onClick={handleBack}
              >
                Back to Projects
              </Button>

              <Button
                variant="primary"
                size="lg"
                icon={Sparkles}
                onClick={handleCompleteRegistration}
                className="w-full sm:w-auto shadow-md"
              >
                Complete Registration & Explore Dashboard
              </Button>
            </div>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-slate-200/60 text-center text-xs text-slate-400 bg-white">
        SkillMatch AI • Career Readiness Platform • All data stored securely in your browser LocalStorage
      </footer>
    </div>
  );
};
