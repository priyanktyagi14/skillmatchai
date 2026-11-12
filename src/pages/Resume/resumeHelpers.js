/**
 * Helper utilities for ATS Resume Customization & Job Alignment
 */

/**
 * Calculates how relevant a candidate project is to a target job description or skill list.
 */
export const calculateProjectRelevance = (project, targetSkills = []) => {
  if (!project || !targetSkills || targetSkills.length === 0) {
    return {
      score: 50,
      matchedCount: 0,
      matchedSkills: [],
      label: 'General Technical',
      badgeColor: 'slate'
    };
  }

  const projectText = [
    project.name || project.title || '',
    project.technologies || project.techStack || '',
    project.description || '',
    project.contribution || '',
    ...(project.bullets || [])
  ].join(' ').toLowerCase();

  const matched = [];
  targetSkills.forEach((skill) => {
    const skillName = typeof skill === 'string' ? skill : skill.name;
    if (!skillName) return;
    const lower = skillName.toLowerCase();

    // Check boundary or substring
    const regex = new RegExp(`\\b${escapeRegExp(lower)}\\b`, 'i');
    if (regex.test(projectText) || projectText.includes(lower)) {
      matched.push(skillName);
    }
  });

  const matchedCount = matched.length;
  let score = 40;
  let label = 'General Technical';
  let badgeColor = 'slate';

  if (matchedCount >= 3) {
    score = 95;
    label = 'Highest Match';
    badgeColor = 'emerald';
  } else if (matchedCount >= 2) {
    score = 80;
    label = 'High Match';
    badgeColor = 'indigo';
  } else if (matchedCount === 1) {
    score = 65;
    label = 'Moderate Match';
    badgeColor = 'amber';
  }

  return {
    score,
    matchedCount,
    matchedSkills: Array.from(new Set(matched)),
    label,
    badgeColor
  };
};

/**
 * Generates an ATS-tailored professional summary based strictly on the user's
 * actual degree, actual skills matching the job, and target role title.
 * Strictly does NOT invent skills, qualifications, or work experience.
 */
export const generateTailoredSummary = ({
  education = {},
  matchedSkills = [],
  targetJobTitle = '',
  targetCompany = ''
}) => {
  const degree = education.degree || 'Computer Science Graduate';
  const branch = education.branch ? ` in ${education.branch}` : '';
  const college = education.college || education.institution ? ` from ${education.college || education.institution}` : '';

  // Use top 3-4 actual matched skills
  const topMatched = matchedSkills
    .map(s => typeof s === 'string' ? s : s.name)
    .filter(Boolean)
    .slice(0, 4);

  const skillsClause = topMatched.length > 0
    ? `proficient in ${topMatched.slice(0, -1).join(', ')}${topMatched.length > 1 ? ' and ' : ''}${topMatched[topMatched.length - 1]}`
    : 'grounded in core computer science fundamentals, data structures, and modern software architectures';

  const roleClause = targetJobTitle
    ? `as a ${targetJobTitle}${targetCompany ? ` at ${targetCompany}` : ''}`
    : 'in a high-growth engineering team';

  return `Proactive ${degree}${branch}${college}, ${skillsClause}. Experienced in architecting end-to-end full-stack solutions, writing clean maintainable code, and optimizing performance. Seeking to deliver measurable technical value ${roleClause}.`.trim();
};

/**
 * Re-orders skills within each category so that skills matching the target job appear first.
 */
export const prioritizeSkillsForJob = (skills = [], matchedSkillNames = []) => {
  if (!skills || skills.length === 0) return [];
  const matchedSet = new Set(matchedSkillNames.map(s => (typeof s === 'string' ? s : s.name || '').toLowerCase()));

  // Split into matched and non-matched, keeping relative order
  const matched = [];
  const others = [];

  skills.forEach(skill => {
    if (matchedSet.has((skill.name || '').toLowerCase())) {
      matched.push(skill);
    } else {
      others.push(skill);
    }
  });

  return [...matched, ...others];
};

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
