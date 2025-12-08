'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUp, Bookmark, MessageCircle, Share2, TrendingUp } from 'lucide-react'
import { cn, timeAgo, formatNumber } from '../../lib/utils'

export interface ModernNewsCardData {
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
  trending?: boolean
}

interface ModernNewsCardProps {
  data: ModernNewsCardData
  onUpvote?: () => void
  onBookmark?: () => void
  onComment?: () => void
  onShare?: () => void
  onClick?: () => void
  className?: string
}

export const ModernNewsCard: React.FC<ModernNewsCardProps> = ({
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
      className={cn('group relative overflow-hidden', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -4 }}
      onClick={onClick}
    >
      {/* Glass card with gradient border */}
      <div className="relative h-full rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border border-white/[0.08] overflow-hidden transition-all duration-500 hover:border-terracotta-primary/30 hover:shadow-[0_20px_60px_-15px_rgba(224,120,86,0.3)]">

        {/* Gradient mesh overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-terracotta-primary/10 via-transparent to-savanna-gold/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(242,165,65,0.1),transparent_50%)]" />
        </div>

        {/* Image section with overlay */}
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={data.imageUrl}
            alt={data.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Category badge - modern pill */}
          <div className="absolute top-3 left-3">
            <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
              <span className="text-xs font-semibold text-white tracking-wide uppercase">
                {data.category}
              </span>
            </div>
          </div>

          {/* Trending indicator */}
          {data.trending && (
            <motion.div
              className="absolute top-3 right-3"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <div className="px-2.5 py-1.5 rounded-full bg-gradient-to-r from-terracotta-primary to-savanna-gold backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                <TrendingUp size={14} className="text-white" />
                <span className="text-xs font-bold text-white">HOT</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Content section */}
        <div className="relative p-5 space-y-4">
          {/* Title with gradient on hover */}
          <h3 className="text-lg font-bold text-white leading-tight line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-terracotta-primary group-hover:to-savanna-gold group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
            {data.title}
          </h3>

          {/* Author info */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={data.authorAvatar}
                alt={data.author}
                className="w-8 h-8 rounded-full ring-2 ring-terracotta-primary/20"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-forest-green rounded-full border-2 border-charcoal-base" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white/90 truncate">{data.author}</p>
              <p className="text-xs text-white/50">
                {data.source} · {timeAgo(data.timePosted)}
              </p>
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex items-center gap-1 pt-3 border-t border-white/5">
            {/* Upvote */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation()
                onUpvote?.()
              }}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300',
                data.isUpvoted
                  ? 'bg-terracotta-primary/20 text-terracotta-primary'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-terracotta-primary'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUp size={16} className={data.isUpvoted ? 'fill-current' : ''} />
              <span className="text-sm font-semibold">{formatNumber(data.upvotes)}</span>
            </motion.button>

            {/* Comments */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation()
                onComment?.()
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-savanna-gold transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle size={16} />
              <span className="text-sm font-semibold">{formatNumber(data.comments)}</span>
            </motion.button>

            <div className="flex-1" />

            {/* Bookmark */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation()
                onBookmark?.()
              }}
              className={cn(
                'p-2 rounded-lg transition-all duration-300',
                data.isBookmarked
                  ? 'bg-savanna-gold/20 text-savanna-gold'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-savanna-gold'
              )}
              whileHover={{ scale: 1.05, rotate: data.isBookmarked ? 0 : -10 }}
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
              className="p-2 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-forest-green transition-all duration-300"
              whileHover={{ scale: 1.05, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 size={16} />
            </motion.button>
          </div>
        </div>

        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
          initial={false}
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.03) 50%, transparent 70%)',
            backgroundSize: '200% 200%',
          }}
        />
      </div>
    </motion.article>
  )
}
