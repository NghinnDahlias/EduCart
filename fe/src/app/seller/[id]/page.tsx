"use client";

import HomeNavbar from "@/components/HomeNavbar";
import HomeFooter from "@/components/HomeFooter";
import { Star, MessageSquare, AlertCircle, Check, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, getImageUrl } from "@/lib/api";
import Link from "next/link";

interface SellerInfo {
    UserID: number;
    UserEmail: string;
    FName: string;
    LName: string;
    Role: string;
    AvatarURL: string | null;
    Address: string | null;
    Rating: number | null;
    Bio: string | null;
    WarningCount?: number;
    TrustScore?: number;
    RiskBadge?: string;
    ResolvedReportsCount?: number;
    PendingReportsCount?: number;
    CompletedOrdersAsSeller?: number;
    DeliverySuccessRate?: number | null;
    TrustHeadline?: string | null;
    TrustWarningMessage?: string | null;
}

interface Product {
    ProductID: number;
    Title: string;
    Author: string;
    Price: number;
    OriginalPrice: number | null;
    RentalPrice: number | null;
    IsForRent: boolean;
    Status: string;
    Rating: number | null;
    ReviewsCount: number;
    ThumbnailURL: string | null;
    SellerName: string;
    DiscountLabel: string | null;
}

function safeMetric(value: unknown, fallback: number) {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
}

export default function SellerProfilePage() {
    const params = useParams();
    const router = useRouter();
    const sellerId = Number(params.id);

    const [seller, setSeller] = useState<SellerInfo | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportForm, setReportForm] = useState({ reason: "", description: "", evidenceSummary: "" });
    const [reporting, setReporting] = useState(false);
    const [notification, setNotification] = useState<{
        show: boolean;
        message: string;
        type: "success" | "error" | "warning";
    }>({ show: false, message: "", type: "success" });

    const showNotification = (
        message: string,
        type: "success" | "error" | "warning" = "success"
    ) => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: "", type: "success" });
        }, 3000);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch seller info
                const sellerRes = await api.get<{ ok: boolean; user: SellerInfo }>(
                    `/users/${sellerId}`
                );
                if (sellerRes.ok) {
                    setSeller(sellerRes.user);
                }

                // Fetch seller's products
                const productsRes = await api.get<{ ok: boolean; products: Product[] }>(
                    `/products?sellerId=${sellerId}`
                );
                if (productsRes.ok) {
                    setProducts(productsRes.products || []);
                }
            } catch (err) {
                console.error("Error fetching seller info:", err);
            } finally {
                setLoading(false);
            }
        };

        if (sellerId) {
            fetchData();
        }
    }, [sellerId]);

    const handleReportSubmit = async () => {
        if (!reportForm.reason.trim()) {
            showNotification("Vui lòng chọn lý do báo cáo", "warning");
            return;
        }

        setReporting(true);
        try {
            const response = await api.post<{ ok: boolean }>(
                "/reports",
                {
                    reportedUserId: sellerId,
                    reason: reportForm.reason,
                    description: reportForm.description,
                    evidenceSummary: reportForm.evidenceSummary,
                },
                true
            );

            if (response.ok) {
                showNotification("Báo cáo đã được gửi. Cảm ơn bạn đã giúp cải thiện nền tảng!", "success");
                setShowReportModal(false);
                setReportForm({ reason: "", description: "", evidenceSummary: "" });
            }
        } catch (err: any) {
            showNotification(err.message || "Có lỗi xảy ra khi gửi báo cáo", "error");
        } finally {
            setReporting(false);
        }
    };

    const handleMessageSeller = async () => {
        if (!seller) return;
        try {
            await api.post(
                "/messages",
                {
                    receiverId: seller.UserID,
                    content: `Chào ${seller.FName}, tôi muốn hỏi về các sản phẩm của bạn`,
                },
                true
            );
            router.push("/chat");
        } catch (err) {
            showNotification("Vui lòng đăng nhập để nhắn tin", "error");
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-[#F8FAFC]">
                <HomeNavbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">Đang tải...</div>
                </div>
                <HomeFooter />
            </main>
        );
    }

    if (!seller) {
        return (
            <main className="min-h-screen bg-[#F8FAFC]">
                <HomeNavbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center text-red-600">Không tìm thấy người bán</div>
                </div>
                <HomeFooter />
            </main>
        );
    }

    const fullName = `${seller.LName ?? ""} ${seller.FName ?? ""}`.trim();
    const trustScore = safeMetric(seller.TrustScore, 100);
    const warningCount = safeMetric(seller.WarningCount, 0);
    const riskBadge = seller.RiskBadge || "Verified";
    const badgeTone =
        riskBadge === "Verified"
            ? "bg-emerald-50 text-emerald-700"
            : riskBadge === "Warned"
                ? "bg-amber-50 text-amber-700"
                : "bg-rose-50 text-rose-700";
    const badgeLabel =
        riskBadge === "Verified"
            ? "Đã xác minh"
            : riskBadge === "Warned"
                ? `${warningCount} cảnh báo`
                : riskBadge === "Restricted"
                    ? "Đang bị hạn chế"
                    : "Không uy tín";

    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            <HomeNavbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Seller Header */}
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Avatar */}
                        <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-md bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                            {seller.AvatarURL ? (
                                <img
                                    src={seller.AvatarURL}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-4xl font-bold text-white">
                                    {seller.FName?.charAt(0) ?? "?"}
                                </span>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-[#193967] mb-2">{fullName}</h1>
                            <p className="text-gray-500 mb-4">{seller.UserEmail}</p>
                            {seller.Address && (
                                <p className="text-gray-600 text-sm mb-4">📍 {seller.Address}</p>
                            )}
                            {seller.Bio && (
                                <p className="text-gray-700 mb-4">{seller.Bio}</p>
                            )}

                            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wide">
                                    NGƯỜI BÁN
                                </span>
                                <span className="px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-xs font-bold uppercase tracking-wide">
                                    ĐÃ XÁC THỰC
                                </span>
                            </div>
                        </div>

                        {/* Rating & Actions */}
                        <div className="flex flex-col gap-4 items-center md:items-end">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-2">
                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    <span className="text-3xl font-bold text-[#193967]">
                                        {seller.Rating?.toFixed(1) ?? "—"}
                                    </span>
                                </div>
                                <p className="text-xs font-medium text-gray-400 uppercase">Đánh giá</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Trust Score</p>
                            <p className="mt-2 text-3xl font-bold text-[#193967]">{trustScore.toFixed(0)}/100</p>
                            <p className="mt-2 text-sm text-gray-600">
                                {seller.TrustHeadline || "Điểm này phản ánh lịch sử đánh giá, giao hàng và report đã được xử lý."}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Lịch sử giao dịch</p>
                            <p className="mt-2 text-3xl font-bold text-[#193967]">
                                {seller.DeliverySuccessRate != null ? `${seller.DeliverySuccessRate}%` : "Chưa đủ dữ liệu"}
                            </p>
                            <p className="mt-2 text-sm text-gray-600">
                                {seller.CompletedOrdersAsSeller || 0} đơn hoàn tất • {seller.ResolvedReportsCount || 0} report đã xử lý
                            </p>
                        </div>
                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Cần lưu ý</p>
                            <p className="mt-2 text-sm font-semibold text-[#193967]">
                                {warningCount > 0 ? `${warningCount} cảnh báo đã được ghi nhận` : "Chưa có cảnh báo nào"}
                            </p>
                            <p className="mt-2 text-sm text-gray-600">
                                {seller.TrustWarningMessage || "Chỉ thanh toán trong hệ thống và kiểm tra kỹ ảnh thật trước khi giao dịch."}
                            </p>
                        </div>
                    </div>

                    {riskBadge !== "Verified" ? (
                        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                            <p className="font-bold">Cảnh báo giao dịch</p>
                            <p className="mt-2">
                                {seller.TrustWarningMessage || "Người bán này đã từng bị cảnh báo vi phạm. Hãy kiểm tra kỹ trước khi giao dịch."}
                            </p>
                        </div>
                    ) : null}

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-8 flex-wrap">
                        <button
                            onClick={handleMessageSeller}
                            className="flex-1 min-w-[150px] flex justify-center items-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 rounded-xl transition"
                        >
                            <MessageSquare className="h-5 w-5" />
                            Nhắn tin
                        </button>
                        <button
                            onClick={() => setShowReportModal(true)}
                            className="flex-1 min-w-[150px] flex justify-center items-center gap-2 border-2 border-red-600 text-red-600 hover:bg-red-50 font-bold py-3 rounded-xl transition"
                        >
                            <AlertCircle className="h-5 w-5" />
                            Báo cáo
                        </button>
                    </div>
                </div>

                {/* Products */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[#193967] mb-6">
                        Sản phẩm của {fullName}
                    </h2>

                    {products.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            Người bán này chưa có sản phẩm nào
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <Link
                                    key={product.ProductID}
                                    href={`/products/${product.ProductID}`}
                                    className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition group"
                                >
                                    <div className="aspect-square overflow-hidden bg-gray-100">
                                        <img
                                            src={getImageUrl(product.ThumbnailURL)}
                                            alt={product.Title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">
                                            {product.Title}
                                        </h3>
                                        <p className="text-xs text-gray-500 mb-2">{product.Author}</p>

                                        <div className="flex items-center justify-between mb-3">
                                            {product.IsForRent ? (
                                                <span className="text-lg font-bold text-blue-600">
                                                    {product.RentalPrice?.toLocaleString("vi-VN")}₫
                                                    <span className="text-xs text-gray-500">/lần</span>
                                                </span>
                                            ) : (
                                                <div className="flex items-end gap-1">
                                                    <span className="text-lg font-bold text-blue-600">
                                                        {product.Price?.toLocaleString("vi-VN")}₫
                                                    </span>
                                                    {product.OriginalPrice && (
                                                        <span className="text-xs text-gray-400 line-through">
                                                            {product.OriginalPrice?.toLocaleString("vi-VN")}₫
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-600">
                                                ⭐ {product.Rating?.toFixed(1) ?? "—"}
                                            </span>
                                            <span className="text-gray-500">
                                                {product.ReviewsCount ?? 0} nhận xét
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold text-[#193967] mb-4">
                            Báo cáo người bán
                        </h2>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Lý do báo cáo <span className="text-red-600">*</span>
                            </label>
                            <select
                                value={reportForm.reason}
                                onChange={(e) =>
                                    setReportForm({ ...reportForm, reason: e.target.value })
                                }
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-600"
                            >
                                <option value="">-- Chọn lý do --</option>
                                <option value="Scam">Lừa đảo</option>
                                <option value="Fake Product">Sản phẩm giả</option>
                                <option value="Rude/Disrespectful">Thiếu tôn trọng</option>
                                <option value="Not Responding">Không phản hồi</option>
                                <option value="Other">Khác</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Chi tiết (tùy chọn)
                            </label>
                            <textarea
                                value={reportForm.description}
                                onChange={(e) =>
                                    setReportForm({ ...reportForm, description: e.target.value })
                                }
                                placeholder="Mô tả chi tiết vấn đề..."
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-600 resize-none"
                                rows={4}
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bằng chứng / link ảnh chụp (nếu có)
                            </label>
                            <textarea
                                value={reportForm.evidenceSummary}
                                onChange={(e) =>
                                    setReportForm({ ...reportForm, evidenceSummary: e.target.value })
                                }
                                placeholder="Ví dụ: link Drive, ảnh chụp chat, tóm tắt bằng chứng..."
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-600 resize-none"
                                rows={3}
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowReportModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleReportSubmit}
                                disabled={reporting}
                                className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                            >
                                {reporting ? "Đang gửi..." : "Gửi báo cáo"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {notification.show && (
                <div className="fixed top-4 right-4 z-[9999] animate-in fade-in slide-in-from-right-4 duration-300">
                    <div
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white ${notification.type === "success"
                                ? "bg-green-500"
                                : notification.type === "error"
                                    ? "bg-red-500"
                                    : "bg-yellow-500"
                            }`}
                    >
                        {notification.type === "success" && (
                            <Check className="h-5 w-5 flex-shrink-0" />
                        )}
                        {notification.type === "error" && (
                            <X className="h-5 w-5 flex-shrink-0" />
                        )}
                        {notification.type === "warning" && (
                            <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        )}
                        <span className="text-sm font-medium">{notification.message}</span>
                    </div>
                </div>
            )}

            <HomeFooter />
        </main>
    );
}
