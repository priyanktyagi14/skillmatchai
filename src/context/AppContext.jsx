import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { EMPTY_USER_PROFILE, DEFAULT_USER_PROFILE } from '../data/initialProfile';
import { SAMPLE_JOB_TEMPLATES } from '../data/jobTemplates';
import { PRESET_ROADMAPS } from '../data/roadmapsData';
import { STORAGE_KEYS, getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage';
import { extractSkillsFromText, analyzeSkillMatch, runJobDescriptionAnalysis } from '../utils/matcherEngine';
import { calculateProfileCompletion } from '../utils/profileCompletion';
import { normalizeSkillCategory } from '../data/skillsTaxonomy';

const AppContext = createContext(null);

// Helper to normalize and ensure full backwards & cross-field compatibility
const normalizeProfileData = (rawProfile) => {
  if (!rawProfile) return EMPTY_USER_PROFILE;

  const normalized = {
    ...EMPTY_USER_PROFILE,
    ...rawProfile,
    personal: {
      ...EMPTY_USER_PROFILE.personal,
      ...(rawProfile.personal || {})
    },
    education: {
      ...EMPTY_USER_PROFILE.education,
      ...(rawProfile.education || {})
    },
    targetPreferences: {
      ...EMPTY_USER_PROFILE.targetPreferences,
      ...(rawProfile.targetPreferences || {})
    },
    skills: Array.isArray(rawProfile.skills)
      ? rawProfile.skills.map((s) => ({
          name: s.name,
          category: normalizeSkillCategory(s.category),
          level: s.level || 'Intermediate'
        }))
      : [],
    projects: Array.isArray(rawProfile.projects)
      ? rawProfile.projects.map((p, idx) => ({
          ...p,
          id: p.id || `proj-${idx}-${Date.now()}`,
          name: p.name || p.title || `Project ${idx + 1}`,
          title: p.title || p.name || `Project ${idx + 1}`,
          description: p.description || (p.bullets ? p.bullets.join(' ') : ''),
          technologies: p.technologies || p.techStack || '',
          techStack: p.techStack || p.technologies || '',
          projectUrl: p.projectUrl || p.liveUrl || p.githubUrl || '',
          liveUrl: p.liveUrl || p.projectUrl || '',
          githubUrl: p.githubUrl || '',
          contribution: p.contribution || (p.bullets ? p.bullets.join('. ') : '')
        }))
      : [],
    experience: Array.isArray(rawProfile.experience)
      ? rawProfile.experience.map((e, idx) => ({
          ...e,
          id: e.id || `exp-${idx}-${Date.now()}`,
          role: e.role || '',
          company: e.company || '',
          type: e.type || 'Internship',
          location: e.location || '',
          period: e.period || '',
          description: e.description || e.contribution || (e.bullets ? e.bullets.join('. ') : ''),
          contribution: e.contribution || e.description || '',
          bullets: Array.isArray(e.bullets) ? e.bullets : []
        }))
      : [],
    certifications: Array.isArray(rawProfile.certifications)
      ? rawProfile.certifications.map((c, idx) => ({
          ...c,
          id: c.id || `cert-${idx}-${Date.now()}`,
          name: c.name || '',
          issuer: c.issuer || '',
          year: c.year || '',
          url: c.url || c.link || ''
        }))
      : []
  };

  // Sync college and institution
  const collegeName = normalized.education.college || normalized.education.institution || '';
  normalized.education.college = collegeName;
  normalized.education.institution = collegeName;

  return normalized;
};

export const AppProvider = ({ children }) => {
  // 0. Registration status (Stored in LocalStorage)
  // Must be explicitly completed and not the old pre-existing dummy profile
  const [isRegistered, setIsRegistered] = useState(() => {
    const isCompleted = getStorageItem(STORAGE_KEYS.REGISTRATION_STATUS, false);
    if (isCompleted !== true) return false;
    const saved = getStorageItem(STORAGE_KEYS.PROFILE, null);
    if (!saved || !saved.personal?.fullName || saved.personal?.fullName === 'Aarav Sharma') {
      return false;
    }
    return true;
  });

  // 1. User Profile State (Stored in LocalStorage)
  const [profile, setProfile] = useState(() => {
    const isCompleted = getStorageItem(STORAGE_KEYS.REGISTRATION_STATUS, false);
    const saved = getStorageItem(STORAGE_KEYS.PROFILE, null);
    if (isCompleted === true && saved && saved.personal?.fullName && saved.personal?.fullName !== 'Aarav Sharma') {
      return normalizeProfileData(saved);
    }
    return EMPTY_USER_PROFILE;
  });

  // Automatically wipe legacy dummy data if user has not completed registration
  useEffect(() => {
    const isCompleted = getStorageItem(STORAGE_KEYS.REGISTRATION_STATUS, false);
    const saved = getStorageItem(STORAGE_KEYS.PROFILE, null);
    if (isCompleted !== true || saved?.personal?.fullName === 'Aarav Sharma') {
      removeStorageItem(STORAGE_KEYS.PROFILE);
      removeStorageItem(STORAGE_KEYS.REGISTRATION_STATUS);
      removeStorageItem(STORAGE_KEYS.SCANS);
      removeStorageItem(STORAGE_KEYS.SAVED_JOBS);
      removeStorageItem(STORAGE_KEYS.RESUME_ACTIVITY);
      removeStorageItem(STORAGE_KEYS.RESUME_CUSTOM);
    }
  }, []);

  // 2. Job Scans History State
  const [scans, setScans] = useState(() => {
    const savedScans = getStorageItem(STORAGE_KEYS.SCANS, []);
    return Array.isArray(savedScans) ? savedScans : [];
  });

  // 3. Saved Jobs Tracker State
  const [savedJobs, setSavedJobs] = useState(() => {
    const saved = getStorageItem(STORAGE_KEYS.SAVED_JOBS, []);
    return Array.isArray(saved) ? saved : [];
  });

  // 4. Roadmap Checklist Progress
  const [completedTasks, setCompletedTasks] = useState(() => {
    return getStorageItem(STORAGE_KEYS.ROADMAP_PROGRESS, {});
  });

  // 5. Learned Skills State (Persisted in LocalStorage)
  const [learnedSkills, setLearnedSkills] = useState(() => {
    return getStorageItem(STORAGE_KEYS.LEARNED_SKILLS, {});
  });

  // 6. Roadmap Skill Progress State (Persisted in LocalStorage)
  const [roadmapSkillStatus, setRoadmapSkillStatus] = useState(() => {
    return getStorageItem(STORAGE_KEYS.ROADMAP_SKILL_STATUS, {});
  });

  // 7. Active Scan selection for cross-page workflow
  const [activeScan, setActiveScan] = useState(() => scans[0] || null);

  // 8. Resume Activities Tracker State (Stored in LocalStorage)
  const [resumeActivities, setResumeActivities] = useState(() => {
    const saved = getStorageItem(STORAGE_KEYS.RESUME_ACTIVITY, []);
    return Array.isArray(saved) ? saved : [];
  });

  // Sync to LocalStorage on updates only if registered
  useEffect(() => {
    if (isRegistered) {
      setStorageItem(STORAGE_KEYS.PROFILE, profile);
    }
  }, [profile, isRegistered]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.SCANS, scans);
  }, [scans]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.SAVED_JOBS, savedJobs);
  }, [savedJobs]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.ROADMAP_PROGRESS, completedTasks);
  }, [completedTasks]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.LEARNED_SKILLS, learnedSkills);
  }, [learnedSkills]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.ROADMAP_SKILL_STATUS, roadmapSkillStatus);
  }, [roadmapSkillStatus]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.RESUME_ACTIVITY, resumeActivities);
  }, [resumeActivities]);

  // Reactive Profile Completion indicator calculation
  const profileCompletion = useMemo(() => {
    return calculateProfileCompletion(profile);
  }, [profile]);

  // Profile Actions
  const updateProfile = (updater) => {
    setProfile(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      return normalizeProfileData(next);
    });
  };

  const completeRegistration = (profileData) => {
    const normalized = normalizeProfileData(profileData);
    setProfile(normalized);
    setStorageItem(STORAGE_KEYS.PROFILE, normalized);
    setStorageItem(STORAGE_KEYS.REGISTRATION_STATUS, true);
    removeStorageItem(STORAGE_KEYS.REGISTRATION_DRAFT);
    setIsRegistered(true);
    return normalized;
  };

  const resetAllData = () => {
    removeStorageItem(STORAGE_KEYS.PROFILE);
    removeStorageItem(STORAGE_KEYS.REGISTRATION_STATUS);
    removeStorageItem(STORAGE_KEYS.REGISTRATION_DRAFT);
    removeStorageItem(STORAGE_KEYS.SCANS);
    removeStorageItem(STORAGE_KEYS.SAVED_JOBS);
    removeStorageItem(STORAGE_KEYS.RESUME_CUSTOM);
    removeStorageItem(STORAGE_KEYS.RESUME_ACTIVITY);
    removeStorageItem(STORAGE_KEYS.ROADMAP_PROGRESS);
    removeStorageItem(STORAGE_KEYS.ROADMAP_SKILL_STATUS);
    removeStorageItem(STORAGE_KEYS.LEARNED_SKILLS);

    setProfile(EMPTY_USER_PROFILE);
    setIsRegistered(false);
    setScans([]);
    setActiveScan(null);
    setSavedJobs([]);
    setResumeActivities([]);
    setCompletedTasks({});
    setLearnedSkills({});
    setRoadmapSkillStatus({});
  };

  const resetProfileToDefault = resetAllData;

  const addSkillToProfile = (skillObj) => {
    if (!skillObj || !skillObj.name) return;
    const normalizedSkill = {
      name: skillObj.name.trim(),
      category: normalizeSkillCategory(skillObj.category),
      level: skillObj.level || 'Intermediate'
    };

    setProfile(prev => {
      const exists = prev.skills.some(
        s => s.name.toLowerCase() === normalizedSkill.name.toLowerCase()
      );
      if (exists) {
        // Update level or category if already exists
        return {
          ...prev,
          skills: prev.skills.map(s =>
            s.name.toLowerCase() === normalizedSkill.name.toLowerCase()
              ? { ...s, ...normalizedSkill }
              : s
          )
        };
      }
      return {
        ...prev,
        skills: [...prev.skills, normalizedSkill]
      };
    });
  };

  const editSkillInProfile = (oldSkillName, updatedSkillObj) => {
    if (!oldSkillName || !updatedSkillObj || !updatedSkillObj.name) return;
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.map(s =>
        s.name.toLowerCase() === oldSkillName.toLowerCase()
          ? {
              name: updatedSkillObj.name.trim(),
              category: normalizeSkillCategory(updatedSkillObj.category),
              level: updatedSkillObj.level || s.level || 'Intermediate'
            }
          : s
      )
    }));
  };

  const removeSkillFromProfile = (skillName) => {
    if (!skillName) return;
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.name.toLowerCase() !== skillName.toLowerCase())
    }));
  };

  const addMultipleSkillsToProfile = (skillsArray) => {
    if (!Array.isArray(skillsArray) || skillsArray.length === 0) return;
    setProfile(prev => {
      const existingMap = new Map(prev.skills.map(s => [s.name.toLowerCase(), s]));
      skillsArray.forEach(item => {
        const name = (typeof item === 'string' ? item : item.name || '').trim();
        if (!name) return;
        const category = normalizeSkillCategory(item.category);
        const level = item.level || 'Intermediate';
        existingMap.set(name.toLowerCase(), { name, category, level });
      });
      return {
        ...prev,
        skills: Array.from(existingMap.values())
      };
    });
  };

  // Project Actions
  const addProject = (projectObj) => {
    const newProj = {
      id: `proj-${Date.now()}`,
      name: projectObj.name || projectObj.title || 'New Technical Project',
      title: projectObj.name || projectObj.title || 'New Technical Project',
      description: projectObj.description || '',
      technologies: projectObj.technologies || projectObj.techStack || '',
      techStack: projectObj.technologies || projectObj.techStack || '',
      projectUrl: projectObj.projectUrl || projectObj.liveUrl || '',
      liveUrl: projectObj.projectUrl || projectObj.liveUrl || '',
      githubUrl: projectObj.githubUrl || '',
      contribution: projectObj.contribution || '',
      bullets: projectObj.bullets || [
        projectObj.contribution || projectObj.description || 'Developed full-stack application.'
      ],
      date: projectObj.date || `${new Date().getFullYear()}`
    };

    setProfile(prev => ({
      ...prev,
      projects: [newProj, ...(prev.projects || [])]
    }));
  };

  const updateProject = (id, updatedObj) => {
    setProfile(prev => {
      const updatedProjects = (prev.projects || []).map(p => {
        if (p.id === id) {
          const merged = { ...p, ...updatedObj };
          merged.name = merged.name || merged.title;
          merged.title = merged.name;
          merged.technologies = merged.technologies || merged.techStack;
          merged.techStack = merged.technologies;
          merged.projectUrl = merged.projectUrl || merged.liveUrl;
          merged.liveUrl = merged.projectUrl;
          if (merged.contribution && (!merged.bullets || merged.bullets.length === 0)) {
            merged.bullets = [merged.contribution];
          }
          return merged;
        }
        return p;
      });
      return { ...prev, projects: updatedProjects };
    });
  };

  const deleteProject = (id) => {
    setProfile(prev => ({
      ...prev,
      projects: (prev.projects || []).filter(p => p.id !== id)
    }));
  };

  // Experience Actions
  const addExperience = (expObj) => {
    const newExp = {
      id: `exp-${Date.now()}`,
      role: expObj.role || 'Software Engineering Intern',
      company: expObj.company || 'Tech Company',
      type: expObj.type || 'Internship',
      location: expObj.location || 'Remote',
      period: expObj.period || 'Summer 2024',
      description: expObj.description || '',
      contribution: expObj.contribution || expObj.description || '',
      bullets: expObj.bullets || [
        expObj.contribution || expObj.description || 'Contributed to feature development and engineering tasks.'
      ]
    };

    setProfile(prev => ({
      ...prev,
      experience: [newExp, ...(prev.experience || [])]
    }));
  };

  const updateExperience = (id, updatedObj) => {
    setProfile(prev => {
      const updatedExp = (prev.experience || []).map(e => {
        if (e.id === id) {
          const merged = { ...e, ...updatedObj };
          if (merged.contribution && (!merged.bullets || merged.bullets.length === 0)) {
            merged.bullets = [merged.contribution];
          }
          return merged;
        }
        return e;
      });
      return { ...prev, experience: updatedExp };
    });
  };

  const deleteExperience = (id) => {
    setProfile(prev => ({
      ...prev,
      experience: (prev.experience || []).filter(e => e.id !== id)
    }));
  };

  // Certification Actions
  const addCertification = (certObj) => {
    const newCert = {
      id: `cert-${Date.now()}`,
      name: certObj.name || 'New Certification',
      issuer: certObj.issuer || '',
      year: certObj.year || `${new Date().getFullYear()}`,
      url: certObj.url || ''
    };

    setProfile(prev => ({
      ...prev,
      certifications: [...(prev.certifications || []), newCert]
    }));
  };

  const updateCertification = (id, updatedObj) => {
    setProfile(prev => ({
      ...prev,
      certifications: (prev.certifications || []).map(c =>
        c.id === id ? { ...c, ...updatedObj } : c
      )
    }));
  };

  const deleteCertification = (id) => {
    setProfile(prev => ({
      ...prev,
      certifications: (prev.certifications || []).filter(c => c.id !== id)
    }));
  };

  // Job Matching Action
  const performJobScan = (jobTitle, company, jdText, additionalMeta = {}) => {
    const scanRecord = runJobDescriptionAnalysis(
      jdText,
      profile.skills,
      {
        jobTitle,
        company,
        jobType: additionalMeta.jobType || 'Full-time',
        location: additionalMeta.location || 'India',
        salary: additionalMeta.salary || 'Competitive'
      }
    );

    setScans(prev => [scanRecord, ...prev]);
    setActiveScan(scanRecord);
    return scanRecord;
  };

  const deleteScan = (scanId) => {
    if (!scanId) return;
    setScans(prev => prev.filter(s => s.id !== scanId));
    setActiveScan(prev => (prev?.id === scanId ? null : prev));
  };

  const clearAllScans = () => {
    setScans([]);
    setActiveScan(null);
  };

  // Resume Activity Actions
  const logResumeActivity = (activity) => {
    if (!activity) return;
    const newEntry = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      ...activity
    };
    setResumeActivities(prev => [newEntry, ...(prev || [])].slice(0, 30));
  };

  const clearResumeActivities = () => {
    setResumeActivities([]);
  };

  // Saved Jobs Actions
  const addSavedJob = (job) => {
    setSavedJobs(prev => {
      const exists = prev.some(j => j.id === job.id);
      if (exists) return prev;
      return [job, ...prev];
    });
  };

  const updateSavedJobStatus = (id, newStatus) => {
    setSavedJobs(prev => prev.map(job => (job.id === id ? { ...job, status: newStatus } : job)));
  };

  const updateSavedJobNotes = (id, notes) => {
    setSavedJobs(prev => prev.map(job => (job.id === id ? { ...job, notes } : job)));
  };

  const deleteSavedJob = (id) => {
    setSavedJobs(prev => prev.filter(job => job.id !== id));
  };

  // Roadmap Progress Actions
  const toggleTaskCompletion = (taskId) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  // Learning Status Actions (Persisted in LocalStorage)
  const markSkillAsLearned = (skillOrName, targetLevel = 'Intermediate', metadata = {}) => {
    const skillName = typeof skillOrName === 'string' ? skillOrName.trim() : skillOrName?.name?.trim();
    if (!skillName) return;

    const lowerName = skillName.toLowerCase();
    const category = typeof skillOrName === 'object' ? skillOrName.category : null;

    setLearnedSkills(prev => ({
      ...prev,
      [lowerName]: {
        name: skillName,
        category: category || 'Tools and Technologies',
        level: targetLevel,
        learnedAt: new Date().toISOString(),
        ...metadata
      }
    }));

    // Add or update in profile so match calculations and profile sync reactively
    addSkillToProfile({
      name: skillName,
      category: category || 'Tools and Technologies',
      level: targetLevel
    });
  };

  const unmarkSkillAsLearned = (skillName) => {
    if (!skillName) return;
    const lowerName = skillName.trim().toLowerCase();
    setLearnedSkills(prev => {
      const copy = { ...prev };
      delete copy[lowerName];
      return copy;
    });
  };

  const isSkillLearned = (skillName) => {
    if (!skillName) return false;
    return Boolean(learnedSkills[skillName.trim().toLowerCase()]);
  };

  // 8. Roadmap Skill Status Actions (Dynamic Roadmap Integration)
  const updateSkillRoadmapStatus = (skillOrName, status = 'in_progress', meta = {}) => {
    const skillName = typeof skillOrName === 'string' ? skillOrName.trim() : skillOrName?.name?.trim();
    if (!skillName) return;
    const lowerName = skillName.toLowerCase();
    const category = typeof skillOrName === 'object' ? skillOrName.category : null;

    setRoadmapSkillStatus(prev => ({
      ...prev,
      [lowerName]: {
        name: skillName,
        status, // 'not_started' | 'in_progress' | 'completed'
        category: category || prev[lowerName]?.category || 'Tools and Technologies',
        updatedAt: new Date().toISOString(),
        ...meta
      }
    }));

    // If marked as completed, automatically add to user profile & learnedSkills
    // so Job Matcher, Skill Gap, and Dashboard reflect the achievement dynamically!
    if (status === 'completed') {
      markSkillAsLearned(skillOrName, 'Intermediate', {
        source: 'learning_roadmap',
        ...meta
      });
    }
  };

  const getSkillRoadmapStatus = (skillOrName) => {
    const skillName = typeof skillOrName === 'string' ? skillOrName.trim() : skillOrName?.name?.trim();
    if (!skillName) return 'not_started';
    const lowerName = skillName.toLowerCase();

    if (roadmapSkillStatus[lowerName]?.status) {
      return roadmapSkillStatus[lowerName].status;
    }

    // Check if user already has this skill in profile
    const existsInProfile = profile.skills.some(
      s => s.name.toLowerCase() === lowerName
    );
    if (existsInProfile) {
      return 'completed';
    }

    return 'not_started';
  };

  const resetRoadmapSkillProgress = () => {
    setRoadmapSkillStatus({});
  };

  return (
    <AppContext.Provider
      value={{
        isRegistered,
        completeRegistration,
        resetAllData,
        profile,
        profileCompletion,
        updateProfile,
        resetProfileToDefault,
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
        deleteCertification,
        scans,
        activeScan,
        setActiveScan,
        performJobScan,
        deleteScan,
        clearAllScans,
        resumeActivities,
        logResumeActivity,
        clearResumeActivities,
        savedJobs,
        addSavedJob,
        updateSavedJobStatus,
        updateSavedJobNotes,
        deleteSavedJob,
        completedTasks,
        toggleTaskCompletion,
        learnedSkills,
        markSkillAsLearned,
        unmarkSkillAsLearned,
        isSkillLearned,
        roadmapSkillStatus,
        updateSkillRoadmapStatus,
        getSkillRoadmapStatus,
        resetRoadmapSkillProgress,
        roadmaps: PRESET_ROADMAPS,
        jobTemplates: SAMPLE_JOB_TEMPLATES
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
