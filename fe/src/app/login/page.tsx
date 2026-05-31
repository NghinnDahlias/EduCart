"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, BookOpen } from "lucide-react";

import { api, setToken, setUser } from "@/lib/api";
import { useLocale } from "@/components/locale-provider";

const loginDictionary = {
  vi: {
    heroTitle: "Chào mừng quay lại",
    heroText:
      "Tham gia cộng đồng trao đổi sách lớn dành cho sinh viên Việt Nam. Tiết kiệm hơn, học tập tốt hơn.",
    heroStat: "Hơn 2.000+ sinh viên đã tham gia trao đổi sách tuần này.",
    title: "Đăng nhập",
    subtitle: "Nhập tài khoản của bạn để tiếp tục",
    email: "Email của bạn",
    password: "Mật khẩu",
    forgot: "Quên mật khẩu?",
    submit: "Đăng nhập",
    submitting: "Đang đăng nhập...",
    noAccount: "Chưa có tài khoản?",
    registerNow: "Đăng ký ngay",
    or: "Hoặc",
    google: "Google",
    facebook: "Facebook",
    fillAll: "Vui lòng điền đầy đủ thông tin",
    failed: "Đăng nhập thất bại",
  },
  en: {
    heroTitle: "Welcome back",
    heroText:
      "Join Vietnam's student book exchange community. Save more, study smarter.",
    heroStat: "More than 2,000 students joined book exchange this week.",
    title: "Sign in",
    subtitle: "Enter your account to continue",
    email: "Your email",
    password: "Password",
    forgot: "Forgot password?",
    submit: "Sign in",
    submitting: "Signing in...",
    noAccount: "Don't have an account?",
    registerNow: "Create one now",
    or: "Or",
    google: "Google",
    facebook: "Facebook",
    fillAll: "Please fill in all required fields",
    failed: "Sign in failed",
  },
} as const;

export default function LoginPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const t = loginDictionary[locale];
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError(t.fillAll);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await api.post<{ ok: boolean; token: string; user: Record<string, unknown> }>(
        "/auth/login",
        { email: formData.email, password: formData.password },
      );
      setToken(data.token);
      setUser(data.user);
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.failed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-gray-50">
      <div className="fixed left-0 top-0 hidden h-screen flex-col justify-between bg-blue-600 p-12 text-white lg:flex lg:w-1/2">
        <div>
          <div className="mb-12 flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold">EduCart</span>
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight">{t.heroTitle}</h1>
          <p className="mb-8 text-lg text-blue-100">{t.heroText}</p>
        </div>

        <div className="rounded-xl bg-blue-700 p-6">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex -space-x-3">
              {["A", "B", "C"].map((label) => (
                <div
                  key={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-700 bg-blue-500 text-sm font-bold"
                >
                  {label}
                </div>
              ))}
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-700 bg-white text-sm font-bold text-blue-700">
                +2K
              </div>
            </div>
          </div>
          <p className="text-sm text-blue-100">{t.heroStat}</p>
        </div>
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 sm:py-0 lg:ml-auto lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10">
            <h2 className="mb-2 text-3xl font-bold text-gray-900">{t.title}</h2>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>

          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">{t.email}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@student.edu.vn"
                  className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">{t.password}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-12 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            ) : null}

            <div className="flex justify-end">
              <Link href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                {t.forgot}
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? t.submitting : t.submit}
            </button>

            <p className="text-center text-gray-600">
              {t.noAccount}{" "}
              <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700">
                {t.registerNow}
              </Link>
            </p>
          </form>

          <div className="relative my-8 flex items-center justify-center">
            <div className="absolute w-full border-t border-gray-300" />
            <span className="relative bg-gray-50 px-3 text-sm text-gray-500">{t.or}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="rounded-lg border border-gray-300 py-3 font-medium text-gray-700 transition hover:bg-gray-50">
              {t.google}
            </button>
            <button className="rounded-lg border border-gray-300 py-3 font-medium text-gray-700 transition hover:bg-gray-50">
              {t.facebook}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
