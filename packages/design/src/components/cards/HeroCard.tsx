'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUp, Bookmark, MessageCircle, Star } from 'lucide-react'
import { cn, timeAgo, formatNumber } from '../../lib/utils'

export interface HeroCardData {
  id: string
  title: string
  excerpt: string
  source: string
  author: string
  authorAvatar: string
  imageUrl: string
  category: string
  upvotes: number
  comments: number
  timePosted: Date
  featured: boolean
  isBookmarked?: boolean
  isUpvoted?: boolean
}

interface HeroCardProps {
  data: HeroCardData
  onUpvote?: () => void
  onBookmark?: () => void
  onComment?: () => void
  onClick?: () => void
  className?: string
}

export const HeroCard: React.FC<HeroCardProps> = ({
  data,
  onUpvote,
  onBookmark,
  onComment,
  onClick,
  className = '',
}) => {
  return (
    <motion.article
      className={cn(
        'group relative overflow-hidden',
        'rounded-diagonal-cut', // Asymmetric corner
        'bg-indigo-deep border-2 border-terracotta-primary/20',
        'cursor-pointer transition-all duration-500',
        'hover:scale-[1.01] hover:shadow-lg hover:border-terracotta-primary/50',
        className
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      whileTap={{ scale: 0.99 }}
    >
      {/* Hero Image Section */}
      <div className="relative h-72 overflow-hidden">
        <motion.img
          src={data.imageUrl}
          alt={data.title}
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.7 }}
        />

        {/* Sunset gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-base via-charcoal-base/60 to-transparent" />

        {/* Mudcloth texture overlay */}
        <div className="absolute inset-0 texture-mudcloth opacity-30" />

        {/* Featured badge */}
        {data.featured && (
          <motion.div
            className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-savanna-gold/90 backdrop-blur-sm"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Star size={14} className="text-charcoal-base fill-current" />
            <span className="text-micro font-bold text-charcoal-base">FEATURED</span>
          </motion.div>
        )}

        {/* Category tag */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-caption font-bold bg-terracotta-primary text-clay-white shadow-lg">
            {data.category}
          </span>
        </div>

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
          {/* Title */}
          <motion.h2
            className="text-h1 text-clay-white font-heading leading-tight group-hover:text-gradient-sunset transition-all duration-300"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {data.title}
          </motion.h2>

          {/* Excerpt */}
          <motion.p
            className="text-body text-sand-neutral line-clamp-2 max-w-3xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {data.excerpt}
          </motion.p>

          {/* Author & Meta */}
          <motion.div
            className="flex items-center justify-between flex-wrap gap-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3">
              <img
                src={data.authorAvatar}
                alt={data.author}
                className="w-10 h-10 rounded-full border-2 border-savanna-gold/50 shadow-lg"
              />
              <div>
                <p className="text-caption font-semibold text-clay-white">{data.author}</p>
                <p className="text-micro text-sand-neutral/80">
                  {data.source} · {timeAgo(data.timePosted)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Upvote */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  onUpvote?.()
                }}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all',
                  'bg-indigo-deep/60 backdrop-blur-sm border',
                  data.isUpvoted
                    ? 'border-terracotta-primary text-terracotta-primary'
                    : 'border-sand-neutral/20 text-sand-neutral hover:border-terracotta-primary hover:text-terracotta-primary'
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowUp size={18} className={data.isUpvoted ? 'fill-current' : ''} />
                <span className="font-semibold text-caption">{formatNumber(data.upvotes)}</span>
              </motion.button>

              {/* Comments */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  onComment?.()
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-deep/60 backdrop-blur-sm border border-sand-neutral/20 text-sand-neutral hover:border-savanna-gold hover:text-savanna-gold transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle size={18} />
                <span className="font-semibold text-caption">{formatNumber(data.comments)}</span>
              </motion.button>

              {/* Bookmark */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  onBookmark?.()
                }}
                className={cn(
                  'p-2 rounded-lg transition-all backdrop-blur-sm border',
                  'bg-indigo-deep/60',
                  data.isBookmarked
                    ? 'border-savanna-gold text-savanna-gold'
                    : 'border-sand-neutral/20 text-sand-neutral hover:border-savanna-gold hover:text-savanna-gold'
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bookmark size={18} className={data.isBookmarked ? 'fill-current' : ''} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Kente pattern border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 pattern-kente opacity-50" />

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-terracotta-primary/10 to-savanna-gold/10" />
      </motion.div>
    </motion.article>
  )
}
