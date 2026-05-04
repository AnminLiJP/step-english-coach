"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import { localStorageKeys } from "@/lib/localStorageKeys";
import type { ExamLevel } from "@/lib/types";

type Props = { compact?: boolean };

const levels = [
  { level: "grade4" as const, title: "Grade 4 Level", text: "Daily vocabulary, short sentences, basic grammar, and simple reading." },
  { level: "grade3" as const, title: "Grade 3 Level", text: "Present perfect, passive voice, relative clauses, reading, and writing." },
  { level: "pre2" as const, title: "Pre-2 Level", text: "Longer reading, social topics, advanced grammar, and opinion writing." },
];

export default function LevelSelector({ compact = false }: Props) {
  const router = useRouter();
  const [current, setCurrent] = useState<ExamLevel>("grade4");

  useEffect(() => {
    const urlLevel = new URLSearchParams(window.location.search).get("level") as ExamLevel | null;
    setCurrent(urlLevel ?? (localStorage.getItem(localStorageKeys.level) as ExamLevel) ?? "grade4");
  }, []);

  function selectLevel(level: ExamLevel) {
    localStorage.setItem(localStorageKeys.level, level);
    setCurrent(level);
    router.push(`/practice?level=${level}`);
  }

  return (
    <div className={compact ? "grid gap-3 sm:grid-cols-3" : "grid gap-4 md:grid-cols-3"}>
      {levels.map((item) => (
        <button
          key={item.level}
          onClick={() => selectLevel(item.level)}
          className={`rounded-lg border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md ${
            current === item.level ? "border-sky-400 ring-2 ring-sky-100" : "border-slate-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-sky-50 p-2 text-sky-700">
              <GraduationCap size={22} aria-hidden="true" />
            </span>
            <span className="text-lg font-bold text-slate-950">{item.title}</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
        </button>
      ))}
    </div>
  );
}
