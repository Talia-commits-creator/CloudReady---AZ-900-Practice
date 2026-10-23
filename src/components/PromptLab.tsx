import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  BookOpen,
  Layers,
  HelpCircle,
  ExternalLink,
  Code,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Terminal,
  CheckCircle2,
} from 'lucide-react';
import { PROMPT_TOPICS, generateStudyPrompt, getDeterministicSampleResponse } from '../data/promptTopics';
import { PromptTopic, PromptLevel, PromptMethod } from '../types';

export const PromptLab: React.FC = () => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(PROMPT_TOPICS[0].id);
  const [selectedLevel, setSelectedLevel] = useState<PromptLevel>('exam-revision');
  const [selectedMethod, setSelectedMethod] = useState<PromptMethod>('analogy');
  const [copied, setCopied] = useState<boolean>(false);
  const [showSimulatedOutput, setShowSimulatedOutput] = useState<boolean>(true);

  const currentTopic = PROMPT_TOPICS.find((t) => t.id === selectedTopicId) || PROMPT_TOPICS[0];
  const generatedPrompt = generateStudyPrompt(currentTopic, selectedLevel, selectedMethod);
  const simulatedOutput = getDeterministicSampleResponse(currentTopic, selectedLevel, selectedMethod);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header Banner */}
      <div className="bg-white border border-[#E8E5DC] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono uppercase tracking-wider text-[#0C4FD7] font-bold">
              Prompt Engineering Studio
            </span>
            <span className="text-[#8B94A0]">•</span>
            <span className="text-xs font-mono text-[#58616E]">
              Zero-Cost Pedagogical Templates
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#12151A]">
            Prompt Lab
          </h1>
          <p className="text-sm text-[#58616E] mt-1.5 max-w-xl leading-relaxed">
            Construct professionally engineered study prompts tailored for Gemini, Claude, or ChatGPT. Choose your topic, difficulty depth, and cognitive learning method.
          </p>
        </div>

        {/* Disclaimer Tag */}
        <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#E8E5DC] text-xs text-[#58616E] max-w-xs shrink-0">
          <span className="font-bold block text-[#12151A] text-[11px] uppercase font-mono mb-0.5">
            Design Philosophy
          </span>
          Deterministic prompt generator. Ready to copy into your preferred LLM without API key dependencies or token costs.
        </div>
      </div>

      {/* Configuration Matrix */}
      <section className="bg-white border border-[#E8E5DC] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="font-display text-lg font-bold text-[#12151A] flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#0C4FD7]" />
          <span>Configure Learning Parameters</span>
        </h2>

        {/* 1. Select Topic */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-[#8B94A0] font-bold block">
            1. Select Cloud Concept or Domain
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            {PROMPT_TOPICS.map((topic) => {
              const isSelected = topic.id === selectedTopicId;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`p-3 rounded-2xl border text-left transition-all text-xs font-semibold ${
                    isSelected
                      ? 'border-[#0C4FD7] bg-[#EFF4FF] text-[#0C4FD7] ring-1 ring-[#0C4FD7]'
                      : 'border-[#E8E5DC] bg-[#FAF9F6] text-[#12151A] hover:bg-white'
                  }`}
                >
                  <span className="block font-bold">{topic.name}</span>
                  <span className="text-[10px] text-[#58616E] font-normal block mt-1 line-clamp-1">
                    {topic.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Select Difficulty Level */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-[#8B94A0] font-bold block">
            2. Explanation Depth & Target Audience
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'beginner', title: 'Beginner', desc: 'Plain English, zero cloud jargon, friendly intro' },
              { id: 'intermediate', title: 'Intermediate', desc: 'Standard IT architecture & Azure trade-offs' },
              { id: 'exam-revision', title: 'Exam Revision (AZ-900)', desc: 'High-yield exam traps & memory mnemonics' },
            ].map((lvl) => {
              const isSelected = selectedLevel === lvl.id;
              return (
                <button
                  key={lvl.id}
                  onClick={() => setSelectedLevel(lvl.id as PromptLevel)}
                  className={`p-3.5 rounded-2xl border text-left transition-all text-xs ${
                    isSelected
                      ? 'border-[#0C4FD7] bg-[#EFF4FF] text-[#0C4FD7] ring-1 ring-[#0C4FD7]'
                      : 'border-[#E8E5DC] bg-[#FAF9F6] text-[#12151A] hover:bg-white'
                  }`}
                >
                  <span className="font-bold block text-sm">{lvl.title}</span>
                  <span className="text-[11px] text-[#58616E] mt-0.5 block">{lvl.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Select Learning Method */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-[#8B94A0] font-bold block">
            3. Cognitive Learning Method
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'analogy', title: 'Analogy', desc: 'Real-world metaphors' },
              { id: 'step-by-step', title: 'Step-by-Step', desc: 'Numbered sequential logic' },
              { id: 'scenario', title: 'Scenario', desc: 'Enterprise business case' },
              { id: 'comparison', title: 'Comparison', desc: 'Structured matrix vs alternatives' },
            ].map((m) => {
              const isSelected = selectedMethod === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMethod(m.id as PromptMethod)}
                  className={`p-3 rounded-2xl border text-left transition-all text-xs ${
                    isSelected
                      ? 'border-[#0C4FD7] bg-[#EFF4FF] text-[#0C4FD7] ring-1 ring-[#0C4FD7]'
                      : 'border-[#E8E5DC] bg-[#FAF9F6] text-[#12151A] hover:bg-white'
                  }`}
                >
                  <span className="font-bold block">{m.title}</span>
                  <span className="text-[10px] text-[#58616E] block mt-0.5">{m.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Generated Structured Prompt Output */}
      <section className="bg-white border border-[#E8E5DC] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F3F1EC]">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#8B94A0]">
              Engineered Output
            </span>
            <h3 className="font-display text-lg font-bold text-[#12151A]">
              Constructed Study Prompt
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSimulatedOutput(!showSimulatedOutput)}
              className="px-3.5 py-2 rounded-xl bg-[#FAF9F6] border border-[#E8E5DC] text-xs font-semibold text-[#12151A] hover:bg-[#F3F1EC] transition-colors"
            >
              {showSimulatedOutput ? 'Hide Preview Response' : 'Preview Sample AI Output'}
            </button>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0C4FD7] hover:bg-[#093FB0] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Prompt'}</span>
            </button>
          </div>
        </div>

        {/* Prompt code block */}
        <div className="relative">
          <pre className="p-4 sm:p-5 rounded-2xl bg-[#12151A] text-[#F8F7F4] font-mono text-xs leading-relaxed whitespace-pre-wrap overflow-x-auto border border-black/10 select-all">
            {generatedPrompt}
          </pre>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#58616E] pt-2">
          <span>{generatedPrompt.length} characters • Optimized for temperature 0.3–0.5</span>
          <span className="font-mono text-[#8B94A0]">Compatible: Gemini 1.5/2.0, Claude 3.5, GPT-4o</span>
        </div>
      </section>

      {/* Simulated Response Preview for Hackathon Demonstrations */}
      {showSimulatedOutput && (
        <section className="bg-white border-2 border-[#1A7B54] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-[#CCE9DB]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#EAF6F0] text-[#1A7B54] flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A7B54] font-bold block">
                  Simulated Output Preview
                </span>
                <h4 className="font-display text-base font-bold text-[#12151A]">
                  {simulatedOutput.headline}
                </h4>
              </div>
            </div>

            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#EAF6F0] text-[#1A7B54] font-bold border border-[#CCE9DB]">
              Deterministic Pedagogical Result
            </span>
          </div>

          <p className="text-sm font-semibold text-[#12151A] leading-relaxed">
            {simulatedOutput.summary}
          </p>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-[#58616E] uppercase tracking-wider block">
              {simulatedOutput.mainBodyTitle}
            </span>
            <div className="space-y-2 bg-[#FAF9F6] border border-[#E8E5DC] p-4 rounded-2xl text-xs text-[#12151A] leading-relaxed">
              {simulatedOutput.mainBodyContent.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Exam Trap */}
          <div className="bg-[#FDF2EF] border border-[#F5D3CA] p-4 rounded-2xl text-xs text-[#C04328] space-y-1">
            <span className="font-bold font-mono uppercase text-[10px] block">
              High-Yield Exam Distractor Trap
            </span>
            <p className="leading-relaxed font-medium">{simulatedOutput.examTrap}</p>
          </div>

          {/* Self-Check Question */}
          <div className="bg-[#F8F7F4] border border-[#E8E5DC] p-4 rounded-2xl space-y-2.5 text-xs text-[#12151A]">
            <span className="font-bold font-mono uppercase text-[10px] text-[#58616E] block">
              Instant Check Question Generated by Prompt
            </span>
            <p className="font-semibold">{simulatedOutput.practiceQuestion.question}</p>
            <div className="space-y-1 text-[#58616E]">
              {simulatedOutput.practiceQuestion.options.map((opt, i) => (
                <div key={i} className="py-0.5">{opt}</div>
              ))}
            </div>
            <div className="pt-2 border-t border-[#E8E5DC] text-[11px] text-[#1A7B54] font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Correct Answer: Option {simulatedOutput.practiceQuestion.correct} — {simulatedOutput.practiceQuestion.explanation}</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
