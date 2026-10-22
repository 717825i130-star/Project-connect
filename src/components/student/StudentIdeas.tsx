import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Users,
  Compass,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ProjectProblem, ProjectRequest, StudentProfile } from '../../types';

interface StudentIdeasProps {
  problems: ProjectProblem[];
  student: StudentProfile;
  requests: ProjectRequest[];
  domains: string[];
  onViewProblem: (problem: ProjectProblem) => void;
}

export const StudentIdeas: React.FC<StudentIdeasProps> = ({
  problems,
  student,
  requests,
  domains,
  onViewProblem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  // Filter problems
  const filteredProblems = problems.filter((prob) => {
    // Only available problems or ones student requested
    const matchesSearch =
      prob.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prob.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prob.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDomain =
      selectedDomain === 'All' || prob.domain.toLowerCase() === selectedDomain.toLowerCase();

    const matchesDifficulty =
      selectedDifficulty === 'All' || prob.difficulty === selectedDifficulty;

    return matchesSearch && matchesDomain && matchesDifficulty;
  });

  const getRequestStatus = (problemId: string) => {
    const req = requests.find((r) => r.problemId === problemId && r.studentId === student.id);
    return req ? req.status : null;
  };

  const difficultyColors = {
    Beginner: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    Intermediate: 'text-blue-700 bg-blue-50 border-blue-200',
    Advanced: 'text-purple-700 bg-purple-50 border-purple-200',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Project Problem Statements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Browse published academic research problems and multidisciplinary project briefs
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems or skills..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>

      {/* Domain Filters (Horizontal Carousel Tabs) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
        <button
          onClick={() => setSelectedDomain('All')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors shrink-0 ${
            selectedDomain === 'All'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Domains ({problems.length})
        </button>
        {domains.map((dom) => {
          const count = problems.filter((p) => p.domain.toLowerCase() === dom.toLowerCase()).length;
          return (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors shrink-0 ${
                selectedDomain === dom
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {dom} ({count})
            </button>
          );
        })}
      </div>

      {/* Secondary Difficulty Filter */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-500 font-medium flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Difficulty:
        </span>
        {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
          <button
            key={diff}
            onClick={() => setSelectedDifficulty(diff)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              selectedDifficulty === diff
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {diff}
          </button>
        ))}
      </div>

      {/* Problems Grid */}
      {filteredProblems.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Compass className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No Problem Statements Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or removing active domain filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProblems.map((prob) => {
            const reqStatus = getRequestStatus(prob.id);

            return (
              <div
                key={prob.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Clean unboxed metadata header */}
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-blue-700">{prob.domain}</span>
                      <span aria-hidden="true">·</span>
                      <span className={`px-1.5 py-0.2 rounded-xs border text-[10px] font-semibold ${difficultyColors[prob.difficulty]}`}>
                        {prob.difficulty}
                      </span>
                    </div>

                    {reqStatus && (
                      <span
                        className={`px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                          reqStatus === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : reqStatus === 'Declined'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {reqStatus}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => onViewProblem(prob)}
                    className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer leading-snug"
                  >
                    {prob.title}
                  </h3>

                  {/* Description snippet */}
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {prob.description}
                  </p>

                  {/* Required skills */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {prob.requiredSkills.slice(0, 4).map((skill) => {
                      const hasSkill = student.skills.some(
                        (s) => s.toLowerCase() === skill.toLowerCase()
                      );
                      return (
                        <span
                          key={skill}
                          className={`text-[11px] px-2 py-0.5 rounded-md font-medium border ${
                            hasSkill
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}
                        >
                          {skill}
                        </span>
                      );
                    })}
                    {prob.requiredSkills.length > 4 && (
                      <span className="text-[11px] text-slate-400 py-0.5 px-1">
                        +{prob.requiredSkills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    <p className="font-medium text-slate-700 truncate max-w-[130px]">
                      {prob.staffName}
                    </p>
                    <p className="text-[10px]">Team size: {prob.maxTeamSize}</p>
                  </div>

                  <button
                    onClick={() => onViewProblem(prob)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    View Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
