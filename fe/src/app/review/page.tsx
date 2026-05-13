"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Star,
  ShieldCheck,
  AlertTriangle,
  Upload,
  ChevronDown,
} from "lucide-react";

import HomeNavbar from "@/components/HomeNavbar";
import HomeFooter from "@/components/HomeFooter";

export default function CompleteOrderPage() {
    const [rating, setRating] = useState(4);
  return (
    <main className="min-h-screen bg-[#f7f7fb] flex flex-col">
      {/* HEADER */}
      <HomeNavbar />

      {/* CONTENT */}
      <section className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-10">
            <Link href="/">Trang chủ</Link>
            <span>›</span>
            <Link href="/orders">Theo dõi đơn hàng</Link>
            <span>›</span>

            <span className="text-gray-900 font-semibold">
              Hoàn tất giao dịch
            </span>
          </div>

          {/* SUCCESS */}
          <div className="text-center mb-14">
            <div className="w-20 h-20 rounded-2xl bg-blue-600 mx-auto flex items-center justify-center mb-6 shadow-md">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>

            <p className="uppercase tracking-wide text-blue-600 font-bold text-sm mb-4">
              ĐƠN HÀNG ĐÃ GIAO THÀNH CÔNG VÀO LÚC 10:30, NGÀY 25/05/2024 TẠI THƯ
              VIỆN TRUNG TÂM ĐHQG
            </p>

            <h1 className="text-5xl font-extrabold text-[#0f172a] mb-5">
              Xác nhận nhận hàng & Đánh giá
            </h1>

            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Cảm ơn bạn đã tin dùng EduCart. Hãy xác nhận đã nhận hàng thành
              công và đánh giá tại đây để giúp cộng đồng sinh viên chọn lựa tốt
              hơn.
            </p>
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
            {/* LEFT */}
            <div className="space-y-6">
              {/* Product Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="text-3xl font-bold text-[#0f172a] mb-6">
                  Sản phẩm đã mua
                </h2>

                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-28 h-40 relative rounded-lg overflow-hidden bg-gray-100 border">
                    <Image
                      src="/images/book.jpg"
                      alt="book"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <p className="text-blue-600 font-bold uppercase text-sm">
                      GIÁO TRÌNH
                    </p>

                    <h3 className="font-bold text-2xl text-[#0f172a] leading-snug mt-1">
                      Giáo trình Giải tích 1
                    </h3>

                    <p className="text-gray-500 mt-3">Khoa Toán - Tin học</p>

                    <p className="text-blue-600 font-bold text-2xl mt-2">
                      125.000đ
                    </p>
                  </div>
                </div>

                {/* Seller */}
                <div className="border-t border-gray-200 mt-6 pt-5 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden relative">
                    <Image
                      src="/images/avatar.jpg"
                      alt="seller"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Người bán</p>

                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-lg text-[#0f172a]">
                        Lê Văn Nam
                      </h4>

                      <span className="text-blue-600">✔</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Return Box */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-4">
                <div className="mt-1">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                </div>

                <p className="text-sm leading-relaxed text-gray-700">
                  Nếu hàng sai mô tả, hãy{" "}
                  <span className="font-bold text-blue-600">
                    trả hàng hoàn tiền tại đây
                  </span>
                </p>
              </div>

              {/* Warning */}
              <div className="bg-red-50 border border-red-100 rounded-xl p-5">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-500 mt-1" />

                  <h3 className="text-red-600 font-bold text-xl">
                    LƯU Ý QUAN TRỌNG
                  </h3>
                </div>

                <div className="text-sm text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Việc cố ý đánh giá tiêu cực sai sự thật hoặc quấy rối người
                    dùng khác sẽ bị xem là vi phạm Quy chuẩn cộng đồng.
                  </p>

                  <p>
                    EduCart có quyền gỡ bỏ các đánh giá không trung thực và khóa
                    tài khoản vi phạm.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h2 className="text-4xl font-bold text-[#0f172a] mb-10">
                Xác nhận & Đánh giá
              </h2>
                
              {/* Rating */}
              <div className="mb-10">
                <p className="text-sm font-bold tracking-wide text-gray-500 mb-4">
                  MỨC ĐỘ HÀI LÒNG
                </p>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => setRating(item)}
                            className="transition-transform hover:scale-110"
                        >
                        <Star
                            className={`w-8 h-8 transition-all ${
                            item <= rating
                            ? "text-blue-500"
                            : "text-gray-300"
                        }`}
                        />
                        </button>
                    ))}
                  </div>

                  <span className="text-blue-600 font-bold text-2xl">
                    {rating === 1 && "Rất tệ"}
                    {rating === 2 && "Tệ"}
                    {rating === 3 && "Bình thường"}
                    {rating === 4 && "Tốt"}
                    {rating === 5 && "Xuất sắc"}
                  </span>
                </div>
              </div>

              {/* Review */}
              <div className="mb-10">
                <p className="text-sm font-bold tracking-wide text-gray-500 mb-4">
                  NỘI DUNG ĐÁNH GIÁ
                </p>

                <textarea
                  rows={6}
                  placeholder="Hãy viết cảm nhận của bạn về sản phẩm và thái độ phục vụ của người bán..."
                  className="w-full border border-gray-300 rounded-xl p-5 resize-none outline-none focus:border-blue-600 text-gray-700"
                />
              </div>

              <div className="border-t border-gray-200 pt-10">
                <h3 className="text-4xl font-bold text-red-600 mb-8">
                  Yêu cầu trả hàng (nếu có)
                </h3>

                {/* Select */}
                <div className="mb-8">
                  <p className="text-sm font-bold tracking-wide text-gray-500 mb-4">
                    LÝ DO TRẢ HÀNG *
                  </p>

                  <div className="relative">
                    <select className="w-full border border-gray-300 rounded-xl px-5 py-4 appearance-none outline-none focus:border-blue-600 text-gray-700">
                      <option>Chọn lý do trả hàng</option>
                      <option>Sản phẩm lỗi</option>
                      <option>Sai mô tả</option>
                      <option>Thiếu phụ kiện</option>
                    </select>

                    <ChevronDown className="w-5 h-5 absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Upload Proof */}
                <div className="mb-10">
                  <p className="text-sm font-bold tracking-wide text-gray-500 mb-4">
                    ẢNH MINH CHỨNG TRẢ HÀNG (TỐI ĐA 5)
                  </p>

                  <div className="flex gap-4">
                    <label className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />

                      <span className="text-gray-500 text-sm">Tải ảnh</span>

                      <input type="file" hidden />
                    </label>
                  </div>
                </div>

                {/* Upload Product Image */}
                <div className="mb-12">
                  <p className="text-sm font-bold tracking-wide text-gray-500 mb-4">
                    HÌNH ẢNH THỰC TẾ (TỐI ĐA 5)
                  </p>

                  <div className="flex gap-4">
                    <label className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />

                      <span className="text-gray-500 text-sm">Tải ảnh</span>

                      <input type="file" hidden />
                    </label>

                    <div className="w-40 h-40 rounded-xl overflow-hidden relative border border-gray-200">
                      <Image
                        src="/images/book-open.jpg"
                        alt="preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <ShieldCheck className="w-5 h-5" />

                    <span>Đánh giá của bạn sẽ được hiển thị công khai</span>
                  </div>

                  <button className="bg-blue-600 hover:bg-blue-700 transition text-white font-bold px-12 py-4 rounded-xl text-lg shadow-md">
                    GỬI ĐÁNH GIÁ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <HomeFooter />
    </main>
  );
}