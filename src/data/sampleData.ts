import { UserAttempt, QuizSessionSummary } from '../types';

export const SAMPLE_ATTEMPTS: Record<string, UserAttempt> = {
  // Cloud concepts: mostly correct
  'q1': { questionId: 'q1', selectedOptionId: 'B', isCorrect: true, timestamp: Date.now() - 3600000 * 24 },
  'q2': { questionId: 'q2', selectedOptionId: 'B', isCorrect: true, timestamp: Date.now() - 3600000 * 23 },
  'q3': { questionId: 'q3', selectedOptionId: 'A', isCorrect: true, timestamp: Date.now() - 3600000 * 22 },
  'q4': { questionId: 'q4', selectedOptionId: 'C', isCorrect: true, timestamp: Date.now() - 3600000 * 21 },
  'q5': { questionId: 'q5', selectedOptionId: 'A', isCorrect: true, timestamp: Date.now() - 3600000 * 20 },
  'q6': { questionId: 'q6', selectedOptionId: 'A', isCorrect: true, timestamp: Date.now() - 3600000 * 19 },
  'q7': { questionId: 'q7', selectedOptionId: 'A', isCorrect: true, timestamp: Date.now() - 3600000 * 18 },
  'q8': { questionId: 'q8', selectedOptionId: 'B', isCorrect: false, timestamp: Date.now() - 3600000 * 17 }, // Missed RPO/RTO
  'q9': { questionId: 'q9', selectedOptionId: 'A', isCorrect: true, timestamp: Date.now() - 3600000 * 16 },
  'q10': { questionId: 'q10', selectedOptionId: 'B', isCorrect: false, timestamp: Date.now() - 3600000 * 15 }, // Missed IaaS patching

  // Architecture: several misses (Storage redundancy, ExpressRoute, VNet Peering)
  'q11': { questionId: 'q11', selectedOptionId: 'A', isCorrect: true, timestamp: Date.now() - 3600000 * 14 },
  'q12': { questionId: 'q12', selectedOptionId: 'A', isCorrect: true, timestamp: Date.now() - 3600000 * 13 },
  'q13': { questionId: 'q13', selectedOptionId: 'B', isCorrect: false, timestamp: Date.now() - 3600000 * 12 }, // Missed RG location rule
  'q14': { questionId: 'q14', selectedOptionId: 'A', isCorrect: true, timestamp: Date.now() - 3600000 * 11 },
  'q16': { questionId: 'q16', selectedOptionId: 'B', isCorrect: false, timestamp: Date.now() - 3600000 * 10 }, // Missed ACI vs AKS
  'q17': { questionId: 'q17', selectedOptionId: 'A', isCorrect: true, timestamp: Date.now() - 3600000 * 9 },
  'q18': { questionId: 'q18', selectedOptionId: 'B', isCorrect: false, timestamp: Date.now() - 3600000 * 8 }, // Missed ZRS vs LRS
  'q19': { questionId: 'q19', selectedOptionId: 'B', isCorrect: false, timestamp: Date.now() - 3600000 * 7 }, // Missed VNet Peering
  'q20': { questionId: 'q20', selectedOptionId: 'A', isCorrect: true, timestamp: Date.now() - 3600000 * 6 },

  // Management & Governance: high accuracy
  'q22': { questionId: 'q22', selectedOptionId: 'A', isCorrect: true, timestamp: Date.now() - 3600000 * 5 },
  'q23': { questionId: 'q23', selectedOptionId: 'A', isCorrect: true, timestamp: Date.now() - 3600000 * 4 },
  'q24': { questionId: 'q24', selectedOptionId: 'A', isCorrect: true, timestamp: Date.now() - 3600000 * 3 },
  'q25': { questionId: 'q25', selectedOptionId: 'A', isCorrect: true, timestamp: Date.now() - 3600000 * 2 },
  'q26': { questionId: 'q26', selectedOptionId: 'A', isCorrect: true, timestamp: Date.now() - 3600000 * 1 },
};

export const SAMPLE_FLASHCARD_STATUS: Record<string, 'unseen' | 'known' | 'review'> = {
  'fc1': 'known',
  'fc2': 'known',
  'fc3': 'known',
  'fc4': 'known',
  'fc5': 'review',
  'fc6': 'known',
  'fc7': 'review',
  'fc8': 'known',
  'fc9': 'review',
  'fc10': 'known',
  'fc11': 'review',
  'fc13': 'known',
  'fc14': 'review',
  'fc15': 'known',
  'fc16': 'known',
  'fc19': 'known',
};

export const SAMPLE_QUIZ_SESSIONS: QuizSessionSummary[] = [
  {
    id: 'sess-1',
    timestamp: Date.now() - 3600000 * 24,
    title: 'Cloud Concepts Diagnostic',
    totalQuestions: 10,
    correctCount: 8,
    percentage: 80,
    domainId: 'cloud-concepts',
  },
  {
    id: 'sess-2',
    timestamp: Date.now() - 3600000 * 8,
    title: 'Azure Architecture Drill',
    totalQuestions: 9,
    correctCount: 5,
    percentage: 56,
    domainId: 'architecture-services',
  },
  {
    id: 'sess-3',
    timestamp: Date.now() - 3600000 * 2,
    title: 'Management & Governance Check',
    totalQuestions: 5,
    correctCount: 5,
    percentage: 100,
    domainId: 'management-governance',
  },
];

export const getSampleStudyDates = (): string[] => {
  const dates: string[] = [];
  // 4 consecutive days including today for realistic sample state
  for (let i = 3; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
  }
  return dates;
};
