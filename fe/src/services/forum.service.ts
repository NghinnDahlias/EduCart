import { api } from "@/lib/api";

export interface ForumPost {
  PostID: number;
  AuthorID: number;
  SubjectID: number | null;
  Title: string;
  Content: string;
  Tags: string | null;
  VotesCount: number;
  CommentsCount: number;
  ViewCount: number;
  IsActive: boolean;
  IsPinned: boolean;
  CreatedAt: string;
  UpdatedAt: string;
  FName: string;
  LName: string;
  AvatarURL: string | null;
  SubjectName: string | null;
}

export interface ForumComment {
  CommentID: number;
  PostID: number;
  AuthorID: number;
  ParentCommentID: number | null;
  Content: string;
  VotesCount: number;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
  FName: string;
  LName: string;
  AvatarURL: string | null;
}

export interface ForumPostDetail extends ForumPost {
  comments: ForumComment[];
}

export interface ForumListResponse {
  ok: boolean;
  posts: ForumPost[];
  total: number;
}

export interface ForumPostResponse {
  ok: boolean;
  post: ForumPostDetail;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  subjectId?: number;
  tags?: string;
}

export interface CreateCommentPayload {
  content: string;
  parentCommentId?: number;
}

export const forumService = {
  /**
   * Lấy danh sách bài đăng (có phân trang)
   */
  async listPosts(
    page = 1,
    limit = 20,
    subjectId?: number,
    search?: string,
  ): Promise<ForumListResponse> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (subjectId) params.append("subjectId", String(subjectId));
    if (search) params.append("search", search);

    try {
      return await api.get<ForumListResponse>(`/forum?${params.toString()}`);
    } catch (error) {
      console.error("Error fetching posts:", error);
      return { ok: false, posts: [], total: 0 };
    }
  },

  /**
   * Lấy chi tiết bài đăng + bình luận
   */
  async getPost(postId: number): Promise<ForumPostResponse> {
    try {
      return await api.get<ForumPostResponse>(`/forum/${postId}`);
    } catch (error) {
      console.error("Error fetching post:", error);
      throw error;
    }
  },

  /**
   * Tạo bài đăng mới (cần auth)
   */
  async createPost(
    payload: CreatePostPayload,
  ): Promise<{ ok: boolean; post: ForumPost }> {
    try {
      return await api.post<{ ok: boolean; post: ForumPost }>(
        "/forum",
        payload,
        true,
      );
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },

  /**
   * Thêm bình luận vào bài đăng (cần auth)
   */
  async addComment(
    postId: number,
    payload: CreateCommentPayload,
  ): Promise<{ ok: boolean; comment: ForumComment }> {
    try {
      return await api.post<{ ok: boolean; comment: ForumComment }>(
        `/forum/${postId}/comments`,
        payload,
        true,
      );
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  },

  /**
   * Bình chọn bài đăng (cần auth)
   */
  async votePost(
    postId: number,
    type: "up" | "down",
  ): Promise<{ ok: boolean; message: string }> {
    try {
      return await api.post<{ ok: boolean; message: string }>(
        `/forum/${postId}/vote`,
        { type },
        true,
      );
    } catch (error) {
      console.error("Error voting:", error);
      throw error;
    }
  },

  /**
   * Xóa bài đăng (cần auth - chỉ tác giả)
   */
  async deletePost(postId: number): Promise<{ ok: boolean; message: string }> {
    try {
      return await api.delete(`/forum/${postId}`, true);
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  },
};
