"use client";

import { useEffect, useState } from "react";
import LevelTabs from "@/components/LevelTabs";
import { localStorageKeys } from "@/lib/localStorageKeys";
import { focusLabel, generateStudyPlan } from "@/lib/studyPlanGenerator";
import type { ExamLevel } from "@/types/levels";
import type { StudyPlan, StudyPlanDuration, StudyWeakness } from "@/types/studyPlan";

const durations: Array<{ label: string; value: StudyPlanDuration }> = [
  { label: "2 weeks", value: 14 },
  { label: "4 weeks", value: 28 },
  { label: "8 weeks", value: 56 },
];
const weaknesses: StudyWeakness[] = ["vocabulary", "grammar", "reading", "writing"];

export default function StudyPlanBuilder() {
  const [level, setLevel] = useState<ExamLevel>("grade4");
  const [duration, setDuration] = useState<StudyPlanDuration>(28);
  const [weakness, setWeakness] = useState<StudyWeakness>("vocabulary");
  const [plan, setPlan] = useState<StudyPlan | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(localStorageKeys.studyPlan);
    if (raw) setPlan(JSON.parse(raw));
  }, []);

  function createPlan() {
    const next = generateStudyPlan(level, duration, weakness);
    localStorage.setItem(localStorageKeys.studyPlan, JSON.stringify(next));
    setPlan(next);
  }

  function toggleTask(dayId: string) {
    if (!plan) return;
    const next = { ...plan, days: plan.days.map((day) => day.id === dayId ? { ...day, completed: !day.completed } : day) };
    localStorage.setItem(localStorageKeys.studyPlan, JSON.stringify(next));
    setPlan(next);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold text-sky-700">Study Plan</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">Study Plan Generator</h1>
        <p className="mt-2 text-slate-600">Generate daily tasks for vocabulary, grammar, practice, review, and weekly mock exams.</p>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-5">
          <div><p className="mb-2 text-sm font-bold text-slate-600">Level</p><LevelTabs level={level} onChange={setLevel} /></div>
          <div><p className="mb-2 text-sm font-bold text-slate-600">Duration</p><div className="flex gap-2">{durations.map((item) => <button key={item.value} onClick={() => setDuration(item.value)} className={pill(duration === item.value)}>{item.label}</button>)}</div></div>
          <div><p className="mb-2 text-sm font-bold text-slate-600">Weakness</p><div className="flex flex-wrap gap-2">{weaknesses.map((item) => <button key={item} onClick={() => setWeakness(item)} className={pill(weakness === item)}>{focusLabel(item)}</button>)}</div></div>
          <button onClick={createPlan} className="rounded-md bg-sky-600 px-5 py-3 text-sm font-bold text-white">Create Plan</button>
        </div>
      </section>
      {plan && (
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="text-xl font-black text-slate-950">{plan.durationDays} Day Plan</h2><p className="mt-1 text-sm text-slate-600">Focus: {focusLabel(plan.weakness)}</p></div>
            <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800">Done {plan.days.filter((day) => day.completed).length} / {plan.days.length}</p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {plan.days.map((day) => (
              <article key={day.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3"><h3 className="font-bold text-slate-950">Day {day.day} - {day.date}</h3><button onClick={() => toggleTask(day.id)} className={pill(Boolean(day.completed))}>{day.completed ? "Done" : "Mark Done"}</button></div>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700"><li>{day.vocabularyTask}</li><li>{day.grammarTask}</li><li>{day.practiceTask}</li><li>{day.reviewTask}</li>{day.mockExamTask && <li className="font-bold text-sky-700">{day.mockExamTask}</li>}</ul>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function pill(active: boolean) {
  return `rounded-md border px-4 py-2 text-sm font-bold ${active ? "border-sky-500 bg-sky-50 text-sky-900" : "border-slate-200 bg-white text-slate-600 hover:border-sky-300"}`;
}
