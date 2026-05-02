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
import { Check } from "lucide-react";
import { toast } from "sonner";

type TableQuestionProps = {
  problems: DBProblem[];
  totalCount: number;
  solvedProblemIds: Set<string>;
  onProblemSelect: (problemId: string) => void;
  isAuthenticated?: boolean;
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
}: TableQuestionProps) {
  const solvedCount = solvedProblemIds.size;

  const handleProblemSelect = (problemId: string) => {
    if (!isAuthenticated) {
      toast.error("Bạn cần đăng nhập trước để làm bài này");
      return;
    }
    onProblemSelect(problemId);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header Section - Đưa ra ngoài Card */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-500 mb-1">
            Problem Set
          </p>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Curated coding questions
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
             {solvedCount} solved
           </div>
           <div className="px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-sm font-medium">
             {problems.length}/{totalCount} visible
           </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-slate-100">
              <TableHead className="w-16 text-[11px] font-bold uppercase text-slate-400">STT</TableHead>
              <TableHead className="text-[11px] font-bold uppercase text-slate-400">Title</TableHead>
              <TableHead className="w-40 text-[11px] font-bold uppercase text-slate-400 text-center">Acceptance</TableHead>
              <TableHead className="w-32 text-[11px] font-bold uppercase text-slate-400 text-right px-6">Difficulty</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {problems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-40 text-center text-slate-400">
                  No problems found
                </TableCell>
              </TableRow>
            ) : (
              problems.map((problem, index) => {
                const solved = solvedProblemIds.has(problem.id);

                return (
                  <TableRow
                    key={problem.id}
                    onClick={() => handleProblemSelect(problem.id)}
                    className="group cursor-pointer border-none hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell className="py-5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-400 w-6">
                          {index + 1}
                        </span>
                        {solved && (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                            <Check className="h-3 w-3" strokeWidth={4} />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell className="py-5">
                      <span className="text-base font-semibold text-slate-800 group-hover:text-orange-500 transition-colors">
                        {problem.title}
                      </span>
                    </TableCell>

                    <TableCell className="py-5">
                      <div className="flex items-center justify-center gap-3">
                        <div className="hidden md:block h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-orange-400"
                            style={{ width: `${problem.acceptanceRate ?? 0}%` }}
                          />
                        </div>
<span className="text-sm font-medium text-slate-500">
                          {problem.acceptanceRate !== undefined 
                            ? problem.acceptanceRate.toFixed(1) 
                            : (50 + (problem.order ?? 0) % 40).toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="py-5 text-right px-6">
                      <Badge className={cn("px-3 py-1 rounded-lg shadow-none", difficultyStyles[problem.difficulty])}>
                        {problem.difficulty}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer Section */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-6 px-2">
        <p className="text-sm text-slate-500">
          Showing <span className="font-bold text-slate-900">{problems.length}</span> of <span className="font-bold text-slate-900">{totalCount}</span> problems
        </p>
        <p className="text-sm font-medium text-slate-500">
          <span className="text-orange-500">{Math.round((solvedCount / totalCount) * 100)}%</span> solved
        </p>
      </div>
    </div>
  );
}