"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import HomeNavbar from "@/components/HomeNavbar";
import HomeFooter from "@/components/HomeFooter";
import { api } from "@/lib/api";

interface ApiProductDetail {
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
  Description: string | null;
  Language: string | null;
  Pages: number | null;
  Publisher: string | null;
  PublishYear: number | null;
  ISBN: string | null;
  Condition: number | null;
  SellerName: string;
  SellerAvatarURL: string | null;
  SellerRating: number | null;
  Stock: number;
  images: { ImageID: number; ImageURL: string; SortOrder: number }[];
}

function fmtVND(n: number | null | undefined): string {
  if (n == null) return "";
  return n.toLocaleString("vi-VN") + "₫";
}

export default function ProductPage() {
  const params = useParams();
  const id = params?.id;

  const [product, setProduct] = useState<ApiProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [rentalStartDate, setRentalStartDate] = useState("");
  const [rentalEndDate, setRentalEndDate] = useState("");
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  useEffect(() => {
    if (!id || typeof id !== "string") { setNotFound(true); setIsLoading(false); return; }
    api.get<{ ok: boolean; product: ApiProductDetail }>(`/products/${id}`)
      .then(d => { if (d.product) setProduct(d.product); else setNotFound(true); })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return (
    <main className="bg-white min-h-screen flex items-center justify-center">
      <HomeNavbar />
      <p className="text-gray-400 mt-20">Đang tải...</p>
    </main>
  );

  if (notFound || !product) return (
    <main className="bg-white">
      <HomeNavbar />
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Sản phẩm không tìm thấy</h1>
          <Link href="/products" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Xem tất cả sản phẩm
          </Link>
        </div>
      </div>
    </main>
  );

  const tag = product.IsForRent ? "THUÊ" : "BÁN";
  const imageUrls = product.images.map(i => i.ImageURL);
  const displayImages = imageUrls.length > 0 ? imageUrls : [""];

  const handlePrevImage = () => setSelectedImage(prev => prev === 0 ? displayImages.length - 1 : prev - 1);
  const handleNextImage = () => setSelectedImage(prev => prev === displayImages.length - 1 ? 0 : prev + 1);

  const addToCart = async () => {
    try { await api.post("/cart", { productId: product.ProductID }); } catch {}
  };

  return (
    <main className="bg-white">
      <HomeNavbar />
      <section className="py-8 bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-blue-600">Sản phẩm</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.Title}</span>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 bg-white rounded-2xl p-8">
            {/* Left: Image Gallery */}
            <div className="flex flex-col gap-6">
              <div className="relative overflow-hidden rounded-2xl bg-gray-100 h-[400px]">
                {displayImages[selectedImage] ? (
                  <img src={displayImages[selectedImage]} alt={product.Title} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
                    <span style={{ fontSize: "4rem", fontWeight: 700, color: "#3b5bdb", opacity: 0.4 }}>{product.Title.charAt(0)}</span>
                  </div>
                )}
                <button onClick={handlePrevImage} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white transition">
                  <ChevronLeft className="h-6 w-6 text-gray-900" />
                </button>
                <button onClick={handleNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white transition">
                  <ChevronRight className="h-6 w-6 text-gray-900" />
                </button>
                <div className="absolute left-4 top-4 flex flex-col gap-2">
                  <div className={`rounded-md px-3 py-1.5 text-xs font-bold text-white text-center ${tag === "BÁN" ? "bg-blue-600" : "bg-green-600"}`}>{tag}</div>
                  {product.DiscountLabel && (
                    <div className="rounded-md bg-orange-500 px-3 py-1.5 text-xs font-bold text-white text-center">{product.DiscountLabel}</div>
                  )}
                </div>
                <button onClick={() => setIsFavorite(!isFavorite)} className="absolute right-4 top-4 rounded-full bg-white p-3 shadow-md hover:bg-gray-100 transition">
                  <Heart className={`h-6 w-6 transition ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto">
                {displayImages.map((img, index) => (
                  <button key={index} onClick={() => setSelectedImage(index)}
                    className={`h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${selectedImage === index ? "border-blue-600" : "border-gray-200"}`}>
                    {img
                      ? <img src={img} alt={`${product.Title} ${index + 1}`} className="h-full w-full object-cover" />
                      : <div className="h-full w-full bg-gray-200" />}
                  </button>
                ))}
              </div>

              {/* Seller Info */}
              <div className="rounded-2xl bg-gray-50 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-bold text-lg overflow-hidden">
                      {product.SellerAvatarURL
                        ? <img src={product.SellerAvatarURL} className="w-full h-full object-cover" alt="" />
                        : product.SellerName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{product.SellerName}</h3>
                      <p className="text-xs text-gray-600">NGƯỜI BÁN</p>
                    </div>
                  </div>
                  {product.SellerRating != null && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{product.SellerRating.toFixed(1)}</div>
                      <p className="text-xs font-semibold text-gray-600">ĐÁNH GIÁ</p>
                    </div>
                  )}
                </div>
                {product.Condition != null && (
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-2 text-sm">TÌNH TRẠNG SÁCH</h4>
                    <p className="text-sm text-gray-700">
                      {product.Condition}% —{" "}
                      {product.Condition >= 95 ? "Như mới" : product.Condition >= 80 ? "Tốt" : "Khá"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Pricing & Actions */}
            <div className="flex flex-col gap-6">
              {/* Title & Rating */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.Title}</h1>
                <p className="text-gray-600 font-medium">Tác giả: {product.Author}</p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center gap-1">
                    {Array(5).fill(0).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.Rating ?? 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{product.ReviewsCount} đánh giá</span>
                </div>
              </div>

              {/* Price Box */}
              <div className="bg-blue-600 text-white rounded-2xl p-6">
                {product.IsForRent ? (
                  <>
                    <p className="text-sm font-medium opacity-90 mb-1">GIÁ THUÊ TỪ</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">{fmtVND(product.RentalPrice)}</span>
                      <span className="text-lg">/ ngày</span>
                    </div>
                    <p className="text-sm mt-3 opacity-90">Khoảng thời gian thuê tối thiểu: 7 ngày</p>
                  </>
                ) : (
                  <>
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-4xl font-bold">{fmtVND(product.Price)}</span>
                      {product.OriginalPrice != null && (
                        <span className="text-lg line-through opacity-75">{fmtVND(product.OriginalPrice)}</span>
                      )}
                    </div>
                    {product.DiscountLabel && (
                      <p className="text-sm font-semibold opacity-90">Tiết kiệm {product.DiscountLabel}</p>
                    )}
                  </>
                )}
              </div>

              {/* Quantity / Rental dates */}
              {product.IsForRent ? (
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">CHỌN THỜI HẠN THUÊ</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">BẮT ĐẦU THUÊ</label>
                      <input type="date" value={rentalStartDate} onChange={e => setRentalStartDate(e.target.value)}
                        className="w-full px-3 py-2 border-2 border-blue-600 rounded-lg focus:outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">HẾT HẠN</label>
                      <input type="date" value={rentalEndDate} onChange={e => setRentalEndDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-sm" />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">CHỌN SỐ LƯỢNG</label>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition">−</button>
                    <span className="text-2xl font-bold text-gray-900 min-w-12 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition">+</button>
                    <span className="text-sm text-gray-600 ml-auto">{product.Stock > 0 ? "✓ Còn hàng" : "Hết hàng"}</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                  {product.IsForRent ? "⚡ THUÊ NGAY" : "⚡ MUA NGAY"}
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/chat" className="border-2 border-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition text-center">
                    💬 CHAT
                  </Link>
                  <button onClick={addToCart}
                    className="border-2 border-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2">
                    <ShoppingCart className="h-4 w-4" /> GIỎ HÀNG
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl mb-1">🚚</p>
                  <p className="font-semibold text-sm text-gray-900">GIAO HÀNG NHANH</p>
                  <p className="text-xs text-gray-600">Trong 24 giờ</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl mb-1">✓</p>
                  <p className="font-semibold text-sm text-gray-900">HÀNG CHÍNH HÃNG</p>
                  <p className="text-xs text-gray-600">Đảm bảo chất lượng</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="mt-8 bg-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Thông tin chi tiết</h3>
            {product.Description && (
              <p className="text-gray-700 mb-6 leading-relaxed">{product.Description}</p>
            )}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center pb-6 border-b border-gray-200">
                <p className="text-sm text-gray-600 font-semibold mb-2">TÁC GIẢ</p>
                <p className="font-bold text-gray-900">{product.Author}</p>
              </div>
              <div className="text-center pb-6 border-b border-gray-200">
                <p className="text-sm text-gray-600 font-semibold mb-2">NHÀ XUẤT BẢN</p>
                <p className="font-bold text-gray-900">{product.Publisher ?? "—"}</p>
              </div>
              <div className="text-center pb-6 border-b border-gray-200">
                <p className="text-sm text-gray-600 font-semibold mb-2">SỐ TRANG</p>
                <p className="font-bold text-gray-900">{product.Pages ? `${product.Pages} trang` : "—"}</p>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Đánh giá của khách hàng</h2>
            {product.ReviewsCount === 0 ? (
              <p className="text-gray-500">Chưa có đánh giá nào.</p>
            ) : (
              <div className="relative">
                <button onClick={() => setCurrentReviewIndex(Math.max(0, currentReviewIndex - 1))}
                  disabled={currentReviewIndex === 0}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -ml-6 z-10 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 disabled:bg-gray-300 transition">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="overflow-hidden">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-80 rounded-lg border border-gray-200 p-6 bg-white text-gray-600 text-sm">
                      {product.ReviewsCount} đánh giá • Trung bình {(product.Rating ?? 0).toFixed(1)}/5
                    </div>
                  </div>
                </div>
                <button disabled
                  className="absolute right-0 top-1/2 -translate-y-1/2 -mr-6 z-10 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 disabled:bg-gray-300 transition">
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      <HomeFooter />
    </main>
  );
}
