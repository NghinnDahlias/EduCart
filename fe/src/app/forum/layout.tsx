import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Diễn đàn học tập và hỏi đáp sinh viên",
  description:
    "Tham gia diễn đàn EduCart để hỏi bài, chia sẻ kinh nghiệm môn học, tìm học liệu số và trao đổi với cộng đồng sinh viên.",
  path: "/forum",
  keywords: ["diễn đàn sinh viên", "hỏi bài đại học", "chia sẻ học liệu"],
});

export default function ForumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
