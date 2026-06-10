"use client";

import Editor from "@monaco-editor/react";
import { Check, Play, ChevronUp, ChevronDown, Terminal, RotateCcw, Loader2, X, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ExecuteResult } from "@/lib/api/problems";

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  onLanguageChange?: (language: string) => void;
  height?: string;
  onRun?: () => void;
  onSubmit?: () => void;
  onReset?: () => void;
  isRunning?: boolean;
  isSubmitting?: boolean;
  runResult?: ExecuteResult | null;
  showConsole?: boolean;
  setShowConsole?: (show: boolean) => void;
};

const getEditorOptions = (fontSize: number) => ({
  fontSize,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
  wordWrap: "on" as const,
  padding: { top: 16, bottom: 16 },
  lineNumbersMinChars: 3,
  glyphMargin: false,
  folding: true,
  renderLineHighlight: "line" as const,
  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  scrollbar: {
    verticalScrollbarSize: 8,
    horizontalScrollbarSize: 8,
  },
});

export default function CodeEditor({
  value,
  onChange,
  language = "javascript",
  onLanguageChange,
  height = "100%",
  onRun,
  onSubmit,
  onReset,
  isRunning = false,
  isSubmitting = false,
  runResult = null,
  showConsole,
  setShowConsole,
}: CodeEditorProps) {
  const [localLanguage, setLocalLanguage] = useState(language);
  const currentLanguage = onLanguageChange ? language : localLanguage;
  const [localShowConsole, setLocalShowConsole] = useState(false);
  const [expandedTestCase, setExpandedTestCase] = useState<number | null>(null);
  const [fontSize, setFontSize] = useState(14);

  const zoomIn = () => setFontSize(f => Math.min(f + 2, 40));
  const zoomOut = () => setFontSize(f => Math.max(f - 2, 8));

  const isConsoleOpen = showConsole !== undefined ? showConsole : localShowConsole;

  const toggleConsole = () => {
    if (setShowConsole) {
      setShowConsole(!isConsoleOpen);
    } else {
      setLocalShowConsole(!isConsoleOpen);
    }
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = event.target.value;
    if (onLanguageChange) {
      onLanguageChange(newLang);
    } else {
      setLocalLanguage(newLang);
    }
  };

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-4 py-2">
        <div className="flex items-center gap-3">
          <select
            value={currentLanguage}
            onChange={handleLanguageChange}
            className="h-8 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 outline-none transition-all focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
          <Button variant="ghost" size="icon" onClick={onReset} className="h-8 w-8 text-slate-400 hover:text-slate-600">
            <RotateCcw className="size-3.5" />
          </Button>
          <span className="mx-1 h-5 w-px bg-slate-200" />
          <Button variant="ghost" size="icon" onClick={zoomOut} className="h-8 w-8 text-slate-400 hover:text-slate-600">
            <Minus className="size-3.5" />
          </Button>
          <span className="min-w-[20px] text-center text-[11px] font-semibold text-slate-500 tabular-nums">{fontSize}</span>
          <Button variant="ghost" size="icon" onClick={zoomIn} className="h-8 w-8 text-slate-400 hover:text-slate-600">
            <Plus className="size-3.5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={onRun}
            disabled={isRunning || isSubmitting}
            className="h-8 bg-slate-800 px-4 text-xs font-bold text-white hover:bg-slate-700 active:scale-95 transition-all disabled:opacity-60"
          >
            {isRunning ? (
              <Loader2 className="mr-2 size-3.5 animate-spin" />
            ) : (
              <Play className="mr-2 size-3.5 fill-white" />
            )}
            Chạy Code
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onSubmit}
            disabled={isRunning || isSubmitting}
            className="h-8 bg-brand-orange px-4 text-xs font-bold text-white hover:bg-brand-orange/90 active:scale-95 transition-all disabled:opacity-60"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 size-3.5 animate-spin" />
            ) : (
              <Check className="mr-2 size-3.5 stroke-[3]" />
            )}
            Nộp bài
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="relative min-h-0 flex-1 overflow-hidden bg-[#1e1e1e]">
        <Editor
          height={height}
          defaultLanguage={currentLanguage}
          language={currentLanguage}
          value={value}
          onChange={(nextValue) => onChange(nextValue ?? "")}
          theme="vs-dark"
          options={getEditorOptions(fontSize)}
        />
      </div>

      {/* Console Drawer */}
      <div className={cn(
        "border-t border-slate-200 bg-slate-950 transition-all duration-300 flex flex-col min-h-0",
        isConsoleOpen ? "h-64" : "h-10"
      )}>
        <button 
          type="button"
          onClick={toggleConsole}
          className="flex w-full items-center justify-between px-4 py-2.5 text-slate-400 hover:bg-slate-900 border-b border-slate-800 bg-slate-950"
        >
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
            <Terminal className="size-3.5 text-brand-orange" />
            Bảng điều khiển
          </div>
          <ChevronUp className={cn("size-4 transition-transform text-slate-400", isConsoleOpen && "rotate-180")} />
        </button>
        
        {isConsoleOpen && (
          <div className="p-4 font-mono text-[13px] text-slate-300 flex-1 overflow-y-auto">
            {isRunning || isSubmitting ? (
              <div className="flex items-center gap-2 text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin text-brand-orange" />
                <span>Đang chấm điểm trên môi trường sandbox docker...</span>
              </div>
            ) : runResult ? (
              <div className="space-y-3">
                {/* Status and Summary */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs">Trạng thái:</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider",
                      runResult.success 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25" 
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/25"
                    )}>
                     {runResult.status?.replace("_", " ") || runResult.message || "ERROR"}
                    </span>
                  </div>
                  <div className="text-slate-400 text-xs">
                    Testcases đã qua: <span className={runResult.success ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>{runResult.passed}</span> / {runResult.total}
                  </div>
                </div>

                  {/* Per-test-case list */}
                {runResult.testCaseResults && runResult.testCaseResults.length > 0 ? (
                  <div className="space-y-1">
                    {runResult.testCaseResults.map((tc, i) => {
                      const isExpanded = expandedTestCase === i;
                      const isPassed = tc.passed;
                      const statusLabel = tc.status?.replace("_", " ") || "unknown";
                      return (
                        <div key={i}>
                          <button
                            type="button"
                            onClick={() => setExpandedTestCase(isExpanded ? null : i)}
                            className={cn(
                              "flex w-full items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors",
                              isPassed
                                ? "text-slate-400 hover:bg-slate-900/50"
                                : "text-slate-300 hover:bg-slate-900/50 cursor-pointer"
                            )}
                          >
                            {isPassed ? (
                              <Check className="size-3.5 shrink-0 text-emerald-500" />
                            ) : (
                              <X className="size-3.5 shrink-0 text-rose-500" />
                            )}
                            <span className="font-medium">Testcase {i + 1}</span>
                            {!isPassed && (
                              <span className="text-[10px] uppercase tracking-wider font-semibold text-rose-400/80">
                                {statusLabel}
                              </span>
                            )}
                            <ChevronDown className={cn(
                              "size-3 ml-auto text-slate-500 transition-transform shrink-0",
                              isExpanded && "rotate-180"
                            )} />
                          </button>
                          {/* Expanded details for all test cases */}
                          {isExpanded && (
                            <div className="ml-7 mr-2 p-2.5 bg-slate-900 border border-slate-800 rounded text-xs space-y-1.5 mb-1">
                              <div>
                                <span className="font-bold text-slate-400">Input: </span>
                                <span className="text-slate-300 whitespace-pre-wrap break-all">{tc.input}</span>
                              </div>
                              <div>
                                <span className="font-bold text-emerald-400">Expected: </span>
                                <span className="text-emerald-300 whitespace-pre-wrap break-all">{tc.expectedOutput}</span>
                              </div>
                              <div>
                                <span className={cn("font-bold", isPassed ? "text-emerald-400" : "text-rose-400")}>Got: </span>
                                <span className={cn("whitespace-pre-wrap break-all", isPassed ? "text-emerald-300" : "text-rose-300")}>{tc.actualOutput}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Fallback: show message for compile error or other non-testcase errors */
                  runResult.message && (
                    <div className="space-y-1">
                      <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Kết quả chi tiết / Nhật ký lỗi:</div>
                      <pre className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 text-xs overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed max-h-36">
                        {runResult.message}
                      </pre>
                    </div>
                  )
                )}

                {/* Success Message */}
                {runResult.success && (
                  <div className="text-emerald-400 flex items-center gap-1.5 text-xs bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10">
                    <Check className="size-4 text-emerald-500" />
                    <span>Chúc mừng! Tất cả các trường hợp kiểm thử (testcases) đã chạy thành công.</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-500 italic text-xs">Kết quả chạy thử và biên dịch sẽ hiển thị ở đây...</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
