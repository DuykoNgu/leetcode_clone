"use client"
import { cn } from "@/lib/utils"

export default function StatCard({
  title,
  value,
  subtitle,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/40">
      <div className="flex items-center gap-4">
        <div className={cn("size-2 rounded-full animate-pulse", color)} />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
          {title}
        </span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-slate-900">{value}</span>
        <span className="text-xs font-medium text-slate-500">{subtitle}</span>
      </div>
    </div>
  );
}
