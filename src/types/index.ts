export type DomainId = 'cloud-concepts' | 'architecture-services' | 'management-governance';

export type Difficulty = 'Foundational' | 'Intermediate' | 'Advanced';

export interface DomainMeta {
  id: DomainId;
  name: string;
  weightRange: string; // e.g. "25-30%"
  description: string;
  targetCount: number;
  color: string;
  accentBg: string;
}

export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface Question {
  id: string;
  domainId: DomainId;
  subtopic: string;
  difficulty: Difficulty;
  scenario?: string;
  question: string;
  options: QuestionOption[];
  correctOptionId: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  whyOthersIncorrect: Record<'A' | 'B' | 'C' | 'D', string>;
  keyTakeaway: string;
  learnUrl: string;
  learnTitle: string;
  isAlternate?: boolean;
  parentQuestionId?: string; // Links this alternate question to a base question for the Weak-Spot Learning Loop
}

export interface Flashcard {
  id: string;
  domainId: DomainId;
  subtopic: string;
  term: string;
  tag: string;
  frontPrompt: string;
  backDefinition: string;
  examTip: string;
  example: string;
  learnUrl: string;
}

export interface UserAttempt {
  questionId: string;
  selectedOptionId: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  timestamp: number;
}

export interface QuizSessionSummary {
  id: string;
  timestamp: number;
  title: string;
  totalQuestions: number;
  correctCount: number;
  percentage: number;
  domainId?: DomainId | 'all';
}

export interface Recommendation {
  priorityDomainId: DomainId;
  status: 'critical' | 'needs-attention' | 'on-track' | 'untouched';
  headline: string;
  reason: string;
  keyWeaknesses: string[];
  suggestedActionLabel: string;
  actionType: 'quiz-domain' | 'quiz-missed' | 'flashcards-review' | 'start-diagnostic';
}

export interface StudyTask {
  id: string;
  dayLabel: string;
  dayNumber: number;
  title: string;
  domainId: DomainId;
  durationMinutes: number;
  objective: string;
  actionType: 'quiz' | 'flashcards' | 'exam' | 'review';
  completed: boolean;
}

export type PromptLevel = 'beginner' | 'intermediate' | 'exam-revision';
export type PromptMethod = 'analogy' | 'step-by-step' | 'scenario' | 'comparison';

export interface PromptTopic {
  id: string;
  domainId: DomainId;
  name: string;
  description: string;
  keyConcepts: string[];
  sampleQuestionRef?: string;
}
