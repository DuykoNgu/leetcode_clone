"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Trophy, Shuffle, MessageCircleHeart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getRandomProblem } from "@/lib/api/problems";

interface RightSidebarProps {
  authUser: any;
}

export default function RightSidebar({ authUser }: RightSidebarProps) {
  const router = useRouter();
  const [isPicking, setIsPicking] = useState(false);

  // Hàm xử lý khi bấm nút Pick One
  const handlePickOne = async () => {
    setIsPicking(true);
    toast.loading("Đang tìm kiếm thử thách phù hợp...", { id: "pickOne" });
    try {
      const problemId = await getRandomProblem();
      if (problemId) {
        toast.success("Đã tìm thấy bài!", { id: "pickOne" });
        router.push(`/problems/${problemId}`);
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Lỗi khi tìm bài tập ngẫu nhiên";
      toast.error(errMsg, { id: "pickOne" });
    } finally {
      setIsPicking(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. THẺ STREAK (Khôi phục UI đẹp) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-slate-400">Streak</h3>
        
        <div className="mb-6 flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-orange-100 text-brand-orange">
            <Flame className="size-7 fill-brand-orange/20" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-900">{authUser?.streakDays || 0}</span>
              <span className="text-sm font-bold text-slate-500">Ngày</span>
            </div>
            <p className="text-xs font-medium text-brand-orange">Chuỗi nộp bài liên tiếp!</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 font-medium text-slate-600">
              <Trophy className="size-4 text-emerald-500" /> Đã giải quyết
            </span>
            <span className="font-bold text-slate-900">{authUser?.solvedCount || 0} bài</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-emerald-500 transition-all duration-1000" style={{ width: authUser?.solvedCount > 0 ? '45%' : '0%' }} />
          </div>
        </div>
      </div>

      {/* 2. THẺ PICK ONE */}
      <div className="group relative overflow-hidden rounded-2xl border border-brand-orange/20 bg-gradient-to-b from-orange-50/50 to-white p-6 shadow-sm transition-all hover:shadow-md">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand-orange text-white shadow-inner">
            <Shuffle className="size-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Pick One</h3>
        </div>
        <p className="mb-5 text-sm font-medium text-slate-600">
          Không biết nên bắt đầu từ đâu? Hãy để hệ thống chọn ngẫu nhiên một thử thách cho bạn.
        </p>
        <Button 
          onClick={handlePickOne} 
          disabled={isPicking} // <--- Khóa nút khi đang load
          className="w-full bg-slate-900 font-bold text-white transition-all hover:bg-brand-orange hover:shadow-lg hover:shadow-orange-500/20 disabled:opacity-70"
        >
          {isPicking ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          {isPicking ? "Đang xóc đĩa..." : "Chọn bài ngẫu nhiên"}
        </Button>
      </div>

      {/* 3. THẺ DISCUSS NOW (Thiết kế mới theo màu Xanh lá) */}
      <div className="group relative overflow-hidden rounded-2xl border border-emerald-200/50 bg-gradient-to-b from-emerald-50/50 to-white p-6 shadow-sm transition-all hover:shadow-md">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-inner">
            <MessageCircleHeart className="size-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Discuss Now</h3>
        </div>
        <p className="mb-5 text-sm font-medium text-slate-600">
          Chia sẻ kinh nghiệm phỏng vấn, hỏi đáp thuật toán và tìm kiếm giải pháp từ cộng đồng.
        </p>
        <Button 
          variant="outline"
          onClick={() => router.push('/discuss')} 
          className="w-full border-emerald-500 text-emerald-600 font-bold transition-all hover:bg-emerald-500 hover:text-white"
        >
          Tham gia thảo luận
        </Button>
      </div>

    </div>
  );
}