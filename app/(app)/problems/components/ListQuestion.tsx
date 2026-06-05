"use client";

import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { getProblems } from "@/lib/api/problems";
import type { DBProblem, ProblemCategory } from "@/lib/types";
import FilterSection, { FilterState } from "./FilterSection";
import TableQuestion from "./TableQuestion";

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
  const debouncedSearch = useDebounce(localSearch, 500);
  const [showSearch, setShowSearch] = useState(false);
  const [localCategory, setLocalCategory] = useState<ProblemCategory>("algorithms");
  const [localDifficulty, setLocalDifficulty] = useState<string>("");
  const [solvedProblemIds, setSolvedProblemIds] = useState<Set<string>>(new Set());
  const [problems, setProblems] = useState<DBProblem[]>([]);
  const [userStats, setUserStats] = useState({ solvedCount: 0, streakDays: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const { isAuthenticated } = useAuth();

  const effectiveSearch = searchQuery || debouncedSearch;
  const effectiveCategory = categoryFilter || localCategory;
  const effectiveDifficulty = difficultyFilter || localDifficulty;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sortFieldMap: Record<string, string> = {
          default: "id",
          difficulty: "difficulty",
          acceptance: "acceptanceRate",
        };
        const params: any = {
          category: effectiveCategory === "all-code-essentials" ? undefined : effectiveCategory,
          difficulty: effectiveDifficulty || undefined,
          page,
          limit: 50,
          sortBy: sortFieldMap[sortBy],
          sortOrder: sortDirection,
        };
        const response = await getProblems(params);

        if (response.userStats) {
          setUserStats(response.userStats);
        }
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages);
          setTotalCount(response.pagination.total);
        }

        const difficultyMap: Record<number, "Easy" | "Medium" | "Hard"> = {
          0: "Easy",
          1: "Medium",
          2: "Hard",
        };

        const solvedIds = new Set<string>();
        const mappedData: DBProblem[] = response.data.map((problem: any) => {
          if (problem.isSolved) solvedIds.add(problem.id);
          return {
            id: problem.id,
            title: problem.title,
            difficulty: difficultyMap[problem.difficulty] || "Medium",
            category: "algorithms",
            order: 0,
            acceptanceRate: Number(problem.acceptanceRate),
            createdAt: problem.createdAt,
            isSolved: problem.isSolved,
          };
        });

        setProblems(mappedData);
        setSolvedProblemIds(solvedIds);
      } catch (error) {
        console.error("Failed to fetch problems:", error);
        setProblems([]);
      }
    };
    fetchData();
  }, [isAuthenticated, effectiveSearch, effectiveCategory, effectiveDifficulty, page, sortBy, sortDirection]);

  useEffect(() => { setPage(1); }, [effectiveSearch, effectiveCategory, effectiveDifficulty, sortBy, sortDirection]);

  const filteredProblems = useMemo(() => {
    const q = effectiveSearch.toLowerCase();
    if (!q) return problems;
    return problems.filter((p) =>
      p.title.toLowerCase().includes(q) || p.id.includes(q)
    );
  }, [problems, effectiveSearch]);

  useEffect(() => { if (page > totalPages) setPage(totalPages || 1); }, [page, totalPages]);

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

  const filterState: FilterState = {
    localSearch,
    showSearch,
    localCategory,
    localDifficulty,
    sortBy,
    sortDirection,
    solvedProblemIds,
  };

  return (
    <div className="flex h-full flex-col bg-slate-50/50">
      <FilterSection
        filterState={filterState}
        onSearchChange={setLocalSearch}
        onShowSearchToggle={() => setShowSearch(!showSearch)}
        onCategoryChange={handleCategoryChange}
        onDifficultyChange={handleDifficultyChange}
        onSortToggle={toggleSort}
      />

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto py-4">
          <TableQuestion
            problems={filteredProblems}
            totalCount={totalCount}
            solvedProblemIds={solvedProblemIds}
            onProblemSelect={onProblemSelect || (() => {})}
            isAuthenticated={isAuthenticated}
            userStats={userStats}
            page={page}
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                .map((p, idx, arr) => (
                  <span key={p} className="flex items-center gap-1">
                    {idx > 0 && arr[idx - 1] !== p - 1 && <span className="text-slate-300 px-1">...</span>}
                    <button
                      onClick={() => setPage(p)}
                      className={`min-w-[32px] rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors ${
                        p === page
                          ? "bg-brand-orange text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
