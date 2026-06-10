"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/line-charts-1";
import { TrendingUp } from "lucide-react";

const chartConfig = {
  total: { label: "Tổng submissions" },
  accepted: { label: "Accepted" },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function SubmissionTrendChart({ data }: { data: { date: string; total: number; accepted: number }[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="size-4 text-blue-500" />
          <h3 className="text-sm font-semibold text-gray-700">Submissions 7 ngày gần nhất</h3>
        </div>
        <p className="text-xs text-gray-400 py-8 text-center">Chưa có dữ liệu</p>
      </div>
    );
  }

  const chartData = data.map((d) => ({ ...d, dateLabel: formatDate(d.date) }));
  const totalSubmissions = data.reduce((s, d) => s + d.total, 0);
  const totalAccepted = data.reduce((s, d) => s + d.accepted, 0);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-blue-500" />
          <h3 className="text-sm font-semibold text-gray-700">Submissions 7 ngày gần nhất</h3>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-blue-500" /> Tổng: {totalSubmissions}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-emerald-500" /> AC: {totalAccepted}
          </span>
        </div>
      </div>

      <ChartContainer config={chartConfig} className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="dateLabel"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              allowDecimals={false}
            />
            <ChartTooltip
              content={<ChartTooltipContent formatter={(value: unknown) => <span className="font-bold">{String(value)}</span>} />}
              cursor={{ fill: "#f1f5f9", opacity: 0.5 }}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey="accepted"
              stroke="#22c55e"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#22c55e", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#22c55e", strokeWidth: 2, stroke: "#fff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
