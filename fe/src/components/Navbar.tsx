"use client"; // Bắt buộc phải có

import { useState } from "react";
import { BookOpen, User, Menu, X, ShoppingBag, MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; 

export function Navbar() {
  const [hasNotification] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname(); 

  const navLinks = [
    { label: "Marketplace", href: "/marketplace" },
    { label: "Digital PDF Hub", href: "/pdf-hub" },
    { label: "K-12 Zone", href: "/k12" },
    { label: "Forum", href: "/forum" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-semibold text-gray-900">EduCart</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors ${
                    pathname === link.href // Sửa lỗi location.pathname ở đây
                      ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-0.5"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Chat icon */}
            <Link
              href="/chat"
              className={`p-2 rounded-full transition-colors relative ${
                pathname === "/chat" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50 text-gray-600"
              }`}
              title="Messages"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white" />
            </Link>

            {/* Cart icon */}
            <Link
              href="/cart"
              className={`p-2 rounded-full transition-colors relative ${
                pathname === "/cart" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50 text-gray-600"
              }`}
              title="My Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold border-2 border-white">
                5
              </span>
            </Link>

            {/* Profile icon */}
            <div className="relative">
              <button className="p-2 hover:bg-gray-50 rounded-full transition-colors relative">
                <User className="w-6 h-6 text-gray-700" />
                {hasNotification && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white"></span>
                )}
              </button>
            </div>

            <button
              className="md:hidden p-2 hover:bg-gray-50 rounded-full transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden mt-4 pb-2 border-t border-gray-100 pt-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  pathname === link.href // Sửa lỗi location.pathname ở đây
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/cart"
              className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              onClick={() => setMobileOpen(false)}
            >
              <ShoppingBag className="w-4 h-4" /> My Cart (5)
            </Link>
            <Link
              href="/chat"
              className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              onClick={() => setMobileOpen(false)}
            >
              <MessageCircle className="w-4 h-4" /> Messages
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}