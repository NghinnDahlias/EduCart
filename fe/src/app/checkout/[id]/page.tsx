"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChevronLeft,
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Phone,
  User,
  Handshake,
  Minus,
  Plus,
} from "lucide-react";

import HomeNavbar from "@/components/HomeNavbar";

const products = [
  {
    id: 1,
    title: "Calculus: Early Transcendentals",
    author: "James Stewart",
    price: "125.000₫",
    originalPrice: "250.000₫",
    discount: "-50%",
    tag: "Bán",
    category: "Calculus",
    image: "https://covers.openlibrary.org/b/isbn/9781285741550-L.jpg",
    type: "Sách cứng",
    condition: "95%",
    year: "Theo kỳ",
    school: "ĐH Bách Khoa TP.HCM",
    faculty: "Khoa Khoa học Ứng dụng",
    subject: "All",
  },
  {
    id: 2,
    title: "Nguyên lý Kinh tế học",
    author: "N. Gregory Mankiw",
    price: "25.000₫",
    originalPrice: "50.000₫",
    discount: "-50%",
    tag: "Thuê",
    category: "Economics",
    image: "https://covers.openlibrary.org/b/isbn/9781305585126-L.jpg",
    type: "E-book",
    condition: "100%",
    year: "Theo kỳ",
    school: "ĐH Kinh tế TP.HCM",
    faculty: "Khoa Kinh tế",
    subject: "Kinh tế vi mô",
  },
  {
    id: 3,
    title: "Chemistry: A Molecular Approach",
    author: "Nivaldo Jr. Tro",
    price: "180.000₫",
    originalPrice: "360.000₫",
    discount: "-50%",
    tag: "Bán",
    category: "Chemistry",
    image: "https://covers.openlibrary.org/b/isbn/9780321809247-L.jpg",
    type: "Sách cứng",
    condition: "90%",
    year: "Theo kỳ",
    school: "ĐH Khoa học Tự nhiên",
    faculty: "Khoa Hóa học",
    subject: "Hóa học đại cương",
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
    image: "https://covers.openlibrary.org/b/isbn/9780717804405-L.jpg",
    type: "Sách mềm",
    condition: "85%",
    year: "Theo kỳ",
    school: "ĐH Quốc gia TP.HCM",
    faculty: "Khoa Lý luận Chính trị",
    subject: "Triết học Mác - Lênin",
  },
  {
    id: 5,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    price: "220.000₫",
    originalPrice: "440.000₫",
    discount: "-50%",
    tag: "Bán",
    category: "Computer Science",
    image: "https://covers.openlibrary.org/b/isbn/9780262033848-L.jpg",
    type: "E-book",
    condition: "100%",
    year: "Dài hạn",
    school: "ĐH Bách Khoa TP.HCM",
    faculty: "Khoa Khoa học & Kỹ thuật Máy tính",
    subject: "Cấu trúc dữ liệu và Giải thuật",
  },
  {
    id: 6,
    title: "Vật lý đại cương A1",
    author: "TS. Lê Công C",
    price: "110.000₫",
    originalPrice: "220.000₫",
    discount: "-50%",
    tag: "Bán",
    category: "Physics",
    image: "https://covers.openlibrary.org/b/isbn/9781305952195-L.jpg",
    type: "Sách cứng",
    condition: "90%",
    year: "Theo kỳ",
    school: "ĐH Bách Khoa TP.HCM",
    faculty: "Khoa Khoa học Ứng dụng",
    subject: "Vật lý 1",
  },
  {
    id: 7,
    title: "Linear Algebra and Its Applications",
    author: "David C. Lay",
    price: "195.000₫",
    originalPrice: "250.000₫",
    discount: "-50%",
    tag: "Bán",
    category: "Mathematics",
    image: "https://covers.openlibrary.org/b/isbn/9780321982384-L.jpg",
    type: "Sách cứng",
    condition: "92%",
    year: "Theo kỳ",
    school: "ĐH Khoa học Tự nhiên",
    faculty: "Khoa Toán - Tin học",
    subject: "Đại số tuyến tính",
  },
  {
    id: 8,
    title: "Sinh học phân tử",
    author: "James D. Watson",
    price: "240.000₫",
    originalPrice: "480.000₫",
    discount: "-50%",
    tag: "Bán",
    category: "Biology",
    image: "https://covers.openlibrary.org/b/isbn/9780321762436-L.jpg",
    type: "E-book",
    condition: "100%",
    year: "Dài hạn",
    school: "ĐH Y Dược TP.HCM",
    faculty: "Khoa Y",
    subject: "Sinh học đại cương",
  },
  {
    id: 9,
    title: "Tiếng Anh giao tiếp cơ bản",
    author: "Oxford English",
    price: "85.000₫",
    originalPrice: "170.000₫",
    discount: "-50%",
    tag: "Thuê",
    category: "Language",
    image: "https://covers.openlibrary.org/b/isbn/9780194579858-L.jpg",
    type: "Sách cứng",
    condition: "80%",
    year: "Theo kỳ",
    school: "ĐH Sư phạm TP.HCM",
    faculty: "Khoa Tiếng Anh",
    subject: "Anh văn cơ bản",
  },
  {
    id: 10,
    title: "Lịch sử Việt Nam hiện đại",
    author: "TS. Trần Văn Giàu",
    price: "65.000₫",
    originalPrice: "130.000₫",
    discount: "-50%",
    tag: "Bán",
    category: "History",
    image: "https://covers.openlibrary.org/b/isbn/9780313341960-L.jpg",
    type: "Sách cứng",
    condition: "88%",
    year: "Dài hạn",
    school: "ĐH KHXH & Nhân văn",
    faculty: "Khoa Lịch sử",
    subject: "Lịch sử Việt Nam",
  },
  {
    id: 11,
    title: "Data Science Handbook",
    author: "Jake VanderPlas",
    price: "210.000₫",
    originalPrice: "420.000₫",
    discount: "-50%",
    tag: "Bán",
    category: "Computer Science",
    image: "https://covers.openlibrary.org/b/isbn/9781491912058-L.jpg",
    type: "E-book",
    condition: "100%",
    year: "Dài hạn",
    school: "ĐH Công nghệ Thông tin",
    faculty: "Khoa Khoa học Dữ liệu",
    subject: "Nhập môn Khoa học Dữ liệu",
  },
  {
    id: 12,
    title: "Quản trị Kinh doanh",
    author: "Stephen P. Robbins",
    price: "175.000₫",
    originalPrice: "350.000₫",
    discount: "-50%",
    tag: "Thuê",
    category: "Business",
    image: "https://covers.openlibrary.org/b/isbn/9780133910292-L.jpg",
    type: "Sách cứng",
    condition: "90%",
    year: "Theo kỳ",
    school: "ĐH Kinh tế TP.HCM",
    faculty: "Khoa Quản trị",
    subject: "Quản trị kinh doanh",
  },
  {
    id: 13,
    title: "Hóa học hữu cơ nâng cao",
    author: "Jonathan Clayden",
    price: "245.000₫",
    originalPrice: "490.000₫",
    discount: "-50%",
    tag: "Bán",
    category: "Chemistry",
    image: "https://covers.openlibrary.org/b/isbn/9780199270293-L.jpg",
    type: "E-book",
    condition: "100%",
    year: "Theo kỳ",
    school: "ĐH Bách Khoa TP.HCM",
    faculty: "Khoa Kỹ thuật Hóa học",
    subject: "Hóa hữu cơ",
  },
  {
    id: 14,
    title: "Tâm lý học nhân cách",
    author: "Carl Rogers",
    price: "120.000₫",
    originalPrice: "240.000₫",
    discount: "-50%",
    tag: "Thuê",
    category: "Psychology",
    image: "https://covers.openlibrary.org/b/isbn/9780395755310-L.jpg",
    type: "Sách cứng",
    condition: "85%",
    year: "Theo kỳ",
    school: "ĐH KHXH & Nhân văn",
    faculty: "Khoa Tâm lý học",
    subject: "Tâm lý học đại cương",
  },
  {
    id: 15,
    title: "Cơ học chất lỏng",
    author: "Frank M. White",
    price: "200.000₫",
    originalPrice: "400.000₫",
    discount: "-50%",
    tag: "Bán",
    category: "Physics",
    image: "https://covers.openlibrary.org/b/isbn/9780073398273-L.jpg",
    type: "Sách cứng",
    condition: "93%",
    year: "Theo kỳ",
    school: "ĐH Bách Khoa TP.HCM",
    faculty: "Khoa Kỹ thuật Giao thông",
    subject: "Cơ học chất lỏng",
  },
  {
    id: 16,
    title: "Lập trình Web với React",
    author: "Kyle Simpson",
    price: "185.000₫",
    originalPrice: "370.000₫",
    discount: "-50%",
    tag: "Bán",
    category: "Computer Science",
    image: "https://covers.openlibrary.org/b/isbn/9781492051725-L.jpg",
    type: "E-book",
    condition: "100%",
    year: "Dài hạn",
    school: "ĐH Công nghệ Thông tin",
    faculty: "Khoa Kỹ thuật Phần mềm",
    subject: "Phát triển ứng dụng Web",
  },
];

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();

  const productId = Number(params.id);

  const product = products.find((p) => p.id === productId);

  const [paymentMethod, setPaymentMethod] = useState<
    "direct" | "cod"
  >("direct");

  const [quantity, setQuantity] = useState(1);

  const [isProcessing, setIsProcessing] = useState(false);

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">
            Không tìm thấy sản phẩm
          </h1>

          <Link
            href="/products"
            className="text-blue-600 font-semibold"
          >
            Quay lại sản phẩm
          </Link>
        </div>
      </main>
    );
  }

  const numericPrice = Number(
    product.price.replace(/\./g, "").replace("₫", "")
  );

  const subtotal = numericPrice * quantity;

  
  const total = subtotal ;

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      router.push("/orders");
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <HomeNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold text-sm mb-8 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại sản phẩm
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT */}
          <div className="lg:col-span-8 space-y-6">
            {/* Heading */}
            <div>
              <h1 className="text-4xl font-bold text-[#193967] mb-2">
                Thanh toán
              </h1>

              <p className="text-gray-500 font-medium">
                Hoàn tất thông tin để tiếp tục đặt hàng.
              </p>
            </div>

            {/* Shipping Info */}
            <section className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <MapPin className="h-5 w-5" />
                </div>

                <h2 className="text-xl font-bold text-[#193967]">
                  Thông tin giao hàng
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                    Họ và tên
                  </label>

                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

                    <input
                      type="text"
                      placeholder="Nguyễn Văn A"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                    Số điện thoại
                  </label>

                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

                    <input
                      type="tel"
                      placeholder="0912 345 678"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                    Địa chỉ nhận hàng
                  </label>

                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

                    <input
                      type="text"
                      placeholder="Nhập địa chỉ nhận hàng"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <CreditCard className="h-5 w-5" />
                </div>

                <h2 className="text-xl font-bold text-[#193967]">
                  Phương thức thanh toán
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Direct */}
                <button
                  onClick={() => setPaymentMethod("direct")}
                  className={`relative p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-3 ${
                    paymentMethod === "direct"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl ${
                      paymentMethod === "direct"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <Handshake className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="font-bold text-[#193967]">
                      Giao dịch trực tiếp
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Gặp mặt trao đổi sản phẩm
                    </p>
                  </div>

                  {paymentMethod === "direct" && (
                    <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-blue-600" />
                  )}
                </button>

                {/* COD */}
                <button
                  onClick={() => setPaymentMethod("cod")}
                  className={`relative p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-3 ${
                    paymentMethod === "cod"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl ${
                      paymentMethod === "cod"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <Truck className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="font-bold text-[#193967]">
                      COD
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Thanh toán khi nhận hàng
                    </p>
                  </div>

                  {paymentMethod === "cod" && (
                    <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-blue-600" />
                  )}
                </button>
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm sticky top-28">
              <h3 className="text-lg font-bold text-[#193967] mb-6">
                Đơn hàng của bạn
              </h3>

              {/* Product */}
              <div className="flex gap-4 pb-6 border-b border-gray-200">
                <div className="w-20 h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h4 className="font-bold text-[#193967] line-clamp-2">
                    {product.title}
                  </h4>

                  <p className="text-sm text-gray-400 mt-1">
                    {product.author}
                  </p>

                  <div
                    className={`inline-block mt-2 px-2 py-1 rounded-md text-xs font-bold text-white ${
                      product.tag === "Thuê"
                        ? "bg-orange-500"
                        : "bg-blue-600"
                    }`}
                  >
                    {product.tag}
                  </div>

                  <p className="text-lg font-bold text-blue-600 mt-3">
                    {numericPrice.toLocaleString("vi-VN")}₫
                  </p>
                </div>
              </div>

              {/* Quantity */}
              <div className="py-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#193967]">
                    Số lượng
                  </span>

                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() =>
                        setQuantity((prev) =>
                          prev > 1 ? prev - 1 : 1
                        )
                      }
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <div className="w-12 text-center font-bold">
                      {quantity}
                    </div>

                    <button
                      onClick={() =>
                        setQuantity((prev) => prev + 1)
                      }
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-3 my-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Tạm tính
                  </span>

                  <span className="font-bold text-[#193967]">
                    {subtotal.toLocaleString("vi-VN")}₫
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Phí dịch vụ
                  </span>

                  <span className="font-bold text-[#193967]">
                    Miễn phí
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 mb-6">
                <span className="font-bold text-[#193967]">
                  TỔNG CỘNG
                </span>

                <span className="text-2xl font-bold text-blue-600">
                  {total.toLocaleString("vi-VN")}₫
                </span>
              </div>

              {/* Submit */}
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className={`w-full py-3 rounded-lg text-white font-bold transition ${
                  isProcessing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isProcessing
                  ? "ĐANG XỬ LÝ..."
                  : "XÁC NHẬN THANH TOÁN"}
              </button>

              {/* Security */}
              <div className="mt-6 flex items-center gap-2 text-blue-600">
                <ShieldCheck className="h-4 w-4" />

                <span className="text-xs font-bold">
                  Thanh toán bảo mật cùng EduCart
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}