"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Package, CheckCircle, Truck, ShoppingBag, Plus, Eye, Edit3,
    MessageSquare, Clock, RefreshCw, BookOpen, BarChart3, RotateCcw,
} from "lucide-react";
import HomeNavbar from "../../components/HomeNavbar";

type OrderStatus = "ordered" | "shipping" | "renting" | "completed" | "returned";
type OrderType = "rent" | "buy";

interface OrderItem {
    title: string; author: string; image: string; price: number;
    priceLabel?: string; urgencyText?: string; type: OrderType;
}
interface Order {
    id: string; trackingNumber: string; status: OrderStatus;
    items: OrderItem[]; totalPrice: number; createdDate: string; estimatedDelivery: string;
}
interface SaleBook {
    title: string; author: string; image: string; postedAgo: string; price: string; status: "sold" | "active";
}

const mockOrders: Order[] = [
    { id: "1", trackingNumber: "PS-88231", status: "renting", items: [{ title: "Giải tích 1 - James Stewart", author: "Hoàng Nam", image: "https://imgv2-2-f.scribdassets.com/img/document/708185980/original/370d28e56a/1?v=1", price: 30000, priceLabel: "30.000 VNĐ", urgencyText: "CÒN 1 NGÀY NỮA", type: "rent" }], totalPrice: 30000, createdDate: "2025-04-19", estimatedDelivery: "2025-04-25" },
    { id: "2", trackingNumber: "PS-88230", status: "completed", items: [{ title: "Giải tích 2 - Advanced Math", author: "Minh Anh", image: "https://covers.openlibrary.org/b/isbn/0521797071-L.jpg", price: 125000, priceLabel: "125.000 VNĐ", type: "buy" }], totalPrice: 125000, createdDate: "2025-04-15", estimatedDelivery: "2025-04-18" },
    { id: "3", trackingNumber: "PS-88229", status: "ordered", items: [{ title: "Lập trình Python cơ bản", author: "Trần Văn Khoa", image: "https://covers.openlibrary.org/b/isbn/1593279280-L.jpg", price: 85000, priceLabel: "85.000 VNĐ", type: "buy" }], totalPrice: 85000, createdDate: "2025-04-21", estimatedDelivery: "2025-04-28" },
    { id: "4", trackingNumber: "PS-88228", status: "returned", items: [{ title: "Kinh tế vi mô - Nguyên lý", author: "Phương Linh", image: "https://covers.openlibrary.org/b/isbn/9781259290619-L.jpg", price: 45000, priceLabel: "45.000 VNĐ", type: "rent" }], totalPrice: 45000, createdDate: "2025-04-20", estimatedDelivery: "2025-04-27" },
];
const mockSaleBooks: SaleBook[] = [
    { title: "Triết học Mác-Lênin", author: "Phạm Văn Đức", image: "https://covers.openlibrary.org/b/isbn/0717804429-L.jpg", postedAgo: "Đăng 2 ngày trước", price: "45.000 VNĐ", status: "sold" },
    { title: "Văn học Việt Nam", author: "Nguyễn Công Hoan", image: "https://covers.openlibrary.org/b/isbn/0195148177-L.jpg", postedAgo: "Đăng 1 tuần trước", price: "5.000 VNĐ/ngày", status: "active" },
];

const buyStages = [{ label: "ĐÃ ĐẶT", key: "ordered", icon: Package }, { label: "ĐANG GIAO", key: "shipping", icon: Truck }, { label: "HOÀN TẤT", key: "completed", icon: CheckCircle }];
const rentStages = [{ label: "ĐÃ ĐẶT", key: "ordered", icon: Package }, { label: "ĐANG THUÊ", key: "renting", icon: BookOpen }, { label: "ĐÃ HOÀN TRẢ", key: "returned", icon: RotateCcw }];
const buyStageIndex: Record<string, number> = { ordered: 0, shipping: 1, completed: 2 };
const rentStageIndex: Record<string, number> = { ordered: 0, renting: 1, returned: 2 };

function OrderTimeline({ status, orderType, trackingNumber }: { status: OrderStatus; orderType: OrderType; trackingNumber: string }) {
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

function OrderCard({ order }: { order: Order }) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all">
            <OrderTimeline status={order.status} orderType={order.items[0]?.type ?? "buy"} trackingNumber={order.trackingNumber} />
            <div className="px-6 space-y-5 py-5">
                {order.items.map((item, idx) => {
                    const isRent = item.type === "rent";
                    return (
                        <div key={idx} className="flex gap-4">
                            <div className="w-24 h-32 rounded-xl overflow-hidden shrink-0 shadow-sm">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover"
                                    onError={(e) => { const el = e.currentTarget as HTMLImageElement; el.style.display = "none"; const p = el.parentElement; if (p) p.style.background = isRent ? "linear-gradient(160deg,#1a6b5c,#0a3530)" : "linear-gradient(160deg,#1b4f72,#0e2d42)"; }} />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                <div>
                                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mb-2 ${isRent ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-600"}`}>
                                        {isRent ? "ĐANG THUÊ" : "MUA HÀNG"}
                                    </span>
                                    <h4 className="font-bold text-[#193967] text-base leading-tight mb-1 line-clamp-2">{item.title}</h4>
                                    <p className="text-sm text-gray-400 mb-3">{isRent ? "Người cho thuê:" : "Người bán:"} <span className="text-blue-600 font-semibold">{item.author}</span></p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
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
                                {item.urgencyText && <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">{item.urgencyText}</span>}
                                <p className="text-lg font-bold text-[#193967]">{item.priceLabel}</p>
                                {!item.urgencyText && <span className="text-[10px] text-gray-400 font-semibold">Giá trị</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="mx-6 border-t border-gray-100" />
            <div className="px-6 py-4 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    <span>Dự kiến giao:</span>
                    <span className="font-bold text-[#193967]">{order.estimatedDelivery}</span>
                </div>
                <p className="text-sm text-gray-500">Tổng: <span className="font-bold text-[#193967] text-base ml-1">{order.totalPrice.toLocaleString("vi-VN")} VNĐ</span></p>
            </div>
        </div>
    );
}

export default function OrdersPage() {
    const [orders] = useState<Order[]>(mockOrders);
    const [activeTab, setActiveTab] = useState<"orders" | "sales">("orders");

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
                        {orders.length > 0 ? orders.map(order => <OrderCard key={order.id} order={order} />) : (
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
                        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                            <div className="grid px-6 py-3.5 text-[10px] font-bold tracking-widest uppercase text-white bg-blue-600" style={{ gridTemplateColumns: "1fr 140px 150px 100px" }}>
                                <span>Sách đang đăng</span><span className="text-center">Giá / Phí thuê</span><span className="text-center">Trạng thái</span><span className="text-center">Thao tác</span>
                            </div>
                            {mockSaleBooks.map((book, i) => {
                                const isSold = book.status === "sold";
                                return (
                                    <div key={i} className="grid px-6 py-4 items-center hover:bg-blue-50/30 transition-colors group" style={{ gridTemplateColumns: "1fr 140px 150px 100px", borderTop: i > 0 ? "1px solid #f1f5f9" : undefined }}>
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-xl overflow-hidden shrink-0 shadow-sm" style={{ width: "48px", height: "60px" }}>
                                                <img src={book.image} alt={book.title} className="w-full h-full object-cover"
                                                    onError={(e) => { const el = e.currentTarget as HTMLImageElement; el.style.display = "none"; const p = el.parentElement; if (p) p.style.background = isSold ? "linear-gradient(135deg,#A68F68,#8a7254)" : "linear-gradient(135deg,#1a6b5c,#0d4a3e)"; }} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-[#193967] group-hover:text-blue-600 transition-colors">{book.title}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{book.postedAgo}</p>
                                            </div>
                                        </div>
                                        <p className="text-center font-bold text-[#193967] text-sm">{book.price}</p>
                                        <div className="flex justify-center">
                                            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={isSold ? { background: "#f5efe6", color: "#A68F68" } : { background: "#dcfce7", color: "#15803d" }}>
                                                {isSold ? "ĐÃ BÁN/THUÊ" : "ĐÃ ĐĂNG BÀI"}
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
                    </div>
                )}
            </div>
        </main>
    );
}
