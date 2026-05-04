export type ExamLevel = "grade4" | "grade3" | "pre2";

export type Question = {
  id: string;
  level: ExamLevel;
  type: "vocabulary" | "grammar" | "reading";
  question: string;
  choices: string[];
  answer: string;
  explanation: string;
  phonetic?: string;
  targetWord?: string;
  difficulty: 1 | 2 | 3;
  skillTags?: string[];
  calibration?: "below_level" | "on_level" | "stretch";
};

export type Mistake = Question & {
  selected: string;
  savedAt: string;
};

