"use client";

/**
 * FILE: app/admin/components/AdminDashboard.tsx  (THAY THẾ HOÀN TOÀN)
 *
 * Thêm tab "Scraper" tích hợp ScraperTool.
 */

import React, { useState, useEffect, useCallback } from "react";
import { LogOut, LayoutDashboard, Users, BookOpen, Download } from "lucide-react";
import ImportProblem from "./ImportProblem";
import ScraperTool from "./ScraperTool";
import { useAuth } from "@/hooks/useAuth";
import { getAdminUsers } from "@/lib/api/auth";
import { getAdminStats, getProblems } from "@/lib/api/problems";
import { toast } from "sonner";

type Tab = "overview" | "users" | "problems" | "scraper";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "overview",  label: "Overview",  icon: LayoutDashboard },
  { id: "users",     label: "Users",     icon: Users },
  { id: "problems",  label: "Problems",  icon: BookOpen },
  { id: "scraper",   label: "Scraper",   icon: Download },
];

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [stats, setStats] = useState({ totalUsers: 0, totalProblems: 0, totalSubmissions: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, problemsRes] = await Promise.all([
        getAdminStats(),
        getAdminUsers(),
        getProblems({ limit: 100 }),
      ]);
      if (statsRes.success) setStats(statsRes.data);
      if (usersRes.success) setUsers(usersRes.data);
      if (problemsRes.success) setProblems(problemsRes.data);
    } catch {
      toast.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-sm text-gray-500">
        Đang tải dữ liệu dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans p-6 max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center mb-10 border-b pb-6">
        <div>
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="text-xs text-gray-500 mt-1">Quản lý hệ thống LeetCode Clone</p>
        </div>
        <button
          onClick={() => logout()}
          className="text-xs flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <LogOut size={14} /> Đăng xuất
        </button>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`
              flex items-center gap-2 px-4 pb-4 text-sm font-medium transition-all
              ${
                activeTab === id
                  ? "border-b-2 border-gray-900 text-gray-900"
                  : "text-gray-400 hover:text-gray-600"
              }
            `}
          >
            <Icon size={14} />
            {label}
            {id === "scraper" && (
              <span className="ml-1 text-[9px] uppercase bg-blue-100 text-blue-600 font-bold px-1.5 py-0.5 rounded-full tracking-wide">
                New
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="py-2">
        {/* ── Overview ── */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg">
              <p className="text-xs text-gray-400 uppercase font-bold mb-1">Người dùng</p>
              <p className="text-3xl font-light">{stats.totalUsers}</p>
            </div>
            <div className="p-6 border rounded-lg">
              <p className="text-xs text-gray-400 uppercase font-bold mb-1">Câu hỏi</p>
              <p className="text-3xl font-light">{stats.totalProblems}</p>
            </div>
            <div className="p-6 border rounded-lg">
              <p className="text-xs text-gray-400 uppercase font-bold mb-1">Lượt giải</p>
              <p className="text-3xl font-light">{stats.totalSubmissions}</p>
            </div>

            {/* Quick import card */}
            <div className="md:col-span-3 mt-4 p-8 border border-dashed rounded-lg flex flex-col items-center justify-center gap-4">
              <p className="text-sm text-gray-500 text-center">
                Thêm bài từ LeetCode nhanh hoặc dùng{" "}
                <button
                  onClick={() => setActiveTab("scraper")}
                  className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
                >
                  Scraper Tool
                </button>{" "}
                để cào hàng loạt.
              </p>
              <ImportProblem />
            </div>
          </div>
        )}

        {/* ── Users ── */}
        {activeTab === "users" && (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 font-semibold">User</th>
                  <th className="px-6 py-3 font-semibold">Email</th>
                  <th className="px-6 py-3 font-semibold">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{u.username}</td>
                    <td className="px-6 py-4 text-gray-500">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] uppercase font-bold border px-1.5 py-0.5 rounded">
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Problems ── */}
        {activeTab === "problems" && (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 font-semibold">Title</th>
                  <th className="px-6 py-3 font-semibold">Difficulty</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {problems.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{p.title}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium ${
                          p.difficulty === 0
                            ? "text-green-600"
                            : p.difficulty === 1
                            ? "text-amber-600"
                            : "text-red-500"
                        }`}
                      >
                        {p.difficulty === 0 ? "Easy" : p.difficulty === 1 ? "Medium" : "Hard"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`w-2 h-2 inline-block rounded-full mr-2 ${
                          p.isActive ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                      {p.isActive ? "Active" : "Hidden"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Scraper ── */}
        {activeTab === "scraper" && (
          <div>
            <div className="mb-6">
              <h2 className="text-base font-semibold text-gray-800">Scraper Tool</h2>
              <p className="text-sm text-gray-500 mt-1">
                Cào bài tập từ LeetCode theo số lượng và danh mục tùy chọn. Hệ thống chạy nền,
                bạn có thể theo dõi tiến độ real-time bên dưới.
              </p>
            </div>
            <ScraperTool />
          </div>
        )}
      </div>
    </div>
  );
}
