"use client";

import { useState, useEffect } from "react";
import { MOCK_PROBLEMS, CATEGORIES } from "@/lib/data/mock-problems";
import type { DBProblem, ProblemCategory } from "@/lib/types";
import { Search } from "lucide-react";

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
    showSearch,
    localCategory,
    localDifficulty,
    sortBy,
    sortDirection,
  } = filterState;

  return (
    <div className="p-3">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={onShowSearchToggle}
            className="shrink-0 p-2"
            style={{ background: "transparent" }}
          >
            <Search size={16} />
          </button>
          <div
            className={`transition-all duration-300 overflow-hidden ${
              showSearch ? "w-64 opacity-100" : "w-0 opacity-0"
            }`}
          >
            <input
              type="text"
              placeholder="Type to search..."
              value={localSearch}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-64 rounded border px-3 py-2 text-sm outline-none"
              autoFocus
            />
          </div>
        </div>

        <select
          value={localCategory}
          onChange={(e) => onCategoryChange(e.target.value as ProblemCategory)}
          className="p-2 text-sm text-gray-700 outline-none"
          style={{ background: "transparent" }}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value} className="bg-white">
              {cat.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Difficulty:</span>
          {(["Easy", "Medium", "Hard"] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => onDifficultyChange(diff)}
              className={`px-2 py-0.5 text-xs ${
                localDifficulty === diff ? "font-bold" : ""
              }`}
              style={{ background: "transparent" }}
            >
              {diff}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Sort:</span>
          {(["default", "difficulty", "acceptance"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => onSortToggle(opt)}
              className="px-2 py-0.5 text-xs"
              style={{ background: "transparent" }}
            >
              {opt} {sortBy === opt && (sortDirection === "asc" ? "↑" : "↓")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
