import React, { useState } from 'react';
import {
  Plus,
  Edit3,
  Archive,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Trash2,
  Calendar,
  Users,
  Layers,
  Sparkles
} from 'lucide-react';
import { ProjectDifficulty, ProjectProblem, StaffProfile } from '../../types';
import { StorageEngine } from '../../services/storage';

interface StaffProblemsProps {
  staff: StaffProfile;
  problems: ProjectProblem[];
  domains: string[];
  onRefreshData: () => void;
}

export const StaffProblems: React.FC<StaffProblemsProps> = ({
  staff,
  problems,
  domains,
  onRefreshData,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Available' | 'Assigned' | 'Archived'>('All');

  // Modal States
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [editingProblem, setEditingProblem] = useState<ProjectProblem | null>(null);
  const [showAddDomainModal, setShowAddDomainModal] = useState(false);
  const [newDomainInput, setNewDomainInput] = useState('');
  const [domainError, setDomainError] = useState<string | null>(null);
  const [domainSuccess, setDomainSuccess] = useState<string | null>(null);

  // Problem Form Fields
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState(domains[0] || 'AI & Machine Learning');
  const [description, setDescription] = useState('');
  const [expectedSolution, setExpectedSolution] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [skillsList, setSkillsList] = useState<string[]>(['Python', 'PyTorch']);
  const [difficulty, setDifficulty] = useState<ProjectDifficulty>('Intermediate');
  const [maxTeamSize, setMaxTeamSize] = useState(3);
  const [deadline, setDeadline] = useState('2026-12-15');
  const [formError, setFormError] = useState<string | null>(null);

  // Filter problems for this staff member
  const staffProblems = problems.filter((p) => p.staffId === staff.id);

  const filteredProblems = staffProblems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.domain.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const openCreateModal = () => {
    setEditingProblem(null);
    setTitle('');
    setDomain(domains[0] || 'AI & Machine Learning');
    setDescription('');
    setExpectedSolution('');
    setSkillsList(['Python', 'React']);
    setDifficulty('Intermediate');
    setMaxTeamSize(3);
    setDeadline('2026-12-15');
    setFormError(null);
    setShowProblemModal(true);
  };

  const openEditModal = (problem: ProjectProblem) => {
    setEditingProblem(problem);
    setTitle(problem.title);
    setDomain(problem.domain);
    setDescription(problem.description);
    setExpectedSolution(problem.expectedSolution);
    setSkillsList(problem.requiredSkills);
    setDifficulty(problem.difficulty);
    setMaxTeamSize(problem.maxTeamSize);
    setDeadline(problem.deadline);
    setFormError(null);
    setShowProblemModal(true);
  };

  const handleAddSkill = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    const clean = skillsInput.trim();
    if (clean && !skillsList.includes(clean)) {
      setSkillsList([...skillsList, clean]);
      setSkillsInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkillsList(skillsList.filter((s) => s !== skill));
  };

  // Submit Problem Statement Form
  const handleSubmitProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !expectedSolution.trim()) {
      setFormError('Please fill in all required problem fields.');
      return;
    }

    if (skillsList.length === 0) {
      setFormError('Please specify at least one required skill for the project.');
      return;
    }

    const problemPayload: ProjectProblem = {
      id: editingProblem ? editingProblem.id : `prob_${Date.now()}`,
      title: title.trim(),
      domain: domain.trim(),
      description: description.trim(),
      expectedSolution: expectedSolution.trim(),
      requiredSkills: skillsList,
      difficulty,
      maxTeamSize,
      deadline,
      staffId: staff.id,
      staffName: staff.fullName,
      staffDepartment: staff.department,
      staffAvatar: staff.avatarUrl,
      status: editingProblem ? editingProblem.status : 'Available',
      createdAt: editingProblem ? editingProblem.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    StorageEngine.saveProblem(problemPayload);
    setShowProblemModal(false);
    onRefreshData();
  };

  // Archive / Unarchive Problem
  const handleToggleArchive = (problem: ProjectProblem) => {
    const nextStatus = problem.status === 'Archived' ? 'Available' : 'Archived';
    const actionLabel = nextStatus === 'Archived' ? 'archive' : 'publish back';

    if (confirm(`Are you sure you want to ${actionLabel} "${problem.title}"?`)) {
      StorageEngine.saveProblem({
        ...problem,
        status: nextStatus,
        updatedAt: new Date().toISOString(),
      });
      onRefreshData();
    }
  };

  // Add Custom Domain
  const handleAddCustomDomain = (e: React.FormEvent) => {
    e.preventDefault();
    setDomainError(null);
    setDomainSuccess(null);

    const clean = newDomainInput.trim();
    if (!clean) {
      setDomainError('Domain name cannot be empty.');
      return;
    }

    const success = StorageEngine.addDomain(clean);
    if (!success) {
      setDomainError('This domain already exists in the university catalog.');
      return;
    }

    setDomainSuccess(`Domain "${clean}" added successfully!`);
    setNewDomainInput('');
    setTimeout(() => {
      setShowAddDomainModal(false);
      setDomainSuccess(null);
      onRefreshData();
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            My Problem Statements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Author, publish, edit, and archive research problems for student capstone teams
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddDomainModal(true)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            + Add Domain
          </button>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Publish Problem Statement
          </button>
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your published problems..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-medium">
          <span className="text-slate-500 mr-1">Status:</span>
          {(['All', 'Available', 'Assigned', 'Archived'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === status
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Problems List */}
      {filteredProblems.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No Problem Statements Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
            You have not published any problems matching the selected status or query.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
          >
            Create Your First Problem
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProblems.map((prob) => {
            const isArchived = prob.status === 'Archived';

            return (
              <div
                key={prob.id}
                className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-2xs space-y-4 transition-all ${
                  isArchived ? 'opacity-65 border-slate-200 bg-slate-50/50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <span className="font-semibold text-blue-700">{prob.domain}</span>
                      <span aria-hidden="true">·</span>
                      <span>{prob.difficulty}</span>
                      <span aria-hidden="true">·</span>
                      <span>Target: {prob.deadline}</span>
                      <span aria-hidden="true">·</span>
                      <span>Max Team: {prob.maxTeamSize}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {prob.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                        prob.status === 'Available'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : prob.status === 'Assigned'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {prob.status}
                    </span>

                    <button
                      onClick={() => openEditModal(prob)}
                      title="Edit Problem Statement"
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleToggleArchive(prob)}
                      title={isArchived ? 'Publish Problem' : 'Archive Problem'}
                      className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                  <div>
                    <strong className="text-slate-800 block text-[11px] uppercase tracking-wider mb-0.5">
                      Description &amp; Problem Statement:
                    </strong>
                    <p className="line-clamp-2">{prob.description}</p>
                  </div>

                  <div>
                    <strong className="text-slate-800 block text-[11px] uppercase tracking-wider mb-0.5">
                      Expected Solution:
                    </strong>
                    <p className="line-clamp-2">{prob.expectedSolution}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-slate-500 font-medium">Required Skills:</span>
                    {prob.requiredSkills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <span className="text-[11px] text-slate-400">
                    Updated {new Date(prob.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT PROBLEM MODAL */}
      {showProblemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {editingProblem ? 'Edit Problem Statement' : 'Publish New Problem Statement'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Specify technical details, required skillsets, and expectations for student teams
            </p>

            {formError && (
              <div className="p-2.5 mb-4 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitProblem} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Problem Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Automated Diabetic Retinopathy Screening on Edge Devices"
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Domain</label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {domains.map((dom) => (
                      <option key={dom} value={dom}>
                        {dom}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Team Size</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={maxTeamSize}
                    onChange={(e) => setMaxTeamSize(parseInt(e.target.value) || 1)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Proposal &amp; Completion Target Date
                </label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Problem Description &amp; Technical Context
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail the scientific or engineering challenge to be tackled..."
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Expected Solution &amp; Deliverables
                </label>
                <textarea
                  required
                  rows={3}
                  value={expectedSolution}
                  onChange={(e) => setExpectedSolution(e.target.value)}
                  placeholder="What code, hardware prototypes, models, or evaluations are expected?"
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Required Technical Skills
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
                    placeholder="e.g. PyTorch, React, Computer Vision, Docker"
                    className="flex-1 p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skillsList.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-medium"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-blue-400 hover:text-blue-700 ml-1 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProblemModal(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  {editingProblem ? 'Save Changes' : 'Publish Problem'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD CUSTOM DOMAIN MODAL */}
      {showAddDomainModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Add New Project Domain
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Add a new multidisciplinary research or engineering domain to the university catalog
            </p>

            {domainError && (
              <div className="p-2.5 mb-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{domainError}</span>
              </div>
            )}

            {domainSuccess && (
              <div className="p-2.5 mb-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{domainSuccess}</span>
              </div>
            )}

            <form onSubmit={handleAddCustomDomain} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Domain Name
                </label>
                <input
                  type="text"
                  required
                  value={newDomainInput}
                  onChange={(e) => setNewDomainInput(e.target.value)}
                  placeholder="e.g. Quantum Computing, Renewable Energy, Robotics"
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <p className="text-[11px] text-slate-500 mb-1">Active Domains in System:</p>
                <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto p-2 bg-slate-50 rounded-lg border border-slate-200">
                  {domains.map((d) => (
                    <span key={d} className="px-2 py-0.5 bg-white text-slate-700 rounded text-[10px] border border-slate-200 font-medium">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDomainModal(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Save Domain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
