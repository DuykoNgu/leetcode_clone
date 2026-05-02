"use client";

import Editor from "@monaco-editor/react";
import { Check, Play } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  language?: string;
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
  scrollbar: {
    verticalScrollbarSize: 10,
    horizontalScrollbarSize: 10,
  },
};

export default function CodeEditor({
  value,
  onChange,
  language = "javascript",
  height = "600px",
}: CodeEditorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl bg-white">
      <div className="flex items-center justify-between px-3 py-2">
        <select
          value={selectedLanguage}
          onChange={(event) => setSelectedLanguage(event.target.value)}
          className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-brand-orange"
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            className="bg-brand-orange text-white hover:bg-brand-orange/90"
          >
            <Play />
            Run
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
          >
            <Check />
            Submit
          </Button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden bg-[#0f172a]">
        <Editor
          height={height}
          defaultLanguage={selectedLanguage}
          language={selectedLanguage}
          value={value}
          onChange={(nextValue) => onChange(nextValue ?? "")}
          theme="vs-dark"
          options={editorOptions}
        />
      </div>
    </section>
  );
}
