"use client";

import { useEffect, useState } from "react";
import { localStorageKeys } from "@/lib/localStorageKeys";
import { createReviewItem, getDueReviewItems, recordReviewResult } from "@/lib/reviewScheduler";
import type { ReviewQueueItem } from "@/types/studyPlan";

export default function ReviewQueue() {
  const [items, setItems] = useState<ReviewQueueItem[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const raw = localStorage.getItem(localStorageKeys.reviewQueue);
    const queue: ReviewQueueItem[] = raw ? JSON.parse(raw) : seedQueue();
    localStorage.setItem(localStorageKeys.reviewQueue, JSON.stringify(queue));
    setItems(queue);
  }, []);

  const due = getDueReviewItems(items);

  function updateItem(item: ReviewQueueItem, correct: boolean) {
    const next = items.map((current) => current.id === item.id ? recordReviewResult(current, correct) : current);
    localStorage.setItem(localStorageKeys.reviewQueue, JSON.stringify(next));
    setItems(next);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold text-rose-700">Review Queue</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">Today's Review</h1>
        <p className="mt-2 text-slate-600">Review schedule: today, tomorrow, after 3 days, after 7 days. Two correct reviews mark an item mastered.</p>
      </section>
      <section className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          {due.length === 0 && <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">No due review items today.</div>}
          {due.map((item) => (
            <article key={item.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-md bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700">{item.type}</span>
                <span className="text-xs text-slate-500">wrong {item.wrongCount} / review {item.reviewCount} / streak {item.correctStreak}</span>
              </div>
              <h2 className="mt-3 font-bold text-slate-950">{item.title}</h2>
              <p className="mt-2 leading-7 text-slate-700">{item.prompt}</p>
              <input value={answers[item.id] ?? ""} onChange={(event) => setAnswers((current) => ({ ...current, [item.id]: event.target.value }))} className="mt-4 w-full rounded-md border border-slate-300 px-3 py-3" placeholder="Recall or type your answer" />
              <div className="mt-4 flex gap-2">
                <button onClick={() => updateItem(item, true)} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-bold text-white">Correct</button>
                <button onClick={() => updateItem(item, false)} className="rounded-md bg-rose-600 px-4 py-2 text-sm font-bold text-white">Still Hard</button>
                <button onClick={() => setAnswers((current) => ({ ...current, [item.id]: item.answer }))} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700">Show Answer</button>
              </div>
              {answers[item.id] === item.answer && <p className="mt-3 rounded-md bg-slate-50 p-3 text-sm text-slate-700">Answer: {item.answer}. {item.explanation}</p>}
            </article>
          ))}
        </div>
        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-bold text-slate-950">Status</h3>
          <Stat label="Due Today" value={due.length} />
          <Stat label="Queue Total" value={items.length} />
          <Stat label="Mastered" value={items.filter((item) => item.mastered).length} />
        </aside>
      </section>
    </div>
  );
}

function seedQueue(): ReviewQueueItem[] {
  return [
    createReviewItem({ id: "seed-word-borrow", type: "word", level: "grade4", title: "borrow", prompt: "What does borrow mean?", answer: "借入，借来", explanation: "Borrow means to take and return later." }),
    createReviewItem({ id: "seed-grammar-passive", type: "grammar", level: "grade3", title: "Passive voice", prompt: "The hall (   ) last year.", answer: "was built", explanation: "Past passive: was/were + past participle." }),
  ];
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="mt-4 rounded-md bg-slate-50 p-4"><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-black text-slate-950">{value}</p></div>;
}
