import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  MessageSquare,
  FileText,
  FileCode,
  ExternalLink,
  Award,
  RefreshCw,
  FolderGit2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ActiveProject, Milestone, MilestoneSubmission, StaffProfile } from '../../types';
import { StorageEngine } from '../../services/storage';

interface StaffProjectsProps {
  staff: StaffProfile;
  projects: ActiveProject[];
  onRefreshData: () => void;
}

export const StaffProjects: React.FC<StaffProjectsProps> = ({
  staff,
  projects,
  onRefreshData,
}) => {
  const staffProjects = projects.filter((p) => p.staffId === staff.id);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    staffProjects.length > 0 ? staffProjects[0].id : null
  );

  // Milestone Creation Form Modal
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);
  const [msTitle, setMsTitle] = useState('');
  const [msDescription, setMsDescription] = useState('');
  const [msDueDate, setMsDueDate] = useState('2026-11-30');

  // Proposal Review Form State
  const [proposalFeedback, setProposalFeedback] = useState('');

  // Milestone Evaluation Form State
  const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(null);
  const [milestoneFeedback, setMilestoneFeedback] = useState('');

  const currentProject = staffProjects.find((p) => p.id === selectedProjectId) || staffProjects[0] || null;

  // Add Milestone
  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) return;

    if (!msTitle.trim() || !msDescription.trim()) return;

    StorageEngine.addMilestone(currentProject.id, {
      projectId: currentProject.id,
      title: msTitle.trim(),
      description: msDescription.trim(),
      dueDate: msDueDate,
      order: currentProject.milestones.length + 1,
    });

    setShowAddMilestoneModal(false);
    setMsTitle('');
    setMsDescription('');
    onRefreshData();
  };

  // Review Proposal
  const handleReviewProposal = (status: 'Approved' | 'Needs Revision') => {
    if (!currentProject || !currentProject.proposal) return;
    const feedback =
      proposalFeedback.trim() ||
      (status === 'Approved'
        ? 'Proposal accepted. The methodology is scientifically sound. You may begin Milestone 1 development.'
        : 'Revisions requested. Please elaborate on system evaluation benchmarks and edge latency targets.');

    StorageEngine.reviewProposal(currentProject.id, status, feedback);
    setProposalFeedback('');
    if (status === 'Approved') {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
    onRefreshData();
  };

  // Review Milestone Submission
  const handleReviewMilestone = (
    milestoneId: string,
    submissionId: string,
    status: 'Approved' | 'Needs Revision'
  ) => {
    if (!currentProject) return;
    const feedback =
      milestoneFeedback.trim() ||
      (status === 'Approved'
        ? 'Deliverable validated and approved. Clear code structure and sufficient test verification.'
        : 'Please update documentation and address edge cases identified in the test suite.');

    StorageEngine.reviewMilestoneSubmission(
      currentProject.id,
      milestoneId,
      submissionId,
      status,
      feedback
    );

    setActiveSubmissionId(null);
    setMilestoneFeedback('');

    if (status === 'Approved') {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    }
    onRefreshData();
  };

  // Mark Project Complete Manually
  const handleMarkProjectComplete = () => {
    if (!currentProject) return;
    if (confirm(`Mark "${currentProject.title}" as officially Completed & Graduated?`)) {
      currentProject.status = 'Completed';
      currentProject.completedAt = new Date().toISOString();
      currentProject.progressPercent = 100;
      StorageEngine.saveProject(currentProject);
      confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });
      onRefreshData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Supervised Projects &amp; Evaluation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Inspect student engineering workspaces, review technical proposals, create milestones, and grade deliverables
        </p>
      </div>

      {staffProjects.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No Supervised Projects Yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            When you approve incoming student collaboration requests in the Requests tab, project workspaces will be created here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Project Switcher */}
          <div className="lg:col-span-1 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block px-1">
              Active Teams ({staffProjects.length})
            </span>
            {staffProjects.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProjectId(p.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  currentProject?.id === p.id
                    ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/10'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-semibold text-blue-700 truncate">{p.domain}</span>
                  <span className="tabular-nums font-bold text-emerald-700">
                    {p.progressPercent}%
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">
                  {p.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Lead: {p.studentLeaderName} ({p.team.length} students)
                </p>
              </button>
            ))}
          </div>

          {/* Main Inspection View */}
          {currentProject && (
            <div className="lg:col-span-3 space-y-6">
              {/* Project Status Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <span className="font-semibold text-blue-700">{currentProject.domain}</span>
                      <span aria-hidden="true">·</span>
                      <span>Team Lead: {currentProject.studentLeaderName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="px-2 py-0.5 rounded-sm bg-blue-50 text-blue-800 text-[11px] font-bold">
                        {currentProject.status}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                      {currentProject.title}
                    </h2>
                  </div>

                  {currentProject.status !== 'Completed' && (
                    <button
                      onClick={handleMarkProjectComplete}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors shrink-0"
                    >
                      <Award className="w-3.5 h-3.5" />
                      Mark Project Completed
                    </button>
                  )}
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs text-slate-600 mb-1.5 font-medium">
                    <span>Approved Milestones Completion</span>
                    <span className="font-bold text-emerald-700 tabular-nums">
                      {currentProject.progressPercent}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${currentProject.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Team roster */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    Student Team Members:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentProject.team.map((m) => (
                      <div
                        key={m.id}
                        className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center gap-2"
                      >
                        <span className="font-bold text-slate-800">{m.name}</span>
                        {m.role === 'Leader' && (
                          <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded-xs font-bold">
                            Leader
                          </span>
                        )}
                        <span className="text-slate-500 text-[11px]">({m.department})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Proposal Review Section */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      Student Technical Proposal
                    </h3>
                    <p className="text-xs text-slate-500">
                      Evaluate abstract, methodology, and deliverables before development phase
                    </p>
                  </div>

                  {currentProject.proposal && (
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                        currentProject.proposal.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : currentProject.proposal.status === 'Needs Revision'
                          ? 'bg-red-50 text-red-800 border border-red-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {currentProject.proposal.status}
                    </span>
                  )}
                </div>

                {!currentProject.proposal ? (
                  <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-500 italic">
                    The student team has not submitted their formal proposal yet.
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3 text-xs">
                    <div>
                      <strong className="text-sm font-bold text-slate-900 block mb-1">
                        {currentProject.proposal.title}
                      </strong>
                      <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                        {currentProject.proposal.abstract}
                      </p>
                    </div>

                    <div>
                      <strong className="text-slate-900 block mb-1 font-semibold">Methodology:</strong>
                      <p className="text-slate-600 whitespace-pre-line">
                        {currentProject.proposal.methodology}
                      </p>
                    </div>

                    <div>
                      <strong className="text-slate-900 block mb-1 font-semibold">Declared Tech Stack:</strong>
                      <div className="flex flex-wrap gap-1">
                        {currentProject.proposal.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded-sm bg-white border border-slate-200 text-slate-700 text-[11px]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {currentProject.proposal.fileName && (
                      <div className="text-xs text-blue-700 font-medium flex items-center gap-1.5 pt-1">
                        <FileCode className="w-4 h-4 text-blue-600" />
                        <span>Attached Proposal Document: {currentProject.proposal.fileName}</span>
                      </div>
                    )}

                    {/* Proposal Evaluation Controls */}
                    {currentProject.proposal.status !== 'Approved' && (
                      <div className="pt-3 border-t border-slate-200/80 space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Staff Feedback / Required Revisions:
                          </label>
                          <textarea
                            rows={2}
                            value={proposalFeedback}
                            onChange={(e) => setProposalFeedback(e.target.value)}
                            placeholder="Add guidance or revision notes for the student team..."
                            className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          />
                        </div>

                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => handleReviewProposal('Needs Revision')}
                            className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs rounded-lg transition-colors"
                          >
                            Request Proposal Revisions
                          </button>
                          <button
                            onClick={() => handleReviewProposal('Approved')}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-2xs transition-colors flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approve Proposal
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Milestones & Deliverables Evaluation */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      Milestones &amp; Work Submissions ({currentProject.milestones.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Create project milestone targets, inspect code uploads, and approve progress
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddMilestoneModal(true)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Milestone
                  </button>
                </div>

                {currentProject.milestones.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-xl text-xs text-slate-500">
                    No milestones defined yet. Click "Add Milestone" to set up progress checkpoints.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentProject.milestones.map((ms, index) => {
                      const isApproved = ms.status === 'Approved';
                      const latestSub = ms.submissions[0];

                      return (
                        <div
                          key={ms.id}
                          className={`p-4 rounded-xl border transition-all ${
                            isApproved
                              ? 'bg-emerald-50/40 border-emerald-200'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                                <span className="font-bold text-slate-800">Milestone {index + 1}</span>
                                <span aria-hidden="true">·</span>
                                <span>Due: {ms.dueDate}</span>
                              </div>
                              <h4 className="text-sm font-bold text-slate-900">{ms.title}</h4>
                              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                {ms.description}
                              </p>
                            </div>

                            <span
                              className={`px-2.5 py-1 text-xs font-bold rounded-md self-start sm:self-auto ${
                                isApproved
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ms.status === 'Submitted'
                                  ? 'bg-blue-100 text-blue-800'
                                  : ms.status === 'Needs Revision'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {ms.status}
                            </span>
                          </div>

                          {/* Submission Details & Review Action */}
                          {latestSub ? (
                            <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
                              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-700 space-y-2">
                                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                                  <span>
                                    Uploaded: {new Date(latestSub.submittedAt).toLocaleDateString()}
                                  </span>
                                  {latestSub.fileName && (
                                    <span className="font-mono text-blue-600 flex items-center gap-1">
                                      <FileCode className="w-3.5 h-3.5" />
                                      {latestSub.fileName}
                                    </span>
                                  )}
                                </div>

                                <p className="leading-relaxed">
                                  <strong className="block text-[11px] text-slate-900 mb-0.5">
                                    Student Submission Summary:
                                  </strong>
                                  {latestSub.summary}
                                </p>

                                {latestSub.repoUrl && (
                                  <div className="pt-1">
                                    <a
                                      href={latestSub.repoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline inline-flex items-center gap-1 font-medium"
                                    >
                                      Inspect Code Repository <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </div>
                                )}
                              </div>

                              {/* Evaluation Form */}
                              {!isApproved && (
                                <div className="pt-1 space-y-2">
                                  <label className="block text-xs font-semibold text-slate-700">
                                    Staff Evaluation / Feedback Notes:
                                  </label>
                                  <input
                                    type="text"
                                    value={
                                      activeSubmissionId === latestSub.id ? milestoneFeedback : ''
                                    }
                                    onChange={(e) => {
                                      setActiveSubmissionId(latestSub.id);
                                      setMilestoneFeedback(e.target.value);
                                    }}
                                    placeholder="Add constructive notes or revision feedback..."
                                    className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                  />

                                  <div className="flex items-center gap-2 justify-end pt-1">
                                    <button
                                      onClick={() =>
                                        handleReviewMilestone(ms.id, latestSub.id, 'Needs Revision')
                                      }
                                      className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs rounded-lg transition-colors"
                                    >
                                      Request Revision
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleReviewMilestone(ms.id, latestSub.id, 'Approved')
                                      }
                                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-2xs transition-colors flex items-center gap-1"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      Approve Milestone Work
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-400 mt-2 italic">
                              Awaiting student submission for this milestone.
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CREATE MILESTONE MODAL */}
      {showAddMilestoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add Project Milestone</h3>
            <p className="text-xs text-slate-500 mb-4">
              Define check-in deliverables and evaluation target date
            </p>

            <form onSubmit={handleAddMilestone} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Milestone Title</label>
                <input
                  type="text"
                  required
                  value={msTitle}
                  onChange={(e) => setMsTitle(e.target.value)}
                  placeholder="e.g. Milestone 2: ONNX Quantization & Edge Benchmarking"
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deliverable Requirements</label>
                <textarea
                  required
                  rows={3}
                  value={msDescription}
                  onChange={(e) => setMsDescription(e.target.value)}
                  placeholder="Describe what code, models, and test logs must be delivered..."
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={msDueDate}
                  onChange={(e) => setMsDueDate(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMilestoneModal(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Create Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
