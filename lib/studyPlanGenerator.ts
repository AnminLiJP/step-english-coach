import { getLevelData, levelLabel } from "@/lib/loadData";
import type { ExamLevel } from "@/types/levels";
import type { DailyStudyTask, StudyPlan, StudyPlanDuration, StudyWeakness } from "@/types/studyPlan";

const focusCycle: StudyWeakness[] = ["vocabulary", "grammar", "reading", "writing"];

export function generateStudyPlan(
  level: ExamLevel,
  durationDays: StudyPlanDuration,
  weakness: StudyWeakness,
  startDate = new Date(),
): StudyPlan {
  const data = getLevelData(level);
  const days: DailyStudyTask[] = [];

  for (let day = 1; day <= durationDays; day++) {
    const date = addDays(startDate, day - 1);
    const focus = day % 3 === 0 ? weakness : focusCycle[(day - 1) % focusCycle.length];
    const vocabStart = ((day - 1) * 8) % data.vocabulary.length;
    const grammar = data.grammarLessons[(day - 1) % data.grammarLessons.length];
    const questionStart = ((day - 1) * 5) % data.questions.length;

    days.push({
      id: `${level}-day-${day}`,
      day,
      date: toDateKey(date),
      vocabularyTask: `${levelLabel(level)} words ${vocabStart + 1}-${Math.min(
        vocabStart + 8,
        data.vocabulary.length,
      )}: learn 8 words and finish one quiz round.`,
      grammarTask: `Study grammar: ${grammar.title}. Finish the mini quiz.`,
      practiceTask: `Complete practice questions ${questionStart + 1}-${questionStart + 5}. Focus: ${focusLabel(
        focus,
      )}.`,
      reviewTask:
        day === 1
          ? "Review any new mistakes from today."
          : "Review due mistakes and wrong words, at least 5 items.",
      mockExamTask:
        day % 7 === 0
          ? `Weekly mock exam: Mock Exam ${Math.min(Math.ceil(day / 7), 5)}. Review the answer explanations.`
          : undefined,
      focus,
    });
  }

  return {
    id: `plan-${level}-${durationDays}-${Date.now()}`,
    level,
    durationDays,
    weakness,
    createdAt: new Date().toISOString(),
    startDate: toDateKey(startDate),
    days,
  };
}

export function getTodayTask(plan: StudyPlan | null, today = new Date()) {
  if (!plan) return null;
  const key = toDateKey(today);
  return plan.days.find((day) => day.date === key) ?? plan.days[0] ?? null;
}

export function focusLabel(focus: StudyWeakness) {
  const labels: Record<StudyWeakness, string> = {
    vocabulary: "vocabulary",
    grammar: "grammar",
    reading: "reading",
    writing: "writing",
  };
  return labels[focus];
}

export function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}
