import React from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Terminal,
  Layers,
  Sparkles,
  Award,
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchDemo: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onLaunchDemo }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E8E5DC] my-8 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-[#8B94A0] hover:text-[#12151A] hover:bg-[#F3F1EC] transition-colors"
          aria-label="Close about modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand & Title */}
        <div className="space-y-2 pr-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0C4FD7]" />
            <span className="font-display text-xl font-extrabold text-[#12151A]">
              CloudReady — AZ-900 Practice Lab
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#E8E5DC] text-[#58616E]">
              v2.4 Hackathon Edition
            </span>
          </div>
          <p className="text-xs text-[#58616E] leading-relaxed">
            An editorial, distraction-free learning lab designed to help Microsoft Azure Fundamentals learners master core concepts, understand distractor logic, and verify retention.
          </p>
        </div>

        {/* MANDATORY DISCLOSURE CONTAINER */}
        <div className="bg-[#FAF9F6] border-2 border-[#E8E5DC] rounded-2xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#12151A] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#0C4FD7]" />
            <span>Independent Learning Disclosure</span>
          </div>
          <blockquote className="text-xs text-[#12151A] leading-relaxed font-medium italic border-l-2 border-[#0C4FD7] pl-3">
            “CloudReady is an independent learning prototype created to help learners practise Azure Fundamentals concepts. It is not affiliated with, endorsed by, or an official product of Microsoft. All practice questions are independently authored and are not official exam questions.”
          </blockquote>
          <p className="text-[11px] text-[#8B94A0] pt-1">
            References to Microsoft Azure, AZ-900, and related service names are used purely for descriptive educational purposes. No Microsoft or Azure logos or protected trade dress are utilized.
          </p>
        </div>

        {/* 6 Hackathon Judging Priorities Overview */}
        <div className="space-y-3">
          <h4 className="font-display text-sm font-bold text-[#12151A] uppercase font-mono tracking-wider">
            Hackathon Priority Alignment
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-white border border-[#E8E5DC] space-y-1">
              <span className="font-bold text-[#0C4FD7] block">1. Learning Value</span>
              <p className="text-[#58616E]">
                30 original questions, 4 plausible options, full distractor analysis, and direct links to Microsoft Learn docs.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E8E5DC] space-y-1">
              <span className="font-bold text-[#0C4FD7] block">2. Prompt Engineering</span>
              <p className="text-[#58616E]">
                Prompt Lab constructs structured, copyable learning prompts for Gemini, Claude, or ChatGPT with analogies and scenarios.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E8E5DC] space-y-1">
              <span className="font-bold text-[#0C4FD7] block">3. User Experience</span>
              <p className="text-[#58616E]">
                Distraction-free workspace, keyboard shortcuts (A-D, 1-4, Space), high-contrast accessible typography.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E8E5DC] space-y-1">
              <span className="font-bold text-[#0C4FD7] block">4. Rapid Prototyping</span>
              <p className="text-[#58616E]">
                Zero external backend or paid dependencies. Fully functional local storage persistence and clean state resets.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E8E5DC] space-y-1">
              <span className="font-bold text-[#0C4FD7] block">5. Technical Creativity</span>
              <p className="text-[#58616E]">
                Weak-Spot Learning Loop identifies concept gaps and provides alternate questions testing the same principle.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E8E5DC] space-y-1">
              <span className="font-bold text-[#0C4FD7] block">6. Presentation & Trust</span>
              <p className="text-[#58616E]">
                Prominent independent disclaimer, verified learner statistics, and interactive guided evaluator tour.
              </p>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-3 border-t border-[#F3F1EC] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onLaunchDemo();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0C4FD7] hover:bg-[#093FB0] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Interactive Evaluator Tour</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#E8E5DC] text-xs font-semibold text-[#12151A] hover:bg-[#FAF9F6] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
