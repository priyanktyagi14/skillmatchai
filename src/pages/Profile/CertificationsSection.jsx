import React, { useState } from 'react';
import { Award, Plus, Trash2, Pencil, Calendar, ExternalLink } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';

export const CertificationsSection = ({
  certifications = [],
  onAddCertification,
  onUpdateCertification,
  onDeleteCertification
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [year, setYear] = useState('');
  const [url, setUrl] = useState('');
  const [errors, setErrors] = useState({});

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setIssuer('');
    setYear(`${new Date().getFullYear()}`);
    setUrl('');
    setErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (cert) => {
    setEditingId(cert.id);
    setName(cert.name || '');
    setIssuer(cert.issuer || '');
    setYear(cert.year || '');
    setUrl(cert.url || '');
    setErrors({});
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const errs = {};
    if (!name.trim()) errs.name = 'Certification name is required';
    if (!issuer.trim()) errs.issuer = 'Issuer / Organization is required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const payload = {
      id: editingId || `cert-${Date.now()}`,
      name: name.trim(),
      issuer: issuer.trim(),
      year: year.trim() || `${new Date().getFullYear()}`,
      url: url.trim()
    };

    if (editingId) {
      onUpdateCertification(editingId, payload);
    } else {
      onAddCertification(payload);
    }

    setModalOpen(false);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            Certifications & Licenses
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Professional certifications, online specializations, and verified achievements.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={handleOpenAdd}
        >
          Add Certification
        </Button>
      </div>

      {certifications.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-xs sm:text-sm">
          No certifications listed yet. Add certifications to strengthen your technical credentials and ATS score.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {cert.name}
                  </h4>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleOpenEdit(cert)}
                      className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteCertification(cert.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-1 font-medium">
                  {cert.issuer}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {cert.year || 'Completed'}
                </span>
                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>Credential</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Certification' : 'Add Certification'}
        description="Provide certification name and issuing body."
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
              placeholder="e.g. Amazon Web Services"
              value={issuer}
              onChange={(e) => {
                setIssuer(e.target.value);
                if (errors.issuer) setErrors((prev) => ({ ...prev, issuer: undefined }));
              }}
              error={errors.issuer}
            />
            <Input
              label="Year"
              placeholder="2024"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>

          <Input
            label="Credential URL (Optional)"
            placeholder="https://credly.com/badges/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingId ? 'Update Certification' : 'Save Certification'}
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
};

