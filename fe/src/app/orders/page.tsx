"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package, CheckCircle, Truck, ShoppingBag, Plus, Eye, Edit3,
  MessageSquare, Clock, RefreshCw, BookOpen, BarChart3, RotateCcw,
} from "lucide-react";
import HomeNavbar from "../../components/HomeNavbar";
import { api } from "@/lib/api";

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

interface ApiSellerProduct {
  ProductID: number;
  Title: string;
  Author: string;
  ThumbnailURL: string | null;
  Price: number;
  RentalPrice: number | null;
  IsForRent: boolean;
  Status: string;
  CreatedAt: string;
}

function lifecycleToUI(state: string, orderType: "Buy" | "Rent"): UIOrderStatus {
  const map: Record<string, UIOrderStatus> = {
    Pending: "ordered",
    Shipped: "shipping",
    Delivered: orderType === "Rent" ? "renting" : "ordered",
    Renting: "renting",
    ReturnPending: "renting",
    Returned: "returned",
    Completed: "completed",
    Cancelled: "cancelled",
  };
  return map[state] ?? "ordered";
}

const buyStages = [{ label: "ĐÃ ĐẶT", key: "ordered", icon: Package }, { label: "ĐANG GIAO", key: "shipping", icon: Truck }, { label: "HOÀN TẤT", key: "completed", icon: CheckCircle }];
const rentStages = [{ label: "ĐÃ ĐẶT", key: "ordered", icon: Package }, { label: "ĐANG THUÊ", key: "renting", icon: BookOpen }, { label: "ĐÃ HOÀN TRẢ", key: "returned", icon: RotateCcw }];
const buyStageIndex: Record<string, number> = { ordered: 0, shipping: 1, completed: 2 };
const rentStageIndex: Record<string, number> = { ordered: 0, renting: 1, returned: 2 };

function OrderTimeline({ status, orderType, trackingNumber }: { status: UIOrderStatus; orderType: OrderType; trackingNumber: string }) {
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
        <span className="ml-auto text-[10px] font-bold px-2.5 py-0.5 rounded-full" style={isRent ? { background: "#fed7aa", color: "#92400e" } : { background: "#bfdbfe", color: "#0c4a6e" }}>
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
                <div className="absolute h-0.5 transition-all" style={{ top: "18px", left: "50%", width: "100%", background: isCompleted ? activeColor : "#e5e7eb", zIndex: 0 }} />
              )}
              <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all ${isCurrent ? "ring-4 scale-110" : ""}`}
                style={{ background: isUpcoming ? "#f3f4f6" : `linear-gradient(135deg, ${activeColor}, ${activeColor}bb)`, boxShadow: !isUpcoming ? `0 2px 8px ${activeColor}40` : "none" }}>
                {isCompleted ? <CheckCircle className="h-4 w-4 text-white" /> : <StageIcon className={`h-3.5 w-3.5 ${isUpcoming ? "text-gray-300" : "text-white"}`} />}
              </div>
              <p className={`text-[10px] mt-2 text-center font-bold tracking-wide ${isUpcoming ? "text-gray-300" : ""}`} style={!isUpcoming ? { color: activeColor } : {}}>
                {stage.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: ApiOrder }) {
  const orderType: OrderType = order.OrderType === "Rent" ? "rent" : "buy";
  const status = lifecycleToUI(order.LifecycleState, order.OrderType);
  const isRent = orderType === "rent";

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all">
      <OrderTimeline status={status} orderType={orderType} trackingNumber={String(order.OrderID)} />
      <div className="px-6 py-5">
        <div className="flex gap-4">
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mb-2 ${isRent ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-600"}`}>
                {isRent ? "THUÊ SÁCH" : "MUA HÀNG"}
              </span>
              <p className="text-sm text-gray-400 mb-1">
                {isRent ? "Người cho thuê:" : "Người bán:"}{" "}
                <span className="text-blue-600 font-semibold">{order.SellerName}</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors">
                <MessageSquare className="h-3.5 w-3.5" /> Nhắn tin
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                Xác nhận đã nhận
              </button>
              {isRent && (
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors">
                  <RefreshCw className="h-3.5 w-3.5" /> Gia hạn
                </button>
              )}
            </div>
          </div>
          <div className="shrink-0 text-right flex flex-col items-end justify-start gap-1">
            <p className="text-lg font-bold text-[#193967]">
              {order.TotalAmount != null ? `${order.TotalAmount.toLocaleString("vi-VN")} VNĐ` : "—"}
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
          <span className="font-bold text-[#193967]">{new Date(order.CreatedAt).toLocaleDateString("vi-VN")}</span>
        </div>
        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{order.LifecycleState}</span>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [sellerProducts, setSellerProducts] = useState<ApiSellerProduct[]>([]);
  const [activeTab, setActiveTab] = useState<"orders" | "sales">("orders");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const role = activeTab === "sales" ? "seller" : "buyer";
    setIsLoading(true);
    api.get<{ ok: boolean; orders: ApiOrder[] }>(`/orders?role=${role}`)
      .then(d => setOrders(d.orders ?? []))
      .catch(() => setOrders([]))
      .finally(() => setIsLoading(false));

    if (activeTab === "sales") {
      api.get<{ ok: boolean; products: ApiSellerProduct[] }>("/products?status=all&sellerOnly=true")
        .catch(() => ({ products: [] as ApiSellerProduct[] }))
        .then(d => setSellerProducts((d as any).products ?? []));
    }
  }, [activeTab]);

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <HomeNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#193967] mb-2">Trung tâm Giao dịch</h1>
            <p className="text-gray-500 font-medium">Quản lý các hoạt động mua bán và thuê sách của bạn.</p>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
            {[{ key: "orders", label: "Đơn hàng của tôi", icon: ShoppingBag }, { key: "sales", label: "Quản lý bán hàng", icon: BarChart3 }].map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key as "orders" | "sales")}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.key ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                <tab.icon className="h-3.5 w-3.5" />{tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "orders" && (
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-16 text-gray-400">Đang tải...</div>
            ) : orders.length > 0 ? (
              orders.map(order => <OrderCard key={order.OrderID} order={order} />)
            ) : (
              <div className="bg-white rounded-2xl p-16 text-center border border-gray-200 shadow-sm">
                <div className="w-16 h-16 rounded-xl mx-auto mb-5 flex items-center justify-center bg-blue-50"><Package className="h-8 w-8 text-blue-600" /></div>
                <h3 className="text-xl font-bold text-[#193967] mb-2">Chưa có đơn hàng nào</h3>
                <p className="text-gray-400 mb-6 text-sm">Hãy khám phá kho sách phong phú và đặt đơn hàng đầu tiên!</p>
                <Link href="/products" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-semibold text-sm bg-blue-600 hover:bg-blue-700 transition-all">
                  <ShoppingBag className="h-4 w-4" /> Khám phá sản phẩm
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "sales" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#193967]">Sách đang đăng bán</h2>
              <Link href="/post-product" className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all">
                <Plus className="h-4 w-4" /> Đăng bán sách
              </Link>
            </div>
            {sellerProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm text-gray-400">
                Chưa có sản phẩm nào. <Link href="/post-product" className="text-blue-600 font-semibold">Đăng ngay!</Link>
              </div>
            ) : (
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <div className="grid px-6 py-3.5 text-[10px] font-bold tracking-widest uppercase text-white bg-blue-600" style={{ gridTemplateColumns: "1fr 140px 150px 100px" }}>
                  <span>Sách đang đăng</span><span className="text-center">Giá</span><span className="text-center">Trạng thái</span><span className="text-center">Thao tác</span>
                </div>
                {sellerProducts.map((book, i) => {
                  const isSold = book.Status === "Sold";
                  return (
                    <div key={book.ProductID} className="grid px-6 py-4 items-center hover:bg-blue-50/30 transition-colors group" style={{ gridTemplateColumns: "1fr 140px 150px 100px", borderTop: i > 0 ? "1px solid #f1f5f9" : undefined }}>
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl overflow-hidden shrink-0 shadow-sm bg-gray-100" style={{ width: "48px", height: "60px" }}>
                          {book.ThumbnailURL
                            ? <img src={book.ThumbnailURL} alt={book.Title} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">{book.Title.charAt(0)}</div>}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#193967] group-hover:text-blue-600 transition-colors">{book.Title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{book.Author}</p>
                        </div>
                      </div>
                      <p className="text-center font-bold text-[#193967] text-sm">
                        {book.IsForRent ? `${(book.RentalPrice ?? 0).toLocaleString("vi-VN")}₫/ngày` : `${book.Price.toLocaleString("vi-VN")}₫`}
                      </p>
                      <div className="flex justify-center">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={isSold ? { background: "#f5efe6", color: "#A68F68" } : { background: "#dcfce7", color: "#15803d" }}>
                          {isSold ? "ĐÃ BÁN" : "ĐANG ĐĂNG"}
                        </span>
                      </div>
                      <div className="flex justify-center">
                        <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                          style={isSold ? { color: "#A68F68", background: "#f5efe6" } : { color: "#1d4ed8", background: "#dbeafe" }}>
                          {isSold ? <Eye className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
                          {isSold ? "Chi tiết" : "Sửa tin"}
                        </button>
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
