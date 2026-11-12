// 8 Canonical Skill Categories for SkillMatch AI
export const SKILL_CATEGORIES = {
  PROGRAMMING_LANGUAGES: 'Programming Languages',
  FRONTEND: 'Frontend Development',
  BACKEND: 'Backend Development',
  DATABASES: 'Databases',
  CLOUD_DEVOPS: 'Cloud and DevOps',
  CYBERSECURITY: 'Cybersecurity',
  AI_ML: 'Artificial Intelligence and Machine Learning',
  TOOLS_TECH: 'Tools and Technologies',

  // Backward compatibility aliases
  LANGUAGES: 'Programming Languages',
  CS_CORE: 'Tools and Technologies',
  DEVOPS_CLOUD: 'Cloud and DevOps',
  TOOLS_TESTING: 'Tools and Technologies',
  AI_DATA: 'Artificial Intelligence and Machine Learning'
};

export const SKILL_CATEGORY_LIST = [
  'Programming Languages',
  'Frontend Development',
  'Backend Development',
  'Databases',
  'Cloud and DevOps',
  'Cybersecurity',
  'Artificial Intelligence and Machine Learning',
  'Tools and Technologies'
];

export const normalizeSkillCategory = (category) => {
  if (!category) return SKILL_CATEGORIES.PROGRAMMING_LANGUAGES;
  const lower = category.trim().toLowerCase();

  if (lower.includes('language')) return SKILL_CATEGORIES.PROGRAMMING_LANGUAGES;
  if (lower.includes('front')) return SKILL_CATEGORIES.FRONTEND;
  if (lower.includes('back') || lower.includes('api')) return SKILL_CATEGORIES.BACKEND;
  if (lower.includes('data') && (lower.includes('base') || lower.includes('storage') || lower.includes('sql') || lower.includes('db'))) return SKILL_CATEGORIES.DATABASES;
  if (lower.includes('cloud') || lower.includes('devops') || lower.includes('infra') || lower.includes('docker') || lower.includes('kubernetes')) return SKILL_CATEGORIES.CLOUD_DEVOPS;
  if (lower.includes('cyber') || lower.includes('security') || lower.includes('crypt') || lower.includes('owasp') || lower.includes('pen')) return SKILL_CATEGORIES.CYBERSECURITY;
  if (lower.includes('ai') || lower.includes('ml') || lower.includes('machine') || lower.includes('intelligence') || lower.includes('deep learning')) return SKILL_CATEGORIES.AI_ML;
  if (lower.includes('tool') || lower.includes('test') || lower.includes('core') || lower.includes('cs') || lower.includes('algorithm')) return SKILL_CATEGORIES.TOOLS_TECH;

  const exact = SKILL_CATEGORY_LIST.find(c => c.toLowerCase() === lower);
  return exact || SKILL_CATEGORIES.TOOLS_TECH;
};

/**
 * Predefined Technical Skills Dictionary containing:
 * Python, Java, C, C++, JavaScript, TypeScript, HTML, CSS, React, Node.js,
 * Express.js, SQL, MongoDB, PostgreSQL, Git, GitHub, Docker, Kubernetes,
 * AWS, Azure, Linux, REST APIs, CI/CD, cybersecurity, penetration testing,
 * machine learning, deep learning, NLP, TensorFlow and PyTorch.
 */
export const PREDEFINED_TECHNICAL_SKILLS = [
  {
    id: 'python',
    name: 'Python',
    category: SKILL_CATEGORIES.PROGRAMMING_LANGUAGES,
    aliases: ['python', 'py', 'python3', 'python 3', 'python2'],
    weight: 1.0
  },
  {
    id: 'java',
    name: 'Java',
    category: SKILL_CATEGORIES.PROGRAMMING_LANGUAGES,
    aliases: ['java', 'core java', 'java 8', 'java 11', 'java 17', 'java 21', 'jdk'],
    weight: 1.0
  },
  {
    id: 'c',
    name: 'C',
    category: SKILL_CATEGORIES.PROGRAMMING_LANGUAGES,
    aliases: ['c language', 'c programming', 'ansi c', 'c'],
    weight: 0.8
  },
  {
    id: 'cpp',
    name: 'C++',
    category: SKILL_CATEGORIES.PROGRAMMING_LANGUAGES,
    aliases: ['c++', 'cpp', 'c plus plus', 'cplusplus'],
    weight: 0.9
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: SKILL_CATEGORIES.PROGRAMMING_LANGUAGES,
    aliases: ['javascript', 'js', 'es6', 'es6+', 'ecmascript'],
    weight: 1.0
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: SKILL_CATEGORIES.PROGRAMMING_LANGUAGES,
    aliases: ['typescript', 'ts'],
    weight: 0.9
  },
  {
    id: 'html',
    name: 'HTML',
    category: SKILL_CATEGORIES.FRONTEND,
    aliases: ['html', 'html5', 'html 5'],
    weight: 0.8
  },
  {
    id: 'css',
    name: 'CSS',
    category: SKILL_CATEGORIES.FRONTEND,
    aliases: ['css', 'css3', 'cascading style sheets'],
    weight: 0.8
  },
  {
    id: 'react',
    name: 'React',
    category: SKILL_CATEGORIES.FRONTEND,
    aliases: ['react', 'react.js', 'reactjs', 'react js'],
    weight: 1.0
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    category: SKILL_CATEGORIES.BACKEND,
    aliases: ['node.js', 'nodejs', 'node js', 'node'],
    weight: 1.0
  },
  {
    id: 'express',
    name: 'Express.js',
    category: SKILL_CATEGORIES.BACKEND,
    aliases: ['express.js', 'expressjs', 'express js', 'express'],
    weight: 0.9
  },
  {
    id: 'sql',
    name: 'SQL',
    category: SKILL_CATEGORIES.DATABASES,
    aliases: ['sql', 'structured query language', 'relational database', 'rdbms'],
    weight: 1.0
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    category: SKILL_CATEGORIES.DATABASES,
    aliases: ['mongodb', 'mongo', 'mongoose', 'nosql mongodb'],
    weight: 0.9
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: SKILL_CATEGORIES.DATABASES,
    aliases: ['postgresql', 'postgres', 'psql'],
    weight: 1.0
  },
  {
    id: 'git',
    name: 'Git',
    category: SKILL_CATEGORIES.CLOUD_DEVOPS,
    aliases: ['git', 'version control', 'git scm'],
    weight: 1.0
  },
  {
    id: 'github',
    name: 'GitHub',
    category: SKILL_CATEGORIES.CLOUD_DEVOPS,
    aliases: ['github', 'gh', 'github actions'],
    weight: 0.8
  },
  {
    id: 'docker',
    name: 'Docker',
    category: SKILL_CATEGORIES.CLOUD_DEVOPS,
    aliases: ['docker', 'docker container', 'docker containers', 'containerization', 'dockerfile', 'docker-compose'],
    weight: 0.9
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    category: SKILL_CATEGORIES.CLOUD_DEVOPS,
    aliases: ['kubernetes', 'k8s', 'k8', 'kube'],
    weight: 0.8
  },
  {
    id: 'aws',
    name: 'AWS',
    category: SKILL_CATEGORIES.CLOUD_DEVOPS,
    aliases: ['aws', 'amazon web services', 'ec2', 's3', 'aws lambda', 'cloudwatch'],
    weight: 0.8
  },
  {
    id: 'azure',
    name: 'Azure',
    category: SKILL_CATEGORIES.CLOUD_DEVOPS,
    aliases: ['azure', 'microsoft azure', 'azure cloud'],
    weight: 0.8
  },
  {
    id: 'linux',
    name: 'Linux',
    category: SKILL_CATEGORIES.CLOUD_DEVOPS,
    aliases: ['linux', 'unix', 'ubuntu', 'bash', 'shell scripting', 'shell script'],
    weight: 0.8
  },
  {
    id: 'rest_apis',
    name: 'REST APIs',
    category: SKILL_CATEGORIES.BACKEND,
    aliases: ['rest apis', 'rest api', 'restful', 'restful api', 'restful apis', 'rest', 'rest web services', 'restful web services'],
    weight: 1.0
  },
  {
    id: 'cicd',
    name: 'CI/CD',
    category: SKILL_CATEGORIES.CLOUD_DEVOPS,
    aliases: ['ci/cd', 'cicd', 'ci / cd', 'continuous integration', 'continuous delivery', 'continuous deployment'],
    weight: 0.8
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    category: SKILL_CATEGORIES.CYBERSECURITY,
    aliases: ['cybersecurity', 'cyber security', 'infosec', 'information security', 'network security', 'application security'],
    weight: 0.8
  },
  {
    id: 'penetration_testing',
    name: 'Penetration Testing',
    category: SKILL_CATEGORIES.CYBERSECURITY,
    aliases: ['penetration testing', 'pentesting', 'pen testing', 'pen-testing', 'ethical hacking', 'vulnerability assessment', 'vapt', 'metasploit', 'burp suite'],
    weight: 0.8
  },
  {
    id: 'machine_learning',
    name: 'Machine Learning',
    category: SKILL_CATEGORIES.AI_ML,
    aliases: ['machine learning', 'ml', 'scikit-learn', 'sklearn', 'supervised learning', 'unsupervised learning'],
    weight: 0.8
  },
  {
    id: 'deep_learning',
    name: 'Deep Learning',
    category: SKILL_CATEGORIES.AI_ML,
    aliases: ['deep learning', 'dl', 'neural networks', 'ann', 'cnn', 'rnn'],
    weight: 0.8
  },
  {
    id: 'nlp',
    name: 'NLP',
    category: SKILL_CATEGORIES.AI_ML,
    aliases: ['nlp', 'natural language processing', 'large language models', 'llm', 'llms', 'transformers', 'bert'],
    weight: 0.8
  },
  {
    id: 'tensorflow',
    name: 'TensorFlow',
    category: SKILL_CATEGORIES.AI_ML,
    aliases: ['tensorflow', 'tf', 'keras'],
    weight: 0.8
  },
  {
    id: 'pytorch',
    name: 'PyTorch',
    category: SKILL_CATEGORIES.AI_ML,
    aliases: ['pytorch', 'torch'],
    weight: 0.8
  }
];

// Additional complementary skills to maintain rich taxonomy
const ADDITIONAL_TAXONOMY_SKILLS = [
  // Programming Languages
  { id: 'go', name: 'Go (Golang)', category: SKILL_CATEGORIES.PROGRAMMING_LANGUAGES, aliases: ['golang', 'go language', 'go'], weight: 0.8 },
  { id: 'html_css', name: 'HTML5 & CSS3', category: SKILL_CATEGORIES.PROGRAMMING_LANGUAGES, aliases: ['html5 & css3', 'html and css'], weight: 0.8 },
  { id: 'rust', name: 'Rust', category: SKILL_CATEGORIES.PROGRAMMING_LANGUAGES, aliases: ['rust', 'rustlang'], weight: 0.8 },
  { id: 'csharp', name: 'C#', category: SKILL_CATEGORIES.PROGRAMMING_LANGUAGES, aliases: ['c#', 'csharp', '.net'], weight: 0.8 },
  { id: 'php', name: 'PHP', category: SKILL_CATEGORIES.PROGRAMMING_LANGUAGES, aliases: ['php'], weight: 0.7 },
  { id: 'kotlin', name: 'Kotlin', category: SKILL_CATEGORIES.PROGRAMMING_LANGUAGES, aliases: ['kotlin'], weight: 0.8 },

  // Frontend
  { id: 'nextjs', name: 'Next.js', category: SKILL_CATEGORIES.FRONTEND, aliases: ['next.js', 'nextjs', 'next'], weight: 0.9 },
  { id: 'tailwind', name: 'Tailwind CSS', category: SKILL_CATEGORIES.FRONTEND, aliases: ['tailwind', 'tailwindcss'], weight: 0.8 },
  { id: 'redux', name: 'Redux / State Management', category: SKILL_CATEGORIES.FRONTEND, aliases: ['redux', 'redux toolkit', 'zustand', 'context api'], weight: 0.8 },
  { id: 'vue', name: 'Vue.js', category: SKILL_CATEGORIES.FRONTEND, aliases: ['vue', 'vue.js', 'vuejs'], weight: 0.7 },
  { id: 'angular', name: 'Angular', category: SKILL_CATEGORIES.FRONTEND, aliases: ['angular', 'angularjs'], weight: 0.8 },
  { id: 'responsive_design', name: 'Responsive Web Design', category: SKILL_CATEGORIES.FRONTEND, aliases: ['responsive design', 'mobile-first', 'flexbox', 'css grid'], weight: 0.7 },

  // Backend
  { id: 'spring_boot', name: 'Spring Boot', category: SKILL_CATEGORIES.BACKEND, aliases: ['spring', 'spring boot', 'spring framework', 'springboot'], weight: 1.0 },
  { id: 'graphql', name: 'GraphQL', category: SKILL_CATEGORIES.BACKEND, aliases: ['graphql', 'apollo'], weight: 0.7 },
  { id: 'django', name: 'Django', category: SKILL_CATEGORIES.BACKEND, aliases: ['django', 'django rest framework'], weight: 0.8 },
  { id: 'fastapi', name: 'FastAPI', category: SKILL_CATEGORIES.BACKEND, aliases: ['fastapi', 'fast api'], weight: 0.8 },
  { id: 'microservices', name: 'Microservices Architecture', category: SKILL_CATEGORIES.BACKEND, aliases: ['microservices', 'microservice'], weight: 0.8 },
  { id: 'auth_jwt', name: 'Authentication & JWT / OAuth', category: SKILL_CATEGORIES.BACKEND, aliases: ['jwt', 'oauth', 'oauth2', 'authentication', 'authorization'], weight: 0.8 },

  // Databases
  { id: 'mysql', name: 'MySQL', category: SKILL_CATEGORIES.DATABASES, aliases: ['mysql'], weight: 0.9 },
  { id: 'redis', name: 'Redis', category: SKILL_CATEGORIES.DATABASES, aliases: ['redis', 'caching', 'in-memory database'], weight: 0.8 },
  { id: 'prisma', name: 'Prisma / ORMs', category: SKILL_CATEGORIES.DATABASES, aliases: ['prisma', 'hibernate', 'typeorm', 'sqlalchemy', 'orm'], weight: 0.7 },

  // Cloud & DevOps
  { id: 'git_github', name: 'Git & GitHub', category: SKILL_CATEGORIES.CLOUD_DEVOPS, aliases: ['git & github', 'git and github'], weight: 1.0 },
  { id: 'gcp', name: 'Google Cloud Platform (GCP)', category: SKILL_CATEGORIES.CLOUD_DEVOPS, aliases: ['gcp', 'google cloud'], weight: 0.8 },
  { id: 'terraform', name: 'Terraform & IaC', category: SKILL_CATEGORIES.CLOUD_DEVOPS, aliases: ['terraform', 'iac'], weight: 0.7 },

  // Cybersecurity
  { id: 'owasp', name: 'OWASP Top 10 & Web App Security', category: SKILL_CATEGORIES.CYBERSECURITY, aliases: ['owasp', 'xss', 'csrf', 'sql injection', 'web security'], weight: 0.9 },
  { id: 'cryptography', name: 'Cryptography & PKI', category: SKILL_CATEGORIES.CYBERSECURITY, aliases: ['cryptography', 'encryption', 'pki', 'ssl/tls'], weight: 0.8 },

  // AI & ML
  { id: 'genai_llm', name: 'LLM & Generative AI Integration', category: SKILL_CATEGORIES.AI_ML, aliases: ['llm', 'genai', 'langchain', 'openai api', 'rag'], weight: 0.8 },
  { id: 'pandas_numpy', name: 'Pandas & NumPy', category: SKILL_CATEGORIES.AI_ML, aliases: ['pandas', 'numpy', 'data analysis'], weight: 0.8 },

  // Tools & Technologies
  { id: 'dsa', name: 'Data Structures & Algorithms', category: SKILL_CATEGORIES.TOOLS_TECH, aliases: ['dsa', 'data structures', 'algorithms', 'problem solving', 'leetcode'], weight: 1.0 },
  { id: 'oops', name: 'Object-Oriented Programming (OOP)', category: SKILL_CATEGORIES.TOOLS_TECH, aliases: ['oop', 'oops', 'object-oriented', 'polymorphism', 'inheritance'], weight: 1.0 },
  { id: 'dbms', name: 'Database Management Systems (DBMS)', category: SKILL_CATEGORIES.TOOLS_TECH, aliases: ['dbms', 'normalization', 'acid properties', 'indexing'], weight: 0.9 },
  { id: 'os_concepts', name: 'Operating Systems Concepts', category: SKILL_CATEGORIES.TOOLS_TECH, aliases: ['operating systems', 'os', 'threads', 'processes', 'concurrency'], weight: 0.9 },
  { id: 'networking', name: 'Computer Networks', category: SKILL_CATEGORIES.TOOLS_TECH, aliases: ['computer networks', 'networking', 'tcp/ip', 'http/https', 'dns'], weight: 0.8 },
  { id: 'system_design', name: 'System Design Basics / LLD', category: SKILL_CATEGORIES.TOOLS_TECH, aliases: ['system design', 'lld', 'low level design', 'design patterns'], weight: 0.8 },
  { id: 'postman', name: 'Postman / API Testing', category: SKILL_CATEGORIES.TOOLS_TECH, aliases: ['postman', 'api testing', 'swagger', 'openapi'], weight: 0.8 },
  { id: 'unit_testing', name: 'Unit Testing (Jest/JUnit)', category: SKILL_CATEGORIES.TOOLS_TECH, aliases: ['jest', 'junit', 'pytest', 'testing', 'unit tests'], weight: 0.8 },
  { id: 'agile_scrum', name: 'Agile / Scrum Methodologies', category: SKILL_CATEGORIES.TOOLS_TECH, aliases: ['agile', 'scrum', 'jira', 'sprints'], weight: 0.7 }
];

export const TECH_SKILLS = [
  ...PREDEFINED_TECHNICAL_SKILLS,
  ...ADDITIONAL_TAXONOMY_SKILLS
];

export const ALL_SKILL_NAMES = TECH_SKILLS.map(s => s.name);
