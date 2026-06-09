import { Metadata } from "next";
import { AuthRedirect } from "@/components/auth/auth-redirect";

export const metadata: Metadata = {
  title: "Đăng nhập | LeetCode Clone",
};

export default function LoginPage() {
  return <AuthRedirect mode="login" />;
}
