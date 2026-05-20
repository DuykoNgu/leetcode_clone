"use client";

import { useTransition, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const { login, adminLogin, register } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
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
          setSuccessMessage("Đăng nhập thành công");
          
          const redirectTo = searchParams.get("redirectTo");
          if (redirectTo) {
            router.replace(redirectTo);
          } else {
            // Stay on current page but remove auth query params
            router.replace(window.location.pathname);
          }
          return;
        }

        const username = String(formData.get("username") || "").trim();
        const confirmPassword = String(formData.get("confirmPassword") || "");
        await register({ username, email, password, confirmPassword } as RegisterPayload);

        setSuccessMessage("Tạo tài khoản thành công");
        router.push(`/?showLogin=true`);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : `${isLogin ? "Đăng nhập" : "Đăng ký"} thất bại`);
      }
    });
  };

  const handleAdminLogin = () => {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    if (!email || !password) {
      setErrorMessage("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    startSubmitTransition(async () => {
      setErrorMessage("");
      setSuccessMessage("");

      try {
        await adminLogin({ email, password } as LoginPayload);
        setSuccessMessage("Đăng nhập Quản trị viên thành công");
        router.replace("/admin");
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Đăng nhập Quản trị viên thất bại");
      }
    });
  };

  return (
    <>
      <AuthHeader
        title={isLogin ? "Đăng nhập" : "Tạo tài khoản"}
        description={isLogin ? "Truy cập không gian làm việc của bạn" : "Tham gia LeetCode ngay hôm nay"}
      />

      <form ref={formRef} action={handleSubmit} className="space-y-3">
        <fieldset disabled={isPending} className="space-y-3">
          {errorMessage ? <AuthStatus type="error" message={errorMessage} /> : null}
          {successMessage ? <AuthStatus type="success" message={successMessage} /> : null}

          {!isLogin ? (
            <AuthField
              id="username"
              name="username"
              label="Tên đăng nhập"
              type="text"
              autoComplete="username"
              required
              placeholder="Chọn một tên đăng nhập"
            />
          ) : null}

          <AuthField
            id="email"
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            required
            placeholder="Nhập email của bạn"
          />

          {isLogin ? (
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="mb-0 block text-xs font-medium text-gray-700">
                  Mật khẩu
                </label>
                <a href="/forgot-password" className="text-xs text-brand-orange hover:text-brand-orange/80">
                  Quên mật khẩu?
                </a>
              </div>
              <AuthField
                id="password"
                name="password"
                label=""
                type="password"
                autoComplete="current-password"
                required
                placeholder="Nhập mật khẩu của bạn"
              />
            </div>
          ) : (
            <>
              <AuthField
                id="password"
                name="password"
                label="Mật khẩu"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Tạo mật khẩu mới"
              />

              <AuthField
                id="confirmPassword"
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Nhập lại mật khẩu của bạn"
              />
            </>
          )}

          <AuthCheckbox
            id={isLogin ? "remember" : "terms"}
            name={isLogin ? "remember" : "terms"}
            required={!isLogin}
            label={
              isLogin ? (
                "Ghi nhớ đăng nhập"
              ) : (
                <AuthTermsLinks />
              )
            }
          />

          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-brand-orange py-2.5 text-sm text-white hover:bg-brand-orange/90"
            >
              {isPending ? (isLogin ? "Đang đăng nhập..." : "Đang tạo tài khoản...") : isLogin ? "Đăng nhập" : "Đăng ký"}
            </Button>

            {isLogin && (
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={handleAdminLogin}
                className="w-full border-brand-orange text-brand-orange hover:bg-brand-orange/5"
              >
                Đăng nhập với quyền Quản trị viên
              </Button>
            )}
          </div>
        </fieldset>
      </form>

      <AuthFooter
        prompt={isLogin ? "Bạn chưa có tài khoản?" : "Bạn đã có tài khoản?"}
        action={isLogin ? "Đăng ký" : "Đăng nhập"}
        onClick={() => router.push(`/?${isLogin ? "showRegister" : "showLogin"}=true`)}
      />
    </>
  );
}
