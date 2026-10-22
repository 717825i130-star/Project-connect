import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Building,
  Mail,
  CheckCircle2,
  Plus,
  Save,
  Github,
  Globe,
  Sparkles
} from 'lucide-react';
import { StudentProfile } from '../../types';
import { INITIAL_DOMAINS, StorageEngine } from '../../services/storage';

interface StudentProfileViewProps {
  student: StudentProfile;
  onUpdate: (updated: StudentProfile) => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  student,
  onUpdate,
}) => {
  const [fullName, setFullName] = useState(student.fullName);
  const [department, setDepartment] = useState(student.department);
  const [year, setYear] = useState(student.year);
  const [rollNumber, setRollNumber] = useState(student.rollNumber);
  const [bio, setBio] = useState(student.bio || '');
  const [githubUrl, setGithubUrl] = useState(student.githubUrl || '');
  const [skills, setSkills] = useState<string[]>(student.skills);
  const [interests, setInterests] = useState<string[]>(student.interests);
  const [newSkill, setNewSkill] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddSkill = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    const clean = newSkill.trim();
    if (clean && !skills.includes(clean)) {
      setSkills([...skills, clean]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleToggleInterest = (domain: string) => {
    if (interests.includes(domain)) {
      setInterests(interests.filter((d) => d !== domain));
    } else {
      setInterests([...interests, domain]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StudentProfile = {
      ...student,
      fullName: fullName.trim(),
      department: department.trim(),
      year,
      rollNumber: rollNumber.trim(),
      bio: bio.trim(),
      githubUrl: githubUrl.trim(),
      skills,
      interests,
      updatedAt: new Date().toISOString(),
    };

    StorageEngine.saveUser(updated);
    onUpdate(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Student Profile &amp; Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Update your academic details, skills, and target project interests
          </p>
        </div>

        {savedSuccess && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Profile Updated
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Profile Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 ring-4 ring-blue-500/10 shrink-0">
              {student.avatarUrl ? (
                <img
                  src={student.avatarUrl}
                  alt={student.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-700 font-bold text-xl">
                  {student.fullName.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{student.fullName}</h3>
              <p className="text-xs text-slate-500">{student.email}</p>
              <span className="inline-block mt-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                Verified Student Account
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Academic Department</label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Current Academic Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value as any)}
                className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="Final Year">Final Year</option>
                <option value="Graduate">Graduate</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Roll / Student Number</label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Short Student Bio / Research Focus
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell mentors and teammates about your interests..."
              className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              GitHub Profile Link
            </label>
            <div className="relative">
              <Github className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/your-username"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Skills Management Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Technical Skills &amp; Proficiencies
            </h3>
            <p className="text-xs text-slate-500">
              The matching algorithm scans these skills when computing compatibility scores with
              faculty project requirements.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
              placeholder="Add skill (e.g. PyTorch, Kubernetes, React, C++)..."
              className="flex-1 p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold"
            >
              Add Skill
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-200 text-xs font-medium"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-blue-400 hover:text-blue-700 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Project Domain Interests Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Target Project Domains &amp; Industries
            </h3>
            <p className="text-xs text-slate-500">
              Select all domains that align with your career ambitions and capstone interests
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {INITIAL_DOMAINS.map((domain) => {
              const isSelected = interests.includes(domain);
              return (
                <button
                  key={domain}
                  type="button"
                  onClick={() => handleToggleInterest(domain)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {domain}
                </button>
              );
            })}
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
};
