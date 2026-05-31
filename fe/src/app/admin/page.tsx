"use client";

import HomeNavbar from "@/components/HomeNavbar";
import { api } from "@/lib/api";
import {
  AlertTriangle,
  Ban,
  BarChart3,
  CheckCircle2,
  Eye,
  FileWarning,
  Pin,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";
import { useEffect, useState, type ComponentType } from "react";

type RangeKey = "1d" | "7d" | "30d" | "90d" | "365d";
type AdminTab = "dashboard" | "reports" | "forum" | "users";

type DashboardResponse = {
  ok: boolean;
  range: RangeKey;
  rangeDays: number;
  snapshot: {
    totalUsers: number;
    totalAdmins: number;
    activeUsers: number;
    totalProducts: number;
    listedProducts: number;
    reservedProducts: number;
    soldProducts: number;
    totalOrders: number;
    pendingPaymentOrders: number;
    paidOrders: number;
    deliveringOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    activeForumPosts: number;
    pendingReports: number;
  };
  finance: {
    totalBuyerPayments: number;
    totalSellerPayouts: number;
    totalPlatformFees: number;
    platformCashOnHand: number;
    escrowBeingHeld: number;
  };
  trends: Record<
    string,
    {
      current: number;
      previous: number;
      delta: number;
      deltaPct: number;
    }
  >;
  timeline: Array<{
    BucketDate: string;
    NewUsers: number;
    NewProducts: number;
    NewOrders: number;
    NewReports: number;
    Views: number;
  }>;
  recentPayments: Array<{
    PayTxID: number;
    Amount: number;
    PayMethod: string | null;
    TxType: string;
    Status: string;
    OrderID: number | null;
    UserEmail: string;
  }>;
  recentOrders: Array<{
    OrderID: number;
    OrderType: string;
    LifecycleState: string;
    IsPaid: boolean;
    BuyerEmail: string;
    SellerEmail: string;
  }>;
  pendingReports: Array<{
    ReportID: number;
    Reason: string;
    Status: string;
    ReporterEmail: string;
    ReportedEmail: string;
    CreatedAt: string;
  }>;
  platformWallet: {
    label: string;
    note: string;
  };
};

type AdminUser = {
  UserID: number;
  UserEmail: string;
  FName: string | null;
  LName: string | null;
  Role: string;
  Status: string;
  WarningCount: number;
  TrustScore: number;
  RiskBadge: string;
  PhoneNumber: string | null;
  CreatedAt: string;
  ProductsListed: number;
  OrdersPlaced: number;
  ReportsAgainstUser: number;
};

type ReportItem = {
  ReportID: number;
  ReporterID: number;
  ReportedID: number;
  Reason: string;
  Description: string | null;
  Status: string;
  CreatedAt: string;
  CompletedAt: string | null;
  AdminNote: string | null;
  EvidenceSummary: string | null;
  ResolutionAction: string | null;
  ReviewedBy: number | null;
  ReporterEmail: string;
  ReporterFirstName: string | null;
  ReporterLastName: string | null;
  ReportedEmail: string;
  ReportedFirstName: string | null;
  ReportedLastName: string | null;
  ReportedUserStatus: string;
  ReportedWarningCount: number;
  ReportedTrustScore: number;
  ReportedRiskBadge: string;
};

type ForumPost = {
  PostID: number;
  AuthorID: number;
  Title: string;
  Content: string;
  Tags: string | null;
  ViewCount: number;
  CommentsCount: number;
  VotesCount: number;
  IsActive: boolean;
  IsPinned: boolean;
  CreatedAt: string;
  UpdatedAt: string | null;
  AuthorEmail: string;
  FName: string | null;
  LName: string | null;
  SubjectName: string | null;
};

function money(value: number) {
  return Number(value || 0).toLocaleString("vi-VN");
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Chưa có";
  return new Date(value).toLocaleString("vi-VN");
}

function personName(first?: string | null, last?: string | null) {
  return [last, first].filter(Boolean).join(" ").trim() || "Chưa cập nhật";
}

function safeMetric(value: unknown, fallback: number) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function TrendCard({
  title,
  value,
  deltaPct,
  icon: Icon,
}: {
  title: string;
  value: string;
  deltaPct: number;
  icon: ComponentType<{ className?: string }>;
}) {
  const positive = deltaPct >= 0;
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <Icon className="h-5 w-5 text-blue-600" />
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            positive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          }`}
        >
          {positive ? "+" : ""}
          {deltaPct}%
        </span>
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-gray-400">{title}</p>
      <p className="mt-2 text-2xl font-bold text-[#193967]">{value}</p>
    </div>
  );
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [range, setRange] = useState<RangeKey>("7d");
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState("");

  const loadDashboard = async (nextRange = range) => {
    const res = await api.get<DashboardResponse>(`/admin/dashboard?range=${nextRange}`, true);
    setDashboard(res);
  };

  const loadUsers = async () => {
    const res = await api.get<{ ok: boolean; users: AdminUser[] }>("/admin/users", true);
    setUsers(res.users);
  };

  const loadReports = async () => {
    const res = await api.get<{ ok: boolean; reports: ReportItem[] }>("/admin/reports?status=all", true);
    setReports(res.reports);
  };

  const loadPosts = async () => {
    const res = await api.get<{ ok: boolean; posts: ForumPost[] }>("/admin/forum/posts?visibility=all", true);
    setPosts(res.posts);
  };

  const bootstrap = async (nextRange = range) => {
    setLoading(true);
    setError("");
    try {
      await Promise.all([loadDashboard(nextRange), loadUsers(), loadReports(), loadPosts()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được admin panel");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bootstrap(range);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRangeChange = async (nextRange: RangeKey) => {
    setRange(nextRange);
    try {
      await loadDashboard(nextRange);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được dashboard");
    }
  };

  const handleUserAction = async (userId: number, action: "warn" | "suspend" | "ban" | "activate") => {
    const message =
      action === "warn"
        ? "Tài khoản của bạn đang bị cảnh báo do có phản ánh từ cộng đồng."
        : action === "suspend"
          ? "Tài khoản bị tạm khóa để kiểm tra thêm."
          : action === "ban"
            ? "Tài khoản bị cấm do vi phạm nghiêm trọng."
            : "Tài khoản đã được mở lại sau khi kiểm tra.";
    setBusyKey(`user-${userId}-${action}`);
    try {
      await api.post(`/admin/users/${userId}/action`, { action, message }, true);
      await Promise.all([loadUsers(), loadReports(), loadDashboard()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể cập nhật người dùng");
    } finally {
      setBusyKey("");
    }
  };

  const handleReportReview = async (
    reportId: number,
    status: "Resolved" | "Dismissed",
    action: "none" | "warn" | "suspend" | "ban",
  ) => {
    setBusyKey(`report-${reportId}-${status}-${action}`);
    try {
      await api.post(
        `/admin/reports/${reportId}/review`,
        {
          status,
          action,
          note:
            status === "Dismissed"
              ? "Admin đã kiểm tra và không đủ cơ sở xử lý."
              : action === "none"
                ? "Admin đã ghi nhận và nhắc nhở nội bộ."
                : `Admin xử lý report bằng hành động ${action}.`,
        },
        true,
      );
      await Promise.all([loadReports(), loadUsers(), loadDashboard()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể duyệt report");
    } finally {
      setBusyKey("");
    }
  };

  const handlePostModeration = async (postId: number, payload: { isPinned?: boolean; isActive?: boolean }) => {
    setBusyKey(`post-${postId}`);
    try {
      await api.put(`/admin/forum/posts/${postId}`, payload, true);
      await Promise.all([loadPosts(), loadDashboard()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể cập nhật bài viết");
    } finally {
      setBusyKey("");
    }
  };

  return (
    <main className="min-h-screen bg-[#F6F8FC]">
      <HomeNavbar />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-[32px] bg-[#193967] p-8 text-white shadow-xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/70">Admin Panel</p>
          <h1 className="mt-3 text-3xl font-bold md:text-4xl">Quản trị vận hành, kiểm duyệt và dashboard hệ thống</h1>
          <p className="mt-3 max-w-4xl text-sm text-white/80">
            Theo dõi buyer, seller, sản phẩm, đơn hàng, report và hoạt động diễn đàn theo từng mốc thời gian.
            Phần tiền buyer trả hiện được hệ thống giữ theo mô hình escrow nội bộ để mô phỏng ví merchant của nền tảng.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {[
            { id: "dashboard", label: "Dashboard" },
            { id: "reports", label: "Duyệt report" },
            { id: "forum", label: "Kiểm duyệt diễn đàn" },
            { id: "users", label: "Quản lý người dùng" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                  : "bg-white text-gray-600 shadow-sm hover:text-blue-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error ? (
          <div className="mt-6 rounded-3xl border border-rose-200 bg-white p-5 text-sm text-rose-600 shadow-sm">
            {error}
          </div>
        ) : null}

        {loading || !dashboard ? (
          <div className="mt-6 rounded-3xl bg-white p-10 text-center text-gray-500 shadow-sm">Đang tải admin panel...</div>
        ) : (
          <>
            {activeTab === "dashboard" ? (
              <section className="mt-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-[#193967]">Dashboard theo dõi {dashboard.rangeDays} ngày</h2>
                    <p className="mt-1 text-sm text-gray-500">So sánh với giai đoạn liền trước cùng độ dài thời gian.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(["1d", "7d", "30d", "90d", "365d"] as RangeKey[]).map((item) => (
                      <button
                        key={item}
                        onClick={() => handleRangeChange(item)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${
                          range === item ? "bg-[#193967] text-white" : "bg-white text-gray-600 shadow-sm"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                  <TrendCard title="Người dùng mới" value={`${dashboard.trends.newUsers?.current ?? 0}`} deltaPct={dashboard.trends.newUsers?.deltaPct ?? 0} icon={Users} />
                  <TrendCard title="Buyer tham gia" value={`${dashboard.trends.buyersParticipated?.current ?? 0}`} deltaPct={dashboard.trends.buyersParticipated?.deltaPct ?? 0} icon={Users} />
                  <TrendCard title="Seller tham gia" value={`${dashboard.trends.sellersParticipated?.current ?? 0}`} deltaPct={dashboard.trends.sellersParticipated?.deltaPct ?? 0} icon={Store} />
                  <TrendCard title="Sản phẩm đăng mới" value={`${dashboard.trends.productsListed?.current ?? 0}`} deltaPct={dashboard.trends.productsListed?.deltaPct ?? 0} icon={BarChart3} />
                  <TrendCard title="Sản phẩm đã mua" value={`${dashboard.trends.productsPurchased?.current ?? 0}`} deltaPct={dashboard.trends.productsPurchased?.deltaPct ?? 0} icon={CheckCircle2} />
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                  <TrendCard title="Lượt xem nội dung" value={`${dashboard.trends.contentViews?.current ?? 0}`} deltaPct={dashboard.trends.contentViews?.deltaPct ?? 0} icon={Eye} />
                  <TrendCard title="Lượt click sản phẩm" value={`${dashboard.trends.productClicks?.current ?? 0}`} deltaPct={dashboard.trends.productClicks?.deltaPct ?? 0} icon={Eye} />
                  <TrendCard title="Report mới" value={`${dashboard.trends.reportsCreated?.current ?? 0}`} deltaPct={dashboard.trends.reportsCreated?.deltaPct ?? 0} icon={FileWarning} />
                  <TrendCard title="Đơn đã nhận" value={`${dashboard.trends.ordersReceived?.current ?? 0}`} deltaPct={dashboard.trends.ordersReceived?.deltaPct ?? 0} icon={ShieldCheck} />
                  <TrendCard title="Đơn bị hủy" value={`${dashboard.trends.ordersCancelled?.current ?? 0}`} deltaPct={dashboard.trends.ordersCancelled?.deltaPct ?? 0} icon={AlertTriangle} />
                </div>

                <div className="grid gap-6 xl:grid-cols-3">
                  <div className="rounded-3xl bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-[#193967]">Ảnh chụp hệ thống hiện tại</h3>
                    <div className="mt-4 space-y-3 text-sm text-gray-600">
                      <div className="flex justify-between"><span>Tổng người dùng</span><strong>{dashboard.snapshot.totalUsers}</strong></div>
                      <div className="flex justify-between"><span>Người dùng đang hoạt động</span><strong>{dashboard.snapshot.activeUsers}</strong></div>
                      <div className="flex justify-between"><span>Tổng sản phẩm bày bán</span><strong>{dashboard.snapshot.totalProducts}</strong></div>
                      <div className="flex justify-between"><span>Sản phẩm đang bán</span><strong>{dashboard.snapshot.listedProducts}</strong></div>
                      <div className="flex justify-between"><span>Sản phẩm đã đặt giữ chỗ</span><strong>{dashboard.snapshot.reservedProducts}</strong></div>
                      <div className="flex justify-between"><span>Sản phẩm đã bán</span><strong>{dashboard.snapshot.soldProducts}</strong></div>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-[#193967]">Trạng thái đơn hàng</h3>
                    <div className="mt-4 space-y-3 text-sm text-gray-600">
                      <div className="flex justify-between"><span>Tổng đơn</span><strong>{dashboard.snapshot.totalOrders}</strong></div>
                      <div className="flex justify-between"><span>Chờ thanh toán</span><strong>{dashboard.snapshot.pendingPaymentOrders}</strong></div>
                      <div className="flex justify-between"><span>Đã thanh toán</span><strong>{dashboard.snapshot.paidOrders}</strong></div>
                      <div className="flex justify-between"><span>Đang giao</span><strong>{dashboard.snapshot.deliveringOrders}</strong></div>
                      <div className="flex justify-between"><span>Đã nhận / hoàn tất</span><strong>{dashboard.snapshot.completedOrders}</strong></div>
                      <div className="flex justify-between"><span>Bị hủy</span><strong>{dashboard.snapshot.cancelledOrders}</strong></div>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-[#193967]">Ví nền tảng và escrow</h3>
                    <div className="mt-4 space-y-3 text-sm text-gray-600">
                      <div className="flex justify-between"><span>Escrow đang giữ</span><strong>{money(dashboard.finance.escrowBeingHeld)} đ</strong></div>
                      <div className="flex justify-between"><span>Buyer đã thanh toán</span><strong>{money(dashboard.finance.totalBuyerPayments)} đ</strong></div>
                      <div className="flex justify-between"><span>Đã payout seller</span><strong>{money(dashboard.finance.totalSellerPayouts)} đ</strong></div>
                      <div className="flex justify-between"><span>Phí sàn đã thu</span><strong>{money(dashboard.finance.totalPlatformFees)} đ</strong></div>
                      <div className="flex justify-between"><span>Tiền platform đang nắm</span><strong>{money(dashboard.finance.platformCashOnHand)} đ</strong></div>
                    </div>
                    <p className="mt-4 rounded-2xl bg-blue-50 p-4 text-xs leading-6 text-blue-900">
                      <strong>{dashboard.platformWallet.label}:</strong> {dashboard.platformWallet.note}
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                  <div className="rounded-3xl bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-[#193967]">Biến động theo ngày</h3>
                    <div className="mt-4 overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="text-left text-gray-400">
                          <tr>
                            <th className="pb-3">Ngày</th>
                            <th className="pb-3">User mới</th>
                            <th className="pb-3">Sản phẩm mới</th>
                            <th className="pb-3">Đơn mới</th>
                            <th className="pb-3">Report</th>
                            <th className="pb-3">View</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboard.timeline.map((row) => (
                            <tr key={row.BucketDate} className="border-t border-gray-100">
                              <td className="py-3">{formatDate(row.BucketDate)}</td>
                              <td className="py-3">{row.NewUsers}</td>
                              <td className="py-3">{row.NewProducts}</td>
                              <td className="py-3">{row.NewOrders}</td>
                              <td className="py-3">{row.NewReports}</td>
                              <td className="py-3">{row.Views}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-[#193967]">Report chờ duyệt</h3>
                    <div className="mt-4 space-y-3">
                      {dashboard.pendingReports.length ? (
                        dashboard.pendingReports.map((item) => (
                          <div key={item.ReportID} className="rounded-2xl border border-gray-100 p-4">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="font-semibold text-[#193967]">#{item.ReportID} • {item.Reason}</p>
                                <p className="text-sm text-gray-500">
                                  {item.ReporterEmail} báo cáo {item.ReportedEmail}
                                </p>
                              </div>
                              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
                                {item.Status}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">Không có report chờ duyệt.</p>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            ) : null}

            {activeTab === "reports" ? (
              <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-[#193967]">Duyệt báo cáo người dùng</h2>
                <div className="mt-5 space-y-4">
                  {reports.map((report) => (
                    <div key={report.ReportID} className="rounded-3xl border border-gray-100 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-lg font-bold text-[#193967]">Report #{report.ReportID} • {report.Reason}</p>
                          <p className="mt-1 text-sm text-gray-500">
                            {personName(report.ReporterFirstName, report.ReporterLastName)} ({report.ReporterEmail}) báo cáo{" "}
                            {personName(report.ReportedFirstName, report.ReportedLastName)} ({report.ReportedEmail})
                          </p>
                          <p className="mt-2 text-sm text-gray-700">{report.Description || "Không có mô tả thêm."}</p>
                          <p className="mt-2 text-xs text-gray-400">
                            Tạo lúc: {formatDate(report.CreatedAt)} • Trạng thái user bị report: {report.ReportedUserStatus}
                          </p>
                          <p className="mt-2 text-xs text-gray-500">
                            Badge hiện tại: {report.ReportedRiskBadge} • Trust score: {safeMetric(report.ReportedTrustScore, 100).toFixed(0)}/100 • Cảnh báo: {safeMetric(report.ReportedWarningCount, 0)}
                          </p>
                          {report.EvidenceSummary ? (
                            <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
                              Bằng chứng / tóm tắt: {report.EvidenceSummary}
                            </p>
                          ) : null}
                          {report.AdminNote ? (
                            <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
                              Ghi chú admin: {report.AdminNote}
                            </p>
                          ) : null}
                          {report.ResolutionAction ? (
                            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
                              Quyết định gần nhất: {report.ResolutionAction}
                            </p>
                          ) : null}
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            report.Status === "Pending"
                              ? "bg-amber-50 text-amber-600"
                              : report.Status === "Resolved"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {report.Status}
                        </span>
                      </div>

                      {report.Status === "Pending" ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            onClick={() => handleReportReview(report.ReportID, "Resolved", "warn")}
                            disabled={busyKey === `report-${report.ReportID}-Resolved-warn`}
                            className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white"
                          >
                            Cảnh báo user
                          </button>
                          <button
                            onClick={() => handleReportReview(report.ReportID, "Resolved", "suspend")}
                            disabled={busyKey === `report-${report.ReportID}-Resolved-suspend`}
                            className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white"
                          >
                            Tạm khóa
                          </button>
                          <button
                            onClick={() => handleReportReview(report.ReportID, "Resolved", "ban")}
                            disabled={busyKey === `report-${report.ReportID}-Resolved-ban`}
                            className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
                          >
                            Cấm tài khoản
                          </button>
                          <button
                            onClick={() => handleReportReview(report.ReportID, "Dismissed", "none")}
                            disabled={busyKey === `report-${report.ReportID}-Dismissed-none`}
                            className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                          >
                            Bỏ qua
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {activeTab === "forum" ? (
              <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-[#193967]">Kiểm duyệt diễn đàn</h2>
                <div className="mt-5 space-y-4">
                  {posts.map((post) => (
                    <div key={post.PostID} className="rounded-3xl border border-gray-100 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="max-w-4xl">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-lg font-bold text-[#193967]">{post.Title}</p>
                            {post.IsPinned ? (
                              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600">Đã ghim</span>
                            ) : null}
                            {!post.IsActive ? (
                              <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600">Đang ẩn</span>
                            ) : null}
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            Tác giả: {personName(post.FName, post.LName)} ({post.AuthorEmail}) • Môn: {post.SubjectName || "Chung"}
                          </p>
                          <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-700">{post.Content}</p>
                          <p className="mt-3 text-xs text-gray-400">
                            {post.ViewCount} lượt xem • {post.CommentsCount} bình luận • {post.VotesCount} vote • Tạo lúc {formatDate(post.CreatedAt)}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handlePostModeration(post.PostID, { isPinned: !post.IsPinned })}
                            disabled={busyKey === `post-${post.PostID}`}
                            className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white"
                          >
                            <span className="inline-flex items-center gap-2"><Pin className="h-4 w-4" />{post.IsPinned ? "Bỏ ghim" : "Ghim bài"}</span>
                          </button>
                          <button
                            onClick={() => handlePostModeration(post.PostID, { isActive: !post.IsActive })}
                            disabled={busyKey === `post-${post.PostID}`}
                            className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${post.IsActive ? "bg-rose-600" : "bg-emerald-600"}`}
                          >
                            {post.IsActive ? "Ẩn bài" : "Hiện lại"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {activeTab === "users" ? (
              <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-[#193967]">Quản lý người dùng</h2>
                <div className="mt-5 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="text-left text-gray-400">
                      <tr>
                        <th className="pb-3">Người dùng</th>
                        <th className="pb-3">Vai trò</th>
                        <th className="pb-3">Trạng thái</th>
                        <th className="pb-3">Uy tín</th>
                        <th className="pb-3">Sản phẩm</th>
                        <th className="pb-3">Đơn mua</th>
                        <th className="pb-3">Bị report</th>
                        <th className="pb-3">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.UserID} className="border-t border-gray-100 align-top">
                          <td className="py-4">
                            <p className="font-semibold text-[#193967]">{personName(user.FName, user.LName)}</p>
                            <p className="text-gray-500">{user.UserEmail}</p>
                          </td>
                          <td className="py-4">{user.Role}</td>
                          <td className="py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                user.Status === "Active"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : user.Status === "Suspended"
                                    ? "bg-amber-50 text-amber-600"
                                    : "bg-rose-50 text-rose-600"
                              }`}
                            >
                              {user.Status}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="space-y-1">
                              <p className="font-semibold text-[#193967]">{safeMetric(user.TrustScore, 100).toFixed(0)}/100</p>
                              <p className="text-xs text-gray-500">{user.RiskBadge}</p>
                              <p className="text-xs text-gray-400">{safeMetric(user.WarningCount, 0)} cảnh báo</p>
                            </div>
                          </td>
                          <td className="py-4">{user.ProductsListed}</td>
                          <td className="py-4">{user.OrdersPlaced}</td>
                          <td className="py-4">{user.ReportsAgainstUser}</td>
                          <td className="py-4">
                            <div className="flex flex-wrap gap-2">
                              {user.Role !== "Admin" ? (
                                <>
                                  <button
                                    onClick={() => handleUserAction(user.UserID, "warn")}
                                    disabled={busyKey === `user-${user.UserID}-warn`}
                                    className="rounded-xl bg-amber-500 px-3 py-2 text-xs font-semibold text-white"
                                  >
                                    Cảnh báo
                                  </button>
                                  <button
                                    onClick={() => handleUserAction(user.UserID, "suspend")}
                                    disabled={busyKey === `user-${user.UserID}-suspend`}
                                    className="rounded-xl bg-orange-500 px-3 py-2 text-xs font-semibold text-white"
                                  >
                                    Tạm khóa
                                  </button>
                                  <button
                                    onClick={() => handleUserAction(user.UserID, "ban")}
                                    disabled={busyKey === `user-${user.UserID}-ban`}
                                    className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white"
                                  >
                                    <span className="inline-flex items-center gap-1"><Ban className="h-3.5 w-3.5" />Cấm</span>
                                  </button>
                                  {user.Status !== "Active" ? (
                                    <button
                                      onClick={() => handleUserAction(user.UserID, "activate")}
                                      disabled={busyKey === `user-${user.UserID}-activate`}
                                      className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white"
                                    >
                                      Mở lại
                                    </button>
                                  ) : null}
                                </>
                              ) : (
                                <span className="text-xs text-gray-400">Tài khoản admin</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ) : null}
          </>
        )}
      </div>
    </main>
  );
}
