# Qwen-Code Parallel Tasks
**Created:** 2026-01-06
**Status:** Ready for execution
**Conflict Zone:** NONE - These tasks are isolated from Claude's work

---

## ⚠️ IMPORTANT: Avoid These Files (Claude is working on them)
```
❌ bobo-app/src/lib/powersync/schema.ts
❌ bobo-app/supabase/schema.sql
❌ packages/core/src/services/
❌ Any BOBO files
```

---

## ✅ YOUR ASSIGNED TASKS (YOKK App Only)

### Task 1: Build YOKK Posts Feed UI
**Priority:** HIGH | **Complexity:** M | **Files:** `yokk-app/app/`

Create the main posts feed for the developer community.

**Requirements:**
1. Create `yokk-app/app/(main)/layout.tsx` - Main layout with navigation
2. Create `yokk-app/app/(main)/page.tsx` - Posts feed page
3. Create `yokk-app/components/posts/PostCard.tsx` - Individual post card
4. Create `yokk-app/components/posts/PostFeed.tsx` - Feed container

**PostCard should display:**
- Author avatar + username
- Post title
- Post type badge (question/discussion/article/showcase)
- Category tag
- Upvote count + button
- Comment count
- Time ago

**Design Guidelines:**
- Use Tailwind CSS
- Dark mode support (use `dark:` variants)
- Mobile-first responsive
- Minimalist, dev-focused aesthetic

**Schema Reference (from `yokk-app/lib/powersync/schema.ts`):**
```typescript
posts = {
  author_id: text,
  title: text,
  content: text,
  type: text, // 'question', 'discussion', 'article', 'showcase'
  category: text,
  tags: text, // JSON array
  image_url: text,
  upvotes: integer,
  comment_count: integer,
  view_count: integer,
  is_answered: integer, // 0/1
  is_featured: integer, // 0/1
}
```

---

### Task 2: Build Post Creation Form
**Priority:** HIGH | **Complexity:** M | **Files:** `yokk-app/app/`, `yokk-app/components/`

**Requirements:**
1. Create `yokk-app/app/(main)/new/page.tsx` - New post page
2. Create `yokk-app/components/posts/PostForm.tsx` - Form component

**Form Fields:**
- Title (required)
- Type selector (question/discussion/article/showcase)
- Category dropdown
- Tags input (comma-separated, max 5)
- Content (markdown editor - use simple textarea for MVP)
- Image upload (optional)

**Validation:**
- Title: 10-200 characters
- Content: min 50 characters for questions, 100 for articles
- Tags: max 5, each max 20 chars

---

### Task 3: Build Comments Section
**Priority:** MEDIUM | **Complexity:** M | **Files:** `yokk-app/components/`

**Requirements:**
1. Create `yokk-app/app/(main)/post/[id]/page.tsx` - Single post view
2. Create `yokk-app/components/comments/CommentList.tsx`
3. Create `yokk-app/components/comments/CommentCard.tsx`
4. Create `yokk-app/components/comments/CommentForm.tsx`

**Features:**
- Nested comments (1 level deep only for MVP)
- Upvote on comments
- "Accept answer" button (for question posts, author only)
- "Helpful" marker

**Schema Reference:**
```typescript
comments = {
  post_id: text,
  author_id: text,
  parent_comment_id: text, // for nesting
  content: text,
  upvotes: integer,
  is_accepted: integer, // 0/1
  is_helpful: integer, // 0/1
}
```

---

### Task 4: Build Upvote System
**Priority:** MEDIUM | **Complexity:** S | **Files:** `yokk-app/lib/`, `yokk-app/components/`

**Requirements:**
1. Create `yokk-app/lib/actions/upvote.ts` - Server actions for upvoting
2. Create `yokk-app/components/ui/UpvoteButton.tsx` - Reusable button

**Logic:**
- Check if user already upvoted (via `upvotes` table)
- Toggle upvote on/off
- Update count optimistically
- Sync with Supabase

**Schema Reference:**
```typescript
upvotes = {
  user_id: text,
  post_id: text, // nullable
  comment_id: text, // nullable
}
```

---

### Task 5: Build User Profile Card
**Priority:** LOW | **Complexity:** S | **Files:** `yokk-app/components/`

**Requirements:**
1. Create `yokk-app/components/profile/ProfileCard.tsx`
2. Create `yokk-app/components/profile/ProfileStats.tsx`

**Display:**
- Avatar
- Username
- Level badge (based on `level` field)
- XP progress bar to next level
- Streak counter (flame icon + days)
- Total posts/comments

**Gamification Formula:**
- Level 1: 0-100 XP
- Level 2: 101-300 XP
- Level 3: 301-600 XP
- Level N: XP thresholds increase exponentially

---

### Task 6: Build Navigation
**Priority:** HIGH | **Complexity:** S | **Files:** `yokk-app/components/`

**Requirements:**
1. Create `yokk-app/components/layout/Header.tsx`
2. Create `yokk-app/components/layout/Sidebar.tsx`
3. Create `yokk-app/components/layout/MobileNav.tsx`

**Navigation Items:**
- Home (feed)
- Questions
- Launches
- Leaderboard
- Profile
- New Post (CTA button)

**Header:**
- Logo (YOKK)
- Search bar
- User avatar/login button
- Theme toggle (dark/light)

---

## 🛠️ Technical Context

### Imports to Use
```typescript
// Supabase client
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// PowerSync (for offline)
import { usePowerSync } from '@powersync/react'

// UI Components (if @njooba/design exists)
import { Button, Card, Input } from '@njooba/design'

// Or use shadcn/ui patterns with Tailwind
```

### File Structure Convention
```
yokk-app/
├── app/
│   ├── (main)/           # Authenticated routes
│   │   ├── layout.tsx
│   │   ├── page.tsx      # Feed
│   │   ├── new/page.tsx  # New post
│   │   └── post/[id]/page.tsx
│   └── (auth)/           # Auth routes
│       ├── login/page.tsx
│       └── signup/page.tsx
├── components/
│   ├── posts/
│   ├── comments/
│   ├── profile/
│   ├── layout/
│   └── ui/
└── lib/
    ├── actions/          # Server actions
    └── hooks/            # Custom hooks
```

### Styling
- Use Tailwind CSS classes
- Support dark mode with `dark:` prefix
- Use CSS variables for theme colors
- Mobile-first (sm:, md:, lg: breakpoints)

---

## 📋 Execution Order

1. **Navigation + Layout** (Task 6) - Foundation for all pages
2. **Posts Feed** (Task 1) - Core feature
3. **Post Creation** (Task 2) - Users need to create content
4. **Comments** (Task 3) - Engagement feature
5. **Upvotes** (Task 4) - Gamification
6. **Profile** (Task 5) - Nice to have

---

## ✅ Definition of Done

For each component:
- [ ] TypeScript types defined
- [ ] Responsive design (mobile + desktop)
- [ ] Dark mode support
- [ ] Loading states
- [ ] Error states
- [ ] Basic accessibility (aria labels, keyboard nav)

---

## 🚫 Out of Scope (Don't Do These)

- Authentication flow (needs coordination)
- PowerSync integration (Claude handling)
- Supabase schema changes
- API routes (use server actions instead)
- Testing (later phase)
- Bo AI integration

---

## Questions?

If you need clarification:
1. Check `yokk-app/lib/powersync/schema.ts` for data structures
2. Check `CLAUDE.md` for project context
3. Leave a comment in the file if blocked

**DO NOT** modify any files outside `yokk-app/app/`, `yokk-app/components/`, or `yokk-app/lib/actions/`
