"use client";

import Link from "next/link";
import { useRef, useState } from "react";

export function ProfileMenu({ user, onLogout }: { user: any; onLogout: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAdmin = user?.role === "admin";

  const openMenu = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsOpen(true);
  };

  const closeMenuWithDelay = () => {
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      closeTimerRef.current = null;
    }, 120);
  };

  return (
    <div
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={closeMenuWithDelay}
      onFocus={openMenu}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setIsOpen(false);
        }
      }}
    >
      <button
        type="button"
        aria-label="Open profile menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition-colors hover:border-brand-orange hover:text-brand-orange"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M4 22C4 18.6863 7.58172 16 12 16C16.4183 16 20 18.6863 20 22"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-1 w-40 rounded-md border border-gray-200 bg-white p-1 shadow-md"
        >
          {isAdmin && (
            <Link
              href="/admin"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="block rounded px-3 py-2 text-sm font-semibold text-brand-orange transition-colors hover:bg-orange-50"
            >
              Quản trị viên
            </Link>
          )}
          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className="block rounded px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
          >
            Hồ sơ cá nhân
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={onLogout}
            className="block w-full rounded px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            Đăng xuất
          </button>
        </div>
      ) : null}
    </div>
  );
}
