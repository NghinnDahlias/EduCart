"use client"; 

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Đổi sang framer-motion chuẩn
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Tag,
  GraduationCap,
  Brain,
  ShoppingCart,
  Info,
  Cpu,
  Star,
  TrendingUp,
  RotateCcw,
} from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";
import { useRouter } from "next/navigation"; // Đổi sang chuẩn Next.js

// ─── Types ────────────────────────────────────────────────────────────────────

type TxType = "TO BUY" | "TO RENT";

interface AiCard {
  id: number;
  title: string;
  subtitle: string;
  subjectTag: string;
  price: number;
  priceSuffix?: string;
  transactionType: TxType;
  condition: string;
  seller: string;
  matchPct: number;
  reason: string;
  image: string;
  isHot?: boolean;
}

// ─── Mock AI Feed Data ────────────────────────────────────────────────────────

const AI_CARDS: AiCard[] = [
  {
    id: 1,
    title: "Compiler Construction Textbook",
    subtitle: "Aho, Lam, Sethi & Ullman",
    subjectTag: "CO3005 – Compiler Principles",
    price: 38,
    transactionType: "TO BUY",
    condition: "Used – Like New",
    seller: "Minh Quan",
    matchPct: 97,
    reason: "Core subject in Year 3 IT curriculum. 12 students from your class viewed this.",
    image:
      "https://images.unsplash.com/photo-1484665739383-a1069a82d4be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    isHot: true,
  },
  {
    id: 2,
    title: "Database Systems – Ramakrishnan",
    subtitle: "Includes ERD & SQL slides bundle",
    subjectTag: "CO3021 – Database Systems",
    price: 22,
    priceSuffix: "/ Semester",
    transactionType: "TO RENT",
    condition: "New",
    seller: "Bao Linh",
    matchPct: 95,
    reason: "Rented by 8 Year-3 IT students this semester. Highly rated.",
    image:
      "https://images.unsplash.com/photo-1616861771635-49063a4636ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: 3,
    title: "Mechanical Keyboard – TKL 75%",
    subtitle: "Gateron Red switches, barely used",
    subjectTag: "Dev Tools & Peripherals",
    price: 55,
    transactionType: "TO BUY",
    condition: "Used – Good",
    seller: "Tuan Kiet",
    matchPct: 88,
    reason: "Popular among IT students coding all night. Saves your fingers for the long haul.",
    image:
      "https://images.unsplash.com/photo-1631755212332-32972fa247df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    isHot: true,
  },
  {
    id: 4,
    title: "Operating Systems: Three Easy Pieces",
    subtitle: "Arpaci-Dusseau – Photocopy Edition",
    subjectTag: "CO3026 – Operating Systems",
    price: 18,
    priceSuffix: "/ Semester",
    transactionType: "TO RENT",
    condition: "Used – Good",
    seller: "Phuoc An",
    matchPct: 93,
    reason: "Required reading for CO3026. Matches your upcoming semester schedule.",
    image:
      "https://images.unsplash.com/photo-1759836096305-b2e427f45506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: 5,
    title: "Algorithm Design – Kleinberg & Tardos",
    subtitle: "1st Edition, annotated with notes",
    subjectTag: "CO2013 – Algorithm Design",
    price: 42,
    transactionType: "TO BUY",
    condition: "Used – Like New",
    seller: "Ngoc Tram",
    matchPct: 90,
    reason: "You clicked similar algorithm books recently. Seller is verified HCMUT student.",
    image:
      "https://images.unsplash.com/photo-1759661990336-51bd4b951fea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: 6,
    title: "Computer Networks – Tanenbaum",
    subtitle: "5th Edition – includes practice problems",
    subjectTag: "CO3094 – Computer Networks",
    price: 28,
    transactionType: "TO BUY",
    condition: "New",
    seller: "Viet Hoang",
    matchPct: 86,
    reason: "Frequently bought together with OS textbook by Year-3 IT students.",
    image:
      "https://images.unsplash.com/photo-1759836096305-b2e427f45506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
];

// ─── Match Bar ────────────────────────────────────────────────────────────────

function MatchBar({ pct }: { pct: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />
      </div>
      <span className="text-xs font-bold text-blue-600 w-10 text-right">{pct}%</span>
    </div>
  );
}

// ─── Why This Tooltip ─────────────────────────────────────────────────────────

function WhyThis({ reason }: { reason: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500 transition-colors"
      >
        <Info className="w-3.5 h-3.5" />
        Why this?
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 mb-2 z-30 w-52 bg-gray-900 text-white text-xs rounded-xl px-3 py-2.5 shadow-xl leading-relaxed"
          >
            <div className="flex items-start gap-1.5">
              <Brain className="w-3 h-3 text-blue-400 flex-shrink-0 mt-0.5" />
              <span>{reason}</span>
            </div>
            <div className="absolute top-full left-4 w-2 h-2 bg-gray-900 rotate-45 -translate-y-1" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── AI Product Card ──────────────────────────────────────────────────────────

function AICard({ card, index }: { card: AiCard; index: number }) {
  const router = useRouter(); // Đã đổi sang useRouter() của Next.js

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(59,130,246,0.15)" }}
      className="flex-shrink-0 w-64 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer flex flex-col snap-start transition-shadow"
      onClick={() => router.push("/marketplace")} // Đã đổi từ navigate sang router.push
    >
      {/* Image */}
      <div className="relative h-40 bg-gray-100 overflow-hidden">
        <ImageWithFallback
          src={card.image}
          alt={card.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

        {/* AI PICK badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg">
          <Sparkles className="w-3 h-3" />
          AI PICK
        </div>

        {/* Hot badge */}
        {card.isHot && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            <TrendingUp className="w-3 h-3" />
            Hot
          </div>
        )}

        {/* Tx type badge bottom */}
        <div className="absolute bottom-2.5 left-2.5">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
              card.transactionType === "TO BUY"
                ? "bg-emerald-500/90 text-white"
                : "bg-amber-500/90 text-white"
            }`}
          >
            {card.transactionType === "TO BUY" ? (
              <ShoppingBag className="w-3 h-3" />
            ) : (
              <Tag className="w-3 h-3" />
            )}
            {card.transactionType}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Subject tag */}
        <div className="flex items-center gap-1.5 mb-2">
          <GraduationCap className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
          <span className="text-xs text-blue-600 font-medium line-clamp-1">{card.subjectTag}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">
          {card.title}
        </h3>
        <p className="text-xs text-gray-400 mb-3 line-clamp-1">{card.subtitle}</p>

        {/* Match % */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400" />
              Match for you
            </span>
          </div>
          <MatchBar pct={card.matchPct} />
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-3" />

        {/* Price + Seller */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-lg font-bold text-blue-600">${card.price}</span>
            {card.priceSuffix && (
              <span className="text-xs text-gray-400 ml-1">{card.priceSuffix}</span>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">by</p>
            <p className="text-xs font-semibold text-gray-700">{card.seller}</p>
          </div>
        </div>

        {/* Condition */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {card.condition}
          </span>
          <WhyThis reason={card.reason} />
        </div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={(e) => { e.stopPropagation(); router.push("/cart"); }} // Đổi từ navigate sang router.push
          className="mt-3 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm shadow-blue-600/20"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── AI Smart Feed Section ────────────────────────────────────────────────────

interface AISmartFeedProps {
  feedUpdated: boolean;
}

export function AISmartFeed({ feedUpdated }: AISmartFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter(); // Đã đổi sang useRouter() của Next.js

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 pointer-events-none" />
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                            radial-gradient(circle at 80% 20%, white 1px, transparent 1px),
                            radial-gradient(circle at 60% 80%, white 1px, transparent 1px)`,
          backgroundSize: "60px 60px, 80px 80px, 50px 50px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            {/* AI badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white border border-white/20 px-3 py-1.5 rounded-full text-xs font-bold mb-3"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <Cpu className="w-3.5 h-3.5" />
              </motion.div>
              Powered by EduCart AI
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-1.5 h-1.5 bg-green-400 rounded-full"
              />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold text-white flex items-center gap-2 flex-wrap"
            >
              <Sparkles className="w-7 h-7 text-yellow-300" />
              Recommended for you
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-blue-100 text-sm mt-1.5 flex items-center gap-1.5"
            >
              <Brain className="w-4 h-4" />
              Based on your major &amp; recent clicks
            </motion.p>
          </div>

          <button
            onClick={() => router.push("/marketplace")} // Đã đổi từ navigate sang router.push
            className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors text-sm font-medium flex-shrink-0"
          >
            See All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Feed Updated Banner */}
        <AnimatePresence>
          {feedUpdated && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mb-5"
            >
              <div className="flex items-center gap-2.5 bg-white/15 backdrop-blur-sm border border-white/20 text-white px-4 py-3 rounded-xl">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <RotateCcw className="w-4 h-4 text-green-300" />
                </motion.div>
                <span className="text-sm font-medium">
                  ✨ Your feed has been updated with{" "}
                  <strong>Year 3 Information Technology</strong> materials just for you.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Carousel */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/95 rounded-full shadow-lg items-center justify-center hover:bg-white transition-all hover:scale-110 text-gray-700"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Scrollable container */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {AI_CARDS.map((card, i) => (
              <AICard key={card.id} card={card} index={i} />
            ))}

            {/* See More card */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex-shrink-0 w-64 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/20 transition-all snap-start"
              onClick={() => router.push("/marketplace")} // Đã đổi từ navigate sang router.push
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <ChevronRight className="w-7 h-7 text-white" />
              </div>
              <p className="text-white font-semibold text-sm text-center px-4">
                View all IT recommendations
              </p>
              <p className="text-blue-200 text-xs mt-1.5 text-center px-4">
                +40 more items tailored for you
              </p>
            </motion.div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/95 rounded-full shadow-lg items-center justify-center hover:bg-white transition-all hover:scale-110 text-gray-700"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Scroll hint dots */}
        <div className="flex justify-center gap-1.5 mt-5">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === 0 ? "w-6 bg-white" : "w-1.5 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}