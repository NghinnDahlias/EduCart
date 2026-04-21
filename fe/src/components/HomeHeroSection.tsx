"use client";

import { motion } from "framer-motion";
import { Download, Shield, Users, Calendar } from "lucide-react";

export default function HomeHeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 py-16">
            {/* 3D Blur Background Effect */}
            <div className="absolute inset-0 backdrop-blur-3xl opacity-40">
                <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-blue-400 mix-blend-multiply filter blur-3xl" />
                <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-purple-400 mix-blend-multiply filter blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-pink-300 mix-blend-multiply filter blur-3xl" />
            </div>

            {/* Content Layer */}
            <div className="relative z-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col justify-center"
                        >
                            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-blue-100 px-4 py-2">
                                <span className="text-sm font-semibold uppercase text-blue-600">
                                    Tri thức cũ, hành trình mới
                                </span>
                            </div>

                            <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
                                EduCart
                                <br />
                                <span className="text-blue-600">Sách cũ, giá tốt</span>
                            </h1>

                            <p className="mt-6 max-w-lg text-base text-gray-700">
                                Mua sách và cho thuê giáo trình chuyên ngành từ cộng đồng sinh viên. Tiết kiệm chi phí, kết nối trí thức.
                            </p>

                            {/* CTA Buttons */}
                            <div className="mt-8 flex flex-wrap gap-4">
                                <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition">
                                    <Download className="h-5 w-5" />
                                    MUA SÁCH NGAY
                                </button>
                                <button className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:border-gray-400 transition">
                                    <Calendar className="h-5 w-5" />
                                    THUÊ THEO HỌC KỲ
                                </button>
                            </div>
                        </motion.div>

                        {/* Right Image */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="flex items-center justify-center"
                        >
                            <div className="relative w-full max-w-2xl h-\[600px\] overflow-hidden rounded-3xl shadow-2xl">
                                <img
                                    src="https://huongnghiep.hocmai.vn/wp-content/uploads/2025/12/image3-27.png"
                                    alt="Library"
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
                            </div>
                        </motion.div>
                    </div>

                    {/* Features Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mx-auto mt-12 max-w-7xl"
                    >
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {/* Card 1 */}
                            <div className="rounded-2xl border-2 border-gray-200 bg-white p-6 text-center shadow-sm hover:shadow-md transition">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                    <Download className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="font-bold text-gray-900">MUA BÁN & THUÊ GIÁO TRÌNH</h3>
                                <p className="mt-2 text-sm text-gray-600">
                                    Nền tảng kết nối các phân bán và cho thuê giáo trình ở giá tốt nhất cho sinh viên.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="rounded-2xl border-2 border-gray-200 bg-white p-6 text-center shadow-sm hover:shadow-md transition">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                    <Shield className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="font-bold text-gray-900">AN TẤM VỚI ESCROW</h3>
                                <p className="mt-2 text-sm text-gray-600">
                                    Hệ thống ghi chép giao dịch bảo đảm tất cả các nguyên tắc. Chúng tôi giúp bạn kiểm soát an toàn mọi lần giao dịch.
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="rounded-2xl border-2 border-gray-200 bg-white p-6 text-center shadow-sm hover:shadow-md transition">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="font-bold text-gray-900">DÀNH CHO SINH VIÊN</h3>
                                <p className="mt-2 text-sm text-gray-600">
                                    Tạo thực qua những sản sách giáo dục đây động, ở hàng có với minh. Kết nối bạn bè học tập hiệu quả với nhau.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
