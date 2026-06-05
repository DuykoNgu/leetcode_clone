"use client";

import { useState, useEffect, useCallback } from "react";
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
import { ScraperContent } from "./ScraperContent";
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
        <OverviewContent stats={stats} onSwitchToScraper={() => setActiveTab("scraper")} />
      )}
      {activeTab === "users" && <UsersContent users={users} />}
      {activeTab === "problems" && <ProblemsContent problems={problems} />}
      {activeTab === "scraper" && <ScraperContent />}
    </AdminLayout>
  );
}
