"use client";

import type { DBProblem } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, Lock, Play } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import StatCard from "@/components/common/StatCard";

type TableQuestionProps = {
  problems: DBProblem[];
  totalCount: number;
  solvedProblemIds: Set<string>;
  onProblemSelect: (problemId: string) => void;
  isAuthenticated?: boolean;
  userStats?: {
    solvedCount: number;
    streakDays: number;
  };
};

const difficultyStyles: Record<string, string> = {
  Easy: "bg-emerald-50 text-emerald-600 border-none",
  Medium: "bg-amber-50 text-amber-600 border-none",
  Hard: "bg-rose-50 text-rose-600 border-none",
};

export default function TableQuestion({
  problems,
  totalCount,
  solvedProblemIds,
  onProblemSelect,
  isAuthenticated = true,
  userStats,
}: TableQuestionProps) {
  const router = useRouter();
  const solvedCount = solvedProblemIds.size;

  const handleProblemSelect = (problemId: string) => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để tiếp tục");
      const currentPath = window.location.pathname;
      const targetPath = `/problems/${problemId}`;
      window.history.pushState(
        null,
        "",
        `${currentPath}?showLogin=true&redirectTo=${targetPath}`,
      );
      return;
    }
    router.push(`/problems/${problemId}`);
    onProblemSelect(problemId);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      {isAuthenticated ? (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard
            title="Tổng số bài tập"
            value={totalCount.toString()}
            subtitle="Dành riêng cho bạn"
            color="bg-blue-500"
          />
          <StatCard
            title="Đã giải"
            value={(userStats?.solvedCount ?? solvedCount).toString()}
            subtitle={`Hoàn thành ${totalCount > 0 ? Math.round(((userStats?.solvedCount ?? solvedCount) / totalCount) * 100) : 0}%`}
            color="bg-emerald-500"
          />
          <StatCard
            title="Chuỗi ngày học"
            value={`${userStats?.streakDays ?? 0} Ngày`}
            subtitle="Tiếp tục phát huy!"
            color="bg-orange-500"
          />
        </div>
      ) : (
        <></>
      )}
      {/* Table Section */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-slate-100 bg-slate-50/50">
              <TableHead className="w-16 h-12 text-[11px] font-bold uppercase tracking-wider text-slate-400 pl-6">
                Trạng thái
              </TableHead>
              <TableHead className="h-12 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Tiêu đề
              </TableHead>
              <TableHead className="w-40 h-12 text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
                Tỷ lệ giải
              </TableHead>
              <TableHead className="w-32 h-12 text-[11px] font-bold uppercase tracking-wider text-slate-400 text-right pr-8">
                Độ khó
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {problems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                    <div className="p-4 rounded-full bg-slate-50">
                      <Lock className="size-8" />
                    </div>
                    <p className="text-sm font-medium">
                      Không tìm thấy bài tập nào phù hợp
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              problems.map((problem, index) => {
                const solved = solvedProblemIds.has(problem.id);

                return (
                  <TableRow
                    key={problem.id}
                    onClick={() => handleProblemSelect(problem.id)}
                    className={cn(
                      "group cursor-pointer border-b border-slate-50 transition-all hover:bg-slate-50/80",
                      index % 2 === 1 && "bg-slate-50/20",
                    )}
                  >
                    <TableCell className="py-4 pl-6">
                      {solved ? (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-300 group-hover:bg-brand-orange/10 group-hover:text-brand-orange transition-colors">
                          <Play className="h-3 w-3 fill-current" />
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="text-[15px] font-semibold text-slate-700 group-hover:text-brand-orange transition-colors">
                          {index + 1}. {problem.title}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          Thuật toán
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-brand-orange shadow-[0_0_8px_rgba(255,161,22,0.4)]"
                            style={{ width: `${problem.acceptanceRate ?? 0}%` }}
                          />
                        </div>
                        <span className="text-[12px] font-bold text-slate-500">
                          {problem.acceptanceRate?.toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="py-4 text-right pr-8">
                      <Badge
                        className={cn(
                          "px-3 py-1 rounded-lg font-bold shadow-sm",
                          difficultyStyles[problem.difficulty],
                        )}
                      >
                        {problem.difficulty === 'Easy' ? 'Dễ' : problem.difficulty === 'Medium' ? 'Trung bình' : 'Khó'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
