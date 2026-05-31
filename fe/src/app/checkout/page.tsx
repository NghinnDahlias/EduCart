"use client";

import { api, getImageUrl } from "@/lib/api";
import {
  CheckCircle2,
  ChevronLeft,
  CreditCard,
  Handshake,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import HomeNavbar from "../../components/HomeNavbar";

interface CartItem {
  id: number;
  productId: number;
  title: string;
  author: string;
  sellerName: string;
  image: string;
  price: number;
  type: "buy" | "rent";
  rentalPrice: number | null;
}

interface CheckoutUser {
  UserEmail: string;
  FName: string | null;
  LName: string | null;
  PhoneNumber: string | null;
  Address: string | null;
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"direct" | "cod" | "momo" | "vnpay">("direct");
  const [isProcessing, setIsProcessing] = useState(false);
  const [profile, setProfile] = useState<CheckoutUser | null>(null);
  const [shippingMode, setShippingMode] = useState<"default" | "manual">("manual");
  const [shippingForm, setShippingForm] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
  });

  useEffect(() => {
    Promise.all([
      api.get<{ ok: boolean; items: any[] }>("/cart", true),
      api.get<{ ok: boolean; user: CheckoutUser }>("/users/me", true).catch(() => null),
    ])
      .then(([cartRes, userRes]) => {
        const mapped: CartItem[] = (cartRes.items ?? [])
          .filter((item: any) => item.Stock > 0 && item.Status === "Available")
          .map((item: any) => ({
            id: item.CartItemID,
            productId: item.ProductID,
            title: item.Title,
            author: item.Author,
            sellerName: item.SellerName ?? "Chưa cập nhật",
            image: getImageUrl(item.ThumbnailURL),
            price: item.IsForRent ? (item.RentalPrice ?? item.Price ?? 0) : (item.Price ?? 0),
            type: item.IsForRent ? "rent" : "buy",
            rentalPrice: item.RentalPrice ?? null,
          }));
        setCartItems(mapped);

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
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const depositTotal = cartItems.reduce((sum, item) => sum + (item.type === "rent" ? 100000 : 0), 0);
  const shippingFee = paymentMethod === "direct" ? 0 : cartItems.length > 0 ? 10000 : 0;
  const tempTotal = subtotal + shippingFee;
  const total = tempTotal + depositTotal;
  const resolvedShipping = shippingMode === "default"
    ? {
        fullName: `${profile?.LName ?? ""} ${profile?.FName ?? ""}`.trim(),
        phoneNumber: profile?.PhoneNumber ?? "",
        address: profile?.Address ?? "",
      }
    : shippingForm;

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
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
      if ((paymentMethod === "momo" || paymentMethod === "vnpay") && cartItems.length !== 1) {
        throw new Error("Thanh toán online hiện chỉ hỗ trợ checkout từng sản phẩm. Vui lòng chọn 1 sản phẩm hoặc dùng thanh toán trực tiếp/COD.");
      }

      const buyItems = cartItems.filter((item) => item.type === "buy");
      const rentItems = cartItems.filter((item) => item.type === "rent");
      const createdOrderIds: number[] = [];

      if (buyItems.length > 0) {
        const orderRes = await api.post<{ ok: boolean; order: { OrderID: number } }>(
          "/orders",
          {
            type: "Buy",
            items: buyItems.map((item) => ({ productId: item.productId, quantity: 1 })),
          },
          true,
        );
        createdOrderIds.push(orderRes.order.OrderID);
      }

      if (rentItems.length > 0) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 7);
        const orderRes = await api.post<{ ok: boolean; order: { OrderID: number } }>(
          "/orders",
          {
            type: "Rent",
            items: rentItems.map((item) => ({ productId: item.productId, quantity: 1 })),
            rentStartDate: startDate.toISOString(),
            rentEndDate: endDate.toISOString(),
            dailyRate: rentItems[0].rentalPrice ?? rentItems[0].price,
          },
          true,
        );
        createdOrderIds.push(orderRes.order.OrderID);
      }

      if (paymentMethod === "momo" || paymentMethod === "vnpay") {
        const orderId = createdOrderIds[0];
        const gatewayMethod = paymentMethod === "momo" ? "MoMo" : "VNPay";
        const paymentRes = await api.post<{
          ok: boolean;
          amount: number;
          paymentUrl: string;
        }>(
          "/payments/initiate",
          {
            orderId,
            method: gatewayMethod,
            returnUrl: `${window.location.origin}/payment-result`,
          },
          true,
        );

        const item = cartItems[0];
        const params = new URLSearchParams({
          method: gatewayMethod,
          orderId: String(orderId),
          amount: String(paymentRes.amount),
          title: item.title,
        });
        window.location.href = `/payment-gateway?${params.toString()}`;
        return;
      }

      await Promise.all(
        cartItems.map((item) => api.delete(`/cart/${item.productId}`, true).catch(() => {})),
      );

      window.location.href = "/orders";
    } catch (err: any) {
      alert(err?.message ?? "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <HomeNavbar />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/cart"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-gray-500 transition-colors hover:text-blue-600"
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại giỏ hàng
        </Link>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-[#193967]">Thanh toán</h1>
              <p className="font-medium text-gray-500">Hoàn tất thông tin để nhận tài liệu hoặc sản phẩm học tập của bạn.</p>
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

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <button
                  onClick={() => setPaymentMethod("direct")}
                  className={`relative flex flex-col items-center gap-3 rounded-2xl border-2 p-6 text-center transition-all ${paymentMethod === "direct" ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <div className={`rounded-xl p-3 ${paymentMethod === "direct" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                    <Handshake className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-[#193967]">Giao dịch trực tiếp</p>
                    <p className="mt-1 text-xs font-medium text-gray-400">Gặp mặt trao đổi sản phẩm và thanh toán trực tiếp</p>
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
                    <p className="mt-1 text-xs font-medium text-gray-400">Thanh toán khi nhận hàng</p>
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
                    <p className="mt-1 text-xs font-medium text-gray-400">Thanh toán online cho checkout từng sản phẩm</p>
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
                    <p className="mt-1 text-xs font-medium text-gray-400">Thanh toán online cho checkout từng sản phẩm</p>
                  </div>
                  {paymentMethod === "vnpay" ? <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-sky-500" /> : null}
                </button>
              </div>
            </section>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-28 rounded-2xl border border-gray-200 bg-gray-50 p-8">
              <h3 className="mb-6 text-lg font-bold text-[#193967]">Đơn hàng của bạn</h3>

              {isLoading ? (
                <div className="py-8 text-center text-sm text-gray-400">Đang tải...</div>
              ) : cartItems.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-400">
                  Giỏ hàng trống.{" "}
                  <Link href="/products" className="font-semibold text-blue-600">
                    Khám phá sản phẩm
                  </Link>
                </div>
              ) : (
                <div className="mb-6 space-y-4 border-b border-gray-200 pb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="h-[72px] w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100 shadow-sm">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-bold text-gray-400">{item.title.charAt(0)}</div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-center">
                        <h4 className="line-clamp-1 text-sm font-bold text-[#193967]">{item.title}</h4>
                        <p className="text-xs text-gray-400">{item.author}</p>
                        <p className="text-xs text-gray-500">Người bán: {item.sellerName}</p>
                        <p className="mt-0.5 text-sm font-bold text-blue-600">{item.price.toLocaleString("vi-VN")} VNĐ</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isLoading ? (
                <>
                  <div className="mb-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-500">Phí ship</span>
                      <span className="font-bold text-[#193967]">{shippingFee.toLocaleString("vi-VN")} VNĐ</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-500">Tiền hàng </span>
                      <span className="font-bold text-[#193967]">{tempTotal.toLocaleString("vi-VN")} VNĐ</span>
                    </div>
                    {depositTotal > 0 ? (
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-500">Tiền cọc (hoàn trả sau)</span>
                        <span className="font-bold text-[#193967]">{depositTotal.toLocaleString("vi-VN")} VNĐ</span>
                      </div>
                    ) : null}
                  </div>

                  <div className="mb-6 flex items-center justify-between border-t border-gray-200 pt-4">
                    <span className="font-bold text-[#193967]">TỔNG CỘNG</span>
                    <span className="text-2xl font-bold text-blue-600">{total.toLocaleString("vi-VN")} VNĐ</span>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || cartItems.length === 0}
                    className={`flex w-full items-center justify-center gap-2 rounded-lg py-3 text-center font-bold text-white transition-all ${isProcessing || cartItems.length === 0 ? "cursor-not-allowed bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        ĐANG XỬ LÝ...
                      </>
                    ) : (
                      "XÁC NHẬN THANH TOÁN"
                    )}
                  </button>
                </>
              ) : null}

              <div className="mt-6 flex items-center gap-2 text-blue-600">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Thanh toán bảo mật cùng EduCart</span>
              </div>
              <p className="mt-2 text-[10px] leading-relaxed text-gray-400">
                Dữ liệu của bạn được mã hóa trong quá trình giao dịch. Địa chỉ mặc định có thể dùng ngay, hoặc bạn có thể nhập địa chỉ khác cho đơn hiện tại.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
