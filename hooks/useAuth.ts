"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  register as registerApi,
  login as loginApi,
  logout as logoutApi,
  getMe as getMeApi,
  persistAuthSession,
  clearPersistedAuthSession,
  getPersistedAuthUser,
  getPersistedRefreshToken,
  refreshToken as refreshTokenApi,
  persistTokenSession,
  adminLogin as adminLoginApi,
} from "@/lib/api/auth";
import type { AuthUser, RegisterPayload, LoginPayload } from "@/lib/types";

export type AuthMode = "login" | "register";

// ========================================
// Core auth state hook
// ========================================
export function useAuth() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSyncingRef = useRef(false);

  // Fetch user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getMeApi();
        setAuthUser(response.data.data.user);
      } catch {
        setAuthUser(getPersistedAuthUser());
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();

    const syncAuthUser = () => {
      if (isSyncingRef.current) return;
      setAuthUser(getPersistedAuthUser());
    };
    window.addEventListener("storage", syncAuthUser);
    return () => window.removeEventListener("storage", syncAuthUser);
  }, []);

  // Modal state derived from URL params
  const showLogin = searchParams.get("showLogin") === "true";
  const showRegister = searchParams.get("showRegister") === "true";
  const showAuthModal = showLogin || showRegister;
  const authMode: AuthMode = showRegister ? "register" : "login";

  // Token refresh (manual trigger)
  const refreshToken = useCallback(async () => {
    const token = getPersistedRefreshToken();
    if (!token || !authUser) return;
    try {
      const res = await refreshTokenApi({ refreshToken: token });
      persistTokenSession(res.data.accessToken, res.data.refreshToken, authUser);
    } catch {
      // silently ignore refresh failure
    }
  }, [authUser]);

  // Login
  const login = useCallback(async (payload: LoginPayload) => {
    const res = await loginApi(payload);
    const data = res.data.data;
    persistAuthSession(data);
    setAuthUser(data.user);
    window.dispatchEvent(new Event("storage"));
    toast.success("Đăng nhập thành công");
    return data;
  }, []);

  // Admin Login
  const adminLogin = useCallback(async (payload: LoginPayload) => {
    const res = await adminLoginApi(payload);
    const data = res.data.data;
    persistAuthSession(data);
    setAuthUser(data.user);
    window.dispatchEvent(new Event("storage"));
    toast.success("Đăng nhập Admin thành công");
    return data;
  }, []);

  // Register
  const register = useCallback(async (payload: RegisterPayload) => {
    const res = await registerApi(payload);
    toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
    return res.data.data;
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // ignore API errors during logout
    } finally {
      clearPersistedAuthSession();
      setAuthUser(null);
      window.dispatchEvent(new Event("storage"));
      toast.info("Đã đăng xuất");
      router.push("/");
    }
  }, [router]);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const res = await getMeApi();
      setAuthUser(res.data.data.user);
    } catch {
      setAuthUser(getPersistedAuthUser());
    }
  }, []);

  return {
    authUser,
    isLoading,
    isAuthenticated: !!authUser,
    showAuthModal,
    authMode,
    login,
    adminLogin,
    register,
    logout,
    refreshUser,
    refreshToken,
  };
}
