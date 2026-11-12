import React, { useState, useEffect } from 'react';
import {
  Save,
  RotateCcw,
  User,
  Code2,
  FolderGit2,
  Briefcase,
  Award,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/common/Button';
import { Tabs } from '../../components/common/Tabs';
import { ProfileCompletionCard } from './ProfileCompletionCard';
import { ProfileInfoSection } from './ProfileInfoSection';
import { SkillsSection } from './SkillsSection';
import { ProjectsSection } from './ProjectsSection';
import { ExperienceSection } from './ExperienceSection';
import { CertificationsSection } from './CertificationsSection';

export const ProfilePage = () => {
  const {
    profile,
    profileCompletion,
    updateProfile,
    resetAllData,
    addSkillToProfile,
    editSkillInProfile,
    removeSkillFromProfile,
    addMultipleSkillsToProfile,
    addProject,
    updateProject,
    deleteProject,
    addExperience,
    updateExperience,
    deleteExperience,
    addCertification,
    updateCertification,
    deleteCertification
  } = useApp();

  const [formData, setFormData] = useState(profile);
  const [activeTab, setActiveTab] = useState('personal');
  const [showSavedAlert, setShowSavedAlert] = useState(false);
  const [validationAlert, setValidationAlert] = useState(null);
  const [errors, setErrors] = useState({});

  // Sync formData whenever context profile updates externally (e.g. on reset)
  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  // Personal fields updater
  const handlePersonalChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      personal: { ...(prev.personal || {}), [field]: value }
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Education fields updater
  const handleEducationChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      education: { ...(prev.education || {}), [field]: value }
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Validate Profile Information
  const validateForm = () => {
    const errs = {};
    const { personal = {}, education = {} } = formData;
    const college = education.college || education.institution || '';

    // Required Profile Information validations
    if (!personal.fullName || personal.fullName.trim().length < 2) {
      errs.fullName = 'Full name is required (minimum 2 characters)';
    }

    if (!personal.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email.trim())) {
      errs.email = 'Please provide a valid email address';
    }

    if (!personal.phone || personal.phone.trim().length < 7) {
      errs.phone = 'Valid phone number is required';
    }

    if (!college || college.trim().length < 2) {
      errs.college = 'College name is required';
    }

    if (!education.degree || education.degree.trim().length < 2) {
      errs.degree = 'Degree is required (e.g. B.Tech)';
    }

    if (!education.branch || education.branch.trim().length < 2) {
      errs.branch = 'Branch / specialization is required (e.g. Computer Science)';
    }

    if (!education.graduationYear || !/^\d{4}$/.test(String(education.graduationYear).trim())) {
      errs.graduationYear = 'Graduation year must be a 4-digit year (e.g. 2025)';
    }

    // Optional validations if filled
    if (personal.linkedin && personal.linkedin.trim()) {
      const val = personal.linkedin.trim().toLowerCase();
      if (!val.includes('linkedin.com') && !val.startsWith('http')) {
        errs.linkedin = 'Please provide a valid LinkedIn URL';
      }
    }

    if (personal.github && personal.github.trim()) {
      const val = personal.github.trim().toLowerCase();
      if (!val.includes('github.com') && !val.startsWith('http')) {
        errs.github = 'Please provide a valid GitHub URL';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Save full profile changes to LocalStorage and AppContext
  const handleSave = () => {
    const isValid = validateForm();
    if (!isValid) {
      setValidationAlert('Please fix the errors highlighted in the Profile Information form.');
      setActiveTab('personal');
      setTimeout(() => setValidationAlert(null), 5000);
      return;
    }

    updateProfile(formData);
    setShowSavedAlert(true);
    setValidationAlert(null);
    setTimeout(() => setShowSavedAlert(false), 3500);
  };

  // Direct handlers for skills
  const handleAddSkill = (skillObj) => {
    addSkillToProfile(skillObj);
    setFormData((prev) => ({
      ...prev,
      skills: [...(prev.skills || []).filter(s => s.name.toLowerCase() !== skillObj.name.toLowerCase()), skillObj]
    }));
  };

  const handleEditSkill = (oldName, updatedObj) => {
    editSkillInProfile(oldName, updatedObj);
    setFormData((prev) => ({
      ...prev,
      skills: (prev.skills || []).map(s =>
        s.name.toLowerCase() === oldName.toLowerCase() ? updatedObj : s
      )
    }));
  };

  const handleRemoveSkill = (skillName) => {
    removeSkillFromProfile(skillName);
    setFormData((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter(s => s.name.toLowerCase() !== skillName.toLowerCase())
    }));
  };

  const handleAddMultipleSkills = (skillsList) => {
    addMultipleSkillsToProfile(skillsList);
    setFormData((prev) => {
      const map = new Map((prev.skills || []).map(s => [s.name.toLowerCase(), s]));
      skillsList.forEach(s => map.set(s.name.toLowerCase(), s));
      return {
        ...prev,
        skills: Array.from(map.values())
      };
    });
  };

  // Direct handlers for projects
  const handleAddProject = (proj) => {
    addProject(proj);
  };

  const handleUpdateProject = (id, proj) => {
    updateProject(id, proj);
  };

  const handleDeleteProject = (id) => {
    deleteProject(id);
  };

  // Direct handlers for experience
  const handleAddExperience = (exp) => {
    addExperience(exp);
  };

  const handleUpdateExperience = (id, exp) => {
    updateExperience(id, exp);
  };

  const handleDeleteExperience = (id) => {
    deleteExperience(id);
  };

  // Direct handlers for certifications
  const handleAddCertification = (cert) => {
    addCertification(cert);
  };

  const handleUpdateCertification = (id, cert) => {
    updateCertification(id, cert);
  };

  const handleDeleteCertification = (id) => {
    deleteCertification(id);
  };

  // Tab definitions
  const profileTabs = [
    { id: 'personal', label: 'Profile Information', icon: User },
    { id: 'skills', label: 'Technical Skills', icon: Code2, count: formData.skills?.length || 0 },
    { id: 'projects', label: 'Projects', icon: FolderGit2, count: formData.projects?.length || 0 },
    { id: 'experience', label: 'Experience', icon: Briefcase, count: formData.experience?.length || 0 },
    { id: 'certifications', label: 'Certifications', icon: Award, count: formData.certifications?.length || 0 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            My Profile
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage your personal background, degree, 8-category technical stack, projects, and work experience.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={RotateCcw}
            onClick={() => {
              if (window.confirm('Are you sure you want to reset your profile and clear all registered data? You will be returned to the registration page to start fresh.')) {
                resetAllData();
                setErrors({});
              }
            }}
          >
            Reset Profile & Start Fresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={Save}
            onClick={handleSave}
          >
            Save Profile
          </Button>
        </div>
      </div>

      {/* Profile Completion Indicator */}
      <ProfileCompletionCard
        profileCompletion={profileCompletion}
        onNavigateSection={(secId) => {
          if (secId === 'links') setActiveTab('personal');
          else if (secId === 'personal') setActiveTab('personal');
          else if (secId === 'skills') setActiveTab('skills');
          else if (secId === 'projects') setActiveTab('projects');
          else if (secId === 'experience') setActiveTab('experience');
        }}
      />

      {/* Notifications */}
      {showSavedAlert && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">
              Profile successfully saved to browser LocalStorage and synced throughout SkillMatch AI.
            </span>
          </div>
        </div>
      )}

      {validationAlert && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-rose-800 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span className="font-semibold">{validationAlert}</span>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <Tabs
        tabs={profileTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
      />

      {/* TAB 1: PROFILE INFORMATION */}
      {activeTab === 'personal' && (
        <ProfileInfoSection
          formData={formData}
          errors={errors}
          onChangePersonal={handlePersonalChange}
          onChangeEducation={handleEducationChange}
        />
      )}

      {/* TAB 2: TECHNICAL SKILLS */}
      {activeTab === 'skills' && (
        <SkillsSection
          skills={formData.skills || []}
          onAddSkill={handleAddSkill}
          onEditSkill={handleEditSkill}
          onRemoveSkill={handleRemoveSkill}
          onAddMultipleSkills={handleAddMultipleSkills}
        />
      )}

      {/* TAB 3: PROJECTS */}
      {activeTab === 'projects' && (
        <ProjectsSection
          projects={formData.projects || []}
          onAddProject={handleAddProject}
          onUpdateProject={handleUpdateProject}
          onDeleteProject={handleDeleteProject}
        />
      )}

      {/* TAB 4: EXPERIENCE */}
      {activeTab === 'experience' && (
        <ExperienceSection
          experience={formData.experience || []}
          onAddExperience={handleAddExperience}
          onUpdateExperience={handleUpdateExperience}
          onDeleteExperience={handleDeleteExperience}
        />
      )}

      {/* TAB 5: CERTIFICATIONS */}
      {activeTab === 'certifications' && (
        <CertificationsSection
          certifications={formData.certifications || []}
          onAddCertification={handleAddCertification}
          onUpdateCertification={handleUpdateCertification}
          onDeleteCertification={handleDeleteCertification}
        />
      )}
    </div>
  );
};
