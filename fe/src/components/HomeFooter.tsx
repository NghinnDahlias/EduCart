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
                            Tiên phong xây dựng hệ sinh thái tri thức bền vững cho sinh viên Việt Nam qua giải pháp tái sử dụng giáo trình. Chúng tôi kết nối giá trị cũ để mở ra những hành trình mới, giúp tối ưu chi phí và lan tỏa văn hóa đọc trong cộng đồng học thuật
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
                                    Hướng dẫn giao dịch
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Chính sách thuê sách
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Quy chuẩn kiểm định chất lượng
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white">
                                    Trung tâm trợ giúp và khiếu nại
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="font-semibold text-white">THÔNG TIN LIÊN HỆ</h4>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li>
                                <button className="text-white text-left">
                                    Địa điểm: Trường ĐH Bách khoa - ĐHQG-HCM, cơ sở 2
                                </button>
                            </li>
                            <li>
                                <button className="text-white text-left">
                                    Email: contact.educart@gmail.com
                                </button>
                            </li>
                            <li>
                                <button className="text-white text-left">
                                    Số điện thoại: 0329 123 456
                                </button>
                            </li>
                            <li>
                                <button className="text-white text-left">
                                    Facebook: facebook.com/EduCart.HCMUT
                                </button>
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
