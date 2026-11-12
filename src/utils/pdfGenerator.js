import { jsPDF } from 'jspdf';

/**
 * ATS-Friendly Resume PDF Generator
 * 
 * Complies with strict Applicant Tracking System (ATS) parsing rules:
 * - Single-column document layout (no multi-column sections or tables).
 * - Universal standard ATS fonts (Helvetica / Helvetica-Bold).
 * - Real selectable and searchable vector text streams (no raster screenshots).
 * - Standard, unambiguous section headings.
 * - Consistent date, bullet, and hierarchy formatting.
 * - Clean page breaks that never orphan section titles.
 */

export const generateResumePDF = (resumeData, options = {}) => {
  const {
    save = true,
    fileName = null,
    returnDoc = false
  } = options;

  const {
    personal = {},
    education = {},
    skills = [],
    projects = [],
    experience = [],
    certifications = []
  } = resumeData || {};

  // Standard Letter Format (612 x 792 pt = 8.5 x 11 inches)
  const doc = new jsPDF({
    unit: 'pt',
    format: 'letter',
    orientation: 'portrait',
    compress: false
  });

  const pageWidth = 612;
  const pageHeight = 792;
  const marginLeft = 38;
  const marginRight = 38;
  const contentWidth = pageWidth - marginLeft - marginRight; // 536 pt
  const marginTop = 36;
  const marginBottom = 36;
  const maxY = pageHeight - marginBottom;

  let currentY = marginTop;

  // Helper to ensure sufficient space or trigger a clean page break
  const ensureSpace = (neededHeight) => {
    if (currentY + neededHeight > maxY) {
      doc.addPage();
      currentY = marginTop;
      return true;
    }
    return false;
  };

  // Helper to render standard ATS section headers
  const renderSectionHeader = (title) => {
    ensureSpace(32);
    currentY += 4;
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(20, 24, 33);
    doc.text(title.toUpperCase(), marginLeft, currentY);

    // Clean horizontal rule across the single column
    doc.setDrawColor(200, 205, 215);
    doc.setLineWidth(0.75);
    doc.line(marginLeft, currentY + 3.5, marginLeft + contentWidth, currentY + 3.5);

    currentY += 14;
  };

  // ==========================================
  // 1. CONTACT INFORMATION (Header)
  // ==========================================
  const candidateName = (personal.fullName || 'Candidate Name').trim();
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(19);
  doc.setTextColor(15, 23, 42);
  doc.text(candidateName.toUpperCase(), marginLeft, currentY);
  currentY += 15;

  // Degree & Class Subtitle
  const degreeSubtitle = [
    education.degree,
    education.branch,
    education.college || education.institution ? `${education.college || education.institution}` : '',
    education.graduationYear ? `Class of ${education.graduationYear}` : ''
  ].filter(Boolean).join(' • ');

  if (degreeSubtitle) {
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    doc.text(degreeSubtitle, marginLeft, currentY);
    currentY += 13;
  }

  // Primary Contact Row (Email, Phone, Location)
  const contactParts = [
    personal.email,
    personal.phone,
    personal.location
  ].filter(Boolean);

  if (contactParts.length > 0) {
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(contactParts.join('  |  '), marginLeft, currentY);
    currentY += 11.5;
  }

  // Links Row (LinkedIn, GitHub, Portfolio)
  const linkParts = [];
  if (personal.linkedin) {
    const handle = personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, '').replace(/\/$/, '');
    linkParts.push(`LinkedIn: linkedin.com/in/${handle}`);
  }
  if (personal.github) {
    const handle = personal.github.replace(/^https?:\/\/(www\.)?github\.com\//i, '').replace(/\/$/, '');
    linkParts.push(`GitHub: github.com/${handle}`);
  }
  if (personal.portfolio) {
    const cleanUrl = personal.portfolio.replace(/^https?:\/\//i, '').replace(/\/$/, '');
    linkParts.push(`Portfolio: ${cleanUrl}`);
  }

  if (linkParts.length > 0) {
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(linkParts.join('  |  '), marginLeft, currentY);
    currentY += 11;
  }

  currentY += 3;

  // ==========================================
  // 2. PROFESSIONAL SUMMARY
  // ==========================================
  const summaryText = personal.summary ? personal.summary.trim() : '';
  if (summaryText) {
    renderSectionHeader('Professional Summary');
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);

    const summaryLines = doc.splitTextToSize(summaryText, contentWidth);
    summaryLines.forEach((line) => {
      ensureSpace(12);
      doc.text(line, marginLeft, currentY);
      currentY += 12;
    });
    currentY += 4;
  }

  // ==========================================
  // 3. EDUCATION
  // ==========================================
  const hasEducation = education.degree || education.college || education.institution;
  if (hasEducation) {
    renderSectionHeader('Education');

    // Institution & Graduation Date
    const institutionName = education.college || education.institution || 'University / College';
    const gradYear = education.graduationYear ? String(education.graduationYear) : '';

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(institutionName, marginLeft, currentY);

    if (gradYear) {
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      doc.text(gradYear, marginLeft + contentWidth, currentY, { align: 'right' });
    }
    currentY += 12;

    // Degree, Branch & CGPA
    const degreeLine = [education.degree, education.branch].filter(Boolean).join(' in ');
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text(degreeLine, marginLeft, currentY);

    if (education.cgpa) {
      const cgpaStr = String(education.cgpa).startsWith('CGPA') ? education.cgpa : `CGPA: ${education.cgpa}`;
      doc.setFontSize(9);
      doc.text(cgpaStr, marginLeft + contentWidth, currentY, { align: 'right' });
    }
    currentY += 11.5;

    // Relevant Coursework
    if (education.relevantCoursework) {
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      const prefix = 'Coursework: ';
      doc.text(prefix, marginLeft, currentY);

      const prefixWidth = doc.getTextWidth(prefix);
      doc.setFont('Helvetica', 'normal');
      const courseworkLines = doc.splitTextToSize(education.relevantCoursework, contentWidth - prefixWidth);

      courseworkLines.forEach((cLine, idx) => {
        if (idx === 0) {
          doc.text(cLine, marginLeft + prefixWidth, currentY);
        } else {
          ensureSpace(10.5);
          doc.text(cLine, marginLeft + 12, currentY);
        }
        currentY += 10.5;
      });
    }

    currentY += 4;
  }

  // ==========================================
  // 4. TECHNICAL SKILLS
  // ==========================================
  if (skills && skills.length > 0) {
    renderSectionHeader('Technical Skills');

    // Group skills by category
    const skillsByCategory = {};
    skills.forEach((s) => {
      const cat = s.category || 'Other Technical Skills';
      if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
      skillsByCategory[cat].push(s.name);
    });

    Object.entries(skillsByCategory).forEach(([category, skillList]) => {
      if (!skillList || skillList.length === 0) return;
      ensureSpace(14);

      const categoryLabel = `${category}: `;
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      const labelWidth = doc.getTextWidth(categoryLabel);

      // Wrap skill list to fit line width
      const skillsStr = skillList.join(', ');
      const wrappedLines = doc.splitTextToSize(categoryLabel + skillsStr, contentWidth);

      wrappedLines.forEach((wLine, idx) => {
        ensureSpace(12);
        if (idx === 0) {
          doc.setFont('Helvetica', 'bold');
          doc.setTextColor(15, 23, 42);
          doc.text(categoryLabel, marginLeft, currentY);

          doc.setFont('Helvetica', 'normal');
          doc.setTextColor(51, 65, 85);
          const remainder = wLine.slice(categoryLabel.length);
          doc.text(remainder, marginLeft + labelWidth, currentY);
        } else {
          doc.setFont('Helvetica', 'normal');
          doc.setTextColor(51, 65, 85);
          doc.text(wLine, marginLeft + 12, currentY);
        }
        currentY += 11.5;
      });
    });

    currentY += 4;
  }

  // ==========================================
  // 5. TECHNICAL PROJECTS
  // ==========================================
  const activeProjects = (projects || []).filter((p) => p.included !== false);

  if (activeProjects.length > 0) {
    renderSectionHeader('Technical Projects');

    activeProjects.forEach((proj, pIdx) => {
      ensureSpace(34);

      const projTitle = (proj.name || proj.title || `Project ${pIdx + 1}`).trim();
      const techStack = (proj.technologies || proj.techStack || '').trim();
      const projDate = (proj.date || '').trim();

      // Project Header Line
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(projTitle, marginLeft, currentY);

      const titleWidth = doc.getTextWidth(projTitle);

      if (techStack) {
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        const stackText = `  |  ${techStack}`;
        const maxStackWidth = contentWidth - titleWidth - (projDate ? 70 : 10);
        if (doc.getTextWidth(stackText) < maxStackWidth) {
          doc.text(stackText, marginLeft + titleWidth, currentY);
        }
      }

      if (projDate) {
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        doc.text(projDate, marginLeft + contentWidth, currentY, { align: 'right' });
      }
      currentY += 11.5;

      // Project URL / Link if available
      const projLink = proj.projectUrl || proj.liveUrl || proj.githubUrl;
      if (projLink) {
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(99, 102, 241);
        doc.text(`Link: ${projLink}`, marginLeft + 10, currentY);
        currentY += 10.5;
      }

      // Project Description / Bullets
      const bullets = (proj.bullets && proj.bullets.length > 0)
        ? proj.bullets.filter(Boolean)
        : proj.contribution
        ? [proj.contribution]
        : proj.description
        ? [proj.description]
        : [];

      bullets.forEach((bullet) => {
        const cleanBullet = bullet.trim();
        if (!cleanBullet) return;

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(30, 41, 59);

        // Split bullet with hanging indent
        const wrappedBulletLines = doc.splitTextToSize(cleanBullet, contentWidth - 14);
        wrappedBulletLines.forEach((bLine, bIdx) => {
          ensureSpace(11.5);
          if (bIdx === 0) {
            // Draw clean standard bullet point
            doc.text('\u2022', marginLeft + 2, currentY);
            doc.text(bLine, marginLeft + 12, currentY);
          } else {
            doc.text(bLine, marginLeft + 12, currentY);
          }
          currentY += 11.5;
        });
      });

      currentY += 4;
    });

    currentY += 2;
  }

  // ==========================================
  // 6. WORK EXPERIENCE
  // ==========================================
  const activeExperience = (experience || []).filter((e) => e.included !== false);

  if (activeExperience.length > 0) {
    renderSectionHeader('Work Experience');

    activeExperience.forEach((exp) => {
      ensureSpace(34);

      const role = exp.role || 'Software Engineering Intern';
      const company = exp.company || 'Company';
      const period = exp.period || '';
      const location = exp.location || '';

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(role, marginLeft, currentY);

      const roleWidth = doc.getTextWidth(role);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      doc.text(` — ${company}`, marginLeft + roleWidth, currentY);

      if (period) {
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        doc.text(period, marginLeft + contentWidth, currentY, { align: 'right' });
      }
      currentY += 11.5;

      if (location || exp.type) {
        doc.setFont('Helvetica', 'italic');
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        const sub = [exp.type, location].filter(Boolean).join(' | ');
        doc.text(sub, marginLeft + 2, currentY);
        currentY += 10.5;
      }

      // Experience Bullets
      const expBullets = (exp.bullets && exp.bullets.length > 0)
        ? exp.bullets.filter(Boolean)
        : exp.contribution
        ? [exp.contribution]
        : exp.description
        ? [exp.description]
        : [];

      expBullets.forEach((bullet) => {
        const cleanBullet = bullet.trim();
        if (!cleanBullet) return;

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(30, 41, 59);

        const wrappedLines = doc.splitTextToSize(cleanBullet, contentWidth - 14);
        wrappedLines.forEach((bLine, bIdx) => {
          ensureSpace(11.5);
          if (bIdx === 0) {
            doc.text('\u2022', marginLeft + 2, currentY);
            doc.text(bLine, marginLeft + 12, currentY);
          } else {
            doc.text(bLine, marginLeft + 12, currentY);
          }
          currentY += 11.5;
        });
      });

      currentY += 4;
    });

    currentY += 2;
  }

  // ==========================================
  // 7. CERTIFICATIONS
  // ==========================================
  const activeCertifications = (certifications || []).filter((c) => c.included !== false);

  if (activeCertifications.length > 0) {
    renderSectionHeader('Certifications');

    activeCertifications.forEach((cert) => {
      ensureSpace(14);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);

      const certName = cert.name || 'Certification';
      const certIssuer = cert.issuer ? ` — ${cert.issuer}` : '';
      const certYear = cert.year ? ` (${cert.year})` : '';
      const certUrl = cert.url ? ` [${cert.url}]` : '';

      const fullCertText = `${certName}${certIssuer}${certYear}${certUrl}`;
      const wrapped = doc.splitTextToSize(fullCertText, contentWidth - 14);

      wrapped.forEach((line, idx) => {
        ensureSpace(11.5);
        if (idx === 0) {
          doc.text('\u2022', marginLeft + 2, currentY);
          doc.text(line, marginLeft + 12, currentY);
        } else {
          doc.text(line, marginLeft + 12, currentY);
        }
        currentY += 11.5;
      });
    });

    currentY += 4;
  }

  // Output filename
  const cleanName = (personal.fullName || 'Candidate').replace(/[^a-zA-Z0-9]/g, '_');
  const targetFileName = fileName || `${cleanName}_ATS_Resume.pdf`;

  if (save && typeof window !== 'undefined') {
    doc.save(targetFileName);
  }

  if (returnDoc) {
    return doc;
  }

  return {
    doc,
    fileName: targetFileName,
    totalPages: doc.getNumberOfPages()
  };
};
