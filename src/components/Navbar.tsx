import React from 'react';
import {
  Compass,
  BookOpen,
  Layers,
  BarChart3,
  FileText,
  RotateCcw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { usePractice } from '../context/PracticeContext';

export type ActiveTab = 'dashboard' | 'quiz' | 'flashcards' | 'progress' | 'guide';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onStartQuiz: (mode: 'all' | 'quick10' | 'domain' | 'missed' | 'flagged', domainId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onStartQuiz }) => {
  const {
    isSampleDataActive,
    loadSampleData,
    clearAllData,
    totalAttempted,
    missedQuestions,
  } = usePractice();

  return (
    <header className="border-b border-[#E6DFD5] bg-[#FAF8F5]/90 backdrop-blur sticky top-0 z-40">
      {/* Sample data notification ribbon if active */}
      {isSampleDataActive && (
        <div className="bg-[#EFF4F8] border-b border-[#D8E4EE] px-4 py-1.5 text-xs text-[#324A60] flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
            <span className="inline-block w-2 h-2 rounded-full bg-[#4B6B88]"></span>
            <span className="font-medium">
              Sample Diagnostic Loaded: Showing realistic demo scores and weak-topic analysis.
            </span>
            <button
              onClick={clearAllData}
              className="ml-auto underline hover:text-[#1E2328] font-semibold text-xs transition-colors"
            >
              Reset to Clean State
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#3B6152] flex items-center justify-center text-white shadow-xs group-hover:bg-[#2A473C] transition-colors">
              <Compass className="w-5 h-5 text-[#FAF8F5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-editorial text-xl font-bold tracking-tight text-[#1E2328]">
                  CloudReady
                </span>
                <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#EBF2EE] text-[#3B6152] font-semibold border border-[#D5E4DC]">
                  AZ-900 Lab
                </span>
              </div>
              <p className="text-[11px] text-[#5C646D] hidden sm:block">
                Microsoft Azure Fundamentals • Practice & Mastery
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#1E2328] text-white shadow-xs'
                  : 'text-[#5C646D] hover:text-[#1E2328] hover:bg-[#F4EFE6]'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'quiz'
                  ? 'bg-[#1E2328] text-white shadow-xs'
                  : 'text-[#5C646D] hover:text-[#1E2328] hover:bg-[#F4EFE6]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Practice Quiz</span>
              {missedQuestions.length > 0 && (
                <span className="ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#B45339] text-white">
                  {missedQuestions.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('flashcards')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'flashcards'
                  ? 'bg-[#1E2328] text-white shadow-xs'
                  : 'text-[#5C646D] hover:text-[#1E2328] hover:bg-[#F4EFE6]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Flashcards</span>
            </button>

            <button
              onClick={() => setActiveTab('progress')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'progress'
                  ? 'bg-[#1E2328] text-white shadow-xs'
                  : 'text-[#5C646D] hover:text-[#1E2328] hover:bg-[#F4EFE6]'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Progress & Errors</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all hidden md:flex ${
                activeTab === 'guide'
                  ? 'bg-[#1E2328] text-white shadow-xs'
                  : 'text-[#5C646D] hover:text-[#1E2328] hover:bg-[#F4EFE6]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Exam Guide</span>
            </button>
          </nav>

          {/* Quick Controls */}
          <div className="flex items-center gap-2">
            {totalAttempted === 0 && !isSampleDataActive ? (
              <button
                onClick={loadSampleData}
                title="Populate sample diagnostic data to test charts and recommendations immediately"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#3B6152]/30 bg-[#EBF2EE] text-[#3B6152] text-xs font-semibold hover:bg-[#D5E4DC] transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Sample Data</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (window.confirm('Reset all saved answers, flashcard statuses, and quiz history?')) {
                    clearAllData();
                  }
                }}
                title="Reset local storage progress"
                className="p-2 rounded-lg text-[#5C646D] hover:text-[#B45339] hover:bg-[#F4EFE6] transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => onStartQuiz('quick10')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3B6152] hover:bg-[#2A473C] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quick Quiz</span>
              <span className="sm:hidden">Quiz</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
