"use client";

import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/line-charts-1";
import { BarChart3 } from "lucide-react";

const chartConfig = {};

export function DifficultyChart({
  data,
}: {
  data: { name: string; value: number; color: string }[];
}) {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="size-4 text-green-500" />
        <h3 className="text-sm font-semibold text-gray-700">Problem Difficulty</h3>
      </div>

      <ChartContainer config={chartConfig} className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent formatter={(value: unknown) => <span className="font-bold">{String(value)} bài</span>} />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="flex items-center justify-center gap-5 mt-2">
        {data.map((d) => (
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
