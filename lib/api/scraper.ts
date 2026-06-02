/**
 * FILE: lib/api/scraper.ts
 *
 * API functions cho Admin Scraper Tool.
 * Dùng apiClient (axios) cho REST calls, native EventSource cho SSE stream.
 */

import apiClient from "./client";
import { safeStorage } from "@/lib/utils/storage";
import { API_BASE_URL } from "@/lib/env";

<<<<<<< HEAD
// Định nghĩa cụ thể 2 danh mục hợp lệ duy nhất để tránh gõ sai chuỗi (Type-safe)
export type ScraperCategory = "algorithms" | "javascript";

=======
>>>>>>> 4d47bae054a44979b67a35efec2dcff7648b14f8
export type ScraperJobStatus = {
  running: boolean;
  jobId?: number;
  startTime?: string;
  endTime?: string;
  limit?: number;
<<<<<<< HEAD
  categories?: ScraperCategory[]; // Đồng bộ type danh mục mới
=======
  categories?: string[];
>>>>>>> 4d47bae054a44979b67a35efec2dcff7648b14f8
  inserted?: number;
  skipped?: number;
  failed?: number;
  totalQueued?: number;
  currentIndex?: number;
  done?: boolean;
};

export type ScraperProgressEvent = {
  current: number;
  total: number;
  inserted: number;
  skipped: number;
  failed: number;
  slug: string;
  result: "inserted" | "skipped" | "failed";
  message: string;
};

export type ScraperLogEntry = {
  type: "log" | "progress" | "start" | "done" | "error";
  message: string;
  slug?: string;
  result?: "inserted" | "skipped" | "failed";
  inserted?: number;
  skipped?: number;
  failed?: number;
  current?: number;
  total?: number;
  ts: number;
};

/** Khởi động job cào */
export async function startScrape(payload: {
  limit: number;
<<<<<<< HEAD
  categories: ScraperCategory[]; // Đồng bộ dữ liệu gửi đi từ FE
=======
  categories: string[];
>>>>>>> 4d47bae054a44979b67a35efec2dcff7648b14f8
}): Promise<{ success: boolean; jobId?: number; message?: string }> {
  const res = await apiClient.post("/admin/scraper/start", payload);
  return res.data;
}

/** Dừng job đang chạy */
export async function stopScrape(): Promise<{ success: boolean; message: string }> {
  const res = await apiClient.post("/admin/scraper/stop");
  return res.data;
}

/** Lấy trạng thái job hiện tại */
export async function getScraperStatus(): Promise<{
  success: boolean;
  data: ScraperJobStatus;
}> {
  const res = await apiClient.get("/admin/scraper/status");
  return res.data;
}

/**
 * Tạo SSE connection tới /admin/scraper/progress
<<<<<<< HEAD
=======
 * Trả về EventSource instance để caller có thể đóng khi unmount.
 *
 * Cần truyền token trong URL vì EventSource không hỗ trợ custom headers.
 * Backend cần chấp nhận ?token=... hoặc dùng cookie — ở đây dùng query param
 * đơn giản; nếu BE chưa hỗ trợ, xem hướng dẫn trong comment bên dưới.
>>>>>>> 4d47bae054a44979b67a35efec2dcff7648b14f8
 */
export function createScraperSSE(handlers: {
  onStart?: (data: any) => void;
  onLog?: (data: any) => void;
  onProgress?: (data: ScraperProgressEvent) => void;
  onDone?: (data: any) => void;
  onError?: (data: any) => void;
  onConnected?: (data: any) => void;
}): EventSource {
  const token = safeStorage.getItem("leetcode_token") ?? "";
<<<<<<< HEAD
=======
  // Truyền token qua query param để SSE có thể authenticate.
  // (Middleware BE cần đọc req.query.token nếu Authorization header không có)
>>>>>>> 4d47bae054a44979b67a35efec2dcff7648b14f8
  const url = `${API_BASE_URL}/admin/scraper/progress?token=${encodeURIComponent(token)}`;

  const es = new EventSource(url);

  es.addEventListener("connected", (e) => {
    handlers.onConnected?.(JSON.parse(e.data));
  });
  es.addEventListener("start", (e) => {
    handlers.onStart?.(JSON.parse(e.data));
  });
  es.addEventListener("log", (e) => {
    handlers.onLog?.(JSON.parse(e.data));
  });
  es.addEventListener("progress", (e) => {
    handlers.onProgress?.(JSON.parse(e.data));
  });
  es.addEventListener("done", (e) => {
    handlers.onDone?.(JSON.parse(e.data));
  });
  es.addEventListener("error", (e) => {
<<<<<<< HEAD
=======
    // SSE native error (kết nối thất bại)
>>>>>>> 4d47bae054a44979b67a35efec2dcff7648b14f8
    handlers.onError?.({ message: "SSE connection error" });
  });

  return es;
<<<<<<< HEAD
}
=======
}
>>>>>>> 4d47bae054a44979b67a35efec2dcff7648b14f8
