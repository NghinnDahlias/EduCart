"use client";

import Link from "next/link";
import { Eye, MessageSquare, PinIcon } from "lucide-react";
import { ForumPost } from "@/services/forum.service";

interface ForumPostCardProps {
  post: ForumPost;
}

export function ForumPostCard({ post }: ForumPostCardProps) {
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

  return (
    <Link href={`/forum/${post.PostID}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group">
        <div className="flex gap-4">
          {/* Author Avatar */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-bold overflow-hidden">
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
          </div>

          {/* Post Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* Title with pin badge */}
                <div className="flex items-center gap-2 mb-1">
                  {post.IsPinned && (
                    <PinIcon className="w-4 h-4 text-red-500 flex-shrink-0" />
                  )}
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.Title}
                  </h3>
                </div>

                {/* Meta info */}
                <div className="flex items-center flex-wrap gap-3 text-xs text-gray-500 mb-2">
                  <span className="font-medium">
                    {post.FName} {post.LName}
                  </span>
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

                {/* Preview */}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {post.Content}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-shrink-0 flex items-center gap-6 text-gray-500">
            <div className="flex items-center gap-1.5 text-center">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">{post.ViewCount}</span>
            </div>
            <div className="flex items-center gap-1.5 text-center">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">{post.CommentsCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
