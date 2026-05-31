import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Khám phá giáo trình, tài liệu số và đồ dùng học tập",
  description:
    "Tìm kiếm sách giáo trình, tài liệu số, flashcard, đồ dùng học tập và học liệu campus trên EduCart với bộ lọc theo trường, khoa và môn học.",
  path: "/products",
  keywords: ["danh sách sản phẩm sinh viên", "giáo trình đại học", "tài liệu số"],
});

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
