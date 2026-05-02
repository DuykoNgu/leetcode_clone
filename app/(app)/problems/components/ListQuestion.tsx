"use client";

import { useState, useMemo, useEffect } from "react";
import { MOCK_PROBLEMS, CATEGORIES } from "@/lib/data/mock-problems";
import type { DBProblem, ProblemCategory } from "@/lib/types";
import { Search } from "lucide-react";

type SortOption = "default" | "difficulty" | "acceptance";
type SortDirection = "asc" | "desc";

type ListQuestionProps = {
  searchQuery?: string;
  categoryFilter?: ProblemCategory;
  difficultyFilter?: string;
  onProblemSelect?: (problemId: string) => void;
};

export default function ListQuestion({
  searchQuery = "",
  categoryFilter = "algorithms",
  difficultyFilter,
  onProblemSelect,
}: ListQuestionProps) {
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [localSearch, setLocalSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [localCategory, setLocalCategory] = useState<ProblemCategory>("algorithms");
  const [localDifficulty, setLocalDifficulty] = useState<string>("");
  const [solvedProblemIds, setSolvedProblemIds] = useState<Set<string>>(new Set());

  const effectiveSearch = searchQuery || localSearch;
  const effectiveCategory = categoryFilter || localCategory;
  const effectiveDifficulty = difficultyFilter || localDifficulty;

  useEffect(() => {
    const saved = localStorage.getItem("leetcode_solved_problems");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as string[];
        setSolvedProblemIds(new Set(parsed));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  const filteredProblems = useMemo(() => {
    let filtered = MOCK_PROBLEMS.filter((problem) => {
      if (effectiveCategory !== "all-code-essentials") {
        if (effectiveCategory !== "algorithms") return true;
      }

      if (effectiveSearch) {
        const searchLower = effectiveSearch.toLowerCase();
        if (!problem.title.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      if (effectiveDifficulty && problem.difficulty !== effectiveDifficulty) {
        return false;
      }

      return true;
    });

    filtered.sort((a, b) => {
      if (sortBy === "default") {
        return a.order - b.order;
      }

      if (sortBy === "difficulty") {
        const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
        const comparison = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        return sortDirection === "asc" ? comparison : -comparison;
      }

      if (sortBy === "acceptance") {
        const acceptanceA = Math.random() * 40 + 30;
        const acceptanceB = Math.random() * 40 + 30;
        const comparison = acceptanceA - acceptanceB;
        return sortDirection === "asc" ? comparison : -comparison;
      }

      return 0;
    });

    return filtered;
  }, [effectiveSearch, effectiveCategory, effectiveDifficulty, sortBy, sortDirection]);

  const toggleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(option);
      setSortDirection("asc");
    }
  };

  const handleCategoryChange = (category: ProblemCategory) => {
    setLocalCategory(category);
  };

  const handleDifficultyChange = (difficulty: string) => {
    setLocalDifficulty(difficulty === localDifficulty ? "" : difficulty);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
<div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
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
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-64 rounded border px-3 py-2 text-sm outline-none"
                  autoFocus
                />
              </div>
            </div>

            <select
              value={localCategory}
              onChange={(e) => handleCategoryChange(e.target.value as ProblemCategory)}
              className="p-2 text-sm text-gray-700 outline-none"
              style={{ background: "transparent" }}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value} className="bg-white">
                  {cat.label}
                </option>
              ))}
            </select>
            
            {/* Difficulty filter inline */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Difficulty:</span>
              {(["Easy", "Medium", "Hard"] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => handleDifficultyChange(diff)}
                  className={`px-2 py-0.5 text-xs ${
                    localDifficulty === diff ? "font-bold" : ""
                  }`}
                  style={{ background: "transparent" }}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Sort inline */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Sort:</span>
              {(["default", "difficulty", "acceptance"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => toggleSort(opt)}
                  className="px-2 py-0.5 text-xs"
                  style={{ background: "transparent" }}
                >
                  {opt} {sortBy === opt && (sortDirection === "asc" ? "↑" : "↓")}
                </button>
              ))}
            </div>
          </div>
            </div>

            <select
              value={localCategory}
              onChange={(e) => handleCategoryChange(e.target.value as ProblemCategory)}
              className="p-2 text-sm text-gray-700 outline-none"
              style={{ background: "transparent" }}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value} className="bg-white">
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500">Difficulty:</span>
            {(["Easy", "Medium", "Hard"] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => handleDifficultyChange(diff)}
                className={`px-2 py-0.5 text-xs ${
                  localDifficulty === diff ? "font-bold" : ""
                }`}
                style={{ background: "transparent" }}
              >
                {diff}
              </button>
            ))}
            <span className="text-xs text-gray-500">Sort:</span>
            {(["default", "difficulty", "acceptance"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => toggleSort(opt)}
                className="px-2 py-0.5 text-xs"
                style={{ background: "transparent" }}
              >
                {opt} {sortBy === opt && (sortDirection === "asc" ? "↑" : "↓")}
              </button>
            ))}
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="w-12 px-4 py-3 text-left font-semibold">#</th>
              <th className="px-4 py-3 text-left font-semibold">Title</th>
              <th className="px-4 py-3 text-left font-semibold">Acceptance</th>
              <th className="px-4 py-3 text-left font-semibold">Difficulty</th>
              <th className="w-24 px-4 py-3 text-left font-semibold">Video</th>
            </tr>
          </thead>
          <tbody>
            {filteredProblems.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-500">
                  No problems found
                </td>
              </tr>
            ) : (
              filteredProblems.map((problem, index) => (
                <tr
                  key={problem.id}
                  className="cursor-pointer"
                  onClick={() => onProblemSelect?.(problem.id)}
                >
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                    {index + 1}
                    {solvedProblemIds.has(problem.id) && (
                      <span className="ml-1 text-emerald-500">✓</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{problem.title}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {(Math.random() * 40 + 30).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${
                        problem.difficulty === "Easy"
                          ? "text-emerald-600"
                          : problem.difficulty === "Medium"
                          ? "text-amber-600"
                          : "text-rose-600"
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {problem.videoId ? (
                      <span className="text-red-600">●</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="px-4 py-2 text-xs text-gray-500">
          Showing {filteredProblems.length} of {MOCK_PROBLEMS.length} problems
        </div>
      </div>
    </div>
  );
}
