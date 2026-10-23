import React from 'react';
import {
  Compass,
  BookOpen,
  Layers,
  BarChart3,
  CalendarCheck,
  FileText,
  Flame,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Shield,
  Zap,
  Terminal,
  HelpCircle,
  Play,
  Info,
} from 'lucide-react';
import { usePractice } from '../context/PracticeContext';

export type NavTab = 'dashboard' | 'quiz' | 'flashcards' | 'progress' | 'plan' | 'guide' | 'promptlab';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onStartQuiz: (mode: 'all' | 'quick10' | 'domain' | 'missed' | 'flagged', domainId?: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  onOpenDemo: () => void;
  onOpenAbout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onStartQuiz,
  isMobileOpen,
  setIsMobileOpen,
  onOpenDemo,
  onOpenAbout,
}) => {
  const {
    unremediatedMissedQuestions,
    studyStreak,
    isSampleDataActive,
    loadSampleData,
    clearAllData,
    readinessScore,
    isPassing,
  } = usePractice();

  const navItems: Array<{
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    badgeColor?: string;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    {
      id: 'quiz',
      label: 'Practice Quiz',
      icon: BookOpen,
      badge: unremediatedMissedQuestions.length > 0 ? unremediatedMissedQuestions.length : undefined,
      badgeColor: 'bg-[#C04328] text-white',
    },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'progress', label: 'Progress & Loop', icon: BarChart3 },
    { id: 'promptlab', label: 'Prompt Lab', icon: Terminal, badge: 'AI', badgeColor: 'bg-[#0C4FD7] text-white' },
    { id: 'plan', label: 'Study Plan', icon: CalendarCheck },
    { id: 'guide', label: 'Exam Blueprint', icon: FileText },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-[#F8F7F4] border-r border-[#E8E5DC] z-50 flex flex-col justify-between transition-transform duration-300 ease-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top: Brand Header */}
        <div className="p-5 border-b border-[#E8E5DC]">
          <div
            onClick={() => {
              setActiveTab('dashboard');
              setIsMobileOpen(false);
            }}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            {/* Custom geometric CloudReady symbol */}
            <div className="w-9 h-9 rounded-xl bg-[#0C4FD7] flex items-center justify-center text-white shadow-xs group-hover:bg-[#093FB0] transition-colors relative overflow-hidden">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-white"
              >
                <path
                  d="M6.5 17.5H17.5C19.433 17.5 21 15.933 21 14C21 12.222 19.676 10.753 17.962 10.534C17.551 7.426 14.912 5 11.7 5C8.828 5 6.425 6.953 5.679 9.619C4.168 10.155 3 11.597 3 13.3C3 15.62 4.88 17.5 7.2 17.5"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="11.5" r="1.5" fill="currentColor" />
                <path d="M12 13V17.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-lg tracking-tight text-[#12151A]">
                  CloudReady
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#EEF4FF] text-[#0C4FD7] font-semibold border border-[#D0E0FD]">
                  AZ-900
                </span>
              </div>
              <p className="text-[11px] text-[#58616E] tracking-tight">
                Azure Fundamentals Lab
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-[#8B94A0]">
            Workspace
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-[#12151A] text-white shadow-xs'
                    : 'text-[#58616E] hover:text-[#12151A] hover:bg-[#EFECE5]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-[#8B94A0] group-hover:text-[#12151A]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-[#E8E5DC] text-[#12151A]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Special Judge Demo Walkthrough CTA */}
          <div className="pt-3 px-1">
            <button
              onClick={() => {
                onOpenDemo();
                setIsMobileOpen(false);
              }}
              className="w-full p-2.5 rounded-xl bg-[#EFF4FF] border border-[#D0E0FD] hover:bg-[#E0ECFD] text-[#0C4FD7] text-xs font-bold transition-colors flex items-center justify-between group shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Judge Walkthrough</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Study Streak & Readiness Card */}
          <div className="pt-2 px-1">
            <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E8E5DC] shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8B94A0]">
                  Study Streak
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-[#C04328] font-mono">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  {studyStreak} {studyStreak === 1 ? 'day' : 'days'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F3F1EC]">
                <span className="text-[#58616E]">Readiness Score:</span>
                <span
                  className={`font-mono font-bold ${
                    isPassing ? 'text-[#1A7B54]' : 'text-[#0C4FD7]'
                  }`}
                >
                  {readinessScore} / 1000
                </span>
              </div>

              <button
                onClick={() => {
                  onStartQuiz('quick10');
                  setIsMobileOpen(false);
                }}
                className="w-full py-2 rounded-lg bg-[#0C4FD7] hover:bg-[#093FB0] text-white text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Zap className="w-3 h-3 fill-current" />
                <span>Start Practice Quiz</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Profile / Quick Info Footer */}
        <div className="p-4 border-t border-[#E8E5DC] bg-[#FAF9F6] space-y-2.5">
          <div className="flex items-center justify-between">
            <button
              onClick={onOpenAbout}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity text-left"
              title="View independent disclosure and hackathon project info"
            >
              <div className="w-6 h-6 rounded-full bg-[#12151A] text-white flex items-center justify-center text-[10px] font-mono font-bold">
                AZ
              </div>
              <div className="leading-none">
                <span className="text-xs font-bold text-[#12151A] block">
                  About CloudReady
                </span>
                <span className="text-[10px] text-[#0C4FD7] font-mono underline">
                  Independent Disclosure
                </span>
              </div>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all saved practice answers and flashcard progress?')) {
                  clearAllData();
                }
              }}
              title="Reset practice data"
              className="p-1.5 rounded-lg text-[#8B94A0] hover:text-[#C04328] hover:bg-[#EFECE5] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sample data toggle */}
          {isSampleDataActive ? (
            <div className="text-[10px] text-[#0C4FD7] bg-[#EFF4FF] border border-[#D0E0FD] px-2 py-1 rounded-md flex items-center justify-between">
              <span>Sample Diagnostic Active</span>
              <button
                onClick={clearAllData}
                className="font-bold underline hover:text-[#093FB0]"
              >
                Reset
              </button>
            </div>
          ) : (
            <button
              onClick={loadSampleData}
              className="w-full text-[11px] py-1.5 rounded-lg bg-white border border-[#E8E5DC] text-[#58616E] hover:text-[#12151A] hover:bg-[#F3F1EC] font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-[#0C4FD7]" />
              <span>Load Sample Diagnostic</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
