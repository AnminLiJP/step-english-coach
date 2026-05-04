"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { levelLabel } from "@/lib/questions";
import { localStorageKeys } from "@/lib/localStorageKeys";
import type { ExamLevel, Mistake, Question } from "@/lib/types";

type Props = {
  questions: Question[];
  level: ExamLevel;
};

const mistakeKey = localStorageKeys.mistakes;

export default function QuestionCard({ questions, level }: Props) {
  const visibleQuestions = useMemo(() => questions.slice(0, 10), [questions]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const question = visibleQuestions[index];
  const isCorrect = selected === question.answer;

  function saveMistake() {
    const raw = localStorage.getItem(mistakeKey);
    const current: Mistake[] = raw ? JSON.parse(raw) : [];
    const next = [
      { ...question, selected, savedAt: new Date().toISOString() },
      ...current.filter((item) => item.id !== question.id),
    ].slice(0, 50);
    localStorage.setItem(mistakeKey, JSON.stringify(next));
  }

  function submit() {
    if (!selected) return;
    setSubmitted(true);
    if (isCorrect) {
      setCorrectCount((count) => count + 1);
    } else {
      saveMistake();
    }
  }

  function nextQuestion() {
    setIndex((current) => (current + 1) % visibleQuestions.length);
    setSelected("");
    setSubmitted(false);
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-sky-700">{levelLabel(level)} 浠婃棩缁冧範</p>
          <h2 className="mt-1 text-xl font-bold text-slate-950">Question {index + 1} / {visibleQuestions.length}</h2>
        </div>
        <div className="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">Correct {correctCount}</div>
      </div>

      <p className="mt-6 text-lg leading-8 text-slate-900">{question.question}</p>

      <div className="mt-5 grid gap-3">
        {question.choices.map((choice) => (
          <button
            key={choice}
            onClick={() => !submitted && setSelected(choice)}
            className={`rounded-md border px-4 py-3 text-left text-sm font-medium transition ${
              selected === choice ? "border-sky-500 bg-sky-50 text-sky-950" : "border-slate-200 bg-white text-slate-700 hover:border-sky-300"
            }`}
          >
            {choice}
          </button>
        ))}
      </div>

      {submitted && (
        <div className={`mt-5 rounded-lg border p-4 ${isCorrect ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
          <div className={`flex items-center gap-2 font-bold ${isCorrect ? "text-emerald-700" : "text-rose-700"}`}>
            {isCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            {isCorrect ? "姝ｇ‘" : `閿欒锛屾纭瓟妗堟槸 ${question.answer}`}
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-700">{question.explanation}</p>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <button
          onClick={submit}
          disabled={!selected || submitted}
          className="rounded-md bg-sky-600 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          鎻愪氦绛旀
        </button>
        <button onClick={nextQuestion} className="rounded-md border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
          涓嬩竴棰?        </button>
      </div>
    </section>
  );
}

