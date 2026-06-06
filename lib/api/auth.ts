import apiClient from "@/lib/api/client";
import { safeStorage } from "@/lib/utils/storage";
import type {
  AuthUser,
  AuthSuccessResponse,
  RefreshTokenResponse,
  RegisterPayload,
  LoginPayload,
  MeResponse,
} from "@/lib/types";

export function register(payload: RegisterPayload) {
  return apiClient.post<AuthSuccessResponse>("/register", payload);
}

export function login(payload: LoginPayload) {
  return apiClient.post<AuthSuccessResponse>("/login", payload);
}

export function adminLogin(payload: LoginPayload) {
  return apiClient.post<AuthSuccessResponse>("/admin/login", payload);
}

export function refreshToken(payload: { refreshToken: string }) {
  return apiClient.post<RefreshTokenResponse>("/refresh-token", payload);
}

export function logout() {
  return apiClient.post<{ message: string }>("/logout", {});
}

export function getMe() {
  return apiClient.get<MeResponse>("/me");
}

export async function getAdminUsers() {
  const response = await apiClient.get("/admin/users");
  return response.data;
}

export function persistAuthSession(payload: AuthSuccessResponse["data"]) {
  safeStorage.setItem("leetcode_token", payload.token);
  safeStorage.setItem("leetcode_user", JSON.stringify(payload.user));
  if (payload.refreshToken) {
    safeStorage.setItem("leetcode_refresh_token", payload.refreshToken);
  }
}

export function persistTokenSession(accessToken: string, refreshToken: string, user: AuthUser) {
  safeStorage.setItem("leetcode_token", accessToken);
  safeStorage.setItem("leetcode_refresh_token", refreshToken);
  safeStorage.setItem("leetcode_user", JSON.stringify(user));
}

export function getPersistedAuthUser(): AuthUser | null {
  const rawUser = safeStorage.getItem("leetcode_user");

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return null;
  }
}

export function clearPersistedAuthSession() {
  safeStorage.removeItem("leetcode_token");
  safeStorage.removeItem("leetcode_user");
  safeStorage.removeItem("leetcode_refresh_token");
}

export function getPersistedRefreshToken(): string | null {
  return safeStorage.getItem("leetcode_refresh_token");
}

export function persistRefreshToken(token: string) {
  safeStorage.setItem("leetcode_refresh_token", token);
}
