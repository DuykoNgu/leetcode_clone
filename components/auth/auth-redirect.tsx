"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type AuthRedirectProps = {
  mode: "login" | "register";
};

export function AuthRedirect({ mode }: AuthRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/?${mode === "login" ? "showLogin" : "showRegister"}=true`);
  }, [mode, router]);

  return null;
}
