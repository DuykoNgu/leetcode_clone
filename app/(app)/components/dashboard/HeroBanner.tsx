"use client";

import { useRouter } from "next/navigation";
import { Trophy, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroBannerProps {
  isAdmin: boolean;
}

export default function HeroBanner({ isAdmin }: HeroBannerProps) {
  const router = useRouter();

  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-xl group">
      {/* Hiệu ứng ánh sáng trang trí (Background Glow) */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-orange/20 blur-[80px] pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-blue-500/20 blur-[60px] pointer-events-none" />

      {/* Nút thao tác của Admin (Chỉ hiện khi là Admin & Hover vào Banner) */}
      {isAdmin && (
        <div className="absolute right-4 top-4 flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 z-10">
          <Button variant="outline" size="icon" className="h-8 w-8 bg-white/10 text-white hover:bg-white/20 hover:text-white border-none backdrop-blur-sm">
            <Pencil className="size-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 bg-white/10 text-white hover:bg-red-500/80 hover:text-white border-none backdrop-blur-sm">
            <X className="size-4" />
          </Button>
        </div>
      )}

      {/* Nội dung chính */}
      <div className="relative z-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 cursor-pointer" onClick={() => router.push('/contest')}>
          <div className="mb-2 flex items-center gap-2">
            <Trophy className="size-5 text-brand-orange" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-brand-orange">
              Thi đấu LeetCode
            </h2>
          </div>
          <h3 className="mb-2 text-2xl font-extrabold text-white sm:text-3xl">
            Cuộc thi thuật toán hằng tuần.
          </h3>
          <p className="text-sm font-medium text-slate-300 sm:text-base">
            Tranh tài cùng hàng ngàn lập trình viên và thăng hạng trên bảng xếp hạng toàn cầu!
          </p>
        </div>

        {/* Nút Tham gia thi đấu */}
        <div className="mt-4 shrink-0 sm:mt-0">
          <Button 
            onClick={() => router.push('/contest')}
            className="rounded-xl bg-white px-6 py-5 text-sm font-bold text-slate-900 shadow-lg transition-all hover:bg-slate-100 hover:shadow-white/20 active:scale-95"
          >
            <Trophy className="mr-2 size-4 fill-slate-900" />
            Tham gia ngay
          </Button>
        </div>
      </div>
    </div>
  );
}