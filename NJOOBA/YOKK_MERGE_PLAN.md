# YOKK Merge Plan: GitHub → Local

**Created:** 2026-01-06
**Source:** https://github.com/MouhamedN96/YOKK
**Target:** `NJOOBA/yokk-app/`
**Phase:** 1.2 (Database Setup) per ARCHITECT.md

---

## Overview

GitHub repo has more UI components. Local has PowerSync + schema work.
**Strategy:** Pull GitHub UI, keep local infrastructure.

---

## Pre-Merge Checklist

- [ ] Backup local yokk-app
- [ ] Clone GitHub repo separately
- [ ] Compare file-by-file before overwriting
- [ ] Test after each merge phase

---

## File Comparison Matrix

### ⚠️ CONFLICTS (Same file, different content)

| File | GitHub | Local | Resolution |
|------|--------|-------|------------|
| `components/layout/header.tsx` | X-style header | Violet theme header | **KEEP LOCAL** (newer, dark mode) |
| `components/layout/sidebar.tsx` | Basic nav | Full nav + stats | **KEEP LOCAL** (more features) |
| `app/layout.tsx` | Basic layout | PowerSync provider | **KEEP LOCAL** (has providers) |
| `app/page.tsx` | Landing page | Demo with stats | **COMPARE** - may merge |
| `lib/types.ts` | GitHub types | May differ | **MERGE** both type sets |

### ✅ COPY FROM GITHUB (No conflict)

| File | Purpose | Notes |
|------|---------|-------|
| `components/feed/post-card.tsx` | Post display | Core UI |
| `components/feed/feed-content.tsx` | Feed container | Core UI |
| `components/feed/category-chips.tsx` | Filter chips | Core UI |
| `components/bo/bo-chat.tsx` | AI chat UI | Bo AI interface |
| `components/profile/profile-content.tsx` | User profile | Gamification |
| `components/profile/achievement-grid.tsx` | Badges display | Gamification |
| `components/user/xp-card.tsx` | XP display | Gamification |
| `components/voice/voice-player.tsx` | Audio playback | Voice comments |
| `components/voice/voice-recorder.tsx` | Audio record | Voice comments |
| `components/launch/product-card.tsx` | Launch display | ProductHunt-style |
| `components/launch/launch-content.tsx` | Launches page | ProductHunt-style |
| `components/launch/product-submit-form.tsx` | Submit launch | ProductHunt-style |
| `components/compose/compose-form.tsx` | Create post | Post creation |
| `components/community/community-content.tsx` | Community page | Social |
| `components/explore/explore-content.tsx` | Explore page | Discovery |
| `components/trending/trending-content.tsx` | Trending page | Discovery |
| `components/post/post-detail.tsx` | Single post | Post view |
| `components/ui/*` | UI primitives | shadcn-style |
| `components/theme-provider.tsx` | Theme context | Dark mode |

### ✅ COPY PAGES FROM GITHUB

| Page | Purpose |
|------|---------|
| `app/auth/login/page.tsx` | Login UI |
| `app/auth/sign-up/page.tsx` | Signup UI |
| `app/auth/sign-up-success/page.tsx` | Success state |
| `app/bo/page.tsx` | Bo AI page |
| `app/community/page.tsx` | Community feed |
| `app/compose/page.tsx` | Create post |
| `app/explore/page.tsx` | Explore |
| `app/launch/page.tsx` | Launches |
| `app/profile/page.tsx` | User profile |
| `app/trending/page.tsx` | Trending |

### ✅ KEEP LOCAL (Don't overwrite)

| File | Reason |
|------|--------|
| `lib/powersync/schema.ts` | **CRITICAL** - Our schema work |
| `lib/powersync/Provider.tsx` | PowerSync setup |
| `supabase/schema.sql` | **CRITICAL** - Our schema |
| `app/(main)/layout.tsx` | Our new layout |
| `components/layout/Header.tsx` | Our themed header |
| `components/layout/Sidebar.tsx` | Our full sidebar |
| `components/layout/MobileNav.tsx` | Our mobile nav |

### 🔀 MERGE (Combine both)

| File | Action |
|------|--------|
| `lib/types.ts` | Add GitHub types to local |
| `lib/demo-data.ts` | Copy if useful for testing |
| `lib/utils.ts` | Merge utility functions |
| `app/globals.css` | Compare, keep best of both |

---

## Merge Execution Steps

### Phase 1: Backup (5 min)
```bash
cd "C:\Users\momo-\OneDrive\Desktop\JOOBAL LLC\NJOOBA"
cp -r yokk-app yokk-app-backup-$(date +%Y%m%d)
```

### Phase 2: Clone GitHub (2 min)
```bash
git clone https://github.com/MouhamedN96/YOKK yokk-github-temp
```

### Phase 3: Copy UI Components (10 min)
```bash
# Create missing directories
mkdir -p yokk-app/components/{bo,community,compose,explore,feed,launch,post,profile,trending,user,voice,ui}

# Copy non-conflicting components
cp yokk-github-temp/components/feed/* yokk-app/components/feed/
cp yokk-github-temp/components/bo/* yokk-app/components/bo/
cp yokk-github-temp/components/profile/* yokk-app/components/profile/
cp yokk-github-temp/components/user/* yokk-app/components/user/
cp yokk-github-temp/components/voice/* yokk-app/components/voice/
cp yokk-github-temp/components/launch/* yokk-app/components/launch/
cp yokk-github-temp/components/compose/* yokk-app/components/compose/
cp yokk-github-temp/components/community/* yokk-app/components/community/
cp yokk-github-temp/components/explore/* yokk-app/components/explore/
cp yokk-github-temp/components/trending/* yokk-app/components/trending/
cp yokk-github-temp/components/post/* yokk-app/components/post/
cp yokk-github-temp/components/ui/* yokk-app/components/ui/
cp yokk-github-temp/components/theme-provider.tsx yokk-app/components/
```

### Phase 4: Copy Pages (5 min)
```bash
# Create page directories
mkdir -p yokk-app/app/{auth/login,auth/sign-up,auth/sign-up-success,bo,community,compose,explore,launch,profile,trending}

# Copy pages
cp yokk-github-temp/app/auth/login/page.tsx yokk-app/app/auth/login/
cp yokk-github-temp/app/auth/sign-up/page.tsx yokk-app/app/auth/sign-up/
cp yokk-github-temp/app/auth/sign-up-success/page.tsx yokk-app/app/auth/sign-up-success/
cp yokk-github-temp/app/bo/page.tsx yokk-app/app/bo/
cp yokk-github-temp/app/community/page.tsx yokk-app/app/community/
cp yokk-github-temp/app/compose/page.tsx yokk-app/app/compose/
cp yokk-github-temp/app/explore/page.tsx yokk-app/app/explore/
cp yokk-github-temp/app/launch/page.tsx yokk-app/app/launch/
cp yokk-github-temp/app/profile/page.tsx yokk-app/app/profile/
cp yokk-github-temp/app/trending/page.tsx yokk-app/app/trending/
```

### Phase 5: Merge Lib Files (10 min)
```bash
# Copy demo data
cp yokk-github-temp/lib/demo-data.ts yokk-app/lib/

# MANUALLY MERGE these (don't overwrite):
# - lib/types.ts (add new types to existing)
# - lib/utils.ts (add new utils to existing)
```

### Phase 6: Fix Imports (15 min)

**Common import fixes needed:**

```typescript
// GitHub uses relative imports like:
import { PostCard } from '@/components/feed/post-card'

// May need to match local conventions:
import { PostCard } from '../../components/feed/post-card'
```

**Check for:**
1. `@/` alias - ensure `tsconfig.json` has path mapping
2. Component naming (kebab-case vs PascalCase)
3. Missing dependencies in `package.json`

### Phase 7: Verify Dependencies (5 min)
```bash
cd yokk-app

# Check for missing deps used by GitHub components
grep -rh "from ['\"]" components/ | sort | uniq | grep -v "\./" | grep -v "react"

# Install any missing
pnpm add <missing-package>
```

### Phase 8: Test Build (5 min)
```bash
cd yokk-app
pnpm build
```

### Phase 9: Cleanup
```bash
rm -rf yokk-github-temp
```

---

## Potential Import Errors to Watch

| Error Pattern | Fix |
|---------------|-----|
| `Module not found: @/components` | Add `"@/*": ["*"]` to tsconfig paths |
| `Module not found: lucide-react` | `pnpm add lucide-react` |
| `Module not found: framer-motion` | `pnpm add framer-motion` |
| `Module not found: @radix-ui/*` | `pnpm add @radix-ui/react-*` |
| `Cannot find module 'clsx'` | `pnpm add clsx` |
| `Cannot find module 'tailwind-merge'` | `pnpm add tailwind-merge` |

---

## Path Conflicts to Resolve

| Issue | Resolution |
|-------|------------|
| `app/(main)/` vs `app/` routes | Keep both - `(main)` for authed routes |
| `components/layout/` casing | Standardize to kebab-case |
| `Header.tsx` vs `header.tsx` | Keep local `Header.tsx` (PascalCase) |
| Duplicate page.tsx files | Local `(main)/page.tsx` = authed, root `page.tsx` = landing |

---

## Schema Alignment Check

GitHub schema fields must match local PowerSync schema:

**Verify these match:**
- `profiles` table columns
- `posts` table columns  
- `comments` table columns
- `upvotes` table columns
- `launches` table columns
- `achievements` table columns

If mismatch: **Keep local schema, adapt GitHub components.**

---

## Post-Merge Verification

- [ ] `pnpm dev` runs without errors
- [ ] All pages load: `/`, `/community`, `/explore`, `/launch`, `/profile`, `/bo`
- [ ] Auth pages render: `/auth/login`, `/auth/sign-up`
- [ ] Dark mode toggle works
- [ ] No TypeScript errors: `pnpm tsc --noEmit`
- [ ] PowerSync still initializes (check console)

---

## Rollback Plan

If merge fails:
```bash
rm -rf yokk-app
mv yokk-app-backup-* yokk-app
```

---

## Time Estimate

| Phase | Time |
|-------|------|
| Backup + Clone | 7 min |
| Copy files | 15 min |
| Fix imports | 15 min |
| Test + Debug | 20 min |
| **Total** | **~1 hour** |

---

## Files Reference

**GitHub Repo:** https://github.com/MouhamedN96/YOKK
**ARCHITECT.md:** Design philosophy + constraints
**Notion Tracker:** https://www.notion.so/2e1b7dd11755812fb694c14fdaff539b

---

## Next Session Command

```bash
# Start merge
cd "C:\Users\momo-\OneDrive\Desktop\JOOBAL LLC\NJOOBA"
cat YOKK_MERGE_PLAN.md
# Follow steps above
```
