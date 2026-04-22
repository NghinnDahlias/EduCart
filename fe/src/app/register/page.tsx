"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Eye, EyeOff, BookOpen, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

const universities = [
    "Đại Học Bách Khoa Hà Nội", "Đại Học Quốc Gia Hà Nội", "Đại Học Kinh Tế Quốc Dân",
    "Đại Học Ngoại Thương", "Đại Học Khoa Học Tự Nhiên", "Đại Học Công Nghệ",
    "Đại Học Sài Gòn", "Đại Học Bách Khoa TP.HCM"
];

const majors = [
    "Khoa học Máy tính", "Kỹ thuật Máy tính", "Kỹ Thuật Phần Mềm",
    "Công Nghệ Thông Tin", "Kinh Tế", "Quản Lý Kinh Doanh",
    "Kỹ Thuật Cơ Khí", "Kỹ Thuật Điện", "Luật"
];

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ fullName: "", email: "", studentId: "", university: "", major: "", password: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleRegister = () => {
        if (!formData.fullName || !formData.email || !formData.studentId || !formData.university || !formData.major || !formData.password || !formData.confirmPassword) {
            setError("Vui lòng điền đầy đủ thông tin"); return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Mật khẩu không khớp"); return;
        }
        if (!agreeTerms) {
            setError("Vui lòng đồng ý với điều khoản dịch vụ"); return;
        }
        setIsLoading(true);
        setTimeout(() => { setIsLoading(false); setShowSuccess(true); }, 1000);
    };

    const inputClass = "w-full pl-14 pr-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#1978E5] focus:ring-0 transition-all font-bold text-[#193967] placeholder:text-gray-300 text-sm";
    const selectClass = "w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#1978E5] focus:ring-0 transition-all font-bold text-[#193967] text-sm appearance-none";

    return (
        <main className="min-h-screen bg-[#F8FAFC] flex">
            {/* ── Left Panel ────────────────── */}
            <div className="hidden lg:flex lg:w-[40%] bg-[#193967] text-white flex-col justify-between p-14 fixed left-0 top-0 h-screen overflow-hidden">
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
                        Cùng bạn kiến<br />tạo tri thức mới. 📚
                    </h1>
                    <p className="text-white/70 text-lg font-medium leading-relaxed max-w-sm">
                        Tiết kiệm chi phí, mở rộng kho tàng tri thức — tham gia cộng đồng sinh viên học thuật ngay hôm nay.
                    </p>
                </div>

                <div className="relative z-10 space-y-4">
                    {[
                        { label: "Mua & Thuê sách học thuật", sub: "Hàng nghìn tựa sách" },
                        { label: "Xác thực sinh viên", sub: "Bảo mật & tin cậy" },
                        { label: "Giao dịch trực tiếp", sub: "Không phí ẩn" },
                    ].map((item) => (
                        <div key={item.label} className="flex items-center gap-4 bg-white/10 rounded-2xl p-4">
                            <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                            <div>
                                <p className="font-black text-sm">{item.label}</p>
                                <p className="text-white/60 text-xs font-bold">{item.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Right Form ────────────────── */}
            <div className="w-full lg:w-[60%] lg:ml-[40%] flex flex-col px-8 sm:px-14 py-12 overflow-y-auto">
                <div className="max-w-lg mx-auto w-full">
                    <div className="mb-8">
                        <h2 className="text-4xl font-black text-[#193967] mb-2">Tạo tài khoản mới</h2>
                        <p className="text-gray-400 font-bold">Bắt đầu hành trình chia sẻ sách của bạn ngay hôm nay.</p>
                    </div>

                    <div className="space-y-5">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Họ và tên</label>
                            <div className="relative">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Nguyễn Văn A" className={inputClass} />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email sinh viên</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="example@student.edu.vn" className={inputClass} />
                            </div>
                            <p className="text-xs text-[#1978E5] font-black ml-1">✓ Sử dụng email giáo dục để xác minh nhanh hơn</p>
                        </div>

                        {/* MSSV + Trường */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">MSSV</label>
                                <input type="text" name="studentId" value={formData.studentId} onChange={handleInputChange} placeholder="2024XXXX"
                                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#1978E5] focus:ring-0 transition-all font-bold text-[#193967] placeholder:text-gray-300 text-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Trường</label>
                                <select name="university" value={formData.university} onChange={handleInputChange} className={selectClass}>
                                    <option value="">Chọn trường</option>
                                    {universities.map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Major */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ngành học</label>
                            <select name="major" value={formData.major} onChange={handleInputChange} className={selectClass}>
                                <option value="">Chọn ngành học</option>
                                {majors.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>

                        {/* Password + Confirm */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mật khẩu</label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                                    <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" className={inputClass} />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nhập lại mật khẩu</label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                                    <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="••••••••" className={inputClass} />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-5 bg-red-50 border border-red-100 rounded-2xl">
                                <p className="text-sm text-red-500 font-bold">{error}</p>
                            </div>
                        )}

                        {/* Terms */}
                        <label className="flex items-start gap-4 p-5 bg-white border border-gray-100 rounded-2xl cursor-pointer hover:border-[#1978E5]/30 transition-all shadow-sm">
                            <input type="checkbox" checked={agreeTerms} onChange={(e) => { setAgreeTerms(e.target.checked); setError(""); }} className="w-5 h-5 mt-0.5 rounded border-gray-300 text-[#1978E5] focus:ring-[#1978E5]" />
                            <span className="text-sm text-gray-500 font-bold">
                                Tôi đồng ý với các{" "}
                                <Link href="#" className="text-[#1978E5] hover:underline font-black">Điều khoản dịch vụ</Link>
                                {" "}và{" "}
                                <Link href="#" className="text-[#1978E5] hover:underline font-black">Chính sách bảo mật</Link>
                                {" "}của EduCart.
                            </span>
                        </label>

                        <button onClick={handleRegister} disabled={isLoading}
                            className="w-full py-5 text-white font-black rounded-full transition-all flex items-center justify-center gap-3 hover:shadow-lg hover:scale-[1.02]"
                            style={{ background: "linear-gradient(135deg, #1978E5, #1461bc)", boxShadow: "0 4px 20px rgba(25,120,229,0.3)" }}
                        >
                            {isLoading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>ĐĂNG KÝ TÀI KHOẢN</span><ArrowRight className="h-5 w-5" /></>}
                        </button>

                        <p className="text-center text-gray-400 font-bold">
                            Đã có tài khoản?{" "}
                            <Link href="/login" className="text-[#1978E5] font-black hover:opacity-70 transition-opacity">Đăng nhập ngay</Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-[2rem] p-10 max-w-md w-full shadow-2xl text-center">
                        <div className="inline-flex p-5 bg-green-50 rounded-3xl text-green-500 mb-6">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>
                        <h2 className="text-3xl font-black text-[#193967] mb-3">Đăng ký thành công!</h2>
                        <p className="text-gray-400 font-bold mb-8">Tài khoản của bạn đã được tạo. Hãy đăng nhập để bắt đầu hành trình học tập!</p>
                        <button onClick={() => router.push("/login")}
                            className="w-full py-5 text-white font-black rounded-full transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                            style={{ background: "linear-gradient(135deg, #1978E5, #1461bc)" }}>
                            Đăng nhập ngay <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
