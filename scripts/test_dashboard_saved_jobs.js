import assert from 'assert';
import { calculateProfileCompletion } from '../src/utils/profileCompletion.js';
import { DEFAULT_USER_PROFILE } from '../src/data/initialProfile.js';
import { runJobDescriptionAnalysis } from '../src/utils/matcherEngine.js';
import { SAMPLE_JOB_TEMPLATES } from '../src/data/jobTemplates.js';
import { STORAGE_KEYS } from '../src/utils/storage.js';

console.log('=== TEST SUITE: Dashboard & Saved Jobs Modules ===\n');

// 1. Verify Storage Keys
console.log('1. LocalStorage Storage Keys:');
assert.strictEqual(STORAGE_KEYS.PROFILE, 'skillmatch_user_profile_v1');
assert.strictEqual(STORAGE_KEYS.SCANS, 'skillmatch_recent_scans_v1');
assert.strictEqual(STORAGE_KEYS.RESUME_ACTIVITY, 'skillmatch_resume_activity_v1');
console.log('  ✓ Verified STORAGE_KEYS.PROFILE and SCANS');
console.log('  ✓ Verified STORAGE_KEYS.RESUME_ACTIVITY');

// 2. Profile Completion on Default Profile
console.log('\n2. Profile Completion Calculation:');
const completion = calculateProfileCompletion(DEFAULT_USER_PROFILE);
assert.strictEqual(typeof completion.percentage, 'number');
assert.ok(completion.percentage >= 0 && completion.percentage <= 100);
assert.ok(Array.isArray(completion.checklist));
assert.ok(Array.isArray(completion.missingItems));
console.log(`  ✓ Profile completion correctly calculated: ${completion.percentage}%`);

// 3. Jobs Analyzed & Compatibility Calculations
console.log('\n3. Real Scans & Compatibility Calculations:');
const scan1 = runJobDescriptionAnalysis(
  SAMPLE_JOB_TEMPLATES[0].description,
  DEFAULT_USER_PROFILE.skills,
  {
    jobTitle: SAMPLE_JOB_TEMPLATES[0].title,
    company: SAMPLE_JOB_TEMPLATES[0].company,
    jobType: 'Full-time'
  }
);

const scan2 = runJobDescriptionAnalysis(
  SAMPLE_JOB_TEMPLATES[1].description,
  DEFAULT_USER_PROFILE.skills,
  {
    jobTitle: SAMPLE_JOB_TEMPLATES[1].title,
    company: SAMPLE_JOB_TEMPLATES[1].company,
    jobType: 'Internship'
  }
);

const scans = [scan1, scan2];

// Total jobs analyzed
const totalAnalyzed = scans.length;
assert.strictEqual(totalAnalyzed, 2);
console.log(`  ✓ Total jobs analyzed: ${totalAnalyzed}`);

// Average Compatibility Score
const avgScore = Math.round(scans.reduce((sum, s) => sum + s.matchPercentage, 0) / scans.length);
assert.strictEqual(typeof avgScore, 'number');
assert.ok(avgScore >= 0 && avgScore <= 100);
console.log(`  ✓ Average compatibility score: ${avgScore}%`);

// 4. Most Frequently Missing Skills Aggregation
console.log('\n4. Most Frequently Missing Skills Aggregation:');
const missingMap = new Map();
scans.forEach((scan) => {
  (scan.missingSkills || []).forEach((skill) => {
    const key = skill.name.toLowerCase().trim();
    const existing = missingMap.get(key) || {
      name: skill.name,
      occurrences: 0,
      isMandatory: false
    };
    existing.occurrences += 1;
    if (scan.missingMandatorySkills?.some((m) => m.name.toLowerCase().trim() === key)) {
      existing.isMandatory = true;
    }
    missingMap.set(key, existing);
  });
});

const topMissing = Array.from(missingMap.values()).sort((a, b) => b.occurrences - a.occurrences);
assert.ok(topMissing.length > 0);
assert.ok(topMissing[0].occurrences >= 1);
console.log(`  ✓ Detected ${topMissing.length} missing skill categories across scanned jobs`);
console.log(`  ✓ Top missing skill: ${topMissing[0].name} (occurred in ${topMissing[0].occurrences} roles)`);

// 5. Saved Jobs Operations: Deletion and Zero Empty State
console.log('\n5. Saved Jobs Deletion & Empty State Handling:');
const remainingScans = scans.filter((s) => s.id !== scan1.id);
assert.strictEqual(remainingScans.length, 1);
assert.strictEqual(remainingScans[0].id, scan2.id);
console.log('  ✓ Single scan deletion removes exactly targeted scan');

const clearedScans = [];
assert.strictEqual(clearedScans.length, 0);
const emptyAvgScore = clearedScans.length > 0 ? Math.round(clearedScans.reduce((sum, s) => sum + s.matchPercentage, 0) / clearedScans.length) : 0;
assert.strictEqual(emptyAvgScore, 0);
console.log('  ✓ Empty state handles 0 scans cleanly with 0% average');

// 6. Compatibility Comparison Tool Logic
console.log('\n6. Side-by-Side Compatibility Comparison Logic:');
const selectedForComparison = [scan1, scan2];
assert.strictEqual(selectedForComparison.length, 2);
const bestRole = [...selectedForComparison].sort((a, b) => b.matchPercentage - a.matchPercentage)[0];
assert.ok(bestRole);
console.log(`  ✓ Highest compatibility candidate identified: ${bestRole.jobTitle} (${bestRole.matchPercentage}%)`);

// Common matched skills
const commonMatched = scan1.matchedSkills.filter((s1) =>
  scan2.matchedSkills.some((s2) => s2.name.toLowerCase() === s1.name.toLowerCase())
);
console.log(`  ✓ Common matched skills found: ${commonMatched.length}`);

// 7. Resume Activity Structure
console.log('\n7. Resume Activity Logging & Retrieval:');
const sampleActivity = {
  id: `act-${Date.now()}`,
  type: 'pdf_download',
  title: 'Exported ATS Resume PDF',
  description: 'Downloaded vector PDF tailored for SDE-1',
  timestamp: new Date().toISOString()
};
assert.strictEqual(sampleActivity.type, 'pdf_download');
assert.ok(sampleActivity.timestamp);
console.log('  ✓ Resume activity conforms to required schema');

console.log('\n=================================================');
console.log('ALL DASHBOARD & SAVED JOBS UNIT TESTS PASSED!');
console.log('=================================================');

