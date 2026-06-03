import apiClient from "./client";

// Lấy danh sách bài viết (có phân trang, tìm kiếm)
export const getDiscussions = async (params?: any) => {
  const response = await apiClient.get("/discussions", { params });
  return response.data;
};

// Lấy chi tiết 1 bài viết kèm bình luận
export const getDiscussionDetail = async (id: string) => {
  const response = await apiClient.get(`/discussions/${id}`);
  return response.data;
};

// Tạo bài thảo luận mới
export const createDiscussion = async (data: { title: string; content: string; problemId?: string; tags?: string[] }) => {
  const response = await apiClient.post("/discussions", data);
  return response.data;
};

// Gửi bình luận
export const createComment = async (discussionId: string, data: { content: string; parentId?: string }) => {
  const response = await apiClient.post(`/discussions/${discussionId}/comments`, data);
  return response.data;
};