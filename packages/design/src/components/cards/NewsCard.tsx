'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUp, Bookmark, MessageCircle, Share2 } from 'lucide-react'
import { cn, timeAgo, formatNumber } from '../../lib/utils'

export interface NewsCardData {
  id: string
  title: string
  source: string
  author: string
  authorAvatar: string
  imageUrl: string
  category: string
  upvotes: number
  comments: number
  timePosted: Date
  isBookmarked?: boolean
  isUpvoted?: boolean
}

interface NewsCardProps {
  data: NewsCardData
  onUpvote?: () => void
  onBookmark?: () => void
  onComment?: () => void
  onShare?: () => void
  onClick?: () => void
  className?: string
}

export const NewsCard: React.FC<NewsCardProps> = ({
  data,
  onUpvote,
  onBookmark,
  onComment,
  onShare,
  onClick,
  className = '',
}) => {
  return (
    <motion.article
      className={cn(
        'group relative overflow-hidden rounded-lg',
        'bg-indigo-deep/40 border border-terracotta-primary/10',
        'cursor-pointer transition-all duration-300',
        'hover:scale-[1.02] hover:shadow-lg hover:border-terracotta-primary/30',
        'pattern-kente',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image Section */}
      <div className="relative h-40 overflow-hidden">
        <motion.img
          src={data.imageUrl}
          alt={data.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-base/80 via-charcoal-base/20 to-transparent" />

        {/* Category tag */}
        <div className="absolute top-2 left-2">
          <span className="inline-flex items-center px-2 py-1 rounded-md text-micro font-semibold bg-terracotta-primary/90 text-clay-white backdrop-blur-sm">
            {data.category}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="text-h3 text-clay-white font-heading line-clamp-2 group-hover:text-terracotta-primary transition-colors duration-200">
          {data.title}
        </h3>

        {/* Author & Source */}
        <div className="flex items-center gap-2">
          <img
            src={data.authorAvatar}
            alt={data.author}
            className="w-6 h-6 rounded-full border border-terracotta-primary/30"
          />
          <div className="flex-1 min-w-0">
            <p className="text-caption text-sand-neutral truncate">
              {data.author} <span className="text-sand-neutral/50">·</span> {data.source}
            </p>
          </div>
          <span className="text-micro text-sand-neutral/70 flex-shrink-0">
            {timeAgo(data.timePosted)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-2 border-t border-sand-neutral/10">
          {/* Upvote */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation()
              onUpvote?.()
            }}
            className={cn(
              'flex items-center gap-1.5 text-caption transition-colors',
              data.isUpvoted ? 'text-terracotta-primary' : 'text-sand-neutral hover:text-terracotta-primary'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp size={16} className={data.isUpvoted ? 'fill-current' : ''} />
            <span className="font-medium">{formatNumber(data.upvotes)}</span>
          </motion.button>

          {/* Comments */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation()
              onComment?.()
            }}
            className="flex items-center gap-1.5 text-caption text-sand-neutral hover:text-savanna-gold transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle size={16} />
            <span>{formatNumber(data.comments)}</span>
          </motion.button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bookmark */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation()
              onBookmark?.()
            }}
            className={cn(
              'text-caption transition-colors',
              data.isBookmarked ? 'text-savanna-gold' : 'text-sand-neutral hover:text-savanna-gold'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bookmark size={16} className={data.isBookmarked ? 'fill-current' : ''} />
          </motion.button>

          {/* Share */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation()
              onShare?.()
            }}
            className="text-caption text-sand-neutral hover:text-forest-green transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Share2 size={16} />
          </motion.button>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-terracotta-primary/5 to-savanna-gold/5" />
      </div>
    </motion.article>
  )
}
