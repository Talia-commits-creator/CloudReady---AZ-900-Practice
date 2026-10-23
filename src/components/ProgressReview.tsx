import React, { useState } from 'react';
import {
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Bookmark,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Trash2,
  Clock,
  Layers,
  ArrowRight,
  Target,
  Zap,
} from 'lucide-react';
import { usePractice } from '../context/PracticeContext';
import { DOMAIN_LIST, AZ900_DOMAINS } from '../data/domains';
import { Question, DomainId } from '../types';
import { NavTab } from './Sidebar';

interface ProgressReviewProps {
  onStartQuiz: (mode: 'all' | 'quick10' | 'domain' | 'missed' | 'flagged', domainId?: string) => void;
  setActiveTab: (tab: NavTab) => void;
}

export const ProgressReview: React.FC<ProgressReviewProps> = ({ onStartQuiz, setActiveTab }) => {
  const {
    totalAttempted,
    totalCorrect,
    overallAccuracy,
    readinessScore,
    isPassing,
    studyStreak,
    domainStats,
    missedQuestions,
    unremediatedMissedQuestions,
    flaggedQuestions,
    quizSessions,
    attempts,
    clearAllData,
    loadSampleData,
    isSampleDataActive,
    recommendation,
    redeemedWeakSpots,
    startAlternateChallenge,
  } = usePractice();

  const [activeTab, setActiveTabState] = useState<'missed' | 'flagged' | 'sessions'>('missed');
  const [filterDomain, setFilterDomain] = useState<DomainId | 'all'>('all');
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const filteredMissed = missedQuestions.filter((q) => {
    if (filterDomain === 'all') return true;
    return q.domainId === filterDomain;
  });

  const filteredFlagged = flaggedQuestions.filter((q) => {
    if (filterDomain === 'all') return true;
    return q.domainId === filterDomain;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header Banner */}
      <div className="bg-white border border-[#E8E5DC] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono uppercase tracking-wider text-[#8B94A0]">
              Performance Analytics
            </span>
            <span className="text-[#8B94A0]">•</span>
            <span
              className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                isSampleDataActive
                  ? 'bg-[#EFF4FF] text-[#0C4FD7] border border-[#D0E0FD]'
                  : 'bg-[#EAF6F0] text-[#1A7B54] border border-[#CCE9DB]'
              }`}
            >
              {isSampleDataActive ? 'Sample Diagnostic Loaded' : 'Verified Learner Data'}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#12151A]">
            Learning Progress & Mistake Queue
          </h1>
          <p className="text-sm text-[#58616E] mt-1.5 max-w-xl leading-relaxed">
            Analytics calculated strictly from your actual submitted responses. Review previous misconceptions and seal knowledge gaps with the Weak-Spot Learning Loop.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {totalAttempted === 0 && !isSampleDataActive ? (
            <button
              onClick={loadSampleData}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E8E5DC] text-xs font-semibold text-[#12151A] hover:bg-[#F3F1EC] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0C4FD7]" />
              <span>Load sample diagnostic</span>
            </button>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#E8E5DC] text-xs font-semibold text-[#C04328] hover:bg-[#FDF2EF] transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset data</span>
            </button>
          )}

          {missedQuestions.length > 0 && (
            <button
              onClick={() => onStartQuiz('missed')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C04328] hover:bg-[#A8371F] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <span>Drill Missed ({missedQuestions.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-xl border border-[#E8E5DC] space-y-4">
            <h3 className="font-display text-xl font-bold text-[#12151A]">
              Reset Local Progress?
            </h3>
            <p className="text-xs text-[#58616E] leading-relaxed">
              This will reset your question attempts, flashcard ratings, and recorded quiz sessions in local storage.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl border border-[#E8E5DC] text-xs font-semibold text-[#58616E] hover:bg-[#FAF9F6]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearAllData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded-xl bg-[#C04328] hover:bg-[#A8371F] text-xs font-semibold text-white"
              >
                Yes, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E8E5DC] rounded-2xl p-5 shadow-xs">
          <span className="text-[10px] font-mono uppercase text-[#8B94A0] block">Readiness Score</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-[#12151A]">
              {readinessScore}
            </span>
            <span className="text-xs text-[#8B94A0] font-mono">/ 1000</span>
          </div>
          <span
            className={`text-[10px] font-bold font-mono block mt-1 ${
              isPassing ? 'text-[#1A7B54]' : 'text-[#0C4FD7]'
            }`}
          >
            {isPassing ? 'Passing Range' : 'Below 700 Target'}
          </span>
        </div>

        <div className="bg-white border border-[#E8E5DC] rounded-2xl p-5 shadow-xs">
          <span className="text-[10px] font-mono uppercase text-[#8B94A0] block">Questions Attempted</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-[#12151A]">
              {totalAttempted}
            </span>
            <span className="text-xs text-[#8B94A0] font-mono">/ 30</span>
          </div>
          <span className="text-[10px] text-[#58616E] block mt-1">
            {Math.round((totalAttempted / 30) * 100)}% bank coverage
          </span>
        </div>

        <div className="bg-white border border-[#E8E5DC] rounded-2xl p-5 shadow-xs">
          <span className="text-[10px] font-mono uppercase text-[#8B94A0] block">Overall Accuracy</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-[#12151A]">
              {overallAccuracy}%
            </span>
          </div>
          <span className="text-[10px] text-[#58616E] block mt-1">
            {totalCorrect} of {totalAttempted} correct
          </span>
        </div>

        <div className="bg-white border border-[#E8E5DC] rounded-2xl p-5 shadow-xs">
          <span className="text-[10px] font-mono uppercase text-[#8B94A0] block">Pending Mistakes</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-[#C04328]">
              {unremediatedMissedQuestions.length}
            </span>
          </div>
          <span className="text-[10px] text-[#C04328] font-semibold block mt-1">
            {unremediatedMissedQuestions.length > 0 ? 'Need alternate check' : 'All redeemed'}
          </span>
        </div>
      </div>

      {/* WEAK-SPOT LEARNING LOOP CALLOUT */}
      <section className="bg-white border-2 border-[#0C4FD7] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F3F1EC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EFF4FF] text-[#0C4FD7] flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#0C4FD7] font-bold block">
                Technical Creativity Highlight
              </span>
              <h2 className="font-display text-xl font-bold text-[#12151A]">
                The Weak-Spot Learning Loop
              </h2>
            </div>
          </div>

          <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#EFF4FF] text-[#0C4FD7] font-bold border border-[#D0E0FD] self-start sm:self-auto">
            6-Step Remediation Cycle
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#58616E] leading-relaxed">
          Standard quiz apps simply make you re-read the answer you just got wrong. CloudReady’s <strong>Weak-Spot Learning Loop</strong> takes your incorrect answers, identifies the underlying concept gap, and generates an <strong>alternate scenario question</strong> testing the same principle from a different angle. Answering correctly redeems your weak spot and updates your domain mastery.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px] font-mono pt-2">
          <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#E8E5DC] text-center">
            <span className="text-[#8B94A0] block text-[9px]">STEP 1</span>
            <span className="font-bold text-[#12151A]">Record Answer</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#E8E5DC] text-center">
            <span className="text-[#8B94A0] block text-[9px]">STEP 2</span>
            <span className="font-bold text-[#12151A]">Detect Gap</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#E8E5DC] text-center">
            <span className="text-[#8B94A0] block text-[9px]">STEP 3</span>
            <span className="font-bold text-[#12151A]">Review Queue</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#E8E5DC] text-center">
            <span className="text-[#8B94A0] block text-[9px]">STEP 4</span>
            <span className="font-bold text-[#12151A]">Study Advice</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#EFF4FF] border border-[#D0E0FD] text-center text-[#0C4FD7]">
            <span className="text-[#0C4FD7]/70 block text-[9px]">STEP 5</span>
            <span className="font-bold">Alternate Retry</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#EAF6F0] border border-[#CCE9DB] text-center text-[#1A7B54]">
            <span className="text-[#1A7B54]/70 block text-[9px]">STEP 6</span>
            <span className="font-bold">Score Updated</span>
          </div>
        </div>
      </section>

      {/* Topic-Level Visualizations */}
      <section className="bg-white border border-[#E8E5DC] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="font-display text-xl font-bold text-[#12151A]">
          Domain Proficiency Analysis
        </h2>

        <div className="space-y-4">
          {DOMAIN_LIST.map((domain) => {
            const stat = domainStats[domain.id];

            return (
              <div
                key={domain.id}
                className="p-5 rounded-2xl border border-[#F3F1EC] bg-[#FAF9F6] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 sm:max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white border border-[#E8E5DC] text-[#58616E]">
                      Weight: {domain.weightRange}
                    </span>
                    <h3 className="font-display text-base font-bold text-[#12151A]">
                      {domain.name}
                    </h3>
                  </div>
                  <p className="text-xs text-[#58616E] leading-relaxed">
                    {domain.description}
                  </p>
                </div>

                <div className="flex items-center gap-6 sm:text-right">
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2 sm:justify-end">
                      <span className="font-display text-2xl font-bold text-[#12151A]">
                        {stat.attempted > 0 ? `${stat.accuracy}%` : '—'}
                      </span>
                      <span className="text-xs font-mono text-[#8B94A0]">
                        ({stat.correct} / {stat.attempted} correct)
                      </span>
                    </div>

                    <div className="w-36 bg-[#E8E5DC] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${stat.attempted > 0 ? stat.accuracy : 0}%`,
                          backgroundColor: domain.color,
                        }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => onStartQuiz('domain', domain.id)}
                    className="p-2.5 rounded-xl bg-white border border-[#E8E5DC] text-[#12151A] hover:bg-[#FAF9F6] text-xs font-semibold shrink-0"
                    title="Practice this domain"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tabs: Missed Questions Queue vs Bookmarked vs Recent Sessions */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8E5DC] pb-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTabState('missed')}
              className={`pb-2 text-sm font-semibold transition-colors flex items-center gap-1.5 border-b-2 -mb-3.5 ${
                activeTab === 'missed'
                  ? 'border-[#C04328] text-[#C04328]'
                  : 'border-transparent text-[#58616E] hover:text-[#12151A]'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <span>Missed Queue ({missedQuestions.length})</span>
            </button>

            <button
              onClick={() => setActiveTabState('flagged')}
              className={`pb-2 text-sm font-semibold transition-colors flex items-center gap-1.5 border-b-2 -mb-3.5 ${
                activeTab === 'flagged'
                  ? 'border-[#0C4FD7] text-[#0C4FD7]'
                  : 'border-transparent text-[#58616E] hover:text-[#12151A]'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Bookmarked ({flaggedQuestions.length})</span>
            </button>

            <button
              onClick={() => setActiveTabState('sessions')}
              className={`pb-2 text-sm font-semibold transition-colors flex items-center gap-1.5 border-b-2 -mb-3.5 ${
                activeTab === 'sessions'
                  ? 'border-[#12151A] text-[#12151A]'
                  : 'border-transparent text-[#58616E] hover:text-[#12151A]'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Recent Sessions ({quizSessions.length})</span>
            </button>
          </div>

          {activeTab !== 'sessions' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#58616E]">Domain:</span>
              <select
                value={filterDomain}
                onChange={(e) => setFilterDomain(e.target.value as DomainId | 'all')}
                className="text-xs bg-white border border-[#E8E5DC] rounded-lg px-2.5 py-1.5 text-[#12151A]"
              >
                <option value="all">All Domains</option>
                <option value="cloud-concepts">Cloud Concepts</option>
                <option value="architecture-services">Architecture & Services</option>
                <option value="management-governance">Management & Governance</option>
              </select>
            </div>
          )}
        </div>

        {/* Tab 1: Missed Questions Queue with Weak-Spot Alternate Retry */}
        {activeTab === 'missed' && (
          <div className="space-y-4">
            {filteredMissed.length === 0 ? (
              <div className="bg-white border border-[#E8E5DC] rounded-3xl p-8 sm:p-12 text-center shadow-xs space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#1A7B54] mx-auto mb-2" />
                <h3 className="font-display text-lg font-bold text-[#12151A]">
                  Missed Questions Queue is Clear
                </h3>
                <p className="text-xs text-[#58616E] max-w-sm mx-auto leading-relaxed">
                  You have answered all tested questions correctly or have not logged any mistakes in this filter.
                </p>
              </div>
            ) : (
              filteredMissed.map((q) => {
                const attempt = attempts[q.id];
                const selectedOpt = q.options.find((o) => o.id === attempt?.selectedOptionId);
                const correctOpt = q.options.find((o) => o.id === q.correctOptionId);
                const isRedeemed = !!redeemedWeakSpots[q.id];

                return (
                  <div
                    key={q.id}
                    className={`bg-white border rounded-3xl p-6 shadow-xs space-y-4 transition-all ${
                      isRedeemed ? 'border-[#CCE9DB] bg-[#FCFDFD]' : 'border-[#E8E5DC]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#0C4FD7]">
                          {AZ900_DOMAINS[q.domainId].name}
                        </span>
                        <span>•</span>
                        <span className="text-[#58616E] font-mono">{q.subtopic}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isRedeemed ? (
                          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#EAF6F0] text-[#1A7B54] font-bold border border-[#CCE9DB] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Redeemed via Alternate Question</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#FDF2EF] text-[#C04328] font-bold border border-[#F5D3CA]">
                            Pending Remediation
                          </span>
                        )}
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#E8E5DC] text-[#8B94A0]">
                          {q.difficulty}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-[#12151A]">{q.question}</h4>

                    {/* Comparison card */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-3 rounded-xl bg-[#FDF2EF] border border-[#F5D3CA] text-[#C04328]">
                        <span className="font-bold block text-[10px] uppercase font-mono">Your Previous Answer:</span>
                        <span>Option {attempt?.selectedOptionId}: {selectedOpt?.text}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#EAF6F0] border border-[#CCE9DB] text-[#1A7B54]">
                        <span className="font-bold block text-[10px] uppercase font-mono">Correct Answer:</span>
                        <span>Option {q.correctOptionId}: {correctOpt?.text}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#58616E] bg-[#F8F7F4] p-3.5 rounded-xl leading-relaxed">
                      {q.explanation}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F3F1EC] text-xs">
                      <a
                        href={q.learnUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[#0C4FD7] hover:underline font-medium"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{q.learnTitle}</span>
                      </a>

                      <div className="flex items-center gap-2">
                        {/* FEATURE 5: Weak-Spot Learning Loop alternate retry button */}
                        <button
                          onClick={() => startAlternateChallenge(q.id)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0C4FD7] hover:bg-[#093FB0] text-white font-semibold transition-colors shadow-xs text-xs"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>Retry with Alternate Scenario</span>
                        </button>

                        <button
                          onClick={() => onStartQuiz('missed')}
                          className="px-3.5 py-2 rounded-xl border border-[#E8E5DC] text-[#12151A] hover:bg-[#FAF9F6] font-semibold text-xs"
                        >
                          Re-attempt original
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Bookmarked Questions */}
        {activeTab === 'flagged' && (
          <div className="space-y-4">
            {filteredFlagged.length === 0 ? (
              <div className="bg-white border border-[#E8E5DC] rounded-3xl p-8 sm:p-12 text-center shadow-xs space-y-2">
                <Bookmark className="w-10 h-10 text-[#0C4FD7] mx-auto mb-2" />
                <h3 className="font-display text-lg font-bold text-[#12151A]">
                  No Bookmarked Questions
                </h3>
                <p className="text-xs text-[#58616E] max-w-sm mx-auto leading-relaxed">
                  Bookmark questions during practice quizzes to assemble a targeted review list here.
                </p>
              </div>
            ) : (
              filteredFlagged.map((q) => (
                <div
                  key={q.id}
                  className="bg-white border border-[#E8E5DC] rounded-2xl p-6 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#0C4FD7]">
                      {AZ900_DOMAINS[q.domainId].name} • {q.subtopic}
                    </span>
                    <span className="font-mono text-[#8B94A0]">{q.difficulty}</span>
                  </div>

                  <h4 className="text-sm font-bold text-[#12151A]">{q.question}</h4>

                  <div className="text-xs text-[#1A7B54] font-semibold bg-[#EAF6F0] p-3 rounded-xl border border-[#CCE9DB]">
                    Correct: Option {q.correctOptionId} ({q.options.find(o => o.id === q.correctOptionId)?.text})
                  </div>

                  <p className="text-xs text-[#58616E] bg-[#F8F7F4] p-3 rounded-xl leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Recent Practice Sessions */}
        {activeTab === 'sessions' && (
          <div className="bg-white border border-[#E8E5DC] rounded-3xl p-6 shadow-xs divide-y divide-[#F3F1EC]">
            {quizSessions.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#58616E]">
                No practice sessions recorded yet. Complete a quiz to view your historical logs here.
              </div>
            ) : (
              quizSessions.map((session) => (
                <div key={session.id} className="py-4 flex items-center justify-between text-sm">
                  <div>
                    <p className="font-bold text-[#12151A]">{session.title}</p>
                    <p className="text-xs text-[#8B94A0] font-mono mt-0.5">
                      {new Date(session.timestamp).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span
                        className={`text-base font-extrabold font-mono ${
                          session.percentage >= 70 ? 'text-[#1A7B54]' : 'text-[#C04328]'
                        }`}
                      >
                        {session.percentage}%
                      </span>
                      <p className="text-[11px] text-[#58616E]">
                        {session.correctCount} / {session.totalQuestions} correct
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        session.percentage >= 70
                          ? 'bg-[#EAF6F0] text-[#1A7B54]'
                          : 'bg-[#FDF2EF] text-[#C04328]'
                      }`}
                    >
                      {session.percentage >= 70 ? 'PASS' : 'RETRY'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
};
