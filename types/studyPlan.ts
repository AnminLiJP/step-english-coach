import type { ExamLevel } from "@/types/levels";

export type StudyWeakness = "vocabulary" | "grammar" | "reading" | "writing";
export type StudyPlanDuration = 14 | 28 | 56;

export type DailyStudyTask = {
  id: string;
  day: number;
  date: string;
  vocabularyTask: string;
  grammarTask: string;
  practiceTask: string;
  reviewTask: string;
  mockExamTask?: string;
  focus: StudyWeakness;
  completed?: boolean;
};

export type StudyPlan = {
  id: string;
  level: ExamLevel;
  durationDays: StudyPlanDuration;
  weakness: StudyWeakness;
  createdAt: string;
  startDate: string;
  days: DailyStudyTask[];
};

export type ReviewItemType = "word" | "grammar" | "question" | "exam";

export type ReviewQueueItem = {
  id: string;
  type: ReviewItemType;
  level: ExamLevel;
  title: string;
  prompt: string;
  answer: string;
  explanation?: string;
  wrongCount: number;
  reviewCount: number;
  correctStreak: number;
  nextReviewDate: string;
  mastered: boolean;
  sourceId?: string;
  updatedAt: string;
};

