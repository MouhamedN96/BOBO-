export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          level: number
          xp: number
          streak_days: number
          last_activity_date: string | null
          total_posts: number
          total_comments: number
          helpful_comments: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          level?: number
          xp?: number
          streak_days?: number
          last_activity_date?: string | null
          total_posts?: number
          total_comments?: number
          helpful_comments?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          level?: number
          xp?: number
          streak_days?: number
          last_activity_date?: string | null
          total_posts?: number
          total_comments?: number
          helpful_comments?: number
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          author_id: string
          title: string
          content: string
          category: string
          tags: string[]
          image_url: string | null
          upvotes: number
          comment_count: number
          view_count: number
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          author_id: string
          title: string
          content: string
          category: string
          tags?: string[]
          image_url?: string | null
          upvotes?: number
          comment_count?: number
          view_count?: number
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          author_id?: string
          title?: string
          content?: string
          category?: string
          tags?: string[]
          image_url?: string | null
          upvotes?: number
          comment_count?: number
          view_count?: number
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          author_id: string
          content: string
          parent_comment_id: string | null
          upvotes: number
          is_helpful: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          author_id: string
          content: string
          parent_comment_id?: string | null
          upvotes?: number
          is_helpful?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          author_id?: string
          content?: string
          parent_comment_id?: string | null
          upvotes?: number
          is_helpful?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      upvotes: {
        Row: {
          id: string
          user_id: string
          post_id: string | null
          comment_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id?: string | null
          comment_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string | null
          comment_id?: string | null
          created_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          icon: string
          unlocked_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          icon: string
          unlocked_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          icon?: string
          unlocked_at?: string
        }
      }
    }
  }
}

// Export convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']
export type Upvote = Database['public']['Tables']['upvotes']['Row']
export type Achievement = Database['public']['Tables']['achievements']['Row']

// Post with joined profile
export type PostWithProfile = Post & {
  profiles: Profile | null
}

