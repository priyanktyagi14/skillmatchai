import { SKILL_CATEGORIES } from './skillsTaxonomy.js';

export const EMPTY_USER_PROFILE = {
  personal: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    summary: ''
  },
  education: {
    degree: '',
    branch: '',
    college: '',
    institution: '',
    location: '',
    graduationYear: '',
    cgpa: '',
    relevantCoursework: ''
  },
  targetPreferences: {
    primaryRole: '',
    secondaryRoles: [],
    preferredLocations: [],
    workType: ''
  },
  skills: [],
  projects: [],
  experience: [],
  certifications: []
};

export const DEFAULT_USER_PROFILE = {
  personal: {
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma.tech@gmail.com',
    phone: '+91 98765 43210',
    location: 'Bangalore, Karnataka, India',
    linkedin: 'https://linkedin.com/in/aarav-sharma-dev',
    github: 'https://github.com/aaravsharma-tech',
    portfolio: 'https://aaravsharma.dev',
    summary: 'Proactive B.Tech Computer Science graduate (2025) with a solid foundation in Data Structures, Algorithms, and Modern Web Architectures. Built full-stack web applications with React, Node.js, and PostgreSQL. Passionate about writing clean, maintainable code and solving real-world customer problems in fast-paced engineering teams.'
  },
  education: {
    degree: 'Bachelor of Technology (B.Tech)',
    branch: 'Computer Science and Engineering',
    college: 'Vellore Institute of Technology (VIT)',
    institution: 'Vellore Institute of Technology (VIT)',
    location: 'Vellore, Tamil Nadu',
    graduationYear: '2025',
    cgpa: '8.72 / 10.0',
    relevantCoursework: 'Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Operating Systems, Computer Networks'
  },
  targetPreferences: {
    primaryRole: 'Software Development Engineer - I (SDE-1)',
    secondaryRoles: ['Full Stack Developer', 'Frontend Developer'],
    preferredLocations: ['Bangalore', 'Hyderabad', 'Remote', 'Pune'],
    workType: 'Full-time / Fresher'
  },
  skills: [
    // 1. Programming Languages
    { name: 'JavaScript', category: SKILL_CATEGORIES.PROGRAMMING_LANGUAGES, level: 'Advanced' },
    { name: 'TypeScript', category: SKILL_CATEGORIES.PROGRAMMING_LANGUAGES, level: 'Intermediate' },
    { name: 'Python', category: SKILL_CATEGORIES.PROGRAMMING_LANGUAGES, level: 'Intermediate' },
    { name: 'Java', category: SKILL_CATEGORIES.PROGRAMMING_LANGUAGES, level: 'Intermediate' },
    { name: 'SQL', category: SKILL_CATEGORIES.PROGRAMMING_LANGUAGES, level: 'Intermediate' },
    { name: 'HTML5 & CSS3', category: SKILL_CATEGORIES.PROGRAMMING_LANGUAGES, level: 'Advanced' },

    // 2. Frontend Development
    { name: 'React.js', category: SKILL_CATEGORIES.FRONTEND, level: 'Advanced' },
    { name: 'Tailwind CSS', category: SKILL_CATEGORIES.FRONTEND, level: 'Advanced' },
    { name: 'Redux / State Management', category: SKILL_CATEGORIES.FRONTEND, level: 'Intermediate' },
    { name: 'Responsive Web Design', category: SKILL_CATEGORIES.FRONTEND, level: 'Advanced' },

    // 3. Backend Development
    { name: 'Node.js', category: SKILL_CATEGORIES.BACKEND, level: 'Intermediate' },
    { name: 'Express.js', category: SKILL_CATEGORIES.BACKEND, level: 'Intermediate' },
    { name: 'RESTful APIs', category: SKILL_CATEGORIES.BACKEND, level: 'Advanced' },
    { name: 'Authentication & JWT / OAuth', category: SKILL_CATEGORIES.BACKEND, level: 'Intermediate' },

    // 4. Databases
    { name: 'PostgreSQL', category: SKILL_CATEGORIES.DATABASES, level: 'Intermediate' },
    { name: 'MongoDB', category: SKILL_CATEGORIES.DATABASES, level: 'Intermediate' },
    { name: 'Redis', category: SKILL_CATEGORIES.DATABASES, level: 'Beginner' },

    // 5. Cloud and DevOps
    { name: 'Git & GitHub', category: SKILL_CATEGORIES.CLOUD_DEVOPS, level: 'Advanced' },
    { name: 'Docker & Containerization', category: SKILL_CATEGORIES.CLOUD_DEVOPS, level: 'Intermediate' },

    // 6. Cybersecurity
    { name: 'OWASP Top 10 & Web App Security', category: SKILL_CATEGORIES.CYBERSECURITY, level: 'Beginner' },
    { name: 'Cryptography & PKI', category: SKILL_CATEGORIES.CYBERSECURITY, level: 'Beginner' },

    // 7. Artificial Intelligence and Machine Learning
    { name: 'LLM & Generative AI Integration', category: SKILL_CATEGORIES.AI_ML, level: 'Intermediate' },

    // 8. Tools and Technologies
    { name: 'Data Structures & Algorithms', category: SKILL_CATEGORIES.TOOLS_TECH, level: 'Intermediate' },
    { name: 'Object-Oriented Programming (OOP)', category: SKILL_CATEGORIES.TOOLS_TECH, level: 'Advanced' },
    { name: 'Database Management Systems (DBMS)', category: SKILL_CATEGORIES.TOOLS_TECH, level: 'Intermediate' },
    { name: 'Operating Systems Concepts', category: SKILL_CATEGORIES.TOOLS_TECH, level: 'Intermediate' },
    { name: 'Postman / API Testing', category: SKILL_CATEGORIES.TOOLS_TECH, level: 'Advanced' }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'DevCollab — Real-Time Developer Collaboration Platform',
      title: 'DevCollab — Real-Time Developer Collaboration Platform',
      description: 'A collaborative real-time code editor and digital whiteboard system designed for distributed engineering teams and live technical pair-programming.',
      technologies: 'React.js, Node.js, Express, PostgreSQL, Socket.io, Tailwind CSS',
      techStack: 'React.js, Node.js, Express, PostgreSQL, Socket.io, Tailwind CSS',
      projectUrl: 'https://devcollab-demo.vercel.app',
      liveUrl: 'https://devcollab-demo.vercel.app',
      githubUrl: 'https://github.com/aaravsharma-tech/devcollab',
      contribution: 'Architected the real-time WebSocket session layer supporting 50+ concurrent users with <80ms broadcast latency. Implemented secure JWT cookie auth with refresh rotation and optimized PostgreSQL connection pooling to cut API response latency by 38%.',
      date: 'Aug 2024 - Nov 2024',
      bullets: [
        'Architected a collaborative code editor and whiteboard supporting 50+ concurrent users with sub-80ms WebSocket latency.',
        'Engineered secure JWT token-based session authentication with refresh token rotation and bcrypt password hashing.',
        'Optimized PostgreSQL database queries and connection pooling, reducing average API response times by 38% under synthetic stress load.'
      ]
    },
    {
      id: 'proj-2',
      name: 'AlgoVisual — Interactive Algorithm Visualizer',
      title: 'AlgoVisual — Interactive Algorithm Visualizer',
      description: 'An interactive pedagogical web platform that visually demonstrates 15+ sorting, searching, and graph traversal algorithms with step-by-step memory frame execution.',
      technologies: 'React.js, TypeScript, Canvas API, Tailwind CSS',
      techStack: 'React.js, TypeScript, Canvas API, Tailwind CSS',
      projectUrl: 'https://algovisual.vercel.app',
      liveUrl: 'https://algovisual.vercel.app',
      githubUrl: 'https://github.com/aaravsharma-tech/algovisual',
      contribution: 'Designed TypeScript finite state machines for reversible step-by-step execution and custom speed throttles. Built responsive HTML5 canvas graphics and reached 1,200+ monthly active student visitors.',
      date: 'Jan 2024 - Apr 2024',
      bullets: [
        'Built an interactive learning web tool visualizing 15+ sorting and graph traversal algorithms with step-by-step playback controls.',
        'Designed custom state machines in TypeScript to seamlessly handle playback speeds, step reverses, and custom test arrays.',
        'Garnered 1,200+ unique monthly visitors across student peer groups and open-source GitHub stars.'
      ]
    }
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'Software Engineering Intern',
      company: 'TechNovus Solutions',
      type: 'Internship',
      location: 'Bangalore, India',
      period: 'May 2024 - Jul 2024',
      description: 'Worked with the core product team developing customer telemetry dashboards and reusable accessibility-tested React component libraries.',
      contribution: 'Developed 8+ reusable React UI components conforming to accessibility guidelines, accelerating sprint feature delivery by 22%. Built and integrated 6 RESTful API endpoints using Node.js and Express to process customer telemetry logs.',
      bullets: [
        'Developed 8+ reusable React UI components conforming to accessibility guidelines, accelerating sprint feature delivery by 22%.',
        'Built and integrated 6 RESTful API endpoints using Node.js and Express to process customer telemetry logs.',
        'Collaborated daily with senior engineering leads in Agile Scrum sprints, code reviews, and automated CI test runs.'
      ]
    }
  ],
  certifications: [
    {
      name: 'PostgreSQL Relational Database Certification',
      issuer: 'freeCodeCamp',
      year: '2024'
    },
    {
      name: 'Meta Front-End Developer Specialization',
      issuer: 'Coursera / Meta',
      year: '2024'
    }
  ]
};
