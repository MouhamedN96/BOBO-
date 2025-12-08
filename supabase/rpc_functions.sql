-- RPC Functions for NJOOBA
-- Run this in Supabase SQL Editor

-- Increment post upvotes
CREATE OR REPLACE FUNCTION increment_post_upvotes(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.posts
  SET upvotes = upvotes + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Decrement post upvotes
CREATE OR REPLACE FUNCTION decrement_post_upvotes(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.posts
  SET upvotes = GREATEST(upvotes - 1, 0)
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment comment upvotes
CREATE OR REPLACE FUNCTION increment_comment_upvotes(comment_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.comments
  SET upvotes = upvotes + 1
  WHERE id = comment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Decrement comment upvotes
CREATE OR REPLACE FUNCTION decrement_comment_upvotes(comment_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.comments
  SET upvotes = GREATEST(upvotes - 1, 0)
  WHERE id = comment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment post comment count
CREATE OR REPLACE FUNCTION increment_post_comments(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.posts
  SET comment_count = comment_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Decrement post comment count
CREATE OR REPLACE FUNCTION decrement_post_comments(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.posts
  SET comment_count = GREATEST(comment_count - 1, 0)
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
