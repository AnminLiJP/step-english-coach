import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { BookOpen, Brain, CalendarDays, ClipboardList, FileQuestion, Gamepad2, Home, NotebookPen, Printer, RotateCcw, SpellCheck, Trophy, Users } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Step English Coach",
  description: "Grade 4銉籊rade 3銉籔re-2 level English study and review tool",
};

const navGroups = [
  {
    label: "Plan",
    items: [
      { href: "/", label: "Home", icon: Home },
      { href: "/dashboard", label: "Dashboard", icon: ClipboardList },
      { href: "/study-plan", label: "Study Plan", icon: CalendarDays },
      { href: "/exam", label: "Mock Exam", icon: FileQuestion },
    ],
  },
  {
    label: "Skills",
    items: [
      { href: "/practice", label: "Practice", icon: BookOpen },
      { href: "/vocabulary", label: "Vocabulary", icon: SpellCheck },
      { href: "/vocab-game", label: "Vocab Game", icon: Gamepad2 },
      { href: "/vocab-test", label: "Vocab Test", icon: Trophy },
      { href: "/grammar", label: "Grammar", icon: Brain },
    ],
  },
  {
    label: "Review",
    items: [
      { href: "/review", label: "Review", icon: RotateCcw },
      { href: "/mistakes", label: "Mistakes", icon: RotateCcw },
      { href: "/writing", label: "Writing", icon: NotebookPen },
      { href: "/parent-report", label: "Parent Report", icon: Users },
      { href: "/print-pack", label: "Print Pack", icon: Printer },
      { href: "/print", label: "Print", icon: Printer },
    ],
  },
];

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <nav className="border-b border-slate-200 bg-white print:hidden">
          <div className="mx-auto max-w-7xl px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link href="/" className="text-xl font-black text-slate-950">Step English Coach</Link>
              <span className="rounded-md bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">V3 Four-Week Learning</span>
            </div>
            <div className="mt-4 grid gap-3 xl:grid-cols-[0.9fr_1.15fr_1.25fr]">
              {navGroups.map((group) => (
                <div key={group.label} className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                  <p className="px-2 pb-1 text-[11px] font-black uppercase tracking-wide text-slate-400">{group.label}</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link key={item.href} href={item.href} className="flex min-h-10 items-center justify-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-sky-50 hover:text-sky-900">
                          <Icon size={16} aria-hidden="true" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </nav>
        <main className="mx-auto max-w-7xl px-5 py-8 print:max-w-none print:px-0 print:py-0">{children}</main>
      </body>
    </html>
  );
}

