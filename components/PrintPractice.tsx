"use client";

import { useEffect, useState } from "react";
import { getQuestions, levelLabel } from "@/lib/questions";
import { localStorageKeys } from "@/lib/localStorageKeys";
import type { ExamLevel } from "@/lib/types";

export default function PrintPractice() {
  const [level, setLevel] = useState<ExamLevel>("grade4");

  useEffect(() => {
    setLevel((localStorage.getItem(localStorageKeys.level) as ExamLevel) ?? "grade4");
  }, []);

  const questions = getQuestions(level).slice(0, 10);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm print:border-0 print:shadow-none">
      <div className="flex items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Printable Practice</h1>
          <p className="mt-1 text-sm text-slate-600">Current level: {levelLabel(level)}</p>
        </div>
        <button onClick={() => window.print()} className="rounded-md bg-sky-600 px-5 py-3 text-sm font-bold text-white">Print</button>
      </div>
      <div className="mt-8 print:mt-0">
        <div className="hidden print:block">
          <h1 className="text-2xl font-bold">{levelLabel(level)} Daily Practice</h1>
          <p className="mt-2">Name: ____________________ Date: ____________________</p>
        </div>
        <ol className="mt-6 space-y-6">
          {questions.map((question, index) => (
            <li key={question.id} className="break-inside-avoid">
              <p className="font-semibold">{index + 1}. {question.question}</p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">{question.choices.map((choice, choiceIndex) => <span key={choice}>{String.fromCharCode(65 + choiceIndex)}. {choice}</span>)}</div>
              <p className="mt-3 text-sm">Answer: ________</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 border-t border-slate-300 pt-4">
          <p className="font-bold">Answer Key</p>
          <p className="mt-2 text-sm leading-7">{questions.map((q, i) => `${i + 1}. ${q.answer}`).join(" / ")}</p>
        </div>
      </div>
    </section>
  );
}
