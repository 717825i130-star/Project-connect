/**
 * ProjectConnect Types & Data Schema
 */

export type UserRole = 'student' | 'staff';

export interface BaseUser {
  id: string;
  email: string;
  passwordHash: string; // SHA-256 salted hash
  role: UserRole;
  fullName: string;
  department: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfile extends BaseUser {
  role: 'student';
  year: '1st Year' | '2nd Year' | '3rd Year' | 'Final Year' | 'Graduate';
  rollNumber: string;
  skills: string[];
  interests: string[];
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export interface StaffProfile extends BaseUser {
  role: 'staff';
  designation: string; // e.g. "Associate Professor", "Department Chair"
  areasOfExpertise: string[];
  officeLocation?: string;
  researchFocus?: string;
}

export type ProjectDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type ProblemStatus = 'Available' | 'Assigned' | 'Archived';

export interface ProjectProblem {
  id: string;
  title: string;
  domain: string;
  description: string;
  expectedSolution: string;
  requiredSkills: string[];
  difficulty: ProjectDifficulty;
  maxTeamSize: number;
  deadline: string; // ISO date string
  staffId: string;
  staffName: string;
  staffDepartment: string;
  staffAvatar?: string;
  status: ProblemStatus;
  createdAt: string;
  updatedAt: string;
}

export type RequestStatus = 'Pending' | 'Approved' | 'Declined';

export interface ProjectRequest {
  id: string;
  problemId: string;
  problemTitle: string;
  domain: string;
  studentId: string;
  studentName: string;
  studentDepartment: string;
  studentYear: string;
  studentSkills: string[];
  studentAvatar?: string;
  staffId: string;
  pitchNote: string;
  proposedTeamSize: number;
  status: RequestStatus;
  staffNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Leader' | 'Member';
  department: string;
  rollNumber?: string;
}

export interface ProjectProposal {
  id: string;
  title: string;
  abstract: string;
  methodology: string;
  techStack: string[];
  expectedDeliverables: string[];
  documentUrl?: string;
  fileName?: string;
  submittedAt: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Needs Revision';
  staffFeedback?: string;
  reviewedAt?: string;
}

export type MilestoneStatus = 'Pending' | 'Submitted' | 'Approved' | 'Needs Revision';

export interface MilestoneSubmission {
  id: string;
  milestoneId: string;
  submittedAt: string;
  summary: string;
  repoUrl?: string;
  demoUrl?: string;
  fileName?: string;
  fileData?: string; // base64 encoded document/zip
  fileSize?: number;
  status: MilestoneStatus;
  staffFeedback?: string;
  reviewedAt?: string;
  revisionCount: number;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
  order: number;
  status: MilestoneStatus;
  submissions: MilestoneSubmission[];
}

export type ProjectStatus =
  | 'Approved'
  | 'Proposal Needed'
  | 'In Progress'
  | 'Needs Revision'
  | 'Completed';

export interface ActiveProject {
  id: string;
  problemId: string;
  title: string;
  domain: string;
  staffId: string;
  staffName: string;
  studentLeaderId: string;
  studentLeaderName: string;
  team: TeamMember[];
  proposal?: ProjectProposal;
  milestones: Milestone[];
  status: ProjectStatus;
  progressPercent: number; // 0 to 100 based on approved milestones
  createdAt: string;
  completedAt?: string;
}

export interface ProjectMatchResult {
  problem: ProjectProblem;
  score: number; // 0 to 100%
  matchingSkills: string[];
  missingSkills: string[];
  domainMatches: boolean;
  explanation: string;
}
