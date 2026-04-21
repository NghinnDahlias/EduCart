"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";

const products = [
    {
        id: 1,
        title: "Calculus: Early Transcendentals",
        author: "James Stewart",
        price: "125.000₫",
        originalPrice: "250.000₫",
        tag: "BÁN",
        category: "CALCULUS",
        image: "https://images.unsplash.com/photo-1543002588-d4d1a5007b53?w=300&h=400&fit=crop",
        discount: "-50%"
    },
    {
        id: 2,
        title: "Nguyên lý Kinh tế học",
        author: "N. Gregory Mankiw",
        price: "25.000₫",
        originalPrice: "",
        tag: "THUÊ",
        category: "ECONOMICS",
        image: "https://images.unsplash.com/photo-1507842217343-583684b2dd83?w=300&h=400&fit=crop",
        discount: ""
    },
    {
        id: 3,
        title: "Chemistry: A Molecular Approach",
        author: "Nivaldo Jr. Tro",
        price: "180.000₫",
        originalPrice: "",
        tag: "BÁN",
        category: "CHEMISTRY",
        image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=400&fit=crop",
        discount: ""
    },
    {
        id: 4,
        title: "Triết học Mác - Lênin",
        author: "NXB Lao động",
        price: "15.000₫",
        originalPrice: "30.000₫",
        tag: "THUÊ",
        category: "PHILOSOPHY",
        image: "https://images.unsplash.com/photo-1495446815901-a7297e60bbb6?w=300&h=400&fit=crop",
        discount: "-50%"
    }
];

export default function ProductSection() {
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [favorites, setFavorites] = useState(new Set());

    const toggleFavorite = (productId: number) => {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(productId)) {
            newFavorites.delete(productId);
        } else {
            newFavorites.add(productId);
        }
        setFavorites(newFavorites);
    };

    const filteredProducts = activeFilter === "ALL"
        ? products
        : products.filter(product => product.tag === activeFilter);
    return (
        <section className="py-16 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header with Filters */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-blue-600 uppercase">Sản phẩm nổi bật</p>
                        <h2 className="mt-2 text-3xl font-bold text-gray-900">Sản phẩm nổi bật</h2>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveFilter("ALL")}
                            className={`rounded-full px-4 py-2 text-sm font-bold transition ${activeFilter === "ALL"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            TẤT CẢ
                        </button>
                        <button
                            onClick={() => setActiveFilter("BÁN")}
                            className={`rounded-full px-4 py-2 text-sm font-bold transition ${activeFilter === "BÁN"
                                ? "bg-white text-blue-600 border-2 border-blue-600"
                                : "bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400"
                                }`}
                        >
                            BÁN
                        </button>
                        <button
                            onClick={() => setActiveFilter("THUÊ")}
                            className={`rounded-full px-4 py-2 text-sm font-bold transition ${activeFilter === "THUÊ"
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400"
                                }`}
                        >
                            THUÊ
                        </button>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {filteredProducts.map((product, index) => (
                        <Link key={product.id} href={`/products/${product.id}`}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group flex flex-col h-full rounded-2xl bg-white p-4 shadow-sm hover:shadow-lg transition cursor-pointer"
                            >
                                {/* Product Image */}
                                <div className="relative mb-4 overflow-hidden rounded-xl bg-gray-200">
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="h-48 w-full object-cover transition-transform group-hover:scale-110"
                                    />

                                    {/* Tag and Discount */}
                                    <div className="absolute right-3 top-3 flex flex-col gap-2">
                                        {product.tag && (
                                            <div className={`rounded-md px-3 py-1.5 text-xs font-bold text-white text-center min-w-[30px] ${product.tag === "BÁN" ? "bg-blue-600" : "bg-green-600"}`}>
                                                {product.tag}
                                            </div>
                                        )}
                                        {product.discount && (
                                            <div className="rounded-md bg-orange-500 px-3 py-1.5 text-xs font-bold text-white text-center min-w-[30px]">
                                                {product.discount}
                                            </div>
                                        )}
                                    </div>

                                    {/* Wishlist Button */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            toggleFavorite(product.id);
                                        }}
                                        className="absolute left-3 top-3 rounded-full bg-white p-2 shadow-md hover:bg-gray-100 transition"
                                    >
                                        <Heart
                                            className={`h-5 w-5 transition ${favorites.has(product.id)
                                                ? "fill-red-500 text-red-500"
                                                : "text-gray-400"
                                                }`}
                                        />
                                    </button>
                                </div>

                                {/* Product Info */}
                                <div className="mb-4 flex-1">
                                    <p className="text-xs text-gray-500">{product.category}</p>
                                    <h3 className="mt-1 font-semibold text-gray-900 line-clamp-2">{product.title}</h3>
                                    <p className="mt-1 text-sm text-gray-600">{product.author}</p>
                                </div>

                                {/* Price */}
                                <div className="mb-4">
                                    <p className="text-lg font-bold text-gray-900">{product.price}</p>
                                    {product.originalPrice && (
                                        <p className="text-sm text-gray-500 line-through">{product.originalPrice}</p>
                                    )}
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700 transition flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    Thêm vào giỏ
                                </button>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
