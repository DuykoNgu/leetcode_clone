"use client";

import { useRouter } from "next/navigation";

export default function Hello2Page() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Hello World 2</h1>
      <button
        onClick={() => router.push("/")}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Quay lại trang chủ
      </button>
    </div>
  );
}