"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMe, getPersistedAuthUser } from "@/lib/api/auth";
import type { AuthUser } from "@/lib/types";
import { AuthStatus } from "@/components/auth/auth-ui";
import { ProfileInfo } from "./components/ProfileInfo";
import { ProfileStats } from "./components/ProfileStats";
import { ContributionGraph } from "./components/ContributionGraph";
import { RecentActivity } from "./components/RecentActivity";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-8">
        {message && (
          <div className="mb-6">
            <AuthStatus type={message.type} message={message.text} />
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[300px_1fr]">
          {/* Left Sidebar */}
          <div className="space-y-6">
            <ProfileInfo user={user} />
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <ProfileStats user={user} />
            <ContributionGraph user={user} />
            <RecentActivity user={user} />
          </div>
        </div>
      </div>
    </main>
  );
}
