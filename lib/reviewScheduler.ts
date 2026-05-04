import { toDateKey } from "@/lib/studyPlanGenerator";
import type { ExamLevel } from "@/types/levels";
import type { ReviewItemType, ReviewQueueItem } from "@/types/studyPlan";

const reviewDelays = [0, 1, 3, 7];

export function createReviewItem(input: {
  id: string;
  type: ReviewItemType;
  level: ExamLevel;
  title: string;
  prompt: string;
  answer: string;
  explanation?: string;
  sourceId?: string;
}): ReviewQueueItem {
  return {
    ...input,
    wrongCount: 1,
    reviewCount: 0,
    correctStreak: 0,
    nextReviewDate: toDateKey(new Date()),
    mastered: false,
    updatedAt: new Date().toISOString(),
  };
}

export function recordWrong(item: ReviewQueueItem): ReviewQueueItem {
  const wrongCount = item.wrongCount + 1;
  return {
    ...item,
    wrongCount,
    correctStreak: 0,
    mastered: false,
    nextReviewDate: toDateKey(addDays(new Date(), reviewDelays[Math.min(wrongCount - 1, reviewDelays.length - 1)])),
    updatedAt: new Date().toISOString(),
  };
}

export function recordReviewResult(item: ReviewQueueItem, correct: boolean): ReviewQueueItem {
  const correctStreak = correct ? item.correctStreak + 1 : 0;
  const wrongCount = correct ? item.wrongCount : item.wrongCount + 1;
  return {
    ...item,
    wrongCount,
    reviewCount: item.reviewCount + 1,
    correctStreak,
    mastered: correctStreak >= 2,
    nextReviewDate: correctStreak >= 2 ? item.nextReviewDate : toDateKey(addDays(new Date(), reviewDelays[Math.min(wrongCount - 1, reviewDelays.length - 1)])),
    updatedAt: new Date().toISOString(),
  };
}

export function getDueReviewItems(items: ReviewQueueItem[], today = new Date()) {
  const key = toDateKey(today);
  return items.filter((item) => !item.mastered && item.nextReviewDate <= key);
}

export function upsertReviewItem(items: ReviewQueueItem[], item: ReviewQueueItem) {
  const existing = items.find((current) => current.id === item.id);
  if (!existing) return [item, ...items];
  return items.map((current) => current.id === item.id ? recordWrong(current) : current);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

