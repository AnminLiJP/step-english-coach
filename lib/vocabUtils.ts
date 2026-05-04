import type { ExamLevel, VocabularyEntry } from "@/types/levels";

export type VocabMode = "flashcard" | "en-to-zh" | "zh-to-en" | "spelling" | "sentence-fill";

export function getVocabChoices(entries: VocabularyEntry[], current: VocabularyEntry, field: "chineseMeaning" | "word", count = 4, seed = 1) {
  const currentIndex = entries.findIndex((entry) => entry.id === current.id);
  const pool = entries.filter((entry) => entry.id !== current.id);
  const distractors: string[] = [];

  for (let i = 0; distractors.length < count - 1 && i < pool.length * 2; i++) {
    const candidate = pool[(currentIndex + seed * 3 + i * 11) % pool.length]?.[field];
    if (candidate && candidate !== current[field] && !distractors.includes(candidate)) {
      distractors.push(candidate);
    }
  }

  return shuffle([current[field], ...distractors], hashSeed(`${current.id}-${field}-${seed}`));
}

export function getSentenceBlank(entry: VocabularyEntry) {
  const pattern = new RegExp(`\\b${entry.word}\\b`, "i");
  return entry.exampleSentence.replace(pattern, "(   )");
}

export function formatPhonetic(entry?: Pick<VocabularyEntry, "phonetic"> | null) {
  return entry?.phonetic?.trim() ?? "";
}

export function findVocabEntryInText(text: string, entries: VocabularyEntry[]) {
  const quotedWord = text.match(/"([^"]+)"/)?.[1]?.toLowerCase();
  if (quotedWord) {
    const exact = entries.find((entry) => entry.word.toLowerCase() === quotedWord);
    if (exact) return exact;
  }

  const lowerText = text.toLowerCase();
  return entries.find((entry) => new RegExp(`\\b${escapeRegExp(entry.word.toLowerCase())}\\b`).test(lowerText));
}

export function scoreVocabAnswer(mode: VocabMode, entry: VocabularyEntry, answer: string) {
  const normalized = answer.trim().toLowerCase();
  if (mode === "en-to-zh") return answer === entry.chineseMeaning;
  if (mode === "zh-to-en" || mode === "spelling" || mode === "sentence-fill") return normalized === entry.word.toLowerCase();
  return true;
}

export function shuffle<T>(items: T[], seed = 1) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.abs(seed + i * 17) % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function hashSeed(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function nextIndex(index: number, length: number) {
  return (index + 1) % Math.max(length, 1);
}

export function levelStoragePrefix(level: ExamLevel) {
  return `step-english-${level}`;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

