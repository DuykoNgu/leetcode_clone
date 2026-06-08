"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { 
  getDiscussionDetail, interactDiscussion, deleteDiscussionPost, togglePinDiscussion, updateDiscussionPost,
  addComment, deleteComment, updateComment, togglePinComment, interactComment 
} from "@/lib/api/discuss";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  ArrowLeft, MessageSquare, ChevronUp, ChevronDown, 
  Bookmark, Edit, Trash2, Pin, Loader2, Hash, AlertTriangle, X, Send, Reply 
} from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGESTED_TAGS = ["Thuật toán", "Phỏng vấn", "Backend", "Frontend", "Hỏi đáp lỗi", "Python", "Tâm sự", "Java", "Quy hoạch động"];

export default function DiscussDetailScreen({ id }: { id: string }) {
  const router = useRouter();
  const { authUser, isAuthenticated } = useAuth();
  
  // --- STATES ---
  const [discuss, setDiscuss] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ title: "", content: "", tags: [] as string[] });
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<{ id: string, username: string } | null>(null);

  const fetchDetail = async () => {
    try {
      const res = await getDiscussionDetail(id);
      if (res.success) setDiscuss(res.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Bài viết không tồn tại hoặc đã bị xóa.");
      router.push('/discuss');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDetail(); }, [id, authUser]);

  const isAuthor = authUser?.id === discuss?.userId;
  const isAdmin = authUser?.role === 'admin';
  const canEdit = isAuthor;
  const canDelete = isAuthor || isAdmin;
  const canPin = isAdmin;

  const myInteraction = discuss?.interactions?.[0]; 
  const isUpvoted = myInteraction?.voteType === 1;
  const isDownvoted = myInteraction?.voteType === -1;
  const isSaved = myInteraction?.isSaved === true;

  // --- HANDLERS ---
  const handleInteract = async (action: "upvote" | "downvote" | "save") => {
    if (!isAuthenticated) return toast.error(`Vui lòng đăng nhập để thao tác!`);
    if (isInteracting) return;
    setIsInteracting(true);
    try {
      await interactDiscussion(id, action);
      fetchDetail(); 
    } catch (error: any) { toast.error("Lỗi thao tác"); } 
    finally { setIsInteracting(false); }
  };

  const confirmDelete = async () => {
    toast.loading("Đang xóa...", { id: "delPost" });
    try {
      await deleteDiscussionPost(id);
      toast.success("Đã xóa bài viết!", { id: "delPost" });
      router.push('/discuss');
    } catch (error: any) { 
      // Sửa dòng dưới đây:
      toast.error(error.response?.data?.message || "Lỗi khi xóa", { id: "delPost" }); 
    } 
    finally { setIsDeleteModalOpen(false); }
  };

  const handlePin = async () => {
    try { await togglePinDiscussion(id); fetchDetail(); toast.success("Thao tác thành công!"); } 
    catch (error: any) { toast.error("Lỗi ghim bài"); }
  };

  const openEditModal = () => {
    setEditFormData({ title: discuss.title, content: discuss.content, tags: discuss.tags ? JSON.parse(discuss.tags) : [] });
    setTagInput("");
    setIsEditModalOpen(true);
  };

  const addTag = (newTag: string) => {
    const trimmed = newTag.trim();
    if (!trimmed) return;
    if (editFormData.tags.includes(trimmed)) { setTagInput(""); return; }
    if (editFormData.tags.length >= 5) return toast.error("Chỉ tối đa 5 thẻ!");
    setEditFormData({ ...editFormData, tags: [...editFormData.tags, trimmed] });
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setEditFormData({ ...editFormData, tags: editFormData.tags.filter(t => t !== tagToRemove) });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData.title.trim() || !editFormData.content.trim()) return toast.error("Vui lòng nhập đầy đủ tiêu đề và nội dung!");
    setIsSubmitting(true);
    toast.loading("Đang cập nhật bài viết...", { id: "editPost" });
    try {
      await updateDiscussionPost(id, editFormData);
      toast.success("Cập nhật thành công!", { id: "editPost" });
      setIsEditModalOpen(false);
      fetchDetail(); 
    } catch (error: any) { toast.error("Lỗi cập nhật", { id: "editPost" }); } 
    finally { setIsSubmitting(false); }
  };

  // --- COMMENT HANDLERS ---
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmittingComment(true);
    try {
      await addComment(id, commentText, replyingTo?.id || null);
      setCommentText("");
      setReplyingTo(null);
      fetchDetail(); 
      toast.success("Đã gửi bình luận!");
    } catch (error: any) { toast.error("Lỗi khi gửi bình luận"); } 
    finally { setIsSubmittingComment(false); }
  };

  const confirmDeleteComment = async () => {
    if (!commentToDelete) return;
    toast.loading("Đang xóa...", { id: "delCmt" });
    try {
      await deleteComment(id, commentToDelete);
      fetchDetail();
      toast.success("Đã xóa bình luận!", { id: "delCmt" });
    } catch (error: any) { 
      // Sửa dòng dưới đây:
      toast.error(error.response?.data?.message || "Lỗi khi xóa", { id: "delCmt" }); 
    } 
    finally { setCommentToDelete(null); }
  };;

  const submitEditComment = async (commentId: string) => {
    if (!editCommentContent.trim()) return;
    try {
      await updateComment(id, commentId, editCommentContent);
      setEditingCommentId(null);
      fetchDetail();
      toast.success("Đã cập nhật!");
    } catch (err: any) { toast.error("Lỗi khi sửa"); }
  };

  const handlePinCommentAction = async (commentId: string) => {
    try { await togglePinComment(id, commentId); fetchDetail(); toast.success("Thành công!"); } 
    catch (err: any) { toast.error("Lỗi ghim"); }
  };

  const handleInteractComment = async (commentId: string, action: "upvote" | "downvote") => {
    if (!isAuthenticated) return toast.error(`Vui lòng đăng nhập để thao tác!`);
    try { await interactComment(id, commentId, action); fetchDetail(); } 
    catch (error: any) { toast.error("Lỗi thao tác"); }
  };

  const initiateReply = (commentId: string, username: string) => {
    setReplyingTo({ id: commentId, username });
    setCommentText(`@${username} `); 
    document.getElementById("commentInput")?.focus(); 
  };

  // ===================== GIAO DIỆN =====================
  if (loading) return <div className="flex h-[calc(100vh-60px)] items-center justify-center bg-[#f8fafc]"><Loader2 className="size-8 animate-spin text-emerald-500" /></div>;
  if (!discuss) return null;

  const topLevelComments = discuss.comments?.filter((c: any) => !c.parentId) || [];

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#f8fafc] py-8 px-4 sm:px-6 relative">
      <div className="mx-auto max-w-4xl">
        <button onClick={() => router.push('/discuss')} className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">
          <ArrowLeft className="size-4" /> Quay lại danh sách
        </button>

        {/* NỘI DUNG BÀI VIẾT */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-6">
          <div className="border-b border-slate-100 bg-slate-50/50 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                  <img src={discuss.user?.avatarUrl || `https://ui-avatars.com/api/?name=${discuss.user?.username}&background=random`} alt="avatar" className="size-8 rounded-full border border-slate-200" />
                  <span>Đăng bởi <strong className="text-slate-800">{discuss.user?.username}</strong> {discuss.user?.role === 'admin' && <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-1.5 py-0.5 rounded ml-1 uppercase">Admin</span>}</span>
                  <span>•</span><span>{new Date(discuss.createdAt).toLocaleString()}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                  {discuss.isPinned && <span className="inline-block align-middle mr-3 rounded bg-brand-orange px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">Đã ghim</span>}
                  {discuss.title}
                </h1>
              </div>

              {(canEdit || canDelete || canPin) && (
                <div className="flex items-center gap-2 shrink-0">
                  {canPin && <Button onClick={handlePin} variant="outline" size="sm" className={cn("font-bold shadow-sm", discuss.isPinned ? "border-brand-orange text-brand-orange hover:bg-orange-50" : "text-slate-600")}><Pin className="mr-1.5 size-3.5" /> {discuss.isPinned ? "Bỏ ghim" : "Ghim bài"}</Button>}
                  {canEdit && <Button onClick={openEditModal} variant="outline" size="sm" className="font-bold text-blue-600 border-blue-200 hover:bg-blue-50 shadow-sm"><Edit className="mr-1.5 size-3.5" /> Sửa</Button>}
                  {canDelete && <Button onClick={() => setIsDeleteModalOpen(true)} variant="outline" size="sm" className="font-bold text-rose-600 border-rose-200 hover:bg-rose-50 shadow-sm"><Trash2 className="mr-1.5 size-3.5" /> Xóa</Button>}
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {discuss.problem && <span className="rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700 cursor-pointer hover:bg-emerald-200 transition-colors" onClick={() => router.push(`/problems/${discuss.problem.slug}`)}>🏷️ Bài tập: {discuss.problem.title}</span>}
              {discuss.tags && JSON.parse(discuss.tags).map((tag: string) => <span key={tag} className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-500"><Hash className="size-3" />{tag}</span>)}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="prose prose-slate max-w-none text-[15px] leading-relaxed text-slate-700 whitespace-pre-wrap">{discuss.content}</div>
          </div>

          <div className="border-t border-slate-100 bg-slate-50/30 p-4 sm:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden h-10">
                <button onClick={() => handleInteract('upvote')} className={cn("flex h-full items-center gap-1.5 px-4 font-bold transition-colors hover:bg-slate-50", isUpvoted ? "text-emerald-600 bg-emerald-50" : "text-slate-500")}><ChevronUp className="size-5" /> <span>{discuss.upvotes}</span></button>
                <div className="w-px h-full bg-slate-200" />
                <button onClick={() => handleInteract('downvote')} className={cn("flex h-full items-center px-3 font-bold transition-colors hover:bg-slate-50", isDownvoted ? "text-rose-600 bg-rose-50" : "text-slate-400 hover:text-rose-500")}><ChevronDown className="size-5" /></button>
              </div>
            </div>
            <Button onClick={() => handleInteract('save')} variant="outline" className={cn("h-10 rounded-xl font-bold shadow-sm gap-2 transition-all", isSaved ? "bg-amber-100 text-amber-700 border-amber-200" : "text-slate-600")}><Bookmark className={cn("size-4", isSaved && "fill-current")} /><span className="hidden sm:inline">{isSaved ? "Đã lưu" : "Lưu bài"}</span></Button>
          </div>
        </div>

        {/* KHU VỰC BÌNH LUẬN */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8 mt-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><MessageSquare className="size-5 text-emerald-500" />Bình luận ({discuss.comments?.length || 0})</h3>

          {isAuthenticated ? (
            <div className="mb-8">
              {replyingTo && (
                <div className="flex items-center gap-2 mb-2 ml-14 text-sm font-medium text-emerald-600 bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100">
                  <Reply className="size-3.5" /> Đang trả lời <strong>{replyingTo.username}</strong>
                  <button onClick={() => { setReplyingTo(null); setCommentText(""); }} className="ml-2 hover:text-rose-500"><X className="size-3.5" /></button>
                </div>
              )}
              <form onSubmit={handleCommentSubmit} className="flex gap-3 sm:gap-4">
                <img src={authUser?.avatarUrl || `https://ui-avatars.com/api/?name=${authUser?.username}&background=random`} className="size-10 rounded-full border border-slate-200 shrink-0" alt="avatar" />
                <div className="flex-1">
                  <textarea id="commentInput" rows={3} value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Viết bình luận của bạn..." className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10" />
                  <div className="mt-2 flex justify-end">
                    <Button type="submit" disabled={isSubmittingComment} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20">{isSubmittingComment ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Send className="mr-2 size-4" />} Gửi bình luận</Button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
             <div className="mb-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
               <p className="text-sm font-medium text-slate-500 mb-3">Bạn cần đăng nhập để tham gia bình luận.</p>
               <Button onClick={() => router.push('/login')} variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 font-bold">Đăng nhập ngay</Button>
             </div>
          )}

          <div className="flex flex-col gap-6">
            {topLevelComments.length > 0 ? topLevelComments.map((comment: any) => {
              const replies = discuss.comments.filter((c: any) => c.parentId === comment.id);

              const renderCommentBox = (c: any, isReply: boolean = false) => {
                const canEditComment = authUser?.id === c.userId;
                const canDeleteComment = canEditComment || authUser?.id === discuss.userId || isAdmin;
                const isEditing = editingCommentId === c.id;
                const myCommentInteraction = c.interactions?.[0];
                const isCommentUpvoted = myCommentInteraction?.voteType === 1;
                const isCommentDownvoted = myCommentInteraction?.voteType === -1;

                return (
                  <div key={c.id} className={cn("group flex gap-3 sm:gap-4 p-4 rounded-2xl transition-all relative", c.isPinned ? "bg-orange-50/50 border border-brand-orange/20" : "hover:bg-slate-50", isReply && "mt-2")}>
                     {isReply && <div className="absolute -left-6 top-6 w-5 h-10 border-l-2 border-b-2 border-slate-200 rounded-bl-xl" />}
                     <img src={c.user?.avatarUrl || `https://ui-avatars.com/api/?name=${c.user?.username}&background=random`} className="size-10 rounded-full border border-slate-200 shrink-0 mt-1 z-10 bg-white" alt="avatar" />
                     <div className="flex-1">
                       <div className="flex items-center justify-between mb-1.5">
                         <div className="flex items-center flex-wrap gap-2">
                           <span className="text-sm font-bold text-slate-900">{c.user?.username}</span>
                           {c.user?.role === 'admin' && <span className="bg-rose-100 text-rose-600 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Admin</span>}
                           {c.userId === discuss.userId && <span className="bg-blue-100 text-blue-600 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Tác giả bài</span>}
                           {c.isPinned && <span className="bg-brand-orange text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase flex items-center gap-1"><Pin className="size-2.5" /> Đã ghim</span>}
                           <span className="text-xs font-medium text-slate-400">• {new Date(c.createdAt).toLocaleString()}</span>
                         </div>
                         <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-all">
                            {!isReply && authUser?.id === discuss.userId && <button onClick={() => handlePinCommentAction(c.id)} className={cn("p-1.5 rounded-lg transition-colors", c.isPinned ? "text-brand-orange hover:bg-orange-100" : "text-slate-400 hover:text-brand-orange hover:bg-orange-50")} title="Ghim bình luận"><Pin className="size-4" /></button>}
                            <button onClick={() => initiateReply(!isReply ? c.id : c.parentId, c.user.username)} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Trả lời"><Reply className="size-4" /></button>
                            {canEditComment && !isEditing && <button onClick={() => { setEditingCommentId(c.id); setEditCommentContent(c.content); }} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Sửa"><Edit className="size-4" /></button>}
                            {canDeleteComment && <button onClick={() => setCommentToDelete(c.id)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="Xóa"><Trash2 className="size-4" /></button>}
                         </div>
                       </div>

                       {isEditing ? (
                          <div className="mt-2 flex flex-col gap-2">
                            <textarea className="w-full resize-none rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100" rows={3} value={editCommentContent} onChange={(e) => setEditCommentContent(e.target.value)} />
                            <div className="flex gap-2 justify-end">
                              <Button size="sm" variant="ghost" onClick={() => setEditingCommentId(null)} className="h-7 text-xs font-bold text-slate-500">Hủy</Button>
                              <Button size="sm" onClick={() => submitEditComment(c.id)} className="h-7 text-xs font-bold bg-blue-500 hover:bg-blue-600 text-white">Lưu</Button>
                            </div>
                          </div>
                       ) : (
                          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{c.content.split(/(@\w+\b)/g).map((part: string, i: number) => part.startsWith('@') ? <strong key={i} className="text-emerald-600 bg-emerald-50 px-1 rounded">{part}</strong> : part)}</p>
                       )}

                       <div className="flex items-center rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden h-8 w-fit mt-3">
                          <button onClick={() => handleInteractComment(c.id, 'upvote')} className={cn("flex h-full items-center gap-1.5 px-3 text-xs font-bold transition-colors hover:bg-slate-50", isCommentUpvoted ? "text-emerald-600 bg-emerald-50" : "text-slate-500")}><ChevronUp className="size-4" /> <span>{c.upvotes}</span></button>
                          <div className="w-px h-full bg-slate-200" />
                          <button onClick={() => handleInteractComment(c.id, 'downvote')} className={cn("flex h-full items-center px-2 text-xs font-bold transition-colors hover:bg-slate-50", isCommentDownvoted ? "text-rose-600 bg-rose-50" : "text-slate-400 hover:text-rose-500")}><ChevronDown className="size-4" /></button>
                       </div>
                     </div>
                  </div>
                );
              };

              return (
                <div key={comment.id} className="flex flex-col">
                  {renderCommentBox(comment, false)}
                  {replies.length > 0 && (
                    <div className="ml-8 sm:ml-12 pl-2 border-l-2 border-slate-100 flex flex-col">
                      {replies.map((reply: any) => renderCommentBox(reply, true))}
                    </div>
                  )}
                </div>
              );
            }) : (
              <div className="text-center py-8 text-sm text-slate-400 font-medium bg-slate-50 rounded-xl border border-dashed border-slate-200">Chưa có bình luận nào. Hãy là người đầu tiên tham gia thảo luận!</div>
            )}
          </div>
        </div>

        {/* MODALS BẢO VỆ */}
        {commentToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-rose-100 text-rose-500"><AlertTriangle className="size-7" /></div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">Xóa bình luận?</h3>
                <p className="mb-6 text-sm text-slate-500">Hành động này không thể hoàn tác.</p>
                <div className="flex w-full gap-3">
                  <Button variant="outline" onClick={() => setCommentToDelete(null)} className="flex-1 font-bold text-slate-600 hover:bg-slate-50">Hủy bỏ</Button>
                  <Button onClick={confirmDeleteComment} className="flex-1 bg-rose-500 font-bold text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20">Xóa vĩnh viễn</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-rose-100 text-rose-500"><AlertTriangle className="size-7" /></div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">Xóa bài viết này?</h3>
                <p className="mb-6 text-sm text-slate-500">Hành động này không thể hoàn tác.</p>
                <div className="flex w-full gap-3">
                  <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="flex-1 font-bold text-slate-600 hover:bg-slate-50">Hủy bỏ</Button>
                  <Button onClick={confirmDelete} className="flex-1 bg-rose-500 font-bold text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20">Xóa vĩnh viễn</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600"><Edit className="size-5" /></div>
                  <div><h3 className="text-lg font-bold text-slate-900">Chỉnh sửa bài viết</h3></div>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-rose-500 transition-colors"><X className="size-5" /></button>
              </div>

              <form onSubmit={handleEditSubmit} className="flex flex-col p-6 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Tiêu đề <span className="text-rose-500">*</span></label>
                  <input type="text" value={editFormData.title} onChange={(e) => setEditFormData({...editFormData, title: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Gắn thẻ (Tags)</label>
                  <div className="flex w-full flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                    {editFormData.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 rounded-lg bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700"><Hash className="size-3 opacity-70" />{tag}<button type="button" onClick={() => removeTag(tag)} className="ml-1 rounded-full p-0.5 hover:bg-blue-200 text-blue-600 transition-colors"><X className="size-3" /></button></span>
                    ))}
                    <input type="text" value={tagInput} onChange={(e) => { const val = e.target.value; if (val.includes(',')) addTag(val.replace(',', '')); else setTagInput(val); }} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); } }} placeholder="Nhập thẻ..." disabled={editFormData.tags.length >= 5} className="flex-1 min-w-[200px] bg-transparent text-sm outline-none placeholder:text-slate-400 disabled:opacity-50" />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Nội dung chi tiết <span className="text-rose-500">*</span></label>
                  <textarea rows={6} value={editFormData.content} onChange={(e) => setEditFormData({...editFormData, content: e.target.value})} className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10" />
                </div>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)} className="text-slate-500 hover:bg-slate-100 hover:text-slate-700 font-bold rounded-xl px-6">Hủy bỏ</Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-6 shadow-lg shadow-blue-500/20">
                    {isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Send className="mr-2 size-4" />} Lưu thay đổi
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}