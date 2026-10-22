import React from 'react';
import {
  Home,
  Lightbulb,
  Sparkles,
  FolderGit2,
  User,
  LayoutDashboard,
  FileSpreadsheet,
  Inbox,
  Briefcase
} from 'lucide-react';
import { UserRole } from '../../types';

interface BottomNavProps {
  role: UserRole;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  pendingRequestsCount?: number;
}

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  role,
  activeTab,
  onSelectTab,
  pendingRequestsCount = 0,
}) => {
  const isStudent = role === 'student';

  const studentTabs: TabItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'ideas', label: 'Ideas', icon: Lightbulb },
    { id: 'matches', label: 'Matches', icon: Sparkles },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const staffTabs: TabItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'problems', label: 'Problems', icon: FileSpreadsheet },
    { id: 'requests', label: 'Requests', icon: Inbox, badge: pendingRequestsCount },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const tabs: TabItem[] = isStudent ? studentTabs : staffTabs;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg pb-safe">
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className="flex flex-col items-center justify-center min-h-[48px] min-w-[44px] py-1 transition-colors relative"
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'text-blue-600 scale-110' : 'text-slate-500'
                  }`}
                />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span
                className={`text-[10px] font-medium tracking-tight mt-1 whitespace-nowrap ${
                  isActive ? 'text-blue-600 font-semibold' : 'text-slate-500'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
