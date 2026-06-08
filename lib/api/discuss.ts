import apiClient from "./client";

// ================= BÀI VIẾT (DISCUSSION) =================

export const getDiscussions = async (params?: any) => {
  const response = await apiClient.get("/discussions", { params });
  return response.data;
};

export const getDiscussionDetail = async (id: string) => {
  const response = await apiClient.get(`/discussions/${id}`);
  return response.data;
};

export const createDiscussion = async (data: { title: string; content: string; tags: string[]; problemId?: string }) => {
  const response = await apiClient.post("/discussions", data);
  return response.data;
};

export const updateDiscussionPost = async (id: string, data: { title: string; content: string; tags: string[] }) => {
  const response = await apiClient.put(`/discussions/${id}`, data);
  return response.data;
};

export const deleteDiscussionPost = async (id: string) => {
  const response = await apiClient.delete(`/discussions/${id}`);
  return response.data;
};

// upvote, downvote, save
export const interactDiscussion = async (id: string, action: "upvote" | "downvote" | "save") => {
  const response = await apiClient.post(`/discussions/${id}/interact`, { action });
  return response.data;
};

export const togglePinDiscussion = async (id: string) => {
  const response = await apiClient.put(`/discussions/${id}/pin`);
  return response.data;
};


// ================= BÌNH LUẬN (COMMENTS) =================

export const addComment = async (id: string, content: string, parentId?: string | null) => {
  const response = await apiClient.post(`/discussions/${id}/comments`, { content, parentId });
  return response.data;
};

export const deleteComment = async (id: string, commentId: string) => {
  const response = await apiClient.delete(`/discussions/${id}/comments/${commentId}`);
  return response.data;
};

export const updateComment = async (id: string, commentId: string, content: string) => {
  const response = await apiClient.put(`/discussions/${id}/comments/${commentId}`, { content });
  return response.data;
};

export const togglePinComment = async (id: string, commentId: string) => {
  const response = await apiClient.put(`/discussions/${id}/comments/${commentId}/pin`);
  return response.data;
};

export const interactComment = async (id: string, commentId: string, action: "upvote" | "downvote") => {
  const response = await apiClient.post(`/discussions/${id}/comments/${commentId}/interact`, { action });
  return response.data;
};