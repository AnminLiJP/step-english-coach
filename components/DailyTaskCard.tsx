import Link from "next/link";
import { BookOpenCheck, FileText, RotateCcw } from "lucide-react";

const tasks = [
  {
    title: "10 practice questions",
    detail: "Vocabulary, grammar, and short reading practice.",
    href: "/practice",
    icon: BookOpenCheck,
  },
  {
    title: "5-minute review",
    detail: "Retry recent mistakes while they are still fresh.",
    href: "/review",
    icon: RotateCcw,
  },
  {
    title: "Print one worksheet",
    detail: "A parent-friendly paper practice sheet.",
    href: "/print",
    icon: FileText,
  },
];

export default function DailyTaskCard() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {tasks.map((task) => {
        const Icon = task.icon;
        return (
          <Link
            key={task.title}
            href={task.href}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:border-sky-300"
          >
            <div className="flex items-center gap-3">
              <span className="rounded-md bg-emerald-50 p-2 text-emerald-700">
                <Icon size={21} aria-hidden="true" />
              </span>
              <h3 className="font-bold text-slate-950">{task.title}</h3>
            </div>
            <p className="mt-3 text-sm text-slate-600">{task.detail}</p>
          </Link>
        );
      })}
    </div>
  );
}
