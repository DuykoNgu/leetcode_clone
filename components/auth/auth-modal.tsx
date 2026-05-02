"use client";

import { useEffect, useState } from "react";
import { AuthCard } from "@/components/auth/auth-ui";
import { AuthForm } from "@/components/auth/auth-form";

export function AuthModal({
  mode,
  onClose,
}: {
  mode: "login" | "register";
  onClose: () => void;
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(onClose, 150);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close authentication dialog"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={handleClose}
      />
      <div className="relative z-10 w-full max-w-sm">
        <AuthCard>
          <AuthForm mode={mode} />
        </AuthCard>
      </div>
    </div>
  );
}
