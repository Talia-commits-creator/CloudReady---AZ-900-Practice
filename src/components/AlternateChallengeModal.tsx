import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ExternalLink,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Zap,
} from 'lucide-react';
import { usePractice } from '../context/PracticeContext';
import { AZ900_DOMAINS } from '../data/domains';

export const AlternateChallengeModal: React.FC = () => {
  const {
    activeAlternateQuestion,
    closeAlternateChallenge,
    recordAttempt,
    markWeakSpotRedeemed,
  } = usePractice();

  const [selectedOptionId, setSelectedOptionId] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!activeAlternateQuestion) return null;

  const q = activeAlternateQuestion;
  const domainMeta = AZ900_DOMAINS[q.domainId];
  const isCorrect = selectedOptionId === q.correctOptionId;

  const handleSubmit = () => {
    if (!selectedOptionId || isSubmitted) return;

    recordAttempt(q.id, selectedOptionId, isCorrect);
    if (isCorrect && q.parentQuestionId) {
      markWeakSpotRedeemed(q.parentQuestionId);
    }
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E8E5DC] my-8 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={closeAlternateChallenge}
          className="absolute top-6 right-6 p-2 rounded-xl text-[#8B94A0] hover:text-[#12151A] hover:bg-[#F3F1EC] transition-colors"
          aria-label="Close alternate challenge"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Ribbon */}
        <div className="space-y-1 pr-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EFF4FF] text-[#0C4FD7] font-bold border border-[#D0E0FD]">
              Weak-Spot Learning Loop
            </span>
            <span className="text-xs font-mono text-[#8B94A0]">
              Step 5 of 6: Concept Verification
            </span>
          </div>

          <h3 className="font-display text-xl font-bold text-[#12151A]">
            Alternate Concept Challenge
          </h3>
          <p className="text-xs text-[#58616E] leading-relaxed">
            You previously missed a question on <strong className="text-[#12151A]">{q.subtopic}</strong>. Rather than repeating the exact same question, this alternate scenario tests the same foundational principle to confirm true mastery.
          </p>
        </div>

        {/* Question Metadata */}
        <div className="flex items-center gap-2 pb-2 border-b border-[#F3F1EC] text-xs">
          <span
            className="font-mono font-bold px-2 py-0.5 rounded text-[11px]"
            style={{ backgroundColor: domainMeta.accentBg, color: domainMeta.color }}
          >
            {domainMeta.name}
          </span>
          <span className="text-[#8B94A0]">•</span>
          <span className="text-[#58616E] font-mono">{q.subtopic}</span>
          <span className="text-[#8B94A0]">•</span>
          <span className="font-mono text-[#8B94A0]">{q.difficulty}</span>
        </div>

        {/* Scenario container */}
        {q.scenario && (
          <div className="bg-[#FAF9F6] border border-[#E8E5DC] rounded-2xl p-4 text-xs text-[#58616E] leading-relaxed">
            <span className="font-mono font-bold text-[#12151A] block mb-1 uppercase tracking-wider text-[10px]">
              Fresh Scenario Context
            </span>
            {q.scenario}
          </div>
        )}

        {/* Question text */}
        <h4 className="font-display text-base font-bold text-[#12151A] leading-snug">
          {q.question}
        </h4>

        {/* Options */}
        <div className="space-y-2.5">
          {q.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            const isCorrectAnswer = opt.id === q.correctOptionId;

            let style = 'border-[#E8E5DC] bg-white hover:bg-[#FAF9F6] text-[#12151A]';

            if (isSubmitted) {
              if (isCorrectAnswer) {
                style = 'border-[#1A7B54] bg-[#EAF6F0] font-semibold text-[#12151A]';
              } else if (isSelected && !isCorrectAnswer) {
                style = 'border-[#C04328] bg-[#FDF2EF] text-[#12151A]';
              } else {
                style = 'border-[#F3F1EC] opacity-50 text-[#8B94A0]';
              }
            } else if (isSelected) {
              style = 'border-[#0C4FD7] bg-[#EFF4FF] ring-2 ring-[#0C4FD7]/20 font-semibold';
            }

            return (
              <button
                key={opt.id}
                disabled={isSubmitted}
                onClick={() => setSelectedOptionId(opt.id)}
                className={`w-full text-left p-3.5 rounded-2xl border text-xs leading-relaxed flex items-start gap-3 transition-all ${style}`}
              >
                <span
                  className={`w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold shrink-0 ${
                    isSubmitted && isCorrectAnswer
                      ? 'bg-[#1A7B54] text-white'
                      : isSubmitted && isSelected && !isCorrectAnswer
                      ? 'bg-[#C04328] text-white'
                      : isSelected
                      ? 'bg-[#0C4FD7] text-white'
                      : 'bg-[#F8F7F4] border border-[#E8E5DC] text-[#58616E]'
                  }`}
                >
                  {opt.id}
                </span>
                <span className="pt-0.5">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Submit or Results feedback */}
        {!isSubmitted ? (
          <div className="pt-4 border-t border-[#F3F1EC] flex items-center justify-between">
            <span className="text-xs text-[#8B94A0]">
              {selectedOptionId ? 'Click verify to test your understanding' : 'Select an answer to verify'}
            </span>
            <button
              disabled={!selectedOptionId}
              onClick={handleSubmit}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors ${
                selectedOptionId
                  ? 'bg-[#0C4FD7] hover:bg-[#093FB0] text-white'
                  : 'bg-[#F3F1EC] text-[#8B94A0] cursor-not-allowed'
              }`}
            >
              Verify Concept Understanding
            </button>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            <div
              className={`p-4 rounded-2xl border space-y-2 ${
                isCorrect
                  ? 'bg-[#EAF6F0] border-[#CCE9DB]'
                  : 'bg-[#FDF2EF] border-[#F5D3CA]'
              }`}
            >
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-[#1A7B54]" />
                    <span className="font-bold text-sm text-[#1A7B54]">
                      Weak-Spot Redeemed! Concept Successfully Verified.
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-[#C04328]" />
                    <span className="font-bold text-sm text-[#C04328]">
                      Still Needs Attention. Review the concept rationale below.
                    </span>
                  </>
                )}
              </div>

              <p className="text-xs text-[#12151A] leading-relaxed">
                {q.explanation}
              </p>

              <div className="pt-2 border-t border-black/10 flex items-center justify-between text-xs">
                <span className="font-medium text-[#58616E]">
                  Takeaway: {q.keyTakeaway}
                </span>
                <a
                  href={q.learnUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#0C4FD7] hover:underline"
                >
                  <span>Learn Docs</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={closeAlternateChallenge}
                className="px-5 py-2.5 rounded-xl bg-[#12151A] hover:bg-black text-white text-xs font-semibold shadow-xs transition-colors"
              >
                Close & Return to Practice
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
