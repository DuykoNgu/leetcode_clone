"use client";

import { BookOpenText, ChevronRight, Circle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type Example = {
  input: string;
  output: string;
  explanation?: string;
};

type DecriptionQuestionProps = {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  examples: Example[];
  constraints: string[];
};

const difficultyStyles = {
  Easy: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Medium: "bg-amber-50 text-amber-700 ring-amber-200",
  Hard: "bg-rose-50 text-rose-700 ring-rose-200",
};

export default function DecriptionQuestion({
  title,
  difficulty,
  description,
  examples,
  constraints,
}: DecriptionQuestionProps) {
  return (
    <aside className="flex h-full min-h-0 flex-col bg-white">
      <div className="scrollbar-hide flex-1 space-y-8 overflow-y-auto px-6 py-6">
        {/* Title and Badge */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset",
                difficultyStyles[difficulty]
              )}
            >
              {difficulty}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
            <div className="flex items-center gap-1.5">
              <BookOpenText className="size-3.5" />
              Algorithms
            </div>
            <div className="flex items-center gap-1.5">
              <Info className="size-3.5" />
              Success Rate: 48.5%
            </div>
          </div>
        </section>

        {/* Description Section */}
        <section className="prose prose-slate prose-sm max-w-none">
          <div className="space-y-4 text-[15px] leading-relaxed text-slate-600">
            {description.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </section>

        {/* Examples Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1 rounded-full bg-brand-orange" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Examples</h2>
          </div>

          <div className="space-y-6">
            {examples.map((example, index) => (
              <article key={index} className="group relative rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition-all hover:bg-white hover:shadow-md">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Example {index + 1}</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-tight text-slate-400">Input</span>
                    <code className="rounded-lg bg-slate-900 px-4 py-3 font-mono text-[13px] text-emerald-400 shadow-inner">
                      {example.input}
                    </code>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-tight text-slate-400">Output</span>
                    <code className="rounded-lg bg-slate-800 px-4 py-3 font-mono text-[13px] text-amber-400 shadow-inner">
                      {example.output}
                    </code>
                  </div>
                  {example.explanation && (
                    <div className="mt-2 rounded-lg border-l-4 border-amber-200 bg-amber-50/50 p-3 text-[13px] text-slate-600">
                      <span className="font-bold text-amber-700">Explanation:</span> {example.explanation}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Constraints Section */}
        {constraints.length > 0 && (
          <section className="rounded-2xl border border-slate-100 bg-slate-50/30 p-5">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900">Constraints</h2>
            <ul className="space-y-2.5">
              {constraints.map((constraint, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Circle className="mt-1.5 size-1.5 fill-brand-orange text-brand-orange" />
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-700">
                    {constraint}
                  </code>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </aside>
  );
}
