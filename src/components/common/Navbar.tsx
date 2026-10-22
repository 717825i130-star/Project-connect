import React from 'react';
import {
  Layers,
  LogOut,
  Sparkles,
  Database,
  User as UserIcon,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { StaffProfile, StudentProfile } from '../../types';
import { Logo } from './Logo';

interface NavbarProps {
  user: StudentProfile | StaffProfile;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onSignOut: () => void;
  onOpenCloudSetup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  onSelectTab,
  onSignOut,
  onOpenCloudSetup,
}) => {
  const isStudent = user.role === 'student';

  const studentNavLinks = [
    { id: 'home', label: 'Home' },
    { id: 'ideas', label: 'Ideas' },
    { id: 'matches', label: 'Matches' },
    { id: 'projects', label: 'My Projects' },
    { id: 'profile', label: 'Profile' },
  ];

  const staffNavLinks = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'problems', label: 'My Problems' },
    { id: 'requests', label: 'Requests' },
    { id: 'projects', label: 'Projects' },
    { id: 'profile', label: 'Profile' },
  ];

  const navLinks = isStudent ? studentNavLinks : staffNavLinks;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab(isStudent ? 'home' : 'dashboard')}
              className="flex items-center text-left focus:outline-none group transition-opacity hover:opacity-95"
            >
              <Logo
                size="md"
                showWordmark={true}
                subtitle={isStudent ? 'Student Research Portal' : 'Faculty Mentorship Portal'}
              />
            </button>
          </div>

          {/* Zone 2: Primary Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onSelectTab(link.id)}
                  className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Account & Cloud Hub Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Cloud & Storage Status Trigger */}
            <button
              onClick={onOpenCloudSetup}
              title="Cloud Services & Storage Setup"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span className="whitespace-nowrap">Storage & Cloud</span>
            </button>

            {/* User Profile Pill / Menu */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <button
                onClick={() => onSelectTab('profile')}
                className="flex items-center gap-2 hover:opacity-85 transition-opacity text-left"
                title="View Profile"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 ring-2 ring-blue-500/20 shrink-0">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-700 font-bold text-xs">
                      {user.fullName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="hidden lg:block">
                  <p className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[120px]">
                    {user.fullName}
                  </p>
                  <p className="text-[11px] text-slate-500 capitalize leading-none">
                    {user.role}
                  </p>
                </div>
              </button>

              {/* Sign Out Button */}
              <button
                onClick={onSignOut}
                title="Sign Out"
                className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
