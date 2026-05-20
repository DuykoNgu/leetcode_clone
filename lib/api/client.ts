import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { API_BASE_URL } from "@/lib/env";
import { safeStorage } from "@/lib/utils/storage";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = safeStorage.getItem("leetcode_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = safeStorage.getItem("leetcode_refresh_token");
        if (!refreshToken) {
          // No refresh token, just reject - let the calling code handle it
          return Promise.reject(error);
        }

        const refreshResponse = await axios.post(`${API_BASE_URL}/refresh-token`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data;

        safeStorage.setItem("leetcode_token", accessToken);
        if (newRefreshToken) {
          safeStorage.setItem("leetcode_refresh_token", newRefreshToken);
        }

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear tokens and let calling code handle redirect
        safeStorage.removeItem("leetcode_token");
        safeStorage.removeItem("leetcode_refresh_token");
        safeStorage.removeItem("leetcode_user");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
