import {
  extractSkillsFromJobDescription,
  extractSkillsFromText,
  calculateSkillMatch,
  doesProfileHaveSkill,
  runJobDescriptionAnalysis
} from '../src/utils/matcherEngine.js';
import { PREDEFINED_TECHNICAL_SKILLS, TECH_SKILLS } from '../src/data/skillsTaxonomy.js';
import { SAMPLE_JOB_TEMPLATES } from '../src/data/jobTemplates.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('=== TEST SUITE: Skill Matching Engine & Job Description Analyzer ===\n');

// 1. Dictionary completeness
console.log('1. Predefined Technical Skills Dictionary:');
const expectedSkills = [
  'Python', 'Java', 'C', 'C++', 'JavaScript', 'TypeScript', 'HTML', 'CSS',
  'React', 'Node.js', 'Express.js', 'SQL', 'MongoDB', 'PostgreSQL',
  'Git', 'GitHub', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Linux',
  'REST APIs', 'CI/CD', 'Cybersecurity', 'Penetration Testing',
  'Machine Learning', 'Deep Learning', 'NLP', 'TensorFlow', 'PyTorch'
];

assert(PREDEFINED_TECHNICAL_SKILLS.length === 30, `Contains exactly 30 predefined skills (found: ${PREDEFINED_TECHNICAL_SKILLS.length})`);
expectedSkills.forEach(skillName => {
  const found = PREDEFINED_TECHNICAL_SKILLS.some(s => s.name.toLowerCase() === skillName.toLowerCase());
  assert(found, `Dictionary contains ${skillName}`);
});

// 2. C and C++ boundary precision
console.log('\n2. Keyword & Alias Precision (C vs C++):');
const cJd = 'Looking for developer with C and Linux skills.';
const extC = extractSkillsFromJobDescription(cJd);
assert(extC.allExtracted.some(s => s.name === 'C'), 'Detects C language');
assert(!extC.allExtracted.some(s => s.name === 'C++'), 'Does NOT falsely detect C++ in C context');

const cppJd = 'Looking for developer with C++ and Qt skills.';
const extCpp = extractSkillsFromJobDescription(cppJd);
assert(extCpp.allExtracted.some(s => s.name === 'C++'), 'Detects C++ language');
assert(!extCpp.allExtracted.some(s => s.name === 'C'), 'Does NOT falsely detect C when only C++ is mentioned');

// 3. Mandatory phrase recognition
console.log('\n3. Mandatory Phrases Recognition (Required, Must Have, Essential, Mandatory):');
const mandatoryJd = `
Required: Python and SQL.
Must Have: Docker.
Essential: Git.
Mandatory: Linux.
`;
const extMandatory = extractSkillsFromJobDescription(mandatoryJd);
const mandatoryNames = extMandatory.mandatorySkills.map(s => s.name);
assert(mandatoryNames.includes('Python'), 'Identified Python under Required');
assert(mandatoryNames.includes('SQL'), 'Identified SQL under Required');
assert(mandatoryNames.includes('Docker'), 'Identified Docker under Must Have');
assert(mandatoryNames.includes('Git'), 'Identified Git under Essential');
assert(mandatoryNames.includes('Linux'), 'Identified Linux under Mandatory');

// 4. Preferred phrase recognition
console.log('\n4. Preferred Phrases Recognition (Preferred, Good to Have, Bonus, Nice to Have):');
const preferredJd = `
Preferred: Kubernetes.
Good to Have: AWS.
Bonus: CI/CD.
Nice to Have: MongoDB.
`;
const extPreferred = extractSkillsFromJobDescription(preferredJd);
const preferredNames = extPreferred.preferredSkills.map(s => s.name);
assert(preferredNames.includes('Kubernetes'), 'Identified Kubernetes under Preferred');
assert(preferredNames.includes('AWS'), 'Identified AWS under Good to Have');
assert(preferredNames.includes('CI/CD'), 'Identified CI/CD under Bonus');
assert(preferredNames.includes('MongoDB'), 'Identified MongoDB under Nice to Have');

// 5. Scoring: 80% Mandatory, 20% Preferred
console.log('\n5. Transparent Compatibility Scoring (80/20 rule):');
const testJd = `
Requirements:
- Must have: Python, Java, React, SQL (4 mandatory skills)
Preferred:
- Good to have: Docker, AWS (2 preferred skills)
`;
const extTest = extractSkillsFromJobDescription(testJd);

// Profile matches 2 of 4 mandatory (50% * 80% = 40%) and 1 of 2 preferred (50% * 20% = 10%) -> Total 50%
const mockProfile = [
  { name: 'Python' },
  { name: 'Java' },
  { name: 'Docker' }
];
const matchResult = calculateSkillMatch(mockProfile, extTest);
assert(matchResult.matchPercentage === 50, `Calculated score is exactly 50% (got: ${matchResult.matchPercentage}%)`);
assert(matchResult.matchedMandatorySkills.length === 2, '2 mandatory skills matched');
assert(matchResult.missingMandatorySkills.length === 2, '2 mandatory skills missing');
assert(matchResult.matchedPreferredSkills.length === 1, '1 preferred skill matched');
assert(matchResult.missingPreferredSkills.length === 1, '1 preferred skill missing');
assert(matchResult.scoreExplanation.includes('80% Mandatory'), 'Explanation includes 80% Mandatory breakdown');
assert(matchResult.scoreExplanation.includes('20% Preferred'), 'Explanation includes 20% Preferred breakdown');

// 6. Zero points for absent skills
console.log('\n6. Zero Points for Absent Skills:');
const emptyProfileResult = calculateSkillMatch([], extTest);
assert(emptyProfileResult.matchPercentage === 0, 'Empty profile receives exactly 0% score');
assert(emptyProfileResult.matchedSkills.length === 0, 'Empty profile has 0 matched skills');
assert(emptyProfileResult.missingSkills.length === extTest.allExtracted.length, 'All skills are marked missing');

// 7. Fallback scoring when unseparated
console.log('\n7. Fallback Scoring for Unseparated Requirements:');
const unseparatedJd = 'Developer role working with Python, JavaScript, React, and PostgreSQL.';
const extFallback = extractSkillsFromJobDescription(unseparatedJd);
assert(!extFallback.hasClearSeparation, 'Correctly flags no clear separation');

// Profile has Python and React out of 4 total -> 2/4 = 50%
const fallbackResult = calculateSkillMatch([{ name: 'Python' }, { name: 'React' }], extFallback);
assert(fallbackResult.matchPercentage === 50, `Fallback score is exactly 50% (got: ${fallbackResult.matchPercentage}%)`);
assert(fallbackResult.scoringMethod === 'fallback_equal_weight', 'Method is fallback_equal_weight');
assert(fallbackResult.scoreExplanation.includes('Fallback Compatibility Score'), 'Explanation reflects fallback mode');

// 8. Sample Templates Evaluation
console.log('\n8. Sample Job Templates Testing:');
SAMPLE_JOB_TEMPLATES.forEach(tpl => {
  const analysis = runJobDescriptionAnalysis(tpl.description, mockProfile, {
    jobTitle: tpl.title,
    company: tpl.company,
    jobType: tpl.jobType || tpl.type
  });
  assert(analysis.totalRequired > 0, `Template "${tpl.title.split('(')[0].trim()}" extracted ${analysis.totalRequired} skills`);
  assert(typeof analysis.matchPercentage === 'number' && analysis.matchPercentage >= 0 && analysis.matchPercentage <= 100, `Valid score ${analysis.matchPercentage}%`);
  assert(analysis.scoreExplanation.length > 0, 'Has score explanation');
});

console.log(`\n=================================================`);
console.log(`TEST RUN COMPLETE: ${passed} passed, ${failed} failed`);
console.log(`=================================================`);

if (failed > 0) process.exit(1);

