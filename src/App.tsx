/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { ActiveProject, ProjectProblem, ProjectRequest, StaffProfile, StudentProfile } from './types';
import { AuthService } from './services/auth';
import { StorageEngine } from './services/storage';

// Common Components
import { Navbar } from './components/common/Navbar';
import { BottomNav } from './components/common/BottomNav';
import { CloudSetupModal } from './components/common/CloudSetupModal';
import { AuthScreen } from './components/auth/AuthScreen';
import { ProjectDetailModal } from './components/modals/ProjectDetailModal';

// Student Components
import { StudentHome } from './components/student/StudentHome';
import { StudentIdeas } from './components/student/StudentIdeas';
import { StudentMatches } from './components/student/StudentMatches';
import { StudentProjects } from './components/student/StudentProjects';
import { StudentProfileView } from './components/student/StudentProfile';

// Staff Components
import { StaffDashboard } from './components/staff/StaffDashboard';
import { StaffProblems } from './components/staff/StaffProblems';
import { StaffRequests } from './components/staff/StaffRequests';
import { StaffProjects } from './components/staff/StaffProjects';
import { StaffProfileView } from './components/staff/StaffProfile';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<StudentProfile | StaffProfile | null>(null);
  const [activeTab, setActiveTab] = useState<string>('home');

  // Shared Data State
  const [problems, setProblems] = useState<ProjectProblem[]>([]);
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [projects, setProjects] = useState<ActiveProject[]>([]);
  const [domains, setDomains] = useState<string[]>([]);

  // Modals
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [selectedProblemForModal, setSelectedProblemForModal] = useState<ProjectProblem | null>(null);

  // Initialize and load persistent session
  const refreshAppData = async () => {
    await StorageEngine.initialize();
    setProblems(StorageEngine.getProblems());
    setRequests(StorageEngine.getRequests());
    setProjects(StorageEngine.getProjects());
    setDomains(StorageEngine.getDomains());

    // Update current user record if logged in
    const activeId = StorageEngine.getCurrentUserId();
    if (activeId) {
      const user = StorageEngine.getUserById(activeId);
      if (user) {
        setCurrentUser(user);
      }
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      await StorageEngine.initialize();
      const user = await AuthService.getCurrentUser();
      setCurrentUser(user);

      if (user) {
        setActiveTab(user.role === 'student' ? 'home' : 'dashboard');
      }

      setProblems(StorageEngine.getProblems());
      setRequests(StorageEngine.getRequests());
      setProjects(StorageEngine.getProjects());
      setDomains(StorageEngine.getDomains());
      setLoading(false);
    };

    initAuth();
  }, []);

  // Sign In / Register Success
  const handleAuthSuccess = (user: StudentProfile | StaffProfile) => {
    setCurrentUser(user);
    setActiveTab(user.role === 'student' ? 'home' : 'dashboard');
    refreshAppData();
  };

  // Sign Out
  const handleSignOut = () => {
    AuthService.signOut();
    setCurrentUser(null);
    setActiveTab('home');
  };

  // Student Requests Problem Modal
  const handleViewProblem = (problem: ProjectProblem) => {
    setSelectedProblemForModal(problem);
  };

  // Quick Approve/Decline from Staff Dashboard
  const handleApproveRequest = (requestId: string) => {
    StorageEngine.updateRequestStatus(
      requestId,
      'Approved',
      'Request approved. Welcome to the project!'
    );
    refreshAppData();
  };

  const handleDeclineRequest = (requestId: string) => {
    StorageEngine.updateRequestStatus(
      requestId,
      'Declined',
      'Thank you for your interest. Unfortunately, prerequisites are insufficient or slots are full.'
    );
    refreshAppData();
  };

  // Initial Boot Loader
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold text-slate-600">Initializing ProjectConnect...</p>
      </div>
    );
  }

  // Not Logged In: Show Login Screen First
  if (!currentUser) {
    return (
      <>
        <AuthScreen
          onAuthSuccess={handleAuthSuccess}
          onOpenCloudSetup={() => setIsCloudModalOpen(true)}
        />
        <CloudSetupModal
          isOpen={isCloudModalOpen}
          onClose={() => setIsCloudModalOpen(false)}
          onDataReset={refreshAppData}
        />
      </>
    );
  }

  const isStudent = currentUser.role === 'student';
  const student = isStudent ? (currentUser as StudentProfile) : null;
  const staff = !isStudent ? (currentUser as StaffProfile) : null;

  // Filter requests for pending badges
  const pendingRequestsCount = staff
    ? requests.filter((r) => r.staffId === staff.id && r.status === 'Pending').length
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900 pb-20 md:pb-6">
      {/* Top Navigation Bar */}
      <Navbar
        user={currentUser}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onSignOut={handleSignOut}
        onOpenCloudSetup={() => setIsCloudModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* STUDENT SCREENS */}
        {isStudent && student && (
          <>
            {activeTab === 'home' && (
              <StudentHome
                student={student}
                problems={problems}
                requests={requests}
                projects={projects}
                onSelectTab={setActiveTab}
                onViewProblem={handleViewProblem}
              />
            )}

            {activeTab === 'ideas' && (
              <StudentIdeas
                problems={problems}
                student={student}
                requests={requests}
                domains={domains}
                onViewProblem={handleViewProblem}
              />
            )}

            {activeTab === 'matches' && (
              <StudentMatches
                student={student}
                problems={problems}
                requests={requests}
                onViewProblem={handleViewProblem}
                onSelectTab={setActiveTab}
              />
            )}

            {activeTab === 'projects' && (
              <StudentProjects
                student={student}
                projects={projects}
                requests={requests}
                onRefreshData={refreshAppData}
                onSelectTab={setActiveTab}
              />
            )}

            {activeTab === 'profile' && (
              <StudentProfileView
                student={student}
                onUpdate={(updated) => {
                  setCurrentUser(updated);
                  refreshAppData();
                }}
              />
            )}
          </>
        )}

        {/* STAFF SCREENS */}
        {!isStudent && staff && (
          <>
            {activeTab === 'dashboard' && (
              <StaffDashboard
                staff={staff}
                problems={problems}
                requests={requests}
                projects={projects}
                onSelectTab={setActiveTab}
                onApproveRequest={handleApproveRequest}
                onDeclineRequest={handleDeclineRequest}
              />
            )}

            {activeTab === 'problems' && (
              <StaffProblems
                staff={staff}
                problems={problems}
                domains={domains}
                onRefreshData={refreshAppData}
              />
            )}

            {activeTab === 'requests' && (
              <StaffRequests
                staff={staff}
                requests={requests}
                onRefreshData={refreshAppData}
              />
            )}

            {activeTab === 'projects' && (
              <StaffProjects
                staff={staff}
                projects={projects}
                onRefreshData={refreshAppData}
              />
            )}

            {activeTab === 'profile' && (
              <StaffProfileView
                staff={staff}
                onUpdate={(updated) => {
                  setCurrentUser(updated);
                  refreshAppData();
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        role={currentUser.role}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        pendingRequestsCount={pendingRequestsCount}
      />

      {/* Problem Details & Request Submission Modal */}
      {selectedProblemForModal && (
        <ProjectDetailModal
          problem={selectedProblemForModal}
          student={student}
          isOpen={!!selectedProblemForModal}
          onClose={() => setSelectedProblemForModal(null)}
          onRequestSubmitted={refreshAppData}
          existingRequestStatus={
            student
              ? requests.find(
                  (r) =>
                    r.problemId === selectedProblemForModal.id && r.studentId === student.id
                )?.status || null
              : null
          }
        />
      )}

      {/* Cloud & Firebase Setup Modal */}
      <CloudSetupModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
        onDataReset={refreshAppData}
      />
    </div>
  );
}
