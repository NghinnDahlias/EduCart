"use client";

import Link from "next/link";
import { Share2, MapPin } from "lucide-react";

export default function HomeFooter() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* About */}
                    <div>
                        <h3 className="text-xl font-bold text-white">EduCart</h3>
                        <p className="mt-4 text-sm">
                            Xây dựng hệ sinh thái tư thác bền vững cho sinh viên Việt Nam qua việc tái sử dụng giáo trình và tài liệu học tập.
                        </p>
                        <div className="mt-4 flex gap-3">
                            <button className="rounded-lg p-2 hover:bg-gray-800">
                                <MapPin className="h-5 w-5" />
                            </button>
                            <button className="rounded-lg p-2 hover:bg-gray-800">
                                <Share2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* About Links */}
                    <div>
                        <h4 className="font-semibold text-white">VỀ CHÚNG TÔI</h4>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Hướng dẫn mua hàng
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Chính sách thuê sách
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Kiểm định chất lượng
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Tuyên công tác viên
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="font-semibold text-white">HỖ TRỢ</h4>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Trung tâm trợ giúp
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Báo cáo vi phạm
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Khiếu nại / Hoàn tiền
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Liên hệ Campus
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-semibold text-white">ĐĂNG KÝ NHẬN TIN</h4>
                        <p className="mt-2 text-sm">Cập nhật khuyến mãi và sản phẩm mới.</p>
                        <div className="mt-4 flex">
                            <input
                                type="email"
                                placeholder="Email của bạn"
                                className="flex-1 rounded-l-lg bg-gray-800 px-4 py-2 text-sm text-white placeholder-gray-500 outline-none"
                            />
                            <button className="rounded-r-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                                Đăng ký
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 border-t border-gray-800 pt-8">
                    <p className="text-center text-sm text-gray-500">
                        © 2024 EDUCART GROUP. ALL RIGHTS RESERVED.
                    </p>
                </div>
            </div>
        </footer>
    );
}
