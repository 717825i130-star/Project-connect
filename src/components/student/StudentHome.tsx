import React from 'react';
import {
  Sparkles,
  FolderGit2,
  Inbox,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Compass,
  FileText
} from 'lucide-react';
import { ActiveProject, ProjectProblem, ProjectRequest, StudentProfile } from '../../types';
import { getRecommendedProjects } from '../../services/matcher';

interface StudentHomeProps {
  student: StudentProfile;
  problems: ProjectProblem[];
  requests: ProjectRequest[];
  projects: ActiveProject[];
  onSelectTab: (tab: string) => void;
  onViewProblem: (problem: ProjectProblem) => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({
  student,
  problems,
  requests,
  projects,
  onSelectTab,
  onViewProblem,
}) => {
  const recommendations = getRecommendedProjects(problems, student).slice(0, 3);
  const pendingRequests = requests.filter((r) => r.status === 'Pending').length;
  const activeProjectsList = projects.filter((p) => p.status !== 'Completed');

  // Count pending milestones across active projects
  const pendingMilestones = projects.reduce((acc, p) => {
    return acc + p.milestones.filter((m) => m.status === 'Pending' || m.status === 'Needs Revision').length;
  }, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-blue-100 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>{student.department}</span>
            <span aria-hidden="true">·</span>
            <span>{student.year}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Welcome back, {student.fullName}
          </h1>
          <p className="mt-2 text-sm text-blue-100 leading-relaxed">
            Discover real-world research problems, form student engineering teams, collaborate
            directly with university faculty mentors, and build your capstone portfolio.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              onClick={() => onSelectTab('ideas')}
              className="px-4 py-2 bg-white text-blue-800 text-xs sm:text-sm font-bold rounded-xl shadow-xs hover:bg-blue-50 transition-colors flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-blue-600" />
              Browse Problem Statements
            </button>
            <button
              onClick={() => onSelectTab('matches')}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              View Recommended Matches
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Active Projects</span>
            <FolderGit2 className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">
            {activeProjectsList.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Currently supervised</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Pending Requests</span>
            <Inbox className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">
            {pendingRequests}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Awaiting staff review</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Milestones Due</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">
            {pendingMilestones}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Upcoming deadlines</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Matched Ideas</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">
            {recommendations.filter((r) => r.score >= 50).length}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">&gt; 50% skill &amp; domain fit</p>
        </div>
      </div>

      {/* Main Content Split: Top Matches & Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Top Recommendations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Top Matches for Your Skills
              </h2>
              <p className="text-xs text-slate-500">
                Algorithmically matched against your skills and domain interests
              </p>
            </div>
            <button
              onClick={() => onSelectTab('matches')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              View all matches <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recommendations.map((match) => (
              <div
                key={match.problem.id}
                className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-medium text-slate-700">{match.problem.domain}</span>
                      <span aria-hidden="true">·</span>
                      <span>{match.problem.difficulty}</span>
                      <span aria-hidden="true">·</span>
                      <span>Mentor: {match.problem.staffName}</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-bold text-xs">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="tabular-nums">{match.score}% Match</span>
                    </div>
                  </div>

                  <h3
                    onClick={() => onViewProblem(match.problem)}
                    className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors leading-snug"
                  >
                    {match.problem.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {match.problem.description}
                  </p>

                  <p className="text-[11px] text-emerald-700 font-medium mt-2 bg-emerald-50/70 p-1.5 rounded-md">
                    {match.explanation}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span>Deadline: {match.problem.deadline}</span>
                  </div>
                  <button
                    onClick={() => onViewProblem(match.problem)}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors"
                  >
                    View Details &amp; Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Active Workspace Snapshot */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Active Workspaces</h2>
            <button
              onClick={() => onSelectTab('projects')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              See all
            </button>
          </div>

          {activeProjectsList.length === 0 ? (
            <div className="p-6 bg-white rounded-xl border border-slate-200 text-center">
              <FolderGit2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">No Active Projects Yet</p>
              <p className="text-[11px] text-slate-500 mt-1 mb-3">
                Request an available problem statement or check pending requests.
              </p>
              <button
                onClick={() => onSelectTab('ideas')}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium"
              >
                Find a Problem
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeProjectsList.map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-blue-700">{proj.domain}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-sm bg-slate-100 font-medium text-slate-700">
                      {proj.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {proj.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Mentor: {proj.staffName}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-slate-600 mb-1 font-medium">
                      <span>Milestones Completed</span>
                      <span className="tabular-nums">{proj.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${proj.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="text-[11px] text-slate-500">
                      Team: {proj.team.length} members
                    </span>
                    <button
                      onClick={() => onSelectTab('projects')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Open Workspace →
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
