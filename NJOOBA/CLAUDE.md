# NJOOBA Project Context for Claude

## Company Identity

**NJOOBA LLC** (previously JOOBAL LLC) - African-focused tech company building products optimized for emerging market constraints.

**Mission:** Build technology that works for Africa - offline-first, data-efficient, mobile-money native.

**Primary Market:** Senegal (French/Wolof), Secondary: Nigeria (English)

---

## Products

### 1. BOBO - Social Commerce OS
**Tagline:** "TikTok Shop for African SMBs"

**Platform:** React Native + Expo 54 (Mobile-first)

**Core Features:**
- Livestream QR Commerce - Show QR during TikTok/IG live → instant checkout
- Mobile Money Integration (Orange Money, Wave)
- Offline-first with PowerSync
- Delivery coordination for last-mile
- Merchant dashboard with analytics

**User Roles:**
- `customer` - Buyers browsing and purchasing
- `merchant` - Sellers listing products and going live
- `delivery` - Delivery personnel handling orders
- `admin` - Platform administrators

**Tech Stack:**
- Frontend: React Native, Expo 54, NativeWind
- Backend: Supabase (PostgreSQL + Auth + Realtime)
- Offline Sync: PowerSync
- Payments: Orange Money API, Wave API
- Storage: Supabase Storage (AVIF optimized)

### 2. YOKK - AI-Native Dev Community
**Tagline:** "Dev.to meets Product Hunt for Africa"

**Platform:** Next.js 15 PWA (Web-first)

**Core Features:**
- Community posts, questions, discussions
- Product launches and showcases
- Gamification (XP, levels, streaks, achievements)
- Aggregated dev feed (Dev.to, HN, GitHub trending)
- AI-powered content assistance

**User Model:**
- Username-based authentication
- Gamification profile (level, xp, streak_days)
- Reputation through helpful answers

**Tech Stack:**
- Frontend: Next.js 15, React 19, Tailwind CSS
- Backend: Supabase
- Offline Sync: PowerSync Web
- AI: Groq (fast inference)

---

## Architecture Overview

```
NJOOBA/
├── bobo-app/                    # React Native (Social Commerce)
│   ├── src/
│   │   ├── lib/powersync/       # Offline sync schema
│   │   ├── services/            # Business logic
│   │   │   └── livestream.service.ts
│   │   ├── screens/             # React Native screens
│   │   │   └── merchant/
│   │   │       ├── LivestreamControlsScreen.tsx
│   │   │       └── LivestreamAnalyticsScreen.tsx
│   │   └── contexts/            # React contexts (Auth, etc.)
│   ├── supabase/
│   │   └── schema.sql           # Commerce-focused schema
│   └── web/overlay/             # OBS browser source
│       └── index.html
│
├── yokk-app/                    # Next.js PWA (Dev Community)
│   ├── app/                     # App router pages
│   ├── lib/
│   │   ├── powersync/           # Offline sync schema
│   │   └── supabase/            # Supabase client
│   ├── components/              # React components
│   └── supabase/
│       └── schema.sql           # Community-focused schema
│
└── packages/shared/             # Minimal shared utilities
    └── src/
        ├── utils/               # formatCFA, formatPhone, validators
        └── types/               # Common TypeScript types
```

---

## Key Technical Decisions

### 1. Separate Schemas
BOBO and YOKK have **completely separate** Supabase schemas optimized for their domains:
- BOBO: Phone-based auth, commerce tables (orders, products, delivery)
- YOKK: Username-based auth, community tables (posts, comments, gamification)

### 2. Offline-First Architecture
Both apps use PowerSync for offline capability:
- BOBO: Critical for unreliable African networks, 2G/3G support
- YOKK: PWA with service worker caching

### 3. Currency
All prices in **CFA Franc (XOF)** - no decimals, formatted as "1 000 FCFA"

### 4. Authentication
- BOBO: Phone number (SMS OTP) - standard in Africa
- YOKK: Email/Username - dev community preference

### 5. Payment Methods
BOBO supports:
- `orange_money` - Orange Money (Senegal primary)
- `wave` - Wave (popular in Senegal)
- `cash` - Cash on delivery

---

## African Market Constraints

### Network Conditions
- Assume 2G/3G as baseline
- Design for high latency (500ms+)
- Minimize payload sizes
- Offline-first is mandatory

### Data Costs
- Users have ~500MB monthly budgets
- Compress aggressively (AVIF images, Opus audio)
- Cache everything possible
- Avoid unnecessary fetches

### Device Constraints
- Many users on budget Android phones
- Optimize for low RAM (< 2GB)
- Reduce bundle sizes
- Avoid heavy animations

### Payment Reality
- Credit cards are rare (~5% penetration)
- Mobile money is dominant (Orange Money, Wave)
- Cash on delivery still common
- Always offer multiple payment options

---

## Code Conventions

### File Naming
- Components: `PascalCase.tsx`
- Services: `kebab-case.service.ts`
- Utilities: `kebab-case.ts`
- Types: `kebab-case.types.ts`

### React Native (BOBO)
- Use NativeWind for styling
- Prefer `StyleSheet.create` for performance
- Use `expo-*` packages when available
- Test on low-end Android devices

### Next.js (YOKK)
- Use App Router (not Pages)
- Server Components by default
- Client Components only when needed
- Use `next/image` for optimization

### TypeScript
- Strict mode enabled
- No `any` without justification
- Export types from dedicated files
- Use Zod for runtime validation

---

## Important Files

### BOBO
- `bobo-app/src/lib/powersync/schema.ts` - PowerSync table definitions
- `bobo-app/supabase/schema.sql` - Database schema
- `bobo-app/src/services/livestream.service.ts` - Live commerce logic
- `bobo-app/app.json` - Expo configuration

### YOKK
- `yokk-app/lib/powersync/schema.ts` - PowerSync table definitions
- `yokk-app/supabase/schema.sql` - Database schema
- `yokk-app/app/layout.tsx` - Root layout

### Shared
- `packages/shared/src/utils/formatters.ts` - formatCFA, formatPhone
- `packages/shared/src/types/common.ts` - Shared TypeScript types

---

## Environment Variables

### BOBO (React Native - @env)
```
SUPABASE_URL=
SUPABASE_ANON_KEY=
BOBO_WEB_URL=https://bobo.sn
ORANGE_MONEY_API_KEY=
WAVE_API_KEY=
```

### YOKK (Next.js - process.env)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GROQ_API_KEY=
```

---

## Commands

### BOBO
```bash
cd bobo-app
npx expo start                    # Start dev server
npx expo run:android              # Run on Android
npx expo run:ios                  # Run on iOS
supabase db push                  # Apply migrations
supabase gen types typescript     # Generate types
```

### YOKK
```bash
cd yokk-app
pnpm dev                          # Start dev server
pnpm build                        # Production build
pnpm lint                         # Run linter
supabase db push                  # Apply migrations
```

---

## Current Status (2026-01-06)

### Completed
- ✅ Separate Supabase schemas for BOBO and YOKK
- ✅ Separate PowerSync schemas
- ✅ Shared utilities package
- ✅ BOBO livestream service
- ✅ BOBO LivestreamControlsScreen (React Native)
- ✅ BOBO LivestreamAnalyticsScreen (React Native)
- ✅ BOBO OBS web overlay

### In Progress
- 🔄 Cleanup YOKK (remove misplaced livestream code)

### TODO
- [ ] Apply Supabase migrations
- [ ] Configure PowerSync sync rules
- [ ] Set up CI/CD pipelines
- [ ] Add payment integrations
- [ ] Implement delivery tracking

---

## Session Handoff

See `SESSION_HANDOFF.md` for detailed handoff documentation including:
- Exact file locations
- Code snippets to continue
- Step-by-step remaining tasks

---

## Contact

**CTO:** The user in this conversation
**Company:** NJOOBA LLC (JOOBAL LLC)
**Location:** Based in Senegal
