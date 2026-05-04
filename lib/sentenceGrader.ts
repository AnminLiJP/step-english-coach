import type { SentenceGrade, VocabularyEntry } from "@/types/levels";

const subjectPattern = /\b(I|You|He|She|We|They|It|My|Your|The|A|An|This|That)\b/i;
const verbPattern = /\b(am|is|are|was|were|have|has|had|do|does|did|can|will|must|like|likes|go|goes|went|study|studies|studied|use|uses|used|make|makes|made|borrow|borrows|borrowed|help|helps|helped|learn|learns|learned)\b/i;

export function gradeSentence(entry: VocabularyEntry, sentence: string): SentenceGrade {
  const feedback: string[] = [];
  let score = 0;
  const trimmed = sentence.trim();

  if (new RegExp(`\\b${entry.word}\\b`, "i").test(trimmed)) score += 2;
  else feedback.push(`Use the target word "${entry.word}" in your sentence.`);

  if (/^[A-Z]/.test(trimmed)) score += 1;
  else feedback.push("Start the sentence with a capital letter.");

  if (/[.!?]$/.test(trimmed)) score += 1;
  else feedback.push("End the sentence with punctuation.");

  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
  if (wordCount >= 5 && wordCount <= 18) score += 2;
  else feedback.push("Use a sentence between 5 and 18 words.");

  if (subjectPattern.test(trimmed)) score += 1;
  else feedback.push("The sentence may be missing a subject.");

  if (verbPattern.test(trimmed)) score += 1;
  else feedback.push("The sentence may be missing a verb.");

  if (feedback.length === 0) feedback.push("Clear sentence. The target word is used well.");

  return { score, maxScore: 8, feedback, sampleSentence: entry.exampleSentence };
}

export async function futureAiSentenceGrade(entry: VocabularyEntry, sentence: string) {
  return gradeSentence(entry, sentence);
}
