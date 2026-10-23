import React, { useState, useMemo, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bookmark,
  ArrowRight,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Award,
  Clock,
  Layers,
  Lightbulb,
  X,
  Zap,
} from 'lucide-react';
import { usePractice } from '../context/PracticeContext';
import { Question, DomainId, Difficulty } from '../types';
import { AZ900_DOMAINS } from '../data/domains';
import { NavTab } from './Sidebar';

export type QuizMode = 'all' | 'quick10' | 'domain' | 'missed' | 'flagged';
export type QuizQuestionState = 'unanswered' | 'submitted' | 'completed';

export interface SubmittedAnswerState {
  questionId: string;
  selectedOptionId: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
}

interface QuizProps {
  initialMode?: QuizMode;
  initialDomainId?: DomainId;
  setActiveTab: (tab: NavTab) => void;
}

export const Quiz: React.FC<QuizProps> = ({
  initialMode = 'quick10',
  initialDomainId,
  setActiveTab,
}) => {
  const {
    questions: allQuestions,
    attempts,
    questionFlags,
    recordAttempt,
    toggleFlagQuestion,
    recordQuizSession,
    missedQuestions: globalMissed,
    flaggedQuestions: globalFlagged,
  } = usePractice();

  const [mode, setMode] = useState<QuizMode>(initialMode);
  const [selectedDomain, setSelectedDomain] = useState<DomainId | 'all'>(
    initialDomainId || 'all'
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');

  // Question pool generator snapshot
  const buildQuestionPool = (
    targetMode: QuizMode,
    targetDomain: DomainId | 'all',
    targetDifficulty: Difficulty | 'all'
  ): Question[] => {
    let pool: Question[] = [];

    if (targetMode === 'missed') {
      pool = [...globalMissed];
    } else if (targetMode === 'flagged') {
      pool = [...globalFlagged];
    } else {
      pool = [...allQuestions];
    }

    if (targetDomain !== 'all') {
      pool = pool.filter((q) => q.domainId === targetDomain);
    }

    if (targetDifficulty !== 'all') {
      pool = pool.filter((q) => q.difficulty === targetDifficulty);
    }

    if (targetMode === 'quick10') {
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 10);
    }

    return pool;
  };

  // Frozen session question pool (never mutated mid-session by attempt records)
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>(() => {
    return buildQuestionPool(initialMode, initialDomainId || 'all', 'all');
  });

  // Explicit quiz state machine
  const [quizState, setQuizState] = useState<QuizQuestionState>('unanswered');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [submittedAnswer, setSubmittedAnswer] = useState<SubmittedAnswerState | null>(null);
  const [sessionResults, setSessionResults] = useState<
    Array<{
      question: Question;
      selectedOptionId: 'A' | 'B' | 'C' | 'D';
      isCorrect: boolean;
    }>
  >([]);

  const startQuizSession = (
    targetMode: QuizMode = mode,
    targetDomain: DomainId | 'all' = selectedDomain,
    targetDifficulty: Difficulty | 'all' = selectedDifficulty
  ) => {
    const questions = buildQuestionPool(targetMode, targetDomain, targetDifficulty);
    setSessionQuestions(questions);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setSubmittedAnswer(null);
    setQuizState('unanswered');
    setSessionResults([]);
  };

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
    if (initialDomainId) {
      setSelectedDomain(initialDomainId);
    }
    startQuizSession(initialMode, initialDomainId || 'all', selectedDifficulty);
  }, [initialMode, initialDomainId]);

  const currentQuestion: Question | undefined = sessionQuestions[currentIndex];
  const isAnswerSubmitted = quizState === 'submitted';
  const isQuizComplete = quizState === 'completed';
  const isLastQuestion = currentIndex + 1 >= sessionQuestions.length;

  const handleSelectOption = (optionId: 'A' | 'B' | 'C' | 'D') => {
    // Selecting an option must never submit or advance; only permitted while unanswered
    if (quizState !== 'unanswered') return;
    setSelectedOptionId(optionId);
  };

  const handleSubmitAnswer = () => {
    // Validate answer against current question key and lock submission
    if (quizState !== 'unanswered' || !selectedOptionId || !currentQuestion) return;

    const isCorrect = selectedOptionId === currentQuestion.correctOptionId;
    recordAttempt(currentQuestion.id, selectedOptionId, isCorrect);

    setSubmittedAnswer({
      questionId: currentQuestion.id,
      selectedOptionId,
      isCorrect,
    });

    setSessionResults((prev) => [
      ...prev,
      {
        question: currentQuestion,
        selectedOptionId,
        isCorrect,
      },
    ]);

    setQuizState('submitted');
  };

  const handleNextQuestion = () => {
    if (quizState !== 'submitted') return;

    if (!isLastQuestion) {
      // Reset selected answer, feedback, and submission state cleanly for next question
      setSelectedOptionId(null);
      setSubmittedAnswer(null);
      setQuizState('unanswered');
      setCurrentIndex((prev) => prev + 1);
    } else {
      const correctCount = sessionResults.filter((r) => r.isCorrect).length;
      const total = sessionResults.length;
      const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

      let title = 'Practice Quiz';
      if (mode === 'quick10') title = 'Quick 10 Diagnostic';
      else if (mode === 'missed') title = 'Missed Questions Drill';
      else if (mode === 'flagged') title = 'Bookmarked Questions Review';
      else if (selectedDomain !== 'all') title = `${AZ900_DOMAINS[selectedDomain].name} Drill`;
      else title = 'Full Exam Simulation';

      recordQuizSession({
        title,
        totalQuestions: total,
        correctCount,
        percentage,
        domainId: selectedDomain,
      });

      setQuizState('completed');
    }
  };

  const handleRestartQuiz = () => {
    startQuizSession(mode, selectedDomain, selectedDifficulty);
  };

  // Keyboard accessibility: 1,2,3,4 or A,B,C,D to pick, Enter to submit/advance
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLSelectElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // If user pressed Enter on a focused button, let the native button click handle it
      if (e.key === 'Enter' && (e.target as HTMLElement)?.tagName === 'BUTTON') {
        return;
      }

      if (quizState === 'unanswered') {
        if (e.key === '1' || e.key.toUpperCase() === 'A') handleSelectOption('A');
        else if (e.key === '2' || e.key.toUpperCase() === 'B') handleSelectOption('B');
        else if (e.key === '3' || e.key.toUpperCase() === 'C') handleSelectOption('C');
        else if (e.key === '4' || e.key.toUpperCase() === 'D') handleSelectOption('D');
        else if (e.key === 'Enter' && selectedOptionId) {
          e.preventDefault();
          handleSubmitAnswer();
        }
      } else if (quizState === 'submitted') {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleNextQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quizState, selectedOptionId, currentIndex, sessionQuestions, currentQuestion, sessionResults]);

  // Empty state if pool is 0
  if (sessionQuestions.length === 0) {
    return (
      <div className="bg-white border border-[#E8E5DC] rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto my-12 shadow-xs space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#F8F7F4] border border-[#E8E5DC] flex items-center justify-center mx-auto text-[#0C4FD7]">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h3 className="font-display text-2xl font-bold text-[#12151A]">
          {mode === 'missed'
            ? 'No Missed Questions!'
            : mode === 'flagged'
            ? 'No Bookmarked Questions'
            : 'No Matching Questions'}
        </h3>
        <p className="text-sm text-[#58616E] max-w-md mx-auto leading-relaxed">
          {mode === 'missed'
            ? 'Terrific job! You do not currently have any incorrect answers logged in this filter.'
            : mode === 'flagged'
            ? 'Bookmark questions during drills to review them here.'
            : 'Try selecting a different domain or difficulty filter.'}
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={() => {
              setMode('quick10');
              setSelectedDomain('all');
              setSelectedDifficulty('all');
              startQuizSession('quick10', 'all', 'all');
            }}
            className="px-5 py-2.5 rounded-xl bg-[#0C4FD7] hover:bg-[#093FB0] text-white text-xs font-semibold shadow-xs"
          >
            Launch 10-Question Quiz
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-5 py-2.5 rounded-xl bg-[#F8F7F4] border border-[#E8E5DC] text-[#12151A] text-xs font-semibold hover:bg-[#EFECE5]"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Quiz Results Summary Screen
  if (isQuizComplete) {
    const correctCount = sessionResults.filter((r) => r.isCorrect).length;
    const totalCount = sessionResults.length;
    const percentage = Math.round((correctCount / totalCount) * 100);
    const isPassing = percentage >= 70;
    const missedInSession = sessionResults.filter((r) => !r.isCorrect);

    return (
      <div className="max-w-3xl mx-auto space-y-8 pb-16">
        {/* Results Card */}
        <div className="bg-white border border-[#E8E5DC] rounded-3xl p-8 sm:p-12 shadow-xs text-center space-y-4">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-2 ${
              isPassing ? 'bg-[#EAF6F0] text-[#1A7B54]' : 'bg-[#FDF2EF] text-[#C04328]'
            }`}
          >
            <Award className="w-8 h-8" />
          </div>

          <span className="text-xs font-mono uppercase tracking-wider text-[#8B94A0]">
            Quiz Session Summary
          </span>

          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#12151A]">
            {isPassing ? 'Passing Standard Met!' : 'Focus & Reinforce'}
          </h2>

          <p className="text-sm text-[#58616E] max-w-md mx-auto leading-relaxed">
            {isPassing
              ? `You scored ${percentage}%, exceeding the official Microsoft AZ-900 70% threshold.`
              : `You scored ${percentage}%. AZ-900 requires 70% to pass. Review your missed concepts below.`}
          </p>

          <div className="py-4 flex justify-center items-baseline gap-3">
            <span className="font-display text-6xl font-black text-[#12151A]">
              {percentage}%
            </span>
            <span className="text-sm text-[#8B94A0] font-mono">
              ({correctCount} / {totalCount} correct)
            </span>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => startQuizSession(mode, selectedDomain, selectedDifficulty)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0C4FD7] hover:bg-[#093FB0] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake quiz</span>
            </button>

            {missedInSession.length > 0 && (
              <button
                onClick={() => {
                  setMode('missed');
                  startQuizSession('missed', selectedDomain, selectedDifficulty);
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FAF9F6] hover:bg-[#F3F1EC] border border-[#E8E5DC] text-xs font-semibold text-[#C04328]"
              >
                <span>Drill {missedInSession.length} missed</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-5 py-3 rounded-xl bg-white hover:bg-[#FAF9F6] border border-[#E8E5DC] text-xs font-semibold text-[#12151A]"
            >
              Return to dashboard
            </button>
          </div>
        </div>

        {/* Missed questions in this session */}
        {missedInSession.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-[#12151A]">
              Topics to Revisit ({missedInSession.length})
            </h3>
            <div className="space-y-4">
              {missedInSession.map(({ question, selectedOptionId }, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#E8E5DC] rounded-2xl p-6 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#0C4FD7]">
                      {AZ900_DOMAINS[question.domainId].name} • {question.subtopic}
                    </span>
                    <span className="font-mono text-[#8B94A0]">{question.difficulty}</span>
                  </div>

                  <p className="text-sm font-semibold text-[#12151A]">{question.question}</p>

                  <div className="text-xs space-y-2 pt-2 border-t border-[#F3F1EC]">
                    <div className="text-[#C04328] font-medium flex items-center gap-2">
                      <XCircle className="w-4 h-4 shrink-0" />
                      <span>
                        Your answer: Option {selectedOptionId} ({question.options.find(o => o.id === selectedOptionId)?.text})
                      </span>
                    </div>
                    <div className="text-[#1A7B54] font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>
                        Correct answer: Option {question.correctOptionId} ({question.options.find(o => o.id === question.correctOptionId)?.text})
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#58616E] bg-[#F8F7F4] p-3.5 rounded-xl leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Active Quiz Distraction-Free Workspace
  const isFlagged = currentQuestion ? !!questionFlags[currentQuestion.id] : false;
  const domainMeta = currentQuestion ? AZ900_DOMAINS[currentQuestion.domainId] : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Top Progress & Context Strip */}
      <div className="bg-white border border-[#E8E5DC] rounded-2xl px-5 py-3 shadow-xs flex items-center justify-between gap-4">
        {/* Progress Bar & Counter */}
        <div className="flex items-center gap-3 flex-1 max-w-xs">
          <div className="flex-1 bg-[#F3F1EC] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#0C4FD7] h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / sessionQuestions.length) * 100}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-[#12151A] whitespace-nowrap">
            {currentIndex + 1} <span className="text-[#8B94A0]">/ {sessionQuestions.length}</span>
          </span>
        </div>

        {/* Mode selector */}
        <div className="flex items-center gap-2">
          <select
            value={mode}
            onChange={(e) => {
              const newMode = e.target.value as QuizMode;
              setMode(newMode);
              startQuizSession(newMode, selectedDomain, selectedDifficulty);
            }}
            className="text-xs font-mono bg-[#FAF9F6] border border-[#E8E5DC] rounded-lg px-2.5 py-1 text-[#12151A] focus:outline-none focus:border-[#0C4FD7]"
          >
            <option value="quick10">Quick 10</option>
            <option value="all">All 30</option>
            <option value="missed">Missed ({globalMissed.length})</option>
            <option value="flagged">Bookmarked ({globalFlagged.length})</option>
          </select>

          <button
            onClick={() => currentQuestion && toggleFlagQuestion(currentQuestion.id)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isFlagged
                ? 'bg-[#EFF4FF] border-[#D0E0FD] text-[#0C4FD7]'
                : 'bg-[#FAF9F6] border-[#E8E5DC] text-[#8B94A0] hover:text-[#12151A]'
            }`}
            title={isFlagged ? 'Remove bookmark' : 'Bookmark question'}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className="p-1.5 rounded-lg text-[#8B94A0] hover:text-[#12151A] hover:bg-[#F3F1EC] transition-colors"
            title="Exit quiz"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Focus Question Card */}
      {currentQuestion && (
        <div className="bg-white border border-[#E8E5DC] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          {/* Header Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#F3F1EC]">
            <div className="flex items-center gap-2">
              <span
                className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md"
                style={{
                  backgroundColor: domainMeta?.accentBg || '#FAF9F6',
                  color: domainMeta?.color || '#12151A',
                }}
              >
                {domainMeta?.name}
              </span>
              <span className="text-xs font-mono text-[#58616E]">
                • {currentQuestion.subtopic}
              </span>
            </div>

            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#E8E5DC] text-[#8B94A0]">
              {currentQuestion.difficulty}
            </span>
          </div>

          {/* Scenario container if present */}
          {currentQuestion.scenario && (
            <div className="bg-[#FAF9F6] border border-[#E8E5DC] rounded-2xl p-4 text-xs text-[#58616E] leading-relaxed">
              <span className="font-mono font-bold text-[#12151A] block mb-1 uppercase tracking-wider text-[10px]">
                Scenario Context
              </span>
              {currentQuestion.scenario}
            </div>
          )}

          {/* Question Prompt */}
          <h2 className="font-display text-lg sm:text-xl font-bold text-[#12151A] leading-snug">
            {currentQuestion.question}
          </h2>

          {/* 4 Answer Options */}
          <div className="space-y-3 pt-2">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const isCorrectAnswer = option.id === currentQuestion.correctOptionId;

              let style = 'border-[#E8E5DC] bg-white hover:bg-[#FAF9F6] text-[#12151A] hover:border-[#DCD7CB]';

              if (isAnswerSubmitted) {
                if (isCorrectAnswer) {
                  style = 'border-[#1A7B54] bg-[#EAF6F0] text-[#12151A] font-medium';
                } else if (isSelected && !isCorrectAnswer) {
                  style = 'border-[#C04328] bg-[#FDF2EF] text-[#12151A]';
                } else {
                  style = 'border-[#F3F1EC] bg-white opacity-50 text-[#8B94A0]';
                }
              } else if (isSelected) {
                style = 'border-[#0C4FD7] bg-[#EFF4FF] text-[#12151A] ring-2 ring-[#0C4FD7]/20 font-medium';
              }

              return (
                <button
                  key={option.id}
                  disabled={isAnswerSubmitted}
                  onClick={() => handleSelectOption(option.id)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 ${style}`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs shrink-0 font-bold ${
                      isAnswerSubmitted && isCorrectAnswer
                        ? 'bg-[#1A7B54] text-white'
                        : isAnswerSubmitted && isSelected && !isCorrectAnswer
                        ? 'bg-[#C04328] text-white'
                        : isSelected
                        ? 'bg-[#0C4FD7] text-white'
                        : 'bg-[#F8F7F4] border border-[#E8E5DC] text-[#58616E]'
                    }`}
                  >
                    {option.id}
                  </span>

                  <span className="text-sm leading-relaxed pt-0.5">{option.text}</span>

                  {isAnswerSubmitted && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-[#1A7B54] ml-auto shrink-0 mt-0.5" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-[#C04328] ml-auto shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-[#F3F1EC] flex items-center justify-between">
            <span className="text-xs font-mono text-[#8B94A0]">
              {!isAnswerSubmitted
                ? selectedOptionId
                  ? 'Option selected. Press Enter or Submit.'
                  : 'Select an option to verify.'
                : 'Review explanation below.'}
            </span>

            {!isAnswerSubmitted ? (
              <button
                disabled={!selectedOptionId}
                onClick={handleSubmitAnswer}
                className={`px-6 py-3 rounded-xl text-xs font-semibold shadow-xs transition-colors ${
                  selectedOptionId
                    ? 'bg-[#0C4FD7] hover:bg-[#093FB0] text-white'
                    : 'bg-[#F3F1EC] text-[#8B94A0] cursor-not-allowed'
                }`}
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#12151A] hover:bg-black text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <span>
                  {currentIndex + 1 < sessionQuestions.length ? 'Next Question' : 'View Results'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Post-Submission Feedback */}
          {quizState === 'submitted' && submittedAnswer && (
            <div
              className={`rounded-2xl p-6 border space-y-4 animate-in fade-in duration-300 ${
                submittedAnswer.isCorrect
                  ? 'bg-[#FAFDFB] border-[#CCE9DB]'
                  : 'bg-[#FFFBF9] border-[#F5D3CA]'
              }`}
            >
              {/* Verdict header */}
              <div className="flex items-center gap-2">
                {submittedAnswer.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-[#1A7B54]" />
                    <span className="font-bold text-sm text-[#1A7B54]">
                      Correct! Option {currentQuestion.correctOptionId} is the right answer.
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-[#C04328]" />
                    <span className="font-bold text-sm text-[#C04328]">
                      Incorrect. You selected Option {submittedAnswer.selectedOptionId}. Correct answer is Option {currentQuestion.correctOptionId}.
                    </span>
                  </>
                )}
              </div>

              {/* Core Explanation */}
              <p className="text-sm text-[#12151A] leading-relaxed">
                {currentQuestion.explanation}
              </p>

              {/* Why others are incorrect */}
              <div className="space-y-2 pt-3 border-t border-[#E8E5DC]/60">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#58616E] font-bold block">
                  Detailed Option Rationale
                </span>
                <div className="space-y-2 text-xs text-[#58616E]">
                  {(['A', 'B', 'C', 'D'] as const).map((optId) => (
                    <div key={optId} className="flex items-start gap-2.5">
                      <span
                        className={`font-mono font-bold shrink-0 text-[10px] px-1.5 py-0.5 rounded ${
                          optId === currentQuestion.correctOptionId
                            ? 'bg-[#EAF6F0] text-[#1A7B54]'
                            : 'bg-[#F8F7F4] text-[#58616E]'
                        }`}
                      >
                        {optId}
                      </span>
                      <span className="leading-relaxed">
                        {currentQuestion.whyOthersIncorrect[optId]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Exam Rule */}
              <div className="bg-[#FAF9F6] border border-[#E8E5DC] p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-[#12151A]">
                <Lightbulb className="w-4 h-4 text-[#0C4FD7] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-[10px] uppercase font-mono text-[#58616E]">
                    Key Exam Takeaway
                  </span>
                  <span className="leading-relaxed font-medium">{currentQuestion.keyTakeaway}</span>
                </div>
              </div>

              {/* Official Microsoft Learn link */}
              <div className="pt-2 flex justify-end">
                <a
                  href={currentQuestion.learnUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#0C4FD7] hover:underline font-medium"
                >
                  <span>{currentQuestion.learnTitle}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
