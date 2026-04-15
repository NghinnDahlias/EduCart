"use client"; // Bắt buộc phải có

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  MessageCircle,
  Plus,
  Search,
  X,
  ChevronDown,
  MapPin,
  GraduationCap,
  Star
} from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { Navbar } from "../components/Navbar";
import { useRouter } from "next/navigation"; // Đã đổi sang chuẩn Next.js

// ─── Types ────────────────────────────────────────────────────────────────────

type TransactionType = "FOR SALE" | "FOR RENT";
type Condition = "New" | "90%" | "Old";
type Location = "Campus A" | "Campus B" | "COD";

interface Product {
  id: number;
  title: string;
  subjectTag: string;
  transactionType: TransactionType;
  condition: Condition;
  price: number;
  priceSuffix?: string;
  image: string;
  sellerName: string;
  sellerAvatar: string;
  university: string;
  meetupLocation: Location;
  rating: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  {
    id: 1,
    title: "Calculus Textbook – 90% New",
    subjectTag: "Calculus 101",
    transactionType: "FOR SALE",
    condition: "90%",
    price: 45,
    image: "https://images.unsplash.com/photo-1754304342447-82dabf632a8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    sellerName: "Minh Tuan",
    sellerAvatar: "MT",
    university: "HCMUT Student",
    meetupLocation: "Campus A",
    rating: 4.8,
  },
  {
    id: 2,
    title: "Lab Coat – Large Size, Barely Used",
    subjectTag: "Chemistry Lab",
    transactionType: "FOR RENT",
    condition: "New",
    price: 15,
    priceSuffix: "/ Semester",
    image: "https://images.unsplash.com/photo-1581093449818-2655b2467fd6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    sellerName: "Phuong Linh",
    sellerAvatar: "PL",
    university: "HCMUT Student",
    meetupLocation: "Campus B",
    rating: 4.5,
  },
  {
    id: 3,
    title: "Engineering Drawing Kit – Full Set",
    subjectTag: "Civil Engineering 201",
    transactionType: "FOR SALE",
    condition: "90%",
    price: 30,
    image: "https://images.unsplash.com/photo-1760030428004-60a033044f81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    sellerName: "Duc Anh",
    sellerAvatar: "DA",
    university: "HCMUT Student",
    meetupLocation: "Campus A",
    rating: 4.9,
  },
  {
    id: 4,
    title: "Campbell Biology – 12th Edition",
    subjectTag: "Biology 101",
    transactionType: "FOR SALE",
    condition: "New",
    price: 65,
    image: "https://images.unsplash.com/photo-1740477959003-0df934b7e81e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    sellerName: "Bao Chau",
    sellerAvatar: "BC",
    university: "HCMUT Student",
    meetupLocation: "COD",
    rating: 5.0,
  },
  {
    id: 5,
    title: "Halliday Physics – Volumes I & II",
    subjectTag: "Physics 102",
    transactionType: "FOR RENT",
    condition: "Old",
    price: 20,
    priceSuffix: "/ Semester",
    image: "https://images.unsplash.com/photo-1758685848174-e061c6486651?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    sellerName: "Thanh Ha",
    sellerAvatar: "TH",
    university: "HCMUT Student",
    meetupLocation: "Campus A",
    rating: 4.2,
  },
  {
    id: 6,
    title: "TI-84 Plus Graphing Calculator",
    subjectTag: "Math 101",
    transactionType: "FOR SALE",
    condition: "90%",
    price: 55,
    image: "https://images.unsplash.com/photo-1737919144176-cb279b56ce6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    sellerName: "Quoc Huy",
    sellerAvatar: "QH",
    university: "HCMUT Student",
    meetupLocation: "Campus B",
    rating: 4.7,
  },
  {
    id: 7,
    title: "Old Exam Papers Bundle – 3 Years",
    subjectTag: "Various Subjects",
    transactionType: "FOR SALE",
    condition: "Old",
    price: 10,
    image: "https://images.unsplash.com/photo-1588713444222-408f6d537ca3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    sellerName: "Ngoc Mai",
    sellerAvatar: "NM",
    university: "HCMUT Student",
    meetupLocation: "COD",
    rating: 4.4,
  },
  {
    id: 8,
    title: "Organic Chemistry – Clayden Edition",
    subjectTag: "Chemistry 201",
    transactionType: "FOR RENT",
    condition: "New",
    price: 25,
    priceSuffix: "/ Semester",
    image: "https://images.unsplash.com/photo-1616458964840-5108e4d3adb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    sellerName: "Thu Trang",
    sellerAvatar: "TT",
    university: "HCMUT Student",
    meetupLocation: "Campus A",
    rating: 4.6,
  },
  {
    id: 9,
    title: "Introduction to C++ Programming",
    subjectTag: "CS 101",
    transactionType: "FOR SALE",
    condition: "90%",
    price: 35,
    image: "https://images.unsplash.com/photo-1754304342447-82dabf632a8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    sellerName: "Van Long",
    sellerAvatar: "VL",
    university: "HCMUT Student",
    meetupLocation: "Campus B",
    rating: 4.3,
  },
];

// ─── Avatar colours ───────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-blue-500", "bg-purple-500", "bg-green-500", "bg-orange-500",
  "bg-pink-500", "bg-teal-500", "bg-indigo-500", "bg-rose-500", "bg-amber-500",
];

// ─── FilterCheckbox ───────────────────────────────────────────────────────────

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div
        onClick={() => onChange(!checked)}
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
          checked
            ? "bg-blue-600 border-blue-600"
            : "border-gray-300 group-hover:border-blue-400"
        }`}
      >
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{label}</span>
    </label>
  );
}

// ─── FilterSection ────────────────────────────────────────────────────────────

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between mb-3 group"
      >
        <span className="text-sm font-semibold text-gray-800 uppercase tracking-wider">{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── ProductCard ──────────────────────────────────────────────────────────────

function ProductCard({ product, index }: { product: Product; index: number }) {
  const isRent = product.transactionType === "FOR RENT";
  const avatarColor = AVATAR_COLORS[product.id % AVATAR_COLORS.length];
  const router = useRouter(); // Đã đổi sang chuẩn Next.js

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      layout
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-shadow flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <ImageWithFallback
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />

        {/* Transaction Badge */}
        <div
          className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-md ${
            isRent
              ? "bg-amber-400 text-amber-900"
              : "bg-emerald-500 text-white"
          }`}
        >
          {product.transactionType}
        </div>

        {/* Condition Tag */}
        <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 shadow">
          {product.condition}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Subject Tag */}
        <div className="mb-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
            <GraduationCap className="w-3 h-3" />
            {product.subjectTag}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 flex-1">{product.title}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs text-gray-500">{product.rating.toFixed(1)}</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-2xl font-bold text-blue-600">${product.price}</span>
          {product.priceSuffix && (
            <span className="text-sm text-gray-400">{product.priceSuffix}</span>
          )}
        </div>

        {/* Separator */}
        <div className="border-t border-gray-100 pt-3 mt-auto">
          {/* Seller Info */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                {product.sellerAvatar}
              </div>
              <div>
                <p className="text-xs font-medium text-gray-900 leading-tight">{product.sellerName}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <GraduationCap className="w-3 h-3 text-blue-600" />
                  <span className="text-xs text-blue-600 font-medium">{product.university}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin className="w-3 h-3" />
              <span>{product.meetupLocation}</span>
            </div>
          </div>

          {/* Chat Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/chat")} // Đã đổi sang router.push
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2 transition-colors shadow shadow-blue-600/20"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Chat to Deal</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

// Thêm default để Next.js nhận diện file page.tsx
export default function ProductListing() {
  // Filter state
  const [conditionFilters, setConditionFilters] = useState<Set<Condition>>(new Set());
  const [transactionFilters, setTransactionFilters] = useState<Set<TransactionType>>(new Set());
  const [locationFilters, setLocationFilters] = useState<Set<Location>>(new Set());
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Toggle helpers
  function toggleCondition(c: Condition) {
    setConditionFilters((prev) => {
      const next = new Set(prev);
      next.has(c) ? next.delete(c) : next.add(c);
      return next;
    });
  }
  function toggleTransaction(t: TransactionType) {
    setTransactionFilters((prev) => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });
  }
  function toggleLocation(l: Location) {
    setLocationFilters((prev) => {
      const next = new Set(prev);
      next.has(l) ? next.delete(l) : next.add(l);
      return next;
    });
  }

  const activeFilterCount =
    conditionFilters.size + transactionFilters.size + locationFilters.size +
    (priceMin ? 1 : 0) + (priceMax ? 1 : 0);

  function clearAll() {
    setConditionFilters(new Set());
    setTransactionFilters(new Set());
    setLocationFilters(new Set());
    setPriceMin("");
    setPriceMax("");
  }

  // Filtered & sorted products
  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (conditionFilters.size > 0 && !conditionFilters.has(p.condition)) return false;
      if (transactionFilters.size > 0 && !transactionFilters.has(p.transactionType)) return false;
      if (locationFilters.size > 0 && !locationFilters.has(p.meetupLocation)) return false;
      if (priceMin && p.price < parseFloat(priceMin)) return false;
      if (priceMax && p.price > parseFloat(priceMax)) return false;
      if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !p.subjectTag.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });

    if (sortBy === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [conditionFilters, transactionFilters, locationFilters, priceMin, priceMax, searchQuery, sortBy]);

  // ── Sidebar content (reused on desktop + mobile drawer) ──
  const SidebarContent = () => (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-gray-900">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button onClick={clearAll} className="text-xs text-blue-600 hover:underline">
            Clear all
          </button>
        )}
      </div>

      {/* Condition */}
      <FilterSection title="Condition">
        {(["New", "90%", "Old"] as Condition[]).map((c) => (
          <FilterCheckbox
            key={c}
            label={c === "90%" ? "90% (Like New)" : c}
            checked={conditionFilters.has(c)}
            onChange={() => toggleCondition(c)}
          />
        ))}
      </FilterSection>

      {/* Transaction Type */}
      <FilterSection title="Transaction Type">
        {([["FOR SALE", "Buy / Purchase"], ["FOR RENT", "Rent"]] as [TransactionType, string][]).map(([val, label]) => (
          <FilterCheckbox
            key={val}
            label={label}
            checked={transactionFilters.has(val)}
            onChange={() => toggleTransaction(val)}
          />
        ))}
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range ($)">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="text-gray-400 text-sm flex-shrink-0">–</span>
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {/* Quick price presets */}
        <div className="flex flex-wrap gap-2 mt-1">
          {[["<$20", "", "20"], ["$20–50", "20", "50"], [">$50", "50", ""]].map(([label, min, max]) => (
            <button
              key={label}
              onClick={() => { setPriceMin(min); setPriceMax(max); }}
              className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                priceMin === min && priceMax === max
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-200 text-gray-600 hover:border-blue-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Meetup Location */}
      <FilterSection title="Meetup Location">
        {(["Campus A", "Campus B", "COD"] as Location[]).map((loc) => (
          <FilterCheckbox
            key={loc}
            label={loc === "COD" ? "COD (Cash on Delivery)" : loc}
            checked={locationFilters.has(loc)}
            onChange={() => toggleLocation(loc)}
          />
        ))}
      </FilterSection>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {filtered.length} items found
              </p>
            </div>

            {/* Search + Sort row */}
            <div className="flex items-center gap-3 flex-1 sm:max-w-xl">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search textbooks, tools…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="rating">Top Rated</option>
              </select>

              {/* Mobile filter button */}
              <button
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm relative"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-400 text-gray-900 text-xs rounded-full flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active filter chips */}
      <AnimatePresence>
        {activeFilterCount > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500">Active:</span>
              {[...conditionFilters].map((f) => (
                <button key={f} onClick={() => toggleCondition(f)}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs hover:bg-blue-100 transition-colors">
                  {f} <X className="w-3 h-3" />
                </button>
              ))}
              {[...transactionFilters].map((f) => (
                <button key={f} onClick={() => toggleTransaction(f)}
                  className="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs hover:bg-amber-100 transition-colors">
                  {f} <X className="w-3 h-3" />
                </button>
              ))}
              {[...locationFilters].map((f) => (
                <button key={f} onClick={() => toggleLocation(f)}
                  className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs hover:bg-green-100 transition-colors">
                  {f} <X className="w-3 h-3" />
                </button>
              ))}
              {(priceMin || priceMax) && (
                <button onClick={() => { setPriceMin(""); setPriceMax(""); }}
                  className="flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs hover:bg-purple-100 transition-colors">
                  ${priceMin || "0"} – ${priceMax || "∞"} <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Body: Sidebar + Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">

          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <SidebarContent />
            </div>
          </aside>

          {/* ── Product Grid ── */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-24 text-center"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="font-semibold text-gray-700 mb-1">No items found</h3>
                  <p className="text-sm text-gray-400 mb-4">Try adjusting or clearing your filters</p>
                  <button
                    onClick={clearAll}
                    className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                >
                  {filtered.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* ── Mobile Sidebar Drawer ── */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 p-6 overflow-y-auto shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-semibold text-gray-900">Filters</span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <SidebarContent />
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="w-full mt-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Show {filtered.length} Results
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Post Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center z-30 group"
      >
        <Plus className="w-8 h-8" />
        <span className="absolute right-full mr-4 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Post an Item
        </span>
      </motion.button>
    </div>
  );
}