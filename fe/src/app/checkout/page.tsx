"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, MapPin, CreditCard, Truck, ShieldCheck, CheckCircle2, Phone, User, Handshake } from "lucide-react";
import HomeNavbar from "../../components/HomeNavbar";

interface CartItem {
    id: string;
    title: string;
    author: string;
    image: string;
    price: number;
    quantity: number;
}

const mockCheckoutItems: CartItem[] = [
    { id: "1", title: "Molecular Biology", author: "David P. Clark & Lonnie D. Russell", image: "https://covers.openlibrary.org/b/isbn/9781464126054-L.jpg", price: 215000, quantity: 1 },
    { id: "2", title: "Principles of Economics", author: "N. Gregory Mankiw", image: "https://covers.openlibrary.org/b/isbn/1305585127-L.jpg", price: 185000, quantity: 1 },
];

export default function CheckoutPage() {
    const [paymentMethod, setPaymentMethod] = useState<"direct" | "cod">("direct");
    const [isProcessing, setIsProcessing] = useState(false);

    const subtotal = mockCheckoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const serviceFee = 15000;
    const total = subtotal + serviceFee;

    const handlePlaceOrder = () => {
        setIsProcessing(true);
        setTimeout(() => { window.location.href = "/orders"; }, 2000);
    };

    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            <HomeNavbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link href="/cart" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold text-sm mb-8 transition-colors">
                    <ChevronLeft className="h-4 w-4" /> Quay lại giỏ hàng
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Forms */}
                    <div className="lg:col-span-8 space-y-6">
                        <div>
                            <h1 className="text-4xl font-bold text-[#193967] mb-2">Thanh toán</h1>
                            <p className="text-gray-500 font-medium">Hoàn tất thông tin để nhận tài liệu học thuật của bạn.</p>
                        </div>

                        {/* Shipping Info */}
                        <section className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <h2 className="text-xl font-bold text-[#193967]">Thông tin giao hàng</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Họ và tên</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input type="text" placeholder="Nguyễn Văn A"
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-600 focus:outline-none transition-all font-medium text-[#193967] text-sm" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Số điện thoại</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input type="tel" placeholder="0912 345 678"
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-600 focus:outline-none transition-all font-medium text-[#193967] text-sm" />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Địa chỉ nhận hàng</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input type="text" placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-600 focus:outline-none transition-all font-medium text-[#193967] text-sm" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Payment Method */}
                        <section className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                    <CreditCard className="h-5 w-5" />
                                </div>
                                <h2 className="text-xl font-bold text-[#193967]">Phương thức thanh toán</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Direct */}
                                <button onClick={() => setPaymentMethod("direct")}
                                    className={`relative p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-3 ${paymentMethod === "direct" ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>
                                    <div className={`p-3 rounded-xl ${paymentMethod === "direct" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                                        <Handshake className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#193967]">Giao dịch trực tiếp</p>
                                        <p className="text-xs text-gray-400 font-medium mt-1">Gặp mặt trao đổi & nhận tài liệu</p>
                                    </div>
                                    {paymentMethod === "direct" && <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-blue-600" />}
                                </button>

                                {/* COD */}
                                <button onClick={() => setPaymentMethod("cod")}
                                    className={`relative p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-3 ${paymentMethod === "cod" ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>
                                    <div className={`p-3 rounded-xl ${paymentMethod === "cod" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                                        <Truck className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#193967]">COD (Giao hàng tận nơi)</p>
                                        <p className="text-xs text-gray-400 font-medium mt-1">Thanh toán khi nhận bản cứng</p>
                                    </div>
                                    {paymentMethod === "cod" && <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-blue-600" />}
                                </button>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-4">
                        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 sticky top-28">
                            <h3 className="text-lg font-bold text-[#193967] mb-6">Đơn hàng của bạn</h3>

                            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                                {mockCheckoutItems.map(item => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="w-14 h-18 rounded-xl overflow-hidden shrink-0 shadow-sm" style={{ height: "72px" }}>
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h4 className="text-sm font-bold text-[#193967] line-clamp-1">{item.title}</h4>
                                            <p className="text-xs text-gray-400 font-medium">SL: {item.quantity}</p>
                                            <p className="text-sm font-bold text-blue-600 mt-0.5">{item.price.toLocaleString("vi-VN")} VNĐ</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Tạm tính</span>
                                    <span className="font-bold text-[#193967]">{subtotal.toLocaleString("vi-VN")} VNĐ</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Phí dịch vụ</span>
                                    <span className="font-bold text-[#193967]">{serviceFee.toLocaleString("vi-VN")} VNĐ</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-200">
                                <span className="text-sm font-bold text-[#193967] uppercase tracking-wider">TỔNG CỘNG</span>
                                <span className="text-2xl font-bold text-blue-600">{total.toLocaleString("vi-VN")} VNĐ</span>
                            </div>

                            <button onClick={handlePlaceOrder} disabled={isProcessing}
                                className={`w-full py-3 text-white text-center font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>
                                {isProcessing ? (
                                    <><div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />ĐANG XỬ LÝ...</>
                                ) : "XÁC NHẬN THANH TOÁN"}
                            </button>

                            <div className="mt-6 flex items-center gap-2 text-blue-600">
                                <ShieldCheck className="h-4 w-4 shrink-0" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Thanh toán bảo mật 256-bit</span>
                            </div>
                            <p className="text-[10px] text-gray-400 leading-relaxed mt-2">
                                Dữ liệu của bạn được mã hóa hoàn toàn. Chúng tôi không bao giờ lưu trữ thông tin thẻ.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
