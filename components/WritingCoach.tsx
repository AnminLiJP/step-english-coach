"use client";

import { useMemo, useState } from "react";

const prompts = [
  { level: "Grade 3", text: "Which do you like better, studying at home or studying at school?", target: "25-35 words" },
  { level: "Grade 3", text: "What do you usually do to stay healthy?", target: "25-35 words" },
  { level: "Grade 3", text: "Do you think students should read books every day?", target: "25-35 words" },
  { level: "Pre-2", text: "Do you think students should use digital textbooks at school?", target: "50-60 words" },
  { level: "Pre-2", text: "Is it better for high school students to have part-time jobs?", target: "50-60 words" },
  { level: "Pre-2", text: "Do you think local communities should hold more volunteer events?", target: "50-60 words" },
];

export default function WritingCoach() {
  const [prompt, setPrompt] = useState(prompts[0].text);
  const [text, setText] = useState("");
  const words = useMemo(() => text.trim().split(/\s+/).filter(Boolean).length, [text]);
  const currentPrompt = prompts.find((item) => item.text === prompt) ?? prompts[0];
  const minimumWords = currentPrompt.level === "Pre-2" ? 50 : 25;
  const feedback = [
    words >= minimumWords ? `Word count is enough for ${currentPrompt.level}.` : `Write at least ${minimumWords} words.`,
    text.toLowerCase().includes("because") ? "You used because to explain a reason." : "Try adding because to explain your reason.",
    /first|second|also|for example|in my opinion|therefore|however/i.test(text) ? "Good use of linking words." : "Try First, Also, For example, or Therefore.",
  ];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <label className="text-sm font-bold text-slate-700" htmlFor="prompt">Prompt</label>
      <select id="prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3">
        {prompts.map((item) => <option key={item.text} value={item.text}>{item.level}: {item.text}</option>)}
      </select>
      <textarea value={text} onChange={(event) => setText(event.target.value)} className="mt-5 min-h-56 w-full rounded-md border border-slate-300 p-4 leading-7 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100" placeholder="I think ... because ..." />
      <div className="mt-4 rounded-lg bg-slate-50 p-4">
        <p className="font-bold text-slate-950">Feedback</p>
        <p className="mt-1 text-sm text-slate-600">Level: {currentPrompt.level} / Target: {currentPrompt.target} / Words: {words}</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">{feedback.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
    </section>
  );
}
