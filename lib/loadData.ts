import grade3Grammar from "@/data/grade3/grammar_lessons.json";
import grade3MockExams from "@/data/grade3/mock_exams.json";
import grade3Questions from "@/data/grade3/questions.json";
import grade3Vocabulary from "@/data/grade3/vocabulary.json";
import grade4Grammar from "@/data/grade4/grammar_lessons.json";
import grade4MockExams from "@/data/grade4/mock_exams.json";
import grade4Questions from "@/data/grade4/questions.json";
import grade4Vocabulary from "@/data/grade4/vocabulary.json";
import pre2Grammar from "@/data/pre2/grammar_lessons.json";
import pre2MockExams from "@/data/pre2/mock_exams.json";
import pre2Questions from "@/data/pre2/questions.json";
import pre2Vocabulary from "@/data/pre2/vocabulary.json";
import type { ExamLevel, GrammarLesson, LevelData, MockExam, PracticeQuestion, VocabularyEntry } from "@/types/levels";

export const levelOptions: Array<{ level: ExamLevel; label: string; description: string }> = [
  { level: "grade4", label: "Grade 4 Level", description: "Junior high intermediate level" },
  { level: "grade3", label: "Grade 3 Level", description: "Junior high graduation level" },
  { level: "pre2", label: "Pre-2 Level", description: "High school lower-intermediate to intermediate level" },
];

export function levelLabel(level: ExamLevel) {
  return levelOptions.find((item) => item.level === level)?.label ?? "Grade 4 Level";
}

export const allLevelData: Record<ExamLevel, LevelData> = {
  grade4: {
    vocabulary: grade4Vocabulary as unknown as VocabularyEntry[],
    grammarLessons: grade4Grammar as unknown as GrammarLesson[],
    questions: grade4Questions as unknown as PracticeQuestion[],
    mockExams: grade4MockExams as unknown as MockExam[],
  },
  grade3: {
    vocabulary: grade3Vocabulary as unknown as VocabularyEntry[],
    grammarLessons: grade3Grammar as unknown as GrammarLesson[],
    questions: grade3Questions as unknown as PracticeQuestion[],
    mockExams: grade3MockExams as unknown as MockExam[],
  },
  pre2: {
    vocabulary: pre2Vocabulary as unknown as VocabularyEntry[],
    grammarLessons: pre2Grammar as unknown as GrammarLesson[],
    questions: pre2Questions as unknown as PracticeQuestion[],
    mockExams: pre2MockExams as unknown as MockExam[],
  },
};

export function getLevelData(level: ExamLevel) {
  return allLevelData[level] ?? allLevelData.grade4;
}

export function normalizeLevel(value: string | null | undefined): ExamLevel {
  if (value === "grade3" || value === "pre2" || value === "grade4") return value;
  return "grade4";
}
