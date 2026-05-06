"use client";

import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { NavLinks } from "@/components/nav/nav-links";
import { ProfileMenu } from "@/components/nav/profile-menu";
import { AuthModal } from "@/components/auth/auth-modal";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";

const Nav: React.FC = () => {
  const pathname = usePathname();
  const {
    authUser,
    isLoading,
    showAuthModal,
    authMode,
    logout,
  } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const closeAuthModal = () => {
    window.history.replaceState(null, "", pathname);
  };

  const openLoginModal = () => {
    window.history.pushState(null, "", `${pathname}?showLogin=true`);
  };

  const openRegisterModal = () => {
    window.history.pushState(null, "", `${pathname}?showRegister=true`);
  };

  return (
    <nav className="relative flex h-[60px] w-full shrink-0 items-center border-b border-gray-200 bg-white px-4">
      <header className="mt-3 flex w-full items-center justify-between">
        <div className="flex items-center gap-5">
          <Link href="/problems" className="flex items-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              className="text-brand-orange"
            >
              <path
                fill="currentColor"
                d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"
              />
            </svg>
          </Link>

          <NavLinks activePath={pathname} />
        </div>

        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />
          ) : authUser ? (
            <ProfileMenu onLogout={handleLogout} />
          ) : (
            <>
              <Button
                type="button"
                onClick={openLoginModal}
                className="inline-flex bg-brand-orange text-white hover:bg-brand-orange/90"
              >
                Sign In
              </Button>
              <Button
                type="button"
                onClick={openRegisterModal}
                variant="outline"
                className="inline-flex border-brand-orange text-brand-orange hover:bg-brand-orange/10"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Global Auth Modal */}
      {showAuthModal && (
        <AuthModal key={authMode} mode={authMode} onClose={closeAuthModal} />
      )}
    </nav>
  );
};

export default Nav;

