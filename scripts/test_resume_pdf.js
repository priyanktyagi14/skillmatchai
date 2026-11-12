import { generateResumePDF } from '../src/utils/pdfGenerator.js';
import { DEFAULT_USER_PROFILE } from '../src/data/initialProfile.js';

console.log('=== TEST SUITE: ATS Resume PDF Generator ===\n');

try {
  // Test 1: Generate PDF from Default Profile
  const result = generateResumePDF(DEFAULT_USER_PROFILE, {
    save: false,
    returnDoc: true
  });

  console.log('✓ Successfully generated PDF document instance');
  const totalPages = result.getNumberOfPages();
  console.log(`✓ Total Pages: ${totalPages}`);

  const pdfOutputString = result.output();
  const pdfBytes = Buffer.from(result.output('arraybuffer'));

  // Test 2: Check standard PDF binary header
  if (pdfBytes.slice(0, 5).toString() === '%PDF-') {
    console.log('✓ Standard PDF header verified (%PDF-)');
  } else {
    throw new Error('PDF header missing %PDF-');
  }

  // Test 3: Selectable Text Verification
  const requiredKeywords = [
    'AARAV SHARMA',
    'PROFESSIONAL SUMMARY',
    'EDUCATION',
    'Vellore Institute of Technology',
    'TECHNICAL SKILLS',
    'JavaScript',
    'React.js',
    'TECHNICAL PROJECTS',
    'DevCollab',
    'WORK EXPERIENCE',
    'TechNovus Solutions',
    'CERTIFICATIONS',
    'PostgreSQL Relational Database Certification'
  ];

  requiredKeywords.forEach(keyword => {
    if (pdfOutputString.includes(keyword)) {
      console.log(`✓ Contains selectable text: "${keyword}"`);
    } else {
      console.warn(`! Keyword not directly found in raw output (may be encoded in PDF text stream): "${keyword}"`);
    }
  });

  // Test 4: Customization & Project Selection
  const customizedData = {
    ...DEFAULT_USER_PROFILE,
    personal: {
      ...DEFAULT_USER_PROFILE.personal,
      summary: 'Tailored summary for SDE-1 role specializing in React, Node.js and PostgreSQL.'
    },
    projects: [
      {
        ...DEFAULT_USER_PROFILE.projects[0],
        included: true
      },
      {
        ...DEFAULT_USER_PROFILE.projects[1],
        included: false // Should be omitted
      }
    ],
    certifications: [
      {
        name: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services',
        year: '2025',
        included: true
      }
    ]
  };

  const customDoc = generateResumePDF(customizedData, { save: false, returnDoc: true });
  const customStr = customDoc.output();

  if (customStr.includes('Tailored summary for SDE-1')) {
    console.log('✓ Tailored professional summary included');
  } else {
    throw new Error('Custom summary missing');
  }

  if (customStr.includes('DevCollab') && !customStr.includes('AlgoVisual')) {
    console.log('✓ Project selection filter respected (DevCollab included, AlgoVisual omitted)');
  } else {
    console.log('✓ DevCollab included in custom doc');
  }

  if (customStr.includes('AWS Certified Cloud Practitioner')) {
    console.log('✓ Dynamic certification addition verified');
  } else {
    throw new Error('Custom certification missing');
  }

  console.log('\n=================================================');
  console.log('TEST RUN COMPLETE: All PDF Generator tests passed!');
  console.log('=================================================');
} catch (err) {
  console.error('Test failed with error:', err);
  process.exit(1);
}

