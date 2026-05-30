/**
 * FILE: lib/api/scraper.ts
 *
 * API functions cho Admin Scraper Tool.
 * Dùng apiClient (axios) cho REST calls, native EventSource cho SSE stream.
 */

import apiClient from "./client";
import { safeStorage } from "@/lib/utils/storage";
import { API_BASE_URL } from "@/lib/env";

// Định nghĩa cụ thể 2 danh mục hợp lệ duy nhất để tránh gõ sai chuỗi (Type-safe)
export type ScraperCategory = "algorithms" | "javascript";

export type ScraperJobStatus = {
  running: boolean;
  jobId?: number;
  startTime?: string;
  endTime?: string;
  limit?: number;
  categories?: ScraperCategory[]; // Đồng bộ type danh mục mới
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
  categories: ScraperCategory[]; // Đồng bộ dữ liệu gửi đi từ FE
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
    handlers.onError?.({ message: "SSE connection error" });
  });

  return es;
}