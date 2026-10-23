import React, { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  AlertCircle,
  Layers,
  Target,
  Terminal,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { usePractice } from '../context/PracticeContext';
import { NavTab } from './Sidebar';

interface DemoWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: NavTab) => void;
  onStartQuiz: (mode: 'all' | 'quick10' | 'domain' | 'missed' | 'flagged', domainId?: string) => void;
}

export const DemoWalkthroughModal: React.FC<DemoWalkthroughModalProps> = ({
  isOpen,
  onClose,
  setActiveTab,
  onStartQuiz,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const { loadSampleData } = usePractice();

  if (!isOpen) return null;

  const steps = [
    {
      title: '1. Starting a Practice Quiz',
      icon: BookOpen,
      iconColor: 'text-[#0C4FD7] bg-[#EFF4FF]',
      headline: 'Distraction-Free, Scenario-Based Question Practice',
      description:
        'CloudReady provides 30 original AZ-900-style questions across all three official exam domains. Every question features realistic enterprise scenarios, 4 plausible options, and one defensible answer.',
      keyCallout: 'Judges Priority: Learning Value & Rapid Prototyping',
      actionLabel: 'Launch Practice Quiz with Demo Data',
      action: () => {
        loadSampleData();
        onStartQuiz('quick10');
        onClose();
      },
    },
    {
      title: '2. Understanding Mistakes & Distractors',
      icon: AlertCircle,
      iconColor: 'text-[#C04328] bg-[#FDF2EF]',
      headline: 'Deep Pedagogical Option-by-Option Rationale',
      description:
        'Rather than merely stating what is right, CloudReady breaks down every alternative distractor (A, B, C, D) to teach why it is incorrect. It provides a memorable key takeaway and direct links to Microsoft Learn docs.',
      keyCallout: 'Judges Priority: Learning Value & Transparency',
      actionLabel: 'Inspect Quiz Mistake Breakdown',
      action: () => {
        loadSampleData();
        onStartQuiz('missed');
        onClose();
      },
    },
    {
      title: '3. Tactile Flashcard Revision',
      icon: Layers,
      iconColor: 'text-[#1A7B54] bg-[#EAF6F0]',
      headline: 'Concept Retention with Know It & Review It',
      description:
        'Flip through 20 high-yield AZ-900 terms (SLA formulas, CapEx vs OpEx, Storage Redundancy, Zero Trust). Cards feature keyboard shortcuts (Space to flip, 1 to Review, 2 to Know) and track retention status in local storage.',
      keyCallout: 'Judges Priority: User Experience & Tactile Interactivity',
      actionLabel: 'Explore Flashcards Deck',
      action: () => {
        loadSampleData();
        setActiveTab('flashcards');
        onClose();
      },
    },
    {
      title: '4. Weak-Spot Learning Loop & Recommendations',
      icon: Target,
      iconColor: 'text-[#634A99] bg-[#F4EFFB]',
      headline: 'Deterministic Gap Closure with Alternate Questions',
      description:
        'When a concept is missed, our rule-based engine identifies the topic gap and lets the learner retry using an ALTERNATE scenario question testing the same underlying concept. Passing the alternate question redeems the weak spot and updates domain accuracy.',
      keyCallout: 'Judges Priority: Technical Creativity (Feature #5)',
      actionLabel: 'Open Progress & Review Queue',
      action: () => {
        loadSampleData();
        setActiveTab('progress');
        onClose();
      },
    },
    {
      title: '5. Prompt Lab: AI Study Prompt Generator',
      icon: Terminal,
      iconColor: 'text-[#0C4FD7] bg-[#EFF4FF]',
      headline: 'Structured Prompt Engineering for External LLMs',
      description:
        'Select any Azure topic, explanation depth (Beginner, Intermediate, Exam Revision), and cognitive method (Analogy, Step-by-Step, Scenario, Comparison). Generates production-ready study prompts ready to copy into Gemini, Claude, or ChatGPT.',
      keyCallout: 'Judges Priority: Prompt Engineering (Feature #2)',
      actionLabel: 'Open Prompt Lab',
      action: () => {
        setActiveTab('promptlab' as any);
        onClose();
      },
    },
  ];

  const active = steps[currentStep];
  const Icon = active.icon;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E8E5DC] space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-[#8B94A0] hover:text-[#12151A] hover:bg-[#F3F1EC] transition-colors"
          aria-label="Close walkthrough"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Demo Header */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#EFF4FF] text-[#0C4FD7] font-bold border border-[#D0E0FD]">
            Hackathon Judging Walkthrough
          </span>
          <span className="text-xs font-mono text-[#8B94A0]">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>

        {/* Active Step Content */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${active.iconColor}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-[#8B94A0] uppercase">
                {active.title}
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-extrabold text-[#12151A]">
                {active.headline}
              </h3>
            </div>
          </div>

          <p className="text-sm text-[#58616E] leading-relaxed">
            {active.description}
          </p>

          <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#E8E5DC] text-xs font-mono text-[#12151A] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0C4FD7] shrink-0" />
            <span>{active.keyCallout}</span>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-2">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentStep ? 'w-8 bg-[#0C4FD7]' : 'w-2 bg-[#E8E5DC] hover:bg-[#8B94A0]'
              }`}
              aria-label={`Jump to demo step ${idx + 1}`}
            />
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#F3F1EC]">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-colors ${
                currentStep === 0
                  ? 'border-[#F3F1EC] text-[#DCD7CB] cursor-not-allowed'
                  : 'border-[#E8E5DC] text-[#12151A] hover:bg-[#FAF9F6]'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
              disabled={currentStep === steps.length - 1}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-colors ${
                currentStep === steps.length - 1
                  ? 'border-[#F3F1EC] text-[#DCD7CB] cursor-not-allowed'
                  : 'border-[#E8E5DC] text-[#12151A] hover:bg-[#FAF9F6]'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={active.action}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0C4FD7] hover:bg-[#093FB0] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>{active.actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
