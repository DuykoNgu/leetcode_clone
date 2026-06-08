"use client";

import { cn } from "@/lib/utils";
import { ApiProblem } from "@/lib/types";
import type { Submission } from "@/lib/types";

export function EditorialTab({ problem, language }: { problem: ApiProblem; language?: string }) {
  const template = problem.codeTemplates?.find(t => t.language === language && t.solutionCode);
  const solutionCode = template?.solutionCode || problem.codeTemplates?.find(t => t.solutionCode)?.solutionCode;
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-6 w-1 rounded-full bg-brand-orange" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Official Solution</h2>
      </div>
      {solutionCode ? (
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <pre className="font-mono text-sm text-slate-700 whitespace-pre-wrap">
            {solutionCode}
          </pre>
        </div>
      ) : (
        <div className="flex h-40 flex-col items-center justify-center text-slate-400 italic">
          <p>No official solution available yet.</p>
        </div>
      )}
    </div>
  );
}

export function SubmissionsTab({
  problem,
  onViewSubmission
}: {
  problem: ApiProblem;
  onViewSubmission?: (sub: Submission) => void;
}) {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-6 w-1 rounded-full bg-brand-orange" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Your Recent Submissions</h2>
      </div>
      {problem.submissions && problem.submissions.length > 0 ? (
        <div className="space-y-3">
          {problem.submissions.map((sub) => (
            <div
              key={sub.id}
              onClick={() => onViewSubmission && onViewSubmission(sub)}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm cursor-pointer hover:border-brand-orange hover:shadow-md transition-all active:scale-[0.98]"
            >
              <div className="flex flex-col gap-1">
                <span className={cn(
                  "text-sm font-bold",
                  sub.status === "accepted" ? "text-emerald-600" : "text-rose-600"
                )}>
                  {sub.status === "accepted" ? "Accepted" : sub.status.replace("_", " ").toUpperCase()}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(sub.submittedAt).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium text-slate-500 uppercase">
                <span className="bg-slate-100 px-2 py-1 rounded font-bold">{sub.language}</span>
                {sub.runtimeMs ? <span>{sub.runtimeMs}ms</span> : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-40 flex-col items-center justify-center text-slate-400 italic">
          <p>You haven't submitted any solutions yet.</p>
        </div>
      )}
    </div>
  );
}
