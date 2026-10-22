import React, { useState } from 'react';
import {
  Inbox,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  Search,
  Filter,
  User,
  GraduationCap
} from 'lucide-react';
import { ProjectRequest, StaffProfile } from '../../types';
import { StorageEngine } from '../../services/storage';

interface StaffRequestsProps {
  staff: StaffProfile;
  requests: ProjectRequest[];
  onRefreshData: () => void;
}

export const StaffRequests: React.FC<StaffRequestsProps> = ({
  staff,
  requests,
  onRefreshData,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Approved' | 'Declined'>('Pending');
  const [feedbackNotes, setFeedbackNotes] = useState<{ [reqId: string]: string }>({});
  const [actionDone, setActionDone] = useState<string | null>(null);

  // Filter requests for this staff member
  const staffRequests = requests.filter((r) => r.staffId === staff.id);

  const filteredRequests = staffRequests.filter((r) => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.problemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.studentDepartment.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'All' || r.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleApprove = (req: ProjectRequest) => {
    const note =
      feedbackNotes[req.id] ||
      'Request approved. Welcome to the project! Please form your team and submit the formal proposal.';
    StorageEngine.updateRequestStatus(req.id, 'Approved', note);
    setActionDone(`Approved request from ${req.studentName}`);
    setTimeout(() => setActionDone(null), 3000);
    onRefreshData();
  };

  const handleDecline = (req: ProjectRequest) => {
    const note =
      feedbackNotes[req.id] ||
      'Thank you for your interest. Unfortunately, team capacity has been reached or prerequisites are insufficient.';
    StorageEngine.updateRequestStatus(req.id, 'Declined', note);
    setActionDone(`Declined request from ${req.studentName}`);
    setTimeout(() => setActionDone(null), 3000);
    onRefreshData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Student Collaboration Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Evaluate student motivation, team size, and skill readiness for your problem statements
          </p>
        </div>

        {actionDone && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 animate-fade-in self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {actionDone}
          </span>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student name or problem..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-medium">
          <span className="text-slate-500 mr-1">Status:</span>
          {(['Pending', 'Approved', 'Declined', 'All'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as any)}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterStatus === status
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No Requests Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            There are currently no student requests matching "{filterStatus}" status.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const isPending = req.status === 'Pending';

            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4"
              >
                {/* Request Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-200 ring-2 ring-blue-500/20 shrink-0">
                      {req.studentAvatar ? (
                        <img
                          src={req.studentAvatar}
                          alt={req.studentName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-700 font-bold text-sm">
                          {req.studentName.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
                        <span className="font-semibold text-slate-900">{req.studentName}</span>
                        <span aria-hidden="true">·</span>
                        <span>{req.studentDepartment}</span>
                        <span aria-hidden="true">·</span>
                        <span>{req.studentYear}</span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900">
                        Applying for: <span className="text-blue-700">{req.problemTitle}</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Domain: {req.domain} · Proposed Team Size: {req.proposedTeamSize}
                      </p>
                    </div>
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

                {/* Pitch Statement */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                  <strong className="block text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1">
                    Student Approach &amp; Motivation:
                  </strong>
                  <p>{req.pitchNote}</p>

                  {/* Skills tags */}
                  {req.studentSkills && req.studentSkills.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] text-slate-500 font-medium">Applicant Skills:</span>
                      {req.studentSkills.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-sm bg-white border border-slate-200 text-slate-700 text-[10px] font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mentor Feedback / Action Form */}
                {isPending ? (
                  <div className="pt-2 space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mentor Feedback / Onboarding Instructions (Optional):
                      </label>
                      <input
                        type="text"
                        value={feedbackNotes[req.id] || ''}
                        onChange={(e) =>
                          setFeedbackNotes({ ...feedbackNotes, [req.id]: e.target.value })
                        }
                        placeholder="Add guidance or instructions for the student team..."
                        className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>

                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => handleDecline(req)}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Decline Request
                      </button>
                      <button
                        onClick={() => handleApprove(req)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approve &amp; Authorize Workspace
                      </button>
                    </div>
                  </div>
                ) : (
                  req.staffNote && (
                    <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900">
                      <strong className="block text-[11px] text-blue-950 mb-0.5 flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                        Your Review Response:
                      </strong>
                      <p className="leading-relaxed">{req.staffNote}</p>
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
