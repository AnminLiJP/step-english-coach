import type { GrammarLesson } from "@/types/levels";

export function getLessonProgressKey(lesson: GrammarLesson) {
  return `grammar-${lesson.level}-${lesson.id}`;
}

export function scoreGrammarQuiz(lesson: GrammarLesson, answers: Record<number, string>) {
  return lesson.miniQuiz.reduce((score, quiz, index) => score + (answers[index] === quiz.answer ? 1 : 0), 0);
}

