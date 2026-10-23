/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PracticeProvider } from './context/PracticeContext';
import { Sidebar, NavTab } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './components/Dashboard';
import { Quiz, QuizMode } from './components/Quiz';
import { Flashcards } from './components/Flashcards';
import { ProgressReview } from './components/ProgressReview';
import { StudyPlan } from './components/StudyPlan';
import { PromptLab } from './components/PromptLab';
import { ExamGuide } from './components/ExamGuide';
import { AlternateChallengeModal } from './components/AlternateChallengeModal';
import { DemoWalkthroughModal } from './components/DemoWalkthroughModal';
import { AboutModal } from './components/AboutModal';
import { DomainId } from './types';
import {
  Compass,
  BookOpen,
  Layers,
  BarChart3,
  CalendarCheck,
  Terminal,
  FileText,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [quizMode, setQuizMode] = useState<QuizMode>('quick10');
  const [quizDomainId, setQuizDomainId] = useState<DomainId | undefined>(undefined);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);

  const handleStartQuiz = (
    mode: 'all' | 'quick10' | 'domain' | 'missed' | 'flagged',
    domainId?: string
  ) => {
    setQuizMode(mode as QuizMode);
    if (domainId) {
      setQuizDomainId(domainId as DomainId);
    } else {
      setQuizDomainId(undefined);
    }
    setActiveTab('quiz');
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#12151A] flex font-sans selection:bg-[#EFF4FF] selection:text-[#0C4FD7]">
      {/* Desktop Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onStartQuiz={handleStartQuiz}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
        onOpenDemo={() => setIsDemoModalOpen(true)}
        onOpenAbout={() => setIsAboutModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Bar */}
        <TopBar
          activeTab={activeTab}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onStartQuiz={handleStartQuiz}
          setActiveTab={setActiveTab}
          onOpenDemo={() => setIsDemoModalOpen(true)}
          onOpenAbout={() => setIsAboutModalOpen(true)}
        />

        {/* Dynamic Screen View */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              onStartQuiz={handleStartQuiz}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'quiz' && (
            <Quiz
              initialMode={quizMode}
              initialDomainId={quizDomainId}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'flashcards' && <Flashcards />}

          {activeTab === 'progress' && (
            <ProgressReview
              onStartQuiz={handleStartQuiz}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'promptlab' && <PromptLab />}

          {activeTab === 'plan' && (
            <StudyPlan
              onStartQuiz={handleStartQuiz}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'guide' && <ExamGuide />}
        </main>

        {/* Minimal Editorial Footer with Independent Disclosure */}
        <footer className="border-t border-[#E8E5DC] bg-[#F8F7F4] py-8 text-xs text-[#58616E] px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-[#12151A]">
                  CloudReady
                </span>
                <span className="text-[#8B94A0]">•</span>
                <span>AZ-900 Microsoft Azure Fundamentals Practice Lab</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-5 text-[#58616E]">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="hover:text-[#12151A] transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleStartQuiz('quick10')}
                  className="hover:text-[#12151A] transition-colors"
                >
                  Quick 10 Quiz
                </button>
                <button
                  onClick={() => setActiveTab('flashcards')}
                  className="hover:text-[#12151A] transition-colors"
                >
                  Flashcards
                </button>
                <button
                  onClick={() => setActiveTab('progress')}
                  className="hover:text-[#12151A] transition-colors"
                >
                  Weak-Spot Loop
                </button>
                <button
                  onClick={() => setActiveTab('promptlab')}
                  className="hover:text-[#0C4FD7] font-semibold transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-[#0C4FD7]" />
                  <span>Prompt Lab</span>
                </button>
                <button
                  onClick={() => setActiveTab('plan')}
                  className="hover:text-[#12151A] transition-colors"
                >
                  Study Plan
                </button>
                <button
                  onClick={() => setIsAboutModalOpen(true)}
                  className="hover:text-[#12151A] font-semibold text-[#0C4FD7] transition-colors"
                >
                  About & Disclosure
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8E5DC]/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#8B94A0]">
              <p className="text-center sm:text-left max-w-3xl">
                “CloudReady is an independent learning prototype created to help learners practise Azure Fundamentals concepts. It is not affiliated with, endorsed by, or an official product of Microsoft. All practice questions are independently authored and are not official exam questions.”
              </p>
              <button
                onClick={() => setIsDemoModalOpen(true)}
                className="underline hover:text-[#12151A] font-semibold shrink-0"
              >
                Launch Evaluator Walkthrough
              </button>
            </div>
          </div>
        </footer>

        {/* Mobile Floating Bottom Bar for quick navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#F8F7F4]/95 backdrop-blur-md border-t border-[#E8E5DC] px-2 py-2 flex items-center justify-around lg:hidden shadow-lg">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-bold ${
              activeTab === 'dashboard' ? 'text-[#0C4FD7]' : 'text-[#8B94A0]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-bold ${
              activeTab === 'quiz' ? 'text-[#0C4FD7]' : 'text-[#8B94A0]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Quiz</span>
          </button>

          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-bold ${
              activeTab === 'flashcards' ? 'text-[#0C4FD7]' : 'text-[#8B94A0]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Cards</span>
          </button>

          <button
            onClick={() => setActiveTab('progress')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-bold ${
              activeTab === 'progress' ? 'text-[#0C4FD7]' : 'text-[#8B94A0]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Loop</span>
          </button>

          <button
            onClick={() => setActiveTab('promptlab')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-bold ${
              activeTab === 'promptlab' ? 'text-[#0C4FD7]' : 'text-[#8B94A0]'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Prompts</span>
          </button>
        </nav>
      </div>

      {/* Global Modals */}
      <AlternateChallengeModal />
      <DemoWalkthroughModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        setActiveTab={setActiveTab}
        onStartQuiz={handleStartQuiz}
      />
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        onLaunchDemo={() => setIsDemoModalOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <PracticeProvider>
      <AppContent />
    </PracticeProvider>
  );
}
