"use client";

import { CATEGORIES } from "@/lib/constants/problems";
import type { ProblemCategory } from "@/lib/types";
import { Search, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

type SortOption = "default" | "difficulty" | "acceptance";
type SortDirection = "asc" | "desc";

export type FilterState = {
  localSearch: string;
  showSearch: boolean;
  localCategory: ProblemCategory;
  localDifficulty: string;
  sortBy: SortOption;
  sortDirection: SortDirection;
  solvedProblemIds: Set<string>;
};

interface FilterSectionProps {
  filterState: FilterState;
  onSearchChange: (value: string) => void;
  onShowSearchToggle: () => void;
  onCategoryChange: (category: ProblemCategory) => void;
  onDifficultyChange: (difficulty: string) => void;
  onSortToggle: (option: SortOption) => void;
}

export default function FilterSection({
  filterState,
  onSearchChange,
  onShowSearchToggle,
  onCategoryChange,
  onDifficultyChange,
  onSortToggle,
}: FilterSectionProps) {
  const {
    localSearch,
    localCategory,
    localDifficulty,
    sortBy,
    sortDirection,
  } = filterState;

  return (
    <div className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 px-6 py-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Top Row: Search and Quick Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative group w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-brand-orange transition-colors" />
            <input
              type="text"
              placeholder="Tìm kiếm bài tập, chủ đề..."
              value={localSearch}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/5 transition-all"
            />
          </div>
        </div>

        {/* Bottom Row: Categories and Sorting */}
        <div className="flex flex-wrap items-center gap-6">
          {/* Categories */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            {CATEGORIES.slice(0, 5).map((cat) => (
              <button
                type="button"
                key={cat.value}
                onClick={() => onCategoryChange(cat.value as ProblemCategory)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                  localCategory === cat.value 
                    ? "bg-white text-slate-900 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-200" />

          {/* Difficulty Toggles */}
          <div className="flex items-center gap-2">
            {(["Easy", "Medium", "Hard"] as const).map((diff) => (
              <button
                type="button"
                key={diff}
                onClick={() => onDifficultyChange(diff)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
                  localDifficulty === diff 
                    ? "bg-slate-900 border-slate-900 text-white" 
                    : "border-slate-200 text-slate-500 hover:border-slate-400"
                )}
              >
                {diff === "Easy" ? "Dễ" : diff === "Medium" ? "Trung bình" : "Khó"}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-200" />

          {/* Sort Menu */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sắp xếp theo</span>
            <div className="flex items-center gap-1">
              {(["difficulty", "acceptance"] as const).map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => onSortToggle(opt)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                    sortBy === opt 
                      ? "bg-brand-orange/10 text-brand-orange" 
                      : "text-slate-500 hover:bg-slate-100"
                  )}
                >
                  {opt === "difficulty" ? "Độ khó" : "Tỷ lệ giải"}
                  {sortBy === opt && (
                    <ArrowUpDown className={cn("size-3 transition-transform", sortDirection === "desc" && "rotate-180")} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
