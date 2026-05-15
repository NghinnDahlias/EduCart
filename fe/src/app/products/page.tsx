"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import HomeNavbar from "@/components/HomeNavbar";
import HomeFooter from "@/components/HomeFooter";
import { api } from "@/lib/api";

interface ApiProduct {
  ProductID: number; Title: string; Author: string; Price: number;
  OriginalPrice: number | null; DiscountLabel: string | null; RentalPrice: number | null;
  Condition: number | null; IsForRent: boolean; Status: string; Rating: number | null;
  ReviewsCount: number; ThumbnailURL: string | null; SellerName: string;
  Category: string | null; Format: string | null; TermLabel: string | null; Stock: number;
}
interface ApiUniversity { UniversityID: number; UName: string; }
interface ApiFaculty { FacultyID: number; FacultyName: string; }
interface ApiSubject { SubjectID: number; SubjectCode: string; SubjectName: string; }
const ITEMS_PER_PAGE = 15;

function fmtVND(n: number | null | undefined): string {
  if (n == null) return "";
  return n.toLocaleString("vi-VN") + "₫";
}

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // API data
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [universities, setUniversities] = useState<ApiUniversity[]>([]);
  const [faculties, setFaculties] = useState<ApiFaculty[]>([]);
  const [subjects, setSubjects] = useState<ApiSubject[]>([]);

  // Filters
  const [tempUniversityId, setTempUniversityId] = useState<number | "">("");
  const [tempFacultyId, setTempFacultyId] = useState<number | "">("");
  const [tempSubjectId, setTempSubjectId] = useState<number | "">("");
  const [appliedUniversityId, setAppliedUniversityId] = useState<number | "">("");
  const [appliedFacultyId, setAppliedFacultyId] = useState<number | "">("");
  const [appliedSubjectId, setAppliedSubjectId] = useState<number | "">("");

  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState(new Set<number>());
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["Bán", "Thuê"]);
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [condition, setCondition] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Load universities on mount
  useEffect(() => {
    api.get<{ ok: boolean; universities: ApiUniversity[] }>("/universities")
      .then(d => setUniversities(d.universities))
      .catch(() => {});
  }, []);

  // Load faculties when university changes
  useEffect(() => {
    if (!tempUniversityId) { setFaculties([]); setSubjects([]); return; }
    api.get<{ ok: boolean; faculties: ApiFaculty[] }>(`/universities/${tempUniversityId}/faculties`)
      .then(d => setFaculties(d.faculties))
      .catch(() => setFaculties([]));
    setTempFacultyId("");
    setTempSubjectId("");
    setSubjects([]);
  }, [tempUniversityId]);

  // Load subjects when faculty changes
  useEffect(() => {
    if (!tempFacultyId) { setSubjects([]); return; }
    api.get<{ ok: boolean; subjects: ApiSubject[] }>(`/faculties/${tempFacultyId}/subjects`)
      .then(d => setSubjects(d.subjects))
      .catch(() => setSubjects([]));
    setTempSubjectId("");
  }, [tempFacultyId]);

  // Fetch products from API whenever applied filters or page changes
  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(currentPage));
    params.set("limit", String(ITEMS_PER_PAGE));
    if (appliedUniversityId) params.set("universityId", String(appliedUniversityId));
    if (appliedFacultyId)    params.set("facultyId",    String(appliedFacultyId));
    if (appliedSubjectId)    params.set("subjectId",    String(appliedSubjectId));
    // forRent filter based on selectedTypes
    if (!selectedTypes.includes("Bán") && selectedTypes.includes("Thuê"))  params.set("forRent", "true");
    if (selectedTypes.includes("Bán")  && !selectedTypes.includes("Thuê")) params.set("forRent", "false");
    api.get<{ ok: boolean; products: ApiProduct[]; total: number }>(`/products?${params}`)
      .then(d => { setApiProducts(d.products); setTotal(d.total); })
      .catch(() => setApiProducts([]))
      .finally(() => setIsLoading(false));
  }, [currentPage, appliedUniversityId, appliedFacultyId, appliedSubjectId, selectedTypes]);

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(productId) ? next.delete(productId) : next.add(productId);
      return next;
    });
  };

  // Client-side secondary filters (price, condition, category)
  const filteredProducts = apiProducts.filter((p) => {
    const price = p.IsForRent ? (p.RentalPrice ?? p.Price ?? 0) : (p.Price ?? 0);
    const matchPrice = price >= priceRange.min && price <= priceRange.max;
    const cond = p.Condition ?? 0;
    let matchCondition = true;
    if (condition === "Mới") matchCondition = cond >= 95;
    if (condition === "Tốt") matchCondition = cond >= 80 && cond < 95;
    if (condition === "Khá") matchCondition = cond >= 60 && cond < 80;
    const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, "").replace(/-/g, "");
    const matchCategory = selectedCategories.length === 0 ||
      selectedCategories.some(cat => normalize(cat) === normalize(p.Format ?? ""));
    return matchPrice && matchCondition && matchCategory;
  });

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts;
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
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* ALERT */}
        <div className="bg-blue-50 text-blue-700 p-4 rounded-xl mb-6 text-sm">
          Mặc định trường "Trường" là trường bạn. Hãy chọn đúng để có kết quả chính xác.
        </div>

        {/* SELECT FILTER */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <select className="border p-2 rounded-lg"
            value={tempUniversityId}
            onChange={(e) => {
              setTempUniversityId(e.target.value ? Number(e.target.value) : "");
              setTempFacultyId("");
              setTempSubjectId("");
            }}>
            <option value="">Chọn trường</option>
            {universities.map((u) => (
              <option key={u.UniversityID} value={u.UniversityID}>{u.UName}</option>
            ))}
          </select>
          <select className="border p-2 rounded-lg"
            value={tempFacultyId}
            onChange={(e) => {
              setTempFacultyId(e.target.value ? Number(e.target.value) : "");
              setTempSubjectId("");
            }}
            disabled={!tempUniversityId}>
            <option value="">Chọn khoa</option>
            {faculties.map((f) => (
              <option key={f.FacultyID} value={f.FacultyID}>{f.FacultyName}</option>
            ))}
          </select>
          <select className="border p-2 rounded-lg"
            value={tempSubjectId}
            onChange={(e) => setTempSubjectId(e.target.value ? Number(e.target.value) : "")}
            disabled={!tempFacultyId}>
            <option value="">Chọn môn</option>
            {subjects.map((s) => (
              <option key={s.SubjectID} value={s.SubjectID}>{s.SubjectName}</option>
            ))}
          </select>
          <button onClick={() => {
            setAppliedUniversityId(tempUniversityId);
            setAppliedFacultyId(tempFacultyId);
            setAppliedSubjectId(tempSubjectId);
            setCurrentPage(1);
          }}
          className="bg-blue-600 text-white rounded-lg">
            Cập nhật
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* SIDEBAR */}
          <div className="bg-white p-5 rounded-xl shadow-sm h-fit">

            {/* CATEGORY */}
            <h3 className="font-bold mb-3">Danh mục sản phẩm</h3>
            <div className="space-y-2">
              {["SÁCH CHUYÊN NGÀNH", "E-BOOK", "SÁCH CỨNG", "CHEATSHEET","ĐỀ THI","DỤNG CỤ VẼ KỸ THUẬT", "BỘ KIT / BOARD MẠCH", "DỤNG CỤ CHUYÊN DỤNG"].map(i => (
              <label key={i} className="flex gap-2">
                <input
                  type="checkbox"
                  onChange={() => {
                    setSelectedCategories(prev =>
                    prev.includes(i)? prev.filter(x => x !== i) : [...prev, i]
                    );
                    setCurrentPage(1);
                  }}
              />
              {i}
              </label>
              ))}
            </div>

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
            {isLoading ? (
              <div className="lg:col-span-3 flex justify-center py-16 text-gray-400">Đang tải...</div>
            ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProducts.map((product) => (
                <Link
                  key={product.ProductID}
                  href={`/products/${product.ProductID}`}
                  className={
                  viewMode === "grid"
                    ? "group flex flex-col h-full rounded-2xl bg-white p-4 shadow-sm hover:shadow-lg transition"
                    : "flex gap-4 rounded-2xl bg-white p-4 shadow-sm hover:shadow-lg transition"
                    }>
                    {/* Image */}
                    <div className={viewMode === "grid"
                      ? "relative mb-4 overflow-hidden rounded-xl bg-gray-200 h-40 w-full"
                       : "relative overflow-hidden rounded-xl bg-gray-200 h-40 w-40 flex-shrink-0"
                        }>
                      <img src={product.ThumbnailURL ?? ""} alt={product.Title}
                        className="h-full w-full object-cover group-hover:scale-110 transition"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent && !parent.querySelector(".cover-fallback")) {
                              const fallback = document.createElement("div");
                              fallback.className = "cover-fallback h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200";
                              fallback.innerHTML = `<span style="font-size:2.5rem;font-weight:700;color:#3b5bdb;opacity:0.5;">${product.Title.charAt(0)}</span>`;
                              parent.appendChild(fallback);
                            }
                          }}/>
                      {/* Tag */}
                      <div className="absolute right-2 top-2">
                        <div className="rounded-md bg-orange-500 px-2 py-1 text-xs font-bold text-white">
                          {product.IsForRent ? "Thuê" : "Bán"}
                        </div>
                      </div>
                      {/* Wishlist Button */}
                      <button onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(product.ProductID);
                        }}
                        className="absolute left-2 top-2 rounded-full bg-white p-2 shadow-md hover:bg-gray-100 transition"
                      >
                        <Heart className={`h-4 w-4 transition ${favorites.has(product.ProductID)
                        ? "fill-red-500 text-red-500": "text-gray-400" }`}
                      />
                      </button>
                    </div>
                    {/* Product Info */}
                    <div className={viewMode === "grid" ? "flex flex-col flex-1" : "flex-1"}>
                      <div className={viewMode === "list" ? "" : "mb-4 flex-1"}>
                        <p className="text-xs text-gray-500 font-medium">{product.Format}</p>
                          <h3 className="mt-1 font-semibold text-gray-900 line-clamp-2">
                            {product.Title}
                          </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {product.Condition != null ? `${product.Condition}%` : ""} {product.TermLabel ? `• ${product.TermLabel}` : ""}
                        </p>
                        <p className="mt-1 text-xs text-gray-600">{product.Author}</p>
                      </div>
                      {/* Price and Buy Button */}
                      <div className="flex flex-col gap-3">
                        {/* Price */}
                        <div>
                          <div className="flex items-baseline gap-2">
                            <p className="text-lg font-bold text-blue-600">
                              {fmtVND(product.IsForRent ? product.RentalPrice : product.Price)}
                            </p>
                            {product.OriginalPrice != null && (
                              <p className="text-xs text-gray-500 line-through">
                                {fmtVND(product.OriginalPrice)}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Buy Button */}
                          {viewMode === "grid" && (
                            <button onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 transition flex items-center justify-center gap-2"
                            >
                              <ShoppingCart className="h-4 w-4" />
                                Mua ngay
                            </button>
                          )}
                      </div>

                      {/* Buy Button for List View */}
                      {viewMode === "list" && (
                        <button onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          }}
                          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white hover:bg-blue-700 transition flex items-center justify-center gap-2 h-fit"
                        >
                          <ShoppingCart className="h-4 w-4" />
                            Mua ngay
                          </button>
                        )}
                    </div>
                  </Link>
              ))}
            </div>
            )}

            {/* PAGINATION */}
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