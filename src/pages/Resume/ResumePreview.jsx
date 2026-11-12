import React from 'react';

/**
 * Clean, ATS-Compliant Single-Column Resume Preview
 * 
 * Complies with strict ATS guidelines:
 * - Single-column document layout.
 * - Standard section headings.
 * - No tables or multiple columns in exported format.
 * - No skill bars, decorative icons, or graphics.
 * - Clean standard font hierarchy and selectable text.
 * - Consistent dates and bullet points.
 */
export const ResumePreview = ({
  profile,
  highlightedKeywords = [],
  showHighlights = true
}) => {
  const {
    personal = {},
    education = {},
    skills = [],
    projects = [],
    experience = [],
    certifications = []
  } = profile || {};

  // Filter only items included by the user
  const activeProjects = (projects || []).filter((p) => p.included !== false);
  const activeExperience = (experience || []).filter((e) => e.included !== false);
  const activeCertifications = (certifications || []).filter((c) => c.included !== false);

  // Group skills by category
  const skillsByCategory = {};
  skills.forEach((s) => {
    const cat = s.category || 'Other Technical Skills';
    if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
    skillsByCategory[cat].push(s.name);
  });

  const isHighlighted = (name) => {
    if (!showHighlights || !name) return false;
    return highlightedKeywords.some(
      (k) => k.toLowerCase() === name.toLowerCase()
    );
  };

  return (
    <div
      id="ats-resume-document"
      className="bg-white text-slate-900 font-sans p-8 sm:p-11 max-w-[820px] mx-auto border border-slate-200/90 shadow-sm print-container print:shadow-none print:border-none print:p-0 leading-normal select-text"
      style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
    >
      {/* ========================================================= */}
      {/* 1. CONTACT INFORMATION (Header)                           */}
      {/* ========================================================= */}
      <header className="border-b border-slate-300 pb-3 mb-4 text-left">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 uppercase">
          {personal.fullName || 'Candidate Name'}
        </h1>

        {(education.degree || education.branch || education.college || education.institution) && (
          <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1">
            {[
              education.degree,
              education.branch,
              education.college || education.institution,
              education.graduationYear ? `Class of ${education.graduationYear}` : ''
            ].filter(Boolean).join(' • ')}
          </p>
        )}

        <div className="mt-2 text-xs text-slate-700 flex flex-wrap gap-x-3 gap-y-1">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>• {personal.phone}</span>}
          {personal.location && <span>• {personal.location}</span>}
        </div>

        {(personal.linkedin || personal.github || personal.portfolio) && (
          <div className="mt-1 text-xs text-slate-700 flex flex-wrap gap-x-3 gap-y-1">
            {personal.linkedin && (
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:underline text-indigo-700 print:text-black"
              >
                LinkedIn: linkedin.com/in/{personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, '').replace(/\/$/, '')}
              </a>
            )}
            {personal.github && (
              <a
                href={personal.github}
                target="_blank"
                rel="noreferrer"
                className="hover:underline text-indigo-700 print:text-black"
              >
                GitHub: github.com/{personal.github.replace(/^https?:\/\/(www\.)?github\.com\//i, '').replace(/\/$/, '')}
              </a>
            )}
            {personal.portfolio && (
              <a
                href={personal.portfolio}
                target="_blank"
                rel="noreferrer"
                className="hover:underline text-indigo-700 print:text-black"
              >
                Portfolio: {personal.portfolio.replace(/^https?:\/\//i, '').replace(/\/$/, '')}
              </a>
            )}
          </div>
        )}
      </header>

      {/* ========================================================= */}
      {/* 2. PROFESSIONAL SUMMARY                                    */}
      {/* ========================================================= */}
      {personal.summary && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
            Professional Summary
          </h2>
          <p className="text-xs text-slate-800 leading-relaxed text-justify">
            {personal.summary}
          </p>
        </section>
      )}

      {/* ========================================================= */}
      {/* 3. EDUCATION                                              */}
      {/* ========================================================= */}
      {(education.degree || education.college || education.institution) && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
            Education
          </h2>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between items-baseline font-semibold text-slate-900">
              <span>{education.college || education.institution || 'University / College'}</span>
              <span className="font-medium text-slate-600">{education.graduationYear || '2025'}</span>
            </div>
            <div className="flex justify-between items-baseline text-slate-800">
              <span>
                {[education.degree, education.branch].filter(Boolean).join(' in ')}
              </span>
              {education.cgpa && (
                <span className="font-medium text-slate-600">
                  {String(education.cgpa).startsWith('CGPA') ? education.cgpa : `CGPA: ${education.cgpa}`}
                </span>
              )}
            </div>
            {education.relevantCoursework && (
              <p className="text-[11px] text-slate-600 pt-0.5">
                <strong className="text-slate-800 font-semibold">Coursework: </strong>
                {education.relevantCoursework}
              </p>
            )}
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* 4. TECHNICAL SKILLS                                       */}
      {/* ========================================================= */}
      {skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
            Technical Skills
          </h2>
          <div className="space-y-1 text-xs">
            {Object.entries(skillsByCategory).map(([cat, list]) => (
              <div key={cat} className="flex flex-col sm:flex-row sm:items-baseline">
                <span className="font-semibold text-slate-900 sm:w-48 sm:flex-shrink-0">
                  {cat}:
                </span>
                <span className="text-slate-800 leading-normal flex-1">
                  {list.map((skillName, idx) => {
                    const match = isHighlighted(skillName);
                    return (
                      <span key={skillName}>
                        <span
                          className={
                            match
                              ? 'bg-amber-100 text-amber-950 font-semibold px-1 py-0.5 rounded print:bg-transparent print:text-black print:font-normal'
                              : ''
                          }
                          title={match ? 'Matches target job requirement' : undefined}
                        >
                          {skillName}
                        </span>
                        {idx < list.length - 1 ? ', ' : ''}
                      </span>
                    );
                  })}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* 5. TECHNICAL PROJECTS                                     */}
      {/* ========================================================= */}
      {activeProjects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Technical Projects
          </h2>
          <div className="space-y-3">
            {activeProjects.map((proj, idx) => {
              const bullets = (proj.bullets && proj.bullets.length > 0)
                ? proj.bullets.filter(Boolean)
                : proj.contribution
                ? [proj.contribution]
                : proj.description
                ? [proj.description]
                : [];

              const projLink = proj.projectUrl || proj.liveUrl || proj.githubUrl;

              return (
                <div key={proj.id || idx} className="text-xs space-y-1">
                  <div className="flex justify-between items-baseline font-semibold text-slate-900">
                    <span className="flex items-center gap-1.5 flex-wrap">
                      <span>{proj.name || proj.title}</span>
                      {(proj.technologies || proj.techStack) && (
                        <span className="text-[11px] font-normal text-slate-600">
                          | {proj.technologies || proj.techStack}
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap ml-2">
                      {proj.date || '2024'}
                    </span>
                  </div>

                  {projLink && (
                    <div className="text-[11px] text-indigo-700 print:text-black">
                      <a href={projLink} target="_blank" rel="noreferrer" className="hover:underline">
                        Link: {projLink}
                      </a>
                    </div>
                  )}

                  {proj.description && !proj.bullets && (
                    <p className="text-slate-700 text-[11px] leading-tight italic">
                      {proj.description}
                    </p>
                  )}

                  {bullets.length > 0 && (
                    <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-800">
                      {bullets.map((b, bIdx) => (
                        <li key={bIdx} className="leading-snug">
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* 6. WORK EXPERIENCE                                        */}
      {/* ========================================================= */}
      {activeExperience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Work Experience
          </h2>
          <div className="space-y-3">
            {activeExperience.map((exp, idx) => {
              const expBullets = (exp.bullets && exp.bullets.length > 0)
                ? exp.bullets.filter(Boolean)
                : exp.contribution
                ? [exp.contribution]
                : exp.description
                ? [exp.description]
                : [];

              return (
                <div key={exp.id || idx} className="text-xs space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-slate-900">
                      {exp.role} <span className="font-normal text-slate-700">— {exp.company}</span>
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap ml-2">
                      {exp.period}
                    </span>
                  </div>

                  {(exp.location || exp.type) && (
                    <p className="text-[11px] text-slate-500 italic">
                      {[exp.type, exp.location].filter(Boolean).join(' | ')}
                    </p>
                  )}

                  {expBullets.length > 0 && (
                    <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-800">
                      {expBullets.map((b, bIdx) => (
                        <li key={bIdx} className="leading-snug">
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* 7. CERTIFICATIONS                                         */}
      {/* ========================================================= */}
      {activeCertifications.length > 0 && (
        <section className="mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
            Certifications
          </h2>
          <ul className="list-disc list-outside pl-4 space-y-0.5 text-xs text-slate-800">
            {activeCertifications.map((cert, idx) => (
              <li key={cert.id || idx} className="leading-snug">
                <span className="font-semibold">{cert.name}</span>
                {cert.issuer && <span> — {cert.issuer}</span>}
                {cert.year && <span className="text-slate-600"> ({cert.year})</span>}
                {cert.url && (
                  <span className="text-[11px] text-indigo-700 ml-1.5 print:text-black">
                    [{cert.url}]
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
