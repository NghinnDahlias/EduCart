"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, BookOpen, ShieldCheck, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleLogin = () => {
        if (!formData.email || !formData.password) {
            setError("Vui lòng điền đầy đủ thông tin");
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            router.push("/");
        }, 1500);
    };

    return (
        <main className="min-h-screen bg-[#F8FAFC] flex">
            {/* ── Left Panel ────────────────── */}
            <div className="hidden lg:flex lg:w-[45%] bg-[#193967] text-white flex-col justify-between p-14 fixed left-0 top-0 h-screen overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10" style={{ background: "#1978E5" }} />
                    <div className="absolute bottom-20 -left-20 w-72 h-72 rounded-full opacity-10" style={{ background: "#1978E5" }} />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-16">
                        <div className="p-2.5 bg-white/10 rounded-2xl">
                            <BookOpen className="h-7 w-7 text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tight">EduCart</span>
                    </div>
                    <h1 className="text-5xl font-black mb-6 leading-tight">
                        Chào mừng<br />quay lại! 👋
                    </h1>
                    <p className="text-white/70 text-lg font-medium leading-relaxed max-w-sm">
                        Tham gia cộng đồng trao đổi sách lớn nhất dành riêng cho sinh viên Việt Nam.
                    </p>
                </div>

                <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-[2rem] p-8">
                    <div className="flex -space-x-3 mb-5">
                        {["👨‍🎓", "👩‍🎓", "👨‍🎓"].map((emoji, idx) => (
                            <div key={idx} className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-xl border-2 border-white/10">
                                {emoji}
                            </div>
                        ))}
                        <div className="w-11 h-11 rounded-full bg-[#1978E5] flex items-center justify-center text-xs font-black border-2 border-white/10">
                            +2K
                        </div>
                    </div>
                    <p className="text-white/80 font-bold">Hơn 2.000+ sinh viên đã tham gia trao đổi sách tuần này.</p>
                    <div className="flex items-center gap-2 mt-3">
                        <ShieldCheck className="h-4 w-4 text-green-400" />
                        <span className="text-xs font-black text-green-400 uppercase tracking-widest">Nền tảng được xác thực</span>
                    </div>
                </div>
            </div>

            {/* ── Right Form ────────────────── */}
            <div className="w-full lg:w-[55%] lg:ml-[45%] flex flex-col justify-center px-8 sm:px-16 py-16">
                <div className="max-w-md mx-auto w-full">
                    <div className="mb-10">
                        <h2 className="text-4xl font-black text-[#193967] mb-3">Đăng nhập</h2>
                        <p className="text-gray-400 font-bold">Nhập tài khoản của bạn để tiếp tục</p>
                    </div>

                    <div className="space-y-6">
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email của bạn</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                                <input
                                    type="email" name="email" value={formData.email}
                                    onChange={handleInputChange} placeholder="example@student.edu.vn"
                                    className="w-full pl-14 pr-5 py-5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#1978E5] focus:ring-0 transition-all font-bold text-[#193967] placeholder:text-gray-300"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mật khẩu</label>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                                <input
                                    type={showPassword ? "text" : "password"} name="password" value={formData.password}
                                    onChange={handleInputChange} placeholder="••••••••"
                                    className="w-full pl-14 pr-14 py-5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#1978E5] focus:ring-0 transition-all font-bold text-[#193967] placeholder:text-gray-300"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors">
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-5 bg-red-50 border border-red-100 rounded-2xl">
                                <p className="text-sm text-red-500 font-bold">{error}</p>
                            </div>
                        )}

                        <div className="flex justify-end">
                            <Link href="#" className="text-sm font-black text-[#1978E5] hover:opacity-70 transition-opacity">Quên mật khẩu?</Link>
                        </div>

                        <button onClick={handleLogin} disabled={isLoading}
                            className="w-full py-5 text-white font-black rounded-full transition-all flex items-center justify-center gap-3 hover:shadow-lg hover:scale-[1.02]"
                            style={{ background: "linear-gradient(135deg, #1978E5, #1461bc)", boxShadow: "0 4px 20px rgba(25,120,229,0.3)" }}
                        >
                            {isLoading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>ĐĂNG NHẬP</span><ArrowRight className="h-5 w-5" /></>}
                        </button>

                        <p className="text-center text-gray-400 font-bold">
                            Chưa có tài khoản?{" "}
                            <Link href="/register" className="text-[#1978E5] font-black hover:opacity-70 transition-opacity">Đăng ký ngay</Link>
                        </p>
                    </div>

                    <div className="my-10 relative flex items-center justify-center">
                        <div className="absolute w-full border-t border-gray-100" />
                        <span className="relative px-4 text-xs font-black text-gray-300 bg-[#F8FAFC] uppercase tracking-widest">Hoặc</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="py-4 bg-white border border-gray-100 rounded-2xl hover:border-[#1978E5]/30 transition-all font-black text-sm text-[#193967] shadow-sm hover:shadow-md">
                            🇬 Google
                        </button>
                        <button className="py-4 bg-white border border-gray-100 rounded-2xl hover:border-[#1978E5]/30 transition-all font-black text-sm text-[#193967] shadow-sm hover:shadow-md">
                            Facebook
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
