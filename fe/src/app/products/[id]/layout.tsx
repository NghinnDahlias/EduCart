import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  return buildPageMetadata({
    title: `Chi tiết sản phẩm #${id}`,
    description:
      "Xem chi tiết giáo trình, tài liệu số hoặc học liệu trên EduCart, bao gồm mô tả, giá bán, thông tin người bán và cảnh báo uy tín.",
    path: `/products/${id}`,
    keywords: ["chi tiết sản phẩm educart", "người bán giáo trình", "mua sách sinh viên"],
  });
}

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
