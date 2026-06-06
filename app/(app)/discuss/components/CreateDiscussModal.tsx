import { X, MessageSquare, Hash, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const SUGGESTED_TAGS = ["Thuật toán", "Phỏng vấn", "Backend", "Frontend", "Hỏi đáp lỗi", "Python", "Tâm sự", "Java"];

export default function CreateDiscussModal({ hookProps }: { hookProps: any }) {
  const { 
    isCreateModalOpen, setIsCreateModalOpen, formData, setFormData, tagInput, isSubmitting,
    handleTagChange, handleTagKeyDown, addTag, removeTag, handleSubmitPost 
  } = hookProps;

  if (!isCreateModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col overflow-hidden">
        
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600"><MessageSquare className="size-5" /></div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Tạo chủ đề thảo luận</h3>
              <p className="text-xs font-medium text-slate-500">Cộng đồng sẽ giúp bạn giải đáp thắc mắc</p>
            </div>
          </div>
          <button onClick={() => setIsCreateModalOpen(false)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-rose-500 transition-colors"><X className="size-5" /></button>
        </div>

        <form onSubmit={handleSubmitPost} className="flex flex-col p-6 gap-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Tiêu đề <span className="text-rose-500">*</span></label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Ví dụ: Tối ưu bài Two Sum..." className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Gắn thẻ (Tags)</label>
            <div className="flex w-full flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
              {formData.tags.map((tag: string) => (
                <span key={tag} className="flex items-center gap-1 rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                  <Hash className="size-3 opacity-70" />{tag}
                  <button type="button" onClick={() => removeTag(tag)} className="ml-1 rounded-full p-0.5 hover:bg-emerald-200 text-emerald-600 transition-colors"><X className="size-3" /></button>
                </span>
              ))}
              <input type="text" value={tagInput} onChange={handleTagChange} onKeyDown={handleTagKeyDown} placeholder={formData.tags.length < 5 ? "Nhập thẻ rồi ấn (,) hoặc Enter..." : "Đã đạt tối đa 5 thẻ"} disabled={formData.tags.length >= 5} className="flex-1 min-w-[200px] bg-transparent text-sm outline-none placeholder:text-slate-400 disabled:opacity-50" />
            </div>
            
            <div className="mt-2.5 flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Gợi ý:</span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_TAGS.map(tag => (
                  <button key={tag} type="button" onClick={() => addTag(tag)} className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-500 hover:border-emerald-500 hover:text-emerald-600 transition-colors">+ {tag}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Nội dung chi tiết <span className="text-rose-500">*</span></label>
            <textarea rows={6} value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} placeholder="Mô tả chi tiết..." className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10" />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)} className="text-slate-500 hover:bg-slate-100 hover:text-slate-700 font-bold rounded-xl px-6">Hủy bỏ</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl px-6 shadow-lg shadow-emerald-500/20">
              {isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Send className="mr-2 size-4" />} Đăng tải
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}