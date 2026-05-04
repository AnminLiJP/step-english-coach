import type { MockExam, PracticeQuestion, WritingTask } from "@/types/levels";

export type ExamQuestion = PracticeQuestion & {
  sectionName: "vocabulary" | "grammar" | "reading" | "shortDialogue" | "sentenceOrder";
};

export function flattenExamQuestions(exam: MockExam): ExamQuestion[] {
  const sections = exam.sections;
  return [
    ...sections.vocabulary.map((q) => ({ ...q, sectionName: "vocabulary" as const })),
    ...sections.grammar.map((q) => ({ ...q, sectionName: "grammar" as const })),
    ...sections.reading.map((q) => ({ ...q, sectionName: "reading" as const })),
    ...(sections.shortDialogue ?? []).map((q) => ({ ...q, sectionName: "shortDialogue" as const })),
    ...(sections.sentenceOrder ?? []).map((q) => ({ ...q, sectionName: "sentenceOrder" as const })),
  ];
}

export function scoreExam(exam: MockExam, answers: Record<string, string>) {
  const questions = flattenExamQuestions(exam);
  const correct = questions.filter((question) => answers[question.id] === question.answer);
  const sectionTotals: Record<string, { correct: number; total: number }> = {};
  for (const question of questions) {
    sectionTotals[question.sectionName] ??= { correct: 0, total: 0 };
    sectionTotals[question.sectionName].total += 1;
    if (answers[question.id] === question.answer) sectionTotals[question.sectionName].correct += 1;
  }
  return { total: questions.length, correct: correct.length, sectionTotals };
}

export function getWritingTasks(exam: MockExam): WritingTask[] {
  return exam.sections.writing ?? [];
}

