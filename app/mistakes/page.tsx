import MistakeReview from "@/components/MistakeReview";

export default function MistakesPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold text-sky-700">Review</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">Mistake Notebook</h1>
        <p className="mt-2 text-slate-600">Wrong answers from Practice and Exam are saved locally for review.</p>
      </div>
      <MistakeReview />
    </div>
  );
}
