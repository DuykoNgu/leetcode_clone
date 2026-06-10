import { useState, useEffect } from "react";
import { getDiscussions, createDiscussion } from "@/lib/api/discuss";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export const useDiscussList = () => {
  const { isAuthenticated } = useAuth();
  
  // --- STATES DATA ---
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // --- STATES BỘ LỌC ---
  const [activeTab, setActiveTab] = useState<"all" | "saved">("all");
  const [sortBy, setSortBy] = useState<"new" | "hot">("new");
  const [pinPriority, setPinPriority] = useState(true);

  // --- STATES MODAL TẠO BÀI ---
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "", tags: [] as string[] });
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDiscussions = async (overrideSearch?: string) => {
    setLoading(true);
    try {
      const params = { 
        // Nếu có override thì dùng, không thì dùng searchQuery trong state
        search: overrideSearch !== undefined ? overrideSearch : searchQuery, 
        sortBy, 
        isSaved: activeTab === "saved", 
        pinPriority 
      };
      const res = await getDiscussions(params);
      if (res.success) setDiscussions(res.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách thảo luận:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, [activeTab, sortBy, pinPriority]);

  // --- LOGIC TAGS ---
  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.includes(',')) addTag(val.replace(',', ''));
    else setTagInput(val);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); }
  };

  const addTag = (newTag: string) => {
    const trimmed = newTag.trim();
    if (!trimmed) return;
    if (formData.tags.includes(trimmed)) { setTagInput(""); return; }
    if (formData.tags.length >= 5) return toast.error("Chỉ tối đa 5 thẻ!");
    setFormData({ ...formData, tags: [...formData.tags, trimmed] });
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tagToRemove) });
  };

  // --- LOGIC TẠO BÀI ---
  const handleCreatePost = () => {
    if (!isAuthenticated) return toast.error("Bạn cần đăng nhập để viết bài!");
    setFormData({ title: "", content: "", tags: [] });
    setTagInput("");
    setIsCreateModalOpen(true);
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return toast.error("Vui lòng nhập đầy đủ!");
    setIsSubmitting(true);
    toast.loading("Đang đẩy bài lên...", { id: "createPost" });
    try {
      await createDiscussion({ ...formData, problemId: "general" });
      toast.success("Đăng bài thành công!", { id: "createPost" });
      setIsCreateModalOpen(false);
      fetchDiscussions(); 
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi đăng bài", { id: "createPost" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    discussions, loading, searchQuery, setSearchQuery, fetchDiscussions,
    activeTab, setActiveTab, sortBy, setSortBy, pinPriority, setPinPriority,
    isCreateModalOpen, setIsCreateModalOpen, formData, setFormData, tagInput, isSubmitting,
    handleTagChange, handleTagKeyDown, addTag, removeTag, handleCreatePost, handleSubmitPost
  };
};