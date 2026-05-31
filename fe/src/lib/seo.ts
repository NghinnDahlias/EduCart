import type { Metadata } from "next";

const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

export const siteConfig = {
  name: "EduCart",
  url: rawSiteUrl.replace(/\/$/, ""),
  defaultTitle: "EduCart | Sàn học liệu và giáo trình cho sinh viên",
  titleTemplate: "%s | EduCart",
  description:
    "EduCart là sàn TMĐT học liệu dành cho sinh viên, hỗ trợ mua bán giáo trình, tài liệu số, đồ dùng học tập và thuê sách an toàn trong môi trường campus.",
  keywords: [
    "EduCart",
    "sàn học liệu sinh viên",
    "mua bán giáo trình",
    "thuê sách sinh viên",
    "tài liệu số đại học",
    "chợ đồ dùng học tập",
    "campus marketplace",
    "student marketplace Vietnam",
  ],
};

export function absoluteUrl(path = "/") {
  if (!path.startsWith("/")) {
    return `${siteConfig.url}/${path}`;
  }
  return `${siteConfig.url}${path}`;
}

export function buildPageMetadata({
  title,
  description,
  path = "/",
  keywords = [],
}: {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
} = {}): Metadata {
  const finalTitle = title ? `${title} | EduCart` : siteConfig.defaultTitle;
  const finalDescription = description || siteConfig.description;
  const url = absoluteUrl(path);

  return {
    title: finalTitle,
    description: finalDescription,
    keywords: [...siteConfig.keywords, ...keywords],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url,
      siteName: siteConfig.name,
      title: finalTitle,
      description: finalDescription,
      locale: "vi_VN",
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
    },
  };
}
