"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, AlertCircle, Check } from "lucide-react";
import HomeNavbar from "../../components/HomeNavbar";

/* ─── Types ─────────────────────────────────────────────── */
interface CartItem {
    id: string;
    title: string;
    author: string;
    image: string;
    price: number;
    quantity: number;
    type: "buy" | "rent";
}

/* ─── Mock Data ──────────────────────────────────────────── */
const mockCartItems: CartItem[] = [
    {
        id: "1",
        title: "Molecular Biology",
        author: "David L. Nelson & Michael M. Cox",
        image: "https://covers.openlibrary.org/b/isbn/9781464126054-L.jpg",
        price: 215000,
        quantity: 1,
        type: "buy",
    },
    {
        id: "2",
        title: "Principles of Economics",
        author: "N. Gregory Mankiw",
        image: "https://covers.openlibrary.org/b/isbn/1305585127-L.jpg",
        price: 185000,
        quantity: 1,
        type: "buy",
    },
];

/* ─── Main Cart Page ─────────────────────────────────────── */
export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

    const handleSelectItem = (id: string) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedItems(newSelected);
    };

    const handleSelectAll = () => {
        if (selectedItems.size === cartItems.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(cartItems.map((item) => item.id)));
        }
    };

    const handleQuantityChange = (id: string, delta: number) => {
        setCartItems(
            cartItems
                .map((item) =>
                    item.id === id
                        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const handleRemoveItem = (id: string) => {
        setCartItems(cartItems.filter((item) => item.id !== id));
        const newSelected = new Set(selectedItems);
        newSelected.delete(id);
        setSelectedItems(newSelected);
    };

    const selectedItemsData = cartItems.filter((item) => selectedItems.has(item.id));
    const subtotal = selectedItemsData.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = selectedItemsData.length > 0 ? 15000 : 0;
    const tax = selectedItemsData.length > 0 ? Math.round(subtotal * 0.1) : 0;
    const total = subtotal + shippingFee + tax;

    return (
        <main className="min-h-screen bg-gray-50">
            <HomeNavbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <div className="mb-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="hover:text-blue-600 transition-colors">
                            Trang chủ
                        </Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">Giỏ hàng</span>
                    </div>
                </div>

                {/* Page Title */}
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Giỏ hàng của bạn</h1>
                <p className="text-gray-500 mb-8">
                    Quản lý các mục đã chọn và tiến hành thanh toán.
                </p>

                {cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* ─── Left: Cart Items ───────────────────────────── */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Cart Items */}
                            {/* Select All */}
                            <div className="flex items-center gap-3 px-5 py-3 bg-gray-50 rounded-xl mb-2">
                                <button
                                    onClick={handleSelectAll}
                                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedItems.size === cartItems.length && cartItems.length > 0
                                            ? "bg-blue-600 border-blue-600"
                                            : "border-gray-300 hover:border-blue-400"
                                        }`}
                                >
                                    {selectedItems.size === cartItems.length && cartItems.length > 0 && (
                                        <Check className="h-4 w-4 text-white" />
                                    )}
                                </button>
                                <span className="text-sm font-semibold text-gray-700">
                                    Chọn tất cả ({selectedItems.size}/{cartItems.length})
                                </span>
                            </div>

                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-2xl p-5 border border-gray-200 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex gap-5">
                                        {/* Checkbox */}
                                        <button
                                            onClick={() => handleSelectItem(item.id)}
                                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${selectedItems.has(item.id)
                                                    ? "bg-blue-600 border-blue-600"
                                                    : "border-gray-300 hover:border-blue-400"
                                                }`}
                                        >
                                            {selectedItems.has(item.id) && (
                                                <Check className="h-4 w-4 text-white" />
                                            )}
                                        </button>

                                        {/* Image */}
                                        <div
                                            className="w-24 h-32 rounded-xl overflow-hidden flex-shrink-0"
                                            style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Item Details */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <span
                                                            className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mb-2"
                                                            style={{
                                                                background: "#e8f5e9",
                                                                color: "#2e7d32",
                                                            }}
                                                        >
                                                            MUA HÀNG
                                                        </span>
                                                        <h3 className="font-bold text-gray-900 text-base line-clamp-2">
                                                            {item.title}
                                                        </h3>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    Tác giả: <span className="text-blue-600 font-semibold">{item.author}</span>
                                                </p>
                                            </div>

                                            {/* Quantity & Price */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 bg-gray-100 rounded-lg w-fit">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, -1)}
                                                        className="p-1.5 hover:bg-gray-200 transition-colors"
                                                    >
                                                        <Minus className="h-4 w-4 text-gray-600" />
                                                    </button>
                                                    <span className="px-4 font-semibold text-gray-900 min-w-8 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, 1)}
                                                        className="p-1.5 hover:bg-gray-200 transition-colors"
                                                    >
                                                        <Plus className="h-4 w-4 text-gray-600" />
                                                    </button>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500 mb-1">Giá</p>
                                                    <p className="text-xl font-extrabold text-blue-600">
                                                        {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Continue Shopping */}
                            <Link
                                href="/products"
                                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
                            >
                                <ShoppingBag className="h-5 w-5" />
                                Tiếp tục chọn sách
                            </Link>
                        </div>

                        {/* ─── Right: Order Summary ───────────────────────── */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl p-6 border border-gray-200 sticky top-24">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Chi tiết thanh toán</h3>

                                {selectedItemsData.length > 0 ? (
                                    <>
                                        {/* Summary Items */}
                                        <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Tạm tính:</span>
                                                <span className="font-semibold text-gray-900">
                                                    {subtotal.toLocaleString("vi-VN")}₫
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Phí vận chuyển:</span>
                                                <span className="font-semibold text-gray-900">
                                                    {shippingFee.toLocaleString("vi-VN")}₫
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Thuế (10%):</span>
                                                <span className="font-semibold text-gray-900">
                                                    {tax.toLocaleString("vi-VN")}₫
                                                </span>
                                            </div>
                                        </div>

                                        {/* Total */}
                                        <div className="mb-6">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-gray-600">Tổng cộng:</span>
                                                <span
                                                    className="text-3xl font-extrabold"
                                                    style={{ color: "#1978E5" }}
                                                >
                                                    {total.toLocaleString("vi-VN")}₫
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Bao gồm tất cả phí và thuế suất
                                            </p>
                                        </div>

                                        {/* Buttons */}
                                        <button
                                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all hover:shadow-lg mb-3"
                                        >
                                            THANH TOÁN
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-center py-8">
                                        <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 font-semibold mb-3">
                                            Hãy chọn sản phẩm để tiếp tục
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Chọn checkbox bên cạnh sản phẩm để thanh toán
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Empty Cart */
                    <div className="bg-white rounded-2xl p-16 text-center border border-gray-200">
                        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-blue-50">
                            <ShoppingBag className="h-10 w-10 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Giỏ hàng trống</h3>
                        <p className="text-gray-500 mb-8">
                            Bạn chưa thêm sách nào vào giỏ hàng. Hãy khám phá kho sách phong phú của chúng tôi!
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all hover:shadow-lg"
                        >
                            <ShoppingBag className="h-5 w-5" />
                            Khám phá sản phẩm
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}
