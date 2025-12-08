'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ModernHeroCard,
  MobileOptimizedCard,
  Sidebar,
  ThemeToggle,
  CreatePostMenu,
  type ModernHeroCardData,
  type MobileOptimizedCardData,
} from '@njooba/shared'
import { Menu, Search, Bell, User, Sparkles, ChevronDown } from 'lucide-react'
import { posts } from '@/lib/supabase/posts'
import { useAuth } from '@/hooks/useAuth'
import type { PostWithProfile } from '@/lib/supabase/types'

export default function Home() {
  // Auth
  const { user: authUser, profile, loading: authLoading } = useAuth()

  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [gamificationExpanded, setGamificationExpanded] = useState(true)

  // Data State
  const [postsData, setPostsData] = useState<PostWithProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Apply theme to document
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Fetch posts from Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error } = await posts.getAll(1, 20)

        if (error) throw error

        if (data) {
          setPostsData(data)
        }
      } catch (err: any) {
        console.error('Error fetching posts:', err)
        setError(err.message || 'Failed to load posts')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Mock user data
  const [userXP] = useState(2340)
  const [userStreak] = useState(23)

  // Memoize contribution data generation (performance optimization)
  const contributionData = useMemo(() => {
    const data = []
    for (let i = 0; i < 56; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (56 - i))
      const count = Math.floor(Math.random() * 10)
      const level = count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : 3
      data.push({
        date: date.toISOString().split('T')[0],
        count,
        level: level as 0 | 1 | 2 | 3,
      })
    }
    return data
  }, [])

  // Mock user for sidebar (renamed to avoid shadowing authUser)
  const mockSidebarUser = {
    name: profile?.username || 'Med749',
    avatar: profile?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Med749',
    level: profile?.level || 23,
    title: 'Architect',
  }

  const impactData = {
    percentile: 5,
    streakDays: userStreak,
    totalActions: 156,
    helpfulComments: 89,
    nextMilestone: {
      title: 'Master Builder',
      target: 30,
      progress: userStreak,
    },
    contributionData,
  }

  // Mock achievements
  const achievements = [
    {
      id: '1',
      name: 'Sankofa Scholar',
      description: 'Read 100 articles',
      icon: 'sankofa' as const,
      progress: 47,
      total: 100,
      unlocked: false,
    },
    {
      id: '2',
      name: 'Gye Nyame Community',
      description: 'Make 100 comments',
      icon: 'gyenyame' as const,
      progress: 100,
      total: 100,
      unlocked: true,
    },
    {
      id: '3',
      name: 'Dwennimmen Strength',
      description: 'Maintain 30-day streak',
      icon: 'dwennimmen' as const,
      progress: 23,
      total: 30,
      unlocked: false,
    },
  ]

  // Mock hero card data
  const heroData: ModernHeroCardData = {
    id: '1',
    title: 'African AI Startups Raise $2.3B in Record Funding Round',
    excerpt: 'Pan-African AI companies are transforming healthcare, agriculture, and financial services across the continent with innovative machine learning solutions.',
    source: 'TechCabal',
    author: 'Amara Nwosu',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amara',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop',
    category: 'AI/ML',
    upvotes: 1247,
    comments: 89,
    readTime: 8,
    timePosted: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    featured: true,
    isBookmarked: false,
    isUpvoted: true,
  }

  // Mock news cards data
  const newsData: MobileOptimizedCardData[] = [
    {
      id: '2',
      title: 'Nigerian FinTech Unicorn Expands to 12 African Countries',
      source: 'Disrupt Africa',
      author: 'Kwame Addo',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kwame',
      imageUrl: 'https://images.unsplash.com/photo-1556742400-b5d6f2c48e8c?w=600&auto=format&fit=crop',
      category: 'FinTech',
      upvotes: 342,
      comments: 45,
      timePosted: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isBookmarked: true,
      isUpvoted: false,
      trending: true,
    },
    {
      id: '3',
      title: 'Kenya Launches Groundbreaking AgriTech Platform for Small Farmers',
      source: 'Ventures Africa',
      author: 'Zainab Hassan',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zainab',
      imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop',
      category: 'AgriTech',
      upvotes: 523,
      comments: 67,
      timePosted: new Date(Date.now() - 6 * 60 * 60 * 1000),
      isBookmarked: false,
      isUpvoted: false,
    },
    {
      id: '4',
      title: 'South African Developers Win Global Hackathon with Climate Solution',
      source: 'ITWeb Africa',
      author: 'Thandiwe Mkhize',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thandiwe',
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop',
      category: 'CleanTech',
      upvotes: 891,
      comments: 103,
      timePosted: new Date(Date.now() - 8 * 60 * 60 * 1000),
      isBookmarked: false,
      isUpvoted: true,
    },
    {
      id: '5',
      title: 'EdTech Platform Reaches 1 Million Students Across West Africa',
      source: 'Briter Bridges',
      author: 'Ibrahim Diallo',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ibrahim',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop',
      category: 'EdTech',
      upvotes: 678,
      comments: 92,
      timePosted: new Date(Date.now() - 10 * 60 * 60 * 1000),
      isBookmarked: true,
      isUpvoted: false,
    },
  ]

  // Transform Supabase data to card format
  const transformedPosts: MobileOptimizedCardData[] = postsData.map((post) => ({
    id: post.id,
    title: post.title,
    source: post.category,
    author: post.profiles?.username || 'Anonymous',
    authorAvatar: post.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.profiles?.username || 'anon'}`,
    imageUrl: post.image_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop',
    category: post.category,
    upvotes: post.upvotes,
    comments: post.comment_count,
    timePosted: new Date(post.created_at),
    isBookmarked: false,
    isUpvoted: false,
    trending: post.upvotes > 500,
  }))

  // Use real data if available, otherwise fallback to mock
  const displayPosts = transformedPosts.length > 0 ? transformedPosts : newsData

  // User data from Supabase profile or fallback
  const sidebarUser = profile ? {
    name: profile.username,
    avatar: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`,
    level: profile.level,
    title: profile.level < 5 ? 'Rising Star' : profile.level < 10 ? 'Builder' : 'Architect',
  } : mockSidebarUser

  const sidebarImpactData = profile ? {
    percentile: Math.max(100 - Math.floor(profile.level / 5), 5),
    streakDays: profile.streak_days,
    totalActions: profile.total_posts + profile.total_comments,
    helpfulComments: profile.helpful_comments,
    nextMilestone: {
      title: 'Master Builder',
      target: 30,
      progress: profile.streak_days,
    },
    contributionData,
  } : impactData

  return (
    <div className="min-h-screen mesh-gradient">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={sidebarUser}
        userXP={profile?.xp || userXP}
        achievements={achievements}
        impactData={sidebarImpactData}
      />

      {/* Main Content - shifts right to accommodate sidebar on laptop+ */}
      <div className="md:ml-[280px] transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Menu
                className="text-clay-white cursor-pointer hover:text-terracotta-primary transition-colors md:hidden"
                onClick={() => setSidebarOpen(true)}
              />
              <h1 className="text-h2 font-display text-gradient-sunset font-bold">NJOOBA</h1>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-neutral" size={20} />
                <input
                  type="text"
                  placeholder="Search articles, jobs, tutorials..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-charcoal-base/40 border border-sand-neutral/20 text-clay-white placeholder:text-sand-neutral/50 focus:outline-none focus:border-terracotta-primary transition-colors"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <ThemeToggle theme={theme} onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
              <CreatePostMenu />
              <Bell className="text-sand-neutral cursor-pointer hover:text-savanna-gold transition-colors" />
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-terracotta-primary to-savanna-gold flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                <User size={18} className="text-clay-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400">Error loading posts: {error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="space-y-6">
            <div className="h-96 bg-charcoal-base/40 animate-pulse rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-72 bg-charcoal-base/40 animate-pulse rounded-2xl" />
              ))}
            </div>
          </div>
        )}

        {/* Main Feed - Full Width */}
        {!loading && !error && (
          <div className="space-y-6">
            {/* Hero Card - First post if available */}
            {displayPosts[0] && <ModernHeroCard data={displayPosts[0] as any} />}

            {/* News Grid - Remaining posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayPosts.slice(1).map((post) => (
                <MobileOptimizedCard key={post.id} data={post} />
              ))}
            </div>

            {/* No Posts Message */}
            {displayPosts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-sand-neutral text-lg">No posts yet. Be the first to share something!</p>
              </div>
            )}
          </div>
        )}
      </main>

        {/* Footer */}
        <footer className="border-t border-terracotta-primary/10 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center space-y-2">
              <p className="text-body text-sand-neutral">
                <span className="text-gradient-sunset font-bold">NJOOBA</span> - Where African Developers Grow Together
              </p>
              <p className="text-caption text-sand-neutral/70">
                Ubuntu: I am because we are 🌍
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
