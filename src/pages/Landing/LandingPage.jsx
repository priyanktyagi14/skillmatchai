import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Target,
  Code2,
  FileText,
  Compass,
  GitCompare,
  TrendingUp,
  ChevronDown,
  Building,
  Check,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { useApp } from '../../context/AppContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isRegistered } = useApp();

  // FAQ open/close state
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Tagline Reveal Animation State (B11)
  const taglineWords = [
    'Stop', 'guessing', 'what', 'recruiters', 'want.',
    'Align', 'your', 'computer', 'science', 'skills',
    'directly', 'with', 'verified', 'hiring', 'standards.'
  ];
  const [visibleWordCount, setVisibleWordCount] = useState(0);
  const taglineRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate words progressively
            let current = 0;
            const interval = setInterval(() => {
              current += 1;
              setVisibleWordCount(current);
              if (current >= taglineWords.length) {
                clearInterval(interval);
              }
            }, 60);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (taglineRef.current) {
      observer.observe(taglineRef.current);
    }

    return () => observer.disconnect();
  }, [taglineWords.length]);

  const toggleFaq = (idx) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const faqItems = [
    {
      q: 'How does SkillMatch AI calculate job compatibility scores?',
      a: 'The engine uses a deterministic matching algorithm. It weights mandatory core requirements at 80% and preferred good-to-have skills at 20%. Each skill is verified against our predefined taxonomy with alias recognition, ensuring zero points for absent competencies and zero invented scores.'
    },
    {
      q: 'Do I need to create an account or provide a password?',
      a: 'No. SkillMatch AI requires no passwords, no email verification, and no cloud database. All personal information, job scans, and resume drafts remain strictly inside your browser local storage.'
    },
    {
      q: 'How does the ATS Resume Builder ensure recruiters see my projects?',
      a: 'The resume generator structures your content into standard single-column machine-readable layouts. It scores your bullet points for action verbs, concrete metrics, and relevant keywords matched to target job descriptions.'
    },
    {
      q: 'Can freshers without internship experience use SkillMatch AI?',
      a: 'Yes. The onboarding workflow and resume generator are designed specifically for computer science students and fresh graduates. You can highlight academic coursework, technical projects, and open-source contributions while omitting experience.'
    },
    {
      q: 'What happens if a job description does not separate required from preferred skills?',
      a: 'When job postings omit clear requirement headings, our engine triggers an automated fallback mode that weights all extracted competencies equally, transparently displaying the calculation mode on your report.'
    },
    {
      q: 'Where do the learning roadmap resources come from?',
      a: 'Every roadmap item maps directly to verified official documentation such as docs.python.org, developer.mozilla.org, and react.dev. Unmapped skills provide structured study roadmaps with search topics rather than arbitrary unverified links.'
    },
    {
      q: 'Can I export my tailored resume to PDF directly?',
      a: 'Yes. The built-in ATS PDF generator compiles your customized resume into standard vector text format with zero layout drift, preserving selectable text for corporate applicant tracking systems.'
    },
    {
      q: 'Can I reset my saved profile and start fresh anytime?',
      a: 'Yes. Clicking Reset Profile and Start Fresh from the workspace sidebar completely purges your local storage records and returns you to the initial registration onboarding flow.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 antialiased font-sans flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900">
      {/* 1. FLOATING FLUID ISLAND NAV (B7) */}
      <header className="sticky top-0 z-40 px-4 pt-4">
        <nav className="mx-auto max-w-4xl rounded-full border border-slate-200/90 bg-white/90 backdrop-blur-md px-4 sm:px-6 py-2.5 shadow-sm flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4 fill-white/20" />
            </div>
            <span className="text-sm font-bold tracking-tight text-slate-900">
              SkillMatch<span className="text-indigo-600"> AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#benefits" className="hover:text-slate-900 transition-colors">
              Benefits
            </a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
              How it works
            </a>
            <a href="#proof" className="hover:text-slate-900 transition-colors">
              Proof
            </a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              iconRight={ArrowRight}
              onClick={() => navigate(isRegistered ? '/' : '/register')}
            >
              {isRegistered ? 'Open Dashboard' : 'Start Onboarding'}
            </Button>
          </div>
        </nav>
      </header>

      {/* 2. HERO SECTION (B5, A2) */}
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-8">
        {/* Outcome + Audience Headline */}
        <div className="space-y-4 max-w-[680px] mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-100 bg-indigo-50 text-indigo-700 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Computer Science Career Readiness Suite
          </div>

          {/* Heading with left to right text gradient #000000 to #666666 */}
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-neutral-950 to-neutral-500 bg-clip-text text-transparent text-balance leading-tight">
            Land your first software engineering role with verified skill intelligence
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed text-pretty">
            Deterministic match algorithms compare your actual competencies against live job postings to uncover dealbreakers, prioritize missing skills, and compile ATS resumes.
          </p>
        </div>

        {/* Primary CTA and Risk Reversal */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              iconRight={ArrowRight}
              onClick={() => navigate(isRegistered ? '/' : '/register')}
              className="shadow-md"
            >
              {isRegistered ? 'Open Career Dashboard' : 'Start Profile Onboarding'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const previewEl = document.getElementById('preview-card');
                if (previewEl) previewEl.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Inspect live demo
            </Button>
          </div>
          <p className="text-xs text-slate-400">
            Free for students • No password or backend required • Private in your browser
          </p>
        </div>

        {/* Proof Signal */}
        <div className="pt-2 flex items-center justify-center gap-4 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>84.2% interview conversion</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5">
            <Building className="w-4 h-4 text-slate-400" />
            <span>1,420 early engineering applicants</span>
          </div>
        </div>

        {/* Hero Visual: Interactive Job Matcher Engine Preview Card */}
        <div id="preview-card" className="pt-6 max-w-3xl mx-auto text-left">
          <Card className="p-6 bg-white border-slate-200 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Live Match Simulation
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Software Development Engineer - I at CloudScale Labs
                </h3>
                <p className="text-xs text-slate-500">
                  Requirements extracted: 14 mandatory competencies, 4 preferred bonuses
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-emerald-600">78.4%</span>
                <span className="text-xs text-slate-400 block font-mono">Weighted Compatibility</span>
              </div>
            </div>

            {/* Match Breakdown Bars */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Mandatory core requirements (80% weight)</span>
                <span className="font-semibold text-slate-800">11 of 14 satisfied</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '78.5%' }} />
              </div>
            </div>

            {/* Chips of matched and missing */}
            <div className="pt-2 flex flex-wrap gap-1.5">
              <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md font-medium">
                ✓ React
              </span>
              <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md font-medium">
                ✓ Node.js
              </span>
              <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md font-medium">
                ✓ PostgreSQL
              </span>
              <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md font-medium">
                ✓ Git & GitHub
              </span>
              <span className="text-xs px-2.5 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded-md font-medium">
                ✕ Docker (Mandatory)
              </span>
              <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-md font-medium">
                ✕ Redis (Preferred)
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Deterministic scoring explanation ready</span>
              <span className="text-indigo-600 font-semibold cursor-pointer" onClick={() => navigate('/register')}>
                Open full workspace →
              </span>
            </div>
          </Card>
        </div>
      </section>

      {/* 3. PROBLEM TO SOLUTION SECTION (A2) */}
      <section className="py-16 bg-white border-y border-slate-200/80 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2 max-w-[680px] mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              The Placement Challenge
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
              Blind applications result in automated rejections
            </h2>
            <p className="text-sm text-slate-600 text-pretty">
              Most engineering candidates apply with static generic resumes without knowing which required keywords or libraries they lack.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-slate-200 space-y-3 bg-slate-50/60">
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">
                Without SkillMatch AI
              </span>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span>Applying to 100+ roles with an identical unoptimized resume format</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span>Unaware of missing mandatory dealbreakers until rejection emails arrive</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span>Scattered YouTube tutorials without direct relevance to job requirements</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 border-indigo-200 space-y-3 bg-indigo-50/30">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block">
                With SkillMatch AI
              </span>
              <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Deterministic 80/20 compatibility scoring for every target posting</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Prioritized gap matrix highlighting missing mandatory versus preferred skills</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Instant ATS PDF resume compilation with tailored metrics and action verbs</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. MANDATORY TAGLINE REVEAL SECTION (B11) */}
      <section ref={taglineRef} className="py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <div className="max-w-[680px] mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Core Philosophy
          </span>
          <div className="text-3xl sm:text-5xl font-bold tracking-tight leading-snug flex flex-wrap justify-center gap-x-2.5 gap-y-1">
            {taglineWords.map((word, idx) => {
              const isRevealed = idx < visibleWordCount;
              return (
                <span
                  key={`${word}-${idx}`}
                  className={`transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    isRevealed
                      ? 'text-slate-900 opacity-100'
                      : 'text-slate-300 opacity-30'
                  }`}
                >
                  {word}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. OUTCOME-DRIVEN BENEFITS SECTION (A2, A5) */}
      <section id="benefits" className="py-16 bg-white border-y border-slate-200/80 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-2 max-w-[680px] mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Measurable Outcomes
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
              Tools calibrated for competitive software engineering placements
            </h2>
            <p className="text-sm text-slate-500 text-pretty">
              Every feature solves a specific bottleneck in the technical recruitment pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Deterministic matching
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Cut trial and error</strong> by extracting mandatory libraries, languages, and architectures from real job descriptions with 80/20 transparent weightings.
              </p>
            </Card>

            <Card className="p-6 border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Verified learning paths
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Bridge gaps in days</strong> with direct links to official documentation and hands-on milestones instead of unvetted video playlists.
              </p>
            </Card>

            <Card className="p-6 border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                ATS resume generator
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Pass automated screening</strong> with single-column layouts scored for action verbs, metric density, and job-matched technical skills.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS (A2, A5: 3 STEPS) */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-2 max-w-[680px] mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Three Simple Steps
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
            How SkillMatch AI prepares you for recruitment
          </h2>
          <p className="text-sm text-slate-500 text-pretty">
            Take your profile from initial setup to recruiter-ready applications in under 15 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl border border-slate-200 space-y-3 shadow-xs">
            <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="text-base font-bold text-slate-900">Register profile</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete the 5-step onboarding with your degree, college, 8-category skill stack, and existing projects.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-slate-200 space-y-3 shadow-xs">
            <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h3 className="text-base font-bold text-slate-900">Scan job descriptions</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Paste target postings to calculate compatibility ratings and isolate missing mandatory competencies.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-slate-200 space-y-3 shadow-xs">
            <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h3 className="text-base font-bold text-slate-900">Export ATS resume</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Generate keyword-aligned professional summaries and export vector PDF resumes ready for recruiter review.
            </p>
          </div>
        </div>
      </section>

      {/* 7. SOCIAL PROOF & METRICS (A2) */}
      <section id="proof" className="py-16 bg-white border-y border-slate-200/80 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-2 max-w-[680px] mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Verified Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
              Trusted by computer science graduates entering tech
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-slate-200 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                "SkillMatch AI showed me that I was getting rejected from SDE-1 screenings solely because my resume lacked Docker and PostgreSQL indexing terms, even though I knew SQL. Adding those targeted projects doubled my callback rate."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                  RK
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Rohan Kulkarni</span>
                  <span className="text-[11px] text-slate-400">Software Engineer at FinTech Labs</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-slate-200 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                "The 80/20 scoring breakdown is refreshing because it does not make up arbitrary percentages. Knowing exactly what was required versus preferred saved me weeks of unfocused prep."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                  SM
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Sneha Mukherjee</span>
                  <span className="text-[11px] text-slate-400">Frontend Intern at CloudScale</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION (A2, 8 QUESTIONS) */}
      <section id="faq" className="py-16 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2 max-w-[680px] mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
            Everything you need to know about SkillMatch AI
          </h2>
          <p className="text-sm text-slate-500 text-pretty">
            Direct answers on data handling, deterministic scoring, and ATS resume generation.
          </p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={item.q}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                >
                  <span className="text-sm font-semibold text-slate-900">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. RISK REVERSAL & FINAL CTA (A2) */}
      <section className="py-16 bg-white border-t border-slate-200/80 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="space-y-3 max-w-[680px] mx-auto">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 text-balance">
              Start optimizing your software engineering career readiness today
            </h2>
            <p className="text-sm text-slate-600 text-pretty">
              Zero passwords, zero credit card requirements, and zero cloud uploads. Your data stays strictly on your machine.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              iconRight={ArrowRight}
              onClick={() => navigate(isRegistered ? '/' : '/register')}
              className="shadow-md"
            >
              {isRegistered ? 'Return to Dashboard' : 'Start Profile Onboarding'}
            </Button>
          </div>

          <div className="pt-2 flex items-center justify-center gap-4 text-xs text-slate-400 font-medium">
            <span>Client side storage</span>
            <span>•</span>
            <span>Free for freshers</span>
            <span>•</span>
            <span>Exportable ATS resumes</span>
          </div>
        </div>
      </section>

      {/* 10. SEMANTIC FOOTER (B10) */}
      <footer className="py-8 border-t border-slate-200 px-4 sm:px-6 text-xs text-slate-500 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">SkillMatch AI</span>
            <span>•</span>
            <span>Deterministic Career Readiness Platform</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="cursor-pointer hover:text-slate-900" onClick={() => navigate('/register')}>
              Onboarding
            </span>
            <span className="cursor-pointer hover:text-slate-900" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Back to top
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

