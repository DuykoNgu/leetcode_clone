"use client";

import ImportProblem from "./ImportProblem";
import StatCard from "@/components/common/StatCard";

export function OverviewContent({
  stats,
  onSwitchToScraper,
}: {
  stats: { totalUsers: number; totalProblems: number; totalSubmissions: number };
  onSwitchToScraper: () => void;
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

      <div className="md:col-span-3 p-8 border border-dashed rounded-xl border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-4 bg-white dark:bg-gray-900">
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Thêm bài từ LeetCode nhanh hoặc dùng{" "}
          <button
            onClick={onSwitchToScraper}
            className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:text-blue-800 dark:hover:text-blue-300"
          >
            Scraper Tool
          </button>{" "}
          để cào hàng loạt.
        </p>
        <ImportProblem />
      </div>
    </>
  );
}
