import { Metadata } from "next";
import { AuthRedirect } from "@/components/auth/auth-redirect";

export const metadata: Metadata = {
  title: "Đăng ký | LeetCode Clone",
};

export default function RegisterPage() {
  return <AuthRedirect mode="register" />;
}
