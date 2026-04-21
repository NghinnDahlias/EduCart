"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
    {
        id: 1,
        title: "Khối ngành Công nghệ thông tin",
        description: "Giáo trình Cấu trúc dữ liệu và giải thuật, Lập trình C, Java, Python đang có ưu đãi lớn.",
        tag: "INFORMATION TECHNOLOGY",
        image: "https://cellphones.com.vn/sforum/wp-content/uploads/2023/12/nganh-it-la-gi-1.jpg",
        link: "Khám phá ngay"
    },
    {
        id: 2,
        title: "Khối ngành Kỹ thuật",
        description: "Giáo trình Giải tích, Vật lý đại cương, Cơ sở thiết kế máy đang có giá cực tốt.",
        tag: "ENGINEERING",
        image: "https://hiu.vn/wp-content/uploads/2020/03/Ng%C3%A0nh-c%C6%A1-%C4%91i%E1%BB%87n-t%E1%BB%AD.png",
        link: "Khám phá ngay"
    },
    {
        id: 2,
        title: "Khối ngành Kỹ thuật",
        description: "Giáo trình Giải tích, Vật lý đại cương, Cơ sở thiết kế máy đang có giá cực tốt.",
        tag: "ENGINEERING",
        image: "https://hiu.vn/wp-content/uploads/2020/03/Ng%C3%A0nh-c%C6%A1-%C4%91i%E1%BB%87n-t%E1%BB%AD.png",
        link: "Khám phá ngay"
    }
];

export default function CategorySection() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? categories.length - 2 : prev - 2));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 2 >= categories.length ? 0 : prev + 2));
    };

    const visibleCategories = categories.slice(currentIndex, currentIndex + 2);
    return (
        <section className="py-16 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-blue-600 uppercase">GỢI Ý TỪ CHÚNG TÔI</p>
                        <h2 className="mt-2 text-3xl font-bold text-gray-900">Dành riêng cho các ngành học</h2>
                    </div>
                    <div className="hidden items-center gap-2 sm:flex">
                        <button
                            onClick={handlePrev}
                            className="rounded-lg border border-gray-300 p-2 hover:bg-gray-100 transition"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="rounded-lg border border-gray-300 p-2 hover:bg-gray-100 transition"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {visibleCategories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative overflow-hidden rounded-2xl"
                        >
                            {/* Background Image */}
                            <img
                                src={category.image}
                                alt={category.title}
                                className="h-64 w-full object-cover transition-transform group-hover:scale-110"
                            />

                            {/* White Layer Overlay */}
                            <div className="absolute inset-0 bg-white/20" />

                            {/* Dark Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                                <div className="mb-3 inline-flex w-fit rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold">
                                    {category.tag}
                                </div>
                                <h3 className="text-2xl font-bold">{category.title}</h3>
                                <p className="mt-2 text-sm text-gray-200">{category.description}</p>
                                <div className="mt-4 inline-flex items-center gap-1 font-semibold hover:gap-2 transition-all cursor-pointer">
                                    {category.link}
                                    <span>→</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
