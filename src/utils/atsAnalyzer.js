// Strong action verbs preferred by technical ATS screeners and engineering hiring managers
export const STRONG_ACTION_VERBS = [
  'architected', 'engineered', 'implemented', 'designed', 'developed',
  'optimized', 'spearheaded', 'integrated', 'accelerated', 'automated',
  'reduced', 'built', 'deployed', 'orchestrated', 'scaled', 'refactored',
  'streamlined', 'secured', 'configured', 'constructed', 'solved'
];

/**
 * Checks if a bullet point contains quantifiable numbers or metrics
 */
export function hasQuantifiableMetrics(text = '') {
  // Matches percentages (e.g. 35%, 20.5%), multipliers (2x, 5x), millisecond latency (50ms), quantities (100+, 5,000, 10k)
  const regex = /(\d+[\d,.]*\s*(%|ms|k|m|x|\+|users|requests|qps|stars|records|hours|seconds|queries))/i;
  return regex.test(text) || /\b\d{2,}\b/.test(text);
}

/**
 * Checks if a bullet starts with a recognized power action verb
 */
export function startsWithActionVerb(text = '') {
  const firstWord = text.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '');
  return STRONG_ACTION_VERBS.includes(firstWord);
}

/**
 * Computes an ATS Compliance & Quality Score (0 - 100)
 */
export function evaluateResumeATS(profile) {
  if (!profile) return { score: 0, feedback: [], breakdown: {} };

  let score = 0;
  const feedback = [];
  const breakdown = {
    contact: 0,
    summary: 0,
    education: 0,
    skills: 0,
    projects: 0,
    impact: 0
  };

  // 1. Contact Info (max 15 pts)
  const { personal = {} } = profile;
  let contactPts = 0;
  if (personal.fullName) contactPts += 3;
  if (personal.email && personal.email.includes('@')) contactPts += 3;
  if (personal.phone) contactPts += 3;
  if (personal.linkedin) contactPts += 3;
  if (personal.github) contactPts += 3;
  breakdown.contact = contactPts;
  score += contactPts;

  if (!personal.linkedin || !personal.github) {
    feedback.push({
      type: 'warning',
      category: 'Contact',
      message: 'Add both GitHub and LinkedIn links. Technical recruiters prioritize verifiable profiles.'
    });
  }

  // 2. Summary Quality (max 15 pts)
  if (personal.summary && personal.summary.length >= 100) {
    breakdown.summary = 15;
    score += 15;
  } else if (personal.summary && personal.summary.length > 30) {
    breakdown.summary = 8;
    score += 8;
    feedback.push({
      type: 'suggestion',
      category: 'Summary',
      message: 'Expand your professional summary to 2-3 sentences highlighting your CS degree and key tech stack.'
    });
  } else {
    feedback.push({
      type: 'warning',
      category: 'Summary',
      message: 'Professional summary is missing. Write an ATS-friendly hook with your branch, degree and core technologies.'
    });
  }

  // 3. Education (max 15 pts)
  const { education = {} } = profile;
  let eduPts = 0;
  if (education.degree) eduPts += 4;
  if (education.branch) eduPts += 4;
  if (education.institution) eduPts += 4;
  if (education.graduationYear) eduPts += 3;
  breakdown.education = eduPts;
  score += eduPts;

  // 4. Skills Section (max 20 pts)
  const skillsList = profile.skills || [];
  if (skillsList.length >= 8) {
    breakdown.skills = 20;
    score += 20;
  } else if (skillsList.length >= 4) {
    breakdown.skills = 12;
    score += 12;
    feedback.push({
      type: 'suggestion',
      category: 'Skills',
      message: 'Add at least 8-12 technical skills categorized across Languages, Frameworks, and Databases.'
    });
  } else {
    breakdown.skills = 5;
    score += 5;
    feedback.push({
      type: 'critical',
      category: 'Skills',
      message: 'Insufficient skills listed. ATS scanners reject profiles with fewer than 5 core keywords.'
    });
  }

  // 5. Projects & Tech Stacks (max 20 pts)
  const rawProjects = profile.projects || [];
  const projectsList = rawProjects.filter(p => p.included !== false);
  let projPts = 0;
  if (projectsList.length >= 2) projPts += 12;
  else if (projectsList.length === 1) projPts += 6;

  const hasTechStacks = projectsList.every(p => (p.techStack || p.technologies) && (p.techStack || p.technologies).trim().length > 0);
  if (hasTechStacks && projectsList.length > 0) projPts += 8;
  breakdown.projects = projPts;
  score += projPts;

  if (projectsList.length < 2) {
    feedback.push({
      type: 'critical',
      category: 'Projects',
      message: 'BTech freshers need at least 2 featured technical projects with clear tech stacks.'
    });
  }

  // 6. Action Verbs & Quantifiable Metrics in Bullets (max 15 pts)
  const rawExperience = profile.experience || [];
  const experienceList = rawExperience.filter(e => e.included !== false);

  const allBullets = [
    ...projectsList.flatMap(p => p.bullets || (p.contribution ? [p.contribution] : [])),
    ...experienceList.flatMap(e => e.bullets || (e.contribution ? [e.contribution] : []))
  ];

  let strongVerbCount = 0;
  let metricCount = 0;

  allBullets.forEach(bullet => {
    if (startsWithActionVerb(bullet)) strongVerbCount++;
    if (hasQuantifiableMetrics(bullet)) metricCount++;
  });

  let impactPts = 0;
  if (strongVerbCount >= 3) impactPts += 8;
  else if (strongVerbCount >= 1) impactPts += 4;

  if (metricCount >= 2) impactPts += 7;
  else if (metricCount >= 1) impactPts += 4;

  breakdown.impact = impactPts;
  score += impactPts;

  if (metricCount < 2) {
    feedback.push({
      type: 'suggestion',
      category: 'Impact Metrics',
      message: 'Quantify your achievements in bullet points (e.g., "reduced latency by 35%", "handled 50+ users", "15+ sorting algorithms").'
    });
  }

  if (strongVerbCount < 3) {
    feedback.push({
      type: 'suggestion',
      category: 'Action Verbs',
      message: 'Start bullet points with strong engineering verbs like "Architected", "Engineered", "Implemented", "Optimized".'
    });
  }

  let grade = 'Needs Work';
  let badgeColor = 'rose';
  if (score >= 85) {
    grade = 'ATS Ready (Top 10%)';
    badgeColor = 'emerald';
  } else if (score >= 70) {
    grade = 'Competitive';
    badgeColor = 'indigo';
  } else if (score >= 50) {
    grade = 'Average';
    badgeColor = 'amber';
  }

  return {
    score: Math.min(100, score),
    grade,
    badgeColor,
    breakdown,
    feedback,
    metrics: {
      totalBullets: allBullets.length,
      strongVerbCount,
      metricCount
    }
  };
}

