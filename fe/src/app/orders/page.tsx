"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Package, Clock, CheckCircle, Truck } from "lucide-react";

interface Order {
    id: string;
    trackingNumber: string;
    status: "pending" | "paid" | "shipping" | "completed";
    items: {
        title: string;
        author: string;
        price: number;
        image: string;
    }[];
    totalPrice: number;
    createdDate: string;
    estimatedDelivery: string;
}

const mockOrders: Order[] = [
    {
        id: "1",
        trackingNumber: "PPS-88231",
        status: "shipping",
        items: [
            {
                title: "Giải tích 1",
                author: "James Stewart",
                price: 150000,
                image: "/book1.jpg"
            }
        ],
        totalPrice: 150000,
        createdDate: "2025-04-19",
        estimatedDelivery: "2025-04-21"
    },
    {
        id: "2",
        trackingNumber: "PPS-88230",
        status: "completed",
        items: [
            {
                title: "Giải tích 2 - Advanced Math",
                author: "Minh Anh",
                price: 125000,
                image: "/book2.jpg"
            }
        ],
        totalPrice: 125000,
        createdDate: "2025-04-15",
        estimatedDelivery: "2025-04-18"
    }
];

const statusConfig = {
    pending: {
        label: "ĐÃ ĐẶT",
        color: "bg-blue-100",
        textColor: "text-blue-600",
        icon: Package
    },
    paid: {
        label: "ĐÃ THANH TOÁN",
        color: "bg-purple-100",
        textColor: "text-purple-600",
        icon: CheckCircle
    },
    shipping: {
        label: "ĐANG GỬI MUỲ",
        color: "bg-yellow-100",
        textColor: "text-yellow-600",
        icon: Truck
    },
    completed: {
        label: "HOÀN TẤT",
        color: "bg-green-100",
        textColor: "text-green-600",
        icon: CheckCircle
    }
};

const getProgressPercentage = (status: string) => {
    switch (status) {
        case "pending": return 25;
        case "paid": return 50;
        case "shipping": return 75;
        case "completed": return 100;
        default: return 0;
    }
};

export default function OrdersPage() {
    const [orders] = useState<Order[]>(mockOrders);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    return (
        <main className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/home" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-4">
                        <span>←</span>
                        <span>Quay lại</span>
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Trung tâm Giao dịch</h1>
                    <p className="text-gray-600">Quản lý các hoạt động mua bán và thuê sách của bạn.</p>
                </div>

                {/* Orders List */}
                <div className="space-y-6">
                    {orders.length > 0 ? (
                        orders.map((order) => {
                            const isExpanded = expandedOrder === order.id;
                            const StatusIcon = statusConfig[order.status].icon;

                            return (
                                <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                                    {/* Order Header */}
                                    <button
                                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                        className="w-full p-6 text-left hover:bg-gray-50 transition flex items-center justify-between"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className={`p-3 rounded-lg ${statusConfig[order.status].color}`}>
                                                    <StatusIcon className={`h-6 w-6 ${statusConfig[order.status].textColor}`} />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">TÊN BỐ VÀ GHI HÀNG PPS-88231</p>
                                                    <p className={`font-semibold ${statusConfig[order.status].textColor}`}>
                                                        {statusConfig[order.status].label}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs text-gray-500">TẤT CẢ CÁC GIAI ĐOẠN</span>
                                                    <span className="text-xs text-gray-500">
                                                        {getProgressPercentage(order.status)}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full transition-all ${statusConfig[order.status].color}`}
                                                        style={{ width: `${getProgressPercentage(order.status)}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {/* Order Info */}
                                            <div className="grid grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-500">Số theo dõi</p>
                                                    <p className="font-semibold text-gray-900">{order.trackingNumber}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Ngày đặt hàng</p>
                                                    <p className="font-semibold text-gray-900">{order.createdDate}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Dự kiến giao hàng</p>
                                                    <p className="font-semibold text-gray-900">{order.estimatedDelivery}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <ChevronRight
                                            className={`h-6 w-6 text-gray-400 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                                        />
                                    </button>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                                            <h3 className="font-semibold text-gray-900 mb-4">Chi tiết đơn hàng</h3>

                                            {/* Items */}
                                            <div className="space-y-4 mb-6">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex gap-4 p-4 bg-white rounded-lg">
                                                        <div className="w-20 h-20 bg-teal-100 rounded-lg flex-shrink-0"></div>
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                                            <p className="text-sm text-gray-600">{item.author}</p>
                                                            <p className="text-lg font-bold text-gray-900 mt-2">
                                                                {(item.price / 1000).toFixed(0)}k đ
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Total & Actions */}
                                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                                <div>
                                                    <p className="text-gray-600">Tổng cộng</p>
                                                    <p className="text-2xl font-bold text-gray-900">
                                                        {(order.totalPrice / 1000).toFixed(0)}k đ
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition">
                                                        Nhìn tin
                                                    </button>
                                                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                                        Xác nhận đã nhận
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-12 text-center">
                            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không có đơn hàng</h3>
                            <p className="text-gray-600 mb-6">Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!</p>
                            <Link
                                href="/products"
                                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Khám phá sản phẩm
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
