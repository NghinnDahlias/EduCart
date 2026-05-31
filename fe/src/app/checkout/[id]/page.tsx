"use client";

import HomeNavbar from "@/components/HomeNavbar";
import { api, getImageUrl } from "@/lib/api";
import {
  CheckCircle2,
  ChevronLeft,
  CreditCard,
  Handshake,
  MapPin,
  Minus,
  Phone,
  Plus,
  ShieldCheck,
  Truck,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

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
  images?: Array<{ ImageID: number; ImageURL: string; SortOrder: number }>;
};

interface CheckoutUser {
  UserEmail: string;
  FName: string | null;
  LName: string | null;
  PhoneNumber: string | null;
  Address: string | null;
}

function CheckoutPageInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const productId = Number(params.id);

  const [product, setProduct] = useState<ApiProductDetail | null>(null);
  const [profile, setProfile] = useState<CheckoutUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"direct" | "cod" | "momo" | "vnpay">("direct");
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingMode, setShippingMode] = useState<"default" | "manual">("manual");
  const [shippingForm, setShippingForm] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
  });

  useEffect(() => {
    if (!productId) return;

    Promise.all([
      api.get<{ ok: boolean; product: ApiProductDetail }>(`/products/${productId}`),
      api.get<{ ok: boolean; user: CheckoutUser }>("/users/me", true).catch(() => null),
    ])
      .then(([productRes, userRes]) => {
        setProduct(productRes.product);
        if (userRes?.ok && userRes.user) {
          const fullName = `${userRes.user.LName ?? ""} ${userRes.user.FName ?? ""}`.trim();
          setProfile(userRes.user);
          setShippingForm({
            fullName,
            phoneNumber: userRes.user.PhoneNumber ?? "",
            address: userRes.user.Address ?? "",
          });
          setShippingMode(userRes.user.Address ? "default" : "manual");
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [productId]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center text-gray-500">Đang tải...</div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold">Không tìm thấy sản phẩm</h1>
          <Link href="/products" className="font-semibold text-blue-600">
            Quay lại sản phẩm
          </Link>
        </div>
      </main>
    );
  }

  const numericPrice = product.IsForRent ? (product.RentalPrice ?? product.Price ?? 0) : (product.Price ?? 0);
  const maxQuantity = Math.max(1, product.Stock || 1);
  const subtotal = numericPrice * quantity;
  const deposit = product.IsForRent ? 100000 * quantity : 0;
  const shippingFee = paymentMethod === "direct" ? 0 : 10000;
  const tempTotal = subtotal + shippingFee;
  const total = tempTotal + deposit;
  const resolvedShipping = shippingMode === "default"
    ? {
        fullName: `${profile?.LName ?? ""} ${profile?.FName ?? ""}`.trim(),
        phoneNumber: profile?.PhoneNumber ?? "",
        address: profile?.Address ?? "",
      }
    : shippingForm;

  const handlePlaceOrder = async () => {
    if (!resolvedShipping.fullName.trim() || !resolvedShipping.phoneNumber.trim()) {
      alert("Vui lòng nhập đầy đủ họ tên và số điện thoại nhận hàng.");
      return;
    }
    if ((paymentMethod === "cod" || paymentMethod === "momo" || paymentMethod === "vnpay") && !resolvedShipping.address.trim()) {
      alert("Vui lòng chọn địa chỉ mặc định hoặc nhập địa chỉ nhận hàng.");
      return;
    }

    setIsProcessing(true);
    try {
      let createdOrderId: number | null = null;

      if (product.IsForRent) {
        const queryStart = searchParams.get("startDate");
        const queryEnd = searchParams.get("endDate");
        const startDate = queryStart ? new Date(queryStart) : new Date();
        const endDate = queryEnd ? new Date(queryEnd) : new Date();
        if (!queryEnd) endDate.setDate(endDate.getDate() + 7);

        const orderRes = await api.post<{ ok: boolean; order: { OrderID: number } }>(
          "/orders",
          {
            type: "Rent",
            items: [{ productId: product.ProductID, quantity }],
            rentStartDate: startDate.toISOString(),
            rentEndDate: endDate.toISOString(),
            dailyRate: product.RentalPrice ?? product.Price ?? 0,
          },
          true,
        );
        createdOrderId = orderRes.order.OrderID;
      } else {
        const orderRes = await api.post<{ ok: boolean; order: { OrderID: number } }>(
          "/orders",
          {
            type: "Buy",
            items: [{ productId: product.ProductID, quantity }],
          },
          true,
        );
        createdOrderId = orderRes.order.OrderID;
      }

      if (!createdOrderId) {
        throw new Error("Không tạo được đơn hàng");
      }

      if (paymentMethod === "momo" || paymentMethod === "vnpay") {
        const gatewayMethod = paymentMethod === "momo" ? "MoMo" : "VNPay";
        const paymentRes = await api.post<{ ok: boolean; paymentUrl: string; amount: number }>(
          "/payments/initiate",
          {
            orderId: createdOrderId,
            method: gatewayMethod,
            returnUrl: `${window.location.origin}/payment-result`,
          },
          true,
        );

        const params = new URLSearchParams({
          method: gatewayMethod,
          orderId: String(createdOrderId),
          amount: String(paymentRes.amount),
          title: product.Title,
        });
        window.location.href = `/payment-gateway?${params.toString()}`;
        return;
      }

      window.location.href = "/orders";
    } catch (err: any) {
      alert(err?.message || "Đã xảy ra lỗi");
      setIsProcessing(false);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity <= 1) {
      const shouldCancel = window.confirm("Số lượng hiện tại là 1. Bạn muốn hủy thao tác mua đơn hàng này không?");
      if (shouldCancel) {
        window.history.back();
      }
      return;
    }
    setQuantity((prev) => prev - 1);
  };

  const handleIncreaseQuantity = () => {
    if (quantity >= maxQuantity) {
      alert(`Số lượng tối đa của sản phẩm này là ${maxQuantity}.`);
      return;
    }
    setQuantity((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <HomeNavbar />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Link href="/products" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-gray-500 transition-colors hover:text-blue-600">
          <ChevronLeft className="h-4 w-4" />
          Quay lại sản phẩm
        </Link>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-[#193967]">Thanh toán</h1>
              <p className="font-medium text-gray-500">Hoàn tất thông tin để tiếp tục đặt hàng.</p>
            </div>

            <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-[#193967]">Thông tin giao hàng</h2>
              </div>

              <div className="space-y-5">
                {profile?.Address ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setShippingMode("default")}
                      className={`rounded-2xl border p-4 text-left transition ${shippingMode === "default" ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white"}`}
                    >
                      <p className="text-sm font-bold text-[#193967]">Dùng địa chỉ mặc định</p>
                      <p className="mt-1 text-sm text-gray-600">{profile.Address}</p>
                      <p className="mt-2 text-xs text-gray-400">
                        {`${profile.LName ?? ""} ${profile.FName ?? ""}`.trim() || profile.UserEmail}
                        {profile.PhoneNumber ? ` • ${profile.PhoneNumber}` : ""}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShippingMode("manual")}
                      className={`rounded-2xl border p-4 text-left transition ${shippingMode === "manual" ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white"}`}
                    >
                      <p className="text-sm font-bold text-[#193967]">Dùng địa chỉ khác / nhập tay</p>
                      <p className="mt-1 text-sm text-gray-600">Bạn có thể chỉnh lại tên, số điện thoại hoặc nhập địa chỉ nhận hàng khác.</p>
                    </button>
                  </div>
                ) : null}

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="ml-1 text-xs font-bold uppercase tracking-wider text-gray-500">Họ và tên</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Nguyễn Văn A"
                        value={resolvedShipping.fullName}
                        onChange={(e) => {
                          setShippingMode("manual");
                          setShippingForm((prev) => ({ ...prev, fullName: e.target.value }));
                        }}
                        disabled={shippingMode === "default" && !!profile?.Address}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm font-medium text-[#193967] transition-all focus:border-blue-600 focus:bg-white focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="ml-1 text-xs font-bold uppercase tracking-wider text-gray-500">Số điện thoại</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="0912 345 678"
                        value={resolvedShipping.phoneNumber}
                        onChange={(e) => {
                          setShippingMode("manual");
                          setShippingForm((prev) => ({ ...prev, phoneNumber: e.target.value }));
                        }}
                        disabled={shippingMode === "default" && !!profile?.Address}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm font-medium text-[#193967] transition-all focus:border-blue-600 focus:bg-white focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="ml-1 text-xs font-bold uppercase tracking-wider text-gray-500">Địa chỉ nhận hàng</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                        value={resolvedShipping.address}
                        onChange={(e) => {
                          setShippingMode("manual");
                          setShippingForm((prev) => ({ ...prev, address: e.target.value }));
                        }}
                        disabled={shippingMode === "default" && !!profile?.Address}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm font-medium text-[#193967] transition-all focus:border-blue-600 focus:bg-white focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>
                    {shippingMode === "default" && profile?.Address ? (
                      <p className="ml-1 text-xs text-gray-400">Đang dùng địa chỉ mặc định từ hồ sơ. Nếu không muốn dùng, hãy chọn “Dùng địa chỉ khác / nhập tay”.</p>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                  <CreditCard className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-[#193967]">Phương thức thanh toán</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <button
                  onClick={() => setPaymentMethod("direct")}
                  className={`relative flex flex-col items-center gap-3 rounded-2xl border-2 p-6 text-center transition-all ${paymentMethod === "direct" ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <div className={`rounded-xl p-3 ${paymentMethod === "direct" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                    <Handshake className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-[#193967]">Giao dịch trực tiếp</p>
                    <p className="mt-1 text-xs text-gray-400">Gặp mặt trao đổi sản phẩm</p>
                  </div>
                  {paymentMethod === "direct" ? <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-blue-600" /> : null}
                </button>

                <button
                  onClick={() => setPaymentMethod("cod")}
                  className={`relative flex flex-col items-center gap-3 rounded-2xl border-2 p-6 text-center transition-all ${paymentMethod === "cod" ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <div className={`rounded-xl p-3 ${paymentMethod === "cod" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                    <Truck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-[#193967]">COD</p>
                    <p className="mt-1 text-xs text-gray-400">Thanh toán khi nhận hàng</p>
                  </div>
                  {paymentMethod === "cod" ? <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-blue-600" /> : null}
                </button>

                <button
                  onClick={() => setPaymentMethod("momo")}
                  className={`relative flex flex-col items-center gap-3 rounded-2xl border-2 p-6 text-center transition-all ${paymentMethod === "momo" ? "border-pink-500 bg-pink-50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <div className={`rounded-xl p-3 ${paymentMethod === "momo" ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-[#193967]">MoMo Sandbox</p>
                    <p className="mt-1 text-xs text-gray-400">Thanh toán online</p>
                  </div>
                  {paymentMethod === "momo" ? <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-pink-500" /> : null}
                </button>

                <button
                  onClick={() => setPaymentMethod("vnpay")}
                  className={`relative flex flex-col items-center gap-3 rounded-2xl border-2 p-6 text-center transition-all ${paymentMethod === "vnpay" ? "border-sky-500 bg-sky-50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <div className={`rounded-xl p-3 ${paymentMethod === "vnpay" ? "bg-sky-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-[#193967]">VNPay Sandbox</p>
                    <p className="mt-1 text-xs text-gray-400">Thanh toán online</p>
                  </div>
                  {paymentMethod === "vnpay" ? <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-sky-500" /> : null}
                </button>
              </div>
            </section>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-28 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="mb-6 text-lg font-bold text-[#193967]">Đơn hàng của bạn</h3>

              <div className="flex gap-4 border-b border-gray-200 pb-6">
                <div className="h-28 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  <img
                    src={getImageUrl(product.images?.[0]?.ImageURL || product.ThumbnailURL)}
                    alt={product.Title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="line-clamp-2 font-bold text-[#193967]">{product.Title}</h4>
                  <p className="mt-1 text-sm text-gray-400">{product.Author}</p>
                  <p className="mt-1 text-sm text-gray-500">Người bán: {product.SellerName}</p>
                  <div className={`mt-2 inline-block rounded-md px-2 py-1 text-xs font-bold text-white ${product.IsForRent ? "bg-orange-500" : "bg-blue-600"}`}>
                    {product.IsForRent ? "Thuê" : "Bán"}
                  </div>
                  <p className="mt-3 text-lg font-bold text-blue-600">{numericPrice.toLocaleString("vi-VN")}đ</p>
                </div>
              </div>

              <div className="border-b border-gray-200 py-6">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#193967]">Số lượng</span>
                  <div className="flex items-center overflow-hidden rounded-xl border border-gray-200">
                    <button
                      onClick={handleDecreaseQuantity}
                      className="flex h-10 w-10 items-center justify-center hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <div className="w-12 text-center font-bold">{quantity}</div>
                    <button
                      onClick={handleIncreaseQuantity}
                      className="flex h-10 w-10 items-center justify-center hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="my-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phí ship</span>
                  <span className="font-bold text-[#193967]">{shippingFee.toLocaleString("vi-VN")} VNĐ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tiền hàng</span>
                  <span className="font-bold text-[#193967]">{subtotal.toLocaleString("vi-VN")}VNĐ</span>
                </div>
                {product.IsForRent ? (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tiền cọc (hoàn trả sau)</span>
                    <span className="font-bold text-[#193967]">{deposit.toLocaleString("vi-VN")}VNĐ</span>
                  </div>
                ) : null}
              </div>

              <div className="mb-6 flex items-center justify-between border-t border-gray-200 pt-4">
                <span className="font-bold text-[#193967]">TỔNG CỘNG</span>
                <span className="text-2xl font-bold text-blue-600">{total.toLocaleString("vi-VN")}VNĐ</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className={`w-full rounded-lg py-3 font-bold text-white transition ${isProcessing ? "cursor-not-allowed bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {isProcessing ? "ĐANG XỬ LÝ..." : "XÁC NHẬN THANH TOÁN"}
              </button>

              <div className="mt-6 flex items-center gap-2 text-blue-600">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs font-bold">Thanh toán bảo mật cùng EduCart</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutPageInner />
    </Suspense>
  );
}
