import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { AuthUser } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { EditProfileModal } from "./EditProfileModal";
import { 
  Eye, 
  CheckCircle, 
  MessageSquare, 
  Star,
  User,
  Download,
} from "lucide-react";

interface ProfileInfoProps {
  user: AuthUser;
  onUpdate: (user: AuthUser) => void;
}

export function ProfileInfo({ user, onUpdate }: ProfileInfoProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAvatarPreview, setShowAvatarPreview] = useState(false);
  const [imgZoom, setImgZoom] = useState(1);

  useEffect(() => {
    if (!showAvatarPreview) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowAvatarPreview(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [showAvatarPreview]);

  const communityStats = [
    { label: "Views", value: 0, lastWeek: 0, icon: Eye, color: "text-blue-400" },
    { label: "Solution", value: 0, lastWeek: 0, icon: CheckCircle, color: "text-cyan-400" },
    { label: "Discuss", value: 0, lastWeek: 0, icon: MessageSquare, color: "text-emerald-400" },
    { label: "Reputation", value: 0, lastWeek: 0, icon: Star, color: "text-orange-400" },
  ];

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Basic Info Section */}
      <div className="p-2">
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
          <button
            type="button"
            onClick={() => { if (user.avatarUrl) { setShowAvatarPreview(true); setImgZoom(1); } }}
            disabled={!user.avatarUrl}
            className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200 disabled:cursor-default cursor-pointer"
          >
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.username} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
                <User className="h-10 w-10" />
              </div>
            )}
          </button>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-gray-900">{user.username}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            {user.birthday && (
              <p className="text-xs text-gray-400 mt-1">
                🎂 {formatDate(user.birthday)}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Button
            className="w-full bg-green-50 text-sm text-green-600 hover:bg-green-100 border border-green-200 shadow-none"
            onClick={() => setShowEditModal(true)}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="border-t border-gray-200" />

      {/* Community Stats Section */}
      <div className="p-2">
        <h3 className="mb-4 text-sm font-bold text-gray-900">Community Stats</h3>
        <div className="space-y-4">
          {communityStats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{stat.label}</span>
                  <span className="text-sm font-bold text-gray-900">{stat.value}</span>
                </div>
                <div className="text-[10px] text-gray-400">
                  Last week {stat.lastWeek}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onUpdate={onUpdate}
        />
      )}

      {showAvatarPreview && user.avatarUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button
            type="button"
            className="absolute inset-0 bg-black/85"
            onClick={() => setShowAvatarPreview(false)}
          />
          <button
            type="button"
            className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
            onClick={() => setShowAvatarPreview(false)}
          >
            ✕
          </button>
          <a
            href={user.avatarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 right-14 text-white/70 hover:text-white z-10"
          >
            <Download className="h-5 w-5" />
          </a>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="relative z-10"
          >
            <img
              src={user.avatarUrl}
              alt={user.username}
              onWheel={(e) => {
                e.preventDefault();
                setImgZoom(z => Math.max(0.5, Math.min(3, z - e.deltaY * 0.003)));
              }}
              style={{ transform: `scale(${imgZoom})`, transition: "transform 0.1s" }}
              className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}
