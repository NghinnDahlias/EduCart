"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Grid3x3, List, ChevronLeft, ChevronRight, Search } from "lucide-react";
import HomeNavbar from "@/components/HomeNavbar";
import HomeFooter from "@/components/HomeFooter";

// Mock product database
const allProducts = [
    {
        id: 1,
        title: "Calculus: Early Transcendentals",
        author: "James Stewart",
        price: "125.000₫",
        originalPrice: "250.000₫",
        discount: "-50%",
        tag: "Bán",
        category: "Calculus",
        image: "https://images.unsplash.com/photo-1543002588-d4d1a5007b53?w=300&h=400&fit=crop",
        type: "Sách cùng",
    },
    {
        id: 2,
        title: "Nguyên lý Kinh tế học",
        author: "N. Gregory Mankiw",
        price: "25.000₫",
        originalPrice: "",
        discount: "",
        tag: "Thuê",
        category: "Economics",
        image: "https://images.unsplash.com/photo-1507842217343-583684b2dd83?w=300&h=400&fit=crop",
        type: "E-book",
    },
    {
        id: 3,
        title: "Chemistry: A Molecular Approach",
        author: "Nivaldo Jr. Tro",
        price: "180.000₫",
        originalPrice: "",
        discount: "",
        tag: "Bán",
        category: "Chemistry",
        image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=400&fit=crop",
        type: "Sách cùng",
    },
    {
        id: 4,
        title: "Triết học Mác - Lênin",
        author: "NXB Lao động",
        price: "15.000₫",
        originalPrice: "30.000₫",
        discount: "-50%",
        tag: "Thuê",
        category: "Philosophy",
        image: "https://images.unsplash.com/photo-1495446815901-a7297e60bbb6?w=300&h=400&fit=crop",
        type: "Lau kit",
    },
    {
        id: 5,
        title: "Introduction to Algorithms",
        author: "Thomas H. Cormen",
        price: "220.000₫",
        originalPrice: "350.000₫",
        discount: "-37%",
        tag: "Bán",
        category: "Computer Science",
        image: "https://images.unsplash.com/photo-1516979187457-635ffe35ff04?w=300&h=400&fit=crop",
        type: "E-book",
    },
    {
        id: 6,
        title: "Vật lý đại cương A1",
        author: "TS. Lê Công C",
        price: "110.000₫",
        originalPrice: "",
        discount: "",
        tag: "Bán",
        category: "Physics",
        image: "https://images.unsplash.com/photo-1507842217343-583684b2dd83?w=300&h=400&fit=crop",
        type: "Sách cùng",
    },
    {
        id: 7,
        title: "Linear Algebra and Its Applications",
        author: "David C. Lay",
        price: "195.000₫",
        originalPrice: "290.000₫",
        discount: "-33%",
        tag: "Bán",
        category: "Mathematics",
        image: "https://images.unsplash.com/photo-1507842217343-583684b2dd83?w=300&h=400&fit=crop",
        type: "Sách cùng",
    },
    {
        id: 8,
        title: "Sinh học phân tử",
        author: "James D. Watson",
        price: "240.000₫",
        originalPrice: "",
        discount: "",
        tag: "Bán",
        category: "Biology",
        image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=400&fit=crop",
        type: "E-book",
    },
    {
        id: 9,
        title: "Tiếng Anh giao tiếp cơ bản",
        author: "Oxford English",
        price: "85.000₫",
        originalPrice: "150.000₫",
        discount: "-43%",
        tag: "Thuê",
        category: "Language",
        image: "https://images.unsplash.com/photo-1507842217343-583684b2dd83?w=300&h=400&fit=crop",
        type: "Sách cùng",
    },
    {
        id: 10,
        title: "Lịch sử Việt Nam hiện đại",
        author: "TS. Trần Văn Giàu",
        price: "65.000₫",
        originalPrice: "",
        discount: "",
        tag: "Bán",
        category: "History",
        image: "https://images.unsplash.com/photo-1495446815901-a7297e60bbb6?w=300&h=400&fit=crop",
        type: "Sách cùng",
    },
    {
        id: 11,
        title: "Data Science Handbook",
        author: "Jake VanderPlas",
        price: "210.000₫",
        originalPrice: "350.000₫",
        discount: "-40%",
        tag: "Bán",
        category: "Computer Science",
        image: "https://images.unsplash.com/photo-1516979187457-635ffe35ff04?w=300&h=400&fit=crop",
        type: "E-book",
    },
    {
        id: 12,
        title: "Quản trị Kinh doanh",
        author: "Stephen P. Robbins",
        price: "175.000₫",
        originalPrice: "",
        discount: "",
        tag: "Thuê",
        category: "Business",
        image: "https://images.unsplash.com/photo-1507842217343-583684b2dd83?w=300&h=400&fit=crop",
        type: "Sách cùng",
    },
    {
        id: 13,
        title: "Hóa học hữu cơ nâng cao",
        author: "Jonathan Clayden",
        price: "245.000₫",
        originalPrice: "390.000₫",
        discount: "-37%",
        tag: "Bán",
        category: "Chemistry",
        image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=400&fit=crop",
        type: "E-book",
    },
    {
        id: 14,
        title: "Tâm lý học nhân cách",
        author: "Carl Rogers",
        price: "120.000₫",
        originalPrice: "200.000₫",
        discount: "-40%",
        tag: "Thuê",
        category: "Psychology",
        image: "https://images.unsplash.com/photo-1495446815901-a7297e60bbb6?w=300&h=400&fit=crop",
        type: "Sách cùng",
    },
    {
        id: 15,
        title: "Cơ học chất lỏng",
        author: "Frank M. White",
        price: "200.000₫",
        originalPrice: "",
        discount: "",
        tag: "Bán",
        category: "Physics",
        image: "https://images.unsplash.com/photo-1507842217343-583684b2dd83?w=300&h=400&fit=crop",
        type: "Sách cùng",
    },
    {
        id: 16,
        title: "Lập trình Web với React",
        author: "Kyle Simpson",
        price: "185.000₫",
        originalPrice: "300.000₫",
        discount: "-38%",
        tag: "Bán",
        category: "Computer Science",
        image: "https://images.unsplash.com/photo-1516979187457-635ffe35ff04?w=300&h=400&fit=crop",
        type: "E-book",
    },
];

const ITEMS_PER_PAGE = 15;

export default function ProductsPage() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [currentPage, setCurrentPage] = useState(1);
    const [filterType, setFilterType] = useState<"ALL" | "Bán" | "Thuê">("ALL");
    const [favorites, setFavorites] = useState(new Set<number>());
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    // Filter products
    const filteredProducts = allProducts.filter((product) => {
        const typeMatch = filterType === "ALL" || product.tag === filterType;
        const categoryMatch = selectedCategory === "ALL" || product.category === selectedCategory;
        const searchMatch = searchQuery === "" ||
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.author.toLowerCase().includes(searchQuery.toLowerCase());
        return typeMatch && categoryMatch && searchMatch;
    });

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;
    const paginatedProducts = filteredProducts.slice(startIdx, endIdx);

    const toggleFavorite = (productId: number) => {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(productId)) {
            newFavorites.delete(productId);
        } else {
            newFavorites.add(productId);
        }
        setFavorites(newFavorites);
    };

    const categories = ["ALL", ...new Set(allProducts.map((p) => p.category))];

    return (
        <main className="bg-gray-50 min-h-screen">
            <HomeNavbar />

            <section className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb with View Toggle */}
                    <div className="mb-8 flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
                            <span>/</span>
                            <span className="text-gray-900 font-medium">Sản phẩm</span>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`rounded-lg p-2 transition ${viewMode === "grid"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                    }`}
                            >
                                <Grid3x3 className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`rounded-lg p-2 transition ${viewMode === "list"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                    }`}
                            >
                                <List className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                        {/* Sidebar Filters */}
                        <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-bold text-gray-900">BỘ LỌC TÌM KIẾM</h3>

                            {/* Search Input */}
                            <div className="mb-4 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm sản phẩm..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm placeholder-gray-500 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                                />
                            </div>

                            {/* Filter by Type */}
                            <div className="mb-8">
                                <h4 className="mb-4 font-semibold text-gray-900">Hình thức</h4>
                                <div className="space-y-3">
                                    {["ALL", "Bán", "Thuê"].map((type) => (
                                        <label key={type} className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="type"
                                                value={type}
                                                checked={filterType === type}
                                                onChange={(e) => {
                                                    setFilterType(e.target.value as "ALL" | "Bán" | "Thuê");
                                                    setCurrentPage(1);
                                                }}
                                                className="h-4 w-4"
                                            />
                                            <span className="text-sm text-gray-700">
                                                {type === "ALL" ? "Tất cả" : type}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Filter by Category */}
                            <div className="mb-4">
                                <h4 className="mb-4 font-semibold text-gray-900">Khoa/Ngành học</h4>
                                <div className="space-y-3">
                                    {categories.map((category) => (
                                        <label key={category} className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="category"
                                                value={category}
                                                checked={selectedCategory === category}
                                                onChange={(e) => {
                                                    setSelectedCategory(e.target.value);
                                                    setCurrentPage(1);
                                                }}
                                                className="h-4 w-4"
                                            />
                                            <span className="text-sm text-gray-700">
                                                {category === "ALL" ? "Tất cả" : category}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            {paginatedProducts.length > 0 ? (
                                <div
                                    className={
                                        viewMode === "grid"
                                            ? "grid grid-cols-1 gap-6 sm:grid-cols-3"
                                            : "space-y-4"
                                    }
                                >
                                    {paginatedProducts.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/products/${product.id}`}
                                            className={
                                                viewMode === "grid"
                                                    ? "group flex flex-col h-full rounded-2xl bg-white p-4 shadow-sm hover:shadow-lg transition"
                                                    : "flex gap-4 rounded-2xl bg-white p-4 shadow-sm hover:shadow-lg transition"
                                            }
                                        >
                                            {/* Image */}
                                            <div
                                                className={
                                                    viewMode === "grid"
                                                        ? "relative mb-4 overflow-hidden rounded-xl bg-gray-200 h-40 w-full"
                                                        : "relative overflow-hidden rounded-xl bg-gray-200 h-40 w-40 flex-shrink-0"
                                                }
                                            >
                                                <img
                                                    src={product.image}
                                                    alt={product.title}
                                                    className="h-full w-full object-cover group-hover:scale-110 transition"
                                                />

                                                {/* Tag */}
                                                <div className="absolute right-2 top-2">
                                                    <div className="rounded-md bg-orange-500 px-2 py-1 text-xs font-bold text-white">
                                                        {product.tag}
                                                    </div>
                                                </div>

                                                {/* Wishlist Button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        toggleFavorite(product.id);
                                                    }}
                                                    className="absolute left-2 top-2 rounded-full bg-white p-2 shadow-md hover:bg-gray-100 transition"
                                                >
                                                    <Heart
                                                        className={`h-4 w-4 transition ${favorites.has(product.id)
                                                            ? "fill-red-500 text-red-500"
                                                            : "text-gray-400"
                                                            }`}
                                                    />
                                                </button>
                                            </div>

                                            {/* Product Info */}
                                            <div className={viewMode === "grid" ? "flex flex-col flex-1" : "flex-1"}>
                                                <div className={viewMode === "list" ? "" : "mb-4 flex-1"}>
                                                    <p className="text-xs text-gray-500 font-medium">{product.type}</p>
                                                    <h3 className="mt-1 font-semibold text-gray-900 line-clamp-2">
                                                        {product.title}
                                                    </h3>
                                                    <p className="mt-1 text-xs text-gray-600">{product.author}</p>
                                                </div>

                                                {/* Price and Buy Button */}
                                                <div className="flex flex-col gap-3">
                                                    {/* Price */}
                                                    <div>
                                                        <div className="flex items-baseline gap-2">
                                                            <p className="text-lg font-bold text-blue-600">
                                                                {product.price}
                                                            </p>
                                                            {product.originalPrice && (
                                                                <p className="text-xs text-gray-500 line-through">
                                                                    {product.originalPrice}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Buy Button */}
                                                    {viewMode === "grid" && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                            }}
                                                            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 transition flex items-center justify-center gap-2"
                                                        >
                                                            <ShoppingCart className="h-4 w-4" />
                                                            Mua ngay
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Buy Button for List View */}
                                                {viewMode === "list" && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                        }}
                                                        className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white hover:bg-blue-700 transition flex items-center justify-center gap-2 h-fit"
                                                    >
                                                        <ShoppingCart className="h-4 w-4" />
                                                        Mua ngay
                                                    </button>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                                    <p className="text-gray-600">Không tìm thấy sản phẩm</p>
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-8 flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="rounded-lg p-2 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`h-10 w-10 rounded-lg font-bold transition ${currentPage === page
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="rounded-lg p-2 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <HomeFooter />
        </main>
    );
}
