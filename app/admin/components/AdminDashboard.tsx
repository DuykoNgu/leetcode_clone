"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  LogOut, LayoutDashboard, Users, BookOpen, Download,
  TrendingUp, UserCheck, FileText, Search, User,
  Bell, Sparkles, ArrowRight, Zap, Clock,
} from "lucide-react";
import ImportProblem from "./ImportProblem";
import ScraperTool from "./ScraperTool";
import { useAuth } from "@/hooks/useAuth";
import { getAdminUsers } from "@/lib/api/auth";
import { getAdminStats, getProblems } from "@/lib/api/problems";
import { toast } from "sonner";

type Tab = "overview" | "users" | "problems" | "scraper";

const SIDEBAR_ITEMS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users",    label: "Users",    icon: Users },
  { id: "problems", label: "Problems", icon: BookOpen },
  { id: "scraper",  label: "Scraper",  icon: Download },
];

const STAT_CARDS = [
  {
    key: "totalUsers" as const,
    label: "Người dùng",
    icon: UserCheck,
    gradient: "from-blue-500 to-indigo-600",
    thumbBg: "bg-blue-100 dark:bg-blue-900/40",
    thumbText: "text-blue-600 dark:text-blue-400",
    hue: 220,
  },
  {
    key: "totalProblems" as const,
    label: "Câu hỏi",
    icon: FileText,
    gradient: "from-emerald-500 to-teal-600",
    thumbBg: "bg-emerald-100 dark:bg-emerald-900/40",
    thumbText: "text-emerald-600 dark:text-emerald-400",
    hue: 160,
  },
  {
    key: "totalSubmissions" as const,
    label: "Lượt giải",
    icon: TrendingUp,
    gradient: "from-amber-500 to-orange-600",
    thumbBg: "bg-amber-100 dark:bg-amber-900/40",
    thumbText: "text-amber-600 dark:text-amber-400",
    hue: 38,
  },
] as const;

function AnimatedCounter({ value, duration = 800 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const from = display;
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (progress < 1) ref.current = requestAnimationFrame(step);
    };
    ref.current = requestAnimationFrame(step);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return <>{display.toLocaleString()}</>;
}

function Sparkline({ hue }: { hue: number }) {
  const points = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i < 20; i++) {
      const x = (i / 19) * 64;
      const y = 20 - (Math.sin(i * 0.8 + 1) * 8 + Math.cos(i * 0.3 + 0.5) * 4 + 4);
      pts.push(`${x},${y}`);
    }
    return pts.join(" ");
  }, []);
  return (
    <svg width={64} height={24} viewBox="0 0 64 24" className="shrink-0">
      <defs>
        <linearGradient id={`spark-fill-${hue}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={`hsl(${hue},60%,55%)`} stopOpacity={0.35} />
          <stop offset="100%" stopColor={`hsl(${hue},60%,55%)`} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polyline
        fill={`url(#spark-fill-${hue})`}
        stroke={`hsl(${hue},55%,50%)`}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

const MOCK_ACTIVITIES = [
  { action: "Đăng ký mới", icon: User, color: "text-blue-500" },
  { action: "Giải bài", icon: Zap, color: "text-emerald-500" },
  { action: "Import bài tập", icon: BookOpen, color: "text-amber-500" },
];

function getRandomActivity(username: string) {
  const act = MOCK_ACTIVITIES[Math.floor(Math.random() * MOCK_ACTIVITIES.length)];
  return { ...act, username };
}

function formatTimeAgo(iso?: string | null) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} giờ trước`;
  const days = Math.floor(hrs / 24);
  return `${days} ngày trước`;
}

function Pagination({
  current, total, onChange,
}: {
  current: number; total: number; onChange: (n: number) => void;
}) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1.5 py-4">
      <button
        disabled={current === 0}
        onClick={() => onChange(current - 1)}
        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        Prev
      </button>
      {Array.from({ length: Math.min(total, 7) }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={`min-w-[32px] px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            i === current
              ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          {i + 1}
        </button>
      ))}
      {total > 7 && (
        <span className="text-xs text-gray-400">...</span>
      )}
      <button
        disabled={current === total - 1}
        onClick={() => onChange(current + 1)}
        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        Next
      </button>
    </div>
  );
}

const PAGE_SIZE = 8;

export default function AdminDashboard() {
  const { authUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [stats, setStats] = useState({ totalUsers: 0, totalProblems: 0, totalSubmissions: 0 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchUser, setSearchUser] = useState("");
  const [searchProblem, setSearchProblem] = useState("");
  const [userPage, setUserPage] = useState(0);
  const [problemPage, setProblemPage] = useState(0);

  const handleSearchUser = (val: string) => { setSearchUser(val); setUserPage(0); };
  const handleSearchProblem = (val: string) => { setSearchProblem(val); setProblemPage(0); };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const [statsRes, usersRes, problemsRes] = await Promise.all([
          getAdminStats(),
          getAdminUsers(),
          getProblems({ limit: 100 }),
        ]);
        if (cancelled) return;
        if (statsRes.success) setStats(statsRes.data);
        if (usersRes.success) setUsers(usersRes.data);
        if (problemsRes.success) setProblems(problemsRes.data);
      } catch {
        if (!cancelled) toast.error("Không thể tải dữ liệu");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const filteredUsers = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => users.filter((u: any) =>
      u.username?.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchUser.toLowerCase())
    ),
    [users, searchUser]
  );

  const filteredProblems = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => problems.filter((p: any) =>
      p.title?.toLowerCase().includes(searchProblem.toLowerCase())
    ),
    [problems, searchProblem]
  );

  const paginatedUsers = useMemo(
    () => filteredUsers.slice(userPage * PAGE_SIZE, (userPage + 1) * PAGE_SIZE),
    [filteredUsers, userPage]
  );

  const paginatedProblems = useMemo(
    () => filteredProblems.slice(problemPage * PAGE_SIZE, (problemPage + 1) * PAGE_SIZE),
    [filteredProblems, problemPage]
  );

  const userTotalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const problemTotalPages = Math.ceil(filteredProblems.length / PAGE_SIZE);

  const recentActivities = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => users.slice(0, 6).map((u: any, i: number) => ({
      ...getRandomActivity(u.username),
      minutes: (i + 1) * 3,
    })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [users]
  );

  const diffLabel = (d: number) =>
    d === 0 ? "Easy" : d === 1 ? "Medium" : "Hard";
  const diffColor = (d: number) =>
    d === 0
      ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800"
      : d === 1
      ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800"
      : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800";

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 dark:border-gray-600 dark:border-t-gray-100" />
          Đang tải dữ liệu dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* ──────────────────────────────────────────────── */}
      {/*  Sidebar                                        */}
      {/* ──────────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        {/* User info */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center overflow-hidden shrink-0">
              {authUser?.avatarUrl ? (
                <img src={authUser.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <User size={18} className="text-gray-500 dark:text-gray-400" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate text-gray-900 dark:text-gray-100">
                {authUser?.username ?? "Admin"}
              </p>
              <span className="inline-block text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 leading-tight">
                admin
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {SIDEBAR_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === id
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              }`}
            >
              <Icon size={18} />
              {label}
              {id === "scraper" && (
                <span className="ml-auto text-[9px] uppercase bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-bold px-1.5 py-0.5 rounded-full">
                  New
                </span>
              )}
              {id === "users" && users.length > 0 && (
                <span className="ml-auto text-[10px] font-bold text-gray-400 dark:text-gray-500">
                  {users.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <LogOut size={18} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
            {authUser?.avatarUrl ? (
              <img src={authUser.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <User size={14} className="text-gray-500" />
            )}
          </div>
          <h1 className="text-base font-bold">Admin</h1>
        </div>
        <button
          onClick={() => logout()}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
        >
          <LogOut size={14} /> Đăng xuất
        </button>
      </div>

      {/* ── Mobile tabs ── */}
      <div className="md:hidden flex gap-1 px-4 py-2 overflow-x-auto border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        {SIDEBAR_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === id
                ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* ──────────────────────────────────────────────── */}
      {/*  Main Content                                  */}
      {/* ──────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto p-4 md:p-8">
        {/* ════════════════════════════════════════════ */}
        {/*  OVERVIEW                                   */}
        {/* ════════════════════════════════════════════ */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              {STAT_CARDS.map((card) => {
                const value = stats[card.key];
                return (
                  <div
                    key={card.key}
                    className="relative group overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-transparent"
                  >
                    {/* Gradient glow on hover */}
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-[0.08] dark:group-hover:opacity-[0.12] bg-gradient-to-br ${card.gradient} transition-opacity duration-500`}
                    />
                    <div className="relative flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {card.label}
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                          <AnimatedCounter value={value} />
                        </p>
                      </div>
                      <div className={`rounded-xl p-3 ${card.thumbBg} ${card.thumbText}`}>
                        <card.icon size={22} />
                      </div>
                    </div>
                    {/* Sparkline */}
                    <div className="relative mt-4 flex items-end justify-between">
                      <Sparkline hue={card.hue} />
                      <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
                        +{[4, 7, 12][STAT_CARDS.indexOf(card)]}% tháng này
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Two-column: Recent Activity + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Bell size={16} className="text-gray-400" />
                    <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Hoạt động gần đây</h2>
                  </div>
                  <span className="text-[10px] text-gray-400">Hôm nay</span>
                </div>
                {recentActivities.length === 0 ? (
                  <div className="py-6 text-center text-sm text-gray-400">Chưa có hoạt động</div>
                ) : (
                  <div className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
                    {recentActivities.map((act, i) => (
                      <div key={i} className="flex items-center gap-3 py-3">
                        <div className={`p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 ${act.color}`}>
                          <act.icon size={14} />
                        </div>
                        <p className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">{act.username}</span>{" "}
                          <span className="text-gray-500">{act.action}</span>
                        </p>
                        <Clock size={12} className="text-gray-400 shrink-0" />
                        <span className="text-[10px] text-gray-400 shrink-0 whitespace-nowrap">
                          {act.minutes} phút trước
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={16} className="text-gray-400" />
                  <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Quick Actions</h2>
                </div>
                <div className="space-y-2.5">
                  <button
                    onClick={() => setActiveTab("scraper")}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-900/50 text-sm font-medium text-blue-700 dark:text-blue-300 hover:shadow-sm transition-all"
                  >
                    <span>Import bài tập</span>
                    <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={() => setActiveTab("users")}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-900/50 text-sm font-medium text-emerald-700 dark:text-emerald-300 hover:shadow-sm transition-all"
                  >
                    <span>Quản lý users</span>
                    <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={() => setActiveTab("problems")}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-100 dark:border-amber-900/50 text-sm font-medium text-amber-700 dark:text-amber-300 hover:shadow-sm transition-all"
                  >
                    <span>Quản lý bài tập</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
                <div className="mt-6 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700 text-center">
                  <Download size={20} className="mx-auto text-gray-300 dark:text-gray-600 mb-1" />
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">
                    Crawl trực tiếp từ LeetCode
                  </p>
                  <div className="mt-2 flex justify-center">
                    <ImportProblem />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════ */}
        {/*  USERS                                     */}
        {/* ════════════════════════════════════════════ */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative max-w-xs w-full">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm user..."
                  value={searchUser}
                  onChange={(e) => handleSearchUser(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                />
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                    <tr>
                      <th className="px-6 py-3.5 font-semibold text-gray-700 dark:text-gray-300">User</th>
                      <th className="px-6 py-3.5 font-semibold text-gray-700 dark:text-gray-300">Email</th>
                      <th className="px-6 py-3.5 font-semibold text-gray-700 dark:text-gray-300">Role</th>
                      <th className="px-6 py-3.5 font-semibold text-gray-700 dark:text-gray-300">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {paginatedUsers.map((u: any) => (
                      <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center overflow-hidden shrink-0">
                              {u.avatarUrl ? (
                                <img src={u.avatarUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <User size={14} className="text-gray-500 dark:text-gray-400" />
                              )}
                            </div>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {u.username}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-lg border ${
                            u.role === "admin"
                              ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800"
                              : "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${u.lastActive ? "bg-green-500" : "bg-gray-400 dark:bg-gray-600"}`} />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {u.lastActive ? formatTimeAgo(u.lastActive) : "Không hoạt động"}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {paginatedUsers.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
                          Không tìm thấy user
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination current={userPage} total={userTotalPages} onChange={setUserPage} />
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════ */}
        {/*  PROBLEMS                                  */}
        {/* ════════════════════════════════════════════ */}
        {activeTab === "problems" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative max-w-xs w-full">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm bài tập..."
                  value={searchProblem}
                  onChange={(e) => handleSearchProblem(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                />
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {filteredProblems.length} bài tập
              </span>
            </div>

            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                    <tr>
                      <th className="px-6 py-3.5 font-semibold text-gray-700 dark:text-gray-300">Title</th>
                      <th className="px-6 py-3.5 font-semibold text-gray-700 dark:text-gray-300">Difficulty</th>
                      <th className="px-6 py-3.5 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {paginatedProblems.map((p: any) => (
                      <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{p.title}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-medium px-2 py-1 rounded-lg border ${diffColor(p.difficulty)}`}>
                            {diffLabel(p.difficulty)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${p.isActive ? "bg-green-500" : "bg-gray-400 dark:bg-gray-600"}`} />
                            <span className="text-gray-600 dark:text-gray-400">
                              {p.isActive ? "Active" : "Hidden"}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {paginatedProblems.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
                          Không tìm thấy bài tập
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination current={problemPage} total={problemTotalPages} onChange={setProblemPage} />
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════ */}
        {/*  SCRAPER                                   */}
        {/* ════════════════════════════════════════════ */}
        {activeTab === "scraper" && (
          <div>
            <div className="mb-6">
              <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">Scraper Tool</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Cào bài tập từ LeetCode theo số lượng và danh mục tùy chọn.
              </p>
            </div>
            <ScraperTool />
          </div>
        )}
      </main>
    </div>
  );
}
