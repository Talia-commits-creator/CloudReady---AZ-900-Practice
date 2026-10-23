import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  DomainId,
  Question,
  UserAttempt,
  QuizSessionSummary,
  Recommendation,
  StudyTask,
} from '../types';
import { AZ900_QUESTIONS } from '../data/questions';
import { AZ900_FLASHCARDS } from '../data/flashcards';
import { AZ900_DOMAINS, DOMAIN_LIST } from '../data/domains';
import { DEFAULT_STUDY_PLAN } from '../data/studyPlan';
import { ALTERNATE_QUESTIONS } from '../data/alternateQuestions';
import {
  SAMPLE_ATTEMPTS,
  SAMPLE_FLASHCARD_STATUS,
  SAMPLE_QUIZ_SESSIONS,
  getSampleStudyDates,
} from '../data/sampleData';

const STORAGE_KEY = 'cloudready_az900_state_v3';

// Calendar date helper (YYYY-MM-DD in local time)
export const getLocalDateString = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Calculate consecutive active study days counting backward from today (or yesterday)
export const calculateStreak = (dateStrings: string[]): number => {
  const uniqueDates = Array.from(new Set(dateStrings.filter(Boolean)));
  if (uniqueDates.length === 0) return 0;

  const activeDateSet = new Set(uniqueDates);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = getLocalDateString(today);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);

  const activeToday = activeDateSet.has(todayStr);
  const activeYesterday = activeDateSet.has(yesterdayStr);

  // If neither today nor yesterday has activity, the streak is 0 (broken)
  if (!activeToday && !activeYesterday) {
    return 0;
  }

  // Count consecutive days backward starting from the active reference day
  let streak = 0;
  const cursor = new Date(activeToday ? today : yesterday);

  while (true) {
    const dateStr = getLocalDateString(cursor);
    if (activeDateSet.has(dateStr)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

export interface DomainStat {
  domainId: DomainId;
  name: string;
  weightRange: string;
  total: number;
  attempted: number;
  correct: number;
  accuracy: number; // 0 to 100
  color: string;
  accentBg: string;
}

export interface LastActiveItem {
  type: 'quiz' | 'flashcards' | 'exam' | 'missed' | 'promptlab';
  title: string;
  domainId?: DomainId;
  questionCount?: number;
  timestamp: number;
}

interface PracticeContextType {
  // Data
  questions: Question[];
  alternateQuestions: Record<string, Question>;
  attempts: Record<string, UserAttempt>;
  questionFlags: Record<string, boolean>;
  flashcardStatus: Record<string, 'unseen' | 'known' | 'review'>;
  quizSessions: QuizSessionSummary[];
  studyPlan: StudyTask[];
  lastActiveItem: LastActiveItem | null;
  redeemedWeakSpots: Record<string, boolean>;
  activeAlternateQuestion: Question | null;
  isSampleDataActive: boolean;
  isDemoModeActive: boolean;
  studyDates: string[];

  // Actions
  recordAttempt: (questionId: string, selectedOptionId: 'A' | 'B' | 'C' | 'D', isCorrect: boolean) => void;
  recordActivityDate: () => void;
  toggleFlagQuestion: (questionId: string) => void;
  setFlashcardStatus: (cardId: string, status: 'unseen' | 'known' | 'review') => void;
  resetFlashcards: () => void;
  recordQuizSession: (session: Omit<QuizSessionSummary, 'id' | 'timestamp'>) => void;
  toggleStudyTask: (taskId: string) => void;
  resetStudyPlan: () => void;
  setLastActive: (item: LastActiveItem) => void;
  startAlternateChallenge: (originalQuestionId: string) => void;
  closeAlternateChallenge: () => void;
  markWeakSpotRedeemed: (originalQuestionId: string) => void;
  setDemoModeActive: (active: boolean) => void;
  loadSampleData: () => void;
  clearAllData: () => void;

  // Computed Metrics
  totalAttempted: number;
  totalCorrect: number;
  overallAccuracy: number;
  readinessScore: number; // 0 to 1000
  isPassing: boolean;
  studyStreak: number;
  domainStats: Record<DomainId, DomainStat>;
  missedQuestions: Question[];
  unremediatedMissedQuestions: Question[];
  flaggedQuestions: Question[];
  recommendation: Recommendation;
  flashcardStats: {
    total: number;
    known: number;
    review: number;
    unseen: number;
  };
}

const PracticeContext = createContext<PracticeContextType | undefined>(undefined);

export const PracticeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [attempts, setAttempts] = useState<Record<string, UserAttempt>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.attempts || {};
      }
    } catch (e) {
      console.error('Failed reading saved attempts', e);
    }
    return {};
  });

  const [questionFlags, setQuestionFlags] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.questionFlags || {};
      }
    } catch (e) {
      console.error('Failed reading question flags', e);
    }
    return {};
  });

  const [flashcardStatus, setFlashcardStatusMap] = useState<Record<string, 'unseen' | 'known' | 'review'>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.flashcardStatus || {};
      }
    } catch (e) {
      console.error('Failed reading flashcard status', e);
    }
    return {};
  });

  const [quizSessions, setQuizSessions] = useState<QuizSessionSummary[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.quizSessions || [];
      }
    } catch (e) {
      console.error('Failed reading quiz sessions', e);
    }
    return [];
  });

  const [studyPlan, setStudyPlan] = useState<StudyTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.studyPlan && Array.isArray(parsed.studyPlan) && parsed.studyPlan.length > 0) {
          return parsed.studyPlan;
        }
      }
    } catch (e) {
      console.error('Failed reading study plan', e);
    }
    return DEFAULT_STUDY_PLAN;
  });

  const [redeemedWeakSpots, setRedeemedWeakSpots] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.redeemedWeakSpots || {};
      }
    } catch (e) {
      console.error('Failed reading redeemedWeakSpots', e);
    }
    return {};
  });

  const [lastActiveItem, setLastActiveItem] = useState<LastActiveItem | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.lastActiveItem || null;
      }
    } catch (e) {
      console.error('Failed reading lastActiveItem', e);
    }
    return null;
  });

  const [isSampleDataActive, setIsSampleDataActive] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return !!parsed.isSampleDataActive;
      }
    } catch (e) {
      console.error('Failed reading isSampleDataActive', e);
    }
    return false;
  });

  const [studyDates, setStudyDates] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.studyDates)) {
          return Array.from(new Set(parsed.studyDates));
        }
        // Safe migration: rebuild dates from existing attempts and quiz sessions timestamps
        const dateSet = new Set<string>();
        if (parsed.attempts && typeof parsed.attempts === 'object') {
          Object.values(parsed.attempts).forEach((att: any) => {
            if (att && typeof att.timestamp === 'number') {
              dateSet.add(getLocalDateString(new Date(att.timestamp)));
            }
          });
        }
        if (Array.isArray(parsed.quizSessions)) {
          parsed.quizSessions.forEach((sess: any) => {
            if (sess && typeof sess.timestamp === 'number') {
              dateSet.add(getLocalDateString(new Date(sess.timestamp)));
            }
          });
        }
        return Array.from(dateSet);
      }
    } catch (e) {
      console.error('Failed reading study dates', e);
    }
    return [];
  });

  const [activeAlternateQuestion, setActiveAlternateQuestion] = useState<Question | null>(null);
  const [isDemoModeActive, setDemoModeActive] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          attempts,
          questionFlags,
          flashcardStatus,
          quizSessions,
          studyPlan,
          redeemedWeakSpots,
          lastActiveItem,
          isSampleDataActive,
          studyDates,
        })
      );
    } catch (e) {
      console.error('Failed saving to localStorage', e);
    }
  }, [attempts, questionFlags, flashcardStatus, quizSessions, studyPlan, redeemedWeakSpots, lastActiveItem, isSampleDataActive, studyDates]);

  const recordActivityDate = () => {
    const todayStr = getLocalDateString();
    setStudyDates((prev) => {
      if (prev.includes(todayStr)) return prev;
      return [...prev, todayStr];
    });
  };

  const recordAttempt = (questionId: string, selectedOptionId: 'A' | 'B' | 'C' | 'D', isCorrect: boolean) => {
    recordActivityDate();
    setAttempts((prev) => ({
      ...prev,
      [questionId]: {
        questionId,
        selectedOptionId,
        isCorrect,
        timestamp: Date.now(),
      },
    }));

    // Check if this was an alternate question attempt
    if (questionId.endsWith('_alt')) {
      const parentId = questionId.replace('_alt', '');
      if (isCorrect) {
        setRedeemedWeakSpots((prev) => ({ ...prev, [parentId]: true }));
      }
    }

    const q = AZ900_QUESTIONS.find((item) => item.id === questionId) || ALTERNATE_QUESTIONS[questionId.replace('_alt', '')];
    if (q) {
      setLastActiveItem({
        type: 'quiz',
        title: `${q.subtopic} Practice`,
        domainId: q.domainId,
        timestamp: Date.now(),
      });
    }

    if (isSampleDataActive) {
      setIsSampleDataActive(false);
    }
  };

  const toggleFlagQuestion = (questionId: string) => {
    setQuestionFlags((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const setFlashcardStatus = (cardId: string, status: 'unseen' | 'known' | 'review') => {
    recordActivityDate();
    setFlashcardStatusMap((prev) => ({
      ...prev,
      [cardId]: status,
    }));
    const card = AZ900_FLASHCARDS.find((c) => c.id === cardId);
    if (card) {
      setLastActiveItem({
        type: 'flashcards',
        title: `${card.term} Card`,
        domainId: card.domainId,
        timestamp: Date.now(),
      });
    }
    if (isSampleDataActive) {
      setIsSampleDataActive(false);
    }
  };

  const resetFlashcards = () => {
    setFlashcardStatusMap({});
  };

  const recordQuizSession = (session: Omit<QuizSessionSummary, 'id' | 'timestamp'>) => {
    recordActivityDate();
    const newSession: QuizSessionSummary = {
      ...session,
      id: `session-${Date.now()}`,
      timestamp: Date.now(),
    };
    setQuizSessions((prev) => [newSession, ...prev].slice(0, 20));

    setLastActiveItem({
      type: 'quiz',
      title: session.title,
      domainId: session.domainId !== 'all' ? session.domainId : undefined,
      questionCount: session.totalQuestions,
      timestamp: Date.now(),
    });
  };

  const toggleStudyTask = (taskId: string) => {
    recordActivityDate();
    setStudyPlan((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task))
    );
  };

  const resetStudyPlan = () => {
    setStudyPlan(DEFAULT_STUDY_PLAN.map((t) => ({ ...t, completed: false })));
  };

  const setLastActive = (item: LastActiveItem) => {
    setLastActiveItem(item);
  };

  const startAlternateChallenge = (originalQuestionId: string) => {
    const alt = ALTERNATE_QUESTIONS[originalQuestionId];
    if (alt) {
      setActiveAlternateQuestion(alt);
    } else {
      // Fallback: find another question in the same subtopic or domain
      const baseQ = AZ900_QUESTIONS.find((q) => q.id === originalQuestionId);
      if (baseQ) {
        const sibling = AZ900_QUESTIONS.find((q) => q.domainId === baseQ.domainId && q.id !== baseQ.id);
        if (sibling) {
          setActiveAlternateQuestion({
            ...sibling,
            parentQuestionId: originalQuestionId,
            isAlternate: true,
          });
        }
      }
    }
  };

  const closeAlternateChallenge = () => {
    setActiveAlternateQuestion(null);
  };

  const markWeakSpotRedeemed = (originalQuestionId: string) => {
    setRedeemedWeakSpots((prev) => ({ ...prev, [originalQuestionId]: true }));
  };

  const loadSampleData = () => {
    setAttempts(SAMPLE_ATTEMPTS);
    setFlashcardStatusMap(SAMPLE_FLASHCARD_STATUS);
    setQuizSessions(SAMPLE_QUIZ_SESSIONS);
    setStudyDates(getSampleStudyDates());
    setQuestionFlags({ q8: true, q18: true });
    setStudyPlan(DEFAULT_STUDY_PLAN);
    setRedeemedWeakSpots({ q8: false, q18: false });
    setLastActiveItem({
      type: 'quiz',
      title: 'Azure Architecture Drill',
      domainId: 'architecture-services',
      questionCount: 9,
      timestamp: Date.now() - 3600000 * 8,
    });
    setIsSampleDataActive(true);
  };

  const clearAllData = () => {
    setAttempts({});
    setQuestionFlags({});
    setFlashcardStatusMap({});
    setQuizSessions([]);
    setStudyDates([]);
    setStudyPlan(DEFAULT_STUDY_PLAN.map((t) => ({ ...t, completed: false })));
    setRedeemedWeakSpots({});
    setLastActiveItem(null);
    setIsSampleDataActive(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Metrics
  const baseQuestionsList = AZ900_QUESTIONS;
  const totalAttempted = Object.keys(attempts).filter((k) => !k.endsWith('_alt')).length;
  const totalCorrect = Object.entries(attempts).filter(([k, a]) => !k.endsWith('_alt') && a.isCorrect).length;
  const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  // Study streak calculated strictly from consecutive unique calendar days
  const studyStreak = useMemo(() => {
    if (isSampleDataActive) return 4;
    return calculateStreak(studyDates);
  }, [studyDates, isSampleDataActive]);

  // Domain stats
  const domainStats = useMemo(() => {
    const stats: Record<DomainId, DomainStat> = {
      'cloud-concepts': {
        domainId: 'cloud-concepts',
        name: AZ900_DOMAINS['cloud-concepts'].name,
        weightRange: AZ900_DOMAINS['cloud-concepts'].weightRange,
        total: 0,
        attempted: 0,
        correct: 0,
        accuracy: 0,
        color: AZ900_DOMAINS['cloud-concepts'].color,
        accentBg: AZ900_DOMAINS['cloud-concepts'].accentBg,
      },
      'architecture-services': {
        domainId: 'architecture-services',
        name: AZ900_DOMAINS['architecture-services'].name,
        weightRange: AZ900_DOMAINS['architecture-services'].weightRange,
        total: 0,
        attempted: 0,
        correct: 0,
        accuracy: 0,
        color: AZ900_DOMAINS['architecture-services'].color,
        accentBg: AZ900_DOMAINS['architecture-services'].accentBg,
      },
      'management-governance': {
        domainId: 'management-governance',
        name: AZ900_DOMAINS['management-governance'].name,
        weightRange: AZ900_DOMAINS['management-governance'].weightRange,
        total: 0,
        attempted: 0,
        correct: 0,
        accuracy: 0,
        color: AZ900_DOMAINS['management-governance'].color,
        accentBg: AZ900_DOMAINS['management-governance'].accentBg,
      },
    };

    baseQuestionsList.forEach((q) => {
      stats[q.domainId].total += 1;
      const attempt = attempts[q.id];
      if (attempt) {
        stats[q.domainId].attempted += 1;
        // Count as correct if originally correct OR if redeemed via Weak-Spot Learning Loop
        if (attempt.isCorrect || redeemedWeakSpots[q.id]) {
          stats[q.domainId].correct += 1;
        }
      }
    });

    Object.keys(stats).forEach((key) => {
      const dKey = key as DomainId;
      const d = stats[dKey];
      d.accuracy = d.attempted > 0 ? Math.round((d.correct / d.attempted) * 100) : 0;
    });

    return stats;
  }, [attempts, redeemedWeakSpots, baseQuestionsList]);

  // Scaled Readiness Score (0 - 1000)
  const readinessScore = useMemo(() => {
    if (totalAttempted === 0) return 0;

    const weights: Record<DomainId, number> = {
      'cloud-concepts': 0.28,
      'architecture-services': 0.38,
      'management-governance': 0.34,
    };

    let totalWeightedScore = 0;
    let totalWeightAttempted = 0;

    (Object.keys(domainStats) as DomainId[]).forEach((dId) => {
      const d = domainStats[dId];
      if (d.attempted > 0) {
        totalWeightedScore += d.accuracy * weights[dId];
        totalWeightAttempted += weights[dId];
      }
    });

    if (totalWeightAttempted === 0) return 0;
    const baseAccuracyNormalized = totalWeightedScore / totalWeightAttempted;
    const volumeFactor = Math.min(1, Math.max(0.3, totalAttempted / 20));
    const estimatedRaw = Math.round(baseAccuracyNormalized * 10 * volumeFactor);
    return Math.min(1000, Math.max(0, estimatedRaw));
  }, [domainStats, totalAttempted]);

  const isPassing = readinessScore >= 700;

  // All missed questions
  const missedQuestions = useMemo(() => {
    return AZ900_QUESTIONS.filter((q) => {
      const attempt = attempts[q.id];
      return attempt && !attempt.isCorrect;
    });
  }, [attempts]);

  // Unremediated missed questions (not yet redeemed by Weak-Spot Learning Loop)
  const unremediatedMissedQuestions = useMemo(() => {
    return missedQuestions.filter((q) => !redeemedWeakSpots[q.id]);
  }, [missedQuestions, redeemedWeakSpots]);

  const flaggedQuestions = useMemo(() => {
    return AZ900_QUESTIONS.filter((q) => !!questionFlags[q.id]);
  }, [questionFlags]);

  const flashcardStats = useMemo(() => {
    const total = AZ900_FLASHCARDS.length;
    let known = 0;
    let review = 0;

    AZ900_FLASHCARDS.forEach((card) => {
      const s = flashcardStatus[card.id];
      if (s === 'known') known += 1;
      else if (s === 'review') review += 1;
    });

    const unseen = total - known - review;
    return { total, known, review, unseen };
  }, [flashcardStatus]);

  // Rule-based study recommendation
  const recommendation = useMemo<Recommendation>(() => {
    if (totalAttempted === 0) {
      return {
        priorityDomainId: 'cloud-concepts',
        status: 'untouched',
        headline: 'Start with a 10-Question Diagnostic Quiz',
        reason: 'You have not answered any practice questions yet. Baseline your knowledge across all 3 official AZ-900 domains in less than 8 minutes.',
        keyWeaknesses: ['Cloud Models (IaaS / PaaS / SaaS)', 'Shared Responsibility', 'CapEx vs OpEx'],
        suggestedActionLabel: 'Begin Diagnostic Quiz (10 Questions)',
        actionType: 'start-diagnostic',
      };
    }

    // Check unremediated missed questions first
    if (unremediatedMissedQuestions.length > 0) {
      const firstMissed = unremediatedMissedQuestions[0];
      const domainMissed = unremediatedMissedQuestions.filter((q) => q.domainId === firstMissed.domainId);
      const weakSubtopics = Array.from(new Set(domainMissed.map((q) => q.subtopic))).slice(0, 3);

      return {
        priorityDomainId: firstMissed.domainId,
        status: 'critical',
        headline: `Weak-Spot Learning Loop: Resolve ${unremediatedMissedQuestions.length} Pending Concept Gap${unremediatedMissedQuestions.length > 1 ? 's' : ''}`,
        reason: `You missed questions on ${weakSubtopics.join(', ')}. Use our Weak-Spot Learning Loop to retry with alternate scenario questions and verify concept mastery.`,
        keyWeaknesses: weakSubtopics,
        suggestedActionLabel: 'Enter Weak-Spot Learning Loop',
        actionType: 'quiz-missed',
      };
    }

    const unattemptedDomains = DOMAIN_LIST.filter((d) => domainStats[d.id].attempted < 2);
    if (unattemptedDomains.length > 0) {
      const target = unattemptedDomains[0];
      return {
        priorityDomainId: target.id,
        status: 'needs-attention',
        headline: `Expand Coverage: ${target.name}`,
        reason: `You have attempted fewer than 2 questions in ${target.name}. This domain accounts for ${target.weightRange} of the exam score.`,
        keyWeaknesses: target.id === 'architecture-services'
          ? ['Storage Redundancy (ZRS/GRS)', 'Availability Zones', 'ExpressRoute']
          : target.id === 'management-governance'
          ? ['Resource Locks vs RBAC', 'Azure Policy', 'Defender for Cloud']
          : ['Shared Responsibility', 'IaaS vs PaaS', 'CapEx vs OpEx'],
        suggestedActionLabel: `Practice ${target.name}`,
        actionType: 'quiz-domain',
      };
    }

    const domainArray = DOMAIN_LIST.map((d) => domainStats[d.id]);
    domainArray.sort((a, b) => a.accuracy - b.accuracy);
    const weakest = domainArray[0];

    if (weakest.accuracy < 70) {
      const domainMissed = missedQuestions.filter((q) => q.domainId === weakest.domainId);
      const weakSubtopics = Array.from(new Set(domainMissed.map((q) => q.subtopic))).slice(0, 3);
      const fallbackSubtopics = weakest.domainId === 'architecture-services'
        ? ['Storage Redundancy', 'Networking Peering', 'Availability Zones']
        : weakest.domainId === 'management-governance'
        ? ['Resource Locks', 'Azure Policy', 'Zero Trust']
        : ['Shared Responsibility', 'Cloud Economics', 'Disaster Recovery'];

      return {
        priorityDomainId: weakest.domainId,
        status: 'critical',
        headline: `Priority Focus: ${weakest.name} (${weakest.accuracy}% accuracy)`,
        reason: `Your current accuracy in this domain is ${weakest.accuracy}%, below the 70% passing threshold. On the real AZ-900 exam, this section represents ${weakest.weightRange} of all scored questions.`,
        keyWeaknesses: weakSubtopics.length > 0 ? weakSubtopics : fallbackSubtopics,
        suggestedActionLabel: `Drill ${weakest.name}`,
        actionType: 'quiz-domain',
      };
    }

    if (flashcardStats.review >= 3) {
      return {
        priorityDomainId: weakest.domainId,
        status: 'needs-attention',
        headline: `Review Key Terms (${flashcardStats.review} cards flagged)`,
        reason: `You have marked ${flashcardStats.review} critical flashcards for review. Reinforcing core definitions and SLA formulas will prevent small missteps on exam day.`,
        keyWeaknesses: ['SLA Composite Calculations', 'Resource Locks vs RBAC', 'Storage Access Tiers'],
        suggestedActionLabel: 'Review Flashcards Deck',
        actionType: 'flashcards-review',
      };
    }

    return {
      priorityDomainId: weakest.domainId,
      status: 'on-track',
      headline: 'Exam Ready: Strong Mastery Across All Domains',
      reason: `You are scoring above 70% in all three exam domains with a composite readiness score of ${readinessScore}/1000. Maintain readiness with quick flashcard revisions.`,
      keyWeaknesses: ['Final Terminology Review', 'Scenario Edge Cases'],
      suggestedActionLabel: 'Test All 30 Exam Questions',
      actionType: 'quiz-domain',
    };
  }, [totalAttempted, missedQuestions, unremediatedMissedQuestions, domainStats, flashcardStats, readinessScore]);

  return (
    <PracticeContext.Provider
      value={{
        questions: AZ900_QUESTIONS,
        alternateQuestions: ALTERNATE_QUESTIONS,
        attempts,
        questionFlags,
        flashcardStatus,
        quizSessions,
        studyPlan,
        lastActiveItem,
        redeemedWeakSpots,
        activeAlternateQuestion,
        isSampleDataActive,
        isDemoModeActive,
        studyDates,
        recordAttempt,
        recordActivityDate,
        toggleFlagQuestion,
        setFlashcardStatus,
        resetFlashcards,
        recordQuizSession,
        toggleStudyTask,
        resetStudyPlan,
        setLastActive,
        startAlternateChallenge,
        closeAlternateChallenge,
        markWeakSpotRedeemed,
        setDemoModeActive,
        loadSampleData,
        clearAllData,
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
        recommendation,
        flashcardStats,
      }}
    >
      {children}
    </PracticeContext.Provider>
  );
};

export const usePractice = (): PracticeContextType => {
  const context = useContext(PracticeContext);
  if (!context) {
    throw new Error('usePractice must be used within a PracticeProvider');
  }
  return context;
};
