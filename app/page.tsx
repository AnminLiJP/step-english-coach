import Link from "next/link";
import { BookOpenCheck, Brain, CalendarDays, FileQuestion, Gamepad2, NotebookPen, Printer, RotateCcw, SpellCheck } from "lucide-react";
import LevelSelector from "@/components/LevelSelector";

const featureCards = [
  { title: "Today", href: "/dashboard", icon: BookOpenCheck, text: "View today's plan, due reviews, and next recommended task." },
  { title: "Study Plan", href: "/study-plan", icon: CalendarDays, text: "Create a 2, 4, or 8 week study plan." },
  { title: "Vocabulary", href: "/vocabulary", icon: SpellCheck, text: "Flashcards, choices, spelling, and sentence fill." },
  { title: "Vocab Game", href: "/vocab-game", icon: Gamepad2, text: "Meaning Match, Speed Review, and Fill the Sentence." },
  { title: "Vocab Test", href: "/vocab-test", icon: NotebookPen, text: "Mixed vocabulary test with sentence checking." },
  { title: "Grammar", href: "/grammar", icon: Brain, text: "Lessons, examples, common mistakes, and quizzes." },
  { title: "Mock Exam", href: "/exam", icon: FileQuestion, text: "Five mock exams per level with answer review." },
  { title: "Review", href: "/review", icon: RotateCcw, text: "Spaced review queue for mistakes." },
  { title: "Print Pack", href: "/print-pack", icon: Printer, text: "A4 weekly printable practice pack." },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold text-sky-700">Grade 4 / Grade 3 / Pre-2 English Prep</p>
        <h1 className="mt-3 text-5xl font-black tracking-normal text-slate-950">Step English Coach</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          A local-first study and review tool for vocabulary, grammar, reading, writing, mock exams, review queues, and printable practice.
        </p>
        <p className="mt-3 max-w-3xl text-xs leading-5 text-slate-500">
          Independent learning tool. Not affiliated with or endorsed by any official testing organization.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/study-plan" className="rounded-md bg-sky-600 px-5 py-3 text-sm font-bold text-white">Create Study Plan</Link>
          <Link href="/exam" className="rounded-md border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">Start Mock Exam</Link>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-slate-950">Choose Level</h2>
        <LevelSelector />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featureCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.href} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md">
              <span className="inline-flex rounded-md bg-sky-50 p-2 text-sky-700"><Icon size={22} /></span>
              <h3 className="mt-4 font-bold text-slate-950">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{card.text}</p>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
