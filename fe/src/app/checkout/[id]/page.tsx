"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { api, getImageUrl } from "@/lib/api";
import {
  ChevronLeft,
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Phone,
  User,
  Handshake,
  Minus,
  Plus,
} from "lucide-react";

import HomeNavbar from "@/components/HomeNavbar";

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

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const productId = Number(params.id);

  const [product, setProduct] = useState<ApiProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState<
    "direct" | "cod"
  >("direct");

  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!productId) return;
    
    api.get<{ ok: boolean; product: ApiProductDetail }>(`/products/${productId}`)
      .then(res => setProduct(res.product))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [productId]);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-500">Đang tải...</h1>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">
            Không tìm thấy sản phẩm
          </h1>

          <Link
            href="/products"
            className="text-blue-600 font-semibold"
          >
            Quay lại sản phẩm
          </Link>
        </div>
      </main>
    );
  }

  const numericPrice = product.IsForRent ? (product.RentalPrice ?? product.Price ?? 0) : (product.Price ?? 0);
  const subtotal = numericPrice * quantity;
  const total = subtotal;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      if (product.IsForRent) {
        const queryStart = searchParams.get("startDate");
        const queryEnd = searchParams.get("endDate");
        const startDate = queryStart ? new Date(queryStart) : new Date();
        const endDate = queryEnd ? new Date(queryEnd) : new Date();
        if (!queryEnd) endDate.setDate(endDate.getDate() + 7);

        await api.post("/orders", {
          type: "Rent",
          items: [{ productId: product.ProductID, quantity }],
          rentStartDate: startDate.toISOString(),
          rentEndDate: endDate.toISOString(),
          dailyRate: product.RentalPrice ?? product.Price ?? 0,
        }, true);
      } else {
        await api.post("/orders", {
          type: "Buy",
          items: [{ productId: product.ProductID, quantity }]
        }, true);
      }
      window.location.href = "/orders";
    } catch (err: any) {
      alert(err?.message || "Đã xảy ra lỗi");
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <HomeNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold text-sm mb-8 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại sản phẩm
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT */}
          <div className="lg:col-span-8 space-y-6">
            {/* Heading */}
            <div>
              <h1 className="text-4xl font-bold text-[#193967] mb-2">
                Thanh toán
              </h1>

              <p className="text-gray-500 font-medium">
                Hoàn tất thông tin để tiếp tục đặt hàng.
              </p>
            </div>

            {/* Shipping Info */}
            <section className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <MapPin className="h-5 w-5" />
                </div>

                <h2 className="text-xl font-bold text-[#193967]">
                  Thông tin giao hàng
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                    Họ và tên
                  </label>

                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

                    <input
                      type="text"
                      placeholder="Nguyễn Văn A"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                    Số điện thoại
                  </label>

                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

                    <input
                      type="tel"
                      placeholder="0912 345 678"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                    Địa chỉ nhận hàng
                  </label>

                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

                    <input
                      type="text"
                      placeholder="Nhập địa chỉ nhận hàng"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <CreditCard className="h-5 w-5" />
                </div>

                <h2 className="text-xl font-bold text-[#193967]">
                  Phương thức thanh toán
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Direct */}
                <button
                  onClick={() => setPaymentMethod("direct")}
                  className={`relative p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-3 ${
                    paymentMethod === "direct"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl ${
                      paymentMethod === "direct"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <Handshake className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="font-bold text-[#193967]">
                      Giao dịch trực tiếp
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Gặp mặt trao đổi sản phẩm
                    </p>
                  </div>

                  {paymentMethod === "direct" && (
                    <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-blue-600" />
                  )}
                </button>

                {/* COD */}
                <button
                  onClick={() => setPaymentMethod("cod")}
                  className={`relative p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-3 ${
                    paymentMethod === "cod"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl ${
                      paymentMethod === "cod"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <Truck className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="font-bold text-[#193967]">
                      COD
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Thanh toán khi nhận hàng
                    </p>
                  </div>

                  {paymentMethod === "cod" && (
                    <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-blue-600" />
                  )}
                </button>
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm sticky top-28">
              <h3 className="text-lg font-bold text-[#193967] mb-6">
                Đơn hàng của bạn
              </h3>

              {/* Product */}
              <div className="flex gap-4 pb-6 border-b border-gray-200">
                <div className="w-20 h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <img
                    src={getImageUrl(product.images?.[0]?.ImageURL || product.ThumbnailURL)}
                    alt={product.Title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h4 className="font-bold text-[#193967] line-clamp-2">
                    {product.Title}
                  </h4>

                  <p className="text-sm text-gray-400 mt-1">
                    {product.Author}
                  </p>

                  <div
                    className={`inline-block mt-2 px-2 py-1 rounded-md text-xs font-bold text-white ${
                      product.IsForRent
                        ? "bg-orange-500"
                        : "bg-blue-600"
                    }`}
                  >
                    {product.IsForRent ? "Thuê" : "Bán"}
                  </div>

                  <p className="text-lg font-bold text-blue-600 mt-3">
                    {numericPrice.toLocaleString("vi-VN")}₫
                  </p>
                </div>
              </div>

              {/* Quantity */}
              <div className="py-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#193967]">
                    Số lượng
                  </span>

                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() =>
                        setQuantity((prev) =>
                          prev > 1 ? prev - 1 : 1
                        )
                      }
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <div className="w-12 text-center font-bold">
                      {quantity}
                    </div>

                    <button
                      onClick={() =>
                        setQuantity((prev) => prev + 1)
                      }
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-3 my-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Tạm tính
                  </span>

                  <span className="font-bold text-[#193967]">
                    {subtotal.toLocaleString("vi-VN")}₫
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Phí dịch vụ
                  </span>

                  <span className="font-bold text-[#193967]">
                    Miễn phí
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 mb-6">
                <span className="font-bold text-[#193967]">
                  TỔNG CỘNG
                </span>

                <span className="text-2xl font-bold text-blue-600">
                  {total.toLocaleString("vi-VN")}₫
                </span>
              </div>

              {/* Submit */}
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className={`w-full py-3 rounded-lg text-white font-bold transition ${
                  isProcessing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isProcessing
                  ? "ĐANG XỬ LÝ..."
                  : "XÁC NHẬN THANH TOÁN"}
              </button>

              {/* Security */}
              <div className="mt-6 flex items-center gap-2 text-blue-600">
                <ShieldCheck className="h-4 w-4" />

                <span className="text-xs font-bold">
                  Thanh toán bảo mật cùng EduCart
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}