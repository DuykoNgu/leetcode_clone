"use client";

import { useEffect, useState, use } from "react";
import { getProblemDetail, runCode, ExecuteResult } from "@/lib/api/problems";
import { ApiProblem } from "@/lib/types";
import DecriptionQuestion from "../components/DecriptionQuestion";
import CodeEditor from "../components/CodeEditor";
import ProblemHeader from "../components/ProblemHeader";
import { Loader2, MessageSquare, History, FileText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { EditorialTab, SubmissionsTab, TabButton } from "../../../../components/common/TabButton";
import { toast } from "sonner";

type Tab = "description" | "editorial" | "submissions";

export default function ProblemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [problem, setProblem] = useState<ApiProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [activeTab, setActiveTab] = useState<Tab>("description");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResult, setRunResult] = useState<ExecuteResult | null>(null);
  const [showConsole, setShowConsole] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/problems?showLogin=true");
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchDetail = async (shouldSetStarterCode = false) => {
    try {
      const data = await getProblemDetail(id);
      setProblem(data);
      
      if (shouldSetStarterCode) {
        const template = data.codeTemplates?.find(t => t.language === language);
        if (template) {
          setCode(template.starterCode);
        }
      }
    } catch (err) {
      console.error("Failed to fetch problem detail:", err);
      setError("Không thể tải thông tin bài tập.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    fetchDetail(true);
  }, [id, isAuthenticated, authLoading]);

  const handleRun = async () => {
    if (isRunning || isSubmitting) return;
    setIsRunning(true);
    setRunResult(null);
    setShowConsole(true);

    try {
      const result = await runCode(id, code, language);
      setRunResult(result);
      if (result.success) {
        toast.success("Chạy code hoàn thành!");
      } else {
        toast.error(`Chạy code thất bại: ${result.status.replace("_", " ").toUpperCase()}`);
      }
      await fetchDetail(false);
    } catch (err: any) {
      console.error("Failed to run code:", err);
      const errMsg = err.response?.data?.message || err.message || "Lỗi khi chạy code.";
      setRunResult({
        success: false,
        status: "compile_error",
        passed: 0,
        total: problem?.testCases?.length || 0,
        message: errMsg,
        submissionId: null
      });
      toast.error(errMsg);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (isRunning || isSubmitting) return;
    setIsSubmitting(true);
    setRunResult(null);
    setShowConsole(true);

    try {
      const result = await runCode(id, code, language);
      setRunResult(result);
      if (result.success) {
        toast.success("Nộp bài thành công! Tất cả testcase đã vượt qua.");
        setActiveTab("submissions");
      } else {
        toast.error(`Nộp bài thất bại: ${result.status.replace("_", " ").toUpperCase()}`);
      }
      await fetchDetail(false);
    } catch (err: any) {
      console.error("Failed to submit code:", err);
      const errMsg = err.response?.data?.message || err.message || "Lỗi khi nộp bài.";
      setRunResult({
        success: false,
        status: "compile_error",
        passed: 0,
        total: problem?.testCases?.length || 0,
        message: errMsg,
        submissionId: null
      });
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };
  // Hàm xử lý khi click 1 bài trong lịch sử nộp bài
  const handleViewSubmission = (sub: any) => {
    // Chuyển ngôn ngữ ở thanh chọn
    setLanguage(sub.language);
    //Đổ code cũ vào Editor
    setCode(sub.code);
    //Phục dựng lại kết quả chạy để hiển thị ở Bảng điều khiển
    setRunResult({
      success: sub.status === "accepted",
      status: sub.status,
      passed: sub.passedCases || 0,
      total: sub.totalCases || problem?.testCases?.length || 0,
      message: sub.errorMessage || "",
      submissionId: null
    });
    //Tự động bật Console lên để người dùng xem lỗi
    setShowConsole(true);
    
    // Tùy chọn: Bật thông báo nhỏ
    toast.info(`Đang xem lịch sử nộp bài: ${sub.language.toUpperCase()}`);
  };


  if (loading || authLoading) {
    return (
      <div className="flex h-[calc(100vh-60px)] items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-brand-orange" />
          <p className="text-sm font-medium text-slate-400 animate-pulse">Đang tải bài tập...</p>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="flex h-[calc(100vh-60px)] flex-col items-center justify-center gap-4 bg-white text-rose-500">
        <p className="text-lg font-semibold">{error || "Bài tập không tồn tại."}</p>
        <button 
          onClick={() => router.push("/problems")}
          className="text-sm font-bold text-brand-orange hover:underline"
        >
          Quay lại danh sách bài tập
        </button>
      </div>
    );
  }

  const difficultyMap: Record<number, "Easy" | "Medium" | "Hard"> = {
    0: "Easy",
    1: "Medium",
    2: "Hard",
  };

  return (
    <div className="flex h-[calc(100vh-60px)] flex-col overflow-hidden bg-[#f1f5f9]">
      <ProblemHeader title={`${problem.id}. ${problem.title}`} />
      
      <main className="flex flex-1 min-h-0 gap-4 p-4">
        {/* Left Column: Tabs & Content (40%) */}
        <div className="flex flex-col flex-[4] min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Tab Headers */}
          <div className="flex items-center border-b border-slate-100 bg-slate-50/50 px-2">
            <TabButton 
              active={activeTab === "description"} 
              onClick={() => setActiveTab("description")}
              icon={<FileText className="size-3.5" />}
              label="Mô tả"
            />
            <TabButton 
              active={activeTab === "editorial"} 
              onClick={() => setActiveTab("editorial")}
              icon={<MessageSquare className="size-3.5" />}
              label="Lời giải"
            />
            <TabButton 
              active={activeTab === "submissions"} 
              onClick={() => setActiveTab("submissions")}
              icon={<History className="size-3.5" />}
              label="Lịch sử nộp bài"
            />
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === "description" && (
              <DecriptionQuestion
                title={problem.title}
                difficulty={difficultyMap[problem.difficulty] || "Medium"}
                description={problem.description}
                examples={problem.examples?.length ? problem.examples : (problem.testCases?.map(tc => ({
                  input: tc.input,
                  output: tc.expectedOutput
                })) || [])}
                constraints={problem.constraints?.map(c => c.content) || []} 
              />
            )}
            {activeTab === "editorial" && <EditorialTab problem={problem} />}
            {activeTab === "submissions" && (
              <SubmissionsTab 
                problem={problem} 
                onViewSubmission={handleViewSubmission} 
              />
            )}
          </div>

        </div>

        {/* Right Column: Code Editor (60%) */}
        <div className="flex flex-col flex-[6] min-w-0">
          <CodeEditor 
            value={code} 
            onChange={setCode}
            language={language}
            onLanguageChange={(newLang) => {
              setLanguage(newLang);
              if (problem?.codeTemplates) {
                const template = problem.codeTemplates.find(t => t.language === newLang);
                setCode(template?.starterCode || "");
              }
            }}
            onRun={handleRun}
            onSubmit={handleSubmit}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
            runResult={runResult}
            showConsole={showConsole}
            setShowConsole={setShowConsole}
          />
        </div>
      </main>
    </div>
  );
}

