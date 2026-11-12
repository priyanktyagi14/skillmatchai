import {
  extractSkillsFromJobDescription,
  calculateSkillMatch,
  getProfileSkillMatch,
  runJobDescriptionAnalysis
} from '../src/utils/matcherEngine.js';
import { DEFAULT_USER_PROFILE } from '../src/data/initialProfile.js';
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

console.log('=== TEST SUITE: Skill Gap Analysis Module & Matching Integration ===\n');

// 1. Profile Skill Match helper & proficiency detection
console.log('1. Profile Skill Matching & Level Extraction:');
const testSkills = [
  { name: 'JavaScript', category: 'Programming Languages', level: 'Advanced' },
  { name: 'Redis', category: 'Databases', level: 'Beginner' },
  { name: 'Docker', category: 'Cloud and DevOps', level: 'Intermediate' }
];

const jsMatch = getProfileSkillMatch(testSkills, { name: 'JavaScript' });
assert(jsMatch !== null && jsMatch.level === 'Advanced', 'Detects JavaScript with Advanced proficiency');

const redisMatch = getProfileSkillMatch(testSkills, { name: 'Redis' });
assert(redisMatch !== null && redisMatch.level === 'Beginner', 'Detects Redis with Beginner proficiency');

const pyMatch = getProfileSkillMatch(testSkills, { name: 'Python' });
assert(pyMatch === null, 'Correctly returns null for Python (not in test skills)');

// 2. Three Main Categories Verification
console.log('\n2. Three Main Categories in calculateSkillMatch:');
// Job Description that has:
// - Required: JavaScript (user has Advanced), Python (user does NOT have), Redis (user has Beginner)
// - Preferred: Docker (user has Intermediate), Kubernetes (user does NOT have)
const testJd = `
Required Qualifications:
- Must have: JavaScript programming skills.
- Essential: Python scripting.
- Required: Redis caching.

Preferred Skills:
- Good to have: Docker containerization.
- Bonus: Kubernetes cluster orchestration.
`;

const extraction = extractSkillsFromJobDescription(testJd);
const matchResult = calculateSkillMatch(testSkills, extraction);

// Category 1: Matched Skills
assert(matchResult.matchedSkills.length === 3, `Matched 3 skills (found: ${matchResult.matchedSkills.length})`);
const matchedNames = matchResult.matchedSkills.map(s => s.name);
assert(matchedNames.includes('JavaScript'), 'Matched skills includes JavaScript');
assert(matchedNames.includes('Redis'), 'Matched skills includes Redis');
assert(matchedNames.includes('Docker'), 'Matched skills includes Docker');

const jsSkill = matchResult.matchedSkills.find(s => s.name === 'JavaScript');
assert(jsSkill.userLevel === 'Advanced', `JavaScript has userLevel Advanced (got: ${jsSkill.userLevel})`);

// Category 2: Missing Skills (Separated into Mandatory vs Preferred)
console.log('\n3. Missing Skills Separation & Priorities:');
assert(matchResult.missingSkills.length === 2, `Total missing skills is 2 (found: ${matchResult.missingSkills.length})`);

// Mandatory missing -> High Priority
assert(matchResult.missingMandatorySkills.length === 1, '1 missing mandatory skill');
assert(matchResult.missingMandatorySkills[0].name === 'Python', 'Missing mandatory skill is Python (High Priority)');

// Preferred missing -> Medium Priority
assert(matchResult.missingPreferredSkills.length === 1, '1 missing preferred skill');
assert(matchResult.missingPreferredSkills[0].name === 'Kubernetes', 'Missing preferred skill is Kubernetes (Medium Priority)');

// Category 3: Skills to Improve (Beginner -> Low Priority)
console.log('\n4. Skills to Improve (Beginner level skills in target role):');
assert(matchResult.skillsToImprove.length === 1, `Identified 1 skill to improve (found: ${matchResult.skillsToImprove.length})`);
const improveSkill = matchResult.skillsToImprove[0];
assert(improveSkill.name === 'Redis', 'Skill to improve is Redis');
assert(improveSkill.currentLevel === 'Beginner', 'Current level is identified as Beginner');
assert(improveSkill.expectedLevel === 'Intermediate', 'Expected level is Intermediate');
assert(improveSkill.priority === 'Low', 'Priority is marked as Low');

// 5. Reactive Resolution when Skill is Marked as Learned / Upgraded
console.log('\n5. Reactive Simulation of "Mark as Learned" & "Upgrade Proficiency":');
// User marks Python as learned at Intermediate level
const updatedSkills = [
  ...testSkills,
  { name: 'Python', category: 'Programming Languages', level: 'Intermediate' }
];

const afterLearnMatch = calculateSkillMatch(updatedSkills, extraction);
assert(
  !afterLearnMatch.missingMandatorySkills.some(s => s.name === 'Python'),
  'Python is removed from missingMandatorySkills after learning'
);
assert(
  afterLearnMatch.matchedSkills.some(s => s.name === 'Python'),
  'Python is now in matchedSkills'
);
assert(
  afterLearnMatch.matchPercentage > matchResult.matchPercentage,
  `Match percentage increased from ${matchResult.matchPercentage}% to ${afterLearnMatch.matchPercentage}%`
);

// User upgrades Redis from Beginner to Intermediate
const upgradedSkills = updatedSkills.map(s => s.name === 'Redis' ? { ...s, level: 'Intermediate' } : s);
const afterUpgradeMatch = calculateSkillMatch(upgradedSkills, extraction);
assert(
  afterUpgradeMatch.skillsToImprove.length === 0,
  'Redis is cleared from skillsToImprove after upgrading to Intermediate'
);
assert(
  afterUpgradeMatch.matchedSkills.find(s => s.name === 'Redis').userLevel === 'Intermediate',
  'Redis now has Intermediate proficiency in matchedSkills'
);

// 6. Test with Sample Job Templates
console.log('\n6. Integration with Sample Job Templates:');
SAMPLE_JOB_TEMPLATES.forEach(tpl => {
  const res = runJobDescriptionAnalysis(tpl.description, DEFAULT_USER_PROFILE.skills, {
    jobTitle: tpl.title,
    company: tpl.company
  });
  assert(res.matchPercentage >= 0 && res.matchPercentage <= 100, `${tpl.title}: valid match score ${res.matchPercentage}%`);
  assert(Array.isArray(res.matchedSkills), `${tpl.title}: matchedSkills is array`);
  assert(Array.isArray(res.missingMandatorySkills), `${tpl.title}: missingMandatorySkills is array`);
  assert(Array.isArray(res.missingPreferredSkills), `${tpl.title}: missingPreferredSkills is array`);
  assert(Array.isArray(res.skillsToImprove), `${tpl.title}: skillsToImprove is array`);
});

console.log(`\n=================================================`);
console.log(`TEST RUN COMPLETE: ${passed} passed, ${failed} failed`);
console.log(`=================================================`);

if (failed > 0) process.exit(1);

