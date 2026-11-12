# SkillMatch AI — Tech Career Intelligence Platform

SkillMatch AI is a modern, frontend-only career assistance platform designed specifically for **B.Tech students, Computer Science / IT undergraduates, freshers, and entry-level technology job seekers (0–2 years experience)**.

The platform helps engineering graduates compare their actual technical skills against real-world job descriptions, pinpoint dealbreaker skill gaps, follow structured learning roadmaps with 100% free verified resources, and generate ATS-compliant resumes that pass corporate applicant tracking systems (Workday, Greenhouse, Lever).

---

## 🚀 Key Features

### 1. Unified Career Readiness Dashboard
- **Average Match Rate & Market Readiness Index**: Aggregates alignment across all scanned job descriptions.
- **Core CS Fundamentals Tracker**: Assesses coverage across Data Structures & Algorithms, OOP, DBMS, Operating Systems, and Computer Networks.
- **Top Dealbreaker Gaps**: Visual alert matrix of high-impact skills required across target roles.
- **Quick-Access Application Pipeline**: Status snapshots of active job targets.

### 2. Comprehensive B.Tech Engineering Profile
- **Categorized Tech Stack Manager**: Interactive skill tags across Languages, Frontend, Backend & APIs, Databases & Storage, Core CS, DevOps & Cloud, Tools & Testing, and AI/Data.
- **Real-World Project Showcase**: Add repositories, live demo links, and metric-driven bullet points.
- **Academics & Target Role Preferences**: Track Degree, Branch, Graduation Year, CGPA, and Coursework.
- **Persistence & Seeding**: Completely persists in browser `localStorage`. Includes instant reset to standard B.Tech CS sample profile.

### 3. Algorithmic Job Matcher
- **Curated Fresher Role Presets**: One-click presets for SDE-1 (Product Tech), Frontend Developer (React/TS), Backend Developer (Java/Spring Boot), Full Stack Developer (MERN/PERN), and Junior Data Analyst.
- **Freeform Job Description Scanner**: Paste raw text from LinkedIn, Naukri, Wellfound, or campus placement portals.
- **Deterministic Skill Extraction**: Alias-aware regex engine matching 250+ tech terms with strict word boundary tokenization.
- **Scoring & Density**: Computes Match Percentage %, ATS Keyword Density, and Dealbreaker vs Good-to-Have gap categorization.

### 4. Prioritized Skill Gap Analysis
- **Dealbreaker vs Preferred Split**: Distinguishes between mandatory requirements (Core CS, primary languages) and secondary toolsets.
- **Time-to-Bridge Estimates**: Realistic timeframes for freshers (1–2 weeks, 2–3 weeks).
- **Hiring Demand Weight**: Shows frequency of skills across target postings.
- **Direct Upskilling Links**: Jump straight into relevant curricula or mark skills as learned with one click.

### 5. Interactive Learning Roadmaps
- **Curated CS Upskilling Tracks**:
  - Docker & Containerization for Freshers
  - Spring Boot & Microservices for SDE-1
  - Low-Level Design (LLD) & Design Patterns
  - AWS Cloud Fundamentals & GitHub Actions CI/CD
  - Redis & High-Performance Caching
- **Free Verified Resources**: Direct links to official documentation, freeCodeCamp, MDN, roadmap.sh, and NeetCode.
- **Resume-Ready Practice Projects**: Targeted mini-projects designed to stand out on engineering CVs.
- **Interactive Checklists**: Check off tasks as you learn; progress is saved in `localStorage`.

### 6. ATS-Compliant Resume Builder & Live Score Analyzer
- **Strict Single-Column ATS Layout**: Designed without dual-column graphics, tables, or non-standard elements that break ATS parsers.
- **Live 100-Point ATS Auditor**:
  - Contact information completeness
  - Professional summary quality
  - Technical skills density
  - Action Verbs Strength Detector (detects "Architected", "Engineered", "Implemented", "Optimized")
  - Quantifiable Metrics Detector (identifies %, ms, users, reduction figures)
- **Target Role Keyword Alignment**: Highlights matching keywords and alerts missing keywords in real-time.
- **Print / PDF Ready**: Styled with clean `@media print` rules for instant `window.print()` PDF generation.

### 7. Saved Jobs Pipeline Tracker
- **Stage Progression**: Track roles through `Bookmarked` → `Ready to Apply` → `Applied` → `Interview Scheduled` → `Archived`.
- **Custom Preparation Notes**: Dedicated markdown-style notes on cards for referral contacts, interview rounds, and prep focus.
- **Direct Cross-Navigation**: Jump from any saved card directly into re-matching or resume tailoring.

---

## 🛠️ Architecture & Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v3 with Linear/Notion inspired minimalist SaaS design tokens
- **Routing**: React Router v7 (`BrowserRouter`, nested layout, active indicators)
- **Icons**: Lucide React
- **Storage**: Client-side `localStorage` with fallback handling and state seeders
- **Deployment**: Vercel ready (with SPA URL rewrites via `vercel.json`)
- **Strict Constraints Met**: No backend, no database, no authentication, no paid external APIs, zero server dependencies.

---

## 💻 Getting Started Locally

```bash
# Clone or navigate to the repository
cd skillmatchai

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📄 License
MIT License. Built for engineering students and aspiring software developers.
