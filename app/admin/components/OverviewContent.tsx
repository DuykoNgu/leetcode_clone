"use client";

import ImportProblem from "./ImportProblem";
import StatCard from "@/components/common/StatCard";
import { DifficultyChart } from "./DifficultyChart";

export function OverviewContent({
  stats,
  difficultyData,
}: {
  stats: { totalUsers: number; totalProblems: number; totalSubmissions: number };
  difficultyData: { name: string; value: number; color: string }[];
}) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Người dùng"
          value={String(stats.totalUsers)}
          subtitle="tổng số"
          color="bg-blue-500"
        />
        <StatCard
          title="Câu hỏi"
          value={String(stats.totalProblems)}
          subtitle="tổng số"
          color="bg-green-500"
        />
        <StatCard
          title="Lượt giải"
          value={String(stats.totalSubmissions)}
          subtitle="tổng số"
          color="bg-purple-500"
        />
      </div>

      <DifficultyChart data={difficultyData} />

      <div className="mt-8 flex justify-center">
        <ImportProblem />
      </div>
    </>
  );
}
