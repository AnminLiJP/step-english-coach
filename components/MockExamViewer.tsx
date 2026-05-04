"use client";

import { useMemo, useState } from "react";

type MockItem = {
  id: string;
  question: string;
  choices: string[];
  answer: string;
  explanation: string;
};

type MockPassage = {
  id: string;
  title: string;
  body: string;
  items: MockItem[];
};

type MockSection = {
  id: string;
  title: string;
  description: string;
  passage?: string;
  items?: MockItem[];
  passages?: MockPassage[];
};

type WritingTask = {
  id: string;
  type: string;
  title: string;
  prompt: string;
  email?: string;
  targetWords: string;
  sampleAnswer: string;
  answerPoints: string[];
};

type MockExam = {
  level: string;
  title: string;
  note: string;
  sections: MockSection[];
  writing?: WritingTask[];
};

function flattenItems(sections: MockSection[]) {
  const items: MockItem[] = [];
  for (const section of sections) {
    if (section.items) items.push(...section.items);
    if (section.passages) {
      for (const passage of section.passages) items.push(...passage.items);
    }
  }
  return items;
}

export default function MockExamViewer({ exam }: { exam: MockExam }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const allItems = useMemo(() => flattenItems(exam.sections), [exam.sections]);
  const score = allItems.filter((item) => answers[item.id] === item.answer).length;

  function selectAnswer(id: string, choice: string) {
    setAnswers((current) => ({ ...current, [id]: choice }));
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold text-sky-700">Mock Test</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">{exam.title}</h1>
        <p className="mt-3 max-w-3xl leading-7 text-slate-600">{exam.note}</p>
        <div className="mt-5 flex flex-wrap gap-3 print:hidden">
          <button
            onClick={() => setChecked(true)}
            className="rounded-md bg-sky-600 px-5 py-3 text-sm font-bold text-white"
          >
            Submit answers
          </button>
          <button
            onClick={() => setShowKey((value) => !value)}
            className="rounded-md border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            {showKey ? "Hide answer key" : "Show answer key"}
          </button>
          <button
            onClick={() => window.print()}
            className="rounded-md border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Print mock test
          </button>
        </div>
        {checked && (
          <div className="mt-5 rounded-md bg-emerald-50 p-4 text-sm font-bold text-emerald-900">
            Multiple-choice score: {score} / {allItems.length}
          </div>
        )}
      </section>

      {exam.sections.map((section) => (
        <section key={section.id} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">{section.title}</h2>
          <p className="mt-2 text-sm text-slate-600">{section.description}</p>
          {section.passage && (
            <p className="mt-5 whitespace-pre-line rounded-md bg-slate-50 p-4 leading-7 text-slate-800">
              {section.passage}
            </p>
          )}

          {section.items && (
            <div className="mt-5 space-y-5">
              {section.items.map((item, itemIndex) => (
                <QuestionBlock
                  key={item.id}
                  number={itemIndex + 1}
                  item={item}
                  selected={answers[item.id]}
                  checked={checked}
                  showKey={showKey}
                  onSelect={selectAnswer}
                />
              ))}
            </div>
          )}

          {section.passages && (
            <div className="mt-5 space-y-7">
              {section.passages.map((passage) => (
                <article key={passage.id} className="rounded-lg border border-slate-200 p-5">
                  <h3 className="font-bold text-slate-950">{passage.title}</h3>
                  <p className="mt-3 whitespace-pre-line rounded-md bg-slate-50 p-4 leading-7 text-slate-800">
                    {passage.body}
                  </p>
                  <div className="mt-5 space-y-5">
                    {passage.items.map((item, itemIndex) => (
                      <QuestionBlock
                        key={item.id}
                        number={itemIndex + 1}
                        item={item}
                        selected={answers[item.id]}
                        checked={checked}
                        showKey={showKey}
                        onSelect={selectAnswer}
                      />
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      ))}

      {exam.writing && (
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Writing</h2>
          <div className="mt-5 grid gap-6 lg:grid-cols-2">
            {exam.writing.map((task) => (
              <article key={task.id} className="rounded-lg border border-slate-200 p-5">
                <h3 className="font-bold text-slate-950">{task.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-700">{task.prompt}</p>
                {task.email && (
                  <p className="mt-4 whitespace-pre-line rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-800">
                    {task.email}
                  </p>
                )}
                <p className="mt-3 text-sm font-semibold text-slate-600">Target: {task.targetWords}</p>
                <textarea
                  className="mt-4 min-h-48 w-full rounded-md border border-slate-300 p-4 leading-7 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  placeholder="Write your answer here."
                />
                {(showKey || checked) && (
                  <div className="mt-4 rounded-md bg-emerald-50 p-4">
                    <p className="font-bold text-emerald-900">Sample Answer</p>
                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-800">{task.sampleAnswer}</p>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
                      {task.answerPoints.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {(showKey || checked) && (
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Answer Key</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {allItems.map((item, index) => (
              <p key={item.id} className="text-sm text-slate-700">
                {index + 1}. {item.answer}
              </p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function QuestionBlock({
  number,
  item,
  selected,
  checked,
  showKey,
  onSelect,
}: {
  number: number;
  item: MockItem;
  selected?: string;
  checked: boolean;
  showKey: boolean;
  onSelect: (id: string, choice: string) => void;
}) {
  const isCorrect = selected === item.answer;

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <p className="font-semibold leading-7 text-slate-950">
        {number}. {item.question}
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {item.choices.map((choice) => (
          <button
            key={choice}
            onClick={() => onSelect(item.id, choice)}
            className={`rounded-md border px-3 py-2 text-left text-sm transition ${
              selected === choice ? "border-sky-500 bg-sky-50 text-sky-950" : "border-slate-200 hover:border-sky-300"
            }`}
          >
            {choice}
          </button>
        ))}
      </div>
      {checked && selected && (
        <p className={`mt-3 text-sm font-bold ${isCorrect ? "text-emerald-700" : "text-rose-700"}`}>
          {isCorrect ? "Correct" : `Incorrect. Answer: ${item.answer}`}
        </p>
      )}
      {(showKey || checked) && <p className="mt-2 text-sm leading-6 text-slate-600">{item.explanation}</p>}
    </div>
  );
}
