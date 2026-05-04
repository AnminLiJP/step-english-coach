import fs from "node:fs";
import path from "node:path";

type Level = "grade4" | "grade3" | "pre2";

const levels: Level[] = ["grade4", "grade3", "pre2"];
const root = process.cwd();
let errorCount = 0;

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(path.join(root, file), "utf8")) as T;
}

function fail(message: string) {
  errorCount += 1;
  console.error(`FAIL ${message}`);
}

function containsPlaceholder(value: unknown) {
  return typeof value === "string" && /\b[A-Za-z][A-Za-z-]*\s+的意思\b/.test(value);
}

function checkNoPlaceholders(value: unknown, label: string) {
  if (containsPlaceholder(value)) fail(`${label} contains placeholder text: ${value}`);
  if (Array.isArray(value)) value.forEach((item, index) => checkNoPlaceholders(item, `${label}[${index}]`));
  if (value && typeof value === "object") {
    for (const [key, nested] of Object.entries(value)) checkNoPlaceholders(nested, `${label}.${key}`);
  }
}

for (const level of levels) {
  const base = `data/${level}`;
  const vocabulary = readJson<any[]>(`${base}/vocabulary.json`);
  const grammar = readJson<any[]>(`${base}/grammar_lessons.json`);
  const questions = readJson<any[]>(`${base}/questions.json`);
  const exams = readJson<any[]>(`${base}/mock_exams.json`);

  console.log(`${level}: vocabulary=${vocabulary.length}, grammar=${grammar.length}, questions=${questions.length}, exams=${exams.length}`);

  if (vocabulary.length < 100) fail(`${level} vocabulary has fewer than 100 entries`);
  if (grammar.length < 15) fail(`${level} grammar has fewer than 15 lessons`);
  if (questions.length < 100) fail(`${level} questions has fewer than 100 items`);
  if (exams.length < 5) fail(`${level} mock exams has fewer than 5 sets`);

  for (const word of vocabulary) {
    for (const key of ["word", "phonetic", "japaneseMeaning", "chineseMeaning", "exampleSentence", "exampleTranslationChinese", "exampleTranslationJapanese"]) {
      if (!word[key]) fail(`${level} word ${word.id} missing ${key}`);
    }
    checkNoPlaceholders(word, `${level} word ${word.id}`);
  }

  for (const lesson of grammar) {
    if (!lesson.explanationChinese || !lesson.explanationJapanese || !lesson.structure) fail(`${level} grammar ${lesson.id} missing explanation/structure`);
    if (!Array.isArray(lesson.examples) || lesson.examples.length === 0) fail(`${level} grammar ${lesson.id} missing examples`);
    if (!Array.isArray(lesson.miniQuiz) || lesson.miniQuiz.length === 0) fail(`${level} grammar ${lesson.id} missing miniQuiz`);
    for (const quiz of lesson.miniQuiz ?? []) {
      if (!Array.isArray(quiz.choices) || !quiz.choices.includes(quiz.answer)) fail(`${level} grammar quiz answer not in choices: ${lesson.id}`);
      if (!quiz.explanationChinese) fail(`${level} grammar quiz missing Chinese explanation: ${lesson.id}`);
    }
  }

  const seenQuestions = new Set<string>();
  for (const question of questions) {
    if (seenQuestions.has(question.question)) fail(`${level} duplicate question: ${question.question}`);
    seenQuestions.add(question.question);
    if (!Array.isArray(question.choices) || question.choices.length !== 4) fail(`${level} question ${question.id} does not have 4 choices`);
    if (!question.choices?.includes(question.answer)) fail(`${level} question ${question.id} answer not in choices`);
    if (!question.explanationChinese) fail(`${level} question ${question.id} missing Chinese explanation`);
    if (question.type === "reading" && !question.passage) fail(`${level} reading question ${question.id} missing passage`);
    checkNoPlaceholders(question, `${level} question ${question.id}`);
  }

  for (const exam of exams) {
    const sections = exam.sections;
    if (!sections?.answerKey) fail(`${level} exam ${exam.examId} missing answerKey`);
    if (level !== "grade4" && (!Array.isArray(sections?.writing) || sections.writing.length === 0)) fail(`${level} exam ${exam.examId} missing writing`);
    for (const task of sections?.writing ?? []) {
      if (!task.sampleAnswer && !Array.isArray(task.points)) fail(`${level} writing task ${task.id} missing sample answer/rubric`);
    }
    checkNoPlaceholders(exam, `${level} exam ${exam.examId}`);
  }
}

if (errorCount > 0) {
  console.error(`Content quality check failed with ${errorCount} issue(s).`);
  process.exit(1);
}

console.log("Content quality check passed.");

