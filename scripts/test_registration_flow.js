import assert from 'assert';
import { STORAGE_KEYS } from '../src/utils/storage.js';
import { EMPTY_USER_PROFILE } from '../src/data/initialProfile.js';
import { calculateProfileCompletion } from '../src/utils/profileCompletion.js';
import { SKILL_CATEGORY_LIST, normalizeSkillCategory } from '../src/data/skillsTaxonomy.js';

console.log('=== TEST SUITE: First-Time User Registration & Onboarding Flow ===\n');

// 1. Storage Keys
console.log('1. Registration LocalStorage Keys:');
assert.strictEqual(STORAGE_KEYS.REGISTRATION_STATUS, 'skillmatch_registration_completed_v1');
assert.strictEqual(STORAGE_KEYS.REGISTRATION_DRAFT, 'skillmatch_registration_draft_v1');
assert.strictEqual(STORAGE_KEYS.PROFILE, 'skillmatch_user_profile_v1');
console.log('  ✓ Verified STORAGE_KEYS.REGISTRATION_STATUS');
console.log('  ✓ Verified STORAGE_KEYS.REGISTRATION_DRAFT');
console.log('  ✓ Verified STORAGE_KEYS.PROFILE');

// 2. Empty Initial Profile Structure (No Dummy Data)
console.log('\n2. Empty Initial Profile Structure:');
assert.strictEqual(EMPTY_USER_PROFILE.personal.fullName, '');
assert.strictEqual(EMPTY_USER_PROFILE.personal.email, '');
assert.strictEqual(EMPTY_USER_PROFILE.education.college, '');
assert.strictEqual(EMPTY_USER_PROFILE.skills.length, 0);
assert.strictEqual(EMPTY_USER_PROFILE.projects.length, 0);
assert.strictEqual(EMPTY_USER_PROFILE.experience.length, 0);
assert.strictEqual(EMPTY_USER_PROFILE.certifications.length, 0);
console.log('  ✓ Empty user profile starts with 0 preselected skills');
console.log('  ✓ Empty user profile starts with 0 projects and 0 experiences');
console.log('  ✓ Empty user profile has blank personal and education fields');

// 3. Technical Skills Categories
console.log('\n3. Technical Skills 8 Categories:');
const expectedCategories = [
  'Programming Languages',
  'Frontend Development',
  'Backend Development',
  'Databases',
  'Cloud and DevOps',
  'Cybersecurity',
  'Artificial Intelligence and Machine Learning',
  'Tools and Technologies'
];
assert.strictEqual(SKILL_CATEGORY_LIST.length, 8);
expectedCategories.forEach((cat) => {
  assert.ok(SKILL_CATEGORY_LIST.includes(cat), `Missing expected category: ${cat}`);
  assert.strictEqual(normalizeSkillCategory(cat), cat);
  console.log(`  ✓ Category verified: "${cat}"`);
});

// 4. Registration Submission Simulation
console.log('\n4. Registration Submission Simulation:');
const registeredUser = {
  personal: {
    fullName: 'Priya Patel',
    email: 'priya.patel@gmail.com',
    phone: '+91 98765 12345',
    location: 'Pune, Maharashtra, India',
    primaryRole: 'Frontend Developer'
  },
  education: {
    college: 'Pune Institute of Computer Technology (PICT)',
    institution: 'Pune Institute of Computer Technology (PICT)',
    degree: 'Bachelor of Engineering (B.E.)',
    branch: 'Computer Engineering',
    graduationYear: '2025',
    cgpa: '9.1 / 10.0'
  },
  skills: [
    { name: 'JavaScript', category: 'Programming Languages', level: 'Advanced' },
    { name: 'TypeScript', category: 'Programming Languages', level: 'Intermediate' },
    { name: 'React', category: 'Frontend Development', level: 'Advanced' },
    { name: 'Tailwind CSS', category: 'Frontend Development', level: 'Intermediate' },
    { name: 'Node.js', category: 'Backend Development', level: 'Intermediate' },
    { name: 'Git', category: 'Cloud and DevOps', level: 'Intermediate' }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Portfolio Showcase',
      description: 'Responsive portfolio built with React and Tailwind CSS.',
      technologies: 'React, Tailwind CSS',
      projectUrl: 'https://github.com/priyapatel/portfolio'
    }
  ],
  experience: []
};

// Check profile completion for registered user
const userCompletion = calculateProfileCompletion(registeredUser);
assert.ok(userCompletion.percentage > 50, `Expected profile completion > 50%, got ${userCompletion.percentage}%`);
console.log(`  ✓ Registered user completion score calculated: ${userCompletion.percentage}%`);
console.log(`  ✓ Personal section completed: ${userCompletion.sections.personal.completed}`);
console.log(`  ✓ Skills section completed: ${userCompletion.sections.skills.completed}`);

console.log('\n=================================================');
console.log('ALL REGISTRATION ONBOARDING UNIT TESTS PASSED!');
console.log('=================================================\n');

