import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Zap,
  Target,
  Flame,
  Layers,
  AlertCircle,
  CheckCircle2,
  Clock,
  RotateCcw,
  BarChart,
  ChevronRight,
  Bookmark,
  FileCheck,
  PlayCircle,
  Award,
} from 'lucide-react';
import { usePractice } from '../context/PracticeContext';
import { DOMAIN_LIST } from '../data/domains';
import { DomainId } from '../types';
import { NavTab } from './Sidebar';

interface DashboardProps {
  onStartQuiz: (mode: 'all' | 'quick10' | 'domain' | 'missed' | 'flagged', domainId?: string) => void;
  setActiveTab: (tab: NavTab) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onStartQuiz, setActiveTab }) => {
  const {
    questions,
    totalAttempted,
    totalCorrect,
    overallAccuracy,
    readinessScore,
    isPassing,
    studyStreak,
    domainStats,
    missedQuestions,
    flaggedQuestions,
    recommendation,
    flashcardStats,
    isSampleDataActive,
    loadSampleData,
    quizSessions,
    lastActiveItem,
  } = usePractice();

  const isZeroState = totalAttempted === 0 && !isSampleDataActive;

  return (
    <div className="space-y-8 pb-16">
      {/* Editorial Welcome Hero */}
      <section className="bg-white border border-[#E8E5DC] rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
        {/* Subtle background architectural graphic element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#EFF4FF]/60 via-[#F8F7F4]/20 to-transparent -z-0 pointer-events-none rounded-bl-full" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#E8E5DC] text-xs font-mono text-[#58616E]">
            <span className="w-2 h-2 rounded-full bg-[#0C4FD7] animate-pulse"></span>
            <span>AZ-900 Prep Workspace</span>
            <span className="text-[#8B94A0]">•</span>
            <span>Target: October 2026</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#12151A] tracking-tight leading-[1.12]">
            Your next cloud milestone starts here.
          </h1>

          <p className="text-[#58616E] text-base sm:text-lg max-w-2xl leading-relaxed">
            Practice 30 authentic exam questions across all three official domains, master tricky distractor logic, and track your readiness toward the 700/1000 passing mark.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onStartQuiz('quick10')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0C4FD7] hover:bg-[#093FB0] text-white font-semibold text-sm transition-all shadow-xs group"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Start practicing</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => setActiveTab('promptlab')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#EFF4FF] hover:bg-[#E0ECFD] border border-[#D0E0FD] text-[#0C4FD7] font-semibold text-sm transition-colors shadow-2xs"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Prompt Lab (AI Prompts)</span>
            </button>

            <button
              onClick={() => setActiveTab('plan')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#F8F7F4] hover:bg-[#EFECE5] border border-[#E8E5DC] text-[#12151A] font-semibold text-sm transition-colors"
            >
              <span>7-day study plan</span>
            </button>

            {isZeroState && (
              <button
                onClick={loadSampleData}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-[#FAF9F6] border border-[#E8E5DC] text-xs font-semibold text-[#58616E] hover:text-[#12151A] hover:bg-white transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0C4FD7]" />
                <span>Load sample diagnostic</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Row 2: Readiness Visualization & Compact Stats */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Engaging Readiness Gauge Card (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E8E5DC] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#F3F1EC]">
              <div className="space-y-0.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8B94A0]">
                  Official Scaled Metric
                </span>
                <h3 className="font-display text-lg font-bold text-[#12151A]">
                  Exam Readiness Score
                </h3>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold font-mono ${
                  readinessScore >= 700
                    ? 'bg-[#EAF6F0] text-[#1A7B54] border border-[#CCE9DB]'
                    : readinessScore > 0
                    ? 'bg-[#EFF4FF] text-[#0C4FD7] border border-[#D0E0FD]'
                    : 'bg-[#FAF9F6] text-[#8B94A0] border border-[#E8E5DC]'
                }`}
              >
                {readinessScore >= 700 ? 'PASSING (700+)' : readinessScore > 0 ? 'DEVELOPING' : 'NOT STARTED'}
              </span>
            </div>

            {/* Score Big Display */}
            <div className="py-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-5xl sm:text-6xl font-black text-[#12151A] tracking-tight">
                    {readinessScore}
                  </span>
                  <span className="text-lg font-mono text-[#8B94A0]">/ 1000</span>
                </div>
                <p className="text-xs text-[#58616E] mt-1.5">
                  {totalAttempted === 0
                    ? 'Take your first quiz to calculate your weighted readiness.'
                    : `Weighted by official AZ-900 domain ratios (${totalAttempted} answered).`}
                </p>
              </div>

              {/* Progress Ring / Bar Breakdown */}
              <div className="sm:text-right space-y-1">
                <span className="text-xs font-mono text-[#8B94A0]">Passing Threshold: 700 pts</span>
                <p className="text-xs font-bold text-[#12151A]">
                  {readinessScore >= 700 ? 'Eligible for Exam Success' : `${Math.max(0, 700 - readinessScore)} pts to pass`}
                </p>
              </div>
            </div>

            {/* Gauge Bar with threshold indicator */}
            <div className="relative pt-2">
              <div className="w-full bg-[#F3F1EC] h-3.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.min(100, Math.max(0, readinessScore / 10))}%`,
                    backgroundColor: readinessScore >= 700 ? '#1A7B54' : '#0C4FD7',
                  }}
                />
              </div>

              {/* 700 marker */}
              <div
                className="absolute top-1 bottom-0 w-0.5 bg-[#12151A] z-10"
                style={{ left: '70%' }}
                title="700 Pass Mark"
              />
              <div className="flex justify-between text-[11px] font-mono text-[#8B94A0] mt-2">
                <span>0</span>
                <span className="text-[#12151A] font-bold">Pass: 700</span>
                <span>1000</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#F3F1EC] flex items-center justify-between text-xs text-[#58616E]">
            <span>Passing standard: 70% scaled score across all 3 domains</span>
            <button
              onClick={() => setActiveTab('progress')}
              className="font-semibold text-[#0C4FD7] hover:underline flex items-center gap-1"
            >
              <span>View score calculation</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Pick Up Where You Left Off & Study Streak (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Pick Up Where You Left Off Card */}
          <div className="bg-white border border-[#E8E5DC] rounded-3xl p-6 shadow-xs flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8B94A0]">
                  Continue Learning
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#E8E5DC] text-[#58616E]">
                  Recent Activity
                </span>
              </div>

              <h4 className="font-display text-lg font-bold text-[#12151A]">
                {lastActiveItem ? lastActiveItem.title : 'Quick 10 Diagnostic Drill'}
              </h4>
              <p className="text-xs text-[#58616E] mt-1 leading-relaxed">
                {lastActiveItem
                  ? `Resume your last session in ${lastActiveItem.type === 'flashcards' ? 'Flashcards' : 'Practice Quiz'}.`
                  : 'Start with a fast 10-question mixed quiz to evaluate your current baseline.'}
              </p>
            </div>

            <div className="pt-4 border-t border-[#F3F1EC] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#8B94A0]">
                {lastActiveItem ? 'Saved checkpoint' : 'Recommended starter'}
              </span>
              <button
                onClick={() => {
                  if (lastActiveItem && lastActiveItem.type === 'flashcards') {
                    setActiveTab('flashcards');
                  } else {
                    onStartQuiz('quick10');
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#12151A] hover:bg-black text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Resume</span>
              </button>
            </div>
          </div>

          {/* Compact 3-Metric Strip */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white border border-[#E8E5DC] rounded-2xl p-4 shadow-xs text-center">
              <span className="text-[10px] font-mono uppercase text-[#8B94A0] block">Attempted</span>
              <span className="font-display text-xl font-bold text-[#12151A] mt-1 block">
                {totalAttempted} <span className="text-xs font-normal text-[#8B94A0]">/ 30</span>
              </span>
            </div>

            <div className="bg-white border border-[#E8E5DC] rounded-2xl p-4 shadow-xs text-center">
              <span className="text-[10px] font-mono uppercase text-[#8B94A0] block">Accuracy</span>
              <span className="font-display text-xl font-bold text-[#12151A] mt-1 block">
                {overallAccuracy}%
              </span>
            </div>

            <div className="bg-white border border-[#E8E5DC] rounded-2xl p-4 shadow-xs text-center">
              <span className="text-[10px] font-mono uppercase text-[#8B94A0] block">Streak</span>
              <span className="font-display text-xl font-bold text-[#C04328] mt-1 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-current" />
                {studyStreak}d
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE 5: Rule-Based Recommendation Card */}
      <section className="bg-white border-2 border-[#12151A] rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] border border-[#D0E0FD] flex items-center justify-center text-[#0C4FD7] shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#8B94A0]">
                Study Recommendation Engine
              </span>
              <h3 className="font-display text-xl font-bold text-[#12151A]">
                {recommendation.headline}
              </h3>
            </div>
          </div>

          <span
            className={`text-xs px-3 py-1 rounded-full font-bold font-mono self-start sm:self-auto ${
              recommendation.status === 'critical'
                ? 'bg-[#FDF2EF] text-[#C04328] border border-[#F5D3CA]'
                : recommendation.status === 'needs-attention'
                ? 'bg-[#EFF4FF] text-[#0C4FD7] border border-[#D0E0FD]'
                : recommendation.status === 'on-track'
                ? 'bg-[#EAF6F0] text-[#1A7B54] border border-[#CCE9DB]'
                : 'bg-[#FAF9F6] text-[#58616E] border border-[#E8E5DC]'
            }`}
          >
            {recommendation.status === 'critical'
              ? 'Priority Fix'
              : recommendation.status === 'needs-attention'
              ? 'Coverage Gap'
              : recommendation.status === 'on-track'
              ? 'High Readiness'
              : 'Initial Diagnostic'}
          </span>
        </div>

        <p className="text-sm text-[#58616E] mt-3 leading-relaxed max-w-3xl">
          {recommendation.reason}
        </p>

        {recommendation.keyWeaknesses.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#F3F1EC] flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-[#8B94A0]">Target concepts:</span>
            {recommendation.keyWeaknesses.map((topic, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-[#F8F7F4] border border-[#E8E5DC] text-xs font-semibold text-[#12151A]"
              >
                {topic}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              if (recommendation.actionType === 'start-diagnostic') {
                onStartQuiz('quick10');
              } else if (recommendation.actionType === 'quiz-missed') {
                onStartQuiz('missed');
              } else if (recommendation.actionType === 'flashcards-review') {
                setActiveTab('flashcards');
              } else {
                onStartQuiz('domain', recommendation.priorityDomainId);
              }
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0C4FD7] hover:bg-[#093FB0] text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <span>{recommendation.suggestedActionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {missedQuestions.length > 0 && recommendation.actionType !== 'quiz-missed' && (
            <button
              onClick={() => onStartQuiz('missed')}
              className="px-4 py-2.5 rounded-xl bg-[#FAF9F6] hover:bg-[#F3F1EC] border border-[#E8E5DC] text-xs font-semibold text-[#C04328] transition-colors"
            >
              Review {missedQuestions.length} Missed Questions
            </button>
          )}
        </div>
      </section>

      {/* Topic-Performance Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-[#12151A]">
              Domain Performance Overview
            </h2>
            <p className="text-xs text-[#58616E] mt-0.5">
              Official AZ-900 exam domain proportions and your verified accuracy per topic.
            </p>
          </div>
          <button
            onClick={() => onStartQuiz('all')}
            className="text-xs font-semibold text-[#0C4FD7] hover:underline hidden sm:inline-flex items-center gap-1"
          >
            <span>Take full 30-question bank</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DOMAIN_LIST.map((domain) => {
            const stat = domainStats[domain.id];
            const hasAttempts = stat.attempted > 0;
            const isPassingDomain = stat.accuracy >= 70;

            return (
              <div
                key={domain.id}
                className="bg-white border border-[#E8E5DC] rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:border-[#DCD7CB] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#E8E5DC] text-[#58616E]">
                      Weight: {domain.weightRange}
                    </span>
                    {hasAttempts ? (
                      <span
                        className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                          isPassingDomain
                            ? 'bg-[#EAF6F0] text-[#1A7B54]'
                            : 'bg-[#FDF2EF] text-[#C04328]'
                        }`}
                      >
                        {stat.accuracy}% Acc.
                      </span>
                    ) : (
                      <span className="text-xs text-[#8B94A0] font-mono">Unattempted</span>
                    )}
                  </div>

                  <h3 className="font-display text-lg font-bold text-[#12151A] mt-3">
                    {domain.name}
                  </h3>
                  <p className="text-xs text-[#58616E] mt-1.5 leading-relaxed line-clamp-2">
                    {domain.description}
                  </p>

                  {/* Accuracy Bar */}
                  <div className="mt-5 space-y-1.5">
                    <div className="flex justify-between text-xs text-[#58616E]">
                      <span>{stat.correct} of {stat.attempted} correct</span>
                      <span className="font-mono text-[#8B94A0]">{stat.total} bank questions</span>
                    </div>
                    <div className="w-full bg-[#F3F1EC] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${stat.attempted > 0 ? stat.accuracy : 0}%`,
                          backgroundColor: domain.color,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#F3F1EC] flex items-center justify-between">
                  <span className="text-xs text-[#58616E]">
                    {stat.attempted} answered
                  </span>
                  <button
                    onClick={() => onStartQuiz('domain', domain.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#12151A] hover:text-[#0C4FD7] transition-colors"
                  >
                    <span>Practice Domain</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Launchers Bar */}
      <section className="bg-[#FAF9F6] border border-[#E8E5DC] rounded-3xl p-6 sm:p-8">
        <h3 className="font-display text-lg font-bold text-[#12151A] mb-4">
          Curated Practice Workflows
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Quick 10 */}
          <button
            onClick={() => onStartQuiz('quick10')}
            className="bg-white border border-[#E8E5DC] hover:border-[#0C4FD7] p-5 rounded-2xl text-left transition-all group shadow-xs"
          >
            <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] text-[#0C4FD7] flex items-center justify-center mb-3">
              <Clock className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-[#12151A] group-hover:text-[#0C4FD7] transition-colors">
              Quick 10 Quiz
            </h4>
            <p className="text-xs text-[#58616E] mt-1">
              High-yield 10-question mixed diagnostic across all 3 domains.
            </p>
          </button>

          {/* Missed Drill */}
          <button
            onClick={() => onStartQuiz('missed')}
            disabled={missedQuestions.length === 0}
            className={`p-5 rounded-2xl text-left transition-all shadow-xs border ${
              missedQuestions.length > 0
                ? 'bg-white border-[#E8E5DC] hover:border-[#C04328] group'
                : 'bg-white/50 border-[#F3F1EC] opacity-60 cursor-not-allowed'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-[#FDF2EF] text-[#C04328] flex items-center justify-center mb-3">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#12151A] group-hover:text-[#C04328] transition-colors">
                Missed Questions Drill
              </h4>
              {missedQuestions.length > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#C04328] text-white">
                  {missedQuestions.length}
                </span>
              )}
            </div>
            <p className="text-xs text-[#58616E] mt-1">
              Clear your mistake log by re-attempting missed concepts.
            </p>
          </button>

          {/* Bookmarked Questions */}
          <button
            onClick={() => onStartQuiz('flagged')}
            disabled={flaggedQuestions.length === 0}
            className={`p-5 rounded-2xl text-left transition-all shadow-xs border ${
              flaggedQuestions.length > 0
                ? 'bg-white border-[#E8E5DC] hover:border-[#12151A] group'
                : 'bg-white/50 border-[#F3F1EC] opacity-60 cursor-not-allowed'
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-[#F8F7F4] text-[#12151A] flex items-center justify-center mb-3 border border-[#E8E5DC]">
              <Bookmark className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#12151A] transition-colors">
                Bookmarked Review
              </h4>
              {flaggedQuestions.length > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#12151A] text-white">
                  {flaggedQuestions.length}
                </span>
              )}
            </div>
            <p className="text-xs text-[#58616E] mt-1">
              Review questions you saved for extra revision.
            </p>
          </button>

          {/* Full Mock Simulation */}
          <button
            onClick={() => onStartQuiz('all')}
            className="bg-white border border-[#E8E5DC] hover:border-[#0C4FD7] p-5 rounded-2xl text-left transition-all group shadow-xs"
          >
            <div className="w-9 h-9 rounded-xl bg-[#EAF6F0] text-[#1A7B54] flex items-center justify-center mb-3">
              <FileCheck className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-[#12151A] group-hover:text-[#0C4FD7] transition-colors">
              Full 30-Question Exam
            </h4>
            <p className="text-xs text-[#58616E] mt-1">
              Complete mock simulation covering the entire AZ-900 syllabus.
            </p>
          </button>
        </div>
      </section>

      {/* Explicit Independent Disclosure Banner */}
      <section className="bg-white border border-[#E8E5DC] rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#0C4FD7] font-bold block">
              Independent Practice Prototype
            </span>
            <p className="text-xs text-[#58616E] leading-relaxed max-w-3xl">
              CloudReady is an independent learning prototype created to help learners practise Azure Fundamentals concepts. It is not affiliated with, endorsed by, or an official product of Microsoft. All practice questions are independently authored and are not official exam questions.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('promptlab')}
            className="px-4 py-2 rounded-xl bg-[#FAF9F6] border border-[#E8E5DC] text-xs font-semibold text-[#12151A] hover:bg-[#F3F1EC] transition-colors whitespace-nowrap shrink-0"
          >
            Open Prompt Lab
          </button>
        </div>
      </section>
    </div>
  );
};
