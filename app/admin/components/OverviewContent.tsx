"use client";

import { TrendingUp } from "lucide-react";
import StatCard from "@/components/common/StatCard";
import { DifficultyChart } from "./DifficultyChart";
import { ResultDistributionChart } from "./ResultDistributionChart";
import SubmissionTrendChart from "./SubmissionTrendChart";

export function OverviewContent({
  stats,
  difficultyData,
}: {
  stats: {
    totalUsers: number;
    totalProblems: number;
    totalSubmissions: number;
    acRate?: number;
    submissionTrend?: { date: string; total: number; accepted: number }[];
    resultDistribution?: { status: string; count: number }[];
    topProblems?: { id: string; title: string; slug: string; difficulty: number; submissionCount: number; acceptedCount: number; acceptanceRate: number }[];
  };
  difficultyData: { name: string; value: number; color: string }[];
}) {
  const acRate = stats.acRate ?? 0;

  const diffLabel = (d: number) => d === 0 ? "Easy" : d === 1 ? "Medium" : "Hard";
  const diffColor = (d: number) => d === 0 ? "text-green-600" : d === 1 ? "text-amber-600" : "text-red-500";

  return (
    <div className="space-y-6">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
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
          subtitle="lượt submit"
          color="bg-purple-500"
        />
        <StatCard
          title="AC Rate"
          value={`${acRate}%`}
          subtitle="tỉ lệ chấp nhận"
          color="bg-emerald-500"
        />
      </div>

      {/* Submission Trend (Line Chart) - Full width */}
      <SubmissionTrendChart data={stats.submissionTrend || []} />

      {/* Two Pie Charts side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DifficultyChart data={difficultyData} />
        <ResultDistributionChart data={stats.resultDistribution || []} />
      </div>

      {/* Top 10 Most Solved Problems */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="size-4 text-rose-500" />
          <h3 className="text-sm font-semibold text-gray-700">Top 10 Most Solved Problems</h3>
        </div>
        {stats.topProblems && stats.topProblems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-2 pr-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-8">#</th>
                  <th className="pb-2 pr-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Title</th>
                  <th className="pb-2 pr-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Difficulty</th>
                  <th className="pb-2 pr-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Submissions</th>
                  <th className="pb-2 pr-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Accepted</th>
                  <th className="pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">AC Rate</th>
                </tr>
              </thead>
              <tbody>
                {stats.topProblems.map((p, i) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-2.5 pr-4 text-xs text-gray-400 font-mono">{i + 1}</td>
                    <td className="py-2.5 pr-4 font-medium text-gray-800">{p.title}</td>
                    <td className="py-2.5 pr-4">
                      <span className={`text-xs font-semibold ${diffColor(p.difficulty)}`}>
                        {diffLabel(p.difficulty)}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-right text-xs text-gray-600">{p.submissionCount}</td>
                    <td className="py-2.5 pr-4 text-right text-xs text-emerald-600 font-semibold">{p.acceptedCount}</td>
                    <td className="py-2.5 text-right text-xs font-semibold text-gray-700">{p.acceptanceRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-gray-400 py-6 text-center">Chưa có dữ liệu</p>
        )}
      </div>
    </div>
  );
}
