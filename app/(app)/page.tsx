"use client";

import { useRouter } from "next/navigation";

export default function Hello2Page() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-8 text-4xl font-bold">Hello World 2</h1>
      <button
        onClick={() => router.push("/")}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Go to Hello World 1
      </button>
    </div>
  );
}
