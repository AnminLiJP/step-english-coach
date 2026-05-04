export type ExamLevel = "grade4" | "grade3" | "pre2";

export type QuestionType = "vocabulary" | "grammar" | "reading" | "sentence_order" | "short_dialogue";

export type VocabularyEntry = {
  id: string;
  word: string;
  phonetic: string;
  japaneseMeaning: string;
  chineseMeaning: string;
  partOfSpeech: string;
  level: ExamLevel;
  exampleSentence: string;
  exampleTranslationChinese: string;
  exampleTranslationJapanese: string;
  synonyms: string[];
  antonyms: string[];
  difficulty: number;
  tags: string[];
};

export type GrammarExample = {
  english: string;
  chinese: string;
  japanese: string;
};

export type GrammarQuiz = {
  question: string;
  choices: string[];
  answer: string;
  explanationChinese: string;
};

export type GrammarLesson = {
  id: string;
  title: string;
  level: ExamLevel;
  explanationChinese: string;
  explanationJapanese: string;
  structure: string;
  examples: GrammarExample[];
  commonMistakes: string[];
  miniQuiz: GrammarQuiz[];
};

export type PracticeQuestion = {
  id: string;
  level: ExamLevel;
  type: QuestionType;
  question: string;
  passage: string;
  choices: string[];
  answer: string;
  explanationChinese: string;
  explanationJapanese: string;
  difficulty: number;
  skillTags: string[];
};

export type WritingTask = {
  id: string;
  prompt: string;
  targetWords: string;
  sampleAnswer: string;
  points: string[];
};

export type ExamSection = {
  vocabulary: PracticeQuestion[];
  grammar: PracticeQuestion[];
  reading: PracticeQuestion[];
  shortDialogue?: PracticeQuestion[];
  sentenceOrder?: PracticeQuestion[];
  writing?: WritingTask[];
  answerKey: Record<string, string>;
};

export type MockExam = {
  examId: string;
  level: ExamLevel;
  title: string;
  estimatedMinutes: number;
  sections: ExamSection;
};

export type LevelData = {
  vocabulary: VocabularyEntry[];
  grammarLessons: GrammarLesson[];
  questions: PracticeQuestion[];
  mockExams: MockExam[];
};

export type SentenceGrade = {
  score: number;
  maxScore: number;
  feedback: string[];
  sampleSentence: string;
};

export type WritingGrade = {
  score: number;
  maxScore: number;
  feedback: string[];
  sampleAnswer: string;
};

