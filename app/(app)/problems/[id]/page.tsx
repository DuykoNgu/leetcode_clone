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
import { cn } from "@/lib/utils";

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
            {activeTab === "description" && (
              <DecriptionQuestion
                title={problem.title}
                difficulty={difficultyMap[problem.difficulty] || "Medium"}
                description={problem.description}
                examples={problem.testCases?.map(tc => ({
                  input: tc.input,
                  output: tc.expectedOutput
                })) || []}
                constraints={[]} 
              />
            )}
            {activeTab === "editorial" && (
              <div className="h-full overflow-y-auto p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-6 w-1 rounded-full bg-brand-orange" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Official Solution</h2>
                </div>
                {problem.codeTemplates?.find(t => t.solutionCode)?.solutionCode ? (
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <pre className="font-mono text-sm text-slate-700 whitespace-pre-wrap">
                      {problem.codeTemplates.find(t => t.solutionCode)?.solutionCode}
                    </pre>
                  </div>
                ) : (
                  <div className="flex h-40 flex-col items-center justify-center text-slate-400 italic">
                    <p>No official solution available yet.</p>
                  </div>
                )}
              </div>
            )}
            {activeTab === "submissions" && (
              <div className="h-full overflow-y-auto p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-6 w-1 rounded-full bg-brand-orange" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">Your Recent Submissions</h2>
                </div>
                {problem.submissions && problem.submissions.length > 0 ? (
                  <div className="space-y-3">
                    {problem.submissions.map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                        <div className="flex flex-col gap-1">
                          <span className={cn(
                            "text-sm font-bold",
                            sub.status === "accepted" ? "text-emerald-600" : "text-rose-600"
                          )}>
                            {sub.status === "accepted" ? "Accepted" : sub.status.replace("_", " ")}
                          </span>
                          <span className="text-xs text-slate-400">
                            {new Date(sub.submittedAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                          <span>{sub.language}</span>
                          {sub.runtimeMs && <span>{sub.runtimeMs}ms</span>}
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
            )}
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

function TabButton({ 
  active, 
  onClick, 
  icon, 
  label 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string 
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-all",
        active 
          ? "border-brand-orange text-slate-900 bg-white" 
          : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
