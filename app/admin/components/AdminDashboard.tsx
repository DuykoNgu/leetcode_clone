"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Download,
} from "lucide-react";
import { AdminLayout, type NavItem } from "@/components/ui/dashboard-with-collapsible-sidebar";
import { OverviewContent } from "./OverviewContent";
import { UsersContent } from "./UsersContent";
import { ProblemsContent } from "./ProblemsContent";
import ScraperTool from "./ScraperTool";
import { useAuth } from "@/hooks/useAuth";
import { getAdminUsers } from "@/lib/api/auth";
import { getAdminStats, getProblems } from "@/lib/api/problems";
import { toast } from "sonner";

type Tab = "overview" | "users" | "problems" | "scraper";

const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "problems", label: "Problems", icon: BookOpen },
  { id: "scraper", label: "Scraper", icon: Download },
];

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [stats, setStats] = useState({ totalUsers: 0, totalProblems: 0, totalSubmissions: 0 });
  const [users, setUsers] = useState<{ id: string; username: string; email: string; role: string }[]>([]);
  const [problems, setProblems] = useState<{ id: string; title: string; difficulty: number; isActive: boolean }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, problemsRes] = await Promise.all([
        getAdminStats(),
        getAdminUsers(),
        getProblems({ limit: 1000 }),
      ]);
      if (statsRes.success) setStats(statsRes.data);
      if (usersRes.success) setUsers(usersRes.data);
      if (problemsRes?.data) {
        setProblems((problemsRes.data as any).map((p: any) => ({
          id: p.id,
          title: p.title,
          difficulty: p.difficulty,
          isActive: p.isActive ?? true,
        })));
      }
    } catch {
      toast.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const difficultyData = useMemo(() => {
    const counts = { Easy: 0, Medium: 0, Hard: 0 };
    const colors = { Easy: "#22c55e", Medium: "#eab308", Hard: "#ef4444" };
    for (const p of problems) {
      const key = p.difficulty === 0 ? "Easy" : p.difficulty === 1 ? "Medium" : "Hard";
      counts[key]++;
    }
    return Object.entries(counts).map(([name, value]) => ({ name, value, color: colors[name as keyof typeof colors] }));
  }, [problems]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
        Đang tải dữ liệu dashboard...
      </div>
    );
  }

  return (
    <AdminLayout
      navItems={NAV_ITEMS}
      selectedNav={activeTab}
      onNavSelect={(id) => setActiveTab(id as Tab)}
      onLogout={() => logout()}
      headerTitle="Dashboard"
      headerSubtitle="Quản lý hệ thống LeetCode Clone"
    >
      {activeTab === "overview" && (
        <OverviewContent stats={stats} difficultyData={difficultyData} />
      )}
      {activeTab === "users" && <UsersContent users={users} />}
      {activeTab === "problems" && <ProblemsContent problems={problems} onRefresh={fetchData} />}
      {activeTab === "scraper" && <ScraperTool />}
    </AdminLayout>
  );
}
