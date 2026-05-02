"use client";

import { BookOpenText, ChevronRight, Circle } from "lucide-react";
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
    <aside className="flex h-full min-h-0 flex-col bg-[#fcfcfd]">
      <div className="border-b border-gray-200 px-5 py-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-gray-400">
              <BookOpenText className="size-4" />
              Problem
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          <span
            className={cn(
              "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
              difficultyStyles[difficulty]
            )}
          >
            {difficulty}
          </span>
        </div>
      </div>

      <div className="scrollbar-hide flex-1 space-y-6 overflow-y-auto px-5 py-5">
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Description</h2>
          <div className="space-y-4 text-sm leading-6 text-gray-700">
            {description.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <ChevronRight className="size-4 text-brand-orange" />
            <h2 className="text-sm font-semibold text-gray-900">Examples</h2>
          </div>

          {examples.map((example, index) => (
            <article key={`${example.input}-${index}`} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-gray-900">Example {index + 1}</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Input</p>
                  <code className="block rounded-lg bg-gray-50 px-3 py-2 font-mono text-[13px] text-gray-800">
                    {example.input}
                  </code>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Output</p>
                  <code className="block rounded-lg bg-gray-50 px-3 py-2 font-mono text-[13px] text-gray-800">
                    {example.output}
                  </code>
                </div>
                {example.explanation ? (
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">Explanation</p>
                    <p className="rounded-lg bg-orange-50 px-3 py-2 text-[13px] leading-6 text-gray-700">
                      {example.explanation}
                    </p>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Constraints</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            {constraints.map((constraint) => (
              <li key={constraint} className="flex items-start gap-2">
                <Circle className="mt-1 size-2 fill-brand-orange text-brand-orange" />
                <code className="font-mono text-[13px] text-gray-800">{constraint}</code>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </aside>
  );
}
