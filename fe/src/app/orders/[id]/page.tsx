"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  CreditCard,
  Package,
  Store,
  Truck,
  User,
  XCircle,
} from "lucide-react";

import HomeNavbar from "@/components/HomeNavbar";
import { api, getImageUrl } from "@/lib/api";

interface ApiOrderItem {
  ProductID: number;
  Title: string;
  Author: string;
  Quantity: number;
  UnitPrice: number;
  ThumbnailURL: string | null;
}

interface ApiOrder {
  OrderID: number;
  BuyerID: number;
  SellerID: number;
  OrderType: "Buy" | "Rent";
  LifecycleState: string;
  TotalAmount: number | null;
  CreatedAt: string;
  PaymentDueAt?: string;
  BuyerName: string;
  SellerName: string;
  items: ApiOrderItem[];
}

interface ApiUser {
  UserID: number;
}

function formatMoney(value: number | null | undefined) {
  if (value == null) return "--";
  return `${value.toLocaleString("vi-VN")} đ`;
}

function getCountdown(order: ApiOrder) {
  if (order.LifecycleState !== "PendingPayment" || !order.PaymentDueAt) return null;
  const dueAt = new Date(order.PaymentDueAt).getTime();
  const remaining = dueAt - Date.now();
  if (remaining <= 0) {
    return "Đơn đang chờ hệ thống tự hủy do đã hết hạn thanh toán.";
  }
  const totalMinutes = Math.floor(remaining / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `Bạn còn ${hours} giờ ${minutes} phút để thanh toán lại. Quá thời hạn này đơn sẽ tự hủy và sản phẩm sẽ quay lại danh mục.`;
}

function getStages(order: ApiOrder, viewerRole: "buyer" | "seller") {
  const labels = [
    "Chờ thanh toán",
    viewerRole === "seller" ? "Đã nhận đơn" : "Đã thanh toán",
    viewerRole === "seller" ? "Đã chuyển cho chuyển phát" : "Đã gửi cho chuyển phát",
    viewerRole === "seller" ? "Xác nhận đã giao hàng" : "Đã giao / đã nhận",
  ];

  const stateToIndex: Record<string, number> = {
    PendingPayment: 0,
    Paid: 1,
    Delivering: 2,
    Completed: 3,
    ActiveRental: 3,
    ReturnRequested: 3,
    Returned: 3,
    DepositRefunded: 3,
  };

  const activeIndex = stateToIndex[order.LifecycleState] ?? -1;

  return labels.map((label, index) => ({
    label,
    done: activeIndex >= index,
    current: activeIndex === index,
  }));
}

function StageTimeline({ order, viewerRole }: { order: ApiOrder; viewerRole: "buyer" | "seller" }) {
  const stages = getStages(order, viewerRole);

  if (order.LifecycleState === "Cancelled") {
    return (
      <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700">
        Đơn hàng này đã bị hủy.
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-3 md:grid-cols-4">
      {stages.map((stage, index) => (
        <div
          key={stage.label}
          className={`rounded-2xl border px-4 py-4 ${
            stage.done ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                stage.done ? "bg-blue-600 text-white" : "bg-white text-gray-500"
              }`}
            >
              {index + 1}
            </span>
            <p className={`text-sm font-semibold ${stage.done ? "text-blue-700" : "text-gray-500"}`}>
              {stage.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Number(params.id);

  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadOrder = async () => {
    const [orderRes, userRes] = await Promise.all([
      api.get<{ ok: boolean; order: ApiOrder }>(`/orders/${orderId}`, true),
      api.get<{ ok: boolean; user: ApiUser }>("/users/me", true),
    ]);
    setOrder(orderRes.order);
    setUser(userRes.user);
  };

  useEffect(() => {
    loadOrder()
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [orderId]);

  const viewerRole = useMemo(() => {
    if (!order || !user) return "buyer";
    return user.UserID === order.SellerID ? "seller" : "buyer";
  }, [order, user]);

  const countdown = order ? getCountdown(order) : null;
  const primaryTitle = order?.items?.[0]?.Title || "";
  const canCancel = order?.LifecycleState === "PendingPayment" || order?.LifecycleState === "Paid";

  const handleTransition = async (event: string, options?: { redirectToReview?: boolean }) => {
    setIsSubmitting(true);
    try {
      await api.post(`/orders/${orderId}/transitions`, { event }, true);
      await loadOrder();
      if (options?.redirectToReview) {
        router.push(`/review?orderId=${orderId}`);
        return;
      }
    } catch (error: unknown) {
      window.alert(error instanceof Error ? error.message : "Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRepay = async (method: "MoMo" | "VNPay") => {
    if (!order) return;
    setIsSubmitting(true);
    try {
      const paymentRes = await api.post<{ ok: boolean; paymentUrl: string; amount: number }>(
        "/payments/initiate",
        {
          orderId: order.OrderID,
          method,
          returnUrl: `${window.location.origin}/payment-result`,
        },
        true,
      );

      const paymentParams = new URLSearchParams({
        method,
        orderId: String(order.OrderID),
        amount: String(paymentRes.amount),
        title: primaryTitle || `Don hang ${order.OrderID}`,
      });

      window.location.href = `/payment-gateway?${paymentParams.toString()}`;
    } catch (error: unknown) {
      window.alert(error instanceof Error ? error.message : "Có lỗi xảy ra");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <HomeNavbar />
        <div className="mx-auto max-w-6xl px-4 py-20 text-center text-gray-500">Đang tải đơn hàng...</div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-slate-50">
        <HomeNavbar />
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <p className="text-lg font-semibold text-slate-900">Không tìm thấy đơn hàng.</p>
          <Link href="/orders" className="mt-4 inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
            Quay lại danh sách đơn
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <HomeNavbar />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600">
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách đơn
        </Link>

        <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500">Đơn hàng #{order.OrderID}</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                {primaryTitle || (viewerRole === "seller" ? "Chi tiết đơn bán" : "Chi tiết đơn mua")}
              </h1>
              <p className="mt-3 text-gray-600">
                {viewerRole === "seller" ? `Người mua: ${order.BuyerName}` : `Người bán: ${order.SellerName}`}
              </p>
              <p className="mt-1 text-sm text-gray-500">Tạo lúc {new Date(order.CreatedAt).toLocaleString("vi-VN")}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-500">Tổng tiền</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{formatMoney(order.TotalAmount)}</p>
            </div>
          </div>

          <StageTimeline order={order} viewerRole={viewerRole} />

          {countdown ? (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800">
              <div className="flex items-start gap-3">
                <Clock3 className="mt-0.5 h-5 w-5 shrink-0" />
                <p>{countdown}</p>
              </div>
            </div>
          ) : null}

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr,0.9fr]">
            <section className="rounded-2xl border border-gray-200 p-5">
              <h2 className="text-xl font-bold text-slate-900">Sản phẩm trong đơn</h2>
              <div className="mt-5 space-y-4">
                {order.items.map((item) => (
                  <div key={item.ProductID} className="flex gap-4 rounded-2xl border border-gray-100 p-4">
                    <img
                      src={getImageUrl(item.ThumbnailURL)}
                      alt={item.Title}
                      className="h-24 w-20 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-lg font-bold text-slate-900">{item.Title}</p>
                      <p className="mt-1 text-sm text-gray-500">{item.Author || "Chưa cập nhật tác giả"}</p>
                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                        <span>Số lượng: {item.Quantity}</span>
                        <span>Đơn giá: {formatMoney(item.UnitPrice)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 p-5">
              <h2 className="text-xl font-bold text-slate-900">Thao tác</h2>
              <div className="mt-5 space-y-3">
                {viewerRole === "buyer" && order.LifecycleState === "PendingPayment" ? (
                  <>
                    <button
                      disabled={isSubmitting}
                      onClick={() => handleRepay("MoMo")}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                      <CreditCard className="h-4 w-4" />
                      Thanh toán lại với MoMo
                    </button>
                    <button
                      disabled={isSubmitting}
                      onClick={() => handleRepay("VNPay")}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-60"
                    >
                      <CreditCard className="h-4 w-4" />
                      Thanh toán lại với VNPay
                    </button>
                  </>
                ) : null}

                {viewerRole === "buyer" && canCancel ? (
                  <button
                    disabled={isSubmitting}
                    onClick={() => handleTransition("onCancel")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                  >
                    <XCircle className="h-4 w-4" />
                    Hủy đơn hàng
                  </button>
                ) : null}

                {viewerRole === "buyer" && order.LifecycleState === "Delivering" ? (
                  <>
                    <button
                      onClick={() => router.push(`/review?orderId=${order.OrderID}`)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-200 px-4 py-3 text-sm font-semibold text-amber-700 hover:bg-amber-50"
                    >
                      Trả hàng
                    </button>
                    <button
                      disabled={isSubmitting}
                      onClick={() => handleTransition("onDeliver", { redirectToReview: true })}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Xác nhận đơn hàng
                    </button>
                  </>
                ) : null}

                {viewerRole === "seller" && order.LifecycleState === "Paid" ? (
                  <button
                    disabled={isSubmitting}
                    onClick={() => handleTransition("onShip")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    <Truck className="h-4 w-4" />
                    Xác nhận đã chuyển cho chuyển phát
                  </button>
                ) : null}

                {viewerRole === "seller" && order.LifecycleState === "ActiveRental" ? (
                  <button
                    disabled={isSubmitting}
                    onClick={() => handleTransition("onComplete")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    <Package className="h-4 w-4" />
                    Đã nhận lại sách
                  </button>
                ) : null}

                {viewerRole === "seller" && order.LifecycleState === "ReturnRequested" ? (
                  <>
                    <button
                      disabled={isSubmitting}
                      onClick={() => handleTransition("onApproveReturn")}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                    >
                      Đồng ý trả hàng
                    </button>
                    <button
                      disabled={isSubmitting}
                      onClick={() => handleTransition("onRejectReturn")}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                    >
                      Từ chối
                    </button>
                  </>
                ) : null}

                {viewerRole === "seller" && order.LifecycleState === "Completed" && order.OrderType === "Rent" ? (
                  <button
                    disabled={isSubmitting}
                    onClick={() => handleTransition("onRefundDeposit")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-200 px-4 py-3 text-sm font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-60"
                  >
                    Hoàn cọc
                  </button>
                ) : null}

                {viewerRole === "buyer" && (order.LifecycleState === "Completed" || order.LifecycleState === "ActiveRental") ? (
                  <button
                    onClick={() => router.push(`/review?orderId=${order.OrderID}`)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-gray-50"
                  >
                    Đánh giá
                  </button>
                ) : null}

                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
                  <div className="flex items-start gap-3">
                    {viewerRole === "seller" ? <Store className="mt-0.5 h-4 w-4 shrink-0" /> : <User className="mt-0.5 h-4 w-4 shrink-0" />}
                    <p>
                      {viewerRole === "seller"
                        ? "Người bán chỉ thấy 3 bước phía bán: đã nhận đơn, đã chuyển cho chuyển phát, xác nhận đã giao hàng."
                        : "Bạn có thể hủy đơn nếu hàng chưa chuyển sang đã gửi cho chuyển phát. Khi đơn ở trạng thái đã giao, bạn có thể trả hàng hoặc xác nhận đơn để chuyển sang trang đánh giá."}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
