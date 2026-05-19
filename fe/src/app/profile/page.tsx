"use client";

import Link from "next/link";
import { api, clearToken } from "@/lib/api";
import { Bell, Building2, Calendar, Camera, ChevronRight, CreditCard, Edit3, LogOut, Mail, MapPin, Phone, Settings, ShieldCheck, User } from "lucide-react";
import { useEffect, useState } from "react";
import HomeNavbar from "../../components/HomeNavbar";


interface ApiUser {
  UserID: number;
  UserEmail: string;
  FName: string;
  LName: string;
  MSSV: string | null;
  Role: string;
  PhoneNumber: string | null;
  Bio: string | null;
  AvatarURL: string | null;
  Address: string | null;
  Rating: number | null;
  Balance: number;
  CoinBalance: number;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: "", lastName: "", phoneNumber: "" });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    api.get<{ ok: boolean; user: ApiUser }>("/users/me", true)
      .then(d => setUser(d.user))
      .catch(() => { });
  }, []);

  const openEdit = () => {
    if (!user) return;
    setEditForm({ firstName: user.FName ?? "", lastName: user.LName ?? "", phoneNumber: user.PhoneNumber ?? "" });
    setSaveMsg("");
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await api.put<{ ok: boolean; user: ApiUser }>("/users/me", {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        phoneNumber: editForm.phoneNumber || null,
      }, true);
      if (res.ok) {
        setUser(res.user);
        setIsEditing(false);
        setSaveMsg("Cập nhật thành công!");
      }
    } catch (e: any) {
      setSaveMsg(e.message || "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  const fullName = user ? `${user.LName ?? ""} ${user.FName ?? ""}`.trim() : "—";
  const email = user?.UserEmail ?? "—";

  const sidebarItems = [
    { id: "personal", label: "Thông tin cá nhân", icon: User },
    { id: "orders", label: "Đơn hàng của tôi", icon: CreditCard, href: "/orders" },
    { id: "notifications", label: "Thông báo", icon: Bell },
    { id: "security", label: "Bảo mật", icon: ShieldCheck },
    { id: "settings", label: "Cài đặt", icon: Settings },
  ];

  return (
    <>
      <main className="min-h-screen bg-[#F8FAFC]">
        <HomeNavbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Profile Header */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-md bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  {user?.AvatarURL
                    ? <img src={user.AvatarURL} alt="Avatar" className="w-full h-full object-cover" />
                    : <span className="text-4xl font-bold text-white">{user?.FName?.charAt(0) ?? "?"}</span>}
                </div>
                <button className="absolute bottom-1.5 right-1.5 p-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              {/* Name & Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-[#193967] mb-1">{fullName}</h1>
                <p className="text-gray-400 font-medium text-sm mb-4">{user?.Role ?? ""}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wide">THÀNH VIÊN</span>
                  <span className="px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-xs font-bold uppercase tracking-wide">ĐÃ XÁC THỰC</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6 px-8 py-5 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#193967]">{user?.CoinBalance ?? 0}</p>
                  <p className="text-xs font-medium text-gray-400 uppercase">Coins</p>
                </div>
                <div className="h-8 w-px bg-gray-200 self-center" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#193967]">{user?.Rating?.toFixed(1) ?? "—"}</p>
                  <p className="text-xs font-medium text-gray-400 uppercase">Đánh giá</p>
                </div>
                <div className="h-8 w-px bg-gray-200 self-center" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#193967]">{user?.Balance?.toLocaleString("vi-VN") ?? 0}</p>
                  <p className="text-xs font-medium text-gray-400 uppercase">Số dư (₫)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Sidebar */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                <nav className="space-y-1">
                  {sidebarItems.map((item) => {
                    const isActive = activeTab === item.id;
                    const itemClass = `w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isActive ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"}`;

                    // personal: giữ active state, nội dung trang cố định như hiện tại
                    if (!('href' in item)) {
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={itemClass}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="h-4 w-4" />
                            <span className="font-semibold text-sm">{item.label}</span>
                          </div>
                          {isActive && <ChevronRight className="h-4 w-4 opacity-70" />}
                        </button>
                      );
                    }

                    return (
                      <Link
                        key={item.id}
                        href={item.href!}
                        className={itemClass}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span className="font-semibold text-sm">{item.label}</span>
                        </div>
                        {isActive && <ChevronRight className="h-4 w-4 opacity-70" />}
                      </Link>
                    );
                  })}
                  <div className="pt-2 mt-2 border-t border-gray-100">
                    <button
                      onClick={() => { clearToken(); localStorage.removeItem("educart_user"); window.location.href = "/login"; }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all">
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
                  <button onClick={openEdit} className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-[#193967] rounded-lg text-xs font-bold transition-all border border-gray-200">
                    <Edit3 className="h-3.5 w-3.5" /> CHỈNH SỬA
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { label: "Họ và tên", value: fullName, icon: User },
                    { label: "Địa chỉ Email", value: email, icon: Mail },
                    { label: "Số điện thoại", value: user?.PhoneNumber ?? "Chưa cập nhật", icon: Phone },
                    { label: "Mã số sinh viên", value: user?.MSSV ?? "Chưa cập nhật", icon: Calendar },
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
                  {user?.Address ? (
                    <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-white rounded-lg text-blue-600 shadow-sm border border-gray-100">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="font-bold text-[#193967] text-sm">Địa chỉ</h4>
                            <span className="px-2 py-0.5 bg-blue-600 text-white text-[8px] font-bold rounded uppercase">Mặc định</span>
                          </div>
                          <p className="text-sm text-gray-400">{user.Address}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-blue-600 transition-colors" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-gray-50 rounded-lg text-gray-400 border border-gray-100">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#193967] text-sm mb-0.5">Chưa có địa chỉ</h4>
                          <p className="text-sm text-gray-400">Thêm địa chỉ để nhận hàng nhanh hơn</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-blue-600 transition-colors" />
                    </div>
                  )}
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <h3 className="text-xl font-bold text-[#193967] mb-6">Chỉnh sửa thông tin</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Họ (Last name)</label>
                <input
                  value={editForm.lastName}
                  onChange={e => setEditForm(p => ({ ...p, lastName: e.target.value }))}
                  placeholder="Nguyễn"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tên (First name)</label>
                <input
                  value={editForm.firstName}
                  onChange={e => setEditForm(p => ({ ...p, firstName: e.target.value }))}
                  placeholder="Văn A"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Số điện thoại</label>
                <input
                  value={editForm.phoneNumber}
                  onChange={e => setEditForm(p => ({ ...p, phoneNumber: e.target.value }))}
                  placeholder="0912345678"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
              {saveMsg && <p className="text-sm text-red-500">{saveMsg}</p>}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setIsEditing(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                Hủy
              </button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60">
                {saving ? "Đang lưu..." : "Lưu thông tin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
