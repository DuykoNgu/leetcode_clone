"use client";

import { useRouter } from "next/navigation";
import { MessageSquare, TrendingUp, Plus, Search, ChevronUp, ChevronDown, Hash, Bookmark, Loader2, Pin } from "lucide-react";  
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// Imports từ thư mục cha
import { useDiscussList } from "../hooks/useDiscussList";
import CreateDiscussModal from "../components/CreateDiscussModal";

const TRENDING_TAGS = ["Thuật toán", "Phỏng vấn", "Backend", "Frontend", "Hỏi đáp lỗi", "Python", "Tâm sự"];

export default function DiscussListScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const hookProps = useDiscussList();
  const { 
    discussions, loading, searchQuery, setSearchQuery, fetchDiscussions,
    activeTab, setActiveTab, sortBy, setSortBy, pinPriority, setPinPriority, handleCreatePost
  } = hookProps;

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#f8fafc] p-6 lg:p-8">
      <div className="mx-auto max-w-6xl relative">
        
        {/* HEADER SECTION */}
        <div className="mb-8 rounded-3xl bg-slate-900 p-8 shadow-xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-[80px] pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <MessageSquare className="size-8 text-emerald-400" /> Cộng đồng LeetCode
              </h1>
              <p className="mt-2 text-sm font-medium text-slate-400 max-w-xl">Nơi hội tụ của các anh tài. Cùng chia sẻ kinh nghiệm phỏng vấn, hỏi đáp thuật toán.</p>
            </div>
            <div className="relative w-full md:w-80 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchDiscussions()}
                  placeholder="Tìm kiếm chủ đề..." className="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3 pl-10 pr-4 text-sm text-slate-200 outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <Button onClick={() => fetchDiscussions()} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold px-5">Tìm</Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* CỘT TRÁI: DANH SÁCH BÀI VIẾT */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setActiveTab("all")} className={cn("font-bold rounded-full", activeTab === "all" ? "bg-slate-900 text-white hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100")}><MessageSquare className="mr-2 size-4" /> Tất cả</Button>
                <Button variant="ghost" onClick={() => { if (!isAuthenticated) return toast.error("Đăng nhập để xem bài đã lưu"); setActiveTab("saved"); }} className={cn("font-bold rounded-full", activeTab === "saved" ? "bg-emerald-500 text-white hover:bg-emerald-600" : "text-slate-500 hover:bg-slate-100")}><Bookmark className="mr-2 size-4" /> Đã lưu</Button>
              </div>

              <div className="flex items-center gap-4 bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
                  <span className="text-xs font-bold text-slate-400 uppercase">Sắp xếp:</span>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "new" | "hot")} className="text-sm font-bold text-slate-700 bg-transparent outline-none cursor-pointer"><option value="new">Mới nhất</option><option value="hot">Đang Hot</option></select>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="pinPriority" checked={pinPriority} onChange={(e) => setPinPriority(e.target.checked)} className="size-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer" />
                  <label htmlFor="pinPriority" className="text-xs font-bold text-slate-500 uppercase cursor-pointer select-none">Ưu tiên Ghim</label>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400"><Loader2 className="size-8 animate-spin text-emerald-500 mb-4" /><p className="animate-pulse font-medium">Đang tải các chủ đề...</p></div>
            ) : discussions.length > 0 ? (
              discussions.map((discuss: any) => (
                <div key={discuss.id} onClick={() => router.push(`/discuss/${discuss.id}`)} className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md cursor-pointer">
                  <div className="flex flex-col items-center justify-start gap-1 bg-slate-50 rounded-xl p-2 w-14 shrink-0 h-fit border border-slate-100">
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50"><ChevronUp className="size-5" /></Button>
                    <span className="text-sm font-extrabold text-slate-700">{discuss.upvotes}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-rose-500 hover:bg-rose-50"><ChevronDown className="size-5" /></Button>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <div className="mb-2 flex items-center gap-2">
                      {discuss.isPinned && <span className="bg-brand-orange text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase flex items-center gap-1 shrink-0"><Pin className="size-2.5" /> Đã ghim</span>}
                      <span className="text-xs font-medium text-slate-500">Đăng bởi <span className="font-bold text-slate-800">{discuss.user.username}</span></span>
                      <span className="text-slate-300 text-xs">•</span><span className="text-xs font-medium text-slate-400">{new Date(discuss.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="mb-3 text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{discuss.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {discuss.problem && <span className="rounded-md bg-slate-100 px-2.5 py-1 font-semibold text-slate-700">🏷️ {discuss.problem.title}</span>}
                      {discuss.tags && JSON.parse(discuss.tags).map((tag: string) => <span key={tag} className="rounded-md border border-slate-200 px-2.5 py-1 font-medium text-slate-500 flex items-center gap-1"><Hash className="size-3" />{tag}</span>)}
                      <div className="ml-auto flex items-center gap-1.5 text-slate-400 font-medium bg-slate-50 px-3 py-1 rounded-full border border-slate-100"><MessageSquare className="size-3.5" /> {discuss._count.comments} bình luận</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center text-slate-500 flex flex-col items-center gap-3 bg-white rounded-3xl border border-dashed border-slate-200">
                <div className="p-4 bg-slate-50 rounded-full mb-2"><MessageSquare className="size-8 text-slate-300" /></div>
                <p className="font-medium text-slate-600">{activeTab === 'saved' ? "Bạn chưa lưu bài thảo luận nào." : "Không tìm thấy chủ đề nào."}</p>
                {activeTab === 'all' && <Button onClick={handleCreatePost} variant="outline" className="mt-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50">Trở thành người đầu tiên</Button>}
              </div>
            )}
          </div>

          {/* CỘT PHẢI: SIDEBAR */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Button onClick={handleCreatePost} className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/20 text-base rounded-xl transition-transform active:scale-95">
              <Plus className="mr-2 size-5" /> Tạo chủ đề mới
            </Button>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2"><TrendingUp className="size-4 text-emerald-500" /> Chủ đề thịnh hành</h3>
              <div className="flex flex-wrap gap-2">
                {TRENDING_TAGS.map((tag) => (
                  <span key={tag} onClick={() => setSearchQuery(tag)} className="px-3 py-1.5 bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer rounded-lg text-xs font-semibold text-slate-600 transition-colors">{tag}</span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <CreateDiscussModal hookProps={hookProps} />
    </div>
  );
}