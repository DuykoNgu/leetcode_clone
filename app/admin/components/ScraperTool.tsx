"use client";

/**
 * FILE: app/admin/components/ScraperTool.tsx
 *
 * Giao diện Admin để cào bài tập từ LeetCode.
 * Tính năng:
 * - Chọn số lượng bài cần cào (1 – 500)
 * - Chọn 1 hoặc nhiều danh mục (2 dạng bài lớn của LeetCode sau khi rút gọn)
 * - Nút Start / Stop
 * - Progress bar real-time qua SSE
 * - Log terminal cuộn tự động
 * - Hiển thị kết quả tổng kết sau khi xong
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Square,
  RefreshCw,
  Terminal,
  CheckCircle2,
  XCircle,
  SkipForward,
  Loader2,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import {
  startScrape,
  stopScrape,
  getScraperStatus,
  createScraperSSE,
  type ScraperLogEntry,
  type ScraperProgressEvent,
} from "@/lib/api/scraper";

// ── Cấu hình danh mục bài tập LeetCode (Đã giữ lại 2 danh mục) ─────────────────
const SCRAPER_CATEGORIES = [
  {
    value: "algorithms",
    label: "Algorithms",
    desc: "Thuật toán tổng quát (Array, DP, Graph...)",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    activeColor: "bg-blue-600 text-white border-blue-600",
  },
  {
    value: "javascript",
    label: "JavaScript",
    desc: "Bài tập JS / TypeScript",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    activeColor: "bg-yellow-500 text-white border-yellow-500",
  },
] as const;

type CategoryValue = (typeof SCRAPER_CATEGORIES)[number]["value"];

// ── Types ──────────────────────────────────────────────────────────────────────
type JobState = "idle" | "running" | "done" | "error";

type Stats = {
  inserted: number;
  skipped: number;
  failed: number;
  current: number;
  total: number;
};

// ── Helper: màu cho từng kết quả dòng log ─────────────────────────────────────
function logColor(entry: ScraperLogEntry): string {
  if (entry.type === "start") return "text-blue-400";
  if (entry.type === "done") return "text-emerald-400 font-semibold";
  if (entry.type === "error") return "text-red-400";
  if (entry.result === "inserted") return "text-emerald-400";
  if (entry.result === "failed") return "text-red-400";
  if (entry.result === "skipped") return "text-gray-400";
  return "text-gray-300";
}

// ── Component chính ────────────────────────────────────────────────────────────
export default function ScraperTool() {
  // Form state - Set mặc định chọn cả hai danh mục thuật toán và javascript
  const [limit, setLimit] = useState<number>(20);
  const [selectedCategories, setSelectedCategories] = useState<CategoryValue[]>(["algorithms", "javascript"]);

  // Job state
  const [jobState, setJobState] = useState<JobState>("idle");
  const [stats, setStats] = useState<Stats>({ inserted: 0, skipped: 0, failed: 0, current: 0, total: 0 });
  const [logs, setLogs] = useState<ScraperLogEntry[]>([]);
  const [showLog, setShowLog] = useState(true);

  // SSE ref
  const esRef = useRef<EventSource | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  // ── Auto-scroll log terminal ──
  useEffect(() => {
    if (showLog) {
      logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, showLog]);

  // ── Cleanup SSE on unmount ──
  useEffect(() => {
    return () => {
      esRef.current?.close();
    };
  }, []);

  // ── Kiểm tra trạng thái khi mount (nếu có job đang chạy từ trước) ──
  useEffect(() => {
    getScraperStatus()
      .then(({ data }) => {
        if (data.running) {
          setJobState("running");
          setStats({
            inserted: data.inserted ?? 0,
            skipped: data.skipped ?? 0,
            failed: data.failed ?? 0,
            current: data.currentIndex ?? 0,
            total: data.totalQueued ?? 0,
          });
          // Tự động kết nối lại SSE nếu job đang chạy
          connectSSE();
        }
      })
      .catch(() => {}); // Bỏ qua lỗi khi check status lần đầu
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Thêm dòng log ──
  const appendLog = useCallback((entry: ScraperLogEntry) => {
    setLogs((prev) => {
      const next = [...prev, entry];
      return next.length > 300 ? next.slice(-300) : next; // Giữ tối đa 300 dòng
    });
  }, []);

  // ── Kết nối SSE ──
  const connectSSE = useCallback(() => {
    esRef.current?.close();

    const es = createScraperSSE({
      onConnected: (data) => {
        appendLog({ type: "log", message: "🔌 Đã kết nối SSE", ts: Date.now() });
      },
      onStart: (data) => {
        setJobState("running");
        appendLog({ type: "start", message: data.message, ts: Date.now() });
      },
      onLog: (data) => {
        appendLog({ type: "log", message: data.message, ts: Date.now() });
      },
      onProgress: (data: ScraperProgressEvent) => {
        setStats({
          inserted: data.inserted,
          skipped: data.skipped,
          failed: data.failed,
          current: data.current,
          total: data.total,
        });
        appendLog({
          type: "progress",
          message: data.message,
          slug: data.slug,
          result: data.result,
          inserted: data.inserted,
          skipped: data.skipped,
          failed: data.failed,
          current: data.current,
          total: data.total,
          ts: Date.now(),
        });
      },
      onDone: (data) => {
        setJobState("done");
        setStats((prev) => ({
          ...prev,
          inserted: data.inserted,
          skipped: data.skipped,
          failed: data.failed,
        }));
        appendLog({ type: "done", message: data.message, ts: Date.now() });
        es.close();
        toast.success(`Hoàn tất! +${data.inserted} bài mới`);
      },
      onError: (data) => {
        setJobState("error");
        appendLog({ type: "error", message: data.message ?? "Lỗi không xác định", ts: Date.now() });
        es.close();
        toast.error("Job gặp lỗi. Xem log để biết chi tiết.");
      },
    });

    esRef.current = es;
  }, [appendLog]);

  // ── Toggle danh mục ──
  const toggleCategory = (cat: CategoryValue) => {
    setSelectedCategories((prev) =>
      prev.includes(cat)
        ? prev.length === 1
          ? prev // Luôn giữ ít nhất 1 danh mục
          : prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
  };

  // ── Bắt đầu cào ──
  const handleStart = async () => {
    if (selectedCategories.length === 0) {
      toast.warning("Vui lòng chọn ít nhất 1 danh mục.");
      return;
    }

    setLogs([]);
    setStats({ inserted: 0, skipped: 0, failed: 0, current: 0, total: 0 });
    setJobState("running");

    try {
      const result = await startScrape({ limit, categories: selectedCategories });
      if (!result.success) {
        toast.error(result.message ?? "Không thể khởi động job.");
        setJobState("idle");
        return;
      }
      toast.info(`Job #${result.jobId} đã bắt đầu`);
      connectSSE();
    } catch (err: any) {
      toast.error("Lỗi kết nối server: " + (err?.message ?? "Unknown"));
      setJobState("idle");
    }
  };

  // ── Dừng cào ──
  const handleStop = async () => {
    try {
      await stopScrape();
      toast.info("Đã gửi lệnh dừng. Job sẽ kết thúc sau bài hiện tại.");
    } catch (err: any) {
      toast.error("Không thể dừng job: " + (err?.message ?? ""));
    }
  };

  // ── Reset ──
  const handleReset = () => {
    esRef.current?.close();
    setJobState("idle");
    setLogs([]);
    setStats({ inserted: 0, skipped: 0, failed: 0, current: 0, total: 0 });
  };

  const isRunning = jobState === "running";
  const progressPct = stats.total > 0 ? Math.round((stats.current / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* ── Cấu hình ────────────────────────────────────────────────────────── */}
      <div className="border rounded-xl p-6 space-y-6 bg-white">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-700">Cấu hình cào bài</h2>
        </div>

        {/* Số lượng bài */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Số bài muốn cào mới
          </label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min={1}
              max={500}
              value={limit}
              onChange={(e) => setLimit(Math.max(1, Math.min(500, Number(e.target.value))))}
              disabled={isRunning}
              className="w-24 border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50 disabled:bg-gray-50"
            />
            <input
              type="range"
              min={1}
              max={500}
              step={5}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              disabled={isRunning}
              className="flex-1 accent-gray-800 disabled:opacity-50"
            />
            <span className="text-sm text-gray-400 w-16 text-right">{limit} bài mới</span>
          </div>
          <p className="text-[11px] text-gray-400 flex items-center gap-1">
            <Info size={11} />
            Hệ thống tự động lọc toàn bộ kho để lấy đủ {limit} bài chưa có trong database.
          </p>
        </div>

        {/* Danh mục */}
        <div className="space-y-3">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Danh mục bài tập LeetCode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SCRAPER_CATEGORIES.map((cat) => {
              const active = selectedCategories.includes(cat.value);
              return (
                <button
                  key={cat.value}
                  onClick={() => toggleCategory(cat.value)}
                  disabled={isRunning}
                  className={`
                    relative text-left border rounded-xl px-4 py-3 transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${active ? cat.activeColor + " shadow-sm" : cat.color + " hover:shadow-sm"}
                  `}
                >
                  {active && (
                    <span className="absolute top-2 right-2">
                      <CheckCircle2 size={14} />
                    </span>
                  )}
                  <p className="text-sm font-semibold">{cat.label}</p>
                  <p className={`text-[11px] mt-0.5 ${active ? "opacity-80" : "opacity-60"}`}>
                    {cat.desc}
                  </p>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-gray-400">
            Đã chọn: <strong>{selectedCategories.join(", ")}</strong>
          </p>
        </div>

        {/* Nút điều khiển */}
        <div className="flex items-center gap-3 pt-2 border-t">
          {!isRunning && jobState !== "done" && (
            <button
              onClick={handleStart}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-700 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50 shadow-sm"
            >
              <Play size={15} />
              Bắt đầu cào
            </button>
          )}

          {isRunning && (
            <>
              <div className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-500 rounded-xl text-sm font-medium">
                <Loader2 size={15} className="animate-spin" />
                Đang lọc và cào dữ liệu...
              </div>
              <button
                onClick={handleStop}
                className="flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-all"
              >
                <Square size={13} />
                Dừng
              </button>
            </>
          )}

          {(jobState === "done" || jobState === "error") && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
            >
              <RefreshCw size={14} />
              Làm lại
            </button>
          )}
        </div>
      </div>

      {/* ── Progress ──────────────────────────────────────────────────────── */}
      {(isRunning || jobState === "done" || stats.current > 0) && (
        <div className="border rounded-xl p-6 space-y-4 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">Tiến độ sàng lọc dữ liệu</h2>
            {stats.total > 0 && (
              <span className="text-xs text-gray-400 font-mono">
                Tiến trình: {stats.current} / {stats.total} bài ({progressPct}%)
              </span>
            )}
          </div>

          {/* Progress bar */}
          {stats.total > 0 && (
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  jobState === "error"
                    ? "bg-red-400"
                    : jobState === "done"
                    ? "bg-emerald-500"
                    : "bg-gray-800"
                }`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          )}

          {/* Stat badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              <div>
                <p className="text-[10px] text-emerald-600 uppercase font-bold tracking-wide">Đã thêm mới</p>
                <p className="text-2xl font-light text-emerald-700 leading-none mt-0.5">
                  {stats.inserted} / <span className="text-sm font-normal text-emerald-600">{limit}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
              <SkipForward size={16} className="text-gray-400 shrink-0" />
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Đã có (Bỏ qua)</p>
                <p className="text-2xl font-light text-gray-700 leading-none mt-0.5">{stats.skipped}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <XCircle size={16} className="text-red-400 shrink-0" />
              <div>
                <p className="text-[10px] text-red-500 uppercase font-bold tracking-wide">Lỗi</p>
                <p className="text-2xl font-light text-red-600 leading-none mt-0.5">{stats.failed}</p>
              </div>
            </div>
          </div>

          {/* Done banner */}
          {jobState === "done" && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
              <CheckCircle2 size={16} />
              <span>
                Hoàn tất! Đã tìm thấy và cập nhật đủ <strong>{stats.inserted}</strong> bài mới vào database.
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Log terminal ──────────────────────────────────────────────────── */}
      {logs.length > 0 && (
        <div className="border rounded-xl overflow-hidden bg-white">
          <button
            onClick={() => setShowLog((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors border-b"
          >
            <span className="flex items-center gap-2">
              <Terminal size={14} />
              Log hệ thống ({logs.length} dòng)
            </span>
            {showLog ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showLog && (
            <div className="bg-gray-950 text-gray-300 font-mono text-[11px] leading-relaxed p-4 h-72 overflow-y-auto">
              {logs.map((entry, i) => (
                <div key={i} className={`py-0.5 ${logColor(entry)}`}>
                  <span className="text-gray-600 select-none mr-2">
                    {new Date(entry.ts).toLocaleTimeString("vi-VN", { hour12: false })}
                  </span>
                  {entry.message}
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          )}
        </div>
      )}

      {/* ── Hướng dẫn ──────────────────────────────────────────────────────── */}
      {jobState === "idle" && logs.length === 0 && (
        <div className="border border-dashed rounded-xl p-6 space-y-2 text-center text-sm text-gray-400">
          <Terminal size={24} className="mx-auto mb-3 opacity-30" />
          <p>Nhập số lượng bài mới mục tiêu, sau đó nhấn <strong className="text-gray-600">Bắt đầu cào</strong>.</p>
          <p className="text-xs">
            Hệ thống sẽ kéo danh sách lớn từ LeetCode về, bỏ qua các bài đã có sẵn để cào bằng đủ số bài bạn yêu cầu.
          </p>
        </div>
      )}
    </div>
  );
}