'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Share, Clock, User } from 'lucide-react';

// Define TypeScript interfaces based on the schema
export interface Post {
  id: string;
  author_id: string;
  title: string;
  content: string;
  created_at: string;
  upvotes: number;
  comments_count: number;
  author?: {
    id: string;
    username?: string;
    email?: string;
    avatar_url?: string;
  };
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Truncate content preview
  const contentPreview =
    post.content.length > 150
      ? post.content.substring(0, 150) + '...'
      : post.content;

  const authorName = post.author?.username || post.author?.email?.split('@')[0] || 'Anonymous';

  return (
    <Link href={`/posts/${post.id}`}>
      <article className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-5 hover:shadow-md dark:hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        {/* Header with author info and timestamp */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {post.author?.avatar_url ? (
              <img
                src={post.author.avatar_url}
                alt={authorName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {authorName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {post.author_id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <Clock size={14} />
            <span className="text-xs">{formatDate(post.created_at)}</span>
          </div>
        </div>

        {/* Post title */}
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {post.title}
        </h2>

        {/* Content preview */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {contentPreview}
        </p>

        {/* Footer with engagement metrics */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-4">
            {/* Upvote display */}
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
              <Heart size={16} />
              <span className="text-xs font-medium">{post.upvotes}</span>
            </div>

            {/* Comments count */}
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
              <MessageCircle size={16} />
              <span className="text-xs font-medium">{post.comments_count}</span>
            </div>
          </div>

          {/* Share button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              // Share functionality can be implemented here
            }}
            className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            <Share size={16} />
          </button>
        </div>
      </article>
    </Link>
  );
}
