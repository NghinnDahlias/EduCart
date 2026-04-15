"use client"; // Bắt buộc phải có vì dùng useState, useEffect

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  BookMarked,
  Scissors,
  Wrench,
  FileText,
  ChevronRight
} from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { Navbar } from "../components/Navbar";
import { LevelUpModal } from "../components/LevelUpModal";
import { AISmartFeed } from "../components/AISmartFeed";
import { useRouter } from "next/navigation"; // Đã đổi sang chuẩn Next.js

export default function Home() { // Nên dùng export default cho file page.tsx của Next.js
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [feedUpdated, setFeedUpdated] = useState(false);
  const router = useRouter(); // Đã đổi từ useNavigate sang useRouter

  // Show the Level Up modal after a short delay on mount
  useEffect(() => {
    const t = setTimeout(() => setShowModal(true), 1400);
    return () => clearTimeout(t);
  }, []);

  const handleAccept = () => {
    setShowModal(false);
    setFeedUpdated(true);
  };

  const handleDismiss = () => {
    setShowModal(false);
  };

  const universities = ["MIT", "Stanford", "Harvard", "UC Berkeley", "Yale", "HCMUT"];
  const majors = ["Computer Science", "Biology", "Engineering", "Business", "Psychology"];
  const subjects = ["Introduction to CS", "Calculus I", "Physics 101", "Organic Chemistry"];

  const categories = [
    { name: "Textbooks", icon: BookMarked, color: "bg-blue-50 text-blue-600" },
    { name: "Lab Coats", icon: Scissors, color: "bg-green-50 text-green-600" },
    { name: "Engineering Tools", icon: Wrench, color: "bg-orange-50 text-orange-600" },
    { name: "Old Exams", icon: FileText, color: "bg-purple-50 text-purple-600" },
  ];

  const trendingDeals = [
    {
      id: 1,
      title: "Calculus Early Transcendentals",
      author: "James Stewart",
      price: "$45",
      originalPrice: "$280",
      image: "https://images.unsplash.com/photo-1725869973689-425c74f79a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      seller: "Sarah M.",
      condition: "Like New"
    },
    {
      id: 2,
      title: "Introduction to Algorithms",
      author: "Cormen, Leiserson, Rivest",
      price: "$65",
      originalPrice: "$220",
      image: "https://images.unsplash.com/photo-1725870379722-37601a259154?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      seller: "John D.",
      condition: "Good"
    },
    {
      id: 3,
      title: "Organic Chemistry",
      author: "Paula Yurkanis Bruice",
      price: "$55",
      originalPrice: "$310",
      image: "https://images.unsplash.com/photo-1755621394647-25957e4ca958?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      seller: "Emily R.",
      condition: "Very Good"
    },
    {
      id: 4,
      title: "Campbell Biology",
      author: "Jane Reece",
      price: "$70",
      originalPrice: "$350",
      image: "https://images.unsplash.com/photo-1725869973689-425c74f79a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      seller: "Mike T.",
      condition: "Like New"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Level Up Modal */}
      <LevelUpModal
        show={showModal}
        onAccept={handleAccept}
        onDismiss={handleDismiss}
      />

      {/* Hero Section - Split Screen */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Headline + Illustration */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Pass Books,<br />
                Share Knowledge,<br />
                <span className="text-blue-600">Save Money</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Buy and sell textbooks, lab equipment, and study materials exclusively within your university community.
              </p>

              <div className="relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758525860449-fa3602fceb31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800"
                  alt="Students studying together"
                  className="rounded-2xl shadow-xl w-full h-80 object-cover"
                />
              </div>
            </motion.div>

            {/* Right: Advanced Search Bar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <Search className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900">Find Your Books</h2>
              </div>

              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm text-gray-600 mb-2">Select University</label>
                  <select
                    value={selectedUniversity}
                    onChange={(e) => setSelectedUniversity(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  >
                    <option value="">Choose your university...</option>
                    {universities.map((uni) => (
                      <option key={uni} value={uni}>{uni}</option>
                    ))}
                  </select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: selectedUniversity ? 1 : 0.5, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm text-gray-600 mb-2">Select Major</label>
                  <select
                    value={selectedMajor}
                    onChange={(e) => setSelectedMajor(e.target.value)}
                    disabled={!selectedUniversity}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Choose your major...</option>
                    {majors.map((major) => (
                      <option key={major} value={major}>{major}</option>
                    ))}
                  </select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: selectedMajor ? 1 : 0.5, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-sm text-gray-600 mb-2">Select Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    disabled={!selectedMajor}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Choose your subject...</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push("/marketplace")} // Đã đổi sang router.push
                  className="w-full mt-6 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
                >
                  <Search className="w-5 h-5" />
                  Search Books
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8">Browse by Category</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/marketplace")} // Đã đổi sang router.push
                  className="p-6 rounded-2xl border border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all group"
                >
                  <div className={`w-16 h-16 rounded-xl ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Smart Feed Section */}
      <AISmartFeed feedUpdated={feedUpdated} />

      {/* Trending Deals Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-semibold text-gray-900">Trending Deals</h2>
            <button
              onClick={() => router.push("/marketplace")} // Đã đổi sang router.push
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              View All
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {trendingDeals.map((deal, index) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="flex-shrink-0 w-72 bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all snap-start"
                >
                  <div className="relative h-48 bg-gray-100">
                    <ImageWithFallback
                      src={deal.image}
                      alt={deal.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {Math.round(((parseFloat(deal.originalPrice.slice(1)) - parseFloat(deal.price.slice(1))) / parseFloat(deal.originalPrice.slice(1))) * 100)}% OFF
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{deal.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{deal.author}</p>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl font-bold text-blue-600">{deal.price}</span>
                      <span className="text-sm text-gray-400 line-through">{deal.originalPrice}</span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500">Sold by</p>
                        <p className="text-sm font-medium text-gray-900">{deal.seller}</p>
                      </div>
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                        {deal.condition}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center z-50 group"
      >
        <Plus className="w-8 h-8" />
        <span className="absolute right-full mr-4 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Post an Item
        </span>
      </motion.button>
    </div>
  );
}