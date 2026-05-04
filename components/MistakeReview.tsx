"use client";

import { useEffect, useState } from "react";
import { levelLabel } from "@/lib/questions";
import { localStorageKeys } from "@/lib/localStorageKeys";
import type { Mistake } from "@/lib/types";

export default function MistakeReview() {
  const [mistakes, setMistakes] = useState<Mistake[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(localStorageKeys.mistakes);
    setMistakes(raw ? JSON.parse(raw) : []);
  }, []);

  function clearMistakes() {
    localStorage.removeItem(localStorageKeys.mistakes);
    setMistakes([]);
  }

  if (mistakes.length === 0) {
    return <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">No mistakes yet. Try Practice or Mock Exam first.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={clearMistakes} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Clear</button>
      </div>
      {mistakes.map((item) => (
        <article key={item.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-bold text-sky-700">{levelLabel(item.level)}</span>
            <span className="text-xs text-slate-500">{new Date(item.savedAt).toLocaleDateString()}</span>
          </div>
          <p className="mt-3 font-semibold leading-7 text-slate-950">{item.question}</p>
          <p className="mt-3 text-sm text-rose-700">Your answer: {item.selected}</p>
          <p className="mt-1 text-sm text-emerald-700">Correct answer: {item.answer}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">{item.explanation}</p>
        </article>
      ))}
    </div>
  );
}
