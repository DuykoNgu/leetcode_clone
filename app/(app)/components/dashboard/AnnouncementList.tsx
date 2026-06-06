"use client";

import { useEffect, useState } from "react";
import { Megaphone, Plus, X, Pencil, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from "@/lib/api/announcement";
import { toast } from "sonner";

interface AnnouncementListProps {
  isAdmin: boolean;
}

export default function AnnouncementList({ isAdmin }: AnnouncementListProps) {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State quản lý Modal TẠO/SỬA
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", content: "", isPinned: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State quản lý Modal XÓA
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchAnnouncements = async () => {
    try {
      const res = await getAnnouncements();
      if (res.success) setAnnouncements(res.data);
    } catch (error) {
      console.error("Lỗi lấy thông báo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // --- HÀM MỞ MODAL ĐĂNG MỚI ---
  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ title: "", content: "", isPinned: false });
    setIsModalOpen(true);
  };

  // --- HÀM MỞ MODAL SỬA ---
  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setFormData({ title: item.title, content: item.content, isPinned: item.isPinned });
    setIsModalOpen(true);
  };

  // --- HÀM MỞ MODAL XÓA ---
  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  // --- HÀM XÁC NHẬN XÓA ---
  const confirmDelete = async () => {
    if (!deletingId) return;
    
    toast.loading("Đang xóa...", { id: "deleteAnnounce" });
    try {
      await deleteAnnouncement(deletingId);
      toast.success("Đã xóa thông báo!", { id: "deleteAnnounce" });
      fetchAnnouncements(); 
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi xóa thông báo", { id: "deleteAnnounce" });
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingId(null);
    }
  };

  // --- HÀM LƯU (DÙNG CHUNG CHO CẢ TẠO MỚI VÀ SỬA) ---
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Vui lòng nhập đầy đủ tiêu đề và nội dung!");
      return;
    }

    setIsSubmitting(true);
    const toastId = editingId ? "editAnnounce" : "createAnnounce";
    toast.loading(editingId ? "Đang cập nhật..." : "Đang đăng thông báo...", { id: toastId });

    try {
      if (editingId) {
        await updateAnnouncement(editingId, formData);
        toast.success("Cập nhật thành công!", { id: toastId });
      } else {
        await createAnnouncement(formData);
        toast.success("Đăng thông báo thành công!", { id: toastId });
      }
      setIsModalOpen(false);
      fetchAnnouncements();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi thao tác", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <Megaphone className="size-4.5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Bảng tin hệ thống</h2>
        </div>
        
        {isAdmin && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={openCreateModal} 
            className="border-brand-orange text-brand-orange hover:bg-brand-orange/10 font-bold"
          >
            <Plus className="mr-1.5 size-4" /> Viết thông báo
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-slate-400">
            <Loader2 className="size-6 animate-spin" />
          </div>
        ) : announcements.length > 0 ? (
          announcements.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {item.isPinned && (
                      <span className="rounded bg-rose-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">Đã ghim</span>
                    )}
                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">{item.content}</p>
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => openEditModal(item)}
                      className="h-8 w-8 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteClick(item.id)}
                      className="h-8 w-8 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <X className="size-5" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center text-xs font-medium text-slate-400">
                <span className="rounded-md bg-slate-100 px-2 py-1">{item.author?.role === 'admin' ? 'Quản trị viên' : item.author?.username}</span>
                <span className="mx-2">•</span>
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-sm font-medium text-slate-400 italic border border-dashed border-slate-200 rounded-xl">
            Chưa có thông báo nào.
          </div>
        )}
      </div>

      {/* --- MODAL VIẾT / SỬA THÔNG BÁO --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">
                {editingId ? "Chỉnh sửa thông báo" : "Tạo thông báo mới"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Tiêu đề</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Nhập tiêu đề thông báo..." 
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nội dung</label>
                <textarea 
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Nhập nội dung chi tiết..." 
                  className="w-full resize-none rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input 
                  type="checkbox" 
                  id="pin-checkbox"
                  checked={formData.isPinned}
                  onChange={(e) => setFormData({...formData, isPinned: e.target.checked})}
                  className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                />
                <label htmlFor="pin-checkbox" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                  Ghim thông báo này lên đầu trang
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-700 font-bold">
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  {isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                  {editingId ? "Lưu thay đổi" : "Đăng thông báo"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL XÁC NHẬN XÓA --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                <AlertTriangle className="size-7" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">Xóa thông báo này?</h3>
              <p className="mb-6 text-sm text-slate-500">
                Hành động này không thể hoàn tác. Thông báo sẽ bị xóa vĩnh viễn khỏi bảng tin hệ thống.
              </p>
              
              <div className="flex w-full gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Hủy bỏ
                </Button>
                <Button 
                  onClick={confirmDelete}
                  className="flex-1 bg-rose-500 font-bold text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20"
                >
                  Xóa vĩnh viễn
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}