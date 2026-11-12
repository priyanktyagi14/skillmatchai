/**
 * Utility to calculate user profile completion percentage and section breakdown.
 * Evaluates core required fields, technical skills, projects, experience, and links.
 */

export function calculateProfileCompletion(profile) {
  if (!profile) {
    return {
      percentage: 0,
      isComplete: false,
      sections: {
        personal: { score: 0, max: 35, completed: false, count: 0, total: 7 },
        skills: { score: 0, max: 25, completed: false, count: 0, total: 5 },
        projects: { score: 0, max: 20, completed: false, count: 0, total: 1 },
        experience: { score: 0, max: 10, completed: false, count: 0, total: 1 },
        links: { score: 0, max: 10, completed: false, count: 0, total: 2 }
      },
      checklist: [],
      missingItems: ['Complete basic profile information']
    };
  }

  const {
    personal = {},
    education = {},
    skills = [],
    projects = [],
    experience = []
  } = profile;

  // 1. Profile Information (Max 35 points)
  // Full Name, Email, Phone, College Name, Degree, Branch, Graduation Year
  const collegeName = education.college || education.institution || personal.college;
  const personalFields = [
    { name: 'Full name', valid: Boolean(personal.fullName && personal.fullName.trim().length >= 2) },
    { name: 'Email', valid: Boolean(personal.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email)) },
    { name: 'Phone number', valid: Boolean(personal.phone && personal.phone.trim().length >= 7) },
    { name: 'College name', valid: Boolean(collegeName && collegeName.trim().length >= 2) },
    { name: 'Degree', valid: Boolean(education.degree && education.degree.trim().length >= 2) },
    { name: 'Branch / specialization', valid: Boolean(education.branch && education.branch.trim().length >= 2) },
    { name: 'Graduation year', valid: Boolean(education.graduationYear && /^\d{4}$/.test(String(education.graduationYear).trim())) }
  ];

  const validPersonalCount = personalFields.filter(f => f.valid).length;
  const personalScore = Math.round((validPersonalCount / personalFields.length) * 35);
  const personalCompleted = validPersonalCount === personalFields.length;

  // 2. Technical Skills (Max 25 points)
  // Need at least 1 skill (8 pts), 3 skills (16 pts), 6+ skills (25 pts)
  const skillsCount = Array.isArray(skills) ? skills.length : 0;
  let skillsScore = 0;
  if (skillsCount >= 6) skillsScore = 25;
  else if (skillsCount >= 3) skillsScore = 18;
  else if (skillsCount >= 1) skillsScore = 10;
  const skillsCompleted = skillsCount >= 3;

  // 3. Projects (Max 20 points)
  // Need projects with name, description, technologies, individual contribution
  const validProjects = (projects || []).filter(p => {
    const hasName = Boolean((p.name || p.title) && (p.name || p.title).trim());
    const hasDesc = Boolean(p.description && p.description.trim().length >= 10);
    const hasTech = Boolean((p.technologies || p.techStack) && (p.technologies || p.techStack).trim());
    const hasContribution = Boolean(p.contribution && p.contribution.trim().length >= 5) || (p.bullets && p.bullets.length > 0);
    return hasName && (hasDesc || hasTech || hasContribution);
  });

  let projectsScore = 0;
  if (validProjects.length >= 2) projectsScore = 20;
  else if (validProjects.length === 1) projectsScore = 14;
  else if (projects.length > 0) projectsScore = 8;
  const projectsCompleted = validProjects.length >= 1;

  // 4. Experience / Internships (Max 10 points)
  const experienceCount = Array.isArray(experience) ? experience.length : 0;
  let expScore = 0;
  if (experienceCount >= 1) expScore = 10;
  const experienceCompleted = experienceCount >= 1;

  // 5. Professional Social Links (Max 10 points)
  // LinkedIn URL (optional, 5 pts), GitHub URL (optional, 5 pts)
  let linksScore = 0;
  const hasLinkedIn = Boolean(personal.linkedin && personal.linkedin.trim().length > 8);
  const hasGitHub = Boolean(personal.github && personal.github.trim().length > 8);
  if (hasLinkedIn) linksScore += 5;
  if (hasGitHub) linksScore += 5;
  const linksCompleted = hasLinkedIn && hasGitHub;

  const totalScore = Math.min(100, personalScore + skillsScore + projectsScore + expScore + linksScore);

  // Missing items for user guidance
  const missingItems = [];
  personalFields.filter(f => !f.valid).forEach(f => {
    missingItems.push(`Provide your ${f.name.toLowerCase()}`);
  });
  if (skillsCount < 3) {
    missingItems.push(`Add at least ${3 - skillsCount} more technical skill(s)`);
  }
  if (validProjects.length === 0) {
    missingItems.push('Add at least one technical project with technologies and your contribution');
  }
  if (experienceCount === 0) {
    missingItems.push('Add an internship or work experience entry');
  }
  if (!hasLinkedIn) {
    missingItems.push('Add your LinkedIn profile link');
  }
  if (!hasGitHub) {
    missingItems.push('Add your GitHub profile link');
  }

  // Visual checklist items
  const checklist = [
    {
      id: 'personal',
      label: 'Profile Information',
      detail: `${validPersonalCount}/${personalFields.length} completed`,
      completed: personalCompleted,
      weight: 35
    },
    {
      id: 'skills',
      label: 'Technical Skills',
      detail: `${skillsCount} skill${skillsCount === 1 ? '' : 's'} added`,
      completed: skillsCompleted,
      weight: 25
    },
    {
      id: 'projects',
      label: 'Projects',
      detail: `${projects.length} project${projects.length === 1 ? '' : 's'}`,
      completed: projectsCompleted,
      weight: 20
    },
    {
      id: 'experience',
      label: 'Experience',
      detail: `${experienceCount} item${experienceCount === 1 ? '' : 's'}`,
      completed: experienceCompleted,
      weight: 10
    },
    {
      id: 'links',
      label: 'LinkedIn & GitHub',
      detail: hasLinkedIn && hasGitHub ? 'Both linked' : hasLinkedIn ? 'LinkedIn linked' : hasGitHub ? 'GitHub linked' : 'None linked',
      completed: linksCompleted,
      weight: 10
    }
  ];

  return {
    percentage: totalScore,
    isComplete: totalScore >= 90,
    sections: {
      personal: { score: personalScore, max: 35, completed: personalCompleted, count: validPersonalCount, total: personalFields.length },
      skills: { score: skillsScore, max: 25, completed: skillsCompleted, count: skillsCount, total: 3 },
      projects: { score: projectsScore, max: 20, completed: projectsCompleted, count: validProjects.length, total: 2 },
      experience: { score: expScore, max: 10, completed: experienceCompleted, count: experienceCount, total: 1 },
      links: { score: linksScore, max: 10, completed: linksCompleted, count: (hasLinkedIn ? 1 : 0) + (hasGitHub ? 1 : 0), total: 2 }
    },
    checklist,
    missingItems
  };
}

