"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Eye, EyeOff, BookOpen } from "lucide-react";

const universities = [
    "Đại Học Bách Khoa Hà Nội",
    "Đại Học Quốc Gia Hà Nội",
    "Đại Học Kinh Tế Quốc Dân",
    "Đại Học Ngoại Thương",
    "Đại Học Khoa Học Tự Nhiên",
    "Đại Học Công Nghệ",
    "Đại Học Sài Gòn",
    "Đại Học Bách Khoa TP.HCM"
];

const majors = [
    "Khoa học Máy tính",
    "Kỹ thuật Máy tính",
    "Kỹ Thuật Phần Mềm",
    "Công Nghệ Thông Tin",
    "Kinh Tế",
    "Quản Lý Kinh Doanh",
    "Kỹ Thuật Cơ Khí",
    "Kỹ Thuật Điện",
    "Luật"
];

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        studentId: "",
        university: "",
        major: "",
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError("");
    };

    const handleRegister = () => {
        if (!formData.fullName || !formData.email || !formData.studentId || !formData.university || !formData.major || !formData.password || !formData.confirmPassword) {
            setError("Vui lòng điền đầy đủ thông tin");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Mật khẩu không khớp");
            return;
        }
        if (!agreeTerms) {
            setError("Vui lòng đồng ý với điều khoản dịch vụ");
            return;
        }
        // Handle register logic here
        setTimeout(() => {
            setShowSuccess(true);
        }, 500);
    };

    return (
        <main className="min-h-screen bg-gray-50 flex">
            {/* Left Sidebar - Fixed */}
            <div className="hidden lg:flex lg:w-1/2 bg-blue-600 text-white flex-col justify-between p-12 fixed left-0 top-0 h-screen">
                <div>
                    <div className="flex items-center gap-2 mb-12">
                        <BookOpen className="h-8 w-8 text-white" />
                        <span className="text-2xl font-bold">EduCart</span>
                    </div>
                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        Cùng bạn kiến tạo tri thức mới.
                    </h1>
                    <p className="text-blue-100 text-lg">
                        Tham gia công đồng trao đổi sách lớn nhất dành riêng cho sinh viên Việt Nam. Tiết kiếm hơn, học tập tốt hơn.
                    </p>
                </div>

                <div className="bg-blue-700 rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex -space-x-3">
                            {["👨‍🎓", "👩‍🎓", "👨‍🎓"].map((emoji, idx) => (
                                <div
                                    key={idx}
                                    className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-lg border-2 border-blue-700"
                                >
                                    {emoji}
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold text-blue-700 border-2 border-blue-700">
                                +2K
                            </div>
                        </div>
                    </div>
                    <p className="text-blue-100 text-sm">
                        Hơn 2.000+ sinh viên đã tham gia trao đổi sách tuần này.
                    </p>
                </div>
            </div>

            {/* Right Form - Scrollable */}
            <div className="w-full lg:w-1/2 lg:ml-auto flex flex-col px-6 sm:px-12 py-16 lg:py-24 overflow-y-auto max-h-screen">
                <div className="max-w-md mx-auto w-full">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Tạo tài khoản mới</h2>
                        <p className="text-gray-600">Bắt đầu hành trình chia sẻ sách của bạn ngay hôm nay.</p>
                    </div>

                    <div className="space-y-4">
                        {/* Full Name Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                HỌ TÊN
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Nguyễn Văn A"
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                EMAIL SINH VIÊN
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="example@student.edu.vn"
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                />
                            </div>
                            <p className="mt-1 text-xs text-blue-600">
                                ✓ Vui lòng sử dụng email đơn vị giáo dục chính thức để được xác minh nhanh chóng.
                            </p>
                        </div>

                        {/* Student ID & University */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    MSSV
                                </label>
                                <input
                                    type="text"
                                    name="studentId"
                                    value={formData.studentId}
                                    onChange={handleInputChange}
                                    placeholder="2024XXXX"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    TRƯỜNG
                                </label>
                                <select
                                    name="university"
                                    value={formData.university}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white"
                                >
                                    <option value="">Chọn trường</option>
                                    {universities.map(uni => (
                                        <option key={uni} value={uni}>{uni}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Major */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                NGÀNH HỌC
                            </label>
                            <select
                                name="major"
                                value={formData.major}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white"
                            >
                                <option value="">Chọn ngành học</option>
                                {majors.map(major => (
                                    <option key={major} value={major}>{major}</option>
                                ))}
                            </select>
                        </div>

                        {/* Password & Confirm Password */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    MẬT KHẨU
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
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
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    NHẬP LẠI MẬT KHẨU
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
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

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {/* Terms Checkbox */}
                        <label className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                            <input
                                type="checkbox"
                                checked={agreeTerms}
                                onChange={(e) => {
                                    setAgreeTerms(e.target.checked);
                                    setError("");
                                }}
                                className="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600">
                                Tôi đồng ý với các{" "}
                                <Link href="#" className="text-blue-600 hover:underline">
                                    Điều khoản dịch vụ
                                </Link>
                                {" "}và{" "}
                                <Link href="#" className="text-blue-600 hover:underline">
                                    Chính sách bảo mật
                                </Link>
                                {" "}của EduCart.
                            </span>
                        </label>

                        {/* Register Button */}
                        <button
                            onClick={handleRegister}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
                        >
                            Đăng ký tài khoản
                        </button>

                        {/* Login Link */}
                        <p className="text-center text-gray-600">
                            Đã có tài khoản?{" "}
                            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                                Đăng nhập ngay
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 bg-white/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full mx-4">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Đăng ký thành công!</h2>
                        <p className="text-gray-600 text-center mb-6">
                            Tài khoản của bạn đã được tạo. Hãy đăng nhập vào tài khoản để bắt đầu.
                        </p>
                        <button
                            onClick={() => router.push("/login")}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
                        >
                            Đăng nhập ngay
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
