"use client";

import { useMemo, useState } from "react";
import LevelTabs from "@/components/LevelTabs";
import { getLevelData } from "@/lib/loadData";
import { flattenExamQuestions, getWritingTasks, scoreExam } from "@/lib/examUtils";
import { localStorageKeys } from "@/lib/localStorageKeys";
import { findVocabEntryInText, formatPhonetic } from "@/lib/vocabUtils";
import { gradeWriting } from "@/lib/writingGrader";
import type { ExamLevel, MockExam } from "@/types/levels";

export default function ExamRunner() {
  const [level, setLevel] = useState<ExamLevel>("grade4");
  const [examIndex, setExamIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [writingAnswers, setWritingAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const data = getLevelData(level);
  const exams = data.mockExams;
  const exam = exams[examIndex] ?? exams[0];
  const questions = useMemo(() => flattenExamQuestions(exam), [exam]);
  const current = questions[questionIndex];
  const progress = Math.round(((questionIndex + 1) / questions.length) * 100);

  function submitExam() {
    setSubmitted(true);
    const result = scoreExam(exam, answers);
    const wrong = questions.filter((q) => answers[q.id] !== q.answer);
    const currentMistakes = JSON.parse(localStorage.getItem(localStorageKeys.mistakes) ?? "[]");
    localStorage.setItem(localStorageKeys.mistakes, JSON.stringify([...wrong, ...currentMistakes].slice(0, 200)));
    const currentResults = JSON.parse(localStorage.getItem(localStorageKeys.examResults) ?? "[]");
    localStorage.setItem(localStorageKeys.examResults, JSON.stringify([{ examId: exam.examId, level, correct: result.correct, total: result.total, date: new Date().toISOString() }, ...currentResults].slice(0, 30)));
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold text-sky-700">Mock Exam</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">Mock Exams</h1>
        <div className="mt-5"><LevelTabs level={level} onChange={(next) => { setLevel(next); setExamIndex(0); setQuestionIndex(0); setSubmitted(false); setAnswers({}); }} /></div>
        <div className="mt-5 flex flex-wrap gap-2">{exams.map((item, index) => <button key={item.examId} onClick={() => { setExamIndex(index); setQuestionIndex(0); setSubmitted(false); setAnswers({}); }} className={`rounded-md px-4 py-2 text-sm font-bold ${index === examIndex ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-700"}`}>Mock {index + 1}</button>)}</div>
      </section>

      {!submitted && current && (
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap justify-between gap-3">
            <div><p className="text-sm font-bold text-slate-500">{exam.title} - {current.sectionName}</p><h2 className="mt-1 text-xl font-bold text-slate-950">Question {questionIndex + 1} / {questions.length}</h2></div>
            <div className="w-48 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-sky-500" style={{ width: `${progress}%` }} /></div>
          </div>
          {current.passage && <p className="mt-5 whitespace-pre-line rounded-md bg-slate-50 p-4 leading-7 text-slate-800">{current.passage}</p>}
          <p className="mt-5 text-lg font-semibold leading-8 text-slate-950">{current.question}</p>
          <QuestionPhonetic question={current.question} show={current.sectionName === "vocabulary"} entries={data.vocabulary} />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">{current.choices.map((choice) => <button key={choice} onClick={() => setAnswers((a) => ({ ...a, [current.id]: choice }))} className={`rounded-md border px-4 py-3 text-left font-semibold ${answers[current.id] === choice ? "border-sky-500 bg-sky-50" : "border-slate-200"}`}>{choice}</button>)}</div>
          <div className="mt-6 flex gap-3">
            <button onClick={() => setQuestionIndex((i) => Math.max(0, i - 1))} className="rounded-md border border-slate-300 px-5 py-3 text-sm font-bold">Previous</button>
            <button onClick={() => setQuestionIndex((i) => Math.min(questions.length - 1, i + 1))} className="rounded-md border border-slate-300 px-5 py-3 text-sm font-bold">Next</button>
            <button onClick={submitExam} className="rounded-md bg-sky-600 px-5 py-3 text-sm font-bold text-white">Submit Exam</button>
          </div>
          {getWritingTasks(exam).length > 0 && questionIndex === questions.length - 1 && <WritingArea exam={exam} writingAnswers={writingAnswers} setWritingAnswers={setWritingAnswers} />}
        </section>
      )}

      {submitted && <ExamResult exam={exam} answers={answers} writingAnswers={writingAnswers} entries={data.vocabulary} />}
    </div>
  );
}

function QuestionPhonetic({ question, show, entries }: { question: string; show: boolean; entries: ReturnType<typeof getLevelData>["vocabulary"] }) {
  if (!show) return null;
  const target = findVocabEntryInText(question, entries);
  const phonetic = formatPhonetic(target);
  if (!phonetic) return null;
  return <p className="mt-2 text-sm font-bold text-slate-500">{target?.word} {phonetic}</p>;
}

function WritingArea({ exam, writingAnswers, setWritingAnswers }: { exam: MockExam; writingAnswers: Record<string, string>; setWritingAnswers: (value: Record<string, string>) => void }) {
  return <div className="mt-8 border-t border-slate-200 pt-6"><h3 className="text-lg font-bold">Writing Section</h3>{getWritingTasks(exam).map((task) => <div key={task.id} className="mt-4 rounded-md bg-slate-50 p-4"><p className="font-semibold">{task.prompt}</p><p className="mt-1 text-sm text-slate-600">Target: {task.targetWords}</p><textarea value={writingAnswers[task.id] ?? ""} onChange={(e) => setWritingAnswers({ ...writingAnswers, [task.id]: e.target.value })} className="mt-3 min-h-36 w-full rounded-md border border-slate-300 p-3" /></div>)}</div>;
}

function ExamResult({ exam, answers, writingAnswers, entries }: { exam: MockExam; answers: Record<string, string>; writingAnswers: Record<string, string>; entries: ReturnType<typeof getLevelData>["vocabulary"] }) {
  const result = scoreExam(exam, answers);
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black text-slate-950">Exam Result</h2>
      <p className="mt-3 text-4xl font-black text-sky-700">{result.correct} / {result.total}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{Object.entries(result.sectionTotals).map(([name, value]) => <div key={name} className="rounded-md bg-slate-50 p-4"><p className="text-sm text-slate-500">{name}</p><p className="mt-1 text-xl font-bold">{value.correct}/{value.total}</p></div>)}</div>
      <h3 className="mt-6 font-bold">Answer Review</h3>
      <div className="mt-3 space-y-3">{flattenExamQuestions(exam).map((q, index) => {
        const target = q.sectionName === "vocabulary" ? findVocabEntryInText(q.question, entries) : undefined;
        const phonetic = formatPhonetic(target);
        return <div key={q.id} className="rounded-md border border-slate-200 p-3"><p className="font-semibold">{index + 1}. {q.question}</p>{phonetic && <p className="mt-1 text-sm font-bold text-slate-500">{target?.word} {phonetic}</p>}<p className={answers[q.id] === q.answer ? "text-emerald-700" : "text-rose-700"}>Your answer: {answers[q.id] || "Blank"} / Correct: {q.answer}</p><p className="text-sm text-slate-600">{q.explanationChinese}</p></div>;
      })}</div>
      {getWritingTasks(exam).map((task) => { const grade = gradeWriting(task, writingAnswers[task.id] ?? ""); return <div key={task.id} className="mt-5 rounded-md bg-emerald-50 p-4"><p className="font-bold">{task.prompt}</p><p className="mt-2">Writing score: {grade.score}/{grade.maxScore}</p>{grade.feedback.map((f) => <p key={f} className="text-sm">{f}</p>)}<p className="mt-2 whitespace-pre-line text-sm text-slate-700">Sample: {grade.sampleAnswer}</p></div>; })}
    </section>
  );
}
