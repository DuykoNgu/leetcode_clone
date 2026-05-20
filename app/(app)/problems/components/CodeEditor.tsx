"use client";

import Editor from "@monaco-editor/react";
import { Check, Play, ChevronUp, Terminal, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  onLanguageChange?: (language: string) => void;
  height?: string;
};

const editorOptions = {
  fontSize: 14,
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
};

export default function CodeEditor({
  value,
  onChange,
  language = "javascript",
  onLanguageChange,
  height = "100%",
}: CodeEditorProps) {
  const [localLanguage, setLocalLanguage] = useState(language);
  const currentLanguage = onLanguageChange ? language : localLanguage;
  const [showConsole, setShowConsole] = useState(false);

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
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
            <RotateCcw className="size-3.5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            className="h-8 bg-slate-800 px-4 text-xs font-bold text-white hover:bg-slate-700 active:scale-95 transition-all"
          >
            <Play className="mr-2 size-3.5 fill-white" />
            Chạy Code
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-8 bg-brand-orange px-4 text-xs font-bold text-white hover:bg-brand-orange/90 active:scale-95 transition-all"
          >
            <Check className="mr-2 size-3.5 stroke-[3]" />
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
          options={editorOptions}
        />
      </div>

      {/* Console Drawer */}
      <div className={cn(
        "border-t border-slate-200 bg-white transition-all duration-300",
        showConsole ? "h-48" : "h-10"
      )}>
        <button 
          onClick={() => setShowConsole(!showConsole)}
          className="flex w-full items-center justify-between px-4 py-2 text-slate-500 hover:bg-slate-50"
        >
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
            <Terminal className="size-3.5 text-brand-orange" />
            Bảng điều khiển
          </div>
          <ChevronUp className={cn("size-4 transition-transform", showConsole && "rotate-180")} />
        </button>
        
        {showConsole && (
          <div className="p-4 font-mono text-[13px] text-slate-600">
            <div className="flex items-center gap-2 text-emerald-600 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Trạng thái: Sẵn sàng
            </div>
            <p className="text-slate-400 italic">Kết quả sẽ được hiển thị ở đây sau khi chạy code...</p>
          </div>
        )}
      </div>
    </section>
  );
}
