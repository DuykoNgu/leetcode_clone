"use client";

import { cn } from "@/lib/utils";
import { ApiProblem } from "@/lib/types";
import type { Submission } from "@/lib/types";

export function EditorialTab({ problem, language }: { problem: ApiProblem; language?: string }) {
  const solution = problem.solution;
  const contentHtml = solution?.contentHtml;
  const codeSnippets = solution?.codeSnippets;

  const currentLangCode = language ? codeSnippets?.[language] : null;
  const fallbackCode = Object.values(codeSnippets || {}).find(Boolean);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-6 w-1 rounded-full bg-brand-orange" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Official Solution</h2>
      </div>
      {contentHtml ? (
        <div
          className="sc"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      ) : solution ? (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{solution.explanation}</p>
            {(solution.timeComplexity || solution.spaceComplexity) && (
              <p className="mt-3 text-xs font-medium text-slate-500">
                Time: {solution.timeComplexity || 'N/A'} &nbsp;|&nbsp; Space: {solution.spaceComplexity || 'N/A'}
              </p>
            )}
          </div>
          {(currentLangCode || fallbackCode) && (
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <pre className="font-mono text-sm text-slate-700 whitespace-pre-wrap">
                {currentLangCode || fallbackCode}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-40 flex-col items-center justify-center text-slate-400 italic">
          <p>No official solution available yet.</p>
        </div>
      )}

      <style>{`
        .sc { font-size: 0.875rem; line-height: 1.7; color: #334155; }
        .sc-top { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #e2e8f0; }
        .sc-name { font-size: 1.125rem; font-weight: 700; color: #0f172a; margin: 0; }
        .sc-lvl { display: inline-flex; align-items: center; padding: 0.125rem 0.625rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.025em; text-transform: uppercase; }
        .sc-sec { margin-bottom: 1.5rem; }
        .sc-sec-h { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.875rem; }
        .sc-bar { display: block; width: 3px; height: 14px; border-radius: 2px; background: #f97316; flex-shrink: 0; }
        .sc-txt { padding-left: 0.75rem; border-left: 2px solid #f1f5f9; }
        .sc-txt p { margin: 0 0 0.75rem 0; line-height: 1.75; color: #475569; }
        .sc-txt p:last-child { margin-bottom: 0; }
        .sc-cplx { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .sc-cplx-item { display: inline-flex; align-items: center; gap: 0.625rem; padding: 0.5rem 1rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; background: #f8fafc; }
        .sc-cplx-lbl { font-size: 0.6875rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.04em; }
        .sc-cplx-val { font-size: 0.8125rem; font-weight: 700; color: #0f172a; font-family: 'JetBrains Mono','Fira Code','Cascadia Code',monospace; }
        .sc-codes { display: flex; flex-direction: column; gap: 0.625rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; overflow: hidden; }
        .sc-dtls { border-bottom: 1px solid #e2e8f0; }
        .sc-dtls:last-child { border-bottom: none; }
        .sc-smry { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; font-size: 0.75rem; font-weight: 600; color: #64748b; cursor: pointer; user-select: none; list-style: none; background: #fafafa; }
        .sc-smry::-webkit-details-marker { display: none; }
        .sc-smry::before { content: '▶'; font-size: 0.625rem; transition: transform .15s; color: #94a3b8; }
        .sc-dtls[open] .sc-smry::before { transform: rotate(90deg); }
        .sc-dtls[open] .sc-smry { color: #0f172a; font-weight: 700; background: #f1f5f9; border-bottom: 1px solid #e2e8f0; }
        .sc-cb { background: #0f172a; overflow-x: auto; }
        .sc-cb pre { margin: 0; padding: 1rem; font-size: 0.8125rem; line-height: 1.6; font-family: 'JetBrains Mono','Fira Code','Cascadia Code',monospace; color: #e2e8f0; white-space: pre; }
      `}</style>
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
