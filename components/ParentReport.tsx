"use client";

import { useEffect, useState } from "react";
import { levelLabel } from "@/lib/questions";
import { localStorageKeys } from "@/lib/localStorageKeys";
import type { ExamLevel, Mistake } from "@/lib/types";

export default function ParentReport() {
  const [mistakeCount, setMistakeCount] = useState(0);
  const [level, setLevel] = useState<ExamLevel>("grade4");

  useEffect(() => {
    const raw = localStorage.getItem(localStorageKeys.mistakes);
    const mistakes: Mistake[] = raw ? JSON.parse(raw) : [];
    setMistakeCount(mistakes.length);
    setLevel((localStorage.getItem(localStorageKeys.level) as ExamLevel) ?? "grade4");
  }, []);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-950">瀹堕暱鎶ュ憡</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="rounded-md bg-sky-50 p-4">
          <p className="text-sm text-slate-600">褰撳墠鐩爣</p>
          <p className="mt-1 text-xl font-bold text-sky-900">{levelLabel(level)}</p>
        </div>
        <div className="rounded-md bg-rose-50 p-4">
          <p className="text-sm text-slate-600">閿欓鏁伴噺</p>
          <p className="mt-1 text-xl font-bold text-rose-900">{mistakeCount}</p>
        </div>
        <div className="rounded-md bg-emerald-50 p-4">
          <p className="text-sm text-slate-600">浠婃棩寤鸿</p>
          <p className="mt-1 text-base font-bold text-emerald-900">15 鍒嗛挓</p>
        </div>
      </div>
    </section>
  );
}

