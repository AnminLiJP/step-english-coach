"use client";

import { useMemo, useState } from "react";
import LevelTabs from "@/components/LevelTabs";
import { getLevelData, normalizeLevel } from "@/lib/loadData";
import { localStorageKeys } from "@/lib/localStorageKeys";
import { formatPhonetic, getSentenceBlank, getVocabChoices, nextIndex, scoreVocabAnswer, type VocabMode } from "@/lib/vocabUtils";
import type { ExamLevel, VocabularyEntry } from "@/types/levels";

const modes: Array<{ id: VocabMode; label: string }> = [
  { id: "flashcard", label: "Flashcard" },
  { id: "en-to-zh", label: "English to Chinese" },
  { id: "zh-to-en", label: "Chinese to English" },
  { id: "spelling", label: "Spelling" },
  { id: "sentence-fill", label: "Sentence Fill" },
];

export default function VocabularyTrainer() {
  const [level, setLevel] = useState<ExamLevel>("grade4");
  const [mode, setMode] = useState<VocabMode>("flashcard");
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const data = getLevelData(level);
  const entry = data.vocabulary[index % data.vocabulary.length];
  const choices = useMemo(() => getChoices(mode, data.vocabulary, entry, index), [mode, data.vocabulary, entry, index]);

  function changeLevel(next: ExamLevel) {
    setLevel(normalizeLevel(next));
    setIndex(0);
    setFeedback("");
  }

  function answer(value: string) {
    const correct = scoreVocabAnswer(mode, entry, value);
    if (correct) {
      const nextScore = score + 10;
      const nextStreak = streak + 1;
      setScore(nextScore);
      setStreak(nextStreak);
      localStorage.setItem(localStorageKeys.vocabularyScore, String(nextScore));
      localStorage.setItem(localStorageKeys.vocabularyStreak, String(nextStreak));
      saveWord(localStorageKeys.learnedWords, entry.id);
      setFeedback("Correct. This word has been added to today's learned list.");
    } else {
      setStreak(0);
      localStorage.setItem(localStorageKeys.vocabularyStreak, "0");
      saveWord(localStorageKeys.wrongWords, entry.id);
      setFeedback(`Review: ${entry.word} = ${entry.chineseMeaning} / ${entry.japaneseMeaning}`);
    }
  }

  function next() {
    setIndex((current) => nextIndex(current, data.vocabulary.length));
    setTyped("");
    setFeedback("");
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold text-sky-700">Vocabulary</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">Vocabulary Training</h1>
        <div className="mt-5"><LevelTabs level={level} onChange={changeLevel} /></div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {modes.map((item) => (
              <button key={item.id} onClick={() => setMode(item.id)} className={`rounded-md px-3 py-2 text-sm font-bold ${mode === item.id ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-700"}`}>
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-lg bg-slate-50 p-6">
            <p className="text-sm font-bold text-slate-500">{[entry.partOfSpeech, formatPhonetic(entry)].filter(Boolean).join(" / ")}</p>
            <h2 className="mt-2 text-5xl font-black text-slate-950">{entry.word}</h2>
            <p className="mt-4 text-lg text-slate-700">{entry.chineseMeaning} / {entry.japaneseMeaning}</p>
            <p className="mt-5 text-lg leading-8 text-slate-900">{mode === "sentence-fill" ? getSentenceBlank(entry) : entry.exampleSentence}</p>
            <p className="mt-2 text-sm text-slate-600">{entry.exampleTranslationChinese}</p>
            <p className="mt-1 text-sm text-slate-600">{entry.exampleTranslationJapanese}</p>
          </div>

          {mode !== "flashcard" && mode !== "spelling" && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {choices.map((choice) => (
                <button key={choice} onClick={() => answer(choice)} className="rounded-md border border-slate-200 px-4 py-3 text-left font-semibold hover:border-sky-300 hover:bg-sky-50">
                  {choice}
                </button>
              ))}
            </div>
          )}

          {mode === "spelling" && (
            <div className="mt-5 flex gap-3">
              <input value={typed} onChange={(event) => setTyped(event.target.value)} className="flex-1 rounded-md border border-slate-300 px-4 py-3" placeholder="Type the word" />
              <button onClick={() => answer(typed)} className="rounded-md bg-sky-600 px-5 py-3 font-bold text-white">Submit</button>
            </div>
          )}

          {feedback && <p className="mt-4 rounded-md bg-emerald-50 p-4 text-sm font-bold text-emerald-900">{feedback}</p>}
          <button onClick={next} className="mt-5 rounded-md border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">Next Word</button>
        </div>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-bold text-slate-950">Today</h3>
          <div className="mt-4 space-y-3">
            <Stat label="Score" value={score} />
            <Stat label="Streak" value={streak} />
            <Stat label="Words" value={index + 1} />
          </div>
        </aside>
      </section>
    </div>
  );
}

function getChoices(mode: VocabMode, entries: VocabularyEntry[], entry: VocabularyEntry, index: number) {
  if (mode === "en-to-zh") return getVocabChoices(entries, entry, "chineseMeaning", 4, index + 1);
  return getVocabChoices(entries, entry, "word", 4, index + 1);
}

function saveWord(key: string, wordId: string) {
  const current = JSON.parse(localStorage.getItem(key) ?? "[]") as string[];
  localStorage.setItem(key, JSON.stringify(Array.from(new Set([wordId, ...current])).slice(0, 300)));
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="rounded-md bg-slate-50 p-4"><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-black text-slate-950">{value}</p></div>;
}
