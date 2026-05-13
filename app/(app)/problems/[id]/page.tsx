"use client";

import { useEffect, useState, use } from "react";
import { getProblemDetail } from "@/lib/api/problems";
import { ApiProblem } from "@/lib/types";
import DecriptionQuestion from "../components/DecriptionQuestion";
import CodeEditor from "../components/CodeEditor";
import ProblemHeader from "../components/ProblemHeader";
import { Loader2, MessageSquare, History, FileText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { EditorialTab, SubmissionsTab, TabButton } from "../../../../components/common/TabButton";

type Tab = "description" | "editorial" | "submissions";

export default function ProblemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [problem, setProblem] = useState<ApiProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("description");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/problems?showLogin=true");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    const fetchDetail = async () => {
      try {
        const data = await getProblemDetail(id);
        setProblem(data);
        
        const jsTemplate = data.codeTemplates?.find(t => t.language === "javascript");
        if (jsTemplate) {
          setCode(jsTemplate.starterCode);
        }
      } catch (err) {
        console.error("Failed to fetch problem detail:", err);
        setError("Không thể tải thông tin bài tập.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, isAuthenticated, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="flex h-[calc(100vh-60px)] items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-brand-orange" />
          <p className="text-sm font-medium text-slate-400 animate-pulse">Loading problem...</p>
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
          Back to problem list
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
              label="Description"
            />
            <TabButton 
              active={activeTab === "editorial"} 
              onClick={() => setActiveTab("editorial")}
              icon={<MessageSquare className="size-3.5" />}
              label="Editorial"
            />
            <TabButton 
              active={activeTab === "submissions"} 
              onClick={() => setActiveTab("submissions")}
              icon={<History className="size-3.5" />}
              label="Submissions"
            />
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === "description" && (() => {
              let parsedDescription = { des: problem.description, example: [], condition: [] };
              try {
                // Kiểm tra nếu description là chuỗi JSON
                if (problem.description.startsWith("{") && problem.description.endsWith("}")) {
                  const structured = JSON.parse(problem.description);
                  parsedDescription = {
                    des: structured.des || problem.description,
                    example: structured.example || [],
                    condition: structured.condition || []
                  };
                }
              } catch (e) {
                console.warn("Description is not a JSON string, using raw text.");
              }

              return (
                <DecriptionQuestion
                  title={problem.title}
                  difficulty={difficultyMap[problem.difficulty] || "Medium"}
                  description={parsedDescription.des}
                  examples={parsedDescription.example.length > 0 ? parsedDescription.example : (problem.testCases?.map(tc => ({
                    input: tc.input,
                    output: tc.expectedOutput
                  })) || [])}
                  constraints={parsedDescription.condition} 
                />
              );
            })()}
            {activeTab === "editorial" && <EditorialTab problem={problem} />}
            {activeTab === "submissions" && <SubmissionsTab problem={problem} />}
          </div>

        </div>

        {/* Right Column: Code Editor (60%) */}
        <div className="flex flex-col flex-[6] min-w-0">
          <CodeEditor 
            value={code} 
            onChange={setCode}
            language="javascript" 
          />
        </div>
      </main>
    </div>
  );
}

