/**
 * ProjectConnect Authentication Engine
 * Provides real authentication with salted SHA-256 password hashing,
 * session persistence across reloads, role verification, and password reset.
 */

import { StaffProfile, StudentProfile, UserRole } from '../types';
import { hashPassword, StorageEngine } from './storage';

export interface AuthState {
  user: StudentProfile | StaffProfile | null;
  isAuthenticated: boolean;
  role: UserRole | null;
}

export interface RegisterStudentData {
  email: string;
  password: string;
  fullName: string;
  department: string;
  year: '1st Year' | '2nd Year' | '3rd Year' | 'Final Year' | 'Graduate';
  rollNumber: string;
  skills: string[];
  interests: string[];
}

export interface RegisterStaffData {
  email: string;
  password: string;
  fullName: string;
  department: string;
  designation: string;
  areasOfExpertise: string[];
  officeLocation?: string;
}

export const AuthService = {
  /**
   * Get active authenticated session from persistent storage
   */
  async getCurrentUser(): Promise<StudentProfile | StaffProfile | null> {
    await StorageEngine.initialize();
    const currentId = StorageEngine.getCurrentUserId();
    if (!currentId) return null;
    return StorageEngine.getUserById(currentId) || null;
  },

  /**
   * Real Sign In
   */
  async signIn(email: string, password: string, selectedRole?: UserRole): Promise<{
    success: boolean;
    user?: StudentProfile | StaffProfile;
    error?: string;
  }> {
    await StorageEngine.initialize();
    const cleanEmail = email.trim().toLowerCase();
    const user = StorageEngine.getUserByEmail(cleanEmail);

    if (!user) {
      return {
        success: false,
        error: 'No account found with this email address. Please check your spelling or create an account.',
      };
    }

    if (selectedRole && user.role !== selectedRole) {
      return {
        success: false,
        error: `This email is registered as a ${user.role.toUpperCase()} account, but you selected ${selectedRole.toUpperCase()}. Please choose the matching role.`,
      };
    }

    const computedHash = await hashPassword(password);
    if (user.passwordHash !== computedHash) {
      return {
        success: false,
        error: 'Incorrect password. Please verify your credentials or use Forgot Password.',
      };
    }

    // Set persistent session
    StorageEngine.setCurrentUserId(user.id);
    return { success: true, user };
  },

  /**
   * Real Account Registration for Students
   */
  async registerStudent(data: RegisterStudentData): Promise<{
    success: boolean;
    user?: StudentProfile;
    error?: string;
  }> {
    await StorageEngine.initialize();
    const cleanEmail = data.email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, error: 'Please enter a valid academic email address.' };
    }

    if (data.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters in length.' };
    }

    if (!data.fullName.trim()) {
      return { success: false, error: 'Full name is required.' };
    }

    const existing = StorageEngine.getUserByEmail(cleanEmail);
    if (existing) {
      return { success: false, error: 'An account with this email address already exists. Please sign in instead.' };
    }

    const passwordHash = await hashPassword(data.password);
    const newStudent: StudentProfile = {
      id: `std_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email: cleanEmail,
      passwordHash,
      role: 'student',
      fullName: data.fullName.trim(),
      department: data.department || 'Computer Science & Engineering',
      year: data.year,
      rollNumber: data.rollNumber || `CS-${Math.floor(1000 + Math.random() * 9000)}`,
      skills: data.skills.length > 0 ? data.skills : ['Python', 'TypeScript', 'Web Development'],
      interests: data.interests.length > 0 ? data.interests : ['AI & Machine Learning', 'Software'],
      bio: 'Enthusiastic undergraduate student ready to collaborate on multidisciplinary engineering projects.',
      avatarUrl: '/src/assets/images/avatar_student_sarah_1792641942397.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    StorageEngine.saveUser(newStudent);
    StorageEngine.setCurrentUserId(newStudent.id);
    return { success: true, user: newStudent };
  },

  /**
   * Real Account Registration for Staff
   */
  async registerStaff(data: RegisterStaffData): Promise<{
    success: boolean;
    user?: StaffProfile;
    error?: string;
  }> {
    await StorageEngine.initialize();
    const cleanEmail = data.email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, error: 'Please enter a valid institution email address.' };
    }

    if (data.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters in length.' };
    }

    if (!data.fullName.trim()) {
      return { success: false, error: 'Faculty / Staff name is required.' };
    }

    const existing = StorageEngine.getUserByEmail(cleanEmail);
    if (existing) {
      return { success: false, error: 'An account with this email address already exists. Please sign in instead.' };
    }

    const passwordHash = await hashPassword(data.password);
    const newStaff: StaffProfile = {
      id: `stf_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email: cleanEmail,
      passwordHash,
      role: 'staff',
      fullName: data.fullName.trim(),
      department: data.department || 'School of Computing & Engineering',
      designation: data.designation || 'Assistant Professor & Mentor',
      areasOfExpertise:
        data.areasOfExpertise.length > 0
          ? data.areasOfExpertise
          : ['Artificial Intelligence', 'Software Engineering', 'Research Mentorship'],
      officeLocation: data.officeLocation || 'Faculty Building Room 301',
      avatarUrl: '/src/assets/images/avatar_staff_prof_1792641956605.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    StorageEngine.saveUser(newStaff);
    StorageEngine.setCurrentUserId(newStaff.id);
    return { success: true, user: newStaff };
  },

  /**
   * Real Password Reset
   */
  async resetPassword(email: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    await StorageEngine.initialize();
    const cleanEmail = email.trim().toLowerCase();
    const user = StorageEngine.getUserByEmail(cleanEmail);

    if (!user) {
      return {
        success: false,
        error: 'No registered user found with this email. Please check the address entered.',
      };
    }

    if (newPassword.length < 6) {
      return {
        success: false,
        error: 'New password must be at least 6 characters in length.',
      };
    }

    const newHash = await hashPassword(newPassword);
    user.passwordHash = newHash;
    StorageEngine.saveUser(user);
    return { success: true };
  },

  /**
   * Sign Out
   */
  signOut(): void {
    StorageEngine.setCurrentUserId(null);
  },
};
