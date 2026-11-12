export const PRESET_ROADMAPS = [
  {
    id: 'docker-devops',
    title: 'Docker & Containerization for Freshers',
    category: 'DevOps, Cloud & Infrastructure',
    duration: '2 Weeks (15 Hours)',
    difficulty: 'Beginner to Intermediate',
    whyEssential: 'Most SDE-1 and cloud job descriptions test your understanding of containers, images, port mapping, and reproducible dev environments.',
    targetSkill: 'Docker & Containerization',
    modules: [
      {
        id: 'docker-mod-1',
        phase: 'Week 1',
        title: 'Container Fundamentals & Docker CLI',
        summary: 'Understand OS-level virtualization vs VMs, Docker architecture, namespaces, and core CLI commands.',
        topics: [
          'Difference between Containers vs Virtual Machines',
          'Docker Engine, Daemon, and Docker Hub',
          'Running, stopping, inspecting, and execing into containers',
          'Port publishing (-p) and environment variables (-e)'
        ],
        resources: [
          { name: 'Docker 101 Official Tutorial', url: 'https://docs.docker.com/get-started/', type: 'Documentation' },
          { name: 'freeCodeCamp Docker Handbook', url: 'https://www.freecodecamp.org/news/the-docker-handbook/', type: 'Free Guide' }
        ],
        practiceProject: 'Dockerize an existing Node.js or Python REST API with a multi-stage Dockerfile and minimal alpine image.',
        checklist: [
          { id: 'c-1', text: 'Install Docker Desktop / Engine locally and run hello-world', completed: true },
          { id: 'c-2', text: 'Write your first Dockerfile with proper WORKDIR, COPY, and CMD instructions', completed: false },
          { id: 'c-3', text: 'Run container with host port binding and verify HTTP endpoints', completed: false }
        ]
      },
      {
        id: 'docker-mod-2',
        phase: 'Week 2',
        title: 'Multi-Container Apps with Docker Compose & Volumes',
        summary: 'Orchestrate multi-tier web applications (Frontend + API + PostgreSQL Database) locally with persistent storage.',
        topics: [
          'Docker Compose file specification (version, services, networks)',
          'Named volumes for database persistence across container restarts',
          'Internal bridge networks and service discovery by name',
          'Environment file (.env) management and secret segregation'
        ],
        resources: [
          { name: 'Docker Compose Official Specs', url: 'https://docs.docker.com/compose/', type: 'Documentation' },
          { name: 'Roadmap.sh Docker Guide', url: 'https://roadmap.sh/docker', type: 'Curriculum' }
        ],
        practiceProject: 'Spin up a 3-tier stack: React client + Node/Express backend + PostgreSQL container running with one "docker-compose up".',
        checklist: [
          { id: 'c-4', text: 'Create a docker-compose.yml wiring an API with PostgreSQL', completed: false },
          { id: 'c-5', text: 'Mount a persistent volume to preserve DB state across restarts', completed: false },
          { id: 'c-6', text: 'Push your optimized image to Docker Hub and link it in your GitHub README', completed: false }
        ]
      }
    ]
  },
  {
    id: 'spring-boot-backend',
    title: 'Spring Boot & Microservices for SDE-1',
    category: 'Backend & APIs',
    duration: '3 Weeks (25 Hours)',
    difficulty: 'Intermediate',
    whyEssential: 'Enterprise banks, FinTechs, and top tech companies extensively build mission-critical backends in Java and Spring Boot.',
    targetSkill: 'Spring Boot',
    modules: [
      {
        id: 'spring-mod-1',
        phase: 'Week 1',
        title: 'Spring Core, Dependency Injection & RESTful Controllers',
        summary: 'Master Inversion of Control (IoC), Beans, and building standard HTTP endpoints with JSON serialization.',
        topics: [
          'Spring IoC container, @Component, @Autowired, @Service, @Repository',
          '@RestController, @GetMapping, @PostMapping, @PathVariable, @RequestBody',
          'Global Exception Handling using @ControllerAdvice and ResponseEntity',
          'Input validation using Jakarta Bean Validation (@Valid, @NotNull)'
        ],
        resources: [
          { name: 'Spring Guides: Building a RESTful Web Service', url: 'https://spring.io/guides/gs/rest-service/', type: 'Official Guide' },
          { name: 'Baeldung Spring Boot Tutorials', url: 'https://www.baeldung.com/spring-boot', type: 'Reference' }
        ],
        practiceProject: 'Build a Student Course Registration REST API with input validation and clean error responses.',
        checklist: [
          { id: 'sb-1', text: 'Bootstrap a Maven project on start.spring.io with Web and Lombok', completed: false },
          { id: 'sb-2', text: 'Create full CRUD REST endpoints for an entity', completed: false },
          { id: 'sb-3', text: 'Implement a centralized @RestControllerAdvice exception handler', completed: false }
        ]
      },
      {
        id: 'spring-mod-2',
        phase: 'Week 2',
        title: 'Spring Data JPA, Hibernate & PostgreSQL Integration',
        summary: 'Map relational tables to Java objects with Hibernate, write JPQL queries, and implement pagination.',
        topics: [
          '@Entity, @Id, @GeneratedValue, @Table, @Column mappings',
          'Relationships: @OneToMany, @ManyToOne, and FetchType strategies',
          'JpaRepository methods and custom derived query methods',
          'Database transactions with @Transactional and ACID guarantees'
        ],
        resources: [
          { name: 'Spring Data JPA Documentation', url: 'https://spring.io/projects/spring-data-jpa', type: 'Official Docs' },
          { name: 'Vlad Mihalcea Hibernate Tips', url: 'https://vladmihalcea.com/', type: 'Deep Dive' }
        ],
        practiceProject: 'Connect Spring Boot to a local PostgreSQL database, creating a multi-entity E-Commerce Product Catalog with pagination.',
        checklist: [
          { id: 'sb-4', text: 'Configure application.properties for PostgreSQL connection pool', completed: false },
          { id: 'sb-5', text: 'Implement Pageable queries and filtering in JpaRepository', completed: false },
          { id: 'sb-6', text: 'Write integration tests with @SpringBootTest and H2 in-memory DB', completed: false }
        ]
      },
      {
        id: 'spring-mod-3',
        phase: 'Week 3',
        title: 'Spring Security 6, JWT Authentication & Unit Testing',
        summary: 'Secure your REST endpoints with stateless JWT authentication filters and test with MockMvc.',
        topics: [
          'Spring Security Filter Chain architecture',
          'Generating and validating JWT Bearer tokens in SecurityContext',
          'Role-based access control (@PreAuthorize)',
          'Mocking service layers with Mockito and testing controllers with MockMvc'
        ],
        resources: [
          { name: 'Spring Security Reference Guide', url: 'https://docs.spring.io/spring-security/reference/', type: 'Documentation' },
          { name: 'freeCodeCamp Spring Security + JWT Guide', url: 'https://www.freecodecamp.org/news/how-to-secure-your-spring-boot-application-with-jwt/', type: 'Tutorial' }
        ],
        practiceProject: 'Secure the API with Signup, Login, Password hashing with BCrypt, and JWT role verification.',
        checklist: [
          { id: 'sb-7', text: 'Build JWT utility class for token generation and claims extraction', completed: false },
          { id: 'sb-8', text: 'Protect admin routes and verify with Postman', completed: false }
        ]
      }
    ]
  },
  {
    id: 'system-design-lld',
    title: 'Low-Level Design (LLD) & Design Patterns for Freshers',
    category: 'Core CS Fundamentals',
    duration: '2 Weeks (18 Hours)',
    difficulty: 'Intermediate',
    whyEssential: 'Product companies (Swiggy, Flipkart, Uber, Amazon) heavily focus on Machine Coding and LLD rounds for 2024-2026 CS graduates.',
    targetSkill: 'System Design Basics / LLD',
    modules: [
      {
        id: 'lld-mod-1',
        phase: 'Week 1',
        title: 'SOLID Principles & Creational / Structural Patterns',
        summary: 'Learn how to write extensible object-oriented code that does not break when requirements change.',
        topics: [
          'SOLID: Single Responsibility, Open-Closed, Liskov, Interface Segregation, Dependency Inversion',
          'Factory Pattern & Abstract Factory',
          'Singleton Pattern (Thread-safe Double-Checked Locking in Java/C++)',
          'Strategy Pattern and Observer Pattern (Pub-Sub fundamentals)'
        ],
        resources: [
          { name: 'Refactoring Guru: Design Patterns', url: 'https://refactoring.guru/design-patterns', type: 'Interactive Guide' },
          { name: 'NeetCode System Design / OOP', url: 'https://neetcode.io/', type: 'Video Reference' }
        ],
        practiceProject: 'Implement a Parking Lot System or Splitwise Expense Sharing System with Strategy and Factory patterns.',
        checklist: [
          { id: 'lld-1', text: 'Diagram class relationships (UML) before writing code', completed: false },
          { id: 'lld-2', text: 'Implement Strategy Pattern to toggle pricing or payment strategies', completed: false },
          { id: 'lld-3', text: 'Verify code does not violate Open-Closed Principle when adding new features', completed: false }
        ]
      },
      {
        id: 'lld-mod-2',
        phase: 'Week 2',
        title: 'Concurrency, Thread Safety & Machine Coding Interviews',
        summary: 'Tackle timed 90-minute live machine coding problems with clean domain models and unit tests.',
        topics: [
          'In-memory data stores, thread safety, locks and concurrent hash maps',
          'Rate Limiter algorithm implementations (Token Bucket, Leaky Bucket)',
          'Tic-Tac-Toe / Snake & Ladder game engine design',
          'Code organization: Models, Services, Repositories, and Drivers'
        ],
        resources: [
          { name: 'Awesome Low-Level Design GitHub Collection', url: 'https://github.com/ashishps1/awesome-low-level-design', type: 'Repository' },
          { name: 'InterviewReady LLD Fundamentals', url: 'https://interviewready.io/', type: 'Guide' }
        ],
        practiceProject: 'Code an In-Memory Rate Limiter with Token Bucket algorithm supporting configurable requests per client ID.',
        checklist: [
          { id: 'lld-4', text: 'Implement Token Bucket with timestamp tracking and capacity ceiling', completed: false },
          { id: 'lld-5', text: 'Write multithreaded test cases verifying thread safety', completed: false }
        ]
      }
    ]
  },
  {
    id: 'aws-cloud-basics',
    title: 'AWS Cloud Fundamentals & CI/CD for Junior Engineers',
    category: 'DevOps, Cloud & Infrastructure',
    duration: '2 Weeks (12 Hours)',
    difficulty: 'Beginner',
    whyEssential: 'Knowing how to deploy, host databases, and set up continuous integration puts your resume into the top 5% of fresher applicants.',
    targetSkill: 'AWS Cloud Basics',
    modules: [
      {
        id: 'aws-mod-1',
        phase: 'Week 1',
        title: 'Core AWS Services: EC2, S3, IAM & RDS',
        summary: 'Deploy real backend applications to cloud infrastructure safely with security groups and IAM roles.',
        topics: [
          'IAM: Users, Roles, Policies, and Least Privilege access',
          'S3: Buckets, static website hosting, presigned URLs for direct uploads',
          'EC2: Launching Linux instances, SSH keys, security group ingress rules',
          'RDS: Managed PostgreSQL/MySQL instances in a private subnet'
        ],
        resources: [
          { name: 'AWS Cloud Practitioner Essentials (Free on AWS Skill Builder)', url: 'https://explore.skillbuilder.aws/', type: 'Free Course' },
          { name: 'freeCodeCamp AWS Certified Cloud Practitioner Full Course', url: 'https://www.freecodecamp.org/', type: 'Video Course' }
        ],
        practiceProject: 'Deploy a Node.js / Python API to an EC2 Linux instance with PM2 process manager and Nginx reverse proxy.',
        checklist: [
          { id: 'aws-1', text: 'Set up an AWS Free Tier account with billing alert threshold', completed: false },
          { id: 'aws-2', text: 'SSH into an EC2 Ubuntu instance and configure Nginx reverse proxy', completed: false },
          { id: 'aws-3', text: 'Upload user profile images directly to an AWS S3 bucket via presigned URLs', completed: false }
        ]
      },
      {
        id: 'aws-mod-2',
        phase: 'Week 2',
        title: 'GitHub Actions CI/CD Pipeline Automation',
        summary: 'Automate linting, unit testing, Docker image builds, and deployments on every push.',
        topics: [
          'Workflow files (.github/workflows/ci.yml)',
          'Triggers (push, pull_request) and matrix test builds',
          'Secrets management in GitHub repository settings',
          'Automated deployment to Vercel / Render / AWS EC2'
        ],
        resources: [
          { name: 'GitHub Actions Official Quickstart', url: 'https://docs.github.com/en/actions', type: 'Documentation' }
        ],
        practiceProject: 'Configure a full CI pipeline that runs test suites on every pull request and blocks merges on failure.',
        checklist: [
          { id: 'aws-4', text: 'Write a GitHub Actions workflow to run npm test on PR', completed: false },
          { id: 'aws-5', text: 'Add a badge to your GitHub repository README showing passing build status', completed: false }
        ]
      }
    ]
  },
  {
    id: 'redis-caching',
    title: 'Redis & High-Performance Caching',
    category: 'Databases & Storage',
    duration: '1.5 Weeks (10 Hours)',
    difficulty: 'Beginner to Intermediate',
    whyEssential: 'Caching is the #1 question asked in system design and backend fresher interviews to assess optimization skills.',
    targetSkill: 'Redis',
    modules: [
      {
        id: 'redis-mod-1',
        phase: 'Week 1',
        title: 'Redis Data Types, In-Memory Storage & Cache-Aside Pattern',
        summary: 'Learn Strings, Hashes, Lists, Sets, Sorted Sets, and how to implement Cache-Aside pattern with TTL.',
        topics: [
          'Redis CLI commands (GET, SET, EXPIRE, HSET, HGETALL, ZADD)',
          'Cache-Aside (Lazy Loading) architecture and Cache Invalidation strategies',
          'Time-to-Live (TTL) and eviction policies (LRU, LFU)',
          'Preventing Cache Stampede, Cache Penetration, and Cache Avalanche'
        ],
        resources: [
          { name: 'Redis University (Official Free Courses)', url: 'https://university.redis.com/', type: 'Free Certification' },
          { name: 'Redis Crash Course by freeCodeCamp', url: 'https://www.freecodecamp.org/', type: 'Guide' }
        ],
        practiceProject: 'Build an API endpoint caching slow database query results in Redis with a 5-minute TTL and benchmark latency before and after.',
        checklist: [
          { id: 'red-1', text: 'Run Redis locally via Docker and connect with Redis-CLI or Redis Insight', completed: false },
          { id: 'red-2', text: 'Implement Cache-Aside middleware in Express or Spring Boot', completed: false },
          { id: 'red-3', text: 'Demonstrate latency dropping from 120ms to 4ms in your project documentation', completed: false }
        ]
      }
    ]
  }
];

