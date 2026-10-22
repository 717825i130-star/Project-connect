import React, { useState } from 'react';
import {
  X,
  Calendar,
  Users,
  Target,
  Sparkles,
  Building,
  CheckCircle2,
  Send,
  AlertCircle
} from 'lucide-react';
import { ProjectProblem, StudentProfile } from '../../types';
import { StorageEngine } from '../../services/storage';

interface ProjectDetailModalProps {
  problem: ProjectProblem | null;
  student: StudentProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestSubmitted: () => void;
  existingRequestStatus?: 'Pending' | 'Approved' | 'Declined' | null;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  problem,
  student,
  isOpen,
  onClose,
  onRequestSubmitted,
  existingRequestStatus,
}) => {
  const [pitchNote, setPitchNote] = useState('');
  const [proposedTeamSize, setProposedTeamSize] = useState(2);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !problem) return null;

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    if (!pitchNote.trim()) {
      setErrorMsg('Please write a brief statement or pitch describing your approach and motivation.');
      return;
    }

    setIsSubmitting(true);
    try {
      StorageEngine.saveRequest({
        id: `req_${Date.now()}`,
        problemId: problem.id,
        problemTitle: problem.title,
        domain: problem.domain,
        studentId: student.id,
        studentName: student.fullName,
        studentDepartment: student.department,
        studentYear: student.year,
        studentSkills: student.skills,
        studentAvatar: student.avatarUrl,
        staffId: problem.staffId,
        pitchNote: pitchNote.trim(),
        proposedTeamSize,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setShowRequestForm(false);
      setPitchNote('');
      onRequestSubmitted();
      onClose();
    } catch (err) {
      setErrorMsg('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const difficultyColors = {
    Beginner: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    Intermediate: 'text-blue-700 bg-blue-50 border-blue-200',
    Advanced: 'text-purple-700 bg-purple-50 border-purple-200',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5 font-medium">
              <span>{problem.domain}</span>
              <span aria-hidden="true">·</span>
              <span className={`px-2 py-0.5 rounded-sm border text-[11px] font-semibold ${difficultyColors[problem.difficulty]}`}>
                {problem.difficulty}
              </span>
              <span aria-hidden="true">·</span>
              <span>Deadline: {problem.deadline}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {problem.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-sm text-slate-700">
          {/* Mentor Information */}
          <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-200 shrink-0">
              {problem.staffAvatar ? (
                <img
                  src={problem.staffAvatar}
                  alt={problem.staffName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-700 font-bold text-sm">
                  {problem.staffName.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Faculty Mentor / Supervisor</p>
              <h4 className="font-semibold text-slate-900 text-sm">{problem.staffName}</h4>
              <p className="text-xs text-slate-600">{problem.staffDepartment}</p>
            </div>
          </div>

          {/* Problem Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Problem Statement &amp; Context
            </h3>
            <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">
              {problem.description}
            </p>
          </div>

          {/* Expected Solution */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Expected Solution &amp; Deliverables
            </h3>
            <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">
              {problem.expectedSolution}
            </p>
          </div>

          {/* Required Skills */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Required Technical Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {problem.requiredSkills.map((skill) => {
                const studentHasSkill =
                  student?.skills.some((s) => s.toLowerCase() === skill.toLowerCase()) || false;
                return (
                  <span
                    key={skill}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md font-medium border ${
                      studentHasSkill
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {studentHasSkill && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                    {skill}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Team Capacity & Specs */}
          <div className="flex items-center gap-6 pt-2 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-slate-400" />
              <span>Max Team Size: <strong>{problem.maxTeamSize} students</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Proposal Target: <strong>{problem.deadline}</strong></span>
            </div>
          </div>

          {/* Student Request Form or Status */}
          {student && (
            <div className="pt-4 border-t border-slate-100">
              {existingRequestStatus ? (
                <div
                  className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-semibold ${
                    existingRequestStatus === 'Approved'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : existingRequestStatus === 'Declined'
                      ? 'bg-red-50 text-red-800 border-red-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Your Request Status: {existingRequestStatus}</span>
                  </div>
                  {existingRequestStatus === 'Approved' && (
                    <span className="text-[11px] text-emerald-700 font-normal">
                      Active under My Projects
                    </span>
                  )}
                </div>
              ) : !showRequestForm ? (
                <button
                  onClick={() => setShowRequestForm(true)}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Request to Work on This Project
                </button>
              ) : (
                <form onSubmit={handleSubmitRequest} className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Submit Project Collaboration Pitch
                  </h4>

                  {errorMsg && (
                    <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Statement of Motivation &amp; Technical Approach
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={pitchNote}
                      onChange={(e) => setPitchNote(e.target.value)}
                      placeholder="Describe your background, proposed approach, and why your team is well-suited for this problem..."
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Proposed Team Size (Max {problem.maxTeamSize})
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={problem.maxTeamSize}
                      value={proposedTeamSize}
                      onChange={(e) => setProposedTeamSize(parseInt(e.target.value) || 1)}
                      className="w-28 p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {isSubmitting ? 'Sending Request...' : 'Send Request to Mentor'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRequestForm(false)}
                      className="px-3 py-2 bg-white text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg text-xs font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
