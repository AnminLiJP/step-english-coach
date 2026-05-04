import { getLevelData, levelLabel } from "@/lib/loadData";
import type { ExamLevel as V2Level } from "@/types/levels";
import type { ExamLevel, Question } from "@/lib/types";

export { levelLabel };

export function getQuestions(level: ExamLevel) {
  return getLevelData(level as V2Level).questions.map((question) => ({
    id: question.id,
    level: question.level,
    type: normalizeType(question.type),
    question: question.passage ? `${question.passage}\n\n${question.question}` : question.question,
    choices: question.choices,
    answer: question.answer,
    explanation: question.explanationChinese,
    difficulty: normalizeDifficulty(question.difficulty),
    skillTags: question.skillTags,
  })) as Question[];
}

function normalizeType(type: string): Question["type"] {
  if (type === "grammar" || type === "reading" || type === "vocabulary") return type;
  return "reading";
}

function normalizeDifficulty(difficulty: number): 1 | 2 | 3 {
  if (difficulty <= 2) return 1;
  if (difficulty === 3) return 2;
  return 3;
}

