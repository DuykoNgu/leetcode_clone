"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getMe, logout, clearPersistedAuthSession, getPersistedAuthUser } from "@/lib/api/auth";
import type { AuthUser } from "@/lib/types";
import { AuthStatus } from "@/components/auth/auth-ui";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMe();
        setUser(response.data.data.user);
      } catch (error) {
        const localUser = getPersistedAuthUser();
        if (localUser) {
          setUser(localUser);
        } else {
          setMessage({
            type: "error",
            text: error instanceof Error ? error.message : "Failed to load profile",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setMessage(null);
    try {
      await logout();
      clearPersistedAuthSession();
      setMessage({ type: "success", text: "Logged out successfully" });
      setTimeout(() => {
        router.push("/login");
        router.refresh();
      }, 1000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Logout failed",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
        <p className="mt-2 text-sm text-gray-600">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
        <p className="mt-2 text-sm text-gray-600">
          You are not logged in.{" "}
          <a href="/login" className="text-brand-orange hover:underline">
            Sign in
          </a>{" "}
          to view your profile.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>

      {message && <AuthStatus type={message.type} message={message.text} />}

      <div className="mt-6 space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-gray-200 bg-gray-50 text-2xl font-semibold text-gray-500">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.username} className="h-full w-full rounded-full object-cover" />
            ) : (
              user.username.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{user.username}</h2>
            <p className="text-sm text-gray-600">{user.email}</p>
            <div className="mt-1">
              <span className="inline-flex items-center rounded-full bg-brand-orange/10 px-2.5 py-0.5 text-xs font-medium text-brand-orange capitalize">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="text-2xl font-bold text-gray-900">{user.solvedCount ?? 0}</p>
            <p className="text-xs text-gray-600">Problems Solved</p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="text-2xl font-bold text-gray-900">{user.streakDays ?? 0}</p>
            <p className="text-xs text-gray-600">Day Streak</p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="text-lg font-semibold text-gray-900">
              {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : "Never"}
            </p>
            <p className="text-xs text-gray-600">Last Active</p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="text-lg font-semibold text-gray-900">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
            </p>
            <p className="text-xs text-gray-600">Joined</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            variant="destructive"
            className="w-full sm:w-auto"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </main>
  );
}
