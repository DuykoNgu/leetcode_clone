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
      {children}
      <Toaster richColors position="top-center" />
    </>
  );
}
