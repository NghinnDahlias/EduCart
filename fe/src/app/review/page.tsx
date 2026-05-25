"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Loader2,
  ShieldCheck,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import HomeFooter from "@/components/HomeFooter";
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
  SellerID: number;
  OrderID: number;
  OrderType: "Buy" | "Rent";
  LifecycleState: string;
  TotalAmount: number | null;
  CreatedAt: string;
  BuyerName: string;
  SellerName: string;
  items?: ApiOrderItem[];
}

function ReviewPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [mode, setMode] = useState<"review" | "return">("review");
  const [returnReason, setReturnReason] = useState("");
  const [returnSuccess, setReturnSuccess] = useState(false);

  const [hasExistingReview, setHasExistingReview] = useState(false);

  useEffect(() => {
    if (!orderId) { setIsLoading(false); return; }
    const fetchData = async () => {
      try {
        const d = await api.get<{ ok: boolean; order: ApiOrder }>(`/orders/${orderId}`, true);
        setOrder(d.order);
        
        if (d.order.items && d.order.items.length > 0) {
          try {
            const [userRes, reviewsRes] = await Promise.all([
              api.get<{ ok: boolean; user: any }>('/users/me', true),
              api.get<{ ok: boolean; reviews: any[] }>(`/products/${d.order.items[0].ProductID}/reviews`)
            ]);
            if (userRes.ok && reviewsRes.ok) {
              const myReview = reviewsRes.reviews.find((r) => r.ReviewerID === userRes.user.id);
              if (myReview) {
                setHasExistingReview(true);
                setRating(myReview.Rating);
                setComment(myReview.Comment || "");
              }
            }
          } catch (e) {
            // ignore inner error
          }
        }
      } catch (err) {
        // error loading order
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [orderId]);

  const handleSubmit = async () => {
    if (!order) return;
    setIsSubmitting(true);
    setSubmitMsg("");
    try {
      // Mark order as complete (Rent orders need this, Buy orders might already be complete)
      try {
        await api.post(`/orders/${order.OrderID}/transitions`, { event: "onComplete" }, true);
      } catch {
        // ignore, may already be in completed state
      }

      // Submit review for each product in the order
      if (order.items && order.items.length > 0) {
        for (const item of order.items) {
          await api.post(`/products/${item.ProductID}/reviews`, {
            orderId: order.OrderID,
            rating,
            comment: comment.trim() || null,
          }, true);
        }
      }

      // Gửi tin nhắn tự động cho người bán
      try {
        await api.post("/messages", {
          receiverId: order.SellerID,
          productId: order.items?.[0]?.ProductID || null,
          content: `Hệ thống: Người mua đã đánh giá ${rating} sao cho đơn hàng #${order.OrderID}.${comment ? ` Nội dung: "${comment}"` : ""}`,
        }, true);
      } catch {
        // ignore
      }

      setSuccess(true);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Có lỗi xảy ra. Vui lòng thử lại.";
      setSubmitMsg(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturn = async () => {
    if (!order) return;
    setIsSubmitting(true);
    setSubmitMsg("");
    try {
      await api.post(`/orders/${order.OrderID}/transitions`, { event: "onRequestReturn" }, true);

      // Gửi tin nhắn tự động cho người bán
      try {
        await api.post("/messages", {
          receiverId: order.SellerID,
          productId: order.items?.[0]?.ProductID || null, // Fixed by system
          content: `Hệ thống: YÊU CẦU TRẢ HÀNG (Đơn #${order.OrderID}). Lý do: ${returnReason}.`,
        }, true);
      } catch {
        // ignore
      }

      setReturnSuccess(true);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Có lỗi xảy ra. Vui lòng thử lại.";
      setSubmitMsg(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f7f7fb] flex flex-col">
        <HomeNavbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="min-h-screen bg-[#f7f7fb] flex flex-col">
        <HomeNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md p-8">
            <div className="w-20 h-20 rounded-2xl bg-green-500 mx-auto flex items-center justify-center mb-6 shadow-md">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-[#0f172a] mb-4">Cảm ơn bạn!</h2>
            <p className="text-gray-600 mb-6">
              Đánh giá của bạn đã được ghi nhận. Đơn hàng đã được xác nhận hoàn tất.
            </p>
            <button
              onClick={() => window.location.href = "/orders"}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
            >
              Về trang đơn hàng
            </button>
          </div>
        </div>
        <HomeFooter />
      </main>
    );
  }

  if (returnSuccess) {
    return (
      <main className="min-h-screen bg-[#f7f7fb] flex flex-col">
        <HomeNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md p-8">
            <div className="w-20 h-20 rounded-2xl bg-red-500 mx-auto flex items-center justify-center mb-6 shadow-md">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-[#0f172a] mb-4">Gửi yêu cầu thành công!</h2>
            <p className="text-gray-600 mb-6">
              Yêu cầu trả hàng của bạn đã được ghi nhận và gửi đến người bán.
            </p>
            <button
              onClick={() => window.location.href = "/orders"}
              className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition"
            >
              Về trang đơn hàng
            </button>
          </div>
        </div>
        <HomeFooter />
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-[#f7f7fb] flex flex-col">
      <HomeNavbar />

      <section className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-10">
            <Link href="/">Trang chủ</Link>
            <span>›</span>
            <Link href="/orders">Theo dõi đơn hàng</Link>
            <span>›</span>
            <span className="text-gray-900 font-semibold">Hoàn tất giao dịch</span>
          </div>

          {/* Header */}
          <div className="text-center mb-14">
            <div className="w-20 h-20 rounded-2xl bg-blue-600 mx-auto flex items-center justify-center mb-6 shadow-md">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>

            {order && (
              <p className="uppercase tracking-wide text-blue-600 font-bold text-sm mb-4">
                ĐƠN HÀNG #{order.OrderID} — {order.LifecycleState.toUpperCase()}
              </p>
            )}

            <h1 className="text-5xl font-extrabold text-[#0f172a] mb-5">
              Xác nhận nhận hàng &amp; Đánh giá
            </h1>

            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Cảm ơn bạn đã tin dùng EduCart. Hãy xác nhận đã nhận hàng thành
              công và đánh giá tại đây để giúp cộng đồng sinh viên chọn lựa tốt
              hơn.
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
            {/* Left */}
            <div className="space-y-6">
              {/* Product Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="text-3xl font-bold text-[#0f172a] mb-6">Sản phẩm đã mua</h2>

                {order?.items && order.items.length > 0 ? (
                  <div className="space-y-6">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="w-28 h-40 rounded-lg overflow-hidden bg-gray-100 border flex-shrink-0">
                          {item.ThumbnailURL ? (
                            <img
                              src={getImageUrl(item.ThumbnailURL)}
                              alt={item.Title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400">
                              {item.Title.charAt(0)}
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <p className="text-blue-600 font-bold uppercase text-sm">
                            {order.OrderType === "Rent" ? "THUÊ SÁCH" : "MUA SÁCH"}
                          </p>
                          <h3 className="font-bold text-2xl text-[#0f172a] leading-snug mt-1">
                            {item.Title}
                          </h3>
                          <p className="text-gray-500 mt-3">{item.Author}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <p className="text-blue-600 font-bold text-2xl">
                              {item.UnitPrice.toLocaleString("vi-VN")}đ
                            </p>
                            {item.Quantity > 1 && (
                              <p className="text-gray-500 font-medium text-lg">
                                x {item.Quantity}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">
                    {!orderId ? "Không có orderId trong URL." : "Đang tải thông tin sản phẩm..."}
                  </p>
                )}

                {/* Seller */}
                {order && (
                  <div className="border-t border-gray-200 mt-6 pt-5 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                      {order.SellerName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Người bán</p>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-lg text-[#0f172a]">{order.SellerName}</h4>
                        <span className="text-blue-600">✔</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Info box */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-4">
                <div className="mt-1">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm leading-relaxed text-gray-700">
                  Nếu hàng sai mô tả, hãy{" "}
                  <span className="font-bold text-blue-600">trả hàng hoàn tiền tại đây</span>
                </p>
              </div>

              {/* Warning */}
              <div className="bg-red-50 border border-red-100 rounded-xl p-5">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-500 mt-1" />
                  <h3 className="text-red-600 font-bold text-xl">LƯU Ý QUAN TRỌNG</h3>
                </div>
                <div className="text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Việc cố ý đánh giá tiêu cực sai sự thật hoặc quấy rối người
                    dùng khác sẽ bị xem là vi phạm Quy chuẩn cộng đồng.
                  </p>
                  <p>
                    EduCart có quyền gỡ bỏ các đánh giá không trung thực và khóa
                    tài khoản vi phạm.
                  </p>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <div className="flex gap-8 mb-10 border-b border-gray-200">
                <button
                  onClick={() => setMode("review")}
                  className={`pb-4 text-xl font-bold transition-colors relative ${mode === "review"
                      ? "text-blue-600"
                      : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  Xác nhận &amp; Đánh giá
                  {mode === "review" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
                  )}
                </button>
                <button
                  onClick={() => setMode("return")}
                  className={`pb-4 text-xl font-bold transition-colors relative ${mode === "return"
                      ? "text-red-600"
                      : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  Yêu cầu trả hàng
                  {mode === "return" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 rounded-t-full" />
                  )}
                </button>
              </div>

              {mode === "review" ? (
                <div>
                  {/* Rating */}
                  <div className="mb-10">
                    <p className="text-sm font-bold tracking-wide text-gray-500 mb-4">
                      MỨC ĐỘ HÀI LÒNG
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setRating(item)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-8 h-8 transition-all ${item <= rating
                                  ? "text-blue-500 fill-blue-500"
                                  : "text-gray-300"
                                }`}
                            />
                          </button>
                        ))}
                      </div>

                      <span className="text-blue-600 font-bold text-2xl">
                        {rating === 1 && "Rất tệ"}
                        {rating === 2 && "Tệ"}
                        {rating === 3 && "Bình thường"}
                        {rating === 4 && "Tốt"}
                        {rating === 5 && "Xuất sắc"}
                      </span>
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="mb-10">
                    <p className="text-sm font-bold tracking-wide text-gray-500 mb-4">
                      NỘI DUNG ĐÁNH GIÁ
                    </p>

                    <textarea
                      rows={6}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Hãy viết cảm nhận của bạn về sản phẩm và thái độ phục vụ của người bán..."
                      className="w-full border border-gray-300 rounded-xl p-5 resize-none outline-none focus:border-blue-600 text-gray-700"
                    />
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-10 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600">
                      <ShieldCheck className="w-5 h-5" />
                      <span>Đánh giá của bạn sẽ được hiển thị công khai</span>
                    </div>

                    {submitMsg && (
                      <p className="text-red-500 text-sm font-medium">{submitMsg}</p>
                    )}

                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-md disabled:bg-blue-300 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : hasExistingReview ? (
                        "Cập nhật đánh giá"
                      ) : (
                        "Gửi đánh giá"
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Return request */}
                  <div className="mb-8">
                    <p className="text-sm font-bold tracking-wide text-gray-500 mb-4">
                      LÝ DO TRẢ HÀNG *
                    </p>

                    <div className="relative">
                      <select
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-5 py-4 appearance-none outline-none focus:border-red-600 text-gray-700"
                      >
                        <option value="">Chọn lý do trả hàng</option>
                        <option value="Sản phẩm lỗi">Sản phẩm lỗi</option>
                        <option value="Sai mô tả">Sai mô tả</option>
                        <option value="Thiếu phụ kiện">Thiếu phụ kiện</option>
                      </select>

                      <ChevronDown className="w-5 h-5 absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-10 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <span>Yêu cầu sẽ được gửi cho người bán phê duyệt</span>
                    </div>

                    <div className="flex flex-col gap-2 items-end">
                      {submitMsg && (
                        <p className="text-red-500 text-sm font-medium">{submitMsg}</p>
                      )}
                      <button
                        onClick={handleReturn}
                        disabled={!returnReason || isSubmitting}
                        className="bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition text-white font-bold px-12 py-4 rounded-xl text-lg shadow-md flex items-center gap-2"
                      >
                        {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
                        {isSubmitting ? "ĐANG GỬI..." : "GỬI YÊU CẦU"}
                      </button>
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

export default function CompleteOrderPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f7f7fb] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </main>
      }
    >
      <ReviewPageInner />
    </Suspense>
  );
}