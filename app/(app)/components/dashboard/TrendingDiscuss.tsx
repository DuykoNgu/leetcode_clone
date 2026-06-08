"use client";

import { useRouter } from "next/navigation";
import { MessageSquare, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TrendingDiscuss() {
  const router = useRouter();

  const hotDiscussions = [
    { id: 101, title: "Cách tối ưu thuật toán quy hoạch động (QHD)?", author: "Nguyen Trung Hieu", upvotes: 124, replies: 23 },
    { id: 102, title: "Lỗi Time Limit Exceeded bài Two Sum bằng Python", author: "DevPro_99", upvotes: 45, replies: 12 },
    { id: 103, title: "Chia sẻ kinh nghiệm phỏng vấn Backend tại VNG", author: "CodeNewbie", upvotes: 89, replies: 34 },
  ];

  return (
    <div className="mt-4 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-rose-100 text-rose-500">
            <Flame className="size-4.5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Đang rôm rả</h2>
        </div>
        <Button variant="link" onClick={() => router.push('/discuss')} className="text-sm font-bold text-brand-orange">
          Xem tất cả thảo luận
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {hotDiscussions.map((discuss) => (
          <div key={discuss.id} onClick={() => router.push('/discuss')} className="group flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-brand-orange/50 hover:shadow-md">
            <div className="flex-1">
              <h4 className="mb-2 text-base font-bold text-slate-800 transition-colors group-hover:text-brand-orange">
                {discuss.title}
              </h4>
              <p className="text-xs font-medium text-slate-500">
                bởi <span className="font-bold text-slate-700">{discuss.author}</span>
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1"><span className="text-emerald-500">▲</span> {discuss.upvotes}</span>
              <span className="flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1"><MessageSquare className="size-3.5" /> {discuss.replies}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}