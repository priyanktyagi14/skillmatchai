/**
 * Predefined Learning Resources & Curated Study Guides for Technical Skills
 * Strictly adheres to verified documentation without inventing arbitrary URLs.
 */

export const PREDEFINED_SKILL_RESOURCES = {
  python: {
    canonicalName: 'Python',
    resources: [
      {
        name: 'Official Python Tutorial',
        url: 'https://docs.python.org/3/tutorial/',
        type: 'Official Documentation',
        description: 'Comprehensive, official guide to core Python syntax, data structures, and standard library modules.'
      }
    ],
    whyMatters: 'Python powers backend microservices, data processing pipelines, automation scripting, and AI/ML workflows across modern tech companies.'
  },
  javascript: {
    canonicalName: 'JavaScript',
    resources: [
      {
        name: 'MDN JavaScript Guide',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
        type: 'Official Guide',
        description: 'In-depth guide by Mozilla covering modern ECMAScript, asynchronous programming, DOM APIs, and closures.'
      }
    ],
    whyMatters: 'JavaScript is the fundamental language of the web, essential for frontend interactivity, client-side state, and serverless runtimes.'
  },
  react: {
    canonicalName: 'React',
    resources: [
      {
        name: 'Official React Documentation',
        url: 'https://react.dev/learn',
        type: 'Official Documentation',
        description: 'Modern component-driven tutorials teaching React Hooks, state management, suspense, and rendering cycles.'
      }
    ],
    whyMatters: 'React is the most sought-after frontend library for creating responsive, maintainable single-page enterprise web applications.'
  },
  git: {
    canonicalName: 'Git',
    resources: [
      {
        name: 'Official Git Documentation & Pro Git Book',
        url: 'https://git-scm.com/doc',
        type: 'Official Documentation',
        description: 'The authoritative reference for branch management, rebasing, commit hygiene, and distributed version control.'
      }
    ],
    whyMatters: 'Git is non-negotiable for collaborative software engineering, peer code reviews, CI/CD pull requests, and conflict resolution.'
  },
  docker: {
    canonicalName: 'Docker',
    resources: [
      {
        name: 'Official Docker Documentation',
        url: 'https://docs.docker.com/',
        type: 'Official Documentation',
        description: 'Official guides for containerization, Dockerfile optimization, multi-container compose, and volume isolation.'
      }
    ],
    whyMatters: 'Containers eliminate "works on my machine" defects, ensuring reproducible dev environments and scalable containerized deployments.'
  },
  linux: {
    canonicalName: 'Linux',
    resources: [
      {
        name: 'Linux Journey Interactive Guide',
        url: 'https://linuxjourney.com/',
        type: 'Interactive Guide',
        description: 'Structured walkthrough of bash scripting, file permissions, process management, and terminal navigation.'
      }
    ],
    whyMatters: 'Over 90% of cloud servers and container runtimes run Linux; command-line fluency is indispensable for debugging and deployments.'
  },
  cybersecurity: {
    canonicalName: 'Cybersecurity',
    resources: [
      {
        name: 'TryHackMe Hands-on Security Labs',
        url: 'https://tryhackme.com/',
        type: 'Hands-on Labs',
        description: 'Gamified, bite-sized cybersecurity rooms covering networking, privilege escalation, and security fundamentals.'
      },
      {
        name: 'OWASP Foundation Security Standards',
        url: 'https://owasp.org/',
        type: 'Security Standard',
        description: 'Open Worldwide Application Security Project standards, vulnerability cheat sheets, and Top 10 web attack mitigation.'
      }
    ],
    whyMatters: 'Security awareness prevents catastrophic data breaches, securing endpoints, session authentication, and user data privacy.'
  },
  machine_learning: {
    canonicalName: 'Machine Learning',
    resources: [
      {
        name: 'Scikit-Learn User Guide & Tutorials',
        url: 'https://scikit-learn.org/stable/user_guide.html',
        type: 'Official Documentation',
        description: 'Step-by-step practical machine learning guide covering regression, classification, clustering, and cross-validation.'
      }
    ],
    whyMatters: 'ML empowers predictive modeling, recommendation systems, and algorithmic automation from unstructured tabular or textual data.'
  },
  typescript: {
    canonicalName: 'TypeScript',
    resources: [
      {
        name: 'Official TypeScript Handbook',
        url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
        type: 'Official Documentation',
        description: 'Official guide to static typing, interfaces, generics, utility types, and strict compilation.'
      }
    ],
    whyMatters: 'TypeScript eliminates runtime type bugs at compile time and is the enterprise standard for scalable frontend and Node backends.'
  },
  nodejs: {
    canonicalName: 'Node.js',
    resources: [
      {
        name: 'Node.js Official Documentation & Guides',
        url: 'https://nodejs.org/en/docs/guides',
        type: 'Official Documentation',
        description: 'Core concepts including the event loop, non-blocking I/O, Buffer, streams, and asynchronous file handling.'
      }
    ],
    whyMatters: 'Node.js enables high-throughput, asynchronous server architectures and unified full-stack JavaScript codebases.'
  },
  express: {
    canonicalName: 'Express.js',
    resources: [
      {
        name: 'Express.js Official Getting Started Guide',
        url: 'https://expressjs.com/en/starter/installing.html',
        type: 'Official Documentation',
        description: 'Guide to building minimal REST APIs, middleware pipelines, error handlers, and route controllers.'
      }
    ],
    whyMatters: 'Express is the foundational HTTP routing framework for Node.js, powering tens of thousands of microservices and APIs.'
  },
  java: {
    canonicalName: 'Java',
    resources: [
      {
        name: 'Official Java Tutorials by Oracle',
        url: 'https://dev.java/learn/',
        type: 'Official Documentation',
        description: 'Comprehensive tutorials on object-oriented programming, streams, concurrency, and JVM internals.'
      }
    ],
    whyMatters: 'Enterprise systems, financial transaction backends, and large-scale distributed systems rely on Java for robust, multithreaded performance.'
  },
  cpp: {
    canonicalName: 'C++',
    resources: [
      {
        name: 'CppReference Modern C++ Guide',
        url: 'https://en.cppreference.com/w/',
        type: 'Reference Documentation',
        description: 'Comprehensive reference for C++17/20 STL, smart pointers, templates, memory models, and RAII.'
      }
    ],
    whyMatters: 'C++ delivers zero-cost abstractions and hardware-level performance required in gaming engines, systems programming, and high-frequency trading.'
  },
  c: {
    canonicalName: 'C',
    resources: [
      {
        name: 'C Reference Documentation',
        url: 'https://en.cppreference.com/w/c',
        type: 'Reference Documentation',
        description: 'Standard C library functions, memory management with malloc/free, pointers, and POSIX system calls.'
      }
    ],
    whyMatters: 'Understanding C develops deep intuition for OS kernels, computer architecture, memory allocation, and performance bottlenecks.'
  },
  sql: {
    canonicalName: 'SQL',
    resources: [
      {
        name: 'SQLBolt Interactive Lessons',
        url: 'https://sqlbolt.com/',
        type: 'Interactive Tutorial',
        description: 'Interactive exercises for SELECT queries, JOINs, subqueries, aggregations, and constraint definitions.'
      },
      {
        name: 'PostgreSQL Tutorial Guide',
        url: 'https://www.postgresqltutorial.com/',
        type: 'Developer Guide',
        description: 'In-depth practical guide covering relational indexing, transactions (ACID), and query optimization.'
      }
    ],
    whyMatters: 'SQL is the universal language for querying relational databases, data warehousing, and business intelligence analytics.'
  },
  postgresql: {
    canonicalName: 'PostgreSQL',
    resources: [
      {
        name: 'PostgreSQL Official Tutorial',
        url: 'https://www.postgresql.org/docs/current/tutorial.html',
        type: 'Official Documentation',
        description: 'Official guide to advanced PostgreSQL features, JSONB columns, indexing strategies, and relational schemas.'
      }
    ],
    whyMatters: 'PostgreSQL is the gold-standard open-source ACID-compliant relational database for modern scalable applications.'
  },
  mongodb: {
    canonicalName: 'MongoDB',
    resources: [
      {
        name: 'MongoDB Official Developer Manual',
        url: 'https://www.mongodb.com/docs/manual/tutorial/',
        type: 'Official Documentation',
        description: 'Official guides for document models, BSON serialization, aggregation pipelines, and indexing.'
      }
    ],
    whyMatters: 'MongoDB offers flexible schema designs suitable for rapid iteration, hierarchical document data, and real-time event feeds.'
  },
  kubernetes: {
    canonicalName: 'Kubernetes',
    resources: [
      {
        name: 'Kubernetes Official Interactive Tutorials',
        url: 'https://kubernetes.io/docs/tutorials/',
        type: 'Official Documentation',
        description: 'Hands-on tutorials for Pods, Deployments, Services, ConfigMaps, Ingress, and horizontal pod autoscaling.'
      }
    ],
    whyMatters: 'Kubernetes orchestrates cloud-native container workloads, ensuring automated failover, load balancing, and rolling zero-downtime updates.'
  },
  aws: {
    canonicalName: 'AWS',
    resources: [
      {
        name: 'AWS Getting Started Resource Center',
        url: 'https://aws.amazon.com/getting-started/',
        type: 'Official Documentation',
        description: 'Guided projects covering EC2 instances, S3 object storage, Lambda serverless functions, and IAM security.'
      }
    ],
    whyMatters: 'AWS is the dominant cloud infrastructure platform; cloud proficiency is requested across top backend and DevOps engineering roles.'
  },
  azure: {
    canonicalName: 'Azure',
    resources: [
      {
        name: 'Microsoft Learn Azure Fundamentals',
        url: 'https://learn.microsoft.com/en-us/training/azure/',
        type: 'Official Documentation',
        description: 'Official modular learning path for Azure cloud services, App Service deployment, virtual networks, and Entra ID.'
      }
    ],
    whyMatters: 'Microsoft Azure powers enterprise cloud ecosystems, hybrid cloud infrastructures, and global enterprise software.'
  },
  rest_apis: {
    canonicalName: 'REST APIs',
    resources: [
      {
        name: 'RESTful API Design & Architecture Tutorial',
        url: 'https://restfulapi.net/',
        type: 'Architecture Guide',
        description: 'Best practices for HTTP methods (GET, POST, PUT, DELETE), status codes, stateless design, and versioning.'
      }
    ],
    whyMatters: 'RESTful APIs are the communication backbone connecting frontend web/mobile clients with backend microservices.'
  },
  cicd: {
    canonicalName: 'CI/CD',
    resources: [
      {
        name: 'GitHub Actions & CI/CD Workflows Documentation',
        url: 'https://docs.github.com/en/actions',
        type: 'Official Documentation',
        description: 'Official documentation for continuous integration pipelines, automated testing, linting, and continuous delivery.'
      }
    ],
    whyMatters: 'Automated CI/CD pipelines catch software bugs before merging and enable swift, confident daily production releases.'
  },
  penetration_testing: {
    canonicalName: 'Penetration Testing',
    resources: [
      {
        name: 'PortSwigger Web Security Academy',
        url: 'https://portswigger.net/web-security',
        type: 'Hands-on Labs',
        description: 'Free, interactive web security training covering SQL injection, XSS, CSRF, authentication flaws, and SSRF.'
      }
    ],
    whyMatters: 'Proactive penetration testing identifies security flaws and attack surfaces before malicious actors can exploit them.'
  },
  deep_learning: {
    canonicalName: 'Deep Learning',
    resources: [
      {
        name: 'DeepLearning.AI Courses & Tutorials',
        url: 'https://www.deeplearning.ai/',
        type: 'Curriculum & Guides',
        description: 'Foundational guidance for artificial neural networks, backpropagation, CNNs, and deep generative architectures.'
      }
    ],
    whyMatters: 'Deep learning powers computer vision, automated audio transcription, natural language understanding, and LLMs.'
  },
  nlp: {
    canonicalName: 'NLP',
    resources: [
      {
        name: 'Hugging Face NLP Course',
        url: 'https://huggingface.co/learn/nlp-course',
        type: 'Interactive Course',
        description: 'Open-source curriculum on transformers, tokenization, text embeddings, semantic search, and fine-tuning.'
      }
    ],
    whyMatters: 'NLP powers conversational chatbots, sentiment analysis, document summarization, and search intelligence.'
  },
  tensorflow: {
    canonicalName: 'TensorFlow',
    resources: [
      {
        name: 'TensorFlow Official Tutorials',
        url: 'https://www.tensorflow.org/tutorials',
        type: 'Official Documentation',
        description: 'Official tutorials for building and deploying ML models with Keras high-level APIs and TensorFlow Serving.'
      }
    ],
    whyMatters: 'TensorFlow is Google’s production-grade machine learning framework used for scalable model training and on-device deployment.'
  },
  pytorch: {
    canonicalName: 'PyTorch',
    resources: [
      {
        name: 'PyTorch Official Tutorials',
        url: 'https://pytorch.org/tutorials/',
        type: 'Official Documentation',
        description: 'Official tutorials covering dynamic computation graphs, autograd, torch.nn modules, and CUDA acceleration.'
      }
    ],
    whyMatters: 'PyTorch is the premier framework for AI research and modern transformer model development due to its intuitive Pythonic API.'
  },
  html: {
    canonicalName: 'HTML',
    resources: [
      {
        name: 'MDN HTML Learning Guide',
        url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML',
        type: 'Official Documentation',
        description: 'Standard semantic HTML elements, forms, accessibility (a11y), and document metadata.'
      }
    ],
    whyMatters: 'Semantic HTML provides accessible structure, SEO indexing, and screen-reader compatibility for modern web pages.'
  },
  css: {
    canonicalName: 'CSS',
    resources: [
      {
        name: 'MDN CSS Learning Guide',
        url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS',
        type: 'Official Documentation',
        description: 'Modern CSS layout models including Flexbox, CSS Grid, custom properties (variables), and responsive queries.'
      }
    ],
    whyMatters: 'CSS translates wireframes and UX designs into clean, responsive, and visually accessible layouts across all device form factors.'
  },
  spring_boot: {
    canonicalName: 'Spring Boot',
    resources: [
      {
        name: 'Spring Boot Official Quickstart Guides',
        url: 'https://spring.io/guides/gs/rest-service/',
        type: 'Official Documentation',
        description: 'Official guide to rapid microservice creation, dependency injection, and RESTful controller configuration.'
      }
    ],
    whyMatters: 'Spring Boot is the standard framework for Java enterprise backends, powering secure, scalable banking and enterprise services.'
  },
  redis: {
    canonicalName: 'Redis',
    resources: [
      {
        name: 'Redis Developer Hub Documentation',
        url: 'https://redis.io/docs/latest/develop/',
        type: 'Official Documentation',
        description: 'In-memory data structures, caching patterns, pub/sub queues, and TTL session invalidation.'
      }
    ],
    whyMatters: 'Redis provides sub-millisecond in-memory caching to drastically reduce database query load and accelerate API response times.'
  },
  nextjs: {
    canonicalName: 'Next.js',
    resources: [
      {
        name: 'Next.js Official Interactive Learning',
        url: 'https://nextjs.org/learn',
        type: 'Official Tutorial',
        description: 'App Router architecture, server-side rendering (SSR), static site generation (SSG), and Server Actions.'
      }
    ],
    whyMatters: 'Next.js delivers fast page loads, automatic code splitting, and search-engine optimized full-stack React capabilities.'
  },
  tailwind: {
    canonicalName: 'Tailwind CSS',
    resources: [
      {
        name: 'Tailwind CSS Official Documentation',
        url: 'https://tailwindcss.com/docs',
        type: 'Official Documentation',
        description: 'Utility-first CSS framework guide for rapid UI prototyping, responsive variants, and custom design tokens.'
      }
    ],
    whyMatters: 'Tailwind enables rapid styling without leaving your JSX markup, maintaining consistent typography and spacing standards.'
  },
  graphql: {
    canonicalName: 'GraphQL',
    resources: [
      {
        name: 'GraphQL Official Introduction & Guides',
        url: 'https://graphql.org/learn/',
        type: 'Official Documentation',
        description: 'Query language specification, schemas, mutations, resolvers, and client-driven data fetching.'
      }
    ],
    whyMatters: 'GraphQL prevents over-fetching and under-fetching by letting frontend clients request exactly the fields they need in a single roundtrip.'
  }
};

/**
 * Normalization dictionary linking aliases and variations to resource keys
 */
const SKILL_KEY_ALIASES = {
  python: 'python',
  py: 'python',
  python3: 'python',
  javascript: 'javascript',
  js: 'javascript',
  es6: 'javascript',
  ecmascript: 'javascript',
  react: 'react',
  'react.js': 'react',
  reactjs: 'react',
  git: 'git',
  'git scm': 'git',
  github: 'git',
  docker: 'docker',
  'docker container': 'docker',
  containerization: 'docker',
  linux: 'linux',
  unix: 'linux',
  ubuntu: 'linux',
  bash: 'linux',
  cybersecurity: 'cybersecurity',
  'cyber security': 'cybersecurity',
  infosec: 'cybersecurity',
  'information security': 'cybersecurity',
  'machine learning': 'machine_learning',
  ml: 'machine_learning',
  'scikit-learn': 'machine_learning',
  typescript: 'typescript',
  ts: 'typescript',
  nodejs: 'nodejs',
  'node.js': 'nodejs',
  node: 'nodejs',
  express: 'express',
  'express.js': 'express',
  expressjs: 'express',
  java: 'java',
  'core java': 'java',
  c: 'c',
  'c language': 'c',
  cpp: 'cpp',
  'c++': 'cpp',
  'c plus plus': 'cpp',
  sql: 'sql',
  rdbms: 'sql',
  postgresql: 'postgresql',
  postgres: 'postgresql',
  psql: 'postgresql',
  mongodb: 'mongodb',
  mongo: 'mongodb',
  kubernetes: 'kubernetes',
  k8s: 'kubernetes',
  aws: 'aws',
  'amazon web services': 'aws',
  azure: 'azure',
  'microsoft azure': 'azure',
  'rest apis': 'rest_apis',
  'rest api': 'rest_apis',
  rest: 'rest_apis',
  restful: 'rest_apis',
  'ci/cd': 'cicd',
  cicd: 'cicd',
  'continuous integration': 'cicd',
  'penetration testing': 'penetration_testing',
  pentesting: 'penetration_testing',
  'ethical hacking': 'penetration_testing',
  'deep learning': 'deep_learning',
  dl: 'deep_learning',
  nlp: 'nlp',
  'natural language processing': 'nlp',
  tensorflow: 'tensorflow',
  tf: 'tensorflow',
  pytorch: 'pytorch',
  torch: 'pytorch',
  html: 'html',
  html5: 'html',
  css: 'css',
  css3: 'css',
  'spring boot': 'spring_boot',
  spring: 'spring_boot',
  redis: 'redis',
  'next.js': 'nextjs',
  nextjs: 'nextjs',
  tailwind: 'tailwind',
  'tailwind css': 'tailwind',
  graphql: 'graphql'
};

/**
 * Finds the matching key in PREDEFINED_SKILL_RESOURCES for a given skill name
 */
export function findResourceKey(skillName = '') {
  if (!skillName || typeof skillName !== 'string') return null;
  const clean = skillName.trim().toLowerCase();

  // 1. Direct alias match
  if (SKILL_KEY_ALIASES[clean]) {
    return SKILL_KEY_ALIASES[clean];
  }

  // 2. Direct key in PREDEFINED_SKILL_RESOURCES
  if (PREDEFINED_SKILL_RESOURCES[clean]) {
    return clean;
  }

  // 3. Word boundary or sub-phrase match
  for (const [alias, key] of Object.entries(SKILL_KEY_ALIASES)) {
    if (alias === 'c') {
      if (/(?<![+#a-zA-Z0-9\-])c(?![+#a-zA-Z0-9])/i.test(clean)) return key;
    } else if (alias === 'c++') {
      if (/(?:^|[^a-zA-Z0-9_])(?:c\+\+|cpp|c\s*plus\s*plus)(?=[^a-zA-Z0-9_]|$)/i.test(clean)) return key;
    } else if (clean.includes(alias)) {
      return key;
    }
  }

  return null;
}

/**
 * Generates sensible generic learning recommendations when NO predefined resource URL exists.
 * Strictly avoids inventing fake URLs or broken links.
 */
export function getGenericLearningRecommendation(skillName = 'Technical Skill', category = 'Tools and Technologies') {
  return {
    summary: `Structured Learning Guide for ${skillName}`,
    steps: [
      {
        title: 'Consult Official Documentation & API Specs',
        guidance: `Visit the official project documentation or GitHub repository for ${skillName} to review syntax, installation, and architectural patterns.`
      },
      {
        title: 'Hands-on Sandbox Experimentation',
        guidance: `Build an isolated mini-prototype or integrate ${skillName} into a sample repository to test edge cases before applying it in production.`
      },
      {
        title: 'Review Open-Source Reference Implementations',
        guidance: `Inspect well-architected GitHub repositories utilizing ${skillName} to adopt community-accepted directory structures and design conventions.`
      }
    ],
    suggestedTopics: [
      `${skillName} official getting started guide`,
      `${skillName} architectural patterns and trade-offs`,
      `${skillName} production best practices and testing`
    ]
  };
}

/**
 * Contextual explanation of why this skill matters for the target job role.
 */
export function getWhySkillMatters(skillName = '', targetRole = '', category = '', requirementType = 'Mandatory') {
  const resourceKey = findResourceKey(skillName);
  const isMandatory = requirementType === 'Mandatory';

  // Base domain explanation if available
  let baseWhy = '';
  if (resourceKey && PREDEFINED_SKILL_RESOURCES[resourceKey]?.whyMatters) {
    baseWhy = PREDEFINED_SKILL_RESOURCES[resourceKey].whyMatters;
  } else if (category.includes('Database')) {
    baseWhy = 'Ensures data persistence, fast query execution, relational integrity, and schema scalability under load.';
  } else if (category.includes('Frontend')) {
    baseWhy = 'Directly impacts user interface responsiveness, accessibility standards, and clean component architecture.';
  } else if (category.includes('Backend') || category.includes('API')) {
    baseWhy = 'Critical for implementing reliable business logic, API contracts, secure authentication, and resilient data processing.';
  } else if (category.includes('Cloud') || category.includes('DevOps')) {
    baseWhy = 'Automates deployments, minimizes downtime, and guarantees reproducible build environments across engineering teams.';
  } else if (category.includes('Cybersecurity')) {
    baseWhy = 'Protects applications against OWASP vulnerabilities, unauthorized data leaks, and insecure network configurations.';
  } else if (category.includes('AI') || category.includes('Machine Learning')) {
    baseWhy = 'Enables data-driven prediction, intelligent automation, and analytical capabilities required for smart software products.';
  } else {
    baseWhy = 'Core technical competency expected by engineering managers to solve architectural challenges with high standards.';
  }

  // Tailor with target role context
  const roleContext = targetRole ? `For ${targetRole} positions: ` : '';
  const urgency = isMandatory
    ? 'This is a mandatory requirement for this role — hiring teams specifically evaluate this in technical interviews and resume screens.'
    : 'This is a valuable preferred capability that differentiates candidates during technical evaluations.';

  return `${roleContext}${baseWhy} ${urgency}`;
}

/**
 * Fully resolves learning resources and recommendation details for a missing skill.
 * If predefined resources exist: returns verified URLs with description.
 * If not predefined: returns sensible generic learning recommendations without inventing URLs.
 */
export function resolveSkillRoadmapDetails(skillOrName, targetRole = 'Software Engineer') {
  const name = typeof skillOrName === 'string' ? skillOrName.trim() : skillOrName?.name?.trim() || 'Technical Skill';
  const category = typeof skillOrName === 'object' ? skillOrName.category || 'Tools and Technologies' : 'Tools and Technologies';
  const requirementType = typeof skillOrName === 'object' ? skillOrName.requirementType || 'Mandatory' : 'Mandatory';

  const priority = requirementType === 'Mandatory' ? 'High' : requirementType === 'Preferred' ? 'Medium' : 'Medium';
  const resourceKey = findResourceKey(name);

  if (resourceKey && PREDEFINED_SKILL_RESOURCES[resourceKey]) {
    const preset = PREDEFINED_SKILL_RESOURCES[resourceKey];
    return {
      skillName: name,
      category,
      priority,
      requirementType,
      whyMatters: getWhySkillMatters(name, targetRole, category, requirementType),
      hasPredefinedResources: true,
      resources: preset.resources,
      genericRecommendation: null
    };
  }

  // Fallback: No predefined resource - provide sensible generic recommendation without inventing a URL
  return {
    skillName: name,
    category,
    priority,
    requirementType,
    whyMatters: getWhySkillMatters(name, targetRole, category, requirementType),
    hasPredefinedResources: false,
    resources: [],
    genericRecommendation: getGenericLearningRecommendation(name, category)
  };
}

