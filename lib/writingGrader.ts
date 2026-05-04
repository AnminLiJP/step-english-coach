import type { WritingGrade, WritingTask } from "@/types/levels";

export function gradeWriting(task: WritingTask, text: string): WritingGrade {
  const feedback: string[] = [];
  const trimmed = text.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  const minWords = Number(task.targetWords.match(/\d+/)?.[0] ?? 25);
  let score = 0;

  if (words.length >= minWords) score += 2;
  else feedback.push(`Word count is low. Try to write at least ${minWords} words.`);

  if (/\bbecause\b|\bso\b|\btherefore\b|\bfor example\b/i.test(text)) score += 2;
  else feedback.push("Add a reason or example, such as because or for example.");

  if (/\bfirst\b|\bsecond\b|\balso\b|\bhowever\b|\btherefore\b/i.test(text)) score += 2;
  else feedback.push("Use connectors such as First, Also, However, or Therefore.");

  if (/\bI think\b|\bIn my opinion\b|\bI believe\b/i.test(text)) score += 1;
  else feedback.push("State your opinion clearly, for example: I think ...");

  if (/[.!?]$/.test(trimmed)) score += 1;
  else feedback.push("End the last sentence with proper punctuation.");

  if (feedback.length === 0) {
    feedback.push("Good structure: opinion, reasons, connectors, and punctuation are clear.");
  }

  return {
    score,
    maxScore: 8,
    feedback,
    sampleAnswer: task.sampleAnswer,
  };
}

export async function futureAiWritingGrade(task: WritingTask, text: string) {
  return gradeWriting(task, text);
}
