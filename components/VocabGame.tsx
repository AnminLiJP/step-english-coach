"use client";

import { useEffect, useMemo, useState } from "react";
import LevelTabs from "@/components/LevelTabs";
import { getLevelData } from "@/lib/loadData";
import { localStorageKeys } from "@/lib/localStorageKeys";
import { formatPhonetic, getSentenceBlank, getVocabChoices, nextIndex } from "@/lib/vocabUtils";
import type { ExamLevel } from "@/types/levels";

type GameMode = "match" | "speed" | "fill";

export default function VocabGame() {
  const [level, setLevel] = useState<ExamLevel>("grade4");
  const [mode, setMode] = useState<GameMode>("match");
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [feedback, setFeedback] = useState("");
  const data = getLevelData(level);
  const entry = data.vocabulary[index % data.vocabulary.length];
  const choices = useMemo(() => mode === "match" ? getVocabChoices(data.vocabulary, entry, "chineseMeaning", 4, index + 3) : getVocabChoices(data.vocabulary, entry, "word", 4, index + 3), [mode, data.vocabulary, entry, index]);

  useEffect(() => {
    if (mode !== "speed" || timeLeft <= 0) return;
    const timer = window.setInterval(() => setTimeLeft((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [mode, timeLeft]);

  function choose(choice: string) {
    const correct = mode === "match" ? choice === entry.chineseMeaning : choice === entry.word;
    setAttempts((value) => value + 1);
    if (correct) {
      setScore((value) => value + (mode === "speed" ? 20 : 10));
      setFeedback("Nice. Correct.");
      setIndex((value) => nextIndex(value, data.vocabulary.length));
    } else {
      setFeedback(`Answer: ${mode === "match" ? entry.chineseMeaning : entry.word}. Example: ${entry.exampleSentence}`);
    }
    saveResult(level, mode, score + (correct ? 10 : 0), attempts + 1);
  }

  function resetSpeed() {
    setMode("speed");
    setScore(0);
    setAttempts(0);
    setTimeLeft(60);
    setFeedback("");
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold text-pink-700">Game</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">Vocabulary Game</h1>
        <div className="mt-5"><LevelTabs level={level} onChange={setLevel} /></div>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setMode("match")} className={tab(mode === "match")}>Meaning Match</button>
          <button onClick={resetSpeed} className={tab(mode === "speed")}>Speed Review</button>
          <button onClick={() => setMode("fill")} className={tab(mode === "fill")}>Fill the Sentence</button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Score label="Score" value={score} />
          <Score label="Accuracy" value={attempts ? `${Math.round((score / 10 / attempts) * 100)}%` : "0%"} />
          <Score label="Time" value={mode === "speed" ? `${timeLeft}s` : "Practice"} />
        </div>
        <div className="mt-8 rounded-lg bg-gradient-to-br from-sky-50 to-emerald-50 p-8">
          <p className="text-sm font-bold text-slate-500">{mode === "fill" ? "Fill the blank" : "Choose the answer"}</p>
          <h2 className="mt-2 text-4xl font-black text-slate-950">{mode === "fill" ? getSentenceBlank(entry) : entry.word}</h2>
          <p className="mt-2 text-sm font-bold text-slate-600">{formatPhonetic(entry)}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {choices.map((choice) => (
              <button key={choice} disabled={mode === "speed" && timeLeft <= 0} onClick={() => choose(choice)} className="rounded-lg border border-white bg-white px-4 py-4 text-left font-bold shadow-sm hover:border-sky-300">
                {choice}
              </button>
            ))}
          </div>
        </div>
        {feedback && <p className="mt-4 rounded-md bg-amber-50 p-4 text-sm font-bold text-amber-900">{feedback}</p>}
      </section>
    </div>
  );
}

function tab(active: boolean) {
  return `rounded-md px-4 py-2 text-sm font-bold ${active ? "bg-pink-600 text-white" : "bg-slate-100 text-slate-700"}`;
}

function Score({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-lg bg-slate-50 p-5"><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-black text-slate-950">{value}</p></div>;
}

function saveResult(level: ExamLevel, mode: GameMode, score: number, attempts: number) {
  const current = JSON.parse(localStorage.getItem(localStorageKeys.vocabularyGameResults) ?? "[]");
  localStorage.setItem(localStorageKeys.vocabularyGameResults, JSON.stringify([{ level, mode, score, attempts, date: new Date().toISOString() }, ...current].slice(0, 30)));
}
