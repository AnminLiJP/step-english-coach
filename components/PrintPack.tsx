"use client";

import { useState } from "react";
import LevelTabs from "@/components/LevelTabs";
import { getLevelData, levelLabel } from "@/lib/loadData";
import type { ExamLevel } from "@/types/levels";

export default function PrintPack() {
  const [level, setLevel] = useState<ExamLevel>("grade4");
  const [startDay, setStartDay] = useState(1);
  const data = getLevelData(level);
  const days = Array.from({ length: 7 }, (_, i) => startDay + i);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm print:hidden">
        <p className="text-sm font-bold text-sky-700">Print Pack</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">Weekly Print Pack</h1>
        <div className="mt-5">
          <LevelTabs level={level} onChange={setLevel} />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {[1, 8, 15, 22, 29, 36, 43, 50].map((day) => (
            <button
              key={day}
              onClick={() => setStartDay(day)}
              className={`rounded-md px-4 py-2 text-sm font-bold ${
                startDay === day ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              Day {day}-{day + 6}
            </button>
          ))}
          <button onClick={() => window.print()} className="rounded-md bg-sky-600 px-5 py-2 text-sm font-bold text-white">
            Print
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm print:border-0 print:p-0 print:shadow-none">
        <h1 className="text-2xl font-black">{levelLabel(level)} Weekly Practice Pack</h1>
        <p className="mt-2">Name: ____________________ Week: ____________________</p>
        <div className="mt-6 space-y-8">
          {days.map((day) => {
            const vocabStart = ((day - 1) * 5) % data.vocabulary.length;
            const questionStart = ((day - 1) * 4) % data.questions.length;
            const vocab = data.vocabulary.slice(vocabStart, vocabStart + 5);
            const grammar = data.grammarLessons[(day - 1) % data.grammarLessons.length];
            const questions = data.questions.slice(questionStart, questionStart + 4);

            return (
              <article key={day} className="break-inside-avoid border-t border-slate-300 pt-5">
                <h2 className="text-lg font-bold">Day {day}</h2>
                <p className="mt-3 font-bold">Daily Words</p>
                <ol className="mt-1 list-decimal pl-5 text-sm">
                  {vocab.map((word) => (
                    <li key={word.id}>
                      {word.word} / {word.chineseMeaning} / {word.japaneseMeaning}
                    </li>
                  ))}
                </ol>
                <p className="mt-3 font-bold">Grammar</p>
                <p className="text-sm">
                  {grammar.title}: {grammar.structure}
                </p>
                <p className="mt-3 font-bold">Practice</p>
                <ol className="mt-1 list-decimal space-y-2 pl-5 text-sm">
                  {questions.map((q) => (
                    <li key={q.id}>
                      {q.question}
                      <br />
                      Answer: ________
                    </li>
                  ))}
                </ol>
                <p className="mt-3 font-bold">Mistake Review</p>
                <p className="text-sm">1. ________________________________ 2. ________________________________</p>
              </article>
            );
          })}
        </div>
        <div className="mt-8 border-t border-slate-300 pt-5">
          <h2 className="text-lg font-bold">Weekend Quiz</h2>
          <p className="mt-2 text-sm">Choose 10 words from this pack and write one sentence with 3 of them.</p>
          <h2 className="mt-5 text-lg font-bold">Answer Key</h2>
          <p className="mt-2 text-sm leading-7">
            {data.questions
              .slice(0, 20)
              .map((q, i) => `${i + 1}. ${q.answer}`)
              .join(" / ")}
          </p>
          <h2 className="mt-5 text-lg font-bold">Parent Check Sheet</h2>
          <p className="mt-2 text-sm">Completed days: 1 2 3 4 5 6 7 / Parent signature: ____________________</p>
        </div>
      </section>
    </div>
  );
}
