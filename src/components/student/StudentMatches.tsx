import React from 'react';
import {
  Sparkles,
  TrendingUp,
  CheckCircle2,
  XCircle,
  ArrowRight,
  UserCheck,
  Send,
  Calendar,
  Users
} from 'lucide-react';
import { ProjectProblem, ProjectRequest, StudentProfile } from '../../types';
import { getRecommendedProjects } from '../../services/matcher';

interface StudentMatchesProps {
  student: StudentProfile;
  problems: ProjectProblem[];
  requests: ProjectRequest[];
  onViewProblem: (problem: ProjectProblem) => void;
  onSelectTab: (tab: string) => void;
}

export const StudentMatches: React.FC<StudentMatchesProps> = ({
  student,
  problems,
  requests,
  onViewProblem,
  onSelectTab,
}) => {
  const matches = getRecommendedProjects(problems, student);

  const getRequestStatus = (problemId: string) => {
    const req = requests.find((r) => r.problemId === problemId && r.studentId === student.id);
    return req ? req.status : null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header and Student Profile Snapshot */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Algorithmic Recommendation Engine</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Matched Projects for Your Profile
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              We compute multi-factor scores matching your verified programming skills against
              project technical requirements and your declared domain interests.
            </p>
          </div>

          <button
            onClick={() => onSelectTab('profile')}
            className="px-3.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 self-start md:self-auto shrink-0"
          >
            <UserCheck className="w-4 h-4" />
            Update Skills &amp; Interests
          </button>
        </div>

        {/* Current Student Profile Snapshot Tags */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs">
          <div>
            <span className="text-slate-500 font-medium mr-2">Your Skills:</span>
            <span className="font-semibold text-slate-800">
              {student.skills.join(', ')}
            </span>
          </div>
          <span className="text-slate-300" aria-hidden="true">|</span>
          <div>
            <span className="text-slate-500 font-medium mr-2">Target Domains:</span>
            <span className="font-semibold text-slate-800">
              {student.interests.join(', ')}
            </span>
          </div>
        </div>
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        {matches.map((item, idx) => {
          const { problem, score, matchingSkills, missingSkills, domainMatches, explanation } = item;
          const reqStatus = getRequestStatus(problem.id);

          // Color tier based on score
          const isHighMatch = score >= 75;
          const isMedMatch = score >= 50 && score < 75;

          return (
            <div
              key={problem.id}
              className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-2xs transition-all hover:shadow-xs ${
                isHighMatch
                  ? 'border-emerald-300/80 bg-gradient-to-r from-white via-white to-emerald-50/20'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                {/* Left Col: Problem Details & Analysis */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-blue-700">{problem.domain}</span>
                    <span aria-hidden="true">·</span>
                    <span>{problem.difficulty}</span>
                    <span aria-hidden="true">·</span>
                    <span>Deadline: {problem.deadline}</span>
                    <span aria-hidden="true">·</span>
                    <span>Mentor: {problem.staffName}</span>
                  </div>

                  <h2
                    onClick={() => onViewProblem(problem)}
                    className="text-base sm:text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer leading-snug"
                  >
                    {problem.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {problem.description}
                  </p>

                  {/* Recommendation Explanation Pill Box */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 font-semibold block mb-0.5">
                          Matching Rationale
                        </strong>
                        <p className="text-slate-700 leading-relaxed">{explanation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Skills Breakdown Grid */}
                  <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs">
                    {matchingSkills.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-slate-500 font-medium">Matching:</span>
                        {matchingSkills.map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {missingSkills.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-slate-500 font-medium">Skills to Learn:</span>
                        {missingSkills.map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Col: Score Meter & Call to Action */}
                <div className="lg:w-48 flex lg:flex-col items-center justify-between lg:justify-center p-4 bg-slate-50 rounded-xl border border-slate-200/80 shrink-0 gap-3">
                  <div className="text-center">
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-full font-extrabold text-lg tabular-nums shadow-xs ${
                        isHighMatch
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                          : isMedMatch
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                          : 'bg-slate-700 text-white ring-4 ring-slate-100'
                      }`}
                    >
                      {score}%
                    </div>
                    <span className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mt-1.5">
                      {isHighMatch ? 'High Fit' : isMedMatch ? 'Moderate Fit' : 'Fair Fit'}
                    </span>
                  </div>

                  <div className="w-full">
                    {reqStatus ? (
                      <span
                        className={`w-full block py-2 text-center text-xs font-bold rounded-lg ${
                          reqStatus === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : reqStatus === 'Declined'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {reqStatus}
                      </span>
                    ) : (
                      <button
                        onClick={() => onViewProblem(problem)}
                        className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Request to Work
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
