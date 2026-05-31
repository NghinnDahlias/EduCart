"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarCheck2,
  CreditCard,
  Globe,
  KeyRound,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Pencil,
  ShieldCheck,
  Star,
  User,
} from "lucide-react";

import HomeNavbar from "@/components/HomeNavbar";
import { useLocale } from "@/components/locale-provider";
import { api, clearToken } from "@/lib/api";

type Language = "vi" | "en";
type TabKey = "personal" | "history" | "notifications" | "security" | "settings";

interface ProfileUser {
  UserID: number;
  UserEmail: string;
  FName: string | null;
  LName: string | null;
  MSSV: string | null;
  Role: string;
  PhoneNumber: string | null;
  Bio: string | null;
  AvatarURL: string | null;
  Address: string | null;
  Rating: number | null;
  CoinBalance: number;
}

interface PurchaseOrder {
  OrderID: number;
  LifecycleState: string;
  TotalAmount: number | null;
  CreatedAt: string;
  PaymentDueAt?: string;
  SellerName: string;
  PrimaryTitle?: string | null;
}

interface ProfileNotification {
  type: string;
  severity: "info" | "warning" | "success";
  createdAt: string;
  title: string;
  description: string;
}

interface ReceivedReview {
  ReviewID: number;
  Rating: number;
  Comment: string | null;
  CreatedAt: string;
  Title: string;
  ReviewerName: string;
}

interface ProfileHubResponse {
  ok: boolean;
  user: ProfileUser;
  purchaseHistory: PurchaseOrder[];
  notifications: ProfileNotification[];
  receivedReviews: ReceivedReview[];
  unreadMessages: number;
  lastCheckIn: string | null;
  canCheckIn: boolean;
}

const dictionary = {
  vi: {
    tabs: {
      personal: "Thông tin cá nhân",
      history: "Lịch sử mua hàng",
      notifications: "Thông báo",
      security: "Bảo mật",
      settings: "Cài đặt",
    },
    coins: "Coins",
    rating: "Đánh giá nhận được",
    edit: "Chỉnh sửa",
    save: "Lưu",
    cancel: "Hủy",
    checkIn: "Điểm danh hôm nay",
    checkedIn: "Đã điểm danh hôm nay",
    recentRules: "1.000đ = 1 coin. Thanh toán đơn thành công sẽ tự cộng coin.",
    noNotifications: "Chưa có thông báo nào.",
    noHistory: "Bạn chưa có đơn mua nào.",
    noReviews: "Chưa có đánh giá nào dành cho bạn.",
    securityTitle: "Đổi mật khẩu",
    otpTitle: "OTP demo nội bộ",
    sendOtp: "Gửi mã OTP demo",
    currentPassword: "Mật khẩu hiện tại",
    newPassword: "Mật khẩu mới",
    confirmPassword: "Xác nhận mật khẩu mới",
    otpCode: "Mã OTP",
    changePassword: "Đổi mật khẩu",
    language: "Ngôn ngữ",
    languageHint: "Thiết lập này đang áp dụng cho trang hồ sơ.",
    signOut: "Đăng xuất",
    openOrder: "Xem chi tiết đơn",
    openOrdersCenter: "Mở trung tâm đơn hàng",
    notificationsHint: "Thông báo sẽ nhắc thanh toán, xác nhận shop nhận đơn, trạng thái vận chuyển và tin nhắn mới.",
    messagesBadge: "cuộc trò chuyện chưa đọc",
  },
  en: {
    tabs: {
      personal: "Profile",
      history: "Purchase history",
      notifications: "Notifications",
      security: "Security",
      settings: "Settings",
    },
    coins: "Coins",
    rating: "Reviews received",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    checkIn: "Daily check-in",
    checkedIn: "Already checked in today",
    recentRules: "1,000 VND = 1 coin. Successful payments automatically add coins.",
    noNotifications: "No notifications yet.",
    noHistory: "You have no purchase history yet.",
    noReviews: "No one has reviewed you yet.",
    securityTitle: "Change password",
    otpTitle: "Internal demo OTP",
    sendOtp: "Send demo OTP",
    currentPassword: "Current password",
    newPassword: "New password",
    confirmPassword: "Confirm new password",
    otpCode: "OTP code",
    changePassword: "Change password",
    language: "Language",
    languageHint: "This setting currently applies to the profile page.",
    signOut: "Sign out",
    openOrder: "Open order detail",
    openOrdersCenter: "Open orders center",
    notificationsHint: "Notifications remind you about payments, seller acceptance, shipping updates, and new messages.",
    messagesBadge: "unread conversations",
  },
} as const;

function formatMoney(value: number | null | undefined) {
  if (value == null) return "--";
  return `${value.toLocaleString("vi-VN")} đ`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("vi-VN");
}

function severityClass(severity: string) {
  switch (severity) {
    case "warning":
      return "border-amber-200 bg-amber-50 text-amber-800";
    case "success":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    default:
      return "border-blue-200 bg-blue-50 text-blue-800";
  }
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("personal");
  const { locale: language, setLocale } = useLocale();
  const [hub, setHub] = useState<ProfileHubResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<string>("");
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    otp: "",
  });
  const [demoOtp, setDemoOtp] = useState("");

  const t = dictionary[language];

  const loadHub = async () => {
    const data = await api.get<ProfileHubResponse>("/users/me/profile-hub", true);
    setHub(data);
    setProfileForm({
      firstName: data.user.FName ?? "",
      lastName: data.user.LName ?? "",
      phoneNumber: data.user.PhoneNumber ?? "",
      address: data.user.Address ?? "",
    });
  };

  useEffect(() => {
    loadHub()
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const user = hub?.user ?? null;
  const fullName = useMemo(() => {
    if (!user) return "EduCart";
    const full = `${user.LName ?? ""} ${user.FName ?? ""}`.trim();
    return full || user.UserEmail;
  }, [user]);

  const sidebarItems: { key: TabKey; icon: any; label: string }[] = [
    { key: "personal", icon: User, label: t.tabs.personal },
    { key: "history", icon: CreditCard, label: t.tabs.history },
    { key: "notifications", icon: Bell, label: t.tabs.notifications },
    { key: "security", icon: ShieldCheck, label: t.tabs.security },
    { key: "settings", icon: Globe, label: t.tabs.settings },
  ];

  const handleCheckIn = async () => {
    try {
      setIsSaving(true);
      const res = await api.post<{ ok: boolean; message: string }>("/users/me/check-in", {}, true);
      showToast(res.message);
      await loadHub();
    } catch (error: any) {
      showToast(error.message || "Không thể điểm danh lúc này");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      await api.put(
        "/users/me",
        {
          firstName: profileForm.firstName.trim(),
          lastName: profileForm.lastName.trim(),
          phoneNumber: profileForm.phoneNumber.trim(),
          address: profileForm.address.trim(),
        },
        true,
      );
      setEditMode(false);
      showToast(language === "vi" ? "Đã cập nhật hồ sơ." : "Profile updated.");
      await loadHub();
    } catch (error: any) {
      showToast(error.message || "Không thể lưu hồ sơ");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendOtp = () => {
    const nextOtp = String(Math.floor(100000 + Math.random() * 900000));
    setDemoOtp(nextOtp);
    showToast(language === "vi" ? `Mã OTP demo: ${nextOtp}` : `Demo OTP: ${nextOtp}`);
  };

  const handleChangePassword = async () => {
    if (!demoOtp || passwordForm.otp !== demoOtp) {
      showToast(language === "vi" ? "OTP demo chưa đúng." : "Demo OTP is invalid.");
      return;
    }
    try {
      setIsSaving(true);
      const res = await api.post<{ ok: boolean; message: string }>(
        "/users/me/change-password",
        passwordForm,
        true,
      );
      showToast(res.message);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        otp: "",
      });
      setDemoOtp("");
    } catch (error: any) {
      showToast(error.message || "Không thể đổi mật khẩu");
    } finally {
      setIsSaving(false);
    }
  };

  const renderPersonal = () => (
    <div className="space-y-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">{t.tabs.personal}</h2>
          <button
            onClick={() => setEditMode((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-gray-50"
          >
            <Pencil className="h-4 w-4" />
            {editMode ? t.cancel : t.edit}
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            Họ và tên
            <div className="grid grid-cols-2 gap-3">
              <input
                value={profileForm.lastName}
                disabled={!editMode}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, lastName: e.target.value }))}
                className="rounded-xl border border-gray-200 px-4 py-3 disabled:bg-gray-50"
                placeholder="Họ"
              />
              <input
                value={profileForm.firstName}
                disabled={!editMode}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, firstName: e.target.value }))}
                className="rounded-xl border border-gray-200 px-4 py-3 disabled:bg-gray-50"
                placeholder="Tên"
              />
            </div>
          </label>

          <label className="space-y-2 text-sm font-semibold text-slate-700">
            Email
            <input value={user?.UserEmail ?? ""} disabled className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3" />
          </label>

          <label className="space-y-2 text-sm font-semibold text-slate-700">
            Số điện thoại
            <input
              value={profileForm.phoneNumber}
              disabled={!editMode}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 disabled:bg-gray-50"
              placeholder="Nhập số điện thoại"
            />
          </label>

          <label className="space-y-2 text-sm font-semibold text-slate-700">
            Mã số sinh viên
            <input value={user?.MSSV ?? ""} disabled className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3" />
          </label>
        </div>

        <label className="mt-4 block space-y-2 text-sm font-semibold text-slate-700">
          Địa chỉ nhận hàng
          <textarea
            value={profileForm.address}
            disabled={!editMode}
            onChange={(e) => setProfileForm((prev) => ({ ...prev, address: e.target.value }))}
            className="min-h-[110px] w-full rounded-xl border border-gray-200 px-4 py-3 disabled:bg-gray-50"
            placeholder="Nhập địa chỉ đầy đủ để nhận hàng"
          />
        </label>

        {editMode ? (
          <div className="mt-5 flex justify-end">
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {t.save}
            </button>
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">{t.rating}</h2>
        <div className="mt-5 space-y-4">
          {hub?.receivedReviews?.length ? (
            hub.receivedReviews.map((review) => (
              <div key={review.ReviewID} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{review.ReviewerName}</p>
                    <p className="text-sm text-gray-500">{review.Title}</p>
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-semibold text-amber-600">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {review.Rating}/5
                  </div>
                </div>
                {review.Comment ? <p className="mt-3 text-sm text-gray-600">{review.Comment}</p> : null}
                <p className="mt-2 text-xs text-gray-400">{formatDate(review.CreatedAt)}</p>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 p-5 text-sm text-gray-500">{t.noReviews}</div>
          )}
        </div>
      </section>
    </div>
  );

  const renderHistory = () => (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">{t.tabs.history}</h2>
        <Link href="/orders" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
          {t.openOrdersCenter}
        </Link>
      </div>
      <div className="space-y-4">
        {hub?.purchaseHistory?.length ? (
          hub.purchaseHistory.map((order) => (
            <div key={order.OrderID} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">
                    Đơn #{order.OrderID}
                    {order.PrimaryTitle ? ` - ${order.PrimaryTitle}` : ""}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">Người bán: {order.SellerName}</p>
                  <p className="mt-1 text-sm text-gray-500">Trạng thái: {order.LifecycleState}</p>
                  <p className="mt-1 text-xs text-gray-400">{formatDate(order.CreatedAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900">{formatMoney(order.TotalAmount)}</p>
                  <Link href={`/orders/${order.OrderID}`} className="mt-2 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700">
                    {t.openOrder}
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 p-5 text-sm text-gray-500">{t.noHistory}</div>
        )}
      </div>
    </section>
  );

  const renderNotifications = () => (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <Bell className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-bold text-slate-900">{t.tabs.notifications}</h2>
      </div>
      <p className="mb-5 text-sm text-gray-500">{t.notificationsHint}</p>

      {hub?.unreadMessages ? (
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
          <MessageCircle className="h-4 w-4" />
          {hub.unreadMessages} {t.messagesBadge}
        </div>
      ) : null}

      <div className="space-y-4">
        {hub?.notifications?.length ? (
          hub.notifications.map((notification, index) => (
            <div key={`${notification.type}-${index}`} className={`rounded-2xl border p-4 ${severityClass(notification.severity)}`}>
              <p className="font-semibold">{notification.title}</p>
              <p className="mt-1 text-sm opacity-90">{notification.description}</p>
              <p className="mt-2 text-xs opacity-70">{formatDate(notification.createdAt)}</p>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 p-5 text-sm text-gray-500">{t.noNotifications}</div>
        )}
      </div>
    </section>
  );

  const renderSecurity = () => (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <KeyRound className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-bold text-slate-900">{t.securityTitle}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          type="password"
          value={passwordForm.currentPassword}
          onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
          placeholder={t.currentPassword}
          className="rounded-xl border border-gray-200 px-4 py-3"
        />
        <input
          type="password"
          value={passwordForm.newPassword}
          onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
          placeholder={t.newPassword}
          className="rounded-xl border border-gray-200 px-4 py-3"
        />
        <input
          type="password"
          value={passwordForm.confirmPassword}
          onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
          placeholder={t.confirmPassword}
          className="rounded-xl border border-gray-200 px-4 py-3"
        />
        <input
          type="text"
          value={passwordForm.otp}
          onChange={(e) => setPasswordForm((prev) => ({ ...prev, otp: e.target.value }))}
          placeholder={t.otpCode}
          className="rounded-xl border border-gray-200 px-4 py-3"
        />
      </div>

      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <p className="font-semibold">{t.otpTitle}</p>
        <p className="mt-1">
          {language === "vi"
            ? "Bản demo dùng OTP nội bộ để mô phỏng bước xác thực trước khi đổi mật khẩu."
            : "This demo uses an internal OTP step to simulate password change verification."}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={handleSendOtp}
          className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-gray-50"
        >
          {t.sendOtp}
        </button>
        <button
          onClick={handleChangePassword}
          disabled={isSaving}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {t.changePassword}
        </button>
      </div>
    </section>
  );

  const renderSettings = () => (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <Globe className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-bold text-slate-900">{t.tabs.settings}</h2>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
        <label className="block text-sm font-semibold text-slate-700">{t.language}</label>
        <select
          value={language}
          onChange={(e) => {
            const nextLanguage = e.target.value as Language;
            setLocale(nextLanguage);
          }}
          className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-4 py-3"
        >
          <option value="vi">Tiếng Việt</option>
          <option value="en">English</option>
        </select>
        <p className="mt-3 text-sm text-gray-500">{t.languageHint}</p>
      </div>
    </section>
  );

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <HomeNavbar />
        <div className="mx-auto max-w-6xl px-4 py-20 text-center text-gray-500">Đang tải hồ sơ...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <HomeNavbar />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 text-3xl font-bold text-white shadow-md">
                {fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{fullName}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4" />{user?.UserEmail}</span>
                  <span className="inline-flex items-center gap-2"><User className="h-4 w-4" />{user?.Role ?? "Student"}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-center">
                <p className="text-2xl font-bold text-slate-900">{Number(user?.CoinBalance || 0)}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{t.coins}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-center">
                <p className="text-2xl font-bold text-slate-900">{user?.Rating?.toFixed(1) ?? "--"}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{t.rating}</p>
              </div>
              <button
                onClick={handleCheckIn}
                disabled={!hub?.canCheckIn || isSaving}
                className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-center disabled:opacity-60"
              >
                <p className="inline-flex items-center gap-2 text-sm font-bold text-blue-700">
                  <CalendarCheck2 className="h-4 w-4" />
                  {hub?.canCheckIn ? t.checkIn : t.checkedIn}
                </p>
              </button>
            </div>
          </div>

          <p className="mt-5 text-sm text-gray-500">{t.recentRules}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px,1fr]">
          <aside className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold ${
                    activeTab === item.key
                      ? "bg-blue-600 text-white"
                      : "text-slate-700 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-4 border-t border-gray-100 pt-4">
              <button
                onClick={() => {
                  clearToken();
                  localStorage.removeItem("educart_user");
                  window.location.href = "/login";
                }}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                {t.signOut}
              </button>
            </div>
          </aside>

          <section>
            {activeTab === "personal" ? renderPersonal() : null}
            {activeTab === "history" ? renderHistory() : null}
            {activeTab === "notifications" ? renderNotifications() : null}
            {activeTab === "security" ? renderSecurity() : null}
            {activeTab === "settings" ? renderSettings() : null}
          </section>
        </div>
      </div>

      {toast ? (
        <div className="fixed right-4 top-20 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      ) : null}
    </main>
  );
}
