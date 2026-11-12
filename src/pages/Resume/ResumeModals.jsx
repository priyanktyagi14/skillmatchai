import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/common/Modal';
import { Input, Textarea } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';

// 1. PROJECT MODAL
export const ProjectModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [date, setDate] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [bulletsText, setBulletsText] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || initialData.title || '');
      setTechnologies(initialData.technologies || initialData.techStack || '');
      setDate(initialData.date || '');
      setProjectUrl(initialData.projectUrl || initialData.liveUrl || initialData.githubUrl || '');
      const bullets = initialData.bullets || (initialData.contribution ? [initialData.contribution] : []);
      setBulletsText(bullets.join('\n'));
    } else {
      setName('');
      setTechnologies('');
      setDate('2024');
      setProjectUrl('');
      setBulletsText('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const errs = {};
    if (!name.trim()) errs.name = 'Project name is required';
    if (!technologies.trim()) errs.technologies = 'Technologies used are required';
    if (!bulletsText.trim()) errs.bulletsText = 'At least one bullet point or description is required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const bullets = bulletsText
      .split('\n')
      .map((b) => b.trim())
      .filter(Boolean);

    onSave({
      id: initialData?.id || `proj-${Date.now()}`,
      name: name.trim(),
      title: name.trim(),
      technologies: technologies.trim(),
      techStack: technologies.trim(),
      date: date.trim() || '2024',
      projectUrl: projectUrl.trim(),
      bullets,
      contribution: bullets[0] || '',
      included: true
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Technical Project' : 'Add Technical Project'}
      description="Add project details and measurable engineering impact bullets for ATS parsing."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Project Name *"
          placeholder="e.g. DevCollab — Real-Time Developer Collaboration Platform"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          error={errors.name}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Technologies Used *"
            placeholder="e.g. React.js, Node.js, PostgreSQL, Docker"
            value={technologies}
            onChange={(e) => {
              setTechnologies(e.target.value);
              if (errors.technologies) setErrors((prev) => ({ ...prev, technologies: undefined }));
            }}
            error={errors.technologies}
          />
          <Input
            label="Date / Duration"
            placeholder="e.g. Aug 2024 - Nov 2024"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <Input
          label="Project URL or Repository (Optional)"
          placeholder="https://github.com/your-username/project"
          value={projectUrl}
          onChange={(e) => setProjectUrl(e.target.value)}
        />

        <Textarea
          label="Impact Bullet Points (One per line) *"
          placeholder="• Architected real-time WebSocket connection handling 50+ concurrent users with <80ms latency&#10;• Implemented secure JWT cookie authentication with refresh token rotation&#10;• Optimized PostgreSQL query execution reducing API response times by 38%"
          rows={5}
          value={bulletsText}
          onChange={(e) => {
            setBulletsText(e.target.value);
            if (errors.bulletsText) setErrors((prev) => ({ ...prev, bulletsText: undefined }));
          }}
          helperText="ATS Tip: Start each bullet with a power action verb (Architected, Engineered, Built) and include measurable numbers (% or ms)."
          error={errors.bulletsText}
        />

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initialData ? 'Update Project' : 'Add Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// 2. EXPERIENCE MODAL
export const ExperienceModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [period, setPeriod] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('Internship');
  const [bulletsText, setBulletsText] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setRole(initialData.role || '');
      setCompany(initialData.company || '');
      setPeriod(initialData.period || '');
      setLocation(initialData.location || '');
      setType(initialData.type || 'Internship');
      const bullets = initialData.bullets || (initialData.contribution ? [initialData.contribution] : []);
      setBulletsText(bullets.join('\n'));
    } else {
      setRole('Software Engineering Intern');
      setCompany('');
      setPeriod('May 2024 - Jul 2024');
      setLocation('Bangalore, India');
      setType('Internship');
      setBulletsText('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const errs = {};
    if (!role.trim()) errs.role = 'Role title is required';
    if (!company.trim()) errs.company = 'Company name is required';
    if (!bulletsText.trim()) errs.bulletsText = 'At least one bullet point is required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const bullets = bulletsText
      .split('\n')
      .map((b) => b.trim())
      .filter(Boolean);

    onSave({
      id: initialData?.id || `exp-${Date.now()}`,
      role: role.trim(),
      company: company.trim(),
      period: period.trim(),
      location: location.trim(),
      type,
      bullets,
      contribution: bullets[0] || '',
      included: true
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Work Experience' : 'Add Work Experience'}
      description="Include internships, apprenticeships, or technical roles."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Role / Title *"
            placeholder="Software Engineering Intern"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              if (errors.role) setErrors((prev) => ({ ...prev, role: undefined }));
            }}
            error={errors.role}
          />
          <Input
            label="Company Name *"
            placeholder="e.g. TechNovus Solutions"
            value={company}
            onChange={(e) => {
              setCompany(e.target.value);
              if (errors.company) setErrors((prev) => ({ ...prev, company: undefined }));
            }}
            error={errors.company}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Period"
            placeholder="e.g. May 2024 - Jul 2024"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          />
          <Input
            label="Location"
            placeholder="e.g. Bangalore, India"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Select
            label="Experience Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={[
              { value: 'Internship', label: 'Internship' },
              { value: 'Full-time', label: 'Full-time' },
              { value: 'Part-time', label: 'Part-time' },
              { value: 'Freelance / Contract', label: 'Freelance / Contract' }
            ]}
          />
        </div>

        <Textarea
          label="Bullet Points (One per line) *"
          placeholder="• Developed 8+ reusable React components conforming to accessibility guidelines&#10;• Built 6 RESTful API endpoints with Node.js and Express to process telemetry logs&#10;• Collaborated in Agile Scrum sprints and automated CI/CD pipeline checks"
          rows={5}
          value={bulletsText}
          onChange={(e) => {
            setBulletsText(e.target.value);
            if (errors.bulletsText) setErrors((prev) => ({ ...prev, bulletsText: undefined }));
          }}
          error={errors.bulletsText}
        />

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initialData ? 'Update Experience' : 'Add Experience'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// 3. CERTIFICATION MODAL
export const CertificationModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [year, setYear] = useState('');
  const [url, setUrl] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setIssuer(initialData.issuer || '');
      setYear(initialData.year || '');
      setUrl(initialData.url || '');
    } else {
      setName('');
      setIssuer('');
      setYear(`${new Date().getFullYear()}`);
      setUrl('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const errs = {};
    if (!name.trim()) errs.name = 'Certification name is required';
    if (!issuer.trim()) errs.issuer = 'Issuing organization is required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    onSave({
      id: initialData?.id || `cert-${Date.now()}`,
      name: name.trim(),
      issuer: issuer.trim(),
      year: year.trim() || `${new Date().getFullYear()}`,
      url: url.trim(),
      included: true
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Certification' : 'Add Certification'}
      description="Certifications validate technical skills and boost ATS keyword density."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Certification Name *"
          placeholder="e.g. AWS Certified Cloud Practitioner"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          error={errors.name}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Issuer / Organization *"
            placeholder="e.g. Amazon Web Services, freeCodeCamp"
            value={issuer}
            onChange={(e) => {
              setIssuer(e.target.value);
              if (errors.issuer) setErrors((prev) => ({ ...prev, issuer: undefined }));
            }}
            error={errors.issuer}
          />
          <Input
            label="Year of Completion"
            placeholder="e.g. 2024"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>

        <Input
          label="Credential URL or ID (Optional)"
          placeholder="e.g. https://www.credly.com/badges/..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initialData ? 'Update Certification' : 'Add Certification'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

