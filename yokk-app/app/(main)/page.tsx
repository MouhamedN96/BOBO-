'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, MessageSquare, Award, Users } from 'lucide-react'

const stats = [
  { label: 'Active Users', value: '2,543', icon: Users, color: 'from-violet-500 to-purple-500' },
  { label: 'Questions', value: '1,284', icon: MessageSquare, color: 'from-emerald-500 to-teal-500' },
  { label: 'Launches', value: '89', icon: TrendingUp, color: 'from-orange-500 to-amber-500' },
  { label: 'Top Contributors', value: '156', icon: Award, color: 'from-pink-500 to-rose-500' },
]

const mockPosts = [
  {
    id: 1,
    title: 'How to optimize React performance in large-scale applications?',
    author: 'Sarah Chen',
    category: 'React',
    upvotes: 42,
    comments: 18,
    time: '2h ago',
  },
  {
    id: 2,
    title: 'Best practices for API design in 2025',
    author: 'Marcus Johnson',
    category: 'API Design',
    upvotes: 38,
    comments: 12,
    time: '4h ago',
  },
  {
    id: 3,
    title: 'Introducing our new mobile app built with React Native',
    author: 'TechStart Inc.',
    category: 'Launch',
    upvotes: 67,
    comments: 24,
    time: '6h ago',
  },
]

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-clay-white mb-4">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-violet-500 to-emerald-500 bg-clip-text text-transparent">
            YOKK
          </span>
        </h1>
        <p className="text-lg text-clay-white/70 max-w-2xl">
          A community for developers to ask questions, share launches, and grow together.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="
                group relative overflow-hidden
                bg-white/5 backdrop-blur-sm
                border border-white/10 hover:border-white/20
                rounded-lg p-6
                transition-all duration-300
                hover:transform hover:scale-105
              "
            >
              {/* Gradient Background on Hover */}
              <div className={`
                absolute inset-0 bg-gradient-to-br ${stat.color}
                opacity-0 group-hover:opacity-10
                transition-opacity duration-300
              `} />

              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-8 h-8 text-clay-white/60 group-hover:text-clay-white transition-colors" />
                  <div className={`
                    w-2 h-2 rounded-full
                    bg-gradient-to-br ${stat.color}
                    group-hover:animate-pulse
                  `} />
                </div>
                <p className="text-3xl font-bold text-clay-white mb-1">{stat.value}</p>
                <p className="text-sm text-clay-white/60">{stat.label}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Trending Posts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-heading font-bold text-clay-white">
            Trending Now
          </h2>
          <button className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {mockPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className="
                group
                bg-white/5 backdrop-blur-sm
                border border-white/10 hover:border-white/20
                rounded-lg p-6
                transition-all duration-300
                hover:transform hover:translate-x-2
              "
            >
              <div className="flex items-start gap-4">
                {/* Upvote Section */}
                <div className="flex flex-col items-center gap-1 min-w-[3rem]">
                  <button className="
                    p-2 rounded-lg
                    bg-white/5 hover:bg-violet-500/20
                    border border-white/10 hover:border-violet-500/50
                    transition-all duration-200
                    group/upvote
                  ">
                    <svg className="w-5 h-5 text-clay-white/60 group-hover/upvote:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <span className="text-sm font-semibold text-clay-white">{post.upvotes}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="
                      inline-flex items-center px-2.5 py-0.5 rounded-full
                      bg-violet-500/20 text-violet-400
                      text-xs font-medium
                      border border-violet-500/30
                    ">
                      {post.category}
                    </span>
                    <span className="text-xs text-clay-white/40">{post.time}</span>
                  </div>

                  <h3 className="
                    text-lg font-semibold text-clay-white mb-2
                    group-hover:text-violet-400
                    transition-colors duration-200
                  ">
                    {post.title}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-clay-white/60">
                    <span>by {post.author}</span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {post.comments} comments
                    </span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="
          relative overflow-hidden
          bg-gradient-to-br from-violet-500/10 to-emerald-500/10
          border border-violet-500/30
          rounded-lg p-8
        "
      >
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-emerald-500/5 animate-gradient-xy" />
        <div className="relative text-center">
          <h3 className="text-2xl font-heading font-bold text-clay-white mb-2">
            Ready to get started?
          </h3>
          <p className="text-clay-white/70 mb-6">
            Join our community of developers and start sharing your knowledge.
          </p>
          <button className="
            px-6 py-3 rounded-lg
            bg-gradient-to-r from-violet-500 to-emerald-500
            text-white font-semibold
            hover:shadow-lg hover:shadow-violet-500/50
            transition-all duration-300
            hover:scale-105
          ">
            Create Your First Post
          </button>
        </div>
      </motion.div>
    </div>
  )
}
