"use client";

import { useState, type ReactNode } from "react";
import { ChevronsRight, Home, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export type NavItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
};

interface AdminLayoutProps {
  navItems: NavItem[];
  selectedNav: string;
  onNavSelect: (id: string) => void;
  onLogout: () => void;
  headerTitle: string;
  headerSubtitle: string;
  children: ReactNode;
}

export function AdminLayout({
  navItems,
  selectedNav,
  onNavSelect,
  onLogout,
  headerTitle,
  headerSubtitle,
  children,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const isDark = theme === "dark";

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <nav
        className={`shrink-0 border-r transition-all duration-300 ease-in-out flex flex-col relative ${
          sidebarOpen ? "w-64" : "w-16"
        } border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 shadow-sm`}
      >
        <div className="mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="flex items-center justify-between rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="grid size-10 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
                <span className="text-white text-lg font-bold">A</span>
              </div>
              {sidebarOpen && (
                <div>
                  <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Admin Panel
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    LeetCode Clone
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1">
          {navItems.map((item) => (
            <SidebarItem
              key={item.id}
              id={item.id}
              Icon={item.icon}
              label={item.label}
              selected={selectedNav}
              setSelected={onNavSelect}
              open={sidebarOpen}
              badge={item.badge}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <div className="flex items-center p-3">
            <div className="grid size-10 place-content-center">
              <ChevronsRight
                className={`h-4 w-4 transition-transform duration-300 text-gray-500 dark:text-gray-400 ${
                  sidebarOpen ? "rotate-180" : ""
                }`}
              />
            </div>
            {sidebarOpen && (
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Hide
              </span>
            )}
          </div>
        </button>
      </nav>

      <div className="flex flex-1 flex-col min-h-0">
        <div className="shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {headerTitle}
              </h1>
              {headerSubtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {headerSubtitle}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                title={isDark ? "Light mode" : "Dark mode"}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                title="Về trang chủ"
              >
                <Home className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto min-h-0 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

function SidebarItem({
  id,
  Icon,
  label,
  selected,
  setSelected,
  open,
  badge,
}: {
  id: string;
  Icon: React.ElementType;
  label: string;
  selected: string;
  setSelected: (id: string) => void;
  open: boolean;
  badge?: string | number;
}) {
  const isSelected = selected === id;

  return (
    <button
      type="button"
      onClick={() => setSelected(id)}
      className={`relative flex h-11 w-full items-center rounded-md transition-all duration-200 ${
        isSelected
          ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 shadow-sm border-l-2 border-blue-500"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
      }`}
    >
      <div className="grid h-full w-12 place-content-center">
        <Icon className="h-4 w-4" />
      </div>
      {open && (
        <span className="text-sm font-medium transition-opacity duration-200">
          {label}
        </span>
      )}
      {badge && open && (
        <span className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 dark:bg-blue-600 text-xs text-white font-medium">
          {badge}
        </span>
      )}
    </button>
  );
}
