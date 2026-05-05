"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Grid3x3, List, ChevronLeft, ChevronRight, Search } from "lucide-react";
import HomeNavbar from "@/components/HomeNavbar";
import HomeFooter from "@/components/HomeFooter";

const major_data: Record<string, Record<string, string[]>> = {
  "ĐH Bách Khoa TP.HCM": {
    "Khoa Khoa học & Kỹ thuật Máy tính": [
      "Khoa học Máy tính",
      "Ký thuật máy tính"
    ],
    "Khoa Khoa học Ứng dụng": ["All"],
    "All": []
  }
}; //tạm
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
const ITEMS_PER_PAGE = 15;
export default function ProductsPage() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
// TEMP (user đang chọn)
const [tempSchool, setTempSchool] = useState("");
const [tempFaculty, setTempFaculty] = useState("");
const [tempMajor, setTempMajor] = useState("");

// APPLIED (dùng để filter)
const [selectedSchool, setSelectedSchool] = useState("");
const [selectedFaculty, setSelectedFaculty] = useState("");
const [selectedMajor, setSelectedMajor] = useState("");

const schools = Object.keys(major_data);

const faculties =
  tempSchool ? Object.keys(major_data[tempSchool]) : [];

const majors =
  tempSchool && tempFaculty
    ? major_data[tempSchool][tempFaculty] || []
    : [];
    const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState(new Set<number>());
    const [selectedTypes, setSelectedTypes] = useState<string[]>(["Bán", "Thuê"]);
    const [minPriceInput, setMinPriceInput] = useState("");
const [maxPriceInput, setMaxPriceInput] = useState("");
    const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
const [condition, setCondition] = useState("");
const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const toggleFavorite = (productId: number) => {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(productId)) {
            newFavorites.delete(productId);
        } else {
            newFavorites.add(productId);
        }
        setFavorites(newFavorites);
    };

const filteredProducts = products.filter((p) => {
const matchSchool =
  !selectedSchool || p.school === selectedSchool;

const matchFaculty =
  !selectedFaculty || p.faculty === selectedFaculty;

const matchMajor =
  !selectedMajor || p.subject === selectedMajor;
  // TYPE (Bán / Thuê)
  const matchType = selectedTypes.includes(p.tag);

  // CATEGORY
  const matchCategory =
    selectedCategories.length === 0 ||
    selectedCategories.includes(p.type);

  // PRICE
  const priceNumber = parseInt(p.price.replace(/\D/g, ""));
  const matchPrice =
  priceNumber >= priceRange.min &&
  priceNumber <= priceRange.max;

  // CONDITION
  const percent = parseInt(p.condition) || 0;
  let matchCondition = true;

  if (condition === "Mới") matchCondition = percent >= 95;
  if (condition === "Tốt") matchCondition = percent >= 80 && percent < 95;
  if (condition === "Khá") matchCondition = percent >= 60 && percent < 80;

  return matchType &&
  matchCategory &&
  matchPrice &&
  matchCondition &&
  matchSchool &&
  matchFaculty &&
  matchMajor;
});
 // Pagination
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;
    const paginatedProducts = filteredProducts.slice(startIdx, endIdx);



  return (
    <main className="bg-gray-50 min-h-screen">
      <HomeNavbar />

 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pt-12">
                    {/* Breadcrumb with View Toggle */}
                    <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
                            <span>/</span>
                            <span className="text-gray-900 font-medium">Sản phẩm</span>
                        </div>

                        {/* View Mode Toggle */}
                        {/*<div className="flex gap-2">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`rounded-lg p-2 transition ${viewMode === "grid"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                    }`}
                            >
                                <Grid3x3 className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`rounded-lg p-2 transition ${viewMode === "list"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                    }`}
                            >
                                <List className="h-5 w-5" />
                            </button>
                        </div> */}
                    </div>
</div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ALERT */}
        <div className="bg-blue-50 text-blue-700 p-4 rounded-xl mb-6 text-sm">
          Mặc định trường "Trường" là trường bạn. Hãy chọn đúng để có kết quả chính xác.
        </div>

        {/* SELECT FILTER */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <select
  className="border p-2 rounded-lg"
  onChange={(e) => {
    setTempSchool(e.target.value);
    setTempFaculty("");
    setTempMajor("");
  }}
>
  <option value="">Chọn trường</option>
  {schools.map((s) => (
    <option key={s} value={s}>{s}</option>
  ))}
</select>
<select
  className="border p-2 rounded-lg"
  onChange={(e) => {
    setTempFaculty(e.target.value);
    setTempMajor("");
  }}
  disabled={!tempSchool}
>
  <option value="">Chọn khoa</option>
  {faculties.map((f) => (
    <option key={f} value={f}>{f}</option>
  ))}
</select>
          <select
  className="border p-2 rounded-lg"
  onChange={(e) => setTempMajor(e.target.value)}
  disabled={!tempFaculty}
>
  <option value="">Chọn ngành</option>
  {majors.map((m) => (
    <option key={m} value={m}>{m}</option>
  ))}
</select>
          <button onClick={() => {
    setSelectedSchool(tempSchool);
    setSelectedFaculty(tempFaculty);
    setSelectedMajor(tempMajor);
     setCurrentPage(1);
  }}
  className="bg-blue-600 text-white rounded-lg"
>
  Cập nhật
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">

          {/* SIDEBAR */}
          <div className="bg-white p-5 rounded-xl shadow-sm h-fit">

            {/* CATEGORY */}
            <h3 className="font-bold mb-3">Danh mục sản phẩm</h3>
            <div className="space-y-2">
              {["SÁCH CHUYÊN NGÀNH", "EBOOK", "SÁCH CỨNG", "CHEATSHEET","ĐỀ THI","DỤNG CỤ VẼ KỸ THUẬT", "BỘ KIT / BOARD MẠCH", "DỤNG CỤ CHUYÊN DỤNG"].map(i => (
  <label key={i} className="flex gap-2">
    <input
      type="checkbox"
      onChange={() => {
        setSelectedCategories(prev =>
          prev.includes(i)
            ? prev.filter(x => x !== i)
            : [...prev, i]
        );
      }}
    />
    {i}
  </label>
))}
            </div>

            {/* PRICE */}
{/* PRICE */}
            <h3 className="font-bold mt-6 mb-3">Khoảng giá</h3>
            <div className="flex gap-2 mb-2">
              <input 
                type="number"
                placeholder="Từ" 
                className="border p-2 w-1/2 rounded text-sm" 
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
              />
              <input 
                type="number"
                placeholder="Đến" 
                className="border p-2 w-1/2 rounded text-sm" 
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
              />
            </div>
            {/* Nút Áp dụng */}
            <button 
              onClick={() => {
                const min = minPriceInput ? parseInt(minPriceInput) : 0;
                const max = maxPriceInput ? parseInt(maxPriceInput) : Infinity;
                setPriceRange({ min, max });
                setCurrentPage(1); // Đưa về trang 1 sau khi lọc
              }}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm font-medium mt-1"
            >
              Áp dụng
            </button>
{/* CONDITION */}
            <h3 className="font-bold mt-6 mb-3">Độ mới tài liệu</h3>
            <div className="space-y-2 flex flex-col">
              <label className="cursor-pointer flex items-center gap-2">
                <input 
                  type="radio" 
                  name="cond" 
                  checked={condition === "Mới"}
                  onClick={() => setCondition(condition === "Mới" ? "" : "Mới")} 
                  readOnly
                /> Mới (95-100%)
              </label>

              <label className="cursor-pointer flex items-center gap-2">
                <input 
                  type="radio" 
                  name="cond" 
                  checked={condition === "Tốt"}
                  onClick={() => setCondition(condition === "Tốt" ? "" : "Tốt")} 
                  readOnly
                /> Tốt (80-95%)
              </label>

              <label className="cursor-pointer flex items-center gap-2">
                <input 
                  type="radio" 
                  name="cond" 
                  checked={condition === "Khá"}
                  onClick={() => setCondition(condition === "Khá" ? "" : "Khá")} 
                  readOnly
                /> Khá (60-80%)
              </label>
            </div>

            {/* TYPE */}
            <h3 className="font-bold mt-6 mb-3">Hình thức</h3>
            <div className="space-y-2">
              <label className="bg-blue-50 p-2 rounded flex items-center gap-2 cursor-pointer text-blue-700 font-medium">
                <input
                  type="checkbox" 
                  checked={selectedTypes.includes("Bán")}
                  onChange={() => {
                    setSelectedTypes(prev =>
                      prev.includes("Bán")
                        ? prev.filter(i => i !== "Bán")
                        : [...prev, "Bán"]
                    );
                  }}
                />
                Đang Bán
              </label>
              
              <label className="bg-orange-50 p-2 rounded flex items-center gap-2 cursor-pointer text-orange-700 font-medium">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes("Thuê")}
                  onChange={() => {
                    setSelectedTypes(prev =>
                      prev.includes("Thuê")
                        ? prev.filter(i => i !== "Thuê")
                        : [...prev, "Thuê"]
                    );
                  }}
                />
                Cho Thuê
              </label>
            </div>
          </div>

          {/* MAIN */}
          <div className="lg:col-span-3">

            {/* HEADER */}
            <div className="flex justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">Tất cả tài liệu</h2>
                <p className="text-sm text-gray-500">
                  Đang hiển thị {filteredProducts.length} kết quả
                </p>
              </div>

              <select className="border rounded p-2">
                <option>Mới nhất</option>
              </select>
            </div>

            {/* GRID */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProducts.map(p => (
                <div key={p.id} className="bg-white rounded-xl shadow-sm p-4 relative">

                  {/* TAG */}
                  <div className={`absolute top-2 left-2 text-xs px-2 py-1 rounded-full text-white 
                    ${p.tag === "Bán" ? "bg-blue-500" : "bg-orange-500"}`}>
                    {p.tag === "Bán" ? "BÁN" : "THUÊ"}
                  </div>

                  {/* IMAGE */}
                  <div className="h-32 bg-gray-200 rounded mb-4 flex items-center justify-center">
                    📘
                  </div>

                  {/* INFO */}
                  <p className="text-xs text-gray-500">{p.type}</p>
                  <h3 className="font-semibold">{p.title}</h3>

                  <p className="text-xs text-gray-500 mt-1">
                    {p.author} • {p.condition} • {p.year}
                  </p>

                  <p className="text-lg font-bold mt-2">
                    <p className="text-lg font-bold mt-2">
  {p.price}
</p>
                  </p>

                  {/* BUTTON */}
                  <button className={`w-full mt-3 py-2 rounded text-white flex items-center justify-center gap-2
                    ${p.tag === "Thuê" ? "bg-orange-500" : "bg-blue-600"}`}>
                    <ShoppingCart size={16} />
                    {p.tag === "Thuê" ? "Thuê ngay" : "Mua ngay"}
                  </button>

                  {/* FAVORITE */}
                  <button
                    onClick={() => toggleFavorite(p.id)}
                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow"
                  >
                    <Heart className={`h-4 w-4 ${favorites.has(p.id) ? "text-red-500 fill-red-500" : ""}`} />
                  </button>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            {/* Pagination */}
                            {totalPages > 0 && (
                                <div className="mt-8 flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="rounded-lg p-2 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`h-10 w-10 rounded-lg font-bold transition ${currentPage === page
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="rounded-lg p-2 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                            )}
          </div>
        </div>
      </div>

      {/* FLOAT BUTTON */}
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 text-white rounded-full text-xl shadow-lg">
        +
      </button>

      <HomeFooter />
    </main>
  );
}