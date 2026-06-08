import apiClient from "./client";

export const getAnnouncements = async () => {
  try {
    const response = await apiClient.get("/announcements");
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Dùng để đăng bài
export const createAnnouncement = async (data: { title: string; content: string; isPinned: boolean }) => {
  try {
    const response = await apiClient.post("/announcements", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//chỉnh sửa thông báo
export const updateAnnouncement = async (id: string, data: { title?: string; content?: string; isPinned?: boolean }) => {
  try {
    const response = await apiClient.put(`/announcements/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
//xóa thông báo
export const deleteAnnouncement = async (id: string) => {
  try {
    const response = await apiClient.delete(`/announcements/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};