FE/leetcode_clone/app/(app)/
├── components/
│   └── dashboard/
│       ├── AnnouncementList.tsx   <-- (Cột trái: Bảng tin hệ thống)
│       ├── HeroBanner.tsx         <-- (Banner Sự kiện/Thi đấu trên cùng)
│       ├── RightSidebar.tsx       <-- (Cột phải: Chuỗi Streak + Pick One + Discuss Now)
│       └── TrendingDiscuss.tsx    <-- (Cột trái: Các thảo luận đang rôm rả)
└── page.tsx                       <-- (File Container ghép 4 khối trên lại)



page.tsx: Nhận dữ liệu tổng từ Backend (thông qua hook useAuth).
