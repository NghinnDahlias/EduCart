"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package, CheckCircle, Truck, ShoppingBag, Plus, Eye,
  MessageSquare, Clock, RefreshCw, BookOpen, BarChart3, RotateCcw,
} from "lucide-react";
import HomeNavbar from "../../components/HomeNavbar";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";

// ─── Types ───────────────────────────────────────────────────────────────────

type UIOrderStatus = "ordered" | "shipping" | "renting" | "completed" | "returned" | "cancelled";
type OrderType = "rent" | "buy";

interface ApiOrder {
  OrderID: number;
  OrderType: "Buy" | "Rent";
  LifecycleState: string;
  TotalAmount: number | null;
  CreatedAt: string;
  BuyerName: string;
  SellerName: string;
}

interface ApiSellerOrder extends ApiOrder {
  status: UIOrderStatus;
}

// Order shape used in the UI (derived from ApiOrder)
interface Order extends ApiOrder {
  status: UIOrderStatus;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function lifecycleToUI(state: string, orderType: "Buy" | "Rent"): UIOrderStatus {
  const map: Record<string, UIOrderStatus> = {
    PendingPayment: "ordered",
    Paid: "ordered",
    Delivering: "shipping",
    ActiveRental: "renting",
    Completed: orderType === "Rent" ? "renting" : "completed",
    DepositRefunded: "returned",
    Cancelled: "cancelled",
  };
  return map[state] ?? "ordered";
}

// ─── Timeline config ──────────────────────────────────────────────────────────

const buyStages = [
  { label: "ĐÃ ĐẶT", key: "ordered", icon: Package },
  { label: "ĐANG GIAO", key: "shipping", icon: Truck },
  { label: "HOÀN TẤT", key: "completed", icon: CheckCircle },
];
const rentStages = [
  { label: "ĐÃ ĐẶT", key: "ordered", icon: Package },
  { label: "ĐANG GIAO", key: "shipping", icon: Truck },
  { label: "ĐANG THUÊ", key: "renting", icon: BookOpen },
  { label: "ĐÃ HOÀN TRẢ", key: "returned", icon: RotateCcw },
];
const buyStageIndex: Record<string, number> = { ordered: 0, shipping: 1, completed: 2 };
const rentStageIndex: Record<string, number> = { ordered: 0, shipping: 1, renting: 2, returned: 3 };

// ─── OrderTimeline ────────────────────────────────────────────────────────────

function OrderTimeline({
  status,
  orderType,
  trackingNumber,
}: {
  status: UIOrderStatus;
  orderType: OrderType;
  trackingNumber: string;
}) {
  const isRent = orderType === "rent";
  const stages = isRent ? rentStages : buyStages;
  const indexMap = isRent ? rentStageIndex : buyStageIndex;
  const currentIdx = indexMap[status] ?? 0;
  const HeaderIcon = isRent ? BookOpen : Truck;
  const activeColor = isRent ? "#d97706" : "#2563eb";

  return (
    <div className={`px-6 py-5 rounded-t-2xl border-b ${isRent ? "bg-orange-50 border-orange-100" : "bg-blue-50 border-blue-100"}`}>
      <div className="flex items-center gap-2 mb-5">
        <div className={`p-1.5 rounded-lg ${isRent ? "bg-orange-100" : "bg-blue-100"}`}>
          <HeaderIcon className="h-3.5 w-3.5" style={{ color: activeColor }} />
        </div>
        <p className="text-sm font-bold text-[#193967] tracking-wide">Đơn hàng #{trackingNumber}</p>
        <span
          className="ml-auto text-[10px] font-bold px-2.5 py-0.5 rounded-full"
          style={isRent ? { background: "#fed7aa", color: "#92400e" } : { background: "#bfdbfe", color: "#0c4a6e" }}
        >
          {isRent ? "THUÊ" : "MUA"}
        </span>
      </div>
      <div className="flex items-start relative px-2">
        {stages.map((stage, idx) => {
          const isCompleted = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const isUpcoming = idx > currentIdx;
          const StageIcon = stage.icon;
          return (
            <div key={stage.key} className="flex-1 flex flex-col items-center relative">
              {idx < stages.length - 1 && (
                <div
                  className="absolute h-0.5 transition-all"
                  style={{ top: "18px", left: "50%", width: "100%", background: isCompleted ? activeColor : "#e5e7eb", zIndex: 0 }}
                />
              )}
              <div
                className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all ${isCurrent ? "ring-4 scale-110" : ""}`}
                style={{
                  background: isUpcoming ? "#f3f4f6" : `linear-gradient(135deg, ${activeColor}, ${activeColor}bb)`,
                  boxShadow: !isUpcoming ? `0 2px 8px ${activeColor}40` : "none",
                }}
              >
                {isCompleted
                  ? <CheckCircle className="h-4 w-4 text-white" />
                  : <StageIcon className={`h-3.5 w-3.5 ${isUpcoming ? "text-gray-300" : "text-white"}`} />}
              </div>
              <p
                className={`text-[10px] mt-2 text-center font-bold tracking-wide ${isUpcoming ? "text-gray-300" : ""}`}
                style={!isUpcoming ? { color: activeColor } : {}}
              >
                {stage.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── OrderCard ────────────────────────────────────────────────────────────────

function OrderCard({ order }: { order: Order }) {
  const router = useRouter();
  const isRent = order.OrderType === "Rent";
  const orderType: OrderType = isRent ? "rent" : "buy";

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all">
      <OrderTimeline
        status={order.status}
        orderType={orderType}
        trackingNumber={String(order.OrderID)}
      />
      <div className="px-6 py-5 space-y-4">
        {/* Seller / Buyer info */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            {isRent ? "Người cho thuê:" : "Người bán:"}{" "}
            <span className="text-blue-600 font-semibold">{order.SellerName}</span>
          </span>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-md"
            style={isRent ? { background: "#fed7aa", color: "#92400e" } : { background: "#dcfce7", color: "#166534" }}
          >
            {isRent ? "ĐANG THUÊ" : "MUA HÀNG"}
          </span>
        </div>

        {/* Actions + Total */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                e.stopPropagation();
                router.push("/chat");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <MessageSquare className="h-3.5 w-3.5" /> Nhắn tin
            </button>
            {(order.LifecycleState === "PendingPayment" || order.LifecycleState === "Paid") && (
              <button
                onClick={async (e) => {
                  e.preventDefault(); e.stopPropagation();
                  if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;
                  try {
                    await api.post(`/orders/${order.OrderID}/transitions`, { event: "onCancel" }, true);
                    window.location.reload();
                  } catch (err: unknown) {
                    alert(err instanceof Error ? err.message : "Có lỗi xảy ra");
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors"
              >
                Hủy đơn
              </button>
            )}
            {(order.status === "shipping" || order.status === "ordered") && (
              <button
                onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  e.stopPropagation();
                  try {
                    await api.post(`/orders/${order.OrderID}/transitions`, { event: "onDeliver" }, true);
                  } catch {
                    // ignore, may already be in delivered state
                  }
                  router.push(`/review?orderId=${order.OrderID}`);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Xác nhận đã nhận
              </button>
            )}
            {isRent && (
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors">
                <RefreshCw className="h-3.5 w-3.5" /> Gia hạn
              </button>
            )}
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-[#193967]">
              {order.TotalAmount != null
                ? `${order.TotalAmount.toLocaleString("vi-VN")} VNĐ`
                : "—"}
            </p>
            <span className="text-[10px] text-gray-400 font-semibold">Tổng đơn</span>
          </div>
        </div>
      </div>

      <div className="mx-6 border-t border-gray-100" />
      <div className="px-6 py-4 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <Clock className="h-3.5 w-3.5 text-gray-400" />
          <span>Ngày đặt:</span>
          <span className="font-bold text-[#193967]">
            {new Date(order.CreatedAt).toLocaleDateString("vi-VN")}
          </span>
        </div>
        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
          {order.LifecycleState}
        </span>
      </div>
    </div>
  );
}

// ─── OrdersPage ───────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [sellerOrders, setSellerOrders] = useState<ApiSellerOrder[]>([]);
  const [activeTab, setActiveTab] = useState<"orders" | "sales">("orders");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "orders") {
      setIsLoading(true);
      api
        .get<{ ok: boolean; orders: ApiOrder[] }>("/orders", true)
        .then((d) => {
          const mapped: Order[] = (d.orders ?? []).map((o) => ({
            ...o,
            status: lifecycleToUI(o.LifecycleState, o.OrderType),
          }));
          setOrders(mapped);
        })
        .catch(() => setOrders([]))
        .finally(() => setIsLoading(false));
    }

    if (activeTab === "sales") {
      setIsLoading(true);
      api
        .get<{ ok: boolean; orders: ApiOrder[] }>("/orders?role=seller", true)
        .then((d) => {
          const mapped: ApiSellerOrder[] = (d.orders ?? []).map((o) => ({
            ...o,
            status: lifecycleToUI(o.LifecycleState, o.OrderType),
          }));
          setSellerOrders(mapped);
        })
        .catch(() => setSellerOrders([]))
        .finally(() => setIsLoading(false));
    }
  }, [activeTab]);

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <HomeNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#193967] mb-2">Trung tâm Giao dịch</h1>
            <p className="text-gray-500 font-medium">Quản lý các hoạt động mua bán và thuê sách của bạn.</p>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
            {[
              { key: "orders", label: "Đơn hàng của tôi", icon: ShoppingBag },
              { key: "sales", label: "Quản lý bán hàng", icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as "orders" | "sales")}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab.key ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders tab */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-16 text-gray-400">Đang tải...</div>
            ) : orders.length > 0 ? (
              orders.map((order) => <OrderCard key={order.OrderID} order={order} />)
            ) : (
              <div className="bg-white rounded-2xl p-16 text-center border border-gray-200 shadow-sm">
                <div className="w-16 h-16 rounded-xl mx-auto mb-5 flex items-center justify-center bg-blue-50">
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-[#193967] mb-2">Chưa có đơn hàng nào</h3>
                <p className="text-gray-400 mb-6 text-sm">Hãy khám phá kho sách phong phú và đặt đơn hàng đầu tiên!</p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-semibold text-sm bg-blue-600 hover:bg-blue-700 transition-all"
                >
                  <ShoppingBag className="h-4 w-4" /> Khám phá sản phẩm
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Sales tab */}
        {activeTab === "sales" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#193967]">Đơn hàng bán của tôi</h2>
              <Link
                href="/post-product"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all"
              >
                <Plus className="h-4 w-4" /> Đăng bán sách
              </Link>
            </div>
            {isLoading ? (
              <div className="text-center py-16 text-gray-400">Đang tải...</div>
            ) : sellerOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm text-gray-400">
                Chưa có đơn hàng nào từ người mua.{" "}
                <Link href="/post-product" className="text-blue-600 font-semibold">
                  Đăng sản phẩm ngay!
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <div
                  className="grid px-6 py-3.5 text-[10px] font-bold tracking-widest uppercase text-white bg-blue-600"
                  style={{ gridTemplateColumns: "1fr 160px 150px 120px" }}
                >
                  <span>Người mua</span>
                  <span className="text-center">Tổng tiền</span>
                  <span className="text-center">Trạng thái</span>
                  <span className="text-center">Thao tác</span>
                </div>
                {sellerOrders.map((order, i) => {
                  const isPending =
                    order.LifecycleState === "Pending" ||
                    order.LifecycleState === "PendingPayment" ||
                    order.LifecycleState === "Paid";
                  const isCompleted = order.LifecycleState === "Completed" || order.LifecycleState === "Returned";
                  return (
                    <div
                      key={order.OrderID}
                      className="grid px-6 py-4 items-center hover:bg-blue-50/30 transition-colors group"
                      style={{
                        gridTemplateColumns: "1fr 160px 150px 120px",
                        borderTop: i > 0 ? "1px solid #f1f5f9" : undefined,
                      }}
                    >
                      <div>
                        <p className="font-bold text-sm text-[#193967] group-hover:text-blue-600 transition-colors">
                          {order.BuyerName}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          #{order.OrderID} · {new Date(order.CreatedAt).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      <p className="text-center font-bold text-[#193967] text-sm">
                        {order.TotalAmount != null
                          ? `${order.TotalAmount.toLocaleString("vi-VN")}₫`
                          : "—"}
                      </p>
                      <div className="flex justify-center">
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={
                            isCompleted
                              ? { background: "#f5efe6", color: "#A68F68" }
                              : isPending
                              ? { background: "#fef9c3", color: "#854d0e" }
                              : { background: "#dcfce7", color: "#15803d" }
                          }
                        >
                          {order.LifecycleState}
                        </span>
                      </div>
                      <div className="flex justify-center gap-1">
                        {isPending && (
                          <button
                            onClick={async () => {
                              try {
                                await api.post(`/orders/${order.OrderID}/transitions`, { event: "onShip" }, true);
                                setSellerOrders(prev =>
                                  prev.map(o =>
                                    o.OrderID === order.OrderID
                                      ? { ...o, LifecycleState: "Shipped", status: "shipping" }
                                      : o
                                  )
                                );
                              } catch (err: unknown) {
                                alert(err instanceof Error ? err.message : "Có lỗi xảy ra");
                              }
                            }}
                            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                            style={{ color: "#1d4ed8", background: "#dbeafe" }}
                          >
                            <Truck className="h-3.5 w-3.5" /> Giao hàng
                          </button>
                        )}
                        {order.LifecycleState === "ActiveRental" && (
                          <button
                            onClick={async () => {
                              try {
                                await api.post(`/orders/${order.OrderID}/transitions`, { event: "onComplete" }, true);
                                window.location.reload();
                              } catch (err: unknown) {
                                alert(err instanceof Error ? err.message : "Có lỗi xảy ra");
                              }
                            }}
                            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                            style={{ color: "#059669", background: "#d1fae5" }}
                          >
                            <CheckCircle className="h-3.5 w-3.5" /> Đã nhận lại sách
                          </button>
                        )}
                        {order.LifecycleState === "Completed" && order.OrderType === "Rent" && (
                          <button
                            onClick={async () => {
                              try {
                                await api.post(`/orders/${order.OrderID}/transitions`, { event: "onRefundDeposit" }, true);
                                window.location.reload();
                              } catch (err: unknown) {
                                alert(err instanceof Error ? err.message : "Có lỗi xảy ra");
                              }
                            }}
                            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                            style={{ color: "#d97706", background: "#fef3c7" }}
                          >
                            <RotateCcw className="h-3.5 w-3.5" /> Hoàn cọc
                          </button>
                        )}
                        {(!isPending && order.LifecycleState !== "ActiveRental" && !(order.LifecycleState === "Completed" && order.OrderType === "Rent")) && (
                          <button
                            onClick={() => router.push(`/review?orderId=${order.OrderID}`)}
                            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                            style={{ color: "#A68F68", background: "#f5efe6" }}
                          >
                            <Eye className="h-3.5 w-3.5" /> Chi tiết
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
