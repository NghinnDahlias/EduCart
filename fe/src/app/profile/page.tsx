"use client";

import { useState } from "react";
import { User, Mail, Phone, MapPin, ShieldCheck, Camera, Bell, CreditCard, LogOut, ChevronRight, Edit3, Calendar, Settings, Building2 } from "lucide-react";
import HomeNavbar from "../../components/HomeNavbar";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("personal");

    const sidebarItems = [
        { id: "personal", label: "Thông tin cá nhân", icon: User },
        { id: "orders", label: "Đơn hàng của tôi", icon: CreditCard, href: "/orders" },
        { id: "notifications", label: "Thông báo", icon: Bell },
        { id: "security", label: "Bảo mật", icon: ShieldCheck },
        { id: "settings", label: "Cài đặt", icon: Settings },
    ];

    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            <HomeNavbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Profile Header */}
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-md">
                                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            <button className="absolute bottom-1.5 right-1.5 p-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                                <Camera className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Name & Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-[#193967] mb-1">Nguyễn Văn A</h1>
                            <p className="text-gray-400 font-medium text-sm mb-4">Thành viên từ: Tháng 4, 2025</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wide">HẠNG VÀNG</span>
                                <span className="px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-xs font-bold uppercase tracking-wide">ĐÃ XÁC THỰC</span>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-6 px-8 py-5 bg-gray-50 rounded-2xl border border-gray-200">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-[#193967]">12</p>
                                <p className="text-xs font-medium text-gray-400 uppercase">Đơn hàng</p>
                            </div>
                            <div className="h-8 w-px bg-gray-200 self-center" />
                            <div className="text-center">
                                <p className="text-2xl font-bold text-[#193967]">4.8</p>
                                <p className="text-xs font-medium text-gray-400 uppercase">Đánh giá</p>
                            </div>
                            <div className="h-8 w-px bg-gray-200 self-center" />
                            <div className="text-center">
                                <p className="text-2xl font-bold text-[#193967]">5</p>
                                <p className="text-xs font-medium text-gray-400 uppercase">Bài đăng</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Sidebar */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                            <nav className="space-y-1">
                                {sidebarItems.map((item) => (
                                    <button key={item.id}
                                        onClick={() => { if ((item as any).href) window.location.href = (item as any).href; else setActiveTab(item.id); }}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"}`}>
                                        <div className="flex items-center gap-3">
                                            <item.icon className="h-4 w-4" />
                                            <span className="font-semibold text-sm">{item.label}</span>
                                        </div>
                                        {activeTab === item.id && <ChevronRight className="h-4 w-4 opacity-70" />}
                                    </button>
                                ))}
                                <div className="pt-2 mt-2 border-t border-gray-100">
                                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all">
                                        <LogOut className="h-4 w-4" />
                                        <span className="font-semibold text-sm">Đăng xuất</span>
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-9 space-y-6">

                        {/* Personal Details */}
                        <section className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-[#193967]">Thông tin cá nhân</h2>
                                <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-[#193967] rounded-lg text-xs font-bold transition-all border border-gray-200">
                                    <Edit3 className="h-3.5 w-3.5" /> CHỈNH SỬA
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {[
                                    { label: "Họ và tên", value: "Nguyễn Văn A", icon: User },
                                    { label: "Địa chỉ Email", value: "nguyenvana@gmail.com", icon: Mail },
                                    { label: "Số điện thoại", value: "0912 345 678", icon: Phone },
                                    { label: "Ngày sinh", value: "01 / 01 / 1995", icon: Calendar },
                                ].map((field) => (
                                    <div key={field.label} className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">{field.label}</label>
                                        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <field.icon className="h-4 w-4 text-blue-600 shrink-0" />
                                            <span className="font-medium text-[#193967] text-sm">{field.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Address Management */}
                        <section className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-[#193967]">Địa chỉ của tôi</h2>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all">
                                    + THÊM ĐỊA CHỈ MỚI
                                </button>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-white rounded-lg text-blue-600 shadow-sm border border-gray-100">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <h4 className="font-bold text-[#193967] text-sm">Nhà riêng</h4>
                                                <span className="px-2 py-0.5 bg-blue-600 text-white text-[8px] font-bold rounded uppercase">Mặc định</span>
                                            </div>
                                            <p className="text-sm text-gray-400">123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-blue-600 transition-colors" />
                                </div>
                                <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-gray-50 rounded-lg text-gray-400 border border-gray-100">
                                            <Building2 className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#193967] text-sm mb-0.5">Văn phòng</h4>
                                            <p className="text-sm text-gray-400">456 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-blue-600 transition-colors" />
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </main>
    );
}
