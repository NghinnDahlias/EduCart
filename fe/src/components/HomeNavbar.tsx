"use client";

import { useState, useEffect } from "react";
import {
  ShoppingCart,
  MessageCircle,
  LogOut,
  User,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { api, getToken, clearToken, clearUser } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function HomeNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    setIsLoggedIn(true);

    // Lấy thông tin user mới nhất từ API
    api
      .get<{ ok: boolean; user: any }>("/users/me", true)
      .then((res) => {
        if (res.ok && res.user) setUser(res.user);
      })
      .catch(() => {});

    // Lấy số lượng giỏ hàng
    api
      .get<{ ok: boolean; items: any[] }>("/cart", true)
      .then((res) => {
        if (res.ok && res.items) setCartCount(res.items.length);
      })
      .catch(() => {});

    const fetchUnread = () => {
      api
        .get<{ ok: boolean; count: number }>("/messages/unread-count", true)
        .then((res) => {
          if (res.ok && res.count !== undefined) setUnreadCount(res.count);
        })
        .catch(() => {});
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleLogOut = () => {
    clearToken();
    clearUser();
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo + Menu */}
          <div className="flex items-center gap-12">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2"
            >
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-blue-600">EduCart</span>
            </Link>

            <div className="hidden items-center gap-8 md:flex">
              {!isLoggedIn ? (
                <>
                  <Link
                    href="/"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    Trang chủ
                  </Link>
                  <Link
                    href="/products"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    Sản phẩm
                  </Link>
                  <Link
                    href="/post-product"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    Đăng bán
                  </Link>
                  <Link
                    href="/orders"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    Theo dõi đơn hàng
                  </Link>
                  <Link
                    href="/forum"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    Diễn đàn
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    Trang chủ
                  </Link>
                  <Link
                    href="/products"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    Sản phẩm
                  </Link>
                  <Link
                    href="/post-product"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    Đăng bán
                  </Link>
                  <Link
                    href="/orders"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    Theo dõi đơn hàng
                  </Link>
                  <Link
                    href="/forum"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    Diễn đàn
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-4">
            <Link
              href="/chat"
              className="rounded-lg p-2 hover:bg-gray-100 relative inline-flex"
            >
              <MessageCircle className="h-5 w-5 text-gray-700" />
              {isLoggedIn && unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="rounded-lg p-2 hover:bg-gray-100 relative inline-flex"
            >
              <ShoppingCart className="h-5 w-5 text-gray-700" />
              {isLoggedIn && cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {!isLoggedIn ? (
              <Link
                href="/login"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
              >
                Đăng nhập
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100 transition"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                    {user?.LName?.charAt(0) || user?.FName?.charAt(0) || (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 hidden sm:block pr-2">
                    {`${user?.LName ?? ""} ${user?.FName ?? ""}`.trim() ||
                      "Tài khoản"}
                  </span>
                </Link>
                <button
                  onClick={handleLogOut}
                  className="rounded-lg p-2 hover:bg-gray-100 transition"
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
