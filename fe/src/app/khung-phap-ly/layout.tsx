import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Bộ hồ sơ pháp lý và chính sách nền tảng",
  description:
    "Theo dõi bộ hồ sơ pháp lý của EduCart gồm quy chế hoạt động sàn TMĐT, bảo mật dữ liệu, thanh toán, khiếu nại, bản quyền học liệu và điều khoản Trust Score.",
  path: "/khung-phap-ly",
  keywords: ["chính sách pháp lý educart", "quy chế sàn TMĐT", "trust score policy"],
});

export default function LegalFrameworkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
