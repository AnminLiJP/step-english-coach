"use client";

import { useMemo, useState } from "react";
import LevelTabs from "@/components/LevelTabs";
import { getLevelData } from "@/lib/loadData";
import { localStorageKeys } from "@/lib/localStorageKeys";
import { gradeSentence } from "@/lib/sentenceGrader";
import { formatPhonetic, getSentenceBlank, getVocabChoices } from "@/lib/vocabUtils";
import type { ExamLevel, SentenceGrade, VocabularyEntry } from "@/types/levels";

type TestItem = {
  id: string;
  kind: "en-to-zh" | "zh-to-en" | "spelling" | "fill" | "sentence";
  entry: VocabularyEntry;
};

export default function VocabTest() {
  const [level, setLevel] = useState<ExamLevel>("grade4");
  const [count, setCount] = useState(10);
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [sentenceGrades, setSentenceGrades] = useState<Record<string, SentenceGrade>>({});
  const data = getLevelData(level);
  const items = useMemo(() => buildItems(data.vocabulary, count), [data.vocabulary, count, started]);

  function submit() {
    const grades: Record<string, SentenceGrade> = {};
    for (const item of items) {
      if (item.kind === "sentence") grades[item.id] = gradeSentence(item.entry, answers[item.id] ?? "");
    }
    setSentenceGrades(grades);
    setSubmitted(true);
    const result = getResult(items, answers, grades);
    const current = JSON.parse(localStorage.getItem(localStorageKeys.vocabularyTestResults) ?? "[]");
    localStorage.setItem(localStorageKeys.vocabularyTestResults, JSON.stringify([{ level, count, ...result, date: new Date().toISOString() }, ...current].slice(0, 20)));
  }

  const result = submitted ? getResult(items, answers, sentenceGrades) : null;

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold text-violet-700">Vocabulary Test</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">Vocabulary Test + Sentence Check</h1>
        <div className="mt-5"><LevelTabs level={level} onChange={setLevel} /></div>
        <div className="mt-5 flex flex-wrap gap-2">
          {[10, 20, 30].map((n) => <button key={n} onClick={() => setCount(n)} className={`rounded-md px-4 py-2 text-sm font-bold ${count === n ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-700"}`}>{n} questions</button>)}
          <button onClick={() => { setStarted(true); setSubmitted(false); setAnswers({}); }} className="rounded-md bg-sky-600 px-4 py-2 text-sm font-bold text-white">Start</button>
        </div>
      </section>

      {started && (
        <section className="space-y-4">
          {items.map((item, index) => (
            <article key={item.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-slate-500">Question {index + 1} / {items.length} - {item.kind}</p>
              <Prompt item={item} entries={data.vocabulary} value={answers[item.id] ?? ""} onChange={(value) => setAnswers((current) => ({ ...current, [item.id]: value }))} />
              {submitted && <AnswerReview item={item} answer={answers[item.id] ?? ""} grade={sentenceGrades[item.id]} />}
            </article>
          ))}
          <button onClick={submit} className="rounded-md bg-violet-600 px-6 py-3 text-sm font-bold text-white">Submit Test</button>
        </section>
      )}

      {result && (
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Result</h2>
          <p className="mt-3 text-3xl font-black text-slate-950">{result.score} / {result.maxScore}</p>
          <p className="mt-2 text-slate-600">Accuracy: {Math.round((result.score / result.maxScore) * 100)}%</p>
          <p className="mt-4 font-bold text-rose-700">Review words: {result.wrongWords.join(", ") || "None"}</p>
        </section>
      )}
    </div>
  );
}

function buildItems(entries: VocabularyEntry[], count: number): TestItem[] {
  const kinds: TestItem["kind"][] = ["en-to-zh", "zh-to-en", "spelling", "fill", "sentence"];
  return entries.slice(0, count).map((entry, index) => ({ id: `${entry.id}-${kinds[index % kinds.length]}`, entry, kind: kinds[index % kinds.length] }));
}

function Prompt({ item, entries, value, onChange }: { item: TestItem; entries: VocabularyEntry[]; value: string; onChange: (value: string) => void }) {
  if (item.kind === "sentence") {
    return <div className="mt-3"><p>Write one English sentence with <b>{item.entry.word}</b> <span className="text-sm font-semibold text-slate-500">{formatPhonetic(item.entry)}</span>.</p><textarea value={value} onChange={(e) => onChange(e.target.value)} className="mt-3 min-h-28 w-full rounded-md border border-slate-300 p-3" /></div>;
  }
  if (item.kind === "spelling") {
    return <div className="mt-3"><p>{item.entry.chineseMeaning} / {item.entry.japaneseMeaning}</p><p className="mt-1 text-sm font-semibold text-slate-500">{formatPhonetic(item.entry)}</p><input value={value} onChange={(e) => onChange(e.target.value)} className="mt-3 w-full rounded-md border border-slate-300 p-3" placeholder="Type the English word" /></div>;
  }
  const seed = entries.findIndex((entry) => entry.id === item.entry.id) + item.id.length;
  const choices = item.kind === "en-to-zh" ? getVocabChoices(entries, item.entry, "chineseMeaning", 4, seed) : getVocabChoices(entries, item.entry, "word", 4, seed);
  const title = item.kind === "fill" ? getSentenceBlank(item.entry) : item.kind === "en-to-zh" ? item.entry.word : item.entry.chineseMeaning;
  return <div className="mt-3"><p className="font-semibold">{title}</p><p className="mt-1 text-sm font-semibold text-slate-500">{formatPhonetic(item.entry)}</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{choices.map((choice) => <button key={choice} onClick={() => onChange(choice)} className={`rounded-md border px-3 py-2 text-left ${value === choice ? "border-violet-500 bg-violet-50" : "border-slate-200"}`}>{choice}</button>)}</div></div>;
}

function AnswerReview({ item, answer, grade }: { item: TestItem; answer: string; grade?: SentenceGrade }) {
  if (item.kind === "sentence" && grade) return <div className="mt-4 rounded-md bg-slate-50 p-4"><p className="font-bold">Sentence score: {grade.score}/{grade.maxScore}</p>{grade.feedback.map((f) => <p key={f} className="mt-1 text-sm">{f}</p>)}<p className="mt-2 text-sm text-emerald-700">Sample: {grade.sampleSentence}</p></div>;
  const correct = item.kind === "en-to-zh" ? item.entry.chineseMeaning : item.entry.word;
  const phoneticHint = `${item.entry.word} ${formatPhonetic(item.entry)}`.trim();
  return <p className={`mt-3 text-sm font-bold ${answer === correct ? "text-emerald-700" : "text-rose-700"}`}>{answer === correct ? `Correct: ${phoneticHint}` : `Answer: ${correct} (${phoneticHint})`}</p>;
}

function getResult(items: TestItem[], answers: Record<string, string>, grades: Record<string, SentenceGrade>) {
  let score = 0;
  let maxScore = 0;
  const wrongWords: string[] = [];
  for (const item of items) {
    if (item.kind === "sentence") {
      maxScore += 8;
      score += grades[item.id]?.score ?? 0;
      if ((grades[item.id]?.score ?? 0) < 6) wrongWords.push(item.entry.word);
    } else {
      maxScore += 1;
      const correct = item.kind === "en-to-zh" ? item.entry.chineseMeaning : item.entry.word;
      if (answers[item.id] === correct) score += 1;
      else wrongWords.push(item.entry.word);
    }
  }
  return { score, maxScore, wrongWords };
}
