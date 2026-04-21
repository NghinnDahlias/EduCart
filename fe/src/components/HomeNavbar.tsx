"use client";

import { useState } from "react";
import { ShoppingCart, Search, LogOut, User, BookOpen } from "lucide-react";
import Link from "next/link";

export default function HomeNavbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleSignIn = () => {
        setIsLoggedIn(true);
    };

    const handleLogOut = () => {
        setIsLoggedIn(false);
    };

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Left: Logo + Menu */}
                    <div className="flex items-center gap-12">
                        <Link href="/" className="flex items-center gap-2 rounded-lg bg-white px-4 py-2">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                            <span className="text-xl font-bold text-blue-600">EduCart</span>
                        </Link>

                        <div className="hidden items-center gap-8 md:flex">
                            {!isLoggedIn ? (
                                <>
                                    <Link href="/" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                                        Trang chủ
                                    </Link>
                                    <Link href="/products" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                                        Sản phẩm
                                    </Link>
                                    <Link href="/post-product" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                                        Đăng bán
                                    </Link>
                                    <Link href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                                        Theo dõi đơn hàng
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                                        Trang chủ
                                    </Link>
                                    <Link href="/products" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                                        Sản phẩm
                                    </Link>
                                    <Link href="/post-product" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                                        Đăng bán
                                    </Link>
                                    <Link href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                                        Theo dõi đơn hàng
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right: Icons */}
                    <div className="flex items-center gap-4">
                        <button className="rounded-lg p-2 hover:bg-gray-100">
                            <Search className="h-5 w-5 text-gray-700" />
                        </button>

                        <button className="rounded-lg p-2 hover:bg-gray-100 relative">
                            <ShoppingCart className="h-5 w-5 text-gray-700" />
                            {isLoggedIn && (
                                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                    2
                                </span>
                            )}
                        </button>

                        {!isLoggedIn ? (
                            <Link
                                href="/login"
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                            >
                                Đăng nhập
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button className="rounded-lg p-2 hover:bg-gray-100">
                                    <User className="h-5 w-5 text-gray-700" />
                                </button>
                                <button
                                    onClick={handleLogOut}
                                    className="rounded-lg p-2 hover:bg-gray-100"
                                    title="Đăng xuất"
                                >
                                    <LogOut className="h-5 w-5 text-gray-700" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
