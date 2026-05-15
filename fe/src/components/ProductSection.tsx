"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { api } from "@/lib/api";

interface ApiProduct {
  ProductID: number;
  Title: string;
  Author: string;
  Price: number;
  OriginalPrice: number | null;
  DiscountLabel: string | null;
  RentalPrice: number | null;
  IsForRent: boolean;
  ThumbnailURL: string | null;
  Category: string | null;
}

function fmtVND(n: number | null | undefined): string {
  if (n == null) return "";
  return n.toLocaleString("vi-VN") + "₫";
}

export default function ProductSection() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [favorites, setFavorites] = useState(new Set<number>());
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams({ limit: "8", page: "1" });
    if (activeFilter === "BÁN") params.set("forRent", "false");
    if (activeFilter === "THUÊ") params.set("forRent", "true");
    setIsLoading(true);
    api.get<{ ok: boolean; products: ApiProduct[] }>(`/products?${params}`)
      .then(d => setProducts(d.products ?? []))
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
  }, [activeFilter]);

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(productId) ? next.delete(productId) : next.add(productId);
      return next;
    });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header with Filters */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600 uppercase">Sản phẩm nổi bật</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">Sản phẩm nổi bật</h2>
          </div>
          <div className="flex gap-2">
            {["ALL", "BÁN", "THUÊ"].map(f => (
              <button key={f}
                onClick={() => setActiveFilter(f)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${activeFilter === f
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400"}`}>
                {f === "ALL" ? "TẤT CẢ" : f}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center py-16 text-gray-400">Đang tải...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => {
              const tag = product.IsForRent ? "THUÊ" : "BÁN";
              const price = product.IsForRent ? fmtVND(product.RentalPrice) : fmtVND(product.Price);
              const originalPrice = product.OriginalPrice != null ? fmtVND(product.OriginalPrice) : "";

              return (
                <Link key={product.ProductID} href={`/products/${product.ProductID}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group flex flex-col h-full rounded-2xl bg-white p-4 shadow-sm hover:shadow-lg transition cursor-pointer"
                  >
                    {/* Product Image */}
                    <div className="relative mb-4 overflow-hidden rounded-xl bg-gray-200">
                      {product.ThumbnailURL ? (
                        <img src={product.ThumbnailURL} alt={product.Title}
                          className="h-48 w-full object-cover transition-transform group-hover:scale-110" />
                      ) : (
                        <div className="h-48 w-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
                          <span style={{ fontSize: "2.5rem", fontWeight: 700, color: "#3b5bdb", opacity: 0.4 }}>{product.Title.charAt(0)}</span>
                        </div>
                      )}

                      {/* Tag and Discount */}
                      <div className="absolute right-3 top-3 flex flex-col gap-2">
                        <div className={`rounded-md px-3 py-1.5 text-xs font-bold text-white text-center min-w-[30px] ${tag === "BÁN" ? "bg-blue-600" : "bg-green-600"}`}>
                          {tag}
                        </div>
                        {product.DiscountLabel && (
                          <div className="rounded-md bg-orange-500 px-3 py-1.5 text-xs font-bold text-white text-center min-w-[30px]">
                            {product.DiscountLabel}
                          </div>
                        )}
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={e => { e.preventDefault(); e.stopPropagation(); toggleFavorite(product.ProductID); }}
                        className="absolute left-3 top-3 rounded-full bg-white p-2 shadow-md hover:bg-gray-100 transition"
                      >
                        <Heart className={`h-5 w-5 transition ${favorites.has(product.ProductID) ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="mb-4 flex-1">
                      <p className="text-xs text-gray-500">{product.Category}</p>
                      <h3 className="mt-1 font-semibold text-gray-900 line-clamp-2">{product.Title}</h3>
                      <p className="mt-1 text-sm text-gray-600">{product.Author}</p>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <p className="text-lg font-bold text-gray-900">{price}</p>
                      {originalPrice && <p className="text-sm text-gray-500 line-through">{originalPrice}</p>}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={async e => { e.preventDefault(); e.stopPropagation(); try { await api.post("/cart", { productId: product.ProductID }); } catch {} }}
                      className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Thêm vào giỏ
                    </button>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
