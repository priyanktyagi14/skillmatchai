import { TECH_SKILLS, PREDEFINED_TECHNICAL_SKILLS, SKILL_CATEGORIES } from '../data/skillsTaxonomy.js';

// Escape regex special characters
export function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Section Header Detection Patterns
 * Matches headings for Mandatory / Required, Preferred / Bonus, or Neutral / Responsibilities
 */
export const MANDATORY_HEADER_REGEX = /^(?:#+\s*)?(?:required|must[\s-]have|essential|mandatory|minimum\s+qualifications|basic\s+qualifications|core\s+requirements|qualifications(?:\s*&|\s*and)?\s*requirements|what\s+you\s+need|requirements)[\w\s/&:,-]*$/i;
export const PREFERRED_HEADER_REGEX = /^(?:#+\s*)?(?:preferred|good[\s-]to[\s-]have|nice[\s-]to[\s-]have|bonus|desired|plus|optional|additional\s+skills|preferred\s+qualifications|preferred\s+skills)[\w\s/&:,-]*$/i;
export const NEUTRAL_HEADER_REGEX = /^(?:#+\s*)?(?:responsibilities|about\s+(?:the\s+role|us|company)|benefits|perks|what\s+you(?:'ll|\s+will)\s+do|overview|who\s+we\s+are)[\w\s/&:,-]*$/i;

/**
 * Context Phrase Indicators (Line-level or bullet-level)
 */
export const MANDATORY_PHRASE_REGEX = /\b(?:required|must[\s-]have|essential|mandatory|must\s+possess|must\s+be\s+proficient|minimum\s+requirement)\b/i;
export const PREFERRED_PHRASE_REGEX = /\b(?:preferred|good[\s-]to[\s-]have|nice[\s-]to[\s-]have|bonus|desired|plus\s+if)\b/i;

/**
 * Robust word-boundary matcher for skills in text, handling special symbols (C, C++, CI/CD, etc.)
 */
export function matchSkillInText(text, skill) {
  if (!text || !skill || !skill.aliases) return null;

  for (const alias of skill.aliases) {
    const lowerAlias = alias.toLowerCase();
    if (lowerAlias === 'c') {
      // Single character 'C': Ensure not preceded or followed by word char, +, #, or -
      const regex = /(?<![+#a-zA-Z0-9\-])c(?![+#a-zA-Z0-9])/i;
      if (regex.test(text)) return alias;
    } else if (lowerAlias === 'c++') {
      const regex = /(?:^|[^a-zA-Z0-9_])(?:c\+\+|cpp|c\s*plus\s*plus)(?=[^a-zA-Z0-9_]|$)/i;
      if (regex.test(text)) return alias;
    } else {
      const escaped = escapeRegExp(lowerAlias);
      const regex = new RegExp(`(^|[^a-zA-Z0-9_#+])${escaped}([^a-zA-Z0-9_#+]|$)`, 'i');
      if (regex.test(text)) return alias;
    }
  }
  return null;
}

/**
 * 1. Extract relevant technical skills from the job description.
 * 2. Recognize common variations and aliases.
 * 3. Identify mandatory skills using phrases like Required, Must Have, Essential and Mandatory.
 * 4. Identify preferred skills using phrases like Preferred, Good to Have, Bonus and Nice to Have.
 */
export function extractSkillsFromJobDescription(jdText, skillsDictionary = TECH_SKILLS) {
  if (!jdText || typeof jdText !== 'string' || !jdText.trim()) {
    return {
      allExtracted: [],
      mandatorySkills: [],
      preferredSkills: [],
      unspecifiedSkills: [],
      hasClearSeparation: false,
      summary: {
        total: 0,
        mandatory: 0,
        preferred: 0,
        byCategory: {}
      }
    };
  }

  const lines = jdText.split(/\r?\n/);
  let currentSection = 'unspecified';

  // Map of skill id -> { skill, contexts: Set<'mandatory'|'preferred'|'unspecified'>, matchedKeywords: Set }
  const detectedMap = new Map();

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    // Check if line acts as a section header
    if (MANDATORY_HEADER_REGEX.test(trimmedLine)) {
      currentSection = 'mandatory';
      return;
    }
    if (PREFERRED_HEADER_REGEX.test(trimmedLine)) {
      currentSection = 'preferred';
      return;
    }
    if (NEUTRAL_HEADER_REGEX.test(trimmedLine)) {
      currentSection = 'neutral';
      return;
    }

    // Process line segments (split by periods, semicolons, or bullet delimiters)
    // so inline clauses like "Required: Python. Preferred: Docker." are parsed accurately
    const segments = trimmedLine.split(/(?<=[.;])\s+/);

    segments.forEach((segment) => {
      const trimmedSegment = segment.trim();
      if (!trimmedSegment) return;

      let segmentContext = currentSection;
      if (MANDATORY_PHRASE_REGEX.test(trimmedSegment)) {
        segmentContext = 'mandatory';
      } else if (PREFERRED_PHRASE_REGEX.test(trimmedSegment)) {
        segmentContext = 'preferred';
      }

      // Check all skills in this segment
      for (const skill of skillsDictionary) {
        const matched = matchSkillInText(trimmedSegment, skill);
        if (matched) {
          if (!detectedMap.has(skill.id)) {
            detectedMap.set(skill.id, {
              ...skill,
              contexts: new Set(),
              matchedKeywords: new Set()
            });
          }
          const record = detectedMap.get(skill.id);
          record.matchedKeywords.add(matched);

          if (segmentContext === 'mandatory') {
            record.contexts.add('mandatory');
          } else if (segmentContext === 'preferred') {
            record.contexts.add('preferred');
          } else {
            record.contexts.add('unspecified');
          }
        }
      }
    });
  });

  // Full text fallback pass to ensure no skills missed in single-paragraph JDs
  for (const skill of skillsDictionary) {
    if (!detectedMap.has(skill.id)) {
      const matched = matchSkillInText(jdText, skill);
      if (matched) {
        detectedMap.set(skill.id, {
          ...skill,
          contexts: new Set(['unspecified']),
          matchedKeywords: new Set([matched])
        });
      }
    }
  }

  const allExtracted = [];
  const mandatorySkills = [];
  const preferredSkills = [];
  const unspecifiedSkills = [];

  let countMandatory = 0;
  let countPreferred = 0;

  detectedMap.forEach((val) => {
    const item = {
      id: val.id,
      name: val.name,
      category: val.category,
      weight: val.weight || 0.8,
      aliases: val.aliases || [],
      matchedKeyword: Array.from(val.matchedKeywords)[0] || val.name
    };

    allExtracted.push(item);

    if (val.contexts.has('mandatory')) {
      item.requirementType = 'Mandatory';
      mandatorySkills.push(item);
      countMandatory++;
    } else if (val.contexts.has('preferred')) {
      item.requirementType = 'Preferred';
      preferredSkills.push(item);
      countPreferred++;
    } else {
      item.requirementType = 'Unspecified';
      unspecifiedSkills.push(item);
    }
  });

  // Separation determination
  const hasClearSeparation = countMandatory > 0 || countPreferred > 0;

  // If the description clearly separated requirements, any unspecified skills
  // (e.g. from general role overview) are assigned to mandatory core requirements
  if (hasClearSeparation && unspecifiedSkills.length > 0) {
    unspecifiedSkills.forEach((item) => {
      item.requirementType = 'Mandatory';
      mandatorySkills.push(item);
    });
  }

  // Build category breakdown
  const byCategory = {};
  allExtracted.forEach((s) => {
    byCategory[s.category] = (byCategory[s.category] || 0) + 1;
  });

  return {
    allExtracted,
    mandatorySkills,
    preferredSkills,
    unspecifiedSkills,
    hasClearSeparation,
    summary: {
      total: allExtracted.length,
      mandatory: mandatorySkills.length,
      preferred: preferredSkills.length,
      byCategory
    }
  };
}

/**
 * Backward-compatible helper to extract flat array of skills from text
 */
export function extractSkillsFromText(jdText) {
  const result = extractSkillsFromJobDescription(jdText);
  return result.allExtracted;
}

/**
 * Retrieves the matching user profile skill object (including category and level),
 * recognizing canonical names, aliases, and variations.
 */
export function getProfileSkillMatch(userSkills = [], targetSkill) {
  if (!Array.isArray(userSkills) || userSkills.length === 0 || !targetSkill) return null;

  const targetName = (targetSkill.name || '').toLowerCase().trim();
  const targetAliases = (targetSkill.aliases || []).map((a) => a.toLowerCase().trim());
  const allTerms = [targetName, ...targetAliases];

  return (
    userSkills.find((userSkill) => {
      const rawName = typeof userSkill === 'string' ? userSkill : userSkill?.name;
      if (!rawName) return false;
      const lowerName = rawName.toLowerCase().trim();

      // Direct match
      if (lowerName === targetName) return true;
      if (targetAliases.includes(lowerName)) return true;

      // Sub-phrase matching with boundary checks (e.g. "Git & GitHub" matches "Git" and "GitHub")
      for (const term of allTerms) {
        if (term === 'c') {
          const r = /(?<![+#a-zA-Z0-9\-])c(?![+#a-zA-Z0-9])/i;
          if (r.test(lowerName)) return true;
        } else if (term === 'c++') {
          const r = /(?:^|[^a-zA-Z0-9_])(?:c\+\+|cpp|c\s*plus\s*plus)(?=[^a-zA-Z0-9_]|$)/i;
          if (r.test(lowerName)) return true;
        } else {
          const escaped = escapeRegExp(term);
          const r = new RegExp(`(^|[^a-zA-Z0-9_#+])${escaped}([^a-zA-Z0-9_#+]|$)`, 'i');
          if (r.test(lowerName)) return true;
        }
      }

      return false;
    }) || null
  );
}

/**
 * Checks if a user's profile has a specific skill, recognizing canonical names,
 * aliases, and variations.
 */
export function doesProfileHaveSkill(userSkills = [], targetSkill) {
  return Boolean(getProfileSkillMatch(userSkills, targetSkill));
}

/**
 * Calculates a transparent, deterministic compatibility score:
 * - Mandatory skills: 80% weight.
 * - Preferred skills: 20% weight.
 * - Fallback scoring approach if mandatory and preferred are not clearly separated.
 * - Does not award points for skills absent from user's profile.
 * - Does not generate random percentages.
 */
export function calculateSkillMatch(userProfileSkills = [], extractionResult) {
  const {
    allExtracted = [],
    mandatorySkills = [],
    preferredSkills = [],
    hasClearSeparation = false,
    summary = {}
  } = extractionResult || {};

  // Case 1: Empty JD / No skills extracted
  if (allExtracted.length === 0) {
    return {
      matchPercentage: 0,
      scoreExplanation: 'No technical skills could be extracted from the provided job description. Please provide a description with specific technical requirements.',
      scoringMethod: 'none',
      atsDensity: 0,
      readiness: {
        badge: 'No Skills Extracted',
        color: 'slate',
        description: 'Provide a valid job description containing technical requirements to run analysis.'
      },
      totalRequired: 0,
      allExtracted: [],
      matchedSkills: [],
      missingSkills: [],
      mandatorySkills: [],
      preferredSkills: [],
      matchedMandatorySkills: [],
      missingMandatorySkills: [],
      matchedPreferredSkills: [],
      missingPreferredSkills: [],
      dealbreakerGaps: [],
      goodToHaveGaps: [],
      skillsToImprove: [],
      hasClearSeparation: false,
      summary: { total: 0, mandatory: 0, preferred: 0, byCategory: {} }
    };
  }

  // Case 2: Empty User Profile
  if (!userProfileSkills || userProfileSkills.length === 0) {
    return {
      matchPercentage: 0,
      scoreExplanation: 'Your profile does not currently list any technical skills. Compatibility score is 0%. Add your technical skills in your Profile to match against job descriptions.',
      scoringMethod: hasClearSeparation ? 'weighted_80_20' : 'fallback_equal_weight',
      atsDensity: 0,
      readiness: {
        badge: 'Profile Empty',
        color: 'rose',
        description: 'Add your skills in your Profile section to start matching with target job descriptions.'
      },
      totalRequired: allExtracted.length,
      allExtracted,
      matchedSkills: [],
      missingSkills: allExtracted,
      skillsToImprove: [],
      mandatorySkills,
      preferredSkills,
      matchedMandatorySkills: [],
      missingMandatorySkills: mandatorySkills,
      matchedPreferredSkills: [],
      missingPreferredSkills: preferredSkills,
      dealbreakerGaps: mandatorySkills,
      goodToHaveGaps: preferredSkills,
      hasClearSeparation,
      summary
    };
  }

  // Skill categorization
  const matchedSkills = [];
  const missingSkills = [];
  const matchedMandatorySkills = [];
  const missingMandatorySkills = [];
  const matchedPreferredSkills = [];
  const missingPreferredSkills = [];

  allExtracted.forEach((skill) => {
    const userMatch = getProfileSkillMatch(userProfileSkills, skill);
    if (userMatch) {
      const userLevel = typeof userMatch === 'string' ? 'Intermediate' : (userMatch.level || 'Intermediate');
      matchedSkills.push({
        ...skill,
        userLevel,
        userSkill: userMatch
      });
    } else {
      missingSkills.push(skill);
    }
  });

  mandatorySkills.forEach((skill) => {
    const userMatch = getProfileSkillMatch(userProfileSkills, skill);
    if (userMatch) {
      const userLevel = typeof userMatch === 'string' ? 'Intermediate' : (userMatch.level || 'Intermediate');
      matchedMandatorySkills.push({
        ...skill,
        userLevel,
        userSkill: userMatch
      });
    } else {
      missingMandatorySkills.push(skill);
    }
  });

  preferredSkills.forEach((skill) => {
    const userMatch = getProfileSkillMatch(userProfileSkills, skill);
    if (userMatch) {
      const userLevel = typeof userMatch === 'string' ? 'Intermediate' : (userMatch.level || 'Intermediate');
      matchedPreferredSkills.push({
        ...skill,
        userLevel,
        userSkill: userMatch
      });
    } else {
      missingPreferredSkills.push(skill);
    }
  });

  // Skills to improve: user already possesses the skill but marked as Beginner when role expects stronger proficiency
  const skillsToImprove = matchedSkills
    .filter((s) => (s.userLevel || '').toLowerCase() === 'beginner')
    .map((s) => ({
      ...s,
      currentLevel: s.userLevel || 'Beginner',
      expectedLevel: 'Intermediate',
      priority: 'Low',
      reason: 'Role expects hands-on proficiency (Intermediate or Advanced). Current level is marked as Beginner.'
    }));

  let matchPercentage = 0;
  let scoringMethod = 'weighted_80_20';
  let scoreExplanation = '';

  // Determine score calculation based on separation
  if (hasClearSeparation && (mandatorySkills.length > 0 || preferredSkills.length > 0)) {
    if (mandatorySkills.length > 0 && preferredSkills.length > 0) {
      // Both Mandatory and Preferred present: 80% Mandatory + 20% Preferred
      scoringMethod = 'weighted_80_20';
      const mandatoryRatio = matchedMandatorySkills.length / mandatorySkills.length;
      const preferredRatio = matchedPreferredSkills.length / preferredSkills.length;
      const mandatoryComponent = mandatoryRatio * 80;
      const preferredComponent = preferredRatio * 20;
      matchPercentage = Math.round(mandatoryComponent + preferredComponent);

      scoreExplanation = `Weighted Compatibility Score: ${matchPercentage}% (80% Mandatory: ${matchedMandatorySkills.length}/${mandatorySkills.length} matched = ${mandatoryComponent.toFixed(1)}% + 20% Preferred: ${matchedPreferredSkills.length}/${preferredSkills.length} matched = ${preferredComponent.toFixed(1)}%).`;
    } else if (mandatorySkills.length > 0 && preferredSkills.length === 0) {
      // Only Mandatory skills present
      scoringMethod = 'mandatory_only_100';
      const ratio = matchedMandatorySkills.length / mandatorySkills.length;
      matchPercentage = Math.round(ratio * 100);

      scoreExplanation = `Mandatory Requirements Score: ${matchPercentage}% (${matchedMandatorySkills.length} of ${mandatorySkills.length} mandatory skills matched; no secondary preferred skills listed).`;
    } else {
      // Only Preferred skills present
      scoringMethod = 'preferred_only_100';
      const ratio = matchedPreferredSkills.length / preferredSkills.length;
      matchPercentage = Math.round(ratio * 100);

      scoreExplanation = `Preferred Requirements Score: ${matchPercentage}% (${matchedPreferredSkills.length} of ${preferredSkills.length} preferred skills matched).`;
    }
  } else {
    // Fallback: description does not clearly separate mandatory and preferred requirements
    scoringMethod = 'fallback_equal_weight';
    const ratio = matchedSkills.length / allExtracted.length;
    matchPercentage = Math.round(ratio * 100);

    scoreExplanation = `Fallback Compatibility Score: ${matchPercentage}% (${matchedSkills.length} of ${allExtracted.length} technical skills matched). Requirements were evaluated with consistent equal weighting as no explicit mandatory/preferred separation was specified in the job description.`;
  }

  // Assess readiness
  let readiness = {
    badge: 'Strong Fit',
    color: 'emerald',
    description: 'You possess the primary technical competencies required for this role.'
  };

  if (matchPercentage < 40 || (mandatorySkills.length > 0 && matchedMandatorySkills.length === 0)) {
    readiness = {
      badge: 'Critical Gaps',
      color: 'rose',
      description: 'Multiple essential mandatory skills are missing. Complete focused roadmap learning before applying.'
    };
  } else if (matchPercentage < 70) {
    readiness = {
      badge: 'Moderate Fit',
      color: 'amber',
      description: 'You cover several core requirements, but have missing mandatory or preferred skills to bridge.'
    };
  }

  // ATS keyword match density
  const atsDensity = Math.min(
    100,
    Math.round((matchedSkills.length / Math.max(1, allExtracted.length)) * 100)
  );

  return {
    matchPercentage,
    scoreExplanation,
    scoringMethod,
    atsDensity,
    readiness,
    totalRequired: allExtracted.length,
    allExtracted,
    matchedSkills,
    missingSkills,
    skillsToImprove,
    mandatorySkills,
    preferredSkills,
    matchedMandatorySkills,
    missingMandatorySkills,
    matchedPreferredSkills,
    missingPreferredSkills,
    dealbreakerGaps: missingMandatorySkills.length > 0 ? missingMandatorySkills : missingSkills,
    goodToHaveGaps: missingPreferredSkills,
    hasClearSeparation,
    summary
  };
}

/**
 * Backward compatible analyzeSkillMatch helper
 */
export function analyzeSkillMatch(userSkills = [], jobSkillsOrExtracted = []) {
  if (jobSkillsOrExtracted && jobSkillsOrExtracted.allExtracted) {
    return calculateSkillMatch(userSkills, jobSkillsOrExtracted);
  }

  // If array of skills passed, wrap into extraction format
  const extractionResult = {
    allExtracted: jobSkillsOrExtracted,
    mandatorySkills: jobSkillsOrExtracted.filter(s => s.requirementType === 'Mandatory'),
    preferredSkills: jobSkillsOrExtracted.filter(s => s.requirementType === 'Preferred'),
    hasClearSeparation: jobSkillsOrExtracted.some(s => s.requirementType === 'Mandatory' || s.requirementType === 'Preferred'),
    summary: {
      total: jobSkillsOrExtracted.length,
      mandatory: jobSkillsOrExtracted.filter(s => s.requirementType === 'Mandatory').length,
      preferred: jobSkillsOrExtracted.filter(s => s.requirementType === 'Preferred').length,
      byCategory: {}
    }
  };

  return calculateSkillMatch(userSkills, extractionResult);
}

/**
 * Full execution helper: Given JD text, profile skills, and metadata, produces
 * a complete, persistent scan record.
 */
export function runJobDescriptionAnalysis(jdText, userProfileSkills = [], metadata = {}) {
  const extraction = extractSkillsFromJobDescription(jdText);
  const matchResult = calculateSkillMatch(userProfileSkills, extraction);

  return {
    id: `scan-${Date.now()}`,
    date: new Date().toISOString(),
    jobTitle: (metadata.jobTitle || 'Software Engineer').trim(),
    company: (metadata.company || '').trim(),
    jobType: metadata.jobType || 'Full-time',
    location: metadata.location || 'India',
    salary: metadata.salary || 'Competitive',
    jobDescription: jdText,
    ...matchResult
  };
}
