"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Eye, EyeOff, BookOpen } from "lucide-react";

import { api } from "@/lib/api";
import { useLocale } from "@/components/locale-provider";

const registerDictionary = {
  vi: {
    heroTitle: "Cùng bạn kiến tạo tri thức mới.",
    heroText:
      "Tham gia cộng đồng trao đổi sách lớn dành riêng cho sinh viên Việt Nam. Tiết kiệm hơn, học tập tốt hơn.",
    heroStat: "Hơn 2.000 sinh viên đã tham gia trao đổi sách tuần này.",
    title: "Tạo tài khoản mới",
    subtitle: "Bắt đầu hành trình chia sẻ sách của bạn ngay hôm nay.",
    fullName: "Họ tên",
    email: "Email sinh viên",
    studentId: "MSSV",
    university: "Trường",
    major: "Ngành học",
    password: "Mật khẩu",
    confirmPassword: "Nhập lại mật khẩu",
    selectUniversity: "Chọn trường",
    selectMajor: "Chọn ngành học",
    terms: "Tôi đồng ý với các Điều khoản dịch vụ và Chính sách bảo mật của EduCart.",
    serviceTerms: "Điều khoản dịch vụ",
    privacyPolicy: "Chính sách bảo mật",
    submit: "Đăng ký tài khoản",
    already: "Đã có tài khoản?",
    loginNow: "Đăng nhập ngay",
    successTitle: "Đăng ký thành công!",
    successText: "Tài khoản của bạn đã được tạo. Hãy đăng nhập để bắt đầu.",
    fillAll: "Vui lòng điền đầy đủ thông tin",
    passwordMismatch: "Mật khẩu không khớp",
    agreeTerms: "Vui lòng đồng ý với điều khoản dịch vụ",
    failed: "Đăng ký thất bại",
  },
  en: {
    heroTitle: "Build new knowledge together.",
    heroText:
      "Join Vietnam's student book exchange community. Save more and learn better.",
    heroStat: "More than 2,000 students joined the exchange this week.",
    title: "Create a new account",
    subtitle: "Start your book-sharing journey today.",
    fullName: "Full name",
    email: "Student email",
    studentId: "Student ID",
    university: "University",
    major: "Major",
    password: "Password",
    confirmPassword: "Confirm password",
    selectUniversity: "Select university",
    selectMajor: "Select major",
    terms: "I agree to EduCart's Terms of Service and Privacy Policy.",
    serviceTerms: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    submit: "Create account",
    already: "Already have an account?",
    loginNow: "Sign in now",
    successTitle: "Registration successful!",
    successText: "Your account has been created. Sign in to get started.",
    fillAll: "Please fill in all required fields",
    passwordMismatch: "Passwords do not match",
    agreeTerms: "Please agree to the service terms",
    failed: "Registration failed",
  },
} as const;

const majors = [
  "Computer Science",
  "Computer Engineering",
  "Software Engineering",
  "Information Technology",
  "Economics",
  "Business Administration",
  "Marketing",
  "Finance",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Industrial Design",
  "Architecture",
  "Fine Arts",
  "Pharmacy",
  "Multimedia Communications",
  "Data Science",
  "Law",
];

export default function RegisterPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const t = registerDictionary[locale];
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    studentId: "",
    university: "",
    major: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [universities, setUniversities] = useState<Array<{ UniversityID: number; UName: string }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get<{ ok: boolean; universities: Array<{ UniversityID: number; UName: string }> }>("/universities")
      .then((d) => setUniversities(d.universities))
      .catch(() => {});
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleRegister = async () => {
    if (!formData.fullName || !formData.email || !formData.studentId || !formData.university || !formData.password || !formData.confirmPassword) {
      setError(t.fillAll);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }
    if (!agreeTerms) {
      setError(t.agreeTerms);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const nameParts = formData.fullName.trim().split(" ");
      const lname = nameParts[0];
      const fname = nameParts.slice(1).join(" ") || lname;
      await api.post("/auth/register", {
        email: formData.email,
        password: formData.password,
        mssv: formData.studentId,
        universityId: Number(formData.university),
        firstName: fname,
        lastName: lname,
      });
      setShowSuccess(true);
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
          <p className="text-lg text-blue-100">{t.heroText}</p>
        </div>

        <div className="rounded-xl bg-blue-700 p-6">
          <div className="mb-4 flex -space-x-3">
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
          <p className="text-sm text-blue-100">{t.heroStat}</p>
        </div>
      </div>

      <div className="flex max-h-screen w-full flex-col overflow-y-auto px-6 py-16 sm:px-12 lg:ml-auto lg:w-1/2 lg:py-24">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-bold text-gray-900">{t.title}</h2>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">{t.fullName}</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">{t.studentId}</label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">{t.university}</label>
                <select
                  name="university"
                  value={formData.university}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option value="">{t.selectUniversity}</option>
                  {universities.map((uni) => (
                    <option key={uni.UniversityID} value={uni.UniversityID}>
                      {uni.UName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">{t.major}</label>
              <select
                name="major"
                value={formData.major}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="">{t.selectMajor}</option>
                {majors.map((major) => (
                  <option key={major} value={major}>
                    {major}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">{t.password}</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-10 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">{t.confirmPassword}</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-10 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            ) : null}

            <label className="flex cursor-pointer items-start gap-3 rounded-lg bg-gray-50 p-3">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  setError("");
                }}
                className="mt-0.5 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">
                {locale === "vi" ? "Tôi đồng ý với các " : "I agree to EduCart's "}
                <Link href="#" className="text-blue-600 hover:underline">
                  {t.serviceTerms}
                </Link>
                {locale === "vi" ? " và " : " and "}
                <Link href="#" className="text-blue-600 hover:underline">
                  {t.privacyPolicy}
                </Link>
                {locale === "vi" ? " của EduCart." : "."}
              </span>
            </label>

            <button
              onClick={handleRegister}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition duration-200 hover:bg-blue-700"
            >
              {t.submit}
            </button>

            <p className="text-center text-gray-600">
              {t.already}{" "}
              <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                {t.loginNow}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {showSuccess ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50">
          <div className="mx-4 w-full max-w-sm rounded-lg bg-white p-8 shadow-xl">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">{t.successTitle}</h2>
            <p className="mb-6 text-center text-gray-600">{t.successText}</p>
            <button
              onClick={() => router.push("/login")}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition duration-200 hover:bg-blue-700"
            >
              {t.loginNow}
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
