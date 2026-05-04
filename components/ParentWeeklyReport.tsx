"use client";

import { useEffect, useMemo, useState } from "react";
import { localStorageKeys } from "@/lib/localStorageKeys";
import type { StudyPlan } from "@/types/studyPlan";

type ReportStats = {
  studyDays: number;
  completedTasks: number;
  learnedWords: number;
  grammarAccuracy: number;
  readingAccuracy: number;
  writingCount: number;
  mistakeCount: number;
  weakest: string;
  suggestion: string;
};

export default function ParentWeeklyReport() {
  const [stats, setStats] = useState<ReportStats | null>(null);

  useEffect(() => setStats(buildReport()), []);

  const cards = useMemo(() => stats ? [
    ["Study Days", stats.studyDays],
    ["Completed Tasks", stats.completedTasks],
    ["Learned Words", stats.learnedWords],
    ["Grammar Accuracy", `${stats.grammarAccuracy}%`],
    ["Reading Accuracy", `${stats.readingAccuracy}%`],
    ["Writing Count", stats.writingCount],
    ["Mistakes", stats.mistakeCount],
    ["Weakest Area", stats.weakest],
  ] : [], [stats]);

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><p className="text-sm font-bold text-sky-700">Parent Report</p><h1 className="mt-1 text-3xl font-black text-slate-950">Weekly Parent Report</h1><p className="mt-2 text-slate-600">Generated from local browser learning records.</p></div>
          <button onClick={() => window.print()} className="rounded-md bg-sky-600 px-5 py-3 text-sm font-bold text-white print:hidden">Print Report</button>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(([label, value]) => <div key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-black text-slate-950">{value}</p></div>)}</section>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-bold text-slate-950">Next Week Suggestion</h2><p className="mt-3 leading-7 text-slate-700">{stats.suggestion}</p></section>
    </div>
  );
}

function buildReport(): ReportStats {
  const plan = JSON.parse(localStorage.getItem(localStorageKeys.studyPlan) ?? "null") as StudyPlan | null;
  const learnedWords = JSON.parse(localStorage.getItem(localStorageKeys.learnedWords) ?? "[]") as string[];
  const mistakes = JSON.parse(localStorage.getItem(localStorageKeys.mistakes) ?? "[]") as unknown[];
  const grammarMistakes = JSON.parse(localStorage.getItem(localStorageKeys.grammarMistakes) ?? "[]") as unknown[];
  const examResults = JSON.parse(localStorage.getItem(localStorageKeys.examResults) ?? "[]") as Array<{ correct: number; total: number }>;
  const writingLog = JSON.parse(localStorage.getItem(localStorageKeys.writingPracticeLog) ?? "[]") as unknown[];
  const completedDays = plan?.days.filter((day) => day.completed) ?? [];
  const recentExam = examResults[0];
  const readingAccuracy = recentExam ? Math.round((recentExam.correct / recentExam.total) * 100) : 0;
  const grammarAccuracy = grammarMistakes.length ? Math.max(40, 100 - grammarMistakes.length * 5) : 90;
  const weakest = getWeakest(grammarMistakes.length, mistakes.length, writingLog.length, learnedWords.length);
  return { studyDays: completedDays.length, completedTasks: completedDays.length * 4, learnedWords: learnedWords.length, grammarAccuracy, readingAccuracy, writingCount: writingLog.length, mistakeCount: mistakes.length, weakest, suggestion: suggestionFor(weakest) };
}

function getWeakest(grammarMistakes: number, mistakes: number, writingCount: number, learnedWords: number) {
  if (learnedWords < 30) return "Vocabulary";
  if (grammarMistakes > 5) return "Grammar";
  if (mistakes > 10) return "Reading / Practice";
  if (writingCount < 2) return "Writing";
  return "Overall Consistency";
}

function suggestionFor(weakest: string) {
  if (weakest === "Vocabulary") return "Start each day with 10 words, then review wrong words.";
  if (weakest === "Grammar") return "Review three grammar lessons and repeat mini quizzes.";
  if (weakest === "Reading / Practice") return "Do one reading set every two days and explain the answer evidence.";
  if (weakest === "Writing") return "Complete at least two writing tasks next week.";
  return "Keep the current pace and complete one mock exam each week.";
}
