"use client";

import { useState } from "react";
import LevelTabs from "@/components/LevelTabs";
import { getLevelData } from "@/lib/loadData";
import { localStorageKeys } from "@/lib/localStorageKeys";
import { scoreGrammarQuiz } from "@/lib/grammarUtils";
import type { ExamLevel } from "@/types/levels";

export default function GrammarStudy() {
  const [level, setLevel] = useState<ExamLevel>("grade4");
  const [lessonIndex, setLessonIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const lessons = getLevelData(level).grammarLessons;
  const lesson = lessons[lessonIndex] ?? lessons[0];
  const score = submitted ? scoreGrammarQuiz(lesson, answers) : 0;

  function submit() {
    setSubmitted(true);
    const wrong = lesson.miniQuiz.filter((quiz, index) => answers[index] !== quiz.answer).map((quiz) => ({ lessonId: lesson.id, title: lesson.title, question: quiz.question, answer: quiz.answer }));
    if (wrong.length) {
      const current = JSON.parse(localStorage.getItem(localStorageKeys.grammarMistakes) ?? "[]");
      localStorage.setItem(localStorageKeys.grammarMistakes, JSON.stringify([...wrong, ...current].slice(0, 100)));
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold text-emerald-700">Grammar</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">Grammar Lessons</h1>
        <div className="mt-5"><LevelTabs level={level} onChange={(next) => { setLevel(next); setLessonIndex(0); setSubmitted(false); setAnswers({}); }} /></div>
      </section>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-bold text-slate-950">Lessons</h2>
          <div className="mt-4 space-y-2">
            {lessons.map((item, index) => (
              <button key={item.id} onClick={() => { setLessonIndex(index); setSubmitted(false); setAnswers({}); }} className={`w-full rounded-md px-3 py-2 text-left text-sm font-semibold ${index === lessonIndex ? "bg-emerald-50 text-emerald-900" : "text-slate-600 hover:bg-slate-50"}`}>{index + 1}. {item.title}</button>
            ))}
          </div>
        </aside>
        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">{lesson.title}</h2>
          <p className="mt-4 leading-7 text-slate-700">{lesson.explanationChinese}</p>
          <p className="mt-2 leading-7 text-slate-600">{lesson.explanationJapanese}</p>
          <div className="mt-5 rounded-md bg-slate-50 p-4"><p className="font-bold">Structure</p><p className="mt-1 text-slate-700">{lesson.structure}</p></div>
          <h3 className="mt-6 font-bold text-slate-950">Examples</h3>
          <div className="mt-3 space-y-3">{lesson.examples.map((example) => <div key={example.english} className="rounded-md border border-slate-200 p-4"><p className="font-semibold">{example.english}</p><p className="mt-1 text-sm text-slate-600">{example.chinese}</p><p className="mt-1 text-sm text-slate-600">{example.japanese}</p></div>)}</div>
          <h3 className="mt-6 font-bold text-slate-950">Common Mistakes</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">{lesson.commonMistakes.map((m) => <li key={m}>{m}</li>)}</ul>
          <h3 className="mt-6 font-bold text-slate-950">Mini Quiz</h3>
          <div className="mt-3 space-y-4">
            {lesson.miniQuiz.map((quiz, index) => (
              <div key={quiz.question} className="rounded-md border border-slate-200 p-4">
                <p className="font-semibold">{index + 1}. {quiz.question}</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">{quiz.choices.map((choice) => <button key={choice} onClick={() => setAnswers((current) => ({ ...current, [index]: choice }))} className={`rounded-md border px-3 py-2 text-left ${answers[index] === choice ? "border-emerald-500 bg-emerald-50" : "border-slate-200"}`}>{choice}</button>)}</div>
                {submitted && <p className="mt-3 text-sm text-slate-700">Answer: <b>{quiz.answer}</b>. {quiz.explanationChinese}</p>}
              </div>
            ))}
          </div>
          <button onClick={submit} className="mt-5 rounded-md bg-emerald-600 px-5 py-3 text-sm font-bold text-white">Submit Quiz</button>
          {submitted && <p className="mt-4 rounded-md bg-emerald-50 p-4 font-bold text-emerald-900">Score: {score} / {lesson.miniQuiz.length}</p>}
        </article>
      </div>
    </div>
  );
}
