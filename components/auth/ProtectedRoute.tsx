"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "admin" | "user";
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = "/",
}: ProtectedRouteProps) {
  const { authUser, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để tiếp tục");
      router.replace(redirectTo);
      return;
    }

    if (requiredRole && authUser?.role !== requiredRole) {
      toast.error("Bạn không có quyền truy cập trang này");
      router.replace(requiredRole === "admin" ? "/problems" : "/");
      return;
    }
  }, [isLoading, isAuthenticated, authUser, requiredRole, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-sm text-gray-500">
        Đang tải...
      </div>
    );
  }

  // If not authenticated or wrong role, show nothing (redirect will happen in useEffect)
  if (!isAuthenticated || (requiredRole && authUser?.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}
