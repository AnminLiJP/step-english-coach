import WritingCoach from "@/components/WritingCoach";

export default function WritingPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold text-sky-700">Writing</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">Grade 3 / Pre-2 Writing Practice</h1>
        <p className="mt-2 text-slate-600">Choose a prompt, write a short response, and review rule-based feedback.</p>
      </div>
      <WritingCoach />
    </div>
  );
}
