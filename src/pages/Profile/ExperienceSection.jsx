import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Trash2,
  Pencil,
  Building2,
  Calendar,
  MapPin
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Textarea } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Modal } from '../../components/common/Modal';

const EXPERIENCE_TYPES = [
  'Internship',
  'Full-time',
  'Part-time',
  'Contract / Freelance',
  'Research Fellow',
  'Open Source Contributor'
];

export const ExperienceSection = ({
  experience = [],
  onAddExperience,
  onUpdateExperience,
  onDeleteExperience
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [type, setType] = useState('Internship');
  const [location, setLocation] = useState('');
  const [period, setPeriod] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  const handleOpenAdd = () => {
    setEditingId(null);
    setRole('');
    setCompany('');
    setType('Internship');
    setLocation('');
    setPeriod('');
    setDescription('');
    setErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (exp) => {
    setEditingId(exp.id);
    setRole(exp.role || '');
    setCompany(exp.company || '');
    setType(exp.type || 'Internship');
    setLocation(exp.location || '');
    setPeriod(exp.period || '');
    setDescription(exp.description || exp.contribution || (exp.bullets ? exp.bullets.join('. ') : ''));
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!role.trim()) errs.role = 'Role / Job title is required';
    if (!company.trim()) errs.company = 'Company name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!validate()) return;

    const formattedExp = {
      role: role.trim(),
      company: company.trim(),
      type: type,
      location: location.trim(),
      period: period.trim(),
      description: description.trim(),
      contribution: description.trim(),
      bullets: description.trim()
        ? description
            .split(/\n+/)
            .map(s => s.trim())
            .filter(Boolean)
        : ['Contributed to engineering feature delivery.']
    };

    if (editingId) {
      onUpdateExperience(editingId, formattedExp);
    } else {
      onAddExperience(formattedExp);
    }

    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            Internships & Work Experience ({experience.length})
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Document your software engineering internships, fellowships, and practical tech experience.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={handleOpenAdd}
        >
          Add Experience
        </Button>
      </div>

      {/* Experience List */}
      {experience.length > 0 ? (
        <div className="space-y-4">
          {experience.map((exp, idx) => (
            <Card key={exp.id || idx} className="p-5 sm:p-6 border-slate-200/90 shadow-xs space-y-4">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {exp.type || 'Internship'}
                    </span>
                    <h4 className="text-base font-bold text-slate-900">
                      {exp.role}
                    </h4>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-0.5">
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {exp.company}
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {exp.location}
                      </span>
                    )}
                    {exp.period && (
                      <span className="flex items-center gap-1 text-slate-500 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {exp.period}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => handleOpenEdit(exp)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                    title="Edit Experience"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete experience at "${exp.company}"?`)) {
                        onDeleteExperience(exp.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Experience"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Description & Impact Bullets */}
              {(exp.description || exp.contribution) && (
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-700">Role & Achievements:</span>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {exp.description || exp.contribution}
                  </p>
                </div>
              )}

              {exp.bullets && exp.bullets.length > 0 && (
                <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-slate-600">
                  {exp.bullets.filter(Boolean).map((bullet, bIdx) => (
                    <li key={bIdx} className="leading-relaxed">
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-10 text-center border-dashed border-2 border-slate-200">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Briefcase className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">No Work Experience Added</h4>
            <p className="text-xs text-slate-500">
              Internships, part-time roles, or campus technical fellowships strengthen your ATS profile. Add any relevant experience below.
            </p>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={handleOpenAdd}
            >
              Add Your First Internship
            </Button>
          </div>
        </Card>
      )}

      {/* Add / Edit Experience Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingId ? 'Edit Work Experience' : 'Add Internship or Work Experience'}
          description="Document your role, organization, duration, and key technical accomplishments."
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Job Title / Role *"
                id="exp-role"
                placeholder="e.g. Software Engineering Intern"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                error={errors.role}
              />

              <Input
                label="Company / Organization Name *"
                id="exp-company"
                placeholder="e.g. TechNovus Solutions"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                error={errors.company}
              />

              <Select
                label="Experience Type"
                id="exp-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                options={EXPERIENCE_TYPES}
              />

              <Input
                label="Location / Work Mode"
                id="exp-location"
                placeholder="e.g. Bangalore, India (Hybrid) or Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <Input
              label="Duration / Period"
              id="exp-period"
              placeholder="e.g. May 2024 - Jul 2024 or Jun 2024 - Present"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              helperText="Start and end dates of the internship or employment"
            />

            <Textarea
              label="Description & Key Responsibilities"
              id="exp-desc"
              rows={4}
              placeholder="Developed 8+ reusable React UI components accelerating sprint delivery by 22%. Built 6 RESTful API endpoints using Node.js and Express to process customer telemetry logs."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              helperText="Highlight quantifiable impact (%, users, latency) and technical tools used."
            />

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
              >
                {editingId ? 'Save Changes' : 'Add Experience'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
