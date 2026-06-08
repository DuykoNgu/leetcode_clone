"use client";

import { ApiProblem } from "@/lib/types";
import { Clock, Database, Code2, BookOpen, ChevronRight } from "lucide-react";

export function EditorialTab({
  problem,
  language,
}: {
  problem: ApiProblem;
  language?: string;
}) {
  const solution = problem.solution;
  const contentHtml = solution?.contentHtml;
  const codeSnippets = solution?.codeSnippets;

  const currentLangCode = language ? codeSnippets?.[language] : null;
  const fallbackCode = Object.values(codeSnippets || {}).find(Boolean);
  const displayCode = currentLangCode || fallbackCode;

  if (!solution) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-400">
        <BookOpen className="size-10 text-slate-200" />
        <p className="text-sm font-medium">Chưa có lời giải chính thức</p>
        <p className="text-xs text-slate-300">Lời giải sẽ sớm được cập nhật</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/90 px-6 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-md bg-brand-orange/10">
            <BookOpen className="size-3.5 text-brand-orange" />
          </div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Lời giải chính thức
          </h2>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {contentHtml ? (
          <div className="editorial-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />
        ) : (
          <>
            {/* Explanation */}
            {solution.explanation && (
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <ChevronRight className="size-3.5 text-brand-orange" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Giải thích</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
                  {solution.explanation}
                </p>
              </div>
            )}

            {/* Complexity */}
            {(solution.timeComplexity || solution.spaceComplexity) && (
              <div className="flex flex-wrap gap-3">
                {solution.timeComplexity && (
                  <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
                    <Clock className="size-3.5 text-brand-orange flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Time</p>
                      <p className="text-xs font-bold text-slate-800 font-mono">{solution.timeComplexity}</p>
                    </div>
                  </div>
                )}
                {solution.spaceComplexity && (
                  <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
                    <Database className="size-3.5 text-sky-500 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Space</p>
                      <p className="text-xs font-bold text-slate-800 font-mono">{solution.spaceComplexity}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Code snippet */}
            {displayCode && (
              <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between bg-[#0f172a] px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <Code2 className="size-3.5 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      {language ?? "Solution"}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="size-2.5 rounded-full bg-red-500/60" />
                    <span className="size-2.5 rounded-full bg-yellow-500/60" />
                    <span className="size-2.5 rounded-full bg-green-500/60" />
                  </div>
                </div>
                <pre className="overflow-x-auto bg-[#1e293b] p-5 text-xs leading-relaxed text-[#e2e8f0] font-mono">
                  {displayCode}
                </pre>
              </div>
            )}
          </>
        )}
      </div>

      {/* Scoped styles cho rich HTML content */}
      <style>{`
        .editorial-content { font-size: 0.875rem; line-height: 1.75; color: #334155; }
        .editorial-content h1, .editorial-content h2, .editorial-content h3 {
          font-weight: 700; color: #0f172a; margin: 1.25rem 0 0.625rem;
        }
        .editorial-content h1 { font-size: 1.125rem; }
        .editorial-content h2 { font-size: 1rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.5rem; }
        .editorial-content h3 { font-size: 0.875rem; }
        .editorial-content p { margin: 0 0 0.875rem; }
        .editorial-content ul, .editorial-content ol { padding-left: 1.25rem; margin: 0 0 0.875rem; }
        .editorial-content li { margin-bottom: 0.25rem; }
        .editorial-content code {
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 0.8125rem;
          background: #f1f5f9;
          padding: 0.1em 0.375em;
          border-radius: 4px;
          color: #e11d48;
        }
        .editorial-content pre {
          background: #1e293b;
          border-radius: 0.75rem;
          overflow-x: auto;
          padding: 1.25rem;
          margin: 1rem 0;
          border: 1px solid #334155;
        }
        .editorial-content pre code {
          background: transparent;
          color: #e2e8f0;
          padding: 0;
          font-size: 0.8125rem;
          line-height: 1.6;
        }
        .editorial-content blockquote {
          border-left: 3px solid #f97316;
          margin: 1rem 0;
          padding: 0.5rem 1rem;
          background: #fff7ed;
          border-radius: 0 0.5rem 0.5rem 0;
          color: #78350f;
          font-style: italic;
        }
        .editorial-content table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.8125rem; }
        .editorial-content th {
          background: #f8fafc; font-weight: 700; color: #0f172a;
          padding: 0.5rem 0.75rem; border: 1px solid #e2e8f0; text-align: left;
        }
        .editorial-content td { padding: 0.5rem 0.75rem; border: 1px solid #e2e8f0; }
        .editorial-content tr:nth-child(even) td { background: #f8fafc; }
        .editorial-content details { border: 1px solid #e2e8f0; border-radius: 0.5rem; overflow: hidden; margin: 0.75rem 0; }
        .editorial-content summary {
          cursor: pointer; padding: 0.625rem 1rem; background: #f8fafc;
          font-size: 0.8125rem; font-weight: 600; color: #475569;
          list-style: none; user-select: none;
        }
        .editorial-content summary::before { content: '▶ '; font-size: 0.625rem; color: #94a3b8; }
        .editorial-content details[open] summary { background: #f1f5f9; color: #0f172a; }
        .editorial-content details[open] summary::before { content: '▼ '; }
        .editorial-content details > *:not(summary) { padding: 0.75rem 1rem; }
        /* sc-* legacy classes */
        .sc { font-size: 0.875rem; line-height: 1.7; color: #334155; }
        .sc-top { display:flex; align-items:center; gap:.75rem; margin-bottom:1.5rem; padding-bottom:1rem; border-bottom:1px solid #e2e8f0; }
        .sc-name { font-size:1.125rem; font-weight:700; color:#0f172a; margin:0; }
        .sc-lvl { display:inline-flex; align-items:center; padding:.125rem .625rem; border-radius:9999px; font-size:.75rem; font-weight:600; letter-spacing:.025em; text-transform:uppercase; }
        .sc-sec { margin-bottom:1.5rem; }
        .sc-sec-h { display:flex; align-items:center; gap:.5rem; font-size:.8125rem; font-weight:700; color:#0f172a; text-transform:uppercase; letter-spacing:.04em; margin-bottom:.875rem; }
        .sc-bar { display:block; width:3px; height:14px; border-radius:2px; background:#f97316; flex-shrink:0; }
        .sc-txt { padding-left:.75rem; border-left:2px solid #f1f5f9; }
        .sc-txt p { margin:0 0 .75rem; line-height:1.75; color:#475569; }
        .sc-txt p:last-child { margin-bottom:0; }
        .sc-cplx { display:flex; gap:.75rem; flex-wrap:wrap; }
        .sc-cplx-item { display:inline-flex; align-items:center; gap:.625rem; padding:.5rem 1rem; border-radius:.5rem; border:1px solid #e2e8f0; background:#f8fafc; }
        .sc-cplx-lbl { font-size:.6875rem; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:.04em; }
        .sc-cplx-val { font-size:.8125rem; font-weight:700; color:#0f172a; font-family:'JetBrains Mono','Fira Code',monospace; }
        .sc-codes { display:flex; flex-direction:column; gap:.625rem; border-radius:.5rem; border:1px solid #e2e8f0; overflow:hidden; }
        .sc-dtls { border-bottom:1px solid #e2e8f0; }
        .sc-dtls:last-child { border-bottom:none; }
        .sc-smry { display:flex; align-items:center; gap:.5rem; padding:.5rem 1rem; font-size:.75rem; font-weight:600; color:#64748b; cursor:pointer; user-select:none; list-style:none; background:#fafafa; }
        .sc-smry::-webkit-details-marker { display:none; }
        .sc-smry::before { content:'▶'; font-size:.625rem; transition:transform .15s; color:#94a3b8; }
        .sc-dtls[open] .sc-smry::before { transform:rotate(90deg); }
        .sc-dtls[open] .sc-smry { color:#0f172a; font-weight:700; background:#f1f5f9; border-bottom:1px solid #e2e8f0; }
        .sc-cb { background:#0f172a; overflow-x:auto; }
        .sc-cb pre { margin:0; padding:1rem; font-size:.8125rem; line-height:1.6; font-family:'JetBrains Mono','Fira Code',monospace; color:#e2e8f0; white-space:pre; }
      `}</style>
    </div>
  );
}
