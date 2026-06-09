"use client";

import { cn } from "@/lib/utils";
import { ApiProblem } from "@/lib/types";
import type { Submission } from "@/lib/types";
import { Clock, Code2, CheckCircle2, XCircle } from "lucide-react";

export function SubmissionsTab({
  problem,
  onViewSubmission,
}: {
  problem: ApiProblem;
  onViewSubmission?: (sub: Submission) => void;
}) {
  const submissions = problem.submissions ?? [];

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/90 px-6 py-3 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-md bg-slate-100">
              <Code2 className="size-3.5 text-slate-500" />
            </div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Lịch sử nộp bài
            </h2>
          </div>
          {submissions.length > 0 && (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-500">
              {submissions.length}
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        {submissions.length > 0 ? (
          <div className="space-y-2">
            {submissions.map((sub) => {
              const isAccepted = sub.status === "accepted";
              return (
                <button
                  type="button"
                  key={sub.id}
                  onClick={() => onViewSubmission?.(sub)}
                  className={cn(
                    "w-full flex items-center justify-between rounded-xl border p-4 text-left transition-all duration-150 hover:shadow-md active:scale-[0.99]",
                    isAccepted
                      ? "border-emerald-100 bg-emerald-50/60 hover:border-emerald-300"
                      : "border-rose-100 bg-rose-50/40 hover:border-rose-300"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {isAccepted ? (
                      <CheckCircle2 className="size-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="size-4 text-rose-500 flex-shrink-0" />
                    )}
                    <div>
                      <p className={cn(
                        "text-sm font-bold",
                        isAccepted ? "text-emerald-700" : "text-rose-700"
                      )}>
                        {isAccepted ? "Accepted" : sub.status.replace(/_/g, " ").toUpperCase()}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(sub.submittedAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-white/80 border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-600 uppercase">
                      {sub.language}
                    </span>
                    {sub.runtimeMs != null && (
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="size-3" />
                        {sub.runtimeMs}ms
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex h-40 flex-col items-center justify-center gap-3 text-slate-400">
            <Code2 className="size-10 text-slate-200" />
            <p className="text-sm font-medium">Chưa có bài nộp nào</p>
            <p className="text-xs text-slate-300">Hãy submit để xem lịch sử</p>
          </div>
        )}
      </div>
    </div>
  );
}
