"use client";

import { useEffect, useState } from "react";
import LevelSelector from "@/components/LevelSelector";
import QuestionCard from "@/components/QuestionCard";
import { getQuestions, levelLabel } from "@/lib/questions";
import { localStorageKeys } from "@/lib/localStorageKeys";
import type { ExamLevel } from "@/lib/types";

export default function PracticeClient() {
  const [level, setLevel] = useState<ExamLevel>("grade4");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLevel = params.get("level") as ExamLevel | null;
    const savedLevel = localStorage.getItem(localStorageKeys.level) as ExamLevel | null;
    setLevel(urlLevel ?? savedLevel ?? "grade4");
  }, []);

  const questions = getQuestions(level);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-slate-500">缁冧範绾у埆</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950">{levelLabel(level)} Practice</h1>
        <div className="mt-4">
          <LevelSelector compact />
        </div>
      </div>
      <QuestionCard questions={questions} level={level} />
    </div>
  );
}

