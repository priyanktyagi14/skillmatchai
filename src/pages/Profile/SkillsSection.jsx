import React, { useState, useMemo } from 'react';
import {
  Code2,
  Plus,
  Trash2,
  Pencil,
  Search,
  Check,
  Sparkles,
  PlusCircle
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { SKILL_CATEGORY_LIST, TECH_SKILLS, normalizeSkillCategory } from '../../data/skillsTaxonomy';

const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export const SkillsSection = ({
  skills = [],
  onAddSkill,
  onEditSkill,
  onRemoveSkill,
  onAddMultipleSkills
}) => {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');

  // Single Custom Skill Input State
  const [customSkillName, setCustomSkillName] = useState('');
  const [customSkillCategory, setCustomSkillCategory] = useState(SKILL_CATEGORY_LIST[0]);
  const [customSkillLevel, setCustomSkillLevel] = useState('Intermediate');
  const [addSkillError, setAddSkillError] = useState('');

  // Multi-Skill Batch State
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchCommaInput, setBatchCommaInput] = useState('');
  const [batchCategory, setBatchCategory] = useState(SKILL_CATEGORY_LIST[0]);
  const [batchLevel, setBatchLevel] = useState('Intermediate');
  const [batchSelectedTaxonomy, setBatchSelectedTaxonomy] = useState([]);
  const [batchTaxonomySearch, setBatchTaxonomySearch] = useState('');

  // Edit Skill Modal State
  const [editingSkill, setEditingSkill] = useState(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editLevel, setEditLevel] = useState('');

  // Handle Add Single Custom Skill
  const handleAddCustomSkill = (e) => {
    e?.preventDefault();
    setAddSkillError('');
    const trimmed = customSkillName.trim();
    if (!trimmed) {
      setAddSkillError('Please enter a skill name');
      return;
    }

    const alreadyExists = skills.some(
      s => s.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (alreadyExists) {
      setAddSkillError(`"${trimmed}" is already in your skills profile`);
      return;
    }

    onAddSkill({
      name: trimmed,
      category: customSkillCategory,
      level: customSkillLevel
    });

    setCustomSkillName('');
    setAddSkillError('');
  };

  // Open Edit Modal
  const handleOpenEdit = (skill) => {
    setEditingSkill(skill);
    setEditName(skill.name);
    setEditCategory(normalizeSkillCategory(skill.category));
    setEditLevel(skill.level || 'Intermediate');
  };

  // Save Edit Skill
  const handleSaveEdit = () => {
    if (!editName.trim() || !editingSkill) return;
    onEditSkill(editingSkill.name, {
      name: editName.trim(),
      category: editCategory,
      level: editLevel
    });
    setEditingSkill(null);
  };

  // Handle Add Comma Separated Skills
  const handleAddCommaSkills = (e) => {
    e?.preventDefault();
    if (!batchCommaInput.trim()) return;

    const items = batchCommaInput
      .split(/[,;\n]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const skillsToAdd = items.map(name => ({
      name,
      category: batchCategory,
      level: batchLevel
    }));

    if (skillsToAdd.length > 0) {
      onAddMultipleSkills(skillsToAdd);
      setBatchCommaInput('');
      setShowBatchModal(false);
    }
  };

  // Handle Add Selected Taxonomy Skills
  const handleAddTaxonomyBatch = () => {
    if (batchSelectedTaxonomy.length === 0) return;
    onAddMultipleSkills(batchSelectedTaxonomy);
    setBatchSelectedTaxonomy([]);
    setShowBatchModal(false);
  };

  const toggleTaxonomySelection = (tech) => {
    const isSelected = batchSelectedTaxonomy.some(
      s => s.name.toLowerCase() === tech.name.toLowerCase()
    );
    if (isSelected) {
      setBatchSelectedTaxonomy(prev =>
        prev.filter(s => s.name.toLowerCase() !== tech.name.toLowerCase())
      );
    } else {
      setBatchSelectedTaxonomy(prev => [
        ...prev,
        {
          name: tech.name,
          category: normalizeSkillCategory(tech.category),
          level: batchLevel
        }
      ]);
    }
  };

  // Filter skills by search and category
  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      const matchesSearch =
        skill.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        skill.category.toLowerCase().includes(searchQuery.toLowerCase().trim());

      const matchesCat =
        selectedCategoryFilter === 'ALL' ||
        normalizeSkillCategory(skill.category) === selectedCategoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [skills, searchQuery, selectedCategoryFilter]);

  // Group filtered skills by the 8 canonical categories
  const groupedCategories = useMemo(() => {
    return SKILL_CATEGORY_LIST.map(category => {
      const categorySkills = filteredSkills.filter(
        s => normalizeSkillCategory(s.category) === category
      );
      return {
        category,
        skills: categorySkills
      };
    });
  }, [filteredSkills]);

  // Filtered taxonomy for batch modal
  const availableTaxonomy = useMemo(() => {
    const userSkillNames = new Set(skills.map(s => s.name.toLowerCase()));
    return TECH_SKILLS.filter(t => {
      const notInProfile = !userSkillNames.has(t.name.toLowerCase());
      const matchesSearch =
        !batchTaxonomySearch ||
        t.name.toLowerCase().includes(batchTaxonomySearch.toLowerCase()) ||
        t.category.toLowerCase().includes(batchTaxonomySearch.toLowerCase());
      return notInProfile && matchesSearch;
    });
  }, [skills, batchTaxonomySearch]);

  const getLevelBadgeClass = (level) => {
    switch (level) {
      case 'Advanced':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Intermediate':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Beginner':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Add Custom Skill Card */}
      <Card className="p-5 sm:p-6 border-slate-200/90 shadow-xs">
        <form onSubmit={handleAddCustomSkill} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-600" />
                Add Technical Skill
              </h3>
              <p className="text-xs text-slate-500">
                Add programming languages, frameworks, or CS tools and select your proficiency level.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={PlusCircle}
              onClick={() => setShowBatchModal(true)}
              className="text-xs self-start sm:self-auto"
            >
              Add Multiple Skills
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
            {/* Skill Name */}
            <div className="sm:col-span-4">
              <Input
                placeholder="e.g. Docker, TypeScript, PyTorch"
                value={customSkillName}
                onChange={(e) => {
                  setCustomSkillName(e.target.value);
                  if (addSkillError) setAddSkillError('');
                }}
                error={addSkillError}
              />
            </div>

            {/* Category */}
            <div className="sm:col-span-4">
              <Select
                value={customSkillCategory}
                onChange={(e) => setCustomSkillCategory(e.target.value)}
                options={SKILL_CATEGORY_LIST}
              />
            </div>

            {/* Proficiency Level */}
            <div className="sm:col-span-3">
              <Select
                value={customSkillLevel}
                onChange={(e) => setCustomSkillLevel(e.target.value)}
                options={PROFICIENCY_LEVELS}
              />
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-1">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full h-[38px] flex items-center justify-center"
                icon={Plus}
                aria-label="Add Skill"
              />
            </div>
          </div>

          {/* Quick Click-to-Add Suggestions from Taxonomy */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between pb-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Recommended CS Skills (Click to add):
              </span>
              <span className="text-[10px] text-slate-400">Default: Intermediate</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TECH_SKILLS.slice(0, 16).map((tech) => {
                const alreadyHas = skills.some(
                  s => s.name.toLowerCase() === tech.name.toLowerCase()
                );
                if (alreadyHas) return null;
                return (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => {
                      onAddSkill({
                        name: tech.name,
                        category: normalizeSkillCategory(tech.category),
                        level: 'Intermediate'
                      });
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-700 border border-slate-200/80 transition-colors flex items-center gap-1 group"
                  >
                    <Plus className="w-3 h-3 text-slate-400 group-hover:text-indigo-600" />
                    <span>{tech.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </form>
      </Card>

      {/* 2. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="w-full sm:max-w-xs">
          <Input
            icon={Search}
            placeholder="Search skills in your profile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Total skills & clear */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500">
          <span>
            Total: <strong className="text-slate-800">{skills.length}</strong> skills
          </span>
          {(searchQuery || selectedCategoryFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoryFilter('ALL');
              }}
              className="text-indigo-600 hover:underline font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex flex-wrap gap-1.5 pb-1">
        <button
          type="button"
          onClick={() => setSelectedCategoryFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
            selectedCategoryFilter === 'ALL'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>All Categories</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            selectedCategoryFilter === 'ALL' ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {skills.length}
          </span>
        </button>

        {SKILL_CATEGORY_LIST.map((cat) => {
          const count = skills.filter(
            s => normalizeSkillCategory(s.category) === cat
          ).length;
          const isActive = selectedCategoryFilter === cat;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{cat}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isActive ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. 8 Categorized Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groupedCategories
          .filter(group => selectedCategoryFilter === 'ALL' || group.category === selectedCategoryFilter)
          .map(({ category, skills: catSkills }) => (
            <Card key={category} className="p-5 flex flex-col justify-between border-slate-200/90 shadow-xs">
              <div>
                {/* Category Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      {category}
                    </h4>
                  </div>
                  <Badge variant={catSkills.length > 0 ? 'indigo' : 'outline'} size="xs">
                    {catSkills.length} {catSkills.length === 1 ? 'skill' : 'skills'}
                  </Badge>
                </div>

                {/* Skills Badges */}
                <div className="pt-3.5 min-h-[70px]">
                  {catSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {catSkills.map((skill) => (
                        <div
                          key={skill.name}
                          className={`inline-flex items-center gap-1.5 border px-2.5 py-1 rounded-md text-xs transition-shadow group ${getLevelBadgeClass(
                            skill.level
                          )}`}
                        >
                          <span className="font-semibold text-slate-900">{skill.name}</span>
                          <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-white/70 border border-black/5 text-slate-600">
                            {skill.level || 'Intermediate'}
                          </span>

                          {/* Edit Skill Trigger */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(skill)}
                            title="Edit Skill"
                            className="text-slate-400 hover:text-indigo-600 transition-colors p-0.5 ml-0.5 rounded hover:bg-white/60"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>

                          {/* Remove Skill Trigger */}
                          <button
                            type="button"
                            onClick={() => onRemoveSkill(skill.name)}
                            title="Remove Skill"
                            className="text-slate-400 hover:text-rose-600 transition-colors p-0.5 rounded hover:bg-white/60"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-4 text-center">
                      <p className="text-xs text-slate-400 italic">
                        {searchQuery
                          ? 'No matching skills in this category.'
                          : 'No skills added in this category yet.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Quick Suggestion for Empty / Light Categories */}
              {catSkills.length < 2 && (
                <div className="pt-3 border-t border-slate-100/80 mt-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    <span>Popular {category.split(' ')[0]} skills:</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {TECH_SKILLS.filter(t => normalizeSkillCategory(t.category) === category)
                      .slice(0, 4)
                      .filter(t => !skills.some(s => s.name.toLowerCase() === t.name.toLowerCase()))
                      .map(t => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            onAddSkill({
                              name: t.name,
                              category,
                              level: 'Intermediate'
                            });
                          }}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 border border-slate-200 transition-colors"
                        >
                          + {t.name}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
      </div>

      {/* 4. Edit Skill Modal */}
      {editingSkill && (
        <Modal
          isOpen={Boolean(editingSkill)}
          onClose={() => setEditingSkill(null)}
          title="Edit Technical Skill"
          description="Update skill name, target category, or proficiency level."
        >
          <div className="p-6 space-y-4">
            <Input
              label="Skill Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="e.g. JavaScript, Docker, Redis"
            />

            <Select
              label="Category"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              options={SKILL_CATEGORY_LIST}
            />

            <Select
              label="Proficiency Level"
              value={editLevel}
              onChange={(e) => setEditLevel(e.target.value)}
              options={PROFICIENCY_LEVELS}
            />

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingSkill(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveEdit}
                disabled={!editName.trim()}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* 5. Add Multiple Skills Modal */}
      {showBatchModal && (
        <Modal
          isOpen={showBatchModal}
          onClose={() => setShowBatchModal(false)}
          title="Add Multiple Skills"
          description="Quickly import multiple technical skills at once by selecting or typing."
          maxWidth="max-w-2xl"
        >
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Method A: Interactive Taxonomy Checklist */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Select from Tech Taxonomy
                  </h4>
                  <p className="text-xs text-slate-500">
                    Click any skill to check/uncheck for batch addition.
                  </p>
                </div>

                <div className="w-full sm:w-48">
                  <Input
                    placeholder="Search taxonomy..."
                    icon={Search}
                    value={batchTaxonomySearch}
                    onChange={(e) => setBatchTaxonomySearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Default level picker for batch */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs">
                <span className="font-semibold text-slate-700">Set Proficiency Level:</span>
                <div className="flex gap-1.5">
                  {PROFICIENCY_LEVELS.map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => {
                        setBatchLevel(lvl);
                        // Update already selected items
                        setBatchSelectedTaxonomy(prev =>
                          prev.map(item => ({ ...item, level: lvl }))
                        );
                      }}
                      className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                        batchLevel === lvl
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Taxonomy list */}
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2 bg-slate-50/50 rounded-lg border border-slate-200/80">
                {availableTaxonomy.length > 0 ? (
                  availableTaxonomy.map(tech => {
                    const isSelected = batchSelectedTaxonomy.some(
                      s => s.name.toLowerCase() === tech.name.toLowerCase()
                    );
                    return (
                      <button
                        key={tech.id}
                        type="button"
                        onClick={() => toggleTaxonomySelection(tech)}
                        className={`text-xs px-2.5 py-1.5 rounded-md border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                        <span>{tech.name}</span>
                        <span className={`text-[10px] ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                          ({tech.category.split(' ')[0]})
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400 italic p-3">
                    No matching taxonomy skills found.
                  </p>
                )}
              </div>

              {batchSelectedTaxonomy.length > 0 && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-semibold text-indigo-700">
                    {batchSelectedTaxonomy.length} skills selected
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleAddTaxonomyBatch}
                  >
                    Add Selected ({batchSelectedTaxonomy.length}) Skills
                  </Button>
                </div>
              )}
            </div>

            {/* Method B: Comma Separated Raw Input */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Or Type Comma-Separated Skills
                </h4>
                <p className="text-xs text-slate-500">
                  Enter multiple custom skill names separated by commas (e.g. FastAPI, Redis, Cassandra, GraphQL).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  label="Category for these skills"
                  value={batchCategory}
                  onChange={(e) => setBatchCategory(e.target.value)}
                  options={SKILL_CATEGORY_LIST}
                />
                <Select
                  label="Proficiency Level"
                  value={batchLevel}
                  onChange={(e) => setBatchLevel(e.target.value)}
                  options={PROFICIENCY_LEVELS}
                />
              </div>

              <textarea
                rows={3}
                className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Redis, Cassandra, RabbitMQ, Docker, GraphQL"
                value={batchCommaInput}
                onChange={(e) => setBatchCommaInput(e.target.value)}
              />

              <div className="flex items-center justify-end gap-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBatchModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddCommaSkills}
                  disabled={!batchCommaInput.trim()}
                >
                  Add Comma-Separated Skills
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
