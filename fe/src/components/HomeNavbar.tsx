"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, MessageCircle, LogOut, User, BookOpen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { api, getToken, clearToken, clearUser } from "@/lib/api";
import { useLocale } from "@/components/locale-provider";

const navDictionary = {
  vi: {
    home: "Trang chủ",
    products: "Sản phẩm",
    post: "Đăng bán",
    orders: "Theo dõi đơn hàng",
    forum: "Diễn đàn",
    login: "Đăng nhập",
    account: "Tài khoản",
    logout: "Đăng xuất",
  },
  en: {
    home: "Home",
    products: "Products",
    post: "Sell",
    orders: "Orders",
    forum: "Forum",
    login: "Sign in",
    account: "Account",
    logout: "Sign out",
  },
} as const;

export default function HomeNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const { locale, toggleLocale } = useLocale();
  const t = navDictionary[locale];
  const userIsAdmin = user?.Role === "Admin" || user?.role === "Admin";

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    setIsLoggedIn(true);

    api
      .get<{ ok: boolean; user: any }>("/users/me", true)
      .then((res) => {
        if (res.ok && res.user) setUser(res.user);
      })
      .catch(() => {});

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

  const menu = [
    { href: "/", label: t.home },
    { href: "/products", label: t.products },
    { href: "/post-product", label: t.post },
    { href: "/orders", label: t.orders },
    { href: "/forum", label: t.forum },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-2 rounded-lg bg-white px-4 py-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-blue-600">EduCart</span>
            </Link>

            <div className="hidden items-center gap-8 md:flex">
              {menu.map((item) => (
                <Link key={item.href} href={item.href} className="text-sm font-medium text-gray-700 hover:text-blue-600">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLocale}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-gray-50"
              title={locale === "vi" ? "Switch to English" : "Chuyển sang tiếng Việt"}
            >
              {locale === "vi" ? "VI" : "EN"}
            </button>

            <Link href="/chat" className="relative inline-flex rounded-lg p-2 hover:bg-gray-100">
              <MessageCircle className="h-5 w-5 text-gray-700" />
              {isLoggedIn && unreadCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {unreadCount}
                </span>
              ) : null}
            </Link>

            <Link href="/cart" className="relative inline-flex rounded-lg p-2 hover:bg-gray-100">
              <ShoppingCart className="h-5 w-5 text-gray-700" />
              {isLoggedIn && cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {cartCount}
                </span>
              ) : null}
            </Link>

            {!isLoggedIn ? (
              <Link href="/login" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                {t.login}
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                {userIsAdmin ? (
                  <Link
                    href="/admin"
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                  >
                    Admin
                  </Link>
                ) : null}

                <Link href="/profile" className="flex items-center gap-2 rounded-lg p-1.5 transition hover:bg-gray-100">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                    {user?.LName?.charAt(0) || user?.FName?.charAt(0) || <User className="h-4 w-4" />}
                  </div>
                  <span className="hidden pr-2 text-sm font-semibold text-gray-700 sm:block">
                    {`${user?.LName ?? ""} ${user?.FName ?? ""}`.trim() || t.account}
                  </span>
                </Link>

                <button onClick={handleLogOut} className="rounded-lg p-2 transition hover:bg-gray-100" title={t.logout}>
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
