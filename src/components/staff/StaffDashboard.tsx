import React from 'react';
import {
  FileSpreadsheet,
  Users,
  Inbox,
  Clock,
  ArrowRight,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Briefcase,
  Layers,
  Sparkles
} from 'lucide-react';
import { ActiveProject, ProjectProblem, ProjectRequest, StaffProfile } from '../../types';

interface StaffDashboardProps {
  staff: StaffProfile;
  problems: ProjectProblem[];
  requests: ProjectRequest[];
  projects: ActiveProject[];
  onSelectTab: (tab: string) => void;
  onApproveRequest: (requestId: string) => void;
  onDeclineRequest: (requestId: string) => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  staff,
  problems,
  requests,
  projects,
  onSelectTab,
  onApproveRequest,
  onDeclineRequest,
}) => {
  const staffProblems = problems.filter((p) => p.staffId === staff.id);
  const staffRequests = requests.filter((r) => r.staffId === staff.id);
  const pendingRequests = staffRequests.filter((r) => r.status === 'Pending');
  const staffProjects = projects.filter((p) => p.staffId === staff.id);
  const activeProjects = staffProjects.filter((p) => p.status !== 'Completed');

  // Count submissions awaiting staff evaluation
  const pendingMilestoneReviews = staffProjects.reduce((acc, p) => {
    return (
      acc +
      p.milestones.filter(
        (m) => m.status === 'Submitted' && m.submissions.some((s) => s.status === 'Submitted')
      ).length
    );
  }, 0);

  const pendingProposalReviews = staffProjects.filter(
    (p) => p.proposal?.status === 'Submitted'
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Faculty Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-sm border border-slate-800">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>{staff.department}</span>
            <span aria-hidden="true">·</span>
            <span>{staff.designation}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {staff.fullName}
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Faculty Mentorship &amp; Project Supervision Portal. Review incoming student team
            requests, approve technical proposals, assign milestones, and grade milestone deliverables.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              onClick={() => onSelectTab('problems')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Publish New Problem Statement
            </button>
            <button
              onClick={() => onSelectTab('requests')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Inbox className="w-4 h-4" />
              Review Student Requests ({pendingRequests.length})
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Published Problems</span>
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">
            {staffProblems.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Under your supervision</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Pending Requests</span>
            <Inbox className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">
            {pendingRequests.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Need approval / decline</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Active Student Teams</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">
            {activeProjects.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">In-progress projects</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Submissions to Grade</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">
            {pendingMilestoneReviews + pendingProposalReviews}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Proposals &amp; milestones</p>
        </div>
      </div>

      {/* Main Grid: Pending Action Items & Active Supervised Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Action Required Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Action Required Queue</h2>
              <p className="text-xs text-slate-500">
                Incoming student project requests awaiting your review
              </p>
            </div>
            <button
              onClick={() => onSelectTab('requests')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              View all requests <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">All Requests Up to Date</h4>
              <p className="text-xs text-slate-500 mt-1">
                You have reviewed all student requests for your problem statements.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.slice(0, 3).map((req) => (
                <div
                  key={req.id}
                  className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
                        <span className="font-semibold text-blue-700">{req.domain}</span>
                        <span aria-hidden="true">·</span>
                        <span>{req.studentDepartment}</span>
                        <span aria-hidden="true">·</span>
                        <span>{req.studentYear}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{req.studentName}</h4>
                      <p className="text-xs text-slate-600">
                        Applying for: <strong>{req.problemTitle}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onApproveRequest(req.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => onDeclineRequest(req.id)}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Decline
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 leading-relaxed">
                    <strong className="block text-[11px] text-slate-900 mb-0.5">Student Motivation Pitch:</strong>
                    {req.pitchNote}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Active Supervised Projects */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Supervised Projects</h2>
            <button
              onClick={() => onSelectTab('projects')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Manage all →
            </button>
          </div>

          {activeProjects.length === 0 ? (
            <div className="p-6 bg-white rounded-xl border border-slate-200 text-center">
              <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">No Active Projects</p>
              <p className="text-[11px] text-slate-500 mt-1 mb-3">
                Approve student requests to initiate active project supervision.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-blue-700">{proj.domain}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-sm bg-blue-50 text-blue-800 font-bold">
                      {proj.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {proj.title}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Lead: {proj.studentLeaderName} · {proj.team.length} members
                  </p>

                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-600 mb-1 font-medium">
                      <span>Milestones Approved</span>
                      <span className="tabular-nums font-semibold text-emerald-700">
                        {proj.progressPercent}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-1.5 rounded-full transition-all"
                        style={{ width: `${proj.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => onSelectTab('projects')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Inspect Project &amp; Grade Work →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
