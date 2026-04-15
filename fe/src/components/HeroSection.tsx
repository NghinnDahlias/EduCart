"use client"; // Bắt buộc phải có dòng này khi dùng Framer Motion trong Next.js App Router

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
        
        {/* Cột trái: Text bay lên (Stagger effect) */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="md:w-1/2"
        >
          <motion.h1 
            className="text-5xl font-bold text-blue-900 leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            EduCart <br/>
            <span className="text-blue-600">Lan Toả Tri Thức.</span>
          </motion.h1>
          
          <motion.p 
            className="mt-6 text-lg text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Nền tảng trao đổi, mua bán sách và dụng cụ học tập lớn nhất dành cho sinh viên Bách Khoa.
          </motion.p>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-full font-semibold shadow-lg hover:bg-blue-700"
          >
            Khám phá ngay
          </motion.button>
        </motion.div>

        {/* Cột phải: Khối hình động (Floating effect) */}
        <motion.div 
          className="md:w-1/2 mt-10 md:mt-0 flex justify-center"
          animate={{ y: [0, -20, 0] }} // Hiệu ứng lơ lửng lên xuống
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          {/* Bạn có thể thay cái div này bằng 1 tấm ảnh 3D hoặc ảnh thật */}
          <div className="w-72 h-72 bg-gradient-to-tr from-blue-400 to-purple-400 rounded-3xl shadow-2xl transform rotate-6"></div>
        </motion.div>

      </div>
    </section>
  );
}