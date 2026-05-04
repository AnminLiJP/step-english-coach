"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DailyTaskCard from "@/components/DailyTaskCard";
import ParentReport from "@/components/ParentReport";
import { localStorageKeys } from "@/lib/localStorageKeys";
import { getDueReviewItems } from "@/lib/reviewScheduler";
import { getTodayTask } from "@/lib/studyPlanGenerator";
import type { ReviewQueueItem, StudyPlan } from "@/types/studyPlan";

export default function DashboardV3() {
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [reviewItems, setReviewItems] = useState<ReviewQueueItem[]>([]);
  const [examResult, setExamResult] = useState<{ correct: number; total: number; examId?: string } | null>(null);

  useEffect(() => {
    const rawPlan = localStorage.getItem(localStorageKeys.studyPlan);
    const rawReview = localStorage.getItem(localStorageKeys.reviewQueue);
    const rawExam = localStorage.getItem(localStorageKeys.examResults);
    const parsedPlan = rawPlan ? JSON.parse(rawPlan) as StudyPlan : null;
    const queue = rawReview ? JSON.parse(rawReview) as ReviewQueueItem[] : [];
    const exams = rawExam ? JSON.parse(rawExam) as Array<{ correct: number; total: number; examId?: string }> : [];
    setPlan(parsedPlan);
    setReviewItems(getDueReviewItems(queue));
    setExamResult(exams[0] ?? null);
  }, []);

  const todayTask = getTodayTask(plan);
  const weeklyAccuracy = examResult ? Math.round((examResult.correct / examResult.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold text-sky-700">Today</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">Learning Dashboard</h1>
      </div>
      <section className="grid gap-4 lg:grid-cols-4">
        <Metric title="Due Reviews" value={reviewItems.length} />
        <Metric title="Weekly Accuracy" value={`${weeklyAccuracy}%`} />
        <Metric title="Last Mock" value={examResult ? `${examResult.correct}/${examResult.total}` : "None"} />
        <Metric title="Plan Progress" value={plan ? `${plan.days.filter((d) => d.completed).length}/${plan.days.length}` : "No plan"} />
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-slate-950">Today's Study Plan</h2>
          <Link href="/study-plan" className="rounded-md border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700">Manage Plan</Link>
        </div>
        {todayTask ? (
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
            <li>{todayTask.vocabularyTask}</li>
            <li>{todayTask.grammarTask}</li>
            <li>{todayTask.practiceTask}</li>
            <li>{todayTask.reviewTask}</li>
            {todayTask.mockExamTask && <li className="font-bold text-sky-700">{todayTask.mockExamTask}</li>}
          </ul>
        ) : <p className="mt-4 text-slate-600">No study plan yet. Create a four-week plan first.</p>}
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-slate-950">Due Review Items</h2>
          <Link href="/review" className="rounded-md bg-rose-600 px-4 py-2 text-sm font-bold text-white">Open Review</Link>
        </div>
        <div className="mt-4 space-y-2">
          {reviewItems.slice(0, 5).map((item) => <p key={item.id} className="rounded-md bg-rose-50 p-3 text-sm text-rose-900">{item.type}: {item.title}</p>)}
          {reviewItems.length === 0 && <p className="text-slate-600">No due review items today.</p>}
        </div>
      </section>
      <DailyTaskCard />
      <ParentReport />
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string | number }) {
  return <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{title}</p><p className="mt-2 text-2xl font-black text-slate-950">{value}</p></div>;
}
