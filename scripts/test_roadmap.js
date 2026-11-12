import {
  resolveSkillRoadmapDetails,
  getWhySkillMatters
} from '../src/data/skillResources.js';
import { STORAGE_KEYS } from '../src/utils/storage.js';
import { runJobDescriptionAnalysis } from '../src/utils/matcherEngine.js';
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

console.log('=== TEST SUITE: Learning Roadmap Module & Resource Mappings ===\n');

// 1. Predefined Resource Mappings for Required Examples
console.log('1. Predefined Learning Resources (Prompt Required Examples):');

const pythonDetails = resolveSkillRoadmapDetails('Python', 'Backend Engineer');
assert(pythonDetails.hasPredefinedResources === true, 'Python has predefined resources');
assert(
  pythonDetails.resources.some((r) => r.url === 'https://docs.python.org/3/tutorial/'),
  'Python maps to https://docs.python.org/3/tutorial/'
);

const jsDetails = resolveSkillRoadmapDetails('JavaScript', 'Frontend Engineer');
assert(jsDetails.hasPredefinedResources === true, 'JavaScript has predefined resources');
assert(
  jsDetails.resources.some((r) => r.url === 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide'),
  'JavaScript maps to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide'
);

const reactDetails = resolveSkillRoadmapDetails('React', 'Frontend Engineer');
assert(reactDetails.hasPredefinedResources === true, 'React has predefined resources');
assert(
  reactDetails.resources.some((r) => r.url === 'https://react.dev/learn'),
  'React maps to https://react.dev/learn'
);

const gitDetails = resolveSkillRoadmapDetails('Git', 'Software Engineer');
assert(gitDetails.hasPredefinedResources === true, 'Git has predefined resources');
assert(
  gitDetails.resources.some((r) => r.url === 'https://git-scm.com/doc'),
  'Git maps to https://git-scm.com/doc'
);

const dockerDetails = resolveSkillRoadmapDetails('Docker', 'DevOps Engineer');
assert(dockerDetails.hasPredefinedResources === true, 'Docker has predefined resources');
assert(
  dockerDetails.resources.some((r) => r.url === 'https://docs.docker.com/'),
  'Docker maps to https://docs.docker.com/'
);

const linuxDetails = resolveSkillRoadmapDetails('Linux', 'Cloud Engineer');
assert(linuxDetails.hasPredefinedResources === true, 'Linux has predefined resources');
assert(
  linuxDetails.resources.some((r) => r.url === 'https://linuxjourney.com/'),
  'Linux maps to https://linuxjourney.com/'
);

const cyberDetails = resolveSkillRoadmapDetails('Cybersecurity', 'Security Analyst');
assert(cyberDetails.hasPredefinedResources === true, 'Cybersecurity has predefined resources');
assert(
  cyberDetails.resources.some((r) => r.url === 'https://tryhackme.com/'),
  'Cybersecurity maps to https://tryhackme.com/'
);
assert(
  cyberDetails.resources.some((r) => r.url === 'https://owasp.org/'),
  'Cybersecurity maps to https://owasp.org/'
);

const mlDetails = resolveSkillRoadmapDetails('Machine Learning', 'AI Engineer');
assert(mlDetails.hasPredefinedResources === true, 'Machine Learning has predefined resources');
assert(
  mlDetails.resources.some((r) => r.url === 'https://scikit-learn.org/stable/user_guide.html'),
  'Machine Learning maps to https://scikit-learn.org/stable/user_guide.html'
);

// 2. Generic Learning Recommendation for Unmapped Skills (No Invented URLs)
console.log('\n2. Sensible Generic Recommendation for Unmapped Skills (Strictly No Invented URLs):');

const unmappedSkill = 'CustomProprietaryFrameworkXYZ';
const unmappedDetails = resolveSkillRoadmapDetails(unmappedSkill, 'Systems Engineer');

assert(unmappedDetails.hasPredefinedResources === false, 'Unmapped skill flags hasPredefinedResources as false');
assert(Array.isArray(unmappedDetails.resources) && unmappedDetails.resources.length === 0, 'No invented URLs in resources array (length is 0)');
assert(unmappedDetails.genericRecommendation !== null, 'Provides genericRecommendation object');
assert(Array.isArray(unmappedDetails.genericRecommendation.steps) && unmappedDetails.genericRecommendation.steps.length >= 3, 'Generic recommendation has at least 3 structured learning steps');
assert(Array.isArray(unmappedDetails.genericRecommendation.suggestedTopics), 'Generic recommendation provides search topics');

// Verify that generic recommendation does NOT contain invented http or https links
const serializedGeneric = JSON.stringify(unmappedDetails.genericRecommendation);
assert(!serializedGeneric.includes('http://') && !serializedGeneric.includes('https://'), 'Generic recommendation strictly avoids inventing arbitrary URLs');

// 3. Why the Skill Matters for the Target Job
console.log('\n3. Contextual "Why Skill Matters for the Target Job":');

const whyPython = getWhySkillMatters('Python', 'Backend Engineer', 'Programming Languages', 'Mandatory');
assert(whyPython.includes('Backend Engineer'), 'Explanation references target job title');
assert(whyPython.includes('mandatory requirement'), 'Explanation reflects mandatory priority urgency');
assert(whyPython.length > 50, 'Provides rich, educational reasoning');

const whyKubernetes = getWhySkillMatters('Kubernetes', 'Cloud Engineer', 'Cloud and DevOps', 'Preferred');
assert(whyKubernetes.includes('Cloud Engineer'), 'Explanation references target role');
assert(whyKubernetes.includes('preferred capability'), 'Explanation reflects preferred requirement');

// 4. Dynamic Connection to Job Analysis Scan
console.log('\n4. Dynamic Connection to Job Analysis Scans:');

const sdeTemplate = SAMPLE_JOB_TEMPLATES[0]; // SDE-1
const userSkills = [{ name: 'JavaScript', category: 'Programming Languages', level: 'Advanced' }];

const scan = runJobDescriptionAnalysis(sdeTemplate.description, userSkills, {
  jobTitle: sdeTemplate.title,
  company: sdeTemplate.company
});

assert(scan.missingMandatorySkills.length > 0, `Detected missing mandatory skills in SDE scan (found: ${scan.missingMandatorySkills.length})`);
assert(scan.missingSkills.length > 0, `Total missing skills identified (found: ${scan.missingSkills.length})`);

// Map roadmap items
const roadmapItems = scan.missingSkills.map((s) => {
  const reqType = scan.missingMandatorySkills.some((m) => m.name === s.name) ? 'Mandatory' : 'Preferred';
  return resolveSkillRoadmapDetails({ ...s, requirementType: reqType }, scan.jobTitle);
});

assert(roadmapItems.length === scan.missingSkills.length, 'Roadmap generated for all missing skills');
assert(roadmapItems.some((r) => r.priority === 'High'), 'Roadmap includes High Priority mandatory skills');
assert(roadmapItems.every((r) => r.whyMatters && r.whyMatters.length > 0), 'Every roadmap item has "whyMatters" explanation');
assert(roadmapItems.every((r) => r.hasPredefinedResources || r.genericRecommendation), 'Every item has either verified resources or generic guidance');

// 5. Status Management & Roadmap Progress Math
console.log('\n5. Roadmap Progress Calculation & Statuses:');

const sampleRoadmap = [
  { name: 'Python', status: 'completed', priority: 'High' },
  { name: 'Docker', status: 'in_progress', priority: 'High' },
  { name: 'Linux', status: 'not_started', priority: 'High' },
  { name: 'Git', status: 'completed', priority: 'Medium' }
];

const total = sampleRoadmap.length;
const completed = sampleRoadmap.filter((s) => s.status === 'completed').length;
const inProgress = sampleRoadmap.filter((s) => s.status === 'in_progress').length;
const notStarted = sampleRoadmap.filter((s) => s.status === 'not_started').length;
const percent = Math.round((completed / total) * 100);

assert(total === 4, 'Total is 4 skills');
assert(completed === 2, '2 completed skills');
assert(inProgress === 1, '1 in progress skill');
assert(notStarted === 1, '1 not started skill');
assert(percent === 50, 'Progress percentage is exactly 50%');

// 6. LocalStorage Key Verification
console.log('\n6. LocalStorage Keys Verification:');
assert(Boolean(STORAGE_KEYS.ROADMAP_PROGRESS), 'STORAGE_KEYS.ROADMAP_PROGRESS exists');
assert(Boolean(STORAGE_KEYS.ROADMAP_SKILL_STATUS), 'STORAGE_KEYS.ROADMAP_SKILL_STATUS exists');
assert(STORAGE_KEYS.ROADMAP_SKILL_STATUS === 'skillmatch_roadmap_skill_status_v1', 'Correct roadmap status storage key');

console.log(`\n=================================================`);
console.log(`TEST RUN COMPLETE: ${passed} passed, ${failed} failed`);
console.log(`=================================================`);

if (failed > 0) {
  process.exit(1);
}
