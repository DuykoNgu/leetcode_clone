import apiClient from "@/lib/api/client";
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

export function refreshToken(payload: { refreshToken: string }) {
  return apiClient.post<RefreshTokenResponse>("/refresh-token", payload);
}

export function logout() {
  return apiClient.post<{ message: string }>("/logout", {});
}

export function getMe() {
  return apiClient.get<MeResponse>("/me");
}

export function persistAuthSession(payload: AuthSuccessResponse["data"]) {
  localStorage.setItem("leetcode_token", payload.token);
  localStorage.setItem("leetcode_user", JSON.stringify(payload.user));
  if (payload.refreshToken) {
    localStorage.setItem("leetcode_refresh_token", payload.refreshToken);
  }
}

export function persistTokenSession(accessToken: string, refreshToken: string, user: AuthUser) {
  localStorage.setItem("leetcode_token", accessToken);
  localStorage.setItem("leetcode_refresh_token", refreshToken);
  localStorage.setItem("leetcode_user", JSON.stringify(user));
}

export function getPersistedAuthUser(): AuthUser | null {
  const rawUser = localStorage.getItem("leetcode_user");

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
  localStorage.removeItem("leetcode_token");
  localStorage.removeItem("leetcode_user");
  localStorage.removeItem("leetcode_refresh_token");
}

export function getPersistedRefreshToken(): string | null {
  return localStorage.getItem("leetcode_refresh_token");
}

export function persistRefreshToken(token: string) {
  localStorage.setItem("leetcode_refresh_token", token);
}
