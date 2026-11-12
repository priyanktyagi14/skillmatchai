export const STORAGE_KEYS = {
  PROFILE: 'skillmatch_user_profile_v1',
  REGISTRATION_STATUS: 'skillmatch_registration_completed_v1',
  REGISTRATION_DRAFT: 'skillmatch_registration_draft_v1',
  SCANS: 'skillmatch_recent_scans_v1',
  SAVED_JOBS: 'skillmatch_saved_jobs_v1',
  ROADMAP_PROGRESS: 'skillmatch_roadmap_progress_v1',
  ROADMAP_SKILL_STATUS: 'skillmatch_roadmap_skill_status_v1',
  RESUME_CUSTOM: 'skillmatch_resume_draft_v1',
  APP_SETTINGS: 'skillmatch_settings_v1',
  LEARNED_SKILLS: 'skillmatch_learned_skills_v1',
  RESUME_ACTIVITY: 'skillmatch_resume_activity_v1'
};

export const getStorageItem = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
};

export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
};

export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(`Error removing ${key} from localStorage:`, err);
  }
};

