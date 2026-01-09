'use client'

import React, { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowUp, Bookmark, MessageCircle, Share2, Flame, Sparkles } from 'lucide-react'
import { cn, timeAgo, formatNumber } from '../../lib/utils'

export interface UltraModernCardData {
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

interface UltraModernCardProps {
  data: UltraModernCardData
  onUpvote?: () => void
  onBookmark?: () => void
  onComment?: () => void
  onShare?: () => void
  onClick?: () => void
  className?: string
}

export const UltraModernCard: React.FC<UltraModernCardProps> = ({
  data,
  onUpvote,
  onBookmark,
  onComment,
  onShare,
  onClick,
  className = '',
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Mouse tracking for 3D effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 300,
    damping: 30
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 300,
    damping: 30
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set((e.clientX - centerX) / rect.width)
    mouseY.set((e.clientY - centerY) / rect.height)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  return (
    <div className="perspective w-full">
      <motion.div
        ref={cardRef}
        className={cn('relative preserve-3d cursor-pointer', className)}
        style={{ rotateX, rotateY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovered(true)}
        whileHover={{ scale: 1.02, z: 50 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={onClick}
      >
        {/* Main card */}
        <div className="relative h-full rounded-3xl overflow-hidden noise gradient-border glass-premium">
          {/* Mesh gradient background */}
          <div className="absolute inset-0 mesh-gradient opacity-40" />

          {/* Animated gradient glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-terracotta-primary/20 via-transparent to-savanna-gold/20 opacity-0"
            animate={{
              opacity: isHovered ? 0.6 : 0
            }}
            transition={{ duration: 0.4 }}
          />

          {/* Image section */}
          <div className="relative h-48 overflow-hidden">
            <motion.div
              className="w-full h-full"
              animate={{
                scale: isHovered ? 1.1 : 1
              }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
              <img
                src={data.imageUrl}
                alt={data.title}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Dramatic gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />

            {/* Badges */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
              {/* Category */}
              <motion.div
                className="px-4 py-2 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              >
                <span className="text-sm font-black text-white tracking-widest uppercase">
                  {data.category}
                </span>
              </motion.div>

              {/* Trending badge */}
              {data.trending && (
                <motion.div
                  className="float"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                  <div className="px-3 py-2 rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 shadow-2xl glow-terracotta">
                    <div className="flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-white animate-pulse" />
                      <span className="text-sm font-black text-white tracking-wider">FIRE</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="relative p-6 space-y-4">
            {/* Title with gradient on hover */}
            <motion.h3
              className={cn(
                'text-xl font-black leading-tight line-clamp-2 transition-all duration-300',
                isHovered ? 'text-gradient-fire' : 'text-white'
              )}
            >
              {data.title}
            </motion.h3>

            {/* Author */}
            <div className="flex items-center gap-3">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <img
                  src={data.authorAvatar}
                  alt={data.author}
                  className="w-10 h-10 rounded-full ring-2 ring-terracotta-primary/30 shadow-xl"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0a0a0a] shadow-lg shadow-green-500/50" />
              </motion.div>
              <div>
                <p className="text-sm font-bold text-white">{data.author}</p>
                <p className="text-xs text-white/50">
                  {data.source} · {timeAgo(data.timePosted)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-white/5">
              {/* Upvote */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  onUpvote?.()
                }}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold transition-all duration-300 shadow-lg',
                  data.isUpvoted
                    ? 'bg-gradient-to-r from-terracotta-primary to-savanna-gold text-white glow-terracotta'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-terracotta-primary hover:glow-terracotta'
                )}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowUp className={cn('w-5 h-5', data.isUpvoted && 'fill-current')} />
                <span className="text-sm">{formatNumber(data.upvotes)}</span>
              </motion.button>

              {/* Comments */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  onComment?.()
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 text-white/70 hover:bg-white/10 hover:text-savanna-gold font-bold transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">{formatNumber(data.comments)}</span>
              </motion.button>

              <div className="flex-1" />

              {/* Bookmark */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  onBookmark?.()
                }}
                className={cn(
                  'p-2.5 rounded-2xl font-bold transition-all duration-300 shadow-lg',
                  data.isBookmarked
                    ? 'bg-gradient-to-r from-savanna-gold to-terracotta-primary text-white glow-gold'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-savanna-gold'
                )}
                whileHover={{ scale: 1.05, y: -2, rotate: data.isBookmarked ? 0 : -15 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bookmark className={cn('w-5 h-5', data.isBookmarked && 'fill-current')} />
              </motion.button>

              {/* Share */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  onShare?.()
                }}
                className="p-2.5 rounded-2xl bg-white/5 text-white/70 hover:bg-white/10 hover:text-forest-green font-bold transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.05, y: -2, rotate: 15 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Shimmer effect on hover */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 shimmer pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
        </div>
      </motion.div>
    </div>
  )
}
