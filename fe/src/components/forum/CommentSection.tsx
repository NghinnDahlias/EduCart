"use client";

import { useState } from "react";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { ForumComment } from "@/services/forum.service";
import { getUser } from "@/lib/api";

interface CommentSectionProps {
  postId: number;
  comments: ForumComment[];
  onAddComment: (content: string) => Promise<void>;
  isLoading?: boolean;
}

export function CommentSection({
  postId,
  comments,
  onAddComment,
  isLoading = false,
}: CommentSectionProps) {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = getUser() as { UserID?: number } | null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString("vi-VN");
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      setIsSubmitting(true);
      await onAddComment(commentText);
      setCommentText("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const topLevelComments = comments.filter((c) => c.ParentCommentID === null);
  const repliesMap = new Map<number, ForumComment[]>();

  comments.forEach((comment) => {
    if (comment.ParentCommentID) {
      if (!repliesMap.has(comment.ParentCommentID)) {
        repliesMap.set(comment.ParentCommentID, []);
      }
      repliesMap.get(comment.ParentCommentID)!.push(comment);
    }
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Bình luận ({comments.length})
      </h2>

      {/* Comment Form */}
      {user ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
              {user
                ? (user as any)?.LName?.charAt(0) ||
                  (user as any)?.FName?.charAt(0) ||
                  "U"
                : "U"}
            </div>
            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Chia sẻ ý kiến của bạn..."
                maxLength={2000}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-500">
                  {commentText.length}/2000
                </span>
                <button
                  onClick={handleAddComment}
                  disabled={isSubmitting || !commentText.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Gửi
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-gray-700 mb-4">Vui lòng đăng nhập để bình luận</p>
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      ) : topLevelComments.length > 0 ? (
        <div className="space-y-4">
          {topLevelComments.map((comment) => (
            <CommentItem
              key={comment.CommentID}
              comment={comment}
              replies={repliesMap.get(comment.CommentID) || []}
              formatDate={formatDate}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <MessageSquare className="w-8 h-8 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">Chưa có bình luận nào</p>
        </div>
      )}
    </div>
  );
}

interface CommentItemProps {
  comment: ForumComment;
  replies: ForumComment[];
  formatDate: (date: string) => string;
}

function CommentItem({ comment, replies, formatDate }: CommentItemProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0 overflow-hidden">
          {comment.AvatarURL ? (
            <img
              src={comment.AvatarURL}
              alt={comment.FName}
              className="w-full h-full object-cover"
            />
          ) : (
            comment.FName?.charAt(0) || "U"
          )}
        </div>

        {/* Comment Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-gray-900">
              {comment.FName} {comment.LName}
            </span>
            <span className="text-xs text-gray-500">
              {formatDate(comment.CreatedAt)}
            </span>
          </div>
          <p className="text-gray-700 text-sm whitespace-pre-wrap">
            {comment.Content}
          </p>
        </div>
      </div>

      {/* Replies */}
      {replies.length > 0 && (
        <div className="mt-4 ml-14 space-y-3 pt-4 border-t border-gray-100">
          {replies.map((reply) => (
            <div key={reply.CommentID} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 overflow-hidden">
                {reply.AvatarURL ? (
                  <img
                    src={reply.AvatarURL}
                    alt={reply.FName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  reply.FName?.charAt(0) || "U"
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-gray-900">
                    {reply.FName} {reply.LName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(reply.CreatedAt)}
                  </span>
                </div>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">
                  {reply.Content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
