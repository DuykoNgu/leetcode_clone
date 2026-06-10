"use client";

import { useAuth } from "@/hooks/useAuth";
import HeroBanner from "./components/dashboard/HeroBanner";
import AnnouncementList from "./components/dashboard/AnnouncementList";
import TrendingDiscuss from "./components/dashboard/TrendingDiscuss";
import RightSidebar from "./components/dashboard/RightSidebar";

export default function DashboardPage() {
  const { authUser, isLoading } = useAuth();

  if (isLoading) return <div className="h-screen flex items-center justify-center text-slate-400">Đang tải trung tâm điều khiển...</div>;

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#f8fafc] p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Header Lời chào */}
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Hello World{authUser ? `, ${authUser.username}` : ""}! 👋
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            {authUser ? "Sẵn sàng để chinh phục các thử thách thuật toán hôm nay chưa?" : "Hãy đăng nhập để lưu lại tiến trình học tập của bạn."}
          </p>
        </header>

        {/* Banner Contest */}
        <HeroBanner />

        {/* Khung chứa nội dung 2 cột */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* CỘT TRÁI (65%): Bảng tin & Đang rôm rả */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <AnnouncementList />
            <TrendingDiscuss />
          </div>

          {/* CỘT PHẢI (35%): Gamification, Pick One, Discuss Now */}
          <div className="lg:col-span-4">
            <RightSidebar authUser={authUser} />
          </div>

        </div>
      </div>
    </div>
  );
}