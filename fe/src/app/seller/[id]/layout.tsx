import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  return buildPageMetadata({
    title: `Hồ sơ người bán #${id}`,
    description:
      "Theo dõi hồ sơ người bán trên EduCart, bao gồm điểm uy tín, lịch sử giao dịch, cảnh báo và danh sách học liệu đang đăng bán.",
    path: `/seller/${id}`,
    keywords: ["hồ sơ người bán educart", "trust score người bán", "seller profile"],
  });
}

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
