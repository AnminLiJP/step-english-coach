import { getLevelData, levelLabel } from "@/lib/loadData";
import { findVocabEntryInText, formatPhonetic } from "@/lib/vocabUtils";
import type { ExamLevel as V2Level } from "@/types/levels";
import type { ExamLevel, Question } from "@/lib/types";

export { levelLabel };

export function getQuestions(level: ExamLevel) {
  const data = getLevelData(level as V2Level);
  return data.questions.map((question) => {
    const type = normalizeType(question.type);
    const target = type === "vocabulary" ? findVocabEntryInText(question.question, data.vocabulary) : undefined;

    return {
      id: question.id,
      level: question.level,
      type,
      question: question.passage ? `${question.passage}\n\n${question.question}` : question.question,
      choices: question.choices,
      answer: question.answer,
      explanation: question.explanationChinese,
      phonetic: formatPhonetic(target),
      targetWord: target?.word,
      difficulty: normalizeDifficulty(question.difficulty),
      skillTags: question.skillTags,
    };
  }) as Question[];
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
