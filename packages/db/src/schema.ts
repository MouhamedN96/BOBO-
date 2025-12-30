import { column, Schema, Table } from '@powersync/common';

// 1. Define Tables
export const PROFILES_TABLE = 'profiles';
export const POSTS_TABLE = 'posts';
export const LAUNCHES_TABLE = 'launches';

export const AppSchema = new Schema({
  // User Profiles (Synced from Supabase public.profiles)
  [PROFILES_TABLE]: new Table({
    username: column.text,
    avatar_url: column.text,
    level: column.integer,
    xp: column.integer,
    streak_days: column.integer,
    role: column.text, // 'developer', 'merchant', etc.
    created_at: column.text
  }),

  // Community Posts (Discussions, Q&A)
  [POSTS_TABLE]: new Table({
    author_id: column.text,
    type: column.text, // 'discussion', 'question'
    title: column.text,
    content: column.text,
    tags: column.text, // JSON string of tags
    upvotes: column.integer,
    comment_count: column.integer,
    created_at: column.text
  }),

  // Product Launches (The "Bilibili/Product Hunt" items)
  [LAUNCHES_TABLE]: new Table({
    author_id: column.text,
    title: column.text,
    tagline: column.text,
    image_url: column.text,
    video_url: column.text,
    upvotes: column.integer,
    is_trending: column.integer, // boolean 0/1
    created_at: column.text
  })
});

// Export types for use in UI
export interface ProfileRecord {
  id: string;
  username: string;
  avatar_url: string;
  level: number;
  xp: number;
  streak_days: number;
  role: string;
}

export interface PostRecord {
  id: string;
  author_id: string;
  type: 'discussion' | 'question';
  title: string;
  content: string;
  tags: string;
  upvotes: number;
  comment_count: number;
  created_at: string;
}

export interface LaunchRecord {
  id: string;
  author_id: string;
  title: string;
  tagline: string;
  image_url: string;
  video_url?: string;
  upvotes: number;
  is_trending: number;
  created_at: string;
}
