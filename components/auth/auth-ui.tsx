"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-2xl"
    >
      {children}
    </motion.div>
  );
}

export function AuthHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-3 text-center">
      <h1 className="mb-1.5 text-base font-bold text-gray-900">{title}</h1>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );
}

type AuthFieldProps = {
  id: string;
  name: string;
  label: string;
  type: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
};

export function AuthField({
  id,
  name,
  label,
  type,
  autoComplete,
  placeholder,
  required,
}: AuthFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-orange focus:outline-none"
      />
    </div>
  );
}

export function AuthCheckbox({
  id,
  name,
  label,
  required,
}: {
  id: string;
  name: string;
  label: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        name={name}
        required={required}
        className="h-3.5 w-3.5 rounded border-gray-300 text-brand-orange focus:ring-brand-orange"
      />
      <label htmlFor={id} className="ml-1.5 text-xs text-gray-600">
        {label}
      </label>
    </div>
  );
}

export function AuthStatus({
  type,
  message,
}: {
  type: "error" | "success";
  message: string;
}) {
  const statusClassName =
    type === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-emerald-200 bg-emerald-50 text-emerald-700";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`rounded-md border px-3 py-2 text-xs ${statusClassName}`}
    >
      {message}
    </div>
  );
}

export function AuthFooter({
  prompt,
  action,
  onClick,
}: {
  prompt: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <div className="mt-2 text-center">
      <p className="text-xs text-gray-600">
        {prompt}{" "}
        <button
          type="button"
          onClick={onClick}
          className="font-medium text-brand-orange hover:text-brand-orange/80"
        >
          {action}
        </button>
      </p>
    </div>
  );
}

export function AuthTermsLinks() {
  return (
    <>
      Tôi đồng ý với{" "}
      <Link href="/terms" className="text-brand-orange hover:text-brand-orange/80">
        Điều khoản Dịch vụ
      </Link>{" "}
      và{" "}
      <Link href="/privacy" className="text-brand-orange hover:text-brand-orange/80">
        Chính sách Bảo mật
      </Link>
    </>
  );
}
