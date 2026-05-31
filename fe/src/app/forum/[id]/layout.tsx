import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  return buildPageMetadata({
    title: `Bài viết diễn đàn #${id}`,
    description:
      "Xem bài viết diễn đàn trên EduCart để theo dõi hỏi đáp môn học, bình luận và trao đổi học liệu giữa sinh viên.",
    path: `/forum/${id}`,
    keywords: ["bài viết diễn đàn educart", "hỏi đáp môn học", "forum học tập"],
  });
}

export default function ForumPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
