import React from 'react';
import {
  Menu,
  Flame,
  Zap,
  RotateCcw,
  Sparkles,
  Calendar,
  Layers,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Play,
} from 'lucide-react';
import { usePractice } from '../context/PracticeContext';
import { NavTab } from './Sidebar';

interface TopBarProps {
  activeTab: NavTab;
  onOpenMobileMenu: () => void;
  onStartQuiz: (mode: 'all' | 'quick10' | 'domain' | 'missed' | 'flagged', domainId?: string) => void;
  setActiveTab: (tab: NavTab) => void;
  onOpenDemo: () => void;
  onOpenAbout: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onOpenMobileMenu,
  onStartQuiz,
  setActiveTab,
  onOpenDemo,
  onOpenAbout,
}) => {
  const {
    studyStreak,
    isSampleDataActive,
    loadSampleData,
    clearAllData,
    totalAttempted,
    missedQuestions,
  } = usePractice();

  const getBreadcrumb = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Overview & Readiness';
      case 'quiz':
        return 'Interactive Practice Quiz';
      case 'flashcards':
        return 'Term & Concept Flashcards';
      case 'progress':
        return 'Progress & Weak-Spot Loop';
      case 'promptlab':
        return 'Prompt Lab (AI Study Prompts)';
      case 'plan':
        return 'Weekly Study Plan';
      case 'guide':
        return 'Official Exam Blueprint';
      default:
        return 'Overview';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#F8F7F4]/90 backdrop-blur-md border-b border-[#E8E5DC] px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      {/* Left: Mobile hamburger & breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 rounded-xl text-[#58616E] hover:text-[#12151A] hover:bg-[#EFECE5] lg:hidden transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono text-[#8B94A0] hidden sm:inline">
            AZ-900 Lab
          </span>
          <span className="text-[#8B94A0] hidden sm:inline">/</span>
          <span className="font-semibold text-[#12151A]">
            {getBreadcrumb()}
          </span>
        </div>
      </div>

      {/* Right: Quick Streak, Demo Walkthrough, Target Date, Primary Action */}
      <div className="flex items-center gap-2.5">
        {/* Hackathon Judge Demo Button */}
        <button
          onClick={onOpenDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EFF4FF] border border-[#D0E0FD] hover:bg-[#E0ECFD] text-xs font-mono font-bold text-[#0C4FD7] shadow-2xs transition-colors"
          title="Open interactive walkthrough for hackathon judges"
        >
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">Demo Tour</span>
          <span className="sm:hidden">Demo</span>
        </button>

        {/* About / Independent Disclosure */}
        <button
          onClick={onOpenAbout}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E8E5DC] text-xs font-mono text-[#58616E] hover:text-[#12151A] hover:bg-[#FAF9F6] shadow-2xs transition-colors"
          title="View independent disclosure"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#0C4FD7]" />
          <span>About</span>
        </button>

        {/* Streak Counter */}
        <div
          title={`Your current active study streak is ${studyStreak} day${studyStreak === 1 ? '' : 's'}`}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E8E5DC] text-xs font-mono font-bold text-[#C04328] shadow-2xs"
        >
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>{studyStreak}d streak</span>
        </div>

        {/* Exam Target Date Tag */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E8E5DC] text-xs font-mono text-[#58616E] shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-[#0C4FD7]" />
          <span>Exam: Oct 2026</span>
        </div>

        {/* Quick action: Start Practicing */}
        <button
          onClick={() => onStartQuiz('quick10')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0C4FD7] hover:bg-[#093FB0] text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Start Practicing</span>
        </button>
      </div>
    </header>
  );
};
