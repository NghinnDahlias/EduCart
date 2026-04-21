"use client";

import HomeNavbar from "@/components/HomeNavbar";
import HomeHeroSection from "@/components/HomeHeroSection";
import CategorySection from "@/components/CategorySection";
import ProductSection from "@/components/ProductSection";
import HomeFooter from "@/components/HomeFooter";

export default function Home() {
  return (
    <main className="bg-white">
      <HomeNavbar />
      <HomeHeroSection />
      <CategorySection />
      <ProductSection />
      <HomeFooter />
    </main>
  );
}
