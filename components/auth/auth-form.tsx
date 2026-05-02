"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AuthCheckbox,
  AuthField,
  AuthFooter,
  AuthHeader,
  AuthStatus,
  AuthTermsLinks,
} from "@/components/auth/auth-ui";
import { useAuth } from "@/hooks/useAuth";
import type { AuthMode } from "@/hooks/useAuth";

type LoginPayload = { email: string; password: string };
type RegisterPayload = { username: string; email: string; password: string; confirmPassword: string };

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const { login, register } = useAuth();
  const [isPending, startSubmitTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isLogin = mode === "login";

  const handleSubmit = (formData: FormData) => {
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    startSubmitTransition(async () => {
      setErrorMessage("");
      setSuccessMessage("");

      try {
        if (isLogin) {
          await login({ email, password } as LoginPayload);
          setSuccessMessage("Login successful");
          router.replace("/");
          return;
        }

        const username = String(formData.get("username") || "").trim();
        const confirmPassword = String(formData.get("confirmPassword") || "");
        await register({ username, email, password, confirmPassword } as RegisterPayload);

        setSuccessMessage("Account created successfully");
        router.push(`/?showLogin=true`);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : `${isLogin ? "Login" : "Register"} failed`);
      }
    });
  };

  return (
    <>
      <AuthHeader
        title={isLogin ? "Sign In" : "Create Account"}
        description={isLogin ? "Access your LeetCode workspace" : "Join LeetCode today"}
      />

      <form action={handleSubmit} className="space-y-3">
        <fieldset disabled={isPending} className="space-y-3">
          {errorMessage ? <AuthStatus type="error" message={errorMessage} /> : null}
          {successMessage ? <AuthStatus type="success" message={successMessage} /> : null}

          {!isLogin ? (
            <AuthField
              id="username"
              name="username"
              label="Username"
              type="text"
              autoComplete="username"
              required
              placeholder="Choose a username"
            />
          ) : null}

          <AuthField
            id="email"
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            required
            placeholder="Enter your email"
          />

          {isLogin ? (
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="mb-0 block text-xs font-medium text-gray-700">
                  Password
                </label>
                <a href="/forgot-password" className="text-xs text-brand-orange hover:text-brand-orange/80">
                  Forgot password?
                </a>
              </div>
              <AuthField
                id="password"
                name="password"
                label=""
                type="password"
                autoComplete="current-password"
                required
                placeholder="Enter your password"
              />
            </div>
          ) : (
            <>
              <AuthField
                id="password"
                name="password"
                label="Password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Create a password"
              />

              <AuthField
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Confirm your password"
              />
            </>
          )}

          <AuthCheckbox
            id={isLogin ? "remember" : "terms"}
            name={isLogin ? "remember" : "terms"}
            required={!isLogin}
            label={
              isLogin ? (
                "Remember me"
              ) : (
                <AuthTermsLinks />
              )
            }
          />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-brand-orange py-2.5 text-sm text-white hover:bg-brand-orange/90"
          >
            {isPending ? (isLogin ? "Signing In..." : "Creating Account...") : isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </fieldset>
      </form>

      <AuthFooter
        prompt={isLogin ? "Don't have an account?" : "Already have an account?"}
        action={isLogin ? "Sign up" : "Sign in"}
        onClick={() => router.push(`/?${isLogin ? "showRegister" : "showLogin"}=true`)}
      />
    </>
  );
}
