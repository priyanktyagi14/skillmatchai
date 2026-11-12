import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  Trash2,
  Pencil,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Textarea } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';

export const ProjectsSection = ({
  projects = [],
  onAddProject,
  onUpdateProject,
  onDeleteProject
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [contribution, setContribution] = useState('');
  const [errors, setErrors] = useState({});

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setTechnologies('');
    setProjectUrl('');
    setContribution('');
    setErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingId(project.id);
    setName(project.name || project.title || '');
    setDescription(project.description || '');
    setTechnologies(project.technologies || project.techStack || '');
    setProjectUrl(project.projectUrl || project.liveUrl || project.githubUrl || '');
    setContribution(project.contribution || (project.bullets ? project.bullets.join('. ') : ''));
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Project name is required';
    if (!description.trim()) errs.description = 'Description is required';
    if (!technologies.trim()) errs.technologies = 'Technologies used are required';
    if (!contribution.trim()) errs.contribution = 'Individual contribution is required';
    if (projectUrl.trim()) {
      const isUrl = /^https?:\/\//i.test(projectUrl.trim()) || projectUrl.includes('.com') || projectUrl.includes('.app') || projectUrl.includes('.dev');
      if (!isUrl) errs.projectUrl = 'Please enter a valid URL (e.g. https://github.com/...)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!validate()) return;

    const formattedProject = {
      name: name.trim(),
      title: name.trim(),
      description: description.trim(),
      technologies: technologies.trim(),
      techStack: technologies.trim(),
      projectUrl: projectUrl.trim(),
      liveUrl: projectUrl.trim(),
      contribution: contribution.trim(),
      bullets: [
        contribution.trim(),
        description.trim()
      ].filter(Boolean)
    };

    if (editingId) {
      onUpdateProject(editingId, formattedProject);
    } else {
      onAddProject(formattedProject);
    }

    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-indigo-600" />
            Technical & Engineering Projects ({projects.length})
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Showcase substantial technical projects demonstrating your programming stack and individual contribution.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={handleOpenAdd}
        >
          Add Project
        </Button>
      </div>

      {/* Projects List */}
      {projects.length > 0 ? (
        <div className="space-y-4">
          {projects.map((proj, idx) => (
            <Card key={proj.id || idx} className="p-5 sm:p-6 border-slate-200/90 shadow-xs space-y-4">
              {/* Project Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      Project #{idx + 1}
                    </span>
                    <h4 className="text-base font-bold text-slate-900">
                      {proj.name || proj.title}
                    </h4>
                  </div>
                  {/* Tech stack tags */}
                  {(proj.technologies || proj.techStack) && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-xs font-semibold text-slate-500 mr-1">Technologies:</span>
                      {(proj.technologies || proj.techStack).split(/[,;]+/).map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/70"
                        >
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {(proj.projectUrl || proj.liveUrl || proj.githubUrl) && (
                    <a
                      href={proj.projectUrl || proj.liveUrl || proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                      title="Open Project Link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={() => handleOpenEdit(proj)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                    title="Edit Project"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete "${proj.name || proj.title}"?`)) {
                        onDeleteProject(proj.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Project Description */}
              {proj.description && (
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-700">Project Description:</span>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              )}

              {/* Individual Contribution */}
              {proj.contribution && (
                <div className="p-3.5 bg-indigo-50/50 rounded-lg border border-indigo-100/80 space-y-1">
                  <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Individual Contribution & Engineering Impact:
                  </span>
                  <p className="text-xs sm:text-sm text-indigo-900/90 leading-relaxed">
                    {proj.contribution}
                  </p>
                </div>
              )}

              {/* Project URL display */}
              {(proj.projectUrl || proj.liveUrl || proj.githubUrl) && (
                <div className="text-xs flex items-center gap-1.5 text-slate-500">
                  <span className="font-medium text-slate-700">Project URL:</span>
                  <a
                    href={proj.projectUrl || proj.liveUrl || proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:underline flex items-center gap-1 font-mono truncate max-w-sm sm:max-w-md"
                  >
                    {proj.projectUrl || proj.liveUrl || proj.githubUrl}
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-10 text-center border-dashed border-2 border-slate-200">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">No Projects Added Yet</h4>
            <p className="text-xs text-slate-500">
              Technical recruiters place high weight on concrete projects. Add at least 1-2 projects detailing the technologies used and your individual contribution.
            </p>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={handleOpenAdd}
            >
              Add Your First Project
            </Button>
          </div>
        </Card>
      )}

      {/* Add / Edit Project Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingId ? 'Edit Project' : 'Add New Technical Project'}
          description="Provide details on architecture, technologies, and your specific contribution."
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <Input
              label="Project Name *"
              id="proj-name"
              placeholder="e.g. DevCollab — Real-Time Developer Collaboration Platform"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              helperText="Give your project a concise and professional title"
            />

            <Textarea
              label="Project Description *"
              id="proj-desc"
              rows={3}
              placeholder="A collaborative web application allowing engineers to write code together with live video chat and automated syntax checking..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={errors.description}
              helperText="What does the project do, who is it for, and what problem does it solve?"
            />

            <Input
              label="Technologies Used *"
              id="proj-tech"
              placeholder="e.g. React.js, Node.js, Express, PostgreSQL, Socket.io, Tailwind CSS"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              error={errors.technologies}
              helperText="Comma-separated list of frameworks, languages, and databases"
            />

            <Input
              label="Project URL (Optional)"
              id="proj-url"
              placeholder="https://github.com/username/project or https://live-demo.app"
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
              error={errors.projectUrl}
              helperText="Link to live web app, GitHub repo, or documentation"
            />

            <Textarea
              label="Individual Contribution *"
              id="proj-contribution"
              rows={3}
              placeholder="Architected the WebSocket synchronization engine handling 50+ concurrent users with <80ms latency. Implemented secure JWT auth with refresh tokens and optimized PostgreSQL queries."
              value={contribution}
              onChange={(e) => setContribution(e.target.value)}
              error={errors.contribution}
              helperText="What specific parts did you build? Include quantifiable metrics (%, ms, users) where possible."
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
                {editingId ? 'Save Changes' : 'Add Project'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
