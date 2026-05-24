"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, MapPin, CreditCard, Truck, ShieldCheck, CheckCircle2, Phone, User, Handshake } from "lucide-react";
import HomeNavbar from "../../components/HomeNavbar";
import { api, getImageUrl } from "@/lib/api";

interface CartItem {
    id: number;
    productId: number;
    title: string;
    author: string;
    image: string;
    price: number;
    type: "buy" | "rent";
    rentalPrice: number | null;
}

export default function CheckoutPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState<"direct" | "cod">("direct");
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        api.get<{ ok: boolean; items: any[] }>("/cart", true)
            .then(d => {
                const mapped: CartItem[] = (d.items ?? [])
                    .filter((item: any) => item.Stock > 0 && item.Status === "Available")
                    .map((item: any) => ({
                        id: item.CartItemID,
                        productId: item.ProductID,
                        title: item.Title,
                        author: item.Author,
                        image: getImageUrl(item.ThumbnailURL),
                        price: item.IsForRent ? (item.RentalPrice ?? item.Price ?? 0) : (item.Price ?? 0),
                        type: item.IsForRent ? "rent" : "buy",
                        rentalPrice: item.RentalPrice ?? null,
                    }));
                setCartItems(mapped);
            })
            .catch(() => {})
            .finally(() => setIsLoading(false));
    }, []);

    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
    const serviceFee = cartItems.length > 0 ? 15000 : 0;
    const total = subtotal + serviceFee;

    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) return;
        setIsProcessing(true);
        try {
            const buyItems = cartItems.filter(i => i.type === "buy");
            const rentItems = cartItems.filter(i => i.type === "rent");

            if (buyItems.length > 0) {
                await api.post("/orders", {
                    type: "Buy",
                    items: buyItems.map(i => ({ productId: i.productId, quantity: 1 })),
                }, true);
            }

            if (rentItems.length > 0) {
                const startDate = new Date();
                const endDate = new Date();
                endDate.setDate(endDate.getDate() + 7);
                await api.post("/orders", {
                    type: "Rent",
                    items: rentItems.map(i => ({ productId: i.productId, quantity: 1 })),
                    rentStartDate: startDate.toISOString(),
                    rentEndDate: endDate.toISOString(),
                    dailyRate: rentItems[0].rentalPrice ?? rentItems[0].price,
                }, true);
            }

            window.location.href = "/orders";
        } catch (err: any) {
            alert(err?.message ?? "Có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setIsProcessing(false);
        }
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

                            {isLoading ? (
                                <div className="text-center py-8 text-gray-400 text-sm">Đang tải...</div>
                            ) : cartItems.length === 0 ? (
                                <div className="text-center py-8 text-gray-400 text-sm">
                                    Giỏ hàng trống.{" "}
                                    <Link href="/products" className="text-blue-600 font-semibold">Khám phá sản phẩm</Link>
                                </div>
                            ) : (
                                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="flex gap-3">
                                            <div className="w-14 rounded-xl overflow-hidden shrink-0 shadow-sm bg-gray-100" style={{ height: "72px" }}>
                                                {item.image
                                                    ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                    : <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">{item.title.charAt(0)}</div>}
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center">
                                                <h4 className="text-sm font-bold text-[#193967] line-clamp-1">{item.title}</h4>
                                                <p className="text-xs text-gray-400">{item.author}</p>
                                                <p className="text-sm font-bold text-blue-600 mt-0.5">{item.price.toLocaleString("vi-VN")} VNĐ</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!isLoading && (
                                <>
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

                                    <button onClick={handlePlaceOrder} disabled={isProcessing || cartItems.length === 0}
                                        className={`w-full py-3 text-white text-center font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${isProcessing || cartItems.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>
                                        {isProcessing ? (
                                            <><div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />ĐANG XỬ LÝ...</>
                                        ) : "XÁC NHẬN THANH TOÁN"}
                                    </button>
                                </>
                            )}

                            <div className="mt-6 flex items-center gap-2 text-blue-600">
                                <ShieldCheck className="h-4 w-4 shrink-0" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Thanh toán bảo mật cùng EduCart</span>
                            </div>
                            <p className="text-[10px] text-gray-400 leading-relaxed mt-2">
                                Dữ liệu của bạn được mã hóa hoàn toàn. Chúng tôi không bao giờ lưu trữ thông tin cá nhân của bạn.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
