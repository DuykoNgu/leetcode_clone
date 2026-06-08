"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateProfile, uploadAvatar } from "@/lib/api/auth";
import { safeStorage } from "@/lib/utils/storage";
import type { AuthUser } from "@/lib/types";
import { ImageCropModal } from "./ImageCropModal";

interface EditProfileModalProps {
  user: AuthUser;
  onClose: () => void;
  onUpdate: (user: AuthUser) => void;
}

export function EditProfileModal({ user, onClose, onUpdate }: EditProfileModalProps) {
  const [username, setUsername] = useState(user.username);
  const [birthday, setBirthday] = useState(user.birthday ? user.birthday.split("T")[0] : "");
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cropImageUrl, setCropImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setCropImageUrl(imageUrl);
    e.target.value = "";
  };

  const handleCropComplete = async (file: File) => {
    setError(null);
    try {
      const response = await uploadAvatar(file);
      const updatedUser = response.data.data.user;
      const newAvatarUrl = updatedUser.avatarUrl ?? "";

      safeStorage.setItem("leetcode_user", JSON.stringify(updatedUser));
      setAvatarPreview(newAvatarUrl);
      onUpdate(updatedUser);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(axiosError.response?.data?.message || axiosError.message || "Upload ảnh thất bại");
    } finally {
      setCropImageUrl(null);
    }
  };

  const handleSave = async () => {
    setError(null);

    if (!username || username.length < 3) {
      setError("Username phải >= 3 ký tự");
      return;
    }

    setIsLoading(true);
    try {
      const payload: Record<string, string | null> = {
        username,
        birthday: birthday || null,
      };
      const response = await updateProfile(payload);
      const updatedUser = response.data.data.user;

      safeStorage.setItem("leetcode_user", JSON.stringify(updatedUser));
      onUpdate(updatedUser);
      onClose();
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string };
      const message = axiosError.response?.data?.message || axiosError.message || "Có lỗi xảy ra";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <button
          type="button"
          aria-label="Close edit profile dialog"
          className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-2xl"
        >
          <h2 className="mb-1 text-lg font-bold text-gray-900">Chỉnh sửa hồ sơ</h2>
          <p className="mb-4 text-xs text-gray-400">Cập nhật thông tin hồ sơ của bạn</p>

          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gray-100 border border-gray-200">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
                    <User className="h-8 w-8" />
                  </div>
                )}
              </div>
              <div>
                <Button variant="outline" size="sm" onClick={handleFileSelect}>
                  Đổi ảnh
                </Button>
                <p className="mt-1 text-[10px] text-gray-400">JPG, PNG, WebP. Tối đa 5MB.</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div>
              <label htmlFor="edit-username" className="mb-1.5 block text-xs font-medium text-gray-700">
                Username
              </label>
              <input
                id="edit-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-orange focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="edit-birthday" className="mb-1.5 block text-xs font-medium text-gray-700">
                Ngày sinh
              </label>
              <input
                id="edit-birthday"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-orange focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Hủy
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </motion.div>
      </div>

      {cropImageUrl && (
        <ImageCropModal
          imageUrl={cropImageUrl}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            URL.revokeObjectURL(cropImageUrl);
            setCropImageUrl(null);
          }}
        />
      )}
    </>
  );
}
