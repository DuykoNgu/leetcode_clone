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
  const { isAuthenticated } = useAuth();

  const effectiveSearch = searchQuery || debouncedSearch;
  const effectiveCategory = categoryFilter || localCategory;
  const effectiveDifficulty = difficultyFilter || localDifficulty;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          search: effectiveSearch,
          category: effectiveCategory === "all-code-essentials" ? undefined : effectiveCategory,
          difficulty: effectiveDifficulty || undefined,
        };
        const response = await getProblems(params);
        const apiData = response.data;
        
        if (response.userStats) {
          setUserStats(response.userStats);
        }

        const difficultyMap: Record<number, "Easy" | "Medium" | "Hard"> = {
          0: "Easy",
          1: "Medium",
          2: "Hard",
        };
        
        const solvedIds = new Set<string>();
        const mappedData: DBProblem[] = apiData.map((problem: any) => {
          if (problem.isSolved) {
            solvedIds.add(problem.id);
          }
          return {
            id: problem.id,
            title: problem.title,
            difficulty: difficultyMap[problem.difficulty] || "Medium",
            category: "algorithms",
            order: 0,
            acceptanceRate: Number(problem.acceptanceRate),
            createdAt: problem.createdAt,
            isSolved: problem.isSolved
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
  }, [isAuthenticated, effectiveSearch, effectiveCategory, effectiveDifficulty]);


  const filteredProblems = useMemo(() => {
    return [...problems].sort((a, b) => {
      if (sortBy === "default") {
        return (a.order ?? 0) - (b.order ?? 0);
      }

      if (sortBy === "difficulty") {
        const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
        const comparison = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        return sortDirection === "asc" ? comparison : -comparison;
      }

      if (sortBy === "acceptance") {
        const acceptanceA = a.acceptanceRate ?? 50;
        const acceptanceB = b.acceptanceRate ?? 50;
        const comparison = acceptanceA - acceptanceB;
        return sortDirection === "asc" ? comparison : -comparison;
      }

      return 0;
    });
  }, [problems, effectiveSearch, effectiveCategory, effectiveDifficulty, sortBy, sortDirection]);

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
            totalCount={problems.length}
            solvedProblemIds={solvedProblemIds}
            onProblemSelect={onProblemSelect || (() => {})}
            isAuthenticated={isAuthenticated}
            userStats={userStats}
          />
        </div>
      </div>
    </div>
  );
}