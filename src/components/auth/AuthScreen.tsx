import React, { useState } from 'react';
import {
  Layers,
  GraduationCap,
  Briefcase,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Building,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Database
} from 'lucide-react';
import { AuthService, RegisterStaffData, RegisterStudentData } from '../../services/auth';
import { INITIAL_DOMAINS } from '../../services/storage';
import { StaffProfile, StudentProfile, UserRole } from '../../types';
import { Logo } from '../common/Logo';

interface AuthScreenProps {
  onAuthSuccess: (user: StudentProfile | StaffProfile) => void;
  onOpenCloudSetup: () => void;
}

type AuthMode = 'signin' | 'register' | 'forgot';

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onAuthSuccess,
  onOpenCloudSetup,
}) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [role, setRole] = useState<UserRole>('student');

  // Sign In State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Registration Extra State
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [year, setYear] = useState<
    '1st Year' | '2nd Year' | '3rd Year' | 'Final Year' | 'Graduate'
  >('3rd Year');
  const [rollNumber, setRollNumber] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skillsList, setSkillsList] = useState<string[]>([
    'Python',
    'React',
    'Machine Learning',
  ]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'AI & Machine Learning',
    'Healthcare',
  ]);

  // Staff Registration Extra State
  const [designation, setDesignation] = useState('Associate Professor');
  const [officeLocation, setOfficeLocation] = useState('Faculty Tower Lab 402');
  const [expertiseInput, setExpertiseInput] = useState('');
  const [expertiseList, setExpertiseList] = useState<string[]>([
    'Deep Learning',
    'Computer Vision',
  ]);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Pre-fill demo accounts for frictionless evaluation
  const handleFillDemo = (targetRole: UserRole) => {
    setRole(targetRole);
    setMode('signin');
    setErrorMessage(null);
    if (targetRole === 'student') {
      setEmail('alex.chen@university.edu');
      setPassword('Student123!');
    } else {
      setEmail('dr.watson@university.edu');
      setPassword('Faculty123!');
    }
  };

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    e.preventDefault();
    const clean = skillInput.trim();
    if (clean && !skillsList.includes(clean)) {
      setSkillsList([...skillsList, clean]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkillsList(skillsList.filter((s) => s !== skill));
  };

  const handleToggleInterest = (domain: string) => {
    if (selectedInterests.includes(domain)) {
      setSelectedInterests(selectedInterests.filter((d) => d !== domain));
    } else {
      setSelectedInterests([...selectedInterests, domain]);
    }
  };

  const handleAddExpertise = (e: React.KeyboardEvent | React.MouseEvent) => {
    e.preventDefault();
    const clean = expertiseInput.trim();
    if (clean && !expertiseList.includes(clean)) {
      setExpertiseList([...expertiseList, clean]);
      setExpertiseInput('');
    }
  };

  const handleRemoveExpertise = (item: string) => {
    setExpertiseList(expertiseList.filter((e) => e !== item));
  };

  // Sign In Handler
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your academic email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await AuthService.signIn(email, password, role);
      if (res.success && res.user) {
        onAuthSuccess(res.user);
      } else {
        setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Register Handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid university email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      if (role === 'student') {
        const studentPayload: RegisterStudentData = {
          email,
          password,
          fullName,
          department,
          year,
          rollNumber: rollNumber || `CS-${Math.floor(1000 + Math.random() * 9000)}`,
          skills: skillsList,
          interests: selectedInterests,
        };
        const res = await AuthService.registerStudent(studentPayload);
        if (res.success && res.user) {
          onAuthSuccess(res.user);
        } else {
          setErrorMessage(res.error || 'Registration failed.');
        }
      } else {
        const staffPayload: RegisterStaffData = {
          email,
          password,
          fullName,
          department,
          designation,
          areasOfExpertise: expertiseList,
          officeLocation,
        };
        const res = await AuthService.registerStaff(staffPayload);
        if (res.success && res.user) {
          onAuthSuccess(res.user);
        } else {
          setErrorMessage(res.error || 'Registration failed.');
        }
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Registration error.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Handler
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!forgotEmail.trim()) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters in length.');
      return;
    }

    setLoading(true);
    try {
      const res = await AuthService.resetPassword(forgotEmail, newPassword);
      if (res.success) {
        setForgotSuccess(true);
        setSuccessMessage('Password reset successfully! You can now sign in with your new password.');
        setTimeout(() => {
          setEmail(forgotEmail);
          setPassword(newPassword);
          setMode('signin');
          setForgotSuccess(false);
        }, 1800);
      } else {
        setErrorMessage(res.error || 'Password reset failed.');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Error resetting password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Top bar with cloud helper trigger */}
      <div className="absolute top-4 right-4">
        <button
          onClick={onOpenCloudSetup}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-100 transition-colors"
        >
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>Storage &amp; Cloud Setup</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Lockup: Knowledge Nexus */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-2">
            <Logo
              size="lg"
              showWordmark={true}
              subtitle="Collegiate Project & Research Collaboration"
              className="flex-col items-center justify-center text-center"
            />
          </div>
          <p className="mt-1 text-xs text-slate-500 max-w-sm text-balance">
            Connecting curious student minds with faculty research problems across 10 academic domains
          </p>
        </div>

        {/* Quick Demo Fill Buttons (Clearly labeled for instant evaluation) */}
        <div className="mt-5 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">
            One-Click Test Accounts
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('student')}
              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-blue-200/60"
            >
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              <span>Demo Student</span>
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('staff')}
              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-emerald-200/60"
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
              <span>Demo Staff</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Auth Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-5 sm:px-8 shadow-sm rounded-2xl border border-slate-200">
          {/* Mode Switcher Tabs */}
          <div className="flex rounded-lg bg-slate-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all ${
                mode === 'signin'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all ${
                mode === 'register'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('forgot');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-md transition-all ${
                mode === 'forgot'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Forgot Password
            </button>
          </div>

          {/* Role Choice (Student vs Staff) */}
          {mode !== 'forgot' && (
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    role === 'student'
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      role === 'student' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Student</p>
                    <p className="text-[11px] text-slate-500">Discover &amp; build</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('staff')}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    role === 'staff'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      role === 'staff'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Faculty / Staff</p>
                    <p className="text-[11px] text-slate-500">Mentor &amp; supervise</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Feedback Banners */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800 animate-fade-in">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  University Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={role === 'student' ? 'student@university.edu' : 'faculty@university.edu'}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : `Sign In as ${role === 'student' ? 'Student' : 'Faculty'}`}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* CREATE ACCOUNT FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={role === 'student' ? 'Jordan Rivera' : 'Dr. Samantha Hayes'}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  University Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@university.edu"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password (min 6 chars)
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Computer Science, Electrical Eng, etc."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>

              {/* Student Specific Fields */}
              {role === 'student' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Academic Year
                      </label>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value as any)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="Final Year">Final Year</option>
                        <option value="Graduate">Graduate</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Roll / Student ID
                      </label>
                      <input
                        type="text"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        placeholder="CS23-089"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                  </div>

                  {/* Skills input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Technical Skills (Used for Project Matching)
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
                        placeholder="e.g. Python, React, PyTorch, Docker"
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {skillsList.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-md border border-blue-200"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-blue-500 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Project Interests (Select all that interest you)
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {INITIAL_DOMAINS.map((domain) => {
                        const isSelected = selectedInterests.includes(domain);
                        return (
                          <button
                            key={domain}
                            type="button"
                            onClick={() => handleToggleInterest(domain)}
                            className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors ${
                              isSelected
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {domain}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* Staff Specific Fields */}
              {role === 'staff' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Designation / Title
                      </label>
                      <input
                        type="text"
                        required
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="Associate Professor, Chair"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Office Location
                      </label>
                      <input
                        type="text"
                        value={officeLocation}
                        onChange={(e) => setOfficeLocation(e.target.value)}
                        placeholder="Science Tower 301"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>
                  </div>

                  {/* Areas of Expertise */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Areas of Expertise / Research
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={expertiseInput}
                        onChange={(e) => setExpertiseInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddExpertise(e)}
                        placeholder="e.g. Deep Learning, Signal Processing"
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddExpertise}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {expertiseList.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-md border border-emerald-200"
                        >
                          {item}
                          <button
                            type="button"
                            onClick={() => handleRemoveExpertise(item)}
                            className="text-emerald-500 hover:text-emerald-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : `Register as ${role === 'student' ? 'Student' : 'Faculty Member'}`}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your university email address and choose a new password. The credential
                will be updated directly in the persistent database.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registered University Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password (min 6 characters)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Reset Password & Proceed to Sign In'}
              </button>

              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
