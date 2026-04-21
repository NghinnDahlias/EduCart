"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, BookOpen } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError("");
    };

    const handleLogin = () => {
        if (!formData.email || !formData.password) {
            setError("Vui lòng điền đầy đủ thông tin");
            return;
        }
        // Handle login logic here
        router.push("/");
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
                        Chào mừng quay lại
                    </h1>
                    <p className="text-blue-100 text-lg mb-8">
                        Tham gia cộng đồng trao đổi sách lớn nhất dành riêng cho sinh viên Việt Nam. Tiết kiếm hơn, học tập tốt hơn.
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

            {/* Right Form */}
            <div className="w-full lg:w-1/2 lg:ml-auto flex flex-col justify-center px-6 sm:px-12 py-12 sm:py-0">
                <div className="max-w-md mx-auto w-full">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h2>
                        <p className="text-gray-600">Nhập tài khoản của bạn để tiếp tục</p>
                    </div>

                    <div className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email của bạn
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
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
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

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {/* Forgot Password Link */}
                        <div className="flex justify-end">
                            <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                Quên mật khẩu?
                            </Link>
                        </div>

                        {/* Login Button */}
                        <button
                            onClick={handleLogin}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
                        >
                            Đăng nhập
                        </button>

                        {/* Signup Link */}
                        <p className="text-center text-gray-600">
                            Chưa có tài khoản?{" "}
                            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                                Đăng ký ngay
                            </Link>
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="my-8 relative flex items-center justify-center">
                        <div className="absolute w-full border-t border-gray-300"></div>
                        <span className="relative px-3 text-sm text-gray-500 bg-gray-50">Hoặc</span>
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700">
                            Google
                        </button>
                        <button className="py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700">
                            Facebook
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
