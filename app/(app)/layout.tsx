import { Suspense } from "react";
import { Toaster } from "sonner";
import Nav from "@/components/Nav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<div className="h-[60px] w-full" />}>
        <Nav />
      </Suspense>
      <Suspense fallback={<div className="h-screen flex items-center justify-center text-sm text-gray-500">Đang tải...</div>}>
        {children}
      </Suspense>
      <Toaster richColors position="top-center" />
    </>
  );
}
