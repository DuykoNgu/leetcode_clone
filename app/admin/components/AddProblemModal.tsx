"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Eye, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createProblem } from "@/lib/api/problems";
import { toast } from "sonner";

const LANGUAGES = ["javascript", "typescript", "python", "java", "cpp"];

const DIFFICULTY_OPTIONS = [
  { value: 0, label: "Easy" },
  { value: 1, label: "Medium" },
  { value: 2, label: "Hard" },
];

interface AddProblemModalProps {
  onClose: () => void;
  onSaved: () => void;
}

export function AddProblemModal({ onClose, onSaved }: AddProblemModalProps) {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [description, setDescription] = useState("");
  const [codeTemplates, setCodeTemplates] = useState(
    LANGUAGES.map((lang) => ({
      language: lang,
      starterCode: "",
      solutionCode: "",
    }))
  );
  const [testCases, setTestCases] = useState([{ input: "", expectedOutput: "", isHidden: false }]);
  const [saving, setSaving] = useState(false);
  const [descMode, setDescMode] = useState<"edit" | "preview">("edit");
  const [methodName, setMethodName] = useState("main");
  const [returnType, setReturnType] = useState("");
  const [paramTypes, setParamTypes] = useState("");

  const handleTemplateChange = (lang: string, field: "starterCode" | "solutionCode", value: string) => {
    setCodeTemplates((prev) =>
      prev.map((t) => (t.language === lang ? { ...t, [field]: value } : t))
    );
  };

  const handleTestCaseChange = (index: number, field: "input" | "expectedOutput", value: string) => {
    setTestCases((prev) =>
      prev.map((tc, i) => (i === index ? { ...tc, [field]: value } : tc))
    );
  };

  const handleToggleHidden = (index: number) => {
    setTestCases((prev) =>
      prev.map((tc, i) => (i === index ? { ...tc, isHidden: !tc.isHidden } : tc))
    );
  };

  const addTestCase = () => {
    setTestCases((prev) => [...prev, { input: "", expectedOutput: "", isHidden: false }]);
  };

  const removeTestCase = (index: number) => {
    setTestCases((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title không được để trống");
      return;
    }

    setSaving(true);
    try {
      const metadata: Record<string, any> = {
        name: methodName.trim() || "main",
      };
      if (returnType.trim()) {
        metadata.return = { type: returnType.trim() };
      }
      if (paramTypes.trim()) {
        metadata.params = paramTypes
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
          .map((type) => ({ type }));
      }

      await createProblem({
        title: title.trim(),
        difficulty,
        description,
        metadata,
        codeTemplates: codeTemplates.map((t) => ({
          language: t.language,
          starterCode: t.starterCode,
          solutionCode: t.solutionCode || undefined,
        })),
        testCases: testCases
          .filter((tc) => tc.expectedOutput.trim())
          .map((tc) => ({
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            isHidden: tc.isHidden ?? false,
          })),
      });
      toast.success("Thêm bài tập thành công");
      onSaved();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Lỗi khi thêm bài tập";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-brand-orange focus:outline-none";
  const textareaClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-brand-orange focus:outline-none font-mono";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-8">
      <button
        type="button"
        aria-label="Close"
        className="fixed inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative z-10 w-full max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-2xl"
      >
        <h2 className="text-lg font-bold text-slate-900">Thêm bài tập mới</h2>
        <p className="mb-5 text-xs text-slate-400">Tạo bài tập thủ công</p>

        <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
          {/* Title */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
          </div>

          {/* Difficulty */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className={inputClass}
            >
              {DIFFICULTY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-medium text-slate-700">Description</label>
              <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                <button
                  type="button"
                  onClick={() => setDescMode("edit")}
                  className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                    descMode === "edit"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Edit3 className="size-3" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDescMode("preview")}
                  className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                    descMode === "preview"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Eye className="size-3" /> Preview
                </button>
              </div>
            </div>
            {descMode === "edit" ? (
              <textarea
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={textareaClass}
              />
            ) : (
              <div
                className="prose prose-sm max-w-none rounded-lg border border-slate-200 bg-white p-4 text-slate-700"
                dangerouslySetInnerHTML={{ __html: description || "<p class='text-slate-400 italic'>No description</p>" }}
              />
            )}
          </div>

          {/* Function Signature */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">Function Signature</label>
            <p className="mb-2 text-[10px] text-slate-400">Khai báo thông tin hàm để hệ thống có thể chạy code</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-[10px] font-medium text-slate-400">Method Name</label>
                <input
                  type="text"
                  value={methodName}
                  onChange={(e) => setMethodName(e.target.value)}
                  placeholder="main"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-medium text-slate-400">Return Type</label>
                <input
                  type="text"
                  value={returnType}
                  onChange={(e) => setReturnType(e.target.value)}
                  placeholder="int[]"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-medium text-slate-400">Param Types</label>
                <input
                  type="text"
                  value={paramTypes}
                  onChange={(e) => setParamTypes(e.target.value)}
                  placeholder="int[], int"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Code Templates */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-700">Code Templates & Solutions</label>
            <div className="space-y-3">
              {codeTemplates.map((template) => (
                <div
                  key={template.language}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                  <span className="mb-2 block text-xs font-bold uppercase text-slate-500">
                    {template.language}
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-[10px] font-medium text-slate-400">Starter Code</label>
                      <textarea
                        rows={4}
                        value={template.starterCode}
                        onChange={(e) => handleTemplateChange(template.language, "starterCode", e.target.value)}
                        className={textareaClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-medium text-slate-400">Solution Code</label>
                      <textarea
                        rows={4}
                        value={template.solutionCode}
                        onChange={(e) => handleTemplateChange(template.language, "solutionCode", e.target.value)}
                        className={textareaClass}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Test Cases */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-medium text-slate-700">Test Cases</label>
              <button
                type="button"
                onClick={addTestCase}
                className="flex items-center gap-1 text-xs font-medium text-brand-orange hover:text-brand-orange/80"
              >
                <Plus className="size-3" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {testCases.map((tc, index) => (
                <div key={index} className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder="Input (e.g. nums = [2,7,11,15], target = 9)"
                      value={tc.input}
                      onChange={(e) => handleTestCaseChange(index, "input", e.target.value)}
                      className={inputClass}
                    />
                    <input
                      type="text"
                      placeholder="Expected Output (e.g. [0,1])"
                      value={tc.expectedOutput}
                      onChange={(e) => handleTestCaseChange(index, "expectedOutput", e.target.value)}
                      className={inputClass}
                    />
                    <label className="flex items-center gap-2 text-xs text-slate-500">
                      <input
                        type="checkbox"
                        checked={tc.isHidden}
                        onChange={() => handleToggleHidden(index)}
                        className="rounded border-slate-300"
                      />
                      Hidden test case
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTestCase(index)}
                    className="mt-1 shrink-0 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Hủy
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? "Đang tạo..." : "Tạo"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
