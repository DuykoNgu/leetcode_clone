"use client";

import { useState, useMemo, useEffect } from "react";
import { Pencil, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { getProblemDetail, deleteProblem } from "@/lib/api/problems";
import type { ApiProblem } from "@/lib/types";
import { EditProblemModal } from "./EditProblemModal";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { toast } from "sonner";

const PAGE_SIZE = 50;

export function ProblemsContent({
  problems,
  onRefresh,
}: {
  problems: { id: string; title: string; difficulty: number; isActive: boolean }[];
  onRefresh: () => void;
}) {
  const [editingProblem, setEditingProblem] = useState<ApiProblem | null>(null);
  const [loadingEdit, setLoadingEdit] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => problems.filter((p) => {
      const q = search.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.id.includes(q);
    }),
    [problems, search]
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  const handleEdit = async (id: string) => {
    setLoadingEdit(id);
    try {
      const detail = await getProblemDetail(id);
      setEditingProblem(detail);
    } catch {
      toast.error("Không thể tải thông tin bài tập");
    } finally {
      setLoadingEdit(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { id, title } = deleteTarget;
    setDeletingId(id);
    try {
      await deleteProblem(id);
      toast.success(`Đã xoá "${title}"`);
      setDeleteTarget(null);
      onRefresh();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Lỗi khi xoá bài tập";
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => { setPage(1); }, [search]);
  useEffect(() => { if (page > totalPages) setPage(totalPages || 1); }, [page, totalPages, filtered]);

  return (
    <>
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm bài tập..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2.5 pl-10 pr-4 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-brand-orange focus:outline-none"
          />
        </div>

        <div className="border rounded-xl border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Title</th>
                <th className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Difficulty</th>
                <th className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paged.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                    <span className="text-slate-400 mr-2">#{p.id}</span>
                    {p.title}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-medium ${
                        p.difficulty === 0
                          ? "text-green-600 dark:text-green-400"
                          : p.difficulty === 1
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-red-500 dark:text-red-400"
                      }`}
                    >
                      {p.difficulty === 0 ? "Easy" : p.difficulty === 1 ? "Medium" : "Hard"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 inline-block rounded-full ${
                          p.isActive ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      />
                      <span className="text-gray-600 dark:text-gray-400">
                        {p.isActive ? "Active" : "Hidden"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEdit(p.id)}
                        disabled={loadingEdit === p.id}
                        className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 transition-colors"
                      >
                        <Pencil className="size-3.5" />
                        {loadingEdit === p.id ? "Loading..." : "Edit"}
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ id: p.id, title: p.title })}
                        disabled={deletingId === p.id}
                        className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 transition-colors"
                      >
                        <Trash2 className="size-3.5" />
                        {deletingId === p.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="size-3.5" /> Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
              .map((p, idx, arr) => (
                <span key={p} className="flex items-center gap-1">
                  {idx > 0 && arr[idx - 1] !== p - 1 && <span className="text-gray-300 px-1">...</span>}
                  <button
                    onClick={() => setPage(p)}
                    className={`min-w-[32px] rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors ${
                      p === page
                        ? "bg-brand-orange text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {p}
                  </button>
                </span>
              ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 transition-colors"
            >
              Next <ChevronRight className="size-3.5" />
            </button>
          </div>
        )}
      </div>

      {editingProblem && (
        <EditProblemModal
          problem={editingProblem}
          onClose={() => setEditingProblem(null)}
          onSaved={onRefresh}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Xoá bài tập"
        message={`Xoá bài tập "${deleteTarget?.title}"?\nHành động này không thể hoàn tác.`}
        confirmLabel="Xoá"
        variant="danger"
        loading={!!deletingId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
