import React, { useState } from 'react';
import {
  FolderGit2,
  Users,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Upload,
  ExternalLink,
  ChevronRight,
  Send,
  MessageSquare,
  FileCode,
  Download,
  Award
} from 'lucide-react';
import {
  ActiveProject,
  Milestone,
  MilestoneSubmission,
  ProjectProposal,
  ProjectRequest,
  StudentProfile,
  TeamMember
} from '../../types';
import { StorageEngine } from '../../services/storage';

interface StudentProjectsProps {
  student: StudentProfile;
  projects: ActiveProject[];
  requests: ProjectRequest[];
  onRefreshData: () => void;
  onSelectTab: (tab: string) => void;
}

export const StudentProjects: React.FC<StudentProjectsProps> = ({
  student,
  projects,
  requests,
  onRefreshData,
  onSelectTab,
}) => {
  const [selectedSubTab, setSelectedSubTab] = useState<'active' | 'requests' | 'completed'>('active');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(
    projects.length > 0 ? projects[0].id : null
  );

  // Modal States
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  // Add Member Form
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberDept, setMemberDept] = useState(student.department);
  const [memberRoll, setMemberRoll] = useState('');
  const [memberError, setMemberError] = useState<string | null>(null);

  // Proposal Form
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalAbstract, setProposalAbstract] = useState('');
  const [proposalMethodology, setProposalMethodology] = useState('');
  const [proposalTechStack, setProposalTechStack] = useState('React, Python, PyTorch, FastAPI');
  const [proposalDeliverables, setProposalDeliverables] = useState(
    'Architecture document, Working code repo, Validation benchmark, Final defense presentation'
  );
  const [proposalFileName, setProposalFileName] = useState('');
  const [proposalFileData, setProposalFileData] = useState<string | undefined>(undefined);

  // Milestone Submission Form
  const [submissionSummary, setSubmissionSummary] = useState('');
  const [submissionRepo, setSubmissionRepo] = useState('');
  const [submissionDemo, setSubmissionDemo] = useState('');
  const [submissionFileName, setSubmissionFileName] = useState('');
  const [submissionFileData, setSubmissionFileData] = useState<string | undefined>(undefined);
  const [submissionFileSize, setSubmissionFileSize] = useState<number>(0);

  const activeProjects = projects.filter((p) => p.status !== 'Completed');
  const completedProjects = projects.filter((p) => p.status === 'Completed');
  const currentProject = projects.find((p) => p.id === activeProjectId) || activeProjects[0] || null;

  // Handle Real File Selection for Milestone
  const handleMilestoneFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSubmissionFileName(file.name);
      setSubmissionFileSize(file.size);
      const reader = new FileReader();
      reader.onload = () => {
        setSubmissionFileData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Real File Selection for Proposal
  const handleProposalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProposalFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setProposalFileData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Teammate
  const handleAddTeammate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) return;

    if (!memberName.trim() || !memberEmail.trim()) {
      setMemberError('Teammate name and valid university email are required.');
      return;
    }

    const newMember: TeamMember = {
      id: `member_${Date.now()}`,
      name: memberName.trim(),
      email: memberEmail.trim().toLowerCase(),
      role: 'Member',
      department: memberDept.trim(),
      rollNumber: memberRoll.trim(),
    };

    const success = StorageEngine.addTeamMember(currentProject.id, newMember);
    if (!success) {
      setMemberError('A teammate with this email or ID already exists in the project.');
      return;
    }

    setShowAddMemberModal(false);
    setMemberName('');
    setMemberEmail('');
    setMemberRoll('');
    setMemberError(null);
    onRefreshData();
  };

  // Remove Teammate with Confirmation
  const handleRemoveTeammate = (memberId: string, name: string) => {
    if (!currentProject) return;
    if (confirm(`Are you sure you want to remove teammate "${name}" from the project?`)) {
      StorageEngine.removeTeamMember(currentProject.id, memberId);
      onRefreshData();
    }
  };

  // Submit Formal Proposal
  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) return;

    const proposal: ProjectProposal = {
      id: `prop_${Date.now()}`,
      title: proposalTitle.trim() || `${currentProject.title} Technical Proposal`,
      abstract: proposalAbstract.trim(),
      methodology: proposalMethodology.trim(),
      techStack: proposalTechStack.split(',').map((s) => s.trim()).filter(Boolean),
      expectedDeliverables: proposalDeliverables.split(',').map((s) => s.trim()).filter(Boolean),
      fileName: proposalFileName || 'Project_Formal_Proposal.pdf',
      documentUrl: proposalFileData,
      submittedAt: new Date().toISOString(),
      status: 'Submitted',
    };

    StorageEngine.submitProposal(currentProject.id, proposal);
    setShowProposalModal(false);
    onRefreshData();
  };

  // Submit Milestone Deliverable
  const handleSubmitMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject || !selectedMilestone) return;

    const submission: MilestoneSubmission = {
      id: `sub_${Date.now()}`,
      milestoneId: selectedMilestone.id,
      submittedAt: new Date().toISOString(),
      summary: submissionSummary.trim(),
      repoUrl: submissionRepo.trim() || undefined,
      demoUrl: submissionDemo.trim() || undefined,
      fileName: submissionFileName || 'milestone_deliverable_archive.zip',
      fileData: submissionFileData,
      fileSize: submissionFileSize || 120000,
      status: 'Submitted',
      revisionCount: selectedMilestone.submissions.length,
    };

    StorageEngine.submitMilestoneWork(currentProject.id, selectedMilestone.id, submission);
    setShowSubmissionModal(false);
    setSubmissionSummary('');
    setSubmissionRepo('');
    setSubmissionDemo('');
    setSubmissionFileName('');
    setSubmissionFileData(undefined);
    onRefreshData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header and Sub-Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            My Projects &amp; Workspaces
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage your project team, submit proposals, track milestones, and deliver work
          </p>
        </div>

        {/* Sub-tab segmented control */}
        <div className="flex bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setSelectedSubTab('active')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedSubTab === 'active'
                ? 'bg-white text-blue-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Projects ({activeProjects.length})
          </button>
          <button
            onClick={() => setSelectedSubTab('requests')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedSubTab === 'requests'
                ? 'bg-white text-blue-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Requests ({requests.length})
          </button>
          <button
            onClick={() => setSelectedSubTab('completed')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedSubTab === 'completed'
                ? 'bg-white text-blue-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed ({completedProjects.length})
          </button>
        </div>
      </div>

      {/* VIEW 1: ACTIVE PROJECTS WORKSPACE */}
      {selectedSubTab === 'active' && (
        <>
          {activeProjects.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <FolderGit2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">No Active Projects Yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
                Explore available problem statements or track pending mentor requests.
              </p>
              <button
                onClick={() => onSelectTab('ideas')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Find a Problem Statement
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Project Selector Sidebar (Desktop) */}
              <div className="lg:col-span-1 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block px-1">
                  Enrolled Projects
                </span>
                {activeProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActiveProjectId(p.id)}
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
                    <p className="text-[11px] text-slate-500 mt-1">Mentor: {p.staffName}</p>
                  </button>
                ))}
              </div>

              {/* Main Workspace Display */}
              {currentProject && (
                <div className="lg:col-span-3 space-y-6">
                  {/* Project Overview Card */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                          <span className="font-semibold text-blue-700">{currentProject.domain}</span>
                          <span aria-hidden="true">·</span>
                          <span>Faculty Mentor: {currentProject.staffName}</span>
                          <span aria-hidden="true">·</span>
                          <span className="px-2 py-0.5 rounded-sm bg-blue-50 text-blue-800 text-[11px] font-bold">
                            {currentProject.status}
                          </span>
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                          {currentProject.title}
                        </h2>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-600 mb-1.5 font-medium">
                        <span>Overall Project Milestone Completion</span>
                        <span className="font-bold text-emerald-700 tabular-nums">
                          {currentProject.progressPercent}% Completed
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${currentProject.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Team Members Management Card */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          Project Team ({currentProject.team.length} Members)
                        </h3>
                        <p className="text-xs text-slate-500">
                          Collegiate collaborators working on this project
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setMemberError(null);
                          setShowAddMemberModal(true);
                        }}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Teammate
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {currentProject.team.map((member) => (
                        <div
                          key={member.id}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
                                {member.name}
                              </span>
                              {member.role === 'Leader' && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-xs bg-blue-600 text-white">
                                  Lead
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 truncate max-w-[150px]">
                              {member.email}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {member.department} {member.rollNumber ? `· ${member.rollNumber}` : ''}
                            </p>
                          </div>

                          {member.role !== 'Leader' && (
                            <button
                              onClick={() => handleRemoveTeammate(member.id, member.name)}
                              title="Remove Teammate"
                              className="text-slate-400 hover:text-red-600 p-1 rounded-md transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Project Proposal Card */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          Formal Project Proposal
                        </h3>
                        <p className="text-xs text-slate-500">
                          Technical abstract, methodology, and deliverables reviewed by mentor
                        </p>
                      </div>

                      {currentProject.proposal ? (
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                            currentProject.proposal.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : currentProject.proposal.status === 'Needs Revision'
                              ? 'bg-red-50 text-red-800 border border-red-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          Proposal: {currentProject.proposal.status}
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setProposalTitle(`${currentProject.title} Research Proposal`);
                            setShowProposalModal(true);
                          }}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Submit Proposal
                        </button>
                      )}
                    </div>

                    {currentProject.proposal ? (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3 text-xs">
                        <div>
                          <span className="font-bold text-slate-900 block text-xs">
                            {currentProject.proposal.title}
                          </span>
                          <p className="text-slate-600 mt-1 leading-relaxed whitespace-pre-line">
                            {currentProject.proposal.abstract}
                          </p>
                        </div>

                        <div>
                          <strong className="text-slate-800 block mb-1">Methodology:</strong>
                          <p className="text-slate-600 whitespace-pre-line">
                            {currentProject.proposal.methodology}
                          </p>
                        </div>

                        {currentProject.proposal.staffFeedback && (
                          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900">
                            <span className="font-bold flex items-center gap-1.5 mb-1 text-xs">
                              <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                              Mentor Feedback
                            </span>
                            <p className="leading-relaxed">{currentProject.proposal.staffFeedback}</p>
                          </div>
                        )}

                        {currentProject.proposal.status === 'Needs Revision' && (
                          <div className="pt-2">
                            <button
                              onClick={() => setShowProposalModal(true)}
                              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
                            >
                              Submit Revised Proposal
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                        <div>
                          <p className="font-semibold">Action Required: Proposal Submission</p>
                          <p className="mt-0.5 leading-relaxed">
                            Your request to work on this problem statement was approved. Please
                            submit your formal project proposal so faculty staff can review and
                            authorize progression.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Milestones & Deliverables Card */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        Project Milestones &amp; Submissions
                      </h3>
                      <p className="text-xs text-slate-500">
                        Deliver required code, documents, and prototypes for each review cycle
                      </p>
                    </div>

                    {currentProject.milestones.length === 0 ? (
                      <p className="text-xs text-slate-500 italic p-4 bg-slate-50 rounded-xl">
                        No milestones generated yet. Faculty staff will assign milestones upon proposal approval.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {currentProject.milestones.map((ms, index) => {
                          const isApproved = ms.status === 'Approved';
                          const isSubmitted = ms.status === 'Submitted';
                          const needsRevision = ms.status === 'Needs Revision';

                          return (
                            <div
                              key={ms.id}
                              className={`p-4 rounded-xl border transition-all ${
                                isApproved
                                  ? 'bg-emerald-50/40 border-emerald-200'
                                  : needsRevision
                                  ? 'bg-red-50/40 border-red-200'
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

                                <div className="flex items-center gap-2 shrink-0">
                                  <span
                                    className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                                      isApproved
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : isSubmitted
                                        ? 'bg-blue-100 text-blue-800'
                                        : needsRevision
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-slate-100 text-slate-700'
                                    }`}
                                  >
                                    {ms.status}
                                  </span>

                                  {!isApproved && (
                                    <button
                                      onClick={() => {
                                        setSelectedMilestone(ms);
                                        setShowSubmissionModal(true);
                                      }}
                                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs"
                                    >
                                      <Upload className="w-3.5 h-3.5" />
                                      {ms.submissions.length > 0 ? 'Resubmit' : 'Submit Work'}
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Latest Submission Feedback */}
                              {ms.submissions.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                                  <div className="flex items-center justify-between text-xs text-slate-500">
                                    <span>
                                      Latest upload: {new Date(ms.submissions[0].submittedAt).toLocaleDateString()}
                                    </span>
                                    {ms.submissions[0].fileName && (
                                      <span className="font-mono text-[11px] text-blue-600 flex items-center gap-1">
                                        <FileCode className="w-3 h-3" />
                                        {ms.submissions[0].fileName}
                                      </span>
                                    )}
                                  </div>

                                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                                    <strong className="block text-[11px] text-slate-900 mb-0.5">Summary of work:</strong>
                                    {ms.submissions[0].summary}
                                  </p>

                                  {ms.submissions[0].staffFeedback && (
                                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                                      <strong className="block text-[11px] text-emerald-950 mb-0.5 flex items-center gap-1">
                                        <MessageSquare className="w-3 h-3 text-emerald-700" />
                                        Faculty Evaluation Feedback:
                                      </strong>
                                      {ms.submissions[0].staffFeedback}
                                    </div>
                                  )}
                                </div>
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
        </>
      )}

      {/* VIEW 2: REQUESTS STATUS TRACKER */}
      {selectedSubTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Your Collaboration Requests
            </h2>
            <button
              onClick={() => onSelectTab('ideas')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Browse more problem statements →
            </button>
          </div>

          {requests.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-2xl border border-slate-200">
              <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No Requests Submitted Yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Explore project ideas in the Ideas tab and submit a collaboration request.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <span className="font-semibold text-blue-700">{req.domain}</span>
                        <span aria-hidden="true">·</span>
                        <span>Submitted {new Date(req.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{req.problemTitle}</h3>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-md text-xs font-bold self-start sm:self-auto ${
                        req.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'Declined'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs">
                    <strong className="block text-[11px] text-slate-800 mb-0.5">Your Motivation Pitch:</strong>
                    <p className="text-slate-600 leading-relaxed">{req.pitchNote}</p>
                  </div>

                  {req.staffNote && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-900">
                      <strong className="block text-[11px] text-blue-950 mb-0.5 flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                        Faculty Mentor Response:
                      </strong>
                      <p className="leading-relaxed">{req.staffNote}</p>
                    </div>
                  )}

                  {req.status === 'Approved' && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => setSelectedSubTab('active')}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        Open Active Project Workspace →
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: COMPLETED PROJECTS ARCHIVE */}
      {selectedSubTab === 'completed' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Graduated &amp; Completed Capstone Projects
          </h2>

          {completedProjects.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-2xl border border-slate-200">
              <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No Completed Projects Yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Once all assigned project milestones are submitted and approved by your faculty
                mentor, your completed work will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedProjects.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl border border-emerald-200 p-5 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-800">{p.domain}</span>
                    <span className="px-2 py-0.5 rounded-sm bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                      COMPLETED
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
                  <p className="text-xs text-slate-600">
                    Faculty Mentor: {p.staffName} · {p.team.length} Team Members
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>100% Milestones Approved</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Certified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: ADD TEAMMATE */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add Team Member</h3>
            <p className="text-xs text-slate-500 mb-4">
              Invite a student peer to collaborate on {currentProject?.title}
            </p>

            {memberError && (
              <div className="p-2.5 mb-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{memberError}</span>
              </div>
            )}

            <form onSubmit={handleAddTeammate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Teammate Full Name</label>
                <input
                  type="text"
                  required
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="e.g. Jordan Lee"
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">University Email</label>
                <input
                  type="email"
                  required
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="jordan.lee@university.edu"
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={memberDept}
                    onChange={(e) => setMemberDept(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Roll / Student ID</label>
                  <input
                    type="text"
                    value={memberRoll}
                    onChange={(e) => setMemberRoll(e.target.value)}
                    placeholder="BM23-0114"
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Add to Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: SUBMIT PROPOSAL */}
      {showProposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full p-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-1">Formal Project Proposal</h3>
            <p className="text-xs text-slate-500 mb-4">
              Submit technical proposal for {currentProject?.title}
            </p>

            <form onSubmit={handleSubmitProposal} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Proposal Title</label>
                <input
                  type="text"
                  required
                  value={proposalTitle}
                  onChange={(e) => setProposalTitle(e.target.value)}
                  placeholder="e.g. EdgeRetina: Lightweight Quantized Vision Transformer"
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Abstract &amp; Problem Framing</label>
                <textarea
                  required
                  rows={3}
                  value={proposalAbstract}
                  onChange={(e) => setProposalAbstract(e.target.value)}
                  placeholder="Outline the specific technical bottleneck and target solution..."
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Proposed Methodology &amp; Architecture</label>
                <textarea
                  required
                  rows={3}
                  value={proposalMethodology}
                  onChange={(e) => setProposalMethodology(e.target.value)}
                  placeholder="Describe data pipelines, models, algorithmic steps, or system design..."
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  required
                  value={proposalTechStack}
                  onChange={(e) => setProposalTechStack(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deliverables</label>
                <input
                  type="text"
                  required
                  value={proposalDeliverables}
                  onChange={(e) => setProposalDeliverables(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              {/* Real document file upload */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Upload Proposal Specification PDF / Document
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.zip"
                  onChange={handleProposalFileChange}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {proposalFileName && (
                  <p className="text-[11px] text-emerald-700 font-medium mt-1">
                    ✓ Attached: {proposalFileName}
                  </p>
                )}
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProposalModal(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit to Mentor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: SUBMIT MILESTONE WORK */}
      {showSubmissionModal && selectedMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Submit Work for {selectedMilestone.title}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Due Date: {selectedMilestone.dueDate}
            </p>

            <form onSubmit={handleSubmitMilestone} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Summary of Implementation &amp; Results
                </label>
                <textarea
                  required
                  rows={4}
                  value={submissionSummary}
                  onChange={(e) => setSubmissionSummary(e.target.value)}
                  placeholder="Detail what was built, benchmarks achieved, issues resolved..."
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Code Repository / Branch URL
                </label>
                <input
                  type="url"
                  value={submissionRepo}
                  onChange={(e) => setSubmissionRepo(e.target.value)}
                  placeholder="https://github.com/university/project-milestone"
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Live Demo / Video Demonstration URL (Optional)
                </label>
                <input
                  type="url"
                  value={submissionDemo}
                  onChange={(e) => setSubmissionDemo(e.target.value)}
                  placeholder="https://demo.projectconnect.edu"
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              {/* Real File Upload */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Upload Deliverable Archive / Report (ZIP, PDF, Code)
                </label>
                <input
                  type="file"
                  onChange={handleMilestoneFileChange}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {submissionFileName && (
                  <p className="text-[11px] text-emerald-700 font-medium mt-1">
                    ✓ File attached: {submissionFileName} ({(submissionFileSize / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSubmissionModal(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Milestone Work
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
