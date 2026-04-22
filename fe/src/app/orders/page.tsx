"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Package,
    CheckCircle,
    Truck,
    ShoppingBag,
    Plus,
    Eye,
    Edit3,
    MessageSquare,
    Clock,
    RefreshCw,
    BookOpen,
    BarChart3,
    RotateCcw,
} from "lucide-react";
import HomeNavbar from "../../components/HomeNavbar";

/* ─── Types ─────────────────────────────────────────────── */
// Buy flow:  ordered → shipping → completed
// Rent flow: ordered → renting  → returned
type OrderStatus = "ordered" | "shipping" | "renting" | "completed" | "returned";
type OrderType = "rent" | "buy";

interface OrderItem {
    title: string;
    author: string;
    image: string;
    price: number;
    priceLabel?: string;
    urgencyText?: string;
    type: OrderType;
}

interface Order {
    id: string;
    trackingNumber: string;
    status: OrderStatus;
    items: OrderItem[];
    totalPrice: number;
    createdDate: string;
    estimatedDelivery: string;
}

interface SaleBook {
    title: string;
    author: string;
    image: string;
    postedAgo: string;
    price: string;
    status: "sold" | "active";
}

/* ─── Mock Data ──────────────────────────────────────────── */
const mockOrders: Order[] = [
    {
        id: "1",
        trackingNumber: "PS-88231",
        status: "renting",          // rent: đang thuê
        items: [
            {
                title: "Giải tích 1 - James Stewart",
                author: "Hoàng Nam",
                image: "https://imgv2-2-f.scribdassets.com/img/document/708185980/original/370d28e56a/1?v=1",
                price: 30000,
                priceLabel: "30.000 VNĐ",
                urgencyText: "CÒN 1 NGÀY NỮA",
                type: "rent",
            },
        ],
        totalPrice: 30000,
        createdDate: "2025-04-19",
        estimatedDelivery: "2025-04-25",
    },
    {
        id: "2",
        trackingNumber: "PS-88230",
        status: "completed",        // buy: hoàn tất
        items: [
            {
                title: "Giải tích 2 - Advanced Math",
                author: "Minh Anh",
                image: "https://covers.openlibrary.org/b/isbn/0521797071-L.jpg",
                price: 125000,
                priceLabel: "125.000 VNĐ",
                type: "buy",
            },
        ],
        totalPrice: 125000,
        createdDate: "2025-04-15",
        estimatedDelivery: "2025-04-18",
    },
    {
        id: "3",
        trackingNumber: "PS-88229",
        status: "ordered",          // buy: vừa đặt
        items: [
            {
                title: "Lập trình Python cơ bản",
                author: "Trần Văn Khoa",
                image: "https://covers.openlibrary.org/b/isbn/1593279280-L.jpg",
                price: 85000,
                priceLabel: "85.000 VNĐ",
                type: "buy",
            },
        ],
        totalPrice: 85000,
        createdDate: "2025-04-21",
        estimatedDelivery: "2025-04-28",
    },
    {
        id: "4",
        trackingNumber: "PS-88228",
        status: "returned",         // rent: đã hoàn trả
        items: [
            {
                title: "Kinh tế vi mô - Nguyên lý",
                author: "Phương Linh",
                image: "https://covers.openlibrary.org/b/isbn/9781259290619-L.jpg",
                price: 45000,
                priceLabel: "45.000 VNĐ",
                urgencyText: "CÒN 5 NGÀY NỮA",
                type: "rent",
            },
        ],
        totalPrice: 45000,
        createdDate: "2025-04-20",
        estimatedDelivery: "2025-04-27",
    },
];

const mockSaleBooks: SaleBook[] = [
    { title: "Triết học Mác-Lênin", author: "Phạm Văn Đức", image: "https://covers.openlibrary.org/b/isbn/0717804429-L.jpg", postedAgo: "Đăng 2 ngày trước", price: "45.000 VNĐ", status: "sold" },
    { title: "Văn học Việt Nam", author: "Nguyễn Công Hoan", image: "https://covers.openlibrary.org/b/isbn/0195148177-L.jpg", postedAgo: "Đăng 1 tuần trước", price: "5.000 VNĐ/ngày", status: "active" },
];

/* ─── Config ─────────────────────────────────────────────── */
const buyStages = [
    { label: "ĐÃ ĐẶT", key: "ordered", icon: Package },
    { label: "ĐANG GIAO", key: "shipping", icon: Truck },
    { label: "HOÀN TẤT", key: "completed", icon: CheckCircle },
];

const rentStages = [
    { label: "ĐÃ ĐẶT", key: "ordered", icon: Package },
    { label: "ĐANG THUÊ", key: "renting", icon: BookOpen },
    { label: "ĐÃ HOÀN TRẢ", key: "returned", icon: RotateCcw },
];

const buyStageIndex: Record<string, number> = { ordered: 0, shipping: 1, completed: 2 };
const rentStageIndex: Record<string, number> = { ordered: 0, renting: 1, returned: 2 };

/* ─── Book Cover Component ───────────────────────────────── */
function BookCover({ title, image, type }: { title: string; image: string; type: OrderType }) {
    const isRent = type === "rent";
    const fallbackBg = isRent
        ? "linear-gradient(160deg, #1a6b5c 0%, #0d4a3e 60%, #0a3530 100%)"
        : "linear-gradient(160deg, #1b4f72 0%, #154360 60%, #0e2d42 100%)";

    return (
        <div
            className="relative w-28 h-36 rounded-2xl overflow-hidden shrink-0 select-none"
            style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}
        >
            {/* Real product image */}
            <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                    // Fallback: hide img and show gradient
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) parent.style.background = fallbackBg;
                }}
            />
        </div>
    );
}

/* ─── Timeline Component ─────────────────────────────────── */
function OrderTimeline({
    status,
    orderType,
    trackingNumber,
}: {
    status: OrderStatus;
    orderType: OrderType;
    trackingNumber: string;
}) {
    const isRent = orderType === "rent";
    const stages = isRent ? rentStages : buyStages;
    const indexMap = isRent ? rentStageIndex : buyStageIndex;
    const currentIdx = indexMap[status] ?? 0;

    const headerIcon = isRent ? BookOpen : Truck;
    const HeaderIcon = headerIcon;

    return (
        <div
            className="px-6 py-5 rounded-t-2xl border-b"
            style={{
                background: isRent
                    ? "linear-gradient(135deg, #fff5f1 0%, #fffbf8 100%)"
                    : "linear-gradient(135deg, #f0f9ff 0%, #f8fcff 100%)",
                borderBottomColor: isRent
                    ? "rgba(197,91,0,0.1)"
                    : "rgba(59,130,246,0.1)",
            }}
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
                <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: isRent ? "#ffdbcd" : "#dbeafe" }}
                >
                    <HeaderIcon className="h-3.5 w-3.5" style={{ color: isRent ? "#d97706" : "#0284c7" }} />
                </div>
                <p className="text-xs font-bold text-gray-700 tracking-wider uppercase">
                    Đơn hàng #{trackingNumber}
                </p>
                <span
                    className="ml-auto text-xs font-bold px-2.5 py-0.5 rounded-full"
                    style={isRent
                        ? { background: "#fed7aa", color: "#92400e" }
                        : { background: "#bfdbfe", color: "#0c4a6e" }
                    }
                >
                    {isRent ? "THUÊ" : "MUA"}
                </span>
            </div>

            {/* Stages */}
            <div className="flex items-start relative px-2">
                {stages.map((stage, idx) => {
                    const isCompleted = idx < currentIdx;
                    const isCurrent = idx === currentIdx;
                    const isUpcoming = idx > currentIdx;
                    const StageIcon = stage.icon;
                    const activeColor = isRent ? "#d97706" : "#0284c7";
                    const ringClass = isRent ? "ring-[#fed7aa]" : "ring-[#bfdbfe]";
                    const textActive = isRent ? "text-[#d97706]" : "text-[#0284c7]";

                    return (
                        <div key={stage.key} className="flex-1 flex flex-col items-center relative">
                            {/* Connector line */}
                            {idx < stages.length - 1 && (
                                <div
                                    className="absolute h-1 transition-all duration-700"
                                    style={{
                                        top: "20px",
                                        left: "50%",
                                        width: "100%",
                                        background: isCompleted ? activeColor : "#e5e7eb",
                                        zIndex: 0,
                                    }}
                                />
                            )}

                            {/* Circle */}
                            <div
                                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 font-semibold ${isCurrent ? `ring-4 ${ringClass} scale-110` : ""
                                    }`}
                                style={{
                                    background: isUpcoming
                                        ? "#f3f4f6"
                                        : isCompleted
                                            ? activeColor
                                            : `linear-gradient(135deg, ${activeColor}, ${activeColor}dd)`,
                                    boxShadow: !isUpcoming ? `0 4px 12px ${activeColor}40` : "none",
                                }}
                            >
                                {isCompleted ? (
                                    <CheckCircle className="h-5 w-5 text-white" />
                                ) : (
                                    <StageIcon className={`h-4 w-4 ${isUpcoming ? "text-gray-300" : "text-white"}`} />
                                )}
                            </div>

                            <p className={`text-xs mt-2.5 text-center font-bold tracking-wide transition-colors ${isUpcoming ? "text-gray-300" : textActive
                                }`}>
                                {stage.label}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ─── Order Card Component ───────────────────────────────── */
function OrderCard({ order }: { order: Order }) {
    return (
        <div
            className="rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.01]"
            style={{
                background: "#fff",
                border: "1px solid #e8ecf1",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            }}
        >
            <OrderTimeline
                status={order.status}
                orderType={order.items[0]?.type ?? "buy"}
                trackingNumber={order.trackingNumber}
            />

            {/* Items */}
            <div className="px-6 space-y-5 py-4">
                {order.items.map((item, idx) => {
                    const isRent = item.type === "rent";
                    return (
                        <div key={idx} className="flex gap-5 group">
                            <BookCover title={item.title} image={item.image} type={item.type} />

                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                {/* Badge */}
                                <div>
                                    <span
                                        className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-2"
                                        style={
                                            isRent
                                                ? { background: "#fff3e0", color: "#e65100" }
                                                : { background: "#e8f5e9", color: "#2e7d32" }
                                        }
                                    >
                                        {isRent ? "ĐANG THUÊ" : "MUA HÀNG"}
                                    </span>

                                    <h4 className="font-bold text-gray-900 text-base leading-tight mb-1 line-clamp-2">
                                        {item.title}
                                    </h4>
                                    <p className="text-sm text-gray-500 mb-4">
                                        {isRent ? "Người cho thuê:" : "Người bán:"}{" "}
                                        <span className="text-[#1978E5] font-semibold">{item.author}</span>
                                    </p>
                                </div>

                                {/* Actions + Price row */}
                                <div className="flex flex-wrap items-center gap-2">
                                    <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-semibold text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                                        <MessageSquare className="h-3.5 w-3.5" />
                                        Nhắn tin
                                    </button>
                                    <button
                                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[12px] font-semibold text-white transition-all duration-200 hover:shadow-md active:scale-95"
                                        style={{ background: "linear-gradient(135deg, #1978E5, #1461bc)" }}
                                    >
                                        Xác nhận đã nhận
                                    </button>
                                    {isRent && (
                                        <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-semibold text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                                            <RefreshCw className="h-3.5 w-3.5" />
                                            Gia hạn
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Price block */}
                            <div className="shrink-0 text-right flex flex-col items-end justify-start gap-1.5">
                                {item.urgencyText && (
                                    <span className="text-[10px] font-bold text-gray-600 tracking-wider">
                                        {item.urgencyText}
                                    </span>
                                )}
                                <p className="text-xl font-extrabold text-gray-700">{item.priceLabel}</p>
                                {!item.urgencyText && (
                                    <span className="text-[10px] text-gray-400 font-semibold uppercase">Giá trị</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Divider */}
            <div className="mx-6 border-t border-gray-100" />

            {/* Footer */}
            <div className="px-6 py-4 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-gray-500">Dự kiến giao:</span>
                    <span className="font-semibold text-gray-800">{order.estimatedDelivery}</span>
                </div>
                <p className="text-sm text-gray-600">
                    Tổng: <span className="font-extrabold text-gray-900 text-base ml-1">{order.totalPrice.toLocaleString("vi-VN")} VNĐ</span>
                </p>
            </div>
        </div>
    );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function OrdersPage() {
    const [orders] = useState<Order[]>(mockOrders);
    const [activeTab, setActiveTab] = useState<"orders" | "sales">("orders");

    return (
        <main className="min-h-screen bg-gray-50">
            <HomeNavbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Breadcrumb */}
                <div className="mb-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="hover:text-[#1978E5] transition-colors">Trang chủ</Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">Trung tâm Giao dịch</span>
                    </div>
                </div>

                <div>

                    {/* ── MAIN CONTENT ─────────────────── */}
                    <div className="w-full">

                        {/* Page header */}
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                    Trung tâm Giao dịch
                                </h1>
                                <p className="text-sm text-gray-400 mt-1.5">
                                    Quản lý các hoạt động mua bán và thuê sách của bạn.
                                </p>
                            </div>

                            {/* Tab pills */}
                            <div className="flex items-center gap-2 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100">
                                {[
                                    { key: "orders", label: "Đơn hàng của tôi", icon: ShoppingBag },
                                    { key: "sales", label: "Quản lý bán hàng", icon: BarChart3 },
                                ].map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key as "orders" | "sales")}
                                        className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === tab.key
                                                ? "text-white shadow-sm"
                                                : "text-gray-500 hover:text-gray-700"
                                            }`}
                                        style={activeTab === tab.key ? { background: "#1978E5" } : {}}
                                    >
                                        <tab.icon className="h-3.5 w-3.5" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ── ORDERS TAB ── */}
                        {activeTab === "orders" && (
                            <div className="space-y-5">
                                {orders.length > 0 ? (
                                    orders.map((order) => <OrderCard key={order.id} order={order} />)
                                ) : (
                                    <div
                                        className="rounded-2xl p-16 text-center"
                                        style={{ background: "#fff", border: "1px solid #f0f2f5", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
                                    >
                                        <div className="w-20 h-20 rounded-3xl mx-auto mb-5 flex items-center justify-center bg-[#eef5ff]">
                                            <Package className="h-10 w-10 text-[#1978E5]" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có đơn hàng nào</h3>
                                        <p className="text-gray-400 mb-6 text-sm max-w-sm mx-auto">
                                            Hãy khám phá kho sách phong phú và đặt đơn hàng đầu tiên!
                                        </p>
                                        <Link
                                            href="/products"
                                            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
                                            style={{ background: "linear-gradient(135deg, #1978E5, #1461bc)" }}
                                        >
                                            <ShoppingBag className="h-4 w-4" />
                                            Khám phá sản phẩm
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── SALES TAB ── */}
                        {activeTab === "sales" && (
                            <div className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-800">Sách đang đăng bán</h2>
                                    <Link
                                        href="/post-product"
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
                                        style={{
                                            background: "linear-gradient(135deg, #1978E5, #1461bc)",
                                            boxShadow: "0 4px 16px rgba(59,130,246,0.3)",
                                        }}
                                    >
                                        <Plus className="h-4 w-4" />
                                        Đăng bán sách
                                    </Link>
                                </div>

                                {/* Table */}
                                <div
                                    className="rounded-2xl overflow-hidden"
                                    style={{
                                        background: "#fff",
                                        border: "1px solid #f0f2f5",
                                        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                                    }}
                                >
                                    {/* Table header */}
                                    <div
                                        className="grid px-6 py-3.5 text-xs font-bold tracking-widest uppercase text-white"
                                        style={{
                                            gridTemplateColumns: "1fr 140px 150px 100px",
                                            background: "linear-gradient(135deg, #1978E5 0%, #1978E5 100%)",
                                        }}
                                    >
                                        <span>Sách đang đăng</span>
                                        <span className="text-center">Giá / Phí thuê</span>
                                        <span className="text-center">Trạng thái</span>
                                        <span className="text-center">Thao tác</span>
                                    </div>

                                    {/* Rows */}
                                    {mockSaleBooks.map((book, i) => {
                                        const isSold = book.status === "sold";
                                        return (
                                            <div
                                                key={i}
                                                className="grid px-6 py-4 items-center hover:bg-[#eef5ff]/30 transition-colors group"
                                                style={{
                                                    gridTemplateColumns: "1fr 140px 150px 100px",
                                                    borderTop: i > 0 ? "1px solid #f5f5f7" : undefined,
                                                }}
                                            >
                                                {/* Book info */}
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="rounded-lg overflow-hidden shrink-0"
                                                        style={{ width: "56px", height: "72px", boxShadow: "2px 2px 8px rgba(0,0,0,0.15)" }}
                                                    >
                                                        <img
                                                            src={book.image}
                                                            alt={book.title}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                const target = e.currentTarget as HTMLImageElement;
                                                                target.style.display = "none";
                                                                const parent = target.parentElement;
                                                                if (parent) parent.style.background = isSold ? "linear-gradient(135deg, #A68F68, #8a7254)" : "linear-gradient(135deg, #1a6b5c, #0d4a3e)";
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm text-gray-900 group-hover:text-[#1978E5] transition-colors">
                                                            {book.title}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-0.5">{book.postedAgo}</p>
                                                    </div>
                                                </div>

                                                {/* Price */}
                                                <p className="text-center font-bold text-gray-800 text-sm">{book.price}</p>

                                                {/* Status */}
                                                <div className="flex justify-center">
                                                    <span
                                                        className="text-xs font-bold text-center px-3 py-1 rounded-full"
                                                        style={
                                                            isSold
                                                                ? { background: "#f5efe6", color: "#A68F68" }
                                                                : { background: "#dcfce7", color: "#15803d" }
                                                        }
                                                    >
                                                        {isSold ? "ĐÃ BÁN/THUÊ" : "ĐÃ ĐĂNG BÀI"}
                                                    </span>
                                                </div>

                                                {/* Action */}
                                                <div className="flex justify-center">
                                                    <button
                                                        className="flex items-center gap-1.5 text-xs font-semibold transition-all hover:scale-105 px-3 py-1.5 rounded-lg"
                                                        style={
                                                            isSold
                                                                ? { color: "#A68F68", background: "#f5efe6" }
                                                                : { color: "#1461bc", background: "#dbeafe" }
                                                        }
                                                    >
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
                </div>
            </div>
        </main>
    );
}



