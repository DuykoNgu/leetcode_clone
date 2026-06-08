"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Flame, TrendingUp, Plus, Search, ChevronUp, ChevronDown, Clock, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDiscussions } from "@/lib/api/discuss";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function DiscussPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    try {
      const res = await getDiscussions();
      if (res.success) setDiscussions(res.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách thảo luận:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = () => {
    if (!isAuthenticated) {
      toast.error("Bạn cần đăng nhập để viết bài!");
      return;
    }
    toast.info("Tính năng soạn bài đang được phát triển!");
    // Tương lai sẽ mở Modal hoặc chuyển sang trang /discuss/create
  };

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#f8fafc] p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        
        {/* Header Section */}
        <div className="mb-8 rounded-3xl bg-slate-900 p-8 shadow-xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-[80px] pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <MessageSquare className="size-8 text-emerald-400" />
                Cộng đồng LeetCode
              </h1>
              <p className="mt-2 text-sm font-medium text-slate-400 max-w-xl">
                Nơi hội tụ của các anh tài. Cùng chia sẻ kinh nghiệm phỏng vấn, hỏi đáp thuật toán và tối ưu hóa code.
              </p>
            </div>
            
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm chủ đề..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3 pl-10 pr-4 text-sm text-slate-200 outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* CỘT TRÁI: Danh sách Bài viết (70%) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex items-center gap-4 mb-2 border-b border-slate-200 pb-4">
              <Button variant="ghost" className="text-emerald-600 bg-emerald-50 font-bold hover:bg-emerald-100 hover:text-emerald-700">
                <Flame className="mr-2 size-4" /> Đang Hot
              </Button>
              <Button variant="ghost" className="text-slate-500 font-bold hover:bg-slate-100">
                <Clock className="mr-2 size-4" /> Mới nhất
              </Button>
            </div>

            {loading ? (
              <div className="py-20 text-center text-slate-400 animate-pulse">Đang tải các chủ đề rôm rả...</div>
            ) : discussions.length > 0 ? (
              discussions.map((discuss) => (
                <div key={discuss.id} onClick={() => router.push(`/discuss/${discuss.id}`)} className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md cursor-pointer">
                  
                  {/* Cột Vote */}
                  <div className="flex flex-col items-center justify-start gap-1 bg-slate-50 rounded-xl p-2 w-14 shrink-0 h-fit">
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50">
                      <ChevronUp className="size-5" />
                    </Button>
                    <span className="text-sm font-extrabold text-slate-700">{discuss.upvotes}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-rose-500 hover:bg-rose-50">
                      <ChevronDown className="size-5" />
                    </Button>
                  </div>

                  {/* Nội dung bài */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="mb-2 flex items-center gap-2">
                      {discuss.isPinned && (
                        <span className="rounded bg-brand-orange px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">Đã ghim</span>
                      )}
                      <span className="text-xs font-medium text-slate-500">
                        Đăng bởi <span className="font-bold text-slate-800">{discuss.user.username}</span>
                      </span>
                      <span className="text-slate-300 text-xs">•</span>
                      <span className="text-xs font-medium text-slate-400">{new Date(discuss.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <h3 className="mb-3 text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {discuss.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {discuss.problem && (
                        <span className="rounded-md bg-slate-100 px-2.5 py-1 font-semibold text-slate-700">
                          🏷️ {discuss.problem.title}
                        </span>
                      )}
                      
                      {discuss.tags && JSON.parse(discuss.tags).map((tag: string) => (
                        <span key={tag} className="rounded-md border border-slate-200 px-2.5 py-1 font-medium text-slate-500 flex items-center gap-1">
                          <Hash className="size-3" />{tag}
                        </span>
                      ))}

                      <div className="ml-auto flex items-center gap-1.5 text-slate-400 font-medium bg-slate-50 px-3 py-1 rounded-full">
                        <MessageSquare className="size-3.5" /> {discuss._count.comments} bình luận
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center text-slate-500 flex flex-col items-center gap-3">
                <MessageSquare className="size-10 text-slate-300" />
                <p>Chưa có chủ đề nào được thảo luận.</p>
              </div>
            )}
          </div>

          {/* CỘT PHẢI: Sidebar (30%) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Button 
              onClick={handleCreatePost}
              className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/20 text-base"
            >
              <Plus className="mr-2 size-5" /> Tạo chủ đề mới
            </Button>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <TrendingUp className="size-4 text-emerald-500" /> Chủ đề thịnh hành
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Thuật toán", "Phỏng vấn", "Backend", "Frontend", "Hỏi đáp lỗi", "Python", "Tâm sự"].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer rounded-lg text-xs font-semibold text-slate-600 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}