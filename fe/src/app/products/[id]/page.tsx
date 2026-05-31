"use client";

import HomeFooter from "@/components/HomeFooter";
import HomeNavbar from "@/components/HomeNavbar";
import { ChevronLeft, ChevronRight, Heart, Star, MessageSquare, AlertCircle, Check, X } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { api, getImageUrl } from "@/lib/api";

type ApiReview = {
    Rating: number;
    Comment: string;
    CreatedAt: string;
    ReviewerName: string;
    ReviewerAvatarURL?: string;
};

type ApiProductDetail = {
    ProductID: number;
    Title: string;
    Author: string;
    Price: number;
    OriginalPrice: number | null;
    DiscountLabel: string | null;
    RentalPrice: number | null;
    IsForRent: boolean;
    Status: string;
    Rating: number | null;
    ReviewsCount: number;
    ThumbnailURL: string | null;
    SellerID: number;
    SellerName: string;
    Category: string | null;
    Format: string | null;
    TermLabel: string | null;
    Stock: number;
    Description?: string;
    Language?: string | null;
    Pages?: number | null;
    Publisher?: string | null;
    PublishYear?: number | null;
    ISBN?: string | null;
    Condition?: number | null;
    SellerAvatarURL?: string | null;
    images?: Array<{ ImageID: number; ImageURL: string; SortOrder: number }>;
};

type SellerTrust = {
    UserID: number;
    WarningCount?: number;
    TrustScore?: number;
    RiskBadge?: string;
    DeliverySuccessRate?: number | null;
    TrustHeadline?: string | null;
    TrustWarningMessage?: string | null;
};

function fmtVND(n: number | null | undefined): string {
    if (n == null || Number.isNaN(n)) return "";
    return n.toLocaleString("vi-VN") + "₫";
}

function safeMetric(value: unknown, fallback: number) {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
}

export default function ProductPage() {
    const params = useParams();
    const rawId = params?.id;
    const router = useRouter();

    const [product, setProduct] = useState<ApiProductDetail | null>(null);
    const [sellerTrust, setSellerTrust] = useState<SellerTrust | null>(null);
    const [reviews, setReviews] = useState<ApiReview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

    // Report modal state
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

    // Rental form state (used only for UI pricing, checkout flow is still handled elsewhere)
    const [rentalStartDate, setRentalStartDate] = useState("");
    const [rentalEndDate, setRentalEndDate] = useState("");
    const [rentalDays, setRentalDays] = useState(7);

    const productId = useMemo(() => {
        if (!rawId || typeof rawId !== "string") return null;
        const n = Number(rawId);
        return Number.isFinite(n) ? n : null;
    }, [rawId]);

    const images = useMemo(() => {
        if (!product) return [];
        if (!product.images?.length) {
            return product.ThumbnailURL ? [{ ImageURL: product.ThumbnailURL }] : [];
        }
        return product.images.map((x) => ({ ImageURL: x.ImageURL, SortOrder: x.SortOrder }));
    }, [product]);

    useEffect(() => {
        if (!productId) return;
        setSelectedImage(0);
        setCurrentReviewIndex(0);
    }, [productId]);

    useEffect(() => {
        if (!productId) return;

        let alive = true;
        setIsLoading(true);
        setError(null);

        Promise.all([
            api.get<{ ok: boolean; product: ApiProductDetail }>(`/products/${productId}`),
            api.get<{ ok: boolean; reviews: ApiReview[] }>(`/products/${productId}/reviews`),
        ])
            .then(async ([p, r]) => {
                if (!alive) return;
                setProduct(p.product);
                setReviews(r.reviews || []);
                if (p.product?.SellerID) {
                    try {
                        const sellerRes = await api.get<{ ok: boolean; user: SellerTrust }>(`/users/${p.product.SellerID}`);
                        if (alive) {
                            setSellerTrust(sellerRes.user);
                        }
                    } catch {
                        if (alive) {
                            setSellerTrust(null);
                        }
                    }
                }
            })
            .catch((e: any) => {
                if (!alive) return;
                setError(e?.message || "Không thể tải sản phẩm");
                setProduct(null);
                setReviews([]);
            })
            .finally(() => {
                if (!alive) return;
                setIsLoading(false);
            });

        return () => {
            alive = false;
        };
    }, [productId]);

    useEffect(() => {
        if (!rentalStartDate || !rentalEndDate) {
            setRentalDays(1);
            return;
        }

        const start = new Date(rentalStartDate);
        const end = new Date(rentalEndDate);
        const diffTime = end.getTime() - start.getTime();
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setRentalDays(days > 0 ? days : 1);
    }, [rentalStartDate, rentalEndDate]);

    const handleReportSeller = async () => {
        if (!reportForm.reason.trim()) {
            showNotification("Vui lòng chọn lý do báo cáo", "warning");
            return;
        }

        setReporting(true);
        try {
            const response = await api.post<{ ok: boolean }>(
                "/reports",
                {
                    reportedUserId: product?.SellerID,
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

    if (!rawId || typeof rawId !== "string" || !productId) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900">Sản phẩm không tìm thấy</h1>
                    <Link href="/" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        Quay lại trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <main className="bg-white">
                <HomeNavbar />
                <div className="py-16 text-center text-gray-500">Đang tải...</div>
                <HomeFooter />
            </main>
        );
    }

    if (error || !product) {
        return (
            <main className="bg-white">
                <HomeNavbar />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900">Sản phẩm không tìm thấy</h1>
                        <p className="mt-2 text-sm text-gray-600">{error || ""}</p>
                        <Link href="/" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                            Quay lại trang chủ
                        </Link>
                    </div>
                </div>
                <HomeFooter />
            </main>
        );
    }

    const tag = product.IsForRent ? "THUÊ" : "BÁN";

    const rentalPrice = product.RentalPrice ?? 0;
    const depositFee = 100000;
    const rentalTotal = rentalPrice;
    const total = rentalTotal + depositFee;

    const normalizedRating = product.Rating ?? 0;

    const reviewList = reviews || [];

    const safeImages = images.length ? images : [{ ImageURL: product.ThumbnailURL || "" }];

    const pageSizePx = 350; // for carousel translate
    const maxReviewIndex = Math.max(0, reviewList.length - 1);

    return (
        <main className="bg-white">
            <HomeNavbar />

            <section className="py-8 bg-gray-50 min-h-screen">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-blue-600">
                            Trang chủ
                        </Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-blue-600">
                            Sản phẩm
                        </Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">{product.Title}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 bg-white rounded-2xl p-8">
                        {/* Left */}
                        <div className="flex flex-col gap-6">
                            <div className="relative overflow-hidden rounded-2xl bg-gray-100 h-[400px]">
                                <img
                                    src={getImageUrl(safeImages[selectedImage]?.ImageURL || product.ThumbnailURL)}
                                    alt={product.Title}
                                    className="h-full w-full object-cover"
                                />

                                <button
                                    onClick={() => setSelectedImage((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1))}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white transition"
                                >
                                    <ChevronLeft className="h-6 w-6 text-gray-900" />
                                </button>
                                <button
                                    onClick={() => setSelectedImage((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1))}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white transition"
                                >
                                    <ChevronRight className="h-6 w-6 text-gray-900" />
                                </button>

                                <div className="absolute left-4 top-4 flex flex-col gap-2">
                                    <div
                                        className={`rounded-md px-3 py-1.5 text-xs font-bold text-white text-center ${product.IsForRent ? "bg-orange-600" : "bg-blue-600"}`}
                                    >
                                        {tag}
                                    </div>
                                    {product.DiscountLabel && (
                                        <div className="rounded-md bg-orange-500 px-3 py-1.5 text-xs font-bold text-white text-center">
                                            {product.DiscountLabel}
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => setIsFavorite(!isFavorite)}
                                    className="absolute right-4 top-4 rounded-full bg-white p-3 shadow-md hover:bg-gray-100 transition"
                                >
                                    <Heart className={`h-6 w-6 transition ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                                </button>
                            </div>

                            <div className="flex gap-2 overflow-x-auto">
                                {safeImages.map((img, index) => (
                                    <button
                                        key={img.ImageURL + index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${selectedImage === index ? "border-blue-600" : "border-gray-200"}`}
                                    >
                                        <img src={getImageUrl(img.ImageURL)} alt={`${product.Title} ${index + 1}`} className="h-full w-full object-cover" />
                                    </button>
                                ))}
                            </div>

                            <div className="rounded-2xl bg-gray-50 p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <Link href={`/seller/${product.SellerID}`} className="flex items-center gap-3 flex-1 hover:opacity-80 transition">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-bold text-lg">
                                            {product.SellerName?.charAt(0) || "E"}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-sm">{product.SellerName}</h3>
                                            <p className="text-xs text-gray-600">
                                                {sellerTrust?.RiskBadge === "Verified"
                                                    ? "Đã xác minh"
                                                    : sellerTrust?.RiskBadge === "Warned"
                                                        ? `${sellerTrust?.WarningCount || 0} cảnh báo`
                                                        : sellerTrust?.RiskBadge === "Restricted"
                                                            ? "Đang bị hạn chế"
                                                            : sellerTrust?.RiskBadge === "Untrusted"
                                                                ? "Không uy tín"
                                                                : "Thông tin người bán"}
                                            </p>
                                        </div>
                                    </Link>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-blue-600">{product.Rating ?? ""}</div>
                                        <p className="text-xs font-semibold text-gray-600">RATING</p>
                                    </div>
                                </div>

                                {sellerTrust ? (
                                    <div
                                        className={`mb-4 rounded-2xl border p-4 text-sm ${
                                            sellerTrust.RiskBadge && sellerTrust.RiskBadge !== "Verified"
                                                ? "border-amber-200 bg-amber-50 text-amber-900"
                                                : "border-emerald-200 bg-emerald-50 text-emerald-900"
                                        }`}
                                    >
                                        <p className="font-bold">
                                            Trust score: {safeMetric(sellerTrust.TrustScore, 100).toFixed(0)}/100
                                        </p>
                                        <p className="mt-1">
                                            {sellerTrust.TrustHeadline || "Người bán đang ở trạng thái bình thường."}
                                        </p>
                                        {sellerTrust.TrustWarningMessage ? (
                                            <p className="mt-2 text-xs">
                                                {sellerTrust.TrustWarningMessage}
                                            </p>
                                        ) : null}
                                    </div>
                                ) : null}

                                <div className="flex gap-3 mb-4">
                                    <button
                                        onClick={async () => {
                                            if (!product.SellerID) return;
                                            try {
                                                await api.post("/messages", {
                                                    receiverId: product.SellerID,
                                                    productId: product.ProductID,
                                                    content: `Chào bạn, tôi muốn hỏi về sản phẩm "${product.Title}"`,
                                                }, true);
                                                router.push("/chat");
                                            } catch (err) {
                                                showNotification("Vui lòng đăng nhập để nhắn tin", "error");
                                            }
                                        }}
                                        className="flex-1 flex justify-center items-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 rounded-xl transition"
                                    >
                                        <MessageSquare className="h-5 w-5" />
                                        Nhắn tin cho người bán
                                    </button>

                                    <button
                                        onClick={() => setShowReportModal(true)}
                                        className="flex-1 flex justify-center items-center gap-2 border-2 border-red-600 text-red-600 hover:bg-red-50 font-bold py-3 rounded-xl transition"
                                    >
                                        <AlertCircle className="h-5 w-5" />
                                        Báo cáo người bán
                                    </button>
                                </div>

                                <div className="pt-6 border-t border-gray-200">
                                    <h4 className="font-bold text-gray-900 mb-3 text-sm">NỘI DUNG</h4>
                                    <p className="text-sm text-gray-700 leading-relaxed">{product.Description || ""}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="flex flex-col gap-6">
                            {product.IsForRent ? (
                                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Đặt thuê ngay</h2>



                                    <div className="grid grid-cols-2 gap-4 mb-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Ngày nhận hàng</label>
                                            <input
                                                type="date"
                                                value={rentalStartDate}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRentalStartDate(e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm outline-none focus:border-blue-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Ngày trả hàng</label>
                                            <input
                                                type="date"
                                                value={rentalEndDate}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRentalEndDate(e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm outline-none focus:border-blue-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-2xl p-5 mb-6">
                                        <div className="space-y-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Phí thuê</span>
                                                <span className="font-semibold text-gray-900">{rentalTotal.toLocaleString("vi-VN")}₫</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Tiền cọc (Hoàn trả sau)</span>
                                                <span className="font-semibold text-gray-900">{depositFee.toLocaleString("vi-VN")}₫</span>
                                            </div>
                                            <div className="border-t border-gray-300 pt-4 flex justify-between items-center">
                                                <span className="text-xl font-bold text-gray-900">Tổng cộng tạm tính</span>
                                                <span className="text-3xl font-bold text-blue-600">{total.toLocaleString("vi-VN")}₫</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (!rentalStartDate || !rentalEndDate) {
                                                alert("Vui lòng chọn ngày nhận và ngày trả hàng!");
                                                return;
                                            }
                                            router.push(`/checkout/${product.ProductID}?startDate=${rentalStartDate}&endDate=${rentalEndDate}`);
                                        }}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition text-lg"
                                    >
                                        🛒 Thuê ngay
                                    </button>

                                    <p className="text-center text-sm text-gray-500 mt-4">Giao dịch an toàn & được bảo hộ bởi EduCart</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-6">
                                    {/* Price Card */}
                                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${product.IsForRent ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}>
                                                {tag}
                                            </span>
                                        </div>
                                        <h2 className="text-3xl font-bold text-gray-900 mb-1">{product.Title}</h2>
                                        <p className="text-gray-500 text-sm mb-4">{product.Author}</p>

                                        <div className="flex items-baseline gap-3 mb-2">
                                            <span className="text-4xl font-extrabold text-blue-600">{fmtVND(product.Price)}</span>
                                            {product.OriginalPrice != null && (
                                                <span className="text-lg line-through text-gray-400">{fmtVND(product.OriginalPrice)}</span>
                                            )}
                                            {product.DiscountLabel && (
                                                <span className="text-sm font-bold text-orange-500">{product.DiscountLabel}</span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1 mb-4">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star
                                                    key={s}
                                                    className={`h-4 w-4 ${s <= Math.round(normalizedRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                                                />
                                            ))}
                                            <span className="ml-1 text-sm text-gray-500">({product.ReviewsCount} đánh giá)</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-6">
                                            {product.Condition != null && (
                                                <div><span className="font-semibold">Tình trạng:</span> {product.Condition}% mới</div>
                                            )}
                                            {product.Stock != null && (
                                                <div><span className="font-semibold">Còn lại:</span> {product.Stock} cuốn</div>
                                            )}
                                            {product.Language && (
                                                <div><span className="font-semibold">Ngôn ngữ:</span> {product.Language}</div>
                                            )}
                                            {product.Pages && (
                                                <div><span className="font-semibold">Số trang:</span> {product.Pages}</div>
                                            )}
                                            {product.Publisher && (
                                                <div><span className="font-semibold">NXB:</span> {product.Publisher}</div>
                                            )}
                                            {product.PublishYear && (
                                                <div><span className="font-semibold">Năm XB:</span> {product.PublishYear}</div>
                                            )}
                                            {product.ISBN && (
                                                <div className="col-span-2"><span className="font-semibold">ISBN:</span> {product.ISBN}</div>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        await api.post("/cart", { productId: product.ProductID }, true);
                                                        router.push("/cart");
                                                    } catch (err: unknown) {
                                                        alert(err instanceof Error ? err.message : "Vui lòng đăng nhập để thêm vào giỏ hàng");
                                                    }
                                                }}
                                                disabled={product.Stock === 0}
                                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition text-lg"
                                            >
                                                🛒 {product.Stock === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        await api.post("/cart", { productId: product.ProductID }, true);
                                                        router.push(`/checkout`);
                                                    } catch (err: unknown) {
                                                        alert(err instanceof Error ? err.message : "Vui lòng đăng nhập để mua hàng");
                                                    }
                                                }}
                                                disabled={product.Stock === 0}
                                                className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed font-bold py-4 rounded-xl transition text-lg"
                                            >
                                                Mua ngay
                                            </button>
                                        </div>
                                        <p className="text-center text-sm text-gray-500 mt-4">Giao dịch an toàn &amp; được bảo hộ bởi EduCart</p>
                                    </div>
                                </div>
                            )}

                            {/* Reviews Section */}
                            {reviewList.length > 0 && (
                                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-gray-900 text-lg">Đánh giá ({reviewList.length})</h3>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setCurrentReviewIndex(Math.max(0, currentReviewIndex - 1))}
                                                disabled={currentReviewIndex === 0}
                                                className="p-1 rounded disabled:opacity-30"
                                            >
                                                <ChevronLeft className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => setCurrentReviewIndex(Math.min(maxReviewIndex, currentReviewIndex + 1))}
                                                disabled={currentReviewIndex === maxReviewIndex}
                                                className="p-1 rounded disabled:opacity-30"
                                            >
                                                <ChevronRight className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div
                                        className="overflow-hidden"
                                        style={{ maxHeight: `${pageSizePx}px` }}
                                    >
                                        <div
                                            className="transition-transform duration-300"
                                            style={{ transform: `translateY(-${currentReviewIndex * 100}px)` }}
                                        >
                                            {reviewList.map((review, idx) => (
                                                <div key={idx} className="mb-4 pb-4 border-b border-gray-100 last:border-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {review.ReviewerAvatarURL ? (
                                                            <img src={getImageUrl(review.ReviewerAvatarURL)} alt="Avatar" className="w-6 h-6 rounded-full object-cover" />
                                                        ) : (
                                                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                                                {(review.ReviewerName || "U").charAt(0)}
                                                            </div>
                                                        )}
                                                        <span className="font-semibold text-sm text-gray-800">{review.ReviewerName || "Ẩn danh"}</span>
                                                        <div className="flex ml-2">
                                                            {[1, 2, 3, 4, 5].map((s) => (
                                                                <Star
                                                                    key={s}
                                                                    className={`h-3 w-3 ${s <= (review.Rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {review.Comment && (
                                                        <p className="text-sm text-gray-600 mt-1">{review.Comment}</p>
                                                    )}
                                                    {review.CreatedAt && (
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {new Date(review.CreatedAt).toLocaleDateString("vi-VN")}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 bg-black/75 bg-opacity-20 flex items-center justify-center z-50 p-4">
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
                                placeholder="Ví dụ: ảnh chụp chat, biên nhận, link Drive..."
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
                                onClick={handleReportSeller}
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
