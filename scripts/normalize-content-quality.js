const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const levels = ["grade4", "grade3", "pre2"];

const partOfSpeech = {
  activity: "noun",
  advice: "noun",
  announce: "verb",
  article: "noun",
  attend: "verb",
  careless: "adjective",
  challenge: "noun",
  choice: "noun",
  collect: "verb",
  compare: "verb",
  condition: "noun",
  connect: "verb",
  continue: "verb",
  culture: "noun",
  daily: "adjective",
  describe: "verb",
  develop: "verb",
  difference: "noun",
  discover: "verb",
  effort: "noun",
  event: "noun",
  favorite: "adjective",
  healthy: "adjective",
  improve: "verb",
  include: "verb",
  interest: "noun",
  invite: "verb",
  local: "adjective",
  message: "noun",
  necessary: "adjective",
  notice: "verb",
  opinion: "noun",
  prepare: "verb",
  project: "noun",
  reason: "noun",
  receive: "verb",
  recent: "adjective",
  remember: "verb",
  schedule: "noun",
  several: "adjective",
  share: "verb",
  similar: "adjective",
  situation: "noun",
  special: "adjective",
  support: "verb",
  useful: "adjective",
  visitor: "noun",
  while: "conjunction",
  without: "preposition",
  wonder: "verb",
  achieve: "verb",
  allow: "verb",
  appear: "verb",
  available: "adjective",
  balance: "noun",
  benefit: "noun",
  cause: "noun",
  comfortable: "adjective",
  consider: "verb",
  create: "verb",
  decision: "noun",
  education: "noun",
  effective: "adjective",
  especially: "adverb",
  focus: "verb",
  habit: "noun",
  instead: "adverb",
  knowledge: "noun",
  method: "noun",
  modern: "adjective",
  natural: "adjective",
  patient: "adjective",
  personal: "adjective",
  possible: "adjective",
  protect: "verb",
  public: "adjective",
  purpose: "noun",
  quality: "noun",
  result: "noun",
  safe: "adjective",
  serious: "adjective",
  simple: "adjective",
  skill: "noun",
  society: "noun",
  solution: "noun",
  suggestion: "noun",
  traditional: "adjective",
  transportation: "noun",
  valuable: "adjective",
  various: "adjective",
};

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
}

function writeJson(file, data) {
  fs.writeFileSync(path.join(root, file), `${JSON.stringify(data, null, 2)}\n`);
}

function hash(value) {
  let result = 0;
  for (let i = 0; i < value.length; i++) result = (result * 31 + value.charCodeAt(i)) | 0;
  return Math.abs(result);
}

function shuffle(items, seed) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.abs(seed + i * 17) % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function extractTargetWord(question) {
  return question.match(/word "([^"]+)"/)?.[1] ?? question.match(/What does "([^"]+)"/)?.[1] ?? "";
}

function uniqueMeanings(vocabulary, current) {
  return vocabulary
    .filter((entry) => entry.id !== current.id && entry.chineseMeaning && entry.chineseMeaning !== current.chineseMeaning)
    .map((entry) => entry.chineseMeaning)
    .filter((meaning, index, all) => all.indexOf(meaning) === index);
}

function normalizeVocabularyEntry(entry, level) {
  if (partOfSpeech[entry.word]) entry.partOfSpeech = partOfSpeech[entry.word];
  if (entry.exampleTranslationChinese?.includes("这句话展示")) {
    entry.exampleTranslationChinese = `这个例句展示 ${entry.word} 在学习和日常话题中的用法。`;
  }
  if (entry.exampleTranslationJapanese?.includes("の使い方")) {
    entry.exampleTranslationJapanese = `この例文は ${entry.word} の使い方を示しています。`;
  }
  if (entry.exampleSentence?.includes(`discussed ${entry.word}`)) {
    entry.exampleSentence =
      level === "pre2"
        ? `Students discussed how to use ${entry.word} in a clear opinion.`
        : `Students practiced ${entry.word} in a short classroom sentence.`;
  }
  return entry;
}

function normalizeVocabularyQuestion(question, vocabularyByWord, vocabulary) {
  if (question.type !== "vocabulary") return question;
  const word = extractTargetWord(question.question);
  const entry = vocabularyByWord.get(word);
  if (!entry) return question;

  const distractors = uniqueMeanings(vocabulary, entry).slice(hash(question.id) % 20, hash(question.id) % 20 + 3);
  const fallback = uniqueMeanings(vocabulary, entry).slice(0, 3);
  const choices = [entry.chineseMeaning, ...distractors, ...fallback]
    .filter((choice, index, all) => choice && all.indexOf(choice) === index)
    .slice(0, 4);

  question.answer = entry.chineseMeaning;
  question.choices = shuffle(choices, hash(`${question.id}-${entry.word}`));
  question.explanationChinese = `根据上下文，${entry.word} 在这里表示“${entry.chineseMeaning}”。先确认句子场景，再选择最合适的中文意思。`;
  question.explanationJapanese = `文脈から ${entry.word} は「${entry.japaneseMeaning}」の意味です。`;
  return question;
}

function normalizeExam(exam, vocabularyByWord, vocabulary) {
  for (const [sectionName, section] of Object.entries(exam.sections)) {
    if (!Array.isArray(section)) continue;
    for (const item of section) normalizeVocabularyQuestion(item, vocabularyByWord, vocabulary);
  }

  exam.sections.answerKey = {};
  for (const [sectionName, section] of Object.entries(exam.sections)) {
    if (sectionName === "answerKey" || !Array.isArray(section)) continue;
    for (const item of section) {
      if (item.id && item.answer) exam.sections.answerKey[item.id] = item.answer;
    }
  }
  return exam;
}

for (const level of levels) {
  const base = `data/${level}`;
  const vocabulary = readJson(`${base}/vocabulary.json`).map((entry) => normalizeVocabularyEntry(entry, level));
  const vocabularyByWord = new Map(vocabulary.map((entry) => [entry.word, entry]));
  const questions = readJson(`${base}/questions.json`).map((question) =>
    normalizeVocabularyQuestion(question, vocabularyByWord, vocabulary),
  );
  const exams = readJson(`${base}/mock_exams.json`).map((exam) => normalizeExam(exam, vocabularyByWord, vocabulary));

  writeJson(`${base}/vocabulary.json`, vocabulary);
  writeJson(`${base}/questions.json`, questions);
  writeJson(`${base}/mock_exams.json`, exams);
}

console.log("Content choices, vocabulary metadata, and answer keys normalized.");
