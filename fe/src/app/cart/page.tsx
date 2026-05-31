"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trash2, AlertCircle, Check, ShieldCheck, X } from "lucide-react";

import HomeNavbar from "../../components/HomeNavbar";
import { api, getImageUrl } from "@/lib/api";
import { useLocale } from "@/components/locale-provider";

interface CartItem {
  id: number;
  productId: number;
  title: string;
  author: string;
  image: string;
  price: number;
  type: "buy" | "rent";
  status: "READY" | "OUT_OF_STOCK";
}

const cartDictionary = {
  vi: {
    title: "Giỏ hàng của bạn",
    subtitle: "Quản lý các tài liệu học thuật và giáo trình của bạn.",
    loading: "Đang tải...",
    empty: "Giỏ hàng trống",
    emptyText: "Hãy khám phá và thêm sách vào giỏ hàng.",
    explore: "Khám phá sản phẩm",
    selectAll: "Chọn tất cả",
    buy: "Mua hàng",
    rent: "Thuê sách",
    ready: "Sẵn sàng",
    out: "Hết hàng",
    remove: "Xóa",
    summary: "Chi tiết thanh toán",
    subtotal: "Tạm tính",
    deposit: "Tiền cọc (hoàn trả sau)",
    total: "Tổng cộng",
    checkout: "Thanh toán",
    continue: "Tiếp tục mua sắm",
    secure: "Bảo mật giao dịch bởi EduCart",
    terms: "Bằng cách nhấn thanh toán, bạn đồng ý với các Điều khoản và Chính sách của chúng tôi.",
    outTitle: "Sản phẩm đã hết hàng",
    outText: "Rất tiếc, sản phẩm bạn vừa chọn hiện đã hết hàng. Vui lòng chọn sản phẩm khác.",
    understood: "Đã hiểu",
    count: "sản phẩm",
  },
  en: {
    title: "Your cart",
    subtitle: "Manage your learning materials and textbook selections.",
    loading: "Loading...",
    empty: "Your cart is empty",
    emptyText: "Explore and add books to your cart.",
    explore: "Browse products",
    selectAll: "Select all",
    buy: "Buy",
    rent: "Rent",
    ready: "Ready",
    out: "Out of stock",
    remove: "Remove",
    summary: "Payment summary",
    subtotal: "Subtotal",
    deposit: "Deposit (refunded later)",
    total: "Grand total",
    checkout: "Checkout",
    continue: "Continue shopping",
    secure: "Secured transactions by EduCart",
    terms: "By continuing, you agree to our Terms and Policies.",
    outTitle: "Item is out of stock",
    outText: "The item you selected is no longer available. Please choose another item.",
    understood: "Got it",
    count: "items",
  },
} as const;

export default function CartPage() {
  const { locale } = useLocale();
  const t = cartDictionary[locale];
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ ok: boolean; items: any[] }>("/cart", true)
      .then((d) => {
        const mapped: CartItem[] = (d.items ?? []).map((item: any) => ({
          id: item.CartItemID,
          productId: item.ProductID,
          title: item.Title,
          author: item.Author,
          image: getImageUrl(item.ThumbnailURL),
          price: item.IsForRent ? (item.RentalPrice ?? item.Price ?? 0) : (item.Price ?? 0),
          type: item.IsForRent ? "rent" : "buy",
          status: item.Stock > 0 && item.Status === "Available" ? "READY" : "OUT_OF_STOCK",
        }));
        setCartItems(mapped);
        setSelectedItems(new Set(mapped.filter((i) => i.status !== "OUT_OF_STOCK").map((i) => i.id)));
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleSelectItem = (id: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (item?.status === "OUT_OF_STOCK") {
      setShowErrorModal(true);
      return;
    }
    const nextSelected = new Set(selectedItems);
    if (nextSelected.has(id)) nextSelected.delete(id);
    else nextSelected.add(id);
    setSelectedItems(nextSelected);
  };

  const handleSelectAll = () => {
    const inStock = cartItems.filter((i) => i.status !== "OUT_OF_STOCK");
    if (selectedItems.size === inStock.length) setSelectedItems(new Set());
    else setSelectedItems(new Set(inStock.map((item) => item.id)));
  };

  const handleRemoveItem = async (item: CartItem) => {
    try {
      await api.delete(`/cart/${item.productId}`, true);
    } catch {}
    setCartItems((prev) => prev.filter((i) => i.id !== item.id));
    setSelectedItems((prev) => {
      const next = new Set(prev);
      next.delete(item.id);
      return next;
    });
  };

  const selectedItemsData = cartItems.filter((item) => selectedItems.has(item.id));
  const subtotal = selectedItemsData.reduce((sum, item) => sum + item.price, 0);
  const depositTotal = selectedItemsData.reduce((sum, item) => sum + (item.type === "rent" ? 100000 : 0), 0);
  const total = subtotal + depositTotal;
  const inStockCount = cartItems.filter((i) => i.status !== "OUT_OF_STOCK").length;

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <HomeNavbar />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h1 className="mb-2 text-4xl font-bold text-[#193967]">{t.title}</h1>
            <p className="mb-8 font-medium text-gray-500">{t.subtitle}</p>

            {isLoading ? (
              <div className="py-16 text-center text-gray-400">{t.loading}</div>
            ) : cartItems.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-16 text-center shadow-sm">
                <h3 className="mb-2 text-xl font-bold text-[#193967]">{t.empty}</h3>
                <p className="mb-6 text-sm text-gray-400">{t.emptyText}</p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700"
                >
                  {t.explore}
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-sm">
                  <button
                    onClick={handleSelectAll}
                    className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-all ${
                      selectedItems.size === inStockCount && cartItems.length > 0
                        ? "border-blue-600 bg-blue-600"
                        : "border-gray-300 hover:border-blue-600"
                    }`}
                  >
                    {selectedItems.size === inStockCount && cartItems.length > 0 ? <Check className="h-3 w-3 text-white" /> : null}
                  </button>
                  <span className="text-sm font-bold text-[#193967]">
                    {t.selectAll} ({selectedItems.size}/{inStockCount})
                  </span>
                </div>

                <div className="mb-12 space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className={`rounded-2xl border bg-white p-6 transition-all ${
                        selectedItems.has(item.id) ? "border-blue-600 shadow-md" : "border-gray-200 shadow-sm"
                      } ${item.status === "OUT_OF_STOCK" ? "opacity-60" : ""}`}
                    >
                      <div className="flex gap-6">
                        <div className="flex items-center">
                          <button
                            onClick={() => handleSelectItem(item.id)}
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${
                              selectedItems.has(item.id)
                                ? "border-blue-600 bg-blue-600"
                                : "border-gray-300 hover:border-blue-600"
                            } ${item.status === "OUT_OF_STOCK" ? "cursor-not-allowed border-gray-200" : ""}`}
                          >
                            {selectedItems.has(item.id) ? <Check className="h-3 w-3 text-white" /> : null}
                          </button>
                        </div>

                        <div className="h-32 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 shadow-md">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-gray-400">
                              {item.title.charAt(0)}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-1 flex-col justify-between py-1">
                          <div>
                            <div className="mb-1 flex items-start justify-between">
                              <div>
                                <span
                                  className={`mb-2 inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                    item.type === "buy" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                                  }`}
                                >
                                  {item.type === "buy" ? t.buy : t.rent}
                                </span>
                                <h3 className="line-clamp-1 text-base font-bold leading-tight text-[#193967]">{item.title}</h3>
                              </div>
                              <span
                                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                  item.status === "OUT_OF_STOCK" ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"
                                }`}
                              >
                                {item.status === "OUT_OF_STOCK" ? t.out : t.ready}
                              </span>
                            </div>
                            <p className="mb-3 text-sm font-medium text-gray-400">{item.author}</p>
                          </div>

                          <div className="mt-4 flex items-end justify-between">
                            <button
                              onClick={() => handleRemoveItem(item)}
                              className="flex items-center gap-1 text-xs font-bold text-red-500 transition-opacity hover:opacity-70"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> {t.remove}
                            </button>
                            <p className="text-xl font-bold text-[#193967]">{item.price.toLocaleString("vi-VN")} VNĐ</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-28 rounded-2xl border border-gray-200 bg-gray-50 p-8">
              <h3 className="mb-6 text-lg font-bold text-[#193967]">{t.summary}</h3>

              <div className="mb-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-500">
                    {t.subtotal} ({selectedItems.size} {t.count})
                  </span>
                  <span className="font-bold text-[#193967]">{subtotal.toLocaleString("vi-VN")} VNĐ</span>
                </div>
                {depositTotal > 0 ? (
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-500">{t.deposit}</span>
                    <span className="font-bold text-[#193967]">{depositTotal.toLocaleString("vi-VN")} VNĐ</span>
                  </div>
                ) : null}
              </div>

              <div className="mb-6 flex items-center justify-between border-t border-gray-200 pt-4">
                <span className="text-sm font-bold uppercase tracking-wider text-[#193967]">{t.total}</span>
                <span className="text-2xl font-bold text-blue-600">{total.toLocaleString("vi-VN")} VNĐ</span>
              </div>

              <div className="space-y-3">
                <button
                  disabled={selectedItems.size === 0}
                  onClick={() => {
                    window.location.href = "/checkout";
                  }}
                  className={`w-full rounded-lg py-3 text-center font-bold text-white transition-all ${
                    selectedItems.size > 0 ? "bg-blue-600 hover:bg-blue-700" : "cursor-not-allowed bg-gray-300"
                  }`}
                >
                  {t.checkout}
                </button>
                <Link
                  href="/products"
                  className="block w-full rounded-lg border-2 border-blue-600 bg-white py-3 text-center font-bold text-blue-600 transition-all hover:bg-blue-50"
                >
                  {t.continue}
                </Link>
              </div>

              <div className="mt-6 flex items-start gap-2 text-blue-600">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <p className="text-[10px] font-bold uppercase tracking-wider">{t.secure}</p>
              </div>
              <p className="mt-2 text-[10px] leading-relaxed text-gray-400">{t.terms}</p>
            </div>
          </div>
        </div>
      </div>

      {showErrorModal ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-2xl">
            <button onClick={() => setShowErrorModal(false)} className="absolute right-4 top-4 rounded-lg p-1.5 transition-colors hover:bg-gray-100">
              <X className="h-5 w-5 text-gray-400" />
            </button>
            <div className="mb-4 inline-flex rounded-xl bg-red-50 p-4 text-red-500">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-[#193967]">{t.outTitle}</h3>
            <p className="mb-6 text-sm leading-relaxed text-gray-500">{t.outText}</p>
            <button onClick={() => setShowErrorModal(false)} className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white transition-all hover:bg-blue-700">
              {t.understood}
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
