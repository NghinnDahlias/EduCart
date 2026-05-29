"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Plus, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import HomeNavbar from "@/components/HomeNavbar";
import HomeFooter from "@/components/HomeFooter";
import { ForumPostCard } from "@/components/forum/ForumPostCard";
import { forumService, ForumPost } from "@/services/forum.service";
import { getToken } from "@/lib/api";

const POSTS_PER_PAGE = 15;

export default function ForumPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  useEffect(() => {
    loadPosts();
  }, [currentPage, searchQuery]);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const response = await forumService.listPosts(
        currentPage,
        POSTS_PER_PAGE,
        undefined,
        searchQuery,
      );

      if (response.ok) {
        setPosts(response.posts || []);
        setTotalPosts(response.total || 0);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleCreatePost = () => {
    const token = getToken();
    if (!token) {
      router.push("/login?redirect=/forum");
      return;
    }
    router.push("/forum/create");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <HomeNavbar />

      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Diễn đàn học tập
              </h1>
              <p className="text-gray-600">
                Chia sẻ kinh nghiệm, hỏi đáp và thảo luận về tài liệu học tập
              </p>
            </div>
            <button
              onClick={handleCreatePost}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <Plus className="w-5 h-5" />
              Tạo bài viết
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm bài đăng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Tìm
              </button>
            </div>
          </div>

          {/* Posts List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
              <p className="text-gray-500 text-lg mb-6">
                {searchQuery
                  ? "Không tìm thấy bài đăng nào"
                  : "Chưa có bài đăng nào. Hãy tạo bài viết đầu tiên!"}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleCreatePost}
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Tạo bài viết
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <ForumPostCard key={post.PostID} post={post} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded-lg p-2 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const page = currentPage - 2 + i;
                return page > 0 && page <= totalPages ? page : null;
              })
                .filter(Boolean)
                .map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page as number)}
                    className={`h-10 w-10 rounded-lg font-bold transition ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                ))}

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="rounded-lg p-2 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      <HomeFooter />
    </main>
  );
}
