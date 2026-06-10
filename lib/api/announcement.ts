import apiClient from "./client";

export const getAnnouncements = async (page = 1, limit = 10) => {
  const response = await apiClient.get("/announcements", { params: { page, limit } });
  return response.data;
};

export const createAnnouncement = async (data: { title: string; content: string; isPinned: boolean }) => {
  const response = await apiClient.post("/announcements", data);
  return response.data;
};

export const updateAnnouncement = async (id: string, data: { title?: string; content?: string; isPinned?: boolean }) => {
  const response = await apiClient.put(`/announcements/${id}`, data);
  return response.data;
};

export const deleteAnnouncement = async (id: string) => {
  const response = await apiClient.delete(`/announcements/${id}`);
  return response.data;
};