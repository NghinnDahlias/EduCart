"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, AlertCircle, Check, ShieldCheck, X } from "lucide-react";
import HomeNavbar from "../../components/HomeNavbar";

interface CartItem {
    id: string;
    title: string;
    author: string;
    image: string;
    price: number;
    quantity: number;
    type: "buy" | "rent";
    duration?: string;
    format?: string;
    status?: "SẴN SÀNG" | "HẾT HÀNG";
}

const mockCartItems: CartItem[] = [
    { id: "1", title: "Molecular Biology", author: "David P. Clark & Lonnie D. Russell", image: "https://covers.openlibrary.org/b/isbn/9781464126054-L.jpg", price: 215000, quantity: 1, type: "buy", duration: "6 THÁNG", format: "BẢN CỨNG", status: "HẾT HÀNG" },
    { id: "2", title: "Principles of Economics", author: "N. Gregory Mankiw", image: "https://covers.openlibrary.org/b/isbn/1305585127-L.jpg", price: 185000, quantity: 1, type: "rent", duration: "3 THÁNG", format: "EBOOK + CODE", status: "SẴN SÀNG" },
];

const recommendationItems = [
    { title: "Advanced Statistics", author: "Dr. Sarah Miller", image: "https://img.freepik.com/free-photo/abstract-eye-concept-art-background_23-2148816738.jpg" },
    { title: "Modern Philosophy", author: "Arthur C. Brooks", image: "https://img.freepik.com/free-photo/view-futuristic-sculpture_23-2151037384.jpg" },
    { title: "Human Anatomy", author: "Mariah S. Hoehn", image: "https://img.freepik.com/free-photo/muscular-system-human-body_23-2150165507.jpg" },
    { title: "Deep Learning", author: "Ian Goodfellow", image: "https://img.freepik.com/free-photo/artificial-intelligence-brain-concept_23-2150379435.jpg" },
];

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set(mockCartItems.filter(i => i.status !== "HẾT HÀNG").map(i => i.id)));
    const [showErrorModal, setShowErrorModal] = useState(false);

    const handleSelectItem = (id: string) => {
        const item = cartItems.find(i => i.id === id);
        if (item?.status === "HẾT HÀNG") { setShowErrorModal(true); return; }
        const newSelected = new Set(selectedItems);
        if (newSelected.has(id)) newSelected.delete(id); else newSelected.add(id);
        setSelectedItems(newSelected);
    };

    const handleSelectAll = () => {
        const inStockItems = cartItems.filter(i => i.status !== "HẾT HÀNG");
        if (selectedItems.size === inStockItems.length) setSelectedItems(new Set());
        else setSelectedItems(new Set(inStockItems.map(item => item.id)));
    };

    const handleRemoveItem = (id: string) => {
        setCartItems(cartItems.filter(item => item.id !== id));
        const newSelected = new Set(selectedItems);
        newSelected.delete(id);
        setSelectedItems(newSelected);
    };

    const selectedItemsData = cartItems.filter(item => selectedItems.has(item.id));
    const subtotal = selectedItemsData.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const serviceFee = selectedItemsData.length > 0 ? 15000 : 0;
    const discount = 0;
    const total = subtotal + serviceFee - discount;

    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            <HomeNavbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left: Cart Content */}
                    <div className="lg:col-span-8">
                        <h1 className="text-4xl font-bold text-[#193967] mb-2">Giỏ hàng của bạn</h1>
                        <p className="text-gray-500 mb-8 font-medium">Quản lý các tài liệu học thuật và giáo trình của bạn.</p>

                        {/* Select All */}
                        <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-2xl border border-gray-200 mb-6 shadow-sm">
                            <button
                                onClick={handleSelectAll}
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selectedItems.size === cartItems.filter(i => i.status !== "HẾT HÀNG").length && cartItems.length > 0 ? "bg-blue-600 border-blue-600" : "border-gray-300 hover:border-blue-600"}`}
                            >
                                {selectedItems.size === cartItems.filter(i => i.status !== "HẾT HÀNG").length && cartItems.length > 0 && <Check className="h-3 w-3 text-white" />}
                            </button>
                            <span className="text-sm font-bold text-[#193967]">
                                Chọn tất cả ({selectedItems.size}/{cartItems.filter(i => i.status !== "HẾT HÀNG").length})
                            </span>
                        </div>

                        {/* Cart Items */}
                        <div className="space-y-4 mb-12">
                            {cartItems.map((item) => (
                                <div key={item.id} className={`bg-white rounded-2xl p-6 border transition-all ${selectedItems.has(item.id) ? "border-blue-600 shadow-md" : "border-gray-200 shadow-sm"} ${item.status === "HẾT HÀNG" ? "opacity-60" : ""}`}>
                                    <div className="flex gap-6">
                                        {/* Checkbox */}
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => handleSelectItem(item.id)}
                                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${selectedItems.has(item.id) ? "bg-blue-600 border-blue-600" : "border-gray-300 hover:border-blue-600"} ${item.status === "HẾT HÀNG" ? "cursor-not-allowed border-gray-200" : ""}`}
                                            >
                                                {selectedItems.has(item.id) && <Check className="h-3 w-3 text-white" />}
                                            </button>
                                        </div>

                                        {/* Image */}
                                        <div className="w-24 h-32 rounded-xl overflow-hidden shrink-0 shadow-md">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start mb-1">
                                                    <div>
                                                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mb-2 ${item.type === "buy" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"}`}>
                                                            {item.type === "buy" ? "MUA HÀNG" : "THUÊ SÁCH"}
                                                        </span>
                                                        <h3 className="text-base font-bold text-[#193967] leading-tight line-clamp-1">{item.title}</h3>
                                                    </div>
                                                    {item.status && (
                                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${item.status === "HẾT HÀNG" ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"}`}>
                                                            {item.status}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-400 font-medium text-sm mb-3">{item.author}</p>
                                                <div className="flex gap-4 text-[11px] font-bold tracking-wide text-gray-400">
                                                    <p>ĐỊNH DẠNG: <span className="text-gray-700">{item.format}</span></p>
                                                    {item.duration && <p>THỜI HẠN: <span className="text-gray-700">{item.duration}</span></p>}
                                                </div>
                                            </div>

                                            <div className="flex items-end justify-between mt-4">
                                                <button onClick={() => handleRemoveItem(item.id)} className="flex items-center gap-1 text-red-500 font-bold text-xs hover:opacity-70 transition-opacity">
                                                    <Trash2 className="h-3.5 w-3.5" /> Xóa
                                                </button>
                                                <p className="text-xl font-bold text-[#193967]">{item.price.toLocaleString("vi-VN")} VNĐ</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recommendations */}
                        <div>
                            <h2 className="text-xl font-bold text-[#193967] mb-6">Có thể bạn quan tâm</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {recommendationItems.map((item, idx) => (
                                    <div key={idx} className="group cursor-pointer">
                                        <div className="aspect-[3/4] rounded-xl overflow-hidden mb-3 shadow-sm transition-transform group-hover:-translate-y-1">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        </div>
                                        <h4 className="font-bold text-[#193967] text-sm group-hover:text-blue-600 transition-colors line-clamp-1">{item.title}</h4>
                                        <p className="text-xs text-gray-400">{item.author}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 sticky top-28">
                            <h3 className="text-lg font-bold text-[#193967] mb-6">Chi tiết thanh toán</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Tạm tính ({selectedItems.size} sản phẩm)</span>
                                    <span className="font-bold text-[#193967]">{subtotal.toLocaleString("vi-VN")} VNĐ</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Phí dịch vụ</span>
                                    <span className="font-bold text-[#193967]">{serviceFee.toLocaleString("vi-VN")} VNĐ</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Khuyến mãi</span>
                                    <span className="font-bold text-blue-600">-{discount} VNĐ</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-200">
                                <span className="text-sm font-bold text-[#193967] uppercase tracking-wider">TỔNG CỘNG</span>
                                <span className="text-2xl font-bold text-blue-600">{total.toLocaleString("vi-VN")} VNĐ</span>
                            </div>

                            <div className="space-y-3">
                                <button
                                    disabled={selectedItems.size === 0}
                                    onClick={() => window.location.href = "/checkout"}
                                    className={`w-full py-3 text-white text-center font-bold rounded-lg transition-all ${selectedItems.size > 0 ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`}
                                >
                                    THANH TOÁN
                                </button>
                                <Link href="/products" className="block w-full py-3 bg-white border-2 border-blue-600 text-blue-600 text-center font-bold rounded-lg hover:bg-blue-50 transition-all">
                                    TIẾP TỤC MUA SẮM
                                </Link>
                            </div>

                            <div className="mt-6 flex items-start gap-2 text-blue-600">
                                <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
                                <p className="text-[10px] font-bold uppercase tracking-wider">Bảo mật giao dịch bởi EduCart</p>
                            </div>
                            <p className="text-[10px] text-gray-400 leading-relaxed mt-2">
                                Bằng cách nhấn thanh toán, bạn đồng ý với các Điều khoản & Chính sách của chúng tôi.
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Error Modal */}
            {showErrorModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center border border-gray-100">
                        <button onClick={() => setShowErrorModal(false)} className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                            <X className="h-5 w-5 text-gray-400" />
                        </button>
                        <div className="inline-flex p-4 bg-red-50 rounded-xl text-red-500 mb-4">
                            <AlertCircle className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold text-[#193967] mb-2">Sản phẩm đã hết hàng</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            Rất tiếc, sản phẩm bạn vừa chọn hiện đã hết hàng. Vui lòng chọn sản phẩm khác.
                        </p>
                        <button onClick={() => setShowErrorModal(false)} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all">
                            ĐÃ HIỂU
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
