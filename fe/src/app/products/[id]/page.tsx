"use client";

import HomeFooter from "@/components/HomeFooter";
import HomeNavbar from "@/components/HomeNavbar";
import { ChevronLeft, ChevronRight, Heart, Star } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

type ApiReview = {
    rating: number;
    comment: string;
    date?: string;
    helpful?: number;
    userName?: string;
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

function fmtVND(n: number | null | undefined): string {
    if (n == null || Number.isNaN(n)) return "";
    return n.toLocaleString("vi-VN") + "₫";
}

export default function ProductPage() {
    const params = useParams();
    const rawId = params?.id;
    const router = useRouter();

    const [product, setProduct] = useState<ApiProductDetail | null>(null);
    const [reviews, setReviews] = useState<ApiReview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

    // Rental form state (used only for UI pricing, checkout flow is still handled elsewhere)
    const [rentalStartDate, setRentalStartDate] = useState("");
    const [rentalEndDate, setRentalEndDate] = useState("");
    const [rentalDays, setRentalDays] = useState(7);
    const [rentalType, setRentalType] = useState<"daily" | "long">("daily");

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
            .then(([p, r]) => {
                if (!alive) return;
                setProduct(p.product);
                setReviews(r.reviews || []);
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
        if (rentalType === "daily") {
            setRentalDays(1);
            return;
        }

        if (!rentalStartDate || !rentalEndDate) {
            setRentalDays(7);
            return;
        }

        const start = new Date(rentalStartDate);
        const end = new Date(rentalEndDate);
        const diffTime = end.getTime() - start.getTime();
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setRentalDays(days > 0 ? days : 1);
    }, [rentalStartDate, rentalEndDate, rentalType]);

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
    const rentalTotal = rentalPrice * rentalDays;
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
                                    src={safeImages[selectedImage]?.ImageURL || product.ThumbnailURL || ""}
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
                                        <img src={img.ImageURL} alt={`${product.Title} ${index + 1}`} className="h-full w-full object-cover" />
                                    </button>
                                ))}
                            </div>

                            <div className="rounded-2xl bg-gray-50 p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-bold text-lg">
                                            {product.SellerName?.charAt(0) || "E"}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-sm">{product.SellerName}</h3>
                                            <p className="text-xs text-gray-600">TRUSTED SELLER</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-blue-600">{product.Rating ?? ""}</div>
                                        <p className="text-xs font-semibold text-gray-600">RATING</p>
                                    </div>
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

                                    <div className="grid grid-cols-2 bg-blue-50 rounded-xl p-1 mb-6">
                                        <button
                                            onClick={() => setRentalType("daily")}
                                            className={`py-2 rounded-lg font-semibold text-sm transition ${rentalType === "daily" ? "bg-white text-blue-600 shadow" : "text-gray-600"}`}
                                        >
                                            Thuê trong ngày
                                        </button>
                                        <button
                                            onClick={() => setRentalType("long")}
                                            className={`py-2 rounded-lg font-semibold text-sm transition ${rentalType === "long" ? "bg-white text-blue-600 shadow" : "text-gray-600"}`}
                                        >
                                            Thuê dài hạn
                                        </button>
                                    </div>

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
                                                <span className="text-gray-600">Phí thuê ({rentalDays} ngày)</span>
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
                                            router.push(`/orders`);
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
                                                onClick={() => router.push(`/checkout`)}
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
                                                        <span className="font-semibold text-sm text-gray-800">{review.userName || "Ẩn danh"}</span>
                                                        <div className="flex">
                                                            {[1, 2, 3, 4, 5].map((s) => (
                                                                <Star
                                                                    key={s}
                                                                    className={`h-3 w-3 ${s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {review.comment && (
                                                        <p className="text-sm text-gray-600">{review.comment}</p>
                                                    )}
                                                    {review.date && (
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {new Date(review.date).toLocaleDateString("vi-VN")}
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

            <HomeFooter />
        </main>
    );
}
