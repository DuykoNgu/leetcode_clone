This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### 2. Cấu hình môi trường

Sao chép file `.env.example` thành `.env.local` và cập nhật các biến:

```env.local
API_HOST=localhost
API_PORT=5000
API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_API_HOST=localhost
NEXT_PUBLIC_API_PORT=5000
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api

```


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Khắc phục lỗi ngốn RAM & Treo máy (RAM Leak/Out of Memory) trên Windows

Nếu gặp hiện tượng chạy dự án Frontend (`npm run dev`) bị **ăn RAM nghiêm trọng** hoặc **sập terminal ngay lập tức**, nguyên nhân là do công cụ Turbopack mặc định của Next.js 16 gặp lỗi tương thích/rò rỉ bộ nhớ trên Windows kết hợp với việc thiếu `<Suspense>` boundary khi dùng `useSearchParams()`.

### 1. Lệnh xóa cache triệt để (khi bị lỗi hoặc biên dịch treo)

Chạy lệnh sau trong PowerShell tại thư mục `leetcode_fe` để xóa sạch cache biên dịch cũ:
```powershell
Remove-Item -Path .next, node_modules/.cache -Recurse -Force -ErrorAction SilentlyContinue
```
*(Đối với Git Bash hoặc Linux/macOS: `rm -rf .next node_modules/.cache`)*

### 2. Các thay đổi đã thực hiện để khắc phục
- **Sử dụng Webpack thay thế Turbopack:** Các câu lệnh `dev` và `build` trong [package.json](file:///d:/LeetCode/leetcode_fe/package.json) đã được cập nhật thêm flag `--webpack`:
  - `npm run dev` chạy `next dev --webpack`
  - `npm run build` chạy `next build --webpack`
- **Bổ sung Suspense Boundaries:** Toàn bộ component sử dụng `useSearchParams` (trực tiếp hoặc gián tiếp qua `useAuth`) đã được bao bọc trong thẻ `<Suspense>` tại [layout.tsx](file:///d:/LeetCode/leetcode_fe/app/(app)/layout.tsx) và [page.tsx](file:///d:/LeetCode/leetcode_fe/app/admin/page.tsx) để tránh lỗi hydration bailout và lỗi build.
