"use client";

import { Megaphone, Plus, X, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnnouncementListProps {
  isAdmin: boolean;
}

export default function AnnouncementList({ isAdmin }: AnnouncementListProps) {
  // Mock data (Đã xóa thuộc tính isPinned)
  const announcements = [
    { id: 1, title: "Cập nhật hệ thống chấm code tự động", content: "Hệ thống đã hỗ trợ phiên bản C++20 và Java 17. Chúc các bạn luyện tập tốt!", date: "Vừa xong" },
    { id: 2, title: "Sự kiện: Tuần lễ thuật toán Đồ thị", content: "Hoàn thành 5 bài đồ thị trong tuần này để nhận huy hiệu độc quyền.", date: "2 ngày trước" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <Megaphone className="size-4.5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Bảng tin hệ thống</h2>
        </div>
        
        {isAdmin && (
          <Button size="sm" variant="outline" className="border-brand-orange text-brand-orange hover:bg-brand-orange/10 font-bold">
            <Plus className="mr-1.5 size-4" /> Viết thông báo
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {announcements.map((item) => (
          <div key={item.id} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{item.content}</p>
              </div>

              {/* Công cụ của Admin */}
              {isAdmin && (
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:bg-blue-50 hover:text-blue-600">
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:bg-red-50 hover:text-red-600">
                    <X className="size-5" />
                  </Button>
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center text-xs font-medium text-slate-400">
              <span className="rounded-md bg-slate-100 px-2 py-1">Quản trị viên</span>
              <span className="mx-2">•</span>
              <span>{item.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}