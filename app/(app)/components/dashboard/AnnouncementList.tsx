"use client";

import { useEffect, useState } from "react";
import { Megaphone, Loader2 } from "lucide-react";
import { getAnnouncements } from "@/lib/api/announcement";

const PAGE_SIZE = 5;

export default function AnnouncementList() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchPage = async (p: number, append = false) => {
    if (!append) setIsLoading(true);
    else setLoadingMore(true);
    try {
      const res = await getAnnouncements(p, PAGE_SIZE);
      if (res.success) {
        if (append) {
          setAnnouncements(prev => [...prev, ...res.data]);
        } else {
          setAnnouncements(res.data);
        }
        setTotal(res.total);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPage(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPage(nextPage, true);
  };

  const hasMore = announcements.length < total;

  return (
    <div className="flex flex-col gap-6 relative">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
          <Megaphone className="size-4.5" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Bảng tin hệ thống</h2>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-slate-400">
            <Loader2 className="size-6 animate-spin" />
          </div>
        ) : announcements.length > 0 ? (
          <>
            {announcements.map((item) => (
              <div key={item.id} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {item.isPinned && (
                        <span className="rounded bg-rose-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">Đã ghim</span>
                      )}
                      <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">{item.content}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs font-medium text-slate-400">
                  <span className="rounded-md bg-slate-100 px-2 py-1">{item.author?.role === 'admin' ? 'Quản trị viên' : item.author?.username}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            {hasMore && (
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="w-full py-3 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl border border-dashed border-slate-200 transition-colors"
              >
                {loadingMore ? (
                  <Loader2 className="size-4 animate-spin mx-auto" />
                ) : (
                  `Xem thêm (${announcements.length}/${total})`
                )}
              </button>
            )}
          </>
        ) : (
          <div className="py-8 text-center text-sm font-medium text-slate-400 italic border border-dashed border-slate-200 rounded-xl">
            Chưa có thông báo nào.
          </div>
        )}
      </div>
    </div>
  );
}
