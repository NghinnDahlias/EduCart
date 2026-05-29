"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle, Trash2 } from "lucide-react";
import HomeNavbar from "@/components/HomeNavbar";
import HomeFooter from "@/components/HomeFooter";
import { CommentSection } from "@/components/forum/CommentSection";
import { forumService, ForumPostDetail } from "@/services/forum.service";
import { getToken, getUser } from "@/lib/api";

export default function ForumPostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = Number(params?.id);

  const [post, setPost] = useState<ForumPostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const userData = getUser();
      setUser(userData);
    }
  }, []);

  useEffect(() => {
    if (!postId || !Number.isFinite(postId)) {
      setError("ID bài đăng không hợp lệ");
      setIsLoading(false);
      return;
    }
    loadPost();
  }, [postId]);

  const loadPost = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await forumService.getPost(postId);

      if (response.ok && response.post) {
        setPost(response.post);
      } else {
        setError("Không tìm thấy bài đăng");
      }
    } catch (err: any) {
      setError(err?.message || "Lỗi tải bài đăng");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (content: string) => {
    try {
      const response = await forumService.addComment(postId, { content });

      if (response.ok && response.comment) {
        // Reload post để lấy comments mới
        await loadPost();
      }
    } catch (err: any) {
      alert(err?.message || "Lỗi thêm bình luận");
    }
  };

  const handleDeletePost = async () => {
    if (!user) return;
    if (post?.AuthorID !== user.UserID) {
      alert("Bạn chỉ có thể xóa bài đăng của mình");
      return;
    }

    if (!window.confirm("Bạn chắc chắn muốn xóa bài đăng này?")) return;

    try {
      await forumService.deletePost(postId);
      router.push("/forum");
    } catch (err: any) {
      alert(err?.message || "Lỗi xóa bài đăng");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <HomeNavbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
        <HomeFooter />
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="min-h-screen bg-gray-50">
        <HomeNavbar />
        <section className="py-12">
          <div className="mx-auto max-w-4xl px-4">
            <div className="bg-white rounded-lg border border-red-200 p-8 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {error || "Bài đăng không tồn tại"}
              </h2>
              <Link
                href="/forum"
                className="mt-6 inline-block text-blue-600 hover:text-blue-700 font-semibold"
              >
                Quay lại diễn đàn
              </Link>
            </div>
          </div>
        </section>
        <HomeFooter />
      </main>
    );
  }

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

          {/* Post Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {post.Title}
                </h1>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs overflow-hidden">
                      {post.AvatarURL ? (
                        <img
                          src={post.AvatarURL}
                          alt={post.FName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        post.FName?.charAt(0) || "U"
                      )}
                    </div>
                    <span className="font-semibold">
                      {post.FName} {post.LName}
                    </span>
                  </div>
                  <span>•</span>
                  <span>{formatDate(post.CreatedAt)}</span>
                  {post.SubjectName && (
                    <>
                      <span>•</span>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                        {post.SubjectName}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {user?.UserID === post.AuthorID && (
                <button
                  onClick={handleDeletePost}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Xóa bài đăng"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Post Content */}
            <div className="mb-6">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {post.Content}
              </p>
            </div>

            {/* Tags */}
            {post.Tags && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.Tags.split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean)
                  .map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-6 pt-6 border-t border-gray-200 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <span>{post.ViewCount} lượt xem</span>
              </div>
              <div className="flex items-center gap-1">
                <span>{post.CommentsCount} bình luận</span>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <CommentSection
            postId={postId}
            comments={post.comments || []}
            onAddComment={handleAddComment}
            isLoading={false}
          />
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}
