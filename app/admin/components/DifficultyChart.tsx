"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/line-charts-1";

const chartConfig = {
  value: {
    label: "Số lượng",
  },
};

export function DifficultyChart({
  data,
}: {
  data: { name: string; value: number; color: string }[];
}) {
  return (
    <div className="border rounded-xl border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-6">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">
        Phân bố độ khó câu hỏi
      </h3>
      <ChartContainer config={chartConfig} className="h-[250px] w-full">
        <BarChart
          data={data}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            allowDecimals={false}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value: unknown) => (
                  <span className="font-bold">{String(value)} bài</span>
                )}
              />
            }
            cursor={{ fill: "var(--muted)", opacity: 0.3 }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={80}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
