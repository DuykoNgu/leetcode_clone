"use client";

import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/line-charts-1";
import { CheckCircle2 } from "lucide-react";

const chartConfig = {};

const RESULT_COLORS: Record<string, string> = {
  accepted: "#22c55e",
  wrong_answer: "#ef4444",
  time_limit_exceeded: "#eab308",
  runtime_error: "#f97316",
  compile_error: "#a855f7",
  memory_limit_exceeded: "#06b6d4",
  pending: "#94a3b8",
};

const RESULT_LABELS: Record<string, string> = {
  accepted: "Accepted",
  wrong_answer: "Wrong Answer",
  time_limit_exceeded: "TLE",
  runtime_error: "Runtime Error",
  compile_error: "Compile Error",
  memory_limit_exceeded: "MLE",
  pending: "Pending",
};

export function ResultDistributionChart({ data }: { data: { status: string; count: number }[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const chartData = data
    .filter((d) => d.count > 0)
    .map((d) => ({
      name: RESULT_LABELS[d.status] || d.status,
      value: d.count,
      color: RESULT_COLORS[d.status] || "#94a3b8",
    }));

  if (chartData.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="size-4 text-purple-500" />
          <h3 className="text-sm font-semibold text-gray-700">Submission Result</h3>
        </div>
        <p className="text-xs text-gray-400 py-8 text-center">Chưa có dữ liệu</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="size-4 text-purple-500" />
        <h3 className="text-sm font-semibold text-gray-700">Submission Result</h3>
      </div>

      <ChartContainer config={chartConfig} className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent formatter={(value: unknown) => <span className="font-bold">{String(value)} lượt</span>} />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              strokeWidth={0}
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 mt-2">
        {chartData.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-gray-500">{d.name}</span>
            <span className="font-bold text-gray-700">{d.value}</span>
            <span className="text-gray-400">({total > 0 ? Math.round((d.value / total) * 100) : 0}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
