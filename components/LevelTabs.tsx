"use client";

import { levelOptions } from "@/lib/loadData";
import type { ExamLevel } from "@/types/levels";

export default function LevelTabs({ level, onChange }: { level: ExamLevel; onChange: (level: ExamLevel) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {levelOptions.map((option) => (
        <button
          key={option.level}
          onClick={() => onChange(option.level)}
          className={`rounded-md border px-4 py-2 text-sm font-bold transition ${
            level === option.level ? "border-sky-500 bg-sky-50 text-sky-900" : "border-slate-200 bg-white text-slate-600 hover:border-sky-300"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

