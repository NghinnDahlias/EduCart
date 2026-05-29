"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import HomeNavbar from "@/components/HomeNavbar";
import HomeFooter from "@/components/HomeFooter";
import { forumService } from "@/services/forum.service";
import { getToken, api } from "@/lib/api";

interface Subject {
  SubjectID: number;
  SubjectName: string;
}

export default function CreateForumPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [subjectId, setSubjectId] = useState<number | "">("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login?redirect=/forum/create");
      return;
    }

    // Load subjects
    api
      .get<{ ok: boolean; subjects: Subject[] }>("/faculties/1/subjects")
      .then((d) => setSubjects(d.subjects || []))
      .catch(() => setSubjects([]));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Tiêu đề không được để trống");
      return;
    }

    if (!content.trim()) {
      setError("Nội dung không được để trống");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await forumService.createPost({
        title: title.trim(),
        content: content.trim(),
        subjectId: subjectId ? Number(subjectId) : undefined,
        tags: tags.trim(),
      });

      if (response.ok && response.post) {
        router.push(`/forum/${response.post.PostID}`);
      }
    } catch (err: any) {
      setError(err?.message || "Lỗi tạo bài đăng");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <HomeNavbar />

      <section className="py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/forum"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại diễn đàn
          </Link>

          {/* Form Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Tạo bài viết mới
            </h1>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề bài viết..."
                  maxLength={255}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {title.length}/255 ký tự
                </p>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Chia sẻ chi tiết, câu hỏi hoặc kinh nghiệm của bạn..."
                  maxLength={5000}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {content.length}/5000 ký tự
                </p>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Môn học (tùy chọn)
                </label>
                <select
                  value={subjectId}
                  onChange={(e) =>
                    setSubjectId(e.target.value ? Number(e.target.value) : "")
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn môn học</option>
                  {subjects.map((s) => (
                    <option key={s.SubjectID} value={s.SubjectID}>
                      {s.SubjectName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Thẻ (tùy chọn)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Nhập các thẻ, cách nhau bởi dấu phẩy. VD: data-structures, help, urgent"
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {tags.length}/500 ký tự
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang đăng...
                    </>
                  ) : (
                    "Đăng bài viết"
                  )}
                </button>
                <Link
                  href="/forum"
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors text-center"
                >
                  Hủy
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}
