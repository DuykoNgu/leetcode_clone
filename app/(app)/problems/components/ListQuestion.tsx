"use client";

import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getProblems } from "@/lib/api/problems";
import { MOCK_PROBLEMS } from "@/lib/data/mock-problems";
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
  const [showSearch, setShowSearch] = useState(false);
  const [localCategory, setLocalCategory] = useState<ProblemCategory>("algorithms");
  const [localDifficulty, setLocalDifficulty] = useState<string>("");
  const [solvedProblemIds, setSolvedProblemIds] = useState<Set<string>>(new Set());
  const [problems, setProblems] = useState<DBProblem[]>([]);
  const { isAuthenticated } = useAuth();

  const effectiveSearch = searchQuery || localSearch;
  const effectiveCategory = categoryFilter || localCategory;
  const effectiveDifficulty = difficultyFilter || localDifficulty;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiData = await getProblems();
        const difficultyMap: Record<number, "Easy" | "Medium" | "Hard"> = {
          0: "Easy",
          1: "Medium",
          2: "Hard",
        };
        const mappedData: DBProblem[] = apiData.map((problem) => ({
          id: problem.id,
          title: problem.title,
          difficulty: difficultyMap[problem.difficulty] || "Medium",
          category: "algorithms",
          order: 0,
          acceptanceRate: Number(problem.acceptanceRate), // Convert string to number
          createdAt: problem.createdAt,
        }));
        setProblems(mappedData);
      } catch (error) {
        console.error("Failed to fetch problems, using mock data:", error);
        setProblems(MOCK_PROBLEMS);
      }
    };
    fetchData();
  }, []);

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
    const filtered = problems.filter((problem) => {
      if (effectiveCategory !== "all-code-essentials" && effectiveCategory !== "algorithms") {
        if (problem.category !== effectiveCategory) return false;
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

    return [...filtered].sort((a, b) => {
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
    <div className="flex h-full flex-col">
      <FilterSection
        filterState={filterState}
        onSearchChange={setLocalSearch}
        onShowSearchToggle={() => setShowSearch(!showSearch)}
        onCategoryChange={handleCategoryChange}
        onDifficultyChange={handleDifficultyChange}
        onSortToggle={toggleSort}
      />

      <div className="flex-1 overflow-y-auto">
        <TableQuestion
          problems={filteredProblems}
          totalCount={problems.length}
          solvedProblemIds={solvedProblemIds}
          onProblemSelect={onProblemSelect || (() => {})}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </div>
  );
}