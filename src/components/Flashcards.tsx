import React, { useState, useMemo, useEffect } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Layers,
  Sparkles,
  Lightbulb,
} from 'lucide-react';
import { usePractice } from '../context/PracticeContext';
import { AZ900_FLASHCARDS } from '../data/flashcards';
import { AZ900_DOMAINS } from '../data/domains';
import { DomainId, Flashcard } from '../types';

export const Flashcards: React.FC = () => {
  const {
    flashcardStatus,
    setFlashcardStatus,
    resetFlashcards,
    flashcardStats,
  } = usePractice();

  const [selectedDomain, setSelectedDomain] = useState<DomainId | 'all'>('all');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'review' | 'known' | 'unseen'>('all');
  const [deck, setDeck] = useState<Flashcard[]>([...AZ900_FLASHCARDS]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Filter cards
  const filteredCards = useMemo(() => {
    return deck.filter((card) => {
      if (selectedDomain !== 'all' && card.domainId !== selectedDomain) {
        return false;
      }
      const status = flashcardStatus[card.id] || 'unseen';
      if (selectedFilter !== 'all' && status !== selectedFilter) {
        return false;
      }
      return true;
    });
  }, [deck, selectedDomain, selectedFilter, flashcardStatus]);

  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedDomain, selectedFilter]);

  const currentCard: Flashcard | undefined = filteredCards[currentIndex];
  const currentStatus = currentCard ? flashcardStatus[currentCard.id] || 'unseen' : 'unseen';

  const handleNext = () => {
    if (currentIndex + 1 < filteredCards.length) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleShuffle = () => {
    setDeck((prev) => [...prev].sort(() => 0.5 - Math.random()));
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleMark = (status: 'known' | 'review') => {
    if (!currentCard) return;
    setFlashcardStatus(currentCard.id, status);
    if (currentIndex + 1 < filteredCards.length) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsFlipped(false);
      }, 200);
    }
  };

  // Keyboard navigation: Space to flip, 1 to Review, 2 to Know, Arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((f) => !f);
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === '1') {
        handleMark('review');
      } else if (e.key === '2') {
        handleMark('known');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, filteredCards.length, currentCard]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Header and Deck Progress */}
      <div className="bg-white border border-[#E8E5DC] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#8B94A0]">
            Concept Retention
          </span>
          <h2 className="font-display text-2xl font-bold text-[#12151A] mt-0.5">
            AZ-900 Flashcards
          </h2>
          <p className="text-xs text-[#58616E] mt-1">
            Tap card or press <kbd className="px-1.5 py-0.5 rounded bg-[#FAF9F6] border border-[#E8E5DC] font-mono text-[10px]">Space</kbd> to flip. Mark 1 for Review, 2 for Know It.
          </p>
        </div>

        {/* Status Counters */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-2 rounded-xl bg-[#EAF6F0] border border-[#CCE9DB] text-center min-w-[70px]">
            <span className="text-[10px] font-mono uppercase text-[#1A7B54] font-bold block">Known</span>
            <span className="font-display text-base font-extrabold text-[#1A7B54]">
              {flashcardStats.known}
            </span>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-[#FDF2EF] border border-[#F5D3CA] text-center min-w-[70px]">
            <span className="text-[10px] font-mono uppercase text-[#C04328] font-bold block">Review</span>
            <span className="font-display text-base font-extrabold text-[#C04328]">
              {flashcardStats.review}
            </span>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-[#F8F7F4] border border-[#E8E5DC] text-center min-w-[70px]">
            <span className="text-[10px] font-mono uppercase text-[#8B94A0] font-bold block">New</span>
            <span className="font-display text-base font-extrabold text-[#58616E]">
              {flashcardStats.unseen}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Shuffle Toolbar */}
      <div className="bg-white border border-[#E8E5DC] rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#58616E]">Domain:</span>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value as DomainId | 'all')}
            className="text-xs font-semibold bg-[#FAF9F6] border border-[#E8E5DC] rounded-lg px-2.5 py-1.5 text-[#12151A] focus:outline-none focus:border-[#0C4FD7]"
          >
            <option value="all">All Domains</option>
            <option value="cloud-concepts">Cloud Concepts</option>
            <option value="architecture-services">Architecture & Services</option>
            <option value="management-governance">Management & Governance</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#58616E]">Status:</span>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value as any)}
            className="text-xs font-semibold bg-[#FAF9F6] border border-[#E8E5DC] rounded-lg px-2.5 py-1.5 text-[#12151A] focus:outline-none focus:border-[#0C4FD7]"
          >
            <option value="all">All Cards</option>
            <option value="review">Needs Review Only</option>
            <option value="known">Mastered Only</option>
            <option value="unseen">Unseen Only</option>
          </select>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleShuffle}
            title="Shuffle deck"
            className="p-2 rounded-xl text-[#58616E] hover:text-[#12151A] hover:bg-[#F3F1EC] border border-[#E8E5DC] transition-colors"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset all flashcard ratings back to unseen?')) {
                resetFlashcards();
              }
            }}
            title="Reset flashcard ratings"
            className="p-2 rounded-xl text-[#58616E] hover:text-[#C04328] hover:bg-[#FDF2EF] border border-[#E8E5DC] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Flashcard View */}
      {currentCard ? (
        <div className="space-y-4">
          {/* Card Meta Indicator */}
          <div className="flex items-center justify-between text-xs text-[#58616E] px-2">
            <div className="flex items-center gap-2">
              <span
                className="font-mono font-bold px-2 py-0.5 rounded text-[11px]"
                style={{
                  backgroundColor: AZ900_DOMAINS[currentCard.domainId].accentBg,
                  color: AZ900_DOMAINS[currentCard.domainId].color,
                }}
              >
                {AZ900_DOMAINS[currentCard.domainId].name}
              </span>
              <span>• {currentCard.tag}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-[#8B94A0]">
                Card {currentIndex + 1} of {filteredCards.length}
              </span>
              {currentStatus !== 'unseen' && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    currentStatus === 'known'
                      ? 'bg-[#EAF6F0] text-[#1A7B54]'
                      : 'bg-[#FDF2EF] text-[#C04328]'
                  }`}
                >
                  {currentStatus === 'known' ? 'Mastered' : 'Needs Review'}
                </span>
              )}
            </div>
          </div>

          {/* Interactive Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[340px] bg-white border border-[#E8E5DC] rounded-3xl p-6 sm:p-10 shadow-xs cursor-pointer select-none hover:border-[#DCD7CB] transition-all flex flex-col justify-between relative group"
          >
            {/* Flip helper badge */}
            <div className="absolute top-5 right-5 text-[11px] font-mono text-[#8B94A0] group-hover:text-[#0C4FD7] transition-colors flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isFlipped ? 'Show Prompt' : 'Click to Flip'}</span>
            </div>

            {!isFlipped ? (
              /* FRONT OF CARD */
              <div className="space-y-6 my-auto text-center py-6">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#8B94A0] block">
                  Concept Prompt
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#12151A]">
                  {currentCard.term}
                </h3>
                <p className="text-base sm:text-lg text-[#58616E] max-w-xl mx-auto leading-relaxed">
                  {currentCard.frontPrompt}
                </p>
                <div className="text-xs text-[#8B94A0] pt-4">
                  Tap to reveal definition, exam tips, and real-world examples
                </div>
              </div>
            ) : (
              /* BACK OF CARD */
              <div className="space-y-5 my-auto py-2">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#0C4FD7] font-bold block mb-1">
                    Definition & Core Concept
                  </span>
                  <div className="text-sm sm:text-base font-semibold text-[#12151A] leading-relaxed whitespace-pre-line">
                    {currentCard.backDefinition}
                  </div>
                </div>

                {/* Exam Tip Container */}
                <div className="bg-[#FAF9F6] border border-[#E8E5DC] rounded-2xl p-4 flex items-start gap-3">
                  <Lightbulb className="w-4 h-4 text-[#0C4FD7] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#58616E] block">
                      AZ-900 Exam Tip
                    </span>
                    <p className="text-xs text-[#12151A] mt-0.5 leading-relaxed">
                      {currentCard.examTip}
                    </p>
                  </div>
                </div>

                {/* Practical Example */}
                {currentCard.example && (
                  <div className="text-xs text-[#58616E] leading-relaxed">
                    <span className="font-bold text-[#12151A]">Example: </span>
                    {currentCard.example}
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <a
                    href={currentCard.learnUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 text-xs text-[#0C4FD7] hover:underline font-medium"
                  >
                    <span>Read Microsoft Learn reference</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            <div className="w-full text-center text-[11px] text-[#8B94A0] font-mono pt-4 border-t border-[#F3F1EC]">
              Space to flip • Press 1 for Review • Press 2 for Know It
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`p-3.5 rounded-2xl border flex items-center justify-center transition-colors ${
                currentIndex === 0
                  ? 'border-[#F3F1EC] text-[#DCD7CB] cursor-not-allowed'
                  : 'border-[#E8E5DC] bg-white text-[#12151A] hover:bg-[#FAF9F6]'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 flex-1 max-w-sm mx-auto">
              <button
                onClick={() => handleMark('review')}
                className={`flex-1 py-3.5 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs ${
                  currentStatus === 'review'
                    ? 'bg-[#C04328] text-white border-[#C04328]'
                    : 'bg-white hover:bg-[#FDF2EF] border-[#E8E5DC] hover:border-[#C04328] text-[#C04328]'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                <span>Review Again [1]</span>
              </button>

              <button
                onClick={() => handleMark('known')}
                className={`flex-1 py-3.5 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs ${
                  currentStatus === 'known'
                    ? 'bg-[#1A7B54] text-white border-[#1A7B54]'
                    : 'bg-white hover:bg-[#EAF6F0] border-[#E8E5DC] hover:border-[#1A7B54] text-[#1A7B54]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Know It [2]</span>
              </button>
            </div>

            <button
              onClick={handleNext}
              disabled={currentIndex + 1 >= filteredCards.length}
              className={`p-3.5 rounded-2xl border flex items-center justify-center transition-colors ${
                currentIndex + 1 >= filteredCards.length
                  ? 'border-[#F3F1EC] text-[#DCD7CB] cursor-not-allowed'
                  : 'border-[#E8E5DC] bg-white text-[#12151A] hover:bg-[#FAF9F6]'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#E8E5DC] rounded-3xl p-8 text-center shadow-xs">
          <p className="text-sm text-[#58616E]">
            No flashcards match the current filter.
          </p>
          <button
            onClick={() => {
              setSelectedDomain('all');
              setSelectedFilter('all');
            }}
            className="mt-3 px-4 py-2 rounded-xl bg-[#FAF9F6] border border-[#E8E5DC] text-xs font-semibold text-[#12151A]"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
