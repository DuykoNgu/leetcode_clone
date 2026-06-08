"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Flame, Loader2, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDiscussions } from "@/lib/api/discuss";

export default function TrendingDiscuss() {
  const router = useRouter();
  const [hotDiscussions, setHotDiscussions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        // Lấy 20 bài mới nhất để sắp xếp lại cho chuẩn
        const res = await getDiscussions({ limit: 20 }); 
        
        if (res.success) {
          // THUẬT TOÁN SẮP XẾP TRỌNG SỐ TOÁN HỌC
          const sortedDiscussions = res.data.sort((a: any, b: any) => {
            const scoreA = (a.upvotes || 0) + (a._count?.comments || 0);
            const scoreB = (b.upvotes || 0) + (b._count?.comments || 0);
            
            // Bài ghim được buff thêm 100.000 điểm
            const weightA = a.isPinned ? 100000 : 0;
            const weightB = b.isPinned ? 100000 : 0;

            return (scoreB + weightB) - (scoreA + weightA);
          });

          // Cắt lấy 5 bài cao điểm nhất hiển thị
          setHotDiscussions(sortedDiscussions.slice(0, 5));
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách thảo luận:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="mt-4 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-rose-100 text-rose-500">
            <Flame className="size-4.5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Đang rôm rả</h2>
        </div>
        <Button variant="link" onClick={() => router.push('/discuss')} className="text-sm font-bold text-brand-orange">
          Xem tất cả thảo luận
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-6 text-slate-400">
            <Loader2 className="size-5 animate-spin" />
          </div>
        ) : hotDiscussions.length > 0 ? (
          hotDiscussions.map((discuss) => (
            <div key={discuss.id} onClick={() => router.push(`/discuss/${discuss.id}`)} className="group flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-brand-orange/50 hover:shadow-md">
              <div className="flex-1">
                {/* ĐÃ GẮN BADGE "ĐÃ GHIM" VÀO ĐÂY */}
                <h4 className="mb-2 text-base font-bold text-slate-800 transition-colors group-hover:text-brand-orange line-clamp-1 flex items-center gap-2">
                  {discuss.isPinned && <span className="bg-brand-orange text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase flex items-center gap-1 shrink-0"><Pin className="size-2.5" /> Đã ghim</span>}
                  {discuss.title}
                </h4>
                <p className="text-xs font-medium text-slate-500">
                  bởi <span className="font-bold text-slate-700">{discuss.user?.username}</span>
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium text-slate-500 shrink-0 ml-4">
                <span className="flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1"><span className="text-emerald-500">▲</span> {discuss.upvotes}</span>
                <span className="flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1"><MessageSquare className="size-3.5" /> {discuss._count?.comments || 0}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-sm font-medium text-slate-400 italic border border-dashed border-slate-200 rounded-xl">
            Chưa có bài thảo luận nào.
          </div>
        )}
      </div>
    </div>
  );
}